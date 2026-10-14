import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    Calendar
} from 'lucide-react';
import { videoMasterclasses, VideoMasterclass } from '../../data/videoMasterclasses';

export default function VideoMirror() {
    const { slug } = useParams<{ slug?: string }>();
    
    // Find active masterclass based on slug or default to first
    const activeVideo: VideoMasterclass = 
        videoMasterclasses.find((v) => v.slug === slug) || videoMasterclasses[0];
    
    const [activeTab, setActiveTab] = useState<'architecture' | 'transcript' | 'moments'>('architecture');
    const [transcriptExpanded, setTranscriptExpanded] = useState<boolean>(true);

    // Scroll to top on video change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [activeVideo.slug]);

    // Build comprehensive VideoObject JSON-LD Schema including complete transcript
    const videoSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "VideoObject",
                "@id": `https://elesium.online/videos/${activeVideo.slug}#video`,
                "name": activeVideo.title,
                "description": activeVideo.executiveSummary,
                "thumbnailUrl": [
                    `https://elesium.online/og-image.png`,
                    `https://img.youtube.com/vi/${activeVideo.youtubeId}/maxresdefault.jpg`
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
                        "name": "Architecture Masterclasses",
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
                <title>{activeVideo.title} | Elesium Architecture Masterclasses</title>
                <meta name="description" content={activeVideo.executiveSummary} />
                <link rel="canonical" href={`https://elesium.online/videos/${activeVideo.slug}`} />
                <meta property="og:title" content={`${activeVideo.title} | Elesium`} />
                <meta property="og:description" content={activeVideo.executiveSummary} />
                <meta property="og:url" content={`https://elesium.online/videos/${activeVideo.slug}`} />
                <meta property="og:type" content="video.other" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${activeVideo.title} | Elesium`} />
                <meta name="twitter:description" content={activeVideo.executiveSummary} />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(videoSchema)}</script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Masterclass Navigation Selector */}
                <div className="mb-8 border-b border-white/10 pb-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono tracking-wider uppercase">
                            <Sparkles className="w-3.5 h-3.5" />
                            Engineering Masterclasses
                        </span>
                        <span className="text-xs text-gray-500 font-mono hidden sm:inline">
                            Sovereign Architectures • Production Code
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        {videoMasterclasses.map((v) => (
                            <Link
                                key={v.id}
                                to={`/videos/${v.slug}`}
                                className={`text-xs px-3.5 py-1.5 rounded-lg border transition-all duration-200 font-medium ${
                                    v.slug === activeVideo.slug
                                        ? 'bg-white/10 border-cyan-500/50 text-cyan-300 shadow-sm shadow-cyan-500/20'
                                        : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white hover:bg-white/[0.06]'
                                }`}
                            >
                                {v.id === 'vm-1' ? '01. Sovereign VPC Blueprint' : v.id === 'vm-2' ? '02. LangGraph vs n8n' : '03. BFSI Underwriting'}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Hero Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 text-xs text-gray-400 font-mono mb-3">
                        <span className="flex items-center gap-1 text-cyan-400 font-semibold">
                            <Building2 className="w-3.5 h-3.5" />
                            {activeVideo.industry}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <Clock className="w-3.5 h-3.5" />
                            {activeVideo.duration} Runtime
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-gray-400">
                            <Calendar className="w-3.5 h-3.5" />
                            Updated March 2026
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-4 leading-snug max-w-5xl">
                        {activeVideo.title}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-300 leading-relaxed max-w-4xl">
                        {activeVideo.executiveSummary}
                    </p>
                </div>

                {/* Main Video Cinema Container */}
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 shadow-2xl shadow-cyan-950/30 mb-12">
                    {/* Ambient Glow */}
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
                </div>

                {/* High-Impact ROI Metric Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
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

                {/* Interactive Content Workspace (Tabs) */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8 mb-12">
                    {/* Tabs Header */}
                    <div className="flex border-b border-white/10 pb-4 mb-6 gap-6">
                        <button
                            onClick={() => setActiveTab('architecture')}
                            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative ${
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
                            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative ${
                                activeTab === 'moments'
                                    ? 'text-cyan-400'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            Key Moments ({activeVideo.keyMoments.length})
                            {activeTab === 'moments' && (
                                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400" />
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('transcript')}
                            className={`flex items-center gap-2 pb-2 text-sm font-semibold transition-all relative ${
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
                                    className="p-6 rounded-xl border border-white/10 bg-[#0B0F1C] flex flex-col justify-between"
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
                                        <div className="text-xs font-mono text-cyan-300">
                                            {stage.techStack}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab 2: Key Moments */}
                    {activeTab === 'moments' && (
                        <div className="space-y-4">
                            {activeVideo.keyMoments.map((km, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl border border-white/5 bg-[#0B0F1C] hover:border-cyan-500/30 transition-all flex items-start gap-4"
                                >
                                    <div className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-xs font-bold shrink-0">
                                        {km.time}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-semibold text-white mb-1">
                                            {km.title}
                                        </h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {km.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Tab 3: Full Indexed Transcript */}
                    {activeTab === 'transcript' && (
                        <div>
                            <div className="mb-4 flex items-center justify-between">
                                <span className="text-xs text-gray-400 font-mono">
                                    Verbatim timestamped transcript for machine indexing & knowledge retrieval
                                </span>
                                <button
                                    onClick={() => setTranscriptExpanded(!transcriptExpanded)}
                                    className="text-xs font-mono text-cyan-400 flex items-center gap-1 hover:underline"
                                >
                                    {transcriptExpanded ? 'Collapse' : 'Expand All'}
                                    {transcriptExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                </button>
                            </div>

                            {transcriptExpanded && (
                                <div className="p-6 rounded-xl bg-black/40 border border-white/5 font-mono text-xs text-gray-300 leading-relaxed max-h-[500px] overflow-y-auto whitespace-pre-wrap select-text">
                                    {activeVideo.fullTranscript}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Bottom High-Converting Executive CTA */}
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
                            to="/ai-automation-agency-india"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm tracking-wide transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:scale-[1.02]"
                        >
                            Explore India Systems Pricing
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
        </div>
    );
}
