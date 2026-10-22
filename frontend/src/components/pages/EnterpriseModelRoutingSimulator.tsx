import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Shuffle,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  TrendingDown,
  Cpu,
  Layers,
  Scale
} from 'lucide-react';
import {
  calculateModelRoutingSimulation,
  ModelRoutingInputs,
  RoutingStrategy,
  FrontierModelType,
  FastModelType
} from '../calculator/modelRoutingSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseModelRoutingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(500000);
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>('balanced_enterprise');
  const [frontierModel, setFrontierModel] = useState<FrontierModelType>('claude_3_5_sonnet');
  const [fastModel, setFastModel] = useState<FastModelType>('deepseek_v3');
  const [averagePromptTokens, setAveragePromptTokens] = useState<number>(640);
  const [averageCompletionTokens, setAverageCompletionTokens] = useState<number>(320);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: ModelRoutingInputs = useMemo(() => ({
    monthlyQueryVolume,
    routingStrategy,
    frontierModel,
    fastModel,
    averagePromptTokens,
    averageCompletionTokens
  }), [
    monthlyQueryVolume,
    routingStrategy,
    frontierModel,
    fastModel,
    averagePromptTokens,
    averageCompletionTokens
  ]);

  const results = useMemo(() => {
    return calculateModelRoutingSimulation(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/model-routing-cost-arbitrage-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#a855f7;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: MULTI-MODEL ROUTING & TOKEN COST ARBITRAGE
================================================================================
Monthly Query Volume    : ${inputs.monthlyQueryVolume.toLocaleString()} queries
Routing Strategy Tier   : ${inputs.routingStrategy.toUpperCase()}
Frontier Anchor Model   : ${inputs.frontierModel}
Fast Reflex Model       : ${inputs.fastModel}
Average Tokens          : ${inputs.averagePromptTokens} prompt / ${inputs.averageCompletionTokens} completion

FINANCIAL & LATENCY ARBITRAGE PROJECTIONS:
--------------------------------------------------------------------------------
Naive Frontier Spend    : $${results.naiveFrontierMonthlyCostUsd.toLocaleString()} / mo (100% Frontier)
Routed Blended Spend    : $${results.routedBlendedMonthlyCostUsd.toLocaleString()} / mo
Net Monthly Savings     : $${results.monthlyCostSavingsUsd.toLocaleString()} / mo (${results.costReductionPct}% cut)
Net Annual Savings      : $${results.annualCostSavingsUsd.toLocaleString()} / year
Cluster Latency Cut     : ${results.naiveAverageLatencyMs}ms -> ${results.routedAverageLatencyMs}ms (${results.latencyReductionPct}% cut)
Router Accuracy / Fallback: ${results.routingAccuracyPct}% accuracy / ${results.fallbackEscalationRatePct}% fallback

TIER ALLOCATION BREAKDOWN:
- ${results.allocations[0].tierName}: ${results.allocations[0].querySharePct}% traffic ($${results.allocations[0].monthlyCostUsd.toLocaleString()}/mo, ${results.allocations[0].averageLatencyMs}ms)
- ${results.allocations[1].tierName}: ${results.allocations[1].querySharePct}% traffic ($${results.allocations[1].monthlyCostUsd.toLocaleString()}/mo, ${results.allocations[1].averageLatencyMs}ms)
- ${results.allocations[2].tierName}: ${results.allocations[2].querySharePct}% traffic ($${results.allocations[2].monthlyCostUsd.toLocaleString()}/mo, ${results.allocations[2].averageLatencyMs}ms)

ARCHITECTURAL VERDICT:
${results.architecturalGuidance}
================================================================================
Audit performed via https://elesium.online/tools/enterprise-model-routing-cost-arbitrage-simulator
`.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const faqs = [
    {
      q: "How does the dynamic model router classify prompt complexity in real time?",
      a: "Elesium deploys a lightweight on-premise classifier (e.g. fine-tuned DeBERTa-v3 or quantized sentence embedding router) that inspects syntactic structure, semantic intent, token count, and reasoning depth in sub-15ms. If the query requires basic classification or JSON extraction, it dispatches to Tier 1. If it involves multi-hop logic or cross-document synthesis, it routes to Tier 2 or 3."
    },
    {
      q: "What happens if a smaller model fails or hallucinates on a complex query?",
      a: "Our cascading pipeline incorporates automated confidence evaluation. If the fast tier returns an output with low log-probability confidence, schema validation failures, or an incomplete JSON structure, the router automatically catches the failure and escalates the prompt to the Tier 3 frontier model (Claude 3.5 Sonnet or GPT-4o) with zero client-side interruption."
    },
    {
      q: "Can this multi-model router be deployed completely inside an on-premise private VPC?",
      a: "Yes. In air-gapped enterprise environments, the router runs locally, dispatching between local vLLM instances: DeepSeek V3 / Llama 3.3 70B for the fast/intermediate tier, and self-hosted high-parameter models for the complex tier, preserving 100% data sovereignty and DPDP Act 2023 compliance."
    },
    {
      q: "How does model routing compare to semantic caching?",
      a: "They are synergistic layers in the Elesium Sovereign AI stack. Semantic caching checks for semantically identical questions and answers in sub-10ms (saving ~40% of queries). Uncached queries then pass through the Dynamic Model Router, ensuring the remaining ~60% of novel queries are solved at the lowest possible token cost."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30 selection:text-purple-200">
      <Helmet>
        <title>Enterprise Multi-Model Routing &amp; Token Cost Arbitrage Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark Enterprise Multi-Model Dynamic Routing (DeepSeek, Llama, Claude, GPT-4o) vs naive single-model architectures. Calculate token cost arbitrage, sub-15ms classification, and latency reductions."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-model-routing-cost-arbitrage-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-purple-950/20 via-slate-950 to-slate-950 pt-24 pb-12 sm:pt-28 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(168,85,247,0.15),transparent)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium tracking-wide text-purple-400 bg-purple-500/10 border border-purple-500/20">
              <Shuffle className="w-3.5 h-3.5" /> Linkable Micro-SaaS Tool #15 &bull; FinOps &amp; Intelligent Dispatch
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              >
                <Code className="w-3.5 h-3.5 text-purple-400" />
                Embed Calculator
              </button>
              <button
                onClick={copyArchitecturalMemo}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-purple-400" />}
                {hasCopiedMemo ? 'Memo Copied!' : 'Copy Forensic Memo'}
              </button>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
            Enterprise Multi-Model Routing &amp; Token Cost Arbitrage Simulator
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Stop routing 100% of enterprise queries to expensive frontier models. Model sub-15ms intelligent complexity routing, token cost arbitrage across Fast/Intermediate/Frontier tiers, and cluster latency reductions.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-sm space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Workload &amp; Routing Parameters
              </h2>
            </div>

            {/* Monthly Query Volume */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="font-medium text-slate-300">Monthly Query Volume</label>
                <span className="font-mono text-purple-400 font-bold">{monthlyQueryVolume.toLocaleString()} requests</span>
              </div>
              <input
                type="range"
                min="50000"
                max="3000000"
                step="50000"
                value={monthlyQueryVolume}
                onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
                className="w-full accent-purple-500 bg-slate-800 h-2 rounded cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>50k reqs</span>
                <span>1.5M reqs</span>
                <span>3M reqs</span>
              </div>
            </div>

            {/* Routing Strategy */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Dynamic Routing Strategy
              </label>
              <select
                value={routingStrategy}
                onChange={(e) => setRoutingStrategy(e.target.value as RoutingStrategy)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
              >
                <option value="balanced_enterprise">Balanced Enterprise (50% Fast / 32% Workhorse / 18% Frontier)</option>
                <option value="aggressive_finops">Aggressive FinOps (68% Fast / 22% Workhorse / 10% Frontier)</option>
                <option value="maximum_reasoning">Maximum Reasoning (30% Fast / 35% Workhorse / 35% Frontier)</option>
              </select>
            </div>

            {/* Frontier Anchor Model */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Frontier Anchor Model (Tier 3)
              </label>
              <select
                value={frontierModel}
                onChange={(e) => setFrontierModel(e.target.value as FrontierModelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
              >
                <option value="claude_3_5_sonnet">Anthropic Claude 3.5 Sonnet ($3.00 / $15.00)</option>
                <option value="gpt_4o">OpenAI GPT-4o ($2.50 / $10.00)</option>
                <option value="o1_reasoning">OpenAI o1 Reasoning ($15.00 / $60.00)</option>
              </select>
            </div>

            {/* Fast Reflex Model */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Fast Reflex Model (Tier 1)
              </label>
              <select
                value={fastModel}
                onChange={(e) => setFastModel(e.target.value as FastModelType)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono focus:border-purple-500 focus:outline-none"
              >
                <option value="deepseek_v3">DeepSeek V3 ($0.27 / $1.10 per 1M)</option>
                <option value="llama_3_3_70b">Llama 3.3 70B Private Host ($0.50 / $0.80 per 1M)</option>
                <option value="gpt_4o_mini">OpenAI GPT-4o-mini ($0.15 / $0.60 per 1M)</option>
              </select>
            </div>

            {/* Token Split Sliders */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Prompt: <span className="text-white font-mono">{averagePromptTokens} toks</span>
                </label>
                <input
                  type="range"
                  min="128"
                  max="2048"
                  step="64"
                  value={averagePromptTokens}
                  onChange={(e) => setAveragePromptTokens(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Completion: <span className="text-white font-mono">{averageCompletionTokens} toks</span>
                </label>
                <input
                  type="range"
                  min="64"
                  max="1024"
                  step="32"
                  value={averageCompletionTokens}
                  onChange={(e) => setAverageCompletionTokens(Number(e.target.value))}
                  className="w-full accent-purple-500 bg-slate-800 h-1.5 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Cost Cut</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-purple-400 mt-1">
                  {results.costReductionPct}%
                </div>
                <div className="text-[10px] text-slate-500">Bill arbitrage</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Latency Cut</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {results.latencyReductionPct}%
                </div>
                <div className="text-[10px] text-slate-500">Weighted avg TTFT</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Monthly Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  ${results.monthlyCostSavingsUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">Net dollar gain</div>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3">
                <div className="text-[10px] font-mono text-slate-400 uppercase">Annual Savings</div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1">
                  ${results.annualCostSavingsUsd.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500">12-mo projected</div>
              </div>
            </div>

            {/* 3-Tier Allocation Cards */}
            <div className="space-y-3">
              {results.allocations.map((tier) => (
                <div
                  key={tier.tierId}
                  className={`border rounded-xl p-4 transition-all ${
                    tier.tierId === 'fast_tier'
                      ? 'bg-purple-950/20 border-purple-500/50 shadow-lg shadow-purple-950/30'
                      : tier.tierId === 'intermediate_tier'
                      ? 'bg-cyan-950/15 border-cyan-500/30'
                      : 'bg-slate-900/50 border-slate-800/80'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      {tier.tierId === 'fast_tier' ? (
                        <Zap className="w-4 h-4 text-purple-400" />
                      ) : tier.tierId === 'intermediate_tier' ? (
                        <Layers className="w-4 h-4 text-cyan-400" />
                      ) : (
                        <Cpu className="w-4 h-4 text-amber-400" />
                      )}
                      <h3 className="font-bold text-sm text-white">{tier.tierName}</h3>
                    </div>
                    <span className="text-xs font-mono font-bold text-purple-400">
                      ${tier.monthlyCostUsd.toLocaleString()} / mo
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span>Assigned: <strong className="text-slate-200">{tier.assignedModel}</strong></span>
                    <span className="font-mono text-emerald-400 font-bold">{tier.querySharePct}% Traffic Share</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800/60 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Avg Response</span>
                      <span className="text-slate-200 font-semibold">{tier.averageLatencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">P99 Tail</span>
                      <span className="text-slate-200 font-semibold">{tier.p99LatencyMs} ms</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Monthly Cost</span>
                      <span className="text-purple-300 font-semibold">${tier.monthlyCostUsd.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Architecture Comparison Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-purple-400" />
                  Naive vs Dynamic Router Cost Comparison
                </span>
                <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> ${results.monthlyCostSavingsUsd.toLocaleString()} saved/mo
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-1">
                <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20">
                  <div className="text-red-400 font-bold">Naive 100% Frontier Cost:</div>
                  <div className="text-base font-bold text-white mt-1">
                    ${results.naiveFrontierMonthlyCostUsd.toLocaleString()} / mo
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{results.naiveAverageLatencyMs} ms avg latency</div>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30">
                  <div className="text-emerald-400 font-bold">Elesium Cascading Router:</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    ${results.routedBlendedMonthlyCostUsd.toLocaleString()} / mo
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{results.routedAverageLatencyMs} ms avg latency</div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-3">
                {results.architecturalGuidance}
              </p>
            </div>

            {/* Bottom CTA Card */}
            <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Deploy Cascading Multi-Model Router in Your VPC</h4>
                <p className="text-xs text-slate-400">Cut LLM expenditure by 70%+ while guaranteeing zero SLA or accuracy degradation.</p>
              </div>
              <ExpandableScreen>
                <ExpandableScreenTrigger className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-purple-500/20">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <div className="p-6">
                    <MandateApplicationForm />
                  </div>
                </ExpandableScreenContent>
              </ExpandableScreen>
            </div>
          </div>
        </div>

        {/* Technical FAQ Section */}
        <div className="mt-16 border-t border-slate-800/80 pt-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Frequently Asked Questions: Dynamic Model Routing &amp; Token Arbitrage
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-850/50 transition"
                >
                  <span className="text-sm font-medium text-slate-200">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-purple-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cross-linking to Solutions and Comparisons */}
        <div className="mt-12 border-t border-slate-800/60 pt-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Explore related sovereign solutions:{' '}
            <Link to="/solutions" className="text-purple-400 hover:underline">
              Enterprise AI Solutions Hub
            </Link>{' '}
            &bull;{' '}
            <Link to="/compare" className="text-purple-400 hover:underline">
              Architecture Comparison Hub
            </Link>
          </div>
          <div>
            <Link to="/tools/enterprise-semantic-cache-simulator" className="text-slate-400 hover:text-white transition">
              Semantic Cache Simulator &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2">Embed This Calculator on Your Site</h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into any technical blog, enterprise portal, or architecture documentation page.
            </p>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] text-slate-300 break-all mb-4">
              {embedCodeSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs transition"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {hasCopiedEmbed ? 'Copied to Clipboard!' : 'Copy Embed Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
