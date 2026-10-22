/**
 * agentMtpSpeculativeDraftModel.ts
 * Enterprise Multi-Token Prediction (MTP) Acceptance Ratio & Speculative Draft Tree Mathematical Engine.
 * Models sequential MTP draft modules, dual speculative tree verification, token decode throughput,
 * and VRAM reuse across DeepSeek-V3 and DeepSeek-R1 inference architectures.
 */

export interface MtpSimulationInputs {
    mtpPredictionDepth: number; // 1 to 5 tokens drafted ahead
    speculativeVerificationMode: 'linear_chain' | 'dynamic_tree' | 'hybrid_dynamic';
    taskDomainComplexity: 'deterministic_code' | 'structured_extraction' | 'chain_of_thought_reasoning' | 'creative_synthesis';
    batchConcurrency: number; // 1 to 1024 concurrent streams
    targetModelSize: 'deepseek_v3_671b' | 'deepseek_r1_671b' | 'llama_3_3_70b_mtp';
    hardwareCluster: '8x_h100_sxm5' | '8x_b200_nvlink' | '8x_a100_80gb';
    currency: 'USD' | 'INR';
}

export interface MtpSimulationResults {
    speculativeAcceptanceRate: number; // e.g. 82.5%
    effectiveTokensPerStep: number; // e.g. 2.65 tokens/step
    decodingSpeedupRatio: number; // e.g. 2.78x
    interTokenLatencyMs: number; // e.g. 5.3 ms vs 14.8 ms
    aggregateThroughputTokensPerSec: number; // total tokens/s across batch
    baselineThroughputTokensPerSec: number;
    annualServingCostMitigation: number; // Annual cloud spend saved
    auxiliaryVramPerStreamMb: number; // KV-cache overhead per stream in MB
    speculativeRollbackP99Ms: number; // Sub-millisecond rollback latency
    hardwareClassification: 'OPTIMAL_SUPER_LINEAR_SCALING' | 'THROUGHPUT_SATURATED' | 'DIMINISHING_RETURNS';
    acceptanceDistributionByDepth: { depth: number; acceptanceRate: number; cumulativeAccepted: number }[];
}

