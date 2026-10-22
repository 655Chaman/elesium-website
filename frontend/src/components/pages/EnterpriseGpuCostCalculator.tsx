import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Cpu,
  Server,
  DollarSign,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  ExternalLink,
  Code,
  FileText,
  X,
  Gauge,
  Layers,
  ShieldCheck,
  Activity
} from 'lucide-react';
import {
  calculateGpuFinOps,
  formatFinOpsCurrency,
  GPU_HARDWARE_SPECS,
  MODEL_PARAMETER_SPECS,
  HYPERSCALER_PRICING_SPECS,
  GpuHardwareKey,
  ModelTierKey,
  QuantizationPrecision,
  HyperscalerApiKey,
  Currency
} from '../calculator/gpuCostCalculatorModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseGpuCostCalculator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // Inputs State
  const [currency, setCurrency] = useState<Currency>('USD');
  const [monthlyTokenVolumeMillions, setMonthlyTokenVolumeMillions] = useState<number>(250);
  const [averageContextLengthTokens, setAverageContextLengthTokens] = useState<number>(4096);
  const [peakConcurrentRequests, setPeakConcurrentRequests] = useState<number>(50);
  const [modelTier, setModelTier] = useState<ModelTierKey>('llama_70b');
  const [quantization, setQuantization] = useState<QuantizationPrecision>('fp8');
  const [hardware, setHardware] = useState<GpuHardwareKey>('h100_sxm5');
  const [hyperscalerComparison, setHyperscalerComparison] = useState<HyperscalerApiKey>('claude_35_sonnet');
  const [amortizationMonths] = useState<number>(36);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const results = useMemo(() => {
    return calculateGpuFinOps({
      monthlyTokenVolumeMillions,
      averageContextLengthTokens,
      peakConcurrentRequests,
      modelTier,
      quantization,
      hardware,
      hyperscalerComparison,
      currency,
      amortizationMonths
    });
  }, [
    monthlyTokenVolumeMillions,
    averageContextLengthTokens,
    peakConcurrentRequests,
    modelTier,
    quantization,
    hardware,
    hyperscalerComparison,
    currency,
    amortizationMonths
  ]);

  const activeModel = MODEL_PARAMETER_SPECS[modelTier];
  const activeHardware = GPU_HARDWARE_SPECS[hardware];
  const activeHyperscaler = HYPERSCALER_PRICING_SPECS[hyperscalerComparison];

  const embedCode = `<iframe src="https://elesium.online/embed/gpu-cost-calculator" width="100%" height="760" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Solutions</a></div>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyFinOpsMemo = () => {
    const memo = {
      memo_title: "Enterprise LLM FinOps Infrastructure Procurement & TCO Assessment",
      evaluation_date: new Date().toISOString(),
      model: activeModel.name,
      quantization_precision: quantization.toUpperCase(),
      hardware_cluster: `${results.recommendedGpuCount}x ${activeHardware.name}`,
      monthly_token_volume: `${monthlyTokenVolumeMillions}M Tokens`,
      monthly_hyperscaler_spend: formatFinOpsCurrency(results.monthlyHyperscalerCostUSD, currency),
      monthly_self_hosted_spend: formatFinOpsCurrency(results.monthlySelfHostedCostUSD, currency),
      net_monthly_savings: formatFinOpsCurrency(results.netMonthlySavingsUSD, currency),
      three_year_cumulative_savings: formatFinOpsCurrency(results.threeYearSavingsUSD, currency),
      savings_percentage: `${results.savingsPercentage}%`,
      breakeven_threshold: `${results.breakevenMonthlyTokenThresholdMillions}M Tokens/Month`,
      cluster_throughput_tokens_sec: `${results.sustainedConcurrentThroughputTokensPerSec} tokens/sec`,
      data_sovereignty_score: `${results.dataSovereigntyScore}/100`,
      dpdp_act_readiness: results.dpdpAct2023Readiness
    };
    navigator.clipboard.writeText(JSON.stringify(memo, null, 2));
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: "How does the autoregressive decode phase roofline model calculate peak token throughput?",
      a: "In LLM autoregressive generation, memory bandwidth—not raw compute TFLOPS—is the primary bottleneck because model weights must be loaded from HBM to SRAM for every single generated token. The theoretical token throughput ceiling is defined by Aggregate Memory Bandwidth (GB/s) divided by the Model Size in VRAM (GB). On 4x H100 SXM5 GPUs with 13.4 TB/s of aggregate HBM3 bandwidth, a 70B FP8 model (70 GB weights) achieves a memory bandwidth ceiling of ~191 tokens/sec per stream, scaling past 2,500 tokens/sec under continuous batching."
    },
    {
      q: "Why does Grouped Query Attention (GQA) dramatically lower KV cache memory requirements?",
      a: "Multi-Head Attention (MHA) allocates separate Key and Value heads for every Query head, causing the KV cache to explode under high concurrency. Grouped Query Attention (e.g. Llama-3 with 8 KV heads shared across 64 Query heads) reduces KV cache memory consumption by 8x. In our simulator, a 4,096-token context for Llama-3-70B consumes only ~160 MB per concurrent stream in FP8, allowing an 8x H100 node to sustain 200+ concurrent requests without out-of-memory errors."
    },
    {
      q: "At what monthly token volume does self-hosting a sovereign GPU cluster become cheaper than cloud APIs?",
      a: "For premier frontier models (such as Claude 3.5 Sonnet or GPT-4o), the commercial breakeven crossover typically occurs between 40 Million and 80 Million tokens per month. Beyond 150 Million monthly tokens, dedicated self-hosted H100 clusters deliver 65% to 84% lower operational expenditure, while eliminating public cloud rate limits and third-party data retention risks."
    },
    {
      q: "How does self-hosted GPU inference satisfy India's DPDP Act 2023 and RBI data localization?",
      a: "Multi-tenant cloud APIs transmit customer prompts and context over external networks to international data centers, violating cross-border data transfer guidelines for sensitive financial and health records. Deploying self-hosted open-weight models (like Llama-3.3 or Qwen-2.5) in a dedicated MeitY-empaneled local VPC guarantees that zero customer tokens ever leave your sovereign network boundary."
    }
  ];

  const schemaJson = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'Enterprise GPU FinOps & Throughput Calculator',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Any',
    'description': 'Interactive FinOps calculator comparing self-hosted sovereign GPU clusters (NVIDIA H100, H200, A100) vs hyperscaler closed APIs (Claude 3.5, GPT-4o) with VRAM sizing and roofline throughput modeling.',
    'url': 'https://elesium.online/tools/enterprise-gpu-finops-cost-calculator',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Elesium',
      'url': 'https://elesium.online'
    }
  };

  return (
    <>
      <Helmet>
        <title>Enterprise GPU FinOps & Throughput Calculator | Self-Hosted Clusters vs APIs | Elesium</title>
        <meta
          name="description"
          content="Calculate 3-year TCO, VRAM sizing, and token throughput comparing self-hosted sovereign NVIDIA H100/H200 clusters against Claude 3.5 Sonnet and GPT-4o APIs."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-gpu-finops-cost-calculator" />
        <meta property="og:title" content="Enterprise GPU FinOps & Throughput Calculator | Elesium" />
        <meta
          property="og:description"
          content="Calculate 3-year TCO, VRAM sizing, and token throughput comparing self-hosted sovereign NVIDIA H100/H200 clusters against Claude 3.5 Sonnet and GPT-4o APIs."
        />
        <meta property="og:url" content="https://elesium.online/tools/enterprise-gpu-finops-cost-calculator" />
        <script type="application/ld+json">{JSON.stringify(schemaJson)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb & Navigation */}
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-sky-400 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/solutions" className="hover:text-sky-400 transition-colors">Solutions</Link>
            <span>/</span>
            <span className="text-slate-200">GPU FinOps &amp; Throughput Calculator</span>
          </nav>

          {/* Hero Header */}
          <header className="mb-10 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-800 text-sky-400 text-xs font-mono font-medium mb-4">
              <Cpu className="w-3.5 h-3.5" />
              <span>NVIDIA Hopper &amp; HBM3e Roofline Hardware Model • 3-Year TCO Sizer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
              Enterprise GPU FinOps &amp; Throughput Calculator
            </h1>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              Compare the total cost of ownership, VRAM allocation, and continuous batch throughput of self-hosted sovereign GPU clusters versus closed hyperscaler API token consumption.
            </p>

            {/* Quick Actions Header */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono transition-all hover:bg-slate-850"
              >
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>Embed On Your Site</span>
              </button>
              <button
                onClick={copyFinOpsMemo}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-mono transition-all hover:bg-slate-850"
              >
                {hasCopiedMemo ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Procurement Memo Copied!</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-3.5 h-3.5 text-sky-400" />
                    <span>Copy FinOps Memo (JSON)</span>
                  </>
                )}
              </button>
              
              {/* Currency Toggle */}
              <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs font-mono">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-1 rounded transition-colors ${currency === 'USD' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-1 rounded transition-colors ${currency === 'INR' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  INR (₹)
                </button>
              </div>
            </div>
          </header>

          {/* Main Dual-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* LEFT COLUMN: Hardware, Workload & Model Sliders (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Workload Parameters Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
                  <Activity className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">1. Workload Concurrency &amp; Token Scale</h2>
                </div>

                <div className="space-y-6">
                  {/* Monthly Token Volume */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                      <span className="text-slate-300">Monthly Token Volume</span>
                      <span className="font-mono text-sky-400 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                        {monthlyTokenVolumeMillions}M tokens / month
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1500"
                      step="10"
                      value={monthlyTokenVolumeMillions}
                      onChange={(e) => setMonthlyTokenVolumeMillions(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>10M (Proof of Concept)</span>
                      <span>250M (Enterprise Scale)</span>
                      <span>1,500M (High-Volume Tier)</span>
                    </div>
                  </div>

                  {/* Average Context Window */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                      <span className="text-slate-300">Average Context Window (Input + Output)</span>
                      <span className="font-mono text-sky-400 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                        {averageContextLengthTokens.toLocaleString()} tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1024"
                      max="32768"
                      step="1024"
                      value={averageContextLengthTokens}
                      onChange={(e) => setAverageContextLengthTokens(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>1,024 (Short RPC)</span>
                      <span>8,192 (Multi-Turn Chat)</span>
                      <span>32,768 (Document RAG)</span>
                    </div>
                  </div>

                  {/* Peak Concurrent Streams */}
                  <div>
                    <div className="flex justify-between items-center text-sm font-medium mb-2">
                      <span className="text-slate-300">Peak Concurrent In-Flight Streams</span>
                      <span className="font-mono text-sky-400 font-bold bg-sky-950/80 px-2.5 py-0.5 rounded border border-sky-800">
                        {peakConcurrentRequests} concurrent users
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="250"
                      step="5"
                      value={peakConcurrentRequests}
                      onChange={(e) => setPeakConcurrentRequests(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mt-1">
                      <span>5 streams</span>
                      <span>50 streams (Standard Pod)</span>
                      <span>250 streams (Peak Event)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model & Precision Selection Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
                  <Layers className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">2. Open-Weight Model &amp; Quantization</h2>
                </div>

                <div className="space-y-4">
                  {/* Model Tier Grid */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Foundation Model Parameter Class
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {(Object.keys(MODEL_PARAMETER_SPECS) as ModelTierKey[]).map((key) => {
                        const m = MODEL_PARAMETER_SPECS[key];
                        const isSelected = modelTier === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setModelTier(key)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              isSelected
                                ? 'bg-sky-950/70 border-sky-500 ring-1 ring-sky-500 text-white'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="font-bold text-sm text-white flex justify-between items-center">
                              <span>{m.name}</span>
                              <span className="font-mono text-xs text-sky-400">{m.parameterCountBillions}B</span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{m.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Quantization Precision Toggle */}
                  <div className="pt-2">
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Quantization Engine Precision (Weights &amp; KV Cache)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'fp16', label: 'FP16 (BF16)', sub: '2.0 bytes/param • Unquantized' },
                        { id: 'fp8', label: 'FP8 (Hopper)', sub: '1.0 byte/param • Lossless Tensor Core' },
                        { id: 'awq_int4', label: 'AWQ (INT4)', sub: '0.55 bytes • Max VRAM Compression' }
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setQuantization(item.id as QuantizationPrecision)}
                          className={`p-2.5 rounded-lg border text-left transition-all ${
                            quantization === item.id
                              ? 'bg-sky-950 border-sky-500 text-white ring-1 ring-sky-500'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          <div className="font-bold text-xs text-white">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hardware & Comparison Profile Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-4 border-b border-slate-800 mb-5">
                  <Server className="w-5 h-5 text-sky-400" />
                  <h2 className="text-lg font-bold text-white tracking-tight">3. Cluster Hardware &amp; Benchmark API</h2>
                </div>

                <div className="space-y-4">
                  {/* Hardware Target */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Self-Hosted Infrastructure Architecture
                    </label>
                    <div className="space-y-2">
                      {(Object.keys(GPU_HARDWARE_SPECS) as GpuHardwareKey[]).map((key) => {
                        const h = GPU_HARDWARE_SPECS[key];
                        const isSelected = hardware === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setHardware(key)}
                            className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'bg-sky-950/70 border-sky-500 ring-1 ring-sky-500 text-white'
                                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-sm text-white flex items-center gap-2">
                                <span>{h.name}</span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                  {h.interconnect}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5">{h.recommendedFor}</p>
                            </div>
                            <div className="text-right font-mono text-xs text-sky-400 font-bold shrink-0 ml-3">
                              {h.hourlyRentalRateUSD > 0 ? `$${h.hourlyRentalRateUSD}/hr` : 'On-Prem CapEx'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hyperscaler Comparison API */}
                  <div className="pt-2">
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                      Hyperscaler Cloud API Benchmark
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(Object.keys(HYPERSCALER_PRICING_SPECS) as HyperscalerApiKey[]).map((key) => {
                        const p = HYPERSCALER_PRICING_SPECS[key];
                        const isSelected = hyperscalerComparison === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setHyperscalerComparison(key)}
                            className={`p-2.5 rounded-lg border text-left transition-all ${
                              isSelected
                                ? 'bg-sky-950 border-sky-500 text-white ring-1 ring-sky-500'
                                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                            }`}
                          >
                            <div className="font-bold text-xs text-white flex justify-between items-center">
                              <span>{p.name}</span>
                              <span className="font-mono text-sky-400 font-bold">${p.blendedPerMillionUSD}/M</span>
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                              <span>{p.provider}</span>
                              <span>P95 ~{p.p95LatencyMs}ms</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Results Dashboard, TCO Economics & Sizing (5 Cols) */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">

              {/* Main FinOps Economics Card */}
              <div className="bg-gradient-to-b from-sky-950/80 via-slate-900 to-slate-900 border-2 border-sky-500/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-sky-500 text-black font-extrabold text-[10px] uppercase font-mono px-3 py-1 rounded-bl-lg">
                  FinOps Breakeven Verified
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <DollarSign className="w-5 h-5 text-sky-400" />
                  <span className="text-xs font-mono font-bold tracking-wider uppercase text-slate-300">
                    Monthly Operational Comparison
                  </span>
                </div>

                {/* Big Savings Number */}
                <div className="mb-6 pb-6 border-b border-slate-800">
                  <div className="text-xs font-mono text-slate-400 mb-1">Estimated Net Monthly Savings</div>
                  <div className="text-4xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
                    <span className="text-emerald-400">{formatFinOpsCurrency(results.netMonthlySavingsUSD, currency)}</span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-700 text-emerald-400">
                      {results.savingsPercentage > 0 ? `+${results.savingsPercentage}% Cut` : 'At Scale'}
                    </span>
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-2">
                    3-Year Cumulative Savings:{' '}
                    <span className="text-emerald-300 font-bold">{formatFinOpsCurrency(results.threeYearSavingsUSD, currency)}</span>
                  </div>
                </div>

                {/* Side-by-Side Cost Comparison */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Self-Hosted Cluster</div>
                    <div className="text-lg font-bold text-white font-mono">
                      {formatFinOpsCurrency(results.monthlySelfHostedCostUSD, currency)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {results.recommendedGpuCount}x {activeHardware.name}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-950/80">
                    <div className="text-[11px] font-mono text-slate-400 mb-1">Hyperscaler Cloud API</div>
                    <div className="text-lg font-bold text-rose-400 font-mono">
                      {formatFinOpsCurrency(results.monthlyHyperscalerCostUSD, currency)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {activeHyperscaler.name}
                    </div>
                  </div>
                </div>

                {/* Breakeven Metric */}
                <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/80 mb-6 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Commercial Breakeven Threshold:</span>
                  <span className="text-sky-300 font-bold">
                    {results.breakevenMonthlyTokenThresholdMillions}M tokens / month
                  </span>
                </div>

                {/* Primary Conversion CTA */}
                <div className="space-y-3">
                  <button
                    onClick={() => openWhatsApp()}
                    className="px-5 py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Chat on WhatsApp</span>
                  </button>
                <ExpandableScreen>
                    <ExpandableScreenTrigger>
                      <button className="w-full py-3.5 px-4 rounded-full bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2">
                        <span>Deploy This Sovereign Cluster in Your VPC</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </ExpandableScreenTrigger>
                    <ExpandableScreenContent>
                      <MandateApplicationForm />
                    </ExpandableScreenContent>
                  </ExpandableScreen>

                  <button
                    onClick={() => openWhatsApp()}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs tracking-wide transition-all flex items-center justify-center gap-2"
                  >
                    <span>Discuss Cluster Sizing via Private Channel</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Hardware Sizing & Roofline Specification Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 mb-4">
                  <Gauge className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white tracking-tight uppercase font-mono">
                    Cluster Architecture &amp; VRAM Physics
                  </h3>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Recommended GPU Topology:</span>
                    <span className="text-white font-bold">{results.recommendedGpuCount}x {activeHardware.name}</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Tensor Parallelism Degree:</span>
                    <span className="text-sky-400 font-bold">TP = {results.tensorParallelismDegree} (NVLink Mesh)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Model Weights VRAM:</span>
                    <span className="text-white">{results.weightsVramGb} GB</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Dynamic KV Cache VRAM:</span>
                    <span className="text-white">{results.totalKvCacheVramGb} GB (PagedAttention)</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Cluster Memory Headroom:</span>
                    <span className="text-emerald-400 font-bold">{results.memoryHeadroomPct}% Headroom</span>
                  </div>

                  <div className="flex justify-between py-1.5 border-b border-slate-800/60">
                    <span className="text-slate-400">Continuous Batch Throughput:</span>
                    <span className="text-sky-300 font-bold">{results.sustainedConcurrentThroughputTokensPerSec.toLocaleString()} tokens/sec</span>
                  </div>

                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Data Sovereignty Status:</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{results.dpdpAct2023Readiness}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Technical Deep Dive & FAQs */}
          <section className="mt-16 pt-12 border-t border-slate-800 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Technical Sizing Architecture &amp; FAQs</h2>
              <p className="text-sm text-slate-400">
                Mathematical explanations of roofline model bandwidth ceilings, PagedAttention memory fragmentation, and data sovereignty economics.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-medium text-sm text-white flex justify-between items-center gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-sky-400' : ''}`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Embed Modal */}
          {isEmbedOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
                <button
                  onClick={() => setIsEmbedOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 mb-3">
                  <Code className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-base text-white">Embed This GPU FinOps Calculator</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Copy and paste this clean iframe snippet into your engineering blog, internal FinOps portal, or documentation.
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 break-all mb-4">
                  {embedCode}
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setIsEmbedOpen(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={copyEmbedSnippet}
                    className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-mono font-bold text-slate-950 transition-colors flex items-center gap-2"
                  >
                    {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Snippet'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <WhatsAppModal />
    </>
  );
}
