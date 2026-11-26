import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { MessageSquare, ArrowRight, Terminal } from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const signals = [
    {
        id: 1,
        sector: 'COMPLIANCE',
        status: 'ACTIVE SLA',
        description: 'Targeted outreach executing for a Tier-1 regulatory consultancy seeking organizations facing GDPR and DPDP non-compliance fines.',
        metric: '14 qualified responses',
        timeframe: '72 hours',
    },
    {
        id: 2,
        sector: 'LEGAL RISK',
        status: 'ACTIVE SLA',
        description: 'Active engagement: Class-action settlement restructuring RFQ, with decision-maker contacts engaged directly.',
        metric: '22 verified contacts',
        timeframe: '96 hours',
    },
    {
        id: 3,
        sector: 'PENALTY MARKET',
        status: 'EXECUTING',
        description: 'Connecting antitrust defense litigators with corporate groups anticipating regulatory crackdowns and statutory filings.',
        metric: '9 verified contacts',
        timeframe: '48 hours',
    },
    {
        id: 4,
        sector: 'DATA PRIVACY',
        status: 'ACTIVE SLA',
        description: 'Multi-channel outbound campaign targeting enterprise CTOs with imminent DPDP Act 2023 penalty exposures.',
        metric: '31 decision-makers reached',
        timeframe: '5 days',
    },
    {
        id: 5,
        sector: 'RISK MITIGATION',
        status: 'EXECUTING',
        description: 'Regulatory integration engagement connecting high-exposure financial institutions with audit specialists.',
        metric: '18 qualified leads surfaced',
        timeframe: '4 days',
    },
]

export default function ActiveSignals() {
    const [activeIndex, setActiveIndex] = useState(0)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <section
            ref={ref}
            className="relative bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 py-16 md:py-24 border-y border-gray-100 dark:border-white/10"
        >
            <WhatsAppModal />
            <div className="max-w-6xl mx-auto px-5 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="flex items-center justify-between mb-10 md:mb-14"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-[11px] font-semibold font-mono tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400">
                            Active Market Signals &middot; Real-Time Pipeline
                        </span>
                    </div>
                    <span className="hidden md:block text-[11px] font-mono text-neutral-500 uppercase tracking-wider">
                        Outbound Intelligence Feed
                    </span>
                </motion.div>

                {/* Main Display Grid */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98, y: 16 }}
                    animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch"
                >
                    {/* Left side: Interactive List */}
                    <div className="md:col-span-4 flex flex-col justify-between gap-2.5">
                        {signals.map((signal, i) => (
                            <button
                                key={signal.id}
                                onClick={() => setActiveIndex(i)}
                                className={`flex-1 text-left p-4 rounded-[20px] transition-all duration-200 border active:scale-[0.98] ${
                                    i === activeIndex 
                                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
                                    : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-white/10 hover:border-neutral-400 dark:hover:border-white/25 text-black dark:text-white'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${
                                        i === activeIndex ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-600 dark:text-neutral-400'
                                    }`}>
                                        {signal.sector}
                                    </span>
                                    <span className={`text-[10px] font-mono ${
                                        i === activeIndex ? 'text-neutral-300 dark:text-neutral-600' : 'text-neutral-500'
                                    }`}>
                                        {signal.timeframe}
                                    </span>
                                </div>
                                <div className="text-sm font-medium line-clamp-2 leading-snug">
                                    {signal.metric}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right side: Active Signal Detail */}
                    <div className="md:col-span-8 border border-neutral-200 dark:border-white/10 rounded-[32px] overflow-hidden bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                        {/* Terminal bar */}
                        <div className="flex items-center justify-between px-7 py-4 border-b border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-black dark:text-white" />
                                <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 tracking-wider">
                                    elesium-signals | active_engagement.log
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-black dark:text-white uppercase tracking-widest font-semibold">
                                {signals[activeIndex].status}
                            </span>
                        </div>

                        {/* Active signal display */}
                        <div className="p-7 md:p-10 flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -8 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-semibold tracking-wider text-black dark:text-white uppercase">
                                            {signals[activeIndex].sector}
                                        </span>
                                        <span className="text-neutral-400 dark:text-neutral-600">&middot;</span>
                                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                                            Timeframe: {signals[activeIndex].timeframe}
                                        </span>
                                    </div>

                                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-black dark:text-white max-w-2xl">
                                        {signals[activeIndex].description}
                                    </p>

                                    <div className="pt-2">
                                        <div className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight font-mono">
                                            {signals[activeIndex].metric}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* WhatsApp CTA Action Bar */}
                        <div className="px-7 py-6 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                                Deploy targeted outbound pipeline for your specific sector.
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3 rounded-full text-xs sm:text-sm active:scale-[0.97] transition-all"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Deploy via WhatsApp Desk</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
