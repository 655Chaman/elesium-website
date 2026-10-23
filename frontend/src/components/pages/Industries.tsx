import { motion } from 'framer-motion'
import { ArrowRight, Shield, TrendingUp, Zap, Activity, Cpu, Share2, MessageSquare, ChevronRight } from 'lucide-react'
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

export default function Industries() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>AI Automation for Every Industry | Elesium India</title>
                <meta name="description" content="Elesium delivers AI automation across BFSI, Healthcare, SaaS, Manufacturing and more. India's trusted AI partner for enterprise automation." />
                <link rel="canonical" href="https://elesium.online/markets" />
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
                    className="mb-14 md:mb-16 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            Enterprise Sector Architecture
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-black dark:text-white leading-[1.1]">
                        Master Markets.
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                        We orchestrate high-ticket dealflow and secure contract placement across six critical master markets. Our advanced matching systems connect Tier-1 primes, investment firms, and enterprise operators with friction-free precision.
                    </p>
                </motion.div>

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

                {/* Bottom Call to Action Card */}
                <div className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-[#0A0A0A] text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Cross-Sector Enterprise Routing Desk</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight max-w-xl mx-auto">
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
