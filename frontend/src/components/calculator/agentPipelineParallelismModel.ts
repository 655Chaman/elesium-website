// Mathematical model for Tool #60:
// Enterprise Autonomous Agent Pipeline Parallelism & 1F1B Bubble Minimizer Simulator

export type ModelScale =
  | '70b'
  | '120b'
  | '236b_moe'
  | '405b';

export type PipelineScheduleMode =
  | '1f1b_standard'
  | '1f1b_interleaved'
  | 'zero_bubble_async'
  | 'naive_gpipe';

export type InterStageTransport =
  | 'nvlink_p2p'
  | 'gpudirect_rdma'
  | 'pcie_dma'
  | 'tcp_socket';

export interface PipelineParallelismInputs {
  modelScale: ModelScale;
  pipelineStages: number; // 2 to 16 stages
  microBatches: number; // 4 to 64 micro-batches
  scheduleMode: PipelineScheduleMode;
  interStageTransport: InterStageTransport;
  currency: 'INR' | 'USD';
}

export interface PipelineParallelismOutputs {
  bubbleFractionPercent: number;
  effectiveGpuUtilization: number;
  interStageLatencyMs: number;
  throughputMultiplier: number;
  tokensPerSecond: number;
  annualFinOpsSavings: string;
  slaStatus: 'SUB_10MS_ZERO_BUBBLE' | 'ACCEPTABLE_INTERLEAVED' | 'BUBBLE_BOTTLENECK';
}

export function calculatePipelineParallelism(
  inputs: PipelineParallelismInputs
): PipelineParallelismOutputs {
  const {
    modelScale,
    pipelineStages,
    microBatches,
    scheduleMode,
    interStageTransport,
    currency
  } = inputs;

  const p = Math.max(2, pipelineStages);
  const m = Math.max(4, microBatches);

  // Theoretical bubble fraction: F_bubble = (p - 1) / (v * m)
  let bubbleFraction = 0.0;
  if (scheduleMode === 'naive_gpipe') {
    bubbleFraction = (p - 1) / (m + p - 1);
  } else if (scheduleMode === '1f1b_standard') {
    bubbleFraction = (p - 1) / m;
  } else if (scheduleMode === '1f1b_interleaved') {
    const v = 2; // virtual stages per physical rank
    bubbleFraction = (p - 1) / (v * m);
  } else {
    // zero_bubble_async
    bubbleFraction = Math.max(0.015, (p - 1) / (4.0 * m));
  }

  // Inter-stage transport latency
  let transportLatencyMs = 3.2;
  if (interStageTransport === 'nvlink_p2p') {
    transportLatencyMs = 0.85;
  } else if (interStageTransport === 'pcie_dma') {
    transportLatencyMs = 5.8;
  } else if (interStageTransport === 'tcp_socket') {
    transportLatencyMs = 14.5;
    bubbleFraction += 0.08; // network jitter expands bubble
  }

  const bubbleFractionPercent = Math.min(65.0, Math.round(bubbleFraction * 1000) / 10);
  const effectiveGpuUtilization = Math.round((100.0 - bubbleFractionPercent) * 10) / 10;

  // Base throughput depending on model scale
  let baseTps = 24.0;
  if (modelScale === '120b') baseTps = 18.0;
  else if (modelScale === '236b_moe') baseTps = 28.0;
  else if (modelScale === '405b') baseTps = 9.5;

  const throughputMultiplier = Math.round(((effectiveGpuUtilization / 55.0) * (p * 0.78)) * 10) / 10;
  const tokensPerSecond = Math.round(baseTps * (effectiveGpuUtilization / 100.0) * p * 10) / 10;

  // FinOps savings: Idle GPUs in pipeline bubbles are recovered compute capital
  const gpuAnnualCostLakhs = 48.0; // H100 annualized TCO
  const recoveredGpus = p * (bubbleFractionPercent / 100.0);
  const annualSavingsLakhs = Math.max(14.0, Math.round(recoveredGpus * gpuAnnualCostLakhs * 10) / 10);

  let formattedSavings = `₹${annualSavingsLakhs.toLocaleString()} Lakhs / year`;
  if (currency === 'USD') {
    const usdSavings = Math.round((annualSavingsLakhs * 100000) / 84);
    formattedSavings = `$${usdSavings.toLocaleString()} / year`;
  }

  let slaStatus: 'SUB_10MS_ZERO_BUBBLE' | 'ACCEPTABLE_INTERLEAVED' | 'BUBBLE_BOTTLENECK' = 'SUB_10MS_ZERO_BUBBLE';
  if (transportLatencyMs > 10.0 || bubbleFractionPercent > 25.0) {
    slaStatus = 'BUBBLE_BOTTLENECK';
  } else if (bubbleFractionPercent > 12.0) {
    slaStatus = 'ACCEPTABLE_INTERLEAVED';
  }

  return {
    bubbleFractionPercent,
    effectiveGpuUtilization,
    interStageLatencyMs: transportLatencyMs,
    throughputMultiplier,
    tokensPerSecond,
    annualFinOpsSavings: formattedSavings,
    slaStatus
  };
}
