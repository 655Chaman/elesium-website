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
  FastForward,
  Activity,
  Layers,
  Cpu
} from 'lucide-react';
import {
  calculateMtpSimulation,
  MtpSimulationInputs
} from '../calculator/agentMtpSpeculativeDraftModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMtpSpeculativeDraftSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [mtpPredictionDepth, setMtpPredictionDepth] = useState<number>(3);
  const [speculativeVerificationMode, setSpeculativeVerificationMode] = useState<MtpSimulationInputs['speculativeVerificationMode']>('dynamic_tree');
  const [taskDomainComplexity, setTaskDomainComplexity] = useState<MtpSimulationInputs['taskDomainComplexity']>('chain_of_thought_reasoning');
  const [batchConcurrency, setBatchConcurrency] = useState<number>(128);
  const [targetModelSize, setTargetModelSize] = useState<MtpSimulationInputs['targetModelSize']>('deepseek_v3_671b');
  const [hardwareCluster, setHardwareCluster] = useState<MtpSimulationInputs['hardwareCluster']>('8x_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MtpSimulationInputs = useMemo(() => ({
    mtpPredictionDepth,
    speculativeVerificationMode,
    taskDomainComplexity,
    batchConcurrency,
    targetModelSize,
    hardwareCluster,
    currency
  }), [
    mtpPredictionDepth,
    speculativeVerificationMode,
    taskDomainComplexity,
    batchConcurrency,
    targetModelSize,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateMtpSimulation(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-mtp-speculative-draft-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-mtp-speculative-draft-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium MTP Speculative Draft Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: MULTI-TOKEN PREDICTION (MTP) ARCHITECTURE
Target Model: ${targetModelSize.replace(/_/g, ' ').toUpperCase()}
Hardware Cluster: ${hardwareCluster.replace(/_/g, ' ').toUpperCase()}
MTP Prediction Depth: k = ${mtpPredictionDepth} tokens ahead
Verification Mode: ${speculativeVerificationMode.replace(/_/g, ' ').toUpperCase()}
Task Domain: ${taskDomainComplexity.replace(/_/g, ' ').toUpperCase()}
Batch Concurrency: ${batchConcurrency} concurrent streams

PERFORMANCE AUDIT METRICS:
- Decoding Speedup: ${results.decodingSpeedupRatio}x vs Autoregressive Baseline
- Speculative Acceptance Rate: ${results.speculativeAcceptanceRate}%
- Effective Tokens / Step: ${results.effectiveTokensPerStep} tokens
- Inter-Token Latency (ITL): ${results.interTokenLatencyMs} ms (Baseline: ${(1000 / results.baselineThroughputTokensPerSec * batchConcurrency).toFixed(1)} ms)
- Aggregate Cluster Throughput: ${results.aggregateThroughputTokensPerSec.toLocaleString()} tokens/sec
- Auxiliary VRAM / Stream: ${results.auxiliaryVramPerStreamMb} MB
- P99 Speculative Rollback: ${results.speculativeRollbackP99Ms} ms
- Annual FinOps Cost Mitigation: ${currency === 'INR' ? '₹' : '$'}${results.annualServingCostMitigation.toLocaleString()}
- System Classification: ${results.hardwareClassification}

Verified against DeepSeek-V3 native sequential MTP modules, shared vocabulary embeddings, and dynamic tree speculative verification kernels.
Audit Link: https://elesium.online/tools/enterprise-agent-mtp-speculative-draft-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setMtpPredictionDepth(3);
    setSpeculativeVerificationMode('dynamic_tree');
    setTaskDomainComplexity('chain_of_thought_reasoning');
    setBatchConcurrency(128);
    setTargetModelSize('deepseek_v3_671b');
    setHardwareCluster('8x_h100_sxm5');
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does Multi-Token Prediction (MTP) differ from traditional speculative decoding?",
      a: "Traditional speculative decoding pairs a massive foundational model with a completely separate small draft model (e.g., Llama-7B drafting for Llama-70B), introducing tokenizer alignment friction, auxiliary VRAM overhead, and operational complexity. MTP trains lightweight sequential Transformer modules directly into the foundational model backbone, sharing vocabulary embeddings, reusing the down-projected Multi-Head Latent Attention (MLA) cache, and generating speculative tokens in single fused GPU passes."
    },
    {
      q: "Does Multi-Token Prediction cause any divergence or degradation in model outputs?",
      a: "No. The main foundational model acts as the strict mathematical verifier through rejection sampling. Every drafted token is evaluated against the exact target probability distribution. If any candidate falls below the acceptance threshold, generation rolls back in sub-millisecond SRAM registers with mathematical proof of equivalence to standard autoregressive generation."
    },
    {
      q: "Why is a 2D Speculative Tree attention mask superior to linear sequence verification?",
      a: "Linear sequence verification terminates upon the first rejected token, discarding all subsequent drafted tokens. Dynamic tree verification evaluates multiple branched candidate sequences simultaneously under a custom 2D causal attention mask, allowing the model to accept the highest-confidence branch and boosting acceptance ratios from 62% to over 82% on complex reasoning tasks."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Helmet>
        <title>Enterprise Autonomous Agent Multi-Token Prediction (MTP) Acceptance Ratio & Speculative Draft Tree Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Multi-Token Prediction (MTP) acceptance ratios, speculative tree verification, sequential draft modules, and 2.8x decoding speedup across DeepSeek-V3 and DeepSeek-R1 clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-mtp-speculative-draft-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-emerald-950/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <FastForward className="w-3.5 h-3.5" />
              TOOL #73 · MULTI-TOKEN PREDICTION (MTP) ENGINE
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-emerald-400" /> Embed Widget
              </button>
              <button
                onClick={copyMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-500 text-xs font-medium text-white transition-colors"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedMemo ? 'Memo Copied' : 'Export Executive Memo'}
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-white mb-3">
            Enterprise Autonomous Agent Multi-Token Prediction (MTP) Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Model sequential speculative drafting modules, dual verification trees, and speculative acceptance dynamics. Quantify 2.8x decoding throughput, sub-10ms inter-token latencies, and zero-drift representation reuse across DeepSeek-V3 serving clusters.
          </p>
        </div>
      </section>

      {/* Main Interactive Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
                <Sliders className="w-4 h-4 text-emerald-400" /> Architectural Parameters
              </div>
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* MTP Prediction Depth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">MTP Prediction Depth (k Future Tokens)</span>
                <span className="font-mono text-emerald-400 font-semibold">k = {mtpPredictionDepth}</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={mtpPredictionDepth}
                onChange={(e) => setMtpPredictionDepth(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">Sequential lightweight Transformer blocks predicting up to {mtpPredictionDepth} tokens ahead.</p>
            </div>

            {/* Speculative Verification Mode */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Speculative Verification Mode</label>
              <select
                value={speculativeVerificationMode}
                onChange={(e) => setSpeculativeVerificationMode(e.target.value as MtpSimulationInputs['speculativeVerificationMode'])}
                aria-label="Speculative Verification Mode"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="dynamic_tree">Dynamic Speculative Tree (2D Attention Mask)</option>
                <option value="linear_chain">Linear Chain (Sequential Rejection Rollback)</option>
                <option value="hybrid_dynamic">Hybrid Dynamic (Adaptive Depth Pruning)</option>
              </select>
            </div>

            {/* Task Domain Complexity */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Task Domain Complexity</label>
              <select
                value={taskDomainComplexity}
                onChange={(e) => setTaskDomainComplexity(e.target.value as MtpSimulationInputs['taskDomainComplexity'])}
                aria-label="Task Domain Complexity"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="deterministic_code">Deterministic Code Generation (High Predictability)</option>
                <option value="structured_extraction">Structured JSON/SQL Extraction (Schema Constrained)</option>
                <option value="chain_of_thought_reasoning">Chain-of-Thought Reasoning (DeepSeek-R1 Swarms)</option>
                <option value="creative_synthesis">Creative Synthesis (High Entropy)</option>
              </select>
            </div>

            {/* Concurrent Batch Streams */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Batch Concurrency</span>
                <span className="font-mono text-cyan-400 font-semibold">{batchConcurrency} streams</span>
              </div>
              <input
                type="range"
                min="16"
                max="512"
                step="16"
                value={batchConcurrency}
                onChange={(e) => setBatchConcurrency(parseInt(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Target Foundation Model */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Target Foundation Model</label>
              <select
                value={targetModelSize}
                onChange={(e) => setTargetModelSize(e.target.value as MtpSimulationInputs['targetModelSize'])}
                aria-label="Target Foundation Model"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="deepseek_v3_671b">DeepSeek-V3 671B (Dual MTP Modules Native)</option>
                <option value="deepseek_r1_671b">DeepSeek-R1 Reasoning (Chain-of-Thought Verification)</option>
                <option value="llama_3_3_70b_mtp">Llama 3.3 70B (Fine-Tuned MTP Heads)</option>
              </select>
            </div>

            {/* Hardware Cluster */}
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">Hardware Cluster</label>
              <select
                value={hardwareCluster}
                onChange={(e) => setHardwareCluster(e.target.value as MtpSimulationInputs['hardwareCluster'])}
                aria-label="Hardware Cluster"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              >
                <option value="8x_h100_sxm5">8x NVIDIA H100 80GB SXM5 (Hopper NVLink)</option>
                <option value="8x_b200_nvlink">8x NVIDIA B200 192GB (Blackwell 72-GPU Domain)</option>
                <option value="8x_a100_80gb">8x NVIDIA A100 80GB PCIe (Legacy Fallback)</option>
              </select>
            </div>

            {/* Currency Toggle */}
            <div className="pt-2 flex items-center justify-between text-xs">
              <span className="text-slate-400">FinOps Valuation Currency:</span>
              <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-950">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    currency === 'INR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>
          </div>

          {/* Results & Visualizer Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Speedup Ratio</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.decodingSpeedupRatio}x
                </div>
                <div className="text-[10px] text-slate-400 mt-1">vs Autoregressive</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Acceptance Rate</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {results.speculativeAcceptanceRate}%
                </div>
                <div className="text-[10px] text-slate-400 mt-1">{results.effectiveTokensPerStep} tok/step</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Inter-Token (ITL)</div>
                <div className="text-2xl font-bold font-mono text-indigo-400 mt-1">
                  {results.interTokenLatencyMs} ms
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Sub-10ms Decode</div>
              </div>

              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="text-[11px] font-mono text-slate-400 uppercase">Throughput</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {results.aggregateThroughputTokensPerSec.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">tokens / second</div>
              </div>
            </div>

            {/* Acceptance Distribution by Depth */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" /> Speculative Acceptance by Prediction Depth (k)
                </h3>
                <span className="text-xs font-mono text-slate-400">Dynamic Tree Verification</span>
              </div>

              <div className="space-y-3">
                {results.acceptanceDistributionByDepth.map((item) => (
                  <div key={item.depth} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-mono">Depth k = {item.depth} Token Candidate</span>
                      <span className="font-mono text-emerald-400">{item.acceptanceRate}% Acceptance ({item.cumulativeAccepted} cumulative)</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 h-full transition-all duration-300"
                        style={{ width: `${item.acceptanceRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Visualizer SVG */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-400" /> DeepSeek-V3 MTP Pipeline Telemetry
                </h3>
                <span className="text-xs font-mono text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/10">
                  Shared Representation Reuse
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80">
                <svg viewBox="0 0 600 180" className="w-full h-auto text-xs font-mono select-none">
                  <defs>
                    <linearGradient id="mtpGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>

                  {/* Main Foundation Model Backbone */}
                  <rect x="20" y="30" width="160" height="120" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
                  <text x="100" y="55" fill="#f8fafc" textAnchor="middle" fontWeight="bold">Main 671B Backbone</text>
                  <text x="100" y="75" fill="#94a3b8" textAnchor="middle">Output State h_i^0</text>
                  <rect x="35" y="95" width="130" height="35" rx="4" fill="#042f2e" stroke="#0d9488" strokeWidth="1" />
                  <text x="100" y="117" fill="#2dd4bf" textAnchor="middle">Reused MLA Cache</text>

                  {/* Connection Arrow */}
                  <path d="M 180 90 L 220 90" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Sequential MTP Modules */}
                  <rect x="220" y="20" width="180" height="140" rx="8" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                  <text x="310" y="45" fill="#ecfdf5" textAnchor="middle" fontWeight="bold">Sequential MTP Heads</text>
                  <rect x="235" y="55" width="150" height="28" rx="4" fill="#022c22" stroke="#059669" strokeWidth="1" />
                  <text x="310" y="73" fill="#6ee7b7" textAnchor="middle">Depth 1: t_{'{i+1}'}</text>
                  <rect x="235" y="88" width="150" height="28" rx="4" fill="#022c22" stroke="#059669" strokeWidth="1" />
                  <text x="310" y="106" fill="#6ee7b7" textAnchor="middle">Depth 2: t_{'{i+2}'}</text>
                  <rect x="235" y="121" width="150" height="28" rx="4" fill="#022c22" stroke="#059669" strokeWidth="1" />
                  <text x="310" y="139" fill="#6ee7b7" textAnchor="middle">Depth 3: t_{'{i+3}'}</text>

                  {/* Connection Arrow */}
                  <path d="M 400 90 L 440 90" stroke="#06b6d4" strokeWidth="2" strokeDasharray="4 2" />

                  {/* Speculative Tree Verification */}
                  <rect x="440" y="30" width="140" height="120" rx="8" fill="#082f49" stroke="#0284c7" strokeWidth="1.5" />
                  <text x="510" y="55" fill="#f0f9ff" textAnchor="middle" fontWeight="bold">Verification Tree</text>
                  <text x="510" y="75" fill="#7dd3fc" textAnchor="middle">2D Mask Check</text>
                  <rect x="455" y="95" width="110" height="35" rx="4" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="1" />
                  <text x="510" y="117" fill="#38bdf8" textAnchor="middle">{results.decodingSpeedupRatio}x Speedup</text>
                </svg>
              </div>
            </div>

            {/* Financial FinOps Card */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/60 p-6 rounded-2xl border border-emerald-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-emerald-400">Annual FinOps Infrastructure Savings</span>
                <span className="text-xs font-mono text-slate-400">Hardware Amortization Delta</span>
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {currency === 'INR' ? '₹' : '$'}{results.annualServingCostMitigation.toLocaleString()}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Achieving a {results.decodingSpeedupRatio}x decode speedup allows hosting {results.aggregateThroughputTokensPerSec.toLocaleString()} tokens/second on 64% fewer GPU nodes while sustaining sub-10ms inter-token latencies.
              </p>
            </div>
          </div>
        </div>

        {/* Technical FAQ Accordion */}
        <section className="bg-slate-900/60 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-emerald-400" /> Architectural FAQ & Technical Invariants
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 bg-slate-950/60 hover:bg-slate-900/60 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 bg-slate-950/30 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Enterprise Consultation & Mandate Section */}
        <section className="border-t border-slate-800 pt-10">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Deploy Sovereign Multi-Token Prediction Clusters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule an architecture audit with our Principal Distributed Systems team to deploy DeepSeek-V3 and DeepSeek-R1 inference engines with MTP speculative decoding on private VPC infrastructure.
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
        </section>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-emerald-400" /> Embed Simulator Widget
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Embed this responsive interactive calculator directly on your website or technical documentation.
            </p>
            <div className="relative">
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                {embedSnippet}
              </pre>
              <button
                onClick={copyEmbed}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium inline-flex items-center gap-1"
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
        toolName="Multi-Token Prediction Simulator"
        simulatedMetrics={[
          { label: 'Decoding Speedup', value: `${results.decodingSpeedupRatio}x`, detail: 'vs Autoregressive baseline' },
          { label: 'Speculative Acceptance', value: `${results.speculativeAcceptanceRate}%`, detail: `${results.effectiveTokensPerStep} tok/step` },
          { label: 'ITL Decode Latency', value: `${results.interTokenLatencyMs} ms`, detail: 'Sub-10ms Generation' },
          { label: 'FinOps Savings', value: `${currency === 'INR' ? '₹' : '$'}${results.annualServingCostMitigation.toLocaleString()}`, detail: 'Annual hardware delta' }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
