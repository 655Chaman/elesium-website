import { useState } from 'react'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { ChevronDown, CheckCircle2, ArrowUpRight, Terminal } from 'lucide-react'
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
        q: 'How does Elesium keep company data private?',
        a: 'Every system runs inside your own private cloud (AWS, Azure, Google Cloud) or on your on-premise servers. Customer records and internal documents never leave your network or go to external consumer AI services.',
    },
    {
        q: 'How quickly can an initial workflow go live?',
        a: 'A focused pilot for a single workflow is built and tested in your staging environment within 14 days, so your team can measure speed and accuracy before expanding.',
    },
    {
        q: 'What systems can you connect with?',
        a: 'We integrate directly with SAP, Oracle, core banking systems, PostgreSQL, internal APIs, spreadsheets, and document pipelines using structured validation checks before any record is updated.',
    },
    {
        q: 'How does the 90-day guarantee work?',
        a: 'Before building, we agree on clear baseline numbers - hours saved, error rates, or turnaround time. If the production system fails to deliver the agreed financial return within 90 days of launch, our fees are rebated.',
    },
    {
        q: 'What do typical engagements cost?',
        a: 'Teams typically start with a 14-day Pilot Sprint (₹1.5L-₹3.5L), move to a Full System rollout (₹6L-₹15L), or retain a dedicated engineering team (₹4.5L/month).',
    },
]

