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
    <div className="min-h-screen bg-black text-neutral-100 p-4 sm:p-6 font-sans selection:bg-white/20 selection:text-black">
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
        <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-neutral-200 " />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent Speculative Decoding &amp; Latency Simulator
            </h1>
          </div>
          <span className="text-[10px] font-mono text-neutral-200 bg-white/[0.05] border border-white/20 px-2 py-0.5 rounded">
            Interactive Embed
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Sliders className="w-3.5 h-3.5 text-neutral-200" />
            <span>Telemetry Controls</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Slider 1 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Monthly Tokens</span>
                <span className="text-white font-bold">{monthlyInferenceTokensMillions}M /mo</span>
              </div>
              <input
                type="range"
                min="50"
                max="2500"
                step="25"
                value={monthlyInferenceTokensMillions}
                onChange={(e) => setMonthlyInferenceTokensMillions(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 2 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Target Model Size</span>
                <span className="text-white font-bold">{targetModelParameterSizeB}B Params</span>
              </div>
              <input
                type="range"
                min="70"
                max="405"
                step="5"
                value={targetModelParameterSizeB}
                onChange={(e) => setTargetModelParameterSizeB(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 3 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">Sequence Length</span>
                <span className="text-white font-bold">{avgSequenceLengthTokens} tokens</span>
              </div>
              <input
                type="range"
                min="256"
                max="4096"
                step="128"
                value={avgSequenceLengthTokens}
                onChange={(e) => setAvgSequenceLengthTokens(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded cursor-pointer"
              />
            </div>

            {/* Slider 4 */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-neutral-400">GPU Hourly Cost</span>
                <span className="text-white font-bold">${gpuHourlyCostUSD.toFixed(2)}/hr</span>
              </div>
              <input
                type="range"
                min="2.50"
                max="18.00"
                step="0.25"
                value={gpuHourlyCostUSD}
                onChange={(e) => setGpuHourlyCostUSD(Number(e.target.value))}
                className="w-full accent-white bg-neutral-800 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* 3-Tier Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl border border-red-900/40 bg-neutral-900/50">
            <div className="text-[11px] font-mono text-red-400 font-bold mb-1">Standard Autoregressive</div>
            <div className="text-xl font-bold font-mono text-red-400">{results.standardAutoregressive.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-neutral-400 mt-1">Per-Token Latency</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">{results.standardAutoregressive.tokensPerSecondPerStream} tok/s</div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2">
              Cost: ${results.standardAutoregressive.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-amber-900/40 bg-neutral-900/50">
            <div className="text-[11px] font-mono text-amber-400 font-bold mb-1">Static Draft (K=4)</div>
            <div className="text-xl font-bold font-mono text-amber-400">{results.staticDraft.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-neutral-400 mt-1">Per-Token Latency</div>
            <div className="text-[11px] text-neutral-400 mt-0.5">{results.staticDraft.effectiveSpeedupFactor}x Speedup</div>
            <div className="text-[11px] font-mono text-neutral-400 mt-2">
              Cost: ${results.staticDraft.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-white/30 bg-white/[0.05]">
            <div className="text-[11px] font-mono text-white font-bold mb-1">Elesium Dynamic Tree</div>
            <div className="text-xl font-bold font-mono text-white">{results.sovereignDynamic.meanLatencyPerTokenMs} ms</div>
            <div className="text-[11px] text-neutral-400 mt-1">Per-Token Latency (-{results.latencyCutPct}%)</div>
            <div className="text-[11px] text-neutral-200 mt-0.5">{results.sovereignDynamic.effectiveSpeedupFactor}x Speedup ({results.sovereignDynamic.tokenAcceptanceRatePct}% Alpha)</div>
            <div className="text-[11px] font-mono text-neutral-200 mt-2">
              Cost: ${results.sovereignDynamic.annualizedTotalCostUSD.toLocaleString()}/yr
            </div>
          </div>
        </div>

        {/* Delta Callout */}
        <div className="p-3 rounded-lg border border-white/20 bg-white/[0.05] flex items-center justify-between font-mono text-xs">
          <span className="text-neutral-200">Net Annual GPU Compute Arbitrage:</span>
          <span className="text-white font-bold text-sm">${results.annualCostSavingsUSD.toLocaleString()} / year</span>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 text-right">
          <span className="text-[11px] font-mono text-neutral-500">
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-200 hover:text-white underline"
            >
              Elesium Enterprise AI Solutions
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
