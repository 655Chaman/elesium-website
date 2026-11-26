import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

Audit Request: Schedule a 1-on-1 Architecture Teardown with Chaman Shah, Principal AI Systems Architect at https://elesium.online/audit/
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
    'url': 'https://elesium.online/tools/agentic-architecture-grader/',
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
      'logo': 'https://elesium.online/assets/logo-square.png'
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
    <main className="min-h-screen bg-black text-white pt-24 pb-24 selection:bg-white selection:text-black">
      <Helmet>
        <title>Enterprise Agentic Architecture Fragility & Readiness Grader | Elesium</title>
        <meta
          name="description"
          content="Assess your enterprise AI agent stack across 5 core dimensions: concurrency, orchestration topology, inference boundaries, state persistence, and compliance. Computes annual financial leakage."
        />
        <link rel="canonical" href="https://elesium.online/tools/agentic-architecture-grader/" />
        <meta property="og:title" content="Enterprise Agentic Architecture Fragility & Readiness Grader | Elesium" />
        <meta
          property="og:description"
          content="Interactive architectural diagnostic for enterprise AI systems. Audit failure risk, runaway token burn, and DPDP compliance."
        />
        <meta property="og:url" content="https://elesium.online/tools/agentic-architecture-grader/" />
        <meta property="og:type" content="website" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-neutral-400">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/compare/" className="hover:text-white transition-colors">
              Architecture Hub
            </Link>
            <span>/</span>
            <span className="text-white font-medium">Architecture Grader</span>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEmbedOpen(!isEmbedOpen)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-neutral-950 hover:bg-neutral-900 text-neutral-200 text-xs font-medium border border-white/10 active:scale-[0.97] transition-all duration-300"
            >
              <Code className="w-3.5 h-3.5 text-white" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={copyDiagnosticMemo}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold active:scale-[0.97] transition-all duration-300"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Diagnostic Memo'}</span>
            </button>
          </div>
        </div>

        {/* Embed Modal Drawer */}
        <AnimatePresence>
          {isEmbedOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="mb-8 p-6 rounded-[24px] bg-neutral-950 border border-white/15 text-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">Embed Enterprise Architecture Grader</span>
                <button onClick={() => setIsEmbedOpen(false)} className="text-neutral-400 hover:text-white">✕</button>
              </div>
              <p className="text-neutral-400">
                Copy and paste this iframe snippet into your engineering docs, internal wiki, or client portal.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={embedCode}
                  className="w-full bg-black p-3 rounded-xl border border-white/10 text-neutral-300 font-mono text-xs focus:outline-none"
                />
                <button
                  onClick={copyEmbedCode}
                  className="px-5 py-3 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold shrink-0 active:scale-[0.97] transition-all duration-300"
                >
                  {hasCopiedEmbed ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Title & Introduction */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-neutral-300 text-xs font-semibold tracking-wider uppercase mb-3">
            <Gauge className="w-3.5 h-3.5 text-white" />
            Empirical Architecture Diagnostics
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
            Enterprise Agentic Architecture Grader
          </h1>
          <p className="text-base sm:text-lg text-neutral-400 max-w-4xl leading-relaxed">
            Audit your autonomous multi-agent systems across five critical engineering dimensions: workflow concurrency, orchestration topology, inference isolation, state persistence, and compliance guardrails. Calculates structural fragility, failure probability, and annual financial token waste.
          </p>
        </header>

        {/* Main Interactive Grid: Configuration (Left) + Scorecard (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Left Column: 5 Diagnostic Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-white" />
                Configure Current Stack Topology
              </h2>
              {/* Currency Toggle */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-full border border-white/10 text-xs">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-full font-medium active:scale-[0.97] transition-all duration-300 ${
                    currency === 'USD' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-full font-medium active:scale-[0.97] transition-all duration-300 ${
                    currency === 'INR' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
              </div>
            </div>

            {/* Dimension 1: Concurrency */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Dimension 01: State & Workflow Routing
                </span>
                <span className="text-xs text-neutral-400">Weight: 25%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(CONCURRENCY_OPTIONS) as ConcurrencyChoice[]).map((key) => {
                  const opt = CONCURRENCY_OPTIONS[key];
                  const isSelected = concurrency === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setConcurrency(key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border-white'
                          : 'bg-black border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-white' : opt.score >= 40 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 2: Topology */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Dimension 02: Orchestration Topology
                </span>
                <span className="text-xs text-neutral-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(TOPOLOGY_OPTIONS) as TopologyChoice[]).map((key) => {
                  const opt = TOPOLOGY_OPTIONS[key];
                  const isSelected = topology === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setTopology(key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border-white'
                          : 'bg-black border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-white' : opt.score >= 40 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 3: Inference Boundary */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Dimension 03: Inference Boundary & Data Residency
                </span>
                <span className="text-xs text-neutral-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(INFERENCE_OPTIONS) as InferenceBoundaryChoice[]).map((key) => {
                  const opt = INFERENCE_OPTIONS[key];
                  const isSelected = inferenceBoundary === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setInferenceBoundary(key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border-white'
                          : 'bg-black border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-white' : opt.score >= 40 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 4: State Persistence */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Dimension 04: State Persistence & Memory
                </span>
                <span className="text-xs text-neutral-400">Weight: 20%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(STATE_OPTIONS) as StatePersistenceChoice[]).map((key) => {
                  const opt = STATE_OPTIONS[key];
                  const isSelected = statePersistence === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setStatePersistence(key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border-white'
                          : 'bg-black border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-white' : opt.score >= 40 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension 5: Compliance */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider">
                  Dimension 05: Validation & DPDP Act 2023 Compliance
                </span>
                <span className="text-xs text-neutral-400">Weight: 15%</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.keys(COMPLIANCE_OPTIONS) as ComplianceChoice[]).map((key) => {
                  const opt = COMPLIANCE_OPTIONS[key];
                  const isSelected = complianceGuardrails === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setComplianceGuardrails(key)}
                      className={`text-left p-4 rounded-2xl border transition-all duration-300 ${
                        isSelected
                          ? 'bg-white/10 border-white'
                          : 'bg-black border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-neutral-200'}`}>
                          {opt.label}
                        </span>
                        <span className={`text-[11px] font-mono font-semibold ${opt.score >= 80 ? 'text-white' : opt.score >= 40 ? 'text-neutral-300' : 'text-neutral-500'}`}>
                          Score: {opt.score}/100
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">{opt.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Monthly Volume Slider */}
            <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-200">
                  Target Production Scale (Runs / Month)
                </label>
                <span className="text-xs font-mono font-bold text-white">
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
                className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
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
              <div className="p-6 sm:p-7 rounded-[28px] bg-neutral-950 border border-white/20 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                    Diagnostic Scorecard
                  </span>
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold border bg-white/10 text-white border-white/20">
                    {results.tier.title.split('/')[0]}
                  </span>
                </div>

                {/* Score Meters */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 rounded-[18px] bg-black border border-white/10 h-full flex flex-col justify-between">
                    <span className="text-[11px] text-neutral-400 block mb-1">Readiness Score</span>
                    <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                      {results.readinessScore}<span className="text-base text-neutral-500">/100</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-white h-full transition-all duration-300"
                        style={{ width: `${results.readinessScore}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-[18px] bg-black border border-white/10 h-full flex flex-col justify-between">
                    <span className="text-[11px] text-neutral-400 block mb-1">Fragility Index</span>
                    <div className={`text-3xl sm:text-4xl font-extrabold font-mono ${
                      results.fragilityScore > 50 ? 'text-white' : results.fragilityScore > 25 ? 'text-neutral-300' : 'text-neutral-400'
                    }`}>
                      {results.fragilityScore}<span className="text-base text-neutral-500">%</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          results.fragilityScore > 50 ? 'bg-white' : results.fragilityScore > 25 ? 'bg-neutral-400' : 'bg-neutral-600'
                        }`}
                        style={{ width: `${results.fragilityScore}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Operational Reliability Forecast */}
                <div className="p-4 rounded-[18px] bg-black border border-white/10 mb-6 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Run Failure Rate:</span>
                    <span className="font-mono font-bold text-neutral-200">
                      ~{results.failureProbabilityPercent}% per 1,000 runs
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-400">Mean Time Between Failures:</span>
                    <span className="font-mono font-bold text-neutral-200">
                      ~{results.mtbfRuns.toLocaleString()} runs
                    </span>
                  </div>
                </div>

                {/* Financial Leakage Estimator */}
                <div className="p-4 rounded-[18px] bg-black border border-white/15 mb-6 space-y-2.5">
                  <span className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider block">
                    Estimated Annual Financial Leakage
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {formatCurrencyValue(results.financialLeakage.totalAnnualLeakage, currency)}
                    <span className="text-xs text-neutral-400 font-sans font-normal ml-1">/ year</span>
                  </div>
                  <div className="space-y-1 pt-2 border-t border-white/10 text-[11px] text-neutral-400">
                    <div className="flex justify-between">
                      <span>Token Waste & Runaway Loops:</span>
                      <span className="font-mono text-neutral-300">
                        {formatCurrencyValue(results.financialLeakage.tokenWasteAnnual, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Engineering Triage Overhead:</span>
                      <span className="font-mono text-neutral-300">
                        {formatCurrencyValue(results.financialLeakage.humanTriageAnnual, currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Regulatory Non-Compliance Risk:</span>
                      <span className="font-mono text-neutral-300">
                        {formatCurrencyValue(results.financialLeakage.regulatoryRiskAnnual, currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => openWhatsApp()}
                    className="w-full px-5 py-3 rounded-full bg-white hover:bg-neutral-200 active:scale-[0.97] text-black font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <span>Chat on WhatsApp</span>
                  </button>
                  <ExpandableScreen>
                    <ExpandableScreenTrigger>
                      <InteractiveHoverButton className="w-full bg-white text-black border-white hover:bg-neutral-200 py-3 text-xs sm:text-sm">
                        Schedule Architecture Remediation Audit
                      </InteractiveHoverButton>
                    </ExpandableScreenTrigger>
                    <ExpandableScreenContent>
                      <MandateApplicationForm />
                    </ExpandableScreenContent>
                  </ExpandableScreen>

                  <button
                    onClick={() => openWhatsApp()}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-black hover:bg-neutral-900 active:scale-[0.97] text-neutral-200 text-xs font-semibold border border-white/15 transition-all duration-300"
                  >
                    <span>Discuss Score with Chaman Shah</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>

              {/* Fast Comparison Quick Links */}
              <div className="p-6 rounded-[24px] bg-neutral-950 border border-white/10">
                <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-3">
                  Compare Production Frameworks
                </span>
                <div className="space-y-2 text-xs">
                  <Link
                    to="/compare/deterministic-state-machines-vs-react-agents/"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>Deterministic FSM vs ReAct Loops</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                  <Link
                    to="/compare/private-vpc-vllm-vs-azure-openai/"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>Private VPC vLLM vs Azure OpenAI</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                  <Link
                    to="/compare/langgraph-vs-crewai-enterprise/"
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-neutral-300 hover:text-white transition-colors"
                  >
                    <span>LangGraph vs CrewAI Enterprise</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Dimension Diagnosis Breakdown */}
        <section className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
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
                className="p-6 rounded-[24px] bg-neutral-950 border border-white/10 flex flex-col justify-between h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold text-neutral-400">0{idx + 1}. {dim.name}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      dim.status === 'Elite' ? 'bg-white text-black border-white' :
                      dim.status === 'Optimal' ? 'bg-white/15 text-white border-white/25' :
                      dim.status === 'Warning' ? 'bg-white/5 text-neutral-300 border-white/15' :
                      'bg-black text-neutral-400 border-white/10'
                    }`}>
                      {dim.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2">{dim.selectedLabel}</h3>
                  <div className="text-xs text-neutral-400 mb-4 bg-black p-3.5 rounded-[18px] border border-white/10 leading-relaxed">
                    <strong className="text-neutral-200 block mb-1">Architectural Risk:</strong>
                    {dim.diagnosis}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <span className="text-[11px] font-semibold text-white block mb-1">Remediation Action:</span>
                  <p className="text-xs text-neutral-300 leading-relaxed">{dim.remediation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-Phase Transformation Roadmap */}
        <section className="mb-16 p-8 rounded-[28px] bg-neutral-950 border border-white/10">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Prescribed Transformation Path
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
              Deterministic Remediation Blueprint
            </h2>
            <p className="text-sm text-neutral-400 mt-2">
              Follow this phased transformation sequence to systematically eliminate runtime fragility and achieve 99.9% deterministic execution reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {results.recommendedRoadmap.map((step, idx) => (
              <div key={idx} className="p-6 rounded-[22px] bg-black border border-white/10 flex flex-col justify-between h-full">
                <div>
                  <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                    {step.phase}
                  </span>
                  <h3 className="text-base font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed mb-4">{step.action}</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider block font-semibold">Expected Impact</span>
                  <span className="text-xs font-medium text-white">{step.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section className="mb-16 max-w-3xl">
          <div className="mb-6">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
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
                <div key={idx} className="rounded-[20px] border border-white/10 bg-neutral-950 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-white hover:opacity-80 transition-opacity"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                        className="accordion-panel overflow-hidden"
                      >
                        <div className="p-4 sm:p-5 pt-4 text-xs sm:text-sm text-neutral-300 border-t border-white/10 leading-relaxed">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
