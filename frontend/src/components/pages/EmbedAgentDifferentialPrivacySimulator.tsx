import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateDifferentialPrivacy,
  DifferentialPrivacyInputs
} from '../calculator/agentDifferentialPrivacyModel';
import { Lock, ShieldCheck } from 'lucide-react';

export default function EmbedAgentDifferentialPrivacySimulator() {
  const [dailyGradientSteps, setDailyGradientSteps] = useState<number>(10000);
  const [clippingNormC, setClippingNormC] = useState<number>(1.0);
  const [noiseMultiplierSigma, setNoiseMultiplierSigma] = useState<number>(1.2);
  const [sanitizerMethod, setSanitizerMethod] = useState<'unsanitized' | 'laplace_naive' | 'dpsgd_gaussian' | 'secagg_dp'>('dpsgd_gaussian');

  const inputs: DifferentialPrivacyInputs = useMemo(() => ({
    dailyGradientSteps,
    clippingNormC,
    noiseMultiplierSigma,
    batchSize: 64,
    sanitizerMethod,
    piiRecordPenaltyINR: 50000,
    currency: 'INR'
  }), [dailyGradientSteps, clippingNormC, noiseMultiplierSigma, sanitizerMethod]);

  const results = useMemo(() => {
    return simulateDifferentialPrivacy(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Differential Privacy & Gradient Sanitizer | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-differential-privacy-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-400" />
              Agent Differential Privacy &amp; Gradient Sanitizer
            </h1>
            <p className="text-[11px] text-slate-400">
              DP-SGD gradient clipping and Gaussian noise perturbation simulator.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-400 border border-purple-800">
            &epsilon;: {results.epsilonPrivacyBudget}
          </span>
        </div>

        {/* Sliders */}
        <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Daily Gradient Steps</span>
              <span className="font-mono text-purple-400">{dailyGradientSteps.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={dailyGradientSteps}
              onChange={(e) => setDailyGradientSteps(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>L2 Clipping Bound (C)</span>
              <span className="font-mono text-purple-400">{clippingNormC.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={clippingNormC}
              onChange={(e) => setClippingNormC(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Noise Multiplier (&sigma;)</span>
              <span className="font-mono text-purple-400">{noiseMultiplierSigma.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.5"
              step="0.05"
              value={noiseMultiplierSigma}
              onChange={(e) => setNoiseMultiplierSigma(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
          </div>

          {/* Architecture selection */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setSanitizerMethod('unsanitized')}
              className={`p-2 rounded border text-[11px] text-left ${
                sanitizerMethod === 'unsanitized'
                  ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-semibold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              Unsanitized (DLG Risk)
            </button>
            <button
              onClick={() => setSanitizerMethod('dpsgd_gaussian')}
              className={`p-2 rounded border text-[11px] text-left ${
                sanitizerMethod === 'dpsgd_gaussian'
                  ? 'bg-purple-950/40 border-purple-500 text-purple-300 font-semibold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              DP-SGD Gaussian
            </button>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Inversion Risk</div>
            <div className="text-sm font-bold font-mono text-purple-400">{results.gradientInversionRisk}%</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Utility Retained</div>
            <div className="text-sm font-bold font-mono text-white">{results.modelUtilityRetention}%</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Latency Penalty</div>
            <div className="text-sm font-bold font-mono text-purple-300">+{results.sanitizationLatencyMs}ms</div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Safe Harbor</span>
          </div>
          <div>
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline hover:text-purple-300"
            >
              Elesium Sovereign AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
