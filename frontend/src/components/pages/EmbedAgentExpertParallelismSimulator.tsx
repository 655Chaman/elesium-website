import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateExpertParallelism,
  ExpertParallelismInputs,
  ModelArchitecture,
  EpDegree,
  InterconnectType,
  DispatchMode
} from '../calculator/agentExpertParallelismModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentExpertParallelismSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('deepseek_v2_236b');
  const [epDegree, setEpDegree] = useState<EpDegree>(8);
  const [totalExperts, setTotalExperts] = useState<number>(64);
  const [topK, setTopK] = useState<number>(2);
  const batchSize = 32;
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [dispatchMode, setDispatchMode] = useState<DispatchMode>('async_alltoall_overlap');

  const inputs: ExpertParallelismInputs = useMemo(() => ({
    modelArchitecture,
    epDegree,
    totalExperts,
    topK,
    batchSize,
    interconnect,
    dispatchMode,
    currency: 'USD'
  }), [
    modelArchitecture,
    epDegree,
    totalExperts,
    topK,
    batchSize,
    interconnect,
    dispatchMode
  ]);

  const results = useMemo(() => calculateExpertParallelism(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Expert Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-expert-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-950/80 border border-violet-800/60 text-violet-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Expert Parallelism Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              MoE Routing · All-to-All Dispatch Overlap · Sub-8ms Sparse Inference
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_8MS_MOE_OPTIMAL'
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
              <option value="deepseek_v2_236b">DeepSeek-V2 MoE</option>
              <option value="deepseek_v3_671b">DeepSeek-V3 MoE</option>
              <option value="mixtral_8x22b">Mixtral-8x22B</option>
              <option value="qwen_2_5_moe">Qwen-2.5-MoE</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Dispatch Mode</label>
            <select
              value={dispatchMode}
              onChange={(e) => setDispatchMode(e.target.value as DispatchMode)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="async_alltoall_overlap">Async All-to-All</option>
              <option value="two_stage_packed">Two-Stage Packed</option>
              <option value="blocking_alltoall">Blocking Collective</option>
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
            <label className="text-[11px] text-slate-400 block mb-1">EP Degree</label>
            <select
              value={epDegree}
              onChange={(e) => setEpDegree(Number(e.target.value) as EpDegree)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value={2}>EP-2 (2 GPUs)</option>
              <option value={4}>EP-4 (4 GPUs)</option>
              <option value={8}>EP-8 (8 GPUs)</option>
              <option value={16}>EP-16 (16 GPUs)</option>
              <option value={32}>EP-32 (32 GPUs)</option>
              <option value={64}>EP-64 (64 GPUs)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Total Experts</span>
              <span className="text-violet-400 font-mono">{totalExperts}</span>
            </div>
            <input
              type="range"
              min={8}
              max={256}
              step={8}
              value={totalExperts}
              onChange={(e) => setTotalExperts(Number(e.target.value))}
              className="w-full accent-violet-500 bg-slate-800"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Top-k Active</span>
              <span className="text-fuchsia-400 font-mono">k={topK}</span>
            </div>
            <input
              type="range"
              min={1}
              max={8}
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              className="w-full accent-fuchsia-500 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Step Latency</div>
          <div className="text-lg font-black text-violet-400 font-mono">{results.effectiveStepLatencyMs}ms</div>
          <div className="text-[9px] text-slate-500">P99 Forward Step</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Overlap Ratio</div>
          <div className="text-lg font-black text-teal-400 font-mono">{results.commOverlapEfficiencyPercent}%</div>
          <div className="text-[9px] text-slate-500">All-to-All Wire</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Experts / GPU</div>
          <div className="text-lg font-black text-cyan-400 font-mono">{results.expertsPerGpu}</div>
          <div className="text-[9px] text-slate-500">Local Shards</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-expert-parallelism-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-400 hover:text-violet-300 font-semibold inline-flex items-center gap-0.5"
        >
          Open Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
