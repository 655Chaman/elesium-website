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
        description: 'Active engagement: Class-action settlement restructuring RFQ — decision-maker contacts engaged directly.',
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
        description: 'Regulatory integration engagement — connecting high-exposure financial institutions with audit specialists.',
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between mb-10 md:mb-14"
                >
                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2 w-2">
                            <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                        </span>
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            Active Market Signals • Real-Time Pipeline
                        </span>
                    </div>
                    <span className="hidden md:block text-[11px] font-mono text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Outbound Intelligence Feed
                    </span>
                </motion.div>

                {/* Main Display Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8"
                >
                    {/* Left side: Interactive List */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                        {signals.map((signal, i) => (
                            <button
                                key={signal.id}
                                onClick={() => setActiveIndex(i)}
                                className={`text-left p-4 rounded-2xl transition-all duration-200 border ${
                                    i === activeIndex 
                                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white shadow-md' 
                                    : 'bg-gray-50/80 dark:bg-white/[0.02] border-gray-200/80 dark:border-white/5 hover:border-gray-300 dark:hover:border-white/20 text-gray-800 dark:text-gray-200'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className={`text-[10px] font-mono font-semibold tracking-wider uppercase ${
                                        i === activeIndex ? 'text-emerald-400 dark:text-emerald-600' : 'text-gray-500 dark:text-gray-400'
                                    }`}>
                                        {signal.sector}
                                    </span>
                                    <span className={`text-[10px] font-mono ${
                                        i === activeIndex ? 'text-gray-300 dark:text-gray-700' : 'text-gray-400 dark:text-gray-500'
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
                    <div className="md:col-span-8 border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden bg-gray-50/80 dark:bg-[#0A0A0A] flex flex-col justify-between">
                        {/* Terminal bar */}
                        <div className="flex items-center justify-between px-6 py-3.5 border-b border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02]">
                            <div className="flex items-center gap-2">
                                <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400 tracking-wider">
                                    elesium-signals — active_engagement.log
                                </span>
                            </div>
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                {signals[activeIndex].status}
                            </span>
                        </div>

                        {/* Active signal display */}
                        <div className="p-6 md:p-10 flex-1 flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-semibold tracking-wider text-emerald-600 dark:text-emerald-400 uppercase">
                                            {signals[activeIndex].sector}
                                        </span>
                                        <span className="text-gray-300 dark:text-gray-700">•</span>
                                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                            Timeframe: {signals[activeIndex].timeframe}
                                        </span>
                                    </div>

                                    <p className="text-xl md:text-2xl font-medium leading-relaxed text-gray-900 dark:text-white max-w-2xl">
                                        {signals[activeIndex].description}
                                    </p>

                                    <div className="pt-2">
                                        <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight font-mono">
                                            {signals[activeIndex].metric}
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* WhatsApp CTA Action Bar */}
                        <div className="p-6 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                Deploy targeted outbound pipeline for your specific sector.
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm transition-all shadow-sm"
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
