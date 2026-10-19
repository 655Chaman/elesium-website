import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Layers,
  Server,
  Code,
  Copy,
  Check,
  ChevronDown,
  Gauge,
  Activity,
  X
} from 'lucide-react';
import {
  calculateMultiAgentEstimates,
  formatNumber,
  formatCompactNumber,
  TOPOLOGIES,
  PUBLIC_MODELS,
  PRIVATE_CLUSTERS,
  TopologyKey,
  PublicModelKey,
  PrivateClusterKey,
  Currency
} from '../calculator/latencyEstimatorModel';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';

export default function MultiAgentLatencyEstimator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [topology, setTopology] = useState<TopologyKey>('state_machine');
  const [nodeCount, setNodeCount] = useState<number>(5);
  const [monthlyRuns, setMonthlyRuns] = useState<number>(50000);
  const [inputTokensPerNode, setInputTokensPerNode] = useState<number>(4000);
  const [outputTokensPerNode, setOutputTokensPerNode] = useState<number>(800);
  const [publicModel, setPublicModel] = useState<PublicModelKey>('gpt-4o');
  const [privateCluster, setPrivateCluster] = useState<PrivateClusterKey>('h100-quad');

  // Embed Modal State
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Copy Spec Sheet State
  const [hasCopiedSpec, setHasCopiedSpec] = useState(false);

  const results = useMemo(() => {
    return calculateMultiAgentEstimates({
      topology,
      nodeCount,
      monthlyRuns,
      inputTokensPerNode,
      outputTokensPerNode,
      publicModel,
      privateCluster,
      currency
    });
  }, [topology, nodeCount, monthlyRuns, inputTokensPerNode, outputTokensPerNode, publicModel, privateCluster, currency]);

  const activeTopo = TOPOLOGIES[topology];
  const activePub = PUBLIC_MODELS[publicModel];
  const activePriv = PRIVATE_CLUSTERS[privateCluster];

  const embedCode = `<iframe src="https://elesium.online/embed/latency-estimator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);"></iframe><div style="font-size:12px;color:#6b7280;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copySpecJson = () => {
    const spec = {
      model_benchmark: "Elesium Multi-Agent Latency & Token Cost Estimator v2.0",
      topology: activeTopo.name,
      node_count: nodeCount,
      monthly_task_runs: monthlyRuns,
      input_tokens_per_step: inputTokensPerNode,
      output_tokens_per_step: outputTokensPerNode,
      public_baseline: {
        provider: activePub.name,
        p50_latency_ms: results.publicP50LatencyMs,
        p99_latency_ms: results.publicP99LatencyMs,
        monthly_cost: `${results.currencySymbol}${formatNumber(results.publicMonthlyCost)}`
      },
      sovereign_vpc_target: {
        cluster: activePriv.name,
        engine: activePriv.vllmEngine,
        p50_latency_ms: results.privateP50LatencyMs,
        p99_latency_ms: results.privateP99LatencyMs,
        monthly_cost: `${results.currencySymbol}${formatNumber(results.privateMonthlyCost)}`
      },
      net_annual_savings: `${results.currencySymbol}${formatNumber(results.netAnnualSavings)}`,
      latency_cut_percentage: `${results.latencyImprovementPct}%`,
      breakeven_volume_runs: results.breakevenRunsPerMonth
    };
    navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
    setHasCopiedSpec(true);
    setTimeout(() => setHasCopiedSpec(false), 2500);
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Deterministic Multi-Agent Latency & Token Cost Estimator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Calculate multi-agent pipeline P50/P99 latency, token consumption, and sovereign private VPC hosting savings vs public cloud APIs.",
    "url": "https://elesium.online/tools/multi-agent-latency-token-cost-estimator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Organization",
      "name": "Elesium",
      "url": "https://elesium.online"
    }
  };

  return (
    <>
      <Helmet>
        <title>Multi-Agent Latency & Token Cost Estimator | Elesium</title>
        <meta
          name="description"
          content="Calculate P50 and P99 latency, token generation speeds, and private VPC vLLM savings across multi-agent LangGraph pipelines vs OpenAI, Anthropic, and Gemini."
        />
        <link rel="canonical" href="https://elesium.online/tools/multi-agent-latency-token-cost-estimator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-mono mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>SYSTEMS ARCHITECTURE BENCHMARK ENGINE</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Deterministic Multi-Agent Latency & Token Cost Estimator
            </h1>
            <p className="text-base sm:text-lg text-slate-400">
              Benchmark end-to-end P50/P99 latency, token generation speeds, and private VPC infrastructure savings against public multi-tenant APIs.
            </p>

            {/* Currency & Quick Actions Bar */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="inline-flex rounded-lg bg-slate-900 border border-slate-800 p-1">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    currency === 'INR'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  INR (₹)
                </button>
              </div>

              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-blue-400" />
                <span>Embed Widget</span>
              </button>

              <button
                onClick={copySpecJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors"
              >
                {hasCopiedSpec ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                <span>{hasCopiedSpec ? 'Spec Copied!' : 'Copy JSON Spec'}</span>
              </button>
            </div>
          </div>

          {/* Main Grid: Controls (Left) & Results (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Interactive Parameters */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: DAG Topology */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-400" />
                    <span>1. Agent Pipeline Architecture</span>
                  </h2>
                  <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                    {activeTopo.name}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {(Object.keys(TOPOLOGIES) as TopologyKey[]).map((key) => {
                    const t = TOPOLOGIES[key];
                    const isSelected = topology === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setTopology(key)}
                        className={`text-left p-3.5 rounded-xl border transition-all ${
                          isSelected
                            ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                            : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="text-xs font-semibold text-white mb-1">{t.name}</div>
                        <div className="text-[11px] text-slate-400 line-clamp-2">{t.description}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Node Steps Slider */}
                <div className="space-y-2 pt-2 border-t border-slate-800/60">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Agent Nodes / Steps per Request:</span>
                    <span className="font-mono font-bold text-blue-400 text-sm">{nodeCount} nodes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={nodeCount}
                    onChange={(e) => setNodeCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>1 (Single Agent)</span>
                    <span>5 (Typical Triage)</span>
                    <span>10 (Complex DAG)</span>
                    <span>15 (Deep Audit)</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Workload & Token Dynamics */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2 mb-4">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>2. Token Volume & Monthly Traffic</span>
                </h2>

                <div className="space-y-5">
                  {/* Monthly Task Volume */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Monthly Task Executions:</span>
                      <span className="font-mono font-bold text-emerald-400 text-sm">
                        {formatNumber(monthlyRuns)} runs/mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={monthlyRuns}
                      onChange={(e) => setMonthlyRuns(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>1,000</span>
                      <span>50,000 (Mid-Market)</span>
                      <span>250,000</span>
                      <span>500,000 (Enterprise)</span>
                    </div>
                  </div>

                  {/* Input Tokens per Node */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Prompt / RAG Context per Node:</span>
                      <span className="font-mono font-bold text-slate-200 text-sm">
                        {formatNumber(inputTokensPerNode)} tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="32000"
                      step="500"
                      value={inputTokensPerNode}
                      onChange={(e) => setInputTokensPerNode(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>500 (Lean Prompt)</span>
                      <span>4,000 (RAG Context)</span>
                      <span>16,000</span>
                      <span>32,000 (Dense Doc)</span>
                    </div>
                  </div>

                  {/* Output Tokens per Node */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Generated Completion Tokens per Node:</span>
                      <span className="font-mono font-bold text-slate-200 text-sm">
                        {formatNumber(outputTokensPerNode)} tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="4000"
                      step="100"
                      value={outputTokensPerNode}
                      onChange={(e) => setOutputTokensPerNode(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>100 (Structured JSON)</span>
                      <span>800 (Audit Analysis)</span>
                      <span>2,000</span>
                      <span>4,000 (Full Synthesis)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Infrastructure Benchmarking Selection */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h2 className="text-sm font-semibold tracking-wider text-slate-300 uppercase flex items-center gap-2 mb-4">
                  <Server className="w-4 h-4 text-purple-400" />
                  <span>3. Compute Infrastructure Comparison</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Public Cloud Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 block font-medium">
                      Public Multi-Tenant API:
                    </label>
                    <select
                      value={publicModel}
                      onChange={(e) => setPublicModel(e.target.value as PublicModelKey)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
                    >
                      {(Object.keys(PUBLIC_MODELS) as PublicModelKey[]).map((key) => (
                        <option key={key} value={key}>
                          {PUBLIC_MODELS[key].name} (${PUBLIC_MODELS[key].inputPricePerMTokUSD}/M in, ${PUBLIC_MODELS[key].outputPricePerMTokUSD}/M out)
                        </option>
                      ))}
                    </select>
                    <div className="text-[11px] text-slate-500 font-mono">
                      TTFT: {activePub.ttftMs}ms | Speed: {activePub.tokensPerSec} tok/s | RTT: {activePub.networkRttMs}ms
                    </div>
                  </div>

                  {/* Private Sovereign Cluster Dropdown */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 block font-medium">
                      Sovereign Private VPC Cluster:
                    </label>
                    <select
                      value={privateCluster}
                      onChange={(e) => setPrivateCluster(e.target.value as PrivateClusterKey)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-purple-500"
                    >
                      {(Object.keys(PRIVATE_CLUSTERS) as PrivateClusterKey[]).map((key) => (
                        <option key={key} value={key}>
                          {PRIVATE_CLUSTERS[key].name} (${formatNumber(PRIVATE_CLUSTERS[key].monthlyLeaseUSD)}/mo)
                        </option>
                      ))}
                    </select>
                    <div className="text-[11px] text-slate-500 font-mono">
                      TTFT: {activePriv.ttftMs}ms | Speed: {activePriv.tokensPerSec} tok/s | RTT: {activePriv.networkRttMs}ms
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Mathematical Benchmark Outputs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Primary Output Card: Latency & Cost Verdict */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/40 border border-blue-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-white uppercase tracking-wider">
                      Performance & Cost Delta
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-semibold">
                    {results.latencyImprovementPct}% FASTER
                  </span>
                </div>

                {/* Latency Comparison Bars */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        Public Cloud API (P50 / P99):
                      </span>
                      <span className="text-amber-400 font-bold">
                        {formatNumber(results.publicP50LatencyMs)}ms / {formatNumber(results.publicP99LatencyMs)}ms
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className="bg-amber-500 h-full rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1">
                      <span className="text-slate-400 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                        Sovereign Private VPC (P50 / P99):
                      </span>
                      <span className="text-blue-400 font-bold">
                        {formatNumber(results.privateP50LatencyMs)}ms / {formatNumber(results.privateP99LatencyMs)}ms
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(12, 100 - results.latencyImprovementPct)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Impact Comparison */}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 mb-6">
                  <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    <div className="text-[11px] text-slate-400 mb-1">Public Cloud Token Spend:</div>
                    <div className="text-lg font-bold font-mono text-amber-300">
                      {results.currencySymbol}{formatNumber(results.publicMonthlyCost)}
                      <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {results.currencySymbol}{results.effectiveCostPerRunPublic} per task
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-3 rounded-xl border border-emerald-900/40">
                    <div className="text-[11px] text-slate-400 mb-1">Private VPC Cluster:</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">
                      {results.currencySymbol}{formatNumber(results.privateMonthlyCost)}
                      <span className="text-[10px] text-slate-500 font-normal">/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {results.currencySymbol}{results.effectiveCostPerRunPrivate} per task
                    </div>
                  </div>
                </div>

                {/* Net Annual Savings Spotlight */}
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 text-center mb-6">
                  <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1">
                    Net Annual Infrastructure Savings
                  </div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-300 tracking-tight">
                    {results.currencySymbol}{formatNumber(results.netAnnualSavings)}
                  </div>
                  <div className="text-xs text-emerald-400/80 mt-1">
                    {results.savingsPct > 0 ? `${results.savingsPct}% reduction in annual AI compute overhead` : 'Sovereign data security with predictable cost ceiling'}
                  </div>
                </div>

                {/* Breakeven Inflection Indicator */}
                <div className="flex items-center justify-between text-xs font-mono bg-slate-950/80 p-3 rounded-xl border border-slate-800 mb-6">
                  <span className="text-slate-400">Breakeven Crossover:</span>
                  <span className={`font-bold ${results.isBreakevenReached ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {results.isBreakevenReached ? '✅ Breakeven Exceeded' : `At ${formatNumber(results.breakevenRunsPerMonth)} runs/mo`}
                  </span>
                </div>

                {/* Direct High-Converting Audit CTA */}
                <div className="pt-2">
                  <Link to="/audit">
                    <InteractiveHoverButton
                      className="w-full justify-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl text-sm shadow-lg shadow-blue-600/30 transition-all"
                    >
                      Lock These Benchmarks (Schedule Audit)
                    </InteractiveHoverButton>
                  </Link>
                  <p className="text-center text-[11px] text-slate-500 mt-2">
                    Zero data retention • Air-gapped VPC deployment • DPDP Act 2023 compliant
                  </p>
                </div>
              </div>

              {/* Monthly Token Footprint Summary */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 text-xs font-mono space-y-2">
                <div className="text-slate-400 font-sans font-semibold text-xs mb-2 uppercase tracking-wider">
                  Token Throughprint Metrics
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Monthly Prompt Context:</span>
                  <span className="text-slate-200">{formatCompactNumber(results.totalMonthlyInputTokens)} tokens</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-500">Monthly Generated Tokens:</span>
                  <span className="text-slate-200">{formatCompactNumber(results.totalMonthlyOutputTokens)} tokens</span>
                </div>
                <div className="flex justify-between py-1 text-slate-300 font-bold">
                  <span>Total Monthly Volume:</span>
                  <span className="text-blue-400">{formatCompactNumber(results.totalMonthlyTokens)} tokens</span>
                </div>
              </div>
            </div>
          </div>

          {/* Deep Architectural Walkthrough & FAQ */}
          <div className="mt-16 max-w-4xl mx-auto border-t border-slate-800 pt-12">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Multi-Agent Latency & Sovereign Infrastructure Principles
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: "Why do multi-agent chains suffer exponential latency compounding on public cloud APIs?",
                  a: "In multi-agent systems, agents execute sequential or branching DAG steps. When relying on commercial APIs (OpenAI or Anthropic), each agent step incurs three latency penalties: 1) Public internet TLS handshake and network RTT (75–110ms), 2) Multi-tenant queueing and Time to First Token (TTFT, 250–450ms), and 3) Token generation streaming time. In a 7-step sequential pipeline, this sums to over 8,500ms of end-to-end latency. Sovereign VPC clusters colocated with your application eliminate internet hops and leverage TensorRT-LLM continuous batching to reduce P50 latency to under 1,400ms."
                },
                {
                  q: "How does private VPC hosting compare against public multi-tenant APIs for enterprise data privacy?",
                  a: "Public cloud APIs process tokens in multi-tenant environments where data in transit traverses third-party perimeter gateways. Under statutory regulations such as the Digital Personal Data Protection (DPDP) Act 2023, HIPAA, and RBI cyber-security directives, sending customer PII or raw financial transactions to external APIs introduces severe regulatory exposure. Elesium deploys open-weights state-of-the-art models (Llama-3.3-70B, DeepSeek-V3) directly inside your private AWS/Azure/GCP VPC or on-premise hardware, guaranteeing zero data retention and zero third-party leakage."
                },
                {
                  q: "At what request volume does dedicated private GPU hosting become more economical than pay-per-token APIs?",
                  a: "For workloads exceeding 40,000–60,000 multi-step agent executions per month, dedicated NVIDIA A100 or H100 instances deliver 65% to 88% net cost reductions compared to GPT-4o or Claude 3.5 Sonnet. While cloud APIs charge variable fees for every input and output token, private cluster leases are fixed-cost assets. As your workflow scales from 50k to 500k monthly runs, the marginal cost per execution approaches near-zero."
                },
                {
                  q: "What is deterministic LangGraph state machine orchestration and how does it prevent token waste?",
                  a: "Naive conversational agent wrappers loop unpredictably when encountering unformatted outputs, burning hundreds of thousands of retry tokens in hallucinatory loops. Deterministic LangGraph state machines enforce typed Pydantic schemas, finite state boundaries, and deterministic rollback nodes. If an extraction fails, the system executes a bounded repair routine rather than restarting a wide conversational session, cutting token waste by over 78%."
                }
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-slate-200 text-sm sm:text-base hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-blue-400 shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-5 sm:px-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embed Modal Drawer */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3">
              <Code className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-bold text-white">Embed This Estimator On Your Website</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into your technical documentation, blog post, or engineering portal. The embed is lightweight, mobile-responsive, and automatically inherits dark mode styling.
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 break-all mb-4">
              {embedCode}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedSnippet}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied to Clipboard!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
