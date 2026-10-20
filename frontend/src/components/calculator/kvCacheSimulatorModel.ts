/**
 * kvCacheSimulatorModel.ts
 *
 * Mathematical and architectural simulation model for Enterprise LLM
 * KV Cache sizing, PagedAttention block allocation, Chunked Prefill,
 * Prefix Caching (RadixAttention), and Sliding Window Eviction.
 */

export type ModelArchKey = 'llama_70b' | 'qwen_72b' | 'mixtral_8x22b' | 'deepseek_v3_mla' | 'claude_35_sonnet_ref';
export type CacheStrategyKey = 'naive_contiguous' | 'paged_attention' | 'chunked_prefill' | 'prefix_caching' | 'sliding_window';
export type CachePrecisionKey = 'fp16' | 'fp8' | 'int4';

export interface ModelArchSpec {
  name: string;
  layers: number;
  kvHeads: number;
  headDim: number;
  isMLA?: boolean; // Multi-head Latent Attention (DeepSeek)
  mlaCompressedDim?: number;
  slidingWindowSize?: number;
  nativeContextLimit: number;
}

export const MODEL_ARCH_SPECS: Record<ModelArchKey, ModelArchSpec> = {
  llama_70b: {
    name: 'Meta Llama-3.1-70B (GQA 8:1)',
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    nativeContextLimit: 131072
  },
  qwen_72b: {
    name: 'Qwen-2.5-72B (GQA 8:1)',
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    nativeContextLimit: 131072
  },
  mixtral_8x22b: {
    name: 'Mixtral 8x22B (Sliding Window)',
    layers: 56,
    kvHeads: 8,
    headDim: 128,
    slidingWindowSize: 4096,
    nativeContextLimit: 65536
  },
  deepseek_v3_mla: {
    name: 'DeepSeek-V3 / R1 (MLA Compressed)',
    layers: 61,
    kvHeads: 1, // MLA projects KV into a single compressed latent vector
    headDim: 576, // Compressed latent dimension
    isMLA: true,
    mlaCompressedDim: 576,
    nativeContextLimit: 131072
  },
  claude_35_sonnet_ref: {
    name: 'Claude 3.5 Sonnet (Closed Hyperscaler Reference)',
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    nativeContextLimit: 200000
  }
};

export interface KvCacheSimulatorInputs {
  modelArch: ModelArchKey;
  cacheStrategy: CacheStrategyKey;
  cachePrecision: CachePrecisionKey;
  systemPromptTokens: number; // e.g. 2,000 to 32,000
  turnHistoryCount: number; // e.g. 2 to 30 agentic loop turns
  tokensPerTurn: number; // e.g. 250 to 3,000
  concurrentStreams: number; // e.g. 1 to 64 concurrent requests
  gpuHardwareVramGb: number; // e.g. 80 GB (H100/A100)
}

export interface TurnLatencyMetric {
  turnIndex: number;
  totalContextTokens: number;
  kvVramMb: number;
  ttftMs: number;
  itlMs: number;
  cacheHitRatio: number; // 0.0 to 1.0
}

export interface KvCacheSimulatorResults {
  inputs: KvCacheSimulatorInputs;
  archSpec: ModelArchSpec;
  totalTokensPerStream: number;
  aggregateTokensAllStreams: number;
  bytesPerTokenPerLayer: number;
  totalKvCacheVramGb: number;
  vramSaturationPercentage: number;
  memoryFragmentationPercentage: number;
  overallCacheHitRate: number;
  averageTtftMs: number;
  averageItlMs: number;
  turnMetrics: TurnLatencyMetric[];
  ttftReductionPercentage: number;
  estimatedMonthlySelfHostedCost: number;
  estimatedMonthlyCloudApiCost: number;
  monthlySavingsUsd: number;
  architecturalGuidance: string;
}

