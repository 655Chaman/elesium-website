import { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Download, MessageSquare, ArrowRight, ChevronRight, FileText, ShieldCheck, Sparkles } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { resourcesData } from '../../data/resourcesData'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import { 
    ArchitecturePlayground, 
    BlueprintDownloadCard 
} from '../interactive'
import { useDwellTelemetry } from '../../hooks/useDwellTelemetry'

export default function ResourceDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const { activeDwellSeconds, scrollDepthPercent, interactionCount, isGoodClick, isLastLongestClickEligible, trackInteraction } = useDwellTelemetry(slug || 'resource-detail');

    const resource = slug ? resourcesData.find(r => r.slug === slug) : null;

    useEffect(() => {
        window.scrollTo(0, 0);
        
        if (resource?.markdownFile) {
            setLoading(true);
            fetch(resource.markdownFile)
                .then((res) => {
                    if (!res.ok) throw new Error('Failed to load markdown');
                    return res.text();
                })
                .then((text) => {
                    setMarkdownContent(text);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setMarkdownContent('Error loading documentation. Please try again later.');
                    setLoading(false);
                });
        }
    }, [slug, resource]);

    // Strip duplicate header (e.g. # Title, ### Subtitle) if already displayed in page header
    const cleanedMarkdown = useMemo(() => {
        if (!markdownContent) return '';
        let cleaned = markdownContent;
        
        // Remove leading H1 if it mirrors the resource title
        cleaned = cleaned.replace(/^#\s+[^\n]+\n+/, '');
        // Remove leading H3 subtitle if present
        cleaned = cleaned.replace(/^###\s+[^\n]+\n+/, '');
        // Remove author line if present right below title
        cleaned = cleaned.replace(/^\*[^\n]+\*\n+/, '');
        // Remove leading horizontal rule
        cleaned = cleaned.replace(/^---\n+/, '');
        
        return cleaned.trim();
    }, [markdownContent]);

    if (!resource) {
        return (
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-32 text-center">
                <p className="text-gray-500">Resource not found.</p>
                <button onClick={() => navigate('/resources')} className="text-black dark:text-white underline mt-4 inline-block font-medium">Back to Resources</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>{resource.title} | Technical Documentation | Elesium</title>
                <meta name="description" content={resource.description} />
                
                <meta property="og:title" content={`${resource.title} | Resources | Elesium`} />
                <meta property="og:description" content={resource.description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://elesium.online/resources/${resource.slug}`} />
                <link rel="canonical" href={`https://elesium.online/resources/${resource.slug}`} />
            </Helmet>

            <main className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400 mb-8">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <Link to="/resources" className="hover:text-black dark:hover:text-white transition-colors">
                        Resources
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-medium truncate max-w-[240px] sm:max-w-md">
                        {resource.title}
                    </span>
                </nav>

                <AnimatePresence mode="wait">
                    <motion.article
                        key="article"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Meta Category & Timestamps */}
                        <div className="flex flex-wrap items-center gap-3 mb-6 text-xs font-mono text-gray-500 dark:text-gray-400">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white font-medium uppercase tracking-wider text-[11px]">
                                <FileText className="w-3 h-3 text-emerald-500" />
                                {resource.category}
                            </span>
                            <span className="inline-flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {resource.date}
                            </span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {resource.readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-950 dark:text-white leading-[1.15] mb-5">
                            {resource.title}
                        </h1>

                        {/* Lead Summary */}
                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed font-normal mb-8">
                            {resource.description}
                        </p>

                        {/* Action Bar (Direct WhatsApp Desk + Download Drive Resource + ele-in SaaS) */}
                        <div className="flex flex-wrap items-center gap-3 pb-10 mb-10 border-b border-gray-100 dark:border-white/10">
                            <button
                                onClick={openWhatsApp}
                                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-sm transition-all shadow-sm group"
                            >
                                <MessageSquare className="w-4 h-4 fill-current" />
                                <span>Chat on WhatsApp with Lead Architect</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>

                            <a 
                                href={resource.googleDriveLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-sm transition-all shadow-sm"
                            >
                                <Download className="h-4 w-4" />
                                <span>Download PDF Document</span>
                            </a>

                            <Link
                                to="/waitlist"
                                className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-full border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400 font-medium text-xs sm:text-sm transition-all"
                            >
                                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                                <span>ele-in SaaS Waitlist &rarr;</span>
                            </Link>
                        </div>

                        {/* Markdown Content with Custom Components & Clean Styling */}
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
                            {loading ? (
                                <div className="space-y-4 py-8">
                                    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-100 dark:bg-white/5 rounded-full w-5/6 animate-pulse"></div>
                                </div>
                            ) : (
                                <ReactMarkdown 
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        h1: ({ node, ...props }) => (
                                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-950 dark:text-white mt-12 mb-4 pb-2 border-b border-gray-100 dark:border-white/10" {...props} />
                                        ),
                                        h2: ({ node, ...props }) => (
                                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-950 dark:text-white mt-10 mb-4" {...props} />
                                        ),
                                        h3: ({ node, ...props }) => (
                                            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-gray-900 dark:text-white mt-8 mb-3" {...props} />
                                        ),
                                        p: ({ node, ...props }) => (
                                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed mb-5" {...props} />
                                        ),
                                        strong: ({ node, ...props }) => (
                                            <strong className="font-semibold text-gray-950 dark:text-white" {...props} />
                                        ),
                                        em: ({ node, ...props }) => (
                                            <em className="italic text-gray-700 dark:text-gray-300" {...props} />
                                        ),
                                        hr: ({ node, ...props }) => (
                                            <hr className="my-10 border-gray-200 dark:border-white/10" {...props} />
                                        ),
                                        ul: ({ node, ...props }) => (
                                            <ul className="space-y-2.5 my-5 pl-5 list-disc text-gray-600 dark:text-gray-300 text-sm sm:text-base" {...props} />
                                        ),
                                        ol: ({ node, ...props }) => (
                                            <ol className="space-y-2.5 my-5 pl-5 list-decimal text-gray-600 dark:text-gray-300 text-sm sm:text-base" {...props} />
                                        ),
                                        li: ({ node, ...props }) => (
                                            <li className="leading-relaxed" {...props} />
                                        ),
                                        blockquote: ({ children }) => {
                                            return (
                                                <div className="my-6 p-5 rounded-2xl bg-gray-50/90 dark:bg-white/[0.03] border-l-4 border-black dark:border-white border-y border-r border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {children}
                                                </div>
                                            );
                                        },
                                        table: ({ node, ...props }) => (
                                            <div className="my-8 overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#070707]">
                                                <table className="w-full text-left border-collapse text-xs sm:text-sm" {...props} />
                                            </div>
                                        ),
                                        thead: ({ node, ...props }) => (
                                            <thead className="bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-semibold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-white/10" {...props} />
                                        ),
                                        th: ({ node, ...props }) => (
                                            <th className="px-5 py-3.5 whitespace-nowrap font-semibold" {...props} />
                                        ),
                                        tbody: ({ node, ...props }) => (
                                            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-gray-700 dark:text-gray-300" {...props} />
                                        ),
                                        tr: ({ node, ...props }) => (
                                            <tr className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors" {...props} />
                                        ),
                                        td: ({ node, ...props }) => (
                                            <td className="px-5 py-3.5 leading-relaxed" {...props} />
                                        ),
                                        code: ({ node, inline, className, children, ...props }: any) => {
                                            if (inline) {
                                                return (
                                                    <code className="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-white/10 font-mono text-xs text-gray-900 dark:text-gray-200" {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            }
                                            return (
                                                <pre className="my-6 p-5 rounded-2xl bg-[#0a0a0a] border border-gray-200 dark:border-white/10 font-mono text-xs text-gray-200 overflow-x-auto leading-relaxed" {...props}>
                                                    <code>{children}</code>
                                                </pre>
                                            );
                                        },
                                        a: ({ node, ...props }) => (
                                            <a className="text-black dark:text-white underline underline-offset-4 font-medium hover:opacity-80 transition-opacity" {...props} />
                                        ),
                                    }}
                                >
                                    {cleanedMarkdown}
                                </ReactMarkdown>
                            )}
                        </div>

                        {/* Interactive Architecture Simulator */}
                        <div className="mt-12">
                            <ArchitecturePlayground onTelemetry={trackInteraction} />
                        </div>

                        {/* Interactive Blueprint Download Card */}
                        <BlueprintDownloadCard onTelemetry={trackInteraction} />

                        {/* Live Telemetry Status Bar */}
                        <div className="my-10 p-4 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5">
                                    <span className={`h-2 w-2 rounded-full ${isGoodClick ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                                    Active Dwell: <strong className="text-black dark:text-white">{Math.floor(activeDwellSeconds / 60)}m {activeDwellSeconds % 60}s</strong>
                                </span>
                                <span className="hidden sm:inline">|</span>
                                <span className="hidden sm:inline">Scroll: <strong className="text-black dark:text-white">{scrollDepthPercent}%</strong></span>
                                <span className="hidden sm:inline">|</span>
                                <span className="hidden sm:inline">Interactions: <strong className="text-black dark:text-white">{interactionCount}</strong></span>
                            </div>
                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                                {isLastLongestClickEligible ? 'Navboost High-Retention Verified (180s+)' : isGoodClick ? 'Navboost GoodClick Active (120s+)' : 'Logging Session Telemetry'}
                            </span>
                        </div>

                        {/* Direct WhatsApp Engineering Intake Card */}
                        <div className="my-12 p-8 sm:p-10 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Direct Engineering Intake SLA</span>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                                Implement This Architecture in Production
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                                Connect directly with our Principal AI Systems Architect in Shivamogga to model hardware sizing, latency envelopes, and private VPC deployment parameters.
                            </p>
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                                <button
                                    onClick={openWhatsApp}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-8 py-4 rounded-full text-sm transition-all shadow-md group"
                                >
                                    <MessageSquare className="w-4 h-4 fill-current" />
                                    <span>Chat on WhatsApp with Lead Architect</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </button>
                                <Link
                                    to="/waitlist"
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-6 py-4 rounded-full text-sm transition-all"
                                >
                                    <span>ele-in SaaS Waitlist &rarr;</span>
                                </Link>
                            </div>
                        </div>

                        {/* Article Footer Navigation */}
                        <div className="border-t border-gray-100 dark:border-white/5 mt-16 pt-10 flex items-center justify-between">
                            <Link
                                to="/resources"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white hover:opacity-80 transition-opacity"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                <span>Back to All Resources</span>
                            </Link>
                        </div>
                    </motion.article>
                </AnimatePresence>
            </main>
        </div>
    )
}
