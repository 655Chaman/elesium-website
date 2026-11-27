import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    ArrowRight,
    ArrowUpRight,
    ChevronRight,
    ChevronDown,
    Gauge,
    Terminal
} from 'lucide-react'
import { compareData, CompareBattlecardItem } from '../../data/compareData'

const compareFaqs = [
    {
        q: "What is the Elesium Enterprise AI Comparison Matrix?",
        a: "It is an objective, mathematically grounded evaluation suite comparing enterprise multi-agent frameworks, sovereign inference clusters, deterministic state machines, and delivery models against empirical telemetry: sub-200ms TTFT, FP8 GEMM compute efficiency, vLLM PagedAttention virtual memory allocation (<4% fragmentation), and DPDP Act 2023 Section 8(5) statutory data residency compliance on Yotta and CtrlS tier-IV datacenter clusters."
    },
    {
        q: "Why does Elesium benchmark LangGraph against CrewAI and AutoGen?",
        a: "Enterprise mission-critical systems cannot tolerate unconstrained, heuristic ReAct loops where agents enter infinite conversational loops or hallucinate tool calls. LangGraph compiles into deterministic finite state machines (FSM) with explicit Pydantic schemas, Merkle audit logs, and predictable state transitions, yielding a verified 0.0% unhandled loop rate in production."
    },
    {
        q: "How does private vLLM inference compare to Azure OpenAI in unit economics?",
        a: "At 10,000+ daily enterprise transactions, public cloud API token costs scale exponentially, accompanied by 800ms-2,400ms variable latency spikes and data telemetry egress risk. Self-hosting fine-tuned 8B/70B models on dedicated NVIDIA H100 clusters running vLLM with FP8 GEMM cuts 3-year TCO by 62%-74% while anchoring TTFT below 200ms and fulfilling statutory DPDP data residency."
    },
    {
        q: "How does Elesium compare to traditional IT consultancies (TCS, Infosys, Wipro)?",
        a: "Legacy IT consultancies operate on time-and-materials billing with 6-to-12-month delivery horizons, junior billable hours, and off-the-shelf low-code wrappers. Elesium deploys production-ready pilot agents in 14 business days, delivers 100% client-owned sovereign IP, and contractually guarantees a 3x-5x cash-flow ROI SLA within 90 days."
    },
    {
        q: "What are the commercial investment tiers for enterprise implementation?",
        a: "We maintain three transparent tiers: Tier 1 (Pilot Architecture Sprint, ₹1,50,000 - ₹3,50,000, 14-day delivery); Tier 2 (Enterprise Multi-Agent Suite, ₹6,00,000 - ₹15,00,000, 30-45 day rollout with SAP/ERP connectors); and Tier 3 (Autonomous AI Engineering Pod, ₹4,50,000/month, dedicated systems pod with 1-hour critical incident SLA)."
    }
]

