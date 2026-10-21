// Mathematical model for Tool #62:
// Enterprise Autonomous Agent Sequence Parallelism & Ring Self-Attention Simulator

export type ModelArchitecture =
  | 'llama_3_1_70b'
  | 'deepseek_v2_236b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type SpDegree = 2 | 4 | 8 | 16 | 32;

export type InterconnectType =
  | 'nvlink_4_900gb'
  | 'nvlink_3_600gb'
  | 'infiniband_ndr_400gb'
  | 'pcie_gen5_128gb';

export type RingMode =
  | 'async_p2p_overlap'
  | 'double_buffered_ring'
  | 'blocking_synchronous';

export interface SequenceParallelismInputs {
  modelArchitecture: ModelArchitecture;
  spDegree: SpDegree;
  totalContextTokens: number; // 16k to 1048k
  interconnect: InterconnectType;
  ringMode: RingMode;
  currency: 'INR' | 'USD';
}

export interface SequenceParallelismOutputs {
  perGpuContextTokens: number;
  ringShiftSteps: number;
  perStepKvCommMs: number;
  perStepGemmComputeMs: number;
  effectiveStepLatencyMs: number;
  commOverlapEfficiencyPercent: number;
  peakKvVramGb: number;
  annualFinOpsSavings: string;
  slaStatus: 'SUB_10MS_1M_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK';
}

export function calculateSequenceParallelism(
  inputs: SequenceParallelismInputs
): SequenceParallelismOutputs {
  const {
    modelArchitecture,
    spDegree,
    totalContextTokens,
    interconnect,
    ringMode,
    currency
  } = inputs;

  const tokensPerGpu = Math.round(totalContextTokens / spDegree);
  const ringShiftSteps = spDegree;

  // Interconnect bandwidth in GB/s
  let busBw = 900.0;
  if (interconnect === 'nvlink_3_600gb') busBw = 600.0;
  else if (interconnect === 'infiniband_ndr_400gb') busBw = 400.0;
  else if (interconnect === 'pcie_gen5_128gb') busBw = 128.0;

  // Model hidden dimension
  let hiddenDim = 8192;
  if (modelArchitecture === 'deepseek_v2_236b') hiddenDim = 5120;
  else if (modelArchitecture === 'mistral_large_123b') hiddenDim = 12288;

  // Key-Value chunk size in bytes (fp16: 2 bytes per element for K and V)
  const chunkBytes = 2.0 * (tokensPerGpu * hiddenDim * 2.0);
  const baseTransferMs = (chunkBytes / (busBw * 1e6)) * 1000.0;

  // Local attention compute time estimation
  const gemmComputeMs = Math.max(1.2, (tokensPerGpu * tokensPerGpu * hiddenDim * 2.0) / 1.5e9 * 1000.0);

  let commOverlap = 96.8;
  let effectiveLatency = Math.max(gemmComputeMs, baseTransferMs * 0.15);

  if (ringMode === 'double_buffered_ring') {
    commOverlap = 84.5;
    effectiveLatency = Math.max(gemmComputeMs, baseTransferMs * 0.35);
  } else if (ringMode === 'blocking_synchronous') {
    commOverlap = 0.0;
    effectiveLatency = gemmComputeMs + baseTransferMs;
  }

  // Interconnect penalties
  if (interconnect === 'pcie_gen5_128gb') {
    commOverlap = Math.max(10.0, commOverlap - 45.0);
    effectiveLatency *= 2.6;
  } else if (interconnect === 'infiniband_ndr_400gb') {
    commOverlap = Math.max(30.0, commOverlap - 12.0);
    effectiveLatency *= 1.4;
  }

  const perStepKvCommMs = Math.round(baseTransferMs * 100) / 100;
  const perStepGemmComputeMs = Math.round(gemmComputeMs * 100) / 100;
  const effectiveStepLatencyMs = Math.round(effectiveLatency * 10) / 10;
  const commOverlapEfficiencyPercent = Math.round(commOverlap * 10) / 10;

  // Peak KV VRAM: 32 layers * 2 (K, V) * tokensPerGpu * hiddenDim * 2 bytes
  const peakKvVramGb = Math.round(((tokensPerGpu * hiddenDim * 2.0 * 32.0 * 2.0) / (1024 ** 3)) * 10) / 10;

  // FinOps savings
  const annualSavingsLakhs = Math.round(Math.max(25.0, (totalContextTokens / 65536.0) * 18.5) * 10) / 10;

  let formattedSavings = `₹${annualSavingsLakhs.toLocaleString()} Lakhs / year`;
  if (currency === 'USD') {
    const usdSavings = Math.round((annualSavingsLakhs * 100000) / 84);
    formattedSavings = `$${usdSavings.toLocaleString()} / year`;
  }

  let slaStatus: 'SUB_10MS_1M_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK' = 'SUB_10MS_1M_OPTIMAL';
  if (effectiveStepLatencyMs > 18.0 || peakKvVramGb > 75.0) {
    slaStatus = 'COMMUNICATION_BOTTLENECK';
  } else if (effectiveStepLatencyMs > 10.0 || commOverlapEfficiencyPercent < 80.0) {
    slaStatus = 'ACCEPTABLE_PARTIAL_OVERLAP';
  }

  return {
    perGpuContextTokens: tokensPerGpu,
    ringShiftSteps,
    perStepKvCommMs,
    perStepGemmComputeMs,
    effectiveStepLatencyMs,
    commOverlapEfficiencyPercent,
    peakKvVramGb,
    annualFinOpsSavings: formattedSavings,
    slaStatus
  };
}
