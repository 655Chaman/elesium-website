import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Lock,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Cpu,
  Layers,
  Server,
  HardDrive
} from 'lucide-react';
import {
  simulateAgentHomomorphicEnclave,
  AgentHomomorphicEnclaveInputs
} from '../calculator/agentHomomorphicEnclaveModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';

export default function EnterpriseAgentHomomorphicEnclaveSimulator() {
  // Inputs State
  const [monthlyInferenceQueriesMillions, setMonthlyInferenceQueriesMillions] = useState<number>(5);
  const [contextLengthTokens, setContextLengthTokens] = useState<number>(2048);
  const [enclaveHardwareType, setEnclaveHardwareType] = useState<'amd_sev_snp' | 'intel_tdx' | 'aws_nitro_tpm'>('amd_sev_snp');
  const [cloudHostHourlyRateUSD, setCloudHostHourlyRateUSD] = useState<number>(6.50);
  const [fheNoiseBudgetBits, setFheNoiseBudgetBits] = useState<number>(128);

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

  const embedCode = `<iframe src="https://elesium.online/embed/agent-homomorphic-enclave-simulator" width="100%" height="700" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Sovereign AI Architecture</a>
</div>`;

  const copyEmbedToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AUTONOMOUS AGENT HOMOMORPHIC ENCRYPTION & CONFIDENTIAL COMPUTING ENCLAVE MEMO
Workload Profile: ${inputs.monthlyInferenceQueriesMillions}M queries/mo | ${inputs.contextLengthTokens} Context Tokens | Hardware: ${inputs.enclaveHardwareType.toUpperCase()} | $${inputs.cloudHostHourlyRateUSD.toFixed(2)}/hr host

CRYPTOGRAPHIC PRIVACY & PERFORMANCE COMPARISON:
1. Public Cloud VM (Unencrypted Memory):
   - Mean Turnaround Latency: ${results.publicUnencrypted.meanInferenceLatencyMs} ms
   - Hypervisor Snooping Risk: ${results.publicUnencrypted.hypervisorSnoopingRiskPct}%
   - Annual Infrastructure Spend: $${results.publicUnencrypted.annualizedTotalCostUSD.toLocaleString()}
   - Compliance: ${results.publicUnencrypted.complianceStanding}
2. Pure Software Fully Homomorphic Encryption (FHE - CKKS/TFHE):
   - Mean Turnaround Latency: ${(results.softwareFhe.meanInferenceLatencyMs / 1000).toFixed(1)} seconds (${results.softwareFhe.latencyOverheadMultiplier}x slowdown)
   - Memory Footprint / Worker: ${(results.softwareFhe.memoryFootprintMB / 1024).toFixed(1)} GB (Ciphertext Bloat)
   - Annual Infrastructure Spend: $${results.softwareFhe.annualizedTotalCostUSD.toLocaleString()}
   - Compliance: ${results.softwareFhe.complianceStanding}
3. Elesium Sovereign Confidential Enclave (AMD SEV-SNP Hardware Memory Encryption):
   - Mean Turnaround Latency: ${results.sovereignEnclave.meanInferenceLatencyMs} ms (${results.latencyCutVsFhePct}% latency reduction vs FHE)
   - Memory Footprint / Worker: ${results.sovereignEnclave.memoryFootprintMB} MB (${results.memoryEfficiencyMultiplier}x memory efficiency vs FHE)
   - Hypervisor Snooping Risk: 0.0% (Physical AES-256 Memory Encryption Engine)
   - Net Annual Infrastructure Savings: $${results.annualSavingsUSD.toLocaleString()}
   - Compliance: ${results.sovereignEnclave.complianceStanding}

RECOMMENDATION: Deploy hardware-attested AMD SEV-SNP / AWS Nitro Enclaves to eliminate hypervisor snooping vulnerabilities while preserving sub-25ms real-time multi-agent execution.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const faqs = [
    {
      q: 'Why can traditional cloud providers inspect autonomous agent memory in plaintext?',
      a: 'In standard virtualization, the cloud hypervisor (KVM, Xen, Hyper-V) retains root access to host physical DRAM. When an AI agent executes inference, unencrypted prompt tokens, confidential customer records, and intermediate KV cache embeddings reside in plaintext within RAM, leaving them vulnerable to rogue cloud administrators, hypervisor compromise, and cold-boot hardware memory dumps.'
    },
    {
      q: 'Why is pure software Fully Homomorphic Encryption (FHE) impractical for real-time multi-agent systems?',
      a: 'Software FHE (such as CKKS or TFHE schemes) performs arithmetic directly on encrypted ring polynomials without decrypting them. While mathematically secure, evaluating non-linear activation functions (GELU, Softmax) requires homomorphic bootstrapping and noise refresh operations, resulting in a 2,000x+ compute penalty and pushing per-query inference latencies from 15 milliseconds to over 25 seconds.'
    },
    {
      q: 'How does Hardware-Attested Confidential Computing (AMD SEV-SNP) eliminate this bottleneck?',
      a: 'Confidential Computing utilizes an on-chip Memory Encryption Engine (MEE) to encrypt physical DRAM at wire speed using ephemeral AES-256-XTS keys generated inside the CPU security processor. Even if the hypervisor or host OS is completely compromised, it only reads encrypted noise. The CPU incurs only a ~1.28x latency overhead, delivering sub-25ms inference with absolute cryptographic isolation.'
    },
    {
      q: 'How does cryptographic remote attestation verify enclave integrity before key provisioning?',
      a: 'Before any sensitive model weights, API keys, or enterprise documents are decrypted inside the enclave, the host hardware generates a cryptographic attestation report signed by the CPU manufacturer’s root Certificate Authority (AMD/Intel/AWS). The client verifies the measurement hash (PCR values) to mathematically prove that only untampered, audited agent software is running.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Enterprise Autonomous Agent Homomorphic Encryption &amp; Confidential Enclave Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate and benchmark Confidential Computing enclaves (AMD SEV-SNP / AWS Nitro) versus pure software Fully Homomorphic Encryption (FHE) for autonomous enterprise AI agents. Eliminate hypervisor memory snooping with sub-20ms latencies."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-homomorphic-enclave-simulator" />
      </Helmet>

      {/* Top Breadcrumb */}
      <div className="max-w-7xl mx-auto mb-8 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-slate-400">
          <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/resources" className="hover:text-emerald-400 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-slate-200">Confidential Enclave &amp; FHE Simulator</span>
        </div>
        <button
          onClick={() => setIsEmbedOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-all"
        >
          <Code className="w-3.5 h-3.5 text-emerald-400" />
          Embed Simulator
        </button>
      </div>

      {/* Header Banner */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold tracking-wide uppercase mb-3">
          <Lock className="w-3.5 h-3.5" />
          Confidential Computing &amp; Memory Isolation Lab
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Agent Homomorphic Encryption &amp; Enclave Simulator
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed">
          Benchmark physical memory encryption overhead, ciphertext expansion, and hypervisor snooping vulnerabilities. Compare unencrypted cloud execution against software FHE (CKKS) and sovereign AMD SEV-SNP confidential enclaves for sub-20ms real-time multi-agent execution.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Column (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-emerald-400" />
              Confidential Isolation Parameters
            </h2>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/50">
              SEV-SNP / FHE
            </span>
          </div>

          <div className="space-y-6">
            {/* Monthly Inference Queries */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Monthly Inference Workload
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {monthlyInferenceQueriesMillions}M queries/month
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={monthlyInferenceQueriesMillions}
                onChange={(e) => setMonthlyInferenceQueriesMillions(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>1M queries</span>
                <span>25M queries</span>
                <span>50M queries</span>
              </div>
            </div>

            {/* Context Length */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Context Window Length
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {contextLengthTokens} tokens
                </span>
              </div>
              <input
                type="range"
                min="512"
                max="8192"
                step="256"
                value={contextLengthTokens}
                onChange={(e) => setContextLengthTokens(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>512 tokens</span>
                <span>4,096 tokens</span>
                <span>8,192 tokens</span>
              </div>
            </div>

            {/* Hardware Enclave Architecture */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Enclave Hardware Root of Trust
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setEnclaveHardwareType('amd_sev_snp')}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all text-center ${
                    enclaveHardwareType === 'amd_sev_snp'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  AMD SEV-SNP
                </button>
                <button
                  type="button"
                  onClick={() => setEnclaveHardwareType('intel_tdx')}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all text-center ${
                    enclaveHardwareType === 'intel_tdx'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  Intel TDX
                </button>
                <button
                  type="button"
                  onClick={() => setEnclaveHardwareType('aws_nitro_tpm')}
                  className={`py-2 px-2 rounded-xl border text-[11px] font-medium transition-all text-center ${
                    enclaveHardwareType === 'aws_nitro_tpm'
                      ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  AWS Nitro
                </button>
              </div>
            </div>

            {/* Host Hourly Compute Cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Cloud Host Compute Rate
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  ${cloudHostHourlyRateUSD.toFixed(2)} / node-hr
                </span>
              </div>
              <input
                type="range"
                min="3.50"
                max="16.00"
                step="0.50"
                value={cloudHostHourlyRateUSD}
                onChange={(e) => setCloudHostHourlyRateUSD(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>$3.50 (c6a.8xlarge)</span>
                <span>$8.00 (Standard)</span>
                <span>$16.00 (GPU Cluster)</span>
              </div>
            </div>

            {/* FHE Noise Budget */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  FHE Ciphertext Noise Budget
                </label>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {fheNoiseBudgetBits} bits
                </span>
              </div>
              <input
                type="range"
                min="64"
                max="256"
                step="32"
                value={fheNoiseBudgetBits}
                onChange={(e) => setFheNoiseBudgetBits(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>64 bits (Shallow)</span>
                <span>128 bits (Standard)</span>
                <span>256 bits (Deep FSM)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex gap-3">
              <button
                onClick={copyExecutiveMemo}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-all flex items-center justify-center gap-2"
              >
                {hasCopiedMemo ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    Memo Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-400" />
                    Copy Confidential Enclave Memo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results & Benchmarks Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Key Metric Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
                <Lock className="w-4 h-4" />
                Hypervisor Risk
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {results.sovereignEnclave.hypervisorSnoopingRiskPct.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Zero memory dump risk
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
                <Cpu className="w-4 h-4" />
                Turnaround Latency
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">
                {results.sovereignEnclave.meanInferenceLatencyMs}ms
              </div>
              <div className="text-xs text-slate-400 mt-1">
                {results.latencyCutVsFhePct}% faster than FHE
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase mb-1">
                <Layers className="w-4 h-4" />
                Memory Efficiency
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
                {results.memoryEfficiencyMultiplier}x
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Zero ciphertext bloat
              </div>
            </div>
          </div>

          {/* Detailed Architectural Comparison Cards */}
          <div className="space-y-4">
            {/* 1. Public Cloud VM (Unencrypted) */}
            <div className="bg-slate-900/60 border border-rose-900/40 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <h3 className="text-sm font-bold text-slate-200">
                    {results.publicUnencrypted.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-800/40">
                  {results.publicUnencrypted.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block">Query Latency</span>
                  <span className="font-semibold text-slate-300">
                    {results.publicUnencrypted.meanInferenceLatencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Snooping Risk</span>
                  <span className="font-semibold text-rose-400">
                    {results.publicUnencrypted.hypervisorSnoopingRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Worker Memory</span>
                  <span className="font-semibold text-slate-300">
                    {results.publicUnencrypted.memoryFootprintMB} MB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Spend</span>
                  <span className="font-semibold text-slate-300">
                    ${results.publicUnencrypted.annualizedTotalCostUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {results.publicUnencrypted.architecturalVerdict}
              </p>
            </div>

            {/* 2. Pure Software FHE */}
            <div className="bg-slate-900/60 border border-amber-900/40 rounded-2xl p-5 shadow-md">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <h3 className="text-sm font-bold text-slate-200">
                    {results.softwareFhe.name}
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-amber-950/60 text-amber-400 border border-amber-800/40">
                  {results.softwareFhe.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block">Query Latency</span>
                  <span className="font-semibold text-amber-400">
                    {(results.softwareFhe.meanInferenceLatencyMs / 1000).toFixed(1)} s
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Snooping Risk</span>
                  <span className="font-semibold text-emerald-400">
                    {results.softwareFhe.hypervisorSnoopingRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ciphertext Memory</span>
                  <span className="font-semibold text-amber-400">
                    {(results.softwareFhe.memoryFootprintMB / 1024).toFixed(1)} GB
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Annual Spend</span>
                  <span className="font-semibold text-amber-400">
                    ${results.softwareFhe.annualizedTotalCostUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {results.softwareFhe.architecturalVerdict}
              </p>
            </div>

            {/* 3. Sovereign Confidential Enclave */}
            <div className="bg-slate-900/90 border-2 border-emerald-500/60 rounded-2xl p-5 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-500 to-transparent w-32 h-1" />
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    {results.sovereignEnclave.name}
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  {results.sovereignEnclave.complianceStanding}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono mb-3 bg-slate-950/80 p-3 rounded-xl border border-emerald-900/40">
                <div>
                  <span className="text-slate-400 block">Query Latency</span>
                  <span className="font-bold text-cyan-400 text-sm">
                    {results.sovereignEnclave.meanInferenceLatencyMs} ms
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Snooping Risk</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {results.sovereignEnclave.hypervisorSnoopingRiskPct}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Worker Memory</span>
                  <span className="font-bold text-amber-400 text-sm">
                    {results.sovereignEnclave.memoryFootprintMB} MB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Annual Savings</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ${results.annualSavingsUSD.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {results.sovereignEnclave.architecturalVerdict}
              </p>
            </div>
          </div>

          {/* Audit CTA Box */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                Deploy Hardware-Attested Confidential Enclaves
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Elesium provisions audited AMD SEV-SNP and AWS Nitro Enclaves with remote TPM 2.0 attestation for mission-critical enterprise workloads.
              </p>
            </div>
            <ExpandableScreen>
              <ExpandableScreenTrigger className="px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap flex items-center gap-2 cursor-pointer">
                <span>Schedule Enclave Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </ExpandableScreenTrigger>
              <ExpandableScreenContent>
                <MandateApplicationForm />
              </ExpandableScreenContent>
            </ExpandableScreen>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-800">
        <h2 className="text-2xl font-bold text-white text-center mb-8">
          Frequently Asked Questions: Confidential Computing &amp; Agent Enclaves
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex justify-between items-center text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-400' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setIsEmbedOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Code className="w-5 h-5 text-emerald-400" />
              Embed This Simulator
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Copy and paste this responsive iframe into your technical whitepaper, research portal, or documentation page:
            </p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
              <code className="text-[11px] font-mono text-emerald-300 block break-all whitespace-pre-wrap">
                {embedCode}
              </code>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
              <button
                onClick={copyEmbedToClipboard}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                {hasCopiedEmbed ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-950" />
                    Copy Code
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
