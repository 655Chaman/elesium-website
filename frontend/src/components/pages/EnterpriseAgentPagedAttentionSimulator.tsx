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
  FileCode,
  Gauge
} from 'lucide-react';
import {
  calculatePagedAttention,
  PagedAttentionInputs,
  ModelArchitecture,
  GpuHardwareType,
  MemoryAllocationEngine,
  KvCacheQuantization
} from '../calculator/agentPagedAttentionModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentPagedAttentionSimulator() {
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [gpuHardwareType, setGpuHardwareType] = useState<GpuHardwareType>('nvidia_h100_80gb');
  const [memoryAllocationEngine, setMemoryAllocationEngine] = useState<MemoryAllocationEngine>('vllm_paged_attention');
  const [kvCacheQuantization, setKvCacheQuantization] = useState<KvCacheQuantization>('fp8_e4m3');
  const [concurrentAgentStreams, setConcurrentAgentStreams] = useState<number>(48);
  const [averageContextLengthTokens, setAverageContextLengthTokens] = useState<number>(8192);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: PagedAttentionInputs = useMemo(() => ({
    modelArchitecture,
    gpuHardwareType,
    memoryAllocationEngine,
    kvCacheQuantization,
    concurrentAgentStreams,
    averageContextLengthTokens,
    currency
  }), [
    modelArchitecture,
    gpuHardwareType,
    memoryAllocationEngine,
    kvCacheQuantization,
    concurrentAgentStreams,
    averageContextLengthTokens,
    currency
  ]);

  const outputs = useMemo(() => calculatePagedAttention(inputs), [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-pagedattention-cache-simulator" width="100%" height="750" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-pagedattention-cache-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium GPU VRAM Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `=== ELESIUM GPU VRAM PAGEDATTENTION & KV CACHE ALLOCATION SIMULATION ===
Model Architecture: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
GPU Hardware: ${gpuHardwareType.replace(/_/g, ' ').toUpperCase()}
Memory Allocation Engine: ${memoryAllocationEngine.replace(/_/g, ' ').toUpperCase()}
KV Cache Quantization: ${kvCacheQuantization.replace(/_/g, ' ').toUpperCase()}
Concurrent Agent Streams: ${concurrentAgentStreams} streams
Average Context Length: ${averageContextLengthTokens.toLocaleString()} tokens
Currency: ${currency}

--- PREDICTED TELEMETRY & HARDWARE METRICS ---
Effective VRAM Utilization: ${outputs.effectiveMemoryUtilizationPct}%
Internal Memory Fragmentation: ${outputs.internalFragmentationPct}%
Time-to-First-Token (TTFT): ${outputs.timeToFirstTokenLatencyMs} ms
Tokens/sec per GPU: ${outputs.tokensPerSecondPerGpu} tok/s
Max Concurrency Before OOM: ${outputs.maxConcurrentStreamsBeforeOom} streams
Annual Hardware Cost Savings: ${outputs.annualHardwareCostSavings}
VRAM Allocation Status: ${outputs.vramStatusClassification}

Generated via Elesium Autonomous Agent Systems (https://elesium.online)`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: 'How does PagedAttention eliminate GPU VRAM fragmentation in enterprise LLM clusters?',
      a: 'Traditional inference runtimes allocate KV-cache memory contiguously for each request based on worst-case maximum output lengths. This creates massive internal fragmentation (idle memory buffers) and external fragmentation (inability to allocate new requests despite free scattered memory). PagedAttention partitions the KV cache into fixed-size virtual blocks (16 or 32 tokens), mapping logical sequence positions to non-contiguous physical pages. This boosts memory utilization from ~30% to over 96%.'
    },
    {
      q: 'What is Chunked Prefill and why does it prevent multi-agent latency spikes?',
      a: 'During multi-agent execution, large incoming prompts (Prefill phase) require intense compute that stalls ongoing single-token generation (Decode phase), causing severe jitter and high Time-to-First-Token (TTFT) latency. Chunked prefill partitions large prompts into manageable chunks (e.g., 512 tokens) and co-schedules them with active decode tokens in each step, stabilizing GPU utilization and cutting TTFT by up to 74%.'
    },
    {
      q: 'Can this architecture be deployed in on-premise private VPCs under Indian DPDP Act 2023?',
      a: 'Yes. Elesium deploys air-gapped vLLM and TensorRT-LLM inference clusters with custom PagedAttention kernels directly inside sovereign Indian private VPCs. No prompt tokens, activations, or model weights ever traverse public cloud APIs or foreign network boundaries, satisfying 100% of RBI and DPDP Act 2023 data residency requirements.'
    },
    {
      q: 'What are the hardware benefits of FP8 and Int4 KV-Cache quantization?',
      a: 'Standard FP16 KV-cache requires 2 bytes per value per layer per token. Quantizing the cache to FP8 cuts memory footprint by 50% with near-zero perplexity loss, while Int4 algorithms (like KIVI) reduce memory by 75%. This allows an 80GB H100 GPU to handle 4x more concurrent multi-agent streams without out-of-memory (OOM) crashes.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise GPU VRAM PagedAttention & Prefill KV-Cache Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate GPU VRAM PagedAttention allocation, KV-cache virtual paging, chunked prefill scheduling, and multi-agent concurrency capacity across NVIDIA H100 and A100 clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-pagedattention-cache-simulator" />
      </Helmet>

      <div className="min-h-screen bg-[#05070a] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>Tool #48 • GPU VRAM & KV-Cache Paging Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              GPU VRAM PagedAttention & Prefill KV-Cache Simulator
            </h1>
            <p className="text-base text-slate-400 max-w-3xl mx-auto">
              Simulate non-contiguous virtual memory allocation, chunked prefill batching, and GPU VRAM fragmentation elimination for enterprise multi-agent swarms running Llama-3, DeepSeek-R1, and custom fine-tunes.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Inference & Memory Parameters</span>
                </div>
                <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'INR' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'USD' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Concurrent Streams */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Concurrent Agent Streams</span>
                  </label>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {concurrentAgentStreams} streams
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={concurrentAgentStreams}
                  onChange={(e) => setConcurrentAgentStreams(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Slider 2: Average Context Length */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-slate-400" />
                    <span>Avg Context Length (Tokens)</span>
                  </label>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {averageContextLengthTokens.toLocaleString()} tokens
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="32000"
                  step="1000"
                  value={averageContextLengthTokens}
                  onChange={(e) => setAverageContextLengthTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Selector 1: Model Architecture */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Model Architecture & Parameters
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'llama_3_70b', label: 'Llama-3 70B', sub: 'AWQ 4-Bit (38GB)' },
                    { id: 'deepseek_r1_671b', label: 'DeepSeek R1', sub: 'TP 8-way MLA' },
                    { id: 'mistral_large_123b', label: 'Mistral Large', sub: 'Dense 123B' },
                    { id: 'qwen_2_5_72b', label: 'Qwen-2.5 72B', sub: 'Coder reasoning' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setModelArchitecture(m.id as ModelArchitecture)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        modelArchitecture === m.id
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-white shadow-sm shadow-emerald-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{m.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: GPU Hardware Type */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  GPU Hardware Node Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'nvidia_h100_80gb', label: 'NVIDIA H100', sub: '80GB SXM5 (3.35 TB/s)' },
                    { id: 'nvidia_a100_80gb', label: 'NVIDIA A100', sub: '80GB PCIe (2.03 TB/s)' },
                    { id: 'nvidia_l40s_48gb', label: 'NVIDIA L40S', sub: '48GB Ada (860 GB/s)' },
                    { id: 'nvidia_rtx_4090_24gb', label: 'RTX 4090', sub: '24GB Workstation' }
                  ].map((gpu) => (
                    <button
                      key={gpu.id}
                      onClick={() => setGpuHardwareType(gpu.id as GpuHardwareType)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        gpuHardwareType === gpu.id
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{gpu.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{gpu.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Memory Allocation Engine */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Memory Management Runtime Engine
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'vllm_paged_attention', label: 'vLLM PagedAttention + Chunked Prefill', sub: 'Virtual block paging with zero external fragmentation' },
                    { id: 'tensorrt_llm_paged', label: 'NVIDIA TensorRT-LLM Paged KV Cache', sub: 'Custom In-Flight Batching with FP8 kernel execution' },
                    { id: 'naive_contiguous_pytorch', label: 'Naive Contiguous PyTorch Allocation', sub: 'Worst-case pre-allocation (severe internal fragmentation)' },
                    { id: 'huggingface_accelerate', label: 'HuggingFace Accelerate Offload', sub: 'Standard dynamic sequential allocation' }
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => setMemoryAllocationEngine(engine.id as MemoryAllocationEngine)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition ${
                        memoryAllocationEngine === engine.id
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{engine.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{engine.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 4: KV Cache Quantization */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  KV Cache Precision & Compression
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'fp16_uncompressed', label: 'FP16 Standard', sub: '2 bytes/token' },
                    { id: 'fp8_e4m3', label: 'FP8 (E4M3)', sub: '1 byte (50% cut)' },
                    { id: 'int4_kivi', label: 'Int4 KIVI', sub: '0.5 byte (75% cut)' }
                  ].map((q) => (
                    <button
                      key={q.id}
                      onClick={() => setKvCacheQuantization(q.id as KvCacheQuantization)}
                      className={`text-left p-2 rounded-xl border text-xs transition ${
                        kvCacheQuantization === q.id
                          ? 'bg-emerald-950/50 border-emerald-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{q.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{q.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Telemetry Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Effective VRAM Utilization</span>
                    <Gauge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    {outputs.effectiveMemoryUtilizationPct}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Internal Fragmentation: <span className="text-slate-200 font-mono">{outputs.internalFragmentationPct}%</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Time-to-First-Token (TTFT)</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-cyan-400">
                    {outputs.timeToFirstTokenLatencyMs} ms
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Throughput: <span className="text-slate-200 font-mono">{outputs.tokensPerSecondPerGpu} tok/s</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Max Concurrency Before OOM</span>
                    <Layers className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-purple-400">
                    {outputs.maxConcurrentStreamsBeforeOom} streams
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Status: <span className="text-slate-200 font-mono text-[11px]">{outputs.vramStatusClassification}</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Annual Hardware Cost Savings</span>
                    <Coins className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-amber-400">
                    {outputs.annualHardwareCostSavings}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Based on 3x-4x GPU cluster consolidation
                  </div>
                </div>
              </div>

              {/* Memory Allocation Trace */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>GPU VRAM Virtual Allocation Trace</span>
                </h3>
                <div className="space-y-2.5">
                  {outputs.memoryTrace.map((tr) => (
                    <div
                      key={tr.stage}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{tr.stageName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Allocated VRAM: {tr.allocatedVramGb} GB ({tr.utilizationPct}% capacity)
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        tr.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        tr.status === 'ALLOCATED' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {tr.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyExecutiveMemo}
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-500/20"
                >
                  {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedMemo ? 'Copied Telemetry Memo!' : 'Copy Executive Audit Memo'}</span>
                </button>
                <button
                  onClick={() => setIsEmbedOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
                >
                  <Code className="w-4 h-4 text-emerald-400" />
                  <span>Embed Calculator on Your Site</span>
                </button>
              </div>
            </div>
          </div>

          {/* Consultation Lead Magnet */}
          <div className="mb-14">
            <MandateApplicationForm />
          </div>

          {/* Technical FAQ */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">
              Frequently Asked Technical Questions: GPU VRAM Paging & Prefill Latency
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 text-sm font-semibold text-slate-200 flex justify-between items-center hover:text-emerald-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : 'text-slate-500'}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50">
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-base font-bold text-white mb-2">
                  Embed This Simulator On Your Website
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Copy and paste the snippet below into your CMS, blog, or internal portal. Includes live telemetry calculations and watermark backlink.
                </p>
                <textarea
                  readOnly
                  rows={5}
                  value={embedCode}
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-emerald-400 mb-4 focus:outline-none"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEmbedOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyEmbed}
                    className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Iframe Code'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Exit Intent Memo Modal */}
          <ExitIntentMemoModal
            toolName="GPU VRAM PagedAttention & KV-Cache Simulator"
            simulatedMetrics={[
              { label: 'VRAM Utilization', value: `${outputs.effectiveMemoryUtilizationPct}%` },
              { label: 'TTFT Latency', value: `${outputs.timeToFirstTokenLatencyMs} ms` },
              { label: 'Max Concurrency', value: `${outputs.maxConcurrentStreamsBeforeOom} streams` },
              { label: 'Annual Savings', value: outputs.annualHardwareCostSavings }
            ]}
          />
        </div>
      </div>
    </>
  );
}
