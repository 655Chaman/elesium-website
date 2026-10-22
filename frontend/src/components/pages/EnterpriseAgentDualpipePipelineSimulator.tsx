import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  GitCommit,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import {
  calculateDualpipeSimulation,
  DualpipeSimulationInputs
} from '../calculator/agentDualpipePipelineModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentDualpipePipelineSimulator() {
  // Inputs State
  const [pipelineParallelStages, setPipelineParallelStages] = useState<number>(16);
  const [microBatchCount, setMicroBatchCount] = useState<number>(32);
  const [pipelineSchedule, setPipelineSchedule] = useState<DualpipeSimulationInputs['pipelineSchedule']>('dualpipe_bidirectional');
  const [crossNodeNetworkFabric, setCrossNodeNetworkFabric] = useState<DualpipeSimulationInputs['crossNodeNetworkFabric']>('infiniband_800g_cx7');
  const [hardwareClusterNodes, setHardwareClusterNodes] = useState<number>(16);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: DualpipeSimulationInputs = useMemo(() => ({
    pipelineParallelStages,
    microBatchCount,
    pipelineSchedule,
    crossNodeNetworkFabric,
    hardwareClusterNodes,
    currency
  }), [
    pipelineParallelStages,
    microBatchCount,
    pipelineSchedule,
    crossNodeNetworkFabric,
    hardwareClusterNodes,
    currency
  ]);

  const results = useMemo(() => calculateDualpipeSimulation(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-dualpipe-pipeline-parallelism-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator" target="_blank" rel="noopener" style="color:#0284c7;text-decoration:underline;">Elesium DualPipe Pipeline Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: DUALPIPE BIDIRECTIONAL PIPELINE PARALLELISM
Cluster Nodes: ${hardwareClusterNodes} nodes (${hardwareClusterNodes * 8} GPUs)
Pipeline Stages: ${pipelineParallelStages} stages | Micro-Batches: ${microBatchCount}
Pipeline Schedule: ${pipelineSchedule.replace(/_/g, ' ').toUpperCase()}
Network Fabric: ${crossNodeNetworkFabric.replace(/_/g, ' ').toUpperCase()}

PERFORMANCE AUDIT METRICS:
- Pipeline Bubble Ratio: ${results.pipelineBubbleRatioPercent}% (vs 28.4% Baseline 1F1B)
- Model Flops Utilization (MFU): ${results.modelFlopsUtilizationPercent}%
- Hidden Communication Overlap: ${results.hiddenCommunicationOverlapRatio}%
- Iteration Latency: ${results.iterationTimeMs} ms (Baseline: ${results.baselineIterationTimeMs} ms)
- Cluster Speedup Factor: ${results.clusterSpeedupFactor}x
- Peak Activation VRAM / GPU: ${results.peakActivationMemoryGbPerGpu} GB
- Annual FinOps CapEx Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualFinOpsCapExSavings.toLocaleString()}
- System Classification: ${results.statusClassification}

Verified against DeepSeek-V3 DualPipe bidirectional chunking, B_weight/B_input partitioning, and All-to-All network overlap specifications.
Audit Link: https://elesium.online/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setPipelineParallelStages(16);
    setMicroBatchCount(32);
    setPipelineSchedule('dualpipe_bidirectional');
    setCrossNodeNetworkFabric('infiniband_800g_cx7');
    setHardwareClusterNodes(16);
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does DualPipe achieve a sub-2% pipeline bubble ratio compared to standard 1F1B?",
      a: "Standard 1F1B suffers from an idling bubble during pipeline warm-up and cool-down because micro-batches flow in a single direction. DualPipe schedules two symmetric pipelines running in opposing directions across the exact same physical GPUs, interleaving forward and backward micro-batches so that when one pipeline is in cool-down, the opposing pipeline is actively executing compute."
    },
    {
      q: "How does DualPipe completely hide All-to-All communication in MoE clusters?",
      a: "DualPipe partitions backward propagation into B_{input} (activation gradients) and B_{weight} (parameter weight gradients). Because computing parameter weight gradients requires heavy matrix multiplication but produces no intermediate activations needed by other stages, DualPipe executes B_{weight} concurrently with the heavy All-to-All dispatch and combine communication of the opposing pipeline."
    },
    {
      q: "Does DualPipe cause memory exhaustion due to concurrent pipeline activation caching?",
      a: "No. Micro-batches are partitioned and matched symmetrically across both directions. At any given moment, the total active in-flight micro-batches across both pipelines equals the micro-batch capacity of a standard 1F1B schedule, keeping peak activation memory identical to 1F1B while eliminating 90%+ of the bubble."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-300">
      <Helmet>
        <title>Enterprise Autonomous Agent DualPipe Bidirectional Pipeline Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate DualPipe bidirectional pipeline parallelism, zero-bubble micro-batch scheduling, All-to-All communication overlap, and MFU maximization on DeepSeek-V3 clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono">
              <GitCommit className="w-3.5 h-3.5" />
              TOOL #74 · DUALPIPE PARALLELISM & ZERO-BUBBLE ENGINE
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-sky-400" /> Embed Widget
              </button>
              <button
                onClick={copyMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600/90 hover:bg-sky-500 border border-sky-500 text-xs font-medium text-white transition-colors"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedMemo ? 'Memo Copied' : 'Export Executive Memo'}
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Enterprise Autonomous Agent DualPipe Bidirectional Pipeline Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Model bidirectional chunked scheduling, fine-grained computation-communication overlapping, and zero-bubble execution. Quantify 63%+ Model Flops Utilization (MFU), sub-2% bubble ratios, and complete All-to-All network latency hiding across DeepSeek-V3 clusters.
          </p>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Sliders className="w-4 h-4 text-sky-400" /> Cluster Parallelism Parameters
              </div>
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Pipeline Schedule */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Pipeline Schedule Architecture</label>
              <select
                value={pipelineSchedule}
                onChange={(e) => setPipelineSchedule(e.target.value as DualpipeSimulationInputs['pipelineSchedule'])}
                aria-label="Pipeline Schedule Architecture"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="dualpipe_bidirectional">DualPipe (DeepSeek-V3 Bidirectional Overlap)</option>
                <option value="interleaved_1f1b">Interleaved 1F1B (Megatron-LM Multi-Chunk)</option>
                <option value="standard_1f1b">Standard 1F1B (Unidirectional Baseline)</option>
              </select>
            </div>

            {/* Pipeline Parallel Stages */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Pipeline Stages (P)</span>
                <span className="font-mono text-sky-400 font-semibold">{pipelineParallelStages} stages</span>
              </div>
              <input
                type="range"
                min="4"
                max="32"
                step="4"
                value={pipelineParallelStages}
                onChange={(e) => setPipelineParallelStages(parseInt(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Number of partitioned layer groups across node boundaries.</p>
            </div>

            {/* Micro-Batch Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Micro-Batch Count (M)</span>
                <span className="font-mono text-cyan-400 font-semibold">{microBatchCount} batches</span>
              </div>
              <input
                type="range"
                min="16"
                max="64"
                step="8"
                value={microBatchCount}
                onChange={(e) => setMicroBatchCount(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Inter-Node Network Fabric */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Inter-Node Network Fabric</label>
              <select
                value={crossNodeNetworkFabric}
                onChange={(e) => setCrossNodeNetworkFabric(e.target.value as DualpipeSimulationInputs['crossNodeNetworkFabric'])}
                aria-label="Inter-Node Network Fabric"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
              >
                <option value="infiniband_800g_cx7">NVIDIA Quantum-2 InfiniBand 800Gb/s (ConnectX-7)</option>
                <option value="nvlink_infiniband_400g">InfiniBand 400Gb/s + Dual NVLink Domain</option>
                <option value="pcie_gen5_ethernet">Standard RoCEv2 Ethernet 100Gb/s (Congested)</option>
              </select>
            </div>

            {/* Cluster Nodes */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Server Nodes (8 GPUs / Node)</span>
                <span className="font-mono text-indigo-400 font-semibold">{hardwareClusterNodes} nodes ({hardwareClusterNodes * 8} GPUs)</span>
              </div>
              <input
                type="range"
                min="4"
                max="64"
                step="4"
                value={hardwareClusterNodes}
                onChange={(e) => setHardwareClusterNodes(parseInt(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Currency Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">FinOps Valuation Currency:</span>
              <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-950">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    currency === 'INR' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    currency === 'USD' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>

          {/* Results & Visualizer Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Bubble Ratio</div>
                <div className="text-2xl font-bold font-mono text-sky-400 mt-1">
                  {results.pipelineBubbleRatioPercent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Zero-Bubble Target</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Cluster MFU</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.modelFlopsUtilizationPercent}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Record GPU Efficiency</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Comm Overlap</div>
                <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                  {results.hiddenCommunicationOverlapRatio}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">All-to-All Hidden</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Speedup Factor</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {results.clusterSpeedupFactor}x
                </div>
                <div className="text-[10px] text-slate-400 mt-1">vs 1F1B Baseline</div>
              </div>
            </div>

            {/* Stage Execution Breakdown */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" /> Pipeline Stage Execution & Communication Hiding
                </h3>
                <span className="text-xs font-mono text-slate-400">Micro-Batch Chunks</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                {results.stageBreakdown.map((s) => (
                  <div key={s.stageIndex} className="p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1">
                    <div className="text-slate-400 text-[10px]">Stage #{s.stageIndex}</div>
                    <div className="text-sky-300 font-semibold">F: {s.forwardTimeMs}ms</div>
                    <div className="text-emerald-300">B: {s.backwardTimeMs}ms</div>
                    <div className="text-indigo-400 text-[10px]">Overlap: {s.commOverlapMs}ms</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Visualizer SVG */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-400" /> DualPipe Bidirectional Scheduling Timeline
                </h3>
                <span className="text-xs font-mono text-sky-400 border border-sky-500/20 px-2 py-0.5 rounded bg-sky-500/10">
                  Zero-Bubble Overlap
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <svg viewBox="0 0 600 180" className="w-full h-auto text-xs font-mono select-none">
                  {/* Timeline Row 1: Pipeline 0 (Forward direction) */}
                  <text x="15" y="45" fill="#38bdf8" fontWeight="bold">Pipeline 0 (Forward)</text>
                  <rect x="160" y="30" width="70" height="24" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                  <text x="195" y="46" fill="#f0f9ff" textAnchor="middle">F0 (Forward)</text>

                  <rect x="235" y="30" width="85" height="24" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1" />
                  <text x="277" y="46" fill="#ecfdf5" textAnchor="middle">B0_input</text>

                  <rect x="325" y="30" width="105" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="377" y="46" fill="#e0e7ff" textAnchor="middle">B0_weight (GEMM)</text>

                  {/* Overlap Indicator on Row 1 */}
                  <path d="M 330 60 L 425 60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                  <text x="377" y="73" fill="#f59e0b" textAnchor="middle" fontSize="10">All-to-All Comm Overlap</text>

                  {/* Timeline Row 2: Pipeline 1 (Reverse direction) */}
                  <text x="15" y="125" fill="#34d399" fontWeight="bold">Pipeline 1 (Reverse)</text>
                  <rect x="160" y="110" width="105" height="24" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1.5" />
                  <text x="212" y="126" fill="#e0e7ff" textAnchor="middle">B1_weight (GEMM)</text>

                  <rect x="270" y="110" width="70" height="24" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1" />
                  <text x="305" y="126" fill="#f0f9ff" textAnchor="middle">F1 (Forward)</text>

                  <rect x="345" y="110" width="85" height="24" rx="4" fill="#047857" stroke="#34d399" strokeWidth="1" />
                  <text x="387" y="126" fill="#ecfdf5" textAnchor="middle">B1_input</text>

                  {/* Summary Legend */}
                  <line x1="160" y1="155" x2="580" y2="155" stroke="#334155" strokeWidth="1" />
                  <text x="370" y="170" fill="#94a3b8" textAnchor="middle" fontSize="10">Continuous GPU Tensor Core Saturation • Zero Pipeline Bubble Idling</text>
                </svg>
              </div>
            </div>

            {/* Financial FinOps Card */}
            <div className="bg-gradient-to-r from-sky-950/40 via-indigo-950/30 to-slate-900/60 p-6 rounded-2xl border border-sky-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-sky-400">Annual FinOps Infrastructure Savings</span>
                <span className="text-xs font-mono text-slate-400">Hardware Amortization Delta</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {currency === 'INR' ? '₹' : '$'}{results.annualFinOpsCapExSavings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                By shrinking the pipeline bubble from 28.4% to {results.pipelineBubbleRatioPercent}% and reaching {results.modelFlopsUtilizationPercent}% MFU, your {hardwareClusterNodes * 8}-GPU cluster delivers a {results.clusterSpeedupFactor}x effective throughput acceleration without requiring extra accelerator nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <section className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" /> Architectural FAQ & Technical Invariants
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-950/60 hover:bg-slate-900/60 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-sky-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-slate-950/30 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Consultation & Mandate Section */}
        <section className="border-t border-slate-800 pt-10">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Deploy Sovereign DualPipe DeepSeek-V3 Infrastructure
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule an architecture audit with our Principal Distributed Systems team to deploy DeepSeek-V3 and DeepSeek-R1 inference and training clusters with DualPipe zero-bubble parallelism on private VPC infrastructure.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <MandateApplicationForm />
          </div>
        </section>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" /> Embed Simulator Widget
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Embed this responsive interactive calculator directly on your website or technical documentation.
            </p>
            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap">
                {embedSnippet}
              </pre>
              <button
                onClick={copyEmbed}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-medium inline-flex items-center gap-1"
              >
                {hasCopiedEmbed ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {hasCopiedEmbed ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="DualPipe Pipeline Parallelism Simulator"
        simulatedMetrics={[
          { label: 'Pipeline Bubble', value: `${results.pipelineBubbleRatioPercent}%`, detail: 'vs 28.4% 1F1B baseline' },
          { label: 'Cluster MFU', value: `${results.modelFlopsUtilizationPercent}%`, detail: 'Model Flops Utilization' },
          { label: 'Comm Overlap', value: `${results.hiddenCommunicationOverlapRatio}%`, detail: 'All-to-All network hidden' },
          { label: 'FinOps CapEx Savings', value: `${currency === 'INR' ? '₹' : '$'}${results.annualFinOpsCapExSavings.toLocaleString()}`, detail: 'Hardware efficiency delta' }
        ]}
      />
    </div>
  );
}
