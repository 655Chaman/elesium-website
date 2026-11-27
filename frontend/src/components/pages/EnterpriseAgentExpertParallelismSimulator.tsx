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
  Sparkles,
  Network,
  ArrowRight
} from 'lucide-react';
import {
  calculateExpertParallelism,
  ExpertParallelismInputs,
  ModelArchitecture,
  EpDegree,
  InterconnectType,
  DispatchMode
} from '../calculator/agentExpertParallelismModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentExpertParallelismSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('deepseek_v2_236b');
  const [epDegree, setEpDegree] = useState<EpDegree>(8);
  const [totalExperts, setTotalExperts] = useState<number>(64);
  const [topK, setTopK] = useState<number>(2);
  const [batchSize, setBatchSize] = useState<number>(32);
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [dispatchMode, setDispatchMode] = useState<DispatchMode>('async_alltoall_overlap');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ExpertParallelismInputs = useMemo(() => ({
    modelArchitecture,
    epDegree,
    totalExperts,
    topK,
    batchSize,
    interconnect,
    dispatchMode,
    currency
  }), [
    modelArchitecture,
    epDegree,
    totalExperts,
    topK,
    batchSize,
    interconnect,
    dispatchMode,
    currency
  ]);

  const results = useMemo(() => calculateExpertParallelism(inputs), [inputs]);

  const handleReset = () => {
    setModelArchitecture('deepseek_v2_236b');
    setEpDegree(8);
    setTotalExperts(64);
    setTopK(2);
    setBatchSize(32);
    setInterconnect('nvlink_4_900gb');
    setDispatchMode('async_alltoall_overlap');
    setCurrency('INR');
  };

  const embedCode = `<iframe src="https://elesium.online/embed/agent-expert-parallelism-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe><div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-expert-parallelism-simulator" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Expert Parallelism Simulator</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `EXECUTIVE ARCHITECTURE BRIEF: EXPERT PARALLELISM & MOE DYNAMIC DISPATCH
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Expert Parallel Degree: ${epDegree} GPUs | Total Experts: ${totalExperts} | Top-k Gating: ${topK}
Interconnect: ${interconnect.toUpperCase().replace(/_/g, ' ')} | Dispatch Mode: ${dispatchMode.toUpperCase().replace(/_/g, ' ')}

PERFORMANCE & ALL-TO-ALL TELEMETRY METRICS:
- Experts Allocated Per GPU: ${results.expertsPerGpu} experts/rank
- Average Tokens Per Expert: ${results.tokensPerExpert} tokens/slot
- All-to-All Dispatch Latency: ${results.allToAllDispatchMs}ms
- Expert Sparse GEMM Compute: ${results.expertGemmComputeMs}ms
- Effective Forward Step Latency: ${results.effectiveStepLatencyMs}ms (P99)
- Communication Overlap Efficiency: ${results.commOverlapEfficiencyPercent}%
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
- Compliance SLA Status: ${results.slaStatus}

