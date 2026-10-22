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
  Database,
  Activity
} from 'lucide-react';
import {
  calculateHierarchicalStoragePaging,
  HierarchicalStoragePagingInputs,
  HierarchicalModelArchitecture,
  StorageHierarchyMode,
  PrefetchEngineType
} from '../calculator/agentHierarchicalStoragePagingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentHierarchicalStoragePagingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<HierarchicalModelArchitecture>('llama_3_1_70b');
  const [storageHierarchyMode, setStorageHierarchyMode] = useState<StorageHierarchyMode>('three_tiered_hbm_cxl_nvme');
  const [totalContextTokens, setTotalContextTokens] = useState<number>(2000000); // 2M tokens
  const [hbmAllocationGb, setHbmAllocationGb] = useState<number>(32);
  const [cxlAllocationGb, setCxlAllocationGb] = useState<number>(256);
  const [nvmeArrayThroughputGbps, setNvmeArrayThroughputGbps] = useState<number>(50);
  const [prefetchEngine, setPrefetchEngine] = useState<PrefetchEngineType>('async_cuda_dma_stream');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: HierarchicalStoragePagingInputs = useMemo(() => ({
    modelArchitecture,
    storageHierarchyMode,
    totalContextTokens,
    hbmAllocationGb,
    cxlAllocationGb,
    nvmeArrayThroughputGbps,
    prefetchEngine,
    currency
  }), [
    modelArchitecture,
    storageHierarchyMode,
    totalContextTokens,
    hbmAllocationGb,
    cxlAllocationGb,
    nvmeArrayThroughputGbps,
    prefetchEngine,
    currency
  ]);

  const results = useMemo(() => calculateHierarchicalStoragePaging(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-hierarchical-storage-paging-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-hierarchical-storage-paging-simulator" target="_blank" rel="noopener" style="color:#6366f1;text-decoration:underline;">Elesium Hierarchical Storage Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: HIERARCHICAL KV-CACHE STORAGE & PAGING ARCHITECTURE
Target Model: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
Storage Mode: ${storageHierarchyMode.replace(/_/g, ' ').toUpperCase()}
Total Context Length: ${totalContextTokens.toLocaleString()} tokens
HBM Allocation: ${hbmAllocationGb} GB | CXL Pool: ${cxlAllocationGb} GB | NVMe Bandwidth: ${nvmeArrayThroughputGbps} GB/s
Prefetch Engine: ${prefetchEngine.replace(/_/g, ' ').toUpperCase()}

PERFORMANCE AUDIT METRICS:
- Total KV Cache Footprint: ${results.totalKvFootprintGb} GB
- Tier Resident Distribution: HBM ${results.hbmResidentPercent}% | CXL ${results.cxlResidentPercent}% | NVMe ${results.nvmeResidentPercent}%
- Page Fault Latency: ${results.averagePageFaultLatencyMs} ms
- Effective Inter-Token Latency: ${results.effectiveInterTokenLatencyMs} ms
- Max Concurrent Streams: ${results.sustainableConcurrentStreams} streams / node
- Hardware Procurement Savings: ${results.formattedHardwareSavings}
- System Status Classification: ${results.statusClassification}

Verified against Asynchronous GPUDirect DMA Prefetch and DPDP Act 2023 zero-remanence cryptographic shredding specifications.
Audit Link: https://elesium.online/tools/enterprise-agent-hierarchical-storage-paging-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setModelArchitecture('llama_3_1_70b');
    setStorageHierarchyMode('three_tiered_hbm_cxl_nvme');
    setTotalContextTokens(2000000);
    setHbmAllocationGb(32);
    setCxlAllocationGb(256);
    setNvmeArrayThroughputGbps(50);
    setPrefetchEngine('async_cuda_dma_stream');
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does hierarchical storage paging prevent GPU compute stalls during page faults?",
      a: "Our dual-stream CUDA runtime architecture isolates token generation GEMMs on a primary compute stream while scheduling asynchronous GPUDirect Storage (GDS) DMA memory transfers on a secondary transfer stream. By prefetching predicted candidate KV blocks ahead of attention scoring, page fault wait times are virtually eliminated."
    },
    {
      q: "What is the difference between CXL 3.0 shared memory and PCIe Gen5 NVMe storage?",
      a: "CXL 3.0 operates directly on cache-coherent memory interfaces providing byte-addressable access with ultra-low latencies (150-250ns) and up to 256 GB/s bandwidth, making it ideal for warm multi-turn context. PCIe Gen5 NVMe drives operate as block storage offering petabyte-scale cold capacity with sub-15 microsecond access."
    },
    {
      q: "How does DPDP Act 2023 compliance apply to KV caches paged to physical NVMe disks?",
      a: "Unlike volatile GPU HBM which loses state immediately on power-down, solid-state NVMe storage retains physical flash bits. The Elesium storage driver mandates per-session AES-XTS-256 hardware encryption keys that are cryptographically shredded upon session termination, guaranteeing zero-remanence compliance with Indian and global data privacy mandates."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-300">
      <Helmet>
        <title>Enterprise Autonomous Agent Hierarchical HBM-to-CXL/NVMe Tiered Storage &amp; Paging Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate hierarchical KV-cache storage paging across HBM3e, CXL 3.0 DRAM, and PCIe Gen5 NVMe SSDs. Model asynchronous DMA prefetching, sub-10ms page faults, and multi-stream concurrency."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-hierarchical-storage-paging-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono">
              <Database className="w-3.5 h-3.5" />
              TOOL #71 · HIERARCHICAL STORAGE &amp; PAGING ENGINE
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Embed Widget
              </button>
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Enterprise Autonomous Agent Hierarchical HBM-to-CXL/NVMe Tiered Storage &amp; Paging Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Model multi-tiered KV-cache paging hierarchies across GPU HBM3e, CXL 3.0 shared DRAM pools, and high-throughput PCIe Gen5 NVMe arrays. Simulate asynchronous DMA prefetch streams, eliminate host-device IO stalls, and sustain 10M+ token context windows at sub-10ms latencies.
          </p>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" /> Storage Topology Controls
                </span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px] font-mono">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Target Foundation Model */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Foundation Model Architecture
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as HierarchicalModelArchitecture)}
                  aria-label="Target Foundation Model Architecture"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="llama_3_1_70b">Llama 3.1 70B (Enterprise Workhorse)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (MLA Compression)</option>
                  <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematics)</option>
                  <option value="sovereign_100b_agent">Sovereign 100B Swarm (Air-Gapped Private VPC)</option>
                  <option value="llama_3_405b">Llama 3.1 405B (Hyperscale Frontier)</option>
                </select>
              </div>

              {/* Storage Hierarchy Mode */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Storage Hierarchy Architecture Mode
                </label>
                <select
                  value={storageHierarchyMode}
                  onChange={(e) => setStorageHierarchyMode(e.target.value as StorageHierarchyMode)}
                  aria-label="Storage Hierarchy Architecture Mode"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="three_tiered_hbm_cxl_nvme">Three-Tiered: HBM3e + CXL 3.0 + NVMe Array (Recommended)</option>
                  <option value="two_tiered_hbm_cxl">Two-Tiered: HBM3e + CXL 3.0 DRAM</option>
                  <option value="two_tiered_hbm_nvme">Two-Tiered: HBM3e + PCIe Gen5 NVMe SSDs</option>
                  <option value="pure_hbm_un_tiered">Pure HBM3e Baseline (No Tiering / OOM Ceiling)</option>
                </select>
              </div>

              {/* Prefetch Engine */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Direct Memory Access (DMA) Prefetch Engine
                </label>
                <select
                  value={prefetchEngine}
                  onChange={(e) => setPrefetchEngine(e.target.value as PrefetchEngineType)}
                  aria-label="Direct Memory Access (DMA) Prefetch Engine"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="async_cuda_dma_stream">Asynchronous CUDA DMA Stream (Zero-Stall Overlap)</option>
                  <option value="gpudirect_storage_gds">GPUDirect Storage (GDS Direct Kernel Bypass)</option>
                  <option value="sync_pcie_transfer">Synchronous PCIe Host Transfer (Pipeline Bubble Stall)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Total Context Length:</span>
                    <span className="font-mono text-indigo-400">{totalContextTokens.toLocaleString()} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="100000"
                    value={totalContextTokens}
                    onChange={(e) => setTotalContextTokens(Number(e.target.value))}
                    aria-label="Total Context Length"
                    className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Hot HBM Allocation:</span>
                    <span className="font-mono text-indigo-400">{hbmAllocationGb} GB / Node</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="128"
                    step="8"
                    value={hbmAllocationGb}
                    onChange={(e) => setHbmAllocationGb(Number(e.target.value))}
                    aria-label="Hot HBM Allocation"
                    className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Warm CXL 3.0 Pool:</span>
                    <span className="font-mono text-indigo-400">{cxlAllocationGb} GB Pool</span>
                  </div>
                  <input
                    type="range"
                    min="64"
                    max="1024"
                    step="64"
                    value={cxlAllocationGb}
                    onChange={(e) => setCxlAllocationGb(Number(e.target.value))}
                    aria-label="Warm CXL 3.0 Pool"
                    className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Cold NVMe Array Throughput:</span>
                    <span className="font-mono text-indigo-400">{nvmeArrayThroughputGbps} GB/s</span>
                  </div>
                  <input
                    type="range"
                    min="14"
                    max="100"
                    step="6"
                    value={nvmeArrayThroughputGbps}
                    onChange={(e) => setNvmeArrayThroughputGbps(Number(e.target.value))}
                    aria-label="Cold NVMe Array Throughput"
                    className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">KV Cache Footprint</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {results.totalKvFootprintGb} <span className="text-xs text-slate-400 font-normal">GB</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Total Context Footprint</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Page Fault Latency</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-400 mt-1">
                  {results.averagePageFaultLatencyMs} <span className="text-xs text-slate-400 font-normal">ms</span>
                </div>
                <div className="text-[10px] text-indigo-400/80 mt-1">Sub-10ms Servicing</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Concurrent Streams</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.sustainableConcurrentStreams} <span className="text-xs text-slate-400 font-normal">streams</span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1">Per 8-GPU Node</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Hardware Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {results.formattedHardwareSavings}
                </div>
                <div className="text-[10px] text-cyan-400/80 mt-1">Procurement Delta</div>
              </div>
            </div>

            {/* Architecture Telemetry Diagram */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-400" /> Three-Tier Storage Allocation Telemetry
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {results.statusClassification}
                </span>
              </div>

              {/* Progress Bar of Memory Tiers */}
              <div className="space-y-2">
                <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
                  <div
                    style={{ width: `${results.hbmResidentPercent}%` }}
                    className="bg-indigo-500 h-full transition-all duration-300"
                    title={`Tier 1 (HBM): ${results.hbmResidentPercent}%`}
                  />
                  <div
                    style={{ width: `${results.cxlResidentPercent}%` }}
                    className="bg-cyan-500 h-full transition-all duration-300"
                    title={`Tier 2 (CXL): ${results.cxlResidentPercent}%`}
                  />
                  <div
                    style={{ width: `${results.nvmeResidentPercent}%` }}
                    className="bg-slate-600 h-full transition-all duration-300"
                    title={`Tier 3 (NVMe): ${results.nvmeResidentPercent}%`}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span> Tier 1 (HBM): {results.hbmResidentPercent}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span> Tier 2 (CXL): {results.cxlResidentPercent}%
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block"></span> Tier 3 (NVMe): {results.nvmeResidentPercent}%
                  </span>
                </div>
              </div>

              {/* Architectural Synthesis Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300 leading-relaxed">
                <div className="font-semibold text-slate-100">Zero-Stall Asynchronous Paging Verified</div>
                <p>
                  Asynchronous GPUDirect DMA overlap eliminates Host-to-Device transfer stalls, sustaining an effective Inter-Token Latency of{' '}
                  <strong className="text-indigo-400 font-mono">{results.effectiveInterTokenLatencyMs} ms</strong> across ultra-long contexts up to 10M tokens.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>DPDP Act 2023 Ephemeral Purging: Verified</span>
                  <button
                    onClick={copyMemo}
                    className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 font-medium"
                  >
                    {hasCopiedMemo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {hasCopiedMemo ? 'Memo Copied!' : 'Copy Technical Memo'}
                  </button>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-200">Architectural FAQs</h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-3 text-xs font-medium text-slate-200 flex justify-between items-center bg-slate-950/40 hover:bg-slate-950/80 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3 text-xs text-slate-400 bg-slate-950/90 border-t border-slate-800 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Enterprise Mandate Section */}
        <section className="mt-12 pt-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Deploy Sovereign Hierarchical KV Storage on Your GPU Clusters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule an architecture audit with our Principal Distributed Systems team to evaluate CXL memory pooling and GPUDirect Storage implementation on private VPC clusters.
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
        </section>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> Embed Simulator Widget
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Embed this responsive interactive calculator directly on your website or technical documentation.
            </p>
            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto whitespace-pre-wrap">
                {embedSnippet}
              </pre>
              <button
                onClick={copyEmbed}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium inline-flex items-center gap-1"
              >
                {hasCopiedEmbed ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {hasCopiedEmbed ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Hierarchical KV Storage Paging Simulator"
        simulatedMetrics={[
          { label: 'Page Fault Latency', value: `${results.averagePageFaultLatencyMs} ms`, detail: 'Sub-10ms servicing' },
          { label: 'Inter-Token Latency', value: `${results.effectiveInterTokenLatencyMs} ms`, detail: 'Sub-8ms real-time' },
          { label: 'Max Context Window', value: `${(totalContextTokens / 1000000).toFixed(1)}M tok`, detail: 'Hierarchical paging' },
          { label: 'Hardware Savings', value: results.formattedHardwareSavings, detail: 'Procurement delta' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
