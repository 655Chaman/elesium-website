import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import emblem from '../../assets/LOGO_EMBLEM.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const pageSpring = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 28,
    mass: 0.85,
}

export default function Portfolio() {
    const prefersReducedMotion = useReducedMotion()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    const portfolioSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': 'https://elesium.online/authors/chaman-shah#person',
                name: 'Chaman Shah',
                givenName: 'Chaman',
                familyName: 'Shah',
                jobTitle: 'Founder',
                worksFor: {
                    '@type': 'Organization',
                    '@id': 'https://elesium.online/#organization',
                    name: 'Elesium',
                    legalName: 'Elesium Digital Systems Private Limited',
                    url: 'https://elesium.online/',
                },
                url: 'https://elesium.online/portfolio/',
                image: 'https://elesium.online/chaman-shah.png',
                sameAs: [
                    'https://github.com/655Chaman',
                    'https://linkedin.com/in/chaman-shah-elesium',
                    'https://x.com/chamanshah_ai',
                ],
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Koramangala 4th Block, 80 Feet Road',
                    addressLocality: 'Bengaluru',
                    addressRegion: 'Karnataka',
                    postalCode: '560034',
                    addressCountry: 'IN',
                },
                description:
                    'Founder of Elesium in Bengaluru, building direct partner-matching systems and enterprise AI automation.',
            },
            {
                '@type': ['ProfilePage', 'WebPage'],
                '@id': 'https://elesium.online/portfolio/#webpage',
                name: 'Chaman Shah — Portfolio',
                description:
                    'Portfolio of Chaman Shah, Founder of Elesium in Bengaluru.',
                url: 'https://elesium.online/portfolio/',
                mainEntity: {
                    '@id': 'https://elesium.online/authors/chaman-shah#person',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/portfolio/#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Elesium',
                        item: 'https://elesium.online/',
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Chaman Shah',
                        item: 'https://elesium.online/portfolio/',
                    },
                ],
            },
        ],
    }

    return (
        <div className="dark min-h-[100dvh] bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col justify-between overflow-x-hidden">
            <WhatsAppModal />
            <Helmet>
                <title>Chaman Shah — Elesium</title>
                <meta
                    name="description"
                    content="Portfolio of Chaman Shah, Founder of Elesium in Bengaluru."
                />
                <link rel="canonical" href="https://elesium.online/portfolio/" />
                <meta
                    name="robots"
                    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content="Chaman Shah — Elesium" />
                <meta
                    property="og:description"
                    content="Portfolio of Chaman Shah, Founder of Elesium in Bengaluru."
                />
                <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
                <meta property="og:url" content="https://elesium.online/portfolio/" />
                <script type="application/ld+json">{JSON.stringify(portfolioSchema)}</script>
            </Helmet>

            {/* Minimal Top Bar */}
            <header className="w-full px-6 md:px-12 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    aria-label="Return to Elesium"
                    className="inline-flex items-center active:scale-[0.97] transition-transform"
                >
                    <img
                        src={emblem}
                        alt="Elesium"
                        width="28"
                        height="28"
                        loading="eager"
                        fetchPriority="high"
                        className="h-7 w-7 object-contain opacity-90 hover:opacity-100 transition-opacity"
                    />
                </Link>

                <Link
                    to="/"
                    className="text-xs font-medium text-white/55 hover:text-white transition-colors active:scale-[0.97]"
                >
                    Back
                </Link>
            </header>

            {/* Centered Editorial Content */}
            <motion.main
                id="main-content"
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={pageSpring}
                className="flex-1 flex items-center justify-center px-6 py-12"
            >
                <div className="w-full max-w-xl mx-auto">
                    {/* Portrait & Name */}
                    <div className="flex items-center gap-6 mb-8">
                        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-[24px] bg-neutral-950 border border-white/10">
                            <img
                                src="/chaman-shah.png"
                                alt="Chaman Shah"
                                width="192"
                                height="192"
                                loading="eager"
                                className="h-full w-full object-cover grayscale contrast-[1.08]"
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                                Chaman Shah
                            </h1>
                            <p className="mt-1 text-sm text-white/55">
                                Founder, Elesium &middot; Bengaluru
                            </p>
                        </div>
                    </div>

                    {/* Clean Plain Bio */}
                    <p className="text-base sm:text-lg font-light text-white/80 leading-relaxed mb-8">
                        I build systems that connect businesses directly with the right partners, and design intelligent automation that removes repetitive operational work.
                    </p>

                    {/* Plain Text Direct Links */}
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pb-10 text-sm">
                        <a
                            href="https://github.com/655Chaman"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white/70 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors active:scale-[0.97]"
                        >
                            <span>GitHub</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                            href="https://linkedin.com/in/chaman-shah-elesium"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white/70 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors active:scale-[0.97]"
                        >
                            <span>LinkedIn</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                            href="https://x.com/chamanshah_ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-white/70 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors active:scale-[0.97]"
                        >
                            <span>X</span>
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                        <a
                            href="mailto:contact@elesium.online"
                            className="inline-flex items-center gap-1 text-white/70 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors active:scale-[0.97]"
                        >
                            <span>Email</span>
                        </a>
                        <button
                            type="button"
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-1 text-white/70 hover:text-white underline underline-offset-4 decoration-white/25 hover:decoration-white transition-colors active:scale-[0.97]"
                        >
                            <span>WhatsApp</span>
                        </button>
                    </div>

                    {/* Clean Work Links (Text Only) */}
                    <div className="border-t border-white/10 pt-8 space-y-5">
                        <Link
                            to="/connector/"
                            className="group flex items-baseline justify-between gap-4 py-1 text-white/80 hover:text-white transition-colors active:scale-[0.99]"
                        >
                            <div>
                                <span className="text-base font-medium text-white block">
                                    Elesium Connector Model
                                </span>
                                <span className="text-sm text-white/50">
                                    Direct B2B buyer and partner matching
                                </span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>

                        <Link
                            to="/ai/"
                            className="group flex items-baseline justify-between gap-4 py-1 text-white/80 hover:text-white transition-colors active:scale-[0.99]"
                        >
                            <div>
                                <span className="text-base font-medium text-white block">
                                    AI &amp; Automation Elesium
                                </span>
                                <span className="text-sm text-white/50">
                                    Enterprise AI systems and private workflow automation
                                </span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 shrink-0 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                        </Link>
                    </div>
                </div>
            </motion.main>

            {/* Minimal Bottom Line */}
            <footer className="w-full px-6 md:px-12 py-6 flex items-center justify-between text-xs text-white/40">
                <span>Chaman Shah</span>
                <span>Bengaluru, India</span>
            </footer>
        </div>
    )
}
