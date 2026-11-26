import React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { cn } from "../../lib/utils"

export interface DirectionalStepProps {
    stepKey: string | number
    direction: number
    children: React.ReactNode
    className?: string
}

const STEP_SPRING = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

const directionalVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 32 : -32,
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? -32 : 32,
        opacity: 0,
    }),
}

/**
 * DirectionalStep animates step transitions along the horizontal axis using
 * physics springs, entering from the progression side and exiting opposite.
 */
export function DirectionalStep({
    stepKey,
    direction,
    children,
    className,
}: DirectionalStepProps) {
    return (
        <div className={cn("relative overflow-hidden", className)}>
            <AnimatePresence mode="wait" custom={direction} initial={false}>
                <motion.div
                    key={stepKey}
                    custom={direction}
                    variants={directionalVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={STEP_SPRING}
                    className="w-full"
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default DirectionalStep
