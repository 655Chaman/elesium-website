import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Mic,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Radio,
  Server,
  DollarSign
} from 'lucide-react';
import {
  calculateVoiceAgentLatency,
  VoiceAgentInputs,
  SttEngineKey,
  LlmModelKey,
  TtsEngineKey,
  NetworkTierKey,
  STT_CATALOG,
  LLM_CATALOG,
  TTS_CATALOG,
  NETWORK_CATALOG
} from '../calculator/voiceAgentLatencyModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseVoiceAgentLatencySimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [sttEngine, setSttEngine] = useState<SttEngineKey>('deepgram_nova2');
  const [llmModel, setLlmModel] = useState<LlmModelKey>('groq_llama3_8b');
  const [ttsEngine, setTtsEngine] = useState<TtsEngineKey>('cartesia_sonic');
  const [networkTier, setNetworkTier] = useState<NetworkTierKey>('cellular_5g');
  const [vadSilenceHangoverMs, setVadSilenceHangoverMs] = useState<number>(350);
  const [enableSemanticTurnTaking, setEnableSemanticTurnTaking] = useState<boolean>(true);
  const [enablePrefixCaching, setEnablePrefixCaching] = useState<boolean>(true);
  const [concurrentCallStreams, setConcurrentCallStreams] = useState<number>(50);
  const [averageCallMinutes, setAverageCallMinutes] = useState<number>(4);
  const [monthlyCallVolume, setMonthlyCallVolume] = useState<number>(25000);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: VoiceAgentInputs = useMemo(() => ({
    sttEngine,
    llmModel,
    ttsEngine,
    networkTier,
    vadSilenceHangoverMs,
    enableSemanticTurnTaking,
    enablePrefixCaching,
    concurrentCallStreams,
    averageCallMinutes,
    monthlyCallVolume
  }), [
    sttEngine,
    llmModel,
    ttsEngine,
    networkTier,
    vadSilenceHangoverMs,
    enableSemanticTurnTaking,
    enablePrefixCaching,
    concurrentCallStreams,
    averageCallMinutes,
    monthlyCallVolume
  ]);

  const results = useMemo(() => {
    return calculateVoiceAgentLatency(inputs);
  }, [inputs]);

  const embedCodeSnippet = `<iframe src="https://elesium.online/embed/voice-agent-latency-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;background:#020617;"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:underline;">Elesium Sovereign AI Systems</a></div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCodeSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 3000);
  };

  const copyArchitecturalMemo = () => {
    const memo = `
================================================================================
ELESIUM ARCHITECTURAL AUDIT: ENTERPRISE VOICE AGENT LATENCY & VAD DECOMPOSITION
STT: ${STT_CATALOG[sttEngine].name} | LLM: ${LLM_CATALOG[llmModel].name}
TTS: ${TTS_CATALOG[ttsEngine].name} | Network: ${NETWORK_CATALOG[networkTier].name}
================================================================================

1. END-TO-END TURN-TAKING LATENCY:
   • Total Turnaround Time: ${results.totalTurnTakingLatencyMs} ms (${results.gradeBadge})
   • VAD Silence Hangover: ${inputs.vadSilenceHangoverMs} ms (Effective: ${results.stages.find(s => s.stageId === 'vad_hangover')?.latencyMs} ms with Semantic Turn-Taking)
   • ASR Transcription: ${results.stages.find(s => s.stageId === 'asr_transcription')?.latencyMs} ms
   • LLM Time-To-First-Token (TTFT): ${results.stages.find(s => s.stageId === 'llm_ttft')?.latencyMs} ms (${enablePrefixCaching ? 'Prefix Cache Active' : 'Cold Prompt'})
   • Neural TTS Time-To-First-Audio: ${results.stages.find(s => s.stageId === 'tts_synthesis')?.latencyMs} ms
   • Transport & Playback Buffer: ${results.audioStreamingJitterBufferMs} ms
   • False Positive Interruption Rate: ${results.interruptionFalsePositiveRatePct}%

2. MONTHLY OPEX & SOVEREIGN FINOPS:
   • Estimated Cost Per Call: $${results.estimatedCostPerCallUSD.toFixed(3)} USD (${averageCallMinutes} min call)
   • Cloud API Monthly Opex: $${results.monthlyTotalOpexUSD.toLocaleString()} USD (${monthlyCallVolume.toLocaleString()} calls)
   • Sovereign Private Cluster Opex: $${results.sovereignOnPremMonthlyOpexUSD.toLocaleString()} USD
   • Net Monthly Savings: $${results.monthlySavingsUSD.toLocaleString()} USD (${results.savingsPercentage}% Cut)

