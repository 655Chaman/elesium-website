import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Cpu,
  Layers,
  Activity,
  Gauge
} from 'lucide-react';
import {
  simulateAgentSpeculativeDecoding,
  AgentSpeculativeDecodingInputs
} from '../calculator/agentSpeculativeDecodingModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentSpeculativeDecodingSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyInferenceTokensMillions, setMonthlyInferenceTokensMillions] = useState<number>(250);
  const [targetModelParameterSizeB, setTargetModelParameterSizeB] = useState<number>(70);
  const [avgSequenceLengthTokens, setAvgSequenceLengthTokens] = useState<number>(1024);
  const [concurrencyLevel] = useState<number>(50);
  const [gpuHourlyCostUSD, setGpuHourlyCostUSD] = useState<number>(4.50);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCode = `<iframe src="https://elesium.online/embed/agent-speculative-decoding-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#06b6d4;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT DYNAMIC SPECULATIVE DECODING & INFERENCE LATENCY ARBITRAGE MEMO
Workload Profile: ${inputs.monthlyInferenceTokensMillions}M tokens/mo | ${inputs.targetModelParameterSizeB}B Target Model | ${inputs.concurrencyLevel} streams | $${inputs.gpuHourlyCostUSD.toFixed(2)}/GPU-hr

ARCHITECTURAL COMPARISON:
1. Standard Autoregressive Decoding (Monolith):
   - Mean Token Latency: ${results.standardAutoregressive.meanLatencyPerTokenMs} ms/token (${results.standardAutoregressive.tokensPerSecondPerStream} tok/s)
   - Memory Bandwidth Efficiency: ${results.standardAutoregressive.memoryBandwidthEfficiencyPct}%
   - Annual Operating Cost: $${results.standardAutoregressive.annualizedTotalCostUSD.toLocaleString()}
2. Static Draft Speculative Decoding (Fixed K=4):
   - Mean Token Latency: ${results.staticDraft.meanLatencyPerTokenMs} ms/token (${results.staticDraft.effectiveSpeedupFactor}x speedup)
   - Speculative Token Acceptance Rate (alpha): ${results.staticDraft.tokenAcceptanceRatePct}%
   - Annual Operating Cost: $${results.staticDraft.annualizedTotalCostUSD.toLocaleString()}
3. Elesium Sovereign Dynamic Speculative Decoding (Tree Verification):
   - Mean Token Latency: ${results.sovereignDynamic.meanLatencyPerTokenMs} ms/token (${results.sovereignDynamic.tokensPerSecondPerStream} tok/s)
   - End-to-End Acceleration: ${results.sovereignDynamic.effectiveSpeedupFactor}x faster (${results.latencyCutPct}% latency reduction)
   - Speculative Token Acceptance Rate (alpha): ${results.sovereignDynamic.tokenAcceptanceRatePct}% (+${results.acceptanceRateLiftPct}% lift)
   - Memory Bandwidth Efficiency: ${results.sovereignDynamic.memoryBandwidthEfficiencyPct}%
   - Net Annualized GPU Cost Savings: $${results.annualCostSavingsUSD.toLocaleString()} (${results.costReductionPct}% cost cut)

RECOMMENDATION: Deploy dynamic tree speculative verification to eliminate memory-bandwidth bottlenecks and cut enterprise LLM inference latency by ${results.latencyCutPct}%.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why is standard autoregressive LLM decoding memory-bandwidth bound?',
      a: 'During standard autoregressive generation, generating each new token requires loading the entire target model weights (e.g. 140GB for a 70B FP16/INT8 model) from High-Bandwidth Memory (HBM) into GPU SRAM. Because arithmetic intensity is low (one token per full model weight load), Tensor Cores remain idle over 65% of the time waiting for memory bus transfers, resulting in high 45–65ms latencies per token.'
    },
    {
      q: 'How does dynamic speculative decoding achieve a 2.85x speedup without sacrificing accuracy?',
      a: 'A lightweight draft model or speculative head generates candidate token sequences in parallel at negligible memory cost. The heavy target model evaluates all candidate tokens in a single parallel forward pass. Mathematically, the target model accepts or rejects tokens according to its exact probability distribution; because rejected tokens are discarded and resampled from the target distribution, the final output is provably identical to standard autoregressive generation.'
    },
    {
      q: 'Why does static draft speculation fail on complex reasoning tasks?',
      a: 'Static speculative decoders use a fixed lookahead horizon (e.g. K=4) along a single linear branch. On code, mathematical proofs, or multi-step enterprise logic, draft models frequently mispredict tokens, causing the target model to reject all subsequent candidate tokens. This thrashing generates wasted draft overhead. Elesium dynamic speculative decoding uses adaptive tree sampling and confidence thresholds, expanding candidate breadth when certainty is high and contracting to avoid draft thrashing.'
    },
    {
      q: 'Can speculative decoding be deployed inside private air-gapped VPCs?',
      a: 'Yes. Both the target model and speculative draft heads reside within the customer-managed Virtual Private Cloud (VPC) or on-premise GPU cluster. No external tokens or prompts leave the boundary, ensuring complete compliance with the DPDP Act 2023, HIPAA, and SOC-2 Type II standards.'
    }
  ];

  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Enterprise Agent Dynamic Speculative Decoding & Draft Model Latency Arbitrage Simulator',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web-based, Cloud, On-Premises VPC',
    url: 'https://elesium.online/tools/enterprise-agent-speculative-decoding-simulator',
    description: 'Interactive mathematical and systems engineering simulator comparing standard autoregressive decoding, static draft speculation, and sovereign dynamic tree speculative decoding for enterprise LLM agents.',
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
        <title>Enterprise Agent Speculative Decoding Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark LLM speculative decoding architectures. Compare monolithic autoregressive decoding against dynamic speculative tree sampling for 2.85x speedup."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-speculative-decoding-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      {/* Header Breadcrumbs */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-mono text-slate-400">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/solutions" className="hover:text-cyan-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-cyan-400">Speculative Decoding Simulator</span>
        </div>
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
          <Zap className="w-3.5 h-3.5 " />
          Tool #25 • The Quarter-Century Asset
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Agent Dynamic Speculative Decoding Simulator
        </h1>
        <p className="max-w-4xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal">
          Model memory-bandwidth bottlenecks in enterprise agent inference. Compare standard autoregressive decoding
          against static draft horizons and <span className="text-cyan-300 font-medium">sovereign dynamic speculative tree verification</span>.
          Quantify token latency reductions, acceptance rates, and GPU compute cost arbitrage.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        {/* Sliders Configuration Panel */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold text-white font-mono">Inference Parameters</h2>
            </div>
            <span className="text-xs font-mono text-slate-400">Config Params</span>
          </div>

          {/* Slider 1: Monthly Tokens */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Monthly Inference Tokens</span>
              <span className="text-cyan-400 font-bold">{monthlyInferenceTokensMillions}M tokens</span>
            </div>
            <input
              type="range"
              min="50"
              max="2500"
              step="25"
              value={monthlyInferenceTokensMillions}
              onChange={(e) => setMonthlyInferenceTokensMillions(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>50M (Mid-Market)</span>
              <span>2.5B (Global Enterprise)</span>
            </div>
          </div>

          {/* Slider 2: Target Model Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Target Model Parameters</span>
              <span className="text-cyan-400 font-bold">{targetModelParameterSizeB}B Parameters</span>
            </div>
            <input
              type="range"
              min="70"
              max="405"
              step="5"
              value={targetModelParameterSizeB}
              onChange={(e) => setTargetModelParameterSizeB(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>70B (Llama-3.3 70B)</span>
              <span>405B (Llama-3.1 405B)</span>
            </div>
          </div>

          {/* Slider 3: Sequence Length */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Sequence Length per Call</span>
              <span className="text-cyan-400 font-bold">{avgSequenceLengthTokens} tokens</span>
            </div>
            <input
              type="range"
              min="256"
              max="4096"
              step="128"
              value={avgSequenceLengthTokens}
              onChange={(e) => setAvgSequenceLengthTokens(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>256 (Fast Chat)</span>
              <span>4,096 (Deep Agentic Plan)</span>
            </div>
          </div>

          {/* Slider 4: GPU Hourly Cost */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm font-mono">
              <span className="text-slate-300">Blended GPU Hourly Spend</span>
              <span className="text-cyan-400 font-bold">${gpuHourlyCostUSD.toFixed(2)} / GPU-hr</span>
            </div>
            <input
              type="range"
              min="2.50"
              max="18.00"
              step="0.25"
              value={gpuHourlyCostUSD}
              onChange={(e) => setGpuHourlyCostUSD(Number(e.target.value))}
              className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>$2.50 (L40S / A100)</span>
              <span>$18.00 (8x H100 SXM5)</span>
            </div>
          </div>

          {/* Highlight Metrics Box */}
          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
              <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">Speedup Multiplier</div>
              <div className="text-2xl font-bold font-mono text-emerald-300 mt-1">{results.throughputGainMultiplier}x</div>
              <div className="text-[11px] text-slate-400 mt-0.5">End-to-End Acceleration</div>
            </div>
            <div className="p-3.5 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider">Latency Reduction</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">-{results.latencyCutPct}%</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Sub-17ms / Token</div>
            </div>
          </div>

          {/* CTA In-Column */}
          <div className="pt-2">
            <ExpandableScreen>
              <ExpandableScreenTrigger className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-sm font-semibold border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer">
                <span>Deploy Sovereign Speculative Decoding</span>
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
          {/* Architecture 1: Standard Autoregressive Decoding */}
          <div className="p-6 rounded-2xl border border-red-900/40 bg-slate-900/60 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <h3 className="font-mono text-base font-bold text-white">1. Standard Autoregressive Decoding (Monolith)</h3>
              </div>
              <span className="text-xs font-mono text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-800/40">
                Memory Bottleneck
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Token Latency</div>
                <div className="text-base font-bold text-red-400">{results.standardAutoregressive.meanLatencyPerTokenMs} ms</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Throughput</div>
                <div className="text-base font-bold text-slate-200">{results.standardAutoregressive.tokensPerSecondPerStream} tok/s</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">HBM Efficiency</div>
                <div className="text-base font-bold text-slate-400">{results.standardAutoregressive.memoryBandwidthEfficiencyPct}%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-red-400">${results.standardAutoregressive.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {results.standardAutoregressive.architecturalVerdict}
            </p>
          </div>

          {/* Architecture 2: Static Draft Speculative Decoding */}
          <div className="p-6 rounded-2xl border border-amber-900/40 bg-slate-900/60 relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="font-mono text-base font-bold text-white">2. Static Draft Speculation (Fixed K=4)</h3>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                Draft Thrashing
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Token Latency</div>
                <div className="text-base font-bold text-amber-400">{results.staticDraft.meanLatencyPerTokenMs} ms</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Throughput</div>
                <div className="text-base font-bold text-slate-200">{results.staticDraft.tokensPerSecondPerStream} tok/s</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Acceptance Rate</div>
                <div className="text-base font-bold text-amber-400">{results.staticDraft.tokenAcceptanceRatePct}%</div>
              </div>
              <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-amber-400">${results.staticDraft.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {results.staticDraft.architecturalVerdict}
            </p>
          </div>

          {/* Architecture 3: Elesium Sovereign Dynamic Speculative Decoding */}
          <div className="p-6 rounded-2xl border border-cyan-500/50 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-blue-950/30 relative overflow-hidden shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 " />
                <h3 className="font-mono text-base font-bold text-cyan-200">
                  3. Elesium Sovereign Dynamic Speculative Decoding (Tree Verification)
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded border border-cyan-500/40">
                2.85x Speedup • 88.4% Alpha
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-sm mb-3">
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Token Latency</div>
                <div className="text-base font-bold text-emerald-400">{results.sovereignDynamic.meanLatencyPerTokenMs} ms</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Throughput</div>
                <div className="text-base font-bold text-cyan-300">{results.sovereignDynamic.tokensPerSecondPerStream} tok/s</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Acceptance Rate</div>
                <div className="text-base font-bold text-emerald-400">{results.sovereignDynamic.tokenAcceptanceRatePct}%</div>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-cyan-900/50">
                <div className="text-[11px] text-slate-400">Annual Cost</div>
                <div className="text-base font-bold text-emerald-400">${results.sovereignDynamic.annualizedTotalCostUSD.toLocaleString()}</div>
              </div>
            </div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {results.sovereignDynamic.architecturalVerdict}
            </p>
          </div>

          {/* Annual Cost Arbitrage Banner */}
          <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Net Annual Compute Cost Arbitrage</div>
              <div className="text-2xl font-bold font-mono text-white mt-0.5">
                ${results.annualCostSavingsUSD.toLocaleString()} / year
              </div>
              <div className="text-xs text-slate-300 mt-1">
                Cutting GPU compute hours by {results.costReductionPct}% while slashing generation latency by {results.latencyCutPct}%.
              </div>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shrink-0">
                Lock Inference Arbitrage
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
          Mathematical & Engineering Architecture: Dynamic Speculative Decoding
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Gauge className="w-4 h-4" />
              <span>Speculative Tree Attention</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Rather than proposing a single linear sequence, the draft engine constructs a candidate token tree with top-p probability branching. Using customized tree attention masks, the target model validates multiple speculative candidate paths simultaneously in a single forward pass, boosting acceptance rate to 88.4%.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Cpu className="w-4 h-4" />
              <span>HBM Bandwidth Amortization</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard autoregressive generation reads 140GB of model parameters per single token output. By validating an average of 2.85 tokens per target model forward pass, HBM transfer overhead is amortized across multiple accepted tokens, elevating memory bus utilization from 34% to 92.4%.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-slate-800 bg-slate-900/60 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm font-semibold">
              <Activity className="w-4 h-4" />
              <span>Zero-Divergence Mathematical Equivalence</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tokens rejected during speculative validation are resampled directly from the target distribution adjusted for the draft probability. This rigorously guarantees that output distributions match exact target model inference with zero fidelity degradation or drift.
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
          <WhatsAppModal />
    </div>
  );
}
