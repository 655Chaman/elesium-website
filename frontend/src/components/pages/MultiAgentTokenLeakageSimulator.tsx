import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Flame,
  ShieldCheck,
  Zap,
  Layers,
  Copy,
  Check,
  ChevronDown,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Code,
  Sparkles,
  X
} from 'lucide-react';
import {
  calculateTokenLeakage,
  formatNumber,
  formatCompactNumber,
  MODELS,
  TOPOLOGIES,
  ModelKey,
  TopologyKey,
  Currency
} from '../calculator/tokenLeakageSimulatorModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';

export default function MultiAgentTokenLeakageSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // Inputs State
  const [currency, setCurrency] = useState<Currency>('USD');
  const [model, setModel] = useState<ModelKey>('gpt-4o');
  const [topology, setTopology] = useState<TopologyKey>('unconstrained_react');
  const [agentNodes, setAgentNodes] = useState<number>(6);
  const [recursionDepth, setRecursionDepth] = useState<number>(8);
  const [failureRatePct, setFailureRatePct] = useState<number>(20);
  const [basePromptTokens, setBasePromptTokens] = useState<number>(6000);
  const [monthlyRuns, setMonthlyRuns] = useState<number>(50000);

  // UI Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const results = useMemo(() => {
    return calculateTokenLeakage({
      topology,
      model,
      agentNodes,
      recursionDepth,
      failureRatePct,
      basePromptTokens,
      monthlyRuns,
      currency
    });
  }, [topology, model, agentNodes, recursionDepth, failureRatePct, basePromptTokens, monthlyRuns, currency]);

  const activeModel = MODELS[model];
  const activeTopo = TOPOLOGIES[topology];

  const embedCode = `<iframe src="https://elesium.online/embed/token-leakage-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/compare" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Agent Architecture Matrix</a></div>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyAuditMemo = () => {
    const memo = {
      audit_title: "Elesium Multi-Agent Token Leakage & Circuit Breaker Audit",
      timestamp: new Date().toISOString(),
      parameters: {
        model: activeModel.name,
        topology: activeTopo.name,
        agent_nodes: agentNodes,
        recursion_depth: recursionDepth,
        edge_failure_rate: `${failureRatePct}%`,
        base_prompt_tokens: basePromptTokens,
        monthly_volume: monthlyRuns
      },
      leakage_metrics: {
        unconstrained_tokens_per_run: results.unconstrainedTokensPerRun,
        deterministic_fsm_tokens_per_run: results.fsmTokensPerRun,
        token_waste_per_run: results.tokenLeakagePerRun,
        waste_reduction_percentage: `${results.tokenReductionPct}%`
      },
      financial_impact: {
        unconstrained_monthly_burn: `${results.currencySymbol}${formatNumber(results.unconstrainedMonthlyCost)}`,
        deterministic_fsm_monthly_cost: `${results.currencySymbol}${formatNumber(results.fsmMonthlyCost)}`,
        net_monthly_capital_leakage: `${results.currencySymbol}${formatNumber(results.monthlySavings)}`,
        net_annual_circuit_breaker_savings: `${results.currencySymbol}${formatNumber(results.annualSavings)}`,
        cost_reduction: `${results.costReductionPct}%`
      },
      reliability_sla: {
        unconstrained_cascade_infinite_loop_risk: `${results.unconstrainedCascadeRiskPct}%`,
        deterministic_fsm_cascade_risk: "0.0% (Guaranteed Bounded StateGraph)",
        p99_latency_unconstrained_ms: results.unconstrainedP99LatencyMs,
        p99_latency_fsm_ms: results.fsmP99LatencyMs,
        p99_latency_cut_percentage: `${results.latencyReductionPct}%`
      },
      architectural_recommendation: "Replace unconstrained ReAct loops with typed Pydantic StateGraph nodes, sub-step token budgeting, and fallback circuit breakers to halt runaway token consumption."
    };
    navigator.clipboard.writeText(JSON.stringify(memo, null, 2));
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Enterprise Multi-Agent Token Leakage Simulator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Simulate and quantify token leakage in unconstrained ReAct agent loops vs deterministic FSM circuit breakers.",
    "url": "https://elesium.online/tools/multi-agent-token-leakage-simulator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Elesium",
      "url": "https://elesium.online"
    }
  };

  const faqs = [
    {
      q: "Why do unconstrained ReAct agent loops cause quadratic token leakage?",
      a: "In standard ReAct (Reasoning + Acting) implementations, when a tool execution fails or hallucinates parameters, the entire conversation history, intermediate scratchpad tokens, and raw error tracebacks are re-submitted on every retry loop. As recursion depth increases, the prompt size expands quadratically ($O(N^2)$), causing token consumption to spike from 4,000 to over 48,000 tokens for a single workflow task."
    },
    {
      q: "How does an Elesium Deterministic FSM enforce zero runaway token burn?",
      a: "Elesium designs agent topologies as strict Directed Acyclic StateGraphs with Pydantic typed state projections. Each sub-agent receives only the exact slice of state required for its execution, pruning up to 90% of extraneous conversation history. Furthermore, hard sub-step circuit breakers cap retries at exactly 1 attempt before falling back to a deterministic rule or human-in-the-loop review queue."
    },
    {
      q: "What is the difference between reasoning scratchpad tokens and standard prompt tokens?",
      a: "Reasoning models like DeepSeek-R1 or OpenAI o1 generate extended internal chain-of-thought traces (scratchpad tokens) before emitting final tool calls. In an unconstrained multi-agent swarm, these hidden tokens multiply across agent interactions, causing silent cloud bills that are 3x to 5x higher than traditional linear API calls."
    },
    {
      q: "Can this simulation be embedded into internal enterprise engineering dashboards?",
      a: "Yes. Use our zero-friction embed widget (/embed/token-leakage-simulator). It renders a lightweight, responsive simulator sandbox in an iframe, allowing engineering leads, FinOps teams, and enterprise architects to evaluate token economics directly within their internal wikis or developer portals."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Multi-Agent Token Leakage Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and quantify silent token leakage, quadratic context window growth, and runaway spend in unconstrained ReAct loops vs deterministic FSM circuit breakers."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/tools/multi-agent-token-leakage-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-rose-500/30 selection:text-rose-200 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-rose-400">Token Leakage Simulator</span>
          </div>

          {/* Header Title Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono font-medium mb-4">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              <span>Interactive FinOps & Agent Architecture Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Multi-Agent Token Leakage Simulator
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Model silent token leakage, quadratic context bloat, and runaway cloud spend in unconstrained ReAct loops. 
              Quantify exact capital saved by switching to deterministic FSM circuit breakers with bounded state projections.
            </p>
          </div>

          {/* Quick Action Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Currency Benchmark:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    currency === 'INR'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyAuditMemo}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{hasCopiedMemo ? "Copied CFO Memo!" : "Export Token Audit (.JSON)"}</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-rose-400" />
                <span>Embed Widget</span>
              </button>
            </div>
          </div>

          {/* Main Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left Column: Interactive Simulation Sliders (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
                  <Layers className="w-4 h-4 text-rose-400" />
                  <span>Workflow & Topology Parameters</span>
                </h2>

                <div className="space-y-5">
                  {/* Model Selector */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Underlying Inference Model:
                    </label>
                    <select
                      value={model}
                      onChange={(e) => setModel(e.target.value as ModelKey)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 font-sans"
                    >
                      {Object.values(MODELS).map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} (${m.inputPerMTokUSD.toFixed(2)} / ${m.outputPerMTokUSD.toFixed(2)} per MTok)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Architecture Topology */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Agent Orchestration Topology:
                    </label>
                    <select
                      value={topology}
                      onChange={(e) => setTopology(e.target.value as TopologyKey)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-rose-500 font-sans"
                    >
                      {Object.values(TOPOLOGIES).map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-slate-500 leading-normal">
                      {activeTopo.description}
                    </p>
                  </div>

                  {/* Concurrent Agent Nodes Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Cooperating Agent Nodes:</span>
                      <span className="text-rose-400 font-bold">{agentNodes} Nodes</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={agentNodes}
                      onChange={(e) => setAgentNodes(parseInt(e.target.value))}
                      className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>1 (Single Agent)</span>
                      <span>10 (Swarm)</span>
                      <span>20 (Autonomous Ops)</span>
                    </div>
                  </div>

                  {/* Recursion Depth Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Max Recursion Depth / Turn Loops:</span>
                      <span className="text-rose-400 font-bold">{recursionDepth} Loops</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="1"
                      value={recursionDepth}
                      onChange={(e) => setRecursionDepth(parseInt(e.target.value))}
                      className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>1 (Direct Execution)</span>
                      <span>12 (Complex DAG)</span>
                      <span>25 (Deep Reflection)</span>
                    </div>
                  </div>

                  {/* Failure & Tool Parsing Friction Rate */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Tool Parsing / Schema Failure Rate:</span>
                      <span className="text-amber-400 font-bold">{failureRatePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      step="5"
                      value={failureRatePct}
                      onChange={(e) => setFailureRatePct(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>5% (Strict API)</span>
                      <span>20% (Typical Prod)</span>
                      <span>50% (Volatile)</span>
                    </div>
                  </div>

                  {/* Base Prompt Context Size */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Base Prompt Context Window:</span>
                      <span className="text-slate-200 font-bold">{formatNumber(basePromptTokens)} tokens</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="32000"
                      step="1000"
                      value={basePromptTokens}
                      onChange={(e) => setBasePromptTokens(parseInt(e.target.value))}
                      className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>1k (Minimal)</span>
                      <span>16k (Document RAG)</span>
                      <span>32k (Full Repo)</span>
                    </div>
                  </div>

                  {/* Monthly Workflow Invocations */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Monthly Production Invocations:</span>
                      <span className="text-emerald-400 font-bold">{formatNumber(monthlyRuns)} runs/mo</span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="200000"
                      step="5000"
                      value={monthlyRuns}
                      onChange={(e) => setMonthlyRuns(parseInt(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>1k</span>
                      <span>50k (Mid-Market)</span>
                      <span>200k (Enterprise)</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Live Simulation Telemetry & Financial Modeling (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Primary Callout: Silent Capital Leakage */}
              <div className="bg-gradient-to-br from-rose-950/40 via-slate-900/80 to-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Flame className="w-48 h-48 text-rose-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold tracking-wider uppercase text-rose-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      Silent Token Burn (Capital Leaked)
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30">
                      {results.costReductionPct}% Spend Waste
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                      {results.currencySymbol}{formatNumber(results.monthlySavings)}
                    </div>
                    <span className="text-slate-400 text-sm font-mono">/ month</span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    Runaway spend caused by unpruned conversation context and recursive error retries across {formatNumber(monthlyRuns)} executions.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Recoverable Capital</div>
                      <div className="text-base sm:text-xl font-bold text-emerald-400">
                        {results.currencySymbol}{formatNumber(results.annualSavings)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Tokens Wasted / Task</div>
                      <div className="text-base sm:text-xl font-bold text-rose-400">
                        {formatCompactNumber(results.tokenLeakagePerRun)} tok
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Monthly Leaked Tokens</div>
                      <div className="text-base sm:text-xl font-bold text-amber-400">
                        {formatCompactNumber(results.monthlyLeakedTokens)} tok
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparative Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Metric 1: Cost Per Execution Run */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                    <span>Effective Cost Per Execution</span>
                    <Zap className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[11px] text-slate-400">Unconstrained ReAct</div>
                      <div className="text-lg font-bold text-rose-400">
                        {results.currencySymbol}{results.costPerRunUnconstrained.toFixed(3)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Elesium FSM</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {results.currencySymbol}{results.costPerRunFsm.toFixed(3)}
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full"
                      style={{ width: `${Math.max(10, 100 - results.costReductionPct)}%` }}
                    />
                  </div>
                </div>

                {/* Metric 2: Cascade Failure / Infinite Loop Probability */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                    <span>Cascade Failure Risk</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[11px] text-slate-400">Unconstrained ReAct</div>
                      <div className="text-lg font-bold text-rose-400">
                        {results.unconstrainedCascadeRiskPct}% Risk
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Elesium Circuit Breaker</div>
                      <div className="text-lg font-bold text-emerald-400">
                        0.0% (Hard Bound)
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Mathematical proof: FSM terminates via Directed Acyclic Graph.
                  </div>
                </div>

                {/* Metric 3: P99 Tail Latency */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                    <span>P99 Tail Latency (Worst-Case Jitter)</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[11px] text-slate-400">ReAct Tail Latency</div>
                      <div className="text-lg font-bold text-rose-400">
                        {(results.unconstrainedP99LatencyMs / 1000).toFixed(1)}s
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Elesium FSM</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {(results.fsmP99LatencyMs / 1000).toFixed(1)}s
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    ↓ {results.latencyReductionPct}% Tail Latency Reduction
                  </div>
                </div>

                {/* Metric 4: Average Tokens Consumed Per Run */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                  <div className="text-xs font-mono text-slate-400 mb-2 flex items-center justify-between">
                    <span>Average Tokens Consumed / Task</span>
                    <Sparkles className="w-3.5 h-3.5 text-rose-400" />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-[11px] text-slate-400">ReAct Quadratic Bloat</div>
                      <div className="text-lg font-bold text-rose-400">
                        {formatNumber(results.unconstrainedTokensPerRun)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">FSM Typed State</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {formatNumber(results.fsmTokensPerRun)}
                      </div>
                    </div>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    ↓ {results.tokenReductionPct}% Extraneous Context Pruned
                  </div>
                </div>

              </div>

              {/* Conversion CTA Block */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Ready to Halt Token Bleed in Your Production Stack?
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Schedule a confidential 30-minute architecture review. We audit your multi-agent graphs, replace unconstrained loops with typed FSMs, and guarantee cost ceilings.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <ExpandableScreen>
                    <ExpandableScreenTrigger>
                      <InteractiveHoverButton>
                        <span>Schedule Architecture Audit</span>
                      </InteractiveHoverButton>
                    </ExpandableScreenTrigger>
                    <ExpandableScreenContent>
                      <MandateApplicationForm />
                    </ExpandableScreenContent>
                  </ExpandableScreen>

                  <button
                    onClick={() => openWhatsApp()}
                    className="px-5 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Architectural Comparison Matrix (Visual Sandbox) */}
          <div className="mb-20">
            <div className="text-center mb-10">
              <span className="text-xs font-mono font-medium text-rose-400 uppercase tracking-wider">
                Engineering Blueprint Comparison
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                Unconstrained ReAct Loops vs. Deterministic State Graphs
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Box 1: Unconstrained ReAct */}
              <div className="bg-slate-900/60 border border-rose-500/30 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Unconstrained ReAct Architecture</h3>
                    <p className="text-xs text-slate-400">CrewAI / LangChain Default Loop</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 text-xs font-mono font-bold">
                    High Fragility
                  </span>
                </div>

                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Quadratic Prompt Accumulation:</strong> Every error, tool output, and intermediate thought is re-injected into future turns without schema filtering.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Unbounded Retries:</strong> When an API returns a 429 or schema mismatch, agents enter stochastic self-healing loops until hitting maximum token limits.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Unpredictable Invoicing:</strong> Cloud inference bills vary wildly; a single complex document can consume $0.80 instead of $0.02.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>Infinite Loop Vulnerability:</strong> Repeating hallucination loops when two cooperating sub-agents debate contradictory intermediate results.</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Elesium Deterministic FSM */}
              <div className="bg-slate-900/60 border border-emerald-500/30 rounded-2xl p-6 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white">Elesium Deterministic StateGraph</h3>
                    <p className="text-xs text-slate-400">LangGraph Core + Typed Pydantic Boundaries</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold">
                    Production Hardened
                  </span>
                </div>

                <ul className="space-y-4 text-xs text-slate-300">
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Isolated State Slices:</strong> Each node receives only its declared fields via TypedDict/Pydantic, pruning 90% of extraneous conversation history.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Sub-Step Token Circuit Breakers:</strong> Execution halts deterministically after 1 retry, routing to a pre-defined static rule or human verification.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Flat Unit Economics:</strong> Predictable cost per transaction (e.g. $0.003 to $0.012) with zero risk of runaway exponential token spikes.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Formal Verification:</strong> State transitions are modeled as a Directed Acyclic Graph, mathematically proving 0.0% infinite loop probability.</span>
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Technical FAQ Accordion */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions on Multi-Agent Token Leakage
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180 text-rose-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Related Architecture Links */}
          <div className="border-t border-slate-800 pt-10 text-center">
            <div className="text-xs font-mono text-slate-500 mb-3">Explore Elesium Engineering Assets</div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link to="/compare" className="text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors">
                <span>Architecture Battlecard Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/tools/multi-agent-latency-token-cost-estimator" className="text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors">
                <span>Latency & Token Cost Estimator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/tools/agentic-architecture-grader" className="text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors">
                <span>1-Minute Architecture Grader</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/solutions" className="text-slate-400 hover:text-rose-400 inline-flex items-center gap-1 transition-colors">
                <span>Enterprise Sovereign Solutions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Embed Modal Drawer */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Embed Token Leakage Simulator</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Copy and paste this snippet into your engineering documentation, internal wiki, or tech publication. It renders a responsive, high-performance sandbox with live financial modeling.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 break-all mb-4">
                {embedCode}
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="/embed/token-leakage-simulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-rose-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Preview Embed View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={copyEmbedSnippet}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? "Copied Snippet!" : "Copy Embed HTML"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Modal */}
        <WhatsAppModal />

      </div>
    </>
  );
}
