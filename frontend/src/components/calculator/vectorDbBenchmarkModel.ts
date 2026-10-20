/**
 * vectorDbBenchmarkModel.ts
 *
 * Mathematical and architectural benchmark simulation model comparing
 * Self-Hosted PostgreSQL pgvector (HNSW) vs Dedicated Managed Vector Databases
 * (Pinecone, Qdrant, Milvus) for Enterprise Multi-Agent RAG Workloads.
 */

export interface VectorBenchmarkInputs {
  vectorCount: number; // e.g. 500,000 to 10,000,000
  dimensions: number; // 384 (MiniLM), 768 (BGE-base), 1536 (text-embedding-3-small/ada-002), 3072 (text-embedding-3-large)
  concurrentWorkers: number; // 1 to 64 concurrent multi-agent retrieval queries
  quantizationType: 'fp32' | 'fp16' | 'sq8' | 'pq'; // Scalar Quantization or Product Quantization
  targetRecall: number; // 0.90 to 0.995 (90% to 99.5%)
  monthlyQueryVolume: number; // e.g. 1M to 50M queries/month
}

export interface EngineBenchmarkMetrics {
  name: string;
  engineType: 'self_hosted_sql' | 'managed_saas' | 'self_hosted_rust' | 'distributed_cpp';
  ramFootprintGb: number;
  indexBuildTimeHours: number;
  p50LatencyMs: number;
  p99LatencyMs: number;
  maxQps: number;
  recallScore: number;
  monthlyCostUsd: number;
  threeYearTcoUsd: number;
  dataSovereigntyRating: 'Air-Gapped Private VPC' | 'Multi-Tenant US-Cloud' | 'Self-Hosted Sovereign' | 'Distributed Cluster';
  dpdpComplianceReady: boolean;
  notes: string;
}

export interface VectorBenchmarkResults {
  inputs: VectorBenchmarkInputs;
  rawVectorSizeGb: number;
  engines: EngineBenchmarkMetrics[];
  winnerSelfHosted: string;
  winnerSaaS: string;
  annualSavingsUsd: number;
  latencyAdvantagePercentage: number;
  recommendedArchitecture: string;
}

