import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { 
    ChevronDown, 
    ArrowRight, 
    MessageSquare, 
    CheckCircle2, 
    Server, 
    Lock,
    Zap,
    Scale
} from 'lucide-react'
import HeroSection from '../sections/Hero'
import ActiveSignals from '../sections/ActiveSignals'
import Solutions from '../sections/Solutions'
import { useWhatsApp } from '../../hooks/useWhatsApp'

interface FaqItem {
    q: string
    a: string
}

const homeFaqs: FaqItem[] = [
    {
        q: "How does Elesium architect sovereign enterprise AI systems?",
        a: "Elesium engineers deterministic multi-agent systems deployed directly inside client-controlled private VPCs (AWS, GCP, Azure, or on-premise Yotta Shakti and CtrlS tier-IV datacenter clusters in India). We build verifiable Python LangGraph state machines with strict Pydantic schemas, sub-200ms time-to-first-token (TTFT) execution, and compliance with India's Digital Personal Data Protection (DPDP) Act 2023 Section 8(5), backed by a contractual 90-day cash-flow ROI SLA."
    },
    {
        q: "How does Elesium guarantee sub-200ms latency for enterprise agent workflows?",
        a: "We deploy custom vLLM inference runtimes utilizing PagedAttention virtual memory paging and FP8 GEMM (General Matrix Multiply) microscaling kernels on dedicated NVIDIA H100/A100 clusters. By decoupling prefill from decode phases and maintaining warm prefix caching for enterprise system prompts, we achieve sub-200ms TTFT across SAP S/4HANA RFC queries, core banking ledger reconciliation, and supply chain dispatch pipelines."
    },
    {
        q: "How does Elesium ensure compliance with India's DPDP Act 2023?",
        a: "Under Section 8(5) of the DPDP Act 2023, Data Fiduciaries must erase personal data upon purpose fulfillment. Elesium enforces zero external data retention, hosting LLM inference entirely within client-owned sovereign private VPCs located in Mumbai, Bengaluru, or Delhi NCR. Zero client prompt bytes or telemetry are ever transmitted to third-party consumer LLM providers."
    },
    {
        q: "What is Elesium's 90-day contractual ROI SLA?",
        a: "Every enterprise engagement includes a legally binding SLA: we model the exact hours, downtime penalties, and operational friction eliminated across your SAP/Oracle or BFSI workflows. If the deployed multi-agent system does not generate an audited 3x-5x cash-flow return within 90 days of production go-live, our engineering fees are rebated proportionally."
    },
    {
        q: "What are the institutional investment tiers for deploying Elesium AI systems?",
        a: "Elesium maintains 3 transparent tiers: Tier 1 (Pilot Architecture Sprint, ₹1,50,000 - ₹3,50,000, 14-day delivery of a single-process deterministic agent); Tier 2 (Enterprise Multi-Agent Suite, ₹6,00,000 - ₹15,00,000, 30-45 day deployment of collaborative 3-agent triad with SAP/Oracle integration); and Tier 3 (Autonomous AI Engineering Pod, ₹4,50,000/month, dedicated pod of 3 AI engineers + 1 principal systems architect with continuous fine-tuning and 1-hour critical SLA)."
    }
]

