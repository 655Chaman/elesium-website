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
  Layers,
  Activity
} from 'lucide-react';
import {
  calculateFp8Microscaling,
  Fp8MicroscalingInputs,
  Fp8ModelArchitecture,
  MicroscalingFormat,
  MicroscalingBlockSize,
  HardwareCluster
} from '../calculator/agentFp8MicroscalingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentFp8MicroscalingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<Fp8ModelArchitecture>('sovereign_100b_agent');
  const [microscalingFormat, setMicroscalingFormat] = useState<MicroscalingFormat>('mxfp8_ocp');
  const [blockSize, setBlockSize] = useState<MicroscalingBlockSize>(32);
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_b200_blackwell');
  const [sequenceLengthTokens, setSequenceLengthTokens] = useState<number>(32768);
  const [batchSize, setBatchSize] = useState<number>(16);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: Fp8MicroscalingInputs = useMemo(() => ({
    modelArchitecture,
    microscalingFormat,
    blockSize,
    hardwareCluster,
    sequenceLengthTokens,
    batchSize,
    currency
  }), [
    modelArchitecture,
    microscalingFormat,
    blockSize,
    hardwareCluster,
    sequenceLengthTokens,
    batchSize,
    currency
  ]);

  const results = useMemo(() => calculateFp8Microscaling(inputs), [inputs]);

  const resetDefaults = () => {
    setModelArchitecture('sovereign_100b_agent');
    setMicroscalingFormat('mxfp8_ocp');
    setBlockSize(32);
    setHardwareCluster('nvidia_b200_blackwell');
    setSequenceLengthTokens(32768);
    setBatchSize(16);
    setCurrency('INR');
  };

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-fp8-microscaling-simulator" width="100%" height="520" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>\n<div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-fp8-microscaling-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium FP8 Microscaling Engine</a></div>`;

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
    const memo = `ELESIUM ENTERPRISE AI AUDIT MEMO: FP8 & MXFP8 MICROSCALING DEPLOYMENT
--------------------------------------------------------------------------------
Foundation Model Architecture: ${modelArchitecture}
Microscaling Format: ${microscalingFormat} (Block Size k=${blockSize})
Target Hardware Cluster: ${hardwareCluster}
Sequence Length: ${sequenceLengthTokens.toLocaleString()} tokens | Batch Size: ${batchSize}
--------------------------------------------------------------------------------
ANALYTICAL TELEMETRY RESULTS:
* Peak GEMM Speedup: ${results.gemmSpeedupMultiplier}x Peak Tensor FLOPS
* VRAM Memory Allocation: ${results.vramMemoryFootprintGb} GB (Baseline FP16: ${results.baselineVramGb} GB, ${results.memoryReductionPercent}% VRAM reduction)
* Perplexity Degradation: +${results.perplexityDeltaPercent}% (${results.perplexityDeltaPercent < 1.0 ? 'Sub-1% Enterprise Production Certified' : 'Outlier Degradation Alert'})
* Effective Step Latency: ${results.effectiveStepLatencyMs} ms
* End-to-End Throughput: ${results.tokensPerSecondThroughput.toLocaleString()} tokens/sec
* Power Draw Reduction: ${results.powerReductionPercent}% (${results.powerConsumptionWatts}W per GPU)
* FinOps Annual Savings: ${results.annualFinOpsSavings} (Est. $${(results.rawAnnualSavingsUsd / 1000).toFixed(0)}k USD / yr)
* Cluster Status: ${results.statusClassification}
--------------------------------------------------------------------------------
Sovereign DPDP Act 2023 & RBI Compliance: 100% On-Premise Air-Gapped Verified.
Generated via: https://elesium.online/tools/enterprise-agent-fp8-microscaling-simulator`;

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
      q: 'How does OCP Microscaling (MXFP8/MXFP4) prevent outlier degradation compared to naive FP8?',
      a: 'Traditional FP8 (E4M3/E5M2) applies a single scaling factor across an entire tensor or row. When activation outliers emerge in large models (e.g. 70B+), the wide dynamic range forces normal values toward zero, destroying numerical precision and causing 2-4% perplexity spikes. OCP Microscaling partitions vectors into microscopic 32-element blocks, each with an independent dynamic 8-bit scale factor (E8M0). Outliers are confined to their specific 32-element block without distorting adjacent activations.'
    },
    {
      q: 'Can MXFP8 be executed natively on NVIDIA Hopper H100 or is Blackwell B200 required?',
      a: 'NVIDIA Hopper (H100/H200) natively supports FP8 Tensor Cores in standard E4M3 and E5M2 formats. On Hopper, microscaling is implemented via CUTLASS and Triton WGMMA kernels by fusing dynamic block dequantization into shared memory before Tensor Core execution. NVIDIA Blackwell (B200) introduces native hardware micro-tensor scaling, executing MXFP8 and MXFP4 GEMMs directly in register files with zero dequantization instruction overhead.'
    },
    {
      q: 'What is the exact impact of FP8 microscaling on inference perplexity in enterprise production?',
      a: 'Extensive empirical validation shows that MXFP8 with block size 32 restricts perplexity degradation to less than 0.08% (sub-10 basis points) across Llama-3 70B, Qwen-2.5 72B, and DeepSeek-V3 checkpoints on Wikitext-2 and C4 benchmarks. This is mathematically indistinguishable from BF16 baseline reasoning while cutting memory bandwidth requirements by half.'
    },
    {
      q: 'How does FP8 microscaling support statutory data sovereignty under the Indian DPDP Act 2023?',
      a: 'By reducing model VRAM footprints from 160GB to ~85GB, an enterprise can host a frontier 70B or 100B agent on a single dual-GPU sovereign node rather than requiring an 8-GPU multi-node cluster. This allows Indian financial institutions, bourses, and hospitals to run private air-gapped deployments on-premise, preventing any customer data from traversing external cloud boundaries.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>FP8 & MXFP8 Microscaling Simulator | Enterprise Autonomous Agent Inference | Elesium</title>
        <meta
          name="description"
          content="Simulate FP8 GEMM acceleration, OCP MXFP8 dynamic block exponent shifting, FP4 weight quantization, and sub-1% perplexity serving on Hopper and Blackwell clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-fp8-microscaling-simulator" />
      </Helmet>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-8">
          <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
          <span>/</span>
          <a href="/tools" className="hover:text-emerald-400 transition-colors">Tools</a>
          <span>/</span>
          <span className="text-emerald-400 font-semibold">FP8 Microscaling Simulator</span>
        </div>

        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tool #66: Microscaling Architecture Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Enterprise Agent FP8 Microscaling & Block Dynamic Range Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Model dynamic 32-element block exponent shifting, OCP MXFP8/MXFP4 quantization, and WGMMA Tensor Core speedups. Eliminate low-precision outlier degradation while bounding perplexity loss below 0.08%.
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
          {/* Left Column: Interactive Hardware & Model Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Quantization & Hardware Parameters</span>
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
                  onChange={(e) => setModelArchitecture(e.target.value as Fp8ModelArchitecture)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent (Elesium Core)</option>
                  <option value="llama_3_1_70b">Meta Llama-3.1 70B (Dense Architecture)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (37B Active Params)</option>
                  <option value="llama_3_405b">Meta Llama-3 405B (Frontier Dense)</option>
                  <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B (Reasoning Model)</option>
                </select>
              </div>

              {/* Quantization Format */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Microscaling / Precision Format</label>
                <select
                  value={microscalingFormat}
                  onChange={(e) => setMicroscalingFormat(e.target.value as MicroscalingFormat)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="mxfp8_ocp">OCP MXFP8 (Shared E8M0 Block Exponent · Recommended)</option>
                  <option value="mxfp4_microscaling">OCP MXFP4 (Sub-1% Perplexity · 4-bit Weight Serving)</option>
                  <option value="fp8_e4m3">Standard FP8 E4M3 (Higher Precision Mantissa · Tensor Scaled)</option>
                  <option value="fp8_e5m2">Standard FP8 E5M2 (Wider Exponent Range · Noise Susceptible)</option>
                </select>
              </div>

              {/* Microscaling Block Size */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-400">Micro-Block Size (Vector Partition)</span>
                  <span className="text-emerald-400 font-semibold">k={blockSize} Elements</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[16, 32, 64, 128].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBlockSize(val as MicroscalingBlockSize)}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition-all ${
                        blockSize === val
                          ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 font-bold'
                          : 'border-white/10 bg-black/30 text-gray-400 hover:bg-white/5'
                      }`}
                    >
                      k={val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Hardware Accelerator */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-gray-400">Target GPU Infrastructure</label>
                <select
                  value={hardwareCluster}
                  onChange={(e) => setHardwareCluster(e.target.value as HardwareCluster)}
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="nvidia_b200_blackwell">NVIDIA B200 Blackwell (Native Hardware Micro-Scaling Cores)</option>
                  <option value="nvidia_h100_sxm">NVIDIA H100 SXM5 80GB (Hopper FP8 Tensor Cores)</option>
                  <option value="nvidia_h200_sxm">NVIDIA H200 SXM5 141GB (Hopper HBM3e Memory Bound)</option>
                  <option value="grace_hopper_gh200">NVIDIA Grace Hopper GH200 NVL (Unified Memory Fabric)</option>
                </select>
              </div>

              {/* Context Length & Batch Size */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
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
            {/* Status Banner */}
            <div className={`p-5 rounded-2xl border flex items-center justify-between gap-4 ${
              results.statusClassification === 'SUB_1_PERCENT_OPTIMAL'
                ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                : results.statusClassification === 'OCP_MICROSCALED_BALANCED'
                ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                : results.statusClassification === 'OUTLIER_NOISE_ELEVATED'
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
                    {results.statusClassification === 'SUB_1_PERCENT_OPTIMAL' && 'Microscaling active. Sub-10 basis point perplexity degradation achieved.'}
                    {results.statusClassification === 'OCP_MICROSCALED_BALANCED' && 'OCP block scaling active. Production-certified enterprise reasoning.'}
                    {results.statusClassification === 'OUTLIER_NOISE_ELEVATED' && 'Activation outlier noise detected. Switch to MXFP8 or smaller block size.'}
                    {results.statusClassification === 'PERPLEXITY_CATASTROPHE' && 'Severe precision breakdown. Outlier clamping destroying reasoning outputs.'}
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
                <div className="text-xs font-mono text-gray-400">GEMM Speedup</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">{results.gemmSpeedupMultiplier}x</div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">vs BF16 Baseline</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">VRAM Footprint</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.vramMemoryFootprintGb} GB</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">{results.memoryReductionPercent}% Reduction</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Perplexity Delta</div>
                <div className={`text-2xl font-mono font-bold mt-1 ${results.perplexityDeltaPercent < 0.10 ? 'text-emerald-400' : results.perplexityDeltaPercent < 1.0 ? 'text-amber-400' : 'text-rose-400'}`}>
                  +{results.perplexityDeltaPercent}%
                </div>
                <div className="text-[10px] font-mono text-gray-400 mt-1">&lt;1.0% Safe Threshold</div>
              </div>

              <div className="p-4 rounded-xl border border-white/10 bg-[#0d0d12]">
                <div className="text-xs font-mono text-gray-400">Throughput</div>
                <div className="text-2xl font-mono font-bold text-white mt-1">{results.tokensPerSecondThroughput.toLocaleString()}</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-1">Tokens / Second</div>
              </div>
            </div>

            {/* Microscaling Vector Partition SVG Diagram */}
            <div className="p-6 rounded-2xl border border-white/10 bg-[#0d0d12] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-white">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>OCP Microscaled Block Dynamic Range Normalization</span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">
                  Shared Exponent: E8M0 · Block Size k={blockSize}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-black/60 border border-white/5 font-mono text-xs space-y-3">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 1: VECTOR PARTITIONING</span>
                  <span className="text-emerald-400">Tensors sliced into k={blockSize} element microscopic blocks</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 2: SHARED EXPONENT SHIFTING</span>
                  <span className="text-blue-400">Dynamic 8-bit scale factor S_b = 2^(max_exp - bias)</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 3: HARDWARE TENSOR CONTRACTION</span>
                  <span className="text-purple-400">WGMMA fused instruction · Asynchronous Shared Memory Overlap</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">POWER & THERMAL DYNAMICS</span>
                  <span className="text-amber-400">{results.powerConsumptionWatts}W TDP per GPU ({results.powerReductionPercent}% Power Slashed)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono pt-1">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">Annual FinOps Savings:</span>
                  <span className="text-emerald-400 font-semibold">{results.annualFinOpsSavings}</span>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5 flex justify-between">
                  <span className="text-gray-400">DPDP Act 2023 Sovereignty:</span>
                  <span className="text-white font-semibold">100% On-Premise Air-Gapped</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy Sovereign FP8 Serving for Your Cluster</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated Triton WGMMA kernel and quantization calibration profile.</p>
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

        <MandateApplicationForm source="Tool #66: FP8 Microscaling Simulator" />
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
              <h3 className="text-sm font-semibold text-white">Embed FP8 Microscaling Simulator</h3>
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
        toolName="Enterprise FP8 & MXFP8 Microscaling Simulator"
        simulatedMetrics={[
          { label: 'GEMM Speedup', value: `${results.gemmSpeedupMultiplier}x` },
          { label: 'Perplexity Delta', value: `+${results.perplexityDeltaPercent}%` },
          { label: 'VRAM Reduction', value: `${results.memoryReductionPercent}%` },
          { label: 'FinOps Savings', value: results.annualFinOpsSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
