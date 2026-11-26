import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { TextReveal } from '../ui/TextReveal'
import { AnimatedBeam } from '../ui/AnimatedBeam'

export default function AgentIntro() {
    const sectionRef = useRef<HTMLElement>(null)

    // Desktop vertical beam refs
    const desktopContainerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)

    // Mobile horizontal beam refs
    const mobileContainerRef = useRef<HTMLDivElement>(null)
    const mDiv1Ref = useRef<HTMLDivElement>(null)
    const mDiv2Ref = useRef<HTMLDivElement>(null)
    const mDiv3Ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start 0.15', 'end 0.92'],
    })

    const revealProgress = useTransform(scrollYProgress, [0.04, 0.86], [0, 1])

    // Beam Colors - Strictly Monochrome
    const pathColor = 'rgba(255,255,255,0.14)'
    const gradientStartColor = '#ffffff'
    const gradientStopColor = '#737373'

    return (
        <section
            ref={sectionRef}
            className="relative bg-black text-white lg:min-h-[190vh]"
        >
            {/* Desktop Unified Sticky 50/50 Architecture */}
            <div className="hidden lg:flex sticky top-[56px] h-[calc(100vh-56px)] items-center">
                <div className="max-w-6xl w-full mx-auto px-12 grid grid-cols-2 gap-16 items-center">
                    {/* Left: Vertical Monochrome Conduit */}
                    <div
                        ref={desktopContainerRef}
                        className="relative flex flex-col items-center justify-center gap-20 py-10 w-full rounded-[32px] border border-white/[0.08] bg-neutral-950/60 min-h-[460px]"
                    >
                        {/* Node 1: Supply */}
                        <div className="flex flex-col items-center z-10">
                            <motion.div
                                ref={div1Ref}
                                whileHover={{ scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-20 w-20 rounded-full bg-neutral-950 flex items-center justify-center border border-white/20 shadow-[0_0_32px_rgba(255,255,255,0.04)]"
                            >
                                <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-[0.2em]">
                                    Supply
                                </span>
                            </motion.div>
                        </div>

                        {/* Node 2: Elesium */}
                        <div className="flex flex-col items-center z-10">
                            <motion.div
                                ref={div2Ref}
                                whileHover={{ scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-32 w-32 rounded-full bg-white flex items-center justify-center border border-white/40 shadow-[0_0_56px_rgba(255,255,255,0.14)] relative"
                            >
                                <span className="text-sm font-semibold text-black tracking-[0.2em] uppercase">
                                    Elesium
                                </span>
                            </motion.div>
                        </div>

                        {/* Node 3: Demand */}
                        <div className="flex flex-col items-center z-10">
                            <motion.div
                                ref={div3Ref}
                                whileHover={{ scale: 1.04 }}
                                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                                className="h-20 w-20 rounded-full bg-neutral-950 flex items-center justify-center border border-white/20 shadow-[0_0_32px_rgba(255,255,255,0.04)]"
                            >
                                <span className="text-[11px] font-mono text-neutral-200 uppercase tracking-[0.2em]">
                                    Demand
                                </span>
                            </motion.div>
                        </div>

                        {/* Supply -> Elesium */}
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div1Ref}
                            toRef={div2Ref}
                            duration={3.8}
                            delay={0}
                            pathWidth={2.5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            startYOffset={40}
                            endYOffset={-64}
                            className="z-0"
                        />
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div1Ref}
                            toRef={div2Ref}
                            duration={3.8}
                            delay={1.9}
                            pathWidth={2.5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            startYOffset={40}
                            endYOffset={-64}
                            className="z-0"
                        />

                        {/* Demand -> Elesium */}
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div3Ref}
                            toRef={div2Ref}
                            duration={3.8}
                            delay={0}
                            pathWidth={2.5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            startYOffset={-40}
                            endYOffset={64}
                            className="z-0"
                        />
                        <AnimatedBeam
                            containerRef={desktopContainerRef}
                            fromRef={div3Ref}
                            toRef={div2Ref}
                            duration={3.8}
                            delay={1.9}
                            pathWidth={2.5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            startYOffset={-40}
                            endYOffset={64}
                            className="z-0"
                        />
                    </div>

                    {/* Right: Locked Spring-Smoothed Narrative */}
                    <div className="flex flex-col items-start text-left">
                        <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-6">
                            Active Pipeline Architecture
                        </p>
                        <TextReveal sticky={false} progress={revealProgress}>
                            We don&apos;t rely on passive networks; instead, we actively engineer your pipeline to connect you directly with ready-to-move decision-makers.
                        </TextReveal>
                    </div>
                </div>
            </div>

            {/* Mobile & Tablet Balanced Horizontal Architecture */}
            <div className="lg:hidden px-5 sm:px-8 py-20 max-w-2xl mx-auto flex flex-col items-center gap-12">
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 text-center">
                    Active Pipeline Architecture
                </p>

                <div
                    ref={mobileContainerRef}
                    className="relative w-full rounded-[32px] border border-white/[0.08] bg-neutral-950/60 px-5 sm:px-8 py-8 flex items-center justify-between"
                >
                    {/* Mobile Node 1: Supply */}
                    <div
                        ref={mDiv1Ref}
                        className="relative z-10 h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full bg-neutral-950 flex items-center justify-center border border-white/20 shrink-0"
                    >
                        <span className="text-[10px] font-mono text-neutral-200 uppercase tracking-[0.14em]">
                            Supply
                        </span>
                    </div>

                    {/* Mobile Node 2: Elesium */}
                    <div
                        ref={mDiv2Ref}
                        className="relative z-10 h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-white flex items-center justify-center border border-white/40 shadow-[0_0_40px_rgba(255,255,255,0.12)] shrink-0"
                    >
                        <span className="text-xs sm:text-sm font-semibold text-black tracking-[0.16em] uppercase">
                            Elesium
                        </span>
                    </div>

                    {/* Mobile Node 3: Demand */}
                    <div
                        ref={mDiv3Ref}
                        className="relative z-10 h-16 w-16 sm:h-[72px] sm:w-[72px] rounded-full bg-neutral-950 flex items-center justify-center border border-white/20 shrink-0"
                    >
                        <span className="text-[10px] font-mono text-neutral-200 uppercase tracking-[0.14em]">
                            Demand
                        </span>
                    </div>

                    {/* Horizontal Beams converging into Elesium */}
                    <AnimatedBeam
                        containerRef={mobileContainerRef}
                        fromRef={mDiv1Ref}
                        toRef={mDiv2Ref}
                        duration={3.6}
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
                        duration={3.6}
                        delay={1.8}
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
