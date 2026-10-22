import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Database,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  TrendingDown,
  Server,
  Layers,
  Leaf
} from 'lucide-react';
import {
  calculateSemanticCacheSimulation,
  SemanticCacheInputs,
  EmbeddingModelType,
  UpstreamLlmModelType,
  CacheStorageTierType
} from '../calculator/semanticCacheSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseSemanticCacheSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(350000);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.92);
  const [embeddingModel, setEmbeddingModel] = useState<EmbeddingModelType>('text_embedding_3_small');
  const [upstreamLlmModel, setUpstreamLlmModel] = useState<UpstreamLlmModelType>('gpt_4o');
  const [cacheStorageTier, setCacheStorageTier] = useState<CacheStorageTierType>('redis_stack_vector');
  const [averagePromptTokens, setAveragePromptTokens] = useState<number>(768);
  const [averageCompletionTokens, setAverageCompletionTokens] = useState<number>(384);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/semantic-cache-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: ENTERPRISE AI SEMANTIC CACHE SIMULATION
================================================================================
Monthly Query Volume    : ${inputs.monthlyQueryVolume.toLocaleString()} queries
Cosine Threshold        : ${inputs.similarityThreshold.toFixed(2)}
Upstream LLM Provider   : ${inputs.upstreamLlmModel.toUpperCase()}
Embedding Model         : ${inputs.embeddingModel}
Cache Storage Engine    : ${inputs.cacheStorageTier}
Token Payload           : ${inputs.averagePromptTokens} prompt / ${inputs.averageCompletionTokens} completion

PERFORMANCE & FINANCIAL PROJECTIONS:
--------------------------------------------------------------------------------
Cache Hit Ratio         : ${results.cacheHitRatePct}%
Average Latency Cut     : ${results.averageLatencyReductionPct}% reduction
Uncached Monthly Spend  : $${results.performanceTiers[0].monthlyCostUsd.toLocaleString()} / mo
Cached Monthly Spend    : $${results.performanceTiers[2].monthlyCostUsd.toLocaleString()} / mo
Net Monthly Savings     : $${results.monthlyTokenSavingsUsd.toLocaleString()} / mo
Net Annual Savings      : $${results.annualTokenSavingsUsd.toLocaleString()} / year
Carbon Emissions Saved  : ${results.carbonEmissionsSavedKg.toLocaleString()} kg CO2e / mo

