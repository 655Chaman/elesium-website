import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, TrendingUp, Cpu, Network, Calendar, Clock, ChevronRight, ChevronDown, ExternalLink } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { blogPosts } from '../../data/blogPosts'

export default function MarketSignals() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const activeArticle = slug ? blogPosts.find(post => post.slug === slug) : null;

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
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white overflow-y-auto pt-[52px]">
            {/* SEO Helmet — Pillar 2: JSON-LD Schema */}
            {activeArticle ? (
                <Helmet>
                    <title>{activeArticle.title} | Elesium</title>
                    <meta name="description" content={activeArticle.metaDescription} />
                    <meta property="og:title" content={activeArticle.title} />
                    <meta property="og:description" content={activeArticle.metaDescription} />
                    <meta property="og:type" content="article" />
                    <meta property="og:url" content={`https://elesium.online/signals/${activeArticle.slug}`} />
                    <link rel="canonical" href={`https://elesium.online/signals/${activeArticle.slug}`} />
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
                    <link rel="canonical" href="https://elesium.online/signals" />
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
                                </div>

                                {/* Title */}
                                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-8">
                                    {activeArticle.title}
                                </h1>

                                {/* Intro */}
                                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-normal border-b border-gray-100 dark:border-white/5 pb-10 mb-10">
                                    {activeArticle.intro}
                                </p>

                                {/* Dynamic Sections */}
                                <div className="space-y-8">
                                    {activeArticle.sections.map((section, sIdx) => {
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
                                    })}
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
