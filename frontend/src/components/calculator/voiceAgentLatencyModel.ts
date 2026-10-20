/**
 * voiceAgentLatencyModel.ts
 * ============================================================================
 * Mathematical and Telemetry Engine for Enterprise Real-Time Voice Agent
 * Turn-Taking Latency & VAD Pipeline Simulator.
 * 
 * Quantifies and decomposes end-to-end human-to-agent conversational latency:
 * 1. Audio Transport & WebRTC packetization (Opus framing + Network RTT + Jitter)
 * 2. Voice Activity Detection (VAD) windowing & Silence Hangover threshold
 * 3. Streaming Speech-to-Text (ASR) chunk inference latency
 * 4. LLM Time-to-First-Token (TTFT) with Prefix Caching vs Cold Context
 * 5. Text-to-Speech (TTS) Time-to-First-Audio (TTFA) streaming synthesis
 * 6. Client playback jitter buffer & Telephony PSTN / WebRTC egress
 * ============================================================================
 */

export type SttEngineKey = 'deepgram_nova2' | 'whisper_vllm_local' | 'whisper_cloud_api' | 'assemblyai_streaming';

export type LlmModelKey = 'groq_llama3_8b' | 'vllm_local_h100' | 'claude_35_sonnet' | 'gpt4o_realtime_ref';

export type TtsEngineKey = 'cartesia_sonic' | 'elevenlabs_flash' | 'openai_tts' | 'coqui_xtts_local';

export type NetworkTierKey = 'enterprise_fiber' | 'broadband_lan' | 'cellular_5g' | 'cellular_4g_mobile';

export interface SttEngineSpec {
  id: SttEngineKey;
  name: string;
  provider: string;
  chunkWindowMs: number;
  inferenceLatencyMs: number;
  wordErrorRatePct: number;
  costPerHourUSD: number;
}

export interface LlmModelSpec {
  id: LlmModelKey;
  name: string;
  provider: string;
  baseTtftMs: number;
  prefixCachedTtftMs: number;
  tokensPerSecond: number;
  inputPerMTokUSD: number;
  outputPerMTokUSD: number;
}

export interface TtsEngineSpec {
  id: TtsEngineKey;
  name: string;
  provider: string;
  timeToFirstAudioMs: number;
  chunkDurationMs: number;
  naturalnessMos: number; // Mean Opinion Score (1.0 to 5.0)
  costPer1kCharsUSD: number;
}

export interface NetworkTierSpec {
  id: NetworkTierKey;
  name: string;
  oneWayLatencyMs: number;
  jitterMs: number;
  packetLossPct: number;
}

export const STT_CATALOG: Record<SttEngineKey, SttEngineSpec> = {
  deepgram_nova2: {
    id: 'deepgram_nova2',
    name: 'Deepgram Nova-2 (Streaming WebSocket)',
    provider: 'Deepgram Cloud',
    chunkWindowMs: 50,
    inferenceLatencyMs: 120,
    wordErrorRatePct: 6.8,
    costPerHourUSD: 0.26
  },
  whisper_vllm_local: {
    id: 'whisper_vllm_local',
    name: 'Whisper-Large-v3 Turbo (Local vLLM / TensorRT)',
    provider: 'Self-Hosted Sovereign H100',
    chunkWindowMs: 40,
    inferenceLatencyMs: 110,
    wordErrorRatePct: 7.1,
    costPerHourUSD: 0.08
  },
  whisper_cloud_api: {
    id: 'whisper_cloud_api',
    name: 'OpenAI Whisper API (Standard REST Batch)',
    provider: 'OpenAI Cloud',
    chunkWindowMs: 250,
    inferenceLatencyMs: 420,
    wordErrorRatePct: 7.5,
    costPerHourUSD: 0.36
  },
  assemblyai_streaming: {
    id: 'assemblyai_streaming',
    name: 'AssemblyAI Conformer-2 (Streaming)',
    provider: 'AssemblyAI Cloud',
    chunkWindowMs: 100,
    inferenceLatencyMs: 190,
    wordErrorRatePct: 7.9,
    costPerHourUSD: 0.39
  }
};

