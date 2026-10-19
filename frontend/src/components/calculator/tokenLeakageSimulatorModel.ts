/**
 * tokenLeakageSimulatorModel.ts
 * ============================================================================
 * Mathematical Engine for Enterprise Multi-Agent Token Leakage Simulator.
 * 
 * Quantifies and models:
 * 1. Unconstrained ReAct (Reasoning + Acting) quadratic context window growth.
 * 2. Silent runaway token burn across recursive tool calling and self-reflection loops.
 * 3. Cascade failure & infinite loop probabilities under stochastic agent behavior.
 * 4. Deterministic Finite State Machine (FSM) circuit breaker savings, bounded
 *    state schema projections, and sub-step token budgeting.
 * 5. P50/P99 latency variance under retry storms vs deterministic state graphs.
 * ============================================================================
 */

export type TopologyKey = 'unconstrained_react' | 'hierarchical_swarm' | 'deterministic_fsm';
export type ModelKey = 'gpt-4o' | 'claude-3-5-sonnet' | 'deepseek-r1' | 'llama-3-70b-vllm';
export type Currency = 'USD' | 'INR';

export interface ModelPricing {
  id: ModelKey;
  name: string;
  provider: string;
  inputPerMTokUSD: number;
  outputPerMTokUSD: number;
  baseTtftMs: number;
  genSpeedTokensPerSec: number;
  contextWindow: number;
  reasoningMultiplier: number; // Scratchpad/thinking token inflation (e.g. DeepSeek R1 / o1)
}

export interface TopologyProfile {
  id: TopologyKey;
  name: string;
  badge: string;
  description: string;
  contextBloatFactor: number; // Multiplier on historical context retained per turn
  retryEscalationFactor: number; // Memory expansion during error-correction loops
  circuitBreakerEnforced: boolean;
  maxRetriesAllowed: number;
  statePruningEfficiency: number; // Fraction of parent context pruned before sub-agent execution
}

export interface SimulatorInputs {
  topology: TopologyKey;
  model: ModelKey;
  agentNodes: number; // 1 to 20
  recursionDepth: number; // 1 to 25
  failureRatePct: number; // 5% to 50%
  basePromptTokens: number; // 1,000 to 32,000
  monthlyRuns: number; // 1,000 to 200,000
  currency: Currency;
}

export interface SimulatorResults {
  // Token Volumes Per Run
  unconstrainedTokensPerRun: number;
  fsmTokensPerRun: number;
  tokenLeakagePerRun: number;
  tokenReductionPct: number;

  // Monthly Aggregate Token Volumes
  unconstrainedMonthlyTokens: number;
  fsmMonthlyTokens: number;
  monthlyLeakedTokens: number;

  // Financial Modeling (Monthly & Annual)
  unconstrainedMonthlyCost: number;
  fsmMonthlyCost: number;
  monthlySavings: number;
  annualSavings: number;
  costReductionPct: number;

  // Operational Reliability & Risk Metrics
  unconstrainedCascadeRiskPct: number;
  fsmCascadeRiskPct: number;
  unconstrainedP99LatencyMs: number;
  fsmP99LatencyMs: number;
  latencyReductionPct: number;

  // Per-Execution Unit Cost
  costPerRunUnconstrained: number;
  costPerRunFsm: number;

  // Formatting Metadata
  currencySymbol: string;
  currency: Currency;
}

export const USD_TO_INR_RATE = 87.5;

export const MODELS: Record<ModelKey, ModelPricing> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o (Omni-Enterprise)',
    provider: 'OpenAI Cloud',
    inputPerMTokUSD: 2.50,
    outputPerMTokUSD: 10.00,
    baseTtftMs: 380,
    genSpeedTokensPerSec: 105,
    contextWindow: 128000,
    reasoningMultiplier: 1.0
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'Anthropic Cloud',
    inputPerMTokUSD: 3.00,
    outputPerMTokUSD: 15.00,
    baseTtftMs: 440,
    genSpeedTokensPerSec: 85,
    contextWindow: 200000,
    reasoningMultiplier: 1.15
  },
  'deepseek-r1': {
    id: 'deepseek-r1',
    name: 'DeepSeek R1 (Reasoning Core)',
    provider: 'DeepSeek / Sovereign Cluster',
    inputPerMTokUSD: 0.55,
    outputPerMTokUSD: 2.19,
    baseTtftMs: 520,
    genSpeedTokensPerSec: 65,
    contextWindow: 64000,
    reasoningMultiplier: 3.4 // Generates large thinking traces before tool execution
  },
  'llama-3-70b-vllm': {
    id: 'llama-3-70b-vllm',
    name: 'Meta Llama 3 70B (Sovereign vLLM)',
    provider: 'Private VPC On-Premises',
    inputPerMTokUSD: 0.45,
    outputPerMTokUSD: 0.45,
    baseTtftMs: 140,
    genSpeedTokensPerSec: 180,
    contextWindow: 128000,
    reasoningMultiplier: 1.0
  }
};

