import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculatePipelineParallelism,
  PipelineParallelismInputs,
  ModelScale,
  PipelineScheduleMode,
  InterStageTransport
} from '../calculator/agentPipelineParallelismModel';
import { Layers, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentPipelineParallelismSimulator() {
  const [modelScale, setModelScale] = useState<ModelScale>('70b');
  const [pipelineStages, setPipelineStages] = useState<number>(4);
  const [microBatches, setMicroBatches] = useState<number>(16);
  const [scheduleMode, setScheduleMode] = useState<PipelineScheduleMode>('1f1b_interleaved');
  const interStageTransport: InterStageTransport = 'gpudirect_rdma';

  const inputs: PipelineParallelismInputs = useMemo(() => ({
    modelScale,
    pipelineStages,
    microBatches,
    scheduleMode,
    interStageTransport,
    currency: 'USD'
  }), [
    modelScale,
    pipelineStages,
    microBatches,
    scheduleMode
  ]);

  const results = useMemo(() => calculatePipelineParallelism(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Pipeline Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-pipeline-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Pipeline Parallelism Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              1F1B Micro-Batching · Bubble Minimizer · Sub-10ms P2P Buffer
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_10MS_ZERO_BUBBLE'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
        }`}>
          {results.slaStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Model Scale</label>
            <select
              value={modelScale}
              onChange={(e) => setModelScale(e.target.value as ModelScale)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="70b">Llama-3-70B</option>
              <option value="120b">Mistral-123B</option>
              <option value="236b_moe">DeepSeek-V2 MoE</option>
              <option value="405b">Llama-3-405B</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Schedule Mode</label>
            <select
              value={scheduleMode}
              onChange={(e) => setScheduleMode(e.target.value as PipelineScheduleMode)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="1f1b_interleaved">1F1B Interleaved</option>
              <option value="1f1b_standard">1F1B Standard</option>
              <option value="zero_bubble_async">Zero-Bubble Async</option>
              <option value="naive_gpipe">Naive GPipe</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Pipeline Stages</span>
              <span className="text-indigo-400 font-mono">{pipelineStages}</span>
            </div>
            <input
              type="range"
              min={2}
              max={16}
              value={pipelineStages}
              onChange={(e) => setPipelineStages(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Micro-Batches</span>
              <span className="text-cyan-400 font-mono">{microBatches}</span>
            </div>
            <input
              type="range"
              min={4}
              max={32}
              step={4}
              value={microBatches}
              onChange={(e) => setMicroBatches(Number(e.target.value))}
              className="w-full accent-cyan-500 bg-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Bubble Fraction</div>
          <div className="text-lg font-black text-indigo-400 font-mono">{results.bubbleFractionPercent}%</div>
          <div className="text-[9px] text-slate-500">Idle GPU Time</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Utilization</div>
          <div className="text-lg font-black text-emerald-400 font-mono">{results.effectiveGpuUtilization}%</div>
          <div className="text-[9px] text-slate-500">Active Core</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Throughput</div>
          <div className="text-lg font-black text-cyan-400 font-mono">{results.tokensPerSecond}</div>
          <div className="text-[9px] text-slate-500">tok/s Total</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-pipeline-parallelism-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:text-indigo-300 font-semibold inline-flex items-center gap-0.5"
        >
          Open Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
