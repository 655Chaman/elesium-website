import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, Shield, Network, Zap, Code2, Lock, ArrowRight, CheckCircle2, Calculator, MessageSquare, Calendar, ChevronRight, ChevronDown } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const agentWorkflows = {
    bfsi: {
        name: "BFSI Underwriting Agent",
        badge: "Banking & NBFC",
        color: "text-white",
        border: "border-white/20",
        lines: [
            "> Initializing Agent_BFSI [Underwriting_VLM_V2]...",
            "> Ingesting 48-page audited financial PDF (GST + ITR + P&L)...",
            "[OK] Document parsed via Azure Document Intelligence in 0.8s.",
            "> Reconciling 1,420 bank statement line items with GST returns...",
            "[ALERT] Zero discrepancies detected. Debt service ratio: 1.42.",
            "> Executing fraud heuristics & MCA corporate registry check...",
            "[SUCCESS] Underwriting memo compiled. Risk Score: Tier-1 Prime.",
            "[COMPLETE] Time elapsed: 1.9s. Manual hours saved: 14.5 hours."
        ]
    },
    supply_chain: {
        name: "SAP Supply Chain Agent",
        badge: "Manufacturing & ERP",
        color: "text-white",
        border: "border-white/20",
        lines: [
            "> Initializing Agent_SCM [SAP_RFC_Synchronizer]...",
            "> Connecting to SAP S/4HANA on private VPC (10.0.4.12)...",
            "[OK] SAP Session authenticated with read/write ledger rights.",
            "> Monitoring 84 assembly component inventory levels...",
            "[WARN] Silicon carbide inventory projected stockout in 72h.",
            "> Evaluating 6 verified suppliers against macroeconomic price index...",
            "> Drafting auto-purchase requisition #PO-94812 with approved vendor...",
            "[SUCCESS] SAP PO committed. Dispatched approval prompt to CFO WhatsApp.",
            "[COMPLETE] Stockout averted. Saved: ₹18.4L in downtime penalties."
        ]
    },
    sales_ops: {
        name: "Enterprise Revenue Agent",
        badge: "Revenue Ops & CRM",
        color: "text-white",
        border: "border-white/20",
        lines: [
            "> Initializing Agent_REV [Enterprise_Sales_Orchestrator]...",
            "> Scanning 4,203 open pipeline accounts across Salesforce & HubSpot...",
            "[OK] CRM authenticated. Ingesting Q3 corporate earnings signals...",
            "> Identified 14 Tier-1 accounts showing active AI modernization intent.",
            "> Synthesizing bespoke 1-pager technical blueprints per account...",
            "> Simulating CXO engagement probability: 89.4% confidence.",
            "[SUCCESS] 14 tailored briefs dispatched to Enterprise AE queue.",
            "[COMPLETE] Operation completed in 2.4s. Human hours saved: 18h."
        ]
    }
}

type AgentKey = keyof typeof agentWorkflows

const AgentTerminal = () => {
    const [activeAgent, setActiveAgent] = useState<AgentKey>('bfsi')
    const [lines, setLines] = useState<string[]>([])

    useEffect(() => {
        let isCancelled = false
        let currentIndex = 0
        let timeoutId: NodeJS.Timeout

        setLines([])
        const currentLines = agentWorkflows[activeAgent].lines

        const typeNextLine = () => {
            if (isCancelled) return

            if (currentIndex < currentLines.length) {
                const nextLine = currentLines[currentIndex]
                setLines(prev => [...prev, nextLine])
                currentIndex++
                timeoutId = setTimeout(typeNextLine, 650)
            } else {
                timeoutId = setTimeout(() => {
                    if (isCancelled) return
                    setLines([])
                    currentIndex = 0
                    timeoutId = setTimeout(typeNextLine, 650)
                }, 6000)
            }
        }

        timeoutId = setTimeout(typeNextLine, 300)

        return () => {
            isCancelled = true
            clearTimeout(timeoutId)
        }
    }, [activeAgent])

    return (
        <div className="bg-black border border-white/10 rounded-xl p-6 font-mono text-xs md:text-sm relative overflow-hidden">
            {/* Terminal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-700 border border-neutral-600" />
                    <div className="w-2.5 h-2.5 rounded-full bg-neutral-500 border border-neutral-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    <span className="ml-2 text-neutral-400 text-xs">elesium_runtime_v2.6.sh</span>
                </div>

                {/* Workflow Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg border border-white/10">
                    {(Object.keys(agentWorkflows) as AgentKey[]).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveAgent(key)}
                            className={`px-3 py-1 rounded-md text-xs font-sans font-medium transition-all ${
                                activeAgent === key 
                                    ? 'bg-white text-black font-semibold' 
                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {agentWorkflows[key].badge}
                        </button>
                    ))}
                </div>
            </div>

            {/* Current Active Workflow Subheading */}
            <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-semibold text-white">
                    {agentWorkflows[activeAgent].name}
                </span>
                <span className="text-neutral-400 font-mono text-[10px] tracking-wider uppercase">
                    Status: RUNNING ON PRIVATE VPC
                </span>
            </div>

            {/* Terminal Body */}
            <div className="space-y-2 h-[260px] flex flex-col justify-end overflow-hidden">
                {lines.map((line, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={`terminal-line-${activeAgent}-${i}`}
                        className={`leading-relaxed ${
                            line.startsWith('[SUCCESS]') || line.startsWith('[COMPLETE]') 
                                ? 'text-white font-bold' 
                                : line.startsWith('[OK]') 
                                    ? 'text-neutral-200' 
                                    : line.startsWith('[WARN]') || line.startsWith('[ALERT]')
                                        ? 'text-neutral-300'
                                        : 'text-neutral-400'
                        }`}
                    >
                        {line}
                    </motion.div>
                ))}
                <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-2 h-4 bg-white inline-block mt-1"
                />
            </div>
        </div>
    )
}

