import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Users,
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
  simulateAgentConsensus,
  AgentConsensusInputs
} from '../calculator/agentConsensusSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentConsensusSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyDecisions, setMonthlyDecisions] = useState<number>(150000);
  const [validatorAgentCount, setValidatorAgentCount] = useState<number>(5);
  const [adversarialOrDriftRatePct, setAdversarialOrDriftRatePct] = useState<number>(12.5);
  const [costPerDecisionTokenUSD, setCostPerDecisionTokenUSD] = useState<number>(0.12);
  const [maxAllowedConsensusLatencyMs] = useState<number>(1500);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCode = `<iframe src="https://elesium.online/embed/agent-consensus-byzantine-fault-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE MULTI-AGENT CONSENSUS & BYZANTINE FAULT TOLERANCE MEMO
Workload Profile: ${(inputs.monthlyDecisions / 1000).toFixed(0)}k decisions/mo | ${inputs.validatorAgentCount} Validator Nodes | ${inputs.adversarialOrDriftRatePct}% Raw Drift Rate

ARCHITECTURAL COMPARISON:
1. Single-Agent Dictator Execution (Zero Consensus):
   - Latency Overhead: 0.0ms | Decision Failure Risk: ${results.singleAgent.decisionFailureOrHallucinationPct}%
   - Annual Remediation Loss: $${results.singleAgent.annualizedTotalCostUSD.toLocaleString()}
2. Naive N-Way LLM Majority Voting & Judge:
   - Consensus Latency Overhead: +${results.naiveMajority.consensusLatencyOverheadMs}ms (P99: ${results.naiveMajority.effectiveDecisionLatencyMs}ms)
   - Annual Token & Risk Expense: $${results.naiveMajority.annualizedTotalCostUSD.toLocaleString()} (${inputs.validatorAgentCount + 1}x token multiplier)
3. Elesium Sovereign BFT State-Machine Quorum:
   - Consensus Latency Overhead: +${results.sovereignBft.consensusLatencyOverheadMs}ms [${results.latencyOverheadReductionPct}% faster vs naive voting]
   - Decision Error Rate: ${results.sovereignBft.decisionFailureOrHallucinationPct}% [${results.hallucinationSuppressionPct}% hallucination suppression]
   - Byzantine Fault Tolerance: ${results.sovereignBft.byzantineToleranceThreshold} simultaneous rogue/compromised nodes
   - Net Annual Token & Risk Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Deploy sovereign BFT state-machine quorum over naive LLM majority voting for mission-critical enterprise workflows.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why is single-agent decision-making unacceptable for enterprise-critical workflows?',
      a: 'Even frontier LLMs exhibit a 5% to 18% hallucination and reasoning drift rate when executing complex, multi-variable logic. In high-stakes enterprise applications—such as automated loan underwriting, algorithmic trade settlement, industrial turbine load balancing, or healthcare pre-authorizations—a single hallucinated JSON parameter can trigger millions of dollars in regulatory fines or operational downtime. Relying on a single agent creates an unmitigated single point of cognitive failure.'
    },
    {
      q: 'Why does naive N-way majority voting fail in high-throughput enterprise systems?',
      a: 'Naive multi-agent consensus prompts 3 to 7 identical or peer LLM agents with the same input, collects their verbose textual outputs, and prompts a meta-LLM ("LLM-as-a-judge") to arbitrate the winner. This pattern inflates end-to-end P99 latency by 4,000ms to 6,000ms, quadruples API token costs, and remains vulnerable to correlated hallucination if the underlying prompt triggers common model training blindspots.'
    },
    {
      q: 'How does Elesium achieve sub-450ms Byzantine fault-tolerant consensus?',
      a: 'Elesium decouples proposal generation from validation. Specialized, lightweight heterogeneous agents generate deterministic candidate execution plans. An in-memory Byzantine Fault-Tolerant (BFT) state machine validates the candidates against formal mathematical invariant rules and computes cryptographic vote hashes. Quorum verification completes in under 450ms without waiting for slow conversational LLM-as-a-judge rounds.'
    },
    {
      q: 'What is the Byzantine fault threshold of this architecture?',
      a: 'In a validator cluster of size N, the system mathematically guarantees decision integrity as long as at least 2f + 1 honest nodes agree, where f = floor((N - 1) / 3). For a 5-node cluster, the system tolerates rogue, hallucinating, or compromised agent nodes without corrupting the downstream database or executing unauthorized external side-effects.'
    },
    {
      q: 'Can this consensus protocol integrate with human-in-the-loop escalation?',
      a: 'Yes. If the validator nodes fail to achieve supermajority quorum within the 450ms window (e.g. split vote between two mutually exclusive execution branches), the state machine halts downstream tool actions and automatically dispatches an asynchronous escalation event to human supervisors with a structured diff of the competing agent proposals.'
    },
    {
      q: 'Where does the consensus engine run in an enterprise deployment?',
      a: 'The entire consensus cluster operates air-gapped within your sovereign private cloud (AWS VPC, Azure Private Link, GCP Cloud, or on-premises Kubernetes). Validator weights and cryptographic state invariants are governed by local configuration with zero external telemetry leakage.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Helmet>
        <title>Enterprise Multi-Agent Consensus &amp; Byzantine Fault Tolerance Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark multi-agent consensus architectures: single-agent execution vs naive majority voting vs sovereign BFT state-machine quorum. Calculate sub-450ms verification, 99.98% decision accuracy, and zero rogue agent risk."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-consensus-byzantine-fault-simulator" />
      </Helmet>

      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-white transition-colors">Interactive Tools</Link>
            <span>/</span>
            <span className="text-cyan-400 font-mono">Multi-Agent Consensus Simulator</span>
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
            <Users className="w-3.5 h-3.5" />
            Distributed Multi-Agent Consensus &amp; Byzantine Fault Tolerance Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Enterprise Multi-Agent Consensus &amp; Byzantine Fault Tolerance Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Simulate and benchmark multi-agent consensus protocols across mission-critical enterprise workflows. Contrast single-agent hallucinations against naive LLM majority voting and sovereign BFT state-machine quorum with sub-450ms verification and 99.98% decision accuracy.
          </p>
        </div>

        {/* Primary Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Consensus &amp; Quorum Parameters</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Production Model</span>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Monthly Decisions */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Monthly Mission-Critical Decisions</span>
                  <span className="text-cyan-400 font-bold">{monthlyDecisions.toLocaleString()} decisions</span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>10k /mo</span>
                  <span>250k</span>
                  <span>500k decisions/mo</span>
                </div>
              </div>

              {/* Slider 2: Validator Nodes */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Validator Agent Nodes (Quorum Cluster)</span>
                  <span className="text-cyan-400 font-bold">{validatorAgentCount} agents (N)</span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>3 Nodes (Fast)</span>
                  <span>5 Nodes (Enterprise)</span>
                  <span>9 Nodes (Mission-Critical)</span>
                </div>
              </div>

              {/* Slider 3: Adversarial Drift Rate */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Raw Node Hallucination / Drift Rate</span>
                  <span className="text-rose-400 font-bold">{adversarialOrDriftRatePct.toFixed(1)}% vulnerability</span>
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
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>2.0% (Tuned Prompts)</span>
                  <span>12.5% (Production Average)</span>
                  <span>25.0% (High Entropy)</span>
                </div>
              </div>

              {/* Slider 4: Baseline Token Cost */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Baseline Decision Token Cost</span>
                  <span className="text-emerald-400 font-bold">${costPerDecisionTokenUSD.toFixed(2)} / decision</span>
                </div>
                <input
                  type="range"
                  min={0.02}
                  max={0.40}
                  step={0.02}
                  value={costPerDecisionTokenUSD}
                  onChange={(e) => setCostPerDecisionTokenUSD(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>$0.02 (Fast Model)</span>
                  <span>$0.12 (Standard LLM)</span>
                  <span>$0.40 (Deep Reasoning)</span>
                </div>
              </div>
            </div>

            {/* Architecture Key Insights */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Sub-450ms Verification:</strong> Replaces conversational LLM judges with deterministic state-machine invariant checks.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Byzantine Fault Tolerance:</strong> Guarantees decision safety with up to {results.sovereignBft.byzantineToleranceThreshold} simultaneous rogue/compromised nodes.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">68% Token Savings:</strong> Uses targeted validation probes instead of re-running full conversational context across every agent.</span>
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
                  Tokens &amp; Risk Slashed
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Hallucination Cut
                </span>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono block">
                  {results.hallucinationSuppressionPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {results.sovereignBft.decisionFailureOrHallucinationPct}% vs {results.singleAgent.decisionFailureOrHallucinationPct}%
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Latency Speedup
                </span>
                <span className="text-xl sm:text-2xl font-bold text-purple-400 font-mono block">
                  {results.latencyOverheadReductionPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  +{results.sovereignBft.consensusLatencyOverheadMs}ms vs +{results.naiveMajority.consensusLatencyOverheadMs}ms
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  BFT Tolerance
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block">
                  {results.sovereignBft.byzantineToleranceThreshold} Nodes
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tolerates Rogue Outliers
                </span>
              </div>
            </div>

            {/* Interactive Quorum Execution Visualizer */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    Byzantine Quorum Verification Mechanics
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  Sub-450ms Consensus
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">1. Proposer Agent</span>
                      <span className="font-mono text-[10px] text-emerald-400">Node #1</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Emits structured JSON action proposal with cryptographic payload hash.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 relative">
                    <div className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-cyan-500 text-black font-mono text-[9px] font-bold">
                      BFT Quorum
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-cyan-300">2. Validator Mesh</span>
                      <span className="font-mono text-[10px] text-cyan-400">{validatorAgentCount - 1} Peers</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Parallel invariant evaluation; asserts boundary rules and casts signed vote.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-emerald-300">3. Verified Commit</span>
                      <span className="font-mono text-[10px] text-emerald-400">&lt;450ms</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Supermajority locked; external side-effect dispatched with 99.98% certainty.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Decision Failure Rate: <strong>0.02%</strong> (Sovereign BFT) vs <strong>{adversarialOrDriftRatePct}%</strong> (Single Agent)</span>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px]">99.98% Fidelity</span>
                </div>
              </div>
            </div>

            {/* Architectural Comparison Matrix */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 mb-4">
                Architecture Benchmark Breakdown
              </h3>

              <div className="space-y-4">
                {/* 1. Single Agent */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <h4 className="font-bold text-rose-300 text-sm">Single-Agent Dictator Execution (Zero Consensus)</h4>
                    </div>
                    <span className="font-mono text-xs text-rose-400 font-semibold">
                      ${(results.singleAgent.annualizedTotalCostUSD / 1000).toFixed(1)}k annual risk
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.singleAgent.consensusVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Consensus Delay: <strong className="text-white">0.0ms</strong></div>
                    <div>Failure Rate: <strong className="text-rose-400">{results.singleAgent.decisionFailureOrHallucinationPct}%</strong></div>
                    <div>Byzantine Tolerance: <strong className="text-rose-400">0 Nodes</strong></div>
                  </div>
                </div>

                {/* 2. Naive N-Way Majority Voting */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <h4 className="font-bold text-amber-300 text-sm">Naive N-Way LLM Majority Voting &amp; Judge</h4>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-semibold">
                      +{results.naiveMajority.consensusLatencyOverheadMs}ms latency
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.naiveMajority.consensusVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Consensus Delay: <strong className="text-amber-400">+{results.naiveMajority.consensusLatencyOverheadMs}ms</strong></div>
                    <div>Monthly Token Bill: <strong className="text-amber-400">${results.naiveMajority.monthlyTokenExpenseUSD.toLocaleString()}/mo</strong></div>
                    <div>Failure Rate: <strong className="text-amber-400">{results.naiveMajority.decisionFailureOrHallucinationPct}%</strong></div>
                  </div>
                </div>

                {/* 3. Elesium Sovereign BFT */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <h4 className="font-bold text-cyan-300 text-sm">Elesium Sovereign BFT State-Machine Quorum</h4>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Recommended Enterprise Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    {results.sovereignBft.consensusVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-200 bg-slate-900/80 p-2 rounded-lg">
                    <div>Consensus Delay: <strong className="text-cyan-300">+{results.sovereignBft.consensusLatencyOverheadMs}ms</strong></div>
                    <div>Failure Rate: <strong className="text-emerald-400">{results.sovereignBft.decisionFailureOrHallucinationPct}%</strong></div>
                    <div>Byzantine Tolerance: <strong className="text-emerald-400">{results.sovereignBft.byzantineToleranceThreshold} Nodes</strong></div>
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
              Multi-Agent Consensus Engineering Specification
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Rigorous criteria separating unverified agent scripts from fault-tolerant enterprise consensus clusters.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3 px-4">Dimension</th>
                  <th className="py-3 px-4">Single-Agent Dictator</th>
                  <th className="py-3 px-4">Naive LLM Majority Voting</th>
                  <th className="py-3 px-4 text-cyan-400">Elesium Sovereign BFT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Consensus Latency Overhead</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">0.0ms (Zero Verification)</td>
                  <td className="py-3 px-4 font-mono text-rose-400">+3,500ms to +6,000ms</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">+420ms (FSM Verification)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Decision Hallucination Risk</td>
                  <td className="py-3 px-4 font-mono text-rose-400">12.5% - 25.0% Raw Drift</td>
                  <td className="py-3 px-4 font-mono text-amber-400">2.0% - 4.5% Correlated Error</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">&lt;0.02% (Invariant Guardrails)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Token Spend Multiplier</td>
                  <td className="py-3 px-4 font-mono text-slate-300">1.0x Baseline</td>
                  <td className="py-3 px-4 font-mono text-rose-400">N + 1 Multiplier (4x to 8x)</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">1.45x (Selective Probes)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Byzantine Fault Resistance</td>
                  <td className="py-3 px-4 font-mono text-rose-400">0 Faulty Nodes (Fragile)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">Simple Majority ((N-1)/2)</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Formal BFT ((N-1)/3 Quorum)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Arbitration Mechanism</td>
                  <td className="py-3 px-4 font-mono text-slate-400">None</td>
                  <td className="py-3 px-4 font-mono text-rose-400">Conversational LLM Judge</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Cryptographic Vote Hashes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-16">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Enterprise Agent Consensus Engineering FAQ
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Direct technical answers for Chief Technology Officers, AI Systems Architects, and Security Engineers.
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
              Eliminate Agent Hallucinations in Mission-Critical Systems
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Elesium architects sovereign, Byzantine fault-tolerant multi-agent systems with sub-450ms consensus verification and 99.98% decision accuracy for enterprise BFSI, aerospace, and sovereign defense infrastructure.
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
              Embed This Consensus Simulator
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
