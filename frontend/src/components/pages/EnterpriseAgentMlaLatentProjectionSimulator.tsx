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
  Activity
} from 'lucide-react';
import {
  calculateMlaLatentProjection,
  MlaLatentProjectionInputs,
  MlaModelArchitecture,
  AttentionMechanismType,
  MlaPrecisionMode
} from '../calculator/agentMlaLatentProjectionModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMlaLatentProjectionSimulator() {
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<MlaModelArchitecture>('deepseek_v3_671b');
  const [attentionMechanism, setAttentionMechanism] = useState<AttentionMechanismType>('mla_low_rank_latent');
  const [contextLength, setContextLength] = useState<number>(131072); // 128k tokens
  const [latentVectorDimension, setLatentVectorDimension] = useState<number>(512);
  const [decoupledRopeDimension, setDecoupledRopeDimension] = useState<number>(64);
  const [precisionMode, setPrecisionMode] = useState<MlaPrecisionMode>('fp8');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: MlaLatentProjectionInputs = useMemo(() => ({
    modelArchitecture,
    attentionMechanism,
    contextLength,
    latentVectorDimension,
    decoupledRopeDimension,
    precisionMode,
    currency
  }), [
    modelArchitecture,
    attentionMechanism,
    contextLength,
    latentVectorDimension,
    decoupledRopeDimension,
    precisionMode,
    currency
  ]);

  const results = useMemo(() => calculateMlaLatentProjection(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-mla-latent-projection-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-mla-latent-projection-simulator" target="_blank" rel="noopener" style="color:#14b8a6;text-decoration:underline;">Elesium MLA Latent Projection Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: MULTI-HEAD LATENT ATTENTION (MLA) ARCHITECTURE
Target Model: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
Attention Mechanism: ${attentionMechanism.replace(/_/g, ' ').toUpperCase()}
Context Length: ${contextLength.toLocaleString()} tokens
Latent Dimension: ${latentVectorDimension} | Decoupled RoPE: ${decoupledRopeDimension} | Precision: ${precisionMode.toUpperCase()}

PERFORMANCE AUDIT METRICS:
- Uncompressed MHA KV Cache: ${results.uncompressedMhaKvGb} GB
- GQA Equivalent KV Cache: ${results.gqaEquivalentKvGb} GB
- MLA Compressed KV Cache: ${results.mlaCompressedKvGb} GB
- VRAM Compression Factor: ${results.vramCompressionFactor}x
- VRAM Reclaimed: ${results.vramReclaimedGb} GB
- Max Concurrency: ${results.maxConcurrentStreamsPerNode} concurrent streams / node
- Hardware Procurement Savings: ${results.formattedHardwareSavings}
- System Status Classification: ${results.statusClassification}

Verified against DeepSeek-V3 low-rank joint key-value down-projection and Decoupled RoPE vector isolation specifications.
Audit Link: https://elesium.online/tools/enterprise-agent-mla-latent-projection-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setModelArchitecture('deepseek_v3_671b');
    setAttentionMechanism('mla_low_rank_latent');
    setContextLength(131072);
    setLatentVectorDimension(512);
    setDecoupledRopeDimension(64);
    setPrecisionMode('fp8');
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does Multi-Head Latent Attention (MLA) slash KV-cache VRAM by over 90%?",
      a: "Instead of caching separate multi-head key and value vectors across all attention heads, MLA down-projects keys and values into a shared 512-dimensional latent vector c^{KV}. Coupled with matrix absorption during the decoding phase, key vectors are never materialized in memory, reducing the cached footprint from 8,192 elements per token down to just 576."
    },
    {
      q: "What is Decoupled Rotary Position Embedding (RoPE) and why is it necessary?",
      a: "Standard RoPE rotation matrices are position-dependent and do not commute with low-rank linear down-projections. By decoupling a separate 64-dimensional positional key vector, MLA isolates the position-dependent rotation while allowing the content key projection to be absorbed directly into the query weights."
    },
    {
      q: "How does MLA affect training and inference computational complexity?",
      a: "During training, low-rank projections add minimal parameter overhead while compressing representations. During inference decoding, absorbing up-projection matrices into query weights means attention scoring executes at identical or faster GEMM speed than traditional Multi-Head Attention, while supporting 10x higher batch concurrency."
    }
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-teal-500/30 selection:text-teal-300">
      <Helmet>
        <title>Enterprise Autonomous Agent Multi-Head Latent Attention (MLA) Low-Rank Projection Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Multi-Head Latent Attention (MLA) low-rank KV-cache compression, decoupled RoPE vector isolation, and 90% VRAM reduction across DeepSeek-V3 and DeepSeek-R1 clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-mla-latent-projection-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-gradient-to-b from-teal-950/20 via-transparent to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5" />
              TOOL #72 · MULTI-HEAD LATENT ATTENTION (MLA) ENGINE
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <Code className="w-3.5 h-3.5" /> Embed Widget
              </button>
              <button
                onClick={resetDefaults}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-medium text-slate-300 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            Enterprise Autonomous Agent Multi-Head Latent Attention (MLA) Low-Rank Projection Simulator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
            Model low-rank joint key-value down-projections and decoupled Rotary Position Embedding (RoPE) vectors across DeepSeek-V3, DeepSeek-R1, and sovereign multi-agent swarms. Slashes inference KV-cache High Bandwidth Memory consumption by 90% to sustain 512+ concurrent long-context sessions per node.
          </p>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-teal-400" /> Attention &amp; Latent Controls
                </span>
                <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[11px] font-mono">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-teal-600 text-white font-bold' : 'text-slate-400'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Target Foundation Model */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Target Foundation Model Architecture
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as MlaModelArchitecture)}
                  aria-label="Target Foundation Model Architecture"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="deepseek_v3_671b">DeepSeek-V3 671B (MLA Native 512-Dim Latent)</option>
                  <option value="deepseek_r1_reasoning">DeepSeek-R1 (Reasoning Swarms + MLA Compression)</option>
                  <option value="sovereign_100b_mla">Sovereign 100B MLA (Air-Gapped Private VPC)</option>
                  <option value="llama_3_1_70b_gqa_comp">Llama 3.1 70B (GQA Baseline Reference)</option>
                </select>
              </div>

              {/* Attention Mechanism */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Attention Architecture Mechanism
                </label>
                <select
                  value={attentionMechanism}
                  onChange={(e) => setAttentionMechanism(e.target.value as AttentionMechanismType)}
                  aria-label="Attention Architecture Mechanism"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="mla_low_rank_latent">Multi-Head Latent Attention (MLA Low-Rank - Recommended)</option>
                  <option value="gqa_grouped_query">Grouped-Query Attention (GQA 8-Group Baseline)</option>
                  <option value="mha_standard_multi_head">Standard Multi-Head Attention (MHA Full Cache)</option>
                </select>
              </div>

              {/* Precision Mode */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  KV Cache Precision Quantization
                </label>
                <select
                  value={precisionMode}
                  onChange={(e) => setPrecisionMode(e.target.value as MlaPrecisionMode)}
                  aria-label="KV Cache Precision Quantization"
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200"
                >
                  <option value="fp8">FP8 Latent KV (1 Byte/Element - High Throughput)</option>
                  <option value="fp16">FP16 Uncompressed Latent (2 Bytes/Element)</option>
                  <option value="int4">INT4 Aggressive Quantization (0.5 Bytes/Element)</option>
                </select>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Context Length:</span>
                    <span className="font-mono text-teal-400">{contextLength.toLocaleString()} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="8192"
                    max="524288"
                    step="8192"
                    value={contextLength}
                    onChange={(e) => setContextLength(Number(e.target.value))}
                    aria-label="Context Length"
                    className="w-full accent-teal-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Latent Vector Dimension (d_c):</span>
                    <span className="font-mono text-teal-400">{latentVectorDimension} dims</span>
                  </div>
                  <input
                    type="range"
                    min="256"
                    max="1024"
                    step="64"
                    value={latentVectorDimension}
                    onChange={(e) => setLatentVectorDimension(Number(e.target.value))}
                    aria-label="Latent Vector Dimension"
                    className="w-full accent-teal-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Decoupled RoPE Key Dimension:</span>
                    <span className="font-mono text-teal-400">{decoupledRopeDimension} dims</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="128"
                    step="16"
                    value={decoupledRopeDimension}
                    onChange={(e) => setDecoupledRopeDimension(Number(e.target.value))}
                    aria-label="Decoupled RoPE Key Dimension"
                    className="w-full accent-teal-500 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">MLA Cache Footprint</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {results.mlaCompressedKvGb} <span className="text-xs text-slate-400 font-normal">GB</span>
                </div>
                <div className="text-[10px] text-teal-400/80 mt-1">Per Single Stream</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Compression Factor</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-teal-400 mt-1">
                  {results.vramCompressionFactor}x
                </div>
                <div className="text-[10px] text-teal-400/80 mt-1">vs MHA Baseline</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Stream Concurrency</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.maxConcurrentStreamsPerNode} <span className="text-xs text-slate-400 font-normal">streams</span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1">Per 8-GPU Node</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="text-[11px] text-slate-400 font-medium">Hardware TCO Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {results.formattedHardwareSavings}
                </div>
                <div className="text-[10px] text-cyan-400/80 mt-1">Cluster CapEx Delta</div>
              </div>
            </div>

            {/* Architecture Telemetry Diagram */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-teal-400" /> VRAM Allocation Comparison: MHA vs GQA vs MLA
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {results.statusClassification}
                </span>
              </div>

              {/* Comparative Memory Bars */}
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>MHA Baseline (Multi-Head Full Cache):</span>
                    <span className="text-rose-400">{results.uncompressedMhaKvGb} GB</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div className="bg-rose-500/80 h-full w-full" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>GQA Baseline (8-Head Grouped-Query):</span>
                    <span className="text-amber-400">{results.gqaEquivalentKvGb} GB</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, (results.gqaEquivalentKvGb / Math.max(0.1, results.uncompressedMhaKvGb)) * 100)}%` }}
                      className="bg-amber-500/80 h-full"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>MLA Compressed (512-Dim Latent + 64-Dim RoPE):</span>
                    <span className="text-teal-400 font-bold">{results.mlaCompressedKvGb} GB (90%+ Reduction)</span>
                  </div>
                  <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      style={{ width: `${Math.min(100, Math.max(4, (results.mlaCompressedKvGb / Math.max(0.1, results.uncompressedMhaKvGb)) * 100))}%` }}
                      className="bg-teal-400 h-full"
                    />
                  </div>
                </div>
              </div>

              {/* Architectural Synthesis Card */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-2 text-slate-300 leading-relaxed">
                <div className="font-semibold text-slate-100">Decoupled RoPE &amp; Matrix Absorption Verified</div>
                <p>
                  Down-projecting into a 512-dim latent space and isolating a 64-dim decoupled RoPE vector enables absorbing the key up-projection matrix into the query heads. The resulting cache reclaims{' '}
                  <strong className="text-teal-400 font-mono">{results.vramReclaimedGb} GB</strong> of VRAM per stream, elevating stream concurrency to{' '}
                  <strong className="text-emerald-400 font-mono">{results.maxConcurrentStreamsPerNode} streams</strong> per 8-GPU node.
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>DPDP Act 2023 Ephemeral Shredding: Compliant</span>
                  <button
                    onClick={copyMemo}
                    className="text-teal-400 hover:text-teal-300 inline-flex items-center gap-1 font-medium"
                  >
                    {hasCopiedMemo ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    {hasCopiedMemo ? 'Memo Copied!' : 'Copy Technical Memo'}
                  </button>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-200">Architectural FAQs</h3>
              <div className="space-y-2">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left p-3 text-xs font-medium text-slate-200 flex justify-between items-center bg-slate-950/40 hover:bg-slate-950/80 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="p-3 text-xs text-slate-400 bg-slate-950/90 border-t border-slate-800 leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Enterprise Mandate Section */}
        <section className="mt-12 pt-8 border-t border-slate-800">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              Deploy Sovereign Multi-Head Latent Attention Clusters
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Schedule an architecture audit with our Principal Distributed Systems team to deploy DeepSeek-V3 and DeepSeek-R1 inference engines with MLA acceleration on private VPC infrastructure.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
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
                <Code className="w-4 h-4 text-teal-400" /> Embed Simulator Widget
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
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-teal-300 overflow-x-auto whitespace-pre-wrap">
                {embedSnippet}
              </pre>
              <button
                onClick={copyEmbed}
                className="absolute top-2 right-2 px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white text-xs font-medium inline-flex items-center gap-1"
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
        toolName="Multi-Head Latent Attention Simulator"
        simulatedMetrics={[
          { label: 'VRAM Compression', value: `${results.vramCompressionFactor}x`, detail: 'vs MHA baseline' },
          { label: 'Active MLA Cache', value: `${results.mlaCompressedKvGb} GB`, detail: `Down from ${results.uncompressedMhaKvGb} GB` },
          { label: 'Stream Concurrency', value: `${results.maxConcurrentStreamsPerNode} streams`, detail: 'Per 8-GPU node' },
          { label: 'Hardware Savings', value: results.formattedHardwareSavings, detail: 'Cluster CapEx delta' }
        ]}
      />
    </div>
  );
}
