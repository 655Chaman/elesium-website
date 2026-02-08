import React, { useRef, useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

interface InteractiveHoverButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode
}

export function InteractiveHoverButton({
    children,
    className,
    ...props
}: InteractiveHoverButtonProps) {
    const ref = useRef<HTMLButtonElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current!.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * 0.15, y: middleY * 0.15 })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    const { x, y } = position

    return (
        <motion.button
            ref={ref}
            animate={{ x, y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            onMouseMove={handleMouseMove}
            onMouseLeave={reset}
            className={cn(
                "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-colors duration-300",
                "bg-black text-white border-black hover:bg-white hover:text-black", // Light Mode: Black -> White
                "dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white", // Dark Mode: White -> Black
                className
            )}
            {...props}
        >
            <span className="inline-flex items-center justify-center gap-2 transition-transform duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                {children}
            </span>
            <div className="absolute top-0 left-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 opacity-0 transition-transform duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span>{children}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </motion.button>
    )
}
