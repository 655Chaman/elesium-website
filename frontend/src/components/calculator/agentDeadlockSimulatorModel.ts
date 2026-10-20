/**
 * agentDeadlockSimulatorModel.ts
 * ============================================================================
 * Mathematical and Operational Graph Simulation Engine for Enterprise
 * Multi-Agent Deadlock Detection, Directed Cycle Resolution, and
 * Deterministic Finite State Machine (FSM) Circuit Breaker Mechanics.
 * ============================================================================
 */

export type AgentNodeId = 'orchestrator' | 'retrieval' | 'code_exec' | 'verification' | 'erp_sync' | 'security_gate';

export type NodeStatus = 'IDLE' | 'EXECUTING' | 'BLOCKED_AWAITING' | 'DEADLOCKED' | 'CIRCUIT_TRIPPED' | 'FALLBACK_SERVED';

export type CircuitBreakerState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export type ScenarioPreset = 
  | 'cyclic_deadlock' 
  | 'rate_limit_thundering_herd' 
  | 'fsm_circuit_breaker_recovery' 
  | 'monotonic_dag_orchestration';

export interface AgentNode {
  id: AgentNodeId;
  label: string;
  role: string;
  status: NodeStatus;
  currentTurn: number;
  tokensConsumed: number;
  failureCount: number;
  consecutiveTimeouts: number;
  x: number; // For visual layout (percentage 0-100)
  y: number; // For visual layout (percentage 0-100)
}

export interface DependencyEdge {
  from: AgentNodeId;
  to: AgentNodeId;
  weight: number;
  isDeadlockedCycle: boolean;
  active: boolean;
}

export interface SimulationStepRecord {
  step: number;
  timestampMs: number;
  activeNodes: AgentNodeId[];
  deadlockedNodes: AgentNodeId[];
  circuitState: CircuitBreakerState;
  detectedCycle: AgentNodeId[] | null;
  tokensConsumedStep: number;
  cumulativeTokens: number;
  p99LatencyMs: number;
  logMessage: string;
}

export interface DeadlockSimulatorInputs {
  scenario: ScenarioPreset;
  agentCount: number; // 3 to 6 nodes
  upstreamErrorRate: number; // 0% to 100%
  circuitBreakerEnabled: boolean;
  failureThreshold: number; // 2 to 10 failures
  recoveryTimeoutMs: number; // 1,000 to 10,000 ms
  maxRetryAttempts: number; // 1 to 5
  baseBackoffMs: number; // 100 to 2,000 ms
  concurrencyLevel: number; // 1 to 16 concurrent requests
}

export interface DeadlockSimulatorOutputs {
  nodes: AgentNode[];
  edges: DependencyEdge[];
  hasDeadlock: boolean;
  deadlockCycle: AgentNodeId[];
  circuitBreakerState: CircuitBreakerState;
  activeFailures: number;
  wastedTokens: number;
  boundedFsmTokens: number;
  tokensSaved: number;
  tokenSavingsPercentage: number;
  unconstrainedP99Ms: number;
  fsmP99Ms: number;
  latencyImprovementPct: number;
  mttrSeconds: number | 'INFINITE_MANUAL_INTERVENTION';
  systemReliabilityScore: number; // 0 to 100
  history: SimulationStepRecord[];
}

/**
 * Standard node templates for multi-agent network
 */
