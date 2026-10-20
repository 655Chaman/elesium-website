/**
 * gpuCostCalculatorModel.ts
 * ============================================================================
 * Mathematical & Hardware Engineering Model for Enterprise LLM FinOps.
 * 
 * Compares:
 * 1. Self-Hosted Sovereign GPU Clusters (NVIDIA H100 SXM5, H200, A100, L40S, On-Prem CapEx)
 *    running vLLM / TensorRT-LLM with PagedAttention and FP8/AWQ quantization.
 * 2. Multi-Tenant Hyperscaler Closed APIs (Claude 3.5 Sonnet, GPT-4o, Claude Haiku, Llama-3.3-70B Cloud).
 * 
 * Hardware Physics & Roofline Model:
 * - Autoregressive decode phase memory bandwidth roofline: Tokens/sec = HBM_Bandwidth / Model_VRAM_Footprint
 * - Grouped Query Attention (GQA) KV cache footprint per token
 * - Tensor Parallelism partitioning (TP=1, 2, 4, 8) across NVLink mesh
 * - 3-Year Total Cost of Ownership (CapEx amortization, colocation power/cooling PUE 1.25, vs Cloud OpEx)
 * ============================================================================
 */

export type GpuHardwareKey = 'h100_sxm5' | 'h200_sxm5' | 'a100_sxm4' | 'l40s_pcie' | 'on_prem_h100_cluster';
export type ModelTierKey = 'llama_8b' | 'mistral_nemo_12b' | 'qwen_32b' | 'llama_70b' | 'llama_405b';
export type QuantizationPrecision = 'fp16' | 'fp8' | 'awq_int4';
export type HyperscalerApiKey = 'claude_35_sonnet' | 'gpt_4o' | 'claude_35_haiku' | 'llama_70b_cloud';
export type Currency = 'USD' | 'INR';

export interface GpuHardwareSpec {
  id: GpuHardwareKey;
  name: string;
  architecture: string;
  vramGbPerGpu: number;
  memoryBandwidthTbps: number;
  fp8Tflops: number;
  hourlyRentalRateUSD: number; // Cloud instance per GPU rate
  onPremServerCapExUSD?: number; // 8x GPU node purchase price
  monthlyPowerColoUSD?: number; // 10kW colocation + PUE 1.25 power cost
  interconnect: string;
  recommendedFor: string;
}

export interface ModelParameterSpec {
  id: ModelTierKey;
  name: string;
  parameterCountBillions: number;
  layers: number;
  kvHeads: number;
  headDim: number;
  defaultContextWindow: number;
  description: string;
}

export interface HyperscalerPricingSpec {
  id: HyperscalerApiKey;
  name: string;
  provider: string;
  inputPerMillionUSD: number;
  outputPerMillionUSD: number;
  blendedPerMillionUSD: number; // 3:1 input:output ratio
  p95LatencyMs: number;
  dataPrivacyEgressRisk: 'Zero Sovereign Protection' | 'Enterprise Terms with Retention' | 'Statutory DPDP Liability';
}

