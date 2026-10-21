import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculatePrefillDecodePerformance,
  PrefillDecodeInputs,
  ModelFamily,
  KvTransportProtocol
} from '../calculator/agentPrefillDecodeModel';
import { Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentPrefillDecodeSimulator() {
  const [modelFamily, setModelFamily] = useState<ModelFamily>('llama_3_70b');
  const [prefillWorkers, setPrefillWorkers] = useState<number>(4);
  const [decodeWorkers, setDecodeWorkers] = useState<number>(8);
  const [chunkSizeTokens, setChunkSizeTokens] = useState<number>(512);
  const promptLength = 2048;
  const concurrencyQps = 120;
  const [kvTransport, setKvTransport] = useState<KvTransportProtocol>('roce_v2_rdma');

  const inputs: PrefillDecodeInputs = useMemo(() => ({
    modelFamily,
    prefillWorkers,
    decodeWorkers,
    chunkSizeTokens,
    promptLength,
    concurrencyQps,
    kvTransport,
    currency: 'USD'
  }), [
    modelFamily,
    prefillWorkers,
    decodeWorkers,
    chunkSizeTokens,
    promptLength,
    concurrencyQps,
    kvTransport
  ]);

  const results = useMemo(() => calculatePrefillDecodePerformance(inputs), [inputs]);

  return (
    <div className="bg-[#07090e] text-slate-100 p-5 rounded-xl border border-slate-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Prefill-Decode Disaggregation Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-prefill-decode-disaggregation-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Prefill-Decode Disaggregation Simulator
            </h2>
            <p className="text-[11px] text-slate-400">
              Chunked Prompt Prefill · Zero-Copy RDMA KV Transport · Sub-15ms TTFT
            </p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
          results.slaStatus === 'SUB_15MS_LEADER'
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
            <label className="text-[11px] text-slate-400 block mb-1">Model Architecture</label>
            <select
              value={modelFamily}
              onChange={(e) => setModelFamily(e.target.value as ModelFamily)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="llama_3_70b">Llama-3-70B</option>
              <option value="deepseek_v2_236b">DeepSeek-V2 MoE</option>
              <option value="qwen_2_5_72b">Qwen-2.5-72B</option>
              <option value="mixtral_8x22b">Mixtral-8x22B</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">KV Transport</label>
            <select
              value={kvTransport}
              onChange={(e) => setKvTransport(e.target.value as KvTransportProtocol)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="roce_v2_rdma">RoCE v2 RDMA</option>
              <option value="infiniband_direct">InfiniBand Direct</option>
              <option value="pcie_p2p">PCIe P2P Direct</option>
              <option value="tcp_socket">Standard TCP</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Prefill GPUs</span>
              <span className="text-emerald-400 font-mono">{prefillWorkers}</span>
            </div>
            <input
              type="range"
              min={1}
              max={16}
              value={prefillWorkers}
              onChange={(e) => setPrefillWorkers(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Decode GPUs</span>
              <span className="text-blue-400 font-mono">{decodeWorkers}</span>
            </div>
            <input
              type="range"
              min={2}
              max={32}
              value={decodeWorkers}
              onChange={(e) => setDecodeWorkers(Number(e.target.value))}
              className="w-full accent-blue-500 bg-slate-800"
            />
          </div>
          <div>
            <div className="flex justify-between text-[11px] text-slate-400 mb-1">
              <span>Chunk Size</span>
              <span className="text-white font-mono">{chunkSizeTokens}</span>
            </div>
            <select
              value={chunkSizeTokens}
              onChange={(e) => setChunkSizeTokens(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1 text-[11px] text-white"
            >
              <option value={128}>128</option>
              <option value={256}>256</option>
              <option value={512}>512</option>
              <option value={1024}>1024</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-Time KPIs */}
      <div className="grid grid-cols-3 gap-2 p-3 bg-slate-900/90 rounded-lg border border-slate-800 mb-4">
        <div className="text-center">
          <div className="text-[10px] text-slate-400">P99 TTFT</div>
          <div className="text-lg font-black text-emerald-400 font-mono">{results.ttftLatencyMs}ms</div>
          <div className="text-[9px] text-slate-500">vs {results.unifiedBaselineTtftMs}ms Unified</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Speedup</div>
          <div className="text-lg font-black text-blue-400 font-mono">{results.latencyReductionFactor}x</div>
          <div className="text-[9px] text-slate-500">Initial Token</div>
        </div>
        <div className="text-center">
          <div className="text-[10px] text-slate-400">Inter-Token</div>
          <div className="text-lg font-black text-purple-400 font-mono">{results.interTokenLatencyMs}ms</div>
          <div className="text-[9px] text-slate-500">Zero Stalls</div>
        </div>
      </div>

      {/* Watermark & Attribution Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
        <span>Powered by Elesium Sovereign AI Engineering</span>
        <a
          href="https://elesium.online/tools/enterprise-agent-prefill-decode-disaggregation-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 font-semibold inline-flex items-center gap-0.5"
        >
          Open Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
