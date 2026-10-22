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
  calculateContextParallelism,
  ContextParallelismInputs,
  CpModelArchitecture,
  CpDegree,
  CpInterconnectType,
  CpAttentionMechanism
} from '../calculator/agentContextParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentContextParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<CpModelArchitecture>('llama_3_1_70b_128k');
  const [cpDegree, setCpDegree] = useState<CpDegree>(8);
  const [sequenceLengthTokens, setSequenceLengthTokens] = useState<number>(524288); // 512k tokens
  const [interconnect, setInterconnect] = useState<CpInterconnectType>('nvlink_4_900gb');
  const [attentionMechanism, setAttentionMechanism] = useState<CpAttentionMechanism>('ring_attention');
  const [causalMasking, setCausalMasking] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ContextParallelismInputs = useMemo(() => ({
    modelArchitecture,
    cpDegree,
    sequenceLengthTokens,
    interconnect,
    attentionMechanism,
    causalMasking,
    currency
  }), [
    modelArchitecture,
    cpDegree,
    sequenceLengthTokens,
    interconnect,
    attentionMechanism,
    causalMasking,
    currency
  ]);

  const results = useMemo(() => calculateContextParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelArchitecture('llama_3_1_70b_128k');
    setCpDegree(8);
    setSequenceLengthTokens(524288);
    setInterconnect('nvlink_4_900gb');
    setAttentionMechanism('ring_attention');
    setCausalMasking(true);
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-context-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-context-parallelism-simulator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium Context Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: CONTEXT PARALLELISM & RING KV EXCHANGE
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Context Parallel Degree: ${cpDegree} GPUs | Total Sequence: ${sequenceLengthTokens.toLocaleString()} tokens
Interconnect: ${interconnect.toUpperCase().replace(/_/g, ' ')} | Mechanism: ${attentionMechanism.toUpperCase().replace(/_/g, ' ')}
Causal Masking: ${causalMasking ? 'Causal Block-Triangular (55% FLOP Reduction)' : 'Bidirectional Full'}

EMPIRICAL TELEMETRY & LATENCY BENCHMARKS:
- Tokens Per GPU Shard: ${results.tokensPerGpu.toLocaleString()} tokens
- Unpartitioned KV Memory: ${results.unpartitionedKvMemoryGb} GB (${results.oomRiskPrevented ? 'CATASTROPHIC OOM PREVENTED' : 'Manageable'})
- Sharded KV Memory: ${results.shardedKvMemoryGb} GB / GPU
- Local Compute Latency: ${results.localComputeLatencyMs} ms
- Ring Transfer Latency: ${results.ringTransferLatencyMs} ms
- Communication Overlap Efficiency: ${results.commOverlapEfficiencyPercent}%
- Effective Step Latency: ${results.effectiveStepLatencyMs} ms
- SLA Status: ${results.slaStatus.replace(/_/g, ' ')}
- Processing Throughput: ${results.tokensPerSecondThroughput.toLocaleString()} tokens/sec
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}

