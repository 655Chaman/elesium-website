export type ShardingStrategy = 
  | 'consistent_hashing' 
  | 'dimension_partitioned' 
  | 'centroid_ivf_hybrid' 
  | 'range_segmented';

export type QuantizationMode = 
  | 'fp32_uncompressed' 
  | 'fp16_half_precision' 
  | 'int8_scalar_quantization' 
  | 'pq_product_quantization';

export type VectorDimension = 384 | 768 | 1536 | 3072;

export interface VectorShardingInputs {
  totalVectorsMillions: number; // 1 to 500
  vectorDimensions: VectorDimension; // 384, 768, 1536, 3072
  hnswM: number; // 16 to 64
  hnswEfSearch: number; // 16 to 256
  shardCount: number; // 1 to 64
  shardingStrategy: ShardingStrategy;
  quantizationMode: QuantizationMode;
  currency: 'INR' | 'USD';
}

export interface LatencyDistributionPoint {
  percentile: number; // 0 to 100
  latencyMs: number;
}

export interface VectorShardingOutputs {
  p99QueryLatencyMs: number;
  p50QueryLatencyMs: number;
  indexingThroughputVectorsPerSec: number;
  memoryFootprintGb: number;
  recallAccuracyPct: number;
  annualInfrastructureSpend: number;
  annualLatencyCostSavings: number;
  statusClassification: 'SOVEREIGN_DISTRIBUTED_SCALE' | 'BALANCED_HIGH_RECALL' | 'MEMORY_PRESSURE_SATURATION' | 'UNOPTIMIZED_BOTTLENECK';
  recommendationNote: string;
  latencyTrace: LatencyDistributionPoint[];
}

