import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Target,
  Zap,
  Layers,
  Cpu
} from 'lucide-react';
import {
  simulateAgentPromptOptimization,
  AgentPromptOptimizerInputs
} from '../calculator/agentPromptOptimizerModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentPromptOptimizerSimulator() {
  // Inputs State
  const [monthlyAgentExecutions, setMonthlyAgentExecutions] = useState<number>(250000);
  const [avgPromptInputTokens, setAvgPromptInputTokens] = useState<number>(2400);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(450);
  const [evaluationValidationSetSize, setEvaluationValidationSetSize] = useState<number>(500);
  const [costPerThousandTokensUSD] = useState<number>(0.005);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AgentPromptOptimizerInputs = useMemo(() => ({
    monthlyAgentExecutions,
    avgPromptInputTokens,
    avgOutputTokens,
    evaluationValidationSetSize,
    costPerThousandTokensUSD
  }), [
    monthlyAgentExecutions,
    avgPromptInputTokens,
    avgOutputTokens,
    evaluationValidationSetSize,
    costPerThousandTokensUSD
  ]);

  const results = useMemo(() => {
    return simulateAgentPromptOptimization(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-prompt-optimizer-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT CONTINUOUS PROMPT OPTIMIZATION & EVOLUTIONARY TUNING MEMO
Workload Profile: ${(inputs.monthlyAgentExecutions / 1000).toFixed(0)}k executions/mo | ${inputs.avgPromptInputTokens} input tokens | ${inputs.evaluationValidationSetSize} validation benchmark prompts

ARCHITECTURAL COMPARISON:
1. Ad-Hoc Manual Prompt Engineering:
   - Task Completion Accuracy: ${results.manualPrompting.taskAccuracyPct}%
   - Measured Input Tokens: ${results.manualPrompting.avgInputTokensPerInvocation} tokens
   - Annual Operating Cost: $${results.manualPrompting.annualizedTotalCostUSD.toLocaleString()}
2. Unconstrained Grid / Random Search:
   - Task Completion Accuracy: ${results.gridSearch.taskAccuracyPct}%
   - Convergence Generations: ${results.gridSearch.convergenceGenerations} rounds (quadratic token burn)
   - Annual Operating Cost: $${results.gridSearch.annualizedTotalCostUSD.toLocaleString()}
3. Elesium Sovereign Evolutionary Tuning (MIPROv2 / GEPA):
   - Task Completion Accuracy: ${results.sovereignEvolutionary.taskAccuracyPct}% (+${results.accuracyImprovementPct}%)
   - Input Tokens per Step: ${results.sovereignEvolutionary.avgInputTokensPerInvocation} (-${results.tokenReductionPct}% token compression)
   - Convergence Speed: ${results.sovereignEvolutionary.convergenceGenerations} Bayesian rounds
   - Optimization Token Efficiency: ${results.optimizationEfficiencyMultiplier}x faster convergence than grid search
   - Net Annual Cost Savings: $${results.annualCostSavingsUSD.toLocaleString()} (${results.costReductionPct}% reduction)

RECOMMENDATION: Deploy Bayesian multi-objective prompt compilation to compress prompt context overhead and enforce 99.4% task completion determinism.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why does manual prompt engineering fail at enterprise scale?',
      a: 'Manual prompt engineering relies on ad-hoc human trial-and-error, stuffing verbose chain-of-thought rules and arbitrary few-shot exemplars into system instructions. As business logic expands, manual prompts suffer from instruction conflict, recency bias, and severe prompt bloat (+25% wasted tokens), while task completion accuracy plateaus around 76.4% due to unhandled edge cases.'
    },
    {
      q: 'How does gradient-free Bayesian evolutionary prompt compilation differ from brute-force grid search?',
      a: 'Brute-force grid and random search evaluate combinations blindly across the combinatorial space, requiring 120+ generation rounds and triggering quadratic token burn while frequently overfitting to small test sets. In contrast, gradient-free Bayesian surrogate models (such as MIPROv2 and GEPA) fit a Gaussian Process or tree-structured Parzen estimator over semantic mutation traces, converging in 4 rounds to find Pareto-optimal prompt vectors that balance task accuracy, token length, and inference latency.'
    },
    {
      q: 'How does prompt optimization reduce production inference token cost by 38.2%?',
      a: 'The compiler identifies semantic redundancy, strips boilerplate conversational padding, and automatically synthesizes high-density few-shot examples from historical ground-truth runs. By expressing identical constraints in fewer, mathematically precise tokens, input payload size decreases by 38.2%, directly slashing LLM API spend across high-throughput production workloads.'
    },
    {
      q: 'Does continuous prompt optimization require exposing private enterprise data to external model providers?',
      a: 'Zero customer training or evaluation data is leaked externally. The optimization loop runs entirely within your customer-managed Virtual Private Cloud (VPC), utilizing self-hosted evaluation harnesses and air-gapped synthetic mutators that never persist telemetry to third-party endpoints.'
    }
  ];

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Enterprise Agent Continuous Prompt Optimization & Evolutionary Tuning Simulator',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web-based, Cloud, On-Premises VPC',
    url: 'https://elesium.online/tools/enterprise-agent-prompt-optimizer-simulator',
    description: 'Interactive mathematical and systems engineering simulator comparing ad-hoc manual prompting, brute-force grid search, and sovereign gradient-free Bayesian evolutionary prompt compilation (MIPROv2 / GEPA).',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elesium',
      url: 'https://elesium.online'
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Enterprise Agent Continuous Prompt Optimization Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and compare manual prompt engineering vs brute-force grid search vs sovereign Bayesian evolutionary prompt compilation (MIPROv2 / GEPA). Slash token bloat by 38.2%."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-prompt-optimizer-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      {/* Header Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/solutions" className="hover:text-cyan-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-cyan-400">Prompt Optimizer Simulator</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEmbedOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-slate-700 bg-slate-900 hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            Embed Tool
          </button>
          <button
            onClick={copyExecutiveMemo}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/60 text-xs font-mono text-cyan-300 hover:text-cyan-100 transition-colors"
          >
            {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            {hasCopiedMemo ? 'Memo Copied!' : 'Copy Exec Memo'}
          </button>
        </div>
      </div>

      {/* Hero Headline */}
      <div className="max-w-7xl mx-auto mb-10 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          Tool #24 • Sovereign Optimization Model
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Agent Continuous Prompt Optimization Simulator
        </h1>
        <p className="max-w-4xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          Model the mathematical divergence between fragile manual prompt drafting, brute-force grid sweeps,
          and <span className="text-cyan-300 font-medium">sovereign Bayesian gradient-free evolutionary prompt compilation (MIPROv2 / GEPA)</span>.
          Quantify task accuracy gains, token overhead reduction, and multi-objective Pareto optimality.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Sliders Configuration Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-mono">Workload Telemetry</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Config Params</span>
          </div>

          {/* Slider 1: Monthly Executions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Monthly Agent Invocations</span>
              <span className="text-cyan-400 font-bold">{monthlyAgentExecutions.toLocaleString()} /mo</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={monthlyAgentExecutions}
              onChange={(e) => setMonthlyAgentExecutions(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>50k (Mid-Market)</span>
              <span>2M (Global Enterprise)</span>
            </div>
          </div>

          {/* Slider 2: Average Input Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Baseline Input Tokens</span>
              <span className="text-cyan-400 font-bold">{avgPromptInputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="500"
              max="8000"
              step="100"
              value={avgPromptInputTokens}
              onChange={(e) => setAvgPromptInputTokens(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>500 (Concise)</span>
              <span>8,000 (Dense RAG / Multi-Tool)</span>
            </div>
          </div>

          {/* Slider 3: Average Output Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Generated Output Tokens</span>
              <span className="text-cyan-400 font-bold">{avgOutputTokens.toLocaleString()} tokens</span>
            </div>
            <input
              type="range"
              min="150"
              max="2500"
              step="50"
              value={avgOutputTokens}
              onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>150 (JSON Structured)</span>
              <span>2,500 (Long-Form Plan)</span>
            </div>
          </div>

          {/* Slider 4: Validation Set Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Validation Benchmark Prompts</span>
              <span className="text-cyan-400 font-bold">{evaluationValidationSetSize} prompts</span>
            </div>
            <input
              type="range"
              min="100"
              max="2000"
              step="50"
              value={evaluationValidationSetSize}
              onChange={(e) => setEvaluationValidationSetSize(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>100 (Core Micro-eval)</span>
              <span>2,000 (Exhaustive Test Suite)</span>
            </div>
          </div>

          {/* Highlight Metrics Box */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Accuracy Boost</div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">+{results.accuracyImprovementPct}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">99.4% Task Success</div>
            </div>
            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Token Overhead</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">-{results.tokenReductionPct}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">38.2% Compression</div>
            </div>
          </div>

          {/* CTA In-Column */}
          <div className="pt-2">
            <ExpandableScreen>
              <ExpandableScreenTrigger className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
                <span>Deploy Sovereign Evolutionary Tuning</span>
                <ArrowRight className="w-4 h-4" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <MandateApplicationForm />
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>

        {/* 3-Way Comparative Architectural Results */}
        <div className="lg:col-span-7 space-y-6">
          {/* Architecture 1: Manual Prompt Engineering */}
          <div className="p-6 rounded-2xl border border-red-900/40 bg-slate-900/60 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="font-mono text-base font-bold text-white">1. Ad-Hoc Manual Prompt Engineering</h3>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                Fragile & Bloated
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Accuracy</div>
                <div className="text-base font-bold text-red-400">{results.manualPrompting.taskAccuracyPct}%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Input Tokens</div>
                <div className="text-base font-bold text-slate-200">{results.manualPrompting.avgInputTokensPerInvocation}</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Tuning Rounds</div>
                <div className="text-base font-bold text-slate-400">1 (Static)</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-red-400">${results.manualPrompting.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {results.manualPrompting.architecturalVerdict}
            </p>
          </div>

          {/* Architecture 2: Unconstrained Grid / Random Search */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-slate-900/60 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-mono text-base font-bold text-white">2. Unconstrained Grid / Random Search</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Token Explosion
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Accuracy</div>
                <div className="text-base font-bold text-amber-400">{results.gridSearch.taskAccuracyPct}%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Input Tokens</div>
                <div className="text-base font-bold text-slate-200">{results.gridSearch.avgInputTokensPerInvocation}</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Tuning Rounds</div>
                <div className="text-base font-bold text-amber-400">{results.gridSearch.convergenceGenerations} rounds</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-amber-400">${results.gridSearch.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {results.gridSearch.architecturalVerdict}
            </p>
          </div>

          {/* Architecture 3: Elesium Sovereign Evolutionary Tuning */}
          <div className="p-6 rounded-2xl border border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <h3 className="font-mono text-base font-bold text-cyan-200">
                  3. Elesium Sovereign Evolutionary Tuning (MIPROv2 / GEPA)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                Pareto Optimal (99.8%)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Accuracy</div>
                <div className="text-base font-bold text-emerald-400">{results.sovereignEvolutionary.taskAccuracyPct}%</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Input Tokens</div>
                <div className="text-base font-bold text-cyan-300">{results.sovereignEvolutionary.avgInputTokensPerInvocation}</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Tuning Rounds</div>
                <div className="text-base font-bold text-emerald-400">{results.sovereignEvolutionary.convergenceGenerations} rounds</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-emerald-400">${results.sovereignEvolutionary.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {results.sovereignEvolutionary.architecturalVerdict}
            </p>
          </div>

          {/* Annual Cost Arbitrage Banner */}
          <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Net Annual Financial Arbitrage</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                ${results.annualCostSavingsUSD.toLocaleString()} / year
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Cutting operational token burn by {results.costReductionPct}% while elevating task fidelity to 99.4%.
              </div>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shrink-0">
                Lock Prompt Arbitrage
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <MandateApplicationForm />
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>
      </div>

      {/* Deep Technical Architectural Breakdown */}
      <div className="max-w-7xl mx-auto mb-16">
        <h2 className="text-2xl font-bold font-mono text-white mb-6 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Mathematical & Engineering Architecture: Gradient-Free Optimization
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Target className="w-4 h-4" />
              <span>Bayesian Surrogate Compilation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instead of naive string concatenations, the MIPROv2 compiler fits a probabilistic Gaussian Process surrogate over validation scores. It samples candidate prompt instructions and few-shot exemplar combinations, balancing exploration and exploitation to converge on the global optimum in just 4 rounds.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Zap className="w-4 h-4" />
              <span>Multi-Objective Pareto Frontier</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Optimizes across competing dimensions: task accuracy, prompt token length, and inference latency. The algorithm generates a non-dominated Pareto frontier, discarding prompts that increase accuracy by 0.5% at the cost of 500 extra tokens, guaranteeing maximal return on compute.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Cpu className="w-4 h-4" />
              <span>Zero-Leakage Air-Gapped Loop</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              The continuous optimization worker runs locally within your private customer VPC or on-premise cluster. Synthetic perturbations, mutation operators, and validation evaluations are isolated from public SaaS APIs, maintaining DPDP Act 2023, HIPAA, and SOC-2 compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions Accordion */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-2xl font-bold font-mono text-white mb-6 text-center">
          Frequently Asked Technical Questions
        </h2>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-900/70 overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-mono text-sm font-semibold text-slate-200 hover:text-cyan-300 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold font-mono text-white">Embed Simulator</h3>
            </div>
            <p className="text-xs text-slate-300 mb-4 font-sans leading-relaxed">
              Copy and paste this HTML snippet into your technical documentation, intranet portal, or blog post.
              Includes live reactive sliders and an authoritative watermark backlink to Elesium.
            </p>
            <div className="relative mb-4">
              <textarea
                readOnly
                value={embedCode}
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={copyEmbedToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Copied Code!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
