import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
    ArrowLeft,
    ArrowRight,
    ArrowUpRight,
    Github,
    Linkedin,
    Mail,
    MapPin,
    Menu,
    MessageSquare,
    Twitter,
    X,
} from 'lucide-react'
import emblem from '../../assets/LOGO_EMBLEM.png'
import { DirectionalStep } from '../ui/Stepper'
import { Carousel } from '../ui/Carousel'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const HAIRLINE_BORDER = '1px solid rgba(255,255,255,0.12)'

interface EngineeringMilestone {
    phase: string
    title: string
    period: string
    summary: string
    specs: { label: string; value: string }[]
    link?: { label: string; href: string; external?: boolean }
}

const ENGINEERING_MILESTONES: EngineeringMilestone[] = [
    {
        phase: 'Phase 01',
        title: 'Distributed Data Pipelines',
        period: 'Foundation · 8+ Years Distributed Systems',
        summary:
            'Engineered deterministic data synchronization and event-driven ledger pipelines integrating SAP S/4HANA RFC middleware, core banking queues, and high-volume supply chain telemetry without manual reconciliation latency.',
        specs: [
            { label: 'Core Focus', value: 'SAP S/4HANA RFC & Ledger Pipelines' },
            { label: 'Execution Target', value: 'Sub-200ms State Boundaries' },
            { label: 'Domains', value: 'Logistics, Core Banking, Manufacturing' },
        ],
    },
    {
        phase: 'Phase 02',
        title: 'Elesium Connector Architecture',
        period: 'Venture I · Direct B2B Market Connectivity',
        summary:
            'Designed the Elesium Connector Model to pair verified enterprise demand mandates directly with pre-vetted technical delivery principals—replacing opaque brokerage chains with context, qualification, and trust.',
        specs: [
            { label: 'Model', value: 'Demand-to-Supply Mandate Routing' },
            { label: 'Qualification', value: 'Technical Scope & Compliance Vetting' },
            { label: 'Engagement', value: 'Direct Principal Introductions' },
        ],
        link: { label: 'Explore Connector Model', href: '/connector/' },
    },
    {
        phase: 'Phase 03',
        title: 'Sovereign LangGraph & vLLM Clusters',
        period: 'Venture II · AI & Automation Elesium',
        summary:
            'Architected cyclic and acyclic LangGraph multi-agent state machines backed by air-gapped private VPC vLLM PagedAttention clusters on NVIDIA H100/A100 hardware and statutory DPDP Act 2023 compliance enclaves.',
        specs: [
            { label: 'Orchestration', value: 'Deterministic LangGraph + Rollback' },
            { label: 'Inference Stack', value: 'vLLM PagedAttention · FP8 · Triton' },
            { label: 'Governance', value: 'DPDP Act 2023 · Zero Token Leakage' },
        ],
        link: { label: 'Explore AI & Automation', href: '/ai/' },
    },
    {
        phase: 'Phase 04',
        title: 'Open-Source Benchmarks',
        period: 'Empirical Telemetry · Public Verification',
        summary:
            'Published reproducible sovereign inference latency, KV-cache fragmentation, and throughput benchmarks across dedicated NVIDIA H100 SXM5 and A100 nodes in Indian Tier-IV datacenters.',
        specs: [
            { label: 'Llama-3.3-70B FP8', value: '148.2ms p99 TTFT · 124.5 tok/s' },
            { label: 'Qwen2.5-72B FP8', value: '162.0ms p99 TTFT · 118.2 tok/s' },
            { label: 'Repository', value: '655Chaman/sovereign-enterprise-ai-benchmarks' },
        ],
        link: {
            label: 'View GitHub Benchmarks',
            href: 'https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks',
            external: true,
        },
    },
]

