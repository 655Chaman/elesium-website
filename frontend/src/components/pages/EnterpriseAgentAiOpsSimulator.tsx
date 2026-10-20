import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Activity,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Zap
} from 'lucide-react';
import {
  simulateAiOpsTelemetry,
  AiOpsInputs
} from '../calculator/agentAiOpsModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentAiOpsSimulator() {
  // Inputs State
  const [clusterSizeNodes, setClusterSizeNodes] = useState<number>(120);
  const [chaosFaultVector, setChaosFaultVector] = useState<'pod_network_partition' | 'memory_leak_oom' | 'database_connection_starvation' | 'thread_deadlock_cascade'>('memory_leak_oom');
  const [remediationEngine, setRemediationEngine] = useState<'agentic_ebpf_mesh' | 'rule_based_webhook' | 'manual_sre_warroom' | 'heuristic_autoscaler'>('agentic_ebpf_mesh');
  const [canaryVerificationStrictness, setCanaryVerificationStrictness] = useState<'zero_loss_canary' | 'fast_failover_balanced' | 'aggressive_pod_kill'>('zero_loss_canary');
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: AiOpsInputs = useMemo(() => ({
    clusterSizeNodes,
    chaosFaultVector,
    remediationEngine,
    canaryVerificationStrictness,
    currency
  }), [
    clusterSizeNodes,
    chaosFaultVector,
    remediationEngine,
    canaryVerificationStrictness,
    currency
  ]);

  const results = useMemo(() => {
    return simulateAiOpsTelemetry(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-aiops-incident-remediation-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AIOps</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT AIOPS & AUTONOMOUS SRE AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-aiops-incident-remediation-simulator)

KUBERNETES CLUSTER & REMEDIATION ARCHITECTURE:
- Cluster Size: ${clusterSizeNodes.toLocaleString()} Production Nodes
- Chaos Fault Scenario: ${chaosFaultVector.replace(/_/g, ' ').toUpperCase()}
- Remediation Fabric: ${remediationEngine.replace(/_/g, ' ').toUpperCase()}
- Canary Verification: ${canaryVerificationStrictness.replace(/_/g, ' ').toUpperCase()}

TELEMETRY & OPERATIONAL BENCHMARKS:
- Mean Time to Remediation (MTTR): ${results.mttrSeconds} Seconds (Sub-Second Recovery)
- Incident Auto-Resolution Rate: ${results.incidentAutoResolvedPct}%
- False Alert Noise Suppression: ${results.falseAlertSuppressionPct}%
- Packet-Level Triage Latency: ${results.packetLevelTriageLatencyMs} ms (eBPF Kernel Socket)
- Production SLA Availability: ${results.slaUptimeAvailabilityPct}% Uptime
- Est. Annual Outage Loss Mitigated: ${currency === 'INR' ? '₹' : '$'}${results.annualDowntimeSavings.toLocaleString()}
- Status Classification: ${results.statusClassification}

REMEDIATION & GOVERNANCE SAFEGUARDS:
1. eBPF kernel hooks capture TCP retransmits and socket resets with less than 0.5% CPU penalty.
2. In-memory OpenTelemetry causal graph isolates root cause microservices in under 150ms.
3. Istio VirtualService weights execute graceful traffic draining prior to pod cycling, eliminating HTTP 504 errors.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Telemetry SVG points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { triagePath: '', slaPath: '', rawPoints: [] };

    const maxTriage = 300;
    const triagePoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.triageLatencyMs / maxTriage) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const maxSla = 100;
    const slaPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.slaAvailabilityPct / maxSla) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const triageD = triagePoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const slaD = slaPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { triagePath: triageD, slaPath: slaD, rawPoints: trace };
  }, [results.telemetryTrace]);

  const faqs = [
    {
      q: "How does agentic AIOps differ from traditional tools like Datadog, Dynatrace, or New Relic?",
      a: "Traditional APM tools are passive telemetry visualizers; they generate alerts and display dashboard graphs, but require human engineers to triage logs and manually execute remediation scripts. Agentic AIOps combines eBPF kernel tracing, causal graph traversal, and deterministic actuators to actively drain traffic, restart degraded pods, and resolve incidents in sub-second intervals without human intervention."
    },
    {
      q: "What safeguards prevent an autonomous agent from creating cascading outages or loops?",
      a: "Elesium's architecture employs strict deterministic finite state machines, rate-limiting circuit breakers, and canary-rollback gates. An agent is restricted by RBAC to safe, non-destructive actions (such as traffic rebalancing and pod cycling). If a remediation action fails to restore healthy SLA metrics within a predefined timeout, the agent freezes cluster state and escalates to senior human SREs with a pre-compiled diagnostic dossier."
    },
    {
      q: "Can the agentic SRE system deploy on-premise in sovereign private clouds in India?",
      a: "Yes. The entire autonomous agent fabric, diagnostic vector store, and eBPF collectors run within your dedicated private VPC (AWS ap-south-1, Azure South India) or bare-metal Kubernetes clusters (OpenStack/Nutanix) compliant with the DPDP Act 2023 and RBI cyber security mandates."
    },
    {
      q: "How quickly can an enterprise in Bangalore integrate agentic IT ops into existing stacks?",
      a: "Standard onboarding takes less than 5 business days. The platform integrates seamlessly with existing Prometheus, OpenTelemetry, Kubernetes, Helm, ArgoCD, and PagerDuty endpoints without requiring changes to underlying application source code."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-sky-500 selection:text-black">
      <Helmet>
        <title>Enterprise Agent AIOps &amp; Kubernetes Incident Remediation Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate autonomous SRE runbook automation, eBPF packet-level triage, Kubernetes pod self-healing, and sub-5-second MTTR across hybrid enterprise cloud clusters."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-aiops-incident-remediation-simulator" />
      </Helmet>

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="AIOps Incident Remediation &amp; Chaos Simulator"
        simulatedMetrics={[
          { label: 'MTTR Healing', value: `${results.mttrSeconds} s` },
          { label: 'Auto-Resolved', value: `${results.incidentAutoResolvedPct}%` },
          { label: 'SLA Availability', value: `${results.slaUptimeAvailabilityPct}%` },
          { label: 'Triage Latency', value: `${results.packetLevelTriageLatencyMs} ms` }
        ]}
      />

      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">Tool #41</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">Autonomous SRE &amp; Chaos Mesh</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Enterprise Agent AIOps Incident Remediation Simulator
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <Code className="w-3.5 h-3.5 text-slate-400" />
              <span>Embed</span>
            </button>
            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{hasCopiedMemo ? 'Memo Copied!' : 'Export Memo'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro Hero */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-sky-500/10 text-sky-300 border border-sky-500/20">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Sub-Second Kubernetes Pod Healing &amp; eBPF Kernel Tracing</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Simulate closed-loop autonomous SRE workflows under severe production chaos. Evaluate eBPF network socket observability, causal DAG fault isolation, Istio zero-loss traffic draining, and sub-5-second MTTR for enterprise clusters across Bangalore tech corridors and global cloud deployments.
          </p>
        </div>

        {/* Main Grid: Controls + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-semibold text-white tracking-wide">Chaos &amp; Remediation Controls</h2>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                    currency === 'INR' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                    currency === 'USD' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Cluster Size Nodes */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-medium">Kubernetes Cluster Size (Nodes)</label>
                  <span className="font-mono text-sky-400 font-bold">{clusterSizeNodes} Nodes</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={clusterSizeNodes}
                  onChange={(e) => setClusterSizeNodes(Number(e.target.value))}
                  aria-label="Kubernetes Cluster Size Nodes"
                  className="w-full accent-sky-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>10 Nodes (Startup)</span>
                  <span>250 Nodes (Enterprise)</span>
                  <span>1,000 Nodes (Hyper-Scale)</span>
                </div>
              </div>

              {/* Remediation Engine */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">AIOps Remediation Engine</label>
                <select
                  value={remediationEngine}
                  onChange={(e) => setRemediationEngine(e.target.value as any)}
                  aria-label="AIOps Remediation Engine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="agentic_ebpf_mesh">Autonomous eBPF Agent Mesh (Sub-5s Closed-Loop)</option>
                  <option value="rule_based_webhook">Rule-Based Webhook Trigger (3-5 Minutes)</option>
                  <option value="heuristic_autoscaler">Heuristic Autoscaler &amp; Liveness Probe (4-8 Minutes)</option>
                  <option value="manual_sre_warroom">Manual SRE On-Call War Room (30-60 Minutes)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Agentic eBPF attaches directly to the kernel, achieving causal fault isolation in under 150ms.
                </span>
              </div>

              {/* Chaos Fault Vector */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">Chaos Fault Injection Scenario</label>
                <select
                  value={chaosFaultVector}
                  onChange={(e) => setChaosFaultVector(e.target.value as any)}
                  aria-label="Chaos Fault Injection Scenario"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="memory_leak_oom">Progressive Memory Leak (Impending OOMKilled)</option>
                  <option value="thread_deadlock_cascade">Thread Deadlock &amp; Cascading Latency Spike</option>
                  <option value="pod_network_partition">Pod Network Partition &amp; TCP Socket Resets</option>
                  <option value="database_connection_starvation">Database Connection Pool Starvation</option>
                </select>
              </div>

              {/* Canary Strictness */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">Canary Safety &amp; Verification Strictness</label>
                <select
                  value={canaryVerificationStrictness}
                  onChange={(e) => setCanaryVerificationStrictness(e.target.value as any)}
                  aria-label="Canary Safety & Verification Strictness"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="zero_loss_canary">Zero-Loss Canary (Smooth Istio Traffic Draining)</option>
                  <option value="fast_failover_balanced">Balanced Failover (Active Concurrency Check)</option>
                  <option value="aggressive_pod_kill">Aggressive Restart (Fast Kill &amp; Readiness Re-test)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Telemetry & Analysis Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Classification Badge */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Remediation State Classification</span>
                <span className="text-lg font-bold font-mono tracking-tight text-white mt-0.5 block">
                  {results.statusClassification.replace(/_/g, ' ')}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                results.statusClassification === 'AUTONOMOUS_SELF_HEALING'
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                  : results.statusClassification === 'CONTAINED_DEGRADATION'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {results.statusClassification}
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Mean Time to Heal</span>
                <span className="text-2xl font-bold font-mono text-sky-400">{results.mttrSeconds} s</span>
                <span className="text-[11px] text-slate-500 block">Sub-second recovery</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Auto-Resolved Incidents</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{results.incidentAutoResolvedPct}%</span>
                <span className="text-[11px] text-slate-500 block">Zero human touch</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Alert Noise Cut</span>
                <span className="text-2xl font-bold font-mono text-amber-400">{results.falseAlertSuppressionPct}%</span>
                <span className="text-[11px] text-slate-500 block">Pager fatigue slashed</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">eBPF Triage Latency</span>
                <span className="text-2xl font-bold font-mono text-sky-300">{results.packetLevelTriageLatencyMs} ms</span>
                <span className="text-[11px] text-slate-500 block">Kernel socket trace</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">SLA Availability</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{results.slaUptimeAvailabilityPct}%</span>
                <span className="text-[11px] text-slate-500 block">Four-nines production</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Annual Outage Savings</span>
                <span className="text-2xl font-bold font-mono text-sky-300">
                  {currency === 'INR' ? `₹${(results.annualDowntimeSavings / 10000000).toFixed(1)} Cr` : `$${(results.annualDowntimeSavings / 1000000).toFixed(1)}M`}
                </span>
                <span className="text-[11px] text-slate-500 block">FinOps &amp; SLA penalty</span>
              </div>
            </div>

            {/* Oscilloscope Waveform Display */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <span className="font-semibold text-white">Live Chaos Telemetry Oscilloscope</span>
                </div>
                <div className="flex items-center space-x-4 text-[11px]">
                  <span className="flex items-center space-x-1.5 text-sky-400">
                    <span className="w-2.5 h-0.5 bg-sky-400 inline-block"></span>
                    <span>Triage Latency (ms)</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                    <span>SLA Uptime (%)</span>
                  </span>
                </div>
              </div>

              <div className="h-32 w-full bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 140" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  <line x1="0" y1="35" x2="500" y2="35" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeDasharray="4 4" />
                  <line x1="0" y1="105" x2="500" y2="105" stroke="#1e293b" strokeDasharray="4 4" />

                  {/* Render Data Traces */}
                  {svgData.triagePath && (
                    <path d={svgData.triagePath} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                  {svgData.slaPath && (
                    <path d={svgData.slaPath} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2" />
                  )}
                </svg>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                Simulated 20-cycle chaos injection across {clusterSizeNodes} Kubernetes production nodes.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-sky-400">
              <Cpu className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">eBPF Kernel Socket Tracing</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hooks non-intrusively into Linux kernel tracepoints, capturing microservice TCP socket resets, TLS handshake degradations, and thread context switching without application bytecode overhead.
            </p>
          </div>

          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Server className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">Istio Traffic Draining</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dynamically shifts ingress traffic weights away from degrading pods before triggering pod termination. Active HTTP connections finish cleanly, guaranteeing zero dropped checkout requests.
            </p>
          </div>

          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <Activity className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">Deterministic Runbook State Machines</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes finite-state runbooks with canary verification and automatic rollback. Every command issued to the Kubernetes Control Plane is cryptographically signed and logged for auditability.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">Frequently Asked Questions for SRE &amp; IT Directors</h2>
          <div className="divide-y divide-slate-800">
            {faqs.map((faq, idx) => (
              <div key={idx} className="py-3">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-medium text-slate-200 hover:text-white transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-sky-500/50">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Lead Application Form Drawer / Mandate Embed */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-xl font-bold tracking-tight text-white">
              Schedule an Autonomous SRE &amp; AIOps Architecture Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Deploy autonomous agentic incident remediation across your Kubernetes clusters. Eliminate on-call burnout and guarantee four-nines SLA reliability with sovereign private VPC fabrics.
            </p>
          </div>
          <ExpandableScreen>
            <ExpandableScreenTrigger className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition shadow-lg shadow-sky-950">
              <span>Apply for Architecture Audit</span>
              <ArrowRight className="w-4 h-4" />
            </ExpandableScreenTrigger>
            <ExpandableScreenContent>
              <div className="p-6 max-w-xl mx-auto">
                <MandateApplicationForm />
              </div>
            </ExpandableScreenContent>
          </ExpandableScreen>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white">Embed AIOps Remediation Simulator</h3>
              <button
                type="button"
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this responsive iframe snippet to embed the Autonomous SRE &amp; Chaos Simulator into your internal engineering runbooks, Confluence dashboards, or client documentation.
            </p>
            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-sky-400 focus:outline-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsEmbedOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={copyEmbedCode}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
