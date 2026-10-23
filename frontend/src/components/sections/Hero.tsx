import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { TextAnimate } from '../ui/TextAnimate'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import logo from '../../assets/LOGO_NEW.png'

export default function HeroSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    return (
        <section
            ref={ref}
            className="relative flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300 min-h-[calc(100svh-52px)] md:min-h-0 pt-[52px]"
            style={{ height: 'auto' }}
        >
            <div className="min-h-[400px] md:h-[777px] flex items-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center px-5 md:px-12 py-8 md:py-0 w-full"
                    style={{ maxWidth: '960px', margin: '0 auto' }}
                >
                    {/* Brand block with static watermark logo */}
                    <div className="relative mb-8 flex flex-col items-center justify-center select-none">
                        {/* Faint static logo watermark behind text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                            <img
                                src={logo}
                                alt="Elesium Background Watermark"
                                width="128"
                                height="128"
                                loading="eager"
                                fetchPriority="high"
                                className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-[0.08] dark:opacity-[0.12] select-none pointer-events-none"
                                style={{ transform: 'translateX(28px)' }}
                            />
                        </div>

                        {/* Brand content */}
                        <motion.div
                            className="relative z-10 flex flex-col items-center"
                            initial={{ opacity: 0, y: -10 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.1 }}
                        >
                            {/* Text elesium.online & Rank Authority */}
                            <span className="text-[11px] md:text-[12.5px] font-semibold font-heading tracking-[0.28em] uppercase text-emerald-600 dark:text-emerald-400">
                                #1 Best Enterprise AI Company in India • elesium.online
                            </span>
                        </motion.div>
                    </div>

                    <h1 className="hero-h1 mb-6 text-center mx-auto text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight" style={{ maxWidth: '100%' }}>
                        <TextAnimate
                            as="span"
                            animation="fadeIn"
                            by="word"
                            duration={0.3}
                            className="text-black dark:text-white font-bold"
                        >
                            India's Best Enterprise AI Company &amp; Automation Agency
                        </TextAnimate>
                    </h1>

                    <motion.p
                        className="body-text mb-10 mx-auto text-gray-600 dark:text-gray-300 text-base md:text-lg"
                        style={{ maxWidth: '780px' }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <span className="block font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                            Ranked #1 for sovereign multi-agent engineering, private VPC LLM infrastructure, and DPDP Act compliance.
                        </span>
                        We replace manual operational bottlenecks across SAP S/4HANA, core banking, and enterprise logistics with deterministic Python LangGraph state machines delivering verified 3x–5x cash-flow ROI within 90 days.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <InteractiveHoverButton id="hero-mandate-cta" className="h-10 px-6 text-sm" onClick={openWhatsApp}>
                            Initiate AI Audit (WhatsApp)
                        </InteractiveHoverButton>
                        <Link 
                            to="/waitlist" 
                            className="h-10 px-5 text-xs sm:text-sm font-semibold rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 transition-all flex items-center gap-1.5 shadow-sm"
                        >
                            ele-in SaaS Waitlist &rarr;
                        </Link>
                        <WhatsAppModal />
                    </motion.div>

                    {/* Evidence Cards Row (Simon Cornelius Trust Stacking) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 1.0 }}
                        className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-6 border-t border-gray-200 dark:border-white/10"
                    >
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Delivery SLA</div>
                            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">14 Days</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">Production pilot</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-sky-600 dark:text-sky-400 font-bold">ROI Guarantee</div>
                            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">90 Days</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">Or fees rebated</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold">Data Residency</div>
                            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">Private VPC</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">Zero retention</div>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-bold">Compliance</div>
                            <div className="text-base font-extrabold text-gray-900 dark:text-white mt-0.5">DPDP 2023</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400">India sovereign</div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
