import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronRight,
    ChevronDown,
    Search
} from 'lucide-react'

interface ToolCard {
    slug: string
    title: string
    category: 'GPU & Infrastructure' | 'RAG & Latency' | 'Compliance & DPDP' | 'FinOps & Token Economics' | 'Architecture & Reliability'
    description: string
    metric: string
    badge: string
}

const TOOLS_LIST: ToolCard[] = [
    {
        slug: "agent-vram-gpu-cluster-sizer",
        title: "Agent VRAM & GPU Cluster Sizer",
        category: "GPU & Infrastructure",
        description: "Calculate exact VRAM allocation, tensor parallelism, and NVIDIA H100/A100 cluster topology for enterprise multi-agent deployment.",
        metric: "Sub-4% Memory Fragmentation",
        badge: "Hardware Sizer"
    },
    {
        slug: "enterprise-rag-latency-simulator",
        title: "Enterprise RAG Latency Simulator",
        category: "RAG & Latency",
        description: "Benchmark end-to-end vector search latency, reranking overhead, and time-to-first-token (TTFT) across Milvus, Qdrant, and pgvector.",
        metric: "Sub-120ms Vector Retrieval",
        badge: "Vector Latency"
    },
    {
        slug: "dpdp-act-penalty-exposure-calculator",
        title: "DPDP Act 2023 Penalty Exposure Calculator",
        category: "Compliance & DPDP",
        description: "Evaluate enterprise statutory liability under India's Digital Personal Data Protection Act 2023 with Section 8(5) data residency safe harbors.",
        metric: "₹250 Cr Exposure Model",
        badge: "Statutory Safe Harbor"
    },
    {
        slug: "token-cost-arbitrage-calculator",
        title: "LLM Token Cost Arbitrage Calculator",
        category: "FinOps & Token Economics",
        description: "Model 3-year TCO comparison between commercial cloud APIs (Azure OpenAI, Anthropic Claude) versus sovereign private vLLM clusters.",
        metric: "62% - 74% Cost Reduction",
        badge: "FinOps Arbitrage"
    },
    {
        slug: "b2b-seo-roi-payback-model",
        title: "B2B AI Automation & SEO Payback Model",
        category: "FinOps & Token Economics",
        description: "Calculate payback period, net present value, and customer acquisition cost reduction for autonomous programmatic search engines.",
        metric: "3.4x Cash-Flow Multiplier",
        badge: "ROI Payback"
    },
    {
        slug: "enterprise-ai-roi-calculator",
        title: "Enterprise AI ROI Calculator",
        category: "FinOps & Token Economics",
        description: "Simulate multi-agent workforce replacement economics, annual operational expenditure reduction, and enterprise ROI across SAP workflows.",
        metric: "90-Day Cash-Flow SLA",
        badge: "Workforce ROI"
    },
    {
        slug: "multi-agent-latency-token-cost-estimator",
        title: "Multi-Agent Latency & Token Cost Estimator",
        category: "Architecture & Reliability",
        description: "Profile end-to-end multi-agent conversational routing latency, prompt expansion bloat, and recursive tool execution cost.",
        metric: "Sub-2.4s Complex Workflows",
        badge: "Agent Latency"
    },
    {
        slug: "agentic-architecture-grader",
        title: "Agentic Architecture Grader",
        category: "Architecture & Reliability",
        description: "Audit your agentic infrastructure against 10 enterprise resilience dimensions: AST sandboxing, Merkle audit trails, and circuit breakers.",
        metric: "Zero-Loop Determinism",
        badge: "Architecture Audit"
    },
    {
        slug: "multi-agent-token-leakage-simulator",
        title: "Multi-Agent Token Leakage Simulator",
        category: "FinOps & Token Economics",
        description: "Detect recursive conversation drift, infinite tool retry loops, and unbounded context window inflation in multi-agent swarms.",
        metric: "99.8% Leak Prevention",
        badge: "Context Leakage"
    },
    {
        slug: "dpdp-act-2023-audit-simulator",
        title: "DPDP Act 2023 Statutory Audit Simulator",
        category: "Compliance & DPDP",
        description: "Comprehensive Indian statutory data compliance simulation covering Data Fiduciary duties, Consent Managers, and cross-border restrictions.",
        metric: "100% Indian Data Residency",
        badge: "Statutory Audit"
    },
    {
        slug: "enterprise-gpu-finops-cost-calculator",
        title: "Enterprise GPU FinOps Cost Calculator",
        category: "GPU & Infrastructure",
        description: "Calculate electricity, server rack cooling, reservation commitments, and spot-instance arbitrage across Tier-IV Indian datacenters.",
        metric: "Sub-₹1.20 Per Inference",
        badge: "Datacenter FinOps"
    },
    {
        slug: "enterprise-vector-db-latency-benchmark",
        title: "Enterprise Vector DB Latency Benchmark",
        category: "RAG & Latency",
        description: "Compare HNSW index recall versus IVF-PQ latency curves across billion-vector datasets for enterprise private search systems.",
        metric: "99.4% Recall at 45ms",
        badge: "Vector Indexing"
    },
    {
        slug: "enterprise-llm-context-kv-cache-simulator",
        title: "Enterprise LLM Context KV-Cache Simulator",
        category: "GPU & Infrastructure",
        description: "Simulate PagedAttention virtual memory block allocation, prefix caching hit rates, and multi-tenant KV-cache retention in vLLM.",
        metric: "3.8x Throughput Density",
        badge: "KV-Cache Paging"
    },
    {
        slug: "enterprise-multi-agent-deadlock-circuit-breaker-visualizer",
        title: "Agent Deadlock & Circuit Breaker Visualizer",
        category: "Architecture & Reliability",
        description: "Visualize distributed lock contention, Byzantine message loss, and deterministic finite state machine (FSM) circuit-breaker rollbacks.",
        metric: "0.0% Unhandled Deadlocks",
        badge: "State Determinism"
    },
    {
        slug: "enterprise-voice-agent-latency-simulator",
        title: "Enterprise Voice Agent Latency Simulator",
        category: "RAG & Latency",
        description: "Measure full-duplex voice pipeline latency: Deepgram Nova-2 ASR, vLLM speculative decoding, and Cartesia Sonic TTS speech synthesis.",
        metric: "Sub-450ms Voice Response",
        badge: "Full-Duplex Voice"
    },
    {
        slug: "enterprise-graphrag-memory-benchmark",
        title: "Enterprise GraphRAG Memory Benchmark",
        category: "RAG & Latency",
        description: "Benchmark hybrid vector-plus-knowledge-graph traversal latency using Neo4j and Memgraph for complex enterprise multi-hop inference.",
        metric: "Sub-180ms Multi-Hop Graph",
        badge: "Knowledge Graph"
    },
    {
        slug: "enterprise-prompt-injection-firewall-simulator",
        title: "Enterprise Prompt Injection Firewall Simulator",
        category: "Compliance & DPDP",
        description: "Test adversarial jailbreak resistance, indirect prompt injection defense, and NeMo guardrail token interception in real time.",
        metric: "99.98% Adversarial Defense",
        badge: "Security Enclave"
    },
    {
        slug: "enterprise-model-routing-cost-arbitrage-simulator",
        title: "Model Routing & Cost Arbitrage Simulator",
        category: "FinOps & Token Economics",
        description: "Simulate cascade routing between small 8B fine-tuned SLMs and frontier 70B/405B models to slash blended inference token costs.",
        metric: "68% Token Savings",
        badge: "Intelligent Routing"
    }
]

