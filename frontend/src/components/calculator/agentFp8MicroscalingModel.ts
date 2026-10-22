export type Fp8ModelArchitecture =
  | 'sovereign_100b_agent'
  | 'llama_3_1_70b'
  | 'deepseek_r1_671b_moe'
  | 'llama_3_405b'
  | 'qwen_2_5_72b';

export type MicroscalingFormat =
  | 'fp8_e4m3'
  | 'fp8_e5m2'
  | 'mxfp8_ocp'
  | 'mxfp4_microscaling';

export type MicroscalingBlockSize = 16 | 32 | 64 | 128;

export type HardwareCluster =
  | 'nvidia_h100_sxm'
  | 'nvidia_h200_sxm'
  | 'nvidia_b200_blackwell'
  | 'grace_hopper_gh200';

export interface Fp8MicroscalingInputs {
  modelArchitecture: Fp8ModelArchitecture;
  microscalingFormat: MicroscalingFormat;
  blockSize: MicroscalingBlockSize;
  hardwareCluster: HardwareCluster;
  sequenceLengthTokens: number;
  batchSize: number;
  currency: 'INR' | 'USD';
}

export interface Fp8MicroscalingResults {
  gemmSpeedupMultiplier: number;
  vramMemoryFootprintGb: number;
  baselineVramGb: number;
  memoryReductionPercent: number;
  perplexityDeltaPercent: number;
  effectiveStepLatencyMs: number;
  tokensPerSecondThroughput: number;
  powerConsumptionWatts: number;
  powerReductionPercent: number;
  statusClassification:
    | 'SUB_1_PERCENT_OPTIMAL'
    | 'OCP_MICROSCALED_BALANCED'
    | 'OUTLIER_NOISE_ELEVATED'
    | 'PERPLEXITY_CATASTROPHE';
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
}

