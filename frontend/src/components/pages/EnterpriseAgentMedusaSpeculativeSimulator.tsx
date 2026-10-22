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
  Layers,
  Coins,
  CheckCircle2,
  GitBranch,
  Gauge
} from 'lucide-react';
import {
  calculateMedusaSpeculative,
  MedusaSpeculativeInputs,
  SpeculativeEngine,
  TargetModel,
  HardwareCluster
} from '../calculator/agentMedusaSpeculativeModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMedusaSpeculativeSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [speculativeEngine, setSpeculativeEngine] = useState<SpeculativeEngine>('medusa_multi_head');
  const [targetModel, setTargetModel] = useState<TargetModel>('llama_3_70b');
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [treeWidthCandidates, setTreeWidthCandidates] = useState<number>(16);
  const [verificationDepthTokens, setVerificationDepthTokens] = useState<number>(4);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MedusaSpeculativeInputs = useMemo(() => ({
    speculativeEngine,
    targetModel,
    treeWidthCandidates,
    verificationDepthTokens,
    hardwareCluster,
    currency
  }), [
    speculativeEngine,
    targetModel,
    treeWidthCandidates,
    verificationDepthTokens,
    hardwareCluster,
    currency
  ]);

  const outputs = useMemo(() => calculateMedusaSpeculative(inputs), [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-medusa-speculative-tree-simulator" width="100%" height="750" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-medusa-speculative-tree-simulator" target="_blank" rel="noopener" style="color:#f59e0b;text-decoration:underline;">Elesium Medusa Speculative Tree Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyExecutiveMemo = () => {
    const memo = `=== ELESIUM MEDUSA TREE-ATTENTION & SPECULATIVE DECODING SIMULATION ===
Speculative Engine: ${speculativeEngine.replace(/_/g, ' ').toUpperCase()}
Target Model: ${targetModel.replace(/_/g, ' ').toUpperCase()}
Hardware Cluster: ${hardwareCluster.replace(/_/g, ' ').toUpperCase()}
Tree Width Candidates: ${treeWidthCandidates} branches
Verification Depth: ${verificationDepthTokens} tokens ahead
Currency: ${currency}

--- PREDICTED TELEMETRY & HARDWARE GAINS ---
Effective Token Latency: ${outputs.effectivePerTokenLatencyMs} ms/tok
Speedup Multiplier: ${outputs.speedupMultiplier}x vs Autoregressive
Tree Acceptance Rate: ${outputs.treeAcceptanceRatePct}%
Throughput: ${outputs.tokensPerSecondTotal} tok/sec
Annual Cluster Savings: ${outputs.annualClusterSavings}
Speculation Status: ${outputs.speculationStatus}

Generated via Elesium Autonomous Agent Systems (https://elesium.online)`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: 'How does Medusa tree-attention achieve sub-15ms token latency without auxiliary models?',
      a: 'Standard speculative decoding requires loading two separate models (a draft model and a target model) into GPU memory, causing cross-model KV-cache overhead. Medusa adds several lightweight feed-forward decoding heads directly onto the base model. Using a 2D tree-attention mask, it proposes a tree of candidate tokens and evaluates all branches simultaneously in a single forward pass, yielding 2x to 3x speedups with zero auxiliary model VRAM usage.'
    },
    {
      q: 'Does speculative decoding cause accuracy degradation or hallucinations?',
      a: 'No. Speculative decoding uses exact mathematical rejection sampling (Leviathan et al., 2023). Every candidate token proposed by Medusa heads is verified by the target model against its exact probability distribution. If rejected, the token is resampled from the residual distribution. The final output is mathematically identical to standard autoregressive decoding.'
    },
    {
      q: 'How does candidate tree width impact GPU tensor core utilization?',
      a: 'Autoregressive decoding is memory-bandwidth bound because reading 70B weights for 1 token underutilizes GPU tensor cores. In speculative tree decoding, verifying 16 candidate tokens in parallel increases arithmetic intensity to match GPU matrix compute saturation. The forward pass takes virtually the same time as 1 token, but emits 2 to 4 tokens per pass.'
    },
    {
      q: 'Can this architecture be deployed in on-premise private VPCs under Indian DPDP Act 2023?',
      a: 'Yes. Medusa and Eagle speculative kernels can be compiled into TensorRT-LLM and vLLM engines running entirely on air-gapped on-premise NVIDIA H100 and A100 servers in Indian datacenters. All tokens and KV caches remain inside the corporate firewall, satisfying 100% of DPDP Act 2023 and RBI data residency mandates.'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Medusa Speculative Tree-Attention &amp; Verification Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Medusa multi-head tree-attention, speculative decoding verification kernels, candidate tree pruning, and sub-15ms token latencies across enterprise GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-medusa-speculative-tree-simulator" />
      </Helmet>

      <div className="min-h-screen bg-[#05070a] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-400 text-xs font-mono mb-4">
              <Zap className="w-3.5 h-3.5" />
              <span>Tool #49 • Medusa Multi-Head Tree-Attention Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              Medusa Speculative Tree-Attention &amp; Verification Simulator
            </h1>
            <p className="text-base text-slate-400 max-w-3xl mx-auto">
              Simulate candidate token tree generation, parallel verification kernels, rejection sampling acceptance rates, and sub-15ms per-token latencies across enterprise H100 and A100 clusters.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            {/* Left Controls Column */}
            <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  <span>Speculative Tree Parameters</span>
                </div>
                <div className="flex items-center bg-slate-800/80 rounded-lg p-1 border border-slate-700/60">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'INR' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 text-xs font-mono rounded ${currency === 'USD' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Tree Width Candidates */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                    <span>Candidate Tree Width (Parallel Branches)</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {treeWidthCandidates} branches
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={treeWidthCandidates}
                  onChange={(e) => setTreeWidthCandidates(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Slider 2: Verification Depth */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Verification Depth (Tokens Ahead)</span>
                  </label>
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    {verificationDepthTokens} tokens
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={verificationDepthTokens}
                  onChange={(e) => setVerificationDepthTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              {/* Selector 1: Speculative Engine */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Speculative Architecture Engine
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'medusa_multi_head', label: 'Medusa Heads', sub: 'Multi-token prediction' },
                    { id: 'eagle_recurrent_tree', label: 'Eagle Recurrent', sub: 'Feature-level tree' },
                    { id: 'draft_model_distilled', label: 'Draft Model', sub: 'Auxiliary small LLM' },
                    { id: 'prompt_lookup_ngram', label: 'Prompt Lookup', sub: 'N-gram string match' }
                  ].map((eng) => (
                    <button
                      key={eng.id}
                      onClick={() => setSpeculativeEngine(eng.id as SpeculativeEngine)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        speculativeEngine === eng.id
                          ? 'bg-amber-950/50 border-amber-500/80 text-white shadow-sm shadow-amber-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{eng.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{eng.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 2: Target Model */}
              <div className="mb-6">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Target Sovereign LLM Verifier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'llama_3_70b', label: 'Llama-3 70B', sub: 'AWQ 4-Bit Sovereign' },
                    { id: 'deepseek_r1_671b', label: 'DeepSeek R1', sub: 'TP 8-way Reasoning' },
                    { id: 'mistral_large_123b', label: 'Mistral Large', sub: '123B Dense Verifier' },
                    { id: 'qwen_2_5_72b', label: 'Qwen-2.5 72B', sub: 'Code & Math Tuned' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setTargetModel(m.id as TargetModel)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        targetModel === m.id
                          ? 'bg-amber-950/50 border-amber-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{m.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{m.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector 3: Hardware Cluster */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  GPU Verification Cluster
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'nvidia_h100_sxm5', label: 'NVIDIA H100', sub: '80GB SXM5 (3.35 TB/s)' },
                    { id: 'nvidia_a100_pcie', label: 'NVIDIA A100', sub: '80GB PCIe (2.03 TB/s)' },
                    { id: 'nvidia_l40s_ada', label: 'NVIDIA L40S', sub: '48GB Ada (860 GB/s)' },
                    { id: 'nvidia_rtx_4090', label: 'RTX 4090', sub: '24GB Local Enclave' }
                  ].map((hw) => (
                    <button
                      key={hw.id}
                      onClick={() => setHardwareCluster(hw.id as HardwareCluster)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition ${
                        hardwareCluster === hw.id
                          ? 'bg-amber-950/50 border-amber-500/80 text-white'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-semibold text-slate-200">{hw.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{hw.sub}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Telemetry Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Primary Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Effective Token Latency</span>
                    <Zap className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-amber-400">
                    {outputs.effectivePerTokenLatencyMs} ms
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Throughput: <span className="text-slate-200 font-mono">{outputs.tokensPerSecondTotal} tok/s</span>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Speedup Acceleration</span>
                    <Gauge className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    {outputs.speedupMultiplier}x
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    vs Vanilla Autoregressive Baseline
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Tree Acceptance Rate</span>
                    <GitBranch className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-cyan-400">
                    {outputs.treeAcceptanceRatePct}%
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Rejection sampling verification fidelity
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Annual Compute Savings</span>
                    <Coins className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-purple-400">
                    {outputs.annualClusterSavings}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    3x higher throughput per GPU node
                  </div>
                </div>
              </div>

              {/* Tree Verification Trace Breakdown */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-amber-400" />
                  <span>Speculative Tree Verification Trace by Depth</span>
                </h3>
                <div className="space-y-2.5">
                  {outputs.treeTrace.map((tr) => (
                    <div
                      key={tr.depth}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                          <span>Depth {tr.depth} (Token t+{tr.depth})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Proposed: {tr.tokensProposed} branches • Accepted: {tr.tokensAccepted} tokens ({tr.acceptancePct}%)
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        tr.status === 'VERIFIED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        tr.status === 'BRANCH_PRUNED' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
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
                  className="px-4 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
                >
                  {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedMemo ? 'Copied Telemetry Memo!' : 'Copy Executive Audit Memo'}</span>
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
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition"
                >
                  <Code className="w-4 h-4 text-amber-400" />
                  <span>Embed Calculator on Your Site</span>
                </button>
              </div>
            </div>
          </div>

          {/* Consultation Lead Magnet */}
          <div className="mb-14">
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

          {/* Technical FAQ */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 sm:p-8 mb-12">
            <h2 className="text-xl font-bold text-white mb-6">
              Frequently Asked Technical Questions: Medusa Tree-Attention &amp; Speculative Decoding
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/40"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 text-sm font-semibold text-slate-200 flex justify-between items-center hover:text-amber-400 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openFaq === idx ? 'rotate-180 text-amber-400' : 'text-slate-500'}`} />
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
                  className="w-full p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-amber-400 mb-4 focus:outline-none"
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
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition"
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
            toolName="Medusa Speculative Tree-Attention Simulator"
            simulatedMetrics={[
              { label: 'Token Latency', value: `${outputs.effectivePerTokenLatencyMs} ms` },
              { label: 'Speedup Gain', value: `${outputs.speedupMultiplier}x` },
              { label: 'Tree Acceptance', value: `${outputs.treeAcceptanceRatePct}%` },
              { label: 'Annual Savings', value: outputs.annualClusterSavings }
            ]}
          />
        </div>
      </div>
          <WhatsAppModal />
    </>
  );
}
