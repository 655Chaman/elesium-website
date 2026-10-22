import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateThreeDParallelism,
  ThreeDParallelismInputs,
  ThreeDModelArchitecture,
  TpDegree,
  PpDegree,
  DpDegree,
  ZeroStage,
  PipelineSchedule,
  InterconnectType
} from '../calculator/agent3DParallelismModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgent3DParallelismSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ThreeDModelArchitecture>('sovereign_100b_agent');
  const [tpDegree, setTpDegree] = useState<TpDegree>(8);
  const [ppDegree, setPpDegree] = useState<PpDegree>(4);
  const [dpDegree, setDpDegree] = useState<DpDegree>(8);
  const [zeroStage, setZeroStage] = useState<ZeroStage>('zero_3');
  const [pipelineSchedule, setPipelineSchedule] = useState<PipelineSchedule>('zero_bubble');
  const [interconnect] = useState<InterconnectType>('nvlink_ndr_infiniband');
  const sequenceLengthTokens = 32768;
  const batchSize = 16;

  const inputs: ThreeDParallelismInputs = useMemo(() => ({
    modelArchitecture,
    tpDegree,
    ppDegree,
    dpDegree,
    zeroStage,
    pipelineSchedule,
    interconnect,
    sequenceLengthTokens,
    batchSize,
    currency: 'USD'
  }), [
    modelArchitecture,
    tpDegree,
    ppDegree,
    dpDegree,
    zeroStage,
    pipelineSchedule,
    interconnect
  ]);

  const results = useMemo(() => calculateThreeDParallelism(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: 3D Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-3d-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">3D Parallelism & Mesh Simulator</h3>
            <p className="text-[11px] text-slate-400">TP x PP x ZeRO-3 Cluster Orchestration</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-3d-parallelism-simulator"
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
            onChange={(e) => setModelArchitecture(e.target.value as ThreeDModelArchitecture)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-2 text-white font-mono"
          >
            <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent</option>
            <option value="llama_3_1_70b">Meta Llama-3.1 70B</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE</option>
            <option value="llama_3_405b">Meta Llama-3 405B</option>
          </select>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">TP Degree</label>
            <select
              value={tpDegree}
              onChange={(e) => setTpDegree(Number(e.target.value) as TpDegree)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value={1}>TP=1</option>
              <option value={2}>TP=2</option>
              <option value={4}>TP=4</option>
              <option value={8}>TP=8</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">PP Degree</label>
            <select
              value={ppDegree}
              onChange={(e) => setPpDegree(Number(e.target.value) as PpDegree)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value={1}>PP=1</option>
              <option value={2}>PP=2</option>
              <option value={4}>PP=4</option>
              <option value={8}>PP=8</option>
              <option value={16}>PP=16</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">DP Degree</label>
            <select
              value={dpDegree}
              onChange={(e) => setDpDegree(Number(e.target.value) as DpDegree)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value={1}>DP=1</option>
              <option value={2}>DP=2</option>
              <option value={4}>DP=4</option>
              <option value={8}>DP=8</option>
              <option value={16}>DP=16</option>
              <option value={32}>DP=32</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">ZeRO Stage</label>
            <select
              value={zeroStage}
              onChange={(e) => setZeroStage(e.target.value as ZeroStage)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value="zero_3">ZeRO-3 (Partition All)</option>
              <option value="zero_2">ZeRO-2 (Opt + Grad)</option>
              <option value="zero_1">ZeRO-1 (Opt Only)</option>
              <option value="zero_off">ZeRO Disabled</option>
            </select>
          </div>
          <div>
            <label className="text-slate-400 block mb-1 font-mono text-[11px]">Scheduler</label>
            <select
              value={pipelineSchedule}
              onChange={(e) => setPipelineSchedule(e.target.value as PipelineSchedule)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg p-1.5 text-white font-mono"
            >
              <option value="zero_bubble">Zero-Bubble 1F1B</option>
              <option value="interleaved_1f1b">Interleaved 1F1B</option>
              <option value="standard_1f1b">Standard 1F1B</option>
            </select>
          </div>
        </div>
      </div>

      {/* Output Telemetry Card */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-2 mb-3">
        <div className="flex justify-between items-center text-slate-400">
          <span>Cluster Mesh Size:</span>
          <span className="text-white font-semibold">{results.totalGpus} GPUs ({results.totalGpus / 8} Nodes)</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Model FLOPs Utilization (MFU):</span>
          <span className="text-emerald-400 font-bold">{results.modelFlopsUtilizationPercent}%</span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Peak VRAM Allocation:</span>
          <span className={results.oomRiskPrevented ? 'text-white' : 'text-rose-400 font-bold'}>
            {results.peakMemoryPerGpuGb} GB / 80GB SXM5
          </span>
        </div>
        <div className="flex justify-between items-center text-slate-400">
          <span>Pipeline Bubble Idle Ratio:</span>
          <span className="text-slate-200">{results.pipelineBubbleFractionPercent}%</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/60 pt-2">
          <span>Step Latency:</span>
          <span className="text-emerald-400 font-bold">{results.effectiveStepLatencyMs} ms</span>
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
