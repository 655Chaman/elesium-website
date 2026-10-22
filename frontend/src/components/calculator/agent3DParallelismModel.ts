export type ThreeDModelArchitecture =
  | 'sovereign_100b_agent'
  | 'llama_3_1_70b'
  | 'deepseek_r1_671b_moe'
  | 'llama_3_405b'
  | 'qwen_2_5_72b';

export type TpDegree = 1 | 2 | 4 | 8;
export type PpDegree = 1 | 2 | 4 | 8 | 16;
export type DpDegree = 1 | 2 | 4 | 8 | 16 | 32;

export type ZeroStage = 'zero_off' | 'zero_1' | 'zero_2' | 'zero_3';

export type PipelineSchedule =
  | 'zero_bubble'
  | 'interleaved_1f1b'
  | 'standard_1f1b'
  | 'gpipe';

export type InterconnectType =
  | 'nvlink_ndr_infiniband'
  | 'nvlink_roce_v2'
  | 'dual_rail_infiniband'
  | 'pcie_gen5';

export interface ThreeDParallelismInputs {
  modelArchitecture: ThreeDModelArchitecture;
  tpDegree: TpDegree;
  ppDegree: PpDegree;
  dpDegree: DpDegree;
  zeroStage: ZeroStage;
  pipelineSchedule: PipelineSchedule;
  interconnect: InterconnectType;
  sequenceLengthTokens: number;
  batchSize: number;
  currency: 'INR' | 'USD';
}

export interface ThreeDParallelismResults {
  totalGpus: number;
  modelWeightsPerGpuGb: number;
  kvCachePerGpuGb: number;
  optimizerMemoryPerGpuGb: number;
  peakMemoryPerGpuGb: number;
  pipelineBubbleFractionPercent: number;
  communicationOverlapEfficiencyPercent: number;
  effectiveStepLatencyMs: number;
  modelFlopsUtilizationPercent: number;
  slaStatus: 'SUB_8MS_3D_OPTIMAL' | 'EFFICIENT_SCALED_MESH' | 'PIPELINE_BUBBLE_BOTTLENECK' | 'OOM_ALLOCATION_FAULT';
  oomRiskPrevented: boolean;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  tokensPerSecondThroughput: number;
}

