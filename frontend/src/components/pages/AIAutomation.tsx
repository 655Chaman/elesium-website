import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Terminal, Shield, Network, Zap, Cpu, Code2, Lock, ChevronRight, MessageSquare } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const terminalLines = [
    "> Initializing Agent_04 [Sales_Ops]...",
    "> Connecting to CRM database...",
    "[OK] CRM authenticated.",
    "> Analyzing 4,203 open leads for intent signals...",
    "> Intent analysis complete. 14 high-intent accounts identified.",
    "> Drafting personalized outreach based on Q3 earnings...",
    "> Simulating response probability... 87% confidence.",
    "> Action: Sending 14 tailored sequences via Outreach.",
    "[SUCCESS] Operation completed in 2.4s. Human hours saved: 18h."
]

// Mock Terminal component for the interactive section
const AgentTerminal = () => {
    const [lines, setLines] = useState<string[]>([])

    useEffect(() => {
        let isCancelled = false;
        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;

        const typeNextLine = () => {
            if (isCancelled) return;

            if (currentIndex < terminalLines.length) {
                const nextLine = terminalLines[currentIndex];
                setLines(prev => [...prev, nextLine]);
                currentIndex++;
                timeoutId = setTimeout(typeNextLine, 800);
            } else {
                // Reset after a delay
                timeoutId = setTimeout(() => {
                    if (isCancelled) return;
                    setLines([]);
                    currentIndex = 0;
                    timeoutId = setTimeout(typeNextLine, 800);
                }, 5000);
            }
        };

        // Start typing
        timeoutId = setTimeout(typeNextLine, 800);

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="bg-black border border-neutral-200 dark:border-white/10 rounded-xl p-6 font-mono text-sm overflow-hidden h-[300px] flex flex-col justify-end relative">
            <div className="flex items-center gap-2 mb-4 absolute top-4 left-4">
                <span className="text-neutral-400 text-xs">elesium_agent.sh</span>
            </div>
            <div className="space-y-2 mt-8">
                {lines.map((line, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={`terminal-line-${i}-${line.substring(0,5)}`}
                        className={`${line.startsWith('[SUCCESS]') || line.startsWith('[OK]') ? 'text-white font-semibold' : 'text-neutral-400'}`}
                    >
                        {line}
                    </motion.div>
                ))}
                <motion.div 
                    animate={{ opacity: [1, 0] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-2 h-4 bg-white/70 inline-block mt-2"
                />
            </div>
        </div>
    )
}

export default function AIAutomation() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    const aeoAnswerCapsule = "Elesium is an enterprise AI automation agency and systems engineering firm deploying sovereign multi-agent architectures directly inside client-controlled private VPCs across India. We replace fragile low-code automations with deterministic LangGraph state machines, Pydantic type safety, and vLLM PagedAttention inference runtimes. Our production workflows guarantee sub-200ms latency, zero third-party telemetry, full DPDP Act 2023 compliance, and an audited 90-day cash-flow ROI SLA.";

    return (
        <main id="main-content" className="pt-24 pb-20 min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 relative z-10 overflow-hidden">
            <WhatsAppModal />
            <Helmet>
                <title>Enterprise AI &amp; Automation Systems in Bengaluru | Elesium</title>
                <meta name="description" content="Enterprise AI and automation systems engineering in Bengaluru, India. Deterministic autonomous agents, private LLMs, and sovereign VPC workflows." />
                <link rel="canonical" href="https://elesium.online/ai-automation/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Enterprise AI &amp; Automation Systems in Bengaluru | Elesium" />
                <meta property="og:description" content="Enterprise AI and automation systems engineering in Bengaluru, India. Deterministic autonomous agents, private LLMs, and sovereign VPC workflows." />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta property="og:url" content="https://elesium.online/ai-automation/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_ai" />
                <meta name="twitter:title" content="Enterprise AI &amp; Automation Systems in Bengaluru | Elesium" />
                <meta name="twitter:description" content="Enterprise AI and automation systems engineering in Bengaluru, India. Deterministic autonomous agents, private LLMs, and sovereign VPC workflows." />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
            </Helmet>

            <div className="max-w-6xl mx-auto px-5 md:px-8 relative z-10">
                {/* Breadcrumb Navigation */}
                <nav className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-8" aria-label="Breadcrumb">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-black dark:text-white">AI Automation</span>
                </nav>
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="text-center max-w-4xl mx-auto mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 text-xs font-semibold uppercase tracking-wider mb-6">
                        <Terminal className="w-3.5 h-3.5 text-black dark:text-white" />
                        <span>Deterministic Systems &middot; Private VPC</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6">
                        Shift from Manual to Autonomous
                    </h1>
                    
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed mb-8">
                        We build custom AI infrastructure and deterministic agents that automate complex enterprise workflows, scale your operations, and eliminate human error.
                    </p>

                    {/* Technical Overview */}
                    <div className="answer-capsule text-left mb-10 p-6 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 border-l-4 border-l-black dark:border-l-white max-w-3xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-semibold mb-2 flex items-center gap-2">
                            <Cpu className="w-4 h-4 text-black dark:text-white" />
                            Sovereign Enterprise AI Automation
                        </div>
                        <p className="text-sm md:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                            {aeoAnswerCapsule}
                        </p>
                    </div>

                    {/* Hero CTAs */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Initiate AI Audit (WhatsApp)</span>
                        </button>
                        <Link 
                            to="/waitlist/" 
                            className="w-full sm:w-auto h-11 px-6 rounded-lg border border-neutral-200 dark:border-white/10 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm active:scale-[0.97] transition-all flex items-center justify-center gap-1.5"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </motion.div>

                {/* Architecture & Interactive Demo */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 260, damping: 26 }}
                    className="mb-16"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-6 sm:p-10">
                        <div>
                            <span className="text-xs uppercase font-semibold tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 block">
                                Beyond Generic Wrappers
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-4">
                                Production-Grade Engineering
                            </h2>
                            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                                Off-the-shelf tools break under real enterprise loads. We build bespoke, deterministic AI agents that integrate deeply into your proprietary data, capable of complex reasoning and autonomous execution.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Deep API integrations (CRM, ERP, SAP, Slack)",
                                    "Multi-agent reasoning frameworks (LangGraph)",
                                    "Real-time data ingestion and processing",
                                    "Automated error handling with sovereign privacy"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300">
                                        <div className="w-5 h-5 rounded-md bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center flex-shrink-0">
                                            <Code2 className="w-3 h-3 text-black dark:text-white" />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <AgentTerminal />
                        </div>
                    </div>
                </motion.div>

                {/* Capabilities Bento Grid */}
                <div className="mb-16">
                    <div className="text-center mb-10 max-w-2xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-3">Core Capabilities</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Targeted AI solutions engineered for measurable business outcomes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Large Tile */}
                        <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-7 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Network className="w-28 h-28 text-black dark:text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black flex items-center justify-center mb-4 border border-neutral-200 dark:border-white/10">
                                    <Terminal className="w-5 h-5 text-black dark:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Autonomous Multi-Agent Systems</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                                    Deploy intelligent agents that handle end-to-end processes. From tier-1 customer support to automated HR onboarding, our agents reason, act, and report autonomously.
                                </p>
                            </div>
                        </div>

                        {/* Standard Tile */}
                        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-7 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black flex items-center justify-center mb-4 border border-neutral-200 dark:border-white/10">
                                    <Zap className="w-5 h-5 text-black dark:text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Signal-Based Outbound</h3>
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Analyze market intent signals to trigger hyper-personalized sales outreach at the exact right moment.
                                </p>
                            </div>
                        </div>

                        {/* Standard Tile */}
                        <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-7 relative overflow-hidden group">
                            <div className="relative z-10 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black flex items-center justify-center mb-4 border border-neutral-200 dark:border-white/10">
                                    <Cpu className="w-5 h-5 text-black dark:text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-black dark:text-white mb-2">Data ETL Pipelines</h3>
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Automatically extract, clean, and structure unstructured enterprise data into high-velocity queryable intelligence.
                                </p>
                            </div>
                        </div>

                        {/* Large Tile */}
                        <div className="md:col-span-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-7 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Shield className="w-28 h-28 text-black dark:text-white" />
                            </div>
                            <div className="relative z-10 flex flex-col justify-end">
                                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black flex items-center justify-center mb-4 border border-neutral-200 dark:border-white/10">
                                    <Lock className="w-5 h-5 text-black dark:text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Private VPC &amp; Sovereign Security</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed">
                                    For regulated industries. We deploy open-source models within your private VPC. Your data never trains public models, ensuring 100% compliance with India&apos;s DPDP Act 2023.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-16 max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Frequently Asked Questions</h2>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">Everything you need to know about our engineering approach.</p>
                    </div>
                    <div className="space-y-4">
                        {[
                            {
                                q: "What is AI automation and how can it help my business in India?",
                                a: "True AI automation isn't a chatbot answering FAQs. It's a deterministic multi-agent system that autonomously routes tickets, extracts structured data from messy ERP systems (like SAP), and executes supply chain negotiations without human intervention."
                            },
                            {
                                q: "How long does it take to implement AI automation?",
                                a: "Most legacy agencies quote 6 to 12 months for 'digital transformation'. We deploy hardened, production-ready pilot agents within 4 to 6 weeks. Full enterprise integration across multiple data silos reaches production scale within 90 days."
                            },
                            {
                                q: "What industries in India benefit most from AI automation?",
                                a: "Any industry choked by unstructured data and manual data entry. We see significant ROI in Indian BFSI (autonomous underwriting), Manufacturing (inventory signal processing), and Enterprise SaaS."
                            },
                            {
                                q: "How is Elesium different from other AI agencies in India?",
                                a: "We are an engineering firm that builds custom Python/LangGraph architectures deeply integrated into your legacy on-prem systems, mandating verified ROI before writing code."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-xl p-6">
                                <h3 className="text-base font-semibold text-black dark:text-white mb-2">{faq.q}</h3>
                                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA Card */}
                <div className="rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 p-8 sm:p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-neutral-200 dark:border-white/10 bg-white dark:bg-black text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-6">
                        <span>Sovereign Private VPC Deployment Protocol</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
                        Ready to unlock autonomous enterprise scale?
                    </h2>

                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto mb-8 leading-relaxed">
                        Stop wasting human capital on repetitive tasks. Schedule a direct engineering intake on WhatsApp to evaluate deterministic agentic architectures for your enterprise.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                        </button>
                        <Link 
                            to="/waitlist/" 
                            className="w-full sm:w-auto h-11 px-6 rounded-lg border border-neutral-200 dark:border-white/10 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm active:scale-[0.97] transition-all flex items-center justify-center gap-1.5"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    )
}
