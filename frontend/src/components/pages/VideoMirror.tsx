import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
    Clock, 
    ShieldCheck, 
    Cpu, 
    ArrowRight, 
    FileText, 
    ChevronDown, 
    ChevronUp, 
    Building2, 
    Calendar,
    Play,
    Search,
    X,
    Check,
    Copy,
    Zap,
    Film,
    Layers
} from 'lucide-react';
import { 
    videoMasterclasses, 
    VideoMasterclass, 
    shortFormVideos, 
    deepMasterclasses 
} from '../../data/videoMasterclasses';
import { isRetainedSolutionSlug } from '../../data/solutionsHubData';
import { useWhatsApp } from '../../hooks/useWhatsApp';

function resolveVideoActionRoute(slug: string, industry: string): string {
    if (slug === 'ai-automation-cost-india-2026-pricing' || slug === 'enterprise-ai-roi-calculator') {
        return '/tools/enterprise-ai-roi-calculator/';
    }
    const explicitMap: Record<string, string> = {
        'langgraph-vs-n8n-enterprise-agents': '/compare/n8n-enterprise-vs-custom-langgraph-agents/',
        'bfsi-autonomous-loan-underwriting': '/solutions/deterministic-automated-loan-underwriting-unified-deepseek-agents-for-fintech-ctos/',
        'enterprise-ai-automation-india-2026': '/enterprise-ai-bangalore/',
    };
    if (explicitMap[slug]) {
        return explicitMap[slug];
    }
    if (isRetainedSolutionSlug(slug)) {
        return `/solutions/${slug}/`;
    }
    const lowerInd = (industry || '').toLowerCase();
    if (lowerInd.includes('bfsi') || lowerInd.includes('bank') || lowerInd.includes('fintech')) {
        return '/solutions/category/bfsi/';
    }
    if (lowerInd.includes('logistics') || lowerInd.includes('supply')) {
        return '/solutions/category/logistics/';
    }
    if (lowerInd.includes('health') || lowerInd.includes('clinical')) {
        return '/solutions/category/healthcare/';
    }
    if (lowerInd.includes('manufactur') || lowerInd.includes('scada')) {
        return '/solutions/category/manufacturing/';
    }
    return '/solutions/';
}

