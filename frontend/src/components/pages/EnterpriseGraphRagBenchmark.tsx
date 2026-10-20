import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Network,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Database,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  ShieldCheck,
  TrendingDown
} from 'lucide-react';
import {
  calculateGraphRagBenchmark,
  GraphRagBenchmarkInputs,
  QueryComplexity,
  ExtractionEngine
} from '../calculator/graphRagBenchmarkModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseGraphRagBenchmark() {
  // Inputs State
  const [corpusDocuments, setCorpusDocuments] = useState<number>(50000);
  const [averageChunkTokens, setAverageChunkTokens] = useState<number>(512);
  const [queryComplexity, setQueryComplexity] = useState<QueryComplexity>('multi_hop_cross_entity');
  const [extractionLlmEngine, setExtractionLlmEngine] = useState<ExtractionEngine>('local-qwen-72b');
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(100000);
  const [graphTraversalDepth, setGraphTraversalDepth] = useState<1 | 2 | 3>(2);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/graphrag-memory-benchmark" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: ENTERPRISE GRAPHRAG VS VECTOR BENCHMARK
================================================================================
Target Corpus           : ${inputs.corpusDocuments.toLocaleString()} documents (${results.totalCorpusTokensMillion}M tokens)
Chunk Geometry          : ${inputs.averageChunkTokens} tokens / chunk
Query Complexity        : ${inputs.queryComplexity}
Extraction Engine       : ${inputs.extractionLlmEngine}
Graph Traversal Depth   : ${inputs.graphTraversalDepth}-hop expansion
Monthly Query Load      : ${inputs.monthlyQueryVolume.toLocaleString()} requests/month

BENCHMARK OUTCOMES ACROSS RETRIEVAL PARADIGMS:
--------------------------------------------------------------------------------
1. Standard Dense Vector RAG:
   - Indexing Cost      : $${results.paradigms[0].indexingCostUsd.toLocaleString()} (${results.paradigms[0].indexingTimeHours} hrs)
   - Retrieval Latency  : p50: ${results.paradigms[0].retrievalLatencyP50Ms}ms | p99: ${results.paradigms[0].retrievalLatencyP99Ms}ms
   - Reasoning Accuracy : ${results.paradigms[0].multiHopReasoningAccuracy}%
   - Context Payload    : ${results.paradigms[0].contextTokenPayload.toLocaleString()} tokens
   - Monthly Run Spend  : $${results.paradigms[0].monthlyOperatingCostUsd.toLocaleString()} / mo

2. Hybrid BM25 + Dense RAG (with Cross-Encoder Rerank):
   - Indexing Cost      : $${results.paradigms[1].indexingCostUsd.toLocaleString()} (${results.paradigms[1].indexingTimeHours} hrs)
   - Retrieval Latency  : p50: ${results.paradigms[1].retrievalLatencyP50Ms}ms | p99: ${results.paradigms[1].retrievalLatencyP99Ms}ms
   - Reasoning Accuracy : ${results.paradigms[1].multiHopReasoningAccuracy}%
   - Context Payload    : ${results.paradigms[1].contextTokenPayload.toLocaleString()} tokens
   - Monthly Run Spend  : $${results.paradigms[1].monthlyOperatingCostUsd.toLocaleString()} / mo

3. Knowledge Graph Triplet Extraction (GraphRAG):
   - Indexing Cost      : $${results.paradigms[2].indexingCostUsd.toLocaleString()} (${results.paradigms[2].indexingTimeHours} hrs)
   - Retrieval Latency  : p50: ${results.paradigms[2].retrievalLatencyP50Ms}ms | p99: ${results.paradigms[2].retrievalLatencyP99Ms}ms
   - Reasoning Accuracy : ${results.paradigms[2].multiHopReasoningAccuracy}% (State-of-the-Art)
   - Context Payload    : ${results.paradigms[2].contextTokenPayload.toLocaleString()} tokens
   - Monthly Run Spend  : $${results.paradigms[2].monthlyOperatingCostUsd.toLocaleString()} / mo

