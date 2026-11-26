import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  calculateGraphRagBenchmark,
  GraphRagBenchmarkInputs,
  QueryComplexity,
  ExtractionEngine
} from '../calculator/graphRagBenchmarkModel';

export default function EmbedGraphRagBenchmark() {
  const [corpusDocuments, setCorpusDocuments] = useState<number>(50000);
  const [averageChunkTokens] = useState<number>(512);
  const [queryComplexity, setQueryComplexity] = useState<QueryComplexity>('multi_hop_cross_entity');
  const [extractionLlmEngine, setExtractionLlmEngine] = useState<ExtractionEngine>('local-qwen-72b');
  const [monthlyQueryVolume] = useState<number>(100000);
  const [graphTraversalDepth, setGraphTraversalDepth] = useState<1 | 2 | 3>(2);

  const inputs: GraphRagBenchmarkInputs = useMemo(() => ({
    corpusDocuments,
    averageChunkTokens,
    queryComplexity,
    extractionLlmEngine,
    monthlyQueryVolume,
    graphTraversalDepth
  }), [
    corpusDocuments,
    averageChunkTokens,
    queryComplexity,
    extractionLlmEngine,
    monthlyQueryVolume,
    graphTraversalDepth
  ]);

  const results = useMemo(() => {
    return calculateGraphRagBenchmark(inputs);
  }, [inputs]);

  return (
    <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 rounded-[24px] border border-neutral-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise GraphRAG Benchmark Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/graphrag-memory-benchmark" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-200 bg-white/[0.04] px-2 py-0.5 rounded border border-white/15">
            Interactive Benchmark Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise GraphRAG vs Vector DB Benchmark
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-neutral-400">Multi-Hop Accuracy Lift</div>
          <div className="text-base font-extrabold text-neutral-200 font-mono">
            +{results.graphRagAccuracyLiftPercentage}%
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Corpus: {corpusDocuments.toLocaleString()} docs
          </label>
          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={corpusDocuments}
            onChange={(e) => setCorpusDocuments(Number(e.target.value))}
            className="w-full accent-white bg-neutral-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Query Complexity
          </label>
          <select
            value={queryComplexity}
            onChange={(e) => setQueryComplexity(e.target.value as QueryComplexity)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="single_hop_lookup">Single-Hop Point Lookup</option>
            <option value="multi_hop_cross_entity">Multi-Hop Cross-Entity</option>
            <option value="global_corpus_synthesis">Global Corpus Synthesis</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Extraction Engine
          </label>
          <select
            value={extractionLlmEngine}
            onChange={(e) => setExtractionLlmEngine(e.target.value as ExtractionEngine)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="local-qwen-72b">Local Qwen 2.5 72B ($0.35/1M)</option>
            <option value="gpt-4o">OpenAI GPT-4o ($2.50 in)</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet ($3.00 in)</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Traversal Depth (k-hop)
          </label>
          <select
            value={graphTraversalDepth}
            onChange={(e) => setGraphTraversalDepth(Number(e.target.value) as 1 | 2 | 3)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="1">k = 1 (Direct)</option>
            <option value="2">k = 2 (2nd-Order)</option>
            <option value="3">k = 3 (3rd-Order)</option>
          </select>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-2 mb-4">
        {results.paradigms.map((p) => (
          <div
            key={p.id}
            className={`p-3 rounded-[18px] border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
              p.id === 'graph_rag'
                ? 'bg-white/[0.05] border-white/30 text-neutral-200'
                : p.id === 'hybrid_rerank'
                ? 'bg-white/[0.05] border-white/20 text-neutral-200'
                : 'bg-neutral-900/80 border-neutral-800 text-neutral-300'
            }`}
          >
            <div>
              <div className="font-bold text-white text-xs">{p.name}</div>
              <div className="text-[10px] text-neutral-400 font-mono">{p.architectureType}</div>
            </div>

            <div className="flex items-center gap-4 font-mono text-[11px]">
              <div>
                <span className="text-neutral-500 text-[9px] block">Accuracy</span>
                <span className="font-bold text-white">{p.multiHopReasoningAccuracy}%</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[9px] block">p50 Latency</span>
                <span className="font-bold">{p.retrievalLatencyP50Ms} ms</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[9px] block">Index Cost</span>
                <span className="font-bold">${p.indexingCostUsd.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-neutral-500 text-[9px] block">Run Cost</span>
                <span className="font-bold text-white">${p.monthlyOperatingCostUsd.toLocaleString()}/mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Banner */}
      <div className="bg-neutral-900/90 rounded-[18px] border border-neutral-800 p-3 mb-4 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neutral-200 shrink-0" />
          <span className="text-neutral-300 text-[11px]">
            Elesium Tiered Router saves <strong className="text-neutral-200 font-mono">${results.annualSavingsHybridRouterUsd.toLocaleString()}/yr</strong> blending sub-25ms vector search with GraphRAG.
          </span>
        </div>
      </div>

      {/* Backlink Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
        <span>Sovereign Multi-Agent Memory</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-white hover:text-white font-semibold transition-all duration-300"
        >
          <span>Elesium Enterprise AI Solutions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