export default function VideoMirror() {
    const { slug } = useParams<{ slug?: string }>();
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();
    
    // Find active masterclass based on slug or default to first
    const activeVideo: VideoMasterclass = 
        videoMasterclasses.find((v) => v.slug === slug) || videoMasterclasses[0];
    
    // Tab states
    const [activeTab, setActiveTab] = useState<'architecture' | 'moments' | 'transcript'>('architecture');
    const [transcriptExpanded, setTranscriptExpanded] = useState<boolean>(true);
    const [hasCopiedTranscript, setHasCopiedTranscript] = useState<boolean>(false);
    
    // Gallery filter and search states
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'shorts' | 'masterclasses'>('all');
    const [selectedIndustry, setSelectedIndustry] = useState<string>('all');

    // Play Modal state
    const [isPlayModalOpen, setIsPlayModalOpen] = useState<boolean>(false);
    const [modalVideo, setModalVideo] = useState<VideoMasterclass | null>(null);
    const [modalActiveMoment, setModalActiveMoment] = useState<number>(0);
    const [modalCopied, setModalCopied] = useState<boolean>(false);

    // Scroll to top on video change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeVideo.slug]);

    // Unique industries for filter pills
    const allIndustries = useMemo(() => {
        const set = new Set<string>();
        videoMasterclasses.forEach(v => set.add(v.industry));
        return ['all', ...Array.from(set)];
    }, []);

    // Filtered video list for gallery
    const filteredVideos = useMemo(() => {
        return videoMasterclasses.filter(v => {
            // Type filter
            if (activeFilter === 'shorts' && v.videoType !== 'short' && v.duration !== '0:30' && v.duration !== '00:30') return false;
            if (activeFilter === 'masterclasses' && (v.videoType === 'short' || v.duration === '0:30' || v.duration === '00:30')) return false;

            // Industry filter
            if (selectedIndustry !== 'all' && v.industry !== selectedIndustry) return false;

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase();
                const matchTitle = v.title.toLowerCase().includes(q);
                const matchSummary = v.executiveSummary.toLowerCase().includes(q);
                const matchIndustry = v.industry.toLowerCase().includes(q);
                const matchKeyword = v.keyword?.toLowerCase().includes(q);
                const matchBenefit = v.keyBenefit?.toLowerCase().includes(q);
                return matchTitle || matchSummary || matchIndustry || matchKeyword || matchBenefit;
            }

            return true;
        });
    }, [activeFilter, selectedIndustry, searchQuery]);

    // Copy transcript handler
    const handleCopyTranscript = (text: string, isModal = false) => {
        navigator.clipboard.writeText(text);
        if (isModal) {
            setModalCopied(true);
            setTimeout(() => setModalCopied(false), 2000);
        } else {
            setHasCopiedTranscript(true);
            setTimeout(() => setHasCopiedTranscript(false), 2000);
        }
    };

    // Open play modal
    const handleOpenPlayModal = (video: VideoMasterclass) => {
        setModalVideo(video);
        setModalActiveMoment(0);
        setIsPlayModalOpen(true);
    };

    // Close play modal
    const handleClosePlayModal = () => {
        setIsPlayModalOpen(false);
        setModalVideo(null);
    };

    // Build comprehensive VideoObject JSON-LD Schema conforming to Google Search Central
    const videoSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "VideoObject",
                "@id": `https://elesium.online/videos/${activeVideo.slug}/#video`,
                "name": activeVideo.title,
                "description": activeVideo.executiveSummary,
                "thumbnailUrl": [
                    activeVideo.heroImage || `https://elesium.online/video_thumbnails/${activeVideo.slug}.jpg`,
                    `https://elesium.online/video_thumbnails/${activeVideo.slug}.jpg`,
                    `https://elesium.online/og-image.png`
                ],
                "uploadDate": activeVideo.uploadDate,
                "duration": activeVideo.durationIso,
                "embedUrl": `https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}`,
                "contentUrl": `https://elesium.online/videos/${activeVideo.slug}/`,
                "transcript": activeVideo.fullTranscript,
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online/",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://elesium.online/assets/logo-square.png",
                        "width": "512",
                        "height": "512"
                    }
                },
                "hasPart": activeVideo.keyMoments.map((km) => ({
                    "@type": "Clip",
                    "name": km.title,
                    "startOffset": km.seconds,
                    "url": `https://elesium.online/videos/${activeVideo.slug}/?t=${km.seconds}`
                }))
            },
            {
                "@type": "TechArticle",
                "headline": activeVideo.title,
                "description": activeVideo.executiveSummary,
                "author": {
                    "@type": "Organization",
                    "name": "Elesium AI Systems Architecture Team"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online/"
                },
                "mainEntityOfPage": `https://elesium.online/videos/${activeVideo.slug}/`,
                "datePublished": activeVideo.uploadDate
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Architecture Video Vault",
                        "item": "https://elesium.online/videos/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": activeVideo.title,
                        "item": `https://elesium.online/videos/${activeVideo.slug}/`
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>{activeVideo.title} | Elesium Video Vault</title>
                <meta name="description" content={activeVideo.executiveSummary} />
                <link rel="canonical" href={`https://elesium.online/videos/${activeVideo.slug}/`} />
                <meta property="og:title" content={`${activeVideo.title} | Elesium`} />
                <meta property="og:description" content={activeVideo.executiveSummary} />
                <meta property="og:url" content={`https://elesium.online/videos/${activeVideo.slug}/`} />
                <meta property="og:type" content="video.other" />
                <meta property="og:image" content={activeVideo.heroImage || "https://elesium.online/og-image.png"} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${activeVideo.title} | Elesium`} />
                <meta name="twitter:description" content={activeVideo.executiveSummary} />
                <meta name="twitter:image" content={activeVideo.heroImage || "https://elesium.online/og-image.png"} />
                <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Global Breadcrumb & Top Bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200 dark:border-white/10 pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/videos/" className="hover:text-black dark:hover:text-white transition-colors">Video Vault</Link>
                        <span>/</span>
                        <span className="text-black dark:text-white font-medium truncate max-w-xs sm:max-w-md">{activeVideo.slug}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-mono tracking-wider uppercase">
                            <Film className="w-3.5 h-3.5" />
                            {videoMasterclasses.length} Production Breakdowns
                        </span>
                    </div>
                </div>

                {/* ACTIVE VIDEO THEATER SECTION */}
                <section className="mb-16">
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-3">
                            <span className="flex items-center gap-1 font-semibold px-3 py-1 rounded-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-black dark:text-white">
                                <Building2 className="w-3.5 h-3.5" />
                                {activeVideo.industry}
                            </span>
                            <span className="flex items-center gap-1 font-semibold px-3 py-1 rounded-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-black dark:text-white">
                                <Layers className="w-3.5 h-3.5" />
                                {activeVideo.category}
                            </span>
                            <span className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400">
                                <Clock className="w-3.5 h-3.5 text-neutral-400" />
                                {activeVideo.duration} Runtime
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-neutral-500">
                                <Calendar className="w-3.5 h-3.5" />
                                Updated October 2026
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black dark:text-white mb-4 leading-snug max-w-5xl">
                            {activeVideo.title}
                        </h1>

                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-4xl">
                            {activeVideo.executiveSummary}
                        </p>
                    </div>

                    {/* Cinema Player Container */}
                    <div className="relative rounded-[28px] overflow-hidden border border-neutral-200 dark:border-white/10 bg-black mb-8">
                        <div className="aspect-video w-full relative">
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?rel=0&modestbranding=1`}
                                title={activeVideo.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>

                        {/* Top Overlay Badge on Video */}
                        <div className="px-6 py-3.5 bg-neutral-950 dark:bg-black border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
                                <span className="text-neutral-300">
                                    {activeVideo.videoType === 'short' 
                                        ? '30s Vertical Architecture Breakdown | Sovereign AI Production' 
                                        : 'Deterministic Sovereign VPC Engineering Masterclass'}
                                </span>
                            </div>

                            <button
                                onClick={() => handleOpenPlayModal(activeVideo)}
                                className="inline-flex items-center gap-1.5 text-white hover:underline font-semibold active:scale-[0.97] transition-transform"
                            >
                                <Play className="w-3.5 h-3.5" />
                                Launch Interactive Chapter Player
                            </button>
                        </div>
                    </div>

                    {/* High-Impact ROI Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
                        {activeVideo.roiMetrics.map((m, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-[22px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden group hover:border-black dark:hover:border-white/30 transition-all duration-300 h-full flex flex-col justify-between"
                            >
                                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1 font-mono text-black dark:text-white">
                                    {m.value}
                                </div>
                                <div className="text-sm font-semibold text-black dark:text-white mb-0.5">
                                    {m.label}
                                </div>
                                <div className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                    {m.detail}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Interactive Workspace (Tabs: Architecture, Moments, Transcript) */}
                    <div className="rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 p-6 lg:p-8 mb-12">
                        {/* Tabs Navigation Header */}
                        <div className="flex border-b border-neutral-200 dark:border-white/10 pb-4 mb-6 gap-6 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('architecture')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'architecture'
                                        ? 'text-black dark:text-white'
                                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <Cpu className="w-4 h-4" />
                                System Architecture Blueprint
                                {activeTab === 'architecture' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('moments')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'moments'
                                        ? 'text-black dark:text-white'
                                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <Clock className="w-4 h-4" />
                                Key Moments & Timecodes ({activeVideo.keyMoments.length})
                                {activeTab === 'moments' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'transcript'
                                        ? 'text-black dark:text-white'
                                        : 'text-neutral-500 hover:text-black dark:hover:text-white'
                                }`}
                            >
                                <FileText className="w-4 h-4" />
                                Verbatim Master Transcript
                                {activeTab === 'transcript' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
                                )}
                            </button>
                        </div>

                        {/* Tab 1: Architecture Blueprint */}
                        {activeTab === 'architecture' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {activeVideo.architectureStages.map((stage, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 rounded-[20px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between h-full hover:border-black dark:hover:border-white/30 transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono font-bold text-black dark:text-white uppercase tracking-wider">
                                                    {stage.stage}
                                                </span>
                                                <ShieldCheck className="w-4 h-4 text-black dark:text-white" />
                                            </div>
                                            <h3 className="text-lg font-bold text-black dark:text-white mb-4">
                                                {stage.name}
                                            </h3>
                                            <ul className="space-y-2.5 mb-6">
                                                {stage.bullets.map((b, bIdx) => (
                                                    <li key={bIdx} className="flex items-start gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                                                        <span className="text-black dark:text-white font-bold mt-0.5">•</span>
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-neutral-200 dark:border-white/10">
                                            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">
                                                Engineered Stack
                                            </div>
                                            <div className="text-xs font-mono text-black dark:text-white font-medium">
                                                {stage.techStack}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab 2: Key Moments & Chapters */}
                        {activeTab === 'moments' && (
                            <div className="space-y-4">
                                {activeVideo.keyMoments.map((km, idx) => (
                                    <div
                                        key={idx}
                                        className="p-5 rounded-[20px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black hover:border-black dark:hover:border-white/30 transition-all duration-300 flex flex-col sm:flex-row items-start gap-4"
                                    >
                                        <div className="px-3.5 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-black dark:text-white font-mono text-xs font-bold shrink-0">
                                            {km.time}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-semibold text-black dark:text-white mb-1">
                                                {km.title}
                                            </h4>
                                            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-3">
                                                {km.description}
                                            </p>
                                            
                                            {/* Extra details from timecodes if available */}
                                            {activeVideo.timecodes && activeVideo.timecodes[idx] && (
                                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 dark:border-white/10 text-xs font-mono">
                                                    <span className="text-neutral-500">On-Screen Caption:</span>
                                                    <span className="text-black dark:text-white bg-neutral-100 dark:bg-neutral-900 px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-white/10 font-bold">
                                                        {activeVideo.timecodes[idx].caption}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab 3: Full Indexed Transcript Accordion */}
                        {activeTab === 'transcript' && (
                            <div>
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-xs text-neutral-600 dark:text-neutral-400 font-mono">
                                        Word-for-word transcript indexed by Google Video Search algorithm
                                    </span>
                                    
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCopyTranscript(activeVideo.fullTranscript)}
                                            className="text-xs font-mono text-black dark:text-white flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-[0.97] transition-all duration-300"
                                        >
                                            {hasCopiedTranscript ? <Check className="w-3.5 h-3.5 text-black dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                            {hasCopiedTranscript ? 'Copied Transcript' : 'Copy Full Transcript'}
                                        </button>

                                        <button
                                            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                                            className="text-xs font-mono text-neutral-500 hover:text-black dark:hover:text-white flex items-center gap-1"
                                        >
                                            {transcriptExpanded ? 'Collapse' : 'Expand All'}
                                            {transcriptExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {transcriptExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                            className="accordion-panel overflow-hidden"
                                        >
                                            <div className="p-6 rounded-[20px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10 font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                                                {activeVideo.fullTranscript}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </section>

                {/* INTERACTIVE VIDEO GALLERY EXPLORER */}
                <section className="mb-16 pt-8 border-t border-neutral-200 dark:border-white/10">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-widest font-semibold mb-2">
                                <Film className="w-4 h-4" />
                                Comprehensive Video Asset Vault
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white tracking-tight">
                                Explore All {videoMasterclasses.length} Architecture Breakdowns & Masterclasses
                            </h2>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 max-w-2xl">
                                Filter across 30-second vertical BOFU teardowns and deep masterclasses. Every asset features Google Search Central compliant VideoObject JSON-LD.
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search keyword, industry, topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-xs text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:border-black dark:focus:border-white/40 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Filter Tabs & Industry Chips */}
                    <div className="mb-8 space-y-4">
                        {/* Type Tabs */}
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-[0.97] ${
                                    activeFilter === 'all'
                                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10'
                                }`}
                            >
                                All Video Assets ({videoMasterclasses.length})
                            </button>

                            <button
                                onClick={() => setActiveFilter('shorts')}
                                className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-[0.97] flex items-center gap-1.5 ${
                                    activeFilter === 'shorts'
                                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10'
                                }`}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                30s Short-Form Vault ({shortFormVideos.length})
                            </button>

                            <button
                                onClick={() => setActiveFilter('masterclasses')}
                                className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 active:scale-[0.97] flex items-center gap-1.5 ${
                                    activeFilter === 'masterclasses'
                                        ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                        : 'bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-200 dark:border-white/10'
                                }`}
                            >
                                <Film className="w-3.5 h-3.5" />
                                Deep Masterclasses ({deepMasterclasses.length})
                            </button>
                        </div>

                        {/* Industry Chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-200 dark:border-white/10">
                            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider mr-1">
                                Sector:
                            </span>
                            {allIndustries.map((ind) => (
                                <button
                                    key={ind}
                                    onClick={() => setSelectedIndustry(ind)}
                                    className={`text-[11px] font-mono px-3 py-1 rounded-full transition-all duration-300 ${
                                        selectedIndustry === ind
                                            ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                            : 'bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {ind === 'all' ? 'All Sectors' : ind}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Video Gallery Grid */}
                    {filteredVideos.length === 0 ? (
                        <div className="p-12 text-center rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm">No videos match your current search query or filter.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveFilter('all'); setSelectedIndustry('all'); }}
                                className="mt-4 text-xs font-mono text-black dark:text-white underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredVideos.map((video) => {
                                const isCurrentActive = video.slug === activeVideo.slug;
                                const isShort = video.videoType === 'short' || video.duration === '0:30' || video.duration === '00:30';
                                
                                return (
                                    <div
                                        key={video.id}
                                        className={`rounded-[24px] border transition-all duration-300 flex flex-col justify-between h-full overflow-hidden group ${
                                            isCurrentActive
                                                ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-950'
                                                : 'border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 hover:border-black dark:hover:border-white/30'
                                        }`}
                                    >
                                        <div>
                                            {/* Thumbnail Mockup */}
                                            <div className="relative aspect-video w-full overflow-hidden bg-black">
                                                <img
                                                    src={video.heroImage || "https://elesium.online/og-image.png"}
                                                    alt={video.title}
                                                    width="800"
                                                    height="450"
                                                    loading="lazy"
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                                {/* Top Badges */}
                                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                                                        {isShort ? <Zap className="w-2.5 h-2.5 text-white" /> : <Film className="w-2.5 h-2.5" />}
                                                        {isShort ? '30s Breakdown' : 'Deep Masterclass'}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-black/80 text-neutral-200 px-2 py-0.5 rounded border border-white/10">
                                                        <Clock className="w-2.5 h-2.5 text-neutral-300" />
                                                        {video.duration}
                                                    </span>
                                                </div>

                                                {/* Center Play Button Overlay */}
                                                <button
                                                    onClick={() => handleOpenPlayModal(video)}
                                                    className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
                                                    aria-label={`Play ${video.title}`}
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center group-hover/btn:scale-110 transition-all duration-200">
                                                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                                                    </div>
                                                </button>

                                                {/* Bottom Left Industry Tag */}
                                                <div className="absolute bottom-2.5 left-3 pointer-events-none">
                                                    <span className="text-[11px] font-mono text-neutral-300 bg-black/70 px-2 py-0.5 rounded border border-white/10">
                                                        {video.industry}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-5">
                                                <h3 className="text-base font-bold text-black dark:text-white mb-2 leading-snug line-clamp-2 transition-colors">
                                                    {video.title}
                                                </h3>

                                                {video.keyBenefit && (
                                                    <div className="text-xs font-mono text-black dark:text-white mb-2 font-medium">
                                                        {video.keyBenefit}
                                                    </div>
                                                )}

                                                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-4">
                                                    {video.executiveSummary}
                                                </p>

                                                {/* Primary ROI Metric Highlight Pill */}
                                                {video.roiMetrics && video.roiMetrics[0] && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-neutral-200 dark:border-white/10 mb-4">
                                                        <span className="text-xs font-bold font-mono text-black dark:text-white">
                                                            {video.roiMetrics[0].value}
                                                        </span>
                                                        <span className="text-[11px] text-neutral-600 dark:text-neutral-400 font-mono">
                                                            {video.roiMetrics[0].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="p-5 pt-4 border-t border-neutral-200 dark:border-white/10 mt-auto flex items-center justify-between gap-3 text-xs">
                                            <button
                                                onClick={() => handleOpenPlayModal(video)}
                                                className="flex-1 py-2.5 rounded-full bg-white hover:bg-neutral-100 dark:bg-black dark:hover:bg-neutral-900 border border-neutral-200 dark:border-white/10 text-neutral-700 dark:text-neutral-300 font-medium active:scale-[0.97] transition-all duration-300 text-center"
                                            >
                                                Quick Preview
                                            </button>

                                            <Link
                                                to={`/videos/${video.slug}/`}
                                                className="flex-1 py-2.5 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold active:scale-[0.97] transition-all duration-300 text-center flex items-center justify-center gap-1"
                                            >
                                                Deep Dive
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* BOTTOM HIGH-CONVERTING EXECUTIVE CTA */}
                <div className="p-8 lg:p-12 rounded-[32px] border border-neutral-200 dark:border-white/10 bg-black text-white dark:bg-neutral-950 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-16">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-mono tracking-wider uppercase mb-3">
                            Deploy Production AI Systems
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                            Ready to Deploy Sovereign Multi-Agent Infrastructure?
                        </h2>
                        <p className="text-sm sm:text-base text-neutral-300 dark:text-neutral-400 leading-relaxed">
                            We architect and deploy deterministic agentic systems in private VPCs delivering audited 3x-5x cash-flow ROI in 90 days.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 shrink-0 w-full md:w-auto">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-7 rounded-full bg-white hover:bg-neutral-200 active:scale-[0.97] text-black font-semibold text-xs sm:text-sm tracking-wide transition-all duration-300"
                        >
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 h-11 px-7 rounded-full border border-white/20 hover:bg-white/10 active:scale-[0.97] text-white font-semibold text-xs sm:text-sm transition-all duration-300"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
                        <img src="/assets/logo-square.png" alt="Elesium" width="384" height="384" loading="lazy" className="w-96 h-96 object-contain filter invert" />
                    </div>
                </div>

                <WhatsAppModal />

            </div>

            {/* INTERACTIVE PLAY MODAL */}
            <AnimatePresence>
                {isPlayModalOpen && modalVideo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
                        {/* Backdrop Blur */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={handleClosePlayModal}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.97, y: 12 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97, y: 12 }}
                            transition={{ type: "spring", stiffness: 280, damping: 28 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[28px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white flex flex-col z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 truncate">
                                    <span className="px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider bg-neutral-100 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/10 shrink-0">
                                        {modalVideo.duration} • {modalVideo.category}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-bold text-black dark:text-white truncate">
                                        {modalVideo.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={handleClosePlayModal}
                                    className="p-2 rounded-full text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-[0.97] transition-all shrink-0"
                                    aria-label="Close modal"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Video Player */}
                            <div className="aspect-video w-full bg-black relative">
                                <iframe
                                    className="w-full h-full"
                                    src={`https://www.youtube-nocookie.com/embed/${modalVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                                    title={modalVideo.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            {/* Modal Chapters Navigation */}
                            <div className="p-4 sm:p-6 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-white/10">
                                <div className="text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-3 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Time-Stamped Chapters:</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                    {modalVideo.keyMoments.map((km, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setModalActiveMoment(idx)}
                                            className={`p-3 rounded-2xl border text-left transition-all duration-300 ${
                                                modalActiveMoment === idx
                                                    ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                                                    : 'bg-white dark:bg-black border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:border-black dark:hover:border-white/30'
                                            }`}
                                        >
                                            <div className={`text-[10px] font-mono font-bold mb-0.5 ${modalActiveMoment === idx ? 'text-neutral-300 dark:text-neutral-600' : 'text-black dark:text-white'}`}>
                                                {km.time}
                                            </div>
                                            <div className="text-xs font-medium truncate">
                                                {km.title}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Active Chapter Visual & Voiceover Callout */}
                                {modalVideo.keyMoments[modalActiveMoment] && (
                                    <div className="mt-4 p-4 rounded-2xl bg-white dark:bg-black border border-neutral-200 dark:border-white/10 text-xs">
                                        <div className="font-semibold text-black dark:text-white mb-1">
                                            {modalVideo.keyMoments[modalActiveMoment].title}
                                        </div>
                                        <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono text-[11px]">
                                            "{modalVideo.keyMoments[modalActiveMoment].description}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="p-4 sm:p-5 bg-neutral-50 dark:bg-neutral-950 flex flex-wrap items-center justify-between gap-4">
                                <button
                                    onClick={() => handleCopyTranscript(modalVideo.fullTranscript, true)}
                                    className="text-xs font-mono text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-white/10 bg-white dark:bg-black hover:bg-neutral-100 dark:hover:bg-neutral-900 active:scale-[0.97] transition-all duration-300"
                                >
                                    {modalCopied ? <Check className="w-3.5 h-3.5 text-black dark:text-white" /> : <Copy className="w-3.5 h-3.5" />}
                                    <span>{modalCopied ? 'Copied Full Transcript' : 'Copy Verbatim Transcript'}</span>
                                </button>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/videos/${modalVideo.slug}/`}
                                        onClick={handleClosePlayModal}
                                        className="text-xs font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white flex items-center gap-1 px-3 py-2 transition-colors"
                                    >
                                        <span>Open Full Dossier</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    <Link
                                        to={resolveVideoActionRoute(modalVideo.slug, modalVideo.industry)}
                                        onClick={handleClosePlayModal}
                                        className="text-xs font-semibold text-white bg-black dark:text-black dark:bg-white hover:opacity-90 active:scale-[0.97] px-5 py-2 rounded-full transition-all duration-300"
                                    >
                                        Explore Architecture
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