export function calculateThreeDParallelism(
  inputs: ThreeDParallelismInputs
): ThreeDParallelismResults {
  const {
    modelArchitecture,
    tpDegree,
    ppDegree,
    dpDegree,
    zeroStage,
    pipelineSchedule,
    interconnect,
    sequenceLengthTokens,
    batchSize,
    currency
  } = inputs;

  const totalGpus = tpDegree * ppDegree * dpDegree;

  // Base parameters in billions
  const paramCountMap: Record<ThreeDModelArchitecture, number> = {
    sovereign_100b_agent: 100,
    llama_3_1_70b: 70,
    deepseek_r1_671b_moe: 671,
    llama_3_405b: 405,
    qwen_2_5_72b: 72
  };

  const totalParamsB = paramCountMap[modelArchitecture];

  // Weight Memory in FP16 (2 bytes per param)
  const baseWeightMemoryGb = totalParamsB * 2;

  // With TP, PP, and ZeRO-3
  let modelWeightsPerGpuGb = baseWeightMemoryGb / (tpDegree * ppDegree);
  if (zeroStage === 'zero_3') {
    modelWeightsPerGpuGb = modelWeightsPerGpuGb / dpDegree;
  }

  // Optimizer Memory (AdamW: 16 bytes per param)
  let baseOptimizerGb = totalParamsB * 16;
  let optimizerMemoryPerGpuGb = 0;
  if (zeroStage === 'zero_off') {
    optimizerMemoryPerGpuGb = baseOptimizerGb / (tpDegree * ppDegree);
  } else if (zeroStage === 'zero_1' || zeroStage === 'zero_2') {
    optimizerMemoryPerGpuGb = baseOptimizerGb / (tpDegree * ppDegree * dpDegree);
  } else {
    // ZeRO-3 sharded
    optimizerMemoryPerGpuGb = baseOptimizerGb / (tpDegree * ppDegree * dpDegree);
  }

  // KV Cache per GPU (proportional to sequence length, batch size, divided by TP)
  const baseKvGb = (sequenceLengthTokens / 1024) * (batchSize * 0.08) * (totalParamsB / 70);
  const kvCachePerGpuGb = Math.max(0.5, baseKvGb / tpDegree);

  // Activations & Scratchpad
  const activationGb = Math.max(1.0, (batchSize * sequenceLengthTokens * 0.0001) / tpDegree);

  const peakMemoryPerGpuGb = Number(
    (modelWeightsPerGpuGb + optimizerMemoryPerGpuGb + kvCachePerGpuGb + activationGb).toFixed(2)
  );

  // Pipeline Bubble Fraction
  let bubbleFraction = 0;
  if (ppDegree > 1) {
    const numMicroBatches = Math.max(ppDegree * 2, batchSize * 2);
    if (pipelineSchedule === 'zero_bubble') {
      bubbleFraction = ((ppDegree - 1) / (numMicroBatches * 4)) * 100;
    } else if (pipelineSchedule === 'interleaved_1f1b') {
      bubbleFraction = ((ppDegree - 1) / (numMicroBatches * 2)) * 100;
    } else if (pipelineSchedule === 'standard_1f1b') {
      bubbleFraction = ((ppDegree - 1) / (numMicroBatches + ppDegree - 1)) * 100;
    } else {
      // gpipe
      bubbleFraction = ((ppDegree - 1) / numMicroBatches) * 100;
    }
  }

  const pipelineBubbleFractionPercent = Number(Math.min(45, Math.max(1.2, bubbleFraction)).toFixed(1));

  // Interconnect bandwidth efficiency factor
  const interconnectEfficiency: Record<InterconnectType, number> = {
    nvlink_ndr_infiniband: 0.96,
    dual_rail_infiniband: 0.92,
    nvlink_roce_v2: 0.88,
    pcie_gen5: 0.72
  };

  const commOverlapEfficiencyPercent = Number(
    (interconnectEfficiency[interconnect] * (pipelineSchedule === 'zero_bubble' ? 98 : 92)).toFixed(1)
  );

  // Model FLOPs Utilization (MFU)
  const baseMfu = 68.0;
  const bubbleLoss = pipelineBubbleFractionPercent * 0.45;
  const commLoss = (100 - commOverlapEfficiencyPercent) * 0.25;
  const modelFlopsUtilizationPercent = Number(Math.max(28.0, baseMfu - bubbleLoss - commLoss).toFixed(1));

  // Step Latency calculation
  const rawComputeMs = (totalParamsB * 0.12) / Math.max(1, totalGpus / 8);
  const commOverheadMs = (100 - commOverlapEfficiencyPercent) * 0.18;
  const bubbleOverheadMs = pipelineBubbleFractionPercent * 0.22;
  const effectiveStepLatencyMs = Number((rawComputeMs + commOverheadMs + bubbleOverheadMs).toFixed(2));

  // Tokens per second throughput
  const tokensPerSecondThroughput = Math.round(
    ((batchSize * 1000) / Math.max(1, effectiveStepLatencyMs)) * (modelFlopsUtilizationPercent / 50)
  );

  // OOM check against 80GB SXM5 H100 GPU
  const gpuCapacityGb = 80;
  const oomRiskPrevented = peakMemoryPerGpuGb <= gpuCapacityGb;

  let slaStatus: ThreeDParallelismResults['slaStatus'] = 'SUB_8MS_3D_OPTIMAL';
  if (!oomRiskPrevented) {
    slaStatus = 'OOM_ALLOCATION_FAULT';
  } else if (pipelineBubbleFractionPercent > 18) {
    slaStatus = 'PIPELINE_BUBBLE_BOTTLENECK';
  } else if (effectiveStepLatencyMs <= 8.5 && commOverlapEfficiencyPercent >= 92) {
    slaStatus = 'SUB_8MS_3D_OPTIMAL';
  } else {
    slaStatus = 'EFFICIENT_SCALED_MESH';
  }

  // Financial ROI Savings (cluster utilization gain vs unoptimized naive clusters)
  const hourlyGpuCostUsd = 3.25;
  const hoursPerYear = 8760;
  const unoptimizedEfficiency = 0.32;
  const optimizedEfficiency = modelFlopsUtilizationPercent / 100;
  const efficiencyGain = Math.max(0.08, optimizedEfficiency - unoptimizedEfficiency);

  const rawAnnualSavingsUsd = Math.round(
    totalGpus * hourlyGpuCostUsd * hoursPerYear * efficiencyGain
  );

  const usdToInr = 86.5;
  let annualFinOpsSavings = '';
  if (currency === 'INR') {
    const lakhs = (rawAnnualSavingsUsd * usdToInr) / 100000;
    annualFinOpsSavings = `₹${lakhs.toFixed(1)} Lakhs / year`;
  } else {
    annualFinOpsSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / year`;
  }

  return {
    totalGpus,
    modelWeightsPerGpuGb: Number(modelWeightsPerGpuGb.toFixed(2)),
    kvCachePerGpuGb: Number(kvCachePerGpuGb.toFixed(2)),
    optimizerMemoryPerGpuGb: Number(optimizerMemoryPerGpuGb.toFixed(2)),
    peakMemoryPerGpuGb,
    pipelineBubbleFractionPercent,
    communicationOverlapEfficiencyPercent: commOverlapEfficiencyPercent,
    effectiveStepLatencyMs,
    modelFlopsUtilizationPercent,
    slaStatus,
    oomRiskPrevented,
    annualFinOpsSavings,
    rawAnnualSavingsUsd,
    tokensPerSecondThroughput
  };
}