export default function Home() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(0)

    const homeSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Service',
                '@id': 'https://elesium.online/ai/#service',
                name: 'Enterprise AI & Automation Systems Engineering',
                serviceType: 'Private VPC AI Automation & Multi-Agent Engineering',
                url: 'https://elesium.online/ai/',
                description:
                    'Private AI and automation software built inside your cloud or on-premise servers, eliminating manual bottlenecks across finance, ERP, and operations with a 90-day ROI guarantee.',
                provider: {
                    '@id': 'https://elesium.online/#organization',
                },
                areaServed: ['India', 'United States', 'United Kingdom', 'United Arab Emirates'],
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/ai/#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'Enterprise AI & Automation', item: 'https://elesium.online/ai/' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/ai/#faq',
                mainEntity: homeFaqs.map((faq) => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: {
                        '@type': 'Answer',
                        text: faq.a,
                    },
                })),
            },
        ],
    }

    return (
        <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="relative z-10 bg-white dark:bg-black text-gray-900 dark:text-white"
        >
            <Helmet>
                <title>Elesium | AI &amp; Automation Systems for Enterprise Teams</title>
                <meta
                    name="description"
                    content="Elesium builds private AI and automation software inside your cloud or on-premise servers, helping enterprise teams eliminate manual work with a clear 90-day return."
                />
                <link rel="canonical" href="https://elesium.online/ai/" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Elesium | AI & Automation Systems for Enterprise Teams" />
                <meta
                    property="og:description"
                    content="Private AI and automation software running inside your infrastructure with a 14-day pilot and 90-day ROI guarantee."
                />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <meta property="og:url" content="https://elesium.online/ai/" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@elesium_online" />
                <meta name="twitter:title" content="Elesium | AI & Automation Systems for Enterprise Teams" />
                <meta
                    name="twitter:description"
                    content="Private AI and automation software running inside your infrastructure with a 14-day pilot and 90-day ROI guarantee."
                />
                <meta name="twitter:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(homeSchema)}</script>
            </Helmet>

            <WhatsAppModal />

            <main id="main-content">
                <HeroSection />

                <ActiveSignals />

                <Solutions />

                {/* Clear Pricing Tiers */}
                <section className="py-20 md:py-24 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <span className="text-[11px] font-mono text-neutral-500 uppercase tracking-[0.22em] mb-3 block">
                                Pricing
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black dark:text-white mb-4">
                                Straightforward engagement options
                            </h2>
                            <p className="text-base text-neutral-600 dark:text-neutral-400">
                                Fixed scope, full code ownership, and no long-term vendor lock-in.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
                            {/* Option 1 */}
                            <div className="p-8 rounded-[32px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                                        Option 01
                                    </span>
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                        Pilot Sprint
                                    </h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                        ₹1.5L <span className="text-sm font-normal text-neutral-500">– ₹3.5L</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-mono mb-6">Delivered in 14 days</p>
                                    <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Working automation for one high-impact workflow</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Deployed inside your staging environment</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Live speed and accuracy benchmark</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Clear rollout &amp; savings forecast</span>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    type="button"
                                    onClick={openWhatsApp}
                                    className="w-full py-3.5 px-6 rounded-full border border-neutral-200 dark:border-white/15 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                                >
                                    Start Pilot Sprint &rarr;
                                </button>
                            </div>

                            {/* Option 2 (Highlighted) */}
                            <div className="p-8 rounded-[32px] border-2 border-black dark:border-white bg-white dark:bg-black flex flex-col justify-between relative">
                                <div>
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-neutral-500">
                                            Option 02
                                        </span>
                                        <span className="inline-block px-3 py-0.5 bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold font-mono rounded-full uppercase tracking-wider">
                                            Recommended
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                        Full System Build
                                    </h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                        ₹6L <span className="text-sm font-normal text-neutral-500">– ₹15L</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-mono mb-6">Delivered in 30–45 days</p>
                                    <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>End-to-end automation with approval checkpoints</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Direct integration with SAP, Oracle, or core ledgers</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>100% private hosting with zero outside data sharing</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Backed by our 90-day return guarantee</span>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    type="button"
                                    onClick={openWhatsApp}
                                    className="w-full py-3.5 px-6 rounded-full bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                                >
                                    Scope Full System &rarr;
                                </button>
                            </div>

                            {/* Option 3 */}
                            <div className="p-8 rounded-[32px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col justify-between">
                                <div>
                                    <span className="text-xs font-mono uppercase tracking-wider text-neutral-500 block mb-2">
                                        Option 03
                                    </span>
                                    <h3 className="text-xl font-bold text-black dark:text-white mb-2">
                                        Dedicated Engineering Team
                                    </h3>
                                    <div className="text-2xl sm:text-3xl font-bold text-black dark:text-white font-mono mb-1">
                                        ₹4.5L <span className="text-sm font-normal text-neutral-500">/ month</span>
                                    </div>
                                    <p className="text-xs text-neutral-500 font-mono mb-6">Ongoing build &amp; support</p>
                                    <ul className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400 mb-8">
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Dedicated pod of engineers and a lead architect</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Continuous improvements and new automations</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>1-hour critical support response</span>
                                        </li>
                                        <li className="flex items-start gap-2.5">
                                            <CheckCircle2 className="w-4 h-4 text-black dark:text-white shrink-0 mt-0.5" />
                                            <span>Direct WhatsApp &amp; Slack engineering channel</span>
                                        </li>
                                    </ul>
                                </div>
                                <button
                                    type="button"
                                    onClick={openWhatsApp}
                                    className="w-full py-3.5 px-6 rounded-full border border-neutral-200 dark:border-white/15 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black font-semibold text-xs font-mono active:scale-[0.97] transition-all"
                                >
                                    Discuss Retainer &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reproducible Open-Source Evidence */}
                <section className="py-14 border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-black">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="p-6 sm:p-8 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                            <div className="space-y-2 max-w-2xl">
                                <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-500">
                                    <Terminal className="w-3.5 h-3.5" />
                                    <span>Reproducible Open-Source Evidence</span>
                                </div>
                                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
                                    Auditable Benchmarks, Compliance Harnesses &amp; Weights
                                </h2>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                    Inspect our public 8x NVIDIA H100 FP8 inference telemetry, <span className="font-mono text-black dark:text-white">DPDP_2023_Compliance_Bench</span> verification suite, and <span className="font-mono text-black dark:text-white">Elesium-Indic-Sovereign-70B-FP8</span> model evaluations.
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 shrink-0">
                                <a
                                    href="https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black text-xs font-semibold hover:opacity-90 transition"
                                >
                                    <span>GitHub Benchmark Suite</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                                <a
                                    href="/docs/benchmarks/"
                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full border border-neutral-200 dark:border-white/15 text-black dark:text-white text-xs font-semibold hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Docs Benchmarks</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Plain-English FAQ */}
                <section className="py-20 md:py-24 border-t border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                    <div className="max-w-3xl mx-auto px-6">
                        <div className="text-center mb-12">
                            <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 mb-2 block">
                                Common Questions
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-black dark:text-white">
                                How teams work with us
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {homeFaqs.map((faq, idx) => {
                                const isOpen = openFaq === idx
                                return (
                                    <div
                                        key={faq.q}
                                        className="border border-neutral-200 dark:border-white/10 rounded-[24px] overflow-hidden bg-white dark:bg-black"
                                    >
                                        <h3 className="m-0">
                                            <button
                                                type="button"
                                                aria-expanded={isOpen}
                                                aria-controls={`home-faq-panel-${idx}`}
                                                onClick={() => setOpenFaq(isOpen ? null : idx)}
                                                className="w-full min-h-[44px] flex items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-semibold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                                            >
                                                <span>{faq.q}</span>
                                                <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        </h3>
                                        <div
                                            id={`home-faq-panel-${idx}`}
                                            aria-hidden={!isOpen}
                                            className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                            }`}
                                        >
                                            <div className="overflow-hidden">
                                                <p className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10 pt-3">
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>
            </main>
        </motion.div>
    )
}
