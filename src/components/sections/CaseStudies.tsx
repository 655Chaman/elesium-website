import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const caseStudies = [
    {
        id: 1,
        title: 'Aerospace Components',
        description: 'Placed 4 AS9100-certified manufacturing partners into a Tier-1 defense pipeline within 45 days.',
        stats: [
            { label: 'Partners Placed', value: '4' },
            { label: 'Standard', value: 'AS9100' },
            { label: 'Timeline', value: '45 Days' }
        ]
    },
    {
        id: 2,
        title: 'Industrial Robotics',
        description: 'Secured 2 primary automation integration contracts totaling $140K in under 60 days.',
        stats: [
            { label: 'Contracts', value: '2' },
            { label: 'Value', value: '$140K' },
            { label: 'Timeline', value: '< 60 Days' }
        ]
    },
    {
        id: 3,
        title: 'Precision Machining',
        description: 'Connected a high-volume supply bottleneck with a vetted capacity partner within 14 days.',
        stats: [
            { label: 'Resolution', value: 'Capacity Matched' },
            { label: 'Vetting', value: '100% Cleared' },
            { label: 'Timeline', value: '14 Days' }
        ]
    },
]

export default function CaseStudies() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })

    return (
        <section
            id="case-studies"
            ref={ref}
            className="relative transition-colors duration-300 dark:bg-black bg-[#FAFAFA] py-16 md:py-24"
        >
            <div className="max-w-6xl mx-auto px-5 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <h2 className="section-h2 mb-4 text-left dark:text-white transition-colors">
                        Recent Connections
                    </h2>
                    <p className="body-text text-left mb-12 max-w-2xl dark:text-gray-400 transition-colors">
                        Data-driven results. No descriptive paragraphs. Just stark performance metrics.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {caseStudies.map((study, i) => (
                        <motion.div
                            key={study.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                            className="bg-white dark:bg-[#111] dark:border dark:border-white/5 border border-gray-200 p-8 rounded-2xl flex flex-col h-full hover:shadow-lg transition-shadow"
                        >
                            <h3 className="text-2xl font-bold mb-4 text-black dark:text-white">
                                {study.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-8 flex-grow text-lg">
                                {study.description}
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-white/10 pt-6 mt-auto">
                                {study.stats.map((stat, idx) => (
                                    <div key={idx} className="flex flex-col">
                                        <span className="text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">{stat.label}</span>
                                        <span className="text-sm font-semibold text-black dark:text-white">{stat.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
