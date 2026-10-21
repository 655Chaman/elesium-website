export type ServingEngine = 
  | 'sglang_radix_attention' 
  | 'vllm_paged_attention' 
  | 'naive_linear_attention' 
  | 'tensorrt_llm_inflight';

export type GpuArchitecture = 
  | 'nvidia_h100_80gb' 
  | 'nvidia_a100_80gb' 
  | 'nvidia_l40s_48gb' 
  | 'nvidia_l4_24gb';

export type KvCacheDataType = 
  | 'fp16' 
  | 'fp8_e4m3' 
  | 'fp8_e5m2' 
  | 'int4_awq';

export interface ChunkedPrefillInputs {
  concurrentUsers: number; // 10 to 1000
  promptContextLength: number; // 1024 to 65536
  sharedSystemPromptTokens: number; // 512 to 16384
  prefillChunkSize: number; // 256 to 2048
  servingEngine: ServingEngine;
  gpuArchitecture: GpuArchitecture;
  kvCacheDataType: KvCacheDataType;
  currency: 'INR' | 'USD';
}

export interface TtftDistributionPoint {
  tokenDepth: number;
  ttftMs: number;
}

export interface ChunkedPrefillOutputs {
  ttftMilliseconds: number;
  decodeTokensPerSecondPerUser: number;
  kvCacheMemorySavedGb: number;
  prefixCacheHitRatioPct: number;
  maxConcurrentSupported: number;
  totalVramRequiredGb: number;
  annualGpuSpend: number;
  annualComputeSavings: number;
  statusClassification: 'RADIX_PREFIX_OPTIMIZED' | 'PAGED_ATTENTION_STABLE' | 'PREFILL_STALL_DEGRADATION' | 'VRAM_OOM_SATURATION';
  recommendationNote: string;
  ttftTrace: TtftDistributionPoint[];
}