const RESEARCH_DOSSIERS = [
    {
        title: 'On-Premise Open-Source LLM Deployment in India: Sovereign Private Cloud, vLLM PagedAttention, and DPDP Act 2023',
        path: '/signals/open-source-llm-deployment-on-premise-india/',
        category: 'Sovereign AI Infrastructure',
        readTime: '14 min read',
        date: 'October 2026',
    },
    {
        title: 'Enterprise AI-Driven Document Processing in India: Multimodal OCR, LayoutLMv3, and GST Rule 36(4) Reconciliation',
        path: '/signals/ai-driven-document-processing-india/',
        category: 'Enterprise Automation',
        readTime: '12 min read',
        date: 'October 2026',
    },
    {
        title: 'Sub-200ms Ledger Reconciliation: Python LangGraph State Machines for Core Banking and RBI Compliance',
        path: '/solutions/upi-merchant-chargeback-dispute-arbitration-autonomous-agents-for-mumbai-payment-aggregators/',
        category: 'BFSI & FinTech',
        readTime: '16 min read',
        date: 'September 2026',
    },
    {
        title: 'DPDP Act 2023 Technical Implementation: Consent Artifact Architecture, Data Principal Rights, and Air-Gapped VPCs',
        path: '/solutions/compliance/dpdp-act-2023/',
        category: 'Statutory Compliance',
        readTime: '15 min read',
        date: 'August 2026',
    },
]

