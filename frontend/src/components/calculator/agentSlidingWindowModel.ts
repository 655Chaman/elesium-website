// Mathematical model for Tool #54:
// Enterprise Autonomous Agent Hierarchical Sliding-Window Attention & Ring KV Eviction Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'mistral_large_123b'
  | 'qwen_2_5_72b'
  | 'deepseek_r1_671b';

export type HardwareCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_ada';

export interface SlidingWindowInputs {
  modelArchitecture: ModelArchitecture;
  streamingSequenceLength: number; // 8192 to 4194304 tokens
  slidingWindowSize: number; // 1024, 2048, 4096, 8192 tokens
  numAttentionSinks: number; // 2, 4, 8, 16 tokens
  hardwareCluster: HardwareCluster;
  currency: 'INR' | 'USD';
}

export interface RingBufferStage {
  stage: string;
  description: string;
  tokenRange: string;
  vramMb: number;
  status: 'ANCHORED' | 'ROLLING_ACTIVE' | 'EVICTED_OVERWRITTEN';
}

export interface SlidingWindowOutputs {
  activeKvTokens: number;
  vramBoundedGb: number;
  unboundedBaselineVramGb: number;
  perTokenDecodeLatencyMs: number;
  baselineUnboundedLatencyMs: number;
  memoryReductionPercent: number;
  annualClusterSavings: string;
  slaStatus: 'SUB_5MS_STREAMING_LEADER' | 'SUB_10MS_ACCEPTABLE' | 'SLA_VIOLATION';
  ringBufferTrace: RingBufferStage[];
}

