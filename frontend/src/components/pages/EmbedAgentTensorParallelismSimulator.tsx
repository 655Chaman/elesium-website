import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateTensorParallelism,
  TensorParallelismInputs,
  ModelArchitecture,
  TpDegree,
  InterconnectType,
  AllReduceMode
} from '../calculator/agentTensorParallelismModel';
import { Network, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentTensorParallelismSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [tpDegree, setTpDegree] = useState<TpDegree>(8);
  const [interconnect, setInterconnect] = useState<InterconnectType>('nvlink_4_900gb');
  const [allReduceMode, setAllReduceMode] = useState<AllReduceMode>('async_overlap');
  const [batchSize, setBatchSize] = useState<number>(32);

  const inputs: TensorParallelismInputs = useMemo(() => ({
    modelArchitecture,
    tpDegree,
    interconnect,
    allReduceMode,
    batchSize,
    currency: 'USD'
  }), [
    modelArchitecture,
    tpDegree,
    interconnect,
    allReduceMode,
    batchSize
  ]);

  const results = useMemo(() => calculateTensorParallelism(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Tensor Parallelism Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-tensor-parallelism-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <Network className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Tensor Parallelism Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Megatron Column/Row Partitioning · All-Reduce Overlap · Sub-5ms NVLink
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_5MS_NVLINK_OPTIMAL'
            ? 'bg-white/10 text-neutral-200 border-white/30'
            : results.slaStatus === 'ACCEPTABLE_PARTIAL_OVERLAP'
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            : 'bg-red-500/20 text-red-400 border-red-500/40'
        }`}>
          {results.slaStatus.replace(/_/g, ' ')}
        </span>
      </div>

      {/* Interactive Controls */}
      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Architecture</label>
            <select
              value={modelArchitecture}
              onChange={(e) => setModelArchitecture(e.target.value as ModelArchitecture)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white"
            >
              <option value="llama_3_70b">Llama-3-70B</option>
              <option value="deepseek_v2_236b">DeepSeek-V2 MoE</option>
              <option value="qwen_2_5_72b">Qwen-2.5-72B</option>
              <option value="mistral_large_123b">Mistral-Large-123B</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">All-Reduce Mode</label>
            <select
              value={allReduceMode}
              onChange={(e) => setAllReduceMode(e.target.value as AllReduceMode)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white"
            >
              <option value="async_overlap">Async Ring Overlap</option>
              <option value="two_shot">Two-Shot Reduction</option>
              <option value="nccl_tree_blocking">NCCL Tree Blocking</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">Interconnect Fabric</label>
            <select
              value={interconnect}
              onChange={(e) => setInterconnect(e.target.value as InterconnectType)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white"
            >
              <option value="nvlink_4_900gb">NVLink 4 (900 GB/s)</option>
              <option value="nvlink_3_600gb">NVLink 3 (600 GB/s)</option>
              <option value="pcie_gen5_128gb">PCIe Gen5 (128 GB/s)</option>
              <option value="pcie_gen4_64gb">PCIe Gen4 (64 GB/s)</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">TP Degree</label>
            <select
              value={tpDegree}
              onChange={(e) => setTpDegree(Number(e.target.value) as TpDegree)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-xs text-white"
            >
              <option value={2}>TP-2 (2 GPUs)</option>
              <option value={4}>TP-4 (4 GPUs)</option>
              <option value={8}>TP-8 (8 GPUs)</option>
              <option value={16}>TP-16 (16 GPUs)</option>
            </select>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
            <span>Inference Batch Size</span>
            <span className="text-neutral-200 font-mono">{batchSize} sequences</span>
          </div>
          <input
            type="range"
            min={1}
            max={128}
            value={batchSize}
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full accent-white bg-neutral-800"
          />
        </div>
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-neutral-900/90 rounded-lg border border-neutral-800 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-neutral-400">All-Reduce Latency</div>
          <div className="text-lg font-black text-neutral-200 font-mono">{results.allReduceLatencyMs}ms</div>
          <div className="text-[9px] text-neutral-500">Intra-Node Comm</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-neutral-400">Comm Overhead</div>
          <div className="text-lg font-black text-neutral-200 font-mono">{results.commOverheadPercent}%</div>
          <div className="text-[9px] text-neutral-500">Of Total Step</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-neutral-400">Throughput</div>
          <div className="text-lg font-black text-neutral-200 font-mono">{results.tokensPerSecond}</div>
          <div className="text-[9px] text-neutral-500">tok/s ({results.throughputSpeedup}x)</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-2 border-t border-neutral-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-tensor-parallelism-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-white font-semibold inline-flex items-center gap-0.5"
        >
          Open Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
