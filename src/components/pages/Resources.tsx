import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ChevronRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { resourcesData } from '../../data/resourcesData'

export default function Resources() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white overflow-y-auto pt-[52px]">
            <Helmet>
                <title>Resources & Tools | Elesium</title>
                <meta name="description" content="Download our resources, tools, and automation workflows engineered for industrial leaders." />
                
                {/* Open Graph */}
                <meta property="og:title" content="Resources & Tools | Elesium" />
                <meta property="og:description" content="Download our resources, tools, and automation workflows engineered for industrial leaders." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://elesium.online/resources" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />

                <link rel="canonical" href="https://elesium.online/resources" />
            </Helmet>

            <main className="max-w-4xl mx-auto px-5 md:px-6 py-12 md:py-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* Intro Section */}
                        <div className="mb-12 md:mb-20 max-w-3xl relative">
                            <Link 
                                to="/" 
                                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors mb-8 group"
                            >
                                <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Home
                            </Link>
                            <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 text-black dark:text-white leading-[1.1]">
                                Resources
                            </h1>
                            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                Download our exclusive tools, scripts, and workflows. Complete with detailed documentation on how to implement them.
                            </p>
                        </div>

                        {/* Resources Grid/List */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Column 1: Series */}
                            <div>
                                <h2 className="text-2xl font-bold mb-8 text-black dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">Series</h2>
                                <div className="grid grid-cols-1 gap-y-12">
                                    {resourcesData.filter(r => r.section === 'series').map((resource, index) => {
                                        return (
                                            <motion.div
                                                key={resource.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                            >
                                                <div className="group flex flex-col gap-4 border-b border-gray-100 dark:border-white/5 pb-12">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-[11px] font-medium text-blue-500 dark:text-blue-400">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="tracking-[0.06em] uppercase">{resource.category}</span>
                                                        </div>
                                                        <div className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                                                            {resource.date} · {resource.readTime}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {resource.markdownFile ? (
                                                            <Link to={`/resources/${resource.slug}`} className="block">
                                                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                                                    {resource.title}
                                                                </h3>
                                                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                                                    {resource.description}
                                                                </p>
                                                                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-6">
                                                                    View Documentation <ChevronRight className="h-3 w-3" />
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div className="block mb-6">
                                                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black dark:text-white leading-tight">
                                                                    {resource.title}
                                                                </h3>
                                                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                    {resource.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        <a 
                                                            href={resource.googleDriveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download PDF
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Column 2: Segregated */}
                            <div>
                                <h2 className="text-2xl font-bold mb-8 text-black dark:text-white border-b border-gray-200 dark:border-white/10 pb-4">Segregated</h2>
                                <div className="grid grid-cols-1 gap-y-12">
                                    {resourcesData.filter(r => r.section === 'segregated' || !r.section).map((resource, index) => {
                                        return (
                                            <motion.div
                                                key={resource.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                            >
                                                <div className="group flex flex-col gap-4 border-b border-gray-100 dark:border-white/5 pb-12">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-2 text-[11px] font-medium text-blue-500 dark:text-blue-400">
                                                            <FileText className="h-4 w-4" />
                                                            <span className="tracking-[0.06em] uppercase">{resource.category}</span>
                                                        </div>
                                                        <div className="text-[11px] text-gray-400 dark:text-gray-600 font-medium">
                                                            {resource.date} · {resource.readTime}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {resource.markdownFile ? (
                                                            <Link to={`/resources/${resource.slug}`} className="block">
                                                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                                                                    {resource.title}
                                                                </h3>
                                                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                                                    {resource.description}
                                                                </p>
                                                                <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-6">
                                                                    View Documentation <ChevronRight className="h-3 w-3" />
                                                                </div>
                                                            </Link>
                                                        ) : (
                                                            <div className="block mb-6">
                                                                <h3 className="text-xl md:text-2xl font-semibold mb-4 text-black dark:text-white leading-tight">
                                                                    {resource.title}
                                                                </h3>
                                                                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                    {resource.description}
                                                                </p>
                                                            </div>
                                                        )}
                                                        
                                                        <a 
                                                            href={resource.googleDriveLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-full transition-colors"
                                                        >
                                                            <Download className="h-4 w-4" />
                                                            Download from Drive
                                                        </a>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
