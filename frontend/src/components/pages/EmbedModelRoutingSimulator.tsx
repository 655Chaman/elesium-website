import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Zap,
  TrendingDown,
  Layers,
  Cpu
} from 'lucide-react';
import {
  calculateModelRoutingSimulation,
  ModelRoutingInputs,
  RoutingStrategy,
  FrontierModelType,
  FastModelType
} from '../calculator/modelRoutingSimulatorModel';

export default function EmbedModelRoutingSimulator() {
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(500000);
  const [routingStrategy, setRoutingStrategy] = useState<RoutingStrategy>('balanced_enterprise');
  const [frontierModel] = useState<FrontierModelType>('claude_3_5_sonnet');
  const [fastModel, setFastModel] = useState<FastModelType>('deepseek_v3');
  const [averagePromptTokens] = useState<number>(640);
  const [averageCompletionTokens] = useState<number>(320);

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

  return (
    <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 rounded-[24px] border border-neutral-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Multi-Model Routing &amp; Token Cost Arbitrage Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/model-routing-cost-arbitrage-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-200 bg-white/[0.04] px-2 py-0.5 rounded border border-white/15">
            Interactive FinOps &amp; Routing Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Multi-Model Dynamic Routing &amp; Arbitrage Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-neutral-400">Token Cost Reduction</div>
          <div className="text-base font-extrabold text-neutral-200 font-mono">
            {results.costReductionPct}% Net Savings
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Volume: {monthlyQueryVolume.toLocaleString()} requests
          </label>
          <input
            type="range"
            min="50000"
            max="2000000"
            step="50000"
            value={monthlyQueryVolume}
            onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
            className="w-full accent-white bg-neutral-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Routing Strategy Tier
          </label>
          <select
            value={routingStrategy}
            onChange={(e) => setRoutingStrategy(e.target.value as RoutingStrategy)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="balanced_enterprise">Balanced Enterprise (50% / 32% / 18%)</option>
            <option value="aggressive_finops">Aggressive FinOps (68% / 22% / 10%)</option>
            <option value="maximum_reasoning">Maximum Reasoning (30% / 35% / 35%)</option>
          </select>
        </div>

        <div>
          <label className="block text-neutral-400 text-[10px] font-semibold mb-1">
            Fast Reflex Model
          </label>
          <select
            value={fastModel}
            onChange={(e) => setFastModel(e.target.value as FastModelType)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2 py-1.5 text-xs text-neutral-200 font-mono"
          >
            <option value="deepseek_v3">DeepSeek V3 ($0.27 / $1.10)</option>
            <option value="llama_3_3_70b">Llama 3.3 70B ($0.50 / $0.80)</option>
            <option value="gpt_4o_mini">OpenAI GPT-4o-mini ($0.15 / $0.60)</option>
          </select>
        </div>
      </div>

      {/* Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Tier 1: Naive Single Model */}
        <div className="bg-neutral-900/60 border border-neutral-800 rounded-[24px] p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-neutral-400 font-bold uppercase tracking-wider">
              Naive 100% Frontier
            </span>
            <Cpu className="w-3.5 h-3.5 text-neutral-500" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${results.naiveFrontierMonthlyCostUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">Monthly Token Spend</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency:</span>
              <span className="text-white font-bold">{results.naiveAverageLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Fast Reflex:</span>
              <span className="text-neutral-400">0% (All Frontier)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Cost Multiplier:</span>
              <span className="text-red-400">1.0x (Baseline)</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Dynamic Router */}
        <div className="bg-white/[0.05] border border-white/30 rounded-[24px] p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">
              Elesium Dynamic Router
            </span>
            <Zap className="w-3.5 h-3.5 text-neutral-200" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${results.routedBlendedMonthlyCostUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">Blended Monthly Spend</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Avg Latency:</span>
              <span className="text-white font-bold">{results.routedAverageLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Net Savings:</span>
              <span className="text-white font-bold">${results.monthlyCostSavingsUsd.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Router Accuracy:</span>
              <span className="text-white">{results.routingAccuracyPct}%</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Annual Gain */}
        <div className="bg-white/[0.05] border border-white/30 rounded-[24px] p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-white font-bold uppercase tracking-wider">
              FinOps Arbitrage Gain
            </span>
            <Layers className="w-3.5 h-3.5 text-neutral-200" />
          </div>
          <div className="text-xl font-bold font-mono text-white">
            ${results.annualCostSavingsUsd.toLocaleString()}
          </div>
          <div className="text-[10px] text-neutral-400 mb-2">12-Month Net Capital Preserved</div>
          <div className="space-y-1 text-[11px] font-mono text-neutral-300 border-t border-neutral-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Latency Cut:</span>
              <span className="text-white font-bold">{results.latencyReductionPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Fast Share:</span>
              <span className="text-white">{results.allocations[0].querySharePct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Escalation SLA:</span>
              <span className="text-neutral-200">100% Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Verdict Box */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-[18px] p-3 mb-4 text-xs font-mono">
        <div className="text-neutral-400 text-[10px] uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
          <span>Intelligent Model Routing Recommendation</span>
          <span className="text-neutral-200 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> {results.costReductionPct}% Cost Cut
          </span>
        </div>
        <p className="text-neutral-300 text-[11px] leading-relaxed">
          {results.architecturalGuidance}
        </p>
      </div>

      {/* Embed Footer Watermark */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px] text-neutral-400">
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/tools/enterprise-model-routing-cost-arbitrage-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white font-semibold underline underline-offset-2"
          >
            Elesium Multi-Model Routing Simulator
          </a>
        </div>
        <a
          href="https://elesium.online/audit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-neutral-300 hover:text-white font-medium"
        >
          <span>Schedule Enterprise Audit</span>
          <ExternalLink className="w-3 h-3 text-neutral-200" />
        </a>
      </div>
    </div>
  );
}
