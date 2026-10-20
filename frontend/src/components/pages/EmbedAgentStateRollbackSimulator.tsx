import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import {
  simulateStateRollback,
  StateRollbackInputs
} from '../calculator/agentStateRollbackSimulatorModel';

export default function EmbedAgentStateRollbackSimulator() {
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(350000);
  const [nodesPerWorkflow, setNodesPerWorkflow] = useState<number>(20);
  const [statePayloadSizeBytes] = useState<number>(65536);
  const [failureOrInterventionRatePct, setFailureOrInterventionRatePct] = useState<number>(8.5);
  const [avgRerunTokenCostUSD] = useState<number>(0.35);

  const inputs: StateRollbackInputs = useMemo(() => ({
    monthlyWorkflows,
    nodesPerWorkflow,
    statePayloadSizeBytes,
    failureOrInterventionRatePct,
    avgRerunTokenCostUSD
  }), [
    monthlyWorkflows,
    nodesPerWorkflow,
    statePayloadSizeBytes,
    failureOrInterventionRatePct,
    avgRerunTokenCostUSD
  ]);

  const results = useMemo(() => {
    return simulateStateRollback(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Agent State Machine Snapshot &amp; Rollback Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-state-snapshot-rollback-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive State Machine Sandbox
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Agent State Machine Snapshot &amp; Rollback Simulator
          </h2>
        </div>
        <div className="text-right">
          <a
            href="https://elesium.online/tools/enterprise-agent-state-snapshot-rollback-simulator"
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
            <span className="text-slate-300">Monthly Workflows</span>
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
            <span className="text-slate-300">Nodes / DAG</span>
            <span className="text-cyan-400 font-bold">{nodesPerWorkflow}</span>
          </div>
          <input
            type="range"
            min={6}
            max={50}
            step={2}
            value={nodesPerWorkflow}
            onChange={(e) => setNodesPerWorkflow(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Rollback Rate</span>
            <span className="text-rose-400 font-bold">{failureOrInterventionRatePct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={25.0}
            step={0.5}
            value={failureOrInterventionRatePct}
            onChange={(e) => setFailureOrInterventionRatePct(Number(e.target.value))}
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
          <span className="text-[9px] text-slate-400 block mt-0.5">Tokens &amp; IOPS</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Rollback Speedup</span>
          <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {results.recoveryTurnaroundReductionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">&lt;12ms vs {(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Critical Latency Cut</span>
          <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
            {results.latencyOverheadReductionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">+{results.sovereignDeltaWal.totalWorkflowLatencyOverheadMs}ms vs +{results.syncRelational.totalWorkflowLatencyOverheadMs}ms</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Storage Compaction</span>
          <span className="text-base sm:text-lg font-bold text-cyan-300 font-mono">
            93.5%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Delta Patch WAL</span>
        </div>
      </div>

      {/* Architecture Snapshot Comparison */}
      <div className="space-y-2 mb-4 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elesium Sovereign Delta WAL Checkpointer</span>
          </div>
          <span className="text-emerald-400 font-semibold">{results.sovereignDeltaWal.rollbackRecoveryTurnaroundMs}ms Rollback | +{results.sovereignDeltaWal.perNodeCommitOverheadMs}ms Commit</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Synchronous Postgres JSONB Checkpointer</span>
          </div>
          <span className="text-amber-400">+{results.syncRelational.perNodeCommitOverheadMs}ms Commit | {(results.syncRelational.monthlyStorageFootprintMB / 1024).toFixed(1)} GB</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Volatile In-Memory Mesh (Uncheckpointed)</span>
          </div>
          <span className="text-rose-400">{(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s Full Re-Run | ${results.volatileMesh.monthlyWastedRerunTokensUSD.toLocaleString()}/mo</span>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-1.5ms Delta WAL &amp; Microsecond Rollback</span>
        </div>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/tools/enterprise-agent-state-snapshot-rollback-simulator"
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