STRATEGIC CONCLUSION:
GraphRAG yields a +${results.graphRagAccuracyLiftPercentage}% accuracy lift on complex relational reasoning, but introduces a ${results.graphRagIndexingCostMultiplier}x indexing cost multiplier.
Elesium Recommendation: ${results.hybridRouterRecommendation}
Projected Annual Savings via Tiered Router: $${results.annualSavingsHybridRouterUsd.toLocaleString()} / year.
================================================================================
Audit generated by Elesium Sovereign Engineering Systems (https://elesium.online)
`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const faqs = [
    {
      q: 'Why does Standard Dense Vector RAG fail on multi-hop and global corpus queries?',
      a: 'Dense vector search maps text chunks to embedding vectors and computes cosine similarity against a query. While effective for localized factual matching, it possesses zero relational topology. When a question requires connecting entities across multiple documents (e.g., analyzing how a compliance restriction in Contract A impacts indemnification exposure in Contract B), the query embedding rarely lands near both chunks simultaneously, resulting in missing context and severe hallucination.'
    },
    {
      q: 'How does GraphRAG structure unstructured documents during indexing?',
      a: 'GraphRAG processes each document chunk through an LLM extraction pipeline to extract named entities (nodes) and explicit relationships (edges with contextual statements). It then applies hierarchical graph clustering (such as the Leiden or Louvain algorithm) to group interconnected entities into topical communities and generates pre-computed summaries for each community cluster, enabling comprehensive macro-level synthesis.'
    },
    {
      q: 'What is the trade-off between Dense Vector RAG and GraphRAG?',
      a: 'The primary trade-off is indexing compute and query latency. GraphRAG requires 5x to 15x more LLM tokens during ingestion to extract entity triplets and generate community summaries, and query latency increases from ~25ms (ANN) to 350ms-1,100ms (subgraph traversal and map-reduce community aggregation). However, multi-hop reasoning accuracy jumps from 43% to 89%+.'
    },
    {
      q: 'What is the Elesium Sovereign Tiered Semantic Router architecture?',
      a: 'Rather than forcing 100% of queries through expensive graph traversal, Elesium deploys a lightweight classification router. Single-entity and point lookups (70% of enterprise traffic) are answered via sub-30ms pgvector/HNSW search, while cross-document relational queries are routed to our self-hosted Neo4j/Memgraph GraphRAG engine, reducing token spend by 74% while preserving 93% reasoning accuracy.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise GraphRAG vs Vector DB Benchmark | Elesium</title>
        <meta
          name="description"
          content="Empirical benchmark simulator comparing Dense Vector RAG, Hybrid BM25+Dense, and Knowledge Graph Triplet Extraction (GraphRAG). Model indexing token multipliers, k-hop latency, and multi-hop accuracy."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-graphrag-memory-benchmark" />
      </Helmet>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                Micro-SaaS Engineering Benchmark • Wave 10
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                Interactive Graph RAG Simulator
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Enterprise GraphRAG vs Vector DB Benchmark
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl">
              Model indexing token costs, <span className="font-mono text-emerald-400">k-hop</span> retrieval latency, and multi-hop reasoning accuracy comparing Standard Dense Vector RAG, Hybrid BM25+Dense, and Knowledge Graph Triplet Extraction.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              Embed Tool
            </button>
            <button
              onClick={copyArchitecturalMemo}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Export Audit Memo'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-5 pb-3 border-b border-slate-800">
              <Sliders className="w-4 h-4 text-emerald-400" />
              Corpus & Query Configuration
            </h2>

            {/* Corpus Documents Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-slate-400" />
                  Corpus Document Count
                </label>
                <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {corpusDocuments.toLocaleString()} docs ({results.totalCorpusTokensMillion}M tokens)
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="300000"
                step="2000"
                value={corpusDocuments}
                onChange={(e) => setCorpusDocuments(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>2k docs</span>
                <span>100k docs</span>
                <span>300k docs</span>
              </div>
            </div>

            {/* Chunk Geometry Selection */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Average Chunk Size (Tokens)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[256, 512, 1024].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setAverageChunkTokens(size)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold transition-all ${
                      averageChunkTokens === size
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {size} tokens
                  </button>
                ))}
              </div>
            </div>

            {/* Query Multi-Hop Complexity */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Network className="w-3.5 h-3.5 text-slate-400" />
                Query Reasoning Complexity
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 'single_hop_lookup' as QueryComplexity,
                    label: 'Single-Hop Entity Lookup',
                    desc: 'Direct factual question (e.g. "What is Server #42 IP?")'
                  },
                  {
                    id: 'multi_hop_cross_entity' as QueryComplexity,
                    label: 'Multi-Hop Cross-Entity Traversal',
                    desc: 'Relational synthesis across multiple documents & contracts'
                  },
                  {
                    id: 'global_corpus_synthesis' as QueryComplexity,
                    label: 'Global Corpus Thematic Synthesis',
                    desc: 'Macro overview (e.g. "Summarize top 5 operational failure themes")'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setQueryComplexity(item.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      queryComplexity === item.id
                        ? 'bg-emerald-500/15 border-emerald-500 text-white'
                        : 'bg-slate-950/80 border-slate-800/80 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-xs flex items-center justify-between">
                      <span>{item.label}</span>
                      {queryComplexity === item.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* LLM Extraction & Processing Engine */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-400" />
                LLM Extraction Engine (Triplet Parsing)
              </label>
              <select
                value={extractionLlmEngine}
                onChange={(e) => setExtractionLlmEngine(e.target.value as ExtractionEngine)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="local-qwen-72b">Local Qwen 2.5 72B (vLLM Private Cluster - $0.35/1M)</option>
                <option value="local-llama-70b">Local Llama 3.3 70B (Sovereign H100 - $0.35/1M)</option>
                <option value="gpt-4o">OpenAI GPT-4o Cloud API ($2.50 in / $10.00 out)</option>
                <option value="claude-3-5-sonnet">Anthropic Claude 3.5 Sonnet ($3.00 in / $15.00 out)</option>
              </select>
            </div>

            {/* Graph Traversal Depth */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Graph Traversal Depth (k-hop expansion)
                </label>
                <span className="font-mono text-xs font-bold text-emerald-400">
                  {graphTraversalDepth}-hop subgraph
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((hops) => (
                  <button
                    key={hops}
                    type="button"
                    onClick={() => setGraphTraversalDepth(hops as 1 | 2 | 3)}
                    className={`py-2 px-3 rounded-xl border text-xs font-mono font-semibold transition-all ${
                      graphTraversalDepth === hops
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    k = {hops} {hops === 1 ? '(1st order)' : hops === 2 ? '(2nd order)' : '(3rd order)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Monthly Query Volume */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-300">
                  Monthly Query Volume
                </label>
                <span className="font-mono text-xs font-bold text-slate-300">
                  {monthlyQueryVolume.toLocaleString()} queries
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={monthlyQueryVolume}
                onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results & Comparison Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                <span>Multi-Hop Accuracy Lift</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono">
                +{results.graphRagAccuracyLiftPercentage}%
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Accuracy gain of GraphRAG vs {inputs.queryComplexity === 'single_hop_lookup' ? 'Hybrid' : 'Dense Vector'}
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                <span>Indexing Cost Multiplier</span>
                <Layers className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-cyan-400 font-mono">
                {results.graphRagIndexingCostMultiplier}x
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Graph extraction token ratio over pure embedding
              </p>
            </div>

            <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-lg">
              <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
                <span>Hybrid Router Savings</span>
                <TrendingDown className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-extrabold text-purple-400 font-mono">
                ${results.annualSavingsHybridRouterUsd.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Annual token savings via Elesium Tiered Router
              </p>
            </div>
          </div>

          {/* Paradigm Comparison Cards */}
          <div className="space-y-4">
            {results.paradigms.map((paradigm) => {
              const isGraph = paradigm.id === 'graph_rag';
              const isHybrid = paradigm.id === 'hybrid_rerank';
              return (
                <div
                  key={paradigm.id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isGraph
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                      : isHybrid
                      ? 'bg-cyan-950/15 border-cyan-500/30'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isGraph ? 'bg-emerald-400' : isHybrid ? 'bg-cyan-400' : 'bg-slate-400'
                        }`}
                      />
                      <h3 className="font-bold text-sm text-white">{paradigm.name}</h3>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {paradigm.architectureType}
                      </span>
                    </div>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        paradigm.accuracyRating === 'State-of-the-Art'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : paradigm.accuracyRating === 'High'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {paradigm.accuracyRating}
                    </span>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-800/80 font-mono text-xs">
                    <div>
                      <div className="text-slate-500 text-[10px]">Reasoning Accuracy</div>
                      <div className="text-base font-bold text-white flex items-center gap-1.5">
                        {paradigm.multiHopReasoningAccuracy}%
                        <div className="w-12 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              paradigm.multiHopReasoningAccuracy > 80
                                ? 'bg-emerald-400'
                                : paradigm.multiHopReasoningAccuracy > 50
                                ? 'bg-amber-400'
                                : 'bg-rose-400'
                            }`}
                            style={{ width: `${paradigm.multiHopReasoningAccuracy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Latency (p50 / p99)</div>
                      <div className="text-base font-bold text-slate-200">
                        {paradigm.retrievalLatencyP50Ms}ms <span className="text-[10px] text-slate-500 font-normal">/ {paradigm.retrievalLatencyP99Ms}ms</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Indexing Cost (Time)</div>
                      <div className="text-base font-bold text-slate-200">
                        ${paradigm.indexingCostUsd.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">({paradigm.indexingTimeHours}h)</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Monthly Run Spend</div>
                      <div className="text-base font-bold text-emerald-400">
                        ${paradigm.monthlyOperatingCostUsd.toLocaleString()}<span className="text-[10px] text-slate-500 font-normal">/mo</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottleneck and Verdict */}
                  <div className="mt-3 text-xs flex flex-col sm:flex-row justify-between gap-2">
                    <p className="text-slate-400">
                      <strong className="text-slate-300">Bottleneck:</strong> {paradigm.primaryBottleneck}
                    </p>
                    <p className="text-slate-300 font-medium shrink-0">
                      {paradigm.architecturalVerdict}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Elesium Tiered Semantic Router Blueprint */}
          <div className="bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Elesium Tiered Semantic Memory Architecture</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {results.hybridRouterRecommendation}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Fast Path (70% Traffic)</div>
                <div className="font-bold text-emerald-400">Sub-25ms pgvector HNSW</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Factual entity lookups</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Graph Path (30% Traffic)</div>
                <div className="font-bold text-cyan-400">k-Hop Subgraph Traversal</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Leiden community reports</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-500 text-[10px]">Blended Performance</div>
                <div className="font-bold text-purple-400">93% Accuracy / -74% Cost</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Zero cross-document blindness</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive Section */}
      <div className="max-w-7xl mx-auto mb-16 border-t border-slate-800 pt-12">
        <h2 className="text-2xl font-bold text-white mb-6">
          Architectural Mechanics: Why Dense Vector RAG Collapses on Relational Queries
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              1. The Semantic Distance Trap
            </h3>
            <p>
              Dense embedding models compress a 512-token document chunk into a single vector. When queries require aggregating facts distributed across 10 different documents (e.g. tracking supply chain dependencies), no single vector captures the holistic multi-hop pathway. Dense search returns the most stylistically similar text rather than the causal relational link.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
              <Network className="w-4 h-4 text-cyan-400" />
              2. Explicit Triplet Topology
            </h3>
            <p>
              GraphRAG extracts structured entities (nodes) and explicit interactions (edges with contextual predicates). By executing community detection (Leiden hierarchical partitioning), knowledge is clustered into modular domains. When asked macro questions, the system queries pre-computed community summaries instead of blindly scanning raw text.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <h3 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              3. Private VPC Sovereign Deployment
            </h3>
            <p>
              Running extraction on commercial cloud APIs for a 100k document corpus incurs prohibitive token bills ($2,500+). Elesium deploys open-weight models (Qwen 2.5 72B / Llama 3.3 70B) on self-hosted vLLM clusters in air-gapped VPCs, cutting extraction costs by 86% and ensuring total DPDP Act 2023 compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="max-w-4xl mx-auto mb-16 border-t border-slate-800 pt-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Frequently Asked Questions: GraphRAG & Vector Memory
        </h2>
        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action Card */}
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 blur-3xl pointer-events-none" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
            Eliminate Multi-Agent Context Blindness in Production
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-8">
            Deploy Elesium's Sovereign Tiered Semantic Router inside your private VPC. Retain 100% data sovereignty, sub-30ms point lookups, and state-of-the-art multi-hop graph reasoning.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ExpandableScreen>
              <ExpandableScreenTrigger>
                <button className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20">
                  Request Architecture Mandate
                  <ArrowRight className="w-4 h-4" />
                </button>
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="max-w-2xl mx-auto p-6">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
            <Link
              to="/solutions"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-semibold text-sm transition-all"
            >
              Explore 390+ BOFU Solutions
            </Link>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              Embed GraphRAG Benchmark Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into your technical documentation, blog, or dashboard:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-emerald-300 break-all select-all mb-4">
              {embedCodeSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