Architected via Elesium Enterprise Sovereign Infrastructure Engine.`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "What is Expert Parallelism (EP) and how does it partition sparse MoE layers?",
      a: "Expert Parallelism shards feed-forward expert networks across multiple GPUs while keeping attention layers replicated or sharded via tensor parallelism. In a 64-expert MoE layer deployed over 8 GPUs, each GPU hosts exactly 8 experts, allowing multi-hundred-billion parameter models to fit comfortably in distributed GPU VRAM."
    },
    {
      q: "How does asynchronous all-to-all dispatch and combine overlapping eliminate communication bottlenecks?",
      a: "Because tokens are dynamically routed to experts on remote GPUs, cross-device all-to-all collectives are required twice per MoE block (dispatch and combine). Asynchronous overlapping pipelines token dispatch chunks concurrently with self-attention projection GEMMs, hiding over 95% of collective communication latency behind tensor core execution."
    },
    {
      q: "How does capacity factor tuning prevent token dropping during unbalanced expert routing?",
      a: "When tokens heavily favor a subset of experts (hot-spotting), expert buffers can overflow, causing token dropping. A capacity factor (e.g., 1.25x or 1.5x) allocates extra buffer headroom per expert slot. Combined with auxiliary load-balancing loss terms, it ensures zero token dropping while maintaining optimal GPU core saturation."
    }
  ];

  return (
    <div className="min-h-[100dvh] bg-black text-neutral-100 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent Expert Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Expert Parallelism (EP), Mixture-of-Experts (MoE) dynamic token routing, all-to-all dispatch communication overlap, and sub-8ms sparse inference on enterprise GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-expert-parallelism-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/[0.04] text-white border border-white/15">
            <Sparkles className="w-3.5 h-3.5" />
            Tool #63 • Sparse Mixture-of-Experts Dynamic Dispatch Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
            Enterprise Autonomous Agent <span className="text-neutral-400 ">Expert Parallelism</span> & MoE Dispatch Simulator
          </h1>
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 leading-relaxed">
            Model top-k dynamic token routing, cross-GPU all-to-all dispatch and combine communication overlapping, and sub-8ms sparse MoE inference on sovereign GPU clusters.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400">Currency Mode:</span>
            <div className="inline-flex rounded-lg bg-neutral-800 p-0.5 border border-neutral-700">
              <button
                onClick={() => setCurrency('INR')}
                className={`active:scale-[0.97] px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-300 ${currency === 'INR' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`active:scale-[0.97] px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-300 ${currency === 'USD' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'}`}
              >
                USD ($)
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="active:scale-[0.97] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800/80 hover:bg-neutral-800 rounded-full border border-neutral-700/60 transition-all duration-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
            <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-lg bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="active:scale-[0.97] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:text-white bg-white/[0.05] hover:bg-white/10 rounded-full border border-white/15 transition-all duration-300"
            >
              <Code className="w-3.5 h-3.5" />
              Embed Widget
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="active:scale-[0.97] inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-black font-bold bg-white hover:bg-neutral-200 rounded-full transition-all duration-300"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-black" /> : <Copy className="w-3.5 h-3.5" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Brief'}
            </button>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-5 space-y-6 bg-neutral-900/60 p-6 rounded-[24px] border border-neutral-800/80">
            <div className="flex items-center gap-2 pb-4 border-b border-neutral-800 text-sm font-semibold text-white">
              <Sliders className="w-4 h-4 text-neutral-200" />
              MoE Routing & Expert Sharding Controls
            </div>

            {/* Model Architecture */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300">MoE Model Architecture</label>
              <select
                value={modelArchitecture}
                onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
              >
                <option value="deepseek_v2_236b">DeepSeek-V2-236B MoE (160 Routed Experts · Top-6)</option>
                <option value="deepseek_v3_671b">DeepSeek-V3-671B MoE (256 Routed Experts · Top-8)</option>
                <option value="mixtral_8x22b">Mixtral-8x22B (8 Routed Experts · Top-2)</option>
                <option value="qwen_2_5_moe">Qwen-2.5-MoE-14B (64 Routed Experts · Top-4)</option>
              </select>
            </div>

            {/* Expert Parallel Degree */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300">Expert Parallel (EP) Degree</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-1.5">
                {[2, 4, 8, 16, 32, 64].map((degree) => (
                  <button
                    key={degree}
                    type="button"
                    onClick={() => setEpDegree(degree as EpDegree)}
                    className={`active:scale-[0.97] py-2 text-xs font-bold rounded-full border transition-all duration-300 ${
                      epDegree === degree
                        ? 'bg-white/10 text-neutral-200 border-white/30'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    EP-{degree}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Experts Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">Total Routed Experts</span>
                <span className="font-mono text-white font-bold">{totalExperts} experts</span>
              </div>
              <input
                type="range"
                min={8}
                max={256}
                step={8}
                value={totalExperts}
                onChange={(e) => setTotalExperts(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded-xl"
              />
            </div>

            {/* Top-k Gating Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">Top-k Active Experts / Token</span>
                <span className="font-mono text-white font-bold">Top-{topK}</span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded-xl"
              />
            </div>

            {/* Batch Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-neutral-300">Concurrent Batch Size</span>
                <span className="font-mono text-white font-bold">{batchSize} sequences</span>
              </div>
              <input
                type="range"
                min={1}
                max={128}
                value={batchSize}
                onChange={(e) => setBatchSize(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded-xl"
              />
            </div>

            {/* Interconnect Fabric */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300">Interconnect Fabric</label>
              <select
                value={interconnect}
                onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
              >
                <option value="nvlink_4_900gb">NVLink 4.0 Mesh (900 GB/s Bidirectional)</option>
                <option value="nvlink_3_600gb">NVLink 3.0 Mesh (600 GB/s Bidirectional)</option>
                <option value="infiniband_ndr_400gb">InfiniBand NDR / RoCE v2 (400 GB/s RDMA)</option>
                <option value="pcie_gen5_128gb">PCIe Gen5 Bus (128 GB/s Duplex)</option>
              </select>
            </div>

            {/* Dispatch Mode */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-neutral-300">All-to-All Dispatch Strategy</label>
              <select
                value={dispatchMode}
                onChange={(e) => setDispatchMode(e.target.value as DispatchMode)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-xs text-white focus:border-white/40 focus:outline-none"
              >
                <option value="async_alltoall_overlap">Asynchronous All-to-All Overlap (Optimal)</option>
                <option value="two_stage_packed">Two-Stage Packed Dispatch (Conservative)</option>
                <option value="blocking_alltoall">Synchronous All-to-All Barrier (Sequential)</option>
              </select>
            </div>
          </div>

          {/* Results & Visuals Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Experts / GPU</span>
                <span className="text-xl font-extrabold text-neutral-200 font-mono">
                  {results.expertsPerGpu}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">experts / rank</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Step Latency</span>
                <span className="text-xl font-extrabold text-white font-mono">
                  {results.effectiveStepLatencyMs}ms
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">P99 forward step</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Overlap Efficiency</span>
                <span className="text-xl font-extrabold text-neutral-200 font-mono">
                  {results.commOverlapEfficiencyPercent}%
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">GEMM-overlap</span>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
                <span className="text-[11px] text-neutral-400 block mb-1">Avg Tokens / Expert</span>
                <span className="text-xl font-extrabold text-neutral-200 font-mono">
                  {results.tokensPerExpert}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">tokens / slot</span>
              </div>
            </div>

            {/* SLA Status Banner */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between ${
              results.slaStatus === 'SUB_8MS_MOE_OPTIMAL'
                ? 'bg-white/[0.04] text-neutral-200 border-white/20'
                : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-red-500/10 text-red-400 border-red-500/30'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold block tracking-wider uppercase">
                    {results.slaStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[11px] text-neutral-400 block">
                    {results.slaStatus === 'SUB_8MS_MOE_OPTIMAL'
                      ? 'Sub-8ms forward latency verified with 95%+ all-to-all communication overlap.'
                      : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
                      ? 'Operable expert routing; minor all-to-all serialization overhead observed.'
                      : 'Severe collective communication bottleneck. All-to-all dispatch dominates step latency.'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-neutral-950/80 border border-neutral-800 text-white">
                Top-{topK} Gating
              </span>
            </div>

            {/* Visual All-to-All Dispatch Topology */}
            <div className="p-6 rounded-[24px] bg-neutral-900/60 border border-neutral-800/80 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-white">
                  <Network className="w-4 h-4 text-neutral-200" />
                  All-to-All Dynamic Dispatch & Combine Topology
                </div>
                <span className="text-[11px] font-mono text-neutral-200">
                  {epDegree} Expert GPU Ranks
                </span>
              </div>

              {/* Topology Graphic */}
              <div className="p-4 bg-neutral-950 rounded-2xl border border-neutral-800/80 space-y-3">
                <div className="flex items-center justify-around flex-wrap gap-2 text-xs">
                  {Array.from({ length: Math.min(8, epDegree) }).map((_, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="px-3 py-2 rounded-xl bg-neutral-900 border border-white/30 text-center font-mono">
                        <div className="text-[10px] text-white font-bold">GPU {idx}</div>
                        <div className="text-[9px] text-neutral-400">{results.expertsPerGpu} Experts</div>
                      </div>
                      {idx < Math.min(8, epDegree) - 1 && (
                        <ArrowRight className="w-3.5 h-3.5 text-neutral-200 " />
                      )}
                    </div>
                  ))}
                  {epDegree > 8 && (
                    <div className="text-neutral-500 text-xs font-mono">... +{epDegree - 8} more</div>
                  )}
                </div>
                <div className="text-center text-[11px] text-neutral-400 pt-2 border-t border-neutral-900">
                  All-to-All Dispatch: <span className="text-neutral-200 font-mono">{results.allToAllDispatchMs}ms</span> comm overlapped with <span className="text-neutral-200 font-mono">{results.expertGemmComputeMs}ms</span> sparse expert GEMM.
                </div>
              </div>

              {/* FinOps Recovered Value Card */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-white/15">
                <div>
                  <span className="text-xs text-neutral-400 block">Recovered Annual MoE Cluster FinOps Capital</span>
                  <span className="text-2xl font-black text-neutral-200 font-mono">{results.annualFinOpsSavings}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Sovereign Compliance</span>
                  <span className="text-xs font-bold text-white">Indian DPDP Act 2023 · Private VPC</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white">Frequently Asked Architectural Questions</h2>
          <div className="space-y-2">
            {faqs.map((faq, idx) => (
              <div key={idx} className="rounded-[24px] bg-neutral-900/60 border border-neutral-800/80 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-white hover:text-white transition-all duration-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === idx ? 'rotate-180 text-neutral-200' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Form Section */}
        <div className="pt-8 border-t border-neutral-800">
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Schedule an Expert Parallelism Architecture Audit
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              Deploy sparse Mixture-of-Experts dynamic routing and expert parallelism on your sovereign GPU clusters.
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-[28px] p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-neutral-200" />
                Embed Expert Parallelism Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Copy and paste this HTML snippet into your technical documentation, internal wiki, or blog:
            </p>
            <div className="relative">
              <textarea
                readOnly
                rows={4}
                value={embedCode}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-base sm:text-xs font-mono text-neutral-200 focus:outline-none"
              />
              <button
                onClick={copyEmbedCode}
                className="active:scale-[0.97] absolute top-2 right-2 px-2.5 py-1 text-xs font-bold rounded bg-white text-black hover:bg-neutral-200 transition-all duration-300"
              >
                {hasCopiedEmbed ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Expert Parallelism & MoE Dispatch Simulator"
        simulatedMetrics={[
          { label: 'Step Latency', value: `${results.effectiveStepLatencyMs}ms`, detail: 'P99 forward step' },
          { label: 'Overlap Ratio', value: `${results.commOverlapEfficiencyPercent}%`, detail: 'All-to-all wire speed' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Sparse MoE clusters' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
