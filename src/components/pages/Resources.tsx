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

                        {/* Resources Sections */}
                        <div className="flex flex-col gap-16 md:gap-24">
                            
                            {/* Series Section */}
                            <section>
                                <div className="mb-8 flex items-end justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">Series</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Comprehensive documentation and multi-part resources.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-4 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase px-4">
                                    <div className="col-span-5">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-3 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {resourcesData.filter(r => r.section === 'series').map((resource, index) => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:items-center hover:bg-white dark:hover:bg-white/[0.02] transition-colors rounded-2xl md:px-4 hover:shadow-sm dark:hover:shadow-none border border-transparent hover:border-gray-100 dark:hover:border-white/5 group"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-5 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className={`text-lg md:text-xl font-semibold text-black dark:text-white leading-tight ${resource.markdownFile ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' : ''}`}>
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center mt-2 md:mt-0">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 uppercase">
                                                    <FileText className="w-3.5 h-3.5 mr-2" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 md:mt-0">
                                                <span>{resource.date}</span>
                                                <span className="text-xs opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-3 flex items-center justify-start md:justify-end gap-4 mt-4 md:mt-0">
                                                {resource.markdownFile && (
                                                    <Link to={`/resources/${resource.slug}`} className="hidden lg:flex items-center text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                                        Docs <ChevronRight className="h-3 w-3 ml-0.5" />
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 bg-gray-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-black dark:hover:text-white text-sm font-medium rounded-full transition-all duration-300"
                                                    title="Download PDF"
                                                >
                                                    <Download className="h-4 w-4 md:mr-2" />
                                                    <span className="hidden md:inline">Download</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Segregated Section */}
                            <section>
                                <div className="mb-8 flex items-end justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white tracking-tight">Segregated</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Individual tools, trackers, and workflow guides.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-4 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase px-4">
                                    <div className="col-span-5">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-3 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {resourcesData.filter(r => r.section === 'segregated' || !r.section).map((resource, index) => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-6 md:items-center hover:bg-white dark:hover:bg-white/[0.02] transition-colors rounded-2xl md:px-4 hover:shadow-sm dark:hover:shadow-none border border-transparent hover:border-gray-100 dark:hover:border-white/5 group"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-5 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className={`text-lg md:text-xl font-semibold text-black dark:text-white leading-tight ${resource.markdownFile ? 'group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors' : ''}`}>
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center mt-2 md:mt-0">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-semibold tracking-wide bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300 uppercase">
                                                    <FileText className="w-3.5 h-3.5 mr-2" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-sm text-gray-500 dark:text-gray-400 font-medium mt-2 md:mt-0">
                                                <span>{resource.date}</span>
                                                <span className="text-xs opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-3 flex items-center justify-start md:justify-end gap-4 mt-4 md:mt-0">
                                                {resource.markdownFile && (
                                                    <Link to={`/resources/${resource.slug}`} className="hidden lg:flex items-center text-xs font-semibold text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors">
                                                        Docs <ChevronRight className="h-3 w-3 ml-0.5" />
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center w-10 h-10 md:w-auto md:h-auto md:px-5 md:py-2.5 bg-gray-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-black dark:hover:text-white text-sm font-medium rounded-full transition-all duration-300"
                                                    title="Download Resource"
                                                >
                                                    <Download className="h-4 w-4 md:mr-2" />
                                                    <span className="hidden md:inline">Download</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