export function calculateFp8Microscaling(
  inputs: Fp8MicroscalingInputs
): Fp8MicroscalingResults {
  const {
    modelArchitecture,
    microscalingFormat,
    blockSize,
    hardwareCluster,
    sequenceLengthTokens,
    batchSize,
    currency
  } = inputs;

  // Base parameters in billions
  const paramCountMap: Record<Fp8ModelArchitecture, { total: number; active: number }> = {
    sovereign_100b_agent: { total: 100, active: 100 },
    llama_3_1_70b: { total: 70, active: 70 },
    deepseek_r1_671b_moe: { total: 671, active: 37 },
    llama_3_405b: { total: 405, active: 405 },
    qwen_2_5_72b: { total: 72, active: 72 }
  };

  const { total: totalParamsB, active: activeParamsB } = paramCountMap[modelArchitecture];

  // Baseline FP16/BF16 memory footprint in GB (2 bytes per param + KV Cache estimate)
  const fp16WeightMemoryGb = totalParamsB * 2.0;
  // KV Cache: 2 * num_layers * hidden_size * seq_len * batch_size * bytes_per_elem
  // Approximate KV Cache in GB for baseline 16-bit
  const kvCacheFactor = (sequenceLengthTokens / 1000) * (batchSize / 16) * (activeParamsB / 70) * 1.8;
  const baselineVramGb = Number((fp16WeightMemoryGb + kvCacheFactor).toFixed(1));

  // Precision bytes per parameter
  let bytesPerParam = 1.0; // Default FP8 (E4M3 / E5M2)
  let scaleOverheadBytesPerParam = 0;

  if (microscalingFormat === 'mxfp4_microscaling') {
    bytesPerParam = 0.5; // 4-bit weights
    scaleOverheadBytesPerParam = 1.0 / blockSize; // Shared 8-bit scale factor per block
  } else if (microscalingFormat === 'mxfp8_ocp') {
    bytesPerParam = 1.0;
    scaleOverheadBytesPerParam = 1.0 / blockSize; // Shared 8-bit scale factor per block
  } else {
    // Standard tensor or channel level FP8 has negligible scale overhead
    bytesPerParam = 1.0;
    scaleOverheadBytesPerParam = 0.001;
  }

  const effectiveBytesPerParam = bytesPerParam + scaleOverheadBytesPerParam;
  const quantizedWeightMemoryGb = totalParamsB * effectiveBytesPerParam;
  const quantizedKvCacheGb = (microscalingFormat === 'mxfp4_microscaling' || microscalingFormat === 'mxfp8_ocp')
    ? kvCacheFactor * 0.5
    : kvCacheFactor * 0.55;

  const vramMemoryFootprintGb = Number((quantizedWeightMemoryGb + quantizedKvCacheGb).toFixed(1));
  const memoryReductionPercent = Number(
    (((baselineVramGb - vramMemoryFootprintGb) / baselineVramGb) * 100).toFixed(1)
  );

  // Hardware factors
  const hwSpeedupBase: Record<HardwareCluster, { fp8Peak: number; mxfp4Peak: number; maxTdp: number; memBw: number }> = {
    nvidia_h100_sxm: { fp8Peak: 2.0, mxfp4Peak: 2.0, maxTdp: 700, memBw: 3.35 },
    nvidia_h200_sxm: { fp8Peak: 2.05, mxfp4Peak: 2.1, maxTdp: 700, memBw: 4.8 },
    nvidia_b200_blackwell: { fp8Peak: 2.35, mxfp4Peak: 4.0, maxTdp: 1000, memBw: 8.0 },
    grace_hopper_gh200: { fp8Peak: 2.0, mxfp4Peak: 2.0, maxTdp: 900, memBw: 4.9 }
  };

  const hw = hwSpeedupBase[hardwareCluster];

  // GEMM Speedup calculation
  let rawGemmSpeedup = 1.0;
  if (microscalingFormat === 'mxfp4_microscaling') {
    rawGemmSpeedup = hw.mxfp4Peak * 0.82; // 82% arithmetic intensity realization
  } else if (microscalingFormat === 'mxfp8_ocp') {
    rawGemmSpeedup = hw.fp8Peak * 0.91;
  } else {
    rawGemmSpeedup = hw.fp8Peak * 0.78; // Naive FP8 suffers from dequantization or outlier clamping stalls
  }
  const gemmSpeedupMultiplier = Number(rawGemmSpeedup.toFixed(2));

  // Perplexity Delta calculation
  let basePplDelta = 0.08; // 0.08%
  if (microscalingFormat === 'fp8_e4m3') {
    basePplDelta = 3.25; // High outlier degradation
  } else if (microscalingFormat === 'fp8_e5m2') {
    basePplDelta = 2.15; // Higher noise floor
  } else if (microscalingFormat === 'mxfp8_ocp') {
    // Dynamic exponent shifting with block size
    if (blockSize === 16) basePplDelta = 0.04;
    else if (blockSize === 32) basePplDelta = 0.07;
    else if (blockSize === 64) basePplDelta = 0.18;
    else basePplDelta = 0.35;
  } else if (microscalingFormat === 'mxfp4_microscaling') {
    if (blockSize === 16) basePplDelta = 0.42;
    else if (blockSize === 32) basePplDelta = 0.68;
    else if (blockSize === 64) basePplDelta = 1.15;
    else basePplDelta = 1.85;
  }
  const perplexityDeltaPercent = Number(basePplDelta.toFixed(2));

  // Step Latency
  const baselineLatencyMs = (activeParamsB * 0.18 * (sequenceLengthTokens / 4096) + 12) / (hw.memBw / 3.35);
  const effectiveStepLatencyMs = Number(
    Math.max(2.4, baselineLatencyMs / gemmSpeedupMultiplier).toFixed(2)
  );

  // Token throughput
  const tokensPerSecondThroughput = Math.round((batchSize * 1000) / effectiveStepLatencyMs);

  // Power Consumption
  const baselineWatts = hw.maxTdp * 0.92;
  const powerReductionPercent = microscalingFormat === 'mxfp4_microscaling' ? 44.5 : 36.8;
  const powerConsumptionWatts = Math.round(baselineWatts * (1 - powerReductionPercent / 100));

  // Status Classification
  let statusClassification: Fp8MicroscalingResults['statusClassification'] = 'SUB_1_PERCENT_OPTIMAL';
  if (perplexityDeltaPercent < 0.10) {
    statusClassification = 'SUB_1_PERCENT_OPTIMAL';
  } else if (perplexityDeltaPercent < 1.0) {
    statusClassification = 'OCP_MICROSCALED_BALANCED';
  } else if (perplexityDeltaPercent <= 2.5) {
    statusClassification = 'OUTLIER_NOISE_ELEVATED';
  } else {
    statusClassification = 'PERPLEXITY_CATASTROPHE';
  }

  // FinOps Annual Savings
  // Based on 8-GPU cluster operating 24/7/365
  const gpusCount = Math.max(1, Math.ceil(vramMemoryFootprintGb / (hardwareCluster === 'nvidia_b200_blackwell' ? 192 : hardwareCluster === 'nvidia_h200_sxm' ? 141 : 80)));
  const baselineGpusCount = Math.max(1, Math.ceil(baselineVramGb / (hardwareCluster === 'nvidia_b200_blackwell' ? 192 : hardwareCluster === 'nvidia_h200_sxm' ? 141 : 80)));
  const gpuPerHourCostUsd = hardwareCluster === 'nvidia_b200_blackwell' ? 5.5 : 3.8;
  const annualHours = 8760;

  const baselineAnnualUsd = baselineGpusCount * gpuPerHourCostUsd * annualHours;
  const quantizedAnnualUsd = gpusCount * gpuPerHourCostUsd * annualHours * (1 / gemmSpeedupMultiplier);
  const rawAnnualSavingsUsd = Math.max(45000, Math.round(baselineAnnualUsd - quantizedAnnualUsd));

  let annualFinOpsSavings = '';
  if (currency === 'INR') {
    const inrCr = (rawAnnualSavingsUsd * 86.5) / 10000000;
    annualFinOpsSavings = `₹${inrCr.toFixed(2)} Cr / yr`;
  } else {
    annualFinOpsSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / yr`;
  }

  return {
    gemmSpeedupMultiplier,
    vramMemoryFootprintGb,
    baselineVramGb,
    memoryReductionPercent,
    perplexityDeltaPercent,
    effectiveStepLatencyMs,
    tokensPerSecondThroughput,
    powerConsumptionWatts,
    powerReductionPercent,
    statusClassification,
    annualFinOpsSavings,
    rawAnnualSavingsUsd
  };
}
