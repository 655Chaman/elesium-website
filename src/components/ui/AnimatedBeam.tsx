"use client"

import React, { RefObject, useEffect, useId, useState } from "react"
import { motion } from "framer-motion"

import { cn } from "../../lib/utils"

export interface AnimatedBeamProps {
    className?: string
    containerRef: RefObject<HTMLElement | null> // Container ref
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

export const AnimatedBeam: React.FC<AnimatedBeamProps> = ({
    className,
    containerRef,
    fromRef,
    toRef,
    curvature = 0,
    reverse = false, // Include the reverse prop
    duration = Math.random() * 3 + 4,
    delay = 0,
    pathColor = "gray",
    pathWidth = 2,
    pathOpacity = 0.2,
    gradientStartColor = "#ffaa40",
    gradientStopColor = "#9c40ff",
    startXOffset = 0,
    startYOffset = 0,
    endXOffset = 0,
    endYOffset = 0,
    vertical = false,
}) => {
    const id = useId()
    const svgRef = React.useRef<SVGSVGElement>(null)
    const [pathD, setPathD] = useState("")
    const [_svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 })

    // Calculate the gradient coordinates based on the reverse prop
    const gradientCoordinates = vertical
        ? reverse
            ? {
                x1: ["0%", "0%"],
                x2: ["0%", "0%"],
                y1: ["90%", "-10%"],
                y2: ["100%", "0%"],
            }
            : {
                x1: ["0%", "0%"],
                x2: ["0%", "0%"],
                y1: ["10%", "110%"],
                y2: ["0%", "100%"],
            }
        : reverse
            ? {
                x1: ["90%", "-10%"],
                x2: ["100%", "0%"],
                y1: ["0%", "0%"],
                y2: ["0%", "0%"],
            }
            : {
                x1: ["10%", "110%"],
                x2: ["0%", "100%"],
                y1: ["0%", "0%"],
                y2: ["0%", "0%"],
            }

    useEffect(() => {
        const updatePath = () => {
            if (containerRef.current && fromRef.current && toRef.current && svgRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const svgRect = svgRef.current.getBoundingClientRect()
                const rectA = fromRef.current.getBoundingClientRect()
                const rectB = toRef.current.getBoundingClientRect()

                const svgWidth = containerRect.width
                const svgHeight = containerRect.height
                setSvgDimensions({ width: svgWidth, height: svgHeight })

                const startX =
                    rectA.left - svgRect.left + rectA.width / 2 + startXOffset
                const startY =
                    rectA.top - svgRect.top + rectA.height / 2 + startYOffset
                const endX =
                    rectB.left - svgRect.left + rectB.width / 2 + endXOffset
                const endY =
                    rectB.top - svgRect.top + rectB.height / 2 + endYOffset

                if (vertical) {
                    const controlX = startX - curvature
                    const d = `M ${startX},${startY} Q ${controlX},${(startY + endY) / 2
                        } ${endX},${endY}`
                    setPathD(d)
                } else {
                    const controlY = startY - curvature
                    const d = `M ${startX},${startY} Q ${(startX + endX) / 2
                        },${controlY} ${endX},${endY}`
                    setPathD(d)
                }

                // Hide beam if start and end points are too close (prevents dots)
                if (Math.abs(startX - endX) < 1 && Math.abs(startY - endY) < 1) {
                    setPathD("")
                }
            }
        }

        // Initialize ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
            updatePath()
        })

        // Observe the container element
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }
        if (fromRef.current) {
            resizeObserver.observe(fromRef.current)
        }
        if (toRef.current) {
            resizeObserver.observe(toRef.current)
        }

        // Force update on window resize (fixes Flexbox/Grid shifts)
        window.addEventListener("resize", updatePath)

        // Force update after mount to catch hydration shifts
        const timeoutId = setTimeout(updatePath, 100)

        // Poll for layout changes (fixes issues where elements move but don't resize)
        const intervalId = setInterval(updatePath, 100)
        setTimeout(() => clearInterval(intervalId), 3000)

        // Initial update
        updatePath()

        // Clean up the observer on component unmount
        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("resize", updatePath)
            clearTimeout(timeoutId)
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
    ])

    return (
        <svg
            ref={svgRef}
            fill="none"
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
                "pointer-events-none absolute top-0 left-0 transform-gpu stroke-2",
                className
            )}
        >
            <path
                d={pathD}
                stroke={pathColor}
                strokeWidth={pathWidth}
                strokeOpacity={pathOpacity}
                strokeLinecap="round"
            />
            <path
                d={pathD}
                strokeWidth={pathWidth}
                stroke={`url(#${id})`}
                strokeOpacity="1"
                strokeLinecap="round"
            />
            <defs>
                <motion.linearGradient
                    className="transform-gpu"
                    id={id}
                    gradientUnits={"userSpaceOnUse"}
                    initial={{
                        x1: "0%",
                        x2: "0%",
                        y1: "0%",
                        y2: "0%",
                    }}
                    animate={{
                        x1: gradientCoordinates.x1,
                        x2: gradientCoordinates.x2,
                        y1: gradientCoordinates.y1,
                        y2: gradientCoordinates.y2,
                    }}
                    transition={{
                        delay,
                        duration,
                        ease: "linear",
                        repeat: Infinity,
                        repeatDelay: 0,
                    }}
                >
                    <stop stopColor={gradientStartColor} stopOpacity="0"></stop>
                    <stop stopColor={gradientStartColor}></stop>
                    <stop offset="32.5%" stopColor={gradientStopColor}></stop>
                    <stop
                        offset="100%"
                        stopColor={gradientStopColor}
                        stopOpacity="0"
                    ></stop>
                </motion.linearGradient>
            </defs>
        </svg>
    )
}
