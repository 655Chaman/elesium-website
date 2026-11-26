import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateSmartContractAudit,
  SmartContractInputs,
  FormalVerificationEngine,
  ZkProofSystem,
  MultiAgentAuditTopology
} from '../calculator/agentSmartContractModel';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentSmartContractSimulator() {
  const [contractLinesOfCode, setContractLinesOfCode] = useState<number>(3200);
  const [formalVerificationEngine, setFormalVerificationEngine] = useState<FormalVerificationEngine>('certora_prover');
  const [zkProofSystem, setZkProofSystem] = useState<ZkProofSystem>('groth16_snark');
  const multiAgentAuditTopology: MultiAgentAuditTopology = 'byzantine_trio_langgraph';
  const totalValueLockedMillions = 45;

  const inputs: SmartContractInputs = useMemo(() => ({
    contractLinesOfCode,
    formalVerificationEngine,
    zkProofSystem,
    vulnerabilityAttackSurface: 'reentrancy_flashloan',
    multiAgentAuditTopology,
    totalValueLockedMillions,
    currency: 'USD'
  }), [
    contractLinesOfCode,
    formalVerificationEngine,
    zkProofSystem
  ]);

  const results = useMemo(() => calculateSmartContractAudit(inputs), [inputs]);

  return (
    <div className="bg-black text-neutral-100 p-5 rounded-xl border border-neutral-800 max-w-xl mx-auto font-sans shadow-2xl">
      <Helmet>
        <title>Embed: Web3 Smart Contract Formal Verification Simulator | Elesium</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-smart-contract-formal-verification-simulator" />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/15 text-neutral-200">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-tight">
              Web3 Formal Verification Simulator
            </h2>
            <p className="text-[10px] text-neutral-400">SMT Theorem Prover & ZK-Audit Engine</p>
          </div>
        </div>
        <a
          href="https://elesium.online/tools/enterprise-agent-smart-contract-formal-verification-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-neutral-200 hover:text-white transition"
        >
          <span>Full Tool</span>
          <ArrowUpRight className="w-3 h-3" />
        </a>
      </div>

      {/* Controls */}
      <div className="space-y-3.5 mb-5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-neutral-300">Contract Lines of Code (LOC)</span>
            <span className="font-mono text-white font-bold">{contractLinesOfCode.toLocaleString()} LOC</span>
          </div>
          <input
            type="range"
            min="200"
            max="15000"
            step="100"
            value={contractLinesOfCode}
            onChange={(e) => setContractLinesOfCode(Number(e.target.value))}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-neutral-400 text-[10px] block mb-1">Formal Engine</label>
            <select
              value={formalVerificationEngine}
              onChange={(e) => setFormalVerificationEngine(e.target.value as FormalVerificationEngine)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-200"
            >
              <option value="certora_prover">Certora Prover</option>
              <option value="halmos_symbolic">Halmos Symbolic</option>
              <option value="slither_static">Slither Static</option>
              <option value="coq_interactive">Coq Interactive</option>
            </select>
          </div>
          <div>
            <label className="text-neutral-400 text-[10px] block mb-1">ZK Proof System</label>
            <select
              value={zkProofSystem}
              onChange={(e) => setZkProofSystem(e.target.value as ZkProofSystem)}
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-2 py-1.5 text-xs text-neutral-200"
            >
              <option value="groth16_snark">Groth16 SNARK</option>
              <option value="plonk_halo2">PLONK / Halo2</option>
              <option value="stark_fri">STARK / FRI</option>
              <option value="bulletproofs">Bulletproofs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outputs Cards */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-neutral-400">Verification Latency</div>
          <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
            {results.verificationLatencySeconds}s
          </div>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-neutral-400">Invariant Coverage</div>
          <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
            {results.invariantCoveragePct}%
          </div>
        </div>
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-lg p-2.5 text-center">
          <div className="text-[10px] text-neutral-400">Exploit Block</div>
          <div className="text-sm sm:text-base font-bold font-mono text-white mt-0.5">
            {results.exploitInterceptionRatePct}%
          </div>
        </div>
      </div>

      {/* Bottom CTA / Watermark */}
      <div className="pt-2 text-center border-t border-neutral-800/80">
        <a
          href="https://elesium.online/tools/enterprise-agent-smart-contract-formal-verification-simulator"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-neutral-400 hover:text-white transition"
        >
          Calculated via <span className="text-white font-semibold underline">Elesium Sovereign Web3 Security</span>
        </a>
      </div>
    </div>
  );
}
