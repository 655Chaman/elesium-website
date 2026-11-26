import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Scale,
    ShieldCheck,
    Cpu,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Activity,
    Gauge,
    Server,
    CheckCircle2,
    Zap
} from 'lucide-react'
import { compareData, CompareBattlecardItem } from '../../data/compareData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

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
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
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
                        '@id': 'https://elesium.online/authors/chaman-shah/#person',
                        'name': 'Chaman Shah',
                        'jobTitle': 'Principal AI Systems Architect'
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
                <meta name="twitter:site" content="@elesium_ai" />
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
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-mono uppercase tracking-wider mb-4">
                        Programmatic Architectural Battlecards
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 leading-tight">
                        Enterprise AI Framework &amp; Architecture Comparisons
                    </h1>
                    <p className="text-base sm:text-lg text-neutral-300 max-w-4xl leading-relaxed">
                        Deterministic, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, state machine engines, and enterprise automation delivery models. Empirical latency benchmarks, token economics, and failure recovery protocols.
                    </p>

                    {/* Technical Overview */}
                    <div className="answer-capsule mt-6 p-6 sm:p-7 rounded-[24px] bg-neutral-950 border border-white/10 border-l-4 border-l-white max-w-4xl">
                        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold mb-2 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-white" />
                            Architectural Specifications
                        </div>
                        <p className="text-sm md:text-base text-neutral-200 leading-relaxed font-medium">
                            {aeoAnswerCapsule}
                        </p>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-300 font-mono">
                            <Activity className="w-3.5 h-3.5 text-neutral-400" />
                            <span>12 In-Depth Technical Battlecards</span>
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-300 font-mono">
                            <Server className="w-3.5 h-3.5 text-white" />
                            <span>Sub-200ms TTFT &amp; FP8 GEMM</span>
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-300 font-mono">
                            <ShieldCheck className="w-3.5 h-3.5 text-white" />
                            <span>DPDP Act 2023 Sec 8(5) &amp; ISO 27001</span>
                        </div>
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-950 border border-white/10 text-xs text-neutral-300 font-mono">
                            <Zap className="w-3.5 h-3.5 text-white" />
                            <span>Yotta Shakti &amp; CtrlS Clusters</span>
                        </div>
                    </div>
                </header>

                {/* Empirical Telemetry Comparison Matrix */}
                <section className="mb-14 p-6 md:p-8 rounded-[28px] bg-neutral-950 border border-white/10">
                    <div className="mb-6">
                        <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold mb-1">
                            Audited Production Benchmarks
                        </div>
                        <h2 className="text-2xl font-bold text-white">
                            Sovereign LangGraph Architecture vs Legacy Ecosystems
                        </h2>
                        <p className="text-sm text-neutral-400 mt-1">
                            Empirical engineering telemetry measured across 1,420+ enterprise workflow executions.
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs md:text-sm text-neutral-300 border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 text-neutral-400 font-mono text-xs uppercase tracking-wider">
                                    <th className="py-3 px-4">Architectural Metric</th>
                                    <th className="py-3 px-4 text-white font-bold bg-white/5">Elesium Sovereign Pods</th>
                                    <th className="py-3 px-4">Public Cloud APIs (ReAct)</th>
                                    <th className="py-3 px-4">Legacy IT / RPA</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-mono text-xs">
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Execution Paradigm</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">Deterministic FSM (LangGraph)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Heuristic Loop (CrewAI / AutoGen)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Brittle Rule Engine (UiPath)</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Time to First Token (TTFT)</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">&lt; 200ms (vLLM FP8 Kernel)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">850ms - 2,400ms (Shared Gateway)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">N/A (Static Screen Scraping)</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Memory Allocation</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">PagedAttention (&lt;4% fragmentation)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Blackbox Multi-Tenant VRAM</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Local OS RAM Swapping</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Data Sovereignty &amp; DPDP</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">Yotta/CtrlS India Tier-IV (Sec 8(5))</td>
                                    <td className="py-3.5 px-4 text-neutral-400">US-West / Global Egress Risk</td>
                                    <td className="py-3.5 px-4 text-neutral-400">On-Premise Legacy Client</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">3-Year Enterprise TCO</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">-68% (Self-Hosted Fixed Compute)</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Unbounded Token Ingestion Billing</td>
                                    <td className="py-3.5 px-4 text-neutral-400">₹40L+ Annual License Seats</td>
                                </tr>
                                <tr>
                                    <td className="py-3.5 px-4 font-semibold text-white font-sans">Contractual SLA</td>
                                    <td className="py-3.5 px-4 text-white font-bold bg-white/5">90-Day Cash-Flow ROI Guarantee</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Best-Effort API Uptime</td>
                                    <td className="py-3.5 px-4 text-neutral-400">Billable Hours / No SLA</td>
                                </tr>
                            </tbody>
                        </table>
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

                {/* Evaluation Standards */}
                <section className="mb-16 p-8 rounded-[28px] bg-neutral-950 border border-white/10">
                    <div className="max-w-3xl mb-8">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                            Evaluation Standards
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                            How Elesium Conducts Architectural Benchmarks
                        </h2>
                        <p className="text-sm text-neutral-300 mt-2">
                            Unlike developer marketing blogs or generic review directories, our evaluations are grounded in verifiable distributed systems mechanics, production SLA telemetry, and total cost of ownership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-[20px] bg-black border border-white/10 h-full flex flex-col">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                                <Cpu className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-sm text-white mb-2">Deterministic State vs Heuristic Loops</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                We measure whether an architecture relies on unconstrained LLM loops (prone to hallucinations and infinite recursions) or deterministic finite state machine (FSM) state graphs with explicit state schemas.
                            </p>
                        </div>

                        <div className="p-6 rounded-[20px] bg-black border border-white/10 h-full flex flex-col">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                                <Server className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-sm text-white mb-2">Sovereign Boundary vs Third-Party Telemetry</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                We evaluate data egress, data retention, and residency compliance. Architectures with strict zero third-party retention and dedicated VPC hosting protect enterprises under statutory regulations like DPDP Act 2023.
                            </p>
                        </div>

                        <div className="p-6 rounded-[20px] bg-black border border-white/10 h-full flex flex-col">
                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white mb-3">
                                <Scale className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="font-bold text-sm text-white mb-2">Marginal Cost at Scale</h3>
                            <p className="text-xs text-neutral-400 leading-relaxed">
                                We model 3-year TCO factoring in exponential token accumulation in multi-agent conversations versus self-hosted quantized models on dedicated GPU clusters (vLLM / TensorRT-LLM).
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3-Tier Enterprise Commercial Schedule */}
                <section className="mb-16 p-8 sm:p-10 rounded-[32px] bg-neutral-950 border border-white/10">
                    <div className="text-center max-w-3xl mx-auto mb-10">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                            Commercial Investment Matrix
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                            Transparent Enterprise Engagement Tiers
                        </h2>
                        <p className="text-sm text-neutral-400 mt-2">
                            Contractually bound engineering sprints backed by our 90-day cash-flow ROI SLA.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 sm:p-7 rounded-[24px] bg-black border border-white/10 flex flex-col justify-between h-full">
                            <div>
                                <div className="text-xs font-mono text-neutral-400 mb-1">TIER 01 &middot; PROTOTYPE</div>
                                <h3 className="text-xl font-bold text-white">Pilot Architecture Sprint</h3>
                                <div className="text-2xl font-bold text-white mt-3 font-mono">₹1,50,000 - ₹3,50,000</div>
                                <div className="text-xs text-neutral-400 mt-1 mb-4">14-Day Delivery Guarantee</div>
                                <ul className="space-y-2 text-xs text-neutral-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>Single-process LangGraph agent</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>Air-gapped staging VPC deployment</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>FastAPI + Pydantic v2 schemas</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => openWhatsApp()}
                                className="mt-6 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs active:scale-[0.97] transition-all duration-300"
                            >
                                Inquire Pilot Sprint
                            </button>
                        </div>

                        <div className="p-6 sm:p-7 rounded-[24px] bg-black border-2 border-white relative flex flex-col justify-between h-full">
                            <span className="absolute -top-3 left-6 inline-block bg-white text-black text-[10px] font-bold uppercase tracking-wider py-0.5 px-3 rounded-full">
                                Most Deployed
                            </span>
                            <div>
                                <div className="text-xs font-mono text-neutral-400 mb-1">TIER 02 &middot; PRODUCTION</div>
                                <h3 className="text-xl font-bold text-white">Enterprise Multi-Agent Suite</h3>
                                <div className="text-2xl font-bold text-white mt-3 font-mono">₹6,00,000 - ₹15,00,000</div>
                                <div className="text-xs text-neutral-400 mt-1 mb-4">30-45 Day Implementation</div>
                                <ul className="space-y-2 text-xs text-neutral-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>Collaborative Multi-Agent Triad</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>SAP S/4HANA &amp; SQL ledger connectors</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>99.9% Uptime &amp; 90-Day ROI Guarantee</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => openWhatsApp()}
                                className="mt-6 w-full py-2.5 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs active:scale-[0.97] transition-all duration-300"
                            >
                                Deploy Enterprise Suite
                            </button>
                        </div>

                        <div className="p-6 sm:p-7 rounded-[24px] bg-black border border-white/10 flex flex-col justify-between h-full">
                            <div>
                                <div className="text-xs font-mono text-neutral-400 mb-1">TIER 03 &middot; RETAINED POD</div>
                                <h3 className="text-xl font-bold text-white">Autonomous Engineering Pod</h3>
                                <div className="text-2xl font-bold text-white mt-3 font-mono">₹4,50,000 / mo</div>
                                <div className="text-xs text-neutral-400 mt-1 mb-4">Continuous Scale &amp; Fine-Tuning</div>
                                <ul className="space-y-2 text-xs text-neutral-300">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>3 Dedicated AI systems engineers</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>Continuous LoRA fine-tuning &amp; vLLM optimization</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
                                        <span>1-Hour Critical Incident Response SLA</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={() => openWhatsApp()}
                                className="mt-6 w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs active:scale-[0.97] transition-all duration-300"
                            >
                                Retain Engineering Pod
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Accordion Section */}
                <section className="mb-16 max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
                            Technical Knowledge Base
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                            Frequently Asked Architecture Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {compareFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-white/10 rounded-[20px] bg-neutral-950 overflow-hidden transition-colors"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm md:text-base text-white transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-neutral-400 transition-transform duration-300 shrink-0 ${
                                            openFaq === idx ? 'rotate-180 text-white' : ''
                                        }`}
                                    />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                            className="accordion-panel overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 text-xs md:text-sm text-neutral-300 leading-relaxed border-t border-white/10 pt-3">
                                                {faq.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Conversion & Direct Audit CTA */}
                <section className="text-center p-8 sm:p-12 rounded-[32px] bg-black text-white border border-white/10 relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="text-xs font-mono tracking-wider uppercase text-neutral-400 block">
                            Direct Principal Consultation
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                            Need a Custom Architectural Audit for Your Enterprise Stack?
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                            Connect directly with Chaman Shah, Principal AI Systems Architect. We will dissect your workflow topologies, benchmark your latency bottlenecks, and design a sovereign, production-hardened roadmap.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <button
                                onClick={() => openWhatsApp()}
                                className="w-full sm:w-auto h-11 px-7 rounded-full bg-white text-black hover:bg-neutral-200 font-semibold text-xs sm:text-sm active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <Link
                                to="/waitlist/"
                                className="w-full sm:w-auto h-11 px-7 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm active:scale-[0.97] transition-all duration-300 flex items-center justify-center gap-1.5"
                            >
                                <span>ele-in SaaS Waitlist</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>

            <WhatsAppModal />
        </main>
    )
}
