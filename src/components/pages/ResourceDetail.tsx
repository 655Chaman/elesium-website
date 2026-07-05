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
                            prose-h1:text-4xl prose-h2:text-2xl prose-h3:text-xl
                            prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-gray-100 dark:prose-h2:border-white/5 prose-h2:pb-4
                            prose-p:text-gray-600 dark:prose-p:text-gray-400 prose-p:leading-relaxed prose-p:mb-6
                            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-black dark:prose-strong:text-white prose-strong:font-semibold
                            prose-blockquote:border-l-2 prose-blockquote:border-black dark:prose-blockquote:border-white prose-blockquote:pl-6 prose-blockquote:font-medium prose-blockquote:text-gray-900 dark:prose-blockquote:text-gray-100 prose-blockquote:not-italic prose-blockquote:my-10
                            prose-li:text-gray-600 dark:prose-li:text-gray-400 prose-li:mb-3
                            prose-ul:list-none prose-ul:pl-0 prose-ul:my-8
                            prose-ul>li:relative prose-ul>li:pl-6
                            prose-ul>li:before:content-[''] prose-ul>li:before:absolute prose-ul>li:before:left-0 prose-ul>li:before:top-[0.6em] prose-ul>li:before:h-1.5 prose-ul>li:before:w-1.5 prose-ul>li:before:rounded-full prose-ul>li:before:bg-gray-300 dark:prose-ul>li:before:bg-gray-700
                            prose-ol:list-decimal prose-ol:pl-5 prose-ol:my-8
                            prose-code:bg-gray-100 dark:prose-code:bg-white/5 prose-code:rounded-md prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:before:content-none prose-code:after:content-none
                            prose-pre:bg-[#111] prose-pre:text-gray-100 prose-pre:rounded-2xl prose-pre:p-6 prose-pre:overflow-x-auto prose-pre:border prose-pre:border-white/10
                            prose-img:rounded-2xl prose-img:shadow-2xl prose-img:border prose-img:border-gray-100 dark:prose-img:border-white/10
                            prose-hr:border-gray-100 dark:prose-hr:border-white/5 prose-hr:my-12
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
