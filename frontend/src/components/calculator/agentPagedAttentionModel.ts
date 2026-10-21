// Mathematical model for Tool #48:
// Enterprise Autonomous Agent GPU VRAM PagedAttention Fragmentation & Prefill KV Cache Allocator Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_r1_671b'
  | 'mistral_large_123b'
  | 'qwen_2_5_72b';

export type GpuHardwareType =
  | 'nvidia_h100_80gb'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_48gb'
  | 'nvidia_rtx_4090_24gb';

export type MemoryAllocationEngine =
  | 'vllm_paged_attention'
  | 'tensorrt_llm_paged'
  | 'naive_contiguous_pytorch'
  | 'huggingface_accelerate';

export type KvCacheQuantization =
  | 'fp16_uncompressed'
  | 'fp8_e4m3'
  | 'int4_kivi';

export interface PagedAttentionInputs {
  modelArchitecture: ModelArchitecture;
  gpuHardwareType: GpuHardwareType;
  memoryAllocationEngine: MemoryAllocationEngine;
  kvCacheQuantization: KvCacheQuantization;
  concurrentAgentStreams: number; // 5 to 250 streams
  averageContextLengthTokens: number; // 1,000 to 64,000 tokens
  currency: 'INR' | 'USD';
}

export interface MemoryTraceStage {
  stage: number;
  stageName: string;
  allocatedVramGb: number;
  utilizationPct: number;
  status: 'OPTIMAL' | 'ALLOCATED' | 'PRESSURE';
}

export interface PagedAttentionOutputs {
  effectiveMemoryUtilizationPct: number;
  internalFragmentationPct: number;
  timeToFirstTokenLatencyMs: number;
  tokensPerSecondPerGpu: number;
  maxConcurrentStreamsBeforeOom: number;
  annualHardwareCostSavings: string;
  vramStatusClassification: 'PAGED_VIRTUAL_OPTIMAL' | 'HIGH_CONCURRENCY_STABLE' | 'OOM_MEMORY_PRESSURE';
  memoryTrace: MemoryTraceStage[];
}

