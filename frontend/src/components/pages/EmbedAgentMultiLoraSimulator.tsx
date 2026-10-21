import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateMultiLora,
  MultiLoraInputs,
  BaseModelFamily,
  HardwareCluster
} from '../calculator/agentMultiLoraModel';
import { Layers, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentMultiLoraSimulator() {
  const [baseModelFamily, setBaseModelFamily] = useState<BaseModelFamily>('llama_3_70b');
  const [numActiveAdapters, setNumActiveAdapters] = useState<number>(64);
  const [adapterRank, setAdapterRank] = useState<8 | 16 | 32 | 64>(16);
  const [concurrentBatchedRequests, setConcurrentBatchedRequests] = useState<number>(128);
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: MultiLoraInputs = useMemo(() => ({
    baseModelFamily,
    numActiveAdapters,
    adapterRank,
    concurrentBatchedRequests,
    hardwareCluster,
    currency: 'USD'
  }), [
    baseModelFamily,
    numActiveAdapters,
    adapterRank,
    concurrentBatchedRequests,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateMultiLora(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Multi-LoRA Dynamic Adapter Routing Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-multi-lora-routing-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-sky-950/80 border border-sky-800/60 text-sky-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Multi-LoRA Adapter Routing Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Zero-Copy Weight Swapping · Paged Memory Slicing
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-400">
          MULTI-TENANT LORA
        </span>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 text-xs font-mono">
        <div>
          <label className="text-slate-400 block mb-1">FOUNDATION MODEL</label>
          <select
            value={baseModelFamily}
            onChange={(e) => setBaseModelFamily(e.target.value as BaseModelFamily)}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
          >
            <option value="llama_3_70b">Llama-3 70B</option>
            <option value="deepseek_r1_671b">DeepSeek-R1 671B</option>
            <option value="mistral_large_123b">Mistral Large 123B</option>
            <option value="qwen_2_5_72b">Qwen-2.5 72B</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 block mb-1">ACTIVE ADAPTERS</label>
          <select
            value={numActiveAdapters}
            onChange={(e) => setNumActiveAdapters(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 rounded p-1.5 text-slate-200"
          >
            <option value={16}>16 LoRA Tasks</option>
            <option value={32}>32 LoRA Tasks</option>
            <option value={64}>64 LoRA Tasks</option>
            <option value={128}>128 LoRA Tasks</option>
            <option value={256}>256 LoRA Tasks</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>BATCHED QUERIES:</span>
            <span className="text-sky-400 font-bold">{concurrentBatchedRequests} requests</span>
          </div>
          <input
            type="range"
            min="16"
            max="256"
            step="16"
            value={concurrentBatchedRequests}
            onChange={(e) => setConcurrentBatchedRequests(Number(e.target.value))}
            className="w-full h-1 bg-slate-800 rounded appearance-none cursor-pointer accent-sky-400"
          />
        </div>

        <div>
          <span className="text-slate-400 block mb-1">ADAPTER RANK (r)</span>
          <div className="grid grid-cols-4 gap-1">
            {([8, 16, 32, 64] as const).map((r) => (
              <button
                key={r}
                onClick={() => setAdapterRank(r)}
                className={`py-1 rounded text-[11px] font-mono border ${
                  adapterRank === r
                    ? 'border-sky-500 bg-sky-500/20 text-sky-300 font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-400'
                }`}
              >
                r = {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-slate-400">VRAM SAVED</div>
          <div className="text-base font-bold text-sky-400">
            -{results.vramSavingsPercent}%
          </div>
          <div className="text-[9px] text-slate-500">{results.sharedSystemTotalVramGb} GB vs {results.dedicatedModelsVramGb} GB</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">SWITCH LATENCY</div>
          <div className="text-base font-bold text-teal-400">
            {results.switchingLatencyMs} ms
          </div>
          <div className="text-[9px] text-slate-500">vs {results.baselinePcieSwitchingMs}ms PCIe</div>
        </div>
        <div>
          <div className="text-[10px] text-slate-400">THROUGHPUT</div>
          <div className="text-base font-bold text-indigo-400">
            {results.batchThroughputTokensPerSec.toLocaleString()}
          </div>
          <div className="text-[9px] text-slate-500">tok/s batched SGMV</div>
        </div>
      </div>

      {/* Footer Branding & Link */}
      <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
        <span className="text-slate-400">
          SLA: <span className="text-emerald-400 font-bold">{results.slaStatus.replace(/_/g, ' ')}</span>
        </span>
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-400 hover:text-sky-300 inline-flex items-center gap-1 font-medium transition"
        >
          Elesium Sovereign Solutions
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
