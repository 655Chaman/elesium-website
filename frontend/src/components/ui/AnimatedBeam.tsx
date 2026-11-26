"use client"

import React, { RefObject, useEffect, useId, useState } from "react"
import { motion } from "framer-motion"

import { cn } from "../../lib/utils"

export interface AnimatedBeamProps {
    className?: string
    containerRef: RefObject<HTMLElement | null>
    fromRef: RefObject<HTMLElement | null>
    toRef: RefObject<HTMLElement | null>
    curvature?: number
    reverse?: boolean
    pathColor?: string
    pathWidth?: number
    pathOpacity?: number
    gradientStartColor?: string
    gradientStopColor?: string
    delay?: number
    duration?: number
    startXOffset?: number
    startYOffset?: number
    endXOffset?: number
    endYOffset?: number
    vertical?: boolean
}

interface BeamCoords {
    startX: number
    startY: number
    endX: number
    endY: number
    width: number
    height: number
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = 2.8,
    delay = 0,
    pathColor = "rgba(255, 255, 255, 0.22)",
    pathWidth = 2,
    pathOpacity = 1,
    gradientStartColor = "#ffffff",
    gradientStopColor = "#a3a3a3",
    startXOffset = 0,
    startYOffset = 0,
    endXOffset = 0,
    endYOffset = 0,
    vertical = false,
}) => {
    const id = useId()
    const svgRef = React.useRef<SVGSVGElement>(null)
    const [pathD, setPathD] = useState("")
    const [coords, setCoords] = useState<BeamCoords | null>(null)

    useEffect(() => {
        const updatePath = () => {
            if (containerRef.current && fromRef.current && toRef.current && svgRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const rectA = fromRef.current.getBoundingClientRect()
                const rectB = toRef.current.getBoundingClientRect()

                if (containerRect.width === 0 || containerRect.height === 0) return

                const startX = rectA.left - containerRect.left + rectA.width / 2 + startXOffset
                const startY = rectA.top - containerRect.top + rectA.height / 2 + startYOffset
                const endX = rectB.left - containerRect.left + rectB.width / 2 + endXOffset
                const endY = rectB.top - containerRect.top + rectB.height / 2 + endYOffset

                if (Math.abs(startX - endX) < 1 && Math.abs(startY - endY) < 1) {
                    setPathD("")
                    setCoords(null)
                    return
                }

                const ax = reverse ? endX : startX
                const ay = reverse ? endY : startY
                const bx = reverse ? startX : endX
                const by = reverse ? startY : endY

                if (vertical) {
                    const controlX = (ax + bx) / 2 - curvature
                    const controlY = (ay + by) / 2
                    setPathD(`M ${ax.toFixed(1)},${ay.toFixed(1)} Q ${controlX.toFixed(1)},${controlY.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`)
                } else {
                    const controlX = (ax + bx) / 2
                    const controlY = (ay + by) / 2 - curvature
                    setPathD(`M ${ax.toFixed(1)},${ay.toFixed(1)} Q ${controlX.toFixed(1)},${controlY.toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`)
                }

                setCoords({
                    startX: ax,
                    startY: ay,
                    endX: bx,
                    endY: by,
                    width: containerRect.width,
                    height: containerRect.height,
                })
            }
        }

        const resizeObserver = new ResizeObserver(() => {
            requestAnimationFrame(updatePath)
        })

        if (containerRef.current) resizeObserver.observe(containerRef.current)
        if (fromRef.current) resizeObserver.observe(fromRef.current)
        if (toRef.current) resizeObserver.observe(toRef.current)

        window.addEventListener("resize", updatePath)
        const rafId = requestAnimationFrame(updatePath)
        const settleA = setTimeout(updatePath, 120)
        const settleB = setTimeout(updatePath, 420)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("resize", updatePath)
            cancelAnimationFrame(rafId)
            clearTimeout(settleA)
            clearTimeout(settleB)
        }
    }, [
        containerRef,
        fromRef,
        toRef,
        curvature,
        reverse,
        startXOffset,
        startYOffset,
        endXOffset,
        endYOffset,
        vertical,
    ])

    // Total straight-line span for reliable cross-browser dash-pulse animation
    const pathLen = coords
        ? Math.max(40, Math.hypot(coords.endX - coords.startX, coords.endY - coords.startY))
        : 120
    const pulseLen = Math.max(24, Math.min(54, pathLen * 0.34))

    return (
        <svg
            ref={svgRef}
            fill="none"
            width="100%"
            height="100%"
            viewBox={coords ? `0 0 ${coords.width} ${coords.height}` : undefined}
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "pointer-events-none absolute inset-0 transform-gpu",
                className
            )}
        >
            <defs>
                <linearGradient
                    id={id}
                    x1={vertical ? "0%" : "0%"}
                    y1={vertical ? "0%" : "0%"}
                    x2={vertical ? "0.5%" : "100%"}
                    y2={vertical ? "100%" : "0.5%"}
                >
                    <stop offset="0%" stopColor={gradientStopColor} stopOpacity="0.25" />
                    <stop offset="50%" stopColor={gradientStartColor} stopOpacity="0.9" />
                    <stop offset="100%" stopColor={gradientStartColor} stopOpacity="1" />
                </linearGradient>
            </defs>

            {pathD && coords && (
                <>
                    {/* Crisp continuous structural rail */}
                    <path
                        d={pathD}
                        stroke={pathColor}
                        strokeWidth={pathWidth}
                        strokeOpacity={pathOpacity}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Soft ambient glow rail */}
                    <path
                        d={pathD}
                        stroke={`url(#${id})`}
                        strokeWidth={pathWidth * 2.4}
                        strokeOpacity="0.16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Continuous synchronized dash-pulse flowing smoothly from start to end */}
                    <motion.path
                        d={pathD}
                        stroke="#ffffff"
                        strokeWidth={pathWidth}
                        strokeOpacity="0.95"
                        strokeLinecap="round"
                        strokeDasharray={`${pulseLen} ${pathLen + pulseLen}`}
                        initial={{ strokeDashoffset: pulseLen }}
                        animate={{ strokeDashoffset: -(pathLen) }}
                        transition={{
                            delay,
                            duration,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    />

                    {/* Subtle soft halo under the active pulse */}
                    <motion.path
                        d={pathD}
                        stroke="#ffffff"
                        strokeWidth={pathWidth * 3}
                        strokeOpacity="0.24"
                        strokeLinecap="round"
                        strokeDasharray={`${pulseLen} ${pathLen + pulseLen}`}
                        initial={{ strokeDashoffset: pulseLen }}
                        animate={{ strokeDashoffset: -(pathLen) }}
                        transition={{
                            delay,
                            duration,
                            ease: "linear",
                            repeat: Infinity,
                        }}
                    />
                </>
            )}
        </svg>
    )
}