const pricingAnswerCapsule = "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate, private VPC zero-retention deployments, and sub-2s automated latency across SAP, Oracle, and legacy databases."

interface PricingTier {
    tierCode: string
    name: string
    priceFormatted: string
    priceSubtext: string
    features: string[]
    schemaOffer: {
        "@type": "Offer"
        name: string
        description: string
        priceSpecification: {
            "@type": "PriceSpecification"
            priceCurrency: "INR"
            minPrice?: string
            maxPrice?: string
            price?: string
            unitText?: string
        }
    }
    highlighted?: boolean
    buttonLabel: string
    whatsappTier: string
    whatsappBudget: string
}

const enterprisePricingTiers: PricingTier[] = [
    {
        tierCode: "Tier 1 // 14-Day Sprint",
        name: "Pilot Architecture Sprint",
        priceFormatted: "₹1,50,000 - ₹3,50,000",
        priceSubtext: "($2,000 - $4,500 USD) • Fixed Investment",
        features: [
            "Single-Process Deterministic Agent",
            "Private Cloud Staging Deployment",
            "FastAPI + LangGraph Architecture",
            "14-Day Delivery Guarantee"
        ],
        schemaOffer: {
            "@type": "Offer",
            name: "Pilot Architecture Sprint",
            description: "Single-Process Deterministic Agent, Private Cloud Staging Deployment, FastAPI + LangGraph Architecture, 14-Day Delivery Guarantee.",
            priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: "150000",
                maxPrice: "350000",
                priceCurrency: "INR"
            }
        },
        buttonLabel: "Deploy Pilot Sprint",
        whatsappTier: "Pilot Architecture Sprint",
        whatsappBudget: "₹1,50,000 - ₹3,50,000"
    },
    {
        tierCode: "Tier 2 // Production Suite",
        name: "Enterprise Multi-Agent Suite",
        priceFormatted: "₹6,00,000 - ₹15,00,000",
        priceSubtext: "($7,500 - $18,000 USD) • Milestone-Based",
        features: [
            "Multi-Agent Collaborative Triad (LangGraph)",
            "Private VPC / Zero-Data-Retention Deployment",
            "Deep Legacy ERP/SAP & SQL Integration",
            "99.9% Production SLA & 90-Day ROI Guarantee"
        ],
        schemaOffer: {
            "@type": "Offer",
            name: "Enterprise Multi-Agent Suite",
            description: "Multi-Agent Collaborative Triad (LangGraph), Private VPC / Zero-Data-Retention Deployment, Deep Legacy ERP/SAP & SQL Integration, 99.9% Production SLA & 90-Day ROI Guarantee.",
            priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: "600000",
                maxPrice: "1500000",
                priceCurrency: "INR"
            }
        },
        highlighted: true,
        buttonLabel: "Deploy Enterprise Suite",
        whatsappTier: "Enterprise Multi-Agent Suite",
        whatsappBudget: "₹6,00,000 - ₹15,00,000"
    },
    {
        tierCode: "Tier 3 // Continuous Pod",
        name: "Autonomous Engineering Pod",
        priceFormatted: "₹4,50,000 / month",
        priceSubtext: "($5,500 / month USD) • 12-Month Retainer",
        features: [
            "3 Dedicated AI Systems Engineers + Architect",
            "Continuous Fine-Tuning & Vector Optimization",
            "Omnichannel Voice + WhatsApp Systems",
            "1-Hour Critical Incident Response SLA"
        ],
        schemaOffer: {
            "@type": "Offer",
            name: "Autonomous Engineering Pod",
            description: "3 Dedicated AI Systems Engineers + Architect, Continuous Fine-Tuning & Vector Optimization, Omnichannel Voice + WhatsApp Systems, 1-Hour Critical Incident Response SLA.",
            priceSpecification: {
                "@type": "PriceSpecification",
                price: "450000",
                priceCurrency: "INR",
                unitText: "MONTH"
            }
        },
        buttonLabel: "Retain Engineering Pod",
        whatsappTier: "Autonomous AI Engineering Pod",
        whatsappBudget: "₹4,50,000 / month"
    }
]

