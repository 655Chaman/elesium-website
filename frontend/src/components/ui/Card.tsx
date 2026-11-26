import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

const CARD_SPRING = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

export default function Card({ children, className = '', hover = true }: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -4 } : {}}
            transition={CARD_SPRING}
            className={`bg-white dark:bg-neutral-950 rounded-3xl p-8 border border-neutral-200 dark:border-neutral-800 transition-shadow duration-300 hover:shadow-xl ${className}`}
        >
            {children}
        </motion.div>
    )
}
