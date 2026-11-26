import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import emblem from '../../assets/LOGO_EMBLEM.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.06,
            delayChildren: 0.04,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring' as const,
            stiffness: 280,
            damping: 26,
        },
    },
}

const systemsBuilt = [
    {
        name: 'Ele-in (ele-in.com)',
        summary: 'Controlled outbound & LinkedIn workflow software built with conditional steps, human approval gates, and isolated client workspaces.',
        stack: 'Playwright · HubSpot · Apollo · GoHighLevel',
    },
    {
        name: 'Omnichannel Inbound System',
        summary: 'Unifies WhatsApp, SMS, Instagram, live chat, and email into SQL + CRM, qualifies intent, replies per channel, and automates follow-ups.',
        stack: 'n8n · Voiceflow · GoHighLevel · SQL',
    },
    {
        name: 'AI Receptionist & Booking Agent',
        summary: 'Handles inbound calls, checks availability, books or reschedules meetings live, and logs structured call metrics into CRM.',
        stack: 'Vapi · Twilio · n8n · Airtable',
    },
    {
        name: 'Automated Onboarding & WhatsApp Desk',
        summary: 'Generates invoices, provisions CRM workspaces, sets up dedicated WhatsApp groups, and invites team members when payment clears.',
        stack: 'n8n · WhatsApp Business · GoHighLevel · Razorpay',
    },
    {
        name: 'Hiring & CV Screening Pipeline',
        summary: 'Extracts PDF resumes, scores fit against job criteria, generates tailored questionnaires, and schedules interviewer slots automatically.',
        stack: 'n8n · OpenAI · Airtable · Google Calendar',
    },
    {
        name: 'VSL & Ad Research Loop',
        summary: 'Researches customer insights, drafts scripts, monitors live Meta Ads performance, and transcribes winning video ads for next iterations.',
        stack: 'n8n · Meta Graph API · Whisper · Perplexity',
    },
    {
        name: 'Local SEO Publishing Engine',
        summary: 'Researches local markets, writes long-form guides, formats docs for review, and auto-publishes pages—achieving #1 local rankings.',
        stack: 'n8n · Perplexity · Google Sheets · Docs',
    },
    {
        name: 'LinkedIn Content & Lead Systems',
        summary: 'Drafts research-backed posts held for approval, filters engagement by intent, enriches profiles, and writes tailored outreach scripts.',
        stack: 'n8n · Claude · Gemini · Apify · Airtable',
    },
]

