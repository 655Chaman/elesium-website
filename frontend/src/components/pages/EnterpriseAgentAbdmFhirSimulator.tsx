import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  HeartPulse,
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
  ShieldAlert,
  Lock,
  Download,
  Database
} from 'lucide-react';
import {
  simulateAbdmFhirPrivacy,
  AbdmFhirInputs
} from '../calculator/agentAbdmFhirModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentAbdmFhirSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [clinicalRecordVolumePerDay, setClinicalRecordVolumePerDay] = useState<number>(5000);
  const [fhirResourceComplexity, setFhirResourceComplexity] = useState<'basic_encounter_bundle' | 'longitudinal_inpatient_ehr' | 'genomic_multimodal_dicom' | 'full_abdm_health_record'>('full_abdm_health_record');
  const [deidentificationAlgorithm, setDeidentificationAlgorithm] = useState<'dp_differential_privacy_laplace' | 'k_anonymity_l_diversity' | 'synthetic_fhir_generative_diffusion' | 'zero_leakage_pseudonymization_fhe'>('dp_differential_privacy_laplace');
  const [privacyEpsilonBudget, setPrivacyEpsilonBudget] = useState<number>(1.2);
  const [consentManagerLatencyMs, setConsentManagerLatencyMs] = useState<number>(35);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AbdmFhirInputs = useMemo(() => ({
    clinicalRecordVolumePerDay,
    fhirResourceComplexity,
    deidentificationAlgorithm,
    privacyEpsilonBudget,
    consentManagerLatencyMs,
    currency
  }), [
    clinicalRecordVolumePerDay,
    fhirResourceComplexity,
    deidentificationAlgorithm,
    privacyEpsilonBudget,
    consentManagerLatencyMs,
    currency
  ]);

  const results = useMemo(() => {
    return simulateAbdmFhirPrivacy(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-abdm-fhir-privacy-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Sovereign Healthcare AI</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT ABDM FHIR HEALTH RECORD PRIVACY & DE-IDENTIFICATION AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-abdm-fhir-privacy-simulator)

CLINICAL PRIVACY & ABDM SPECIFICATION:
- Daily Clinical Volume: ${clinicalRecordVolumePerDay.toLocaleString()} Patient Records/Day
- FHIR Resource Complexity: ${fhirResourceComplexity.replace(/_/g, ' ').toUpperCase()}
- De-Identification Engine: ${deidentificationAlgorithm.replace(/_/g, ' ').toUpperCase()}
- Differential Privacy Budget: ε = ${privacyEpsilonBudget.toFixed(2)}
- ABDM Gateway Latency: ${consentManagerLatencyMs} ms

TELEMETRY & COMPLIANCE BENCHMARKS:
- De-Identification Latency: ${results.deidentificationLatencyMs} ms / Record
- Re-Identification Risk: ${results.reidentificationRiskPercentage}%
- Clinical Data Utility Retention: ${results.clinicalDataUtilityScore}%
- ABDM Gateway Throughput: ${results.abdmGatewayThroughputRps.toLocaleString()} RPS
- Statutory Compliance Score: ${results.statutoryComplianceScore}% (DPDP Act 2023 / ABDM M1-M3 / NABH)
- Annual Fiduciary Risk Mitigation: ${currency === 'INR' ? '₹' : '$'}${results.annualBreachExposureReduction.toLocaleString()}
- Status Classification: ${results.statusClassification}

GOVERNANCE RECOMMENDATION:
Hospital network satisfies DPDP Act 2023 Section 8 sensitive personal data mandates. Air-gapped deployment verified.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 600;
    const height = 150;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', riskPath: '', rawPoints: [] };

    const maxLat = 150;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.deidLatencyMs / maxLat) * (height * 0.75) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const riskPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.reidRiskPct / 0.1) * (height * 0.75) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const riskD = riskPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, riskPath: riskD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <Helmet>
        <title>Enterprise Agent ABDM FHIR Privacy & De-Identification Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate HL7 FHIR clinical record de-identification, differential privacy epsilon budgets, and ABDM M1/M2/M3 consent manager telemetry for Indian hospital networks."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-abdm-fhir-privacy-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool #37: ABDM FHIR Clinical De-Identification & Privacy Budget Simulator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Enterprise ABDM FHIR Clinical Privacy &amp; De-Identification Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Model HL7 FHIR R4 clinical data de-identification, Laplace differential privacy epsilon budgets, and ABDM
            Health Information Exchange (HIE-CM) telemetry. Ensure zero PHI leakage and 100% statutory compliance under DPDP Act 2023.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Embed Calculator</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Clinical Privacy Controls</h2>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition ${currency === 'INR' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition ${currency === 'USD' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* FHIR Resource Complexity */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>FHIR R4 Bundle Complexity</span>
                <span className="text-[10px] text-slate-500 font-mono">Payload Profile</span>
              </label>
              <select
                value={fhirResourceComplexity}
                onChange={(e) => setFhirResourceComplexity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="basic_encounter_bundle">Basic Consultation Encounter (35 KB)</option>
                <option value="longitudinal_inpatient_ehr">Longitudinal IPD Clinical Chart (280 KB)</option>
                <option value="genomic_multimodal_dicom">Multimodal DICOM / Radiology (1.45 MB)</option>
                <option value="full_abdm_health_record">Full ABDM M1/M2/M3 Bundle (620 KB)</option>
              </select>
            </div>

            {/* De-Identification Engine */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>De-Identification Engine</span>
                <span className="text-[10px] text-slate-500 font-mono">Algorithm Tier</span>
              </label>
              <select
                value={deidentificationAlgorithm}
                onChange={(e) => setDeidentificationAlgorithm(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="dp_differential_privacy_laplace">Laplace Differential Privacy (DP-SGD)</option>
                <option value="k_anonymity_l_diversity">k-Anonymity &amp; l-Diversity Generalization</option>
                <option value="synthetic_fhir_generative_diffusion">Generative Diffusion Synthetic Synthesizer</option>
                <option value="zero_leakage_pseudonymization_fhe">FHE Fully Homomorphic Pseudonymization</option>
              </select>
            </div>

            {/* Differential Privacy Epsilon Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Differential Privacy Budget (ε)</span>
                <span className="font-mono text-emerald-400 font-bold">ε = {privacyEpsilonBudget.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="4.0"
                step="0.1"
                value={privacyEpsilonBudget}
                onChange={(e) => setPrivacyEpsilonBudget(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1 (Strict Enclave)</span>
                <span>1.2 (Clinical Sweet Spot)</span>
                <span>4.0 (Relaxed Utility)</span>
              </div>
            </div>

            {/* Daily Record Volume Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Daily Patient Record Volume</span>
                <span className="font-mono text-cyan-400 font-bold">{clinicalRecordVolumePerDay.toLocaleString()} Records/Day</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={clinicalRecordVolumePerDay}
                onChange={(e) => setClinicalRecordVolumePerDay(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>500 (Clinic)</span>
                <span>15,000 (Tertiary Care)</span>
                <span>50,000 (National Health Net)</span>
              </div>
            </div>

            {/* Consent Gateway Latency Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">ABDM Gateway Roundtrip Ping</span>
                <span className="font-mono text-amber-400 font-bold">{consentManagerLatencyMs} ms</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={consentManagerLatencyMs}
                onChange={(e) => setConsentManagerLatencyMs(parseInt(e.target.value, 10))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 ms (Local VPC)</span>
                <span>45 ms (Pan-India HIE-CM)</span>
                <span>120 ms (Congested)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Status Banner */}
            <div className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              results.statusClassification === 'STATUTORY_PRIVACY_COMPLIANT'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : results.statusClassification === 'RESIDUAL_REIDENTIFICATION_RISK'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <HeartPulse className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Clinical Privacy Classification</div>
                  <div className="text-base font-bold text-white tracking-tight">{results.statusClassification.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Compliance Index</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{results.statutoryComplianceScore}%</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>De-ID Latency</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">{results.deidentificationLatencyMs} ms</div>
                <div className="text-[10px] text-slate-500 mt-1">Per clinical encounter bundle</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
                  <span>Re-ID Risk</span>
                </div>
                <div className="text-2xl font-black font-mono text-purple-400">{results.reidentificationRiskPercentage}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Empirical linkage risk</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <HeartPulse className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Clinical Utility</span>
                </div>
                <div className="text-2xl font-black font-mono text-cyan-400">{results.clinicalDataUtilityScore}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Diagnostic AI retention</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>Gateway Velocity</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-400">{results.abdmGatewayThroughputRps.toLocaleString()} RPS</div>
                <div className="text-[10px] text-slate-500 mt-1">Requests / second throughput</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DPDP Act Score</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300">{results.statutoryComplianceScore}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Section 8 fiduciary rating</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Breach Mitigation</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {currency === 'INR' ? '₹' : '$'}{results.annualBreachExposureReduction.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Fiduciary penalty defense</div>
              </div>
            </div>

            {/* SVG Oscilloscope Section */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400 " />
                  <span className="text-xs font-bold text-white tracking-wide">De-Identification Latency &amp; Privacy Noise Oscilloscope</span>
                </div>
                <div className="flex items-center space-x-4 text-[10px]">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-1 bg-emerald-400 inline-block rounded-full"></span>
                    <span className="text-slate-300">Processing Latency (ms)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-1 bg-purple-400 inline-block rounded-full"></span>
                    <span className="text-slate-300">Re-ID Risk (%)</span>
                  </span>
                </div>
              </div>

              <div className="h-40 w-full overflow-hidden relative">
                <svg viewBox="0 0 600 150" className="w-full h-full preserve-3d">
                  <line x1="0" y1="75" x2="600" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                  <path d={svgData.latPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={svgData.riskPath} fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-center font-mono text-[10px]">
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Batch: </span><span className="text-white font-bold">12 Streams</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Epsilon: </span><span className="text-emerald-400 font-bold">ε = {privacyEpsilonBudget}</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>ABDM HIP: </span><span className="text-cyan-400 font-bold">Active M2/M3</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Audit Trail: </span><span className="text-purple-400 font-bold">SHA-256</span>
                </div>
              </div>
            </div>

            {/* Direct Consultation CTA Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Deploy ABDM FHIR Privacy in Your Hospital Private VPC</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Accelerate discharge turnaround, automate cashless claims, and protect PHI under DPDP Act 2023.
                  </p>
                </div>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center space-x-2 shrink-0 cursor-pointer">
                    <span>Schedule Hospital Audit</span>
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
        </div>

        {/* Technical Deep Dive Documentation */}
        <div className="pt-8 border-t border-slate-800 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold text-white">Architectural Principles: Hospital AI Automation &amp; ABDM Privacy</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Tertiary healthcare institutions handle sensitive patient electronic health records that cannot be exposed to
              public commercial cloud APIs. The Elesium Hospital Privacy Gateway enforces mathematical differential privacy,
              HL7 FHIR R4 standardizations, and automated insurance claims adjudication on sovereign on-premise hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">1. Laplace Differential Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Injects calibrated mathematical noise into quasi-identifiers and diagnostic metrics, guaranteeing privacy loss bounds
                (ε &lt; 1.5) while preserving aggregate clinical utility for medical AI training.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-cyan-400">2. ABDM M1/M2/M3 Compliance</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to National Health Authority (NHA) gateways for ABHA registration, Health Information Provider (HIP)
                record publishing, and consent-driven Health Information User (HIU) record retrieval.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-purple-400">3. NHCX Insurance Adjudication</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Converts clinical narratives into IRDAI-compliant cashless pre-authorization dossiers, validating ICD-10 diagnostic
                codes and billing invariants in sub-minute pipelines.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'How does differential privacy work in hospital clinical records?',
                a: 'Differential privacy adds mathematically calibrated noise to clinical features (such as blood pressure, dosage, or lab values) so that an observer cannot ascertain whether a specific patient was part of the dataset, while maintaining high diagnostic accuracy for AI modeling.'
              },
              {
                q: 'Does this architecture satisfy India\'s DPDP Act 2023 for sensitive personal health data?',
                a: 'Yes. All data processing occurs on-premise inside the hospital\'s private VPC in India with zero third-party API exposure. Patient identifiers are replaced with cryptographic tokens, fully satisfying statutory Section 8 data fiduciary requirements.'
              },
              {
                q: 'What is the impact on patient discharge times?',
                a: 'By automating the synthesis of FHIR R4 discharge bundles, cross-checking pharmacy bills, and auto-submitting cashless claims to the NHCX exchange, hospital discharge wait times are slashed from 5 hours to under 35 minutes.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Embed Modal */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Embed Simulator on Your Website</h3>
                </div>
                <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Copy and paste this clean iframe code to embed the interactive ABDM FHIR Privacy Simulator on your internal hospital portal or technical documentation:
              </p>
              <textarea
                readOnly
                value={embedCode}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  Close
                </button>
                <button
                  onClick={copyEmbedCode}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center space-x-1.5"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Intent Executive Memo Modal */}
        <ExitIntentMemoModal
          toolName="ABDM FHIR Clinical Privacy & De-Identification Simulator"
          simulatedMetrics={[
            { label: 'De-ID Latency', value: `${results.deidentificationLatencyMs} ms` },
            { label: 'Re-ID Risk', value: `${results.reidentificationRiskPercentage}%` },
            { label: 'Clinical Utility', value: `${results.clinicalDataUtilityScore}%` },
            { label: 'DPDP Compliance', value: `${results.statutoryComplianceScore}%` }
          ]}
        />
      </div>
          <WhatsAppModal />
    </div>
  );
}
