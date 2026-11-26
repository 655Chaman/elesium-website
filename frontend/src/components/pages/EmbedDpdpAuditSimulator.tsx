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

      <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-neutral-800 rounded-[24px] shadow-2xl">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-white" />
              <span className="font-bold text-sm tracking-tight text-white">
                DPDP Act 2023 Statutory Audit Simulator
              </span>
            </div>
            
            {/* Currency toggle */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-full border border-neutral-800 text-[10px]">
              <button
                onClick={() => setCurrency('INR')}
                className={`active:scale-[0.97] px-2 py-0.5 rounded font-medium transition-all duration-300 ${
                  currency === 'INR' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INR (₹ Cr)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`active:scale-[0.97] px-2 py-0.5 rounded font-medium transition-all duration-300 ${
                  currency === 'USD' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($M)
              </button>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                AI Inference Host Boundary:
              </label>
              <select
                value={inferenceBoundary}
                onChange={(e) => setInferenceBoundary(e.target.value as InferenceBoundaryKey)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40"
              >
                {Object.values(INFERENCE_BOUNDARIES).map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Data Principals Processed:
              </label>
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold flex justify-between items-center">
                <span>{formatCompactNumber(recordVolume)} Records</span>
                <span className="text-[10px] text-neutral-500 font-normal">Section 10 SDF</span>
              </div>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="space-y-3 mb-5">
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Record Volume Tier:</span>
                <span className="text-white font-bold">{formatCompactNumber(recordVolume)}</span>
              </div>
              <input
                type="range"
                min="10000"
                max="10000000"
                step="50000"
                value={recordVolume}
                onChange={(e) => setRecordVolume(parseInt(e.target.value))}
                className="w-full accent-white bg-neutral-800 h-1 rounded-xl cursor-pointer"
              />
            </div>

            {/* SDF Toggle */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3 flex items-center justify-between text-xs">
              <span className="text-neutral-300">Significant Data Fiduciary (SDF):</span>
              <button
                onClick={() => setIsSignificantDataFiduciary(!isSignificantDataFiduciary)}
                className={`active:scale-[0.97] px-3 py-1 rounded text-[11px] font-mono font-semibold transition-all duration-300 ${
                  isSignificantDataFiduciary ? 'bg-white text-black' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {isSignificantDataFiduciary ? 'Designated SDF' : 'Standard Fiduciary'}
              </button>
            </div>
          </div>

          {/* Primary Penalty Display Banner */}
          <div className="bg-neutral-950 border border-white/20 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-white mb-1">
              <span className="flex items-center gap-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                ESTIMATED STATUTORY LIABILITY
              </span>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold border border-white/20">
                Grade: {results.complianceGrade}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {formatCrore(results.estimatedLiabilityINR, currency)}
              </span>
              <span className="text-neutral-400 text-xs font-mono">
                (Statutory Ceiling: {formatCrore(results.statutoryMaxPenaltyINR, currency)})
              </span>
            </div>

            <div className="text-[11px] text-neutral-400">
              Sovereign Local VPC Remediated Risk: <strong className="text-neutral-200 font-mono">{formatCrore(results.sovereignRemediatedLiabilityINR, currency)}</strong>
            </div>
          </div>

          {/* 3-Col KPI Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Compliance Score</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {results.overallComplianceScore}/100
              </div>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Breach Probability</div>
              <div className="text-sm sm:text-base font-bold text-red-400">
                {results.breachProbabilityPct}%
              </div>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Sovereign Cut</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {results.liabilityReductionPct}%
              </div>
            </div>
          </div>

        </div>

        {/* Footer & Watermark Backlink */}
        <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="text-neutral-400 font-mono text-center sm:text-left">
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>Elesium Sovereign AI Solutions</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <a
            href="https://elesium.online/audit"
            target="_top"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md transition-all duration-300"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Lock In DPDP Safe Harbor</span>
          </a>
        </div>

      </div>
    </>
  );
}
