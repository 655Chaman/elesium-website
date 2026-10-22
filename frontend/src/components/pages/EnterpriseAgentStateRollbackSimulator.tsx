import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import {
  simulateStateRollback,
  StateRollbackInputs
} from '../calculator/agentStateRollbackSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentStateRollbackSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyWorkflows, setMonthlyWorkflows] = useState<number>(350000);
  const [nodesPerWorkflow, setNodesPerWorkflow] = useState<number>(20);
  const [statePayloadSizeBytes, setStatePayloadSizeBytes] = useState<number>(65536); // 64 KB
  const [failureOrInterventionRatePct, setFailureOrInterventionRatePct] = useState<number>(8.5);
  const [avgRerunTokenCostUSD, setAvgRerunTokenCostUSD] = useState<number>(0.35);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: StateRollbackInputs = useMemo(() => ({
    monthlyWorkflows,
    nodesPerWorkflow,
    statePayloadSizeBytes,
    failureOrInterventionRatePct,
    avgRerunTokenCostUSD
  }), [
    monthlyWorkflows,
    nodesPerWorkflow,
    statePayloadSizeBytes,
    failureOrInterventionRatePct,
    avgRerunTokenCostUSD
  ]);

  const results = useMemo(() => {
    return simulateStateRollback(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-state-snapshot-rollback-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT STATE MACHINE PERSISTENCE & ROLLBACK MEMO
Workload Profile: ${(inputs.monthlyWorkflows / 1000).toFixed(0)}k workflows/mo | ${inputs.nodesPerWorkflow} nodes/DAG | ${(inputs.statePayloadSizeBytes / 1024).toFixed(0)} KB Context
Failure / Human Rejection Rate: ${inputs.failureOrInterventionRatePct}% (~${results.totalRollbacksPreventedPerMonth.toLocaleString()} rollbacks/mo)

ARCHITECTURAL COMPARISON:
1. Volatile In-Memory Execution:
   - Checkpoint Overhead: 0.0ms | Turnaround: ${(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s (Full Re-run)
   - Annual Wasted Token Loss: $${results.volatileMesh.annualizedTotalLossUSD.toLocaleString()} | Data Corruption Risk: ${results.volatileMesh.stateIntegrityRiskPct}%
2. Synchronous Blocking Relational Checkpointing (Postgres JSONB):
   - Critical Path Overhead: +${results.syncRelational.totalWorkflowLatencyOverheadMs}ms (+${results.syncRelational.perNodeCommitOverheadMs}ms/node)
   - Monthly Storage Footprint: ${(results.syncRelational.monthlyStorageFootprintMB / 1024).toFixed(1)} GB | Turnaround: ${(results.syncRelational.rollbackRecoveryTurnaroundMs / 1000).toFixed(2)}s
3. Elesium Sovereign Async Delta WAL Checkpointer:
   - Critical Path Overhead: +${results.sovereignDeltaWal.totalWorkflowLatencyOverheadMs}ms (+${results.sovereignDeltaWal.perNodeCommitOverheadMs}ms/node) [${results.latencyOverheadReductionPct}% reduction]
   - Rollback Recovery Speed: ${results.sovereignDeltaWal.rollbackRecoveryTurnaroundMs}ms [${results.recoveryTurnaroundReductionPct}% faster]
   - Monthly Storage Footprint: ${(results.sovereignDeltaWal.monthlyStorageFootprintMB / 1024).toFixed(1)} GB [93% compaction]
   - Net Annual Token & Infrastructure Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Replace naive synchronous DB writes or uncheckpointed execution with append-only Delta WAL state checkpointing.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why does uncheckpointed agent execution cause catastrophic token waste in enterprise DAGs?',
      a: 'When multi-agent workflows execute strictly in volatile memory, any downstream exception—such as an API rate-limit, invalid JSON formatting, tool timeout, or human-in-the-loop rejection—aborts the entire run. To retry, the orchestrator must re-run every preceding node from scratch, re-querying vector databases and re-billing thousands of prompt and completion tokens. At enterprise volume (350k+ runs/mo with an 8.5% intervention rate), uncheckpointed execution leaks tens of thousands of dollars monthly in redundant LLM spend and stalls operations for 15-45 seconds per failure.'
    },
    {
      q: 'How does synchronous relational checkpointing degrade agent critical-path latency?',
      a: 'Naive state persistence implementations commit the full JSON state payload to PostgreSQL, MySQL, or DynamoDB synchronously at the completion of every graph node. Each database roundtrip, JSON serialization pass, and fsync barrier incurs 20ms to 40ms of blocking delay. In a 20-node agent DAG, synchronous persistence adds 400ms to 800ms of non-LLM latency directly to the user-facing critical path, while duplicating large context payloads (documents, tool outputs) repeatedly in O(N^2) storage growth.'
    },
    {
      q: 'How does Elesium achieve sub-1.5ms checkpoint overhead with Delta WAL?',
      a: 'Elesium decouples state persistence from critical-path execution. Instead of serializing the entire state dictionary, our orchestrator computes an in-memory JSON Patch / MsgPack delta (retaining only changed keys, typically <6.5% of total state size). This delta is enqueued into a lock-free RingBuffer and asynchronously persisted to an append-only Write-Ahead Log (WAL) backed by Redis or NVMe-optimized ClickHouse. The agent graph advances immediately to the next node in under 1.5ms.'
    },
    {
      q: 'How does zero-downtime microsecond rollback work during human-in-the-loop rejection?',
      a: 'When an executive reviewer or validation guardrail rejects an agent proposal (e.g. flagging a hallucinated financial transfer or incorrect SQL query), Elesium rewinds the state machine by resetting the active state pointer to the last verified safe checkpoint snapshot ID. Because intermediate snapshots are already indexed in RAM, state restoration executes in under 12ms without reloading cold databases or re-running upstream steps.'
    },
    {
      q: 'How does the architecture prevent double-execution of external side effects during rollback?',
      a: 'Elesium assigns a deterministic, cryptographically signed idempotency token to every external tool invocation (e.g., ERP write, payment gateway call, email dispatch). When rolling back across a failed or rejected node, the state machine marks downstream tokens as cancelled. External integration adapters verify idempotency tokens prior to execution, guaranteeing that rewound actions are never executed twice in production systems.'
    },
    {
      q: 'What cloud infrastructure is required for Elesium sovereign checkpointing?',
      a: 'Elesium operates completely air-gapped within your sovereign private cloud (AWS VPC, GCP Cloud, or on-prem Kubernetes). Delta WAL snapshots can be hosted on a lightweight, clustered Redis/Valkey instance backed by local SSDs or private S3-compatible object storage. No state data, prompt contexts, or enterprise telemetry ever leaves your sovereign boundary.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Helmet>
        <title>Enterprise Agentic State Machine Snapshot &amp; Rollback Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark multi-agent state persistence architectures: volatile memory vs synchronous relational checkpointing vs sovereign Delta WAL. Calculate sub-1.5ms overhead, microsecond rollback, and zero rerun token waste."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-state-snapshot-rollback-simulator" />
      </Helmet>

      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/resources" className="hover:text-white transition-colors">Interactive Tools</Link>
            <span>/</span>
            <span className="text-cyan-400 font-mono">Agent State Snapshot &amp; Rollback Simulator</span>
          </div>
          <div className="flex items-center gap-2">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 font-mono"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Embed Sandbox</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 transition-colors border border-cyan-500/30 font-mono"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-4 uppercase tracking-wider">
            <RotateCcw className="w-3.5 h-3.5" />
            Deterministic Agentic State Persistence &amp; Zero-Downtime Rollback
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Enterprise Agentic State Machine Snapshot &amp; Rollback Simulator
          </h1>
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto">
            Benchmark multi-agent state persistence across uncheckpointed volatile meshes, naive synchronous Postgres JSONB commits, and sovereign async Delta WAL pipelines. Calculate sub-1.5ms overhead, microsecond rollback, and elimination of failed rerun token waste.
          </p>
        </div>

        {/* Primary Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div className="flex items-center gap-2 text-white font-semibold">
                <Sliders className="w-5 h-5 text-cyan-400" />
                <span>Workflow &amp; State Parameters</span>
              </div>
              <span className="text-xs font-mono text-slate-400">Production Model</span>
            </div>

            <div className="space-y-6">
              {/* Slider 1: Monthly Workflows */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Monthly Multi-Agent Workflows</span>
                  <span className="text-cyan-400 font-bold">{(monthlyWorkflows).toLocaleString()} runs</span>
                </div>
                <input
                  type="range"
                  min={25000}
                  max={1000000}
                  step={25000}
                  value={monthlyWorkflows}
                  onChange={(e) => setMonthlyWorkflows(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>25k runs/mo</span>
                  <span>500k</span>
                  <span>1.0M runs/mo</span>
                </div>
              </div>

              {/* Slider 2: Nodes per Workflow */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Graph Depth (Nodes per Workflow)</span>
                  <span className="text-cyan-400 font-bold">{nodesPerWorkflow} nodes/DAG</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={50}
                  step={2}
                  value={nodesPerWorkflow}
                  onChange={(e) => setNodesPerWorkflow(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>6 (Shallow)</span>
                  <span>24 (Complex)</span>
                  <span>50 (Deep Mesh)</span>
                </div>
              </div>

              {/* Slider 3: State Payload Size */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Context State Payload Size</span>
                  <span className="text-cyan-400 font-bold">{(statePayloadSizeBytes / 1024).toFixed(0)} KB / node</span>
                </div>
                <input
                  type="range"
                  min={8192}
                  max={262144}
                  step={8192}
                  value={statePayloadSizeBytes}
                  onChange={(e) => setStatePayloadSizeBytes(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>8 KB (Text)</span>
                  <span>64 KB (Documents)</span>
                  <span>256 KB (Heavy Payloads)</span>
                </div>
              </div>

              {/* Slider 4: Failure or Human Intervention Rate */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Rollback / Human Rejection Rate</span>
                  <span className="text-rose-400 font-bold">{failureOrInterventionRatePct.toFixed(1)}% ({results.totalRollbacksPreventedPerMonth.toLocaleString()} events)</span>
                </div>
                <input
                  type="range"
                  min={1.0}
                  max={25.0}
                  step={0.5}
                  value={failureOrInterventionRatePct}
                  onChange={(e) => setFailureOrInterventionRatePct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>1.0% (Stable)</span>
                  <span>8.5% (Enterprise)</span>
                  <span>25.0% (High Intervention)</span>
                </div>
              </div>

              {/* Slider 5: Token Rerun Cost */}
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Full Re-Run Token Cost</span>
                  <span className="text-emerald-400 font-bold">${avgRerunTokenCostUSD.toFixed(2)} / full rerun</span>
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={1.50}
                  step={0.05}
                  value={avgRerunTokenCostUSD}
                  onChange={(e) => setAvgRerunTokenCostUSD(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>$0.05 (GPT-4o-mini)</span>
                  <span>$0.35 (Sonnet 3.5)</span>
                  <span>$1.50 (Multi-Hop Complex)</span>
                </div>
              </div>
            </div>

            {/* Architecture Architecture Key Insights */}
            <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Delta WAL Compaction:</strong> Stores only state diffs (6.5%), eliminating O(N^2) JSON database bloat.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Microsecond Pointer Rewind:</strong> Resets DAG state pointer in &lt;12ms without cold database fetches.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span><strong className="text-white">Idempotency Guardrails:</strong> Protects payment gateways and ERP write-backs from duplicate execution.</span>
              </div>
            </div>
          </div>

          {/* Results Visualizer Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 4 Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Annual Savings
                </span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono block">
                  ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tokens &amp; IOPS Saved
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Latency Overhead Cut
                </span>
                <span className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono block">
                  {results.latencyOverheadReductionPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  +{results.sovereignDeltaWal.totalWorkflowLatencyOverheadMs}ms vs +{results.syncRelational.totalWorkflowLatencyOverheadMs}ms
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Rollback Speedup
                </span>
                <span className="text-xl sm:text-2xl font-bold text-purple-400 font-mono block">
                  {results.recoveryTurnaroundReductionPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {results.sovereignDeltaWal.rollbackRecoveryTurnaroundMs}ms vs {(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s
                </span>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-lg">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Integrity Risk
                </span>
                <span className="text-xl sm:text-2xl font-bold text-rose-400 font-mono block">
                  {results.sovereignDeltaWal.stateIntegrityRiskPct}%
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  vs {results.volatileMesh.stateIntegrityRiskPct}% Uncheckpointed
                </span>
              </div>
            </div>

            {/* Interactive State Machine DAG Visualizer Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                    State Machine Snapshot &amp; Rollback Mechanics
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  O(1) Pointer Reset
                </span>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">1. Ingest &amp; Tokenize</span>
                      <span className="font-mono text-[10px] text-emerald-400">Node #1</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Async delta patch written to RingBuffer. Checkpoint ID emitted.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/40 relative">
                    <div className="absolute -top-2 right-2 px-1.5 py-0.2 rounded bg-cyan-500 text-black font-mono text-[9px] font-bold">
                      Safe Snapshot
                    </div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-cyan-300">2. Verified Checkpoint</span>
                      <span className="font-mono text-[10px] text-cyan-400">Node #{Math.round(nodesPerWorkflow / 2)}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Immutable Delta WAL commit. In-memory state pointer locked.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-rose-500/40">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-rose-300">3. Human Rejection / Fault</span>
                      <span className="font-mono text-[10px] text-rose-400">Node #{nodesPerWorkflow}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Hallucination / API fault. Pointer resets to Node #{Math.round(nodesPerWorkflow / 2)} in &lt;12ms.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-xl text-xs text-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>Rollback Turnaround: <strong>11ms</strong> (Pointer swap) vs <strong>{(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s</strong> (Full token re-run)</span>
                  </div>
                  <span className="font-mono text-cyan-300 text-[11px]">99.8% Faster</span>
                </div>
              </div>
            </div>

            {/* Comprehensive 3-Way Architectural Comparison Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-slate-800 pb-3 mb-4">
                Architecture Benchmark Breakdown
              </h3>

              <div className="space-y-4">
                {/* 1. Volatile In-Memory */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-rose-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <h4 className="font-bold text-rose-300 text-sm">Volatile In-Memory Mesh (Uncheckpointed)</h4>
                    </div>
                    <span className="font-mono text-xs text-rose-400 font-semibold">
                      ${(results.volatileMesh.annualizedTotalLossUSD / 1000).toFixed(1)}k annual loss
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.volatileMesh.rollbackVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Commit Overhead: <strong className="text-white">0.0ms</strong></div>
                    <div>Rollback Turnaround: <strong className="text-rose-400">{(results.volatileMesh.rollbackRecoveryTurnaroundMs / 1000).toFixed(1)}s</strong></div>
                    <div>Rerun Waste: <strong className="text-rose-400">${results.volatileMesh.monthlyWastedRerunTokensUSD.toLocaleString()}/mo</strong></div>
                  </div>
                </div>

                {/* 2. Synchronous Postgres JSONB */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-amber-900/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <h4 className="font-bold text-amber-300 text-sm">Synchronous Blocking Relational Checkpointing (Postgres JSONB)</h4>
                    </div>
                    <span className="font-mono text-xs text-amber-400 font-semibold">
                      +{results.syncRelational.totalWorkflowLatencyOverheadMs}ms critical path
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3">
                    {results.syncRelational.rollbackVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/50 p-2 rounded-lg">
                    <div>Per-Node Commit: <strong className="text-amber-400">+{results.syncRelational.perNodeCommitOverheadMs}ms</strong></div>
                    <div>Monthly Footprint: <strong className="text-amber-400">{(results.syncRelational.monthlyStorageFootprintMB / 1024).toFixed(1)} GB</strong></div>
                    <div>Rollback Turnaround: <strong className="text-amber-400">{(results.syncRelational.rollbackRecoveryTurnaroundMs / 1000).toFixed(2)}s</strong></div>
                  </div>
                </div>

                {/* 3. Elesium Sovereign Delta WAL */}
                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                      <h4 className="font-bold text-cyan-300 text-sm">Elesium Sovereign Async Delta WAL Checkpointer</h4>
                    </div>
                    <span className="font-mono text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Recommended Enterprise Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-3">
                    {results.sovereignDeltaWal.rollbackVerdict}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-200 bg-slate-900/80 p-2 rounded-lg">
                    <div>Per-Node Commit: <strong className="text-cyan-300">+{results.sovereignDeltaWal.perNodeCommitOverheadMs}ms</strong></div>
                    <div>Monthly Footprint: <strong className="text-cyan-300">{(results.sovereignDeltaWal.monthlyStorageFootprintMB / 1024).toFixed(1)} GB</strong></div>
                    <div>Rollback Turnaround: <strong className="text-emerald-400">{results.sovereignDeltaWal.rollbackRecoveryTurnaroundMs}ms</strong></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive: Feature Comparison Matrix */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-16">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              State Persistence &amp; Rollback Architectural Specification
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Rigorous engineering criteria separating toy agent scripts from production enterprise state machines.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
                  <th className="py-3 px-4">Architectural Dimension</th>
                  <th className="py-3 px-4">Volatile In-Memory Mesh</th>
                  <th className="py-3 px-4">Synchronous Postgres JSONB</th>
                  <th className="py-3 px-4 text-cyan-400">Elesium Sovereign Delta WAL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Critical Path Latency Penalty</td>
                  <td className="py-3 px-4 font-mono text-emerald-400">0.0ms (Zero writes)</td>
                  <td className="py-3 px-4 font-mono text-rose-400">+25ms to +40ms / node</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">+1.4ms (Async RingBuffer)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Rollback Recovery Turnaround</td>
                  <td className="py-3 px-4 font-mono text-rose-400">18s - 45s (Full DAG Re-run)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">1.2s - 2.5s (Cold Deserialization)</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">&lt;12ms (O(1) Pointer Reset)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">State Storage Growth Complexity</td>
                  <td className="py-3 px-4 font-mono text-slate-400">O(1) - Zero Persistence</td>
                  <td className="py-3 px-4 font-mono text-rose-400">O(N^2) Full Payload Bloat</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">O(N) Delta Diff Patches</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">External Side-Effect Idempotency</td>
                  <td className="py-3 px-4 font-mono text-rose-400">None (Duplicate ERP commits)</td>
                  <td className="py-3 px-4 font-mono text-amber-400">Relational Row Locks</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Cryptographic Token Revocation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Human-in-the-Loop Resumption</td>
                  <td className="py-3 px-4 font-mono text-rose-400">Impossible (Process kills state)</td>
                  <td className="py-3 px-4 font-mono text-slate-300">Database Polling</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Zero-Downtime Event Dispatch</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Sovereign Deployment Isolation</td>
                  <td className="py-3 px-4 font-mono text-slate-400">Local Container Memory</td>
                  <td className="py-3 px-4 font-mono text-slate-300">Managed RDS / Cloud SQL</td>
                  <td className="py-3 px-4 font-mono text-cyan-400">Private VPC Redis / ClickHouse</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Technical FAQ Accordion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl mb-16">
          <div className="border-b border-slate-800 pb-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Enterprise State Machine &amp; Rollback Engineering FAQ
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Direct technical answers for Chief Technology Officers, AI Systems Architects, and Infrastructure Leads.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-slate-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Commercial CTA & Architecture Audit Banner */}
        <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 border border-cyan-500/30 rounded-2xl p-8 sm:p-12 shadow-2xl text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Enterprise AI Systems Architecture Intake
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Eliminate Failed Workflow Rerun Costs in Production
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Elesium architects and deploys sovereign, deterministic multi-agent state machines with sub-1.5ms Delta WAL checkpointing and microsecond zero-downtime rollback for enterprise logistics, BFSI, and manufacturing infrastructure.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <Link
                to="/solutions"
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
              >
                Explore All Sovereign Solutions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-cyan-400" />
              Embed This State Machine Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this snippet into your engineering documentation, intranet, or technical blog:
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs text-slate-300 overflow-x-auto mb-4 select-all">
              {embedCode}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Watermarked to Elesium Sovereign Architecture</span>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Code Copied!' : 'Copy Embed Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