export function calculateVectorSharding(inputs: VectorShardingInputs): VectorShardingOutputs {
  const {
    totalVectorsMillions,
    vectorDimensions,
    hnswM,
    hnswEfSearch,
    shardCount,
    shardingStrategy,
    quantizationMode,
    currency
  } = inputs;

  // 1. Raw Vector Size calculation (Bytes per vector)
  let bytesPerDimension = 4; // FP32
  let memoryCompressionFactor = 1.0;
  let recallPenalty = 0.0;

  if (quantizationMode === 'fp16_half_precision') {
    bytesPerDimension = 2;
    memoryCompressionFactor = 0.52;
    recallPenalty = 0.3;
  } else if (quantizationMode === 'int8_scalar_quantization') {
    bytesPerDimension = 1;
    memoryCompressionFactor = 0.28;
    recallPenalty = 1.1;
  } else if (quantizationMode === 'pq_product_quantization') {
    bytesPerDimension = 0.5;
    memoryCompressionFactor = 0.16;
    recallPenalty = 2.8;
  }

  // HNSW Graph overhead: approximately (hnswM * 8 bytes * 1.5) per vector + ID storage
  const hnswGraphOverheadBytes = hnswM * 12 + 16;
  const rawVectorBytes = vectorDimensions * bytesPerDimension;
  const totalBytesPerVector = (rawVectorBytes + hnswGraphOverheadBytes) * memoryCompressionFactor;

  // Total RAM in Gigabytes
  const memoryFootprintGb = Math.round(
    ((totalVectorsMillions * 1_000_000 * totalBytesPerVector) / (1024 * 1024 * 1024)) * 10
  ) / 10;

  // Sharding distribution efficiency
  let shardingEfficiency = 1.0;
  if (shardingStrategy === 'consistent_hashing') {
    shardingEfficiency = 0.94; // Virtual nodes ensure uniform scatter-gather
  } else if (shardingStrategy === 'centroid_ivf_hybrid') {
    shardingEfficiency = 1.15; // Prunes non-matching shards entirely
  } else if (shardingStrategy === 'dimension_partitioned') {
    shardingEfficiency = 0.78; // High cross-shard aggregation latency
  } else if (shardingStrategy === 'range_segmented') {
    shardingEfficiency = 0.85; // Hot-spotting risks on recent vector IDs
  }

  // Latency calculation (HNSW logarithmic graph traversal O(log N))
  // Scatter-gather latency across shards: parallel search overhead + network hop
  const vectorsPerShard = (totalVectorsMillions * 1_000_000) / Math.max(1, shardCount);
  const graphDepth = Math.log2(Math.max(1000, vectorsPerShard));

  // Base search latency in ms per shard
  const baseHopTimeMs = 0.045; // Sub-millisecond CPU memory cache traversal
  const searchSteps = graphDepth * (hnswEfSearch / 24);
  const shardComputeLatencyMs = searchSteps * baseHopTimeMs * (vectorDimensions / 768);

  // Network merge latency: logarithmic or fan-out penalty
  const networkMergeLatencyMs = shardCount > 1 
    ? 0.35 + Math.log2(shardCount) * 0.22 
    : 0.05;

  const p50QueryLatencyMs = Math.round(
    ((shardComputeLatencyMs / (shardingEfficiency * 1.2)) + networkMergeLatencyMs) * 100
  ) / 100;

  // P99 tail latency (jitter, garbage collection, memory bus contention)
  const tailJitterMultiplier = (shardCount > 16) ? 1.65 : 1.42;
  const p99QueryLatencyMs = Math.round(
    (p50QueryLatencyMs * tailJitterMultiplier + (memoryFootprintGb > 256 ? 1.2 : 0.2)) * 100
  ) / 100;

  // Indexing throughput (vectors / second)
  // Higher M = slower indexing; higher shard count = horizontal indexing scale
  const baseIndexingPerCore = 2400; // vectors/sec per core
  const dimensionIndexingPenalty = 768 / vectorDimensions;
  const hnswIndexingOverhead = 32 / hnswM;
  const indexingThroughputVectorsPerSec = Math.round(
    baseIndexingPerCore * Math.min(32, shardCount * 2) * dimensionIndexingPenalty * hnswIndexingOverhead * (1 / memoryCompressionFactor)
  );

  // Recall accuracy calculation
  const baseRecall = 99.8;
  const efSearchBoost = Math.min(2.5, Math.log2(hnswEfSearch / 16) * 0.8);
  const mBoost = Math.min(1.5, Math.log2(hnswM / 16) * 0.6);
  let computedRecall = baseRecall + efSearchBoost + mBoost - recallPenalty;
  if (computedRecall > 99.95) computedRecall = 99.95;
  if (computedRecall < 88.0) computedRecall = 88.0;
  const recallAccuracyPct = Math.round(computedRecall * 100) / 100;

  // Cost calculation (Cloud High-Memory RAM instances per GB-month)
  const usdRatePerGbMonth = 3.85; // AWS r6i/r7i memory-optimized pricing
  const annualSpendUsd = memoryFootprintGb * usdRatePerGbMonth * 12 + (shardCount * 450); // node base overhead
  const inrConversion = 87.5;
  const annualInfrastructureSpend = currency === 'INR' 
    ? Math.round(annualSpendUsd * inrConversion) 
    : Math.round(annualSpendUsd);

  // Cost savings vs unoptimized uncompressed single monolith
  const baselineUnoptimizedGb = ((totalVectorsMillions * 1_000_000 * (vectorDimensions * 4 + 64)) / (1024 * 1024 * 1024));
  const baselineAnnualSpendUsd = baselineUnoptimizedGb * usdRatePerGbMonth * 12 * 1.8; // 80% penalty for runaway latency timeouts
  const annualSavingsUsd = Math.max(0, baselineAnnualSpendUsd - annualSpendUsd);
  const annualLatencyCostSavings = currency === 'INR' 
    ? Math.round(annualSavingsUsd * inrConversion) 
    : Math.round(annualSavingsUsd);

  // Status Classification
  let statusClassification: VectorShardingOutputs['statusClassification'] = 'BALANCED_HIGH_RECALL';
  let recommendationNote = 'Optimal vector sharding topology. High recall and low latency verified.';

  if (p99QueryLatencyMs < 4.0 && recallAccuracyPct >= 98.0 && shardCount >= 4) {
    statusClassification = 'SOVEREIGN_DISTRIBUTED_SCALE';
    recommendationNote = 'Ultra-low latency sub-4ms P99 cluster. Scatter-gather fanout is fully amortized.';
  } else if (memoryFootprintGb > 512 && shardCount < 4) {
    statusClassification = 'MEMORY_PRESSURE_SATURATION';
    recommendationNote = 'Dangerous RAM saturation on single nodes. Scale shardCount to prevent Linux OOM-killer evictions.';
  } else if (p99QueryLatencyMs > 15.0 || recallAccuracyPct < 92.0) {
    statusClassification = 'UNOPTIMIZED_BOTTLENECK';
    recommendationNote = 'Excessive latency or unacceptable recall degradation. Increase efSearch and adopt centroid IVF hybrid sharding.';
  }

  // 20-Point Latency Distribution Curve (0th to 99.9th percentile)
  const latencyTrace: LatencyDistributionPoint[] = [];
  const percentiles = [
    10, 20, 30, 40, 50, 60, 70, 75, 80, 85, 90, 92, 94, 95, 96, 97, 98, 99, 99.5, 99.9
  ];

  percentiles.forEach(p => {
    let pLatency = p50QueryLatencyMs;
    if (p < 50) {
      pLatency = p50QueryLatencyMs * (0.65 + (p / 50) * 0.35);
    } else {
      const tailProgress = (p - 50) / 50; // 0 to 1
      pLatency = p50QueryLatencyMs + (p99QueryLatencyMs - p50QueryLatencyMs) * Math.pow(tailProgress, 1.8);
      if (p > 99) {
        pLatency *= (1 + (p - 99) * 0.4);
      }
    }
    latencyTrace.push({
      percentile: p,
      latencyMs: Math.round(pLatency * 100) / 100
    });
  });

  return {
    p99QueryLatencyMs,
    p50QueryLatencyMs,
    indexingThroughputVectorsPerSec,
    memoryFootprintGb,
    recallAccuracyPct,
    annualInfrastructureSpend,
    annualLatencyCostSavings,
    statusClassification,
    recommendationNote,
    latencyTrace
  };
}
