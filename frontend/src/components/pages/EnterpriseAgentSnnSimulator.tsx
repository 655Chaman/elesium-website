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
  Sparkles,
  Layers,
  Brain,
  Timer
} from 'lucide-react';
import {
  simulateSnn,
  SnnInputs
} from '../calculator/agentSnnModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentSnnSimulator() {
  // Inputs State
  const [neuronModel, setNeuronModel] = useState<'lif_standard' | 'alif_adaptive_threshold' | 'izhikevich_bifurcation' | 'glif_generalized'>('lif_standard');
  const [temporalEncodingScheme, setTemporalEncodingScheme] = useState<'rate_coding' | 'time_to_first_spike' | 'burst_phase_coding' | 'direct_event_aer'>('direct_event_aer');
  const [membraneTimeConstantMs, setMembraneTimeConstantMs] = useState<number>(20.0);
  const [synapticThresholdMv, setSynapticThresholdMv] = useState<number>(25.0);
  const [inputEventRateKhz, setInputEventRateKhz] = useState<number>(15.0);
  const [dailyEventWorkloadMillions, setDailyEventWorkloadMillions] = useState<number>(250);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SnnInputs = useMemo(() => ({
    neuronModel,
    temporalEncodingScheme,
    membraneTimeConstantMs,
    synapticThresholdMv,
    inputEventRateKhz,
    dailyEventWorkloadMillions,
    currency
  }), [
    neuronModel,
    temporalEncodingScheme,
    membraneTimeConstantMs,
    synapticThresholdMv,
    inputEventRateKhz,
    dailyEventWorkloadMillions,
    currency
  ]);

  const results = useMemo(() => {
    return simulateSnn(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-snn-neuromorphic-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT SPIKING NEURAL NETWORK (SNN) LIF EVENT NEUROMORPHIC AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-snn-neuromorphic-simulator)

NEUROMORPHIC SNN ARCHITECTURE:
- Neuron Model: ${neuronModel.replace(/_/g, ' ').toUpperCase()}
- Temporal Encoding: ${temporalEncodingScheme.replace(/_/g, ' ').toUpperCase()}
- Membrane Time Constant (tau_m): ${membraneTimeConstantMs} ms
- Synaptic Firing Threshold: ${synapticThresholdMv} mV above resting (-70 mV)
- Input Event Rate: ${inputEventRateKhz} kHz
- Daily Workload: ${dailyEventWorkloadMillions} Million Spiking Events/day

TEMPORAL DYNAMICS & ENERGY BENCHMARKS:
- Event Sparsity: ${results.eventSparsityPercent}% (Zero-compute inactive time windows)
- Mean Output Firing Rate: ${results.meanFiringRateHz} Hz
- Temporal Decision Latency: ${results.temporalLatencyMs} ms (Time-to-First-Spike)
- Energy per Synaptic Event: ${results.energyPerSpikePicojoules} pJ/SOP (vs Digital GPU Baseline: ${results.gpuSynchronousBaselineEnergyPj} pJ/op)
- Energy Reduction Factor: ${results.neuromorphicPowerReductionFactor}x Lower Energy Consumption
- System Event Throughput: ${results.systemThroughputMegaEventsPerSec} MEPS (Million Events/Sec)

DATACENTER OPEX SAVINGS:
- Annual Power Cost Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualPowerCostSavings.toLocaleString()}/year

ARCHITECTURAL VERDICT:
${results.statusClassification === 'EVENT_DRIVEN_SUPREMACY'
  ? 'Event-driven asynchronous sparsity eliminates dense matrix multiplication waste. SNN achieves sub-5ms decision latency with over 30x energy efficiency relative to synchronous transformer GPU inference.'
  : results.statusClassification === 'BURSTING_LIMIT_CYCLE'
  ? 'High event frequency or low membrane threshold has induced bursting dynamics. Increase synaptic threshold or optimize refractory period to restore sparsity.'
  : 'Sparsity-attenuated operation. Stable energy consumption with moderate spike throughput.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG path for membrane potential oscilloscope
  const { pathString, spikePoints } = useMemo(() => {
    const width = 600;
    const height = 180;
    const trace = results.membraneTrace;
    if (!trace || trace.length === 0) return { pathString: '', spikePoints: [] };

    // V range: -80 mV to +25 mV
    const minV = -80;
    const maxV = 25;
    const vRange = maxV - minV;

    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - ((pt.membranePotentialMv - minV) / vRange) * height;
      return [x, y];
    });

    const spikes = trace
      .map((pt, idx) => ({ ...pt, idx }))
      .filter(pt => pt.isSpikeEmitted)
      .map(pt => ({
        x: (pt.idx / (trace.length - 1)) * width,
        y: height - ((20 - minV) / vRange) * height
      }));

    const d = points.reduce((acc, [x, y], idx) => {
      return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');

    return { pathString: d, spikePoints: spikes };
  }, [results.membraneTrace]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Spiking Neural Network (SNN) LIF Neuromorphic Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate event-driven Spiking Neural Network (SNN) Leaky Integrate-and-Fire (LIF) dynamics, temporal Address-Event Representation (AER), synaptic sparsity, and femtojoule energy reduction."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-snn-neuromorphic-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-cyan-400 font-mono">
            <a href="/solutions" className="hover:underline">Solutions</a>
            <span>/</span>
            <a href="/resources" className="hover:underline">Tools</a>
            <span>/</span>
            <span className="text-slate-400">SNN Neuromorphic Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/60 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <Brain className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                Tool #34 · Event-Driven Neuromorphic Computing &amp; SNN Dynamics
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Agent Spiking Neural Network (SNN) LIF Neuromorphic Simulator
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Benchmark event-driven Spiking Neural Networks (SNN) utilizing Leaky Integrate-and-Fire (LIF) and Adaptive-LIF (ALIF) membrane dynamics.
                Simulate temporal spike encoding, Address-Event Representation (AER), synaptic sparsity, and femtojoule-per-synaptic-op energy scaling against dense GPU baselines.
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
          results.statusClassification === 'EVENT_DRIVEN_SUPREMACY'
            ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
            : results.statusClassification === 'BURSTING_LIMIT_CYCLE'
            ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
            : 'bg-cyan-950/30 border-cyan-800/50 text-cyan-300'
        }`}>
          <div className="flex items-center space-x-3">
            <Sparkles className="w-6 h-6 shrink-0" />
            <div>
              <p className="font-semibold text-sm">
                Neuromorphic Dynamic State: {results.statusClassification.replace(/_/g, ' ')}
              </p>
              <p className="text-xs opacity-90">
                {results.statusClassification === 'EVENT_DRIVEN_SUPREMACY'
                  ? `Event-driven asynchronous sparsity achieves ${results.eventSparsityPercent}% idle compute suppression. Energy per synaptic operation is ${results.energyPerSpikePicojoules} pJ/SOP (${results.neuromorphicPowerReductionFactor}x lower energy vs dense 4nm GPU).`
                  : results.statusClassification === 'BURSTING_LIMIT_CYCLE'
                  ? `High spike frequency (${results.meanFiringRateHz} Hz) detected. Sparsity has fallen to ${results.eventSparsityPercent}%. Increase synaptic threshold or refractory duration to prevent power saturation.`
                  : `Balanced event dynamics with ${results.systemThroughputMegaEventsPerSec} MEPS throughput and ${results.temporalLatencyMs} ms time-to-first-spike latency.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/40 border border-current shrink-0">
            Efficiency: {results.neuromorphicPowerReductionFactor}x GPU
          </span>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-semibold text-white">SNN Neuronal &amp; Synaptic Parameters</h2>
            </div>

            {/* Neuron Model Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Biophysical Neuron Model:</label>
              <select
                value={neuronModel}
                onChange={e => setNeuronModel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="lif_standard">Standard Leaky Integrate-and-Fire (LIF)</option>
                <option value="alif_adaptive_threshold">Adaptive-Threshold LIF (ALIF - Biological Spike-Rate Adaptation)</option>
                <option value="izhikevich_bifurcation">Izhikevich Dynamical Bifurcation Model</option>
                <option value="glif_generalized">Generalized Leaky Integrate-and-Fire (GLIF)</option>
              </select>
            </div>

            {/* Temporal Encoding Scheme Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Temporal Encoding &amp; Protocol Scheme:</label>
              <select
                value={temporalEncodingScheme}
                onChange={e => setTemporalEncodingScheme(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
              >
                <option value="direct_event_aer">Direct Address-Event Representation (AER Asynchronous)</option>
                <option value="time_to_first_spike">Time-to-First-Spike (TTFS Low-Latency)</option>
                <option value="rate_coding">Poisson Rate Coding (High Sparsity)</option>
                <option value="burst_phase_coding">Phase-Synchronized Burst Coding</option>
              </select>
            </div>

            {/* Membrane Time Constant Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Membrane Time Constant (τ_m = R_m · C_m):</span>
                <span className="font-mono text-cyan-400 font-bold">{membraneTimeConstantMs} ms</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="50.0"
                step="1.0"
                value={membraneTimeConstantMs}
                onChange={e => setMembraneTimeConstantMs(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 ms (Ultra-fast leak)</span>
                <span>20 ms (Cortical Pyramidal)</span>
                <span>50 ms (Long integration)</span>
              </div>
            </div>

            {/* Synaptic Firing Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Synaptic Firing Threshold (ΔV_th):</span>
                <span className="font-mono text-cyan-400 font-bold">{synapticThresholdMv} mV</span>
              </div>
              <input
                type="range"
                min="10.0"
                max="50.0"
                step="1.0"
                value={synapticThresholdMv}
                onChange={e => setSynapticThresholdMv(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10 mV (High sensitivity)</span>
                <span>25 mV (Balanced)</span>
                <span>50 mV (Sparse barrier)</span>
              </div>
            </div>

            {/* Input Event Rate Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Input Event Ingestion Rate:</span>
                <span className="font-mono text-cyan-400 font-bold">{inputEventRateKhz} kHz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="100.0"
                step="0.5"
                value={inputEventRateKhz}
                onChange={e => setInputEventRateKhz(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.5 kHz (Edge Telemetry)</span>
                <span>25 kHz</span>
                <span>100 kHz (DVS Neuromorphic Vision)</span>
              </div>
            </div>

            {/* Daily Event Workload Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Daily Event Workload:</span>
                <span className="font-mono text-cyan-400 font-bold">{dailyEventWorkloadMillions}M events/day</span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="50"
                value={dailyEventWorkloadMillions}
                onChange={e => setDailyEventWorkloadMillions(Number(e.target.value))}
                className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>10M (Industrial Sensor)</span>
                <span>1,000M</span>
                <span>5,000M (Enterprise Cluster)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top 4 Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Event Sparsity */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Event Compute Sparsity</span>
                  <Zap className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-cyan-400">{results.eventSparsityPercent}</span>
                  <span className="text-sm font-mono text-cyan-300">%</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Mean Firing Rate:</span>
                    <span className="font-mono text-slate-300">{results.meanFiringRateHz} Hz</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dense GPU Inefficiency:</span>
                    <span className="font-mono text-rose-400">0% Sparsity (100% dense)</span>
                  </div>
                  <div className="flex justify-between font-bold text-cyan-300">
                    <span>Quiet Cycle Savings:</span>
                    <span>{results.eventSparsityPercent}% Compute Idle</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Energy per Synaptic Op */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Energy / Synaptic Event</span>
                  <Cpu className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-emerald-400">{results.energyPerSpikePicojoules}</span>
                  <span className="text-sm font-mono text-emerald-300">pJ / SOP</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Synchronous GPU Baseline:</span>
                    <span className="font-mono text-slate-300">{results.gpuSynchronousBaselineEnergyPj} pJ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neuromorphic Gain:</span>
                    <span className="font-mono text-emerald-400 font-bold">{results.neuromorphicPowerReductionFactor}x Less Energy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Event Throughput:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.systemThroughputMegaEventsPerSec} MEPS</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Decision Latency */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Temporal Decision Latency</span>
                  <Timer className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold font-mono text-amber-400">{results.temporalLatencyMs}</span>
                  <span className="text-sm font-mono text-slate-400">ms</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Time-to-First-Spike:</span>
                    <span className="font-mono text-amber-300">{results.temporalLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Neuron Model:</span>
                    <span className="font-mono text-slate-300">{neuronModel === 'alif_adaptive_threshold' ? 'ALIF (Adaptive)' : 'LIF'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Event Protocol:</span>
                    <span className="font-mono text-cyan-300 font-semibold">{temporalEncodingScheme === 'direct_event_aer' ? 'AER Asynchronous' : 'Timed Coding'}</span>
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
                    <span>Workload Analyzed:</span>
                    <span className="font-mono text-emerald-400 font-semibold">{dailyEventWorkloadMillions}M events/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Datacenter PUE:</span>
                    <span className="font-mono text-slate-300">1.35x (Cooling &amp; Power)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Efficiency Multiplier:</span>
                    <span className="font-mono text-cyan-300 font-bold">{results.neuromorphicPowerReductionFactor}x vs GPU</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Real-Time Membrane Potential Oscilloscope Chart */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-semibold text-white">LIF Membrane Potential Dynamics V(t) &amp; Spike Train</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span> V(t) Membrane
                  </span>
                  <span className="text-rose-400 flex items-center gap-1">
                    <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span> V_th Spike Event
                  </span>
                </div>
              </div>

              {/* Oscilloscope SVG */}
              <div className="relative w-full aspect-[3/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
                <svg viewBox="0 0 600 180" className="w-full h-full">
                  {/* Grid lines */}
                  {[30, 75, 120, 160].map(y => (
                    <line key={`grid-${y}`} x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  ))}
                  {[100, 200, 300, 400, 500].map(x => (
                    <line key={`grid-x-${x}`} x1={x} y1="0" x2={x} y2="180" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                  ))}

                  {/* Threshold Line */}
                  <line
                    x1="0"
                    y1={180 - ((-70 + synapticThresholdMv - (-80)) / 105) * 180}
                    x2="600"
                    y2={180 - ((-70 + synapticThresholdMv - (-80)) / 105) * 180}
                    stroke="#f43f5e"
                    strokeWidth="1.5"
                    strokeDasharray="6 3"
                  />

                  {/* Trace Line */}
                  <path
                    d={pathString}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Spike Emission Markers */}
                  {spikePoints.map((sp, idx) => (
                    <circle
                      key={`spike-${idx}`}
                      cx={sp.x}
                      cy={sp.y}
                      r="4"
                      fill="#f43f5e"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  ))}
                </svg>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                  <span>0 ms (Resting V = -70 mV)</span>
                  <span className="text-rose-400 font-bold">Action Potential Peak: +20 mV | Reset: -75 mV</span>
                  <span>50 ms Time Horizon</span>
                </div>
              </div>
            </div>

            {/* Neuromorphic Address-Event Architecture Blueprint */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Layers className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold text-white">Event-Driven Asynchronous Neuromorphic SNN Architecture</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">1. Address-Event Representation (AER)</p>
                  <p className="text-slate-400 text-[11px]">
                    Sensory inputs and intermediate activations emit asynchronous spike packets containing neuron address coordinates only upon state transitions, eliminating clock cycles.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">2. Leaky Membrane Integration</p>
                  <p className="text-slate-400 text-[11px]">
                    Synaptic weights are added directly to the postsynaptic membrane potential ($V = V + W_i$). Leak decays exponentially with time constant τ_m = {membraneTimeConstantMs} ms.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1">
                  <p className="font-semibold text-cyan-300">3. Synaptic Sparsity &amp; Refractory Reset</p>
                  <p className="text-slate-400 text-[11px]">
                    With {results.eventSparsityPercent}% event sparsity, silicon remains unpowered between spikes, slashing dynamic power consumption to {results.energyPerSpikePicojoules} pJ/SOP.
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
              Spiking Neural Networks vs Synchronous Dense Transformer Architectures
            </h2>
            <p className="text-slate-400 text-sm max-w-4xl leading-relaxed">
              Standard deep learning architectures execute millions of Multiply-Accumulate (MAC) floating-point calculations synchronously across every clock cycle, regardless of whether activations are zero.
              Neuromorphic computing replaces dense synchronous matrix multiplication with sparse, event-driven Synaptic Operations (SOP), consuming energy only when physical spikes traverse the network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Dense Digital GPU Inefficiencies
              </h3>
              <ul className="space-y-2 text-slate-400 text-xs leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Synchronous Clock Waste:</strong> Standard GPUs cycle millions of logic gates every gigahertz cycle even when input telemetry is static.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Memory Movement Dominance:</strong> Fetching 16-bit float weights from high-bandwidth memory (HBM) consumes over 200x more energy than the arithmetic operation itself.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Batching Latency Penalty:</strong> GPUs must accumulate batches of queries to amortize memory fetching costs, increasing real-time decision latency.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                Neuromorphic Event-Driven SNN Advantages
              </h3>
              <ul className="space-y-2 text-slate-400 text-xs leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Asynchronous Sparsity:</strong> Zero computation occurs during silent intervals ({results.eventSparsityPercent}% power gate suppression).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Accumulation-Only Arithmetic:</strong> Synaptic events require simple additions ($V \leftarrow V + W$) rather than costly floating-point multiplications ($A \times B$).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Sub-Millisecond Edge Telemetry:</strong> Temporal Address-Event Representation delivers immediate decisions in {results.temporalLatencyMs} ms without batching.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 border-t border-slate-800 pt-10">
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'What is the mathematical difference between Leaky Integrate-and-Fire (LIF) and standard artificial neurons?',
                a: 'Standard artificial neural network neurons apply static continuous activation functions (such as ReLU or GELU) to a weighted sum of inputs instantaneously. In contrast, an LIF neuron is a biophysical dynamical system governed by the differential equation τ_m · dV/dt = -(V - V_rest) + R_m · I(t). Membrane potential accumulates over continuous time, decays exponentially according to the time constant τ_m, and emits an all-or-none discrete spike when the potential crosses threshold V_th, followed by an absolute refractory period.'
              },
              {
                q: 'How does Address-Event Representation (AER) enable ultra-low power consumption?',
                a: 'Under Address-Event Representation (AER), communications between neuromorphic cores occur only when a neuron spikes. The packet contains only the discrete ID of the firing neuron and a temporal timestamp. Because biological and physical sensor data exhibit high temporal redundancy (often >85% sparse), the communication fabric and compute logic remain in near-zero-power quiescent sleep states between events.'
              },
              {
                q: 'Can Spiking Neural Networks run existing Large Language Models and Enterprise Agents?',
                a: 'Yes. Modern neuromorphic frameworks utilize Ann-to-SNN conversion algorithms or direct surrogate-gradient backpropagation (e.g., Spike-BP, SLAYER) to map transformer self-attention mechanisms into spike-driven temporal dynamics. Spiking agents achieve equivalent task accuracy with up to 98% reduction in inference energy.'
              },
              {
                q: 'How does Elesium deploy neuromorphic SNN agents into sovereign enterprise environments?',
                a: 'Elesium deploys hybrid neuromorphic pipelines where event-based pre-processing and temporal anomaly detection run on neuromorphic hardware (Intel Loihi 2, SynSense Speck, or FPGA emulations) while large-scale symbolic reasoning and policy validation execute in private sovereign enclaves.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl bg-slate-900/30 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex justify-between items-center text-sm font-semibold text-slate-200 hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Call to Action */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-800/40 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Deploy Event-Driven Sovereign AI Agents with Sub-Millisecond Latency
            </h3>
            <p className="text-slate-400 text-sm">
              Replace energy-intensive synchronous GPU inference with custom event-driven neuromorphic architectures tailored to your enterprise telemetry workloads.
            </p>
          </div>
          <ExpandableScreen>
            <ExpandableScreenTrigger>
              <button className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm shadow-lg shadow-cyan-950/50 flex items-center space-x-2 transition shrink-0">
                <span>Deploy Sovereign Architecture</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </ExpandableScreenTrigger>
            <ExpandableScreenContent>
              <div className="p-6">
                <MandateApplicationForm />
              </div>
            </ExpandableScreenContent>
          </ExpandableScreen>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Embed SNN Neuromorphic Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this lightweight HTML snippet to embed the live Spiking Neural Network Leaky Integrate-and-Fire Simulator directly into your website or enterprise portal:
            </p>
            <div className="relative">
              <textarea
                readOnly
                rows={4}
                value={embedCode}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition flex items-center space-x-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}