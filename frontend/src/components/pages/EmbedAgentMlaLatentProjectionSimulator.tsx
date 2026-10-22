import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMlaLatentProjection,
  MlaLatentProjectionInputs,
  MlaModelArchitecture,
  AttentionMechanismType,
  MlaPrecisionMode
} from '../calculator/agentMlaLatentProjectionModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMlaLatentProjectionSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<MlaModelArchitecture>('deepseek_v3_671b');
  const [attentionMechanism, setAttentionMechanism] = useState<AttentionMechanismType>('mla_low_rank_latent');
  const [precisionMode, setPrecisionMode] = useState<MlaPrecisionMode>('fp8');
  const contextLength = 131072; // 128k tokens
  const latentVectorDimension = 512;
  const decoupledRopeDimension = 64;

  const inputs: MlaLatentProjectionInputs = useMemo(() => ({
    modelArchitecture,
    attentionMechanism,
    contextLength,
    latentVectorDimension,
    decoupledRopeDimension,
    precisionMode,
    currency: 'USD'
  }), [
    modelArchitecture,
    attentionMechanism,
    contextLength,
    latentVectorDimension,
    decoupledRopeDimension,
    precisionMode
  ]);

  const results = useMemo(() => calculateMlaLatentProjection(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Multi-Head Latent Attention Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-mla-latent-projection-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-teal-950/80 border border-teal-800/60 text-teal-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Multi-Head Latent Attention Simulator</h2>
            <p className="text-[11px] text-slate-400">Low-Rank KV Projections · Decoupled RoPE · 90% VRAM Cut</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
          Tool #72
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as MlaModelArchitecture)}
            aria-label="Target Foundation Model"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="deepseek_v3_671b">DeepSeek-V3 671B (MLA Native 512-Dim Latent)</option>
            <option value="deepseek_r1_reasoning">DeepSeek-R1 (Reasoning Swarms + MLA)</option>
            <option value="sovereign_100b_mla">Sovereign 100B MLA (Air-Gapped Private VPC)</option>
            <option value="llama_3_1_70b_gqa_comp">Llama 3.1 70B (GQA Baseline Reference)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Attention Mechanism</label>
          <select
            value={attentionMechanism}
            onChange={(e) => setAttentionMechanism(e.target.value as AttentionMechanismType)}
            aria-label="Attention Mechanism"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="mla_low_rank_latent">Multi-Head Latent Attention (MLA Low-Rank)</option>
            <option value="gqa_grouped_query">Grouped-Query Attention (GQA 8-Group Baseline)</option>
            <option value="mha_standard_multi_head">Standard Multi-Head Attention (MHA Full)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Quantization Precision</label>
          <select
            value={precisionMode}
            onChange={(e) => setPrecisionMode(e.target.value as MlaPrecisionMode)}
            aria-label="Quantization Precision"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="fp8">FP8 Latent KV (1 Byte/Element - Optimal)</option>
            <option value="fp16">FP16 Uncompressed Latent (2 Bytes/Element)</option>
            <option value="int4">INT4 Aggressive Quantization (0.5 Bytes/Element)</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Active KV Footprint</div>
          <div className="text-sm font-bold text-slate-200">
            {attentionMechanism === 'mla_low_rank_latent'
              ? `${results.mlaCompressedKvGb} GB`
              : attentionMechanism === 'gqa_grouped_query'
              ? `${results.gqaEquivalentKvGb} GB`
              : `${results.uncompressedMhaKvGb} GB`}
          </div>
          <div className="text-[10px] text-slate-500">Per 128k Stream</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">VRAM Compression</div>
          <div className="text-sm font-bold text-teal-400">{results.vramCompressionFactor}x</div>
          <div className="text-[10px] text-slate-500">{results.vramReclaimedGb} GB Saved</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Stream Concurrency</div>
          <div className="text-sm font-bold text-emerald-400">{results.maxConcurrentStreamsPerNode} streams</div>
          <div className="text-[10px] text-slate-500">Per 8-GPU Node</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Hardware TCO Savings</div>
          <div className="text-sm font-bold text-cyan-400">{results.formattedHardwareSavings}</div>
          <div className="text-[10px] text-slate-500">Cluster CapEx Delta</div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Powered by Elesium Sovereign Systems</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-mla-latent-projection-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-teal-400 hover:text-teal-300 font-medium"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
