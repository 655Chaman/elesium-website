import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateSlidingWindow,
  SlidingWindowInputs,
  ModelArchitecture,
  HardwareCluster
} from '../calculator/agentSlidingWindowModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentSlidingWindowSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [streamingSequenceLength, setStreamingSequenceLength] = useState<number>(524288);
  const [slidingWindowSize, setSlidingWindowSize] = useState<number>(4096);
  const [numAttentionSinks, setNumAttentionSinks] = useState<number>(4);
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: SlidingWindowInputs = useMemo(() => ({
    modelArchitecture,
    streamingSequenceLength,
    slidingWindowSize,
    numAttentionSinks,
    hardwareCluster,
    currency: 'USD'
  }), [
    modelArchitecture,
    streamingSequenceLength,
    slidingWindowSize,
    numAttentionSinks,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateSlidingWindow(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-[24px] border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Sliding-Window Attention & Ring KV Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-sliding-window-attention-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Sliding-Window & Ring KV Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Constant-VRAM Bounds · Sub-5ms Streaming Inference
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          STREAMING ATTENTION
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div>
          <label className="text-neutral-400 block mb-1">FOUNDATION MODEL</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value="llama_3_70b">Llama-3 70B</option>
            <option value="deepseek_r1_671b">DeepSeek-R1 671B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
            <option value="mistral_large_123b">Mistral Large 123B</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">WINDOW SIZE</label>
          <select
            value={slidingWindowSize}
            onChange={(e) => setSlidingWindowSize(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value={1024}>1,024 Tokens</option>
            <option value={2048}>2,048 Tokens</option>
            <option value={4096}>4,096 Tokens</option>
            <option value={8192}>8,192 Tokens</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>STREAM HORIZON:</span>
            <span className="text-white font-bold">{streamingSequenceLength.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="8192"
            max="2097152"
            step="8192"
            value={streamingSequenceLength}
            onChange={(e) => setStreamingSequenceLength(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <span className="text-neutral-400 block mb-1">ATTENTION SINKS (ANCHORS)</span>
          <div className="grid grid-cols-4 gap-1">
            {[2, 4, 8, 16].map((s) => (
              <button
                key={s}
                onClick={() => setNumAttentionSinks(s)}
                className={`active:scale-[0.97] py-1 rounded text-[11px] font-mono border ${
                  numAttentionSinks === s
                    ? 'border-white/30 bg-white/10 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {s} tokens
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-[18px] border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">ACTIVE TOKENS</div>
          <div className="text-base font-bold text-white">
            {results.activeKvTokens.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500">Fixed Ring Buffer</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">BOUNDED VRAM</div>
          <div className="text-base font-bold text-white">
            {results.vramBoundedGb} GB
          </div>
          <div className="text-[9px] text-neutral-500">-{results.memoryReductionPercent}% VRAM Saved</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">DECODE LATENCY</div>
          <div className="text-base font-bold text-white">
            {results.perTokenDecodeLatencyMs} ms
          </div>
          <div className="text-[9px] text-neutral-500">vs {results.baselineUnboundedLatencyMs}ms unbounded</div>
        </div>
      </div>

      {/* Footer Branding & Link */}
      <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-[11px]">
        <span className="text-neutral-400">
          SLA: <span className="text-white font-bold">{results.slaStatus.replace(/_/g, ' ')}</span>
        </span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-200 hover:text-white inline-flex items-center gap-1 font-medium transition-all duration-300"
        >
          Elesium Sovereign Solutions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
