import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Lock,
  Sliders
} from 'lucide-react';
import {
  simulateAgentHomomorphicEnclave,
  AgentHomomorphicEnclaveInputs
} from '../calculator/agentHomomorphicEnclaveModel';

export default function EmbedAgentHomomorphicEnclaveSimulator() {
  const [monthlyInferenceQueriesMillions, setMonthlyInferenceQueriesMillions] = useState<number>(5);
  const contextLengthTokens = 2048;
  const enclaveHardwareType: 'amd_sev_snp' | 'intel_tdx' | 'aws_nitro_tpm' = 'amd_sev_snp';
  const cloudHostHourlyRateUSD = 6.50;
  const [fheNoiseBudgetBits, setFheNoiseBudgetBits] = useState<number>(128);

  const inputs: AgentHomomorphicEnclaveInputs = useMemo(() => ({
    monthlyInferenceQueriesMillions,
    contextLengthTokens,
    enclaveHardwareType,
    cloudHostHourlyRateUSD,
    fheNoiseBudgetBits
  }), [
    monthlyInferenceQueriesMillions,
    contextLengthTokens,
    enclaveHardwareType,
    cloudHostHourlyRateUSD,
    fheNoiseBudgetBits
  ]);

  const results = useMemo(() => {
    return simulateAgentHomomorphicEnclave(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans selection:bg-emerald-500 selection:text-black">
      <Helmet>
        <title>Agent Homomorphic Encryption &amp; Confidential Enclave Simulator Sandbox</title>
        <meta
          name="description"
          content="Embeddable interactive simulator calculating autonomous agent Confidential Computing enclaves, FHE arithmetic slowdown, wire-speed memory encryption, and DPDP Act 2023 zero-disclosure compliance."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-homomorphic-enclave-simulator" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 " />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent Confidential Enclave &amp; FHE Simulator
            </h1>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
            Interactive Embed
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Monthly Inference Workload</span>
              <span className="font-mono text-emerald-400 font-bold">{monthlyInferenceQueriesMillions}M queries</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={monthlyInferenceQueriesMillions}
              onChange={(e) => setMonthlyInferenceQueriesMillions(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">FHE Noise Budget</span>
              <span className="font-mono text-emerald-400 font-bold">{fheNoiseBudgetBits} bits</span>
            </div>
            <input
              type="range"
              min="64"
              max="256"
              step="32"
              value={fheNoiseBudgetBits}
              onChange={(e) => setFheNoiseBudgetBits(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-emerald-500"
            />
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">Hypervisor Snooping</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {results.sovereignEnclave.hypervisorSnoopingRiskPct.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-500">Hardware AES-256</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">Enclave Latency</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {results.sovereignEnclave.meanInferenceLatencyMs} ms
            </div>
            <div className="text-[10px] text-slate-500">{results.latencyCutVsFhePct}% faster than FHE</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">Memory Efficiency</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-1">
              {results.memoryEfficiencyMultiplier}x
            </div>
            <div className="text-[10px] text-slate-500">Zero ciphertext bloat</div>
          </div>
        </div>

        {/* Comparison Tier Mini-Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs">
          <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            Architectural Benchmark Summary
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Public Cloud VM (Unencrypted):</span>
              <span className="font-mono text-rose-400">{results.publicUnencrypted.meanInferenceLatencyMs}ms | 100% Hypervisor Leakage | Non-Compliant</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Software FHE (CKKS/TFHE):</span>
              <span className="font-mono text-amber-400">{(results.softwareFhe.meanInferenceLatencyMs / 1000).toFixed(1)}s | 2,100x Slowdown | {(results.softwareFhe.memoryFootprintMB / 1024).toFixed(1)} GB</span>
            </div>
            <div className="flex justify-between items-center py-1 text-emerald-300 font-medium">
              <span>Elesium Sovereign Enclave (SEV-SNP):</span>
              <span className="font-mono text-emerald-400">{results.sovereignEnclave.meanInferenceLatencyMs}ms | 0.0% Leakage | 100% DPDP Act Compliant</span>
            </div>
          </div>
        </div>

        {/* Footer Attribution Link */}
        <div className="pt-2 border-t border-slate-900 text-right text-xs text-slate-500">
          Calculated via{' '}
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 underline hover:text-emerald-300"
          >
            Elesium Sovereign AI Solutions
          </a>
        </div>
      </div>
    </div>
  );
}