Architectural Verdict: ${results.architecturalVerdict}
================================================================================
Generated via Elesium Sovereign AI Engineering (https://elesium.online)
    `.trim();

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 3000);
  };

  const getStageColor = (stageId: string) => {
    switch (stageId) {
      case 'ingress_transport':
        return 'bg-blue-500';
      case 'vad_hangover':
        return 'bg-amber-500';
      case 'asr_transcription':
        return 'bg-emerald-500';
      case 'llm_ttft':
        return 'bg-purple-500';
      case 'tts_synthesis':
        return 'bg-rose-500';
      case 'egress_buffer':
        return 'bg-sky-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 pt-24 pb-20 selection:bg-purple-500/30 selection:text-purple-200">
      <Helmet>
        <title>Enterprise Real-Time Voice Agent VAD & Turn-Taking Latency Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark real-time voice agent latency across WebRTC transport, Silero VAD silence hangover, streaming ASR, LLM TTFT, and neural TTS synthesis."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-voice-agent-latency-simulator" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Enterprise Real-Time Voice Agent VAD & Turn-Taking Latency Simulator",
            "url": "https://elesium.online/tools/enterprise-voice-agent-latency-simulator",
            "description": "Interactive telemetry sandbox calculating conversational turn-taking latency across WebRTC audio transport, VAD silence thresholds, streaming Whisper ASR, LLM TTFT, and neural TTS streaming audio.",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": "All",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "End-to-End Turn-Taking Waterfall Latency Decomposition",
              "Silero VAD Silence Hangover & Semantic Punctuation Classifier",
              "Streaming ASR Engine Benchmarking (Deepgram Nova-2 vs Local Whisper)",
              "LLM Time-To-First-Token (TTFT) with Prefix Caching",
              "Neural TTS Time-To-First-Audio (TTFA) Synthesis Analysis",
              "Sovereign Dedicated GPU Cluster vs Cloud API FinOps Modeling"
            ]
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
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
                "name": "Solutions",
                "item": "https://elesium.online/solutions"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Voice Agent Latency Simulator",
                "item": "https://elesium.online/tools/enterprise-voice-agent-latency-simulator"
              }
            ]
          })}
        </script>
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs font-mono text-slate-400 mb-8">
          <Link to="/" className="hover:text-slate-200 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/solutions" className="hover:text-slate-200 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-purple-400">Voice Agent Latency Simulator</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-mono uppercase tracking-wider mb-4">
            <Mic className="w-3.5 h-3.5" />
            Conversational Telephony & Audio Telemetry Lab
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
            Enterprise Real-Time Voice Agent <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-sky-300 to-emerald-400">VAD & Turn-Taking Latency Simulator</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-4xl leading-relaxed">
            Human conversations break down when turn-taking latency exceeds 700ms. Deconstruct the entire audio pipeline from Opus packetization and Silero VAD silence hangover to streaming speech-to-text, LLM time-to-first-token (TTFT), and neural voice synthesis.
          </p>
        </div>

        {/* Quick Presets Bar */}
        <div className="mb-8">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            Standard Architecture Configurations
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: 'Ultra-Low Latency Sovereign Stack',
                desc: 'Local Whisper Turbo + Groq/vLLM + Cartesia Sonic (<400ms)',
                action: () => {
                  setSttEngine('deepgram_nova2');
                  setLlmModel('groq_llama3_8b');
                  setTtsEngine('cartesia_sonic');
                  setEnableSemanticTurnTaking(true);
                  setEnablePrefixCaching(true);
                  setVadSilenceHangoverMs(250);
                }
              },
              {
                title: 'Private VPC Sovereign On-Prem',
                desc: '100% Air-gapped Whisper H100 + Llama-3 70B + Coqui XTTS',
                action: () => {
                  setSttEngine('whisper_vllm_local');
                  setLlmModel('vllm_local_h100');
                  setTtsEngine('coqui_xtts_local');
                  setEnableSemanticTurnTaking(true);
                  setEnablePrefixCaching(true);
                  setVadSilenceHangoverMs(300);
                }
              },
              {
                title: 'Hyperscaler Multi-Vendor Cloud',
                desc: 'Deepgram Nova-2 + Claude 3.5 Sonnet + ElevenLabs Flash',
                action: () => {
                  setSttEngine('deepgram_nova2');
                  setLlmModel('claude_35_sonnet');
                  setTtsEngine('elevenlabs_flash');
                  setEnableSemanticTurnTaking(true);
                  setEnablePrefixCaching(true);
                  setVadSilenceHangoverMs(400);
                }
              },
              {
                title: 'Legacy REST Batch Pipeline',
                desc: 'OpenAI Whisper Batch + Cold Prompt GPT-4o + OpenAI TTS (>1,200ms)',
                action: () => {
                  setSttEngine('whisper_cloud_api');
                  setLlmModel('gpt4o_realtime_ref');
                  setTtsEngine('openai_tts');
                  setEnableSemanticTurnTaking(false);
                  setEnablePrefixCaching(false);
                  setVadSilenceHangoverMs(600);
                }
              }
            ].map((preset, idx) => (
              <button
                key={idx}
                onClick={preset.action}
                className="p-4 rounded-full text-left border border-slate-800 bg-slate-900/60 hover:border-purple-500/50 hover:bg-purple-950/20 transition-all"
              >
                <div className="text-xs font-semibold text-white mb-1">{preset.title}</div>
                <div className="text-[11px] text-slate-400 leading-normal">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Controls (Left) & Latency Waterfall (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-sm font-mono uppercase tracking-wider text-slate-300 mb-6 flex items-center justify-between">
                <span>Audio Pipeline Stages</span>
                <Radio className="w-4 h-4 text-purple-400" />
              </h3>

              {/* STT Engine */}
              <div className="mb-5">
                <span className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>1. Speech-to-Text (ASR) Engine</span>
                  <span className="text-emerald-400 font-bold">{STT_CATALOG[sttEngine].inferenceLatencyMs}ms Latency</span>
                </span>
                <select
                  value={sttEngine}
                  onChange={e => setSttEngine(e.target.value as SttEngineKey)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                >
                  {Object.values(STT_CATALOG).map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} (~{spec.inferenceLatencyMs}ms)
                    </option>
                  ))}
                </select>
              </div>

              {/* LLM Model */}
              <div className="mb-5">
                <span className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>2. Core LLM Reasoning Model</span>
                  <span className="text-purple-400 font-bold">{enablePrefixCaching ? LLM_CATALOG[llmModel].prefixCachedTtftMs : LLM_CATALOG[llmModel].baseTtftMs}ms TTFT</span>
                </span>
                <select
                  value={llmModel}
                  onChange={e => setLlmModel(e.target.value as LlmModelKey)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                >
                  {Object.values(LLM_CATALOG).map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} (TTFT: {enablePrefixCaching ? spec.prefixCachedTtftMs : spec.baseTtftMs}ms)
                    </option>
                  ))}
                </select>
              </div>

              {/* Prefix Caching Toggle */}
              <div className="mb-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-200">LLM Prompt Prefix Caching</div>
                  <div className="text-[11px] text-slate-400">Radix tree cache for system prompt &amp; historical turns</div>
                </div>
                <button
                  onClick={() => setEnablePrefixCaching(!enablePrefixCaching)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enablePrefixCaching ? 'bg-purple-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enablePrefixCaching ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* TTS Engine */}
              <div className="mb-5">
                <span className="text-xs font-mono text-slate-300 block mb-1.5 flex items-center justify-between">
                  <span>3. Neural Text-to-Speech (TTS)</span>
                  <span className="text-rose-400 font-bold">{TTS_CATALOG[ttsEngine].timeToFirstAudioMs}ms TTFA</span>
                </span>
                <select
                  value={ttsEngine}
                  onChange={e => setTtsEngine(e.target.value as TtsEngineKey)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                >
                  {Object.values(TTS_CATALOG).map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} (~{spec.timeToFirstAudioMs}ms TTFA)
                    </option>
                  ))}
                </select>
              </div>

              {/* Network Tier */}
              <div className="mb-5">
                <span className="text-xs font-mono text-slate-300 block mb-1.5">4. Network &amp; Telephony Ingress Transport</span>
                <select
                  value={networkTier}
                  onChange={e => setNetworkTier(e.target.value as NetworkTierKey)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-200"
                >
                  {Object.values(NETWORK_CATALOG).map(spec => (
                    <option key={spec.id} value={spec.id}>
                      {spec.name} (~{spec.oneWayLatencyMs}ms RTT/2)
                    </option>
                  ))}
                </select>
              </div>

              {/* VAD Silence Hangover Slider */}
              <div className="mb-5">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-slate-300">VAD Silence Hangover Threshold</span>
                  <span className="text-amber-400 font-bold">{vadSilenceHangoverMs} ms</span>
                </div>
                <input
                  type="range"
                  min="150"
                  max="700"
                  step="25"
                  value={vadSilenceHangoverMs}
                  onChange={e => setVadSilenceHangoverMs(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                  <span>150ms (Aggressive)</span>
                  <span>350ms (Natural)</span>
                  <span>700ms (High Safety)</span>
                </div>
              </div>

              {/* Semantic Turn Taking Toggle */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-200">Semantic End-of-Thought Classifier</div>
                  <div className="text-[11px] text-slate-400">Reduces required silence wait by 58% via predictive punctuation</div>
                </div>
                <button
                  onClick={() => setEnableSemanticTurnTaking(!enableSemanticTurnTaking)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    enableSemanticTurnTaking ? 'bg-emerald-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      enableSemanticTurnTaking ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Volume & Telephony Sizing Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Telephony Capacity &amp; FinOps Sizing
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Concurrent Call Channels:</span>
                    <span className="text-white font-bold">{concurrentCallStreams} Channels</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="300"
                    step="5"
                    value={concurrentCallStreams}
                    onChange={e => setConcurrentCallStreams(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Monthly Call Volume:</span>
                    <span className="text-white font-bold">{monthlyCallVolume.toLocaleString()} Calls</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={monthlyCallVolume}
                    onChange={e => setMonthlyCallVolume(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-400">Average Call Duration:</span>
                    <span className="text-white font-bold">{averageCallMinutes} Minutes</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={averageCallMinutes}
                    onChange={e => setAverageCallMinutes(parseInt(e.target.value))}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Latency Waterfall & Analytics */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Scorecard Banner */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">
                    Cumulative Turn-Taking Latency
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className={`text-5xl font-extrabold tracking-tight ${results.gradeColor}`}>
                      {results.totalTurnTakingLatencyMs}
                    </span>
                    <span className="text-slate-400 font-mono text-lg">milliseconds</span>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-mono font-semibold border ${
                    results.conversationalGrade === 'ULTRA_FLUID'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                      : results.conversationalGrade === 'NATURAL_ENTERPRISE'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : results.conversationalGrade === 'NOTICEABLE_LAG'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {results.gradeBadge}
                  </span>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    Interruption Cutoff Risk: {results.interruptionFalsePositiveRatePct}%
                  </div>
                </div>
              </div>

              {/* Horizontal Waterfall Bar */}
              <div className="mb-4">
                <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
                  {results.stages.map(stage => (
                    <div
                      key={stage.stageId}
                      style={{ width: `${stage.percentageOfTotal}%` }}
                      className={`${getStageColor(stage.stageId)} transition-all relative group flex items-center justify-center text-[10px] font-bold text-white overflow-hidden`}
                      title={`${stage.label}: ${stage.latencyMs}ms (${stage.percentageOfTotal}%)`}
                    >
                      {stage.percentageOfTotal > 12 && `${stage.latencyMs}ms`}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>User Stops Speaking</span>
                  <span>Human Turnaround Benchmark (250ms)</span>
                  <span>Agent Audio Plays</span>
                </div>
              </div>

              {/* Stage-by-Stage Breakdown Table */}
              <div className="space-y-2 font-mono text-xs">
                {results.stages.map(stage => (
                  <div
                    key={stage.stageId}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-4 ${
                      stage.isBottleneck
                        ? 'bg-rose-950/20 border-rose-500/40'
                        : 'bg-slate-950/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-2.5 h-2.5 rounded-full ${getStageColor(stage.stageId)}`} />
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          <span>{stage.label}</span>
                          {stage.isBottleneck && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-500/20 text-rose-400 border border-rose-500/30 uppercase">
                              Bottleneck
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans">{stage.description}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-white text-sm">{stage.latencyMs} ms</div>
                      <div className="text-[10px] text-slate-500">{stage.percentageOfTotal}% of total</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Opex Comparison Card */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Monthly Voice Infrastructure Cost Analysis
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Cost Per Call</div>
                  <div className="text-lg font-bold text-white mt-1">
                    ${results.estimatedCostPerCallUSD.toFixed(3)}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Cloud Multivendor</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Monthly Cloud Opex</div>
                  <div className="text-lg font-bold text-rose-400 mt-1">
                    ${results.monthlyTotalOpexUSD.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{monthlyCallVolume.toLocaleString()} Calls</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Sovereign Cluster</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">
                    ${results.sovereignOnPremMonthlyOpexUSD.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-500/80 font-mono">Dedicated Hardware</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Net Monthly Savings</div>
                  <div className="text-lg font-bold text-sky-400 mt-1">
                    ${results.monthlySavingsUSD.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-sky-400 font-mono">-{results.savingsPercentage}% Cut</div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                <span className="text-purple-400 font-bold">Engineering Assessment:</span> {results.architecturalVerdict}
              </div>
            </div>
          </div>
        </div>

        {/* Action Row & Embed Drawer */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/30 to-slate-900 border border-slate-800 mb-16">
          <div>
            <h4 className="text-lg font-bold text-white mb-1">
              Embed This Voice Latency Simulator
            </h4>
            <p className="text-xs text-slate-400">
              Integrate this interactive voice turnaround telemetry sandbox into your engineering documentation or developer blog.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors flex items-center gap-2"
            >
              <Code className="w-3.5 h-3.5 text-purple-400" />
              Embed Sandbox
            </button>
            <button
              onClick={copyArchitecturalMemo}
              className="px-4 py-2.5 rounded-full border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors flex items-center gap-2"
            >
              {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {hasCopiedMemo ? 'Memo Copied!' : 'Copy Audit Dossier'}
            </button>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 hover:from-purple-600 hover:to-sky-600 text-xs font-mono font-bold text-white transition-all shadow-md shadow-purple-950 flex items-center gap-2">
                <span>Schedule Voice Architecture Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <div className="p-6">
                  <MandateApplicationForm />
                </div>
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>

        {/* Technical Deep Dive & FAQs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-16">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            Real-Time Voice Agent Architectural Principles
          </h3>
          {[
            {
              q: 'Why is 500ms the critical golden threshold for conversational voice agents?',
              a: 'In natural human face-to-face conversation, normal conversational turn-taking happens within 200ms to 250ms. Telephony systems introduce standard network jitter, making anything below 500ms feel smooth, responsive, and completely natural. Once latency climbs past 750ms, human callers perceive hesitation and begin to repeat themselves or speak over the agent, causing catastrophic conversational collisions and mutual speech cutoffs.'
            },
            {
              q: 'How does Semantic Turn-Taking eliminate awkward silence without false interruptions?',
              a: 'Traditional Voice Activity Detection (VAD) relies solely on acoustic energy and raw silence duration (e.g. waiting 500ms of dead air). If a user pauses mid-sentence to think, raw VAD interrupts them prematurely. A semantic end-of-thought classifier evaluates streaming phonemes and linguistic tokens to predict whether an utterance is syntactically complete. If incomplete, it extends the silence budget; if complete (e.g. terminating in an imperative verb or question mark), it fires an instant turn transition in 120ms.'
            },
            {
              q: 'What is the latency difference between WebSocket streaming audio and REST batch requests?',
              a: 'REST batch requests require recording the full audio utterance, encoding it to a static WAV/MP3 file, uploading it via HTTP POST, waiting for processing, and receiving a batch text payload. This introduces a minimum 600ms to 1,500ms penalty before transcription even finishes. WebSocket streaming transmits 20ms audio frames over a persistent full-duplex socket, transcribing speech in real-time as words are spoken, yielding partial transcripts in sub-100ms.'
            },
            {
              q: 'How does migrating to self-hosted Whisper & vLLM on sovereign GPUs drop per-call opex by 70%+?',
              a: 'Hyperscalers charge per-minute and per-token rates (e.g., $0.006/min for Whisper + $0.03/min for TTS + token pricing for GPT-4o), costing $0.15 to $0.40 per 5-minute call. A dedicated enterprise sovereign GPU cluster (such as dual H100 SXM5 instances) carries a fixed amortized monthly hardware cost. At high call volumes (25,000+ calls/mo), self-hosted inference handles hundreds of concurrent channels for under $0.04 per call, reducing operating expenditures by over 70%.'
            }
          ].map((item, idx) => (
            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-white transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-purple-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-400" />
              Embed Voice Agent Latency Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this HTML snippet into your technical documentation, blog, or dashboard:
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-purple-300 break-all select-all mb-4">
              {embedCodeSnippet}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={copyEmbedCode}
                className="px-4 py-2 rounded-full bg-purple-500 hover:bg-purple-600 text-xs font-mono font-bold text-white flex items-center gap-2 transition-colors"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {hasCopiedEmbed ? 'Snippet Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
