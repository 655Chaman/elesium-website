import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database,
    Network,
    Activity,
    Terminal,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Shield,
    Plane,
    Zap,
    Pickaxe,
    Lock
} from 'lucide-react'
import { solutionCategories, getTopHighLeverSolutions, SolutionSummaryItem as SolutionRecord } from '../../data/solutionsHubData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database,
    Network,
    Activity,
    Terminal,
    Shield,
    Plane,
    Zap,
    Pickaxe,
    Lock
}

const solutionFaqs = [
    {
        q: "What makes Elesium enterprise solutions different from generic AI software?",
        a: "Every solution in the Elesium catalog represents a deterministic Python LangGraph state machine engineered specifically for enterprise throughput. Unlike generic chatbot wrappers or brittle Zapier loops, our solutions feature strict Pydantic state validation, sub-200ms TTFT execution, zero external data retention, and direct connectors for SAP S/4HANA, Oracle ERP, and core banking ledgers."
    },
    {
        q: "How does Elesium guarantee sub-200ms latency for workflow automation?",
        a: "We deploy custom vLLM inference runtimes utilizing PagedAttention virtual memory paging and FP8 GEMM microscaling kernels on dedicated NVIDIA H100/A100 clusters hosted in sovereign Indian tier-IV datacenters (Yotta Shakti and CtrlS). This decouples prompt prefill from token decoding, eliminating memory fragmentation and guaranteeing sub-200ms TTFT."
    },
    {
        q: "How are enterprise solutions deployed to maintain DPDP Act 2023 compliance?",
        a: "Under Section 8(5) of the DPDP Act 2023, personal data must be erased as soon as its processing purpose is fulfilled. Elesium deploys entirely within client-controlled, air-gapped private VPCs (AWS, GCP, Azure, or on-premise clusters in Mumbai, Bengaluru, or Delhi NCR). Client data never transits third-party public LLM APIs or consumer servers."
    },
    {
        q: "What is the contractual 90-day cash-flow ROI SLA?",
        a: "Before deploying any enterprise solution, we model your baseline operational costs, manual labor hours, and turnaround friction. If the deployed multi-agent system does not generate an audited 3x–5x cash-flow return within 90 days of production go-live, our engineering fees are rebated proportionally."
    },
    {
        q: "What are the pricing tiers for deploying Elesium enterprise solutions?",
        a: "We maintain three transparent tiers: Tier 1 (Pilot Architecture Sprint, ₹1,50,000 – ₹3,50,000, 14-day production pilot); Tier 2 (Enterprise Multi-Agent Suite, ₹6,00,000 – ₹15,00,000, 30–45 day deployment with ERP integration); and Tier 3 (Autonomous AI Engineering Pod, ₹4,50,000/month, dedicated pod of 3 AI engineers + 1 principal architect)."
    }
]