export const AGENT_CATALOG: Record<AgentNodeId, Omit<AgentNode, 'status' | 'currentTurn' | 'tokensConsumed' | 'failureCount' | 'consecutiveTimeouts'>> = {
  orchestrator: {
    id: 'orchestrator',
    label: 'Root Orchestrator Agent',
    role: 'Decomposes intent & manages DAG state machine',
    x: 50,
    y: 12
  },
  retrieval: {
    id: 'retrieval',
    label: 'Context Retrieval & RAG Agent',
    role: 'Hybrid dense/sparse vector search & reranking',
    x: 20,
    y: 42
  },
  code_exec: {
    id: 'code_exec',
    label: 'Code Sandbox & Tool Exec Agent',
    role: 'Stateless Python/WASM sandbox execution',
    x: 80,
    y: 42
  },
  verification: {
    id: 'verification',
    label: 'Deterministic Audit & Schema Gate',
    role: 'Validates cryptographic state and JSON schemas',
    x: 25,
    y: 78
  },
  erp_sync: {
    id: 'erp_sync',
    label: 'Downstream ERP / Ledger Connector',
    role: 'Transactional write-ahead log & DB commit',
    x: 75,
    y: 78
  },
  security_gate: {
    id: 'security_gate',
    label: 'DPDP / Sovereign Compliance Guard',
    role: 'Local NER PII masking & sovereign VPC filter',
    x: 50,
    y: 92
  }
};

/**
 * Detects directed cycles in a multi-agent dependency graph using Depth-First Search (DFS).
 * Returns the exact cycle path if a deadlock exists, or null if the graph is a strict DAG.
 */
export function detectGraphCycle(
  nodeIds: AgentNodeId[], 
  edges: { from: AgentNodeId; to: AgentNodeId }[]
): AgentNodeId[] | null {
  const adj = new Map<AgentNodeId, AgentNodeId[]>();
  nodeIds.forEach(id => adj.set(id, []));
  edges.forEach(e => {
    if (adj.has(e.from)) {
      adj.get(e.from)!.push(e.to);
    }
  });

  const visited = new Set<AgentNodeId>();
  const recStack = new Set<AgentNodeId>();
  const parentMap = new Map<AgentNodeId, AgentNodeId>();
  let cycleNodes: AgentNodeId[] | null = null;

  function dfs(curr: AgentNodeId): boolean {
    visited.add(curr);
    recStack.add(curr);

    const neighbors = adj.get(curr) || [];
    for (const next of neighbors) {
      if (!visited.has(next)) {
        parentMap.set(next, curr);
        if (dfs(next)) return true;
      } else if (recStack.has(next)) {
        // Cycle detected: backtrack path
        const path: AgentNodeId[] = [next];
        let p = curr;
        while (p !== next && p) {
          path.push(p);
          p = parentMap.get(p)!;
        }
        path.push(next);
        cycleNodes = path.reverse();
        return true;
      }
    }

    recStack.delete(curr);
    return false;
  }

  for (const node of nodeIds) {
    if (!visited.has(node)) {
      if (dfs(node)) break;
    }
  }

  return cycleNodes;
}

/**
 * Calculates exponential backoff with Full Jitter:
 * t_sleep = min(t_max, t_base * 2^attempt) * random_uniform(0, 1)
 */
export function calculateBackoffJitter(
  attempt: number, 
  baseMs: number, 
  maxMs: number = 10000,
  randomSeed: number = 0.5
): number {
  const exponential = Math.min(maxMs, baseMs * Math.pow(2, attempt));
  return Math.round(exponential * randomSeed);
}

/**
 * Runs the deterministic multi-agent simulation model.
 */
