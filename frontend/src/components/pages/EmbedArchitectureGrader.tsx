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

      <div className="bg-black text-white p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-white/10 rounded-xl">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-white" />
              <span className="font-bold text-sm tracking-tight text-white">
                Enterprise Agentic Architecture Grader
              </span>
            </div>
            {/* Currency selector */}
            <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-md border border-white/10 text-[10px]">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-medium active:scale-[0.97] transition-all ${
                  currency === 'USD' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded font-medium active:scale-[0.97] transition-all ${
                  currency === 'INR' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Diagnostic Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            {/* Concurrency */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10">
              <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                State &amp; Workflow Routing:
              </label>
              <select
                value={concurrency}
                onChange={(e) => setConcurrency(e.target.value as ConcurrencyChoice)}
                className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="unconstrained_react">Unconstrained ReAct Loop (Fragile)</option>
                <option value="linear_chain">Linear Single-Path Chain</option>
                <option value="heuristic_router">Heuristic LLM Router</option>
                <option value="deterministic_fsm">Deterministic State Machine (Sovereign)</option>
              </select>
            </div>

            {/* Topology */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10">
              <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                Orchestration Topology:
              </label>
              <select
                value={topology}
                onChange={(e) => setTopology(e.target.value as TopologyChoice)}
                className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="monolithic_prompt">Monolithic Mega-Prompt Agent</option>
                <option value="uncontrolled_swarm">Autonomous Peer Swarm</option>
                <option value="hierarchical_supervisor">Hierarchical Supervisor</option>
                <option value="isolated_dag_circuit_breaker">Sandboxed DAG + Circuit Breakers</option>
              </select>
            </div>

            {/* Inference Boundary */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10">
              <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                Inference Boundary:
              </label>
              <select
                value={inferenceBoundary}
                onChange={(e) => setInferenceBoundary(e.target.value as InferenceBoundaryChoice)}
                className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="shared_public_api">Shared Public APIs (OpenAI/Anthropic)</option>
                <option value="cloud_provisioned">Hyperscaler Provisioned Throughput</option>
                <option value="dedicated_vpc_vllm">Dedicated Private VPC (vLLM)</option>
                <option value="on_prem_airgap">On-Premises Air-Gapped Hardware</option>
              </select>
            </div>

            {/* State Persistence */}
            <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10">
              <label className="text-[11px] text-neutral-400 font-medium block mb-1">
                State Persistence &amp; Memory:
              </label>
              <select
                value={statePersistence}
                onChange={(e) => setStatePersistence(e.target.value as StatePersistenceChoice)}
                className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="volatile_memory">Volatile In-Memory RAM</option>
                <option value="naive_vector_rag">Naive Vector Similarity Search</option>
                <option value="hybrid_session_checkpoint">Hybrid Retrieval + PostgreSQL</option>
                <option value="cryptographic_audit_ledger">Cryptographic Audit Ledger</option>
              </select>
            </div>
          </div>

          {/* Compliance */}
          <div className="p-2.5 rounded-xl bg-neutral-950 border border-white/10 mb-4 text-xs">
            <label className="text-[11px] text-neutral-400 font-medium block mb-1">
              Validation &amp; Compliance:
            </label>
            <select
              value={complianceGuardrails}
              onChange={(e) => setComplianceGuardrails(e.target.value as ComplianceChoice)}
              className="w-full bg-black border border-white/10 rounded-lg p-1.5 text-xs text-white focus:outline-none"
            >
              <option value="no_validation">No Output Validation (Direct DB/UI)</option>
              <option value="regex_keyword_filter">Rudimentary Regex Blocklists</option>
              <option value="semantic_guardrail_model">Semantic Guardrails (Llama Guard)</option>
              <option value="typed_schema_dpdp_sanitizer">Pydantic Schema + DPDP Act 2023 Redaction</option>
            </select>
          </div>

          {/* Telemetry Scorecard */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl bg-neutral-950 border border-white/10">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Readiness Score</span>
              <div className="text-2xl font-bold font-mono text-white">
                {results.readinessScore}<span className="text-xs text-neutral-500">/100</span>
              </div>
              <div className="w-full bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-white h-full" style={{ width: `${results.readinessScore}%` }} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-950 border border-white/10">
              <span className="text-[10px] text-neutral-400 block mb-0.5">Fragility Index</span>
              <div className="text-2xl font-bold font-mono text-white">
                {results.fragilityScore}<span className="text-xs text-neutral-500">%</span>
              </div>
              <div className="w-full bg-neutral-800 h-1 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-white h-full"
                  style={{ width: `${results.fragilityScore}%` }}
                />
              </div>
            </div>
          </div>

          {/* Financial Exposure Preview */}
          <div className="p-3.5 rounded-xl bg-neutral-950 border border-white/15 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-300 font-semibold">
                Estimated Annual Financial Leakage:
              </span>
              <span className="text-sm font-extrabold text-white font-mono">
                {formatCurrencyValue(results.financialLeakage.totalAnnualLeakage, currency)}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-1">
              Token loop hemorrhages, manual triage overhead, and regulatory exposure based on 50,000 monthly executions.
            </p>
          </div>
        </div>

        {/* Footer & Watermark Backlink */}
        <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <a
            href="https://elesium.online/compare"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Evaluated via</span>
            <strong className="text-white underline">Elesium Architecture Battlecards</strong>
            <ArrowUpRight className="w-3 h-3 text-white" />
          </a>

          <a
            href="https://elesium.online/tools/agentic-architecture-grader"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-semibold text-xs active:scale-[0.97] transition-all"
          >
            <span>Run Full Diagnostic Audit</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </>
  );
}
