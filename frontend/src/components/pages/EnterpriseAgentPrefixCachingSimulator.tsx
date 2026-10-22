import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Layers,
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
  Server
} from 'lucide-react';
import {
  calculatePrefixCaching,
  PrefixCachingInputs,
  ModelArchitecture,
  CacheEvictionPolicy,
  HardwareCluster
} from '../calculator/agentPrefixCachingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentPrefixCachingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [sharedPrefixTokens, setSharedPrefixTokens] = useState<number>(4096);
  const [uniqueQueryTokens, setUniqueQueryTokens] = useState<number>(512);
  const [concurrentStreams, setConcurrentStreams] = useState<number>(32);
  const [cacheEvictionPolicy, setCacheEvictionPolicy] = useState<CacheEvictionPolicy>('radix_tree_lru');
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PrefixCachingInputs = useMemo(() => ({
    modelArchitecture,
    sharedPrefixTokens,
    uniqueQueryTokens,
    concurrentStreams,
    cacheEvictionPolicy,
    hardwareCluster,
    currency
  }), [
    modelArchitecture,
    sharedPrefixTokens,
    uniqueQueryTokens,
    concurrentStreams,
    cacheEvictionPolicy,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculatePrefixCaching(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-kvcache-prefix-caching-simulator" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const memoContent = `=== ENTERPRISE AI ARCHITECTURE MEMO: KV CACHE PREFIX CACHING SIMULATION ===
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Hardware Cluster: ${hardwareCluster.toUpperCase().replace(/_/g, ' ')}
Shared Prefix Length: ${sharedPrefixTokens.toLocaleString()} tokens
Unique Query Length: ${uniqueQueryTokens.toLocaleString()} tokens
Concurrent Streams: ${concurrentStreams}
Eviction Policy: ${cacheEvictionPolicy.toUpperCase().replace(/_/g, ' ')}

SIMULATION RESULTS:
- Prefix Hit Rate: ${results.prefixHitRatePercent}%
- Baseline TTFT (Uncached): ${results.baselineTtftMs} ms
- Cached TTFT (Prefix Hit): ${results.cachedTtftMs} ms
- Prefill Latency Cut: ${results.latencyReductionPercent}%
- Redundant VRAM Saved: ${results.vramSavedGb} GB
- Throughput Multiplier: ${results.effectiveThroughputMultiplier}x
- Projected Annual FinOps Savings: ${results.annualClusterSavings}
- Production SLA Status: ${results.slaStatus}

RADIX TREE NODE REUSE:
${results.radixTreeTrace.map(n => `* [Depth ${n.depth}] ${n.nodeName} (${n.tokenRange}): Hit Rate ${n.hitRatePercent}%, Reused ${n.memoryReusedMb} MB [${n.status}]`).join('\n')}

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
      q: "What is KV Cache Prefix Caching and how does it differ from Standard PagedAttention?",
      a: "Standard PagedAttention virtualizes key-value memory into non-contiguous blocks to prevent physical fragmentation, but it still re-computes attention for identical prompt tokens across multiple requests. Prefix caching extends this by indexing KV pages hierarchically in a Radix tree (prefix trie). When multiple agent requests share common system instructions, schemas, or few-shot examples, prefix caching bypasses prefill passes entirely, loading pre-computed attention keys directly into GPU registers."
    },
    {
      q: "How does Radix tree prefix caching achieve an 85%+ prefill latency reduction?",
      a: "In autonomous multi-agent workflows, system instructions and tool definitions frequently comprise 80% to 90% of total prompt tokens. By organizing cached prefixes into prefix trees, the serving engine performs an O(1) pointer dereference rather than a quadratic O(N²) matrix multiplication pass. Only the newly appended query tokens are evaluated during prefill, dropping Time-To-First-Token (TTFT) from hundreds of milliseconds to sub-30ms."
    },
    {
      q: "How does zero-copy memory sharing work across disparate agent sessions?",
      a: "Prefix caching utilizes copy-on-write page table semantics. Multiple concurrent agent streams hold read-only pointers to the identical physical GPU memory blocks representing the shared system prompt. When an individual agent generates unique subsequent tokens, new physical pages are allocated exclusively for that stream's tail, eliminating dozens of gigabytes of redundant KV memory allocations."
    },
    {
      q: "Can prefix caching be deployed on air-gapped private VPC clusters under India DPDP Act 2023?",
      a: "Yes. Elesium deploys sovereign prefix-caching serving runtimes (vLLM and SGLang) on dedicated on-premise NVIDIA H100 and Blackwell clusters inside your air-gapped VPC. All KV tensors reside strictly within physical hardware enclaves without third-party API exposure, satisfying Section 8 of the Indian DPDP Act 2023 and RBI Cyber Security Framework guidelines."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Autonomous Agent KV Cache Prefix Caching Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate enterprise multi-tenant LLM prefix caching, Radix tree KV reuse, zero-copy memory virtualization, TTFT latency cuts, and GPU FinOps cost savings."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-kvcache-prefix-caching-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 border-b border-slate-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-sky-950/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-950/80 border border-sky-800/60 text-sky-400 text-xs font-semibold mb-4 tracking-wide uppercase">
            <Layers className="w-3.5 h-3.5" />
            Tool #52 · Enterprise Multi-Tenant AI Infrastructure
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Enterprise Autonomous Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400">KV Cache Prefix Caching</span> & Radix Attention Simulator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Model Radix tree prompt token reuse, zero-copy memory page sharing, and prefill compute elimination across high-concurrency multi-agent clusters. Quantify Time-To-First-Token (TTFT) acceleration, GPU VRAM savings, and annual FinOps payback.
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
                  <span>Model Architecture</span>
                  <span className="text-sky-400 font-mono text-[11px]">
                    {modelArchitecture === 'deepseek_r1_671b' ? 'DeepSeek-R1 (MLA)' : 'Llama-3 / Qwen (GQA)'}
                  </span>
                </label>
                <select
                  value={modelArchitecture}
                  onChange={e => setModelArchitecture(e.target.value as ModelArchitecture)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="llama_3_70b">Llama-3-70B (80 Layers, GQA)</option>
                  <option value="deepseek_r1_671b">DeepSeek-R1-671B (MLA Latent KV)</option>
                  <option value="qwen_2_5_72b">Qwen-2.5-72B (80 Layers, GQA)</option>
                  <option value="mistral_large_123b">Mistral Large 123B (88 Layers, GQA)</option>
                </select>
              </div>

              {/* Shared Prefix Tokens */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Shared System Prefix</span>
                  <span className="font-mono text-sky-400 font-bold">{sharedPrefixTokens.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="32768"
                  step="256"
                  value={sharedPrefixTokens}
                  onChange={e => setSharedPrefixTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>256 (Small System)</span>
                  <span>8k (Doc RAG)</span>
                  <span>32k (Multi-doc Agent)</span>
                </div>
              </div>

              {/* Unique Query Tokens */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Unique Query / User Turn</span>
                  <span className="font-mono text-teal-400 font-bold">{uniqueQueryTokens.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="64"
                  max="8192"
                  step="64"
                  value={uniqueQueryTokens}
                  onChange={e => setUniqueQueryTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>64 (Chat Turn)</span>
                  <span>2k (Structured Payload)</span>
                  <span>8k (Code Review)</span>
                </div>
              </div>

              {/* Concurrent Streams */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-300">Concurrent Agent Streams</span>
                  <span className="font-mono text-indigo-400 font-bold">{concurrentStreams} threads</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="256"
                  step="1"
                  value={concurrentStreams}
                  onChange={e => setConcurrentStreams(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1 (Single)</span>
                  <span>32 (Team Swarm)</span>
                  <span>256 (Enterprise Cluster)</span>
                </div>
              </div>

              {/* Eviction Policy */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Cache Eviction Scheme</span>
                  <span className="text-emerald-400 font-mono text-[11px]">
                    {cacheEvictionPolicy === 'radix_tree_lru' ? '96% Efficiency' : 'Adaptive'}
                  </span>
                </label>
                <select
                  value={cacheEvictionPolicy}
                  onChange={e => setCacheEvictionPolicy(e.target.value as CacheEvictionPolicy)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="radix_tree_lru">Radix Tree LRU Eviction (Default)</option>
                  <option value="frequency_weighted">Frequency-Weighted Subtree Pinning</option>
                  <option value="fifo_stream">FIFO Sequential Stream Buffer</option>
                </select>
              </div>

              {/* Hardware Target */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex justify-between">
                  <span>Hardware Cluster</span>
                  <span className="text-sky-400 font-mono text-[11px]">
                    {hardwareCluster === 'nvidia_h100_sxm5' ? '18.5 ms/1k' : 'Custom'}
                  </span>
                </label>
                <select
                  value={hardwareCluster}
                  onChange={e => setHardwareCluster(e.target.value as HardwareCluster)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-mono"
                >
                  <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 (80GB, NVLink)</option>
                  <option value="nvidia_b200_nvl">NVIDIA B200 NVL (192GB, NVLink 1.8TB/s)</option>
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
                  Prefix Hit Rate
                </div>
                <div className="mt-1 text-2xl font-black text-sky-400 font-mono">
                  {results.prefixHitRatePercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Prompt reuse efficiency
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  Prefill Latency Cut
                </div>
                <div className="mt-1 text-2xl font-black text-teal-400 font-mono">
                  -{results.latencyReductionPercent}%
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Compute bypass gain
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                  VRAM Saved
                </div>
                <div className="mt-1 text-2xl font-black text-indigo-400 font-mono">
                  {results.vramSavedGb} GB
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  Zero-copy memory
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
                    Time-To-First-Token (TTFT) Benchmark
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold font-mono tracking-wide ${
                  results.slaStatus === 'SUB_30MS_OPTIMAL'
                    ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-400'
                    : results.slaStatus === 'SUB_60MS_ACCEPTABLE'
                    ? 'bg-amber-950/80 border border-amber-800/80 text-amber-400'
                    : 'bg-rose-950/80 border border-rose-800/80 text-rose-400'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Baseline */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-400">Baseline TTFT (Uncached)</div>
                  <div className="text-3xl font-black text-rose-400 font-mono mt-1">
                    {results.baselineTtftMs} <span className="text-sm font-medium text-slate-500">ms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Full quadratic forward attention computed over all {(sharedPrefixTokens + uniqueQueryTokens).toLocaleString()} tokens across all {concurrentStreams} streams.
                  </p>
                </div>

                {/* Cached */}
                <div className="bg-slate-950/80 border border-sky-900/40 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-sky-500/20 text-sky-400 text-[10px] font-mono font-bold rounded-bl">
                    {results.effectiveThroughputMultiplier}x Faster
                  </div>
                  <div className="text-xs font-semibold text-sky-400">Cached TTFT (Prefix Hit)</div>
                  <div className="text-3xl font-black text-sky-300 font-mono mt-1">
                    {results.cachedTtftMs} <span className="text-sm font-medium text-slate-500">ms</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                    Prefix evaluated via O(1) Radix pointer dereference. Only {uniqueQueryTokens.toLocaleString()} unique tokens undergo GPU prefill execution.
                  </p>
                </div>
              </div>
            </div>

            {/* Radix Tree Hierarchy Visualizer */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-6">
                <Server className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Radix Tree Memory Virtualization Trace
                </h3>
              </div>

              <div className="space-y-3">
                {results.radixTreeTrace.map((node, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      node.status === 'CACHED_HIT'
                        ? 'bg-sky-950/20 border-sky-900/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                    style={{ marginLeft: `${node.depth * 14}px` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          node.status === 'CACHED_HIT' ? 'bg-sky-400' : 'bg-slate-500'
                        }`} />
                        <span className="text-xs font-bold text-slate-200">
                          {node.nodeName}
                        </span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        node.status === 'CACHED_HIT'
                          ? 'bg-sky-900/50 text-sky-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {node.status}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400 font-mono">
                      <span>Span: <strong className="text-slate-200">{node.tokenRange}</strong></span>
                      <span>Hit Rate: <strong className="text-emerald-400">{node.hitRatePercent}%</strong></span>
                      {node.memoryReusedMb > 0 && (
                        <span>Reused VRAM: <strong className="text-indigo-400">+{node.memoryReusedMb.toLocaleString()} MB</strong></span>
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
              Enterprise Prefix Caching Architecture & Engineering Invariants
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
              <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign AI Architecture Mandate
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Deploy Air-Gapped Prefix Caching on Your VPC
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              Schedule a technical deployment audit with our Principal AI Systems Architects. Lock in sub-30ms Time-To-First-Token, 85% prefill compute elimination, and DPDP Act 2023 compliance.
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
        toolName="Enterprise Autonomous Agent KV Cache Prefix Caching Simulator"
        simulatedMetrics={[
          { label: 'Prefix Hit Rate', value: `${results.prefixHitRatePercent}%` },
          { label: 'Prefill Latency Cut', value: `-${results.latencyReductionPercent}%` },
          { label: 'Cached TTFT', value: `${results.cachedTtftMs} ms` },
          { label: 'VRAM Saved', value: `${results.vramSavedGb} GB` },
          { label: 'FinOps Savings', value: results.annualClusterSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
