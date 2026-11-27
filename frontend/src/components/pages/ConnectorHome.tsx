import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, ArrowUpRight, Menu, X, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/LOGO_EMBLEM.png'
import AgentIntro from '../sections/AgentIntro'
import FeatureExplorer from '../sections/FeatureExplorer'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const heroSpring = {
    type: 'spring' as const,
    stiffness: 220,
    damping: 28,
    mass: 0.9,
}

const connectorFaqs = [
    {
        q: 'How does the Elesium Connector Model qualify buyers and suppliers?',
        a: 'Elesium verifies active enterprise budgets, technical delivery capacity, and compliance readiness before making a direct introduction, eliminating cold outreach and unqualified vendor lists.',
    },
    {
        q: 'Which enterprise sectors does Elesium Connector cover?',
        a: 'We broker qualified B2B introductions across enterprise AI systems, industrial supply chains, precision manufacturing, BFSI infrastructure, and cross-border commercial procurement.',
    },
    {
        q: 'How do buyers or suppliers start an introduction mandate?',
        a: 'Share your technical requirements, budget range, and delivery timeline via WhatsApp or connect@elesium.online to initiate direct qualification with our Bengaluru desk.',
    },
]

export default function ConnectorHome() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const connectorSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': 'https://elesium.online/connector/#service',
                name: 'Elesium Connector Model',
                serviceType: 'Qualified B2B Enterprise Partner Introductions & Deal Flow',
                url: 'https://elesium.online/connector/',
                description:
                    'Find the right partners faster with context, qualification, and trust. Elesium Connector connects verified enterprise buyers and suppliers directly.',
                provider: {
                    '@id': 'https://elesium.online/#organization',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/connector/#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Portal', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'Connector Model', item: 'https://elesium.online/connector/' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/connector/#faq',
                mainEntity: connectorFaqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.a,
                    },
                })),
            },
        ],
    }

    useEffect(() => {
        if (!mobileOpen) return
        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setMobileOpen(false)
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [mobileOpen])

    return (
        <div className="dark min-h-[100dvh] bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-clip">
            <WhatsAppModal />
            <Helmet>
                <title>Elesium Connector Model | Direct B2B Introductions &amp; Deal Flow</title>
                <meta
                    name="description"
                    content="Find the right partners faster with context, qualification, and trust. Elesium Connector connects verified enterprise buyers and suppliers directly."
                />
                <link rel="canonical" href="https://elesium.online/connector/" />
                <meta name="robots" content="index, follow" />
                <script type="application/ld+json">{JSON.stringify(connectorSchema)}</script>
            </Helmet>

            {/* Symmetrical 3-Column Monochrome Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full grid grid-cols-2 md:grid-cols-[1fr_auto_1fr] items-center">
                    {/* Left: Emblem */}
                    <div className="flex items-center justify-self-start">
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 active:scale-[0.97] transition"
                            aria-label="Return to Elesium Portal"
                        >
                            <img
                                src={logo}
                                alt="Elesium"
                                width="28"
                                height="28"
                                loading="eager"
                                fetchPriority="high"
                                className="h-7 w-7 object-contain"
                            />
                        </Link>
                    </div>

                    {/* Center: Mathematically Centered Section Links */}
                    <nav className="hidden md:flex items-center justify-center gap-1.5 justify-self-center text-xs font-medium text-neutral-400">
                        <a
                            href="#model"
                            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Model
                        </a>
                        <a
                            href="#platform"
                            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Process
                        </a>
                        <a
                            href="#engage"
                            className="px-4 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Connect
                        </a>
                    </nav>

                    {/* Right: Cross-Site Controls */}
                    <div className="hidden md:flex items-center justify-end gap-1.5 justify-self-end">
                        <Link
                            to="/ai/"
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-neutral-200 hover:text-black hover:bg-white transition active:scale-[0.97]"
                        >
                            <span>AI &amp; Automation</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            to="/portfolio/"
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Portfolio
                        </Link>
                        <Link
                            to="/"
                            className="px-3.5 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Portal
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden justify-self-end">
                        <button
                            type="button"
                            onClick={() => setMobileOpen(prev => !prev)}
                            aria-label="Toggle connector menu"
                            aria-expanded={mobileOpen}
                            aria-controls="connector-mobile-drawer"
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-neutral-300 hover:text-white hover:bg-white/10 active:scale-[0.97] transition"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Drawer */}
                <AnimatePresence>
                    {mobileOpen && (
                        <motion.div
                            id="connector-mobile-drawer"
                            initial={{ opacity: 0, scale: 0.97, y: -6 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: -6 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 30, mass: 0.8 }}
                            className="md:hidden origin-top bg-black/95 backdrop-blur-xl border-b border-white/10 rounded-b-[28px] px-6 py-6 flex flex-col gap-1.5 relative z-50"
                        >
                            <a
                                href="#model"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                Model
                            </a>
                            <a
                                href="#platform"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                Process
                            </a>
                            <a
                                href="#engage"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                Connect
                            </a>
                            <div className="my-2 h-px bg-white/10" />
                            <Link
                                to="/ai/"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] px-4 py-2.5 rounded-full border border-white/15 text-sm text-white flex items-center justify-between hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                <span>AI &amp; Automation</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/portfolio/"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm text-neutral-300 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                Portfolio
                            </Link>
                            <Link
                                to="/"
                                onClick={() => setMobileOpen(false)}
                                className="min-h-[44px] flex items-center px-4 py-2.5 rounded-full text-sm text-neutral-400 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                            >
                                Portal
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        aria-hidden="true"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="fixed inset-0 top-14 z-40 bg-black/60 md:hidden"
                    />
                )}
            </AnimatePresence>

            <main>
                {/* Symmetrical Calm-Luxury Connector Hero */}
                <section className="relative overflow-hidden min-h-[calc(100svh-56px)] mt-[56px] flex items-center justify-center px-6 bg-black">
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 50% 42%, rgba(255,255,255,0.08) 0%, transparent 58%), radial-gradient(rgba(255,255,255,0.12) 1px, transparent 1px)',
                            backgroundSize: '100% 100%, 32px 32px',
                        }}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 14 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={heroSpring}
                        className="relative z-10 max-w-3xl mx-auto text-center py-16 md:py-24"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-[-0.03em] text-white leading-[1.08] mb-6">
                            Connecting you with your buyers
                        </h1>

                        <p className="text-base sm:text-lg font-light text-neutral-400 max-w-xl mx-auto leading-relaxed mb-11">
                            Find the right partners faster with context, qualification, and trust.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <a
                                href="#model"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 font-medium text-sm transition duration-200 active:scale-[0.97]"
                            >
                                <span>See how it works</span>
                                <ArrowRight className="w-4 h-4" />
                            </a>
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-white/20 text-white hover:bg-white hover:text-black font-medium text-sm transition duration-200 active:scale-[0.97]"
                            >
                                <span>Talk to us</span>
                            </button>
                        </div>
                    </motion.div>
                </section>

                {/* Scroll Section 1: Supply -> Elesium <- Demand */}
                <div id="model" className="scroll-mt-16 border-t border-white/10">
                    <AgentIntro />
                </div>

                {/* Scroll Section 2: 5-Step Sticky Explorer */}
                <div className="border-t border-white/10">
                    <FeatureExplorer />
                </div>

                {/* Symmetrical Buyer & Supplier Cards */}
                <section id="engage" className="scroll-mt-16 py-24 md:py-32 px-6 bg-black border-t border-white/10">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <p className="text-[11px] font-mono uppercase tracking-[0.24em] text-neutral-500 mb-4">
                                Get Started
                            </p>
                            <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.025em] text-white">
                                Two sides of every introduction
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {/* Left: For Buyers */}
                            <div className="bg-neutral-950/90 rounded-[32px] border border-white/12 p-8 md:p-12 flex flex-col justify-between transition-colors duration-300 hover:border-white/25">
                                <div>
                                    <span className="block text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-4">
                                        Demand
                                    </span>
                                    <h3 className="text-2xl font-medium text-white tracking-[-0.02em] mb-4">
                                        For Buyers
                                    </h3>
                                    <p className="text-sm font-light text-neutral-400 leading-relaxed mb-9">
                                        We don&apos;t push random agencies or lists. Tell us what you need, your requirements, and your timeline - we check who can actually deliver it and introduce you only when the fit is clear.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={openWhatsApp}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-medium transition duration-200 active:scale-[0.97]"
                                    >
                                        <span>Talk to us</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="mailto:connect@elesium.online?subject=Buyer%20Inquiry%20-%20Elesium%20Connector"
                                        className="flex-1 inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/15 text-white hover:bg-white/10 text-sm font-medium transition duration-200 active:scale-[0.97]"
                                    >
                                        Email us
                                    </a>
                                </div>
                            </div>

                            {/* Right: For Suppliers */}
                            <div className="bg-neutral-950/90 rounded-[32px] border border-white/12 p-8 md:p-12 flex flex-col justify-between transition-colors duration-300 hover:border-white/25">
                                <div>
                                    <span className="block text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-4">
                                        Supply
                                    </span>
                                    <h3 className="text-2xl font-medium text-white tracking-[-0.02em] mb-4">
                                        For Suppliers
                                    </h3>
                                    <p className="text-sm font-light text-neutral-400 leading-relaxed mb-9">
                                        Access beats cold outreach. Share what you deliver best and who you are strongest with - we connect you directly with buyers holding active budgets and clear projects.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        type="button"
                                        onClick={openWhatsApp}
                                        className="flex-1 inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-black hover:bg-neutral-200 text-sm font-medium transition duration-200 active:scale-[0.97]"
                                    >
                                        <span>Apply to connect</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                    <a
                                        href="mailto:connect@elesium.online?subject=Supplier%20Application%20-%20Elesium%20Connector"
                                        className="flex-1 inline-flex items-center justify-center px-7 py-3.5 rounded-full border border-white/15 text-white hover:bg-white/10 text-sm font-medium transition duration-200 active:scale-[0.97]"
                                    >
                                        Email us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Direct-Answer Q&A */}
                <section className="py-20 px-6 bg-black border-t border-white/10">
                    <div className="max-w-3xl mx-auto">
                        <div className="text-center mb-10">
                            <p className="inline-flex items-center px-4 py-1.5 rounded-[18px] border border-white/12 bg-white/[0.03] text-[11px] font-mono uppercase tracking-[0.28em] text-neutral-400 mb-4">
                                Direct Answers
                            </p>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-white">
                                Frequently Asked Questions
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {connectorFaqs.map((faq, idx) => {
                                const isOpen = openFaq === idx
                                return (
                                    <div
                                        key={faq.q}
                                        className="rounded-[24px] border border-white/12 bg-neutral-950/90 overflow-hidden"
                                    >
                                        <h3 className="m-0">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={`connector-faq-panel-${idx}`}
                                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                className="w-full min-h-[44px] flex items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-medium text-white hover:bg-white/[0.03] transition-colors"
                                            >
                                                <span>{faq.q}</span>
                                                <ChevronDown className={`w-4 h-4 text-neutral-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
                                            </button>
                                        </h3>
                                        <div
                                            id={`connector-faq-panel-${idx}`}
                                            aria-hidden={!isOpen}
                                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="px-5 pb-5 pt-3 border-t border-white/10 text-sm font-light text-neutral-300 leading-relaxed">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Monochrome Connector Footer */}
            <footer className="py-10 px-6 border-t border-white/10 bg-black">
                <div className="max-w-[1440px] mx-auto px-0 md:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <p>Elesium Digital Systems Private Limited &bull; Bengaluru</p>
                    <div className="flex items-center gap-2">
                        <Link
                            to="/"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Portal
                        </Link>
                        <Link
                            to="/portfolio/"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Portfolio
                        </Link>
                        <Link
                            to="/ai/"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            AI &amp; Automation
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
