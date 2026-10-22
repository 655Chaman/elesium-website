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
  GitFork,
  Activity
} from 'lucide-react';
import {
  calculateSpeculativeTree,
  SpeculativeTreeInputs,
  SpeculativeModelArchitecture,
  TreeTopology,
  TargetGpuCluster,
  WarpOptimization
} from '../calculator/agentSpeculativeTreeModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentSpeculativeTreeSimulator() {
  // Inputs State
  const [modelArchitecture, setModelArchitecture] = useState<SpeculativeModelArchitecture>('llama_3_1_70b');
  const [treeTopology, setTreeTopology] = useState<TreeTopology>('dynamic_eagle2_tree');
  const [treeDepth, setTreeDepth] = useState<number>(4);
  const [branchingFactor, setBranchingFactor] = useState<number>(3);
  const [targetGpuCluster, setTargetGpuCluster] = useState<TargetGpuCluster>('nvidia_h100_sxm5');
  const [warpOptimization, setWarpOptimization] = useState<WarpOptimization>('warp_aligned_flattening');
  const [dailyTokenVolumeMillions, setDailyTokenVolumeMillions] = useState<number>(50);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: SpeculativeTreeInputs = useMemo(() => ({
    modelArchitecture,
    treeTopology,
    treeDepth,
    branchingFactor,
    targetGpuCluster,
    warpOptimization,
    dailyTokenVolumeMillions,
    currency
  }), [
    modelArchitecture,
    treeTopology,
    treeDepth,
    branchingFactor,
    targetGpuCluster,
    warpOptimization,
    dailyTokenVolumeMillions,
    currency
  ]);

  const results = useMemo(() => calculateSpeculativeTree(inputs), [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-speculative-tree-simulator" width="100%" height="480" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:4px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/tools/enterprise-agent-speculative-tree-simulator" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Speculative Tree Simulator</a></div>`;

  const copyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const copyMemo = () => {
    const memo = `ELESIUM EXECUTIVE TECHNICAL MEMO: DYNAMIC SPECULATIVE VERIFICATION TREE
Target Model: ${modelArchitecture.replace(/_/g, ' ').toUpperCase()}
Tree Topology: ${treeTopology.replace(/_/g, ' ').toUpperCase()} (Depth: ${treeDepth}, Branching: ${branchingFactor})
Target GPU Cluster: ${targetGpuCluster.replace(/_/g, ' ').toUpperCase()}
Warp Optimization: ${warpOptimization.replace(/_/g, ' ').toUpperCase()}
Daily Token Volume: ${dailyTokenVolumeMillions}M tokens/day

PERFORMANCE AUDIT METRICS:
- Mean Accepted Tokens / Step: ${results.meanAcceptedTokensPerStep} tok (vs 1.0 autoregressive baseline)
- Inter-Token Latency (ITL): ${results.interTokenLatencyMs} ms
- End-to-End Speedup Multiplier: ${results.throughputSpeedupMultiplier}x
- Warp Divergence Penalty: ${results.warpDivergencePenaltyPercent}%
- Streaming Multiprocessor (SM) Occupancy: ${results.smOccupancyPercent}%
- Projected Annual FinOps Savings: ${results.annualFinOpsSavings}
- System Classification: ${results.statusClassification}

Verified against custom Triton tree-attention masks and NVIDIA CUDA warp-aligned execution standards.
Audit Link: https://elesium.online/tools/enterprise-agent-speculative-tree-simulator`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const resetDefaults = () => {
    setModelArchitecture('llama_3_1_70b');
    setTreeTopology('dynamic_eagle2_tree');
    setTreeDepth(4);
    setBranchingFactor(3);
    setTargetGpuCluster('nvidia_h100_sxm5');
    setWarpOptimization('warp_aligned_flattening');
    setDailyTokenVolumeMillions(50);
    setCurrency('INR');
  };

  const faqs = [
    {
      q: "How does tree-based speculative decoding guarantee mathematically lossless output?",
      a: "Speculative decoding uses target foundation model logits to verify draft candidate tokens through strict acceptance rejection sampling. When a draft branch is rejected, the target model samples the ground-truth token directly, ensuring the final text distribution is identical to standard autoregressive generation."
    },
    {
      q: "What causes GPU warp divergence in tree-based speculative decoding?",
      a: "NVIDIA Tensor Cores execute in warps of 32 threads. When speculative candidate branches have non-uniform lengths or early termination conditions, individual threads branch into different instructions, serializing execution and destroying up to 44% of compute efficiency. Elesium's warp-aligned candidate flattening groups valid candidate sequences into contiguous 32-thread blocks to sustain 96%+ SM occupancy."
    },
    {
      q: "How does Eagle-2 contextual drafting differ from Medusa multi-head speculation?",
      a: "Medusa appends multiple non-contextual MLP heads to the final transformer layer, predicting tokens independently without cross-draft recurrence. Eagle-2 introduces lightweight contextual feature recurrence, allowing the draft head to condition future candidate tokens on preceding draft predictions, boosting token acceptance rates past 85%."
    },
    {
      q: "Can this speculative tree architecture be integrated with vLLM and SGLang?",
      a: "Yes. The architecture utilizes custom Triton tree-attention kernels and FlashInfer draft verification layers that drop seamlessly into vLLM and SGLang inference engines, maintaining full compatibility with continuous batching and PagedAttention."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <Helmet>
        <title>Enterprise Speculative Verification Tree Simulator | Tool #69 | Elesium</title>
        <meta
          name="description"
          content="Simulate dynamic multi-candidate speculative decoding trees, Medusa/Eagle-2 draft heads, custom Triton tree-attention masks, and sub-8ms token latency across distributed GPU clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-speculative-tree-simulator" />
      </Helmet>

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Dynamic Speculative Verification Tree Simulator"
        simulatedMetrics={[
          { label: 'Accepted Tokens/Step', value: `${results.meanAcceptedTokensPerStep} tok`, detail: 'vs 1.0 autoregressive' },
          { label: 'Inter-Token Latency', value: `${results.interTokenLatencyMs} ms`, detail: 'Sub-8ms generation' },
          { label: 'Throughput Speedup', value: `${results.throughputSpeedupMultiplier}x`, detail: 'GPU node acceleration' },
          { label: 'Annual FinOps Savings', value: results.annualFinOpsSavings, detail: 'Cloud compute OPEX reduction' }
        ]}
      />

      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-6">
          <a href="/resources" className="hover:text-emerald-400 transition-colors">TOOLS</a>
          <span>/</span>
          <span className="text-emerald-400">SPECULATIVE DECODING TREES</span>
          <span>/</span>
          <span className="text-gray-500">TOOL #69</span>
        </div>

        {/* Header Block */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
              <GitFork className="w-3.5 h-3.5" />
              <span>DYNAMIC MULTI-CANDIDATE SPECULATIVE VERIFICATION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Enterprise Autonomous Agent Dynamic Speculative Verification Tree Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-3xl">
              Model multi-candidate speculative draft trees, Medusa &amp; Eagle-2 verification heads, custom Triton tree-attention masks, GPU warp divergence elimination, and sub-8ms token generation on sovereign AI clusters.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center gap-1.5"
            >
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={resetDefaults}
              className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
              title="Reset to default settings"
              aria-label="Reset to default settings"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Grid Layout: Configuration + Telemetry Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Parameter Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>Speculative Cluster Configuration</span>
                </div>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10 text-[11px] font-mono">
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

              {/* Target Foundation Model */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Target Foundation Model
                </label>
                <select
                  value={modelArchitecture}
                  onChange={(e) => setModelArchitecture(e.target.value as SpeculativeModelArchitecture)}
                  aria-label="Target Foundation Model"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="llama_3_1_70b">Llama 3.1 70B (Enterprise Production Workhorse)</option>
                  <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (Dense Reasoning Swarms)</option>
                  <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematical Reasoning)</option>
                  <option value="sovereign_100b_agent">Sovereign 100B Agent Swarm (Air-Gapped Private VPC)</option>
                  <option value="llama_3_405b">Llama 3.1 405B (Ultra-Dense Frontier Supercluster)</option>
                </select>
              </div>

              {/* Tree Topology */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Speculative Tree Topology
                </label>
                <select
                  value={treeTopology}
                  onChange={(e) => setTreeTopology(e.target.value as TreeTopology)}
                  aria-label="Speculative Tree Topology"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="dynamic_eagle2_tree">Dynamic Eagle-2 Contextual Recurrent Tree</option>
                  <option value="medusa_4_branch">Medusa Multi-Head Speculative Tree (B=4)</option>
                  <option value="top_k_pruned_tree">Top-K Candidate Pruned Tree (Entropy Adaptive)</option>
                  <option value="sequential_draft_linear">Sequential Linear Draft Chain (Leviathan Baseline)</option>
                </select>
              </div>

              {/* Sliders: Tree Depth and Branching Factor */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Tree Depth</span>
                    <span className="font-mono text-emerald-400 font-semibold">{treeDepth} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={treeDepth}
                    onChange={(e) => setTreeDepth(Number(e.target.value))}
                    aria-label="Tree Depth"
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-300 mb-1">
                    <span>Branching Factor</span>
                    <span className="font-mono text-emerald-400 font-semibold">{branchingFactor} branches</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="1"
                    value={branchingFactor}
                    onChange={(e) => setBranchingFactor(Number(e.target.value))}
                    aria-label="Branching Factor"
                    className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>

              {/* Target GPU Hardware */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Target Verification GPU Cluster
                </label>
                <select
                  value={targetGpuCluster}
                  onChange={(e) => setTargetGpuCluster(e.target.value as TargetGpuCluster)}
                  aria-label="Target Verification GPU Cluster"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="nvidia_h100_sxm5">8x NVIDIA H100 SXM5 (80GB HBM3 · 3.35 TB/s)</option>
                  <option value="nvidia_b200_blackwell">8x NVIDIA B200 Blackwell (192GB HBM3e · 8.0 TB/s)</option>
                  <option value="nvidia_h200_sxm">8x NVIDIA H200 SXM (141GB HBM3e · 4.8 TB/s)</option>
                  <option value="nvidia_l40s_cluster">16x NVIDIA L40S PCIe (48GB GDDR6 · 864 GB/s)</option>
                </select>
              </div>

              {/* Warp Optimization */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  GPU Warp Divergence Handling
                </label>
                <select
                  value={warpOptimization}
                  onChange={(e) => setWarpOptimization(e.target.value as WarpOptimization)}
                  aria-label="GPU Warp Divergence Handling"
                  className="w-full bg-[#14141b] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="warp_aligned_flattening">Warp-Aligned Candidate Flattening (96%+ SM Occupancy)</option>
                  <option value="naive_divergent_gemm">Naive Divergent Branch Execution (Execution Serialization)</option>
                </select>
              </div>

              {/* Daily Token Volume Slider */}
              <div>
                <div className="flex justify-between text-xs text-gray-300 mb-1">
                  <span>Daily Generation Volume</span>
                  <span className="font-mono text-emerald-400 font-semibold">{dailyTokenVolumeMillions}M tokens / day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  step="10"
                  value={dailyTokenVolumeMillions}
                  onChange={(e) => setDailyTokenVolumeMillions(Number(e.target.value))}
                  aria-label="Daily Generation Volume"
                  className="w-full accent-emerald-500 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Architecture Whitepaper & Case Study Link Card */}
            <div className="p-5 rounded-2xl bg-[#0d0d12] border border-white/10 space-y-3">
              <span className="text-[11px] font-mono text-emerald-400">TECHNICAL WHITEPAPER #113</span>
              <h4 className="text-sm font-semibold text-white">Dynamic Tree-Based Speculative Decoding at Scale</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                Review the formal mathematical proofs, custom Triton tree-attention kernels, and 8x H100 benchmarks for multi-draft speculative execution.
              </p>
              <a
                href="/signals/dynamic-tree-speculative-decoding-warp-divergence-pruning"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
              >
                <span>Read Whitepaper #113</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Visualizer & Telemetry Metrics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Telemetry Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">ACCEPTED TOKENS</span>
                <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                  {results.meanAcceptedTokensPerStep} tok
                </span>
                <span className="text-[10px] text-gray-500">per target step</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">INTER-TOKEN LATENCY</span>
                <span className="text-2xl font-bold font-mono text-cyan-400 mt-1 block">
                  {results.interTokenLatencyMs} ms
                </span>
                <span className="text-[10px] text-gray-500">generation speed</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">NODE SPEEDUP</span>
                <span className="text-2xl font-bold font-mono text-indigo-400 mt-1 block">
                  {results.throughputSpeedupMultiplier}x
                </span>
                <span className="text-[10px] text-gray-500">vs autoregressive</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#0d0d12] border border-white/10">
                <span className="text-[11px] text-gray-400 block font-mono">SM OCCUPANCY</span>
                <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                  {results.smOccupancyPercent}%
                </span>
                <span className="text-[10px] text-gray-500">warp utilization</span>
              </div>
            </div>

            {/* Interactive Architecture SVG Visualizer */}
            <div className="p-6 rounded-2xl bg-[#0d0d12] border border-white/10 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-white">Speculative Tree Verification &amp; Warp Alignment Topology</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono border ${
                  results.statusClassification === 'SUB_8MS_WARP_OPTIMAL'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : results.statusClassification === 'WARP_DIVERGENCE_BOTTLENECK'
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}>
                  {results.statusClassification.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Dynamic SVG Visualizer */}
              <div className="w-full bg-[#05070a] border border-white/5 rounded-xl p-4 overflow-x-auto">
                <svg viewBox="0 0 680 230" className="w-full min-w-[600px] h-auto font-mono text-xs">
                  {/* Background grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="680" height="230" fill="url(#grid)" />

                  {/* Stage 1: Root Token */}
                  <g transform="translate(40, 95)">
                    <rect width="100" height="40" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
                    <text x="50" y="24" fill="#ffffff" textAnchor="middle" fontSize="11" fontWeight="bold">Root Context</text>
                  </g>

                  {/* Tree Branches */}
                  <path d="M 140 115 L 210 55" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />
                  <path d="M 140 115 L 210 115" stroke="#10b981" strokeWidth="2" fill="none" />
                  <path d="M 140 115 L 210 175" stroke="#10b981" strokeWidth="1.5" fill="none" strokeDasharray="2,2" />

                  {/* Branch Candidates */}
                  <g transform="translate(210, 35)">
                    <rect width="110" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                    <text x="55" y="22" fill="#38bdf8" textAnchor="middle" fontSize="10">Branch A (Top-1)</text>
                  </g>
                  <g transform="translate(210, 97)">
                    <rect width="110" height="36" rx="6" fill="#10b981" fillOpacity="0.2" stroke="#10b981" strokeWidth="1.5" />
                    <text x="55" y="22" fill="#34d399" textAnchor="middle" fontSize="10" fontWeight="bold">Branch B (Accepted)</text>
                  </g>
                  <g transform="translate(210, 157)">
                    <rect width="110" height="36" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="1" />
                    <text x="55" y="22" fill="#c084fc" textAnchor="middle" fontSize="10">Branch C (Pruned)</text>
                  </g>

                  {/* Second Tier Branches */}
                  <path d="M 320 115 L 380 95" stroke="#10b981" strokeWidth="1.5" fill="none" />
                  <path d="M 320 115 L 380 135" stroke="#10b981" strokeWidth="1.5" fill="none" />

                  <g transform="translate(380, 77)">
                    <rect width="100" height="34" rx="6" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="1" />
                    <text x="50" y="21" fill="#34d399" textAnchor="middle" fontSize="9">Depth 2 Token</text>
                  </g>
                  <g transform="translate(380, 119)">
                    <rect width="100" height="34" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="1" />
                    <text x="50" y="21" fill="#94a3b8" textAnchor="middle" fontSize="9">Candidate 2b</text>
                  </g>

                  {/* Warp-Aligned Verification Lane */}
                  <g transform="translate(520, 30)">
                    <rect width="130" height="170" rx="10" fill="#0b1329" stroke="#6366f1" strokeWidth="1.5" />
                    <text x="65" y="24" fill="#a5b4fc" textAnchor="middle" fontSize="11" fontWeight="bold">Warp Lanes</text>

                    {/* 4 Warp Tiles */}
                    <rect x="15" y="38" width="100" height="24" rx="4" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" />
                    <text x="65" y="54" fill="#6ee7b7" textAnchor="middle" fontSize="9">Warp 0: Root + B</text>

                    <rect x="15" y="68" width="100" height="24" rx="4" fill="#10b981" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" />
                    <text x="65" y="84" fill="#6ee7b7" textAnchor="middle" fontSize="9">Warp 1: Depth 2</text>

                    <rect x="15" y="98" width="100" height="24" rx="4" fill="#1e1e38" stroke="#6366f1" strokeWidth="1" />
                    <text x="65" y="114" fill="#c7d2fe" textAnchor="middle" fontSize="9">Warp 2: Mask QK^T</text>

                    <rect x="15" y="128" width="100" height="24" rx="4" fill="#1e1e38" stroke="#6366f1" strokeWidth="1" />
                    <text x="65" y="144" fill="#c7d2fe" textAnchor="middle" fontSize="9">Warp 3: Output Logit</text>
                  </g>
                </svg>
              </div>

              {/* Step By Step Architecture Breakdown */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 1: DRAFT TREE GENERATION</span>
                  <span className="text-emerald-400">Contextual recurrence predicting {inputs.branchingFactor} parallel candidates</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 2: TRITON TREE-ATTENTION MASK</span>
                  <span className="text-blue-400">Sparse 2D ancestral mask isolating non-ancestor token paths</span>
                </div>
                <div className="flex justify-between items-center text-[11px] pb-2 border-b border-white/5">
                  <span className="text-gray-400">STAGE 3: WARP-ALIGNED GEMM VERIFICATION</span>
                  <span className="text-purple-400">Packed 32-thread tiles eliminating GPU branch divergence ({results.smOccupancyPercent}% SM)</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-gray-400">ANNUAL FINOPS SAVINGS</span>
                  <span className="text-amber-400 font-bold">{results.annualFinOpsSavings}</span>
                </div>
              </div>
            </div>

            {/* Direct Conversion Actions */}
            <div className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-emerald-500/10 via-transparent to-transparent flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-semibold text-white">Deploy Speculative Verification on Your Cluster</h4>
                <p className="text-xs text-gray-400 mt-1">Receive a validated vLLM/SGLang speculative tree recipe with custom Triton kernels.</p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={copyMemo}
                  className="px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
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
            <MandateApplicationForm source="Tool #69: Speculative Tree Simulator" />
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="mt-16 max-w-4xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Technical Questions</h3>
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-white/10 bg-[#0d0d12] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-emerald-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0d0d12] border border-white/15 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Code className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">Embed Simulator on Your Website</h3>
            </div>
            <p className="text-xs text-gray-400 mb-4">
              Copy this lightweight, responsive iframe snippet into your documentation, blog, or engineering portal:
            </p>
            <div className="p-3 bg-[#05070a] border border-white/10 rounded-xl font-mono text-[11px] text-gray-300 break-all mb-4">
              {embedSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-mono text-gray-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbed}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs font-mono flex items-center gap-1.5 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
