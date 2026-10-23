import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, MessageSquare, ArrowRight, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { resourcesData } from '../../data/resourcesData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function Resources() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>AI Automation Resources & Guides | Elesium</title>
                <meta name="description" content="Free AI automation playbooks, case studies and implementation guides from Elesium — India's leading AI automation agency." />
                
                {/* Open Graph */}
                <meta property="og:title" content="AI Automation Resources & Guides | Elesium" />
                <meta property="og:description" content="Free AI automation playbooks, case studies and implementation guides from Elesium — India's leading AI automation agency." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://elesium.online/resources" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />

                <link rel="canonical" href="https://elesium.online/resources" />
            </Helmet>

            <main className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">Resources</span>
                </nav>

                <AnimatePresence mode="wait">
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
                                    Engineering Playbooks &amp; Benchmarks
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-black dark:text-white leading-[1.1]">
                                Resources &amp; Guides
                            </h1>
                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed font-normal">
                                Download our production tools, scripts, and workflows. Complete with detailed technical documentation and execution playbooks.
                            </p>
                        </div>

                        {/* Resources Sections */}
                        <div className="flex flex-col gap-12 md:gap-16">
                            
                            {/* Series Section */}
                            <section>
                                <div className="mb-6 flex items-end justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">Technical Series</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive documentation and multi-part enterprise resources.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-3 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase px-4">
                                    <div className="col-span-6">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {resourcesData.filter(r => r.section === 'series').map(resource => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 md:items-center bg-gray-50/80 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04] transition-colors rounded-2xl border border-gray-200 dark:border-white/10 group shadow-sm"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className={`text-base sm:text-lg font-semibold text-black dark:text-white leading-tight ${resource.markdownFile ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors' : ''}`}>
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                <span>{resource.date}</span>
                                                <span className="opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                                                {resource.markdownFile && (
                                                    <Link
                                                        to={`/resources/${resource.slug}`}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white text-xs font-semibold rounded-full transition-all"
                                                    >
                                                        Read Guide
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-xs font-semibold rounded-full transition-all shadow-sm"
                                                    title="Download Resource"
                                                >
                                                    <Download className="h-3.5 w-3.5 mr-1" />
                                                    <span>PDF</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Segregated Section */}
                            <section>
                                <div className="mb-6 flex items-end justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">Segregated Workflows</h2>
                                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Individual tools, trackers, and implementation blueprints.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-3 text-xs font-semibold tracking-wider text-gray-400 dark:text-gray-500 uppercase px-4">
                                    <div className="col-span-6">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {resourcesData.filter(r => r.section === 'segregated' || !r.section).map(resource => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.3 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 md:items-center bg-gray-50/80 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.04] transition-colors rounded-2xl border border-gray-200 dark:border-white/10 group shadow-sm"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className={`text-base sm:text-lg font-semibold text-black dark:text-white leading-tight ${resource.markdownFile ? 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors' : ''}`}>
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300">
                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-xs text-gray-500 dark:text-gray-400 font-mono">
                                                <span>{resource.date}</span>
                                                <span className="opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                                                {resource.markdownFile && (
                                                    <Link
                                                        to={`/resources/${resource.slug}`}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white text-xs font-semibold rounded-full transition-all"
                                                    >
                                                        Read Guide
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black text-xs font-semibold rounded-full transition-all shadow-sm"
                                                    title="Download Resource"
                                                >
                                                    <Download className="h-3.5 w-3.5 mr-1" />
                                                    <span>PDF</span>
                                                </a>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>

                            {/* Direct WhatsApp Intake Card */}
                            <div className="mt-8 p-8 sm:p-12 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    <span>Direct Principal Systems Pairing</span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-xl mx-auto">
                                    Need a Bespoke Architecture Blueprint for Your Team?
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                                    Connect directly with our Principal AI Systems Architect to review private VPC deployment feasibility.
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

                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
