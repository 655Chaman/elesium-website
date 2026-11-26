import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import emblem from '../../assets/LOGO_EMBLEM.png'
import MetallicPaint from '../ui/MetallicPaint'
import { ConnectorFieldCanvas, AiLatticeCanvas } from '../ui/GatewayCanvases'

const entrySpring = {
    type: 'spring' as const,
    stiffness: 320,
    damping: 30,
    mass: 0.8,
}

const titleSpring = {
    stiffness: 240,
    damping: 26,
    mass: 0.6,
}

export default function Gateway() {
    const [hovered, setHovered] = useState<'connector' | 'ai' | null>(null)
    const mainRef = useRef<HTMLElement>(null)

    // Smooth cursor tracking along center divider axis (transform-only GPU motion)
    const dividerPos = useMotionValue(0)
    const smoothDividerY = useSpring(dividerPos, { stiffness: 200, damping: 28, mass: 0.5 })
    const dividerX = useMotionValue(0)
    const smoothDividerX = useSpring(dividerX, { stiffness: 200, damping: 28, mass: 0.5 })

    // Magnetic typography offsets for Left half
    const leftRawX = useMotionValue(0)
    const leftRawY = useMotionValue(0)
    const leftX = useSpring(leftRawX, titleSpring)
    const leftY = useSpring(leftRawY, titleSpring)

    // Magnetic typography offsets for Right half
    const rightRawX = useMotionValue(0)
    const rightRawY = useMotionValue(0)
    const rightX = useSpring(rightRawX, titleSpring)
    const rightY = useSpring(rightRawY, titleSpring)

    const handleRootPointerMove = (e: React.PointerEvent<HTMLElement>) => {
        if (!mainRef.current) return
        const rect = mainRef.current.getBoundingClientRect()
        dividerPos.set(e.clientY - rect.top - 96)
        dividerX.set(e.clientX - rect.left - 96)
    }

    const handleHalfMove = (side: 'connector' | 'ai', e: React.PointerEvent<HTMLAnchorElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const nx = (e.clientX - rect.left) / rect.width - 0.5
        const ny = (e.clientY - rect.top) / rect.height - 0.5
        if (side === 'connector') {
            leftRawX.set(nx * 14)
            leftRawY.set(ny * 10)
        } else {
            rightRawX.set(nx * 14)
            rightRawY.set(ny * 10)
        }
    }

    const resetHalf = (side: 'connector' | 'ai') => {
        setHovered(null)
        if (side === 'connector') {
            leftRawX.set(0)
            leftRawY.set(0)
        } else {
            rightRawX.set(0)
            rightRawY.set(0)
        }
    }

    return (
        <main
            ref={mainRef}
            onPointerMove={handleRootPointerMove}
            className="relative h-[100dvh] w-full overflow-hidden bg-black text-white select-none font-sans"
        >
            <Helmet>
                <title>Elesium</title>
                <meta
                    name="description"
                    content="Elesium Connector Model and AI & Automation Elesium."
                />
                <link rel="canonical" href="https://elesium.online/" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            </Helmet>

            <div className="grid h-full w-full grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                {/* LEFT / TOP: Elesium Connector Model */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={entrySpring}
                    className="relative h-full w-full overflow-hidden"
                >
                    <ConnectorFieldCanvas
                        isFocused={hovered === 'connector'}
                        isDimmed={hovered === 'ai'}
                    />

                    <Link
                        to="/connector/"
                        onPointerEnter={() => setHovered('connector')}
                        onPointerMove={(e) => handleHalfMove('connector', e)}
                        onPointerLeave={() => resetHalf('connector')}
                        className={`group relative z-10 flex h-full w-full flex-col items-center justify-center px-8 transition-opacity duration-500 ease-out active:scale-[0.97] focus:outline-none focus-visible:bg-white/[0.03] ${
                            hovered === 'ai' ? 'opacity-35' : 'opacity-100'
                        }`}
                    >
                        <motion.div
                            style={{ x: leftX, y: leftY }}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="text-xl sm:text-2xl md:text-[28px] lg:text-[34px] font-light tracking-[-0.025em] text-white/85 transition-all duration-500 ease-out group-hover:text-white group-hover:tracking-[-0.01em]">
                                Elesium Connector Model
                            </span>

                            {/* Expanding monochrome hairline */}
                            <span
                                aria-hidden="true"
                                className="mt-4 h-px w-10 bg-white/25 transition-all duration-500 ease-out group-hover:w-28 group-hover:bg-white/80"
                            />
                        </motion.div>
                    </Link>
                </motion.div>

                {/* RIGHT / BOTTOM: AI & Automation Elesium */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={entrySpring}
                    className="relative h-full w-full overflow-hidden"
                >
                    <AiLatticeCanvas
                        isFocused={hovered === 'ai'}
                        isDimmed={hovered === 'connector'}
                    />

                    <Link
                        to="/ai/"
                        onPointerEnter={() => setHovered('ai')}
                        onPointerMove={(e) => handleHalfMove('ai', e)}
                        onPointerLeave={() => resetHalf('ai')}
                        className={`group relative z-10 flex h-full w-full flex-col items-center justify-center px-8 transition-opacity duration-500 ease-out active:scale-[0.97] focus:outline-none focus-visible:bg-white/[0.03] ${
                            hovered === 'connector' ? 'opacity-35' : 'opacity-100'
                        }`}
                    >
                        <motion.div
                            style={{ x: rightX, y: rightY }}
                            className="flex flex-col items-center text-center"
                        >
                            <span className="text-xl sm:text-2xl md:text-[28px] lg:text-[34px] font-light tracking-[-0.025em] text-white/85 transition-all duration-500 ease-out group-hover:text-white group-hover:tracking-[-0.01em]">
                                AI &amp; Automation Elesium
                            </span>

                            {/* Expanding monochrome hairline */}
                            <span
                                aria-hidden="true"
                                className="mt-4 h-px w-10 bg-white/25 transition-all duration-500 ease-out group-hover:w-28 group-hover:bg-white/80"
                            />
                        </motion.div>
                    </Link>
                </motion.div>
            </div>

            {/* Center Vertical Hairline + Specular Trace (Desktop) */}
            <div
                aria-hidden="true"
                className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-white/[0.06] via-white/20 to-white/[0.06] z-20 overflow-hidden"
            >
                <motion.div
                    style={{ y: smoothDividerY }}
                    className="h-48 w-px bg-gradient-to-b from-transparent via-white/80 to-transparent"
                />
            </div>

            {/* Center Horizontal Hairline + Specular Trace (Mobile) */}
            <div
                aria-hidden="true"
                className="pointer-events-none block md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-white/[0.06] via-white/20 to-white/[0.06] z-20 overflow-hidden"
            >
                <motion.div
                    style={{ x: smoothDividerX }}
                    className="w-48 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
            </div>

            {/* Centered Live Liquid-Chrome Brand Medallion */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center"
            >
                {/* Outer precision hairline orbit */}
                <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full bg-black border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.95)]">
                    <div className="absolute inset-1.5 rounded-full border border-white/[0.07]" />
                    <div className="h-12 w-12 sm:h-14 sm:w-14">
                        <MetallicPaint
                            imageSrc={emblem}
                            alt="Elesium"
                            scale={2.4}
                            speed={0.42}
                            brightness={2.2}
                            contrast={0.55}
                            lightColor="#ffffff"
                            darkColor="#343438"
                            tintColor="#ffffff"
                            chromaticSpread={0}
                            liquid={0.75}
                            distortion={1.15}
                            resolution={384}
                        />
                    </div>
                </div>
            </div>
        </main>
    )
}
