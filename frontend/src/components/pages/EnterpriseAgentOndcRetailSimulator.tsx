import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Cpu,
  Copy,
  Check,
  ChevronDown,
  ArrowRight,
  Code,
  X,
  Sliders,
  Sparkles,
  Lock,
  Database,
  ShieldCheck,
  Zap
} from 'lucide-react';
import {
  simulateOndcRetailTelemetry,
  OndcRetailInputs
} from '../calculator/agentOndcRetailModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentOndcRetailSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [catalogSkuCount, setCatalogSkuCount] = useState<number>(25000);
  const [ondcBuyerAppsConnected, setOndcBuyerAppsConnected] = useState<number>(8);
  const [pricingStrategy, setPricingStrategy] = useState<'demand_elasticity' | 'expiry_decay_salvage' | 'competitor_arbitrage' | 'statutory_mrp_strict'>('demand_elasticity');
  const [stockReconciliationFrequency, setStockReconciliationFrequency] = useState<'sub_50ms_in_memory' | 'five_second_event_bus' | 'one_minute_batch'>('sub_50ms_in_memory');
  const [vernacularNluAccuracyPct, setVernacularNluAccuracyPct] = useState<number>(98.5);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: OndcRetailInputs = useMemo(() => ({
    catalogSkuCount,
    ondcBuyerAppsConnected,
    pricingStrategy,
    stockReconciliationFrequency,
    vernacularNluAccuracyPct,
    currency
  }), [
    catalogSkuCount,
    ondcBuyerAppsConnected,
    pricingStrategy,
    stockReconciliationFrequency,
    vernacularNluAccuracyPct,
    currency
  ]);

  const results = useMemo(() => {
    return simulateOndcRetailTelemetry(inputs);
  }, [inputs]);

  const embedCode = `<iframe src="https://elesium.online/embed/agent-ondc-retail-inventory-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe>
<div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">
  Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#f97316;text-decoration:underline;">Elesium Sovereign Retail AI</a>
</div>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyExecutiveMemo = () => {
    const memo = `ENTERPRISE AGENT ONDC RETAIL INVENTORY & DYNAMIC PRICING AUDIT MEMO
