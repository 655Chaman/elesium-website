import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    X,
    ChevronRight,
    ArrowRight,
    Building2,
    Truck,
    HeartPulse,
    Factory,
    Shield,
    MapPin,
    Cpu,
    CheckCircle2,
    Layers,
    Sparkles
} from 'lucide-react'
import {
    commercialSolutions,
    commercialSectors,
    CommercialSolution,
    SectorFilterOption
} from '../../data/commercialDirectoryData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const sectorIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    bfsi: Building2,
    logistics: Truck,
    healthcare: HeartPulse,
    manufacturing: Factory,
    defense: Shield
}

const sectorBadgeStyles: Record<string, { pill: string; text: string; bg: string }> = {
    bfsi: {
        pill: 'border-emerald-500/30 bg-emerald-950/30 text-emerald-300',
        text: 'text-emerald-400',
        bg: 'from-emerald-500/10 via-transparent to-transparent'
    },
    logistics: {
        pill: 'border-amber-500/30 bg-amber-950/30 text-amber-300',
        text: 'text-amber-400',
        bg: 'from-amber-500/10 via-transparent to-transparent'
    },
    healthcare: {
        pill: 'border-rose-500/30 bg-rose-950/30 text-rose-300',
        text: 'text-rose-400',
        bg: 'from-rose-500/10 via-transparent to-transparent'
    },
    manufacturing: {
        pill: 'border-sky-500/30 bg-sky-950/30 text-sky-300',
        text: 'text-sky-400',
        bg: 'from-sky-500/10 via-transparent to-transparent'
    },
    defense: {
        pill: 'border-purple-500/30 bg-purple-950/30 text-purple-300',
        text: 'text-purple-400',
        bg: 'from-purple-500/10 via-transparent to-transparent'
    }
}

