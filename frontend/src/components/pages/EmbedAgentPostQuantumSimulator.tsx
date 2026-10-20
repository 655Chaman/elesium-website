import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulatePostQuantum,
  PostQuantumInputs
} from '../calculator/agentPostQuantumModel';
import { Binary } from 'lucide-react';

export default function EmbedAgentPostQuantumSimulator() {
  const [cryptographicSuite, setCryptographicSuite] = useState<'legacy_rsa_ecc' | 'hybrid_x25519_kyber768' | 'ml_kem_768_pure' | 'ml_kem_1024_military'>('ml_kem_768_pure');
  const [digitalSignatureScheme, setDigitalSignatureScheme] = useState<'ecdsa_p256' | 'ed25519' | 'ml_dsa_44' | 'ml_dsa_65' | 'ml_dsa_87'>('ml_dsa_65');
  const [dailyStateSnapshots] = useState<number>(10000);
  const [retrospectiveSecrecyHorizonYears, setRetrospectiveSecrecyHorizonYears] = useState<number>(10);
  const [quantumAdversaryArrivalYear, setQuantumAdversaryArrivalYear] = useState<number>(2031);

  const inputs: PostQuantumInputs = useMemo(() => ({
    cryptographicSuite,
    digitalSignatureScheme,
    dailyStateSnapshots,
    retrospectiveSecrecyHorizonYears,
    quantumAdversaryArrivalYear,
    currency: 'INR'
  }), [
    cryptographicSuite,
    digitalSignatureScheme,
    dailyStateSnapshots,
    retrospectiveSecrecyHorizonYears,
    quantumAdversaryArrivalYear
  ]);

  const results = useMemo(() => {
    return simulatePostQuantum(inputs);
  }, [inputs]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent Post-Quantum Cryptography &amp; ML-KEM Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-post-quantum-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <Binary className="w-4 h-4 text-cyan-400" />
              Agent Post-Quantum Cryptography &amp; ML-KEM Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              NIST FIPS 203 / 204 lattice cryptography and HNDL quantum threat modeler.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.nistSecurityLevel >= 3
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            NIST L{results.nistSecurityLevel}
          </span>
        </div>

        {/* Mini SVG Visualizer */}
        <div className="relative w-full aspect-[2/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2">
          <svg viewBox="0 -25 320 50" className="w-full h-full">
            <line x1="0" y1="0" x2="320" y2="0" stroke="#1e293b" strokeWidth="1" />
            <rect x="0" y="-12" width="320" height="24" fill="rgba(6, 182, 212, 0.05)" />

            {results.latticePoints.map((pt, idx) => {
              const x = idx * 10 + 5;
              const height = Math.abs(pt.errorValue) * 3.5;
              const y = pt.errorValue >= 0 ? -height : 0;
              return (
                <g key={idx}>
                  <rect
                    x={x - 2.5}
                    y={y}
                    width="5"
                    height={Math.max(1, height)}
                    fill={pt.isCorrectable ? '#10b981' : '#f43f5e'}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>
          <div className="absolute bottom-2 left-2 text-[9px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
            Lattice Ring: <span className="text-cyan-400">q=3329</span>
          </div>
        </div>

        {/* Dropdowns & Sliders */}
        <div className="space-y-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Key Encapsulation (KEM)</label>
              <select
                value={cryptographicSuite}
                onChange={e => setCryptographicSuite(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-cyan-300"
              >
                <option value="legacy_rsa_ecc">Legacy RSA/ECC</option>
                <option value="hybrid_x25519_kyber768">Hybrid Kyber-768</option>
                <option value="ml_kem_768_pure">ML-KEM-768 (L3)</option>
                <option value="ml_kem_1024_military">ML-KEM-1024 (L5)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Digital Signature (DSA)</label>
              <select
                value={digitalSignatureScheme}
                onChange={e => setDigitalSignatureScheme(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-cyan-300"
              >
                <option value="ecdsa_p256">Legacy ECDSA</option>
                <option value="ed25519">Legacy Ed25519</option>
                <option value="ml_dsa_44">ML-DSA-44 (L2)</option>
                <option value="ml_dsa_65">ML-DSA-65 (L3)</option>
                <option value="ml_dsa_87">ML-DSA-87 (L5)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Legal Secrecy Horizon:</span>
              <span className="font-mono text-cyan-400 font-bold">{retrospectiveSecrecyHorizonYears} Years</span>
            </div>
            <input
              type="range"
              min="3"
              max="20"
              value={retrospectiveSecrecyHorizonYears}
              onChange={e => setRetrospectiveSecrecyHorizonYears(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300">Quantum Arrival:</span>
              <span className="font-mono text-rose-400 font-bold">Year {quantumAdversaryArrivalYear}</span>
            </div>
            <input
              type="range"
              min="2028"
              max="2036"
              value={quantumAdversaryArrivalYear}
              onChange={e => setQuantumAdversaryArrivalYear(Number(e.target.value))}
              className="w-full accent-rose-500 h-1 bg-slate-800 rounded"
            />
          </div>
        </div>

        {/* Results Matrix */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">HNDL Risk</span>
            <span className={`text-sm font-bold font-mono ${
              results.quantumBreachVulnerabilityRiskPercent < 1 ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {results.quantumBreachVulnerabilityRiskPercent}%
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">Latency</span>
            <span className="text-sm font-bold font-mono text-slate-200">
              {results.nttPolynomialLatencyMs} ms
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block">DPDP Score</span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {results.statutoryComplianceScore}/100
            </span>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-2 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] text-slate-500 hover:text-cyan-400 transition"
          >
            Powered by Elesium Sovereign Enterprise AI
          </a>
        </div>
      </div>
    </div>
  );
}
