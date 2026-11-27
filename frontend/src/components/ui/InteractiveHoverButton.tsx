import React, { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface InteractiveHoverButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode
}

const NATURAL_SPRING = {
    type: "spring" as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

export function InteractiveHoverButton({
    children,
    className,
    onMouseEnter,
    onMouseLeave,
    onMouseMove,
    onPointerDown,
    onClick,
    ...props
}: InteractiveHoverButtonProps) {
    const ref = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = useState(false)

    const supportsHover = () =>
        typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (supportsHover() && ref.current) {
            const { clientX, clientY } = e
            const { height, width, left, top } = ref.current.getBoundingClientRect()
            const middleX = clientX - (left + width / 2)
            const middleY = clientY - (top + height / 2)
            setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
        }
        onMouseMove?.(e)
    }

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (supportsHover()) {
            setIsHovered(true)
        }
        onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
        setIsHovered(false)
        setPosition({ x: 0, y: 0 })
        onMouseLeave?.(e)
    }

    const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
        if (e.pointerType !== "mouse") {
            setIsHovered(false)
            setPosition({ x: 0, y: 0 })
        }
        onPointerDown?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!supportsHover()) {
            setIsHovered(false)
            setPosition({ x: 0, y: 0 })
        }
        onClick?.(e)
    }

    const { x, y } = position

    return (
        <motion.button
            ref={ref}
            animate={{ x, y }}
            whileTap={{ scale: 0.97 }}
            transition={NATURAL_SPRING}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onPointerDown={handlePointerDown}
            onClick={handleClick}
            className={cn(
                "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-colors duration-200 active:opacity-90",
                "bg-black text-white border-black [@media(hover:hover)]:hover:bg-white [@media(hover:hover)]:hover:text-black",
                "dark:bg-white dark:text-black dark:border-white dark:[@media(hover:hover)]:hover:bg-black dark:[@media(hover:hover)]:hover:text-white",
                className
            )}
            {...props}
        >
            <motion.span
                aria-hidden={isHovered}
                animate={{
                    x: isHovered ? 48 : 0,
                    opacity: isHovered ? 0 : 1,
                }}
                transition={NATURAL_SPRING}
                className="inline-flex items-center justify-center gap-2"
            >
                {children}
            </motion.span>
            <motion.div
                aria-hidden={!isHovered}
                initial={false}
                animate={{
                    x: isHovered ? 0 : -48,
                    opacity: isHovered ? 1 : 0,
                }}
                transition={NATURAL_SPRING}
                className="pointer-events-none absolute top-0 left-0 z-10 flex h-full w-full items-center justify-center gap-2"
            >
                <span>{children}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
            </motion.div>
        </motion.button>
    )
}
