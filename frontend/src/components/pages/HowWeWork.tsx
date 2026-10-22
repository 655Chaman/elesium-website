import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle, MessageSquare, ArrowRight } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function HowWeWork() {
    const navigate = useNavigate()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    const steps = [
        {
            number: '01',
            title: 'Targeted Data Mapping',
            weDo: 'We monitor live market signals, public records, and industrial data feeds to identify companies actively looking for your exact capabilities.',
            youDo: 'Nothing. Our backend systems handle the heavy scraping and intelligence gathering.'
        },
        {
            number: '02',
            title: 'Rigorous Vetting',
            weDo: 'We don\'t deliver raw lists. We verify decision-makers, ensure compliance standards (like AS9100 or specific certifications) match up perfectly, and check for a genuine moment of need.',
            youDo: 'Nothing. We filter out the noise so you never waste time on an unqualified conversation.'
        },
        {
            number: '03',
            title: 'The Direct Introduction',
            weDo: 'We utilize our high-volume, multi-channel outbound architecture to bypass gatekeepers. Once the interest is locked in, we introduce you directly to the buyer.',
            youDo: 'You step in. You hop on the call, present your operational capabilities, and close the contract.'
        }
    ]

    return (
        <motion.div
            className="fixed inset-0 z-50 bg-white dark:bg-black text-black dark:text-white overflow-y-auto transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            data-lenis-prevent
        >
            <WhatsAppModal />
            <Helmet>
                <title>How Our AI Automation Works | Elesium</title>
                <meta name="description" content="Elesium's proven 4-step AI implementation process delivers automation ROI in 90 days. See how India's top AI agency operates." />
                <link rel="canonical" href="https://elesium.online/how-we-work" />
            </Helmet>
            <h1 className="sr-only">How Our AI Automation Process Works in India</h1>
            <div className="min-h-screen p-6 md:p-12 lg:p-20 max-w-[1200px] mx-auto flex flex-col">
                {/* Header / Nav */}
                <div className="flex items-center justify-between mb-16 md:mb-24">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-3 text-sm font-medium tracking-wide uppercase text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Back</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 transition-all shadow-sm"
                        >
                            <MessageSquare className="w-3.5 h-3.5 fill-current" />
                            <span>Chat on WhatsApp</span>
                        </button>
                    </div>
                </div>

                {/* 1. Above the Fold: The Core Philosophy */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="mb-20 md:mb-28 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 mb-6">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            #1 Enterprise AI In India • Process Architecture
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                        Less Friction.<br />More Dealflow.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-normal">
                        We don't sell software, and we don't make you log into a complex dashboard. We act as your outsourced strategic matchmaking partner—using advanced data systems to find your exact buyers and putting you directly in touch with them.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Connect via WhatsApp Desk</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 font-medium px-6 py-4 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </motion.div>

                {/* 2. The 3-Step Engine */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 md:mb-28"
                >
                    <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">The 3-Step Engine</h2>
                    </div>

                    <div className="space-y-6 md:space-y-8">
                        {steps.map((step) => (
                            <div key={step.number} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] p-8 md:p-10 rounded-3xl">
                                <div className="md:col-span-4 flex flex-col gap-2">
                                    <span className="text-xs font-mono font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Phase {step.number}</span>
                                    <h3 className="text-2xl font-bold text-black dark:text-white">{step.title}</h3>
                                </div>
                                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">What We Do (Infrastructure)</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">{step.weDo}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono">What You Do (Outcome)</h4>
                                        <p className="text-black dark:text-white font-medium leading-relaxed text-sm sm:text-base">{step.youDo}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 3. Why This Architecture Works */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 md:mb-28"
                >
                    <div className="mb-10 border-b border-gray-200 dark:border-white/10 pb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Why This Architecture Works</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-lg font-bold text-black dark:text-white mb-3">Incentivized by Outcomes</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">We are not a passive directory where you pay a monthly fee to stare at a blank screen. We only succeed when we connect you to high-value demand.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-lg font-bold text-black dark:text-white mb-3">Engineering Velocities</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">We know that a single bad connection wastes weeks of engineering time. Our system prioritizes precision and verified capacity over raw volume.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-lg font-bold text-black dark:text-white mb-3">Zero Overhead</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">You don't need to hire an internal sales development team or buy expensive data tools. You hook directly into our existing outbound infrastructure on day one.</p>
                        </div>
                    </div>
                </motion.div>

                {/* 4. The Counterparty Filter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-20 md:mb-28 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-8 md:p-14"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-3">The Counterparty Filter</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">We maintain strict qualification standards to ensure total alignment.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-4">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <h3 className="text-lg font-bold">Who We Partner With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                Established operators across our master markets—including Defense &amp; Aerospace, Energy &amp; Infrastructure, Private Equity, and MedTech—who have the capacity to take on new, high-ticket contracts and can move quickly when an introduction is made.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-400 dark:text-gray-500 mb-4">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">Who We Do Not Work With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                                Startups without proven delivery capabilities, companies looking for cheap volume over high-quality connections, or teams with slow, bureaucratic sales cycles.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Bottom of the Page: The Final Conversion Mechanism */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center py-16 border-t border-gray-200 dark:border-white/10"
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight">
                        Ready to plug your capacity<br />into a live demand stream?
                    </h2>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        We only open two priority partner slots each quarter to ensure total focus on our active engagements. Speak directly with our Principal Architect via WhatsApp.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 font-medium px-6 py-4 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