export const GPU_HARDWARE_SPECS: Record<GpuHardwareKey, GpuHardwareSpec> = {
  h100_sxm5: {
    id: 'h100_sxm5',
    name: 'NVIDIA H100 80GB SXM5',
    architecture: 'Hopper (4nm TSMC)',
    vramGbPerGpu: 80,
    memoryBandwidthTbps: 3.35,
    fp8Tflops: 1979,
    hourlyRentalRateUSD: 3.10,
    interconnect: '900 GB/s NVLink 4',
    recommendedFor: 'Enterprise 70B production workloads with high concurrency and sub-30ms first-token latency.'
  },
  h200_sxm5: {
    id: 'h200_sxm5',
    name: 'NVIDIA H200 141GB SXM5',
    architecture: 'Hopper HBM3e (TSMC)',
    vramGbPerGpu: 141,
    memoryBandwidthTbps: 4.80,
    fp8Tflops: 1979,
    hourlyRentalRateUSD: 4.25,
    interconnect: '900 GB/s NVLink 4',
    recommendedFor: 'Ultra-long context (128k+) RAG and multi-document reasoning requiring massive KV cache.'
  },
  a100_sxm4: {
    id: 'a100_sxm4',
    name: 'NVIDIA A100 80GB SXM4',
    architecture: 'Ampere (7nm TSMC)',
    vramGbPerGpu: 80,
    memoryBandwidthTbps: 2.039,
    fp8Tflops: 624,
    hourlyRentalRateUSD: 1.85,
    interconnect: '600 GB/s NVLink 3',
    recommendedFor: 'Cost-effective 8B to 70B AWQ inference with established driver stability.'
  },
  l40s_pcie: {
    id: 'l40s_pcie',
    name: 'NVIDIA L40S 48GB PCIe',
    architecture: 'Ada Lovelace (4nm TSMC)',
    vramGbPerGpu: 48,
    memoryBandwidthTbps: 0.864,
    fp8Tflops: 1466,
    hourlyRentalRateUSD: 1.15,
    interconnect: 'PCIe Gen 4 (64 GB/s)',
    recommendedFor: 'High compute density, embedding generation, and fast speculative draft models.'
  },
  on_prem_h100_cluster: {
    id: 'on_prem_h100_cluster',
    name: 'On-Premise 8x H100 Server (CapEx Purchase)',
    architecture: 'Dedicated Sovereign Datacenter Node',
    vramGbPerGpu: 80,
    memoryBandwidthTbps: 3.35,
    fp8Tflops: 1979,
    hourlyRentalRateUSD: 0, // Amortized below
    onPremServerCapExUSD: 315000, // 8x H100 server hardware
    monthlyPowerColoUSD: 1950, // 10.2 kW draw @ $0.12/kWh + colocation rack fee
    interconnect: '900 GB/s NVLink 4',
    recommendedFor: 'Tier-1 Banks and Defense agencies with statutory air-gap data sovereignty requirements.'
  }
};

export const MODEL_PARAMETER_SPECS: Record<ModelTierKey, ModelParameterSpec> = {
  llama_8b: {
    id: 'llama_8b',
    name: 'Llama-3.1 8B Instruct',
    parameterCountBillions: 8.0,
    layers: 32,
    kvHeads: 8,
    headDim: 128,
    defaultContextWindow: 8192,
    description: 'High-speed edge routing, structured PII extraction, and classification.'
  },
  mistral_nemo_12b: {
    id: 'mistral_nemo_12b',
    name: 'Mistral NeMo 12B',
    parameterCountBillions: 12.2,
    layers: 40,
    kvHeads: 8,
    headDim: 128,
    defaultContextWindow: 16384,
    description: 'Precise multi-lingual translation and enterprise function calling.'
  },
  qwen_32b: {
    id: 'qwen_32b',
    name: 'Qwen 2.5 32B Coder / Instruct',
    parameterCountBillions: 32.5,
    layers: 64,
    kvHeads: 8,
    headDim: 128,
    defaultContextWindow: 32768,
    description: 'Complex SQL schema translation, code generation, and financial reconciliation.'
  },
  llama_70b: {
    id: 'llama_70b',
    name: 'Llama-3.3 70B Instruct',
    parameterCountBillions: 70.6,
    layers: 80,
    kvHeads: 8,
    headDim: 128,
    defaultContextWindow: 32768,
    description: 'Enterprise flagship: deep multi-hop reasoning, contract analysis, and medical summaries.'
  },
  llama_405b: {
    id: 'llama_405b',
    name: 'Llama-3.1 405B Instruct',
    parameterCountBillions: 405.0,
    layers: 126,
    kvHeads: 8,
    headDim: 128,
    defaultContextWindow: 16384,
    description: 'Frontier foundation reasoning, complex statutory legal drafting, and synthetic data generation.'
  }
};

