import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function Solutions() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <section
            ref={ref}
            className="relative bg-white dark:bg-black transition-colors duration-300 py-16 md:py-24"
            style={{
                height: 'auto',
                minHeight: '0',
            }}
        >
            <WhatsAppModal />
            <div className="max-w-6xl mx-auto px-5 md:px-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-3 block">
                        Enterprise Engagement Models
                    </span>
                    <h2 className="section-h2 text-black dark:text-white transition-colors">
                        Built for Market Leaders
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Tier 1 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                        className="bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 flex flex-col justify-between h-full rounded-3xl p-8 md:p-10 transition-colors"
                    >
                        <div>
                            <span className="text-[11px] font-medium tracking-[0.08em] text-gray-500 dark:text-gray-400 uppercase mb-4 block">
                                Engagement Tier / 01
                            </span>
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                                Growth-Stage Manufacturers &amp; Mid-Market
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                You have the capacity to scale operations. We engineer deterministic Python &amp; LangGraph state machines to eliminate manual throughput bottlenecks and deliver verified cash-flow ROI in 90 days.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/waitlist"
                                className="w-full sm:w-auto text-center px-4 py-3 text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                Or Schedule Review &rarr;
                            </Link>
                        </div>
                    </motion.div>

                    {/* Tier 2 */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        className="bg-gray-50/80 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 flex flex-col justify-between h-full rounded-3xl p-8 md:p-10 transition-colors"
                    >
                        <div>
                            <span className="text-[11px] font-medium tracking-[0.08em] text-gray-500 dark:text-gray-400 uppercase mb-4 block">
                                Engagement Tier / 02
                            </span>
                            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">
                                Enterprise &amp; Tier-1 OEMs
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                                Custom sovereign outbound and multi-agent infrastructure deployed on your private VPC. Air-gapped on-premise inference, complete DPDP Act 2023 compliance, and dedicated principal engineering pod.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-gray-200/80 dark:border-white/5 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-sm"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/waitlist"
                                className="w-full sm:w-auto text-center px-4 py-3 text-xs text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                Or Schedule Review &rarr;
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
