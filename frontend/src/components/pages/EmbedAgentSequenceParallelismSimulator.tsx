import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateSequenceParallelism,
  SequenceParallelismInputs,
  ModelArchitecture,
  SpDegree,
  InterconnectType,
  RingMode
} from '../calculator/agentSequenceParallelismModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentSequenceParallelismSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_1_70b');
  const [spDegree, setSpDegree] = useState<SpDegree>(8);
  const [totalContextTokens, setTotalContextTokens] = useState<number>(262144);
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [ringMode, setRingMode] = useState<RingMode>('async_p2p_overlap');

  const inputs: SequenceParallelismInputs = useMemo(() => ({
    modelArchitecture,
    spDegree,
    totalContextTokens,
    interconnect,
    ringMode,
    currency: 'USD'
  }), [
    modelArchitecture,
    spDegree,
    totalContextTokens,
    interconnect,
    ringMode
  ]);

  const results = useMemo(() => calculateSequenceParallelism(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Sequence Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-sequence-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Sequence Parallelism Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Ring Self-Attention · P2P KV Overlap · 1M+ Context Token Inference
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_10MS_1M_OPTIMAL'
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
              onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="llama_3_1_70b">Llama-3.1-70B</option>
              <option value="deepseek_v2_236b">DeepSeek-V2 MoE</option>
              <option value="qwen_2_5_72b">Qwen-2.5-72B</option>
              <option value="mistral_large_123b">Mistral-Large-123B</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Ring Mode</label>
            <select
              value={ringMode}
              onChange={(e) => setRingMode(e.target.value as RingMode)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="async_p2p_overlap">Async P2P Overlap</option>
              <option value="double_buffered_ring">Double-Buffered Ring</option>
              <option value="blocking_synchronous">Synchronous Ring</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Interconnect Fabric</label>
            <select
              value={interconnect}
              onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="nvlink_4_900gb">NVLink 4.0 (900 GB/s)</option>
              <option value="nvlink_3_600gb">NVLink 3.0 (600 GB/s)</option>
              <option value="infiniband_ndr_400gb">InfiniBand NDR (400 GB/s)</option>
              <option value="pcie_gen5_128gb">PCIe Gen5 (128 GB/s)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">SP Degree</label>
            <select
              value={spDegree}
              onChange={(e) => setSpDegree(Number(e.target.value) as SpDegree)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value={2}>SP-2 (2 GPUs)</option>
              <option value={4}>SP-4 (4 GPUs)</option>
              <option value={8}>SP-8 (8 GPUs)</option>
              <option value={16}>SP-16 (16 GPUs)</option>
              <option value={32}>SP-32 (32 GPUs)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Total Context Tokens</span>
            <span className="text-cyan-400 font-mono">{totalContextTokens.toLocaleString()} tokens</span>
          </div>
          <input
            type="range"
            min={16384}
            max={1048576}
            step={16384}
            value={totalContextTokens}
            onChange={(e) => setTotalContextTokens(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800"
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
          <div className="text-[9px] text-slate-500">P2P Network</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Per-GPU VRAM</div>
          <div className="text-lg font-black text-indigo-400 font-mono">{results.peakKvVramGb}GB</div>
          <div className="text-[9px] text-slate-500">KV Cache Limit</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-sequence-parallelism-simulator"
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
