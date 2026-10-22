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
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">OPEN</span>;
      case 'HALF_OPEN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">HALF_OPEN</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">CLOSED</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans antialiased flex flex-col justify-between">
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
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-rose-400" />
            <h1 className="text-sm font-bold text-white tracking-tight">
              Multi-Agent Deadlock &amp; FSM Breaker Sandbox
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {results.hasDeadlock ? (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 ">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                DEADLOCK
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
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
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium flex items-center gap-1.5 border transition-all ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/40 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3 h-3 shrink-0" />
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Graph Visual Canvas */}
        <div className="relative w-full h-56 bg-slate-950/90 rounded-xl border border-slate-800/90 overflow-hidden flex items-center justify-center p-2 mb-4">
          <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="embed-arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
              </marker>
              <marker id="embed-arrow-cycle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="3" markerHeight="3" orient="auto-start-reverse">
                <path d="M 0 1 L 8 5 L 0 9 z" fill="#f43f5e" />
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
                  stroke={isDeadlocked ? '#f43f5e' : '#38bdf8'}
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
                  ? 'bg-rose-950/90 border-rose-500 text-rose-300 ring-1 ring-rose-500/50 '
                  : node.status === 'CIRCUIT_TRIPPED'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300'
                  : 'bg-slate-900/90 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {node.status === 'DEADLOCKED' ? <Lock className="w-2.5 h-2.5 text-rose-400" /> : <Zap className="w-2.5 h-2.5 text-sky-400" />}
                <span>{node.label.split(' ')[0]}</span>
              </div>
              <div className="text-[8px] font-mono text-slate-400">{node.tokensConsumed.toLocaleString()} t</div>
            </div>
          ))}
        </div>

        {/* Quantified Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Runaway Tokens</div>
            <div className="text-sm font-bold text-rose-400">{results.wastedTokens.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">FSM Bounded</div>
            <div className="text-sm font-bold text-emerald-400">{results.boundedFsmTokens.toLocaleString()}</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Unconstrained P99</div>
            <div className="text-sm font-bold text-rose-400">{results.unconstrainedP99Ms}ms</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">FSM Fail-Fast</div>
            <div className="text-sm font-bold text-sky-400">{results.fsmP99Ms}ms</div>
          </div>
        </div>

        {/* Quick Sliders */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800 mb-4">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Upstream Error:</span>
              <span className="text-amber-400 font-bold">{upstreamErrorRate}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={upstreamErrorRate}
              onChange={e => setUpstreamErrorRate(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Circuit Breaker:</span>
              <span className={circuitBreakerEnabled ? 'text-sky-400 font-bold' : 'text-slate-500'}>
                {circuitBreakerEnabled ? 'ENABLED' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => setCircuitBreakerEnabled(!circuitBreakerEnabled)}
              className={`w-full py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                circuitBreakerEnabled ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Toggle Breaker
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Backlink Watermark Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <span>Deterministic Multi-Agent Engine</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
        >
          <span>Elesium Enterprise AI Solutions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
