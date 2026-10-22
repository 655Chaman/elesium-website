import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Activity,
  Sliders,
  RefreshCw,
  GitBranch,
  ShieldAlert
} from 'lucide-react';
import {
  simulateAgentSelfHealing,
  AgentSelfHealingInputs
} from '../calculator/agentSelfHealingCanaryModel';

export default function EmbedAgentSelfHealingCanarySimulator() {
  const [monthlyProductionInvocations, setMonthlyProductionInvocations] = useState<number>(250000);
  const [avgAgentChainDepth, setAvgAgentChainDepth] = useState<number>(8);
  const [upstreamSchemaDriftEventsPerMonth, setUpstreamSchemaDriftEventsPerMonth] = useState<number>(12);
  const [costPerIncidentDowntimeUSD, setCostPerIncidentDowntimeUSD] = useState<number>(25000);
  const [costPerThousandTokensUSD] = useState<number>(0.005);

  const inputs: AgentSelfHealingInputs = useMemo(() => ({
    monthlyProductionInvocations,
    avgAgentChainDepth,
    upstreamSchemaDriftEventsPerMonth,
    costPerIncidentDowntimeUSD,
    costPerThousandTokensUSD
  }), [
    monthlyProductionInvocations,
    avgAgentChainDepth,
    upstreamSchemaDriftEventsPerMonth,
    costPerIncidentDowntimeUSD,
    costPerThousandTokensUSD
  ]);

  const results = useMemo(() => {
    return simulateAgentSelfHealing(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Agent Self-Healing Pipeline &amp; Regression Canary Simulator Sandbox</title>
        <meta
          name="description"
          content="Embeddable interactive simulator calculating autonomous agent self-healing recovery, statistical shadow canary drift detection, and automated rollback."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-self-healing-canary-simulator" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400 " />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent Self-Healing Pipeline &amp; Canary Simulator
            </h1>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            Interactive Model
          </span>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-cyan-500/30 bg-slate-900/60 text-center">
            <div className="text-[10px] font-mono text-cyan-400 uppercase">MTTR Acceleration</div>
            <div className="text-lg sm:text-xl font-black text-white mt-0.5">{results.mttrAccelerationFactor}x</div>
            <div className="text-[9px] text-slate-500">320ms vs 2 hrs</div>
          </div>
          <div className="p-3 rounded-xl border border-emerald-500/30 bg-slate-900/60 text-center">
            <div className="text-[10px] font-mono text-emerald-400 uppercase">Recovery Rate</div>
            <div className="text-lg sm:text-xl font-black text-emerald-300 mt-0.5">{results.sovereignCanary.pipelineRecoverySuccessPct}%</div>
            <div className="text-[9px] text-slate-500">Autonomous AST patch</div>
          </div>
          <div className="p-3 rounded-xl border border-purple-500/30 bg-slate-900/60 text-center">
            <div className="text-[10px] font-mono text-purple-400 uppercase">Annual Protected</div>
            <div className="text-lg sm:text-xl font-black text-purple-300 mt-0.5">${(results.annualCostSavingsUSD / 1000).toFixed(0)}k/yr</div>
            <div className="text-[9px] text-slate-500">Zero death-loop waste</div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Monthly Invocations:</span>
                <span className="font-mono text-cyan-400 font-semibold">{monthlyProductionInvocations.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={1000000}
                step={25000}
                value={monthlyProductionInvocations}
                onChange={(e) => setMonthlyProductionInvocations(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Sequential Chain Depth:</span>
                <span className="font-mono text-cyan-400 font-semibold">{avgAgentChainDepth} steps</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={avgAgentChainDepth}
                onChange={(e) => setAvgAgentChainDepth(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Monthly Schema Drift Events:</span>
                <span className="font-mono text-cyan-400 font-semibold">{upstreamSchemaDriftEventsPerMonth} events</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={upstreamSchemaDriftEventsPerMonth}
                onChange={(e) => setUpstreamSchemaDriftEventsPerMonth(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400">Cost per Outage Incident:</span>
                <span className="font-mono text-cyan-400 font-semibold">${costPerIncidentDowntimeUSD.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={75000}
                step={2500}
                value={costPerIncidentDowntimeUSD}
                onChange={(e) => setCostPerIncidentDowntimeUSD(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Comparison Rows */}
        <div className="space-y-2.5">
          {/* Sovereign Canary */}
          <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Elesium Sovereign Canary Pipeline</div>
                <div className="text-[10px] text-slate-400">MTTD 9s | MTTR 320ms | 0.02% cascade risk</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs font-bold text-emerald-400">
                ${results.sovereignCanary.annualizedTotalRiskCostUSD.toLocaleString()}/yr
              </div>
              <div className="text-[9px] text-slate-500">Autonomous recovery</div>
            </div>
          </div>

          {/* Naive Retry */}
          <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-300">Naive Exception Retry Loops</div>
                <div className="text-[10px] text-slate-500">MTTD 120 mins | MTTR 30 mins | 52% cascade risk</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-slate-400">
                ${results.naiveRetryLoop.annualizedTotalRiskCostUSD.toLocaleString()}/yr
              </div>
              <div className="text-[9px] text-amber-400/80">API quota death loops</div>
            </div>
          </div>

          {/* Unmonitored Monolith */}
          <div className="p-3 rounded-xl border border-rose-950/40 bg-rose-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-rose-300">Unmonitored Monolithic Rollout</div>
                <div className="text-[10px] text-rose-400/70">MTTD 24 hrs | MTTR 2 hrs | 88.5% cascade risk</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono text-xs text-rose-300">
                ${results.unmonitoredMonolith.annualizedTotalRiskCostUSD.toLocaleString()}/yr
              </div>
              <div className="text-[9px] text-rose-400">Catastrophic state corruption</div>
            </div>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="border-t border-slate-800/80 pt-3 text-right text-[11px] text-slate-500 font-sans">
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Elesium Sovereign AI Solutions
          </a>
        </div>
      </div>
    </div>
  );
}
