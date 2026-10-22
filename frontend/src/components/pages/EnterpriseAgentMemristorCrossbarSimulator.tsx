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
  Grid,
  Sparkles,
  Thermometer,
  Layers
} from 'lucide-react';
import {
  simulateMemristorCrossbar,
  MemristorCrossbarInputs
} from '../calculator/agentMemristorCrossbarModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentMemristorCrossbarSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [memristorTechnology, setMemristorTechnology] = useState<'hfox_reram_crossbar' | 'pcm_chalcogenide_crossbar' | 'cbram_silver_electrolyte' | 'ferroelectric_fe_fet'>('hfox_reram_crossbar');
  const [crossbarDimension, setCrossbarDimension] = useState<64 | 128 | 256 | 512 | 1024>(256);
  const [adcDacResolutionBits, setAdcDacResolutionBits] = useState<4 | 6 | 8 | 10>(8);
  const [conductanceDriftExponent, setConductanceDriftExponent] = useState<number>(0.05);
  const [ambientTemperatureKelvin, setAmbientTemperatureKelvin] = useState<number>(300);
  const [dailySynapticEventsBillions, setDailySynapticEventsBillions] = useState<number>(25);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MemristorCrossbarInputs = useMemo(() => ({
    memristorTechnology,
    crossbarDimension,
    adcDacResolutionBits,
    conductanceDriftExponent,
    ambientTemperatureKelvin,
    dailySynapticEventsBillions,
    currency
  }), [
    memristorTechnology,
    crossbarDimension,
    adcDacResolutionBits,
    conductanceDriftExponent,
    ambientTemperatureKelvin,
    dailySynapticEventsBillions,
    currency
  ]);

  const results = useMemo(() => {
    return simulateMemristorCrossbar(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-memristor-crossbar-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT ANALOG NEUROMORPHIC CROSSBAR & MEMRISTOR COMPUTE AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-memristor-crossbar-simulator)

ANALOG IN-MEMORY COMPUTE ARCHITECTURE:
- Substrate Material: ${memristorTechnology.replace(/_/g, ' ').toUpperCase()}
- Crossbar Topology: ${crossbarDimension}x${crossbarDimension} Physical Crossbar
- Peripheral Resolution: ${adcDacResolutionBits}-bit ADC/DAC Data Converters
- Power-Law Drift Exponent (nu): ${conductanceDriftExponent}
- Die Ambient Temperature: ${ambientTemperatureKelvin} K (${(ambientTemperatureKelvin - 273.15).toFixed(1)}°C)
- Daily Synaptic Workload: ${dailySynapticEventsBillions} Billion Operations/day

LATENCY & ENERGY BENCHMARKS:
- Analog VMM Latency: ${results.analogVmmLatencyNs} ns (vs Digital GPU Baseline: ${results.digitalSystolicLatencyNs} ns)
- Execution Acceleration: ${results.accelerationFactor}x Faster Execution
- Energy per Synaptic Op: ${results.energyPerSynapticOpFemtojoules} fJ/SOP (vs Digital GPU Baseline: ${results.digitalEnergyBaselineFj} fJ/FLOP)
- Energy Reduction Ratio: ${results.energyEfficiencyRatio}x Lower Energy Consumption
- Effective SNR: ${results.effectiveSnrDb} dB (Retention Horizon: ${results.retentionHorizonHours} Hours)
- System Compute Throughput: ${results.systemThroughputTops} TOPS (${results.powerEfficiencyTopsPerWatt} TOPS/Watt)

DATACENTER OPEX SAVINGS:
- Daily Energy Saved: ${results.dailyKwhSaved.toLocaleString()} kWh/day (inclusive of 1.35x PUE cooling)
- Annual Power Cost Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualPowerCostSavings.toLocaleString()}/year

ARCHITECTURAL VERDICT:
${results.statusClassification === 'NEUROMORPHIC_SUPREMACY'
  ? 'Analog Vector-Matrix Multiplication completely circumvents the Von Neumann memory wall. Ohm and Kirchhoff in-memory summation delivers >25x lower latency and >35x energy efficiency over 4nm electronic GPUs.'
  : results.statusClassification === 'ANALOG_COMPENSATED'
  ? 'Crossbar array operates with high efficiency. Conductance drift is managed within peripheral ADC quantization bounds via scheduled closed-loop rewrite cycles.'
  : 'Severe conductance drift detected! Power-law relaxation has degraded the SNR below 18 dB. Enable frequent write-verify refresh cycles or migrate to ferroelectric FeFET memory.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Analog Neuromorphic Crossbar Memristor Compute Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate analog in-memory computing (AIMC), ReRAM memristor crossbar vector-matrix multiplication, conductance drift power-law dynamics, and sub-nanosecond neuromorphic acceleration."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-memristor-crossbar-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-cyan-400 font-mono">
            <a href="/solutions" className="hover:underline">Solutions</a>
            <span>/</span>
            <a href="/resources" className="hover:underline">Tools</a>
            <span>/</span>
            <span className="text-slate-400">Memristor Crossbar Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Grid className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Tool #33 · Analog In-Memory Computing &amp; ReRAM Memristor Crossbars
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Agent Analog Neuromorphic Crossbar Memristor Compute Simulator
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Benchmark analog in-memory computing (AIMC) using Resistive RAM (ReRAM) and Phase-Change Memory (PCM) crossbar arrays.
                Simulate single-step Kirchhoff/Ohm Vector-Matrix Multiplication (VMM), power-law conductance drift, and femtojoule-per-synaptic-op energy scaling against digital GPU baselines.
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
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
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
          results.statusClassification === 'NEUROMORPHIC_SUPREMACY'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : results.statusClassification === 'ANALOG_COMPENSATED'
            ? 'bg-cyan-950/30 border-cyan-800/50 text-cyan-300'
            : 'bg-amber-950/30 border-amber-800/50 text-amber-300'
        }`}>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Neuromorphic Compute Status: {results.statusClassification.replace(/_/g, ' ')}
              </p>
              <p className="text-xs opacity-90">
                {results.statusClassification === 'NEUROMORPHIC_SUPREMACY'
                  ? `Single-step analog VMM eliminates the Von Neumann memory bottleneck. Execution is ${results.accelerationFactor}x faster at ${results.energyPerSynapticOpFemtojoules} fJ/SOP (${results.energyEfficiencyRatio}x lower energy vs 4nm digital GPU).`
                  : results.statusClassification === 'ANALOG_COMPENSATED'
                  ? `Stable in-memory inference with effective SNR of ${results.effectiveSnrDb} dB and retention horizon of ${results.retentionHorizonHours} hours.`
                  : `Conductance drift saturation! Retention horizon has fallen to ${results.retentionHorizonHours} hours. Schedule periodic write-verify refresh or lower operating temperature.`}
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
              <h2 className="text-base font-semibold text-white">Memristor Physical Parameters</h2>
            </div>

            {/* Material Technology Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Memristor Dielectric Material:</label>
              <select
                value={memristorTechnology}
                onChange={e => setMemristorTechnology(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="hfox_reram_crossbar">HfOx Filamentary ReRAM (Enterprise Standard)</option>
                <option value="pcm_chalcogenide_crossbar">Phase-Change Memory (GST Chalcogenide PCM)</option>
                <option value="cbram_silver_electrolyte">Conductive Bridging RAM (Ag/Cu Electrochemical CBRAM)</option>
                <option value="ferroelectric_fe_fet">Ferroelectric Field-Effect Transistor (FeFET Crossbar)</option>
              </select>
            </div>

            {/* Crossbar Dimension Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Crossbar Physical Dimension (N x N):</span>
                <span className="font-mono text-cyan-400 font-bold">{crossbarDimension} x {crossbarDimension}</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {([64, 128, 256, 512, 1024] as const).map(dim => (
                  <button
                    key={dim}
                    onClick={() => setCrossbarDimension(dim)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      crossbarDimension === dim
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {dim}
                  </button>
                ))}
              </div>
            </div>

            {/* ADC/DAC Resolution Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Peripheral ADC / DAC Quantization:</span>
                <span className="font-mono text-cyan-400 font-bold">{adcDacResolutionBits}-bit resolution</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {([4, 6, 8, 10] as const).map(bits => (
                  <button
                    key={bits}
                    onClick={() => setAdcDacResolutionBits(bits)}
                    className={`py-1.5 rounded-lg text-xs font-mono font-medium border transition ${
                      adcDacResolutionBits === bits
                        ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-950'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {bits}-bit
                  </button>
                ))}
              </div>
            </div>

            {/* Conductance Drift Exponent Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Conductance Drift Exponent (ν):</span>
                <span className="font-mono text-cyan-400 font-bold">{conductanceDriftExponent}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.20"
                step="0.01"
                value={conductanceDriftExponent}
                onChange={e => setConductanceDriftExponent(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.01 (Near-zero drift)</span>
                <span>0.08 (Typical ReRAM)</span>
                <span>0.20 (High relaxation)</span>
              </div>
            </div>

            {/* Ambient Temperature Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Ambient Die Operating Temperature:</span>
                <span className="font-mono text-cyan-400 font-bold">{ambientTemperatureKelvin} K ({(ambientTemperatureKelvin - 273.15).toFixed(1)}°C)</span>
              </div>
              <input
                type="range"
                min="250"
                max="380"
                step="5"
                value={ambientTemperatureKelvin}
                onChange={e => setAmbientTemperatureKelvin(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>250 K (-23°C)</span>
                <span>300 K (27°C Room)</span>
                <span>380 K (107°C Extreme)</span>
              </div>
            </div>

            {/* Daily Synaptic Events Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Daily Synaptic Operations:</span>
                <span className="font-mono text-cyan-400 font-bold">{dailySynapticEventsBillions}B ops/day</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                step="1"
                value={dailySynapticEventsBillions}
                onChange={e => setDailySynapticEventsBillions(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1B (Edge Vision)</span>
                <span>50B</span>
                <span>100B (Datacenter Cluster)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Analog VMM Latency */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Analog VMM Latency</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-white">{results.analogVmmLatencyNs}</span>
                  <span className="text-sm font-mono text-cyan-400">ns</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Kirchhoff Bitline Settle:</span>
                    <span className="font-mono text-slate-300">Single-cycle</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Digital GPU Baseline:</span>
                    <span className="font-mono text-rose-400">{results.digitalSystolicLatencyNs} ns</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyan-300">
                    <span>Acceleration Speedup:</span>
                    <span>{results.accelerationFactor}x Faster</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Energy per Synaptic Op */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Energy Consumption / Synaptic Op</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">{results.energyPerSynapticOpFemtojoules}</span>
                  <span className="text-sm font-mono text-emerald-300">fJ / SOP</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Digital GPU Baseline:</span>
                    <span className="font-mono text-slate-300">{results.digitalEnergyBaselineFj} fJ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energy Efficiency Ratio:</span>
                    <span className="font-mono text-emerald-400 font-bold">{results.energyEfficiencyRatio}x Lower Energy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Throughput:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.systemThroughputTops} TOPS</span>
                  </div>
                </div>
              </div>

              {/* Card 3: SNR & Retention Horizon */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Retention Horizon &amp; SNR</span>
                  <Thermometer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-white">{results.retentionHorizonHours}</span>
                  <span className="text-sm font-mono text-slate-400">hours</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Effective SNR:</span>
                    <span className="font-mono text-amber-300">{results.effectiveSnrDb} dB</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drift Exponent:</span>
                    <span className="font-mono text-slate-300">ν = {conductanceDriftExponent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Weight Integrity:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{results.retentionHorizonHours >= 8.0 ? 'Preserved' : 'Refresh Req.'}</span>
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
                    <span className="font-mono text-emerald-400 font-semibold">{results.dailyKwhSaved.toLocaleString()} kWh</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Datacenter PUE Factor:</span>
                    <span className="font-mono text-slate-300">1.35x (Cooling incl.)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compute Efficiency:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.powerEfficiencyTopsPerWatt} TOPS / Watt</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Crossbar Conductance Cell Grid Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Grid className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">Memristor Crossbar Junction Telemetry Grid</h3>
                </div>
                <span className="text-xs font-mono text-cyan-400">{results.crossbarCells.length} Sample Cells Rendered</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {results.crossbarCells.map((cell, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 space-y-1 font-mono text-[11px]">
                    <div className="flex justify-between text-cyan-300 font-bold">
                      <span>R{cell.rowIndex}:C{cell.colIndex}</span>
                      <span>{cell.conductanceMicroSiemens} µS</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Current:</span>
                      <span className="text-white">{cell.currentMicroAmps} µA</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Drift σ:</span>
                      <span className="text-amber-300">±{cell.conductanceDriftStdDev} µS</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Status:</span>
                      <span className={cell.isNoiseTolerant ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                        {cell.isNoiseTolerant ? 'Tolerant' : 'Drift Alert'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Memory Computing Architecture Blueprint */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Analog In-Memory Computing (AIMC) Crossbar Architecture</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">1. Voltage Activation (Wordline)</p>
                  <p className="text-slate-400 text-[11px]">
                    Digital input vectors are converted to analog voltage pulses via {adcDacResolutionBits}-bit DACs and applied across the {crossbarDimension} horizontal wordlines.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">2. Ohm &amp; Kirchhoff Accumulation</p>
                  <p className="text-slate-400 text-[11px]">
                    Each memristor acts as a variable conductance state ($I = V \cdot G$). Currents sum along the vertical bitlines instantaneously via Kirchhoff&apos;s Current Law in {results.analogVmmLatencyNs} ns.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">3. Flash ADC Quantization</p>
                  <p className="text-slate-400 text-[11px]">
                    Peripheral column ADCs quantize accumulated bitline currents into digital activations, sustaining an effective SNR of {results.effectiveSnrDb} dB for downstream agent routing.
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
              Analog Neuromorphic In-Memory Computing vs Digital Von Neumann Bottlenecks
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-4xl">
              In traditional GPU architectures, over 80% of total inference energy is consumed simply shuttling matrix weights between high-bandwidth memory (HBM) and the compute registers across metallic buses.
              Analog In-Memory Computing performs computation directly where the weights are stored, executing vector-matrix multiplies in $\mathcal&#123;O&#125;(1)$ time using the laws of physics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Kirchhoff&apos;s Current Law Summation</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                By applying Ohm&apos;s law at each crosspoint ($I_&#123;ij&#125; = V_i \cdot G_&#123;ij&#125;$) and Kirchhoff&apos;s Current Law along each column ($I_j = \sum_i I_&#123;ij&#125;$),
                a complete $N \times N$ matrix multiplication executes passively in a single time step without digital arithmetic logic units (ALUs).
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-amber-400" />
                <span>Conductance Drift Mitigation</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Non-volatile memristors experience structural relaxation described by power-law kinetics: $G(t) = G_0 \cdot (t / t_0)^&#123;-\nu&#125;$.
                Elesium integrates periodic write-verify refresh schedules and drift-resilient neural weight mapping to maintain &gt;99% model accuracy across months of continuous inference.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-5 space-y-3">
              <h3 className="text-base font-semibold text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Spike-Timing-Dependent Plasticity (STDP)</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Memristive crossbars natively support online on-chip learning via biological STDP rules.
                Pre-synaptic and post-synaptic voltage spike overlaps dynamically tune conductance states with sub-50 fJ switching energy, enabling true continuous edge learning.
              </p>
            </div>
          </div>
        </div>

        {/* Enterprise FAQ Accordion */}
        <div className="space-y-6 border-t border-slate-800 pt-10">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight text-white">Frequently Asked Architectural Questions</h2>
            <p className="text-slate-400 text-sm">Technical guidance for engineering executives evaluating analog neuromorphic hardware.</p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "What is Analog In-Memory Computing (AIMC) and how does it differ from digital GPUs?",
                a: "In conventional digital GPUs, weights must be fetched from memory into processing registers on every clock cycle, creating the infamous 'memory wall' where data transfer consumes up to 90% of total power. In Analog In-Memory Computing, matrix weights are stored permanently as analog conductances within a memristor crossbar array. When voltage pulses enter the array, Ohm's law and Kirchhoff's current law compute the entire matrix multiplication in a single passive step directly inside the memory cells."
              },
              {
                q: "How is conductance drift managed in production ReRAM architectures?",
                a: "Memristors undergo power-law relaxation over time (G(t) = G0 * (t/t0)^-ν). Production deployments address this through drift-aware training (quantization-aware noise injection during offline model training) and scheduled closed-loop write-verify refresh routines that recalibrate drifted cells before the signal-to-noise ratio degrades beyond the ADC quantization margin."
              },
              {
                q: "What role do peripheral ADCs and DACs play in analog crossbars?",
                a: "While the crossbar matrix multiplication itself consumes negligible energy (<50 fJ/op), converting analog bitline currents back to digital activations requires high-speed Analog-to-Digital Converters (ADCs). Peripheral circuit design balances ADC resolution (typically 6 to 8 bits) and multiplexing across columns to maximize energy efficiency while maintaining inference precision."
              },
              {
                q: "Can memristive crossbars run standard Transformer and LLM foundation models?",
                a: "Yes. In transformer architectures, linear projection layers (Key, Query, Value, and Feed-Forward Networks) account for >90% of compute cycles. These GEMM operations are offloaded directly to memristive crossbar tiles. Non-linear operations like Softmax, RMSNorm, and attention masking are executed on adjacent low-power digital RISC-V or DSP coprocessors."
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
          <h2 className="text-2xl font-extrabold text-white">Deploy Sovereign Neuromorphic In-Memory Computing Infrastructure</h2>
          <p className="text-slate-400 text-sm max-w-2xl mx-auto leading-relaxed">
            Break the Von Neumann bottleneck and reduce AI inference power by up to 90%. Partner with Elesium to architect sovereign analog in-memory compute accelerators and multi-agent infrastructure.
          </p>
          <div className="pt-2">
            <ExpandableScreen>
              <ExpandableScreenTrigger>
                <button className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/60 transition">
                  <span>Schedule Neuromorphic Architecture Audit</span>
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
              Embed the interactive Memristor Crossbar Simulator directly on your internal portal or technical documentation. Includes responsive layout and live telemetry calculations.
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
          <WhatsAppModal />
    </div>
  );
}
