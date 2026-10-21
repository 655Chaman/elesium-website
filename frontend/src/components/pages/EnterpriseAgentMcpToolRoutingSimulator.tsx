import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Network,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Layers,
  ShieldCheck,
  Coins
} from 'lucide-react';
import {
  calculateMcpToolRouting,
  McpToolRoutingInputs,
  ToolSelectionStrategy,
  PruningAggressiveness
} from '../calculator/agentMcpToolRoutingModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentMcpToolRoutingSimulator() {
  // Inputs State
  const [mcpServerCount, setMcpServerCount] = useState<number>(4);
  const [registeredToolsCount, setRegisteredToolsCount] = useState<number>(48);
  const [contextWindowTokens, setContextWindowTokens] = useState<number>(32768);
  const [toolSelectionStrategy, setToolSelectionStrategy] = useState<ToolSelectionStrategy>('semantic_embedding_rerank');
  const [pruningAggressiveness, setPruningAggressiveness] = useState<PruningAggressiveness>('balanced');
  const [concurrencyOpsPerSec, setConcurrencyOpsPerSec] = useState<number>(50);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: McpToolRoutingInputs = useMemo(() => ({
    mcpServerCount,
    registeredToolsCount,
    contextWindowTokens,
    toolSelectionStrategy,
    pruningAggressiveness,
    concurrencyOpsPerSec,
    currency
  }), [
    mcpServerCount,
    registeredToolsCount,
    contextWindowTokens,
    toolSelectionStrategy,
    pruningAggressiveness,
    concurrencyOpsPerSec,
    currency
  ]);

  const results = useMemo(() => {
    return calculateMcpToolRouting(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-mcp-tool-routing-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#6366f1;text-decoration:underline;">Elesium Sovereign Serving</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE MODEL CONTEXT PROTOCOL (MCP) TOOL ROUTING AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-mcp-tool-routing-simulator)

MCP CLUSTER & ROUTING CONFIGURATION:
- Connected MCP Servers: ${mcpServerCount} Servers
- Registered Enterprise Tools: ${registeredToolsCount} Tools
- Model Context Window: ${contextWindowTokens.toLocaleString()} Tokens
- Tool Routing Strategy: ${toolSelectionStrategy.replace(/_/g, ' ').toUpperCase()}
- Pruning Aggressiveness: ${pruningAggressiveness.toUpperCase()}
- Production Throughput: ${concurrencyOpsPerSec} Ops/Sec

LATENCY & EFFICIENCY BENCHMARKS:
- Tool Discovery Latency: ${results.toolDiscoveryLatencyMs} ms
- Effective P99 Interaction Latency: ${results.effectiveP99LatencyMs} ms
- Context Tokens Conserved per Call: ${results.contextTokensSavedPerCall.toLocaleString()} Tokens
- Tool Selection Precision: ${results.toolSelectionAccuracyPct}%
- VRAM Memory Conserved: ${results.vramMemoryFreedMb} MB
- Est. Annual Token OPEX Savings: ${currency === 'INR' ? '₹' : '$'}${results.annualMcpComputeSavings.toLocaleString()}
- Est. Infrastructure Spend: ${currency === 'INR' ? '₹' : '$'}${results.annualInfrastructureSpend.toLocaleString()}

STATUS & ARCHITECTURAL CLASSIFICATION:
${results.statusClassification}
Note: ${results.recommendationNote}
`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 640;
    const height = 180;
    const trace = results.latencyTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(80, results.effectiveP99LatencyMs * 1.5);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.latencyMs / maxLatency) * (height * 0.78) - 12;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.latencyTrace, results.effectiveP99LatencyMs]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      <Helmet>
        <title>Enterprise Agent MCP Tool Routing &amp; Context Pruning Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate Model Context Protocol (MCP) multi-server tool routing, semantic tool discovery latency, prompt token pruning, and VRAM memory conservation for production agent swarms."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-mcp-tool-routing-simulator" />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono tracking-wide uppercase">
            <Network className="w-3.5 h-3.5" />
            <span>Model Context Protocol (MCP) Telemetry</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Enterprise Agent MCP Tool Routing &amp; Context Pruning Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Benchmark multi-server MCP tool registry routing, semantic embedding retrieval vs. naive function dumps, context window token bloat, and sub-50ms tool discovery latencies.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 transition-colors"
            >
              <Code className="w-4 h-4 text-indigo-400" />
              <span>Embed Calculator</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white transition-colors shadow-lg shadow-indigo-600/20"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>
          </div>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                <h2 className="text-sm font-bold tracking-wide uppercase text-white font-mono">Routing Parameters</h2>
              </div>
              <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-[10px] font-mono">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2 py-0.5 rounded ${currency === 'INR' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  INR (₹)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded ${currency === 'USD' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Slider 1: MCP Server Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Connected MCP Servers</span>
                <span className="text-indigo-400 font-mono font-bold">{mcpServerCount} Servers</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={mcpServerCount}
                onChange={(e) => setMcpServerCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 Server (Monolithic)</span>
                <span>20 Servers (Microservice Mesh)</span>
              </div>
            </div>

            {/* Slider 2: Registered Tools Count */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Total Registered Tools</span>
                <span className="text-indigo-400 font-mono font-bold">{registeredToolsCount} Tools</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                step="5"
                value={registeredToolsCount}
                onChange={(e) => setRegisteredToolsCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 Tools (Minimal)</span>
                <span>250 Tools (Enterprise Catalog)</span>
              </div>
            </div>

            {/* Slider 3: Context Window Tokens */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Context Window Depth</span>
                <span className="text-indigo-400 font-mono font-bold">{(contextWindowTokens / 1024).toFixed(0)}k Tokens</span>
              </div>
              <input
                type="range"
                min="4096"
                max="131072"
                step="4096"
                value={contextWindowTokens}
                onChange={(e) => setContextWindowTokens(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>4k Tokens</span>
                <span>128k Tokens</span>
              </div>
            </div>

            {/* Dropdown 1: Tool Selection Strategy */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Tool Discovery &amp; Routing Strategy</label>
              <select
                value={toolSelectionStrategy}
                onChange={(e) => setToolSelectionStrategy(e.target.value as ToolSelectionStrategy)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="semantic_embedding_rerank">Semantic Embedding Rerank (HNSW / FlashRank)</option>
                <option value="trie_prefix_indexing">Trie Prefix Indexing (Ultra-Low Latency Tree)</option>
                <option value="bm25_hybrid_filter">BM25 Hybrid Sparse-Dense Filter</option>
                <option value="naive_function_dump">Naive JSON Schema Dump (Full Context Bloat)</option>
              </select>
            </div>

            {/* Dropdown 2: Pruning Aggressiveness */}
            <div className="space-y-2">
              <label className="text-xs text-slate-300 font-medium block">Context Pruning Aggressiveness</label>
              <select
                value={pruningAggressiveness}
                onChange={(e) => setPruningAggressiveness(e.target.value as PruningAggressiveness)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="conservative">Conservative (Retain top 40% candidate tools)</option>
                <option value="balanced">Balanced (Retain top 18% candidate tools — Recommended)</option>
                <option value="ultra_pruned">Ultra-Pruned (Retain top 8% candidate tools — High Throughput)</option>
              </select>
            </div>

            {/* Slider 4: Concurrency Throughput */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Production Request Concurrency</span>
                <span className="text-indigo-400 font-mono font-bold">{concurrencyOpsPerSec} Ops/Sec</span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={concurrencyOpsPerSec}
                onChange={(e) => setConcurrencyOpsPerSec(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5 ops/s (Staging)</span>
                <span>300 ops/s (High-Throughput Swarm)</span>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Primary Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Discovery Latency</div>
                <div className="text-2xl font-extrabold text-indigo-400 font-mono mt-1">
                  {results.toolDiscoveryLatencyMs} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Sub-20ms routing</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Effective P99</div>
                <div className="text-2xl font-extrabold text-purple-400 font-mono mt-1">
                  {results.effectiveP99LatencyMs} <span className="text-xs font-normal">ms</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">End-to-end task</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Tokens Saved</div>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono mt-1">
                  {(results.contextTokensSavedPerCall / 1000).toFixed(1)}k
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">per API turn</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                <div className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">Tool Precision</div>
                <div className="text-2xl font-extrabold text-amber-400 font-mono mt-1">
                  {results.toolSelectionAccuracyPct}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hallucination-free</div>
              </div>
            </div>

            {/* Latency Visualization Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide font-mono uppercase">
                    P99 Latency Curve vs. Tool Schema Scale
                  </h3>
                  <p className="text-xs text-slate-400">
                    Routing latency progression from 5 to {registeredToolsCount} tools across {mcpServerCount} MCP servers
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {toolSelectionStrategy.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div className="pt-4">
                <svg viewBox="0 0 640 180" className="w-full h-44 overflow-visible">
                  <defs>
                    <linearGradient id="mcpAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  <line x1="0" y1="45" x2="640" y2="45" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="90" x2="640" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="135" x2="640" y2="135" stroke="#1e293b" strokeDasharray="3 3" />
                  
                  <path
                    d={`${svgData.path} L 640 180 L 0 180 Z`}
                    fill="url(#mcpAreaGradient)"
                  />
                  <path
                    d={svgData.path}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-800">
                <span>Scale: 5 Tools</span>
                <span>Midpoint: {Math.round(registeredToolsCount / 2)} Tools</span>
                <span>Max: {registeredToolsCount} Tools ({results.effectiveP99LatencyMs}ms P99)</span>
              </div>
            </div>

            {/* Economic Impact & Hardware Offload Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Coins className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">Annual Token Savings</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {currency === 'INR' ? '₹' : '$'}{(results.annualMcpComputeSavings / (currency === 'INR' ? 100000 : 1)).toFixed(2)} {currency === 'INR' ? 'Lakhs' : ''}
                </div>
                <p className="text-xs text-slate-400">
                  By pruning redundant tool schemas before context injection at {concurrencyOpsPerSec} ops/sec.
                </p>
              </div>

              <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-5 space-y-2">
                <div className="flex items-center space-x-2 text-indigo-400">
                  <Cpu className="w-4 h-4" />
                  <span className="text-xs font-mono uppercase tracking-wider font-bold">VRAM Memory Conserved</span>
                </div>
                <div className="text-2xl font-extrabold text-white font-mono">
                  {results.vramMemoryFreedMb} <span className="text-base font-normal">MB</span>
                </div>
                <p className="text-xs text-slate-400">
                  Dynamic pruning eliminates KV cache bloat across concurrent worker streams.
                </p>
              </div>
            </div>

            {/* Architectural Status Banner */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider font-bold text-white">
                  Classification: <span className="text-indigo-400">{results.statusClassification}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {results.recommendationNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Engineering Analysis Sections */}
        <div className="border-t border-slate-800/80 pt-12 space-y-10">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Model Context Protocol (MCP) in Production Enterprise Swarms
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Why monolithic tool dumps break production LLM agents, and how dynamic MCP routing enables sub-50ms tool discovery across hundreds of enterprise microservices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">Multi-Server Federation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Decouple internal tooling into isolated MCP servers (SAP ERP, PostgreSQL, Salesforce CRM, Git). Agents query a centralized MCP router rather than connecting to every server directly.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">Context Pruning Engines</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Injecting 200 JSON tool schemas consumes 50,000+ context tokens before user prompt injection. Semantic embedding rerankers select the exact 3–5 tools required for the task.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">Zero Hallucination Precision</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When models are overloaded with dozens of overlapping tool definitions, tool selection accuracy drops below 80%. Dynamic pruning restores deterministic 99%+ precision.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="border-t border-slate-800/80 pt-12 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-white font-mono uppercase">
            Frequently Asked Questions (MCP Tool Routing &amp; Context Pruning)
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'What is the Model Context Protocol (MCP) and why is it important for enterprises?',
                a: 'The Model Context Protocol (MCP) is an open standard developed by Anthropic that standardizes how AI applications connect to external tools, databases, and enterprise data sources. It provides a secure, bidirectional JSON-RPC interface allowing models to query resources and execute tools across distinct servers without proprietary glue code.'
              },
              {
                q: 'How does dynamic context pruning prevent prompt token saturation?',
                a: 'Each tool definition in OpenAI or Anthropic format carries a detailed JSON schema with parameter descriptions (averaging 250–350 tokens per tool). When an enterprise registers 100 tools, 30,000+ tokens are consumed on every request just to declare tools. Dynamic pruning uses semantic similarity to filter the tool catalog down to the top 3–5 relevant tools for that specific turn, slashing token overhead by 85–92%.'
              },
              {
                q: 'Can MCP servers run entirely on-premise or within private Indian VPCs?',
                a: 'Yes. MCP servers communicate over standard transports (stdio or HTTP/SSE). Enterprises in India deploy MCP tool servers inside air-gapped AWS ap-south-1 Mumbai VPCs or on-premise Kubernetes clusters, ensuring database credentials and proprietary schemas never transit the public internet.'
              },
              {
                q: 'What is the difference between Trie Prefix Indexing and Semantic Reranking?',
                a: 'Trie Prefix Indexing routes tool calls based on structured namespace trees (e.g., `erp.finance.reconcile`) in sub-5 milliseconds with zero GPU overhead. Semantic Reranking uses lightweight vector embeddings or cross-encoders to match unstructured natural language queries against tool docstrings, offering higher flexibility when user intent is ambiguous.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-slate-200 hover:text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise Mandate Application Form */}
        <div className="border-t border-slate-800/80 pt-12">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Deploy Sovereign Multi-Server MCP Architecture
            </h2>
            <p className="text-sm text-slate-400">
              Apply for an architectural mandate to deploy air-gapped MCP tool routing, sub-50ms tool discovery, and DPDP Act 2023 compliant multi-agent pipelines for your enterprise.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <MandateApplicationForm />
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase">Embed MCP Routing Simulator</h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Paste this responsive iframe snippet into your documentation, internal developer portal, or intranet:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all select-all">
              {embedCode}
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-xs text-white font-medium hover:bg-indigo-500 inline-flex items-center space-x-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="MCP Multi-Server Tool Routing Simulator"
        simulatedMetrics={[
          { label: 'Discovery Latency', value: `${results.toolDiscoveryLatencyMs} ms` },
          { label: 'Effective P99', value: `${results.effectiveP99LatencyMs} ms` },
          { label: 'Tokens Saved', value: `${(results.contextTokensSavedPerCall / 1000).toFixed(1)}k / call` },
          { label: 'Tool Precision', value: `${results.toolSelectionAccuracyPct}%` }
        ]}
      />
    </div>
  );
}
