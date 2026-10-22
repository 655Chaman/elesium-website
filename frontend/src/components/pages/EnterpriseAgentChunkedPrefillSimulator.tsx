import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Layers
} from 'lucide-react';
import {
  calculateChunkedPrefill,
  ChunkedPrefillInputs,
  ServingEngine,
  GpuArchitecture,
  KvCacheDataType
} from '../calculator/agentChunkedPrefillModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentChunkedPrefillSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [concurrentUsers, setConcurrentUsers] = useState<number>(64);
  const [promptContextLength, setPromptContextLength] = useState<number>(8192);
  const [sharedSystemPromptTokens, setSharedSystemPromptTokens] = useState<number>(3072);
  const [prefillChunkSize, setPrefillChunkSize] = useState<number>(512);
  const [servingEngine, setServingEngine] = useState<ServingEngine>('sglang_radix_attention');
  const [gpuArchitecture, setGpuArchitecture] = useState<GpuArchitecture>('nvidia_h100_80gb');
  const [kvCacheDataType, setKvCacheDataType] = useState<KvCacheDataType>('fp8_e4m3');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ChunkedPrefillInputs = useMemo(() => ({
    concurrentUsers,
    promptContextLength,
    sharedSystemPromptTokens,
    prefillChunkSize,
    servingEngine,
    gpuArchitecture,
    kvCacheDataType,
    currency
  }), [
    concurrentUsers,
    promptContextLength,
    sharedSystemPromptTokens,
    prefillChunkSize,
    servingEngine,
    gpuArchitecture,
    kvCacheDataType,
    currency
  ]);

  const results = useMemo(() => {
    return calculateChunkedPrefill(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-chunked-prefill-radix-attention-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#6366f1;text-decoration:underline;">Elesium Sovereign Serving</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE CHUNKED PREFILL & RADIX ATTENTION KV CACHE AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-chunked-prefill-radix-attention-simulator)

INFERENCE CLUSTER & SERVING CONFIGURATION:
- Concurrent Active Streams: ${concurrentUsers} Users
- Prompt Context Depth: ${promptContextLength.toLocaleString()} Tokens
- Shared System Prompt Prefix: ${sharedSystemPromptTokens.toLocaleString()} Tokens
- Chunked Prefill Step Size: ${prefillChunkSize} Tokens
- Serving Runtime: ${servingEngine.replace(/_/g, ' ').toUpperCase()}
- GPU Hardware: ${gpuArchitecture.replace(/_/g, ' ').toUpperCase()}
- KV Cache Precision: ${kvCacheDataType.toUpperCase()}

LATENCY & HARDWARE BENCHMARKS:
- Time-to-First-Token (TTFT): ${results.ttftMilliseconds} ms
- Per-User Generation Speed: ${results.decodeTokensPerSecondPerUser} tok/s
- Prefix Cache Hit Ratio: ${results.prefixCacheHitRatioPct}%
- GPU VRAM Conserved: ${results.kvCacheMemorySavedGb} GB
- Total VRAM Required: ${results.totalVramRequiredGb} GB
- Max Concurrent Users Before OOM: ${results.maxConcurrentSupported}
- Est. Annual Infrastructure TCO: ${currency === 'INR' ? '₹' : '$'}${results.annualGpuSpend.toLocaleString()}
- Est. Annual Compute Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualComputeSavings.toLocaleString()}
- Status Classification: ${results.statusClassification}

TECHNICAL RECOMMENDATIONS:
1. SGLang RadixAttention maintains a LRU radix tree of prompt prefixes, eliminating recomputation.
2. Chunked prefill interleaves small prompt token batches with active generation steps to eliminate decode stutter.
3. FP8 E4M3 KV cache quantization halves memory bandwidth demands with zero degradation in reasoning accuracy.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // SVG Chart points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.ttftTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(80, results.ttftMilliseconds * 1.6);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.ttftMs / maxLatency) * (height * 0.75) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.ttftTrace, results.ttftMilliseconds]);

  // Structured Data (SoftwareApplication & FAQPage)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        'name': 'Enterprise Autonomous Agent Chunked Prefill & Radix Attention KV Cache Paging Simulator',
        'applicationCategory': 'DeveloperApplication',
        'operatingSystem': 'Cloud, Kubernetes, Linux, Bare Metal',
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'USD'
        },
        'description': 'Simulate LLM serving Time-to-First-Token (TTFT), RadixAttention prefix caching, chunked prefill head-of-line blocking mitigation, and GPU VRAM savings.'
      },
      {
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'What is chunked prefill in modern LLM serving engines?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Chunked prefill splits large input prompt contexts into smaller token chunks (e.g. 512 tokens). Instead of blocking the entire GPU compute pipeline during a multi-second prompt ingestion phase, the engine interleaves small prefill chunks with ongoing token decoding steps, eliminating user-facing generation stutter and stabilizing TTFT.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How does SGLang RadixAttention differ from conventional vLLM PagedAttention?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'While PagedAttention manages memory allocation like an OS virtual memory page table to eliminate internal fragmentation, RadixAttention builds an explicit radix tree data structure over token sequences. This allows multiple concurrent requests sharing system instructions, few-shot examples, or enterprise RAG context to reuse pre-computed KV cache tensors directly from memory.'
            }
          },
          {
            '@type': 'Question',
            'name': 'Why does FP8 KV caching reduce TTFT and boost token decode throughput?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'LLM decoding is memory-bandwidth bound rather than compute bound. Compressing the Key-Value cache from FP16 (2 bytes/token) to FP8 (1 byte/token) halves the bytes transferred over high-bandwidth memory (HBM) on each autoregressive step, directly doubling maximum batch size and increasing token decode throughput by up to 1.8x.'
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-300 font-sans pb-24">
      <Helmet>
        <title>Enterprise Chunked Prefill &amp; Radix Attention KV Cache Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate LLM serving Time-to-First-Token (TTFT), RadixAttention prefix caching, chunked prefill head-of-line blocking mitigation, and GPU VRAM savings."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-chunked-prefill-radix-attention-simulator" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      {/* Top Banner Breadcrumbs */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <a href="/" className="hover:text-indigo-400 transition-colors">Home</a>
            <span>/</span>
            <a href="/solutions" className="hover:text-indigo-400 transition-colors">Tools</a>
            <span>/</span>
            <span className="text-indigo-400 font-medium">Chunked Prefill &amp; Radix Attention</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-300 hover:text-white hover:border-slate-600 transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-xs font-medium text-indigo-400 hover:bg-indigo-500/20 transition-all shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inference Serving Engine #43</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-4xl">
          Enterprise Autonomous Agent Chunked Prefill &amp; Radix Attention KV Cache Paging Simulator
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
          Simulate LLM serving Time-to-First-Token (TTFT), RadixAttention prefix caching hit ratios, 
          chunked prefill head-of-line blocking mitigation, and GPU VRAM savings across high-concurrency enterprise clusters.
        </p>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-4">
        {/* Left Column: Interactive Parameters (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-5 h-5 text-indigo-400" />
                <h2 className="font-bold text-white text-base">Serving Cluster Parameters</h2>
              </div>
              <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${currency === 'INR' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${currency === 'USD' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Slider 1: Concurrent Users */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium">Concurrent Active Streams</span>
                <span className="font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                  {concurrentUsers} Concurrent Sessions
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={concurrentUsers}
                onChange={(e) => setConcurrentUsers(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>10 Sessions</span>
                <span>500 Sessions</span>
                <span>1000 Sessions</span>
              </div>
            </div>

            {/* Slider 2: Prompt Context Depth */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium">Prompt Context Length</span>
                <span className="font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {promptContextLength.toLocaleString()} Tokens
                </span>
              </div>
              <input
                type="range"
                min="1024"
                max="65536"
                step="1024"
                value={promptContextLength}
                onChange={(e) => setPromptContextLength(Number(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>1k Tokens</span>
                <span>32k Tokens</span>
                <span>65k Tokens</span>
              </div>
            </div>

            {/* Slider 3: Shared System Prefix */}
            <div>
              <div className="flex justify-between items-center text-sm mb-2">
                <span className="text-slate-300 font-medium">Shared System Prompt Prefix</span>
                <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {sharedSystemPromptTokens.toLocaleString()} Tokens
                </span>
              </div>
              <input
                type="range"
                min="256"
                max="16384"
                step="256"
                value={sharedSystemPromptTokens}
                onChange={(e) => setSharedSystemPromptTokens(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>256 Tokens</span>
                <span>8,192 Tokens</span>
                <span>16,384 Tokens</span>
              </div>
            </div>

            {/* Grid: Serving Engine & Hardware */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Serving Runtime</label>
                <select
                  value={servingEngine}
                  onChange={(e) => setServingEngine(e.target.value as ServingEngine)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="sglang_radix_attention">SGLang RadixAttention</option>
                  <option value="vllm_paged_attention">vLLM PagedAttention</option>
                  <option value="tensorrt_llm_inflight">TensorRT-LLM Inflight</option>
                  <option value="naive_linear_attention">Naive Linear Attention</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">GPU Hardware</label>
                <select
                  value={gpuArchitecture}
                  onChange={(e) => setGpuArchitecture(e.target.value as GpuArchitecture)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="nvidia_h100_80gb">NVIDIA H100 (80GB SXM)</option>
                  <option value="nvidia_a100_80gb">NVIDIA A100 (80GB PCIe)</option>
                  <option value="nvidia_l40s_48gb">NVIDIA L40S (48GB)</option>
                  <option value="nvidia_l4_24gb">NVIDIA L4 (24GB)</option>
                </select>
              </div>
            </div>

            {/* Grid: Precision & Chunk Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">KV Cache Precision</label>
                <select
                  value={kvCacheDataType}
                  onChange={(e) => setKvCacheDataType(e.target.value as KvCacheDataType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="fp8_e4m3">FP8 E4M3 (High Fidelity)</option>
                  <option value="fp16">FP16 Full Precision</option>
                  <option value="int4_awq">INT4 AWQ (Max Density)</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 font-medium block mb-1.5">Prefill Chunk Size</label>
                <select
                  value={prefillChunkSize}
                  onChange={(e) => setPrefillChunkSize(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                >
                  <option value={256}>256 Tokens (Zero Stutter)</option>
                  <option value={512}>512 Tokens (Balanced)</option>
                  <option value={1024}>1024 Tokens (High Throughput)</option>
                  <option value={2048}>2048 Tokens (Batch Heavy)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulated Metrics & Telemetry (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Status Banner */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Serving Architecture Status</span>
              <div className="text-xl font-black text-white mt-1 flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                <span>{results.statusClassification.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{results.recommendationNote}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">Prefix Hit Ratio</span>
              <div className="text-2xl font-black font-mono text-cyan-400 mt-0.5">
                {results.prefixCacheHitRatioPct}%
              </div>
            </div>
          </div>

          {/* 4 Primary Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Zap className="w-3.5 h-3.5 text-indigo-400" />
                <span>TTFT Latency</span>
              </div>
              <div className="text-2xl font-black font-mono text-indigo-400 mt-1">
                {results.ttftMilliseconds} <span className="text-xs text-slate-400 font-normal">ms</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Time to first token</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>Decode Speed</span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {results.decodeTokensPerSecondPerUser} <span className="text-xs text-slate-400 font-normal">tok/s</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">per concurrent stream</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>VRAM Saved</span>
              </div>
              <div className="text-2xl font-black font-mono text-purple-400 mt-1">
                {results.kvCacheMemorySavedGb} <span className="text-xs text-slate-400 font-normal">GB</span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">radix tree deduplicated</span>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>Annual Savings</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {currency === 'INR' ? '₹' : '$'}{(results.annualComputeSavings / 1000).toFixed(0)}k
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">vs naive un-cached</span>
            </div>
          </div>

          {/* Dynamic SVG TTFT Latency Chart */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 " />
                <span className="font-semibold text-white">Time-to-First-Token (TTFT) Scaling Curve (512 to 65k Context Depth)</span>
              </div>
              <span className="text-slate-400 font-mono text-[11px]">Chunk Interleaving</span>
            </div>

            <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-950 border border-slate-800 p-2">
              <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chunkedPrefillPageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {svgData.path && (
                  <>
                    <path
                      d={`${svgData.path} L 500 140 L 0 140 Z`}
                      fill="url(#chunkedPrefillPageGrad)"
                    />
                    <path
                      d={svgData.path}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </div>

            <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-center text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">CURRENT TTFT</span>
                <span className="font-mono font-bold text-indigo-400">{results.ttftMilliseconds} ms</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">TOTAL VRAM NEEDED</span>
                <span className="font-mono font-bold text-white">{results.totalVramRequiredGb} GB</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">MAX STREAMS SUPPORTED</span>
                <span className="font-mono font-bold text-emerald-400">{results.maxConcurrentSupported}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">ANNUAL GPU OPEX</span>
                <span className="font-mono font-bold text-cyan-400">
                  {currency === 'INR' ? '₹' : '$'}{results.annualGpuSpend.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTA Box */}
          <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Deploy Sovereign On-Premise LLM Serving</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md">
                Deploy private vLLM or SGLang clusters inside your own AWS ap-south-1 VPC with sub-20ms TTFT and DPDP Act 2023 compliance.
              </p>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger>
                <button className="px-5 py-2.5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center space-x-1.5 whitespace-nowrap">
                  <span>Schedule Inference Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="p-6">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>
      </div>

      {/* Technical Deep Dive Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-12">
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Advanced Inference Optimization &amp; KV Cache Architecture
          </h2>
          <p className="text-sm text-slate-400 mt-2 max-w-3xl">
            How sovereign enterprise architectures achieve 4x serving throughput and eliminate prompt prefill latency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">SGLang RadixAttention Tree Caching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rather than treating each prompt as an isolated sequence, RadixAttention organizes KV cache tensors in a dynamic radix tree. 
                Shared system prompts, few-shot examples, and corporate handbooks are computed once and reused across all concurrent streams.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Chunked Prefill &amp; Head-of-Line Dequeuing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Massive 32k context prompt ingestion historically starved ongoing token decodes. Chunked prefill partitions ingestion into 512-token chunks, 
                interleaving prefill steps with active decodes to eliminate user-facing generation stutter.
              </p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">FP8 E4M3 Quantized KV Cache</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                LLM decoding is bounded by GPU High-Bandwidth Memory (HBM) bandwidth. Compressing the KV cache to FP8 halves tensor transfer overhead 
                on each forward pass, enabling 2x concurrent stream density without loss of numeric stability.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="border-t border-slate-800 pt-10">
          <h2 className="text-2xl font-bold text-white tracking-tight mb-6">Frequently Asked Technical Questions</h2>
          <div className="space-y-4 max-w-4xl">
            {[
              {
                q: "What is chunked prefill in modern LLM serving engines?",
                a: "Chunked prefill splits large input prompt contexts into smaller token chunks (e.g. 512 tokens). Instead of blocking the entire GPU compute pipeline during a multi-second prompt ingestion phase, the engine interleaves small prefill chunks with ongoing token decoding steps, eliminating user-facing generation stutter and stabilizing TTFT."
              },
              {
                q: "How does SGLang RadixAttention differ from conventional vLLM PagedAttention?",
                a: "While PagedAttention manages memory allocation like an OS virtual memory page table to eliminate internal fragmentation, RadixAttention builds an explicit radix tree data structure over token sequences. This allows multiple concurrent requests sharing system instructions, few-shot examples, or enterprise RAG context to reuse pre-computed KV cache tensors directly from memory."
              },
              {
                q: "Why does FP8 KV caching reduce TTFT and boost token decode throughput?",
                a: "LLM decoding is memory-bandwidth bound rather than compute bound. Compressing the Key-Value cache from FP16 (2 bytes/token) to FP8 (1 byte/token) halves the bytes transferred over high-bandwidth memory (HBM) on each autoregressive step, directly doubling maximum batch size and increasing token decode throughput by up to 1.8x."
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex justify-between items-center text-sm font-semibold text-white hover:text-indigo-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-indigo-400' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Embed Chunked Prefill Simulator</span>
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this lightweight responsive iframe snippet to embed the simulator directly into your technical architecture blog or documentation.
            </p>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-indigo-400 overflow-x-auto select-all">
              {embedCode}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="Chunked Prefill &amp; Radix Attention Simulator"
        simulatedMetrics={[
          { label: 'TTFT Latency', value: `${results.ttftMilliseconds} ms` },
          { label: 'Prefix Hit Ratio', value: `${results.prefixCacheHitRatioPct}%` },
          { label: 'VRAM Saved', value: `${results.kvCacheMemorySavedGb} GB` },
          { label: 'Est. Annual Savings', value: `${currency === 'INR' ? '₹' : '$'}${results.annualComputeSavings.toLocaleString()}` }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
