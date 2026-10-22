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
  Gauge,
  Sparkles,
  Network
} from 'lucide-react';
import {
  calculateSpeculativeVerification,
  SpeculativeVerificationInputs,
  TargetModel,
  DraftMethod,
  GpuHardware
} from '../calculator/agentSpeculativeVerificationModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentSpeculativeVerificationSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [targetModel, setTargetModel] = useState<TargetModel>('llama_3_70b');
  const [draftMethod, setDraftMethod] = useState<DraftMethod>('eagle_recurrent');
  const [maxTreeDepth, setMaxTreeDepth] = useState<number>(5);
  const [candidateBranches, setCandidateBranches] = useState<number>(64);
  const [pruningThreshold, setPruningThreshold] = useState<number>(0.15);
  const [gpuHardware, setGpuHardware] = useState<GpuHardware>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SpeculativeVerificationInputs = useMemo(() => ({
    targetModel,
    draftMethod,
    maxTreeDepth,
    candidateBranches,
    pruningThreshold,
    gpuHardware,
    currency
  }), [
    targetModel,
    draftMethod,
    maxTreeDepth,
    candidateBranches,
    pruningThreshold,
    gpuHardware,
    currency
  ]);

  const results = useMemo(() => calculateSpeculativeVerification(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-speculative-verification-simulator" width="100%" height="600" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const handleCopyMemo = () => {
    const memo = `=== ELESIUM SPECULATIVE VERIFICATION ARCHITECTURE MEMO ===
Target Model: ${inputs.targetModel}
Draft Method: ${inputs.draftMethod}
GPU Hardware: ${inputs.gpuHardware}
Max Lookahead Depth: ${inputs.maxTreeDepth} tokens
Tree Candidate Branches: ${inputs.candidateBranches}
Branch Pruning Threshold: ${inputs.pruningThreshold}

--- SIMULATED TELEMETRY ---
Speedup Multiplier: ${results.speedupMultiplier}x
Decode Throughput: ${results.tokensPerSecond} tokens/second
Single-Pass Verification Latency: ${results.verificationLatencyMs} ms (Sub-8ms SLA met)
Average Acceptance Rate: ${results.averageAcceptanceRate}%
Mean Accepted Tokens / Step: ${results.meanAcceptedLength} tokens
Pruned Low-Probability Branches: ${results.prunedBranchesCount}
Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
SLA Status: ${results.slaStatus}
===========================================================`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const resetDefaults = () => {
    setTargetModel('llama_3_70b');
    setDraftMethod('eagle_recurrent');
    setMaxTreeDepth(5);
    setCandidateBranches(64);
    setPruningThreshold(0.15);
    setGpuHardware('nvidia_h100_sxm5');
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does tree-based speculative decoding differ from standard linear speculative sampling?",
      a: "Standard speculative decoding samples draft tokens in a linear chain. If the foundation model rejects the third token, all subsequent candidate tokens are thrown away. Tree-based speculative decoding (Medusa, Eagle, SpecExec) constructs a branched tree of multiple plausible continuation paths. A single forward pass with a tree-attention mask verifies all branches simultaneously, achieving acceptance lengths of 3.8 to 4.5 tokens per step."
    },
    {
      q: "Why is single-pass tree verification latency guaranteed to be sub-8 milliseconds?",
      a: "By compiling custom FlashAttention-2 tree masks, the target foundation model processes candidate tree tokens as a single unified sequence rather than multiple independent requests. On modern tensor cores (NVIDIA H100 SXM5 / B200 NVL), the attention and MLP verification pass completes in 5.2ms to 7.2ms, maintaining sub-8ms verification SLAs."
    },
    {
      q: "How does dynamic non-uniform branch pruning protect GPU compute budgets?",
      a: "Unchecked tree branching leads to exponential candidate token explosion, which degrades target model verification throughput. The dynamic branch pruning engine evaluates cumulative branch probabilities in real time. Candidates whose cumulative probability falls below the threshold (e.g. 0.15) are pruned prior to attention mask generation, focusing GPU compute only on high-confidence tokens."
    },
    {
      q: "Does speculative decoding alter the model's mathematical output distribution?",
      a: "No. Speculative decoding guarantees lossless mathematical equivalence to standard autoregressive sampling. The target foundation model retains final verification authority: if a candidate token's logits do not satisfy the exact acceptance criterion, it is rejected and resampled from the target model's true conditional distribution."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      <Helmet>
        <title>Enterprise Speculative Verification Kernel &amp; Draft Tree Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate tree-based speculative decoding, non-uniform candidate branch pruning, sub-8ms CUDA verification kernels, and 2.8x inference throughput expansion on enterprise GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-speculative-verification-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative pt-24 pb-12 border-b border-slate-800/80 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e90a_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e90a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-sky-950/80 border border-sky-800/60 text-sky-400 mb-4">
            <Network className="w-3.5 h-3.5" />
            TOOL #58: SPECULATIVE DECODING &amp; VERIFICATION KERNELS
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise Speculative Verification Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Simulate tree-based candidate draft generation, non-uniform branch pruning, and single-pass CUDA verification kernels.
            Accelerate autoregressive LLM decode throughput by up to 2.8x with guaranteed sub-8ms verification latency.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-sky-400" />
              Embed This Tool
            </button>
            <button
              onClick={handleCopyMemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Export Executive Memo'}
            </button>
            <button
              onClick={resetDefaults}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all shadow-sm ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Parameters
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-sky-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Speculative Parameters
                  </h2>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 text-xs font-mono rounded ${currency === 'INR' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    INR
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 text-xs font-mono rounded ${currency === 'USD' ? 'bg-sky-500 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD
                  </button>
                </div>
              </div>

              {/* Model & Method Selection */}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Target Foundation Model
                  </label>
                  <select
                    value={targetModel}
                    onChange={(e) => setTargetModel(e.target.value as TargetModel)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="llama_3_70b">Meta Llama-3-70B (80 Layers, 8k Context)</option>
                    <option value="deepseek_v2_236b">DeepSeek-V2-236B (MLA Paged Routing)</option>
                    <option value="qwen_2_5_72b">Qwen-2.5-72B (Full Dense Attention)</option>
                    <option value="mistral_large_123b">Mistral-Large-123B (88 Layers)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    Speculative Draft Architecture
                  </label>
                  <select
                    value={draftMethod}
                    onChange={(e) => setDraftMethod(e.target.value as DraftMethod)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="eagle_recurrent">Eagle Recurrent Draft (Target-Aware Hidden States)</option>
                    <option value="medusa_heads">Medusa Multi-Head (Decoupled Top-k Prediction)</option>
                    <option value="spec_exec_tree">SpecExec Tree Mask (Single-Pass Attention)</option>
                    <option value="small_draft_model">Small Draft Model (Llama-3-8B Distilled)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">
                    GPU Hardware Node
                  </label>
                  <select
                    value={gpuHardware}
                    onChange={(e) => setGpuHardware(e.target.value as GpuHardware)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-sky-500 font-mono"
                  >
                    <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 80GB (3.35 TB/s HBM3)</option>
                    <option value="nvidia_b200_nvl">NVIDIA B200 NVL 192GB (8.0 TB/s HBM3e)</option>
                    <option value="nvidia_a100_80gb">NVIDIA A100 SXM4 80GB (2.0 TB/s HBM2e)</option>
                    <option value="nvidia_l40s">NVIDIA L40S Ada 48GB (864 GB/s GDDR6)</option>
                  </select>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Candidate Tree Branches</span>
                    <span className="text-sky-400 font-mono font-bold">{candidateBranches} Branches</span>
                  </div>
                  <input
                    type="range"
                    min="16"
                    max="128"
                    step="8"
                    value={candidateBranches}
                    onChange={(e) => setCandidateBranches(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>16 (Minimal)</span>
                    <span>64 (Standard)</span>
                    <span>128 (Max Density)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Max Lookahead Depth</span>
                    <span className="text-emerald-400 font-mono font-bold">{maxTreeDepth} Tokens</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={maxTreeDepth}
                    onChange={(e) => setMaxTreeDepth(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>2 Tokens</span>
                    <span>5 Tokens</span>
                    <span>8 Tokens</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Branch Pruning Threshold</span>
                    <span className="text-purple-400 font-mono font-bold">{(pruningThreshold * 100).toFixed(0)}% Probability</span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.40"
                    step="0.05"
                    value={pruningThreshold}
                    onChange={(e) => setPruningThreshold(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>5% (Permissive)</span>
                    <span>15% (Optimal)</span>
                    <span>40% (Aggressive)</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Speedup Multiplier
                </div>
                <div className="text-3xl font-extrabold font-mono text-emerald-400">
                  {results.speedupMultiplier}x
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {results.tokensPerSecond} tok/s decode
                </div>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Verify Latency
                </div>
                <div className="text-3xl font-extrabold font-mono text-sky-400">
                  {results.verificationLatencyMs} ms
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  sub-8ms SLA met
                </div>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Acceptance Rate
                </div>
                <div className="text-3xl font-extrabold font-mono text-purple-400">
                  {results.averageAcceptanceRate}%
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {results.meanAcceptedLength} tok / step
                </div>
              </div>

              <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-4 shadow-lg text-center">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  FinOps Savings
                </div>
                <div className="text-3xl font-extrabold font-mono text-amber-400">
                  {results.annualFinOpsSavings}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Pruned: {results.prunedBranchesCount} paths
                </div>
              </div>
            </div>

            {/* Visual Speculative Candidate Tree HUD */}
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Candidate Tree Verification Matrix
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Accepted
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block" /> Verified
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500/50 inline-block" /> Pruned
                  </span>
                </div>
              </div>

              {/* 12-node tree representation */}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 mb-6">
                {results.treeNodes.map((node) => (
                  <div
                    key={node.id}
                    className={`h-16 rounded-lg border flex flex-col items-center justify-center p-1 text-center transition-all ${
                      node.status === 'ACCEPTED'
                        ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                        : node.status === 'VERIFIED'
                        ? 'bg-sky-950/60 border-sky-800 text-sky-300'
                        : 'bg-rose-950/40 border-rose-900/60 text-rose-400 opacity-60'
                    }`}
                  >
                    <span className="text-[10px] font-mono font-bold">
                      {node.status}
                    </span>
                    <span className="text-[9px] opacity-75 font-mono">
                      D{node.depth} · {(node.probability * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Architecture Explanation Box */}
              <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800/80 text-xs text-slate-300 leading-relaxed space-y-2 font-mono">
                <div className="text-sky-400 font-bold flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  Single-Pass Tree Attention Mask Compilation Status
                </div>
                <p>
                  Specialized FlashAttention-2 tree masks verify up to <strong className="text-white">{inputs.candidateBranches} candidate branches</strong> simultaneously in a single forward pass. Decode latency drops to <strong className="text-emerald-400">{results.verificationLatencyMs} ms</strong> with <strong className="text-white">{results.meanAcceptedLength} tokens accepted per step</strong>, delivering a <strong className="text-emerald-400">{results.speedupMultiplier}x speedup</strong> without altering output distribution.
                </p>
              </div>
            </div>

            {/* Architecture Comparison Table */}
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono mb-4 pb-2 border-b border-slate-800">
                Comparative Architecture Matrix: Standard vs. Tree Speculative
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-2">Serving Dimension</th>
                      <th className="pb-2">Autoregressive Dense</th>
                      <th className="pb-2 text-sky-400">Tree Speculative Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2.5 font-medium text-white">Tokens Generated per Forward Pass</td>
                      <td className="py-2.5 text-rose-400">1.0 Token (Strictly sequential)</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{results.meanAcceptedLength} Tokens / step</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Decode Throughput (TPS)</td>
                      <td className="py-2.5">28.0 tok/s</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{results.tokensPerSecond} tok/s ({results.speedupMultiplier}x speedup)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Single-Pass Verification Latency</td>
                      <td className="py-2.5 text-rose-400">24.5ms (Memory bandwidth bound)</td>
                      <td className="py-2.5 text-emerald-400 font-bold">{results.verificationLatencyMs}ms (Sub-8ms SLA met)</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Token Output Distribution</td>
                      <td className="py-2.5">Exact Target Distribution</td>
                      <td className="py-2.5 text-emerald-400 font-bold">100% Lossless Equivalent</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-medium text-white">Annual FinOps Savings</td>
                      <td className="py-2.5">Baseline GPU OPEX</td>
                      <td className="py-2.5 text-amber-400 font-bold">{results.annualFinOpsSavings} / year</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

        {/* FAQ Accordion Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Frequently Asked Questions: Tree-Based Speculative Decoding
            </h2>
            <p className="text-sm text-slate-400">
              Technical guidance on Medusa heads, Eagle recurrent models, dynamic pruning, and production verification SLAs.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f19] border border-slate-800/80 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-sm font-medium text-white hover:text-sky-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${openFaq === idx ? 'transform rotate-180 text-sky-400' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CRO Conversion Block: Architecture Mandate Form */}
        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-b from-[#0b0f19] to-[#07090e] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SOVEREIGN INFERENCE ACCELERATION AUDIT
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Accelerate LLM Decode Throughput by 2.8x
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              Schedule a technical consultation with our Principal AI Systems Architects. We audit your vLLM, TensorRT-LLM, and SGLang clusters to deploy lossless tree speculative decoding inside your sovereign private VPC.
            </p>
          </div>
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

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-sky-400" />
              <h3 className="text-base font-bold text-white font-mono">
                Embed Speculative Verification Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this clean HTML snippet into your technical documentation, internal Wiki, or partner engineering blog:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all mb-4 max-h-36 overflow-y-auto">
              {embedSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="px-4 py-2 rounded-lg text-xs font-mono bg-sky-500 hover:bg-sky-400 text-white font-bold transition-colors inline-flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise Speculative Verification Simulator"
        simulatedMetrics={[
          { label: 'Speedup Multiplier', value: `${results.speedupMultiplier}x` },
          { label: 'Verification Latency', value: `${results.verificationLatencyMs} ms` },
          { label: 'Acceptance Rate', value: `${results.averageAcceptanceRate}%` },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
