import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Gauge,
  Cpu,
  ArrowRight,
  ChevronDown,
  Copy,
  Check,
  ExternalLink,
  Code
} from 'lucide-react';
import {
  calculateArchitectureGrades,
  formatCurrencyValue,
  CONCURRENCY_OPTIONS,
  TOPOLOGY_OPTIONS,
  INFERENCE_OPTIONS,
  STATE_OPTIONS,
  COMPLIANCE_OPTIONS,
  ConcurrencyChoice,
  TopologyChoice,
  InferenceBoundaryChoice,
  StatePersistenceChoice,
  ComplianceChoice,
  Currency
} from '../calculator/architectureGraderModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';

export default function AgenticArchitectureGrader() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // State
  const [currency, setCurrency] = useState<Currency>('USD');
  const [concurrency, setConcurrency] = useState<ConcurrencyChoice>('unconstrained_react');
  const [topology, setTopology] = useState<TopologyChoice>('monolithic_prompt');
  const [inferenceBoundary, setInferenceBoundary] = useState<InferenceBoundaryChoice>('shared_public_api');
  const [statePersistence, setStatePersistence] = useState<StatePersistenceChoice>('volatile_memory');
  const [complianceGuardrails, setComplianceGuardrails] = useState<ComplianceChoice>('regex_keyword_filter');
  const [monthlyVolume, setMonthlyVolume] = useState<number>(50000);

  // UI Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Compute Results
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

  // Handle Embed Code
  const embedCode = `<iframe src="https://elesium.online/embed/architecture-grader" width="100%" height="780" frameborder="0" style="border-radius:16px;border:1px solid #334155;"></iframe><div style="font-size:12px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Evaluated via <a href="https://elesium.online/compare" target="_blank" rel="noopener" style="color:#3b82f6;text-decoration:underline;">Elesium Enterprise AI Architecture Battlecards</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  // Handle Diagnostic Memo Copy
  const copyDiagnosticMemo = () => {
    const memoText = `
================================================================================
ELESIUM ENTERPRISE AGENTIC ARCHITECTURE DIAGNOSTIC MEMO
================================================================================
Generated: ${new Date().toISOString().split('T')[0]}
Target Scale: ${monthlyVolume.toLocaleString()} Monthly Executions | Currency: ${currency}

OVERALL READINESS SCORE: ${results.readinessScore}/100
FRAGILITY INDEX: ${results.fragilityScore}%
CLASSIFICATION TIER: ${results.tier.title}
ESTIMATED FAILURE PROBABILITY: ${results.failureProbabilityPercent}% per 1,000 runs
MEAN RUNS BETWEEN FAILURES (MTBF): ~${results.mtbfRuns.toLocaleString()} runs

FINANCIAL LEAKAGE EXPOSURE (ANNUAL):
- Unconstrained Token Waste: ${formatCurrencyValue(results.financialLeakage.tokenWasteAnnual, currency)}
- Engineering Triage Overhead: ${formatCurrencyValue(results.financialLeakage.humanTriageAnnual, currency)}
- Regulatory & SLA Liability Risk: ${formatCurrencyValue(results.financialLeakage.regulatoryRiskAnnual, currency)}
--------------------------------------------------------------------------------
TOTAL ESTIMATED ANNUAL LEAKAGE: ${formatCurrencyValue(results.financialLeakage.totalAnnualLeakage, currency)}

DIMENSION-BY-DIMENSION BREAKDOWN:
1. Workflow Concurrency: ${results.dimensions[0].selectedLabel} (Score: ${results.dimensions[0].score}/100, Status: ${results.dimensions[0].status})
2. Orchestration Topology: ${results.dimensions[1].selectedLabel} (Score: ${results.dimensions[1].score}/100, Status: ${results.dimensions[1].status})
3. Inference Boundary: ${results.dimensions[2].selectedLabel} (Score: ${results.dimensions[2].score}/100, Status: ${results.dimensions[2].status})
4. State Persistence: ${results.dimensions[3].selectedLabel} (Score: ${results.dimensions[3].score}/100, Status: ${results.dimensions[3].status})
5. Statutory Compliance: ${results.dimensions[4].selectedLabel} (Score: ${results.dimensions[4].score}/100, Status: ${results.dimensions[4].status})

