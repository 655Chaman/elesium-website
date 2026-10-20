import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  GitFork,
  ShieldCheck
} from 'lucide-react';
import {
  simulateDynamicReplanning,
  DynamicReplanningInputs
} from '../calculator/agentDynamicReplanningSimulatorModel';

export default function EmbedAgentDynamicReplanningSimulator() {
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(250000);
  const [baselinePlanSteps, setBaselinePlanSteps] = useState<number>(14);
  const [environmentalEntropyPct, setEnvironmentalEntropyPct] = useState<number>(16.5);
  const [maxAllowedReflectionDepth] = useState<number>(4);
  const [costPerReflectionPassUSD] = useState<number>(0.18);

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

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Agent Dynamic Re-Planning Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-dynamic-replanning-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive Re-Planning Sandbox
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Autonomous Agent Dynamic Re-Planning Simulator
          </h2>
        </div>
        <div className="text-right">
          <a
            href="https://elesium.online/tools/enterprise-agent-dynamic-replanning-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <span>Full Simulator</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Monthly Runs</span>
            <span className="text-cyan-400 font-bold">{(monthlyWorkflows / 1000).toFixed(0)}k</span>
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
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Plan Steps</span>
            <span className="text-cyan-400 font-bold">{baselinePlanSteps}</span>
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
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Anomaly Rate</span>
            <span className="text-rose-400 font-bold">{environmentalEntropyPct.toFixed(1)}%</span>
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
        </div>
      </div>

      {/* Live Result Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Annual Savings</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Tokens &amp; Triage</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Convergence Rate</span>
          <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
            {results.boundedDeterministic.successfulConvergencePct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">+{results.convergenceImprovementPct}% lift</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Latency Cut</span>
          <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {results.latencyReductionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">{(results.boundedDeterministic.totalWorkflowLatencyMs / 1000).toFixed(1)}s vs {(results.unboundedReflexion.totalWorkflowLatencyMs / 1000).toFixed(1)}s</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Deadlock Risk</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            0.0%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">DAG Cycle Detection</span>
        </div>
      </div>

      {/* Architecture Snapshot Comparison */}
      <div className="space-y-2 mb-4 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <GitFork className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elesium Bounded Deterministic Re-Planner</span>
          </div>
          <span className="text-emerald-400 font-semibold">{results.boundedDeterministic.successfulConvergencePct}% Convergence | {(results.boundedDeterministic.avgReplanningLatencyMs / 1000).toFixed(2)}s Refinement</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Static Counter Circuit Breaker</span>
          </div>
          <span className="text-amber-400">26.5% False Abort Rate | ${(results.hardCircuitBreaker.monthlyOperationalLossUSD / 1000).toFixed(1)}k/mo Manual Triage</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Unbounded Self-Correction (Naive Reflexion)</span>
          </div>
          <span className="text-rose-400">{results.unboundedReflexion.infiniteLoopDeadlockPct}% Deadlock Risk | {(results.unboundedReflexion.avgReplanningLatencyMs / 1000).toFixed(1)}s Latency</span>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-1.8s Dynamic Re-Planning &amp; Zero Cyclic Deadlocks</span>
        </div>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/tools/enterprise-agent-dynamic-replanning-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Elesium Autonomous Architecture
          </a>
        </div>
      </div>
    </div>
  );
}
