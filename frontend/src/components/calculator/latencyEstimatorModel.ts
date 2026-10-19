/**
 * latencyEstimatorModel.ts
 * ============================================================================
 * Mathematical Engine for Deterministic Multi-Agent Latency & Token Cost Estimator.
 * 
 * Accurately models:
 * 1. Multi-Agent DAG Topology Latency (Sequential, Hierarchical, Map-Reduce, State Machine)
 * 2. TTFT (Time To First Token), Token Generation Speed (tokens/sec), and Network RTT
 * 3. Token Billing (Input vs Output) across OpenAI GPT-4o, Anthropic Claude 3.5 Sonnet, 
 *    Google Gemini 1.5 Pro, and GPT-4o-mini
 * 4. Sovereign Private VPC Infrastructure (NVIDIA A100, H100, H200 vLLM/TensorRT-LLM)
 * 5. Breakeven Volume Crossover, P50/P99 Jitter, and Tail Latency SLA Modeling.
 * ============================================================================
 */

export type TopologyKey = 'sequential' | 'hierarchical' | 'map_reduce' | 'state_machine';
export type PublicModelKey = 'gpt-4o' | 'claude-3-5-sonnet' | 'gemini-1-5-pro' | 'gpt-4o-mini';
export type PrivateClusterKey = 'a100-dual' | 'h100-quad' | 'h200-octa';
export type Currency = 'USD' | 'INR';

export interface PublicModelConfig {
  id: PublicModelKey;
  name: string;
  provider: string;
  inputPricePerMTokUSD: number;
  outputPricePerMTokUSD: number;
  ttftMs: number;
  tokensPerSec: number;
  networkRttMs: number;
  p99JitterMultiplier: number;
  contextWindow: number;
}

export interface PrivateClusterConfig {
  id: PrivateClusterKey;
  name: string;
  hardware: string;
  vllmEngine: string;
  monthlyLeaseUSD: number;
  ttftMs: number;
  tokensPerSec: number;
  networkRttMs: number;
  p99JitterMultiplier: number;
  maxConcurrentThroughputTokSec: number;
}

export interface TopologyConfig {
  id: TopologyKey;
  name: string;
  description: string;
  parallelFactor: number; // Fraction of steps executed in parallel
  orchestrationOverheadMs: number;
  tokenAccumulationFactor: number; // State context growth across nodes
}

export interface EstimatorInputs {
  topology: TopologyKey;
  nodeCount: number;
  monthlyRuns: number;
  inputTokensPerNode: number;
  outputTokensPerNode: number;
  publicModel: PublicModelKey;
  privateCluster: PrivateClusterKey;
  currency: Currency;
}

export interface EstimatorResults {
  // Latency Metrics
  publicP50LatencyMs: number;
  publicP99LatencyMs: number;
  privateP50LatencyMs: number;
  privateP99LatencyMs: number;
  latencyDeltaMs: number;
  latencyImprovementPct: number;

  // Monthly Token Volumes
  totalMonthlyInputTokens: number;
  totalMonthlyOutputTokens: number;
  totalMonthlyTokens: number;

  // Cost Metrics
  publicMonthlyCost: number;
  privateMonthlyCost: number;
  netMonthlySavings: number;
  netAnnualSavings: number;
  savingsPct: number;

  // Efficiency & Breakeven
  breakevenRunsPerMonth: number;
  isBreakevenReached: boolean;
  effectiveCostPerRunPublic: number;
  effectiveCostPerRunPrivate: number;
  currencySymbol: string;
}

export const USD_TO_INR_RATE = 87.5; // Commercial enterprise benchmark exchange rate

export const TOPOLOGIES: Record<TopologyKey, TopologyConfig> = {
  sequential: {
    id: 'sequential',
    name: 'Sequential Chain (Linear Pipeline)',
    description: 'Each agent executes in strict series. Full state accumulates from node to node.',
    parallelFactor: 0.0,
    orchestrationOverheadMs: 15,
    tokenAccumulationFactor: 1.35
  },
  hierarchical: {
    id: 'hierarchical',
    name: 'Hierarchical Supervisor-Worker',
    description: 'Central supervisor dispatches sub-tasks to parallel specialist agents and synthesizes output.',
    parallelFactor: 0.70,
    orchestrationOverheadMs: 45,
    tokenAccumulationFactor: 1.15
  },
  map_reduce: {
    id: 'map_reduce',
    name: 'Parallel Map-Reduce DAG',
    description: 'High-fanout parallel processing across partitioned data chunks with deterministic reducer.',
    parallelFactor: 0.85,
    orchestrationOverheadMs: 30,
    tokenAccumulationFactor: 1.05
  },
  state_machine: {
    id: 'state_machine',
    name: 'Deterministic LangGraph State Machine',
    description: 'Cyclic graph with deterministic state transitions, validation gates, and automatic retry rollbacks.',
    parallelFactor: 0.40,
    orchestrationOverheadMs: 25,
    tokenAccumulationFactor: 1.20
  }
};

