import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database,
    ArrowRight,
    ChevronRight,
    Lock,
    Network,
    Terminal
} from 'lucide-react'
import { solutionCategories, getTopHighLeverSolutions, SolutionRecord } from '../../data/solutionsData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database
}

export default function SolutionsHub() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const topHighLever = getTopHighLeverSolutions()

    // Structured Data: CollectionPage schema
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Enterprise AI Solutions & Sovereign Automation Workflows',
        'description': 'Direct index of production enterprise AI automation solutions and sovereign multi-agent workflows engineered by Elesium.',
        'url': 'https://elesium.online/solutions',
        'publisher': {
            '@type': 'Organization',
            'name': 'Elesium',
            'url': 'https://elesium.online',
            'logo': 'https://elesium.online/assets/LOGO_NEW.png'
        },
        'hasPart': solutionCategories.flatMap(cat =>
            cat.solutions.map(sol => ({
                '@type': 'Service',
                'name': sol.h1,
                'url': `https://elesium.online/solutions/${sol.slug}`,
                'description': sol.metaDescription,
                'provider': {
                    '@type': 'Organization',
                    'name': 'Elesium'
                }
            }))
        ),
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
                    'name': 'Solutions',
                    'item': 'https://elesium.online/solutions'
                }
            ]
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Solutions & Sovereign Automation Workflows | Elesium</title>
                <meta
                    name="description"
                    content="Directory of deterministic, sovereign enterprise AI automation solutions across logistics, BFSI, manufacturing, healthcare, and ERP integration."
                />
                <link rel="canonical" href="https://elesium.online/solutions" />
                <meta property="og:title" content="Enterprise AI Solutions & Sovereign Automation Workflows | Elesium" />
                <meta
                    property="og:description"
                    content="Explore 26 production-grade AI solutions for enterprise automation. Sub-2s execution latency, zero data retention, and private VPC deployment."
                />
                <meta property="og:url" content="https://elesium.online/solutions" />
                <meta property="og:type" content="website" />
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
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
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
            </header>

            {/* Top High-Lever Solutions Quick Jump Bar (1-Click Crawl Depth from Hub) */}
            <section className="max-w-6xl mx-auto px-6 mb-16">
                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-white/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
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
                                to={`/solutions/${item.slug}`}
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
                                        to={`/solutions/${solution.slug}`}
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

            {/* Bottom Call to Action Card (Sturm Module 6 & 10) */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="relative overflow-hidden p-8 sm:p-12 md:p-16 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-900 text-white dark:bg-white/[0.03] shadow-2xl">
                    <div className="relative z-10 max-w-2xl space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                            <Lock className="w-3 h-3 text-emerald-400" />
                            <span>Private Sovereign VPC Deployment Protocol</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight leading-tight">
                            Request a Deterministic AI Architecture Audit for Your Enterprise
                        </h2>

                        <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 leading-relaxed">
                            Schedule a 30-minute technical evaluation directly with our Systems Engineering Pod.
                            We review your SAP/Oracle ledgers, legacy workflows, and data governance policies,
                            delivering a formal 1-page feasibility memorandum with zero obligation.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <button
                                onClick={openWhatsApp}
                                className="px-6 py-3 rounded-xl bg-white text-black hover:bg-gray-100 font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-sm"
                            >
                                Schedule WhatsApp Technical Review
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <ExpandableScreen>
                                <ExpandableScreenTrigger>
                                    <InteractiveHoverButton className="h-11 px-6 text-sm">
                                        Submit Architecture Mandate
                                    </InteractiveHoverButton>
                                </ExpandableScreenTrigger>
                                <ExpandableScreenContent>
                                    <MandateApplicationForm source="Solutions Hub CTA" />
                                </ExpandableScreenContent>
                            </ExpandableScreen>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                        <Network className="w-96 h-96 text-white" />
                    </div>
                </div>
            </section>
        </div>
    )
}
