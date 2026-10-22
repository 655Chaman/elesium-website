import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  Sliders
} from 'lucide-react';
import {
  simulateAgentPromptOptimization,
  AgentPromptOptimizerInputs
} from '../calculator/agentPromptOptimizerModel';

export default function EmbedAgentPromptOptimizerSimulator() {
  const [monthlyAgentExecutions, setMonthlyAgentExecutions] = useState<number>(250000);
  const [avgPromptInputTokens, setAvgPromptInputTokens] = useState<number>(2400);
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(450);
  const [evaluationValidationSetSize, setEvaluationValidationSetSize] = useState<number>(500);
  const [costPerThousandTokensUSD] = useState<number>(0.005);

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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Agent Continuous Prompt Optimization &amp; Evolutionary Tuning Simulator Sandbox</title>
        <meta
          name="description"
          content="Embeddable interactive simulator calculating Bayesian gradient-free prompt compilation, accuracy boost, and token overhead reduction."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-prompt-optimizer-simulator" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 " />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent Prompt Optimization &amp; Evolutionary Tuning Simulator
            </h1>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            Interactive Embed
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slider 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Monthly Invocations</span>
                <span className="text-cyan-400 font-bold">{(monthlyAgentExecutions / 1000).toFixed(0)}k/mo</span>
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="25000"
                value={monthlyAgentExecutions}
                onChange={(e) => setMonthlyAgentExecutions(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Input Tokens / Call</span>
                <span className="text-cyan-400 font-bold">{avgPromptInputTokens} tokens</span>
              </div>
              <input
                type="range"
                min="500"
                max="8000"
                step="100"
                value={avgPromptInputTokens}
                onChange={(e) => setAvgPromptInputTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Output Tokens / Call</span>
                <span className="text-cyan-400 font-bold">{avgOutputTokens} tokens</span>
              </div>
              <input
                type="range"
                min="150"
                max="2500"
                step="50"
                value={avgOutputTokens}
                onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Validation Set Prompts</span>
                <span className="text-cyan-400 font-bold">{evaluationValidationSetSize} prompts</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={evaluationValidationSetSize}
                onChange={(e) => setEvaluationValidationSetSize(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3-Tier Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-red-900/40 bg-slate-900/50">
            <div className="text-[11px] font-mono text-red-400 font-bold mb-1">Manual Prompting</div>
            <div className="text-xl font-bold font-mono text-red-400">{results.manualPrompting.taskAccuracyPct}%</div>
            <div className="text-[11px] text-slate-400 mt-1">Accuracy</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{results.manualPrompting.avgInputTokensPerInvocation} tokens/call</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Cost: ${results.manualPrompting.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-slate-900/50">
            <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">Grid / Random Search</div>
            <div className="text-xl font-bold font-mono text-amber-400">{results.gridSearch.taskAccuracyPct}%</div>
            <div className="text-[11px] text-slate-400 mt-1">Accuracy</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{results.gridSearch.convergenceGenerations} tuning rounds</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Cost: ${results.gridSearch.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30">
            <div className="text-[11px] font-mono text-cyan-300 font-bold mb-1">Elesium Evolutionary</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{results.sovereignEvolutionary.taskAccuracyPct}%</div>
            <div className="text-[11px] text-slate-400 mt-1">Accuracy (+{results.accuracyImprovementPct}%)</div>
            <div className="text-[11px] text-cyan-300 mt-0.5">{results.sovereignEvolutionary.avgInputTokensPerInvocation} tokens (-{results.tokenReductionPct}%)</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-2">
              Cost: ${results.sovereignEvolutionary.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>
        </div>

        {/* Delta Callout */}
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between font-mono text-xs">
          <span className="text-emerald-300">Net Annual Financial Arbitrage:</span>
          <span className="text-white font-bold text-sm">${results.annualCostSavingsUSD.toLocaleString()} / year</span>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 text-right">
          <span className="text-[11px] font-mono text-slate-500">
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 underline"
            >
              Elesium Enterprise AI Solutions
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
