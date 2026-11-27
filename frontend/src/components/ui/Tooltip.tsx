import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface TooltipContextValue {
    delayMs: number
    warmupWindowMs: number
    isWarm: () => boolean
    markOpened: () => void
    markClosed: () => void
}

const DEFAULT_DELAY_MS = 450
const DEFAULT_WARMUP_WINDOW_MS = 1500

const TOOLTIP_SPRING = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

// Module-level fallback state so standalone <Tooltip> usage outside <TooltipProvider> also shares warmup state.
let fallbackOpenCount = 0
let fallbackLastCloseAt = 0

const TooltipContext = createContext<TooltipContextValue | null>(null)

export interface TooltipProviderProps {
    children: React.ReactNode
    delayMs?: number
    warmupWindowMs?: number
}

export function TooltipProvider({
    children,
    delayMs = DEFAULT_DELAY_MS,
    warmupWindowMs = DEFAULT_WARMUP_WINDOW_MS,
}: TooltipProviderProps) {
    const openCountRef = useRef(0)
    const lastCloseAtRef = useRef(0)

    const isWarm = useCallback(() => {
        if (openCountRef.current > 0) return true
        if (lastCloseAtRef.current === 0) return false
        return Date.now() - lastCloseAtRef.current < warmupWindowMs
    }, [warmupWindowMs])

    const markOpened = useCallback(() => {
        openCountRef.current += 1
    }, [])

    const markClosed = useCallback(() => {
        openCountRef.current = Math.max(0, openCountRef.current - 1)
        lastCloseAtRef.current = Date.now()
    }, [])

    return (
        <TooltipContext.Provider
            value={{
                delayMs,
                warmupWindowMs,
                isWarm,
                markOpened,
                markClosed,
            }}
        >
            {children}
        </TooltipContext.Provider>
    )
}

export interface TooltipProps {
    content: React.ReactNode
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
    className?: string
    wrapperClassName?: string
}

const sidePositionClasses: Record<NonNullable<TooltipProps["side"]>, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
}

const sideOffsetInitial: Record<NonNullable<TooltipProps["side"]>, { x?: number; y?: number }> = {
    top: { y: 4 },
    bottom: { y: -4 },
    left: { x: 4 },
    right: { x: -4 },
}

export function Tooltip({
    content,
    children,
    side = "top",
    className,
    wrapperClassName,
}: TooltipProps) {
    const ctx = useContext(TooltipContext)
    const [open, setOpen] = useState(false)
    const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const isOpenRef = useRef(false)
    const wrapperRef = useRef<HTMLSpanElement>(null)
    const isTouchRef = useRef(false)

    const clearTimer = useCallback(() => {
        if (openTimerRef.current !== null) {
            clearTimeout(openTimerRef.current)
            openTimerRef.current = null
        }
    }, [])

    const commitOpen = useCallback(() => {
        if (isOpenRef.current) return
        isOpenRef.current = true
        if (ctx) {
            ctx.markOpened()
        } else {
            fallbackOpenCount += 1
        }
        setOpen(true)
    }, [ctx])

    const commitClose = useCallback(() => {
        clearTimer()
        if (!isOpenRef.current) return
        isOpenRef.current = false
        if (ctx) {
            ctx.markClosed()
        } else {
            fallbackOpenCount = Math.max(0, fallbackOpenCount - 1)
            fallbackLastCloseAt = Date.now()
        }
        setOpen(false)
    }, [clearTimer, ctx])

    const handleTriggerEnter = useCallback(() => {
        clearTimer()
        const warm = ctx
            ? ctx.isWarm()
            : fallbackOpenCount > 0 ||
              (fallbackLastCloseAt > 0 && Date.now() - fallbackLastCloseAt < DEFAULT_WARMUP_WINDOW_MS)

        const delay = warm ? 0 : (ctx?.delayMs ?? DEFAULT_DELAY_MS)
        if (delay === 0) {
            commitOpen()
        } else {
            openTimerRef.current = setTimeout(() => {
                openTimerRef.current = null
                commitOpen()
            }, delay)
        }
    }, [clearTimer, commitOpen, ctx])

    useEffect(() => {
        if (!open) return
        const handleOutsidePointer = (e: PointerEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                commitClose()
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                commitClose()
            }
        }
        document.addEventListener("pointerdown", handleOutsidePointer)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("pointerdown", handleOutsidePointer)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, commitClose])

    useEffect(() => {
        return () => {
            clearTimer()
            if (isOpenRef.current) {
                isOpenRef.current = false
                if (ctx) {
                    ctx.markClosed()
                } else {
                    fallbackOpenCount = Math.max(0, fallbackOpenCount - 1)
                    fallbackLastCloseAt = Date.now()
                }
            }
        }
    }, [clearTimer, ctx])

    const handlePointerEnter = useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
        isTouchRef.current = e.pointerType !== "mouse"
    }, [])

    const handlePointerDown = useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
        isTouchRef.current = e.pointerType !== "mouse"
    }, [])

    const handleMouseEnter = useCallback(() => {
        if (isTouchRef.current) return
        handleTriggerEnter()
    }, [handleTriggerEnter])

    const handleFocus = useCallback(() => {
        if (isTouchRef.current) return
        handleTriggerEnter()
    }, [handleTriggerEnter])

    const handleClick = useCallback(() => {
        if (isOpenRef.current) {
            commitClose()
        } else {
            clearTimer()
            commitOpen()
        }
    }, [clearTimer, commitClose, commitOpen])

    const offset = sideOffsetInitial[side]

    return (
        <span
            ref={wrapperRef}
            className={cn("relative inline-flex items-center", wrapperClassName)}
            onPointerEnter={handlePointerEnter}
            onPointerDown={handlePointerDown}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={commitClose}
            onFocus={handleFocus}
            onBlur={commitClose}
            onClick={handleClick}
        >
            {children}
            <AnimatePresence>
                {open && (
                    <motion.span
                        role="tooltip"
                        initial={{ opacity: 0, scale: 0.97, ...offset }}
                        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                        exit={{ opacity: 0, scale: 0.97, ...offset }}
                        transition={TOOLTIP_SPRING}
                        className={cn(
                            "pointer-events-none absolute z-50 max-w-[calc(100vw-2rem)] whitespace-normal sm:whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium shadow-lg",
                            "bg-black text-white border border-neutral-800",
                            "dark:bg-white dark:text-black dark:border-neutral-200",
                            sidePositionClasses[side],
                            className
                        )}
                    >
                        {content}
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    )
}

export default Tooltip
