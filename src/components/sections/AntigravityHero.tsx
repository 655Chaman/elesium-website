import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function AntigravityHero() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section ref={ref} className="relative min-h-screen flex items-center justify-center px-[72px] py-40">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center max-w-5xl mx-auto relative z-10"
            >
                <h1 className="hero-heading mb-8">
                    Connect industries
                    <br />
                    with buyers
                </h1>

                <p className="intro-text mb-12 max-w-3xl mx-auto">
                    A platform connecting manufacturers with qualified buyers across global markets.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="px-8 py-4 bg-[#121317] text-white rounded-full text-[14.5px] font-[430] hover:bg-[#45474D] transition-all duration-300">
                        Get started
                    </button>
                    <button className="px-8 py-4 border-2 border-[#121317] text-[#121317] rounded-full text-[14.5px] font-[430] hover:bg-[#121317] hover:text-white transition-all duration-300">
                        View demo
                    </button>
                </div>
            </motion.div>
        </section>
    )
}
