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
  Network,
  Layers,
  Activity
} from 'lucide-react';
import {
  calculateThreeDParallelism,
  ThreeDParallelismInputs,
  ThreeDModelArchitecture,
  TpDegree,
  PpDegree,
  DpDegree,
  ZeroStage,
  PipelineSchedule,
  InterconnectType
} from '../calculator/agent3DParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgent3DParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ThreeDModelArchitecture>('sovereign_100b_agent');
  const [tpDegree, setTpDegree] = useState<TpDegree>(8);
  const [ppDegree, setPpDegree] = useState<PpDegree>(4);
  const [dpDegree, setDpDegree] = useState<DpDegree>(8);
  const [zeroStage, setZeroStage] = useState<ZeroStage>('zero_3');
  const [pipelineSchedule, setPipelineSchedule] = useState<PipelineSchedule>('zero_bubble');
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_ndr_infiniband');
  const [sequenceLengthTokens, setSequenceLengthTokens] = useState<number>(32768);
  const [batchSize, setBatchSize] = useState<number>(16);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ThreeDParallelismInputs = useMemo(() => ({
    modelArchitecture,
    tpDegree,
    ppDegree,
    dpDegree,
    zeroStage,
    pipelineSchedule,
    interconnect,
    sequenceLengthTokens,
    batchSize,
    currency
  }), [
    modelArchitecture,
    tpDegree,
    ppDegree,
    dpDegree,
    zeroStage,
    pipelineSchedule,
    interconnect,
    sequenceLengthTokens,
    batchSize,
    currency
  ]);

  const results = useMemo(() => calculateThreeDParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelArchitecture('sovereign_100b_agent');
    setTpDegree(8);
    setPpDegree(4);
    setDpDegree(8);
    setZeroStage('zero_3');
    setPipelineSchedule('zero_bubble');
    setInterconnect('nvlink_ndr_infiniband');
    setSequenceLengthTokens(32768);
    setBatchSize(16);
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-3d-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-3d-parallelism-simulator" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium 3D Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const executiveMemo = `ELESIUM ENTERPRISE 3D PARALLELISM & CLUSTER ORCHESTRATION AUDIT MEMO
Generated: ${new Date().toISOString()}
Target Foundation Model: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
Cluster Composition: ${results.totalGpus} GPUs (TP=${tpDegree}, PP=${ppDegree}, DP=${dpDegree})
Memory Optimization: DeepSpeed ${zeroStage.toUpperCase()}
Pipeline Scheduler: ${pipelineSchedule.replace(/_/g, ' ').toUpperCase()}
Interconnect Fabric: ${interconnect.replace(/_/g, ' ').toUpperCase()}

KEY METRICS & PERFORMANCE SLA:
- Model FLOPs Utilization (MFU): ${results.modelFlopsUtilizationPercent}%
- Peak GPU VRAM Footprint: ${results.peakMemoryPerGpuGb} GB (80GB SXM5 Boundary: ${results.oomRiskPrevented ? 'COMPLIANT' : 'OOM FAULT'})
- Pipeline Bubble Idle Ratio: ${results.pipelineBubbleFractionPercent}%
- Effective Forward Step Latency: ${results.effectiveStepLatencyMs} ms
- Cluster Token Throughput: ${results.tokensPerSecondThroughput.toLocaleString()} tokens/sec
- Projected FinOps Annual Savings: ${results.annualFinOpsSavings}

STATUTORY COMPLIANCE:
DPDP Act 2023 Sovereign Indian Datacenter Deployment (CtrlS/Yotta/Nxtra). Zero Third-Party Cloud Data Leakage. Section 63 BSA Digital Evidence Attestation.`;

  const copyMemo = () => {
    navigator.clipboard.writeText(executiveMemo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: 'What is 3D Parallelism in enterprise foundation model deployment?',
      a: '3D Parallelism unifies Tensor Parallelism (TP, splitting weight matrices intra-node over NVLink), Pipeline Parallelism (PP, dividing neural layers inter-node over InfiniBand), and Data Parallelism with ZeRO-3 (DP, partitioning optimizer states and weights across nodes). This Cartesian grid architecture allows 100B+ models to scale efficiently across hundreds of GPUs.'
    },
    {
      q: 'How does zero-bubble interleaved pipeline scheduling eliminate idle time?',
      a: 'Traditional 1F1B schedules leave early pipeline stages waiting idle during backward passes. Zero-bubble interleaved scheduling decomposes each physical GPU rank into multiple non-contiguous virtual stages, interleaving forward passes of incoming micro-batches with backward passes of earlier stages to slash the bubble ratio below 3%.'
    },
    {
      q: 'Can 3D parallel clusters run under air-gapped DPDP Act 2023 compliance in India?',
      a: 'Yes. Elesium deploys 3D parallel clusters inside air-gapped enterprise VPCs or on-premise bare-metal Slurm GPU clusters in Indian datacenters. All weights and state transitions remain strictly within local sovereign borders with zero external cloud API leakage.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-gray-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      <Helmet>
        <title>Enterprise 3D Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Megatron-DeepSpeed 3D Parallelism (TP + PP + ZeRO-3) across GPU clusters. Calculate MFU, pipeline bubble ratios, VRAM allocation, and sub-8ms step latency."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-3d-parallelism-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="border-b border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent pt-28 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                <Network className="w-3.5 h-3.5" />
                <span>Tool #65 · Megatron-DeepSpeed 3D Mesh Engine</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">
                Enterprise 3D Parallelism & Mesh Simulator
              </h1>
              <p className="text-gray-400 max-w-3xl text-sm sm:text-base leading-relaxed">
                Model multi-dimensional distributed GPU clusters: calibrate Tensor Parallelism (TP), Pipeline Parallelism (PP), and ZeRO-3 memory partitioning to execute 100B+ autonomous agent swarms with zero-bubble schedules.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Defaults
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-2"
              >
                <Code className="w-3.5 h-3.5" />
                Embed Tool
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Sliders & Parameter Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>3D Mesh Configuration</span>
                </div>
                <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/10 text-[11px] font-mono">
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
                  onChange={(e) => setModelArchitecture(e.target.value as ThreeDModelArchitecture)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent (Elesium Core)</option>
                  <option value="llama_3_1_70b">Meta Llama-3.1 70B (Dense Architecture)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B (MoE Architecture)</option>
                  <option value="llama_3_405b">Meta Llama-3 405B (Frontier Dense)</option>
                  <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B (Reasoning Model)</option>
                </select>
              </div>

              {/* Tensor Parallelism (TP) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Tensor Parallelism (TP Degree)</span>
                  <span className="text-emerald-400 font-semibold">{tpDegree}x GPUs (Intra-Node)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 4, 8].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setTpDegree(val as TpDegree)}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        tpDegree === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-white/10 bg-black/30 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      TP={val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pipeline Parallelism (PP) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Pipeline Parallelism (PP Degree)</span>
                  <span className="text-emerald-400 font-semibold">{ppDegree}x Stages (Inter-Node)</span>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 4, 8, 16].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPpDegree(val as PpDegree)}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        ppDegree === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-white/10 bg-black/30 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      PP={val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Parallelism (DP) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Data Parallelism (DP Degree)</span>
                  <span className="text-emerald-400 font-semibold">{dpDegree}x Replicas</span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {[1, 2, 4, 8, 16, 32].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDpDegree(val as DpDegree)}
                      className={`py-1.5 rounded-lg border text-[11px] font-mono transition-all ${
                        dpDegree === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-white/10 bg-black/30 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      DP={val}
                    </button>
                  ))}
                </div>
              </div>

              {/* ZeRO Memory Partitioning */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">DeepSpeed ZeRO Memory Sharding</label>
                <select
                  value={zeroStage}
                  onChange={(e) => setZeroStage(e.target.value as ZeroStage)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="zero_3">ZeRO-3 (Partition Weights + Gradients + Optimizer States)</option>
                  <option value="zero_2">ZeRO-2 (Partition Gradients + Optimizer States)</option>
                  <option value="zero_1">ZeRO-1 (Partition Optimizer States Only)</option>
                  <option value="zero_off">ZeRO Disabled (Full Replicated Weights)</option>
                </select>
              </div>

              {/* Pipeline Schedule */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Pipeline Execution Schedule</label>
                <select
                  value={pipelineSchedule}
                  onChange={(e) => setPipelineSchedule(e.target.value as PipelineSchedule)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="zero_bubble">Zero-Bubble Interleaved 1F1B (Elesium Virtual Stages)</option>
                  <option value="interleaved_1f1b">Megatron Interleaved 1F1B (2x Virtual Stages)</option>
                  <option value="standard_1f1b">Standard 1F1B (PipeDream Sequential)</option>
                  <option value="gpipe">GPipe (Synchronous All-Stage Flush)</option>
                </select>
              </div>

              {/* Interconnect Fabric */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Interconnect Fabric</label>
                <select
                  value={interconnect}
                  onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="nvlink_ndr_infiniband">NVLink 4 (900GB/s) + Quantum-2 NDR InfiniBand (400Gbps)</option>
                  <option value="dual_rail_infiniband">Dual-Rail HDR InfiniBand (2x 200Gbps)</option>
                  <option value="nvlink_roce_v2">NVLink + RoCEv2 Converged Ethernet (200Gbps)</option>
                  <option value="pcie_gen5">PCIe Gen5 Bus Only (128GB/s)</option>
                </select>
              </div>

              {/* Sequence Length & Batch Size */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Context Window</label>
                  <select
                    value={sequenceLengthTokens}
                    onChange={(e) => setSequenceLengthTokens(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={8192}>8K Tokens</option>
                    <option value={16384}>16K Tokens</option>
                    <option value={32768}>32K Tokens</option>
                    <option value={65536}>64K Tokens</option>
                    <option value={131072}>128K Tokens</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Batch Size</label>
                  <select
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={4}>4 Concurrent</option>
                    <option value={8}>8 Concurrent</option>
                    <option value={16}>16 Concurrent</option>
                    <option value={32}>32 Concurrent</option>
                    <option value={64}>64 Concurrent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Analytical Outputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* SLA Status Banner */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
              results.slaStatus === 'SUB_8MS_3D_OPTIMAL'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : results.slaStatus === 'EFFICIENT_SCALED_MESH'
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                : results.slaStatus === 'PIPELINE_BUBBLE_BOTTLENECK'
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 shrink-0" />
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider font-semibold">
                    {results.slaStatus.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-gray-300">
                    {results.slaStatus === 'SUB_8MS_3D_OPTIMAL' && 'Zero-bubble communication overlap active. Sub-8ms step latency achieved.'}
                    {results.slaStatus === 'EFFICIENT_SCALED_MESH' && 'Scaled 3D mesh active. Linear efficiency exceeds 92%.'}
                    {results.slaStatus === 'PIPELINE_BUBBLE_BOTTLENECK' && 'High pipeline bubble idle time. Enable interleaved virtual stages to optimize.'}
                    {results.slaStatus === 'OOM_ALLOCATION_FAULT' && 'VRAM exceeds 80GB SXM5 capacity. Increase TP degree or enable ZeRO-3.'}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xl font-bold">{results.effectiveStepLatencyMs} ms</div>
                <div className="text-[10px] text-gray-400">Step Latency</div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Cluster Size</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.totalGpus} GPUs</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">{results.totalGpus / 8} HGX Nodes</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Model FLOPs (MFU)</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{results.modelFlopsUtilizationPercent}%</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Cluster Efficiency</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">VRAM Allocation</div>
                <div className={`text-2xl font-mono font-bold mt-1 ${results.oomRiskPrevented ? 'text-white' : 'text-rose-400'}`}>
                  {results.peakMemoryPerGpuGb} GB
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">of 80GB SXM5</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Bubble Idle Ratio</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.pipelineBubbleFractionPercent}%</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">Pipeline Waste</div>
              </div>
            </div>

            {/* Interactive 3D Cartesian Mesh Diagram */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-white">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Logical 3D Cartesian Decomposition Mesh</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  P = {tpDegree} (TP) x {ppDegree} (PP) x {dpDegree} (DP) = {results.totalGpus} GPUs
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">DIMENSION 1: TENSOR PARALLELISM (TP={tpDegree})</span>
                  <span className="text-emerald-400">Intra-Node NVLink (900 GB/s) · Column/Row GEMM All-Reduce</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">DIMENSION 2: PIPELINE PARALLELISM (PP={ppDegree})</span>
                  <span className="text-blue-400">Inter-Node InfiniBand (400 Gbps) · Interleaved 1F1B P2P Streaming</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">DIMENSION 3: DATA PARALLELISM + ZeRO-3 (DP={dpDegree})</span>
                  <span className="text-purple-400">Ring All-Gather & Reduce-Scatter · 1/{dpDegree} Parameter Sharding</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Throughput:</span>
                  <span className="text-white font-semibold">{results.tokensPerSecondThroughput.toLocaleString()} tokens/sec</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">FinOps Savings:</span>
                  <span className="text-emerald-400 font-semibold">{results.annualFinOpsSavings}</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy 3D Distributed Mesh for Your Enterprise</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated Slurm job script and Megatron-DeepSpeed topology config.</p>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={copyMemo}
                  className="px-4 py-2.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Memo'}
                </button>
                <button
                  onClick={() => openWhatsApp()}
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all whitespace-nowrap flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Form Section */}
        <div className="mt-16 pt-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto mb-8 p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Direct Lead Architect Intake</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
              Ready to Validate Distributed Mesh Benchmarks in Production?
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              Connect directly with our Principal Systems Architect on WhatsApp for a confidential 30-minute scoping review and custom Slurm topology memo.
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

          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#0d0d12] overflow-hidden shadow-2xl">
            <MandateApplicationForm source="Tool #65: 3D Parallelism Simulator" />
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
          <div className="relative w-full max-w-lg p-6 rounded-2xl bg-[#0e0e14] border border-white/10 shadow-2xl space-y-4 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Embed 3D Parallelism Simulator</span>
              </div>
              <button onClick={() => setIsEmbedOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Copy and paste this clean iframe code into your internal engineering wiki, Confluence, or technical documentation.
            </p>
            <div className="p-3 rounded-xl bg-black/60 border border-white/5 font-mono text-xs text-gray-300 break-all">
              {embedCode}
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-mono font-semibold flex items-center gap-2"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise 3D Parallelism Simulator"
        simulatedMetrics={[
          { label: 'Cluster MFU', value: `${results.modelFlopsUtilizationPercent}%` },
          { label: 'Step Latency', value: `${results.effectiveStepLatencyMs} ms` },
          { label: 'FinOps Savings', value: results.annualFinOpsSavings },
          { label: 'Cluster Scale', value: `${results.totalGpus} GPUs` }
        ]}
      />
      <WhatsAppModal />
    </div>
  );
}
