import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Layers,
  Activity,
  Lock,
  EyeOff
} from 'lucide-react';
import {
  simulateDifferentialPrivacy,
  DifferentialPrivacyInputs
} from '../calculator/agentDifferentialPrivacyModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentDifferentialPrivacySimulator() {
  // Inputs State
  const [dailyGradientSteps, setDailyGradientSteps] = useState<number>(10000);
  const [clippingNormC, setClippingNormC] = useState<number>(1.0);
  const [noiseMultiplierSigma, setNoiseMultiplierSigma] = useState<number>(1.2);
  const [batchSize, setBatchSize] = useState<number>(64);
  const [sanitizerMethod, setSanitizerMethod] = useState<'unsanitized' | 'laplace_naive' | 'dpsgd_gaussian' | 'secagg_dp'>('dpsgd_gaussian');
  const [piiRecordPenaltyINR, setPiiRecordPenaltyINR] = useState<number>(50000);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: DifferentialPrivacyInputs = useMemo(() => ({
    dailyGradientSteps,
    clippingNormC,
    noiseMultiplierSigma,
    batchSize,
    sanitizerMethod,
    piiRecordPenaltyINR,
    currency
  }), [
    dailyGradientSteps,
    clippingNormC,
    noiseMultiplierSigma,
    batchSize,
    sanitizerMethod,
    piiRecordPenaltyINR,
    currency
  ]);

  const results = useMemo(() => {
    return simulateDifferentialPrivacy(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-differential-privacy-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#a855f7;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT DIFFERENTIAL PRIVACY & GRADIENT LEAKAGE AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-differential-privacy-simulator)

TRAINING & SANITIZATION PARAMETERS:
- Daily Gradient Steps: ${dailyGradientSteps.toLocaleString()}
- L2 Gradient Clipping Norm (C): ${clippingNormC}
- Gaussian Noise Multiplier (sigma): ${noiseMultiplierSigma}
- Micro-Batch Size: ${batchSize}
- Privacy Defense Architecture: ${sanitizerMethod.replace('_', ' ').toUpperCase()}

CRYPTOGRAPHIC & UTILITY BENCHMARKS:
- Privacy Budget (Epsilon): ${results.epsilonPrivacyBudget} (Delta: 1e-5)
- Gradient Inversion Reconstruction Risk: ${results.gradientInversionRisk}%
- Downstream Model Utility Retention: ${results.modelUtilityRetention}%
- Reconstruction PSNR: ${results.reconstructionPsnrDb} dB
- Backward Pass Latency Overhead: ${results.sanitizationLatencyMs}ms
- Annual Statutory PII Liability Prevented: ${currency === 'INR' ? '₹' : '$'}${results.annualFinancialRiskPrevented.toLocaleString()}

COMPLIANCE VERDICT:
${results.complianceStatus}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-purple-500/30 selection:text-purple-200">
      <Helmet>
        <title>Enterprise Agent Differential Privacy & Gradient Sanitizer Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark autonomous agent Differential Privacy (DP-SGD) and gradient inversion leakage. Calculate epsilon privacy budgets, gradient clipping, Gaussian noise injection, and DPDP Act compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-differential-privacy-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.12),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-purple-950/80 text-purple-400 border border-purple-800/60">
              Interactive Tool #29
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-800 text-slate-300 border border-slate-700">
              Cryptographic Differential Privacy Lab
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Enterprise Autonomous Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-indigo-400">Differential Privacy &amp; Gradient</span> Sanitizer
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-4xl mb-8 leading-relaxed">
            Exposed gradients during distributed agent fine-tuning or federated optimization leak raw training prompts, customer PII, and trade secrets via Deep Leakage from Gradients (DLG) inversion attacks. Simulate <strong className="text-white">DP-SGD per-sample clipping</strong>, calibrated <strong className="text-white">Gaussian noise injection</strong>, and <strong className="text-white">Renyi Differential Privacy (&epsilon;, &delta;) budgets</strong> to guarantee mathematical privacy.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Code className="w-4 h-4 text-purple-400" />
              Embed on Your Site
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 transition-colors"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-purple-400" /> : <Copy className="w-4 h-4 text-purple-400" />}
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
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-purple-400" />
                  Privacy Budget &amp; Noise Controls
                </h2>
                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 rounded font-semibold ${currency === 'INR' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded font-semibold ${currency === 'USD' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Daily Fine-Tuning Steps */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Daily Gradient Updates (T)</label>
                  <span className="font-mono text-purple-400 font-bold">{dailyGradientSteps.toLocaleString()} steps</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={dailyGradientSteps}
                  onChange={(e) => setDailyGradientSteps(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>1k</span>
                  <span>50k</span>
                  <span>100k</span>
                </div>
              </div>

              {/* Slider 2: Clipping Norm C */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">L2 Gradient Clipping Bound (C)</label>
                  <span className="font-mono text-purple-400 font-bold">{clippingNormC.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={clippingNormC}
                  onChange={(e) => setClippingNormC(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.1 (Strict)</span>
                  <span>1.0 (Standard)</span>
                  <span>5.0 (Permissive)</span>
                </div>
              </div>

              {/* Slider 3: Noise Multiplier Sigma */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Gaussian Noise Multiplier (&sigma;)</label>
                  <span className="font-mono text-purple-400 font-bold">{noiseMultiplierSigma.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="3.0"
                  step="0.05"
                  value={noiseMultiplierSigma}
                  onChange={(e) => setNoiseMultiplierSigma(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>0.2 (Low Noise)</span>
                  <span>1.2 (Balanced)</span>
                  <span>3.0 (Ultra-Private)</span>
                </div>
              </div>

              {/* Slider 4: Micro-Batch Size */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Micro-Batch Size (B)</label>
                  <span className="font-mono text-purple-400 font-bold">{batchSize} samples</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="512"
                  step="16"
                  value={batchSize}
                  onChange={(e) => setBatchSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Defense Architecture Radio */}
              <div className="space-y-2 mb-6">
                <label className="text-sm text-slate-300 font-medium block">Sanitizer Architecture</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSanitizerMethod('unsanitized')}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      sanitizerMethod === 'unsanitized'
                        ? 'bg-rose-950/40 border-rose-500/60 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-rose-300">Raw Unsanitized</div>
                    <div className="text-[10px] text-slate-400 mt-1">Exposed backprop gradients; 98.6% inversion reconstruction.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSanitizerMethod('laplace_naive')}
                    className={`p-3 rounded-xl border text-left transition-all text-xs ${
                      sanitizerMethod === 'laplace_naive'
                        ? 'bg-amber-950/40 border-amber-500/60 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-amber-300">Naive Laplace Noise</div>
                    <div className="text-[10px] text-slate-400 mt-1">Global noise without clipping; outlier gradients leak data.</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSanitizerMethod('dpsgd_gaussian')}
                    className={`p-3 rounded-xl border text-left transition-all text-xs sm:col-span-2 ${
                      sanitizerMethod === 'dpsgd_gaussian'
                        ? 'bg-purple-950/40 border-purple-500/60 text-white shadow-sm'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="font-semibold text-purple-300">Elesium DP-SGD Gaussian Sanitizer</div>
                    <div className="text-[10px] text-slate-400 mt-1">Per-sample L2 clipping + calibrated Gaussian perturbation with Renyi DP moments accounting.</div>
                  </button>
                </div>
              </div>

              {/* Slider 5: Penalty per Record */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label className="text-slate-300 font-medium">Statutory Liability per PII Leak</label>
                  <span className="font-mono text-purple-400 font-bold">
                    {currency === 'INR' ? `₹${piiRecordPenaltyINR.toLocaleString()}` : `$${Math.round(piiRecordPenaltyINR / 86.5).toLocaleString()}`}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="5000"
                  value={piiRecordPenaltyINR}
                  onChange={(e) => setPiiRecordPenaltyINR(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

            </div>
          </div>

          {/* Results & Visualizer Panel (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Score Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-400 mb-1">Privacy Budget (&epsilon;)</div>
                <div className={`text-2xl font-extrabold font-mono ${results.epsilonPrivacyBudget <= 1.5 ? 'text-emerald-400' : results.epsilonPrivacyBudget <= 4.0 ? 'text-purple-400' : 'text-rose-400'}`}>
                  {results.epsilonPrivacyBudget}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">&delta; = 10^-5 (Lower is safer)</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-400 mb-1">Inversion Reconstruct Risk</div>
                <div className={`text-2xl font-extrabold font-mono ${results.gradientInversionRisk <= 5.0 ? 'text-emerald-400' : results.gradientInversionRisk <= 25.0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {results.gradientInversionRisk}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">DLG attack success</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-400 mb-1">Model Utility Retained</div>
                <div className="text-2xl font-extrabold font-mono text-white">
                  {results.modelUtilityRetention}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Downstream task accuracy</div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-medium text-slate-400 mb-1">Sanitization Latency</div>
                <div className="text-2xl font-extrabold font-mono text-purple-300">
                  {results.sanitizationLatencyMs}ms
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Overhead on backward pass</div>
              </div>
            </div>

            {/* Gradient Perturbation Spectrum (SVG Chart) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    Gradient Clipping &amp; Gaussian Perturbation Spectrum
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Visualizing raw gradient distribution vs L2 clipping bound ($C = {clippingNormC}$) and injected Gaussian noise ($\sigma = {noiseMultiplierSigma}$).
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  Reconstruction PSNR: {results.reconstructionPsnrDb} dB
                </span>
              </div>

              <div className="relative h-64 w-full bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 flex flex-col justify-end">
                {/* SVG Chart */}
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
                  {/* Grid Lines */}
                  <line x1="0" y1="200" x2="500" y2="200" stroke="#334155" strokeWidth="1" />
                  <line x1="0" y1="150" x2="500" y2="150" stroke="#1e293b" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#1e293b" strokeDasharray="4" />
                  <line x1="0" y1="50" x2="500" y2="50" stroke="#1e293b" strokeDasharray="4" />

                  {/* Clipping Boundary Line */}
                  <line x1="0" y1={200 - (clippingNormC * 35)} x2="500" y2={200 - (clippingNormC * 35)} stroke="#f43f5e" strokeWidth="2" strokeDasharray="6" />

                  {/* Injected Noise Envelope */}
                  <path
                    d={`M 0 200 Q 125 ${200 - (clippingNormC * 30 + noiseMultiplierSigma * 25)} 250 200 Q 375 ${200 - (clippingNormC * 20 + noiseMultiplierSigma * 18)} 500 200`}
                    fill="rgba(168, 85, 247, 0.25)"
                    stroke="#a855f7"
                    strokeWidth="2"
                  />

                  {/* Raw Gradient Distribution Curve (Unsanitized) */}
                  <path
                    d="M 20 200 Q 150 15 250 180 Q 350 40 480 200"
                    fill="none"
                    stroke={sanitizerMethod === 'unsanitized' ? '#f43f5e' : '#64748b'}
                    strokeWidth={sanitizerMethod === 'unsanitized' ? '2.5' : '1.5'}
                    strokeDasharray={sanitizerMethod === 'unsanitized' ? 'none' : '4'}
                    opacity={sanitizerMethod === 'unsanitized' ? 1.0 : 0.4}
                  />
                </svg>

                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-2 pt-1 border-t border-slate-800">
                  <span>Layer 1 (Input Embeds)</span>
                  <span>Layer 12 (Attention Q/K/V)</span>
                  <span>Layer 24 (MLP Projections)</span>
                  <span>Layer 32 (Logit Head)</span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-rose-500 inline-block" />
                    <span>L2 Clipping Threshold (C)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded bg-purple-500/50 inline-block" />
                    <span>Gaussian Noise Envelope</span>
                  </div>
                </div>
                <div className="font-mono text-purple-300">
                  Signal-to-Noise Ratio: <strong className="text-white">{results.signalToNoiseRatioDb} dB</strong>
                </div>
              </div>
            </div>

            {/* Financial Risk & Compliance Box */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 border border-purple-900/60 rounded-2xl p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">Annual PII Liability Prevented</div>
                  <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                    {currency === 'INR' ? '₹' : '$'}{results.annualFinancialRiskPrevented.toLocaleString()}
                  </div>
                  <div className="text-sm text-slate-400 mt-2 max-w-xl">
                    By clipping per-sample backprop gradients and injecting calibrated Gaussian noise ($\sigma = {noiseMultiplierSigma}$), you prevent training prompt extraction and satisfy <strong className="text-purple-300">DPDP Act 2023 Section 8(4)</strong> data protection requirements.
                  </div>
                </div>
                <Lock className="w-10 h-10 text-purple-400 shrink-0" />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs font-medium text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{results.complianceStatus}</span>
                </div>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wide transition-all shadow-md shadow-purple-900/30 flex items-center gap-1.5">
                    Deploy DP-Sanitized Agent Fleet
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

      {/* Technical Architecture Whitepaper Section */}
      <section className="py-16 border-t border-slate-800 bg-slate-950/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Cryptographic Mechanics: Preventing Deep Leakage from Gradients (DLG)
            </h2>
            <p className="text-slate-400 leading-relaxed">
              When autonomous agents engage in continuous on-premise fine-tuning or cross-silo collaborative learning, backpropagated gradients are transmitted across internal microservices. Inversion algorithms (such as Zhu et al.'s DLG and Geiping et al.'s Inverting Gradients) optimize dummy inputs to match observed gradients via L-BFGS, reconstructing original client tokens, medical diagnoses, and bank account numbers with pixel-perfect fidelity ($&gt;38$ dB PSNR).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-2 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                1. Per-Sample Gradient L2 Clipping
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                To bound the sensitivity $\Delta_2$ of the update function, every individual sample gradient $g_i$ is scaled to a maximum norm $C$:
              </p>
              <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-purple-300 overflow-x-auto border border-slate-800">
                g_bar_i = g_i / max(1, ||g_i||_2 / C)
              </div>
              <p className="text-xs text-slate-400 mt-2">
                This guarantees that no single rogue prompt or anomalous PII token can disproportionately dictate the model update vector.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <h3 className="text-base font-bold text-purple-400 mb-2 flex items-center gap-2">
                <EyeOff className="w-4 h-4" />
                2. Calibrated Gaussian Noise Injection
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                Independent spherical Gaussian noise is added to the aggregated batch gradient before updating model weights:
              </p>
              <div className="bg-slate-950 p-3 rounded-lg font-mono text-[11px] text-purple-300 overflow-x-auto border border-slate-800">
                g_tilde = (1/B) * (&Sigma; g_bar_i + N(0, &sigma;^2 C^2 I))
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Noise scaling destroys the high-frequency Fourier components exploited by DLG inversion solvers, reducing reconstruction PSNR to below 4 dB (pure white noise).
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="border border-slate-800 rounded-2xl bg-slate-900/60 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Frequently Asked Engineering Questions</h3>
            <div className="space-y-3">
              {[
                {
                  q: "What is an acceptable Epsilon privacy budget for enterprise autonomous agents?",
                  a: "In commercial production environments, an epsilon between 0.5 and 2.0 represents institutional-grade privacy with negligible leakage risk. Epsilon values between 2.0 and 6.0 are widely deployed in commercial recommendation models. Epsilon values exceeding 8.0 offer weak statistical guarantees against targeted gradient inversion attacks."
                },
                {
                  q: "How does DP-SGD impact agent inference and fine-tuning speed?",
                  a: "Per-sample clipping historically incurred significant GPU memory bandwidth overhead. Elesium implements Opacus-style vectorized per-sample gradient computation and fast PyTorch functorch hooks, capping the backward pass latency penalty to under 4.2ms per micro-batch on NVIDIA L40S or A10G nodes."
                },
                {
                  q: "Does Differential Privacy satisfy the statutory requirements of India DPDP Act 2023?",
                  a: "Yes. Under DPDP Act 2023 Section 8(4), data fiduciaries must implement state-of-the-art organizational and technical measures to prevent personal data breaches. Mathematical (epsilon, delta)-differential privacy provides rigorous algorithmic proof that individual customer identities cannot be reverse-engineered from published model weights or shared agent telemetry."
                }
              ].map((faq, idx) => (
                <div key={idx} className="border-b border-slate-800 pb-3 last:border-b-0">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex justify-between items-center text-left text-sm font-semibold text-slate-200 hover:text-purple-400 py-1 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-purple-400' : 'text-slate-500'}`} />
                  </button>
                  {openFaq === idx && (
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed pl-2 border-l-2 border-purple-500/50">
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
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" />
                Embed Privacy Sanitizer Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Embed this interactive simulator on your technical blog or engineering portal. The widget automatically recalculates epsilon budgets, gradient inversion risk, and DPDP Act compliance in real-time.
            </p>
            <div className="relative">
              <pre className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-purple-300 overflow-x-auto border border-slate-800">
                {embedCode}
              </pre>
              <button
                onClick={copyEmbedCode}
                className="absolute top-2 right-2 px-3 py-1.5 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied!' : 'Copy Snippet'}
              </button>
            </div>
            <div className="text-[11px] text-slate-500 flex justify-between items-center pt-2">
              <span>Includes verified backlink attribution</span>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
