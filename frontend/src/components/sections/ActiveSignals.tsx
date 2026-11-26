import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { ArrowRight, MessageSquare } from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const workflows = [
    {
        id: 1,
        sector: 'Finance & Banking',
        status: 'In Production',
        description: 'Automated checking of financial statements, tax filings, and bank ledgers—catching mismatches in seconds instead of hours of manual review.',
        metric: 'Under 2 seconds per check',
        timeframe: 'Saved 14 hrs/case',
    },
    {
        id: 2,
        sector: 'Supply Chain & ERP',
        status: 'In Production',
        description: 'Direct integration into SAP and warehouse databases to flag low stock early, compare supplier quotes, and prepare purchase orders automatically.',
        metric: 'Zero stockout surprises',
        timeframe: 'Live SAP sync',
    },
    {
        id: 3,
        sector: 'Compliance & Audit',
        status: 'Private Cloud',
        description: 'Automated document verification and policy checks running strictly inside your own private servers so sensitive customer records never leave.',
        metric: '100% internal hosting',
        timeframe: 'Full audit trail',
    },
    {
        id: 4,
        sector: 'Manufacturing Ops',
        status: 'On-Premise',
        description: 'Real-time monitoring of shop-floor sensors and quality logs to spot machine wear or defects early and alert engineers before downtime hits.',
        metric: 'Early fault warnings',
        timeframe: 'Plant-floor ready',
    },
    {
        id: 5,
        sector: 'Operations & Support',
        status: 'In Production',
        description: 'Structured ticketing, invoice matching, and internal knowledge lookup connected straight into your existing databases and team tools.',
        metric: '70%+ less manual entry',
        timeframe: '14-day pilot',
    },
]

export default function ActiveSignals() {
    const [activeIndex, setActiveIndex] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.15 })
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <section
            ref={ref}
            className="relative bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 py-16 md:py-24 border-y border-neutral-200 dark:border-white/10"
        >
            <WhatsAppModal />
            <div className="max-w-6xl mx-auto px-5 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-10 md:mb-12"
                >
                    <div>
                        <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-500 block mb-2">
                            What We Automate
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
                            Production workflows across core teams
                        </h2>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">
                        Select a workflow to inspect
                    </span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 14 }}
                    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.08 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch"
                >
                    {/* Left Selector */}
                    <div className="md:col-span-4 flex flex-col justify-between gap-2.5">
                        {workflows.map((item, i) => (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`flex-1 text-left p-4 rounded-[20px] transition-all duration-200 border active:scale-[0.98] ${
                                    i === activeIndex
                                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25 text-black dark:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-[10px] font-mono uppercase tracking-wider ${
                                        i === activeIndex ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'
                                    }`}>
                                        {item.sector}
                                    </span>
                                    <span className={`text-[10px] font-mono ${
                                        i === activeIndex ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'
                                    }`}>
                                        {item.timeframe}
                                    </span>
                                </div>
                                <div className="text-sm font-medium leading-snug">
                                    {item.metric}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right Active Detail */}
                    <div className="md:col-span-8 border border-neutral-200 dark:border-white/10 rounded-[32px] overflow-hidden bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                        <div className="flex items-center justify-between px-7 py-4 border-b border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                            <span className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
                                {workflows[activeIndex].sector}
                            </span>
                            <span className="text-[10px] font-mono text-black dark:text-white uppercase tracking-widest font-semibold">
                                {workflows[activeIndex].status}
                            </span>
                        </div>

                        <div className="p-7 md:p-10 flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    className="space-y-5"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight">
                                        {workflows[activeIndex].metric}
                                    </div>
                                    <p className="text-lg md:text-xl font-normal leading-relaxed text-neutral-700 dark:text-neutral-300 max-w-2xl">
                                        {workflows[activeIndex].description}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <div className="px-7 py-5 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-neutral-500">
                                Scope a workflow for your team in a 30-minute engineering call.
                            </div>
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm active:scale-[0.97] transition-all"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Discuss Your Workflow</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
