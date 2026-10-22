import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  FileText,
  Copy,
  Check,
  ChevronDown,
  Code,
  X,
  Sliders,
  Sparkles,
  Server,
  Layers,
  ShieldCheck,
  Coins,
  CheckCircle2
} from 'lucide-react';
import {
  calculateTallyErp,
  TallyErpInputs,
  TallyIntegrationMode,
  LlmAgentArchitecture,
  ReconciliationComplexity
} from '../calculator/agentTallyErpModel';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';

export default function EnterpriseAgentTallyErpSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();
  // Inputs State
  const [monthlyVoucherVolume, setMonthlyVoucherVolume] = useState<number>(3500);
  const [tallyIntegrationMode, setTallyIntegrationMode] = useState<TallyIntegrationMode>('xml_http_tdl');
  const [llmAgentArchitecture, setLlmAgentArchitecture] = useState<LlmAgentArchitecture>('deterministic_langgraph');
  const [reconciliationComplexity, setReconciliationComplexity] = useState<ReconciliationComplexity>('gst_rule_36_4_itc');
  const [humanInTheLoopThreshold, setHumanInTheLoopThreshold] = useState<number>(0.95);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const inputs: TallyErpInputs = useMemo(() => ({
    monthlyVoucherVolume,
    tallyIntegrationMode,
    llmAgentArchitecture,
    reconciliationComplexity,
    humanInTheLoopThreshold,
    currency
  }), [
    monthlyVoucherVolume,
    tallyIntegrationMode,
    llmAgentArchitecture,
    reconciliationComplexity,
    humanInTheLoopThreshold,
    currency
  ]);

  const results = useMemo(() => {
    return calculateTallyErp(inputs);
  }, [inputs]);

  const embedSnippet = `<iframe src="https://elesium.online/embed/agent-tally-erp-xml-simulator" width="100%" height="600" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;"></iframe><div style="font-size:11px;color:#64748b;text-align:right;margin-top:6px;font-family:sans-serif;">Simulated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#10b981;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedSnippet);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2000);
  };

  const executiveMemo = useMemo(() => {
    return `================================================================================
EXECUTIVE ENGINEERING MEMORANDUM: AUTONOMOUS TALLY ERP INTEGRATION
CONFIDENTIAL & PROPRIETARY — PREPARED BY ELESIUM ENTERPRISE AI
================================================================================
Generated Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Target ERP Platform: Tally ERP 9 / Tally Prime 4.x
Integration Channel: ${tallyIntegrationMode.toUpperCase()}
Agent Architecture: ${llmAgentArchitecture.toUpperCase()}
Compliance Tier: ${reconciliationComplexity.toUpperCase()}

1. KEY OPERATIONAL METRICS:
   - Monthly Invoices Processed: ${monthlyVoucherVolume.toLocaleString()}
   - End-to-End Ingestion Latency: ${results.voucherIngestionLatencyMs} ms / voucher
   - Ledger Reconciliation Accuracy: ${results.reconciliationAccuracyPct}%
   - Straight-Through Processing (STP): ${results.autoPostingSuccessRatePct}%
   - Monthly Accounting Staff Hours Saved: ${results.monthlyHumanHoursSaved} hours

2. FINANCIAL RETURN & STATUTORY MITIGATION:
   - Annual Finance OPEX Savings: ${results.annualFinanceOpexSavings}
   - Mitigated GST Rule 36(4) ITC Disallowance: ${results.gstMismatchAvoidanceValue}
   - Human-in-the-Loop Escalation Boundary: ${(humanInTheLoopThreshold * 100).toFixed(0)}% Confidence Gate

3. DEPLOYMENT ARCHITECTURE:
   - Transport: Sovereign Localhost Reverse Proxy to Tally Port 9000
   - Validation: Pydantic v2 Cryptographic Double-Entry Schema Enforcement
   - Statutory Compliance: Indian DPDP Act 2023 & Section 63 BSA Hash Timestamping