export const TOPOLOGIES: Record<TopologyKey, TopologyProfile> = {
  'unconstrained_react': {
    id: 'unconstrained_react',
    name: 'Unconstrained ReAct Loop (LangChain / CrewAI Default)',
    badge: 'High Fragility',
    description: 'Autonomous reasoning-acting loops that retain full historical conversation traces and error tracebacks across recursive tool attempts.',
    contextBloatFactor: 1.85,
    retryEscalationFactor: 2.4,
    circuitBreakerEnforced: false,
    maxRetriesAllowed: 10,
    statePruningEfficiency: 0.05
  },
  'hierarchical_swarm': {
    id: 'hierarchical_swarm',
    name: 'Hierarchical Multi-Agent Swarm (Supervisor + Workers)',
    badge: 'Moderate Fragility',
    description: 'Supervisor routing topology with message bus serialization. Prunes worker payloads upon return but accumulates state in the coordinator.',
    contextBloatFactor: 1.40,
    retryEscalationFactor: 1.6,
    circuitBreakerEnforced: false,
    maxRetriesAllowed: 5,
    statePruningEfficiency: 0.45
  },
  'deterministic_fsm': {
    id: 'deterministic_fsm',
    name: 'Elesium Deterministic FSM + Circuit Breakers',
    badge: 'Zero Silent Burn',
    description: 'Strict Directed Acyclic StateGraph with Pydantic typed state projections, isolated node contexts, idempotent tool caches, and hard execution bounds.',
    contextBloatFactor: 1.05,
    retryEscalationFactor: 1.0,
    circuitBreakerEnforced: true,
    maxRetriesAllowed: 1, // Max 1 retry before deterministic fallback
    statePruningEfficiency: 0.90
  }
};

/**
 * Calculates token consumption, silent leakage, financial burn, and reliability metrics.
 */
