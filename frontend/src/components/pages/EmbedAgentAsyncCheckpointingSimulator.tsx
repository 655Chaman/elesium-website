import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateAsyncCheckpointing,
  AsyncCheckpointingInputs,
  AsyncCheckpointModelArchitecture,
  CheckpointStrategy
} from '../calculator/agentAsyncCheckpointingModel';
import { HardDriveDownload, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentAsyncCheckpointingSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<AsyncCheckpointModelArchitecture>('sovereign_100b_agent');
  const [checkpointStrategy, setCheckpointStrategy] = useState<CheckpointStrategy>('non_blocking_cuda_pinned_host');
  const [clusterNodesCount, setClusterNodesCount] = useState<number>(8); // 64 GPUs
  const interconnectBandwidthGbps = 400;
  const checkpointIntervalMinutes = 15;
  const failureRatePerWeekPercent = 5;

  const inputs: AsyncCheckpointingInputs = useMemo(() => ({
    modelArchitecture,
    checkpointStrategy,
    clusterNodesCount,
    interconnectBandwidthGbps,
    checkpointIntervalMinutes,
    failureRatePerWeekPercent,
    currency: 'USD'
  }), [
    modelArchitecture,
    checkpointStrategy,
    clusterNodesCount
  ]);

  const results = useMemo(() => calculateAsyncCheckpointing(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Asynchronous GPU Checkpointing Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-async-checkpointing-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <HardDriveDownload className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Asynchronous GPU Checkpointing Simulator</h3>
            <p className="text-[11px] text-slate-400">Non-Blocking Memory Offload & In-Flight State Migration</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-async-checkpointing-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3 text-xs mb-4">
        <div>
          <label className="text-slate-400 block mb-1 font-mono text-[11px]">Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as AsyncCheckpointModelArchitecture)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-white font-mono"
          >
            <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent (1.8 TB State)</option>
            <option value="llama_3_1_70b">Meta Llama-3.1 70B (1.26 TB State)</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (12.0 TB State)</option>
            <option value="llama_3_405b">Meta Llama-3 405B (7.29 TB State)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">Checkpoint Strategy</label>
            <select
              value={checkpointStrategy}
              onChange={(e) => setCheckpointStrategy(e.target.value as CheckpointStrategy)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value="non_blocking_cuda_pinned_host">Non-Blocking CUDA Pinned RAM</option>
              <option value="in_flight_rdma_roce">In-Flight RDMA RoCE-v2</option>
              <option value="nvme_gpudirect_storage">NVMe GPUDirect Storage</option>
              <option value="synchronous_blocking_nfs">Synchronous Blocking NFS</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">Cluster Scale</label>
            <select
              value={clusterNodesCount}
              onChange={(e) => setClusterNodesCount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value={4}>4 Nodes (32 GPUs)</option>
              <option value={8}>8 Nodes (64 GPUs)</option>
              <option value={16}>16 Nodes (128 GPUs)</option>
              <option value={32}>32 Nodes (256 GPUs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Telemetry Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-2 mb-3">
        <div className="flex justify-between items-center text-slate-400">
          <span>Blocking Checkpoint Pause:</span>
          <span className={results.checkpointPauseMs < 100 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
            {results.checkpointPauseMs.toLocaleString()} ms {results.checkpointPauseMs < 100 ? '(Sub-50ms Masked)' : '(Blocking Cluster Bubble)'}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Cluster Idle Bubble Ratio:</span>
          <span className={results.clusterIdleBubblePercent < 1.0 ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
            {results.clusterIdleBubblePercent}% Wasted Compute
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>In-Flight Failover Latency:</span>
          <span className="text-white font-semibold">
            {results.stateMigrationFailoverMs.toLocaleString()} ms ({results.stateMigrationFailoverMs < 300 ? 'Live Migration' : 'Cold Restart'})
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/60 pt-2">
          <span>Realized Cluster MFU:</span>
          <span className="text-emerald-400 font-bold">{results.clusterMfuPercent}% Effective FLOPs</span>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="text-[11px] text-slate-500 text-right font-sans">
        Powered by{' '}
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          Elesium Sovereign AI Systems
        </a>
      </div>
    </div>
  );
}
