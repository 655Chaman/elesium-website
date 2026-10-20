import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  FileJson,
  Zap,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  TrendingDown,
  Cpu,
  Layers,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import {
  simulateStructuredOutput,
  StructuredOutputInputs,
  SchemaComplexity,
  HardwareDeployment
} from '../calculator/structuredOutputSimulatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseStructuredOutputSimulator() {
  // Inputs State
  const [monthlyRequests, setMonthlyRequests] = useState<number>(500000);
  const [schemaComplexity, setSchemaComplexity] = useState<SchemaComplexity>('medium');
  const [hardwareDeployment, setHardwareDeployment] = useState<HardwareDeployment>('sovereign_vllm');
  const [avgOutputTokens, setAvgOutputTokens] = useState<number>(450);
  const [pydanticRetryCountMax, setPydanticRetryCountMax] = useState<number>(2);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: StructuredOutputInputs = useMemo(() => ({
    monthlyRequests,
    schemaComplexity,
    hardwareDeployment,
    avgOutputTokens,
    pydanticRetryCountMax
  }), [
    monthlyRequests,
    schemaComplexity,
    hardwareDeployment,
    avgOutputTokens,
    pydanticRetryCountMax
  ]);

  const results = useMemo(() => {
    return simulateStructuredOutput(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/structured-output-latency-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#0ea5e9;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: STRUCTURED OUTPUT & JSON GRAMMAR DECODING
================================================================================
Monthly Invocations     : ${inputs.monthlyRequests.toLocaleString()} queries
Schema Complexity       : ${inputs.schemaComplexity.toUpperCase()}
Hardware Deployment     : ${inputs.hardwareDeployment === 'sovereign_vllm' ? 'Sovereign vLLM (Llama 3.3 70B)' : 'Cloud Frontier (GPT-4o / Claude 3.5)'}
Output Payload Length   : ${inputs.avgOutputTokens} tokens
Max Pydantic Retries    : ${inputs.pydanticRetryCountMax}

COMPARATIVE BENCHMARK:
1. Unconstrained Prompt + Retries:
   - Initial Parse Fail Rate : ${results.unconstrainedEngine.parseErrorRatePct}%
   - End-to-End Latency      : ${results.unconstrainedEngine.totalExecutionLatencyMs}ms
   - Monthly Wasted Tokens   : ${(results.inputs.monthlyRequests * results.unconstrainedEngine.wastedRetryTokensPerReq).toLocaleString()} tokens
   - Monthly Expenditure     : $${results.unconstrainedEngine.monthlyTokenCostUSD.toLocaleString()} / mo

2. Vendor Function Calling API:
   - Initial Parse Fail Rate : ${results.vendorToolCalling.parseErrorRatePct}%
   - End-to-End Latency      : ${results.vendorToolCalling.totalExecutionLatencyMs}ms
   - Monthly Expenditure     : $${results.vendorToolCalling.monthlyTokenCostUSD.toLocaleString()} / mo

3. Elesium Constrained Decoding (XGrammar / Outlines):
   - Initial Parse Fail Rate : 0.0% (Mathematically Guaranteed)
   - End-to-End Latency      : ${results.constrainedDecodingEngine.totalExecutionLatencyMs}ms
   - Monthly Wasted Tokens   : 0 tokens
   - Monthly Expenditure     : $${results.constrainedDecodingEngine.monthlyTokenCostUSD.toLocaleString()} / mo

FINANCIAL & LATENCY ARBITRAGE:
- Monthly Cost Reduction   : $${results.monthlyTokenSavingsUSD.toLocaleString()} (${results.costReductionPct}% cut)
- Annual Cost Arbitrage    : $${results.annualTokenSavingsUSD.toLocaleString()} / year
- Latency Compression      : ${results.latencyReductionPct}% faster turnaround
- Monthly Wasted Tokens Cut: ${results.avoidedRetryTokensMonthly}M retry tokens eliminated

VERDICT:
Deploying GPU-accelerated grammar logit masking (XGrammar / Outlines) eliminates syntax hallucinations and retry latency cascades while cutting token expenditure by up to 85% compared to commercial API function calling.
================================================================================
Audit performed via https://elesium.online/tools/enterprise-structured-output-latency-simulator`;
    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const jsonLdWebapp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Enterprise Structured Output & JSON Grammar Decoding Simulator",
    "url": "https://elesium.online/tools/enterprise-structured-output-latency-simulator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All modern browsers (HTML5/JavaScript)",
    "description": "Simulate and benchmark deterministic constrained decoding (Outlines, vLLM XGrammar, GBNF) vs unconstrained generation and Pydantic retry loops. Calculate sub-5ms vocabulary logit masking, token wastage elimination, and cloud API spend reductions.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Elesium - Enterprise AI Automation Agency",
      "url": "https://elesium.online"
    }
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://elesium.online"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Interactive Tools",
        "item": "https://elesium.online/resources"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Structured Output Simulator",
        "item": "https://elesium.online/tools/enterprise-structured-output-latency-simulator"
      }
    ]
  };

  const faqs = [
    {
      q: "What is Constrained Decoding and how does it guarantee 0% JSON parse failures?",
      a: "Constrained decoding (implemented via libraries like Outlines, vLLM XGrammar, or llama.cpp GBNF grammars) transforms your Pydantic model or JSON Schema into a deterministic Finite State Machine (FSM). During the autoregressive generation loop, before token logits are sampled, the engine masks all vocabulary tokens that would violate the schema syntax to -infinity. Because invalid tokens are never sampled, the model is mathematically incapable of generating malformed JSON, unclosed quotes, or illegal types."
    },
    {
      q: "Why do unconstrained prompt retries cause runaway latency cascades?",
      a: "When relying on naive prompt instructions (e.g. 'Output valid JSON conforming to this schema'), models fail on complex nested structures or union types 8% to 18% of the time. When Pydantic raises a ValidationError, the application must re-feed the prompt, the invalid completion, and the error traceback back into the LLM. This second roundtrip adds 400ms to 1,500ms of latency and consumes 1.4x to 1.8x more tokens per request, degrading user experience and inflating cloud API invoices."
    },
    {
      q: "How does vLLM XGrammar eliminate CPU grammar parsing bottlenecks?",
      a: "Earlier constrained decoding frameworks suffered from high CPU overhead because computing valid token masks across a 128,000-token vocabulary on every token step was slow. Modern engines like XGrammar pre-compile JSON Schemas into compact bitsets and push logit masking directly to CUDA kernels. This drops grammar masking overhead to under 5 microseconds per token, preserving near-peak GPU decode throughput (120+ tokens/sec on NVIDIA H100)."
    },
    {
      q: "How does self-hosted constrained vLLM compare to OpenAI or Claude Function Calling?",
      a: "Commercial APIs provide proprietary server-side function calling, but charge premium frontier token prices ($2.50 to $15.00 per 1M tokens) and introduce vendor lock-in with unpredictable latency spikes. Running open-weights models (like Llama 3.3 70B or Qwen 2.5 72B) on sovereign private vLLM clusters with XGrammar delivers 100% deterministic schema adherence at $0.35 to $0.85 per 1M tokens—reducing enterprise structured extraction costs by up to 85%."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Structured Output &amp; JSON Grammar Decoding Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark deterministic constrained decoding (Outlines, vLLM XGrammar, GBNF) vs unconstrained generation and Pydantic retry loops. Calculate sub-5ms vocabulary logit masking, token wastage elimination, and cloud API spend reductions."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-structured-output-latency-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdWebapp)}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumb)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-white selection:bg-sky-500 selection:text-white">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link to="/resources" className="hover:text-white transition-colors">Tools</Link>
              <span>/</span>
              <span className="text-sky-400 font-medium">Structured Output &amp; Grammar Decoding Simulator</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700/60 transition-all"
              >
                <Code className="w-3.5 h-3.5 text-sky-400" />
                <span>Embed Widget</span>
              </button>
            </div>
          </div>
        </div>

        {/* Hero Header */}
        <header className="relative pt-12 pb-8 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/40 via-slate-950/20 to-slate-950 pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <FileJson className="w-3.5 h-3.5" />
              <span>Deterministic Grammar Decoding &amp; Schema Integrity Lab</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Enterprise Structured Output &amp; <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
                JSON Grammar Decoding Simulator
              </span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Model deterministic context-free grammar logit masking (vLLM XGrammar, Outlines) versus unconstrained prompt generation and Pydantic retry cascades. Calculate sub-5ms vocabulary logit filtering, zero retry token wastage, and cloud cost arbitrage.
            </p>
          </div>
        </header>

        {/* Main Simulator Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Configuration Column (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <Sliders className="w-5 h-5 text-sky-400" />
                    <h2 className="text-base font-bold text-white">Workload Parameters</h2>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                    Live Reactive
                  </span>
                </div>

                <div className="space-y-6">
                  {/* Monthly Volume Slider */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Monthly Structured Invocations
                      </label>
                      <span className="text-sm font-mono font-bold text-sky-400">
                        {monthlyRequests.toLocaleString()} / mo
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="3000000"
                      step="25000"
                      value={monthlyRequests}
                      onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>10k</span>
                      <span>1.5M</span>
                      <span>3M queries</span>
                    </div>
                  </div>

                  {/* Schema Complexity Selector */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Schema Complexity &amp; Depth
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'simple', label: 'Flat JSON', desc: '4-6 primitive keys' },
                        { id: 'medium', label: 'Nested Schema', desc: 'Enums, regex, arrays' },
                        { id: 'deep_ast', label: 'Deep AST', desc: 'Recursive union types' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setSchemaComplexity(item.id as SchemaComplexity)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            schemaComplexity === item.id
                              ? 'bg-sky-500/10 border-sky-500 text-white shadow-sm'
                              : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                          }`}
                        >
                          <div className="text-xs font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hardware Deployment Target */}
                  <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                      Infrastructure Execution Tier
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setHardwareDeployment('sovereign_vllm')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          hardwareDeployment === 'sovereign_vllm'
                            ? 'bg-sky-500/10 border-sky-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          <Cpu className="w-3.5 h-3.5 text-sky-400" />
                          <span>Sovereign vLLM Cluster</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">Llama 3.3 70B ($0.35/$0.85 per 1M)</div>
                      </button>

                      <button
                        onClick={() => setHardwareDeployment('cloud_frontier')}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          hardwareDeployment === 'cloud_frontier'
                            ? 'bg-sky-500/10 border-sky-500 text-white'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800/80'
                        }`}
                      >
                        <div className="flex items-center space-x-1.5 text-xs font-bold">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Cloud Frontier API</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">GPT-4o / Claude ($2.50/$10 per 1M)</div>
                      </button>
                    </div>
                  </div>

                  {/* Output Tokens Payload */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Average Structured Tokens / Call
                      </label>
                      <span className="text-sm font-mono font-bold text-sky-400">
                        {avgOutputTokens} tokens
                      </span>
                    </div>
                    <input
                      type="range"
                      min="150"
                      max="1500"
                      step="50"
                      value={avgOutputTokens}
                      onChange={(e) => setAvgOutputTokens(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>150 tks (Summary)</span>
                      <span>750 tks</span>
                      <span>1,500 tks (Deep Table)</span>
                    </div>
                  </div>

                  {/* Max Pydantic Retries */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Unconstrained Pydantic Retry Limit
                      </label>
                      <span className="text-sm font-mono font-bold text-sky-400">
                        {pydanticRetryCountMax} attempts
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="4"
                      step="1"
                      value={pydanticRetryCountMax}
                      onChange={(e) => setPydanticRetryCountMax(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                      <span>1 retry</span>
                      <span>2 retries (Default)</span>
                      <span>4 retries</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-indigo-950/40 border border-sky-500/20 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-sky-400 text-xs font-bold uppercase mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sovereign Grammar Acceleration</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminate JSON parse exceptions in mission-critical pipelines. Elesium deploys pre-compiled XGrammar and Outlines FSM decoders directly inside enterprise private VPC clusters.
                </p>
                <div className="mt-4 flex items-center space-x-3">
                  <button
                    onClick={copyArchitecturalMemo}
                    className="w-full inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                    <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Audit Memo'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Comparison Column (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* High-Level Arbitrage Impact Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Monthly Savings</span>
                    <TrendingDown className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                    ${results.monthlyTokenSavingsUSD.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    ${results.annualTokenSavingsUSD.toLocaleString()} / year ({results.costReductionPct}% cut)
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-sky-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Turnaround Speed</span>
                    <Zap className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-white font-mono">
                    {results.constrainedDecodingEngine.totalExecutionLatencyMs}ms
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {results.latencyReductionPct}% faster (0 retries)
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 relative overflow-hidden">
                  <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Syntax Error Rate</span>
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="mt-2 text-2xl font-extrabold text-emerald-400 font-mono">
                    0.0%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 font-mono">
                    {results.avoidedRetryTokensMonthly}M retry tokens saved
                  </div>
                </div>
              </div>

              {/* Three-Way Engine Architectural Breakdown */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
                <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
                  <FileJson className="w-4 h-4 text-sky-400" />
                  <span>Architecture Comparison Matrix</span>
                </h3>

                <div className="space-y-4">
                  {/* Engine 1: Elesium Constrained Decoding */}
                  <div className="border border-sky-500/40 bg-sky-950/20 rounded-xl p-4 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-bold text-white">Elesium Constrained Decoding (XGrammar / Outlines)</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                        100% Deterministic
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Parse Failures</div>
                        <div className="text-emerald-400 font-bold text-sm mt-0.5">0.0%</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">End-to-End Latency</div>
                        <div className="text-sky-400 font-bold text-sm mt-0.5">{results.constrainedDecodingEngine.totalExecutionLatencyMs}ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Retry Tokens</div>
                        <div className="text-white font-bold text-sm mt-0.5">0 tokens</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-sky-300 font-bold text-sm mt-0.5">${results.constrainedDecodingEngine.monthlyTokenCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      GPU-accelerated context-free grammar masks invalid logits in sub-5μs per token. Zero invalid JSON outputs, zero retry overhead.
                    </p>
                  </div>

                  {/* Engine 2: Vendor Tool Calling */}
                  <div className="border border-slate-800 bg-slate-900/40 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                        <span className="text-sm font-bold text-slate-200">Cloud Vendor Function Calling API</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-950/40 border border-indigo-500/20 px-2 py-0.5 rounded-md">
                        Proprietary Masking
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Parse Failures</div>
                        <div className="text-indigo-400 font-bold text-sm mt-0.5">{results.vendorToolCalling.parseErrorRatePct}%</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">End-to-End Latency</div>
                        <div className="text-slate-200 font-bold text-sm mt-0.5">{results.vendorToolCalling.totalExecutionLatencyMs}ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Retry Tokens</div>
                        <div className="text-slate-300 font-bold text-sm mt-0.5">{results.vendorToolCalling.wastedRetryTokensPerReq} tks/req</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-indigo-300 font-bold text-sm mt-0.5">${results.vendorToolCalling.monthlyTokenCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Reliable for standard objects, but locks data to public hyperscaler endpoints at steep token markups ($10/1M output).
                    </p>
                  </div>

                  {/* Engine 3: Unconstrained Prompt + Pydantic Retries */}
                  <div className="border border-rose-500/30 bg-rose-950/10 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-sm font-bold text-slate-200">Unconstrained Prompt + Pydantic Retry Loop</span>
                      </div>
                      <span className="text-xs font-mono text-rose-400 bg-rose-950/40 border border-rose-500/20 px-2 py-0.5 rounded-md">
                        Probabilistic Flaws
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Parse Failures</div>
                        <div className="text-rose-400 font-bold text-sm mt-0.5">{results.unconstrainedEngine.parseErrorRatePct}%</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">End-to-End Latency</div>
                        <div className="text-rose-300 font-bold text-sm mt-0.5">{results.unconstrainedEngine.totalExecutionLatencyMs}ms</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Wasted / Req</div>
                        <div className="text-rose-400 font-bold text-sm mt-0.5">{results.unconstrainedEngine.wastedRetryTokensPerReq} tks</div>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">Monthly Cost</div>
                        <div className="text-rose-300 font-bold text-sm mt-0.5">${results.unconstrainedEngine.monthlyTokenCostUSD.toLocaleString()}</div>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                      Frequent syntax breaks, trailing comma errors, and unclosed quotes trigger costly retry loops, multiplying latency and cloud bills.
                    </p>
                  </div>
                </div>
              </div>

              {/* Conversion CTA Module */}
              <div className="bg-gradient-to-r from-sky-900/50 via-slate-900 to-indigo-900/50 border border-sky-500/30 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-bold text-white mb-2">
                  Lock Zero-Exception Structured Extraction in Production
                </h3>
                <p className="text-xs text-slate-300 max-w-xl mx-auto mb-4">
                  Deploy sovereign private vLLM clusters with compiled context-free grammar logit masks. Guarantee 100% schema adherence across SAP, ERP, and BFSI ledgers.
                </p>
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-sky-500/20 cursor-pointer">
                    <span>Schedule Architecture Scope Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="max-w-2xl mx-auto py-8">
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>

            </div>
          </div>

          {/* Deep FAQ Section */}
          <section className="mt-16 border-t border-slate-800/80 pt-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              Frequently Asked Questions: Deterministic Grammar Decoding
            </h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-sky-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaq === idx ? 'rotate-180 text-sky-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === idx && (
                    <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>

        {/* Embed Modal */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center space-x-2">
                <Code className="w-5 h-5 text-sky-400" />
                <span>Embed This Simulator</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Embed this interactive structured output and JSON grammar decoding calculator on your technical blog or developer documentation.
              </p>
              <div className="relative">
                <textarea
                  readOnly
                  value={embedCodeSnippet}
                  rows={4}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none resize-none"
                />
                <button
                  onClick={copyEmbedCode}
                  className="mt-3 w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-semibold transition-colors"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? 'Code Copied to Clipboard!' : 'Copy Embed Code'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