ARCHITECTURAL VERDICT:
${results.architecturalGuidance}
================================================================================
Audit performed via https://elesium.online/tools/enterprise-semantic-cache-simulator
`.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const faqs = [
    {
      q: "What is the difference between exact KV caching and semantic vector caching?",
      a: "Exact KV caching (e.g. vLLM chunked prefix caching) requires identical token strings to match prompt prefixes in GPU VRAM. Semantic vector caching embeds incoming prompts into a dense vector space and queries an in-memory vector store (Redis Stack, Milvus, or pgvector HNSW) using cosine similarity. If the query is semantically equivalent to a prior question within your threshold (e.g., >=0.92 cosine score), the pre-computed LLM completion is returned in sub-10ms, completely bypassing GPU inference."
    },
    {
      q: "How do you prevent semantic drift or returning outdated context from the cache?",
      a: "Elesium implements dual-tier cache validation: 1) Tenant and permission partition namespaces to prevent cross-account data leakage; 2) Dynamic TTL (Time-To-Live) eviction paired with document revision hashes. When underlying RAG documents, ERP tables, or knowledge bases update, affected vector clusters are evicted instantaneously via CDC (Change Data Capture) event streams."
    },
    {
      q: "What is the recommended cosine similarity threshold for enterprise deployments?",
      a: "For structured code generation, legal drafting, or quantitative finance calculations, we enforce strict thresholds between 0.94 and 0.97. For enterprise customer support, internal IT helpdesks, and general FAQ synthesis, 0.90 to 0.92 provides the golden ratio—capturing 35–45% of redundant queries while maintaining >99% answer fidelity."
    },
    {
      q: "Can this semantic cache be deployed completely air-gapped on private VPCs?",
      a: "Yes. By utilizing local embedding models (e.g. BGE-M3 or Snowflake Arctic) deployed on on-premise inference endpoints alongside local Redis Stack or Milvus instances, the entire semantic cache pipeline runs inside your private VPC without exposing a single token to external third-party APIs."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      <Helmet>
        <title>Enterprise AI Agent Semantic Cache &amp; Embedding Deduplication Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark Enterprise AI Semantic Vector Caching (Redis Stack, Milvus, pgvector) vs raw uncached LLM calls. Model cosine similarity thresholds, sub-10ms lookup latencies, and token cost reductions."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-semantic-cache-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950 pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(6,182,212,0.15),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide text-cyan-400 bg-cyan-500/10 border border-cyan-500/20">
              <Database className="w-3.5 h-3.5" /> Linkable Micro-SaaS Tool #14 &bull; FinOps &amp; Low-Latency
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                Embed Calculator
              </button>
              <button
                onClick={copyArchitecturalMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                {hasCopiedMemo ? 'Memo Copied!' : 'Copy Forensic Memo'}
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            Enterprise AI Semantic Cache &amp; Embedding Deduplication Simulator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Quantify token expenditure reduction, cosine similarity tuning curves, and sub-10ms in-memory cache lookup latencies (Redis Stack, Milvus, pgvector) vs uncached multi-agent LLM invocations.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Workload &amp; Cache Parameters
              </h2>
            </div>

            {/* Monthly Query Volume */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-medium text-slate-300">Monthly Query Volume</label>
                <span className="font-mono text-cyan-400 font-bold">{monthlyQueryVolume.toLocaleString()} requests</span>
              </div>
              <input
                type="range"
                min="25000"
                max="2500000"
                step="25000"
                value={monthlyQueryVolume}
                onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>25k reqs</span>
                <span>1M reqs</span>
                <span>2.5M reqs</span>
              </div>
            </div>

            {/* Cosine Similarity Threshold */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-medium text-slate-300">Cosine Similarity Threshold</label>
                <span className="font-mono text-emerald-400 font-bold">{similarityThreshold.toFixed(2)} Cosine</span>
              </div>
              <input
                type="range"
                min="0.80"
                max="0.98"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>0.80 (Aggressive)</span>
                <span>0.92 (Golden Enterprise)</span>
                <span>0.98 (Exact)</span>
              </div>
            </div>

            {/* Upstream LLM Model */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Upstream LLM Provider
              </label>
              <select
                value={upstreamLlmModel}
                onChange={(e) => setUpstreamLlmModel(e.target.value as UpstreamLlmModelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="gpt_4o">OpenAI GPT-4o ($2.50 in / $10.00 out per 1M)</option>
                <option value="claude_3_5_sonnet">Anthropic Claude 3.5 Sonnet ($3.00 in / $15.00 out per 1M)</option>
                <option value="deepseek_v3">DeepSeek V3 ($0.27 in / $1.10 out per 1M)</option>
                <option value="llama_3_3_70b">Llama 3.3 70B Private Host ($0.50 in / $0.80 out per 1M)</option>
              </select>
            </div>

            {/* Embedding Model */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Embedding Model (Vectorization)
              </label>
              <select
                value={embeddingModel}
                onChange={(e) => setEmbeddingModel(e.target.value as EmbeddingModelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="text_embedding_3_small">OpenAI text-embedding-3-small (1536-dim, 14ms latency)</option>
                <option value="bge_m3_local">BGE-M3 Self-Hosted ONNX (1024-dim, sub-8ms private VPC)</option>
                <option value="voyage_large_2">Voyage AI voyage-large-2 (1536-dim, 22ms dense)</option>
              </select>
            </div>

            {/* Cache Storage Engine */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                In-Memory Vector Cache Storage Engine
              </label>
              <select
                value={cacheStorageTier}
                onChange={(e) => setCacheStorageTier(e.target.value as CacheStorageTierType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
              >
                <option value="redis_stack_vector">Redis Stack Vector (In-Memory HNSW, ~3.2ms lookup)</option>
                <option value="milvus_standalone">Milvus Standalone (IVF-FLAT / HNSW, ~5.5ms lookup)</option>
                <option value="pgvector_hnsw">PostgreSQL pgvector (HNSW Index, ~8.8ms lookup)</option>
              </select>
            </div>

            {/* Token Split Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Prompt: <span className="text-white font-mono">{averagePromptTokens} toks</span>
                </label>
                <input
                  type="range"
                  min="128"
                  max="2048"
                  step="64"
                  value={averagePromptTokens}
                  onChange={(e) => setAveragePromptTokens(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Completion: <span className="text-white font-mono">{averageCompletionTokens} toks</span>
                </label>
                <input
                  type="range"
                  min="64"
                  max="1024"
                  step="32"
                  value={averageCompletionTokens}
                  onChange={(e) => setAverageCompletionTokens(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Hit Ratio</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {results.cacheHitRatePct}%
                </div>
                <div className="text-[10px] text-slate-500">Autonomous hits</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Latency Cut</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.averageLatencyReductionPct}%
                </div>
                <div className="text-[10px] text-slate-500">Weighted avg TTFT</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Monthly Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  ${results.monthlyTokenSavingsUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">Net FinOps gain</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  ${results.annualTokenSavingsUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">12-mo projected</div>
              </div>
            </div>

            {/* Defense/Performance Tier Comparison Cards */}
            <div className="space-y-3">
              {results.performanceTiers.map((tier) => (
                <div
                  key={tier.id}
                  className={`border rounded-xl p-4 transition-all ${
                    tier.id === 'blended_production'
                      ? 'bg-cyan-950/20 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                      : tier.id === 'semantic_cache_hit'
                      ? 'bg-emerald-950/15 border-emerald-500/30'
                      : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {tier.id === 'blended_production' ? (
                        <Zap className="w-4 h-4 text-cyan-400" />
                      ) : tier.id === 'semantic_cache_hit' ? (
                        <Layers className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Server className="w-4 h-4 text-slate-500" />
                      )}
                      <h3 className="font-bold text-sm text-white">{tier.name}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      ${tier.monthlyCostUsd.toLocaleString()} / mo
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{tier.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Avg Latency</span>
                      <span className="text-slate-200 font-semibold">{tier.averageLatencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">P99 Tail</span>
                      <span className="text-slate-200 font-semibold">{tier.p99LatencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Hit Rate</span>
                      <span className="text-cyan-400 font-semibold">{tier.cacheHitRatioPct}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Precision</span>
                      <span className="text-emerald-400 font-semibold">{tier.precisionScorePct}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architectural Guidance Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5 text-cyan-400" />
                  Forensic Architecture &amp; FinOps Recommendation
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> {results.carbonEmissionsSavedKg.toLocaleString()} kg CO2e saved
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {results.architecturalGuidance}
              </p>
            </div>

            {/* Bottom CTA Card */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Deploy Sovereign Semantic Cache in Your VPC</h4>
                <p className="text-xs text-slate-400">Lock sub-10ms response times and eliminate token waste with zero vendor lock-in.</p>
              </div>
              <ExpandableScreen>
                <ExpandableScreenTrigger className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-cyan-500/20">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <div className="p-6">
                    <MandateApplicationForm />
                  </div>
                </ExpandableScreenContent>
              </ExpandableScreen>
            </div>
          </div>
        </div>

        {/* Technical FAQ Section */}
        <div className="mt-16 border-t border-slate-800/80 pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Frequently Asked Questions: Enterprise Semantic Caching &amp; Vector Lookup
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850/50 transition"
                >
                  <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cross-linking to Solutions and Comparisons */}
        <div className="mt-12 border-t border-slate-800/60 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Explore related sovereign solutions:{' '}
            <Link to="/solutions" className="text-cyan-400 hover:underline">
              Enterprise AI Solutions Hub
            </Link>{' '}
            &bull;{' '}
            <Link to="/compare" className="text-cyan-400 hover:underline">
              Architecture Comparison Hub
            </Link>
          </div>
          <div>
            <Link to="/tools/enterprise-ai-roi-calculator" className="text-slate-400 hover:text-white transition">
              Enterprise ROI Calculator &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Embed This Calculator on Your Site</h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into any technical blog, enterprise portal, or architecture documentation page.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 break-all mb-4">
              {embedCodeSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
