import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateDeepseekUnifiedFabric,
  DeepseekUnifiedFabricInputs
} from '../calculator/agentDeepseekUnifiedFabricModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentDeepseekUnifiedFabricSimulator() {
  const [clusterGpuCount, setClusterGpuCount] = useState<number>(256);
  const [servingArchitecture, setServingArchitecture] = useState<DeepseekUnifiedFabricInputs['servingArchitecture']>('grand_unified_fabric');
  const [speculativeMtpDepth, setSpeculativeMtpDepth] = useState<number>(3);
  const [networkInterconnect, setNetworkInterconnect] = useState<DeepseekUnifiedFabricInputs['networkInterconnect']>('quantum2_infiniband_3200g');

  const inputs: DeepseekUnifiedFabricInputs = useMemo(() => ({
    clusterGpuCount,
    servingArchitecture,
    speculativeMtpDepth,
    networkInterconnect,
    inputContextLength: 65536,
    currency: 'USD'
  }), [clusterGpuCount, servingArchitecture, speculativeMtpDepth, networkInterconnect]);

  const results = useMemo(() => calculateDeepseekUnifiedFabric(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: DeepSeek-V3 Grand Unified Serving Fabric Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-deepseek-v3-serving-fabric-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">DeepSeek-V3 Unified Fabric Simulator</h2>
            <p className="text-[11px] text-slate-400">MLA Latents · DualPipe Overlap · MTP Speculative Drafting</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tool #75
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Serving Fabric Architecture</label>
          <select
            value={servingArchitecture}
            onChange={(e) => setServingArchitecture(e.target.value as DeepseekUnifiedFabricInputs['servingArchitecture'])}
            aria-label="Serving Fabric Architecture"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="grand_unified_fabric">Grand Unified Fabric (MLA + MTP + DualPipe Co-Design)</option>
            <option value="disaggregated_pipeline">Disaggregated Prefill/Decode (Separate Stages)</option>
            <option value="unoptimized_baseline">Unoptimized Baseline (Standard MHA + 1F1B)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>Cluster Size</span>
              <span className="text-slate-200 font-mono">{clusterGpuCount} GPUs</span>
            </div>
            <input
              type="range"
              min="32"
              max="512"
              step="32"
              value={clusterGpuCount}
              onChange={(e) => setClusterGpuCount(Number(e.target.value))}
              aria-label="Cluster Size"
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-400 mb-1">
              <span>MTP Speculative Depth</span>
              <span className="text-slate-200 font-mono">k={speculativeMtpDepth}</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              value={speculativeMtpDepth}
              onChange={(e) => setSpeculativeMtpDepth(Number(e.target.value))}
              aria-label="MTP Speculative Depth"
              className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Cluster Fabric Interconnect</label>
          <select
            value={networkInterconnect}
            onChange={(e) => setNetworkInterconnect(e.target.value as DeepseekUnifiedFabricInputs['networkInterconnect'])}
            aria-label="Cluster Fabric Interconnect"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="quantum2_infiniband_3200g">3.2 Tbps Quantum-2 InfiniBand (Sub-1.2µs)</option>
            <option value="roce_v2_800g">800 Gbps RoCE v2 Low-Latency Fabric</option>
            <option value="pcie_gen5_standard">PCIe Gen5 Standard Bus (Baseline)</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/60 rounded-lg border border-slate-800/80 mb-3 text-center">
        <div>
          <div className="text-[10px] text-slate-400">KV-Cache Shrink</div>
          <div className="text-sm font-bold text-emerald-400 font-mono">{results.kvCacheReductionPercent}%</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Decoding Speed</div>
          <div className="text-sm font-bold text-teal-400 font-mono">{results.effectiveDecodedSpeedupFactor}x</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">Pipeline Bubble</div>
          <div className="text-sm font-bold text-sky-400 font-mono">{results.pipelineBubblePercent}%</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 p-2.5 bg-emerald-950/20 rounded border border-emerald-900/30 mb-4 text-xs">
        <div>
          <span className="text-slate-400">Model Flops (MFU): </span>
          <span className="font-mono text-emerald-300 font-semibold">{results.modelFlopsUtilizationPercent}%</span>
        </div>
        <div>
          <span className="text-slate-400">Throughput: </span>
          <span className="font-mono text-emerald-300 font-semibold">{results.decodingThroughputTokensPerSec} tok/s</span>
        </div>
      </div>

      {/* Watermark Backlink */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
        <span>Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Elesium Foundation Model Solutions</a></span>
        <a href="https://elesium.online/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium">
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
