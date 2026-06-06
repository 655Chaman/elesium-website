import { motion } from 'framer-motion'
import { ArrowLeft, Shield, TrendingUp, Zap, Activity, Cpu, Share2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

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
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </button>
                    <span className="text-sm font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-600">
                        Industry Architecture
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-24 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8">
                        Master Markets.
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        We orchestrate high-ticket dealflow and secure contract placement across six critical master markets. Our advanced matching systems connect Tier-1 primes, investment firms, and enterprise operators with friction-free precision.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <industry.icon className="h-6 w-6 text-gray-900 dark:text-white" />
                                </div>
                                <h2 className="text-2xl font-semibold">{industry.title}</h2>
                            </div>

                            <div className="border-l-2 border-gray-100 dark:border-white/10 pl-6 group-hover:border-black dark:group-hover:border-white transition-colors duration-300">
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {industry.description}
                                </p>
                                <ul className="space-y-2">
                                    {industry.details.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                            <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
