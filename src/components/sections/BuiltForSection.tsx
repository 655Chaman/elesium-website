import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function BuiltForSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <section ref={ref} className="py-40 px-[72px] bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
            >
                {/* Title */}
                <div>
                    <h2 className="section-heading">
                        Built for trust
                    </h2>
                </div>

                {/* Description */}
                <div>
                    <p className="body-text">
                        Elesium is built on verification and transparency. Every buyer and manufacturer
                        on our platform is pre-screened for legitimacy, ensuring you deal only with
                        serious partners.
                    </p>
                </div>
            </motion.div>
        </section>
    )
}
