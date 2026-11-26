import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Zap,
  TrendingDown,
  Database,
  Layers
} from 'lucide-react';
import {
  calculateSemanticCacheSimulation,
  SemanticCacheInputs,
  EmbeddingModelType,
  UpstreamLlmModelType,
  CacheStorageTierType
} from '../calculator/semanticCacheSimulatorModel';

export default function EmbedSemanticCacheSimulator() {
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(350000);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.92);
  const [embeddingModel] = useState<EmbeddingModelType>('text_embedding_3_small');
  const [upstreamLlmModel, setUpstreamLlmModel] = useState<UpstreamLlmModelType>('gpt_4o');
  const [cacheStorageTier] = useState<CacheStorageTierType>('redis_stack_vector');
  const [averagePromptTokens] = useState<number>(768);
  const [averageCompletionTokens] = useState<number>(384);

  const inputs: SemanticCacheInputs = useMemo(() => ({
    monthlyQueryVolume,
    similarityThreshold,
    embeddingModel,
    upstreamLlmModel,
    cacheStorageTier,
    averagePromptTokens,
    averageCompletionTokens
  }), [
    monthlyQueryVolume,
    similarityThreshold,
    embeddingModel,
    upstreamLlmModel,
    cacheStorageTier,
    averagePromptTokens,
    averageCompletionTokens
  ]);

  const results = useMemo(() => {
    return calculateSemanticCacheSimulation(inputs);
  }, [inputs]);

  return (
    <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 rounded-xl border border-neutral-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise AI Semantic Cache &amp; Embedding Deduplication Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/semantic-cache-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-200 bg-white/[0.04] px-2 py-0.5 rounded border border-white/15">
            Interactive FinOps &amp; Low-Latency Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise AI Semantic Cache &amp; Token Deduplication Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-neutral-400">Cache Hit Latency</div>
          <div className="text-base font-extrabold text-neutral-200 font-mono">
            {results.performanceTiers[1].averageLatencyMs} ms (Sub-10ms)
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Volume: {monthlyQueryVolume.toLocaleString()} requests
          </label>
          <input
            type="range"
            min="25000"
            max="1500000"
            step="25000"
            value={monthlyQueryVolume}
            onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
            className="w-full accent-white bg-neutral-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Cosine Threshold: {similarityThreshold.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.80"
            max="0.98"
            step="0.01"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
            className="w-full accent-white bg-neutral-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Upstream LLM Provider
          </label>
          <select
            value={upstreamLlmModel}
            onChange={(e) => setUpstreamLlmModel(e.target.value as UpstreamLlmModelType)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="gpt_4o">OpenAI GPT-4o</option>
            <option value="claude_3_5_sonnet">Anthropic Claude 3.5 Sonnet</option>
            <option value="deepseek_v3">DeepSeek V3</option>
            <option value="llama_3_3_70b">Llama 3.3 70B (Private)</option>
          </select>
        </div>
      </div>

      {/* Architecture Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Tier 1: Uncached Direct */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
              Raw Uncached LLM
            </span>
            <Database className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${results.performanceTiers[0].monthlyCostUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">Monthly Token Spend</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency:</span>
              <span className="text-white font-bold">{results.performanceTiers[0].averageLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">P99 Tail:</span>
              <span className="text-neutral-400">{results.performanceTiers[0].p99LatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Hit Rate:</span>
              <span className="text-white">0% (All Direct)</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Cache Hit */}
        <div className="bg-white/[0.05] border border-white/30 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">
              Semantic Cache Hit
            </span>
            <Layers className="w-3.5 h-3.5 text-neutral-200" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            $0 (Zero Token)
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">In-Memory Redis / Milvus</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency:</span>
              <span className="text-white font-bold">{results.performanceTiers[1].averageLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">P99 Tail:</span>
              <span className="text-neutral-200">{results.performanceTiers[1].p99LatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Precision:</span>
              <span className="text-neutral-200">{results.performanceTiers[1].precisionScorePct}%</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Blended Production */}
        <div className="bg-white/[0.05] border border-white/30 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">
              Elesium Hybrid Cache
            </span>
            <Zap className="w-3.5 h-3.5 text-neutral-200" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${results.performanceTiers[2].monthlyCostUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">Net Monthly Spend</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Hit Rate:</span>
              <span className="text-white font-bold">{results.cacheHitRatePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Net Savings:</span>
              <span className="text-white font-bold">${results.monthlyTokenSavingsUsd.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Annual Gain:</span>
              <span className="text-white font-bold">${results.annualTokenSavingsUsd.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Verdict Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3 mb-4 text-xs font-mono">
        <div className="text-neutral-400 text-[10px] uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
          <span>Architectural FinOps Optimization Guidance</span>
          <span className="text-neutral-200 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> {results.averageLatencyReductionPct}% Latency Cut
          </span>
        </div>
        <p className="text-neutral-300 text-[11px] leading-relaxed">
          {results.architecturalGuidance}
        </p>
      </div>

      {/* Embed Footer Watermark */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/tools/enterprise-semantic-cache-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white font-semibold underline underline-offset-2"
          >
            Elesium Semantic Cache Simulator
          </a>
        </div>
        <a
          href="https://elesium.online/audit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-neutral-300 hover:text-white font-medium"
        >
          <span>Schedule Enterprise Audit</span>
          <ExternalLink className="w-3 h-3 text-neutral-200" />
        </a>
      </div>
    </div>
  );
}
