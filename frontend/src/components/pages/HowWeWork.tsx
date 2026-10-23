import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, MessageSquare, ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function HowWeWork() {
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
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>How Our AI Automation Works | Elesium</title>
                <meta name="description" content="Elesium's proven 4-step AI implementation process delivers automation ROI in 90 days. See how India's top AI agency operates." />
                <link rel="canonical" href="https://elesium.online/how-we-work" />
            </Helmet>
            <h1 className="sr-only">How Our AI Automation Process Works in India</h1>

            <div className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">How We Work</span>
                </nav>

                {/* 1. Above the Fold: The Core Philosophy */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="mb-14 md:mb-16 max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            #1 Enterprise AI In India • Process Architecture
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.1]">
                        Less Friction.<br />More Dealflow.
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-normal">
                        We don't sell software, and we don't make you log into a complex dashboard. We act as your outsourced strategic matchmaking partner—using advanced data systems to find your exact buyers and putting you directly in touch with them.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 font-medium px-5 py-3.5 rounded-full text-sm transition-all"
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
                    className="mb-14 md:mb-16"
                >
                    <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Operational Execution
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">The 3-Step Engine</h2>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                        {steps.map((step) => (
                            <div key={step.number} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-start border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] p-6 md:p-8 rounded-3xl">
                                <div className="md:col-span-4 flex flex-col gap-1.5">
                                    <span className="text-xs font-mono font-semibold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Phase {step.number}</span>
                                    <h3 className="text-xl font-bold text-black dark:text-white">{step.title}</h3>
                                </div>
                                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-mono">What We Do (Infrastructure)</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{step.weDo}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5 font-mono">What You Do (Outcome)</h4>
                                        <p className="text-black dark:text-white font-medium leading-relaxed text-sm">{step.youDo}</p>
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
                    className="mb-14 md:mb-16"
                >
                    <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Systems Advantage
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Why This Architecture Works</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Incentivized by Outcomes</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">We are not a passive directory where you pay a monthly fee to stare at a blank screen. We only succeed when we connect you to high-value demand.</p>
                        </div>
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Engineering Velocities</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">We know that a single bad connection wastes weeks of engineering time. Our system prioritizes precision and verified capacity over raw volume.</p>
                        </div>
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Zero Overhead</h3>
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
                    className="mb-14 md:mb-16 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-10"
                >
                    <div className="mb-8 text-center max-w-xl mx-auto">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Strict Verification
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">The Counterparty Filter</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">We maintain strict qualification standards to ensure total alignment.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold">Who We Partner With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                Established operators across our master markets—including Defense &amp; Aerospace, Energy &amp; Infrastructure, Private Equity, and MedTech—who have the capacity to take on new, high-ticket contracts and can move quickly when an introduction is made.
                            </p>
                        </div>
                        <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500 mb-2">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">Who We Do Not Work With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                Startups without proven delivery capabilities, companies looking for cheap volume over high-quality connections, or teams with slow, bureaucratic sales cycles.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* 5. Bottom Conversion Card */}
                <div className="p-8 sm:p-12 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Direct Principal Systems Pairing</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-xl mx-auto">
                        Ready to plug your capacity into a live demand stream?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        We only open two priority partner slots each quarter to ensure total focus on our active engagements. Speak directly with our Principal Architect via WhatsApp.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
