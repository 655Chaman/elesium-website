import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
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
    const navigate = useNavigate()
    const prefersReducedMotion = useReducedMotion()
    const [hovered, setHovered] = useState<'connector' | 'ai' | null>(null)
    const [medallionHovered, setMedallionHovered] = useState(false)
    const [isZoomingToPortfolio, setIsZoomingToPortfolio] = useState(false)
    const [isMobileOrTouch, setIsMobileOrTouch] = useState(false)
    const mainRef = useRef<HTMLElement>(null)
    const navigatedRef = useRef(false)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const mobileMq = window.matchMedia('(max-width: 767px)')
        const coarseMq = window.matchMedia('(pointer: coarse)')
        const update = () => {
            setIsMobileOrTouch(mobileMq.matches || coarseMq.matches)
        }
        update()
        mobileMq.addEventListener?.('change', update)
        coarseMq.addEventListener?.('change', update)
        return () => {
            mobileMq.removeEventListener?.('change', update)
            coarseMq.removeEventListener?.('change', update)
        }
    }, [])

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
        if (!mainRef.current || isZoomingToPortfolio || prefersReducedMotion) return
        const rect = mainRef.current.getBoundingClientRect()
        dividerPos.set(e.clientY - rect.top - 96)
        dividerX.set(e.clientX - rect.left - 96)
    }

    const handleHalfMove = (side: 'connector' | 'ai', e: React.PointerEvent<HTMLAnchorElement>) => {
        if (isZoomingToPortfolio || prefersReducedMotion) return
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

    const triggerLogoZoom = () => {
        if (isZoomingToPortfolio) return
        setHovered(null)
        setMedallionHovered(false)
        setIsZoomingToPortfolio(true)
    }

    const completePortfolioNavigation = () => {
        if (navigatedRef.current) return
        navigatedRef.current = true
        navigate('/portfolio/')
    }

    return (
        <main
            ref={mainRef}
            onPointerMove={handleRootPointerMove}
            className="relative h-[100dvh] w-full overflow-hidden bg-black text-white select-none font-sans"
        >
            <Helmet>
                <title>Elesium | Enterprise AI Systems &amp; B2B Deal Connector</title>
                <meta
                    name="description"
                    content="Elesium is a remote-first engineering practice based in Shivamogga, Karnataka serving Bengaluru, India, and global clients across two divisions: the Elesium Connector Model for enterprise B2B deal origination and Elesium AI & Automation Systems for sovereign private-VPC multi-agent engineering."
                />
                <link rel="canonical" href="https://elesium.online/" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            </Helmet>

            <h1 className="pointer-events-none absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-30 whitespace-nowrap text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.26em] text-white/55">
                Elesium &middot; Enterprise AI &amp; Connector
            </h1>

            <div className="grid h-full w-full grid-cols-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
                {/* LEFT / TOP: Elesium Connector Model */}
                <motion.div
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
                    animate={isZoomingToPortfolio ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
                    transition={
                        isZoomingToPortfolio
                            ? { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                            : entrySpring
                    }
                    className={`relative h-full w-full overflow-hidden ${isZoomingToPortfolio ? 'pointer-events-none' : ''}`}
                >
                    {!prefersReducedMotion && (
                        <ConnectorFieldCanvas
                            isFocused={hovered === 'connector'}
                            isDimmed={hovered === 'ai'}
                        />
                    )}

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
                            style={prefersReducedMotion ? undefined : { x: leftX, y: leftY }}
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
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.97 }}
                    animate={isZoomingToPortfolio ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
                    transition={
                        isZoomingToPortfolio
                            ? { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                            : entrySpring
                    }
                    className={`relative h-full w-full overflow-hidden ${isZoomingToPortfolio ? 'pointer-events-none' : ''}`}
                >
                    {!prefersReducedMotion && (
                        <AiLatticeCanvas
                            isFocused={hovered === 'ai'}
                            isDimmed={hovered === 'connector'}
                        />
                    )}

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
                            style={prefersReducedMotion ? undefined : { x: rightX, y: rightY }}
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
            <motion.div
                aria-hidden="true"
                animate={isZoomingToPortfolio ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="pointer-events-none hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-white/[0.06] via-white/20 to-white/[0.06] z-20 overflow-hidden"
            >
                <motion.div
                    style={{ y: smoothDividerY }}
                    className="h-48 w-px bg-gradient-to-b from-transparent via-white/80 to-transparent"
                />
            </motion.div>

            {/* Center Horizontal Hairline + Specular Trace (Mobile) */}
            <motion.div
                aria-hidden="true"
                animate={isZoomingToPortfolio ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                className="pointer-events-none block md:hidden absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-white/[0.06] via-white/20 to-white/[0.06] z-20 overflow-hidden"
            >
                <motion.div
                    style={{ x: smoothDividerX }}
                    className="w-48 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
                />
            </motion.div>

            {/* Centered Live Liquid-Chrome Brand Medallion -> Founder Portfolio */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                <motion.button
                    type="button"
                    onClick={triggerLogoZoom}
                    disabled={isZoomingToPortfolio}
                    aria-label="Open Founder Portfolio"
                    onPointerEnter={() => setMedallionHovered(true)}
                    onPointerLeave={() => setMedallionHovered(false)}
                    onFocus={() => setMedallionHovered(true)}
                    onBlur={() => setMedallionHovered(false)}
                    whileHover={prefersReducedMotion ? undefined : { scale: 1.06 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
                    animate={isZoomingToPortfolio ? { opacity: 0 } : { opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 360, damping: 28, mass: 0.7 }}
                    className="group relative flex h-24 w-24 sm:h-28 sm:w-28 cursor-pointer items-center justify-center rounded-full bg-black border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.95)] transition-colors duration-300 hover:border-white/35 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-1.5 rounded-full border border-white/[0.07] transition-colors duration-300 group-hover:border-white/20"
                    />
                    <div aria-hidden="true" className="pointer-events-none h-12 w-12 sm:h-14 sm:w-14">
                        {prefersReducedMotion ? (
                            <img
                                src={emblem}
                                alt="Elesium"
                                className="h-full w-full object-contain"
                            />
                        ) : (
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
                                resolution={isMobileOrTouch ? 192 : 384}
                            />
                        )}
                    </div>
                </motion.button>

                {!isZoomingToPortfolio && (
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-full mt-2.5 whitespace-nowrap rounded-full border border-white/15 bg-black/80 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-[0.24em] text-white/75 backdrop-blur-sm transition-all duration-200 ${
                            medallionHovered
                                ? 'opacity-100 translate-y-0'
                                : 'opacity-100 translate-y-0 md:opacity-0 md:-translate-y-1'
                        }`}
                    >
                        Portfolio
                    </span>
                )}
            </div>

            {/* Netflix-Style Logo Zoom-Out Transition Overlay */}
            <AnimatePresence>
                {isZoomingToPortfolio && (
                    <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center pointer-events-none overflow-hidden"
                    >
                        {prefersReducedMotion ? (
                            <motion.img
                                src={emblem}
                                alt=""
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                onAnimationComplete={completePortfolioNavigation}
                                className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                            />
                        ) : (
                            <motion.img
                                src={emblem}
                                alt=""
                                initial={{ scale: 1, opacity: 1 }}
                                animate={{ scale: 28, opacity: [1, 1, 0] }}
                                transition={{
                                    duration: 0.72,
                                    ease: [0.65, 0, 0.35, 1],
                                    times: [0, 0.62, 1],
                                }}
                                onAnimationComplete={completePortfolioNavigation}
                                className="h-12 w-12 sm:h-14 sm:w-14 object-contain will-change-transform"
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    )
}
