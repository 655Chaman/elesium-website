// Mathematical model for Tool #59:
// Enterprise Autonomous Agent Prefill-Decode Disaggregation & Chunked Prompt Execution Simulator

export type ModelFamily =
  | 'llama_3_70b'
  | 'deepseek_v2_236b'
  | 'qwen_2_5_72b'
  | 'mixtral_8x22b';

export type PrefillGpuType =
  | 'nvidia_h100_sxm5'
  | 'nvidia_b200_nvl'
  | 'nvidia_a100_80gb';

export type DecodeGpuType =
  | 'nvidia_h200_141gb'
  | 'nvidia_l40s_48gb'
  | 'nvidia_a10g_24gb';

export type KvTransportProtocol =
  | 'roce_v2_rdma'
  | 'infiniband_direct'
  | 'pcie_p2p'
  | 'tcp_socket';

export interface PrefillDecodeInputs {
  modelFamily: ModelFamily;
  prefillWorkers: number; // 1 to 32 GPUs
  decodeWorkers: number; // 2 to 64 GPUs
  chunkSizeTokens: number; // 128 to 2048 tokens
  promptLength: number; // 512 to 16384 tokens
  concurrencyQps: number; // 10 to 500 QPS
  kvTransport: KvTransportProtocol;
  currency: 'INR' | 'USD';
}

export interface PrefillDecodeOutputs {
  ttftLatencyMs: number;
  interTokenLatencyMs: number;
  kvTransportLatencyMs: number;
  headOfLineBlockingStallPercent: number;
  prefillThroughputTokPerSec: number;
  decodeThroughputTokPerSec: number;
  unifiedBaselineTtftMs: number;
  latencyReductionFactor: number;
  annualFinOpsSavings: string;
  slaStatus: 'SUB_15MS_LEADER' | 'SUB_25MS_ACCEPTABLE' | 'HEAD_OF_LINE_BLOCKED';
}

export function calculatePrefillDecodePerformance(
  inputs: PrefillDecodeInputs
): PrefillDecodeOutputs {
  const {
    modelFamily,
    prefillWorkers,
    decodeWorkers,
    chunkSizeTokens,
    promptLength,
    concurrencyQps,
    kvTransport,
    currency
  } = inputs;

  // Model size multiplier
  let modelComplexity = 1.0;
  if (modelFamily === 'deepseek_v2_236b') modelComplexity = 1.35;
  else if (modelFamily === 'mixtral_8x22b') modelComplexity = 1.15;
  else if (modelFamily === 'qwen_2_5_72b') modelComplexity = 1.05;

  // Transport protocol latency & overhead
  let transportLatency = 1.15;
  let holStall = 0.05;
  if (kvTransport === 'infiniband_direct') {
    transportLatency = 0.78;
    holStall = 0.02;
  } else if (kvTransport === 'pcie_p2p') {
    transportLatency = 2.45;
    holStall = 0.35;
  } else if (kvTransport === 'tcp_socket') {
    transportLatency = 8.65;
    holStall = 2.40;
  }

  // Chunking mechanics: prompts broken into chunk_size pieces
  const numChunks = Math.max(1, Math.ceil(promptLength / chunkSizeTokens));
  const chunkComputeMs = (chunkSizeTokens / 256) * 1.8 * modelComplexity;
  const parallelPrefillMs = (chunkComputeMs * numChunks) / Math.max(1, prefillWorkers / 4.0);
  
  const ttftLatencyMs = Math.round((parallelPrefillMs + transportLatency) * 10) / 10;

  // Inter-Token Latency (ITL) on dedicated decode workers
  const decodeSaturation = concurrencyQps / Math.max(1, decodeWorkers * 12);
  const interTokenLatencyMs = Math.round((7.8 + decodeSaturation * 3.4 * modelComplexity) * 10) / 10;

  // Unified baseline (severe head-of-line blocking stalls)
  const unifiedQueuingDelay = (concurrencyQps * 1.4 * (promptLength / 1024)) / 2.0;
  const unifiedBaselineTtftMs = Math.round((parallelPrefillMs * 2.2 + unifiedQueuingDelay) * 10) / 10;
  const latencyReductionFactor = Math.round((unifiedBaselineTtftMs / Math.max(1.0, ttftLatencyMs)) * 10) / 10;

  // Throughput calculations
  const prefillThroughputTokPerSec = Math.round(prefillWorkers * 1920 * (1 / modelComplexity));
  const decodeThroughputTokPerSec = Math.round(decodeWorkers * 148 * (1 / modelComplexity));

  // FinOps savings: disaggregation eliminates the need to buy only expensive H100s for pure memory-bound decode
  const h100AnnualCostInrLakhs = 48.0;
  const l40sAnnualCostInrLakhs = 18.0;
  const unifiedClusterCostLakhs = (prefillWorkers + decodeWorkers) * h100AnnualCostInrLakhs;
  const disaggregatedClusterCostLakhs = (prefillWorkers * h100AnnualCostInrLakhs) + (decodeWorkers * l40sAnnualCostInrLakhs);
  const annualSavingsLakhs = Math.max(12.5, Math.round((unifiedClusterCostLakhs - disaggregatedClusterCostLakhs) * 10) / 10);

  let formattedSavings = `₹${annualSavingsLakhs.toLocaleString()} Lakhs / year`;
  if (currency === 'USD') {
    const usdSavings = Math.round((annualSavingsLakhs * 100000) / 84);
    formattedSavings = `$${usdSavings.toLocaleString()} / year`;
  }

  // SLA status determination
  let slaStatus: 'SUB_15MS_LEADER' | 'SUB_25MS_ACCEPTABLE' | 'HEAD_OF_LINE_BLOCKED' = 'SUB_15MS_LEADER';
  if (ttftLatencyMs > 25.0 || kvTransport === 'tcp_socket') {
    slaStatus = 'HEAD_OF_LINE_BLOCKED';
  } else if (ttftLatencyMs > 15.0) {
    slaStatus = 'SUB_25MS_ACCEPTABLE';
  }

  return {
    ttftLatencyMs,
    interTokenLatencyMs,
    kvTransportLatencyMs: transportLatency,
    headOfLineBlockingStallPercent: holStall,
    prefillThroughputTokPerSec,
    decodeThroughputTokPerSec,
    unifiedBaselineTtftMs,
    latencyReductionFactor,
    annualFinOpsSavings: formattedSavings,
    slaStatus
  };
}
