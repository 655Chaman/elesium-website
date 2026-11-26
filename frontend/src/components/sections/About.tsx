import { motion, useInView } from 'framer-motion'
import { Target, Users, TrendingUp, Lightbulb, ShieldCheck, Zap } from 'lucide-react'
import { useRef } from 'react'

const stats = [
    { icon: Target, value: '150+', label: 'Countries' },
    { icon: Users, value: '10K+', label: 'Connections' },
    { icon: TrendingUp, value: '$5B+', label: 'Transaction volume' },
]

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })

    return (
        <section id="about" className="py-16 md:py-32 bg-white dark:bg-black">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="text-center mb-16 md:mb-20"
                >
                    <h2 className="display-lg mb-6 text-black dark:text-white">
                        Who We Are
                    </h2>
                    <p className="body-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto mb-4">
                        Elesium is an India-based AI engineering firm focused exclusively on enterprise architecture. Founded by engineers who spent the last decade architecting high-frequency data pipelines and scaling B2B revenue operations, we build deterministic, multi-agent systems that integrate deeply with legacy Indian enterprise stacks.
                    </p>
                    <p className="text-lg font-medium text-black dark:text-white max-w-3xl mx-auto">
                        We replace manual 40-hour workflows with autonomous agents.
                    </p>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-24">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.97 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 26, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 mb-6">
                                    <Icon className="text-black dark:text-white" size={28} />
                                </div>
                                <div className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </div>
                                <div className="text-lg text-neutral-600 dark:text-neutral-400">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.2 }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-black dark:text-white mb-12">Our Engineering Ethos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-xl border border-neutral-200 dark:border-white/10 transition-colors">
                            <Lightbulb className="w-8 h-8 text-black dark:text-white mb-6" />
                            <h3 className="text-xl font-bold text-black dark:text-white mb-3">Hard ROI Over Hype</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">Every agentic system we architect is mapped directly to a financial metric: hours saved, error rates reduced, or revenue cycle accelerated.</p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-xl border border-neutral-200 dark:border-white/10 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-black dark:text-white mb-6" />
                            <h3 className="text-xl font-bold text-black dark:text-white mb-3">Defensible Architecture</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">We build custom Python environments, deploy vector databases on your private VPC, and orchestrate multi-agent reasoning frameworks that handle real enterprise edge cases.</p>
                        </div>
                        <div className="bg-neutral-50 dark:bg-neutral-950 p-8 rounded-xl border border-neutral-200 dark:border-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-black dark:text-white mb-6" />
                            <h3 className="text-xl font-bold text-black dark:text-white mb-3">Legacy System Mastery</h3>
                            <p className="text-neutral-600 dark:text-neutral-400">Enterprise data is fragmented. We build ETL pipelines that connect modern AI reasoning engines to on-prem SAP, Oracle, and customized ERPs.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
