// Mathematical model for Tool #51:
// Enterprise Autonomous Agent FlashDecoding & Sequence Parallelization Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_r1_671b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type ParallelismStrategy =
  | 'flashdecoding_single_gpu'
  | 'sequence_parallel_ring'
  | 'tensor_parallel_nvlink'
  | 'hybrid_tp_sp';

export type HardwareCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_ada';

export interface FlashDecodingInputs {
  modelArchitecture: ModelArchitecture;
  contextLengthTokens: number; // 4096 to 131072
  kvChunkSize: number; // 128, 256, 512, 1024
  numGpus: number; // 1, 2, 4, 8
  parallelismStrategy: ParallelismStrategy;
  hardwareCluster: HardwareCluster;
  currency: 'INR' | 'USD';
}

export interface ParallelChunkStage {
  stageName: string;
  chunkRange: string;
  activeSms: number;
  partialLatencyMs: number;
  memoryBandwidthGbps: number;
  status: 'COMPUTED' | 'REDUCED' | 'NVLINK_SYNCED';
}

export interface FlashDecodingOutputs {
  baselineDecodeLatencyMs: number;
  flashDecodingLatencyMs: number;
  speedupMultiplier: number;
  numParallelSplits: number;
  smOccupancyPercent: number;
  tokensPerSecond: number;
  annualClusterSavings: string;
  slaStatus: 'SUB_10MS_ULTRA_FAST' | 'SUB_20MS_ACCEPTABLE' | 'LATENCY_BOTTLENECK';
  chunkTrace: ParallelChunkStage[];
}

