import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Scale,
  Copy,
  Check,
  ChevronDown,
  AlertOctagon,
  ArrowRight,
  ExternalLink,
  Code,
  FileText,
  X
} from 'lucide-react';
import {
  calculateDpdpAudit,
  formatCrore,
  formatNumber,
  formatCompactNumber,
  PII_DATA_TYPES,
  INFERENCE_BOUNDARIES,
  InferenceBoundaryKey,
  Currency
} from '../calculator/dpdpAuditSimulatorModel';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';

export default function DpdpStatutoryAuditSimulator() {
  const { openWhatsApp, WhatsAppModal } = useWhatsApp();

  // Inputs State
  const [currency, setCurrency] = useState<Currency>('INR');
  const [recordVolume, setRecordVolume] = useState<number>(500000);
  const [inferenceBoundary, setInferenceBoundary] = useState<InferenceBoundaryKey>('public_us_cloud');
  const [isSignificantDataFiduciary, setIsSignificantDataFiduciary] = useState<boolean>(true);

  const [selectedPiiTypes, setSelectedPiiTypes] = useState<string[]>([
    'aadhaar_pan',
    'financial_banking',
    'health_medical'
  ]);

  const [safeguards, setSafeguards] = useState({
    automatedPiiRedaction: false,
    ephemeralMemoryNoLogging: false,
    cryptographicAuditLedger: false,
    sub6HourBreachDetection: false,
    dataPrincipalRightsAutomation: false
  });

  // UI Modals & Copy
  const [isEmbedOpen, setIsEmbedOpen] = useState(false);
  const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
  const [hasCopiedMemo, setHasCopiedMemo] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const togglePii = (id: string) => {
    setSelectedPiiTypes((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleSafeguard = (key: keyof typeof safeguards) => {
    setSafeguards((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const results = useMemo(() => {
    return calculateDpdpAudit({
      recordVolume,
      inferenceBoundary,
      selectedPiiTypes,
      safeguards,
      isSignificantDataFiduciary,
      currency
    });
  }, [recordVolume, inferenceBoundary, selectedPiiTypes, safeguards, isSignificantDataFiduciary, currency]);

  const activeBoundary = INFERENCE_BOUNDARIES[inferenceBoundary];

  const embedCode = `<iframe src="https://elesium.online/embed/dpdp-audit-simulator" width="100%" height="720" frameborder="0" style="border-radius:12px;border:1px solid #1e293b;box-shadow:0 10px 25px -5px rgba(0,0,0,0.5);"></iframe><div style="font-size:12px;color:#94a3b8;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#f59e0b;text-decoration:underline;">Elesium Sovereign AI Solutions</a></div>`;

  const copyEmbedSnippet = () => {
    navigator.clipboard.writeText(embedCode);
    setHasCopiedEmbed(true);
    setTimeout(() => setHasCopiedEmbed(false), 2500);
  };

  const copyAuditMemo = () => {
    const memo = {
      audit_title: "DPDP Act 2023 Enterprise Statutory Audit Memo",
      statutory_reference: "Digital Personal Data Protection Act, 2023 (Section 33 Schedule of Penalties)",
      timestamp: new Date().toISOString(),
      parameters: {
        record_volume: recordVolume,
        inference_boundary: activeBoundary.name,
        significant_data_fiduciary_status: isSignificantDataFiduciary,
        selected_pii_classes: selectedPiiTypes,
        safeguards_status: safeguards
      },
      audit_evaluation: {
        overall_compliance_score: `${results.overallComplianceScore}/100`,
        compliance_grade: results.complianceGrade,
        statutory_risk_level: results.riskLevel,
        estimated_liability: formatCrore(results.estimatedLiabilityINR, 'INR'),
        statutory_max_penalty_ceiling: formatCrore(results.statutoryMaxPenaltyINR, 'INR'),
        sovereign_vpc_remediated_liability: formatCrore(results.sovereignRemediatedLiabilityINR, 'INR'),
        liability_reduction: `${results.liabilityReductionPct}%`
      },
      identified_statutory_violations: results.primaryViolations,
      remediation_action_plan: results.remediationActionPlan,
      architectural_recommendation: "Migrate multi-agent inference workloads to a sovereign, air-gapped private VPC deployed within MeitY-empaneled Indian data centers with compile-time Pydantic boundaries."
    };
    navigator.clipboard.writeText(JSON.stringify(memo, null, 2));
    setHasCopiedMemo(true);
    setTimeout(() => setHasCopiedMemo(false), 2500);
  };

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "DPDP Act 2023 Enterprise Statutory Audit Simulator",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "All",
    "description": "Simulate DPDP Act 2023 statutory penalties, cross-border LLM leakage liabilities, and sovereign local VPC safe harbor checklists.",
    "url": "https://elesium.online/tools/dpdp-act-2023-audit-simulator",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "author": {
      "@type": "Organization",
      "name": "Elesium",
      "url": "https://elesium.online"
    }
  };

  const faqs = [
    {
      q: "What is the maximum statutory penalty under Section 33 of India's DPDP Act 2023?",
      a: "The Data Protection Board of India (DPBI) is empowered to levy statutory financial penalties up to ₹250 Crore ($28.5M USD) per occurrence for failure to take reasonable security safeguards to prevent a personal data breach, and up to ₹200 Crore for failure to notify the Board and affected Data Principals."
    },
    {
      q: "Why does routing enterprise prompts to US-hosted cloud APIs create statutory liability?",
      a: "Under Section 16 and Section 8 of the DPDP Act 2023, Data Fiduciaries must ensure sovereign data protection safeguards. Public multi-tenant APIs like US-hosted OpenAI or Anthropic endpoints store, process, and occasionally retain prompt embeddings outside Indian territorial jurisdiction, exposing the enterprise to unregulated cross-border data transfer violations."
    },
    {
      q: "What constitutes a 'Significant Data Fiduciary' (SDF) under Section 10?",
      a: "The Central Government may designate any Data Fiduciary as an SDF based on factors like the volume and sensitivity of personal data processed, risk to electoral democracy, public order, and state sovereignty. SDFs must appoint a resident Data Protection Officer (DPO), conduct periodic Data Protection Impact Assessments (DPIA), and undergo independent statutory data audits."
    },
    {
      q: "How does an Elesium Sovereign Private VPC guarantee statutory safe harbor?",
      a: "Elesium deploys open-weight LLMs (e.g., Llama 3 70B, DeepSeek) inside dedicated, air-gapped clusters hosted in MeitY-empaneled Indian data centers (AWS Mumbai/Hyderabad, GCP Delhi, Yotta, CtrlS). Zero customer tokens cross international boundaries, and sub-step Pydantic state machines enforce localized PII redaction and cryptographic audit checkpointers."
    }
  ];

  return (
    <>
      <Helmet>
        <title>DPDP Act 2023 Enterprise Statutory Audit Simulator | Elesium</title>
        <meta
          name="description"
          content="Simulate DPDP Act 2023 statutory penalties (up to ₹250 Crore), cross-border inference liabilities, and sovereign local VPC safe harbor checklists."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://elesium.online/tools/dpdp-act-2023-audit-simulator" />
        <script type="application/ld+json">{JSON.stringify(jsonLdSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200 pt-28 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link to="/compare" className="hover:text-white transition-colors">Compare</Link>
            <span>/</span>
            <span className="text-amber-400">DPDP Act 2023 Audit Simulator</span>
          </div>

          {/* Header Title Section */}
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-medium mb-4">
              <Scale className="w-3.5 h-3.5" />
              <span>Statutory Legal Tech & Data Sovereignty Simulator</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              DPDP Act 2023 Statutory Audit Simulator
            </h1>
            <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
              Model Data Protection Board of India (DPBI) statutory penalty exposure (up to ₹250 Crore per violation), 
              audit cross-border AI inference leaks, and lock in sovereign local VPC safe harbor.
            </p>
          </div>

          {/* Top Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Statutory Currency:</span>
              <div className="inline-flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                <button
                  onClick={() => setCurrency('INR')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    currency === 'INR'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  INR (₹ Crore)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                    currency === 'USD'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  USD ($ Million)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={copyAuditMemo}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                {hasCopiedMemo ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                <span>{hasCopiedMemo ? "Copied Statutory Memo!" : "Export Audit Dossier (.JSON)"}</span>
              </button>
              <button
                onClick={() => setIsEmbedOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
              >
                <Code className="w-3.5 h-3.5 text-amber-400" />
                <span>Embed Widget</span>
              </button>
            </div>
          </div>

          {/* Main Diagnostic Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            
            {/* Left Column: Statutory Diagnostic Controls (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
                <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6 pb-3 border-b border-slate-800">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Statutory Architecture Inputs</span>
                </h2>

                <div className="space-y-6">
                  {/* Record Volume Slider */}
                  <div>
                    <div className="flex justify-between items-center text-xs font-mono mb-2">
                      <span className="text-slate-300">Data Principals (Users Processed):</span>
                      <span className="text-amber-400 font-bold">{formatCompactNumber(recordVolume)} Records</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="50000"
                      value={recordVolume}
                      onChange={(e) => setRecordVolume(parseInt(e.target.value))}
                      className="w-full accent-amber-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                      <span>10k (Startup)</span>
                      <span>500k (Mid-Market)</span>
                      <span>10M (Enterprise)</span>
                    </div>
                  </div>

                  {/* AI Inference Boundary Selector */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      AI Inference & Model Host Boundary:
                    </label>
                    <select
                      value={inferenceBoundary}
                      onChange={(e) => setInferenceBoundary(e.target.value as InferenceBoundaryKey)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500 font-sans"
                    >
                      {Object.values(INFERENCE_BOUNDARIES).map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 text-xs text-slate-500 leading-normal">
                      {activeBoundary.description}
                    </p>
                  </div>

                  {/* Significant Data Fiduciary Status Toggle */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">Significant Data Fiduciary (SDF)</div>
                      <div className="text-[11px] text-slate-400">Section 10 statutory heightened duties</div>
                    </div>
                    <button
                      onClick={() => setIsSignificantDataFiduciary(!isSignificantDataFiduciary)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                        isSignificantDataFiduciary ? 'bg-amber-600' : 'bg-slate-800'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          isSignificantDataFiduciary ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* PII Data Types Handled */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Sensitive Personal Data Types Handled:
                    </label>
                    <div className="space-y-2">
                      {PII_DATA_TYPES.map((p) => {
                        const isSelected = selectedPiiTypes.includes(p.id);
                        return (
                          <div
                            key={p.id}
                            onClick={() => togglePii(p.id)}
                            className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                              isSelected
                                ? 'bg-amber-500/10 border-amber-500/40 text-slate-100'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-amber-500 mt-0.5 rounded cursor-pointer"
                            />
                            <div>
                              <div className="font-semibold text-slate-200">{p.name}</div>
                              <div className="text-[11px] text-slate-500">{p.description}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Security Safeguards Checklist */}
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-2">
                      Enforced Security Safeguards (Section 8 Compliance):
                    </label>
                    <div className="space-y-2 text-xs">
                      {[
                        { key: 'automatedPiiRedaction', label: 'Automated Localized Transformer PII Redaction' },
                        { key: 'ephemeralMemoryNoLogging', label: 'Zero Persistent Prompt Logging (Ephemeral RAM)' },
                        { key: 'cryptographicAuditLedger', label: 'Append-Only Cryptographic State Checkpointer' },
                        { key: 'sub6HourBreachDetection', label: 'Automated Sub-6-Hour DPBI Breach Anomaly Detection' },
                        { key: 'dataPrincipalRightsAutomation', label: 'Automated Data Erasure & DPR Grievance Portal' }
                      ].map((item) => {
                        const k = item.key as keyof typeof safeguards;
                        const isChecked = safeguards[k];
                        return (
                          <div
                            key={item.key}
                            onClick={() => toggleSafeguard(k)}
                            className={`p-2.5 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                              isChecked
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-slate-100'
                                : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <span className="text-[11px] font-medium">{item.label}</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="accent-emerald-500 rounded cursor-pointer"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right Column: Live Penalty & Liability Telemetry (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Primary Callout: Statutory Penalty Liability */}
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-900/80 to-slate-900 border border-amber-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  <Scale className="w-48 h-48 text-amber-500" />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-semibold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                      <AlertOctagon className="w-4 h-4 text-amber-400" />
                      Statutory Penalty Exposure (Section 33 Liability)
                    </span>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${
                      results.complianceGrade === 'A+' || results.complianceGrade === 'A'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      Grade: {results.complianceGrade} ({results.riskLevel})
                    </span>
                  </div>

                  <div className="flex items-baseline gap-3 mb-2">
                    <div className="text-4xl sm:text-6xl font-black text-white tracking-tight">
                      {formatCrore(results.estimatedLiabilityINR, currency)}
                    </div>
                    <span className="text-slate-400 text-xs font-mono">
                      (Statutory Cap: {formatCrore(results.statutoryMaxPenaltyINR, currency)})
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-6">
                    Potential financial penalties levied by the Data Protection Board of India under Section 33 for reasonable security safeguards and cross-border transfer failures across {formatNumber(recordVolume)} Data Principals.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Sovereign Remediated Risk</div>
                      <div className="text-base sm:text-xl font-bold text-emerald-400">
                        {formatCrore(results.sovereignRemediatedLiabilityINR, currency)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Liability Elimination</div>
                      <div className="text-base sm:text-xl font-bold text-amber-400">
                        {results.liabilityReductionPct}% Cut
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Unredacted PII Leaks</div>
                      <div className="text-base sm:text-xl font-bold text-rose-400">
                        {formatCompactNumber(results.unredactedPiiExposureRecords)} records
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statutory Violation Vectors */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Detected Statutory Violation Vectors</span>
                </h3>

                {results.primaryViolations.length === 0 ? (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Zero statutory violations detected. Your architecture satisfies MeitY sovereign empanelment and Section 8 safeguards.</span>
                  </div>
                ) : (
                  <ul className="space-y-2.5">
                    {results.primaryViolations.map((v, i) => (
                      <li key={i} className="text-xs text-slate-300 p-3 rounded-lg bg-slate-950/60 border border-rose-500/20 flex items-start gap-2.5">
                        <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Sovereign Local VPC Remediation Roadmap */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Sovereign Local VPC Remediation Roadmap</span>
                </h3>

                <ul className="space-y-2.5">
                  {results.remediationActionPlan.map((r, i) => (
                    <li key={i} className="text-xs text-slate-300 p-3 rounded-lg bg-slate-950/60 border border-emerald-500/20 flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Architecture Audit CTA Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Lock In DPDP Statutory Safe Harbor
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md">
                    Schedule a private 30-minute DPDP Act 2023 architecture audit. We replace public API leakage with air-gapped sovereign VPC clusters in MeitY data centers.
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <ExpandableScreen>
                    <ExpandableScreenTrigger>
                      <InteractiveHoverButton>
                        <span>Schedule DPDP Audit</span>
                      </InteractiveHoverButton>
                    </ExpandableScreenTrigger>
                    <ExpandableScreenContent>
                      <MandateApplicationForm />
                    </ExpandableScreenContent>
                  </ExpandableScreen>

                  <button
                    onClick={() => openWhatsApp()}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors whitespace-nowrap"
                  >
                    Direct WhatsApp
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Technical FAQ Accordion */}
          <div className="max-w-4xl mx-auto mb-20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Frequently Asked Questions on India's DPDP Act 2023 & Enterprise AI
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer Cross-Links */}
          <div className="border-t border-slate-800 pt-10 text-center">
            <div className="text-xs font-mono text-slate-500 mb-3">Explore Sovereign Architecture Tools</div>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <Link to="/compare" className="text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                <span>Architecture Battlecard Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/tools/multi-agent-token-leakage-simulator" className="text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                <span>Token Leakage Simulator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/tools/enterprise-ai-roi-calculator" className="text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                <span>Enterprise AI ROI Calculator</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-700">•</span>
              <Link to="/solutions" className="text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 transition-colors">
                <span>126 Sovereign Enterprise Solutions</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

        </div>

        {/* Embed Modal Drawer */}
        {isEmbedOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
              <button
                onClick={() => setIsEmbedOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <Code className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Embed DPDP Audit Simulator</h3>
              </div>

              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Copy and paste this HTML snippet into your corporate intranet, legal compliance portal, or developer wiki.
              </p>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 break-all mb-4">
                {embedCode}
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="/embed/dpdp-audit-simulator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Preview Embed View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={copyEmbedSnippet}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-md transition-colors"
                >
                  {hasCopiedEmbed ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{hasCopiedEmbed ? "Copied Snippet!" : "Copy Embed HTML"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WhatsApp Modal */}
        <WhatsAppModal />

      </div>
    </>
  );
}
