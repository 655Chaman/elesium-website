import { ReactNode } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary'
    children: ReactNode
    className?: string
    onClick?: () => void
}

const BUTTON_SPRING = {
    type: 'spring' as const,
    stiffness: 380,
    damping: 32,
    mass: 0.8,
}

export default function Button({ variant = 'primary', children, className = '', onClick, ...props }: ButtonProps) {
    const baseClasses = 'px-8 py-4 rounded-full font-medium text-base transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 hover:shadow-lg',
        secondary: 'border-2 border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black hover:shadow-lg',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={BUTTON_SPRING}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    )
}
