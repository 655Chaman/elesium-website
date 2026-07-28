import { motion, useInView } from 'framer-motion'
import { Mail, ArrowRight } from 'lucide-react'
import Button from '../ui/Button'
import { useRef } from 'react'

export default function CallToAction() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.4 })

    return (
        <section ref={ref} className="py-16 md:py-40 bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute inset-0 opacity-10">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 90, 180],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        rotate: [180, 90, 0],
                    }}
                    transition={{
                        duration: 35,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-6 relative z-10 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-8">
                        <Mail className="text-white" size={36} />
                    </div>

                    <h2 className="display-lg mb-6 text-white">
                        Get started
                    </h2>
                    <p className="body-lg text-white/90 mb-12 max-w-3xl mx-auto">
                        Connect with verified buyers and manufacturers across global markets.
                    </p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                    >
                        <Button
                            variant="primary"
                            className="bg-white text-brand-dark hover:bg-gray-100 group"
                        >
                            Contact sales
                            <ArrowRight className="inline ml-2 group-hover:translate-x-1 transition-transform duration-300" size={20} />
                        </Button>
                        <Button
                            variant="secondary"
                            className="border-white text-white hover:bg-white hover:text-brand-dark"
                        >
                            Learn more
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
