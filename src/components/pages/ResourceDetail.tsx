import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, Download } from 'lucide-react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { resourcesData } from '../../data/resourcesData'

export default function ResourceDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [markdownContent, setMarkdownContent] = useState<string>('');
    const [loading, setLoading] = useState(true);

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

    if (!resource) {
        return (
            <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white pt-[120px] text-center">
                <p className="text-gray-500">Resource not found.</p>
                <button onClick={() => navigate('/resources')} className="text-blue-500 mt-4 inline-block">Back to Resources</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white overflow-y-auto pt-[52px]">
            <Helmet>
                <title>{resource.title} | Resources | Elesium</title>
                <meta name="description" content={resource.description} />
                
                <meta property="og:title" content={`${resource.title} | Resources | Elesium`} />
                <meta property="og:description" content={resource.description} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`https://elesium.online/resources/${resource.slug}`} />
                <link rel="canonical" href={`https://elesium.online/resources/${resource.slug}`} />
            </Helmet>

            {/* Header */}
            <div className="sticky top-[52px] z-40 bg-[#FAFAFA]/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
                <div className="max-w-4xl mx-auto px-5 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/resources')}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Resources
                    </button>
                    <span className="text-[11px] font-semibold tracking-[0.08em] uppercase text-blue-500 dark:text-blue-400">
                        Documentation
                    </span>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-5 md:px-6 py-12 md:py-20">
                <AnimatePresence mode="wait">
                    <motion.article
                        key="article"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Meta Header */}
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 mb-8 text-[11px] font-semibold text-gray-500 dark:text-gray-400 tracking-[0.06em] uppercase">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full">
                                {resource.category}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {resource.date}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {resource.readTime}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white leading-[1.15] mb-6">
                            {resource.title}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-normal mb-8">
                            {resource.description}
                        </p>

                        <a 
                            href={resource.googleDriveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors mb-12 shadow-md shadow-blue-500/20"
                        >
                            <Download className="h-5 w-5" />
                            Download Resource from Drive
                        </a>

                        <div className="border-b border-gray-100 dark:border-white/5 mb-10"></div>

                        {/* Markdown Content */}
                        <div className="prose prose-lg dark:prose-invert max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-black dark:prose-headings:text-white
                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed
                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-black dark:prose-strong:text-white
                            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                            prose-li:text-gray-600 dark:prose-li:text-gray-400
                            prose-ul:list-disc prose-ol:list-decimal
                            prose-code:bg-gray-100 dark:prose-code:bg-white/10 prose-code:rounded prose-code:px-1 prose-code:text-sm prose-code:font-mono prose-code:text-pink-500
                            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto
                            prose-img:rounded-lg prose-img:shadow-md
                        ">
                            {loading ? (
                                <div className="flex animate-pulse space-x-4">
                                    <div className="flex-1 space-y-6 py-1">
                                        <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                        <div className="space-y-3">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded col-span-2"></div>
                                                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded col-span-1"></div>
                                            </div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                            <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {markdownContent}
                                </ReactMarkdown>
                            )}
                        </div>

                        {/* Article Footer Navigation */}
                        <div className="border-t border-gray-100 dark:border-white/5 mt-16 pt-10 flex items-center justify-between">
                            <Link
                                to="/resources"
                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to All Resources
                            </Link>
                        </div>
                    </motion.article>
                </AnimatePresence>
            </main>
        </div>
    )
}
