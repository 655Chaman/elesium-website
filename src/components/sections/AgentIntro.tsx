import { useRef } from 'react'
import { TextReveal } from '../ui/TextReveal'
import { AnimatedBeam } from '../ui/AnimatedBeam'

export default function AgentIntro() {
    const ref = useRef(null)

    // Beam Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const div1Ref = useRef<HTMLDivElement>(null)
    const div2Ref = useRef<HTMLDivElement>(null)
    const div3Ref = useRef<HTMLDivElement>(null)

    // Beam Colors
    const pathColor = "rgba(100, 100, 100, 0.2)"
    const gradientStartColor = "#4F46E5" // Indigo
    const gradientStopColor = "#EC4899" // Pink

    return (
        <section
            ref={ref}
            style={{
                minHeight: 'auto',
            }}
            className="relative bg-white dark:bg-black transition-colors duration-300 min-h-[150vh] lg:min-h-[300vh] py-0"
        >
            <div
                className="max-w-7xl mx-auto px-4 md:px-12 flex flex-col lg:flex-row-reverse gap-16 relative"
            >
                {/* Text Content - naturally scrolling */}
                <div className="w-full lg:w-1/2 text-center lg:text-left py-24 lg:py-[50vh] relative z-20">
                    <TextReveal className="lg:min-h-screen flex items-center justify-center lg:justify-start">
                        We connect Supply to Demand, and Demand to Supply, helping you find the right partners faster — with context, qualification, and trust built in.
                    </TextReveal>
                </div>

                {/* Animated Beam - Sticky */}
                {/* valid 'track' for sticky is the parent flex item which must be tall */}
                <div className="hidden lg:flex w-full lg:w-1/2 relative min-h-full">
                    <div className="sticky top-0 h-screen flex flex-col items-center justify-center gap-24 py-12 w-full relative" ref={containerRef}>
                        {/* Node 1: Supply */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div ref={div1Ref} className="h-20 w-20 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center border-2 border-neutral-200 dark:border-white shadow-lg hover:scale-105 transition-transform duration-300">
                                <span className="text-base font-semibold text-gray-600 dark:text-white">Supply</span>
                            </div>
                        </div>

                        {/* Node 2: Elesium */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div ref={div2Ref} className="h-32 w-32 rounded-full bg-black dark:bg-white flex items-center justify-center border-4 border-white dark:border-black shadow-2xl hover:scale-110 transition-transform duration-300 relative">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent to-white/10 dark:to-black/5" />
                                <span className="text-xl font-bold text-white dark:text-black tracking-tight uppercase">Elesium</span>
                            </div>
                        </div>

                        {/* Node 3: Demand */}
                        <div className="flex flex-col items-center gap-2 z-10">
                            <div ref={div3Ref} className="h-20 w-20 rounded-full bg-white dark:bg-neutral-900 flex items-center justify-center border-2 border-neutral-200 dark:border-white shadow-lg hover:scale-105 transition-transform duration-300">
                                <span className="text-base font-semibold text-gray-600 dark:text-white">Demand</span>
                            </div>
                        </div>

                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={div1Ref}
                            toRef={div2Ref}
                            duration={5}
                            pathWidth={5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            startYOffset={40}
                            endYOffset={-64}
                            className="z-0"
                        />
                        <AnimatedBeam
                            containerRef={containerRef}
                            fromRef={div3Ref}
                            toRef={div2Ref}
                            duration={5}
                            pathWidth={5}
                            pathColor={pathColor}
                            gradientStartColor={gradientStartColor}
                            gradientStopColor={gradientStopColor}
                            vertical={true}
                            reverse={true}
                            startYOffset={-40}
                            endYOffset={64}
                            className="z-0"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}
