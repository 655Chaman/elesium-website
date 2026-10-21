import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateVectorSharding,
  VectorShardingInputs,
  ShardingStrategy,
  QuantizationMode,
  VectorDimension
} from '../calculator/agentVectorShardingModel';
import { Database, ArrowUpRight, Cpu } from 'lucide-react';

export default function EmbedAgentVectorShardingSimulator() {
  const [totalVectorsMillions, setTotalVectorsMillions] = useState<number>(50);
  const [shardCount, setShardCount] = useState<number>(8);
  const [vectorDimensions, setVectorDimensions] = useState<VectorDimension>(1536);
  const [shardingStrategy, setShardingStrategy] = useState<ShardingStrategy>('consistent_hashing');
  const [quantizationMode, setQuantizationMode] = useState<QuantizationMode>('int8_scalar_quantization');
  const [hnswEfSearch, setHnswEfSearch] = useState<number>(64);

  const inputs: VectorShardingInputs = useMemo(() => ({
    totalVectorsMillions,
    vectorDimensions,
    hnswM: 32,
    hnswEfSearch,
    shardCount,
    shardingStrategy,
    quantizationMode,
    currency: 'INR'
  }), [
    totalVectorsMillions,
    vectorDimensions,
    hnswEfSearch,
    shardCount,
    shardingStrategy,
    quantizationMode
  ]);

  const results = useMemo(() => {
    return calculateVectorSharding(inputs);
  }, [inputs]);

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(15, results.p99QueryLatencyMs * 1.25);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.latencyMs / maxLatency) * (height * 0.75) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.p99QueryLatencyMs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Vector DB Sharding &amp; HNSW Latency Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-vector-db-sharding-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Enterprise Vector Database Sharding Simulator</h1>
              <p className="text-[10px] text-slate-400">HNSW Graph ANN Traversal &amp; Distributed Quantization</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            {results.statusClassification}
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">P99 Latency</span>
            <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
              {results.p99QueryLatencyMs} <span className="text-xs text-slate-500 font-normal">ms</span>
            </div>
            <span className="text-[9px] text-slate-500 block">P50: {results.p50QueryLatencyMs}ms</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">RAM Footprint</span>
            <div className="text-lg font-black font-mono text-cyan-400 mt-0.5">
              {results.memoryFootprintGb} <span className="text-xs text-slate-500 font-normal">GB</span>
            </div>
            <span className="text-[9px] text-slate-500 block">Across {shardCount} shards</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Recall Rate</span>
            <div className="text-lg font-black font-mono text-amber-400 mt-0.5">
              {results.recallAccuracyPct}%
            </div>
            <span className="text-[9px] text-slate-500 block">Top-K accuracy</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Throughput</span>
            <div className="text-lg font-black font-mono text-purple-400 mt-0.5">
              {results.indexingThroughputVectorsPerSec.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 block">vectors/sec</span>
          </div>
        </div>

        {/* SVG Latency Percentile Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> HNSW Search Latency Distribution (P10 to P99.9)
            </span>
            <span className="text-emerald-400 font-mono text-[10px]">P99: {results.p99QueryLatencyMs}ms</span>
          </div>
          <div className="relative h-20 w-full overflow-hidden rounded bg-slate-950/60 border border-slate-900">
            <svg viewBox="0 0 340 90" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="vectorShardingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {svgData.path && (
                <>
                  <path
                    d={`${svgData.path} L 340 90 L 0 90 Z`}
                    fill="url(#vectorShardingGrad)"
                  />
                  <path
                    d={svgData.path}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Total Vectors: <strong className="text-white font-mono">{totalVectorsMillions}M</strong></span>
              <span className="text-slate-500">1M – 500M</span>
            </div>
            <input
              type="range"
              min="1"
              max="500"
              step="5"
              value={totalVectorsMillions}
              onChange={(e) => setTotalVectorsMillions(Number(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Cluster Shards: <strong className="text-white font-mono">{shardCount}</strong></span>
                <span className="text-slate-500">1 – 64</span>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={shardCount}
                onChange={(e) => setShardCount(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>efSearch: <strong className="text-white font-mono">{hnswEfSearch}</strong></span>
                <span className="text-slate-500">16 – 256</span>
              </div>
              <input
                type="range"
                min="16"
                max="256"
                step="8"
                value={hnswEfSearch}
                onChange={(e) => setHnswEfSearch(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Dimensionality</label>
              <select
                value={vectorDimensions}
                onChange={(e) => setVectorDimensions(Number(e.target.value) as VectorDimension)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value={384}>384d (MiniLM-L6)</option>
                <option value={768}>768d (BERT / RoBERTa)</option>
                <option value={1536}>1536d (OpenAI text-embedding-3-small)</option>
                <option value={3072}>3072d (text-embedding-3-large)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Quantization Compression</label>
              <select
                value={quantizationMode}
                onChange={(e) => setQuantizationMode(e.target.value as QuantizationMode)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="fp32_uncompressed">FP32 Uncompressed (100% Recall)</option>
                <option value="fp16_half_precision">FP16 Half-Precision (50% RAM)</option>
                <option value="int8_scalar_quantization">INT8 Scalar Quantization (28% RAM)</option>
                <option value="pq_product_quantization">PQ Product Quantization (16% RAM)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-slate-400 block mb-1">Sharding Architecture Strategy</label>
            <select
              value={shardingStrategy}
              onChange={(e) => setShardingStrategy(e.target.value as ShardingStrategy)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="consistent_hashing">Consistent Hashing with Virtual VNodes</option>
              <option value="centroid_ivf_hybrid">Centroid IVF Clustering (Prune Irrelevant Shards)</option>
              <option value="dimension_partitioned">Dimension Partitioning (Distributed Matrix)</option>
              <option value="range_segmented">Range-Segmented Timestamp Buckets</option>
            </select>
          </div>
        </div>

        {/* Footer & Watermark */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
          <div className="text-slate-500">
            Est. Annual TCO: <span className="text-slate-300 font-mono font-medium">₹{results.annualInfrastructureSpend.toLocaleString()}</span>
          </div>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            Powered by Elesium Enterprise AI Solutions
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
