import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Mic,
  ExternalLink
} from 'lucide-react';
import {
  calculateVoiceAgentLatency,
  VoiceAgentInputs,
  SttEngineKey,
  LlmModelKey,
  TtsEngineKey,
  NetworkTierKey
} from '../calculator/voiceAgentLatencyModel';

export default function EmbedVoiceAgentLatencySimulator() {
  const [sttEngine, setSttEngine] = useState<SttEngineKey>('deepgram_nova2');
  const [llmModel, setLlmModel] = useState<LlmModelKey>('groq_llama3_8b');
  const [ttsEngine, setTtsEngine] = useState<TtsEngineKey>('cartesia_sonic');
  const [networkTier] = useState<NetworkTierKey>('cellular_5g');
  const [vadSilenceHangoverMs, setVadSilenceHangoverMs] = useState<number>(350);
  const [enableSemanticTurnTaking, setEnableSemanticTurnTaking] = useState<boolean>(true);
  const [enablePrefixCaching] = useState<boolean>(true);
  const [concurrentCallStreams] = useState<number>(50);
  const [averageCallMinutes] = useState<number>(4);
  const [monthlyCallVolume] = useState<number>(25000);

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
    <div className="min-h-screen bg-[#020617] text-slate-100 p-4 font-sans antialiased flex flex-col justify-between">
      <Helmet>
        <title>Real-Time Voice Agent Latency &amp; VAD Sandbox | Elesium</title>
        <meta
          name="description"
          content="Interactive widget calculating real-time voice agent turn-taking latency across WebRTC, VAD silence hangover, streaming Whisper ASR, LLM TTFT, and TTS audio."
        />
        <link rel="canonical" href="https://elesium.online/embed/voice-agent-latency-simulator" />
      </Helmet>

      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-purple-400" />
            <h1 className="text-sm font-bold text-white tracking-tight">
              Voice Agent Turn-Taking Latency Sandbox
            </h1>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
            results.conversationalGrade === 'ULTRA_FLUID'
              ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
              : results.conversationalGrade === 'NATURAL_ENTERPRISE'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          }`}>
            {results.totalTurnTakingLatencyMs} ms Total
          </span>
        </div>

        {/* Big Waterfall Stack Bar */}
        <div className="mb-4">
          <div className="h-5 w-full rounded-lg overflow-hidden flex bg-slate-950 p-0.5 border border-slate-800">
            {results.stages.map(stage => (
              <div
                key={stage.stageId}
                style={{ width: `${stage.percentageOfTotal}%` }}
                className={`${getStageColor(stage.stageId)} transition-all flex items-center justify-center text-[9px] font-bold text-white overflow-hidden`}
                title={`${stage.label}: ${stage.latencyMs}ms`}
              >
                {stage.percentageOfTotal > 14 && `${stage.latencyMs}ms`}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-1">
            <span>Speech End</span>
            <span>Target: &lt;500ms</span>
            <span>Audio Playback</span>
          </div>
        </div>

        {/* Engine Dropdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
          <div>
            <span className="text-[10px] font-mono text-slate-400 block mb-1">STT Engine</span>
            <select
              value={sttEngine}
              onChange={e => setSttEngine(e.target.value as SttEngineKey)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
            >
              <option value="deepgram_nova2">Deepgram Nova-2 (120ms)</option>
              <option value="whisper_vllm_local">Whisper Local vLLM (110ms)</option>
              <option value="whisper_cloud_api">Whisper API Batch (420ms)</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block mb-1">LLM Model</span>
            <select
              value={llmModel}
              onChange={e => setLlmModel(e.target.value as LlmModelKey)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
            >
              <option value="groq_llama3_8b">Groq Llama-3 8B (35ms)</option>
              <option value="vllm_local_h100">Local Llama-3 70B (25ms)</option>
              <option value="claude_35_sonnet">Claude 3.5 Sonnet (120ms)</option>
              <option value="gpt4o_realtime_ref">GPT-4o Realtime (180ms)</option>
            </select>
          </div>

          <div>
            <span className="text-[10px] font-mono text-slate-400 block mb-1">TTS Engine</span>
            <select
              value={ttsEngine}
              onChange={e => setTtsEngine(e.target.value as TtsEngineKey)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono text-slate-200"
            >
              <option value="cartesia_sonic">Cartesia Sonic (85ms)</option>
              <option value="elevenlabs_flash">ElevenLabs Flash (135ms)</option>
              <option value="openai_tts">OpenAI TTS-1 (390ms)</option>
              <option value="coqui_xtts_local">Coqui Local (175ms)</option>
            </select>
          </div>
        </div>

        {/* VAD & Semantic Switch */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 mb-3">
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">VAD Silence Wait:</span>
              <span className="text-amber-400 font-bold">{vadSilenceHangoverMs}ms</span>
            </div>
            <input
              type="range"
              min="150"
              max="600"
              step="25"
              value={vadSilenceHangoverMs}
              onChange={e => setVadSilenceHangoverMs(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1 bg-slate-800 rounded"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-mono mb-1">
              <span className="text-slate-400">Semantic Predictor:</span>
              <span className={enableSemanticTurnTaking ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                {enableSemanticTurnTaking ? 'ACTIVE (-58%)' : 'OFF'}
              </span>
            </div>
            <button
              onClick={() => setEnableSemanticTurnTaking(!enableSemanticTurnTaking)}
              className={`w-full py-1 rounded text-[10px] font-mono font-semibold transition-colors ${
                enableSemanticTurnTaking ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}
            >
              Toggle Semantic VAD
            </button>
          </div>
        </div>

        {/* Quantified Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Total Latency</div>
            <div className={`text-sm font-bold ${results.gradeColor}`}>
              {results.totalTurnTakingLatencyMs} ms
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Cost Per Call</div>
            <div className="text-sm font-bold text-white">
              ${results.estimatedCostPerCallUSD.toFixed(3)}
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Sovereign Savings</div>
            <div className="text-sm font-bold text-sky-400">
              {results.savingsPercentage}% Cut
            </div>
          </div>
          <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
            <div className="text-[9px] font-mono text-slate-400 uppercase">Interruption Cut</div>
            <div className="text-sm font-bold text-emerald-400">
              {results.interruptionFalsePositiveRatePct}% Risk
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory Backlink Watermark Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
        <span>Deterministic Voice Engineering</span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 font-semibold transition-colors"
        >
          <span>Elesium Enterprise AI Solutions</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