export const PUBLIC_MODELS: Record<PublicModelKey, PublicModelConfig> = {
  'gpt-4o': {
    id: 'gpt-4o',
    name: 'OpenAI GPT-4o (Omni)',
    provider: 'OpenAI Cloud API',
    inputPricePerMTokUSD: 2.50,
    outputPricePerMTokUSD: 10.00,
    ttftMs: 340,
    tokensPerSec: 75,
    networkRttMs: 85,
    p99JitterMultiplier: 1.48,
    contextWindow: 128000
  },
  'claude-3-5-sonnet': {
    id: 'claude-3-5-sonnet',
    name: 'Anthropic Claude 3.5 Sonnet',
    provider: 'Anthropic API',
    inputPricePerMTokUSD: 3.00,
    outputPricePerMTokUSD: 15.00,
    ttftMs: 410,
    tokensPerSec: 70,
    networkRttMs: 95,
    p99JitterMultiplier: 1.55,
    contextWindow: 200000
  },
  'gemini-1-5-pro': {
    id: 'gemini-1-5-pro',
    name: 'Google Gemini 1.5 Pro',
    provider: 'Google Vertex AI',
    inputPricePerMTokUSD: 1.25,
    outputPricePerMTokUSD: 5.00,
    ttftMs: 380,
    tokensPerSec: 65,
    networkRttMs: 80,
    p99JitterMultiplier: 1.42,
    contextWindow: 2000000
  },
  'gpt-4o-mini': {
    id: 'gpt-4o-mini',
    name: 'OpenAI GPT-4o mini',
    provider: 'OpenAI Cloud API',
    inputPricePerMTokUSD: 0.15,
    outputPricePerMTokUSD: 0.60,
    ttftMs: 190,
    tokensPerSec: 110,
    networkRttMs: 75,
    p99JitterMultiplier: 1.35,
    contextWindow: 128000
  }
};

export const PRIVATE_CLUSTERS: Record<PrivateClusterKey, PrivateClusterConfig> = {
  'a100-dual': {
    id: 'a100-dual',
    name: '2x NVIDIA A100-SXM4 (80GB)',
    hardware: 'Llama-3.3-70B FP8 TensorRT-LLM',
    vllmEngine: 'vLLM Continuous Batching v0.6',
    monthlyLeaseUSD: 3200,
    ttftMs: 42,
    tokensPerSec: 140,
    networkRttMs: 4, // Colocated in private VPC
    p99JitterMultiplier: 1.12,
    maxConcurrentThroughputTokSec: 2800
  },
  'h100-quad': {
    id: 'h100-quad',
    name: '4x NVIDIA H100-SXM5 (80GB)',
    hardware: 'DeepSeek-V3 / Qwen-2.5-72B FP8',
    vllmEngine: 'TensorRT-LLM v0.12 In-Flight Batching',
    monthlyLeaseUSD: 7800,
    ttftMs: 24,
    tokensPerSec: 220,
    networkRttMs: 2, // Air-gapped VPC interconnect
    p99JitterMultiplier: 1.08,
    maxConcurrentThroughputTokSec: 8800
  },
  'h200-octa': {
    id: 'h200-octa',
    name: '8x NVIDIA H200-SXM5 (141GB)',
    hardware: 'Full-Precision MoE Enterprise Sovereign Cluster',
    vllmEngine: 'vLLM PagedAttention v2 + NVLink 900 GB/s',
    monthlyLeaseUSD: 16500,
    ttftMs: 16,
    tokensPerSec: 320,
    networkRttMs: 1.5,
    p99JitterMultiplier: 1.05,
    maxConcurrentThroughputTokSec: 24000
  }
};

