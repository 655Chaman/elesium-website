export type CpModelArchitecture =
  | 'llama_3_1_70b_128k'
  | 'deepseek_v3_128k'
  | 'mistral_large_128k'
  | 'qwen_2_5_72b_128k'
  | 'custom_sovereign_2m';

export type CpDegree = 2 | 4 | 8 | 16 | 32 | 64;

export type CpInterconnectType =
  | 'nvlink_4_900gb'
  | 'nvlink_3_600gb'
  | 'infiniband_ndr_400gb'
  | 'roce_v2_200gb'
  | 'pcie_gen5_128gb';

export type CpAttentionMechanism =
  | 'ring_attention'
  | 'deepspeed_ulysses'
  | 'hybrid_ring_ulysses'
  | 'naive_all_gather';

export interface ContextParallelismInputs {
  modelArchitecture: CpModelArchitecture;
  cpDegree: CpDegree;
  sequenceLengthTokens: number; // e.g. 131072 to 2097152
  interconnect: CpInterconnectType;
  attentionMechanism: CpAttentionMechanism;
  causalMasking: boolean;
  currency: 'INR' | 'USD';
}

export interface ContextParallelismResults {
  tokensPerGpu: number;
  unpartitionedKvMemoryGb: number;
  shardedKvMemoryGb: number;
  localComputeLatencyMs: number;
  ringTransferLatencyMs: number;
  commOverlapEfficiencyPercent: number;
  effectiveStepLatencyMs: number;
  slaStatus: 'SUB_12MS_CP_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOUND_STALL';
  oomRiskPrevented: boolean;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  tokensPerSecondThroughput: number;
}

