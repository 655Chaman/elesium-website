import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateFlashDecoding,
  FlashDecodingInputs,
  ModelArchitecture,
  ParallelismStrategy,
  HardwareCluster
} from '../calculator/agentFlashDecodingModel';
import { Zap, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentFlashDecodingSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [contextLengthTokens, setContextLengthTokens] = useState<number>(65536);
  const [kvChunkSize, setKvChunkSize] = useState<number>(256);
  const [numGpus, setNumGpus] = useState<number>(2);
  const [parallelismStrategy, setParallelismStrategy] = useState<ParallelismStrategy>('sequence_parallel_ring');
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: FlashDecodingInputs = useMemo(() => ({
    modelArchitecture,
    contextLengthTokens,
    kvChunkSize,
    numGpus,
    parallelismStrategy,
    hardwareCluster,
    currency: 'USD'
  }), [
    modelArchitecture,
    contextLengthTokens,
    kvChunkSize,
    numGpus,
    parallelismStrategy,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateFlashDecoding(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-[24px] border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: FlashDecoding &amp; Sequence Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-flashdecoding-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              FlashDecoding Parallelism Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Split-KV Attention · RingAttention · Partial Softmax
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          CUDA KERNEL
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
          <label className="text-neutral-400 block mb-1">STRATEGY</label>
          <select
            value={parallelismStrategy}
            onChange={(e) => setParallelismStrategy(e.target.value as ParallelismStrategy)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value="sequence_parallel_ring">Sequence Parallel (Ring)</option>
            <option value="flashdecoding_single_gpu">FlashDecoding (Single)</option>
            <option value="tensor_parallel_nvlink">Tensor Parallel (NVLink)</option>
            <option value="hybrid_tp_sp">Hybrid TP + SP</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>CONTEXT WINDOW:</span>
            <span className="text-white font-bold">{contextLengthTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="4096"
            max="131072"
            step="4096"
            value={contextLengthTokens}
            onChange={(e) => setContextLengthTokens(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-neutral-400 block mb-1">GPU NODES</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {[1, 2, 4, 8].map((g) => (
                <button
                  key={g}
                  onClick={() => setNumGpus(g)}
                  className={`active:scale-[0.97] py-1 rounded text-[11px] font-mono border ${
                    numGpus === g
                      ? 'border-white/30 bg-white/10 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {g}x
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-neutral-400 block mb-1">KV CHUNK</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
              {[128, 256, 512, 1024].map((c) => (
                <button
                  key={c}
                  onClick={() => setKvChunkSize(c)}
                  className={`active:scale-[0.97] py-1 rounded text-[11px] font-mono border ${
                    kvChunkSize === c
                      ? 'border-white/30 bg-white/10 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-[18px] border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">SPEEDUP</div>
          <div className="text-base font-bold text-white">
            {results.speedupMultiplier}x
          </div>
          <div className="text-[9px] text-neutral-500">{results.baselineDecodeLatencyMs}ms → {results.flashDecodingLatencyMs}ms</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">SM OCCUPANCY</div>
          <div className="text-base font-bold text-white">
            {results.smOccupancyPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">{results.numParallelSplits} SM Splits</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">THROUGHPUT</div>
          <div className="text-base font-bold text-amber-400">
            {results.tokensPerSecond} tok/s
          </div>
          <div className="text-[9px] text-neutral-500">{results.annualClusterSavings}</div>
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
