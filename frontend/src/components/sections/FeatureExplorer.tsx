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
        tag: 'Targeting',
        title: 'Verified Buyer Mapping',
        description: 'We identify and verify the exact buying teams looking for what you deliver before any outreach begins.',
    },
    {
        tag: 'Qualification',
        title: 'Requirements Checked Upfront',
        description: 'Every introduction is screened against your criteria beforehand so neither side wastes a call.',
    },
    {
        tag: 'Direct Access',
        title: 'Straight to Decision-Makers',
        description: 'Skip gatekeepers and cold directories. Meet directly with the principals who hold budget and authority.',
    },
    {
        tag: 'Clarity',
        title: 'Context on Every Introduction',
        description: 'Both sides enter the conversation informed, aligned on scope, and ready to discuss real work.',
    },
    {
        tag: 'Timing',
        title: 'Built Around Active Demand',
        description: 'We focus strictly on active mandates and near-term buying timelines so conversations move to execution.',
    },
]

interface Feature {
    tag: string
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

    const scale = useTransform(
        scrollYProgress,
        [start, start + 0.06, end - 0.06, end],
        [isFirst ? 1 : 0.985, 1, 1, isLast ? 1 : 0.985]
    )

    return (
        <motion.div
            style={{ opacity, y, scale }}
            className="col-start-1 row-start-1 pointer-events-none flex flex-col items-center lg:items-start text-center lg:text-left will-change-[opacity,transform]"
        >
            <span className="text-[11px] font-mono tracking-[0.24em] uppercase text-neutral-500 mb-4">
                {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} &middot; {feature.tag}
            </span>
            <h2 className="text-3xl lg:text-[40px] font-medium tracking-[-0.025em] leading-[1.16] text-white mb-4 max-w-xl">
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
        stiffness: 140,
        damping: 26,
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

    const currentDesktopFeature = features[activeDesktopSlide] || features[0]

    return (
        <section
            id="platform"
            ref={containerRef}
            className="relative bg-black text-white md:h-[2100px] py-20 md:py-0"
        >
            {/* Desktop Sticky Scroll Explorer + Synchronized Emblem Showcase */}
            <div className="hidden md:flex sticky top-[56px] h-[calc(100svh-56px)] items-center justify-center">
                <div className="max-w-6xl w-full mx-auto px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Step Indicators + Progress Line + Scroll-Synced Copy */}
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
                                            aria-label={`Jump to step ${idx + 1}: ${f.title}`}
                                            className={`px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-[0.18em] transition-all duration-300 active:scale-[0.97] ${
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

                        <div className="grid grid-cols-1 items-center relative w-full min-h-[200px]">
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

                    {/* Right: Architectural Concentric Emblem Stage Synced to Active Step */}
                    <div className="relative rounded-[32px] overflow-hidden bg-neutral-950 border border-white/12 flex flex-col items-center justify-between h-[360px] lg:h-[460px] p-8 shadow-[0_0_90px_rgba(255,255,255,0.03)]">
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-40"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 50% 46%, rgba(255,255,255,0.08) 0%, transparent 60%), radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)',
                                backgroundSize: '100% 100%, 24px 24px',
                            }}
                        />

                        <div className="relative z-10 w-full flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                            <span>Stage {String(activeDesktopSlide + 1).padStart(2, '0')}</span>
                            <AnimatePresence mode="wait">
                                <motion.span
                                    key={currentDesktopFeature.tag}
                                    initial={{ opacity: 0, y: 4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -4 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-neutral-300"
                                >
                                    {currentDesktopFeature.tag}
                                </motion.span>
                            </AnimatePresence>
                        </div>

                        <div className="relative z-10 w-52 h-52 lg:w-64 lg:h-64 flex items-center justify-center">
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

                        <div className="relative z-10 w-full flex items-center justify-between pt-4 border-t border-white/10 text-xs text-neutral-400">
                            <span className="truncate pr-4">{currentDesktopFeature.title}</span>
                            <span className="font-mono text-neutral-500 shrink-0">
                                {String(activeDesktopSlide + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                            </span>
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
                            dragElastic={0.35}
                            onDragEnd={handleDragEnd}
                            className="bg-neutral-950 rounded-[32px] p-8 border border-white/12 cursor-grab active:cursor-grabbing touch-pan-y select-none"
                        >
                            <span className="text-[11px] font-mono tracking-[0.22em] text-neutral-500 uppercase block mb-4">
                                {String(activeSlide + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')} &middot; {features[activeSlide].tag}
                            </span>
                            <h3 className="text-2xl font-medium tracking-[-0.02em] text-white mb-3">
                                {features[activeSlide].title}
                            </h3>
                            <p className="text-sm font-light text-neutral-400 leading-relaxed">
                                {features[activeSlide].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-between mt-5 px-2">
                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide - 1)}
                        aria-label="Previous step"
                        className="p-2.5 rounded-full border border-white/12 text-neutral-300 hover:text-white hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2">
                        {features.map((f, idx) => (
                            <button
                                key={f.title}
                                type="button"
                                onClick={() => goToSlide(idx)}
                                aria-label={`Go to step ${idx + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    idx === activeSlide ? 'w-6 bg-white' : 'w-1.5 bg-white/25'
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={() => goToSlide(activeSlide + 1)}
                        aria-label="Next step"
                        className="p-2.5 rounded-full border border-white/12 text-neutral-300 hover:text-white hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </section>
    )
}
