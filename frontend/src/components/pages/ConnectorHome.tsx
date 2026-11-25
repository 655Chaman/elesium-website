import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { 
    Network, 
    Building2, 
    Users, 
    ArrowRight, 
    CheckCircle2, 
    Clock, 
    Sparkles, 
    Mail, 
    MessageSquare, 
    Briefcase, 
    Handshake, 
    ArrowUpRight
} from 'lucide-react'
import logo from '../../assets/LOGO_NEW.png'
import { AnimatedBeam } from '../ui/AnimatedBeam'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function ConnectorHome() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [activeTab, setActiveTab] = useState<'buyer' | 'supplier'>('buyer')

    // Animated Beam Refs
    const containerRef = useRef<HTMLDivElement>(null)
    const demandRef = useRef<HTMLDivElement>(null)
    const elesiumRef = useRef<HTMLDivElement>(null)
    const supplyRef = useRef<HTMLDivElement>(null)

    const pathColor = "rgba(129, 140, 248, 0.2)"
    const gradientStartColor = "#6366f1"
    const gradientStopColor = "#a855f7"

    const openBuyerWhatsApp = () => {
        openWhatsApp()
    }

    const openSupplierWhatsApp = () => {
        openWhatsApp()
    }

    return (
        <div className="min-h-screen bg-[#05050a] text-white selection:bg-indigo-500 selection:text-white font-sans overflow-x-hidden">
            <WhatsAppModal />
            <Helmet>
                <title>Elesium Connect | High-Velocity B2B Pipeline &amp; Strategic Matchmaking</title>
                <meta 
                    name="description" 
                    content="Elesium Connect actively engineers high-trust B2B pipelines connecting verified enterprise buyers with pre-vetted technical providers, capital, and suppliers. 72-hour matching SLA." 
                />
                <link rel="canonical" href="https://elesium.online/connector/" />
                <meta name="robots" content="index, follow" />
            </Helmet>

            {/* Dedicated Connector Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#05050a]/90 backdrop-blur-md border-b border-indigo-500/10 h-16">
                <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <Link to="/" className="flex items-center gap-2 group">
                            <img
                                src={logo}
                                alt="Elesium Connect"
                                width="140"
                                height="32"
                                className="h-7 md:h-8 w-auto object-contain"
                            />
                        </Link>
                        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-mono">
                            <Network className="w-3 h-3" />
                            <span>Connect Division</span>
                        </div>
                    </div>

                    {/* Quick Nav Links */}
                    <div className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-300">
                        <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
                        <a href="#pipeline" className="hover:text-white transition-colors">Pipeline Engine</a>
                        <a href="#intake" className="hover:text-white transition-colors">Dual-Track Intake</a>
                        <a href="#sla" className="hover:text-white transition-colors">72h SLA</a>
                    </div>

                    {/* Cross-Portal Switcher & Actions */}
                    <div className="flex items-center gap-3">
                        <Link
                            to="/ai/"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold transition-all"
                            title="Switch to AI & Automation division"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span>AI &amp; Automation</span>
                            <ArrowUpRight className="w-3 h-3" />
                        </Link>

                        <button
                            onClick={openWhatsApp}
                            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
                        >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>Contact Desk</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                {/* Ambient Radial Highlights */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono tracking-wider uppercase mb-6">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Curated B2B Deal-Flow • Zero Passive Noise</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        We don&apos;t rely on passive networks.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
                            We actively engineer your pipeline.
                        </span>
                    </h1>

                    <p className="text-base sm:text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
                        Stop suffering through spam inboxes, spray-and-pray LinkedIn messages, and unvetted intermediaries. Elesium Connect bridges enterprise decision-makers directly with pre-vetted technical providers, high-velocity suppliers, and strategic capital under a strict 72-hour double-opt-in SLA.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a
                            href="#intake"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
                        >
                            <span>Submit Enterprise Requirement</span>
                            <ArrowRight className="w-4 h-4" />
                        </a>
                        <button
                            onClick={openSupplierWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-gray-200 font-semibold text-sm transition-all"
                        >
                            <Handshake className="w-4 h-4 text-indigo-400" />
                            <span>Join Vetted Supplier Network</span>
                        </button>
                    </div>

                    {/* Proof Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/[0.08]">
                        <div className="text-center p-3">
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">72 Hours</div>
                            <div className="text-xs text-gray-400 mt-1">Guaranteed Handshake SLA</div>
                        </div>
                        <div className="text-center p-3">
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">500+</div>
                            <div className="text-xs text-gray-400 mt-1">Pre-Vetted Solution Partners</div>
                        </div>
                        <div className="text-center p-3">
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">100%</div>
                            <div className="text-xs text-gray-400 mt-1">Double-Opt-In C-Suite Access</div>
                        </div>
                        <div className="text-center p-3">
                            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-indigo-400">Zero</div>
                            <div className="text-xs text-gray-400 mt-1">Cold Infiltration or Spam</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Animated Beam Pipeline Visualizer */}
            <section id="pipeline" className="py-20 px-6 bg-[#030307] border-y border-white/[0.06] relative">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono uppercase mb-3">
                            <Network className="w-3.5 h-3.5 text-indigo-400" />
                            <span>The Matching Engine Architecture</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                            Active Pipeline Engineering
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400">
                            Our proprietary verification engine validates requirements on both sides of the table before executing high-conviction introductions.
                        </p>
                    </div>

                    {/* Beam Animation Canvas */}
                    <div className="relative rounded-3xl p-8 md:p-14 bg-gradient-to-b from-[#0a0a14] to-[#040409] border border-indigo-500/20 shadow-2xl overflow-hidden" ref={containerRef}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center relative z-10">
                            
                            {/* Demand Node */}
                            <div className="flex flex-col items-center">
                                <div 
                                    ref={demandRef} 
                                    className="h-24 w-24 rounded-3xl bg-indigo-950/80 border-2 border-indigo-500/50 flex flex-col items-center justify-center shadow-xl shadow-indigo-950/50 hover:scale-105 transition-transform"
                                >
                                    <Building2 className="w-8 h-8 text-indigo-400 mb-1" />
                                    <span className="text-[11px] font-mono font-bold text-indigo-200 uppercase tracking-wider">Demand</span>
                                </div>
                                <h3 className="text-base font-bold text-white mt-4">Enterprise Buyers</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                                    CTOs, VPs, &amp; procurement heads with active technical mandates and verified budget.
                                </p>
                            </div>

                            {/* Elesium Hub Node */}
                            <div className="flex flex-col items-center">
                                <div 
                                    ref={elesiumRef} 
                                    className="h-32 w-32 rounded-3xl bg-black border-4 border-indigo-500 flex flex-col items-center justify-center shadow-2xl shadow-indigo-600/40 relative hover:scale-105 transition-transform"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-indigo-500/10 animate-pulse" />
                                    <Network className="w-10 h-10 text-indigo-400 mb-1" />
                                    <span className="text-sm font-bold font-mono text-white tracking-widest uppercase">ELESIUM</span>
                                    <span className="text-[9px] font-mono text-indigo-300">CURATION VAULT</span>
                                </div>
                                <h3 className="text-base font-bold text-white mt-4">The Curation Vault</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                                    Technical scoping, NDA coverage, commercial alignment, &amp; double-opt-in briefing.
                                </p>
                            </div>

                            {/* Supply Node */}
                            <div className="flex flex-col items-center">
                                <div 
                                    ref={supplyRef} 
                                    className="h-24 w-24 rounded-3xl bg-purple-950/80 border-2 border-purple-500/50 flex flex-col items-center justify-center shadow-xl shadow-purple-950/50 hover:scale-105 transition-transform"
                                >
                                    <Users className="w-8 h-8 text-purple-400 mb-1" />
                                    <span className="text-[11px] font-mono font-bold text-purple-200 uppercase tracking-wider">Supply</span>
                                </div>
                                <h3 className="text-base font-bold text-white mt-4">Vetted Suppliers</h3>
                                <p className="text-xs text-gray-400 mt-1 max-w-[220px]">
                                    Specialized AI labs, tier-1 software shops, security auditors, &amp; boutique agencies.
                                </p>
                            </div>
                        </div>

                        {/* Animated Beams connecting nodes on desktop */}
                        <div className="hidden md:block">
                            <AnimatedBeam
                                containerRef={containerRef}
                                fromRef={demandRef}
                                toRef={elesiumRef}
                                duration={3.5}
                                delay={0}
                                pathWidth={3}
                                pathColor={pathColor}
                                gradientStartColor={gradientStartColor}
                                gradientStopColor={gradientStopColor}
                            />
                            <AnimatedBeam
                                containerRef={containerRef}
                                fromRef={supplyRef}
                                toRef={elesiumRef}
                                duration={3.5}
                                delay={1.2}
                                reverse={true}
                                pathWidth={3}
                                pathColor={pathColor}
                                gradientStartColor={gradientStartColor}
                                gradientStopColor={gradientStopColor}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works - The 3-Stage 72h SLA */}
            <section id="sla" className="py-20 px-6 max-w-6xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono uppercase mb-3">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Execution Protocol</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                        The 72-Hour Precision Protocol
                    </h2>
                    <p className="text-sm sm:text-base text-gray-400">
                        Every match moves through three governed stages. No prolonged back-and-forths. Direct results.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-3xl bg-[#090913] border border-white/[0.08] relative hover:border-indigo-500/40 transition-colors">
                        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-4">
                            Stage 01 • 0-24 Hours
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Requirement Distillation</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            We dissect the technical mandate, budget allocation, security/compliance boundaries (such as DPDP or SOC-2), and target delivery deadline.
                        </p>
                        <ul className="space-y-2 text-xs text-gray-300">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Budget &amp; Timeline Verification</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Security Boundary Definition</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#090913] border border-white/[0.08] relative hover:border-indigo-500/40 transition-colors">
                        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-4">
                            Stage 02 • 24-48 Hours
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Sovereign Partner Audit</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Our matching algorithm queries our database of 500+ pre-vetted specialists to isolate the top 2-3 partners with proven delivery track records in that exact domain.
                        </p>
                        <ul className="space-y-2 text-xs text-gray-300">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Capability Matrix Scoring</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Double Blind Conflict Checking</span>
                            </li>
                        </ul>
                    </div>

                    <div className="p-8 rounded-3xl bg-[#090913] border border-white/[0.08] relative hover:border-indigo-500/40 transition-colors">
                        <div className="text-xs font-mono text-indigo-400 uppercase tracking-widest mb-4">
                            Stage 03 • 48-72 Hours
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Double-Opt-In Handshake</h3>
                        <p className="text-sm text-gray-400 leading-relaxed mb-6">
                            Both parties review pre-cleared briefing materials and agree to connect. A direct high-level meeting is scheduled with structured agendas and immediate NDA execution.
                        </p>
                        <ul className="space-y-2 text-xs text-gray-300">
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Direct C-Suite Introduction</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                                <span>Commercial Mediation Available</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Dual-Track Interactive Intake Desk */}
            <section id="intake" className="py-20 px-6 bg-[#030307] border-t border-white/[0.06]">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-mono uppercase mb-3">
                            <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                            <span>Direct Intake Desk</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                            Submit Your Intake
                        </h2>
                        <p className="text-sm sm:text-base text-gray-400">
                            Select your path below to initiate verified matching with the Elesium Connect team.
                        </p>
                    </div>

                    {/* Selector Tabs */}
                    <div className="flex rounded-2xl bg-white/[0.04] p-1.5 border border-white/[0.08] max-w-md mx-auto mb-8">
                        <button
                            onClick={() => setActiveTab('buyer')}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'buyer'
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Enterprise Buyers (Demand)
                        </button>
                        <button
                            onClick={() => setActiveTab('supplier')}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                                activeTab === 'supplier'
                                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/40'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            Solution Providers (Supply)
                        </button>
                    </div>

                    {/* Tab 1: Enterprise Buyer Intake Card */}
                    {activeTab === 'buyer' && (
                        <div className="p-8 sm:p-10 rounded-3xl bg-[#080812] border border-indigo-500/30 shadow-2xl relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Enterprise Demand Intake</h3>
                                    <p className="text-xs text-gray-400">For enterprises seeking specialized technology partners, contractors, or software solutions</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 text-sm text-gray-300">
                                <p className="leading-relaxed">
                                    Whether you need to deploy an air-gapped LLM cluster, migrate mission-critical workloads, audit DPDP compliance, or source specialized engineers, our team delivers pre-vetted options within 72 hours.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className="font-semibold text-indigo-300 block mb-1">Common Mandates:</span>
                                        <span className="text-gray-400">Multi-Agent AI Engineering • Private VPC Migrations • High-Scale Data Pipelines</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className="font-semibold text-indigo-300 block mb-1">Our Guarantee:</span>
                                        <span className="text-gray-400">Zero junior pass-throughs • 100% verified case studies • Strict NDA</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={openBuyerWhatsApp}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-600/30"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Initiate via WhatsApp Desk</span>
                                </button>
                                <a
                                    href="mailto:connect@elesium.online?subject=Enterprise%20Demand%20Intake%20-%20Elesium%20Connect"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-sm transition-all"
                                >
                                    <Mail className="w-4 h-4 text-indigo-400" />
                                    <span>Email Enterprise Mandate</span>
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Tab 2: Solution Provider Intake Card */}
                    {activeTab === 'supplier' && (
                        <div className="p-8 sm:p-10 rounded-3xl bg-[#0b0814] border border-purple-500/30 shadow-2xl relative">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Solution Provider Application</h3>
                                    <p className="text-xs text-gray-400">For boutique agencies, AI researchers, cloud consultancies, &amp; specialized vendors</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 text-sm text-gray-300">
                                <p className="leading-relaxed">
                                    Join our pre-audited network to receive qualified, high-conviction enterprise RFP introductions. We do not charge listing fees or spam your team with frivolous inquiries.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className="font-semibold text-purple-300 block mb-1">Target Categories:</span>
                                        <span className="text-gray-400">AI/ML Engineering • Cybersecurity &amp; Auditing • Full-Stack Cloud Architecture</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                                        <span className="font-semibold text-purple-300 block mb-1">Requirements:</span>
                                        <span className="text-gray-400">Demonstrated enterprise case studies • Direct partner-level delivery</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={openSupplierWhatsApp}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-purple-600/30"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    <span>Apply via WhatsApp Desk</span>
                                </button>
                                <a
                                    href="mailto:connect@elesium.online?subject=Supplier%20Network%20Application%20-%20Elesium%20Connect"
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white font-semibold text-sm transition-all"
                                >
                                    <Mail className="w-4 h-4 text-purple-400" />
                                    <span>Email Partner Portfolio</span>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Dedicated Connector Footer */}
            <footer className="py-12 px-6 border-t border-white/[0.08] bg-black">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-gray-500 text-center md:text-left">
                    <div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                            <img src={logo} alt="Elesium" className="h-6 w-auto opacity-70" />
                            <span className="font-bold text-gray-400">Elesium Connect</span>
                        </div>
                        <p>A Division of Elesium Digital Systems Private Limited</p>
                        <p className="mt-1">Koramangala, Bengaluru, Karnataka 560034 • CIN: U72900KA2023PTC178921</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono">
                        <Link to="/" className="text-gray-400 hover:text-white transition-colors">Enterprise Gateway</Link>
                        <Link to="/ai/" className="text-emerald-400 hover:text-emerald-300 transition-colors">AI &amp; Automation Division →</Link>
                        <Link to="/solutions/" className="text-gray-400 hover:text-white transition-colors">Solutions (100)</Link>
                        <a href="mailto:connect@elesium.online" className="text-indigo-400 hover:text-indigo-300 transition-colors">connect@elesium.online</a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
