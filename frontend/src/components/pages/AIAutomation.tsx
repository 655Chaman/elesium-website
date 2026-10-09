import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Terminal, Shield, Network, Zap, Cpu, Code2, Lock, ArrowRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
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
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 font-mono text-sm shadow-2xl overflow-hidden h-[300px] flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-4 absolute top-4 left-4">
                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                <span className="ml-2 text-white/30 text-xs">elesium_agent.sh</span>
            </div>
            <div className="space-y-2 mt-8">
                {lines.map((line, i) => (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={`terminal-line-${i}-${line.substring(0,5)}`}
                        className={`${line.startsWith('[SUCCESS]') ? 'text-green-400' : line.startsWith('[OK]') ? 'text-blue-400' : 'text-gray-300'}`}
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

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-black transition-colors duration-300 relative z-10 overflow-hidden">
            <Helmet>
                <title>AI Automation Agency India | Elesium</title>
                <meta name="description" content="Elesium builds custom AI automation workflows for Indian enterprises. From agentic AI to LLM integration — we automate what slows you down." />
                <link rel="canonical" href="https://elesium.online/ai-automation" />
                <script type="application/ld+json">
                    {`
                    {
                      "@context": "https://schema.org",
                      "@type": "FAQPage",
                      "mainEntity": [
                        {
                          "@type": "Question",
                          "name": "What is AI automation and how can it help my business in India?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "AI automation involves using artificial intelligence to execute complex tasks traditionally requiring human reasoning. For Indian businesses, it means scaling operations rapidly, reducing manual errors, and competing globally without proportionally increasing headcount."
                          }
                        },
                        {
                          "@type": "Question",
                          "name": "How long does it take to implement AI automation?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "While timeline varies by complexity, we typically deploy pilot agents within 4-6 weeks. Full enterprise integration across multiple workflows usually takes 2-3 months from audit to production deployment."
                          }
                        },
                        {
                          "@type": "Question",
                          "name": "What industries in India benefit most from AI automation?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "We see the highest ROI in manufacturing, defense, industrial B2B, healthcare, and enterprise SaaS. These sectors deal with complex, high-volume data where deterministic AI agents can automate compliance, sales, and supply chain operations."
                          }
                        },
                        {
                          "@type": "Question",
                          "name": "How is Elesium different from other AI agencies in India?",
                          "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Unlike agencies relying on standard LLM wrappers, Elesium builds custom, deterministic AI infrastructure. We embed deeply into your proprietary enterprise data securely, prioritizing measurable ROI and autonomous execution over generic generative tools."
                          }
                        }
                      ]
                    }
                    `}
                </script>
            </Helmet>
            
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-500/5 dark:bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 relative z-10">
                
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center max-w-4xl mx-auto mb-32"
                >

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight text-gray-900 dark:text-white mb-8 leading-[1.1]">
                        Shift from Manual<br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            to Autonomous.
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We build custom AI infrastructure and deterministic agents that automate complex workflows, scale your operations, and eliminate technical debt.
                    </p>
                </motion.div>

                {/* Architecture & Interactive Demo */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-32"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 dark:text-white mb-6">
                                Not just wrappers. <br />Real engineering.
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                Off-the-shelf tools break when you need them most. We build bespoke, deterministic AI agents that integrate deeply into your proprietary data, capable of complex reasoning and autonomous execution.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Deep API integrations (CRM, ERP, Slack)",
                                    "Multi-agent reasoning frameworks",
                                    "Real-time data ingestion and processing",
                                    "Automated error handling and retries"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <Code2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-[60px] rounded-[3rem]"></div>
                            <AgentTerminal />
                        </div>
                    </div>
                </motion.div>

                {/* Capabilities (Bento Box) */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Core Capabilities</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Targeted AI solutions designed for measurable business outcomes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                        
                        {/* Large Tile */}
                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Network className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Terminal className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Autonomous Agents</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Deploy intelligent agents that handle end-to-end processes. From tier-1 customer support to automated HR onboarding, our agents reason, act, and report autonomously.
                                </p>
                            </div>
                        </div>

                        {/* Standard Tile */}
                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Signal-Based Outbound</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Analyze market intent signals to trigger hyper-personalized sales outreach at the exact right moment.
                                </p>
                            </div>
                        </div>

                        {/* Standard Tile */}
                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Cpu className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Data ETL Pipelines</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Automatically extract, clean, and structure messy enterprise data into queryable intelligence.
                                </p>
                            </div>
                        </div>

                        {/* Large Tile */}
                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Shield className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Lock className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Private AI & Security</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    For regulated industries. We deploy open-source models within your private VPC. Your data never trains public models, ensuring 100% compliance and IP protection.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-32 max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-6">
                        {[
                            {
                                q: "What is AI automation and how can it help my business in India?",
                                a: "True AI automation isn't a chatbot answering FAQs. It's a deterministic multi-agent system that autonomously routes tickets, extracts structured data from messy ERP systems (like SAP), and executes supply chain negotiations without human intervention. It transforms Opex into highly scalable Capex."
                            },
                            {
                                q: "How long does it take to implement AI automation?",
                                a: "Most legacy agencies quote 6 to 12 months for 'digital transformation'. We deploy hardened, production-ready pilot agents within 4 to 6 weeks. Full enterprise integration across multiple data silos reaches production scale within 90 days."
                            },
                            {
                                q: "What industries in India benefit most from AI automation?",
                                a: "Any industry choked by unstructured data and manual data entry. We see the most aggressive ROI in Indian BFSI (autonomous underwriting), Manufacturing (inventory signal processing), and Enterprise SaaS (automated technical onboarding)."
                            },
                            {
                                q: "How is Elesium different from other AI agencies in India?",
                                a: "We don't build generic ChatGPT wrappers. We are an engineering firm that builds custom Python/LangGraph architectures deeply integrated into your legacy on-prem systems. We mandate a clear, mathematically sound ROI before writing a single line of code."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{faq.q}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-gray-900 dark:bg-white/5 rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden border border-black/10 dark:border-white/10"
                >
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-medium text-white mb-6">
                            Ready to unlock autonomous scale?
                        </h2>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                            Stop wasting human capital on robotic tasks. Schedule a custom AI readiness audit to see exactly where our infrastructure can impact your bottom line.
                        </p>
                        <div className="flex justify-center">
                            <button onClick={openWhatsApp} className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-transform">
                                Request Private AI Audit
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <WhatsAppModal />
                        </div>
                    </div>
                    {/* Decorative blurred blobs */}
                    <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] bg-blue-500/30 blur-[100px] rounded-full"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[300px] h-[300px] bg-cyan-500/30 blur-[100px] rounded-full"></div>
                </motion.div>

            </div>
        </div>
    )
}