export function calculateChunkedPrefill(inputs: ChunkedPrefillInputs): ChunkedPrefillOutputs {
  const {
    concurrentUsers,
    promptContextLength,
    sharedSystemPromptTokens,
    prefillChunkSize,
    servingEngine,
    gpuArchitecture,
    kvCacheDataType,
    currency
  } = inputs;

  // 1. Hardware baseline
  let rawGpuVramGb = 80;
  let memoryBandwidthTbSec = 3.35; // H100 SXM
  let monthlyGpuRateUsd = 2850;

  if (gpuArchitecture === 'nvidia_a100_80gb') {
    rawGpuVramGb = 80;
    memoryBandwidthTbSec = 2.03;
    monthlyGpuRateUsd = 1950;
  } else if (gpuArchitecture === 'nvidia_l40s_48gb') {
    rawGpuVramGb = 48;
    memoryBandwidthTbSec = 0.86;
    monthlyGpuRateUsd = 1250;
  } else if (gpuArchitecture === 'nvidia_l4_24gb') {
    rawGpuVramGb = 24;
    memoryBandwidthTbSec = 0.30;
    monthlyGpuRateUsd = 450;
  }

  // 2. KV Cache bytes per token (Assuming 70B model with 64 layers, 8 KV heads, 128 head dim)
  let bytesPerToken = 2; // FP16
  if (kvCacheDataType === 'fp8_e4m3' || kvCacheDataType === 'fp8_e5m2') {
    bytesPerToken = 1;
  } else if (kvCacheDataType === 'int4_awq') {
    bytesPerToken = 0.5;
  }
  const kvCacheBytesPerToken = 64 * 8 * 128 * 2 * bytesPerToken; // ~131 KB per token in FP16, ~65 KB in FP8

  // 3. Engine efficiency & prefix caching
  let prefixCacheHitRatioPct = 0;
  let prefillSpeedMultiplier = 1.0;
  let decodeThroughputBase = 45; // tok/sec

  if (servingEngine === 'sglang_radix_attention') {
    // RadixAttention tree-based prefix matching
    prefixCacheHitRatioPct = Math.min(94, Math.round((sharedSystemPromptTokens / promptContextLength) * 100 * 1.25));
    prefillSpeedMultiplier = 3.8;
    decodeThroughputBase = 58;
  } else if (servingEngine === 'vllm_paged_attention') {
    // PagedAttention with chunked prefill
    prefixCacheHitRatioPct = Math.min(82, Math.round((sharedSystemPromptTokens / promptContextLength) * 100 * 0.95));
    prefillSpeedMultiplier = 2.6;
    decodeThroughputBase = 48;
  } else if (servingEngine === 'tensorrt_llm_inflight') {
    prefixCacheHitRatioPct = Math.min(75, Math.round((sharedSystemPromptTokens / promptContextLength) * 100 * 0.85));
    prefillSpeedMultiplier = 2.9;
    decodeThroughputBase = 52;
  } else {
    // Naive linear attention
    prefixCacheHitRatioPct = 0; // No prefix sharing
    prefillSpeedMultiplier = 0.7;
    decodeThroughputBase = 24;
  }

  // Effective un-cached prompt tokens to compute
  const cachedTokens = (sharedSystemPromptTokens * (prefixCacheHitRatioPct / 100));
  const tokensToCompute = Math.max(128, promptContextLength - cachedTokens);

  // Chunked prefill latency calculation (avoiding queue starvation)
  const chunksCount = Math.ceil(tokensToCompute / prefillChunkSize);
  const baseTFlopsTimeMs = (tokensToCompute / 1000) * (3.8 / memoryBandwidthTbSec) * (1 / prefillSpeedMultiplier);
  const queueJitterMs = Math.log2(Math.max(2, concurrentUsers)) * 1.8;
  const chunkInterleavingOverheadMs = chunksCount * 0.45;

  const ttftMilliseconds = Math.round((baseTFlopsTimeMs * 18 + queueJitterMs + chunkInterleavingOverheadMs) * 10) / 10;
  const decodeTokensPerSecondPerUser = Math.round(
    Math.max(12, decodeThroughputBase * (memoryBandwidthTbSec / 2.0) * (1 / Math.pow(concurrentUsers / 80, 0.28))) * 10
  ) / 10;

  // VRAM calculation
  const modelWeightsVramGb = 38.0; // 70B FP8/AWQ
  const activeTokensTotal = concurrentUsers * (promptContextLength - (servingEngine === 'naive_linear_attention' ? 0 : cachedTokens * 0.9));
  const rawKvCacheBytes = activeTokensTotal * kvCacheBytesPerToken;
  const kvCacheVramGb = Math.round((rawKvCacheBytes / (1024 * 1024 * 1024)) * 10) / 10;
  const totalVramRequiredGb = Math.round((modelWeightsVramGb + kvCacheVramGb) * 10) / 10;

  // Memory saved
  const unoptimizedKvBytes = (concurrentUsers * promptContextLength) * (64 * 8 * 128 * 2 * 2);
  const unoptimizedVramGb = unoptimizedKvBytes / (1024 * 1024 * 1024);
  const kvCacheMemorySavedGb = Math.round(Math.max(0, unoptimizedVramGb - kvCacheVramGb) * 10) / 10;

  // Max concurrent streams supported on selected GPU
  const availableKvVramGb = Math.max(2, rawGpuVramGb - modelWeightsVramGb - 4); // 4GB buffer
  const perUserKvVramGb = (promptContextLength - cachedTokens) * kvCacheBytesPerToken / (1024 * 1024 * 1024);
  const maxConcurrentSupported = Math.max(1, Math.floor(availableKvVramGb / Math.max(0.01, perUserKvVramGb)));

  // Cost and Savings
  const gpusNeeded = Math.max(1, Math.ceil(totalVramRequiredGb / (rawGpuVramGb * 0.9)));
  const annualSpendUsd = gpusNeeded * monthlyGpuRateUsd * 12;
  const baselineUncachedGpus = Math.max(1, Math.ceil((modelWeightsVramGb + unoptimizedVramGb) / (rawGpuVramGb * 0.9)));
  const baselineSpendUsd = baselineUncachedGpus * monthlyGpuRateUsd * 12;
  const annualSavingsUsd = Math.max(0, baselineSpendUsd - annualSpendUsd);

  const inrConversion = 87.5;
  const annualGpuSpend = currency === 'INR' ? Math.round(annualSpendUsd * inrConversion) : Math.round(annualSpendUsd);
  const annualComputeSavings = currency === 'INR' ? Math.round(annualSavingsUsd * inrConversion) : Math.round(annualSavingsUsd);

  // Status Classification
  let statusClassification: ChunkedPrefillOutputs['statusClassification'] = 'PAGED_ATTENTION_STABLE';
  let recommendationNote = 'Balanced serving throughput with paged KV allocation.';

  if (servingEngine === 'sglang_radix_attention' && prefixCacheHitRatioPct >= 65 && ttftMilliseconds < 60) {
    statusClassification = 'RADIX_PREFIX_OPTIMIZED';
    recommendationNote = 'Optimal RadixAttention prefix reuse. Shared context prefill latency is amortized to sub-60ms.';
  } else if (totalVramRequiredGb > rawGpuVramGb * gpusNeeded * 0.95 || concurrentUsers > maxConcurrentSupported) {
    statusClassification = 'VRAM_OOM_SATURATION';
    recommendationNote = 'Critical VRAM exhaustion. Enable FP8 KV caching or adopt smaller prefill chunk sizes to prevent CUDA OOM.';
  } else if (ttftMilliseconds > 250) {
    statusClassification = 'PREFILL_STALL_DEGRADATION';
    recommendationNote = 'Severe prompt prefill head-of-line blocking. Reduce chunk size to 512 tokens to interleave decode tokens.';
  }

  // 20-Point TTFT Distribution Trace across context depths
  const ttftTrace: TtftDistributionPoint[] = [];
  const tokenDepths = [
    512, 1024, 2048, 4096, 8192, 12288, 16384, 20480, 24576, 28672,
    32768, 36864, 40960, 45056, 49152, 53248, 57344, 61440, 63488, 65536
  ];

  tokenDepths.forEach(depth => {
    const depthCached = Math.min(depth * 0.85, cachedTokens);
    const depthCompute = Math.max(64, depth - depthCached);
    const depthTtft = Math.round(
      ((depthCompute / 1000) * (3.8 / memoryBandwidthTbSec) * (1 / prefillSpeedMultiplier) * 18 + queueJitterMs) * 10
    ) / 10;
    ttftTrace.push({
      tokenDepth: depth,
      ttftMs: Math.max(10, depthTtft)
    });
  });

  return {
    ttftMilliseconds,
    decodeTokensPerSecondPerUser,
    kvCacheMemorySavedGb,
    prefixCacheHitRatioPct,
    maxConcurrentSupported,
    totalVramRequiredGb,
    annualGpuSpend,
    annualComputeSavings,
    statusClassification,
    recommendationNote,
    ttftTrace
  };
}
