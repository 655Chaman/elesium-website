import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowUpRight, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import emblem from '../../assets/LOGO_EMBLEM.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { diaryEntries, type DiaryCategory } from '../../data/diaryEntries'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.03,
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

const filterTabs: Array<{ label: string; value: 'All' | DiaryCategory }> = [
    { label: 'All', value: 'All' },
    { label: 'Essays', value: 'Essays' },
    { label: 'Mind Dumps', value: 'Mind Dumps' },
    { label: 'Book', value: 'The Humane Experience' },
    { label: 'Elesium', value: 'Elesium' },
]

const bookChapters = diaryEntries.filter((e) => e.category === 'The Humane Experience')
const nonBookEntries = diaryEntries.filter((e) => e.category !== 'The Humane Experience')

export default function Portfolio() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openSystem, setOpenSystem] = useState<string | null>(null)
    const [activeCategory, setActiveCategory] = useState<'All' | DiaryCategory>('All')
    const [showAllNotes, setShowAllNotes] = useState(false)

    const filteredEntries =
        activeCategory === 'All'
            ? nonBookEntries
            : diaryEntries.filter((entry) => entry.category === activeCategory)

    const visibleEntries =
        activeCategory === 'All' && !showAllNotes ? filteredEntries.slice(0, 8) : filteredEntries

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
                description: 'Portfolio of Chaman Shah, Founder of Elesium. Production automation builds, essays, and mind dumps.',
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
        <div className="dark relative min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-clip">
            <WhatsAppModal />

            {/* Subtle Monochrome Top Ambient Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(255,255,255,0.06),transparent)]"
            />

            <Helmet>
                <title>Chaman Shah — Portfolio | Elesium</title>
                <meta
                    name="description"
                    content="Chaman Shah, Founder of Elesium. Essays, mind dumps, and production automation systems."
                />
                <link rel="canonical" href="https://elesium.online/portfolio/" />
                <meta name="robots" content="index, follow" />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content="Chaman Shah — Portfolio | Elesium" />
                <meta property="og:description" content="Founder of Elesium. Essays, mind dumps, and systems built." />
                <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
                <meta property="og:url" content="https://elesium.online/portfolio/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Chaman Shah — Portfolio | Elesium" />
                <meta name="twitter:image" content="https://elesium.online/chaman-shah.png" />
                <script type="application/ld+json">{JSON.stringify(portfolioSchema)}</script>
            </Helmet>

            {/* Minimal Top Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-black/85 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-between">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2.5 py-1 pr-2 rounded-full hover:opacity-80 transition active:scale-[0.97]"
                        aria-label="Return to Elesium Portal"
                    >
                        <img src={emblem} alt="Elesium" width="22" height="22" className="h-5.5 w-5.5 object-contain" />
                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">Elesium</span>
                    </Link>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition active:scale-[0.97]"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Portal</span>
                    </Link>
                </div>
            </header>

            <motion.main
                id="main-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-6 pt-28 pb-24"
            >
                {/* Editorial Identity Header */}
                <motion.section variants={itemVariants} className="pb-12 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-7">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-2xl border border-white/15 bg-white/[0.03] p-2 flex items-center justify-center shrink-0">
                                <img
                                    src="/chaman-shah.png"
                                    alt="Chaman Shah"
                                    width="48"
                                    height="48"
                                    className="h-full w-full rounded-xl object-cover grayscale"
                                />
                            </div>
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] text-white">
                                    Chaman Shah
                                </h1>
                                <p className="text-sm text-neutral-400 mt-1">
                                    Founder, Elesium &middot; Bengaluru
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <a
                                href="https://github.com/655Chaman"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-mono text-neutral-300 border border-white/15 rounded-full hover:border-white/40 hover:text-white transition active:scale-[0.97]"
                            >
                                GitHub
                            </a>
                            <a
                                href="https://linkedin.com/in/chaman-shah-elesium"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-mono text-neutral-300 border border-white/15 rounded-full hover:border-white/40 hover:text-white transition active:scale-[0.97]"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="https://x.com/chamanshah_ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 text-xs font-mono text-neutral-300 border border-white/15 rounded-full hover:border-white/40 hover:text-white transition active:scale-[0.97]"
                            >
                                X
                            </a>
                            <a
                                href="mailto:contact@elesium.online"
                                className="px-3 py-1.5 text-xs font-mono text-neutral-300 border border-white/15 rounded-full hover:border-white/40 hover:text-white transition active:scale-[0.97]"
                            >
                                Email
                            </a>
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                className="px-3 py-1.5 text-xs font-mono text-black bg-white rounded-full hover:bg-neutral-200 transition active:scale-[0.97]"
                            >
                                WhatsApp
                            </button>
                        </div>
                    </div>

                    <p className="answer-capsule text-base sm:text-lg font-light text-neutral-300 leading-relaxed max-w-2xl">
                        I connect businesses directly with the right partners and build practical automation systems—handling inbound leads, voice booking, hiring, onboarding, and growth workflows end to end.
                    </p>
                </motion.section>

                {/* Featured Series: The Humane Experience */}
                <motion.section variants={itemVariants} className="py-12 border-b border-white/10">
                    <div className="flex items-baseline justify-between gap-4 mb-6">
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                                Featured Book Draft
                            </p>
                            <h2 className="text-xl font-medium tracking-[-0.02em] text-white mt-1">
                                The Humane Experience
                            </h2>
                        </div>
                        <span className="text-xs font-mono text-neutral-500">4 Parts</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {bookChapters.map((chapter, idx) => (
                            <Link
                                key={chapter.slug}
                                to={`/portfolio/${chapter.slug}/`}
                                className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-5 transition-all duration-200 active:scale-[0.99] flex flex-col justify-between gap-4"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-3">
                                        <span>0{idx}</span>
                                        <span className="inline-flex items-center gap-1.5 group-hover:text-white transition-colors">
                                            <span>{chapter.readTime}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                    <h3 className="text-base font-medium text-white tracking-[-0.01em] mb-2">
                                        {chapter.title.replace('The Humane Experience — ', '')}
                                    </h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 font-light">
                                        {chapter.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </motion.section>

                {/* Writing & Mind Dumps */}
                <motion.section variants={itemVariants} className="py-12 border-b border-white/10">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                        <div>
                            <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                                From My Diary
                            </p>
                            <h2 className="text-xl font-medium tracking-[-0.02em] text-white mt-1">
                                Essays &amp; Mind Dumps
                            </h2>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {filterTabs.map((tab) => {
                                const active = activeCategory === tab.value
                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => {
                                            setActiveCategory(tab.value)
                                            setShowAllNotes(false)
                                        }}
                                        className={`px-3 py-1.5 text-xs font-mono rounded-full border transition active:scale-[0.97] whitespace-nowrap ${
                                            active
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-neutral-400 border-white/15 hover:border-white/35 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {visibleEntries.map((entry) => (
                            <Link
                                key={entry.slug}
                                to={`/portfolio/${entry.slug}/`}
                                className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-5 transition-all duration-200 active:scale-[0.99] flex flex-col justify-between gap-3"
                            >
                                <div>
                                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 mb-2.5">
                                        <span>{entry.category}</span>
                                        <span className="inline-flex items-center gap-1.5 group-hover:text-white transition-colors">
                                            <span>{entry.readTime}</span>
                                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                        </span>
                                    </div>
                                    <h3 className="text-base font-medium text-white tracking-[-0.01em] mb-1.5">
                                        {entry.title}
                                    </h3>
                                    <p className="text-sm text-neutral-400 leading-relaxed line-clamp-2 font-light">
                                        {entry.excerpt}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {activeCategory === 'All' && filteredEntries.length > 8 && (
                        <div className="mt-6 flex justify-center">
                            <button
                                type="button"
                                onClick={() => setShowAllNotes((prev) => !prev)}
                                className="px-5 py-2 text-xs font-mono text-neutral-300 border border-white/15 rounded-full hover:border-white/40 hover:text-white transition active:scale-[0.97]"
                            >
                                {showAllNotes
                                    ? 'Show fewer notes'
                                    : `Show all ${filteredEntries.length} essays & mind dumps`}
                            </button>
                        </div>
                    )}
                </motion.section>

                {/* Systems Built */}
                <motion.section variants={itemVariants} className="py-12 border-b border-white/10">
                    <div className="mb-6">
                        <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500">
                            Production Work
                        </p>
                        <h2 className="text-xl font-medium tracking-[-0.02em] text-white mt-1">
                            Systems Built
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                        {systemsBuilt.map((sys) => {
                            const isOpen = openSystem === sys.name
                            return (
                                <div
                                    key={sys.name}
                                    className="rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-4 transition-colors hover:border-white/25"
                                >
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
                                                <div className="pt-3 space-y-2">
                                                    <p className="text-sm text-neutral-400 leading-relaxed font-light">
                                                        {sys.summary}
                                                    </p>
                                                    <p className="text-[11px] font-mono text-neutral-500">
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

                {/* Elesium Divisions */}
                <motion.section variants={itemVariants} className="pt-12">
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-5">
                        Elesium
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <Link
                            to="/connector/"
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-5 flex items-center justify-between transition active:scale-[0.99]"
                        >
                            <div>
                                <div className="text-base font-medium text-white">Elesium Connector Model</div>
                                <div className="text-xs text-neutral-400 mt-1">Direct B2B buyer &amp; partner matching</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
                        </Link>

                        <Link
                            to="/ai/"
                            className="group rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/25 p-5 flex items-center justify-between transition active:scale-[0.99]"
                        >
                            <div>
                                <div className="text-base font-medium text-white">AI &amp; Automation Elesium</div>
                                <div className="text-xs text-neutral-400 mt-1">Practical automation systems for teams</div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition" />
                        </Link>
                    </div>
                </motion.section>
            </motion.main>

            <footer className="relative z-10 py-8 px-6 border-t border-white/10">
                <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-neutral-500">
                    <span>Chaman Shah</span>
                    <span>elesium.online</span>
                </div>
            </footer>
        </div>
    )
}