const faqs = [
    {
        question: "What is a leading AI automation agency in India?",
        answer: "If you need basic Zapier workflows, hire a freelancer. If you require deterministic, autonomous multi-agent infrastructure that connects directly to SAP S/4HANA via SAP RFC connectors, reconciles 1,420+ ledger items in 1.9s, and complies with DPDP Act 2023 and ISO 27001, Elesium is India's leading AI automation agency. We engineer production Python LangGraph state machines delivering verified 3.5x ROI within 90 days."
    },
    {
        question: "How much does AI automation cost in India?",
        answer: "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate, private VPC zero-retention deployments, and sub-2s automated latency across SAP, Oracle, and legacy databases. Ongoing engineering pods are retained at ₹4,50,000/month."
    },
    {
        question: "What AI automation services does Elesium offer?",
        answer: "Elesium deploys four production-grade AI services: Agentic AI Workflows via Python and LangGraph, air-gapped private VPC LLM deployments (Llama 3, DeepSeek) with zero data retention, automated ETL pipelines that cut document turnaround by 98%, and WhatsApp-first enterprise routing complying with RBI digital lending guidelines and DPDP Act 2023."
    },
    {
        question: "How long does AI automation implementation take?",
        answer: "Unlike legacy IT firms quoting 6 to 12 months, Elesium deploys production-ready pilot agents in 14 business days. Full multi-agent enterprise orchestration across SAP ERP, core banking, and CRM databases reaches complete production scale within 6 to 12 weeks, backed by 99.9% uptime SLAs and a strict 90-day cash-flow positive ROI guarantee."
    },
    {
        question: "Which industries benefit most from AI automation in India?",
        answer: "High-compliance Indian sectors drowning in manual routing experience the highest ROI: BFSI (cutting credit underwriting latency from 14.5 hours to 1.9s under RBI guidelines), Manufacturing (averting ₹18.4L in stockout penalties via SAP RFC connectors), Healthcare (HIPAA/DPDP Act 2023 compliant medical extraction), and Enterprise SaaS (saving 10,000+ human operational hours)."
    }
]

