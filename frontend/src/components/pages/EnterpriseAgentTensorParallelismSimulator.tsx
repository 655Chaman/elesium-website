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
  Network,
  Cpu,
  ArrowRight
} from 'lucide-react';
import {
  calculateTensorParallelism,
  TensorParallelismInputs,
  ModelArchitecture,
  TpDegree,
  InterconnectType,
  AllReduceMode
} from '../calculator/agentTensorParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentTensorParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [tpDegree, setTpDegree] = useState<TpDegree>(8);
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [allReduceMode, setAllReduceMode] = useState<AllReduceMode>('async_overlap');
  const [batchSize, setBatchSize] = useState<number>(32);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: TensorParallelismInputs = useMemo(() => ({
    modelArchitecture,
    tpDegree,
    interconnect,
    allReduceMode,
    batchSize,
    currency
  }), [
    modelArchitecture,
    tpDegree,
    interconnect,
    allReduceMode,
    batchSize,
    currency
  ]);

  const results = useMemo(() => calculateTensorParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelArchitecture('llama_3_70b');
    setTpDegree(8);
    setInterconnect('nvlink_4_900gb');
    setAllReduceMode('async_overlap');
    setBatchSize(32);
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-tensor-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe><div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-tensor-parallelism-simulator" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Tensor Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: TENSOR PARALLELISM & ALL-REDUCE OVERLAP
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Tensor Parallel Degree: ${tpDegree} GPUs | Interconnect: ${interconnect.toUpperCase().replace(/_/g, ' ')}
All-Reduce Collective Mode: ${allReduceMode.toUpperCase().replace(/_/g, ' ')} | Batch Size: ${batchSize}

PERFORMANCE & INTERCONNECT METRICS:
- All-Reduce Synchronization Latency: ${results.allReduceLatencyMs}ms (P99 Intra-Node)
- Communication Overhead: ${results.commOverheadPercent}%
- NVLink Bus Wire Saturation: ${results.nvlinkBusSaturationPercent}%
- Throughput Multiplier: ${results.throughputSpeedup}x
- Aggregate Inference Generation: ${results.tokensPerSecond} tokens/sec
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
- Compliance SLA: ${results.slaStatus}

Architected via Elesium Enterprise Sovereign Infrastructure Engine.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "What is Megatron-LM tensor parallelism and how does it partition weight matrices?",
      a: "Megatron-LM tensor parallelism partitions individual weight matrices across multiple GPUs within an NVLink-connected chassis. Self-attention QKV projections are partitioned column-wise, while the subsequent output projection is partitioned row-wise. This mathematical pairing reduces collective synchronization to a single all-reduce per layer."
    },
    {
      q: "How does asynchronous all-reduce overlapping slash intra-node communication overhead?",
      a: "In conventional tensor parallelism, GPU tensor cores idle while waiting for NCCL all-reduce transfers to finish. Asynchronous all-reduce overlapping pipelines partial reduction chunks across NVLink concurrently with the activation functions or residual addition computations of the subsequent layer, cutting latency under 4ms."
    },
    {
      q: "Why is NVLink bandwidth critical for tensor parallelism compared to standard PCIe?",
      a: "Because all-reduce collectives occur twice per transformer block, tensor parallelism generates massive inter-GPU traffic. NVLink 4.0 provides 900 GB/s bidirectional bandwidth per GPU, whereas PCIe Gen5 provides only 128 GB/s. Running TP over PCIe increases communication overhead from 4% to over 35%, bottlenecking throughput."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent Tensor Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Megatron column/row tensor parallelism (TP), non-blocking all-reduce communication overlapping, and NVLink bus saturation to achieve sub-5ms intra-node forward latency."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-tensor-parallelism-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Tool #61 • Intra-Node Tensor Parallelism Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Enterprise Autonomous Agent Tensor Parallelism & All-Reduce Overlap Simulator
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400">
            Model Megatron-LM column/row linear matrix partitioning, NVLink 900 GB/s collective all-reduce overlapping, and sub-5ms intra-node latency across high-density enterprise GPU servers.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-white" />
                Tensor Partitioning & Interconnect Controls
              </h2>
              <button
                onClick={handleReset}
                className="active:scale-[0.97] text-xs text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Model Architecture */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Foundation Model Architecture</label>
              <select
                value={modelArchitecture}
                onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
              >
                <option value="llama_3_70b">Llama-3-70B (8192 Hidden Dim)</option>
                <option value="deepseek_v2_236b">DeepSeek-V2 MoE (5120 Hidden Dim)</option>
                <option value="qwen_2_5_72b">Qwen-2.5-72B (8192 Hidden Dim)</option>
                <option value="mistral_large_123b">Mistral-Large-123B (12288 Hidden Dim)</option>
              </select>
            </div>

            {/* TP Degree & Interconnect */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">TP Degree (GPUs)</label>
                <select
                  value={tpDegree}
                  onChange={(e) => setTpDegree(Number(e.target.value) as TpDegree)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                >
                  <option value={2}>TP = 2 GPUs</option>
                  <option value={4}>TP = 4 GPUs</option>
                  <option value={8}>TP = 8 GPUs (DGX Node)</option>
                  <option value={16}>TP = 16 GPUs (Multi-Chassis)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Interconnect Fabric</label>
                <select
                  value={interconnect}
                  onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
                >
                  <option value="nvlink_4_900gb">NVLink 4 (900 GB/s H100)</option>
                  <option value="nvlink_3_600gb">NVLink 3 (600 GB/s A100)</option>
                  <option value="pcie_gen5_128gb">PCIe Gen5 (128 GB/s L40S)</option>
                  <option value="pcie_gen4_64gb">PCIe Gen4 (64 GB/s A10G)</option>
                </select>
              </div>
            </div>

            {/* All-Reduce Mode */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">All-Reduce Collective Mode</label>
              <select
                value={allReduceMode}
                onChange={(e) => setAllReduceMode(e.target.value as AllReduceMode)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40"
              >
                <option value="async_overlap">Async Overlap Ring (Non-Blocking • Sub-5ms)</option>
                <option value="two_shot">Two-Shot All-Reduce (Reduced NVLink Hops)</option>
                <option value="nccl_tree_blocking">NCCL Tree Blocking (Standard Synchronous Barrier)</option>
              </select>
            </div>

            {/* Batch Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-300">Inference Batch Size</span>
                <span className="text-red-400 font-mono font-bold">{batchSize} concurrent</span>
              </div>
              <input
                type="range"
                min={1}
                max={128}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800"
              />
            </div>

            {/* Currency Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">Currency Display</label>
              <div className="flex rounded-lg border border-neutral-700 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`active:scale-[0.97] flex-1 py-1.5 text-xs font-semibold transition-colors ${
                    currency === 'INR' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
                  }`}
                >
                  INR (₹ Lakhs)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`active:scale-[0.97] flex-1 py-1.5 text-xs font-semibold transition-colors ${
                    currency === 'USD' ? 'bg-white text-black' : 'bg-neutral-900 text-neutral-400'
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
              <div className="bg-neutral-900/90 border border-red-500/30 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-neutral-400">All-Reduce Latency</div>
                <div className="text-2xl font-black text-red-400 mt-1 font-mono">
                  {results.allReduceLatencyMs}ms
                </div>
                <div className="text-[11px] text-red-400/80 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Intra-Node Sync
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-white/20 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-neutral-400">Throughput Speedup</div>
                <div className="text-2xl font-black text-neutral-200 mt-1 font-mono">
                  {results.throughputSpeedup}x
                </div>
                <div className="text-[11px] text-neutral-200 mt-1">
                  Linear Scaling
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-white/20 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-neutral-400">Comm Overhead</div>
                <div className="text-2xl font-black text-neutral-200 mt-1 font-mono">
                  {results.commOverheadPercent}%
                </div>
                <div className="text-[11px] text-neutral-200 mt-1">
                  NVLink Overlap
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-neutral-400">NVLink Saturation</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {results.nvlinkBusSaturationPercent}%
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Wire Bandwidth
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-neutral-400">Inference Throughput</div>
                <div className="text-2xl font-black text-red-400 mt-1 font-mono">
                  {results.tokensPerSecond} tok/s
                </div>
                <div className="text-[11px] text-red-400 mt-1">
                  Parallel Decode
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-amber-500/30 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-neutral-400">Annual FinOps Savings</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 mt-1 font-mono">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">
                  Throughput Density
                </div>
              </div>
            </div>

            {/* Architecture Visualization Card */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Network className="w-4 h-4 text-red-400" />
                  Megatron Column-Row Partitioning & NVLink Mesh
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  results.slaStatus === 'SUB_5MS_NVLINK_OPTIMAL'
                    ? 'bg-white/10 text-neutral-200 border border-white/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dataflow Visualization */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  {Array.from({ length: Math.min(4, tpDegree) }).map((_, idx) => (
                    <div key={idx} className="bg-neutral-900/80 border border-red-500/30 rounded-lg p-3 space-y-1">
                      <div className="text-xs font-bold text-red-400">GPU Rank {idx}</div>
                      <div className="text-[11px] text-neutral-300 font-mono">
                        Col/Row Proj {idx + 1}/{tpDegree}
                      </div>
                      <div className="text-[10px] text-neutral-200 font-mono">
                        {allReduceMode === 'async_overlap' ? 'Async Overlap' : 'All-Reduce Sync'}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-neutral-400 border-t border-neutral-800/80 pt-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-red-400" />
                    <span className="font-mono text-red-400">Interconnect:</span>
                    <span>{interconnect.toUpperCase().replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-neutral-200">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{results.allReduceLatencyMs}ms Collective Latency</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={copyExecutiveMemo}
                  className="active:scale-[0.97] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-semibold shadow-md transition-colors"
                >
                  {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}
                </button>
                <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-lg bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                  onClick={() => setIsEmbedOpen(true)}
                  className="active:scale-[0.97] flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold border border-neutral-700 transition-colors"
                >
                  <Code className="w-4 h-4" />
                  Embed Tool
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Notes & FAQs */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">Frequently Asked Architectural Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950/40">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-neutral-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180 text-white' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Generation Section */}
        <div className="border border-neutral-800 rounded-xl p-6 sm:p-10 bg-gradient-to-b from-neutral-900/90 to-neutral-950">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Optimize Intra-Node Tensor Parallelism for Your Sovereign AI Cluster
            </h2>
            <p className="text-neutral-400 text-sm">
              Schedule an enterprise architecture audit to implement Megatron-LM column/row linear partitioning, NVLink asynchronous all-reduce overlapping, and sovereign private cloud deployment.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/20 bg-white/5 text-xs font-mono text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-lg bg-neutral-400" />
            <span>Direct Lead Architect Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Ready to Lock These Simulation Benchmarks in Production?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with our Principal Systems Architect on WhatsApp. We provide a tailored 1-page feasibility memorandum and deterministic VPC architecture blueprint.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openWhatsApp()}
              className="active:scale-[0.97] px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-lg bg-neutral-400" />
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
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-white" />
                Embed Simulator on Your Website
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Copy and paste this HTML snippet into your technical documentation, blog, or internal engineering wiki:
            </p>
            <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 text-xs font-mono text-neutral-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] px-3 py-1.5 text-xs text-neutral-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-neutral-200 text-black rounded-lg text-xs font-semibold transition-colors"
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
        toolName="Tensor Parallelism Simulator"
        simulatedMetrics={[
          { label: 'Throughput Speedup', value: `${results.throughputSpeedup}x`, detail: 'Linear scaling' },
          { label: 'All-Reduce Latency', value: `${results.allReduceLatencyMs}ms`, detail: 'Sub-5ms intra-node' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Throughput density' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
