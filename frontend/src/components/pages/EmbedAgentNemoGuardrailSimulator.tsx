import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateNemoGuardrailTelemetry,
  NemoGuardrailInputs
} from '../calculator/agentNemoGuardrailModel';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentNemoGuardrailSimulator() {
  const [guardrailEngine, setGuardrailEngine] = useState<'nemo_colang_2' | 'llama_guard_3_8b' | 'lakera_v2_regex_hybrid' | 'custom_embeddings_svm'>('nemo_colang_2');
  const [concurrencyThroughputRps, setConcurrencyThroughputRps] = useState<number>(500);
  const [jailbreakAttackVector, setJailbreakAttackVector] = useState<'multi_turn_crescendo' | 'base64_indirect_injection' | 'system_override_jailbreak' | 'tool_call_exfiltration'>('multi_turn_crescendo');
  const [strictnessPolicy, setStrictnessPolicy] = useState<'zero_tolerance_dpdp' | 'enterprise_balanced' | 'low_latency_advisory'>('zero_tolerance_dpdp');
  const [vernacularEvaluationEnabled, setVernacularEvaluationEnabled] = useState<boolean>(true);

  const inputs: NemoGuardrailInputs = useMemo(() => ({
    guardrailEngine,
    concurrencyThroughputRps,
    jailbreakAttackVector,
    strictnessPolicy,
    vernacularEvaluationEnabled,
    currency: 'INR'
  }), [
    guardrailEngine,
    concurrencyThroughputRps,
    jailbreakAttackVector,
    strictnessPolicy,
    vernacularEvaluationEnabled
  ]);

  const results = useMemo(() => {
    return simulateNemoGuardrailTelemetry(inputs);
  }, [inputs]);

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', mitPath: '', rawPoints: [] };

    const maxLat = 40;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.interceptLatencyMs / maxLat) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const maxMit = 100;
    const mitPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.mitigationRatePct / maxMit) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const mitD = mitPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, mitPath: mitD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>LLM Security Guardrails &amp; NeMo Colang Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-nemo-guardrails-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">LLM Security &amp; NeMo Guardrails Engine</h1>
              <p className="text-[10px] text-slate-400">Colang 2.0 &amp; Sub-15ms Adversarial Prompt Interceptor</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-emerald-500/10 border-emerald-500/30 text-emerald-400">
            {results.statusClassification}
          </span>
        </div>

        {/* Sliders & Controls */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Guardrail Engine</label>
            <select
              value={guardrailEngine}
              onChange={(e) => setGuardrailEngine(e.target.value as any)}
              aria-label="Guardrail Engine"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="nemo_colang_2">NeMo Colang 2.0 (Sub-10ms)</option>
              <option value="llama_guard_3_8b">Llama-Guard-3-8B AWQ</option>
              <option value="lakera_v2_regex_hybrid">Lakera Hybrid Vector Scan</option>
              <option value="custom_embeddings_svm">Custom Embeddings SVM</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">
              Throughput: <span className="text-emerald-400 font-mono">{concurrencyThroughputRps} RPS</span>
            </label>
            <input
              type="range"
              min="50"
              max="5000"
              step="50"
              value={concurrencyThroughputRps}
              onChange={(e) => setConcurrencyThroughputRps(Number(e.target.value))}
              aria-label="Concurrency Throughput RPS"
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Attack Vector</label>
            <select
              value={jailbreakAttackVector}
              onChange={(e) => setJailbreakAttackVector(e.target.value as any)}
              aria-label="Attack Vector"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="multi_turn_crescendo">Multi-Turn Crescendo Jailbreak</option>
              <option value="base64_indirect_injection">Base64 Indirect Injection</option>
              <option value="system_override_jailbreak">Direct System Prompt Override</option>
              <option value="tool_call_exfiltration">Tool Parameter Exfiltration</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Strictness Policy</label>
            <select
              value={strictnessPolicy}
              onChange={(e) => setStrictnessPolicy(e.target.value as any)}
              aria-label="Strictness Policy"
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-300 text-[11px]"
            >
              <option value="zero_tolerance_dpdp">Zero-Tolerance (DPDP Act 2023)</option>
              <option value="enterprise_balanced">Enterprise Balanced</option>
              <option value="low_latency_advisory">Low Latency Advisory</option>
            </select>
          </div>
        </div>

        {/* Vernacular Evaluation Toggle */}
        <div className="flex items-center justify-between bg-slate-900/40 border border-slate-800 px-3 py-2 rounded-lg text-xs">
          <span className="text-slate-300 text-[11px]">Bilingual Indic Dialect Threat Evaluator (Hindi/Tamil)</span>
          <button
            type="button"
            onClick={() => setVernacularEvaluationEnabled(!vernacularEvaluationEnabled)}
            className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-medium transition ${
              vernacularEvaluationEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {vernacularEvaluationEnabled ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Intercept Latency</span>
            <span className="text-base font-mono font-bold text-emerald-400">{results.interceptLatencyMs} ms</span>
            <span className="text-[9px] text-slate-500 block">P99 on-device</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Jailbreak Mitigation</span>
            <span className="text-base font-mono font-bold text-cyan-400">{results.jailbreakDetectionRatePct}%</span>
            <span className="text-[9px] text-slate-500 block">Adversarial catch</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-slate-400 block">DPDP Confidence</span>
            <span className="text-base font-mono font-bold text-amber-400">{results.dpdpComplianceConfidencePct}%</span>
            <span className="text-[9px] text-slate-500 block">PII masked: {results.piiMaskingLatencyMicroseconds}µs</span>
          </div>
        </div>

        {/* Real-time Oscilloscope Telemetry Trace */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-mono">Live Guardrail Telemetry Oscilloscope</span>
            <div className="flex items-center space-x-3 text-[10px]">
              <span className="flex items-center space-x-1 text-emerald-400">
                <span className="w-2 h-0.5 bg-emerald-400 inline-block"></span>
                <span>Latency (ms)</span>
              </span>
              <span className="flex items-center space-x-1 text-cyan-400">
                <span className="w-2 h-0.5 bg-cyan-400 inline-block"></span>
                <span>Mitigation (%)</span>
              </span>
            </div>
          </div>

          <div className="h-24 w-full bg-slate-950 rounded-lg border border-slate-800/80 relative overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 340 90" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="22" x2="340" y2="22" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="45" x2="340" y2="45" stroke="#1e293b" strokeDasharray="3 3" />
              <line x1="0" y1="67" x2="340" y2="67" stroke="#1e293b" strokeDasharray="3 3" />

              {/* Data paths */}
              {svgData.latPath && (
                <path d={svgData.latPath} fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              )}
              {svgData.mitPath && (
                <path d={svgData.mitPath} fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="2 1" />
              )}
            </svg>
          </div>
        </div>

        {/* Breach Protection Summary */}
        <div className="bg-emerald-950/20 border border-emerald-900/40 p-2.5 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-emerald-400 block font-semibold">Statutory Risk Protection</span>
            <span className="text-slate-300 text-[11px]">Est. Annual Breach Liability Mitigated:</span>
          </div>
          <span className="text-sm font-mono font-bold text-emerald-300">
            ₹{(results.annualBreachLossMitigated / 10000000).toFixed(2)} Cr
          </span>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-1 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition"
          >
            <span>Simulated via Elesium Sovereign AI Security</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
