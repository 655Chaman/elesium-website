import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
    DollarSign, 
    IndianRupee, 
    ShieldCheck, 
    Clock, 
    TrendingUp, 
    Code, 
    Copy, 
    Check, 
    Download, 
    ChevronDown, 
    ChevronRight, 
    Sparkles, 
    CheckCircle2, 
    Layers, 
    Server, 
    X,
    FileText
} from 'lucide-react';
import { 
    calculateEnterpriseRoi, 
    formatCurrency, 
    INDUSTRY_CONFIGS, 
    Currency, 
    IndustryKey 
} from '../calculator/roiCalculatorModel';
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen';
import { MandateApplicationForm } from '../features/WaitingListForm';
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton';
import { ExitIntentMemoModal } from '../cro/ExitIntentMemoModal';
import { useWhatsApp } from '../../hooks/useWhatsApp';

export default function EnterpriseRoiCalculator() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [currency, setCurrency] = useState<Currency>('INR');
    const [teamSize, setTeamSize] = useState<number>(25);
    const [monthlySalary, setMonthlySalary] = useState<number>(75000);
    const [errorRate, setErrorRate] = useState<number>(8);
    const [industry, setIndustry] = useState<IndustryKey>('logistics');

    // Embed Modal State
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
    const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
    const [hasCopiedEmbed, setHasCopiedEmbed] = useState(false);
    const [showEmbedPreview, setShowEmbedPreview] = useState(false);

    // Active FAQ Accordion State
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    // Currency Switch Handler
    const handleCurrencyChange = (newCurrency: Currency) => {
        if (newCurrency === currency) return;
        setCurrency(newCurrency);
        if (newCurrency === 'USD') {
            setMonthlySalary(2500);
        } else {
            setMonthlySalary(75000);
        }
    };

    const results = useMemo(() => {
        return calculateEnterpriseRoi({
            teamSize,
            monthlySalary,
            errorRate,
            industry,
            currency
        });
    }, [teamSize, monthlySalary, errorRate, industry, currency]);

    const activeIndustry = INDUSTRY_CONFIGS[industry];

    // Normalized visual bars
    const maxBarSpend = Math.max(results.manualAnnualSpend, results.legacySaaSAnnualSpend, 1);
    const manualBarPct = 100;
    const saasBarPct = Math.min(100, Math.round((results.legacySaaSAnnualSpend / maxBarSpend) * 100));
    const elesiumBarPct = Math.min(100, Math.max(8, Math.round((results.elesiumYear1Spend / maxBarSpend) * 100)));

    // Standard Iframe Snippet with Sturm Watermark
    const embedSnippet = `<iframe src="https://elesium.online/embed/roi-calculator" width="100%" height="650" frameborder="0" style="border-radius:12px;border:1px solid #262626;"></iframe><div style="font-size:12px;color:#a3a3a3;text-align:right;margin-top:6px;font-family:sans-serif;">Calculated via <a href="https://elesium.online/solutions" target="_blank" rel="noopener" style="color:#ffffff;text-decoration:underline;">Elesium Enterprise AI Solutions</a></div>`;

    const handleCopyEmbed = () => {
        navigator.clipboard.writeText(embedSnippet);
        setHasCopiedEmbed(true);
        setTimeout(() => setHasCopiedEmbed(false), 2500);
    };

    // CSV Executive Summary Export
    const handleExportCsv = () => {
        const rows = [
            ['Metric', 'Value', 'Unit / Currency'],
            ['Industry Sector', activeIndustry.name, 'Sector'],
            ['Team Size', teamSize.toString(), 'FTEs'],
            ['Average Monthly Salary', monthlySalary.toString(), currency],
            ['Manual Error Rate', `${errorRate}%`, 'Percentage'],
            ['Manual Annual Spend (Year 1)', results.manualAnnualSpend.toString(), currency],
            ['Legacy SaaS Annual Spend (Year 1)', results.legacySaaSAnnualSpend.toString(), currency],
            ['Elesium Sovereign VPC Spend (Year 1)', results.elesiumYear1Spend.toString(), currency],
            ['Net Annual Savings (Year 1)', results.netAnnualSavingsYear1.toString(), currency],
            ['Payback Period', results.paybackPeriodMonths.toString(), 'Months'],
            ['3-Year Cumulative Savings', results.total3YearSavings.toString(), currency],
            ['3-Year ROI Multiple', `${results.roiMultiple3Year}x`, 'Multiple'],
            ['Turnaround Acceleration', `${results.turnaroundAccelerationPct}%`, 'Percent Reduction'],
            ['Baseline Turnaround', activeIndustry.baselineTurnaround, 'Hours / Days'],
            ['Elesium Turnaround', activeIndustry.elesiumTurnaround, 'Minutes / Seconds'],
            ['Annual Hours Recovered', results.annualHoursSaved.toString(), 'Hours']
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `Elesium_Enterprise_AI_ROI_${industry}_${currency}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // FAQs
    const faqs = [
        {
            q: "How does Elesium eliminate per-seat SaaS licensing costs?",
            a: "Traditional enterprise SaaS vendors charge linear $80-$150/user/month seat fees while forcing human workers to manually copy-paste data between screens. Elesium deploys deterministic multi-agent systems directly into your private VPC. You pay for underlying compute and model token ingestion at actual cost, completely decoupling productivity gains from headcount expansion."
        },
        {
            q: "What is included in the Elesium Sovereign Private VPC Architecture?",
            a: "Elesium's architecture includes air-gapped zero-retention LLM inference, LangGraph deterministic state machines, custom database/ERP connectors (SAP RFC, Oracle NetSuite, Salesforce), automated audit trails, and strict DPDP Act 2023 / HIPAA compliance guardrails. All proprietary data remains strictly within your enterprise perimeter."
        },
        {
            q: "How is the 1.5 to 3.5 month payback period mathematically calculated?",
            a: "Payback is determined by dividing the initial fixed pilot implementation investment by your organization's monthly operational run-rate savings (human rework hours recovered + legacy software licenses terminated). Because our pilot sprints deploy in 14 to 21 days, client workflows reach break-even cash-flow positivity within the first fiscal quarter."
        },
        {
            q: "How do you guarantee sub-2-second response latency across complex workflows?",
            a: "We replace fragile single-prompt generalist models with high-speed cyclical DAGs (Directed Acyclic Graphs). Deterministic steps (regex parsing, SQL queries, schema validation) execute in milliseconds, while specialized micro-VLM nodes handle extraction in parallel, ensuring sub-2-second end-to-end operational execution."
        },
        {
            q: "Can third-party websites or financial analysts embed this calculator?",
            a: "Yes. Click 'Embed This Calculator' at the top right to generate a responsive <iframe> snippet. The embed code is 100% free for CFO portals, industry blogs, and tech publications, featuring real-time interactive calculations and a clean attribution watermark."
        }
    ];

    // Structured Data JSON-LD
    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "name": "Enterprise AI ROI & 3-Year TCO Calculator",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "url": "https://elesium.online/tools/enterprise-ai-roi-calculator/",
                "description": "Interactive 3-Year Total Cost of Ownership (TCO) & ROI Calculator for Enterprise AI Automation. Model savings across Logistics, BFSI, Manufacturing, Healthcare, and ERP systems.",
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online"
                }
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Enterprise AI Solutions",
                        "item": "https://elesium.online/solutions/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": "Enterprise AI ROI Calculator",
                        "item": "https://elesium.online/tools/enterprise-ai-roi-calculator/"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "mainEntity": faqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.a
                    }
                }))
            }
        ]
    };

    return (
        <div className="relative min-h-[100dvh] bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Automation ROI & 3-Year TCO Calculator | Elesium</title>
                <meta 
                    name="description" 
                    content="Calculate your exact 3-Year Total Cost of Ownership (TCO) and net capital savings migrating from manual headcount drag and per-seat SaaS to sovereign private VPC multi-agent AI automation." 
                />
                <link rel="canonical" href="https://elesium.online/tools/enterprise-ai-roi-calculator/" />
                <meta property="og:title" content="Enterprise AI Automation ROI & 3-Year TCO Calculator | Elesium" />
                <meta property="og:description" content="Simulate enterprise cost migration from manual operations to sovereign private VPC AI agents. Real-time payback, annual savings, and latency benchmarks." />
                <meta property="og:url" content="https://elesium.online/tools/enterprise-ai-roi-calculator/" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Enterprise AI Automation ROI & 3-Year TCO Calculator | Elesium" />
                <meta name="twitter:description" content="Simulate enterprise cost migration from manual operations to sovereign private VPC AI agents. Real-time payback, annual savings, and latency benchmarks." />
                <script type="application/ld+json">
                    {JSON.stringify(jsonLdData)}
                </script>
            </Helmet>

            {/* Breadcrumb Header */}
            <div className="pt-24 pb-6 px-6 md:px-12 max-w-[1440px] mx-auto">
                <nav className="flex items-center gap-2 text-xs font-mono text-neutral-500 dark:text-neutral-400 mb-6">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-all duration-300">Home</Link>
                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                    <Link to="/solutions/" className="hover:text-black dark:hover:text-white transition-all duration-300">Solutions</Link>
                    <ChevronRight className="w-3 h-3 text-neutral-400" />
                    <span className="text-black dark:text-white font-medium">ROI & TCO Calculator</span>
                </nav>

                {/* Hero Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-neutral-100 dark:border-white/10">
                    <div className="max-w-3xl space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-neutral-400 dark:border-white/15 text-black dark:text-white text-xs font-mono tracking-wide uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            System 2 Interactive Micro-SaaS | CFO & Architecture Decision Engine
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-white leading-[1.15]">
                            Enterprise AI Automation <br />
                            <span className="text-neutral-600 dark:text-neutral-400 ">
                                ROI & 3-Year TCO Calculator
                            </span>
                        </h1>
                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Simulate your organization&apos;s exact capital migration from manual headcount drag and per-seat SaaS tax to sovereign private VPC multi-agent automation. Backed by verified production benchmarks across Indian & Global Enterprises.
                        </p>
                    </div>

                    {/* Action Bar (Embed + Export) */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEmbedModalOpen(true)}
                            className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-all duration-300 shadow-sm"
                        >
                            <Code className="w-3.5 h-3.5 text-black dark:text-white" />
                            Embed on Your Site
                        </button>
                        <button
                            type="button"
                            onClick={handleExportCsv}
                            className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-white/5 hover:bg-neutral-100 dark:hover:bg-white/10 text-neutral-800 dark:text-neutral-200 text-xs font-medium transition-all duration-300 shadow-sm"
                        >
                            <Download className="w-3.5 h-3.5 text-black dark:text-white" />
                            Export Business Case (CSV)
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsMemoModalOpen(true)}
                            className="active:scale-[0.97] inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-neutral-400 dark:border-white/20 bg-white/10 hover:bg-neutral-200/20 text-black dark:text-white text-xs font-semibold transition-all duration-300 shadow-sm"
                        >
                            <FileText className="w-3.5 h-3.5 text-black dark:text-white" />
                            Download Executive Memo
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Interactive Engine Section */}
            <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-8">
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
                    {/* Background Glow */}

<div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Left Configuration Panel (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
                                <div>
                                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">Workflow Parameters</h2>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Tailor assumptions to your enterprise unit</p>
                                </div>

                                {/* Currency Toggle */}
                                <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full p-1 text-xs font-mono">
                                    <button
                                        type="button"
                                        onClick={() => handleCurrencyChange('INR')}
                                        className={`active:scale-[0.97] flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
                                            currency === 'INR'
                                                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                                                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        <IndianRupee className="w-3 h-3" />
                                        INR (₹)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleCurrencyChange('USD')}
                                        className={`active:scale-[0.97] flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
                                            currency === 'USD'
                                                ? 'bg-black text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                                                : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        <DollarSign className="w-3 h-3" />
                                        USD ($)
                                    </button>
                                </div>
                            </div>

                            {/* Industry Selector */}
                            <div className="space-y-2">
                                <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                    1. Target Operational Sector
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                    {(Object.keys(INDUSTRY_CONFIGS) as IndustryKey[]).map((key) => {
                                        const ind = INDUSTRY_CONFIGS[key];
                                        const isSelected = industry === key;
                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setIndustry(key)}
                                                className={`active:scale-[0.97] p-3 rounded-xl text-left transition-all duration-300 border ${
                                                    isSelected
                                                        ? 'bg-neutral-100 dark:bg-white/10 border-neutral-400 dark:border-white/30 text-black dark:text-white font-medium shadow-sm'
                                                        : 'bg-neutral-50/70 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                                                }`}
                                            >
                                                <div className="text-xs font-semibold">{ind.name.split(' ')[0]}</div>
                                                <div className="text-[10px] text-neutral-500 dark:text-neutral-500 font-mono mt-0.5">{ind.tag}</div>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-1">
                                    {activeIndustry.description}
                                </p>
                            </div>

                            {/* Team Size Slider */}
                            <div className="bg-neutral-50/60 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Team Footprint (Knowledge Workers)</span>
                                    <span className="font-mono text-black dark:text-white font-bold text-sm bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/20 px-2.5 py-0.5 rounded-full">
                                        {teamSize} {teamSize === 1 ? 'employee' : 'employees'}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="500"
                                    step="1"
                                    value={teamSize}
                                    onChange={(e) => setTeamSize(Number(e.target.value))}
                                    className="w-full accent-neutral-900 dark:accent-white cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full"
                                />
                                <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">
                                    <span>1 member (Pilot)</span>
                                    <span>50</span>
                                    <span>200</span>
                                    <span>500 members (Dept)</span>
                                </div>
                            </div>

                            {/* Monthly Salary Slider */}
                            <div className="bg-neutral-50/60 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Avg Monthly Fully Loaded Salary / FTE</span>
                                    <span className="font-mono text-black dark:text-white font-bold text-sm bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/20 px-2.5 py-0.5 rounded-full">
                                        {formatCurrency(monthlySalary, currency)}
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min={currency === 'INR' ? 25000 : 500}
                                    max={currency === 'INR' ? 500000 : 10000}
                                    step={currency === 'INR' ? 5000 : 100}
                                    value={monthlySalary}
                                    onChange={(e) => setMonthlySalary(Number(e.target.value))}
                                    className="w-full accent-neutral-900 dark:accent-white cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full"
                                />
                                <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">
                                    <span>{currency === 'INR' ? '₹25k' : '$500'}</span>
                                    <span>{currency === 'INR' ? '₹2.5L (Sr Exec)' : '$5k'}</span>
                                    <span>{currency === 'INR' ? '₹5.0L (Lead/Architect)' : '$10k'}</span>
                                </div>
                            </div>

                            {/* Error & Re-work Rate Slider */}
                            <div className="bg-neutral-50/60 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 space-y-2">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-neutral-800 dark:text-neutral-200 font-medium">Manual Operational Error Rate</span>
                                    <span className="font-mono text-neutral-700 dark:text-neutral-300 font-bold text-sm bg-neutral-100 dark:bg-white/10 border border-neutral-300 dark:border-white/20 px-2.5 py-0.5 rounded-full">
                                        {errorRate}%
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="25"
                                    step="1"
                                    value={errorRate}
                                    onChange={(e) => setErrorRate(Number(e.target.value))}
                                    className="w-full accent-neutral-900 dark:accent-white cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full"
                                />
                                <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">
                                    <span>1% (Precision Audit)</span>
                                    <span>8% (Industry Median)</span>
                                    <span>25% (High Variance Drag)</span>
                                </div>
                            </div>

                            {/* Key Use Cases Checked */}
                            <div className="pt-2">
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-2">
                                    Automated Micro-Agent Sprints
                                </span>
                                <div className="space-y-1.5">
                                    {activeIndustry.keyUseCases.map((useCase) => (
                                        <div key={useCase} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-white flex-shrink-0" />
                                            <span>{useCase}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Real-time Calculations Dashboard (7 cols) */}
                        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                            {/* Primary KPI Header Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Card 1: Net Annual Savings */}
                                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-white/20 rounded-[24px] p-5 relative overflow-hidden shadow-sm">
                                    <div className="text-xs uppercase font-mono tracking-wider text-black dark:text-white mb-1 flex items-center justify-between">
                                        Net Annual Savings
                                        <TrendingUp className="w-4 h-4 text-black dark:text-white" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-neutral-900 dark:text-white tracking-tight">
                                        {formatCurrency(results.netAnnualSavingsYear1, currency, true)}
                                    </div>
                                    <div className="text-xs text-black dark:text-white font-mono mt-1">
                                        Year 1 Cash Flow Positive
                                    </div>
                                </div>

                                {/* Card 2: Payback Period */}
                                <div className="bg-neutral-50/70 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-5 shadow-sm">
                                    <div className="text-xs uppercase font-mono tracking-wider text-neutral-500 dark:text-neutral-400 mb-1 flex items-center justify-between">
                                        Payback Period
                                        <Clock className="w-4 h-4 text-black dark:text-white" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-black dark:text-white tracking-tight">
                                        {results.paybackPeriodMonths} <span className="text-sm font-normal text-neutral-500 dark:text-neutral-400">Months</span>
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1">
                                        3-Year ROI: {results.roiMultiple3Year}x Multiple
                                    </div>
                                </div>

                                {/* Card 3: Latency Cut */}
                                <div className="bg-neutral-50/70 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-5 shadow-sm">
                                    <div className="text-xs uppercase font-mono tracking-wider text-neutral-500 dark:text-neutral-400 mb-1 flex items-center justify-between">
                                        Turnaround Speed
                                        <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-black dark:text-white tracking-tight">
                                        {results.turnaroundAccelerationPct}%
                                    </div>
                                    <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-1 truncate" title={activeIndustry.elesiumTurnaround}>
                                        {activeIndustry.elesiumTurnaround.split('(')[0]}
                                    </div>
                                </div>
                            </div>

                            {/* 3-Way Comparative Visual Bar Chart */}
                            <div className="bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        Year 1 Total Cost of Ownership (TCO) Comparison
                                    </h3>
                                    <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500">All figures in {currency}</span>
                                </div>

                                {/* Bar 1: Current Manual Drag */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-lg bg-neutral-400 dark:bg-neutral-600" />
                                            Current Manual Labor + Operational Error Rework
                                        </span>
                                        <span className="font-bold text-neutral-900 dark:text-neutral-200">
                                            {formatCurrency(results.manualAnnualSpend, currency)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-neutral-400 dark:bg-neutral-600 h-full rounded-lg transition-all duration-300"
                                            style={{ width: `${manualBarPct}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">
                                        Base Payroll: {formatCurrency(results.annualBasePayroll, currency)} + Error Penalties: {formatCurrency(results.errorReworkCost, currency)}
                                    </div>
                                </div>

                                {/* Bar 2: Legacy SaaS Off-the-Shelf */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-lg bg-neutral-600 dark:bg-neutral-400" />
                                            Legacy Off-the-Shelf SaaS (Per-Seat Licensing Tax)
                                        </span>
                                        <span className="font-bold text-neutral-700 dark:text-neutral-300">
                                            {formatCurrency(results.legacySaaSAnnualSpend, currency)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-neutral-600 dark:bg-neutral-400 h-full rounded-lg transition-all duration-300"
                                            style={{ width: `${saasBarPct}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-neutral-500 dark:text-neutral-500 font-mono">
                                        Per-seat fee + Integrations + 45% manual overhead retained
                                    </div>
                                </div>

                                {/* Bar 3: Elesium Sovereign VPC */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-mono">
                                        <span className="text-black dark:text-white font-semibold flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-lg bg-neutral-400" />
                                            Elesium Sovereign Private VPC Architecture (Year 1)
                                        </span>
                                        <span className="font-bold text-black dark:text-white">
                                            {formatCurrency(results.elesiumYear1Spend, currency)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-3 overflow-hidden">
                                        <div 
                                            className="bg-black dark:bg-white h-full rounded-lg transition-all duration-300"
                                            style={{ width: `${elesiumBarPct}%` }}
                                        />
                                    </div>
                                    <div className="text-[10px] text-black dark:text-white font-mono">
                                        Includes pilot sprint + private VPC token compute + 15% supervisory human review
                                    </div>
                                </div>
                            </div>

                            {/* 3-Year TCO Projection Table */}
                            <div className="bg-neutral-50/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-[24px] p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                                        3-Year Total Cost of Ownership (TCO) Ledger
                                    </h3>
                                    <span className="text-xs font-bold font-mono text-black dark:text-white">
                                        Cumulative Net Savings: {formatCurrency(results.total3YearSavings, currency, true)}
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs font-mono text-left">
                                        <thead>
                                            <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400">
                                                <th className="py-2 pr-3">Horizon</th>
                                                <th className="py-2 px-3 text-neutral-900 dark:text-neutral-200">Manual Headcount</th>
                                                <th className="py-2 px-3 text-neutral-700 dark:text-neutral-300">Legacy SaaS</th>
                                                <th className="py-2 px-3 text-black dark:text-white">Elesium Sovereign</th>
                                                <th className="py-2 pl-3 text-right text-black dark:text-white">Net Retained</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                            {results.yearByYear.map((row) => (
                                                <tr key={row.year} className="hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30">
                                                    <td className="py-2 pr-3 font-semibold text-neutral-900 dark:text-white">Year {row.year}</td>
                                                    <td className="py-2 px-3 text-neutral-600 dark:text-neutral-300">{formatCurrency(row.manualCost, currency, true)}</td>
                                                    <td className="py-2 px-3 text-neutral-600 dark:text-neutral-300">{formatCurrency(row.legacySaaS, currency, true)}</td>
                                                    <td className="py-2 px-3 font-semibold text-black dark:text-white">{formatCurrency(row.elesiumCost, currency, true)}</td>
                                                    <td className="py-2 pl-3 text-right font-bold text-black dark:text-white">+{formatCurrency(row.netSavings, currency, true)}</td>
                                                </tr>
                                            ))}
                                            <tr className="font-bold bg-neutral-100/50 bg-white/[0.05] text-neutral-900 dark:text-white">
                                                <td className="py-2.5 pr-3">3-Yr Total</td>
                                                <td className="py-2.5 px-3 text-neutral-900 dark:text-neutral-200">{formatCurrency(results.manual3YearSpend, currency, true)}</td>
                                                <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300">{formatCurrency(results.legacySaaS3YearSpend, currency, true)}</td>
                                                <td className="py-2.5 px-3 text-black dark:text-white">{formatCurrency(results.elesium3YearSpend, currency, true)}</td>
                                                <td className="py-2.5 pl-3 text-right text-black dark:text-white font-extrabold">+{formatCurrency(results.total3YearSavings, currency, true)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Direct CTA Box with WhatsApp & Modal Option */}
                            <div className="pt-2 flex flex-wrap items-center gap-3">
                                <button
                                    onClick={openWhatsApp}
                                    className="active:scale-[0.97] px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-semibold text-xs transition-all duration-300 flex items-center gap-2 shadow-sm"
                                >
                                    <span className="w-2 h-2 rounded-lg bg-black" />
                                    Chat on WhatsApp to Lock Projected ROI
                                </button>

                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <InteractiveHoverButton className="h-10 px-5 text-xs font-medium justify-center border-neutral-200 dark:border-white/10">
                                            Submit Architecture Mandate
                                        </InteractiveHoverButton>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <MandateApplicationForm source="Enterprise ROI Calculator Page" />
                                    </ExpandableScreenContent>
                                </ExpandableScreen>

                                <Link
                                    to={`/waitlist?roi=${currency === 'INR' ? (results.netAnnualSavingsYear1 / 100000).toFixed(1) : (results.netAnnualSavingsYear1 / 1000).toFixed(0)}&team=${teamSize}&industry=${industry}&ref=roi-calculator`}
                                    className="px-4 py-2.5 rounded-full border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/5 text-neutral-600 dark:text-neutral-400 text-xs font-mono transition-all duration-300"
                                >
                                    ele-in SaaS Waitlist &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep Architectural Comparison Section */}
            <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    <div className="text-center space-y-3">
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-black dark:text-white bg-white/10 px-3 py-1 rounded-full border border-neutral-400 dark:border-white/15">
                            CFO & CTO Architectural Mandate
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            Why Legacy SaaS Fails Enterprises, and Why Sovereign VPCs Win
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                            The fundamental breakdown between subscription software and custom sovereign automation, explained in financial and architectural reality.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Box 1: The SaaS Trap */}
                        <div className="bg-red-50/30 dark:bg-red-950/10 border border-red-200 dark:border-red-900/30 rounded-[24px] p-6 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">
                                The Off-the-Shelf SaaS Trap
                            </h3>
                            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span><strong>Linear Headcount Tax:</strong> $80 to $150 per seat fees compound annually. As your operational volume grows, your software bill scales linearly without removing manual copy-paste overhead.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span><strong>Public Multi-Tenant Risk:</strong> Proprietary data flows into shared US multi-tenant clouds, violating Indian DPDP Act 2023, RBI digital lending frameworks, and European GDPR data sovereignty.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">•</span>
                                    <span><strong>Fragile Generic Connectors:</strong> Brittle API hooks break on customized SAP RFCs, legacy Oracle databases, or proprietary ERP schemas.</span>
                                </li>
                            </ul>
                        </div>

                        {/* Box 2: The Elesium VPC Solution */}
                        <div className="bg-neutral-100/30 bg-white/[0.05] border border-neutral-200 dark:border-white/15 border-neutral-200 dark:border-white/15 rounded-[24px] p-6 space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-neutral-400 dark:border-white/15 flex items-center justify-center text-black dark:text-white">
                                <Server className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-semibold text-black dark:text-white">
                                Elesium Sovereign Private VPC Architecture
                            </h3>
                            <ul className="space-y-2.5 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-black dark:text-white font-bold">•</span>
                                    <span><strong>Fixed-Cost Automation:</strong> Multi-agent systems execute in your own private cloud. You pay zero per-seat fees, saving up to 82% over a 3-year operating horizon.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-black dark:text-white font-bold">•</span>
                                    <span><strong>100% Air-Gapped Data Sovereignty:</strong> Customer records, bank statements, and proprietary blueprints never leave your VPC perimeter. Zero training retention guaranteed.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-black dark:text-white font-bold">•</span>
                                    <span><strong>Deterministic Sub-2s Latency:</strong> LangGraph cyclical state machines enforce hard validation schemas, error fallback states, and enterprise-grade SLAs.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Deep FAQ Section */}
            <div className="px-6 md:px-12 max-w-[1440px] mx-auto py-12 border-t border-neutral-100 dark:border-white/10">
                <div className="max-w-3xl mx-auto space-y-6">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900 dark:text-white">
                            Enterprise Procurement & Architectural FAQ
                        </h2>
                        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                            Transparent engineering methodology answering core C-suite procurement standards.
                        </p>
                    </div>

                    <div className="divide-y divide-neutral-200 dark:divide-white/10">
                        {faqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx;
                            return (
                                <div key={faq.q} className="py-4">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="active:scale-[0.97] w-full flex items-center justify-between text-left text-sm sm:text-base font-medium text-neutral-900 dark:text-white hover:text-black dark:hover:text-white dark:hover:text-black dark:hover:text-white transition-all duration-300"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isOpen && (
                                        <p className="mt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed pr-6">
                                            {faq.a}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Call to Action Card */}
            <section className="px-6 md:px-12 max-w-[1440px] mx-auto pb-16">
                <div className="relative overflow-hidden p-8 sm:p-12 md:p-16 rounded-[24px] border border-neutral-200 dark:border-white/10 bg-black text-white dark:bg-[#0A0A0A] shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                            <span className="w-2 h-2 rounded-lg bg-neutral-400" />
                            <span>CFO & CTO Architecture Audit Desk</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            Lock In Your Verified Enterprise ROI with Our Systems Pod
                        </h2>

                        <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-400 leading-relaxed">
                            Connect directly with our engineering architects to validate your headcount costs, legacy SaaS spend, and custom air-gapped deployment ROI in a confidential 30-minute review.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                            <button
                                onClick={openWhatsApp}
                                className="active:scale-[0.97] w-full sm:w-auto h-11 px-6 rounded-full bg-white text-black hover:bg-neutral-100 font-semibold text-xs sm:text-sm transition-all duration-300 duration-200 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-lg bg-black" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto h-11 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <span>ele-in SaaS Waitlist</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                        <img src="/assets/logo-square.png" alt="Elesium" width="384" height="384" loading="lazy" className="w-96 h-96 object-contain filter invert" />
                    </div>
                </div>
            </section>

            {/* 'Embed This Calculator' Modal */}
            {isEmbedModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-[28px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative">
                        <button
                            type="button"
                            onClick={() => setIsEmbedModalOpen(false)}
                            className="active:scale-[0.97] absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all duration-300"
                            aria-label="Close embed modal"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/[0.04] border border-neutral-400 dark:border-white/15 flex items-center justify-center text-neutral-700 dark:text-neutral-200">
                                    <Code className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Embed This Calculator on Your Site</h3>
                                    <p className="text-xs text-neutral-400">Free interactive micro-SaaS asset for CFO, tech, and enterprise blogs</p>
                                </div>
                            </div>

                            <p className="text-xs text-neutral-300 leading-relaxed">
                                Copy and paste the HTML snippet below into your CMS, blog, or research portal. The widget automatically recalculates live ROI in an elegant, responsive iframe with dark-mode styling.
                            </p>

                            <div className="relative bg-neutral-950 border border-neutral-800 rounded-[18px] p-3 font-mono text-[11px] text-neutral-300 break-all leading-normal">
                                {embedSnippet}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowEmbedPreview(!showEmbedPreview)}
                                    className="active:scale-[0.97] text-xs text-neutral-700 dark:text-neutral-200 hover:underline font-mono"
                                >
                                    {showEmbedPreview ? 'Hide Live Preview' : 'Show Live Preview'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleCopyEmbed}
                                    className={`active:scale-[0.97] px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-300 ${
                                        hasCopiedEmbed
                                            ? 'bg-white text-black'
                                            : 'bg-white hover:bg-neutral-200 text-black'
                                    }`}
                                >
                                    {hasCopiedEmbed ? (
                                        <>
                                            <Check className="w-3.5 h-3.5" />
                                            Copied to Clipboard!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" />
                                            Copy Embed Snippet
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Live Preview Accordion */}
                            {showEmbedPreview && (
                                <div className="mt-4 pt-4 border-t border-neutral-800 max-h-[350px] overflow-y-auto rounded-xl">
                                    <div className="text-[10px] font-mono uppercase text-neutral-500 mb-2">Live Embed Preview (650px container):</div>
                                    <iframe 
                                        src="/embed/roi-calculator" 
                                        width="100%" 
                                        height="350" 
                                        className="rounded-xl border border-neutral-800 bg-neutral-950"
                                        title="Elesium ROI Calculator Preview"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Exit Intent Executive Memo Modal */}
            <ExitIntentMemoModal
                toolName="Enterprise AI ROI & TCO Calculator"
                isOpenOverride={isMemoModalOpen ? true : undefined}
                onCloseOverride={() => setIsMemoModalOpen(false)}
                simulatedMetrics={[
                    { label: 'Year 1 Net Savings', value: formatCurrency(results.netAnnualSavingsYear1, currency) },
                    { label: 'Payback Period', value: `${results.paybackPeriodMonths} Months` },
                    { label: 'Turnaround Cut', value: `${results.turnaroundAccelerationPct}%` },
                    { label: '3-Year Sovereign TCO', value: formatCurrency(results.elesium3YearSpend, currency) }
                ]}
            />
            <WhatsAppModal />
        </div>
    );
}
