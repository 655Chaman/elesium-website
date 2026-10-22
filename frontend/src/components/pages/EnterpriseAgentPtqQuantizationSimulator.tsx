import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Layers,
  Coins,
  CheckCircle2,
  Gauge,
  Microchip,
  Sparkles
} from 'lucide-react';
import {
  calculatePtqQuantization,
  PtqQuantizationInputs,
  ModelArchitecture,
  QuantizationMethod,
  KvCachePrecision,
  TargetGpuHardware
} from '../calculator/agentPtqQuantizationModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentPtqQuantizationSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [quantizationMethod, setQuantizationMethod] = useState<QuantizationMethod>('awq_w4a16');
  const [kvCachePrecision, setKvCachePrecision] = useState<KvCachePrecision>('fp8_e4m3');
  const [contextLengthTokens, setContextLengthTokens] = useState<number>(8192);
  const [concurrentRequests, setConcurrentRequests] = useState<number>(8);
  const [targetGpuHardware, setTargetGpuHardware] = useState<TargetGpuHardware>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PtqQuantizationInputs = useMemo(() => ({
    modelArchitecture,
    quantizationMethod,
    kvCachePrecision,
    contextLengthTokens,
    concurrentRequests,
    targetGpuHardware,
    currency
  }), [
    modelArchitecture,
    quantizationMethod,
    kvCachePrecision,
    contextLengthTokens,
    concurrentRequests,
    targetGpuHardware,
    currency
  ]);

  const results = useMemo(() => calculatePtqQuantization(inputs), [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-ptq-quantization-perplexity-simulator" width="100%" height="780" frameborder="0" style="border-radius:12px;border:1px solid #e2e8f0;"></iframe>\n<div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyMemo = () => {
    const memo = `ELESIUM ENTERPRISE AI QUANTIZATION & FINOPS MEMO
Target Architecture: ${modelArchitecture.toUpperCase()}
Quantization Method: ${quantizationMethod.toUpperCase()} | KV Cache: ${kvCachePrecision.toUpperCase()}
Target Hardware: ${targetGpuHardware.toUpperCase()}
Unquantized VRAM: ${results.unquantizedVramGb} GB (Nodes: ${results.baselineGpuNodes})
Quantized VRAM: ${results.quantizedVramGb} GB (Nodes: ${results.requiredGpuNodes}) -> ${results.vramSavingsPercent}% Net VRAM Cut
Perplexity Degradation: ${results.perplexityDegradationPercent}% (WikiText-2: ${results.baselinePerplexity} -> ${results.quantizedPerplexity})
Generation Latency: ${results.perTokenLatencyMs} ms/token (${results.throughputTokensPerSec} tok/s)
Estimated Annual FinOps Savings: ${results.annualGpuCostSavings}
Compliance Status: ${results.slaStatus}
Architecture Audit Link: https://elesium.online/tools/enterprise-agent-ptq-quantization-perplexity-simulator`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent FP8 vs INT4 Quantization & Perplexity Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate enterprise LLM post-training quantization: AWQ 4-bit, SmoothQuant W8A8, Hopper FP8 tensor cores, VRAM downscaling, and perplexity degradation."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-ptq-quantization-perplexity-simulator" />
      </Helmet>

      <ExitIntentMemoModal
        toolName="LLM FP8 vs INT4 Quantization Simulator"
        simulatedMetrics={[
          { label: 'VRAM Reduction', value: `${results.vramSavingsPercent}%` },
          { label: 'Perplexity Drift', value: `+${results.perplexityDegradationPercent}%` },
          { label: 'Generation Latency', value: `${results.perTokenLatencyMs} ms` },
          { label: 'Annual FinOps Savings', value: results.annualGpuCostSavings }
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-sky-400 font-mono mb-3">
            <span>TOOLS</span>
            <span>/</span>
            <span className="text-slate-400">INFRASTRUCTURE & FINOPS</span>
            <span>/</span>
            <span className="text-amber-400 font-semibold">TOOL #50 (HALF-CENTURY MILESTONE)</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Microchip className="w-8 h-8 text-sky-400" />
                Enterprise LLM FP8 vs INT4 Quantization Simulator
              </h1>
              <p className="mt-2 text-base text-slate-400 max-w-3xl">
                Simulate post-training quantization across 70B+ sovereign LLMs: calculate AWQ salient-channel protection,
                SmoothQuant activation migration, Hopper FP8 E4M3 speedups, and exact WikiText-2 perplexity degradation.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition"
              >
                CURRENCY: <span className="text-sky-400 font-bold">{currency}</span>
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20 text-xs font-mono transition"
              >
                <Code className="w-3.5 h-3.5" />
                EMBED TOOL
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid: Controls (Left) vs Output Metrics (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase font-mono">
                Model & Quantization Configuration
              </h2>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">
                1. Target Foundation Architecture
              </label>
              <select
                value={modelArchitecture}
                onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="llama_3_70b">Meta Llama-3 70B (80 Layers, 8192 Hidden Dim)</option>
                <option value="deepseek_r1_671b">DeepSeek-R1 671B MoE (37B Active Params/tok)</option>
                <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B Sovereign Base</option>
                <option value="mistral_large_123b">Mistral Large 2 123B High-Reasoning</option>
              </select>
            </div>

            {/* Quantization Method */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">
                2. Weight Quantization Scheme
              </label>
              <select
                value={quantizationMethod}
                onChange={(e) => setQuantizationMethod(e.target.value as QuantizationMethod)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="awq_w4a16">AWQ W4A16 (Salient Outlier Protection, 4-bit)</option>
                <option value="fp8_e4m3_hopper">Native FP8 E4M3 (Hopper/Blackwell Tensor Cores)</option>
                <option value="smoothquant_w8a8">SmoothQuant W8A8 (Activation Outlier Migration)</option>
                <option value="gptq_w4a16">GPTQ W4A16 (Hessian Second-Order Compensation)</option>
                <option value="bitsandbytes_nf4">BitsAndBytes NF4 (Non-Linear Quantization)</option>
              </select>
            </div>

            {/* KV Cache Precision */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">
                3. Key-Value Cache Precision
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'fp16', label: 'FP16 (Vanilla)' },
                  { id: 'fp8_e4m3', label: 'FP8 E4M3 (-50%)' },
                  { id: 'int4_k_cache', label: 'INT4 Cache (-72%)' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setKvCachePrecision(item.id as KvCachePrecision)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-mono border transition text-center ${
                      kvCachePrecision === item.id
                        ? 'border-sky-500 bg-sky-500/15 text-sky-300 font-bold'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Hardware */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2 uppercase">
                4. GPU Hardware Cluster
              </label>
              <select
                value={targetGpuHardware}
                onChange={(e) => setTargetGpuHardware(e.target.value as TargetGpuHardware)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              >
                <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 (80GB HBM3, Native FP8)</option>
                <option value="nvidia_b200_nvl">NVIDIA B200 NVL (192GB HBM3e, 2nd Gen FP8)</option>
                <option value="nvidia_a100_80gb">NVIDIA A100 PCIe (80GB HBM2e, INT8 GEMM)</option>
                <option value="nvidia_rtx_4090">NVIDIA RTX 4090 Workstation (24GB GDDR6X)</option>
              </select>
            </div>

            {/* Sliders: Context Length & Concurrency */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400 uppercase">Context Window (Tokens)</span>
                  <span className="text-sky-400 font-bold">{contextLengthTokens.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="2048"
                  max="65536"
                  step="2048"
                  value={contextLengthTokens}
                  onChange={(e) => setContextLengthTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-1.5">
                  <span className="text-slate-400 uppercase">Concurrent Agent Swarm Streams</span>
                  <span className="text-sky-400 font-bold">{concurrentRequests} parallel streams</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="64"
                  step="1"
                  value={concurrentRequests}
                  onChange={(e) => setConcurrentRequests(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">Net VRAM Reduction</span>
                  <Layers className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono">
                  {results.vramSavingsPercent}%
                </div>
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  {results.unquantizedVramGb}GB → <span className="text-emerald-400 font-bold">{results.quantizedVramGb}GB</span>
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">Perplexity Drift</span>
                  <Gauge className="w-4 h-4 text-sky-400" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono">
                  +{results.perplexityDegradationPercent}%
                </div>
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  {results.baselinePerplexity} → <span className="text-sky-400 font-bold">{results.quantizedPerplexity}</span> PPL
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase">FinOps Annual Savings</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-amber-400 font-mono">
                  {results.annualGpuCostSavings}
                </div>
                <div className="mt-1 text-xs text-slate-400 font-mono">
                  Nodes: {results.baselineGpuNodes} → <span className="text-amber-400 font-bold">{results.requiredGpuNodes} GPU(s)</span>
                </div>
              </div>
            </div>

            {/* SLA Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              results.slaStatus === 'PERPLEXITY_PRESERVED_PRODUCTION_READY'
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : results.slaStatus === 'BORDERLINE_NEEDS_CALIBRATION'
                ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    PRODUCTION SLA STATUS: {results.slaStatus.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {results.slaStatus === 'PERPLEXITY_PRESERVED_PRODUCTION_READY'
                      ? 'Degradation under 1.2% threshold. Zero regression in reasoning or structured JSON extraction.'
                      : results.slaStatus === 'BORDERLINE_NEEDS_CALIBRATION'
                      ? 'Perplexity drift between 1.2% and 2.5%. Requires domain-specific calibration dataset.'
                      : 'Severe drift exceeding 2.5%. Recommend AWQ or FP8 Native to prevent agent hallucination.'}
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-xs hidden sm:block">
                <span className="text-slate-400">LATENCY:</span> {results.perTokenLatencyMs}ms/tok
              </div>
            </div>

            {/* Layer-wise Quantization Sensitivity Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-sky-400" />
                  Salient Channel & Layer-Wise Sensitivity Trace
                </h3>
                <span className="text-xs font-mono text-slate-500">AutoAWQ Profiler Trace</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2">LAYER GROUP</th>
                      <th className="pb-2">PRECISION</th>
                      <th className="pb-2">SALIENT CHANNELS</th>
                      <th className="pb-2">MSE ERROR</th>
                      <th className="pb-2">VRAM</th>
                      <th className="pb-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {results.layerTrace.map((layer, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/20">
                        <td className="py-2.5 font-medium text-slate-200">{layer.layerName}</td>
                        <td className="py-2.5 text-sky-300">{layer.bitwidth}</td>
                        <td className="py-2.5 text-slate-300">{layer.salientChannelsProtected} ch</td>
                        <td className="py-2.5 text-slate-400">{layer.perChannelMseError}</td>
                        <td className="py-2.5 text-emerald-400">{layer.quantizedVramMb} MB</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            layer.status === 'OPTIMAL'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : layer.status === 'COMPRESSED'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {layer.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyMemo}
                className="flex-1 py-3 px-4 rounded-full border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-200 transition flex items-center justify-center gap-2"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                {hasCopiedMemo ? 'COPIED EXECUTIVE MEMO!' : 'COPY EXECUTIVE FINOPS MEMO'}
              </button>
              <a
                href="#audit"
                className="flex-1 py-3 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                SCHEDULE SOVEREIGN QUANTIZATION AUDIT
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions: Enterprise Quantization & FinOps</h3>
          <div className="space-y-4">
            {[
              {
                q: "What is Activation-Aware Weight Quantization (AWQ) and why does it outperform RTN?",
                a: "Round-to-Nearest (RTN) quantization compresses all weights uniformly, causing extreme reasoning degradation because weights are not equally important. AWQ observes activation magnitudes during forward inference and identifies the top 1% salient channels that dictate transformer attention. By applying per-channel scaling to protect these critical features, AWQ preserves complex mathematical reasoning and coding capabilities under 4-bit representation."
              },
              {
                q: "How does SmoothQuant enable W8A8 matrix multiplication on enterprise GPUs?",
                a: "While weights can easily be quantized to INT8, activations feature systematic outlier channels that can be 100x larger than normal values. SmoothQuant migrates this activation quantization difficulty into weights using an equivalent mathematical transformation: Y = (X · diag(s)⁻¹) · (diag(s) · W). Dividing activations by scale vector s suppresses extreme spikes, allowing both weights and activations to run concurrently on INT8 tensor cores."
              },
              {
                q: "What are the advantages of Hopper FP8 (E4M3) over integer INT8?",
                a: "NVIDIA Hopper (H100) and Blackwell (B200) architectures introduce native FP8 tensor cores. Unlike INT8, FP8 maintains floating point dynamic range and requires zero integer zero-point tracking or affine quantization overhead. In production, FP8 E4M3 delivers a 2.35x throughput increase with virtually zero (<0.5%) perplexity increase."
              },
              {
                q: "How does quantization ensure compliance under the Indian DPDP Act 2023?",
                a: "Running unquantized 70B models required massive multi-GPU cloud instances, forcing many Indian enterprises to rely on foreign public APIs. By compressing 70B models to under 38 GB of VRAM, enterprises can run sovereign, air-gapped LLM instances entirely on local on-premise hardware inside private Indian datacenters in Bangalore, Mumbai, or Delhi, ensuring 100% data residency compliance."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-950/60 hover:bg-slate-950 flex justify-between items-center transition"
                >
                  <span className="font-medium text-sm text-slate-200">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs leading-relaxed text-slate-400 border-t border-slate-800 bg-slate-950/30">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Mandate Form Section */}
        <div id="audit" className="mt-16 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10 backdrop-blur">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Schedule Private Sovereign Quantization Audit</h2>
            <p className="mt-2 text-sm text-slate-400">
              Engage with Elesium's Principal AI Systems Architects to calibrate AWQ 4-bit weights, deploy FP8 KV cache memory scaling,
              and migrate high-concurrency LLM pipelines into sovereign air-gapped VPCs.
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
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-slate-200 uppercase">Embed Simulator On Your Site</h3>
              <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy the iframe code below to embed the responsive, interactive FP8 vs INT4 Quantization Simulator with live calculation onto your website or internal portal.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                className="px-4 py-2 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Iframe Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