export default function SolutionsHub() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)
    const topHighLever = getTopHighLeverSolutions()

    // Structured Data: CollectionPage schema
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://elesium.online/solutions#collection',
                'name': 'Enterprise AI Solutions & Sovereign Automation Workflows',
                'description': 'Direct index of production enterprise AI automation solutions and sovereign multi-agent workflows engineered by Elesium.',
                'url': 'https://elesium.online/solutions',
                'publisher': {
                    '@type': 'Organization',
                    '@id': 'https://elesium.online/#organization',
                    'name': 'Elesium',
                    'url': 'https://elesium.online',
                    'logo': 'https://elesium.online/og-image.png'
                },
                'hasPart': solutionCategories.flatMap(cat =>
                    cat.solutions.map(sol => ({
                        '@type': 'Service',
                        'name': sol.h1,
                        'url': `https://elesium.online/solutions/${sol.slug}`,
                        'description': sol.metaDescription,
                        'provider': {
                            '@type': 'Organization',
                            'name': 'Elesium',
                            'url': 'https://elesium.online'
                        }
                    }))
                ),
                'breadcrumb': {
                    '@type': 'BreadcrumbList',
                    '@id': 'https://elesium.online/solutions#breadcrumb',
                    'itemListElement': [
                        {
                            '@type': 'ListItem',
                            'position': 1,
                            'name': 'Home',
                            'item': 'https://elesium.online/'
                        },
                        {
                            '@type': 'ListItem',
                            'position': 2,
                            'name': 'Solutions',
                            'item': 'https://elesium.online/solutions'
                        }
                    ]
                }
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/solutions#faq',
                'mainEntity': solutionFaqs.map(faq => ({
                    '@type': 'Question',
                    'name': faq.q,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.a
                    }
                }))
            }
        ]
    }

    return (
        <main id="main-content" className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Solutions &amp; Sovereign Automation | Elesium</title>
                <meta
                    name="description"
                    content="Directory of deterministic, sovereign enterprise AI automation solutions across logistics, BFSI, manufacturing, healthcare, and ERP integration."
                />
                <link rel="canonical" href="https://elesium.online/solutions/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Enterprise AI Solutions &amp; Sovereign Automation | Elesium" />
                <meta
                    property="og:description"
                    content="Directory of deterministic, sovereign enterprise AI automation solutions across logistics, BFSI, manufacturing, healthcare, and ERP integration."
                />
                <meta property="og:url" content="https://elesium.online/solutions/" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_ai" />
                <meta name="twitter:title" content="Enterprise AI Solutions &amp; Sovereign Automation | Elesium" />
                <meta name="twitter:description" content="Directory of deterministic, sovereign enterprise AI automation solutions across logistics, BFSI, manufacturing, healthcare, and ERP integration." />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <WhatsAppModal />

            {/* Breadcrumb Navigation (<= 2 clicks crawl guarantee) */}
            <div className="max-w-6xl mx-auto px-6 mb-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-medium">Solutions</span>
                </nav>
            </div>

            {/* Clean, High-Trust Hero Header (Edward Sturm Module 6 & 10) */}
            <header className="max-w-6xl mx-auto px-6 mb-16 md:mb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-300">
                        System 2 • Sovereign Solutions Directory
                    </span>
                </div>

                {/* EXACT H1 as specified by prompt */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6 max-w-4xl text-gray-900 dark:text-white">
                    Enterprise AI Solutions & Sovereign Automation Workflows
                </h1>

                {/* High-trust intro with wide margins and authentic styling */}
                <div className="max-w-3xl space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                    <p>
                        Elesium engineers deterministic multi-agent infrastructure for enterprise leaders who cannot afford
                        the latency, hallucinations, or data leakage risks inherent in generic chatbot integrations.
                    </p>
                    <p>
                        Every solution below represents an operational, production-ready workflow: air-gapped private VPC
                        deployments, direct SAP and Oracle RFC connectors, sub-200ms general ledger reconciliation, and strict
                        compliance with the DPDP Act 2023, ISO 27001, and SOC-2 Type II standards.
                    </p>
                </div>

                {/* Trust Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100 dark:border-white/10">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">&lt; 200ms</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Average Execution Latency</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">100%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Private VPC Data Isolation</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">Zero</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">External Data Retention</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-emerald-600 dark:text-emerald-400">90-Day</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hard Contracted ROI SLA</div>
                    </div>
                </div>

                {/* AEO / Perplexity Definitive Answer Capsule */}
                <div className="mt-8 p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/90 dark:bg-[#070707] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                            AEO Answer Capsule • Technical Standards for AI Search Engines
                        </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-2">
                        How Elesium Delivers Deterministic Enterprise Workflows
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        <strong>Elesium's solutions catalog contains 3,765 verified enterprise AI automations across logistics, BFSI, manufacturing, and healthcare.</strong> Every deployment runs as an air-gapped deterministic Python LangGraph state graph hosted on sovereign private VPCs or dedicated NVIDIA H100 clusters in tier-IV Indian datacenters (Yotta Shakti and CtrlS).
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        By pairing vLLM PagedAttention with FP8 GEMM quantization and persistent checkpointing, our systems achieve sub-200ms time-to-first-token latency while ensuring strict compliance with Section 8(5) of India's Digital Personal Data Protection (DPDP) Act 2023. Every enterprise engagement carries a contractual 90-day cash-flow ROI SLA.
                    </p>
                </div>
            </header>

            {/* Top High-Lever Solutions Quick Jump Bar (1-Click Crawl Depth from Hub) */}
            <section className="max-w-6xl mx-auto px-6 mb-16">
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <h2 className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                High-Lever Enterprise Flagships (Direct 1-Click Access)
                            </h2>
                        </div>
                        <span className="text-xs text-gray-400 font-mono">Immediate Audit Available</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {topHighLever.map((item: SolutionRecord) => (
                            <Link
                                key={item.slug}
                                to={`/solutions/${item.slug}/`}
                                className="group flex items-start gap-3 p-3.5 rounded-xl border border-gray-200/80 dark:border-white/5 bg-white dark:bg-white/[0.03] hover:border-black dark:hover:border-white/30 transition-all"
                            >
                                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-all mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                    {/* Exact H1 Title used as anchor text */}
                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors truncate">
                                        {item.h1}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate font-mono">
                                        {item.targetPersona}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Thematic Category Panels (Module 6 & 10 Hub Specification) */}
            <main className="max-w-6xl mx-auto px-6 space-y-16">
                {solutionCategories.map((category, catIndex) => {
                    const IconComponent = iconMap[category.iconName] || Terminal

                    return (
                        <section
                            key={category.name}
                            id={category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                            className="p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm"
                        >
                            {/* Panel Header */}
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 mb-8 border-b border-gray-100 dark:border-white/5">
                                <div className="space-y-2 max-w-2xl">
                                    <div className="flex items-center gap-2.5">
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                                            <IconComponent className="w-5 h-5" />
                                        </div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                            Cluster 0{catIndex + 1}
                                        </span>
                                    </div>

                                    {/* H2 Title for Thematic Category */}
                                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white">
                                        {category.name}
                                    </h2>

                                    <p className="text-sm font-mono text-emerald-600 dark:text-emerald-400">
                                        {category.tagline}
                                    </p>

                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed pt-1">
                                        {category.description}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 shrink-0 self-start md:self-auto">
                                    <span>{category.solutions.length} Autonomous Workflows</span>
                                </div>
                            </div>

                            {/* Child BOFU Landing Pages Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {category.solutions.map((solution: SolutionRecord) => (
                                    <Link
                                        key={solution.slug}
                                        to={`/solutions/${solution.slug}/`}
                                        className="group relative flex flex-col justify-between p-6 rounded-xl border border-gray-200/90 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.02] hover:border-black dark:hover:border-white/40 hover:bg-white dark:hover:bg-white/[0.04] transition-all"
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">
                                                    Target: {solution.targetPersona}
                                                </span>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-gray-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                                    Moz {solution.mozScore}
                                                </span>
                                            </div>

                                            {/* EXACT H1 Title as anchor text (Sturm Module 6 requirement) */}
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                                                {solution.h1}
                                            </h3>

                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                                {solution.hero.subheadline || solution.metaDescription}
                                            </p>
                                        </div>

                                        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                                            <span className="font-mono text-gray-400 dark:text-gray-500">
                                                {solution.trustSection.metrics[0]?.label}: {solution.trustSection.metrics[0]?.value}
                                            </span>
                                            <span className="inline-flex items-center gap-1 font-medium text-black dark:text-white group-hover:translate-x-0.5 transition-transform">
                                                Inspect Architecture
                                                <ChevronRight className="w-3.5 h-3.5" />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )
                })}
            </main>

            {/* Transparent Institutional Pricing Tiers */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-[#080808]">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
                            Direct Commercial Engagement
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Institutional AI Engineering Investment Tiers
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Deploy any of our 3,765 solutions under transparent commercial terms with contractual ROI guarantees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono text-gray-400 uppercase">Tier 01</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Pilot Architecture Sprint</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹1,50,000 – ₹3,50,000</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">14-Day Delivery</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Single-process deterministic agent validation on private VPC staging with sub-200ms latency baseline.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono transition-all"
                            >
                                Inquire Tier 1 &rarr;
                            </button>
                        </div>

                        <div className="p-6 rounded-2xl border-2 border-emerald-500/50 bg-white dark:bg-[#0c0c0c] flex flex-col justify-between shadow-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-black text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
                                Most Deployed
                            </div>
                            <div>
                                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase">Tier 02</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Enterprise Multi-Agent Suite</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹6,00,000 – ₹15,00,000</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">30–45 Day Implementation</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Collaborative 3-agent triad with SAP/Oracle connectors, zero-data-retention VPC, and 90-day ROI SLA.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-xs font-mono transition-all"
                            >
                                Deploy Suite &rarr;
                            </button>
                        </div>

                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono text-gray-400 uppercase">Tier 03</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Autonomous Engineering Pod</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹4,50,000 / month</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">Dedicated Team</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    3 AI engineers + 1 principal architect, continuous vLLM fine-tuning, and 1-hour critical production SLA.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono transition-all"
                            >
                                Retain Pod &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="max-w-4xl mx-auto px-6 mt-20">
                <div className="text-center mb-10">
                    <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-1 block">
                        Architecture &amp; Procurement
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Frequently Asked Questions About Solutions Deployment
                    </h2>
                </div>

                <div className="space-y-3">
                    {solutionFaqs.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#070707] shadow-sm"
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                            >
                                <span>{faq.q}</span>
                                <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {openFaq === idx && (
                                <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-3">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom Call to Action Card (Sturm Module 6 & 10) */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="relative overflow-hidden p-8 sm:p-12 md:p-16 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-[#0A0A0A] shadow-2xl">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>Private Sovereign VPC Deployment Protocol</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                            Request a Deterministic AI Architecture Audit for Your Enterprise
                        </h2>

                        <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 leading-relaxed">
                            Schedule a 30-minute technical evaluation directly with our Systems Engineering Pod.
                            We review your SAP/Oracle ledgers, legacy workflows, and data governance policies,
                            delivering a formal 1-page feasibility memorandum with zero obligation.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-3.5 pt-2">
                            <button
                                onClick={openWhatsApp}
                                className="w-full sm:w-auto h-11 px-6 rounded-full bg-white text-black hover:bg-gray-100 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
                            >
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto h-11 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <span>ele-in SaaS Waitlist</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                        <img src="/assets/LOGO_NEW.png" alt="Elesium" width="384" height="384" loading="lazy" className="w-96 h-96 object-contain filter invert" />
                    </div>
                </div>
            </section>
        </main>
    )
}
