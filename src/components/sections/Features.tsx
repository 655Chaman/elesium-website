import { motion, useInView } from 'framer-motion'
import { Globe, Shield, Zap } from 'lucide-react'
import { useRef } from 'react'

const features = [
    {
        icon: Globe,
        title: 'Global network',
        description: 'Connect with verified buyers and manufacturers across 150+ countries. Built for B2B transactions at scale.',
        image: '/api/placeholder/600/400',
    },
    {
        icon: Shield,
        title: 'Verified partners',
        description: 'Every connection is vetted for legitimacy and financial capacity before approval.',
        image: '/api/placeholder/600/400',
    },
    {
        icon: Zap,
        title: 'Direct transactions',
        description: 'Streamlined workflow from initial contact to contract execution.',
        image: '/api/placeholder/600/400',
    },
]

export default function Features() {
    return (
        <section id="services" className="py-40 bg-gradient-to-b from-white to-gray-50">
            <div className="container mx-auto px-6 max-w-7xl">
                {features.map((feature, index) => {
                    const Icon = feature.icon
                    const isEven = index % 2 === 0

                    return (
                        <FeatureBlock
                            key={feature.title}
                            feature={feature}
                            Icon={Icon}
                            isEven={isEven}
                            index={index}
                        />
                    )
                })}
            </div>
        </section>
    )
}

function FeatureBlock({ feature, Icon, isEven, index }: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20 mb-40 last:mb-0`}
        >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                    <Icon className="text-white" size={28} />
                </div>
                <h2 className="display-lg text-brand-dark">
                    {feature.title}
                </h2>
                <p className="body-lg text-gray-600">
                    {feature.description}
                </p>
            </div>

            {/* Image/Visual */}
            <div className="flex-1 w-full">
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.5 }}
                    className="relative rounded-3xl overflow-hidden glow-effect bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center"
                >
                    <Icon className="text-gray-300" size={80} />
                </motion.div>
            </div>
        </motion.div>
    )
}
