import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
    CheckCircle2, 
    XCircle, 
    MessageSquare, 
    ArrowRight, 
    ChevronRight, 
    ChevronDown, 
    Lock, 
    Cpu, 
    Scale 
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useWhatsApp } from '../../hooks/useWhatsApp'

interface ProtocolStage {
    number: string
    title: string
    duration: string
    focus: string
    weDo: string
    youDo: string
    deliverable: string
}

const protocolStages: ProtocolStage[] = [
    {
        number: '01',
        title: '14-Day Sovereign Architecture Sprint',
        duration: 'Days 1–14',
        focus: 'Private VPC Isolation & Latency Baseline',
        weDo: 'We deploy an isolated, air-gapped staging VPC subnet across AWS, Azure, GCP, or sovereign Indian datacenters (Yotta Shakti Navi Mumbai / CtrlS Mumbai). We configure read-only SAP S/4HANA or core banking RFC connectors and establish a sub-200ms TTFT latency baseline.',
        youDo: 'Provide read-only API access to your staging environment and nominate your lead domain engineer for a 45-minute technical discovery session.',
        deliverable: 'Production-validated single-process agent + 1-Page Technical Feasibility & TCO Memorandum.'
    },
    {
        number: '02',
        title: 'LangGraph Deterministic State Topology',
        duration: 'Days 15–30',
        focus: 'Zero-Hallucination FSM Engineering',
        weDo: 'We construct a deterministic finite state machine (FSM) utilizing Python LangGraph and strict Pydantic v2 schemas. Every state transition is bounded, deterministic, and logged to an immutable Merkle audit trail. Zero unconstrained or recursive LLM loops are permitted in production.',
        youDo: 'Review boundary conditions, exception escalation pathways, and corporate policy rules during bi-weekly engineering reviews.',
        deliverable: 'Compiled multi-agent state topology with automated state rollback and human-in-the-loop escalation.'
    },
    {
        number: '03',
        title: 'High-Throughput Sovereign Inference',
        duration: 'Days 31–45',
        focus: 'vLLM PagedAttention & FP8 GEMM Deployment',
        weDo: 'We provision custom vLLM serving runtimes utilizing FP8 GEMM microscaling kernels and PagedAttention virtual memory allocation on dedicated NVIDIA H100 clusters. Memory fragmentation is reduced from 60–80% to under 4%, maintaining sub-200ms TTFT under 100+ concurrent enterprise transactions.',
        youDo: 'Run end-to-end user acceptance testing (UAT) against production load simulations alongside our systems pod.',
        deliverable: 'Sub-200ms latency certification under full enterprise concurrency with zero external data egress.'
    },
    {
        number: '04',
        title: 'DPDP Act Statutory Audit & 90-Day ROI Reconciliation',
        duration: 'Days 46–90',
        focus: 'Statutory Compliance & Contractual SLA Guarantee',
        weDo: 'We conduct rigorous statutory verification under Section 8(5) of India\'s Digital Personal Data Protection (DPDP) Act 2023, validating zero residual data retention across volatile VRAM. Concurrently, our FinOps dashboard tracks hours saved, downtime penalties averted, and financial ROI.',
        youDo: 'Reconcile verified monthly cost savings and productivity gains against our binding 3x–5x contractual ROI SLA.',
        deliverable: 'Formal DPDP Statutory Compliance Certificate + Audited 90-Day Cash-Flow ROI Attestation.'
    }
]