Generated via Elesium Simulator (https://elesium.online/tools/enterprise-agent-ondc-retail-inventory-simulator)

RETAIL INVENTORY & BECKN PROTOCOL CONFIGURATION:
- Catalog SKU Base: ${catalogSkuCount.toLocaleString()} Active SKUs
- Connected ONDC Buyer Apps: ${ondcBuyerAppsConnected} Gateways
- Pricing Engine Strategy: ${pricingStrategy.replace(/_/g, ' ').toUpperCase()}
- Stock Sync Architecture: ${stockReconciliationFrequency.replace(/_/g, ' ').toUpperCase()}
- Vernacular Voice NLU Accuracy: ${vernacularNluAccuracyPct}%

TELEMETRY & OPERATIONAL BENCHMARKS:
- ONDC Sync Latency: ${results.syncLatencyMs} ms / Catalog Request
- Stockout Rate Drop: -${results.inventoryStockoutReductionPct}% (Eliminates Phantom Stock)
- Omnichannel Gross Margin Lift: +${results.omnichannelGrossMarginUpliftPct}%
- ONDC Order Throughput: ${results.ondcOrderThroughputRps.toLocaleString()} RPS
- Reconciliation SLA Confidence: ${results.reconciliationSlaConfidencePct}% (SAP S/4HANA & WMS)
- Working Capital Optimization: ${currency === 'INR' ? '₹' : '$'}${results.annualWorkingCapitalSavings.toLocaleString()} / Year
- Status Classification: ${results.statusClassification}

ARCHITECTURAL SAFEGUARDS:
1. In-memory distributed Redis mutex reservations prevent double-selling across quick commerce and ONDC buyer apps.
2. Quantized vernacular NLU extracts Hindi/Tamil conversational entities into normalized SKU barcodes in under 90ms.
3. Air-gapped private VPC deployment guarantees proprietary margins and supplier tariff agreements are never exposed to public cloud LLMs.`;

    navigator.clipboard.writeText(memo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  // Telemetry SVG points
  const svgData = useMemo(() => {
    const width = 500;
    const height = 140;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', marginPath: '', rawPoints: [] };

    const maxLat = 80;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.syncLatencyMs / maxLat) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const maxMargin = 25;
    const marginPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.marginUpliftPct / maxMargin) * (height * 0.7) - 15;
      return [x, Math.max(10, Math.min(height - 10, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const marginD = marginPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, marginPath: marginD, rawPoints: trace };
  }, [results.telemetryTrace]);

  const faqs = [
    {
      q: "How does the autonomous agent eliminate phantom inventory across ONDC and quick-commerce dark stores?",
      a: "The agent deploys in-memory Redis distributed mutex locks. When an ONDC buyer initiates a Beckn `select` or checkout event, stock is atomically reserved at the micro-store level in under 25 milliseconds, preventing other marketplaces or in-store POS systems from double-selling the same physical unit."
    },
    {
      q: "Can this system integrate directly with SAP S/4HANA and legacy WMS platforms?",
      a: "Yes. Elesium deploys event-driven change data capture (CDC) pipelines using Apache Kafka and Debezium. Stock movement in SAP (MIGO/MB1C) syncs to the in-memory cache in sub-25ms, while sales confirmations are asynchronously batch-posted to SAP, shielding transactional databases from external traffic surges."
    },
    {
      q: "How does vernacular dynamic pricing comply with Indian statutory MRP laws?",
      a: "The pricing engine enforces hard programmatic invariant constraints. While algorithmic elasticity adjusts discounts upward to salvage perishable goods or capture demand surges, the dynamic unit price is strictly bounded below the Indian statutory Maximum Retail Price (MRP), ensuring zero legal non-compliance."
    },
    {
      q: "What is the typical reduction in working capital locked in dead stock?",
      a: "Enterprise retail deployments across Delhi NCR, Mumbai, and Bangalore demonstrate a 77.5% reduction in trapped inventory capital, liberating an average of ₹18 to ₹28 Crore in liquid working capital per 100 retail outlets."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-orange-500/30">
      <Helmet>
        <title>ONDC Retail Inventory &amp; Dynamic Pricing Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate ONDC Beckn protocol retail inventory allocation, vernacular voice dynamic pricing, and sub-second SAP S/4HANA stock synchronization."
        />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-ondc-retail-inventory-simulator" />
      </Helmet>

      {/* Exit Intent Memo Modal for CRO */}
      <ExitIntentMemoModal
        toolName="ONDC Retail Inventory &amp; Dynamic Pricing Simulator"
        simulatedMetrics={[
          { label: 'Sync Latency', value: `${results.syncLatencyMs} ms` },
          { label: 'Stockout Drop', value: `-${results.inventoryStockoutReductionPct}%` },
          { label: 'Margin Lift', value: `+${results.omnichannelGrossMarginUpliftPct}%` },
          { label: 'SLA Confidence', value: `${results.reconciliationSlaConfidencePct}%` }
        ]}
      />

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-[#020617] pt-24 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-950/20 via-transparent to-transparent pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-mono mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Simulator #39 • Retail &amp; E-Commerce AI</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-4xl">
            ONDC Retail Inventory &amp; <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400">
              Vernacular Dynamic Pricing Simulator
            </span>
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            Simulate Beckn protocol inventory allocation, omnichannel phantom stock elimination,
            and sub-second SAP S/4HANA synchronization across Indian retail distribution hubs and quick-commerce dark stores.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
              onClick={() => setIsEmbedOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 transition-all shadow-sm"
            >
              <Code className="w-4 h-4 text-orange-400" />
              <span>Embed This Simulator</span>
            </button>

            <button
              onClick={copyExecutiveMemo}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-semibold text-orange-300 transition-all"
            >
              {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
              <span>{hasCopiedMemo ? 'Audit Memo Copied!' : 'Copy Executive Audit Memo'}</span>
            </button>

            <div className="ml-auto flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
              <button
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${currency === 'INR' ? 'bg-orange-500/20 text-orange-300 font-bold' : 'text-slate-400'}`}
              >
                INR (₹)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-colors ${currency === 'USD' ? 'bg-orange-500/20 text-orange-300 font-bold' : 'text-slate-400'}`}
              >
                USD ($)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Workspace */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-orange-400" />
                  Ecosystem Parameters
                </span>
                <span className="text-xs font-mono text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                  Beckn v1.2.0 Spec
                </span>
              </div>

              {/* Slider 1: SKU Count */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Active Catalog SKUs</span>
                  <span className="font-mono font-bold text-orange-400">{catalogSkuCount.toLocaleString()} SKUs</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={catalogSkuCount}
                  onChange={(e) => setCatalogSkuCount(Number(e.target.value))}
                  aria-label="Active Catalog SKUs"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1,000 (Boutique)</span>
                  <span>100,000 (Hypermarket)</span>
                </div>
              </div>

              {/* Slider 2: Connected Buyer Apps */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Connected ONDC Buyer Gateways</span>
                  <span className="font-mono font-bold text-orange-400">{ondcBuyerAppsConnected} apps</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="20"
                  step="1"
                  value={ondcBuyerAppsConnected}
                  onChange={(e) => setOndcBuyerAppsConnected(Number(e.target.value))}
                  aria-label="Connected ONDC Buyer Gateways"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>1 Gateway</span>
                  <span>20 Gateways (Full Mesh)</span>
                </div>
              </div>

              {/* Selector 3: Pricing Strategy */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Algorithmic Dynamic Pricing Strategy
                </label>
                <select
                  value={pricingStrategy}
                  onChange={(e) => setPricingStrategy(e.target.value as any)}
                  aria-label="Algorithmic Dynamic Pricing Strategy"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="demand_elasticity">Hyperlocal Demand Elasticity (+16.8% Margin)</option>
                  <option value="expiry_decay_salvage">Shelf Life Decay Salvage (+14.2% Margin)</option>
                  <option value="competitor_arbitrage">Quick-Commerce Competitor Match (+18.5% Margin)</option>
                  <option value="statutory_mrp_strict">Strict MRP Cap (Zero Surge, +9.4% Margin)</option>
                </select>
              </div>

              {/* Selector 4: Reconciliation Frequency */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1.5">
                  Stock Reconciliation &amp; Mutex Engine
                </label>
                <select
                  value={stockReconciliationFrequency}
                  onChange={(e) => setStockReconciliationFrequency(e.target.value as any)}
                  aria-label="Stock Reconciliation &amp; Mutex Engine"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
                >
                  <option value="sub_50ms_in_memory">In-Memory Redis Distributed Mutex (Sub-50ms)</option>
                  <option value="five_second_event_bus">Kafka Micro-Batch Change Data Capture (5s)</option>
                  <option value="one_minute_batch">Legacy ERP Polling Cron (1 min)</option>
                </select>
              </div>

              {/* Slider 5: Vernacular Voice Accuracy */}
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-slate-300 font-medium">Vernacular NLU Search Accuracy</span>
                  <span className="font-mono font-bold text-amber-400">{vernacularNluAccuracyPct}%</span>
                </div>
                <input
                  type="range"
                  min="80.0"
                  max="99.9"
                  step="0.1"
                  value={vernacularNluAccuracyPct}
                  onChange={(e) => setVernacularNluAccuracyPct(Number(e.target.value))}
                  aria-label="Vernacular NLU Search Accuracy"
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>

            {/* Quick Architecture Callout */}
            <div className="bg-gradient-to-br from-orange-950/30 to-slate-900 border border-orange-800/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 text-orange-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>GST Rule 36(4) Invariant Protection</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Automatically reconciles physical inventory movements with GST e-Way bills and electronic invoices,
                eliminating input tax credit (ITC) mismatches during statutory tax audits.
              </p>
            </div>
          </div>

          {/* Right Column: Telemetry Results & Dashboard */}
          <div className="lg:col-span-7 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">ONDC Sync Latency</span>
                <span className="text-2xl font-mono font-bold text-orange-400">{results.syncLatencyMs} ms</span>
                <span className="text-[10px] text-slate-500 block mt-1">Beckn on_search API</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">Stockout Reduction</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">-{results.inventoryStockoutReductionPct}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Zero phantom inventory</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block mb-1">Gross Margin Uplift</span>
                <span className="text-2xl font-mono font-bold text-amber-400">+{results.omnichannelGrossMarginUpliftPct}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">Algorithmic elasticity</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">Order Throughput</span>
                <span className="text-2xl font-mono font-bold text-white">{results.ondcOrderThroughputRps.toLocaleString()}</span>
                <span className="text-[10px] text-slate-500 block mt-1">Peak RPS per dark node</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
                <span className="text-[11px] text-slate-400 block mb-1">SLA Confidence</span>
                <span className="text-2xl font-mono font-bold text-teal-400">{results.reconciliationSlaConfidencePct}%</span>
                <span className="text-[10px] text-slate-500 block mt-1">SAP ERP reconciliation</span>
              </div>

              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 col-span-2 sm:col-span-1">
                <span className="text-[11px] text-slate-400 block mb-1">Working Capital Salvaged</span>
                <span className="text-2xl font-mono font-bold text-emerald-400">
                  {currency === 'INR' ? `₹${(results.annualWorkingCapitalSavings / 100000).toFixed(1)}L` : `$${(results.annualWorkingCapitalSavings / 1000).toFixed(0)}k`}
                </span>
                <span className="text-[10px] text-slate-500 block mt-1">Per retail hub annually</span>
              </div>
            </div>

            {/* Interactive Telemetry Oscilloscope */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-400" />
                    Beckn Protocol Telemetry &amp; Sync Oscilloscope
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time simulation of catalog lookups and mutex locks</p>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-orange-400">
                    <span className="w-2.5 h-0.5 bg-orange-400 inline-block"></span> Latency (ms)
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-400">
                    <span className="w-2.5 h-0.5 bg-amber-400 inline-block"></span> Margin (%)
                  </span>
                </div>
              </div>

              <div className="w-full h-[140px] bg-slate-950/80 rounded-xl p-3 border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 500 140" className="w-full h-full overflow-visible">
                  <line x1="0" y1="35" x2="500" y2="35" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />
                  <line x1="0" y1="105" x2="500" y2="105" stroke="#1e293b" strokeWidth="1" strokeDasharray="4,4" />

                  {svgData.latPath && (
                    <path d={svgData.latPath} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                  )}
                  {svgData.marginPath && (
                    <path d={svgData.marginPath} fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4,3" strokeLinecap="round" />
                  )}
                </svg>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <div>
                  <span className="text-slate-500 block text-[10px]">State Classification</span>
                  <span className="font-mono text-orange-400 font-semibold">{results.statusClassification}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Active Protocol</span>
                  <span className="font-mono text-slate-200">ONDC Beckn v1.2.0</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Double-Sell Rate</span>
                  <span className="font-mono text-emerald-400 font-semibold">&lt; 0.02% (Protected)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">ERP Connector</span>
                  <span className="font-mono text-slate-200">SAP S/4HANA CDC</span>
                </div>
              </div>
            </div>

            {/* CTA Audit Module */}
            <div className="bg-gradient-to-r from-orange-950/40 via-slate-900 to-slate-950 border border-orange-500/30 rounded-2xl p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Deploy Sovereign ONDC Retail AI Across Your Stores</h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    Schedule an enterprise architecture audit to integrate deterministic Beckn inventory sync,
                    vernacular voice dynamic pricing, and sub-second SAP ERP synchronization across your retail network.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <ExpandableScreen>
                  <ExpandableScreenTrigger className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-orange-500/20">
                    <span>Schedule Sovereign Retail Architecture Audit</span>
                    <ArrowRight className="w-4 h-4" />
                  </ExpandableScreenTrigger>
                  <ExpandableScreenContent>
                    <div className="max-w-2xl mx-auto p-6 space-y-6">
                      <div className="border-b border-slate-800 pb-4">
                        <h2 className="text-xl font-bold text-white">Schedule Sovereign Retail AI Audit</h2>
                        <p className="text-xs text-slate-400 mt-1">
                          Private VPC deployment, ONDC Beckn v1.2.0 integration, and SAP ERP telemetry synchronization.
                        </p>
                      </div>
                      <MandateApplicationForm />
                    </div>
                  </ExpandableScreenContent>
                </ExpandableScreen>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Sections */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 space-y-12">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Architectural Deep Dive: Solving the Omnichannel Phantom Inventory Paradox
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-3xl leading-relaxed">
              Why periodic batch cron sync fails under high-velocity quick commerce and how sovereign deterministic agents
              enforce sub-50ms inventory atomicity across India's retail distribution networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 w-fit">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">In-Memory Redis Distributed Mutex</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When an ONDC buyer app or quick-commerce platform selects an item, stock is atomically reserved
                using distributed Redis mutexes, completely eliminating phantom stock and flash-sale double selling.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Sub-100ms Vernacular Voice NLU</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Quantized on-premise language models parse colloquial Hinglish, Tanglish, and regional voice queries,
                extracting quantity and delivery constraints into structured checkout carts in under 90 milliseconds.
              </p>
            </div>

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Decoupled SAP ERP Event Streaming</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Apache Kafka change data capture streams goods receipts (MIGO) from SAP S/4HANA in sub-25ms while
                shielding core enterprise transaction databases from volatile consumer read spikes.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white mb-2">Frequently Asked Architectural Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-800/80 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-orange-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-orange-400' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Embed Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Code className="w-4 h-4 text-orange-400" />
                <span>Embed Simulator on Your Website</span>
              </div>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Copy and paste this HTML snippet into your technical documentation, portal, or internal knowledge base.
            </p>

            <textarea
              readOnly
              value={embedCode}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-orange-300 focus:outline-none"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={copyEmbedCode}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs"
              >
                {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Embed Code'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
          <WhatsAppModal />
    </div>
  );
}
