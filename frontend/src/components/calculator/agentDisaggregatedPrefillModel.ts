export type DisaggregatedModelArchitecture =
  | 'sovereign_100b_agent'
  | 'llama_3_1_70b'
  | 'deepseek_r1_671b_moe'
  | 'llama_3_405b'
  | 'qwen_2_5_72b';

export type ServingArchitecture =
  | 'disaggregated_rdma_roce'
  | 'disaggregated_infiniband_ndr'
  | 'monolithic_chunked_prefill'
  | 'monolithic_standard';

export type PrefillGpuType =
  | 'nvidia_h100_sxm'
  | 'nvidia_b200_blackwell'
  | 'nvidia_h200_sxm';

export type DecodeGpuType =
  | 'nvidia_h200_sxm'
  | 'nvidia_l40s'
  | 'nvidia_b200_blackwell';

export interface DisaggregatedPrefillInputs {
  modelArchitecture: DisaggregatedModelArchitecture;
  servingArchitecture: ServingArchitecture;
  prefillGpuType: PrefillGpuType;
  decodeGpuType: DecodeGpuType;
  promptTokens: number;
  concurrencyRequests: number;
  currency: 'INR' | 'USD';
}

export interface DisaggregatedPrefillResults {
  timeToFirstTokenMs: number;
  interTokenLatencyMs: number;
  kvTransferLatencyMs: number;
  decodeThroughputMultiplier: number;
  hardwareCostReductionPercent: number;
  totalKvCacheSizeMb: number;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  statusClassification:
    | 'SUB_4MS_DISAGGREGATED_OPTIMAL'
    | 'DECOUPLED_BALANCED'
    | 'MONOLITHIC_INTERFERENCE'
    | 'PREFILL_SATURATION_BOTTLENECK';
}

