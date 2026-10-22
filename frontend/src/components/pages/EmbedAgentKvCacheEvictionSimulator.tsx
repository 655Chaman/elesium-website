import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateKvCacheEviction,
  KvCacheEvictionInputs,
  EvictionModelArchitecture,
  EvictionStrategy,
  EvictionGpuTopology
} from '../calculator/agentKvCacheEvictionModel';
import { HardDriveDownload, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentKvCacheEvictionSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<EvictionModelArchitecture>('llama_3_1_70b');
  const [evictionStrategy, setEvictionStrategy] = useState<EvictionStrategy>('h2o_heavy_hitter_dynamic');
  const [gpuClusterTopology] = useState<EvictionGpuTopology>('nvidia_h100_sxm5');
  const contextLength = 262144; // 256k tokens
  const attentionSinkTokens = 4;
  const heavyHitterBudgetTokens = 2048;
  const slidingWindowTokens = 4096;

  const inputs: KvCacheEvictionInputs = useMemo(() => ({
    modelArchitecture,
    evictionStrategy,
    contextLength,
    attentionSinkTokens,
    heavyHitterBudgetTokens,
    slidingWindowTokens,
    gpuClusterTopology,
    currency: 'USD'
  }), [
    modelArchitecture,
    evictionStrategy,
    contextLength,
    attentionSinkTokens,
    heavyHitterBudgetTokens,
    slidingWindowTokens,
    gpuClusterTopology
  ]);

  const results = useMemo(() => calculateKvCacheEviction(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: KV-Cache Eviction &amp; Attention Sink Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-kv-cache-eviction-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <HardDriveDownload className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">KV-Cache Eviction &amp; Attention Sink Simulator</h2>
            <p className="text-[11px] text-slate-400">H2O Heavy Hitters · Attention Sinks · 4x Compression</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tool #70
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as EvictionModelArchitecture)}
            aria-label="Target Foundation Model"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="llama_3_1_70b">Llama 3.1 70B (Enterprise Workhorse)</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (MLA Compression)</option>
            <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematics)</option>
            <option value="sovereign_100b_agent">Sovereign 100B Swarm (Air-Gapped Private VPC)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Eviction Strategy</label>
          <select
            value={evictionStrategy}
            onChange={(e) => setEvictionStrategy(e.target.value as EvictionStrategy)}
            aria-label="Eviction Strategy"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="h2o_heavy_hitter_dynamic">H2O Heavy Hitter Dynamic (Sinks + Heavy + Window)</option>
            <option value="streamingllm_sink_window">StreamingLLM (4 Sinks + Sliding Window)</option>
            <option value="static_sliding_window">Static Window (No Sinks - Perplexity Collapse)</option>
            <option value="uncompressed_full_cache">Uncompressed Full Cache (OOM Baseline)</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Compression Ratio</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {results.memoryCompressionRatio}x
          </span>
          <span className="text-[10px] text-slate-500 block">VRAM footprint cut</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Active KV Memory</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">
            {results.compressedKvMemoryGb} GB
          </span>
          <span className="text-[10px] text-slate-500 block">Down from {results.uncompressedKvMemoryGb} GB</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">VRAM Freed</span>
          <span className="text-lg font-bold text-indigo-400 font-mono">
            {results.effectiveVramSavedGb} GB
          </span>
          <span className="text-[10px] text-slate-500 block">HBM3 capacity reclaimed</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Perplexity Impact</span>
          <span className={`text-lg font-bold font-mono ${
            results.perplexityDegradationPercent > 10.0 ? 'text-rose-400' : 'text-amber-400'
          }`}>
            {results.perplexityDegradationPercent > 100.0 ? '>1000%' : `+${results.perplexityDegradationPercent}%`}
          </span>
          <span className="text-[10px] text-slate-500 block">Generation degradation</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Powered by <strong className="text-slate-300">Elesium Architecture</strong></span>
        <a
          href="https://elesium.online/tools/enterprise-agent-kv-cache-eviction-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