export default function Portfolio() {
    const prefersReducedMotion = useReducedMotion()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [stepIndex, setStepIndex] = useState(0)
    const [direction, setDirection] = useState(1)

    const currentMilestone = ENGINEERING_MILESTONES[stepIndex]

    const goToStep = (nextIndex: number) => {
        if (nextIndex === stepIndex || nextIndex < 0 || nextIndex >= ENGINEERING_MILESTONES.length) return
        setDirection(nextIndex > stepIndex ? 1 : -1)
        setStepIndex(nextIndex)
    }

    const portfolioSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': 'https://elesium.online/authors/chaman-shah#person',
                name: 'Chaman Shah',
                givenName: 'Chaman',
                familyName: 'Shah',
                jobTitle: 'Founder & Principal Systems Architect',
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
                    'https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks',
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
                knowsAbout: [
                    'B2B Market Connectivity',
                    'Enterprise Multi-Agent Systems',
                    'LangGraph State Topology',
                    'vLLM PagedAttention Inference',
                    'DPDP Act 2023 Statutory Compliance',
                    'Dedicated Private VPC Cloud Infrastructure',
                    'SAP S/4HANA RFC Middleware',
                    'Sub-200ms Financial Ledger Reconciliation',
                ],
                description:
                    'Founder and Principal Systems Architect of Elesium in Koramangala, Bengaluru, leading the Elesium Connector Model and deterministic sovereign AI infrastructure.',
            },
            {
                '@type': 'ProfilePage',
                '@id': 'https://elesium.online/portfolio/#webpage',
                name: 'Chaman Shah — Founder Portfolio | Elesium',
                description:
                    'Founder portfolio of Chaman Shah, Principal Systems Architect at Elesium. Exploring B2B market connectivity, deterministic LangGraph architectures, and sovereign vLLM infrastructure.',
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
                        name: 'Founder Portfolio',
                        item: 'https://elesium.online/portfolio/',
                    },
                ],
            },
        ],
    }

    return (
        <div className="dark min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black overflow-x-hidden">
            <WhatsAppModal />
            <Helmet>
                <title>Chaman Shah — Founder Portfolio | Elesium</title>
                <meta
                    name="description"
                    content="Founder portfolio of Chaman Shah, Principal Systems Architect at Elesium in Koramangala, Bengaluru. Elesium Connector Model and Sovereign AI & Automation Infrastructure."
                />
                <link rel="canonical" href="https://elesium.online/portfolio/" />
                <meta
                    name="robots"
                    content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
                />
                <meta property="og:type" content="profile" />
                <meta property="og:title" content="Chaman Shah — Founder Portfolio | Elesium" />
                <meta
                    property="og:description"
                    content="Founder & Principal Systems Architect at Elesium. B2B market connectivity and deterministic sovereign AI infrastructure."
                />
                <meta property="og:image" content="https://elesium.online/chaman-shah.png" />
                <meta property="og:url" content="https://elesium.online/portfolio/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@chamanshah_ai" />
                <meta name="twitter:title" content="Chaman Shah — Founder Portfolio | Elesium" />
                <meta
                    name="twitter:description"
                    content="Founder & Principal Systems Architect at Elesium. B2B market connectivity and deterministic sovereign AI infrastructure."
                />
                <meta name="twitter:image" content="https://elesium.online/chaman-shah.png" />
                <script type="application/ld+json">{JSON.stringify(portfolioSchema)}</script>
            </Helmet>

            {/* Self-Contained Minimal Monochrome Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/95 backdrop-blur-md border-b border-white/10">
                <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between md:grid md:grid-cols-3">
                    <div className="flex items-center justify-start">
                        <Link
                            to="/"
                            className="inline-flex items-center gap-3 active:scale-[0.97] transition-transform"
                            aria-label="Return to Elesium Gateway"
                        >
                            <img
                                src={emblem}
                                alt="Elesium"
                                width="32"
                                height="32"
                                loading="eager"
                                fetchPriority="high"
                                className="h-7 w-7 object-contain"
                            />
                        </Link>
                    </div>

                    {/* Desktop Center Links */}
                    <nav
                        aria-label="Portfolio sections"
                        className="hidden md:flex items-center justify-center gap-1 text-xs font-medium text-white/60"
                    >
                        <a
                            href="#overview"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Overview
                        </a>
                        <a
                            href="#ventures"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Ventures
                        </a>
                        <a
                            href="#timeline"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Timeline
                        </a>
                        <a
                            href="#architecture"
                            className="px-3.5 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            Architecture
                        </a>
                    </nav>

                    {/* Desktop Right Monochrome Switchers */}
                    <div className="hidden md:flex items-center justify-end gap-2">
                        <Link
                            to="/connector/"
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-medium text-white/75 hover:text-white hover:bg-white/10 transition active:scale-[0.97]"
                        >
                            <span>Connector Model</span>
                        </Link>
                        <Link
                            to="/ai/"
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-medium transition active:scale-[0.97]"
                        >
                            <span>AI &amp; Automation</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileOpen((prev) => !prev)}
                        aria-label="Toggle portfolio navigation"
                        className="md:hidden p-2 rounded-full text-white/75 hover:text-white hover:bg-white/10 active:scale-[0.97] transition"
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
                                href="#overview"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-white/75 hover:text-white border-b border-white/10"
                            >
                                Overview
                            </a>
                            <a
                                href="#ventures"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-white/75 hover:text-white border-b border-white/10"
                            >
                                Ventures
                            </a>
                            <a
                                href="#timeline"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-white/75 hover:text-white border-b border-white/10"
                            >
                                Timeline
                            </a>
                            <a
                                href="#architecture"
                                onClick={() => setMobileOpen(false)}
                                className="py-2 text-sm text-white/75 hover:text-white border-b border-white/10"
                            >
                                Architecture
                            </a>
                            <div className="pt-2 flex flex-col gap-2">
                                <Link
                                    to="/connector/"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-2.5 rounded-full border border-white/15 text-xs font-medium text-white"
                                >
                                    Connector Model
                                </Link>
                                <Link
                                    to="/ai/"
                                    onClick={() => setMobileOpen(false)}
                                    className="w-full text-center py-2.5 rounded-full bg-white text-black text-xs font-medium"
                                >
                                    AI &amp; Automation
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <motion.main
                initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28, mass: 0.85 }}
                className="pt-28 pb-24 px-6"
            >
                <div className="max-w-6xl mx-auto space-y-20">
                    {/* 1. Hero Bio Section */}
                    <section
                        id="overview"
                        className="rounded-[32px] bg-black p-8 sm:p-12 md:p-14"
                        style={{ border: HAIRLINE_BORDER }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
                            <div className="md:col-span-4 flex justify-center md:justify-start">
                                <div
                                    className="w-full max-w-[280px] aspect-square overflow-hidden rounded-[28px] bg-neutral-950"
                                    style={{ border: HAIRLINE_BORDER }}
                                >
                                    <img
                                        src="/chaman-shah.png"
                                        alt="Chaman Shah — Founder & Principal Systems Architect at Elesium"
                                        width="560"
                                        height="560"
                                        loading="eager"
                                        className="w-full h-full object-cover grayscale contrast-[1.1]"
                                    />
                                </div>
                            </div>

                            <div className="md:col-span-8 flex flex-col justify-between">
                                <div className="flex flex-wrap items-center gap-3 mb-5">
                                    <span
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.18em] text-white/75"
                                        style={{ border: HAIRLINE_BORDER }}
                                    >
                                        <MapPin className="w-3.5 h-3.5" />
                                        Koramangala, Bengaluru, India
                                    </span>
                                </div>

                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.06] mb-3">
                                    Chaman Shah
                                </h1>
                                <p className="text-base sm:text-lg text-white/70 font-normal mb-6">
                                    Founder &amp; Principal Systems Architect &middot; Elesium
                                </p>

                                <p className="text-sm sm:text-base text-white/65 leading-relaxed mb-8 max-w-2xl">
                                    Across 8+ years of distributed systems engineering, Chaman Shah builds two complementary pillars under Elesium: direct B2B market connectivity through the Elesium Connector Model—pairing enterprise demand mandates with vetted delivery principals—and deterministic sovereign AI infrastructure powered by LangGraph state machines, private VPC vLLM PagedAttention clusters, and statutory DPDP Act 2023 enclaves.
                                </p>

                                {/* Direct Action Row */}
                                <div className="flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/10">
                                    <a
                                        href="https://github.com/655Chaman"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-medium text-white/85 hover:bg-white hover:text-black transition active:scale-[0.97]"
                                    >
                                        <Github className="w-3.5 h-3.5" />
                                        <span>GitHub @655Chaman</span>
                                    </a>
                                    <a
                                        href="https://linkedin.com/in/chaman-shah-elesium"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-medium text-white/85 hover:bg-white hover:text-black transition active:scale-[0.97]"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                        <span>LinkedIn</span>
                                    </a>
                                    <a
                                        href="https://x.com/chamanshah_ai"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-medium text-white/85 hover:bg-white hover:text-black transition active:scale-[0.97]"
                                    >
                                        <Twitter className="w-3.5 h-3.5" />
                                        <span>X</span>
                                    </a>
                                    <button
                                        type="button"
                                        onClick={openWhatsApp}
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-medium transition active:scale-[0.97]"
                                    >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                        <span>WhatsApp Direct</span>
                                    </button>
                                    <a
                                        href="mailto:contact@elesium.online"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-medium text-white/85 hover:bg-white hover:text-black transition active:scale-[0.97]"
                                    >
                                        <Mail className="w-3.5 h-3.5" />
                                        <span>Email</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Symmetrical Two Ventures Grid */}
                    <section id="ventures" className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/50 mb-2">
                                    Dual Mandate
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    Two Symmetrical Ventures
                                </h2>
                            </div>
                            <p className="text-xs font-mono text-white/50">
                                Elesium Digital Systems Private Limited
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                            {/* Left Card: Elesium Connector Model */}
                            <div
                                className="rounded-[32px] bg-black p-8 sm:p-10 flex flex-col justify-between h-full"
                                style={{ border: HAIRLINE_BORDER }}
                            >
                                <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/50 mb-3">
                                        Venture 01 &middot; Market Connectivity
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4">
                                        Elesium Connector Model
                                    </h3>
                                    <p className="text-sm text-white/65 leading-relaxed mb-6">
                                        Direct B2B pipeline architecture connecting verified enterprise buyers holding active technical mandates with pre-qualified delivery principals—removing brokerage layers and mismatched introductions.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                        <div
                                            className="rounded-[20px] p-4 bg-white/[0.02]"
                                            style={{ border: HAIRLINE_BORDER }}
                                        >
                                            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">
                                                Demand Side
                                            </div>
                                            <div className="text-xs text-white/85 leading-relaxed">
                                                Pre-vetted technical scope, compliance posture, and delivery readiness.
                                            </div>
                                        </div>
                                        <div
                                            className="rounded-[20px] p-4 bg-white/[0.02]"
                                            style={{ border: HAIRLINE_BORDER }}
                                        >
                                            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">
                                                Supply Side
                                            </div>
                                            <div className="text-xs text-white/85 leading-relaxed">
                                                Direct alignment with qualified buyer budgets and evaluation criteria.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Link
                                        to="/connector/"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black hover:bg-neutral-200 text-xs font-medium transition active:scale-[0.97]"
                                    >
                                        <span>Open Connector Model</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right Card: AI & Automation Elesium */}
                            <div
                                className="rounded-[32px] bg-black p-8 sm:p-10 flex flex-col justify-between h-full"
                                style={{ border: HAIRLINE_BORDER }}
                            >
                                <div>
                                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/50 mb-3">
                                        Venture 02 &middot; Sovereign AI
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4">
                                        AI &amp; Automation Elesium
                                    </h3>
                                    <p className="text-sm text-white/65 leading-relaxed mb-6">
                                        Production multi-agent execution graphs and air-gapped private VPC vLLM inference clusters engineered for sub-200ms TTFT, DPDP Act 2023 compliance, and contractual 90-day ROI mandates.
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                                        <div
                                            className="rounded-[20px] p-4 bg-white/[0.02]"
                                            style={{ border: HAIRLINE_BORDER }}
                                        >
                                            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">
                                                State Topology
                                            </div>
                                            <div className="text-xs text-white/85 leading-relaxed">
                                                Deterministic LangGraph execution with checkpoint rollback and audit trails.
                                            </div>
                                        </div>
                                        <div
                                            className="rounded-[20px] p-4 bg-white/[0.02]"
                                            style={{ border: HAIRLINE_BORDER }}
                                        >
                                            <div className="text-[11px] font-mono uppercase tracking-wider text-white/50 mb-1">
                                                Sovereign VPC
                                            </div>
                                            <div className="text-xs text-white/85 leading-relaxed">
                                                148.2ms p99 TTFT and 124.5 tok/s on dedicated H100 SXM5 infrastructure.
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Link
                                        to="/ai/"
                                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white hover:text-black text-xs font-medium transition active:scale-[0.97]"
                                    >
                                        <span>Open AI &amp; Automation</span>
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 3. Key Engineering Milestones Stepper */}
                    <section id="timeline" className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/50 mb-2">
                                    Engineering Progression
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    Key Engineering Milestones
                                </h2>
                            </div>

                            {/* Step Selector Controls */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => goToStep(stepIndex - 1)}
                                    disabled={stepIndex === 0}
                                    aria-label="Previous engineering milestone"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white hover:text-black disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed transition active:scale-[0.97]"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => goToStep(stepIndex + 1)}
                                    disabled={stepIndex >= ENGINEERING_MILESTONES.length - 1}
                                    aria-label="Next engineering milestone"
                                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white hover:bg-white hover:text-black disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white disabled:cursor-not-allowed transition active:scale-[0.97]"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div
                            className="rounded-[32px] bg-black p-8 sm:p-10"
                            style={{ border: HAIRLINE_BORDER }}
                        >
                            {/* Phase Indicator Pills */}
                            <div className="flex flex-wrap items-center gap-2 mb-8 pb-6 border-b border-white/10">
                                {ENGINEERING_MILESTONES.map((milestone, idx) => {
                                    const active = idx === stepIndex
                                    return (
                                        <button
                                            key={milestone.phase}
                                            type="button"
                                            onClick={() => goToStep(idx)}
                                            className={`px-4 py-1.5 rounded-full text-xs font-mono transition active:scale-[0.97] ${
                                                active
                                                    ? 'bg-white text-black font-medium'
                                                    : 'border border-white/15 text-white/60 hover:text-white hover:border-white/30'
                                            }`}
                                        >
                                            {milestone.phase} &middot; {milestone.title}
                                        </button>
                                    )
                                })}
                            </div>

                            <DirectionalStep stepKey={currentMilestone.phase} direction={direction}>
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <span className="text-xs font-mono uppercase tracking-[0.2em] text-white/50">
                                            {currentMilestone.period}
                                        </span>
                                        <span className="text-xs font-mono text-white/50">
                                            {stepIndex + 1} / {ENGINEERING_MILESTONES.length}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                        {currentMilestone.title}
                                    </h3>

                                    <p className="text-sm sm:text-base text-white/65 leading-relaxed max-w-3xl">
                                        {currentMilestone.summary}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                                        {currentMilestone.specs.map((spec) => (
                                            <div
                                                key={spec.label}
                                                className="rounded-[20px] p-4 bg-white/[0.02]"
                                                style={{ border: HAIRLINE_BORDER }}
                                            >
                                                <div className="text-[11px] font-mono uppercase tracking-wider text-white/45 mb-1.5">
                                                    {spec.label}
                                                </div>
                                                <div className="text-xs sm:text-sm font-medium text-white/90 break-words">
                                                    {spec.value}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {currentMilestone.link && (
                                        <div className="pt-2">
                                            {currentMilestone.link.external ? (
                                                <a
                                                    href={currentMilestone.link.href}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white hover:text-black transition active:scale-[0.97]"
                                                >
                                                    <span>{currentMilestone.link.label}</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </a>
                                            ) : (
                                                <Link
                                                    to={currentMilestone.link.href}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-medium text-white hover:bg-white hover:text-black transition active:scale-[0.97]"
                                                >
                                                    <span>{currentMilestone.link.label}</span>
                                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </DirectionalStep>
                        </div>
                    </section>

                    {/* 4. Featured Research & Architecture Dossiers */}
                    <section id="architecture" className="space-y-8">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div>
                                <p className="text-[11px] font-mono uppercase tracking-[0.26em] text-white/50 mb-2">
                                    Technical Publications
                                </p>
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
                                    Featured Research &amp; Architecture Dossiers
                                </h2>
                            </div>
                            <Link
                                to="/authors/chaman-shah/"
                                className="inline-flex items-center gap-1.5 text-xs font-mono text-white/65 hover:text-white transition"
                            >
                                <span>Full Architect Dossier</span>
                                <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        <Carousel
                            gap={20}
                            itemClassName="w-[86vw] sm:w-[420px] md:w-[460px]"
                            items={RESEARCH_DOSSIERS.map((dossier) => (
                                <Link
                                    key={dossier.path}
                                    to={dossier.path}
                                    className="group flex h-full flex-col justify-between rounded-[32px] bg-black p-7 sm:p-8 hover:bg-white/[0.03] transition-colors"
                                    style={{ border: HAIRLINE_BORDER }}
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-3 mb-5">
                                            <span
                                                className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider text-white/75"
                                                style={{ border: HAIRLINE_BORDER }}
                                            >
                                                {dossier.category}
                                            </span>
                                            <span className="text-[11px] font-mono text-white/45">
                                                {dossier.readTime}
                                            </span>
                                        </div>
                                        <h3 className="text-base sm:text-lg font-medium text-white leading-snug mb-6 group-hover:text-white">
                                            {dossier.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-white/60 group-hover:text-white transition-colors">
                                        <span>{dossier.date}</span>
                                        <span className="inline-flex items-center gap-1">
                                            <span>Read Dossier</span>
                                            <ArrowUpRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        />
                    </section>
                </div>
            </motion.main>

            {/* Clean Monochrome Footer */}
            <footer className="py-10 px-6 border-t border-white/10 bg-black">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
                    <p>
                        Elesium Digital Systems Private Limited &bull; 80 Feet Road, 4th Block, Koramangala, Bengaluru 560034
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <Link to="/" className="hover:text-white transition">
                            Gateway
                        </Link>
                        <Link to="/connector/" className="hover:text-white transition">
                            Connector Model
                        </Link>
                        <Link to="/ai/" className="hover:text-white transition">
                            AI &amp; Automation
                        </Link>
                        <Link to="/authors/chaman-shah/" className="hover:text-white transition">
                            Author Profile
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
