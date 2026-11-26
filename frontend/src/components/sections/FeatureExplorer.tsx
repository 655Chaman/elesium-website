import { motion, useScroll, useTransform, AnimatePresence, PanInfo } from 'framer-motion'
import { useRef, useState } from 'react'
import { MotionValue } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import logoEmblem from '../../assets/LOGO_EMBLEM.png'
import MetallicPaint from '../ui/MetallicPaint'

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

function FeatureItem({ feature, index, total, scrollYProgress }: FeatureItemProps) {
    const start = index / total
    const end = (index + 1) / total
    const isFirst = index === 0
    const isLast = index === total - 1

    const opacity = useTransform(
        scrollYProgress,
        [start, start + 0.06, end - 0.06, end],
        [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
    )

    const y = useTransform(
        scrollYProgress,
        [start, start + 0.06, end - 0.06, end],
        [isFirst ? 0 : 12, 0, 0, isLast ? 0 : -12]
    )

    return (
        <motion.div
            style={{ opacity, y }}
            className="col-start-1 row-start-1 pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left px-4"
        >
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500 mb-5">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h2 className="section-h2 mb-4 text-center lg:text-left text-black dark:text-white transition-colors max-w-2xl">
                {feature.title}
            </h2>
            <p className="body-text text-neutral-600 dark:text-neutral-400 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                {feature.description}
            </p>
        </motion.div>
    )
}

const slideVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? 32 : -32,
    }),
    center: {
        opacity: 1,
        x: 0,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -32 : 32,
    }),
}

export default function FeatureExplorer() {
    const containerRef = useRef<HTMLElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    const [activeSlide, setActiveSlide] = useState(0)
    const [direction, setDirection] = useState(1)

    const goToSlide = (nextIndex: number) => {
        const clamped = (nextIndex + features.length) % features.length
        setDirection(nextIndex >= activeSlide ? 1 : -1)
        setActiveSlide(clamped)
    }

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (info.offset.x < -45 || info.velocity.x < -300) {
            setDirection(1)
            setActiveSlide((prev) => (prev + 1) % features.length)
        } else if (info.offset.x > 45 || info.velocity.x > 300) {
            setDirection(-1)
            setActiveSlide((prev) => (prev - 1 + features.length) % features.length)
        }
    }

    return (
        <section
            id="platform"
            ref={containerRef}
            className="relative bg-white dark:bg-black transition-colors duration-300 md:h-[3400px] py-16 md:py-0"
        >
            {/* Desktop Sticky Scroll Explorer + Monochrome Liquid Chrome Showcase */}
            <div className="hidden md:flex sticky top-[56px] h-[calc(100vh-56px)] items-center justify-center">
                <div className="max-w-6xl w-full mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="grid grid-cols-1 items-center relative w-full text-center lg:text-left">
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

                    <div className="relative rounded-xl overflow-hidden bg-neutral-950 border border-white/10 flex items-center justify-center h-[420px] lg:h-[480px] p-12">
                        <div className="w-64 h-64 lg:w-80 lg:h-80">
                            <MetallicPaint
                                imageSrc={logoEmblem}
                                alt="Elesium Connector Emblem"
                                scale={2.6}
                                speed={0.45}
                                brightness={2.2}
                                contrast={0.55}
                                lightColor="#ffffff"
                                darkColor="#2e2e32"
                                tintColor="#ffffff"
                                chromaticSpread={0}
                                liquid={0.78}
                                distortion={1.2}
                                resolution={512}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Rubber-Band Swipe Carousel */}
            <div className="md:hidden px-5 max-w-lg mx-auto">
                <div className="overflow-hidden">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeSlide}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.25}
                            onDragEnd={handleDragEnd}
                            className="cursor-grab active:cursor-grabbing rounded-lg border border-neutral-200 dark:border-white/10 bg-white dark:bg-black p-8 text-center min-h-[230px] flex flex-col items-center justify-center select-none"
                        >
                            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500 mb-4">
                                {String(activeSlide + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                            </span>
                            <h2 className="text-xl font-semibold tracking-tight text-black dark:text-white mb-3">
                                {features[activeSlide].title}
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {features[activeSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Carousel Controls */}
                <div className="mt-5 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide - 1)}
                        aria-label="Previous capability"
                        className="p-2 rounded-md border border-neutral-200 dark:border-white/10 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                        {features.map((f, idx) => (
                            <button
                                key={f.title}
                                type="button"
                                onClick={() => goToSlide(idx)}
                                aria-label={`Go to slide ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeSlide
                                        ? 'w-6 bg-black dark:bg-white'
                                        : 'w-1.5 bg-neutral-300 dark:bg-white/25'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide + 1)}
                        aria-label="Next capability"
                        className="p-2 rounded-md border border-neutral-200 dark:border-white/10 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
