/**
 * modelRoutingSimulatorModel.ts
 *
 * Mathematical and architectural cost-latency arbitrage simulation model comparing
 * Naive Single-Model Ingestion (Routing 100% to Frontier LLMs) vs
 * Elesium Dynamic Multi-Model Cascade Router (DeBERTa/FastClassifier dispatching across Fast/Intermediate/Frontier tiers).
 */

export type RoutingStrategy =
  | 'balanced_enterprise'
  | 'aggressive_finops'
  | 'maximum_reasoning';

export type FrontierModelType =
  | 'claude_3_5_sonnet'
  | 'gpt_4o'
  | 'o1_reasoning';

export type FastModelType =
  | 'deepseek_v3'
  | 'llama_3_3_70b'
  | 'gpt_4o_mini';

export interface ModelRoutingInputs {
  monthlyQueryVolume: number; // 50,000 to 5,000,000 queries
  routingStrategy: RoutingStrategy;
  frontierModel: FrontierModelType;
  fastModel: FastModelType;
  averagePromptTokens: number; // 256 to 4,096 tokens
  averageCompletionTokens: number; // 128 to 2,048 tokens
}

export interface ModelTierAllocation {
  tierId: 'fast_tier' | 'intermediate_tier' | 'frontier_tier';
  tierName: string;
  assignedModel: string;
  querySharePct: number;
  averageLatencyMs: number;
  monthlyCostUsd: number;
  p99LatencyMs: number;
}

export interface ModelRoutingSimulatorResults {
  inputs: ModelRoutingInputs;
  allocations: ModelTierAllocation[];
  naiveFrontierMonthlyCostUsd: number;
  routedBlendedMonthlyCostUsd: number;
  monthlyCostSavingsUsd: number;
  annualCostSavingsUsd: number;
  costReductionPct: number;
  naiveAverageLatencyMs: number;
  routedAverageLatencyMs: number;
  latencyReductionPct: number;
  routingAccuracyPct: number;
  fallbackEscalationRatePct: number;
  architecturalGuidance: string;
}