export default function Portfolio() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openSystem, setOpenSystem] = useState<string | null>(systemsBuilt[0].name)

    const portfolioSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': 'https://elesium.online/authors/chaman-shah#person',
                name: 'Chaman Shah',
                givenName: 'Chaman',
                familyName: 'Shah',
                jobTitle: 'Founder, Elesium',
                image: 'https://elesium.online/chaman-shah.png',
                url: 'https://elesium.online/portfolio/',
                email: 'contact@elesium.online',
                worksFor: {
                    '@id': 'https://elesium.online/#organization',
                },
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Bengaluru',
                    addressRegion: 'Karnataka',
                    addressCountry: 'IN',
                },
                sameAs: [
                    'https://github.com/655Chaman',
                    'https://linkedin.com/in/chaman-shah-elesium',
                    'https://x.com/chamanshah_ai',
                    'https://elesium.online/authors/chaman-shah/',
                ],
                description:
                    'Chaman Shah is the Founder of Elesium, connecting enterprise buyers and suppliers and building automated business systems in Bengaluru.',
            },
            {
                '@type': ['ProfilePage', 'WebPage'],
                '@id': 'https://elesium.online/portfolio/#webpage',
                url: 'https://elesium.online/portfolio/',
                name: 'Chaman Shah — Portfolio | Elesium',
                description: 'Portfolio of Chaman Shah, Founder of Elesium. Production automation builds and direct business ventures.',
                isPartOf: { '@id': 'https://elesium.online/#website' },
                mainEntity: { '@id': 'https://elesium.online/authors/chaman-shah#person' },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/portfolio/#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Portal', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'Portfolio', item: 'https://elesium.online/portfolio/' },
                ],
            },
        ],
    }

    return (
        <div className="dark min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-clip">
            <WhatsAppModal />

            <Helmet>
                <title>Chaman Shah — Portfolio | Elesium</title>
                <meta
                    name="description"
                    content="Chaman Shah, Founder of Elesium. Production automation systems built and direct partner ventures."
                />
                <link rel="canonical" href="https://elesium.online/portfolio/" />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content="Chaman Shah — Portfolio | Elesium" />
                <meta property="og:description" content="Founder of Elesium. Systems built and direct links." />
                <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
                <meta property="og:url" content="https://elesium.online/portfolio/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Chaman Shah — Portfolio | Elesium" />
                <meta name="twitter:image" content="https://elesium.online/chaman-shah.png" />
                <script type="application/ld+json">{JSON.stringify(portfolioSchema)}</script>
            </Helmet>

            {/* Minimal Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-2xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center p-1.5 rounded-full hover:bg-white/10 transition active:scale-[0.97]"
                        aria-label="Return to Elesium Portal"
                    >
                        <img src={emblem} alt="Elesium" width="24" height="24" className="h-6 w-6 object-contain" />
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition active:scale-[0.97]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back</span>
                    </Link>
                </div>
            </header>

            {/* Centered Clean Typography Portfolio */}
            <motion.main
                id="main-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="flex-1 w-full max-w-2xl mx-auto px-6 pt-28 pb-20 flex flex-col justify-center"
            >
                <motion.div variants={itemVariants} className="mb-8">
                    <img
                        src="/chaman-shah.png"
                        alt="Chaman Shah"
                        width="80"
                        height="80"
                        className="h-20 w-20 rounded-full object-cover border border-white/15 grayscale"
                    />
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-white mb-2"
                >
                    Chaman Shah
                </motion.h1>

                <motion.p variants={itemVariants} className="text-sm text-neutral-400 mb-8">
                    Founder, Elesium &middot; Bengaluru
                </motion.p>

                <motion.p
                    variants={itemVariants}
                    className="answer-capsule text-base sm:text-lg font-light text-neutral-300 leading-relaxed mb-10 max-w-xl"
                >
                    I connect businesses directly with the right partners and build practical automation systems—handling inbound leads, voice booking, hiring, onboarding, and growth workflows end to end.
                </motion.p>

                {/* Direct Contact Links */}
                <motion.div
                    variants={itemVariants}
                    className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm pb-10 border-b border-white/10"
                >
                    <a
                        href="https://github.com/655Chaman"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-white/25 hover:decoration-white transition"
                    >
                        GitHub
                    </a>
                    <a
                        href="https://linkedin.com/in/chaman-shah-elesium"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-white/25 hover:decoration-white transition"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://x.com/chamanshah_ai"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-white/25 hover:decoration-white transition"
                    >
                        X
                    </a>
                    <a
                        href="mailto:contact@elesium.online"
                        className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-white/25 hover:decoration-white transition"
                    >
                        Email
                    </a>
                    <button
                        type="button"
                        onClick={openWhatsApp}
                        className="text-white hover:text-neutral-300 underline underline-offset-4 decoration-white/25 hover:decoration-white transition"
                    >
                        WhatsApp
                    </button>
                </motion.div>

                {/* Minimal Text List of Real Systems Built */}
                <motion.section variants={itemVariants} className="py-10 border-b border-white/10">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-5">
                        Systems Built
                    </p>
                    <div className="divide-y divide-white/10">
                        {systemsBuilt.map((sys) => {
                            const isOpen = openSystem === sys.name
                            return (
                                <div key={sys.name} className="py-3.5">
                                    <button
                                        type="button"
                                        onClick={() => setOpenSystem(isOpen ? null : sys.name)}
                                        className="w-full flex items-center justify-between gap-4 text-left group"
                                    >
                                        <span className="text-sm sm:text-base font-medium text-white group-hover:text-neutral-300 transition-colors">
                                            {sys.name}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-white' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                                className="accordion-panel overflow-hidden"
                                            >
                                                <div className="pt-2.5 space-y-1.5">
                                                    <p className="text-sm text-neutral-400 leading-relaxed">
                                                        {sys.summary}
                                                    </p>
                                                    <p className="text-xs font-mono text-neutral-500">
                                                        {sys.stack}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                </motion.section>

                {/* Minimal Text Work Links */}
                <motion.div variants={itemVariants} className="pt-10 space-y-4">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                        Elesium
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            to="/connector/"
                            className="inline-flex items-center justify-between py-2 text-base text-neutral-200 hover:text-white transition group"
                        >
                            <span>Elesium Connector Model</span>
                            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
                        </Link>

                        <Link
                            to="/ai/"
                            className="inline-flex items-center justify-between py-2 text-base text-neutral-200 hover:text-white transition group"
                        >
                            <span>AI &amp; Automation Elesium</span>
                            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
                        </Link>
                    </div>
                </motion.div>
            </motion.main>

            <footer className="py-8 px-6 border-t border-white/10">
                <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-neutral-500">
                    <span>Chaman Shah</span>
                    <span>elesium.online</span>
                </div>
            </footer>
        </div>
    )
}
