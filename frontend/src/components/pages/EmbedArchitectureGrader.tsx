import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Gauge,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';
import {
  calculateArchitectureGrades,
  formatCurrencyValue,
  ConcurrencyChoice,
  TopologyChoice,
  InferenceBoundaryChoice,
  StatePersistenceChoice,
  ComplianceChoice,
  Currency
} from '../calculator/architectureGraderModel';

export default function EmbedArchitectureGrader() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [concurrency, setConcurrency] = useState<ConcurrencyChoice>('unconstrained_react');
  const [topology, setTopology] = useState<TopologyChoice>('monolithic_prompt');
  const [inferenceBoundary, setInferenceBoundary] = useState<InferenceBoundaryChoice>('shared_public_api');
  const [statePersistence, setStatePersistence] = useState<StatePersistenceChoice>('volatile_memory');
  const [complianceGuardrails, setComplianceGuardrails] = useState<ComplianceChoice>('regex_keyword_filter');
  const monthlyVolume = 50000;

  const results = useMemo(() => {
    return calculateArchitectureGrades({
      concurrency,
      topology,
      inferenceBoundary,
      statePersistence,
      complianceGuardrails,
      monthlyVolume,
      currency
    });
  }, [concurrency, topology, inferenceBoundary, statePersistence, complianceGuardrails, monthlyVolume, currency]);

  return (
    <>
      <Helmet>
        <title>Enterprise AI Architecture Fragility Grader Widget | Elesium</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/embed/architecture-grader" />
      </Helmet>

      <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-slate-800 rounded-2xl shadow-xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-blue-400" />
              <span className="font-bold text-sm tracking-tight text-white">
                Enterprise Agentic Architecture Grader
              </span>
            </div>
            {/* Currency selector */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-[10px]">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'INR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Diagnostic Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            {/* Concurrency */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                State & Workflow Routing:
              </label>
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(e.target.value as ConcurrencyChoice)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="unconstrained_react">Unconstrained ReAct Loop (Fragile)</option>
                <option value="linear_chain">Linear Single-Path Chain</option>
                <option value="heuristic_router">Heuristic LLM Router</option>
                <option value="deterministic_fsm">Deterministic State Machine (Sovereign)</option>
              </select>
            </div>

            {/* Topology */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Orchestration Topology:
              </label>
              <select
                value={topology}
                onChange={(e) => setTopology(e.target.value as TopologyChoice)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="monolithic_prompt">Monolithic Mega-Prompt Agent</option>
                <option value="uncontrolled_swarm">Autonomous Peer Swarm</option>
                <option value="hierarchical_supervisor">Hierarchical Supervisor</option>
                <option value="isolated_dag_circuit_breaker">Sandboxed DAG + Circuit Breakers</option>
              </select>
            </div>

            {/* Inference Boundary */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                Inference Boundary:
              </label>
              <select
                value={inferenceBoundary}
                onChange={(e) => setInferenceBoundary(e.target.value as InferenceBoundaryChoice)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="shared_public_api">Shared Public APIs (OpenAI/Anthropic)</option>
                <option value="cloud_provisioned">Hyperscaler Provisioned Throughput</option>
                <option value="dedicated_vpc_vllm">Dedicated Private VPC (vLLM)</option>
                <option value="on_prem_airgap">On-Premises Air-Gapped Hardware</option>
              </select>
            </div>

            {/* State Persistence */}
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <label className="text-[11px] text-slate-400 font-medium block mb-1">
                State Persistence & Memory:
              </label>
              <select
                value={statePersistence}
                onChange={(e) => setStatePersistence(e.target.value as StatePersistenceChoice)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="volatile_memory">Volatile In-Memory RAM</option>
                <option value="naive_vector_rag">Naive Vector Similarity Search</option>
                <option value="hybrid_session_checkpoint">Hybrid Retrieval + PostgreSQL</option>
                <option value="cryptographic_audit_ledger">Cryptographic Audit Ledger</option>
              </select>
            </div>
          </div>

          {/* Compliance */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 mb-4 text-xs">
            <label className="text-[11px] text-slate-400 font-medium block mb-1">
              Validation & Compliance:
            </label>
            <select
              value={complianceGuardrails}
              onChange={(e) => setComplianceGuardrails(e.target.value as ComplianceChoice)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="no_validation">No Output Validation (Direct DB/UI)</option>
              <option value="regex_keyword_filter">Rudimentary Regex Blocklists</option>
              <option value="semantic_guardrail_model">Semantic Guardrails (Llama Guard)</option>
              <option value="typed_schema_dpdp_sanitizer">Pydantic Schema + DPDP Act 2023 Redaction</option>
            </select>
          </div>

          {/* Telemetry Scorecard */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Readiness Score</span>
              <div className="text-2xl font-bold font-mono text-white">
                {results.readinessScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${results.readinessScore}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Fragility Index</span>
              <div className={`text-2xl font-bold font-mono ${
                results.fragilityScore > 50 ? 'text-red-400' : results.fragilityScore > 25 ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {results.fragilityScore}<span className="text-xs text-slate-500">%</span>
              </div>
              <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full ${
                    results.fragilityScore > 50 ? 'bg-red-500' : results.fragilityScore > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${results.fragilityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Financial Exposure Preview */}
          <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-red-300 font-semibold">
                Estimated Annual Financial Leakage:
              </span>
              <span className="text-sm font-extrabold text-white font-mono">
                {formatCurrencyValue(results.financialLeakage.totalAnnualLeakage, currency)}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Token loop hemorrhages, manual triage overhead, and regulatory exposure based on 50,000 monthly executions.
            </p>
          </div>
        </div>

        {/* Footer & Watermark Backlink */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <a
            href="https://elesium.online/compare"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
          >
            <span>Evaluated via</span>
            <strong className="text-blue-400 underline">Elesium Architecture Battlecards</strong>
            <ArrowUpRight className="w-3 h-3 text-blue-400" />
          </a>

          <a
            href="https://elesium.online/tools/agentic-architecture-grader"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
          >
            <span>Run Full Diagnostic Audit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </>
  );
}
