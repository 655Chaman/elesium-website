import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, TrendingUp, Cpu, Network, Calendar, Clock, ChevronRight, ChevronDown, ExternalLink, MessageSquare } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackInteraction } = useDwellTelemetry(slug || 'signals-directory');

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

    const markdownComponents = {
        table: ({ node, ...props }: any) => (
            <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm font-sans divide-y divide-gray-200 dark:divide-white/10" {...props} />
            </div>
        ),
        thead: ({ node, ...props }: any) => (
            <thead className="bg-gray-100/80 dark:bg-white/[0.04] text-xs font-mono uppercase tracking-wider text-gray-700 dark:text-gray-300" {...props} />
        ),
        tbody: ({ node, ...props }: any) => (
            <tbody className="divide-y divide-gray-200 dark:divide-white/5 text-gray-700 dark:text-gray-300" {...props} />
        ),
        tr: ({ node, ...props }: any) => (
            <tr className="hover:bg-gray-100/50 dark:hover:bg-white/[0.02] transition-colors" {...props} />
        ),
        th: ({ node, ...props }: any) => (
            <th className="px-4 py-3.5 font-semibold text-gray-900 dark:text-white" {...props} />
        ),
        td: ({ node, ...props }: any) => (
            <td className="px-4 py-3.5 leading-relaxed align-top" {...props} />
        ),
        blockquote: ({ node, children, ...props }: any) => (
            <blockquote className="my-6 border-l-2 border-black dark:border-white/40 bg-gray-50/80 dark:bg-white/[0.02] p-4 sm:p-5 rounded-r-2xl text-sm sm:text-base text-gray-700 dark:text-gray-300 italic" {...props}>
                {children}
            </blockquote>
        ),
        h2: ({ node, ...props }: any) => (
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-100 dark:border-white/5" {...props} />
        ),
        h3: ({ node, ...props }: any) => (
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mt-6 mb-3" {...props} />
        ),
        p: ({ node, ...props }: any) => (
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal my-4" {...props} />
        ),
        ul: ({ node, ...props }: any) => (
            <ul className="space-y-2 my-4 pl-4 list-disc text-gray-600 dark:text-gray-400" {...props} />
        ),
        li: ({ node, ...props }: any) => (
            <li className="leading-relaxed" {...props} />
        ),
        code: ({ node, className, children, ...props }: any) => {
            const isInline = !className
            return isInline ? (
                <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-xs font-mono text-gray-900 dark:text-gray-200" {...props}>
                    {children}
                </code>
            ) : (
                <pre className="p-4 my-6 rounded-2xl bg-neutral-900 text-neutral-100 font-mono text-xs overflow-x-auto border border-white/10">
                    <code className={className} {...props}>{children}</code>
                </pre>
            )
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
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

            <main className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    {slug ? (
                        <>
                            <Link to="/signals" className="hover:text-black dark:hover:text-white transition-colors">
                                Market Signals
                            </Link>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[200px] sm:max-w-sm">
                                {activeArticle ? activeArticle.title.replace(/\*\*/g, '') : slug}
                            </span>
                        </>
                    ) : (
                        <span className="text-gray-900 dark:text-white font-medium">Market Signals</span>
                    )}
                </nav>

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
                            <div className="mb-14 md:mb-16 max-w-3xl">
                                <div className="inline-flex items-center gap-2 mb-4">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                                        Technical Intelligence Ledger
                                    </span>
                                </div>
                                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-black dark:text-white leading-[1.1]">
                                    Market Signals &amp; Intelligence.
                                </h1>
                                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                    Real-time market shifts, supply chain constraints, and operational bottlenecks. 
                                    Strategic insights engineered exclusively for defense, aerospace, and industrial leaders.
                                </p>
                            </div>

                            {/* Articles Grid/List */}
                            <div className="grid grid-cols-1 gap-y-8">
                                {blogPosts.map((article, index) => {
                                    const Icon = getIcon(article.category);
                                    return (
                                        <motion.div
                                            key={article.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                        >
                                            <Link 
                                                to={`/signals/${article.slug}`}
                                                className="group flex flex-col md:flex-row gap-4 md:gap-8 p-6 sm:p-8 rounded-3xl bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all cursor-pointer block shadow-sm"
                                            >
                                                <div className="md:w-1/4 flex flex-col gap-2">
                                                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                                                        <Icon className="h-3.5 w-3.5" />
                                                        <span className="uppercase tracking-wider">{article.category}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                                                        {article.date} · {article.readTime}
                                                    </div>
                                                </div>

                                                <div className="md:w-3/4">
                                                    <h2 className="text-lg sm:text-2xl font-bold mb-3 text-black dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 leading-tight">
                                                        {article.title}
                                                    </h2>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                                        {article.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs font-semibold text-black dark:text-white font-mono">
                                                        <span>Read Intelligence Report</span>
                                                        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
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
                                className="max-w-4xl mx-auto"
                            >
                                {/* Meta Header */}
                                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-6 text-xs font-mono text-gray-500 dark:text-gray-400 tracking-wider uppercase">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-900 dark:text-white rounded-full font-semibold">
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
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        By {activeArticle.author?.name || 'Chaman Shah'} ({activeArticle.author?.role || 'Principal AI Systems Architect'})
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-6">
                                    {activeArticle.title}
                                </h1>

                                {/* Intro */}
                                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal border-b border-gray-200 dark:border-white/10 pb-8 mb-8">
                                    {activeArticle.intro}
                                </p>

                                {/* Behavioral Dwell Hook 1: Executive Timestamped Audio Synthesis Briefing */}
                                <ExecutiveAudioBriefing 
                                    postTitle={activeArticle.title.replace(/\*\*/g, '')}
                                    onTelemetry={trackInteraction} 
                                />

                                {/* Dynamic Sections with Interactive Assets */}
                                <div className="space-y-6 mt-8">
                                    {activeArticle.sections.map((section, sIdx) => {
                                        const shouldInjectPlayground = sIdx === 2 && !activeArticle.sections.some(s => s.type === 'playground');
                                        const shouldInjectRoiCalculator = sIdx === Math.min(5, activeArticle.sections.length - 1) && !activeArticle.sections.some(s => s.type === 'roi_calculator');

                                        const renderedSection = (() => {
                                            switch (section.type) {
                                                case 'heading':
                                                    return (
                                                        <h2 key={sIdx} className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight mt-10 mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                                                            {section.value as string}
                                                        </h2>
                                                    );
                                                case 'paragraph':
                                                    return (
                                                        <div key={sIdx} className="my-4">
                                                            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                                                {section.value as string}
                                                            </ReactMarkdown>
                                                        </div>
                                                    );
                                                case 'list':
                                                    return (
                                                        <ul key={sIdx} className="space-y-3 my-6 pl-1">
                                                            {(section.value as string[]).map((item, iIdx) => {
                                                                const [boldPart, rest] = item.includes(':') ? item.split(':', 2) : [null, item];
                                                                return (
                                                                    <li key={iIdx} className="flex items-start gap-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-500" />
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
                                                        <blockquote key={sIdx} className="border-l-2 border-black dark:border-white/40 bg-gray-50/80 dark:bg-white/[0.02] p-4 sm:p-5 rounded-r-2xl my-6">
                                                            <p className="text-sm sm:text-base italic text-gray-800 dark:text-gray-200 leading-relaxed">
                                                                {section.value as string}
                                                            </p>
                                                        </blockquote>
                                                    );
                                                case 'metric':
                                                    return (
                                                        <div key={sIdx} className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
                                                            {(section.value as { label: string; value: string; description: string }[]).map((metric, mIdx) => (
                                                                <div key={mIdx} className="bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-2xl p-5 flex flex-col justify-between">
                                                                    <div>
                                                                        <div className="text-2xl sm:text-3xl font-bold font-mono text-black dark:text-white tracking-tight mb-1">
                                                                            {metric.value}
                                                                        </div>
                                                                        <div className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase mb-2">
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
                                                                <div key={fIdx} className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]">
                                                                    <button
                                                                        onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                                                                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-colors"
                                                                    >
                                                                        <span>{item.q}</span>
                                                                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${openFaq === fIdx ? 'rotate-180' : ''}`} />
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

                                {/* System 1 -> System 2 Topical Equity Bridge: Commercial Solution Callout */}
                                {matchedSolution && (
                                    <div className="my-10 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.03] shadow-sm">
                                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-3">
                                            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                                            <span className="font-semibold">Deploy This Architecture in Production</span>
                                            <span className="text-gray-400 text-[10px] hidden sm:inline">| Sovereign Commercial Implementation</span>
                                        </div>

                                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                            Operationalize This Architecture with Private VPC Isolation
                                        </h3>

                                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
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

                                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-200 dark:border-white/10 text-xs font-mono">
                                            <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Private VPC Isolated</span>
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Sub-200ms Latency SLA</span>
                                                <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> DPDP Act 2023 Compliant</span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-3">
                                                <button
                                                    onClick={openWhatsApp}
                                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-xs font-mono tracking-wide transition-all shadow-sm group"
                                                >
                                                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                                    <span>Chat on WhatsApp</span>
                                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                                </button>
                                                <Link
                                                    to={`/solutions/${matchedSolution.slug}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 font-medium text-xs font-mono transition-all text-gray-700 dark:text-gray-300"
                                                >
                                                    <span>View Architecture Details &rarr;</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Pillar 5: FAQ Section */}
                                {activeArticle.faq && activeArticle.faq.length > 0 && (
                                    <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8">
                                        <h2 className="text-xl font-bold text-black dark:text-white mb-6">Frequently Asked Questions</h2>
                                        <div className="space-y-3">
                                            {activeArticle.faq.map((item, fIdx) => (
                                                <div key={fIdx} className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.01]">
                                                    <button
                                                        onClick={() => setOpenFaq(openFaq === fIdx + 100 ? null : fIdx + 100)}
                                                        className="w-full flex items-center justify-between p-4 text-left text-sm font-semibold text-black dark:text-white hover:bg-gray-100 dark:hover:bg-white/[0.03] transition-colors"
                                                    >
                                                        <span>{item.q}</span>
                                                        <ChevronDown className={`h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200 ${openFaq === fIdx + 100 ? 'rotate-180' : ''}`} />
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
                                    <div className="mt-12 border-t border-gray-200 dark:border-white/10 pt-8">
                                        <h2 className="text-lg font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                                            <ExternalLink className="h-4 w-4 text-emerald-500" />
                                            Related Intelligence
                                        </h2>
                                        <div className="space-y-3">
                                            {relatedPosts.map(rp => (
                                                <Link
                                                    key={rp.slug}
                                                    to={`/signals/${rp.slug}`}
                                                    className="group flex items-start gap-3 p-4 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/60 dark:bg-white/[0.02] hover:border-black dark:hover:border-white/30 transition-all duration-200"
                                                >
                                                    <ChevronRight className="h-4 w-4 mt-0.5 text-gray-400 group-hover:text-black dark:group-hover:text-white flex-shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-semibold text-black dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{rp.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{rp.date} · {rp.readTime}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Bottom Architecture Action Card */}
                                <div className="mt-12 p-8 sm:p-12 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                        <span>Direct Principal Systems Pairing</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-xl mx-auto">
                                        Evaluate This Whitepaper Architecture for Your Enterprise
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                                        Connect directly with our Principal AI Systems Architect to model hardware sizing, latency envelopes, and private VPC deployment parameters.
                                    </p>
                                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                        <button
                                            onClick={openWhatsApp}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                                        >
                                            <MessageSquare className="w-4 h-4 fill-current" />
                                            <span>Chat on WhatsApp with Lead Architect</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                        </button>
                                        <Link
                                            to="/waitlist"
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-full text-sm transition-all"
                                        >
                                            <span>ele-in SaaS Waitlist &rarr;</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Article Footer Navigation */}
                                <div className="border-t border-gray-200 dark:border-white/10 mt-12 pt-8 flex items-center justify-between">
                                    <Link
                                        to="/signals"
                                        className="flex items-center gap-2 text-xs font-mono font-semibold text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
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
