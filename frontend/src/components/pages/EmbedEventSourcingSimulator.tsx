import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import {
  calculateEventSourcingSimulation,
  EventSourcingInputs,
  FailureScenario,
  ComplianceFramework
} from '../calculator/eventSourcingSimulatorModel';

export default function EmbedEventSourcingSimulator() {
  const [transactionVolume, setTransactionVolume] = useState<number>(50000);
  const [concurrentAgents] = useState<number>(16);
  const [snapshotFrequency] = useState<number>(100);
  const [failureScenario, setFailureScenario] = useState<FailureScenario>('hallucinated_tool_call');
  const [complianceFramework, setComplianceFramework] = useState<ComplianceFramework>('dpdp_act_2023');

  const inputs: EventSourcingInputs = useMemo(() => ({
    transactionVolume,
    concurrentAgents,
    snapshotFrequency,
    failureScenario,
    complianceFramework
  }), [
    transactionVolume,
    concurrentAgents,
    snapshotFrequency,
    failureScenario,
    complianceFramework
  ]);

  const results = useMemo(() => {
    return calculateEventSourcingSimulation(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Multi-Agent Event Sourcing Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/event-sourcing-audit-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive Event Ledger Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Event Sourcing vs Mutable State Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">Recovery Point Objective</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono">
            {results.eventSourcingMetrics.recoveryPointObjectiveSeconds}.00s (Zero Loss)
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Volume: {transactionVolume.toLocaleString()} events
          </label>
          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={transactionVolume}
            onChange={(e) => setTransactionVolume(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Simulated Failure Mode
          </label>
          <select
            value={failureScenario}
            onChange={(e) => setFailureScenario(e.target.value as FailureScenario)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="hallucinated_tool_call">Agent Hallucinated Parameter</option>
            <option value="tampered_payload">Cryptographic Tamper Attack</option>
            <option value="concurrent_state_collision">Concurrent Write Collision</option>
            <option value="network_partition">Mid-Transaction Network Drop</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Statutory Framework
          </label>
          <select
            value={complianceFramework}
            onChange={(e) => setComplianceFramework(e.target.value as ComplianceFramework)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="dpdp_act_2023">DPDP Act 2023 (India)</option>
            <option value="soc2_type2">SOC-2 Type II Non-Repudiation</option>
            <option value="rbi_cybersecurity">RBI Cyber Security Framework</option>
          </select>
        </div>
      </div>

      {/* Metrics Comparison Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 font-mono text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[9px] uppercase">Forensic Replay</div>
          <div className="text-sm font-bold text-cyan-400">
            {results.eventSourcingMetrics.timeToRootCauseDiagnosisMinutes * 60}s <span className="text-[10px] text-slate-500 font-normal">vs {results.crudMetrics.timeToRootCauseDiagnosisMinutes}m</span>
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[9px] uppercase">Tamper Detection</div>
          <div className="text-sm font-bold text-emerald-400">
            {results.eventSourcingMetrics.tamperDetectionProbabilityPct}% (SHA-256)
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[9px] uppercase">Statutory Score</div>
          <div className="text-sm font-bold text-white">
            {results.eventSourcingMetrics.statutoryAuditReadinessScore} / 100
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-slate-500 text-[9px] uppercase">Annual Savings</div>
          <div className="text-sm font-bold text-purple-400">
            ${results.annualForensicSavingsUsd.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Diagnostic Note */}
      <div className="bg-slate-900/90 rounded-xl border border-slate-800 p-3 mb-4 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-slate-300 text-[11px] leading-snug">
            {results.forensicDiagnosticSummary}
          </span>
        </div>
      </div>

      {/* Backlink Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Non-Repudiable Event Store Architecture</span>
        </div>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
        >
          <span>Elesium Enterprise AI Solutions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
