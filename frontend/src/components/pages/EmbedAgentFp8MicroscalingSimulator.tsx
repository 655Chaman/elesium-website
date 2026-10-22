import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateFp8Microscaling,
  Fp8MicroscalingInputs,
  Fp8ModelArchitecture,
  MicroscalingFormat,
  MicroscalingBlockSize,
  HardwareCluster
} from '../calculator/agentFp8MicroscalingModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentFp8MicroscalingSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<Fp8ModelArchitecture>('sovereign_100b_agent');
  const [microscalingFormat, setMicroscalingFormat] = useState<MicroscalingFormat>('mxfp8_ocp');
  const [blockSize, setBlockSize] = useState<MicroscalingBlockSize>(32);
  const [hardwareCluster, setHardwareCluster] = useState<HardwareCluster>('nvidia_b200_blackwell');
  const sequenceLengthTokens = 32768;
  const batchSize = 16;

  const inputs: Fp8MicroscalingInputs = useMemo(() => ({
    modelArchitecture,
    microscalingFormat,
    blockSize,
    hardwareCluster,
    sequenceLengthTokens,
    batchSize,
    currency: 'USD'
  }), [
    modelArchitecture,
    microscalingFormat,
    blockSize,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateFp8Microscaling(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: FP8 & MXFP8 Microscaling Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-fp8-microscaling-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">FP8 & MXFP8 Microscaling Simulator</h3>
            <p className="text-[11px] text-slate-400">Dynamic Block Exponent Scaling & GEMM Acceleration</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-fp8-microscaling-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-mono transition-colors"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3 text-xs mb-4">
        <div>
          <label className="text-slate-400 block mb-1 font-mono text-[11px]">Model Architecture</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as Fp8ModelArchitecture)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-white font-mono"
          >
            <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent</option>
            <option value="llama_3_1_70b">Meta Llama-3.1 70B</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (37B Active)</option>
            <option value="llama_3_405b">Meta Llama-3 405B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B Instruct</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">Quantization Format</label>
            <select
              value={microscalingFormat}
              onChange={(e) => setMicroscalingFormat(e.target.value as MicroscalingFormat)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value="mxfp8_ocp">OCP MXFP8 (Block Exponent)</option>
              <option value="mxfp4_microscaling">OCP MXFP4 (Sub-1% PPL)</option>
              <option value="fp8_e4m3">FP8 E4M3 (Standard GEMM)</option>
              <option value="fp8_e5m2">FP8 E5M2 (Wide Range)</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">Micro-Block Size</label>
            <select
              value={blockSize}
              onChange={(e) => setBlockSize(Number(e.target.value) as MicroscalingBlockSize)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value={16}>k=16 elements</option>
              <option value={32}>k=32 elements (OCP Std)</option>
              <option value={64}>k=64 elements</option>
              <option value={128}>k=128 elements</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-slate-400 block mb-1 font-mono text-[11px]">Target Hardware Accelerator</label>
          <select
            value={hardwareCluster}
            onChange={(e) => setHardwareCluster(e.target.value as HardwareCluster)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
          >
            <option value="nvidia_b200_blackwell">NVIDIA B200 Blackwell (Native MXFP8/4)</option>
            <option value="nvidia_h100_sxm">NVIDIA H100 SXM5 (Hopper FP8)</option>
            <option value="nvidia_h200_sxm">NVIDIA H200 SXM5 (141GB HBM3e)</option>
            <option value="grace_hopper_gh200">Grace Hopper GH200 NVL</option>
          </select>
        </div>
      </div>

      {/* Output Telemetry Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-2 mb-3">
        <div className="flex justify-between items-center text-slate-400">
          <span>GEMM Speedup Multiplier:</span>
          <span className="text-emerald-400 font-bold">{results.gemmSpeedupMultiplier}x Peak TFLOPS</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>VRAM Footprint vs FP16:</span>
          <span className="text-white font-semibold">
            {results.vramMemoryFootprintGb} GB ({results.memoryReductionPercent}% saved)
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Perplexity (PPL) Degradation:</span>
          <span className={results.perplexityDeltaPercent < 0.10 ? 'text-emerald-400 font-bold' : results.perplexityDeltaPercent < 1.0 ? 'text-amber-400' : 'text-rose-400 font-bold'}>
            +{results.perplexityDeltaPercent}% {results.perplexityDeltaPercent < 1.0 ? '(Production Safe)' : '(Outlier Noise)'}
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Serving Step Latency:</span>
          <span className="text-slate-200">{results.effectiveStepLatencyMs} ms</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/60 pt-2">
          <span>Throughput:</span>
          <span className="text-emerald-400 font-bold">{results.tokensPerSecondThroughput.toLocaleString()} tokens/sec</span>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="text-[11px] text-slate-500 text-right font-sans">
        Powered by{' '}
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 underline hover:text-emerald-300"
        >
          Elesium Sovereign AI Systems
        </a>
      </div>
    </div>
  );
}
