"use client"

import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import React, {
    createContext,
    useContext,
    useEffect,
    useId,
    useState,
} from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

const MODAL_SPRING = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

interface ExpandableScreenContextType {
    isExpanded: boolean
    expand: () => void
    collapse: () => void
    layoutId: string
    triggerRadius: string
    contentRadius: string
    animationDuration: number
}

const ExpandableScreenContext = createContext<
    ExpandableScreenContextType | undefined
>(undefined)

export function useExpandableScreen() {
    const context = useContext(ExpandableScreenContext)
    if (!context) {
        throw new Error(
            "useExpandableScreen must be used within an ExpandableScreen"
        )
    }
    return context
}

interface ExpandableScreenProps {
    children: React.ReactNode
    defaultExpanded?: boolean
    onExpandChange?: (expanded: boolean) => void
    layoutId?: string
    triggerRadius?: string
    contentRadius?: string
    animationDuration?: number
    lockScroll?: boolean
}

export function ExpandableScreen({
    children,
    defaultExpanded = false,
    onExpandChange,
    layoutId,
    triggerRadius = "100px",
    contentRadius = "24px",
    animationDuration = 0.3,
    lockScroll = true,
}: ExpandableScreenProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded)
    const uniqueId = useId()
    const sharedLayoutId = layoutId || uniqueId

    useEffect(() => {
        if (onExpandChange) {
            onExpandChange(isExpanded)
        }

        if (!lockScroll || !isExpanded || typeof document === "undefined") {
            return
        }

        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        return () => {
            document.body.style.overflow = prevOverflow
        }
    }, [isExpanded, onExpandChange, lockScroll])

    const expand = () => setIsExpanded(true)
    const collapse = () => setIsExpanded(false)

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isExpanded) {
                collapse()
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [isExpanded])

    return (
        <ExpandableScreenContext.Provider
            value={{
                isExpanded,
                expand,
                collapse,
                layoutId: sharedLayoutId,
                triggerRadius,
                contentRadius,
                animationDuration,
            }}
        >
            {children}
        </ExpandableScreenContext.Provider>
    )
}

interface ExpandableScreenTriggerProps {
    children: React.ReactNode
    className?: string
}

export function ExpandableScreenTrigger({
    children,
    className = "",
}: ExpandableScreenTriggerProps) {
    const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen()

    return (
        <div
            className={cn("w-fit", className)}
            style={{ display: isExpanded ? "none" : "block" }}
        >
            <motion.div
                layoutId={layoutId}
                onClick={expand}
                whileTap={{ scale: 0.97 }}
                style={{ borderRadius: triggerRadius }}
                transition={MODAL_SPRING}
            >
                {children}
            </motion.div>
        </div>
    )
}

interface ExpandableScreenContentProps {
    children: React.ReactNode
    className?: string
    showCloseButton?: boolean
    closeButtonClassName?: string
}

export function ExpandableScreenContent({
    children,
    className = "",
    showCloseButton = true,
    closeButtonClassName = "",
}: ExpandableScreenContentProps) {
    const { isExpanded, collapse, layoutId } = useExpandableScreen()

    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return createPortal(
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    layoutId={layoutId}
                    className={cn(
                        "fixed inset-0 z-[100] flex h-[100dvh] w-full flex-col overflow-y-auto overscroll-contain bg-white dark:bg-black text-black dark:text-white shadow-2xl",
                        className
                    )}
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={MODAL_SPRING}
                    style={{ borderRadius: 0 }}
                >
                    {showCloseButton && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation()
                                collapse()
                            }}
                            className={cn(
                                "absolute right-4 top-[max(1rem,env(safe-area-inset-top))] z-[101] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-black/5 transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20",
                                closeButtonClassName
                            )}
                            aria-label="Close"
                        >
                            <X className="h-6 w-6 text-black dark:text-white" />
                        </button>
                    )}
                    <div className="h-full w-full overflow-auto">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

interface ExpandableScreenBackgroundProps {
    trigger?: React.ReactNode
    content?: React.ReactNode
    className?: string
}

export function ExpandableScreenBackground({
    trigger,
    content,
    className = "",
}: ExpandableScreenBackgroundProps) {
    const { isExpanded } = useExpandableScreen()

    return (
        <div className={className}>
            {isExpanded ? content : trigger}
        </div>
    )
}
