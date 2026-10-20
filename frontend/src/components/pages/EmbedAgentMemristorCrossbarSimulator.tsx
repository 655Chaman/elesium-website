import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateMemristorCrossbar,
  MemristorCrossbarInputs
} from '../calculator/agentMemristorCrossbarModel';
import { Grid, Zap, Cpu, Thermometer } from 'lucide-react';

export default function EmbedAgentMemristorCrossbarSimulator() {
  const [memristorTechnology, setMemristorTechnology] = useState<'hfox_reram_crossbar' | 'pcm_chalcogenide_crossbar' | 'cbram_silver_electrolyte' | 'ferroelectric_fe_fet'>('hfox_reram_crossbar');
  const [crossbarDimension, setCrossbarDimension] = useState<64 | 128 | 256 | 512 | 1024>(256);
  const [adcDacResolutionBits] = useState<4 | 6 | 8 | 10>(8);
  const [conductanceDriftExponent] = useState<number>(0.05);
  const [ambientTemperatureKelvin] = useState<number>(300);
  const [dailySynapticEventsBillions] = useState<number>(25);

  const inputs: MemristorCrossbarInputs = useMemo(() => ({
    memristorTechnology,
    crossbarDimension,
    adcDacResolutionBits,
    conductanceDriftExponent,
    ambientTemperatureKelvin,
    dailySynapticEventsBillions,
    currency: 'INR'
  }), [
    memristorTechnology,
    crossbarDimension,
    adcDacResolutionBits,
    conductanceDriftExponent,
    ambientTemperatureKelvin,
    dailySynapticEventsBillions
  ]);

  const results = useMemo(() => {
    return simulateMemristorCrossbar(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Memristor Crossbar &amp; AIMC Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-memristor-crossbar-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Grid className="w-4 h-4 text-cyan-400" />
              Memristor Crossbar &amp; AIMC Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              Analog in-memory computing (AIMC) and ReRAM vector-matrix multiplication.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.statusClassification === 'NEUROMORPHIC_SUPREMACY'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
          }`}>
            {results.accelerationFactor}x Faster
          </span>
        </div>

        {/* Mini Crossbar SVG Visualizer */}
        <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">Crossbar Array Conductance Map ({crossbarDimension}x{crossbarDimension})</span>
            <span>Latency: {results.analogVmmLatencyNs} ns</span>
          </div>

          <svg viewBox="0 0 320 80" className="w-full h-20">
            {/* Wordlines */}
            {[15, 30, 45, 60].map(y => (
              <line key={`wl-${y}`} x1="20" y1={y} x2="300" y2={y} stroke="#1e293b" strokeWidth="1" />
            ))}
            {/* Bitlines */}
            {[60, 110, 160, 210, 260].map(x => (
              <line key={`bl-${x}`} x1={x} y1="10" x2={x} y2="70" stroke="#1e293b" strokeWidth="1" />
            ))}
            {/* Crosspoints */}
            {[15, 30, 45, 60].map((y, r) =>
              [60, 110, 160, 210, 260].map((x, c) => {
                const cell = results.crossbarCells[(r * 5 + c) % results.crossbarCells.length];
                const radius = Math.max(2.5, Math.min(5.5, (cell.conductanceMicroSiemens / 50.0) * 4));
                return (
                  <circle
                    key={`cp-${r}-${c}`}
                    cx={x}
                    cy={y}
                    r={radius}
                    fill={cell.isNoiseTolerant ? '#06b6d4' : '#f59e0b'}
                    opacity={0.85}
                  />
                );
              })
            )}
          </svg>

          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>Wordlines: Input V</span>
            <span>Ohm &amp; Kirchhoff Summation</span>
            <span>Bitlines: Output I</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">Memristor Dielectric Technology:</label>
            <select
              value={memristorTechnology}
              onChange={e => setMemristorTechnology(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
            >
              <option value="hfox_reram_crossbar">HfOx Filamentary ReRAM (Enterprise Standard)</option>
              <option value="pcm_chalcogenide_crossbar">Phase-Change Memory (GST Chalcogenide PCM)</option>
              <option value="cbram_silver_electrolyte">Conductive Bridging RAM (Ag/Cu Electrochemical)</option>
              <option value="ferroelectric_fe_fet">Ferroelectric Field-Effect Transistor (FeFET)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">Crossbar Dimension (N x N):</label>
            <select
              value={crossbarDimension}
              onChange={e => setCrossbarDimension(Number(e.target.value) as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
            >
              <option value="64">64 x 64</option>
              <option value="128">128 x 128</option>
              <option value="256">256 x 256</option>
              <option value="512">512 x 512</option>
              <option value="1024">1024 x 1024</option>
            </select>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Latency
            </span>
            <span className="text-sm font-extrabold font-mono text-white block mt-0.5">
              {results.analogVmmLatencyNs} ns
            </span>
            <span className="text-[9px] text-cyan-400 font-mono">
              {results.accelerationFactor}x vs GPU
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> Energy
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-400 block mt-0.5">
              {results.energyPerSynapticOpFemtojoules} fJ
            </span>
            <span className="text-[9px] text-emerald-300 font-mono">
              {results.energyEfficiencyRatio}x lower vs GPU
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" /> SNR
            </span>
            <span className="text-sm font-extrabold font-mono text-white block mt-0.5">
              {results.effectiveSnrDb} dB
            </span>
            <span className="text-[9px] text-amber-300 font-mono">
              {results.retentionHorizonHours}h retention
            </span>
          </div>
        </div>

        {/* Footer Attribution */}
        <div className="pt-2 text-right border-t border-slate-900">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-medium"
          >
            Powered by Elesium Sovereign AI Architecture
          </a>
        </div>
      </div>
    </div>
  );
}
