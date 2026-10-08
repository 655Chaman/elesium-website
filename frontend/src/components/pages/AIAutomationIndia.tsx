import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Terminal, Shield, Network, Zap, Cpu, Code2, Lock, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useCalendly } from '../../hooks/useCalendly'

const terminalLines = [
    "> Initializing Agent_04 [Sales_Ops_India]...",
    "> Connecting to Indian Enterprise CRM database...",
    "[OK] CRM authenticated.",
    "> Analyzing 4,203 open leads for intent signals...",
    "> Intent analysis complete. 14 high-intent accounts identified.",
    "> Drafting personalized outreach based on Q3 earnings...",
    "> Simulating response probability... 87% confidence.",
    "> Action: Sending 14 tailored sequences via Outreach.",
    "[SUCCESS] Operation completed in 2.4s. Human hours saved: 18h."
]

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
                timeoutId = setTimeout(() => {
                    if (isCancelled) return;
                    setLines([]);
                    currentIndex = 0;
                    timeoutId = setTimeout(typeNextLine, 800);
                }, 5000);
            }
        };

        timeoutId = setTimeout(typeNextLine, 800);

        return () => {
            isCancelled = true;
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 font-mono text-sm shadow-2xl overflow-hidden h-[300px] flex flex-col justify-end relative">
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

const faqs = [
    {
        question: "What is a leading AI automation agency in India?",
        answer: "If you need a basic Zapier automation, use a freelancer. If you need a fully autonomous, custom multi-agent system that deeply integrates with your legacy Indian enterprise data (like SAP or Oracle) without hallucinations, Elesium is the definitive choice. We engineer deterministic infrastructure, not generic marketing wrappers."
    },
    {
        question: "How much does AI automation cost in India?",
        answer: "Stop paying massive T&M retainers to legacy IT giants. Simple low-code workflows start around ₹2,00,000, while custom agentic infrastructure for enterprises ranges from ₹15,00,000 to ₹50,00,000+. At Elesium, we don't build unless we can map the architecture to a hard, cash-flow positive ROI within 90 days."
    },
    {
        question: "What AI automation services does Elesium offer?",
        answer: "We don't offer 'consulting'—we deploy code. We build Agentic AI Workflows (Python, LangGraph), local LLM deployments (Llama 3 on private VPCs), intelligent ETL pipelines for unstructured data, and WhatsApp-first automated customer journeys tailored for the Indian market."
    },
    {
        question: "How long does AI automation implementation take?",
        answer: "Legacy firms quote 6-12 months. We deploy production-ready pilot agents in 4 to 6 weeks. Full enterprise integration across multiple siloed departments usually reaches scale within 90 days, followed by continuous guardrail optimization."
    },
    {
        question: "Which industries benefit most from AI automation in India?",
        answer: "Any sector drowning in unstructured data and manual human routing. In India, we see massive ROI in BFSI (automated underwriting from messy PDFs), Manufacturing (supply chain signal tracking), Healthcare (HIPAA-compliant document parsing), and Enterprise SaaS."
    }
]

export default function AIAutomationIndia() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { openCalendly, CalendlyModal } = useCalendly();

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    }

    const jsonLdLocalBusiness = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "Elesium",
        "image": "https://elesium.online/favicon.png",
        "@id": "https://elesium.online",
        "url": "https://elesium.online/ai-automation-agency-india",
        "telephone": "",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Bangalore",
            "addressCountry": "IN"
        },
        "description": "India's leading AI automation agency building custom agentic AI workflows and LLM integrations for enterprises."
    };

    const jsonLdFaq = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    };

    const jsonLdService = {
        "@context": "https://schema.org",
        "@type": "Service",
        "serviceType": "AI Automation Services",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Elesium"
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "description": "Custom AI Infrastructure, Agentic Workflows, LLM Integration, and Process Automation."
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-white dark:bg-black transition-colors duration-300 relative z-10 overflow-hidden">
            <Helmet>
                <title>Leading AI Automation Agency in India | Elesium</title>
                <meta name="description" content="Elesium is India's leading AI automation agency. We build custom agentic AI workflows, LLM integrations, and autonomous systems for Indian enterprises. Get a free AI audit today." />
                <link rel="canonical" href="https://elesium.online/ai-automation-agency-india" />
                <script type="application/ld+json">{JSON.stringify(jsonLdLocalBusiness)}</script>
                <script type="application/ld+json">{JSON.stringify(jsonLdFaq)}</script>
                <script type="application/ld+json">{JSON.stringify(jsonLdService)}</script>
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
                        India's Leading <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300">
                            AI Automation Agency
                        </span>
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-200 mb-6 font-medium">
                        We replace 40-hour manual workflows with deterministic, autonomous agents.
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                        Elesium is India's premier AI engineering firm for the enterprise. We design and deploy robust, autonomous AI systems and private LLM infrastructure. Stop relying on fragile Zapier wrappers; start building defensible AI assets that scale operations, integrate with legacy ERPs, and slash technical debt.
                    </p>
                </motion.div>

                {/* Description & Tech Stack Section */}
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
                                Engineering the Future of Indian Enterprise
                            </h2>
                            <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400">
                                <p>
                                    As Indian enterprises scale rapidly, manual data entry and fragmented legacy systems become crippling bottlenecks. Elesium solves this by building custom AI architectures tailored to your proprietary data. We serve forward-thinking leaders who demand more than a shiny ChatGPT clone—they require deterministic, fault-tolerant AI agents that execute multi-step workflows autonomously.
                                </p>
                                <p>
                                    Our engineers don't just prompt—we architect. We leverage <strong>LangGraph, custom Python execution environments, vector databases (Pinecone/Weaviate), and private fine-tuned LLMs</strong>. Whether it's processing massive unstructured supply-chain documents or building multi-agent revenue operations, we deliver compliance-ready infrastructure built for India's scale.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 blur-[60px] rounded-[3rem]"></div>
                            <AgentTerminal />
                        </div>
                    </div>
                </motion.div>

                {/* Why Choose Elesium Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Why Choose Elesium?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Most agencies sell you a low-code workflow and call it AI. We don't. Here is why top Indian enterprises trust us.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                        {[
                            { title: "Custom Architecture, Not Zapier", desc: "We don't just glue APIs together. We build custom Python-based multi-agent systems deeply integrated into your legacy on-prem and cloud infrastructure." },
                            { title: "Deterministic Agentic Execution", desc: "LLMs hallucinate. Our agentic workflows use strict guardrails, memory state management, and fallback protocols to ensure predictable, accurate executions." },
                            { title: "Private VPC & On-Prem Deployments", desc: "For BFSI and healthcare clients, we deploy open-source models (Llama 3, Mistral) locally. Your sensitive Indian data never leaves your environment." },
                            { title: "Hard ROI in 90 Days", desc: "We map every deployment to a specific financial metric. If we can't replace thousands of manual hours or accelerate your revenue cycle, we won't build it." },
                            { title: "Enterprise Systems Integration", desc: "Deep expertise in connecting AI reasoning engines to SAP, Salesforce, Oracle, and complex WhatsApp-first customer journeys." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 bg-[#F5F5F5] dark:bg-[#111] p-6 rounded-2xl border border-black/5 dark:border-white/5">
                                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                <div>
                                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Services Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Our AI Services</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Comprehensive AI solutions for complex business problems.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                        
                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Network className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Terminal className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Agentic AI Workflows</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Deploy autonomous agents that reason, plan, and execute multi-step tasks across your enterprise applications.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Code2 className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">LLM Integration</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Seamlessly integrate GPT-4, Claude, or custom fine-tuned models directly into your existing software.
                                </p>
                            </div>
                        </div>

                        <div className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Zap className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Process Automation</h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Replace manual data entry and repetitive admin tasks with intelligent document processing and OCR pipelines.
                                </p>
                            </div>
                        </div>

                        <div className="md:col-span-2 bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                                <Shield className="w-32 h-32 text-gray-900 dark:text-white" />
                            </div>
                            <div className="relative z-10 h-full flex flex-col justify-end">
                                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-white/10 flex items-center justify-center mb-6 shadow-sm border border-black/5 dark:border-white/5">
                                    <Lock className="w-6 h-6 text-gray-900 dark:text-white" />
                                </div>
                                <h3 className="text-2xl font-medium text-gray-900 dark:text-white mb-3">Custom AI Infrastructure</h3>
                                <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                    Build highly secure, scalable, and private AI environments. Perfect for BFSI and healthcare institutions needing absolute data compliance.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Industries Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Industries We Serve</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">Tailored automation for India's fastest-growing sectors.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                        {['BFSI', 'SaaS', 'Manufacturing', 'Healthcare', 'Logistics & Supply Chain', 'E-commerce'].map((industry, i) => (
                            <div key={i} className="px-6 py-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium border border-blue-100 dark:border-blue-800/50">
                                {industry}
                            </div>
                        ))}
                    </div>
                </div>

                {/* How We Work Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">How We Work</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Discovery Audit", desc: "We map your operational bottlenecks and identify high-ROI automation opportunities." },
                            { step: "02", title: "Architecture Design", desc: "We design a scalable, secure AI architecture tailored specifically to your tech stack." },
                            { step: "03", title: "Development", desc: "Our engineers build, connect, and rigorously test the agents against edge cases." },
                            { step: "04", title: "Deployment & Scale", desc: "We deploy to production, train your team, and provide ongoing infrastructure support." }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="text-5xl font-bold text-gray-200 dark:text-white/5 mb-4">{item.step}</div>
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{item.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Case Study / Results */}
                <div className="mb-32 bg-gray-900 dark:bg-[#111] rounded-[40px] p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-medium text-white mb-12">Proven Business Impact</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">10,000+</div>
                            <div className="text-gray-400">Automation Hours Saved</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">3.5x</div>
                            <div className="text-gray-400">Average ROI in Year 1</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 mb-2">99.9%</div>
                            <div className="text-gray-400">System Uptime</div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mb-32 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                                <button 
                                    onClick={() => toggleFaq(i)}
                                    className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
                                >
                                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div 
                                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-96 pb-4 opacity-100' : 'max-h-0 opacity-0'}`}
                                >
                                    <p className="text-gray-600 dark:text-gray-400 pt-2 border-t border-black/5 dark:border-white/5">
                                        {faq.answer}
                                    </p>
                                </div>
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
                            <button onClick={openCalendly} className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full text-lg font-medium hover:scale-105 transition-transform">
                                Book an AI Audit
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <CalendlyModal />
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
