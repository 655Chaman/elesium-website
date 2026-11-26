import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateCrossAttention,
  CrossAttentionInputs,
  ModelArchitecture,
  InterconnectSpeed,
  HardwareCluster
} from '../calculator/agentCrossAttentionModel';
import { FileText, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentCrossAttentionSimulator() {
  const [modelArchitecture, setModelArchitecture] = useState<ModelArchitecture>('llama_3_70b');
  const [documentCorpusTokens, setDocumentCorpusTokens] = useState<number>(262144);
  const [documentChunkSize, setDocumentChunkSize] = useState<number>(1024);
  const [numGpuNodes, setNumGpuNodes] = useState<number>(4);
  const interconnectSpeed: InterconnectSpeed = 'nvlink_4_900gbps';
  const hardwareCluster: HardwareCluster = 'nvidia_h100_sxm5';

  const inputs: CrossAttentionInputs = useMemo(() => ({
    modelArchitecture,
    documentCorpusTokens,
    documentChunkSize,
    numGpuNodes,
    interconnectSpeed,
    hardwareCluster,
    currency: 'USD'
  }), [
    modelArchitecture,
    documentCorpusTokens,
    documentChunkSize,
    numGpuNodes,
    interconnectSpeed,
    hardwareCluster
  ]);

  const results = useMemo(() => calculateCrossAttention(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-[24px] border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Chunked Cross-Attention Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-chunked-cross-attention-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Chunked Cross-Attention Simulator
            </h2>
            <p className="text-[11px] text-neutral-400">
              Document Memory Sharding · Tensor Parallel NVLink Reduction
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/15 text-neutral-200">
          RAG SHARDING
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
          <label className="text-neutral-400 block mb-1">CHUNK SIZE</label>
          <select
            value={documentChunkSize}
            onChange={(e) => setDocumentChunkSize(Number(e.target.value))}
            className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-neutral-200"
          >
            <option value={256}>256 Tokens</option>
            <option value={512}>512 Tokens</option>
            <option value={1024}>1,024 Tokens</option>
            <option value={2048}>2,048 Tokens</option>
          </select>
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 mb-4 text-xs font-mono">
        <div>
          <div className="flex justify-between text-neutral-400 mb-1">
            <span>DOCUMENT CORPUS:</span>
            <span className="text-white font-bold">{documentCorpusTokens.toLocaleString()} tok</span>
          </div>
          <input
            type="range"
            min="16384"
            max="1048576"
            step="16384"
            value={documentCorpusTokens}
            onChange={(e) => setDocumentCorpusTokens(Number(e.target.value))}
            className="w-full h-1 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
          />
        </div>

        <div>
          <span className="text-neutral-400 block mb-1">GPU NODES</span>
          <div className="grid grid-cols-5 gap-1">
            {[1, 2, 4, 8, 16].map((g) => (
              <button
                key={g}
                onClick={() => setNumGpuNodes(g)}
                className={`active:scale-[0.97] py-1 rounded text-[11px] font-mono border ${
                  numGpuNodes === g
                    ? 'border-white/30 bg-white/10 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                }`}
              >
                {g}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Output Metric Badges */}
      <div className="grid grid-cols-3 gap-2 bg-neutral-950/70 p-3 rounded-[18px] border border-neutral-800/80 mb-4 font-mono text-center">
        <div>
          <div className="text-[10px] text-neutral-400">TOTAL SHARDS</div>
          <div className="text-base font-bold text-white">
            {results.totalShards}
          </div>
          <div className="text-[9px] text-neutral-500">{results.shardsPerGpu}/GPU Node</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">SPEEDUP</div>
          <div className="text-base font-bold text-white">
            {results.speedupMultiplier}x
          </div>
          <div className="text-[9px] text-neutral-500">{results.baselineConcatenatedRagLatencyMs}ms → {results.chunkedCrossAttentionLatencyMs}ms</div>
        </div>
        <div>
          <div className="text-[10px] text-neutral-400">VRAM SAVED</div>
          <div className="text-base font-bold text-white">
            -{results.memoryReductionPercent}%
          </div>
          <div className="text-[9px] text-neutral-500">{results.annualClusterSavings}</div>
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
