import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  calculateTallyErp,
  TallyErpInputs,
  TallyIntegrationMode,
  LlmAgentArchitecture,
  ReconciliationComplexity
} from '../calculator/agentTallyErpModel';
import { FileText, ArrowUpRight } from 'lucide-react';

export default function EmbedAgentTallyErpSimulator() {
  const [monthlyVoucherVolume, setMonthlyVoucherVolume] = useState<number>(3500);
  const [tallyIntegrationMode, setTallyIntegrationMode] = useState<TallyIntegrationMode>('xml_http_tdl');
  const [llmAgentArchitecture, setLlmAgentArchitecture] = useState<LlmAgentArchitecture>('deterministic_langgraph');
  const [reconciliationComplexity, setReconciliationComplexity] = useState<ReconciliationComplexity>('gst_rule_36_4_itc');
  const [humanInTheLoopThreshold, setHumanInTheLoopThreshold] = useState<number>(0.95);

  const inputs: TallyErpInputs = useMemo(() => ({
    monthlyVoucherVolume,
    tallyIntegrationMode,
    llmAgentArchitecture,
    reconciliationComplexity,
    humanInTheLoopThreshold,
    currency: 'INR'
  }), [
    monthlyVoucherVolume,
    tallyIntegrationMode,
    llmAgentArchitecture,
    reconciliationComplexity,
    humanInTheLoopThreshold
  ]);

  const results = useMemo(() => {
    return calculateTallyErp(inputs);
  }, [inputs]);

  // Generate SVG telemetry latency curve
  const svgData = useMemo(() => {
    const width = 340;
    const height = 90;
    const trace = results.voucherProcessingTrace;
    if (!trace || trace.length === 0) return { path: '', rawPoints: [] };

    const maxLatency = Math.max(100, Math.max(...trace.map(t => t.latencyMs)) * 1.3);
    const points: [number, number][] = trace.map((pt, idx) => {
      const x = (idx / (trace.length - 1)) * width;
      const y = height - (pt.latencyMs / maxLatency) * (height * 0.75) - 8;
      return [x, Math.max(5, Math.min(height - 5, y))];
    });

    const d = points.reduce((acc, [x, y], idx) => idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`, '');
    return { path: d, rawPoints: trace };
  }, [results.voucherProcessingTrace]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-4 sm:p-6 font-sans">
      <Helmet>
        <title>Tally ERP LLM Agent Reconciliation Simulator | Elesium Embed</title>
        <meta name="description" content="Embeddable simulator calculating Tally Prime XML-over-HTTP port 9000 latency, straight-through processing rates, and GST Rule 36(4) verification." />
        <link rel="canonical" href="https://elesium.online/embed/agent-tally-erp-xml-simulator" />
      </Helmet>

      <div className="max-w-xl mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Tally ERP LLM Agent Sandbox</h2>
              <p className="text-[11px] text-slate-400">XML/ODBC Port 9000 Ledger Telemetry</p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            {results.statusClassification.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-2 gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Monthly Invoices</span>
              <span className="text-emerald-400 font-mono">{monthlyVoucherVolume.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={monthlyVoucherVolume}
              onChange={(e) => setMonthlyVoucherVolume(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-slate-400 text-[11px]">
              <span>Confidence Gate</span>
              <span className="text-emerald-400 font-mono">{(humanInTheLoopThreshold * 100).toFixed(0)}%</span>
            </div>
            <input
              type="range"
              min="0.80"
              max="0.99"
              step="0.01"
              value={humanInTheLoopThreshold}
              onChange={(e) => setHumanInTheLoopThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Tally Interface Mode</label>
            <select
              value={tallyIntegrationMode}
              onChange={(e) => setTallyIntegrationMode(e.target.value as TallyIntegrationMode)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="xml_http_tdl">XML-over-HTTP (Port 9000)</option>
              <option value="odbc_sql_bridge">ODBC SQL Protocol Bridge</option>
              <option value="json_rest_wrapper">FastAPI REST / JSON Gateway</option>
              <option value="direct_tcp_stream">Direct Raw TCP Socket</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 text-[11px]">Agent Architecture</label>
            <select
              value={llmAgentArchitecture}
              onChange={(e) => setLlmAgentArchitecture(e.target.value as LlmAgentArchitecture)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="deterministic_langgraph">Deterministic LangGraph</option>
              <option value="local_vllm_airgapped">Local vLLM (Air-Gapped)</option>
              <option value="hybrid_router">Hybrid Intent Router</option>
              <option value="direct_api_unbounded">Public Cloud API (Unbounded)</option>
            </select>
          </div>

          <div className="col-span-2 space-y-1">
            <label className="text-slate-400 text-[11px]">Compliance &amp; Voucher Complexity</label>
            <select
              value={reconciliationComplexity}
              onChange={(e) => setReconciliationComplexity(e.target.value as ReconciliationComplexity)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white"
            >
              <option value="gst_rule_36_4_itc">GST Rule 36(4) + GSTR-2B ITC Matching</option>
              <option value="standard_invoicing">Standard AP Purchase Voucher Ingestion</option>
              <option value="multi_currency_forex">Multi-Currency Forex Realized Gain/Loss</option>
              <option value="bill_of_materials_mfg">BOM Multi-Level Manufacturing Journal</option>
            </select>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">End-to-End Latency</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5 font-mono">{results.voucherIngestionLatencyMs}ms</div>
            <div className="text-[9px] text-slate-500">sub-second post</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">STP Auto-Post</div>
            <div className="text-base font-bold text-indigo-400 mt-0.5 font-mono">{results.autoPostingSuccessRatePct}%</div>
            <div className="text-[9px] text-slate-500">zero touch rate</div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Hours Saved/Mo</div>
            <div className="text-base font-bold text-amber-400 mt-0.5 font-mono">{results.monthlyHumanHoursSaved} hrs</div>
            <div className="text-[9px] text-slate-500">reallocated staff</div>
          </div>
        </div>

        {/* Secondary Value Metrics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">Annual AP OPEX Saved:</span>
            <span className="font-bold text-emerald-400 font-mono">{results.annualFinanceOpexSavings}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 p-2 rounded-lg flex items-center justify-between text-xs">
            <span className="text-slate-400">GST Mismatch Mitigated:</span>
            <span className="font-bold text-indigo-300 font-mono">{results.gstMismatchAvoidanceValue}</span>
          </div>
        </div>

        {/* SVG Pipeline Latency Breakdown */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-lg p-2.5 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] text-slate-400">
            <span>Agent Execution Pipeline Latency</span>
            <span className="text-slate-500 font-mono">7-Stage Micro-Profile</span>
          </div>
          <div className="h-16 w-full flex items-center justify-center">
            <svg viewBox="0 0 340 90" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="tallyCurve" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <path
                d={svgData.path}
                fill="none"
                stroke="url(#tallyCurve)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Watermark Backlink */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
          <span>Sovereign Tally Automation Suite</span>
          <a
            href="https://elesium.online/solutions"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 transition-colors font-medium"
          >
            Elesium Enterprise AI Solutions <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
