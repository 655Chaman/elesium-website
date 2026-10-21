import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMedusaSpeculative,
  MedusaSpeculativeInputs,
  SpeculativeEngine,
  TargetModel,
  HardwareCluster
} from '../calculator/agentMedusaSpeculativeModel';
import { Zap, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMedusaSpeculativeSimulator() {
  const [speculativeEngine, setSpeculativeEngine] = useState<SpeculativeEngine>('medusa_multi_head');
  const [targetModel, setTargetModel] = useState<TargetModel>('llama_3_70b');
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_h100_sxm5');
  const [treeWidthCandidates, setTreeWidthCandidates] = useState<number>(16);
  const [verificationDepthTokens, setVerificationDepthTokens] = useState<number>(4);

  const inputs: MedusaSpeculativeInputs = useMemo(() => ({
    speculativeEngine,
    targetModel,
    treeWidthCandidates,
    verificationDepthTokens,
    hardwareCluster,
    currency: 'USD'
  }), [
    speculativeEngine,
    targetModel,
    treeWidthCandidates,
    verificationDepthTokens,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateMedusaSpeculative(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Medusa Speculative Decoding &amp; Tree-Attention Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-medusa-speculative-tree-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-950/80 border border-amber-800/60 text-amber-400">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Medusa Speculative Tree Simulator
            </h2>
            <p className="text-[10px] text-slate-400">Multi-Head Tree-Attention &amp; Verification</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-medusa-speculative-tree-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 transition"
        >
          <span>Full Tool</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3.5 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Tree Candidates (Width)</span>
            <span className="font-mono text-amber-400 font-bold">{treeWidthCandidates} branches</span>
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

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Verification Depth (Tokens Ahead)</span>
            <span className="font-mono text-amber-400 font-bold">{verificationDepthTokens} tokens</span>
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

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Speculative Engine</label>
            <select
              value={speculativeEngine}
              onChange={(e) => setSpeculativeEngine(e.target.value as SpeculativeEngine)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="medusa_multi_head">Medusa Heads</option>
              <option value="eagle_recurrent_tree">Eagle Tree</option>
              <option value="draft_model_distilled">Draft Model</option>
              <option value="prompt_lookup_ngram">Prompt Lookup</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Target Model</label>
            <select
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value as TargetModel)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="llama_3_70b">Llama-3 70B</option>
              <option value="deepseek_r1_671b">DeepSeek R1</option>
              <option value="mistral_large_123b">Mistral Large</option>
              <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Hardware Cluster</label>
            <select
              value={hardwareCluster}
              onChange={(e) => setHardwareCluster(e.target.value as HardwareCluster)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="nvidia_h100_sxm5">H100 SXM5</option>
              <option value="nvidia_a100_pcie">A100 PCIe</option>
              <option value="nvidia_l40s_ada">L40S Ada</option>
              <option value="nvidia_rtx_4090">RTX 4090</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outputs Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">Token Latency</div>
          <div className="text-sm sm:text-base font-bold font-mono text-amber-400 mt-0.5">
            {results.effectivePerTokenLatencyMs} ms
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Per Output Token</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">Speedup Gain</div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-0.5">
            {results.speedupMultiplier}x
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">vs Vanilla Autoregressive</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">Tree Acceptance</div>
          <div className="text-sm sm:text-base font-bold font-mono text-cyan-400 mt-0.5">
            {results.treeAcceptanceRatePct}%
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Rejection Sampling Rate</div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span className="text-slate-300 font-mono text-[11px]">{results.speculationStatus}</span>
        </div>
        <span className="text-amber-400 font-mono font-bold text-[11px]">
          {results.annualClusterSavings}
        </span>
      </div>

      {/* Watermark Backlink */}
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        Simulated via{' '}
        <a
          href="https://elesium.online/tools/enterprise-agent-medusa-speculative-tree-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-400 underline hover:text-amber-300"
        >
          Elesium Medusa Speculation Simulator
        </a>
      </div>
    </div>
  );
}
