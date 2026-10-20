import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Activity,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  TrendingDown,
  Clock,
  Layers,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  simulateAgentTracing,
  AgentTracingInputs,
  SamplingStrategy,
  ObservabilityBackend
} from '../calculator/agentTracingSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentTracingSimulator() {
  // Inputs State
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(500000);
  const [avgSpansPerWorkflow, setAvgSpansPerWorkflow] = useState<number>(24);
  const [samplingStrategy, setSamplingStrategy] = useState<SamplingStrategy>('tail_based_smart');
  const [observabilityBackend, setObservabilityBackend] = useState<ObservabilityBackend>('sovereign_clickhouse');
  const [p99WorkflowLatencyMs, setP99WorkflowLatencyMs] = useState<number>(2400);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AgentTracingInputs = useMemo(() => ({
    monthlyWorkflows,
    avgSpansPerWorkflow,
    samplingStrategy,
    observabilityBackend,
    p99WorkflowLatencyMs
  }), [
    monthlyWorkflows,
    avgSpansPerWorkflow,
    samplingStrategy,
    observabilityBackend,
    p99WorkflowLatencyMs
  ]);

  const results = useMemo(() => {
    return simulateAgentTracing(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/agent-tracing-opentelemetry-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: MULTI-AGENT DISTRIBUTED TRACING & OPENTELEMETRY
================================================================================
Monthly Invocations     : ${inputs.monthlyWorkflows.toLocaleString()} workflows
Average Spans / Workflow: ${inputs.avgSpansPerWorkflow} spans
Sampling Strategy       : ${inputs.samplingStrategy.toUpperCase()}
Backend Target          : ${inputs.observabilityBackend === 'sovereign_clickhouse' ? 'Sovereign ClickHouse / Jaeger (Private VPC)' : 'Commercial SaaS APM'}
Baseline P99 Latency    : ${inputs.p99WorkflowLatencyMs}ms

COMPARATIVE BENCHMARK:
1. Unmonitored Black-Box Agent Mesh:
   - Added Critical Path Overhead : 0.0ms
   - Root-Cause Isolation Time    : 252 minutes (4.2 hours MTTR)
   - Diagnostic Accuracy          : 34.0% (Blind DAG cascade failures)

2. Synchronous Blocking Tracing (Commercial Cloud APM):
   - Added Critical Path Overhead : +${results.syncBlockingTracing.p99LatencyOverheadMs}ms (Blocks async worker loops)
   - Monthly Telemetry Volume     : ${results.syncBlockingTracing.monthlyTelemetryDataGB} GB
   - Monthly Ingestion Spend      : $${results.syncBlockingTracing.monthlyObservabilityCostUSD.toLocaleString()} / mo

3. Elesium Sovereign Async OpenTelemetry Pipeline:
   - Added Critical Path Overhead : +${results.asyncBatchOtel.p99LatencyOverheadMs}ms (Sub-1.5ms RingBuffer batching)
   - Monthly Telemetry Volume     : ${results.asyncBatchOtel.monthlyTelemetryDataGB} GB (Tail-based filtered)
   - Monthly Ingestion Spend      : $${results.asyncBatchOtel.monthlyObservabilityCostUSD.toLocaleString()} / mo
   - Root-Cause Isolation Time    : 6.5 minutes (97.4% MTTR reduction)
   - Diagnostic Accuracy          : 99.8% (Deterministic W3C traceparent DAG replay)

FINANCIAL & OPERATIONAL ARBITRAGE:
- Monthly Observability Savings: $${results.monthlyCostSavingsUSD.toLocaleString()} (${results.costReductionPct}% cut)
- Annual Observability Savings : $${results.annualCostSavingsUSD.toLocaleString()} / year
- Critical-Path Latency Saved  : ${results.latencyOverheadReductionPct}% reduction in tracing overhead
- MTTR Reduction               : ${results.mttrReductionPct}% faster incident recovery

VERDICT:
Deploying zero-copy RingBuffer asynchronous OpenTelemetry batching eliminates blocking HTTP latency overhead while tail-based sampling slashes cloud APM costs by over 80%.
================================================================================
Audit performed via https://elesium.online/tools/enterprise-agent-tracing-opentelemetry-simulator`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const jsonLdWebapp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Enterprise Multi-Agent Distributed Tracing & OpenTelemetry Simulator",
    "url": "https://elesium.online/tools/enterprise-agent-tracing-opentelemetry-simulator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All modern browsers (HTML5/JavaScript)",
    "description": "Simulate and benchmark OpenTelemetry W3C distributed trace-context propagation vs blocking APM exporters and unmonitored agent meshes. Calculate sub-1.5ms span batching, tail-based telemetry compression, and MTTR reduction.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elesium - Enterprise AI Automation Agency",
      "url": "https://elesium.online"
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://elesium.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Interactive Tools",
        "item": "https://elesium.online/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "OpenTelemetry Tracing Simulator",
        "item": "https://elesium.online/tools/enterprise-agent-tracing-opentelemetry-simulator"
      }
    ]
  };

  const faqs = [
    {
      q: "Why do synchronous OpenTelemetry exporters degrade multi-agent P99 latency?",
      a: "In multi-agent systems built with frameworks like LangGraph, AutoGen, or FastAPI, a single high-level user workflow spawns 15 to 60 sub-agent tasks, tool executions, and LLM completions. If your OpenTelemetry SDK uses synchronous HTTP or gRPC span exporters on the critical execution path, each span adds 2ms to 4ms of socket blocking time. Multiplied across 30 serial tool steps, tracing alone injects 60ms to 180ms of artificial latency, degrading customer P99 response times."
    },
    {
      q: "How does Elesium's non-blocking RingBuffer batch exporter achieve sub-1.5ms overhead?",
      a: "Elesium decouples telemetry capture from agent execution. As agents transition between DAG states, spans are emitted directly into a lock-free, zero-copy shared memory RingBuffer in sub-10 microseconds. A dedicated background daemon asynchronously drains the buffer, batches spans, and pushes them to ClickHouse or Jaeger over persistent gRPC channels—completely insulating the agent execution loop from network jitter."
    },
    {
      q: "What is tail-based sampling and how does it cut cloud observability bills by 80%?",
      a: "Head-based sampling randomly chooses whether to record a trace at the start, meaning you inevitably discard 90% of your critical error traces or pay full price for millions of boring '200 OK' traces. Tail-based sampling buffers all spans for a workflow in memory until execution finishes. If the workflow succeeds within nominal latency thresholds, 92% of spans are dropped; if an exception, tool retry, or latency spike occurs, 100% of the trace hierarchy is preserved."
    },
    {
      q: "How does W3C traceparent propagation isolate root causes across asynchronous agent meshes?",
      a: "When agents invoke downstream microservices, message queues (Kafka/RabbitMQ), or tool pods, Elesium injects W3C Trace Context (traceparent and tracestate headers) into message payloads. This links asynchronous child spans back to the parent workflow ID, giving engineers an interactive flamegraph visualization where failing database connections or hallucinated parameter loops can be spotted in seconds rather than hours."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Multi-Agent Distributed Tracing &amp; OpenTelemetry Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark OpenTelemetry W3C distributed trace-context propagation vs blocking APM exporters and unmonitored agent meshes. Calculate sub-1.5ms span batching, tail-based telemetry compression, and MTTR reduction."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-tracing-opentelemetry-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdWebapp)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white selection:bg-cyan-500 selection:text-white">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white transition-colors">Tools</Link>
              <span>/</span>
              <span className="text-cyan-400 font-medium">Multi-Agent Tracing &amp; OTel Simulator</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-all"
              >
                <Code className="w-3.5 h-3.5 text-cyan-400" />
                <span>Embed Widget</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <header className="relative pt-12 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-950/40 via-slate-950/20 to-slate-950 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Activity className="w-3.5 h-3.5" />
              <span>Agentic Observability &amp; Distributed Tracing Lab</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Enterprise Multi-Agent Tracing &amp; <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                OpenTelemetry Span Overhead Simulator
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Benchmark asynchronous lock-free OpenTelemetry span batching versus blocking APM exporters and unmonitored agent meshes. Model critical-path latency inflation, tail-based sampling savings, and sub-10 minute root-cause MTTR.
            </p>
          </div>
        </header>

        {/* Main Simulator Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Configuration Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-base font-bold text-white">Observability Workload</h2>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    Live Telemetry
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Monthly Workflows Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Monthly Agent Workflows
                      </label>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {monthlyWorkflows.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="50000"
                      max="3000000"
                      step="50000"
                      value={monthlyWorkflows}
                      onChange={(e) => setMonthlyWorkflows(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>50k</span>
                      <span>1.5M</span>
                      <span>3M workflows</span>
                    </div>
                  </div>

                  {/* Average Spans per Workflow */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Spans per Agent Workflow
                      </label>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {avgSpansPerWorkflow} spans / DAG
                      </span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      step="4"
                      value={avgSpansPerWorkflow}
                      onChange={(e) => setAvgSpansPerWorkflow(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>8 spans (Simple)</span>
                      <span>32 spans (Multi-agent Triad)</span>
                      <span>64 spans (Deep DAG)</span>
                    </div>
                  </div>

                  {/* Sampling Strategy */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Trace Sampling Strategy
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setSamplingStrategy('tail_based_smart')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          samplingStrategy === 'tail_based_smart'
                            ? 'bg-cyan-500/10 border-cyan-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="text-xs font-bold text-cyan-300">Tail-Based Smart</div>
                        <div className="text-[10px] text-slate-400 mt-1">100% of errors/P99s, 8% nominal</div>
                      </button>

                      <button
                        onClick={() => setSamplingStrategy('full_head_100')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          samplingStrategy === 'full_head_100'
                            ? 'bg-cyan-500/10 border-cyan-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-200">100% Head-Based</div>
                        <div className="text-[10px] text-slate-400 mt-1">Ingests every nominal span</div>
                      </button>
                    </div>
                  </div>

                  {/* Observability Backend */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Telemetry Storage Backend
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setObservabilityBackend('sovereign_clickhouse')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          observabilityBackend === 'sovereign_clickhouse'
                            ? 'bg-cyan-500/10 border-cyan-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          <Layers className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Sovereign ClickHouse</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Private VPC ($0.018/GB)</div>
                      </button>

                      <button
                        onClick={() => setObservabilityBackend('commercial_saas')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          observabilityBackend === 'commercial_saas'
                            ? 'bg-cyan-500/10 border-cyan-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          <Activity className="w-3.5 h-3.5 text-amber-400" />
                          <span>Commercial SaaS APM</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Datadog / Honeycomb ($0.14/GB)</div>
                      </button>
                    </div>
                  </div>

                  {/* P99 Baseline Latency */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Baseline Workflow P99 Latency
                      </label>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {p99WorkflowLatencyMs}ms
                      </span>
                    </div>
                    <input
                      type="range"
                      min="800"
                      max="6000"
                      step="200"
                      value={p99WorkflowLatencyMs}
                      onChange={(e) => setP99WorkflowLatencyMs(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>800ms</span>
                      <span>3,000ms</span>
                      <span>6,000ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-br from-cyan-950/40 via-slate-900 to-sky-950/40 border border-cyan-500/20 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-cyan-400 text-xs font-bold uppercase mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sovereign W3C Trace Injection</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminate blind production incident debugging. Elesium instruments stateful LangGraph cyclical agents with asynchronous W3C distributed traceparent context and sovereign ClickHouse ingestion.
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <button
                    onClick={copyArchitecturalMemo}
                    className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                    <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Comparison Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* High-Level Impact Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Monthly Savings</span>
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                    ${results.monthlyCostSavingsUSD.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    ${results.annualCostSavingsUSD.toLocaleString()} / year ({results.costReductionPct}% cut)
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Critical Overhead</span>
                    <Zap className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                    +{results.asyncBatchOtel.p99LatencyOverheadMs}ms
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {results.latencyOverheadReductionPct}% less tracing latency
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Incident MTTR</span>
                    <Clock className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
                    {results.asyncBatchOtel.meanTimeToResolutionMinutes} min
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    Down from {results.unmonitoredMesh.meanTimeToResolutionMinutes}m ({results.mttrReductionPct}% cut)
                  </div>
                </div>
              </div>

              {/* Three-Way Observability Comparison Matrix */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Observability Architecture Comparison</span>
                </h3>

                <div className="space-y-4">
                  {/* Option 1: Elesium Async OTel Batch Pipeline */}
                  <div className="border border-cyan-500/40 bg-cyan-950/20 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                        <span className="text-sm font-bold text-white">Elesium Async OpenTelemetry Pipeline (Sovereign VPC)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                        Sub-1.5ms RingBuffer
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Latency Added</div>
                        <div className="text-emerald-400 font-bold text-sm mt-0.5">+{results.asyncBatchOtel.p99LatencyOverheadMs}ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Incident MTTR</div>
                        <div className="text-cyan-400 font-bold text-sm mt-0.5">{results.asyncBatchOtel.meanTimeToResolutionMinutes}m</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Data Volume</div>
                        <div className="text-white font-bold text-sm mt-0.5">{results.asyncBatchOtel.monthlyTelemetryDataGB} GB</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-cyan-300 font-bold text-sm mt-0.5">${results.asyncBatchOtel.monthlyObservabilityCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Lock-free shared memory RingBuffer exports batches in background. Tail-based sampling discards 92% of routine traces while preserving 100% of errors and outliers.
                    </p>
                  </div>

                  {/* Option 2: Synchronous Blocking OTel */}
                  <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-sm font-bold text-slate-200">Synchronous Blocking Exporter (Commercial SaaS APM)</span>
                      </div>
                      <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        Critical-Path Blocking
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Latency Added</div>
                        <div className="text-rose-400 font-bold text-sm mt-0.5">+{results.syncBlockingTracing.p99LatencyOverheadMs}ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Incident MTTR</div>
                        <div className="text-slate-200 font-bold text-sm mt-0.5">{results.syncBlockingTracing.meanTimeToResolutionMinutes}m</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Data Volume</div>
                        <div className="text-slate-300 font-bold text-sm mt-0.5">{results.syncBlockingTracing.monthlyTelemetryDataGB} GB</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-amber-300 font-bold text-sm mt-0.5">${results.syncBlockingTracing.monthlyObservabilityCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Blocks the agent event loop on every LLM token chunk and tool invocation, adding severe latency overhead and ballooning cloud APM bills.
                    </p>
                  </div>

                  {/* Option 3: Unmonitored Black-Box Mesh */}
                  <div className="border border-rose-500/30 bg-rose-950/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-sm font-bold text-slate-200">Unmonitored Black-Box Agent Mesh</span>
                      </div>
                      <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        Zero Visibility
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Latency Added</div>
                        <div className="text-emerald-400 font-bold text-sm mt-0.5">0.0ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Incident MTTR</div>
                        <div className="text-rose-400 font-bold text-sm mt-0.5">{results.unmonitoredMesh.meanTimeToResolutionMinutes}m (4.2h)</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Accuracy</div>
                        <div className="text-rose-400 font-bold text-sm mt-0.5">{results.unmonitoredMesh.rootCauseAccuracyPct}%</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-slate-300 font-bold text-sm mt-0.5">$0</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Zero telemetry cost, but catastrophic operational blind spots. Complex multi-agent race conditions require hours of manual grep log scraping.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion CTA Module */}
              <div className="bg-gradient-to-r from-cyan-900/50 via-slate-900 to-sky-900/50 border border-cyan-500/30 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                  Instrument Production Multi-Agent Systems with Zero Latency Penalty
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mx-auto mb-4">
                  Deploy sovereign private ClickHouse / Jaeger observability pipelines with non-blocking RingBuffer batching. Isolate agentic failures in under 10 minutes.
                </p>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 cursor-pointer">
                    <span>Schedule Observability Architecture Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="max-w-2xl mx-auto py-8">
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>

            </div>
          </div>

          {/* Deep FAQ Section */}
          <section className="mt-16 border-t border-slate-800/80 pt-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions: Multi-Agent Observability &amp; Distributed Tracing
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Embed Modal */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                <Code className="w-5 h-5 text-cyan-400" />
                <span>Embed This Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Embed this interactive OpenTelemetry tracing and span latency simulator on your developer portal or technical blog.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={embedCodeSnippet}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none resize-none"
                />
                <button
                  onClick={copyEmbedCode}
                  className="mt-3 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white text-xs font-semibold transition-colors"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? 'Code Copied to Clipboard!' : 'Copy Embed Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
