import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Search,
    X,
    ChevronRight,
    ArrowRight,
    ShieldCheck,
    Truck,
    HeartPulse,
    Factory,
    Shield
} from 'lucide-react'
import {
    commercialSolutions,
    commercialSectors,
    CommercialSolution,
    SectorFilterOption
} from '../../data/commercialDirectoryData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

interface ThematicCategory {
    key: 'bfsi' | 'logistics' | 'healthcare' | 'manufacturing' | 'defense'
    cluster: string
    name: string
    icon: React.ComponentType<{ className?: string }>
    tagline: string
    description: string
}

const thematicCategories: ThematicCategory[] = [
    {
        key: 'bfsi',
        cluster: 'Cluster 01',
        name: 'BFSI & Fintech',
        icon: ShieldCheck,
        tagline: 'Sub-200ms Core Banking Telemetry & Sovereign DPDP-Compliant State Machines',
        description: 'Air-gapped private VPC inference clusters, immutable Merkle audit trails, and deterministic ledger reconciliation for scheduled commercial banks, NBFCs, and payment aggregators.'
    },
    {
        key: 'logistics',
        cluster: 'Cluster 02',
        name: 'Logistics & Supply Chain',
        icon: Truck,
        tagline: 'Automated E-Way Bill Dispatch, Customs ICEGATE, & Port 9000 Tally Integration',
        description: 'End-to-end multi-agent dispatch pipelines connecting shopfloor manifests, national logistics transport networks, and automated GSTN tax compliance engines.'
    },
    {
        key: 'healthcare',
        cluster: 'Cluster 03',
        name: 'Healthcare & Life Sciences',
        icon: HeartPulse,
        tagline: 'Air-Gapped Clinical LLM Enclaves, ABDM M3 Consent, & DISHA Compliance',
        description: 'HIPAA and DISHA-certified clinical copilots, zero-trust biomedical IoT monitoring, and volatile VRAM de-identification for hospital networks and pharmaceutical R&D.'
    },
    {
        key: 'manufacturing',
        cluster: 'Cluster 04',
        name: 'Manufacturing & SCADA',
        icon: Factory,
        tagline: 'Purdue Model Level-2 Isolation, Sub-8ms Machine Vision, & PLC Work Order Confirmation',
        description: 'Deterministic Modbus-TCP and industrial IoT gateway agents synchronizing shopfloor programmable logic controllers with enterprise SAP S/4HANA and MES stacks.'
    },
    {
        key: 'defense',
        cluster: 'Cluster 05',
        name: 'Sovereign Defense',
        icon: Shield,
        tagline: 'Air-Gapped Sovereign Compute Enclaves, ML-KEM-1024, & Zero-Leakage Avionics',
        description: 'Military-grade cryptographic encapsulation, isolated prefill-decode architectures, and immutable system prompt locking for defense installations and critical infrastructure.'
    }
]