export function calculatePagedAttention(inputs: PagedAttentionInputs): PagedAttentionOutputs {
  const {
    modelArchitecture,
    gpuHardwareType,
    memoryAllocationEngine,
    kvCacheQuantization,
    concurrentAgentStreams,
    averageContextLengthTokens,
    currency
  } = inputs;

  // Base GPU VRAM capacity in GB
  let totalVramGb = 80;
  let memoryBandwidthTbps = 3.35; // H100 SXM5
  if (gpuHardwareType === 'nvidia_h100_80gb') {
    totalVramGb = 80;
    memoryBandwidthTbps = 3.35;
  } else if (gpuHardwareType === 'nvidia_a100_80gb') {
    totalVramGb = 80;
    memoryBandwidthTbps = 2.03;
  } else if (gpuHardwareType === 'nvidia_l40s_48gb') {
    totalVramGb = 48;
    memoryBandwidthTbps = 0.86;
  } else if (gpuHardwareType === 'nvidia_rtx_4090_24gb') {
    totalVramGb = 24;
    memoryBandwidthTbps = 1.0;
  }

  // Model static weights size (assuming 4-bit AWQ quantized for on-premise serving)
  let staticWeightVramGb = 38.0; // Llama 3 70B 4-bit
  let kvBytesPerToken = 262.144; // FP16
  if (modelArchitecture === 'llama_3_70b') {
    staticWeightVramGb = 38.0;
    kvBytesPerToken = 262.144;
  } else if (modelArchitecture === 'deepseek_r1_671b') {
    staticWeightVramGb = 360.0 / 8; // Tensor parallel 8-way: 45 GB per GPU
    kvBytesPerToken = 65.536; // MLA multi-head latent attention
  } else if (modelArchitecture === 'mistral_large_123b') {
    staticWeightVramGb = 68.0 / 2; // TP 2-way: 34 GB per GPU
    kvBytesPerToken = 312.0;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    staticWeightVramGb = 39.0;
    kvBytesPerToken = 245.76;
  }

  // KV Cache quantization reduction
  if (kvCacheQuantization === 'fp8_e4m3') {
    kvBytesPerToken *= 0.5;
  } else if (kvCacheQuantization === 'int4_kivi') {
    kvBytesPerToken *= 0.25;
  }

  // Available VRAM for KV Cache
  const availableKvVramGb = Math.max(2.0, totalVramGb - staticWeightVramGb - 2.0); // 2GB runtime CUDA overhead

  // Allocation engine multipliers
  let utilizationBase = 96.5;
  let fragmentationBase = 3.5;
  let ttftMultiplier = 1.0;
  if (memoryAllocationEngine === 'vllm_paged_attention') {
    utilizationBase = 96.8;
    fragmentationBase = 3.2;
    ttftMultiplier = 0.85; // Chunked prefill
  } else if (memoryAllocationEngine === 'tensorrt_llm_paged') {
    utilizationBase = 95.4;
    fragmentationBase = 4.6;
    ttftMultiplier = 0.80;
  } else if (memoryAllocationEngine === 'naive_contiguous_pytorch') {
    utilizationBase = 34.2;
    fragmentationBase = 65.8;
    ttftMultiplier = 2.4;
  } else if (memoryAllocationEngine === 'huggingface_accelerate') {
    utilizationBase = 42.0;
    fragmentationBase = 58.0;
    ttftMultiplier = 1.9;
  }

  // Calculate required KV VRAM per stream in GB
  const kvVramPerStreamGb = (averageContextLengthTokens * kvBytesPerToken) / (1024 * 1024 * 1024);
  const totalRawKvRequestedGb = kvVramPerStreamGb * concurrentAgentStreams;

  // Max streams before OOM under current engine
  const effectiveUsableVramGb = availableKvVramGb * (utilizationBase / 100);
  const maxConcurrentStreamsBeforeOom = Math.max(1, Math.floor(effectiveUsableVramGb / Math.max(0.05, kvVramPerStreamGb)));

  // TTFT calculation in ms
  const baseTtftMs = (averageContextLengthTokens / 1000) * (18.5 / memoryBandwidthTbps) * 100;
  const concurrencyPressure = Math.min(3.5, 1.0 + (concurrentAgentStreams / Math.max(1, maxConcurrentStreamsBeforeOom)) * 0.8);
  const timeToFirstTokenLatencyMs = Math.round(baseTtftMs * ttftMultiplier * concurrencyPressure);

  // Tokens per second per GPU
  const tokensPerSecondPerGpu = Math.round((memoryBandwidthTbps * 850) / (staticWeightVramGb / 10) * (utilizationBase / 100));

  // Memory status
  let vramStatusClassification: 'PAGED_VIRTUAL_OPTIMAL' | 'HIGH_CONCURRENCY_STABLE' | 'OOM_MEMORY_PRESSURE' = 'HIGH_CONCURRENCY_STABLE';
  if (concurrentAgentStreams <= maxConcurrentStreamsBeforeOom && utilizationBase >= 90) {
    vramStatusClassification = 'PAGED_VIRTUAL_OPTIMAL';
  } else if (concurrentAgentStreams > maxConcurrentStreamsBeforeOom) {
    vramStatusClassification = 'OOM_MEMORY_PRESSURE';
  }

  // Cost savings calculation
  const gpuNodesSaved = Math.max(1, Math.round((concurrentAgentStreams / Math.max(1, (effectiveUsableVramGb / kvVramPerStreamGb * 0.35))) - (concurrentAgentStreams / maxConcurrentStreamsBeforeOom)));
  const annualSavingsUsd = Math.max(12000, gpuNodesSaved * 34000);

  let annualHardwareCostSavings = '';
  if (currency === 'INR') {
    const inrLakhs = Math.round((annualSavingsUsd * 86.5) / 100000);
    annualHardwareCostSavings = `₹${inrLakhs.toLocaleString('en-IN')} Lakhs/yr`;
  } else {
    annualHardwareCostSavings = `$${(annualSavingsUsd / 1000).toFixed(0)}k/yr`;
  }

  const memoryTrace: MemoryTraceStage[] = [
    {
      stage: 1,
      stageName: 'Model Weights Allocation (AWQ 4-Bit)',
      allocatedVramGb: Math.round(staticWeightVramGb * 10) / 10,
      utilizationPct: Math.round((staticWeightVramGb / totalVramGb) * 100),
      status: 'ALLOCATED'
    },
    {
      stage: 2,
      stageName: 'PagedAttention Virtual Block Pool',
      allocatedVramGb: Math.round(availableKvVramGb * 10) / 10,
      utilizationPct: Math.round(utilizationBase),
      status: utilizationBase >= 90 ? 'OPTIMAL' : 'PRESSURE'
    },
    {
      stage: 3,
      stageName: 'Active KV-Cache Concurrency Footprint',
      allocatedVramGb: Math.min(totalVramGb, Math.round((staticWeightVramGb + totalRawKvRequestedGb) * 10) / 10),
      utilizationPct: Math.min(100, Math.round(((staticWeightVramGb + totalRawKvRequestedGb) / totalVramGb) * 100)),
      status: totalRawKvRequestedGb > availableKvVramGb ? 'PRESSURE' : 'OPTIMAL'
    }
  ];

  return {
    effectiveMemoryUtilizationPct: Math.min(99.0, Math.round(utilizationBase * 10) / 10),
    internalFragmentationPct: Math.max(1.0, Math.round(fragmentationBase * 10) / 10),
    timeToFirstTokenLatencyMs: Math.max(12, timeToFirstTokenLatencyMs),
    tokensPerSecondPerGpu,
    maxConcurrentStreamsBeforeOom,
    annualHardwareCostSavings,
    vramStatusClassification,
    memoryTrace
  };
}