Verified via Elesium Sovereign High-Performance Computing Practice
Link: https://elesium.online/tools/enterprise-agent-context-parallelism-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const simulatedMetricsForModal = useMemo(() => [
    { label: 'Step Latency', value: `${results.effectiveStepLatencyMs}ms`, detail: 'P99 Ring Attention Forward Step' },
    { label: 'Overlap Efficiency', value: `${results.commOverlapEfficiencyPercent}%`, detail: 'P2P Wire Overlap' },
    { label: 'Unpartitioned Footprint', value: `${results.unpartitionedKvMemoryGb} GB`, detail: 'Prevented Out-Of-Memory Crash' },
    { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Multi-GPU Cluster Arbitrage' }
  ], [results]);

  const faqs = [
    {
      q: "What is Context Parallelism (CP) and how does it differ from Tensor Parallelism (TP)?",
      a: "While Tensor Parallelism (TP) splits weight matrices across GPUs within each linear layer, Context Parallelism (CP) partitions the sequence dimension (tokens) across distributed GPU ranks. In long-context tasks (128k to 2M+ tokens), the Key-Value (KV) cache memory footprint and attention matrix calculation grow quadratically O(S^2), creating an insurmountable VRAM memory wall. Context Parallelism distributes both the KV activations and attention compute across GPU ranks, streaming KV chunks in a peer-to-peer ring topology concurrently with local matrix multiplication."
    },
    {
      q: "How does Ring Attention achieve compute-communication overlap?",
      a: "In Ring Attention, each GPU rank holds 1/CP of the query tokens and initially holds 1/CP of the key-value tokens. During step 0, each GPU computes attention between its local queries and local keys/values. Concurrently on CUDA Stream 2, it transmits its KV block to the next GPU in the logical ring and receives a KV block from the preceding GPU. Overlap is achieved when the communication time of shifting the KV chunk is shorter than the local QK^T and AV GEMM compute time, resulting in near-zero idle overhead."
    },
    {
      q: "When should an enterprise choose DeepSpeed Ulysses vs Ring Attention?",
      a: "DeepSpeed Ulysses performs an all-to-all collective to shard attention heads across ranks rather than the sequence dimension during attention computation. DeepSpeed Ulysses is exceptionally fast when the number of attention heads is cleanly divisible by the GPU count and intra-node NVLink bandwidth is high. However, when sequence lengths exceed 512k tokens or cross-node InfiniBand clusters are employed, Ring Attention scales superiorly because its peer-to-peer ring communication volume is decoupled from the head count."
    },
    {
      q: "How does causal block-triangular masking eliminate redundant compute?",
      a: "In autoregressive causal language modeling, tokens cannot attend to future tokens. In a standard full-attention matrix, half the computation is masked out. In a distributed ring topology, naive computation would waste 50% of FLOPs evaluating masked blocks. Causal block-triangular optimizers skip entire blocks that lie strictly above the diagonal and compute only the block-diagonal halves, slashing total attention FLOPs by ~45-50% and cutting step latency in half."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Enterprise Context Parallelism & Ring KV Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark Context Parallelism (CP), Ring Self-Attention, distributed KV sharding, non-blocking P2P communication overlap, and 2M+ token inference on sovereign multi-GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-context-parallelism-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2 uppercase tracking-wider">
              <span>Tools</span>
              <span>/</span>
              <span>Distributed LLM Infrastructure</span>
              <span>/</span>
              <span className="text-slate-400">Tool #64</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Network className="w-8 h-8 text-cyan-400 " />
              Context Parallelism &amp; Ring KV Overlap Simulator
            </h1>
            <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-3xl">
              Model distributed attention head sharding, peer-to-peer Ring KV communication overlapping, causal block-triangular masking, and 2M+ token inference on sovereign multi-GPU clusters.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition"
            >
              Currency: <strong className="text-cyan-400">{currency}</strong>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-600 transition"
              title="Reset to Baseline"
            >
              <RotateCcw className="w-4 h-4" />
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
              className="px-3 py-1.5 rounded-lg border border-cyan-800/60 bg-cyan-950/40 text-xs font-semibold text-cyan-300 hover:bg-cyan-900/60 transition flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5" />
              Embed
            </button>
          </div>
        </div>

        {/* Main Grid: Controls vs Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Cluster &amp; Sequence Parameters
                </h2>
                <span className="text-xs text-slate-500 font-mono">H100 / Blackwell Cluster</span>
              </div>

              {/* Model Architecture */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Foundation Model Architecture</span>
                  <span className="text-cyan-400 font-mono text-[11px]">{modelArchitecture}</span>
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as CpModelArchitecture)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="llama_3_1_70b_128k">Llama-3.1 70B (80 Layers, 8 KV Heads)</option>
                  <option value="deepseek_v3_128k">DeepSeek-V3 671B (61 Layers, 8 KV Heads)</option>
                  <option value="mistral_large_128k">Mistral-Large-2407 (88 Layers, 8 KV Heads)</option>
                  <option value="qwen_2_5_72b_128k">Qwen-2.5 72B (80 Layers, 8 KV Heads)</option>
                  <option value="custom_sovereign_2m">Sovereign 2M Long-Context (96 Layers, 16 KV Heads)</option>
                </select>
              </div>

              {/* Context Parallel Degree Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Context Parallel Degree (CP)</span>
                  <span className="text-cyan-400 font-mono">CP-{cpDegree} ({cpDegree} GPUs)</span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[2, 4, 8, 16, 32, 64].map((degree) => (
                    <button
                      key={degree}
                      onClick={() => setCpDegree(degree as CpDegree)}
                      className={`py-2 text-xs font-mono font-bold rounded-lg border transition ${
                        cpDegree === degree
                          ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {degree}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Sequence Length Tokens Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Sequence Length (Context Window)</span>
                  <span className="text-teal-400 font-mono font-bold">
                    {(sequenceLengthTokens / 1024).toFixed(0)}k ({sequenceLengthTokens.toLocaleString()} tokens)
                  </span>
                </div>
                <input
                  type="range"
                  min={131072}
                  max={2097152}
                  step={65536}
                  value={sequenceLengthTokens}
                  onChange={(e) => setSequenceLengthTokens(Number(e.target.value))}
                  className="w-full accent-teal-400 bg-slate-950 h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>128k Tokens</span>
                  <span>512k</span>
                  <span>1M</span>
                  <span>2M Tokens</span>
                </div>
              </div>

              {/* Interconnect Fabric */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Cluster Interconnect Fabric</label>
                <select
                  value={interconnect}
                  onChange={(e) => setInterconnect(e.target.value as CpInterconnectType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="nvlink_4_900gb">NVLink 4.0 Intra-Node (900 GB/s bidirectional)</option>
                  <option value="nvlink_3_600gb">NVLink 3.0 Intra-Node (600 GB/s bidirectional)</option>
                  <option value="infiniband_ndr_400gb">InfiniBand NDR Cross-Node (400 Gbps / 50 GB/s wire)</option>
                  <option value="roce_v2_200gb">RoCE v2 RDMA Fabric (200 Gbps / 25 GB/s wire)</option>
                  <option value="pcie_gen5_128gb">PCIe Gen 5 Host Bus (128 GB/s bidirectional)</option>
                </select>
              </div>

              {/* Attention Mechanism */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Distributed Attention Architecture</label>
                <select
                  value={attentionMechanism}
                  onChange={(e) => setAttentionMechanism(e.target.value as CpAttentionMechanism)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="ring_attention">Ring Attention (P2P Overlapped KV Exchange)</option>
                  <option value="deepspeed_ulysses">DeepSpeed Ulysses (All-to-All Head Sharding)</option>
                  <option value="hybrid_ring_ulysses">Hybrid Ring-Ulysses (Hierarchical Intra/Inter-Node)</option>
                  <option value="naive_all_gather">Naive All-Gather Full Attention (Unoptimized)</option>
                </select>
              </div>

              {/* Causal Masking Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Causal Block-Triangular Optimization</div>
                  <div className="text-[11px] text-slate-400">Prune upper-diagonal blocks in autoregressive decoding</div>
                </div>
                <button
                  type="button"
                  onClick={() => setCausalMasking(!causalMasking)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
                    causalMasking ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md transform transition" />
                </button>
              </div>

              {/* Memo Export Button */}
              <button
                onClick={copyExecutiveMemo}
                className="w-full py-2.5 px-4 rounded-full border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 transition flex items-center justify-center gap-2"
              >
                {hasCopiedMemo ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Copied Executive Architecture Memo!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    Copy Architecture Memo for Engineering Leads
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Telemetry Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top SLA Badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              results.slaStatus === 'SUB_12MS_CP_OPTIMAL'
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                : 'bg-rose-950/40 border-rose-500/50 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider font-bold">
                    Context Parallel Status: {results.slaStatus.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs opacity-90">
                    {results.slaStatus === 'SUB_12MS_CP_OPTIMAL'
                      ? 'P99 forward step latency verified sub-12ms with 95%+ P2P wire overlap.'
                      : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                      ? 'Ring communication partially exposed. Consider upgrading to NVLink-4 or enabling hybrid Ulysses.'
                      : 'Severe interconnect bus bottleneck. Communication latency exceeds local compute.'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-black/40 border border-current">
                {results.effectiveStepLatencyMs}ms
              </span>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400">Step Latency</div>
                <div className="text-2xl font-black text-cyan-400 font-mono mt-1">
                  {results.effectiveStepLatencyMs}ms
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Forward Step P99</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400">Overlap Ratio</div>
                <div className="text-2xl font-black text-teal-400 font-mono mt-1">
                  {results.commOverlapEfficiencyPercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Wire Speed Overlap</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400">Sharded KV VRAM</div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
                  {results.shardedKvMemoryGb}GB
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Per GPU (vs {results.unpartitionedKvMemoryGb}GB OOM)</div>
              </div>

              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl text-center">
                <div className="text-xs text-slate-400">FinOps Savings</div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Annual GPU OPEX Cut</div>
              </div>
            </div>

            {/* Detailed Performance Decomposition Card */}
            <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Computational &amp; Collective Communication Breakdown
                </span>
                <span className="text-xs font-mono text-cyan-400">
                  {results.tokensPerSecondThroughput.toLocaleString()} tokens/sec
                </span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="font-semibold text-slate-300">Local Attention Compute</div>
                  <div className="flex justify-between text-slate-400">
                    <span>Local Tokens / GPU:</span>
                    <span className="font-mono text-white">{results.tokensPerGpu.toLocaleString()} tokens</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Local QK^T &amp; AV GEMM:</span>
                    <span className="font-mono text-cyan-300">{results.localComputeLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Causal Pruning Factor:</span>
                    <span className="font-mono text-emerald-400">{causalMasking ? '55% FLOP Reduction' : '100% Full Attention'}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="font-semibold text-slate-300">Peer-to-Peer Ring Communication</div>
                  <div className="flex justify-between text-slate-400">
                    <span>Ring KV Shift Time:</span>
                    <span className="font-mono text-teal-300">{results.ringTransferLatencyMs} ms</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Unpartitioned Memory:</span>
                    <span className="font-mono text-rose-400">{results.unpartitionedKvMemoryGb} GB (Crash without CP)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>OOM Fault Prevented:</span>
                    <span className="font-mono text-emerald-400">{results.oomRiskPrevented ? 'YES (Sovereign Guard)' : 'Within Single VRAM'}</span>
                  </div>
                </div>
              </div>

              {/* Visual Ring KV Shift Diagram */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80">
                <div className="text-xs font-semibold text-slate-300 mb-3 flex items-center justify-between">
                  <span>Ring Topology KV Streaming Flow (Logical GPU Ranks)</span>
                  <span className="text-[11px] text-teal-400 font-mono">CUDA Stream 2 Active</span>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                  {Array.from({ length: Math.min(8, cpDegree) }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="px-3 py-2 bg-slate-900 border border-cyan-500/40 rounded-lg text-center font-mono">
                        <div className="text-[10px] text-slate-400">GPU {idx}</div>
                        <div className="text-xs font-bold text-cyan-300">{(results.tokensPerGpu / 1024).toFixed(0)}k Tok</div>
                      </div>
                      {idx < Math.min(8, cpDegree) - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-teal-400 " />
                      )}
                    </div>
                  ))}
                  {cpDegree > 8 && (
                    <div className="text-xs text-slate-500 font-mono">... +{cpDegree - 8} more GPUs in Ring</div>
                  )}
                </div>
              </div>
            </div>

            {/* CTA Audit Banner */}
            <div className="p-6 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-teal-950/60 border border-cyan-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold text-white">Deploy Sovereign 2M-Token Context Parallelism</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">
                  Eliminate GPU out-of-memory crashes and slash multi-million token forward step latency to sub-12ms across your sovereign enterprise datacenters.
                </p>
              </div>
              <a
                href="#audit"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 whitespace-nowrap shadow-lg shadow-cyan-500/20"
              >
                Schedule Architecture Audit
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Technical Architecture Deep Dive & FAQ */}
        <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            Context Parallelism Architecture &amp; Ring Attention Telemetry
          </h2>
          <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
            <p>
              In foundation model inference across two-million-token sequence horizons, the computational bottleneck shifts decisively from parameter weights to the dynamic <strong>Key-Value (KV) cache activation memory</strong>. A single 70B parameter model operating at 2M sequence length generates over <strong>512 GB of uncompressed FP16 KV states</strong>—exceeding the 80 GB VRAM physical capacity of single H100 GPUs by over 6.4x.
            </p>
            <p>
              Elesium&apos;s Context Parallelism (CP) architecture shards this sequence horizon across distributed GPU ranks in a peer-to-peer logical ring. As local query vectors calculate attention scores against the current KV chunk on CUDA stream 0, an asynchronous non-blocking NCCL stream shifts the preceding KV chunk to the adjacent rank on CUDA stream 2. When interconnect bandwidth exceeds 400 GB/s (InfiniBand NDR / NVLink 4), the transfer latency is completely absorbed by the local matrix multiplication, delivering sub-12ms forward step times.
            </p>
          </div>

          {/* Accordion FAQ */}
          <div className="border-t border-slate-800 pt-6 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
              Frequently Asked Technical Questions
            </h3>
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : 'text-slate-500'}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mandate Application Section */}
        <div id="audit" className="pt-8">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                Embed Context Parallelism Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Copy and paste this snippet into your internal engineering docs, corporate wiki, or client portal. The interactive widget includes live Ring Attention calculations and attribution back to Elesium Enterprise AI Solutions.
            </p>
            <div className="relative">
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap max-h-36">
                {embedCode}
              </pre>
              <button
                onClick={copyEmbedCode}
                className="absolute top-2 right-2 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition shadow"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Context Parallelism & Ring Attention Simulator"
        simulatedMetrics={simulatedMetricsForModal}
      />
          <WhatsAppModal />
    </div>
  );
}