export default function CommercialDirectory() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [selectedSector, setSelectedSector] = useState<SectorFilterOption['key']>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Categorized solutions filtered by search query and active sector
    const visibleCategories = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()

        return thematicCategories
            .filter((cat) => selectedSector === 'all' || selectedSector === cat.key)
            .map((cat) => {
                const solutions = commercialSolutions.filter((sol) => {
                    if (sol.sectorKey !== cat.key) return false
                    if (!query) return true

                    const searchCorpus = [
                        sol.title,
                        sol.anchorText,
                        sol.description,
                        sol.metro,
                        sol.sector,
                        sol.slug,
                        ...sol.complianceTags,
                        ...sol.architectureBadges
                    ]
                        .join(' ')
                        .toLowerCase()

                    return searchCorpus.includes(query)
                })
                return { ...cat, solutions }
            })
            .filter((cat) => cat.solutions.length > 0)
    }, [selectedSector, searchQuery])

    const totalMatching = useMemo(() => {
        return visibleCategories.reduce((acc, cat) => acc + cat.solutions.length, 0)
    }, [visibleCategories])

    // Structured Data: CollectionPage schema matching SolutionsHub.tsx
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': 'Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory',
        'description':
            'Explore Elesium’s top 100 high-intent commercial enterprise AI solutions across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense.',
        'url': 'https://elesium.online/commercial-directory.html',
        'publisher': {
            '@type': 'Organization',
            'name': 'Elesium',
            'url': 'https://elesium.online',
            'logo': 'https://elesium.online/assets/LOGO_NEW.png'
        },
        'hasPart': commercialSolutions.map((item) => ({
            '@type': 'Service',
            'name': item.anchorText,
            'url': item.canonicalUrl || `https://elesium.online/solutions/${item.slug}`,
            'description': item.description,
            'provider': {
                '@type': 'Organization',
                'name': 'Elesium',
                'url': 'https://elesium.online'
            }
        })),
        'mainEntity': {
            '@type': 'ItemList',
            'name': 'Top 100 Commercial Enterprise AI Solutions',
            'numberOfItems': commercialSolutions.length,
            'itemListElement': commercialSolutions.map((item, index) => ({
                '@type': 'ListItem',
                'position': index + 1,
                'name': item.anchorText,
                'item': item.canonicalUrl || `https://elesium.online/solutions/${item.slug}`
            }))
        },
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
                },
                {
                    '@type': 'ListItem',
                    'position': 3,
                    'name': 'Commercial Priority Directory',
                    'item': 'https://elesium.online/commercial-directory.html'
                }
            ]
        }
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory | Elesium</title>
                <meta
                    name="description"
                    content="Explore Elesium's top 100 high-intent commercial enterprise AI solutions across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense. Air-gapped VPCs, DPDP Act 2023 compliance, sub-200ms SLAs."
                />
                <link rel="canonical" href="https://elesium.online/commercial-directory.html" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://elesium.online/commercial-directory.html" />
                <meta property="og:site_name" content="Elesium" />
                <meta
                    property="og:title"
                    content="Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory | Elesium"
                />
                <meta
                    property="og:description"
                    content="Explore Elesium's top 100 high-intent commercial enterprise AI solutions across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense. Air-gapped VPCs, DPDP Act 2023 compliance, sub-200ms SLAs."
                />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Top 100 Commercial Enterprise AI Solutions Directory | Elesium" />
                <meta
                    name="twitter:description"
                    content="Priority index of 100 commercial enterprise AI automation architectures across India and global hubs."
                />
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
                    <Link to="/solutions" className="hover:text-black dark:hover:text-white transition-colors">
                        Solutions
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-medium">Commercial Priority Directory</span>
                </nav>
            </div>

            {/* Clean, High-Trust Hero Header (SolutionsHub congruent) */}
            <header className="max-w-6xl mx-auto px-6 mb-16 md:mb-24">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-600 dark:text-gray-300">
                        System 2 • Commercial Priority Directory (Top 100)
                    </span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] mb-6 max-w-4xl text-gray-900 dark:text-white">
                    Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory
                </h1>

                <div className="max-w-3xl space-y-4 text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                    <p>
                        Elesium engineers deterministic multi-agent systems and sovereign private VPC infrastructure for enterprise leaders who require contractual execution guarantees, zero data leakage, and rigorous statutory compliance.
                    </p>
                    <p>
                        Explore 100 production-ready commercial architectures spanning BFSI, Logistics, Healthcare, SCADA Manufacturing, and Sovereign Defense. Every deployment features air-gapped private subnets, sub-200ms SLAs, and verified DPDP Act 2023 adherence.
                    </p>
                </div>

                {/* Trust Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8 border-t border-gray-100 dark:border-white/10">
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">100</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Priority Architecture Hubs</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">&lt; 200ms</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deterministic Latency SLA</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-gray-900 dark:text-white">100%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Private VPC Data Isolation</div>
                    </div>
                    <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="text-2xl font-mono font-semibold text-emerald-600 dark:text-emerald-400">90-Day</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Hard Contracted ROI SLA</div>
                    </div>
                </div>
            </header>

            {/* Search & Sector Filter Section */}
            <section className="max-w-6xl mx-auto px-6 mb-12">
                {/* Search Input */}
                <div className="relative w-full mb-6">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search 100 enterprise solutions by keyword, metro, or regulation..."
                        className="w-full pl-11 pr-10 py-3.5 bg-gray-50/70 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:border-black dark:focus:border-white/40 transition-all"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                            aria-label="Clear search query"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Sector filter tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {commercialSectors.map((sector) => {
                        const isSelected = selectedSector === sector.key
                        return (
                            <button
                                key={sector.key}
                                onClick={() => setSelectedSector(sector.key)}
                                className={`px-4 py-2 rounded-full text-xs font-mono whitespace-nowrap transition-all border ${
                                    isSelected
                                        ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-medium shadow-sm'
                                        : 'border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-white/20'
                                }`}
                            >
                                <span>{sector.label}</span>
                                <span className="ml-1.5 opacity-70">({sector.count})</span>
                            </button>
                        )
                    })}
                </div>

                {/* Results meta and reset button */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-mono mt-3 px-1">
                    <span>
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{totalMatching}</span> of{' '}
                        {commercialSolutions.length} solutions
                        {selectedSector !== 'all' && (
                            <span>
                                {' '}
                                in{' '}
                                <span className="text-gray-900 dark:text-white">
                                    {commercialSectors.find((s) => s.key === selectedSector)?.label}
                                </span>
                            </span>
                        )}
                        {searchQuery && (
                            <span>
                                {' '}
                                matching &ldquo;<span className="text-gray-900 dark:text-white">{searchQuery}</span>&rdquo;
                            </span>
                        )}
                    </span>
                    {(searchQuery || selectedSector !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedSector('all')
                            }}
                            className="text-emerald-600 dark:text-emerald-400 hover:underline transition-colors"
                        >
                            Reset Filters
                        </button>
                    )}
                </div>
            </section>

            {/* 5 Thematic Category Panels (SolutionsHub congruent) */}
            <main className="max-w-6xl mx-auto px-6 space-y-12">
                {visibleCategories.length === 0 ? (
                    <div className="p-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] text-center my-12">
                        <Search className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No Matching Architecture Specs Found
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                            No commercial architectures matched &ldquo;{searchQuery}&rdquo;. Try adjusting keywords or clearing the search filter.
                        </p>
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedSector('all')
                            }}
                            className="px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-mono font-medium hover:opacity-90 transition-all"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    visibleCategories.map((category) => {
                        const IconComponent = category.icon

                        return (
                            <section
                                key={category.key}
                                id={category.key}
                                className="p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm mb-12"
                            >
                                {/* Panel Header */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 mb-8 border-b border-gray-100 dark:border-white/5">
                                    <div className="space-y-2 max-w-2xl">
                                        <div className="flex items-center gap-2.5">
                                            <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white">
                                                <IconComponent className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                                {category.cluster}
                                            </span>
                                        </div>

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
                                        <span>{category.solutions.length} Priority Architectures</span>
                                    </div>
                                </div>

                                {/* Child solutions grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {category.solutions.map((solution: CommercialSolution) => (
                                        <Link
                                            key={solution.slug}
                                            to={`/solutions/${solution.slug}`}
                                            className="group relative flex flex-col justify-between p-6 rounded-xl border border-gray-200/90 dark:border-white/5 bg-gray-50/40 dark:bg-white/[0.02] hover:border-black dark:hover:border-white/40 hover:bg-white dark:hover:bg-white/[0.04] transition-all"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 dark:text-gray-500 truncate">
                                                        Metro: {solution.metro}
                                                    </span>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-gray-200 dark:border-white/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                                                        {solution.architectureBadges[0] || 'Air-Gapped VPC'}
                                                    </span>
                                                </div>

                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                                                    {solution.anchorText}
                                                </h3>

                                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                                                    {solution.description}
                                                </p>
                                            </div>

                                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs">
                                                <span className="font-mono text-gray-400 dark:text-gray-500">
                                                    &lt; 200ms Execution SLA
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
                    })
                )}
            </main>

            {/* Bottom Call to Action Card (SolutionsHub congruent) */}
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
                                to="/waitlist"
                                className="w-full sm:w-auto h-11 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                            >
                                <span>ele-in SaaS Waitlist</span>
                                <span>&rarr;</span>
                            </Link>
                        </div>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                        <img src="/assets/LOGO_NEW.png" alt="Elesium" className="w-96 h-96 object-contain filter invert" />
                    </div>
                </div>
            </section>
        </div>
    )
}
