import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldAlert,
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Activity,
  Lock,
  Network,
  Cpu
} from 'lucide-react';
import {
  simulateByzantineConsensus,
  ByzantineConsensusInputs
} from '../calculator/agentByzantineConsensusModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentByzantineConsensusSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [totalNodes, setTotalNodes] = useState<number>(20);
  const [byzantineNodes, setByzantineNodes] = useState<number>(4);
  const [attackVector, setAttackVector] = useState<'sign_flip' | 'backdoor_injection' | 'extreme_variance' | 'collusive_stealth'>('sign_flip');
  const [aggregationAlgorithm, setAggregationAlgorithm] = useState<'fedavg' | 'coordinate_median' | 'trimmed_mean' | 'multi_krum' | 'bulyan'>('bulyan');
  const [secAggEnabled, setSecAggEnabled] = useState<boolean>(true);
  const [secretSharingThresholdT, setSecretSharingThresholdT] = useState<number>(14);
  const [gradientDimensions, setGradientDimensions] = useState<number>(500000);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ByzantineConsensusInputs = useMemo(() => ({
    totalNodes,
    byzantineNodes,
    attackVector,
    aggregationAlgorithm,
    secAggEnabled,
    secretSharingThresholdT,
    gradientDimensions,
    currency
  }), [
    totalNodes,
    byzantineNodes,
    attackVector,
    aggregationAlgorithm,
    secAggEnabled,
    secretSharingThresholdT,
    gradientDimensions,
    currency
  ]);

  const results = useMemo(() => {
    return simulateByzantineConsensus(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-byzantine-consensus-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe>
<div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT FEDERATED SECURE AGGREGATION & BYZANTINE CONSENSUS AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-byzantine-consensus-simulator)

FEDERATED TOPOLOGY & THREAT MODEL:
- Total Participant Nodes (N): ${totalNodes}
- Compromised / Byzantine Nodes (f): ${byzantineNodes} (${results.byzantineRatioPercent}% adversarial fraction)
- Active Attack Vector: ${attackVector.replace('_', ' ').toUpperCase()}
- Aggregation Algorithm: ${aggregationAlgorithm.toUpperCase()}
- Secure Aggregation (SecAgg): ${secAggEnabled ? 'ENABLED (Shamir Secret Sharing + DH Masks)' : 'DISABLED (Raw Gradients Exposed)'}
- Shamir Reconstruction Threshold (t): ${secretSharingThresholdT}
- Parameter Dimensions (D): ${gradientDimensions.toLocaleString()}

BYZANTINE TOLERANCE & CONVERGENCE BENCHMARKS:
- Byzantine Fault Tolerance Condition: ${results.toleranceConditionSatisfied ? 'SATISFIED (Resilient against f <= ' + results.maxTolerableByzantineNodes + ')' : 'VIOLATED (Breakdown Threshold Exceeded!)'}
- Max Tolerable Byzantine Nodes (f_max): ${results.maxTolerableByzantineNodes}
- Model Convergence Degradation: ${results.modelConvergenceDegradationPercent}%
- Poisoning Attack Success Rate: ${results.poisoningSuccessProbabilityPercent}%
- Raw Gradient Privacy Leakage: ${results.rawGradientPrivacyLeakagePercent}%
- Cryptographic Masking Overhead: ${results.pairwiseBlindingOverheadKb} KB
- Total Round Latency: ${results.roundLatencyMs}ms
- L2 Gradient Error Norm: ${results.gradientErrorNormL2}
- Statutory Compliance Score: ${results.statutoryComplianceScore}/100
- Annual Financial Breach Liability Prevented: ${currency === 'INR' ? '₹' : '$'}${results.annualLossPrevented.toLocaleString()}

ARCHITECTURAL RECOMMENDATION:
${results.toleranceConditionSatisfied
  ? 'Topology is cryptographically and mathematically robust. The ' + aggregationAlgorithm.toUpperCase() + ' aggregator eliminates Byzantine gradients while SecAgg ensures zero plaintext gradient leakage under India DPDP Act 2023 Section 8(4).'
  : 'CRITICAL ALERT: Malicious nodes (' + byzantineNodes + ') exceed the theoretical breakdown limit (' + results.maxTolerableByzantineNodes + ') for ' + aggregationAlgorithm.toUpperCase() + '. The consensus model will diverge or absorb poisoning payloads. Immediately upgrade to Bulyan or reduce participant untrusted quorum.'}`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Federated Secure Aggregation & Byzantine-Tolerant Consensus Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Byzantine-tolerant aggregation (Multi-Krum, Bulyan, Trimmed Mean) and cryptographic Secure Aggregation (SecAgg) across enterprise federated multi-agent networks. Verify poisoning resistance and DPDP Act 2023 compliance."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-byzantine-consensus-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Breadcrumbs & Title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-sm text-neutral-200 font-mono">
            <a href="/solutions/" className="hover:underline">Solutions</a>
            <span>/</span>
            <a href="/resources/" className="hover:underline">Tools</a>
            <span>/</span>
            <span className="text-neutral-400">Byzantine Consensus & SecAgg Simulator</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-neutral-800 pb-8">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/[0.05] border border-white/15 text-white text-xs font-semibold uppercase tracking-wider">
                <Network className="w-3.5 h-3.5 mr-1" />
                Tool #30 · Distributed AI Consensus & Cryptography
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Enterprise Agent Federated Secure Aggregation & Byzantine-Tolerant Consensus Simulator
              </h1>
              <p className="text-neutral-400 text-base leading-relaxed">
                Benchmark multi-agent federated learning resilience against gradient poisoning attacks, sign-flipping, and covert backdoors.
                Simulate cryptographic Secure Aggregation (SecAgg via Shamir Secret Sharing) and Byzantine-robust aggregation algorithms (Multi-Krum, Bulyan, Trimmed Mean).
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
                className="active:scale-[0.97] px-3.5 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white text-xs font-mono font-medium transition"
              >
                Currency: <span className="text-white font-bold">{currency}</span>
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="active:scale-[0.97] inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 text-xs font-medium transition"
              >
                <Code className="w-4 h-4 text-neutral-200" />
                <span>Embed Tool</span>
              </button>
              <button
                onClick={copyExecutiveMemo}
                className="active:scale-[0.97] inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-medium shadow-lg transition"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Status Alert Banner */}
        <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${
          results.statusClassification === 'OPTIMAL_RESILIENT'
            ? 'bg-white/[0.05] border-white/15 text-neutral-200'
            : results.statusClassification === 'MARGINAL_RISK'
            ? 'bg-amber-950/30 border-amber-800/50 text-amber-300'
            : 'bg-red-950/30 border-red-800/50 text-red-300'
        }`}>
          <div className="flex items-center space-x-3">
            {results.toleranceConditionSatisfied ? (
              <ShieldCheck className="w-6 h-6 shrink-0" />
            ) : (
              <ShieldAlert className="w-6 h-6 shrink-0" />
            )}
            <div>
              <p className="font-semibold text-sm">
                Byzantine Fault Tolerance Status: {results.statusClassification.replace(/_/g, ' ')}
              </p>
              <p className="text-xs opacity-90">
                {results.toleranceConditionSatisfied
                  ? `Active algorithm (${aggregationAlgorithm.toUpperCase()}) guarantees resilience up to f <= ${results.maxTolerableByzantineNodes} malicious nodes. Current f = ${byzantineNodes}.`
                  : `Adversarial breakdown! Algorithm (${aggregationAlgorithm.toUpperCase()}) only supports f <= ${results.maxTolerableByzantineNodes}. Current f = ${byzantineNodes} induces model collapse.`}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-black/40 border border-current shrink-0">
            DPDP Compliance: {results.statutoryComplianceScore}/100
          </span>
        </div>

        {/* Main Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6 bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
              <Sliders className="w-5 h-5 text-neutral-200" />
              <h2 className="text-base font-semibold text-white">Federated Consensus Parameters</h2>
            </div>

            {/* Total Participant Nodes Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-medium">Total Federated Nodes (N):</span>
                <span className="font-mono text-white font-bold">{totalNodes} Nodes</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={totalNodes}
                onChange={e => {
                  const val = Number(e.target.value);
                  setTotalNodes(val);
                  if (byzantineNodes >= val) setByzantineNodes(Math.floor(val / 3));
                  if (secretSharingThresholdT > val) setSecretSharingThresholdT(Math.floor(val * 0.7));
                }}
                className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>5 (Edge Cluster)</span>
                <span>20 (Standard Fleet)</span>
                <span>50 (Cross-Silo Hub)</span>
              </div>
            </div>

            {/* Byzantine Malicious Nodes Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-medium">Byzantine / Poisoned Nodes (f):</span>
                <span className="font-mono text-red-400 font-bold">{byzantineNodes} Nodes ({results.byzantineRatioPercent}%)</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.min(20, totalNodes - 1)}
                step="1"
                value={byzantineNodes}
                onChange={e => setByzantineNodes(Number(e.target.value))}
                className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                <span>0 (Honest Quorum)</span>
                <span>Breakdown Limit: {results.maxTolerableByzantineNodes}</span>
                <span>{Math.min(20, totalNodes - 1)} (Hostile)</span>
              </div>
            </div>

            {/* Attack Vector Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-medium block">Adversarial Poisoning Attack Vector:</label>
              <select
                value={attackVector}
                onChange={e => setAttackVector(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-white/40"
              >
                <option value="sign_flip">Sign Flipping Attack (Gradient Inversion ∇W → -∇W)</option>
                <option value="backdoor_injection">Targeted Backdoor Injection (Covert Latent Trigger)</option>
                <option value="extreme_variance">Extreme Variance Explosion (Unbounded Noise Shock)</option>
                <option value="collusive_stealth">Collusive Stealth Vector (Multi-Node Coordinated Push)</option>
              </select>
            </div>

            {/* Aggregation Algorithm Dropdown */}
            <div className="space-y-2">
              <label className="text-xs text-neutral-300 font-medium block">Byzantine Aggregation Algorithm:</label>
              <select
                value={aggregationAlgorithm}
                onChange={e => setAggregationAlgorithm(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs font-mono text-neutral-200 focus:outline-none focus:border-white/40"
              >
                <option value="fedavg">Federated Averaging / FedAvg (Naive Mean - Zero Tolerance f=0)</option>
                <option value="coordinate_median">Coordinate-wise Median (Resilient to f &lt; N/2)</option>
                <option value="trimmed_mean">Trimmed Mean (β-trimmed Coordinate Rejection)</option>
                <option value="multi_krum">Multi-Krum (Euclidean Neighborhood Pre-selection)</option>
                <option value="bulyan">Bulyan (Military-Grade: Krum Selection + Trimmed Mean)</option>
              </select>
            </div>

            {/* SecAgg Toggle & Threshold */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-neutral-200" />
                  <span className="text-xs font-semibold text-white">Cryptographic Secure Aggregation (SecAgg)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSecAggEnabled(!secAggEnabled)}
                  className={`active:scale-[0.97] w-11 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                    secAggEnabled ? 'bg-white/80 justify-end' : 'bg-neutral-700 justify-start'
                  }`}
                >
                  <div className="bg-white w-4 h-4 rounded-full shadow-md transform transition" />
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 leading-normal">
                Applies pairwise Diffie-Hellman blinding masks and Shamir (t, n) threshold secret sharing so the central coordinator only observes the sum.
              </p>

              {secAggEnabled && (
                <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-400">Shamir Reconstruction Threshold (t):</span>
                    <span className="font-mono text-white font-bold">{secretSharingThresholdT} of {totalNodes}</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max={totalNodes}
                    step="1"
                    value={secretSharingThresholdT}
                    onChange={e => setSecretSharingThresholdT(Number(e.target.value))}
                    className="w-full accent-white h-1 bg-neutral-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Parameter Dimensions */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-300 font-medium">Model Parameter Dimensions (D):</span>
                <span className="font-mono text-white font-bold">{gradientDimensions.toLocaleString()} floats</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[100000, 500000, 2000000].map(dims => (
                  <button
                    key={dims}
                    type="button"
                    onClick={() => setGradientDimensions(dims)}
                    className={`active:scale-[0.97] py-1.5 rounded-lg border text-xs font-mono transition ${
                      gradientDimensions === dims
                        ? 'bg-white/[0.05] border-white/30 text-white font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {dims >= 1000000 ? `${dims / 1000000}M Params` : `${dims / 1000}K Params`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization & Metrics Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Real-time SVG Vector Space Scatter Plot */}
            <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-neutral-200" />
                  <h3 className="text-base font-semibold text-white">Gradient Vector Space & Byzantine Rejection</h3>
                </div>
                <div className="flex items-center space-x-4 text-xs font-mono">
                  <span className="flex items-center space-x-1.5 text-neutral-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                    <span>Honest ({totalNodes - byzantineNodes})</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-red-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                    <span>Byzantine ({byzantineNodes})</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-neutral-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-400 inline-block" />
                    <span>Centroid</span>
                  </span>
                </div>
              </div>

              {/* Interactive SVG Canvas */}
              <div className="relative w-full aspect-[16/10] bg-neutral-950 rounded-xl border border-neutral-800/80 overflow-hidden flex items-center justify-center p-4">
                <svg viewBox="-120 -100 240 200" className="w-full h-full">
                  {/* Grid lines */}
                  <line x1="-120" y1="0" x2="120" y2="0" stroke="#262626" strokeWidth="0.8" strokeDasharray="3,3" />
                  <line x1="0" y1="-100" x2="0" y2="100" stroke="#262626" strokeWidth="0.8" strokeDasharray="3,3" />
                  <circle cx="0" cy="0" r="30" fill="none" stroke="#262626" strokeWidth="0.8" strokeDasharray="2,2" />
                  <circle cx="0" cy="0" r="60" fill="none" stroke="#262626" strokeWidth="0.8" strokeDasharray="2,2" />

                  {/* Trimmed / Rejection Region Ring */}
                  {aggregationAlgorithm !== 'fedavg' && (
                    <circle
                      cx="0"
                      cy="0"
                      r={aggregationAlgorithm === 'bulyan' ? 45 : 55}
                      fill="rgba(6, 182, 212, 0.04)"
                      stroke="rgba(6, 182, 212, 0.3)"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                  )}

                  {/* Connecting lines from rejected nodes to centroid */}
                  {results.nodePlots.map(node => (
                    <line
                      key={`line-${node.id}`}
                      x1={node.x}
                      y1={node.y}
                      x2={results.consensusCentroid.x}
                      y2={results.consensusCentroid.y}
                      stroke={node.isTrimmedOrRejected ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.2)'}
                      strokeWidth={node.isTrimmedOrRejected ? '0.5' : '0.8'}
                    />
                  ))}

                  {/* Render Nodes */}
                  {results.nodePlots.map(node => (
                    <g key={`node-${node.id}`} className="transition-all duration-300">
                      {/* Rejected Cross Halo */}
                      {node.isTrimmedOrRejected && (
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="6.5"
                          fill="none"
                          stroke="#a3a3a3"
                          strokeWidth="1.2"
                          strokeDasharray="2,2"
                        />
                      )}
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.isByzantine ? '4.5' : '3.8'}
                        fill={node.isByzantine ? '#ef4444' : '#ffffff'}
                        stroke="#0a0a0a"
                        strokeWidth="1.5"
                      />
                      <text
                        x={node.x + 5}
                        y={node.y + 3}
                        fontSize="6"
                        fill={node.isByzantine ? '#ef4444' : '#a3a3a3'}
                        fontFamily="monospace"
                      >
                        {node.isByzantine ? `B${node.id}` : `N${node.id}`}
                      </text>
                    </g>
                  ))}

                  {/* Consensus Centroid Marker */}
                  <g>
                    <circle
                      cx={results.consensusCentroid.x}
                      cy={results.consensusCentroid.y}
                      r="7"
                      fill="rgba(6, 182, 212, 0.25)"
                      className=""
                    />
                    <circle
                      cx={results.consensusCentroid.x}
                      cy={results.consensusCentroid.y}
                      r="4"
                      fill="#ffffff"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                    <text
                      x={results.consensusCentroid.x + 8}
                      y={results.consensusCentroid.y + 4}
                      fontSize="7"
                      fontWeight="bold"
                      fill="#ffffff"
                      fontFamily="monospace"
                    >
                      Centroid ({results.consensusCentroid.x}, {results.consensusCentroid.y})
                    </text>
                  </g>
                </svg>

                {/* Overlaid Summary Badge */}
                <div className="absolute bottom-3 left-3 bg-neutral-900/90 border border-neutral-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-neutral-300">
                  L2 Gradient Deviation: <span className="text-white font-bold">{results.gradientErrorNormL2}</span>
                </div>
              </div>
            </div>

            {/* Key Output Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Convergence Degradation</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  results.modelConvergenceDegradationPercent < 10
                    ? 'text-neutral-200'
                    : results.modelConvergenceDegradationPercent < 25
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}>
                  {results.modelConvergenceDegradationPercent}%
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">Accuracy loss vs clean</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Poisoning Success Rate</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  results.poisoningSuccessProbabilityPercent < 5
                    ? 'text-neutral-200'
                    : results.poisoningSuccessProbabilityPercent < 25
                    ? 'text-amber-400'
                    : 'text-red-400'
                }`}>
                  {results.poisoningSuccessProbabilityPercent}%
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">Adversary backdoor absorption</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Raw Gradient Leakage</span>
                <span className={`text-2xl font-extrabold font-mono ${
                  results.rawGradientPrivacyLeakagePercent === 0
                    ? 'text-neutral-200'
                    : 'text-red-400'
                }`}>
                  {results.rawGradientPrivacyLeakagePercent}%
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  {secAggEnabled ? 'Cryptographically zero' : 'High PII exfiltration risk'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">SecAgg Mask Overhead</span>
                <span className="text-2xl font-extrabold font-mono text-neutral-200">
                  {results.pairwiseBlindingOverheadKb} KB
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">Pairwise Diffie-Hellman keys</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Round Execution Latency</span>
                <span className="text-2xl font-extrabold font-mono text-neutral-200">
                  {results.roundLatencyMs} ms
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">Compute + crypto verification</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Annual Loss Prevented</span>
                <span className="text-2xl font-extrabold font-mono text-neutral-200">
                  {currency === 'INR' ? '₹' : '$'}{(results.annualLossPrevented / (currency === 'INR' ? 10000000 : 1000000)).toFixed(1)}
                  {currency === 'INR' ? ' Cr' : 'M'}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">DPDP statutory breach ceiling</span>
              </div>
            </div>

            {/* Turnkey Deployment Card */}
            <div className="p-6 rounded-xl bg-neutral-950 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-lg font-bold text-white">Deploy Sovereign Byzantine-Tolerant Consensus</h4>
                <p className="text-xs text-neutral-400 max-w-md">
                  Deploy hardened multi-agent federated learning clusters with Bulyan Byzantine filtering and Shamir-masked SecAgg inside your private AWS/GCP/Azure VPC.
                </p>
              </div>
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-lg transition flex items-center space-x-2 shrink-0">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <div className="max-w-2xl mx-auto p-6 space-y-6">
                    <h3 className="text-2xl font-bold text-white">Schedule Private VPC Federated Consensus Audit</h3>
                    <p className="text-sm text-neutral-400">
                      Engage Elesium's Principal AI Systems Architects to audit your distributed multi-agent pipelines for gradient poisoning vulnerability, Byzantine resilience, and DPDP compliance.
                    </p>
                    <MandateApplicationForm />
                  </div>
                </ExpandableScreenContent>
              </ExpandableScreen>
            </div>
          </div>
        </div>

        {/* Technical Architecture & Algorithm Reference */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-8 backdrop-blur-sm space-y-6">
          <div className="border-b border-neutral-800 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-neutral-200" />
              <span>Mathematical Foundations: Byzantine Tolerance & Cryptographic SecAgg</span>
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              Formal breakdown conditions and pairwise masking mathematics governing distributed autonomous agent swarms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-neutral-300">
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">1. Byzantine Aggregator Breakdown Limits</h4>
              <p>
                In a federated network of N participant agents where f nodes are compromised, standard mean aggregation (FedAvg) fails catastrophically if f &ge; 1, since a single adversarial agent can submit an arbitrary gradient shock to corrupt the global model.
              </p>
              <ul className="space-y-1.5 list-disc list-inside text-neutral-400">
                <li><strong className="text-neutral-200">Coordinate-wise Median & Trimmed Mean:</strong> Tolerates up to $f &lt; N/2$ by independently sorting coordinate values across dimensions.</li>
                <li><strong className="text-neutral-200">Multi-Krum:</strong> Selects vectors that minimize the sum of Euclidean distances to their $N - f - 2$ nearest neighbors, requiring $2f + 2 &lt; N$.</li>
                <li><strong className="text-neutral-200">Bulyan:</strong> Combines Krum pre-selection with coordinate-wise trimmed mean, achieving the strongest defense against collusive stealth attacks when $4f + 3 \le N$.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white">2. Pairwise Blinding & Threshold Shamir Secret Sharing</h4>
              <p>
                To prevent the central aggregator from inspecting raw gradients (which permits Deep Leakage from Gradients reconstruction), Secure Aggregation (SecAgg) requires every node i to add zero-sum pairwise masks s(i,j) with all peer nodes j:
              </p>
              <div className="p-3 rounded-lg bg-neutral-950 font-mono text-[11px] text-neutral-200 border border-neutral-800">
                {"\\sum_{i \\in U_1} x_i^{masked} = \\sum_{i \\in U_1} x_i + \\sum_{i, j \\in U_1, i < j} (s_{i,j} - s_{j,i}) = \\sum_{i \\in U_1} x_i"}
              </div>
              <p className="text-neutral-400">
                If a node drops out before completion, Shamir's $(t, n)$ polynomial secret sharing allows remaining nodes to reconstruct only the missing masks without exposing individual participant updates.
              </p>
            </div>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <div className="bg-neutral-900/60 border border-neutral-800/80 rounded-xl p-8 backdrop-blur-sm space-y-4">
          <h3 className="text-lg font-bold text-white mb-2">Frequently Asked Technical Questions</h3>
          <div className="space-y-3">
            {[
              {
                q: "Why is FedAvg incapable of handling Byzantine attacks in enterprise agent systems?",
                a: "FedAvg computes an unweighted arithmetic mean across all participant updates. An adversarial node can submit inverted or arbitrarily large gradient vectors that skew the global centroid, causing catastrophic divergence or embedding persistent backdoors into production foundation models."
              },
              {
                q: "What makes Bulyan superior to standard Multi-Krum in high-stakes environments?",
                a: "While Multi-Krum successfully avoids selecting extreme outliers, adversaries can craft subtle, coordinated vectors that pull the chosen Krum model toward a malicious direction. Bulyan overcomes this by running Multi-Krum iteratively to select a trusted subset of vectors, then applying coordinate-wise trimmed mean across that subset to neutralize any residual stealth bias."
              },
              {
                q: "How does SecAgg satisfy India's Digital Personal Data Protection (DPDP) Act 2023?",
                a: "Section 8(4) of the DPDP Act mandates technical safeguards preventing unauthorized disclosure or exfiltration of personal data. Unmasked gradients can be reversed via gradient inversion attacks to reconstruct patient health records or financial transactions. SecAgg cryptographically ensures that no server or peer ever observes plaintext gradients, ensuring full statutory compliance."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-neutral-200 hover:text-white transition"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transform transition-transform ${openFaq === idx ? 'rotate-180 text-neutral-200' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code className="w-4 h-4 text-neutral-200" />
                <span>Embed Byzantine Consensus Simulator</span>
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] text-neutral-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Embed this interactive simulator on your technical blog or developer documentation with an automatic watermark backlink to Elesium.
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={embedCode}
                className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-[11px] font-mono text-neutral-200 focus:outline-none resize-none"
              />
              <button
                onClick={copyEmbedCode}
                className="active:scale-[0.97] absolute top-2 right-2 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black text-[11px] font-semibold flex items-center space-x-1 transition shadow"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
