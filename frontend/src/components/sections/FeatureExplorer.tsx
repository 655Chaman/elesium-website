import {
    motion,
    MotionValue,
    useMotionValueEvent,
    useScroll,
    useSpring,
    useTransform,
    AnimatePresence,
    PanInfo,
} from 'framer-motion'
import { useRef, useState } from 'react'
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
        [start, start + 0.065, end - 0.065, end],
        [isFirst ? 1 : 0, 1, 1, isLast ? 1 : 0]
    )

    const y = useTransform(
        scrollYProgress,
        [start, start + 0.065, end - 0.065, end],
        [isFirst ? 0 : 14, 0, 0, isLast ? 0 : -14]
    )

    const scale = useTransform(
        scrollYProgress,
        [start, start + 0.065, end - 0.065, end],
        [isFirst ? 1 : 0.985, 1, 1, isLast ? 1 : 0.985]
    )

    return (
        <motion.div
            style={{ opacity, y, scale }}
            className="col-start-1 row-start-1 pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left will-change-[opacity,transform]"
        >
            <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-500 mb-5">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <h2 className="text-3xl lg:text-[40px] font-medium tracking-[-0.025em] leading-[1.16] text-white mb-5 max-w-xl">
                {feature.title}
            </h2>
            <p className="text-base lg:text-[17px] font-light text-neutral-400 leading-relaxed max-w-lg">
                {feature.description}
            </p>
        </motion.div>
    )
}

const slideVariants = {
    enter: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? 36 : -36,
        scale: 0.98,
    }),
    center: {
        opacity: 1,
        x: 0,
        scale: 1,
    },
    exit: (dir: number) => ({
        opacity: 0,
        x: dir > 0 ? -36 : 36,
        scale: 0.98,
    }),
}

export default function FeatureExplorer() {
    const containerRef = useRef<HTMLElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ['start start', 'end end'],
    })

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001,
    })

    const [activeDesktopSlide, setActiveDesktopSlide] = useState(0)
    const [activeSlide, setActiveSlide] = useState(0)
    const [direction, setDirection] = useState(1)

    useMotionValueEvent(smoothProgress, 'change', (latest) => {
        const clamped = Math.min(features.length - 1, Math.max(0, Math.floor(latest * features.length)))
        setActiveDesktopSlide(clamped)
    })

    const scrollToSlide = (idx: number) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        const containerTop = window.scrollY + rect.top
        const scrollable = Math.max(1, rect.height - window.innerHeight)
        const targetProgress = (idx + 0.5) / features.length
        window.scrollTo({
            top: containerTop + targetProgress * scrollable,
            behavior: 'smooth',
        })
    }

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
            className="relative bg-black text-white md:h-[3200px] py-20 md:py-0"
        >
            {/* Desktop Sticky Scroll Explorer + Monochrome Liquid Chrome Showcase */}
            <div className="hidden md:flex sticky top-[56px] h-[calc(100vh-56px)] items-center justify-center">
                <div className="max-w-6xl w-full mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Clickable Indicators + Hairline Progress + Crossfading Capabilities */}
                    <div className="flex flex-col items-center lg:items-start w-full">
                        <div className="w-full max-w-lg mb-8">
                            <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                {features.map((f, idx) => {
                                    const isActive = idx === activeDesktopSlide
                                    return (
                                        <button
                                            key={f.title}
                                            type="button"
                                            onClick={() => scrollToSlide(idx)}
                                            aria-label={`Jump to capability ${idx + 1}: ${f.title}`}
                                            className={`px-3 py-1 rounded-full text-[11px] font-mono tracking-[0.18em] transition-all duration-300 active:scale-[0.97] ${
                                                isActive
                                                    ? 'bg-white text-black font-medium'
                                                    : 'bg-white/[0.04] text-neutral-500 border border-white/10 hover:text-white hover:border-white/25'
                                            }`}
                                        >
                                            {String(idx + 1).padStart(2, '0')}
                                        </button>
                                    )
                                })}
                            </div>
                            <div className="h-px w-full bg-white/10 overflow-hidden rounded-full">
                                <motion.div
                                    style={{ scaleX: smoothProgress }}
                                    className="h-full w-full origin-left bg-white/80"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-center relative w-full min-h-[210px]">
                            {features.map((feature, index) => (
                                <FeatureItem
                                    key={feature.title}
                                    feature={feature}
                                    index={index}
                                    total={features.length}
                                    scrollYProgress={smoothProgress}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Right: Generous Concentric Liquid-Chrome Showcase */}
                    <div className="relative rounded-[32px] overflow-hidden bg-neutral-950 border border-white/10 flex items-center justify-center h-[340px] lg:h-[480px] p-8 lg:p-12 shadow-[0_0_80px_rgba(255,255,255,0.03)]">
                        <div className="w-60 h-60 lg:w-80 lg:h-80">
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
                <div className="overflow-hidden rounded-[32px]">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={activeSlide}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ type: 'spring', stiffness: 280, damping: 28, mass: 0.9 }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.28}
                            onDragEnd={handleDragEnd}
                            className="cursor-grab active:cursor-grabbing rounded-[32px] border border-white/12 bg-neutral-950/90 p-8 sm:p-10 text-center min-h-[260px] flex flex-col items-center justify-center select-none"
                        >
                            <span className="inline-flex px-3.5 py-1 rounded-[18px] border border-white/10 bg-white/[0.03] text-[11px] font-mono tracking-[0.25em] uppercase text-neutral-400 mb-5">
                                {String(activeSlide + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                            </span>
                            <h2 className="text-xl font-medium tracking-[-0.02em] text-white mb-3">
                                {features[activeSlide].title}
                            </h2>
                            <p className="text-sm font-light text-neutral-400 leading-relaxed">
                                {features[activeSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Mobile Carousel Controls */}
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide - 1)}
                        aria-label="Previous capability"
                        className="p-3 rounded-full border border-white/15 text-white hover:bg-white/10 active:scale-[0.97] transition"
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
                                        ? 'w-7 bg-white'
                                        : 'w-1.5 bg-white/25 hover:bg-white/45'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide + 1)}
                        aria-label="Next capability"
                        className="p-3 rounded-full border border-white/15 text-white hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
