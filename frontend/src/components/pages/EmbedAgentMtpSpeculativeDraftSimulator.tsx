import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMtpSimulation,
  MtpSimulationInputs
} from '../calculator/agentMtpSpeculativeDraftModel';
import { FastForward, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMtpSpeculativeDraftSimulator() {
  const [mtpPredictionDepth, setMtpPredictionDepth] = useState<number>(3);
  const [speculativeVerificationMode, setSpeculativeVerificationMode] = useState<MtpSimulationInputs['speculativeVerificationMode']>('dynamic_tree');
  const [taskDomainComplexity, setTaskDomainComplexity] = useState<MtpSimulationInputs['taskDomainComplexity']>('chain_of_thought_reasoning');
  const [batchConcurrency, setBatchConcurrency] = useState<number>(128);

  const inputs: MtpSimulationInputs = useMemo(() => ({
    mtpPredictionDepth,
    speculativeVerificationMode,
    taskDomainComplexity,
    batchConcurrency,
    targetModelSize: 'deepseek_v3_671b',
    hardwareCluster: '8x_h100_sxm5',
    currency: 'USD'
  }), [mtpPredictionDepth, speculativeVerificationMode, taskDomainComplexity, batchConcurrency]);

  const results = useMemo(() => calculateMtpSimulation(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Multi-Token Prediction Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-mtp-speculative-draft-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <FastForward className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Multi-Token Prediction Simulator</h2>
            <p className="text-[11px] text-slate-400">Sequential MTP Drafting · Speculative Tree Verification · 2.8x Speedup</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          Tool #73
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 mb-4 text-xs">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>MTP Prediction Depth (k Future Tokens)</span>
            <span className="text-emerald-400 font-mono font-semibold">k = {mtpPredictionDepth}</span>
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
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Speculative Verification Mode</label>
          <select
            value={speculativeVerificationMode}
            onChange={(e) => setSpeculativeVerificationMode(e.target.value as MtpSimulationInputs['speculativeVerificationMode'])}
            aria-label="Speculative Verification Mode"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="dynamic_tree">Dynamic Speculative Tree (2D Attention Mask)</option>
            <option value="linear_chain">Linear Chain (Sequential Rejection Rollback)</option>
            <option value="hybrid_dynamic">Hybrid Dynamic (Adaptive Depth Pruning)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 mb-1">Task Domain Complexity</label>
          <select
            value={taskDomainComplexity}
            onChange={(e) => setTaskDomainComplexity(e.target.value as MtpSimulationInputs['taskDomainComplexity'])}
            aria-label="Task Domain Complexity"
            className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-slate-200"
          >
            <option value="deterministic_code">Deterministic Code Generation (High Predictability)</option>
            <option value="structured_extraction">Structured JSON/SQL Extraction (Schema Constrained)</option>
            <option value="chain_of_thought_reasoning">Chain-of-Thought Reasoning (DeepSeek-R1 Swarms)</option>
            <option value="creative_synthesis">Creative Synthesis (High Entropy)</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Concurrent Batch Streams</span>
            <span className="text-cyan-400 font-mono font-semibold">{batchConcurrency} streams</span>
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
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-mono">
        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Decoding Speedup</div>
          <div className="text-base font-bold text-emerald-400">{results.decodingSpeedupRatio}x</div>
          <div className="text-[10px] text-slate-500">vs Autoregressive</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Speculative Acceptance</div>
          <div className="text-base font-bold text-cyan-400">{results.speculativeAcceptanceRate}%</div>
          <div className="text-[10px] text-slate-500">{results.effectiveTokensPerStep} tok/step</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Inter-Token Latency (ITL)</div>
          <div className="text-base font-bold text-indigo-400">{results.interTokenLatencyMs} ms</div>
          <div className="text-[10px] text-slate-500">Sub-10ms Decode</div>
        </div>

        <div className="bg-slate-900/80 p-2.5 rounded border border-slate-800">
          <div className="text-[10px] text-slate-400">Cluster Throughput</div>
          <div className="text-base font-bold text-amber-400">{results.aggregateThroughputTokensPerSec.toLocaleString()}</div>
          <div className="text-[10px] text-slate-500">tokens / second</div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <span className="font-mono text-emerald-400">DeepSeek-V3 MTP Engine</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-mtp-speculative-draft-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
        >
          Full Simulator <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
