import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Network,
  AlertTriangle,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Zap,
  Activity,
  GitBranch,
  Lock,
  Flame
} from 'lucide-react';
import {
  runAgentDeadlockSimulation,
  DeadlockSimulatorInputs,
  ScenarioPreset,
  CircuitBreakerState
} from '../calculator/agentDeadlockSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentDeadlockVisualizer() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Simulation Controls State
  const [scenario, setScenario] = useState<ScenarioPreset>('cyclic_deadlock');
  const [agentCount, setAgentCount] = useState<number>(4);
  const [upstreamErrorRate, setUpstreamErrorRate] = useState<number>(65);
  const [circuitBreakerEnabled, setCircuitBreakerEnabled] = useState<boolean>(false);
  const [failureThreshold, setFailureThreshold] = useState<number>(4);
  const [recoveryTimeoutMs] = useState<number>(5000);
  const [maxRetryAttempts, setMaxRetryAttempts] = useState<number>(3);
  const [baseBackoffMs, setBaseBackoffMs] = useState<number>(500);
  const [concurrencyLevel, setConcurrencyLevel] = useState<number>(8);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/agent-deadlock-visualizer" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: MULTI-AGENT DEADLOCK & FSM CIRCUIT BREAKER SIMULATION
Scenario: ${scenario.toUpperCase()} | Agents: ${agentCount} | Concurrency: ${concurrencyLevel} Streams
Circuit Breaker: ${circuitBreakerEnabled ? 'ENABLED' : 'DISABLED'} | Upstream Error Rate: ${upstreamErrorRate}%
================================================================================

1. TOPOLOGY & DEADLOCK DIAGNOSIS:
   • Deadlock Condition: ${results.hasDeadlock ? `CRITICAL DIRECTED CYCLE DETECTED [${results.deadlockCycle.join(' -> ')}]` : 'STABLE (Monotonic DAG Preserved)'}
   • Circuit Breaker Status: ${results.circuitBreakerState}
   • Mean Time to Recovery (MTTR): ${typeof results.mttrSeconds === 'string' ? 'INFINITE (Requires Process Termination)' : `${results.mttrSeconds}s (Automated Resiliency)`}
   • Overall System Reliability Score: ${results.systemReliabilityScore} / 100

2. LATENCY & RUNAWAY TOKEN METRICS:
   • Wasted Runaway Tokens (Circular Wait): ${results.wastedTokens.toLocaleString()} Tokens
   • Bounded FSM Consumption: ${results.boundedFsmTokens.toLocaleString()} Tokens
   • Net Token Burn Reduction: ${results.tokensSaved.toLocaleString()} Tokens (${results.tokenSavingsPercentage}% Savings)
   • P99 Tail Latency: ${results.unconstrainedP99Ms} ms vs ${results.fsmP99Ms} ms with Breaker (${results.latencyImprovementPct}% Latency Cut)

3. MITIGATION RECOMMENDATION:
   ${results.hasDeadlock 
     ? 'URGENT: Replace unconstrained recursive ReAct agent loops with deterministic Finite State Machine (FSM) orchestrator with topological sort rank assertions.' 
     : 'PASS: Topology maintains strict DAG invariant. Ensure exponential backoff with full jitter is enforced on all upstream API connectors.'}
