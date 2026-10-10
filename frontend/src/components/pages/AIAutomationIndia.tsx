import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Terminal, Shield, Network, Zap, Code2, Lock, ArrowRight, CheckCircle2, Calculator } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

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
        answer: "Stop paying massive T&M retainers to legacy IT giants. The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate. At Elesium, we don't build unless we can map the architecture to a hard, cash-flow positive ROI within 90 days."
    },
    {
        question: "What AI automation services does Elesium offer?",
        answer: "We don't offer 'consulting'—we deploy code. We build Agentic AI Workflows (Python, LangGraph), local LLM deployments (Llama 3 on private VPCs), intelligent ETL pipelines for unstructured data, and WhatsApp-first automated customer journeys tailored for the Indian market."
    },
    {
        question: "How long does AI automation implementation take?",
        answer: "Legacy firms quote 6-12 months. We deploy production-ready pilot agents in 14 days to 6 weeks. Full enterprise integration across multiple siloed departments usually reaches scale within 90 days, followed by continuous guardrail optimization."
    },
    {
        question: "Which industries benefit most from AI automation in India?",
        answer: "Any sector drowning in unstructured data and manual human routing. In India, we see massive ROI in BFSI (automated underwriting from messy PDFs), Manufacturing (supply chain signal tracking), Healthcare (HIPAA-compliant document parsing), and Enterprise SaaS."
    }
]

