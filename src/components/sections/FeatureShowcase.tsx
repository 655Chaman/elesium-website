import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Globe, Shield, Zap } from 'lucide-react'

const features = [
    {
        icon: Globe,
        title: 'Global network',
        description: 'Connect with verified buyers and manufacturers across 150+ countries. Built for B2B transactions at scale.',
    },
    {
        icon: Shield,
        title: 'Verified partners',
        description: 'Every connection is vetted for legitimacy and financial capacity before approval.',
    },
    {
        icon: Zap,
        title: 'Direct transactions',
        description: 'Streamlined workflow from initial contact to contract execution.',
    },
]

function FeatureBlock({ feature, Icon, isEven, index }: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1.2, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-20 mb-40 last:mb-0`}
        >
            {/* Text Content */}
            <div className="flex-1 space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4">
                    <Icon className="text-white" size={28} />
                </div>
                <h3 className="section-heading">
                    {feature.title}
                </h3>
                <p className="body-text">
                    {feature.description}
                </p>
            </div>

            {/* UI Preview with Blue Glow */}
            <div className="flex-1 w-full">
                <div className="relative rounded-3xl overflow-hidden glow-blue bg-gradient-to-br from-gray-100 to-gray-200 aspect-video flex items-center justify-center">
                    <Icon className="text-gray-300" size={80} />
                </div>
            </div>
        </motion.div>
    )
}

export default function FeatureShowcase() {
    return (
        <section id="platform" className="py-40 px-[72px] bg-white">
            <div className="max-w-[1200px] mx-auto">
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