const toolsFaqs = [
    {
        q: "What is the Elesium Enterprise AI Interactive Simulator Suite?",
        a: "It is an engineering-grade collection of interactive mathematical models, GPU infrastructure sizers, RAG latency estimators, and DPDP Act 2023 compliance calculators. Built with client-side computation engines, these tools allow Chief Technology Officers, AI Systems Architects, and procurement leads to stress-test unit economics, hardware sizing, and compliance exposure with zero vendor bias."
    },
    {
        q: "Are the GPU sizer and VRAM calculations based on real production hardware?",
        a: "Yes. The calculators utilize empirical memory formulas derived from NVIDIA H100, H200, and A100 Tensor Core GPUs, accounting for FP8/FP16 weights, KV-cache overhead per context token, activation memory, and vLLM PagedAttention virtual memory block allocation with under 4% fragmentation."
    },
    {
        q: "How does the DPDP Act 2023 Penalty Exposure Calculator quantify liability?",
        a: "The calculator models statutory penalties under Section 33 and the Schedule of the Indian Digital Personal Data Protection Act 2023, capping at ₹250 Crores per significant security failure. It evaluates Data Fiduciary risk across consent management, biometric authentication, cross-border data transfer, and sovereign Indian datacenter safe harbors."
    },
    {
        q: "Can these interactive tools be embedded into internal enterprise wikis?",
        a: "Yes. Every calculator supports clean, iframe-compatible embed mode with dedicated noindex embed endpoints, enabling engineering teams to embed live calculators directly into Confluence, Notion, or internal architecture portals."
    },
    {
        q: "How does Elesium translate simulator telemetry into production systems?",
        a: "Following simulation, Elesium deploys production-grade private VPC multi-agent clusters across Yotta, CtrlS, or AWS/Azure sovereign enclaves within a 14-day architecture sprint, backed by contractual SLAs and a 90-day cash-flow positive ROI guarantee."
    }
]

