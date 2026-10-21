import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMcpToolRouting,
  McpToolRoutingInputs,
  ToolSelectionStrategy,
  PruningAggressiveness
} from '../calculator/agentMcpToolRoutingModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMcpToolRoutingSimulator() {
  const [mcpServerCount, setMcpServerCount] = useState<number>(4);
  const [registeredToolsCount, setRegisteredToolsCount] = useState<number>(48);
  const [contextWindowTokens, setContextWindowTokens] = useState<number>(32768);
  const [toolSelectionStrategy, setToolSelectionStrategy] = useState<ToolSelectionStrategy>('semantic_embedding_rerank');
  const [pruningAggressiveness, setPruningAggressiveness] = useState<PruningAggressiveness>('balanced');
  const [concurrencyOpsPerSec, setConcurrencyOpsPerSec] = useState<number>(50);

  const inputs: McpToolRoutingInputs = useMemo(() => ({
    mcpServerCount,
    registeredToolsCount,
    contextWindowTokens,
    toolSelectionStrategy,
    pruningAggressiveness,
    concurrencyOpsPerSec,
    currency: 'INR'
  }), [
    mcpServerCount,
    registeredToolsCount,
    contextWindowTokens,
    toolSelectionStrategy,
    pruningAggressiveness,
    concurrencyOpsPerSec
  ]);

  const results = useMemo(() => {
    return calculateMcpToolRouting(inputs);
  }, [inputs]);

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(80, results.effectiveP99LatencyMs * 1.5);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.latencyMs / maxLatency) * (height * 0.75) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.effectiveP99LatencyMs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>MCP Tool Routing &amp; Context Pruning Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-mcp-tool-routing-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Network className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">MCP Multi-Server Tool Routing Simulator</h1>
              <p className="text-[10px] text-slate-400">Model Context Protocol Dynamic Pruning &amp; Discovery</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded border border-indigo-500/30 text-indigo-300 bg-indigo-950/40 font-mono">
            MCP v1.0
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>MCP Servers</span>
              <span className="text-indigo-400 font-mono">{mcpServerCount} nodes</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={mcpServerCount}
              onChange={(e) => setMcpServerCount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Registered Tools</span>
              <span className="text-indigo-400 font-mono">{registeredToolsCount} tools</span>
            </div>
            <input
              type="range"
              min="5"
              max="200"
              value={registeredToolsCount}
              onChange={(e) => setRegisteredToolsCount(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Routing Strategy</label>
            <select
              value={toolSelectionStrategy}
              onChange={(e) => setToolSelectionStrategy(e.target.value as ToolSelectionStrategy)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="semantic_embedding_rerank">Semantic Embedding Rerank</option>
              <option value="trie_prefix_indexing">Trie Prefix Indexing</option>
              <option value="bm25_hybrid_filter">BM25 Hybrid Filter</option>
              <option value="naive_function_dump">Naive JSON Schema Dump</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Pruning Aggressiveness</label>
            <select
              value={pruningAggressiveness}
              onChange={(e) => setPruningAggressiveness(e.target.value as PruningAggressiveness)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="conservative">Conservative (40% retain)</option>
              <option value="balanced">Balanced (18% retain)</option>
              <option value="ultra_pruned">Ultra-Pruned (8% retain)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Context Tokens</span>
              <span className="text-indigo-400 font-mono">{(contextWindowTokens / 1024).toFixed(0)}k</span>
            </div>
            <input
              type="range"
              min="4096"
              max="65536"
              step="4096"
              value={contextWindowTokens}
              onChange={(e) => setContextWindowTokens(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Concurrency</span>
              <span className="text-indigo-400 font-mono">{concurrencyOpsPerSec} ops/s</span>
            </div>
            <input
              type="range"
              min="5"
              max="150"
              step="5"
              value={concurrencyOpsPerSec}
              onChange={(e) => setConcurrencyOpsPerSec(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">P99 Latency</div>
            <div className="text-base font-bold text-indigo-400 mt-0.5 font-mono">{results.effectiveP99LatencyMs}ms</div>
            <div className="text-[9px] text-slate-500">Discovery: {results.toolDiscoveryLatencyMs}ms</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Tokens Saved</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{(results.contextTokensSavedPerCall / 1000).toFixed(1)}k</div>
            <div className="text-[9px] text-slate-500">per inference call</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Accuracy</div>
            <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">{results.toolSelectionAccuracyPct}%</div>
            <div className="text-[9px] text-slate-500">tool call precision</div>
          </div>
        </div>

        {/* SVG Latency Curve */}
        <div className="bg-slate-900/50 border border-slate-800/80 rounded-lg p-3">
          <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5">
            <span className="font-mono">P99 LATENCY VS TOOL SCALE (5 TO {registeredToolsCount} TOOLS)</span>
            <span className="text-indigo-400 font-mono">P99 {results.effectiveP99LatencyMs}ms</span>
          </div>
          <svg viewBox="0 0 340 90" className="w-full h-20 overflow-visible">
            <defs>
              <linearGradient id="embedMcpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={`${svgData.path} L 340 90 L 0 90 Z`}
              fill="url(#embedMcpGradient)"
            />
            <path
              d={svgData.path}
              fill="none"
              stroke="#6366f1"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Annual Compute Savings Callout */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-2.5 flex items-center justify-between text-xs">
          <div>
            <div className="text-[10px] text-emerald-400 font-mono font-medium">ESTIMATED ANNUAL TOKEN SAVINGS</div>
            <div className="text-sm font-bold text-white font-mono">
              ₹{(results.annualMcpComputeSavings / 100000).toFixed(2)} Lakhs / year
            </div>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {results.vramMemoryFreedMb} MB VRAM Freed
          </span>
        </div>

        {/* Watermark & Backlink */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Model Context Protocol (MCP) Simulator</span>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
          >
            Powered by Elesium Enterprise AI
            <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