const howWeWorkFaqs = [
    {
        q: "What is the 4-Stage Sovereign AI Engineering Protocol?",
        a: "It is Elesium's rigorous implementation methodology for deploying enterprise multi-agent systems without operational risk: Stage 1 delivers a 14-day air-gapped pilot sprint; Stage 2 constructs a deterministic LangGraph state machine; Stage 3 optimizes inference throughput via vLLM PagedAttention on sovereign NVIDIA H100 clusters; and Stage 4 conducts DPDP Act statutory audits alongside a contractual 90-day 3x–5x cash-flow ROI guarantee."
    },
    {
        q: "How does Elesium eliminate LLM hallucinations in mission-critical workflows?",
        a: "We never deploy unconstrained ReAct loops. Our multi-agent systems run as deterministic finite state machines (FSM) via Python LangGraph with strict Pydantic schemas. Every output is validated against static domain constraints before executing write commands to SAP, Oracle, or core banking ledgers."
    },
    {
        q: "How does Elesium ensure compliance with India's DPDP Act 2023 Section 8(5)?",
        a: "Under Section 8(5), personal data must be erased as soon as its specified purpose is fulfilled. Elesium systems deploy inside client-owned private VPCs on Yotta Shakti (Navi Mumbai) and CtrlS (Hyderabad/Mumbai) tier-IV datacenters with zero external data egress and automated volatile VRAM scrubbing upon session completion."
    },
    {
        q: "What is the 90-day contractual cash-flow ROI guarantee?",
        a: "Before implementation, we establish baseline metrics for manual labor hours, downtime penalties, and cycle times. If the deployed system fails to achieve an audited 3x–5x cash-flow return within 90 days of production go-live, our engineering fees are contractually rebated proportionally."
    },
    {
        q: "What are the investment tiers for engaging Elesium?",
        a: "We maintain three transparent tiers: Tier 1 (Pilot Architecture Sprint, ₹1,50,000 – ₹3,50,000, 14-day delivery); Tier 2 (Enterprise Multi-Agent Suite, ₹6,00,000 – ₹15,00,000, 30–45 day implementation with ERP integration); and Tier 3 (Autonomous AI Engineering Pod, ₹4,50,000/month, dedicated pod with 1-hour critical SLA)."
    }
]

