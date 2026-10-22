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
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  calculatePipelineParallelism,
  PipelineParallelismInputs,
  ModelScale,
  PipelineScheduleMode,
  InterStageTransport
} from '../calculator/agentPipelineParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentPipelineParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelScale, setModelScale] = useState<ModelScale>('70b');
  const [pipelineStages, setPipelineStages] = useState<number>(4);
  const [microBatches, setMicroBatches] = useState<number>(16);
  const [scheduleMode, setScheduleMode] = useState<PipelineScheduleMode>('1f1b_interleaved');
  const [interStageTransport, setInterStageTransport] = useState<InterStageTransport>('gpudirect_rdma');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PipelineParallelismInputs = useMemo(() => ({
    modelScale,
    pipelineStages,
    microBatches,
    scheduleMode,
    interStageTransport,
    currency
  }), [
    modelScale,
    pipelineStages,
    microBatches,
    scheduleMode,
    interStageTransport,
    currency
  ]);

  const results = useMemo(() => calculatePipelineParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelScale('70b');
    setPipelineStages(4);
    setMicroBatches(16);
    setScheduleMode('1f1b_interleaved');
    setInterStageTransport('gpudirect_rdma');
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-pipeline-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-pipeline-parallelism-simulator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium Pipeline Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: PIPELINE PARALLELISM & 1F1B BUBBLE MINIMIZER
Model Scale: ${modelScale.toUpperCase()} | Stages: ${pipelineStages} GPUs
Micro-Batches: ${microBatches} | Schedule: ${scheduleMode.toUpperCase().replace(/_/g, ' ')}
Inter-Stage Transport: ${interStageTransport.toUpperCase().replace(/_/g, ' ')}

PERFORMANCE & COMPUTE RECOVERY METRICS:
- Pipeline Bubble Idle Fraction: ${results.bubbleFractionPercent}%
- Effective GPU Cluster Utilization: ${results.effectiveGpuUtilization}%
- Inter-Stage Activation Latency: ${results.interStageLatencyMs}ms
- Throughput Multiplier: ${results.throughputMultiplier}x
- Aggregate Inference Throughput: ${results.tokensPerSecond} tokens/sec
- Annual Recovered FinOps Value: ${results.annualFinOpsSavings}
- Compliance SLA: ${results.slaStatus}

Architected via Elesium Enterprise Sovereign Infrastructure Engine.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "What is a pipeline bubble and how does 1F1B micro-batching eliminate it?",
      a: "In naive pipeline parallelism (GPipe), earlier GPU stages sit completely idle while waiting for later stages to finish the batch. 1F1B (One-Forward-One-Backward) interleaves micro-batches so that each stage immediately alternates between forward and backward passes. Interleaved 1F1B further shrinks the bubble fraction by 2x by assigning multiple virtual stages per physical device."
    },
    {
      q: "Why is GPUDirect RDMA essential for cross-node pipeline parallelism?",
      a: "When pipeline stages cross physical server chassis nodes, staging activation tensors through CPU host memory and standard TCP networking adds 14ms+ of latency, stalling GPU execution. GPUDirect RDMA over RoCE v2 or InfiniBand transfers activations directly between GPU memories in sub-3.2ms, maintaining seamless pipeline flow."
    },
    {
      q: "How does pipeline parallelism interact with tensor and expert parallelism (3D/4D parallelism)?",
      a: "In hyperscale model serving (such as Megatron-LM or DeepSpeed), pipeline parallelism partitions layers across nodes, while tensor parallelism (TP) partitions attention matrices within NVLink nodes, and expert parallelism (EP) distributes MoE experts. Sizing pipeline micro-batches accurately prevents memory bloat while preserving 95%+ cluster utilization."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent Pipeline Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate pipeline parallelism (PP), 1F1B micro-batch scheduling, and GPUDirect RDMA activation transport to eliminate pipeline bubbles and maximize multi-node GPU cluster utilization."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-pipeline-parallelism-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Tool #60 • Distributed Pipeline Parallelism Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Enterprise Autonomous Agent Pipeline Parallelism & 1F1B Bubble Minimizer Simulator
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400">
            Model 1F1B micro-batch schedules, cross-node GPUDirect RDMA activation transport, and zero-bubble interleaving to eliminate GPU idle bubbles and achieve sub-10ms inter-stage latency.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                Pipeline Topology & Scheduling Controls
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Model Scale */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Foundation Model Scale</label>
              <select
                value={modelScale}
                onChange={(e) => setModelScale(e.target.value as ModelScale)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="70b">Llama-3-70B (Dense Sovereign Tier)</option>
                <option value="120b">Mistral-Large-123B (Enterprise Monolith)</option>
                <option value="236b_moe">DeepSeek-V2-236B MoE (Sparse Multi-Agent)</option>
                <option value="405b">Llama-3-405B (Hyperscale Foundation)</option>
              </select>
            </div>

            {/* Pipeline Stages & Micro-Batches */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Pipeline Stages (p)</span>
                  <span className="text-indigo-400 font-mono font-bold">{pipelineStages} Stages</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={16}
                  value={pipelineStages}
                  onChange={(e) => setPipelineStages(Number(e.target.value))}
                  className="w-full accent-indigo-500 bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Micro-Batches (m)</span>
                  <span className="text-cyan-400 font-mono font-bold">{microBatches} Batches</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={64}
                  step={4}
                  value={microBatches}
                  onChange={(e) => setMicroBatches(Number(e.target.value))}
                  className="w-full accent-cyan-500 bg-slate-800"
                />
              </div>
            </div>

            {/* Scheduling Mode */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Pipeline Scheduling Paradigm</label>
              <select
                value={scheduleMode}
                onChange={(e) => setScheduleMode(e.target.value as PipelineScheduleMode)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="1f1b_interleaved">1F1B Interleaved (v=2 Virtual Stages • Recommended)</option>
                <option value="1f1b_standard">1F1B Standard (One-Forward-One-Backward)</option>
                <option value="zero_bubble_async">Zero-Bubble Asynchronous Micro-Scheduling</option>
                <option value="naive_gpipe">Naive GPipe (Synchronous Batch Barrier • High Bubble)</option>
              </select>
            </div>

            {/* Inter-Stage Transport */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Inter-Stage P2P Transport Fabric</label>
              <select
                value={interStageTransport}
                onChange={(e) => setInterStageTransport(e.target.value as InterStageTransport)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="gpudirect_rdma">GPUDirect RDMA (RoCE v2 / InfiniBand • Sub-3.2ms)</option>
                <option value="nvlink_p2p">NVLink P2P Direct (Intra-Node Sub-1ms)</option>
                <option value="pcie_dma">PCIe DMA Direct (Host Pinned Ring Buffer)</option>
                <option value="tcp_socket">Standard TCP Sockets (Legacy Network Buffer)</option>
              </select>
            </div>

            {/* Currency Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Currency Display</label>
              <div className="flex rounded-lg border border-slate-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                    currency === 'INR' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  INR (₹ Lakhs)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                    currency === 'USD' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/90 border border-indigo-500/30 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">Bubble Idle Fraction</div>
                <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">
                  {results.bubbleFractionPercent}%
                </div>
                <div className="text-[11px] text-indigo-400/80 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Idle GPU Time
                </div>
              </div>

              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">Cluster Utilization</div>
                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {results.effectiveGpuUtilization}%
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-1">
                  Active Compute Core
                </div>
              </div>

              <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400">Inter-Stage Latency</div>
                <div className="text-2xl font-black text-cyan-400 mt-1 font-mono">
                  {results.interStageLatencyMs}ms
                </div>
                <div className="text-[11px] text-cyan-400/80 mt-1">
                  Sub-10ms P2P Buffer
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">Throughput Multiplier</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {results.throughputMultiplier}x
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  vs Single-Node Bound
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">Inference Throughput</div>
                <div className="text-2xl font-black text-indigo-400 mt-1 font-mono">
                  {results.tokensPerSecond} tok/s
                </div>
                <div className="text-[11px] text-indigo-400 mt-1">
                  Multi-Stage Generation
                </div>
              </div>

              <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400">Recovered FinOps Value</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 mt-1 font-mono">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">
                  Recovered Compute Capital
                </div>
              </div>
            </div>

            {/* Architecture Visualization Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  1F1B Interleaved Pipeline Stage Execution Map
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  results.slaStatus === 'SUB_10MS_ZERO_BUBBLE'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dataflow Stages Visual */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {Array.from({ length: Math.min(4, pipelineStages) }).map((_, idx) => (
                    <div key={idx} className="bg-slate-900/80 border border-indigo-500/30 rounded-lg p-3 space-y-1">
                      <div className="text-xs font-bold text-indigo-400">Stage {idx + 1}</div>
                      <div className="text-[11px] text-slate-300 font-mono">
                        Layers {Math.round((idx / pipelineStages) * 80)}–{Math.round(((idx + 1) / pipelineStages) * 80)}
                      </div>
                      <div className="text-[10px] text-emerald-400 font-mono">
                        {scheduleMode === '1f1b_interleaved' ? '1F1B Interleaved' : '1F1B Active'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-400 font-mono">Fabric:</span>
                    <span>{interStageTransport.toUpperCase().replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-cyan-400">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{results.interStageLatencyMs}ms Transport Latency</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={copyExecutiveMemo}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                  {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}
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
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  Embed Tool
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Notes & FAQs */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Frequently Asked Architectural Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Generation Section */}
        <div className="border border-slate-800 rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-slate-900/90 to-slate-950">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Scale Multi-Node Pipeline Parallelism with Zero Idle Bubbles
            </h2>
            <p className="text-slate-400 text-sm">
              Schedule an enterprise architecture audit to implement Megatron-LM 1F1B interleaved scheduling, GPUDirect RDMA activation transport, and sovereign VPC private cloud deployment.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Direct Lead Architect Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Ready to Lock These Simulation Benchmarks in Production?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with our Principal Systems Architect on WhatsApp. We provide a tailored 1-page feasibility memorandum and deterministic VPC architecture blueprint.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openWhatsApp()}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Chat on WhatsApp with Lead Architect</span>
            </button>
          </div>
        </div>

        <MandateApplicationForm />
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                Embed Simulator on Your Website
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy and paste this HTML snippet into your technical documentation, blog, or internal engineering wiki:
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied Snippet' : 'Copy HTML'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Pipeline Parallelism Simulator"
        simulatedMetrics={[
          { label: 'Cluster Utilization', value: `${results.effectiveGpuUtilization}%`, detail: 'Active compute core' },
          { label: 'Bubble Fraction', value: `${results.bubbleFractionPercent}%`, detail: 'Interleaved 1F1B' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Recovered idle compute' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
