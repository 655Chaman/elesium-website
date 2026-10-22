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
  GitBranch
} from 'lucide-react';
import {
  calculateMixtureOfDepths,
  MixtureOfDepthsInputs,
  FoundationModel,
  HardwareCluster
} from '../calculator/agentMixtureOfDepthsModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMixtureOfDepthsSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [foundationModel, setFoundationModel] = useState<FoundationModel>('llama_3_70b');
  const [capacityFactor, setCapacityFactor] = useState<number>(0.50);
  const [sequenceLength, setSequenceLength] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(64);
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MixtureOfDepthsInputs = useMemo(() => ({
    foundationModel,
    capacityFactor,
    sequenceLength,
    batchSize,
    hardwareCluster,
    currency
  }), [
    foundationModel,
    capacityFactor,
    sequenceLength,
    batchSize,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateMixtureOfDepths(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-mixture-of-depths-simulator" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const memoContent = `=== ENTERPRISE AI ARCHITECTURE MEMO: MIXTURE-OF-DEPTHS (MoD) COMPUTE SIMULATION ===
Foundation Architecture: ${foundationModel.toUpperCase().replace(/_/g, ' ')}
Hardware Cluster: ${hardwareCluster.toUpperCase().replace(/_/g, ' ')}
Layer Capacity Factor: ${Math.round(capacityFactor * 100)}% active tokens per block
Sequence Length: ${sequenceLength.toLocaleString()} tokens
Batched Concurrency: ${batchSize} sequences

SIMULATION RESULTS:
- Total FLOP Reduction: -${results.flopReductionPercent}%
- Effective Compute: ${results.effectiveFlopsTflops} TFLOPs (vs Dense Baseline: ${results.baselineDenseFlopsTflops} TFLOPs)
- Decode Speedup Factor: ${results.speedupMultiplier}x
- Token Throughput: ${results.throughputTokensPerSec.toLocaleString()} tokens/sec
- Active Tokens/Layer: ${results.activeTokensPerLayer.toLocaleString()}
- Bypassed Identity Tokens/Layer: ${results.bypassedTokensPerLayer.toLocaleString()}
- Projected Annual FinOps Savings: ${results.annualClusterSavings}
- Production Serving SLA: ${results.slaStatus}

DYNAMIC ROUTING EXECUTION TRACE:
${results.executionTrace.map(s => `* ${s.stage} (${s.tokensProcessed.toLocaleString()} tokens): ${s.description} -> ${s.flopTeraflops} TFLOPs [${s.status}]`).join('\n')}

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
      q: "What is Mixture-of-Depths (MoD) and how does it differ from Mixture-of-Experts (MoE)?",
      a: "While Mixture-of-Experts (MoE) routes tokens horizontally across different specialized feed-forward networks (widening the model), Mixture-of-Depths (MoD) routes tokens vertically through layers. Instead of computing all self-attention and MLP blocks for every token, MoD dynamically routes simpler tokens around layers via residual bypass connections, slashing total model FLOPs by up to 50% while holding total parameter count constant."
    },
    {
      q: "Why does MoD enforce a static capacity factor rather than variable early exits?",
      a: "Traditional dynamic early exits generate variable batch shapes across pipeline stages, inducing severe GPU thread divergence and memory reallocation stalls. Mixture-of-Depths enforces a rigid static capacity factor (e.g. exactly 50% of sequence length). By padding or trimming to fixed tensor shapes, CUDA kernels run at peak hardware utilization with zero GPU synchronization stalls."
    },
    {
      q: "Does skipping transformer layers degrade reasoning accuracy on complex tasks?",
      a: "Empirical evaluations demonstrate that natural language contains high linguistic redundancy: punctuation, common determiners, and repetitive boilerplates require minimal semantic processing. MoD trains a top-k router to identify high-information tokens, dedicating full transformer depth exclusively to complex reasoning tokens while maintaining identical or superior downstream benchmark performance."
    },
    {
      q: "Can Mixture-of-Depths run air-gapped on sovereign private VPCs under DPDP Act 2023?",
      a: "Yes. Elesium deploys custom MoD execution kernels on dedicated on-premise NVIDIA H100 and Blackwell servers inside sovereign private VPCs. No user activations or routing probabilities leave your internal perimeter, ensuring strict statutory compliance under Section 8 of the Indian DPDP Act 2023."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Autonomous Agent Mixture-of-Depths (MoD) Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Mixture-of-Depths dynamic compute routing, conditional capacity allocation, token-level early exits, and sub-50% FLOP reduction on enterprise LLM clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-mixture-of-depths-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 border-b border-slate-800/80 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-sky-950/80 border border-sky-800/60 text-sky-400 mb-4">
            <GitBranch className="w-3.5 h-3.5" />
            TOOL #56: DYNAMIC COMPUTE &amp; FLOP OPTIMIZATION
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise Mixture-of-Depths Dynamic Compute Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Simulate conditional capacity allocation, learned top-k token routing, and static-shape residual bypass streams.
            Reduce total inference FLOP budgets by up to 50% while accelerating decode throughput across enterprise AI clusters.
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
                setFoundationModel('llama_3_70b');
                setCapacityFactor(0.50);
                setSequenceLength(4096);
                setBatchSize(64);
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
                  DYNAMIC COMPUTE CONTROLS
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
                    FOUNDATION ARCHITECTURE
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { id: 'llama_3_70b', label: 'Llama-3 70B (80L)' },
                      { id: 'deepseek_r1_671b', label: 'DeepSeek-R1 (61L)' },
                      { id: 'mistral_large_123b', label: 'Mistral Large (88L)' },
                      { id: 'qwen_2_5_72b', label: 'Qwen-2.5 72B (80L)' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setFoundationModel(m.id as FoundationModel)}
                        className={`p-2.5 rounded-xl border text-left transition ${
                          foundationModel === m.id
                            ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold shadow-lg shadow-sky-950/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity Factor */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
                    <span className="font-medium">LAYER CAPACITY FACTOR (C)</span>
                    <span className="text-sky-400 font-bold">{Math.round(capacityFactor * 100)}% computing</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono mb-2">
                    {[
                      { val: 0.125, label: '12.5%' },
                      { val: 0.25, label: '25%' },
                      { val: 0.50, label: '50% (Std)' },
                      { val: 0.75, label: '75%' },
                    ].map((c) => (
                      <button
                        key={c.val}
                        onClick={() => setCapacityFactor(c.val)}
                        className={`py-1.5 rounded-lg border text-center transition ${
                          capacityFactor === c.val
                            ? 'bg-sky-950/80 border-sky-500 text-sky-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0.125"
                    max="0.875"
                    step="0.025"
                    value={capacityFactor}
                    onChange={(e) => setCapacityFactor(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>Aggressive Bypass (12.5%)</span>
                    <span>Conservative (87.5%)</span>
                  </div>
                </div>

                {/* Sequence Length */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
                    <span className="font-medium">SEQUENCE CONTEXT LENGTH</span>
                    <span className="text-sky-400 font-bold">{sequenceLength.toLocaleString()} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="1024"
                    max="32768"
                    step="1024"
                    value={sequenceLength}
                    onChange={(e) => setSequenceLength(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>1,024</span>
                    <span>16,384</span>
                    <span>32,768</span>
                  </div>
                </div>

                {/* Batch Size */}
                <div>
                  <div className="flex justify-between items-center text-xs font-mono text-slate-300 mb-2">
                    <span className="font-medium">CONCURRENT BATCH SIZE</span>
                    <span className="text-sky-400 font-bold">{batchSize} streams</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="256"
                    step="16"
                    value={batchSize}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-sky-500 border border-slate-800"
                  />
                </div>

                {/* Hardware Cluster */}
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-2 font-medium">
                    INFERENCE CLUSTER
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
              {/* Card 1: FLOP Reduction */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <GitBranch className="w-16 h-16 text-sky-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-1">TOTAL FLOP SAVED</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-sky-400 font-mono tracking-tight">
                  -{results.flopReductionPercent}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {results.effectiveFlopsTflops} vs {results.baselineDenseFlopsTflops} TFLOPs
                </div>
              </div>

              {/* Card 2: Decode Speedup */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Gauge className="w-16 h-16 text-emerald-400" />
                </div>
                <div className="text-xs font-mono text-slate-400 mb-1">DECODE SPEEDUP</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                  {results.speedupMultiplier}x
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Static tensor hardware aligned
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
                  Reduced cluster compute instances
                </div>
              </div>
            </div>

            {/* Token Routing Breakdown */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  TOKEN PARTITIONING &amp; THROUGHPUT
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">ACTIVE TOKENS / LAYER</div>
                  <div className="text-base font-bold text-slate-200 mt-0.5">{results.activeTokensPerLayer.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Top-k Routed</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">BYPASSED TOKENS / LAYER</div>
                  <div className="text-base font-bold text-teal-400 mt-0.5">{results.bypassedTokensPerLayer.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Residual Stream</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">CLUSTER THROUGHPUT</div>
                  <div className="text-base font-bold text-sky-400 mt-0.5">{results.throughputTokensPerSec.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Tokens / Second</div>
                </div>
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/60">
                  <div className="text-[10px] text-slate-500">TENSOR SHAPE JITTER</div>
                  <div className="text-base font-bold text-indigo-400 mt-0.5">Zero (Padded)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Static Alignment</div>
                </div>
              </div>
            </div>

            {/* Execution Stages */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white font-mono mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                LAYER-BY-LAYER COMPUTATION FLOW
              </h3>

              <div className="space-y-3 font-mono text-xs">
                {results.executionTrace.map((stage, idx) => (
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
                      <div className="font-bold text-sky-400">{stage.flopTeraflops} TFLOPs</div>
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
            Underlying Technical Architecture: Mixture-of-Depths (MoD)
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            Monolithic autoregressive transformers waste immense computational energy calculating heavy self-attention and MLP transformations across repetitive, predictable, or trivial tokens. Mixture-of-Depths introduces learned scalar routers per layer, dynamically evaluating token entropy and routing only the top-k highest-information tokens through computation while allowing the rest to bypass layers via identity residual addition.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">1. Learned Scalar Projection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A simple linear layer projects each token's hidden state into a scalar routing weight. Tokens whose weights exceed the dynamic top-k threshold are selected for layer execution.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">2. Static Capacity Bound</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                By fixing the number of active tokens to a predetermined capacity C (e.g. 50%), tensor dimensions remain strictly constant throughout forward passes, preventing GPU warp divergence.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-sm font-bold text-sky-400 mb-2">3. 1.7x+ Throughput Acceleration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Skipping up to 50% of layer computations directly accelerates autoregressive decoding speed, allowing enterprise clusters to double their concurrent user capacity with zero hardware expansion.
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
              Deploy Sovereign Mixture-of-Depths Runtimes on Private Infrastructure
            </h2>
            <p className="text-sm text-slate-400 mb-8 leading-relaxed">
              Cut inference FLOPs in half while doubling decoding throughput on your sovereign enterprise AI infrastructure. Schedule an architecture review with our principal AI systems engineers.
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
                Embed Mixture-of-Depths Simulator
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
        toolName="Enterprise Mixture-of-Depths Dynamic Compute Simulator"
        simulatedMetrics={[
          { label: 'FLOP Reduction', value: `-${results.flopReductionPercent}%` },
          { label: 'Decode Speedup', value: `${results.speedupMultiplier}x` },
          { label: 'Throughput', value: `${results.throughputTokensPerSec.toLocaleString()} tok/s` },
          { label: 'Annual FinOps Savings', value: results.annualClusterSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
