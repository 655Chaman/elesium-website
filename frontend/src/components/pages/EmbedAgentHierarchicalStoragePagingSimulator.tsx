import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateHierarchicalStoragePaging,
  HierarchicalStoragePagingInputs,
  HierarchicalModelArchitecture,
  StorageHierarchyMode,
  PrefetchEngineType
} from '../calculator/agentHierarchicalStoragePagingModel';
import { Database, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentHierarchicalStoragePagingSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<HierarchicalModelArchitecture>('llama_3_1_70b');
  const [storageHierarchyMode, setStorageHierarchyMode] = useState<StorageHierarchyMode>('three_tiered_hbm_cxl_nvme');
  const [prefetchEngine, setPrefetchEngine] = useState<PrefetchEngineType>('async_cuda_dma_stream');
  const totalContextTokens = 1000000; // 1M tokens
  const hbmAllocationGb = 32;
  const cxlAllocationGb = 256;
  const nvmeArrayThroughputGbps = 50;

  const inputs: HierarchicalStoragePagingInputs = useMemo(() => ({
    modelArchitecture,
    storageHierarchyMode,
    totalContextTokens,
    hbmAllocationGb,
    cxlAllocationGb,
    nvmeArrayThroughputGbps,
    prefetchEngine,
    currency: 'USD'
  }), [
    modelArchitecture,
    storageHierarchyMode,
    totalContextTokens,
    hbmAllocationGb,
    cxlAllocationGb,
    nvmeArrayThroughputGbps,
    prefetchEngine
  ]);

  const results = useMemo(() => calculateHierarchicalStoragePaging(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Hierarchical KV Storage Paging Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-hierarchical-storage-paging-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Hierarchical KV Storage Paging Simulator</h2>
            <p className="text-[11px] text-slate-400">HBM3e · CXL 3.0 DRAM · PCIe Gen5 NVMe · Sub-10ms Faults</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          Tool #71
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as HierarchicalModelArchitecture)}
            aria-label="Target Foundation Model"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="llama_3_1_70b">Llama 3.1 70B (Enterprise Workhorse)</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (MLA Compression)</option>
            <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematics)</option>
            <option value="sovereign_100b_agent">Sovereign 100B Swarm (Air-Gapped Private VPC)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Storage Hierarchy Mode</label>
          <select
            value={storageHierarchyMode}
            onChange={(e) => setStorageHierarchyMode(e.target.value as StorageHierarchyMode)}
            aria-label="Storage Hierarchy Mode"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="three_tiered_hbm_cxl_nvme">Three-Tiered: HBM3e + CXL 3.0 + NVMe Array (Recommended)</option>
            <option value="two_tiered_hbm_cxl">Two-Tiered: HBM3e + CXL 3.0 DRAM</option>
            <option value="two_tiered_hbm_nvme">Two-Tiered: HBM3e + PCIe Gen5 NVMe SSDs</option>
            <option value="pure_hbm_un_tiered">Pure HBM3e Baseline (No Tiering / OOM Ceiling)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Prefetch Engine</label>
          <select
            value={prefetchEngine}
            onChange={(e) => setPrefetchEngine(e.target.value as PrefetchEngineType)}
            aria-label="Prefetch Engine"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="async_cuda_dma_stream">Asynchronous CUDA DMA Stream (Zero-Stall Overlap)</option>
            <option value="gpudirect_storage_gds">GPUDirect Storage (GDS Kernel Bypass)</option>
            <option value="sync_pcie_transfer">Synchronous PCIe Copy (Pipeline Bubble Bottleneck)</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Total KV Footprint</div>
          <div className="text-sm font-bold text-slate-200">{results.totalKvFootprintGb} GB</div>
          <div className="text-[10px] text-slate-500">HBM: {results.hbmResidentPercent}% | CXL: {results.cxlResidentPercent}% | NVMe: {results.nvmeResidentPercent}%</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Page Fault Latency</div>
          <div className="text-sm font-bold text-indigo-400">{results.averagePageFaultLatencyMs} ms</div>
          <div className="text-[10px] text-slate-500">ITL: {results.effectiveInterTokenLatencyMs} ms</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Concurrent Streams</div>
          <div className="text-sm font-bold text-emerald-400">{results.sustainableConcurrentStreams} streams</div>
          <div className="text-[10px] text-slate-500">Per 8-GPU Node</div>
        </div>
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Hardware TCO Savings</div>
          <div className="text-sm font-bold text-cyan-400">{results.formattedHardwareSavings}</div>
          <div className="text-[10px] text-slate-500">Procurement Delta</div>
        </div>
      </div>

      {/* Footer / CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Powered by Elesium Sovereign Systems</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-hierarchical-storage-paging-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