export default function CompareHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const categories = ['All', 'Framework Architecture', 'Infrastructure & Sovereign Cloud', 'Agency vs Low-Code', 'Delivery Model']

    const filteredBattlecards: CompareBattlecardItem[] = useMemo(() => {
        if (selectedCategory === 'All') return compareData
        return compareData.filter((item: CompareBattlecardItem) => item.category === selectedCategory)
    }, [selectedCategory])

    const aeoAnswerCapsule = "The Elesium Enterprise AI Comparison Matrix provides objective, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models. Evaluated across sub-200ms TTFT, FP8 GEMM compute efficiency, vLLM PagedAttention memory fragmentation (<4%), and DPDP Act 2023 Section 8(5) compliance on Yotta and CtrlS tier-IV datacenter clusters, these battlecards eliminate vendor marketing hype in favor of audited production telemetry."

    // Structured Data: CollectionPage, BreadcrumbList, FAQPage, WebPage
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://elesium.online/compare/#collection',
                'name': 'Enterprise AI Architecture Battlecards & Framework Comparisons | Elesium',
                'description': 'Objective, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models.',
                'url': 'https://elesium.online/compare/',
                'publisher': {
                    '@type': 'Organization',
                    'name': 'Elesium',
                    'url': 'https://elesium.online',
                    'logo': 'https://elesium.online/assets/logo-square.png'
                },
                'hasPart': compareData.map((item: CompareBattlecardItem) => ({
                    '@type': 'Article',
                    'headline': item.title,
                    'url': `https://elesium.online/compare/${item.slug}/`,
                    'description': item.metaDescription,
                    'author': {
                        '@type': 'Person',
                        '@id': 'https://elesium.online/authors/chaman-shah#person',
                        'name': 'Chaman Shah',
                        'jobTitle': 'Principal AI Systems Architect',
                        'url': 'https://elesium.online/authors/chaman-shah/'
                    }
                }))
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/compare/#breadcrumb',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': 'https://elesium.online'
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Architecture Comparisons',
                        'item': 'https://elesium.online/compare/'
                    }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/compare/#faq',
                'mainEntity': compareFaqs.map(faq => ({
                    '@type': 'Question',
                    'name': faq.q,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.a
                    }
                }))
            },
            {
                '@type': 'WebPage',
                '@id': 'https://elesium.online/compare/#webpage',
                'name': 'Enterprise AI Framework & Architecture Comparisons | Elesium',
                'description': aeoAnswerCapsule,
                'speakable': {
                    '@type': 'SpeakableSpecification',
                    'cssSelector': ['.answer-capsule', 'h1', 'h2']
                }
            }
        ]
    }

    return (
        <main id="main-content" className="min-h-screen bg-black text-white pt-24 pb-24 selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Comparisons &amp; Battlecards | Elesium</title>
                <meta
                    name="description"
                    content="Objective evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models."
                />
                <link rel="canonical" href="https://elesium.online/compare/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Enterprise AI Comparisons &amp; Battlecards | Elesium" />
                <meta
                    property="og:description"
                    content="Objective evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models."
                />
                <meta property="og:url" content="https://elesium.online/compare/" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_online" />
                <meta name="twitter:title" content="Enterprise AI Comparisons &amp; Battlecards | Elesium" />
                <meta name="twitter:description" content="Objective evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models." />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-400">
                    <Link to="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-white font-medium">Architecture Comparisons</span>
                </nav>

                {/* Hero Header */}
                <header className="mb-12">
                    <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 block mb-4">
                        Technical Comparisons
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                        How Private AI Compares
                    </h1>
                    <p className="answer-capsule text-base sm:text-lg text-neutral-400 max-w-3xl leading-relaxed">
                        Side-by-side comparisons covering self-hosted enterprise workflows versus public cloud APIs, workflow builders, and traditional IT vendors.
                    </p>
                </header>

                {/* Comparison Table */}
                <section className="mb-14 p-6 md:p-8 rounded-[28px] bg-neutral-950 border border-white/10">
                    <div className="mb-6">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold block mb-1">
                            Overview
                        </span>
                        <h2 className="text-2xl font-bold text-white">
                            Private AI Workflows vs Off-the-Shelf Options
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs md:text-sm text-neutral-300 border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-neutral-400 font-mono text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">Area</th>
                                    <th className="py-3 px-4 text-white font-bold bg-white/5">Elesium Private Builds</th>
                                    <th className="py-3 px-4">Public Cloud APIs</th>
                                    <th className="py-3 px-4">Legacy IT / RPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-mono text-xs">
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Reliability</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">Structured validation checks</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Open-ended prompts</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Rigid scripts</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Speed</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">Under 200ms response</td>
                                    <td className="py-3.5 px-4 text-neutral-400">850ms – 2,400ms shared queues</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Slow UI scraping</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Data Privacy</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">Your private cloud / servers</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Sent to outside servers</td>
                                    <td className="py-3.5 px-4 text-neutral-400">On-premise only</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Guarantee</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">90-day ROI SLA</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Best-effort uptime</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Hourly billing</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <span className="text-xs text-neutral-400">
                            Technical TCO &amp; compliance matrix comparing air-gapped VPCs against public cloud endpoints:
                        </span>
                        <a
                            href="/comparison/sovereign-ai-vs-public-cloud/"
                            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-white hover:underline"
                        >
                            <span>Sovereign AI vs Public Cloud Guide</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>

                {/* Reproducible Open-Source Evidence */}
                <section className="mb-12 p-6 sm:p-8 rounded-[28px] bg-neutral-950 border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-neutral-400">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Reproducible Open-Source Evidence</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">
                            Verify All Latency, Memory &amp; DPDP Claims Directly
                        </h2>
                        <p className="text-sm text-neutral-300 leading-relaxed">
                            Inspect raw 8x H100 vLLM telemetry, <span className="font-mono text-white">DPDP_2023_Compliance_Bench</span>, and <span className="font-mono text-white">Elesium-Indic-Sovereign-70B-FP8</span> reproducible runs.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 shrink-0">
                        <a
                            href="https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition"
                        >
                            <span>GitHub Benchmark Suite</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href="/docs/benchmarks/"
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-white/15 text-white text-xs font-semibold hover:bg-white/10 transition"
                        >
                            <span>Docs Benchmarks</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </section>

                {/* Interactive Tool Banner */}
                <section className="mb-12 p-6 sm:p-8 rounded-[28px] bg-neutral-950 border border-white/10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono tracking-wide uppercase">
                                <Gauge className="w-3.5 h-3.5" />
                                Interactive Diagnostic Asset
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">
                                Assess Your Stack: 1-Minute Enterprise Architecture Grader
                            </h2>
                            <p className="text-sm text-neutral-300 max-w-2xl">
                                Evaluate your current AI agent deployment across workflow concurrency, orchestration topology, inference boundaries, state persistence, and regulatory guardrails. Computes fragility percentage and annual token leakage.
                            </p>
                        </div>
                        <Link
                            to="/tools/agentic-architecture-grader/"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium text-sm active:scale-[0.97] transition-all duration-300 hover:bg-neutral-200 shrink-0"
                        >
                            Launch Grader Tool
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-white/10 scrollbar-none">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap active:scale-[0.97] transition-all duration-300 ${
                                selectedCategory === category
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            {category}
                            {category === 'All' && ` (${compareData.length})`}
                        </button>
                    ))}
                </div>

                {/* Battlecards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {filteredBattlecards.map(item => (
                        <article
                            key={item.id}
                            className="flex flex-col justify-between h-full p-6 rounded-[24px] bg-neutral-950 border border-white/10 hover:border-white/40 transition-all duration-300 group"
                        >
                            <div>
                                {/* Header badges */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-medium bg-white/10 text-neutral-300 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-white/5 text-neutral-400 border border-white/10">
                                        Battlecard #{item.id}
                                    </span>
                                </div>

                                {/* Comparison Title */}
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white transition-colors leading-snug">
                                    <Link to={`/compare/${item.slug}/`} className="focus:outline-none">
                                        {item.title}
                                    </Link>
                                </h3>

                                {/* Head to Head Visual Tags */}
                                <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-400 mb-4 pb-3 border-b border-white/10">
                                    <span className="text-neutral-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                        {item.entityALabel}
                                    </span>
                                    <span className="text-neutral-500 font-bold">vs</span>
                                    <span className="text-neutral-200 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                                        {item.entityBLabel}
                                    </span>
                                </div>

                                {/* Summary */}
                                <p className="text-xs text-neutral-300 mb-4 line-clamp-3 leading-relaxed">
                                    {item.verdictSummary}
                                </p>

                                {/* Fast Facts Preview */}
                                <div className="space-y-2 mb-6 bg-black p-3.5 rounded-[18px] border border-white/10">
                                    {item.fastFacts.slice(0, 2).map((fact, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <span className="text-neutral-400">{fact.label}</span>
                                            <span className="font-semibold text-white font-mono">{fact.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card Action Link */}
                            <Link
                                to={`/compare/${item.slug}/`}
                                className="inline-flex items-center justify-between w-full px-5 py-2.5 rounded-full bg-white/10 hover:bg-white hover:text-black text-neutral-200 text-xs font-semibold active:scale-[0.97] transition-all duration-300"
                            >
                                <span>Inspect Comparison Matrix</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </article>
                    ))}
                </section>

                {/* FAQ Accordion Section */}
                <section className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white">
                            Common Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {compareFaqs.map((faq, idx) => {
                            const isOpen = openFaq === idx
                            return (
                                <div
                                    key={idx}
                                    className="border border-white/10 rounded-[24px] bg-neutral-950 overflow-hidden transition-colors"
                                >
                                    <h3 className="m-0">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={`compare-hub-faq-panel-${idx}`}
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="w-full min-h-[44px] p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm md:text-base text-white transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown
                                                className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                                                    isOpen ? 'rotate-180 text-white' : ''
                                                }`}
                                            />
                                        </button>
                                    </h3>
                                    <div
                                        id={`compare-hub-faq-panel-${idx}`}
                                        aria-hidden={!isOpen}
                                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 text-xs md:text-sm text-neutral-300 leading-relaxed border-t border-white/10 pt-3">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </main>
    )
}
