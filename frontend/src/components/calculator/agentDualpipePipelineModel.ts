/**
 * agentDualpipePipelineModel.ts
 * Enterprise DualPipe Bidirectional Pipeline Parallelism & Bubble-Free Overlap Mathematical Engine.
 * Models symmetric bidirectional pipelines, micro-batch chunking, fine-grained All-to-All communication
 * overlap behind backward computation kernels, and MFU maximization on DeepSeek-V3 clusters.
 */

export interface DualpipeSimulationInputs {
    pipelineParallelStages: number; // 2 to 32 stages
    microBatchCount: number; // 16 to 128 micro-batches
    pipelineSchedule: 'dualpipe_bidirectional' | 'standard_1f1b' | 'interleaved_1f1b';
    crossNodeNetworkFabric: 'infiniband_800g_cx7' | 'nvlink_infiniband_400g' | 'pcie_gen5_ethernet';
    hardwareClusterNodes: number; // 2 to 64 nodes (8 GPUs per node)
    currency: 'USD' | 'INR';
}

export interface DualpipeSimulationResults {
    pipelineBubbleRatioPercent: number; // e.g. 1.7%
    modelFlopsUtilizationPercent: number; // MFU e.g. 63.8%
    hiddenCommunicationOverlapRatio: number; // e.g. 98.5%
    iterationTimeMs: number; // e.g. 142 ms
    baselineIterationTimeMs: number; // e.g. 215 ms
    clusterSpeedupFactor: number; // e.g. 1.51x
    annualFinOpsCapExSavings: number; // FinOps savings
    peakActivationMemoryGbPerGpu: number; // GB activation memory
    statusClassification: 'ZERO_BUBBLE_MFU_OPTIMIZED' | 'NETWORK_BOUND_STALL' | 'EXCESSIVE_PIPELINE_BUBBLE';
    stageBreakdown: { stageIndex: number; forwardTimeMs: number; backwardTimeMs: number; commOverlapMs: number }[];
}

