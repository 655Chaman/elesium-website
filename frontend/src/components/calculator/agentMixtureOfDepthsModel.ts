// Mathematical model for Tool #56:
// Enterprise Autonomous Agent Mixture-of-Depths (MoD) Dynamic Compute Allocation Simulator

export type FoundationModel =
  | 'llama_3_70b'
  | 'mistral_large_123b'
  | 'qwen_2_5_72b'
  | 'deepseek_r1_671b';

export type HardwareCluster =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_ada';

export interface MixtureOfDepthsInputs {
  foundationModel: FoundationModel;
  capacityFactor: number; // 0.125 to 0.875 (fraction of tokens computing per layer)
  sequenceLength: number; // 1024 to 32768 tokens
  batchSize: number; // 16 to 512 sequences
  hardwareCluster: HardwareCluster;
  currency: 'INR' | 'USD';
}

export interface MoDExecutionStage {
  stage: string;
  description: string;
  tokensProcessed: number;
  flopTeraflops: number;
  status: 'ROUTED_COMPUTE' | 'RESIDUAL_BYPASS' | 'STATIC_PADDED';
}

export interface MixtureOfDepthsOutputs {
  effectiveFlopsTflops: number;
  baselineDenseFlopsTflops: number;
  flopReductionPercent: number;
  speedupMultiplier: number;
  activeTokensPerLayer: number;
  bypassedTokensPerLayer: number;
  throughputTokensPerSec: number;
  annualClusterSavings: string;
  slaStatus: 'SUB_50_PERCENT_LEADER' | 'SUB_30_PERCENT_ACCEPTABLE' | 'DENSE_BASELINE';
  executionTrace: MoDExecutionStage[];
}

export function calculateMixtureOfDepths(inputs: MixtureOfDepthsInputs): MixtureOfDepthsOutputs {
  const {
    foundationModel,
    capacityFactor,
    sequenceLength,
    batchSize,
    hardwareCluster,
    currency
  } = inputs;

  // 1. Foundation Model Specs
  let baseParamsBillion = 70.0;
  let totalLayers = 80;

  if (foundationModel === 'deepseek_r1_671b') {
    baseParamsBillion = 671.0;
    totalLayers = 61;
  } else if (foundationModel === 'mistral_large_123b') {
    baseParamsBillion = 123.0;
    totalLayers = 88;
  } else if (foundationModel === 'qwen_2_5_72b') {
    baseParamsBillion = 72.0;
    totalLayers = 80;
  }

  // Baseline dense FLOPs: 2 FLOPs per param per token
  const totalTokens = sequenceLength * batchSize;
  const baselineDenseFlopsTflops = Math.round(((2.0 * baseParamsBillion * 1e9 * totalTokens) / 1e12) * 10) / 10;

  // Effective MoD FLOPs
  const effectiveFlopsTflops = Math.round(baselineDenseFlopsTflops * (capacityFactor + 0.02) * 10) / 10;
  const flopReductionPercent = Math.max(0, Math.round((1.0 - capacityFactor) * 100));

  // 2. Token Partitioning
  const activeTokensPerLayer = Math.round(sequenceLength * capacityFactor);
  const bypassedTokensPerLayer = Math.max(0, sequenceLength - activeTokensPerLayer);

  // 3. Hardware Speedup & Throughput
  let hardwareThroughputBase = 44.0; // Tokens/sec per batch slot on H100
  let hourlyHardwareCostUsd = 4.5;

  if (hardwareCluster === 'nvidia_b200_nvl') {
    hardwareThroughputBase = 72.0;
    hourlyHardwareCostUsd = 7.8;
  } else if (hardwareCluster === 'nvidia_a100_80gb') {
    hardwareThroughputBase = 32.0;
    hourlyHardwareCostUsd = 3.0;
  } else if (hardwareCluster === 'nvidia_l40s_ada') {
    hardwareThroughputBase = 26.0;
    hourlyHardwareCostUsd = 2.2;
  }

  const speedupMultiplier = Math.round((1.0 / (capacityFactor + 0.08)) * 100) / 100;
  const throughputTokensPerSec = Math.round(batchSize * hardwareThroughputBase * speedupMultiplier);

  // 4. SLA Status
  let slaStatus: 'SUB_50_PERCENT_LEADER' | 'SUB_30_PERCENT_ACCEPTABLE' | 'DENSE_BASELINE' = 'SUB_50_PERCENT_LEADER';
  if (flopReductionPercent < 30) {
    slaStatus = 'DENSE_BASELINE';
  } else if (flopReductionPercent < 50) {
    slaStatus = 'SUB_30_PERCENT_ACCEPTABLE';
  }

  // 5. FinOps Savings
  const savedGpus = Math.max(1, Math.round((flopReductionPercent / 100.0) * (baseParamsBillion > 100 ? 8 : 4)));
  const annualSavedUsd = savedGpus * hourlyHardwareCostUsd * 24 * 365 * 0.70;
  const annualSavedInrLakhs = Math.round((annualSavedUsd * 84) / 100000);

  const annualClusterSavings =
    currency === 'INR'
      ? `₹${annualSavedInrLakhs.toLocaleString()} Lakhs`
      : `$${Math.round(annualSavedUsd).toLocaleString()}`;

  // 6. Execution Trace
  const executionTrace: MoDExecutionStage[] = [
    {
      stage: 'Learned Linear Router Score Projection',
      description: `Lightweight scalar router projects token representations across ${totalLayers} layers`,
      tokensProcessed: totalTokens,
      flopTeraflops: Math.round(baselineDenseFlopsTflops * 0.005 * 10) / 10,
      status: 'ROUTED_COMPUTE'
    },
    {
      stage: 'Top-K Active Token Self-Attention & MLP',
      description: `${Math.round(capacityFactor * 100)}% highest-entropy tokens execute full transformer computation`,
      tokensProcessed: activeTokensPerLayer * batchSize,
      flopTeraflops: effectiveFlopsTflops,
      status: 'ROUTED_COMPUTE'
    },
    {
      stage: 'Residual Stream Token Bypass (Zero Compute)',
      description: `${bypassedTokensPerLayer.toLocaleString()} predictable tokens skip layer via identity residual addition`,
      tokensProcessed: bypassedTokensPerLayer * batchSize,
      flopTeraflops: 0,
      status: 'RESIDUAL_BYPASS'
    },
    {
      stage: 'Static Top-K Hardware Tensor Padding',
      description: `Fixed tensor shapes maintained across layers to prevent CUDA stream synchronization stalls`,
      tokensProcessed: activeTokensPerLayer * batchSize,
      flopTeraflops: 0,
      status: 'STATIC_PADDED'
    }
  ];

  return {
    effectiveFlopsTflops,
    baselineDenseFlopsTflops,
    flopReductionPercent,
    speedupMultiplier,
    activeTokensPerLayer,
    bypassedTokensPerLayer,
    throughputTokensPerSec,
    annualClusterSavings,
    slaStatus,
    executionTrace
  };
}
