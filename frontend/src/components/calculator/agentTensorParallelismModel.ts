// Mathematical model for Tool #61:
// Enterprise Autonomous Agent Tensor Parallelism & All-Reduce Communication Overlap Simulator

export type ModelArchitecture =
  | 'llama_3_70b'
  | 'deepseek_v2_236b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type TpDegree = 2 | 4 | 8 | 16;

export type InterconnectType =
  | 'nvlink_4_900gb'
  | 'nvlink_3_600gb'
  | 'pcie_gen5_128gb'
  | 'pcie_gen4_64gb';

export type AllReduceMode =
  | 'async_overlap'
  | 'two_shot'
  | 'nccl_tree_blocking';

export interface TensorParallelismInputs {
  modelArchitecture: ModelArchitecture;
  tpDegree: TpDegree;
  interconnect: InterconnectType;
  allReduceMode: AllReduceMode;
  batchSize: number; // 1 to 128
  currency: 'INR' | 'USD';
}

export interface TensorParallelismOutputs {
  allReduceLatencyMs: number;
  commOverheadPercent: number;
  nvlinkBusSaturationPercent: number;
  tokensPerSecond: number;
  throughputSpeedup: number;
  annualFinOpsSavings: string;
  slaStatus: 'SUB_5MS_NVLINK_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK';
}

export function calculateTensorParallelism(
  inputs: TensorParallelismInputs
): TensorParallelismOutputs {
  const {
    modelArchitecture,
    tpDegree,
    interconnect,
    allReduceMode,
    batchSize,
    currency
  } = inputs;

  // Interconnect bandwidth ratings in GB/s
  let busBw = 900.0;
  if (interconnect === 'nvlink_3_600gb') busBw = 600.0;
  else if (interconnect === 'pcie_gen5_128gb') busBw = 128.0;
  else if (interconnect === 'pcie_gen4_64gb') busBw = 64.0;

  // Hidden dimensions & base compute
  let hiddenDim = 8192;
  let baseTps = 28.0;
  if (modelArchitecture === 'deepseek_v2_236b') {
    hiddenDim = 5120;
    baseTps = 32.0;
  } else if (modelArchitecture === 'mistral_large_123b') {
    hiddenDim = 12288;
    baseTps = 18.0;
  }

  // Ring all-reduce communication volume: 2 * (tp - 1) / tp * (b * d * 2 bytes fp16)
  const dataBytes = 2.0 * ((tpDegree - 1) / tpDegree) * (batchSize * hiddenDim * 2);
  const baseCommTimeMs = (dataBytes / (busBw * 1e6)) * 1000.0;

  // Overlap efficiency
  let commLatency = 1.15;
  let commOverhead = 4.2;
  if (allReduceMode === 'async_overlap') {
    commLatency = Math.max(1.15, baseCommTimeMs * 0.38);
    commOverhead = 4.2;
  } else if (allReduceMode === 'two_shot') {
    commLatency = Math.max(1.80, baseCommTimeMs * 0.65);
    commOverhead = 8.5;
  } else {
    // nccl_tree_blocking
    commLatency = Math.max(3.50, baseCommTimeMs * 1.05);
    commOverhead = 18.4;
  }

  // If using PCIe without NVLink, latency penalties scale
  if (interconnect.startsWith('pcie')) {
    commLatency *= 2.4;
    commOverhead *= 2.1;
  }

  const allReduceLatencyMs = Math.round(commLatency * 10) / 10;
  const commOverheadPercent = Math.min(65.0, Math.round(commOverhead * 10) / 10);
  const nvlinkBusSaturationPercent = Math.min(98.6, Math.round((baseCommTimeMs / Math.max(0.01, commLatency)) * 88.0 * 10) / 10);

  const speedup = Math.round(((tpDegree * 0.82) * (1.0 - commOverheadPercent / 100.0)) * 10) / 10;
  const tokensPerSecond = Math.round(baseTps * speedup * 10) / 10;

  // FinOps savings: Faster TP speeds up inference cluster density
  const gpuCostAnnualLakhs = 48.0;
  const annualSavingsLakhs = Math.max(15.0, Math.round((speedup - 1.0) * gpuCostAnnualLakhs * 0.45 * 10) / 10);

  let formattedSavings = `₹${annualSavingsLakhs.toLocaleString()} Lakhs / year`;
  if (currency === 'USD') {
    const usdSavings = Math.round((annualSavingsLakhs * 100000) / 84);
    formattedSavings = `$${usdSavings.toLocaleString()} / year`;
  }

  let slaStatus: 'SUB_5MS_NVLINK_OPTIMAL' | 'ACCEPTABLE_PARTIAL_OVERLAP' | 'COMMUNICATION_BOTTLENECK' = 'SUB_5MS_NVLINK_OPTIMAL';
  if (allReduceLatencyMs > 8.0 || commOverheadPercent > 20.0) {
    slaStatus = 'COMMUNICATION_BOTTLENECK';
  } else if (allReduceLatencyMs > 5.0 || commOverheadPercent > 10.0) {
    slaStatus = 'ACCEPTABLE_PARTIAL_OVERLAP';
  }

  return {
    allReduceLatencyMs,
    commOverheadPercent,
    nvlinkBusSaturationPercent,
    tokensPerSecond,
    throughputSpeedup: speedup,
    annualFinOpsSavings: formattedSavings,
    slaStatus
  };
}
