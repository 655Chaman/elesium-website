import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Cpu,
  Layers,
  Lock,
  FileCheck
} from 'lucide-react';
import {
  simulateAgentZkAttestation,
  AgentZkAttestationInputs
} from '../calculator/agentZkAttestationModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentZkAttestationSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [dailyAgentStateTransitionsThousands, setDailyAgentStateTransitionsThousands] = useState<number>(50);
  const [avgContextTokensPerTransition, setAvgContextTokensPerTransition] = useState<number>(2048);
  const [circuitConstraintScale, setCircuitConstraintScale] = useState<number>(262144);
  const [verifierNodeComputeCostUSDPerHour, setVerifierNodeComputeCostUSDPerHour] = useState<number>(1.20);
  const [provingHardwareAcceleration, setProvingHardwareAcceleration] = useState<'cpu_multithread' | 'gpu_cuda_accelerated'>('gpu_cuda_accelerated');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AgentZkAttestationInputs = useMemo(() => ({
    dailyAgentStateTransitionsThousands,
    avgContextTokensPerTransition,
    circuitConstraintScale,
    verifierNodeComputeCostUSDPerHour,
    provingHardwareAcceleration
  }), [
    dailyAgentStateTransitionsThousands,
    avgContextTokensPerTransition,
    circuitConstraintScale,
    verifierNodeComputeCostUSDPerHour,
    provingHardwareAcceleration
  ]);

  const results = useMemo(() => {
    return simulateAgentZkAttestation(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-zk-attestation-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AUTONOMOUS AGENT ZERO-KNOWLEDGE PROOF STATE ATTESTATION MEMO
Workload Profile: ${inputs.dailyAgentStateTransitionsThousands}k state transitions/day | ${inputs.circuitConstraintScale.toLocaleString()} R1CS constraints | Prover: ${inputs.provingHardwareAcceleration === 'gpu_cuda_accelerated' ? 'GPU CUDA Accelerated' : 'CPU Multithread'}

CRYPTOGRAPHIC AUDIT COMPARISON:
1. Legacy Full State Logging (Unencrypted):
   - Proof / Payload Size: ${(results.fullStateLog.proofPayloadSizeBytes / 1024).toFixed(1)} KB
   - Verifier Latency: ${results.fullStateLog.verifierLatencyMs} ms
   - PII / Context Leakage Risk: ${results.fullStateLog.piiExposureRiskPct}%
   - Annual Operating Cost: $${results.fullStateLog.annualizedTotalCostUSD.toLocaleString()}
   - Compliance: ${results.fullStateLog.complianceStanding}
2. Merkle Hash State Rollup (SHA-256):
   - Proof / Payload Size: ${(results.merkleRollup.proofPayloadSizeBytes / 1024).toFixed(1)} KB
   - Verifier Latency: ${results.merkleRollup.verifierLatencyMs} ms
   - PII / Context Leakage Risk: ${results.merkleRollup.piiExposureRiskPct}%
   - Annual Operating Cost: $${results.merkleRollup.annualizedTotalCostUSD.toLocaleString()}
   - Compliance: ${results.merkleRollup.complianceStanding}
3. Elesium Sovereign ZK-SNARK Attestation (BN254 Pairing):
   - Proof / Payload Size: ${results.sovereignZkSnark.proofPayloadSizeBytes} bytes (${results.payloadCompressionFactor}x payload compression)
   - Verifier Latency: ${results.sovereignZkSnark.verifierLatencyMs} ms (${results.verificationLatencyCutPct}% latency reduction)
   - PII / Context Leakage Risk: ${results.sovereignZkSnark.piiExposureRiskPct}% (Zero-Knowledge Guaranteed)
   - Net Annual Infrastructure Savings: $${results.annualSavingsUSD.toLocaleString()}
   - Compliance: ${results.sovereignZkSnark.complianceStanding}

RECOMMENDATION: Deploy sovereign Groth16/PlonK pairing proofs on BN254 to achieve zero-disclosure compliance with DPDP Act 2023 and eliminate audit transmission bottlenecks.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why do autonomous enterprise AI agents require Zero-Knowledge state attestation?',
      a: 'In regulated enterprise sectors (BFSI, Healthcare, GovTech), internal and external auditors must verify that an autonomous agent followed compliance policies without inspecting the underlying customer PII, prompt context, or proprietary model reasoning. ZK-SNARKs enable an agent to mathematically prove: "I transitioned from State A to State B in strict compliance with Policy Rule C" without revealing any private token variables.'
    },
    {
      q: 'How does Groth16 on BN254 achieve constant 256-byte proof sizes?',
      a: 'Groth16 compiles an agent state transition circuit into a Rank-1 Constraint System (R1CS) and Quadratic Arithmetic Program (QAP). The resulting cryptographic proof consists of exactly three group elements: two points in G1 and one point in G2 over the BN254 pairing-friendly elliptic curve, yielding a deterministic 256-byte proof regardless of circuit complexity or context window length.'
    },
    {
      q: 'What is the proving overhead on GPU vs CPU?',
      a: 'Synthesizing a zero-knowledge proof requires Number Theoretic Transforms (NTT) and Multi-Scalar Multiplications (MSM). On modern enterprise GPUs (e.g. NVIDIA L40S or A100), CUDA-accelerated MSM engines complete 262,144 constraint circuits in under 240ms, making per-transaction state attestation viable for high-frequency agentic pipelines.'
    },
    {
      q: 'How does ZK attestation satisfy India DPDP Act 2023 Section 8(4)?',
      a: 'Section 8(4) of the DPDP Act 2023 obligates data fiduciaries to maintain reasonable security safeguards to prevent personal data disclosure. Because ZK-SNARK proofs are mathematically zero-knowledge, audit verification records can be broadcast across external cloud ledgers with 0.0% probability of PII or prompt leakage.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Zero-Knowledge Proof State Attestation Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark Zero-Knowledge (ZK-SNARK) state attestation for enterprise autonomous agents. Compare full state logging against Merkle rollups and sovereign Groth16 proofs on BN254 for zero-disclosure DPDP Act compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-zk-attestation-simulator" />
      </Helmet>

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-cyan-400 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-slate-200">Agent ZK State Attestation Simulator</span>
        </div>
        <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
          onClick={() => setIsEmbedOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all"
        >
          <Code className="w-3.5 h-3.5 text-cyan-400" />
          Embed Simulator
        </button>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold tracking-wide uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Cryptographic Verifiability &amp; Zero-Disclosure Lab
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Agent Zero-Knowledge Proof State Attestation Simulator
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          Model and simulate cryptographic audit trails for autonomous AI agents. Benchmark unencrypted logging against Merkle hash trees and sovereign Groth16/PlonK SNARK circuits for 256-byte constant proof sizes, sub-3.5ms verification, and 100% DPDP Act 2023 compliance.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              State Attestation Parameters
            </h2>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-full border border-cyan-800/50">
              R1CS Groth16
            </span>
          </div>

          <div className="space-y-6">
            {/* Daily State Transitions */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Daily State Transitions
                </label>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {dailyAgentStateTransitionsThousands}k transitions/day
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={dailyAgentStateTransitionsThousands}
                onChange={(e) => setDailyAgentStateTransitionsThousands(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>10k / day</span>
                <span>250k / day</span>
                <span>500k / day</span>
              </div>
            </div>

            {/* Circuit Constraint Scale */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  R1CS Circuit Constraints
                </label>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {circuitConstraintScale.toLocaleString()} constraints
                </span>
              </div>
              <input
                type="range"
                min="65536"
                max="1048576"
                step="65536"
                value={circuitConstraintScale}
                onChange={(e) => setCircuitConstraintScale(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>65k (Light FSM)</span>
                <span>262k (Standard Graph)</span>
                <span>1M (Complex Triad)</span>
              </div>
            </div>

            {/* Context Window Length */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Avg Context Tokens / Transition
                </label>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  {avgContextTokensPerTransition} tokens
                </span>
              </div>
              <input
                type="range"
                min="512"
                max="8192"
                step="256"
                value={avgContextTokensPerTransition}
                onChange={(e) => setAvgContextTokensPerTransition(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>512 tokens</span>
                <span>2,048 tokens</span>
                <span>8,192 tokens</span>
              </div>
            </div>

            {/* Prover Acceleration Mode */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Prover Hardware Acceleration
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setProvingHardwareAcceleration('cpu_multithread')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                    provingHardwareAcceleration === 'cpu_multithread'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  CPU Multithread (x86_64)
                </button>
                <button
                  type="button"
                  onClick={() => setProvingHardwareAcceleration('gpu_cuda_accelerated')}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-medium transition-all text-center ${
                    provingHardwareAcceleration === 'gpu_cuda_accelerated'
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  GPU CUDA (MSM/NTT Engine)
                </button>
              </div>
            </div>

            {/* Verifier Node Hourly Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Verifier Cluster Compute Cost
                </label>
                <span className="text-sm font-mono font-bold text-cyan-400">
                  ${verifierNodeComputeCostUSDPerHour.toFixed(2)} / node-hr
                </span>
              </div>
              <input
                type="range"
                min="0.50"
                max="5.00"
                step="0.10"
                value={verifierNodeComputeCostUSDPerHour}
                onChange={(e) => setVerifierNodeComputeCostUSDPerHour(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$0.50 (t4g.large)</span>
                <span>$2.50 (c6i.4xlarge)</span>
                <span>$5.00 (Dedicated HSM)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={copyExecutiveMemo}
                className="flex-1 py-3 px-4 rounded-full border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                {hasCopiedMemo ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Memo Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    Copy Cryptographic Memo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results & Benchmarks Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase mb-1">
                <Lock className="w-4 h-4" />
                PII Exposure Risk
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {results.sovereignZkSnark.piiExposureRiskPct.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                0% context leak via ZK proofs
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase mb-1">
                <Cpu className="w-4 h-4" />
                Verifier Latency
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                {results.sovereignZkSnark.verifierLatencyMs}ms
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {results.verificationLatencyCutPct}% cut vs raw JSON
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase mb-1">
                <Layers className="w-4 h-4" />
                Proof Footprint
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {results.sovereignZkSnark.proofPayloadSizeBytes} B
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {results.payloadCompressionFactor}x constant compression
              </div>
            </div>
          </div>

          {/* Detailed Architectural Comparison Cards */}
          <div className="space-y-4">
            {/* 1. Legacy Full State Logging */}
            <div className="bg-slate-900/60 border border-rose-900/40 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <h3 className="text-sm font-bold text-slate-200">
                    {results.fullStateLog.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  {results.fullStateLog.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block">Payload Size</span>
                  <span className="font-semibold text-slate-300">
                    {(results.fullStateLog.proofPayloadSizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verifier Latency</span>
                  <span className="font-semibold text-rose-400">
                    {results.fullStateLog.verifierLatencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">PII Exposure</span>
                  <span className="font-semibold text-rose-400">
                    {results.fullStateLog.piiExposureRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Spend</span>
                  <span className="font-semibold text-slate-300">
                    ${results.fullStateLog.annualizedTotalCostUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {results.fullStateLog.architecturalVerdict}
              </p>
            </div>

            {/* 2. Merkle Hash State Rollup */}
            <div className="bg-slate-900/60 border border-amber-900/40 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-bold text-slate-200">
                    {results.merkleRollup.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  {results.merkleRollup.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block">Payload Size</span>
                  <span className="font-semibold text-slate-300">
                    {(results.merkleRollup.proofPayloadSizeBytes / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Verifier Latency</span>
                  <span className="font-semibold text-amber-400">
                    {results.merkleRollup.verifierLatencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">PII Exposure</span>
                  <span className="font-semibold text-amber-400">
                    {results.merkleRollup.piiExposureRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Spend</span>
                  <span className="font-semibold text-slate-300">
                    ${results.merkleRollup.annualizedTotalCostUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {results.merkleRollup.architecturalVerdict}
              </p>
            </div>

            {/* 3. Sovereign ZK-SNARK Attestation */}
            <div className="bg-slate-900/90 border-2 border-cyan-500/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-transparent w-32 h-1" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyan-400 " />
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {results.sovereignZkSnark.name}
                    <FileCheck className="w-4 h-4 text-cyan-400" />
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/60">
                  {results.sovereignZkSnark.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/80 p-3 rounded-xl border border-cyan-900/40">
                <div>
                  <span className="text-slate-400 block">Proof Footprint</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {results.sovereignZkSnark.proofPayloadSizeBytes} bytes
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Verifier Latency</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {results.sovereignZkSnark.verifierLatencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">PII Exposure</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {results.sovereignZkSnark.piiExposureRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Annual Savings</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${results.annualSavingsUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {results.sovereignZkSnark.architecturalVerdict}
              </p>
            </div>
          </div>

          {/* Audit CTA Box */}
          <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">
                Implement Zero-Disclosure ZK State Proofs in Production
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Elesium deploys private R1CS constraint compilers, Groth16 pairings on BN254, and hardware-accelerated prover pipelines.
              </p>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 whitespace-nowrap flex items-center gap-2 cursor-pointer">
                <span>Schedule Cryptographic Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <MandateApplicationForm />
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions: Autonomous Agent Cryptographic Attestation
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Embed This Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this responsive iframe into your technical whitepaper, research portal, or documentation page:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
              <code className="text-[11px] font-mono text-cyan-300 block break-all whitespace-pre-wrap">
                {embedCode}
              </code>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {hasCopiedEmbed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-950" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
