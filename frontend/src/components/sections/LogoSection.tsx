import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function LogoSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.5 })

    return (
        <section ref={ref} className="relative bg-black py-40 px-[72px] overflow-hidden">
            {/* Animated logo with glow effect */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 1.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center relative z-10"
            >
                <div className="text-white text-8xl font-semibold mb-4">
                    Elesium
                </div>
                <div className="text-gray-400 text-xl">
                    Connecting global markets
                </div>
            </motion.div>

            {/* Glowing particles effect */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            </div>
        </section>
    )
}
