import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Database,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import {
  calculateVectorBenchmark,
  VectorBenchmarkInputs
} from '../calculator/vectorDbBenchmarkModel';

export default function EmbedVectorDbBenchmark() {
  const [vectorCount, setVectorCount] = useState<number>(2000000);
  const [dimensions, setDimensions] = useState<number>(1536);
  const [concurrentWorkers, setConcurrentWorkers] = useState<number>(16);
  const [quantizationType, setQuantizationType] = useState<'fp32' | 'fp16' | 'sq8' | 'pq'>('sq8');
  const [targetRecall] = useState<number>(0.96);
  const [monthlyQueryVolume] = useState<number>(5000000);

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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans antialiased">
      <Helmet>
        <title>Enterprise Vector DB & RAG Latency Benchmark Widget | Elesium</title>
        <meta
          name="description"
          content="Interactive benchmark widget comparing PostgreSQL pgvector (HNSW) vs Pinecone, Qdrant, and Milvus for enterprise RAG."
        />
        <link rel="canonical" href="https://elesium.online/embed/vector-db-benchmark" />
      </Helmet>

      {/* Widget Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-sky-400" />
          <h1 className="text-sm font-bold text-white tracking-tight">
            Vector DB &amp; RAG Latency Benchmark
          </h1>
        </div>
        <span className="text-[10px] font-mono text-sky-400 px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800">
          HNSW / SQ8
        </span>
      </div>

      {/* Quick Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Dataset Scale */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">Scale</span>
            <span className="text-sky-300 font-semibold">{(vectorCount / 1000000).toFixed(1)}M Vectors</span>
          </div>
          <input
            type="range"
            min="500000"
            max="10000000"
            step="500000"
            value={vectorCount}
            onChange={(e) => setVectorCount(Number(e.target.value))}
            className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        {/* Dimensions */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">Embedding Dim</span>
            <span className="text-sky-300 font-semibold">{dimensions}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[768, 1536, 3072].map((dim) => (
              <button
                key={dim}
                onClick={() => setDimensions(dim)}
                className={`py-0.5 text-[10px] font-mono rounded border transition-colors ${
                  dimensions === dim
                    ? 'border-sky-500 bg-sky-500/20 text-white'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {dim}
              </button>
            ))}
          </div>
        </div>

        {/* Quantization */}
        <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex justify-between text-[11px] font-mono mb-1">
            <span className="text-slate-400">Precision</span>
            <span className="text-sky-300 font-semibold">{quantizationType.toUpperCase()}</span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { id: 'fp32', label: 'FP32' },
              { id: 'sq8', label: 'SQ8' },
              { id: 'pq', label: 'PQ' }
            ].map((q) => (
              <button
                key={q.id}
                onClick={() => setQuantizationType(q.id as any)}
                className={`py-0.5 text-[10px] font-mono rounded border transition-colors ${
                  quantizationType === q.id
                    ? 'border-sky-500 bg-sky-500/20 text-white'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Concurrent Workers Slider */}
      <div className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 mb-4">
        <div className="flex justify-between text-[11px] font-mono mb-1">
          <span className="text-slate-400">Concurrent Multi-Agent Retrieval Queries</span>
          <span className="text-sky-300 font-semibold">{concurrentWorkers} Agents</span>
        </div>
        <input
          type="range"
          min="1"
          max="32"
          step="1"
          value={concurrentWorkers}
          onChange={(e) => setConcurrentWorkers(Number(e.target.value))}
          className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
        />
      </div>

      {/* Results Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {results.engines.slice(0, 2).map((eng, i) => (
          <div
            key={eng.name}
            className={`p-3 rounded-xl border ${
              i === 0
                ? 'border-sky-500/40 bg-sky-950/20'
                : 'border-slate-800 bg-slate-900/40'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-white truncate max-w-[150px]">{eng.name}</span>
              <span className="text-[11px] font-mono font-bold text-emerald-400">${eng.monthlyCostUsd}/mo</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-300 py-1.5 px-2 bg-slate-950/60 rounded border border-slate-800/80 mb-2">
              <div>
                <span className="text-slate-500 block">p99</span>
                <span className={eng.p99LatencyMs < 10 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {eng.p99LatencyMs}ms
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">RAM</span>
                <span>{eng.ramFootprintGb}GB</span>
              </div>
              <div>
                <span className="text-slate-500 block">Max QPS</span>
                <span className="text-sky-400">{eng.maxQps}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-sky-400" />
              <span>{eng.dataSovereigntyRating}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Cloud SaaS Comparison Note */}
      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/30 text-xs text-slate-400 flex items-center justify-between">
        <div>
          <span className="text-slate-300 font-semibold">Pinecone Serverless: </span>
          <span>${results.engines[2].monthlyCostUsd}/mo • {results.engines[2].p99LatencyMs}ms p99 (+WAN TLS)</span>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold">
          Save ${results.annualSavingsUsd.toLocaleString()}/yr self-hosted
        </span>
      </div>

      {/* Watermark Footer & Attribution */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <a
          href="https://elesium.online/tools/enterprise-vector-db-latency-benchmark"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white flex items-center gap-1 transition-colors"
        >
          Open Full Benchmark
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
