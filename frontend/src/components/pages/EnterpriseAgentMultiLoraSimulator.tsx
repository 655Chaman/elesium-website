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
  Coins,
  CheckCircle2,
  Gauge,
  Sparkles,
  Layers
} from 'lucide-react';
import {
  calculateMultiLora,
  MultiLoraInputs,
  BaseModelFamily,
  HardwareCluster
} from '../calculator/agentMultiLoraModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMultiLoraSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [baseModelFamily, setBaseModelFamily] = useState<BaseModelFamily>('llama_3_70b');
  const [numActiveAdapters, setNumActiveAdapters] = useState<number>(64);
  const [adapterRank, setAdapterRank] = useState<8 | 16 | 32 | 64>(16);
  const [concurrentBatchedRequests, setConcurrentBatchedRequests] = useState<number>(128);
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MultiLoraInputs = useMemo(() => ({
    baseModelFamily,
    numActiveAdapters,
    adapterRank,
    concurrentBatchedRequests,
    hardwareCluster,
    currency
  }), [
    baseModelFamily,
    numActiveAdapters,
    adapterRank,
    concurrentBatchedRequests,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateMultiLora(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-multi-lora-routing-simulator" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const memoContent = `=== ENTERPRISE AI ARCHITECTURE MEMO: MULTI-LORA ADAPTER ROUTING SIMULATION ===
Base Model Family: ${baseModelFamily.toUpperCase().replace(/_/g, ' ')}
Hardware Cluster: ${hardwareCluster.toUpperCase().replace(/_/g, ' ')}
Active LoRA Adapters: ${numActiveAdapters}
Adapter Rank: r=${adapterRank}
Concurrent Batched Requests: ${concurrentBatchedRequests}

SIMULATION RESULTS:
- Total Adapter Pool VRAM: ${results.totalAdapterPoolVramGb} GB (vs Dedicated Full Models: ${results.dedicatedModelsVramGb} GB)
- Shared System VRAM: ${results.sharedSystemTotalVramGb} GB
- VRAM Savings: -${results.vramSavingsPercent}%
- Adapter Switching Latency: ${results.switchingLatencyMs} ms (vs PCIe Host Copy: ${results.baselinePcieSwitchingMs} ms)
- Batch Throughput: ${results.batchThroughputTokensPerSec.toLocaleString()} tokens/sec
- Projected Annual FinOps Savings: ${results.annualClusterSavings}
- Production Serving SLA: ${results.slaStatus}

ADAPTER MEMORY TRACE:
${results.adapterAllocationTrace.map(s => `* ${s.stage}: ${s.description} -> Allocated: ${s.memoryMb} MB [${s.status}]`).join('\n')}

Issued by: Elesium AI Systems Architecture Advisory (https://elesium.online)`;

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(memoContent);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const faqs = [
    {
      q: "What is Multi-LoRA Dynamic Adapter Switching and why is it critical for enterprise AI?",
      a: "Multi-LoRA serving runtimes allow hundreds of specialized domain adapters (for legal review, financial underwriting, medical triage, or customer sentiment) to execute on a single base foundation model instance. Rather than deploying dozens of separate 70B models—which multiplies GPU cloud spend by 10x to 50x—Multi-LoRA dynamically loads and executes lightweight low-rank delta matrices in-flight on shared hardware."
    },
    {
      q: "How does Zero-Copy Weight Swapping achieve sub-10ms switching latency?",
      a: "Traditional adapter swapping copies weights across the PCIe bus on demand, inducing 40ms to 60ms latency stalls per task switch. Zero-copy architectures (such as S-LoRA and Punica) pre-allocate a unified paged adapter pool in high-bandwidth GPU memory (HBM). Batched Segment GEMV (SGMV) kernels execute adapter matrix multiplications directly using memory pointers, slashing switching overhead below 5ms."
    },
    {
      q: "What rank (r) should enterprise AI teams select for domain adaptation?",
      a: "For most corporate reasoning, classification, and extraction tasks, rank r=16 provides the optimal Pareto frontier: 99.4% task accuracy retention with only ~70MB of parameter overhead per adapter. Highly specialized code synthesis or statutory legal analysis may scale to rank r=32 or r=64, while simple routing and triage tasks operate with high efficiency at rank r=8."
    },
    {
      q: "How does Multi-LoRA satisfy DPDP Act 2023 multi-tenant compliance?",
      a: "By strictly isolating adapter weight checkpoints and KV cache pages across tenant boundaries within an air-gapped sovereign VPC, enterprise data residency is mathematically guaranteed. One department or client cannot access the weights or activations of another tenant, satisfying statutory isolation requirements under Section 8 of the Indian DPDP Act 2023."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Autonomous Agent Multi-LoRA Dynamic Adapter Routing Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate multi-LoRA dynamic adapter switching, zero-copy weight swapping, paged GPU memory slicing, and sub-10ms task multiplexing on shared foundation model clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-multi-lora-routing-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 border-b border-slate-800/80 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-sky-950/80 border border-sky-800/60 text-sky-400 mb-4">
            <Layers className="w-3.5 h-3.5" />
            TOOL #55: MULTI-TENANT INFERENCE &amp; ADAPTER MULTIPLEXING
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise Multi-LoRA Adapter Routing &amp; Weight Slicing Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Simulate zero-copy adapter switching, paged GPU memory slicing, and Batched Segment GEMV execution.
            Multiplex hundreds of domain-specialized enterprise agent tasks on a unified foundation model cluster at sub-10ms switching latency.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              <Code className="w-4 h-4 text-sky-400" />
              Embed This Calculator
            </button>
            <button
              onClick={handleCopyMemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-sky-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Architecture Memo'}
            </button>
            <button
              onClick={() => {
                setBaseModelFamily('llama_3_70b');
                setNumActiveAdapters(64);
                setAdapterRank(16);
                setConcurrentBatchedRequests(128);
                setHardwareCluster('nvidia_h100_sxm5');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-mono transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Sliders & Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2 text-sm font-bold text-white font-mono">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  ROUTING PARAMETERS
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded transition ${currency === 'INR' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'}`}
                  >
                    INR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded transition ${currency === 'USD' ? 'bg-sky-500/20 text-sky-300 font-bold' : 'text-slate-400'}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              <div className="space-y-6 mt-6">
                {/* Foundation Model */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-2 font-medium">
                    SHARED FOUNDATION MODEL
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: 'llama_3_70b', label: 'Llama-3 70B (Dense)' },
                      { id: 'deepseek_r1_671b', label: 'DeepSeek-R1 (MoE)' },
                      { id: 'mistral_large_123b', label: 'Mistral Large 123B' },
                      { id: 'qwen_2_5_72b', label: 'Qwen-2.5 72B' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setBaseModelFamily(m.id as BaseModelFamily)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          baseModelFamily === m.id
                            ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold shadow-lg shadow-sky-950/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Active Adapters */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
                    <span className="font-medium">CONCURRENT LORA ADAPTERS</span>
                    <span className="text-sky-400 font-bold">{numActiveAdapters} task models</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="256"
                    step="4"
                    value={numActiveAdapters}
                    onChange={(e) => setNumActiveAdapters(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>4 (Small Swarm)</span>
                    <span>64 (Mid Enterprise)</span>
                    <span>256 (Multi-Tenant SaaS)</span>
                  </div>
                </div>

                {/* LoRA Rank */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-2 font-medium">
                    LORA ADAPTER RANK DIMENSION (r)
                  </label>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                    {([8, 16, 32, 64] as const).map((r) => (
                      <button
                        key={r}
                        onClick={() => setAdapterRank(r)}
                        className={`py-2 rounded-xl border text-center transition ${
                          adapterRank === r
                            ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        r = {r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Concurrent Batched Requests */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
                    <span className="font-medium">CONCURRENT BATCHED QUERIES</span>
                    <span className="text-sky-400 font-bold">{concurrentBatchedRequests} requests</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="512"
                    step="16"
                    value={concurrentBatchedRequests}
                    onChange={(e) => setConcurrentBatchedRequests(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>16 Queries</span>
                    <span>128 Queries</span>
                    <span>512 Queries</span>
                  </div>
                </div>

                {/* Hardware Cluster */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-2 font-medium">
                    TARGET GPU CLUSTER
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: 'nvidia_h100_sxm5', label: 'NVIDIA H100 SXM5' },
                      { id: 'nvidia_b200_nvl', label: 'NVIDIA B200 NVL' },
                      { id: 'nvidia_a100_80gb', label: 'NVIDIA A100 80GB' },
                      { id: 'nvidia_l40s_ada', label: 'NVIDIA L40S Ada' },
                    ].map((hw) => (
                      <button
                        key={hw.id}
                        onClick={() => setHardwareCluster(hw.id as HardwareCluster)}
                        className={`p-2 rounded-xl border text-left transition ${
                          hardwareCluster === hw.id
                            ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {hw.label}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: Output Metrics & Telemetry (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top 3 Primary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Card 1: VRAM Saved */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Layers className="w-16 h-16 text-sky-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-1">VRAM SAVED</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tracking-tight">
                  -{results.vramSavingsPercent}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {results.sharedSystemTotalVramGb} GB vs {results.dedicatedModelsVramGb} GB dedicated
                </div>
              </div>

              {/* Card 2: Switching Latency */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Gauge className="w-16 h-16 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-1">TASK SWITCH LATENCY</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {results.switchingLatencyMs} ms
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  vs {results.baselinePcieSwitchingMs} ms PCIe copy
                </div>
              </div>

              {/* Card 3: FinOps Savings */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Coins className="w-16 h-16 text-amber-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-1">ANNUAL FINOPS SAVINGS</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
                  {results.annualClusterSavings}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Eliminating idle replica GPUs
                </div>
              </div>
            </div>

            {/* Throughput & Adapter Pool Specs */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  ADAPTER POOL &amp; INFERENCE THROUGHPUT
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">ADAPTER POOL VRAM</div>
                  <div className="text-base font-bold text-slate-200 mt-0.5">{results.totalAdapterPoolVramGb} GB</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{numActiveAdapters} LoRA matrices</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">BATCH THROUGHPUT</div>
                  <div className="text-base font-bold text-teal-400 mt-0.5">{results.batchThroughputTokensPerSec.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tokens / Second</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">AVG ADAPTER SIZE</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">{Math.round((results.totalAdapterPoolVramGb * 1024) / numActiveAdapters)} MB</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Rank {adapterRank} FP16</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">EXECUTION KERNEL</div>
                  <div className="text-base font-bold text-indigo-400 mt-0.5">Batched SGMV</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Zero CUDA Stall</div>
                </div>
              </div>
            </div>

            {/* Memory Allocation Stages */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                PAGED GPU MEMORY ALLOCATION BREAKDOWN
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {results.adapterAllocationTrace.map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-800/70 bg-slate-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-sky-400" />
                        {stage.stage}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                        {stage.description}
                      </div>
                    </div>
                    <div className="text-right sm:text-right shrink-0">
                      <div className="font-bold text-sky-400">{stage.memoryMb.toLocaleString()} MB</div>
                      <div className="text-[10px] text-slate-500">{stage.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Technical Architecture Deep Dive */}
        <div className="mt-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Underlying Technical Architecture: Zero-Copy LoRA Multiplexing (S-LoRA &amp; Punica)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            In modern enterprise AI systems, running separate fine-tuned 70B models for individual tasks (legal, financial, customer support, and code review) leads to massive GPU VRAM replication and prohibitive cloud hosting costs. Multi-LoRA dynamic adapter switching solves this bottleneck by freezing the base foundation model and serving hundreds of low-rank delta matrices ($\Delta W = B \times A$) simultaneously on shared GPU hardware.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">1. Unified Paged Memory Pool</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Adapters are decomposed into 2MB memory pages stored in GPU HBM. Paged memory eliminates external fragmentation, allowing hundreds of adapters with different ranks to coexist dynamically.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">2. Batched Segment GEMV (SGMV)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rather than merging adapter weights into the base model weights, custom CUDA kernels multiply token activation vectors by different adapter matrices in a single batched kernel launch.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">3. Sub-10ms Switching SLA</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Zero PCIe transfers occur during routine generation. Routing tokens to different task adapters is governed purely by integer metadata pointers, achieving consistent sub-5ms task switching.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-white mb-6">
            Frequently Asked Architecture Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800/80 rounded-xl bg-slate-900/40 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left font-medium text-slate-200 flex justify-between items-center text-sm hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-sky-400' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Generation & Mandate Application */}
        <div className="mt-16 bg-gradient-to-b from-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Deploy Sovereign Multi-LoRA Runtimes on Private Infrastructure
            </h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Consolidate your enterprise task fine-tuning across legal, BFSI, and logistics into a single sovereign foundation model cluster. Schedule an architecture review with our principal AI systems engineers.
            </p>
            <div className="text-left bg-slate-950 p-6 rounded-2xl border border-slate-800">
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

      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <Code className="w-4 h-4 text-sky-400" />
                Embed Multi-LoRA Simulator
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Copy and paste this snippet into your internal engineering docs, Confluence, or enterprise portal:
            </p>
            <textarea
              readOnly
              value={embedSnippet}
              className="w-full h-28 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 select-all mb-4 focus:outline-none focus:border-sky-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-medium flex items-center gap-1.5 transition"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Copied Snippet' : 'Copy HTML Snippet'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise Multi-LoRA Dynamic Adapter Routing Simulator"
        simulatedMetrics={[
          { label: 'Active Task Adapters', value: `${numActiveAdapters} Models` },
          { label: 'VRAM Footprint Reduction', value: `-${results.vramSavingsPercent}%` },
          { label: 'Task Switching Latency', value: `${results.switchingLatencyMs} ms` },
          { label: 'Annual FinOps Savings', value: results.annualClusterSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
