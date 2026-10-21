// Mathematical model for Tool #52:
// Enterprise Autonomous Agent KV Cache Paging & Chunked Prefix Caching Multi-Tenant Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_r1_671b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type CacheEvictionPolicy =
  | 'radix_tree_lru'
  | 'frequency_weighted'
  | 'fifo_stream';

export type HardwareCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_ada';

export interface PrefixCachingInputs {
  modelArchitecture: ModelArchitecture;
  sharedPrefixTokens: number; // 256 to 32768
  uniqueQueryTokens: number; // 64 to 8192
  concurrentStreams: number; // 1 to 256
  cacheEvictionPolicy: CacheEvictionPolicy;
  hardwareCluster: HardwareCluster;
  currency: 'INR' | 'USD';
}

export interface RadixTreeNode {
  depth: number;
  nodeName: string;
  tokenRange: string;
  hitRatePercent: number;
  memoryReusedMb: number;
  status: 'CACHED_HIT' | 'COMPUTED_MISS' | 'EVICTED_RELOAD';
}

export interface PrefixCachingOutputs {
  prefixHitRatePercent: number;
  baselineTtftMs: number;
  cachedTtftMs: number;
  latencyReductionPercent: number;
  vramSavedGb: number;
  effectiveThroughputMultiplier: number;
  annualClusterSavings: string;
  slaStatus: 'SUB_30MS_OPTIMAL' | 'SUB_60MS_ACCEPTABLE' | 'SLA_VIOLATION';
  radixTreeTrace: RadixTreeNode[];
}

