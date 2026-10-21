// Mathematical model for Tool #53:
// Enterprise Autonomous Agent Chunked Context Cross-Attention & Document RAG Memory Sharding Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_r1_671b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type InterconnectSpeed =
  | 'nvlink_4_900gbps'
  | 'nvlink_5_1800gbps'
  | 'pcie_gen5_128gbps';

export type HardwareCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb';

export interface CrossAttentionInputs {
  modelArchitecture: ModelArchitecture;
  documentCorpusTokens: number; // 16384 to 1048576 tokens
  documentChunkSize: number; // 256, 512, 1024, 2048 tokens
  numGpuNodes: number; // 1, 2, 4, 8, 16
  interconnectSpeed: InterconnectSpeed;
  hardwareCluster: HardwareCluster;
  currency: 'INR' | 'USD';
}

export interface ShardReductionStage {
  stage: string;
  description: string;
  activeNodes: number;
  latencyMs: number;
  bandwidthSaturationPct: number;
  status: 'SHARDED' | 'ATTENDED' | 'REDUCED';
}

export interface CrossAttentionOutputs {
  totalShards: number;
  shardsPerGpu: number;
  baselineConcatenatedRagLatencyMs: number;
  chunkedCrossAttentionLatencyMs: number;
  speedupMultiplier: number;
  memoryReductionPercent: number;
  annualClusterSavings: string;
  slaStatus: 'SUB_100MS_ULTRA_FAST' | 'SUB_250MS_ACCEPTABLE' | 'SLA_VIOLATION';
  shardReductionTrace: ShardReductionStage[];
}

