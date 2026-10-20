import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateAgentHsm,
  HsmInputs
} from '../calculator/agentHsmModel';
import { Key, Cpu, Activity, ShieldCheck } from 'lucide-react';

export default function EmbedAgentHsmSimulator() {
  const [hsmSecurityLevel, setHsmSecurityLevel] = useState<'fips_140_3_level_4' | 'fips_140_2_level_3' | 'common_criteria_eal6_plus' | 'tpm_2_0_enclave'>('fips_140_3_level_4');
  const [cryptographicAlgorithm, setCryptographicAlgorithm] = useState<'aes_256_gcm' | 'rsa_4096_pss' | 'ecdsa_secp256k1' | 'ml_kem_768_post_quantum'>('ml_kem_768_post_quantum');
  const [keyDerivationFunction, setKeyDerivationFunction] = useState<'hkdf_sha512' | 'argon2id_hardened' | 'pbkdf2_sha256'>('hkdf_sha512');
  const [hardwareBusLatencyMicroseconds, setHardwareBusLatencyMicroseconds] = useState<number>(45);
  const [dailyKeyDerivationVolumeThousands, setDailyKeyDerivationVolumeThousands] = useState<number>(750);

  const inputs: HsmInputs = useMemo(() => ({
    hsmSecurityLevel,
    cryptographicAlgorithm,
    keyDerivationFunction,
    hardwareBusLatencyMicroseconds,
    dailyKeyDerivationVolumeThousands,
    currency: 'INR'
  }), [
    hsmSecurityLevel,
    cryptographicAlgorithm,
    keyDerivationFunction,
    hardwareBusLatencyMicroseconds,
    dailyKeyDerivationVolumeThousands
  ]);

  const results = useMemo(() => {
    return simulateAgentHsm(inputs);
  }, [inputs]);

  // Generate SVG path for bus latency & tamper mesh oscilloscope
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { busPath: '', tamperPath: '', rawPoints: [] };

    const maxBus = 300;
    const busPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.busLatencyUs / maxBus) * (height * 0.7) - 8;
      return [x, y];
    });

    const tamperPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const delta = pt.tamperMeshVoltageMv - 3300;
      const y = (height / 2) - (delta * 1.8);
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const busD = busPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const tamperD = tamperPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { busPath: busD, tamperPath: tamperD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Agent HSM PKCS#11 Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-hsm-pkcs11-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-base font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              Agent HSM PKCS#11 Air-Gapped Simulator
            </h1>
            <p className="text-[11px] text-slate-400">
              FIPS 140-3 Level 4 key derivation, tokenization, &amp; zeroization telemetry.
            </p>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
            results.statusClassification === 'AIR_GAPPED_SOVEREIGN_VAULT'
              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
              : results.statusClassification === 'FIPS_HARDENED_COMPLIANT'
              ? 'bg-cyan-950 text-cyan-400 border-cyan-800'
              : 'bg-rose-950 text-rose-400 border-rose-800'
          }`}>
            {results.statusClassification.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Mini Oscilloscope SVG */}
        <div className="relative w-full aspect-[3/1] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
            <span className="text-cyan-400 font-bold flex items-center gap-1">
              <Activity className="w-3 h-3" /> PKCS#11 Bus Latency: {results.keyDerivationLatencyMicroseconds} µs
            </span>
            <span className="text-rose-400 font-bold">
              Tamper Mesh: 3.3V Active
            </span>
          </div>

          <svg viewBox="0 0 340 90" className="w-full h-16">
            {/* Grid */}
            {[20, 45, 70].map(y => (
              <line key={`grid-${y}`} x1="0" y1={y} x2="340" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
            ))}
            {/* Bus latency trace */}
            <path
              d={svgData.busPath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Tamper mesh trace */}
            <path
              d={svgData.tamperPath}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>

          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
            <span>DPA Attenuation: {results.sideChannelAttackResistanceDb} dB</span>
            <span className="text-emerald-400">Tamper Life: {results.physicalTamperDetectionResistanceYears} yrs</span>
            <span>Compliance: {results.complianceScorePercent}%</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Tokenization Throughput</span>
              <Cpu className="w-3 h-3 text-emerald-400" />
            </div>
            <div className="text-base font-extrabold font-mono text-emerald-400 mt-0.5">
              {results.tokenizationThroughputOpsPerSec.toLocaleString()} <span className="text-[10px] text-emerald-300">ops/s</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5">
            <div className="text-[10px] text-slate-400 flex items-center justify-between">
              <span>Derivation Latency</span>
              <Key className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-base font-extrabold font-mono text-cyan-400 mt-0.5">
              {results.keyDerivationLatencyMicroseconds} <span className="text-[10px] text-cyan-300">µs</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-2.5 bg-slate-900/40 border border-slate-800/60 rounded-xl p-3 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">HSM Security Profile:</label>
              <select
                value={hsmSecurityLevel}
                onChange={e => setHsmSecurityLevel(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-cyan-300"
              >
                <option value="fips_140_3_level_4">FIPS 140-3 L4</option>
                <option value="common_criteria_eal6_plus">CC EAL6+</option>
                <option value="fips_140_2_level_3">FIPS 140-2 L3</option>
                <option value="tpm_2_0_enclave">TPM 2.0 Enclave</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Crypto Algorithm:</label>
              <select
                value={cryptographicAlgorithm}
                onChange={e => setCryptographicAlgorithm(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-cyan-300"
              >
                <option value="ml_kem_768_post_quantum">ML-KEM-768 (PQ)</option>
                <option value="aes_256_gcm">AES-256-GCM</option>
                <option value="ecdsa_secp256k1">ECDSA secp256k1</option>
                <option value="rsa_4096_pss">RSA-4096-PSS</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Hardware Bus Latency:</span>
              <span className="font-mono text-cyan-400 font-bold">{hardwareBusLatencyMicroseconds} µs</span>
            </div>
            <input
              type="range"
              min="15"
              max="250"
              step="5"
              value={hardwareBusLatencyMicroseconds}
              onChange={e => setHardwareBusLatencyMicroseconds(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Key Derivation Function:</span>
              <span className="font-mono text-emerald-400 font-bold">{keyDerivationFunction.replace(/_/g, ' ').toUpperCase()}</span>
            </div>
            <select
              value={keyDerivationFunction}
              onChange={e => setKeyDerivationFunction(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[11px] font-mono text-emerald-300"
            >
              <option value="hkdf_sha512">HKDF-SHA512 (Extract-and-Expand)</option>
              <option value="argon2id_hardened">Argon2id (Memory-Hardened)</option>
              <option value="pbkdf2_sha256">PBKDF2-SHA256 (NIST Standard)</option>
            </select>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-300">
              <span>Daily Agent Operations:</span>
              <span className="font-mono text-cyan-400 font-bold">{dailyKeyDerivationVolumeThousands.toLocaleString()}k ops/day</span>
            </div>
            <input
              type="range"
              min="10"
              max="5000"
              step="10"
              value={dailyKeyDerivationVolumeThousands}
              onChange={e => setDailyKeyDerivationVolumeThousands(Number(e.target.value))}
              className="w-full accent-cyan-500 h-1 bg-slate-800 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Footer Attribution Link */}
        <div className="pt-2 text-right">
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-slate-500 hover:text-cyan-400 transition"
          >
            Engineered by <span className="text-cyan-400 font-medium underline">Elesium Sovereign AI Systems</span>
          </a>
        </div>
      </div>
    </div>
  );
}
