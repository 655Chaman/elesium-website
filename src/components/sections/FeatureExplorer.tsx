import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import logoWhite from '../../Assets/LOGO_NEW.png'
import MetallicPaint from '../ui/MetallicPaint/MetallicPaint'

const features = [
    {
        title: 'Proprietary Target Intelligence',
        description: 'We map the entire landscape of your ideal buyer market — enriched with firmographic, technographic, and compliance data — before a single contact is made.',
    },
    {
        title: 'Compliance-Verified Introductions',
        description: 'Every introduction is pre-screened against your exact certification requirements: AS9100, ISO 9001, NADCAP, ITAR. No unqualified contacts. Ever.',
    },
    {
        title: 'Global Decision-Maker Database',
        description: 'Access a continuously refreshed database of verified decision-makers across aerospace, industrial, energy, and automotive sectors worldwide.',
    },
    {
        title: 'Engineered Trust Infrastructure',
        description: 'We build verifiable credibility into every introduction — transparent qualification history, certification status, and risk assessment delivered upfront.',
    },
    {
        title: 'Multi-Signal Qualification Engine',
        description: 'Our outbound engine deploys multi-channel signals to surface buying intent, bypass gatekeepers, and ensure you only speak with principals ready to move.',
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
            <h3 className="text-3xl md:text-5xl font-bold tracking-tighter text-black dark:text-white mb-4 text-center md:text-left">
                {feature.title}
            </h3>
            <p className="text-base md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto md:mx-0 text-center md:text-left">
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

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <section
            id="platform"
            ref={containerRef}
            className="relative bg-white"
            style={{
                height: isMobile ? 'auto' : '3571px',
                paddingTop: isMobile ? '60px' : '120px',
                paddingBottom: isMobile ? '60px' : '120px'
            }}
        >
            <div className="md:sticky md:top-[52px] md:h-[calc(100vh-52px)] flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-5 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                    {/* Left: Text */}
                    <div className="grid grid-cols-1 items-center md:-ml-12 relative w-full order-2 lg:order-1">
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

                    {/* Right: MetallicPaint Logo */}
                    <div className="relative rounded-3xl overflow-hidden bg-gray-50 dark:bg-black/40 border border-gray-100 dark:border-white/5 flex items-center justify-center h-[250px] md:h-[500px] w-full order-1 lg:order-2">
                        <div className="w-full max-w-[280px] md:max-w-none md:w-[700px] h-full mx-auto md:ml-40 mt-0 md:mt-5 opacity-100">
                            <MetallicPaint
                                imageSrc={logoWhite}
                                scale={3}
                                speed={0.5}
                                brightness={2.5}
                                darkColor="#444444"
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
