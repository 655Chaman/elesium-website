import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  ShieldCheck
} from 'lucide-react';
import {
  calculateGpuFinOps,
  formatFinOpsCurrency,
  HYPERSCALER_PRICING_SPECS,
  GpuHardwareKey,
  ModelTierKey,
  QuantizationPrecision,
  Currency
} from '../calculator/gpuCostCalculatorModel';

export default function EmbedGpuCostCalculator() {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [monthlyTokenVolumeMillions, setMonthlyTokenVolumeMillions] = useState<number>(250);
  const [averageContextLengthTokens] = useState<number>(4096);
  const [peakConcurrentRequests] = useState<number>(50);
  const [modelTier, setModelTier] = useState<ModelTierKey>('llama_70b');
  const [quantization, setQuantization] = useState<QuantizationPrecision>('fp8');
  const [hardware, setHardware] = useState<GpuHardwareKey>('h100_sxm5');
  const [hyperscalerComparison] = useState('claude_35_sonnet' as const);
  const [amortizationMonths] = useState<number>(36);

  const results = useMemo(() => {
    return calculateGpuFinOps({
      monthlyTokenVolumeMillions,
      averageContextLengthTokens,
      peakConcurrentRequests,
      modelTier,
      quantization,
      hardware,
      hyperscalerComparison,
      currency,
      amortizationMonths
    });
  }, [
    monthlyTokenVolumeMillions,
    averageContextLengthTokens,
    peakConcurrentRequests,
    modelTier,
    quantization,
    hardware,
    hyperscalerComparison,
    currency,
    amortizationMonths
  ]);

  const activeHyperscaler = HYPERSCALER_PRICING_SPECS[hyperscalerComparison];

  return (
    <>
      <Helmet>
        <title>Enterprise GPU FinOps & Throughput Calculator Widget | Elesium</title>
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/embed/gpu-cost-calculator" />
      </Helmet>

      <div className="bg-slate-950 text-slate-100 p-4 sm:p-6 font-sans antialiased min-h-[720px] flex flex-col justify-between border border-slate-800 rounded-2xl shadow-2xl">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-sm tracking-tight text-white">
                Enterprise GPU FinOps &amp; Throughput Sizer
              </span>
            </div>
            
            {/* Currency toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-md border border-slate-800 text-[10px]">
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'USD' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2 py-0.5 rounded font-medium transition-colors ${
                  currency === 'INR' ? 'bg-sky-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                INR (₹)
              </button>
            </div>
          </div>

          {/* Interactive Controls Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            
            {/* Model Selector */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Model Class</label>
              <select
                value={modelTier}
                onChange={(e) => setModelTier(e.target.value as ModelTierKey)}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded p-1.5 focus:border-sky-500 font-mono"
              >
                <option value="llama_8b">Llama-3.1 8B</option>
                <option value="mistral_nemo_12b">Mistral NeMo 12B</option>
                <option value="qwen_32b">Qwen 2.5 32B</option>
                <option value="llama_70b">Llama-3.3 70B</option>
                <option value="llama_405b">Llama-3.1 405B</option>
              </select>
            </div>

            {/* Precision Selector */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Precision</label>
              <select
                value={quantization}
                onChange={(e) => setQuantization(e.target.value as QuantizationPrecision)}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded p-1.5 focus:border-sky-500 font-mono"
              >
                <option value="fp8">FP8 (Hopper Native)</option>
                <option value="awq_int4">AWQ INT4 (Compressed)</option>
                <option value="fp16">FP16 / BF16 (Baseline)</option>
              </select>
            </div>

            {/* Hardware Cluster */}
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <label className="block text-[10px] font-mono text-slate-400 uppercase mb-1">Cluster Hardware</label>
              <select
                value={hardware}
                onChange={(e) => setHardware(e.target.value as GpuHardwareKey)}
                className="w-full bg-slate-950 text-xs text-white border border-slate-800 rounded p-1.5 focus:border-sky-500 font-mono"
              >
                <option value="h100_sxm5">NVIDIA H100 80GB SXM5</option>
                <option value="h200_sxm5">NVIDIA H200 141GB SXM5</option>
                <option value="a100_sxm4">NVIDIA A100 80GB SXM4</option>
                <option value="l40s_pcie">NVIDIA L40S 48GB PCIe</option>
                <option value="on_prem_h100_cluster">On-Prem 8x H100 Node</option>
              </select>
            </div>

          </div>

          {/* Token Volume Slider */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 mb-4">
            <div className="flex justify-between items-center text-xs font-mono mb-1.5">
              <span className="text-slate-300">Monthly Token Volume:</span>
              <span className="text-sky-400 font-bold bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                {monthlyTokenVolumeMillions}M tokens / month
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={monthlyTokenVolumeMillions}
              onChange={(e) => setMonthlyTokenVolumeMillions(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>10M tokens</span>
              <span>Comparing against: {activeHyperscaler.name}</span>
              <span>1,000M tokens</span>
            </div>
          </div>

          {/* Core Results Banner */}
          <div className="bg-gradient-to-r from-sky-950/70 via-slate-900 to-slate-900 border border-sky-500/60 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-400 mb-0.5">Estimated Net Monthly Savings</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                  {formatFinOpsCurrency(results.netMonthlySavingsUSD, currency)}
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  3-Year Savings: <span className="text-emerald-300 font-bold">{formatFinOpsCurrency(results.threeYearSavingsUSD, currency)}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-2.5 py-1 rounded bg-emerald-950 border border-emerald-700 text-emerald-400 font-mono font-bold text-xs">
                  +{results.savingsPercentage}% Cost Cut
                </span>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Breakeven: {results.breakevenMonthlyTokenThresholdMillions}M/mo
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono mb-4">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Self-Hosted Cost</div>
              <div className="text-sm font-bold text-white mt-0.5">{formatFinOpsCurrency(results.monthlySelfHostedCostUSD, currency)}</div>
              <div className="text-[9px] text-slate-400">{results.recommendedGpuCount}x GPUs</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-rose-950/60">
              <div className="text-[10px] text-slate-400">Hyperscaler Cost</div>
              <div className="text-sm font-bold text-rose-400 mt-0.5">{formatFinOpsCurrency(results.monthlyHyperscalerCostUSD, currency)}</div>
              <div className="text-[9px] text-slate-400">{activeHyperscaler.provider}</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Cluster Throughput</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">{results.sustainedConcurrentThroughputTokensPerSec.toLocaleString()} t/s</div>
              <div className="text-[9px] text-slate-400">PagedAttention</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-[10px] text-slate-400">Data Sovereignty</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{results.dataSovereigntyScore}/100</div>
              <div className="text-[9px] text-slate-400">DPDP Air-Gapped</div>
            </div>
          </div>

        </div>

        {/* Footer & Watermark */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Private Sovereign VPC Deployment</span>
          </div>

          <div>
            Calculated via{' '}
            <a
              href="https://elesium.online/solutions"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 underline font-medium"
            >
              Elesium Enterprise AI
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
