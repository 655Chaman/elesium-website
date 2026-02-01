import { ReactNode } from 'react'
import { motion, MotionProps } from 'framer-motion'

interface ButtonProps extends Omit<MotionProps, 'children'> {
    variant?: 'primary' | 'secondary'
    children: ReactNode
    className?: string
    onClick?: () => void
}

export default function Button({ variant = 'primary', children, className = '', onClick, ...props }: ButtonProps) {
    const baseClasses = 'px-8 py-4 rounded-full font-medium text-base transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'bg-brand-dark text-white hover:bg-brand-gray hover:shadow-lg',
        secondary: 'border-2 border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white hover:shadow-lg',
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </motion.button>
    )
}
