import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMixtureOfDepths,
  MixtureOfDepthsInputs,
  FoundationModel,
  HardwareCluster
} from '../calculator/agentMixtureOfDepthsModel';
import { GitBranch, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMixtureOfDepthsSimulator() {
  const [foundationModel, setFoundationModel] = useState<FoundationModel>('llama_3_70b');
  const [capacityFactor, setCapacityFactor] = useState<number>(0.50);
  const [sequenceLength, setSequenceLength] = useState<number>(4096);
  const [batchSize, setBatchSize] = useState<number>(64);
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: MixtureOfDepthsInputs = useMemo(() => ({
    foundationModel,
    capacityFactor,
    sequenceLength,
    batchSize,
    hardwareCluster,
    currency: 'USD'
  }), [
    foundationModel,
    capacityFactor,
    sequenceLength,
    batchSize,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateMixtureOfDepths(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Mixture-of-Depths Dynamic Compute Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-mixture-of-depths-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <GitBranch className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Mixture-of-Depths Compute Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Conditional Capacity Allocation · Sub-50% FLOP Reduction
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          DYNAMIC COMPUTE
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div>
          <label className="text-neutral-400 block mb-1">FOUNDATION MODEL</label>
          <select
            value={foundationModel}
            onChange={(e) => setFoundationModel(e.target.value as FoundationModel)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value="llama_3_70b">Llama-3 70B</option>
            <option value="deepseek_r1_671b">DeepSeek-R1 671B</option>
            <option value="mistral_large_123b">Mistral Large 123B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1">CAPACITY FACTOR (C)</label>
          <select
            value={capacityFactor}
            onChange={(e) => setCapacityFactor(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value={0.125}>12.5% Compute</option>
            <option value={0.25}>25.0% Compute</option>
            <option value={0.50}>50.0% Standard</option>
            <option value={0.75}>75.0% Conservative</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>CONTEXT TOKENS:</span>
            <span className="text-white font-bold">{sequenceLength.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="1024"
            max="16384"
            step="1024"
            value={sequenceLength}
            onChange={(e) => setSequenceLength(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>BATCH SIZE:</span>
            <span className="text-white font-bold">{batchSize} concurrent</span>
          </div>
          <input
            type="range"
            min="16"
            max="128"
            step="16"
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-lg border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">FLOP SAVED</div>
          <div className="text-base font-bold text-white">
            -{results.flopReductionPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">{results.effectiveFlopsTflops} vs {results.baselineDenseFlopsTflops} TFLOPs</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">SPEEDUP</div>
          <div className="text-base font-bold text-white">
            {results.speedupMultiplier}x
          </div>
          <div className="text-[9px] text-neutral-500">Static tensor aligned</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">THROUGHPUT</div>
          <div className="text-base font-bold text-white">
            {results.throughputTokensPerSec.toLocaleString()}
          </div>
          <div className="text-[9px] text-neutral-500">Tokens / Second</div>
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
          className="text-neutral-200 hover:text-white inline-flex items-center gap-1 font-medium transition"
        >
          Elesium Sovereign Solutions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
