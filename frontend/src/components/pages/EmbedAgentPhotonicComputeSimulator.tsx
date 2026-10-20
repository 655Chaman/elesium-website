import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulatePhotonicCompute,
  PhotonicComputeInputs
} from '../calculator/agentPhotonicComputeModel';
import { Radio, Zap, Cpu, Thermometer } from 'lucide-react';

export default function EmbedAgentPhotonicComputeSimulator() {
  const [opticalArchitecture, setOpticalArchitecture] = useState<'mzi_clements_mesh' | 'mrr_wdm_crossbar' | 'free_space_d2nn' | 'cpo_hybrid_accelerator'>('mzi_clements_mesh');
  const [matrixDimension, setMatrixDimension] = useState<64 | 128 | 256 | 512 | 1024>(256);
  const [wdmChannels, setWdmChannels] = useState<1 | 4 | 8 | 16 | 32>(16);
  const [modulationPrecisionBits] = useState<4 | 6 | 8 | 12>(8);
  const [thermalDriftStdDevKelvin] = useState<number>(0.8);
  const [dailyInferenceTokensMillions] = useState<number>(50);

  const inputs: PhotonicComputeInputs = useMemo(() => ({
    opticalArchitecture,
    matrixDimension,
    wdmChannels,
    modulationPrecisionBits,
    thermalDriftStdDevKelvin,
    dailyInferenceTokensMillions,
    currency: 'INR'
  }), [
    opticalArchitecture,
    matrixDimension,
    wdmChannels,
    modulationPrecisionBits,
    thermalDriftStdDevKelvin,
    dailyInferenceTokensMillions
  ]);

  const results = useMemo(() => {
    return simulatePhotonicCompute(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Silicon Photonics &amp; Optical GEMM Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-photonic-compute-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" />
              Silicon Photonics &amp; Optical GEMM Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              Coherent optical neural network matrix acceleration and in-flight waveguide latency.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.statusClassification === 'COHERENT_OPTICAL_ADVANTAGE'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-cyan-950 text-cyan-400 border-cyan-800'
          }`}>
            {results.latencySpeedupFactor}x Faster
          </span>
        </div>

        {/* Mini Spectral SVG Visualizer */}
        <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold">WDM C-Band Spectrum ({results.spectralPoints.length} Channels)</span>
            <span>Speed: {results.inFlightOpticalLatencyPs} ps</span>
          </div>

          <svg viewBox="0 0 320 80" className="w-full h-20">
            <line x1="0" y1="70" x2="320" y2="70" stroke="#1e293b" strokeWidth="1" />
            {results.spectralPoints.map((pt, idx) => {
              const x = (idx / Math.max(1, results.spectralPoints.length - 1)) * 280 + 20;
              const barHeight = Math.max(10, (pt.opticalPowerDbm + 10) * 4.5);
              return (
                <g key={pt.channelIndex}>
                  <line
                    x1={x}
                    y1={70}
                    x2={x}
                    y2={70 - barHeight}
                    stroke="#06b6d4"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <circle
                    cx={x}
                    cy={70 - barHeight}
                    r="2.5"
                    fill="#38bdf8"
                  />
                </g>
              );
            })}
          </svg>

          <div className="flex justify-between text-[9px] font-mono text-slate-500">
            <span>1530 nm</span>
            <span>1550 nm (Center)</span>
            <span>1580 nm</span>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 text-xs">
          <div>
            <label className="text-[11px] text-slate-300 font-medium block mb-1">Optical Substrate Architecture:</label>
            <select
              value={opticalArchitecture}
              onChange={e => setOpticalArchitecture(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
            >
              <option value="mzi_clements_mesh">Mach-Zehnder Interferometer (Clements MZI Mesh)</option>
              <option value="mrr_wdm_crossbar">Micro-Ring Resonator (MRR WDM Crossbar)</option>
              <option value="free_space_d2nn">Diffractive Deep Neural Network (Metasurface D2NN)</option>
              <option value="cpo_hybrid_accelerator">Co-Packaged Optics (CPO Hybrid Accelerator)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Matrix Dim (N x N):</label>
              <select
                value={matrixDimension}
                onChange={e => setMatrixDimension(Number(e.target.value) as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
              >
                <option value="64">64 x 64</option>
                <option value="128">128 x 128</option>
                <option value="256">256 x 256</option>
                <option value="512">512 x 512</option>
                <option value="1024">1024 x 1024</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">WDM Channels (λ):</label>
              <select
                value={wdmChannels}
                onChange={e => setWdmChannels(Number(e.target.value) as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-cyan-300 font-mono focus:outline-none"
              >
                <option value="1">1 Channel (Mono)</option>
                <option value="4">4 Channels</option>
                <option value="8">8 Channels</option>
                <option value="16">16 Channels</option>
                <option value="32">32 Channels</option>
              </select>
            </div>
          </div>
        </div>

        {/* KPI Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-cyan-400" /> Latency
            </span>
            <span className="text-sm font-extrabold font-mono text-white block mt-0.5">
              {results.totalGemmLatencyNs} ns
            </span>
            <span className="text-[9px] text-cyan-400 font-mono">
              {results.inFlightOpticalLatencyPs} ps in-flight
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Cpu className="w-3 h-3 text-emerald-400" /> Energy
            </span>
            <span className="text-sm font-extrabold font-mono text-emerald-400 block mt-0.5">
              {results.energyPerMacFemtojoules} fJ
            </span>
            <span className="text-[9px] text-emerald-300 font-mono">
              {results.opticalEnergyEfficiencyRatio}x lower vs GPU
            </span>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 block flex items-center justify-center gap-1">
              <Thermometer className="w-3 h-3 text-amber-400" /> ENOB
            </span>
            <span className="text-sm font-extrabold font-mono text-white block mt-0.5">
              {results.effectiveEnob} bits
            </span>
            <span className="text-[9px] text-amber-300 font-mono">
              {results.powerEfficiencyTopsPerWatt} TOPS/W
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
