import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateSpeculativeVerification,
  SpeculativeVerificationInputs,
  TargetModel,
  DraftMethod,
  GpuHardware
} from '../calculator/agentSpeculativeVerificationModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentSpeculativeVerificationSimulator() {
  const [targetModel, setTargetModel] = useState<TargetModel>('llama_3_70b');
  const [draftMethod, setDraftMethod] = useState<DraftMethod>('eagle_recurrent');
  const [maxTreeDepth, setMaxTreeDepth] = useState<number>(5);
  const [candidateBranches, setCandidateBranches] = useState<number>(64);
  const pruningThreshold = 0.15;
  const gpuHardware: GpuHardware = 'nvidia_h100_sxm5';

  const inputs: SpeculativeVerificationInputs = useMemo(() => ({
    targetModel,
    draftMethod,
    maxTreeDepth,
    candidateBranches,
    pruningThreshold,
    gpuHardware,
    currency: 'USD'
  }), [
    targetModel,
    draftMethod,
    maxTreeDepth,
    candidateBranches,
    pruningThreshold,
    gpuHardware
  ]);

  const results = useMemo(() => calculateSpeculativeVerification(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Speculative Verification Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-speculative-verification-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Speculative Verification Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Tree-Based Draft Verification · Sub-8ms Kernel Latency
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          INFERENCE SPEEDUP
        </span>
      </div>

      {/* Controls Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            Target Model
          </label>
          <select
            value={targetModel}
            onChange={(e) => setTargetModel(e.target.value as TargetModel)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
          >
            <option value="llama_3_70b">Llama-3-70B</option>
            <option value="deepseek_v2_236b">DeepSeek-V2-236B</option>
            <option value="qwen_2_5_72b">Qwen-2.5-72B</option>
            <option value="mistral_large_123b">Mistral-Large-123B</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-neutral-400 mb-1">
            Speculative Draft Method
          </label>
          <select
            value={draftMethod}
            onChange={(e) => setDraftMethod(e.target.value as DraftMethod)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white focus:outline-none focus:border-white/40 font-mono"
          >
            <option value="eagle_recurrent">Eagle Recurrent Draft</option>
            <option value="medusa_heads">Medusa Multi-Head</option>
            <option value="spec_exec_tree">SpecExec Tree Mask</option>
            <option value="small_draft_model">Small Draft Model (7B)</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">Tree Candidate Branches</span>
            <span className="text-neutral-200 font-mono">{candidateBranches} Branches</span>
          </div>
          <input
            type="range"
            min="16"
            max="128"
            step="8"
            value={candidateBranches}
            onChange={(e) => setCandidateBranches(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-400">Max Lookahead Depth</span>
            <span className="text-neutral-200 font-mono">{maxTreeDepth} Tokens</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={maxTreeDepth}
            onChange={(e) => setMaxTreeDepth(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Telemetry Output Cards */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
            Speedup Multiplier
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {results.speedupMultiplier}x
          </div>
          <div className="text-[10px] text-neutral-400">
            {results.tokensPerSecond} tok/s
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
            Verify Latency
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {results.verificationLatencyMs} ms
          </div>
          <div className="text-[10px] text-neutral-400">
            sub-8ms SLA met
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
            Acceptance Rate
          </div>
          <div className="text-xl font-bold font-mono text-white">
            {results.averageAcceptanceRate}%
          </div>
          <div className="text-[10px] text-neutral-400">
            {results.meanAcceptedLength} tok/step
          </div>
        </div>

        <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded-lg text-center">
          <div className="text-[10px] text-neutral-400 uppercase tracking-wider mb-0.5">
            FinOps Savings
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {results.annualFinOpsSavings}
          </div>
          <div className="text-[10px] text-neutral-400">
            Pruned: {results.prunedBranchesCount} paths
          </div>
        </div>
      </div>

      {/* Watermark Footer */}
      <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-400">
        <span>Engineered by Elesium Research</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-200 hover:text-white inline-flex items-center gap-1 font-medium transition-colors"
        >
          Deploy Sovereign Agents <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
