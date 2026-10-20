import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateCfrPart11Validation,
  CfrPart11Inputs
} from '../calculator/agentCfrPart11Model';
import { FileCheck, Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentCfrPart11Simulator() {
  const [batchRecordVolumePerMonth, setBatchRecordVolumePerMonth] = useState<number>(500);
  const [auditTrailEventFrequency, setAuditTrailEventFrequency] = useState<'standard_hourly' | 'high_frequency_scada' | 'millisecond_distributed'>('high_frequency_scada');
  const [validationFramework, setValidationFramework] = useState<'cdsco_schedule_m' | 'us_fda_21_cfr_part_11' | 'eu_gmp_annex_11' | 'who_trs_961'>('us_fda_21_cfr_part_11');
  const [cryptographicAlgorithm, setCryptographicAlgorithm] = useState<'sha_256_merkle' | 'sha_512_hmac' | 'blake3_tree' | 'ml_kem_dilithium_post_quantum'>('sha_256_merkle');
  const [signatureType, setSignatureType] = useState<'digital_pki_x509' | 'aadhaar_esign_biometric' | 'hardware_fips_token'>('digital_pki_x509');

  const inputs: CfrPart11Inputs = useMemo(() => ({
    batchRecordVolumePerMonth,
    auditTrailEventFrequency,
    validationFramework,
    cryptographicAlgorithm,
    signatureType,
    currency: 'INR'
  }), [
    batchRecordVolumePerMonth,
    auditTrailEventFrequency,
    validationFramework,
    cryptographicAlgorithm,
    signatureType
  ]);

  const results = useMemo(() => {
    return simulateCfrPart11Validation(inputs);
  }, [inputs]);

  // Generate SVG telemetry trace
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', confPath: '', rawPoints: [] };

    const maxLat = 25;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.verificationLatencyMs / maxLat) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const confPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - ((pt.tamperDetectionConfidencePct - 99.99) / 0.01) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const confD = confPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, confPath: confD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>CDSCO &amp; 21 CFR Part 11 eBMR Validation Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-cfr-part-11-validation-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">21 CFR Part 11 &amp; CDSCO eBMR Validation</h1>
              <p className="text-[10px] text-slate-400">GAMP 5 Electronic Batch Record Cryptographic Simulator</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-cyan-500/10 border-cyan-500/30 text-cyan-400">
            {results.statusClassification}
          </span>
        </div>

        {/* Sliders & Controls */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div>
            <label className="text-[11px] text-slate-300 block mb-1">
              Monthly Batches: <span className="text-cyan-400 font-mono">{batchRecordVolumePerMonth}</span>
            </label>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={batchRecordVolumePerMonth}
              onChange={(e) => setBatchRecordVolumePerMonth(Number(e.target.value))}
              aria-label="Monthly Batches"
              className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Audit Trail Frequency</label>
            <select
              value={auditTrailEventFrequency}
              onChange={(e) => setAuditTrailEventFrequency(e.target.value as any)}
              aria-label="Audit Trail Frequency"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="standard_hourly">Hourly Log (450 events)</option>
              <option value="high_frequency_scada">SCADA Telemetry (3,200 events)</option>
              <option value="millisecond_distributed">Millisecond Edge (12,500 events)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Validation Standard</label>
            <select
              value={validationFramework}
              onChange={(e) => setValidationFramework(e.target.value as any)}
              aria-label="Validation Standard"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="us_fda_21_cfr_part_11">US FDA 21 CFR Part 11</option>
              <option value="cdsco_schedule_m">CDSCO Revised Schedule M</option>
              <option value="eu_gmp_annex_11">EU GMP Annex 11</option>
              <option value="who_trs_961">WHO TRS 961 Annex 2</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Signature &amp; Hash</label>
            <select
              value={`${cryptographicAlgorithm}|${signatureType}`}
              onChange={(e) => {
                const [algo, sig] = e.target.value.split('|');
                setCryptographicAlgorithm(algo as any);
                setSignatureType(sig as any);
              }}
              aria-label="Signature &amp; Hash"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="sha_256_merkle|digital_pki_x509">SHA-256 + PKI X.509</option>
              <option value="sha_512_hmac|hardware_fips_token">SHA-512 + FIPS Token</option>
              <option value="blake3_tree|aadhaar_esign_biometric">BLAKE3 + Aadhaar e-Sign</option>
              <option value="ml_kem_dilithium_post_quantum|digital_pki_x509">ML-DSA Post-Quantum</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Verification Latency</span>
            <span className="text-base font-mono font-bold text-cyan-400">{results.auditTrailVerificationLatencyMs} ms</span>
            <span className="text-[9px] text-slate-500 block">Per eBMR batch</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Tamper Detection</span>
            <span className="text-base font-mono font-bold text-emerald-400">{results.tamperDetectionConfidencePercentage}%</span>
            <span className="text-[9px] text-slate-500 block">Merkle integrity</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Form 483 Finding Risk</span>
            <span className="text-base font-mono font-bold text-indigo-400">{results.regulatoryFindingRiskPercentage}%</span>
            <span className="text-[9px] text-slate-500 block">From 4.5% baseline</span>
          </div>
        </div>

        {/* Live SVG Oscilloscope */}
        <div className="bg-slate-950/80 border border-slate-800/60 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              Batch Execution Oscilloscope (10-Stage Pipeline)
            </span>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="text-cyan-400 flex items-center gap-1">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block"></span> Latency (ms)
              </span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span> Merkle Lock
              </span>
            </div>
          </div>

          <div className="w-full h-[90px] bg-slate-900/40 rounded-lg p-1.5 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 340 90" className="w-full h-full overflow-visible">
              <line x1="0" y1="22" x2="340" y2="22" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="45" x2="340" y2="45" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="68" x2="340" y2="68" stroke="#334155" strokeWidth="0.5" strokeDasharray="2,2" />

              {svgData.latPath && (
                <path d={svgData.latPath} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
              )}
              {svgData.confPath && (
                <path d={svgData.confPath} fill="none" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Annual Savings & Watermark Backlink */}
        <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Annual Documentation OPEX Reduction</span>
            <span className="font-mono font-bold text-emerald-400">₹{(results.annualValidationOpexReduction / 100000).toFixed(1)} Lakhs / facility</span>
          </div>

          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Powered by Elesium Life Sciences AI</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