export const HYPERSCALER_PRICING_SPECS: Record<HyperscalerApiKey, HyperscalerPricingSpec> = {
  claude_35_sonnet: {
    id: 'claude_35_sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'Anthropic / AWS Bedrock',
    inputPerMillionUSD: 3.00,
    outputPerMillionUSD: 15.00,
    blendedPerMillionUSD: 6.00, // 3:1 input to output ratio
    p95LatencyMs: 1450,
    dataPrivacyEgressRisk: 'Enterprise Terms with Retention'
  },
  gpt_4o: {
    id: 'gpt_4o',
    name: 'OpenAI GPT-4o',
    provider: 'OpenAI / Microsoft Azure',
    inputPerMillionUSD: 2.50,
    outputPerMillionUSD: 10.00,
    blendedPerMillionUSD: 4.375,
    p95LatencyMs: 1280,
    dataPrivacyEgressRisk: 'Enterprise Terms with Retention'
  },
  claude_35_haiku: {
    id: 'claude_35_haiku',
    name: 'Anthropic Claude 3.5 Haiku',
    provider: 'Anthropic Cloud',
    inputPerMillionUSD: 0.80,
    outputPerMillionUSD: 4.00,
    blendedPerMillionUSD: 1.60,
    p95LatencyMs: 620,
    dataPrivacyEgressRisk: 'Zero Sovereign Protection'
  },
  llama_70b_cloud: {
    id: 'llama_70b_cloud',
    name: 'Llama-3.3 70B (Managed Serverless Cloud)',
    provider: 'Together AI / Fireworks / Groq',
    inputPerMillionUSD: 0.88,
    outputPerMillionUSD: 0.88,
    blendedPerMillionUSD: 0.88,
    p95LatencyMs: 780,
    dataPrivacyEgressRisk: 'Statutory DPDP Liability'
  }
};

export interface GpuFinOpsInputs {
  monthlyTokenVolumeMillions: number; // e.g. 50M to 2,000M tokens/month
  averageContextLengthTokens: number; // e.g. 2,048 to 32,768 tokens
  peakConcurrentRequests: number; // e.g. 10 to 500 concurrent users
  modelTier: ModelTierKey;
  quantization: QuantizationPrecision;
  hardware: GpuHardwareKey;
  hyperscalerComparison: HyperscalerApiKey;
  currency: Currency;
  amortizationMonths: number; // 24 or 36 months for CapEx
}

export interface GpuFinOpsResults {
  // Sizing & VRAM Architecture
  weightsVramGb: number;
  kvCachePerRequestMb: number;
  totalKvCacheVramGb: number;
  totalVramRequiredGb: number;
  recommendedGpuCount: number;
  tensorParallelismDegree: number;
  memoryHeadroomPct: number;

  // Throughput & Roofline Model
  theoreticalMaxTokensPerSec: number;
  sustainedConcurrentThroughputTokensPerSec: number;
  p95FirstTokenLatencyMs: number;
  perTokenDecodeLatencyMs: number;

  // Monthly FinOps Economics
  monthlySelfHostedCostUSD: number;
  monthlySelfHostedCostINR: number;
  monthlyHyperscalerCostUSD: number;
  monthlyHyperscalerCostINR: number;
  netMonthlySavingsUSD: number;
  netMonthlySavingsINR: number;
  threeYearSavingsUSD: number;
  threeYearSavingsINR: number;
  savingsPercentage: number;
  breakevenMonthlyTokenThresholdMillions: number;
  paybackPeriodMonths: number;

  // Enterprise Governance
  dataSovereigntyScore: number; // 0 to 100
  dpdpAct2023Readiness: 'Statutory Compliant (Air-Gapped)' | 'Conditional Sovereign' | 'Non-Compliant (Data Egress)';
}

const USD_TO_INR_RATE = 84.50;

/**
 * Calculates complete GPU cluster sizing, throughput, and FinOps economics.
 */
