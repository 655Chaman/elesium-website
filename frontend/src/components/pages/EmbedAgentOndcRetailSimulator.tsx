import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  simulateOndcRetailTelemetry,
  OndcRetailInputs
} from '../calculator/agentOndcRetailModel';
import { ShoppingBag, Cpu, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentOndcRetailSimulator() {
  const [catalogSkuCount, setCatalogSkuCount] = useState<number>(25000);
  const [ondcBuyerAppsConnected, setOndcBuyerAppsConnected] = useState<number>(8);
  const [pricingStrategy, setPricingStrategy] = useState<'demand_elasticity' | 'expiry_decay_salvage' | 'competitor_arbitrage' | 'statutory_mrp_strict'>('demand_elasticity');
  const [stockReconciliationFrequency, setStockReconciliationFrequency] = useState<'sub_50ms_in_memory' | 'five_second_event_bus' | 'one_minute_batch'>('sub_50ms_in_memory');
  const vernacularNluAccuracyPct = 98.5;

  const inputs: OndcRetailInputs = useMemo(() => ({
    catalogSkuCount,
    ondcBuyerAppsConnected,
    pricingStrategy,
    stockReconciliationFrequency,
    vernacularNluAccuracyPct,
    currency: 'INR'
  }), [
    catalogSkuCount,
    ondcBuyerAppsConnected,
    pricingStrategy,
    stockReconciliationFrequency,
    vernacularNluAccuracyPct
  ]);

  const results = useMemo(() => {
    return simulateOndcRetailTelemetry(inputs);
  }, [inputs]);

  // Generate SVG telemetry data
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.telemetryTrace;
    if (!trace || trace.length === 0) return { latPath: '', marginPath: '', rawPoints: [] };

    const maxLat = 80;
    const latPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.syncLatencyMs / maxLat) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const maxMargin = 25;
    const marginPoints: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.marginUpliftPct / maxMargin) * (height * 0.7) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const latD = latPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    const marginD = marginPoints.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');

    return { latPath: latD, marginPath: marginD, rawPoints: trace };
  }, [results.telemetryTrace]);

  return (
    <div className="min-h-[100dvh] bg-black text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>ONDC Retail Inventory &amp; Dynamic Pricing Simulator | Elesium Embed</title>
        <link rel="canonical" href="https://elesium.online/embed/agent-ondc-retail-inventory-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/15 text-neutral-200">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white">ONDC Inventory &amp; Pricing Engine</h1>
              <p className="text-[10px] text-neutral-400">Beckn Protocol &amp; Hyperlocal Omnichannel Telemetry</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-medium border bg-white/[0.04] border-white/20 text-neutral-200">
            {results.statusClassification}
          </span>
        </div>

        {/* Sliders & Controls */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-neutral-900/60 p-3 rounded-[18px] border border-neutral-800">
          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">
              Catalog SKUs: <span className="text-neutral-200 font-mono">{catalogSkuCount.toLocaleString()}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="100000"
              step="1000"
              value={catalogSkuCount}
              onChange={(e) => setCatalogSkuCount(Number(e.target.value))}
              aria-label="Catalog SKUs"
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-full cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">
              Connected Buyer Apps: <span className="text-neutral-200 font-mono">{ondcBuyerAppsConnected}</span>
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={ondcBuyerAppsConnected}
              onChange={(e) => setOndcBuyerAppsConnected(Number(e.target.value))}
              aria-label="Connected Buyer Apps"
              className="w-full accent-white h-1.5 bg-neutral-800 rounded-full cursor-pointer"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">Pricing Engine</label>
            <select
              value={pricingStrategy}
              onChange={(e) => setPricingStrategy(e.target.value as any)}
              aria-label="Pricing Engine"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-[11px]"
            >
              <option value="demand_elasticity">Hyperlocal Demand Elasticity</option>
              <option value="expiry_decay_salvage">Shelf Life Decay Salvage</option>
              <option value="competitor_arbitrage">Quick-Commerce Competitor Match</option>
              <option value="statutory_mrp_strict">Strict MRP Cap (No Surge)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-neutral-300 block mb-1">Sync Architecture</label>
            <select
              value={stockReconciliationFrequency}
              onChange={(e) => setStockReconciliationFrequency(e.target.value as any)}
              aria-label="Sync Architecture"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1 text-neutral-300 text-[11px]"
            >
              <option value="sub_50ms_in_memory">In-Memory Redis PubSub (Sub-50ms)</option>
              <option value="five_second_event_bus">Kafka Micro-Batch (5 Sec)</option>
              <option value="one_minute_batch">Legacy ERP Cron (1 Min)</option>
            </select>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">ONDC Sync Latency</span>
            <span className="text-base font-mono font-bold text-white">{results.syncLatencyMs} ms</span>
            <span className="text-[9px] text-neutral-500 block">Beckn on_search</span>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">Stockout Drop</span>
            <span className="text-base font-mono font-bold text-white">-{results.inventoryStockoutReductionPct}%</span>
            <span className="text-[9px] text-neutral-500 block">Zero phantom stock</span>
          </div>

          <div className="bg-neutral-900/80 border border-neutral-800/80 p-2.5 rounded-xl">
            <span className="text-[10px] text-neutral-400 block">Gross Margin Lift</span>
            <span className="text-base font-mono font-bold text-amber-400">+{results.omnichannelGrossMarginUpliftPct}%</span>
            <span className="text-[9px] text-neutral-500 block">Algorithmic pricing</span>
          </div>
        </div>

        {/* Live SVG Oscilloscope */}
        <div className="bg-neutral-950/80 border border-neutral-800/60 p-3 rounded-[18px] space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-neutral-200" />
              Beckn Protocol Telemetry Oscilloscope
            </span>
            <div className="flex items-center space-x-3 text-[10px] font-mono">
              <span className="text-neutral-200 flex items-center gap-1">
                <span className="w-2 h-0.5 bg-white/80 inline-block"></span> Latency (ms)
              </span>
              <span className="text-amber-400 flex items-center gap-1">
                <span className="w-2 h-0.5 bg-amber-400 inline-block"></span> Margin (%)
              </span>
            </div>
          </div>

          <div className="w-full h-[90px] bg-neutral-900/40 rounded-[24px] p-1.5 overflow-hidden flex items-center justify-center">
            <svg viewBox="0 0 340 90" className="w-full h-full overflow-visible">
              <line x1="0" y1="22" x2="340" y2="22" stroke="#262626" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="45" x2="340" y2="45" stroke="#262626" strokeWidth="0.5" strokeDasharray="2,2" />
              <line x1="0" y1="68" x2="340" y2="68" stroke="#262626" strokeWidth="0.5" strokeDasharray="2,2" />

              {svgData.latPath && (
                <path d={svgData.latPath} fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
              )}
              {svgData.marginPath && (
                <path d={svgData.marginPath} fill="none" stroke="#d4d4d4" strokeWidth="1.5" strokeDasharray="3,2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Working Capital Salvaged & Watermark Backlink */}
        <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs">
          <div>
            <span className="text-[10px] text-neutral-400 block">Working Capital Optimization</span>
            <span className="font-mono font-bold text-white">₹{(results.annualWorkingCapitalSavings / 100000).toFixed(1)} Lakhs / year</span>
          </div>

          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[11px] text-neutral-200 hover:text-white transition-all duration-300"
          >
            <span>Powered by Elesium Retail AI</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