export default function ToolsHub() {
    const [selectedCategory, setSelectedCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const categories = ['All', 'GPU & Infrastructure', 'RAG & Latency', 'Compliance & DPDP', 'FinOps & Token Economics', 'Architecture & Reliability']

    const filteredTools = useMemo(() => {
        return TOOLS_LIST.filter(tool => {
            const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory
            const matchesSearch = searchQuery === '' || 
                tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.badge.toLowerCase().includes(searchQuery.toLowerCase())
            return matchesCat && matchesSearch
        })
    }, [selectedCategory, searchQuery])

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://elesium.online/tools/#collection',
                url: 'https://elesium.online/tools/',
                name: 'Enterprise AI Calculators & Architecture Simulators | Elesium',
                description: 'Interactive enterprise AI engineering simulators, GPU cluster sizers, RAG latency estimators, and DPDP Act compliance calculators by Elesium.',
                isPartOf: {
                    '@type': 'WebSite',
                    '@id': 'https://elesium.online/#website',
                    name: 'Elesium Enterprise AI',
                    url: 'https://elesium.online/'
                },
                about: {
                    '@type': 'Thing',
                    name: 'Enterprise AI Architecture & Infrastructure Engineering'
                },
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: TOOLS_LIST.length,
                    itemListElement: TOOLS_LIST.map((tool, idx) => ({
                        '@type': 'ListItem',
                        position: idx + 1,
                        name: tool.title,
                        url: `https://elesium.online/tools/${tool.slug}/`,
                        description: tool.description
                    }))
                }
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/tools/#breadcrumb',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: 'https://elesium.online/'
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        name: 'Tools & Simulators',
                        item: 'https://elesium.online/tools/'
                    }
                ]
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/tools/#faq',
                mainEntity: toolsFaqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.a
                    }
                }))
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Helmet>
                <title>Enterprise AI Calculators &amp; Architecture Simulators | Elesium</title>
                <meta name="description" content="Interactive enterprise AI engineering simulators, GPU cluster sizers, RAG latency estimators, and DPDP Act compliance calculators by Elesium." />
                <link rel="canonical" href="https://elesium.online/tools/" />
                <meta property="og:title" content="Enterprise AI Calculators & Architecture Simulators | Elesium" />
                <meta property="og:description" content="Interactive enterprise AI engineering simulators, GPU cluster sizers, RAG latency estimators, and DPDP Act compliance calculators by Elesium." />
                <meta property="og:url" content="https://elesium.online/tools/" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Enterprise AI Calculators & Architecture Simulators | Elesium" />
                <meta name="twitter:description" content="Interactive enterprise AI engineering simulators, GPU cluster sizers, RAG latency estimators, and DPDP Act compliance calculators by Elesium." />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className="relative isolate overflow-hidden pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-8" aria-label="Breadcrumb">
                        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-3 h-3 text-neutral-500" />
                        <span className="text-black dark:text-white">Tools &amp; Simulators</span>
                    </nav>

                    {/* Header */}
                    <div className="max-w-3xl mb-10">
                        <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 block mb-4">
                            Engineering Calculators
                        </span>
                        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mb-5">
                            AI Cost, Latency &amp; Sizing Calculators
                        </h1>
                        <p className="answer-capsule text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                            Interactive tools to estimate infrastructure costs, response times, server requirements, and compliance exposure.
                        </p>
                    </div>

                    {/* Filter Bar & Search */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 border-y border-neutral-200 dark:border-white/10 mb-10">
                        {/* Category Tabs */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap active:scale-[0.97] transition-all duration-300 ${
                                        selectedCategory === cat
                                            ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                                            : 'bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative min-w-[240px]">
                            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search simulators..."
                                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-black dark:text-white placeholder-neutral-500 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {filteredTools.map(tool => (
                            <Link
                                key={tool.slug}
                                to={`/tools/${tool.slug}/`}
                                className="group relative h-full flex flex-col justify-between p-6 rounded-[24px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 hover:border-black dark:hover:border-white/30 transition-all duration-300"
                            >
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-3">
                                        <span className="text-[11px] font-mono uppercase tracking-wider text-black dark:text-white bg-white dark:bg-black px-2.5 py-0.5 rounded-full border border-neutral-200 dark:border-white/10">
                                            {tool.badge}
                                        </span>
                                        <span className="text-xs text-neutral-500">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <h2 className="text-lg font-bold text-black dark:text-white mb-2">
                                        {tool.title}
                                    </h2>
                                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                                        {tool.description}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-neutral-200 dark:border-white/10 flex items-center justify-between text-xs">
                                    <span className="font-mono text-black dark:text-white font-semibold">
                                        {tool.metric}
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-black dark:text-white font-medium group-hover:translate-x-0.5 transition-transform">
                                        Launch &rarr;
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* FAQ Accordion Section */}
                    <div className="max-w-3xl mx-auto mb-12" id="faqs">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white text-center mb-8">
                            Common Questions
                        </h2>
                        <div className="space-y-4">
                            {toolsFaqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="border border-neutral-200 dark:border-white/10 rounded-[24px] overflow-hidden bg-neutral-50 dark:bg-neutral-950"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-medium text-sm sm:text-base text-black dark:text-white transition-colors"
                                    >
                                        <span>{faq.q}</span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-neutral-500 transition-transform duration-300 shrink-0 ${
                                                openFaq === idx ? 'rotate-180 text-black dark:text-white' : ''
                                            }`}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {openFaq === idx && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                                                className="accordion-panel overflow-hidden"
                                            >
                                                <div className="p-4 sm:p-5 pt-3 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
