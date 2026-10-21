import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Database,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Zap
} from 'lucide-react';
import {
  calculateVectorSharding,
  VectorShardingInputs,
  ShardingStrategy,
  QuantizationMode,
  VectorDimension
} from '../calculator/agentVectorShardingModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentVectorShardingSimulator() {
  // Inputs State
  const [totalVectorsMillions, setTotalVectorsMillions] = useState<number>(50);
  const [shardCount, setShardCount] = useState<number>(8);
  const [vectorDimensions, setVectorDimensions] = useState<VectorDimension>(1536);
  const [hnswM, setHnswM] = useState<number>(32);
  const [hnswEfSearch, setHnswEfSearch] = useState<number>(64);
  const [shardingStrategy, setShardingStrategy] = useState<ShardingStrategy>('consistent_hashing');
  const [quantizationMode, setQuantizationMode] = useState<QuantizationMode>('int8_scalar_quantization');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: VectorShardingInputs = useMemo(() => ({
    totalVectorsMillions,
    vectorDimensions,
    hnswM,
    hnswEfSearch,
    shardCount,
    shardingStrategy,
    quantizationMode,
    currency
  }), [
    totalVectorsMillions,
    vectorDimensions,
    hnswM,
    hnswEfSearch,
    shardCount,
    shardingStrategy,
    quantizationMode,
    currency
  ]);

  const results = useMemo(() => {
    return calculateVectorSharding(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-vector-db-sharding-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Enterprise Vector Sharding</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT VECTOR DATABASE SHARDING & HNSW LATENCY MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-vector-db-sharding-simulator)

CLUSTER CONFIGURATION & VECTOR TOPOLOGY:
- Total Vector Corpus: ${totalVectorsMillions.toLocaleString()} Million Vectors
- Shard Partitioning: ${shardCount} Distributed Shards
- Embedding Dimensionality: ${vectorDimensions} Dimensions
- HNSW Graph Parameters: M=${hnswM}, efSearch=${hnswEfSearch}
- Compression & Quantization: ${quantizationMode.replace(/_/g, ' ').toUpperCase()}
- Sharding Strategy: ${shardingStrategy.replace(/_/g, ' ').toUpperCase()}

PERFORMANCE BENCHMARKS & LATENCY TELEMETRY:
- P99 Query Latency: ${results.p99QueryLatencyMs} ms (Tail Scatter-Gather Latency)
- P50 Query Latency: ${results.p50QueryLatencyMs} ms
- Cluster RAM Footprint: ${results.memoryFootprintGb} GB
- Top-K Recall Accuracy: ${results.recallAccuracyPct}%
- Indexing Ingestion Throughput: ${results.indexingThroughputVectorsPerSec.toLocaleString()} vectors/sec
- Est. Annual TCO Infrastructure: ${currency === 'INR' ? '₹' : '$'}${results.annualInfrastructureSpend.toLocaleString()}
- Est. Annual Latency Outage Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualLatencyCostSavings.toLocaleString()}
- Cluster Classification: ${results.statusClassification}

ARCHITECTURAL SAFEGUARDS:
1. Virtual vNode consistent hashing mitigates hot-spotting across vector partitions.
2. Scalar INT8 quantization slashes memory bus bandwidth by 72% with negligible recall decay.
3. Sub-second scatter-gather fanout prunes distant cluster centroids prior to network transmission.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // SVG Chart points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(15, results.p99QueryLatencyMs * 1.25);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.latencyMs / maxLatency) * (height * 0.75) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.p99QueryLatencyMs]);

  // Structured Data (SoftwareApplication & FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Enterprise Autonomous Agent Vector Database Sharding & HNSW Indexing Latency Simulator',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Cloud, Kubernetes, Linux, Bare Metal',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': 'Simulate vector database cluster sharding, HNSW graph parameters, RAM footprints, scalar quantization, and P99 query latency for enterprise AI agents.'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How does vector database sharding affect P99 query latency in multi-agent RAG systems?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Sharding distributes vector embeddings across multiple nodes, reducing single-node memory saturation and allowing parallel HNSW graph traversals. However, excessive fan-out without centroid pruning introduces network scatter-gather latency. Consistent hashing with virtual nodes and centroid IVF clustering ensures P99 latencies remain sub-5ms even across hundreds of millions of vectors.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What is the trade-off between INT8 scalar quantization and top-k recall accuracy?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'INT8 scalar quantization compresses 32-bit floating point vector coordinates into 8-bit integers, slashing total cluster RAM footprints by approximately 72%. While product quantization (PQ) achieves even higher compression, it degrades recall by 2-4%. INT8 maintains greater than 99.2% recall accuracy while fitting inside cost-effective memory-optimized cloud instances.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Why is HNSW graph traversal preferred over flat brute-force index scans for enterprise scale?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Flat index scans require O(N) exhaustive distance calculations across all vectors in the corpus, causing query latency to spike into seconds as vector counts cross 10 million. Hierarchical Navigable Small World (HNSW) graphs organize vectors into multi-layer skip-lists, providing logarithmic O(log N) search complexity that delivers sub-millisecond retrieval speeds.'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans pb-24">
      <Helmet>
        <title>Enterprise Vector Database Sharding &amp; HNSW Indexing Latency Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate vector database cluster sharding, RAM memory footprint, HNSW graph traversal parameters, scalar quantization, and P99 query latency for enterprise AI agents."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-vector-db-sharding-simulator" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Top Banner Breadcrumbs */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
            <span>/</span>
            <a href="/solutions" className="hover:text-emerald-400 transition-colors">Tools</a>
            <span>/</span>
            <span className="text-emerald-400 font-medium">Vector DB Sharding &amp; HNSW Simulator</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Vector Database Sharding Engine #42</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl">
          Enterprise Autonomous Agent Vector Database Sharding &amp; HNSW Indexing Latency Simulator
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Simulate distributed vector cluster memory footprints, P99 ANN search latencies, HNSW graph parameters, 
          scalar/product quantization compression ratios, and cross-shard scatter-gather overhead for enterprise AI agents.
        </p>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 className="font-bold text-white text-base">Cluster Sharding Parameters</h2>
              </div>
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${currency === 'INR' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${currency === 'USD' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Slider 1: Total Vectors (Millions) */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium">Vector Corpus Size</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {totalVectorsMillions} Million Vectors
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="5"
                value={totalVectorsMillions}
                onChange={(e) => setTotalVectorsMillions(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1M Vectors</span>
                <span>250M Vectors</span>
                <span>500M Vectors</span>
              </div>
            </div>

            {/* Slider 2: Cluster Shards */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium">Cluster Partition Shards</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {shardCount} Shards
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={shardCount}
                onChange={(e) => setShardCount(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1 (Monolith)</span>
                <span>16 Shards</span>
                <span>64 Shards</span>
              </div>
            </div>

            {/* Grid: Dimensionality, HNSW M & efSearch */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Embedding Dims</label>
                <select
                  value={vectorDimensions}
                  onChange={(e) => setVectorDimensions(Number(e.target.value) as VectorDimension)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={384}>384d (MiniLM)</option>
                  <option value={768}>768d (BERT)</option>
                  <option value={1536}>1536d (Small)</option>
                  <option value={3072}>3072d (Large)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">HNSW M (Links)</label>
                <select
                  value={hnswM}
                  onChange={(e) => setHnswM(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={16}>M = 16 (Fast)</option>
                  <option value={32}>M = 32 (Standard)</option>
                  <option value={48}>M = 48 (Dense)</option>
                  <option value={64}>M = 64 (Max Recall)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">efSearch</label>
                <select
                  value={hnswEfSearch}
                  onChange={(e) => setHnswEfSearch(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={32}>ef = 32</option>
                  <option value={64}>ef = 64</option>
                  <option value={128}>ef = 128</option>
                  <option value={256}>ef = 256</option>
                </select>
              </div>
            </div>

            {/* Quantization Compression */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Quantization &amp; Memory Compression</label>
              <select
                value={quantizationMode}
                onChange={(e) => setQuantizationMode(e.target.value as QuantizationMode)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="fp32_uncompressed">FP32 Uncompressed (4 Bytes/Dim, 100% Recall)</option>
                <option value="fp16_half_precision">FP16 Half-Precision (2 Bytes/Dim, 0.3% Decay)</option>
                <option value="int8_scalar_quantization">INT8 Scalar Quantization (1 Byte/Dim, 72% Memory Cut)</option>
                <option value="pq_product_quantization">Product Quantization (PQ-64, 84% Memory Cut)</option>
              </select>
            </div>

            {/* Sharding Strategy */}
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1.5">Distributed Sharding Protocol</label>
              <select
                value={shardingStrategy}
                onChange={(e) => setShardingStrategy(e.target.value as ShardingStrategy)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-emerald-500 font-mono"
              >
                <option value="consistent_hashing">Consistent Hashing with Virtual vNodes (Uniform)</option>
                <option value="centroid_ivf_hybrid">Centroid IVF Clustering (Prunes Non-Matching Nodes)</option>
                <option value="dimension_partitioned">Dimension Partitioning (High Scatter Overhead)</option>
                <option value="range_segmented">Range-Segmented Timestamp Buckets</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Metrics & Telemetry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Status Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Architecture Classification</span>
              <div className="text-xl font-black text-white mt-1 flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <span>{results.statusClassification.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{results.recommendationNote}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Recall Accuracy</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {results.recallAccuracyPct}%
              </div>
            </div>
          </div>

          {/* 4 Primary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>P99 Query Latency</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {results.p99QueryLatencyMs} <span className="text-xs text-slate-400 font-normal">ms</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">P50: {results.p50QueryLatencyMs} ms</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Server className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cluster RAM</span>
              </div>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-1">
                {results.memoryFootprintGb} <span className="text-xs text-slate-400 font-normal">GB</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Across {shardCount} shards</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>Ingestion Rate</span>
              </div>
              <div className="text-2xl font-black font-mono text-purple-400 mt-1">
                {results.indexingThroughputVectorsPerSec.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">vectors/second</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Annual Savings</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {currency === 'INR' ? '₹' : '$'}{(results.annualLatencyCostSavings / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">vs unoptimized</span>
            </div>
          </div>

          {/* Dynamic SVG Latency Percentile Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-white">Live Query Latency Percentile Distribution (P10 to P99.9)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Scatter-Gather Network Fanout</span>
            </div>

            <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 p-2">
              <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="vectorShardingPageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {svgData.path && (
                  <>
                    <path
                      d={`${svgData.path} L 500 140 L 0 140 Z`}
                      fill="url(#vectorShardingPageGrad)"
                    />
                    <path
                      d={svgData.path}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">P50 LATENCY</span>
                <span className="font-mono font-bold text-white">{results.p50QueryLatencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">P99 TAIL</span>
                <span className="font-mono font-bold text-emerald-400">{results.p99QueryLatencyMs} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RECALL TOP-K</span>
                <span className="font-mono font-bold text-cyan-400">{results.recallAccuracyPct}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ANNUAL TCO</span>
                <span className="font-mono font-bold text-purple-400">
                  {currency === 'INR' ? '₹' : '$'}{results.annualInfrastructureSpend.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Scale Your Multi-Agent Vector Infrastructure</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Deploy sovereign pgvector, Qdrant, or Milvus clusters with sub-3ms P99 latency and DPDP Act 2023 air-gapped security.
              </p>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger>
                <button className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-1.5 whitespace-nowrap">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
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

      {/* Technical Deep Dive Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Vector Sharding Architecture &amp; HNSW Performance Principles
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl">
            How enterprise AI agent swarms maintain sub-5ms semantic retrieval latency across hundreds of millions of embeddings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Consistent Hashing with Virtual vNodes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Conventional modulo hashing collapses during cluster resizing, requiring petabytes of vector data to rebalance across the network. 
                Consistent hashing rings with virtual vNodes ensure uniform distribution and sub-second node additions without query downtime.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">INT8 Scalar vs. Product Quantization (PQ)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                While FP32 provides theoretical perfection, INT8 quantization compresses coordinates by 72% with less than 0.5% recall loss. 
                For massive corpora exceeding 100M vectors, Product Quantization (PQ-64) compresses coordinates into byte centroids for maximum density.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Centroid IVF Scatter-Gather Pruning</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Brute-force scatter-gather queries every shard in parallel, creating network interface saturation at the coordinator node. 
                Hierarchical centroid clustering pre-filters candidate shards, fan-outing queries only to top cluster centroids for sub-3ms P99 responses.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Frequently Asked Technical Questions</h2>
          <div className="space-y-4 max-w-4xl">
            {[
              {
                q: "How does vector database sharding affect P99 query latency in multi-agent RAG systems?",
                a: "Sharding distributes vector embeddings across multiple nodes, reducing single-node memory saturation and allowing parallel HNSW graph traversals. However, excessive fan-out without centroid pruning introduces network scatter-gather latency. Consistent hashing with virtual nodes and centroid IVF clustering ensures P99 latencies remain sub-5ms even across hundreds of millions of vectors."
              },
              {
                q: "What is the trade-off between INT8 scalar quantization and top-k recall accuracy?",
                a: "INT8 scalar quantization compresses 32-bit floating point vector coordinates into 8-bit integers, slashing total cluster RAM footprints by approximately 72%. While product quantization (PQ) achieves even higher compression, it degrades recall by 2-4%. INT8 maintains greater than 99.2% recall accuracy while fitting inside cost-effective memory-optimized cloud instances."
              },
              {
                q: "Why is HNSW graph traversal preferred over flat brute-force index scans for enterprise scale?",
                a: "Flat index scans require O(N) exhaustive distance calculations across all vectors in the corpus, causing query latency to spike into seconds as vector counts cross 10 million. Hierarchical Navigable Small World (HNSW) graphs organize vectors into multi-layer skip-lists, providing logarithmic O(log N) search complexity that delivers sub-millisecond retrieval speeds."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm font-semibold text-white hover:text-emerald-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Embed Vector Sharding Simulator</span>
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this lightweight responsive iframe snippet to embed the simulator directly into your technical architecture blog or documentation.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto select-all">
              {embedCode}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="Vector DB Sharding &amp; HNSW Latency Simulator"
        simulatedMetrics={[
          { label: 'P99 Latency', value: `${results.p99QueryLatencyMs} ms` },
          { label: 'RAM Footprint', value: `${results.memoryFootprintGb} GB` },
          { label: 'Recall Accuracy', value: `${results.recallAccuracyPct}%` },
          { label: 'Est. Annual Savings', value: `${currency === 'INR' ? '₹' : '$'}${results.annualLatencyCostSavings.toLocaleString()}` }
        ]}
      />
    </div>
  );
}
