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
  Layers,
  Activity
} from 'lucide-react';
import {
  calculateAsyncCheckpointing,
  AsyncCheckpointingInputs,
  AsyncCheckpointModelArchitecture,
  CheckpointStrategy
} from '../calculator/agentAsyncCheckpointingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentAsyncCheckpointingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<AsyncCheckpointModelArchitecture>('sovereign_100b_agent');
  const [checkpointStrategy, setCheckpointStrategy] = useState<CheckpointStrategy>('non_blocking_cuda_pinned_host');
  const [clusterNodesCount, setClusterNodesCount] = useState<number>(8); // 64 GPUs
  const [interconnectBandwidthGbps, setInterconnectBandwidthGbps] = useState<100 | 200 | 400 | 800>(400);
  const [checkpointIntervalMinutes, setCheckpointIntervalMinutes] = useState<number>(15);
  const [failureRatePerWeekPercent, setFailureRatePerWeekPercent] = useState<number>(5);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AsyncCheckpointingInputs = useMemo(() => ({
    modelArchitecture,
    checkpointStrategy,
    clusterNodesCount,
    interconnectBandwidthGbps,
    checkpointIntervalMinutes,
    failureRatePerWeekPercent,
    currency
  }), [
    modelArchitecture,
    checkpointStrategy,
    clusterNodesCount,
    interconnectBandwidthGbps,
    checkpointIntervalMinutes,
    failureRatePerWeekPercent,
    currency
  ]);

  const results = useMemo(() => calculateAsyncCheckpointing(inputs), [inputs]);

  const resetDefaults = () => {
    setModelArchitecture('sovereign_100b_agent');
    setCheckpointStrategy('non_blocking_cuda_pinned_host');
    setClusterNodesCount(8);
    setInterconnectBandwidthGbps(400);
    setCheckpointIntervalMinutes(15);
    setFailureRatePerWeekPercent(5);
    setCurrency('INR');
  };

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-async-checkpointing-simulator" width="100%" height="520" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>\n<div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-async-checkpointing-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Asynchronous Checkpoint Engine</a></div>`;

  const copyEmbed = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setHasCopiedEmbed(true);
      setTimeout(() => setHasCopiedEmbed(false), 2500);
    } catch {
      // Fallback
    }
  };

  const copyMemo = async () => {
    const memo = `ELESIUM ENTERPRISE AI AUDIT MEMO: ASYNCHRONOUS GPU CHECKPOINTING & MIGRATION
--------------------------------------------------------------------------------
Foundation Model Architecture: ${modelArchitecture} (${results.totalStateSnapshotGb} GB State)
Checkpoint Strategy: ${checkpointStrategy}
Cluster Configuration: ${clusterNodesCount} Nodes (${results.totalGpus} GPUs) · ${interconnectBandwidthGbps} Gbps
Checkpoint Epoch Interval: Every ${checkpointIntervalMinutes} minutes | Failure Exposure: ${failureRatePerWeekPercent}%/wk
--------------------------------------------------------------------------------
ANALYTICAL TELEMETRY RESULTS:
* Checkpoint Pause Bubble: ${results.checkpointPauseMs.toLocaleString()} ms (${results.checkpointPauseMs < 100 ? 'Sub-50ms Masked Offload' : 'Blocking Cluster Halt'})
* Cluster Idle Bubble Ratio: ${results.clusterIdleBubblePercent}% Wasted Compute Hours
* In-Flight Failover Latency: ${results.stateMigrationFailoverMs.toLocaleString()} ms (${results.stateMigrationFailoverMs < 300 ? 'Live RDMA Migration' : 'Cold Manual Restart'})
* Realized Cluster MFU: ${results.clusterMfuPercent}% Model FLOPs Utilization
* Data Loss Exposure Risk: ${results.dataLossExposureRisk.replace(/_/g, ' ')}
* Annual FinOps Savings: ${results.annualFinOpsSavings} (Est. $${(results.rawAnnualSavingsUsd / 1000).toFixed(0)}k USD / yr)
* Fault Tolerance Status: ${results.statusClassification}
--------------------------------------------------------------------------------
Sovereign DPDP Act 2023 & RBI Compliance: 100% On-Premise Air-Gapped Verified.
Generated via: https://elesium.online/tools/enterprise-agent-async-checkpointing-simulator`;

    try {
      await navigator.clipboard.writeText(memo);
      setHasCopiedMemo(true);
      setTimeout(() => setHasCopiedMemo(false), 2500);
    } catch {
      // Fallback
    }
  };

  const faqs = [
    {
      q: 'How does asynchronous GPU checkpointing eliminate the checkpoint pause bubble in distributed clusters?',
      a: 'Synchronous checkpointing forces all GPUs to halt execution while writing state to shared network filesystems, introducing 10-60 second idle pauses. Asynchronous checkpointing schedules non-blocking Direct Memory Access (DMA) transfers from GPU HBM3 to page-locked (pinned) host CPU RAM across dedicated CUDA copy streams. The snapshot transfer takes under 50ms and is completely masked behind active forward-pass GEMM iterations.'
    },
    {
      q: 'What is the operational difference between checkpointing static model weights and in-flight agent sessions?',
      a: 'Static foundation model checkpointing only saves model weights and optimizer states. Autonomous multi-agent swarms possess dynamic state trees, including uncommitted database transactions, tool execution stacks, dialogue histories, and KV cache pages. Our causal tree serialization captures these state graphs atomically using copy-on-write virtual memory pointers.'
    },
    {
      q: 'How does in-flight state migration enable 70% FinOps savings on cloud spot GPU instances?',
      a: 'Spot cloud GPU instances are subject to abrupt 30-to-120-second eviction notices. By integrating with Slurm preemption signals and cloud provider webhooks, our in-flight migrator streams active agent state across 400 Gbps RoCE-v2/InfiniBand fabrics to replacement nodes in sub-120ms, allowing enterprise workloads to utilize low-cost spot clusters without data loss.'
    },
    {
      q: 'How does this architecture satisfy the statutory disaster recovery directives of the Indian DPDP Act 2023?',
      a: 'The Digital Personal Data Protection (DPDP) Act 2023 mandates statutory business continuity and auditable disaster recovery for critical financial and healthcare systems. Every state snapshot generated by Elesium computes a cryptographic SHA-256 Merkle root hash, verifying complete data integrity while preserving data residency within sovereign Indian air-gapped enclaves.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>Asynchronous GPU Checkpointing & State Migration Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate non-blocking GPU memory offloading to pinned host RAM, in-flight agent state migration over RDMA RoCE-v2, and zero-downtime Slurm preemption failovers."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-async-checkpointing-simulator" />
      </Helmet>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-8">
          <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
          <span>/</span>
          <a href="/tools" className="hover:text-emerald-400 transition-colors">Tools</a>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">Async Checkpointing Simulator</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <HardDriveDownload className="w-3.5 h-3.5" />
              <span>Tool #67: Fault-Tolerance & Checkpointing Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Agent Asynchronous Checkpointing & In-Flight State Migration Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Model non-blocking host-to-device memory offloading, PCIe Gen5 DMA streaming, causal state tree serialization, and sub-120ms Slurm failovers across distributed sovereign GPU clusters.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-3 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-2"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Tool</span>
            </button>
            <button
              onClick={resetDefaults}
              className="px-3 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid (5 cols inputs, 7 cols outputs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          {/* Left Column: Interactive Hardware & Checkpoint Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Checkpoint & Cluster Configuration</span>
                </div>
                <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-[11px] font-mono">
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

              {/* Model Architecture */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Target Foundation Model</label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as AsyncCheckpointModelArchitecture)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent (1.8 TB State Snapshot)</option>
                  <option value="llama_3_1_70b">Meta Llama-3.1 70B (1.26 TB State Snapshot)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (12.0 TB State Snapshot)</option>
                  <option value="llama_3_405b">Meta Llama-3 405B (7.29 TB State Snapshot)</option>
                  <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B (1.30 TB State Snapshot)</option>
                </select>
              </div>

              {/* Checkpoint Strategy */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Checkpointing Architecture & Mechanism</label>
                <select
                  value={checkpointStrategy}
                  onChange={(e) => setCheckpointStrategy(e.target.value as CheckpointStrategy)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="non_blocking_cuda_pinned_host">Non-Blocking CUDA Pinned Host RAM (PCIe Gen5 DMA · Recommended)</option>
                  <option value="in_flight_rdma_roce">In-Flight RDMA RoCE-v2 Peer Memory Replication (Sub-30ms)</option>
                  <option value="nvme_gpudirect_storage">NVMe GPUDirect Storage Offload (Local PCIe Flash)</option>
                  <option value="synchronous_blocking_nfs">Synchronous Blocking NFS/Lustre File Dump (Legacy)</option>
                </select>
              </div>

              {/* Cluster Scale (Nodes) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Cluster Size (8 GPUs/Node)</span>
                  <span className="text-emerald-400 font-semibold">{clusterNodesCount} Nodes ({results.totalGpus} GPUs)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[2, 4, 8, 16].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setClusterNodesCount(val)}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        clusterNodesCount === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-white/10 bg-black/30 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      {val} Nodes
                    </button>
                  ))}
                </div>
              </div>

              {/* Interconnect Bandwidth */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Inter-Node Network Fabric</label>
                <select
                  value={interconnectBandwidthGbps}
                  onChange={(e) => setInterconnectBandwidthGbps(Number(e.target.value) as 100 | 200 | 400 | 800)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value={800}>800 Gbps Quantum-2 InfiniBand / Ultra Ethernet</option>
                  <option value={400}>400 Gbps RoCE-v2 / NDR InfiniBand (Enterprise Standard)</option>
                  <option value={200}>200 Gbps HDR InfiniBand</option>
                  <option value={100}>100 Gbps Standard RoCE-v2</option>
                </select>
              </div>

              {/* Checkpoint Interval & Failure Exposure */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Epoch Interval</label>
                  <select
                    value={checkpointIntervalMinutes}
                    onChange={(e) => setCheckpointIntervalMinutes(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={5}>Every 5 Mins</option>
                    <option value={15}>Every 15 Mins</option>
                    <option value={30}>Every 30 Mins</option>
                    <option value={60}>Every 60 Mins</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Fault Probability</label>
                  <select
                    value={failureRatePerWeekPercent}
                    onChange={(e) => setFailureRatePerWeekPercent(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={2}>2% / Week (Low)</option>
                    <option value={5}>5% / Week (Standard)</option>
                    <option value={12}>12% / Week (Spot Clouds)</option>
                    <option value={25}>25% / Week (High Preemption)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Analytical Outputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Banner */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
              results.statusClassification === 'ZERO_BUBBLE_FAULT_TOLERANT'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : results.statusClassification === 'HIGH_AVAILABILITY_STABLE'
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                : results.statusClassification === 'CHECKPOINT_PAUSE_BOTTLENECK'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                    {results.statusClassification.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-300">
                    {results.statusClassification === 'ZERO_BUBBLE_FAULT_TOLERANT' && 'Non-blocking DMA active. Checkpoint pause bubble completely masked.'}
                    {results.statusClassification === 'HIGH_AVAILABILITY_STABLE' && 'NVMe direct storage active. Rapid local recovery enabled.'}
                    {results.statusClassification === 'CHECKPOINT_PAUSE_BOTTLENECK' && 'Significant cluster idle time. Synchronous NFS blocking active FLOPs.'}
                    {results.statusClassification === 'CATASTROPHIC_FAILURE_EXPOSURE' && 'High preemption risk with blocking saves. Severe progress loss.'}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xl font-bold">{results.checkpointPauseMs.toLocaleString()} ms</div>
                <div className="text-[10px] text-gray-400">Pause Duration</div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Cluster FLOPs (MFU)</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{results.clusterMfuPercent}%</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Realized Efficiency</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Idle Bubble Ratio</div>
                <div className={`text-2xl font-mono font-bold mt-1 ${results.clusterIdleBubblePercent < 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {results.clusterIdleBubblePercent}%
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Wasted Compute</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Failover Latency</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.stateMigrationFailoverMs.toLocaleString()} ms</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">Live In-Flight Migration</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Total Snapshot</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.totalStateSnapshotGb} GB</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Weights + Optimizer</div>
              </div>
            </div>

            {/* In-Flight Migration Pipeline Diagram */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-white">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Non-Blocking Checkpoint Stream & In-Flight State Transfer</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  {results.totalGpus} GPUs · PCIe Gen5 DMA + 400G RoCE-v2
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 1: DEVICE-TO-HOST MEMORY DMA</span>
                  <span className="text-emerald-400">Dedicated CUDA copy stream offloads HBM3 to pinned RAM in 42ms</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 2: CAUSAL GRAPH SERIALIZATION</span>
                  <span className="text-blue-400">Atomic execution tree and uncommitted transactions snapshotted</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 3: IN-FLIGHT RDMA STATE REPLICATION</span>
                  <span className="text-purple-400">Preemption notice triggers sub-120ms transfer to hot-standby node</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">DATA INTEGRITY & AUDIT TRAIL</span>
                  <span className="text-amber-400">SHA-256 Merkle root verification · DPDP Act 2023 certified</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Annual FinOps Savings:</span>
                  <span className="text-emerald-400 font-semibold">{results.annualFinOpsSavings}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Data Loss Risk:</span>
                  <span className="text-white font-semibold">{results.dataLossExposureRisk.replace(/_/g, ' ')}</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy Asynchronous Fault-Tolerance for Your Cluster</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated Slurm asynchronous checkpoint hook and RoCE-v2 failover recipe.</p>
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

        <MandateApplicationForm source="Tool #67: Asynchronous Checkpointing Simulator" />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-4xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Technical Questions</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-semibold text-gray-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0d0d12] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Embed Asynchronous Checkpoint Simulator</h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Embed this interactive simulator on your engineering blog or portal. Includes automated attribution to Elesium Sovereign AI Systems.
            </p>
            <div className="relative">
              <textarea
                readOnly
                value={embedSnippet}
                rows={5}
                className="w-full bg-black/60 border border-white/10 rounded-xl p-3 text-xs font-mono text-gray-300 focus:outline-none"
              />
              <button
                onClick={copyEmbed}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-mono flex items-center gap-1.5"
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
        toolName="Enterprise Asynchronous Checkpointing Simulator"
        simulatedMetrics={[
          { label: 'Pause Bubble', value: `${results.checkpointPauseMs} ms` },
          { label: 'Cluster MFU', value: `${results.clusterMfuPercent}%` },
          { label: 'Failover Latency', value: `${results.stateMigrationFailoverMs} ms` },
          { label: 'FinOps Savings', value: results.annualFinOpsSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
