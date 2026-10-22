export type AsyncCheckpointModelArchitecture =
  | 'sovereign_100b_agent'
  | 'llama_3_1_70b'
  | 'deepseek_r1_671b_moe'
  | 'llama_3_405b'
  | 'qwen_2_5_72b';

export type CheckpointStrategy =
  | 'non_blocking_cuda_pinned_host'
  | 'in_flight_rdma_roce'
  | 'nvme_gpudirect_storage'
  | 'synchronous_blocking_nfs';

export interface AsyncCheckpointingInputs {
  modelArchitecture: AsyncCheckpointModelArchitecture;
  checkpointStrategy: CheckpointStrategy;
  clusterNodesCount: number; // 1 to 64 nodes (8 GPUs per node)
  interconnectBandwidthGbps: 100 | 200 | 400 | 800;
  checkpointIntervalMinutes: number; // 5 to 120 mins
  failureRatePerWeekPercent: number; // 1% to 25%
  currency: 'INR' | 'USD';
}

export interface AsyncCheckpointingResults {
  checkpointPauseMs: number;
  clusterIdleBubblePercent: number;
  stateMigrationFailoverMs: number;
  clusterMfuPercent: number;
  totalGpus: number;
  totalStateSnapshotGb: number;
  annualFinOpsSavings: string;
  rawAnnualSavingsUsd: number;
  dataLossExposureRisk: 'ZERO_DATA_LOSS_ATOMIC' | 'SUB_MINUTE_DELTA' | 'SIGNIFICANT_PROGRESS_LOSS';
  statusClassification:
    | 'ZERO_BUBBLE_FAULT_TOLERANT'
    | 'HIGH_AVAILABILITY_STABLE'
    | 'CHECKPOINT_PAUSE_BOTTLENECK'
    | 'CATASTROPHIC_FAILURE_EXPOSURE';
}

