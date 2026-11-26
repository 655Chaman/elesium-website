import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Coins,
  CheckCircle2,
  Gauge,
  Sparkles,
  Server
} from 'lucide-react';
import {
  calculateFlashDecoding,
  FlashDecodingInputs,
  ModelArchitecture,
  ParallelismStrategy,
  HardwareCluster
} from '../calculator/agentFlashDecodingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentFlashDecodingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [contextLengthTokens, setContextLengthTokens] = useState<number>(65536);
  const [kvChunkSize, setKvChunkSize] = useState<number>(256);
  const [numGpus, setNumGpus] = useState<number>(2);
  const [parallelismStrategy, setParallelismStrategy] = useState<ParallelismStrategy>('sequence_parallel_ring');
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: FlashDecodingInputs = useMemo(() => ({
    modelArchitecture,
    contextLengthTokens,
    kvChunkSize,
    numGpus,
    parallelismStrategy,
    hardwareCluster,
    currency
  }), [
    modelArchitecture,
    contextLengthTokens,
    kvChunkSize,
    numGpus,
    parallelismStrategy,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateFlashDecoding(inputs), [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-flashdecoding-parallelism-simulator" width="100%" height="780" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe>\n<div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyMemo = () => {
    const memo = `ELESIUM FLASHDECODING & SEQUENCE PARALLELISM FINOPS MEMO
Target Model: ${modelArchitecture.toUpperCase()} | GPUs: ${numGpus}x ${hardwareCluster.toUpperCase()}
Context Window: ${contextLengthTokens.toLocaleString()} tokens | Split-KV Chunk: ${kvChunkSize} tokens
Parallelism Strategy: ${parallelismStrategy.toUpperCase()}
Baseline Decode Latency: ${results.baselineDecodeLatencyMs} ms/token (Linear Choke)
FlashDecoding Latency: ${results.flashDecodingLatencyMs} ms/token -> ${results.speedupMultiplier}x Net Speedup
Throughput: ${results.tokensPerSecond} tokens/second
SM Occupancy: ${results.smOccupancyPercent}% across ${results.numParallelSplits} parallel splits
Annual Cluster FinOps Savings: ${results.annualClusterSavings}
Production SLA Status: ${results.slaStatus}
Architecture Audit Link: https://elesium.online/tools/enterprise-agent-flashdecoding-parallelism-simulator`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  return (
    <div className="min-h-screen bg-black text-neutral-100 pt-28 pb-24 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Agent FlashDecoding & Sequence Parallelism Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate FlashDecoding split-KV sequence parallelism: overcome long-context decoding latency barriers, maximize SM occupancy, and achieve sub-10ms token generation."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-flashdecoding-parallelism-simulator" />
      </Helmet>

      <ExitIntentMemoModal
        toolName="FlashDecoding & Sequence Parallelism Simulator"
        simulatedMetrics={[
          { label: 'Token Latency', value: `${results.flashDecodingLatencyMs} ms` },
          { label: 'Decode Speedup', value: `${results.speedupMultiplier}x` },
          { label: 'SM Occupancy', value: `${results.smOccupancyPercent}%` },
          { label: 'Annual FinOps Savings', value: results.annualClusterSavings }
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-neutral-200 font-mono mb-3">
            <span>TOOLS</span>
            <span>/</span>
            <span className="text-neutral-400">INFRASTRUCTURE & COMPUTE</span>
            <span>/</span>
            <span className="text-white font-semibold">TOOL #51</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
                <Zap className="w-8 h-8 text-neutral-200" />
                Enterprise LLM FlashDecoding & Sequence Parallelism Simulator
              </h1>
              <p className="mt-2 text-base text-neutral-400 max-w-3xl">
                Simulate FlashDecoding split-KV parallel attention across 64k-128k context windows: parallelize keys and values
                across Streaming Multiprocessors, execute partial log-sum-exp reduction, and slash decoding latency by up to 8x.
              </p>
            </div>
            <div className="flex items-center gap-3 self-start md:self-auto">
              <button
                onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                className="active:scale-[0.97] px-3 py-1.5 rounded-lg border border-neutral-700 bg-neutral-900 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-600 transition"
              >
                CURRENCY: <span className="text-white font-bold">{currency}</span>
              </button>
              <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="active:scale-[0.97] inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/[0.04] text-neutral-200 hover:bg-neutral-200/20 text-xs font-mono transition"
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
          <div className="lg:col-span-5 bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 backdrop-blur space-y-6">
            <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
              <Sliders className="w-4 h-4 text-neutral-200" />
              <h2 className="text-sm font-semibold tracking-wider text-neutral-300 uppercase font-mono">
                FlashDecoding & Cluster Configuration
              </h2>
            </div>

            {/* Model Selection */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                1. Target Foundation Architecture
              </label>
              <select
                value={modelArchitecture}
                onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-white/40 font-mono"
              >
                <option value="llama_3_70b">Meta Llama-3 70B (8 GQA KV Heads)</option>
                <option value="deepseek_r1_671b">DeepSeek-R1 671B MoE (64 MLA Heads)</option>
                <option value="qwen_2_5_72b">Alibaba Qwen-2.5 72B Sovereign Base</option>
                <option value="mistral_large_123b">Mistral Large 2 123B High-Reasoning</option>
              </select>
            </div>

            {/* Parallelism Strategy */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                2. Parallelism Strategy
              </label>
              <select
                value={parallelismStrategy}
                onChange={(e) => setParallelismStrategy(e.target.value as ParallelismStrategy)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-white/40 font-mono"
              >
                <option value="sequence_parallel_ring">Sequence Parallelism (RingAttention)</option>
                <option value="flashdecoding_single_gpu">FlashDecoding (Single GPU Split-KV)</option>
                <option value="tensor_parallel_nvlink">Tensor Parallelism (NVLink All-Reduce)</option>
                <option value="hybrid_tp_sp">Hybrid TP + SP (DeepSpeed Ulysses)</option>
              </select>
            </div>

            {/* Hardware Cluster */}
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2 uppercase">
                3. GPU Hardware Nodes
              </label>
              <select
                value={hardwareCluster}
                onChange={(e) => setHardwareCluster(e.target.value as HardwareCluster)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 focus:outline-none focus:border-white/40 font-mono"
              >
                <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 (132 SMs, 3.35 TB/s HBM3)</option>
                <option value="nvidia_b200_nvl">NVIDIA B200 NVL (144 SMs, 8.0 TB/s HBM3e)</option>
                <option value="nvidia_a100_80gb">NVIDIA A100 PCIe (108 SMs, 2.0 TB/s HBM2e)</option>
                <option value="nvidia_l40s_ada">NVIDIA L40S Ada (142 SMs, 860 GB/s GDDR6)</option>
              </select>
            </div>

            {/* GPU Count & Chunk Size */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  GPU Count
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 4, 8].map((g) => (
                    <button
                      key={g}
                      onClick={() => setNumGpus(g)}
                      className={`active:scale-[0.97] py-2 text-xs font-mono rounded-lg border transition text-center ${
                        numGpus === g
                          ? 'border-white/30 bg-white/10 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {g}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1.5 uppercase">
                  KV Chunk Size
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[128, 256, 512, 1024].map((c) => (
                    <button
                      key={c}
                      onClick={() => setKvChunkSize(c)}
                      className={`active:scale-[0.97] py-2 text-xs font-mono rounded-lg border transition text-center ${
                        kvChunkSize === c
                          ? 'border-white/30 bg-white/10 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider: Context Length */}
            <div className="pt-2">
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-neutral-400 uppercase">Context Window Length</span>
                <span className="text-white font-bold">{contextLengthTokens.toLocaleString()} tokens</span>
              </div>
              <input
                type="range"
                min="4096"
                max="131072"
                step="4096"
                value={contextLengthTokens}
                onChange={(e) => setContextLengthTokens(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 mt-1">
                <span>4K</span>
                <span>32K</span>
                <span>64K</span>
                <span>128K</span>
              </div>
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase">Decode Speedup</span>
                  <Zap className="w-4 h-4 text-neutral-200" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono">
                  {results.speedupMultiplier}x
                </div>
                <div className="mt-1 text-xs text-neutral-400 font-mono">
                  {results.baselineDecodeLatencyMs}ms → <span className="text-white font-bold">{results.flashDecodingLatencyMs}ms</span>
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase">SM Occupancy</span>
                  <Gauge className="w-4 h-4 text-neutral-200" />
                </div>
                <div className="mt-2 text-3xl font-extrabold text-white font-mono">
                  {results.smOccupancyPercent}%
                </div>
                <div className="mt-1 text-xs text-neutral-400 font-mono">
                  {results.numParallelSplits} parallel SM thread splits
                </div>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-5 backdrop-blur">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-neutral-400 uppercase">FinOps Annual Savings</span>
                  <Coins className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-extrabold text-amber-400 font-mono">
                  {results.annualClusterSavings}
                </div>
                <div className="mt-1 text-xs text-neutral-400 font-mono">
                  Cluster: {numGpus}x GPU Nodes
                </div>
              </div>
            </div>

            {/* SLA Status Banner */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              results.slaStatus === 'SUB_10MS_ULTRA_FAST'
                ? 'bg-white/[0.05] border-white/30 text-neutral-200'
                : results.slaStatus === 'SUB_20MS_ACCEPTABLE'
                ? 'bg-white/[0.05] border-white/30 text-neutral-200'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <span className="text-xs font-mono font-bold tracking-wider uppercase">
                    PRODUCTION SLA: {results.slaStatus.replace(/_/g, ' ')}
                  </span>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {results.slaStatus === 'SUB_10MS_ULTRA_FAST'
                      ? 'Sub-10ms per-token generation achieved across long context. Perfect for live voice agents and algorithmic feeds.'
                      : results.slaStatus === 'SUB_20MS_ACCEPTABLE'
                      ? 'Sub-20ms latency maintained. Fully compliant for conversational agent swarms and document analysis.'
                      : 'Latency bottleneck detected. Recommend increasing GPU count or enabling Sequence Parallelism Ring.'}
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-xs hidden sm:block">
                <span className="text-neutral-400">THROUGHPUT:</span> {results.tokensPerSecond} tok/s
              </div>
            </div>

            {/* Parallel Split-KV Chunk Reduction Table */}
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 backdrop-blur">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-mono font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-4 h-4 text-neutral-200" />
                  Split-KV Parallel Reduction Kernel Trace
                </h3>
                <span className="text-xs font-mono text-neutral-500">FlashDecoding C++20 Runtime</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400">
                      <th className="pb-2">STAGE NAME</th>
                      <th className="pb-2">CHUNK RANGE</th>
                      <th className="pb-2">ACTIVE SMS</th>
                      <th className="pb-2">LATENCY</th>
                      <th className="pb-2">MEMORY BW</th>
                      <th className="pb-2 text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {results.chunkTrace.map((chunk, idx) => (
                      <tr key={idx} className="hover:bg-neutral-800/20">
                        <td className="py-2.5 font-medium text-neutral-200">{chunk.stageName}</td>
                        <td className="py-2.5 text-neutral-200">{chunk.chunkRange}</td>
                        <td className="py-2.5 text-neutral-300">{chunk.activeSms} SMs</td>
                        <td className="py-2.5 text-neutral-400">{chunk.partialLatencyMs} ms</td>
                        <td className="py-2.5 text-neutral-200">{chunk.memoryBandwidthGbps} GB/s</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            chunk.status === 'COMPUTED'
                              ? 'bg-white/10 text-neutral-200'
                              : chunk.status === 'REDUCED'
                              ? 'bg-white/10 text-neutral-200'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {chunk.status}
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
                className="active:scale-[0.97] flex-1 py-3 px-4 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-xs font-mono text-neutral-200 transition flex items-center justify-center gap-2"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4 text-neutral-200" /> : <Copy className="w-4 h-4 text-neutral-400" />}
                {hasCopiedMemo ? 'COPIED EXECUTIVE MEMO!' : 'COPY EXECUTIVE FINOPS MEMO'}
              </button>
              <a
                href="#audit"
                className="flex-1 py-3 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                SCHEDULE FLASHDECODING AUDIT
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-8 backdrop-blur">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions: FlashDecoding & Sequence Parallelism</h3>
          <div className="space-y-4">
            {[
              {
                q: "Why does standard autoregressive decoding stall on long context windows?",
                a: "During token generation, the query sequence length is strictly 1 while the key-value (KV) cache spans the full historical prompt (e.g. 64k or 128k tokens). Because traditional attention engines parallelize across batch size and attention heads, a single request with 8 GQA heads can only utilize 8 Streaming Multiprocessors. On a modern GPU with 132 SMs, over 90% of compute units sit idle while those 8 SMs choke sequentially reading gigabytes of KV tokens from High-Bandwidth Memory."
              },
              {
                q: "How does FlashDecoding parallelize along the sequence length dimension?",
                a: "FlashDecoding partitions the historical KV sequence into small chunks of 256 or 512 tokens. Each chunk is computed in parallel on separate SMs in high-speed SRAM, producing partial attention outputs and local log-sum-exp normalization values. A fast secondary reduction kernel merges these partial vectors using numerically stable softmax rescaling, keeping latency nearly flat regardless of context length."
              },
              {
                q: "What is RingAttention and how does it interface with Sequence Parallelism?",
                a: "RingAttention scales context lengths across multiple GPU nodes connected via high-speed interconnects (NVLink or InfiniBand). GPUs pass KV blocks around a logical peer-to-peer ring concurrently while computing attention on their local query tokens, overlapping inter-GPU communication with tensor core computation and eliminating network idle bubbles."
              },
              {
                q: "Can FlashDecoding be deployed in private on-premise VPCs under the Indian DPDP Act 2023?",
                a: "Yes. FlashDecoding is an algorithmic acceleration kernel that runs natively inside TensorRT-LLM and vLLM on local GPU servers. Regulated Indian enterprises in banking, healthcare, and defense can deploy 128k context reasoning models entirely within private on-premise datacenters in Bangalore and Mumbai without routing a single token through public cloud APIs."
              }
            ].map((item, idx) => (
              <div key={idx} className="border border-neutral-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full text-left p-4 bg-neutral-950/60 hover:bg-neutral-950 flex justify-between items-center transition"
                >
                  <span className="font-medium text-sm text-neutral-200">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs leading-relaxed text-neutral-400 border-t border-neutral-800 bg-neutral-950/30">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit Mandate Form Section */}
        <div id="audit" className="mt-16 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-10 backdrop-blur">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Schedule FlashDecoding Architecture Audit</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Engage with Elesium's Principal AI Systems Architects to configure custom FlashDecoding split-KV kernels,
              deploy sequence parallel RingAttention clusters, and eliminate long-context latency bottlenecks.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-white/20 bg-white/5 text-xs font-mono text-neutral-200">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
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
              className="active:scale-[0.97] px-6 py-3 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-neutral-400" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="text-sm font-mono font-bold text-neutral-200 uppercase">Embed Simulator On Your Site</h3>
              <button onClick={() => setIsEmbedOpen(false)} className="active:scale-[0.97] text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-400">
              Copy the iframe code below to embed the responsive, interactive FlashDecoding & Sequence Parallelism Simulator with live calculation onto your website or internal portal.
            </p>
            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 font-mono text-xs text-neutral-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] px-4 py-2 rounded-xl text-xs font-mono text-neutral-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                className="active:scale-[0.97] px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs font-mono transition flex items-center gap-1.5"
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
