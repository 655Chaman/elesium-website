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
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="text-center mb-12 md:mb-16"
                >
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-neutral-600 dark:text-neutral-400 mb-3 block">
                        Enterprise Engagement Models
                    </span>
                    <h2 className="section-h2 text-black dark:text-white transition-colors">
                        Engagement Architecture
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch">
                    {/* Tier 1 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 20 }}
                        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 20 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.1 }}
                        className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 flex flex-col justify-between h-full rounded-[32px] p-8 md:p-10 transition-colors"
                    >
                        <div>
                            <span className="text-[11px] font-medium tracking-[0.08em] text-neutral-600 dark:text-neutral-400 uppercase mb-4 block">
                                Engagement Tier / 01
                            </span>
                            <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4 tracking-tight">
                                Growth-Stage Manufacturers &amp; Mid-Market
                            </h3>
                            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                                Deterministic Python and LangGraph state machines engineered to eliminate manual throughput bottlenecks and deliver audited cash-flow ROI within 90 days.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3 rounded-full text-sm active:scale-[0.97] transition-all"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/10 active:scale-[0.97] transition-all"
                            >
                                ele-in SaaS Waitlist &rarr;
                            </Link>
                        </div>
                    </motion.div>

                    {/* Tier 2 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 20 }}
                        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.97, y: 20 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.2 }}
                        className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 flex flex-col justify-between h-full rounded-[32px] p-8 md:p-10 transition-colors"
                    >
                        <div>
                            <span className="text-[11px] font-medium tracking-[0.08em] text-neutral-600 dark:text-neutral-400 uppercase mb-4 block">
                                Engagement Tier / 02
                            </span>
                            <h3 className="text-2xl md:text-3xl font-semibold text-black dark:text-white mb-4 tracking-tight">
                                Enterprise &amp; Tier-1 OEMs
                            </h3>
                            <p className="text-sm md:text-base text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
                                Custom sovereign multi-agent infrastructure deployed on your private VPC. Air-gapped on-premise inference, DPDP Act 2023 compliance, and a dedicated principal engineering pod.
                            </p>
                        </div>

                        <div className="pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center gap-3">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3 rounded-full text-sm active:scale-[0.97] transition-all"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto inline-flex items-center justify-center text-center px-5 py-3 rounded-full border border-neutral-200 dark:border-white/10 text-xs font-medium text-neutral-600 hover:text-black hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/10 active:scale-[0.97] transition-all"
                            >
                                ele-in SaaS Waitlist &rarr;
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
