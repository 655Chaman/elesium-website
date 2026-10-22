export type HierarchicalModelArchitecture =
  | 'deepseek_r1_671b_moe'
  | 'llama_3_1_70b'
  | 'qwen_2_5_72b'
  | 'sovereign_100b_agent'
  | 'llama_3_405b';

export type StorageHierarchyMode =
  | 'three_tiered_hbm_cxl_nvme'
  | 'two_tiered_hbm_cxl'
  | 'two_tiered_hbm_nvme'
  | 'pure_hbm_un_tiered';

export type PrefetchEngineType =
  | 'async_cuda_dma_stream'
  | 'gpudirect_storage_gds'
  | 'sync_pcie_transfer';

export interface HierarchicalStoragePagingInputs {
  modelArchitecture: HierarchicalModelArchitecture;
  storageHierarchyMode: StorageHierarchyMode;
  totalContextTokens: number;
  hbmAllocationGb: number;
  cxlAllocationGb: number;
  nvmeArrayThroughputGbps: number;
  prefetchEngine: PrefetchEngineType;
  currency: 'INR' | 'USD';
}

export interface HierarchicalStoragePagingResults {
  totalKvFootprintGb: number;
  hbmResidentPercent: number;
  cxlResidentPercent: number;
  nvmeResidentPercent: number;
  averagePageFaultLatencyMs: number;
  effectiveInterTokenLatencyMs: number;
  sustainableConcurrentStreams: number;
  hardwareProcurementSavingsUsd: number;
  formattedHardwareSavings: string;
  statusClassification:
    | 'SUB_10MS_ZERO_STALL_TIER'
    | 'BALANCED_CXL_BURST_HIERARCHY'
    | 'SYNC_IO_STALL_DEGRADATION'
    | 'OOM_HBM_EXHAUSTION';
}

