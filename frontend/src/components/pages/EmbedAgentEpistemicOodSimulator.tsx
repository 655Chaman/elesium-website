import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateEpistemicOodMetrics,
  EpistemicOodInputs
} from '../calculator/agentEpistemicOodModel';
import { Activity, ShieldCheck } from 'lucide-react';

export default function EmbedAgentEpistemicOodSimulator() {
  const [dailyQueries, setDailyQueries] = useState<number>(100000);
  const [oodContaminationRate, setOodContaminationRate] = useState<number>(8);
  const confidenceThreshold = 0.85;
  const [calibrationMethod, setCalibrationMethod] = useState<'uncalibrated' | 'temperature_scaling' | 'conformal_prediction' | 'bayesian_ensemble'>('conformal_prediction');
  const oodDetectionMethod = 'mahalanobis_latent';

  const inputs: EpistemicOodInputs = useMemo(() => ({
    dailyQueries,
    oodContaminationRate,
    confidenceThreshold,
    calibrationMethod,
    oodDetectionMethod,
    costPerCatastrophicFailure: 75000,
    currency: 'INR'
  }), [dailyQueries, oodContaminationRate, confidenceThreshold, calibrationMethod, oodDetectionMethod]);

  const results = useMemo(() => {
    return calculateEpistemicOodMetrics(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Epistemic Uncertainty & OOD Calibrator Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-epistemic-ood-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              Agent Epistemic Uncertainty &amp; OOD Calibrator
            </h1>
            <p className="text-[11px] text-slate-400">
              Conformal prediction and Mahalanobis latent distance simulator.
            </p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-800">
            ECE: {results.expectedCalibrationError}%
          </span>
        </div>

        {/* Sliders */}
        <div className="space-y-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Daily Queries</span>
              <span className="font-mono text-cyan-400">{dailyQueries.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="10000"
              value={dailyQueries}
              onChange={(e) => setDailyQueries(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>OOD Contamination Rate</span>
              <span className="font-mono text-cyan-400">{oodContaminationRate}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={oodContaminationRate}
              onChange={(e) => setOodContaminationRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Architecture selection */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => setCalibrationMethod('uncalibrated')}
              className={`p-2 rounded border text-[11px] text-left ${
                calibrationMethod === 'uncalibrated'
                  ? 'bg-rose-950/40 border-rose-500 text-rose-300 font-semibold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              Uncalibrated Softmax
            </button>
            <button
              onClick={() => setCalibrationMethod('conformal_prediction')}
              className={`p-2 rounded border text-[11px] text-left ${
                calibrationMethod === 'conformal_prediction'
                  ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 font-semibold'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              Conformal Prediction
            </button>
          </div>
        </div>

        {/* Output Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">OOD AUROC</div>
            <div className="text-sm font-bold font-mono text-cyan-400">{results.oodAuroc}%</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">Autonomous Execution</div>
            <div className="text-sm font-bold font-mono text-white">{results.autonomousExecutionRate}%</div>
          </div>
          <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400">P99 Latency</div>
            <div className="text-sm font-bold font-mono text-teal-300">{results.p99LatencyMs}ms</div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DPDP Act 2023 Calibrated</span>
          </div>
          <div>
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 underline hover:text-cyan-300"
            >
              Elesium Sovereign AI
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
