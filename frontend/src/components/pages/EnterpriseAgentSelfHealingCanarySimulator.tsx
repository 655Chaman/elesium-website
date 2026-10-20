import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Activity,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  ShieldAlert,
  GitBranch,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import {
  simulateAgentSelfHealing,
  AgentSelfHealingInputs
} from '../calculator/agentSelfHealingCanaryModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentSelfHealingCanarySimulator() {
  // Inputs State
  const [monthlyProductionInvocations, setMonthlyProductionInvocations] = useState<number>(250000);
  const [avgAgentChainDepth, setAvgAgentChainDepth] = useState<number>(8);
  const [upstreamSchemaDriftEventsPerMonth, setUpstreamSchemaDriftEventsPerMonth] = useState<number>(12);
  const [costPerIncidentDowntimeUSD, setCostPerIncidentDowntimeUSD] = useState<number>(25000);
  const [costPerThousandTokensUSD] = useState<number>(0.005);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AgentSelfHealingInputs = useMemo(() => ({
    monthlyProductionInvocations,
    avgAgentChainDepth,
    upstreamSchemaDriftEventsPerMonth,
    costPerIncidentDowntimeUSD,
    costPerThousandTokensUSD
  }), [
    monthlyProductionInvocations,
    avgAgentChainDepth,
    upstreamSchemaDriftEventsPerMonth,
    costPerIncidentDowntimeUSD,
    costPerThousandTokensUSD
  ]);

  const results = useMemo(() => {
    return simulateAgentSelfHealing(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-self-healing-canary-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT SELF-HEALING & STATISTICAL CANARY ARCHITECTURE MEMO
Workload Profile: ${(inputs.monthlyProductionInvocations / 1000).toFixed(0)}k invocations/mo | ${inputs.avgAgentChainDepth} sub-agent depth | ${inputs.upstreamSchemaDriftEventsPerMonth} drift events/mo

ARCHITECTURAL COMPARISON:
1. Unmonitored Monolithic Agent Rollout (Zero Telemetry):
   - Mean Time to Detect (MTTD): ${results.unmonitoredMonolith.meanTimeToDetectMinutes} mins (24 hrs) | MTTR: ${results.unmonitoredMonolith.meanTimeToRecoverSeconds}s
   - Outage Cascade Probability: ${results.unmonitoredMonolith.outageCascadeProbabilityPct}%
   - Annual Financial Exposure: $${results.unmonitoredMonolith.annualizedTotalRiskCostUSD.toLocaleString()}
2. Naive Exception Retry Loops (Death Loops):
   - Mean Time to Detect (MTTD): ${results.naiveRetryLoop.meanTimeToDetectMinutes} mins | MTTR: ${results.naiveRetryLoop.meanTimeToRecoverSeconds}s
   - Outage Cascade Probability: ${results.naiveRetryLoop.outageCascadeProbabilityPct}%
   - Annual Financial Exposure: $${results.naiveRetryLoop.annualizedTotalRiskCostUSD.toLocaleString()}
3. Elesium Sovereign Self-Healing & Statistical Canary Pipeline:
   - Mean Time to Detect (MTTD): ${results.sovereignCanary.meanTimeToDetectMinutes} mins (9s) | MTTR: ${results.sovereignCanary.meanTimeToRecoverSeconds}s (sub-second rollback)
   - Pipeline Recovery Success: ${results.sovereignCanary.pipelineRecoverySuccessPct}%
   - MTTR Acceleration: ${results.mttrAccelerationFactor}x faster
   - Net Annualized Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Deploy ephemeral AST shadow canary verification and automated sub-320ms state rollback to eliminate enterprise outage risks.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'What causes silent behavioral regression and cascading outages in multi-agent systems?',
      a: 'Autonomous multi-agent pipelines chain sequential tools, API endpoints, and vector search retrievers. When an upstream third-party service alters a JSON schema, response latency, or authentication header, naive agents attempt to parse invalid formats or hallucinate parameters. In unmonitored systems, these errors cascade to downstream state machines, polluting production databases and resulting in an average 24-hour Mean Time to Detect (MTTD).'
    },
    {
      q: 'Why do naive exception retry loops trigger API quota exhaustion and death loops?',
      a: 'Basic error handling wraps tool invocations in retry blocks. When the root cause is a deterministic failure (such as an altered schema, missing parameter, or breaking API contract), retrying the exact same agent prompt burns tokens exponentially (often 4x-10x baseline), exhausts rate limits, locks database connections, and creates catastrophic death loops without recovering state.'
    },
    {
      q: 'How does Elesium Sovereign Self-Healing with Statistical Shadow Canaries operate?',
      a: 'Elesium forks a 5% shadow traffic partition to an ephemeral sandboxed canary instance. Telemetry engines apply continuous Kolmogorov-Smirnov distribution checks across agent token entropy, tool call patterns, and latency. If a schema anomaly is detected, the canary triggers automated AST structural patches or instantaneous sub-320ms rollback to the verified golden snapshot, maintaining 99.98% recovery fidelity without polluting production databases.'
    },
    {
      q: 'How does this architecture integrate with private sovereign enterprise VPCs?',
      a: 'All shadow routing, anomaly detection telemetry, and canary verifications execute within your dedicated private VPC (AWS, Azure, GCP, or on-premise Kubernetes). No production operational data or prompts traverse third-party multi-tenant servers, ensuring full compliance with India’s Digital Personal Data Protection Act (DPDP Act 2023) and ISO 27001 standards.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Enterprise Autonomous Agent Self-Healing Pipeline & Regression Canary Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark autonomous agent self-healing architectures. Compare unmonitored monolithic rollouts against naive retry death loops and sovereign statistical shadow canaries with sub-320ms rollback."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-self-healing-canary-simulator" />
      </Helmet>

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Breadcrumb & Tag */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-1">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Reliability &amp; Self-Healing Systems Lab</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Enterprise Autonomous Agent Self-Healing Pipeline &amp; Regression Canary Simulator
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
              Model and benchmark enterprise autonomous agent failure resilience. Quantify the Mean Time to Detect (MTTD), Mean Time to Recover (MTTR), and token burn arbitrage between unmonitored rollouts, naive retry loops, and sovereign statistical shadow canaries with sub-320ms automated rollback.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Widget</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 text-xs font-medium text-cyan-300 hover:bg-cyan-900/50 transition"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
            </button>
          </div>
        </div>

        {/* Top Summary Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/30 to-slate-900/40">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">MTTR Acceleration</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {results.mttrAccelerationFactor}x Faster
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">320ms automated recovery vs 2 hrs</div>
          </div>

          <div className="p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 to-slate-900/40">
            <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Cascade Risk Suppression</div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300 mt-1">
              -{results.cascadeRiskSuppressionPct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">0.02% failure propagation rate</div>
          </div>

          <div className="p-4 rounded-xl border border-purple-500/30 bg-gradient-to-b from-purple-950/30 to-slate-900/40">
            <div className="text-xs font-mono text-purple-400 uppercase tracking-wider">Pipeline Recovery Rate</div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-1">
              {results.uninterruptedSlaFidelityPct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Autonomous AST healing &amp; canary check</div>
          </div>

          <div className="p-4 rounded-xl border border-blue-500/30 bg-gradient-to-b from-blue-950/30 to-slate-900/40">
            <div className="text-xs font-mono text-blue-400 uppercase tracking-wider">Annual Cost Protected</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              ${(results.annualCostSavingsUSD / 1000).toFixed(0)}k/yr
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">{results.costReductionPct}% downtime reduction</div>
          </div>
        </div>

        {/* Interactive Controls & Architecture Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sliders Form (5 cols) */}
          <div className="lg:col-span-5 p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-200">
                Workload &amp; Fault Parameters
              </h2>
            </div>

            {/* Slider 1 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Monthly Invocations</span>
                <span className="font-mono text-cyan-400 font-semibold">{monthlyProductionInvocations.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={25000}
                max={1000000}
                step={25000}
                value={monthlyProductionInvocations}
                onChange={(e) => setMonthlyProductionInvocations(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>25k calls</span>
                <span>500k calls</span>
                <span>1M calls</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Agent Sequential Chain Depth</span>
                <span className="font-mono text-cyan-400 font-semibold">{avgAgentChainDepth} sub-agent steps</span>
              </div>
              <input
                type="range"
                min={3}
                max={20}
                step={1}
                value={avgAgentChainDepth}
                onChange={(e) => setAvgAgentChainDepth(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3 steps</span>
                <span>10 steps</span>
                <span>20 steps</span>
              </div>
            </div>

            {/* Slider 3 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Monthly Schema / API Drift Events</span>
                <span className="font-mono text-cyan-400 font-semibold">{upstreamSchemaDriftEventsPerMonth} incidents</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                step={1}
                value={upstreamSchemaDriftEventsPerMonth}
                onChange={(e) => setUpstreamSchemaDriftEventsPerMonth(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>2 events</span>
                <span>15 events</span>
                <span>30 events</span>
              </div>
            </div>

            {/* Slider 4 */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Cost per Incident Downtime</span>
                <span className="font-mono text-cyan-400 font-semibold">${costPerIncidentDowntimeUSD.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={75000}
                step={2500}
                value={costPerIncidentDowntimeUSD}
                onChange={(e) => setCostPerIncidentDowntimeUSD(Number(e.target.value))}
                className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$5k</span>
                <span>$35k</span>
                <span>$75k</span>
              </div>
            </div>

            {/* Architectural Callout Card */}
            <div className="p-4 rounded-xl border border-cyan-500/20 bg-cyan-950/20 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-cyan-300">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Deterministic Canary Protection</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Elesium’s canary engine runs 5% shadow traffic with automated Kolmogorov-Smirnov distribution checks, isolating 99.98% of schema breaks before production write paths.
              </p>
            </div>
          </div>

          {/* Comparative Cards (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Elesium Tier (Top Card) */}
            <div className="p-6 rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900 to-cyan-950/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg font-mono uppercase tracking-wider">
                Production Benchmark
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                  <RefreshCw className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Elesium Sovereign Self-Healing &amp; Canary Pipeline</h3>
                  <p className="text-xs text-slate-400">Ephemeral AST shadow verification &amp; sub-320ms atomic rollback</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-4 py-3 border-y border-slate-800/80">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Detection (MTTD)</div>
                  <div className="text-base font-bold text-cyan-300 mt-0.5">9 Seconds</div>
                  <div className="text-[10px] text-slate-500">0.15 mins automated</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Recovery (MTTR)</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">320 Milliseconds</div>
                  <div className="text-[10px] text-slate-500">Atomic snapshot rollback</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Recovery Success</div>
                  <div className="text-base font-bold text-purple-300 mt-0.5">{results.sovereignCanary.pipelineRecoverySuccessPct}%</div>
                  <div className="text-[10px] text-slate-500">0.02% cascade risk</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-400">Annual Financial Exposure:</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${results.sovereignCanary.annualizedTotalRiskCostUSD.toLocaleString()} / year
                </span>
              </div>
            </div>

            {/* Naive Retry Loop Tier */}
            <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <GitBranch className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-200">Naive Rule-Based Exception Retry Loops</h3>
                  <p className="text-xs text-slate-400">Fixed retries trigger death loops and API rate-limit exhaustion</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-3 py-2 border-y border-slate-800/60 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">MTTD</div>
                  <div className="font-semibold text-amber-300">120 Minutes</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">MTTR</div>
                  <div className="font-semibold text-slate-300">1,800 Seconds</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Cascade Risk</div>
                  <div className="font-semibold text-amber-400">{results.naiveRetryLoop.outageCascadeProbabilityPct}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Annual Exposure:</span>
                <span className="font-mono text-slate-300 font-semibold">
                  ${results.naiveRetryLoop.annualizedTotalRiskCostUSD.toLocaleString()} / year
                </span>
              </div>
            </div>

            {/* Unmonitored Monolith Tier */}
            <div className="p-5 rounded-2xl border border-rose-950/40 bg-rose-950/10 hover:border-rose-900/50 transition">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-rose-200">Unmonitored Monolithic Agent Rollout</h3>
                  <p className="text-xs text-rose-300/70">Silent behavioral drift; 24h+ MTTD and catastrophic queue corruption</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 my-3 py-2 border-y border-rose-900/20 text-xs">
                <div>
                  <div className="text-[10px] font-mono text-rose-300/60 uppercase">MTTD</div>
                  <div className="font-semibold text-rose-300">1,440 Mins (24h)</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-rose-300/60 uppercase">MTTR</div>
                  <div className="font-semibold text-rose-300">7,200 Seconds</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-rose-300/60 uppercase">Cascade Risk</div>
                  <div className="font-semibold text-rose-400">{results.unmonitoredMonolith.outageCascadeProbabilityPct}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-300/70">Annual Exposure:</span>
                <span className="font-mono text-rose-300 font-semibold">
                  ${results.unmonitoredMonolith.annualizedTotalRiskCostUSD.toLocaleString()} / year
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture Deep Dive */}
        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <Activity className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-wide">
              Elesium Autonomous Agent Self-Healing Pipeline: Architectural Topology
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-300">
            <div className="space-y-2 p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="text-cyan-400 font-mono font-semibold uppercase">1. Ephemeral Shadow Canary</div>
              <p>
                Live production traffic splits 5% into an isolated shadow sandbox. The shadow agent executes candidate schema changes against sanitized state snapshots, confirming tool invocation validity prior to production routing.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="text-emerald-400 font-mono font-semibold uppercase">2. Kolmogorov-Smirnov Drift Gate</div>
              <p>
                Continuous statistical distribution testing on output token entropy, response latency, and tool selection distributions detects behavioral anomalies in sub-9 seconds, eliminating silent semantic hallucinations.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-xl border border-slate-800 bg-slate-950/60">
              <div className="text-purple-400 font-mono font-semibold uppercase">3. Sub-320ms AST Rollback</div>
              <p>
                If execution diverges from baseline, the self-healing controller executes an atomic rollback to the golden LangGraph checkpoint within 320ms, dispatching an automated synthetic test case to your engineering alerts.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 cursor-pointer transition hover:border-slate-700"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <div className="flex items-center justify-between text-sm font-semibold text-slate-200">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </div>
                {openFaq === idx && (
                  <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-10 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Protect Your Multi-Agent Production Workflows Against Outages
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate silent failures, death loop token burn, and multi-hour fire drills. Schedule an architectural evaluation with Elesium to deploy sovereign self-healing canary pipelines inside your private VPC.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm tracking-wide transition shadow-lg shadow-cyan-500/20 inline-flex items-center gap-2 cursor-pointer">
                <span>Schedule Architectural Audit</span>
                <ArrowRight className="w-4 h-4" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="max-w-xl mx-auto p-6">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>

            <Link
              to="/solutions"
              className="px-6 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-sm transition"
            >
              Explore Sovereign Solutions
            </Link>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span>Embed This Simulator</span>
              </h3>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Copy and paste this lightweight, responsive snippet into your documentation, blog post, or engineering portal to provide interactive self-healing canary simulations.
            </p>

            <div className="relative">
              <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap">
                {embedCode}
              </pre>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 transition"
              >
                Close
              </button>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Copied!' : 'Copy Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
