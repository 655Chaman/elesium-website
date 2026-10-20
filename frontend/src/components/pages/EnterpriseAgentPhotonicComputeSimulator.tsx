import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Activity,
  Layers,
  Sparkles,
  Thermometer,
  Radio
} from 'lucide-react';
import {
  simulatePhotonicCompute,
  PhotonicComputeInputs
} from '../calculator/agentPhotonicComputeModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentPhotonicComputeSimulator() {
  // Inputs State
  const [opticalArchitecture, setOpticalArchitecture] = useState<'mzi_clements_mesh' | 'mrr_wdm_crossbar' | 'free_space_d2nn' | 'cpo_hybrid_accelerator'>('mzi_clements_mesh');
  const [matrixDimension, setMatrixDimension] = useState<64 | 128 | 256 | 512 | 1024>(256);
  const [wdmChannels, setWdmChannels] = useState<1 | 4 | 8 | 16 | 32>(16);
  const [modulationPrecisionBits, setModulationPrecisionBits] = useState<4 | 6 | 8 | 12>(8);
  const [thermalDriftStdDevKelvin, setThermalDriftStdDevKelvin] = useState<number>(0.8);
  const [dailyInferenceTokensMillions, setDailyInferenceTokensMillions] = useState<number>(50);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PhotonicComputeInputs = useMemo(() => ({
    opticalArchitecture,
    matrixDimension,
    wdmChannels,
    modulationPrecisionBits,
    thermalDriftStdDevKelvin,
    dailyInferenceTokensMillions,
    currency
  }), [
    opticalArchitecture,
    matrixDimension,
    wdmChannels,
    modulationPrecisionBits,
    thermalDriftStdDevKelvin,
    dailyInferenceTokensMillions,
    currency
  ]);

  const results = useMemo(() => {
    return simulatePhotonicCompute(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-photonic-compute-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT SILICON PHOTONICS & OPTICAL MATRIX COMPUTE AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-photonic-compute-simulator)

OPTICAL NEURAL NETWORK ARCHITECTURE:
- Substrate Topology: ${opticalArchitecture.replace(/_/g, ' ').toUpperCase()}
- Matrix Dimension: ${matrixDimension}x${matrixDimension} Unitary GEMM
- Dense WDM Channels: ${wdmChannels} λ (ITU 200GHz DWDM Grid)
- Modulation Precision: ${modulationPrecisionBits}-bit DAC/ADC
- Thermal Variance (Die): ±${thermalDriftStdDevKelvin} K
- Daily Workload: ${dailyInferenceTokensMillions}M Tokens/day

LATENCY & ENERGY BENCHMARKS:
- In-Flight Waveguide Latency: ${results.inFlightOpticalLatencyPs} ps (${(results.inFlightOpticalLatencyPs / 1000).toFixed(3)} ns at speed of light in silicon)
- Total Optical GEMM Latency: ${results.totalGemmLatencyNs} ns (vs Electronic GPU Baseline: ${results.electronicBaselineLatencyNs} ns)
- Latency Acceleration: ${results.latencySpeedupFactor}x Faster Execution
- Energy per MAC: ${results.energyPerMacFemtojoules} fJ/MAC (vs 4nm Electronic GPU: ${results.electronicEnergyPerMacFemtojoules} fJ/MAC)
- Optical Energy Efficiency Ratio: ${results.opticalEnergyEfficiencyRatio}x Power Reduction
- Effective Precision (ENOB): ${results.effectiveEnob} bits (Thermal Phase RMSE: ${results.thermalPhaseDriftRmseRad} rad)
- System Compute Throughput: ${results.matrixComputationThroughputTops} TOPS (${results.powerEfficiencyTopsPerWatt} TOPS/Watt)

DATACENTER OPEX SAVINGS:
- Daily Energy Saved: ${results.dailyEnergyKwhSaved.toLocaleString()} kWh/day (inclusive of 1.35x PUE cooling)
- Annual Power Cost Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualPowerCostSavings.toLocaleString()}/year

ARCHITECTURAL VERDICT:
${results.statusClassification === 'COHERENT_OPTICAL_ADVANTAGE'
  ? 'Coherent optical matrix propagation achieves sovereign supremacy over electronic systolic arrays. Waveguide time-of-flight eliminates copper interconnect resistance, delivering >15x lower latency and >20x power reduction.'
  : results.statusClassification === 'THERMALLY_COMPENSATED'
  ? 'Optical compute delivers strong energy and latency dividends. Active thermo-optic phase compensation is operating within nominal thresholds.'
  : 'High thermal drift is causing phase decoherence across MZI stages. Enable active TEC stabilization or non-volatile phase-change material (PCM) tuning to restore ENOB precision.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Optical Neural Network & Silicon Photonics Matrix Compute Latency Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate silicon photonics optical neural networks, Clements MZI unitary meshes, in-flight waveguide latency, and WDM matrix multiply acceleration for enterprise autonomous agents."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-photonic-compute-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-cyan-400 font-mono">
            <a href="/solutions" className="hover:underline">Solutions</a>
            <span>/</span>
            <a href="/resources" className="hover:underline">Tools</a>
            <span>/</span>
            <span className="text-slate-400">Silicon Photonics Compute Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Tool #32 · Coherent Silicon Photonics &amp; Optical Neural Network GEMM
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Agent Optical Neural Network &amp; Silicon Photonics Compute Simulator
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Benchmark coherent optical matrix multiplication (GEMM) using Mach-Zehnder Interferometer (MZI) meshes and Wavelength Division Multiplexing (WDM).
                Simulate in-flight waveguide time-of-flight latency, electro-optic conversions, and femtojoule-per-MAC energy efficiency against electronic GPU baselines.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
                className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-medium transition"
              >
                Currency: <span className="text-cyan-400 font-bold">{currency}</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-medium transition"
              >
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed Tool</span>
              </button>
              <button
                onClick={copyExecutiveMemo}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow-lg shadow-cyan-950/50 transition"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          results.statusClassification === 'COHERENT_OPTICAL_ADVANTAGE'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : results.statusClassification === 'THERMALLY_COMPENSATED'
            ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-300'
            : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
        }`}>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Optical Computing Status: {results.statusClassification.replace(/_/g, ' ')}
              </p>
              <p className="text-xs opacity-90">
                {results.statusClassification === 'COHERENT_OPTICAL_ADVANTAGE'
                  ? `Sub-nanosecond optical GEMM achieved. In-flight latency is ${results.inFlightOpticalLatencyPs} ps (${results.latencySpeedupFactor}x faster than 4nm GPU), delivering ${results.opticalEnergyEfficiencyRatio}x energy reduction.`
                  : results.statusClassification === 'THERMALLY_COMPENSATED'
                  ? `Stable optical inference at ${results.matrixComputationThroughputTops} TOPS with nominal thermo-optic drift compensation.`
                  : `High thermal drift (Phase RMSE: ${results.thermalPhaseDriftRmseRad} rad) has degraded effective precision to ${results.effectiveEnob} bits. Micro-heater calibration recommended.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/40 border border-current shrink-0">
            Efficiency: {results.powerEfficiencyTopsPerWatt} TOPS/W
          </span>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">Silicon Photonics Parameters</h2>
            </div>

            {/* Architecture Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Optical Neural Network Substrate:</label>
              <select
                value={opticalArchitecture}
                onChange={e => setOpticalArchitecture(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="mzi_clements_mesh">Mach-Zehnder Interferometer (Clements Unitary Mesh)</option>
                <option value="mrr_wdm_crossbar">Micro-Ring Resonator (MRR Dense WDM Crossbar)</option>
                <option value="free_space_d2nn">Diffractive Deep Neural Network (Metasurface D2NN)</option>
                <option value="cpo_hybrid_accelerator">Co-Packaged Optics (CPO Hybrid Electronic-Photonic)</option>
              </select>
            </div>

            {/* Matrix Dimension Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Matrix Dimension (GEMM N x N):</span>
                <span className="font-mono text-cyan-400 font-bold">{matrixDimension} x {matrixDimension}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {([64, 128, 256, 512, 1024] as const).map(dim => (
                  <button
                    key={dim}
                    onClick={() => setMatrixDimension(dim)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      matrixDimension === dim
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>

            {/* WDM Channels Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Dense WDM Optical Wavelengths (λ):</span>
                <span className="font-mono text-cyan-400 font-bold">{wdmChannels} channels</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {([1, 4, 8, 16, 32] as const).map(ch => (
                  <button
                    key={ch}
                    onClick={() => setWdmChannels(ch)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      wdmChannels === ch
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ch}λ
                  </button>
                ))}
              </div>
            </div>

            {/* Precision Bits */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Modulation Precision (DAC / ADC):</span>
                <span className="font-mono text-cyan-400 font-bold">{modulationPrecisionBits}-bit resolution</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([4, 6, 8, 12] as const).map(bits => (
                  <button
                    key={bits}
                    onClick={() => setModulationPrecisionBits(bits)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      modulationPrecisionBits === bits
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bits}-bit
                  </button>
                ))}
              </div>
            </div>

            {/* Thermal Drift Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Die Thermal Fluctuation (Ambient Drift):</span>
                <span className="font-mono text-cyan-400 font-bold">±{thermalDriftStdDevKelvin} K</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={thermalDriftStdDevKelvin}
                onChange={e => setThermalDriftStdDevKelvin(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.1 K (Cryo / Active TEC)</span>
                <span>2.5 K (Standard)</span>
                <span>5.0 K (Uncooled Die)</span>
              </div>
            </div>

            {/* Daily Inference Workload Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Daily Inference Workload (Tokens):</span>
                <span className="font-mono text-cyan-400 font-bold">{dailyInferenceTokensMillions}M tokens/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="500"
                step="5"
                value={dailyInferenceTokensMillions}
                onChange={e => setDailyInferenceTokensMillions(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1M (Pilot Agent)</span>
                <span>250M</span>
                <span>500M (Hyperscale Fleet)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Waveguide Latency */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Total Optical GEMM Latency</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-white">{results.totalGemmLatencyNs}</span>
                  <span className="text-sm font-mono text-cyan-400">ns</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Waveguide Time-of-Flight:</span>
                    <span className="font-mono text-slate-300">{results.inFlightOpticalLatencyPs} ps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Electronic GPU Baseline:</span>
                    <span className="font-mono text-rose-400">{results.electronicBaselineLatencyNs} ns</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyan-300">
                    <span>Acceleration Speedup:</span>
                    <span>{results.latencySpeedupFactor}x Faster</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Energy per MAC */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Energy Consumption / MAC</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">{results.energyPerMacFemtojoules}</span>
                  <span className="text-sm font-mono text-emerald-300">fJ / MAC</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>4nm Electronic GPU Baseline:</span>
                    <span className="font-mono text-slate-300">{results.electronicEnergyPerMacFemtojoules} fJ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Efficiency Ratio:</span>
                    <span className="font-mono text-emerald-400 font-bold">{results.opticalEnergyEfficiencyRatio}x Lower Energy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Compute TOPS:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.matrixComputationThroughputTops} TOPS</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Precision & Phase Drift */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Effective Precision (ENOB)</span>
                  <Thermometer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-white">{results.effectiveEnob}</span>
                  <span className="text-sm font-mono text-slate-400">/ {modulationPrecisionBits} bits</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Phase Drift RMSE:</span>
                    <span className="font-mono text-amber-300">{results.thermalPhaseDriftRmseRad} rad</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thermal Stability:</span>
                    <span className="font-mono text-slate-300">±{thermalDriftStdDevKelvin} K</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phase Shift Attestation:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{results.effectiveEnob >= 5.0 ? 'Preserved' : 'Attenuated'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Financial OPEX Saved */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Annual Power OPEX Saved</span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-extrabold font-mono text-cyan-300">
                    {currency === 'INR' ? '₹' : '$'}{results.annualPowerCostSavings.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400">/ yr</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Daily Energy Saved:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{results.dailyEnergyKwhSaved.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Datacenter PUE Factor:</span>
                    <span className="font-mono text-slate-300">1.35x (Cooling incl.)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Power Efficiency:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.powerEfficiencyTopsPerWatt} TOPS / Watt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dense WDM Spectral Distribution Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Dense WDM Optical Wavelength Channels Telemetry</h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">{results.spectralPoints.length} Channels Active</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.spectralPoints.slice(0, 8).map(pt => (
                  <div key={pt.channelIndex} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-cyan-300 font-bold">
                      <span>CH-{pt.channelIndex}</span>
                      <span>{pt.wavelengthNm} nm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Power:</span>
                      <span className="text-white">{pt.opticalPowerDbm} dBm</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Phase Err:</span>
                      <span className="text-amber-300">{pt.phaseErrorRad} rad</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Extinction:</span>
                      <span className="text-emerald-400">{pt.extinctionRatioDb} dB</span>
                    </div>
                  </div>
                ))}
              </div>
              {results.spectralPoints.length > 8 && (
                <p className="text-[11px] text-slate-500 font-mono text-center">
                  + {results.spectralPoints.length - 8} additional parallel DWDM channels active across the C-band spectrum.
                </p>
              )}
            </div>

            {/* Optical Architecture Blueprint Card */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Co-Packaged Silicon Photonics Architecture Blueprint</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">1. Light Ingestion &amp; E/O</p>
                  <p className="text-slate-400 text-[11px]">
                    Continuous-Wave (CW) DFB lasers couple into silicon rib waveguides via grating couplers. High-speed Mach-Zehnder modulators imprint activations at {modulationPrecisionBits}-bit resolution.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">2. In-Flight Matrix Multiply</p>
                  <p className="text-slate-400 text-[11px]">
                    Coherent light propagates through the {matrixDimension}x{matrixDimension} Clements MZI mesh at 1.22x10⁸ m/s, computing unitary tensor transformations in {results.inFlightOpticalLatencyPs} ps with zero static capacitance dissipation.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">3. Photodetection &amp; Attestation</p>
                  <p className="text-slate-400 text-[11px]">
                    Germanium-on-Silicon PIN photodiodes convert optical power to current. TIAs and high-speed ADCs yield output activations at {results.effectiveEnob} effective bits with cryptographic state integrity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Section */}
        <div className="space-y-6 border-t border-slate-800 pt-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Sovereign Optical Neural Networks vs Electronic GPU Systolic Arrays
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-4xl">
              Electronic microprocessors are bounded by the RC time-constant of metallic copper interconnects and thermal dissipation ceilings ($P = C \cdot V^2 \cdot f$).
              Optical matrix computing bypasses metallic impedance entirely by performing General Matrix Multiply (GEMM) operations in-flight as coherent photons traverse passive silicon waveguides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Waveguide Propagation Physics</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In Silicon-on-Insulator (SOI) waveguides, light at 1550 nm travels at group velocity $v_g = c / n_&#123;\text&#123;eff&#125;&#125; \approx 1.22 \times 10^8 \text&#123; m/s&#125;$.
                A full $256 \times 256$ matrix calculation completes in 180 picoseconds of physical flight time—an acceleration that is fundamentally unachievable in clocked silicon logic.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Thermo-Optic Phase Drift Compensation</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Silicon exhibits a thermo-optic coefficient $dn/dT = 1.86 \times 10^{'{'}-4{'}'} \text&#123; K&#125;^{'{'}-1{'}'}$. Unchecked temperature gradients cause phase shifts across MZI stages.
                Elesium integrates closed-loop micro-heater phase stabilization and non-volatile phase-change materials (PCM) to preserve &gt;7.5 effective ENOB precision.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Co-Packaged Optics (CPO) Integration</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Co-packaging the optical engine on the same organic substrate as the host ASIC eliminates long electrical SerDes traces.
                This reduces interface energy from ~10 pJ/bit down to &lt;1 pJ/bit, unlocking massive bandwidth density for multi-agent swarm coordination.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise FAQ Accordion */}
        <div className="space-y-6 border-t border-slate-800 pt-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">Frequently Asked Architectural Questions</h2>
            <p className="text-slate-400 text-sm">Essential technical guidance for engineering leadership evaluating photonic AI accelerators.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How does an Optical Neural Network compute a matrix multiplication in-flight?",
                a: "An Optical Neural Network (ONN) utilizes an interconnected mesh of Mach-Zehnder Interferometers (MZIs) configured according to Clements or Reck unitary decomposition. Each MZI contains an internal phase shifter that controls the optical interference between two waveguide modes. When a vector of optical signals enters the mesh, the interference pattern across all stages mathematically computes the unitary matrix transformation at the speed of light in silicon (~1.22x10⁸ m/s), requiring no digital clock cycles."
              },
              {
                q: "What are the primary energy bottlenecks in optical computing?",
                a: "The passive propagation and interference of light consume virtually zero energy (<10 fJ/MAC). The primary energy expenditure occurs at the domain boundaries: Digital-to-Analog Converters (DACs) driving optical modulators, the continuous-wave (CW) laser source, and high-speed Analog-to-Digital Converters (ADCs) at the photodetector outputs. By leveraging Wavelength Division Multiplexing (WDM) and large matrix dimensions, these conversion costs are amortized, achieving net system efficiency exceeding 100 TOPS/Watt."
              },
              {
                q: "How is numerical precision maintained against thermal drift in production?",
                a: "Silicon has a notable thermo-optic coefficient (dn/dT ≈ 1.86x10⁻⁴ K⁻¹). In production environments, thermal gradients are mitigated using two complementary techniques: active closed-loop feedback using titanium nitride (TiN) micro-heaters calibrated against temperature sensors, and the deployment of non-volatile Phase Change Materials (such as Sb₂Se₃) that maintain static optical weights with zero continuous heater dissipation."
              },
              {
                q: "Can optical neural networks run standard Transformer and LLM architectures?",
                a: "Yes. Optical matrix engines execute the compute-intensive linear General Matrix Multiply (GEMM) layers (such as Key-Query-Value projections and Feed-Forward Networks) which account for >90% of total inference FLOPs. Non-linear activation functions (e.g. GELU, Softmax) are computed either via electro-optic saturation or in an adjacent ultra-low-power electronic digital coprocessor linked via Co-Packaged Optics (CPO)."
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800/80 rounded-xl bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit CTA Card */}
        <div className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-blue-950/40 border border-cyan-800/50 p-8 text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Deploy Sovereign Silicon Photonics &amp; Sub-Nanosecond Agent Infrastructure</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Eliminate copper interconnect latency and slash datacenter compute power by 85%. Partner with Elesium to architect sovereign optical accelerators and enterprise autonomous agent systems.
          </p>
          <div className="pt-2">
            <ExpandableScreen>
              <ExpandableScreenTrigger>
                <button className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/60 transition">
                  <span>Schedule Optical Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="max-w-2xl mx-auto py-8">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed This Simulator</span>
              </h3>
              <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Embed the interactive Silicon Photonics Simulator directly on your internal portal or technical documentation. Includes responsive layout and live telemetry calculations.
            </p>
            <div className="relative">
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                {embedCode}
              </pre>
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