================================================================================
Generated via Elesium Sovereign AI Engineering (https://elesium.online)
    `.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const getNodeStatusBadge = (status: string) => {
    switch (status) {
      case 'DEADLOCKED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">DEADLOCKED</span>;
      case 'CIRCUIT_TRIPPED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">BREAKER OPEN</span>;
      case 'FALLBACK_SERVED':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">FALLBACK SERVED</span>;
      case 'BLOCKED_AWAITING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">BLOCKED</span>;
      case 'EXECUTING':
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">EXECUTING</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-800 text-slate-400 border border-slate-700">IDLE</span>;
    }
  };

  const getCircuitBadge = (state: CircuitBreakerState) => {
    switch (state) {
      case 'OPEN':
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/20 text-rose-400 border border-rose-500/40">OPEN (TRIPPED — FAST FAIL)</span>;
      case 'HALF_OPEN':
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40">HALF_OPEN (PROBING)</span>;
      case 'CLOSED':
        return <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">CLOSED (HEALTHY FLOW)</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-20 selection:bg-rose-500/30 selection:text-rose-200">
      <Helmet>
        <title>Enterprise Multi-Agent Deadlock & FSM Circuit Breaker Visualizer | Elesium</title>
        <meta
          name="description"
          content="Simulate cyclic agent deadlocks, cascading API rate-limit thundering herds, and deterministic FSM circuit breaker fallbacks with exponential backoff and jitter."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Enterprise Multi-Agent Deadlock & FSM Circuit Breaker Visualizer",
            "url": "https://elesium.online/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer",
            "description": "Interactive multi-agent network graph simulator modeling circular wait deadlocks, exponential backoff with full jitter, and deterministic FSM circuit breaker fallback mechanics.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Tarjan SCC & DFS Directed Cycle Deadlock Detection",
              "Sliding Window FSM Circuit Breaker (CLOSED / OPEN / HALF_OPEN)",
              "Exponential Backoff with Full Jitter Simulator",
              "Runaway Token Burn vs Bounded State Machine Projections",
              "P99 Tail Latency & MTTR Resiliency Quantification",
              "Monotonic Topological Sort DAG Validation"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://elesium.online"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Solutions",
                "item": "https://elesium.online/solutions"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Agent Deadlock & Circuit Breaker Visualizer",
                "item": "https://elesium.online/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-8">
          <Link to="/" className="hover:text-slate-200 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/solutions" className="hover:text-slate-200 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-rose-400">Agent Deadlock & Circuit Breaker Visualizer</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Network className="w-3.5 h-3.5" />
            Deterministic Agentic Reliability Sandbox
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Enterprise Multi-Agent Deadlock & <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-sky-400">FSM Circuit Breaker Visualizer</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
            Unconstrained recursive multi-agent loops inevitably suffer from circular wait conditions, cascading 429 rate-limit storms, and runaway token burn. 
            Simulate live directed cycle deadlocks, test sliding-window circuit breakers, and verify how deterministic Finite State Machines eliminate runaway token leakage.
          </p>
        </div>

        {/* Scenario Presets Bar */}
        <div className="mb-8">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-rose-400" />
            Architectural Failure Scenarios
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                id: 'cyclic_deadlock',
                title: 'Cyclic Agent Deadlock',
                desc: 'Unconstrained loop (A → B → C → A) causing mutual wait hang',
                icon: AlertTriangle,
                color: 'hover:border-rose-500/50 hover:bg-rose-950/20'
              },
              {
                id: 'rate_limit_thundering_herd',
                title: 'Cascading 429 Outage',
                desc: 'Synchronous un-jittered retries overwhelming upstream APIs',
                icon: Flame,
                color: 'hover:border-amber-500/50 hover:bg-amber-950/20'
              },
              {
                id: 'fsm_circuit_breaker_recovery',
                title: 'FSM Circuit Breaker',
                desc: 'Sliding window fast-fail + exponential backoff with full jitter',
                icon: ShieldCheck,
                color: 'hover:border-sky-500/50 hover:bg-sky-950/20'
              },
              {
                id: 'monotonic_dag_orchestration',
                title: 'Strict Monotonic DAG',
                desc: 'Topological sort rank assertions mathematically barring cycles',
                icon: GitBranch,
                color: 'hover:border-emerald-500/50 hover:bg-emerald-950/20'
              }
            ].map(item => {
              const Icon = item.icon;
              const isSelected = scenario === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setScenario(item.id as ScenarioPreset);
                    if (item.id === 'fsm_circuit_breaker_recovery' || item.id === 'monotonic_dag_orchestration') {
                      setCircuitBreakerEnabled(true);
                      setUpstreamErrorRate(70);
                    } else if (item.id === 'cyclic_deadlock') {
                      setCircuitBreakerEnabled(false);
                      setUpstreamErrorRate(40);
                    } else {
                      setCircuitBreakerEnabled(false);
                      setUpstreamErrorRate(90);
                    }
                  }}
                  className={`p-4 rounded-xl text-left border transition-all ${
                    isSelected
                      ? 'border-rose-500 bg-rose-950/30 shadow-lg shadow-rose-950/50'
                      : 'border-slate-800 bg-slate-900/60 ' + item.color
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                    <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-normal">{item.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Controls (Left) & Visualizer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 mb-6 flex items-center justify-between">
                <span>Simulation Parameters</span>
                <Sliders className="w-4 h-4 text-slate-400" />
              </h3>

              {/* Agent Network Nodes */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">Active Agent Nodes</span>
                  <span className="text-rose-400 font-bold">{agentCount} Agents</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="6"
                  step="1"
                  value={agentCount}
                  onChange={e => setAgentCount(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>3 (Minimal Triad)</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6 (Full Enterprise Mesh)</span>
                </div>
              </div>

              {/* Upstream API Error Rate */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">Upstream LLM Error Rate (429/503)</span>
                  <span className="text-amber-400 font-bold">{upstreamErrorRate}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={upstreamErrorRate}
                  onChange={e => setUpstreamErrorRate(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>0% (Ideal Cloud)</span>
                  <span>50% (Peak Congestion)</span>
                  <span>100% (Total Outage)</span>
                </div>
              </div>

              {/* Circuit Breaker Toggle */}
              <div className="mb-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-5 h-5 ${circuitBreakerEnabled ? 'text-sky-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="text-xs font-mono font-semibold text-slate-200">FSM Circuit Breaker</div>
                      <div className="text-[11px] text-slate-400">Trips on consecutive timeouts; serves fallback</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setCircuitBreakerEnabled(!circuitBreakerEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      circuitBreakerEnabled ? 'bg-sky-500' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        circuitBreakerEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Failure Threshold Before Trip */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">Consecutive Failure Trip Threshold</span>
                  <span className="text-sky-400 font-bold">{failureThreshold} Failures</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="1"
                  value={failureThreshold}
                  onChange={e => setFailureThreshold(parseInt(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>2 (Aggressive Fast-Fail)</span>
                  <span>5 (Standard Enterprise)</span>
                  <span>10 (Permissive)</span>
                </div>
              </div>

              {/* Concurrency Level */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">Concurrent Agent Request Streams</span>
                  <span className="text-rose-400 font-bold">{concurrencyLevel} Parallel Streams</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="16"
                  step="1"
                  value={concurrencyLevel}
                  onChange={e => setConcurrencyLevel(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
              </div>

              {/* Exponential Backoff & Jitter */}
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Max Retries</span>
                  <select
                    value={maxRetryAttempts}
                    onChange={e => setMaxRetryAttempts(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
                  >
                    <option value={1}>1 Retry</option>
                    <option value={2}>2 Retries</option>
                    <option value={3}>3 Retries</option>
                    <option value={5}>5 Retries</option>
                  </select>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-400 block mb-1">Base Backoff (ms)</span>
                  <select
                    value={baseBackoffMs}
                    onChange={e => setBaseBackoffMs(parseInt(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200"
                  >
                    <option value={200}>200 ms</option>
                    <option value={500}>500 ms</option>
                    <option value={1000}>1000 ms</option>
                    <option value={2000}>2000 ms</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Circuit State & Reliability Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Circuit Breaker Telemetry</span>
                {getCircuitBadge(results.circuitBreakerState)}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">MTTR Resiliency</div>
                  <div className="text-base font-bold text-white mt-1">
                    {typeof results.mttrSeconds === 'string' ? 'Manual Reboot Required' : `${results.mttrSeconds}s Fast Reset`}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Reliability Index</div>
                  <div className={`text-base font-bold mt-1 ${
                    results.systemReliabilityScore > 80 ? 'text-emerald-400' : results.systemReliabilityScore > 50 ? 'text-amber-400' : 'text-rose-400'
                  }`}>
                    {results.systemReliabilityScore}% Score
                  </div>
                </div>
              </div>

              {/* Mathematical Formula Capsule */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                <div className="text-rose-400 font-semibold text-[10px] uppercase">Exponential Backoff With Full Jitter Formula:</div>
                <div className="text-slate-300">
                  t = min(t_max, t_base · 2^attempt) · Uniform(0, 1)
                </div>
                <div className="text-[10px] text-slate-500">
                  Mitigates thundering herd synchronization during 429 rate limit backpressures.
                </div>
              </div>
            </div>
          </div>

          {/* Visual Graph & Metrics Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Agent Graph Canvas */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
                    Real-time Dependency Graph & Mutex Canvas
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  {results.hasDeadlock ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 " />
                      DIRECTED CYCLE DETECTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      MONOTONIC DAG INVARIANT OK
                    </span>
                  )}
                </div>
              </div>

              {/* Deadlock Banner Alert */}
              {results.hasDeadlock && (
                <div className="mb-4 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-rose-200">
                    <span className="font-bold text-rose-300">Circular Wait Condition:</span> An unhandled directed cycle formed between{' '}
                    <span className="font-mono font-semibold text-rose-300 bg-rose-900/40 px-1 py-0.5 rounded">
                      {results.deadlockCycle.join(' ➔ ')}
                    </span>
                    . Agents are indefinitely blocked awaiting mutual execution results.
                  </div>
                </div>
              )}

              {/* SVG Topology Visualization */}
              <div className="relative w-full h-80 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
                <svg className="w-full h-full absolute inset-0 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#38bdf8" />
                    </marker>
                    <marker id="arrow-cycle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#f43f5e" />
                    </marker>
                    <marker id="arrow-default" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
                      <path d="M 0 1 L 8 5 L 0 9 z" fill="#475569" />
                    </marker>
                  </defs>

                  {/* Draw edges */}
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
                        markerEnd={isDeadlocked ? 'url(#arrow-cycle)' : 'url(#arrow-active)'}
                      />
                    );
                  })}
                </svg>

                {/* Node Icons & Cards Positioned Over SVG */}
                {results.nodes.map(node => (
                  <div
                    key={node.id}
                    style={{
                      position: 'absolute',
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    className={`p-2.5 rounded-xl border transition-all shadow-md z-10 flex flex-col items-center max-w-[130px] sm:max-w-[160px] text-center ${
                      node.status === 'DEADLOCKED'
                        ? 'bg-rose-950/90 border-rose-500 shadow-rose-950/60 ring-2 ring-rose-500/40 '
                        : node.status === 'CIRCUIT_TRIPPED'
                        ? 'bg-amber-950/90 border-amber-500 shadow-amber-950/60'
                        : node.status === 'FALLBACK_SERVED'
                        ? 'bg-sky-950/90 border-sky-500 shadow-sky-950/60'
                        : 'bg-slate-900/90 border-slate-700 shadow-slate-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {node.status === 'DEADLOCKED' ? (
                        <Lock className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <Zap className="w-3.5 h-3.5 text-sky-400" />
                      )}
                      <span className="text-[11px] font-bold text-slate-100 truncate">{node.label.split(' ')[0]}</span>
                    </div>
                    {getNodeStatusBadge(node.status)}
                    <div className="text-[9px] text-slate-400 font-mono mt-1">
                      {node.tokensConsumed.toLocaleString()} toks
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Comparative Quantified Impact Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Runaway Token Burn</div>
                <div className="text-xl font-extrabold text-rose-400 mt-1">
                  {results.wastedTokens.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Tokens Burned</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">FSM Bounded Tokens</div>
                <div className="text-xl font-extrabold text-emerald-400 mt-1">
                  {results.boundedFsmTokens.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-500/80 font-mono mt-0.5">
                  -{results.tokenSavingsPercentage}% Leaked
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Unconstrained P99</div>
                <div className="text-xl font-extrabold text-rose-400 mt-1">
                  {results.unconstrainedP99Ms} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">Infinite Timeout</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono text-slate-400 uppercase">FSM Fail-Fast P99</div>
                <div className="text-xl font-extrabold text-sky-400 mt-1">
                  {results.fsmP99Ms} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-sky-400 font-mono mt-0.5">
                  {results.latencyImprovementPct}% Faster
                </div>
              </div>
            </div>

            {/* Step-by-Step State Transition Audit Log */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Code className="w-4 h-4 text-rose-400" />
                State Machine Transition Audit Trail
              </h3>
              <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 font-mono text-xs">
                {results.history.map(record => (
                  <div
                    key={record.step}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span className="text-sky-400 font-bold">STEP {record.step}</span>
                        <span>•</span>
                        <span>{record.timestampMs} ms</span>
                        <span>•</span>
                        <span className="text-amber-400">P99: {record.p99LatencyMs}ms</span>
                      </div>
                      <div className="text-slate-200">{record.logMessage}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400">
                        +{record.tokensConsumedStep.toLocaleString()} toks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Row & Embed Drawer */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border border-slate-800 mb-16">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Embed This Deadlock & Circuit Breaker Visualizer
            </h4>
            <p className="text-xs text-slate-400">
              Integrate this interactive multi-agent reliability sandbox into your developer documentation or architecture reviews.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors flex items-center gap-2"
            >
              <Code className="w-3.5 h-3.5 text-rose-400" />
              Embed Sandbox
            </button>
            <button
              onClick={copyArchitecturalMemo}
              className="px-4 py-2.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors flex items-center gap-2"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Brief'}
            </button>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 hover:from-rose-600 hover:to-amber-600 text-xs font-mono font-bold text-white transition-all shadow-md shadow-rose-950 flex items-center gap-2">
                <span>Schedule Architecture Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="p-6">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>

        {/* Technical Deep Dive & FAQs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Deterministic Multi-Agent Architectural Principles
          </h3>
          {[
            {
              q: 'Why do unconstrained recursive ReAct loops inevitably deadlock in multi-agent swarms?',
              a: 'In unconstrained frameworks (e.g. LangChain agent loops, AutoGen conversational chat), agents are permitted to invoke tool outputs asynchronously without a formal state machine. When Agent A requests clarification from Agent B, and Agent B’s chain-of-thought invokes a tool that queries Agent A, a classic directed circular wait condition forms (Coffman condition #4). Without a deterministic supervisor asserting topological ordering, both processes spin in infinite retry loops, burning hundreds of thousands of tokens while waiting on mutexes that can never resolve.'
            },
            {
              q: 'How does Tarjan’s Strongly Connected Components (SCC) algorithm resolve circular deadlocks?',
              a: 'Before any multi-agent dependency task graph is executed in production, Elesium’s orchestrator runs a depth-first search (DFS) topological sort. If a cycle is detected (where a node can reach itself via directed edges), the system rejects the graph dynamically, flags the cyclical edge, and forces the transition into a deterministic fallback state machine. This guarantees zero circular wait states at runtime.'
            },
            {
              q: 'What is the mathematical difference between naive exponential backoff and Full Jitter?',
              a: 'Naive exponential backoff (t = min(t_max, t_base · 2^attempt)) causes all concurrent agents to wake up at exact identical intervals, creating a catastrophic thundering herd on upstream model APIs during 429 rate-limit events. Full Jitter introduces a uniform random variable between 0 and the exponential ceiling (t = Uniform(0, min(t_max, t_base · 2^attempt))). This decorrelates agent retries, flattening the request spike and enabling smooth queue drainage.'
            },
            {
              q: 'How do Finite State Machine (FSM) circuit breakers eliminate accidental $10,000+ token runaway spend?',
              a: 'When an upstream tool or LLM endpoint fails consecutively beyond a configured threshold (e.g., 4 consecutive 503 or 429 timeouts), the circuit breaker transitions from CLOSED to OPEN. In the OPEN state, all subsequent requests fail fast in under 15ms without sending requests or prompt tokens to the LLM API, serving pre-computed deterministic heuristics instead. This bounds runaway token spend to zero and protects enterprise budgets.'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-rose-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-rose-400" />
              Embed Multi-Agent Deadlock Visualizer
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into your technical documentation, blog, or dashboard:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-rose-300 break-all select-all mb-4">
              {embedCodeSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