export function calculateKvCacheSimulation(inputs: KvCacheSimulatorInputs): KvCacheSimulatorResults {
  const {
    modelArch,
    cacheStrategy,
    cachePrecision,
    systemPromptTokens,
    turnHistoryCount,
    tokensPerTurn,
    concurrentStreams,
    gpuHardwareVramGb
  } = inputs;

  const arch = MODEL_ARCH_SPECS[modelArch];

  // Bytes per scalar
  let bytesPerScalar = 2; // FP16
  if (cachePrecision === 'fp8') bytesPerScalar = 1;
  else if (cachePrecision === 'int4') bytesPerScalar = 0.5;

  // KV Cache size per token per layer: 2 * kv_heads * head_dim * bytes_per_scalar
  // For MLA (DeepSeek), it is 1 * mlaCompressedDim * bytes_per_scalar
  let bytesPerTokenPerLayer: number;
  if (arch.isMLA && arch.mlaCompressedDim) {
    bytesPerTokenPerLayer = arch.mlaCompressedDim * bytesPerScalar;
  } else {
    bytesPerTokenPerLayer = 2 * arch.kvHeads * arch.headDim * bytesPerScalar;
  }

  const bytesPerTokenAllLayers = bytesPerTokenPerLayer * arch.layers;

  // Turn-by-turn simulation
  const turnMetrics: TurnLatencyMetric[] = [];
  let cumulativeTokens = systemPromptTokens;

  for (let turn = 1; turn <= turnHistoryCount; turn++) {
    cumulativeTokens += tokensPerTurn;

    let activeRetainedTokens = cumulativeTokens;
    if (cacheStrategy === 'sliding_window' && arch.slidingWindowSize) {
      activeRetainedTokens = systemPromptTokens + Math.min(cumulativeTokens - systemPromptTokens, arch.slidingWindowSize);
    }

    // KV Cache VRAM for single stream in MB
    const kvBytesSingleStream = activeRetainedTokens * bytesPerTokenAllLayers;
    const kvVramMb = Number((kvBytesSingleStream / (1024 * 1024)).toFixed(1));

    // Cache hit ratio calculation
    let hitRatio = 0.0;
    if (cacheStrategy === 'prefix_caching') {
      // System prompt is 100% cached after turn 1; prior turn histories are 90%+ cached
      if (turn === 1) {
        hitRatio = 0.0;
      } else {
        const cachedTokens = systemPromptTokens + (turn - 2) * tokensPerTurn;
        hitRatio = Number((cachedTokens / activeRetainedTokens).toFixed(2));
      }
    } else if (cacheStrategy === 'paged_attention') {
      hitRatio = turn > 1 ? 0.35 : 0.0; // Block reuse within session
    } else if (cacheStrategy === 'chunked_prefill') {
      hitRatio = turn > 1 ? 0.50 : 0.0;
    } else if (cacheStrategy === 'sliding_window') {
      hitRatio = turn > 1 ? 0.45 : 0.0;
    } else {
      hitRatio = 0.0; // Naive: full recomputation
    }

    // TTFT calculation: base prefill time + memory bandwidth penalty
    // Without cache: Prefill scales linearly with context length (~15ms per 1k tokens on H100)
    // With Prefix Caching: Prefill only runs on new tokens!
    const unCachedTokens = activeRetainedTokens * (1 - hitRatio);
    const prefillTimeMs = Math.max(8, (unCachedTokens / 1000) * 14.5);
    const ttftMs = Number((prefillTimeMs + (concurrentStreams * 0.4)).toFixed(1));

    // Inter-Token Latency (ITL / TPOT): auto-regressive generation memory bandwidth bound (~12ms to 25ms)
    const itlBase = 11.5 + (arch.layers / 80) * 2.0;
    const itlMs = Number((itlBase + (concurrentStreams * 0.15)).toFixed(1));

    turnMetrics.push({
      turnIndex: turn,
      totalContextTokens: activeRetainedTokens,
      kvVramMb,
      ttftMs,
      itlMs,
      cacheHitRatio: hitRatio
    });
  }

  // Summary Metrics
  const lastTurn = turnMetrics[turnMetrics.length - 1];
  const totalTokensPerStream = lastTurn.totalContextTokens;
  const aggregateTokensAllStreams = totalTokensPerStream * concurrentStreams;

  // Fragmentation
  let memoryFragmentationPercentage = 4.0; // PagedAttention standard
  if (cacheStrategy === 'naive_contiguous') {
    memoryFragmentationPercentage = 68.0; // Virtual memory fragmentation from pre-allocated buffers
  } else if (cacheStrategy === 'sliding_window') {
    memoryFragmentationPercentage = 8.0;
  }

  // Total KV Cache VRAM across all streams with fragmentation overhead
  const rawKvBytesAllStreams = aggregateTokensAllStreams * bytesPerTokenAllLayers;
  const fragmentationMultiplier = 1 + memoryFragmentationPercentage / 100;
  const totalKvCacheVramGb = Number(
    ((rawKvBytesAllStreams * fragmentationMultiplier) / (1024 * 1024 * 1024)).toFixed(2)
  );

  const vramSaturationPercentage = Number(
    Math.min(100, (totalKvCacheVramGb / gpuHardwareVramGb) * 100).toFixed(1)
  );

  const averageTtftMs = Number(
    (turnMetrics.reduce((sum, m) => sum + m.ttftMs, 0) / turnMetrics.length).toFixed(1)
  );
  const averageItlMs = Number(
    (turnMetrics.reduce((sum, m) => sum + m.itlMs, 0) / turnMetrics.length).toFixed(1)
  );

  const overallCacheHitRate = Number(
    (turnMetrics.reduce((sum, m) => sum + m.cacheHitRatio, 0) / turnMetrics.length * 100).toFixed(1)
  );

  // Naive baseline comparison for TTFT savings
  const naiveLastTurnTtft = (totalTokensPerStream / 1000) * 14.5 + concurrentStreams * 0.4;
  const ttftReductionPercentage = Math.max(
    0,
    Math.round(((naiveLastTurnTtft - lastTurn.ttftMs) / naiveLastTurnTtft) * 100)
  );

  // Cost estimates:
  // Self-hosted sovereign node (H100 SXM5 80GB): ~$2,800/mo cloud instance or $1,200/mo on-prem amortized
  const estimatedMonthlySelfHostedCost = 2800;

  // Cloud API comparison (Claude 3.5 Sonnet / GPT-4o):
  // Avg $3/M input tokens, $15/M output tokens
  // If 5M input tokens and 1M output tokens per day across streams
  const dailyInputTokens = (aggregateTokensAllStreams * 200) / 1000000; // 200 requests/day
  const dailyOutputTokens = (concurrentStreams * tokensPerTurn * 200) / 1000000;
  const estimatedMonthlyCloudApiCost = Math.round((dailyInputTokens * 3.0 + dailyOutputTokens * 15.0) * 30);
  const monthlySavingsUsd = Math.max(0, estimatedMonthlyCloudApiCost - estimatedMonthlySelfHostedCost);

  let architecturalGuidance = '';
  if (cacheStrategy === 'prefix_caching') {
    architecturalGuidance =
      'Automatic Prefix Caching (RadixAttention) eliminates 80% to 92% of redundant prompt prefill computation. Enterprise multi-turn workflows reuse system instructions and tool definitions with sub-25ms TTFT.';
  } else if (cacheStrategy === 'chunked_prefill') {
    architecturalGuidance =
      'Chunked Prefill interleaves compute-bound prompt prefill tokens with memory-bound decode iterations, preventing head-of-line blocking and stabilizing inter-token latency spikes.';
  } else if (cacheStrategy === 'sliding_window') {
    architecturalGuidance =
      'Sliding Window Attention caps KV cache memory at a fixed token horizon, ensuring bounded VRAM allocation even under infinite multi-turn loops.';
  } else if (cacheStrategy === 'paged_attention') {
    architecturalGuidance =
      'PagedAttention allocates KV cache in fixed 16-token virtual memory blocks, eliminating external memory fragmentation from 68% down to under 4%.';
  } else {
    architecturalGuidance =
      'Naive contiguous buffer allocation suffers from 68%+ virtual memory fragmentation and recomputes all historical tokens on every single turn, bottlenecking multi-agent loops.';
  }

  return {
    inputs,
    archSpec: arch,
    totalTokensPerStream,
    aggregateTokensAllStreams,
    bytesPerTokenPerLayer,
    totalKvCacheVramGb,
    vramSaturationPercentage,
    memoryFragmentationPercentage,
    overallCacheHitRate,
    averageTtftMs,
    averageItlMs,
    turnMetrics,
    ttftReductionPercentage,
    estimatedMonthlySelfHostedCost,
    estimatedMonthlyCloudApiCost,
    monthlySavingsUsd,
    architecturalGuidance
  };
}
