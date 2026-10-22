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
  Coins,
  CheckCircle2,
  Gauge,
  Sparkles,
  Cpu
} from 'lucide-react';
import {
  calculateSlidingWindow,
  SlidingWindowInputs,
  ModelArchitecture,
  HardwareCluster
} from '../calculator/agentSlidingWindowModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentSlidingWindowSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [streamingSequenceLength, setStreamingSequenceLength] = useState<number>(524288);
  const [slidingWindowSize, setSlidingWindowSize] = useState<number>(4096);
  const [numAttentionSinks, setNumAttentionSinks] = useState<number>(4);
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SlidingWindowInputs = useMemo(() => ({
    modelArchitecture,
    streamingSequenceLength,
    slidingWindowSize,
    numAttentionSinks,
    hardwareCluster,
    currency
  }), [
    modelArchitecture,
    streamingSequenceLength,
    slidingWindowSize,
    numAttentionSinks,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateSlidingWindow(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-sliding-window-attention-simulator" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const memoContent = `=== ENTERPRISE AI ARCHITECTURE MEMO: SLIDING-WINDOW ATTENTION & RING KV SIMULATION ===
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Hardware Cluster: ${hardwareCluster.toUpperCase().replace(/_/g, ' ')}
Total Stream Horizon: ${streamingSequenceLength.toLocaleString()} tokens
Sliding Window: ${slidingWindowSize.toLocaleString()} tokens
Attention Sinks: ${numAttentionSinks} anchor tokens

SIMULATION RESULTS:
- Active KV Cache Tokens: ${results.activeKvTokens.toLocaleString()}
- Bounded VRAM Footprint: ${results.vramBoundedGb} GB (vs Unbounded: ${results.unboundedBaselineVramGb} GB)
- Memory Saved: -${results.memoryReductionPercent}%
- Streaming Decode Latency: ${results.perTokenDecodeLatencyMs} ms / token (vs Unbounded: ${results.baselineUnboundedLatencyMs} ms)
- Projected Annual FinOps Savings: ${results.annualClusterSavings}
- Production Streaming SLA: ${results.slaStatus}

RING BUFFER & ANCHOR TRACE:
${results.ringBufferTrace.map(s => `* ${s.stage} (${s.tokenRange}): ${s.description} -> Allocated: ${s.vramMb} MB [${s.status}]`).join('\n')}

Issued by: Elesium AI Systems Architecture Advisory (https://elesium.online)`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoContent);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const faqs = [
    {
      q: "What is Sliding-Window Attention and how does it prevent infinite stream OOM crashes?",
      a: "In standard autoregressive transformers, the key-value cache expands linearly with every generated token, inevitably causing Out-Of-Memory (OOM) crashes during continuous streaming. Sliding-window attention restricts self-attention computation to the most recent W tokens (e.g. 4,096 tokens). As new tokens arrive, expired historical positions are overwritten in-place in a circular Ring buffer, keeping VRAM usage strictly bounded and constant."
    },
    {
      q: "Why are Attention Sinks required to prevent perplexity collapse?",
      a: "Research demonstrates that transformer attention heads allocate an immense amount of attention score to the very first 2 to 4 tokens in the prompt—irrespective of their semantic content. If these initial tokens are evicted from the KV cache, the softmax normalizer collapses, causing perplexity to explode and the model to output gibberish. Preserving these initial tokens as 'attention sinks' stabilizes streaming inference indefinitely."
    },
    {
      q: "How does circular Ring KV eviction achieve sub-5ms per-token decode latency?",
      a: "Traditional eviction schemes require shifting memory tensors in GPU DRAM, inducing costly memory reallocation stalls. Ring KV eviction utilizes modular ring buffer indexing (token_index % window_size), writing new key-value tensors directly over the oldest entries in-place. This enables zero-reallocation continuous decoding at sub-5ms latency on NVIDIA H100 and Blackwell GPUs."
    },
    {
      q: "Can sliding-window streaming agents be deployed air-gapped under India DPDP Act 2023?",
      a: "Yes. Elesium deploys sovereign sliding-window streaming runtimes (vLLM and TensorRT-LLM) on dedicated on-premise NVIDIA H100 and Blackwell clusters inside your air-gapped private VPC. All real-time telemetry feeds, patient vital streams, and KV cache buffers stay strictly within your sovereign boundary, satisfying Section 8 of the Indian DPDP Act 2023."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Autonomous Agent Sliding-Window Attention &amp; Ring KV Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate enterprise sliding-window attention, circular Ring KV buffer eviction, attention sink preservation, and constant-VRAM streaming LLM inference."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-sliding-window-attention-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-sky-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-semibold mb-4 tracking-wide uppercase">
            <RotateCcw className="w-3.5 h-3.5" />
            Tool #54 · Enterprise Streaming Infrastructure &amp; Compute
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Enterprise Autonomous Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">Sliding-Window Attention</span> &amp; Ring KV Simulator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Model circular Ring KV buffer eviction, initial attention sink preservation, and bounded constant-VRAM memory allocation across infinite streaming multi-agent workflows. Quantify sub-5ms per-token decode latency, OOM elimination, and annual cluster FinOps savings.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-sky-400" />
              Embed This Simulator
            </button>
            <button
              onClick={handleCopyMemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 text-xs font-medium transition-all shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Architecture Memo'}
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Currency:
              <button
                onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
                className="font-bold text-sky-400 hover:text-sky-300 transition-colors ml-1"
              >
                {currency}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Simulation Parameters
                </h2>
              </div>

              {/* Model Architecture */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Generative Architecture</span>
                  <span className="text-sky-400 font-mono text-[11px]">
                    {modelArchitecture === 'mistral_large_123b' ? 'Mistral (Native SWA)' : 'Dense / MoE'}
                  </span>
                </label>
                <select
                  value={modelArchitecture}
                  onChange={e => setModelArchitecture(e.target.value as ModelArchitecture)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="llama_3_70b">Llama-3-70B (80 Layers, GQA)</option>
                  <option value="mistral_large_123b">Mistral Large 123B (Native SWA)</option>
                  <option value="qwen_2_5_72b">Qwen-2.5-72B (Long Stream)</option>
                  <option value="deepseek_r1_671b">DeepSeek-R1-671B (MoE MLA)</option>
                </select>
              </div>

              {/* Streaming Sequence Length */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Continuous Stream Horizon</span>
                  <span className="font-mono text-sky-400 font-bold">{streamingSequenceLength.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="8192"
                  max="4194304"
                  step="32768"
                  value={streamingSequenceLength}
                  onChange={e => setStreamingSequenceLength(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>8k (Short)</span>
                  <span>524k (Day Stream)</span>
                  <span>4M (Infinite)</span>
                </div>
              </div>

              {/* Sliding Window Size */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Sliding Window Size (W)</span>
                  <span className="font-mono text-teal-400 font-bold">{slidingWindowSize.toLocaleString()} tokens</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1024, 2048, 4096, 8192].map(size => (
                    <button
                      key={size}
                      onClick={() => setSlidingWindowSize(size)}
                      className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        slidingWindowSize === size
                          ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attention Sinks */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Attention Sinks (Anchor Tokens)</span>
                  <span className="font-mono text-indigo-400 font-bold">{numAttentionSinks} tokens</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 8, 16].map(sinks => (
                    <button
                      key={sinks}
                      onClick={() => setNumAttentionSinks(sinks)}
                      className={`py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        numAttentionSinks === sinks
                          ? 'bg-indigo-950/80 border-indigo-500 text-indigo-300 font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {sinks}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Target */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Hardware Cluster Node</span>
                  <span className="text-sky-400 font-mono text-[11px]">
                    {hardwareCluster === 'nvidia_h100_sxm5' ? '4.2 ms / token' : 'Custom'}
                  </span>
                </label>
                <select
                  value={hardwareCluster}
                  onChange={e => setHardwareCluster(e.target.value as HardwareCluster)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 (80GB HBM3)</option>
                  <option value="nvidia_b200_nvl">NVIDIA B200 NVL (192GB HBM3e)</option>
                  <option value="nvidia_a100_80gb">NVIDIA A100 (80GB SXM4)</option>
                  <option value="nvidia_l40s_ada">NVIDIA L40S Ada (48GB PCIe)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results & Visualizer Column */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top Scorecard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Active KV Tokens
                </div>
                <div className="mt-1 text-2xl font-black text-sky-400 font-mono">
                  {results.activeKvTokens.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Constant buffer size
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Decode Latency
                </div>
                <div className="mt-1 text-2xl font-black text-teal-400 font-mono">
                  {results.perTokenDecodeLatencyMs} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Per-token constant SLA
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  VRAM Saved
                </div>
                <div className="mt-1 text-2xl font-black text-indigo-400 font-mono">
                  -{results.memoryReductionPercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {results.vramBoundedGb}GB vs {results.unboundedBaselineVramGb}GB
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  FinOps Savings
                </div>
                <div className="mt-1 text-xl font-black text-emerald-400 font-mono">
                  {results.annualClusterSavings}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Annual GPU compute
                </div>
              </div>
            </div>

            {/* Latency Comparison Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Continuous Generation Latency Benchmark
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide ${
                  results.slaStatus === 'SUB_5MS_STREAMING_LEADER'
                    ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400'
                    : results.slaStatus === 'SUB_10MS_ACCEPTABLE'
                    ? 'bg-amber-950/80 border border-amber-800/80 text-amber-400'
                    : 'bg-rose-950/80 border border-rose-800/80 text-rose-400'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Baseline */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400">Baseline Unbounded Streaming</div>
                  <div className="text-3xl font-black text-rose-400 font-mono mt-1">
                    {results.baselineUnboundedLatencyMs} <span className="text-sm font-medium text-slate-500">ms/tok</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Unbounded linear memory expansion consumes {results.unboundedBaselineVramGb} GB, triggering memory bandwidth choke and eventual Out-Of-Memory failure.
                  </p>
                </div>

                {/* Sliding Window */}
                <div className="bg-slate-950/80 border border-sky-900/40 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-sky-500/20 text-sky-400 text-[10px] font-mono font-bold rounded-bl">
                    Constant Time O(1)
                  </div>
                  <div className="text-xs font-semibold text-sky-400">Ring KV &amp; Attention Sinks</div>
                  <div className="text-3xl font-black text-sky-300 font-mono mt-1">
                    {results.perTokenDecodeLatencyMs} <span className="text-sm font-medium text-slate-500">ms/tok</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Bounded circular memory holds {results.vramBoundedGb} GB permanently. Generation runs indefinitely with zero memory reallocation stalls.
                  </p>
                </div>
              </div>
            </div>

            {/* Ring Buffer & Attention Sink Visualizer Trace */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Cpu className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Ring Buffer &amp; Attention Sink Memory Layout
                </h3>
              </div>

              <div className="space-y-3">
                {results.ringBufferTrace.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      stage.status === 'ANCHORED'
                        ? 'bg-amber-950/20 border-amber-900/40'
                        : stage.status === 'ROLLING_ACTIVE'
                        ? 'bg-sky-950/20 border-sky-900/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          stage.status === 'ANCHORED'
                            ? 'bg-amber-400'
                            : stage.status === 'ROLLING_ACTIVE'
                            ? 'bg-sky-400'
                            : 'bg-slate-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-200">
                          {stage.stage}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        stage.status === 'ANCHORED'
                          ? 'bg-amber-900/50 text-amber-300'
                          : stage.status === 'ROLLING_ACTIVE'
                          ? 'bg-sky-900/50 text-sky-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {stage.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      {stage.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Token Range: <strong className="text-slate-200">{stage.tokenRange}</strong></span>
                      {stage.vramMb > 0 && (
                        <span>VRAM Allocated: <strong className="text-teal-400">{stage.vramMb} MB</strong></span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Technical FAQ Accordion */}
        <section className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Sliding-Window Attention &amp; Ring KV Engineering Invariants
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mandate Application Section */}
        <section className="mt-16 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign Streaming LLM Mandate
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Deploy Infinite Streaming LLM Runtimes on Your VPC
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Schedule a technical deployment audit with our Principal AI Systems Architects. Eliminate streaming OOM crashes, sustain sub-5ms decode latency, and achieve DPDP Act 2023 compliance.
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
        </section>

      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Embed This Simulator</h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Copy this lightweight iframe snippet to embed the live simulator on your internal developer documentation, Notion portal, or engineering blog.
            </p>
            <textarea
              readOnly
              value={embedSnippet}
              className="w-full h-32 bg-slate-950 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-300 focus:outline-none focus:border-sky-500 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md shadow-sky-600/20"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise Autonomous Agent Sliding-Window Attention Simulator"
        simulatedMetrics={[
          { label: 'Active KV Tokens', value: `${results.activeKvTokens.toLocaleString()}` },
          { label: 'Decode Latency', value: `${results.perTokenDecodeLatencyMs} ms` },
          { label: 'Bounded VRAM', value: `${results.vramBoundedGb} GB` },
          { label: 'VRAM Saved', value: `-${results.memoryReductionPercent}%` },
          { label: 'FinOps Savings', value: results.annualClusterSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
