import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateSnn,
  SnnInputs
} from '../calculator/agentSnnModel';
import { Brain, Zap, Cpu, Timer, Activity } from 'lucide-react';

export default function EmbedAgentSnnSimulator() {
  const [neuronModel, setNeuronModel] = useState<'lif_standard' | 'alif_adaptive_threshold' | 'izhikevich_bifurcation' | 'glif_generalized'>('lif_standard');
  const [temporalEncodingScheme, setTemporalEncodingScheme] = useState<'rate_coding' | 'time_to_first_spike' | 'burst_phase_coding' | 'direct_event_aer'>('direct_event_aer');
  const [membraneTimeConstantMs, setMembraneTimeConstantMs] = useState<number>(20.0);
  const [synapticThresholdMv, setSynapticThresholdMv] = useState<number>(25.0);
  const [inputEventRateKhz, setInputEventRateKhz] = useState<number>(15.0);

  const inputs: SnnInputs = useMemo(() => ({
    neuronModel,
    temporalEncodingScheme,
    membraneTimeConstantMs,
    synapticThresholdMv,
    inputEventRateKhz,
    dailyEventWorkloadMillions: 250,
    currency: 'INR'
  }), [
    neuronModel,
    temporalEncodingScheme,
    membraneTimeConstantMs,
    synapticThresholdMv,
    inputEventRateKhz
  ]);

  const results = useMemo(() => {
    return simulateSnn(inputs);
  }, [inputs]);

  // Generate SVG path for membrane potential oscilloscope
  const { pathString, spikePoints } = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.membraneTrace;
    if (!trace || trace.length === 0) return { pathString: '', spikePoints: [] };

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
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent SNN Neuromorphic Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-snn-neuromorphic-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-cyan-400" />
              SNN Neuromorphic &amp; LIF Event Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              Event-driven Leaky Integrate-and-Fire dynamics and synaptic sparsity.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.statusClassification === 'EVENT_DRIVEN_SUPREMACY'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
          }`}>
            {results.neuromorphicPowerReductionFactor}x vs GPU
          </span>
        </div>

        {/* Mini Oscilloscope SVG */}
        <div className="relative w-full aspect-[3/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> LIF Membrane V(t) Dynamics
            </span>
            <span>Latency: {results.temporalLatencyMs} ms</span>
          </div>

          <svg viewBox="0 0 340 90" className="w-full h-16">
            {/* Grid */}
            {[25, 50, 75].map(y => (
              <line key={`grid-${y}`} x1="0" y1={y} x2="340" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            ))}

            {/* Threshold line */}
            <line
              x1="0"
              y1={90 - ((-70 + synapticThresholdMv - (-80)) / 105) * 90}
              x2="340"
              y2={90 - ((-70 + synapticThresholdMv - (-80)) / 105) * 90}
              stroke="#f43f5e"
              strokeWidth="1"
              strokeDasharray="4 2"
            />

            {/* Membrane trace */}
            <path
              d={pathString}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Spike points */}
            {spikePoints.map((sp, idx) => (
              <circle
                key={`sp-${idx}`}
                cx={sp.x}
                cy={sp.y}
                r="3"
                fill="#f43f5e"
                stroke="#ffffff"
                strokeWidth="1"
              />
            ))}
          </svg>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
            <span>V_rest: -70 mV</span>
            <span className="text-rose-400 font-semibold">Spikes Emitted: {spikePoints.length}</span>
            <span>V_th: {-70 + synapticThresholdMv} mV</span>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Compute Sparsity</span>
              <Zap className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
              {results.eventSparsityPercent}%
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Rate: {results.meanFiringRateHz} Hz
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Energy per Spike</span>
              <Cpu className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-lg font-bold font-mono text-emerald-400 mt-0.5">
              {results.energyPerSpikePicojoules} <span className="text-xs">pJ</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono">
              {results.neuromorphicPowerReductionFactor}x Less Power
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Decision Latency</span>
              <Timer className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-lg font-bold font-mono text-amber-400 mt-0.5">
              {results.temporalLatencyMs} <span className="text-xs">ms</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              TTFS Protocol
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Event Throughput</span>
              <Activity className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg font-bold font-mono text-white mt-0.5">
              {results.systemThroughputMegaEventsPerSec} <span className="text-xs">MEPS</span>
            </div>
            <div className="text-[10px] text-cyan-400 font-mono">
              Asynchronous AER
            </div>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Neuron Model:</span>
              <span className="font-mono text-cyan-400">{neuronModel}</span>
            </div>
            <select
              value={neuronModel}
              onChange={e => setNeuronModel(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono text-[11px]"
            >
              <option value="lif_standard">Standard LIF</option>
              <option value="alif_adaptive_threshold">Adaptive-LIF (ALIF)</option>
              <option value="izhikevich_bifurcation">Izhikevich Bifurcation</option>
              <option value="glif_generalized">Generalized LIF (GLIF)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Temporal Protocol:</span>
              <span className="font-mono text-cyan-400">{temporalEncodingScheme}</span>
            </div>
            <select
              value={temporalEncodingScheme}
              onChange={e => setTemporalEncodingScheme(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 font-mono text-[11px]"
            >
              <option value="direct_event_aer">Address-Event (AER)</option>
              <option value="time_to_first_spike">Time-to-First-Spike</option>
              <option value="rate_coding">Rate Coding</option>
              <option value="burst_phase_coding">Phase-Synchronized Burst</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Membrane Time Constant (τ_m):</span>
              <span className="font-mono text-cyan-400 font-bold">{membraneTimeConstantMs} ms</span>
            </div>
            <input
              type="range"
              min="2.0"
              max="50.0"
              step="1.0"
              value={membraneTimeConstantMs}
              onChange={e => setMembraneTimeConstantMs(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Synaptic Threshold (ΔV_th):</span>
              <span className="font-mono text-cyan-400 font-bold">{synapticThresholdMv} mV</span>
            </div>
            <input
              type="range"
              min="10.0"
              max="50.0"
              step="1.0"
              value={synapticThresholdMv}
              onChange={e => setSynapticThresholdMv(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Input Event Rate:</span>
              <span className="font-mono text-cyan-400 font-bold">{inputEventRateKhz} kHz</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="100.0"
              step="0.5"
              value={inputEventRateKhz}
              onChange={e => setInputEventRateKhz(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Backlink Watermark */}
        <div className="pt-2 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-500 hover:text-cyan-400 transition"
          >
            Engineered by <span className="text-cyan-400 font-medium underline">Elesium Sovereign AI Systems</span>
          </a>
        </div>
      </div>
    </div>
  );
}