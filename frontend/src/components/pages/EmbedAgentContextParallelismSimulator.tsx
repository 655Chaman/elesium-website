import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateContextParallelism,
  ContextParallelismInputs,
  CpModelArchitecture,
  CpDegree,
  CpInterconnectType,
  CpAttentionMechanism
} from '../calculator/agentContextParallelismModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentContextParallelismSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<CpModelArchitecture>('llama_3_1_70b_128k');
  const [cpDegree, setCpDegree] = useState<CpDegree>(8);
  const [sequenceLengthTokens, setSequenceLengthTokens] = useState<number>(524288);
  const [interconnect, setInterconnect] = useState<CpInterconnectType>('nvlink_4_900gb');
  const [attentionMechanism, setAttentionMechanism] = useState<CpAttentionMechanism>('ring_attention');
  const causalMasking = true;

  const inputs: ContextParallelismInputs = useMemo(() => ({
    modelArchitecture,
    cpDegree,
    sequenceLengthTokens,
    interconnect,
    attentionMechanism,
    causalMasking,
    currency: 'USD'
  }), [
    modelArchitecture,
    cpDegree,
    sequenceLengthTokens,
    interconnect,
    attentionMechanism
  ]);

  const results = useMemo(() => calculateContextParallelism(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Context Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-context-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Context Parallelism Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Ring Attention · Distributed KV Sharding · Sub-12ms 2M-Token Steps
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_12MS_CP_OPTIMAL'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
        }`}>
          {results.slaStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Architecture</label>
            <select
              value={modelArchitecture}
              onChange={(e) => setModelArchitecture(e.target.value as CpModelArchitecture)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="llama_3_1_70b_128k">Llama-3.1 70B</option>
              <option value="deepseek_v3_128k">DeepSeek-V3 671B</option>
              <option value="mistral_large_128k">Mistral-Large</option>
              <option value="custom_sovereign_2m">Sovereign 2M</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Attention Mechanism</label>
            <select
              value={attentionMechanism}
              onChange={(e) => setAttentionMechanism(e.target.value as CpAttentionMechanism)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="ring_attention">Ring Attention</option>
              <option value="deepspeed_ulysses">DeepSpeed Ulysses</option>
              <option value="hybrid_ring_ulysses">Hybrid Ring-Ulysses</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Interconnect</label>
            <select
              value={interconnect}
              onChange={(e) => setInterconnect(e.target.value as CpInterconnectType)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="nvlink_4_900gb">NVLink 4.0 (900 GB/s)</option>
              <option value="nvlink_3_600gb">NVLink 3.0 (600 GB/s)</option>
              <option value="infiniband_ndr_400gb">InfiniBand NDR (400 Gbps)</option>
              <option value="pcie_gen5_128gb">PCIe Gen5 (128 GB/s)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">CP Degree</label>
            <select
              value={cpDegree}
              onChange={(e) => setCpDegree(Number(e.target.value) as CpDegree)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value={2}>CP-2 (2 GPUs)</option>
              <option value={4}>CP-4 (4 GPUs)</option>
              <option value={8}>CP-8 (8 GPUs)</option>
              <option value={16}>CP-16 (16 GPUs)</option>
              <option value={32}>CP-32 (32 GPUs)</option>
              <option value={64}>CP-64 (64 GPUs)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Sequence Horizon</span>
            <span className="text-teal-400 font-mono">
              {(sequenceLengthTokens / 1024).toFixed(0)}k tokens
            </span>
          </div>
          <input
            type="range"
            min={131072}
            max={2097152}
            step={65536}
            value={sequenceLengthTokens}
            onChange={(e) => setSequenceLengthTokens(Number(e.target.value))}
            className="w-full accent-teal-500 bg-slate-800"
          />
        </div>
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Step Latency</div>
          <div className="text-lg font-black text-cyan-400 font-mono">{results.effectiveStepLatencyMs}ms</div>
          <div className="text-[9px] text-slate-500">P99 Forward Step</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Overlap Ratio</div>
          <div className="text-lg font-black text-teal-400 font-mono">{results.commOverlapEfficiencyPercent}%</div>
          <div className="text-[9px] text-slate-500">P2P Wire Overlap</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Sharded VRAM</div>
          <div className="text-lg font-black text-emerald-400 font-mono">{results.shardedKvMemoryGb}GB</div>
          <div className="text-[9px] text-slate-500">Per GPU KV</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-context-parallelism-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-0.5"
        >
          Open Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
