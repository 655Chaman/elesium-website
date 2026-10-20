import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Brain,
  Sparkles
} from 'lucide-react';
import {
  simulateAgentMemoryDrift,
  AgentMemoryDriftInputs
} from '../calculator/agentMemoryDriftModel';

export default function EmbedAgentMemoryDriftSimulator() {
  const [monthlyMultiTurnSessions, setMonthlyMultiTurnSessions] = useState<number>(50000);
  const [avgTurnsPerSession, setAvgTurnsPerSession] = useState<number>(30);
  const [tokensPerTurnBaseline, setTokensPerTurnBaseline] = useState<number>(750);
  const [costPerMillionTokensUSD] = useState<number>(3.50);
  const [memoryRetentionWindowTurns] = useState<number>(40);

  const inputs: AgentMemoryDriftInputs = useMemo(() => ({
    monthlyMultiTurnSessions,
    avgTurnsPerSession,
    tokensPerTurnBaseline,
    costPerMillionTokensUSD,
    memoryRetentionWindowTurns
  }), [
    monthlyMultiTurnSessions,
    avgTurnsPerSession,
    tokensPerTurnBaseline,
    costPerMillionTokensUSD,
    memoryRetentionWindowTurns
  ]);

  const results = useMemo(() => {
    return simulateAgentMemoryDrift(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Agent Memory Drift &amp; Context Compression Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-memory-drift-compression-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive Memory &amp; Context Sandbox
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Agent Memory Drift &amp; Context Compression Simulator
          </h2>
        </div>
        <div className="text-right">
          <a
            href="https://elesium.online/tools/enterprise-agent-memory-drift-compression-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <span>Full Simulator</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Monthly Sessions</span>
            <span className="text-cyan-400 font-bold">{(monthlyMultiTurnSessions / 1000).toFixed(0)}k calls</span>
          </div>
          <input
            type="range"
            min={10000}
            max={250000}
            step={10000}
            value={monthlyMultiTurnSessions}
            onChange={(e) => setMonthlyMultiTurnSessions(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Turns/Session</span>
            <span className="text-cyan-400 font-bold">{avgTurnsPerSession} turns</span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            value={avgTurnsPerSession}
            onChange={(e) => setAvgTurnsPerSession(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Tokens/Turn</span>
            <span className="text-cyan-400 font-bold">{tokensPerTurnBaseline} tokens</span>
          </div>
          <input
            type="range"
            min={250}
            max={1500}
            step={50}
            value={tokensPerTurnBaseline}
            onChange={(e) => setTokensPerTurnBaseline(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>
      </div>

      {/* Live Result Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Annual Savings</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Tokens &amp; Triage Reruns</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Compression</span>
          <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
            {results.tokenCompressionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Context Token Reduction</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Drift Suppression</span>
          <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {results.driftSuppressionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">&lt;0.05% Error in 50+ Turns</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Recall Latency</span>
          <span className="text-base sm:text-lg font-bold text-amber-400 font-mono">
            {results.sovereignHierarchical.retrievalLatencyOverheadMs} ms
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Sub-85ms Semantic Index</span>
        </div>
      </div>

      {/* Architecture Snapshot Comparison */}
      <div className="space-y-2 mb-4 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elesium Sovereign Hierarchical Memory</span>
          </div>
          <span className="text-emerald-400 font-semibold">{results.sovereignHierarchical.contextCompressionRatioPct}% Cut | {results.sovereignHierarchical.retrievalLatencyOverheadMs}ms Recall | 99.96% Retention</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Sliding Window Recency Truncation</span>
          </div>
          <span className="text-amber-400">{results.slidingWindow.memoryDriftOrAmnesiaPct}% Amnesia Failure | ${(results.slidingWindow.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr Triage</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Uncompressed Raw Context (FIFO)</span>
          </div>
          <span className="text-rose-400">{results.uncompressedRaw.memoryDriftOrAmnesiaPct}% Attention Drift | +{results.uncompressedRaw.retrievalLatencyOverheadMs}ms TTFT | ${(results.uncompressedRaw.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr</span>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-85ms Semantic Recall &amp; 92.4% Context Compression</span>
        </div>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Elesium Sovereign AI Architecture
          </a>
        </div>
      </div>
    </div>
  );
}
