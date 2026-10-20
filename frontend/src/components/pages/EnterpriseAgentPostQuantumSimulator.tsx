import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Activity,
  KeyRound,
  Binary
} from 'lucide-react';
import {
  simulatePostQuantum,
  PostQuantumInputs
} from '../calculator/agentPostQuantumModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentPostQuantumSimulator() {
  // Inputs State
  const [cryptographicSuite, setCryptographicSuite] = useState<'legacy_rsa_ecc' | 'hybrid_x25519_kyber768' | 'ml_kem_768_pure' | 'ml_kem_1024_military'>('ml_kem_768_pure');
  const [digitalSignatureScheme, setDigitalSignatureScheme] = useState<'ecdsa_p256' | 'ed25519' | 'ml_dsa_44' | 'ml_dsa_65' | 'ml_dsa_87'>('ml_dsa_65');
  const [dailyStateSnapshots, setDailyStateSnapshots] = useState<number>(10000);
  const [retrospectiveSecrecyHorizonYears, setRetrospectiveSecrecyHorizonYears] = useState<number>(10);
  const [quantumAdversaryArrivalYear, setQuantumAdversaryArrivalYear] = useState<number>(2031);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PostQuantumInputs = useMemo(() => ({
    cryptographicSuite,
    digitalSignatureScheme,
    dailyStateSnapshots,
    retrospectiveSecrecyHorizonYears,
    quantumAdversaryArrivalYear,
    currency
  }), [
    cryptographicSuite,
    digitalSignatureScheme,
    dailyStateSnapshots,
    retrospectiveSecrecyHorizonYears,
    quantumAdversaryArrivalYear,
    currency
  ]);

  const results = useMemo(() => {
    return simulatePostQuantum(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-post-quantum-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT POST-QUANTUM CRYPTOGRAPHY & LATTICE ATTESTATION AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-post-quantum-simulator)

POST-QUANTUM CRYPTOGRAPHIC ARCHITECTURE:
- Key Encapsulation Mechanism (KEM): ${cryptographicSuite.replace(/_/g, ' ').toUpperCase()}
- Digital Signature Algorithm (DSA): ${digitalSignatureScheme.replace(/_/g, ' ').toUpperCase()}
- NIST Post-Quantum Security Level: Level ${results.nistSecurityLevel} (${results.quantumSecurityMarginBits > 0 ? results.quantumSecurityMarginBits + '-bit quantum hardness' : '0-bit classical (broken)'})
- Daily Agent Checkpoints: ${dailyStateSnapshots.toLocaleString()}
- Statutory Retrospective Horizon: ${retrospectiveSecrecyHorizonYears} Years
- Projected CRQC Quantum Arrival: ${quantumAdversaryArrivalYear} (in ${quantumAdversaryArrivalYear - 2026} years)

VULNERABILITY & OVERHEAD BENCHMARKS:
- "Harvest Now, Decrypt Later" (HNDL) Vulnerability Risk: ${results.quantumBreachVulnerabilityRiskPercent}%
- Retrospective Exposure Overlap Window: ${results.hndlExposureWindowYears} Years
- Combined Public Key Footprint: ${results.publicKeySizeBytes.toLocaleString()} Bytes
- Checkpoint Signature / Ciphertext Footprint: ${results.ciphertextOrSignatureSizeBytes.toLocaleString()} Bytes
- Daily Network Checkpoint Overhead: ${results.stateCheckpointBandwidthOverheadKb} KB/day
- NTT Polynomial Multiplication Latency: ${results.nttPolynomialLatencyMs}ms
- Statutory Compliance Score: ${results.statutoryComplianceScore}/100
- Annual Financial Breach Liability Prevented: ${currency === 'INR' ? '₹' : '$'}${results.annualStatutoryLiabilityPrevented.toLocaleString()}

ARCHITECTURAL RECOMMENDATION:
${results.nistSecurityLevel >= 3
  ? 'Lattice-based Module-LWE encryption is fully resilient against Shor algorithm attacks. The agent state machine achieves full compliance with NIST FIPS 203/204 and India DPDP Act 2023 Section 8(4).'
  : 'CRITICAL ALERT: Current architecture relies on Shor-vulnerable classical primitives (RSA/ECC). Adversaries intercepting encrypted agent state logs today will decrypt them upon CRQC arrival. Immediately migrate to Hybrid X25519+ML-KEM-768 or Pure ML-KEM-768.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Post-Quantum Cryptography & ML-KEM/Dilithium State Attestation Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate NIST FIPS 203 (ML-KEM/Kyber) and FIPS 204 (ML-DSA/Dilithium) lattice cryptography across enterprise autonomous agent pipelines. Eliminate Harvest Now Decrypt Later (HNDL) exposure and guarantee DPDP Act 2023 compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-post-quantum-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-cyan-400 font-mono">
            <a href="/solutions" className="hover:underline">Solutions</a>
            <span>/</span>
            <a href="/resources" className="hover:underline">Tools</a>
            <span>/</span>
            <span className="text-slate-400">Post-Quantum Cryptography Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Binary className="w-3.5 h-3.5 mr-1" />
                Tool #31 · Post-Quantum Lattice Cryptography &amp; NIST FIPS 203/204
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Agent Post-Quantum Cryptography &amp; ML-KEM/Dilithium Simulator
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Benchmark autonomous agent state checkpoint encryption against cryptanalytically relevant quantum computers (CRQC).
                Simulate NIST FIPS 203 (ML-KEM / Kyber-768) and FIPS 204 (ML-DSA / Dilithium) lattice-based Module-LWE attestation to eliminate Harvest Now, Decrypt Later (HNDL) threats.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium transition"
              >
                Currency: <span className="text-cyan-400 font-bold">{currency}</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition"
              >
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed Tool</span>
              </button>
              <button
                onClick={copyExecutiveMemo}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-lg shadow-cyan-950/50 transition"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          results.statusClassification === 'POST_QUANTUM_RESILIENT'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : results.statusClassification === 'TRANSITIONAL_HYBRID'
            ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-300'
            : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
        }`}>
          <div className="flex items-center space-x-3">
            {results.nistSecurityLevel >= 3 ? (
              <ShieldCheck className="w-6 h-6 shrink-0" />
            ) : (
              <ShieldAlert className="w-6 h-6 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">
                Quantum Security Status: {results.statusClassification.replace(/_/g, ' ')} (NIST Level {results.nistSecurityLevel})
              </p>
              <p className="text-xs opacity-90">
                {results.nistSecurityLevel >= 3
                  ? `Active lattice cryptography provides ${results.quantumSecurityMarginBits}-bit quantum hardness against Shor's algorithm. HNDL risk is suppressed to ${results.quantumBreachVulnerabilityRiskPercent}%.`
                  : `Severe vulnerability! Legacy RSA/ECC primitives will be decrypted retrospectively once quantum computers arrive. Exposure window: ${results.hndlExposureWindowYears} years.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/40 border border-current shrink-0">
            DPDP Compliance: {results.statutoryComplianceScore}/100
          </span>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Cryptographic Lattice Parameters</h2>
            </div>

            {/* Key Encapsulation Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Key Encapsulation Mechanism (KEM):</label>
              <select
                value={cryptographicSuite}
                onChange={e => setCryptographicSuite(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="legacy_rsa_ecc">Legacy RSA-2048 / ECDH (Level 0 — Shor Vulnerable)</option>
                <option value="hybrid_x25519_kyber768">Hybrid X25519 + ML-KEM-768 (Transitional Defense)</option>
                <option value="ml_kem_768_pure">NIST FIPS 203 ML-KEM-768 (Level 3 — Enterprise Standard)</option>
                <option value="ml_kem_1024_military">NIST FIPS 203 ML-KEM-1024 (Level 5 — Military Grade)</option>
              </select>
            </div>

            {/* Digital Signature Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Digital Signature Algorithm (DSA):</label>
              <select
                value={digitalSignatureScheme}
                onChange={e => setDigitalSignatureScheme(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ecdsa_p256">Legacy ECDSA P-256 (Level 0 — Broken by Shor)</option>
                <option value="ed25519">Legacy Ed25519 (Level 0 — Broken by Shor)</option>
                <option value="ml_dsa_44">NIST FIPS 204 ML-DSA-44 (Dilithium-2 / Level 2)</option>
                <option value="ml_dsa_65">NIST FIPS 204 ML-DSA-65 (Dilithium-3 / Level 3 Standard)</option>
                <option value="ml_dsa_87">NIST FIPS 204 ML-DSA-87 (Dilithium-5 / Level 5 Maximum)</option>
              </select>
            </div>

            {/* Daily Agent State Snapshots Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Daily State Checkpoints:</span>
                <span className="font-mono text-cyan-400 font-bold">{dailyStateSnapshots.toLocaleString()} snapshots</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={dailyStateSnapshots}
                onChange={e => setDailyStateSnapshots(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>500 (Batch)</span>
                <span>10,000 (Standard)</span>
                <span>50,000 (High-Frequency)</span>
              </div>
            </div>

            {/* Retrospective Legal Horizon Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Legal Retrospective Secrecy Horizon:</span>
                <span className="font-mono text-cyan-400 font-bold">{retrospectiveSecrecyHorizonYears} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="20"
                step="1"
                value={retrospectiveSecrecyHorizonYears}
                onChange={e => setRetrospectiveSecrecyHorizonYears(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3 Years (Commercial)</span>
                <span>10 Years (DPDP / BFSI)</span>
                <span>20 Years (Defense / Health)</span>
              </div>
            </div>

            {/* Projected Quantum Arrival Year Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Projected CRQC Quantum Computer Arrival:</span>
                <span className="font-mono text-rose-400 font-bold">Year {quantumAdversaryArrivalYear} (in {quantumAdversaryArrivalYear - 2026} yrs)</span>
              </div>
              <input
                type="range"
                min="2028"
                max="2036"
                step="1"
                value={quantumAdversaryArrivalYear}
                onChange={e => setQuantumAdversaryArrivalYear(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2028 (Aggressive)</span>
                <span>2031 (Consensus)</span>
                <span>2036 (Conservative)</span>
              </div>
            </div>

            {/* Footprint Summary Card */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center space-x-2 text-cyan-400 font-semibold mb-1">
                <KeyRound className="w-4 h-4" />
                <span>Cryptographic Key &amp; Envelope Footprint</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Combined Public Key:</span>
                <span className="font-mono text-white font-bold">{results.publicKeySizeBytes.toLocaleString()} Bytes</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Checkpoint Envelope / Sig:</span>
                <span className="font-mono text-white font-bold">{results.ciphertextOrSignatureSizeBytes.toLocaleString()} Bytes</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Daily State Overhead:</span>
                <span className="font-mono text-cyan-300 font-bold">{results.stateCheckpointBandwidthOverheadKb} KB</span>
              </div>
            </div>
          </div>

          {/* Visualization & Metrics Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Interactive SVG Lattice Polynomial Ring Noise Plot */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-semibold text-white">Lattice Ring Polynomial Modular Noise &amp; Error Bounds</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                    <span>Correctable Lattice Error</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span>Quantum Inversion Spike</span>
                  </span>
                </div>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="relative w-full aspect-[16/9] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="0 -30 320 60" className="w-full h-full">
                  {/* Grid & Centered Axis */}
                  <line x1="0" y1="0" x2="320" y2="0" stroke="#1e293b" strokeWidth="1" />
                  <line x1="0" y1="-15" x2="320" y2="-15" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />
                  <line x1="0" y1="15" x2="320" y2="15" stroke="#334155" strokeWidth="0.8" strokeDasharray="3,3" />

                  {/* Noise Ceiling Bounds */}
                  <rect x="0" y="-15" width="320" height="30" fill="rgba(6, 182, 212, 0.04)" />

                  {/* Bars for Lattice Coefficients */}
                  {results.latticePoints.map((pt, idx) => {
                    const x = idx * 10 + 5;
                    const height = Math.abs(pt.errorValue) * 4;
                    const y = pt.errorValue >= 0 ? -height : 0;
                    return (
                      <g key={idx} className="transition-all duration-300">
                        <rect
                          x={x - 3}
                          y={y}
                          width="6"
                          height={Math.max(1, height)}
                          fill={pt.isCorrectable ? '#10b981' : '#f43f5e'}
                          rx="1.5"
                        />
                        <circle
                          cx={x}
                          cy={pt.errorValue >= 0 ? y : y + height}
                          r="1.8"
                          fill={pt.isCorrectable ? '#34d399' : '#fb7185'}
                        />
                      </g>
                    );
                  })}
                </svg>

                {/* Overlaid Summary Badge */}
                <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-300">
                  Ring Modulus: <span className="text-cyan-400 font-bold">q = 3329</span> · Lattice Dimension: <span className="text-cyan-400 font-bold">k = 3</span>
                </div>
              </div>
            </div>

            {/* Key Output Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">NIST Security Level</span>
                <span className="text-2xl font-extrabold font-mono text-cyan-400">
                  Level {results.nistSecurityLevel}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">FIPS 203 / 204 Standard</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">HNDL Exposure Risk</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  results.quantumBreachVulnerabilityRiskPercent < 1
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                }`}>
                  {results.quantumBreachVulnerabilityRiskPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Harvest Now Decrypt Later</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Exposure Overlap</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  results.hndlExposureWindowYears === 0
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}>
                  {results.hndlExposureWindowYears} Yrs
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Horizon vs Quantum Arrival</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">NTT Attestation Latency</span>
                <span className="text-2xl font-extrabold font-mono text-slate-200">
                  {results.nttPolynomialLatencyMs} ms
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Sub-millisecond polynomial</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Quantum Hardness</span>
                <span className="text-2xl font-extrabold font-mono text-cyan-400">
                  {results.quantumSecurityMarginBits} Bits
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">SVP / CVP lattice hardness</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Annual Loss Prevented</span>
                <span className="text-2xl font-extrabold font-mono text-emerald-400">
                  {currency === 'INR' ? '₹' : '$'}{(results.annualStatutoryLiabilityPrevented / (currency === 'INR' ? 10000000 : 1000000)).toFixed(1)}
                  {currency === 'INR' ? ' Cr' : 'M'}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">DPDP statutory liability</span>
              </div>
            </div>

            {/* Turnkey Deployment Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-white">Deploy Sovereign Post-Quantum Enclaves</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  Deploy hardened multi-agent state machines with NIST FIPS 203 ML-KEM-768 and FIPS 204 ML-DSA inside your private AWS/Azure/GCP VPC enclaves.
                </p>
              </div>
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950/60 transition flex items-center space-x-2 shrink-0">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <div className="max-w-2xl mx-auto p-6 space-y-6">
                    <h3 className="text-2xl font-bold text-white">Schedule Private VPC Post-Quantum Audit</h3>
                    <p className="text-sm text-slate-400">
                      Engage Elesium's Principal AI Systems Architects to audit your enterprise agent state persistence, TLS pipelines, and database checkpoints for post-quantum lattice readiness.
                    </p>
                    <MandateApplicationForm />
                  </div>
                </ExpandableScreenContent>
              </ExpandableScreen>
            </div>
          </div>
        </div>

        {/* Technical Architecture & Algorithm Reference */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Binary className="w-5 h-5 text-cyan-400" />
              <span>Mathematical Foundations: Module-LWE Lattice Cryptography</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Rigorous polynomial ring mathematics governing NIST FIPS 203 (ML-KEM) and FIPS 204 (ML-DSA).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-slate-300">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-cyan-300">1. Module Learning With Errors (M-LWE) Hardness</h4>
              <p>
                Classical asymmetric algorithms (RSA and ECC) rely on the integer factorization and discrete logarithm problems, both solvable in polynomial time via Shor's algorithm on a quantum computer.
                ML-KEM and ML-DSA base their security on finding short vectors in high-dimensional geometric lattices:
              </p>
              <div className="p-3 rounded-lg bg-slate-950 font-mono text-[11px] text-cyan-300 border border-slate-800">
                {"A * s + e = t (mod q) in R_q^k"}
              </div>
              <p className="text-slate-400">
                Where A is a uniformly random polynomial matrix, s is the secret key vector, e is a small error noise vector sampled from a centered binomial distribution, and q = 3329. Recovering s from (A, t) requires solving the Shortest Vector Problem (SVP), which is conjectured to be exponentially hard for both classical and quantum computers.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-cyan-300">2. Harvest Now, Decrypt Later (HNDL) Threat Vector</h4>
              <p>
                Adversaries are currently intercepting and archiving encrypted enterprise AI agent communication, API tokens, and confidential financial database checkpoints.
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-slate-400">
                <li><strong className="text-slate-200">The Overlap Risk:</strong> If sensitive agent audit logs must legally remain confidential for 10 years, and quantum computers break RSA/ECC within 5 years, data archived today will be exposed within its statutory lifetime.</li>
                <li><strong className="text-slate-200">DPDP Act Section 8(4):</strong> Mandates reasonable security safeguards to prevent personal data compromise. Relying on deprecated classical cryptography creates existential breach liability up to ₹250 Crores.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-8 backdrop-blur-sm space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">Frequently Asked Technical Questions</h3>
          <div className="space-y-3">
            {[
              {
                q: "What is the primary difference between ML-KEM and ML-DSA in agent pipelines?",
                a: "ML-KEM (FIPS 203, formerly CRYSTALS-Kyber) is a Key Encapsulation Mechanism used to establish shared secret symmetric keys for encrypting agent-to-agent communication and state checkpoints. ML-DSA (FIPS 204, formerly CRYSTALS-Dilithium) is a Digital Signature Algorithm used to cryptographically attest and sign agent state transitions, guaranteeing non-repudiation and tamper-evidence."
              },
              {
                q: "Does lattice-based post-quantum cryptography introduce noticeable CPU latency?",
                a: "No. Thanks to the Number Theoretic Transform (NTT), polynomial multiplication in R_q is exceptionally fast. ML-KEM-768 key generation and encapsulation take under 0.35 milliseconds on standard modern CPUs, making it significantly faster than classical RSA-2048 operations."
              },
              {
                q: "Why should enterprises migrate before cryptanalytically relevant quantum computers exist?",
                a: "Because of 'Harvest Now, Decrypt Later' (HNDL). Adversarial actors capture encrypted ciphertext today to decrypt once quantum hardware matures. If your enterprise data has an operational or legal lifespan of 5+ years, it is already at risk unless protected by post-quantum lattice primitives."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed Post-Quantum Cryptography Simulator</span>
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Embed this interactive simulator on your technical blog or developer documentation with an automatic watermark backlink to Elesium.
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={embedCode}
                className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 text-[11px] font-mono text-cyan-300 focus:outline-none resize-none"
              />
              <button
                onClick={copyEmbedCode}
                className="absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-semibold flex items-center space-x-1 transition shadow"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
