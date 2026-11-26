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
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: KV Cache Prefix Caching Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-kvcache-prefix-caching-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              KV Cache Prefix Caching Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Radix Attention · Zero-Copy Memory · TTFT Acceleration
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          RADIX TRIE
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div>
          <label className="text-neutral-400 block mb-1">FOUNDATION MODEL</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value="llama_3_70b">Llama-3 70B</option>
            <option value="deepseek_r1_671b">DeepSeek-R1 671B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
            <option value="mistral_large_123b">Mistral Large 123B</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">EVICTION POLICY</label>
          <select
            value={cacheEvictionPolicy}
            onChange={(e) => setCacheEvictionPolicy(e.target.value as CacheEvictionPolicy)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
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
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>SHARED PREFIX TOKENS:</span>
            <span className="text-white font-bold">{sharedPrefixTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="256"
            max="32768"
            step="256"
            value={sharedPrefixTokens}
            onChange={(e) => setSharedPrefixTokens(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>UNIQUE QUERY TOKENS:</span>
            <span className="text-white font-bold">{uniqueQueryTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="64"
            max="4096"
            step="64"
            value={uniqueQueryTokens}
            onChange={(e) => setUniqueQueryTokens(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <span className="text-neutral-400 block mb-1">CONCURRENT AGENT STREAMS</span>
          <div className="grid grid-cols-4 gap-1">
            {[8, 32, 64, 128].map((s) => (
              <button
                key={s}
                onClick={() => setConcurrentStreams(s)}
                className={`active:scale-[0.97] py-1 rounded text-[11px] font-mono border ${
                  concurrentStreams === s
                    ? 'border-white/30 bg-white/10 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-lg border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">PREFIX HIT</div>
          <div className="text-base font-bold text-white">
            {results.prefixHitRatePercent}%
          </div>
          <div className="text-[9px] text-neutral-500">Hit Rate</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">PREFILL CUT</div>
          <div className="text-base font-bold text-white">
            -{results.latencyReductionPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">{results.baselineTtftMs}ms → {results.cachedTtftMs}ms</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">VRAM SAVED</div>
          <div className="text-base font-bold text-white">
            {results.vramSavedGb} GB
          </div>
          <div className="text-[9px] text-neutral-500">{results.annualClusterSavings}</div>
        </div>
      </div>

      {/* Footer Branding & Link */}
      <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
        <span className="text-neutral-400">
          SLA: <span className="text-white font-bold">{results.slaStatus.replace(/_/g, ' ')}</span>
        </span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-200 hover:text-white inline-flex items-center gap-1 font-medium transition"
        >
          Elesium Sovereign Solutions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