export function calculateSlidingWindow(inputs: SlidingWindowInputs): SlidingWindowOutputs {
  const {
    modelArchitecture,
    streamingSequenceLength,
    slidingWindowSize,
    numAttentionSinks,
    hardwareCluster,
    currency
  } = inputs;

  // 1. Hardware Baseline Latency & Hourly Costs
  let baseDecodeLatencyMs = 4.2; // H100 default
  let clusterHourlyCostUsd = 4.5;

  if (hardwareCluster === 'nvidia_b200_nvl') {
    baseDecodeLatencyMs = 2.4;
    clusterHourlyCostUsd = 7.8;
  } else if (hardwareCluster === 'nvidia_a100_80gb') {
    baseDecodeLatencyMs = 7.5;
    clusterHourlyCostUsd = 3.0;
  } else if (hardwareCluster === 'nvidia_l40s_ada') {
    baseDecodeLatencyMs = 8.8;
    clusterHourlyCostUsd = 2.2;
  }

  // Model size multiplier & layer specs
  let modelSizeWeight = 1.0;
  let kvHeads = 8;
  let headDim = 128;
  let numLayers = 80;

  if (modelArchitecture === 'deepseek_r1_671b') {
    modelSizeWeight = 1.5;
    kvHeads = 1; // MLA decoupled latent
    headDim = 512;
    numLayers = 61;
  } else if (modelArchitecture === 'mistral_large_123b') {
    modelSizeWeight = 1.4;
    kvHeads = 8;
    headDim = 128;
    numLayers = 88;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    modelSizeWeight = 1.05;
    kvHeads = 8;
    headDim = 128;
    numLayers = 80;
  }

  // 2. Active KV Cache Tokens & Memory Footprint
  const activeKvTokens = numAttentionSinks + slidingWindowSize;
  const bytesPerToken = 2 * numLayers * kvHeads * headDim * 2; // FP16 (2 bytes) * K & V

  // Bounded VRAM (constant memory)
  const vramBoundedBytes = activeKvTokens * bytesPerToken;
  const vramBoundedGb = Math.round((vramBoundedBytes / (1024 * 1024 * 1024)) * 100) / 100;

  // Unbounded Baseline VRAM (linear memory expansion)
  const unboundedBaselineBytes = streamingSequenceLength * bytesPerToken;
  const unboundedBaselineVramGb = Math.round((unboundedBaselineBytes / (1024 * 1024 * 1024)) * 100) / 100;

  const memoryReductionPercent = Math.min(
    98.5,
    Math.round(((unboundedBaselineVramGb - vramBoundedGb) / Math.max(0.1, unboundedBaselineVramGb)) * 1000) / 10
  );

  // 3. Constant Per-Token Latency vs Unbounded Quadratic Latency
  const perTokenDecodeLatencyMs = Math.round(
    (baseDecodeLatencyMs * modelSizeWeight * (slidingWindowSize / 4096.0) * 0.95) * 100
  ) / 100;

  // Baseline unbounded latency grows linearly with memory bandwidth choke
  const streamScale = streamingSequenceLength / 32768.0;
  const baselineUnboundedLatencyMs = Math.round(
    (perTokenDecodeLatencyMs * (1.0 + streamScale * 3.6)) * 100
  ) / 100;

  // 4. Annual FinOps GPU Cluster Savings
  // A streaming node processes continuous streams 24/7 (e.g. 50 concurrent IoT or market feeds)
  const concurrentFeeds = 32;
  const tokensPerDayPerFeed = 400000;
  const totalTokensPerDay = concurrentFeeds * tokensPerDayPerFeed;
  const secondsSavedPerToken = (baselineUnboundedLatencyMs - perTokenDecodeLatencyMs) / 1000.0;
  const dailyGpuSecondsSaved = totalTokensPerDay * Math.max(0, secondsSavedPerToken);
  const dailyGpuHoursSaved = dailyGpuSecondsSaved / 3600.0;
  const annualUsdSavings = Math.round(dailyGpuHoursSaved * 365 * clusterHourlyCostUsd);
  const annualInrSavings = Math.round(annualUsdSavings * 85.5);

  const annualClusterSavings =
    currency === 'INR'
      ? `₹${(annualInrSavings / 100000).toFixed(1)} Lakhs/yr`
      : `$${annualUsdSavings.toLocaleString()}/yr`;

  // 5. SLA Status
  let slaStatus: 'SUB_5MS_STREAMING_LEADER' | 'SUB_10MS_ACCEPTABLE' | 'SLA_VIOLATION' = 'SUB_5MS_STREAMING_LEADER';
  if (perTokenDecodeLatencyMs > 10.0) {
    slaStatus = 'SLA_VIOLATION';
  } else if (perTokenDecodeLatencyMs > 5.0) {
    slaStatus = 'SUB_10MS_ACCEPTABLE';
  }

  // 6. Ring Buffer Trace
  const currentTokenHead = streamingSequenceLength;
  const expiredTokens = Math.max(0, streamingSequenceLength - activeKvTokens);

  const ringBufferTrace: RingBufferStage[] = [
    {
      stage: 'Initial Attention Sinks (Anchor Tokens)',
      description: `Permanent softmax anchor normalizers preserved in initial registers`,
      tokenRange: `Tokens 0 - ${numAttentionSinks - 1}`,
      vramMb: Math.round((numAttentionSinks * bytesPerToken) / (1024 * 1024)),
      status: 'ANCHORED'
    },
    {
      stage: 'Circular Ring KV Window (Active Attention)',
      description: `Sliding local window evaluating self-attention via in-place overwrites`,
      tokenRange: `Tokens ${(currentTokenHead - slidingWindowSize).toLocaleString()} - ${currentTokenHead.toLocaleString()}`,
      vramMb: Math.round((slidingWindowSize * bytesPerToken) / (1024 * 1024)),
      status: 'ROLLING_ACTIVE'
    },
    {
      stage: 'Historical Evicted Sequence (Zero Reallocation)',
      description: `${expiredTokens.toLocaleString()} expired stream tokens released without GPU memory reallocation stalls`,
      tokenRange: `Tokens ${numAttentionSinks} - ${(currentTokenHead - slidingWindowSize - 1).toLocaleString()}`,
      vramMb: 0,
      status: 'EVICTED_OVERWRITTEN'
    }
  ];

  return {
    activeKvTokens,
    vramBoundedGb,
    unboundedBaselineVramGb,
    perTokenDecodeLatencyMs,
    baselineUnboundedLatencyMs,
    memoryReductionPercent,
    annualClusterSavings,
    slaStatus,
    ringBufferTrace
  };
}
