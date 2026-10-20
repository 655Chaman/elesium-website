import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Zap,
  TrendingDown
} from 'lucide-react';
import {
  calculatePromptFirewallSimulation,
  PromptFirewallInputs,
  AttackVector,
  SchemaStrictness,
  GuardrailLlmModel
} from '../calculator/promptFirewallSimulatorModel';

export default function EmbedPromptFirewallSimulator() {
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(250000);
  const [attackVector, setAttackVector] = useState<AttackVector>('indirect_prompt_injection');
  const [schemaStrictness] = useState<SchemaStrictness>('pydantic_ast_enforced');
  const [guardrailLlmModel] = useState<GuardrailLlmModel>('llama_guard_3');
  const [averagePromptTokens] = useState<number>(512);

  const inputs: PromptFirewallInputs = useMemo(() => ({
    monthlyQueryVolume,
    attackVector,
    schemaStrictness,
    guardrailLlmModel,
    averagePromptTokens
  }), [
    monthlyQueryVolume,
    attackVector,
    schemaStrictness,
    guardrailLlmModel,
    averagePromptTokens
  ]);

  const results = useMemo(() => {
    return calculatePromptFirewallSimulation(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Agentic Prompt Injection Firewall Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/prompt-injection-firewall-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
            Interactive Security Simulator
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Agentic Prompt Injection & Boundary Defense Simulator
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-slate-400">AST Defense Inspection</div>
          <div className="text-base font-extrabold text-emerald-400 font-mono">
            {results.defenseTiers[2].inspectionLatencyMs} ms (Sub-2ms)
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Monthly Queries: {monthlyQueryVolume.toLocaleString()} requests
          </label>
          <input
            type="range"
            min="25000"
            max="1000000"
            step="25000"
            value={monthlyQueryVolume}
            onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
            className="w-full accent-rose-500 bg-slate-800 h-1.5 rounded cursor-pointer"
          />
        </div>

        <div>
          <label className="block text-slate-400 text-[10px] font-semibold mb-1">
            Simulated Attack Vector
          </label>
          <select
            value={attackVector}
            onChange={(e) => setAttackVector(e.target.value as AttackVector)}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 font-mono"
          >
            <option value="indirect_prompt_injection">Indirect Injection via RAG / Web Doc</option>
            <option value="tool_parameter_sql_injection">Tool Parameter SQL Injection</option>
            <option value="ascii_smuggling_homoglyph">Unicode Homoglyph / ASCII Smuggling</option>
            <option value="markdown_image_exfiltration">Markdown Image Exfiltration (JWT Leak)</option>
          </select>
        </div>
      </div>

      {/* Defense Architecture Benchmark Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        {/* Tier 1: Naive Direct Ingestion */}
        <div className="bg-slate-900/60 border border-red-500/30 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-red-400 font-bold uppercase tracking-wider">
              Naive Direct Model
            </span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          </div>
          <div className="text-xl font-bold font-mono text-red-400">
            {results.defenseTiers[0].attackBlockRatePct}%
          </div>
          <div className="text-[10px] text-slate-400 mb-2">Attack Block Rate</div>
          <div className="space-y-1 text-[11px] font-mono text-slate-300 border-t border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Inspection:</span>
              <span className="text-white font-bold">{results.defenseTiers[0].inspectionLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Verdict:</span>
              <span className="text-red-400 font-bold">Compromised</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Token Cost:</span>
              <span className="text-white">$0</span>
            </div>
          </div>
        </div>

        {/* Tier 2: Secondary Guardrail LLM */}
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
              Secondary Guardrail LLM
            </span>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {results.defenseTiers[1].attackBlockRatePct}%
          </div>
          <div className="text-[10px] text-slate-400 mb-2">Attack Block Rate ({results.defenseTiers[1].falsePositiveRatePct}% False Pos)</div>
          <div className="space-y-1 text-[11px] font-mono text-slate-300 border-t border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Inspection:</span>
              <span className="text-amber-400 font-bold">{results.defenseTiers[1].inspectionLatencyMs} ms (Lag)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Cost:</span>
              <span className="text-white font-bold">${results.defenseTiers[1].monthlyCostUsd.toLocaleString()}/mo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Token Overhead:</span>
              <span className="text-amber-400">2.0x (Duplicate)</span>
            </div>
          </div>
        </div>

        {/* Tier 3: Elesium AST Firewall */}
        <div className="bg-emerald-950/20 border border-emerald-500/50 rounded-xl p-3 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              Elesium AST Syntax Firewall
            </span>
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400">
            {results.defenseTiers[2].attackBlockRatePct}%
          </div>
          <div className="text-[10px] text-slate-400 mb-2">Deterministic AST Immunity</div>
          <div className="space-y-1 text-[11px] font-mono text-slate-300 border-t border-slate-800/80 pt-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Inspection:</span>
              <span className="text-emerald-400 font-bold">{results.defenseTiers[2].inspectionLatencyMs} ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Cost:</span>
              <span className="text-emerald-400 font-bold">$0 (Zero Token)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Air-Gapped VPC:</span>
              <span className="text-emerald-400 font-bold">100% Native</span>
            </div>
          </div>
        </div>
      </div>

      {/* Forensic Verdict Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mb-4 text-xs font-mono">
        <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold mb-1 flex items-center justify-between">
          <span>Forensic Attack Payload Breakdown</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> {results.latencyReductionPct}% Latency Cut
          </span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          {results.simulatedAttack.forensicMechanism}
        </p>
      </div>

      {/* Embed Footer Watermark */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/tools/enterprise-prompt-injection-firewall-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2"
          >
            Elesium Prompt Firewall Simulator
          </a>
        </div>
        <a
          href="https://elesium.online/audit"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-medium"
        >
          <span>Schedule Enterprise Audit</span>
          <ExternalLink className="w-3 h-3 text-rose-400" />
        </a>
      </div>
    </div>
  );
}
