import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Scale,
  ShieldCheck,
  AlertOctagon,
  ExternalLink
} from 'lucide-react';
import {
  calculateDpdpAudit,
  formatCrore,
  formatCompactNumber,
  INFERENCE_BOUNDARIES,
  InferenceBoundaryKey,
  Currency
} from '../calculator/dpdpAuditSimulatorModel';

export default function EmbedDpdpAuditSimulator() {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [recordVolume, setRecordVolume] = useState<number>(500000);
  const [inferenceBoundary, setInferenceBoundary] = useState<InferenceBoundaryKey>('public_us_cloud');
  const [isSignificantDataFiduciary, setIsSignificantDataFiduciary] = useState<boolean>(true);

  const selectedPiiTypes = ['aadhaar_pan', 'financial_banking', 'health_medical'];
  const safeguards = {
    automatedPiiRedaction: false,
    ephemeralMemoryNoLogging: false,
    cryptographicAuditLedger: false,
    sub6HourBreachDetection: false,
    dataPrincipalRightsAutomation: false
  };

  const results = useMemo(() => {
    return calculateDpdpAudit({
      recordVolume,
      inferenceBoundary,
      selectedPiiTypes,
      safeguards,
      isSignificantDataFiduciary,
      currency
    });
  }, [recordVolume, inferenceBoundary, selectedPiiTypes, safeguards, isSignificantDataFiduciary, currency]);

  return (
    <>
      <Helmet>
        <title>DPDP Act 2023 Statutory Audit Simulator Widget | Elesium</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/embed/dpdp-audit-simulator" />
      </Helmet>

      <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-slate-800 rounded-2xl shadow-2xl">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-500" />
              <span className="font-bold text-sm tracking-tight text-white">
                DPDP Act 2023 Statutory Audit Simulator
              </span>
            </div>
            
            {/* Currency toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-[10px]">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'INR' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                INR (₹ Cr)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'USD' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($M)
              </button>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                AI Inference Host Boundary:
              </label>
              <select
                value={inferenceBoundary}
                onChange={(e) => setInferenceBoundary(e.target.value as InferenceBoundaryKey)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {Object.values(INFERENCE_BOUNDARIES).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Data Principals Processed:
              </label>
              <div className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-bold flex justify-between items-center">
                <span>{formatCompactNumber(recordVolume)} Records</span>
                <span className="text-[10px] text-slate-500 font-normal">Section 10 SDF</span>
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-3 mb-5">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-slate-400">Record Volume Tier:</span>
                <span className="text-amber-400 font-bold">{formatCompactNumber(recordVolume)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="50000"
                value={recordVolume}
                onChange={(e) => setRecordVolume(parseInt(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
              />
            </div>

            {/* SDF Toggle */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between text-xs">
              <span className="text-slate-300">Significant Data Fiduciary (SDF):</span>
              <button
                onClick={() => setIsSignificantDataFiduciary(!isSignificantDataFiduciary)}
                className={`px-3 py-1 rounded text-[11px] font-mono font-semibold transition-colors ${
                  isSignificantDataFiduciary ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {isSignificantDataFiduciary ? 'Designated SDF' : 'Standard Fiduciary'}
              </button>
            </div>
          </div>

          {/* Primary Penalty Display Banner */}
          <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-amber-400 mb-1">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                ESTIMATED STATUTORY LIABILITY
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Grade: {results.complianceGrade}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {formatCrore(results.estimatedLiabilityINR, currency)}
              </span>
              <span className="text-slate-400 text-xs font-mono">
                (Statutory Ceiling: {formatCrore(results.statutoryMaxPenaltyINR, currency)})
              </span>
            </div>

            <div className="text-[11px] text-slate-400">
              Sovereign Local VPC Remediated Risk: <strong className="text-emerald-400 font-mono">{formatCrore(results.sovereignRemediatedLiabilityINR, currency)}</strong>
            </div>
          </div>

          {/* 3-Col KPI Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] font-mono text-slate-400">Compliance Score</div>
              <div className="text-sm sm:text-base font-bold text-amber-400">
                {results.overallComplianceScore}/100
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] font-mono text-slate-400">Breach Probability</div>
              <div className="text-sm sm:text-base font-bold text-rose-400">
                {results.breachProbabilityPct}%
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-2.5">
              <div className="text-[10px] font-mono text-slate-400">Sovereign Cut</div>
              <div className="text-sm sm:text-base font-bold text-emerald-400">
                {results.liabilityReductionPct}%
              </div>
            </div>
          </div>

        </div>

        {/* Footer & Watermark Backlink */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="text-slate-400 font-mono text-center sm:text-left">
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>Elesium Sovereign AI Solutions</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <a
            href="https://elesium.online/audit"
            target="_top"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lock In DPDP Safe Harbor</span>
          </a>
        </div>

      </div>
    </>
  );
}