export function calculateMultiAgentEstimates(inputs: EstimatorInputs): EstimatorResults {
  const topo = TOPOLOGIES[inputs.topology];
  const pub = PUBLIC_MODELS[inputs.publicModel];
  const priv = PRIVATE_CLUSTERS[inputs.privateCluster];

  // Tool execution overhead per node (stateless function execution, DB lookup)
  const TOOL_EXEC_OVERHEAD_MS = 60;

  // Effective nodes taking time considering parallelization factor
  // In sequential: effectiveNodes = nodeCount
  // In parallel map-reduce: effectiveNodes = 1 + (nodeCount - 1) * (1 - parallelFactor)
  const effectiveSequentialNodes = 1 + (inputs.nodeCount - 1) * (1 - topo.parallelFactor);

  // 1. Single Node Latency Calculations
  // Public step latency
  const pubGenTimeMs = (inputs.outputTokensPerNode / pub.tokensPerSec) * 1000;
  const pubSingleStepMs = pub.ttftMs + pubGenTimeMs + pub.networkRttMs + TOOL_EXEC_OVERHEAD_MS;

  // Private step latency
  const privGenTimeMs = (inputs.outputTokensPerNode / priv.tokensPerSec) * 1000;
  const privSingleStepMs = priv.ttftMs + privGenTimeMs + priv.networkRttMs + TOOL_EXEC_OVERHEAD_MS;

  // Total Task Latency (P50)
  const publicP50LatencyMs = Math.round(
    (pubSingleStepMs * effectiveSequentialNodes) + topo.orchestrationOverheadMs
  );
  const privateP50LatencyMs = Math.round(
    (privSingleStepMs * effectiveSequentialNodes) + (topo.orchestrationOverheadMs * 0.4)
  );

  // P99 Tail Latency (Cloud has higher tail latency due to network hops & multi-tenant jitter)
  const publicP99LatencyMs = Math.round(publicP50LatencyMs * pub.p99JitterMultiplier);
  const privateP99LatencyMs = Math.round(privateP50LatencyMs * priv.p99JitterMultiplier);

  const latencyDeltaMs = publicP50LatencyMs - privateP50LatencyMs;
  const latencyImprovementPct = Math.round((latencyDeltaMs / publicP50LatencyMs) * 100);

  // 2. Token Volume Calculations
  // State accumulation means downstream nodes receive accumulated conversation context
  const effectiveInputTokensPerNode = inputs.inputTokensPerNode * topo.tokenAccumulationFactor;
  const totalMonthlyInputTokens = Math.round(
    inputs.monthlyRuns * inputs.nodeCount * effectiveInputTokensPerNode
  );
  const totalMonthlyOutputTokens = Math.round(
    inputs.monthlyRuns * inputs.nodeCount * inputs.outputTokensPerNode
  );
  const totalMonthlyTokens = totalMonthlyInputTokens + totalMonthlyOutputTokens;

  // 3. Cost Calculations (USD Base)
  const pubInputCostUSD = (totalMonthlyInputTokens / 1_000_000) * pub.inputPricePerMTokUSD;
  const pubOutputCostUSD = (totalMonthlyOutputTokens / 1_000_000) * pub.outputPricePerMTokUSD;
  const publicMonthlyCostUSD = pubInputCostUSD + pubOutputCostUSD;

  // Private cluster has fixed monthly lease + marginal electricity/egress (~$0.00004 per task run)
  const privMarginalTaskCostUSD = inputs.monthlyRuns * 0.00004;
  const privateMonthlyCostUSD = priv.monthlyLeaseUSD + privMarginalTaskCostUSD;

  // Convert to target currency
  const currencyMult = inputs.currency === 'INR' ? USD_TO_INR_RATE : 1;
  const publicMonthlyCost = Math.round(publicMonthlyCostUSD * currencyMult);
  const privateMonthlyCost = Math.round(privateMonthlyCostUSD * currencyMult);

  const netMonthlySavings = publicMonthlyCost - privateMonthlyCost;
  const netAnnualSavings = netMonthlySavings * 12;
  const savingsPct = publicMonthlyCost > 0
    ? Math.round(((publicMonthlyCost - privateMonthlyCost) / publicMonthlyCost) * 100)
    : 0;

  // 4. Breakeven Volume Calculation
  // Monthly runs where Public API Cost = Private Cluster Lease
  const costPerRunPublicUSD = (publicMonthlyCostUSD / (inputs.monthlyRuns || 1));
  const breakevenRunsPerMonth = costPerRunPublicUSD > 0
    ? Math.ceil(priv.monthlyLeaseUSD / costPerRunPublicUSD)
    : 100000;
  const isBreakevenReached = inputs.monthlyRuns >= breakevenRunsPerMonth;

  const effectiveCostPerRunPublic = Number((publicMonthlyCost / (inputs.monthlyRuns || 1)).toFixed(2));
  const effectiveCostPerRunPrivate = Number((privateMonthlyCost / (inputs.monthlyRuns || 1)).toFixed(2));
  const currencySymbol = inputs.currency === 'INR' ? '₹' : '$';

  return {
    publicP50LatencyMs,
    publicP99LatencyMs,
    privateP50LatencyMs,
    privateP99LatencyMs,
    latencyDeltaMs,
    latencyImprovementPct,
    totalMonthlyInputTokens,
    totalMonthlyOutputTokens,
    totalMonthlyTokens,
    publicMonthlyCost,
    privateMonthlyCost,
    netMonthlySavings,
    netAnnualSavings,
    savingsPct,
    breakevenRunsPerMonth,
    isBreakevenReached,
    effectiveCostPerRunPublic,
    effectiveCostPerRunPrivate,
    currencySymbol
  };
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}
