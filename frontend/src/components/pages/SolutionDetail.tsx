import { useMemo, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ShieldCheck,
    Terminal,
    ArrowRight,
    ChevronRight,
    ChevronDown,
    Share2,
    Check,
    CheckCircle2,
    FileText,
    BookOpen
} from 'lucide-react'
import { getSolutionBySlug, solutionsData, SolutionRecord } from '../../data/solutionsData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { getRotatingAnchorText } from '../../lib/seoAnchors'

export default function SolutionDetail() {
    const { slug } = useParams<{ slug: string }>()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [copied, setCopied] = useState(false)
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

    const solution: SolutionRecord | undefined = useMemo(() => {
        if (!slug) return undefined
        return getSolutionBySlug(slug)
    }, [slug])

    if (!solution) {
        return <Navigate to="/solutions" replace />
    }

    const relatedSolutions = solutionsData
        .filter(s => s.hubCategory === solution.hubCategory && s.slug !== solution.slug)
        .slice(0, 3)

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // Block 1, 2, 3 extraction
    const block1 = solution.blocks[0]
    const block2 = solution.blocks[1]
    const block3 = solution.blocks[2]

    // Default FAQs tailored to enterprise compliance and execution
    const faqs = [
        {
            question: `How does ${solution.keyword} integrate with enterprise legacy systems?`,
            answer: `We interface via secure REST webhooks, direct read-replica database connectors, and certified enterprise protocols without requiring modifications to core application code.`
        },
        {
            question: `What are the data privacy and residency guarantees for this deployment?`,
            answer: `All computation executes inside a dedicated private virtual private cloud (VPC) or on-premise hardware with zero data retention, strict zero third-party telemetry, and full DPDP Act 2023 statutory compliance.`
        },
        {
            question: `What is the expected production deployment timeline?`,
            answer: `A scoped pilot architecture typically achieves production deployment within 14 calendar days, backed by our standard 90-day contractual return-on-investment guarantee.`
        }
    ]

    return (
        <article className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-24 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>{solution.title}</title>
                <meta name="description" content={solution.metaDescription} />
                <link rel="canonical" href={`https://elesium.online/solutions/${solution.slug}`} />
                <meta property="og:title" content={solution.title} />
                <meta property="og:description" content={solution.metaDescription} />
                <meta property="og:url" content={`https://elesium.online/solutions/${solution.slug}`} />
                <meta property="og:type" content="article" />
                {solution.jsonLdSchema && (
                    <script type="application/ld+json">{solution.jsonLdSchema}</script>
                )}
            </Helmet>

            <WhatsAppModal />

            {/* Breadcrumb Navigation (<= 2 clicks to home, 1 click to hub) */}
            <div className="max-w-5xl mx-auto px-6 mb-8">
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <Link to="/solutions" className="hover:text-black dark:hover:text-white transition-colors">
                        Solutions
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[200px] sm:max-w-none">
                        {solution.h1}
                    </span>
                </nav>
            </div>

            {/* UPPER HALF (The 80% Unique Copy Rule + Mobile CTA Hierarchy) */}
            <header className="max-w-5xl mx-auto px-6 mb-16">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-gray-100 dark:border-white/10">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-mono uppercase tracking-wider border border-gray-200 dark:border-white/15 bg-gray-50 dark:bg-white/5">
                            {solution.hubCategory}
                        </span>
                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">
                            Enterprise Deployment Architecture
                        </span>
                        <span className="text-xs font-mono text-gray-400">
                            {solution.wordCount} Words
                        </span>
                    </div>

                    <button
                        onClick={handleCopyUrl}
                        className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                        title="Copy direct solution URL"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied' : 'Share URL'}</span>
                    </button>
                </div>

                {/* 
                  MOBILE LAYOUT CONSTRAINT (Sturm Module 5):
                  The mobile DOM sequence must strictly render:
                  H1 Tag -> Intro Paragraph -> CTA Button -> Hero Graphic
                  Never push the CTA button below the fold on mobile screens!
                */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Copy Column (Span 7) */}
                    <div className="lg:col-span-7 flex flex-col">
                        {/* 1. EXACT H1 Tag (Tri-Aligned) */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] mb-6 text-gray-900 dark:text-white">
                            {solution.h1}
                        </h1>

                        {/* 2. Intro Paragraph (Target keyword in first sentence) */}
                        <div className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal mb-6">
                            <p className="font-medium text-gray-900 dark:text-white">
                                {solution.hero.hookSentence}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-2">
                                {solution.hero.subheadline}
                            </p>
                        </div>

                        {/* 3. Primary CTA Button (Strictly ABOVE Graphic on Mobile) */}
                        <div className="flex flex-wrap items-center gap-3.5 mb-8 lg:mb-10">
                            <Link
                                to={`/waitlist?solution=${solution.slug}`}
                                className="px-6 py-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-sm"
                            >
                                {solution.hero.ctaText || solution.primaryCtaText || 'Schedule Architecture Audit'}
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <button
                                onClick={openWhatsApp}
                                className="px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 text-gray-700 dark:text-gray-300"
                            >
                                <span>WhatsApp Desk</span>
                            </button>

                            <ExpandableScreen>
                                <ExpandableScreenTrigger>
                                    <InteractiveHoverButton className="h-11 px-5 text-xs font-mono">
                                        Submit Mandate
                                    </InteractiveHoverButton>
                                </ExpandableScreenTrigger>
                                <ExpandableScreenContent>
                                    <MandateApplicationForm source={`Solution: ${solution.h1}`} />
                                </ExpandableScreenContent>
                            </ExpandableScreen>
                        </div>

                        {/* Additional Structured Micro-Paragraphs from Block 1 (Strict 1-2 sentence constraint) */}
                        {block1 && (
                            <div className="space-y-3.5 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                {block1.copy.map((p, idx) => (
                                    <p key={idx}>{p}</p>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 4. Hero Graphic / Terminal Simulator (Rendered AFTER CTA on mobile) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                        <div className="p-5 sm:p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-neutral-950 font-mono text-xs text-gray-800 dark:text-gray-300 shadow-sm">
                            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200 dark:border-white/10 text-[11px] text-gray-400">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                    <span className="ml-1 text-gray-500 font-semibold">PRODUCTION_NODE</span>
                                </div>
                                <span className="truncate max-w-[120px]">{solution.targetPersona}</span>
                            </div>

                            <div className="space-y-2.5 leading-relaxed">
                                <p className="text-emerald-600 dark:text-emerald-400 truncate">
                                    &gt; INITIALIZING_PIPELINE: [{solution.slug}]
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    &gt; DEPLOYMENT: Private Dedicated VPC / On-Premise
                                </p>
                                <p className="text-gray-700 dark:text-gray-200">
                                    &gt; SLA: Sub-200ms Response Latency
                                </p>
                                <div className="p-3 my-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-1">
                                    <div className="text-[10px] uppercase tracking-wider text-gray-400">
                                        Hardware & Execution Target
                                    </div>
                                    <div className="text-gray-900 dark:text-white font-medium">
                                        Execution Latency: {solution.trustSection.metrics[0]?.value || '< 200ms'}
                                    </div>
                                    <div className="text-gray-500 dark:text-gray-400 text-[11px]">
                                        Operational Accuracy: {solution.trustSection.metrics[1]?.value || '99.98%'}
                                    </div>
                                </div>
                                <p className="text-blue-600 dark:text-blue-400">
                                    &gt; DATA_COMPLIANCE: DPDP Act 2023 & ISO 27001 Verified
                                </p>
                                <p className="text-gray-400 dark:text-gray-500">
                                    &gt; STATE: READY_FOR_DISPATCH [0 err, 0 drop]
                                </p>
                            </div>
                        </div>

                        {/* Quick Technical Specs Snapshot */}
                        <div className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.01] space-y-2">
                            <div className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                                Operational Authority
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 font-mono space-y-1">
                                <div>• Target: {solution.targetPersona}</div>
                                <div>• Engine: Python Workflow Engine / LangGraph</div>
                                <div>• Egress: Zero External API Leakage</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* BLOCK 1 DETAIL: Feature Bullets */}
            {block1 && block1.bullets && block1.bullets.length > 0 && (
                <section className="max-w-5xl mx-auto px-6 mb-16">
                    <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                        <h2 className="text-sm font-mono uppercase tracking-wider text-gray-400 mb-4">
                            Operational Capabilities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {block1.bullets.map((bullet, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{bullet}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* BLOCK 2: Right Copy / Left Architecture Diagram (Visual Rhythm Rule) */}
            {block2 && (
                <section className="max-w-5xl mx-auto px-6 my-20">
                    <div className="p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-[#0c0c0c]">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Graphic / Bullets on Left */}
                            <div className="lg:col-span-6 order-2 lg:order-1 font-mono text-xs">
                                <div className="p-5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black/80 space-y-3">
                                    <div className="text-[11px] text-gray-400 uppercase tracking-widest pb-1 border-b border-gray-100 dark:border-white/5">
                                        System Architecture Topology
                                    </div>
                                    <div className="space-y-2 text-gray-800 dark:text-gray-300 leading-relaxed">
                                        <div>&gt; INGESTION_BUS: Multi-modal Payload Parsing</div>
                                        <div>&gt; STATE_VALIDATOR: Strict JSON Schema Assertion</div>
                                        <div>&gt; COMMIT_ENGINE: Two-Phase Transactional Commit</div>
                                        <div>&gt; AUDIT_HASH: SHA-256 Verified Audit Trail</div>
                                    </div>
                                    {block2.bullets && block2.bullets.length > 0 && (
                                        <div className="pt-2 border-t border-gray-100 dark:border-white/5 space-y-1.5">
                                            {block2.bullets.map((b, idx) => (
                                                <div key={idx} className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                                                    <span className="text-emerald-500">✓</span> {b}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Copy on Right */}
                            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
                                <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                                    Architectural Execution
                                </span>
                                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white">
                                    {block2.title}
                                </h2>
                                <div className="space-y-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {block2.copy.map((p, idx) => (
                                        <p key={idx}>{p}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* BLOCK 3: Centered Specification Card with Subtle Divider Lines */}
            {block3 && (
                <section className="max-w-5xl mx-auto px-6 my-20">
                    <div className="p-8 sm:p-12 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a0a0a] shadow-sm">
                        <div className="text-center max-w-2xl mx-auto mb-10">
                            <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                                Operational Benchmarks
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2">
                                {block3.title}
                            </h2>
                            <div className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                {block3.copy.map((p, idx) => (
                                    <p key={idx}>{p}</p>
                                ))}
                            </div>
                        </div>

                        {block3.specs && block3.specs.length > 0 && (
                            <div className="divide-y divide-gray-100 dark:divide-white/5">
                                {block3.specs.map((spec, idx) => (
                                    <div key={idx} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-sm">
                                        <div className="flex flex-col">
                                            <span className="font-mono text-gray-900 dark:text-white font-medium">{spec.label}</span>
                                            <span className="text-xs text-gray-500 dark:text-gray-400">{spec.desc}</span>
                                        </div>
                                        <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">{spec.value}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Sturm Module 10: Underlying Technical Architecture & Whitepaper Evidence Citation */}
            {solution.whitepaperCitation && (
                <section className="max-w-5xl mx-auto px-6 my-20">
                    <div className="p-8 sm:p-10 rounded-2xl border border-blue-500/20 dark:border-blue-500/30 bg-blue-50/40 dark:bg-blue-950/15 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-blue-200/60 dark:border-blue-500/20">
                            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                <FileText className="w-4 h-4" />
                                <span>Underlying Technical Architecture & Whitepaper Evidence</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Peer-Audited Research · {solution.whitepaperCitation.readTime}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            <div className="lg:col-span-8 space-y-3.5">
                                <span className="inline-block text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                                    {solution.whitepaperCitation.category}
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white leading-snug">
                                    {solution.whitepaperCitation.title}
                                </h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                    {solution.whitepaperCitation.excerpt}
                                </p>

                                {solution.whitepaperCitation.keyFindings && solution.whitepaperCitation.keyFindings.length > 0 && (
                                    <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-gray-700 dark:text-gray-300">
                                        {solution.whitepaperCitation.keyFindings.map((finding, fIdx) => (
                                            <div key={fIdx} className="flex items-start gap-2">
                                                <span className="text-blue-500 font-bold shrink-0">↳</span>
                                                <span>{finding}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-2.5">
                                <Link
                                    to={`/signals/${solution.whitepaperCitation.slug}`}
                                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs font-mono tracking-wide shadow-sm hover:shadow-md transition-all group"
                                >
                                    <span>Read Technical Whitepaper</span>
                                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <span className="text-[11px] font-mono text-gray-500 dark:text-gray-400">
                                    Algorithmic topical equity verification
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* LOWER HALF: Reusable Enterprise Trust & Security Components */}
            <section className="max-w-5xl mx-auto px-6 my-20">
                <div className="p-8 sm:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-[#0c0c0c]">
                    <div className="max-w-2xl mb-8 space-y-2">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            Enterprise Sovereignty Standard
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white">
                            {solution.trustSection.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {solution.trustSection.slaGuarantee}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {solution.trustSection.complianceBadges.map((badge, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-black/50 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs font-mono font-medium text-gray-900 dark:text-white">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{badge}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {solution.trustSection.metrics.map((metric, idx) => (
                            <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-white/5 bg-white/60 dark:bg-black/30">
                                <div className="text-xl font-mono font-semibold text-gray-900 dark:text-white">{metric.value}</div>
                                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">{metric.label}</div>
                                <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{metric.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Accordion Section */}
            <section className="max-w-5xl mx-auto px-6 my-20">
                <div className="mb-8">
                    <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                        Operational Questions
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-1">
                        Frequently Asked Questions
                    </h2>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-white/10 border-t border-b border-gray-100 dark:border-white/10">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="py-5">
                            <button
                                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between text-left gap-4 group"
                            >
                                <span className="text-base sm:text-lg font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ${
                                        openFaqIndex === idx ? 'rotate-180 text-black dark:text-white' : ''
                                    }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openFaqIndex === idx && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="pt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* Related Solutions in Category (Zero Orphan Guarantee) */}
            <section className="max-w-5xl mx-auto px-6 my-20">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-gray-400">
                            Topical Cluster
                        </span>
                        <h2 className="text-xl sm:text-2xl font-medium tracking-tight text-gray-900 dark:text-white mt-1">
                            Related {solution.hubCategory} Solutions
                        </h2>
                    </div>
                    <Link
                        to="/solutions"
                        className="text-xs font-mono text-gray-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition-colors"
                    >
                        View All Solutions
                        <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedSolutions.map(rel => (
                        <Link
                            key={rel.slug}
                            to={`/solutions/${rel.slug}`}
                            className="group p-5 rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:border-black dark:hover:border-white/30 transition-all flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider truncate block">
                                    {rel.targetPersona}
                                </span>
                                {/* EXACT H1 Title as required */}
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors leading-snug">
                                    {rel.h1}
                                </h3>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-white/5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                Inspect Architecture
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Final Bottom Conversion Card */}
            <section className="max-w-5xl mx-auto px-6 mt-16">
                <div className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-white/[0.03] text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-xs font-mono">
                        <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Production Deployment Intake</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight max-w-xl mx-auto">
                        Ready to Deploy Deterministic Automation for Your Team?
                    </h2>

                    <p className="text-sm text-gray-300 dark:text-gray-400 max-w-lg mx-auto leading-relaxed">
                        Book a 30-minute technical session directly with our Principal Systems Architect.
                        Receive a tailored 1-page feasibility memorandum and hard ROI estimation.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                        <Link
                            to={`/waitlist?solution=${solution.slug}`}
                            className="px-6 py-3.5 rounded-xl bg-white text-black hover:bg-gray-100 font-medium text-sm transition-all flex items-center gap-2"
                        >
                            {solution.primaryCtaText || 'Schedule Architecture Audit'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton className="h-11 px-6 text-sm">
                                    Submit Architecture Mandate
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <MandateApplicationForm source={`Bottom CTA: ${solution.h1}`} />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between text-xs font-mono text-gray-400">
                        <span>Regional Deployment Node:</span>
                        <Link to="/ai-automation-agency-india" className="text-emerald-400 hover:text-emerald-300 underline transition-colors">
                            {getRotatingAnchorText(solution.hubCategory || solution.category)} &rarr;
                        </Link>
                    </div>
                </div>
            </section>
        </article>
    )
}