export const LLM_CATALOG: Record<LlmModelKey, LlmModelSpec> = {
  groq_llama3_8b: {
    id: 'groq_llama3_8b',
    name: 'Meta Llama-3.1-8B (Groq LPU Inference)',
    provider: 'Groq Cloud',
    baseTtftMs: 65,
    prefixCachedTtftMs: 35,
    tokensPerSecond: 850,
    inputPerMTokUSD: 0.05,
    outputPerMTokUSD: 0.08
  },
  vllm_local_h100: {
    id: 'vllm_local_h100',
    name: 'Llama-3.1-70B FP8 (Self-Hosted vLLM H100)',
    provider: 'Sovereign Private Cluster',
    baseTtftMs: 95,
    prefixCachedTtftMs: 25,
    tokensPerSecond: 160,
    inputPerMTokUSD: 0.02,
    outputPerMTokUSD: 0.04
  },
  claude_35_sonnet: {
    id: 'claude_35_sonnet',
    name: 'Claude 3.5 Sonnet (Direct API)',
    provider: 'Anthropic Cloud',
    baseTtftMs: 450,
    prefixCachedTtftMs: 120,
    tokensPerSecond: 75,
    inputPerMTokUSD: 3.0,
    outputPerMTokUSD: 15.0
  },
  gpt4o_realtime_ref: {
    id: 'gpt4o_realtime_ref',
    name: 'GPT-4o Realtime Audio API (All-in-One Closed)',
    provider: 'OpenAI Closed Hyperscaler',
    baseTtftMs: 380,
    prefixCachedTtftMs: 180,
    tokensPerSecond: 90,
    inputPerMTokUSD: 5.0,
    outputPerMTokUSD: 20.0
  }
};

export const TTS_CATALOG: Record<TtsEngineKey, TtsEngineSpec> = {
  cartesia_sonic: {
    id: 'cartesia_sonic',
    name: 'Cartesia Sonic (State Space Model)',
    provider: 'Cartesia Cloud',
    timeToFirstAudioMs: 85,
    chunkDurationMs: 60,
    naturalnessMos: 4.6,
    costPer1kCharsUSD: 0.038
  },
  elevenlabs_flash: {
    id: 'elevenlabs_flash',
    name: 'ElevenLabs Flash v2.5 (Streaming)',
    provider: 'ElevenLabs Cloud',
    timeToFirstAudioMs: 135,
    chunkDurationMs: 120,
    naturalnessMos: 4.85,
    costPer1kCharsUSD: 0.09
  },
  openai_tts: {
    id: 'openai_tts',
    name: 'OpenAI TTS-1 (Streaming REST)',
    provider: 'OpenAI Cloud',
    timeToFirstAudioMs: 390,
    chunkDurationMs: 200,
    naturalnessMos: 4.4,
    costPer1kCharsUSD: 0.015
  },
  coqui_xtts_local: {
    id: 'coqui_xtts_local',
    name: 'Coqui XTTS-v2 (Self-Hosted GPU)',
    provider: 'Sovereign On-Prem GPU',
    timeToFirstAudioMs: 175,
    chunkDurationMs: 100,
    naturalnessMos: 4.35,
    costPer1kCharsUSD: 0.008
  }
};

export const NETWORK_CATALOG: Record<NetworkTierKey, NetworkTierSpec> = {
  enterprise_fiber: {
    id: 'enterprise_fiber',
    name: 'Enterprise Dedicated Direct Connect / Fiber',
    oneWayLatencyMs: 12,
    jitterMs: 3,
    packetLossPct: 0.01
  },
  broadband_lan: {
    id: 'broadband_lan',
    name: 'Commercial Broadband / Standard Wi-Fi',
    oneWayLatencyMs: 35,
    jitterMs: 12,
    packetLossPct: 0.2
  },
  cellular_5g: {
    id: 'cellular_5g',
    name: 'Carrier 5G Ultra-Wideband Telephony',
    oneWayLatencyMs: 45,
    jitterMs: 18,
    packetLossPct: 0.5
  },
  cellular_4g_mobile: {
    id: 'cellular_4g_mobile',
    name: 'Cellular 4G LTE Mobile In-Vehicle Call',
    oneWayLatencyMs: 85,
    jitterMs: 38,
    packetLossPct: 1.8
  }
};

export interface VoiceAgentInputs {
  sttEngine: SttEngineKey;
  llmModel: LlmModelKey;
  ttsEngine: TtsEngineKey;
  networkTier: NetworkTierKey;
  vadSilenceHangoverMs: number; // 100ms to 800ms
  enableSemanticTurnTaking: boolean; // Reduces silence hangover via predictive end-of-turn classifier
  enablePrefixCaching: boolean; // Fast prompt cache on LLM
  concurrentCallStreams: number; // 1 to 500 concurrent callers
  averageCallMinutes: number; // 2 to 15 minutes
  monthlyCallVolume: number; // 1,000 to 250,000 calls
}

export interface PipelineStageBreakdown {
  stageId: 'ingress_transport' | 'vad_hangover' | 'asr_transcription' | 'llm_ttft' | 'tts_synthesis' | 'egress_buffer';
  label: string;
  latencyMs: number;
  percentageOfTotal: number;
  description: string;
  isBottleneck: boolean;
}

