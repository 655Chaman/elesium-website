import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Edit these entries to reflect your active mandates
const signals = [
    {
        id: 1,
        sector: 'AEROSPACE',
        status: 'ACTIVE',
        description: 'Targeted outreach executing for a Tier-2 composite manufacturer seeking AS9100-certified lamination partners.',
        metric: '14 qualified responses',
        timeframe: '72 hours',
    },
    {
        id: 2,
        sector: 'INDUSTRIAL',
        status: 'ACTIVE',
        description: 'Active mandate: precision machining RFQ from European aerospace OEM — decision-maker contacts engaged.',
        metric: '22 verified contacts',
        timeframe: '96 hours',
    },
    {
        id: 3,
        sector: 'AEROSPACE',
        status: 'EXECUTING',
        description: 'AS9100 / NADCAP-certified fastener supplier sourcing for a Midwest industrial group. Pipeline seeded.',
        metric: '9 verified contacts',
        timeframe: '48 hours',
    },
    {
        id: 4,
        sector: 'ENERGY',
        status: 'ACTIVE',
        description: 'Multi-channel outbound campaign running for an energy infrastructure OEM targeting certified welding subcontractors.',
        metric: '31 decision-makers reached',
        timeframe: '5 days',
    },
    {
        id: 5,
        sector: 'AUTOMOTIVE',
        status: 'EXECUTING',
        description: 'Lightweight material innovation mandate — connecting EV battery enclosure manufacturer with Tier-1 aluminum die-casters.',
        metric: '18 qualified leads surfaced',
        timeframe: '4 days',
    },
]

export default function ActiveSignals() {
    const [activeIndex, setActiveIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % signals.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [isPaused])

    const sectorColor = (sector: string) => {
        if (sector === 'AEROSPACE') return 'text-blue-400'
        if (sector === 'INDUSTRIAL') return 'text-amber-400'
        if (sector === 'ENERGY') return 'text-emerald-400'
        if (sector === 'AUTOMOTIVE') return 'text-violet-400'
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-mono font-semibold tracking-[0.22em] uppercase text-emerald-400">
                            Live Signals
                        </span>
                    </div>
                    <span className="hidden md:block text-xs font-mono text-white/20 tracking-widest uppercase">
                        Outbound Intelligence Feed
                    </span>
                </motion.div>

                {/* Main Display */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    className="border border-white/8 rounded-2xl md:rounded-3xl overflow-hidden"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Terminal bar */}
                    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/8 bg-white/[0.03]">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
                        <div className="h-2.5 w-2.5 rounded-full bg-amber-500/50" />
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/50" />
                        <span className="ml-3 text-xs font-mono text-white/20 tracking-wider">
                            elesium-signals-v2 — active_mandates.log
                        </span>
                    </div>

                    {/* Active signal display */}
                    <div className="p-6 md:p-10 min-h-[200px] md:min-h-[180px] flex flex-col justify-center">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -12 }}
                                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                                className="space-y-4"
                            >
                                {/* Sector + Status */}
                                <div className="flex items-center gap-4 flex-wrap">
                                    <span className={`text-xs font-mono font-bold tracking-[0.2em] uppercase ${sectorColor(signals[activeIndex].sector)}`}>
                                        {signals[activeIndex].sector}
                                    </span>
                                    <span className="h-px w-6 bg-white/15" />
                                    <span className="text-xs font-mono tracking-widest uppercase text-white/30">
                                        {signals[activeIndex].status}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-lg md:text-2xl font-light leading-snug text-white/80 max-w-3xl">
                                    {signals[activeIndex].description}
                                </p>

                                {/* Metric */}
                                <div className="flex items-baseline gap-2 pt-2">
                                    <span className="text-3xl md:text-4xl font-bold text-white tracking-tight font-mono">
                                        {signals[activeIndex].metric}
                                    </span>
                                    <span className="text-sm text-white/35 font-mono">
                                        / {signals[activeIndex].timeframe}
                                    </span>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Navigation dots + progress */}
                    <div className="flex items-center justify-between px-6 md:px-10 pb-6 border-t border-white/5 pt-4">
                        <div className="flex gap-2">
                            {signals.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveIndex(i)}
                                    aria-label={`View signal ${i + 1}`}
                                    className={`h-1 rounded-full transition-all duration-400 ${
                                        i === activeIndex
                                            ? 'w-8 bg-white/60'
                                            : 'w-2 bg-white/15 hover:bg-white/30'
                                    }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-mono text-white/20">
                            {String(activeIndex + 1).padStart(2, '0')} / {String(signals.length).padStart(2, '0')}
                        </span>
                    </div>
                </motion.div>

                {/* All signals ledger (below fold) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5 rounded-xl overflow-hidden"
                >
                    {[
                        { label: 'Campaigns Active', value: '12' },
                        { label: 'Decision-Makers Reached (30d)', value: '340+' },
                        { label: 'Avg. Response Time', value: '< 72h' },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-[#050505] px-6 py-5 flex flex-col gap-1">
                            <span className="text-xs font-mono text-white/25 uppercase tracking-widest">{stat.label}</span>
                            <span className="text-2xl md:text-3xl font-bold text-white font-mono">{stat.value}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
