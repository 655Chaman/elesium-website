import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
}

export default function Card({ children, className = '', hover = true }: CardProps) {
    return (
        <motion.div
            whileHover={hover ? { y: -4 } : {}}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className={`bg-white rounded-3xl p-8 border border-gray-100 transition-all duration-500 hover:shadow-xl ${className}`}
        >
            {children}
        </motion.div>
    )
}
