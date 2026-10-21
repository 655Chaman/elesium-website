// Mathematical model for Tool #50:
// Enterprise Autonomous Agent FP8 vs INT4 Post-Training Quantization (PTQ) Perplexity & Latency Degradation Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_r1_671b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type QuantizationMethod =
  | 'awq_w4a16'
  | 'gptq_w4a16'
  | 'smoothquant_w8a8'
  | 'fp8_e4m3_hopper'
  | 'bitsandbytes_nf4';

export type KvCachePrecision =
  | 'fp16'
  | 'fp8_e4m3'
  | 'int4_k_cache';

export type TargetGpuHardware =
  | 'nvidia_h100_sxm5'
  | 'nvidia_a100_80gb'
  | 'nvidia_rtx_4090'
  | 'nvidia_b200_nvl';

export interface PtqQuantizationInputs {
  modelArchitecture: ModelArchitecture;
  quantizationMethod: QuantizationMethod;
  kvCachePrecision: KvCachePrecision;
  contextLengthTokens: number; // 2048 to 65536
  concurrentRequests: number; // 1 to 64
  targetGpuHardware: TargetGpuHardware;
  currency: 'INR' | 'USD';
}

export interface LayerQuantizationBreakdown {
  layerName: string;
  bitwidth: string;
  salientChannelsProtected: number;
  perChannelMseError: number;
  quantizedVramMb: number;
  status: 'OPTIMAL' | 'COMPRESSED' | 'HIGH_SENSITIVITY';
}

export interface PtqQuantizationOutputs {
  unquantizedVramGb: number;
  quantizedVramGb: number;
  vramSavingsPercent: number;
  baselinePerplexity: number;
  quantizedPerplexity: number;
  perplexityDegradationPercent: number;
  perTokenLatencyMs: number;
  throughputTokensPerSec: number;
  annualGpuCostSavings: string;
  requiredGpuNodes: number;
  baselineGpuNodes: number;
  slaStatus: 'PERPLEXITY_PRESERVED_PRODUCTION_READY' | 'BORDERLINE_NEEDS_CALIBRATION' | 'UNACCEPTABLE_DRIFT_DEGRADATION';
  layerTrace: LayerQuantizationBreakdown[];
}

