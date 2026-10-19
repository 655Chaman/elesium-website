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
    Check,
    ExternalLink
} from 'lucide-react'
import { getCompareBySlug, compareData, CompareBattlecardItem } from '../../data/compareData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'

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
                        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Home
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
                        <Link to="/compare" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Architecture Comparisons
                        </Link>
                        <ChevronRight className="w-3 h-3 text-gray-400" />
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
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                            {battlecard.category}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            Updated {battlecard.dateModified} • By Chaman Shah, Principal AI Systems Architect
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 dark:text-white mb-6 leading-tight">
                        {battlecard.h1}
                    </h1>

                    {/* Head-to-Head Visual Hero Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 dark:from-neutral-900 dark:via-blue-950/20 dark:to-neutral-900 border border-gray-200 dark:border-neutral-800 mb-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                            <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Architecture A</span>
                                <div className="text-lg font-bold text-gray-950 dark:text-white">{battlecard.entityALabel}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{battlecard.entityA}</div>
                            </div>
                            <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800">
                                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1">Architecture B</span>
                                <div className="text-lg font-bold text-gray-950 dark:text-white">{battlecard.entityBLabel}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{battlecard.entityB}</div>
                            </div>
                        </div>
                    </div>

                    {/* Fast Facts Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        {battlecard.fastFacts.map((fact, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800">
                                <span className="text-xs text-gray-500 dark:text-gray-400 block mb-1">{fact.label}</span>
                                <div className="text-base sm:text-lg font-bold text-gray-950 dark:text-white font-mono mb-1">{fact.value}</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-snug">{fact.description}</p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* Executive Engineering Verdict Box */}
                <section className="mb-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-900/10 via-slate-900/20 to-purple-900/10 dark:from-blue-950/40 dark:via-neutral-900/80 dark:to-purple-950/30 border border-blue-500/30 dark:border-blue-400/30 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                            <Scale className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
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
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                Empirical Evaluation Matrix
                            </span>
                            <h2 className="text-2xl font-bold text-gray-950 dark:text-white">
                                Side-by-Side Dimension Breakdown
                            </h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-950">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm">
                            <thead>
                                <tr className="bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-neutral-800">
                                    <th className="p-4 font-semibold w-1/4">Evaluation Dimension</th>
                                    <th className="p-4 font-semibold w-1/4">{battlecard.entityALabel}</th>
                                    <th className="p-4 font-semibold w-1/4">{battlecard.entityBLabel}</th>
                                    <th className="p-4 font-semibold w-1/4">Verdict & Rationale</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-neutral-800">
                                {battlecard.matrix.map((row, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
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
                                            <span
                                                className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                                                    row.verdict === 'Elesium Sovereign Win'
                                                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                                                        : row.verdict === 'Option A Superior'
                                                        ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                                        : row.verdict === 'Option B Superior'
                                                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                                }`}
                                            >
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
                            className="p-6 sm:p-8 rounded-2xl bg-gray-50 dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-neutral-800 mb-6">
                                <div>
                                    <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
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
                                <div className="p-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 shrink-0">
                                    <span className="text-[11px] text-gray-400 block mb-1 font-medium">{pillar.keyMetric.label}</span>
                                    <div className="flex items-center gap-3 text-xs font-mono">
                                        <div>
                                            <span className="text-gray-500 text-[10px] block">{battlecard.entityALabel}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{pillar.keyMetric.optionAValue} {pillar.keyMetric.unit}</span>
                                        </div>
                                        <div className="h-6 w-px bg-gray-200 dark:bg-neutral-800" />
                                        <div>
                                            <span className="text-gray-500 text-[10px] block">{battlecard.entityBLabel}</span>
                                            <span className="font-bold text-blue-600 dark:text-blue-400">{pillar.keyMetric.optionBValue} {pillar.keyMetric.unit}</span>
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
                    <section className="mb-16 p-6 rounded-2xl bg-gradient-to-r from-blue-900/30 to-slate-900/40 border border-blue-500/40 dark:border-blue-500/30">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider block mb-1">
                                    Production Implementation Path
                                </span>
                                <h3 className="text-lg font-bold text-white">
                                    Ready to deploy a sovereign, deterministic solution?
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
                                    Review the complete production architecture, security whitepapers, and SLA guarantees for our turnkey enterprise deployments.
                                </p>
                            </div>
                            <Link
                                to={`/solutions/${battlecard.relatedSolutionSlug}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-all shadow-md shrink-0"
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
                        <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
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
                                    className="rounded-xl border border-gray-200 dark:border-neutral-800 bg-gray-50/70 dark:bg-neutral-900/60 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                                        className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-gray-950 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                                                <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200/50 dark:border-neutral-800/50 leading-relaxed">
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
                            <Link to="/compare" className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                View All 6 Comparisons →
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedBattlecards.map(item => (
                                <Link
                                    key={item.id}
                                    to={`/compare/${item.slug}`}
                                    className="p-5 rounded-2xl bg-gray-50/80 dark:bg-neutral-900/60 border border-gray-200 dark:border-neutral-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all group flex flex-col justify-between"
                                >
                                    <div>
                                        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                                            {item.category}
                                        </span>
                                        <h3 className="text-sm font-bold text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                            {item.verdictSummary}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2 border-t border-gray-200 dark:border-neutral-800">
                                        <span>Inspect Battlecard</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* Conversion & Direct Audit CTA */}
                <section className="text-center p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-gray-900 to-black text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 max-w-3xl mx-auto space-y-4">
                        <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold tracking-wider uppercase">
                            Enterprise Systems Advisory
                        </span>
                        <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                            Evaluating Between These Stacks for Your Enterprise?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            Do not commit budget to fragile orchestration or shared-tenant API bottlenecks. Book a 1-on-1 technical teardown with Chaman Shah to architect your deterministic, production-grade agent framework.
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
                                Discuss on Direct Desk
                                <ExternalLink className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </section>
            </div>

            <WhatsAppModal />
        </article>
    )
}
