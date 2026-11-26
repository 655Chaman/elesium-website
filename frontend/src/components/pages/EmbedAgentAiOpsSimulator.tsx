import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateAiOpsTelemetry,
  AiOpsInputs
} from '../calculator/agentAiOpsModel';
import { Activity, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentAiOpsSimulator() {
  const [clusterSizeNodes, setClusterSizeNodes] = useState<number>(120);
  const [chaosFaultVector, setChaosFaultVector] = useState<'pod_network_partition' | 'memory_leak_oom' | 'database_connection_starvation' | 'thread_deadlock_cascade'>('memory_leak_oom');
  const [remediationEngine, setRemediationEngine] = useState<'agentic_ebpf_mesh' | 'rule_based_webhook' | 'manual_sre_warroom' | 'heuristic_autoscaler'>('agentic_ebpf_mesh');
  const [canaryVerificationStrictness, setCanaryVerificationStrictness] = useState<'zero_loss_canary' | 'fast_failover_balanced' | 'aggressive_pod_kill'>('zero_loss_canary');

  const inputs: AiOpsInputs = useMemo(() => ({
    clusterSizeNodes,
    chaosFaultVector,
    remediationEngine,
    canaryVerificationStrictness,
    currency: 'INR'
  }), [
    clusterSizeNodes,
    chaosFaultVector,
    remediationEngine,
    canaryVerificationStrictness
  ]);

  const results = useMemo(() => {
    return simulateAiOpsTelemetry(inputs);
  }, [inputs]);

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { triagePath: '', slaPath: '', rawPoints: [] };

    const maxTriage = 300;
    const triagePoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.triageLatencyMs / maxTriage) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const maxSla = 100;
    const slaPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.slaAvailabilityPct / maxSla) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const triageD = triagePoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const slaD = slaPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { triagePath: triageD, slaPath: slaD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>AIOps Incident Remediation &amp; Chaos Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-aiops-incident-remediation-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-white/[0.04] border border-white/15 text-neutral-200">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Autonomous SRE &amp; AIOps Remediation Engine</h1>
              <p className="text-[10px] text-neutral-400">eBPF Telemetry &amp; Sub-Second Pod Self-Healing</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-lg font-mono font-medium border bg-white/[0.04] border-white/20 text-neutral-200">
            {results.statusClassification}
          </span>
        </div>

        {/* Sliders & Controls */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-900/60 p-3 rounded-xl border border-neutral-800">
          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">
              Cluster Size: <span className="text-neutral-200 font-mono">{clusterSizeNodes} Nodes</span>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={clusterSizeNodes}
              onChange={(e) => setClusterSizeNodes(Number(e.target.value))}
              aria-label="Cluster Size Nodes"
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">Remediation Engine</label>
            <select
              value={remediationEngine}
              onChange={(e) => setRemediationEngine(e.target.value as any)}
              aria-label="Remediation Engine"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-[11px]"
            >
              <option value="agentic_ebpf_mesh">Autonomous eBPF Agent Fabric (Sub-5s)</option>
              <option value="rule_based_webhook">Rule-Based Webhook Script (3 Min)</option>
              <option value="heuristic_autoscaler">Heuristic Pod Autoscaler (4 Min)</option>
              <option value="manual_sre_warroom">Manual SRE On-Call War Room (45 Min)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">Chaos Fault Vector</label>
            <select
              value={chaosFaultVector}
              onChange={(e) => setChaosFaultVector(e.target.value as any)}
              aria-label="Chaos Fault Vector"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-[11px]"
            >
              <option value="memory_leak_oom">Progressive Memory Leak (OOMKilled)</option>
              <option value="thread_deadlock_cascade">Thread Deadlock &amp; Cascading Latency</option>
              <option value="pod_network_partition">Network Partition &amp; Socket Timeout</option>
              <option value="database_connection_starvation">DB Pool Exhaustion</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">Canary Strictness</label>
            <select
              value={canaryVerificationStrictness}
              onChange={(e) => setCanaryVerificationStrictness(e.target.value as any)}
              aria-label="Canary Strictness"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-[11px]"
            >
              <option value="zero_loss_canary">Zero-Loss Canary (Istio Traffic Drain)</option>
              <option value="fast_failover_balanced">Balanced Failover</option>
              <option value="aggressive_pod_kill">Aggressive Restart (Fast Kill)</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">Mean Time To Heal</span>
            <span className="text-base font-mono font-bold text-white">{results.mttrSeconds} s</span>
            <span className="text-[9px] text-neutral-500 block">Sub-second recovery</span>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">Auto-Resolved</span>
            <span className="text-base font-mono font-bold text-white">{results.incidentAutoResolvedPct}%</span>
            <span className="text-[9px] text-neutral-500 block">Zero human touch</span>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">Noise Suppressed</span>
            <span className="text-base font-mono font-bold text-amber-400">{results.falseAlertSuppressionPct}%</span>
            <span className="text-[9px] text-neutral-500 block">Alert fatigue cut</span>
          </div>
        </div>

        {/* Oscilloscope Waveform Display */}
        <div className="bg-neutral-900/90 border border-neutral-800 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 font-mono">Real-Time Chaos Remediation Oscilloscope</span>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center space-x-1 text-neutral-200">
                <span className="w-2 h-0.5 bg-white/80 inline-block"></span>
                <span>Triage Latency (ms)</span>
              </span>
              <span className="flex items-center space-x-1 text-neutral-200">
                <span className="w-2 h-0.5 bg-white/80 inline-block"></span>
                <span>SLA Availability (%)</span>
              </span>
            </div>
          </div>

          <div className="h-24 w-full bg-neutral-950 rounded-lg border border-neutral-800/80 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 340 90" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="22" x2="340" y2="22" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="45" x2="340" y2="45" stroke="#262626" strokeDasharray="3 3" />
              <line x1="0" y1="67" x2="340" y2="67" stroke="#262626" strokeDasharray="3 3" />

              {/* Data paths */}
              {svgData.triagePath && (
                <path d={svgData.triagePath} fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
              )}
              {svgData.slaPath && (
                <path d={svgData.slaPath} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="2 1" />
              )}
            </svg>
          </div>
        </div>

        {/* Downtime Savings Banner */}
        <div className="bg-white/[0.05] border border-white/15 p-2.5 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-white block font-semibold">Autonomous FinOps &amp; SLA Guard</span>
            <span className="text-neutral-300 text-[11px]">Est. Annual Outage Loss Mitigated:</span>
          </div>
          <span className="text-sm font-mono font-bold text-white">
            ₹{(results.annualDowntimeSavings / 10000000).toFixed(2)} Cr
          </span>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-1 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-neutral-200 hover:text-white transition"
          >
            <span>Simulated via Elesium Sovereign AIOps</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
