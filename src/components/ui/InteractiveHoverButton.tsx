import React from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "../../lib/utils"

export function InteractiveHoverButton({
    children,
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            className={cn(
                "group relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-all duration-300",
                "bg-black text-white border-black hover:bg-white hover:text-black", // Light Mode: Black -> White
                "dark:bg-white dark:text-black dark:border-white dark:hover:bg-black dark:hover:text-white", // Dark Mode: White -> Black
                className
            )}
            {...props}
        >
            <span className="inline-flex items-center justify-center gap-2 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
                {children}
            </span>
            <div className="absolute top-0 left-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                <span>{children}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
            </div>
        </button>
    )
}