export default function AIAutomationIndia() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    const [intakeWorkflow, setIntakeWorkflow] = useState('Document Extraction & Invoice Reconciliation');
    const [intakeErp, setIntakeErp] = useState('SAP / Oracle NetSuite');
    const [intakeHours, setIntakeHours] = useState(80);
    const [intakeSecurity, setIntakeSecurity] = useState('Private VPC (AWS/GCP India) - Zero Retention');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

    const calculatedAnnualHoursSaved = Math.round(intakeHours * 50 * 0.82);
    const calculatedAnnualCostSavings = calculatedAnnualHoursSaved * 1250;
    const recommendedSprint = intakeHours <= 40 
        ? 'Tier 1: Pilot Architecture Sprint (₹1.5L - ₹3.5L)' 
        : intakeHours <= 150 
            ? 'Tier 2: Enterprise Multi-Agent Suite (₹6L - ₹15L)' 
            : 'Tier 3: Autonomous AI Engineering Pod (₹4.5L/mo Retainer)';

    const handleTransmitIntake = () => {
        const text = `Hello Elesium Architecture Team,\n\nI completed the Enterprise AI Architecture Intake on elesium.online:\n• Workflow Focus: ${intakeWorkflow}\n• Core ERP/Stack: ${intakeErp}\n• Current Manual Load: ${intakeHours} hours/week\n• Security Constraint: ${intakeSecurity}\n• Projected Annual Hours Saved: ${calculatedAnnualHoursSaved.toLocaleString('en-IN')} hrs\n• Projected Annual Cost Savings: ₹${calculatedAnnualCostSavings.toLocaleString('en-IN')}\n• Recommended Tier: ${recommendedSprint}\n\nPlease share the bespoke technical feasibility blueprint and proof-of-concept timeline.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/918317329312?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };

    const handleTierWhatsApp = (tierName: string, budget: string) => {
        const text = `Hello Elesium Engineering Team,\n\nI want to initiate the ${tierName} (${budget}) for our enterprise.\n\nPlease share your architecture roadmap and onboarding availability.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/918317329312?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };

    return (
        <main id="main-content" className="pt-24 pb-20 min-h-screen bg-white dark:bg-black transition-colors duration-300 relative z-10 overflow-hidden">
            <Helmet>
                <title>Enterprise AI &amp; Automation Engineering in India | Elesium</title>
                <meta name="description" content="Enterprise AI automation engineering in India. Custom LangGraph multi-agent workflows, sub-200ms ERP synchronization, and contractual enterprise 90-day ROI." />
                <link rel="canonical" href="https://elesium.online/ai-automation-agency-india/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Enterprise AI &amp; Automation Engineering in India | Elesium" />
                <meta property="og:description" content="Enterprise AI automation engineering in India. Custom LangGraph multi-agent workflows, sub-200ms ERP synchronization, and contractual enterprise 90-day ROI." />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta property="og:url" content="https://elesium.online/ai-automation-agency-india/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_ai" />
                <meta name="twitter:title" content="Enterprise AI &amp; Automation Engineering in India | Elesium" />
                <meta name="twitter:description" content="Enterprise AI automation engineering in India. Custom LangGraph multi-agent workflows, sub-200ms ERP synchronization, and contractual enterprise 90-day ROI." />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
            </Helmet>

            <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-8" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-black dark:text-white">Enterprise AI Engineering India</span>
                </nav>
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    className="text-center max-w-5xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-black dark:text-white text-xs font-mono uppercase tracking-widest mb-8">
                        Enterprise AI &amp; Automation Engineering • Bengaluru • DPDP Act 2023 Compliant
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-8 leading-[1.08]">
                        Enterprise AI &amp; Automation Engineering in India
                    </h1>

                    <h2 className="text-xl md:text-2xl text-neutral-800 dark:text-neutral-200 mb-6 font-medium max-w-4xl mx-auto leading-snug">
                        Replacing 40-hour manual bottlenecks with <span className="underline decoration-black/40 dark:decoration-white/40 underline-offset-4 font-semibold">deterministic, autonomous multi-agent systems</span> deployed on your private VPC.
                    </h2>

                    <div className="answer-capsule bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 border-l-4 border-l-black dark:border-l-white rounded-xl p-5 mb-8 text-left max-w-3xl mx-auto">
                        <div className="text-xs font-mono font-bold uppercase tracking-wider text-black dark:text-white mb-1.5">
                            National Engineering Executive Summary • AEO Answer Capsule
                        </div>
                        <p className="text-base sm:text-lg text-black dark:text-white leading-relaxed font-medium m-0">
                            Elesium is an enterprise AI automation firm in Bangalore, India, engineering deterministic multi-agent systems via LangGraph, Python FastAPI, and private VPC infrastructure. We eliminate 40-hour manual bottlenecks across SAP, Oracle, and BFSI workflows, cutting turnaround times by 98% while ensuring 100% compliance with India's DPDP Act 2023.
                        </p>
                    </div>

                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        We engineer fault-tolerant agentic infrastructure that integrates deeply with SAP, Oracle, and enterprise databases, delivering an audited ROI within 90 days.
                    </p>

                    {/* Dual Conversion Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link 
                            to="/waitlist/" 
                            className="w-full sm:w-auto h-11 px-6 rounded-lg border border-neutral-200 dark:border-white/20 text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-950 active:scale-[0.97] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    {/* Video Masterclass Architecture Teardown Link */}
                    <div className="flex justify-center mb-10">
                        <Link
                            to="/videos/enterprise-ai-automation-india-2026/"
                            className="group inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all duration-200"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-xs">
                                ▶
                            </span>
                            <div className="text-left">
                                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
                                    <span>Watch Video Masterclass (12:45)</span>
                                </div>
                                <div className="text-xs md:text-sm font-medium text-black dark:text-white transition-colors">
                                    Autonomous Enterprise Agent Architecture Teardown &rarr;
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Live Metric Pills */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-neutral-200 dark:border-white/10 text-left font-mono">
                        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Speed to Pilot</div>
                            <div className="text-lg font-bold text-black dark:text-white mt-0.5">14 Days</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Avg 1-Year ROI</div>
                            <div className="text-lg font-bold text-black dark:text-white mt-0.5">3.5x Capital</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Data Security</div>
                            <div className="text-lg font-bold text-black dark:text-white mt-0.5">Zero Retention</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10">
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 uppercase">Legacy Stack</div>
                            <div className="text-lg font-bold text-black dark:text-white mt-0.5">SAP / Oracle</div>
                        </div>
                    </div>
                </motion.div>

                {/* Description & Tech Stack Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="mb-14 md:mb-16"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-medium text-black dark:text-white mb-6">
                                Engineering Sovereign Enterprise Infrastructure
                            </h2>
                            <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 mb-6 leading-relaxed">
                                <strong className="text-black dark:text-white font-semibold">
                                    Elesium deploys deterministic LangGraph state machines and private VPC microservices across Indian enterprises, replacing fragile RPA wrappers with autonomous agents. Operating with sub-2.0s API latency and zero data retention, our architectures execute complex SAP RFC connectors and bank reconciliations while strictly adhering to DPDP Act 2023 and ISO 27001 standards.
                                </strong>
                            </p>
                            <div className="space-y-6 text-lg text-neutral-600 dark:text-neutral-400">
                                <p>
                                    As Indian enterprises scale rapidly, manual data entry and fragmented legacy systems become operational bottlenecks. Elesium builds custom AI architectures configured for your proprietary data, engineered for teams requiring deterministic, fault-tolerant AI agents that execute multi-step workflows autonomously.
                                </p>
                                <p>
                                    We leverage <strong>LangGraph, custom Python execution environments, vector databases (Pinecone/Weaviate), and private fine-tuned LLMs</strong>. Whether processing massive unstructured supply-chain documents or building multi-agent revenue operations, we deliver compliance-ready infrastructure built for enterprise scale.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <AgentTerminal />
                        </div>
                    </div>
                </motion.div>

                {/* Why Choose Elesium Section */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-6">Why Engineering Teams Choose Elesium</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Indian enterprises choose Elesium over legacy IT vendors because we engineer production-grade Python LangGraph agents rather than fragile low-code wrappers. Deploying on air-gapped private VPCs with zero data retention, our systems deliver verified 3.5x first-year capital ROI, 98% turnaround reductions, and compliance with RBI digital lending guidelines and DPDP Act 2023.
                            </strong>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: "Custom Architecture, Not Zapier", desc: "We build custom Python LangGraph multi-agent systems connecting to SAP S/4HANA via SAP RFC connectors, achieving 1.9s execution latency." },
                            { title: "Deterministic Agentic Execution", desc: "Our agentic workflows use LangGraph state machines, Pydantic guardrails, and automated fallbacks to ensure 99.9% deterministic execution accuracy." },
                            { title: "Private VPC & Air-Gapped Deployments", desc: "For BFSI and healthcare, we deploy models (Llama 3, DeepSeek) locally on AWS/GCP India private VPCs with zero data retention, fully compliant with DPDP Act 2023 and ISO 27001." },
                            { title: "Hard 3.5x ROI in 90 Days", desc: "We map every deployment to a financial metric. By eliminating 40+ manual weekly hours at ₹1,250/hr, clients achieve an average 3.5x first-year ROI, saving up to ₹18.4L per workflow." },
                            { title: "Enterprise Systems Integration", desc: "Deep bidirectional connectors into SAP, Oracle NetSuite, Salesforce, SQL Server, and encrypted WhatsApp Business APIs adhering to RBI digital lending guidelines." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 bg-neutral-50 dark:bg-neutral-950 p-6 rounded-xl border border-neutral-200 dark:border-white/10">
                                <CheckCircle2 className="w-8 h-8 text-black dark:text-white flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-medium text-black dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Competitive Comparison Matrix: Elesium vs Traditional IT & Big 4 */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-200 dark:border-white/10">
                            Enterprise Architectural Evaluation
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mt-4 mb-6">
                            Elesium vs Legacy IT &amp; Big 4 Consultancies
                        </h2>
                        <p className="text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-3xl mx-auto leading-relaxed">
                            Indian enterprises are replacing 18-month time-and-materials IT contracts with Elesium’s 14-day deterministic AI engineering pods. Compare the architectural, economic, and compliance realities below.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto overflow-hidden rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 w-1/4">Evaluation Dimension</th>
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-black dark:text-white bg-neutral-100 dark:bg-white/[0.04] w-5/12">
                                            Elesium Sovereign Pods
                                        </th>
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 w-1/3">
                                            Traditional IT (TCS, Infosys) &amp; Big 4
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-white/10 text-sm">
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-black dark:text-white">Deployment Velocity</td>
                                        <td className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.02] text-black dark:text-white font-medium">
                                            14 to 30 days to live production deployment with calibrated Python LangGraph state machines.
                                        </td>
                                        <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                                            12 to 18 months discovery, committee sign-offs, and prolonged waterfall staging.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-black dark:text-white">Commercial Model &amp; SLA</td>
                                        <td className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.02] text-black dark:text-white font-medium">
                                            Contractually committed 90-day cash-flow ROI SLA with fixed-scope milestone delivery.
                                        </td>
                                        <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                                            Open-ended Time &amp; Materials (T&amp;M) billing that incentivizes scope creep and billable hour bloat.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-black dark:text-white">Code Ownership &amp; IP</td>
                                        <td className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.02] text-black dark:text-white font-medium">
                                            100% client-owned sovereign repository. Zero platform lock-in, zero per-seat license taxes.
                                        </td>
                                        <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                                            Proprietary framework lock-in, recurring multi-year managed service fees, and non-transferable IP.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-black dark:text-white">Engineering Seniority</td>
                                        <td className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.02] text-black dark:text-white font-medium">
                                            Direct daily pairing with Principal Systems Architects (Ex-Founders, Senior Systems Engineers).
                                        </td>
                                        <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                                            Pitched by partners; staffed by junior batch hires managed by non-technical account executives.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-black dark:text-white">DPDP &amp; Data Residency</td>
                                        <td className="p-4 sm:p-5 bg-neutral-50/70 dark:bg-white/[0.02] text-black dark:text-white font-medium">
                                            Air-gapped private VPC or on-premise FP8 execution with zero third-party token leakage. DPDP Act 2023 certified.
                                        </td>
                                        <td className="p-4 sm:p-5 text-neutral-600 dark:text-neutral-400">
                                            Superficial third-party multi-tenant API wrappers with potential transatlantic data residency violations.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    to="/compare/elesium-vs-traditional-it-consultancies/"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-black dark:text-white hover:underline"
                                >
                                    Read Full TCS, Infosys &amp; Wipro Battlecard &rarr;
                                </Link>
                                <span className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">•</span>
                                <Link
                                    to="/compare/elesium-vs-big-4-consulting-firms/"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-black dark:text-white hover:underline"
                                >
                                    Read Big 4 (PwC, EY, Deloitte, KPMG) Battlecard &rarr;
                                </Link>
                            </div>
                            <Link
                                to="/compare/"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                View All 12 Architectural Battlecards &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-6">Our AI Services</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Elesium engineers four core enterprise AI services: LangGraph agentic workflows, private on-premise LLM fine-tuning, intelligent document ETL pipelines, and air-gapped VPC infrastructure. Each deployment features sub-2s execution speeds, custom SAP RFC and SQL connectors, 99.9% production SLAs, and compliance with DPDP Act 2023 and ISO 27001 data residency protocols.
                            </strong>
                        </p>
                        <p className="text-lg text-neutral-600 dark:text-neutral-400">Production AI infrastructure for enterprise operations.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                        
                        <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-15 group-hover:opacity-30 transition-opacity">
                                <Network className="w-32 h-32 text-black dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-black flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/10">
                                    <Terminal className="w-6 h-6 text-black dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-black dark:text-white mb-3">Agentic AI Workflows</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                                    Deploy autonomous multi-agent systems (LangGraph, Python) that plan, execute, and reconcile multi-step tasks across SAP and SQL databases with 1.9s response times.
                                </p>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-black flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/10">
                                    <Code2 className="w-6 h-6 text-black dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-black dark:text-white mb-3">LLM Integration</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    Deploy Llama 3, DeepSeek, and Claude models inside private AWS/GCP India VPCs with zero data retention, ensuring DPDP Act 2023 compliance.
                                </p>
                            </div>
                        </div>

                        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-black flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/10">
                                    <Zap className="w-6 h-6 text-black dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-black dark:text-white mb-3">Process Automation</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                    Replace manual clerical routing with intelligent OCR and document ETL pipelines, reducing financial statement reconciliation from 14.5 hours to 1.9s.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-15 group-hover:opacity-30 transition-opacity">
                                <Shield className="w-32 h-32 text-black dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-xl bg-white dark:bg-black flex items-center justify-center mb-6 border border-neutral-200 dark:border-white/10">
                                    <Lock className="w-6 h-6 text-black dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-black dark:text-white mb-3">Custom AI Infrastructure</h3>
                                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                                    Build highly secure, scalable, and private AI environments for BFSI and healthcare institutions needing absolute DPDP Act 2023 and RBI data compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industries Section */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-6">Industries We Serve</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Elesium builds verticalized AI automation systems for India's high-compliance sectors: BFSI underwriting under RBI digital lending guidelines, SAP-integrated manufacturing inventory routing, HIPAA-grade health tech diagnostics, and enterprise SaaS ops. Across all deployments, our agents achieve 98% turnaround reductions and save enterprises an average of ₹18.4L per automated operational workflow.
                            </strong>
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {['BFSI', 'SaaS', 'Manufacturing', 'Healthcare', 'Logistics & Supply Chain', 'E-commerce'].map((industry, i) => (
                            <div key={i} className="px-6 py-3 rounded-lg bg-neutral-50 dark:bg-neutral-950 text-black dark:text-white font-medium border border-neutral-200 dark:border-white/10">
                                {industry}
                            </div>
                        ))}
                    </div>
                </div>

                {/* How We Work Section */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-6">How We Work</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Elesium executes a deterministic 4-stage engineering lifecycle: Discovery Audit, Architecture Design, Development, and VPC Production Scale. We deliver functional pilot agents in 14 days, guarantee 99.9% system uptime via automated LangGraph state fallbacks, and validate compliance against DPDP Act 2023 and ISO 27001 before initiating client handover.
                            </strong>
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Discovery Audit", desc: "We profile operational bottlenecks, audit SAP/SQL schemas, and mathematically quantify ROI potential." },
                            { step: "02", title: "Architecture Design", desc: "We architect LangGraph state graphs, data residency boundaries, and DPDP-compliant private VPC enclaves." },
                            { step: "03", title: "Development", desc: "Engineers build custom Python microservices, SAP RFC connectors, and rigorous edge-case unit tests." },
                            { step: "04", title: "Deployment & Scale", desc: "We deploy to production within 14 days, establish 99.9% SLA monitoring, and transition operational runbooks." }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="text-5xl font-bold text-neutral-200 dark:text-white/10 mb-4">{item.step}</div>
                                <h3 className="text-xl font-medium text-black dark:text-white mb-3">{item.title}</h3>
                                <p className="text-neutral-600 dark:text-neutral-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Case Study / Results */}
                <div className="mb-14 md:mb-16 bg-black dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">Proven Business Impact</h2>
                    <p className="text-base md:text-lg text-neutral-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        <strong className="text-white font-semibold">
                            Elesium's enterprise AI implementations have saved Indian organizations over 10,000+ manual hours, yielding an average 3.5x first-year capital ROI with 99.9% system uptime. In production deployments across BFSI and manufacturing, our deterministic agents cut underwriting latency from 14.5 hours to 1.9s and avert millions in operational downtime.
                        </strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">10,000+</div>
                            <div className="text-neutral-400">Automation Hours Saved</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">3.5x</div>
                            <div className="text-neutral-400">Average ROI in Year 1</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">99.9%</div>
                            <div className="text-neutral-400">System Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Verifiable Contractual Claims & Evidence Cards (Simon Cornelius Atomic Facts) */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-12">
                        <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-widest font-semibold">Institutional Evidence Cards</span>
                        <h2 className="text-3xl md:text-4xl font-medium text-black dark:text-white mt-2">Verifiable Contractual Claims</h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-3">
                            Machine-verifiable atomic facts backed by master service agreements, independent audits, and contractual SLA remedies.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">Production SLA</span>
                                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md font-mono">14 Days</span>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">14-Day Delivery</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Complete production pilot deployed inside your private VPC within 14 calendar days or initial engineering sprint fees rebated.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">Financial Guarantee</span>
                                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md font-mono">90 Days</span>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">90-Day ROI Mandate</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Measured against contractual cash-flow hurdles (hours saved + error reductions). Full professional fee rebate if targets are unmet.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">Data Sovereignty</span>
                                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md font-mono">Zero Egress</span>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">Private VPC Enclaves</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Deployed in customer-owned AWS Mumbai (ap-south-1) or CtrlS. Zero customer tokens leave sovereign borders or touch training sets.
                            </p>
                        </div>
                        <div className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-semibold">Statutory Safe Harbor</span>
                                <span className="text-xs bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-md font-mono">DPDP 2023</span>
                            </div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-2">DPDP Act 2023 Shield</h3>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                Complete compliance with Section 6 & 8 data fiduciary requirements, mitigating non-compliance penalties up to ₹250 Crore.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Honest Trade-Offs (Joy Hawkins Method) */}
                <div className="mb-14 md:mb-16">
                    <div className="text-center mb-12">
                        <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-widest font-semibold">Qualification Protocol</span>
                        <h2 className="text-3xl md:text-4xl font-medium text-black dark:text-white mt-2">Is Elesium Right For Your Enterprise?</h2>
                        <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mt-3">
                            We decline 40% of prospective engagements to maintain 100% SLA delivery fidelity. Review our architectural qualification criteria:
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        <div className="p-8 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/15">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold">✓</div>
                                <h3 className="text-2xl font-semibold text-black dark:text-white">Elesium IS Right For You If:</h3>
                            </div>
                            <ul className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
                                    <span><strong>Deterministic Execution:</strong> You require auditable state machines (LangGraph) where agent actions are logged and predictable.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
                                    <span><strong>Sovereign Data Residency:</strong> Your compliance officer mandates that data cannot leave Indian borders (AWS Mumbai / CtrlS).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
                                    <span><strong>Legacy ERP Complexity:</strong> You need custom bi-directional connectors into SAP S/4HANA, Oracle NetSuite, or Tally Prime.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white flex-shrink-0" />
                                    <span><strong>ROI Accountability:</strong> You demand contractual SLA guarantees and cash-flow breakeven within 90 calendar days.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="p-8 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-white/10 text-black dark:text-white flex items-center justify-center font-bold">✕</div>
                                <h3 className="text-2xl font-semibold text-black dark:text-white">Elesium is NOT Right For You If:</h3>
                            </div>
                            <ul className="space-y-4 text-neutral-700 dark:text-neutral-300">
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                                    <span><strong>Basic FAQ Chatbot:</strong> You only need a simple website widget for answering FAQs (use Intercom or Tidio instead).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                                    <span><strong>Budget Under ₹1,50,000:</strong> Your initial budget cannot support enterprise private staging (start with low-code tools first).</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                                    <span><strong>No Architecture Review:</strong> You want an instant plug-and-play bot deployed in 1 hour without technical discovery.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-neutral-400 flex-shrink-0" />
                                    <span><strong>No-Code Wrapper Reselling:</strong> You want a white-labeled Make.com or Zapier flow repackaged as custom AI.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Enterprise Pricing Matrix Section */}
                <div id="pricing-matrix" className="mb-14 md:mb-16">
                    <div className="text-center mb-16">
                        <span className="text-neutral-600 dark:text-neutral-400 font-mono text-xs uppercase tracking-widest font-semibold">Transparent Institutional Investment</span>
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mt-3">Enterprise AI Automation Pricing in India</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mt-4 mb-10 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                {pricingAnswerCapsule}
                            </strong>
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {enterprisePricingTiers.map((tier) => (
                            <div 
                                key={tier.name}
                                className={
                                    tier.highlighted
                                        ? "bg-neutral-50 dark:bg-neutral-950 border-2 border-black dark:border-white rounded-xl p-8 flex flex-col justify-between relative"
                                        : "bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-8 hover:border-black dark:hover:border-white/30 transition-all flex flex-col justify-between"
                                }
                            >
                                {tier.highlighted && (
                                    <span className="absolute -top-3 right-6 bg-black text-white dark:bg-white dark:text-black text-[11px] font-semibold uppercase tracking-wider py-1 px-3 rounded-md">
                                        Most Deployed
                                    </span>
                                )}
                                <div>
                                    <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-2 uppercase tracking-widest">{tier.tierCode}</div>
                                    <h3 className="text-2xl font-semibold text-black dark:text-white">{tier.name}</h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-extrabold text-black dark:text-white">{tier.priceFormatted}</span>
                                        <span className="block text-sm text-neutral-600 dark:text-neutral-400 mt-1">{tier.priceSubtext}</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-neutral-700 dark:text-neutral-300 font-mono">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="text-black dark:text-white">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => handleTierWhatsApp(tier.whatsappTier, tier.whatsappBudget)}
                                    className={
                                        tier.highlighted
                                            ? "mt-8 block w-full text-center py-3.5 px-6 rounded-lg bg-black text-white hover:opacity-90 dark:bg-white dark:text-black active:scale-[0.97] font-semibold transition-all"
                                            : "mt-8 block w-full text-center py-3.5 px-6 rounded-lg bg-white hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-black dark:text-white active:scale-[0.97] font-medium transition-all"
                                    }
                                >
                                    {tier.buttonLabel}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proprietary Enterprise Architecture Intake & ROI Calculator (Shaun Mitchell Framework) */}
                <div id="architecture-intake" className="mb-14 md:mb-16 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-6 md:p-12">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-black dark:text-white text-xs font-mono uppercase tracking-wider mb-4">
                            <Calculator className="w-3.5 h-3.5" />
                            Shaun Mitchell Enterprise Intake Dataset Framework
                        </div>
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white">
                            AI Architecture Audit & ROI Estimator
                        </h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mt-4 mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Elesium's interactive AI architecture audit calculates enterprise workflow automation feasibility, projecting capital savings and hour recovery across SAP, Salesforce, and SQL databases. By automating manual labor at a blended ₹1,250/hour rate, our deterministic LangGraph systems recover up to 82% of operational capacity within 14 to 21 business days.
                            </strong>
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-lg">
                            Configure your enterprise workflow parameters below to generate an instant mathematical feasibility benchmark and projected capital savings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Configuration Controls */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Parameter 1: Workflow */}
                            <div>
                                <label className="block text-sm font-mono text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-3">
                                    1. Primary Enterprise Workflow Bottleneck
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {[
                                        'Document Extraction & Invoice Reconciliation',
                                        'Autonomous Support & Case Resolution',
                                        'Cross-System ERP-CRM Synchronization',
                                        'Regulatory Compliance & Audit Trails',
                                        'Bespoke Multi-Agent Operational Pod'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeWorkflow(opt)}
                                            className={`text-left text-xs md:text-sm p-3.5 rounded-xl border transition-all ${
                                                intakeWorkflow === opt
                                                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-medium'
                                                    : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white/30'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parameter 2: ERP & Stack */}
                            <div>
                                <label className="block text-sm font-mono text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-3">
                                    2. Core Data Environment & ERP Stack
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {[
                                        'SAP / Oracle NetSuite',
                                        'Tally Prime / Zoho Books',
                                        'Salesforce / HubSpot',
                                        'PostgreSQL / SQL Server',
                                        'Snowflake / Databricks',
                                        'Custom REST / Microservices'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeErp(opt)}
                                            className={`text-center text-xs p-3 rounded-xl border transition-all ${
                                                intakeErp === opt
                                                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-medium'
                                                    : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white/30'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parameter 3: Weekly Manual Hours */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-mono text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                        3. Human Labor Dedicated to Manual Workflow
                                    </label>
                                    <span className="text-base font-bold text-black dark:text-white font-mono">
                                        {intakeHours} Hours / Week
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="300"
                                    step="10"
                                    value={intakeHours}
                                    onChange={(e) => setIntakeHours(Number(e.target.value))}
                                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-black dark:accent-white"
                                />
                                <div className="flex justify-between text-xs text-neutral-500 font-mono mt-1">
                                    <span>20 hrs (Pilot team)</span>
                                    <span>150 hrs (Division)</span>
                                    <span>300+ hrs (Department)</span>
                                </div>
                            </div>

                            {/* Parameter 4: Security Tier */}
                            <div>
                                <label className="block text-sm font-mono text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-3">
                                    4. Security & Compliance Protocol
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {[
                                        'Private VPC (AWS/GCP India) - Zero Retention',
                                        'Air-Gapped / On-Premise Enclave',
                                        'SOC2 & DPDP Act 2023 Compliant Pod'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeSecurity(opt)}
                                            className={`text-center text-xs p-3 rounded-xl border transition-all ${
                                                intakeSecurity === opt
                                                    ? 'border-black dark:border-white bg-black text-white dark:bg-white dark:text-black font-medium'
                                                    : 'border-neutral-200 dark:border-white/10 bg-white dark:bg-black text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white/30'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Live Architectural Output Card */}
                        <div className="lg:col-span-5 bg-white dark:bg-black border border-neutral-200 dark:border-white/20 rounded-xl p-7 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between border-b border-neutral-200 dark:border-white/10 pb-4 mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-black dark:text-white">
                                        Architectural Assessment
                                    </span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-mono">
                                        94% Deterministic Match
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono block">Projected 12-Month Net Capital Savings</span>
                                        <div className="text-3xl md:text-4xl font-extrabold text-black dark:text-white mt-1">
                                            ₹{calculatedAnnualCostSavings.toLocaleString('en-IN')}
                                        </div>
                                        <span className="text-xs text-neutral-700 dark:text-neutral-300 mt-1 block">
                                            Recovers ~{calculatedAnnualHoursSaved.toLocaleString('en-IN')} high-value human engineering/operational hours
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Recommended Sprint:</span>
                                            <span className="font-semibold text-black dark:text-white text-right">{recommendedSprint}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Target Tech Stack:</span>
                                            <span className="font-mono text-neutral-800 dark:text-neutral-200">{intakeErp}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Security Architecture:</span>
                                            <span className="font-mono text-neutral-800 dark:text-neutral-200">Zero-Data-Retention</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-neutral-500">Deployment Lead Time:</span>
                                            <span className="font-mono text-black dark:text-white font-bold">14 - 21 Business Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleTransmitIntake}
                                className="mt-8 w-full py-4 px-6 rounded-lg bg-black hover:opacity-90 text-white dark:bg-white dark:text-black active:scale-[0.97] font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Transmit Architecture Intake to WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-14 md:mb-16 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-medium text-black dark:text-white mb-6">Frequently Asked Questions</h2>
                        <p className="text-base md:text-lg text-neutral-800 dark:text-neutral-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-black dark:text-white font-semibold">
                                Technical and commercial answers regarding enterprise AI automation in India, including deployment costs (₹1.5L to ₹15L+), 14-day implementation timelines, LangGraph state machine architectures, and compliance standards such as DPDP Act 2023, RBI digital lending guidelines, and ISO 27001 zero-retention private cloud security.
                            </strong>
                        </p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => {
                            const isOpen = openFaqIndex === i;
                            return (
                                <div key={i} className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        className="w-full p-6 text-left flex items-center justify-between gap-4 font-medium text-lg md:text-xl text-black dark:text-white hover:opacity-80 transition-opacity"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-5 h-5 shrink-0 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180 text-black dark:text-white' : ''}`} />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                                className="accordion-panel overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 pt-2 text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    className="bg-black text-white dark:bg-neutral-950 rounded-xl p-10 md:p-16 text-center relative overflow-hidden border border-neutral-200 dark:border-white/10"
                >
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/20 bg-white/10 text-xs font-mono">
                            <span className="uppercase tracking-widest text-white font-semibold text-[11px]">
                                Enterprise AI Engineering • Direct Principal Pairing
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Ready to Deploy Deterministic Scale?
                        </h2>
                        <p className="text-base md:text-lg text-neutral-300 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                            <strong className="text-white font-semibold">
                                Initiate an enterprise AI readiness audit with Elesium to transition from manual operational bottlenecks to deterministic, autonomous agent workflows. Our engineering team evaluates your SAP, Oracle, and data pipelines to deliver an implementation blueprint guaranteeing 3.5x capital ROI, 98% turnaround reductions, and DPDP Act 2023 compliance within 90 days.
                            </strong>
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-neutral-200 active:scale-[0.97] font-semibold px-8 py-4 rounded-lg text-sm transition-all group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 active:scale-[0.97] text-white font-medium px-6 py-4 rounded-lg text-sm transition-all"
                            >
                                <Calendar className="w-4 h-4 text-white" />
                                <span>ele-in SaaS Waitlist &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
            <WhatsAppModal />
        </main>
    )
}
