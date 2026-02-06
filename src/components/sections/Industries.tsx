import { motion, useInView } from 'framer-motion'
import { Plane, Factory, Building2, Zap, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import { useRef } from 'react'

const industries = [
    {
        icon: Plane,
        title: 'Aerospace',
        description: 'Manufacturers and suppliers for aviation and space.',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Factory,
        title: 'Manufacturing',
        description: 'Industrial equipment and machinery.',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: Building2,
        title: 'Real estate',
        description: 'Commercial and industrial property.',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Zap,
        title: 'Energy',
        description: 'Renewable and traditional energy.',
        color: 'from-green-500 to-emerald-500',
    },
]

export default function Industries() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    return (
        <section id="industries" className="py-16 md:py-40 bg-white">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-10 md:mb-20"
                >
                    <h2 className="display-lg mb-6 text-brand-dark">
                        <span className="text-gradient">Industries</span>
                    </h2>
                    <p className="body-lg text-gray-600 max-w-3xl mx-auto">
                        Connecting buyers and sellers across key sectors.
                    </p>
                </motion.div>

                <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {industries.map((industry, index) => {
                        const Icon = industry.icon
                        return (
                            <IndustryCard
                                key={industry.title}
                                industry={industry}
                                Icon={Icon}
                                index={index}
                                isInView={isInView}
                            />
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function IndustryCard({ industry, Icon, index, isInView }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
            <Card className="h-full group cursor-pointer">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${industry.color} flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110`}>
                    <Icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-brand-dark">
                    {industry.title}
                </h3>
                <p className="text-gray-600 mb-4 text-base leading-relaxed">
                    {industry.description}
                </p>
                <div className="flex items-center text-brand-accent group-hover:translate-x-2 transition-transform duration-500">
                    <span className="font-medium text-sm">Learn more</span>
                    <ChevronRight size={18} />
                </div>
            </Card>
        </motion.div>
    )
}
