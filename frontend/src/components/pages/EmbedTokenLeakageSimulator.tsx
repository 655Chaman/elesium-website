import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Flame,
  ShieldCheck,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import {
  calculateTokenLeakage,
  formatNumber,
  formatCompactNumber,
  MODELS,
  TOPOLOGIES,
  ModelKey,
  TopologyKey,
  Currency
} from '../calculator/tokenLeakageSimulatorModel';

export default function EmbedTokenLeakageSimulator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [model, setModel] = useState<ModelKey>('gpt-4o');
  const [topology, setTopology] = useState<TopologyKey>('unconstrained_react');
  const [agentNodes, setAgentNodes] = useState<number>(6);
  const [recursionDepth, setRecursionDepth] = useState<number>(8);
  const [failureRatePct, setFailureRatePct] = useState<number>(20);
  const basePromptTokens = 6000;
  const [monthlyRuns, setMonthlyRuns] = useState<number>(50000);

  const results = useMemo(() => {
    return calculateTokenLeakage({
      topology,
      model,
      agentNodes,
      recursionDepth,
      failureRatePct,
      basePromptTokens,
      monthlyRuns,
      currency
    });
  }, [topology, model, agentNodes, recursionDepth, failureRatePct, basePromptTokens, monthlyRuns, currency]);

  return (
    <>
      <Helmet>
        <title>Multi-Agent Token Leakage Simulator Widget | Elesium</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/embed/token-leakage-simulator" />
      </Helmet>

      <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-neutral-800 rounded-[24px] shadow-2xl">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-white " />
              <span className="font-bold text-sm tracking-tight text-white">
                Multi-Agent Token Leakage Simulator
              </span>
            </div>
            
            {/* Currency toggle */}
            <div className="flex items-center gap-1 bg-neutral-900 p-1 rounded-full border border-neutral-800 text-[10px]">
              <button
                onClick={() => setCurrency('USD')}
                className={`active:scale-[0.97] px-2 py-0.5 rounded font-medium transition-all duration-300 ${
                  currency === 'USD' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`active:scale-[0.97] px-2 py-0.5 rounded font-medium transition-all duration-300 ${
                  currency === 'INR' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Quick Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Model:
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value as ModelKey)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40"
              >
                {Object.values(MODELS).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                Topology:
              </label>
              <select
                value={topology}
                onChange={(e) => setTopology(e.target.value as TopologyKey)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-white/40"
              >
                {Object.values(TOPOLOGIES).map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {/* Agent Nodes */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Agent Nodes:</span>
                <span className="text-white font-bold">{agentNodes}</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={agentNodes}
                onChange={(e) => setAgentNodes(parseInt(e.target.value))}
                className="w-full accent-white bg-neutral-800 h-1 rounded-xl cursor-pointer"
              />
            </div>

            {/* Recursion Depth */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Recursion Depth:</span>
                <span className="text-white font-bold">{recursionDepth} turns</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="1"
                value={recursionDepth}
                onChange={(e) => setRecursionDepth(parseInt(e.target.value))}
                className="w-full accent-white bg-neutral-800 h-1 rounded-xl cursor-pointer"
              />
            </div>

            {/* Tool Failure Rate */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Tool Parsing Failure:</span>
                <span className="text-amber-400 font-bold">{failureRatePct}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={failureRatePct}
                onChange={(e) => setFailureRatePct(parseInt(e.target.value))}
                className="w-full accent-white bg-neutral-800 h-1 rounded-xl cursor-pointer"
              />
            </div>

            {/* Monthly Runs */}
            <div className="bg-neutral-900/60 border border-neutral-800 rounded-[18px] p-3">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-neutral-400">Monthly Volume:</span>
                <span className="text-white font-bold">{formatCompactNumber(monthlyRuns)} runs</span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="5000"
                value={monthlyRuns}
                onChange={(e) => setMonthlyRuns(parseInt(e.target.value))}
                className="w-full accent-white bg-neutral-800 h-1 rounded-xl cursor-pointer"
              />
            </div>
          </div>

          {/* Primary Result Banner */}
          <div className="bg-neutral-950 border border-white/30 rounded-2xl p-4 mb-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-white mb-1">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                SILENT TOKEN CAPITAL LEAKAGE
              </span>
              <span className="text-white font-bold">
                {results.costReductionPct}% Spend Waste
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl sm:text-4xl font-black text-white">
                {results.currencySymbol}{formatNumber(results.monthlySavings)}
              </span>
              <span className="text-neutral-400 text-xs font-mono">/ month</span>
            </div>

            <div className="text-[11px] text-neutral-400">
              Annual Circuit Breaker Savings: <strong className="text-neutral-200 font-mono">{results.currencySymbol}{formatNumber(results.annualSavings)}</strong>
            </div>
          </div>

          {/* 3-Col KPI Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4 text-center">
            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Token Waste / Task</div>
              <div className="text-sm sm:text-base font-bold text-white">
                {formatCompactNumber(results.tokenLeakagePerRun)}
              </div>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Cascade Risk</div>
              <div className="text-sm sm:text-base font-bold text-amber-400">
                {results.unconstrainedCascadeRiskPct}%
              </div>
              <div className="text-[9px] text-neutral-200">FSM: 0%</div>
            </div>

            <div className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-2.5">
              <div className="text-[10px] font-mono text-neutral-400">Tail Latency Cut</div>
              <div className="text-sm sm:text-base font-bold text-white">
                ↓ {results.latencyReductionPct}%
              </div>
            </div>
          </div>

        </div>

        {/* Footer & Watermark Backlink */}
        <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="text-neutral-400 font-mono text-center sm:text-left">
            Calculated via{' '}
            <a
              href="https://elesium.online/compare"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-white underline font-semibold inline-flex items-center gap-0.5"
            >
              <span>Elesium Agent Architecture Matrix</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </div>

          <a
            href="https://elesium.online/audit"
            target="_top"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-md transition-all duration-300"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Halt Production Token Bleed</span>
          </a>
        </div>

      </div>
    </>
  );
}
