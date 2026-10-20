import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Users,
  ShieldCheck
} from 'lucide-react';
import {
  simulateAgentConsensus,
  AgentConsensusInputs
} from '../calculator/agentConsensusSimulatorModel';

export default function EmbedAgentConsensusSimulator() {
  const [monthlyDecisions, setMonthlyDecisions] = useState<number>(150000);
  const [validatorAgentCount, setValidatorAgentCount] = useState<number>(5);
  const [adversarialOrDriftRatePct, setAdversarialOrDriftRatePct] = useState<number>(12.5);
  const [costPerDecisionTokenUSD] = useState<number>(0.12);
  const [maxAllowedConsensusLatencyMs] = useState<number>(1500);

  const inputs: AgentConsensusInputs = useMemo(() => ({
    monthlyDecisions,
    validatorAgentCount,
    adversarialOrDriftRatePct,
    costPerDecisionTokenUSD,
    maxAllowedConsensusLatencyMs
  }), [
    monthlyDecisions,
    validatorAgentCount,
    adversarialOrDriftRatePct,
    costPerDecisionTokenUSD,
    maxAllowedConsensusLatencyMs
  ]);

  const results = useMemo(() => {
    return simulateAgentConsensus(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Multi-Agent Consensus &amp; Byzantine Fault Tolerance Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-consensus-byzantine-fault-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive Consensus Quorum Sandbox
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Multi-Agent Consensus &amp; Byzantine Fault Tolerance Simulator
          </h2>
        </div>
        <div className="text-right">
          <a
            href="https://elesium.online/tools/enterprise-agent-consensus-byzantine-fault-simulator"
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
            <span className="text-slate-300">Monthly Decisions</span>
            <span className="text-cyan-400 font-bold">{(monthlyDecisions / 1000).toFixed(0)}k</span>
          </div>
          <input
            type="range"
            min={10000}
            max={500000}
            step={10000}
            value={monthlyDecisions}
            onChange={(e) => setMonthlyDecisions(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Validator Nodes</span>
            <span className="text-cyan-400 font-bold">{validatorAgentCount} Agents</span>
          </div>
          <input
            type="range"
            min={3}
            max={9}
            step={2}
            value={validatorAgentCount}
            onChange={(e) => setValidatorAgentCount(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Drift / Rogue Rate</span>
            <span className="text-rose-400 font-bold">{adversarialOrDriftRatePct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={2.0}
            max={25.0}
            step={0.5}
            value={adversarialOrDriftRatePct}
            onChange={(e) => setAdversarialOrDriftRatePct(Number(e.target.value))}
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
          <span className="text-[9px] text-slate-400 block mt-0.5">Tokens &amp; Risk Remediation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Accuracy Lift</span>
          <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
            99.98%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">+{results.hallucinationSuppressionPct}% suppression</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Latency Reduction</span>
          <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {results.latencyOverheadReductionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">+{results.sovereignBft.consensusLatencyOverheadMs}ms vs +{results.naiveMajority.consensusLatencyOverheadMs}ms</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">BFT Fault Quorum</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            {results.sovereignBft.byzantineToleranceThreshold} Nodes
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Simultaneous Rogue Tolerance</span>
        </div>
      </div>

      {/* Architecture Snapshot Comparison */}
      <div className="space-y-2 mb-4 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elesium Sovereign BFT Quorum</span>
          </div>
          <span className="text-emerald-400 font-semibold">{results.sovereignBft.decisionFailureOrHallucinationPct}% Error | +{results.sovereignBft.consensusLatencyOverheadMs}ms Verification</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Naive N-Way LLM Majority Voting</span>
          </div>
          <span className="text-amber-400">+{results.naiveMajority.consensusLatencyOverheadMs}ms Overhead | ${(results.naiveMajority.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr Token Multiplier</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Single-Agent Dictator Execution</span>
          </div>
          <span className="text-rose-400">{results.singleAgent.decisionFailureOrHallucinationPct}% Hallucination Risk | ${(results.singleAgent.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr Remediation</span>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-450ms BFT Verification &amp; 99.98% Accuracy</span>
        </div>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Elesium Sovereign AI Architecture
          </a>
        </div>
      </div>
    </div>
  );
}
