import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  ExternalLink
} from 'lucide-react';
import {
  calculateKvCacheSimulation,
  KvCacheSimulatorInputs,
  ModelArchKey,
  CacheStrategyKey,
  CachePrecisionKey
} from '../calculator/kvCacheSimulatorModel';

export default function EmbedKvCacheSimulator() {
  const [modelArch, setModelArch] = useState<ModelArchKey>('llama_70b');
  const [cacheStrategy, setCacheStrategy] = useState<CacheStrategyKey>('prefix_caching');
  const [cachePrecision, setCachePrecision] = useState<CachePrecisionKey>('fp8');
  const [systemPromptTokens, setSystemPromptTokens] = useState<number>(8192);
  const [turnHistoryCount, setTurnHistoryCount] = useState<number>(10);
  const [tokensPerTurn] = useState<number>(1024);
  const [concurrentStreams, setConcurrentStreams] = useState<number>(16);
  const [gpuHardwareVramGb] = useState<number>(80);

  const inputs: KvCacheSimulatorInputs = useMemo(() => ({
    modelArch,
    cacheStrategy,
    cachePrecision,
    systemPromptTokens,
    turnHistoryCount,
    tokensPerTurn,
    concurrentStreams,
    gpuHardwareVramGb
  }), [modelArch, cacheStrategy, cachePrecision, systemPromptTokens, turnHistoryCount, tokensPerTurn, concurrentStreams, gpuHardwareVramGb]);

  const results = useMemo(() => {
    return calculateKvCacheSimulation(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans antialiased">
      <Helmet>
        <title>Enterprise LLM Context Window Cache & KV Eviction Widget | Elesium</title>
        <meta
          name="description"
          content="Interactive widget simulating LLM KV cache memory, PagedAttention block allocation, and TTFT latency across multi-turn agent sessions."
        />
        <link rel="canonical" href="https://elesium.online/embed/kv-cache-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-sky-400" />
          <h1 className="text-sm font-bold text-white tracking-tight">
            LLM Context Window &amp; KV Cache Simulator
          </h1>
        </div>
        <span className="text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800">
          RadixAttention / FP8
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Model Architecture */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Architecture</div>
          <select
            value={modelArch}
            onChange={(e) => setModelArch(e.target.value as ModelArchKey)}
            className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 rounded p-1.5 focus:outline-none"
          >
            <option value="llama_70b">Llama-3.1-70B</option>
            <option value="deepseek_v3_mla">DeepSeek MLA</option>
            <option value="mixtral_8x22b">Mixtral 8x22B</option>
            <option value="qwen_72b">Qwen-2.5-72B</option>
          </select>
        </div>

        {/* Cache Strategy */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-mono text-slate-400 mb-1">Caching Strategy</div>
          <select
            value={cacheStrategy}
            onChange={(e) => setCacheStrategy(e.target.value as CacheStrategyKey)}
            className="w-full bg-slate-950 border border-slate-800 text-xs font-mono text-sky-300 rounded p-1.5 focus:outline-none"
          >
            <option value="prefix_caching">Prefix Caching (Radix)</option>
            <option value="chunked_prefill">Chunked Prefill</option>
            <option value="sliding_window">Sliding Window</option>
            <option value="paged_attention">PagedAttention</option>
            <option value="naive_contiguous">Naive Contiguous</option>
          </select>
        </div>

        {/* Quantization Precision */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="text-[11px] font-mono text-slate-400 mb-1">KV Precision</div>
          <div className="grid grid-cols-3 gap-1">
            {(['fp16', 'fp8', 'int4'] as CachePrecisionKey[]).map((prec) => (
              <button
                key={prec}
                onClick={() => setCachePrecision(prec)}
                className={`py-1 text-[10px] font-mono rounded border transition-colors ${
                  cachePrecision === prec
                    ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {prec.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">System Prompt SOP</span>
            <span className="text-sky-300 font-semibold">{systemPromptTokens.toLocaleString()} Tok</span>
          </div>
          <input
            type="range"
            min="1000"
            max="16000"
            step="1000"
            value={systemPromptTokens}
            onChange={(e) => setSystemPromptTokens(Number(e.target.value))}
            className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">Turn Depth / Streams</span>
            <span className="text-sky-300 font-semibold">{turnHistoryCount} Turns • {concurrentStreams} Streams</span>
          </div>
          <div className="flex gap-2">
            <input
              type="range"
              min="2"
              max="20"
              step="1"
              value={turnHistoryCount}
              onChange={(e) => setTurnHistoryCount(Number(e.target.value))}
              className="w-1/2 accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
            />
            <input
              type="range"
              min="1"
              max="32"
              step="1"
              value={concurrentStreams}
              onChange={(e) => setConcurrentStreams(Number(e.target.value))}
              className="w-1/2 accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 rounded-xl border border-sky-500/30 bg-sky-950/20 text-center">
          <div className="text-[10px] font-mono text-sky-400">TTFT Cut</div>
          <div className="text-base font-bold text-white font-mono">{results.ttftReductionPercentage}%</div>
          <div className="text-[10px] text-slate-400">{results.averageTtftMs}ms avg</div>
        </div>
        <div className="p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 text-center">
          <div className="text-[10px] font-mono text-emerald-400">Total KV VRAM</div>
          <div className="text-base font-bold text-emerald-400 font-mono">{results.totalKvCacheVramGb} GB</div>
          <div className="text-[10px] text-slate-400">{results.vramSaturationPercentage}% VRAM</div>
        </div>
        <div className="p-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-center">
          <div className="text-[10px] font-mono text-indigo-400">Monthly Saved</div>
          <div className="text-base font-bold text-white font-mono">${results.monthlySavingsUsd.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400">Vs Closed API</div>
        </div>
      </div>

      {/* Attribution & Watermark */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <a
          href="https://elesium.online/tools/enterprise-llm-context-kv-cache-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white flex items-center gap-1 transition-colors"
        >
          Open Full Simulator
          <ExternalLink className="w-3 h-3 text-sky-400" />
        </a>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-400 hover:text-sky-300 underline"
          >
            Elesium Sovereign AI Systems
          </a>
        </div>
      </div>
    </div>
  );
}