PRESCRIBED REMEDIATION ROADMAP:
${results.recommendedRoadmap.map(r => `[${r.phase}] ${r.title}\nAction: ${r.action}\nImpact: ${r.impact}\n`).join('\n')}

Audit Request: Schedule a 1-on-1 Architecture Teardown with Chaman Shah, Principal AI Systems Architect at https://elesium.online/audit
================================================================================
    `.trim();

    navigator.clipboard.writeText(memoText);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  // Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Enterprise Agentic Architecture Fragility & Readiness Grader',
    'url': 'https://elesium.online/tools/agentic-architecture-grader',
    'description': 'Interactive diagnostic assessment evaluating enterprise AI agent stacks across workflow concurrency, orchestration topologies, inference boundaries, state persistence, and DPDP Act 2023 compliance.',
    'applicationCategory': 'DeveloperApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'author': {
      '@type': 'Person',
      'name': 'Chaman Shah',
      'jobTitle': 'Principal AI Systems Architect'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Elesium',
      'url': 'https://elesium.online',
      'logo': 'https://elesium.online/assets/LOGO_NEW.png'
    }
  };

  const faqs = [
    {
      q: 'How does the Fragility Score correlate with production agent outages?',
      a: 'The Fragility Score calculates the mathematical compounding probability of unhandled runtime exceptions across multi-step DAG executions. Architectures with scores above 50% suffer from non-deterministic branching and context pollution, resulting in failure rates between 8% and 28% under concurrent enterprise load.'
    },
    {
      q: 'Why are unconstrained ReAct loops considered high fragility?',
      a: 'Autonomous ReAct (Reasoning + Acting) loops rely on the model itself to decide when an objective is complete without hard state machine edges. When encountering novel edge cases or malformed tool outputs, models enter recursive hallucination loops, consuming thousands of tokens without yielding valid outputs.'
    },
    {
      q: 'What is the fastest way to remediate volatile memory and public API risks?',
      a: 'Deploying an isolated LangGraph state graph backed by transactional PostgreSQL session checkpointers and self-hosting quantized open-weight models (vLLM on dedicated GPUs) eliminates 90%+ of production fragility while guaranteeing compliance with the DPDP Act 2023.'
    }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 pt-24 pb-24 selection:bg-blue-600 selection:text-white">
      <Helmet>
        <title>Enterprise Agentic Architecture Fragility & Readiness Grader | Elesium</title>
        <meta
          name="description"
          content="Assess your enterprise AI agent stack across 5 core dimensions: concurrency, orchestration topology, inference boundaries, state persistence, and compliance. Computes annual financial leakage."
        />
        <link rel="canonical" href="https://elesium.online/tools/agentic-architecture-grader" />
        <meta property="og:title" content="Enterprise Agentic Architecture Fragility & Readiness Grader | Elesium" />
        <meta
          property="og:description"
          content="Interactive architectural diagnostic for enterprise AI systems. Audit failure risk, runaway token burn, and DPDP compliance."
        />
        <meta property="og:url" content="https://elesium.online/tools/agentic-architecture-grader" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-blue-400 transition-colors">
              Architecture Hub
            </Link>
            <span>/</span>
            <span className="text-slate-200 font-medium">Architecture Grader</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmbedOpen(!isEmbedOpen)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-medium border border-slate-800 transition-colors"
            >
              <Code className="w-3.5 h-3.5 text-blue-400" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={copyDiagnosticMemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Diagnostic Memo'}</span>
            </button>
          </div>
        </div>

        {/* Embed Modal Drawer */}
        {isEmbedOpen && (
          <div className="mb-8 p-5 rounded-2xl bg-slate-900 border border-blue-500/30 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Embed Enterprise Architecture Grader</span>
              <button onClick={() => setIsEmbedOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-slate-400">
              Copy and paste this iframe snippet into your engineering docs, internal wiki, or client portal.
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="w-full bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs focus:outline-none"
              />
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shrink-0 transition-colors"
              >
                {hasCopiedEmbed ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {/* Title & Introduction */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase mb-3">
            <Gauge className="w-3.5 h-3.5" />
            Empirical Architecture Diagnostics
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Enterprise Agentic Architecture Grader
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
            Audit your autonomous multi-agent systems across five critical engineering dimensions: workflow concurrency, orchestration topology, inference isolation, state persistence, and compliance guardrails. Calculates structural fragility, failure probability, and annual financial token waste.
          </p>
        </header>

        {/* Main Interactive Grid: Configuration (Left) + Scorecard (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: 5 Diagnostic Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                Configure Current Stack Topology
              </h2>
              {/* Currency Toggle */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    currency === 'USD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors ${
                    currency === 'INR' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Dimension 1: Concurrency */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  Dimension 01: State & Workflow Routing
                </span>
                <span className="text-xs text-slate-400">Weight: 25%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(CONCURRENCY_OPTIONS) as ConcurrencyChoice[]).map((key) => {
                  const opt = CONCURRENCY_OPTIONS[key];
                  const isSelected = concurrency === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setConcurrency(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-emerald-400' : opt.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 2: Topology */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  Dimension 02: Orchestration Topology
                </span>
                <span className="text-xs text-slate-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(TOPOLOGY_OPTIONS) as TopologyChoice[]).map((key) => {
                  const opt = TOPOLOGY_OPTIONS[key];
                  const isSelected = topology === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTopology(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-emerald-400' : opt.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 3: Inference Boundary */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  Dimension 03: Inference Boundary & Data Residency
                </span>
                <span className="text-xs text-slate-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(INFERENCE_OPTIONS) as InferenceBoundaryChoice[]).map((key) => {
                  const opt = INFERENCE_OPTIONS[key];
                  const isSelected = inferenceBoundary === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setInferenceBoundary(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-emerald-400' : opt.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 4: State Persistence */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  Dimension 04: State Persistence & Memory
                </span>
                <span className="text-xs text-slate-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(STATE_OPTIONS) as StatePersistenceChoice[]).map((key) => {
                  const opt = STATE_OPTIONS[key];
                  const isSelected = statePersistence === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setStatePersistence(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-emerald-400' : opt.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 5: Compliance */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider">
                  Dimension 05: Validation & DPDP Act 2023 Compliance
                </span>
                <span className="text-xs text-slate-400">Weight: 15%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(COMPLIANCE_OPTIONS) as ComplianceChoice[]).map((key) => {
                  const opt = COMPLIANCE_OPTIONS[key];
                  const isSelected = complianceGuardrails === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setComplianceGuardrails(key)}
                      className={`text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-blue-950/40 border-blue-500 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-emerald-400' : opt.score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Volume Slider */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-200">
                  Target Production Scale (Runs / Month)
                </label>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {monthlyVolume.toLocaleString()} executions
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="250000"
                step="5000"
                value={monthlyVolume}
                onChange={(e) => setMonthlyVolume(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>5k runs</span>
                <span>50k runs</span>
                <span>100k runs</span>
                <span>250k runs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Enterprise Scorecard & Telemetry (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Scorecard Hero Card */}
              <div className={`p-6 rounded-3xl bg-slate-900 border ${results.tier.borderClass} shadow-2xl relative overflow-hidden`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
                    Diagnostic Scorecard
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${results.tier.badgeColor}`}>
                    {results.tier.title.split('/')[0]}
                  </span>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Readiness Score</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {results.readinessScore}<span className="text-base text-slate-500">/100</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${results.readinessScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <span className="text-[11px] text-slate-400 block mb-1">Fragility Index</span>
                    <div className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                      results.fragilityScore > 50 ? 'text-red-400' : results.fragilityScore > 25 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {results.fragilityScore}<span className="text-base text-slate-500">%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          results.fragilityScore > 50 ? 'bg-red-500' : results.fragilityScore > 25 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${results.fragilityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Operational Reliability Forecast */}
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Run Failure Rate:</span>
                    <span className="font-mono font-bold text-slate-200">
                      ~{results.failureProbabilityPercent}% per 1,000 runs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Mean Time Between Failures:</span>
                    <span className="font-mono font-bold text-slate-200">
                      ~{results.mtbfRuns.toLocaleString()} runs
                    </span>
                  </div>
                </div>

                {/* Financial Leakage Estimator */}
                <div className="p-4 rounded-2xl bg-red-950/20 border border-red-500/30 mb-6 space-y-2.5">
                  <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider block">
                    Estimated Annual Financial Leakage
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {formatCurrencyValue(results.financialLeakage.totalAnnualLeakage, currency)}
                    <span className="text-xs text-slate-400 font-sans font-normal ml-1">/ year</span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-red-950/60 text-[11px] text-slate-400">
                    <div className="flex justify-between">
                      <span>Token Waste & Runaway Loops:</span>
                      <span className="font-mono text-slate-300">
                        {formatCurrencyValue(results.financialLeakage.tokenWasteAnnual, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engineering Triage Overhead:</span>
                      <span className="font-mono text-slate-300">
                        {formatCurrencyValue(results.financialLeakage.humanTriageAnnual, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regulatory Non-Compliance Risk:</span>
                      <span className="font-mono text-slate-300">
                        {formatCurrencyValue(results.financialLeakage.regulatoryRiskAnnual, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="space-y-2">
                  <ExpandableScreen>
                    <ExpandableScreenTrigger>
                      <InteractiveHoverButton className="w-full bg-blue-600 text-white border-blue-500 hover:bg-blue-500 py-3 text-xs sm:text-sm">
                        Schedule Architecture Remediation Audit
                      </InteractiveHoverButton>
                    </ExpandableScreenTrigger>
                    <ExpandableScreenContent>
                      <MandateApplicationForm />
                    </ExpandableScreenContent>
                  </ExpandableScreen>

                  <button
                    onClick={() => openWhatsApp()}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    <span>Discuss Score with Chaman Shah</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Fast Comparison Quick Links */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">
                  Compare Production Frameworks
                </span>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/compare/deterministic-state-machines-vs-react-agents"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Deterministic FSM vs ReAct Loops</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  </Link>
                  <Link
                    to="/compare/private-vpc-vllm-vs-azure-openai"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>Private VPC vLLM vs Azure OpenAI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  </Link>
                  <Link
                    to="/compare/langgraph-vs-crewai-enterprise"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                  >
                    <span>LangGraph vs CrewAI Enterprise</span>
                    <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Dimension Diagnosis Breakdown */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Diagnostic Audit Trail
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Dimension-by-Dimension Technical Teardown
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.dimensions.map((dim, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold text-slate-400">0{idx + 1}. {dim.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dim.status === 'Elite' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      dim.status === 'Optimal' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                      dim.status === 'Warning' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {dim.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{dim.selectedLabel}</h3>
                  <div className="text-xs text-slate-400 mb-4 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                    <strong className="text-slate-300 block mb-1">Architectural Risk:</strong>
                    {dim.diagnosis}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-semibold text-blue-400 block mb-1">Remediation Action:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">{dim.remediation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Phase Transformation Roadmap */}
        <section className="mb-16 p-8 rounded-3xl bg-slate-900 border border-slate-800">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Prescribed Transformation Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Deterministic Remediation Blueprint
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Follow this phased transformation sequence to systematically eliminate runtime fragility and achieve 99.9% deterministic execution reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.recommendedRoadmap.map((step, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                    {step.phase}
                  </span>
                  <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">{step.action}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Expected Impact</span>
                  <span className="text-xs font-medium text-emerald-400">{step.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="mb-16 max-w-3xl">
          <div className="mb-6">
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              Diagnostic FAQs
            </span>
            <h2 className="text-2xl font-bold text-white mt-1">
              Frequently Asked Architecture Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 border-t border-slate-800/50 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <WhatsAppModal />
    </main>
  );
}
