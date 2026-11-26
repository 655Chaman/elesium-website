import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateDualpipeSimulation,
  DualpipeSimulationInputs
} from '../calculator/agentDualpipePipelineModel';
import { GitCommit, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentDualpipePipelineSimulator() {
  const [pipelineParallelStages, setPipelineParallelStages] = useState<number>(16);
  const [microBatchCount, setMicroBatchCount] = useState<number>(32);
  const [pipelineSchedule, setPipelineSchedule] = useState<DualpipeSimulationInputs['pipelineSchedule']>('dualpipe_bidirectional');
  const [crossNodeNetworkFabric, setCrossNodeNetworkFabric] = useState<DualpipeSimulationInputs['crossNodeNetworkFabric']>('infiniband_800g_cx7');

  const inputs: DualpipeSimulationInputs = useMemo(() => ({
    pipelineParallelStages,
    microBatchCount,
    pipelineSchedule,
    crossNodeNetworkFabric,
    hardwareClusterNodes: 16,
    currency: 'USD'
  }), [pipelineParallelStages, microBatchCount, pipelineSchedule, crossNodeNetworkFabric]);

  const results = useMemo(() => calculateDualpipeSimulation(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: DualPipe Pipeline Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-dualpipe-pipeline-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-neutral-100">DualPipe Pipeline Simulator</h2>
            <p className="text-[11px] text-neutral-400">Bidirectional Scheduling · Zero-Bubble · Comm Overlap</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-200 border border-white/15">
          Tool #74
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-neutral-400 mb-1">Pipeline Parallelism Schedule</label>
          <select
            value={pipelineSchedule}
            onChange={(e) => setPipelineSchedule(e.target.value as DualpipeSimulationInputs['pipelineSchedule'])}
            aria-label="Pipeline Parallelism Schedule"
            className="w-full bg-neutral-900 border border-neutral-700/80 rounded px-2.5 py-1.5 text-neutral-200"
          >
            <option value="dualpipe_bidirectional">DualPipe (Bidirectional Chunked Overlap)</option>
            <option value="interleaved_1f1b">Interleaved 1F1B (Multi-stage chunks)</option>
            <option value="standard_1f1b">Standard 1F1B (Unidirectional baseline)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Pipeline Stages (P)</span>
              <span className="text-white font-mono font-semibold">{pipelineParallelStages} stages</span>
            </div>
            <input
              type="range"
              min="4"
              max="32"
              step="4"
              value={pipelineParallelStages}
              onChange={(e) => setPipelineParallelStages(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-neutral-400 mb-1">
              <span>Micro-Batches (M)</span>
              <span className="text-white font-mono font-semibold">{microBatchCount} batches</span>
            </div>
            <input
              type="range"
              min="16"
              max="64"
              step="8"
              value={microBatchCount}
              onChange={(e) => setMicroBatchCount(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block text-neutral-400 mb-1">Inter-Node Network Fabric</label>
          <select
            value={crossNodeNetworkFabric}
            onChange={(e) => setCrossNodeNetworkFabric(e.target.value as DualpipeSimulationInputs['crossNodeNetworkFabric'])}
            aria-label="Inter-Node Network Fabric"
            className="w-full bg-neutral-900 border border-neutral-700/80 rounded px-2.5 py-1.5 text-neutral-200"
          >
            <option value="infiniband_800g_cx7">NVIDIA Quantum-2 InfiniBand 800Gb/s (ConnectX-7)</option>
            <option value="nvlink_infiniband_400g">InfiniBand 400Gb/s + Dual NVLink Domain</option>
            <option value="pcie_gen5_ethernet">Standard RoCEv2 Ethernet 100Gb/s (Congested)</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
          <div className="text-[10px] text-neutral-400">Pipeline Bubble Ratio</div>
          <div className="text-base font-bold text-white">{results.pipelineBubbleRatioPercent}%</div>
          <div className="text-[10px] text-neutral-500">Zero-Bubble Target</div>
        </div>

        <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
          <div className="text-[10px] text-neutral-400">Model Flops Util (MFU)</div>
          <div className="text-base font-bold text-white">{results.modelFlopsUtilizationPercent}%</div>
          <div className="text-[10px] text-neutral-500">Record GPU Efficiency</div>
        </div>

        <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
          <div className="text-[10px] text-neutral-400">Comm Overlap Ratio</div>
          <div className="text-base font-bold text-white">{results.hiddenCommunicationOverlapRatio}%</div>
          <div className="text-[10px] text-neutral-500">All-to-All Hidden</div>
        </div>

        <div className="bg-neutral-900/80 p-2.5 rounded border border-neutral-800">
          <div className="text-[10px] text-neutral-400">Cluster Speedup</div>
          <div className="text-base font-bold text-amber-400">{results.clusterSpeedupFactor}x</div>
          <div className="text-[10px] text-neutral-500">vs Standard 1F1B</div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
        <span className="font-mono text-neutral-200">DeepSeek-V3 DualPipe Engine</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-neutral-200 hover:text-white font-medium"
        >
          Full Simulator <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
