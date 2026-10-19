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
    ExternalLink,
    ChevronDown, 
    ChevronUp, 
    Sparkles, 
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

export default function VideoMirror() {
    const { slug } = useParams<{ slug?: string }>();
    
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
                "@id": `https://elesium.online/videos/${activeVideo.slug}#video`,
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
                "contentUrl": `https://elesium.online/videos/${activeVideo.slug}`,
                "transcript": activeVideo.fullTranscript,
                "publisher": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://elesium.online/favicon.png"
                    }
                },
                "hasPart": activeVideo.keyMoments.map((km) => ({
                    "@type": "Clip",
                    "name": km.title,
                    "startOffset": km.seconds,
                    "url": `https://elesium.online/videos/${activeVideo.slug}?t=${km.seconds}`
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
                    "url": "https://elesium.online"
                },
                "mainEntityOfPage": `https://elesium.online/videos/${activeVideo.slug}`,
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
                        "item": "https://elesium.online/videos"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": activeVideo.title,
                        "item": `https://elesium.online/videos/${activeVideo.slug}`
                    }
                ]
            }
        ]
    };

    return (
        <div className="min-h-screen bg-[#070A13] text-white pt-24 pb-20 selection:bg-cyan-500/30 selection:text-cyan-200">
            <Helmet>
                <title>{activeVideo.title} | Elesium Video Vault</title>
                <meta name="description" content={activeVideo.executiveSummary} />
                <link rel="canonical" href={`https://elesium.online/videos/${activeVideo.slug}`} />
                <meta property="og:title" content={`${activeVideo.title} | Elesium`} />
                <meta property="og:description" content={activeVideo.executiveSummary} />
                <meta property="og:url" content={`https://elesium.online/videos/${activeVideo.slug}`} />
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
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs font-mono">
                    <div className="flex items-center gap-2 text-gray-400">
                        <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/videos" className="hover:text-cyan-400 transition-colors">Video Vault</Link>
                        <span>/</span>
                        <span className="text-cyan-300 truncate max-w-xs sm:max-w-md">{activeVideo.slug}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            {videoMasterclasses.length} Production Breakdowns
                        </span>
                    </div>
                </div>

                {/* ACTIVE VIDEO THEATER SECTION */}
                <section className="mb-16">
                    <div className="mb-6">
                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono mb-3">
                            <span className="flex items-center gap-1 text-cyan-400 font-semibold px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                                <Building2 className="w-3.5 h-3.5" />
                                {activeVideo.industry}
                            </span>
                            <span className="flex items-center gap-1 text-purple-400 font-semibold px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/20">
                                <Layers className="w-3.5 h-3.5" />
                                {activeVideo.category}
                            </span>
                            <span className="flex items-center gap-1 text-gray-300">
                                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                {activeVideo.duration} Runtime
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                Updated October 2026
                            </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-snug max-w-5xl">
                            {activeVideo.title}
                        </h1>

                        <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-4xl">
                            {activeVideo.executiveSummary}
                        </p>
                    </div>

                    {/* Cinema Player Container */}
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl shadow-cyan-950/30 mb-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 blur-xl opacity-60 -z-10" />

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
                        <div className="px-6 py-3 bg-[#0B0F1C]/90 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-gray-300">
                                    {activeVideo.videoType === 'short' 
                                        ? 'Chad Michael 30s Vertical Production Breakdown • Spoken Keyword in 0-3s' 
                                        : 'Deterministic Sovereign VPC Engineering Masterclass'}
                                </span>
                            </div>

                            <button
                                onClick={() => handleOpenPlayModal(activeVideo)}
                                className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold"
                            >
                                <Play className="w-3.5 h-3.5" />
                                Launch Interactive Chapter Player
                            </button>
                        </div>
                    </div>

                    {/* High-Impact ROI Metric Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                        {activeVideo.roiMetrics.map((m, idx) => (
                            <div
                                key={idx}
                                className="p-5 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-md relative overflow-hidden group hover:border-white/20 transition-all duration-300"
                            >
                                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1" style={{ color: m.color }}>
                                    {m.value}
                                </div>
                                <div className="text-sm font-semibold text-white mb-0.5">
                                    {m.label}
                                </div>
                                <div className="text-xs text-gray-400 font-mono">
                                    {m.detail}
                                </div>
                                <div 
                                    className="absolute bottom-0 left-0 h-0.5 w-full opacity-40 group-hover:opacity-100 transition-opacity" 
                                    style={{ backgroundColor: m.color }} 
                                />
                            </div>
                        ))}
                    </div>

                    {/* Interactive Workspace (Tabs: Architecture, Moments, Transcript) */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8 mb-12">
                        {/* Tabs Navigation Header */}
                        <div className="flex border-b border-white/10 pb-4 mb-6 gap-6 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab('architecture')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'architecture'
                                        ? 'text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Cpu className="w-4 h-4" />
                                System Architecture Blueprint
                                {activeTab === 'architecture' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('moments')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'moments'
                                        ? 'text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <Clock className="w-4 h-4" />
                                Key Moments & Timecodes ({activeVideo.keyMoments.length})
                                {activeTab === 'moments' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
                                )}
                            </button>

                            <button
                                onClick={() => setActiveTab('transcript')}
                                className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative shrink-0 ${
                                    activeTab === 'transcript'
                                        ? 'text-cyan-400'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <FileText className="w-4 h-4" />
                                Full Technical Transcript
                                {activeTab === 'transcript' && (
                                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
                                )}
                            </button>
                        </div>

                        {/* Tab 1: Architecture Blueprint */}
                        {activeTab === 'architecture' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {activeVideo.architectureStages.map((stage, idx) => (
                                    <div
                                        key={idx}
                                        className="p-6 rounded-xl border border-white/10 bg-[#0B0F1C] flex flex-col justify-between hover:border-cyan-500/30 transition-all duration-300"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                                                    {stage.stage}
                                                </span>
                                                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-4">
                                                {stage.name}
                                            </h3>
                                            <ul className="space-y-2.5 mb-6">
                                                {stage.bullets.map((b, bIdx) => (
                                                    <li key={bIdx} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-cyan-400 font-bold mt-0.5">•</span>
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="pt-4 border-t border-white/5">
                                            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                                                Engineered Stack
                                            </div>
                                            <div className="text-xs font-mono text-cyan-300 font-medium">
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
                                        className="p-5 rounded-xl border border-white/5 bg-[#0B0F1C] hover:border-cyan-500/30 transition-all flex flex-col sm:flex-row items-start gap-4"
                                    >
                                        <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                                            {km.time}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-base font-semibold text-white mb-1">
                                                {km.title}
                                            </h4>
                                            <p className="text-sm text-gray-300 leading-relaxed mb-3">
                                                {km.description}
                                            </p>
                                            
                                            {/* Extra details from timecodes if available */}
                                            {activeVideo.timecodes && activeVideo.timecodes[idx] && (
                                                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs font-mono">
                                                    <span className="text-gray-400">On-Screen Caption:</span>
                                                    <span className="text-cyan-300 bg-white/5 px-2 py-0.5 rounded border border-white/10 font-bold">
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
                                    <span className="text-xs text-gray-400 font-mono">
                                        Word-for-word transcript indexed by Google Video Search algorithm
                                    </span>
                                    
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleCopyTranscript(activeVideo.fullTranscript)}
                                            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 transition-all"
                                        >
                                            {hasCopiedTranscript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                            {hasCopiedTranscript ? 'Copied Transcript' : 'Copy Full Transcript'}
                                        </button>

                                        <button
                                            onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                                            className="text-xs font-mono text-gray-400 hover:text-white flex items-center gap-1"
                                        >
                                            {transcriptExpanded ? 'Collapse' : 'Expand All'}
                                            {transcriptExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                        </button>
                                    </div>
                                </div>

                                {transcriptExpanded && (
                                    <div className="p-6 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-gray-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                                        {activeVideo.fullTranscript}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </section>

                {/* INTERACTIVE VIDEO GALLERY EXPLORER */}
                <section className="mb-16 pt-8 border-t border-white/10">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold mb-2">
                                <Film className="w-4 h-4" />
                                Comprehensive Video Asset Vault
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                Explore All 15 Architecture Breakdowns & Masterclasses
                            </h2>
                            <p className="text-sm text-gray-400 mt-1 max-w-2xl">
                                Filter across 30-second vertical BOFU teardowns and deep masterclasses. Every asset features Google Search Central compliant VideoObject JSON-LD.
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full md:w-80">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search keyword, industry, topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
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
                                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all ${
                                    activeFilter === 'all'
                                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                                        : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
                                }`}
                            >
                                All Video Assets ({videoMasterclasses.length})
                            </button>

                            <button
                                onClick={() => setActiveFilter('shorts')}
                                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                                    activeFilter === 'shorts'
                                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                                        : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
                                }`}
                            >
                                <Zap className="w-3.5 h-3.5" />
                                30s Short-Form Vault ({shortFormVideos.length})
                            </button>

                            <button
                                onClick={() => setActiveFilter('masterclasses')}
                                className={`text-xs px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                                    activeFilter === 'masterclasses'
                                        ? 'bg-cyan-500 text-black font-bold shadow-md shadow-cyan-500/20'
                                        : 'bg-white/[0.03] text-gray-400 hover:text-white border border-white/5'
                                }`}
                            >
                                <Film className="w-3.5 h-3.5" />
                                Deep Masterclasses ({deepMasterclasses.length})
                            </button>
                        </div>

                        {/* Industry Chips */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                            <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider mr-1">
                                Sector:
                            </span>
                            {allIndustries.map((ind) => (
                                <button
                                    key={ind}
                                    onClick={() => setSelectedIndustry(ind)}
                                    className={`text-[11px] font-mono px-2.5 py-1 rounded-md transition-all ${
                                        selectedIndustry === ind
                                            ? 'bg-white/10 text-cyan-300 border border-cyan-500/40'
                                            : 'bg-transparent text-gray-400 hover:text-gray-200 border border-transparent'
                                    }`}
                                >
                                    {ind === 'all' ? 'All Sectors' : ind}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Video Gallery Grid */}
                    {filteredVideos.length === 0 ? (
                        <div className="p-12 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
                            <p className="text-gray-400 text-sm">No videos match your current search query or filter.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveFilter('all'); setSelectedIndustry('all'); }}
                                className="mt-4 text-xs font-mono text-cyan-400 hover:underline"
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
                                        className={`rounded-xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group bg-[#0B0F1C]/80 ${
                                            isCurrentActive
                                                ? 'border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                                                : 'border-white/10 hover:border-white/20 hover:bg-[#0B0F1C]'
                                        }`}
                                    >
                                        <div>
                                            {/* Thumbnail Mockup */}
                                            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                                                <img
                                                    src={video.heroImage || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80"}
                                                    alt={video.title}
                                                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1C] via-black/30 to-black/60" />

                                                {/* Top Badges */}
                                                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                                    <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded backdrop-blur-md ${
                                                        isShort 
                                                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' 
                                                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                                    }`}>
                                                        {isShort ? <Zap className="w-2.5 h-2.5" /> : <Film className="w-2.5 h-2.5" />}
                                                        {isShort ? '30s Breakdown' : 'Deep Masterclass'}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1 text-[10px] font-mono bg-black/70 text-gray-200 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                                                        <Clock className="w-2.5 h-2.5 text-cyan-400" />
                                                        {video.duration}
                                                    </span>
                                                </div>

                                                {/* Center Play Button Overlay */}
                                                <button
                                                    onClick={() => handleOpenPlayModal(video)}
                                                    className="absolute inset-0 flex items-center justify-center group/btn cursor-pointer"
                                                    aria-label={`Play ${video.title}`}
                                                >
                                                    <div className="w-12 h-12 rounded-full bg-cyan-500/90 group-hover/btn:bg-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/40 group-hover/btn:scale-110 transition-all duration-200">
                                                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                                                    </div>
                                                </button>

                                                {/* Bottom Left Industry Tag */}
                                                <div className="absolute bottom-2.5 left-3 pointer-events-none">
                                                    <span className="text-[11px] font-mono text-gray-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
                                                        {video.industry}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Card Content */}
                                            <div className="p-5">
                                                <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                                                    {video.title}
                                                </h3>

                                                {video.keyBenefit && (
                                                    <div className="text-xs font-mono text-cyan-400 mb-2 font-medium">
                                                        ✦ {video.keyBenefit}
                                                    </div>
                                                )}

                                                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                                                    {video.executiveSummary}
                                                </p>

                                                {/* Primary ROI Metric Highlight Pill */}
                                                {video.roiMetrics && video.roiMetrics[0] && (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 mb-4">
                                                        <span className="text-xs font-bold" style={{ color: video.roiMetrics[0].color }}>
                                                            {video.roiMetrics[0].value}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 font-mono">
                                                            {video.roiMetrics[0].label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Actions */}
                                        <div className="p-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between gap-3 text-xs">
                                            <button
                                                onClick={() => handleOpenPlayModal(video)}
                                                className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white font-medium transition-all text-center"
                                            >
                                                Quick Preview
                                            </button>

                                            <Link
                                                to={`/videos/${video.slug}`}
                                                className="flex-1 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 font-semibold transition-all text-center flex items-center justify-center gap-1"
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
                <div className="p-8 lg:p-12 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-[#0B0F1C] to-purple-950/20 relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-2">
                            Deploy Production AI Systems
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-3">
                            Ready to Deploy Sovereign Multi-Agent Infrastructure?
                        </h2>
                        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                            We don't sell generic advice. We architect and deploy deterministic agentic systems in private VPCs delivering audited 3x–5x cash-flow ROI in 90 days.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
                        <Link
                            to={activeVideo.slug === 'enterprise-ai-roi-calculator' ? '/tools/enterprise-ai-roi-calculator' : `/solutions/${activeVideo.slug}`}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
                        >
                            {activeVideo.slug === 'enterprise-ai-roi-calculator' ? 'Launch ROI Calculator' : 'View Production Solution'}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        
                        <a
                            href="https://www.goodfirms.co/company/elesium-online"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-white/10 hover:border-amber-400/40 bg-white/[0.03] text-gray-200 hover:text-white font-medium text-sm transition-all"
                        >
                            <span>GoodFirms Benchmarks</span>
                            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                        </a>
                    </div>
                </div>

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
                            onClick={handleClosePlayModal}
                            className="absolute inset-0 bg-black/85 backdrop-blur-md"
                        />

                        {/* Modal Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.25 }}
                            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-[#0B0F1C] shadow-2xl shadow-cyan-950/60 flex flex-col z-10"
                        >
                            {/* Modal Header */}
                            <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 truncate">
                                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
                                        {modalVideo.duration} • {modalVideo.category}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-bold text-white truncate">
                                        {modalVideo.title}
                                    </h3>
                                </div>

                                <button
                                    onClick={handleClosePlayModal}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
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
                            <div className="p-4 sm:p-6 bg-black/40 border-b border-white/10">
                                <div className="text-xs font-mono text-gray-400 mb-3 flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                                    <span>Time-Stamped Chapters (Chad Michael Second-by-Second Structure):</span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                    {modalVideo.keyMoments.map((km, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setModalActiveMoment(idx)}
                                            className={`p-2.5 rounded-lg border text-left transition-all ${
                                                modalActiveMoment === idx
                                                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                                                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                        >
                                            <div className="text-[10px] font-mono font-bold text-cyan-400 mb-0.5">
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
                                    <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs">
                                        <div className="font-semibold text-white mb-1">
                                            {modalVideo.keyMoments[modalActiveMoment].title}
                                        </div>
                                        <p className="text-gray-300 leading-relaxed font-mono text-[11px]">
                                            "{modalVideo.keyMoments[modalActiveMoment].description}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="p-4 sm:p-5 bg-[#0B0F1C] flex flex-wrap items-center justify-between gap-4">
                                <button
                                    onClick={() => handleCopyTranscript(modalVideo.fullTranscript, true)}
                                    className="text-xs font-mono text-gray-300 hover:text-white flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
                                >
                                    {modalCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    {modalCopied ? 'Copied Full Transcript' : 'Copy Verbatim Transcript'}
                                </button>

                                <div className="flex items-center gap-3">
                                    <Link
                                        to={`/videos/${modalVideo.slug}`}
                                        onClick={handleClosePlayModal}
                                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 px-3 py-2"
                                    >
                                        Open Full Dossier
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>

                                    <Link
                                        to={modalVideo.slug === 'enterprise-ai-roi-calculator' ? '/tools/enterprise-ai-roi-calculator' : `/solutions/${modalVideo.slug}`}
                                        onClick={handleClosePlayModal}
                                        className="text-xs font-bold text-black bg-cyan-500 hover:bg-cyan-400 px-4 py-2 rounded-lg transition-all shadow-md shadow-cyan-500/20"
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