export function calculateModelRoutingSimulation(inputs: ModelRoutingInputs): ModelRoutingSimulatorResults {
  const {
    monthlyQueryVolume,
    routingStrategy,
    frontierModel,
    fastModel,
    averagePromptTokens,
    averageCompletionTokens
  } = inputs;

  // 1. Frontier Model Pricing (USD per 1M tokens) & Latency
  let frontierInputCostPer1M = 3.00;
  let frontierOutputCostPer1M = 15.00;
  let frontierLatencyMs = 1450;
  let frontierP99Ms = 3200;
  let frontierDisplayName = 'Claude 3.5 Sonnet';

  if (frontierModel === 'gpt_4o') {
    frontierInputCostPer1M = 2.50;
    frontierOutputCostPer1M = 10.00;
    frontierLatencyMs = 1250;
    frontierP99Ms = 2800;
    frontierDisplayName = 'OpenAI GPT-4o';
  } else if (frontierModel === 'o1_reasoning') {
    frontierInputCostPer1M = 15.00;
    frontierOutputCostPer1M = 60.00;
    frontierLatencyMs = 3800;
    frontierP99Ms = 7500;
    frontierDisplayName = 'OpenAI o1 Reasoning';
  }

  // 2. Fast Model Pricing & Latency
  let fastInputCostPer1M = 0.27;
  let fastOutputCostPer1M = 1.10;
  let fastLatencyMs = 380;
  let fastP99Ms = 950;
  let fastDisplayName = 'DeepSeek V3 (Local/Cloud)';

  if (fastModel === 'llama_3_3_70b') {
    fastInputCostPer1M = 0.50;
    fastOutputCostPer1M = 0.80;
    fastLatencyMs = 420;
    fastP99Ms = 1100;
    fastDisplayName = 'Llama 3.3 70B (Private VPC)';
  } else if (fastModel === 'gpt_4o_mini') {
    fastInputCostPer1M = 0.15;
    fastOutputCostPer1M = 0.60;
    fastLatencyMs = 320;
    fastP99Ms = 850;
    fastDisplayName = 'OpenAI GPT-4o-mini';
  }

  // 3. Intermediate Tier (Workhorse / Fine-Tuned Model)
  const intermediateInputCostPer1M = (frontierInputCostPer1M + fastInputCostPer1M) * 0.35;
  const intermediateOutputCostPer1M = (frontierOutputCostPer1M + fastOutputCostPer1M) * 0.35;
  const intermediateLatencyMs = Math.round((frontierLatencyMs + fastLatencyMs) * 0.45);
  const intermediateP99Ms = Math.round((frontierP99Ms + fastP99Ms) * 0.45);
  const intermediateDisplayName = 'Fine-Tuned Llama-3-8B / Haiku-3.5';

  // 4. Distribution Shares by Strategy
  let fastShare = 0.50;
  let intermediateShare = 0.32;
  let frontierShare = 0.18;
  let routingClassifierOverheadMs = 14; // sub-15ms DeBERTa intent router
  let routingAccuracyPct = 99.4;
  let fallbackEscalationRatePct = 2.4;

  if (routingStrategy === 'aggressive_finops') {
    fastShare = 0.68;
    intermediateShare = 0.22;
    frontierShare = 0.10;
    routingAccuracyPct = 98.8;
    fallbackEscalationRatePct = 3.6;
  } else if (routingStrategy === 'maximum_reasoning') {
    fastShare = 0.30;
    intermediateShare = 0.35;
    frontierShare = 0.35;
    routingAccuracyPct = 99.8;
    fallbackEscalationRatePct = 1.2;
  }

  // 5. Cost Calculations
  const costPerQuery = (inputCostPer1M: number, outputCostPer1M: number) => {
    return ((averagePromptTokens / 1_000_000) * inputCostPer1M) +
           ((averageCompletionTokens / 1_000_000) * outputCostPer1M);
  };

  const naiveCostPerQuery = costPerQuery(frontierInputCostPer1M, frontierOutputCostPer1M);
  const naiveFrontierMonthlyCostUsd = Math.round(monthlyQueryVolume * naiveCostPerQuery);

  const fastCostPerQuery = costPerQuery(fastInputCostPer1M, fastOutputCostPer1M);
  const intermediateCostPerQuery = costPerQuery(intermediateInputCostPer1M, intermediateOutputCostPer1M);
  const frontierCostPerQuery = costPerQuery(frontierInputCostPer1M, frontierOutputCostPer1M);

  const fastMonthlyCostUsd = Math.round(monthlyQueryVolume * fastShare * fastCostPerQuery);
  const intermediateMonthlyCostUsd = Math.round(monthlyQueryVolume * intermediateShare * intermediateCostPerQuery);
  const frontierAllocatedMonthlyCostUsd = Math.round(monthlyQueryVolume * frontierShare * frontierCostPerQuery);

  // Router overhead (self-hosted DeBERTa classifier compute ~$80/mo)
  const routerComputeOverheadUsd = 80;
  const routedBlendedMonthlyCostUsd = fastMonthlyCostUsd + intermediateMonthlyCostUsd + frontierAllocatedMonthlyCostUsd + routerComputeOverheadUsd;

  const monthlyCostSavingsUsd = Math.max(0, naiveFrontierMonthlyCostUsd - routedBlendedMonthlyCostUsd);
  const annualCostSavingsUsd = monthlyCostSavingsUsd * 12;
  const costReductionPct = Math.round(((naiveFrontierMonthlyCostUsd - routedBlendedMonthlyCostUsd) / naiveFrontierMonthlyCostUsd) * 1000) / 10;

  // 6. Latency Calculations
  const naiveAverageLatencyMs = frontierLatencyMs;
  const routedAverageLatencyMs = Math.round(
    routingClassifierOverheadMs +
    (fastShare * fastLatencyMs) +
    (intermediateShare * intermediateLatencyMs) +
    (frontierShare * frontierLatencyMs)
  );

  const latencyReductionPct = Math.round(((naiveAverageLatencyMs - routedAverageLatencyMs) / naiveAverageLatencyMs) * 1000) / 10;

  // 7. Allocations
  const allocations: ModelTierAllocation[] = [
    {
      tierId: 'fast_tier',
      tierName: 'Tier 1: High-Throughput Reflex Engine',
      assignedModel: fastDisplayName,
      querySharePct: Math.round(fastShare * 100),
      averageLatencyMs: fastLatencyMs + routingClassifierOverheadMs,
      p99LatencyMs: fastP99Ms + routingClassifierOverheadMs,
      monthlyCostUsd: fastMonthlyCostUsd
    },
    {
      tierId: 'intermediate_tier',
      tierName: 'Tier 2: Enterprise Synthesis & Workhorse',
      assignedModel: intermediateDisplayName,
      querySharePct: Math.round(intermediateShare * 100),
      averageLatencyMs: intermediateLatencyMs + routingClassifierOverheadMs,
      p99LatencyMs: intermediateP99Ms + routingClassifierOverheadMs,
      monthlyCostUsd: intermediateMonthlyCostUsd
    },
    {
      tierId: 'frontier_tier',
      tierName: 'Tier 3: Frontier Cognitive Reasoning',
      assignedModel: frontierDisplayName,
      querySharePct: Math.round(frontierShare * 100),
      averageLatencyMs: frontierLatencyMs + routingClassifierOverheadMs,
      p99LatencyMs: frontierP99Ms + routingClassifierOverheadMs,
      monthlyCostUsd: frontierAllocatedMonthlyCostUsd
    }
  ];

  // 8. Architectural Guidance
  let architecturalGuidance = '';
  if (routingStrategy === 'aggressive_finops') {
    architecturalGuidance = `Aggressive FinOps strategy diverts 68% of traffic to ${fastDisplayName}, cutting monthly token spend by ${costReductionPct}% ($${monthlyCostSavingsUsd.toLocaleString()}/mo). Router confidence guardrails trigger autonomous escalation on the remaining 3.6% of ambiguous payloads, preserving enterprise accuracy with maximum dollar arbitrage.`;
  } else if (routingStrategy === 'maximum_reasoning') {
    architecturalGuidance = `Maximum reasoning configuration allocates 35% of traffic directly to ${frontierDisplayName} while still shaving ${costReductionPct}% off baseline cloud bills ($${monthlyCostSavingsUsd.toLocaleString()}/mo). Recommended for complex regulatory, high-stakes medical, and quantitative financial audit pipelines.`;
  } else {
    architecturalGuidance = `Balanced enterprise routing provides optimal cost-to-performance arbitrage: 50% fast reflexes, 32% intermediate workhorse, and 18% frontier reasoning. Reduces cluster p90 latency by ${latencyReductionPct}% while capturing $${annualCostSavingsUsd.toLocaleString()}/year in net token arbitrage savings.`;
  }

  return {
    inputs,
    allocations,
    naiveFrontierMonthlyCostUsd,
    routedBlendedMonthlyCostUsd,
    monthlyCostSavingsUsd,
    annualCostSavingsUsd,
    costReductionPct,
    naiveAverageLatencyMs,
    routedAverageLatencyMs,
    latencyReductionPct,
    routingAccuracyPct,
    fallbackEscalationRatePct,
    architecturalGuidance
  };
}