export default function Home() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    return (
        <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 bg-white dark:bg-black text-gray-900 dark:text-white"
        >
            <Helmet>
                <title>Elesium | Enterprise AI & Multi-Agent Systems Engineering • Bengaluru</title>
                <meta
                    name="description"
                    content="Elesium engineers sovereign enterprise AI systems, autonomous agents, and private VPC infrastructure delivering audited 3x-5x ROI in 90 days."
                />
                <link rel="canonical" href="https://elesium.online/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Elesium | Enterprise AI & Multi-Agent Systems Engineering • Bengaluru" />
                <meta property="og:description" content="Elesium engineers sovereign enterprise AI systems, autonomous agents, and private VPC infrastructure delivering audited 3x-5x ROI in 90 days." />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta property="og:url" content="https://elesium.online/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_ai" />
                <meta name="twitter:title" content="Elesium | Enterprise AI & Multi-Agent Systems Engineering • Bengaluru" />
                <meta name="twitter:description" content="Elesium engineers sovereign enterprise AI systems, autonomous agents, and private VPC infrastructure delivering audited 3x-5x ROI in 90 days." />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
            </Helmet>

            <WhatsAppModal />

            <main id="main-content">
            {/* Hero Section */}
            <HeroSection />

            {/* Technical Architecture Overview */}
            <section className="py-16 md:py-20 border-b border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="p-8 sm:p-10 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                            <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-widest font-semibold">
                                Technical Architecture Standards
                            </span>
                            <span className="text-xs font-mono text-black dark:text-white font-semibold">
                                Sub-200ms TTFT &middot; DPDP Act Sec 8(5)
                            </span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white mb-4">
                            Sovereign Enterprise AI Systems Engineering
                        </h2>

                        <div className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed space-y-4 mb-8">
                            <p>
                                <strong className="text-black dark:text-white font-semibold">
                                    Elesium is an enterprise AI engineering firm headquartered in Bengaluru, India. We build deterministic multi-agent state graphs using Python FastAPI, LangGraph, and private VPC infrastructure, compliant with India&apos;s DPDP Act 2023.
                                </strong>
                            </p>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Our systems employ finite state machine (FSM) topologies, vLLM PagedAttention kernel optimization, and FP8 GEMM quantization on sovereign Yotta Shakti and CtrlS tier-IV datacenter clusters. Every client deployment is backed by an audited 90-day cash-flow ROI SLA.
                            </p>
                        </div>

                        {/* Empirical Hardware & Latency Specifications Matrix */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-neutral-200 dark:border-white/10">
                            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                                    <Zap className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Inference Latency</span>
                                </div>
                                <div className="text-xl font-bold font-mono text-black dark:text-white">&lt; 200ms TTFT</div>
                                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">FP8 GEMM + PagedAttention</div>
                            </div>
                            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                                    <Lock className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Data Residency</span>
                                </div>
                                <div className="text-xl font-bold font-mono text-black dark:text-white">100% Air-Gapped</div>
                                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">DPDP Act 2023 Sec 8(5)</div>
                            </div>
                            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                                    <Server className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Compute Sovereign</span>
                                </div>
                                <div className="text-xl font-bold font-mono text-black dark:text-white">Yotta / CtrlS</div>
                                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">Tier-IV Indian Datacenters</div>
                            </div>
                            <div className="p-4 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 mb-1">
                                    <Scale className="w-3.5 h-3.5 text-black dark:text-white" />
                                    <span>Contractual SLA</span>
                                </div>
                                <div className="text-xl font-bold font-mono text-black dark:text-white">90-Day ROI</div>
                                <div className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">Audited 3x-5x Cash Flow</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Signals Ledger */}
            <ActiveSignals />

            {/* Solutions Overview */}
            <Solutions />

            {/* Institutional Investment Tiers & Transparent Pricing */}
            <section className="py-20 md:py-24 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-mono text-neutral-600 dark:text-neutral-400 uppercase tracking-widest mb-4 block font-semibold">
                            Transparent Commercial Framework
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-black dark:text-white mb-4">
                            Institutional AI Engineering Investment Tiers
                        </h2>
                        <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                            Transparent pricing with zero vendor lock-in and contractual ROI guarantees.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        {/* Tier 1 */}
                        <div className="p-8 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Tier 01</span>
                                <h3 className="text-xl font-bold text-black dark:text-white mt-1 mb-2">Pilot Architecture Sprint</h3>
                                <div className="text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                    ₹1,50,000 <span className="text-sm font-normal text-neutral-500"> - ₹3,50,000</span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-6">14-Day Production Validation</p>
                                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Single-process deterministic LangGraph agent</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Python FastAPI endpoint on private cloud staging</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Sub-200ms latency baseline benchmark</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Formal 1-page feasibility &amp; ROI memorandum</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-3 px-4 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                            >
                                Initiate Tier 1 Sprint &rarr;
                            </button>
                        </div>

                        {/* Tier 2 (Highlighted) */}
                        <div className="p-8 rounded-xl border-2 border-black dark:border-white bg-white dark:bg-black flex flex-col justify-between relative">
                            <div className="mb-3">
                                <span className="inline-block px-2.5 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold font-mono rounded-md uppercase tracking-wider">
                                    Most Requested Deployment
                                </span>
                            </div>
                            <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Tier 02</span>
                                <h3 className="text-xl font-bold text-black dark:text-white mt-1 mb-2">Enterprise Multi-Agent Suite</h3>
                                <div className="text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                    ₹6,00,000 <span className="text-sm font-normal text-neutral-500"> - ₹15,00,000</span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-6">30-45 Day Full Implementation</p>
                                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Collaborative 3-agent triad with state persistence</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Direct SAP S/4HANA, Oracle, or Finacle integration</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Zero-data-retention air-gapped VPC architecture</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Contractual 90-day 3x-5x cash-flow ROI guarantee</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-3.5 px-4 rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                            >
                                Deploy Multi-Agent Suite &rarr;
                            </button>
                        </div>

                        {/* Tier 3 */}
                        <div className="p-8 rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                            <div>
                                <span className="text-xs font-mono uppercase tracking-wider text-neutral-600 dark:text-neutral-400">Tier 03</span>
                                <h3 className="text-xl font-bold text-black dark:text-white mt-1 mb-2">Autonomous AI Engineering Pod</h3>
                                <div className="text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                    ₹4,50,000 <span className="text-sm font-normal text-neutral-500">/ month</span>
                                </div>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 font-mono mb-6">Continuous Dedicated Velocity</p>
                                <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Dedicated pod: 3 AI engineers + 1 principal architect</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Continuous model fine-tuning &amp; vLLM optimization</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>1-hour critical production incident SLA</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                        <span>Dedicated WhatsApp &amp; Slack engineering bridge</span>
                                    </li>
                                </ul>
                            </div>
                            <button
                                onClick={openWhatsApp}
                                className="w-full py-3 px-4 rounded-lg border border-neutral-200 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                            >
                                Retain Engineering Pod &rarr;
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Institutional FAQ Section */}
            <section className="py-20 md:py-24 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                <div className="max-w-4xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <span className="text-xs font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-semibold mb-2 block">
                            Direct Architecture Answers
                        </span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white">
                            Frequently Asked Architecture &amp; Procurement Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {homeFaqs.map((faq, idx) => (
                            <div 
                                key={idx}
                                className="border border-neutral-200 dark:border-white/10 rounded-xl overflow-hidden bg-white dark:bg-black"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                                >
                                    <span>{faq.q}</span>
                                    <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence initial={false}>
                                    {openFaq === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                                            className="accordion-panel overflow-hidden"
                                        >
                                            <p className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10 pt-3">
                                                {faq.a}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Direct Principal Systems Architect WhatsApp Pairing Conversion Bar */}
            <section className="py-16 md:py-20 bg-black text-white border-t border-white/10 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-6 text-center relative z-10 space-y-6">
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest block">
                        Direct Principal Systems Architect Pairing
                    </span>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
                        Connect Directly with Our Lead Architect via WhatsApp
                    </h2>

                    <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                        Skip vendor sales decks. Speak directly with Chaman Shah to evaluate your SAP/Oracle ledgers, latency requirements, and DPDP Act compliance boundaries in 30 minutes.
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-12 px-8 rounded-lg bg-white text-black hover:bg-neutral-200 font-bold text-sm active:scale-[0.97] transition-all flex items-center justify-center gap-2 group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current text-black" />
                            <span>Initiate WhatsApp Audit (+91 83173 29312)</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-12 px-6 rounded-lg border border-white/20 hover:bg-white/10 text-white font-medium text-sm active:scale-[0.97] transition-all flex items-center justify-center gap-2"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>
            </main>
        </motion.div>
    )
}
