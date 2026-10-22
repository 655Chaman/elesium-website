export type SpeculativeModelArchitecture =
  | 'deepseek_r1_671b_moe'
  | 'llama_3_1_70b'
  | 'qwen_2_5_72b'
  | 'sovereign_100b_agent'
  | 'llama_3_405b';

export type TreeTopology =
  | 'dynamic_eagle2_tree'
  | 'medusa_4_branch'
  | 'top_k_pruned_tree'
  | 'sequential_draft_linear';

export type TargetGpuCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_blackwell'
  | 'nvidia_h200_sxm'
  | 'nvidia_l40s_cluster';

export type WarpOptimization =
  | 'warp_aligned_flattening'
  | 'naive_divergent_gemm';

export interface SpeculativeTreeInputs {
  modelArchitecture: SpeculativeModelArchitecture;
  treeTopology: TreeTopology;
  treeDepth: number;
  branchingFactor: number;
  targetGpuCluster: TargetGpuCluster;
  warpOptimization: WarpOptimization;
  dailyTokenVolumeMillions: number;
  currency: 'INR' | 'USD';
}

export interface SpeculativeTreeResults {
  meanAcceptedTokensPerStep: number;
  interTokenLatencyMs: number;
  throughputSpeedupMultiplier: number;
  warpDivergencePenaltyPercent: number;
  smOccupancyPercent: number;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  statusClassification:
    | 'SUB_8MS_WARP_OPTIMAL'
    | 'TREE_ACCELERATED_BALANCED'
    | 'WARP_DIVERGENCE_BOTTLENECK'
    | 'SEQUENTIAL_SPECULATION_CAPPED';
}

export function calculateSpeculativeTree(
  inputs: SpeculativeTreeInputs
): SpeculativeTreeResults {
  const {
    modelArchitecture,
    treeTopology,
    treeDepth,
    branchingFactor,
    targetGpuCluster,
    warpOptimization,
    dailyTokenVolumeMillions,
    currency
  } = inputs;

  // Base forward pass verification time per step (ms) on target GPU
  let baseTargetForwardMs = 22.0;
  if (targetGpuCluster === 'nvidia_b200_blackwell') {
    baseTargetForwardMs = 8.5;
  } else if (targetGpuCluster === 'nvidia_h200_sxm') {
    baseTargetForwardMs = 17.5;
  } else if (targetGpuCluster === 'nvidia_h100_sxm5') {
    baseTargetForwardMs = 21.0;
  } else if (targetGpuCluster === 'nvidia_l40s_cluster') {
    baseTargetForwardMs = 38.0;
  }

  // Model size factor
  let modelSizeWeight = 1.0;
  if (modelArchitecture === 'llama_3_405b') {
    modelSizeWeight = 2.4;
  } else if (modelArchitecture === 'deepseek_r1_671b_moe') {
    modelSizeWeight = 1.6;
  } else if (modelArchitecture === 'sovereign_100b_agent') {
    modelSizeWeight = 1.25;
  } else if (modelArchitecture === 'qwen_2_5_72b' || modelArchitecture === 'llama_3_1_70b') {
    modelSizeWeight = 1.0;
  }

  // Base mean accepted tokens per step
  let meanAccepted = 1.0;
  if (treeTopology === 'dynamic_eagle2_tree') {
    // Dynamic contextual tree reaches 3.8 to 5.2 tokens
    meanAccepted = Math.min(treeDepth, 1.8 + 0.55 * branchingFactor + 0.3 * (treeDepth - 2));
  } else if (treeTopology === 'top_k_pruned_tree') {
    meanAccepted = Math.min(treeDepth, 1.5 + 0.45 * branchingFactor + 0.25 * (treeDepth - 2));
  } else if (treeTopology === 'medusa_4_branch') {
    meanAccepted = Math.min(treeDepth, 1.4 + 0.35 * branchingFactor + 0.2 * (treeDepth - 2));
  } else {
    // Sequential draft linear is capped at 1.8 - 2.2 tokens
    meanAccepted = Math.min(2.1, 1.2 + 0.15 * treeDepth);
  }

  // Warp divergence penalty
  let warpDivergencePenalty = 0.0;
  let smOccupancy = 94.5;
  if (warpOptimization === 'naive_divergent_gemm') {
    warpDivergencePenalty = treeTopology === 'sequential_draft_linear' ? 12.0 : 38.5;
    smOccupancy = 61.2;
  } else {
    warpDivergencePenalty = 1.2;
    smOccupancy = 96.8;
  }

  // Verification step time factoring tree candidates and divergence
  const totalCandidates = treeTopology === 'sequential_draft_linear'
    ? treeDepth
    : Math.min(64, Math.floor(Math.pow(branchingFactor, Math.min(3, treeDepth))));

  const candidateOverhead = 1.0 + (totalCandidates / 64) * 0.22;
  const divergenceMultiplier = 1.0 + (warpDivergencePenalty / 100);

  const effectiveStepLatency = (baseTargetForwardMs * modelSizeWeight * candidateOverhead * divergenceMultiplier);
  const interTokenLatency = effectiveStepLatency / Math.max(1.0, meanAccepted);

  const baselineAutoregressiveLatency = baseTargetForwardMs * modelSizeWeight;
  const throughputSpeedup = baselineAutoregressiveLatency / Math.max(1.0, interTokenLatency);

  // Status classification
  let statusClassification: SpeculativeTreeResults['statusClassification'] = 'TREE_ACCELERATED_BALANCED';
  if (interTokenLatency < 8.0 && warpOptimization === 'warp_aligned_flattening') {
    statusClassification = 'SUB_8MS_WARP_OPTIMAL';
  } else if (warpOptimization === 'naive_divergent_gemm' && warpDivergencePenalty > 25.0) {
    statusClassification = 'WARP_DIVERGENCE_BOTTLENECK';
  } else if (treeTopology === 'sequential_draft_linear') {
    statusClassification = 'SEQUENTIAL_SPECULATION_CAPPED';
  }

  // FinOps calculation
  // Baseline GPU cost: $3.20/hour per H100 GPU equivalent
  const dailyHoursSaved = (1.0 - (1.0 / throughputSpeedup)) * 24.0 * (dailyTokenVolumeMillions / 20.0);
  const rawAnnualSavingsUsd = Math.round(dailyHoursSaved * 3.20 * 8 * 365);

  let formattedSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / year`;
  if (currency === 'INR') {
    const savingsInrCrores = (rawAnnualSavingsUsd * 86.5) / 10000000;
    formattedSavings = `₹${savingsInrCrores.toFixed(2)} Cr / year`;
  }

  return {
    meanAcceptedTokensPerStep: Number(meanAccepted.toFixed(2)),
    interTokenLatencyMs: Number(interTokenLatency.toFixed(1)),
    throughputSpeedupMultiplier: Number(throughputSpeedup.toFixed(2)),
    warpDivergencePenaltyPercent: Number(warpDivergencePenalty.toFixed(1)),
    smOccupancyPercent: Number(smOccupancy.toFixed(1)),
    annualFinOpsSavings: formattedSavings,
    rawAnnualSavingsUsd,
    statusClassification
  };
}
