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
}

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false,
    duration = 4,
    delay = 0,
    pathColor = "rgba(255, 255, 255, 0.14)",
    pathWidth = 2,
    pathOpacity = 1,
    gradientStartColor = "#ffffff",
    gradientStopColor = "#737373",
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
                const svgRect = svgRef.current.getBoundingClientRect()
                const rectA = fromRef.current.getBoundingClientRect()
                const rectB = toRef.current.getBoundingClientRect()

                if (svgRect.width === 0 || svgRect.height === 0) return

                const startX = rectA.left - svgRect.left + rectA.width / 2 + startXOffset
                const startY = rectA.top - svgRect.top + rectA.height / 2 + startYOffset
                const endX = rectB.left - svgRect.left + rectB.width / 2 + endXOffset
                const endY = rectB.top - svgRect.top + rectB.height / 2 + endYOffset

                // Hide beam if start and end points collapse onto the same point
                if (Math.abs(startX - endX) < 1 && Math.abs(startY - endY) < 1) {
                    setPathD("")
                    setCoords(null)
                    return
                }

                if (vertical) {
                    const controlX = (startX + endX) / 2 - curvature
                    const controlY = (startY + endY) / 2
                    setPathD(`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`)
                } else {
                    const controlX = (startX + endX) / 2
                    const controlY = (startY + endY) / 2 - curvature
                    setPathD(`M ${startX},${startY} Q ${controlX},${controlY} ${endX},${endY}`)
                }

                setCoords({ startX, startY, endX, endY })
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
        const settleTimeoutId = setTimeout(updatePath, 180)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("resize", updatePath)
            cancelAnimationFrame(rafId)
            clearTimeout(settleTimeoutId)
        }
    }, [
        containerRef,
        fromRef,
        toRef,
        curvature,
        startXOffset,
        startYOffset,
        endXOffset,
        endYOffset,
        vertical,
    ])

    const gradientAnimation = coords
        ? (() => {
              const ax = reverse ? coords.endX : coords.startX
              const ay = reverse ? coords.endY : coords.startY
              const bx = reverse ? coords.startX : coords.endX
              const by = reverse ? coords.startY : coords.endY
              const dx = bx - ax
              const dy = by - ay
              const pulseSpan = 0.44

              return {
                  initial: {
                      x1: ax - dx * pulseSpan,
                      y1: ay - dy * pulseSpan,
                      x2: ax,
                      y2: ay,
                  },
                  animate: {
                      x1: [ax - dx * pulseSpan, bx],
                      y1: [ay - dy * pulseSpan, by],
                      x2: [ax, bx + dx * pulseSpan],
                      y2: [ay, by + dy * pulseSpan],
                  },
              }
          })()
        : null

    return (
        <svg
            ref={svgRef}
            fill="none"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "pointer-events-none absolute top-0 left-0 transform-gpu",
                className
            )}
        >
            {pathD && (
                <>
                    <path
                        d={pathD}
                        stroke={pathColor}
                        strokeWidth={pathWidth}
                        strokeOpacity={pathOpacity}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={pathD}
                        strokeWidth={pathWidth * 2.2}
                        stroke={`url(#${id})`}
                        strokeOpacity="0.22"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d={pathD}
                        strokeWidth={pathWidth}
                        stroke={`url(#${id})`}
                        strokeOpacity="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </>
            )}
            <defs>
                {gradientAnimation && (
                    <motion.linearGradient
                        className="transform-gpu"
                        id={id}
                        gradientUnits="userSpaceOnUse"
                        initial={gradientAnimation.initial}
                        animate={gradientAnimation.animate}
                        transition={{
                            delay,
                            duration,
                            ease: [0.37, 0, 0.63, 1],
                            repeat: Infinity,
                            repeatDelay: 0.15,
                        }}
                    >
                        <stop offset="0%" stopColor={gradientStartColor} stopOpacity="0" />
                        <stop offset="35%" stopColor={gradientStartColor} stopOpacity="0.95" />
                        <stop offset="68%" stopColor={gradientStopColor} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={gradientStopColor} stopOpacity="0" />
                    </motion.linearGradient>
                )}
            </defs>
        </svg>
    )
}
