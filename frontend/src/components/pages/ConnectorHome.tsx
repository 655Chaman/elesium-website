import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/LOGO_EMBLEM.png'
import AgentIntro from '../sections/AgentIntro'
import FeatureExplorer from '../sections/FeatureExplorer'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function ConnectorHome() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
            <WhatsAppModal />
            <Helmet>
                <title>Elesium Connector Model | Direct B2B Pipeline &amp; Partner Matching</title>
                <meta
                    name="description"
                    content="Find the right partners faster with context, qualification, and trust. Elesium Connector Model connects verified enterprise buyers and suppliers directly."
                />
                <link rel="canonical" href="https://elesium.online/connector/" />
                <meta name="robots" content="index, follow" />
            </Helmet>

            {/* Minimal Monochrome Connector Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 active:scale-[0.97] transition-transform"
                        aria-label="Return to Elesium Gateway"
                    >
                        <img
                            src={logo}
                            alt="Elesium"
                            width="32"
                            height="32"
                            loading="eager"
                            fetchPriority="high"
                            className="h-7 w-7 object-contain"
                        />
                    </Link>

                    {/* Desktop Center Links */}
                    <nav className="hidden md:flex items-center gap-2 text-xs font-medium text-neutral-400">
                        <a
                            href="#model"
                            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Model
                        </a>
                        <a
                            href="#platform"
                            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Architecture
                        </a>
                        <a
                            href="#engage"
                            className="px-3 py-1.5 rounded-md hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Engage
                        </a>
                    </nav>

                    {/* Desktop Right Switcher */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/ai/"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/15 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            <span>AI &amp; Automation</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            to="/"
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Portal
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen(prev => !prev)}
                        aria-label="Toggle connector navigation"
                        className="md:hidden p-2 rounded-md text-neutral-300 hover:text-white hover:bg-white/10 active:scale-[0.97] transition"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
                            className="md:hidden origin-top bg-black border-b border-white/10 px-6 py-5 flex flex-col gap-3"
                        >
                            <a
                                href="#model"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-neutral-300 hover:text-white border-b border-white/10"
                            >
                                Model
                            </a>
                            <a
                                href="#platform"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-neutral-300 hover:text-white border-b border-white/10"
                            >
                                Architecture
                            </a>
                            <a
                                href="#engage"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-neutral-300 hover:text-white border-b border-white/10"
                            >
                                Engage
                            </a>
                            <Link
                                to="/ai/"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-white flex items-center justify-between border-b border-white/10"
                            >
                                <span>AI &amp; Automation</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-neutral-400 hover:text-white"
                            >
                                Portal
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main>
                {/* Clean Minimal Connector Hero */}
                <section className="min-h-[calc(100svh-56px)] pt-[56px] flex items-center justify-center px-6 bg-black">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="max-w-3xl mx-auto text-center py-20"
                    >
                        <p className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em] text-neutral-500 mb-6">
                            Elesium Connector Model
                        </p>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.08] mb-6">
                            Connecting you with your buyers
                        </h1>

                        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mb-10">
                            Find the right partners faster with context, qualification, and trust.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <a
                                href="#model"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md bg-white text-black hover:bg-neutral-200 font-medium text-sm transition active:scale-[0.97]"
                            >
                                <span>Explore</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-md border border-white/20 text-white hover:bg-white hover:text-black font-medium text-sm transition active:scale-[0.97]"
                            >
                                <span>Initiate Brief</span>
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Scroll Section 1: Supply -> Elesium -> Demand */}
                <div id="model" className="border-t border-white/10">
                    <AgentIntro />
                </div>

                {/* Scroll Section 2: 5-Slide Feature Explorer */}
                <div className="border-t border-white/10">
                    <FeatureExplorer />
                </div>

                {/* Symmetrical Dual Engagement Grid */}
                <section id="engage" className="py-24 md:py-32 px-6 bg-black border-t border-white/10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-14">
                            <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-500 mb-3">
                                Direct Engagement
                            </p>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white">
                                Two sides of a qualified introduction
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left: For Buyers */}
                            <div
                                className="bg-black rounded-lg p-8 md:p-10 flex flex-col justify-between"
                                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                                <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-3">
                                        Demand
                                    </p>
                                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-4">
                                        For Buyers
                                    </h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                                        Share your technical mandate, compliance scope, and timeline. We pre-vet capability and deliver direct introductions to principals ready to execute.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={openWhatsApp}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white text-black hover:bg-neutral-200 text-sm font-medium transition active:scale-[0.97]"
                                    >
                                        <span>Initiate Brief</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="mailto:connect@elesium.online?subject=Buyer%20Mandate%20-%20Elesium%20Connector"
                                        className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 text-white hover:bg-white/10 text-sm font-medium transition active:scale-[0.97]"
                                    >
                                        Email Mandate
                                    </a>
                                </div>
                            </div>

                            {/* Right: For Suppliers */}
                            <div
                                className="bg-black rounded-lg p-8 md:p-10 flex flex-col justify-between"
                                style={{ border: '1px solid rgba(255,255,255,0.12)' }}
                            >
                                <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-3">
                                        Supply
                                    </p>
                                    <h3 className="text-2xl font-semibold text-white tracking-tight mb-4">
                                        For Suppliers
                                    </h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed mb-8">
                                        Present your delivery track record and domain focus. Connect directly with qualified buyers holding active budgets and clear evaluation criteria.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={openWhatsApp}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-white text-black hover:bg-neutral-200 text-sm font-medium transition active:scale-[0.97]"
                                    >
                                        <span>Submit Profile</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="mailto:connect@elesium.online?subject=Supplier%20Profile%20-%20Elesium%20Connector"
                                        className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-md border border-white/15 text-white hover:bg-white/10 text-sm font-medium transition active:scale-[0.97]"
                                    >
                                        Email Portfolio
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Monochrome Connector Footer */}
            <footer className="py-10 px-6 border-t border-white/10 bg-black">
                <div className="max-w-[1440px] mx-auto px-0 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <p>Elesium Digital Systems Private Limited &bull; Bengaluru</p>
                    <div className="flex items-center gap-6">
                        <Link to="/" className="hover:text-white transition">
                            Portal
                        </Link>
                        <Link to="/ai/" className="hover:text-white transition inline-flex items-center gap-1">
                            <span>AI &amp; Automation</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
