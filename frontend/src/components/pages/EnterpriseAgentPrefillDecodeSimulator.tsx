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
  Gauge,
  Sparkles,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';
import {
  calculatePrefillDecodePerformance,
  PrefillDecodeInputs,
  ModelFamily,
  KvTransportProtocol
} from '../calculator/agentPrefillDecodeModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentPrefillDecodeSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelFamily, setModelFamily] = useState<ModelFamily>('llama_3_70b');
  const [prefillWorkers, setPrefillWorkers] = useState<number>(4);
  const [decodeWorkers, setDecodeWorkers] = useState<number>(8);
  const [chunkSizeTokens, setChunkSizeTokens] = useState<number>(512);
  const [promptLength, setPromptLength] = useState<number>(2048);
  const [concurrencyQps, setConcurrencyQps] = useState<number>(120);
  const [kvTransport, setKvTransport] = useState<KvTransportProtocol>('roce_v2_rdma');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PrefillDecodeInputs = useMemo(() => ({
    modelFamily,
    prefillWorkers,
    decodeWorkers,
    chunkSizeTokens,
    promptLength,
    concurrencyQps,
    kvTransport,
    currency
  }), [
    modelFamily,
    prefillWorkers,
    decodeWorkers,
    chunkSizeTokens,
    promptLength,
    concurrencyQps,
    kvTransport,
    currency
  ]);

  const results = useMemo(() => calculatePrefillDecodePerformance(inputs), [inputs]);

  const handleReset = () => {
    setModelFamily('llama_3_70b');
    setPrefillWorkers(4);
    setDecodeWorkers(8);
    setChunkSizeTokens(512);
    setPromptLength(2048);
    setConcurrencyQps(120);
    setKvTransport('roce_v2_rdma');
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-prefill-decode-disaggregation-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-prefill-decode-disaggregation-simulator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium Prefill-Decode Disaggregation Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: PREFILL-DECODE DISAGGREGATION
Model: ${modelFamily.toUpperCase().replace(/_/g, ' ')}
Prefill Worker Pool: ${prefillWorkers} GPUs | Decode Pool: ${decodeWorkers} GPUs
Chunk Size: ${chunkSizeTokens} tokens | Transport: ${kvTransport.toUpperCase().replace(/_/g, ' ')}
Concurrency Target: ${concurrencyQps} QPS | Prompt Length: ${promptLength} tokens

PERFORMANCE & FINOPS METRICS:
- Time-to-First-Token (P99 TTFT): ${results.ttftLatencyMs}ms (vs ${results.unifiedBaselineTtftMs}ms Unified Baseline)
- Latency Reduction Factor: ${results.latencyReductionFactor}x faster initial response
- Inter-Token Latency (ITL): ${results.interTokenLatencyMs}ms (Decode workers unaffected by prefill)
- KV Transport Overhead: ${results.kvTransportLatencyMs}ms
- Head-of-Line Blocking Stalls: ${results.headOfLineBlockingStallPercent}% (Eliminated)
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
- Compliance SLA: ${results.slaStatus}

Architected via Elesium Enterprise Sovereign Infrastructure Engine.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "What is prefill-decode disaggregation and why is it essential for enterprise LLM serving?",
      a: "Prefill-decode disaggregation separates the compute-intensive prompt evaluation stage (prefill) from the memory-bandwidth-bound token generation stage (decode) across physically separated GPU worker pools. In unified serving, long prompts saturate tensor cores and stall ongoing decode requests. Disaggregation eliminates head-of-line blocking, slashing P99 TTFT under 15ms."
    },
    {
      q: "How does zero-copy RDMA network transport prevent KV-cache transfer bottlenecks?",
      a: "Once a prefill instance finishes computing key-value tensors for a prompt chunk, copying those tensors to CPU memory and across standard TCP sockets adds 8–15ms of latency. Using RoCE v2 or InfiniBand Remote Direct Memory Access (RDMA), GPU memory is copied directly across the high-speed datacenter fabric in sub-1.2ms without CPU intervention."
    },
    {
      q: "Why does disaggregated serving deliver significant FinOps infrastructure savings?",
      a: "Unified clusters force operators to buy uniform, high-cost GPUs (like NVIDIA H100 SXM5) for all workers. In disaggregated clusters, high-cost H100/B200 nodes are only needed for prefill workers, while decode workers can be deployed on cost-efficient, memory-dense GPUs (such as L40S or H200), slashing annual cloud OPEX by 35% to 55%."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent Prefill-Decode Disaggregation Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate prefill-decode disaggregation (PD-Disagg), chunked prompt execution, and zero-copy RDMA KV-cache transport to eliminate head-of-line blocking and achieve sub-15ms TTFT."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-prefill-decode-disaggregation-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            Tool #59 • Inference Disaggregation Architecture
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Enterprise Autonomous Agent Prefill-Decode Disaggregation Simulator
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400">
            Model distributed chunked prompt prefilling, zero-copy RDMA KV-cache network transport, and dedicated decode pools to eliminate head-of-line blocking and guarantee sub-15ms TTFT SLAs.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Cluster Sizing & Routing Controls
              </h2>
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Model Family */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Foundation Model Family</label>
              <select
                value={modelFamily}
                onChange={(e) => setModelFamily(e.target.value as ModelFamily)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="llama_3_70b">Llama-3-70B (Sovereign General Inference)</option>
                <option value="deepseek_v2_236b">DeepSeek-V2-236B MoE (Sparse Multi-Agent)</option>
                <option value="qwen_2_5_72b">Qwen-2.5-72B (High-Precision Enterprise)</option>
                <option value="mixtral_8x22b">Mixtral-8x22B (MoE Low-Latency)</option>
              </select>
            </div>

            {/* Prefill & Decode Workers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Prefill GPUs</span>
                  <span className="text-emerald-400 font-mono font-bold">{prefillWorkers} GPUs</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={32}
                  value={prefillWorkers}
                  onChange={(e) => setPrefillWorkers(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Decode GPUs</span>
                  <span className="text-blue-400 font-mono font-bold">{decodeWorkers} GPUs</span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={64}
                  value={decodeWorkers}
                  onChange={(e) => setDecodeWorkers(Number(e.target.value))}
                  className="w-full accent-blue-500 bg-slate-800"
                />
              </div>
            </div>

            {/* Chunk Size & Prompt Length */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Chunk Size (Tokens)</label>
                <select
                  value={chunkSizeTokens}
                  onChange={(e) => setChunkSizeTokens(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={128}>128 tokens (Fine-grained)</option>
                  <option value={256}>256 tokens (Balanced)</option>
                  <option value={512}>512 tokens (Standard)</option>
                  <option value={1024}>1024 tokens (Coarse)</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Prompt Length</span>
                  <span className="text-emerald-400 font-mono font-bold">{promptLength} tok</span>
                </div>
                <input
                  type="range"
                  min={512}
                  max={8192}
                  step={256}
                  value={promptLength}
                  onChange={(e) => setPromptLength(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-800"
                />
              </div>
            </div>

            {/* Concurrency QPS */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300">Concurrency Target (QPS)</span>
                <span className="text-emerald-400 font-mono font-bold">{concurrencyQps} QPS</span>
              </div>
              <input
                type="range"
                min={10}
                max={500}
                step={10}
                value={concurrencyQps}
                onChange={(e) => setConcurrencyQps(Number(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800"
              />
            </div>

            {/* KV Transport Protocol */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">KV-Cache Transport Protocol</label>
              <select
                value={kvTransport}
                onChange={(e) => setKvTransport(e.target.value as KvTransportProtocol)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="roce_v2_rdma">RoCE v2 RDMA (Zero-Copy 100GbE Kernel Bypass)</option>
                <option value="infiniband_direct">InfiniBand Direct (Sub-1ms Ultra-Low Latency)</option>
                <option value="pcie_p2p">PCIe P2P Direct (Single-Chassis Cross-Card)</option>
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
                    currency === 'INR' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  INR (₹ Lakhs)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 py-1.5 text-xs font-semibold transition-colors ${
                    currency === 'USD' ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
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
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">P99 TTFT Latency</div>
                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {results.ttftLatencyMs}ms
                </div>
                <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  vs {results.unifiedBaselineTtftMs}ms Unified
                </div>
              </div>

              <div className="bg-slate-900/90 border border-blue-500/30 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">Latency Speedup</div>
                <div className="text-2xl font-black text-blue-400 mt-1 font-mono">
                  {results.latencyReductionFactor}x
                </div>
                <div className="text-[11px] text-blue-400/80 mt-1">
                  Faster Initial Token
                </div>
              </div>

              <div className="bg-slate-900/90 border border-purple-500/30 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400">Inter-Token Latency</div>
                <div className="text-2xl font-black text-purple-400 mt-1 font-mono">
                  {results.interTokenLatencyMs}ms
                </div>
                <div className="text-[11px] text-purple-400/80 mt-1">
                  Zero Prefill Stalls
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">KV Transport Latency</div>
                <div className="text-2xl font-black text-white mt-1 font-mono">
                  {results.kvTransportLatencyMs}ms
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  RDMA Direct Transfer
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <div className="text-xs text-slate-400">HOL Blocking Stalls</div>
                <div className="text-2xl font-black text-emerald-400 mt-1 font-mono">
                  {results.headOfLineBlockingStallPercent}%
                </div>
                <div className="text-[11px] text-emerald-500 mt-1">
                  Near-Zero Interference
                </div>
              </div>

              <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-4 shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs text-slate-400">Annual FinOps Savings</div>
                <div className="text-lg sm:text-xl font-black text-amber-400 mt-1 font-mono">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[11px] text-amber-400/80 mt-1">
                  Asymmetric Sizing
                </div>
              </div>
            </div>

            {/* Architecture Visualization Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  Disaggregated Prefill-Decode Dataflow Architecture
                </h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  results.slaStatus === 'SUB_15MS_LEADER'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dataflow SVG / Visual */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
                {/* Prefill Block */}
                <div className="flex-1 bg-emerald-950/40 border border-emerald-500/30 rounded-lg p-4 space-y-2 w-full">
                  <div className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                    <Cpu className="w-3.5 h-3.5" />
                    Prefill Pool ({prefillWorkers} GPUs)
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Chunked: {chunkSizeTokens} tok/step
                  </div>
                  <div className="text-[11px] text-emerald-500 font-mono">
                    {results.prefillThroughputTokPerSec.toLocaleString()} tok/s throughput
                  </div>
                </div>

                {/* RDMA Channel */}
                <div className="flex flex-col items-center justify-center px-2 py-1 text-slate-400">
                  <div className="text-[10px] font-mono text-cyan-400 font-bold mb-1">
                    {kvTransport.toUpperCase().replace(/_/g, ' ')}
                  </div>
                  <div className="flex items-center gap-1 text-cyan-400">
                    <ArrowRight className="w-4 h-4  hidden md:block" />
                    <span className="text-[11px] font-mono font-bold">{results.kvTransportLatencyMs}ms</span>
                    <ArrowRight className="w-4 h-4  hidden md:block" />
                  </div>
                  <div className="text-[9px] text-slate-500 mt-1">Zero-Copy Kernel Bypass</div>
                </div>

                {/* Decode Block */}
                <div className="flex-1 bg-blue-950/40 border border-blue-500/30 rounded-lg p-4 space-y-2 w-full">
                  <div className="text-xs font-bold text-blue-400 flex items-center justify-center gap-1">
                    <Gauge className="w-3.5 h-3.5" />
                    Decode Pool ({decodeWorkers} GPUs)
                  </div>
                  <div className="text-xs text-slate-300 font-mono">
                    Inter-Token: {results.interTokenLatencyMs}ms
                  </div>
                  <div className="text-[11px] text-blue-500 font-mono">
                    {results.decodeThroughputTokPerSec.toLocaleString()} tok/s throughput
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={copyExecutiveMemo}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
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
                  <ChevronDown className={`w-4 h-4 transform transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
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

        {/* Lead Generation & Mandate Application Section */}
        <div className="border border-slate-800 rounded-2xl p-6 sm:p-10 bg-gradient-to-b from-slate-900/90 to-slate-950">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Deploy Sovereign Disaggregated Inference in Your Datacenter
            </h2>
            <p className="text-slate-400 text-sm">
              Schedule an enterprise architecture audit to migrate your LLM serving infrastructure to vLLM/SGLang prefill-decode disaggregation with RoCE v2 RDMA acceleration.
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
                <Code className="w-4 h-4 text-emerald-400" />
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
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
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
        toolName="Prefill-Decode Disaggregation Simulator"
        simulatedMetrics={[
          { label: 'Time-to-First-Token', value: `${results.ttftLatencyMs}ms`, detail: 'vs 184ms unified' },
          { label: 'Latency Reduction', value: `${results.latencyReductionFactor}x`, detail: 'Faster initial response' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Asymmetric GPU sizing' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
