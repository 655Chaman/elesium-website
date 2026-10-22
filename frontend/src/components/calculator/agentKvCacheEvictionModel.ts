export type EvictionModelArchitecture =
  | 'deepseek_r1_671b_moe'
  | 'llama_3_1_70b'
  | 'qwen_2_5_72b'
  | 'sovereign_100b_agent'
  | 'llama_3_405b';

export type EvictionStrategy =
  | 'h2o_heavy_hitter_dynamic'
  | 'streamingllm_sink_window'
  | 'static_sliding_window'
  | 'uncompressed_full_cache';

export type EvictionGpuTopology =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_blackwell'
  | 'nvidia_h200_sxm'
  | 'nvidia_l40s_cluster';

export interface KvCacheEvictionInputs {
  modelArchitecture: EvictionModelArchitecture;
  evictionStrategy: EvictionStrategy;
  contextLength: number;
  attentionSinkTokens: number;
  heavyHitterBudgetTokens: number;
  slidingWindowTokens: number;
  gpuClusterTopology: EvictionGpuTopology;
  currency: 'INR' | 'USD';
}

export interface KvCacheEvictionResults {
  uncompressedKvMemoryGb: number;
  compressedKvMemoryGb: number;
  memoryCompressionRatio: number;
  effectiveVramSavedGb: number;
  perplexityDegradationPercent: number;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  statusClassification:
    | 'SUB_PERCENT_OPTIMAL_COMPRESSION'
    | 'BALANCED_RING_BUFFER'
    | 'CATASTROPHIC_COLLAPSE_NO_SINKS'
    | 'OOM_MEMORY_SATURATION';
}

export function calculateKvCacheEviction(
  inputs: KvCacheEvictionInputs
): KvCacheEvictionResults {
  const {
    modelArchitecture,
    evictionStrategy,
    contextLength,
    attentionSinkTokens,
    heavyHitterBudgetTokens,
    slidingWindowTokens,
    currency
  } = inputs;

  // Bytes per token calculation based on model architecture
  // 70B GQA: 80 layers * 8 heads * 128 dim * 2 bytes (FP16) * 2 (K+V) = 327,680 bytes = ~0.32 MB/tok
  let bytesPerToken = 327680;
  if (modelArchitecture === 'llama_3_405b') {
    bytesPerToken = 819200; // 126 layers, 8 heads, 128 dim, FP16
  } else if (modelArchitecture === 'deepseek_r1_671b_moe') {
    bytesPerToken = 262144; // Multi-head Latent Attention (MLA) compressed projection
  } else if (modelArchitecture === 'sovereign_100b_agent') {
    bytesPerToken = 409600;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    bytesPerToken = 327680;
  }

  // Raw uncompressed KV cache in Gigabytes
  const uncompressedKvMemoryGb = Number(
    ((contextLength * bytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  let activeRetainedTokens = contextLength;
  let perplexityDegradationPercent = 0.04;
  let statusClassification: KvCacheEvictionResults['statusClassification'] = 'SUB_PERCENT_OPTIMAL_COMPRESSION';

  if (evictionStrategy === 'uncompressed_full_cache') {
    activeRetainedTokens = contextLength;
    perplexityDegradationPercent = 0.0;
    statusClassification = uncompressedKvMemoryGb > 320 ? 'OOM_MEMORY_SATURATION' : 'BALANCED_RING_BUFFER';
  } else if (evictionStrategy === 'static_sliding_window') {
    activeRetainedTokens = Math.min(contextLength, slidingWindowTokens);
    // Catastrophic collapse without initial attention sinks! Perplexity explodes by 1400%+
    perplexityDegradationPercent = 1420.0;
    statusClassification = 'CATASTROPHIC_COLLAPSE_NO_SINKS';
  } else if (evictionStrategy === 'streamingllm_sink_window') {
    activeRetainedTokens = Math.min(contextLength, attentionSinkTokens + slidingWindowTokens);
    perplexityDegradationPercent = 0.42;
    statusClassification = 'BALANCED_RING_BUFFER';
  } else {
    // H2O Heavy Hitter Dynamic (Sinks + Heavy Hitters + Recent Window)
    activeRetainedTokens = Math.min(
      contextLength,
      attentionSinkTokens + heavyHitterBudgetTokens + slidingWindowTokens
    );
    perplexityDegradationPercent = 0.06;
    statusClassification = 'SUB_PERCENT_OPTIMAL_COMPRESSION';
  }

  const compressedKvMemoryGb = Number(
    ((activeRetainedTokens * bytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  const memoryCompressionRatio = Number(
    (uncompressedKvMemoryGb / Math.max(0.01, compressedKvMemoryGb)).toFixed(2)
  );

  const effectiveVramSavedGb = Number(
    Math.max(0, uncompressedKvMemoryGb - compressedKvMemoryGb).toFixed(2)
  );

  // FinOps: GPU VRAM cost saved across 32 concurrent agent sessions
  // 1 GB HBM3 active hosting costs approximately $0.18/GB/day on Tier-1 AI cloud
  const dailyVramSavingsUsd = effectiveVramSavedGb * 32 * 0.18;
  const rawAnnualSavingsUsd = Math.round(dailyVramSavingsUsd * 365);

  let formattedSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / year`;
  if (currency === 'INR') {
    const savingsInrCrores = (rawAnnualSavingsUsd * 86.5) / 10000000;
    formattedSavings = `₹${savingsInrCrores.toFixed(2)} Cr / year`;
  }

  return {
    uncompressedKvMemoryGb,
    compressedKvMemoryGb,
    memoryCompressionRatio,
    effectiveVramSavedGb,
    perplexityDegradationPercent,
    annualFinOpsSavings: formattedSavings,
    rawAnnualSavingsUsd,
    statusClassification
  };
}