export default function AIAutomationIndia() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    const [intakeWorkflow, setIntakeWorkflow] = useState('Document Extraction & Invoice Reconciliation');
    const [intakeErp, setIntakeErp] = useState('SAP / Oracle NetSuite');
    const [intakeHours, setIntakeHours] = useState(80);
    const [intakeSecurity, setIntakeSecurity] = useState('Private VPC (AWS/GCP India) - Zero Retention');

    const calculatedAnnualHoursSaved = Math.round(intakeHours * 50 * 0.82);
    const calculatedAnnualCostSavings = calculatedAnnualHoursSaved * 1250;
    const recommendedSprint = intakeHours <= 40 
        ? 'Tier 1: Pilot Architecture Sprint (₹1.5L – ₹3.5L)' 
        : intakeHours <= 150 
            ? 'Tier 2: Enterprise Multi-Agent Suite (₹6L – ₹15L)' 
            : 'Tier 3: Autonomous AI Engineering Pod (₹4.5L/mo Retainer)';

    const handleTransmitIntake = () => {
        const text = `Hello Elesium Architecture Team,\n\nI completed the Enterprise AI Architecture Intake on elesium.online:\n• Workflow Focus: ${intakeWorkflow}\n• Core ERP/Stack: ${intakeErp}\n• Current Manual Load: ${intakeHours} hours/week\n• Security Constraint: ${intakeSecurity}\n• Projected Annual Hours Saved: ${calculatedAnnualHoursSaved.toLocaleString('en-IN')} hrs\n• Projected Annual Cost Savings: ₹${calculatedAnnualCostSavings.toLocaleString('en-IN')}\n• Recommended Tier: ${recommendedSprint}\n\nPlease share the bespoke technical feasibility blueprint and proof-of-concept timeline.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/918317329312?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };

    const handleTierWhatsApp = (tierName: string, budget: string) => {
        const text = `Hello Elesium Engineering Team,\n\nI want to initiate the ${tierName} (${budget}) for our enterprise.\n\nPlease share your architecture roadmap and onboarding availability.`;
        const encoded = encodeURIComponent(text);
        window.open(`https://wa.me/918317329312?text=${encoded}`, '_blank', 'noopener,noreferrer');
    };

    const jsonLdLocalBusiness = {
        "@context": "https://schema.org",
        "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
        "name": "Elesium - Enterprise AI Automation Agency India",
        "image": "https://elesium.online/favicon.png",
        "@id": "https://elesium.online/#organization",
        "url": "https://elesium.online/ai-automation-agency-india",
        "telephone": "+91-8317329312",
        "priceRange": "₹1,50,000 - ₹15,00,000+",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Koramangala 4th Block",
            "addressLocality": "Bangalore",
            "addressRegion": "Karnataka",
            "postalCode": "560034",
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 12.9352,
            "longitude": 77.6245
        },
        "hasMap": "https://www.google.com/maps/place/Koramangala,+Bengaluru,+Karnataka",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "09:00",
                "closes": "19:00"
            }
        ],
        "sameAs": [
            "https://elesium.online",
            "https://github.com/elesium-ai",
            "https://www.linkedin.com/company/elesium",
            "https://x.com/elesium_ai",
            "https://ipfs.io/ipfs/Qma8a78232d60a0b7445f34cee63b4eb2bfe20d450346e",
            "https://www.wikidata.org/wiki/Q11660"
        ],
        "founder": {
            "@type": "Person",
            "name": "Elesium AI Systems Architecture Team",
            "jobTitle": "Lead AI Systems Architect",
            "telephone": "+91-8317329312"
        },
        "description": "India's leading AI automation agency building custom agentic AI workflows, LangGraph state machines, and private VPC LLM infrastructure for enterprises."
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
        "name": "Enterprise AI Automation Services",
        "serviceType": "AI Automation Agency",
        "provider": {
            "@type": "LocalBusiness",
            "name": "Elesium",
            "url": "https://elesium.online",
            "telephone": "+91-8317329312",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Koramangala 4th Block",
                "addressLocality": "Bangalore",
                "addressRegion": "Karnataka",
                "postalCode": "560034",
                "addressCountry": "IN"
            }
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "description": "The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate.",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Enterprise AI Automation Investment Tiers",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Pilot Architecture Sprint",
                    "description": "Single-Process Deterministic Agent, Private Cloud Staging Deployment, FastAPI + LangGraph Architecture, 14-Day Delivery Guarantee.",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "150000",
                        "maxPrice": "350000",
                        "priceCurrency": "INR"
                    }
                },
                {
                    "@type": "Offer",
                    "name": "Enterprise Multi-Agent Suite",
                    "description": "Multi-Agent Collaborative Triad (LangGraph), Private VPC / Zero-Data-Retention Deployment, Deep Legacy ERP/SAP & SQL Integration, 99.9% Production SLA & 90-Day ROI Guarantee.",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "600000",
                        "maxPrice": "1500000",
                        "priceCurrency": "INR"
                    }
                },
                {
                    "@type": "Offer",
                    "name": "Autonomous Engineering Pod",
                    "description": "3 Dedicated AI Systems Engineers + Architect, Continuous Fine-Tuning & Vector Optimization, Omnichannel Voice + WhatsApp Systems, 1-Hour Critical Incident Response SLA.",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "price": "450000",
                        "priceCurrency": "INR",
                        "unitText": "MONTH"
                    }
                }
            ]
        }
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

                {/* Enterprise Pricing Matrix Section (Shaun Mitchell & Fountain Hills Parity) */}
                <div id="pricing-matrix" className="mb-32">
                    <div className="text-center mb-16">
                        <span className="text-blue-600 dark:text-cyan-400 font-mono text-sm uppercase tracking-wider">Transparent Institutional Investment</span>
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mt-3">Enterprise AI Automation Pricing in India</h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-3xl mx-auto text-base md:text-lg">
                            The average cost of enterprise AI automation in India ranges from ₹1,50,000 for deterministic pilot architectures to ₹15,00,000+ for comprehensive multi-agent enterprise systems, backed by a hard 90-day ROI mandate.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {/* Tier 1 */}
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-3xl p-8 hover:border-blue-500/40 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-mono text-blue-600 dark:text-cyan-400 mb-2 uppercase tracking-widest">Tier 1 // 14-Day Sprint</div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Pilot Architecture Sprint</h3>
                                <div className="mt-4 mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹1,50,000 – ₹3,50,000</span>
                                    <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">($2,000 – $4,500 USD) • Fixed Investment</span>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Single-Process Deterministic Agent</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Private Cloud Staging Deployment</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> FastAPI + LangGraph Architecture</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 14-Day Delivery Guarantee</li>
                                </ul>
                            </div>
                            <button 
                                onClick={() => handleTierWhatsApp('Pilot Architecture Sprint', '₹1,50,000 - ₹3,50,000')}
                                className="mt-8 block w-full text-center py-3.5 px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 text-gray-900 dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                Deploy Pilot Sprint
                            </button>
                        </div>

                        {/* Tier 2: Highlighted */}
                        <div className="bg-gradient-to-b from-blue-50 to-[#F5F5F5] dark:from-[#151515] dark:to-[#0A0A0A] border-2 border-blue-600 dark:border-cyan-500 rounded-3xl p-8 shadow-2xl shadow-blue-500/10 dark:shadow-cyan-500/10 flex flex-col justify-between relative">
                            <span className="absolute -top-3 right-6 bg-blue-600 dark:bg-cyan-500 text-white dark:text-black text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">Most Deployed</span>
                            <div>
                                <div className="text-xs font-mono text-blue-600 dark:text-cyan-400 mb-2 uppercase tracking-widest">Tier 2 // Production Suite</div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Enterprise Multi-Agent Suite</h3>
                                <div className="mt-4 mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹6,00,000 – ₹15,00,000</span>
                                    <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">($7,500 – $18,000 USD) • Milestone-Based</span>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Multi-Agent Collaborative Triad (LangGraph)</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Private VPC / Zero-Data-Retention Deployment</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Deep Legacy ERP/SAP & SQL Integration</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 99.9% Production SLA & 90-Day ROI Guarantee</li>
                                </ul>
                            </div>
                            <button 
                                onClick={() => handleTierWhatsApp('Enterprise Multi-Agent Suite', '₹6,00,000 - ₹15,00,000')}
                                className="mt-8 block w-full text-center py-3.5 px-6 rounded-2xl bg-blue-600 dark:bg-cyan-500 text-white dark:text-black font-semibold hover:bg-blue-700 dark:hover:bg-cyan-400 transition-colors"
                            >
                                Deploy Enterprise Suite
                            </button>
                        </div>

                        {/* Tier 3 */}
                        <div className="bg-[#F5F5F5] dark:bg-[#0A0A0A] border border-black/10 dark:border-white/10 rounded-3xl p-8 hover:border-blue-500/40 dark:hover:border-cyan-500/40 transition-all flex flex-col justify-between">
                            <div>
                                <div className="text-xs font-mono text-blue-600 dark:text-cyan-400 mb-2 uppercase tracking-widest">Tier 3 // Continuous Pod</div>
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Autonomous Engineering Pod</h3>
                                <div className="mt-4 mb-6">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹4,50,000 / month</span>
                                    <span className="block text-sm text-gray-600 dark:text-gray-400 mt-1">($5,500 / month USD) • 12-Month Retainer</span>
                                </div>
                                <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300 font-mono">
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 3 Dedicated AI Systems Engineers + Architect</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Continuous Fine-Tuning & Vector Optimization</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Omnichannel Voice + WhatsApp Systems</li>
                                    <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> 1-Hour Critical Incident Response SLA</li>
                                </ul>
                            </div>
                            <button 
                                onClick={() => handleTierWhatsApp('Autonomous AI Engineering Pod', '₹4,50,000 / month')}
                                className="mt-8 block w-full text-center py-3.5 px-6 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/20 text-gray-900 dark:text-white font-medium hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                                Retain Engineering Pod
                            </button>
                        </div>
                    </div>
                </div>

                {/* Proprietary Enterprise Architecture Intake & ROI Calculator (Shaun Mitchell Framework) */}
                <div id="architecture-intake" className="mb-32 bg-[#F8F9FA] dark:bg-[#0D0D0D] border border-black/10 dark:border-white/10 rounded-[32px] p-8 md:p-14">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 dark:bg-cyan-500/10 text-blue-600 dark:text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
                            <Calculator className="w-3.5 h-3.5" />
                            Shaun Mitchell Enterprise Intake Dataset Framework
                        </div>
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white">
                            AI Architecture Audit & ROI Estimator
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mt-3 text-base md:text-lg">
                            Configure your enterprise workflow parameters below to generate an instant mathematical feasibility benchmark and projected capital savings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Configuration Controls */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Parameter 1: Workflow */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                    1. Primary Enterprise Workflow Bottleneck
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                    {[
                                        'Document Extraction & Invoice Reconciliation',
                                        'Autonomous Support & Case Resolution',
                                        'Cross-System ERP-CRM Synchronization',
                                        'Regulatory Compliance & Audit Trails',
                                        'Bespoke Multi-Agent Operational Pod'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeWorkflow(opt)}
                                            className={`text-left text-xs md:text-sm p-3.5 rounded-xl border transition-all ${
                                                intakeWorkflow === opt
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parameter 2: ERP & Stack */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                    2. Core Data Environment & ERP Stack
                                </label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                                    {[
                                        'SAP / Oracle NetSuite',
                                        'Tally Prime / Zoho Books',
                                        'Salesforce / HubSpot',
                                        'PostgreSQL / SQL Server',
                                        'Snowflake / Databricks',
                                        'Custom REST / Microservices'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeErp(opt)}
                                            className={`text-center text-xs p-3 rounded-xl border transition-all ${
                                                intakeErp === opt
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Parameter 3: Weekly Manual Hours */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                        3. Human Labor Dedicated to Manual Workflow
                                    </label>
                                    <span className="text-base font-bold text-blue-600 dark:text-cyan-400 font-mono">
                                        {intakeHours} Hours / Week
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="20"
                                    max="300"
                                    step="10"
                                    value={intakeHours}
                                    onChange={(e) => setIntakeHours(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
                                />
                                <div className="flex justify-between text-xs text-gray-400 font-mono mt-1">
                                    <span>20 hrs (Pilot team)</span>
                                    <span>150 hrs (Division)</span>
                                    <span>300+ hrs (Department)</span>
                                </div>
                            </div>

                            {/* Parameter 4: Security Tier */}
                            <div>
                                <label className="block text-sm font-mono text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                                    4. Security & Compliance Protocol
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {[
                                        'Private VPC (AWS/GCP India) - Zero Retention',
                                        'Air-Gapped / On-Premise Enclave',
                                        'SOC2 & DPDP Act 2023 Compliant Pod'
                                    ].map((opt) => (
                                        <button
                                            key={opt}
                                            type="button"
                                            onClick={() => setIntakeSecurity(opt)}
                                            className={`text-center text-xs p-3 rounded-xl border transition-all ${
                                                intakeSecurity === opt
                                                    ? 'border-blue-600 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-gray-900 dark:text-white font-medium'
                                                    : 'border-black/5 dark:border-white/5 bg-white dark:bg-[#141414] text-gray-600 dark:text-gray-400 hover:border-black/20 dark:hover:border-white/20'
                                            }`}
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Live Architectural Output Card */}
                        <div className="lg:col-span-5 bg-white dark:bg-[#121212] border border-blue-500/20 dark:border-cyan-500/20 rounded-2xl p-7 flex flex-col justify-between shadow-xl">
                            <div>
                                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4 mb-6">
                                    <span className="text-xs font-mono uppercase tracking-widest text-blue-600 dark:text-cyan-400">
                                        Architectural Assessment
                                    </span>
                                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-mono">
                                        94% Deterministic Match
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono block">Projected 12-Month Net Capital Savings</span>
                                        <div className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                                            ₹{calculatedAnnualCostSavings.toLocaleString('en-IN')}
                                        </div>
                                        <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
                                            Recovers ~{calculatedAnnualHoursSaved.toLocaleString('en-IN')} high-value human engineering/operational hours
                                        </span>
                                    </div>

                                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-[#181818] border border-black/5 dark:border-white/5 space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Recommended Sprint:</span>
                                            <span className="font-semibold text-gray-900 dark:text-white text-right">{recommendedSprint}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Target Tech Stack:</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-200">{intakeErp}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Security Architecture:</span>
                                            <span className="font-mono text-gray-800 dark:text-gray-200">Zero-Data-Retention</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Deployment Lead Time:</span>
                                            <span className="font-mono text-emerald-500 font-bold">14 – 21 Business Days</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleTransmitIntake}
                                className="mt-8 w-full py-4 px-6 rounded-xl bg-blue-600 dark:bg-cyan-500 text-white dark:text-black font-semibold text-sm hover:bg-blue-700 dark:hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/20"
                            >
                                Transmit Architecture Intake to Systems Architect
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* FAQ Section (Statically Open DOM Rendering - Zero Accordion Traps) */}
                <div className="mb-32 max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-medium text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
                        <p className="text-gray-600 dark:text-gray-400">Direct answers to technical and commercial evaluation questions.</p>
                    </div>
                    <div className="space-y-6">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-[#F5F5F5] dark:bg-[#111] border border-black/5 dark:border-white/5 rounded-2xl p-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {faq.answer}
                                </p>
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
