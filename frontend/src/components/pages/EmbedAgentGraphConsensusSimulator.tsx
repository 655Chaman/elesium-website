import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateGraphConsensus,
  GraphConsensusInputs
} from '../calculator/agentGraphConsensusModel';
import { Network, ShieldCheck, Activity } from 'lucide-react';

export default function EmbedAgentGraphConsensusSimulator() {
  const [consensusProtocol, setConsensusProtocol] = useState<'byzantine_asynchronous_bft' | 'directed_acyclic_graph_tangle' | 'optimistic_merkle_fraud_proof' | 'zero_knowledge_validity_rollup'>('byzantine_asynchronous_bft');
  const [nodeNetworkScale, setNodeNetworkScale] = useState<number>(16);
  const [networkJitterMs, setNetworkJitterMs] = useState<number>(35);
  const [byzantineFaultToleranceRatio, setByzantineFaultToleranceRatio] = useState<number>(0.15);
  const transactionBatchSize = 1000;

  const inputs: GraphConsensusInputs = useMemo(() => ({
    consensusProtocol,
    nodeNetworkScale,
    networkJitterMs,
    byzantineFaultToleranceRatio,
    transactionBatchSize,
    currency: 'INR'
  }), [
    consensusProtocol,
    nodeNetworkScale,
    networkJitterMs,
    byzantineFaultToleranceRatio,
    transactionBatchSize
  ]);

  const results = useMemo(() => {
    return simulateGraphConsensus(inputs);
  }, [inputs]);

  // Generate SVG path for consensus commit latency and Byzantine resistance
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latencyPath: '', byzantinePath: '', rawPoints: [] };

    const maxLatency = 300;
    const latencyPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.commitLatencyMs / maxLatency) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const byzantinePoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.byzantineResistancePct / 100) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const latD = latencyPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const byzD = byzantinePoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latencyPath: latD, byzantinePath: byzD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Graph Consensus Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-graph-consensus-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Agent Graph Consensus & State Verifier</h1>
              <p className="text-[10px] text-slate-400">Asynchronous aBFT & Merkle State Trie Simulator</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            {results.statusClassification.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Consensus Protocol</label>
            <select
              value={consensusProtocol}
              onChange={(e) => setConsensusProtocol(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="byzantine_asynchronous_bft">Asynchronous BFT (PBFT)</option>
              <option value="directed_acyclic_graph_tangle">DAG Hashgraph Tangle</option>
              <option value="optimistic_merkle_fraud_proof">Optimistic Merkle Fraud Proof</option>
              <option value="zero_knowledge_validity_rollup">ZK Validity State Rollup</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Validator Agents</span>
              <span className="font-mono text-emerald-400">{nodeNetworkScale} Nodes</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              step="4"
              value={nodeNetworkScale}
              onChange={(e) => setNodeNetworkScale(parseInt(e.target.value, 10))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Network Jitter</span>
              <span className="font-mono text-cyan-400">{networkJitterMs} ms</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={networkJitterMs}
              onChange={(e) => setNetworkJitterMs(parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Byzantine Adversaries</span>
              <span className="font-mono text-amber-400">{(byzantineFaultToleranceRatio * 100).toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="0.33"
              step="0.01"
              value={byzantineFaultToleranceRatio}
              onChange={(e) => setByzantineFaultToleranceRatio(parseFloat(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>
        </div>

        {/* Results Metrics 4-Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Commit Latency</div>
            <div className="text-base font-bold font-mono text-emerald-400">{results.consensusCommitLatencyMs} ms</div>
            <div className="text-[9px] text-slate-500">Time to Finality</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Throughput</div>
            <div className="text-base font-bold font-mono text-cyan-400">{results.stateMachineThroughputTps.toLocaleString()} TPS</div>
            <div className="text-[9px] text-slate-500">Mutations/sec</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Byzantine Guard</div>
            <div className="text-base font-bold font-mono text-purple-400">{results.byzantineAttackMitigationPct}%</div>
            <div className="text-[9px] text-slate-500">Fault Tolerance</div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[10px] text-slate-400">Statutory Score</div>
            <div className="text-base font-bold font-mono text-emerald-300">{results.complianceScorePercent}%</div>
            <div className="text-[9px] text-slate-500">DPDP / Sec 63 BSA</div>
          </div>
        </div>

        {/* SVG Oscilloscope */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Activity className="w-3 h-3 text-emerald-400 " />
              <span>Consensus Latency & Byzantine Fault Oscilloscope</span>
            </div>
            <div className="flex items-center space-x-3 text-[9px]">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span>
                <span>Latency</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2 h-0.5 bg-purple-400 inline-block"></span>
                <span>Resistance</span>
              </span>
            </div>
          </div>
          <div className="h-20 w-full overflow-hidden">
            <svg viewBox="0 0 340 90" className="w-full h-full preserve-3d">
              <line x1="0" y1="45" x2="340" y2="45" stroke="#1e293b" strokeDasharray="3 3" />
              <path d={svgData.latencyPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              <path d={svgData.byzantinePath} fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="2 2" />
            </svg>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sovereign Private VPC Architecture</span>
          </div>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium transition"
          >
            Elesium Enterprise AI Solutions &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