export function calculateCrossAttention(inputs: CrossAttentionInputs): CrossAttentionOutputs {
  const {
    modelArchitecture,
    documentCorpusTokens,
    documentChunkSize,
    numGpuNodes,
    interconnectSpeed,
    hardwareCluster,
    currency
  } = inputs;

  // 1. Shard Topology
  const totalShards = Math.max(1, Math.ceil(documentCorpusTokens / documentChunkSize));
  const shardsPerGpu = Math.max(1, Math.ceil(totalShards / numGpuNodes));

  // 2. Hardware Compute & Interconnect Baseline
  let computeMsPer10kTokens = 38.0; // H100 default
  let clusterHourlyCostUsd = 4.5 * numGpuNodes;

  if (hardwareCluster === 'nvidia_b200_nvl') {
    computeMsPer10kTokens = 18.5;
    clusterHourlyCostUsd = 8.0 * numGpuNodes;
  } else if (hardwareCluster === 'nvidia_a100_80gb') {
    computeMsPer10kTokens = 65.0;
    clusterHourlyCostUsd = 3.2 * numGpuNodes;
  }

  let interconnectBwGbps = 900.0;
  if (interconnectSpeed === 'nvlink_5_1800gbps') {
    interconnectBwGbps = 1800.0;
  } else if (interconnectSpeed === 'pcie_gen5_128gbps') {
    interconnectBwGbps = 128.0;
  }

  // Model size multiplier
  let modelSizeWeight = 1.0;
  if (modelArchitecture === 'deepseek_r1_671b') {
    modelSizeWeight = 1.6;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    modelSizeWeight = 1.05;
  } else if (modelArchitecture === 'mistral_large_123b') {
    modelSizeWeight = 1.45;
  }

  // 3. Baseline Concatenated RAG Latency
  // Standard transformer quadratic self-attention over the entire concatenated document corpus
  const tokenScale = documentCorpusTokens / 10000.0;
  const quadraticFactor = Math.pow(tokenScale, 1.35); // memory-bound quadratic degradation
  const baselineConcatenatedRagLatencyMs = Math.round(
    (45.0 + quadraticFactor * computeMsPer10kTokens * modelSizeWeight) * 100
  ) / 100;

  // 4. Chunked Cross-Attention Latency
  // Query attends linearly to independent shards in parallel across GPU nodes
  const shardComputeTokens = shardsPerGpu * documentChunkSize;
  const localShardAttentionMs = 12.0 + (shardComputeTokens / 10000.0) * computeMsPer10kTokens * 0.35 * modelSizeWeight;

  // Inter-node fused log-sum-exp partial softmax reduction via NVLink
  const reductionDataBytes = totalShards * 4096; // partial logits & normalizers
  const reductionTimeMs = (reductionDataBytes / (interconnectBwGbps * 1e6)) * 1000.0 * Math.log2(Math.max(2, numGpuNodes));

  const chunkedCrossAttentionLatencyMs = Math.max(
    18.5,
    Math.round((localShardAttentionMs + reductionTimeMs) * 100) / 100
  );

  const speedupMultiplier = Math.round(
    (baselineConcatenatedRagLatencyMs / Math.max(1.0, chunkedCrossAttentionLatencyMs)) * 100
  ) / 100;

  // Memory savings: independent chunk KV caches avoid quadratic O(N²) attention matrices
  const memoryReductionPercent = Math.min(
    76.5,
    Math.round((1.0 - (1.0 / Math.pow(Math.max(2, totalShards), 0.3))) * 1000) / 10
  );

  // 5. Annual FinOps GPU Cluster Savings
  const dailyQueries = 15000;
  const secondsSavedPerQuery = (baselineConcatenatedRagLatencyMs - chunkedCrossAttentionLatencyMs) / 1000.0;
  const dailyGpuSecondsSaved = dailyQueries * Math.max(0, secondsSavedPerQuery);
  const dailyGpuHoursSaved = dailyGpuSecondsSaved / 3600.0;
  const annualUsdSavings = Math.round(dailyGpuHoursSaved * 365 * (clusterHourlyCostUsd / numGpuNodes));
  const annualInrSavings = Math.round(annualUsdSavings * 85.5);

  const annualClusterSavings =
    currency === 'INR'
      ? `₹${(annualInrSavings / 100000).toFixed(1)} Lakhs/yr`
      : `$${annualUsdSavings.toLocaleString()}/yr`;

  // 6. SLA Status
  let slaStatus: 'SUB_100MS_ULTRA_FAST' | 'SUB_250MS_ACCEPTABLE' | 'SLA_VIOLATION' = 'SUB_100MS_ULTRA_FAST';
  if (chunkedCrossAttentionLatencyMs > 250.0) {
    slaStatus = 'SLA_VIOLATION';
  } else if (chunkedCrossAttentionLatencyMs > 100.0) {
    slaStatus = 'SUB_250MS_ACCEPTABLE';
  }

  // 7. Shard Reduction Trace
  const shardReductionTrace: ShardReductionStage[] = [
    {
      stage: 'Stage 01: Corpus Ingestion & Shard Partitioning',
      description: `Partitioned ${documentCorpusTokens.toLocaleString()} tokens into ${totalShards} discrete ${documentChunkSize}-token shards`,
      activeNodes: numGpuNodes,
      latencyMs: Math.round(localShardAttentionMs * 0.18 * 100) / 100,
      bandwidthSaturationPct: 88.5,
      status: 'SHARDED'
    },
    {
      stage: 'Stage 02: Parallel Asynchronous Cross-Attention',
      description: `Executed linear attention over ${shardsPerGpu} shards/GPU simultaneously across ${numGpuNodes} nodes`,
      activeNodes: numGpuNodes,
      latencyMs: Math.round(localShardAttentionMs * 0.65 * 100) / 100,
      bandwidthSaturationPct: 94.2,
      status: 'ATTENDED'
    },
    {
      stage: 'Stage 03: Fused Log-Sum-Exp NVLink Reduction',
      description: `Hierarchical all-reduce of partial maximums over ${interconnectSpeed.replace(/_/g, ' ')}`,
      activeNodes: numGpuNodes,
      latencyMs: Math.round(reductionTimeMs * 100) / 100,
      bandwidthSaturationPct: 42.0,
      status: 'REDUCED'
    }
  ];

  return {
    totalShards,
    shardsPerGpu,
    baselineConcatenatedRagLatencyMs,
    chunkedCrossAttentionLatencyMs,
    speedupMultiplier,
    memoryReductionPercent,
    annualClusterSavings,
    slaStatus,
    shardReductionTrace
  };
}
