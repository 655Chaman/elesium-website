import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Lock,
  Database,
  Zap
} from 'lucide-react';
import {
  simulateNemoGuardrailTelemetry,
  NemoGuardrailInputs
} from '../calculator/agentNemoGuardrailModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentNemoGuardrailSimulator() {
  // Inputs State
  const [guardrailEngine, setGuardrailEngine] = useState<'nemo_colang_2' | 'llama_guard_3_8b' | 'lakera_v2_regex_hybrid' | 'custom_embeddings_svm'>('nemo_colang_2');
  const [concurrencyThroughputRps, setConcurrencyThroughputRps] = useState<number>(500);
  const [jailbreakAttackVector, setJailbreakAttackVector] = useState<'multi_turn_crescendo' | 'base64_indirect_injection' | 'system_override_jailbreak' | 'tool_call_exfiltration'>('multi_turn_crescendo');
  const [strictnessPolicy, setStrictnessPolicy] = useState<'zero_tolerance_dpdp' | 'enterprise_balanced' | 'low_latency_advisory'>('zero_tolerance_dpdp');
  const [vernacularEvaluationEnabled, setVernacularEvaluationEnabled] = useState<boolean>(true);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: NemoGuardrailInputs = useMemo(() => ({
    guardrailEngine,
    concurrencyThroughputRps,
    jailbreakAttackVector,
    strictnessPolicy,
    vernacularEvaluationEnabled,
    currency
  }), [
    guardrailEngine,
    concurrencyThroughputRps,
    jailbreakAttackVector,
    strictnessPolicy,
    vernacularEvaluationEnabled,
    currency
  ]);

  const results = useMemo(() => {
    return simulateNemoGuardrailTelemetry(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-nemo-guardrails-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Sovereign AI Security</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT LLM SECURITY GUARDRAILS AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-nemo-guardrails-simulator)

GUARDRAIL ARCHITECTURE & CONFIGURATION:
- Guardrail Engine: ${guardrailEngine.replace(/_/g, ' ').toUpperCase()}
- Throughput Load: ${concurrencyThroughputRps.toLocaleString()} RPS
- Threat Attack Vector: ${jailbreakAttackVector.replace(/_/g, ' ').toUpperCase()}
- Strictness Policy: ${strictnessPolicy.replace(/_/g, ' ').toUpperCase()}
- Indic Vernacular NLU: ${vernacularEvaluationEnabled ? 'ENABLED (Hindi/Tamil/Telugu)' : 'DISABLED'}

TELEMETRY & COMPLIANCE BENCHMARKS:
- Intercept Latency: ${results.interceptLatencyMs} ms / Request (P99 on-device)
- Jailbreak Mitigation Rate: ${results.jailbreakDetectionRatePct}%
- False Positive Rejection: ${results.falsePositiveRejectionPct}%
- PII Masking Latency: ${results.piiMaskingLatencyMicroseconds} µs
- DPDP Act 2023 Compliance Confidence: ${results.dpdpComplianceConfidencePct}%
- Est. Annual Breach Loss Mitigated: ${currency === 'INR' ? '₹' : '$'}${results.annualBreachLossMitigated.toLocaleString()}
- Status Classification: ${results.statusClassification}

SECURITY ASSURANCE PROTOCOLS:
1. NVIDIA NeMo Colang 2.0 flows decouple security constraints from model stochasticity, executing deterministic state machine interceptions.
2. Hardware-accelerated Verhoeff checksum and PAN regex mask Indian PII with ephemeral session hashes prior to tokenization.
3. Air-gapped private VPC deployment guarantees sensitive enterprise data never touches third-party public cloud moderation endpoints.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Telemetry SVG points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', mitPath: '', rawPoints: [] };

    const maxLat = 40;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.interceptLatencyMs / maxLat) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const maxMit = 100;
    const mitPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.mitigationRatePct / maxMit) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const mitD = mitPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, mitPath: mitD, rawPoints: trace };
  }, [results.telemetryTrace]);

  const faqs = [
    {
      q: "How does sovereign NeMo Guardrails compare to OpenAI or AWS moderation APIs?",
      a: "Public cloud moderation APIs require transmitting raw user prompts across the public internet to third-party multitenant infrastructure, introducing 400ms to 900ms of external latency and violating DPDP Act 2023 data fiduciary isolation rules. Sovereign NeMo Guardrails run entirely on-premise or within your dedicated private VPC on NVIDIA accelerators, evaluating Colang 2.0 flows and local 4-bit classifiers in under 12 milliseconds with zero telemetry leakage."
    },
    {
      q: "How does the guardrail engine defend against indirect prompt injection in RAG pipelines?",
      a: "Elesium's architecture treats all retrieved vector documents and API payloads as untrusted external data. Before retrieved passages are injected into the reasoning prompt, a dedicated Context Attestation Node evaluates the passages against adversarial classification vectors, stripping executable directives, system-level delimiter overrides, and steganographic encodings."
    },
    {
      q: "Can the guardrails handle vernacular Indian languages and Romanized Hinglish?",
      a: "Yes. The pipeline incorporates bilingual Indic lexical embeddings trained specifically on Hindi, Hinglish, Tamil, Telugu, and Marathi conversational nuances. It detects adversarial intent even when disguised in phonetic vernacular colloquialisms or transliterated slang."
    },
    {
      q: "What regulatory reporting does the guardrail framework generate for RBI and DPDP audits?",
      a: "Every intercepted transaction produces an immutable SHA-256 Merkle audit record containing the anonymized prompt hash, the triggering Colang flow rule, classification confidence scores, and PII masking confirmation. These records export directly to enterprise SIEM platforms (Splunk, Microsoft Sentinel) or compliance archives."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>Enterprise LLM Security Guardrails &amp; NeMo Colang Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate sub-15ms prompt injection interception, Colang 2.0 guardrail flows, Indian statutory PII redaction (DPDP Act 2023), and adversarial jailbreak defense across sovereign private VPCs."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-nemo-guardrails-simulator" />
      </Helmet>

      {/* Exit Intent Modal for CRO */}
      <ExitIntentMemoModal
        toolName="LLM Security Guardrails &amp; NeMo Colang Simulator"
        simulatedMetrics={[
          { label: 'Intercept Latency', value: `${results.interceptLatencyMs} ms` },
          { label: 'Jailbreak Mitigation', value: `${results.jailbreakDetectionRatePct}%` },
          { label: 'DPDP Confidence', value: `${results.dpdpComplianceConfidencePct}%` },
          { label: 'PII Masking', value: `${results.piiMaskingLatencyMicroseconds} µs` }
        ]}
      />

      {/* Header Banner */}
      <div className="border-b border-slate-800 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Tool #40</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs font-mono text-slate-400">Colang 2.0 &amp; Semantic Defense</span>
              </div>
              <h1 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Enterprise Agent LLM Security Guardrails Simulator
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
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition"
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>DPDP Act 2023 &amp; Sub-15ms Adversarial Prompt Interception</span>
          </div>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Configure enterprise LLM guardrails across foundational reasoning flows. Simulate deterministic Colang 2.0 flow interception, local quantized classification latencies, multi-turn Crescendo jailbreak mitigation, and hardware-accelerated Indian PII masking for sovereign enterprise private VPCs.
          </p>
        </div>

        {/* Main Grid: Controls + Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Panel (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <h2 className="text-sm font-semibold text-white tracking-wide">Guardrail Parameters</h2>
              </div>
              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrency('INR')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                    currency === 'INR' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-2.5 py-0.5 rounded text-[11px] font-medium transition ${
                    currency === 'USD' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            <div className="space-y-5 text-xs">
              {/* Guardrail Engine */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">Guardrail Architecture Engine</label>
                <select
                  value={guardrailEngine}
                  onChange={(e) => setGuardrailEngine(e.target.value as any)}
                  aria-label="Guardrail Architecture Engine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="nemo_colang_2">NeMo Colang 2.0 (Sub-10ms Sovereign State Machine)</option>
                  <option value="llama_guard_3_8b">Llama-Guard-3-8B (4-bit AWQ Local Quantized)</option>
                  <option value="lakera_v2_regex_hybrid">Lakera Hybrid Pattern &amp; Vector Scanner</option>
                  <option value="custom_embeddings_svm">Custom Dense Embeddings + One-Class SVM</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Colang 2.0 provides deterministic flow boundaries without additional LLM latency.
                </span>
              </div>

              {/* Concurrency Throughput RPS */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-slate-300 font-medium">Throughput Load (Requests / Sec)</label>
                  <span className="font-mono text-emerald-400 font-bold">{concurrencyThroughputRps.toLocaleString()} RPS</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={concurrencyThroughputRps}
                  onChange={(e) => setConcurrencyThroughputRps(Number(e.target.value))}
                  aria-label="Throughput Load Requests Per Second"
                  className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>50 RPS (B2B SaaS)</span>
                  <span>1,000 RPS (Enterprise Banking)</span>
                  <span>5,000 RPS (Hyper-Scale Core)</span>
                </div>
              </div>

              {/* Jailbreak Attack Vector */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">Adversarial Threat Attack Vector</label>
                <select
                  value={jailbreakAttackVector}
                  onChange={(e) => setJailbreakAttackVector(e.target.value as any)}
                  aria-label="Adversarial Threat Attack Vector"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="multi_turn_crescendo">Multi-Turn Crescendo Jailbreak (Gradual Topic Drift)</option>
                  <option value="base64_indirect_injection">Base64 Indirect Injection (Document / RAG Poisoning)</option>
                  <option value="system_override_jailbreak">Direct System Prompt Override (Prefix Hijack)</option>
                  <option value="tool_call_exfiltration">Tool Parameter Data Exfiltration (SQL / Webhook)</option>
                </select>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Crescendo attacks attempt to evade single-turn keyword filters across multi-turn sessions.
                </span>
              </div>

              {/* Strictness Policy */}
              <div>
                <label className="text-slate-300 font-medium block mb-1.5">Regulatory Strictness Policy</label>
                <select
                  value={strictnessPolicy}
                  onChange={(e) => setStrictnessPolicy(e.target.value as any)}
                  aria-label="Regulatory Strictness Policy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="zero_tolerance_dpdp">Zero-Tolerance Statutory (DPDP Act 2023 &amp; RBI)</option>
                  <option value="enterprise_balanced">Enterprise Balanced (Standard Corporate Production)</option>
                  <option value="low_latency_advisory">Low Latency Advisory (Soft Warning Flags)</option>
                </select>
              </div>

              {/* Vernacular Evaluation Toggle */}
              <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-slate-200 text-xs font-medium block">Indic Vernacular NLU Guard</span>
                  <span className="text-[10px] text-slate-400">Red-teaming Hindi, Hinglish, Tamil &amp; Telugu ciphers</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVernacularEvaluationEnabled(!vernacularEvaluationEnabled)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition ${
                    vernacularEvaluationEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {vernacularEvaluationEnabled ? 'ACTIVE' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Telemetry & Analysis Panel (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status Classification Badge */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider block">Security Posture Classification</span>
                <span className="text-lg font-bold font-mono tracking-tight text-white mt-0.5 block">
                  {results.statusClassification.replace(/_/g, ' ')}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                results.statusClassification === 'AIR_GAPPED_NEUTRALIZED'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : results.statusClassification === 'HARDENED_GUARDRAILS'
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
              }`}>
                {results.statusClassification}
              </span>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Intercept Latency</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{results.interceptLatencyMs} ms</span>
                <span className="text-[11px] text-slate-500 block">P99 on local GPU</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Jailbreak Mitigation</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">{results.jailbreakDetectionRatePct}%</span>
                <span className="text-[11px] text-slate-500 block">Adversarial catch</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">False Positive Rate</span>
                <span className="text-2xl font-bold font-mono text-slate-300">{results.falsePositiveRejectionPct}%</span>
                <span className="text-[11px] text-slate-500 block">Benign rejections</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">PII Redaction Latency</span>
                <span className="text-2xl font-bold font-mono text-amber-400">{results.piiMaskingLatencyMicroseconds} µs</span>
                <span className="text-[11px] text-slate-500 block">Aadhaar &amp; PAN hash</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">DPDP Act Compliance</span>
                <span className="text-2xl font-bold font-mono text-emerald-400">{results.dpdpComplianceConfidencePct}%</span>
                <span className="text-[11px] text-slate-500 block">Fiduciary isolation</span>
              </div>

              <div className="bg-slate-900/60 rounded-xl border border-slate-800 p-4 space-y-1">
                <span className="text-xs text-slate-400 block">Annual Risk Mitigated</span>
                <span className="text-2xl font-bold font-mono text-emerald-300">
                  {currency === 'INR' ? `₹${(results.annualBreachLossMitigated / 10000000).toFixed(1)} Cr` : `$${(results.annualBreachLossMitigated / 1000000).toFixed(1)}M`}
                </span>
                <span className="text-[11px] text-slate-500 block">Regulatory &amp; breach</span>
              </div>
            </div>

            {/* Oscilloscope Waveform Display */}
            <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Live Guardrail Telemetry Oscilloscope</span>
                </div>
                <div className="flex items-center space-x-4 text-[11px]">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                    <span>Intercept Latency (ms)</span>
                  </span>
                  <span className="flex items-center space-x-1.5 text-cyan-400">
                    <span className="w-2.5 h-0.5 bg-cyan-400 inline-block"></span>
                    <span>Mitigation Rate (%)</span>
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
                  {svgData.latPath && (
                    <path d={svgData.latPath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />
                  )}
                  {svgData.mitPath && (
                    <path d={svgData.mitPath} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="3 2" />
                  )}
                </svg>
              </div>
              <p className="text-[11px] text-slate-500 text-right">
                Simulated 20-window adversarial telemetry burst under {concurrencyThroughputRps} RPS load.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Architecture Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Cpu className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">NeMo Colang 2.0 Determinism</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decouples safety boundaries from the stochastic foundation model. Flow state machines enforce strict execution paths, intercepting prompt-breaking instructions and synthesizer exploits with zero external cloud dependencies.
            </p>
          </div>

          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Database className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">Indian Statutory PII Redaction</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verhoeff checksum algorithms sanitize 12-digit UIDAI Aadhaar numbers, PAN cards, GSTINs, and phone numbers in under 850 microseconds, inserting ephemeral cryptographic hashes compliant with Section 8(5) of the DPDP Act 2023.
            </p>
          </div>

          <div className="bg-slate-900/40 rounded-xl border border-slate-800 p-5 space-y-2.5">
            <div className="flex items-center space-x-2 text-amber-400">
              <Lock className="w-4 h-4" />
              <h3 className="text-sm font-semibold text-white">Air-Gapped Private VPC</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Runs strictly on dedicated enterprise hardware or air-gapped sovereign VPC clusters. Enterprise queries, proprietary financial ledgers, and trade secrets are never transmitted to third-party public cloud moderation endpoints.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-6 space-y-4">
          <h2 className="text-base font-bold text-white tracking-tight">Frequently Asked Questions for Enterprise CISOs</h2>
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
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-emerald-500/50">
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
              Schedule a Sovereign LLM Security &amp; Guardrail Architecture Audit
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Deploy NeMo Colang 2.0 guardrails across your enterprise agent fleets. Eliminate prompt injection vulnerabilities and lock DPDP Act 2023 compliance on dedicated sovereign private VPC infrastructure.
            </p>
          </div>
          <ExpandableScreen>
            <ExpandableScreenTrigger className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-950">
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
              <h3 className="text-sm font-bold text-white">Embed Guardrail Simulator</h3>
              <button
                type="button"
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Copy this responsive iframe snippet to embed the LLM Guardrails &amp; NeMo Colang simulator widget into your internal enterprise wiki, CISO documentation, or client portals.
            </p>
            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-emerald-400 focus:outline-none"
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
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
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
