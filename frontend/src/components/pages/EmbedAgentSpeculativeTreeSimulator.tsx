import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateSpeculativeTree,
  SpeculativeTreeInputs,
  SpeculativeModelArchitecture,
  TreeTopology,
  TargetGpuCluster,
  WarpOptimization
} from '../calculator/agentSpeculativeTreeModel';
import { GitFork, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentSpeculativeTreeSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<SpeculativeModelArchitecture>('llama_3_1_70b');
  const [treeTopology, setTreeTopology] = useState<TreeTopology>('dynamic_eagle2_tree');
  const [targetGpuCluster] = useState<TargetGpuCluster>('nvidia_h100_sxm5');
  const [warpOptimization, setWarpOptimization] = useState<WarpOptimization>('warp_aligned_flattening');
  const treeDepth = 4;
  const branchingFactor = 3;
  const dailyTokenVolumeMillions = 50;

  const inputs: SpeculativeTreeInputs = useMemo(() => ({
    modelArchitecture,
    treeTopology,
    treeDepth,
    branchingFactor,
    targetGpuCluster,
    warpOptimization,
    dailyTokenVolumeMillions,
    currency: 'USD'
  }), [
    modelArchitecture,
    treeTopology,
    treeDepth,
    branchingFactor,
    targetGpuCluster,
    warpOptimization,
    dailyTokenVolumeMillions
  ]);

  const results = useMemo(() => calculateSpeculativeTree(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Speculative Verification Tree Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-speculative-tree-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <GitFork className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Speculative Verification Tree Simulator</h2>
            <p className="text-[11px] text-slate-400">Multi-Draft Verification &amp; Warp Alignment</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tool #69
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Target Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as SpeculativeModelArchitecture)}
            aria-label="Target Foundation Model"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="llama_3_1_70b">Llama 3.1 70B (Enterprise Workhorse)</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (Reasoning Swarms)</option>
            <option value="qwen_2_5_72b">Qwen 2.5 72B (Coding &amp; Mathematical Reasoning)</option>
            <option value="sovereign_100b_agent">Sovereign 100B Agent Swarm (Air-Gapped)</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-400 mb-1">Tree Topology</label>
            <select
              value={treeTopology}
              onChange={(e) => setTreeTopology(e.target.value as TreeTopology)}
              aria-label="Tree Topology"
              className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1.5 text-slate-200"
            >
              <option value="dynamic_eagle2_tree">Dynamic Eagle-2 Contextual</option>
              <option value="medusa_4_branch">Medusa Multi-Head (B=4)</option>
              <option value="top_k_pruned_tree">Top-K Pruned Tree</option>
              <option value="sequential_draft_linear">Sequential Linear (Draft γ=5)</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-400 mb-1">Warp Optimization</label>
            <select
              value={warpOptimization}
              onChange={(e) => setWarpOptimization(e.target.value as WarpOptimization)}
              aria-label="Warp Optimization"
              className="w-full bg-slate-900 border border-slate-700/80 rounded px-2 py-1.5 text-slate-200"
            >
              <option value="warp_aligned_flattening">Warp-Aligned Flattening</option>
              <option value="naive_divergent_gemm">Naive Divergent GEMM</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Accepted Tokens/Step</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {results.meanAcceptedTokensPerStep} tok
          </span>
          <span className="text-[10px] text-slate-500 block">vs 1.0 autoregressive</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Inter-Token Latency</span>
          <span className="text-lg font-bold text-cyan-400 font-mono">
            {results.interTokenLatencyMs} ms
          </span>
          <span className="text-[10px] text-slate-500 block">Per-token generation speed</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">Throughput Speedup</span>
          <span className="text-lg font-bold text-indigo-400 font-mono">
            {results.throughputSpeedupMultiplier}x
          </span>
          <span className="text-[10px] text-slate-500 block">Effective node scaling</span>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg">
          <span className="text-[11px] text-slate-400 block">SM Occupancy</span>
          <span className="text-lg font-bold text-amber-400 font-mono">
            {results.smOccupancyPercent}%
          </span>
          <span className="text-[10px] text-slate-500 block">GPU warp alignment</span>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span>Powered by <strong className="text-slate-300">Elesium Architecture</strong></span>
        <a
          href="https://elesium.online/tools/enterprise-agent-speculative-tree-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-0.5"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
