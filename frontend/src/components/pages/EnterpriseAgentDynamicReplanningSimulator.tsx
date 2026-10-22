import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  GitFork,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import {
  simulateDynamicReplanning,
  DynamicReplanningInputs
} from '../calculator/agentDynamicReplanningSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentDynamicReplanningSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(250000);
  const [baselinePlanSteps, setBaselinePlanSteps] = useState<number>(14);
  const [environmentalEntropyPct, setEnvironmentalEntropyPct] = useState<number>(16.5);
  const [maxAllowedReflectionDepth, setMaxAllowedReflectionDepth] = useState<number>(4);
  const [costPerReflectionPassUSD, setCostPerReflectionPassUSD] = useState<number>(0.18);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: DynamicReplanningInputs = useMemo(() => ({
    monthlyWorkflows,
    baselinePlanSteps,
    environmentalEntropyPct,
    maxAllowedReflectionDepth,
    costPerReflectionPassUSD
  }), [
    monthlyWorkflows,
    baselinePlanSteps,
    environmentalEntropyPct,
    maxAllowedReflectionDepth,
    costPerReflectionPassUSD
  ]);

  const results = useMemo(() => {
    return simulateDynamicReplanning(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-dynamic-replanning-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT DYNAMIC RE-PLANNING & SELF-CORRECTION MEMO
Workload Profile: ${(inputs.monthlyWorkflows / 1000).toFixed(0)}k runs/mo | ${inputs.baselinePlanSteps} Plan Steps | ${inputs.environmentalEntropyPct}% Anomaly Rate (~${results.anomaliesResolvedPerMonth.toLocaleString()} events/mo)

ARCHITECTURAL COMPARISON:
1. Unbounded Self-Correction Loop (Naive Reflexion):
   - Re-planning Latency: ${(results.unboundedReflexion.avgReplanningLatencyMs / 1000).toFixed(1)}s | P99 Total: ${(results.unboundedReflexion.totalWorkflowLatencyMs / 1000).toFixed(1)}s
   - Cyclic Deadlock Risk: ${results.unboundedReflexion.infiniteLoopDeadlockPct}% | Annual Loss: $${results.unboundedReflexion.annualizedTotalExpenseUSD.toLocaleString()}
2. Static Counter Circuit Breaker (Max N Retries):
   - Premature Abort Rate: 26.5% | Successful Convergence: ${results.hardCircuitBreaker.successfulConvergencePct}%
   - Annual Failure & Triage Expense: $${results.hardCircuitBreaker.annualizedTotalExpenseUSD.toLocaleString()}
3. Elesium Bounded Deterministic Re-Planner:
   - Re-planning Latency: ${(results.boundedDeterministic.avgReplanningLatencyMs / 1000).toFixed(2)}s [${results.latencyReductionPct}% cut]
   - Successful Convergence: ${results.boundedDeterministic.successfulConvergencePct}% (+${results.convergenceImprovementPct}% lift)
   - Cyclic Deadlock Risk: 0.0% (Guaranteed by DAG cycle detection)
   - Net Annual Token & Triage Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Replace unconstrained LLM self-reflection with DAG-constrained branch re-planning and token-budgeted fallback subgraphs.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why does naive agent self-reflection cause runaway latency and token exhaustion?',
      a: 'In unconstrained ReAct or Reflexion patterns, when an agent encounters an unexpected tool output or API failure, it prompts the LLM to analyze the error and formulate a new plan. Without deterministic DAG boundaries, the LLM frequently oscillates between conflicting hypotheses, taking 4 to 8 conversational turns to converge—or getting trapped in circular prompt arguments. In enterprise production, this inflates P99 latency past 15 seconds and burns 5x-10x more tokens than nominal execution.'
    },
    {
      q: 'What is wrong with simple static retry circuit breakers (e.g., abort after 2 tries)?',
      a: 'Static retry counters are too blunt for enterprise workflows. If a third-party payment gateway takes 2.1 seconds instead of 2.0 seconds, or an ERP database requires a schema fallback, a static counter unconditionally aborts the entire multi-agent workflow. Across 250k monthly workflows, this results in hundreds of unnecessary failures daily, forcing human operations teams into endless manual triage.'
    },
    {
      q: 'How does Elesium achieve 99.4% convergence in sub-1,800ms during replanning?',
      a: 'Elesium models agent planning as a Directed Acyclic Graph (DAG) with pre-compiled alternative execution branches. When an anomaly occurs, the system does not ask the LLM to reinvent the plan from scratch. Instead, an invariant evaluation engine identifies the exact failure boundary and activates a localized, token-budgeted fallback subgraph. Re-planning executes via constrained grammar decoding in under 1.8 seconds with zero cyclic deadlocks.'
    },
    {
      q: 'How does the system prevent infinite loops and cyclic deadlocks?',
      a: 'Elesium enforces mathematical cycle prevention. Every state node in the agent graph carries an execution history vector. If an agent attempts to transition to an ancestor state with identical context parameters, the FSM circuit breaker immediately intercepts the transition and forces deterministic escalation to an alternative branch, mathematically guaranteeing 0.0% deadlock.'
    },
    {
      q: 'Can the replanning system handle human-in-the-loop approvals during plan branch changes?',
      a: 'Yes. For high-risk or mission-critical actions (e.g., modifying payment routing or altering flight paths), the bounded re-planner generates an explicit delta proposal comparing the original plan against the revised branch. It suspends execution and dispatches an asynchronous approval event to human reviewers while maintaining the active state checkpoint in memory.'
    },
    {
      q: 'What infrastructure is required to deploy Elesium bounded replanning?',
      a: 'Elesium runs entirely self-contained within your private VPC or on-premises Kubernetes cluster. The state transition engine and DAG validator are implemented as high-throughput asynchronous workers with zero external SaaS dependencies, ensuring full compliance with SOC-2, ISO 27001, and the DPDP Act 2023.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Helmet>
        <title>Enterprise Autonomous Agent Dynamic Re-Planning Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark autonomous agent dynamic re-planning and self-correction overhead. Compare unconstrained Reflexion loops vs static circuit breakers vs bounded deterministic DAG replanning."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-dynamic-replanning-simulator" />
      </Helmet>

      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-white transition-colors">Interactive Tools</Link>
            <span>/</span>
            <span className="text-cyan-400 font-mono">Agent Dynamic Re-Planning Simulator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 font-mono"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Embed Sandbox</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 transition-colors border border-cyan-500/30 font-mono"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 uppercase tracking-wider">
            <GitFork className="w-3.5 h-3.5" />
            Deterministic Agentic Re-Planning &amp; Self-Correction Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Enterprise Autonomous Agent Dynamic Re-Planning Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Simulate and benchmark agent self-reflection and re-planning overhead. Contrast unconstrained Reflexion loops against static counter aborts and sovereign bounded DAG re-planning with sub-1.8s convergence and 0.0% deadlocks.
          </p>
        </div>

        {/* Primary Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Re-Planning &amp; Workflow Parameters</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Production Model</span>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Monthly Workflows */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Monthly Agent Workflows</span>
                  <span className="text-cyan-400 font-bold">{monthlyWorkflows.toLocaleString()} runs</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={1000000}
                  step={25000}
                  value={monthlyWorkflows}
                  onChange={(e) => setMonthlyWorkflows(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>25k runs/mo</span>
                  <span>500k</span>
                  <span>1.0M runs/mo</span>
                </div>
              </div>

              {/* Slider 2: Plan Steps */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Baseline Plan Complexity</span>
                  <span className="text-cyan-400 font-bold">{baselinePlanSteps} steps / plan</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={30}
                  step={2}
                  value={baselinePlanSteps}
                  onChange={(e) => setBaselinePlanSteps(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>4 (Simple)</span>
                  <span>14 (Enterprise)</span>
                  <span>30 (Deep Mesh)</span>
                </div>
              </div>

              {/* Slider 3: Environmental Entropy Rate */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Environmental Anomaly Rate</span>
                  <span className="text-rose-400 font-bold">{environmentalEntropyPct.toFixed(1)}% ({results.anomaliesResolvedPerMonth.toLocaleString()} events)</span>
                </div>
                <input
                  type="range"
                  min={2.0}
                  max={40.0}
                  step={1.0}
                  value={environmentalEntropyPct}
                  onChange={(e) => setEnvironmentalEntropyPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>2% (Low Noise)</span>
                  <span>16.5% (Production)</span>
                  <span>40% (Chaotic External APIs)</span>
                </div>
              </div>

              {/* Slider 4: Reflection Depth */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Max Self-Correction Depth</span>
                  <span className="text-purple-400 font-bold">{maxAllowedReflectionDepth} passes</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={8}
                  step={1}
                  value={maxAllowedReflectionDepth}
                  onChange={(e) => setMaxAllowedReflectionDepth(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>1 (Shallow)</span>
                  <span>4 (Standard)</span>
                  <span>8 (Deep Reflection)</span>
                </div>
              </div>

              {/* Slider 5: Cost per Reflection Pass */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Token Cost / Reflection Pass</span>
                  <span className="text-emerald-400 font-bold">${costPerReflectionPassUSD.toFixed(2)} / pass</span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.50}
                  step={0.02}
                  value={costPerReflectionPassUSD}
                  onChange={(e) => setCostPerReflectionPassUSD(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>$0.02 (Mini Model)</span>
                  <span>$0.18 (Sonnet 3.5)</span>
                  <span>$0.50 (Reasoning Heavy)</span>
                </div>
              </div>
            </div>

            {/* Architecture Key Insights */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">DAG Branch Pruning:</strong> Eliminates circular reasoning by enforcing deterministic state transitions.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Sub-1.8s Convergence:</strong> Refines plans via constrained grammar decoding instead of raw prompt loops.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Zero Deadlocks:</strong> Mathematical cycle prevention guarantees 0.0% infinite loop risk.</span>
              </div>
            </div>
          </div>

          {/* Results Visualizer Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Annual Savings
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block">
                  ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tokens &amp; Triage Saved
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Convergence Rate
                </span>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono block">
                  {results.boundedDeterministic.successfulConvergencePct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  +{results.convergenceImprovementPct}% vs Naive Reflexion
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  P99 Latency Cut
                </span>
                <span className="text-xl sm:text-2xl font-bold text-purple-400 font-mono block">
                  {results.latencyReductionPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {(results.boundedDeterministic.totalWorkflowLatencyMs / 1000).toFixed(1)}s vs {(results.unboundedReflexion.totalWorkflowLatencyMs / 1000).toFixed(1)}s
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Deadlock Risk
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block">
                  0.0%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  vs {results.unboundedReflexion.infiniteLoopDeadlockPct}% in Naive ReAct
                </span>
              </div>
            </div>

            {/* Interactive Re-Planning Execution Visualizer */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <GitFork className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Dynamic Re-Planning &amp; Fallback Branch Execution
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Sub-1.8s Branch Swapping
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">1. Nominal Plan</span>
                      <span className="font-mono text-[10px] text-emerald-400">Step #1 - #6</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Executing standard DAG steps until an external API schema mismatch occurs.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-amber-300">2. Invariant Trigger</span>
                      <span className="font-mono text-[10px] text-amber-400">Step #7</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      FSM catches deviation; isolates failed node without killing overall execution state.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 relative">
                    <div className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-cyan-500 text-black font-mono text-[9px] font-bold">
                      Alternative Branch
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-cyan-300">3. Bounded Re-Route</span>
                      <span className="font-mono text-[10px] text-cyan-400">Branch B</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Swaps to pre-verified fallback subgraph in 1,750ms with 99.4% resolution guarantee.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Dynamic Latency: <strong>1,750ms</strong> vs <strong>{(results.unboundedReflexion.avgReplanningLatencyMs / 1000).toFixed(1)}s</strong> (Prompt reflection loop)</span>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px]">75% Faster</span>
                </div>
              </div>
            </div>

            {/* Architectural Comparison Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 mb-4">
                Architecture Benchmark Breakdown
              </h3>

              <div className="space-y-4">
                {/* 1. Unbounded Self-Correction */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <h4 className="font-bold text-rose-300 text-sm">Unbounded Self-Correction (Naive Reflexion)</h4>
                    </div>
                    <span className="font-mono text-xs text-rose-400 font-semibold">
                      ${(results.unboundedReflexion.annualizedTotalExpenseUSD / 1000).toFixed(1)}k annual loss
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.unboundedReflexion.replanningVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Replanning Latency: <strong className="text-rose-400">{(results.unboundedReflexion.avgReplanningLatencyMs / 1000).toFixed(1)}s</strong></div>
                    <div>Convergence: <strong className="text-rose-400">{results.unboundedReflexion.successfulConvergencePct}%</strong></div>
                    <div>Deadlock Risk: <strong className="text-rose-400">{results.unboundedReflexion.infiniteLoopDeadlockPct}%</strong></div>
                  </div>
                </div>

                {/* 2. Static Counter Circuit Breaker */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <h4 className="font-bold text-amber-300 text-sm">Static Counter Circuit Breaker (Max N Retries)</h4>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-semibold">
                      26.5% false abort rate
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.hardCircuitBreaker.replanningVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Replanning Latency: <strong className="text-amber-400">{(results.hardCircuitBreaker.avgReplanningLatencyMs / 1000).toFixed(1)}s</strong></div>
                    <div>Convergence: <strong className="text-amber-400">{results.hardCircuitBreaker.successfulConvergencePct}%</strong></div>
                    <div>Manual Triage: <strong className="text-amber-400">${results.hardCircuitBreaker.monthlyOperationalLossUSD.toLocaleString()}/mo</strong></div>
                  </div>
                </div>

                {/* 3. Elesium Bounded Deterministic Re-Planner */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <h4 className="font-bold text-cyan-300 text-sm">Elesium Bounded Deterministic Re-Planner</h4>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Recommended Enterprise Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    {results.boundedDeterministic.replanningVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-200 bg-slate-900/80 p-2 rounded-lg">
                    <div>Replanning Latency: <strong className="text-cyan-300">{(results.boundedDeterministic.avgReplanningLatencyMs / 1000).toFixed(2)}s</strong></div>
                    <div>Convergence: <strong className="text-emerald-400">{results.boundedDeterministic.successfulConvergencePct}%</strong></div>
                    <div>Deadlock Risk: <strong className="text-emerald-400">0.0%</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-16">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Dynamic Re-Planning Engineering Specification
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Architectural criteria governing autonomous plan generation, error boundary recovery, and cycle prevention.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3 px-4">Dimension</th>
                  <th className="py-3 px-4">Naive Reflexion</th>
                  <th className="py-3 px-4">Static Retry Counter</th>
                  <th className="py-3 px-4 text-cyan-400">Elesium Bounded Deterministic</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Re-Planning Latency Overhead</td>
                  <td className="py-3 px-4 font-mono text-rose-400">8,000ms - 18,000ms</td>
                  <td className="py-3 px-4 font-mono text-amber-400">3,600ms</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">&lt;1,800ms (Constrained Decoding)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Cyclic Deadlock Vulnerability</td>
                  <td className="py-3 px-4 font-mono text-rose-400">14.2% (Infinite Prompt Oscillation)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">0.0% (Via Hard Abort)</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">0.0% (DAG Cycle Detection)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Successful Task Convergence</td>
                  <td className="py-3 px-4 font-mono text-rose-400">78.5%</td>
                  <td className="py-3 px-4 font-mono text-amber-400">73.5%</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">99.4%</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Token Budget Governance</td>
                  <td className="py-3 px-4 font-mono text-rose-400">Unconstrained Exponential Growth</td>
                  <td className="py-3 px-4 font-mono text-slate-300">Fixed 2x Multiplier</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Token-Budgeted Delta Invariants</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Operational Triage Requirement</td>
                  <td className="py-3 px-4 font-mono text-rose-400">High (Dozens of Timed-out Runs)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">Extreme (26.5% Premature Aborts)</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Autonomous (0.6% Intervention)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-16">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Enterprise Dynamic Re-Planning Engineering FAQ
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Direct technical answers for Chief Technology Officers, AI Systems Architects, and Operations Leads.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commercial CTA & Architecture Audit Banner */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Enterprise AI Systems Architecture Intake
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eliminate Agent Deadlocks &amp; Re-Planning Latency
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Elesium architects deterministic, graph-constrained multi-agent systems with sub-1.8s dynamic re-planning and 99.4% task convergence for enterprise logistics, BFSI, and industrial telemetry infrastructure.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <Link
                to="/solutions"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
              >
                Explore All Sovereign Solutions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Embed This Re-Planning Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into your engineering documentation, intranet, or technical blog:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto mb-4 select-all">
              {embedCode}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Watermarked to Elesium Sovereign Architecture</span>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Code Copied!' : 'Copy Embed Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