export function calculateDisaggregatedPrefill(
  inputs: DisaggregatedPrefillInputs
): DisaggregatedPrefillResults {
  const {
    modelArchitecture,
    servingArchitecture,
    prefillGpuType,
    decodeGpuType,
    promptTokens,
    concurrencyRequests,
    currency
  } = inputs;

  // Model parameters (active)
  const paramMap: Record<DisaggregatedModelArchitecture, { total: number; active: number; gqaHeads: number; hiddenDim: number; layers: number }> = {
    sovereign_100b_agent: { total: 100, active: 100, gqaHeads: 8, hiddenDim: 8192, layers: 80 },
    llama_3_1_70b: { total: 70, active: 70, gqaHeads: 8, hiddenDim: 8192, layers: 80 },
    deepseek_r1_671b_moe: { total: 671, active: 37, gqaHeads: 16, hiddenDim: 7168, layers: 61 },
    llama_3_405b: { total: 405, active: 405, gqaHeads: 16, hiddenDim: 16384, layers: 126 },
    qwen_2_5_72b: { total: 72, active: 72, gqaHeads: 8, hiddenDim: 8192, layers: 80 }
  };

  const model = paramMap[modelArchitecture];

  // Calculate KV Cache Size per request: 2 * layers * gqaHeads * (hiddenDim / numHeads) * tokens * 2 bytes (FP16/BF16)
  // Approximate MB per 1K tokens ~ 32MB for 70B GQA
  const kvCachePer1kTokensMb = (model.layers * 2 * model.gqaHeads * 128 * 2) / (1024 * 1024);
  const totalKvCacheSizeMb = Math.round((promptTokens / 1000) * kvCachePer1kTokensMb * 1000);

  // Hardware Bandwidths and Compute
  const prefillTflops = prefillGpuType === 'nvidia_b200_blackwell' ? 2250 : prefillGpuType === 'nvidia_h200_sxm' ? 1000 : 989;
  const decodeMemBw = decodeGpuType === 'nvidia_b200_blackwell' ? 8.0 : decodeGpuType === 'nvidia_h200_sxm' ? 4.8 : 0.864; // TB/s

  // KV Network Transfer Latency (MB to Gbps)
  let kvTransferLatencyMs = 0;
  if (servingArchitecture === 'disaggregated_infiniband_ndr') {
    // 800 Gbps network (100 GB/s)
    kvTransferLatencyMs = Number(((totalKvCacheSizeMb / 1024) / 100 * 1000).toFixed(1));
  } else if (servingArchitecture === 'disaggregated_rdma_roce') {
    // 400 Gbps network (50 GB/s)
    kvTransferLatencyMs = Number(((totalKvCacheSizeMb / 1024) / 50 * 1000).toFixed(1));
  } else {
    // Monolithic: KV cache is local in GPU memory, but compute contention stalls decode
    kvTransferLatencyMs = 0;
  }

  // TTFT Calculation
  let timeToFirstTokenMs = 3.8;
  let interTokenLatencyMs = 8.2;
  let decodeThroughputMultiplier = 3.8;
  let hardwareCostReductionPercent = 48.0;

  if (servingArchitecture === 'disaggregated_infiniband_ndr' || servingArchitecture === 'disaggregated_rdma_roce') {
    // Compute TTFT on dedicated pre-fill node + KV transfer
    const baseGemmMs = ((promptTokens * model.active * 2) / (prefillTflops * 1000)) * 1.15;
    timeToFirstTokenMs = Number(Math.max(2.8, baseGemmMs + (servingArchitecture === 'disaggregated_infiniband_ndr' ? 1.0 : 2.5)).toFixed(1));
    interTokenLatencyMs = Number(((model.active * 2) / (decodeMemBw * 1000) * 1.05 + 1.2).toFixed(1));
    decodeThroughputMultiplier = 3.85;
    hardwareCostReductionPercent = decodeGpuType === 'nvidia_l40s' ? 52.5 : 44.0;
  } else if (servingArchitecture === 'monolithic_chunked_prefill') {
    timeToFirstTokenMs = Number(((promptTokens * model.active * 2) / (prefillTflops * 1000) * 3.2 + 45).toFixed(1));
    interTokenLatencyMs = Number(((model.active * 2) / (decodeMemBw * 1000) * 2.4 + 4.5).toFixed(1));
    decodeThroughputMultiplier = 1.85;
    hardwareCostReductionPercent = 15.0;
  } else {
    // Monolithic standard: Severe head-of-line blocking
    timeToFirstTokenMs = Number(((promptTokens * model.active * 2) / (prefillTflops * 1000) * 6.5 + 240).toFixed(1));
    interTokenLatencyMs = Number(((model.active * 2) / (decodeMemBw * 1000) * 4.2 + 18.0).toFixed(1));
    decodeThroughputMultiplier = 1.0;
    hardwareCostReductionPercent = 0.0;
  }

  // Status Classification
  let statusClassification: DisaggregatedPrefillResults['statusClassification'] = 'SUB_4MS_DISAGGREGATED_OPTIMAL';
  if (timeToFirstTokenMs <= 4.5 && (servingArchitecture.startsWith('disaggregated'))) {
    statusClassification = 'SUB_4MS_DISAGGREGATED_OPTIMAL';
  } else if (servingArchitecture.startsWith('disaggregated')) {
    statusClassification = 'DECOUPLED_BALANCED';
  } else if (servingArchitecture === 'monolithic_chunked_prefill') {
    statusClassification = 'MONOLITHIC_INTERFERENCE';
  } else {
    statusClassification = 'PREFILL_SATURATION_BOTTLENECK';
  }

  // Annual FinOps Savings (Cluster of 8 pre-fill + 16 decode nodes operating 24/7)
  const monolithicAnnualCostUsd = concurrencyRequests * 4200;
  const disaggregatedAnnualCostUsd = monolithicAnnualCostUsd * (1 - hardwareCostReductionPercent / 100);
  const rawAnnualSavingsUsd = Math.max(75000, Math.round(monolithicAnnualCostUsd - disaggregatedAnnualCostUsd));

  let annualFinOpsSavings = '';
  if (currency === 'INR') {
    const inrCr = (rawAnnualSavingsUsd * 86.5) / 10000000;
    annualFinOpsSavings = `₹${inrCr.toFixed(2)} Cr / yr`;
  } else {
    annualFinOpsSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / yr`;
  }

  return {
    timeToFirstTokenMs,
    interTokenLatencyMs,
    kvTransferLatencyMs,
    decodeThroughputMultiplier,
    hardwareCostReductionPercent,
    totalKvCacheSizeMb,
    annualFinOpsSavings,
    rawAnnualSavingsUsd,
    statusClassification
  };
}