export interface VoiceAgentOutputs {
  totalTurnTakingLatencyMs: number;
  conversationalGrade: 'ULTRA_FLUID' | 'NATURAL_ENTERPRISE' | 'NOTICEABLE_LAG' | 'COLLISION_ZONE';
  gradeColor: string;
  gradeBadge: string;
  stages: PipelineStageBreakdown[];
  audioStreamingJitterBufferMs: number;
  interruptionFalsePositiveRatePct: number;
  estimatedCostPerCallUSD: number;
  monthlyTotalOpexUSD: number;
  sovereignOnPremMonthlyOpexUSD: number;
  monthlySavingsUSD: number;
  savingsPercentage: number;
  architecturalVerdict: string;
}

/**
 * Calculates deterministic voice turn-taking latency and cost metrics.
 */
export function calculateVoiceAgentLatency(inputs: VoiceAgentInputs): VoiceAgentOutputs {
  const stt = STT_CATALOG[inputs.sttEngine];
  const llm = LLM_CATALOG[inputs.llmModel];
  const tts = TTS_CATALOG[inputs.ttsEngine];
  const net = NETWORK_CATALOG[inputs.networkTier];

  // 1. Ingress Audio Transport (Client -> Media Gateway)
  const ingressTransportMs = Math.round(net.oneWayLatencyMs + (net.jitterMs * 0.75) + 20); // 20ms Opus frame buffer

  // 2. VAD Silence Hangover
  // With semantic turn-taking, early predictive punctuation cuts required silence by 58%
  let effectiveVadMs = inputs.vadSilenceHangoverMs;
  if (inputs.enableSemanticTurnTaking) {
    effectiveVadMs = Math.max(110, Math.round(inputs.vadSilenceHangoverMs * 0.42));
  }

  // 3. Streaming ASR / STT Latency
  const sttLatencyMs = Math.round(stt.inferenceLatencyMs + (stt.chunkWindowMs * 0.6));

  // 4. LLM Time to First Token (TTFT)
  const llmLatencyMs = inputs.enablePrefixCaching ? llm.prefixCachedTtftMs : llm.baseTtftMs;

  // 5. TTS Time to First Audio Chunk (TTFA)
  const ttsLatencyMs = tts.timeToFirstAudioMs;

  // 6. Egress Transport & Client Jitter Playback Buffer
  const egressBufferMs = Math.round(net.oneWayLatencyMs + (net.jitterMs * 1.25) + 30); // 30ms client audio buffer

  // Cumulative Turn-Taking Latency
  const totalTurnTakingLatencyMs = ingressTransportMs + effectiveVadMs + sttLatencyMs + llmLatencyMs + ttsLatencyMs + egressBufferMs;

  // Identify bottleneck stage
  const rawStages: { id: PipelineStageBreakdown['stageId']; label: string; latency: number; desc: string }[] = [
    { id: 'ingress_transport', label: '1. WebRTC / Opus Ingress Transport', latency: ingressTransportMs, desc: `${net.name} frame packetization and jitter.` },
    { id: 'vad_hangover', label: '2. VAD Silence & Turn-Taking Lock', latency: effectiveVadMs, desc: inputs.enableSemanticTurnTaking ? 'Semantic end-of-thought classifier applied.' : 'Raw silence hangover wait time.' },
    { id: 'asr_transcription', label: '3. Streaming ASR (Speech-to-Text)', latency: sttLatencyMs, desc: `${stt.name} chunk tokenization.` },
    { id: 'llm_ttft', label: '4. LLM Time-To-First-Token (TTFT)', latency: llmLatencyMs, desc: inputs.enablePrefixCaching ? `${llm.name} (Prefix Caching Active).` : `${llm.name} (Cold Context Evaluation).` },
    { id: 'tts_synthesis', label: '5. Neural TTS Time-To-First-Audio', latency: ttsLatencyMs, desc: `${tts.name} streaming chunk synthesis.` },
    { id: 'egress_buffer', label: '6. Audio Jitter Playback Buffer', latency: egressBufferMs, desc: 'Client-side jitter underrun protection buffer.' }
  ];

  const maxLatency = Math.max(...rawStages.map(s => s.latency));

  const stages: PipelineStageBreakdown[] = rawStages.map(s => ({
    stageId: s.id,
    label: s.label,
    latencyMs: s.latency,
    percentageOfTotal: Math.round((s.latency / totalTurnTakingLatencyMs) * 100),
    description: s.desc,
    isBottleneck: s.latency === maxLatency
  }));

  // Conversational Grade Assessment
  let conversationalGrade: VoiceAgentOutputs['conversationalGrade'] = 'NATURAL_ENTERPRISE';
  let gradeColor = 'text-emerald-400';
  let gradeBadge = 'Enterprise Call Center Grade (<700ms)';

  if (totalTurnTakingLatencyMs < 450) {
    conversationalGrade = 'ULTRA_FLUID';
    gradeColor = 'text-sky-400';
    gradeBadge = 'Ultra-Fluid Human Parity (<450ms)';
  } else if (totalTurnTakingLatencyMs <= 750) {
    conversationalGrade = 'NATURAL_ENTERPRISE';
    gradeColor = 'text-emerald-400';
    gradeBadge = 'Enterprise Production Grade (450–750ms)';
  } else if (totalTurnTakingLatencyMs <= 1100) {
    conversationalGrade = 'NOTICEABLE_LAG';
    gradeColor = 'text-amber-400';
    gradeBadge = 'Noticeable Hesitation (750–1,100ms)';
  } else {
    conversationalGrade = 'COLLISION_ZONE';
    gradeColor = 'text-rose-400';
    gradeBadge = 'Unusable Conversational Collision (>1,100ms)';
  }

  // Interruption False Positive Rate
  let falsePositiveInterruption = 1.2;
  if (effectiveVadMs < 200 && !inputs.enableSemanticTurnTaking) {
    falsePositiveInterruption = 18.5; // Cuts off user mid-sentence
  } else if (effectiveVadMs < 250) {
    falsePositiveInterruption = 8.2;
  } else if (inputs.enableSemanticTurnTaking) {
    falsePositiveInterruption = 0.8;
  }

  // Financial Modeling: Cloud Stack vs Sovereign Cluster
  // Average call: 12 user turns per call, ~150 words/min = 900 chars/min
  const wordsPerCall = inputs.averageCallMinutes * 150;
  const charsPerCall = wordsPerCall * 5.5;
  const turnsPerCall = Math.max(4, Math.round(inputs.averageCallMinutes * 3.5));
  const promptTokensPerCall = turnsPerCall * 800; // Multi-turn history accumulation
  const completionTokensPerCall = turnsPerCall * 65;

  // Cloud API Costs
  const callHours = inputs.averageCallMinutes / 60;
  const sttCostPerCall = callHours * stt.costPerHourUSD;
  const llmCostPerCall = ((promptTokensPerCall / 1_000_000) * llm.inputPerMTokUSD) + ((completionTokensPerCall / 1_000_000) * llm.outputPerMTokUSD);
  const ttsCostPerCall = (charsPerCall / 1_000) * tts.costPer1kCharsUSD;
  const telephonyPerCall = callHours * 0.24; // Standard carrier trunk SIP cost ($0.004/min)

  const estimatedCostPerCallUSD = Math.round((sttCostPerCall + llmCostPerCall + ttsCostPerCall + telephonyPerCall) * 1000) / 1000;
  const monthlyTotalOpexUSD = Math.round(estimatedCostPerCallUSD * inputs.monthlyCallVolume);

  // Sovereign Private Cluster Costs (Local H100 vLLM + Whisper + Coqui/Cartesia local)
  // Dedicated 2x H100 SXM5 node = $5,800/mo flat, handles up to 180 concurrent streams
  const nodesNeeded = Math.max(1, Math.ceil(inputs.concurrentCallStreams / 120));
  const sovereignOnPremMonthlyOpexUSD = Math.round((nodesNeeded * 3200) + (inputs.monthlyCallVolume * telephonyPerCall));
  const monthlySavingsUSD = Math.max(0, monthlyTotalOpexUSD - sovereignOnPremMonthlyOpexUSD);
  const savingsPercentage = monthlyTotalOpexUSD > 0 ? Math.round((monthlySavingsUSD / monthlyTotalOpexUSD) * 100) : 0;

  let verdict = 'Architecture delivers sub-600ms responsive dialogue suitable for enterprise BFSI and logistics voice agents.';
  if (totalTurnTakingLatencyMs > 1000) {
    verdict = 'CRITICAL LATENCY BOTTLENECK: Turn-taking delay exceeds 1,000ms. High user churn and frequent conversational collisions expected. Enable Semantic VAD and migrate to local streaming Whisper/LLM inference.';
  } else if (totalTurnTakingLatencyMs < 450) {
    verdict = 'OPTIMAL STREAMING ARCHITECTURE: Sub-450ms turnaround achieves seamless conversational parity with human call center operators.';
  }

  return {
    totalTurnTakingLatencyMs,
    conversationalGrade,
    gradeColor,
    gradeBadge,
    stages,
    audioStreamingJitterBufferMs: egressBufferMs,
    interruptionFalsePositiveRatePct: falsePositiveInterruption,
    estimatedCostPerCallUSD,
    monthlyTotalOpexUSD,
    sovereignOnPremMonthlyOpexUSD,
    monthlySavingsUSD,
    savingsPercentage,
    architecturalVerdict: verdict
  };
}