export function calculatePrefixCaching(inputs: PrefixCachingInputs): PrefixCachingOutputs {
  const {
    modelArchitecture,
    sharedPrefixTokens,
    uniqueQueryTokens,
    concurrentStreams,
    cacheEvictionPolicy,
    hardwareCluster,
    currency
  } = inputs;

  // 1. Hardware baseline compute rate (ms per 1k prefill tokens)
  let msPer1kPrefill = 18.5; // H100 default
  let clusterHourlyCostUsd = 4.2;

  if (hardwareCluster === 'nvidia_b200_nvl') {
    msPer1kPrefill = 9.8;
    clusterHourlyCostUsd = 7.5;
  } else if (hardwareCluster === 'nvidia_a100_80gb') {
    msPer1kPrefill = 34.0;
    clusterHourlyCostUsd = 2.8;
  } else if (hardwareCluster === 'nvidia_l40s_ada') {
    msPer1kPrefill = 42.0;
    clusterHourlyCostUsd = 1.9;
  }

  // Model size multiplier
  let modelSizeWeight = 1.0;
  let kvHeads = 8;
  let headDim = 128;
  let numLayers = 80;

  if (modelArchitecture === 'deepseek_r1_671b') {
    modelSizeWeight = 1.85; // MLA architecture compression
    kvHeads = 1; // MLA decoupled latent
    headDim = 512;
    numLayers = 61;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    modelSizeWeight = 1.05;
    kvHeads = 8;
    headDim = 128;
    numLayers = 80;
  } else if (modelArchitecture === 'mistral_large_123b') {
    modelSizeWeight = 1.6;
    kvHeads = 8;
    headDim = 128;
    numLayers = 88;
  }

  // 2. Prefix Hit Rate calculation based on eviction policy
  const totalPromptTokens = sharedPrefixTokens + uniqueQueryTokens;
  const theoreticalMaxHitRate = (sharedPrefixTokens / totalPromptTokens) * 100.0;

  let policyEfficiency = 0.96; // radix_tree_lru
  if (cacheEvictionPolicy === 'frequency_weighted') {
    policyEfficiency = 0.98;
  } else if (cacheEvictionPolicy === 'fifo_stream') {
    policyEfficiency = 0.82;
  }

  const prefixHitRatePercent = Math.min(
    99.2,
    Math.round(theoreticalMaxHitRate * policyEfficiency * 10) / 10
  );

  // 3. TTFT Latency Calculations
  // Baseline: No prefix caching. Every stream re-computes the entire prompt from scratch
  const baselineTtftMs = Math.round(
    (totalPromptTokens / 1000.0) * msPer1kPrefill * modelSizeWeight * 100
  ) / 100;

  // Cached TTFT: Prefix is an O(1) Radix pointer lookup + zero-copy page dereference (~0.6ms)
  // Only unique query tokens undergo forward prefill compute
  const lookupOverheadMs = 0.65;
  const uncachedPortionTokens = totalPromptTokens - (sharedPrefixTokens * (prefixHitRatePercent / 100.0));
  const cachedTtftMs = Math.max(
    1.8,
    Math.round(
      ((uncachedPortionTokens / 1000.0) * msPer1kPrefill * modelSizeWeight + lookupOverheadMs) * 100
    ) / 100
  );

  const latencyReductionPercent = Math.round(
    ((baselineTtftMs - cachedTtftMs) / Math.max(0.1, baselineTtftMs)) * 1000
  ) / 10;

  // 4. Zero-Copy VRAM Savings
  // Standard serving: each concurrent stream allocates full KV cache
  // Prefix caching: shared prefix tokens allocated once; (streams - 1) streams share physical pages
  // KV bytes per token = 2 (K & V) * numLayers * kvHeads * headDim * 2 bytes (FP16)
  const bytesPerToken = 2 * numLayers * kvHeads * headDim * 2;
  const redundantPrefixAllocationsBytes = Math.max(0, concurrentStreams - 1) * sharedPrefixTokens * bytesPerToken;
  const vramSavedGb = Math.round((redundantPrefixAllocationsBytes / (1024 * 1024 * 1024)) * 100) / 100;

  // 5. Throughput Multiplier
  const effectiveThroughputMultiplier = Math.round((baselineTtftMs / Math.max(1.0, cachedTtftMs)) * 100) / 100;

  // 6. Annual FinOps Savings (INR / USD)
  // Saved GPU prefill compute hours converted to annual cost
  const dailyRequests = concurrentStreams * 1200; // typical high concurrency cluster
  const secondsSavedPerRequest = (baselineTtftMs - cachedTtftMs) / 1000.0;
  const dailyGpuSecondsSaved = dailyRequests * secondsSavedPerRequest;
  const dailyGpuHoursSaved = dailyGpuSecondsSaved / 3600.0;
  const annualUsdSavings = Math.round(dailyGpuHoursSaved * 365 * clusterHourlyCostUsd);
  const annualInrSavings = Math.round(annualUsdSavings * 85.5);

  const annualClusterSavings =
    currency === 'INR'
      ? `₹${(annualInrSavings / 100000).toFixed(1)} Lakhs/yr`
      : `$${annualUsdSavings.toLocaleString()}/yr`;

  // 7. SLA Status
  let slaStatus: 'SUB_30MS_OPTIMAL' | 'SUB_60MS_ACCEPTABLE' | 'SLA_VIOLATION' = 'SUB_30MS_OPTIMAL';
  if (cachedTtftMs > 60.0) {
    slaStatus = 'SLA_VIOLATION';
  } else if (cachedTtftMs > 30.0) {
    slaStatus = 'SUB_60MS_ACCEPTABLE';
  }

  // 8. Radix Tree Hierarchy Trace
  const rootChunk = Math.floor(sharedPrefixTokens * 0.4);
  const midChunk = Math.floor(sharedPrefixTokens * 0.35);
  const leafChunk = sharedPrefixTokens - rootChunk - midChunk;

  const radixTreeTrace: RadixTreeNode[] = [
    {
      depth: 0,
      nodeName: 'Radix Root: System Persona & Compliance Constraints',
      tokenRange: `Tokens 0 - ${rootChunk.toLocaleString()}`,
      hitRatePercent: 99.8,
      memoryReusedMb: Math.round(((concurrentStreams - 1) * rootChunk * bytesPerToken) / (1024 * 1024)),
      status: 'CACHED_HIT'
    },
    {
      depth: 1,
      nodeName: 'Radix Mid-Node: Tool Schemas & Output Encoders',
      tokenRange: `Tokens ${(rootChunk + 1).toLocaleString()} - ${(rootChunk + midChunk).toLocaleString()}`,
      hitRatePercent: 96.4,
      memoryReusedMb: Math.round(((concurrentStreams - 1) * midChunk * bytesPerToken) / (1024 * 1024)),
      status: 'CACHED_HIT'
    },
    {
      depth: 2,
      nodeName: 'Radix Leaf-Node: Few-Shot Few-Turn Dialogue Context',
      tokenRange: `Tokens ${(rootChunk + midChunk + 1).toLocaleString()} - ${sharedPrefixTokens.toLocaleString()}`,
      hitRatePercent: Math.round(prefixHitRatePercent * 0.92 * 10) / 10,
      memoryReusedMb: Math.round(((concurrentStreams - 1) * leafChunk * bytesPerToken) / (1024 * 1024)),
      status: 'CACHED_HIT'
    },
    {
      depth: 3,
      nodeName: 'Dynamic User Query & Dynamic Execution Branch',
      tokenRange: `Tokens ${(sharedPrefixTokens + 1).toLocaleString()} - ${totalPromptTokens.toLocaleString()}`,
      hitRatePercent: 0.0,
      memoryReusedMb: 0,
      status: 'COMPUTED_MISS'
    }
  ];

  return {
    prefixHitRatePercent,
    baselineTtftMs,
    cachedTtftMs,
    latencyReductionPercent,
    vramSavedGb,
    effectiveThroughputMultiplier,
    annualClusterSavings,
    slaStatus,
    radixTreeTrace
  };
}
