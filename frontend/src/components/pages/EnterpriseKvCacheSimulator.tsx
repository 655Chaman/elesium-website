import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Gauge,
  ShieldCheck
} from 'lucide-react';
import {
  calculateKvCacheSimulation,
  KvCacheSimulatorInputs,
  ModelArchKey,
  CacheStrategyKey,
  CachePrecisionKey,
  MODEL_ARCH_SPECS
} from '../calculator/kvCacheSimulatorModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseKvCacheSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // Inputs State
  const [modelArch, setModelArch] = useState<ModelArchKey>('llama_70b');
  const [cacheStrategy, setCacheStrategy] = useState<CacheStrategyKey>('prefix_caching');
  const [cachePrecision, setCachePrecision] = useState<CachePrecisionKey>('fp8');
  const [systemPromptTokens, setSystemPromptTokens] = useState<number>(8192); // 8k system prompt / tools
  const [turnHistoryCount, setTurnHistoryCount] = useState<number>(10);
  const [tokensPerTurn, setTokensPerTurn] = useState<number>(1024);
  const [concurrentStreams, setConcurrentStreams] = useState<number>(16);
  const [gpuHardwareVramGb] = useState<number>(80); // H100 80GB

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: KvCacheSimulatorInputs = useMemo(() => ({
    modelArch,
    cacheStrategy,
    cachePrecision,
    systemPromptTokens,
    turnHistoryCount,
    tokensPerTurn,
    concurrentStreams,
    gpuHardwareVramGb
  }), [modelArch, cacheStrategy, cachePrecision, systemPromptTokens, turnHistoryCount, tokensPerTurn, concurrentStreams, gpuHardwareVramGb]);

  const results = useMemo(() => {
    return calculateKvCacheSimulation(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/kv-cache-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL BRIEF: LLM KV CACHE & CONTEXT WINDOW EVICTION SIMULATION
Model Architecture: ${results.archSpec.name} | Strategy: ${cacheStrategy.toUpperCase()}
Precision: ${cachePrecision.toUpperCase()} | Context Horizon: ${results.totalTokensPerStream.toLocaleString()} Tokens
================================================================================

1. MEMORY & VRAM SATURATION:
   • Total KV Cache VRAM (${concurrentStreams} Streams): ${results.totalKvCacheVramGb} GB / ${gpuHardwareVramGb} GB (${results.vramSaturationPercentage}% VRAM Saturation)
   • Memory Fragmentation: ${results.memoryFragmentationPercentage}% (${cacheStrategy === 'paged_attention' || cacheStrategy === 'prefix_caching' ? 'Near-Zero PagedAttention Blocks' : 'High Contiguous Allocation Waste'})
   • Overall Cache Hit Rate: ${results.overallCacheHitRate}%

2. LATENCY & SERVING PERFORMANCE:
   • Average Time-to-First-Token (TTFT): ${results.averageTtftMs} ms (${results.ttftReductionPercentage}% TTFT Reduction vs Naive Re-compute)
   • Average Inter-Token Latency (ITL): ${results.averageItlMs} ms / token
   • Final Turn TTFT: ${results.turnMetrics[results.turnMetrics.length - 1].ttftMs} ms for ${results.totalTokensPerStream.toLocaleString()} context tokens

3. CLOUD OPEX & SOVEREIGN FINOPS:
   • Estimated Monthly Hyperscaler Closed API Cost: $${results.estimatedMonthlyCloudApiCost.toLocaleString()} USD
   • Dedicated Sovereign Cloud Cluster Cost: $${results.estimatedMonthlySelfHostedCost.toLocaleString()} USD
   • Monthly Operational Savings: $${results.monthlySavingsUsd.toLocaleString()} USD

Architectural Guidance: ${results.architecturalGuidance}
================================================================================
Generated via Elesium Sovereign AI Engineering (https://elesium.online)
    `.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-20 selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise LLM Context Window Cache & KV Eviction Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate LLM KV cache memory allocation, PagedAttention fragmentation, Automatic Prefix Caching hit ratios, and TTFT latency across multi-turn enterprise agent workflows."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-llm-context-kv-cache-simulator" />
        <meta property="og:title" content="Enterprise LLM Context Window Cache & KV Eviction Simulator | Elesium" />
        <meta
          property="og:description"
          content="Benchmark LLM KV cache memory allocation, RadixAttention prefix caching, Chunked Prefill, and TTFT across multi-turn agent sessions."
        />
        <meta property="og:url" content="https://elesium.online/tools/enterprise-llm-context-kv-cache-simulator" />
        <meta property="og:type" content="website" />
      </Helmet>

      <WhatsAppModal />

      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span className="text-slate-600">/</span>
          <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
          <span className="text-slate-600">/</span>
          <span className="text-sky-400 font-medium">KV Cache Simulator</span>
        </nav>
      </div>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-6 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-500/20 bg-sky-500/10 mb-4">
          <Cpu className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-mono uppercase tracking-widest text-sky-300">
            Inference Architecture • Memory Management Lab
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          Enterprise LLM Context Window Cache &amp; KV Eviction Simulator
        </h1>
        <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
          Simulate VRAM allocation, PagedAttention block efficiency, and Time-To-First-Token (TTFT) latency across
          multi-turn enterprise agent workflows. Compare <strong className="text-white">Automatic Prefix Caching (RadixAttention)</strong>,
          <strong className="text-white"> Chunked Prefill</strong>, and <strong className="text-white">Sliding Window Eviction</strong> against naive re-computation.
        </p>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-sky-400" />
            Embed Interactive Simulator on Your Site
          </button>
          <button
            onClick={copyArchitecturalMemo}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-colors"
          >
            {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            {hasCopiedMemo ? 'Architecture Memo Copied!' : 'Copy Executive Briefing Memo'}
          </button>
        </div>
      </header>

      {/* Main Interactive Grid */}
      <main className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive Parameters */}
        <section className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-sm shadow-xl">
            <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-6 pb-4 border-b border-slate-800">
              <Gauge className="w-4 h-4 text-sky-400" />
              Model Architecture &amp; Caching Topology
            </h2>

            {/* Selector: Model Architecture */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Target Model Architecture</span>
                <span className="text-sky-300 font-semibold">{results.archSpec.layers} Layers</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {(Object.keys(MODEL_ARCH_SPECS) as ModelArchKey[]).map((key) => {
                  const spec = MODEL_ARCH_SPECS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => setModelArch(key)}
                      className={`p-2.5 text-left rounded-xl border text-xs font-mono transition-all ${
                        modelArch === key
                          ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                          : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-semibold text-white truncate">{spec.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {spec.isMLA ? 'MLA 576-dim Latent' : `${spec.kvHeads} KV Heads • ${spec.headDim} dim`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selector: Cache Strategy */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">KV Caching Strategy</span>
                <span className="text-sky-300 font-semibold uppercase">{cacheStrategy.replace('_', ' ')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { key: 'prefix_caching', label: 'Prefix Caching (Radix)', note: 'Reuses prompt prefixes' },
                  { key: 'chunked_prefill', label: 'Chunked Prefill', note: 'Interleaves compute/memory' },
                  { key: 'sliding_window', label: 'Sliding Window (SWA)', note: 'Fixed token horizon' },
                  { key: 'paged_attention', label: 'PagedAttention', note: 'Virtual 16-token blocks' },
                  { key: 'naive_contiguous', label: 'Naive Contiguous', note: 'Full recomputation' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setCacheStrategy(item.key as CacheStrategyKey)}
                    className={`p-2.5 text-left rounded-xl border text-xs font-mono transition-all ${
                      cacheStrategy === item.key
                        ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">{item.label}</div>
                    <div className="text-[10px] text-slate-400">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selector: KV Quantization Precision */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">KV Cache Quantization</span>
                <span className="text-sky-300 font-semibold uppercase">{cachePrecision}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'fp16', label: 'FP16 (2B)', desc: '100% Precision' },
                  { key: 'fp8', label: 'FP8 (1B)', desc: '50% VRAM Cut' },
                  { key: 'int4', label: 'INT4 (0.5B)', desc: '75% VRAM Cut' }
                ].map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setCachePrecision(p.key as CachePrecisionKey)}
                    className={`py-2 px-2 text-center rounded-lg border text-xs font-mono transition-all ${
                      cachePrecision === p.key
                        ? 'border-sky-500 bg-sky-500/20 text-white font-semibold'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-white">{p.label}</div>
                    <div className="text-[10px] text-slate-400">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 1: System Prompt Length */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">System Prompt &amp; SOP Tools Size</span>
                <span className="text-sky-300 font-semibold">{systemPromptTokens.toLocaleString()} Tokens</span>
              </div>
              <input
                type="range"
                min="1000"
                max="32000"
                step="1000"
                value={systemPromptTokens}
                onChange={(e) => setSystemPromptTokens(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1K (Basic)</span>
                <span>8K (Standard Agent SOP)</span>
                <span>32K (Dense Schemas)</span>
              </div>
            </div>

            {/* Slider 2: Turn History Depth */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Active Multi-Turn History</span>
                <span className="text-sky-300 font-semibold">{turnHistoryCount} Turns</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                step="1"
                value={turnHistoryCount}
                onChange={(e) => setTurnHistoryCount(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>2 Turns</span>
                <span>10 Turns</span>
                <span>30 Turns</span>
              </div>
            </div>

            {/* Slider 3: Tokens Per Turn */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Tokens Generated per Turn</span>
                <span className="text-sky-300 font-semibold">{tokensPerTurn.toLocaleString()} Tokens</span>
              </div>
              <input
                type="range"
                min="250"
                max="3000"
                step="250"
                value={tokensPerTurn}
                onChange={(e) => setTokensPerTurn(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Slider 4: Concurrent Active Streams */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-400">Concurrent Agent Swarm Streams</span>
                <span className="text-sky-300 font-semibold">{concurrentStreams} Streams</span>
              </div>
              <input
                type="range"
                min="1"
                max="64"
                step="1"
                value={concurrentStreams}
                onChange={(e) => setConcurrentStreams(Number(e.target.value))}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>1 Single</span>
                <span>16 Swarm</span>
                <span>64 Peak Load</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Real-Time Telemetry & Turn-by-Turn Breakdown */}
        <section className="lg:col-span-7 space-y-6">
          {/* Executive KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-sky-500/30 bg-sky-950/20">
              <div className="text-xs font-mono text-sky-400 uppercase tracking-wider mb-1">
                TTFT Latency Cut
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {results.ttftReductionPercentage}% Faster
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Sub-{results.turnMetrics[0].ttftMs}ms vs re-computing {results.totalTokensPerStream.toLocaleString()} tokens
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Total KV VRAM ({concurrentStreams} Streams)
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">
                {results.totalKvCacheVramGb} GB
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {results.vramSaturationPercentage}% of 80GB H100 capacity
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-indigo-500/30 bg-indigo-950/20">
              <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1">
                Monthly Cloud OpEx Saved
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                ${results.monthlySavingsUsd.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Vs ${results.estimatedMonthlyCloudApiCost.toLocaleString()}/mo closed API billing
              </p>
            </div>
          </div>

          {/* Turn-by-Turn Latency Progression Table */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-sky-400" />
                Turn-by-Turn Multi-Agent Context Scaling
              </h2>
              <span className="text-xs font-mono text-sky-400">
                Avg TTFT: {results.averageTtftMs} ms • ITL: {results.averageItlMs} ms
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="py-2.5 px-3">Turn</th>
                    <th className="py-2.5 px-3">Active Context</th>
                    <th className="py-2.5 px-3">KV VRAM / Stream</th>
                    <th className="py-2.5 px-3">TTFT (Prefill)</th>
                    <th className="py-2.5 px-3">ITL (Decode)</th>
                    <th className="py-2.5 px-3 text-right">Cache Hit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {results.turnMetrics.slice(0, 10).map((metric) => (
                    <tr key={metric.turnIndex} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">Turn #{metric.turnIndex}</td>
                      <td className="py-2.5 px-3 text-slate-300">{metric.totalContextTokens.toLocaleString()} tok</td>
                      <td className="py-2.5 px-3 text-slate-300">{metric.kvVramMb} MB</td>
                      <td className="py-2.5 px-3">
                        <span className={`font-semibold ${metric.ttftMs < 50 ? 'text-emerald-400' : metric.ttftMs < 150 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {metric.ttftMs} ms
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{metric.itlMs} ms</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                          {Math.round(metric.cacheHitRatio * 100)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {results.turnMetrics.length > 10 && (
              <p className="text-[11px] text-slate-500 mt-3 text-right font-mono">
                Showing first 10 of {results.turnMetrics.length} turns in active loop.
              </p>
            )}
          </div>

          {/* Architecture Insights Card */}
          <div className="p-6 rounded-2xl border border-sky-500/20 bg-gradient-to-br from-slate-900 to-sky-950/30">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Sovereign Inference Architecture Verdict
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {results.architecturalGuidance} By deploying self-hosted sovereign clusters with PagedAttention and Automatic Prefix Caching, your multi-agent workflows bypass multi-tenant cloud token tax, guaranteeing deterministic latency and complete DPDP Act 2023 compliance.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <button
                    onClick={() => openWhatsApp()}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </button>
                <ExpandableScreen>
                <ExpandableScreenTrigger>
                  <button className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-2">
                    Schedule Sovereign Inference Audit
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <button
                onClick={() => openWhatsApp()}
                className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 transition-colors"
              >
                Discuss KV Sizing on WhatsApp
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Technical FAQ Accordion */}
      <section className="max-w-7xl mx-auto px-6 mt-16">
        <h2 className="text-2xl font-bold text-white mb-6">
          KV Cache &amp; LLM Context Window Engineering Principles
        </h2>
        <div className="space-y-4">
          {[
            {
              q: 'How does Automatic Prefix Caching (RadixAttention) eliminate multi-turn agent latency?',
              a: 'In autonomous multi-agent systems, agents frequently exchange tool definitions, database schemas, and conversation histories. Naive inference engines re-evaluate the entire prompt on every turn, causing TTFT to grow quadratically. RadixAttention retains historical key-value tensors in a radix tree in GPU memory, matching token prefixes in constant time and reducing TTFT by 80% to 92%.'
            },
            {
              q: 'Why does PagedAttention eliminate 68%+ virtual memory fragmentation?',
              a: 'Traditional contiguous memory allocation pre-allocates contiguous physical VRAM blocks based on the maximum anticipated context length (e.g. 32k tokens). If a request terminates early, that reserved VRAM is wasted. PagedAttention divides the KV cache into fixed virtual memory blocks (e.g. 16 tokens), mapping non-contiguous physical memory on demand and reducing fragmentation to under 4%.'
            },
            {
              q: 'What is Multi-Head Latent Attention (MLA) and why does DeepSeek use it?',
              a: 'Standard Grouped-Query Attention (GQA) stores separate key and value tensors for each KV head. Multi-Head Latent Attention compresses key and value heads into a single low-dimensional latent vector (576 dimensions in DeepSeek-V3/R1). This cuts KV cache VRAM by over 85%, allowing high-concurrency 128k context execution on far fewer GPU nodes.'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="p-5 rounded-xl border border-slate-800 bg-slate-900/50 cursor-pointer"
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <div className="flex justify-between items-center text-sm font-semibold text-white">
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
              </div>
              {openFaq === index && (
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
                  {item.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl p-6 rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-4 h-4 text-sky-400" />
              Embed This KV Cache Simulator on Your Site
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into your engineering blog, documentation, or internal architecture wiki.
            </p>
            <textarea
              readOnly
              value={embedCodeSnippet}
              className="w-full h-32 p-3 font-mono text-xs rounded-lg border border-slate-800 bg-slate-950 text-slate-300 resize-none focus:outline-none"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold flex items-center gap-2"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
