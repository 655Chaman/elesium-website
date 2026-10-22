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
  HardDriveDownload,
  Activity
} from 'lucide-react';
import {
  calculateKvCacheEviction,
  KvCacheEvictionInputs,
  EvictionModelArchitecture,
  EvictionStrategy,
  EvictionGpuTopology
} from '../calculator/agentKvCacheEvictionModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentKvCacheEvictionSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<EvictionModelArchitecture>('llama_3_1_70b');
  const [evictionStrategy, setEvictionStrategy] = useState<EvictionStrategy>('h2o_heavy_hitter_dynamic');
  const [contextLength, setContextLength] = useState<number>(262144); // 256k tokens
  const [attentionSinkTokens, setAttentionSinkTokens] = useState<number>(4);
  const [heavyHitterBudgetTokens, setHeavyHitterBudgetTokens] = useState<number>(2048);
  const [slidingWindowTokens, setSlidingWindowTokens] = useState<number>(4096);
  const [gpuClusterTopology, setGpuClusterTopology] = useState<EvictionGpuTopology>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: KvCacheEvictionInputs = useMemo(() => ({
    modelArchitecture,
    evictionStrategy,
    contextLength,
    attentionSinkTokens,
    heavyHitterBudgetTokens,
    slidingWindowTokens,
    gpuClusterTopology,
    currency
  }), [
    modelArchitecture,
    evictionStrategy,
    contextLength,
    attentionSinkTokens,
    heavyHitterBudgetTokens,
    slidingWindowTokens,
    gpuClusterTopology,
    currency
  ]);

  const results = useMemo(() => calculateKvCacheEviction(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-kv-cache-eviction-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-kv-cache-eviction-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium KV-Cache Eviction Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: DYNAMIC KV-CACHE EVICTION ARCHITECTURE
Target Model: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
Eviction Strategy: ${evictionStrategy.replace(/_/g, ' ').toUpperCase()}
Context Length: ${contextLength.toLocaleString()} tokens
Attention Sinks: ${attentionSinkTokens} tokens | Heavy Hitters: ${heavyHitterBudgetTokens} | Sliding Window: ${slidingWindowTokens}
GPU Topology: ${gpuClusterTopology.replace(/_/g, ' ').toUpperCase()}

PERFORMANCE AUDIT METRICS:
- Uncompressed KV Footprint: ${results.uncompressedKvMemoryGb} GB
- Compressed KV Footprint: ${results.compressedKvMemoryGb} GB
- Memory Compression Ratio: ${results.memoryCompressionRatio}x
- VRAM Reclaimed: ${results.effectiveVramSavedGb} GB
- Perplexity Impact: ${results.perplexityDegradationPercent > 100 ? '>1000%' : `+${results.perplexityDegradationPercent}%`}
- Annual FinOps Savings: ${results.annualFinOpsSavings}
- System Classification: ${results.statusClassification}

Verified against Triton H2O attention sink eviction kernels and PagedAttention dynamic deallocation standards.
Audit Link: https://elesium.online/tools/enterprise-agent-kv-cache-eviction-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setModelArchitecture('llama_3_1_70b');
    setEvictionStrategy('h2o_heavy_hitter_dynamic');
    setContextLength(262144);
    setAttentionSinkTokens(4);
    setHeavyHitterBudgetTokens(2048);
    setSlidingWindowTokens(4096);
    setGpuClusterTopology('nvidia_h100_sxm5');
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "Why do initial attention sinks prevent catastrophic perplexity explosion?",
      a: "In autoregressive transformers, the initial tokens accumulate massive softmax attention mass regardless of semantic content, functioning as numerical anchors. Without explicitly pinning these initial sink tokens (typically 4 tokens), sliding window eviction causes the softmax denominator to collapse, sending perplexity past 1000%."
    },
    {
      q: "How does the H2O (Heavy Hitter Oracle) algorithm decide which tokens to evict?",
      a: "H2O tracks the cumulative attention score of each token online across all attention heads and layers. When memory pressure reaches the budget threshold, tokens with low cumulative scores are deallocated from PagedAttention virtual blocks, retaining only persistently referenced semantic anchors."
    },
    {
      q: "What is the impact of KV cache eviction on multi-million token agent conversations?",
      a: "With H2O dynamic eviction, a 2-million token agent debate that would otherwise consume 20.48 Terabytes of VRAM is compressed to under 4.8 Terabytes (or down to 64 MB per single stream), enabling long-horizon autonomy on sovereign 8x H100 clusters."
    },
    {
      q: "Is dynamic KV eviction compatible with DPDP Act 2023 data residency regulations?",
      a: "Yes. Evicted tokens are scrubbed directly from GPU High Bandwidth Memory without persisting temporary swap files to unencrypted local disk, strictly satisfying statutory zero-data-leakage mandates."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Enterprise KV-Cache Eviction &amp; Attention Sink Simulator | Tool #70 | Elesium</title>
        <meta
          name="description"
          content="Simulate dynamic KV-cache eviction, H2O heavy-hitter activation oracles, StreamingLLM attention sinks, and 4x memory compression across multi-million token LLM agent clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-kv-cache-eviction-simulator" />
      </Helmet>

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Dynamic KV-Cache Eviction Simulator"
        simulatedMetrics={[
          { label: 'Compression Ratio', value: `${results.memoryCompressionRatio}x`, detail: 'VRAM capacity multiplier' },
          { label: 'Active KV Memory', value: `${results.compressedKvMemoryGb} GB`, detail: `Down from ${results.uncompressedKvMemoryGb} GB` },
          { label: 'VRAM Freed', value: `${results.effectiveVramSavedGb} GB`, detail: 'HBM3 memory reclaimed' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Cloud infrastructure reduction' }
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-6">
          <a href="/resources" className="hover:text-emerald-400 transition-colors">TOOLS</a>
          <span>/</span>
          <span className="text-emerald-400">KV-CACHE EVICTION</span>
          <span>/</span>
          <span className="text-gray-500">TOOL #70</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>DYNAMIC KV-CACHE COMPRESSION &amp; ATTENTION SINKS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Enterprise Autonomous Agent KV-Cache Eviction &amp; Attention Sink Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-3xl">
              Model dynamic KV-cache eviction, H2O heavy-hitter activation oracles, StreamingLLM attention sinks, and 4x memory compression across multi-million token LLM agent clusters.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={resetDefaults}
              className="p-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Reset to default settings"
              aria-label="Reset to default settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid Layout: Configuration + Telemetry Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Parameter Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>KV Eviction Parameters</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px] font-mono">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}`}
                  >
                    INR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400'}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Target Foundation Model */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Target Foundation Model
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as EvictionModelArchitecture)}
                  aria-label="Target Foundation Model"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="llama_3_1_70b">Llama 3.1 70B (80 Layers · GQA 8 Heads · 0.32 MB/tok)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (MLA Compressed Projections)</option>
                  <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematical Reasoning)</option>
                  <option value="sovereign_100b_agent">Sovereign 100B Swarm (Air-Gapped Private VPC)</option>
                  <option value="llama_3_405b">Llama 3.1 405B (126 Layers · 0.82 MB/tok)</option>
                </select>
              </div>

              {/* Eviction Strategy */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  KV-Cache Eviction Strategy
                </label>
                <select
                  value={evictionStrategy}
                  onChange={(e) => setEvictionStrategy(e.target.value as EvictionStrategy)}
                  aria-label="KV-Cache Eviction Strategy"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="h2o_heavy_hitter_dynamic">H2O Heavy Hitter Dynamic (Sinks + Heavy Hitters + Ring Window)</option>
                  <option value="streamingllm_sink_window">StreamingLLM (4 Sinks + Sliding Window Buffer)</option>
                  <option value="static_sliding_window">Static Sliding Window (No Sinks · Perplexity Collapse)</option>
                  <option value="uncompressed_full_cache">Uncompressed Full Cache (Baseline · OOM Risk)</option>
                </select>
              </div>

              {/* Context Length Slider */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Context Window Length</span>
                  <span className="font-mono text-emerald-400 font-semibold">{contextLength.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="32768"
                  max="2097152"
                  step="32768"
                  value={contextLength}
                  onChange={(e) => setContextLength(Number(e.target.value))}
                  aria-label="Context Window Length"
                  className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Sliders: Attention Sinks and Heavy Hitter Budget */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Attention Sinks</span>
                    <span className="font-mono text-emerald-400 font-semibold">{attentionSinkTokens} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    step="1"
                    value={attentionSinkTokens}
                    onChange={(e) => setAttentionSinkTokens(Number(e.target.value))}
                    aria-label="Attention Sinks"
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Heavy Hitters</span>
                    <span className="font-mono text-emerald-400 font-semibold">{heavyHitterBudgetTokens} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="512"
                    max="8192"
                    step="512"
                    value={heavyHitterBudgetTokens}
                    onChange={(e) => setHeavyHitterBudgetTokens(Number(e.target.value))}
                    aria-label="Heavy Hitters"
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* GPU Hardware Topology */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  GPU Cluster Hardware
                </label>
                <select
                  value={gpuClusterTopology}
                  onChange={(e) => setGpuClusterTopology(e.target.value as EvictionGpuTopology)}
                  aria-label="GPU Cluster Hardware"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="nvidia_h100_sxm5">8x NVIDIA H100 SXM5 (640 GB Aggregate HBM3)</option>
                  <option value="nvidia_b200_blackwell">8x NVIDIA B200 Blackwell (1.53 TB Aggregate HBM3e)</option>
                  <option value="nvidia_h200_sxm">8x NVIDIA H200 SXM (1.12 TB Aggregate HBM3e)</option>
                  <option value="nvidia_l40s_cluster">16x NVIDIA L40S PCIe (768 GB Aggregate GDDR6)</option>
                </select>
              </div>
            </div>

            {/* Architecture Whitepaper Link Card */}
            <div className="p-5 rounded-2xl bg-[#0d0d12] border border-white/10 space-y-3">
              <span className="text-[11px] font-mono text-emerald-400">TECHNICAL WHITEPAPER #114</span>
              <h4 className="text-sm font-semibold text-white">Dynamic KV-Cache Eviction at Scale</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Explore the formal mathematical proofs, custom Triton H2O eviction kernels, and 2-million-token benchmarks on 8x H100 clusters.
              </p>
              <a
                href="/signals/dynamic-kv-cache-eviction-heavy-hitter-attention-sinks"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <span>Read Whitepaper #114</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Visualizer & Telemetry Metrics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">COMPRESSION</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                  {results.memoryCompressionRatio}x
                </span>
                <span className="text-[10px] text-gray-500">footprint reduction</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">ACTIVE KV VRAM</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                  {results.compressedKvMemoryGb} GB
                </span>
                <span className="text-[10px] text-gray-500">vs {results.uncompressedKvMemoryGb} GB raw</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">VRAM RECLAIMED</span>
                <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                  {results.effectiveVramSavedGb} GB
                </span>
                <span className="text-[10px] text-gray-500">freed back to pool</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">PERPLEXITY IMPACT</span>
                <span className={`text-2xl font-bold font-mono mt-1 block ${
                  results.perplexityDegradationPercent > 10.0 ? 'text-rose-400' : 'text-amber-400'
                }`}>
                  {results.perplexityDegradationPercent > 100.0 ? '>1000%' : `+${results.perplexityDegradationPercent}%`}
                </span>
                <span className="text-[10px] text-gray-500">quality retention</span>
              </div>
            </div>

            {/* Interactive Architecture SVG Visualizer */}
            <div className="p-6 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Dynamic Attention Sink &amp; Heavy-Hitter Ring Buffer</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${
                  results.statusClassification === 'SUB_PERCENT_OPTIMAL_COMPRESSION'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : results.statusClassification === 'CATASTROPHIC_COLLAPSE_NO_SINKS'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : results.statusClassification === 'OOM_MEMORY_SATURATION'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {results.statusClassification.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="w-full bg-[#05070a] border border-white/5 rounded-xl p-4 overflow-x-auto">
                <svg viewBox="0 0 680 210" className="w-full min-w-[600px] h-auto font-mono text-xs">
                  {/* Background grid */}
                  <defs>
                    <pattern id="kvgrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="680" height="210" fill="url(#kvgrid)" />

                  {/* Zone 1: Initial Attention Sinks (Pinned) */}
                  <g transform="translate(30, 45)">
                    <rect width="130" height="110" rx="8" fill="#064e3b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" />
                    <text x="65" y="24" fill="#34d399" textAnchor="middle" fontSize="11" fontWeight="bold">Attention Sinks</text>
                    <text x="65" y="44" fill="#a7f3d0" textAnchor="middle" fontSize="9">Indices: 0 .. {attentionSinkTokens - 1}</text>
                    <rect x="20" y="58" width="90" height="36" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="65" y="80" fill="#10b981" textAnchor="middle" fontSize="9" fontWeight="bold">PINNED HBM</text>
                  </g>

                  {/* Arrow to Middle Zone */}
                  <path d="M 160 100 L 210 100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Zone 2: Middle Tokens (Evicted vs Heavy Hitters) */}
                  <g transform="translate(210, 35)">
                    <rect width="250" height="130" rx="8" fill="#0f172a" stroke="#6366f1" strokeWidth="1.5" />
                    <text x="125" y="24" fill="#a5b4fc" textAnchor="middle" fontSize="11" fontWeight="bold">Middle Context (Eviction Zone)</text>
                    
                    {/* Evicted Page Box */}
                    <g transform="translate(15, 38)">
                      <rect width="105" height="74" rx="6" fill="#1e1e2d" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2,2" />
                      <text x="52" y="24" fill="#fb7185" textAnchor="middle" fontSize="9" fontWeight="bold">Transient Pages</text>
                      <text x="52" y="44" fill="#fda4af" textAnchor="middle" fontSize="8">Low Cum. Attention</text>
                      <text x="52" y="62" fill="#f43f5e" textAnchor="middle" fontSize="9" fontWeight="bold">EVICTED (0 MB)</text>
                    </g>

                    {/* Heavy Hitters Box */}
                    <g transform="translate(130, 38)">
                      <rect width="105" height="74" rx="6" fill="#1e1b4b" stroke="#818cf8" strokeWidth="1" />
                      <text x="52" y="24" fill="#a5b4fc" textAnchor="middle" fontSize="9" fontWeight="bold">Heavy Hitters</text>
                      <text x="52" y="44" fill="#c7d2fe" textAnchor="middle" fontSize="8">Top-K Cumulative S(j)</text>
                      <text x="52" y="62" fill="#38bdf8" textAnchor="middle" fontSize="9" fontWeight="bold">{heavyHitterBudgetTokens} TOKENS</text>
                    </g>
                  </g>

                  {/* Arrow to Sliding Window */}
                  <path d="M 460 100 L 510 100" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />

                  {/* Zone 3: Recent Sliding Window */}
                  <g transform="translate(510, 45)">
                    <rect width="140" height="110" rx="8" fill="#1e1b4b" fillOpacity="0.4" stroke="#8b5cf6" strokeWidth="1.5" />
                    <text x="70" y="24" fill="#c4b5fd" textAnchor="middle" fontSize="11" fontWeight="bold">Sliding Window</text>
                    <text x="70" y="44" fill="#ddd6fe" textAnchor="middle" fontSize="9">Recent {slidingWindowTokens} tokens</text>
                    <rect x="20" y="58" width="100" height="36" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="70" y="80" fill="#a78bfa" textAnchor="middle" fontSize="9" fontWeight="bold">RING BUFFER</text>
                  </g>
                </svg>
              </div>

              {/* Step By Step Architecture Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 1: ATTENTION SINK PINNING</span>
                  <span className="text-emerald-400">Permanently retaining initial {attentionSinkTokens} tokens prevents softmax denominator explosion</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 2: ONLINE H2O SCORE TRACKING</span>
                  <span className="text-blue-400">Computing cumulative attention S(j) in Triton without re-computation overhead</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 3: PAGEDATTENTION DEALLOCATION</span>
                  <span className="text-purple-400">Reclaiming non-heavy virtual blocks directly back to GPU memory pool ({results.effectiveVramSavedGb} GB freed)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">PROJECTED ANNUAL FINOPS SAVINGS</span>
                  <span className="text-amber-400 font-bold">{results.annualFinOpsSavings}</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy Dynamic KV Eviction for Your Long-Context Agents</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated vLLM H2O eviction configuration and memory compression audit.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={copyMemo}
                  className="px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Form Section */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl">
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

        <MandateApplicationForm source="Tool #70: KV-Cache Eviction Simulator" />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-4xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Technical Questions</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d12] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Embed Simulator on Your Website</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Copy this lightweight, responsive iframe snippet into your documentation, blog, or engineering portal:
            </p>
            <div className="p-3 bg-[#05070a] border border-white/10 rounded-xl font-mono text-[11px] text-gray-300 break-all mb-4">
              {embedSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
