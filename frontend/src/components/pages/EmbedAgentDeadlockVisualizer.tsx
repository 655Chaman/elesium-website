import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Network,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
  Lock,
  Zap,
  Flame,
  GitBranch
} from 'lucide-react';
import {
  runAgentDeadlockSimulation,
  DeadlockSimulatorInputs,
  ScenarioPreset,
  CircuitBreakerState
} from '../calculator/agentDeadlockSimulatorModel';

export default function EmbedAgentDeadlockVisualizer() {
  const [scenario, setScenario] = useState<ScenarioPreset>('cyclic_deadlock');
  const [agentCount] = useState<number>(4);
  const [upstreamErrorRate, setUpstreamErrorRate] = useState<number>(65);
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = useState<boolean>(false);
  const [failureThreshold] = useState<number>(4);
  const [recoveryTimeoutMs] = useState<number>(5000);
  const [maxRetryAttempts] = useState<number>(3);
  const [baseBackoffMs] = useState<number>(500);
  const [concurrencyLevel] = useState<number>(8);

  const inputs: DeadlockSimulatorInputs = useMemo(() => ({
    scenario,
    agentCount,
    upstreamErrorRate,
    circuitBreakerEnabled,
    failureThreshold,
    recoveryTimeoutMs,
    maxRetryAttempts,
    baseBackoffMs,
    concurrencyLevel
  }), [
    scenario,
    agentCount,
    upstreamErrorRate,
    circuitBreakerEnabled,
    failureThreshold,
    recoveryTimeoutMs,
    maxRetryAttempts,
    baseBackoffMs,
    concurrencyLevel
  ]);

  const results = useMemo(() => {
    return runAgentDeadlockSimulation(inputs);
  }, [inputs]);

  const getCircuitBadge = (state: CircuitBreakerState) => {
    switch (state) {
      case 'OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-white border border-white/30">OPEN</span>;
      case 'HALF_OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">HALF_OPEN</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/10 text-white border border-white/30">CLOSED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 p-4 font-sans antialiased flex flex-col justify-between">
      <Helmet>
        <title>Multi-Agent Deadlock &amp; FSM Circuit Breaker Sandbox | Elesium</title>
        <meta
          name="description"
          content="Interactive widget simulating multi-agent circular wait deadlocks, exponential backoff with full jitter, and deterministic FSM circuit breaker fallbacks."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-deadlock-visualizer" />
      </Helmet>

      {/* Header Bar */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-white" />
            <h1 className="text-sm font-bold text-white tracking-tight">
              Multi-Agent Deadlock &amp; FSM Breaker Sandbox
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {results.hasDeadlock ? (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white border border-white/30 ">
                <AlertTriangle className="w-3 h-3 text-red-400" />
                DEADLOCK
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-200 border border-white/30">
                <ShieldCheck className="w-3 h-3 text-neutral-200" />
                DAG OK
              </span>
            )}
            {getCircuitBadge(results.circuitBreakerState)}
          </div>
        </div>

        {/* Scenarios Quick Select */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          {[
            { id: 'cyclic_deadlock', label: 'Cyclic Deadlock', icon: AlertTriangle },
            { id: 'rate_limit_thundering_herd', label: 'Cascading 429', icon: Flame },
            { id: 'fsm_circuit_breaker_recovery', label: 'FSM Breaker', icon: ShieldCheck },
            { id: 'monotonic_dag_orchestration', label: 'Monotonic DAG', icon: GitBranch }
          ].map(s => {
            const Icon = s.icon;
            const isSelected = scenario === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setScenario(s.id as ScenarioPreset);
                  if (s.id === 'fsm_circuit_breaker_recovery' || s.id === 'monotonic_dag_orchestration') {
                    setCircuitBreakerEnabled(true);
                    setUpstreamErrorRate(70);
                  } else if (s.id === 'cyclic_deadlock') {
                    setCircuitBreakerEnabled(false);
                    setUpstreamErrorRate(40);
                  } else {
                    setCircuitBreakerEnabled(false);
                    setUpstreamErrorRate(90);
                  }
                }}
                className={`active:scale-[0.97] px-2.5 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-1.5 border transition-all duration-300 ${
                  isSelected
                    ? 'border-white/30 bg-white/10 text-white'
                    : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Graph Visual Canvas */}
        <div className="relative w-full h-56 bg-neutral-950/90 rounded-[24px] border border-neutral-800/90 overflow-hidden flex items-center justify-center p-2 mb-4">
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="embed-arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#ffffff" />
              </marker>
              <marker id="embed-arrow-cycle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#a3a3a3" />
              </marker>
            </defs>

            {results.edges.map((edge, idx) => {
              const fromNode = results.nodes.find(n => n.id === edge.from);
              const toNode = results.nodes.find(n => n.id === edge.to);
              if (!fromNode || !toNode) return null;

              const isDeadlocked = edge.isDeadlockedCycle;
              return (
                <line
                  key={idx}
                  x1={fromNode.x}
                  y1={fromNode.y}
                  x2={toNode.x}
                  y2={toNode.y}
                  stroke={isDeadlocked ? '#ef4444' : '#ffffff'}
                  strokeWidth={isDeadlocked ? '1.5' : '1'}
                  strokeDasharray={isDeadlocked ? '3,2' : undefined}
                  className={isDeadlocked ? '' : ''}
                  markerEnd={isDeadlocked ? 'url(#embed-arrow-cycle)' : 'url(#embed-arrow-active)'}
                />
              );
            })}
          </svg>

          {results.nodes.map(node => (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
              className={`px-2 py-1.5 rounded-lg border text-center transition-all z-10 ${
                node.status === 'DEADLOCKED'
                  ? 'bg-white/10 border-white/30 text-white ring-1 ring-red-500/40 '
                  : node.status === 'CIRCUIT_TRIPPED'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                  : 'bg-neutral-900/90 border-neutral-700 text-neutral-200'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {node.status === 'DEADLOCKED' ? <Lock className="w-2.5 h-2.5 text-red-400" /> : <Zap className="w-2.5 h-2.5 text-neutral-200" />}
                <span>{node.label.split(' ')[0]}</span>
              </div>
              <div className="text-[8px] font-mono text-neutral-400">{node.tokensConsumed.toLocaleString()} t</div>
            </div>
          ))}
        </div>

        {/* Quantified Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[9px] font-mono text-neutral-400 uppercase">Runaway Tokens</div>
            <div className="text-sm font-bold text-red-400">{results.wastedTokens.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[9px] font-mono text-neutral-400 uppercase">FSM Bounded</div>
            <div className="text-sm font-bold text-white">{results.boundedFsmTokens.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[9px] font-mono text-neutral-400 uppercase">Unconstrained P99</div>
            <div className="text-sm font-bold text-red-400">{results.unconstrainedP99Ms}ms</div>
          </div>
          <div className="p-2.5 rounded-xl bg-neutral-900/80 border border-neutral-800">
            <div className="text-[9px] font-mono text-neutral-400 uppercase">FSM Fail-Fast</div>
            <div className="text-sm font-bold text-white">{results.fsmP99Ms}ms</div>
          </div>
        </div>

        {/* Quick Sliders */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-[18px] bg-neutral-900/80 border border-neutral-800 mb-4">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-neutral-400">Upstream Error:</span>
              <span className="text-amber-400 font-bold">{upstreamErrorRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={upstreamErrorRate}
              onChange={e => setUpstreamErrorRate(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer h-1 bg-neutral-800 rounded"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-neutral-400">Circuit Breaker:</span>
              <span className={circuitBreakerEnabled ? 'text-white font-bold' : 'text-neutral-500'}>
                {circuitBreakerEnabled ? 'ENABLED' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => setCircuitBreakerEnabled(!circuitBreakerEnabled)}
              className={`active:scale-[0.97] w-full py-1 rounded text-[10px] font-mono font-semibold transition-all duration-300 ${
                circuitBreakerEnabled ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'
              }`}
            >
              Toggle Breaker
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Backlink Watermark Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
        <span>Deterministic Multi-Agent Engine</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-white hover:text-white font-semibold transition-all duration-300"
        >
          <span>Elesium Enterprise AI Solutions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
