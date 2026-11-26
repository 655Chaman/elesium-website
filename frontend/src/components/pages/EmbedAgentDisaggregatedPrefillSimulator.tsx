import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateDisaggregatedPrefill,
  DisaggregatedPrefillInputs,
  DisaggregatedModelArchitecture,
  ServingArchitecture,
  PrefillGpuType,
  DecodeGpuType
} from '../calculator/agentDisaggregatedPrefillModel';
import { SplitSquareVertical, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentDisaggregatedPrefillSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<DisaggregatedModelArchitecture>('sovereign_100b_agent');
  const [servingArchitecture, setServingArchitecture] = useState<ServingArchitecture>('disaggregated_rdma_roce');
  const [prefillGpuType] = useState<PrefillGpuType>('nvidia_h100_sxm');
  const [decodeGpuType] = useState<DecodeGpuType>('nvidia_h200_sxm');
  const promptTokens = 16384;
  const concurrencyRequests = 64;

  const inputs: DisaggregatedPrefillInputs = useMemo(() => ({
    modelArchitecture,
    servingArchitecture,
    prefillGpuType,
    decodeGpuType,
    promptTokens,
    concurrencyRequests,
    currency: 'USD'
  }), [
    modelArchitecture,
    servingArchitecture,
    prefillGpuType,
    decodeGpuType
  ]);

  const results = useMemo(() => calculateDisaggregatedPrefill(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Disaggregated Pre-fill &amp; KV Routing Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-disaggregated-prefill-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <SplitSquareVertical className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">Disaggregated Pre-fill Simulator</h3>
            <p className="text-[11px] text-neutral-400">Decoupled Compute/Decode &amp; RDMA KV Paging</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-disaggregated-prefill-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-neutral-200 hover:text-white flex items-center gap-1 font-mono transition-colors"
        >
          Full Simulator <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3 text-xs mb-4">
        <div>
          <label className="text-neutral-400 block mb-1 font-mono text-[11px]">Foundation Model</label>
          <select
            value={modelArchitecture}
            onChange={(e) => setModelArchitecture(e.target.value as DisaggregatedModelArchitecture)}
            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg p-2 text-white font-mono"
          >
            <option value="sovereign_100b_agent">Sovereign 100B Autonomous Agent</option>
            <option value="llama_3_1_70b">Meta Llama-3.1 70B</option>
            <option value="deepseek_r1_671b_moe">DeepSeek-R1 671B MoE (37B Active)</option>
            <option value="llama_3_405b">Meta Llama-3 405B</option>
          </select>
        </div>

        <div>
          <label className="text-neutral-400 block mb-1 font-mono text-[11px]">Serving Architecture Topology</label>
          <select
            value={servingArchitecture}
            onChange={(e) => setServingArchitecture(e.target.value as ServingArchitecture)}
            className="w-full bg-neutral-900 border border-neutral-700/80 rounded-lg p-1.5 text-white font-mono"
          >
            <option value="disaggregated_rdma_roce">Disaggregated 400G RoCE-v2 RDMA Fabric</option>
            <option value="disaggregated_infiniband_ndr">Disaggregated 800G NDR InfiniBand P2P</option>
            <option value="monolithic_chunked_prefill">Monolithic Chunked Pre-fill Time-Sliced</option>
            <option value="monolithic_standard">Monolithic Unchunked (Standard vLLM)</option>
          </select>
        </div>
      </div>

      {/* Output Telemetry Card */}
      <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-3 font-mono text-xs space-y-2 mb-3">
        <div className="flex justify-between items-center text-neutral-400">
          <span>Time-to-First-Token (TTFT):</span>
          <span className={results.timeToFirstTokenMs <= 4.5 ? 'text-white font-bold' : 'text-amber-400 font-bold'}>
            {results.timeToFirstTokenMs} ms {results.timeToFirstTokenMs <= 4.5 ? '(Sub-4ms Verified)' : '(Queue Jitter)'}
          </span>
        </div>
        <div className="flex justify-between items-center text-neutral-400">
          <span>Inter-Token Latency (ITL):</span>
          <span className="text-white font-semibold">{results.interTokenLatencyMs} ms / step</span>
        </div>
        <div className="flex justify-between items-center text-neutral-400">
          <span>Decode Throughput Multiplier:</span>
          <span className="text-white font-bold">{results.decodeThroughputMultiplier}x Acceleration</span>
        </div>
        <div className="flex justify-between items-center text-neutral-400 border-t border-neutral-800/60 pt-2">
          <span>Hardware OPEX Reduction:</span>
          <span className="text-white font-bold">{results.hardwareCostReductionPercent}% Cost Slashed</span>
        </div>
      </div>

      {/* Footer attribution */}
      <div className="text-[11px] text-neutral-500 text-right font-sans">
        Powered by{' '}
        <a
          href="https://elesium.online/solutions"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-200 underline hover:text-white"
        >
          Elesium Sovereign AI Systems
        </a>
      </div>
    </div>
  );
}