export function runAgentDeadlockSimulation(inputs: DeadlockSimulatorInputs): DeadlockSimulatorOutputs {
  const activeNodeIds: AgentNodeId[] = (['orchestrator', 'retrieval', 'code_exec', 'verification', 'erp_sync', 'security_gate'] as AgentNodeId[]).slice(0, inputs.agentCount);

  // Initialize nodes
  const nodes: AgentNode[] = activeNodeIds.map(id => {
    const meta = AGENT_CATALOG[id];
    return {
      id,
      label: meta.label,
      role: meta.role,
      x: meta.x,
      y: meta.y,
      status: 'IDLE',
      currentTurn: 0,
      tokensConsumed: 0,
      failureCount: 0,
      consecutiveTimeouts: 0
    };
  });

  // Build topology edges based on scenario
  let rawEdges: { from: AgentNodeId; to: AgentNodeId }[] = [];

  if (inputs.scenario === 'cyclic_deadlock') {
    // Classic resource deadlock: Orchestrator -> Retrieval -> Code Exec -> Orchestrator
    rawEdges = [
      { from: 'orchestrator', to: 'retrieval' },
      { from: 'retrieval', to: 'code_exec' },
      { from: 'code_exec', to: 'orchestrator' } // Creates cyclic dependency
    ];
    if (inputs.agentCount >= 4) rawEdges.push({ from: 'code_exec', to: 'verification' });
    if (inputs.agentCount >= 5) rawEdges.push({ from: 'verification', to: 'erp_sync' });
    if (inputs.agentCount >= 6) rawEdges.push({ from: 'erp_sync', to: 'retrieval' }); // Secondary cycle
  } else if (inputs.scenario === 'rate_limit_thundering_herd') {
    // Hub and spoke all hitting code_exec / erp_sync simultaneously
    rawEdges = [
      { from: 'orchestrator', to: 'retrieval' },
      { from: 'orchestrator', to: 'code_exec' },
      { from: 'retrieval', to: 'erp_sync' },
      { from: 'code_exec', to: 'erp_sync' }
    ];
  } else if (inputs.scenario === 'fsm_circuit_breaker_recovery') {
    // Linear pipeline protected by circuit breaker
    rawEdges = [
      { from: 'orchestrator', to: 'retrieval' },
      { from: 'retrieval', to: 'code_exec' },
      { from: 'code_exec', to: 'verification' }
    ];
    if (inputs.agentCount >= 5) rawEdges.push({ from: 'verification', to: 'erp_sync' });
  } else {
    // monotonic_dag_orchestration: Strict topological DAG
    rawEdges = [
      { from: 'orchestrator', to: 'retrieval' },
      { from: 'orchestrator', to: 'code_exec' },
      { from: 'retrieval', to: 'verification' },
      { from: 'code_exec', to: 'verification' }
    ];
    if (inputs.agentCount >= 5) rawEdges.push({ from: 'verification', to: 'erp_sync' });
    if (inputs.agentCount >= 6) rawEdges.push({ from: 'verification', to: 'security_gate' });
  }

  // Filter edges to only include active nodes
  rawEdges = rawEdges.filter(e => activeNodeIds.includes(e.from) && activeNodeIds.includes(e.to));

  // Detect Deadlock Cycle
  const cycle = detectGraphCycle(activeNodeIds, rawEdges);
  const hasDeadlock = cycle !== null && cycle.length > 0;

  // Determine Circuit Breaker State
  let circuitBreakerState: CircuitBreakerState = 'CLOSED';
  const effectiveFailures = Math.round((inputs.upstreamErrorRate / 100) * 12);

  if (inputs.circuitBreakerEnabled) {
    if (effectiveFailures >= inputs.failureThreshold) {
      circuitBreakerState = inputs.upstreamErrorRate > 80 ? 'OPEN' : 'HALF_OPEN';
    } else {
      circuitBreakerState = 'CLOSED';
    }
  } else {
    circuitBreakerState = 'CLOSED'; // Without breaker, system stays open to failures
  }

  // Assign node statuses
  nodes.forEach(node => {
    if (hasDeadlock && cycle.includes(node.id)) {
      node.status = 'DEADLOCKED';
      node.failureCount = 6;
      node.consecutiveTimeouts = 5;
      node.tokensConsumed = 38400; // Runaway recursive polling tokens
    } else if (circuitBreakerState === 'OPEN' && (node.id === 'code_exec' || node.id === 'erp_sync')) {
      node.status = 'CIRCUIT_TRIPPED';
      node.tokensConsumed = 450; // Bound to deterministic fallback
    } else if (circuitBreakerState === 'HALF_OPEN' && (node.id === 'code_exec' || node.id === 'erp_sync')) {
      node.status = 'FALLBACK_SERVED';
      node.tokensConsumed = 1200;
    } else if (inputs.upstreamErrorRate > 40 && (node.id === 'code_exec' || node.id === 'erp_sync')) {
      node.status = 'BLOCKED_AWAITING';
      node.tokensConsumed = 14500;
    } else {
      node.status = 'EXECUTING';
      node.tokensConsumed = 2400;
    }
  });

  // Build edges with cycle annotation
  const edges: DependencyEdge[] = rawEdges.map(e => {
    let inCycle = false;
    if (cycle) {
      for (let i = 0; i < cycle.length - 1; i++) {
        if (cycle[i] === e.from && cycle[i + 1] === e.to) {
          inCycle = true;
          break;
        }
      }
    }
    return {
      from: e.from,
      to: e.to,
      weight: 1,
      isDeadlockedCycle: inCycle,
      active: true
    };
  });

  // Compute Token Burn & Latencies
  const baseTokensPerRun = activeNodeIds.length * 3500;
  let wastedTokens = 0;
  let boundedFsmTokens = baseTokensPerRun;

  if (hasDeadlock) {
    // Unconstrained retry loops spin until token context window crashes
    wastedTokens = Math.round(baseTokensPerRun * (3.8 + (inputs.concurrencyLevel * 0.4)));
    boundedFsmTokens = Math.round(baseTokensPerRun * 1.15); // FSM trips at 3 retries, zero runaway
  } else if (inputs.upstreamErrorRate > 25) {
    if (inputs.circuitBreakerEnabled) {
      wastedTokens = Math.round(baseTokensPerRun * (inputs.upstreamErrorRate / 100) * 0.8);
      boundedFsmTokens = Math.round(baseTokensPerRun * 1.05);
    } else {
      wastedTokens = Math.round(baseTokensPerRun * (inputs.upstreamErrorRate / 100) * 4.2);
      boundedFsmTokens = Math.round(baseTokensPerRun * 1.08);
    }
  } else {
    wastedTokens = Math.round(baseTokensPerRun * 0.08);
    boundedFsmTokens = Math.round(baseTokensPerRun * 0.98);
  }

  const tokensSaved = Math.max(0, wastedTokens - (boundedFsmTokens - baseTokensPerRun));
  const tokenSavingsPercentage = wastedTokens > 0 ? Math.min(96.8, Math.round((tokensSaved / (wastedTokens + baseTokensPerRun)) * 1000) / 10) : 0;

  // Latency metrics (P99)
  let unconstrainedP99Ms = 0;
  let fsmP99Ms = 0;

  if (hasDeadlock) {
    unconstrainedP99Ms = 30000; // 30s timeout or indefinite hang
    fsmP99Ms = 45; // Circuit breaker trips in 45ms and serves cached fallback
  } else if (inputs.upstreamErrorRate > 50) {
    unconstrainedP99Ms = Math.round(inputs.baseBackoffMs * Math.pow(2, inputs.maxRetryAttempts));
    fsmP99Ms = inputs.circuitBreakerEnabled ? 35 : Math.round(inputs.baseBackoffMs * 2.2);
  } else {
    unconstrainedP99Ms = 3200;
    fsmP99Ms = 2800;
  }

  const latencyImprovementPct = Math.round(((unconstrainedP99Ms - fsmP99Ms) / unconstrainedP99Ms) * 100);

  // Mean Time to Recovery
  const mttrSeconds = hasDeadlock 
    ? 'INFINITE_MANUAL_INTERVENTION' 
    : inputs.circuitBreakerEnabled 
      ? Math.round(inputs.recoveryTimeoutMs / 1000) 
      : Math.round((inputs.recoveryTimeoutMs * 4) / 1000);

  // System Reliability Score (0-100)
  let reliability = 98;
  if (hasDeadlock) reliability -= 75;
  if (inputs.upstreamErrorRate > 30) reliability -= Math.round(inputs.upstreamErrorRate * 0.4);
  if (inputs.circuitBreakerEnabled) reliability += 22;
  reliability = Math.max(8, Math.min(99, reliability));

  // Build 5-step simulation history
  const history: SimulationStepRecord[] = [
    {
      step: 1,
      timestampMs: 0,
      activeNodes: ['orchestrator'],
      deadlockedNodes: [],
      circuitState: 'CLOSED',
      detectedCycle: null,
      tokensConsumedStep: 1200,
      cumulativeTokens: 1200,
      p99LatencyMs: 380,
      logMessage: 'Root Orchestrator dispatches sub-tasks to downstream agents.'
    },
    {
      step: 2,
      timestampMs: 420,
      activeNodes: ['retrieval', 'code_exec'],
      deadlockedNodes: [],
      circuitState: 'CLOSED',
      detectedCycle: null,
      tokensConsumedStep: 4800,
      cumulativeTokens: 6000,
      p99LatencyMs: 890,
      logMessage: 'Retrieval & Sandbox agents invoke asynchronous tool execution.'
    },
    {
      step: 3,
      timestampMs: 1250,
      activeNodes: hasDeadlock ? ['retrieval', 'code_exec', 'orchestrator'] : ['verification'],
      deadlockedNodes: hasDeadlock ? (cycle || []) : [],
      circuitState: circuitBreakerState,
      detectedCycle: cycle,
      tokensConsumedStep: hasDeadlock ? 14200 : 2100,
      cumulativeTokens: hasDeadlock ? 20200 : 8100,
      p99LatencyMs: hasDeadlock ? 15200 : 1240,
      logMessage: hasDeadlock 
        ? `DEADLOCK DETECTED: Directed cycle formed between [${(cycle || []).join(' -> ')}]. Mutual wait-for condition.`
        : 'Topological DAG validated: All dependencies resolved with zero cyclic blocks.'
    },
    {
      step: 4,
      timestampMs: 2800,
      activeNodes: circuitBreakerState === 'OPEN' ? ['orchestrator'] : ['erp_sync'],
      deadlockedNodes: hasDeadlock ? (cycle || []) : [],
      circuitState: circuitBreakerState,
      detectedCycle: cycle,
      tokensConsumedStep: circuitBreakerState === 'OPEN' ? 250 : 3800,
      cumulativeTokens: circuitBreakerState === 'OPEN' ? 20450 : 11900,
      p99LatencyMs: circuitBreakerState === 'OPEN' ? 38 : 2400,
      logMessage: circuitBreakerState === 'OPEN'
        ? `CIRCUIT BREAKER OPEN: Tripped after ${effectiveFailures} failures. Fast-failing in 38ms with cached heuristic.`
        : 'Transactional write-ahead log committed downstream.'
    },
    {
      step: 5,
      timestampMs: 5000,
      activeNodes: ['orchestrator'],
      deadlockedNodes: hasDeadlock ? (cycle || []) : [],
      circuitState: circuitBreakerState === 'OPEN' ? 'HALF_OPEN' : 'CLOSED',
      detectedCycle: cycle,
      tokensConsumedStep: 800,
      cumulativeTokens: hasDeadlock ? 38400 : 12700,
      p99LatencyMs: hasDeadlock ? 30000 : 450,
      logMessage: hasDeadlock
        ? 'CRITICAL ALERT: Agent loop halted due to unhandled circular wait. Process killed by timeout monitor.'
        : 'Execution complete. State machine safely settled into terminal state.'
    }
  ];

  return {
    nodes,
    edges,
    hasDeadlock,
    deadlockCycle: cycle || [],
    circuitBreakerState,
    activeFailures: effectiveFailures,
    wastedTokens,
    boundedFsmTokens,
    tokensSaved,
    tokenSavingsPercentage,
    unconstrainedP99Ms,
    fsmP99Ms,
    latencyImprovementPct,
    mttrSeconds,
    systemReliabilityScore: reliability,
    history
  };
}
