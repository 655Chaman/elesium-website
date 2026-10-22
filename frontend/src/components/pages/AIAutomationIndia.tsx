import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Terminal, Shield, Network, Zap, Code2, Lock, ArrowRight, CheckCircle2, Calculator, MessageSquare, Calendar } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const agentWorkflows = {
    bfsi: {
        name: "BFSI Underwriting Agent",
        badge: "Banking & NBFC",
        color: "text-amber-400",
        border: "border-amber-500/30",
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
        color: "text-cyan-400",
        border: "border-cyan-500/30",
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
        color: "text-blue-400",
        border: "border-blue-500/30",
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
        <div className="bg-[#07090E] border border-white/10 rounded-3xl p-6 font-mono text-xs md:text-sm shadow-2xl relative overflow-hidden backdrop-blur-xl">
            {/* Terminal Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500/60" />
                    <span className="ml-2 text-white/40 text-xs">elesium_runtime_v2.6.sh</span>
                </div>

                {/* Workflow Switcher Tabs */}
                <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
                    {(Object.keys(agentWorkflows) as AgentKey[]).map(key => (
                        <button
                            key={key}
                            onClick={() => setActiveAgent(key)}
                            className={`px-3 py-1 rounded-lg text-xs font-sans font-medium transition-all ${
                                activeAgent === key 
                                    ? 'bg-blue-600 text-white shadow-md' 
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
                <span className={`font-semibold ${agentWorkflows[activeAgent].color}`}>
                    ● {agentWorkflows[activeAgent].name}
                </span>
                <span className="text-white/40 font-mono text-[10px] tracking-wider uppercase">
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
                                ? 'text-emerald-400 font-bold' 
                                : line.startsWith('[OK]') 
                                    ? 'text-cyan-400' 
                                    : line.startsWith('[WARN]') || line.startsWith('[ALERT]')
                                        ? 'text-amber-400'
                                        : 'text-gray-300'
                        }`}
                    >
                        {line}
                    </motion.div>
                ))}
                <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.7 }}
                    className="w-2 h-4 bg-cyan-400 inline-block mt-1"
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
        priceFormatted: "₹1,50,000 – ₹3,50,000",
        priceSubtext: "($2,000 – $4,500 USD) • Fixed Investment",
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
        priceFormatted: "₹6,00,000 – ₹15,00,000",
        priceSubtext: "($7,500 – $18,000 USD) • Milestone-Based",
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

    const calculatedAnnualHoursSaved = Math.round(intakeHours * 50 * 0.82);
    const calculatedAnnualCostSavings = calculatedAnnualHoursSaved * 1250;
    const recommendedSprint = intakeHours <= 40 
        ? 'Tier 1: Pilot Architecture Sprint (₹1.5L – ₹3.5L)' 
        : intakeHours <= 150 
            ? 'Tier 2: Enterprise Multi-Agent Suite (₹6L – ₹15L)' 
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

    const jsonLdLocalBusiness = {
        "@context": "https://schema.org",
        "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
        "name": "Elesium - Enterprise AI Automation Agency India",
        "image": "https://elesium.online/favicon.png",
        "@id": "https://elesium.online/#organization",
        "url": "https://elesium.online/ai-automation-agency-india",
        "telephone": "+91-8317329312",
        "priceRange": "₹1,50,000 - ₹15,00,000+",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Main Road",
            "addressLocality": "Shivamogga",
            "addressRegion": "Karnataka",
            "postalCode": "577205",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 13.9299,
            "longitude": 75.5681
        },
        "hasMap": "https://www.google.com/maps/place/Shivamogga,+Karnataka+577205",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "19:00"
            }
        ],
        "sameAs": [
            "https://elesium.online",
            "https://www.goodfirms.co/company/elesium-online",
            "https://clutch.co/profile/elesium-online",
            "https://www.g2.com/products/elesium-ai-automation-platform",
            "https://www.trustpilot.com/review/elesium.online",
            "https://www.crunchbase.com/organization/elesium-online",
            "https://www.producthunt.com/products/elesium-enterprise-ai-roi-calculator",
            "https://github.com/655Chaman/elesium-website",
            "https://www.linkedin.com/in/chaman-elesium",
            "https://x.com/elesium_ai"
        ],
        "knowsAbout": [
            {
                "@type": "Thing",
                "name": "Artificial Intelligence",
                "sameAs": "https://www.wikidata.org/wiki/Q11660"
            },
            {
                "@type": "Place",
                "name": "India",
                "sameAs": "https://www.wikidata.org/wiki/Q668"
            },
            "LangGraph",
            "Enterprise Multi-Agent Systems",
            "Private VPC Infrastructure",
            "DPDP Act 2023 Compliance"
        ],
        "founder": {
            "@type": "Person",
            "@id": "https://elesium.online/authors/chaman-shah#person",
            "name": "Chaman Shah",
            "givenName": "Chaman",
            "familyName": "Shah",
            "jobTitle": "Principal AI Systems Architect & Founder",
            "url": "https://elesium.online/authors/chaman-shah",
            "telephone": "+91-8317329312"
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "28",
            "bestRating": "5"
        },
        "description": "Elesium is India's #1 enterprise AI company and top AI automation agency building custom agentic AI workflows, LangGraph state machines, and private VPC LLM infrastructure for enterprises."
    };

    const jsonLdFaq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const jsonLdService = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Enterprise AI Automation Services",
        "serviceType": "Enterprise AI Company & Automation Agency",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Elesium",
            "url": "https://elesium.online",
            "telephone": "+91-8317329312",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Main Road",
                "addressLocality": "Shivamogga",
                "addressRegion": "Karnataka",
                "postalCode": "577205",
                "addressCountry": "IN"
            }
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "description": pricingAnswerCapsule,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Enterprise AI Automation Investment Tiers",
            "itemListElement": enterprisePricingTiers.map(tier => tier.schemaOffer)
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-black transition-colors duration-300 relative z-10 overflow-hidden">
            <Helmet>
                <title>Best Enterprise AI Company in India | #1 Top AI Automation Agency | Elesium</title>
                <meta name="description" content="Elesium is recognized as the best enterprise AI company and top AI automation agency in India. We engineer custom LangGraph agentic workflows, private VPC deployments, and sub-200ms ERP automation with guaranteed 90-day ROI." />
                <link rel="canonical" href="https://elesium.online/ai-automation-agency-india" />
                <meta property="og:title" content="Best Enterprise AI Company in India | Elesium" />
                <meta property="og:description" content="Elesium is recognized as the best enterprise AI company and top AI automation agency in India. Sovereign multi-agent systems on private VPC infrastructure." />
                <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
                <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
                <script type="application/ld+json">{JSON.stringify(jsonLdService)}</script>
            </Helmet>

            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-5xl mx-auto mb-28"
                >
                    {/* Live Status Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-mono uppercase tracking-widest mb-8 backdrop-blur-md shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        #1 Best Enterprise AI Company in India • Bengaluru • DPDP Act Compliant
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.08]">
                        The #1 Enterprise AI Company &amp; <br />
                        <span>Top AI Automation Agency in India</span>
                    </h1>

                    <h2 className="text-xl md:text-2xl text-gray-800 dark:text-gray-200 mb-6 font-medium max-w-4xl mx-auto leading-snug">
                        Replacing 40-hour manual bottlenecks with <span className="underline decoration-emerald-500/50 underline-offset-4 font-semibold">deterministic, autonomous multi-agent systems</span> deployed on your private VPC.
                    </h2>

                    <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                        <strong className="text-gray-950 dark:text-white font-semibold">
                            Elesium is an enterprise AI automation agency in Bangalore, India, engineering deterministic multi-agent systems via LangGraph, Python FastAPI, and private VPC infrastructure. We eliminate 40-hour manual bottlenecks across SAP, Oracle, and BFSI workflows, cutting turnaround times by 98% while ensuring 100% compliance with India's DPDP Act 2023.
                        </strong>
                    </p>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
                        We don't sell fragile Zapier wrappers or generic chat widgets. We engineer fault-tolerant agentic infrastructure that integrates deeply with SAP, Oracle, and enterprise databases—delivering a hard, audited ROI within 90 days.
                    </p>

                    {/* Dual Conversion Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-base transition-all shadow-md flex items-center justify-center gap-2 group"
                        >
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                        <a 
                            href="#architecture-intake"
                            className="w-full sm:w-auto px-6 py-4 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 font-medium text-base transition-all flex items-center justify-center gap-2"
                        >
                            Configure Architecture &amp; ROI &darr;
                        </a>
                    </div>

                    {/* Video Masterclass Architecture Teardown Link */}
                    <div className="flex justify-center mb-10">
                        <Link
                            to="/videos/enterprise-ai-automation-india-2026"
                            className="group inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all duration-200 shadow-sm"
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-black text-white dark:bg-white dark:text-black font-bold text-xs shadow-sm">
                                ▶
                            </span>
                            <div className="text-left">
                                <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                                    <span>Watch Video Masterclass (12:45)</span>
                                </div>
                                <div className="text-xs md:text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    Autonomous Enterprise Agent Architecture Teardown &rarr;
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Live Metric Pills */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-black/5 dark:border-white/10 text-left font-mono">
                        <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Speed to Pilot</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">14 Days</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Avg 1-Year ROI</div>
                            <div className="text-lg font-bold text-emerald-500 mt-0.5">3.5x Capital</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Data Security</div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">Zero Retention</div>
                        </div>
                        <div className="p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">Legacy Stack</div>
                            <div className="text-lg font-bold text-cyan-500 mt-0.5">SAP / Oracle</div>
                        </div>
                    </div>
                </motion.div>

                {/* Description & Tech Stack Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-32"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6">
                                Engineering the Future of Indian Enterprise
                            </h2>
                            <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 mb-6 leading-relaxed">
                                <strong className="text-gray-950 dark:text-white font-semibold">
                                    Elesium deploys deterministic LangGraph state machines and private VPC microservices across Indian enterprises, replacing fragile RPA wrappers with autonomous agents. Operating with sub-2.0s API latency and zero data retention, our architectures execute complex SAP RFC connectors and bank reconciliations while strictly adhering to DPDP Act 2023 and ISO 27001 standards.
                                </strong>
                            </p>
                            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400">
                                <p>
                                    As Indian enterprises scale rapidly, manual data entry and fragmented legacy systems become crippling bottlenecks. Elesium solves this by building custom AI architectures tailored to your proprietary data. We serve forward-thinking leaders who demand more than a shiny ChatGPT clone—they require deterministic, fault-tolerant AI agents that execute multi-step workflows autonomously.
                                </p>
                                <p>
                                    Our engineers don't just prompt—we architect. We leverage <strong>LangGraph, custom Python execution environments, vector databases (Pinecone/Weaviate), and private fine-tuned LLMs</strong>. Whether it's processing massive unstructured supply-chain documents or building multi-agent revenue operations, we deliver compliance-ready infrastructure built for India's scale.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 border border-white/10 bg-white/5 hover:bg-white/10 text-gray-200 blur-[60px] rounded-[3rem]"></div>
                            <AgentTerminal />
                        </div>
                    </div>
                </motion.div>

                {/* Why Choose Elesium Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Why Choose Elesium?</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
                                Indian enterprises choose Elesium over legacy IT vendors because we engineer production-grade Python LangGraph agents rather than fragile low-code wrappers. Deploying on air-gapped private VPCs with zero data retention, our systems deliver verified 3.5x first-year capital ROI, 98% turnaround reductions, and compliance with RBI digital lending guidelines and DPDP Act 2023.
                            </strong>
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Most agencies sell you a low-code workflow and call it AI. We don't. Here is why top Indian enterprises trust us.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: "Custom Architecture, Not Zapier", desc: "We don't glue APIs. We build custom Python LangGraph multi-agent systems connecting to SAP S/4HANA via SAP RFC connectors, achieving 1.9s execution latency." },
                            { title: "Deterministic Agentic Execution", desc: "LLMs hallucinate. Our agentic workflows use LangGraph state machines, Pydantic guardrails, and automated fallbacks to ensure 99.9% deterministic execution accuracy." },
                            { title: "Private VPC & Air-Gapped Deployments", desc: "For BFSI and healthcare, we deploy models (Llama 3, DeepSeek) locally on AWS/GCP India private VPCs with zero data retention, fully compliant with DPDP Act 2023 and ISO 27001." },
                            { title: "Hard 3.5x ROI in 90 Days", desc: "We map every deployment to a financial metric. By eliminating 40+ manual weekly hours at ₹1,250/hr, clients achieve an average 3.5x first-year ROI, saving up to ₹18.4L per workflow." },
                            { title: "Enterprise Systems Integration", desc: "Deep bidirectional connectors into SAP, Oracle NetSuite, Salesforce, SQL Server, and encrypted WhatsApp Business APIs adhering to RBI digital lending guidelines." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 bg-[#F5F5F5] dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Competitive Comparison Matrix: Elesium vs Traditional IT & Big 4 */}
                <div className="mb-32">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            Enterprise Architectural Evaluation
                        </span>
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mt-4 mb-6">
                            Elesium vs Legacy IT &amp; Big 4 Consultancies
                        </h2>
                        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Indian enterprises are replacing bloated 18-month time-and-materials IT contracts with Elesium’s 14-day deterministic AI engineering pods. Compare the architectural, economic, and compliance realities below.
                        </p>
                    </div>

                    <div className="max-w-5xl mx-auto overflow-hidden rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#111] shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-black/10 dark:border-white/10 bg-gray-50/75 dark:bg-white/[0.02]">
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/4">Evaluation Dimension</th>
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20 w-5/12">
                                            Elesium Sovereign Pods
                                        </th>
                                        <th className="p-4 sm:p-5 text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400 w-1/3">
                                            Traditional IT (TCS, Infosys) &amp; Big 4
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-gray-900 dark:text-white">Deployment Velocity</td>
                                        <td className="p-4 sm:p-5 bg-emerald-50/30 dark:bg-emerald-950/10 text-gray-900 dark:text-emerald-300 font-medium">
                                            14 to 30 days to live production deployment with calibrated Python LangGraph state machines.
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                                            12 to 18 months discovery, committee sign-offs, and prolonged waterfall staging.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-gray-900 dark:text-white">Commercial Model &amp; SLA</td>
                                        <td className="p-4 sm:p-5 bg-emerald-50/30 dark:bg-emerald-950/10 text-gray-900 dark:text-emerald-300 font-medium">
                                            Contractually committed 90-day cash-flow ROI SLA with fixed-scope milestone delivery.
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                                            Open-ended Time &amp; Materials (T&amp;M) billing that incentivizes scope creep and billable hour bloat.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-gray-900 dark:text-white">Code Ownership &amp; IP</td>
                                        <td className="p-4 sm:p-5 bg-emerald-50/30 dark:bg-emerald-950/10 text-gray-900 dark:text-emerald-300 font-medium">
                                            100% client-owned sovereign repository. Zero platform lock-in, zero per-seat license taxes.
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                                            Proprietary framework lock-in, recurring multi-year managed service fees, and non-transferable IP.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-gray-900 dark:text-white">Engineering Seniority</td>
                                        <td className="p-4 sm:p-5 bg-emerald-50/30 dark:bg-emerald-950/10 text-gray-900 dark:text-emerald-300 font-medium">
                                            Direct daily pairing with Principal Systems Architects (Ex-Founders, Senior Systems Engineers).
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                                            Pitched by partners; staffed by junior batch hires managed by non-technical account executives.
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 sm:p-5 font-semibold text-gray-900 dark:text-white">DPDP &amp; Data Residency</td>
                                        <td className="p-4 sm:p-5 bg-emerald-50/30 dark:bg-emerald-950/10 text-gray-900 dark:text-emerald-300 font-medium">
                                            Air-gapped private VPC or on-premise FP8 execution with zero third-party token leakage. DPDP Act 2023 certified.
                                        </td>
                                        <td className="p-4 sm:p-5 text-gray-600 dark:text-gray-400">
                                            Superficial third-party multi-tenant API wrappers with potential transatlantic data residency violations.
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    to="/compare/elesium-vs-traditional-it-consultancies"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                    Read Full TCS, Infosys &amp; Wipro Battlecard &rarr;
                                </Link>
                                <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">•</span>
                                <Link
                                    to="/compare/elesium-vs-big-4-consulting-firms"
                                    className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                >
                                    Read Big 4 (PwC, EY, Deloitte, KPMG) Battlecard &rarr;
                                </Link>
                            </div>
                            <Link
                                to="/compare"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                            >
                                View All 12 Architectural Battlecards &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Our AI Services</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
                                Elesium engineers four core enterprise AI services: LangGraph agentic workflows, private on-premise LLM fine-tuning, intelligent document ETL pipelines, and air-gapped VPC infrastructure. Each deployment features sub-2s execution speeds, custom SAP RFC and SQL connectors, 99.9% production SLAs, and compliance with DPDP Act 2023 and ISO 27001 data residency protocols.
                            </strong>
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Comprehensive AI solutions for complex business problems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                        
                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Network className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Terminal className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Agentic AI Workflows</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Deploy autonomous multi-agent systems (LangGraph, Python) that plan, execute, and reconcile multi-step tasks across SAP and SQL databases with 1.9s response times.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Code2 className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">LLM Integration</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Deploy Llama 3, DeepSeek, and Claude models inside private AWS/GCP India VPCs with zero data retention, ensuring DPDP Act 2023 compliance.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Process Automation</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Replace manual clerical routing with intelligent OCR and document ETL pipelines, reducing financial statement reconciliation from 14.5 hours to 1.9s.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Shield className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Lock className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Custom AI Infrastructure</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Build highly secure, scalable, and private AI environments. Perfect for BFSI and healthcare institutions needing absolute DPDP Act 2023 and RBI data compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industries Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Industries We Serve</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
                                Elesium builds verticalized AI automation systems for India's high-compliance sectors: BFSI underwriting under RBI digital lending guidelines, SAP-integrated manufacturing inventory routing, HIPAA-grade health tech diagnostics, and enterprise SaaS ops. Across all deployments, our agents achieve 98% turnaround reductions and save enterprises an average of ₹18.4L per automated operational workflow.
                            </strong>
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Tailored automation for India's fastest-growing sectors.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {['BFSI', 'SaaS', 'Manufacturing', 'Healthcare', 'Logistics & Supply Chain', 'E-commerce'].map((industry, i) => (
                            <div key={i} className="px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/50">
                                {industry}
                            </div>
                        ))}
                    </div>
                </div>

                {/* How We Work Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">How We Work</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
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
                                <div className="text-5xl font-bold text-gray-200 dark:text-white/5 mb-4">{item.step}</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Case Study / Results */}
                <div className="mb-32 bg-gray-900 dark:bg-[#111] rounded-[40px] p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">Proven Business Impact</h2>
                    <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
                        <strong className="text-white font-semibold">
                            Elesium's enterprise AI implementations have saved Indian organizations over 10,000+ manual hours, yielding an average 3.5x first-year capital ROI with 99.9% system uptime. In production deployments across BFSI and manufacturing, our deterministic agents cut underwriting latency from 14.5 hours to 1.9s and avert millions in operational downtime.
                        </strong>
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">10,000+</div>
                            <div className="text-gray-400">Automation Hours Saved</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">3.5x</div>
                            <div className="text-gray-400">Average ROI in Year 1</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-white font-mono mb-2">99.9%</div>
                            <div className="text-gray-400">System Uptime</div>
                        </div>
                    </div>
                </div>

                {/* Enterprise Pricing Matrix Section */}
                <div id="pricing-matrix" className="mb-32">
                    <div className="text-center mb-16">
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">Transparent Institutional Investment</span>
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mt-3">Enterprise AI Automation Pricing in India</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mt-4 mb-10 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
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
                                        ? "bg-gray-50 dark:bg-white/[0.04] border-2 border-black dark:border-white rounded-3xl p-8 shadow-xl flex flex-col justify-between relative"
                                        : "bg-gray-50/60 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:border-gray-400 dark:hover:border-white/20 transition-all flex flex-col justify-between"
                                }
                            >
                                {tier.highlighted && (
                                    <span className="absolute -top-3 right-6 bg-black text-white dark:bg-white dark:text-black text-[11px] font-semibold uppercase tracking-wider py-1 px-3 rounded-full">
                                        Most Deployed
                                    </span>
                                )}
                                <div>
                                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-widest">{tier.tierCode}</div>
                                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{tier.name}</h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{tier.priceFormatted}</span>
                                        <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">{tier.priceSubtext}</span>
                                    </div>
                                    <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                        {tier.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <span className="text-emerald-500">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button 
                                    onClick={() => handleTierWhatsApp(tier.whatsappTier, tier.whatsappBudget)}
                                    className={
                                        tier.highlighted
                                            ? "mt-8 block w-full text-center py-3.5 px-6 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold transition-all shadow-sm"
                                            : "mt-8 block w-full text-center py-3.5 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white font-medium transition-all"
                                    }
                                >
                                    {tier.buttonLabel}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Proprietary Enterprise Architecture Intake & ROI Calculator (Shaun Mitchell Framework) */}
                <div id="architecture-intake" className="mb-32 bg-[#F8F9FA] dark:bg-[#0D0D0D] border border-black/10 dark:border-white/10 rounded-[32px] p-8 md:p-14">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
                            <Calculator className="w-3.5 h-3.5" />
                            Shaun Mitchell Enterprise Intake Dataset Framework
                        </div>
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white">
                            AI Architecture Audit & ROI Estimator
                        </h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mt-4 mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
                                Elesium's interactive AI architecture audit calculates enterprise workflow automation feasibility, projecting capital savings and hour recovery across SAP, Salesforce, and SQL databases. By automating manual labor at a blended ₹1,250/hour rate, our deterministic LangGraph systems recover up to 82% of operational capacity within 14 to 21 business days.
                            </strong>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
                            Configure your enterprise workflow parameters below to generate an instant mathematical feasibility benchmark and projected capital savings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Configuration Controls */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Parameter 1: Workflow */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
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
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parameter 2: ERP & Stack */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
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
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
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
                                    <label className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        3. Human Labor Dedicated to Manual Workflow
                                    </label>
                                    <span className="text-base font-bold text-blue-600 dark:text-cyan-400 font-mono">
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
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                                    <span>20 hrs (Pilot team)</span>
                                    <span>150 hrs (Division)</span>
                                    <span>300+ hrs (Department)</span>
                                </div>
                            </div>

                            {/* Parameter 4: Security Tier */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
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
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Live Architectural Output Card */}
                        <div className="lg:col-span-5 bg-white dark:bg-[#121212] border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl p-7 flex flex-col justify-between shadow-xl">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                                        Architectural Assessment
                                    </span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono">
                                        94% Deterministic Match
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono block">Projected 12-Month Net Capital Savings</span>
                                        <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                                            ₹{calculatedAnnualCostSavings.toLocaleString('en-IN')}
                                        </div>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
                                            Recovers ~{calculatedAnnualHoursSaved.toLocaleString('en-IN')} high-value human engineering/operational hours
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181818] border border-black/5 dark:border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Recommended Sprint:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white text-right">{recommendedSprint}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Target Tech Stack:</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-200">{intakeErp}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Security Architecture:</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-200">Zero-Data-Retention</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Deployment Lead Time:</span>
                                            <span className="font-mono text-emerald-500 font-bold">14 – 21 Business Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleTransmitIntake}
                                className="mt-8 w-full py-4 px-6 rounded-full bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-md group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Transmit Architecture Intake to WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section (Statically Open DOM Rendering - Zero Accordion Traps) */}
                <div className="mb-32 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <p className="text-base md:text-lg text-gray-800 dark:text-gray-200 max-w-3xl mx-auto mb-6 leading-relaxed">
                            <strong className="text-gray-950 dark:text-white font-semibold">
                                Find authoritative technical and commercial answers regarding enterprise AI automation in India, including deployment costs (₹1.5L to ₹15L+), 14-day implementation timelines, LangGraph state machine architectures, and compliance standards such as DPDP Act 2023, RBI digital lending guidelines, and ISO 27001 zero-retention private cloud security.
                            </strong>
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">Direct answers to technical and commercial evaluation questions.</p>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-black text-white dark:bg-[#0A0A0A] rounded-3xl p-10 md:p-16 text-center relative overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl"
                >
                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                            <span className="relative flex h-2 w-2">
                                <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="uppercase tracking-widest text-emerald-400 font-semibold text-[11px]">
                                #1 Enterprise AI In India • Direct Principal Pairing
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Ready to Unlock Autonomous Scale?
                        </h2>
                        <p className="text-base md:text-lg text-gray-300 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            <strong className="text-white font-semibold">
                                Initiate an enterprise AI readiness audit with Elesium to transition from manual operational bottlenecks to deterministic, autonomous agent workflows. Our engineering team evaluates your SAP, Oracle, and data pipelines to deliver an implementation blueprint guaranteeing 3.5x capital ROI, 98% turnaround reductions, and DPDP Act 2023 compliance within 90 days.
                            </strong>
                        </p>
                        <p className="text-base text-gray-400 max-w-2xl mx-auto">
                            Stop wasting human capital on robotic tasks. Schedule a custom AI readiness audit to see exactly where our infrastructure can impact your bottom line.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-lg group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                            <Link
                                to="/waitlist"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-4 rounded-full text-sm transition-all"
                            >
                                <Calendar className="w-4 h-4 text-emerald-400" />
                                <span>ele-in SaaS Waitlist &rarr;</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>

            </div>
            <WhatsAppModal />
        </div>
    )
}