export function calculatePtqQuantization(inputs: PtqQuantizationInputs): PtqQuantizationOutputs {
  const {
    modelArchitecture,
    quantizationMethod,
    kvCachePrecision,
    contextLengthTokens,
    concurrentRequests,
    targetGpuHardware,
    currency
  } = inputs;

  // 1. Model Baseline Parameter Count (Billion Parameters) & Base Perplexity on WikiText-2
  let paramBillions = 70.0;
  let baselinePerplexity = 3.12;
  let numLayers = 80;

  switch (modelArchitecture) {
    case 'llama_3_70b':
      paramBillions = 70.6;
      baselinePerplexity = 3.12;
      numLayers = 80;
      break;
    case 'deepseek_r1_671b':
      // 671B MoE with 37B active parameters per token
      paramBillions = 671.0;
      baselinePerplexity = 2.45;
      numLayers = 61;
      break;
    case 'qwen_2_5_72b':
      paramBillions = 72.5;
      baselinePerplexity = 2.98;
      numLayers = 80;
      break;
    case 'mistral_large_123b':
      paramBillions = 123.0;
      baselinePerplexity = 2.84;
      numLayers = 88;
      break;
  }

  // 2. Unquantized FP16 Weight Footprint
  const unquantizedWeightsGb = paramBillions * 2.0; // 2 bytes per param in FP16

  // 3. Unquantized KV Cache Footprint (FP16)
  // Per token KV cache size: 2 * num_layers * hidden_size * 2 bytes
  // For 70B: ~262 KB per token
  const kvBytesPerTokenFp16 = (numLayers * 8192 * 4) / 1024; // in KB
  const totalContextTokens = contextLengthTokens * concurrentRequests;
  const unquantizedKvGb = (totalContextTokens * kvBytesPerTokenFp16) / (1024 * 1024);
  const unquantizedVramGb = Math.round((unquantizedWeightsGb + unquantizedKvGb) * 10) / 10;

  // 4. Quantized Weight Multiplier & Perplexity Delta
  let weightBytesPerParam = 2.0;
  let perplexityDelta = 0.03;
  let kernelSpeedup = 1.0;

  switch (quantizationMethod) {
    case 'awq_w4a16':
      weightBytesPerParam = 0.55; // 4-bit plus scales & salient channel fp16 bias
      perplexityDelta = 0.04;
      kernelSpeedup = 1.95;
      break;
    case 'gptq_w4a16':
      weightBytesPerParam = 0.52;
      perplexityDelta = 0.08;
      kernelSpeedup = 1.80;
      break;
    case 'smoothquant_w8a8':
      weightBytesPerParam = 1.05; // 8-bit weights + per-tensor scales
      perplexityDelta = 0.02;
      kernelSpeedup = 2.10;
      break;
    case 'fp8_e4m3_hopper':
      weightBytesPerParam = 1.02;
      perplexityDelta = 0.015;
      kernelSpeedup = 2.35;
      break;
    case 'bitsandbytes_nf4':
      weightBytesPerParam = 0.58;
      perplexityDelta = 0.12;
      kernelSpeedup = 1.25;
      break;
  }

  // 5. Quantized KV Cache Multiplier
  let kvMultiplier = 1.0;
  switch (kvCachePrecision) {
    case 'fp16':
      kvMultiplier = 1.0;
      break;
    case 'fp8_e4m3':
      kvMultiplier = 0.50;
      perplexityDelta += 0.01;
      break;
    case 'int4_k_cache':
      kvMultiplier = 0.28;
      perplexityDelta += 0.03;
      break;
  }

  const quantizedWeightsGb = paramBillions * weightBytesPerParam;
  const quantizedKvGb = unquantizedKvGb * kvMultiplier;
  const quantizedVramGb = Math.round((quantizedWeightsGb + quantizedKvGb) * 10) / 10;
  const vramSavingsPercent = Math.round((1 - quantizedVramGb / unquantizedVramGb) * 100);

  // 6. Final Perplexity Calculations
  const quantizedPerplexity = Math.round((baselinePerplexity + perplexityDelta) * 100) / 100;
  const perplexityDegradationPercent = Math.round(((quantizedPerplexity - baselinePerplexity) / baselinePerplexity) * 10000) / 100;

  // 7. Hardware Node Capacity & Latency
  let gpuNodeVramGb = 80.0;
  let baseHardwareLatencyMs = 34.0;
  let costPerNodePerYear = 1400000; // INR ~ $16.5k

  switch (targetGpuHardware) {
    case 'nvidia_h100_sxm5':
      gpuNodeVramGb = 80.0;
      baseHardwareLatencyMs = 28.0;
      costPerNodePerYear = 2200000;
      break;
    case 'nvidia_a100_80gb':
      gpuNodeVramGb = 80.0;
      baseHardwareLatencyMs = 38.0;
      costPerNodePerYear = 1400000;
      break;
    case 'nvidia_rtx_4090':
      gpuNodeVramGb = 24.0;
      baseHardwareLatencyMs = 45.0;
      costPerNodePerYear = 450000;
      break;
    case 'nvidia_b200_nvl':
      gpuNodeVramGb = 192.0;
      baseHardwareLatencyMs = 18.0;
      costPerNodePerYear = 3800000;
      break;
  }

  const baselineGpuNodes = Math.max(1, Math.ceil(unquantizedVramGb / gpuNodeVramGb));
  const requiredGpuNodes = Math.max(1, Math.ceil(quantizedVramGb / gpuNodeVramGb));

  // Latency & Throughput
  const perTokenLatencyMs = Math.round((baseHardwareLatencyMs / kernelSpeedup) * 10) / 10;
  const throughputTokensPerSec = Math.round((1000.0 / perTokenLatencyMs) * concurrentRequests * 10) / 10;

  // Annual Cloud/Hardware FinOps Savings
  const nodeSavings = Math.max(0, baselineGpuNodes - requiredGpuNodes);
  let annualSavingsRaw = nodeSavings * costPerNodePerYear;
  if (annualSavingsRaw === 0) {
    annualSavingsRaw = Math.round(costPerNodePerYear * (vramSavingsPercent / 100) * 0.45);
  }

  const annualGpuCostSavings =
    currency === 'INR'
      ? `₹${(annualSavingsRaw / 100000).toFixed(1)} Lakhs/yr`
      : `$${Math.round(annualSavingsRaw / 85).toLocaleString()}/yr`;

  // SLA Classification
  let slaStatus: 'PERPLEXITY_PRESERVED_PRODUCTION_READY' | 'BORDERLINE_NEEDS_CALIBRATION' | 'UNACCEPTABLE_DRIFT_DEGRADATION' =
    'PERPLEXITY_PRESERVED_PRODUCTION_READY';

  if (perplexityDegradationPercent > 2.5) {
    slaStatus = 'UNACCEPTABLE_DRIFT_DEGRADATION';
  } else if (perplexityDegradationPercent > 1.2) {
    slaStatus = 'BORDERLINE_NEEDS_CALIBRATION';
  }

  // Layer-wise Trace Simulation (Sample of 4 representative layer groups)
  const layerTrace: LayerQuantizationBreakdown[] = [
    {
      layerName: 'self_attn.q_proj & k_proj',
      bitwidth: quantizationMethod.includes('4') ? 'INT4 Group-128' : 'FP8 E4M3',
      salientChannelsProtected: 32,
      perChannelMseError: 0.0012,
      quantizedVramMb: Math.round((quantizedWeightsGb * 1024) * 0.28),
      status: 'OPTIMAL'
    },
    {
      layerName: 'self_attn.v_proj & o_proj',
      bitwidth: quantizationMethod.includes('4') ? 'INT4 Group-128' : 'FP8 E4M3',
      salientChannelsProtected: 48,
      perChannelMseError: 0.0018,
      quantizedVramMb: Math.round((quantizedWeightsGb * 1024) * 0.26),
      status: 'OPTIMAL'
    },
    {
      layerName: 'mlp.gate_proj & up_proj',
      bitwidth: quantizationMethod.includes('4') ? 'INT4 Group-128' : 'FP8 E4M3',
      salientChannelsProtected: 64,
      perChannelMseError: 0.0024,
      quantizedVramMb: Math.round((quantizedWeightsGb * 1024) * 0.30),
      status: 'COMPRESSED'
    },
    {
      layerName: 'mlp.down_proj (High Sensitivity)',
      bitwidth: quantizationMethod === 'awq_w4a16' ? 'INT4 Salient-Protected' : 'FP8 E4M3',
      salientChannelsProtected: 128,
      perChannelMseError: 0.0031,
      quantizedVramMb: Math.round((quantizedWeightsGb * 1024) * 0.16),
      status: 'HIGH_SENSITIVITY'
    }
  ];

  return {
    unquantizedVramGb,
    quantizedVramGb,
    vramSavingsPercent,
    baselinePerplexity,
    quantizedPerplexity,
    perplexityDegradationPercent,
    perTokenLatencyMs,
    throughputTokensPerSec,
    annualGpuCostSavings,
    requiredGpuNodes,
    baselineGpuNodes,
    slaStatus,
    layerTrace
  };
}
