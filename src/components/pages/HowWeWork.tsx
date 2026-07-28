import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'

export default function HowWeWork() {
    const navigate = useNavigate()

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
            className="fixed inset-0 z-50 bg-[#FAFAFA] dark:bg-[#050505] overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            data-lenis-prevent
        >
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

                    <div className="hidden md:block text-[11px] font-medium tracking-[0.06em] text-gray-400 dark:text-gray-600 uppercase">
                        Process Architecture
                    </div>
                </div>

                {/* 1. Above the Fold: The Core Philosophy */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="mb-24 md:mb-32 max-w-3xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white mb-8 leading-[1.1]">
                        Less Friction.<br />More Dealflow.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10 font-normal">
                        We don't sell software, and we don't make you log into a complex dashboard. We act as your outsourced strategic matchmaking partner—using advanced data systems to find your exact buyers and putting you directly in touch with them.
                    </p>
                    <ExpandableScreen>
                        <ExpandableScreenTrigger>
                            <InteractiveHoverButton className="h-12 px-6 text-sm">
                                Apply for a Partnership Slot
                            </InteractiveHoverButton>
                        </ExpandableScreenTrigger>
                        <ExpandableScreenContent>
                            <MandateApplicationForm />
                        </ExpandableScreenContent>
                    </ExpandableScreen>
                </motion.div>

                {/* 2. The 3-Step Engine */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 md:mb-32"
                >
                    <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">The 3-Step Engine</h2>
                    </div>

                    <div className="space-y-8 md:space-y-12">
                        {steps.map((step) => (
                            <div key={step.number} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-start border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.02] p-8 md:p-10 rounded-2xl">
                                <div className="md:col-span-4 flex flex-col gap-2">
                                    <span className="text-sm font-semibold tracking-widest text-blue-600 dark:text-blue-500 uppercase">Phase {step.number}</span>
                                    <h3 className="text-2xl font-bold text-black dark:text-white">{step.title}</h3>
                                </div>
                                <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">What We Do (The Infrastructure)</h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">{step.weDo}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">What You Do (The Outcome)</h4>
                                        <p className="text-black dark:text-white font-medium leading-relaxed text-[15px]">{step.youDo}</p>
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
                    className="mb-24 md:mb-32"
                >
                    <div className="mb-12 border-b border-gray-200 dark:border-white/10 pb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white">Why This Architecture Works</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Incentivized by Outcomes</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">We are not a passive directory where you pay a monthly fee to stare at a blank screen. We only succeed when we connect you to high-value demand.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Engineering Velocities</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">We know that a single bad connection wastes weeks of engineering time. Our system prioritizes precision and verified capacity over raw volume.</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-black dark:text-white mb-4">Zero Overhead</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[15px]">You don't need to hire an internal sales development team or buy expensive data scraping tools. You hook directly into our existing outbound infrastructure on day one.</p>
                        </div>
                    </div>
                </motion.div>

                {/* 4. The Counterparty Filter */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 md:mb-32 bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-3xl p-8 md:p-16"
                >
                    <div className="mb-10 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4">The Counterparty Filter</h2>
                        <p className="text-gray-500 dark:text-gray-400">We maintain strict qualification standards to ensure total alignment.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6">
                                <CheckCircle2 className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Who We Partner With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
                                Established operators across our master markets—including Defense & Aerospace, Energy & Infrastructure, Private Equity, and MedTech—who have the capacity to take on new, high-ticket contracts and can move quickly when an introduction is made.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-6">
                                <XCircle className="w-6 h-6" />
                                <h3 className="text-xl font-bold">Who We Do Not Work With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-[15px]">
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
                    className="text-center py-20 border-t border-gray-200 dark:border-white/10"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-white mb-6 tracking-tight">
                        Ready to plug your capacity<br />into a live demand stream?
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        We only open two priority partner slots each quarter to ensure total focus on our active engagements. Apply today to see if your capabilities match our current market signals.
                    </p>
                    
                    <div className="flex justify-center">
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton className="h-14 px-8 text-base">
                                    Submit Your Capabilities Application
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <MandateApplicationForm />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
