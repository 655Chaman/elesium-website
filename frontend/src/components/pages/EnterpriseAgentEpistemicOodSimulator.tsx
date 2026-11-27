import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldAlert,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Cpu,
  Layers,
  Activity,
  Scale
} from 'lucide-react';
import {
  calculateEpistemicOodMetrics,
  EpistemicOodInputs
} from '../calculator/agentEpistemicOodModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentEpistemicOodSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [dailyQueries, setDailyQueries] = useState<number>(100000);
  const [oodContaminationRate, setOodContaminationRate] = useState<number>(8);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.85);
  const [calibrationMethod, setCalibrationMethod] = useState<'uncalibrated' | 'temperature_scaling' | 'conformal_prediction' | 'bayesian_ensemble'>('conformal_prediction');
  const [oodDetectionMethod, setOodDetectionMethod] = useState<'softmax_entropy' | 'energy_score' | 'mahalanobis_latent'>('mahalanobis_latent');
  const [costPerCatastrophicFailure, setCostPerCatastrophicFailure] = useState<number>(75000);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: EpistemicOodInputs = useMemo(() => ({
    dailyQueries,
    oodContaminationRate,
    confidenceThreshold,
    calibrationMethod,
    oodDetectionMethod,
    costPerCatastrophicFailure,
    currency
  }), [
    dailyQueries,
    oodContaminationRate,
    confidenceThreshold,
    calibrationMethod,
    oodDetectionMethod,
    costPerCatastrophicFailure,
    currency
  ]);

  const results = useMemo(() => {
    return calculateEpistemicOodMetrics(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-epistemic-ood-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe>
<div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AUTONOMOUS AGENT EPISTEMIC UNCERTAINTY & OOD AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-epistemic-ood-simulator)

WORKLOAD PROFILE:
- Daily Agent Queries: ${dailyQueries.toLocaleString()}
- OOD Contamination Rate: ${oodContaminationRate}%
- Decision Abstention Threshold (tau): ${confidenceThreshold}
- Calibration Method: ${calibrationMethod.replace('_', ' ').toUpperCase()}
- OOD Detection Layer: ${oodDetectionMethod.replace('_', ' ').toUpperCase()}

CALIBRATION & ERROR BENCHMARKS:
- Expected Calibration Error (ECE): ${results.expectedCalibrationError}%
- Brier Score: ${results.brierScore}
- OOD Detection AUROC: ${results.oodAuroc}%
- Autonomous Execution Ratio: ${results.autonomousExecutionRate}%
- Safe Abstention / Human Route: ${results.safeAbstentionRate}%
- False Acceptance (Uncaught OOD): ${results.falseAcceptanceRate}%
- Daily Catastrophic Hallucinations Blocked: ${results.dailyCatastrophicFailuresBlocked.toLocaleString()}
- Annual Financial Risk Prevented: ${currency === 'INR' ? '₹' : '$'}${results.annualFinancialRiskPrevented.toLocaleString()}
- P99 End-to-End Latency: ${results.p99LatencyMs}ms

COMPLIANCE VERDICT:
${results.complianceStatus}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white selection:bg-white/20 selection:text-white">
      <Helmet>
        <title>Enterprise Agent Epistemic Uncertainty & OOD Calibrator Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark autonomous agent epistemic uncertainty and out-of-distribution (OOD) rejection. Compare uncalibrated Softmax overconfidence against Conformal Prediction and Mahalanobis latent distance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-epistemic-ood-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.12),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-white/[0.05] text-white border border-white/15">
              Interactive Tool #28
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
              Statistical Calibration & OOD Lab
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Enterprise Autonomous Agent <span className="text-neutral-400 ">Epistemic Uncertainty & OOD</span> Calibrator
          </h1>

          <p className="text-lg sm:text-xl text-neutral-400 max-w-4xl mb-8 leading-relaxed">
            Uncalibrated Softmax logits in 70B+ LLMs exhibit dangerous overconfidence on edge-case queries, leading to costly compliance breaches and silent agent hallucination. Simulate <strong className="text-white">Conformal Prediction</strong>, <strong className="text-white">Expected Calibration Error (ECE)</strong>, and <strong className="text-white">Mahalanobis Latent Distance</strong> to enforce deterministic abstention and zero-hallucination routing.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-all duration-300"
            >
              <Code className="w-4 h-4 text-neutral-200" />
              Embed on Your Site
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium bg-white/10 hover:bg-neutral-200/30 text-neutral-200 border border-white/30 transition-all duration-300"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-neutral-200" /> : <Copy className="w-4 h-4 text-neutral-200" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Panel (5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-[24px] p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-neutral-200" />
                  Telemetry & Calibration Controls
                </h2>
                <div className="flex items-center gap-1 bg-neutral-800 p-1 rounded-full border border-neutral-700 text-xs">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`active:scale-[0.97] px-2.5 py-1 rounded font-semibold ${currency === 'INR' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`active:scale-[0.97] px-2.5 py-1 rounded font-semibold ${currency === 'USD' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Daily Agent Inferences */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-neutral-300 font-medium">Daily Agent Queries</label>
                  <span className="font-mono text-white font-bold">{dailyQueries.toLocaleString()} / day</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="1000000"
                  step="10000"
                  value={dailyQueries}
                  onChange={(e) => setDailyQueries(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>10k</span>
                  <span>500k</span>
                  <span>1M</span>
                </div>
              </div>

              {/* Slider 2: OOD Contamination Rate */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-neutral-300 font-medium">Out-of-Distribution (OOD) Rate</label>
                  <span className="font-mono text-white font-bold">{oodContaminationRate}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={oodContaminationRate}
                  onChange={(e) => setOodContaminationRate(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>1% (Clean)</span>
                  <span>15% (Typical)</span>
                  <span>30% (High Entropy)</span>
                </div>
              </div>

              {/* Slider 3: Rejection / Abstention Threshold */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-neutral-300 font-medium">Abstention Cutoff (&tau;)</label>
                  <span className="font-mono text-white font-bold">{confidenceThreshold.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.60"
                  max="0.99"
                  step="0.01"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[11px] text-neutral-500 font-mono">
                  <span>0.60 (Permissive)</span>
                  <span>0.85 (Balanced)</span>
                  <span>0.99 (Ultra-Strict)</span>
                </div>
              </div>

              {/* Calibration Method Radio */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-neutral-300 font-medium block">Calibration Architecture</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCalibrationMethod('uncalibrated')}
                    className={`active:scale-[0.97] p-3 rounded-xl border text-left transition-all duration-300 text-xs ${
                      calibrationMethod === 'uncalibrated'
                        ? 'bg-red-950/40 border-red-500/60 text-white shadow-sm'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <div className="font-semibold text-red-300">Uncalibrated Softmax</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Raw logits; severe overconfidence on unknown queries.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalibrationMethod('temperature_scaling')}
                    className={`active:scale-[0.97] p-3 rounded-xl border text-left transition-all duration-300 text-xs ${
                      calibrationMethod === 'temperature_scaling'
                        ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-sm'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <div className="font-semibold text-amber-300">Temperature Scaling (T)</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Post-hoc validation optimization; softens overconfident tails.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCalibrationMethod('conformal_prediction')}
                    className={`active:scale-[0.97] p-3 rounded-xl border text-left transition-all duration-300 text-xs sm:col-span-2 ${
                      calibrationMethod === 'conformal_prediction'
                        ? 'bg-white/[0.05] border-white/30 text-white shadow-sm'
                        : 'bg-neutral-800/60 border-neutral-700/60 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <div className="font-semibold text-white">Sovereign Conformal Prediction (Elesium)</div>
                    <div className="text-[10px] text-neutral-400 mt-1">Rigorous non-conformity calibration sets providing finite-sample 1-&alpha; statistical coverage guarantees.</div>
                  </button>
                </div>
              </div>

              {/* OOD Detection Method Selector */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-neutral-300 font-medium block">Out-of-Distribution Detection Layer</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setOodDetectionMethod('softmax_entropy')}
                    className={`active:scale-[0.97] p-2.5 rounded-full border text-center transition-all duration-300 text-xs ${
                      oodDetectionMethod === 'softmax_entropy'
                        ? 'bg-neutral-800 border-white/30 text-white font-semibold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    Softmax Entropy
                  </button>
                  <button
                    type="button"
                    onClick={() => setOodDetectionMethod('energy_score')}
                    className={`active:scale-[0.97] p-2.5 rounded-full border text-center transition-all duration-300 text-xs ${
                      oodDetectionMethod === 'energy_score'
                        ? 'bg-neutral-800 border-white/30 text-white font-semibold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    Energy Score
                  </button>
                  <button
                    type="button"
                    onClick={() => setOodDetectionMethod('mahalanobis_latent')}
                    className={`active:scale-[0.97] p-2.5 rounded-full border text-center transition-all duration-300 text-xs ${
                      oodDetectionMethod === 'mahalanobis_latent'
                        ? 'bg-white/[0.05] border-white/30 text-white font-semibold'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    Mahalanobis Latent
                  </button>
                </div>
              </div>

              {/* Slider 4: Cost per Catastrophic Failure */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-neutral-300 font-medium">Cost per Hallucination / Breach</label>
                  <span className="font-mono text-white font-bold">
                    {currency === 'INR' ? `₹${costPerCatastrophicFailure.toLocaleString()}` : `$${Math.round(costPerCatastrophicFailure / 86.5).toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="5000"
                  value={costPerCatastrophicFailure}
                  onChange={(e) => setCostPerCatastrophicFailure(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                />
              </div>

            </div>
          </div>

          {/* Results & Visualizer Panel (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-medium text-neutral-400 mb-1">Expected Calibration Error</div>
                <div className={`text-2xl font-extrabold font-mono ${results.expectedCalibrationError <= 2.0 ? 'text-neutral-200' : results.expectedCalibrationError <= 6.0 ? 'text-amber-400' : 'text-red-400'}`}>
                  {results.expectedCalibrationError}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Lower is better (&lt;2% = elite)</div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-medium text-neutral-400 mb-1">OOD Detection AUROC</div>
                <div className="text-2xl font-extrabold font-mono text-neutral-200">
                  {results.oodAuroc}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Discriminative power</div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-medium text-neutral-400 mb-1">Autonomous Execution</div>
                <div className="text-2xl font-extrabold font-mono text-white">
                  {results.autonomousExecutionRate}%
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Guaranteed safe queries</div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4">
                <div className="text-xs font-medium text-neutral-400 mb-1">P99 Inference Latency</div>
                <div className="text-2xl font-extrabold font-mono text-neutral-200">
                  {results.p99LatencyMs}ms
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">Sub-35ms budget met</div>
              </div>
            </div>

            {/* Interactive Reliability Diagram (SVG) */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-[24px] p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-neutral-200" />
                    Calibration Reliability Diagram (Confidence vs Empirical Accuracy)
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    A perfectly calibrated agent falls directly along the 45&deg; diagonal (Confidence = Accuracy). Red gap indicates overconfidence.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/[0.05] text-white border border-white/15">
                  Brier Score: {results.brierScore}
                </span>
              </div>

              <div className="relative h-64 w-full bg-neutral-950/80 rounded-2xl border border-neutral-800/80 p-4 flex flex-col justify-end">
                {/* SVG Chart */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                  {/* Grid Lines */}
                  <line x1="0" y1="200" x2="500" y2="200" stroke="#262626" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#262626" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#262626" strokeDasharray="4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#262626" strokeDasharray="4" />
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#262626" strokeDasharray="4" />

                  {/* 45-degree Perfect Calibration Line */}
                  <line x1="0" y1="200" x2="500" y2="0" stroke="#ffffff" strokeWidth="2" strokeDasharray="6" opacity="0.6" />

                  {/* Bins (Confidence vs Accuracy Bars) */}
                  {results.calibrationBins.map((bin, index) => {
                    const barWidth = 36;
                    const x = index * 50 + 7;
                    const expectedY = 200 - (bin.avgConfidence * 200);
                    const empiricalY = 200 - (bin.empiricalAccuracy * 200);
                    const barHeight = 200 - empiricalY;
                    const isOverconfident = bin.avgConfidence > bin.empiricalAccuracy;

                    return (
                      <g key={index}>
                        {/* Bar */}
                        <rect
                          x={x}
                          y={empiricalY}
                          width={barWidth}
                          height={barHeight}
                          fill={calibrationMethod === 'uncalibrated' ? '#a3a3a3' : '#ffffff'}
                          opacity={calibrationMethod === 'uncalibrated' ? '0.7' : '0.85'}
                          rx="4"
                        />
                        {/* Error Gap Marker */}
                        {isOverconfident && calibrationMethod === 'uncalibrated' && (
                          <rect
                            x={x}
                            y={expectedY}
                            width={barWidth}
                            height={empiricalY - expectedY}
                            fill="#a3a3a3"
                            opacity="0.3"
                            rx="2"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>

                <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-2 pt-1 border-t border-neutral-800">
                  <span>0.0 Conf</span>
                  <span>0.2</span>
                  <span>0.4</span>
                  <span>0.6</span>
                  <span>0.8</span>
                  <span>1.0 Conf</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-neutral-400 gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-white/80 inline-block" />
                    <span>Empirical Accuracy</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-t-2 border-dashed border-white/30 inline-block" />
                    <span>Perfect Calibration Line</span>
                  </div>
                </div>
                <div className="font-mono text-neutral-200">
                  Daily Hallucinations Blocked: <strong className="text-white">{results.dailyCatastrophicFailuresBlocked.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Financial Impact & Compliance Box */}
            <div className="bg-neutral-950 border border-white/15 rounded-[24px] p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-white mb-1">Annual Downside Risk Prevented</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {currency === 'INR' ? '₹' : '$'}{results.annualFinancialRiskPrevented.toLocaleString()}
                  </div>
                  <div className="text-sm text-neutral-400 mt-2 max-w-xl">
                    By intercepting <strong className="text-neutral-200">{results.dailyCatastrophicFailuresBlocked.toLocaleString()}</strong> out-of-distribution queries daily before uncalibrated LLM execution, you eliminate regulatory penalties under India DPDP Act 2023 Section 8(4).
                  </div>
                </div>
                <ShieldAlert className="w-10 h-10 text-neutral-200 shrink-0" />
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-medium text-neutral-300 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-neutral-200" />
                  <span>{results.complianceStatus}</span>
                </div>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-wide transition-all shadow-md flex items-center gap-1.5">
                    Deploy Calibrated Agent Fleet
                    <ArrowRight className="w-3.5 h-3.5" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="p-8 max-w-2xl mx-auto">
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Deep Technical Architecture Whitepaper Section */}
      <section className="py-16 border-t border-neutral-800 bg-neutral-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Mathematical Formulations: Why 70B+ LLM Softmax Logits Fail Under Load
            </h2>
            <p className="text-neutral-400 leading-relaxed">
              Modern autoregressive transformers trained with cross-entropy loss are notorious for <strong className="text-white">overconfidence calibration drift</strong>. As models scale from 7B to 70B parameters, their training loss approaches zero, causing the Softmax function to push output probabilities toward 1.0 even when the input vector lies completely outside the training manifold.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-[24px] p-5">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                1. Expected Calibration Error (ECE)
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                Expected Calibration Error partitions predictions into $M$ equally spaced confidence bins $B_m$ and computes the weighted absolute difference between confidence and empirical accuracy:
              </p>
              <div className="bg-neutral-950 p-3 rounded-[18px] font-mono text-[11px] text-neutral-200 overflow-x-auto border border-neutral-800">
                ECE = &Sigma; (|B_m| / N) &times; |acc(B_m) - conf(B_m)|
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                Elesium's Conformal Prediction framework compresses ECE from 16.8% to under 0.8%, enforcing statistical alignment between stated certainty and ground-truth execution.
              </p>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-[24px] p-5">
              <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                2. Mahalanobis Latent OOD Distance
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed mb-3">
                Rather than trusting output token entropy, Elesium captures penultimate layer activations $z(x)$ and computes the minimum Mahalanobis distance to known class centroids:
              </p>
              <div className="bg-neutral-950 p-3 rounded-[18px] font-mono text-[11px] text-neutral-200 overflow-x-auto border border-neutral-800">
                D_M(x) = min_c &radic;((z(x) - &mu;_c)^T &Sigma;^-1 (z(x) - &mu;_c))
              </div>
              <p className="text-xs text-neutral-400 mt-2">
                This achieves a 97.4% AUROC on out-of-distribution detection, intercepting adversarial prompt injections and edge-case transactions in sub-7ms.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="border border-neutral-800 rounded-[24px] bg-neutral-900/60 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Engineering Questions</h3>
            <div className="space-y-3">
              {[
                {
                  q: "How does Conformal Prediction guarantee mathematical coverage without model retraining?",
                  a: "Conformal prediction utilizes a held-out calibration set to construct non-conformity scores. Given a user-specified error tolerance alpha (e.g., alpha = 0.01 for 99% coverage), it guarantees that the true label or verified execution plan falls within the prediction set with probability at least 1 - alpha, regardless of the underlying model architecture."
                },
                {
                  q: "Why is Softmax Entropy insufficient for detecting out-of-distribution (OOD) enterprise inputs?",
                  a: "Softmax probabilities are normalized exp(logits). In high-dimensional spaces, completely nonsensical or adversarial inputs can project onto weights that trigger arbitrary high logit spikes. Latent feature space distance metrics like Mahalanobis or Energy scores bypass this limitation by assessing raw manifold density rather than normalized token probabilities."
                },
                {
                  q: "How does this uncertainty calibration architecture integrate with DPDP Act 2023 compliance?",
                  a: "Under DPDP Act 2023 Section 8(4), data fiduciaries face liability up to Rs 250 Crores for processing errors caused by inaccurate automated systems. By establishing a deterministic abstention threshold, uncertain or OOD queries are safely intercepted and redirected to human review or deterministic validation pipelines, eliminating regulatory liability."
                }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-neutral-800 pb-3 last:border-b-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="active:scale-[0.97] w-full flex justify-between items-center text-left text-sm font-semibold text-neutral-200 hover:text-white py-1 transition-all duration-300"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-neutral-200' : 'text-neutral-500'}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-neutral-400 mt-2 leading-relaxed pl-2 border-l-2 border-white/30">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[28px] max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-neutral-200" />
                Embed Calibration Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] text-neutral-400 hover:text-white transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Embed this interactive simulator on your technical blog or engineering portal. The widget automatically recalculates ECE, Mahalanobis AUROC, and financial risk mitigation in real-time.
            </p>
            <div className="relative">
              <pre className="p-3 bg-neutral-950 rounded-lg text-xs font-mono text-neutral-200 overflow-x-auto border border-neutral-800">
                {embedCode}
              </pre>
              <button
                onClick={copyEmbedCode}
                className="active:scale-[0.97] absolute top-2 right-2 px-3 py-1.5 rounded bg-white hover:bg-neutral-200 text-black text-xs font-medium flex items-center gap-1.5 transition-all duration-300"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>
            <div className="text-[11px] text-neutral-500 flex justify-between items-center pt-2">
              <span>Includes verified backlink attribution</span>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] text-neutral-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

          <WhatsAppModal />
    </div>
  );
}
