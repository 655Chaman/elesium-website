import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
    Cpu, 
    Network, 
    ArrowRight, 
    ShieldCheck, 
    Server, 
    Building2, 
    Users, 
    Zap, 
    Lock, 
    Sparkles,
    CheckCircle2
} from 'lucide-react'
import logo from '../../assets/LOGO_NEW.png'

export default function Gateway() {
    const [hoveredSide, setHoveredSide] = useState<'connector' | 'ai' | null>(null)

    return (
        <main className="min-h-screen bg-[#040407] text-white flex flex-col justify-between selection:bg-white selection:text-black overflow-x-hidden relative font-sans">
            <Helmet>
                <title>Elesium | Enterprise Gateway • Connector Business &amp; Sovereign AI</title>
                <meta 
                    name="description" 
                    content="Welcome to Elesium. Select your division: Elesium Connect for high-velocity B2B pipeline & strategic matchmaking, or Elesium AI & Automation for sovereign multi-agent engineering and private VPC infrastructure." 
                />
                <link rel="canonical" href="https://elesium.online/" />
                <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
            </Helmet>

            {/* Subtle Ambient Background Grid & Glows */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                <div 
                    className="absolute inset-0 opacity-[0.03]" 
                    style={{ 
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)`,
                        backgroundSize: '32px 32px' 
                    }} 
                />
                <div 
                    className={`absolute top-0 left-0 w-1/2 h-full bg-gradient-to-br from-indigo-950/20 via-purple-950/10 to-transparent transition-opacity duration-700 blur-3xl ${
                        hoveredSide === 'connector' ? 'opacity-80' : 'opacity-30'
                    }`} 
                />
                <div 
                    className={`absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-emerald-950/20 via-teal-950/10 to-transparent transition-opacity duration-700 blur-3xl ${
                        hoveredSide === 'ai' ? 'opacity-80' : 'opacity-30'
                    }`} 
                />
            </div>

            {/* Top Gateway Master Header */}
            <header className="relative z-20 w-full px-6 py-6 md:px-12 flex items-center justify-between border-b border-white/[0.06] bg-black/40 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <img
                        src={logo}
                        alt="Elesium Crest"
                        width="150"
                        height="36"
                        className="h-8 md:h-9 w-auto object-contain"
                    />
                    <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-white/10 text-[11px] font-mono tracking-widest uppercase text-gray-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Enterprise Gateway</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-[11px] font-mono text-gray-400">
                        <span className="text-gray-500">HQ:</span>
                        <span className="text-gray-300 font-semibold">Bengaluru, KA</span>
                    </div>
                </div>
            </header>

            {/* Central Dual Gateway Choice Arena */}
            <section className="relative z-10 flex-1 flex flex-col justify-center px-4 py-8 sm:px-6 lg:px-12 max-w-7xl mx-auto w-full">
                <div className="text-center max-w-2xl mx-auto mb-8 lg:mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] text-xs font-mono text-gray-300 tracking-wider uppercase mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Choose Operational Track</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
                        Two Sovereign Engines. <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-gray-400 to-gray-500">One Master Mandate.</span>
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                        Select the division tailored to your strategic objective. Enter Elesium Connect for precision B2B matching and pipeline engineering, or enter Elesium AI &amp; Automation for production autonomous multi-agent systems.
                    </p>
                </div>

                {/* Dual Split Cards Container */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
                    
                    {/* LEFT SIDE: ELESIUM CONNECT (Connector Business) */}
                    <div
                        onMouseEnter={() => setHoveredSide('connector')}
                        onMouseLeave={() => setHoveredSide(null)}
                        className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-500 flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
                            hoveredSide === 'connector'
                                ? 'border-indigo-500/60 bg-gradient-to-b from-indigo-950/40 via-purple-950/20 to-[#070712] shadow-2xl shadow-indigo-950/50 scale-[1.01]'
                                : hoveredSide === 'ai'
                                ? 'border-white/[0.06] bg-[#07070d]/60 opacity-80'
                                : 'border-white/10 bg-[#07070e]/80 hover:border-indigo-500/40'
                        }`}
                    >
                        {/* Glow Gradient Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-500" />

                        {/* Card Header & Badge */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono tracking-wider uppercase">
                                    <Network className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Division 01 • B2B Pipeline</span>
                                </div>
                                <span className="text-[11px] font-mono text-gray-500 group-hover:text-indigo-300 transition-colors">
                                    72-Hour Matching SLA
                                </span>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 group-hover:text-indigo-200 transition-colors">
                                    Elesium Connect
                                </h2>
                                <p className="text-sm sm:text-base font-medium text-indigo-400/90 mb-4">
                                    High-Velocity B2B Pipeline &amp; Strategic Matchmaking
                                </p>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    We don&apos;t rely on passive networks or spray-and-pray outbound. We actively engineer verified pipelines connecting ready-to-buy enterprise decision-makers with top-tier solution providers, capital, and technical suppliers.
                                </p>
                            </div>

                            {/* Core Pillars / Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-6 text-xs text-gray-300">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span>Verified Enterprise Buyers</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span>Pre-Vetted Technical Vendors</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span>Double-Opt-In Direct Briefings</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                    <span>Commercial SLA Guarantees</span>
                                </div>
                            </div>

                            {/* Live Visual Telemetry Node */}
                            <div className="p-4 rounded-2xl bg-black/60 border border-indigo-500/20 mb-6">
                                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-3">
                                    <span className="text-indigo-400 font-semibold">Active Matching Pipeline</span>
                                    <span>Status: Live Dispatch</span>
                                </div>
                                <div className="flex items-center justify-between gap-2 text-xs">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 font-mono">
                                        <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                                        <span>Demand</span>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/40 via-purple-400 to-indigo-500/40 relative">
                                            <div className="w-2 h-2 rounded-full bg-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                                        </div>
                                    </div>
                                    <div className="px-2.5 py-1 rounded bg-white/10 text-[10px] font-mono text-white font-bold">
                                        ELESIUM
                                    </div>
                                    <div className="flex-1 flex items-center justify-center">
                                        <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500/40 via-purple-400 to-indigo-500/40" />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-200 font-mono">
                                        <Users className="w-3.5 h-3.5 text-purple-400" />
                                        <span>Supply</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Link Button */}
                        <div className="pt-2">
                            <Link
                                to="/connector/"
                                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-indigo-600/30 group-hover:shadow-indigo-500/50"
                            >
                                <span>Enter Connector Business</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* RIGHT SIDE: ELESIUM AI & AUTOMATION */}
                    <div
                        onMouseEnter={() => setHoveredSide('ai')}
                        onMouseLeave={() => setHoveredSide(null)}
                        className={`group relative rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all duration-500 flex flex-col justify-between overflow-hidden backdrop-blur-xl ${
                            hoveredSide === 'ai'
                                ? 'border-emerald-500/60 bg-gradient-to-b from-emerald-950/40 via-teal-950/20 to-[#040907] shadow-2xl shadow-emerald-950/50 scale-[1.01]'
                                : hoveredSide === 'connector'
                                ? 'border-white/[0.06] bg-[#07070d]/60 opacity-80'
                                : 'border-white/10 bg-[#07070e]/80 hover:border-emerald-500/40'
                        }`}
                    >
                        {/* Glow Gradient Accent */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />

                        {/* Card Header & Badge */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-xs font-mono tracking-wider uppercase">
                                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                                    <span>Division 02 • Enterprise AI</span>
                                </div>
                                <span className="text-[11px] font-mono text-gray-500 group-hover:text-emerald-300 transition-colors">
                                    Audited 3x-5x ROI in 90 Days
                                </span>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-2 group-hover:text-emerald-200 transition-colors">
                                    AI &amp; Automation
                                </h2>
                                <p className="text-sm sm:text-base font-medium text-emerald-400/90 mb-4">
                                    Sovereign Multi-Agent Systems &amp; Private VPC Infrastructure
                                </p>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    Production autonomous agent clusters, private VPC deployments, sub-10ms inference engines, and DPDP-compliant architectures engineered for BFSI, healthcare, defense, and high-scale enterprises.
                                </p>
                            </div>

                            {/* Core Pillars / Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-6 text-xs text-gray-300">
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>DPDP 2023 Statutory Compliance</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <Server className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>Tier-IV Sovereign Datacenters</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>Sub-10ms Kernel Optimization</span>
                                </div>
                                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                                    <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span>Zero Data Egress / Air-Gapped</span>
                                </div>
                            </div>

                            {/* Live Visual Telemetry Node */}
                            <div className="p-4 rounded-2xl bg-black/60 border border-emerald-500/20 mb-6">
                                <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 mb-3">
                                    <span className="text-emerald-400 font-semibold">Inference Engine Telemetry</span>
                                    <span>Nodes: 8x H100 SXM5 Online</span>
                                </div>
                                <div className="flex items-center justify-between gap-3 text-xs font-mono">
                                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                                        <span className="text-[10px] text-gray-500 block">THROUGHPUT</span>
                                        <span>38.4k req/s</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                                        <span className="text-[10px] text-gray-500 block">P99 LATENCY</span>
                                        <span>8.4ms</span>
                                    </div>
                                    <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300">
                                        <span className="text-[10px] text-gray-500 block">DATA LEAKAGE</span>
                                        <span>0.00%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Link Button */}
                        <div className="pt-2">
                            <Link
                                to="/ai/"
                                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-emerald-600/30 group-hover:shadow-emerald-500/50"
                            >
                                <span>Enter AI &amp; Automation</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Bottom Gateway Master Legal Attribution */}
            <footer className="relative z-20 w-full px-6 py-6 md:px-12 border-t border-white/[0.06] bg-black/60 backdrop-blur-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-gray-500">
                    <div>
                        <span className="font-semibold text-gray-400">Elesium Digital Systems Private Limited</span>
                        <span className="hidden sm:inline"> • </span>
                        <span className="block sm:inline">Koramangala, Bengaluru, Karnataka 560034</span>
                        <span className="hidden sm:inline"> • </span>
                        <span className="block sm:inline font-mono">CIN: U72900KA2023PTC178921</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-mono">
                        <Link to="/ai/" className="hover:text-gray-300 transition-colors">AI &amp; Automation</Link>
                        <span>•</span>
                        <Link to="/connector/" className="hover:text-gray-300 transition-colors">Elesium Connect</Link>
                        <span>•</span>
                        <Link to="/solutions/" className="hover:text-gray-300 transition-colors">Solutions (100)</Link>
                        <span>•</span>
                        <Link to="/signals/" className="hover:text-gray-300 transition-colors">Market Signals</Link>
                    </div>
                </div>
            </footer>
        </main>
    )
}
