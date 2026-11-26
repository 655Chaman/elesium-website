import { ComponentPropsWithoutRef, FC, ReactNode, useRef } from "react"
import { motion, MotionValue, useScroll, useSpring, useTransform } from "framer-motion"

import { cn } from "../../lib/utils"

export interface TextRevealProps extends ComponentPropsWithoutRef<"div"> {
    children: string
    sticky?: boolean
    progress?: MotionValue<number>
}

export const TextReveal: FC<TextRevealProps> = ({
    children,
    className,
    sticky = true,
    progress,
}) => {
    const targetRef = useRef<HTMLDivElement | null>(null)
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: sticky ? ["start start", "end end"] : ["start 0.88", "start 0.28"],
    })

    const smoothProgress = useSpring(progress ?? scrollYProgress, {
        stiffness: 120,
        damping: 24,
        restDelta: 0.001,
    })

    if (typeof children !== "string") {
        throw new Error("TextReveal: children must be a string")
    }

    const words = children.trim().split(/\s+/)

    return (
        <div ref={targetRef} className={cn("relative z-0", sticky && "h-[200vh]", className)}>
            <div
                className={cn(
                    "mx-auto flex max-w-4xl items-center bg-transparent",
                    sticky ? "sticky top-0 h-screen px-4 py-16" : "relative h-auto"
                )}
            >
                <span className="flex flex-wrap justify-center lg:justify-start text-2xl sm:text-3xl md:text-4xl xl:text-[42px] font-light tracking-[-0.025em] leading-[1.24]">
                    {words.map((word, i) => {
                        const start = (i / words.length) * 0.84
                        const end = Math.min(1, start + 0.16)
                        return (
                            <Word key={`${i}-${word}`} progress={smoothProgress} range={[start, end]}>
                                {word}
                            </Word>
                        )
                    })}
                </span>
            </div>
        </div>
    )
}

interface WordProps {
    children: ReactNode
    progress: MotionValue<number>
    range: [number, number]
}

const Word: FC<WordProps> = ({ children, progress, range }) => {
    const opacity = useTransform(progress, range, [0.18, 1])
    return (
        <motion.span
            style={{ opacity }}
            className="inline-block mr-[0.28em] text-black dark:text-white will-change-[opacity]"
        >
            {children}
        </motion.span>
    )
}
