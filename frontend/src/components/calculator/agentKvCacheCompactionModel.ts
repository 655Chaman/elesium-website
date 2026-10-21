// Mathematical model for Tool #57:
// Enterprise Autonomous Agent KV Cache Paged Memory Defragmentation & Compaction Simulator

export type FoundationModel =
  | 'llama_3_70b'
  | 'deepseek_v2_236b'
  | 'qwen_2_5_72b'
  | 'mistral_large_123b';

export type GpuClusterType =
  | 'nvidia_h100_sxm5_80gb'
  | 'nvidia_b200_nvl_192gb'
  | 'nvidia_a100_80gb'
  | 'nvidia_l40s_48gb';

export interface KvCacheCompactionInputs {
  foundationModel: FoundationModel;
  gpuClusterType: GpuClusterType;
  numGpus: number; // 1 to 64 GPUs
  activeConcurrencyStreams: number; // 16 to 1024 streams
  compactionThresholdPercent: number; // 10% to 50%
  pageSizeTokens: number; // 16, 32, 64
  currency: 'INR' | 'USD';
}

export interface MemoryBlockVisual {
  id: number;
  type: 'ACTIVE_KV' | 'RECOVERED_PAGE' | 'FRAGMENTED_HOLE';
  sizeMb: number;
}

export interface KvCacheCompactionOutputs {
  rawFragmentationPercent: number;
  compactedFragmentationPercent: number;
  concurrencyMultiplier: number;
  maxConcurrentStreams: number;
  oomCrashProbabilityPercent: number;
  recoveredHbmGigabytes: number;
  totalClusterHbmGb: number;
  annualFinOpsSavings: string;
  slaStatus: 'DEFRAGMENTED_LEADER' | 'COMPACTED_ACCEPTABLE' | 'FRAGMENTED_RISK';
  memoryBlocks: MemoryBlockVisual[];
}

export function calculateKvCacheCompaction(inputs: KvCacheCompactionInputs): KvCacheCompactionOutputs {
  const {
    gpuClusterType,
    numGpus,
    activeConcurrencyStreams,
    compactionThresholdPercent,
    currency
  } = inputs;

  // 1. GPU VRAM per device
  let vramPerGpuGb = 80;
  let hourlyGpuRateUsd = 3.8;

  if (gpuClusterType === 'nvidia_b200_nvl_192gb') {
    vramPerGpuGb = 192;
    hourlyGpuRateUsd = 7.2;
  } else if (gpuClusterType === 'nvidia_a100_80gb') {
    vramPerGpuGb = 80;
    hourlyGpuRateUsd = 2.9;
  } else if (gpuClusterType === 'nvidia_l40s_48gb') {
    vramPerGpuGb = 48;
    hourlyGpuRateUsd = 2.1;
  }

  const totalClusterHbmGb = vramPerGpuGb * numGpus;

  // 2. Uncompacted Fragmentation Analysis
  // Non-contiguous memory holes accumulate as streams terminate asynchronously
  const baselineFragmentation = Math.min(
    48.5,
    Math.round((18.0 + (activeConcurrencyStreams * 0.08) + (compactionThresholdPercent * 0.35)) * 10) / 10
  );

  // 3. Compacted Performance (cuMemMap zero-copy virtual compaction)
  const compactedFragmentation = Math.round(baselineFragmentation * 0.05 * 10) / 10;
  const fragmentationDelta = baselineFragmentation - compactedFragmentation;

  // Concurrency expansion multiplier
  const concurrencyMultiplier = Math.round((1.0 + (fragmentationDelta / 14.5)) * 10) / 10;
  const maxConcurrentStreams = Math.round(activeConcurrencyStreams * concurrencyMultiplier);

  // Recovered HBM Gigabytes
  const recoveredHbmGigabytes = Math.round((totalClusterHbmGb * (fragmentationDelta / 100)) * 10) / 10;

  // OOM Probability (Uncompacted clusters face exponential OOM risk under burst loads)
  const oomCrashProbabilityPercent = compactedFragmentation < 3.0 ? 0.02 : 1.45;

  // 4. Annual FinOps Cluster Savings
  const hoursPerYear = 8760;
  const annualClusterSpendUsd = hourlyGpuRateUsd * numGpus * hoursPerYear;
  // Cost savings from packing 2x-3.4x more load per node without acquiring more GPU nodes
  const savingsPercent = Math.min(0.65, (concurrencyMultiplier - 1.0) * 0.32);
  const annualSavingsUsd = Math.round(annualClusterSpendUsd * savingsPercent);
  const annualSavingsInrLakhs = Math.round((annualSavingsUsd * 86.5) / 100000);

  const annualFinOpsSavings =
    currency === 'INR'
      ? `₹${annualSavingsInrLakhs} Lakhs`
      : `$${(annualSavingsUsd / 1000).toFixed(0)}k USD`;

  // SLA Classification
  let slaStatus: 'DEFRAGMENTED_LEADER' | 'COMPACTED_ACCEPTABLE' | 'FRAGMENTED_RISK' = 'DEFRAGMENTED_LEADER';
  if (concurrencyMultiplier < 1.5) {
    slaStatus = 'FRAGMENTED_RISK';
  } else if (concurrencyMultiplier < 2.5) {
    slaStatus = 'COMPACTED_ACCEPTABLE';
  }

  // 5. Memory Map Visual Generation (16 blocks representation)
  const memoryBlocks: MemoryBlockVisual[] = [];
  const activeCount = Math.round(16 * (1.0 - (baselineFragmentation / 100)));
  const recoveredCount = Math.round(16 * (fragmentationDelta / 100));

  for (let i = 0; i < 16; i++) {
    if (i < activeCount) {
      memoryBlocks.push({ id: i, type: 'ACTIVE_KV', sizeMb: 2 });
    } else if (i < activeCount + recoveredCount) {
      memoryBlocks.push({ id: i, type: 'RECOVERED_PAGE', sizeMb: 2 });
    } else {
      memoryBlocks.push({ id: i, type: 'FRAGMENTED_HOLE', sizeMb: 2 });
    }
  }

  return {
    rawFragmentationPercent: baselineFragmentation,
    compactedFragmentationPercent: compactedFragmentation,
    concurrencyMultiplier,
    maxConcurrentStreams,
    oomCrashProbabilityPercent,
    recoveredHbmGigabytes,
    totalClusterHbmGb,
    annualFinOpsSavings,
    slaStatus,
    memoryBlocks
  };
}
