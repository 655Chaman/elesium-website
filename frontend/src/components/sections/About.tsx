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
        <section id="about" className="py-16 md:py-40 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-16 md:mb-20"
                >
                    <h2 className="display-lg mb-6 text-brand-dark">
                        Who <span className="text-gradient">We Are</span>
                    </h2>
                    <p className="body-lg text-gray-600 max-w-3xl mx-auto mb-4">
                        Elesium is an India-based AI engineering firm focused exclusively on enterprise architecture. Founded by engineers who spent the last decade architecting high-frequency data pipelines and scaling B2B revenue operations, we don't build toys. We build deterministic, multi-agent systems that integrate deeply with legacy Indian enterprise stacks.
                    </p>
                    <p className="text-lg font-medium text-gray-700 max-w-3xl mx-auto">
                        We replace manual 40-hour workflows with autonomous agents.
                    </p>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto mb-32">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.8, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
                                    <Icon className="text-white" size={32} />
                                </div>
                                <div className="text-4xl md:text-6xl font-bold text-brand-dark mb-3" style={{ letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </div>
                                <div className="text-lg text-gray-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-brand-dark mb-12">Our Engineering Ethos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                            <Lightbulb className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Hard ROI Over Hype</h3>
                            <p className="text-gray-600">We refuse to build generative AI toys. Every agentic system we architect is mapped directly to a financial metric: hours saved, error rates reduced, or revenue cycle accelerated.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                            <ShieldCheck className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Defensible Architecture</h3>
                            <p className="text-gray-600">We don't just wrap ChatGPT APIs. We build custom Python environments, deploy vector databases on your private VPC, and orchestrate multi-agent reasoning frameworks that handle real enterprise edge cases.</p>
                        </div>
                        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-shadow hover:shadow-md">
                            <Zap className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold text-brand-dark mb-3">Legacy System Mastery</h3>
                            <p className="text-gray-600">Indian enterprise data is messy and fragmented. We specialize in building intelligent ETL pipelines that connect modern AI reasoning engines to on-prem SAP, Oracle, and customized ERPs.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
