import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import {
  simulateSandboxVerification,
  SandboxVerificationInputs
} from '../calculator/agentSandboxVerificationModel';

export default function EmbedAgentSandboxVerificationSimulator() {
  const [monthlyCodeExecutions, setMonthlyCodeExecutions] = useState<number>(200000);
  const [avgExecutionTimeMs, setAvgExecutionTimeMs] = useState<number>(350);
  const [adversarialOrMaliciousScriptPct, setAdversarialOrMaliciousScriptPct] = useState<number>(5.5);
  const [maxAllowedColdBootMs] = useState<number>(250);
  const [costPerCpuSecondUSD] = useState<number>(0.00008);

  const inputs: SandboxVerificationInputs = useMemo(() => ({
    monthlyCodeExecutions,
    avgExecutionTimeMs,
    adversarialOrMaliciousScriptPct,
    maxAllowedColdBootMs,
    costPerCpuSecondUSD
  }), [
    monthlyCodeExecutions,
    avgExecutionTimeMs,
    adversarialOrMaliciousScriptPct,
    maxAllowedColdBootMs,
    costPerCpuSecondUSD
  ]);

  const results = useMemo(() => {
    return simulateSandboxVerification(inputs);
  }, [inputs]);

  return (
    <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-2xl font-sans max-w-4xl mx-auto">
      <Helmet>
        <title>Enterprise Multi-Agent Sandboxed Code Execution &amp; Formal Verification Simulator Embed | Elesium</title>
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://elesium.online/embed/agent-sandbox-formal-verification-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Interactive Code Sandbox &amp; AST Verifier
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white mt-1">
            Enterprise Agent Code Sandbox &amp; Formal Verification Simulator
          </h2>
        </div>
        <div className="text-right">
          <a
            href="https://elesium.online/tools/enterprise-agent-sandbox-formal-verification-simulator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 transition-colors font-mono"
          >
            <span>Full Simulator</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Monthly Runs</span>
            <span className="text-cyan-400 font-bold">{(monthlyCodeExecutions / 1000).toFixed(0)}k calls</span>
          </div>
          <input
            type="range"
            min={25000}
            max={1000000}
            step={25000}
            value={monthlyCodeExecutions}
            onChange={(e) => setMonthlyCodeExecutions(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Runtime</span>
            <span className="text-cyan-400 font-bold">{avgExecutionTimeMs} ms</span>
          </div>
          <input
            type="range"
            min={50}
            max={2000}
            step={50}
            value={avgExecutionTimeMs}
            onChange={(e) => setAvgExecutionTimeMs(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className="text-slate-300">Untrusted Script Rate</span>
            <span className="text-rose-400 font-bold">{adversarialOrMaliciousScriptPct.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1.0}
            max={15.0}
            step={0.5}
            value={adversarialOrMaliciousScriptPct}
            onChange={(e) => setAdversarialOrMaliciousScriptPct(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
          />
        </div>
      </div>

      {/* Live Result Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Annual Savings</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Compute &amp; Remediation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Cold Boot Speedup</span>
          <span className="text-base sm:text-lg font-bold text-cyan-400 font-mono">
            {results.bootLatencyReductionPct}%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">{results.sovereignMicrovm.coldBootOverheadMs}ms vs {results.naiveDocker.coldBootOverheadMs}ms</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">Breakout Risk</span>
          <span className="text-base sm:text-lg font-bold text-emerald-400 font-mono">
            0.00%
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">Hardware KVM Isolation</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
          <span className="text-[10px] font-mono uppercase text-slate-400 block mb-0.5">RAM / Worker</span>
          <span className="text-base sm:text-lg font-bold text-purple-400 font-mono">
            {results.sovereignMicrovm.memoryFootprintPerWorkerMB} MB
          </span>
          <span className="text-[9px] text-slate-400 block mt-0.5">vs 480MB Docker</span>
        </div>
      </div>

      {/* Architecture Snapshot Comparison */}
      <div className="space-y-2 mb-4 text-xs font-mono">
        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-300">
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>Elesium Sovereign MicroVM &amp; Formal AST</span>
          </div>
          <span className="text-emerald-400 font-semibold">{results.sovereignMicrovm.coldBootOverheadMs}ms Boot | 0.00% Escape | 99.99% Proof</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Naive Docker Container Spawn</span>
          </div>
          <span className="text-amber-400">{results.naiveDocker.coldBootOverheadMs}ms Boot | {results.naiveDocker.breakoutVulnerabilityPct}% Breakout | ${(results.naiveDocker.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Unconstrained Host Subprocess</span>
          </div>
          <span className="text-rose-400">{results.unconstrainedHost.breakoutVulnerabilityPct}% Vulnerability | ${(results.unconstrainedHost.annualizedTotalCostUSD / 1000).toFixed(0)}k/yr Incident Loss</span>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Sub-45ms KVM MicroVMs &amp; Zero Kernel Escape Risk</span>
        </div>
        <div>
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline font-medium"
          >
            Elesium Sovereign AI Architecture
          </a>
        </div>
      </div>
    </div>
  );
}
