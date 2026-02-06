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
import { cn } from "../../lib/utils"

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

        if (lockScroll) {
            if (isExpanded) {
                document.body.style.overflow = "hidden"
            } else {
                document.body.style.overflow = ""
            }
        }

        return () => {
            if (lockScroll) {
                document.body.style.overflow = ""
            }
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
                style={{ borderRadius: triggerRadius }}
                transition={{ duration: 0.3 }}
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
    const { isExpanded, collapse, layoutId, animationDuration } =
        useExpandableScreen()

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    layoutId={layoutId}
                    className={cn(
                        "fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden bg-white shadow-2xl dark:bg-black",
                        className
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: animationDuration,
                        ease: [0.32, 0.72, 0, 1],
                    }}
                    style={{ borderRadius: 0 }} // Full screen typically implies 0 radius
                >
                    {showCloseButton && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                collapse()
                            }}
                            className={cn(
                                "absolute right-4 top-4 z-50 rounded-full bg-black/5 p-2 transition-colors hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20",
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
        </AnimatePresence>
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
