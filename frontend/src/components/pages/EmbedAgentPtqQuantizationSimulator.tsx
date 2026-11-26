import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculatePtqQuantization,
  PtqQuantizationInputs,
  ModelArchitecture,
  QuantizationMethod,
  KvCachePrecision,
  TargetGpuHardware
} from '../calculator/agentPtqQuantizationModel';
import { Microchip, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentPtqQuantizationSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [quantizationMethod, setQuantizationMethod] = useState<QuantizationMethod>('awq_w4a16');
  const [contextLengthTokens, setContextLengthTokens] = useState<number>(8192);
  const [concurrentRequests, setConcurrentRequests] = useState<number>(8);
  const kvCachePrecision: KvCachePrecision = 'fp8_e4m3';
  const targetGpuHardware: TargetGpuHardware = 'nvidia_h100_sxm5';

  const inputs: PtqQuantizationInputs = useMemo(() => ({
    modelArchitecture,
    quantizationMethod,
    kvCachePrecision,
    contextLengthTokens,
    concurrentRequests,
    targetGpuHardware,
    currency: 'USD'
  }), [
    modelArchitecture,
    quantizationMethod,
    kvCachePrecision,
    contextLengthTokens,
    concurrentRequests,
    targetGpuHardware
  ]);

  const results = useMemo(() => calculatePtqQuantization(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-[24px] border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Enterprise LLM Quantization &amp; Perplexity Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-ptq-quantization-perplexity-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Microchip className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Enterprise LLM Quantization Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              AWQ 4-Bit · SmoothQuant W8A8 · Hopper FP8 E4M3
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          PTQ KERNEL
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
          <label className="text-neutral-400 block mb-1">QUANTIZATION METHOD</label>
          <select
            value={quantizationMethod}
            onChange={(e) => setQuantizationMethod(e.target.value as QuantizationMethod)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value="awq_w4a16">AWQ W4A16 (Salient)</option>
            <option value="fp8_e4m3_hopper">Native FP8 E4M3</option>
            <option value="smoothquant_w8a8">SmoothQuant W8A8</option>
            <option value="gptq_w4a16">GPTQ W4A16</option>
            <option value="bitsandbytes_nf4">BitsAndBytes NF4</option>
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
            min="2048"
            max="65536"
            step="2048"
            value={contextLengthTokens}
            onChange={(e) => setContextLengthTokens(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>CONCURRENT REQUESTS:</span>
            <span className="text-white font-bold">{concurrentRequests} streams</span>
          </div>
          <input
            type="range"
            min="1"
            max="64"
            step="1"
            value={concurrentRequests}
            onChange={(e) => setConcurrentRequests(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-[18px] border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">VRAM CUT</div>
          <div className="text-base font-bold text-white">
            {results.vramSavingsPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">{results.quantizedVramGb} GB total</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">PERPLEXITY DRIFT</div>
          <div className="text-base font-bold text-white">
            +{results.perplexityDegradationPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">PPL: {results.quantizedPerplexity}</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">SAVINGS / YR</div>
          <div className="text-base font-bold text-amber-400">
            {results.annualGpuCostSavings}
          </div>
          <div className="text-[9px] text-neutral-500">{results.requiredGpuNodes} GPU Node(s)</div>
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
