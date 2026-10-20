import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Zap,
  Sliders
} from 'lucide-react';
import {
  simulateAgentSpeculativeDecoding,
  AgentSpeculativeDecodingInputs
} from '../calculator/agentSpeculativeDecodingModel';

export default function EmbedAgentSpeculativeDecodingSimulator() {
  const [monthlyInferenceTokensMillions, setMonthlyInferenceTokensMillions] = useState<number>(250);
  const [targetModelParameterSizeB, setTargetModelParameterSizeB] = useState<number>(70);
  const [avgSequenceLengthTokens, setAvgSequenceLengthTokens] = useState<number>(1024);
  const [concurrencyLevel] = useState<number>(50);
  const [gpuHourlyCostUSD, setGpuHourlyCostUSD] = useState<number>(4.50);

  const inputs: AgentSpeculativeDecodingInputs = useMemo(() => ({
    monthlyInferenceTokensMillions,
    targetModelParameterSizeB,
    avgSequenceLengthTokens,
    concurrencyLevel,
    gpuHourlyCostUSD
  }), [
    monthlyInferenceTokensMillions,
    targetModelParameterSizeB,
    avgSequenceLengthTokens,
    concurrencyLevel,
    gpuHourlyCostUSD
  ]);

  const results = useMemo(() => {
    return simulateAgentSpeculativeDecoding(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Agent Speculative Decoding &amp; Latency Arbitrage Simulator Sandbox</title>
        <meta
          name="description"
          content="Embeddable interactive simulator calculating LLM speculative tree verification, token acceptance rates, and GPU memory bandwidth arbitrage."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-speculative-decoding-simulator" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent Speculative Decoding &amp; Latency Simulator
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
                <span className="text-slate-400">Monthly Tokens</span>
                <span className="text-cyan-400 font-bold">{monthlyInferenceTokensMillions}M /mo</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="25"
                value={monthlyInferenceTokensMillions}
                onChange={(e) => setMonthlyInferenceTokensMillions(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Target Model Size</span>
                <span className="text-cyan-400 font-bold">{targetModelParameterSizeB}B Params</span>
              </div>
              <input
                type="range"
                min="70"
                max="405"
                step="5"
                value={targetModelParameterSizeB}
                onChange={(e) => setTargetModelParameterSizeB(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Sequence Length</span>
                <span className="text-cyan-400 font-bold">{avgSequenceLengthTokens} tokens</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="128"
                value={avgSequenceLengthTokens}
                onChange={(e) => setAvgSequenceLengthTokens(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">GPU Hourly Cost</span>
                <span className="text-cyan-400 font-bold">${gpuHourlyCostUSD.toFixed(2)}/hr</span>
              </div>
              <input
                type="range"
                min="2.50"
                max="18.00"
                step="0.25"
                value={gpuHourlyCostUSD}
                onChange={(e) => setGpuHourlyCostUSD(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3-Tier Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-red-900/40 bg-slate-900/50">
            <div className="text-[11px] font-mono text-red-400 font-bold mb-1">Standard Autoregressive</div>
            <div className="text-xl font-bold font-mono text-red-400">{results.standardAutoregressive.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-slate-400 mt-1">Per-Token Latency</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{results.standardAutoregressive.tokensPerSecondPerStream} tok/s</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Cost: ${results.standardAutoregressive.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-slate-900/50">
            <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">Static Draft (K=4)</div>
            <div className="text-xl font-bold font-mono text-amber-400">{results.staticDraft.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-slate-400 mt-1">Per-Token Latency</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{results.staticDraft.effectiveSpeedupFactor}x Speedup</div>
            <div className="text-[11px] font-mono text-slate-400 mt-2">
              Cost: ${results.staticDraft.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-cyan-500/40 bg-cyan-950/30">
            <div className="text-[11px] font-mono text-cyan-300 font-bold mb-1">Elesium Dynamic Tree</div>
            <div className="text-xl font-bold font-mono text-emerald-400">{results.sovereignDynamic.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-slate-400 mt-1">Per-Token Latency (-{results.latencyCutPct}%)</div>
            <div className="text-[11px] text-cyan-300 mt-0.5">{results.sovereignDynamic.effectiveSpeedupFactor}x Speedup ({results.sovereignDynamic.tokenAcceptanceRatePct}% Alpha)</div>
            <div className="text-[11px] font-mono text-emerald-400 mt-2">
              Cost: ${results.sovereignDynamic.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>
        </div>

        {/* Delta Callout */}
        <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-950/20 flex items-center justify-between font-mono text-xs">
          <span className="text-emerald-300">Net Annual GPU Compute Arbitrage:</span>
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
