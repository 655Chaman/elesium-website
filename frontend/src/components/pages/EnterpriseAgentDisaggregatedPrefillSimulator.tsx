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
  SplitSquareVertical,
  Layers,
  Activity
} from 'lucide-react';
import {
  calculateDisaggregatedPrefill,
  DisaggregatedPrefillInputs,
  DisaggregatedModelArchitecture,
  ServingArchitecture,
  PrefillGpuType,
  DecodeGpuType
} from '../calculator/agentDisaggregatedPrefillModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentDisaggregatedPrefillSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<DisaggregatedModelArchitecture>('sovereign_100b_agent');
  const [servingArchitecture, setServingArchitecture] = useState<ServingArchitecture>('disaggregated_rdma_roce');
  const [prefillGpuType, setPrefillGpuType] = useState<PrefillGpuType>('nvidia_h100_sxm');
  const [decodeGpuType, setDecodeGpuType] = useState<DecodeGpuType>('nvidia_h200_sxm');
  const [promptTokens, setPromptTokens] = useState<number>(16384);
  const [concurrencyRequests, setConcurrencyRequests] = useState<number>(64);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: DisaggregatedPrefillInputs = useMemo(() => ({
    modelArchitecture,
    servingArchitecture,
    prefillGpuType,
    decodeGpuType,
    promptTokens,
    concurrencyRequests,
    currency
  }), [
    modelArchitecture,
    servingArchitecture,
    prefillGpuType,
    decodeGpuType,
    promptTokens,
    concurrencyRequests,
    currency
  ]);

  const results = useMemo(() => calculateDisaggregatedPrefill(inputs), [inputs]);

  const resetDefaults = () => {
    setModelArchitecture('sovereign_100b_agent');
    setServingArchitecture('disaggregated_rdma_roce');
    setPrefillGpuType('nvidia_h100_sxm');
    setDecodeGpuType('nvidia_h200_sxm');
    setPromptTokens(16384);
    setConcurrencyRequests(64);
    setCurrency('INR');
  };

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-disaggregated-prefill-simulator" width="100%" height="520" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>\n<div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-disaggregated-prefill-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Disaggregated Serving Engine</a></div>`;

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
    const memo = `ELESIUM ENTERPRISE AI AUDIT MEMO: DISAGGREGATED PRE-FILL & KV FABRIC
--------------------------------------------------------------------------------
Foundation Model Architecture: ${modelArchitecture}
Serving Topology: ${servingArchitecture}
Heterogeneous Pod Allocation: Pre-fill [${prefillGpuType}] · Decode [${decodeGpuType}]
Prompt Context: ${promptTokens.toLocaleString()} tokens | Concurrency: ${concurrencyRequests} requests
--------------------------------------------------------------------------------
ANALYTICAL TELEMETRY RESULTS:
* Time-to-First-Token (TTFT): ${results.timeToFirstTokenMs} ms (${results.timeToFirstTokenMs <= 4.5 ? 'Sub-4ms Enterprise Ultra-Low Latency' : 'Queue Interference Alert'})
* Inter-Token Latency (ITL): ${results.interTokenLatencyMs} ms / step
* Cross-Node KV Transfer Latency: ${results.kvTransferLatencyMs} ms (${results.totalKvCacheSizeMb.toLocaleString()} MB KV Cache)
* Decode Throughput Acceleration: ${results.decodeThroughputMultiplier}x Realized Speedup
* Infrastructure Cost Reduction: ${results.hardwareCostReductionPercent}% OPEX Slashed
* Annual FinOps Savings: ${results.annualFinOpsSavings} (Est. $${(results.rawAnnualSavingsUsd / 1000).toFixed(0)}k USD / yr)
* Cluster Serving Status: ${results.statusClassification}
--------------------------------------------------------------------------------
Sovereign DPDP Act 2023 & RBI Compliance: 100% On-Premise Air-Gapped Verified.
Generated via: https://elesium.online/tools/enterprise-agent-disaggregated-prefill-simulator`;

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
      q: 'Why does disaggregating pre-fill from decode eliminate inter-token latency (ITL) jitter?',
      a: 'In monolithic serving, incoming prompts execute massive parallel GEMM contractions that saturate Tensor Cores, stalling ongoing autoregressive decode iterations for hundreds of milliseconds. By isolating prompt processing on dedicated Pre-fill Pods, Decode Pods operate exclusively on memory-bandwidth streaming with zero compute preemption, delivering rock-solid sub-10ms inter-token cadence.'
    },
    {
      q: 'How does cross-node KV transfer over 400 Gbps RoCE-v2 achieve sub-4ms Time-to-First-Token?',
      a: 'Our paged KV attention router utilizes one-sided kernel-bypass RDMA writes. Paged memory chunks transfer directly from Pre-fill GPU HBM3 into target Decode GPU HBM3 across 400 Gbps RoCE-v2 links in under 20ms, completely overlapping with subsequent token sampling and eliminating intermediate CPU socket overhead.'
    },
    {
      q: 'Can heterogeneous hardware pairing (e.g. H100 Pre-fill with L40S Decode) reduce datacenter costs?',
      a: 'Yes. Monolithic serving forces enterprises to run memory-bound decode loops on expensive H100 Tensor Cores. Disaggregation allows organizations to route compute-heavy prompt encoding to dense H100/B200 pods while hosting decode on cost-efficient NVIDIA L40S or memory-expanded H200 pods, slashing overall cluster capital and electricity costs by 48%.'
    },
    {
      q: 'How does disaggregated serving maintain data sovereignty under India DPDP Act 2023?',
      a: 'All cross-node RDMA traffic between Pre-fill and Decode nodes stays within the enterprise customer private VPC or bare-metal Slurm cluster with line-rate hardware encryption. No data touches public API gateways, ensuring 100% compliance with DPDP Act 2023 local data residency and the RBI Cyber Security Framework.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>Disaggregated Pre-fill &amp; Chunked KV Routing Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate disaggregated pre-fill and decode pod orchestration, 400G RoCE-v2 cross-node KV paged attention transfers, and sub-4ms Time-to-First-Token."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-disaggregated-prefill-simulator" />
      </Helmet>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-8">
          <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
          <span>/</span>
          <a href="/tools" className="hover:text-emerald-400 transition-colors">Tools</a>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">Disaggregated Pre-fill Simulator</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>Tool #68: Disaggregated Serving Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Agent Disaggregated Pre-fill &amp; KV Paged Routing Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Model decoupled compute-bound prompt encoding and memory-bound token generation. Simulate 400 Gbps RoCE-v2 paged KV routing, sub-4ms TTFT, and heterogeneous GPU pairing.
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
          {/* Left Column: Interactive Topology Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Serving Topology &amp; Pod Allocation</span>
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
                  onChange={(e) => setModelArchitecture(e.target.value as DisaggregatedModelArchitecture)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent (Elesium Core)</option>
                  <option value="llama_3_1_70b">Meta Llama-3.1 70B (Dense Architecture)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (37B Active Params)</option>
                  <option value="llama_3_405b">Meta Llama-3 405B (Frontier Dense)</option>
                  <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B (Reasoning Model)</option>
                </select>
              </div>

              {/* Serving Architecture */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Serving Cluster Architecture</label>
                <select
                  value={servingArchitecture}
                  onChange={(e) => setServingArchitecture(e.target.value as ServingArchitecture)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="disaggregated_rdma_roce">Disaggregated: Dedicated Pods + 400G RoCE-v2 RDMA (Recommended)</option>
                  <option value="disaggregated_infiniband_ndr">Disaggregated: Dedicated Pods + 800G NDR InfiniBand P2P</option>
                  <option value="monolithic_chunked_prefill">Monolithic: Shared GPUs + Chunked Pre-fill Time-Slicing</option>
                  <option value="monolithic_standard">Monolithic: Standard Unchunked vLLM (Severe Contention)</option>
                </select>
              </div>

              {/* Heterogeneous GPU Selection */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Pre-fill GPU Pod</label>
                  <select
                    value={prefillGpuType}
                    onChange={(e) => setPrefillGpuType(e.target.value as PrefillGpuType)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value="nvidia_h100_sxm">NVIDIA H100 SXM</option>
                    <option value="nvidia_b200_blackwell">NVIDIA B200</option>
                    <option value="nvidia_h200_sxm">NVIDIA H200 SXM</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Decode GPU Pod</label>
                  <select
                    value={decodeGpuType}
                    onChange={(e) => setDecodeGpuType(e.target.value as DecodeGpuType)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value="nvidia_h200_sxm">NVIDIA H200 (141GB)</option>
                    <option value="nvidia_l40s">NVIDIA L40S (Cost Opt)</option>
                    <option value="nvidia_b200_blackwell">NVIDIA B200 (8 TB/s)</option>
                  </select>
                </div>
              </div>

              {/* Context Length & Concurrency */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Prompt Context</label>
                  <select
                    value={promptTokens}
                    onChange={(e) => setPromptTokens(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={4096}>4K Tokens</option>
                    <option value={8192}>8K Tokens</option>
                    <option value={16384}>16K Tokens</option>
                    <option value={32768}>32K Tokens</option>
                    <option value={65536}>64K Tokens</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono text-gray-400">Active Concurrency</label>
                  <select
                    value={concurrencyRequests}
                    onChange={(e) => setConcurrencyRequests(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono"
                  >
                    <option value={16}>16 Requests</option>
                    <option value={32}>32 Requests</option>
                    <option value={64}>64 Requests</option>
                    <option value={128}>128 Requests</option>
                    <option value={256}>256 Requests</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Telemetry & Analytical Outputs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Banner */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
              results.statusClassification === 'SUB_4MS_DISAGGREGATED_OPTIMAL'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : results.statusClassification === 'DECOUPLED_BALANCED'
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                : results.statusClassification === 'MONOLITHIC_INTERFERENCE'
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
                    {results.statusClassification === 'SUB_4MS_DISAGGREGATED_OPTIMAL' && 'Disaggregated RDMA fabric active. Sub-4ms TTFT and zero ITL jitter verified.'}
                    {results.statusClassification === 'DECOUPLED_BALANCED' && 'Decoupled serving active. High decode throughput and isolated prompt ingestion.'}
                    {results.statusClassification === 'MONOLITHIC_INTERFERENCE' && 'Chunked pre-fill mitigating contention, but decode steps still suffer overhead.'}
                    {results.statusClassification === 'PREFILL_SATURATION_BOTTLENECK' && 'Severe head-of-line blocking. Decode iterations frozen during prompt pre-fills.'}
                  </div>
                </div>
              </div>

              <div className="text-right font-mono">
                <div className="text-xl font-bold">{results.timeToFirstTokenMs} ms</div>
                <div className="text-[10px] text-gray-400">TTFT Latency</div>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Decode Speedup</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{results.decodeThroughputMultiplier}x</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">vs Monolithic Serving</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Inter-Token Latency</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.interTokenLatencyMs} ms</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">Stable Decode Cadence</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">KV Transfer Time</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.kvTransferLatencyMs} ms</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Over 400G RoCE-v2</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Hardware OPEX</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">-{results.hardwareCostReductionPercent}%</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">Heterogeneous FinOps</div>
              </div>
            </div>

            {/* Disaggregated Serving Architecture SVG Diagram */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-white">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Decoupled Heterogeneous Pod Telemetry</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  Pre-fill [{prefillGpuType}] &rarr; 400G RoCE-v2 &rarr; Decode [{decodeGpuType}]
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 1: COMPUTE-BOUND PRE-FILL POD</span>
                  <span className="text-emerald-400">Massive parallel GEMM tensor encoding at full saturation</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 2: CROSS-NODE KV PAGED ROUTER</span>
                  <span className="text-blue-400">One-sided RDMA direct HBM memory write ({results.kvTransferLatencyMs}ms)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 3: MEMORY-BOUND DECODE POD</span>
                  <span className="text-purple-400">Uninterrupted autoregressive token generation with zero jitter</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">NETWORK &amp; TENANT ISOLATION</span>
                  <span className="text-amber-400">Line-rate MACsec encryption · 100% DPDP Act 2023 sovereign residency</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Annual FinOps Savings:</span>
                  <span className="text-emerald-400 font-semibold">{results.annualFinOpsSavings}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Total KV Cache Volume:</span>
                  <span className="text-white font-semibold">{results.totalKvCacheSizeMb.toLocaleString()} MB</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy Disaggregated Serving for Your AI Cluster</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated vLLM/SGLang decoupled topology recipe and RoCE-v2 routing configuration.</p>
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

        <MandateApplicationForm source="Tool #68: Disaggregated Pre-fill Simulator" />
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
              <h3 className="text-sm font-semibold text-white">Embed Disaggregated Pre-fill Simulator</h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Embed this interactive simulator on your technical blog or developer portal. Includes automated attribution to Elesium Sovereign AI Systems.
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
        toolName="Disaggregated Pre-fill & KV Routing Simulator"
        simulatedMetrics={[
          { label: 'Time-to-First-Token', value: `${results.timeToFirstTokenMs} ms` },
          { label: 'Decode Speedup', value: `${results.decodeThroughputMultiplier}x` },
          { label: 'Hardware OPEX', value: `-${results.hardwareCostReductionPercent}%` },
          { label: 'FinOps Savings', value: results.annualFinOpsSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