================================================================================`;
  }, [inputs, results, tallyIntegrationMode, llmAgentArchitecture, reconciliationComplexity, monthlyVoucherVolume, humanInTheLoopThreshold]);

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(executiveMemo);
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2000);
  };

  const faqs = [
    {
      q: "Does our finance team need to upgrade from Tally ERP 9 to Tally Prime to automate?",
      a: "No. The underlying Tally Definition Language (TDL) XML-over-HTTP port 9000 protocol is identical between Tally ERP 9 (Rel 4.5+) and Tally Prime (1.0 to 4.x). Our sovereign proxy communicates directly with Tally's local server regardless of whether it runs on a single desktop or a multi-user Windows Server LAN."
    },
    {
      q: "How does the autonomous agent handle vendor ledger names that don't match the invoice?",
      a: "The agent never executes unverified ledger string matching. Instead, it queries your Tally Sundry Creditors master list and matches the vendor's 15-character GSTIN. If GSTIN is absent, it uses dense pgvector semantic similarity with a strict 98.5% confidence gate. Anything below that threshold is escalated to an AP human approval queue."
    },
    {
      q: "How does the system prevent Input Tax Credit (ITC) penalties under GST Rule 36(4)?",
      a: "Before synthesizing the XML voucher, the agent queries the live GST portal or your latest GSTR-2B JSON return. If the vendor has not filed their GSTR-1, the agent automatically holds the CGST/SGST ledger allocation in an unreconciled escrow bucket, protecting your business from 18% statutory interest penalties."
    },
    {
      q: "Is our financial data sent to third-party public cloud AI APIs like OpenAI or Anthropic?",
      a: "No. For enterprise clients requiring strict data sovereignty, we deploy local quantized models (e.g., Qwen-2.5-VL / DeepSeek-R1 70B via air-gapped vLLM) entirely inside your private VPC or on-premise hardware, satisfying the Indian DPDP Act 2023 with zero cloud data leakage."
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      <Helmet>
        <title>Enterprise Autonomous Agent Tally ERP / Prime XML Gateway &amp; Ledger Reconciliation Simulator | Elesium</title>
        <meta name="description" content="Simulate automated Tally ERP 9 / Tally Prime voucher ingestion, TDL XML-over-HTTP port 9000 latency, straight-through processing rates, and GST Rule 36(4) ITC reconciliation." />
        <link rel="canonical" href="https://elesium.online/tools/enterprise-agent-tally-erp-xml-simulator" />
      </Helmet>

      {/* Hero Header */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-[#020617] pt-12 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-mono">
            <a href="/" className="hover:text-emerald-400 transition-colors">Home</a>
            <span>/</span>
            <a href="/solutions" className="hover:text-emerald-400 transition-colors">Tools</a>
            <span>/</span>
            <span className="text-emerald-400">Tally ERP LLM Gateway Simulator</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>FinOps Agent Architecture #46</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Enterprise Autonomous Agent Tally ERP / Prime XML Gateway &amp; Ledger Simulator
              </h1>
              <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
                Simulate TDL XML-over-HTTP port 9000 voucher ingestion, layout-aware invoice OCR, straight-through processing (STP) rates, and statutory GST Rule 36(4) Input Tax Credit reconciliation.
              </p>
            </div>

            <div className="flex flex-wrap lg:flex-col gap-3">
              <button
                onClick={() => openWhatsApp()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Chat on WhatsApp</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all text-sm font-medium shadow-sm"
              >
                <Code className="w-4 h-4 text-emerald-400" />
                <span>Embed Simulator</span>
              </button>
              <button
                onClick={handleCopyMemo}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-300 transition-all text-sm font-medium"
              >
                {hasCopiedMemo ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-emerald-400" />}
                <span>{hasCopiedMemo ? 'Memo Copied!' : 'Copy Executive Memo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Sliders className="w-5 h-5 text-emerald-400" />
                  <span>Pipeline Simulation Controls</span>
                </div>
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  <button
                    onClick={() => setCurrency('INR')}
                    className={`px-2.5 py-1 rounded font-mono ${currency === 'INR' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
                  >
                    INR (₹)
                  </button>
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-2.5 py-1 rounded font-mono ${currency === 'USD' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Slider 1: Monthly Vouchers */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Monthly Invoices / Vouchers</span>
                  <span className="font-mono text-emerald-400 font-bold">{monthlyVoucherVolume.toLocaleString()} vouchers</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={monthlyVoucherVolume}
                  onChange={(e) => setMonthlyVoucherVolume(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>500 (Mid-Market)</span>
                  <span>25,000 (Conglomerate)</span>
                </div>
              </div>

              {/* Slider 2: Confidence Threshold */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300 font-medium">Human-in-the-Loop Confidence Gate</span>
                  <span className="font-mono text-indigo-400 font-bold">{(humanInTheLoopThreshold * 100).toFixed(0)}% min</span>
                </div>
                <input
                  type="range"
                  min="0.80"
                  max="0.99"
                  step="0.01"
                  value={humanInTheLoopThreshold}
                  onChange={(e) => setHumanInTheLoopThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>80% (Higher STP)</span>
                  <span>99% (Strict Audit)</span>
                </div>
              </div>

              {/* Select 1: Tally Integration Mode */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Tally Interface Mechanism</label>
                <select
                  value={tallyIntegrationMode}
                  onChange={(e) => setTallyIntegrationMode(e.target.value as TallyIntegrationMode)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="xml_http_tdl">TDL XML-over-HTTP (Port 9000 Gateway)</option>
                  <option value="odbc_sql_bridge">ODBC SQL Protocol Bridge (Read-Only)</option>
                  <option value="json_rest_wrapper">Sovereign FastAPI Reverse Proxy (JSON)</option>
                  <option value="direct_tcp_stream">Direct Raw TCP Socket Stream</option>
                </select>
              </div>

              {/* Select 2: LLM Architecture */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Multi-Agent Engine Topology</label>
                <select
                  value={llmAgentArchitecture}
                  onChange={(e) => setLlmAgentArchitecture(e.target.value as LlmAgentArchitecture)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="deterministic_langgraph">Deterministic LangGraph (Bounded FSM)</option>
                  <option value="local_vllm_airgapped">Local vLLM (Air-Gapped Private VPC)</option>
                  <option value="hybrid_router">Hybrid Intent Router (Semantic Cache)</option>
                  <option value="direct_api_unbounded">Public Cloud API (Unbounded Chatbot)</option>
                </select>
              </div>

              {/* Select 3: Reconciliation Complexity */}
              <div className="space-y-2">
                <label className="text-sm text-slate-300 font-medium">Statutory &amp; Voucher Complexity</label>
                <select
                  value={reconciliationComplexity}
                  onChange={(e) => setReconciliationComplexity(e.target.value as ReconciliationComplexity)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-2.5 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="gst_rule_36_4_itc">GST Rule 36(4) + GSTR-2B ITC Matching</option>
                  <option value="standard_invoicing">Standard AP Purchase Voucher Ingestion</option>
                  <option value="multi_currency_forex">Multi-Currency Forex Realized Gain/Loss</option>
                  <option value="bill_of_materials_mfg">BOM Multi-Level Manufacturing Journal</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
                <div className="text-xs font-mono uppercase text-slate-400">Total Latency</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{results.voucherIngestionLatencyMs}ms</div>
                <div className="text-[11px] text-slate-500 mt-0.5">end-to-end voucher post</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg">
                <div className="text-xs font-mono uppercase text-slate-400">STP Success Rate</div>
                <div className="text-2xl font-bold text-indigo-400 mt-1 font-mono">{results.autoPostingSuccessRatePct}%</div>
                <div className="text-[11px] text-slate-500 mt-0.5">straight-through processing</div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-lg col-span-2 sm:col-span-1">
                <div className="text-xs font-mono uppercase text-slate-400">Human Hours Saved</div>
                <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">{results.monthlyHumanHoursSaved} hrs</div>
                <div className="text-[11px] text-slate-500 mt-0.5">monthly staff capacity</div>
              </div>
            </div>

            {/* Financial Impact Banner */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-4">
                <Coins className="w-4 h-4" />
                <span>Executive Financial Return &amp; Tax Compliance Ledger</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs text-slate-400">Annual AP Staff OPEX Saved</div>
                  <div className="text-3xl font-extrabold text-white font-mono mt-1">{results.annualFinanceOpexSavings}</div>
                  <p className="text-xs text-slate-400 mt-1">Direct elimination of manual voucher transcription and reconciliation overtime.</p>
                </div>
                <div>
                  <div className="text-xs text-slate-400">GST Rule 36(4) Penalty Exposure Mitigated</div>
                  <div className="text-3xl font-extrabold text-indigo-300 font-mono mt-1">{results.gstMismatchAvoidanceValue}</div>
                  <p className="text-xs text-slate-400 mt-1">Avoidance of 18% statutory interest on un-reconciled GSTR-2B Input Tax Credit claims.</p>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Breakdown */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-white font-semibold text-sm">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Agent Execution Pipeline Latency Breakdown</span>
                </div>
                <span className="text-xs font-mono text-emerald-400">
                  {results.statusClassification.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="space-y-3">
                {results.voucherProcessingTrace.map((stage) => (
                  <div key={stage.stage} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{stage.label}</span>
                      <span className="font-mono text-emerald-400">{stage.latencyMs}ms</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (stage.latencyMs / results.voucherIngestionLatencyMs) * 350)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architectural Trust Points */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-mono">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Zero Cloud Data Leakage (DPDP Act 2023)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>SHA-256 Audit Trail (Sec 63 BSA)</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Double-Entry Balance Enforced</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Sub-50ms TDL Port 9000 Ingestion</span>
              </div>
            </div>

          </div>
        </div>

        {/* Deep Dive Engineering Section */}
        <div className="mt-16 pt-12 border-t border-slate-800/80 space-y-12">
          <div className="max-w-3xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Under the Hood: Deterministic XML/ODBC Tally ERP Agent Architecture
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
              Standard LLM implementations fail in enterprise accounting because finance systems permit zero numeric tolerance. Elesium couples vision OCR models with deterministic Pydantic schemas and strict mathematical state transitions before any XML payload touches Tally Prime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-xl space-y-3">
              <div className="p-2 w-fit rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">TDL XML-over-HTTP (Port 9000)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to Tally Prime's embedded HTTP server. Generates strict &lt;ENVELOPE&gt; XML payloads with &lt;TALLYMESSAGE&gt; voucher schemas, achieving sub-40ms execution per transaction.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-xl space-y-3">
              <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">GST Rule 36(4) Auto-Reconciliation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Matches line-item HSN codes, invoice dates, and GSTINs against live GSTR-2B national tax feeds. Halts posting and routes to escrow whenever supplier filing discrepancies are detected.
              </p>
            </div>

            <div className="bg-slate-900/50 border border-slate-800/80 p-6 rounded-xl space-y-3">
              <div className="p-2 w-fit rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white">Vector Chart of Accounts Sync</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintains a localized pgvector embedding index of your Tally Sundry Creditors ledger master, resolving messy supplier invoice headers with 99.8% semantic accuracy.
              </p>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold text-white">Frequently Asked Architectural Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-medium text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mandate Application Form Section */}
          <div className="pt-8">
            <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Production Implementation</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Deploy Sovereign Tally ERP Multi-Agent Systems
              </h2>
              <p className="text-sm text-slate-400">
                Lock in your straight-through voucher processing pipeline. Reserve an engineering audit for your finance and accounting infrastructure.
              </p>
            </div>

            <div className="max-w-xl mx-auto">
              {/* Luxury Monochrome WhatsApp Conversion Card */}
        <div className="my-10 p-6 sm:p-8 rounded-3xl border border-white/10 bg-white/[0.02] text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-xs font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Direct Lead Architect Intake</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Ready to Lock These Simulation Benchmarks in Production?
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
            Connect directly with our Principal Systems Architect on WhatsApp. We provide a tailored 1-page feasibility memorandum and deterministic VPC architecture blueprint.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => openWhatsApp()}
              className="px-6 py-3 rounded-full bg-white hover:bg-neutral-200 text-black text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Chat on WhatsApp with Lead Architect</span>
            </button>
          </div>
        </div>

        <MandateApplicationForm />
            </div>
          </div>
        </div>
      </div>

      {/* Embed Code Modal */}
      {isEmbedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Embed Tally ERP Simulator</h3>
              </div>
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Copy and paste this responsive snippet into your blog, internal documentation, or financial client portal:
            </p>

            <div className="relative">
              <pre className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre-wrap max-h-48">
                {embedSnippet}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmbed}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow"
              >
                {hasCopiedEmbed ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{hasCopiedEmbed ? 'Copied Snippet!' : 'Copy Snippet'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Intent Memo Modal */}
      <ExitIntentMemoModal
        toolName="Tally ERP LLM Gateway Simulator"
        simulatedMetrics={[
          { label: 'End-to-End Latency', value: `${results.voucherIngestionLatencyMs} ms` },
          { label: 'STP Auto-Post Rate', value: `${results.autoPostingSuccessRatePct}%` },
          { label: 'Staff Hours Saved', value: `${results.monthlyHumanHoursSaved} hrs/mo` },
          { label: 'Annual Finance OPEX Saved', value: results.annualFinanceOpexSavings }
        ]}
      />
          <WhatsAppModal />
    </div>
  );
}
