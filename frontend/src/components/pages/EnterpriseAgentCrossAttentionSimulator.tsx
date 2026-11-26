import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
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
  Network
} from 'lucide-react';
import {
  calculateCrossAttention,
  CrossAttentionInputs,
  ModelArchitecture,
  InterconnectSpeed,
  HardwareCluster
} from '../calculator/agentCrossAttentionModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentCrossAttentionSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [documentCorpusTokens, setDocumentCorpusTokens] = useState<number>(262144);
  const [documentChunkSize, setDocumentChunkSize] = useState<number>(1024);
  const [numGpuNodes, setNumGpuNodes] = useState<number>(4);
  const [interconnectSpeed, setInterconnectSpeed] = useState<InterconnectSpeed>('nvlink_4_900gbps');
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: CrossAttentionInputs = useMemo(() => ({
    modelArchitecture,
    documentCorpusTokens,
    documentChunkSize,
    numGpuNodes,
    interconnectSpeed,
    hardwareCluster,
    currency
  }), [
    modelArchitecture,
    documentCorpusTokens,
    documentChunkSize,
    numGpuNodes,
    interconnectSpeed,
    hardwareCluster,
    currency
  ]);

  const results = useMemo(() => calculateCrossAttention(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-chunked-cross-attention-simulator" width="100%" height="680" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe><div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const memoContent = `=== ENTERPRISE AI ARCHITECTURE MEMO: CHUNKED CROSS-ATTENTION SIMULATION ===
Model Architecture: ${modelArchitecture.toUpperCase().replace(/_/g, ' ')}
Hardware Cluster: ${hardwareCluster.toUpperCase().replace(/_/g, ' ')}
Corpus Volume: ${documentCorpusTokens.toLocaleString()} tokens
Chunk Size: ${documentChunkSize.toLocaleString()} tokens
GPU Nodes: ${numGpuNodes}
Interconnect: ${interconnectSpeed.toUpperCase().replace(/_/g, ' ')}

SIMULATION RESULTS:
- Total Document Shards: ${results.totalShards}
- Shards Per GPU Node: ${results.shardsPerGpu}
- Baseline Concatenated RAG Latency: ${results.baselineConcatenatedRagLatencyMs} ms
- Chunked Cross-Attention Latency: ${results.chunkedCrossAttentionLatencyMs} ms
- Effective Speedup: ${results.speedupMultiplier}x
- VRAM Footprint Reduction: -${results.memoryReductionPercent}%
- Projected Annual FinOps Savings: ${results.annualClusterSavings}
- Production SLA Status: ${results.slaStatus}

SHARD REDUCTION TRACE:
${results.shardReductionTrace.map(s => `* ${s.stage}: ${s.description} -> Latency: ${s.latencyMs}ms, Bandwidth Saturation: ${s.bandwidthSaturationPct}% [${s.status}]`).join('\n')}

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
      q: "What is Chunked Cross-Attention and how does it solve RAG context window blowup?",
      a: "Standard RAG concatenates retrieved documents into the LLM prompt, forcing quadratic self-attention computation over hundreds of thousands of tokens. Chunked cross-attention decouples the query generation pass from retrieved document representations. Document chunks are pre-encoded into static key-value tensor shards distributed across NVLink GPU nodes. The query attends independently to each shard via parallel linear cross-attention, slashing latency by up to 10x."
    },
    {
      q: "How does fused log-sum-exp partial softmax reduction work over NVLink?",
      a: "Each GPU node computes intermediate attention logits and local maximums across its assigned document shards in fast SRAM. Instead of communicating full attention matrices, nodes broadcast compact partial log-sum-exp scalars over NVLink. A fused reduction kernel computes mathematically exact global softmax weights without saturating GPU high-bandwidth memory (HBM)."
    },
    {
      q: "How does document memory sharding improve enterprise multi-agent concurrency?",
      a: "By sharding static document corpora across GPU nodes, multiple concurrent agent streams can query the same underlying document memory simultaneously. Each agent executes a lightweight query projection rather than instantiating an independent million-token KV cache, cutting memory footprint by up to 76% and multiplying cluster request concurrency."
    },
    {
      q: "Can chunked cross-attention be deployed inside an air-gapped private VPC under India DPDP Act 2023?",
      a: "Yes. Elesium deploys sovereign chunked cross-attention serving stacks on dedicated on-premise NVIDIA H100 and Blackwell clusters inside your air-gapped VPC. All document embeddings, KV shards, and query vectors reside strictly within your sovereign boundary, satisfying Section 8 of the Indian DPDP Act 2023 and RBI Cyber Security Framework standards."
    }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-white/20 selection:text-white">
      <Helmet>
        <title>Enterprise Autonomous Agent Chunked Cross-Attention Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate enterprise chunked cross-attention, document memory sharding, tensor parallel NVLink reduction, and sub-second RAG reasoning latency."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-chunked-cross-attention-simulator" />
      </Helmet>

      {/* Hero Header */}
      <section className="relative pt-24 pb-12 border-b border-neutral-800/80 overflow-hidden">
        <div className="absolute inset-0 bg-radial-gradient from-white/[0.03] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-white text-xs font-semibold mb-4 tracking-wide uppercase">
            <FileText className="w-3.5 h-3.5" />
            Tool #53 · Enterprise Retrieval Infrastructure & Compute
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Enterprise Autonomous Agent <span className="text-neutral-400 ">Chunked Cross-Attention</span> & Document Sharding Simulator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
            Model distributed chunked cross-attention kernels, tensor-parallel document memory sharding, and sub-second multi-turn reasoning across massive multi-gigabyte knowledge corpora. Quantify latency acceleration, VRAM compression, and annual cluster FinOps savings.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700 text-neutral-200 text-xs font-medium transition-all shadow-sm"
            >
              <Code className="w-3.5 h-3.5 text-neutral-200" />
              Embed This Simulator
            </button>
            <button
              onClick={handleCopyMemo}
              className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800/90 hover:bg-neutral-700/90 border border-neutral-700 text-neutral-200 text-xs font-medium transition-all shadow-sm"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-neutral-200" /> : <Copy className="w-3.5 h-3.5 text-neutral-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Architecture Memo'}
            </button>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Currency:
              <button
                onClick={() => setCurrency(c => c === 'INR' ? 'USD' : 'INR')}
                className="active:scale-[0.97] font-bold text-white hover:text-white transition-colors ml-1"
              >
                {currency}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-800 mb-6">
                <Sliders className="w-4 h-4 text-neutral-200" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                  Simulation Parameters
                </h2>
              </div>

              {/* Model Architecture */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-neutral-300 flex justify-between">
                  <span>Generative Architecture</span>
                  <span className="text-neutral-200 font-mono text-[11px]">
                    {modelArchitecture === 'deepseek_r1_671b' ? 'DeepSeek-R1 (MLA)' : 'Llama-3 / Qwen'}
                  </span>
                </label>
                <select
                  value={modelArchitecture}
                  onChange={e => setModelArchitecture(e.target.value as ModelArchitecture)}
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
                >
                  <option value="llama_3_70b">Llama-3-70B (Dense Generative)</option>
                  <option value="deepseek_r1_671b">DeepSeek-R1-671B (MoE MLA)</option>
                  <option value="qwen_2_5_72b">Qwen-2.5-72B (High Context)</option>
                  <option value="mistral_large_123b">Mistral Large 123B (Dense)</option>
                </select>
              </div>

              {/* Document Corpus Tokens */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-neutral-300">Document Corpus Tokens</span>
                  <span className="font-mono text-white font-bold">{documentCorpusTokens.toLocaleString()} tokens</span>
                </div>
                <input
                  type="range"
                  min="16384"
                  max="1048576"
                  step="16384"
                  value={documentCorpusTokens}
                  onChange={e => setDocumentCorpusTokens(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
                />
                <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
                  <span>16k (Brief)</span>
                  <span>256k (Standard RAG)</span>
                  <span>1M (Enterprise KB)</span>
                </div>
              </div>

              {/* Document Chunk Size */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-neutral-300 flex justify-between">
                  <span>Shard Chunk Size</span>
                  <span className="font-mono text-white font-bold">{documentChunkSize} tokens</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[256, 512, 1024, 2048].map(size => (
                    <button
                      key={size}
                      onClick={() => setDocumentChunkSize(size)}
                      className={`active:scale-[0.97] py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        documentChunkSize === size
                          ? 'bg-white/[0.05] border-white/30 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* GPU Nodes */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-neutral-300 flex justify-between">
                  <span>Active GPU Cluster Nodes</span>
                  <span className="font-mono text-white font-bold">{numGpuNodes} Nodes</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 4, 8, 16].map(nodes => (
                    <button
                      key={nodes}
                      onClick={() => setNumGpuNodes(nodes)}
                      className={`active:scale-[0.97] py-1.5 rounded-lg text-xs font-mono border transition-all ${
                        numGpuNodes === nodes
                          ? 'bg-white/[0.05] border-white/30 text-white font-bold'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      {nodes}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Interconnect Speed */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-semibold text-neutral-300 flex justify-between">
                  <span>Cluster Interconnect Fabric</span>
                  <span className="text-neutral-200 font-mono text-[11px]">
                    {interconnectSpeed === 'nvlink_5_1800gbps' ? '1.8 TB/s NVLink' : '900 GB/s'}
                  </span>
                </label>
                <select
                  value={interconnectSpeed}
                  onChange={e => setInterconnectSpeed(e.target.value as InterconnectSpeed)}
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
                >
                  <option value="nvlink_4_900gbps">NVIDIA NVLink 4 (900 GB/s H100)</option>
                  <option value="nvlink_5_1800gbps">NVIDIA NVLink 5 (1.8 TB/s B200)</option>
                  <option value="pcie_gen5_128gbps">PCIe Gen5 Bus (128 GB/s Standard)</option>
                </select>
              </div>

              {/* Hardware Target */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300 flex justify-between">
                  <span>Hardware Cluster Node</span>
                  <span className="text-neutral-200 font-mono text-[11px]">
                    {hardwareCluster === 'nvidia_h100_sxm5' ? 'SXM5 80GB' : 'Custom'}
                  </span>
                </label>
                <select
                  value={hardwareCluster}
                  onChange={e => setHardwareCluster(e.target.value as HardwareCluster)}
                  className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
                >
                  <option value="nvidia_h100_sxm5">NVIDIA H100 SXM5 (80GB HBM3)</option>
                  <option value="nvidia_b200_nvl">NVIDIA B200 NVL (192GB HBM3e)</option>
                  <option value="nvidia_a100_80gb">NVIDIA A100 (80GB SXM4)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Results & Visualizer Column */}
          <div className="lg:col-span-7 space-y-6">

            {/* Top Scorecard Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                  Total Shards
                </div>
                <div className="mt-1 text-2xl font-black text-neutral-200 font-mono">
                  {results.totalShards}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  {results.shardsPerGpu} shards / GPU node
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                  Speedup Factor
                </div>
                <div className="mt-1 text-2xl font-black text-neutral-200 font-mono">
                  {results.speedupMultiplier}x
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  vs linear self-attention
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                  VRAM Saved
                </div>
                <div className="mt-1 text-2xl font-black text-neutral-200 font-mono">
                  -{results.memoryReductionPercent}%
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Decoupled KV memory
                </div>
              </div>

              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 shadow-sm">
                <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                  FinOps Savings
                </div>
                <div className="mt-1 text-xl font-black text-neutral-200 font-mono">
                  {results.annualClusterSavings}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Annual GPU compute
                </div>
              </div>
            </div>

            {/* Latency Comparison Card */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-6">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-neutral-200" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Query Reasoning Latency Benchmark
                  </h3>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono tracking-wide ${
                  results.slaStatus === 'SUB_100MS_ULTRA_FAST'
                    ? 'bg-white/[0.05] border border-white/15 text-neutral-200'
                    : results.slaStatus === 'SUB_250MS_ACCEPTABLE'
                    ? 'bg-amber-950/80 border border-amber-800/80 text-amber-400'
                    : 'bg-red-950/80 border border-red-800/80 text-red-400'
                }`}>
                  {results.slaStatus.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Baseline */}
                <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4">
                  <div className="text-xs font-semibold text-neutral-400">Baseline Concatenated RAG</div>
                  <div className="text-3xl font-black text-red-400 font-mono mt-1">
                    {results.baselineConcatenatedRagLatencyMs} <span className="text-sm font-medium text-neutral-500">ms</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    Quadratic self-attention over {documentCorpusTokens.toLocaleString()} concatenated tokens induces massive memory bandwidth stalls.
                  </p>
                </div>

                {/* Chunked */}
                <div className="bg-neutral-950/80 border border-white/15 rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-0.5 bg-white/10 text-white text-[10px] font-mono font-bold rounded-bl">
                    {results.speedupMultiplier}x Faster
                  </div>
                  <div className="text-xs font-semibold text-white">Chunked Cross-Attention</div>
                  <div className="text-3xl font-black text-neutral-200 font-mono mt-1">
                    {results.chunkedCrossAttentionLatencyMs} <span className="text-sm font-medium text-neutral-500">ms</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed">
                    Asynchronous linear cross-attention over {results.shardsPerGpu} shards/GPU with fused NVLink log-sum-exp reduction.
                  </p>
                </div>
              </div>
            </div>

            {/* Shard Reduction Pipeline Trace */}
            <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 shadow-xl">
              <div className="flex items-center gap-2 pb-4 border-b border-neutral-800 mb-6">
                <Network className="w-4 h-4 text-neutral-200" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Distributed Shard Execution Pipeline
                </h3>
              </div>

              <div className="space-y-3">
                {results.shardReductionTrace.map((stage, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border transition-all ${
                      stage.status === 'REDUCED'
                        ? 'bg-white/[0.05] border-white/15'
                        : 'bg-white/[0.05] border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          stage.status === 'REDUCED' ? 'bg-white/80' : 'bg-white/80'
                        }`} />
                        <span className="text-xs font-bold text-neutral-200">
                          {stage.stage}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-white/[0.05] text-white">
                        {stage.status}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                      {stage.description}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-neutral-400 font-mono">
                      <span>Latency: <strong className="text-neutral-200">{stage.latencyMs} ms</strong></span>
                      <span>Nodes: <strong className="text-neutral-200">{stage.activeNodes}x Cluster</strong></span>
                      <span>Interconnect Load: <strong className="text-neutral-200">{stage.bandwidthSaturationPct}%</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Technical FAQ Accordion */}
        <section className="mt-16 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-800 mb-6">
            <Sparkles className="w-4 h-4 text-neutral-200" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Chunked Cross-Attention Architecture & Engineering Invariants
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-neutral-800/80 rounded-xl overflow-hidden bg-neutral-950/40"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="active:scale-[0.97] w-full flex items-center justify-between p-4 text-left font-semibold text-xs sm:text-sm text-neutral-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 pt-1 text-xs text-neutral-400 leading-relaxed border-t border-neutral-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Mandate Application Section */}
        <section className="mt-16 bg-neutral-900/90 border border-neutral-800 rounded-xl p-6 sm:p-8 shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/[0.05] border border-white/15 text-white text-xs font-semibold uppercase tracking-wider mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" /> Sovereign RAG Architecture Mandate
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Deploy Distributed Chunked Cross-Attention on Your VPC
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Schedule a technical deployment audit with our Principal AI Systems Architects. Achieve sub-second reasoning over million-token corporate document corpora, 10x throughput, and DPDP Act 2023 compliance.
            </p>
          </div>
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
        </section>

      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="active:scale-[0.97] absolute top-4 right-4 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-white mb-2">Embed This Simulator</h3>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Copy this lightweight iframe snippet to embed the live simulator on your internal developer documentation, Notion portal, or engineering blog.
            </p>
            <textarea
              readOnly
              value={embedSnippet}
              className="w-full h-32 bg-neutral-950 border border-neutral-800 rounded-lg p-3 text-[11px] font-mono text-neutral-300 focus:outline-none focus:border-white/40 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="active:scale-[0.97] px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold shadow-md"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal */}
      <ExitIntentMemoModal
        toolName="Enterprise Autonomous Agent Chunked Cross-Attention Simulator"
        simulatedMetrics={[
          { label: 'Total Shards', value: `${results.totalShards}` },
          { label: 'Speedup Factor', value: `${results.speedupMultiplier}x` },
          { label: 'Chunked Latency', value: `${results.chunkedCrossAttentionLatencyMs} ms` },
          { label: 'VRAM Saved', value: `-${results.memoryReductionPercent}%` },
          { label: 'FinOps Savings', value: results.annualClusterSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
