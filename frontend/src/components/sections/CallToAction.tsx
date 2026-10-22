import { motion, useInView } from 'framer-motion'
import { MessageSquare, ArrowRight, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import logo from '../../assets/LOGO_NEW.png'

export default function CallToAction() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <section ref={ref} className="py-20 md:py-28 bg-white dark:bg-black transition-colors duration-300">
            <WhatsAppModal />
            <div className="max-w-5xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="relative rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-[#0A0A0A] p-8 sm:p-16 text-center overflow-hidden shadow-2xl"
                >
                    {/* Subtle watermark logo */}
                    <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 pointer-events-none select-none opacity-[0.05] dark:opacity-[0.08]">
                        <img
                            src={logo}
                            alt="Elesium Background Watermark"
                            width="260"
                            height="260"
                            className="w-64 h-64 object-contain pointer-events-none select-none"
                        />
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-6">
                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                            <span className="relative flex h-2 w-2">
                                <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="uppercase tracking-widest text-emerald-400 font-semibold text-[11px]">
                                #1 Enterprise AI In India • Direct Principal Pairing
                            </span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
                            Ready to Replace 40-Hour Bottlenecks with Deterministic AI?
                        </h2>

                        <p className="text-base sm:text-lg text-gray-300 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            No sales gatekeepers. Speak directly with our Principal AI Systems Architect in Shivamogga, Karnataka via WhatsApp to evaluate sovereign private VPC infrastructure, LangGraph state machines, and statutory DPDP Act compliance.
                        </p>

                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-lg group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>

                            <Link
                                to="/waitlist"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-4 rounded-full text-sm transition-all"
                            >
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                                <span>ele-in SaaS Waitlist &rarr;</span>
                            </Link>
                        </div>

                        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-gray-400">
                            <span>Direct SLA: &lt; 4 Hour Response</span>
                            <span>•</span>
                            <span>Private Air-Gapped VPC</span>
                            <span>•</span>
                            <span>DPDP Act 2023 Compliant</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
