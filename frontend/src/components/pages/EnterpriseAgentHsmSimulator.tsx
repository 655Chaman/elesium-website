import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Shield,
  Lock,
  Key,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Activity,
  Sparkles,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Server,
  FileCheck
} from 'lucide-react';
import {
  simulateAgentHsm,
  HsmInputs
} from '../calculator/agentHsmModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentHsmSimulator() {
  // Inputs State
  const [hsmSecurityLevel, setHsmSecurityLevel] = useState<'fips_140_3_level_4' | 'fips_140_2_level_3' | 'common_criteria_eal6_plus' | 'tpm_2_0_enclave'>('fips_140_3_level_4');
  const [cryptographicAlgorithm, setCryptographicAlgorithm] = useState<'aes_256_gcm' | 'rsa_4096_pss' | 'ecdsa_secp256k1' | 'ml_kem_768_post_quantum'>('ml_kem_768_post_quantum');
  const [keyDerivationFunction, setKeyDerivationFunction] = useState<'hkdf_sha512' | 'argon2id_hardened' | 'pbkdf2_sha256'>('hkdf_sha512');
  const [dailyKeyDerivationVolumeThousands, setDailyKeyDerivationVolumeThousands] = useState<number>(750);
  const [hardwareBusLatencyMicroseconds, setHardwareBusLatencyMicroseconds] = useState<number>(45);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: HsmInputs = useMemo(() => ({
    hsmSecurityLevel,
    cryptographicAlgorithm,
    keyDerivationFunction,
    dailyKeyDerivationVolumeThousands,
    hardwareBusLatencyMicroseconds,
    currency
  }), [
    hsmSecurityLevel,
    cryptographicAlgorithm,
    keyDerivationFunction,
    dailyKeyDerivationVolumeThousands,
    hardwareBusLatencyMicroseconds,
    currency
  ]);

  const results = useMemo(() => {
    return simulateAgentHsm(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-hsm-pkcs11-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AUTONOMOUS AGENT HARDWARE SECURITY MODULE (HSM) PKCS#11 AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-hsm-pkcs11-simulator)

CRYPTOGRAPHIC HARDWARE ARCHITECTURE:
- HSM Certification & Security Profile: ${hsmSecurityLevel.replace(/_/g, ' ').toUpperCase()}
- Cryptographic Primitive / Algorithm: ${cryptographicAlgorithm.replace(/_/g, ' ').toUpperCase()}
- Key Derivation Function (KDF): ${keyDerivationFunction.replace(/_/g, ' ').toUpperCase()}
- Hardware Bus Latency (PKCS#11 PCIe/SPI): ${hardwareBusLatencyMicroseconds} µs
- Daily Autonomous Agent Key Derivation Volume: ${dailyKeyDerivationVolumeThousands.toLocaleString()}k ops/day

PERFORMANCE & COMPLIANCE BENCHMARKS:
- End-to-End Key Derivation Latency: ${results.keyDerivationLatencyMicroseconds} µs
- Pipelined Tokenization Throughput: ${results.tokenizationThroughputOpsPerSec.toLocaleString()} Ops/Sec
- Physical Tamper Detection & Zeroization Envelope: ${results.physicalTamperDetectionResistanceYears} Years
- Side-Channel Attack Attenuation (DPA/CPA/EM): ${results.sideChannelAttackResistanceDb} dB
- Regulatory Compliance Score: ${results.complianceScorePercent}% (DPDP Act 2023 Sec 8, RBI Cyber Security Framework, PCI-DSS v4.0 Req 3.5)

FINANCIAL BREACH EXPOSURE MITIGATED:
- Annual Exposure Reduction: ${currency === 'INR' ? '₹' : '$'}${results.annualBreachExposureMitigation.toLocaleString()}/year

ARCHITECTURAL CLASSIFICATION:
${results.statusClassification === 'AIR_GAPPED_SOVEREIGN_VAULT'
  ? 'SOVEREIGN AIR-GAPPED VAULT ACTIVE. Hardware-isolated root of trust prevents memory-scraping, cold-boot physical bus taps, and prompt injection key exfiltration. Meets Indian RBI banking grade and DPDP Act statutory requirements.'
  : results.statusClassification === 'FIPS_HARDENED_COMPLIANT'
  ? 'FIPS HARDENED COMPLIANT. Meets standard enterprise cryptographic requirements. Review physical bus tracing to upgrade to fully air-gapped sovereign grade.'
  : 'PERIPHERAL BUS EXPOSED. Vulnerable to physical interposer bus sniffing or CPU enclave side-channel leakage. Immediate hardware migration to dedicated PKCS#11 FIPS 140-3 Level 4 HSM recommended.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG telemetry paths
  const svgData = useMemo(() => {
    const width = 560;
    const height = 160;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { busPath: '', tamperPath: '', rawPoints: [] };

    // Bus latency path
    const maxBus = 300;
    const minBus = 0;
    const busPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - ((pt.busLatencyUs - minBus) / (maxBus - minBus)) * (height * 0.7) - 10;
      return [x, y];
    });

    // Tamper mesh voltage path (baseline 3300 mV, scale delta ±25 mV)
    const tamperPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const delta = pt.tamperMeshVoltageMv - 3300;
      const y = (height / 2) - (delta * 2.8);
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const busD = busPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const tamperD = tamperPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { busPath: busD, tamperPath: tamperD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Enterprise Agent Hardware Security Module (HSM) PKCS#11 Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate enterprise autonomous agent PKCS#11 hardware security module (HSM) air-gapped key derivation, tokenization throughput, FIPS 140-3 Level 4 tamper protection, side-channel attack resistance, and DPDP / RBI compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-hsm-pkcs11-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* Header Breadcrumbs and Badges */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
            <a href="/" className="hover:text-cyan-400 transition">Elesium</a>
            <span>/</span>
            <a href="/solutions" className="hover:text-cyan-400 transition">Tools</a>
            <span>/</span>
            <span className="text-cyan-400">Tool #35: Enterprise Agent HSM PKCS#11 Simulator</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <ShieldCheck className="w-3 h-3 mr-1" /> FIPS 140-3 Level 4 &amp; PKCS#11 v3.1 Cryptoki
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Tool #35
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-950 text-purple-400 border border-purple-800">
                  Post-Quantum ML-KEM-768
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mt-2 tracking-tight">
                Enterprise Autonomous Agent Hardware Security Module (HSM) Simulator
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-3xl mt-1">
                Simulate hardware-isolated PKCS#11 air-gapped cryptographic key derivation, tokenization throughput,
                active zeroization tamper mesh dynamics, DPA/CPA side-channel attenuation, and statutory DPDP Act / RBI compliance.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed Simulator</span>
              </button>

              <button
                onClick={copyExecutiveMemo}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white transition"
              >
                {hasCopiedMemo ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Memo Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-cyan-400" />
                    <span>Copy Executive Memo</span>
                  </>
                )}
              </button>

              <ExpandableScreen>
                <ExpandableScreenTrigger className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 transition shadow-lg shadow-cyan-950/50 cursor-pointer">
                  <span>Schedule HSM Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <div className="p-6 sm:p-10 max-w-2xl mx-auto">
                    <MandateApplicationForm />
                  </div>
                </ExpandableScreenContent>
              </ExpandableScreen>
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          results.statusClassification === 'AIR_GAPPED_SOVEREIGN_VAULT'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : results.statusClassification === 'FIPS_HARDENED_COMPLIANT'
            ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-300'
            : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
        }`}>
          <div className="flex items-center space-x-3">
            {results.statusClassification === 'AIR_GAPPED_SOVEREIGN_VAULT' ? (
              <ShieldCheck className="w-6 h-6 shrink-0 text-emerald-400" />
            ) : results.statusClassification === 'FIPS_HARDENED_COMPLIANT' ? (
              <Sparkles className="w-6 h-6 shrink-0 text-cyan-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 shrink-0 text-rose-400" />
            )}
            <div>
              <p className="font-semibold text-sm">
                Cryptographic Hardware Status: {results.statusClassification.replace(/_/g, ' ')}
              </p>
              <p className="text-xs opacity-90">
                {results.statusClassification === 'AIR_GAPPED_SOVEREIGN_VAULT'
                  ? `Sovereign Air-Gapped Vault verified. Active physical zeroization envelope resists invasive probes (${results.physicalTamperDetectionResistanceYears} years). Side-channel DPA attenuation is ${results.sideChannelAttackResistanceDb} dB with ${results.complianceScorePercent}% DPDP & RBI compliance.`
                  : results.statusClassification === 'FIPS_HARDENED_COMPLIANT'
                  ? `FIPS 140-2 Level 3 certified enclave operational. Meets standard commercial enterprise isolation requirements with ${results.tokenizationThroughputOpsPerSec.toLocaleString()} ops/sec tokenization throughput.`
                  : `Peripheral bus or unshielded CPU enclave exposed. High bus latency (${hardwareBusLatencyMicroseconds} µs) or low side-channel resistance (${results.sideChannelAttackResistanceDb} dB) exposes private agent keys to memory-bus interposers.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/40 border border-current shrink-0">
            Compliance: {results.complianceScorePercent}%
          </span>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">HSM &amp; Cryptoki Security Parameters</h2>
            </div>

            {/* HSM Security Level Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">HSM Certification &amp; Physical Security Tier:</label>
              <select
                value={hsmSecurityLevel}
                onChange={e => setHsmSecurityLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="fips_140_3_level_4">FIPS 140-3 Level 4 (Active Environmental Protection &amp; Zeroization Envelope)</option>
                <option value="common_criteria_eal6_plus">Common Criteria EAL6+ (Formally Verified High-Assurance Sovereign Vault)</option>
                <option value="fips_140_2_level_3">FIPS 140-2 Level 3 (Tamper-Evident Enclosure with Identity Authentication)</option>
                <option value="tpm_2_0_enclave">TPM 2.0 / Host CPU Enclave (AMD SEV / ARM TrustZone - Peripheral Bus Exposed)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                FIPS 140-3 Level 4 mandates physical zeroization of master secret keys upon enclosure voltage, temperature, or drill penetration.
              </p>
            </div>

            {/* Cryptographic Algorithm Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Cryptographic Algorithm &amp; Key Primitive:</label>
              <select
                value={cryptographicAlgorithm}
                onChange={e => setCryptographicAlgorithm(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="ml_kem_768_post_quantum">NIST FIPS 203 ML-KEM-768 (Lattice Post-Quantum Key Encapsulation)</option>
                <option value="aes_256_gcm">AES-256-GCM (Hardware Coprocessor Symmetric Cipher with Authenticated Tag)</option>
                <option value="ecdsa_secp256k1">ECDSA secp256k1 (Elliptic Curve Autonomous Agent Signature &amp; State Proofs)</option>
                <option value="rsa_4096_pss">RSA-4096-PSS (Modular Exponentiation - High Computation Overhead)</option>
              </select>
              <p className="text-[10px] text-slate-500">
                ML-KEM-768 provides 128-bit quantum security level against Shor's algorithm harvesting agent state communications.
              </p>
            </div>

            {/* Key Derivation Function Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Key Derivation Function (KDF):</label>
              <select
                value={keyDerivationFunction}
                onChange={e => setKeyDerivationFunction(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="hkdf_sha512">RFC 5869 HKDF-SHA512 (Extract-and-Expand Streaming Agent Tokenization)</option>
                <option value="argon2id_hardened">Argon2id Hardened (Memory-Hardened ASIC &amp; GPU Side-Channel Immune)</option>
                <option value="pbkdf2_sha256">NIST SP 800-132 PBKDF2-SHA256 (Legacy 100k Iterations Standard)</option>
              </select>
            </div>

            {/* Hardware Bus Latency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Hardware Bus / Cryptoki Latency (PCIe/SPI/USB):</span>
                <span className="font-mono text-cyan-400 font-bold">{hardwareBusLatencyMicroseconds} µs</span>
              </div>
              <input
                type="range"
                min="15"
                max="250"
                step="5"
                value={hardwareBusLatencyMicroseconds}
                onChange={e => setHardwareBusLatencyMicroseconds(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15 µs (Direct PCIe Gen5)</span>
                <span>45 µs (Isolated PCIe Gen4)</span>
                <span>250 µs (External USB/LAN)</span>
              </div>
            </div>

            {/* Daily Key Derivation Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Daily Agent Tokenization Volume:</span>
                <span className="font-mono text-emerald-400 font-bold">{dailyKeyDerivationVolumeThousands.toLocaleString()}k ops/day</span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={dailyKeyDerivationVolumeThousands}
                onChange={e => setDailyKeyDerivationVolumeThousands(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10k ops/day (SME)</span>
                <span>750k</span>
                <span>5,000k ops/day (Tier-1 Bank)</span>
              </div>
            </div>

            {/* Currency Toggle */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-300 font-medium block">Reporting Currency:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`py-2 text-xs font-mono font-bold rounded-lg transition border ${
                    currency === 'INR'
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  INR (₹) India
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`py-2 text-xs font-mono font-bold rounded-lg transition border ${
                    currency === 'USD'
                      ? 'bg-cyan-500 text-black border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  USD ($) Global
                </button>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Key Derivation Latency */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Key Derivation Latency</span>
                  <Key className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-cyan-400">{results.keyDerivationLatencyMicroseconds}</span>
                  <span className="text-sm font-mono text-cyan-300">µs / key</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Hardware Bus Latency:</span>
                    <span className="font-mono text-slate-300">{hardwareBusLatencyMicroseconds} µs</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PKCS#11 Cryptoki Framing:</span>
                    <span className="font-mono text-slate-300">12 µs</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyan-300">
                    <span>Algorithm Primitive:</span>
                    <span>{cryptographicAlgorithm === 'ml_kem_768_post_quantum' ? 'ML-KEM-768' : cryptographicAlgorithm.replace(/_/g, ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Tokenization Throughput */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Tokenization Throughput</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">{results.tokenizationThroughputOpsPerSec.toLocaleString()}</span>
                  <span className="text-sm font-mono text-emerald-300">Ops / sec</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Parallel Coprocessors:</span>
                    <span className="font-mono text-slate-300">28 Pipelined Channels</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Volume Capacity:</span>
                    <span className="font-mono text-emerald-400 font-bold">{(results.tokenizationThroughputOpsPerSec * 86.4).toFixed(0)}k ops/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturation Headroom:</span>
                    <span className="font-mono text-cyan-300 font-bold">
                      {Math.max(1.0, (results.tokenizationThroughputOpsPerSec * 86.4) / dailyKeyDerivationVolumeThousands).toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Tamper & Side-Channel Resistance */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Physical &amp; Side-Channel Resistance</span>
                  <Shield className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-purple-400">{results.sideChannelAttackResistanceDb}</span>
                  <span className="text-sm font-mono text-purple-300">dB DPA Attenuation</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tamper Mesh Zeroization:</span>
                    <span className="font-mono text-purple-300 font-bold">{results.physicalTamperDetectionResistanceYears} Years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Electromagnetic Leakage:</span>
                    <span className="font-mono text-slate-300">{results.sideChannelAttackResistanceDb > 90 ? 'Sub-Noise Floor (<1nV)' : 'Vulnerable (>100nV)'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Enclosure Grade:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{hsmSecurityLevel === 'fips_140_3_level_4' ? 'FIPS 140-3 L4 Active' : 'Certified Enclosure'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Breach Exposure Mitigation */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Annual Breach Exposure Mitigated</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold font-mono text-cyan-300">
                    {currency === 'INR' ? '₹' : '$'}{results.annualBreachExposureMitigation.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ yr</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Statutory Compliance Score:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{results.complianceScorePercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DPDP Act 2023 Sec 8:</span>
                    <span className="font-mono text-slate-300">Fiduciary Tokenized</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RBI Cyber Security Stance:</span>
                    <span className="font-mono text-cyan-300 font-bold">Hardware Air-Gapped</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Hardware Oscilloscope & Tamper Telemetry Chart */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">PKCS#11 Cryptoki Bus &amp; Active Tamper Mesh Telemetry</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> Bus Latency (µs)
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span> Tamper Mesh Voltage (mV)
                  </span>
                </div>
              </div>

              {/* Oscilloscope SVG */}
              <div className="relative w-full aspect-[3/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
                <svg viewBox="0 0 560 160" className="w-full h-full">
                  {/* Grid lines */}
                  {[25, 60, 95, 130].map(y => (
                    <line key={`grid-${y}`} x1="0" y1={y} x2="560" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  ))}
                  {[80, 160, 240, 320, 400, 480].map(x => (
                    <line key={`grid-x-${x}`} x1={x} y1="0" x2={x} y2="160" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  ))}

                  {/* Tamper Mesh Baseline Voltage Line (3300 mV) */}
                  <line
                    x1="0"
                    y1="80"
                    x2="560"
                    y2="80"
                    stroke="#f43f5e"
                    strokeWidth="1"
                    strokeDasharray="6 3"
                    opacity="0.4"
                  />

                  {/* Bus Latency Trace Line */}
                  <path
                    d={svgData.busPath}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Tamper Mesh Voltage Trace Line */}
                  <path
                    d={svgData.tamperPath}
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Sample Markers */}
                  {svgData.rawPoints.map((pt, idx) => {
                    const x = (idx / (svgData.rawPoints.length - 1)) * 560;
                    const maxBus = 300;
                    const y = 160 - (pt.busLatencyUs / maxBus) * (160 * 0.7) - 10;
                    return (
                      <circle
                        key={`pt-${idx}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#06b6d4"
                        stroke="#ffffff"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>Cryptoki Step 0 (Host Handshake)</span>
                  <span className="text-emerald-400 font-bold">TRNG Entropy: 256.0 bits | Enclosure Potting Mesh Active</span>
                  <span>Step 15 (Key Zeroize / Cache Flush)</span>
                </div>
              </div>
            </div>

            {/* Cryptographic Security Architecture & Compliance Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Regulatory Framework &amp; Air-Gapped Key Governance</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-cyan-400 font-semibold">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>DPDP Act 2023 Sec 8</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Requires Data Fiduciaries to maintain technical safeguards preventing unauthorized access to personal identity datasets. Hardware tokenization decouples real identities from LLM prompts.
                  </p>
                  <div className="pt-1 font-mono text-emerald-400 font-bold">
                    Score: {results.complianceScorePercent}% Compliant
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-purple-400 font-semibold">
                    <Server className="w-3.5 h-3.5" />
                    <span>RBI Cyber Security</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Mandates dedicated cryptographic hardware modules with non-exportable private root keys for all automated payment, core banking, and financial underwriting agents.
                  </p>
                  <div className="pt-1 font-mono text-purple-400 font-bold">
                    Status: {hsmSecurityLevel === 'tpm_2_0_enclave' ? 'Advisory Warning' : 'Mandate Satisfied'}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-400 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    <span>PCI-DSS v4.0 Req 3.5</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Dual-control split-knowledge key derivation ensures no single autonomous model or infrastructure operator can extract raw primary account numbers or agent signing credentials.
                  </p>
                  <div className="pt-1 font-mono text-cyan-400 font-bold">
                    Air-Gap: {results.sideChannelAttackResistanceDb >= 90 ? 'Full Zero-Leakage' : 'Peripheral Monitored'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Deep Dive: Air-Gapped HSM vs Cloud KMS vs Software Enclaves */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Autonomous Agent Root-of-Trust Comparison Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Comparing dedicated physical air-gapped PKCS#11 HSMs against multi-tenant Cloud KMS and CPU enclave virtualization.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Security Metric</th>
                  <th className="py-2.5 px-3 text-cyan-400">Elesium Air-Gapped Sovereign HSM</th>
                  <th className="py-2.5 px-3 text-slate-300">Public Cloud KMS (AWS/GCP/Azure)</th>
                  <th className="py-2.5 px-3 text-slate-400">Host CPU Enclave (SGX/SEV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">Physical Tamper Zeroization</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">FIPS 140-3 L4 Active Mesh (&lt;50ns Zeroize)</td>
                  <td className="py-2.5 px-3 text-slate-400">Shared Multi-Tenant DC (Vendor Managed)</td>
                  <td className="py-2.5 px-3 text-rose-400">None (Vulnerable to Interposers &amp; Probes)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">Post-Quantum Cryptography</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">Native NIST ML-KEM-768 &amp; ML-DSA</td>
                  <td className="py-2.5 px-3 text-slate-400">Hybrid RSA/ECC Legacy Default</td>
                  <td className="py-2.5 px-3 text-slate-400">Software Emulated Only (High Latency)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">Side-Channel Attack Resistance</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">&gt;110 dB (Masked DPA/CPA Immune)</td>
                  <td className="py-2.5 px-3 text-slate-400">80 - 90 dB (Shared Hypervisor Noise)</td>
                  <td className="py-2.5 px-3 text-rose-400">&lt;60 dB (Cache-Timing &amp; Branch Leakage)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">DPDP Act 2023 Sovereignty</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">100% On-Premise Air-Gapped Indian Soil</td>
                  <td className="py-2.5 px-3 text-amber-400">US CLOUD Act Extraterritorial Subpoena Risk</td>
                  <td className="py-2.5 px-3 text-slate-400">Local OS Root Compromise Risk</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-sans font-semibold text-white">End-to-End Derivation Latency</td>
                  <td className="py-2.5 px-3 text-cyan-400 font-bold">&lt;80 µs (Direct PCIe Cryptoki)</td>
                  <td className="py-2.5 px-3 text-slate-400">12 - 45 ms (WAN / HTTPS API Latency)</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">10 - 25 µs (Direct L3 Memory)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">Frequently Asked Architectural Questions</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Deep-dive guidance on autonomous agent key derivation, PKCS#11 standard, and FIPS 140-3 compliance.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Why do autonomous enterprise agents require dedicated PKCS#11 HSMs instead of software keys?",
                a: "Autonomous agents execute thousands of automated decisions per second—issuing payments, modifying enterprise database records, and signing API mandates. Storing private signing keys in software memory (RAM) or environment variables exposes them to memory-scraping attacks, cold-boot extractions, and adversarial prompt injections that instruct the agent to leak its credentials. A PKCS#11 HSM creates an air-gapped cryptographic boundary: private keys are generated inside the silicon and never leave the hardware module; only cryptographic operations (signing, tokenization, decryption) take place within the tamper-proof envelope."
              },
              {
                q: "What is the difference between FIPS 140-2 Level 3 and FIPS 140-3 Level 4 physical security?",
                a: "FIPS 140-2 Level 3 requires physical tamper-evident enclosures and identity-based operator authentication. In contrast, FIPS 140-3 Level 4 mandates complete Environmental Failure Protection (EFP) and active physical tamper detection envelopes. If an adversary attempts to open the chassis, drill into the chip potting resin, or alter operating temperature/voltage to cause bit flips, the HSM's active sensor mesh detects the anomaly and zeroizes all master cryptographic keys in less than 50 nanoseconds before data can be extracted."
              },
              {
                q: "How does post-quantum ML-KEM-768 integrate with enterprise agent key derivation pipelines?",
                a: "NIST finalized FIPS 203 (ML-KEM, formerly Kyber) as the global standard for post-quantum key encapsulation. When autonomous agents exchange transient session tokens across microservices or VPC boundaries, adversaries can record encrypted traffic today for future decryption once cryptanalytically relevant quantum computers (CRQCs) arrive ('Harvest Now, Decrypt Later'). By running ML-KEM-768 inside the HSM alongside HKDF-SHA512, agent session keys are mathematically impervious to both classical computing and Shor's algorithm quantum factoring."
              },
              {
                q: "How does air-gapped tokenization satisfy India's DPDP Act 2023 and RBI Cyber Security Framework?",
                a: "Under Section 8 of India's Digital Personal Data Protection (DPDP) Act 2023, Data Fiduciaries must implement robust technical measures to prevent personal data breaches. The Reserve Bank of India (RBI) Cyber Security Framework specifically requires banking and payment processing agents to isolate cryptographic roots of trust from general-purpose operating systems. Our HSM tokenization replaces Aadhaar numbers, PAN, credit card PANs, and patient health data with cryptographically derived, irreversible hardware tokens before passing prompts into large language models."
              },
              {
                q: "Can this PKCS#11 architecture be integrated with existing LangChain, LlamaIndex, or AutoGen agent clusters?",
                a: "Yes. Elesium provides native C/Rust PKCS#11 Cryptoki wrappers and high-performance Python bindings. When an autonomous agent in LangChain or AutoGen needs to sign a tool invocation, authorize a payment transaction, or verify an immutable audit log, it dispatches an asynchronous non-blocking PKCS#11 request over low-latency PCIe to the HSM. The agent orchestrator receives the signed token in under 100 microseconds without stalling the LLM inference loop."
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-3.5 px-4 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-slate-200 hover:text-white hover:bg-slate-800/40 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${
                      openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 border-t border-slate-800/60 leading-relaxed font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Embed Modal */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">Embed Agent HSM Simulator</h3>
                </div>
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-300">
                Paste this iframe snippet into your engineering documentation, internal compliance wiki, or customer-facing trust portal:
              </p>

              <div className="relative">
                <textarea
                  readOnly
                  value={embedCode}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition"
                >
                  Close
                </button>
                <button
                  onClick={copyEmbedCode}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 text-black hover:bg-cyan-400 transition"
                >
                  {hasCopiedEmbed ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied Snippet!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Embed Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Intent Executive Memo Modal */}
        <ExitIntentMemoModal
          toolName="Hardware Security Module (HSM) PKCS#11 Simulator"
          simulatedMetrics={[
            { label: 'Key Derivation Latency', value: `${results.keyDerivationLatencyMicroseconds} µs` },
            { label: 'Tokenization Throughput', value: `${results.tokenizationThroughputOpsPerSec.toLocaleString()} ops/s` },
            { label: 'Physical Tamper Envelope', value: `${results.physicalTamperDetectionResistanceYears} Years` },
            { label: 'Compliance Index', value: `${results.complianceScorePercent}%` }
          ]}
        />
      </div>
    </div>
  );
}
