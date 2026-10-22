import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Network,
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
  ShieldCheck,
  GitMerge,
  Lock,
  Download
} from 'lucide-react';
import {
  simulateGraphConsensus,
  GraphConsensusInputs
} from '../calculator/agentGraphConsensusModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentGraphConsensusSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [consensusProtocol, setConsensusProtocol] = useState<'byzantine_asynchronous_bft' | 'directed_acyclic_graph_tangle' | 'optimistic_merkle_fraud_proof' | 'zero_knowledge_validity_rollup'>('byzantine_asynchronous_bft');
  const [nodeNetworkScale, setNodeNetworkScale] = useState<number>(16);
  const [networkJitterMs, setNetworkJitterMs] = useState<number>(35);
  const [byzantineFaultToleranceRatio, setByzantineFaultToleranceRatio] = useState<number>(0.15);
  const [transactionBatchSize, setTransactionBatchSize] = useState<number>(1000);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: GraphConsensusInputs = useMemo(() => ({
    consensusProtocol,
    nodeNetworkScale,
    networkJitterMs,
    byzantineFaultToleranceRatio,
    transactionBatchSize,
    currency
  }), [
    consensusProtocol,
    nodeNetworkScale,
    networkJitterMs,
    byzantineFaultToleranceRatio,
    transactionBatchSize,
    currency
  ]);

  const results = useMemo(() => {
    return simulateGraphConsensus(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-graph-consensus-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AUTONOMOUS AGENT ASYNCHRONOUS GRAPH CONSENSUS AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-graph-consensus-simulator)

DISTRIBUTED CONSENSUS SPECIFICATION:
- Protocol: ${consensusProtocol.replace(/_/g, ' ').toUpperCase()}
- Validator Cluster Scale: ${nodeNetworkScale} Autonomous Nodes
- Network Jitter: ${networkJitterMs} ms (Cross-Region WAN)
- Adversarial Node Tolerance: ${(byzantineFaultToleranceRatio * 100).toFixed(1)}% (Threshold: 33.3%)
- Transaction Batch Size: ${transactionBatchSize.toLocaleString()} State Mutations/Block

TELEMETRY & VERIFICATION BENCHMARKS:
- Commit Finality Latency: ${results.consensusCommitLatencyMs} ms
- State Machine Throughput: ${results.stateMachineThroughputTps.toLocaleString()} TPS
- Byzantine Attack Mitigation: ${results.byzantineAttackMitigationPct}%
- Merkle State Trie Proof Size: ${results.merkleTrieProofSizeKb} KB
- Statutory Compliance Index: ${results.complianceScorePercent}% (DPDP Act 2023 / Sec 63 BSA / RBI CSF)
- Annual Operational Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualConsensusSavings.toLocaleString()}
- Status Classification: ${results.statusClassification}

GOVERNANCE RECOMMENDATION:
Cluster operating within deterministic state invariants. Ready for sovereign production cutover.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 600;
    const height = 150;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latencyPath: '', byzPath: '', rawPoints: [] };

    const maxLatency = 300;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.commitLatencyMs / maxLatency) * (height * 0.75) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const byzPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.byzantineResistancePct / 100) * (height * 0.75) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const byzD = byzPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latencyPath: latD, byzPath: byzD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <Helmet>
        <title>Enterprise Agent Graph Consensus & State Verifier Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate asynchronous aBFT, DAG Hashgraph, and Merkle Patricia state trie consensus across autonomous multi-agent networks. Evaluate Byzantine fault tolerance and DPDP Act compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-graph-consensus-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="space-y-4 max-w-4xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Tool #36: Asynchronous Graph Consensus & Byzantine State Verifier</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Enterprise Autonomous Agent Asynchronous Graph Consensus Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
            Model distributed state verification, asynchronous aBFT gossip consensus, and Merkle Patricia trie proofs across
            multi-agent clusters. Prevent Byzantine poisoning and ensure legal admissibility under Section 63 BSA 2023.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Embed Calculator</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-700 transition"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Download className="w-4 h-4 text-emerald-400" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Consensus Parameters</h2>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition ${currency === 'INR' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded font-medium transition ${currency === 'USD' ? 'bg-emerald-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Protocol Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Distributed Consensus Protocol</span>
                <span className="text-[10px] text-slate-500 font-mono">BFT / DAG / ZK</span>
              </label>
              <select
                value={consensusProtocol}
                onChange={(e) => setConsensusProtocol(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition"
              >
                <option value="byzantine_asynchronous_bft">Asynchronous Byzantine Fault Tolerant (aBFT)</option>
                <option value="directed_acyclic_graph_tangle">Directed Acyclic Graph (DAG) Hashgraph Tangle</option>
                <option value="optimistic_merkle_fraud_proof">Optimistic Merkle State Trie Fraud Proof</option>
                <option value="zero_knowledge_validity_rollup">Zero-Knowledge (ZK-STARK) Validity Rollup</option>
              </select>
            </div>

            {/* Node Network Scale Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Validator Agent Nodes</span>
                <span className="font-mono text-emerald-400 font-bold">{nodeNetworkScale} Validator Nodes</span>
              </div>
              <input
                type="range"
                min="4"
                max="128"
                step="4"
                value={nodeNetworkScale}
                onChange={(e) => setNodeNetworkScale(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4 (Micro Cluster)</span>
                <span>64 (Regional Enterprise)</span>
                <span>128 (Global Mesh)</span>
              </div>
            </div>

            {/* Network Jitter Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Cross-Region Latency Jitter</span>
                <span className="font-mono text-cyan-400 font-bold">{networkJitterMs} ms</span>
              </div>
              <input
                type="range"
                min="5"
                max="150"
                step="5"
                value={networkJitterMs}
                onChange={(e) => setNetworkJitterMs(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 ms (Local VPC)</span>
                <span>50 ms (Pan-India WAN)</span>
                <span>150 ms (Cross-Border)</span>
              </div>
            </div>

            {/* Byzantine Adversaries Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Adversarial Byzantine Ratio</span>
                <span className="font-mono text-amber-400 font-bold">{(byzantineFaultToleranceRatio * 100).toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.33"
                step="0.01"
                value={byzantineFaultToleranceRatio}
                onChange={(e) => setByzantineFaultToleranceRatio(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.0% (Zero Byzantine)</span>
                <span>20.0% (Hardened)</span>
                <span>33.3% (BFT Upper Bound)</span>
              </div>
            </div>

            {/* Transaction Batch Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Transaction Batch Size</span>
                <span className="font-mono text-emerald-400 font-bold">{transactionBatchSize.toLocaleString()} Mutations/Epoch</span>
              </div>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={transactionBatchSize}
                onChange={(e) => setTransactionBatchSize(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50</span>
                <span>2,500</span>
                <span>5,000</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Status Banner */}
            <div className={`p-5 rounded-2xl border backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              results.statusClassification === 'DETERMINISTIC_CONSENSUS_FINALITY'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : results.statusClassification === 'BYZANTINE_FAULT_ISOLATED'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <Network className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Consensus Integrity Verdict</div>
                  <div className="text-base font-bold text-white tracking-tight">{results.statusClassification.replace(/_/g, ' ')}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Statutory Score</div>
                <div className="text-xl font-mono font-bold text-emerald-400">{results.complianceScorePercent}%</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Commit Finality</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">{results.consensusCommitLatencyMs} ms</div>
                <div className="text-[10px] text-slate-500 mt-1">Round-trip to state commitment</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>State Throughput</span>
                </div>
                <div className="text-2xl font-black font-mono text-cyan-400">{results.stateMachineThroughputTps.toLocaleString()} TPS</div>
                <div className="text-[10px] text-slate-500 mt-1">Mutations / second</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>Byzantine Guard</span>
                </div>
                <div className="text-2xl font-black font-mono text-purple-400">{results.byzantineAttackMitigationPct}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Poisoning & collision defense</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Merkle Trie Proof</span>
                </div>
                <div className="text-2xl font-black font-mono text-amber-400">{results.merkleTrieProofSizeKb} KB</div>
                <div className="text-[10px] text-slate-500 mt-1">Proof payload payload size</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Statutory Admissibility</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-300">{results.complianceScorePercent}%</div>
                <div className="text-[10px] text-slate-500 mt-1">Section 63 BSA / DPDP Act</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                  <GitMerge className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Annual Consensus ROI</span>
                </div>
                <div className="text-2xl font-black font-mono text-emerald-400">
                  {currency === 'INR' ? '₹' : '$'}{results.annualConsensusSavings.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Saved vs public blockchain gas</div>
              </div>
            </div>

            {/* SVG Oscilloscope Section */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-400 " />
                  <span className="text-xs font-bold text-white tracking-wide">Asynchronous Gossip & Fault Tolerance Telemetry</span>
                </div>
                <div className="flex items-center space-x-4 text-[10px]">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-1 bg-emerald-400 inline-block rounded-full"></span>
                    <span className="text-slate-300">Commit Latency (ms)</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-1 bg-purple-400 inline-block rounded-full"></span>
                    <span className="text-slate-300">Byzantine Defense (%)</span>
                  </span>
                </div>
              </div>

              <div className="h-40 w-full overflow-hidden relative">
                <svg viewBox="0 0 600 150" className="w-full h-full preserve-3d">
                  <line x1="0" y1="75" x2="600" y2="75" stroke="#1e293b" strokeDasharray="4 4" />
                  <path d={svgData.latencyPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  <path d={svgData.byzPath} fill="none" stroke="#c084fc" strokeWidth="2" strokeDasharray="3 3" />
                </svg>
              </div>

              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/60 text-center font-mono text-[10px]">
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Epoch: </span><span className="text-white font-bold">12 Active</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Trie Hash: </span><span className="text-emerald-400 font-bold">0x7f9a...3c</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>BFT Quorum: </span><span className="text-cyan-400 font-bold">&gt; 66.7%</span>
                </div>
                <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800 text-slate-400">
                  <span>Audit Sync: </span><span className="text-purple-400 font-bold">SHA-256</span>
                </div>
              </div>
            </div>

            {/* Direct Consultation CTA Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Deploy BFT Graph Consensus in Your Sovereign VPC</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Eliminate state conflicts, verify sub-200ms ERP mutations, and satisfy DPDP Act 2023 requirements.
                  </p>
                </div>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center space-x-2 shrink-0 cursor-pointer">
                    <span>Schedule Architecture Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="p-6 sm:p-10 max-w-2xl mx-auto">
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Documentation */}
        <div className="pt-8 border-t border-slate-800 space-y-8">
          <div className="max-w-3xl space-y-3">
            <h2 className="text-2xl font-bold text-white">Architectural Principles: Byzantine Consensus for Autonomous AI</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              When autonomous multi-agent swarms execute high-stakes operational workflows—such as real-time banking transfers,
              SAP inventory allocations, or industrial supply chain dispatches—monolithic single-agent decisions introduce catastrophic
              single points of failure. The Elesium Graph Consensus protocol enforces formal mathematical agreement before state mutations
              are committed to core ledgers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-emerald-400">1. Asynchronous BFT (3f + 1)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Byzantine agreement guarantees liveness and safety even if up to one-third of autonomous agents suffer from
                hallucinations, network partitions, or prompt-injection poisoning attacks.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-cyan-400">2. Merkle Patricia State Tries</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every state transition generates a cryptographic Merkle root hash. Changes can be formally verified with logarithmic
                sub-kilobyte proofs, ensuring instant auditability without replaying historical telemetry.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-purple-400">3. Section 63 BSA Legal Admissibility</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Complies with Section 63 of India's Bharatiya Sakshya Adhiniyam 2023 for digital electronic evidence. All committed
                actions produce immutable SHA-256 receipts signed by validator keys in private VPC enclaves.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive FAQ Accordion */}
        <div className="pt-8 border-t border-slate-800 space-y-4">
          <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: 'Why do multi-agent enterprise systems require Byzantine consensus?',
                a: 'LLM agents are stochastic by nature and vulnerable to hallucinations or prompt injection. When multiple agents independently verify an invoice or wire transfer, a Byzantine consensus mechanism guarantees that no action executes unless a mathematical quorum (e.g., >66.7%) of independent agents confirms the exact same invariant state.'
              },
              {
                q: 'What is the latency impact of Asynchronous BFT on real-time enterprise operations?',
                a: 'Within a private VPC or Indian colocation cluster (e.g. AWS ap-south-1), packet roundtrips are under 5ms. Under our optimized aBFT implementation, consensus is achieved in under 45ms, adding negligible overhead while delivering cryptographic state finality.'
              },
              {
                q: 'How does this compare to public blockchains like Ethereum or Solana?',
                a: 'Public blockchains impose volatile gas fees (₹50 to ₹1,500 per transaction), public data exposure hazards, and throughput bottlenecks. Elesium private graph consensus operates strictly within your sovereign air-gapped infrastructure with zero per-transaction token costs, processing up to 16,000 TPS.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl bg-slate-900/40 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Embed Modal */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Code className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Embed Simulator on Your Website</h3>
                </div>
                <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-400">
                Copy and paste this clean iframe code to embed the interactive Graph Consensus Simulator on your internal portal or technical documentation:
              </p>
              <textarea
                readOnly
                value={embedCode}
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-emerald-300 focus:outline-none"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                >
                  Close
                </button>
                <button
                  onClick={copyEmbedCode}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center space-x-1.5"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exit Intent Executive Memo Modal */}
        <ExitIntentMemoModal
          toolName="Asynchronous Graph Consensus & State Verifier"
          simulatedMetrics={[
            { label: 'Commit Finality Latency', value: `${results.consensusCommitLatencyMs} ms` },
            { label: 'State Throughput', value: `${results.stateMachineThroughputTps.toLocaleString()} TPS` },
            { label: 'Byzantine Attack Mitigation', value: `${results.byzantineAttackMitigationPct}%` },
            { label: 'Statutory Score', value: `${results.complianceScorePercent}%` }
          ]}
        />
      </div>
          <WhatsAppModal />
    </div>
  );
}
