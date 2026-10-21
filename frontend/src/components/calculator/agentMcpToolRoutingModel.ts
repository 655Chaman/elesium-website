export type ToolSelectionStrategy = 
  | 'semantic_embedding_rerank' 
  | 'trie_prefix_indexing' 
  | 'naive_function_dump' 
  | 'bm25_hybrid_filter';

export type PruningAggressiveness = 
  | 'conservative' 
  | 'balanced' 
  | 'ultra_pruned';

export interface McpToolRoutingInputs {
  mcpServerCount: number; // 1 to 20 servers
  registeredToolsCount: number; // 5 to 300 tools
  contextWindowTokens: number; // 4096 to 131072 tokens
  toolSelectionStrategy: ToolSelectionStrategy;
  pruningAggressiveness: PruningAggressiveness;
  concurrencyOpsPerSec: number; // 5 to 500 ops/s
  currency: 'INR' | 'USD';
}

export interface McpLatencyPoint {
  activeTools: number;
  latencyMs: number;
}

export interface McpToolRoutingOutputs {
  toolDiscoveryLatencyMs: number;
  contextTokensSavedPerCall: number;
  effectiveP99LatencyMs: number;
  toolSelectionAccuracyPct: number;
  vramMemoryFreedMb: number;
  annualMcpComputeSavings: number;
  annualInfrastructureSpend: number;
  statusClassification: 'OPTIMIZED_DYNAMIC_MCP' | 'CONTEXT_SATURATED' | 'LATENCY_DEGRADED' | 'PROMPT_OOM_BREACH';
  recommendationNote: string;
  latencyTrace: McpLatencyPoint[];
}

