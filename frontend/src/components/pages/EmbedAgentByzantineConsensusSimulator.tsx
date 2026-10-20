import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateByzantineConsensus,
  ByzantineConsensusInputs
} from '../calculator/agentByzantineConsensusModel';
import { Network } from 'lucide-react';

export default function EmbedAgentByzantineConsensusSimulator() {
  const [totalNodes, setTotalNodes] = useState<number>(20);
  const [byzantineNodes, setByzantineNodes] = useState<number>(4);
  const [aggregationAlgorithm, setAggregationAlgorithm] = useState<'fedavg' | 'coordinate_median' | 'trimmed_mean' | 'multi_krum' | 'bulyan'>('bulyan');
  const [secAggEnabled, setSecAggEnabled] = useState<boolean>(true);

  const inputs: ByzantineConsensusInputs = useMemo(() => ({
    totalNodes,
    byzantineNodes,
    attackVector: 'sign_flip',
    aggregationAlgorithm,
    secAggEnabled,
    secretSharingThresholdT: Math.floor(totalNodes * 0.7),
    gradientDimensions: 500000,
    currency: 'INR'
  }), [totalNodes, byzantineNodes, aggregationAlgorithm, secAggEnabled]);

  const results = useMemo(() => {
    return simulateByzantineConsensus(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Byzantine Consensus & SecAgg Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-byzantine-consensus-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Network className="w-4 h-4 text-cyan-400" />
              Agent Byzantine Consensus &amp; SecAgg Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              Byzantine fault tolerance and cryptographic Secure Aggregation simulator.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.toleranceConditionSatisfied
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            {results.toleranceConditionSatisfied ? 'RESILIENT' : 'VULNERABLE'}
          </span>
        </div>

        {/* Mini SVG Visualizer */}
        <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
          <svg viewBox="-120 -80 240 160" className="w-full h-full">
            <line x1="-120" y1="0" x2="120" y2="0" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />
            <line x1="0" y1="-80" x2="0" y2="80" stroke="#1e293b" strokeWidth="0.8" strokeDasharray="3,3" />

            {/* Connecting lines */}
            {results.nodePlots.map(node => (
              <line
                key={`line-${node.id}`}
                x1={node.x}
                y1={node.y}
                x2={results.consensusCentroid.x}
                y2={results.consensusCentroid.y}
                stroke={node.isTrimmedOrRejected ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.25)'}
                strokeWidth={node.isTrimmedOrRejected ? '0.5' : '0.8'}
              />
            ))}

            {/* Render Nodes */}
            {results.nodePlots.map(node => (
              <g key={`node-${node.id}`}>
                {node.isTrimmedOrRejected && (
                  <circle cx={node.x} cy={node.y} r="5.5" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
                )}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.isByzantine ? '4' : '3.5'}
                  fill={node.isByzantine ? '#f43f5e' : '#10b981'}
                  stroke="#020617"
                  strokeWidth="1"
                />
              </g>
            ))}

            {/* Centroid */}
            <circle cx={results.consensusCentroid.x} cy={results.consensusCentroid.y} r="4" fill="#06b6d4" stroke="#ffffff" strokeWidth="1" />
          </svg>
          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            L2 Error: <span className="text-cyan-400">{results.gradientErrorNormL2}</span>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Total Nodes (N):</span>
              <span className="font-mono text-cyan-400 font-bold">{totalNodes}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={totalNodes}
              onChange={e => {
                const val = Number(e.target.value);
                setTotalNodes(val);
                if (byzantineNodes >= val) setByzantineNodes(Math.floor(val / 3));
              }}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Byzantine Nodes (f):</span>
              <span className="font-mono text-rose-400 font-bold">{byzantineNodes} (max: {results.maxTolerableByzantineNodes})</span>
            </div>
            <input
              type="range"
              min="0"
              max={Math.min(20, totalNodes - 1)}
              value={byzantineNodes}
              onChange={e => setByzantineNodes(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Aggregation Algorithm</label>
              <select
                value={aggregationAlgorithm}
                onChange={e => setAggregationAlgorithm(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-cyan-300"
              >
                <option value="fedavg">FedAvg (Vulnerable)</option>
                <option value="coordinate_median">Coord-wise Median</option>
                <option value="trimmed_mean">Trimmed Mean</option>
                <option value="multi_krum">Multi-Krum</option>
                <option value="bulyan">Bulyan (Optimal)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Secure Aggregation</label>
              <button
                type="button"
                onClick={() => setSecAggEnabled(!secAggEnabled)}
                className={`w-full py-1 rounded text-[11px] font-mono border transition ${
                  secAggEnabled
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                {secAggEnabled ? 'SecAgg Active' : 'Unmasked'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Degradation</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {results.modelConvergenceDegradationPercent}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Poisoning Risk</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {results.poisoningSuccessProbabilityPercent}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">DPDP Score</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {results.statutoryComplianceScore}/100
            </span>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-500 hover:text-cyan-400 transition"
          >
            Powered by Elesium Sovereign Enterprise AI
          </a>
        </div>
      </div>
    </div>
  );
}
