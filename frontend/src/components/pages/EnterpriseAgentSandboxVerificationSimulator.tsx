import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Terminal,
  Cpu,
  Lock
} from 'lucide-react';
import {
  simulateSandboxVerification,
  SandboxVerificationInputs
} from '../calculator/agentSandboxVerificationModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseAgentSandboxVerificationSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyCodeExecutions, setMonthlyCodeExecutions] = useState<number>(200000);
  const [avgExecutionTimeMs, setAvgExecutionTimeMs] = useState<number>(350);
  const [adversarialOrMaliciousScriptPct, setAdversarialOrMaliciousScriptPct] = useState<number>(5.5);
  const [maxAllowedColdBootMs] = useState<number>(250);
  const [costPerCpuSecondUSD] = useState<number>(0.00008);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCode = `<iframe src="https://elesium.online/embed/agent-sandbox-formal-verification-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe>
<div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT SANDBOX CODE EXECUTION & FORMAL VERIFICATION MEMO
Workload Profile: ${(inputs.monthlyCodeExecutions / 1000).toFixed(0)}k executions/mo | ${inputs.avgExecutionTimeMs}ms avg execution | ${inputs.adversarialOrMaliciousScriptPct}% untrusted script rate

ARCHITECTURAL COMPARISON:
1. Unconstrained Host Execution (Raw Subprocess):
   - Cold Boot: 2.0ms | Breakout Risk: ${results.unconstrainedHost.breakoutVulnerabilityPct}%
   - Annual Forensics & Remediation Loss: $${results.unconstrainedHost.annualizedTotalCostUSD.toLocaleString()}
2. Naive Docker Container Spawn & IPC:
   - Cold Boot Latency: ${results.naiveDocker.coldBootOverheadMs}ms (Total: ${results.naiveDocker.totalExecutionLatencyMs}ms)
   - Annual Compute & Risk Expense: $${results.naiveDocker.annualizedTotalCostUSD.toLocaleString()} (480MB RAM/worker)
3. Elesium Sovereign MicroVM & Formal AST Verification:
   - Cold Boot Latency: ${results.sovereignMicrovm.coldBootOverheadMs}ms [${results.bootLatencyReductionPct}% boot reduction vs Docker]
   - Breakout Vulnerability: ${results.sovereignMicrovm.breakoutVulnerabilityPct}% [100% breakout suppression]
   - Formal Invariant Proof Coverage: ${results.sovereignMicrovm.formalInvariantCoveragePct}% (Z3 static AST solver)
   - Memory Density: ${results.sovereignMicrovm.memoryFootprintPerWorkerMB}MB per isolated microVM
   - Net Annualized Savings: $${results.annualCostSavingsUSD.toLocaleString()}

RECOMMENDATION: Deploy ephemeral KVM microVMs with eBPF syscall filtering and formal AST verification over naive Docker containers for mission-critical agent workflows.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why is raw host code execution catastrophic for enterprise multi-agent architectures?',
      a: 'Autonomous agents generate Python, SQL, and shell commands on the fly. When these scripts are executed in host subprocesses without strict kernel virtualization, any prompt injection or adversarial edge condition can result in directory traversal, environment variable exfiltration (e.g., database credentials and API keys), or remote code execution (RCE). A single compromised script can jeopardize the entire private VPC.'
    },
    {
      q: 'Why does naive Docker container spawning fail in low-latency agent loops?',
      a: 'Spawning a standard Docker container incurs 1,800ms to 3,500ms in container runtime initialization, namespace setup, and cgroup binding. In iterative multi-agent reasoning workflows that require repeated REPL cycles, this latency overhead destroys user experience and inflates cloud compute bills. Furthermore, shared Linux kernel architectures remain susceptible to container escape zero-days.'
    },
    {
      q: 'How does Elesium achieve sub-45ms cold boots with mathematical security guarantees?',
      a: 'Elesium combines ephemeral KVM microVMs (via Firecracker/gVisor architectures) with pre-execution formal AST analysis. Before code reaches the VM, a deterministic Z3 constraint solver verifies that the abstract syntax tree respects memory, call-depth, and I/O invariants. Safe code executes in a sub-45ms microVM with eBPF seccomp filters blocking all unauthorized system calls.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-neutral-100 font-sans selection:bg-white/20 selection:text-black">
      <Helmet>
        <title>Enterprise Multi-Agent Sandboxed Code Execution &amp; Formal Verification Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark autonomous agent code sandbox isolation. Compare unconstrained host execution against naive Docker containers and sovereign microVMs with sub-45ms cold boot, 0.00% breakout vulnerability, and formal AST verification."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-sandbox-formal-verification-simulator/" />
      </Helmet>

      {/* Hero Section */}
      <header className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-b border-neutral-800 bg-neutral-950">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/20 text-neutral-200 text-xs font-mono uppercase tracking-wider mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Interactive MicroVM &amp; AST Formal Verification Lab</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Enterprise Multi-Agent Sandboxed Code Execution &amp; Formal Verification Simulator
          </h1>
          <p className="text-base sm:text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Simulate and benchmark autonomous code sandbox architectures. Contrast unconstrained host execution against naive Docker container overhead and sovereign KVM microVMs with sub-45ms cold boot, 0.00% breakout vulnerability, and Z3 formal AST verification.
          </p>
        </div>
      </header>

      {/* Main Interactive Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Sliders Block */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-neutral-200" />
              <h2 className="text-lg font-bold text-white">Workload &amp; Sandbox Calibration Parameters</h2>
            </div>
            <button
                onClick={() => openWhatsApp()}
                className="active:scale-[0.97] inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="active:scale-[0.97] text-xs font-mono text-neutral-200 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/20 transition-all duration-300"
            >
              <Code className="w-3.5 h-3.5" />
              <span>Embed Widget</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Monthly Code Executions Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-neutral-300">Monthly Code Executions</span>
                <span className="text-white font-bold">{(monthlyCodeExecutions / 1000).toFixed(0)}k calls</span>
              </div>
              <input
                type="range"
                min={25000}
                max={1000000}
                step={25000}
                value={monthlyCodeExecutions}
                onChange={(e) => setMonthlyCodeExecutions(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Total REPL and tool execution invocations across agent swarms.
              </span>
            </div>

            {/* Execution Duration Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-neutral-300">Average Execution Runtime</span>
                <span className="text-white font-bold">{avgExecutionTimeMs} ms</span>
              </div>
              <input
                type="range"
                min={50}
                max={2000}
                step={50}
                value={avgExecutionTimeMs}
                onChange={(e) => setAvgExecutionTimeMs(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Payload computation wall-clock duration excluding sandbox boot.
              </span>
            </div>

            {/* Adversarial Script Rate Slider */}
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-neutral-300">Untrusted / Adversarial Rate</span>
                <span className="text-red-400 font-bold">{adversarialOrMaliciousScriptPct.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min={1.0}
                max={15.0}
                step={0.5}
                value={adversarialOrMaliciousScriptPct}
                onChange={(e) => setAdversarialOrMaliciousScriptPct(Number(e.target.value))}
                className="w-full h-2 bg-neutral-800 rounded-full appearance-none cursor-pointer accent-white"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Rate of hallucinated, prompt-injected, or untrusted user scripts.
              </span>
            </div>
          </div>
        </div>

        {/* Top Impact KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-[24px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/80"></div>
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">Annual Cost Savings</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-200 font-mono">
              ${(results.annualCostSavingsUSD / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-neutral-400 block mt-1">Compute &amp; Security Remediation</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-[24px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/80"></div>
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">Cold Boot Speedup</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-200 font-mono">
              {results.bootLatencyReductionPct}%
            </span>
            <span className="text-xs text-neutral-400 block mt-1">{results.sovereignMicrovm.coldBootOverheadMs}ms vs {results.naiveDocker.coldBootOverheadMs}ms</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-[24px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/80"></div>
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">Breakout Suppression</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-neutral-200 font-mono">
              100%
            </span>
            <span className="text-xs text-neutral-400 block mt-1">0.00% MicroVM Escape Risk</span>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-[24px] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500"></div>
            <span className="text-xs font-mono uppercase text-neutral-400 block mb-1">Formal Invariant Pass</span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
              99.99%
            </span>
            <span className="text-xs text-neutral-400 block mt-1">Z3 AST Static Proof Verification</span>
          </div>
        </div>

        {/* 3-Tier Architecture Benchmark Table */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[24px] overflow-hidden mb-8 shadow-2xl">
          <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-neutral-200" />
              <span>Architectural Isolation &amp; Verification Benchmark</span>
            </h3>
            <span className="text-xs font-mono text-neutral-400">Formal Invariants vs Container IPC</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-950 text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-800">
                <tr>
                  <th className="p-4">Execution Architecture</th>
                  <th className="p-4">Cold Boot Overhead</th>
                  <th className="p-4">Total Execution Latency</th>
                  <th className="p-4">Breakout Risk</th>
                  <th className="p-4">Formal Verification</th>
                  <th className="p-4">RAM / Worker</th>
                  <th className="p-4">Annual Cost Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800 text-neutral-200">
                <tr className="hover:bg-neutral-800/40 transition-colors">
                  <td className="p-4 font-semibold text-red-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>Unconstrained Host Subprocess</span>
                  </td>
                  <td className="p-4 text-neutral-300">2.0 ms</td>
                  <td className="p-4 text-neutral-300">{results.unconstrainedHost.totalExecutionLatencyMs} ms</td>
                  <td className="p-4 text-red-400 font-bold">{results.unconstrainedHost.breakoutVulnerabilityPct}% (High)</td>
                  <td className="p-4 text-neutral-400">0.0% (None)</td>
                  <td className="p-4 text-neutral-300">45 MB</td>
                  <td className="p-4 text-red-400 font-bold">${results.unconstrainedHost.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>

                <tr className="hover:bg-neutral-800/40 transition-colors">
                  <td className="p-4 font-semibold text-amber-400 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>Naive Docker Container Spawn</span>
                  </td>
                  <td className="p-4 text-amber-400">{results.naiveDocker.coldBootOverheadMs} ms</td>
                  <td className="p-4 text-amber-400">{results.naiveDocker.totalExecutionLatencyMs} ms</td>
                  <td className="p-4 text-amber-400">{results.naiveDocker.breakoutVulnerabilityPct}% (Shared Kernel)</td>
                  <td className="p-4 text-neutral-300">15.0%</td>
                  <td className="p-4 text-amber-400">480 MB</td>
                  <td className="p-4 text-amber-400">${results.naiveDocker.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>

                <tr className="bg-white/[0.03] hover:bg-neutral-200/10 transition-colors border-l-2 border-white/30">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-neutral-200" />
                    <span>Elesium Sovereign MicroVM &amp; Formal AST</span>
                  </td>
                  <td className="p-4 text-white font-bold">{results.sovereignMicrovm.coldBootOverheadMs} ms</td>
                  <td className="p-4 text-white font-bold">{results.sovereignMicrovm.totalExecutionLatencyMs} ms</td>
                  <td className="p-4 text-white font-bold">0.00% (Isolated KVM)</td>
                  <td className="p-4 text-white font-bold">99.99% Proof</td>
                  <td className="p-4 text-white font-bold">28 MB</td>
                  <td className="p-4 text-white font-bold">${results.sovereignMicrovm.annualizedTotalCostUSD.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Executive Memo Generator */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 sm:p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-200" />
              <span>Executive Architecture Memo for SecOps &amp; Infrastructure Leadership</span>
            </h3>
            <button
              onClick={copyExecutiveMemo}
              className="active:scale-[0.97] text-xs font-semibold px-3 py-1.5 rounded-full bg-white hover:bg-neutral-200 text-black transition-all duration-300 flex items-center gap-1.5"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-neutral-200" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy SecOps Memo'}</span>
            </button>
          </div>
          <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
            Generate an instant, mathematically verified architectural justification memo comparing ephemeral KVM microVMs against naive Docker container overhead:
          </p>
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 font-mono text-xs text-neutral-300 leading-relaxed overflow-x-auto select-all">
            <p className="text-white mb-2 font-bold">ENTERPRISE AGENT SANDBOX CODE EXECUTION &amp; FORMAL VERIFICATION MEMO</p>
            <p className="mb-2">Workload: {(inputs.monthlyCodeExecutions / 1000).toFixed(0)}k executions/mo | Runtime: {inputs.avgExecutionTimeMs}ms | Untrusted Rate: {inputs.adversarialOrMaliciousScriptPct}%</p>
            <p className="text-neutral-400 mb-1">1. Unconstrained Host: 2.0ms boot | Breakout Risk: {results.unconstrainedHost.breakoutVulnerabilityPct}% | Remediation Loss: ${results.unconstrainedHost.annualizedTotalCostUSD.toLocaleString()}</p>
            <p className="text-amber-400 mb-1">2. Naive Docker: {results.naiveDocker.coldBootOverheadMs}ms boot | Total: {results.naiveDocker.totalExecutionLatencyMs}ms | Cost: ${results.naiveDocker.annualizedTotalCostUSD.toLocaleString()}</p>
            <p className="text-neutral-200 mb-2">3. Elesium Sovereign MicroVM: {results.sovereignMicrovm.coldBootOverheadMs}ms boot [{results.bootLatencyReductionPct}% cut] | Breakout: 0.00% | Invariant Proof: 99.99% | Net Savings: ${results.annualCostSavingsUSD.toLocaleString()}</p>
            <p className="text-neutral-400 font-semibold">RECOMMENDATION: Deploy ephemeral KVM microVMs with eBPF syscall filtering and formal AST verification over naive Docker containers for mission-critical agent workflows.</p>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-[24px] p-6 sm:p-8 mb-8 shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-5 h-5 text-neutral-200" />
            <span>Frequently Asked Architectural &amp; SecOps Questions</span>
          </h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-neutral-800 rounded-[24px] overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="active:scale-[0.97] w-full text-left p-4 flex items-center justify-between text-sm font-semibold text-neutral-200 hover:text-white bg-neutral-950/50 transition-all duration-300"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-neutral-200' : 'text-neutral-400'}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 text-xs sm:text-sm text-neutral-300 leading-relaxed bg-neutral-950/20 border-t border-neutral-800">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-neutral-950 border border-white/20 rounded-[32px] p-8 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Harden Your Autonomous Agent Execution Pipeline
            </h2>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              Elesium architects sovereign, air-gapped code execution sandboxes with sub-45ms microVM boot times and mathematical formal AST proofs for enterprise BFSI, aerospace, and sovereign defense infrastructure.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <ExpandableScreen>
                <ExpandableScreenTrigger className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm transition-all shadow-lg inline-flex items-center gap-2">
                  <span>Schedule Architecture Audit</span>
                  <ArrowRight className="w-4 h-4" />
                </ExpandableScreenTrigger>
                <ExpandableScreenContent>
                  <MandateApplicationForm />
                </ExpandableScreenContent>
              </ExpandableScreen>
              <Link
                to="/solutions/"
                className="px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-sm transition-all duration-300 border border-neutral-700"
              >
                Explore All Sovereign Solutions
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-[28px] max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="active:scale-[0.97] absolute top-4 right-4 text-neutral-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-neutral-200" />
              Embed This Sandbox Simulator
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Copy and paste this snippet into your engineering documentation, intranet, or technical blog:
            </p>
            <div className="bg-neutral-950 border border-neutral-800 rounded-[18px] p-3 font-mono text-xs text-neutral-300 overflow-x-auto mb-4 select-all">
              {embedCode}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400">Watermarked to Elesium Sovereign Architecture</span>
              <button
                onClick={copyEmbedToClipboard}
                className="active:scale-[0.97] px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all duration-300 flex items-center gap-1.5"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4 text-neutral-200" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Code Copied!' : 'Copy Embed Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
