import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculatePagedAttention,
  PagedAttentionInputs,
  ModelArchitecture,
  GpuHardwareType,
  MemoryAllocationEngine,
  KvCacheQuantization
} from '../calculator/agentPagedAttentionModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentPagedAttentionSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [gpuHardwareType, setGpuHardwareType] = useState<GpuHardwareType>('nvidia_h100_80gb');
  const [memoryAllocationEngine, setMemoryAllocationEngine] = useState<MemoryAllocationEngine>('vllm_paged_attention');
  const kvCacheQuantization: KvCacheQuantization = 'fp8_e4m3';
  const [concurrentAgentStreams, setConcurrentAgentStreams] = useState<number>(48);
  const [averageContextLengthTokens, setAverageContextLengthTokens] = useState<number>(8192);

  const inputs: PagedAttentionInputs = useMemo(() => ({
    modelArchitecture,
    gpuHardwareType,
    memoryAllocationEngine,
    kvCacheQuantization,
    concurrentAgentStreams,
    averageContextLengthTokens,
    currency: 'USD'
  }), [
    modelArchitecture,
    gpuHardwareType,
    memoryAllocationEngine,
    concurrentAgentStreams,
    averageContextLengthTokens
  ]);

  const results = useMemo(() => calculatePagedAttention(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: GPU VRAM PagedAttention & KV-Cache Allocator Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-pagedattention-cache-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              GPU VRAM PagedAttention Allocator
            </h2>
            <p className="text-[10px] text-slate-400">Virtual Memory KV-Cache & Chunked Prefill</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-pagedattention-cache-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 transition"
        >
          <span>Full Tool</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3.5 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Concurrent Agent Streams</span>
            <span className="font-mono text-emerald-400 font-bold">{concurrentAgentStreams} streams</span>
          </div>
          <input
            type="range"
            min="5"
            max="200"
            step="5"
            value={concurrentAgentStreams}
            onChange={(e) => setConcurrentAgentStreams(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-300">Avg Context Length (Tokens)</span>
            <span className="font-mono text-emerald-400 font-bold">{averageContextLengthTokens.toLocaleString()} tokens</span>
          </div>
          <input
            type="range"
            min="1000"
            max="32000"
            step="1000"
            value={averageContextLengthTokens}
            onChange={(e) => setAverageContextLengthTokens(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Architecture</label>
            <select
              value={modelArchitecture}
              onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="llama_3_70b">Llama-3 70B</option>
              <option value="deepseek_r1_671b">DeepSeek R1</option>
              <option value="mistral_large_123b">Mistral Large</option>
              <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">GPU Hardware</label>
            <select
              value={gpuHardwareType}
              onChange={(e) => setGpuHardwareType(e.target.value as GpuHardwareType)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="nvidia_h100_80gb">H100 80GB</option>
              <option value="nvidia_a100_80gb">A100 80GB</option>
              <option value="nvidia_l40s_48gb">L40S 48GB</option>
              <option value="nvidia_rtx_4090_24gb">RTX 4090 24GB</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 text-[10px] block mb-1">Memory Engine</label>
            <select
              value={memoryAllocationEngine}
              onChange={(e) => setMemoryAllocationEngine(e.target.value as MemoryAllocationEngine)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200"
            >
              <option value="vllm_paged_attention">vLLM Paged</option>
              <option value="tensorrt_llm_paged">TRT-LLM</option>
              <option value="naive_contiguous_pytorch">Contiguous</option>
              <option value="huggingface_accelerate">HF Accelerate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outputs Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">VRAM Utilization</div>
          <div className="text-sm sm:text-base font-bold font-mono text-emerald-400 mt-0.5">
            {results.effectiveMemoryUtilizationPct}%
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Near Zero Fragmentation</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">TTFT Latency</div>
          <div className="text-sm sm:text-base font-bold font-mono text-cyan-400 mt-0.5">
            {results.timeToFirstTokenLatencyMs} ms
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Prefill Decoupled</div>
        </div>
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-slate-400">Max Concurrency</div>
          <div className="text-sm sm:text-base font-bold font-mono text-purple-400 mt-0.5">
            {results.maxConcurrentStreamsBeforeOom} streams
          </div>
          <div className="text-[9px] text-slate-400 mt-0.5">Before GPU OOM</div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="p-2.5 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 "></span>
          <span className="text-slate-300 font-mono text-[11px]">{results.vramStatusClassification}</span>
        </div>
        <span className="text-emerald-400 font-mono font-bold text-[11px]">
          {results.annualHardwareCostSavings}
        </span>
      </div>

      {/* Watermark Backlink */}
      <div className="mt-3 text-[11px] text-slate-400 text-right">
        Simulated via{' '}
        <a
          href="https://elesium.online/tools/enterprise-agent-pagedattention-cache-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          Elesium GPU VRAM Simulator
        </a>
      </div>
    </div>
  );
}