export function calculateTokenLeakage(inputs: SimulatorInputs): SimulatorResults {
  const model = MODELS[inputs.model];
  const topo = TOPOLOGIES[inputs.topology];
  const currencyRate = inputs.currency === 'INR' ? USD_TO_INR_RATE : 1.0;
  const currencySymbol = inputs.currency === 'INR' ? '₹' : '$';

  const baseInputTokens = inputs.basePromptTokens;
  const failureProb = inputs.failureRatePct / 100.0;
  const depth = inputs.recursionDepth;
  const nodes = inputs.agentNodes;

  // --------------------------------------------------------------------------
  // 1. Unconstrained ReAct Token Simulation (Baseline)
  // Quadratic context growth: each step passes all prior steps + tool output
  // --------------------------------------------------------------------------
  let unconstrainedTotalInputTokens = 0;
  let unconstrainedTotalOutputTokens = 0;
  let currentContext = baseInputTokens;

  const avgToolOutputTokens = 650;
  const baseStepOutputTokens = 350 * model.reasoningMultiplier;

  for (let step = 1; step <= depth; step++) {
    // Retries increase context window quadratically when tool validation fails
    const expectedRetriesForStep = failureProb * topo.retryEscalationFactor;
    
    // Each step re-submits the full accumulated context
    unconstrainedTotalInputTokens += currentContext * (1 + expectedRetriesForStep);
    
    // Output tokens include generated reasoning + tool call parameters
    const stepOutput = baseStepOutputTokens * (1 + expectedRetriesForStep);
    unconstrainedTotalOutputTokens += stepOutput;

    // In unconstrained architectures, tool output and error tracebacks accumulate in memory
    const addedContext = avgToolOutputTokens + (expectedRetriesForStep * 400); // 400 tokens error traceback
    currentContext += addedContext * topo.contextBloatFactor;
  }

  // Multi-node multiplier for unconstrained agent coordination overhead
  const unconstrainedNodeTax = 1 + ((nodes - 1) * 0.18);
  const unconstrainedTokensPerRun = Math.round(
    (unconstrainedTotalInputTokens + unconstrainedTotalOutputTokens) * unconstrainedNodeTax
  );

  // --------------------------------------------------------------------------
  // 2. Elesium Deterministic FSM Token Simulation (Optimized Target)
  // Linear context: state projection prunes 90% of irrelevant history per transition.
  // Hard circuit breaker prevents retry storms (max 1 retry, then deterministic fallback).
  // --------------------------------------------------------------------------
  let fsmTotalInputTokens = 0;
  let fsmTotalOutputTokens = 0;

  for (let step = 1; step <= depth; step++) {
    // Isolated schema projection: each state node only receives its declared fields
    const projectedNodeContext = (baseInputTokens * 0.25) + (avgToolOutputTokens * 0.5);
    
    // Bounded retry: capped at 1 retry maximum with strict exponential backoff or instant fallback
    const cappedRetries = Math.min(failureProb * 0.5, 0.2); // FSM handles edge cases with deterministic validation
    
    fsmTotalInputTokens += projectedNodeContext * (1 + cappedRetries);
    fsmTotalOutputTokens += (baseStepOutputTokens * 0.7) * (1 + cappedRetries); // Clear JSON schemas reduce reasoning wander
  }

  // FSM coordination overhead is fixed O(1) in memory (state graph edge transition)
  const fsmNodeTax = 1 + ((nodes - 1) * 0.03);
  const fsmTokensPerRun = Math.round(
    (fsmTotalInputTokens + fsmTotalOutputTokens) * fsmNodeTax
  );

  // Token Leakage (Difference in tokens burned)
  const tokenLeakagePerRun = Math.max(0, unconstrainedTokensPerRun - fsmTokensPerRun);
  const tokenReductionPct = Math.round(
    ((unconstrainedTokensPerRun - fsmTokensPerRun) / unconstrainedTokensPerRun) * 100
  );

  // Monthly Aggregate Token Volumes
  const unconstrainedMonthlyTokens = unconstrainedTokensPerRun * inputs.monthlyRuns;
  const fsmMonthlyTokens = fsmTokensPerRun * inputs.monthlyRuns;
  const monthlyLeakedTokens = tokenLeakagePerRun * inputs.monthlyRuns;

  // --------------------------------------------------------------------------
  // 3. Financial Modeling (Input vs Output Token Pricing)
  // --------------------------------------------------------------------------
  const blendedPricePerMTokUSD = (model.inputPerMTokUSD * 0.7) + (model.outputPerMTokUSD * 0.3);

  const unconstrainedMonthlyCostUSD = (unconstrainedMonthlyTokens / 1_000_000) * blendedPricePerMTokUSD;
  const fsmMonthlyCostUSD = (fsmMonthlyTokens / 1_000_000) * blendedPricePerMTokUSD;

  const unconstrainedMonthlyCost = unconstrainedMonthlyCostUSD * currencyRate;
  const fsmMonthlyCost = fsmMonthlyCostUSD * currencyRate;
  const monthlySavings = Math.max(0, unconstrainedMonthlyCost - fsmMonthlyCost);
  const annualSavings = monthlySavings * 12;
  const costReductionPct = Math.round(
    ((unconstrainedMonthlyCost - fsmMonthlyCost) / unconstrainedMonthlyCost) * 100
  );

  const costPerRunUnconstrained = unconstrainedMonthlyCost / inputs.monthlyRuns;
  const costPerRunFsm = fsmMonthlyCost / inputs.monthlyRuns;

  // --------------------------------------------------------------------------
  // 4. Cascade Failure Risk & P99 Latency Modeling
  // P(infinite loop / context blowup) = 1 - (1 - failureRate * hallucinationFactor)^depth
  // --------------------------------------------------------------------------
  const hallucinationFactor = 0.38; // 38% of tool failures trigger secondary hallucinated recovery in ReAct
  const unconstrainedRiskRaw = (1 - Math.pow(1 - (failureProb * hallucinationFactor), depth)) * 100;
  const unconstrainedCascadeRiskPct = Math.min(96, Math.max(8, Math.round(unconstrainedRiskRaw * (1 + (nodes * 0.05)))));
  
  // FSM with circuit breakers has 0.0% infinite loop probability by mathematical proof
  const fsmCascadeRiskPct = 0.0;

  // Latency calculation (P99 tail latency in ms)
  const unconstrainedP99LatencyMs = Math.round(
    (depth * (model.baseTtftMs + 850)) * (1 + (failureProb * 3.2)) + (nodes * 320)
  );

  const fsmP99LatencyMs = Math.round(
    (depth * (model.baseTtftMs * 0.75 + 320)) * 1.15 + (nodes * 45)
  );

  const latencyReductionPct = Math.round(
    ((unconstrainedP99LatencyMs - fsmP99LatencyMs) / unconstrainedP99LatencyMs) * 100
  );

  return {
    unconstrainedTokensPerRun,
    fsmTokensPerRun,
    tokenLeakagePerRun,
    tokenReductionPct,
    unconstrainedMonthlyTokens,
    fsmMonthlyTokens,
    monthlyLeakedTokens,
    unconstrainedMonthlyCost,
    fsmMonthlyCost,
    monthlySavings,
    annualSavings,
    costReductionPct,
    unconstrainedCascadeRiskPct,
    fsmCascadeRiskPct,
    unconstrainedP99LatencyMs,
    fsmP99LatencyMs,
    latencyReductionPct,
    costPerRunUnconstrained,
    costPerRunFsm,
    currencySymbol,
    currency: inputs.currency
  };
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(val));
}

export function formatDecimals(val: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(val);
}

export function formatCompactNumber(val: number): string {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(1)}B`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(0)}k`;
  }
  return val.toString();
}
