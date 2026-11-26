import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  Gauge,
  ArrowUpRight
} from 'lucide-react';
import {
  calculateMultiAgentEstimates,
  formatNumber,
  formatCompactNumber,
  TOPOLOGIES,
  PUBLIC_MODELS,
  PRIVATE_CLUSTERS,
  TopologyKey,
  PublicModelKey,
  PrivateClusterKey,
  Currency
} from '../calculator/latencyEstimatorModel';

export default function EmbedLatencyEstimator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [topology, setTopology] = useState<TopologyKey>('state_machine');
  const [nodeCount, setNodeCount] = useState<number>(5);
  const [monthlyRuns, setMonthlyRuns] = useState<number>(50000);
  const [inputTokensPerNode, setInputTokensPerNode] = useState<number>(4000);
  const outputTokensPerNode = 800;
  const [publicModel, setPublicModel] = useState<PublicModelKey>('gpt-4o');
  const [privateCluster, setPrivateCluster] = useState<PrivateClusterKey>('h100-quad');

  const results = useMemo(() => {
    return calculateMultiAgentEstimates({
      topology,
      nodeCount,
      monthlyRuns,
      inputTokensPerNode,
      outputTokensPerNode,
      publicModel,
      privateCluster,
      currency
    });
  }, [topology, nodeCount, monthlyRuns, inputTokensPerNode, outputTokensPerNode, publicModel, privateCluster, currency]);

  const activePub = PUBLIC_MODELS[publicModel];
  const activePriv = PRIVATE_CLUSTERS[privateCluster];

  return (
    <>
      <Helmet>
        <title>Multi-Agent Latency & Cost Calculator Widget | Elesium</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/embed/latency-estimator" />
      </Helmet>

      <div className="bg-neutral-950 text-neutral-100 p-4 sm:p-6 font-sans antialiased min-h-[640px] flex flex-col justify-between border border-neutral-800 rounded-xl shadow-xl">
        <div>
          {/* Top Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-neutral-200" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Multi-Agent Latency & Cost Estimator
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={topology}
                onChange={(e) => setTopology(e.target.value as TopologyKey)}
                aria-label="Agent Pipeline Architecture"
                className="text-[10px] font-mono bg-white/[0.05] text-neutral-200 px-2 py-0.5 rounded border border-white/15 focus:outline-none"
              >
                {(Object.keys(TOPOLOGIES) as TopologyKey[]).map((k) => (
                  <option key={k} value={k}>
                    {TOPOLOGIES[k].name}
                  </option>
                ))}
              </select>
              <div className="inline-flex rounded bg-neutral-900 p-0.5 border border-neutral-800">
                <button
                  onClick={() => setCurrency('USD')}
                  className={`active:scale-[0.97] px-2 py-0.5 text-[10px] font-mono rounded ${
                    currency === 'USD' ? 'bg-white text-black' : 'text-neutral-400'
                  }`}
                >
                  $
                </button>
                <button
                  onClick={() => setCurrency('INR')}
                  className={`active:scale-[0.97] px-2 py-0.5 text-[10px] font-mono rounded ${
                    currency === 'INR' ? 'bg-white text-black' : 'text-neutral-400'
                  }`}
                >
                  ₹
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>DAG Nodes:</span>
                <span className="font-mono text-white font-bold">{nodeCount}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Runs/Mo:</span>
                <span className="font-mono text-white font-bold">{formatCompactNumber(monthlyRuns)}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="300000"
                step="5000"
                value={monthlyRuns}
                onChange={(e) => setMonthlyRuns(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
              />
            </div>

            <div className="bg-neutral-900/80 p-2.5 rounded-xl border border-neutral-800">
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Context / Node:</span>
                <span className="font-mono text-neutral-200 font-bold">{formatCompactNumber(inputTokensPerNode)}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="16000"
                step="1000"
                value={inputTokensPerNode}
                onChange={(e) => setInputTokensPerNode(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-800 rounded appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          {/* Model Selection Row */}
          <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Public Cloud Baseline:</label>
              <select
                value={publicModel}
                onChange={(e) => setPublicModel(e.target.value as PublicModelKey)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-neutral-200 font-mono text-[11px]"
              >
                {(Object.keys(PUBLIC_MODELS) as PublicModelKey[]).map((k) => (
                  <option key={k} value={k}>
                    {PUBLIC_MODELS[k].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Private VPC Target:</label>
              <select
                value={privateCluster}
                onChange={(e) => setPrivateCluster(e.target.value as PrivateClusterKey)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 text-neutral-200 font-mono text-[11px]"
              >
                {(Object.keys(PRIVATE_CLUSTERS) as PrivateClusterKey[]).map((k) => (
                  <option key={k} value={k}>
                    {PRIVATE_CLUSTERS[k].name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Benchmark Results Display */}
          <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5 text-neutral-200" />
                End-to-End P50 Pipeline Latency:
              </span>
              <span className="text-xs font-mono font-bold text-white">
                {results.latencyImprovementPct}% Faster
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-amber-400">Public Cloud ({activePub.name}):</span>
                <span className="text-amber-400 font-bold">{formatNumber(results.publicP50LatencyMs)}ms</span>
              </div>
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-neutral-200">Sovereign VPC ({activePriv.name}):</span>
                <span className="text-white font-bold">{formatNumber(results.privateP50LatencyMs)}ms</span>
              </div>
            </div>

            {/* Financial Comparison */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800 text-xs">
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                <div className="text-[10px] text-neutral-500">Cloud API / Mo:</div>
                <div className="font-mono font-bold text-amber-300">
                  {results.currencySymbol}{formatNumber(results.publicMonthlyCost)}
                </div>
              </div>
              <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/15">
                <div className="text-[10px] text-neutral-500">Private Cluster / Mo:</div>
                <div className="font-mono font-bold text-white">
                  {results.currencySymbol}{formatNumber(results.privateMonthlyCost)}
                </div>
              </div>
            </div>

            <div className="mt-3 text-center bg-white/[0.05] border border-white/20 rounded-lg py-2">
              <span className="text-[11px] text-white font-semibold font-mono">
                Net Annual Savings: {results.currencySymbol}{formatNumber(results.netAnnualSavings)} ({results.savingsPct}% reduction)
              </span>
            </div>
          </div>
        </div>

        {/* Mandatory Watermark Backlink */}
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span>Deterministic Multi-Agent Benchmark</span>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-200 hover:text-white flex items-center gap-1 font-medium underline"
          >
            <span>Elesium Enterprise AI Solutions</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </>
  );
}
