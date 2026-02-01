import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

interface HowWeWorkProps {
    onBack: () => void;
}

export default function HowWeWork({ onBack }: HowWeWorkProps) {
    const steps = [
        {
            number: '01',
            title: 'Discovery',
            description: 'We listen first. Understanding your unique supply chain bottlenecks and goals is the foundation of our partnership.',
            details: ['Requirements Mapping', 'Gap Analysis', 'Goal Setting']
        },
        {
            number: '02',
            title: 'Digital Twin',
            description: 'We build a digital model of your ideal partner ecosystem, calibrated against our global verified network.',
            details: ['Data Modeling', 'Network Scoping', 'Compliance Filters']
        },
        {
            number: '03',
            title: 'Match & Verify',
            description: 'AI-driven algorithms identify best-fit partners, while automated workflows validate every single certification.',
            details: ['Algorithmic Matching', 'Auto-Verification', 'Risk Assessment']
        },
        {
            number: '04',
            title: 'Connect',
            description: 'You receive a curated shortlist of ready-to-sign partners. Trust is engineered into the process from day one.',
            details: ['Curated Shortlist', 'Direct Introductions', 'Scale Operations']
        }
    ]

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-[#FAFAFA] dark:bg-[#050505] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            data-lenis-prevent
        >
            <div className="min-h-screen p-8 md:p-12 lg:p-20 max-w-[1600px] mx-auto flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-24 md:mb-32">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 text-sm font-medium tracking-wide uppercase text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>

                    <div className="hidden md:block text-xs font-mono text-gray-400">
                        PROCESS / 2024
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
                        {/* Title Section */}
                        <div className="lg:col-span-4">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-black dark:text-white mb-8"
                            >
                                How We<br />Work
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-lg text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed"
                            >
                                We don't just connect companies; we engineer partnerships based on verifiable data and mutual trust.
                            </motion.p>
                        </div>

                        {/* Steps Grid */}
                        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 + (index * 0.1), duration: 0.8 }}
                                    className="group border-t border-gray-200 dark:border-white/10 pt-8"
                                >
                                    <span className="block text-sm font-mono text-gray-400 mb-6">{step.number}</span>
                                    <h3 className="text-3xl font-medium mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {step.description}
                                    </p>
                                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                                        {step.details.map((detail) => (
                                            <li key={detail} className="text-xs font-medium uppercase tracking-wider text-gray-400">
                                                • {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
