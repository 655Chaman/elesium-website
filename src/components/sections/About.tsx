import { motion, useInView } from 'framer-motion'
import { Target, Users, TrendingUp } from 'lucide-react'
import { useRef } from 'react'

const stats = [
    { icon: Target, value: '150+', label: 'Countries' },
    { icon: Users, value: '10K+', label: 'Connections' },
    { icon: TrendingUp, value: '$5B+', label: 'Transaction volume' },
]

export default function About() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section id="about" className="py-40 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-20"
                >
                    <h2 className="display-lg mb-6 text-brand-dark">
                        Built for <span className="text-gradient">scale</span>
                    </h2>
                    <p className="body-lg text-gray-600 max-w-3xl mx-auto">
                        Elesium connects verified industrial buyers and sellers globally.
                    </p>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
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
                                <div className="text-6xl font-bold text-brand-dark mb-3" style={{ letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </div>
                                <div className="text-lg text-gray-600">
                                    {stat.label}
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
