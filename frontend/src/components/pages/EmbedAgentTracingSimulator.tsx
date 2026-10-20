import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Zap,
  Activity,
  Layers,
  Clock
} from 'lucide-react';
import {
  simulateAgentTracing,
  AgentTracingInputs,
  SamplingStrategy,
  ObservabilityBackend
} from '../calculator/agentTracingSimulatorModel';

export default function EmbedAgentTracingSimulator() {
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(500000);
  const [avgSpansPerWorkflow, setAvgSpansPerWorkflow] = useState<number>(24);
  const [samplingStrategy, setSamplingStrategy] = useState<SamplingStrategy>('tail_based_smart');
  const [observabilityBackend] = useState<ObservabilityBackend>('sovereign_clickhouse');
  const [p99WorkflowLatencyMs] = useState<number>(2400);

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

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Multi-Agent Tracing &amp; OpenTelemetry Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-tracing-opentelemetry-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive OpenTelemetry Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Multi-Agent Tracing &amp; OTel Overhead Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">Monthly Savings</div>
          <div className="text-base font-extrabold text-cyan-400 font-mono">
            ${results.monthlyCostSavingsUSD.toLocaleString()} / mo
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Workflows: {monthlyWorkflows.toLocaleString()} / mo
          </label>
          <input
            type="range"
            min="50000"
            max="2000000"
            step="50000"
            value={monthlyWorkflows}
            onChange={(e) => setMonthlyWorkflows(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Spans / Workflow: {avgSpansPerWorkflow} spans
          </label>
          <input
            type="range"
            min="8"
            max="64"
            step="4"
            value={avgSpansPerWorkflow}
            onChange={(e) => setAvgSpansPerWorkflow(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Sampling Strategy
          </label>
          <select
            value={samplingStrategy}
            onChange={(e) => setSamplingStrategy(e.target.value as SamplingStrategy)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="tail_based_smart">Tail-Based Smart (80% cut)</option>
            <option value="full_head_100">100% Head-Based Sampling</option>
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
          <div className="flex items-center justify-between text-cyan-400 text-[10px] font-bold uppercase mb-1">
            <span>Elesium Async OTel</span>
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-bold text-white">+{results.asyncBatchOtel.p99LatencyOverheadMs}ms</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            MTTR: {results.asyncBatchOtel.meanTimeToResolutionMinutes}m | {results.asyncBatchOtel.monthlyTelemetryDataGB} GB
          </div>
          <div className="text-[11px] font-bold text-cyan-300 mt-2">
            ${results.asyncBatchOtel.monthlyObservabilityCostUSD.toLocaleString()} / mo
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-amber-400 text-[10px] font-bold uppercase mb-1">
            <span>Sync Blocking APM</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-slate-200">+{results.syncBlockingTracing.p99LatencyOverheadMs}ms</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            MTTR: {results.syncBlockingTracing.meanTimeToResolutionMinutes}m | {results.syncBlockingTracing.monthlyTelemetryDataGB} GB
          </div>
          <div className="text-[11px] font-bold text-amber-300 mt-2">
            ${results.syncBlockingTracing.monthlyObservabilityCostUSD.toLocaleString()} / mo
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center justify-between text-rose-400 text-[10px] font-bold uppercase mb-1">
            <span>Unmonitored Mesh</span>
            <Clock className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-300">0.0ms</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            MTTR: {results.unmonitoredMesh.meanTimeToResolutionMinutes}m (4.2h blind)
          </div>
          <div className="text-[11px] font-bold text-slate-400 mt-2">
            $0 / mo (High Downtime)
          </div>
        </div>
      </div>

      {/* Footer & Watermark Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            Reduces incident MTTR by {results.mttrReductionPct}% with non-blocking RingBuffer batching.
          </span>
        </div>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          <span>Elesium Sovereign AI Systems</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
