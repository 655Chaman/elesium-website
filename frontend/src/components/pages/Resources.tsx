import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { resourcesData } from '../../data/resourcesData'

export default function Resources() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const aeoAnswerCapsule = "The Elesium Engineering Resources and Technical Playbooks library provides production-ready deployment blueprints, empirical performance benchmarks, and mathematical frameworks for Enterprise CTOs and AI Systems Architects. Covering sovereign multi-agent topologies, sub-200ms vLLM PagedAttention inference runtimes, DPDP Act 2023 compliance enclaves, and enterprise SAP/Oracle automation scripts, these peer-reviewed resources establish verified industry benchmarks across 1,420+ deployments."

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "CollectionPage",
                "@id": "https://elesium.online/resources#collection",
                "name": "AI Automation Resources, Technical Playbooks & Benchmarks | Elesium",
                "description": aeoAnswerCapsule,
                "url": "https://elesium.online/resources",
                "publisher": {
                    "@type": "Organization",
                    "@id": "https://elesium.online/#organization",
                    "name": "Elesium",
                    "url": "https://elesium.online",
                    "logo": "https://elesium.online/assets/ele-in-logo.png"
                }
            },
            {
                "@type": "ItemList",
                "@id": "https://elesium.online/resources#itemlist",
                "name": "Elesium Technical Playbooks & Engineering Whitepapers",
                "description": "Curated collection of enterprise multi-agent blueprints, empirical benchmarks, and sovereign AI deployment guides.",
                "itemListElement": resourcesData.map((res, index) => ({
                    "@type": "ListItem",
                    "position": index + 1,
                    "name": res.title,
                    "description": res.description,
                    "url": res.markdownFile ? `https://elesium.online/resources/${res.slug}` : res.googleDriveLink
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://elesium.online/resources#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Resources",
                        "item": "https://elesium.online/resources"
                    }
                ]
            },
            {
                "@type": "WebPage",
                "@id": "https://elesium.online/resources#webpage",
                "name": "AI Automation Resources & Guides | Elesium",
                "description": aeoAnswerCapsule,
                "url": "https://elesium.online/resources",
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": [".answer-capsule", "h1", "h2"]
                }
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 transition-colors duration-300">
            <Helmet>
                <title>AI Automation Resources & Guides | Elesium</title>
                <meta name="description" content="Free AI automation playbooks, case studies and implementation guides from Elesium, India's leading AI automation agency." />
                
                {/* Open Graph */}
                <meta property="og:title" content="AI Automation Resources & Guides | Elesium" />
                <meta property="og:description" content="Free AI automation playbooks, case studies and implementation guides from Elesium, India's leading AI automation agency." />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://elesium.online/resources/" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />

                <link rel="canonical" href="https://elesium.online/resources/" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
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
                        <div className="mb-12 max-w-3xl">
                            <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-500 block mb-4">
                                Playbooks &amp; Guides
                            </span>
                            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-5 text-black dark:text-white leading-[1.12]">
                                Resources &amp; Guides
                            </h1>
                            <p className="answer-capsule text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed font-normal">
                                Practical playbooks, implementation guides, and reference scripts built from real enterprise deployments.
                            </p>
                        </div>

                        {/* Resources Sections */}
                        <div className="flex flex-col gap-12 md:gap-16">
                            
                            {/* Series Section */}
                            <section>
                                <div className="mb-6 flex items-end justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">Technical Series</h2>
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Comprehensive documentation and multi-part enterprise resources.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase px-4">
                                    <div className="col-span-6">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-3.5">
                                    {resourcesData.filter(r => r.section === 'series').map(resource => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 sm:p-6 md:items-center bg-neutral-50 dark:bg-neutral-950 hover:bg-white dark:hover:bg-black transition-all duration-300 rounded-[24px] border border-neutral-200 dark:border-white/10 group"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}/` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white leading-tight">
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-white border border-neutral-200 text-neutral-700 dark:bg-black dark:border-white/10 dark:text-neutral-300">
                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                                <span>{resource.date}</span>
                                                <span className="opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                                                {resource.markdownFile && (
                                                    <Link
                                                        to={`/resources/${resource.slug}/`}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white text-xs font-semibold rounded-full active:scale-[0.97] transition-all duration-300 whitespace-nowrap"
                                                    >
                                                        Read Guide
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold rounded-full active:scale-[0.97] transition-all duration-300 whitespace-nowrap"
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
                                <div className="mb-6 flex items-end justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
                                    <div>
                                        <h2 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">Segregated Workflows</h2>
                                        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 mt-1">Individual tools, trackers, and implementation blueprints.</p>
                                    </div>
                                </div>
                                
                                {/* Table Header */}
                                <div className="hidden md:grid grid-cols-12 gap-6 pb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase px-4">
                                    <div className="col-span-6">Resource</div>
                                    <div className="col-span-2">Category</div>
                                    <div className="col-span-2">Details</div>
                                    <div className="col-span-2 text-right">Action</div>
                                </div>

                                <div className="flex flex-col gap-3.5">
                                    {resourcesData.filter(r => r.section === 'segregated' || !r.section).map(resource => (
                                        <motion.div
                                            key={resource.id}
                                            initial={{ opacity: 0, y: 15 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                            className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 p-5 sm:p-6 md:items-center bg-neutral-50 dark:bg-neutral-950 hover:bg-white dark:hover:bg-black transition-all duration-300 rounded-[24px] border border-neutral-200 dark:border-white/10 group"
                                        >
                                            {/* Name & Description */}
                                            <div className="col-span-1 md:col-span-6 flex flex-col gap-1.5">
                                                <Link to={resource.markdownFile ? `/resources/${resource.slug}/` : '#'} className={resource.markdownFile ? 'cursor-pointer' : 'cursor-default'}>
                                                    <h3 className="text-base sm:text-lg font-semibold text-black dark:text-white leading-tight">
                                                        {resource.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed md:line-clamp-2">
                                                    {resource.description}
                                                </p>
                                            </div>

                                            {/* Category */}
                                            <div className="col-span-1 md:col-span-2 flex items-center">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-medium tracking-wide bg-white border border-neutral-200 text-neutral-700 dark:bg-black dark:border-white/10 dark:text-neutral-300">
                                                    <FileText className="w-3 h-3 mr-1.5" />
                                                    {resource.category}
                                                </span>
                                            </div>

                                            {/* Date / Read Time */}
                                            <div className="col-span-1 md:col-span-2 flex flex-col text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                                <span>{resource.date}</span>
                                                <span className="opacity-70 mt-0.5">{resource.readTime}</span>
                                            </div>

                                            {/* Action */}
                                            <div className="col-span-1 md:col-span-2 flex items-center justify-start md:justify-end gap-2">
                                                {resource.markdownFile && (
                                                    <Link
                                                        to={`/resources/${resource.slug}/`}
                                                        className="inline-flex items-center justify-center px-4 py-2 border border-neutral-200 dark:border-white/10 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white text-xs font-semibold rounded-full active:scale-[0.97] transition-all duration-300 whitespace-nowrap"
                                                    >
                                                        Read Guide
                                                    </Link>
                                                )}
                                                <a 
                                                    href={resource.googleDriveLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black text-xs font-semibold rounded-full active:scale-[0.97] transition-all duration-300 whitespace-nowrap"
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

                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