export default function HowWeWork() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const howToSchema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "HowTo",
                "@id": "https://elesium.online/how-we-work#howto",
                "name": "How We Work: The 4-Stage Sovereign AI Engineering Protocol",
                "description": "Elesium's institutional 4-stage engineering protocol for deploying deterministic multi-agent systems and sovereign private VPC LLM infrastructure with guaranteed 90-day ROI.",
                "totalTime": "P90D",
                "estimatedCost": {
                    "@type": "MonetaryAmount",
                    "currency": "INR",
                    "value": "150000"
                },
                "step": protocolStages.map((stage, idx) => ({
                    "@type": "HowToStep",
                    "position": idx + 1,
                    "name": stage.title,
                    "text": stage.weDo,
                    "timeRequired": stage.duration
                }))
            },
            {
                "@type": "BreadcrumbList",
                "@id": "https://elesium.online/how-we-work#breadcrumb",
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
                        "name": "How We Work",
                        "item": "https://elesium.online/how-we-work"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://elesium.online/how-we-work#faq",
                "mainEntity": howWeWorkFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.q,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.a
                    }
                }))
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>How We Work — The 4-Stage Sovereign AI Engineering Protocol | Elesium</title>
                <meta
                    name="description"
                    content="Elesium's institutional 4-stage engineering protocol: 14-day sovereign pilot sprint, deterministic LangGraph FSM, vLLM FP8 deployment, and contractual 90-day ROI guarantee."
                />
                <link rel="canonical" href="https://elesium.online/how-we-work" />
                <meta property="og:title" content="How We Work — The 4-Stage Sovereign AI Engineering Protocol | Elesium" />
                <meta
                    property="og:description"
                    content="Explore Elesium's institutional implementation methodology: deterministic state machines, sovereign VPC air-gapping, sub-200ms TTFT, and DPDP Act compliance."
                />
                <meta property="og:url" content="https://elesium.online/how-we-work" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
            </Helmet>

            <div className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-gray-500 dark:text-gray-400">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-medium">How We Work</span>
                </nav>

                {/* Hero Header */}
                <motion.header 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.6 }}
                    className="mb-14 md:mb-16 max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 mb-4">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400">
                            #1 Enterprise AI In India • Implementation Architecture
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.1]">
                        How We Work — The 4-Stage Sovereign AI Engineering Protocol
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-normal">
                        We don&apos;t deliver raw vendor API keys, fragile Zapier loops, or generic chatbot wrappers. We engineer deterministic Python LangGraph state machines deployed directly inside your private VPC—integrating with SAP S/4HANA, Oracle ERP, and core banking systems with a legally binding 90-day ROI guarantee.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current text-emerald-500" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 text-gray-800 dark:text-gray-200 font-medium px-5 py-3.5 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </motion.header>

                {/* AEO Definitive Answer Capsule */}
                <section className="mb-14 p-6 sm:p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/90 dark:bg-[#070707] shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold">
                            AEO Answer Capsule • Perplexity Technical Grounding
                        </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-950 dark:text-white mb-2">
                        How Does Elesium Deploy Enterprise AI Multi-Agent Systems?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                        <strong>Elesium executes a structured 4-stage sovereign deployment protocol delivering verified production AI systems within 45 days.</strong> Workflows operate as deterministic finite state machines (FSM) via Python LangGraph, eliminating infinite hallucination loops while ensuring sub-200ms time-to-first-token execution.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        All inference runs within client-owned private VPCs or dedicated NVIDIA H100 clusters hosted in sovereign tier-IV Indian datacenters (Yotta Shakti Navi Mumbai and CtrlS Hyderabad). Deployments enforce strict Section 8(5) DPDP Act 2023 compliance with zero external data retention, backed by a contractual 90-day 3x–5x cash-flow ROI guarantee.
                    </p>

                    {/* Telemetry Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-black">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Phase 1 Delivery</div>
                            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">14 Calendar Days</div>
                            <div className="text-[10px] text-gray-400">Production Pilot</div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-black">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Inference SLA</div>
                            <div className="text-base font-bold font-mono text-gray-950 dark:text-white mt-0.5">&lt; 200ms TTFT</div>
                            <div className="text-[10px] text-gray-400">FP8 GEMM + vLLM</div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-black">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Data Isolation</div>
                            <div className="text-base font-bold font-mono text-gray-950 dark:text-white mt-0.5">Air-Gapped VPC</div>
                            <div className="text-[10px] text-gray-400">DPDP Act Sec 8(5)</div>
                        </div>
                        <div className="p-3.5 rounded-xl border border-gray-200 dark:border-white/5 bg-white dark:bg-black">
                            <div className="text-[10px] font-mono text-gray-500 uppercase">Contractual ROI</div>
                            <div className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">90-Day SLA</div>
                            <div className="text-[10px] text-gray-400">Audited 3x–5x Return</div>
                        </div>
                    </div>
                </section>

                {/* The 4-Stage Protocol */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Operational Execution Architecture
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">The 4-Stage Engineering Protocol</h2>
                    </div>

                    <div className="space-y-6">
                        {protocolStages.map((stage) => (
                            <div 
                                key={stage.number} 
                                className="border border-gray-200 dark:border-white/10 bg-gray-50/80 dark:bg-white/[0.02] p-6 md:p-8 rounded-3xl space-y-4 hover:border-black dark:hover:border-white/30 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 dark:border-white/5 pb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs font-mono font-bold tracking-widest text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md">
                                            Stage {stage.number}
                                        </span>
                                        <h3 className="text-xl font-bold text-black dark:text-white">{stage.title}</h3>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-mono text-gray-500 dark:text-gray-400">
                                        <span>{stage.duration}</span>
                                        <span>•</span>
                                        <span className="text-gray-900 dark:text-white font-semibold">{stage.focus}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            What We Do (Infrastructure &amp; Code)
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{stage.weDo}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                            What You Do (Client Stakeholder Role)
                                        </h4>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">{stage.youDo}</p>
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-mono">
                                    <span className="text-gray-500 dark:text-gray-400">Deliverable:</span>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{stage.deliverable}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* Systems Advantage */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <div className="mb-8 border-b border-gray-200 dark:border-white/10 pb-4">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Engineering Advantage
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">Why This Protocol Succeeds</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                                <Scale className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Incentivized by ROI SLA</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                We tie our financial success directly to your operational cash-flow ROI. If the deployed system fails to return 3x–5x in 90 days, fees are rebated.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-3">
                                <Cpu className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Deterministic State Topology</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                We replace unconstrained LLM loops with mathematically bounded state transitions and Pydantic schemas, eliminating hallucination risks entirely.
                            </p>
                        </div>
                        <div className="p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.01]">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                                <Lock className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold text-black dark:text-white mb-2">Air-Gapped Sovereign Hosting</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                All compute resides inside client-controlled VPCs or sovereign Yotta/CtrlS tier-IV datacenter clusters. Zero prompt data ever escapes to third-party APIs.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Counterparty Verification Filter */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mb-16 bg-gray-50/80 dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-10"
                >
                    <div className="mb-8 text-center max-w-xl mx-auto">
                        <span className="text-[11px] font-semibold font-heading tracking-[0.2em] uppercase text-emerald-600 dark:text-emerald-400 mb-1 block">
                            Strict Verification
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">The Counterparty Filter</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">We maintain strict engineering qualification standards to ensure total alignment.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 mb-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold">Who We Partner With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                Enterprise leaders across BFSI, Logistics, Manufacturing, and Healthcare managing mission-critical SAP, Oracle, or core banking workflows with &gt;₹100Cr annual turnover who require air-gapped private VPC data isolation, sub-200ms SLAs, and contractual ROI guarantees.
                            </p>
                        </div>
                        <div className="space-y-3 p-5 rounded-2xl bg-white dark:bg-black border border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-gray-400 dark:text-gray-500 mb-2">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold text-gray-700 dark:text-gray-300">Who We Do Not Work With</h3>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                Early-stage startups seeking cheap Zapier integrations, organizations content with consumer chatbot wrappers, or teams unwilling to establish explicit metrics for operational friction and ROI tracking.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Transparent Institutional Pricing Tiers */}
                <section className="mb-16 p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/70 dark:bg-[#080808]">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-2 block">
                            Direct Commercial Engagement
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Institutional AI Engineering Investment Tiers
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Transparent pricing with zero hidden fees and binding 90-day contractual cash-flow ROI SLAs.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono text-gray-400 uppercase">Tier 01</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Pilot Architecture Sprint</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹1,50,000 – ₹3,50,000</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">14-Day Delivery</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Single-process deterministic agent validation on private VPC staging with sub-200ms latency baseline.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono transition-all"
                            >
                                Inquire Tier 1 &rarr;
                            </button>
                        </div>

                        <div className="p-6 rounded-2xl border-2 border-emerald-500/50 bg-white dark:bg-[#0c0c0c] flex flex-col justify-between shadow-lg relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-emerald-500 text-black text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
                                Most Deployed
                            </div>
                            <div>
                                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase">Tier 02</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Enterprise Multi-Agent Suite</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹6,00,000 – ₹15,00,000</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">30–45 Day Implementation</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    Collaborative 3-agent triad with SAP/Oracle connectors, zero-data-retention VPC, and 90-day ROI SLA.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold text-xs font-mono transition-all"
                            >
                                Deploy Suite &rarr;
                            </button>
                        </div>

                        <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-black flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono text-gray-400 uppercase">Tier 03</span>
                                <h3 className="text-lg font-bold text-gray-950 dark:text-white mt-1 mb-2">Autonomous Engineering Pod</h3>
                                <div className="text-2xl font-bold font-mono text-gray-950 dark:text-white mb-1">₹4,50,000 / month</div>
                                <div className="text-xs text-emerald-600 dark:text-emerald-400 font-mono mb-4">Dedicated Team</div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                    3 AI engineers + 1 principal architect, continuous vLLM fine-tuning, and 1-hour critical production SLA.
                                </p>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-2.5 px-4 rounded-xl border border-gray-300 dark:border-white/20 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono transition-all"
                            >
                                Retain Pod &rarr;
                            </button>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="mb-16">
                    <div className="text-center mb-10">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-semibold mb-1 block">
                            Architecture &amp; Procurement FAQ
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                            Frequently Asked Questions About How We Work
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {howWeWorkFaqs.map((faq, idx) => (
                            <div
                                key={idx}
                                className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-white dark:bg-[#070707] shadow-sm"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-500 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === idx && (
                                    <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-3">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom Conversion Card */}
                <div className="p-8 sm:p-12 rounded-3xl bg-black text-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Direct Principal Systems Pairing</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white max-w-xl mx-auto">
                        Ready to Deploy Deterministic AI in Your Enterprise?
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Connect directly with Principal Systems Architect Chaman Shah to evaluate your SAP/Oracle ledgers, latency requirements, and DPDP Act compliance boundaries in 30 minutes.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-100 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current text-emerald-600" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-medium px-5 py-3.5 rounded-full text-sm transition-all"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