export function calculateMtpSimulation(inputs: MtpSimulationInputs): MtpSimulationResults {
    const {
        mtpPredictionDepth,
        speculativeVerificationMode,
        taskDomainComplexity,
        batchConcurrency,
        targetModelSize,
        hardwareCluster,
        currency
    } = inputs;

    // Base acceptance rate by domain complexity
    let baseAcceptanceRate = 0.85;
    if (taskDomainComplexity === 'deterministic_code') {
        baseAcceptanceRate = 0.88;
    } else if (taskDomainComplexity === 'structured_extraction') {
        baseAcceptanceRate = 0.92;
    } else if (taskDomainComplexity === 'chain_of_thought_reasoning') {
        baseAcceptanceRate = 0.79;
    } else if (taskDomainComplexity === 'creative_synthesis') {
        baseAcceptanceRate = 0.68;
    }

    // Boost or penalty based on verification mode
    let modeMultiplier = 1.0;
    if (speculativeVerificationMode === 'dynamic_tree') {
        modeMultiplier = 1.08; // Tree evaluation boosts acceptance of branched candidates
    } else if (speculativeVerificationMode === 'hybrid_dynamic') {
        modeMultiplier = 1.05;
    } else {
        modeMultiplier = 0.98; // Linear chain cuts off immediately on first rejection
    }

    // Calculate acceptance distribution across each prediction depth k
    const acceptanceDistribution: { depth: number; acceptanceRate: number; cumulativeAccepted: number }[] = [];
    let expectedTokensAccepted = 1.0; // The base token is always evaluated

    for (let d = 1; d <= mtpPredictionDepth; d++) {
        // Acceptance decays with speculative depth d
        const decayFactor = Math.pow(0.88, d - 1);
        const depthAcceptance = Math.min(0.96, Math.max(0.35, baseAcceptanceRate * modeMultiplier * decayFactor));
        expectedTokensAccepted += depthAcceptance;

        acceptanceDistribution.push({
            depth: d,
            acceptanceRate: Math.round(depthAcceptance * 1000) / 10,
            cumulativeAccepted: Math.round(expectedTokensAccepted * 100) / 100
        });
    }

    const overallAcceptanceRate = Math.round(
        (acceptanceDistribution.reduce((acc, curr) => acc + curr.acceptanceRate, 0) / mtpPredictionDepth) * 10
    ) / 10;

    // Hardware and baseline latency parameters (ms per forward pass)
    let baseForwardPassMs = 14.5;
    const modelLatencyScale = targetModelSize === 'llama_3_3_70b_mtp' ? 0.65 : targetModelSize === 'deepseek_r1_671b' ? 1.05 : 1.0;
    baseForwardPassMs *= modelLatencyScale;
    let mtpHeadOverheadMsPerDepth = 0.45; // lightweight MTP Transformer block adds ~0.45ms per depth
    let treeVerificationOverheadMs = speculativeVerificationMode === 'dynamic_tree' ? 0.6 : 0.2;

    if (hardwareCluster === '8x_b200_nvlink') {
        baseForwardPassMs = 8.2;
        mtpHeadOverheadMsPerDepth = 0.25;
        treeVerificationOverheadMs *= 0.6;
    } else if (hardwareCluster === '8x_a100_80gb') {
        baseForwardPassMs = 24.0;
        mtpHeadOverheadMsPerDepth = 0.85;
        treeVerificationOverheadMs *= 1.4;
    }

    // Baseline autoregressive performance
    const baselineItlMs = baseForwardPassMs;
    const baselineThroughput = (1000 / baselineItlMs) * batchConcurrency;

    // MTP forward pass latency (main step + MTP drafting + parallel verification)
    const totalStepLatencyMs = baseForwardPassMs + (mtpPredictionDepth * mtpHeadOverheadMsPerDepth) + treeVerificationOverheadMs;
    const effectiveTokensPerStep = Math.round(expectedTokensAccepted * 100) / 100;

    // Effective inter-token latency (time per emitted token)
    const interTokenLatencyMs = Math.round((totalStepLatencyMs / effectiveTokensPerStep) * 10) / 10;
    const decodingSpeedupRatio = Math.round((baselineItlMs / interTokenLatencyMs) * 100) / 100;

    // Aggregate throughput (tokens/sec across active batch streams)
    const aggregateThroughputTokensPerSec = Math.round((1000 / interTokenLatencyMs) * batchConcurrency);

    // VRAM overhead per stream in MB (shared down-projected MLA cache reuse vs new draft heads)
    // DeepSeek-V3 MTP heads reuse c_t^KV, requiring only ~1.8 MB per stream for transient draft activations
    const auxiliaryVramPerStreamMb = Math.round((1.2 + (mtpPredictionDepth * 0.35)) * 10) / 10;

    // P99 Speculative Rollback Latency (ms) - GPU SRAM register clear
    const speculativeRollbackP99Ms = hardwareCluster === '8x_b200_nvlink' ? 0.28 : hardwareCluster === '8x_h100_sxm5' ? 0.48 : 0.95;

    // Financial ROI calculation (annual GPU FinOps savings)
    const hourlyGpuCostUsd = hardwareCluster === '8x_b200_nvlink' ? 38.0 : hardwareCluster === '8x_h100_sxm5' ? 24.5 : 16.0;
    const annualClusterCostUsd = hourlyGpuCostUsd * 24 * 365;
    // Speedup allows serving the same workload on fewer nodes: savings = (1 - 1/speedup) * cluster cost
    const savingsRatio = 1.0 - (1.0 / decodingSpeedupRatio);
    let annualSavingUsd = Math.round(annualClusterCostUsd * savingsRatio);

    if (currency === 'INR') {
        annualSavingUsd = Math.round(annualSavingUsd * 86.5); // USD to INR conversion
    }

    // Hardware Classification
    let hardwareClassification: 'OPTIMAL_SUPER_LINEAR_SCALING' | 'THROUGHPUT_SATURATED' | 'DIMINISHING_RETURNS' = 'OPTIMAL_SUPER_LINEAR_SCALING';
    if (mtpPredictionDepth >= 4 && overallAcceptanceRate < 60) {
        hardwareClassification = 'DIMINISHING_RETURNS';
    } else if (batchConcurrency >= 512 && hardwareCluster === '8x_a100_80gb') {
        hardwareClassification = 'THROUGHPUT_SATURATED';
    }

    return {
        speculativeAcceptanceRate: overallAcceptanceRate,
        effectiveTokensPerStep,
        decodingSpeedupRatio,
        interTokenLatencyMs,
        aggregateThroughputTokensPerSec,
        baselineThroughputTokensPerSec: Math.round(baselineThroughput),
        annualServingCostMitigation: annualSavingUsd,
        auxiliaryVramPerStreamMb,
        speculativeRollbackP99Ms,
        hardwareClassification,
        acceptanceDistributionByDepth: acceptanceDistribution
    };
}
