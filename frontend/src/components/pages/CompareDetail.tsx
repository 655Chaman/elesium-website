import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Scale,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Share2,
    Check
} from 'lucide-react'
import { getCompareBySlug, compareData, CompareBattlecardItem } from '../../data/compareData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function CompareDetail() {
    const { slug } = useParams<{ slug: string }>()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [copied, setCopied] = useState(false)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

    const battlecard: CompareBattlecardItem | undefined = useMemo(() => {
        if (!slug) return undefined
        return getCompareBySlug(slug)
    }, [slug])

    if (!battlecard) {
        return <Navigate to="/compare" replace />
    }

    const relatedBattlecards: CompareBattlecardItem[] = compareData
        .filter((item: CompareBattlecardItem) => item.slug !== battlecard.slug)
        .slice(0, 3)

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Schema.org Structured Data: TechArticle + FAQPage + BreadcrumbList
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'TechArticle',
                '@id': `https://elesium.online/compare/${battlecard.slug}#article`,
                'isPartOf': {
                    '@type': 'WebSite',
                    '@id': 'https://elesium.online/#website',
                    'name': 'Elesium',
                    'url': 'https://elesium.online'
                },
                'headline': battlecard.title,
                'description': battlecard.metaDescription,
                'inLanguage': 'en-US',
                'mainEntityOfPage': `https://elesium.online/compare/${battlecard.slug}`,
                'datePublished': battlecard.datePublished,
                'dateModified': battlecard.dateModified,
                'author': {
                    '@type': 'Person',
                    'name': 'Chaman Shah',
                    'jobTitle': 'Principal AI Systems Architect',
                    'url': 'https://elesium.online'
                },
                'publisher': {
                    '@type': 'Organization',
                    'name': 'Elesium',
                    'url': 'https://elesium.online',
                    'logo': {
                        '@type': 'ImageObject',
                        'url': 'https://elesium.online/assets/LOGO_NEW.png'
                    }
                },
                'about': [
                    { '@type': 'Thing', 'name': battlecard.entityA },
                    { '@type': 'Thing', 'name': battlecard.entityB }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': `https://elesium.online/compare/${battlecard.slug}#faq`,
                'mainEntity': battlecard.faqs.map(faq => ({
                    '@type': 'Question',
                    'name': faq.question,
                    'acceptedAnswer': {
                        '@type': 'Answer',
                        'text': faq.answer
                    }
                }))
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `https://elesium.online/compare/${battlecard.slug}#breadcrumb`,
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
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': battlecard.title,
                        'item': `https://elesium.online/compare/${battlecard.slug}`
                    }
                ]
            }
        ]
    }

    return (
        <article className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-24 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>{battlecard.title} | Elesium Architecture Battlecards</title>
                <meta name="description" content={battlecard.metaDescription} />
                <link rel="canonical" href={`https://elesium.online/compare/${battlecard.slug}`} />
                <meta property="og:title" content={`${battlecard.title} | Elesium`} />
                <meta property="og:description" content={battlecard.metaDescription} />
                <meta property="og:url" content={`https://elesium.online/compare/${battlecard.slug}`} />
                <meta property="og:type" content="article" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumbs & Share */}
                <div className="flex items-center justify-between gap-4 mb-6">
                    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <Link to="/compare" className="hover:text-black dark:hover:text-white transition-colors">
                            Architecture Comparisons
                        </Link>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-sm">
                            {battlecard.entityALabel} vs {battlecard.entityBLabel}
                        </span>
                    </nav>

                    <button
                        onClick={handleCopyUrl}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-neutral-900 hover:bg-gray-200 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300 text-xs font-medium transition-colors"
                        title="Copy battlecard link"
                    >
                        {copied ? (
                            <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-emerald-500">Copied</span>
                            </>
                        ) : (
                            <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Share</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Hero Title Section */}
                <header className="mb-10">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white uppercase tracking-wider">
                            {battlecard.category}
                        </span>
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                            Updated {battlecard.dateModified} • By Chaman Shah, Principal AI Systems Architect
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-950 dark:text-white mb-6 leading-tight">
                        {battlecard.h1}
                    </h1>

                    {/* Head-to-Head Visual Hero Banner */}
                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="p-4 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                                <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider block mb-1">Architecture A</span>
                                <div className="text-lg font-bold text-gray-950 dark:text-white">{battlecard.entityALabel}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{battlecard.entityA}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                                <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider block mb-1">Architecture B</span>
                                <div className="text-lg font-bold text-gray-950 dark:text-white">{battlecard.entityBLabel}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{battlecard.entityB}</div>
                            </div>
                        </div>
                    </div>

                    {/* Fast Facts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {battlecard.fastFacts.map((fact, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1 font-mono">{fact.label}</span>
                                <div className="text-base sm:text-lg font-bold text-gray-950 dark:text-white font-mono mb-1">{fact.value}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{fact.description}</p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Executive Engineering Verdict Box */}
                <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Definitive Technical Finding
                            </span>
                            <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                                Executive Engineering Verdict
                            </h2>
                        </div>
                    </div>
                    <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed">
                        {battlecard.verdictSummary}
                    </p>
                </section>

                {/* Full Comparison Matrix Table */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                Empirical Evaluation Matrix
                            </span>
                            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                                Side-by-Side Dimension Breakdown
                            </h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-black">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-white/10">
                                    <th className="p-4 font-semibold w-1/4">Evaluation Dimension</th>
                                    <th className="p-4 font-semibold w-1/4">{battlecard.entityALabel}</th>
                                    <th className="p-4 font-semibold w-1/4">{battlecard.entityBLabel}</th>
                                    <th className="p-4 font-semibold w-1/4">Verdict & Rationale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                                {battlecard.matrix.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                                        <td className="p-4 font-medium text-gray-950 dark:text-white align-top">
                                            {row.dimension}
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300 align-top">
                                            {row.optionA}
                                        </td>
                                        <td className="p-4 text-gray-700 dark:text-gray-300 align-top">
                                            {row.optionB}
                                        </td>
                                        <td className="p-4 align-top space-y-1.5">
                                            <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/10">
                                                {row.verdict}
                                            </span>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                                                {row.technicalExplanation}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Deep Architectural Teardown Pillars */}
                <section className="mb-16 space-y-10">
                    <div>
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                            In-Depth Engineering Teardown
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white mt-1">
                            Architectural Mechanics & Failure Modes
                        </h2>
                    </div>

                    {battlecard.pillars.map((pillar, idx) => (
                        <div
                            key={idx}
                            className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-white/10 mb-6">
                                <div>
                                    <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                        Pillar 0{idx + 1}
                                    </span>
                                    <h3 className="text-xl font-bold text-gray-950 dark:text-white mt-1">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                        {pillar.subtitle}
                                    </p>
                                </div>

                                {/* Metric Highlight Card */}
                                <div className="p-3 rounded-xl bg-white dark:bg-black border border-gray-200 dark:border-white/10 shrink-0">
                                    <span className="text-[11px] text-gray-400 block mb-1 font-mono font-medium">{pillar.keyMetric.label}</span>
                                    <div className="flex items-center gap-3 text-xs font-mono">
                                        <div>
                                            <span className="text-gray-500 text-[10px] block">{battlecard.entityALabel}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{pillar.keyMetric.optionAValue} {pillar.keyMetric.unit}</span>
                                        </div>
                                        <div className="h-6 w-px bg-gray-200 dark:border-white/10" />
                                        <div>
                                            <span className="text-gray-500 text-[10px] block">{battlecard.entityBLabel}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{pillar.keyMetric.optionBValue} {pillar.keyMetric.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {pillar.analysisParagraphs.map((paragraph, pIdx) => (
                                    <p key={pIdx}>{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>

                {/* Related Solution CTA Banner */}
                {battlecard.relatedSolutionSlug && (
                    <section className="mb-16 p-6 rounded-2xl bg-gray-50 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-mono font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-1">
                                    Production Implementation Path
                                </span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                                    Ready to deploy a sovereign, deterministic solution?
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xl">
                                    Review the complete production architecture, security whitepapers, and SLA guarantees for our turnkey enterprise deployments.
                                </p>
                            </div>
                            <Link
                                to={`/solutions/${battlecard.relatedSolutionSlug}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-medium text-xs sm:text-sm transition-all hover:opacity-90 shrink-0"
                            >
                                <span>Inspect Production Solution</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* FAQ Accordion */}
                <section className="mb-16">
                    <div className="mb-6">
                        <span className="text-xs font-mono uppercase tracking-wider text-gray-500 dark:text-gray-400">
                            Frequently Asked Architecture Questions
                        </span>
                        <h2 className="text-2xl font-bold text-gray-950 dark:text-white mt-1">
                            Enterprise Evaluation & Migration Inquiries
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {battlecard.faqs.map((faq, idx) => {
                            const isOpen = openFaqIndex === idx
                            return (
                                <div
                                    key={idx}
                                    className="rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-[#0A0A0A] overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-gray-950 dark:text-white hover:text-black dark:hover:text-white transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200/50 dark:border-white/5 leading-relaxed">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Related Battlecards Grid */}
                {relatedBattlecards.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                                Adjacent Architecture Battlecards
                            </h2>
                            <Link to="/compare" className="text-xs font-mono font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
                                View All 6 Comparisons →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedBattlecards.map(item => (
                                <Link
                                    key={item.id}
                                    to={`/compare/${item.slug}`}
                                    className="p-5 rounded-2xl bg-gray-50/80 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/40 transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <span className="text-[10px] font-mono font-medium text-gray-500 uppercase tracking-wider block mb-1">
                                            {item.category}
                                        </span>
                                        <h3 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                            {item.verdictSummary}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-semibold text-gray-900 dark:text-white pt-2 border-t border-gray-200 dark:border-white/10">
                                        <span>Inspect Battlecard</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Conversion & Direct Audit CTA */}
                <section className="text-center p-8 sm:p-12 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />
                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-mono tracking-wider uppercase">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Enterprise Systems Advisory
                        </div>
                        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight">
                            Evaluating Between These Stacks for Your Enterprise?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            Do not commit budget to fragile orchestration or shared-tenant API bottlenecks. Connect directly with Chaman Shah to architect your deterministic, production-grade agent framework.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                            <button
                                onClick={() => openWhatsApp()}
                                className="w-full sm:w-auto h-11 px-6 rounded-full bg-white text-black hover:bg-gray-100 font-semibold text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2"
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
                </section>
            </div>

            <WhatsAppModal />
        </article>
    )
}
