import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, TrendingUp, Cpu, Network, Calendar, Clock, ChevronRight, ChevronDown, ExternalLink, MessageSquare } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogPosts, getMatchedSolutionSlug } from '../../data/blogPosts'
import { getSolutionBySlug, solutionsData, SolutionRecord } from '../../data/solutionsData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { 
    ArchitecturePlayground, 
    InteractiveRoiCalculator, 
    InteractiveCodeBlock, 
    InteractiveMermaid, 
    ExecutiveAudioBriefing, 
    BlueprintDownloadCard 
} from '../interactive'
import { useDwellTelemetry } from '../../hooks/useDwellTelemetry'

export default function MarketSignals() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { activeDwellSeconds, scrollDepthPercent, interactionCount, isGoodClick, isLastLongestClickEligible, trackInteraction } = useDwellTelemetry(slug || 'signals-directory');

    const activeArticle = slug ? blogPosts.find(post => post.slug === slug) : null;

    // System 1 -> System 2 Topical Equity Bridge: Match signal to commercial solution
    const matchedSolution: SolutionRecord | undefined = React.useMemo(() => {
        if (!activeArticle) return undefined;
        const targetSlug = getMatchedSolutionSlug(activeArticle);
        return getSolutionBySlug(targetSlug) || solutionsData[0];
    }, [activeArticle]);

    // Pillar 1: Find related posts for internal linking
    const relatedPosts = activeArticle?.internalLinks
        ? blogPosts.filter(p => activeArticle.internalLinks!.includes(p.slug))
        : [];

    useEffect(() => {
        window.scrollTo(0, 0);
        setOpenFaq(null);
    }, [slug]);

    const getIcon = (category: string) => {
        switch (category) {
            case 'Market Intelligence': return TrendingUp;
            case 'Operational Leverage': return Cpu;
            case 'Matchmaking Frameworks': return Network;
            default: return TrendingUp;
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-y-auto pt-[52px] transition-colors duration-300">
            <WhatsAppModal />
            {/* SEO Helmet — Pillar 2: JSON-LD Schema & GEO Meta Tags */}
            {activeArticle ? (
                <Helmet>
                    <title>{activeArticle.title.replace(/\*\*/g, '')} | Elesium</title>
                    <meta name="description" content={activeArticle.metaDescription} />
                    
                    {/* Open Graph */}
                    <meta property="og:title" content={activeArticle.title.replace(/\*\*/g, '')} />
                    <meta property="og:description" content={activeArticle.metaDescription} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={`https://elesium.online/signals/${activeArticle.slug}`} />
                    <meta property="og:image" content="https://elesium.online/og-image.png" />
                    <meta property="og:site_name" content="Elesium" />
                    <meta property="og:locale" content="en_US" />

                    {/* Twitter Cards */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={activeArticle.title.replace(/\*\*/g, '')} />
                    <meta name="twitter:description" content={activeArticle.metaDescription} />
                    <meta name="twitter:image" content="https://elesium.online/og-image.png" />

                    <link rel="canonical" href={`https://elesium.online/signals/${activeArticle.slug}`} />
                    
                    {/* Breadcrumb Schema for GEO/AEO */}
                    <script type="application/ld+json">
                        {`{
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://elesium.online"
                            },{
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Market Signals",
                                "item": "https://elesium.online/signals"
                            },{
                                "@type": "ListItem",
                                "position": 3,
                                "name": ${JSON.stringify(activeArticle.title.replace(/\*\*/g, ''))},
                                "item": "https://elesium.online/signals/${activeArticle.slug}"
                            }]
                        }`}
                    </script>

                    {activeArticle.jsonLdSchema && (
                        <script type="application/ld+json">
                            {activeArticle.jsonLdSchema}
                        </script>
                    )}
                </Helmet>
            ) : (
                <Helmet>
                    <title>Market Signals & Intelligence | Elesium</title>
                    <meta name="description" content="Real-time market shifts, supply chain constraints, and operational bottlenecks. Insights engineered exclusively for defense, aerospace, and industrial leaders." />
                    
                    {/* Open Graph */}
                    <meta property="og:title" content="Market Signals & Intelligence | Elesium" />
                    <meta property="og:description" content="Real-time market shifts, supply chain constraints, and operational bottlenecks. Insights engineered exclusively for defense, aerospace, and industrial leaders." />
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://elesium.online/signals" />
                    <meta property="og:image" content="https://elesium.online/og-image.png" />

                    {/* Twitter Cards */}
                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="Market Signals & Intelligence | Elesium" />
                    <meta name="twitter:description" content="Real-time market shifts, supply chain constraints, and operational bottlenecks." />
                    <meta name="twitter:image" content="https://elesium.online/og-image.png" />

                    <link rel="canonical" href="https://elesium.online/signals" />
                    
                    {/* Breadcrumb Schema for GEO/AEO */}
                    <script type="application/ld+json">
                        {`{
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [{
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                                "item": "https://elesium.online"
                            },{
                                "@type": "ListItem",
                                "position": 2,
                                "name": "Market Signals",
                                "item": "https://elesium.online/signals"
                            }]
                        }`}
                    </script>

                    <script type="application/ld+json">{`{
                        "@context": "https://schema.org",
                        "@type": "Blog",
                        "name": "Elesium Market Signals",
                        "description": "B2B enterprise market intelligence from Elesium",
                        "url": "https://elesium.online/signals",
                        "publisher": { "@type": "Organization", "name": "Elesium", "url": "https://elesium.online" }
                    }`}</script>
                </Helmet>
            )}

            {/* Header */}
            <div className="sticky top-[52px] z-40 bg-[#FAFAFA]/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
                <div className="max-w-4xl mx-auto px-5 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <button
                        onClick={() => slug ? navigate('/signals') : navigate('/')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        {slug ? 'All Signals' : 'Back to Home'}
                    </button>
                    <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-blue-500 dark:text-blue-400">
                        {slug ? 'Intelligence Report' : 'Market Signals'}
                    </span>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-20">
                <AnimatePresence mode="wait">
                    {!slug ? (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Intro Section */}
                            <div className="mb-12 md:mb-20 max-w-3xl">
                                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 text-black dark:text-white leading-[1.1]">
                                    Market Signals &<br />Intelligence.
                                </h1>
                                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                    Real-time market shifts, supply chain constraints, and operational bottlenecks. 
                                    Strategic insights engineered exclusively for defense, aerospace, and industrial leaders.
                                </p>
                            </div>

                            {/* Articles Grid/List */}
                            <div className="grid grid-cols-1 gap-y-12">
                                {blogPosts.map((article, index) => {
                                    const Icon = getIcon(article.category);
                                    return (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                        >
                                            <Link 
                                                to={`/signals/${article.slug}`}
                                                className="group flex flex-col md:flex-row gap-4 md:gap-12 border-b border-gray-100 dark:border-white/5 pb-12 cursor-pointer block"
                                            >
                                                <div className="md:w-1/4 flex flex-col gap-2 md:gap-4">
                                                    <div className="flex items-center gap-2 text-[11px] font-medium text-blue-500 dark:text-blue-400">
                                                        <Icon className="h-4 w-4" />
                                                        <span className="tracking-[0.06em] uppercase">{article.category}</span>
                                                    </div>
                                                    <div className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                                                        {article.date} · {article.readTime}
                                                    </div>
                                                </div>

                                                <div className="md:w-3/4">
                                                    <h2 className="text-xl md:text-3xl font-semibold mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                        Read Intelligence Report <ChevronRight className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    ) : (
                        activeArticle ? (
                            <motion.article
                                key="article"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-3xl mx-auto"
                            >
                                {/* Meta Header */}
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-8 text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-[0.06em] uppercase">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                                        {activeArticle.category}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        {activeArticle.date}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {activeArticle.readTime}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                        By {activeArticle.author?.name || 'Chaman Shah'} ({activeArticle.author?.role || 'Principal AI Systems Architect'})
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-8">
                                    {activeArticle.title}
                                </h1>

                                {/* Intro */}
                                {/* Intro */}
                                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-normal border-b border-gray-100 dark:border-white/5 pb-10 mb-8">
                                    {activeArticle.intro}
                                </p>

                                {/* Behavioral Dwell Hook 1: Executive Timestamped Audio Synthesis Briefing */}
                                <ExecutiveAudioBriefing 
                                    postTitle={activeArticle.title.replace(/\*\*/g, '')}
                                    onTelemetry={trackInteraction} 
                                />

                                {/* Dynamic Sections with Interactive Assets */}
                                <div className="space-y-8 mt-10">
                                    {activeArticle.sections.map((section, sIdx) => {
                                        // Auto-injection checkpoints for high dwell-time if not explicitly present
                                        const shouldInjectPlayground = sIdx === 2 && !activeArticle.sections.some(s => s.type === 'playground');
                                        const shouldInjectRoiCalculator = sIdx === Math.min(5, activeArticle.sections.length - 1) && !activeArticle.sections.some(s => s.type === 'roi_calculator');

                                        const renderedSection = (() => {
                                            switch (section.type) {
                                                case 'heading':
                                                    return (
                                                        <h2 key={sIdx} className="text-xl md:text-2xl font-bold text-black dark:text-white tracking-tight mt-10 mb-4">
                                                            {section.value as string}
                                                        </h2>
                                                    );
                                                case 'paragraph':
                                                    return (
                                                        <p key={sIdx} className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                                            {section.value as string}
                                                        </p>
                                                    );
                                                case 'list':
                                                    return (
                                                        <ul key={sIdx} className="space-y-4 my-6 pl-1">
                                                            {(section.value as string[]).map((item, iIdx) => {
                                                                const [boldPart, rest] = item.includes(':') ? item.split(':', 2) : [null, item];
                                                                return (
                                                                    <li key={iIdx} className="flex items-start gap-3 text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                                                                        <span>
                                                                            {boldPart ? (
                                                                                <>
                                                                                    <strong className="font-semibold text-black dark:text-white">{boldPart}</strong>:
                                                                                    {rest}
                                                                                </>
                                                                            ) : item}
                                                                        </span>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    );
                                                case 'quote':
                                                    return (
                                                        <blockquote key={sIdx} className="border-l-2 border-blue-500 pl-6 my-8 py-1">
                                                            <p className="text-base md:text-lg italic text-gray-800 dark:text-gray-200 leading-relaxed">
                                                                {section.value as string}
                                                            </p>
                                                        </blockquote>
                                                    );
                                                case 'metric':
                                                    return (
                                                        <div key={sIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                                                            {(section.value as { label: string; value: string; description: string }[]).map((metric, mIdx) => (
                                                                <div key={mIdx} className="bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 rounded-lg p-5 flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="text-3xl md:text-4xl font-bold text-black dark:text-white tracking-tight mb-1">
                                                                            {metric.value}
                                                                        </div>
                                                                        <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 tracking-[0.06em] uppercase mb-3">
                                                                            {metric.label}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-xs text-gray-500 dark:text-gray-400 leading-normal">
                                                                        {metric.description}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                case 'playground':
                                                    return (
                                                        <ArchitecturePlayground 
                                                            key={sIdx} 
                                                            defaultPreset={(section.preset as any) || (activeArticle.category.includes('India') ? 'bfsi' : 'supply_chain')}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'roi_calculator':
                                                    return (
                                                        <InteractiveRoiCalculator 
                                                            key={sIdx} 
                                                            defaultCurrency={activeArticle.category.includes('India') ? 'INR' : 'USD'}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'code_block':
                                                    return (
                                                        <InteractiveCodeBlock 
                                                            key={sIdx} 
                                                            tabs={section.props?.tabs || [{ label: 'Architecture Payload', language: 'json', content: typeof section.value === 'string' ? section.value : JSON.stringify(section.value, null, 2) }]}
                                                            title={section.props?.title}
                                                            complianceBadge={section.props?.complianceBadge}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'mermaid':
                                                    return (
                                                        <InteractiveMermaid 
                                                            key={sIdx} 
                                                            title={section.props?.title} 
                                                            diagramDsl={section.props?.diagramDsl} 
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'audio_briefing':
                                                    return (
                                                        <ExecutiveAudioBriefing 
                                                            key={sIdx} 
                                                            postTitle={activeArticle.title.replace(/\*\*/g, '')}
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'blueprint_download':
                                                    return (
                                                        <BlueprintDownloadCard 
                                                            key={sIdx} 
                                                            onTelemetry={trackInteraction} 
                                                        />
                                                    );
                                                case 'faq':
                                                    return (
                                                        <div key={sIdx} className="my-8 space-y-3">
                                                            {(section.value as { q: string; a: string }[]).map((item, fIdx) => (
                                                                <div key={fIdx} className="border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden">
                                                                    <button
                                                                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                                                                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                                                    >
                                                                        {item.q}
                                                                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-blue-500 transition-transform duration-200 ${openFaq === fIdx ? 'rotate-180' : ''}`} />
                                                                    </button>
                                                                    <AnimatePresence>
                                                                        {openFaq === fIdx && (
                                                                            <motion.div
                                                                                initial={{ height: 0, opacity: 0 }}
                                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                                exit={{ height: 0, opacity: 0 }}
                                                                                transition={{ duration: 0.2 }}
                                                                                className="overflow-hidden"
                                                                            >
                                                                                <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    );
                                                default:
                                                    return null;
                                            }
                                        })();

                                        return (
                                            <React.Fragment key={sIdx}>
                                                {renderedSection}
                                                {shouldInjectPlayground && (
                                                    <ArchitecturePlayground 
                                                        defaultPreset={activeArticle.category.includes('India') ? 'bfsi' : 'supply_chain'}
                                                        onTelemetry={trackInteraction} 
                                                    />
                                                )}
                                                {shouldInjectRoiCalculator && (
                                                    <InteractiveRoiCalculator 
                                                        defaultCurrency={activeArticle.category.includes('India') ? 'INR' : 'USD'}
                                                        onTelemetry={trackInteraction} 
                                                    />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>

                                {/* Behavioral Dwell Hook 4: Production Architecture Blueprint Download */}
                                <BlueprintDownloadCard onTelemetry={trackInteraction} />

                                {/* System 1 -> System 2 Topical Equity Bridge: High-Converting Commercial Solution Callout */}
                                {matchedSolution && (
                                    <div className="my-10 p-6 sm:p-8 rounded-2xl border-2 border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-sm relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

                                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="font-semibold">Deploy This Architecture in Production</span>
                                            <span className="text-gray-400 text-[10px] hidden sm:inline">| Sovereign Commercial Implementation</span>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            Operationalize This Architecture with Private VPC Isolation
                                        </h3>

                                        <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                                            Need to operationalize this architecture? Deploy Elesium&apos;s{' '}
                                            <Link
                                                to={`/solutions/${matchedSolution.slug}`}
                                                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                                            >
                                                {matchedSolution.h1}
                                                <ExternalLink className="w-3.5 h-3.5 inline" />
                                            </Link>{' '}
                                            with dedicated private VPC isolation and an audited 90-day cash-flow ROI.
                                        </p>

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-emerald-500/20 text-xs font-mono">
                                            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Private VPC Isolated</span>
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Sub-200ms Latency SLA</span>
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> DPDP Act 2023 Compliant</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    onClick={openWhatsApp}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-xs font-mono tracking-wide transition-all shadow-sm group"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                                    <span>Chat on WhatsApp</span>
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                                <Link
                                                    to={`/solutions/${matchedSolution.slug}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 font-medium text-xs font-mono transition-all text-gray-700 dark:text-gray-300"
                                                >
                                                    <span>View Architecture Details &rarr;</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Live Dwell & Navboost Telemetry Status Bar */}
                                <div className="my-10 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center gap-3">
                                        <span className="flex items-center gap-1.5">
                                            <span className={`h-2 w-2 rounded-full ${isGoodClick ? 'bg-emerald-400 animate-pulse' : 'bg-cyan-400'}`} />
                                            Active Dwell: <strong className="text-black dark:text-white">{Math.floor(activeDwellSeconds / 60)}m {activeDwellSeconds % 60}s</strong>
                                        </span>
                                        <span className="hidden sm:inline">|</span>
                                        <span className="hidden sm:inline">Scroll: <strong className="text-black dark:text-white">{scrollDepthPercent}%</strong></span>
                                        <span className="hidden sm:inline">|</span>
                                        <span className="hidden sm:inline">Interactions: <strong className="text-black dark:text-white">{interactionCount}</strong></span>
                                    </div>
                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold">
                                        {isLastLongestClickEligible ? 'Navboost High-Retention Verified (180s+)' : isGoodClick ? 'Navboost GoodClick Active (120s+)' : 'Logging Session Telemetry'}
                                    </span>
                                </div>

                                {/* Pillar 5: FAQ Section */}
                                {activeArticle.faq && activeArticle.faq.length > 0 && (
                                    <div className="mt-16 border-t border-gray-100 dark:border-white/5 pt-12">
                                        <h2 className="text-xl font-bold text-black dark:text-white mb-6">Frequently Asked Questions</h2>
                                        <div className="space-y-3">
                                            {activeArticle.faq.map((item, fIdx) => (
                                                <div key={fIdx} className="border border-gray-100 dark:border-white/5 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => setOpenFaq(openFaq === fIdx + 100 ? null : fIdx + 100)}
                                                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                                    >
                                                        {item.q}
                                                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-blue-500 transition-transform duration-200 ${openFaq === fIdx + 100 ? 'rotate-180' : ''}`} />
                                                    </button>
                                                    <AnimatePresence>
                                                        {openFaq === fIdx + 100 && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <p className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.a}</p>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Pillar 1: Related Posts — Internal Linking */}
                                {relatedPosts.length > 0 && (
                                    <div className="mt-12 border-t border-gray-100 dark:border-white/5 pt-12">
                                        <h2 className="text-lg font-bold text-black dark:text-white mb-5 flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4 text-blue-500" />
                                            Related Intelligence
                                        </h2>
                                        <div className="space-y-3">
                                            {relatedPosts.map(rp => (
                                                <Link
                                                    key={rp.slug}
                                                    to={`/signals/${rp.slug}`}
                                                    className="group flex items-start gap-3 p-4 rounded-lg border border-gray-100 dark:border-white/5 hover:border-blue-200 dark:hover:border-blue-500/20 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all duration-200"
                                                >
                                                    <ChevronRight className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{rp.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{rp.date} · {rp.readTime}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Architecture Action Card */}
                                <div className="mt-16 p-8 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        <span>Direct Principal Systems Pairing</span>
                                    </div>
                                    <h3 className="text-2xl font-bold tracking-tight text-white">
                                        Evaluate This Whitepaper Architecture for Your Enterprise
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                                        Connect directly with our Principal AI Systems Architect in Bengaluru to model hardware sizing, latency envelopes, and private VPC deployment parameters.
                                    </p>
                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3.5 rounded-xl text-sm transition-all shadow-md group"
                                        >
                                            <MessageSquare className="w-4 h-4 fill-current" />
                                            <span>Chat on WhatsApp with Lead Architect</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                        <Link
                                            to="/waitlist"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-xl text-sm transition-all"
                                        >
                                            <span>Schedule Calendar Review &rarr;</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Article Footer Navigation */}
                                <div className="border-t border-gray-100 dark:border-white/5 mt-16 pt-10 flex items-center justify-between">
                                    <Link
                                        to="/signals"
                                        className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to All Signals
                                    </Link>
                                </div>
                            </motion.article>
                        ) : (
                            <div className="text-center py-20 text-gray-500">Signal not found.</div>
                        )
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}
