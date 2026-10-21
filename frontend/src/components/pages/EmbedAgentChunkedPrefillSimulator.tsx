import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateChunkedPrefill,
  ChunkedPrefillInputs,
  ServingEngine,
  GpuArchitecture,
  KvCacheDataType
} from '../calculator/agentChunkedPrefillModel';
import { Zap, ArrowUpRight, Cpu } from 'lucide-react';

export default function EmbedAgentChunkedPrefillSimulator() {
  const [concurrentUsers, setConcurrentUsers] = useState<number>(64);
  const [promptContextLength, setPromptContextLength] = useState<number>(8192);
  const [sharedSystemPromptTokens, setSharedSystemPromptTokens] = useState<number>(3072);
  const [prefillChunkSize, setPrefillChunkSize] = useState<number>(512);
  const [servingEngine, setServingEngine] = useState<ServingEngine>('sglang_radix_attention');
  const [gpuArchitecture, setGpuArchitecture] = useState<GpuArchitecture>('nvidia_h100_80gb');
  const [kvCacheDataType, setKvCacheDataType] = useState<KvCacheDataType>('fp8_e4m3');

  const inputs: ChunkedPrefillInputs = useMemo(() => ({
    concurrentUsers,
    promptContextLength,
    sharedSystemPromptTokens,
    prefillChunkSize,
    servingEngine,
    gpuArchitecture,
    kvCacheDataType,
    currency: 'INR'
  }), [
    concurrentUsers,
    promptContextLength,
    sharedSystemPromptTokens,
    prefillChunkSize,
    servingEngine,
    gpuArchitecture,
    kvCacheDataType
  ]);

  const results = useMemo(() => {
    return calculateChunkedPrefill(inputs);
  }, [inputs]);

  // Generate SVG latency curve
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.ttftTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(80, results.ttftMilliseconds * 1.6);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.ttftMs / maxLatency) * (height * 0.75) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.ttftTrace, results.ttftMilliseconds]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Chunked Prefill &amp; Radix Attention KV Cache Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-chunked-prefill-radix-attention-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">Chunked Prefill &amp; Radix Attention Simulator</h1>
              <p className="text-[10px] text-slate-400">SGLang &amp; vLLM PagedAttention KV Cache Paging</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-indigo-500/10 border-indigo-500/30 text-indigo-400">
            {results.statusClassification}
          </span>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">TTFT Latency</span>
            <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">
              {results.ttftMilliseconds} <span className="text-xs text-slate-500 font-normal">ms</span>
            </div>
            <span className="text-[9px] text-slate-500 block">Time to first token</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Decode Speed</span>
            <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
              {results.decodeTokensPerSecondPerUser} <span className="text-xs text-slate-500 font-normal">tok/s</span>
            </div>
            <span className="text-[9px] text-slate-500 block">Per concurrent user</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">Prefix Hit Ratio</span>
            <div className="text-lg font-black font-mono text-cyan-400 mt-0.5">
              {results.prefixCacheHitRatioPct}%
            </div>
            <span className="text-[9px] text-slate-500 block">Radix KV cache hit</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-medium">VRAM Saved</span>
            <div className="text-lg font-black font-mono text-purple-400 mt-0.5">
              {results.kvCacheMemorySavedGb} <span className="text-xs text-slate-500 font-normal">GB</span>
            </div>
            <span className="text-[9px] text-slate-500 block">GPU memory conserved</span>
          </div>
        </div>

        {/* SVG Latency Chart */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3">
          <div className="flex justify-between items-center mb-1 text-[11px]">
            <span className="text-slate-400 flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" /> TTFT Scaling across Context Depth (512 to 65k tokens)
            </span>
            <span className="text-indigo-400 font-mono text-[10px]">TTFT: {results.ttftMilliseconds}ms</span>
          </div>
          <div className="relative h-20 w-full overflow-hidden rounded bg-slate-950/60 border border-slate-900">
            <svg viewBox="0 0 340 90" className="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chunkedPrefillGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {svgData.path && (
                <>
                  <path
                    d={`${svgData.path} L 340 90 L 0 90 Z`}
                    fill="url(#chunkedPrefillGrad)"
                  />
                  <path
                    d={svgData.path}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-lg p-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 mb-1">
              <span>Concurrent Users: <strong className="text-white font-mono">{concurrentUsers}</strong></span>
              <span className="text-slate-500">10 – 1000</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={concurrentUsers}
              onChange={(e) => setConcurrentUsers(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Prompt Context: <strong className="text-white font-mono">{promptContextLength} tok</strong></span>
              </div>
              <input
                type="range"
                min="1024"
                max="65536"
                step="1024"
                value={promptContextLength}
                onChange={(e) => setPromptContextLength(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Shared Prefix: <strong className="text-white font-mono">{sharedSystemPromptTokens} tok</strong></span>
              </div>
              <input
                type="range"
                min="256"
                max="16384"
                step="256"
                value={sharedSystemPromptTokens}
                onChange={(e) => setSharedSystemPromptTokens(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Serving Runtime</label>
              <select
                value={servingEngine}
                onChange={(e) => setServingEngine(e.target.value as ServingEngine)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="sglang_radix_attention">SGLang RadixAttention</option>
                <option value="vllm_paged_attention">vLLM PagedAttention</option>
                <option value="tensorrt_llm_inflight">TensorRT-LLM Inflight</option>
                <option value="naive_linear_attention">Naive Linear Attention</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">GPU Hardware</label>
              <select
                value={gpuArchitecture}
                onChange={(e) => setGpuArchitecture(e.target.value as GpuArchitecture)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="nvidia_h100_80gb">NVIDIA H100 (80GB SXM)</option>
                <option value="nvidia_a100_80gb">NVIDIA A100 (80GB PCIe)</option>
                <option value="nvidia_l40s_48gb">NVIDIA L40S (48GB)</option>
                <option value="nvidia_l4_24gb">NVIDIA L4 (24GB)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">KV Cache Precision</label>
              <select
                value={kvCacheDataType}
                onChange={(e) => setKvCacheDataType(e.target.value as KvCacheDataType)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="fp8_e4m3">FP8 E4M3 (High Fidelity)</option>
                <option value="fp16">FP16 Full Precision</option>
                <option value="int4_awq">INT4 AWQ (Max Density)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Prefill Chunk Size</label>
              <select
                value={prefillChunkSize}
                onChange={(e) => setPrefillChunkSize(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value={256}>256 Tokens (Zero Stutter)</option>
                <option value={512}>512 Tokens (Recommended)</option>
                <option value={1024}>1024 Tokens (High Throughput)</option>
                <option value={2048}>2048 Tokens (Batch Heavy)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer & Watermark */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
          <div className="text-slate-500">
            Est. Annual Spend: <span className="text-slate-300 font-mono font-medium">₹{results.annualGpuSpend.toLocaleString()}</span>
          </div>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Powered by Elesium Enterprise AI Solutions
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
