import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

const signals = [
    {
        id: 1,
        sector: 'COMPLIANCE',
        status: 'ACTIVE',
        description: 'Targeted outreach executing for a Tier-1 regulatory consultancy seeking organizations facing GDPR non-compliance fines.',
        metric: '14 qualified responses',
        timeframe: '72 hours',
    },
    {
        id: 2,
        sector: 'LEGAL RISK',
        status: 'ACTIVE',
        description: 'Active engagement: Class-action settlement restructuring RFQ — decision-maker contacts engaged.',
        metric: '22 verified contacts',
        timeframe: '96 hours',
    },
    {
        id: 3,
        sector: 'PENALTY MARKET',
        status: 'EXECUTING',
        description: 'Connecting antitrust defense litigators with corporate groups anticipating regulatory crackdowns.',
        metric: '9 verified contacts',
        timeframe: '48 hours',
    },
    {
        id: 4,
        sector: 'DATA PRIVACY',
        status: 'ACTIVE',
        description: 'Multi-channel outbound campaign targeting enterprise CTOs with imminent CCPA penalty exposures.',
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

    const sectorColor = (sector: string) => {
        if (sector === 'COMPLIANCE') return 'text-blue-400'
        if (sector === 'LEGAL RISK') return 'text-amber-400'
        if (sector === 'PENALTY MARKET') return 'text-purple-400'
        if (sector === 'DATA PRIVACY') return 'text-indigo-400'
        return 'text-gray-400'
    }

    return (
        <section
            ref={ref}
            className="relative bg-[#050505] dark:bg-[#050505] py-16 md:py-24 border-y border-white/5"
        >
            <div className="max-w-6xl mx-auto px-5 md:px-12">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="flex items-center justify-between mb-10 md:mb-14"
                >
                    <div className="flex items-center gap-3">
                        {/* Pulse dot */}
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                        </span>
                        <span className="text-[11px] font-medium tracking-[0.08em] text-blue-400">
                            Live Signals
                        </span>
                    </div>
                    <span className="hidden md:block text-[11px] font-medium text-white/20 tracking-[0.06em]">
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
                                className={`text-left p-4 rounded-xl transition-all duration-300 border ${
                                    i === activeIndex 
                                    ? 'bg-white/10 border-white/20 shadow-lg' 
                                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] font-semibold tracking-wider ${sectorColor(signal.sector)}`}>
                                        {signal.sector}
                                    </span>
                                    <span className="text-[10px] font-mono text-white/30">
                                        {signal.timeframe}
                                    </span>
                                </div>
                                <div className="text-sm font-medium text-white/80 line-clamp-2">
                                    {signal.metric}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right side: Active Signal Detail */}
                    <div className="md:col-span-8 border border-white/8 rounded-2xl md:rounded-3xl overflow-hidden bg-[#0A0A0A]">
                        {/* Terminal bar */}
                        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-white/[0.03]">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                            <div className="h-2.5 w-2.5 rounded-full bg-blue-500/50" />
                            <span className="ml-3 text-xs font-mono text-white/20 tracking-wider">
                                elesium-signals-v2 — active_engagements.log
                            </span>
                        </div>

                        {/* Active signal display */}
                        <div className="p-6 md:p-10 min-h-[300px] flex flex-col justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-6"
                                >
                                    {/* Sector + Status */}
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className={`text-xs font-semibold tracking-[0.08em] ${sectorColor(signals[activeIndex].sector)}`}>
                                            {signals[activeIndex].sector}
                                        </span>
                                        <span className="h-px w-6 bg-white/15" />
                                        <span className="text-xs font-medium tracking-[0.06em] text-white/40">
                                            {signals[activeIndex].status}
                                        </span>
                                    </div>

                                    {/* Description */}
                                    <p className="text-xl md:text-3xl font-light leading-snug text-white/90 max-w-3xl">
                                        {signals[activeIndex].description}
                                    </p>

                                    {/* Metric */}
                                    <div className="flex items-baseline gap-2 pt-4">
                                        <span className="text-4xl md:text-5xl font-bold text-white tracking-tight font-mono">
                                            {signals[activeIndex].metric}
                                        </span>
                                    </div>
                                    <div className="text-sm text-white/40 font-mono">
                                        Timeframe: {signals[activeIndex].timeframe}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