export function calculateDualpipeSimulation(inputs: DualpipeSimulationInputs): DualpipeSimulationResults {
    const {
        pipelineParallelStages,
        microBatchCount,
        pipelineSchedule,
        crossNodeNetworkFabric,
        hardwareClusterNodes,
        currency
    } = inputs;

    // Network communication overhead factor
    let networkLatencyFactor = 1.0;
    if (crossNodeNetworkFabric === 'infiniband_800g_cx7') {
        networkLatencyFactor = 0.65;
    } else if (crossNodeNetworkFabric === 'pcie_gen5_ethernet') {
        networkLatencyFactor = 2.4;
    }

    // Pipeline bubble ratio calculation
    // Standard 1F1B bubble ratio: (P - 1) / (M + P - 1)
    const p = pipelineParallelStages;
    const m = microBatchCount;

    let bubbleRatio = 0.0;
    let mfuPercent = 0.0;
    let commOverlapRatio = 0.0;
    let activationMemoryMultiplier = 1.0;

    if (pipelineSchedule === 'dualpipe_bidirectional') {
        // DualPipe bidirectional schedule compresses bubble to (P/2 - 1) / (2M)
        bubbleRatio = Math.max(0.012, ((p / 2 - 1) / (2 * m)) * 0.75 * networkLatencyFactor);
        mfuPercent = Math.min(68.5, Math.max(48.0, 65.0 * (1 - bubbleRatio * 1.5)));
        commOverlapRatio = crossNodeNetworkFabric === 'pcie_gen5_ethernet' ? 0.78 : 0.985;
        activationMemoryMultiplier = 1.02; // Symmetric execution maintains near-identical activation buffers
    } else if (pipelineSchedule === 'interleaved_1f1b') {
        bubbleRatio = Math.max(0.08, ((p - 1) / (2 * m)) * 1.1 * networkLatencyFactor);
        mfuPercent = Math.min(56.0, Math.max(38.0, 53.0 * (1 - bubbleRatio * 1.2)));
        commOverlapRatio = 0.62;
        activationMemoryMultiplier = 1.38; // Interleaving requires storing more concurrent activations
    } else {
        // Standard 1F1B
        bubbleRatio = Math.min(0.45, Math.max(0.15, (p - 1) / (m + p - 1)));
        mfuPercent = Math.min(46.0, Math.max(30.0, 44.0 * (1 - bubbleRatio)));
        commOverlapRatio = 0.25;
        activationMemoryMultiplier = 1.0;
    }

    // Step execution timing (ms)
    const baseComputePerMicroBatchMs = 4.2;
    const allToAllCommPerMicroBatchMs = 2.8 * networkLatencyFactor;

    // Baseline iteration time without full overlap
    const baselineIterationTimeMs = Math.round(
        (m * (baseComputePerMicroBatchMs * 2.5 + allToAllCommPerMicroBatchMs * 0.7) * (1 + (p - 1) / (m + p - 1))) * 10
    ) / 10;

    // Actual iteration time with chosen schedule and overlap
    const effectiveCommStall = allToAllCommPerMicroBatchMs * (1 - commOverlapRatio);
    const iterationTimeMs = Math.round(
        (m * (baseComputePerMicroBatchMs * 2.5 + effectiveCommStall) * (1 + bubbleRatio)) * 10
    ) / 10;

    const clusterSpeedupFactor = Math.round((baselineIterationTimeMs / iterationTimeMs) * 100) / 100;

    // Peak activation memory per GPU (GB)
    const baseActivationMemoryGb = 18.5;
    const peakActivationMemoryGbPerGpu = Math.round((baseActivationMemoryGb * activationMemoryMultiplier) * 10) / 10;

    // Financial FinOps CapEx savings calculation
    const totalGpus = hardwareClusterNodes * 8;
    const annualCostPerGpuUsd = 26000; // ~$3.0/hr amortized cost per H100
    const annualClusterSpendUsd = totalGpus * annualCostPerGpuUsd;
    const efficiencyDelta = (clusterSpeedupFactor - 1.0) / clusterSpeedupFactor;
    let annualSavings = Math.round(annualClusterSpendUsd * efficiencyDelta);

    if (currency === 'INR') {
        annualSavings = Math.round(annualSavings * 86.5);
    }

    // Status classification
    let statusClassification: 'ZERO_BUBBLE_MFU_OPTIMIZED' | 'NETWORK_BOUND_STALL' | 'EXCESSIVE_PIPELINE_BUBBLE' = 'ZERO_BUBBLE_MFU_OPTIMIZED';
    if (bubbleRatio > 0.2) {
        statusClassification = 'EXCESSIVE_PIPELINE_BUBBLE';
    } else if (crossNodeNetworkFabric === 'pcie_gen5_ethernet' && pipelineSchedule !== 'dualpipe_bidirectional') {
        statusClassification = 'NETWORK_BOUND_STALL';
    }

    // Generate stage-by-stage execution telemetry breakdown
    const stageBreakdown = [];
    const stagesToShow = Math.min(8, p);
    for (let i = 0; i < stagesToShow; i++) {
        stageBreakdown.push({
            stageIndex: i,
            forwardTimeMs: Math.round((baseComputePerMicroBatchMs * 0.9) * 10) / 10,
            backwardTimeMs: Math.round((baseComputePerMicroBatchMs * 1.6) * 10) / 10,
            commOverlapMs: Math.round((allToAllCommPerMicroBatchMs * commOverlapRatio) * 10) / 10
        });
    }

    return {
        pipelineBubbleRatioPercent: Math.round(bubbleRatio * 1000) / 10,
        modelFlopsUtilizationPercent: Math.round(mfuPercent * 10) / 10,
        hiddenCommunicationOverlapRatio: Math.round(commOverlapRatio * 1000) / 10,
        iterationTimeMs,
        baselineIterationTimeMs,
        clusterSpeedupFactor,
        annualFinOpsCapExSavings: annualSavings,
        peakActivationMemoryGbPerGpu,
        statusClassification,
        stageBreakdown
    };
}
