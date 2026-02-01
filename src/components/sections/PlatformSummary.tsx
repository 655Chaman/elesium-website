import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Folder, Code, Sparkles } from 'lucide-react'

export default function PlatformSummary() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section ref={ref} className="relative py-40 px-[72px]">
            <div className="max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <h2 className="section-heading mb-12 max-w-4xl">
                        Elesium is our platform connecting multi-million dollar manufacturers
                        with verified buyers across global markets.
                    </h2>

                    <p className="body-text max-w-3xl">
                        Built for B2B transactions at scale. Every connection is vetted for legitimacy
                        and financial capacity before approval.
                    </p>
                </motion.div>

                {/* Floating Icons */}
                <div className="absolute top-20 right-40 opacity-40">
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Folder size={48} className="text-blue-500" />
                    </motion.div>
                </div>

                <div className="absolute top-60 right-20 opacity-40">
                    <motion.div
                        animate={{ y: [0, 20, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Code size={48} className="text-purple-500" />
                    </motion.div>
                </div>

                <div className="absolute bottom-40 left-20 opacity-40">
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles size={48} className="text-green-500" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
