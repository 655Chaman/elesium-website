import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp, Zap, Activity, Cpu, Share2, MessageSquare, ChevronRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const industries = [
    {
        id: 'defense-aerospace',
        title: 'Defense & Aerospace Pipelines',
        icon: Shield,
        description: 'Routing precision manufacturing capacity and securing contract placement with Tier-1 defense primes.',
        details: [
            'Tier-1 Prime Contractor Placement',
            'AS9100 & ITAR Capacity Sourcing',
            'Precision Manufacturing Routing'
        ]
    },
    {
        id: 'private-equity',
        title: 'Private Equity & Industrial Roll-Ups',
        icon: TrendingUp,
        description: 'Sourcing off-market acquisition targets, platform capacity, and dealflow for industrial investment firms.',
        details: [
            'Off-Market Target Identification',
            'Platform Capacity Sourcing',
            'Dealflow Sourcing & Acceleration'
        ]
    },
    {
        id: 'energy-infrastructure',
        title: 'Energy & Infrastructure Logistics',
        icon: Zap,
        description: 'Connecting high-scale thermal management, power distribution, and data center components to enterprise operators.',
        details: [
            'Power Distribution Logistics',
            'Thermal Management Systems',
            'Enterprise Component Sourcing'
        ]
    },
    {
        id: 'advanced-medtech',
        title: 'Advanced MedTech & Healthcare Systems',
        icon: Activity,
        description: 'Matching FDA-compliant contract manufacturing organizations with high-stakes medical hardware pipelines.',
        details: [
            'FDA-Compliant CMO Matching',
            'High-Stakes Hardware Pipelines',
            'Sterile & Precision Manufacturing'
        ]
    },
    {
        id: 'applied-ai',
        title: 'Applied AI & Enterprise Workflows',
        icon: Cpu,
        description: 'Pairing traditional industrial operators with agentic compliance architectures and automated backend systems.',
        details: [
            'Agentic Compliance Systems',
            'Automated Backend Workflows',
            'AI-Driven Operational Efficiency'
        ]
    },
    {
        id: 'supply-chain-capital',
        title: 'Supply Chain Capital & Placement',
        icon: Share2,
        description: 'Brokering high-leverage strategic partnerships and mission-critical talent routing across deep technical sectors.',
        details: [
            'Strategic Partnership Brokering',
            'Mission-Critical Talent Routing',
            'Deep Tech Capital Placement'
        ]
    }
]

const industriesFaqs = [
    {
        q: "How does Elesium deploy sovereign AI automation for defense and aerospace primes?",
        a: "Elesium engineers air-gapped, AS9100 and ITAR compliant deterministic multi-agent state machines deployed entirely on-premise or within sovereign private VPCs. Our systems automate precision manufacturing routing, supplier capacity verification, and defense contract milestone tracking without external LLM data egress."
    },
    {
        q: "How do private equity firms utilize Elesium's AI dealflow and roll-up infrastructure?",
        a: "We deploy autonomous acquisition screening agents that parse proprietary financial filings, EBITDA margins, and industrial capacity datasets. These agents execute automated platform add-on matching, contract telemetry audits, and post-merger ERP consolidation workflows."
    },
    {
        q: "What data sovereignty guarantees does Elesium provide for MedTech and healthcare systems?",
        a: "All healthcare and medical hardware pipelines operate under strict DPDP Act 2023 Section 8(5) compliance and FDA 21 CFR Part 11 validation protocols. Data never leaves client-controlled private infrastructure, ensuring zero unauthorized retention and tamper-evident audit logs."
    },
    {
        q: "How does Elesium guarantee sub-200ms latency across energy and infrastructure logistics?",
        a: "We deploy custom vLLM inference runtimes running PagedAttention algorithms on dedicated NVIDIA H100/A100 clusters. This guarantees sub-200ms response times for real-time thermal load balancing, SCADA telemetry analysis, and grid equipment failure prediction."
    }
]

