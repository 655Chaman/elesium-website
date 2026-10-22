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
  ArrowRight
} from 'lucide-react';
import {
  calculateSequenceParallelism,
  SequenceParallelismInputs,
  ModelArchitecture,
  SpDegree,
  InterconnectType,
  RingMode
} from '../calculator/agentSequenceParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentSequenceParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_1_70b');
  const [spDegree, setSpDegree] = useState<SpDegree>(8);
  const [totalContextTokens, setTotalContextTokens] = useState<number>(262144);
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [ringMode, setRingMode] = useState<RingMode>('async_p2p_overlap');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SequenceParallelismInputs = useMemo(() => ({
    modelArchitecture,
    spDegree,
    totalContextTokens,
    interconnect,
    ringMode,
    currency
  }), [
    modelArchitecture,
    spDegree,
    totalContextTokens,
    interconnect,
    ringMode,
    currency
  ]);

  const results = useMemo(() => calculateSequenceParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelArchitecture('llama_3_1_70b');
    setSpDegree(8);
    setTotalContextTokens(262144);
    setInterconnect('nvlink_4_900gb');
    setRingMode('async_p2p_overlap');
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-sequence-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-sequence-parallelism-simulator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium Sequence Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: SEQUENCE PARALLELISM & RING SELF-ATTENTION
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Sequence Parallel Degree: ${spDegree} GPUs | Total Context: ${totalContextTokens.toLocaleString()} tokens
Interconnect: ${interconnect.toUpperCase().replace(/_/g, ' ')} | Ring Mode: ${ringMode.toUpperCase().replace(/_/g, ' ')}

PERFORMANCE & DISTRIBUTED TELEMETRY METRICS:
- Per-GPU Context Shard: ${results.perGpuContextTokens.toLocaleString()} tokens (${results.ringShiftSteps} ring shifts)
- Per-Step Ring KV Transfer Latency: ${results.perStepKvCommMs}ms
- Per-Step Local GEMM Compute: ${results.perStepGemmComputeMs}ms
- Effective Forward Step Latency: ${results.effectiveStepLatencyMs}ms (P99)
- Communication Overlap Efficiency: ${results.commOverlapEfficiencyPercent}%
- Peak Per-GPU KV VRAM Allocation: ${results.peakKvVramGb} GB
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
- Compliance SLA Status: ${results.slaStatus}

Architected via Elesium Enterprise Sovereign Infrastructure Engine.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "What is Sequence Parallelism (SP) and how does it prevent OOM crashes on 1M+ context lengths?",
      a: "Sequence Parallelism partitions the token sequence dimension across multiple distributed GPUs rather than replicating context on each device. Each GPU holds only S/N tokens in its local KV cache, slashing peak per-device memory consumption linearly and making 262k to 1M+ token inferences computationally tractable without Out-Of-Memory exceptions."
    },
    {
      q: "How does Ring Self-Attention overlap peer-to-peer communication with tensor core computation?",
      a: "In Ring Self-Attention, each GPU rank keeps its local Query block stationary while streaming Key and Value tensor chunks in a logical ring across neighboring ranks. While computing attention for the current block, non-blocking NCCL point-to-point CUDA streams simultaneously transmit and receive the next KV chunks, achieving over 96% communication overlap efficiency on high-bandwidth fabrics."
    },
    {
      q: "When should enterprise architectures choose NVLink versus InfiniBand for sequence parallelism?",
      a: "Intra-node sequence parallelism (up to 8 or 16 GPUs) achieves optimal sub-10ms step latency over 900 GB/s NVLink 4.0 meshes due to minimal P2P transit latency. Scaling across multi-chassis nodes requires 400 GB/s InfiniBand NDR or RoCE v2 with GPUDirect RDMA to prevent inter-chassis serialization bottlenecks from degrading attention throughput."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent Sequence Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Sequence Parallelism (SP), Ring Self-Attention (RingAttention), distributed QKV communication overlap, and 1M+ context token inference on enterprise GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-sequence-parallelism-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Tool #62 • 1M+ Context Token Sequence Parallelism Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Enterprise Autonomous Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">Sequence Parallelism</span> & Ring Attention Simulator
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
            Model Ring Self-Attention, chunked QKV sequence sharding, non-blocking peer-to-peer KV-shift overlapping, and 1M+ context token inference on sovereign multi-GPU clusters.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">Currency Mode:</span>
            <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${currency === 'INR' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition ${currency === 'USD' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                USD ($)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 hover:bg-cyan-950/60 rounded-lg border border-cyan-800/50 transition"
            >
              <Code className="w-3.5 h-3.5" />
              Embed Widget
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 font-bold bg-cyan-400 hover:bg-cyan-300 rounded-lg transition"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Brief'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800 text-sm font-semibold text-white">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Sequence Partitioning Parameters
            </div>

            {/* Model Architecture */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Model Architecture</label>
              <select
                value={modelArchitecture}
                onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="llama_3_1_70b">Llama-3.1-70B (8192 Hidden Dim · 64 Heads)</option>
                <option value="deepseek_v2_236b">DeepSeek-V2-236B MoE (5120 Hidden Dim)</option>
                <option value="qwen_2_5_72b">Qwen-2.5-72B (8192 Hidden Dim)</option>
                <option value="mistral_large_123b">Mistral-Large-123B (12288 Hidden Dim)</option>
              </select>
            </div>

            {/* Sequence Parallel Degree */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Sequence Parallel (SP) Degree</label>
              <div className="grid grid-cols-5 gap-2">
                {[2, 4, 8, 16, 32].map((degree) => (
                  <button
                    key={degree}
                    type="button"
                    onClick={() => setSpDegree(degree as SpDegree)}
                    className={`py-2 text-xs font-bold rounded-lg border transition ${
                      spDegree === degree
                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    SP-{degree}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Context Tokens Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">Total Sequence Context Window</span>
                <span className="font-mono text-cyan-400 font-bold">{totalContextTokens.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min={16384}
                max={1048576}
                step={16384}
                value={totalContextTokens}
                onChange={(e) => setTotalContextTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>16k</span>
                <span>128k</span>
                <span>262k</span>
                <span>524k</span>
                <span>1,048k (1M)</span>
              </div>
            </div>

            {/* Interconnect Fabric */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Interconnect Fabric</label>
              <select
                value={interconnect}
                onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="nvlink_4_900gb">NVLink 4.0 Mesh (900 GB/s Bidirectional)</option>
                <option value="nvlink_3_600gb">NVLink 3.0 Mesh (600 GB/s Bidirectional)</option>
                <option value="infiniband_ndr_400gb">InfiniBand NDR / RoCE v2 (400 GB/s RDMA)</option>
                <option value="pcie_gen5_128gb">PCIe Gen5 Bus (128 GB/s Duplex)</option>
              </select>
            </div>

            {/* Ring Shift Mode */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">Ring Attention Overlap Strategy</label>
              <select
                value={ringMode}
                onChange={(e) => setRingMode(e.target.value as RingMode)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              >
                <option value="async_p2p_overlap">Asynchronous Non-Blocking P2P Overlap (Optimal)</option>
                <option value="double_buffered_ring">Double-Buffered Ring Attention (Conservative)</option>
                <option value="blocking_synchronous">Synchronous Ring Transfer (Sequential Barrier)</option>
              </select>
            </div>
          </div>

          {/* Results & Visuals Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Per-GPU Context</span>
                <span className="text-xl font-extrabold text-cyan-400 font-mono">
                  {results.perGpuContextTokens.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">tokens / device</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Step Latency</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {results.effectiveStepLatencyMs}ms
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">P99 forward step</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Overlap Efficiency</span>
                <span className="text-xl font-extrabold text-teal-400 font-mono">
                  {results.commOverlapEfficiencyPercent}%
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">GEMM-overlap</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <span className="text-[11px] text-slate-400 block mb-1">Peak KV VRAM</span>
                <span className="text-xl font-extrabold text-indigo-400 font-mono">
                  {results.peakKvVramGb} GB
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">per GPU device</span>
              </div>
            </div>

            {/* SLA Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              results.slaStatus === 'SUB_10MS_1M_OPTIMAL'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold block tracking-wider uppercase">
                    {results.slaStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {results.slaStatus === 'SUB_10MS_1M_OPTIMAL'
                      ? 'Sub-10ms per-step latency verified with 96%+ network overlap and zero OOM risk.'
                      : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                      ? 'Operable sequence sharding; minor communication delay observed during ring shifts.'
                      : 'Severe network bottleneck. Ring KV communication dominates attention compute.'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-950/80 border border-slate-800 text-cyan-300">
                {results.ringShiftSteps} Ring Shifts
              </span>
            </div>

            {/* Visual Ring Self-Attention Topology */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Network className="w-4 h-4 text-cyan-400" />
                  Ring Self-Attention Peer-to-Peer Communication Topology
                </div>
                <span className="text-[11px] font-mono text-cyan-400">
                  {spDegree} Active GPU Ranks
                </span>
              </div>

              {/* Topology Graphic */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-around flex-wrap gap-2 text-xs">
                  {Array.from({ length: Math.min(8, spDegree) }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/40 text-center font-mono">
                        <div className="text-[10px] text-cyan-400 font-bold">GPU {idx}</div>
                        <div className="text-[9px] text-slate-400">Q_{idx} · KV_{idx}</div>
                      </div>
                      {idx < Math.min(8, spDegree) - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-500 " />
                      )}
                    </div>
                  ))}
                  {spDegree > 8 && (
                    <div className="text-slate-500 text-xs font-mono">... +{spDegree - 8} more</div>
                  )}
                </div>
                <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                  Ring P2P KV Shift: <span className="text-cyan-300 font-mono">{results.perStepKvCommMs}ms</span> comm overlapped with <span className="text-teal-300 font-mono">{results.perStepGemmComputeMs}ms</span> local attention GEMM.
                </div>
              </div>

              {/* FinOps Recovered Value Card */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-800/40">
                <div>
                  <span className="text-xs text-slate-400 block">Recovered Annual Cluster FinOps Capital</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">{results.annualFinOpsSavings}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block">Sovereign Compliance</span>
                  <span className="text-xs font-bold text-emerald-400">Indian DPDP Act 2023 · Private VPC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Frequently Asked Architectural Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Form Section */}
        <div className="pt-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Schedule a Sequence Parallelism Architecture Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Deploy Ring Self-Attention and sequence parallelism on your enterprise GPU clusters with sovereign air-gapped guarantees.
            </p>
          </div>
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

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Embed Sequence Parallelism Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy and paste this HTML snippet into your technical documentation, internal wiki, or blog:
            </p>
            <div className="relative">
              <textarea
                readOnly
                rows={4}
                value={embedCode}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <button
                onClick={copyEmbedCode}
                className="absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition"
              >
                {hasCopiedEmbed ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Sequence Parallelism & Ring Attention Simulator"
        simulatedMetrics={[
          { label: 'Step Latency', value: `${results.effectiveStepLatencyMs}ms`, detail: 'P99 forward step' },
          { label: 'Overlap Ratio', value: `${results.commOverlapEfficiencyPercent}%`, detail: 'P2P wire speed' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: '1M+ context clusters' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