export function calculateContextParallelism(
  inputs: ContextParallelismInputs
): ContextParallelismResults {
  const {
    modelArchitecture,
    cpDegree,
    sequenceLengthTokens,
    interconnect,
    attentionMechanism,
    causalMasking,
    currency
  } = inputs;

  // Interconnect unidirectional / bi-directional effective bandwidth (GB/s)
  const bandwidthMap: Record<CpInterconnectType, number> = {
    nvlink_4_900gb: 900.0,
    nvlink_3_600gb: 600.0,
    infiniband_ndr_400gb: 400.0,
    roce_v2_200gb: 200.0,
    pcie_gen5_128gb: 128.0
  };
  const busBandwidthGbSec = bandwidthMap[interconnect] || 900.0;

  // Model parameters (Layers, Hidden dim, KV heads, Head dim)
  let numLayers = 80;
  let hiddenDim = 8192;
  let numKvHeads = 8;
  let headDim = 128;

  if (modelArchitecture === 'deepseek_v3_128k') {
    numLayers = 61;
    hiddenDim = 7168;
    numKvHeads = 8;
    headDim = 128;
  } else if (modelArchitecture === 'mistral_large_128k') {
    numLayers = 88;
    hiddenDim = 8192;
    numKvHeads = 8;
    headDim = 128;
  } else if (modelArchitecture === 'qwen_2_5_72b_128k') {
    numLayers = 80;
    hiddenDim = 8192;
    numKvHeads = 8;
    headDim = 128;
  } else if (modelArchitecture === 'custom_sovereign_2m') {
    numLayers = 96;
    hiddenDim = 8192;
    numKvHeads = 16;
    headDim = 128;
  }

  const tokensPerGpu = Math.round(sequenceLengthTokens / cpDegree);

  // Bytes per token for FP16/BF16 KV cache: 2 bytes * 2 (K + V) * numLayers * numKvHeads * headDim
  const kvBytesPerToken = 2 * 2 * numLayers * numKvHeads * headDim;
  const unpartitionedKvMemoryGb = parseFloat(
    ((sequenceLengthTokens * kvBytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );
  const shardedKvMemoryGb = parseFloat(
    (unpartitionedKvMemoryGb / cpDegree).toFixed(2)
  );

  // Attention FLOPs per step per GPU
  // QK^T: 2 * tokensPerGpu * tokensPerGpu * headDim * numKvHeads * numLayers
  // If causal, block-triangular pruning reduces FLOPs by ~50%
  const causalFactor = causalMasking ? 0.55 : 1.0;
  const tflopsPerGpuPerStep =
    (4 * tokensPerGpu * tokensPerGpu * hiddenDim * numLayers * causalFactor) / 1e12;

  // H100 Tensor Core BF16 peak ~ 989 TFLOPS, realistic efficiency ~ 45% -> ~445 TFLOPS
  const effectiveGpuTflops = 445.0;
  const localComputeLatencyMs = parseFloat(
    ((tflopsPerGpuPerStep / effectiveGpuTflops) * 1000).toFixed(2)
  );

  // Communication latency per ring shift:
  // Transfer KV chunk of size (tokensPerGpu * kvBytesPerToken) / (cpDegree for Ring)
  // Bytes to transfer per step: (tokensPerGpu * kvBytesPerToken)
  let commMultiplier = 1.0;
  if (attentionMechanism === 'deepspeed_ulysses') {
    // All-to-all sharding across heads
    commMultiplier = 1.25;
  } else if (attentionMechanism === 'hybrid_ring_ulysses') {
    commMultiplier = 0.9;
  } else if (attentionMechanism === 'naive_all_gather') {
    commMultiplier = 2.4;
  }

  const chunkBytesPerShift = (tokensPerGpu * kvBytesPerToken) / numLayers; // per layer shift
  const totalCommBytes = chunkBytesPerShift * numLayers * commMultiplier;
  const ringTransferLatencyMs = parseFloat(
    ((totalCommBytes / (busBandwidthGbSec * 1e9)) * 1000).toFixed(2)
  );

  // Overlap ratio: how much communication is hidden behind computation
  let overlapRatio = 0.0;
  if (ringTransferLatencyMs > 0) {
    overlapRatio = Math.min(100.0, (localComputeLatencyMs / ringTransferLatencyMs) * 100.0);
  }
  const commOverlapEfficiencyPercent = parseFloat(overlapRatio.toFixed(1));

  // Effective forward step latency
  let effectiveStepLatencyMs = 0;
  if (commOverlapEfficiencyPercent >= 95.0) {
    // Fully compute-bound; communication hidden
    effectiveStepLatencyMs = localComputeLatencyMs * 1.05;
  } else {
    effectiveStepLatencyMs = Math.max(localComputeLatencyMs, ringTransferLatencyMs) * 1.15;
  }
  effectiveStepLatencyMs = parseFloat(effectiveStepLatencyMs.toFixed(2));

  // Determine SLA status
  let slaStatus: 'SUB_12MS_CP_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOUND_STALL' =
    'SUB_12MS_CP_OPTIMAL';
  if (effectiveStepLatencyMs > 25.0) {
    slaStatus = 'COMMUNICATION_BOUND_STALL';
  } else if (effectiveStepLatencyMs > 12.0) {
    slaStatus = 'ACCEPTABLE_PARTIAL_OVERLAP';
  }

  const oomRiskPrevented = unpartitionedKvMemoryGb > 80.0; // H100 80GB VRAM barrier

  // Throughput (tokens/sec)
  const tokensPerSecondThroughput = Math.round(
    (sequenceLengthTokens / (effectiveStepLatencyMs / 1000))
  );

  // Annual FinOps savings:
  // Without CP, running 2M context requires multiple replicated monolithic nodes or causes massive OOM paging.
  // Model annual cloud GPU rental savings ($3.50/GPU-hr on 8xH100 clusters)
  const rawAnnualSavingsUsd = Math.round(
    (unpartitionedKvMemoryGb / 40.0) * cpDegree * 38500
  );

  const rawAnnualSavings =
    currency === 'INR'
      ? rawAnnualSavingsUsd * 87.5
      : rawAnnualSavingsUsd;

  const annualFinOpsSavings =
    currency === 'INR'
      ? `₹${(rawAnnualSavings / 100000).toFixed(1)} Lakhs`
      : `$${(rawAnnualSavings / 1000).toFixed(0)}k`;

  return {
    tokensPerGpu,
    unpartitionedKvMemoryGb,
    shardedKvMemoryGb,
    localComputeLatencyMs,
    ringTransferLatencyMs,
    commOverlapEfficiencyPercent,
    effectiveStepLatencyMs,
    slaStatus,
    oomRiskPrevented,
    annualFinOpsSavings,
    rawAnnualSavingsUsd,
    tokensPerSecondThroughput
  };
}