export function calculateGpuFinOps(inputs: GpuFinOpsInputs): GpuFinOpsResults {
  const model = MODEL_PARAMETER_SPECS[inputs.modelTier];
  const hw = GPU_HARDWARE_SPECS[inputs.hardware];
  const api = HYPERSCALER_PRICING_SPECS[inputs.hyperscalerComparison];

  // 1. Bytes per parameter based on quantization
  let bytesPerParam = 2.0; // FP16 default
  if (inputs.quantization === 'fp8') bytesPerParam = 1.0;
  if (inputs.quantization === 'awq_int4') bytesPerParam = 0.55;

  // 2. Weights VRAM (with 15% CUDA context + PyTorch runtime buffer)
  const weightsVramGb = Math.round((model.parameterCountBillions * bytesPerParam * 1.15) * 10) / 10;

  // 3. KV Cache per token (GQA architecture: 2 * layers * kv_heads * head_dim * bytes_per_param)
  // bytes per token:
  const kvBytesPerToken = 2 * model.layers * model.kvHeads * model.headDim * (inputs.quantization === 'awq_int4' ? 1.0 : bytesPerParam);
  const kvCachePerRequestMb = Math.round((kvBytesPerToken * inputs.averageContextLengthTokens) / (1024 * 1024) * 10) / 10;

  // Total KV cache for peak concurrent requests (with PagedAttention 96% memory efficiency)
  const totalKvCacheVramGb = Math.round((kvCachePerRequestMb * inputs.peakConcurrentRequests / 1024 / 0.96) * 10) / 10;
  const totalVramRequiredGb = Math.round((weightsVramGb + totalKvCacheVramGb) * 10) / 10;

  // 4. Determine GPU count (Tensor Parallelism: TP=1, 2, 4, or 8)
  const rawGpusNeeded = totalVramRequiredGb / hw.vramGbPerGpu;
  let recommendedGpuCount = 1;
  if (rawGpusNeeded > 1 && rawGpusNeeded <= 2) recommendedGpuCount = 2;
  else if (rawGpusNeeded > 2 && rawGpusNeeded <= 4) recommendedGpuCount = 4;
  else if (rawGpusNeeded > 4 && rawGpusNeeded <= 8) recommendedGpuCount = 8;
  else if (rawGpusNeeded > 8) recommendedGpuCount = Math.ceil(rawGpusNeeded / 8) * 8;

  const tensorParallelismDegree = Math.min(recommendedGpuCount, 8);
  const clusterTotalVramGb = recommendedGpuCount * hw.vramGbPerGpu;
  const memoryHeadroomPct = Math.max(0, Math.round(((clusterTotalVramGb - totalVramRequiredGb) / clusterTotalVramGb) * 100));

  // 5. Roofline Model Throughput Calculations
  // Total memory bandwidth available across GPUs in Tensor Parallelism
  const aggregateHbmTbps = hw.memoryBandwidthTbps * recommendedGpuCount;
  // Decode phase bandwidth roofline: Tokens/sec = Aggregate Bandwidth (GB/s) / Model Size in VRAM (GB)
  const theoreticalMaxTokensPerSec = Math.round((aggregateHbmTbps * 1000) / Math.max(weightsVramGb, 1));
  // Continuous batching throughput sustained (scaled by concurrency up to PagedAttention saturation)
  const concurrencyFactor = Math.min(inputs.peakConcurrentRequests, 128);
  const sustainedConcurrentThroughputTokensPerSec = Math.round(Math.min(theoreticalMaxTokensPerSec * 0.85, concurrencyFactor * (theoreticalMaxTokensPerSec / 12)));

  // Latency metrics
  let p95FirstTokenLatencyMs = 28;
  if (hw.id === 'a100_sxm4') p95FirstTokenLatencyMs = 45;
  if (hw.id === 'l40s_pcie') p95FirstTokenLatencyMs = 52;
  if (model.id === 'llama_405b') p95FirstTokenLatencyMs = 120;
  const perTokenDecodeLatencyMs = Math.round((1000 / Math.max(sustainedConcurrentThroughputTokensPerSec / concurrencyFactor, 1)) * 10) / 10;

  // 6. Monthly FinOps Economics
  // Hyperscaler cost: Volume in Millions * Blended per Million
  const monthlyHyperscalerCostUSD = Math.round(inputs.monthlyTokenVolumeMillions * api.blendedPerMillionUSD);

  // Self-hosted cost:
  let monthlySelfHostedCostUSD = 0;
  if (hw.id === 'on_prem_h100_cluster') {
    const amortizedHardwarePerMonth = (hw.onPremServerCapExUSD || 315000) / (inputs.amortizationMonths || 36);
    const powerAndColo = hw.monthlyPowerColoUSD || 1950;
    const devOpsOrchestratorSupport = 2500; // Elesium enterprise support & updates
    monthlySelfHostedCostUSD = Math.round(amortizedHardwarePerMonth + powerAndColo + devOpsOrchestratorSupport);
  } else {
    // Cloud rental per hour * 730 hours in a month + cluster storage
    const hourlyClusterRate = hw.hourlyRentalRateUSD * recommendedGpuCount;
    const monthlyCompute = hourlyClusterRate * 730;
    const sovereignStorageVpcEgress = 450;
    monthlySelfHostedCostUSD = Math.round(monthlyCompute + sovereignStorageVpcEgress);
  }

  const netMonthlySavingsUSD = monthlyHyperscalerCostUSD - monthlySelfHostedCostUSD;
  const threeYearSavingsUSD = netMonthlySavingsUSD * 36;
  const savingsPercentage = Math.round((netMonthlySavingsUSD / Math.max(monthlyHyperscalerCostUSD, 1)) * 100);

  // Breakeven monthly token volume: Where Hyperscaler Cost == Self-Hosted Cost
  // Volume * api.blendedPerMillionUSD = monthlySelfHostedCostUSD
  const breakevenMonthlyTokenThresholdMillions = Math.round((monthlySelfHostedCostUSD / Math.max(api.blendedPerMillionUSD, 0.01)) * 10) / 10;
  
  // Payback period for on-premise hardware if chosen
  let paybackPeriodMonths = 1;
  if (hw.id === 'on_prem_h100_cluster' && (hw.onPremServerCapExUSD || 0) > 0) {
    const monthlyOperatingMargin = Math.max(monthlyHyperscalerCostUSD - (hw.monthlyPowerColoUSD || 1950), 1);
    paybackPeriodMonths = Math.round(((hw.onPremServerCapExUSD || 315000) / monthlyOperatingMargin) * 10) / 10;
  } else {
    paybackPeriodMonths = netMonthlySavingsUSD > 0 ? 1 : 99;
  }

  // Currency conversions
  const monthlySelfHostedCostINR = Math.round(monthlySelfHostedCostUSD * USD_TO_INR_RATE);
  const monthlyHyperscalerCostINR = Math.round(monthlyHyperscalerCostUSD * USD_TO_INR_RATE);
  const netMonthlySavingsINR = Math.round(netMonthlySavingsUSD * USD_TO_INR_RATE);
  const threeYearSavingsINR = Math.round(threeYearSavingsUSD * USD_TO_INR_RATE);

  // Data Sovereignty & DPDP Readiness
  const dataSovereigntyScore = hw.id === 'on_prem_h100_cluster' ? 100 : (hw.id === 'h100_sxm5' ? 95 : 88);
  const dpdpAct2023Readiness = hw.id === 'on_prem_h100_cluster' || hw.id === 'h100_sxm5' 
    ? 'Statutory Compliant (Air-Gapped)' 
    : 'Conditional Sovereign';

  return {
    weightsVramGb,
    kvCachePerRequestMb,
    totalKvCacheVramGb,
    totalVramRequiredGb,
    recommendedGpuCount,
    tensorParallelismDegree,
    memoryHeadroomPct,
    theoreticalMaxTokensPerSec,
    sustainedConcurrentThroughputTokensPerSec,
    p95FirstTokenLatencyMs,
    perTokenDecodeLatencyMs,
    monthlySelfHostedCostUSD,
    monthlySelfHostedCostINR,
    monthlyHyperscalerCostUSD,
    monthlyHyperscalerCostINR,
    netMonthlySavingsUSD,
    netMonthlySavingsINR,
    threeYearSavingsUSD,
    threeYearSavingsINR,
    savingsPercentage,
    breakevenMonthlyTokenThresholdMillions,
    paybackPeriodMonths,
    dataSovereigntyScore,
    dpdpAct2023Readiness
  };
}

export function formatFinOpsCurrency(amountUSD: number, currency: Currency): string {
  if (currency === 'INR') {
    const amountINR = Math.round(amountUSD * USD_TO_INR_RATE);
    if (amountINR >= 10000000) {
      return `₹${(amountINR / 10000000).toFixed(2)} Cr`;
    }
    if (amountINR >= 100000) {
      return `₹${(amountINR / 100000).toFixed(2)} Lakh`;
    }
    return `₹${amountINR.toLocaleString('en-IN')}`;
  }
  if (amountUSD >= 1000000) {
    return `$${(amountUSD / 1000000).toFixed(2)}M`;
  }
  if (amountUSD >= 1000) {
    return `$${(amountUSD / 1000).toFixed(1)}k`;
  }
  return `$${amountUSD.toLocaleString('en-US')}`;
}
