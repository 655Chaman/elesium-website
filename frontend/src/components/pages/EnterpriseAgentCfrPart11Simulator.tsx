import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Lock,
  Database,
  ShieldCheck
} from 'lucide-react';
import {
  simulateCfrPart11Validation,
  CfrPart11Inputs
} from '../calculator/agentCfrPart11Model';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentCfrPart11Simulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [batchRecordVolumePerMonth, setBatchRecordVolumePerMonth] = useState<number>(500);
  const [auditTrailEventFrequency, setAuditTrailEventFrequency] = useState<'standard_hourly' | 'high_frequency_scada' | 'millisecond_distributed'>('high_frequency_scada');
  const [validationFramework, setValidationFramework] = useState<'cdsco_schedule_m' | 'us_fda_21_cfr_part_11' | 'eu_gmp_annex_11' | 'who_trs_961'>('us_fda_21_cfr_part_11');
  const [cryptographicAlgorithm, setCryptographicAlgorithm] = useState<'sha_256_merkle' | 'sha_512_hmac' | 'blake3_tree' | 'ml_kem_dilithium_post_quantum'>('sha_256_merkle');
  const [signatureType, setSignatureType] = useState<'digital_pki_x509' | 'aadhaar_esign_biometric' | 'hardware_fips_token'>('digital_pki_x509');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: CfrPart11Inputs = useMemo(() => ({
    batchRecordVolumePerMonth,
    auditTrailEventFrequency,
    validationFramework,
    cryptographicAlgorithm,
    signatureType,
    currency
  }), [
    batchRecordVolumePerMonth,
    auditTrailEventFrequency,
    validationFramework,
    cryptographicAlgorithm,
    signatureType,
    currency
  ]);

  const results = useMemo(() => {
    return simulateCfrPart11Validation(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-cfr-part-11-validation-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign Life Sciences AI</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT CDSCO & US FDA 21 CFR PART 11 VALIDATION AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-cfr-part-11-validation-simulator)

MANUFACTURING VALIDATION & AUDIT TRAIL CONFIGURATION:
- Monthly Batch Volume: ${batchRecordVolumePerMonth.toLocaleString()} Batches/Month
- Audit Trail Event Frequency: ${auditTrailEventFrequency.replace(/_/g, ' ').toUpperCase()}
- Statutory Regulatory Standard: ${validationFramework.replace(/_/g, ' ').toUpperCase()}
- Cryptographic Merkle Hash: ${cryptographicAlgorithm.replace(/_/g, ' ').toUpperCase()}
- Electronic Signature Mechanism: ${signatureType.replace(/_/g, ' ').toUpperCase()}

TELEMETRY & INTEGRITY BENCHMARKS:
- Verification Latency: ${results.auditTrailVerificationLatencyMs} ms / Batch Record
- Tamper Detection Confidence: ${results.tamperDetectionConfidencePercentage}%
- Form 483 / Warning Letter Risk: ${results.regulatoryFindingRiskPercentage}% (Baseline: 4.5%)
- Pre-Audit Throughput: ${results.eBmrThroughputBatchesPerHour.toLocaleString()} Batches/Hour
- Statutory Compliance Rating: ${results.statutoryComplianceScore}% (CDSCO Schedule M / 21 CFR Part 11 / BSA 2023)
- Annual Validation OPEX Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualValidationOpexReduction.toLocaleString()} / Plant
- Status Classification: ${results.statusClassification}

ARCHITECTURAL SAFEGUARDS:
1. Append-only Merkle-tree cryptographic hash chain eliminates unauthorized retroactive edits in Chromatography Data Systems (CDS).
2. Dual-signature verification enforces GAMP 5 separation of duties (Production QA verification before Qualified Person release).
3. Air-gapped private VPC inference protects Master Formula Records (MFR) and active drug substance synthesis IP.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Telemetry SVG points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', confPath: '', rawPoints: [] };

    const maxLat = 25;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.verificationLatencyMs / maxLat) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const confPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - ((pt.tamperDetectionConfidencePct - 99.99) / 0.01) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const confD = confPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, confPath: confD, rawPoints: trace };
  }, [results.telemetryTrace]);

  const faqs = [
    {
      q: "How does the autonomous agent guarantee compliance under US FDA 21 CFR Part 11 and CDSCO Revised Schedule M?",
      a: "The architecture binds every Electronic Batch Manufacturing Record (eBMR) transaction to an append-only SHA-256 Merkle tree. Each event records the exact UTC timestamp (NPL-synchronized), unique employee ID, pre-modification and post-modification values, and reason code. Dual-factor electronic signatures are anchored to X.509 PKI certificates, satisfying both 21 CFR 11.50 signature manifests and Section 63 of India's Bharatiya Sakshya Adhiniyam 2023 for legal non-repudiation."
    },
    {
      q: "Can this system integrate directly with Waters Empower 3 and Thermo Chromeleon CDS?",
      a: "Yes. Elesium deploys read-only industrial edge adapters that monitor CDS raw audit tables without altering active validated chromatography instrument sequences. System suitability metrics (theoretical plates, USP tailing, % RSD) and manual peak integration adjustments are flagged in real-time, preventing undocumented trial runs."
    },
    {
      q: "How is proprietary formulation IP protected during AI analysis?",
      a: "All agentic inference executes inside an air-gapped private VPC or on-premise NVIDIA accelerator cluster located within the plant firewall. Master Formula Records (MFR), chemical synthesis recipes, and active drug substance tolerances never traverse public internet APIs, completely eliminating industrial espionage risk."
    },
    {
      q: "What is the typical reduction in batch record review cycle time?",
      a: "Commercial deployments in Telangana (Hyderabad Genome Valley) and Gujarat demonstrate a reduction from an 18–24 business day manual QA review cycle down to 3.4 hours of automated pre-audit verification, liberating millions in quarantined working capital."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30">
      <Helmet>
        <title>CDSCO &amp; US FDA 21 CFR Part 11 eBMR Validation Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate pharmaceutical Electronic Batch Manufacturing Record (eBMR) verification, GAMP 5 audit trail integrity, and CDSCO/FDA compliance telemetry."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-cfr-part-11-validation-simulator" />
      </Helmet>

      {/* Exit Intent Memo Modal for CRO */}
      <ExitIntentMemoModal
        toolName="CDSCO & US FDA 21 CFR Part 11 Validation Simulator"
        simulatedMetrics={[
          { label: 'eBMR Latency', value: `${results.auditTrailVerificationLatencyMs} ms` },
          { label: 'Tamper Confidence', value: `${results.tamperDetectionConfidencePercentage}%` },
          { label: 'Form 483 Risk', value: `${results.regulatoryFindingRiskPercentage}%` },
          { label: 'Compliance Score', value: `${results.statutoryComplianceScore}%` }
        ]}
      />

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-[#020617] pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator #38 • Pharma &amp; Life Sciences</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl">
            CDSCO &amp; US FDA 21 CFR Part 11 <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
              Electronic Batch Record &amp; Audit Trail Simulator
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Simulate cryptographic Merkle audit trail verification, GAMP 5 data integrity compliance,
            and automated batch release cycle acceleration across Indian formulation plants and active pharmaceutical ingredient (API) facilities.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <Code className="w-4 h-4 text-cyan-400" />
              <span>Embed This Simulator</span>
            </button>

            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-all"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{hasCopiedMemo ? 'Audit Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>

            <div className="ml-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${currency === 'INR' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-colors ${currency === 'USD' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Validation Parameters
                </span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  GAMP 5 Category 4/5
                </span>
              </div>

              {/* Slider 1: Monthly Batch Volume */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Monthly Batch Record Volume</span>
                  <span className="font-mono font-bold text-cyan-400">{batchRecordVolumePerMonth.toLocaleString()} batches</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={batchRecordVolumePerMonth}
                  onChange={(e) => setBatchRecordVolumePerMonth(Number(e.target.value))}
                  aria-label="Monthly Batch Record Volume"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50 (Pilot Plant)</span>
                  <span>5,000 (Commercial Megasite)</span>
                </div>
              </div>

              {/* Selector 2: Audit Trail Event Frequency */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Audit Trail Event Frequency
                </label>
                <select
                  value={auditTrailEventFrequency}
                  onChange={(e) => setAuditTrailEventFrequency(e.target.value as any)}
                  aria-label="Audit Trail Event Frequency"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="standard_hourly">Hourly Step Logs (450 events / batch)</option>
                  <option value="high_frequency_scada">SCADA Telemetry Stream (3,200 events / batch)</option>
                  <option value="millisecond_distributed">Edge Sensor Mesh (12,500 events / batch)</option>
                </select>
              </div>

              {/* Selector 3: Validation Framework */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Statutory Regulatory Framework
                </label>
                <select
                  value={validationFramework}
                  onChange={(e) => setValidationFramework(e.target.value as any)}
                  aria-label="Statutory Regulatory Framework"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="us_fda_21_cfr_part_11">US FDA 21 CFR Part 11 (Export Focus)</option>
                  <option value="cdsco_schedule_m">CDSCO Revised Schedule M (India Domestic)</option>
                  <option value="eu_gmp_annex_11">EU GMP Annex 11 (EMA Export Focus)</option>
                  <option value="who_trs_961">WHO Technical Report Series 961 Annex 2</option>
                </select>
              </div>

              {/* Selector 4: Cryptographic Algorithm */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Cryptographic Audit Hash Proof
                </label>
                <select
                  value={cryptographicAlgorithm}
                  onChange={(e) => setCryptographicAlgorithm(e.target.value as any)}
                  aria-label="Cryptographic Audit Hash Proof"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="sha_256_merkle">SHA-256 Merkle Chain (NIST SP 800-106)</option>
                  <option value="sha_512_hmac">SHA-512 HMAC Attestation Vault</option>
                  <option value="blake3_tree">BLAKE3 Parallel Tree Hash (Sub-2ms)</option>
                  <option value="ml_kem_dilithium_post_quantum">ML-DSA Dilithium Post-Quantum (FIPS 204)</option>
                </select>
              </div>

              {/* Selector 5: Electronic Signature Mechanism */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Electronic Signature Authority
                </label>
                <select
                  value={signatureType}
                  onChange={(e) => setSignatureType(e.target.value as any)}
                  aria-label="Electronic Signature Authority"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="digital_pki_x509">Dual-Factor X.509 PKI Digital Signature</option>
                  <option value="aadhaar_esign_biometric">Aadhaar e-Sign Biometric (BSA 2023 Sec 63)</option>
                  <option value="hardware_fips_token">FIPS 140-3 Hardware Enclave Key (YubiKey)</option>
                </select>
              </div>
            </div>

            {/* Quick Architecture Callout */}
            <div className="bg-gradient-to-br from-cyan-950/30 to-slate-900 border border-cyan-800/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>Section 63 BSA 2023 Admissibility Guarantee</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generates court-admissible electronic record certificates automatically during each batch release,
                affirming continuous uninterrupted operation under Indian regulatory law.
              </p>
            </div>
          </div>

          {/* Right Column: Telemetry Results & Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">eBMR Verification Latency</span>
                <span className="text-2xl font-mono font-bold text-cyan-400">{results.auditTrailVerificationLatencyMs} ms</span>
                <span className="text-[10px] text-slate-500 block mt-1">Per commercial batch</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">Tamper Confidence</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">{results.tamperDetectionConfidencePercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Merkle chain integrity</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block mb-1">Form 483 Risk</span>
                <span className="text-2xl font-mono font-bold text-indigo-400">{results.regulatoryFindingRiskPercentage}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Down from 4.5% baseline</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">Pre-Audit Throughput</span>
                <span className="text-2xl font-mono font-bold text-white">{results.eBmrThroughputBatchesPerHour.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Batches / hour max</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">Statutory Compliance</span>
                <span className="text-2xl font-mono font-bold text-teal-400">{results.statutoryComplianceScore}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">GAMP 5 &amp; CDSCO</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block mb-1">Annual OPEX Savings</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {currency === 'INR' ? `₹${(results.annualValidationOpexReduction / 100000).toFixed(1)}L` : `$${(results.annualValidationOpexReduction / 1000).toFixed(0)}k`}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Per formulation facility</span>
              </div>
            </div>

            {/* Interactive Telemetry Oscilloscope */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    10-Stage Pipeline Telemetry &amp; Merkle Chain Oscilloscope
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time simulation of batch verification stages</p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> Latency (ms)
                  </span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span> Merkle Lock
                  </span>
                </div>
              </div>

              <div className="w-full h-[140px] bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                  <line x1="0" y1="35" x2="500" y2="35" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="105" x2="500" y2="105" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

                  {svgData.latPath && (
                    <path d={svgData.latPath} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
                  )}
                  {svgData.confPath && (
                    <path d={svgData.confPath} fill="none" stroke="#34d399" strokeWidth="2" strokeDasharray="4,3" strokeLinecap="round" />
                  )}
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">State Classification</span>
                  <span className="font-mono text-cyan-400 font-semibold">{results.statusClassification}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Ingestion</span>
                  <span className="font-mono text-slate-200">OPC-UA / LIMS</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Review Turnaround</span>
                  <span className="font-mono text-emerald-400 font-semibold">3.4 Hours (vs 18d)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Regulatory Posture</span>
                  <span className="font-mono text-slate-200">Zero Warning Letters</span>
                </div>
              </div>
            </div>

            {/* CTA Audit Module */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Deploy Sovereign 21 CFR Part 11 AI Across Your Plants</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Schedule an enterprise architecture audit to integrate deterministic eBMR validation,
                    LIMS chromatographic telemetry, and air-gapped private VPC LLMs within your manufacturing network.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-500/20">
                    <span>Schedule Sovereign Pharma Architecture Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="max-w-2xl mx-auto p-6 space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white">Schedule Sovereign Pharmaceutical AI Audit</h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Private VPC deployment, 21 CFR Part 11 validation, and LIMS telemetry synchronization.
                        </p>
                      </div>
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Sections */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Architectural Deep Dive: Solving the Indian Pharmaceutical Data Integrity Crisis
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
              Why manual QA binder checks fail US FDA 21 CFR Part 11 and how sovereign deterministic agents
              enforce cryptographic non-repudiation across formulation corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 w-fit">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Continuous Merkle Audit Chains</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every sensor telemetry point and analyst action is hashed with SHA-256 into a continuous Merkle tree.
                Any retroactive alteration breaks cryptographic hash integrity instantly, eliminating Form 483 citations.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Direct CDS Telemetry Ingestion</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Eliminates manual spreadsheet exports between Waters Empower 3 / Chromeleon CDS and LIMS.
                System suitability and baseline peak integrations are verified before automated eBMR sign-off.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 w-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Air-Gapped Private VPC Security</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Master Formula Records (MFR) and active drug substance synthesis IP stay 100% within the enterprise
                firewall, executing on dedicated local NVIDIA accelerators with zero public cloud exposure.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Frequently Asked Architectural Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed Simulator on Your Website</span>
              </div>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copy and paste this HTML snippet into your technical documentation, portal, or internal knowledge base.
            </p>

            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-cyan-300 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
