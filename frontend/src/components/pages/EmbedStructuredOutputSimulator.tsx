import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  Zap,
  TrendingDown,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import {
  simulateStructuredOutput,
  StructuredOutputInputs,
  SchemaComplexity,
  HardwareDeployment
} from '../calculator/structuredOutputSimulatorModel';

export default function EmbedStructuredOutputSimulator() {
  const [monthlyRequests, setMonthlyRequests] = useState<number>(500000);
  const [schemaComplexity, setSchemaComplexity] = useState<SchemaComplexity>('medium');
  const [hardwareDeployment, setHardwareDeployment] = useState<HardwareDeployment>('sovereign_vllm');
  const [avgOutputTokens] = useState<number>(450);
  const [pydanticRetryCountMax] = useState<number>(2);

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

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Structured Output &amp; JSON Grammar Decoding Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/structured-output-latency-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
            Interactive Schema Decoding Widget
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Structured Output &amp; Grammar Decoding Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">Monthly Savings</div>
          <div className="text-base font-extrabold text-sky-400 font-mono">
            ${results.monthlyTokenSavingsUSD.toLocaleString()} / mo
          </div>
        </div>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Volume: {monthlyRequests.toLocaleString()} requests
          </label>
          <input
            type="range"
            min="25000"
            max="2000000"
            step="25000"
            value={monthlyRequests}
            onChange={(e) => setMonthlyRequests(Number(e.target.value))}
            className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Schema Complexity
          </label>
          <select
            value={schemaComplexity}
            onChange={(e) => setSchemaComplexity(e.target.value as SchemaComplexity)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="simple">Flat JSON (4-6 keys)</option>
            <option value="medium">Nested Schema (Enums &amp; Arrays)</option>
            <option value="deep_ast">Deep AST (Recursive Union)</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Infrastructure Target
          </label>
          <select
            value={hardwareDeployment}
            onChange={(e) => setHardwareDeployment(e.target.value as HardwareDeployment)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="sovereign_vllm">Sovereign vLLM (Llama 3.3 70B)</option>
            <option value="cloud_frontier">Cloud Frontier API (GPT-4o / Claude)</option>
          </select>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4 text-xs font-mono">
        <div className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/30">
          <div className="flex items-center justify-between text-sky-400 text-[10px] font-bold uppercase mb-1">
            <span>Elesium Constrained</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white">0.0% Fails</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Latency: {results.constrainedDecodingEngine.totalExecutionLatencyMs}ms | 0 retries
          </div>
          <div className="text-[11px] font-bold text-sky-300 mt-2">
            ${results.constrainedDecodingEngine.monthlyTokenCostUSD.toLocaleString()} / mo
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between text-indigo-400 text-[10px] font-bold uppercase mb-1">
            <span>Vendor Tool Calling</span>
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-slate-200">{results.vendorToolCalling.parseErrorRatePct}% Fails</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Latency: {results.vendorToolCalling.totalExecutionLatencyMs}ms
          </div>
          <div className="text-[11px] font-bold text-indigo-300 mt-2">
            ${results.vendorToolCalling.monthlyTokenCostUSD.toLocaleString()} / mo
          </div>
        </div>

        <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30">
          <div className="flex items-center justify-between text-rose-400 text-[10px] font-bold uppercase mb-1">
            <span>Prompt + Pydantic</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="text-lg font-bold text-rose-300">{results.unconstrainedEngine.parseErrorRatePct}% Fails</div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Latency: {results.unconstrainedEngine.totalExecutionLatencyMs}ms | +{results.unconstrainedEngine.wastedRetryTokensPerReq} tks
          </div>
          <div className="text-[11px] font-bold text-rose-300 mt-2">
            ${results.unconstrainedEngine.monthlyTokenCostUSD.toLocaleString()} / mo
          </div>
        </div>
      </div>

      {/* Footer & Watermark Link */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center space-x-1.5">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>
            Eliminates {results.avoidedRetryTokensMonthly}M wasted retry tokens/month with 100% schema guarantee.
          </span>
        </div>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-medium transition-colors"
        >
          <span>Elesium Sovereign AI Systems</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
