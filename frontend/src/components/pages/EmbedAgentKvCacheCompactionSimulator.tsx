import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateKvCacheCompaction,
  KvCacheCompactionInputs,
  FoundationModel,
  GpuClusterType
} from '../calculator/agentKvCacheCompactionModel';
import { HardDrive, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentKvCacheCompactionSimulator() {
  const [foundationModel, setFoundationModel] = useState<FoundationModel>('llama_3_70b');
  const [gpuClusterType, setGpuClusterType] = useState<GpuClusterType>('nvidia_h100_sxm5_80gb');
  const numGpus = 8;
  const [activeConcurrencyStreams, setActiveConcurrencyStreams] = useState<number>(128);
  const [compactionThresholdPercent, setCompactionThresholdPercent] = useState<number>(25);

  const inputs: KvCacheCompactionInputs = useMemo(() => ({
    foundationModel,
    gpuClusterType,
    numGpus,
    activeConcurrencyStreams,
    compactionThresholdPercent,
    pageSizeTokens: 16,
    currency: 'USD'
  }), [
    foundationModel,
    gpuClusterType,
    numGpus,
    activeConcurrencyStreams,
    compactionThresholdPercent
  ]);

  const results = useMemo(() => calculateKvCacheCompaction(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: KV-Cache Memory Compaction Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-kvcache-memory-compaction-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              KV-Cache Compaction Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Paged Block Compaction · Zero-Copy cuMemMap Defragmentation
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-400">
          MEMORY FINOPS
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            Serving Model
          </label>
          <select
            value={foundationModel}
            onChange={(e) => setFoundationModel(e.target.value as FoundationModel)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="llama_3_70b">Llama-3-70B</option>
            <option value="deepseek_v2_236b">DeepSeek-V2-236B</option>
            <option value="qwen_2_5_72b">Qwen-2.5-72B</option>
            <option value="mistral_large_123b">Mistral-Large-123B</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            GPU Node Architecture
          </label>
          <select
            value={gpuClusterType}
            onChange={(e) => setGpuClusterType(e.target.value as GpuClusterType)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          >
            <option value="nvidia_h100_sxm5_80gb">8x H100 SXM5 80GB</option>
            <option value="nvidia_b200_nvl_192gb">8x B200 NVL 192GB</option>
            <option value="nvidia_a100_80gb">8x A100 80GB</option>
            <option value="nvidia_l40s_48gb">8x L40S 48GB</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Concurrent Streams</span>
            <span className="text-sky-400 font-mono">{activeConcurrencyStreams} Streams</span>
          </div>
          <input
            type="range"
            min="32"
            max="512"
            step="16"
            value={activeConcurrencyStreams}
            onChange={(e) => setActiveConcurrencyStreams(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Compaction Trigger Threshold</span>
            <span className="text-emerald-400 font-mono">{compactionThresholdPercent}% Fragmentation</span>
          </div>
          <input
            type="range"
            min="10"
            max="45"
            step="5"
            value={compactionThresholdPercent}
            onChange={(e) => setCompactionThresholdPercent(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>
      </div>

      {/* Telemetry Output Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
            Concurrency Multiplier
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {results.concurrencyMultiplier}x
          </div>
          <div className="text-[10px] text-slate-400">
            {results.maxConcurrentStreams} max streams
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
            Compacted Frag
          </div>
          <div className="text-xl font-bold font-mono text-sky-400">
            {results.compactedFragmentationPercent}%
          </div>
          <div className="text-[10px] text-slate-400">
            from {results.rawFragmentationPercent}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
            Recovered HBM
          </div>
          <div className="text-xl font-bold font-mono text-purple-400">
            {results.recoveredHbmGigabytes} GB
          </div>
          <div className="text-[10px] text-slate-400">
            of {results.totalClusterHbmGb} GB HBM
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
            FinOps Savings
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {results.annualFinOpsSavings}
          </div>
          <div className="text-[10px] text-slate-400">
            OOM: {results.oomCrashProbabilityPercent}%
          </div>
        </div>
      </div>

      {/* Watermark Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span>Engineered by Elesium Research</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition-colors"
        >
          Deploy Sovereign Agents <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