export function calculateMcpToolRouting(inputs: McpToolRoutingInputs): McpToolRoutingOutputs {
  const {
    mcpServerCount,
    registeredToolsCount,
    contextWindowTokens,
    toolSelectionStrategy,
    pruningAggressiveness,
    concurrencyOpsPerSec,
    currency
  } = inputs;

  // Average schema token footprint per tool JSON definition
  const averageTokensPerToolSchema = 280;
  const rawToolTokens = registeredToolsCount * averageTokensPerToolSchema;

  // Pruning retention ratios
  let pruneRetention = 1.0;
  if (pruningAggressiveness === 'conservative') pruneRetention = 0.40;
  if (pruningAggressiveness === 'balanced') pruneRetention = 0.18;
  if (pruningAggressiveness === 'ultra_pruned') pruneRetention = 0.08;

  // If strategy is naive, all tool definitions are dumped into context
  let prunedToolTokens = rawToolTokens;
  if (toolSelectionStrategy !== 'naive_function_dump') {
    prunedToolTokens = Math.max(1, Math.round(rawToolTokens * pruneRetention));
  }

  const contextTokensSavedPerCall = Math.max(0, rawToolTokens - prunedToolTokens);

  // Tool discovery latency base calculation (ms)
  let strategyMultiplier = 1.0;
  let baseDiscoveryMs = 12.0;
  let accuracyBase = 98.5;

  switch (toolSelectionStrategy) {
    case 'semantic_embedding_rerank':
      strategyMultiplier = 0.65;
      baseDiscoveryMs = 18.0;
      accuracyBase = 99.2;
      break;
    case 'trie_prefix_indexing':
      strategyMultiplier = 0.35;
      baseDiscoveryMs = 8.5;
      accuracyBase = 98.8;
      break;
    case 'bm25_hybrid_filter':
      strategyMultiplier = 0.50;
      baseDiscoveryMs = 14.0;
      accuracyBase = 97.9;
      break;
    case 'naive_function_dump':
      strategyMultiplier = 2.4;
      baseDiscoveryMs = 45.0;
      accuracyBase = 91.2;
      break;
  }

  const serverOverheadMs = (mcpServerCount - 1) * 2.2;
  const toolScaleOverheadMs = Math.log2(Math.max(2, registeredToolsCount)) * 3.5 * strategyMultiplier;
  const toolDiscoveryLatencyMs = Number((baseDiscoveryMs + serverOverheadMs + toolScaleOverheadMs).toFixed(1));

  // Effective P99 Latency (ms): Discovery + LLM prefill of surviving tokens
  const prefillTimePer1kTokensMs = 16.0;
  const prefillLatencyMs = (prunedToolTokens / 1000) * prefillTimePer1kTokensMs;
  const effectiveP99LatencyMs = Number((toolDiscoveryLatencyMs + prefillLatencyMs + (concurrencyOpsPerSec * 0.12)).toFixed(1));

  // Tool selection accuracy degrades if naive dump confuses LLM or ultra pruned cuts too much
  let toolSelectionAccuracyPct = accuracyBase;
  if (toolSelectionStrategy === 'naive_function_dump' && registeredToolsCount > 50) {
    toolSelectionAccuracyPct = Math.max(72.0, 91.2 - ((registeredToolsCount - 50) * 0.18));
  } else if (pruningAggressiveness === 'ultra_pruned' && registeredToolsCount > 100) {
    toolSelectionAccuracyPct = Math.max(88.0, accuracyBase - 4.5);
  }
  toolSelectionAccuracyPct = Number(toolSelectionAccuracyPct.toFixed(1));

  // VRAM freed per concurrent stream (FP16 KV cache: 2 bytes * 2 * layers * hidden) ~ 0.5MB per 1k tokens
  const kvCacheMbPer1kTokens = 0.65;
  const vramMemoryFreedMb = Number(((contextTokensSavedPerCall / 1000) * kvCacheMbPer1kTokens * concurrencyOpsPerSec).toFixed(1));

  // Economic calculations
  const tokenCostPer1MTokensUsd = 2.50;
  const callsPerYear = concurrencyOpsPerSec * 3600 * 12 * 260; // 12 hours/day, 260 workdays
  const totalTokensSavedYear = (callsPerYear * contextTokensSavedPerCall);
  const annualSavingsUsd = (totalTokensSavedYear / 1000000) * tokenCostPer1MTokensUsd;
  const annualSpendUsd = ((callsPerYear * prunedToolTokens) / 1000000) * tokenCostPer1MTokensUsd + (mcpServerCount * 1200);

  const fxRate = 87.5; // INR per USD
  const annualMcpComputeSavings = currency === 'INR' ? Math.round(annualSavingsUsd * fxRate) : Math.round(annualSavingsUsd);
  const annualInfrastructureSpend = currency === 'INR' ? Math.round(annualSpendUsd * fxRate) : Math.round(annualSpendUsd);

  // Status classification
  let statusClassification: McpToolRoutingOutputs['statusClassification'] = 'OPTIMIZED_DYNAMIC_MCP';
  let recommendationNote = 'Architecture is operating at peak efficiency with sub-40ms tool routing and low context overhead.';

  const tokenContextLoadPct = (rawToolTokens / contextWindowTokens) * 100;

  if (toolSelectionStrategy === 'naive_function_dump' && rawToolTokens > 16000) {
    statusClassification = 'PROMPT_OOM_BREACH';
    recommendationNote = 'CRITICAL: Naive JSON schema dumps are exceeding safe prompt token thresholds, degrading accuracy and triggering token latency spikes.';
  } else if (effectiveP99LatencyMs > 250) {
    statusClassification = 'LATENCY_DEGRADED';
    recommendationNote = 'WARNING: Multi-server fan-out and unpruned tool schemas are degrading P99 interaction latency beyond enterprise conversational thresholds.';
  } else if (tokenContextLoadPct > 35) {
    statusClassification = 'CONTEXT_SATURATED';
    recommendationNote = 'ADVISORY: Tool schemas consume over 35% of total context window. Implement semantic embedding reranking to restore memory margins.';
  }

  // 20-Point Latency Trace across increasing tool count (5 to 300)
  const latencyTrace: McpLatencyPoint[] = [];
  for (let i = 1; i <= 20; i++) {
    const activeTools = Math.round((i / 20) * registeredToolsCount);
    let tracePointMs = baseDiscoveryMs + serverOverheadMs + (Math.log2(Math.max(2, activeTools)) * 3.5 * strategyMultiplier);
    if (toolSelectionStrategy === 'naive_function_dump') {
      tracePointMs += (activeTools * averageTokensPerToolSchema / 1000) * prefillTimePer1kTokensMs;
    } else {
      tracePointMs += (Math.max(1, activeTools * pruneRetention) * averageTokensPerToolSchema / 1000) * prefillTimePer1kTokensMs;
    }
    latencyTrace.push({
      activeTools,
      latencyMs: Number(tracePointMs.toFixed(1))
    });
  }

  return {
    toolDiscoveryLatencyMs,
    contextTokensSavedPerCall,
    effectiveP99LatencyMs,
    toolSelectionAccuracyPct,
    vramMemoryFreedMb,
    annualMcpComputeSavings,
    annualInfrastructureSpend,
    statusClassification,
    recommendationNote,
    latencyTrace
  };
}