export function calculateHierarchicalStoragePaging(
  inputs: HierarchicalStoragePagingInputs
): HierarchicalStoragePagingResults {
  const {
    modelArchitecture,
    storageHierarchyMode,
    totalContextTokens,
    hbmAllocationGb,
    cxlAllocationGb,
    nvmeArrayThroughputGbps,
    prefetchEngine,
    currency
  } = inputs;

  // Bytes per token calculation
  let bytesPerToken = 327680; // 70B standard GQA (0.32 MB/tok)
  if (modelArchitecture === 'llama_3_405b') {
    bytesPerToken = 819200;
  } else if (modelArchitecture === 'deepseek_r1_671b_moe') {
    bytesPerToken = 163840; // MLA compressed representation
  } else if (modelArchitecture === 'sovereign_100b_agent') {
    bytesPerToken = 409600;
  } else if (modelArchitecture === 'qwen_2_5_72b') {
    bytesPerToken = 327680;
  }

  const totalKvFootprintGb = Number(
    ((totalContextTokens * bytesPerToken) / (1024 * 1024 * 1024)).toFixed(2)
  );

  let hbmResidentPercent = 0;
  let cxlResidentPercent = 0;
  let nvmeResidentPercent = 0;
  let averagePageFaultLatencyMs = 6.4;
  let effectiveInterTokenLatencyMs = 7.8;
  let sustainableConcurrentStreams = 32;
  let statusClassification: HierarchicalStoragePagingResults['statusClassification'] =
    'SUB_10MS_ZERO_STALL_TIER';

  if (storageHierarchyMode === 'pure_hbm_un_tiered') {
    if (totalKvFootprintGb > hbmAllocationGb) {
      hbmResidentPercent = 100;
      cxlResidentPercent = 0;
      nvmeResidentPercent = 0;
      averagePageFaultLatencyMs = 0;
      effectiveInterTokenLatencyMs = 999.0;
      sustainableConcurrentStreams = 1;
      statusClassification = 'OOM_HBM_EXHAUSTION';
    } else {
      hbmResidentPercent = 100;
      cxlResidentPercent = 0;
      nvmeResidentPercent = 0;
      averagePageFaultLatencyMs = 0;
      effectiveInterTokenLatencyMs = 6.2;
      sustainableConcurrentStreams = Math.max(1, Math.floor(hbmAllocationGb / totalKvFootprintGb));
      statusClassification = 'SUB_10MS_ZERO_STALL_TIER';
    }
  } else if (storageHierarchyMode === 'two_tiered_hbm_cxl') {
    const hbmGb = Math.min(totalKvFootprintGb, hbmAllocationGb);
    const remAfterHbm = Math.max(0, totalKvFootprintGb - hbmGb);
    const cxlGb = Math.min(remAfterHbm, cxlAllocationGb);
    
    hbmResidentPercent = Number(((hbmGb / totalKvFootprintGb) * 100).toFixed(1));
    cxlResidentPercent = Number(((cxlGb / totalKvFootprintGb) * 100).toFixed(1));
    nvmeResidentPercent = 0;

    if (totalKvFootprintGb > hbmAllocationGb + cxlAllocationGb) {
      statusClassification = 'OOM_HBM_EXHAUSTION';
      effectiveInterTokenLatencyMs = 999.0;
      sustainableConcurrentStreams = 2;
    } else {
      averagePageFaultLatencyMs = prefetchEngine === 'async_cuda_dma_stream' ? 2.8 : 8.4;
      effectiveInterTokenLatencyMs = prefetchEngine === 'async_cuda_dma_stream' ? 6.8 : 12.4;
      sustainableConcurrentStreams = 16;
      statusClassification = 'BALANCED_CXL_BURST_HIERARCHY';
    }
  } else if (storageHierarchyMode === 'two_tiered_hbm_nvme') {
    const hbmGb = Math.min(totalKvFootprintGb, hbmAllocationGb);
    const nvmeGb = Math.max(0, totalKvFootprintGb - hbmGb);

    hbmResidentPercent = Number(((hbmGb / totalKvFootprintGb) * 100).toFixed(1));
    cxlResidentPercent = 0;
    nvmeResidentPercent = Number(((nvmeGb / totalKvFootprintGb) * 100).toFixed(1));

    if (prefetchEngine === 'sync_pcie_transfer') {
      averagePageFaultLatencyMs = 28.6;
      effectiveInterTokenLatencyMs = 38.4;
      sustainableConcurrentStreams = 8;
      statusClassification = 'SYNC_IO_STALL_DEGRADATION';
    } else {
      const gdsSpeedup = nvmeArrayThroughputGbps / 25.0;
      averagePageFaultLatencyMs = Number((14.0 / gdsSpeedup).toFixed(1));
      effectiveInterTokenLatencyMs = Number((8.2 + (averagePageFaultLatencyMs * 0.15)).toFixed(1));
      sustainableConcurrentStreams = 24;
      statusClassification = averagePageFaultLatencyMs < 10.0 ? 'SUB_10MS_ZERO_STALL_TIER' : 'BALANCED_CXL_BURST_HIERARCHY';
    }
  } else {
    // 'three_tiered_hbm_cxl_nvme'
    const hbmGb = Math.min(totalKvFootprintGb, hbmAllocationGb);
    const remAfterHbm = Math.max(0, totalKvFootprintGb - hbmGb);
    const cxlGb = Math.min(remAfterHbm, cxlAllocationGb);
    const nvmeGb = Math.max(0, remAfterHbm - cxlGb);

    hbmResidentPercent = Number(((hbmGb / totalKvFootprintGb) * 100).toFixed(1));
    cxlResidentPercent = Number(((cxlGb / totalKvFootprintGb) * 100).toFixed(1));
    nvmeResidentPercent = Number(((nvmeGb / totalKvFootprintGb) * 100).toFixed(1));

    if (prefetchEngine === 'sync_pcie_transfer') {
      averagePageFaultLatencyMs = 18.2;
      effectiveInterTokenLatencyMs = 24.6;
      sustainableConcurrentStreams = 12;
      statusClassification = 'SYNC_IO_STALL_DEGRADATION';
    } else {
      // Overlapped DMA + GPUDirect
      averagePageFaultLatencyMs = Number((6.4 * (32.0 / Math.max(14.0, nvmeArrayThroughputGbps))).toFixed(1));
      effectiveInterTokenLatencyMs = prefetchEngine === 'gpudirect_storage_gds' ? 7.2 : 7.8;
      sustainableConcurrentStreams = 48;
      statusClassification = 'SUB_10MS_ZERO_STALL_TIER';
    }
  }

  // Cost savings calculation
  // Without tiering: Must buy HBM3e nodes @ ~$300,000 per 8-GPU node (640GB HBM)
  const equivalentGpuNodesNeeded = Math.ceil(totalKvFootprintGb / 320.0);
  const baselineCostUsd = Math.max(1, equivalentGpuNodesNeeded) * 280000;
  const tieredHardwareCostUsd = 65000 + (cxlAllocationGb * 15) + 8000; // Node + CXL + NVMe
  const hardwareProcurementSavingsUsd = Math.max(0, baselineCostUsd - tieredHardwareCostUsd);

  const formattedHardwareSavings =
    currency === 'INR'
      ? `₹${((hardwareProcurementSavingsUsd * 87.5) / 10000000).toFixed(2)} Cr`
      : `$${(hardwareProcurementSavingsUsd / 1000).toFixed(0)}k USD`;

  return {
    totalKvFootprintGb,
    hbmResidentPercent,
    cxlResidentPercent,
    nvmeResidentPercent,
    averagePageFaultLatencyMs,
    effectiveInterTokenLatencyMs,
    sustainableConcurrentStreams,
    hardwareProcurementSavingsUsd,
    formattedHardwareSavings,
    statusClassification
  };
}
