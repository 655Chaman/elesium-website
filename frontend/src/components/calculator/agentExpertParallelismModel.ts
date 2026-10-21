// Mathematical model for Tool #63:
// Enterprise Autonomous Agent Expert Parallelism & MoE Dynamic Dispatch Simulator

export type ModelArchitecture =
  | 'deepseek_v2_236b'
  | 'deepseek_v3_671b'
  | 'mixtral_8x22b'
  | 'qwen_2_5_moe';

export type EpDegree = 2 | 4 | 8 | 16 | 32 | 64;

export type InterconnectType =
  | 'nvlink_4_900gb'
  | 'nvlink_3_600gb'
  | 'infiniband_ndr_400gb'
  | 'pcie_gen5_128gb';

export type DispatchMode =
  | 'async_alltoall_overlap'
  | 'two_stage_packed'
  | 'blocking_alltoall';

export interface ExpertParallelismInputs {
  modelArchitecture: ModelArchitecture;
  epDegree: EpDegree;
  totalExperts: number; // 8 to 256
  topK: number; // 1 to 8
  batchSize: number; // 1 to 128
  interconnect: InterconnectType;
  dispatchMode: DispatchMode;
  currency: 'INR' | 'USD';
}

export interface ExpertParallelismOutputs {
  expertsPerGpu: number;
  tokensPerExpert: number;
  allToAllDispatchMs: number;
  expertGemmComputeMs: number;
  effectiveStepLatencyMs: number;
  commOverlapEfficiencyPercent: number;
  annualFinOpsSavings: string;
  slaStatus: 'SUB_8MS_MOE_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK';
}

export function calculateExpertParallelism(
  inputs: ExpertParallelismInputs
): ExpertParallelismOutputs {
  const {
    modelArchitecture,
    epDegree,
    totalExperts,
    topK,
    batchSize,
    interconnect,
    dispatchMode,
    currency
  } = inputs;

  const expertsPerGpu = Math.max(1, Math.round(totalExperts / epDegree));
  const totalTokens = batchSize * topK;
  const tokensPerExpert = Math.round((totalTokens / Math.max(1, totalExperts)) * 10) / 10;

  // Interconnect bandwidth ratings in GB/s
  let busBw = 900.0;
  if (interconnect === 'nvlink_3_600gb') busBw = 600.0;
  else if (interconnect === 'infiniband_ndr_400gb') busBw = 400.0;
  else if (interconnect === 'pcie_gen5_128gb') busBw = 128.0;

  // Hidden dimensions
  let hiddenDim = 5120;
  if (modelArchitecture === 'deepseek_v3_671b') hiddenDim = 7168;
  else if (modelArchitecture === 'mixtral_8x22b') hiddenDim = 6144;
  else if (modelArchitecture === 'qwen_2_5_moe') hiddenDim = 4096;

  // All-to-all communication volume: ((ep - 1) / ep) * (b * k * d * 2 bytes fp16)
  const dispatchBytes = ((epDegree - 1) / epDegree) * (batchSize * topK * hiddenDim * 2.0);
  const baseCommMs = (dispatchBytes / (busBw * 1e6)) * 1000.0;

  // Expert sparse GEMM compute time estimation
  const gemmComputeMs = Math.max(1.8, (tokensPerExpert * hiddenDim * hiddenDim * 2.0) / 2.0e9 * 1000.0);

  let commOverlap = 95.2;
  let effectiveLatency = Math.max(gemmComputeMs, baseCommMs * 0.18);

  if (dispatchMode === 'two_stage_packed') {
    commOverlap = 82.0;
    effectiveLatency = Math.max(gemmComputeMs, baseCommMs * 0.38);
  } else if (dispatchMode === 'blocking_alltoall') {
    commOverlap = 0.0;
    effectiveLatency = gemmComputeMs + baseCommMs;
  }

  // Interconnect penalties
  if (interconnect === 'pcie_gen5_128gb') {
    effectiveLatency *= 2.4;
    commOverlap = Math.max(15.0, commOverlap - 40.0);
  } else if (interconnect === 'infiniband_ndr_400gb') {
    effectiveLatency *= 1.3;
    commOverlap = Math.max(30.0, commOverlap - 15.0);
  }

  const imbalanceRatio = 1.12; // Empirical routing load imbalance factor
  const effectiveStepLatencyMs = Math.round(effectiveLatency * imbalanceRatio * 10) / 10;
  const allToAllDispatchMs = Math.round(baseCommMs * 100) / 100;
  const expertGemmComputeMs = Math.round(gemmComputeMs * 100) / 100;
  const commOverlapEfficiencyPercent = Math.round(commOverlap * 10) / 10;

  // FinOps savings
  const annualSavingsLakhs = Math.round(Math.max(30.0, (totalExperts / 64.0) * 45.0) * 10) / 10;

  let formattedSavings = `₹${annualSavingsLakhs.toLocaleString()} Lakhs / year`;
  if (currency === 'USD') {
    const usdSavings = Math.round((annualSavingsLakhs * 100000) / 84);
    formattedSavings = `$${usdSavings.toLocaleString()} / year`;
  }

  let slaStatus: 'SUB_8MS_MOE_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK' = 'SUB_8MS_MOE_OPTIMAL';
  if (effectiveStepLatencyMs > 14.0 || commOverlapEfficiencyPercent < 60.0) {
    slaStatus = 'COMMUNICATION_BOTTLENECK';
  } else if (effectiveStepLatencyMs > 8.0 || commOverlapEfficiencyPercent < 80.0) {
    slaStatus = 'ACCEPTABLE_PARTIAL_OVERLAP';
  }

  return {
    expertsPerGpu,
    tokensPerExpert,
    allToAllDispatchMs,
    expertGemmComputeMs,
    effectiveStepLatencyMs,
    commOverlapEfficiencyPercent,
    annualFinOpsSavings: formattedSavings,
    slaStatus
  };
}
