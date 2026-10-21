import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculatePrefixCaching,
  PrefixCachingInputs,
  ModelArchitecture,
  CacheEvictionPolicy,
  HardwareCluster
} from '../calculator/agentPrefixCachingModel';
import { Layers, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentPrefixCachingSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [sharedPrefixTokens, setSharedPrefixTokens] = useState<number>(4096);
  const [uniqueQueryTokens, setUniqueQueryTokens] = useState<number>(512);
  const [concurrentStreams, setConcurrentStreams] = useState<number>(32);
  const [cacheEvictionPolicy, setCacheEvictionPolicy] = useState<CacheEvictionPolicy>('radix_tree_lru');
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: PrefixCachingInputs = useMemo(() => ({
    modelArchitecture,
    sharedPrefixTokens,
    uniqueQueryTokens,
    concurrentStreams,
    cacheEvictionPolicy,
    hardwareCluster,
    currency: 'USD'
  }), [
    modelArchitecture,
    sharedPrefixTokens,
    uniqueQueryTokens,
    concurrentStreams,
    cacheEvictionPolicy,
    hardwareCluster
  ]);

  const results = useMemo(() => calculatePrefixCaching(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: KV Cache Prefix Caching Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-kvcache-prefix-caching-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              KV Cache Prefix Caching Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Radix Attention · Zero-Copy Memory · TTFT Acceleration
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-400">
          RADIX TRIE
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div>
          <label className="text-slate-400 block mb-1">FOUNDATION MODEL</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
          >
            <option value="llama_3_70b">Llama-3 70B</option>
            <option value="deepseek_r1_671b">DeepSeek-R1 671B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
            <option value="mistral_large_123b">Mistral Large 123B</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">EVICTION POLICY</label>
          <select
            value={cacheEvictionPolicy}
            onChange={(e) => setCacheEvictionPolicy(e.target.value as CacheEvictionPolicy)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
          >
            <option value="radix_tree_lru">Radix Tree LRU</option>
            <option value="frequency_weighted">Frequency Weighted</option>
            <option value="fifo_stream">FIFO Stream</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>SHARED PREFIX TOKENS:</span>
            <span className="text-sky-400 font-bold">{sharedPrefixTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="256"
            max="32768"
            step="256"
            value={sharedPrefixTokens}
            onChange={(e) => setSharedPrefixTokens(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>UNIQUE QUERY TOKENS:</span>
            <span className="text-teal-400 font-bold">{uniqueQueryTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="64"
            max="4096"
            step="64"
            value={uniqueQueryTokens}
            onChange={(e) => setUniqueQueryTokens(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-teal-400"
          />
        </div>

        <div>
          <span className="text-slate-400 block mb-1">CONCURRENT AGENT STREAMS</span>
          <div className="grid grid-cols-4 gap-1">
            {[8, 32, 64, 128].map((s) => (
              <button
                key={s}
                onClick={() => setConcurrentStreams(s)}
                className={`py-1 rounded text-[11px] font-mono border ${
                  concurrentStreams === s
                    ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-slate-400">PREFIX HIT</div>
          <div className="text-base font-bold text-sky-400">
            {results.prefixHitRatePercent}%
          </div>
          <div className="text-[9px] text-slate-500">Hit Rate</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">PREFILL CUT</div>
          <div className="text-base font-bold text-teal-400">
            -{results.latencyReductionPercent}%
          </div>
          <div className="text-[9px] text-slate-500">{results.baselineTtftMs}ms → {results.cachedTtftMs}ms</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">VRAM SAVED</div>
          <div className="text-base font-bold text-indigo-400">
            {results.vramSavedGb} GB
          </div>
          <div className="text-[9px] text-slate-500">{results.annualClusterSavings}</div>
        </div>
      </div>

      {/* Footer Branding & Link */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">
          SLA: <span className="text-emerald-400 font-bold">{results.slaStatus.replace(/_/g, ' ')}</span>
        </span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition"
        >
          Elesium Sovereign Solutions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
