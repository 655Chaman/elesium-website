import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import logoWhite from '../../Assets/LOGO_NEW.png'
import MetallicPaint from '../ui/MetallicPaint/MetallicPaint'

const features = [
    {
        title: 'Smart Matching',
        description: 'Connect with partners that actually fit your specific needs',
    },
    {
        title: 'Verified Partners',
        description: 'Every supplier is vetted for quality, reliability, and capability',
    },
    {
        title: 'Global Network',
        description: 'Access a worldwide database of manufacturers and suppliers',
    },
    {
        title: 'Instant Trust',
        description: 'Transparent history and qualifications build confidence immediately',
    },
    {
        title: 'Contextual Search',
        description: 'Find exactly what you need with deep, context-aware filtering',
    },
]

import { MotionValue } from 'framer-motion'

interface Feature {
    title: string
    description: string
}

interface FeatureItemProps {
    feature: Feature
    index: number
    total: number
    scrollYProgress: MotionValue<number>
}

// Sub-component to handle per-item hooks safely
function FeatureItem({ feature, index, total, scrollYProgress }: FeatureItemProps) {
    const start = index / total
    const end = (index + 1) / total

    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.05, end - 0.05, end],
        [0, 1, 1, 0]
    )

    return (
        <motion.div
            style={{ opacity }}
            className="col-start-1 row-start-1"
        >
            <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-black dark:text-white mb-6">
                {feature.title}
            </h3>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                {feature.description}
            </p>
        </motion.div>
    )
}

export default function FeatureExplorer() {
    const containerRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end']
    })

    return (
        <section
            id="platform"
            ref={containerRef}
            className="relative bg-white"
            style={{
                height: '3571px',
                paddingTop: '120px',
                paddingBottom: '120px'
            }}
        >
            <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-4 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
                    {/* Left: Text */}
                    <div className="grid grid-cols-1 items-center md:-ml-12 relative w-full">
                        {features.map((feature, index) => (
                            <FeatureItem
                                key={feature.title}
                                feature={feature}
                                index={index}
                                total={features.length}
                                scrollYProgress={scrollYProgress}
                            />
                        ))}
                    </div>

                    {/* Right: Media Placeholder */}
                    <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 flex items-center justify-center" style={{ height: '550px', width: '100%' }}>
                        <div className="w-full max-w-[310px] md:max-w-none md:w-[700px] h-full ml-0 md:ml-40 mt-0 md:mt-5 opacity-90">
                            <MetallicPaint
                                imageSrc={logoWhite}
                                scale={3}
                                speed={0.5}
                                brightness={1.5}
                                liquid={0.8}
                                distortion={1.5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
