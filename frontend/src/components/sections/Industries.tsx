import { motion, useInView } from 'framer-motion'
import { Plane, Factory, Building2, Zap, ChevronRight } from 'lucide-react'
import Card from '../ui/Card'
import { useRef } from 'react'

const industries = [
    {
        icon: Plane,
        title: 'Aerospace',
        description: 'Manufacturers and suppliers for aviation and space.',
    },
    {
        icon: Factory,
        title: 'Manufacturing',
        description: 'Industrial equipment and machinery.',
    },
    {
        icon: Building2,
        title: 'Real estate',
        description: 'Commercial and industrial property.',
    },
    {
        icon: Zap,
        title: 'Energy',
        description: 'Renewable and traditional energy.',
    },
]

export default function Industries() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })

    return (
        <section id="industries" className="py-16 md:py-32 bg-white dark:bg-black">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="text-center mb-10 md:mb-20"
                >
                    <h2 className="display-lg mb-6 text-black dark:text-white">
                        Industries
                    </h2>
                    <p className="body-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
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
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26, delay: index * 0.08 }}
        >
            <Card className="h-full group cursor-pointer rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                <div className="w-14 h-14 rounded-xl bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-105">
                    <Icon className="text-black dark:text-white" size={24} />
                </div>
                <h3 className="text-2xl font-semibold mb-3 text-black dark:text-white">
                    {industry.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-base leading-relaxed">
                    {industry.description}
                </p>
                <div className="flex items-center text-black dark:text-white group-hover:translate-x-1 transition-transform duration-300">
                    <span className="font-medium text-sm">Learn more</span>
                    <ChevronRight size={18} />
                </div>
            </Card>
        </motion.div>
    )
}
