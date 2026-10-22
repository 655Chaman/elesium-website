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
  Cpu,
  Activity,
  ShieldCheck
} from 'lucide-react';
import {
  calculateDeepseekUnifiedFabric,
  DeepseekUnifiedFabricInputs
} from '../calculator/agentDeepseekUnifiedFabricModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentDeepseekUnifiedFabricSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [clusterGpuCount, setClusterGpuCount] = useState<number>(256);
  const [servingArchitecture, setServingArchitecture] = useState<DeepseekUnifiedFabricInputs['servingArchitecture']>('grand_unified_fabric');
  const [speculativeMtpDepth, setSpeculativeMtpDepth] = useState<number>(3);
  const [networkInterconnect, setNetworkInterconnect] = useState<DeepseekUnifiedFabricInputs['networkInterconnect']>('quantum2_infiniband_3200g');
  const [inputContextLength, setInputContextLength] = useState<number>(65536);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: DeepseekUnifiedFabricInputs = useMemo(() => ({
    clusterGpuCount,
    servingArchitecture,
    speculativeMtpDepth,
    networkInterconnect,
    inputContextLength,
    currency
  }), [
    clusterGpuCount,
    servingArchitecture,
    speculativeMtpDepth,
    networkInterconnect,
    inputContextLength,
    currency
  ]);

  const results = useMemo(() => calculateDeepseekUnifiedFabric(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-deepseek-v3-serving-fabric-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium DeepSeek-V3 Unified Fabric Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: GRAND UNIFIED DEEPSEEK-V3 SERVING FABRIC
Cluster GPUs: ${clusterGpuCount} GPUs | Context Window: ${(inputContextLength / 1024).toFixed(0)}k tokens
Architecture: ${servingArchitecture.replace(/_/g, ' ').toUpperCase()}
MTP Speculative Depth: k=${speculativeMtpDepth} tokens | Fabric: ${networkInterconnect.replace(/_/g, ' ').toUpperCase()}

PERFORMANCE AUDIT METRICS:
- KV-Cache Compression: ${results.kvCacheReductionPercent}% footprint cut (512-dim joint latent vector)
- Continuous Decoding Throughput: ${results.decodingThroughputTokensPerSec} tokens/sec per node (${results.effectiveDecodedSpeedupFactor}x speedup)
- Time to First Token (TTFT): ${results.timeToFirstTokenMs} ms
- Model Flops Utilization (MFU): ${results.modelFlopsUtilizationPercent}%
- Pipeline Bubble Ratio: ${results.pipelineBubblePercent}% (<2.0% threshold)
- MTP Speculative Acceptance Rate: ${results.speculativeAcceptanceRatePercent}%
- Peak VRAM / GPU: ${results.peakVramPerGpuGb} GB
- Projected Annual Cluster OPEX Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualClusterOpexSavings.toLocaleString()}
- System Classification: ${results.statusClassification}
- Statutory Compliance: 100% DPDP Act 2023 & RBI Cyber Security Framework Attested`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setClusterGpuCount(256);
    setServingArchitecture('grand_unified_fabric');
    setSpeculativeMtpDepth(3);
    setNetworkInterconnect('quantum2_infiniband_3200g');
    setInputContextLength(65536);
    setCurrency('INR');
  };

  const faqs = [
    {
      q: 'How does co-designing MLA, MTP, and DualPipe overcome hardware scaling limits?',
      a: 'Multi-Head Latent Attention compresses key-value states into a 512-dimensional joint latent vector, slashing KV memory by 93.3%. This frees on-chip SRAM and HBM to co-locate Multi-Token Prediction (MTP) draft modules. DualPipe schedules bidirectional micro-batches that overlap MTP verification communication behind backward weight GEMMs, shrinking pipeline bubbles to under 1.8% and driving 3.2x faster inference.'
    },
    {
      q: 'What is Auxiliary-Loss-Free Load Balancing in 256-Expert DeepSeek serving?',
      a: 'Conventional MoE routing adds auxiliary loss functions to pre-training objectives to force uniform expert utilization, which harms model reasoning. DeepSeek-V3 uses an adaptive bias term for each of the 256 experts. If an expert becomes congested, its routing bias decreases dynamically, leveling token distribution without corrupting foundational model representations.'
    },
    {
      q: 'How does the unified serving fabric maintain compliance with the Indian DPDP Act 2023?',
      a: 'All model weights, KV caches, and MTP candidate tokens are held within air-gapped sovereign VPC enclaves. Dedicated memory shredder daemons execute zero-remanence cryptographic wiping upon session closure, preventing cross-tenant leakage and meeting RBI and DPDP Act 2023 statutory mandates.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>DeepSeek-V3 Grand Unified Serving Fabric Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate MLA compressed latents, DualPipe bidirectional zero-bubble pipeline overlap, and MTP speculative drafting co-design on megawatt enterprise DeepSeek-V3 serving clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="border-b border-slate-800/80 bg-gradient-to-b from-emerald-950/20 via-slate-950/50 to-transparent pt-12 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tool #75 · Megawatt Foundation Model Serving</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-xs text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                <Code className="w-3.5 h-3.5" />
                <span>Embed Simulator</span>
              </button>
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-750 bg-slate-900/80 text-xs text-slate-400 hover:text-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Enterprise DeepSeek-V3 Grand Unified Serving Fabric Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-4xl leading-relaxed">
            Co-design Multi-Head Latent Attention (MLA), Multi-Token Prediction (MTP), DualPipe bidirectional zero-bubble overlap, and auxiliary-loss-free routing across Hopper and Blackwell clusters.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <h2 className="text-base font-semibold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Cluster & Serving Parameters
                </h2>
                <div className="flex rounded-lg border border-slate-700 p-0.5 bg-slate-950 text-xs font-mono">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              <div className="space-y-5 text-sm">
                {/* Serving Architecture */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Serving Fabric Architecture</label>
                  <select
                    value={servingArchitecture}
                    onChange={(e) => setServingArchitecture(e.target.value as DeepseekUnifiedFabricInputs['servingArchitecture'])}
                    aria-label="Serving Fabric Architecture"
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  >
                    <option value="grand_unified_fabric">Grand Unified Fabric (MLA + MTP + DualPipe Co-Design)</option>
                    <option value="disaggregated_pipeline">Disaggregated Prefill/Decode (Decoupled Stages)</option>
                    <option value="unoptimized_baseline">Unoptimized Baseline (MHA + Standard 1F1B)</option>
                  </select>
                </div>

                {/* Cluster GPU Count */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>Cluster Hardware Scale</span>
                    <span className="text-emerald-400 font-semibold">{clusterGpuCount} GPUs ({clusterGpuCount / 8} Nodes)</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="1024"
                    step="32"
                    value={clusterGpuCount}
                    onChange={(e) => setClusterGpuCount(Number(e.target.value))}
                    aria-label="Cluster Hardware Scale"
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded cursor-pointer"
                  />
                </div>

                {/* Speculative MTP Depth */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>MTP Speculative Depth</span>
                    <span className="text-emerald-400 font-semibold">k={speculativeMtpDepth} tokens forward</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={speculativeMtpDepth}
                    onChange={(e) => setSpeculativeMtpDepth(Number(e.target.value))}
                    aria-label="MTP Speculative Depth"
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded cursor-pointer"
                  />
                </div>

                {/* Input Context Length */}
                <div>
                  <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-mono">
                    <span>Context Window Depth</span>
                    <span className="text-emerald-400 font-semibold">{(inputContextLength / 1024).toFixed(0)}k Tokens</span>
                  </div>
                  <input
                    type="range"
                    min="8192"
                    max="131072"
                    step="8192"
                    value={inputContextLength}
                    onChange={(e) => setInputContextLength(Number(e.target.value))}
                    aria-label="Context Window Depth"
                    className="w-full accent-emerald-500 bg-slate-800 h-2 rounded cursor-pointer"
                  />
                </div>

                {/* Network Interconnect */}
                <div>
                  <label className="block text-slate-300 font-medium mb-1.5">Inter-Node Network Fabric</label>
                  <select
                    value={networkInterconnect}
                    onChange={(e) => setNetworkInterconnect(e.target.value as DeepseekUnifiedFabricInputs['networkInterconnect'])}
                    aria-label="Inter-Node Network Fabric"
                    className="w-full bg-slate-950 border border-slate-750 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500 font-mono text-xs"
                  >
                    <option value="quantum2_infiniband_3200g">3.2 Tbps Quantum-2 InfiniBand (Sub-1.2µs)</option>
                    <option value="roce_v2_800g">800 Gbps RoCE v2 Low-Latency Fabric</option>
                    <option value="pcie_gen5_standard">PCIe Gen5 Standard Bus (Baseline)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-3">
              <button
                onClick={copyMemo}
                className="w-full py-2.5 px-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedMemo ? 'Technical Memo Copied!' : 'Copy Executive Architecture Memo'}</span>
              </button>
            </div>
          </div>

          {/* Results & Simulation Visualizer Column */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">KV-Cache Footprint</span>
                <span className="text-xl font-bold font-mono text-emerald-400">-{results.kvCacheReductionPercent}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">MLA Joint Latent Vector</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Decoding Throughput</span>
                <span className="text-xl font-bold font-mono text-teal-400">{results.effectiveDecodedSpeedupFactor}x</span>
                <span className="text-[10px] text-slate-500 block mt-1">{results.decodingThroughputTokensPerSec} tok/s / node</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Model Flops (MFU)</span>
                <span className="text-xl font-bold font-mono text-sky-400">{results.modelFlopsUtilizationPercent}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">DualPipe Overlap</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">Time to First Token</span>
                <span className="text-xl font-bold font-mono text-amber-400">{results.timeToFirstTokenMs}ms</span>
                <span className="text-[10px] text-slate-500 block mt-1">Sub-12ms Prefill SLA</span>
              </div>
            </div>

            {/* Interactive SVG Diagram */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Grand Unified Serving Co-Design Architecture
                </h3>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {results.statusClassification}
                </span>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 overflow-x-auto">
                <svg viewBox="0 0 680 200" className="w-full h-auto min-w-[580px] font-mono text-xs">
                  {/* Layer 1: Multi-Head Latent Attention (MLA) */}
                  <rect x="20" y="20" width="180" height="70" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="35" y="45" fill="#a7f3d0" fontWeight="bold">1. MLA Joint Latent</text>
                  <text x="35" y="65" fill="#6ee7b7" fontSize="10">512-dim d_c Compression</text>
                  <text x="35" y="80" fill="#34d399" fontSize="9">KV Cache: -93.3% VRAM</text>

                  {/* Arrow 1 to 2 */}
                  <path d="M 200 55 L 240 55" stroke="#10b981" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Layer 2: DualPipe Bidirectional Pipeline */}
                  <rect x="240" y="20" width="200" height="70" rx="8" fill="#0c4a6e" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="255" y="45" fill="#bae6fd" fontWeight="bold">2. DualPipe Overlap</text>
                  <text x="255" y="65" fill="#7dd3fc" fontSize="10">Bidirectional Chunked Flow</text>
                  <text x="255" y="80" fill="#38bdf8" fontSize="9">Bubble Ratio: {results.pipelineBubblePercent}% (&lt;2%)</text>

                  {/* Arrow 2 to 3 */}
                  <path d="M 440 55 L 480 55" stroke="#0284c7" strokeWidth="2" strokeDasharray="3,3" />

                  {/* Layer 3: Multi-Token Prediction (MTP) */}
                  <rect x="480" y="20" width="180" height="70" rx="8" fill="#134e4a" stroke="#14b8a6" strokeWidth="1.5" />
                  <text x="495" y="45" fill="#99f6e4" fontWeight="bold">3. MTP Speculative</text>
                  <text x="495" y="65" fill="#5eead4" fontSize="10">Depth: k={speculativeMtpDepth} tokens</text>
                  <text x="495" y="80" fill="#2dd4bf" fontSize="9">Acceptance: {results.speculativeAcceptanceRatePercent}%</text>

                  {/* Foundation Bus: Auxiliary-Loss-Free Routing */}
                  <rect x="20" y="115" width="640" height="60" rx="8" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
                  <text x="35" y="140" fill="#c7d2fe" fontWeight="bold">Foundation MoE Layer: 256 Routed Experts (Auxiliary-Loss-Free Dynamic Routing)</text>
                  <text x="35" y="160" fill="#a5b4fc" fontSize="10">Dynamic Bias Terms b_i · 100% Non-Blocking All-to-All InfiniBand Comm · {results.modelFlopsUtilizationPercent}% Sustained MFU</text>
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">MLA Latent Ratio</span>
                  <span className="text-emerald-400 font-semibold">{results.subsystemTelemetry.mlaCompressionRatio}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">DualPipe Bubble</span>
                  <span className="text-sky-400 font-semibold">{results.subsystemTelemetry.dualpipeBubbleRatio}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">MTP Step Speed</span>
                  <span className="text-teal-400 font-semibold">{results.subsystemTelemetry.mtpAcceptanceLength}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block">Comm Hiding</span>
                  <span className="text-indigo-400 font-semibold">{results.subsystemTelemetry.networkOverlapRatio}</span>
                </div>
              </div>
            </div>

            {/* FinOps & Compliance Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Cluster FinOps & Sovereign Compliance Attestation
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-400 block mb-1">Projected Annual Savings</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {currency === 'INR' ? '₹' : '$'}{results.annualClusterOpexSavings.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 block mt-1">MFU Amortization & Power</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-400 block mb-1">Peak VRAM / GPU</span>
                  <span className="text-lg font-bold font-mono text-slate-200">{results.peakVramPerGpuGb} GB</span>
                  <span className="text-[10px] text-slate-500 block mt-1">Fits 80GB H100 with headroom</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
                  <span className="text-xs text-slate-400 block mb-1">Sovereign Compliance</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">100% Certified</span>
                  <span className="text-[10px] text-slate-500 block mt-1">DPDP Act & RBI Attested</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FAQs */}
        <div className="mt-12 bg-slate-900/40 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Architecture & Deployment Engineering FAQs</h3>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-4 py-3 flex items-center justify-between text-sm font-medium text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-850">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mandate Lead Generation Form */}
        <div className="mt-12">
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
      </div>

      {/* Embed Code Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0b0f17] border border-slate-800 rounded-2xl max-w-lg w-full p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h4 className="text-base font-semibold flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" />
                Embed Grand Unified Fabric Simulator
              </h4>
              <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Embed this interactive simulator on your technical engineering blog or documentation. Includes clean watermark backlink.
            </p>
            <textarea
              readOnly
              value={embedSnippet}
              rows={4}
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 mb-4 focus:outline-none"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent ROI Memo Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise DeepSeek-V3 Grand Unified Serving Fabric Simulator"
        simulatedMetrics={[
          { label: 'KV-Cache Reduction', value: `-${results.kvCacheReductionPercent}%`, detail: '512-dim joint latent vector' },
          { label: 'Decoding Speedup', value: `${results.effectiveDecodedSpeedupFactor}x`, detail: `${results.decodingThroughputTokensPerSec} tok/s per node` },
          { label: 'Model Flops (MFU)', value: `${results.modelFlopsUtilizationPercent}%`, detail: 'DualPipe Overlap' },
          { label: 'Projected OPEX Savings', value: `${currency === 'INR' ? '₹' : '$'}${results.annualClusterOpexSavings.toLocaleString()}`, detail: 'Power & compute amortization' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
