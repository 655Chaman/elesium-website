import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  ShieldCheck,
  Sliders
} from 'lucide-react';
import {
  simulateAgentZkAttestation,
  AgentZkAttestationInputs
} from '../calculator/agentZkAttestationModel';

export default function EmbedAgentZkAttestationSimulator() {
  const [dailyAgentStateTransitionsThousands, setDailyAgentStateTransitionsThousands] = useState<number>(50);
  const avgContextTokensPerTransition = 2048;
  const [circuitConstraintScale, setCircuitConstraintScale] = useState<number>(262144);
  const verifierNodeComputeCostUSDPerHour = 1.20;
  const provingHardwareAcceleration: 'cpu_multithread' | 'gpu_cuda_accelerated' = 'gpu_cuda_accelerated';

  const inputs: AgentZkAttestationInputs = useMemo(() => ({
    dailyAgentStateTransitionsThousands,
    avgContextTokensPerTransition,
    circuitConstraintScale,
    verifierNodeComputeCostUSDPerHour,
    provingHardwareAcceleration
  }), [
    dailyAgentStateTransitionsThousands,
    avgContextTokensPerTransition,
    circuitConstraintScale,
    verifierNodeComputeCostUSDPerHour,
    provingHardwareAcceleration
  ]);

  const results = useMemo(() => {
    return simulateAgentZkAttestation(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans selection:bg-cyan-500 selection:text-black">
      <Helmet>
        <title>Agent Zero-Knowledge Proof State Attestation Simulator Sandbox</title>
        <meta
          name="description"
          content="Embeddable interactive simulator calculating autonomous agent ZK-SNARK state attestation, proof size compression, verifier latency, and DPDP Act 2023 zero-disclosure compliance."
        />
        <link rel="canonical" href="https://elesium.online/embed/agent-zk-attestation-simulator" />
      </Helmet>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" />
            <h1 className="text-base sm:text-lg font-bold text-white">
              Agent ZK State Attestation Simulator
            </h1>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
            Interactive Embed
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Daily State Transitions</span>
              <span className="font-mono text-cyan-400 font-bold">{dailyAgentStateTransitionsThousands}k / day</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="10"
              value={dailyAgentStateTransitionsThousands}
              onChange={(e) => setDailyAgentStateTransitionsThousands(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">R1CS Constraints</span>
              <span className="font-mono text-cyan-400 font-bold">{circuitConstraintScale.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="65536"
              max="1048576"
              step="65536"
              value={circuitConstraintScale}
              onChange={(e) => setCircuitConstraintScale(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-500"
            />
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">PII Exposure</div>
            <div className="text-lg font-bold text-emerald-400 font-mono mt-1">
              {results.sovereignZkSnark.piiExposureRiskPct}%
            </div>
            <div className="text-[10px] text-slate-500">Zero-Knowledge</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">Proof Footprint</div>
            <div className="text-lg font-bold text-amber-400 font-mono mt-1">
              {results.sovereignZkSnark.proofPayloadSizeBytes} B
            </div>
            <div className="text-[10px] text-slate-500">{results.payloadCompressionFactor}x compression</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[11px] text-slate-400 uppercase">Verifier Latency</div>
            <div className="text-lg font-bold text-cyan-400 font-mono mt-1">
              {results.sovereignZkSnark.verifierLatencyMs} ms
            </div>
            <div className="text-[10px] text-slate-500">{results.verificationLatencyCutPct}% reduction</div>
          </div>
        </div>

        {/* Comparison Tier Mini-Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-xs">
          <div className="font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            Architectural Benchmark Summary
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Legacy Full State Logging:</span>
              <span className="font-mono text-rose-400">{(results.fullStateLog.proofPayloadSizeBytes / 1024).toFixed(0)} KB | {results.fullStateLog.verifierLatencyMs}ms | 100% PII Leakage</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Merkle Hash Rollup:</span>
              <span className="font-mono text-amber-400">{(results.merkleRollup.proofPayloadSizeBytes / 1024).toFixed(1)} KB | {results.merkleRollup.verifierLatencyMs}ms | 24.5% Dispute Leakage</span>
            </div>
            <div className="flex justify-between items-center py-1 text-cyan-300 font-medium">
              <span>Elesium Sovereign ZK (BN254):</span>
              <span className="font-mono text-emerald-400">{results.sovereignZkSnark.proofPayloadSizeBytes} bytes | {results.sovereignZkSnark.verifierLatencyMs}ms | 0.0% PII Leakage</span>
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
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            Elesium Sovereign AI Solutions
          </a>
        </div>
      </div>
    </div>
  );
}