export default function CommercialDirectory() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [selectedSector, setSelectedSector] = useState<SectorFilterOption['key']>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Filter solutions dynamically
    const filteredSolutions = useMemo(() => {
        const query = searchQuery.trim().toLowerCase()
        return commercialSolutions.filter((item) => {
            const matchesSector = selectedSector === 'all' || item.sectorKey === selectedSector
            if (!matchesSector) return false

            if (!query) return true

            const searchCorpus = [
                item.title,
                item.anchorText,
                item.description,
                item.metro,
                item.sector,
                item.slug,
                ...item.complianceTags,
                ...item.architectureBadges
            ].join(' ').toLowerCase()

            return searchCorpus.includes(query)
        })
    }, [selectedSector, searchQuery])

    // Pre-calculate counts per sector based on search query if needed
    const currentCount = filteredSolutions.length

    // Structured Data: CollectionPage & ItemList JSON-LD
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://elesium.online/#organization',
                'name': 'Elesium',
                'alternateName': ['Elesium Online', 'Elesium Enterprise AI', 'Elesium India'],
                'url': 'https://elesium.online',
                'logo': 'https://elesium.online/og-image.png'
            },
            {
                '@type': 'WebSite',
                '@id': 'https://elesium.online/#website',
                'url': 'https://elesium.online',
                'name': 'Elesium Enterprise AI'
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/commercial-directory.html#breadcrumbs',
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
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': 'Commercial Priority Directory',
                        'item': 'https://elesium.online/commercial-directory.html'
                    }
                ]
            },
            {
                '@type': 'CollectionPage',
                '@id': 'https://elesium.online/commercial-directory.html#collection',
                'url': 'https://elesium.online/commercial-directory.html',
                'name': 'Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory',
                'description': 'Explore Elesium’s top 100 high-intent commercial enterprise AI solutions across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense.',
                'mainEntity': {
                    '@type': 'ItemList',
                    'name': 'Top 100 Commercial Enterprise AI Solutions',
                    'numberOfItems': commercialSolutions.length,
                    'itemListElement': commercialSolutions.map((item, index) => ({
                        '@type': 'ListItem',
                        'position': index + 1,
                        'name': item.anchorText,
                        'item': item.canonicalUrl
                    }))
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 antialiased selection:bg-cyan-500 selection:text-black pt-24 pb-24 relative overflow-hidden">
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
                <meta property="og:title" content="Top 100 Commercial Enterprise AI Solutions & Sovereign Architecture Directory | Elesium" />
                <meta
                    property="og:description"
                    content="Explore Elesium's top 100 high-intent commercial enterprise AI solutions across BFSI, Logistics, Healthcare, Manufacturing, and Sovereign Defense."
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

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[550px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-slate-950/40 to-transparent pointer-events-none" />
            <div className="absolute top-96 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-[800px] -right-48 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Breadcrumbs Navigation */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-8 sm:mb-12">
                    <Link to="/" className="hover:text-cyan-400 transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <Link to="/solutions" className="hover:text-cyan-400 transition-colors">
                        Solutions
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    <span className="text-slate-200 font-medium tracking-wide">
                        Commercial Priority Directory
                    </span>
                </nav>

                {/* Hero Header */}
                <header className="mb-14 sm:mb-20">
                    {/* Glowing Live Radar Pill */}
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-6 sm:mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                        </span>
                        <span className="tracking-widest uppercase font-semibold text-[11px] sm:text-xs">
                            TOP 100 COMMERCIAL ENTERPRISE AI DIRECTORY
                        </span>
                    </div>

                    {/* Powerful H1 */}
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 text-white max-w-5xl">
                        Top 100 Commercial Enterprise AI Solutions &amp; Sovereign Architecture Directory
                    </h1>

                    {/* Rich Technical Subtitle */}
                    <p className="max-w-3xl text-base sm:text-lg text-slate-400 leading-relaxed font-normal mb-10">
                        Production-grade deterministic automation workflows, private VPC inference clusters, and
                        sovereign multi-agent state machines engineered for mission-critical Indian and global enterprises.
                        Every architecture is guaranteed sub-200ms execution latency with 100% zero-egress data sovereignty.
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4">
                        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md hover:border-slate-700/80 transition-all">
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
                                <span>100</span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-sans font-medium">Verified</span>
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2">Priority Hubs</div>
                            <div className="text-[11px] text-slate-500 mt-1">High-Intent Enterprise Workflows</div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md hover:border-slate-700/80 transition-all">
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
                                <span>5</span>
                                <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-sans font-medium">Sectors</span>
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2">Enterprise Sectors</div>
                            <div className="text-[11px] text-slate-500 mt-1">BFSI, Supply Chain, Healthcare, SCADA, Defense</div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md hover:border-slate-700/80 transition-all">
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-cyan-400 tracking-tight flex items-center gap-2">
                                <span>&lt; 200ms</span>
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2">Execution SLA</div>
                            <div className="text-[11px] text-slate-500 mt-1">Deterministic P99 Latency SLA</div>
                        </div>

                        <div className="p-5 rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md hover:border-slate-700/80 transition-all">
                            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-tight flex items-center gap-2">
                                <span>100%</span>
                            </div>
                            <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mt-2">Zero-Egress Air-Gapped</div>
                            <div className="text-[11px] text-slate-500 mt-1">DPDP Act 2023 &amp; RBI CSF Safe Harbors</div>
                        </div>
                    </div>
                </header>

                {/* Search & Filter Controls Bar */}
                <div className="mb-10 space-y-6">
                    {/* Instant Search Input */}
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none text-slate-400">
                            <Search className="w-5 h-5 text-cyan-400/80" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search 100 enterprise solutions by keyword, metro, sector, or regulation..."
                            className="w-full pl-12 sm:pl-14 pr-12 py-4 bg-slate-900/60 border border-slate-800/90 rounded-2xl text-slate-100 placeholder-slate-500 text-sm sm:text-base focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 backdrop-blur-md transition-all shadow-lg"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 pr-4 sm:pr-5 flex items-center text-slate-400 hover:text-white transition-colors"
                                aria-label="Clear search"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Interactive Sector Filter Tabs */}
                    <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none">
                        {commercialSectors.map((sector) => {
                            const isSelected = selectedSector === sector.key
                            const IconComponent = sector.key === 'all' ? Layers : sectorIcons[sector.key]

                            return (
                                <button
                                    key={sector.key}
                                    onClick={() => setSelectedSector(sector.key)}
                                    className={`relative whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
                                        isSelected
                                            ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                            : 'bg-slate-900/40 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700/80 hover:bg-slate-900/70'
                                    }`}
                                >
                                    {IconComponent && <IconComponent className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />}
                                    <span>{sector.label}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[11px] font-mono ${
                                            isSelected
                                                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30'
                                                : 'bg-slate-800/60 text-slate-400 border border-slate-700/50'
                                        }`}
                                    >
                                        {sector.count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* Results Count Meta */}
                    <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
                        <span>
                            Showing <span className="text-cyan-400 font-semibold">{currentCount}</span> of {commercialSolutions.length} solutions
                            {selectedSector !== 'all' && (
                                <span> in <span className="text-slate-200">{commercialSectors.find(s => s.key === selectedSector)?.label}</span></span>
                            )}
                            {searchQuery && (
                                <span> matching &ldquo;<span className="text-slate-200">{searchQuery}</span>&rdquo;</span>
                            )}
                        </span>
                        {(searchQuery || selectedSector !== 'all') && (
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedSector('all')
                                }}
                                className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Luxury Solution Cards Grid */}
                <main>
                    {filteredSolutions.length === 0 ? (
                        <div className="rounded-3xl border border-slate-800/80 bg-slate-900/30 p-12 text-center backdrop-blur-md my-12">
                            <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-white mb-2">No Matching Architecture Specs Found</h3>
                            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                                No enterprise solutions match your current search query &ldquo;{searchQuery}&rdquo;. Try adjusting your keywords or clearing the filter.
                            </p>
                            <button
                                onClick={() => {
                                    setSearchQuery('')
                                    setSelectedSector('all')
                                }}
                                className="px-5 py-2.5 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium transition-all"
                            >
                                Clear Search Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                            <AnimatePresence mode="popLayout">
                                {filteredSolutions.map((item: CommercialSolution) => {
                                    const style = sectorBadgeStyles[item.sectorKey] || {
                                        pill: 'border-cyan-500/30 bg-cyan-950/30 text-cyan-300',
                                        text: 'text-cyan-400',
                                        bg: 'from-cyan-500/10 via-transparent to-transparent'
                                    }
                                    const IconComponent = sectorIcons[item.sectorKey] || Building2

                                    return (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Link
                                                to={`/solutions/${item.slug}`}
                                                className="group relative h-full flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/90 p-6 backdrop-blur-md transition-all duration-300 hover:border-cyan-500/40 hover:shadow-[0_0_30px_rgba(6,182,212,0.12)] hover:-translate-y-1 overflow-hidden"
                                            >
                                                {/* Ambient top gradient accent */}
                                                <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${style.bg} opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none`} />

                                                <div>
                                                    {/* Top Meta Row: Sector Pill & Metro Tag */}
                                                    <div className="flex items-center justify-between gap-2 mb-4 relative z-10">
                                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono uppercase tracking-wider border font-medium ${style.pill}`}>
                                                            <IconComponent className="w-3 h-3" />
                                                            <span>{item.rawSector}</span>
                                                        </span>
                                                        <span className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400">
                                                            <MapPin className="w-3 h-3 text-slate-500" />
                                                            <span>{item.metro}</span>
                                                        </span>
                                                    </div>

                                                    {/* Card Title (Anchor Text with H2/H3 semantics) */}
                                                    <h2 className="text-base sm:text-lg font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors leading-snug mb-3">
                                                        {item.anchorText}
                                                    </h2>

                                                    {/* 2-line technical capsule description */}
                                                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed mb-5">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                <div className="relative z-10 pt-4 border-t border-slate-800/70">
                                                    {/* Architecture & Compliance Badges */}
                                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                                        {item.architectureBadges.map((badge, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/60 text-slate-300 border border-slate-700/60"
                                                            >
                                                                {badge}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Inspect Technical Spec Button */}
                                                    <div className="flex items-center justify-between text-xs font-medium text-cyan-400 group-hover:text-cyan-300 transition-colors pt-1">
                                                        <span className="font-mono text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors">
                                                            SLA: &lt;200ms
                                                        </span>
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <span>Inspect Technical Spec</span>
                                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    )}
                </main>

                {/* High-Conversion Bottom Banner */}
                <section className="mt-20 sm:mt-28 relative">
                    <div className="relative overflow-hidden p-8 sm:p-12 md:p-16 rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-slate-900/90 via-[#030712] to-black shadow-[0_0_50px_rgba(6,182,212,0.1)]">
                        {/* Subtle background glow & mesh */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/15 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10 max-w-3xl space-y-6">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/30 text-xs font-mono text-emerald-300">
                                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Sovereign Enclave Production Guarantee</span>
                            </div>

                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight">
                                Deploy Sovereign Multi-Agent Infrastructure with a Contractual 90-Day ROI Guarantee
                            </h2>

                            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                                Schedule a 45-minute confidential architecture audit directly with our Principal AI Systems Architect.
                                We review your existing ERP/CRM topologies, audit private VPC isolation requirements, and formulate
                                a deterministic implementation roadmap with zero external data retention.
                            </p>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
                                <Link
                                    to="/waitlist"
                                    className="h-12 px-7 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
                                >
                                    <span>Schedule Architecture Audit</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <button
                                    onClick={openWhatsApp}
                                    className="h-12 px-7 rounded-xl border border-slate-700/80 hover:border-emerald-500/50 bg-slate-900/60 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2.5 backdrop-blur-md"
                                >
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                    <span>Direct WhatsApp Desk</span>
                                </button>
                            </div>

                            <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Air-Gapped Private VPC</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>DPDP Act 2023 Safe Harbors</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Contractual SLA Guarantees</span>
                                </div>
                            </div>
                        </div>

                        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-5 pointer-events-none hidden lg:block">
                            <img src="/assets/LOGO_NEW.png" alt="Elesium" className="w-96 h-96 object-contain filter invert" />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
