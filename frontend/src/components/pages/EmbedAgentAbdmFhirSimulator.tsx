import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateAbdmFhirPrivacy,
  AbdmFhirInputs
} from '../calculator/agentAbdmFhirModel';
import { Activity, ShieldCheck, HeartPulse } from 'lucide-react';

export default function EmbedAgentAbdmFhirSimulator() {
  const [fhirResourceComplexity, setFhirResourceComplexity] = useState<'basic_encounter_bundle' | 'longitudinal_inpatient_ehr' | 'genomic_multimodal_dicom' | 'full_abdm_health_record'>('full_abdm_health_record');
  const [deidentificationAlgorithm, setDeidentificationAlgorithm] = useState<'dp_differential_privacy_laplace' | 'k_anonymity_l_diversity' | 'synthetic_fhir_generative_diffusion' | 'zero_leakage_pseudonymization_fhe'>('dp_differential_privacy_laplace');
  const [privacyEpsilonBudget, setPrivacyEpsilonBudget] = useState<number>(1.2);
  const [consentManagerLatencyMs, setConsentManagerLatencyMs] = useState<number>(35);
  const clinicalRecordVolumePerDay = 5000;

  const inputs: AbdmFhirInputs = useMemo(() => ({
    clinicalRecordVolumePerDay,
    fhirResourceComplexity,
    deidentificationAlgorithm,
    privacyEpsilonBudget,
    consentManagerLatencyMs,
    currency: 'INR'
  }), [
    clinicalRecordVolumePerDay,
    fhirResourceComplexity,
    deidentificationAlgorithm,
    privacyEpsilonBudget,
    consentManagerLatencyMs
  ]);

  const results = useMemo(() => {
    return simulateAbdmFhirPrivacy(inputs);
  }, [inputs]);

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', riskPath: '', rawPoints: [] };

    const maxLat = 150;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.deidLatencyMs / maxLat) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const riskPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.reidRiskPct / 0.1) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const riskD = riskPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, riskPath: riskD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>ABDM FHIR Privacy & De-Identification Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-abdm-fhir-privacy-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <HeartPulse className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">ABDM FHIR Privacy &amp; De-Identification</h1>
              <p className="text-[10px] text-slate-400">HL7 FHIR R4 &amp; DPDP Differential Privacy Simulator</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            {results.statusClassification.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">FHIR Resource Complexity</label>
            <select
              value={fhirResourceComplexity}
              onChange={(e) => setFhirResourceComplexity(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="basic_encounter_bundle">Basic Consultation Encounter</option>
              <option value="longitudinal_inpatient_ehr">Longitudinal IPD Clinical Chart</option>
              <option value="genomic_multimodal_dicom">Multimodal DICOM / Radiology</option>
              <option value="full_abdm_health_record">Full ABDM M1/M2/M3 Bundle</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">De-Identification Engine</label>
            <select
              value={deidentificationAlgorithm}
              onChange={(e) => setDeidentificationAlgorithm(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="dp_differential_privacy_laplace">Laplace Differential Privacy</option>
              <option value="k_anonymity_l_diversity">k-Anonymity &amp; l-Diversity</option>
              <option value="synthetic_fhir_generative_diffusion">Generative Diffusion Synthesizer</option>
              <option value="zero_leakage_pseudonymization_fhe">FHE Pseudonymization</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Differential Privacy Budget (ε)</span>
              <span className="font-mono text-emerald-400">ε = {privacyEpsilonBudget.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="4.0"
              step="0.1"
              value={privacyEpsilonBudget}
              onChange={(e) => setPrivacyEpsilonBudget(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Consent Gateway Latency</span>
              <span className="font-mono text-cyan-400">{consentManagerLatencyMs} ms</span>
            </div>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={consentManagerLatencyMs}
              onChange={(e) => setConsentManagerLatencyMs(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Results Metrics 4-Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">De-ID Latency</div>
            <div className="text-base font-bold font-mono text-emerald-400">{results.deidentificationLatencyMs} ms</div>
            <div className="text-[9px] text-slate-500">Per patient record</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Re-ID Risk</div>
            <div className="text-base font-bold font-mono text-purple-400">{results.reidentificationRiskPercentage}%</div>
            <div className="text-[9px] text-slate-500">Empirical leak rate</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Clinical Utility</div>
            <div className="text-base font-bold font-mono text-cyan-400">{results.clinicalDataUtilityScore}%</div>
            <div className="text-[9px] text-slate-500">AI model accuracy</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Compliance Index</div>
            <div className="text-base font-bold font-mono text-emerald-300">{results.statutoryComplianceScore}%</div>
            <div className="text-[9px] text-slate-500">DPDP Act / NABH</div>
          </div>
        </div>

        {/* SVG Telemetry Oscilloscope */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>De-Identification Latency &amp; Re-ID Risk Oscilloscope</span>
            </div>
            <div className="flex items-center space-x-3 text-[9px]">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span>
                <span>Latency</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-0.5 bg-purple-400 inline-block"></span>
                <span>Risk</span>
              </span>
            </div>
          </div>
          <div className="h-20 w-full overflow-hidden">
            <svg viewBox="0 0 340 90" className="w-full h-full preserve-3d">
              <line x1="0" y1="45" x2="340" y2="45" stroke="#1e293b" strokeDasharray="3 3" />
              <path d={svgData.latPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <path d={svgData.riskPath} fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sovereign Hospital Private VPC Architecture</span>
          </div>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium transition"
          >
            Elesium Healthcare AI Solutions &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
