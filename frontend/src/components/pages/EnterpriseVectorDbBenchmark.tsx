import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Database,
  Server,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Gauge,
  Layers,
  ShieldCheck
} from 'lucide-react';
import {
  calculateVectorBenchmark,
  VectorBenchmarkInputs
} from '../calculator/vectorDbBenchmarkModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseVectorDbBenchmark() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // Inputs State
  const [vectorCount, setVectorCount] = useState<number>(2000000); // 2M vectors
  const [dimensions, setDimensions] = useState<number>(1536); // ada-002 / text-embedding-3-small
  const [concurrentWorkers, setConcurrentWorkers] = useState<number>(16);
  const [quantizationType, setQuantizationType] = useState<'fp32' | 'fp16' | 'sq8' | 'pq'>('sq8');
  const [targetRecall, setTargetRecall] = useState<number>(0.96);
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(5000000); // 5M queries/mo

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: VectorBenchmarkInputs = useMemo(() => ({
    vectorCount,
    dimensions,
    concurrentWorkers,
    quantizationType,
    targetRecall,
    monthlyQueryVolume
  }), [vectorCount, dimensions, concurrentWorkers, quantizationType, targetRecall, monthlyQueryVolume]);

  const results = useMemo(() => {
    return calculateVectorBenchmark(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/vector-db-benchmark" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL BRIEF: ENTERPRISE VECTOR DB & RAG RETRIEVAL BENCHMARK
Dataset Size: ${(vectorCount / 1000000).toFixed(1)}M Vectors | Dimensions: ${dimensions} | Precision: ${quantizationType.toUpperCase()}
Target Recall@10: ${(targetRecall * 100).toFixed(1)}% | Concurrent Multi-Agent Workers: ${concurrentWorkers}
================================================================================

1. MEMORY & VRAM ALLOCATION:
   • Raw Uncompressed Embedding Payload: ${results.rawVectorSizeGb} GB
   • PostgreSQL pgvector (HNSW + SQ8): ${results.engines[0].ramFootprintGb} GB RAM (Includes Graph M=16 edges)
   • Qdrant (Rust Native): ${results.engines[1].ramFootprintGb} GB RAM
   • Pinecone Serverless: Managed Cloud Index (Zero Host Allocation)

2. RETRIEVAL LATENCY & THROUGHPUT (p99 UNDER LOAD):
   • PostgreSQL pgvector: ${results.engines[0].p99LatencyMs} ms p99 | Max QPS: ${results.engines[0].maxQps}
   • Qdrant: ${results.engines[1].p99LatencyMs} ms p99 | Max QPS: ${results.engines[1].maxQps}
   • Pinecone Serverless: ${results.engines[2].p99LatencyMs} ms p99 (Includes ~18ms TLS WAN Transit)

3. 3-YEAR TOTAL COST OF OWNERSHIP (TCO):
   • PostgreSQL pgvector (Sovereign VPC): $${results.engines[0].threeYearTcoUsd.toLocaleString()}
   • Qdrant (Dedicated Pods): $${results.engines[1].threeYearTcoUsd.toLocaleString()}
   • Pinecone Serverless (SaaS Consumption): $${results.engines[2].threeYearTcoUsd.toLocaleString()}
   • Net 3-Year Sovereign Savings: $${(results.annualSavingsUsd * 3).toLocaleString()} USD

4. STATUTORY DATA SOVEREIGNTY (DPDP ACT 2023 & ISO 27001):
   • pgvector & Qdrant run entirely inside air-gapped Private VPC with zero cross-border telemetry.
   • Pinecone multi-tenant architecture exposes embedding vectors to external API endpoints.

Architectural Guidance: ${results.recommendedArchitecture}
================================================================================
Generated via Elesium Sovereign AI Engineering (https://elesium.online)
    `.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-20 selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Vector DB & RAG Latency Benchmark Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and compare retrieval latency, memory footprint, recall@k, and 3-year TCO for PostgreSQL pgvector (HNSW) vs Pinecone, Qdrant, and Milvus for enterprise RAG."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-vector-db-latency-benchmark" />
        <meta property="og:title" content="Enterprise Vector DB & RAG Latency Benchmark Simulator | Elesium" />
        <meta
          property="og:description"
          content="Benchmark PostgreSQL pgvector (HNSW) vs Pinecone, Qdrant, and Milvus across vector dimensions, concurrency, and 3-year TCO."
        />
        <meta property="og:url" content="https://elesium.online/tools/enterprise-vector-db-latency-benchmark" />
        <meta property="og:type" content="website" />
      </Helmet>

      <WhatsAppModal />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
          <span className="text-slate-600">/</span>
          <span className="text-sky-400 font-medium">Vector DB Benchmark</span>
        </nav>
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 mb-4">
          <Database className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-sky-300">
            Micro-SaaS Engineering • RAG Infrastructure Lab
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Enterprise Vector DB &amp; RAG Latency Benchmark Simulator
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
          Simulate indexing memory footprints, p99 query latency under concurrent agent load, and 3-year TCO comparing
          <strong className="text-white"> PostgreSQL pgvector (HNSW)</strong> against dedicated vector platforms (<strong className="text-white">Pinecone, Qdrant, Milvus</strong>).
          Engineered for Chief Architects and Engineering VPs eliminating multi-tenant cloud token leakage and WAN transit latency.
        </p>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            Embed Interactive Benchmark on Your Site
          </button>
          <button
            onClick={copyArchitecturalMemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {hasCopiedMemo ? 'Benchmark Memo Copied!' : 'Copy Architecture Executive Memo'}
          </button>
        </div>
      </header>

      {/* Main Interactive Grid */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Hardware & Index Controls */}
        <section className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-xl">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <Gauge className="w-4 h-4 text-sky-400" />
              Dataset Scale &amp; Vector Topology
            </h2>

            {/* Slider 1: Total Vector Count */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Total Vectors in Index</span>
                <span className="text-sky-300 font-semibold">{(vectorCount / 1000000).toFixed(1)}M ({vectorCount.toLocaleString()})</span>
              </div>
              <input
                type="range"
                min="100000"
                max="10000000"
                step="100000"
                value={vectorCount}
                onChange={(e) => setVectorCount(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>100K (Pilot)</span>
                <span>2M (Enterprise)</span>
                <span>10M (Hyperscale)</span>
              </div>
            </div>

            {/* Slider 2: Vector Embedding Dimensions */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Embedding Dimensions</span>
                <span className="text-sky-300 font-semibold">{dimensions} dims</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { dim: 384, label: '384 (MiniLM)' },
                  { dim: 768, label: '768 (BGE-base)' },
                  { dim: 1536, label: '1536 (OpenAI)' },
                  { dim: 3072, label: '3072 (Large)' }
                ].map((item) => (
                  <button
                    key={item.dim}
                    onClick={() => setDimensions(item.dim)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-mono transition-all ${
                      dimensions === item.dim
                        ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 3: Concurrent Multi-Agent Query Workers */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Concurrent Agent Retrieval Workers</span>
                <span className="text-sky-300 font-semibold">{concurrentWorkers} Workers</span>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={concurrentWorkers}
                onChange={(e) => setConcurrentWorkers(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1 (Single Loop)</span>
                <span>16 (Parallel Swarm)</span>
                <span>64 (Production Spike)</span>
              </div>
            </div>

            {/* Selector: Quantization Precision */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Quantization &amp; Compression</span>
                <span className="text-sky-300 font-semibold">{quantizationType.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { type: 'fp32', label: 'FP32 (Exact)' },
                  { type: 'fp16', label: 'FP16 (Half)' },
                  { type: 'sq8', label: 'SQ8 (Scalar)' },
                  { type: 'pq', label: 'PQ (Product)' }
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setQuantizationType(item.type as any)}
                    className={`py-2 px-1 text-center rounded-lg border text-xs font-mono transition-all ${
                      quantizationType === item.type
                        ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-2 font-mono">
                SQ8 reduces vector RAM by 75% with under 0.8% recall degradation.
              </p>
            </div>

            {/* Slider 4: Target Recall@10 */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Target Recall Accuracy (Recall@10)</span>
                <span className="text-sky-300 font-semibold">{(targetRecall * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.90"
                max="0.995"
                step="0.005"
                value={targetRecall}
                onChange={(e) => setTargetRecall(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>90.0% (Fast)</span>
                <span>96.0% (Standard)</span>
                <span>99.5% (High Recall)</span>
              </div>
            </div>

            {/* Slider 5: Monthly Query Volume */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Monthly Query Volume</span>
                <span className="text-sky-300 font-semibold">{(monthlyQueryVolume / 1000000).toFixed(1)}M Queries</span>
              </div>
              <input
                type="range"
                min="500000"
                max="30000000"
                step="500000"
                value={monthlyQueryVolume}
                onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>500K</span>
                <span>5M</span>
                <span>30M</span>
              </div>
            </div>
          </div>

          {/* Theoretical Memory Formula Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-sky-400" />
              HNSW Memory Sizing Formulation
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono mb-3">
              Total Memory = (Vectors × Dims × PrecisionBytes) + (Vectors × M × 2 × PointerBytes)
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Raw Vectors:</span>
                <span className="font-mono text-white">{results.rawVectorSizeGb} GB</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1">
                <span className="text-slate-400">Quantization Savings:</span>
                <span className="font-mono text-emerald-400">
                  {quantizationType === 'fp32' ? '0%' : quantizationType === 'fp16' ? '50%' : quantizationType === 'sq8' ? '75%' : '87.5%'}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">HNSW Graph Links (M=16):</span>
                <span className="font-mono text-sky-400">~256 bytes / vector</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Comparison Engine Results */}
        <section className="lg:col-span-7 space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-950/20">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
                Self-Hosted Advantage
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {results.latencyAdvantagePercentage}% Faster
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sub-5ms p99 vs 25ms+ WAN TLS SaaS transit
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Annual TCO Savings
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                ${results.annualSavingsUsd.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                ${(results.annualSavingsUsd * 3).toLocaleString()} saved over 36-month horizon
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
                Data Sovereignty
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                100% Private VPC
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Air-gapped DPDP Act &amp; SOC-2 Safe Harbor
              </p>
            </div>
          </div>

          {/* Engine Benchmark Matrix */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden">
            <h2 className="text-base font-semibold text-white flex items-center justify-between mb-4">
              <span className="flex items-center gap-2">
                <Server className="w-4 h-4 text-sky-400" />
                Benchmark Comparison: Self-Hosted vs SaaS Vector Engines
              </span>
              <span className="text-xs font-mono text-slate-400">M=16 • ef_search=64</span>
            </h2>

            <div className="space-y-4">
              {results.engines.map((engine, idx) => (
                <div
                  key={engine.name}
                  className={`p-4 rounded-xl border transition-all ${
                    idx === 0
                      ? 'border-sky-500/50 bg-sky-950/20 shadow-md'
                      : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        engine.engineType === 'self_hosted_sql'
                          ? 'bg-sky-400'
                          : engine.engineType === 'self_hosted_rust'
                          ? 'bg-indigo-400'
                          : engine.engineType === 'managed_saas'
                          ? 'bg-rose-400'
                          : 'bg-emerald-400'
                      }`} />
                      <h3 className="text-sm font-semibold text-white">{engine.name}</h3>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-500/30">
                          Recommended
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span className="text-slate-400">
                        Monthly: <strong className="text-white">${engine.monthlyCostUsd.toLocaleString()}</strong>
                      </span>
                      <span className="text-slate-400">
                        3-Yr TCO: <strong className="text-emerald-400">${engine.threeYearTcoUsd.toLocaleString()}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Metrics Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 py-2 px-3 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <div>
                      <div className="text-slate-500 text-[10px]">p99 Latency</div>
                      <div className={`font-semibold ${engine.p99LatencyMs < 10 ? 'text-emerald-400' : engine.p99LatencyMs < 20 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {engine.p99LatencyMs} ms
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">RAM Required</div>
                      <div className="text-slate-200 font-semibold">{engine.ramFootprintGb} GB</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Max QPS</div>
                      <div className="text-sky-400 font-semibold">{engine.maxQps.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px]">Recall@10</div>
                      <div className="text-slate-200 font-semibold">{engine.recallScore}%</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {engine.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Guidance Box */}
          <div className="p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 to-sky-950/30">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Sovereign Architecture Verdict
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {results.recommendedArchitecture} By keeping vector embeddings in the same PostgreSQL cluster as your transactional business entities, you achieve zero network transit latency and eliminate the risk of unsynchronized state or third-party API rate limits.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <ExpandableScreen>
                <ExpandableScreenTrigger>
                  <button className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2">
                    Schedule Sovereign RAG Architecture Audit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <button
                onClick={() => openWhatsApp()}
                className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
              >
                Discuss Vector Sizing on WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Technical FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          Vector Indexing &amp; Retrieval Engineering Principles
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'Why does PostgreSQL pgvector match or beat dedicated SaaS vector databases for enterprise workloads?',
              a: 'With the introduction of HNSW indexing in pgvector v0.5+ and parallel build workers in v0.7+, pgvector executes vector distance calculations in C-level shared memory without network serialization. Dedicated SaaS databases incur unavoidable TLS connection handshakes and cross-datacenter WAN transit (typically 15ms to 40ms), completely dwarfing the 2ms to 4ms in-memory calculation time.'
            },
            {
              q: 'How does Scalar Quantization (SQ8) preserve retrieval accuracy while cutting RAM by 75%?',
              a: 'Standard vector embeddings use 32-bit floating-point numbers (FP32, 4 bytes per dimension). SQ8 quantizes each floating-point dimension into an 8-bit signed integer (1 byte) through uniform linear scaling. In enterprise RAG benchmarks across 1536-dimensional models, SQ8 reduces memory consumption from 6.14 GB/M vectors to 1.53 GB/M vectors with less than 0.8% loss in top-10 recall accuracy.'
            },
            {
              q: 'What is the compliance impact of using multi-tenant vector databases under the DPDP Act 2023?',
              a: 'Section 16 of the Digital Personal Data Protection Act 2023 mandates strict auditability over cross-border data transfers and unauthorized processing. Transmitting sensitive corporate embeddings or customer telemetry to external multi-tenant vector clouds introduces statutory liability up to ₹250 Crore. A private VPC pgvector instance ensures personal data and embeddings never leave your sovereign security perimeter.'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === index && (
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-400" />
              Embed This Benchmark Simulator on Your Site
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into your engineering blog, documentation, or internal architecture wiki.
            </p>
            <textarea
              readOnly
              value={embedCodeSnippet}
              className="w-full h-32 p-3 font-mono text-xs rounded-lg border border-slate-800 bg-slate-950 text-slate-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center gap-2"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