export function calculateAsyncCheckpointing(
  inputs: AsyncCheckpointingInputs
): AsyncCheckpointingResults {
  const {
    modelArchitecture,
    checkpointStrategy,
    clusterNodesCount,
    interconnectBandwidthGbps,
    checkpointIntervalMinutes,
    failureRatePerWeekPercent,
    currency
  } = inputs;

  const totalGpus = clusterNodesCount * 8;

  // Parameters in billions
  const paramMap: Record<AsyncCheckpointModelArchitecture, number> = {
    sovereign_100b_agent: 100,
    llama_3_1_70b: 70,
    deepseek_r1_671b_moe: 671,
    llama_3_405b: 405,
    qwen_2_5_72b: 72
  };

  const paramsB = paramMap[modelArchitecture];
  // Model weights (2 bytes) + optimizer states (AdamW: 16 bytes) = 18 bytes / param
  const totalStateSnapshotGb = Math.round(paramsB * 18);

  // Checkpoint Pause Time
  let checkpointPauseMs = 45;
  let stateMigrationFailoverMs = 120;
  let dataLossExposureRisk: AsyncCheckpointingResults['dataLossExposureRisk'] = 'ZERO_DATA_LOSS_ATOMIC';

  if (checkpointStrategy === 'non_blocking_cuda_pinned_host') {
    checkpointPauseMs = 42; // Fast sub-50ms snapshot to pinned RAM
    stateMigrationFailoverMs = Math.round(180 / (interconnectBandwidthGbps / 400));
    dataLossExposureRisk = 'ZERO_DATA_LOSS_ATOMIC';
  } else if (checkpointStrategy === 'in_flight_rdma_roce') {
    checkpointPauseMs = 28; // Direct memory-to-memory RDMA replication
    stateMigrationFailoverMs = Math.round(110 / (interconnectBandwidthGbps / 400));
    dataLossExposureRisk = 'ZERO_DATA_LOSS_ATOMIC';
  } else if (checkpointStrategy === 'nvme_gpudirect_storage') {
    checkpointPauseMs = 380; // GPUDirect NVMe storage write
    stateMigrationFailoverMs = 850;
    dataLossExposureRisk = 'SUB_MINUTE_DELTA';
  } else {
    // Synchronous blocking NFS/Lustre pause
    // Transferring hundreds of GB over shared storage blocks all GPUs
    const transferSec = (totalStateSnapshotGb / (totalGpus * 0.45));
    checkpointPauseMs = Math.round(transferSec * 1000);
    stateMigrationFailoverMs = 180000; // 3 minutes manual/scripted cold restart
    dataLossExposureRisk = 'SIGNIFICANT_PROGRESS_LOSS';
  }

  // Calculate cluster idle bubble percentage
  // Fraction of time spent paused during checkpoint intervals
  const intervalMs = checkpointIntervalMinutes * 60 * 1000;
  let clusterIdleBubblePercent = Number(((checkpointPauseMs / intervalMs) * 100).toFixed(2));
  if (checkpointStrategy === 'synchronous_blocking_nfs') {
    clusterIdleBubblePercent = Math.min(38.5, Math.max(8.5, clusterIdleBubblePercent));
  } else {
    clusterIdleBubblePercent = Math.min(0.25, clusterIdleBubblePercent);
  }

  // Model FLOPs Utilization (MFU)
  const baseMfu = 64.5;
  const clusterMfuPercent = Number(Math.max(38.0, baseMfu - clusterIdleBubblePercent * 1.2).toFixed(1));

  // Status Classification
  let statusClassification: AsyncCheckpointingResults['statusClassification'] = 'ZERO_BUBBLE_FAULT_TOLERANT';
  if (checkpointStrategy === 'synchronous_blocking_nfs') {
    statusClassification = clusterIdleBubblePercent > 20 ? 'CATASTROPHIC_FAILURE_EXPOSURE' : 'CHECKPOINT_PAUSE_BOTTLENECK';
  } else if (checkpointStrategy === 'nvme_gpudirect_storage') {
    statusClassification = 'HIGH_AVAILABILITY_STABLE';
  } else {
    statusClassification = 'ZERO_BUBBLE_FAULT_TOLERANT';
  }

  // FinOps Savings
  // Based on total GPUs operating at $3.80/hr over 8760 hours/yr
  const hourlyGpuCostUsd = totalGpus * 3.80;
  // Cost of wasted bubble hours + hardware fault recovery downtime
  const failureIncidentsPerYear = (failureRatePerWeekPercent / 100) * 52;
  const downtimeHoursSynchronous = (failureIncidentsPerYear * (stateMigrationFailoverMs / 3600000));
  const downtimeHoursAsync = (failureIncidentsPerYear * (stateMigrationFailoverMs / 3600000));

  const wastedBubbleHoursSync = (clusterIdleBubblePercent / 100) * 8760;
  const wastedBubbleHoursAsync = 0.002 * 8760;

  const rawAnnualSavingsUsd = Math.max(
    65000,
    Math.round((wastedBubbleHoursSync - wastedBubbleHoursAsync + (downtimeHoursSynchronous - downtimeHoursAsync)) * hourlyGpuCostUsd)
  );

  let annualFinOpsSavings = '';
  if (currency === 'INR') {
    const inrCr = (rawAnnualSavingsUsd * 86.5) / 10000000;
    annualFinOpsSavings = `₹${inrCr.toFixed(2)} Cr / yr`;
  } else {
    annualFinOpsSavings = `$${(rawAnnualSavingsUsd / 1000).toFixed(0)}k / yr`;
  }

  return {
    checkpointPauseMs,
    clusterIdleBubblePercent,
    stateMigrationFailoverMs,
    clusterMfuPercent,
    totalGpus,
    totalStateSnapshotGb,
    annualFinOpsSavings,
    rawAnnualSavingsUsd,
    dataLossExposureRisk,
    statusClassification
  };
}