export function calculateFlashDecoding(inputs: FlashDecodingInputs): FlashDecodingOutputs {
  const {
    modelArchitecture,
    contextLengthTokens,
    kvChunkSize,
    numGpus,
    parallelismStrategy,
    hardwareCluster,
    currency
  } = inputs;

  // 1. Hardware SM Count & Memory Bandwidth
  let totalSmsPerGpu = 132; // H100 default
  let peakMemBwTbps = 3.35; // H100 SXM5 HBM3
  let costPerGpuPerYear = 2200000; // INR

  switch (hardwareCluster) {
    case 'nvidia_h100_sxm5':
      totalSmsPerGpu = 132;
      peakMemBwTbps = 3.35;
      costPerGpuPerYear = 2200000;
      break;
    case 'nvidia_b200_nvl':
      totalSmsPerGpu = 144;
      peakMemBwTbps = 8.00;
      costPerGpuPerYear = 3800000;
      break;
    case 'nvidia_a100_80gb':
      totalSmsPerGpu = 108;
      peakMemBwTbps = 2.00;
      costPerGpuPerYear = 1400000;
      break;
    case 'nvidia_l40s_ada':
      totalSmsPerGpu = 142;
      peakMemBwTbps = 0.86;
      costPerGpuPerYear = 950000;
      break;
  }

  const clusterTotalSms = totalSmsPerGpu * numGpus;

  // 2. GQA Key-Value Heads Count
  let kvHeads = 8;
  switch (modelArchitecture) {
    case 'llama_3_70b':
      kvHeads = 8;
      break;
    case 'deepseek_r1_671b':
      kvHeads = 64; // Multi-head latent attention (MLA) compressed heads
      break;
    case 'qwen_2_5_72b':
      kvHeads = 8;
      break;
    case 'mistral_large_123b':
      kvHeads = 8;
      break;
  }

  // 3. Parallel Split Dimensions
  const numChunks = Math.max(1, Math.ceil(contextLengthTokens / kvChunkSize));
  const numParallelSplits = numChunks * kvHeads;
  const smOccupancyPercent = Math.min(100.0, Math.round((numParallelSplits / clusterTotalSms) * 1000) / 10);

  // 4. Baseline Autoregressive Latency (Memory Choke on Few SMs)
  // Single token generation reading full KV cache sequentially
  const kvBytesPerToken = 262144; // ~262 KB in 70B FP16
  const totalKvCacheGb = (contextLengthTokens * kvBytesPerToken) / (1024 * 1024 * 1024);
  const baselineReadTimeMs = (totalKvCacheGb / (peakMemBwTbps * 1000)) * 1000 * (132 / Math.min(132, kvHeads));
  const baselineDecodeLatencyMs = Math.round((14.5 + baselineReadTimeMs * 1.8) * 10) / 10;

  // 5. FlashDecoding Latency (Parallel Chunk Attention + Partial Softmax Reduction)
  let strategyEfficiency = 1.0;
  let interconnectOverheadMs = 0.0;

  switch (parallelismStrategy) {
    case 'flashdecoding_single_gpu':
      strategyEfficiency = 1.0;
      interconnectOverheadMs = 0.0;
      break;
    case 'sequence_parallel_ring':
      strategyEfficiency = 1.25;
      interconnectOverheadMs = numGpus > 1 ? 0.45 : 0.0;
      break;
    case 'tensor_parallel_nvlink':
      strategyEfficiency = 1.15;
      interconnectOverheadMs = numGpus > 1 ? 0.35 : 0.0;
      break;
    case 'hybrid_tp_sp':
      strategyEfficiency = 1.45;
      interconnectOverheadMs = numGpus > 1 ? 0.55 : 0.0;
      break;
  }

  const chunkComputeMs = (6.4 / (strategyEfficiency * (numGpus ** 0.35))) + (kvChunkSize / 512.0) * 0.8;
  const partialReductionMs = 0.12 * Math.log2(Math.max(2, numChunks));
  const flashDecodingLatencyMs = Math.round((chunkComputeMs + partialReductionMs + interconnectOverheadMs) * 10) / 10;

  // 6. Speedup and Throughput
  const speedupMultiplier = Math.round((baselineDecodeLatencyMs / flashDecodingLatencyMs) * 10) / 10;
  const tokensPerSecond = Math.round((1000.0 / flashDecodingLatencyMs) * 10) / 10;

  // 7. Annual Cloud / Cluster FinOps Savings
  const savedGpuSecondsRatio = Math.max(0.1, 1.0 - (1.0 / speedupMultiplier));
  const annualSavingsRaw = Math.round(costPerGpuPerYear * numGpus * savedGpuSecondsRatio * 0.55);

  const annualClusterSavings =
    currency === 'INR'
      ? `₹${(annualSavingsRaw / 100000).toFixed(1)} Lakhs/yr`
      : `$${Math.round(annualSavingsRaw / 85).toLocaleString()}/yr`;

  // 8. SLA Classification
  let slaStatus: 'SUB_10MS_ULTRA_FAST' | 'SUB_20MS_ACCEPTABLE' | 'LATENCY_BOTTLENECK' = 'SUB_10MS_ULTRA_FAST';
  if (flashDecodingLatencyMs > 20.0) {
    slaStatus = 'LATENCY_BOTTLENECK';
  } else if (flashDecodingLatencyMs > 10.0) {
    slaStatus = 'SUB_20MS_ACCEPTABLE';
  }

  // 9. Chunk-wise Execution Trace
  const stepSize = Math.max(1, Math.floor(numChunks / 4));
  const chunkTrace: ParallelChunkStage[] = [
    {
      stageName: 'Split-KV Chunk Stage 01',
      chunkRange: `Tokens 0 - ${(stepSize * kvChunkSize).toLocaleString()}`,
      activeSms: Math.min(clusterTotalSms, stepSize * kvHeads),
      partialLatencyMs: Math.round((chunkComputeMs * 0.28) * 100) / 100,
      memoryBandwidthGbps: Math.round(peakMemBwTbps * 1000 * 0.85),
      status: 'COMPUTED'
    },
    {
      stageName: 'Split-KV Chunk Stage 02',
      chunkRange: `Tokens ${(stepSize * kvChunkSize + 1).toLocaleString()} - ${(stepSize * 2 * kvChunkSize).toLocaleString()}`,
      activeSms: Math.min(clusterTotalSms, stepSize * kvHeads),
      partialLatencyMs: Math.round((chunkComputeMs * 0.26) * 100) / 100,
      memoryBandwidthGbps: Math.round(peakMemBwTbps * 1000 * 0.88),
      status: 'COMPUTED'
    },
    {
      stageName: 'Split-KV Chunk Stage 03',
      chunkRange: `Tokens ${(stepSize * 2 * kvChunkSize + 1).toLocaleString()} - ${(contextLengthTokens).toLocaleString()}`,
      activeSms: Math.min(clusterTotalSms, (numChunks - stepSize * 2) * kvHeads),
      partialLatencyMs: Math.round((chunkComputeMs * 0.32) * 100) / 100,
      memoryBandwidthGbps: Math.round(peakMemBwTbps * 1000 * 0.91),
      status: 'COMPUTED'
    },
    {
      stageName: 'Partial Log-Sum-Exp Reduction',
      chunkRange: `Hierarchical Merge (${numChunks} chunks)`,
      activeSms: Math.min(clusterTotalSms, kvHeads * 4),
      partialLatencyMs: Math.round(partialReductionMs * 100) / 100,
      memoryBandwidthGbps: Math.round(peakMemBwTbps * 1000 * 0.45),
      status: numGpus > 1 ? 'NVLINK_SYNCED' : 'REDUCED'
    }
  ];

  return {
    baselineDecodeLatencyMs,
    flashDecodingLatencyMs,
    speedupMultiplier,
    numParallelSplits,
    smOccupancyPercent,
    tokensPerSecond,
    annualClusterSavings,
    slaStatus,
    chunkTrace
  };
}
