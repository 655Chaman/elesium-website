import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Scale,
    ShieldCheck,
    Cpu,
    ArrowRight,
    ChevronRight,
    Activity,
    Gauge,
    Server,
    ExternalLink
} from 'lucide-react'
import { compareData, CompareBattlecardItem } from '../../data/compareData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'

export default function CompareHub() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [selectedCategory, setSelectedCategory] = useState<string>('All')

    const categories = ['All', 'Framework Architecture', 'Infrastructure & Sovereign Cloud', 'Agency vs Low-Code', 'Delivery Model']

    const filteredBattlecards: CompareBattlecardItem[] = useMemo(() => {
        if (selectedCategory === 'All') return compareData
        return compareData.filter((item: CompareBattlecardItem) => item.category === selectedCategory)
    }, [selectedCategory])

    // Structured Data: CollectionPage & BreadcrumbList
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Enterprise AI Architecture Battlecards & Framework Comparisons | Elesium',
        'description': 'Objective, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models.',
        'url': 'https://elesium.online/compare',
        'publisher': {
            '@type': 'Organization',
            'name': 'Elesium',
            'url': 'https://elesium.online',
            'logo': 'https://elesium.online/assets/LOGO_NEW.png'
        },
        'hasPart': compareData.map((item: CompareBattlecardItem) => ({
            '@type': 'Article',
            'headline': item.title,
            'url': `https://elesium.online/compare/${item.slug}`,
            'description': item.metaDescription,
            'author': {
                '@type': 'Person',
                'name': 'Chaman Shah',
                'jobTitle': 'Principal AI Systems Architect'
            }
        })),
        'breadcrumb': {
            '@type': 'BreadcrumbList',
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
                    'item': 'https://elesium.online/compare'
                }
            ]
        }
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-24 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Architecture Comparisons & Framework Battlecards | Elesium</title>
                <meta
                    name="description"
                    content="Objective, empirical evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models."
                />
                <link rel="canonical" href="https://elesium.online/compare" />
                <meta property="og:title" content="Enterprise AI Architecture Comparisons & Framework Battlecards | Elesium" />
                <meta
                    property="og:description"
                    content="Objective, empirical evaluations of multi-agent frameworks, sovereign inference clusters, deterministic state machines, and enterprise automation delivery models."
                />
                <meta property="og:url" content="https://elesium.online/compare" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">Architecture Comparisons</span>
                </nav>

                {/* Hero Header */}
                <header className="mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 text-blue-700 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
                        <Scale className="w-3.5 h-3.5" />
                        Programmatic Architectural Battlecards
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white mb-4 leading-tight">
                        Enterprise AI Framework & Architecture Comparisons
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-4xl leading-relaxed">
                        Deterministic, mathematically grounded evaluations of multi-agent frameworks, sovereign inference clusters, state machine engines, and enterprise automation delivery models. No superficial vendor marketing—only empirical latency benchmarks, token economics, and failure recovery protocols.
                    </p>

                    {/* Trust Badges */}
                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs text-gray-700 dark:text-gray-300">
                            <Activity className="w-3.5 h-3.5 text-blue-500" />
                            <span>6 In-Depth Technical Battlecards</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs text-gray-700 dark:text-gray-300">
                            <Server className="w-3.5 h-3.5 text-emerald-500" />
                            <span>P99 Latency & TCO Benchmarks</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 text-xs text-gray-700 dark:text-gray-300">
                            <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                            <span>DPDP Act 2023 & SOC-2 Compliant</span>
                        </div>
                    </div>
                </header>

                {/* Interactive Tool Banner */}
                <section className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-blue-900/20 via-slate-900/30 to-purple-900/20 border border-blue-500/30 dark:border-blue-400/20 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold tracking-wide uppercase">
                                <Gauge className="w-3.5 h-3.5" />
                                Interactive Diagnostic Asset
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                                Assess Your Stack: 1-Minute Enterprise Architecture Grader
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-2xl">
                                Evaluate your current AI agent deployment across workflow concurrency, orchestration topology, inference boundaries, state persistence, and regulatory guardrails. Computes fragility percentage and annual token leakage.
                            </p>
                        </div>
                        <Link
                            to="/tools/agentic-architecture-grader"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-md hover:shadow-blue-500/25 shrink-0"
                        >
                            Launch Grader Tool
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </section>

                {/* Category Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-gray-200 dark:border-neutral-800 scrollbar-none">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                                selectedCategory === category
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-800'
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
                            className="flex flex-col justify-between p-6 rounded-2xl bg-gray-50/70 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-200 group"
                        >
                            <div>
                                {/* Header badges */}
                                <div className="flex items-center justify-between gap-2 mb-3">
                                    <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-gray-200/80 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                        {item.category}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                            item.slug === 'elesium-vs-traditional-it-consultancies' || item.slug === 'deterministic-state-machines-vs-react-agents'
                                                ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                                : 'bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                        }`}
                                    >
                                        Battlecard #{item.id}
                                    </span>
                                </div>

                                {/* Comparison Title */}
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                                    <Link to={`/compare/${item.slug}`} className="focus:outline-none">
                                        {item.title}
                                    </Link>
                                </h3>

                                {/* Head to Head Visual Tags */}
                                <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-500 dark:text-gray-400 mb-4 pb-3 border-b border-gray-200 dark:border-neutral-800">
                                    <span className="text-gray-800 dark:text-gray-200 bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                                        {item.entityALabel}
                                    </span>
                                    <span className="text-blue-500 font-bold">vs</span>
                                    <span className="text-gray-800 dark:text-gray-200 bg-white dark:bg-neutral-800 px-2 py-1 rounded border border-gray-200 dark:border-neutral-700">
                                        {item.entityBLabel}
                                    </span>
                                </div>

                                {/* Summary */}
                                <p className="text-xs text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed">
                                    {item.verdictSummary}
                                </p>

                                {/* Fast Facts Preview */}
                                <div className="space-y-2 mb-6 bg-white dark:bg-neutral-950/50 p-3 rounded-xl border border-gray-200/80 dark:border-neutral-800">
                                    {item.fastFacts.slice(0, 2).map((fact, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs">
                                            <span className="text-gray-500 dark:text-gray-400">{fact.label}</span>
                                            <span className="font-semibold text-gray-900 dark:text-white font-mono">{fact.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Card Action Link */}
                            <Link
                                to={`/compare/${item.slug}`}
                                className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-blue-600 dark:bg-neutral-800 dark:hover:bg-blue-600 text-gray-900 hover:text-white dark:text-gray-200 dark:hover:text-white text-xs font-semibold transition-all group-hover:shadow-sm"
                            >
                                <span>Inspect Comparison Matrix</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </article>
                    ))}
                </section>

                {/* FAQ & Architectural Philosophy Section */}
                <section className="mb-16 p-8 rounded-3xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800">
                    <div className="max-w-3xl mb-8">
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            Evaluation Standards
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white mt-1">
                            How Elesium Conducts Architectural Benchmarks
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                            Unlike developer marketing blogs or generic review directories, our evaluations are grounded in verifiable distributed systems mechanics, production SLA telemetry, and total cost of ownership.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                                <Cpu className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-950 dark:text-white mb-2">Deterministic State vs Heuristic Loops</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                We measure whether an architecture relies on unconstrained LLM loops (prone to hallucinations and infinite recursions) or deterministic finite state machine (FSM) state graphs with explicit state schemas.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                                <Server className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-950 dark:text-white mb-2">Sovereign Boundary vs Third-Party Telemetry</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                We evaluate data egress, data retention, and residency compliance. Architectures with strict zero third-party retention and dedicated VPC hosting protect enterprises under statutory regulations like DPDP Act 2023.
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                                <Scale className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-sm text-gray-950 dark:text-white mb-2">Marginal Cost at Scale</h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                We model 3-year TCO factoring in exponential token accumulation in multi-agent conversations versus self-hosted quantized models on dedicated GPU clusters (vLLM / TensorRT-LLM).
                            </p>
                        </div>
                    </div>
                </section>

                {/* Conversion & Direct Audit CTA */}
                <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-gray-900 to-black text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                            Direct Principal Consultation
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                            Need a Custom Architectural Audit for Your Enterprise Stack?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            Schedule a 1-on-1 architecture teardown with Chaman Shah, Principal AI Systems Architect. We will dissect your workflow topologies, benchmark your latency bottlenecks, and design a sovereign, production-hardened roadmap.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <ExpandableScreen>
                                <ExpandableScreenTrigger>
                                    <InteractiveHoverButton className="bg-blue-600 text-white border-blue-500 hover:bg-blue-500 px-8 py-3 text-sm">
                                        Book Technical Architecture Audit
                                    </InteractiveHoverButton>
                                </ExpandableScreenTrigger>
                                <ExpandableScreenContent>
                                    <MandateApplicationForm />
                                </ExpandableScreenContent>
                            </ExpandableScreen>

                            <button
                                onClick={() => openWhatsApp()}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm transition-all border border-neutral-700"
                            >
                                Inquire via Direct Desk
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <WhatsAppModal />
        </main>
    )
}
