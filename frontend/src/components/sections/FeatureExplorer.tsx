import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { MotionValue } from 'framer-motion'

const features = [
    {
        title: 'Proprietary Target Intelligence',
        description: 'We map your ideal buyer market with enriched data before contact is made.',
    },
    {
        title: 'Compliance-Verified Introductions',
        description: 'Introductions are pre-screened against your certification requirements. No unqualified contacts.',
    },
    {
        title: 'Global Decision-Maker Database',
        description: 'Access a continuously refreshed database of verified global decision-makers.',
    },
    {
        title: 'Engineered Trust Infrastructure',
        description: 'We build verifiable credibility into every introduction with transparent qualification history.',
    },
    {
        title: 'Multi-Signal Qualification Engine',
        description: 'Our outbound engine surfaces buying intent to ensure you speak with principals ready to move.',
    },
]

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
            <h3 className="section-h2 mb-4 text-center md:text-left dark:text-white">
                {feature.title}
            </h3>
            <p className="body-text text-gray-600 dark:text-gray-400 max-w-lg mx-auto md:mx-0 text-center md:text-left">
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
                <div className="max-w-6xl mx-auto px-5 md:px-12 grid grid-cols-1 items-center justify-items-center">
                    {/* Left: Text */}
                    <div className="grid grid-cols-1 items-center relative w-full text-center">
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
                </div>
            </div>
        </section>
    )
}

