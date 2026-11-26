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
  HardDrive
} from 'lucide-react';
import {
  calculateKvCacheCompaction,
  KvCacheCompactionInputs,
  FoundationModel,
  GpuClusterType
} from '../calculator/agentKvCacheCompactionModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentKvCacheCompactionSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [foundationModel, setFoundationModel] = useState<FoundationModel>('llama_3_70b');
  const [gpuClusterType, setGpuClusterType] = useState<GpuClusterType>('nvidia_h100_sxm5_80gb');
  const [numGpus, setNumGpus] = useState<number>(8);
  const [activeConcurrencyStreams, setActiveConcurrencyStreams] = useState<number>(128);
  const [compactionThresholdPercent, setCompactionThresholdPercent] = useState<number>(25);
  const [pageSizeTokens, setPageSizeTokens] = useState<number>(16);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: KvCacheCompactionInputs = useMemo(() => ({
    foundationModel,
    gpuClusterType,
    numGpus,
    activeConcurrencyStreams,
    compactionThresholdPercent,
    pageSizeTokens,
    currency
  }), [
    foundationModel,
    gpuClusterType,
    numGpus,
    activeConcurrencyStreams,
    compactionThresholdPercent,
    pageSizeTokens,
    currency
  ]);

  const results = useMemo(() => calculateKvCacheCompaction(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-kvcache-memory-compaction-simulator" width="100%" height="600" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe><div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const handleCopyMemo = () => {
    const memo = `=== ELESIUM ENTERPRISE KV-CACHE COMPACTION MEMO ===
Cluster Hardware: ${inputs.numGpus}x ${inputs.gpuClusterType}
Serving Model: ${inputs.foundationModel}
Total Cluster HBM: ${results.totalClusterHbmGb} GB
Active Concurrency: ${inputs.activeConcurrencyStreams} streams
Compaction Threshold: ${inputs.compactionThresholdPercent}%

--- SIMULATED TELEMETRY ---
Uncompacted Fragmentation: ${results.rawFragmentationPercent}%
Compacted Fragmentation: ${results.compactedFragmentationPercent}%
Recovered HBM Memory: ${results.recoveredHbmGigabytes} GB
Concurrency Multiplier: ${results.concurrencyMultiplier}x
Max Supported Concurrent Streams: ${results.maxConcurrentStreams}
Out-of-Memory (OOM) Crash Risk: ${results.oomCrashProbabilityPercent}%
Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
SLA Status: ${results.slaStatus}
======================================================`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const resetDefaults = () => {
    setFoundationModel('llama_3_70b');
    setGpuClusterType('nvidia_h100_sxm5_80gb');
    setNumGpus(8);
    setActiveConcurrencyStreams(128);
    setCompactionThresholdPercent(25);
    setPageSizeTokens(16);
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "What causes severe KV-cache fragmentation in multi-tenant LLM clusters?",
      a: "In multi-tenant LLM serving architectures running vLLM or TensorRT-LLM, requests arrive asynchronously with highly variable sequence lengths and generation durations. As requests complete and release non-contiguous 2MB or 4MB memory blocks in GPU High-Bandwidth Memory (HBM), the remaining memory becomes heavily fragmented into isolated holes, triggering fatal out-of-memory (OOM) aborts even when 30-40% of physical capacity remains nominally idle."
    },
    {
      q: "How does zero-copy cuMemMap address remapping prevent GPU pipeline stalls?",
      a: "Rather than issuing costly device-to-device memory copy operations that stall active CUDA warps, the compaction engine leverages low-level CUDA Virtual Memory Management APIs (cuMemAddressReserve, cuMemCreate, and cuMemMap). It remaps physical 2MB GPU pages into a unified virtual address space in microseconds, allowing running attention kernels to read continuous KV tensor pointers with zero memory invalidation or kernel recompilation."
    },
    {
      q: "How does KV-cache compaction achieve a 3.4x concurrency expansion?",
      a: "By reclaiming non-contiguous memory holes and reducing fragmentation from ~40% to under 2.5%, the serving engine safely re-allocates previously stranded memory into the active token generation pool. This allows multi-tenant clusters to support 3.4x more concurrent streams without requiring expensive additional GPU hardware nodes."
    },
    {
      q: "Is dynamic KV-cache compaction compliant with DPDP Act 2023 and RBI privacy mandates?",
      a: "Yes. Compaction operates purely within sovereign private VPC boundaries and local GPU memory enclaves. Tenant memory blocks are isolated via hardware-enforced virtual memory page boundaries, ensuring zero data persistence or cross-tenant leakage across enterprise financial and statutory tasks."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-white/20 selection:text-white">
      <Helmet>
        <title>Enterprise Autonomous Agent KV Cache Memory Compaction Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate KV-cache dynamic memory compaction, virtual block re-allocation, zero-copy cuMemMap defragmentation, and 3.4x serving concurrency expansion on enterprise GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-kvcache-memory-compaction-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 border-b border-neutral-800/80 bg-gradient-to-b from-white/[0.03] via-transparent to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.05] border border-white/15 text-neutral-200 mb-4">
            <HardDrive className="w-3.5 h-3.5" />
            TOOL #57: MEMORY DEFRAGMENTATION &amp; FINOPS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise KV-Cache Memory Compaction Simulator
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
            Simulate paged block compaction, zero-copy virtual memory re-allocation, and HBM defragmentation.
            Eliminate GPU out-of-memory (OOM) evictions and expand multi-tenant serving concurrency by up to 3.4x across enterprise AI clusters.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all duration-300 shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-neutral-200" />
              Embed This Tool
            </button>
            <button
              onClick={handleCopyMemo}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-all duration-300 shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-neutral-200" /> : <Copy className="w-3.5 h-3.5 text-neutral-200" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Export Executive Memo'}
            </button>
            <button
              onClick={resetDefaults}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-neutral-200 transition-all duration-300 shadow-sm ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-200" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
                    Serving Parameters
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-full border border-neutral-800">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`active:scale-[0.97] px-2 py-0.5 text-xs font-mono rounded ${currency === 'INR' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    INR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`active:scale-[0.97] px-2 py-0.5 text-xs font-mono rounded ${currency === 'USD' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Model & Cluster Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                    Foundation Serving Model
                  </label>
                  <select
                    value={foundationModel}
                    onChange={(e) => setFoundationModel(e.target.value as FoundationModel)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  >
                    <option value="llama_3_70b">Meta Llama-3-70B (80 Layers, 8k Context)</option>
                    <option value="deepseek_v2_236b">DeepSeek-V2-236B (MLA Paged Routing)</option>
                    <option value="qwen_2_5_72b">Qwen-2.5-72B (Full Dense Attention)</option>
                    <option value="mistral_large_123b">Mistral-Large-123B (88 Layers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-300 mb-1.5">
                    GPU Node Architecture
                  </label>
                  <select
                    value={gpuClusterType}
                    onChange={(e) => setGpuClusterType(e.target.value as GpuClusterType)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 font-mono"
                  >
                    <option value="nvidia_h100_sxm5_80gb">NVIDIA H100 SXM5 80GB (3.35 TB/s HBM3)</option>
                    <option value="nvidia_b200_nvl_192gb">NVIDIA B200 NVL 192GB (8.0 TB/s HBM3e)</option>
                    <option value="nvidia_a100_80gb">NVIDIA A100 SXM4 80GB (2.0 TB/s HBM2e)</option>
                    <option value="nvidia_l40s_48gb">NVIDIA L40S Ada 48GB (864 GB/s GDDR6)</option>
                  </select>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Cluster GPU Count</span>
                    <span className="text-white font-mono font-bold">{numGpus} GPUs</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="32"
                    step="1"
                    value={numGpus}
                    onChange={(e) => setNumGpus(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                    <span>1 GPU</span>
                    <span>8 (Standard Node)</span>
                    <span>32 GPUs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Concurrent Active Streams</span>
                    <span className="text-white font-mono font-bold">{activeConcurrencyStreams} Streams</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="512"
                    step="16"
                    value={activeConcurrencyStreams}
                    onChange={(e) => setActiveConcurrencyStreams(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                    <span>32 Streams</span>
                    <span>128</span>
                    <span>512 Streams</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Compaction Trigger Threshold</span>
                    <span className="text-white font-mono font-bold">{compactionThresholdPercent}% Fragmentation</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="45"
                    step="5"
                    value={compactionThresholdPercent}
                    onChange={(e) => setCompactionThresholdPercent(Number(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1 font-mono">
                    <span>10% (Aggressive)</span>
                    <span>25% (Balanced)</span>
                    <span>45% (Relaxed)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-neutral-300 font-medium">Paged Block Token Size</span>
                    <span className="text-amber-400 font-mono font-bold">{pageSizeTokens} Tokens / Block</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[16, 32, 64].map((size) => (
                      <button
                        key={size}
                        onClick={() => setPageSizeTokens(size)}
                        className={`active:scale-[0.97] py-1.5 text-xs font-mono rounded-full border transition-all duration-300 ${pageSizeTokens === size ? 'bg-white/10 border-white/30 text-white font-bold' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'}`}
                      >
                        {size} Tok
                      </button>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Concurrency Multiplier
                </div>
                <div className="text-3xl font-extrabold font-mono text-neutral-200">
                  {results.concurrencyMultiplier}x
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  {results.maxConcurrentStreams} max streams
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Compacted Frag
                </div>
                <div className="text-3xl font-extrabold font-mono text-neutral-200">
                  {results.compactedFragmentationPercent}%
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  from {results.rawFragmentationPercent}% raw
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  Recovered HBM
                </div>
                <div className="text-3xl font-extrabold font-mono text-neutral-200">
                  {results.recoveredHbmGigabytes} GB
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  of {results.totalClusterHbmGb} GB HBM
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider mb-1">
                  FinOps Savings
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  OOM: {results.oomCrashProbabilityPercent}%
                </div>
              </div>
            </div>

            {/* Visual Memory Map Allocation HUD */}
            <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-5">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-neutral-200" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
                    HBM Physical Page Table Allocation Matrix
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-white/80 inline-block" /> Active KV
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-white/80 inline-block" /> Compacted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-red-500/50 inline-block" /> Fragmented
                  </span>
                </div>
              </div>

              {/* 16-block memory representation */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 mb-6">
                {results.memoryBlocks.map((block) => (
                  <div
                    key={block.id}
                    className={`h-16 rounded-full border flex flex-col items-center justify-center p-1 text-center transition-all ${
                      block.type === 'ACTIVE_KV'
                        ? 'bg-white/[0.05] border-white/15 text-neutral-200'
                        : block.type === 'RECOVERED_PAGE'
                        ? 'bg-white/[0.05] border-white/15 text-neutral-200'
                        : 'bg-red-950/40 border-red-900/60 text-red-400'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">
                      {block.type === 'ACTIVE_KV' ? 'PAGE' : block.type === 'RECOVERED_PAGE' ? 'COMPACT' : 'HOLE'}
                    </span>
                    <span className="text-[9px] opacity-75 font-mono">
                      #{block.id}
                    </span>
                  </div>
                ))}
              </div>

              {/* Architecture Explanation Box */}
              <div className="bg-neutral-950/60 rounded-2xl p-4 border border-neutral-800/80 text-xs text-neutral-300 leading-relaxed space-y-2 font-mono">
                <div className="text-white font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  cuMemMap Zero-Copy Defragmentation Kernel Status
                </div>
                <p>
                  Zero-copy CUDA Virtual Memory Management remaps physical 2MB GPU pages into contiguous virtual address spaces without issuing device-to-device PCIe copies. Serving concurrency expands from <strong className="text-white">{inputs.activeConcurrencyStreams}</strong> to <strong className="text-neutral-200">{results.maxConcurrentStreams} streams</strong> while dropping out-of-memory crash probability to <strong className="text-white">{results.oomCrashProbabilityPercent}%</strong>.
                </p>
              </div>
            </div>

            {/* Architecture Comparison Table */}
            <div className="bg-[#0a0a0a] border border-neutral-800/80 rounded-[24px] p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono mb-4 pb-2 border-b border-neutral-800">
                Comparative Architecture Matrix: Raw vs. Compacted
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-neutral-400 border-b border-neutral-800">
                      <th className="pb-2">Serving Dimension</th>
                      <th className="pb-2">Raw Uncompacted</th>
                      <th className="pb-2 text-neutral-200">Elesium Zero-Copy Compaction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                    <tr>
                      <td className="py-2.5 font-medium text-white">External HBM Fragmentation</td>
                      <td className="py-2.5 text-red-400">{results.rawFragmentationPercent}% (Severe holes)</td>
                      <td className="py-2.5 text-white font-bold">{results.compactedFragmentationPercent}% (Contiguous virtual map)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Serving Concurrency</td>
                      <td className="py-2.5">{inputs.activeConcurrencyStreams} streams</td>
                      <td className="py-2.5 text-white font-bold">{results.maxConcurrentStreams} streams ({results.concurrencyMultiplier}x expansion)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Defragmentation Latency Overhead</td>
                      <td className="py-2.5 text-red-400">120ms - 450ms (cudaMemcpy stalls)</td>
                      <td className="py-2.5 text-white font-bold">&lt;0.8ms (Zero-copy cuMemMap)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">OOM Crash Eviction Risk</td>
                      <td className="py-2.5 text-red-400">High under sudden burst loads</td>
                      <td className="py-2.5 text-white font-bold">{results.oomCrashProbabilityPercent}% (Zero-OOM SLA)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Annual FinOps Savings</td>
                      <td className="py-2.5">Baseline Hardware OPEX</td>
                      <td className="py-2.5 text-amber-400 font-bold">{results.annualFinOpsSavings} / year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Frequently Asked Questions: KV-Cache Dynamic Compaction
            </h2>
            <p className="text-sm text-neutral-400">
              Technical guidance on GPU virtual memory management, cuMemMap zero-copy defragmentation, and enterprise serving SLAs.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0a0a0a] border border-neutral-800/80 rounded-[24px] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full px-5 py-4 text-left flex items-center justify-between text-sm font-medium text-white hover:text-white transition-all duration-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${openFaq === idx ? 'transform rotate-180 text-neutral-200' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CRO Conversion Block: Architecture Mandate Form */}
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-b from-neutral-900/60 to-[#0a0a0a] border border-neutral-800 rounded-[24px] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.04] rounded-lg blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-white/[0.05] border border-white/15 text-neutral-200 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SOVEREIGN GPU INFRASTRUCTURE AUDIT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Eliminate GPU OOM Crashes &amp; Lock 3.4x Concurrency
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
              Schedule a comprehensive architecture review with our Principal AI Systems Architects. We audit your vLLM, TensorRT-LLM, and SGLang clusters to deploy zero-copy compaction inside your private VPC.
            </p>
          </div>
          {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-[24px] border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-neutral-200">
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
              className="active:scale-[0.97] px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all duration-300 flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-lg bg-neutral-400" />
              <span>Chat on WhatsApp with Lead Architect</span>
            </button>
          </div>
        </div>

        <MandateApplicationForm />
        </div>

      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-neutral-800 rounded-[28px] max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="active:scale-[0.97] absolute top-4 right-4 text-neutral-400 hover:text-white transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-neutral-200" />
              <h3 className="text-base font-bold text-white font-mono">
                Embed KV-Cache Compaction Simulator
              </h3>
            </div>
            <p className="text-xs text-neutral-400 mb-4">
              Copy and paste this clean HTML snippet into your technical documentation, internal Wiki, or partner engineering blog:
            </p>
            <div className="bg-neutral-950 p-3 rounded-[18px] border border-neutral-800 font-mono text-[11px] text-neutral-300 break-all select-all mb-4 max-h-36 overflow-y-auto">
              {embedSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] px-4 py-2 rounded-full text-xs font-mono bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="active:scale-[0.97] px-4 py-2 rounded-full text-xs font-mono bg-white hover:bg-neutral-200 text-black font-bold transition-all duration-300 inline-flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise KV-Cache Memory Compaction Simulator"
        simulatedMetrics={[
          { label: 'Concurrency Multiplier', value: `${results.concurrencyMultiplier}x` },
          { label: 'Compacted Frag', value: `${results.compactedFragmentationPercent}%` },
          { label: 'Recovered HBM', value: `${results.recoveredHbmGigabytes} GB` },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