export function calculateVectorBenchmark(inputs: VectorBenchmarkInputs): VectorBenchmarkResults {
  const {
    vectorCount,
    dimensions,
    concurrentWorkers,
    quantizationType,
    targetRecall,
    monthlyQueryVolume
  } = inputs;

  // Compression ratio based on quantization
  let compressionRatio = 1.0;
  if (quantizationType === 'fp16') {
    compressionRatio = 0.5;
  } else if (quantizationType === 'sq8') {
    compressionRatio = 0.25;
  } else if (quantizationType === 'pq') {
    compressionRatio = 0.125;
  }

  // Raw vector payload in GB: (N * D * bytes) / 10^9
  const rawVectorBytes = vectorCount * dimensions * 4;
  const rawVectorSizeGb = Number((rawVectorBytes / (1024 * 1024 * 1024)).toFixed(2));

  // HNSW Graph overhead: approximately (M * 2 * 4 bytes + entry point tables) per vector
  // Default M=16, efConstruction=64
  const mParameter = 16;
  const graphOverheadPerVectorBytes = mParameter * 2 * 8; // ~256 bytes per vector for graph edges
  const totalGraphOverheadGb = Number(((vectorCount * graphOverheadPerVectorBytes) / (1024 * 1024 * 1024)).toFixed(2));

  // 1. PostgreSQL pgvector (HNSW)
  // Index = compressed vectors + graph links in shared_buffers or memory-mapped storage
  const pgVectorRam = Number((rawVectorSizeGb * compressionRatio + totalGraphOverheadGb * 1.15).toFixed(2));
  // Index build time: ~50,000 vectors/sec single core or ~200,000/sec with parallel workers
  const pgBuildHours = Number((vectorCount / (120000 * 3600)).toFixed(2));
  // Base p50 query latency with HNSW: ~3.2ms for 1536-dim at M=16, ef_search=64
  const pgBaseP50 = 2.4 + (dimensions / 1536) * 0.8 + (Math.max(0, targetRecall - 0.95) * 20);
  const pgConcurrencyContention = Math.pow(concurrentWorkers, 0.45) * 0.4;
  const pgP50 = Number((pgBaseP50 + pgConcurrencyContention).toFixed(1));
  const pgP99 = Number((pgP50 * 2.1 + concurrentWorkers * 0.25).toFixed(1));
  const pgMaxQps = Math.round((concurrentWorkers * 1000) / pgP50);
  // Infra cost: AWS c6i.2xlarge (32GB RAM) or r6i.xlarge = ~$180/mo EC2 + EBS
  const pgMonthlyEc2 = Math.max(140, Math.ceil(pgVectorRam / 30) * 160);
  const pgMonthlyCost = pgMonthlyEc2 + 25; // storage
  const pg3YrTco = pgMonthlyCost * 36;

  // 2. Pinecone Serverless (SaaS Managed)
  // Pinecone charges per read unit (RU), write unit (WU), and storage
  // Storage: $0.33 per GB/mo. Reads: ~$0.008 per 1,000 RUs
  const pineconeStorageCost = Math.max(25, rawVectorSizeGb * 0.45);
  const pineconeReadUnitsPerQuery = dimensions > 1536 ? 2 : 1;
  const pineconeQueryCost = (monthlyQueryVolume / 1000) * 0.0085 * pineconeReadUnitsPerQuery;
  const pineconeMonthlyCost = Math.round(pineconeStorageCost + pineconeQueryCost);
  const pinecone3YrTco = pineconeMonthlyCost * 36;
  // SaaS latency introduces public WAN internet round-trip (18ms to 45ms TLS)
  const pineconeP50 = Number((14.5 + (dimensions / 1536) * 1.5 + (concurrentWorkers > 16 ? 4.0 : 0)).toFixed(1));
  const pineconeP99 = Number((pineconeP50 * 2.8 + 12.0).toFixed(1));
  const pineconeMaxQps = Math.round(2500 * (1 - (targetRecall - 0.9) * 0.3));

  // 3. Qdrant (Rust-Native Self-Hosted)
  // Extremely cache-efficient, SIMD AVX-512 distance kernels
  const qdrantRam = Number((rawVectorSizeGb * compressionRatio * 0.85 + totalGraphOverheadGb * 0.8).toFixed(2));
  const qdrantBuildHours = Number((vectorCount / (240000 * 3600)).toFixed(2));
  const qdrantBaseP50 = 1.6 + (dimensions / 1536) * 0.5 + (Math.max(0, targetRecall - 0.95) * 15);
  const qdrantP50 = Number((qdrantBaseP50 + Math.pow(concurrentWorkers, 0.35) * 0.25).toFixed(1));
  const qdrantP99 = Number((qdrantP50 * 1.8 + concurrentWorkers * 0.15).toFixed(1));
  const qdrantMaxQps = Math.round((concurrentWorkers * 1000) / (qdrantP50 * 0.8));
  const qdrantMonthlyCost = Math.max(120, Math.ceil(qdrantRam / 30) * 140) + 20;
  const qdrant3YrTco = qdrantMonthlyCost * 36;

  // 4. Milvus (Distributed C++/Go)
  // Tuned for >10M scale, segment-based memory indexing
  const milvusRam = Number((rawVectorSizeGb * compressionRatio * 1.1 + totalGraphOverheadGb * 1.2).toFixed(2));
  const milvusBuildHours = Number((vectorCount / (180000 * 3600)).toFixed(2));
  const milvusBaseP50 = 3.5 + (dimensions / 1536) * 0.7;
  const milvusP50 = Number((milvusBaseP50 + Math.pow(concurrentWorkers, 0.4) * 0.35).toFixed(1));
  const milvusP99 = Number((milvusP50 * 2.3 + concurrentWorkers * 0.2).toFixed(1));
  const milvusMaxQps = Math.round((concurrentWorkers * 1000) / milvusP50);
  const milvusMonthlyCost = Math.max(220, Math.ceil(milvusRam / 25) * 180) + 50; // min 3 nodes for etcd/pulsar/minio
  const milvus3YrTco = milvusMonthlyCost * 36;

  const engines: EngineBenchmarkMetrics[] = [
    {
      name: 'PostgreSQL pgvector (v0.8+ HNSW)',
      engineType: 'self_hosted_sql',
      ramFootprintGb: pgVectorRam,
      indexBuildTimeHours: pgBuildHours,
      p50LatencyMs: pgP50,
      p99LatencyMs: pgP99,
      maxQps: pgMaxQps,
      recallScore: Number((targetRecall * 100).toFixed(1)),
      monthlyCostUsd: pgMonthlyCost,
      threeYearTcoUsd: pg3YrTco,
      dataSovereigntyRating: 'Air-Gapped Private VPC',
      dpdpComplianceReady: true,
      notes: 'Colocates relational business state, transactional ACID row locks, and vector embeddings in a single audited PostgreSQL cluster with zero external network hops.'
    },
    {
      name: 'Qdrant (Rust Vector Engine)',
      engineType: 'self_hosted_rust',
      ramFootprintGb: qdrantRam,
      indexBuildTimeHours: qdrantBuildHours,
      p50LatencyMs: qdrantP50,
      p99LatencyMs: qdrantP99,
      maxQps: qdrantMaxQps,
      recallScore: Number((Math.min(0.998, targetRecall + 0.005) * 100).toFixed(1)),
      monthlyCostUsd: qdrantMonthlyCost,
      threeYearTcoUsd: qdrant3YrTco,
      dataSovereigntyRating: 'Self-Hosted Sovereign',
      dpdpComplianceReady: true,
      notes: 'Native AVX-512 hardware acceleration with scalar quantization. Delivers the lowest p99 latency in pure standalone vector search.'
    },
    {
      name: 'Pinecone Serverless (Managed SaaS)',
      engineType: 'managed_saas',
      ramFootprintGb: rawVectorSizeGb,
      indexBuildTimeHours: 0.1, // managed
      p50LatencyMs: pineconeP50,
      p99LatencyMs: pineconeP99,
      maxQps: pineconeMaxQps,
      recallScore: Number((targetRecall * 100).toFixed(1)),
      monthlyCostUsd: pineconeMonthlyCost,
      threeYearTcoUsd: pinecone3YrTco,
      dataSovereigntyRating: 'Multi-Tenant US-Cloud',
      dpdpComplianceReady: false,
      notes: 'Serverless operational convenience, but introduces WAN network latency (15–40ms) and trans-border telemetry transmission risks under DPDP Act 2023.'
    },
    {
      name: 'Milvus Distributed (Linux Foundation)',
      engineType: 'distributed_cpp',
      ramFootprintGb: milvusRam,
      indexBuildTimeHours: milvusBuildHours,
      p50LatencyMs: milvusP50,
      p99LatencyMs: milvusP99,
      maxQps: milvusMaxQps,
      recallScore: Number((targetRecall * 100).toFixed(1)),
      monthlyCostUsd: milvusMonthlyCost,
      threeYearTcoUsd: milvus3YrTco,
      dataSovereigntyRating: 'Distributed Cluster',
      dpdpComplianceReady: true,
      notes: 'Horizontally scalable to 100M+ vectors across Kubernetes pods. Carries higher cluster management complexity with etcd and MinIO dependencies.'
    }
  ];

  const annualSavings = (pineconeMonthlyCost - pgMonthlyCost) * 12;
  const latencyAdvantage = Math.round(((pineconeP99 - pgP99) / pineconeP99) * 100);

  return {
    inputs,
    rawVectorSizeGb,
    engines,
    winnerSelfHosted: 'PostgreSQL pgvector (v0.8+ HNSW)',
    winnerSaaS: 'Pinecone Serverless',
    annualSavingsUsd: Math.max(0, annualSavings),
    latencyAdvantagePercentage: Math.max(0, latencyAdvantage),
    recommendedArchitecture:
      vectorCount <= 5000000
        ? 'PostgreSQL pgvector (HNSW) in Private VPC for unified ACID relational data and sub-5ms local retrieval without multi-tenant compliance exposure.'
        : 'Qdrant / Milvus on dedicated private Kubernetes nodes with SQ8 scalar quantization for high-throughput multi-million vector scalability.'
  };
}
