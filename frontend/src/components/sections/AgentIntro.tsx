import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TextReveal } from '../ui/TextReveal'
import { AnimatedBeam } from '../ui/AnimatedBeam'

export default function AgentIntro() {
    const sectionRef = useRef<HTMLElement>(null)

    // Desktop conduit node refs
    const desktopContainerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)

    // Mobile horizontal conduit node refs
    const mobileContainerRef = useRef<HTMLDivElement>(null)
    const mDiv1Ref = useRef<HTMLDivElement>(null)
    const mDiv2Ref = useRef<HTMLDivElement>(null)
    const mDiv3Ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 0.72', 'end 0.85'],
    })

    const revealProgress = useTransform(scrollYProgress, [0.02, 0.82], [0, 1])
    const ringScale = useTransform(revealProgress, [0, 1], [0.92, 1.08])
    const ringOpacity = useTransform(revealProgress, [0, 0.5, 1], [0.18, 0.45, 0.65])
    const noteOpacity = useTransform(revealProgress, [0.68, 0.96], [0, 1])

    const pathColor = 'rgba(255,255,255,0.22)'
    const gradientStartColor = '#ffffff'
    const gradientStopColor = '#737373'

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white lg:min-h-[165vh]"
        >
            {/* Desktop Semi-Scrolling Sticky 50/50 Split */}
            <div className="hidden lg:flex sticky top-[56px] h-[calc(100svh-56px)] items-center">
                <div className="max-w-6xl w-full mx-auto px-12 grid grid-cols-2 gap-16 items-center">
                    {/* Left: Symmetrical Dual-Side Converging Conduit (Supply -> Elesium <- Demand) */}
                    <div
                        ref={desktopContainerRef}
                        className="relative overflow-hidden flex flex-col items-center justify-between py-14 px-8 w-full rounded-[32px] border border-white/12 bg-neutral-950 min-h-[480px] shadow-[0_0_90px_rgba(255,255,255,0.03)]"
                    >
                        {/* Architectural Monochrome Grid Backdrop */}
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 opacity-35"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 62%), radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)',
                                backgroundSize: '100% 100%, 24px 24px',
                            }}
                        />

                        {/* Top: Supply */}
                        <div className="relative z-10 flex flex-col items-center gap-2.5">
                            <motion.div
                                ref={div1Ref}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-[88px] w-[88px] rounded-full bg-black flex items-center justify-center border border-white/30 shadow-[0_0_32px_rgba(255,255,255,0.06)]"
                            >
                                <span className="text-[11px] font-mono text-white uppercase tracking-[0.2em]">
                                    Supply
                                </span>
                            </motion.div>
                            <span className="text-[11px] text-neutral-500 font-normal">
                                Verified capability
                            </span>
                        </div>

                        {/* Center: Elesium */}
                        <div className="relative z-10 flex items-center justify-center my-4">
                            <motion.div
                                style={{ scale: ringScale, opacity: ringOpacity }}
                                aria-hidden="true"
                                className="pointer-events-none absolute h-44 w-44 rounded-full border border-white/25"
                            />
                            <motion.div
                                ref={div2Ref}
                                whileHover={{ scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-32 w-32 rounded-full bg-white flex items-center justify-center border border-white/60 shadow-[0_0_64px_rgba(255,255,255,0.18)] relative"
                            >
                                <span className="text-sm font-semibold text-black tracking-[0.22em] uppercase">
                                    Elesium
                                </span>
                            </motion.div>
                        </div>

                        {/* Bottom: Demand */}
                        <div className="relative z-10 flex flex-col items-center gap-2.5">
                            <span className="text-[11px] text-neutral-500 font-normal">
                                Active buyers
                            </span>
                            <motion.div
                                ref={div3Ref}
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-[88px] w-[88px] rounded-full bg-black flex items-center justify-center border border-white/30 shadow-[0_0_32px_rgba(255,255,255,0.06)]"
                            >
                                <span className="text-[11px] font-mono text-white uppercase tracking-[0.2em]">
                                    Demand
                                </span>
                            </motion.div>
                        </div>

                        {/* Center-to-center beams cleanly clipped behind z-10 node circles */}
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div1Ref}
                            toRef={div2Ref}
                            duration={2.4}
                            delay={0}
                            pathWidth={2}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            className="z-0"
                        />
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div1Ref}
                            toRef={div2Ref}
                            duration={2.4}
                            delay={1.2}
                            pathWidth={2}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            className="z-0"
                        />

                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div3Ref}
                            toRef={div2Ref}
                            duration={2.4}
                            delay={0}
                            pathWidth={2}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            className="z-0"
                        />
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div3Ref}
                            toRef={div2Ref}
                            duration={2.4}
                            delay={1.2}
                            pathWidth={2}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            className="z-0"
                        />
                    </div>

                    {/* Right: Semi-Scrolling Word-by-Word Narrative */}
                    <div className="flex flex-col items-start text-left">
                        <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-neutral-500 mb-6">
                            How It Works
                        </p>
                        <TextReveal sticky={false} progress={revealProgress}>
                            We don&apos;t rely on passive networks; instead, we actively engineer your pipeline to connect you directly with ready-to-move decision-makers.
                        </TextReveal>
                        <motion.div
                            style={{ opacity: noteOpacity }}
                            className="mt-10 pt-6 border-t border-white/10 w-full flex items-center justify-between text-xs text-neutral-400 font-mono"
                        >
                            <span>Direct introductions</span>
                            <span>Verified context</span>
                            <span>Built to close</span>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Horizontal Architecture */}
            <div className="lg:hidden px-5 sm:px-8 py-20 max-w-2xl mx-auto flex flex-col items-center gap-10">
                <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-neutral-500 text-center">
                    How It Works
                </p>

                <div
                    ref={mobileContainerRef}
                    className="relative overflow-hidden w-full rounded-[28px] border border-white/12 bg-neutral-950 px-5 sm:px-8 py-9 flex items-center justify-between"
                >
                    <div
                        ref={mDiv1Ref}
                        className="relative z-10 h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full bg-black flex items-center justify-center border border-white/30 shrink-0"
                    >
                        <span className="text-[10px] font-mono text-white uppercase tracking-[0.14em]">
                            Supply
                        </span>
                    </div>

                    <div
                        ref={mDiv2Ref}
                        className="relative z-10 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white flex items-center justify-center border border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.16)] shrink-0"
                    >
                        <span className="text-xs sm:text-sm font-semibold text-black tracking-[0.16em] uppercase">
                            Elesium
                        </span>
                    </div>

                    <div
                        ref={mDiv3Ref}
                        className="relative z-10 h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full bg-black flex items-center justify-center border border-white/30 shrink-0"
                    >
                        <span className="text-[10px] font-mono text-white uppercase tracking-[0.14em]">
                            Demand
                        </span>
                    </div>

                    <AnimatedBeam
                        containerRef={mobileContainerRef}
                        fromRef={mDiv1Ref}
                        toRef={mDiv2Ref}
                        duration={2.4}
                        delay={0}
                        pathWidth={2}
                        pathColor={pathColor}
                        gradientStartColor={gradientStartColor}
                        gradientStopColor={gradientStopColor}
                        vertical={false}
                        className="z-0"
                    />
                    <AnimatedBeam
                        containerRef={mobileContainerRef}
                        fromRef={mDiv3Ref}
                        toRef={mDiv2Ref}
                        duration={2.4}
                        delay={1.2}
                        pathWidth={2}
                        pathColor={pathColor}
                        gradientStartColor={gradientStartColor}
                        gradientStopColor={gradientStopColor}
                        vertical={false}
                        className="z-0"
                    />
                </div>

                <div className="w-full text-center">
                    <TextReveal sticky={false}>
                        We don&apos;t rely on passive networks; instead, we actively engineer your pipeline to connect you directly with ready-to-move decision-makers.
                    </TextReveal>
                </div>
            </div>
        </section>
    )
}
