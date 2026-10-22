import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Layers,
  Coins,
  CheckCircle2,
  FileCode
} from 'lucide-react';
import {
  calculateSmartContractAudit,
  SmartContractInputs,
  FormalVerificationEngine,
  ZkProofSystem,
  VulnerabilityAttackSurface,
  MultiAgentAuditTopology
} from '../calculator/agentSmartContractModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentSmartContractSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [contractLinesOfCode, setContractLinesOfCode] = useState<number>(3200);
  const [formalVerificationEngine, setFormalVerificationEngine] = useState<FormalVerificationEngine>('certora_prover');
  const [zkProofSystem, setZkProofSystem] = useState<ZkProofSystem>('groth16_snark');
  const [vulnerabilityAttackSurface, setVulnerabilityAttackSurface] = useState<VulnerabilityAttackSurface>('reentrancy_flashloan');
  const [multiAgentAuditTopology, setMultiAgentAuditTopology] = useState<MultiAgentAuditTopology>('byzantine_trio_langgraph');
  const [totalValueLockedMillions, setTotalValueLockedMillions] = useState<number>(45);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SmartContractInputs = useMemo(() => ({
    contractLinesOfCode,
    formalVerificationEngine,
    zkProofSystem,
    vulnerabilityAttackSurface,
    multiAgentAuditTopology,
    totalValueLockedMillions,
    currency
  }), [
    contractLinesOfCode,
    formalVerificationEngine,
    zkProofSystem,
    vulnerabilityAttackSurface,
    multiAgentAuditTopology,
    totalValueLockedMillions,
    currency
  ]);

  const outputs = useMemo(() => calculateSmartContractAudit(inputs), [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-smart-contract-formal-verification-simulator" width="100%" height="750" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-smart-contract-formal-verification-simulator" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Web3 Formal Verification Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `=== ELESIUM WEB3 SMART CONTRACT FORMAL VERIFICATION SIMULATION ===
Lines of Code: ${contractLinesOfCode.toLocaleString()} LOC
Formal Verification Engine: ${formalVerificationEngine.replace(/_/g, ' ').toUpperCase()}
ZK Proof System: ${zkProofSystem.replace(/_/g, ' ').toUpperCase()}
Audit Topology: ${multiAgentAuditTopology.replace(/_/g, ' ').toUpperCase()}
Total Value Locked: $${totalValueLockedMillions}M USD

--- PERFORMANCE & VERIFICATION BENCHMARKS ---
Verification Latency: ${outputs.verificationLatencySeconds} seconds
Mathematical Invariant Coverage: ${outputs.invariantCoveragePct}%
Exploit Interception Rate: ${outputs.exploitInterceptionRatePct}%
Gas Optimization Savings: ${outputs.gasOptimizationSavingsGwei.toLocaleString()} Gwei
Annual Value-at-Risk Mitigated: ${outputs.annualValueAtRiskMitigated}
Verification Status: ${outputs.formalVerificationStatus}

Architecture Validated: https://elesium.online/tools/enterprise-agent-smart-contract-formal-verification-simulator`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "How does mathematical formal verification differ from standard LLM prompt auditing?",
      a: "Standard LLM prompts test code probabilistically and hallucinate non-existent issues while missing subtle reentrancy or state-transition bugs. Formal verification converts smart contract bytecodes into SMT-LIB mathematical equations (Satisfiability Modulo Theories). Solvers mathematically prove whether an invariant can ever be violated under any conceivable execution path."
    },
    {
      q: "What is the Byzantine Trio LangGraph audit topology?",
      a: "The Byzantine Trio coordinates three isolated agents: an Attack Fuzzer generating malicious payload sequences, an Invariant Prover solving formal constraints, and an Arbitrator verifying cryptographic execution traces. A proposal requires 2/3 consensus before an invariant is marked formally proven."
    },
    {
      q: "Can zero-knowledge proof generation run inside a sovereign enterprise VPC?",
      a: "Yes. Using Groth16 or Plonk with SnarkJS and native Rust halo2 binaries, proof generation and verification keys run entirely on-premise or within an air-gapped private VPC with zero data or circuit logic egress."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Agentic Web3 Smart Contract Formal Verification & ZK-Audit Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate automated smart contract formal verification, SMT solver constraint proving, zero-knowledge proof generation, and Value-at-Risk mitigation."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-smart-contract-formal-verification-simulator" />
      </Helmet>

      <div className="min-h-screen bg-[#07090e] text-slate-100 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-10 text-center sm:text-left flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800/50 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Tool #47 // Web3 Formal Verification Simulator</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Enterprise Smart Contract Formal Verification & ZK-Audit Simulator
              </h1>
              <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
                Simulate automated SMT theorem proving, AST constraint solving, zero-knowledge proof generation, and exploit interception across decentralized finance protocols.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 transition"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Embed Simulator</span>
              </button>
              <button
                onClick={copyExecutiveMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/40 hover:bg-cyan-800/60 border border-cyan-700/60 text-xs font-medium text-cyan-300 transition"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
              </button>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Inputs Panel (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Protocol Parameters</span>
                </h2>
                <div className="flex bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'INR' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'USD' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Lines of Code */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contract Lines of Code (LOC)</span>
                  </label>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    {contractLinesOfCode.toLocaleString()} LOC
                  </span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="15000"
                  step="100"
                  value={contractLinesOfCode}
                  onChange={(e) => setContractLinesOfCode(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Selector 1: Formal Verification Engine */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Formal Verification Theorem Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'certora_prover', label: 'Certora Prover', sub: 'SMT-LIB solving' },
                    { id: 'halmos_symbolic', label: 'Halmos Symbolic', sub: 'Bytecode symbolic' },
                    { id: 'slither_static', label: 'Slither Static', sub: 'Fast AST heuristics' },
                    { id: 'coq_interactive', label: 'Coq Interactive', sub: 'Mathematical proof' }
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => setFormalVerificationEngine(engine.id as FormalVerificationEngine)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        formalVerificationEngine === engine.id
                          ? 'bg-cyan-950/50 border-cyan-500/80 text-white shadow-sm shadow-cyan-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{engine.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{engine.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: ZK Proof System */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Zero-Knowledge Proof Circuit System
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'groth16_snark', label: 'Groth16 SNARK', sub: 'Ultra-fast verifier' },
                    { id: 'plonk_halo2', label: 'PLONK / Halo2', sub: 'Universal setup' },
                    { id: 'stark_fri', label: 'STARK / FRI', sub: 'Post-quantum secure' },
                    { id: 'bulletproofs', label: 'Bulletproofs', sub: 'Zero trusted setup' }
                  ].map((zk) => (
                    <button
                      key={zk.id}
                      onClick={() => setZkProofSystem(zk.id as ZkProofSystem)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        zkProofSystem === zk.id
                          ? 'bg-cyan-950/50 border-cyan-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{zk.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{zk.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2b: Vulnerability Attack Surface */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Target Attack Vector & Surface
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'reentrancy_flashloan', label: 'Flashloan Reentrancy', sub: 'Read-only & cross-function' },
                    { id: 'oracle_manipulation', label: 'Oracle Manipulation', sub: 'TWAP & spot pool skew' },
                    { id: 'access_control_governance', label: 'Access Control & Timelock', sub: 'Storage collision & multisig' },
                    { id: 'overflow_arithmetic', label: 'Arithmetic & Precision', sub: 'Integer truncation & rounding' }
                  ].map((surface) => (
                    <button
                      key={surface.id}
                      onClick={() => setVulnerabilityAttackSurface(surface.id as VulnerabilityAttackSurface)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        vulnerabilityAttackSurface === surface.id
                          ? 'bg-cyan-950/50 border-cyan-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{surface.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{surface.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Multi-Agent Audit Topology */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Multi-Agent Audit Topology
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'byzantine_trio_langgraph', label: 'Byzantine Trio (LangGraph DAG)', sub: 'Attack Fuzzer + Invariant Prover + Arbitrator with 2/3 consensus' },
                    { id: 'parallel_fuzzing_pod', label: 'Parallel Symbolic Fuzzing Pod', sub: 'Echidna / Medusa property fuzzing with automated invariant generation' },
                    { id: 'monolithic_llm_checker', label: 'Monolithic LLM Single-Pass Checker', sub: 'Direct prompt heuristics (prone to false negatives)' }
                  ].map((top) => (
                    <button
                      key={top.id}
                      onClick={() => setMultiAgentAuditTopology(top.id as MultiAgentAuditTopology)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                        multiAgentAuditTopology === top.id
                          ? 'bg-cyan-950/50 border-cyan-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{top.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{top.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Slider 2: TVL */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-400" />
                    <span>Total Value Locked (TVL)</span>
                  </label>
                  <span className="text-xs font-mono text-cyan-400 font-bold">
                    ${totalValueLockedMillions}M USD
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="250"
                  step="1"
                  value={totalValueLockedMillions}
                  onChange={(e) => setTotalValueLockedMillions(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>
            </div>

            {/* Results Panel (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Classification Status Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    Verification State Classification
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold ${
                    outputs.formalVerificationStatus === 'MATHEMATICALLY_PROVEN_IMMUTABLE'
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                      : outputs.formalVerificationStatus === 'BOUNDED_SECURITY_HIGH'
                      ? 'bg-cyan-950/80 border border-cyan-500/60 text-cyan-300'
                      : 'bg-amber-950/80 border border-amber-500/60 text-amber-300'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{outputs.formalVerificationStatus.replace(/_/g, ' ')}</span>
                  </span>
                </div>

                {/* 4 Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-[11px] text-slate-400">Verification Latency</div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-cyan-400 mt-1">
                      {outputs.verificationLatencySeconds}s
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">SMT solving cycle</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-[11px] text-slate-400">Invariant Coverage</div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-emerald-400 mt-1">
                      {outputs.invariantCoveragePct}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">State space proven</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-[11px] text-slate-400">Exploit Interception</div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-purple-400 mt-1">
                      {outputs.exploitInterceptionRatePct}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Zero-day resistance</div>
                  </div>
                  <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-[11px] text-slate-400">VaR Mitigated</div>
                    <div className="text-lg sm:text-xl font-bold font-mono text-amber-400 mt-1">
                      {outputs.annualValueAtRiskMitigated}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Capital protected</div>
                  </div>
                </div>

                {/* Verification Pipeline Execution Trace */}
                <div className="border-t border-slate-800/80 pt-4">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Automated Verification Pipeline Stages</span>
                    <span className="text-cyan-400">LangGraph DAG</span>
                  </div>
                  <div className="space-y-2">
                    {outputs.verificationTrace.map((stage) => (
                      <div key={stage.stage} className="flex items-center justify-between text-xs bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/60">
                        <div className="flex items-center gap-2 text-slate-300">
                          <span className="font-mono text-cyan-400 text-[10px] bg-cyan-950/80 border border-cyan-800/60 px-1.5 py-0.5 rounded">
                            Stage 0{stage.stage}
                          </span>
                          <span className="font-medium">{stage.stageName}</span>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-slate-400">{stage.latencySeconds}s</span>
                          <span className="text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded text-[10px]">
                            {stage.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical Architecture Schema Card */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>Sovereign VPC Multi-Agent Verification Architecture</span>
                </h3>
                <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <p>
                    • <strong className="text-cyan-300">Deterministic SMT Solver Integration:</strong> Parses Solidity and Vyper ASTs into Z3 and CVC5 constraint systems, mathematically ruling out reentrancy, integer anomalies, and unauthorized state changes.
                  </p>
                  <p>
                    • <strong className="text-cyan-300">Zero-Knowledge Circuit Proofs:</strong> Generates succinct non-interactive arguments of knowledge (ZK-SNARKs/STARKs) verifying state transitions without revealing proprietary trading algorithms or private liquidity pools.
                  </p>
                  <p>
                    • <strong className="text-cyan-300">Private Cloud & Air-Gapped Operation:</strong> The entire verification pipeline executes inside sovereign private VPCs with zero external RPC telemetry leakage, guaranteeing compliance with enterprise data security frameworks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-12 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4">
              Frequently Asked Questions // Smart Contract Formal Verification
            </h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 bg-slate-950/50 hover:bg-slate-900/80 flex justify-between items-center transition"
                  >
                    <span className="text-sm font-semibold text-slate-200">{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 bg-slate-950/30 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mandate Application Form */}
          <div className="mt-12 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8">
            <div className="text-center max-w-xl mx-auto mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Deploy Formal Verification Agents in Your Sovereign VPC
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Schedule an architectural audit with our engineering team to integrate mathematical theorem proving into your continuous delivery pipeline.
              </p>
            </div>
            {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Direct Lead Architect Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Ready to Lock These Simulation Benchmarks in Production?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with our Principal Systems Architect on WhatsApp. We provide a tailored 1-page feasibility memorandum and deterministic VPC architecture blueprint.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openWhatsApp()}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Chat on WhatsApp with Lead Architect</span>
            </button>
          </div>
        </div>

        <MandateApplicationForm />
          </div>

          {/* Embed Modal */}
          {isEmbedOpen && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span>Embed Formal Verification Simulator</span>
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Copy and paste this iframe snippet onto your technical documentation, blog, or internal portal.
                </p>
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 break-all select-all mb-4">
                  {embedCode}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEmbedOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyEmbed}
                    className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Iframe Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <ExitIntentMemoModal
            toolName="Web3 Smart Contract Formal Verification Simulator"
            simulatedMetrics={[
              { label: 'Verification Latency', value: `${outputs.verificationLatencySeconds} s` },
              { label: 'Invariant Coverage', value: `${outputs.invariantCoveragePct}%` },
              { label: 'Exploit Interception', value: `${outputs.exploitInterceptionRatePct}%` },
              { label: 'Annual VaR Mitigated', value: outputs.annualValueAtRiskMitigated }
            ]}
          />
        </div>
      </div>
          <WhatsAppModal />
    </>
  );
}