export default function Industries() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const aeoAnswerCapsule = "Elesium engineers sovereign enterprise AI automation architectures across six high-stakes master markets: Defense & Aerospace (AS9100/ITAR capacity routing), Private Equity (off-market M&A dealflow automation), Energy Infrastructure (thermal and grid distribution telemetry), Advanced MedTech (FDA-compliant CMO matching), Applied AI (statutory compliance state machines), and Strategic Capital Placement. Our deterministic LangGraph agents operate inside client-owned private VPCs with sub-200ms latency, zero third-party data egress, and audited 3x–5x ROI in 90 days."

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": "https://elesium.online/markets#collection",
                "name": "Sovereign Enterprise AI Automation for High-Stakes Master Markets | Elesium",
                "description": "Elesium engineers deterministic multi-agent systems and sovereign private VPC AI architectures across Defense, Private Equity, Energy, MedTech, and Industrial Supply Chains.",
                "url": "https://elesium.online/markets",
                "publisher": {
                    "@type": "Organization",
                    "@id": "https://elesium.online/#organization",
                    "name": "Elesium",
                    "url": "https://elesium.online",
                    "logo": "https://elesium.online/assets/ele-in-logo.png"
                },
                "hasPart": industries.map(ind => ({
                    "@type": "WebPage",
                    "name": ind.title,
                    "description": ind.description,
                    "url": `https://elesium.online/markets#${ind.id}`
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://elesium.online/markets#breadcrumb",
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
                        "name": "Markets",
                        "item": "https://elesium.online/markets"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://elesium.online/markets#faq",
                "mainEntity": industriesFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.a
                    }
                }))
            },
            {
                "@type": "WebPage",
                "@id": "https://elesium.online/markets#webpage",
                "name": "AI Automation for Every Industry | Elesium India",
                "description": aeoAnswerCapsule,
                "url": "https://elesium.online/markets",
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": [".answer-capsule", "h1", "h2"]
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>AI Automation for Every Industry | Elesium India</title>
                <meta name="description" content="Elesium delivers AI automation across BFSI, Healthcare, SaaS, Manufacturing and more. India's trusted AI partner for enterprise automation." />
                <link rel="canonical" href="https://elesium.online/markets" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>
            <h1 className="sr-only">AI Automation Solutions for Every Industry in India</h1>

            <main className="max-w-6xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">Markets</span>
                </nav>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-10 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            Enterprise Sector Architecture
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-gray-950 dark:text-white leading-[1.1]">
                        Master Markets.
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                        We orchestrate high-ticket dealflow and secure contract placement across six critical master markets. Our advanced matching systems connect Tier-1 primes, investment firms, and enterprise operators with friction-free precision.
                    </p>
                </motion.div>

                {/* AEO Answer Capsule */}
                <div className="answer-capsule mt-2 mb-12 p-6 rounded-2xl bg-gray-50/80 dark:bg-white/[0.03] border border-emerald-500/30 border-l-4 border-l-emerald-500 max-w-4xl shadow-sm">
                    <div className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        Definitive Answer Capsule • Sovereign Market Capacities
                    </div>
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                        {aeoAnswerCapsule}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.08 }}
                            className="bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between group hover:border-black dark:hover:border-white/30 transition-all shadow-sm"
                        >
                            <div>
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-2xl bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-sm">
                                        <industry.icon className="h-5 w-5 text-gray-900 dark:text-white" />
                                    </div>
                                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">{industry.title}</h2>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                    {industry.description}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-gray-200/80 dark:border-white/5">
                                <ul className="space-y-2">
                                    {industry.details.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-xs font-mono text-gray-600 dark:text-gray-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <section className="mb-16">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                                Architectural Inquiries
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                            Frequently Asked Questions • Sector Sovereignty
                        </h2>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-white/10 border-t border-b border-gray-200 dark:border-white/10">
                        {industriesFaqs.map((faq, idx) => (
                            <div key={idx} className="py-5">
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between text-left gap-4 group"
                                >
                                    <span className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        {faq.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-200 shrink-0 ${openFaq === idx ? 'rotate-180 text-emerald-500' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed pr-8">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom Call to Action Card */}
                <div className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-[#0A0A0A] text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Cross-Sector Enterprise Routing Desk</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-xl mx-auto text-white">
                        Deploy High-Throughput AI Workflows for Your Sector
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Schedule a 30-minute direct engineering evaluation. We map your domain data pipelines, evaluate regulatory compliance boundaries, and deliver an actionable deployment roadmap.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
