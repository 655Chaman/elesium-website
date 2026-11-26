import React, { Children, useCallback, useEffect, useRef, useState } from "react"
import { animate, motion, useMotionValue } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "../../lib/utils"

export interface CarouselProps {
    items?: React.ReactNode[]
    children?: React.ReactNode
    className?: string
    trackClassName?: string
    itemClassName?: string
    showControls?: boolean
    showIndicators?: boolean
    gap?: number
}

const SNAP_SPRING = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

export function Carousel({
    items,
    children,
    className,
    trackClassName,
    itemClassName,
    showControls = true,
    showIndicators = true,
    gap = 16,
}: CarouselProps) {
    const slides = items ?? Children.toArray(children)
    const viewportRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const x = useMotionValue(0)

    const [maxScroll, setMaxScroll] = useState(0)
    const [activeIndex, setActiveIndex] = useState(0)

    const measure = useCallback(() => {
        if (!viewportRef.current || !trackRef.current) return
        const viewportWidth = viewportRef.current.clientWidth
        const trackWidth = trackRef.current.scrollWidth
        const nextMax = Math.max(0, trackWidth - viewportWidth)
        setMaxScroll(nextMax)
        if (x.get() < -nextMax) {
            x.set(-nextMax)
        }
    }, [x])

    useEffect(() => {
        measure()
        if (typeof ResizeObserver === "undefined") return
        const observer = new ResizeObserver(measure)
        if (viewportRef.current) observer.observe(viewportRef.current)
        if (trackRef.current) observer.observe(trackRef.current)
        window.addEventListener("resize", measure)
        return () => {
            observer.disconnect()
            window.removeEventListener("resize", measure)
        }
    }, [measure, slides.length])

    const scrollToIndex = useCallback(
        (index: number) => {
            if (!trackRef.current || slides.length === 0) return
            const clampedIndex = Math.max(0, Math.min(index, slides.length - 1))
            const child = trackRef.current.children[clampedIndex] as HTMLElement | undefined
            const targetOffset = child ? -Math.min(child.offsetLeft, maxScroll) : 0
            setActiveIndex(clampedIndex)
            animate(x, targetOffset, SNAP_SPRING)
        },
        [maxScroll, slides.length, x]
    )

    const handleDragEnd = useCallback(() => {
        if (!trackRef.current || slides.length === 0) return
        const currentX = x.get()
        let closestIdx = 0
        let smallestDist = Infinity
        Array.from(trackRef.current.children).forEach((child, idx) => {
            const el = child as HTMLElement
            const target = -Math.min(el.offsetLeft, maxScroll)
            const dist = Math.abs(currentX - target)
            if (dist < smallestDist) {
                smallestDist = dist
                closestIdx = idx
            }
        })
        setActiveIndex(closestIdx)
    }, [maxScroll, slides.length, x])

    return (
        <div className={cn("relative w-full select-none", className)}>
            <div ref={viewportRef} className="overflow-hidden w-full">
                <motion.div
                    ref={trackRef}
                    drag="x"
                    dragConstraints={{ left: -maxScroll, right: 0 }}
                    dragElastic={0.28}
                    dragTransition={{ bounceStiffness: 400, bounceDamping: 35 }}
                    onDragEnd={handleDragEnd}
                    style={{ x, gap: `${gap}px` }}
                    whileTap={{ cursor: "grabbing" }}
                    className={cn(
                        "flex cursor-grab items-stretch will-change-transform",
                        trackClassName
                    )}
                >
                    {slides.map((slide, idx) => (
                        <div key={idx} className={cn("shrink-0", itemClassName)}>
                            {slide}
                        </div>
                    ))}
                </motion.div>
            </div>

            {(showControls || showIndicators) && slides.length > 1 && (
                <div className="mt-4 flex items-center justify-between gap-4">
                    {showIndicators ? (
                        <div className="flex items-center gap-1.5" role="tablist" aria-label="Carousel slides">
                            {slides.map((_, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    role="tab"
                                    aria-selected={idx === activeIndex}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    onClick={() => scrollToIndex(idx)}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-200",
                                        idx === activeIndex
                                            ? "w-6 bg-black dark:bg-white"
                                            : "w-1.5 bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-500 dark:hover:bg-neutral-500"
                                    )}
                                />
                            ))}
                        </div>
                    ) : (
                        <div />
                    )}

                    {showControls && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="Previous slide"
                                onClick={() => scrollToIndex(activeIndex - 1)}
                                disabled={activeIndex === 0}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                aria-label="Next slide"
                                onClick={() => scrollToIndex(activeIndex + 1)}
                                disabled={activeIndex >= slides.length - 1}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Carousel
