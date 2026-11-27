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
    Scale,
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
        title: 'Private Staging Pilot',
        duration: 'Days 1–14',
        focus: 'Setup & Baseline',
        weDo: 'We set up a private environment inside your cloud (AWS, Azure, GCP, or local servers), connect read-only access to your staging ERP or database, and build a working first version.',
        youDo: 'Share staging API access and assign one technical lead for a 45-minute scoping session.',
        deliverable: 'Working single-workflow pilot + feasibility summary.',
    },
    {
        number: '02',
        title: 'Validation & Guardrails',
        duration: 'Days 15–30',
        focus: 'Predictable Behavior',
        weDo: 'We add strict validation rules around every step so data is checked before anything is written to your core systems, complete with clear logs and human review points.',
        youDo: 'Review edge cases and approval rules with us during brief weekly check-ins.',
        deliverable: 'Verified multi-step workflow with rollback and audit logs.',
    },
    {
        number: '03',
        title: 'Performance & Production Launch',
        duration: 'Days 31–45',
        focus: 'Scale & Privacy',
        weDo: 'We tune response times and deploy inside your production environment with zero external data sharing and full support under concurrent team usage.',
        youDo: 'Run user acceptance testing alongside our engineering team before going live.',
        deliverable: 'Production rollout inside your private infrastructure.',
    },
    {
        number: '04',
        title: 'Privacy Audit & 90-Day Review',
        duration: 'Days 46–90',
        focus: 'Measured Return',
        weDo: 'We verify data retention compliance under DPDP Act guidelines and track time saved, error reduction, and cost impact against your starting baseline.',
        youDo: 'Review monthly savings reports against the agreed 90-day return target.',
        deliverable: 'Privacy compliance summary + 90-day ROI report.',
    },
]

const howWeWorkFaqs = [
    {
        q: 'How long does it take to see a working system?',
        a: 'You get a working pilot on your own staging data in 14 days, followed by full production rollout across Days 15–45.',
    },
    {
        q: 'How do you prevent errors when connecting to SAP, Oracle, or banking systems?',
        a: 'Every action passes through strict schema and policy validation checks before updating any record. High-risk exceptions route automatically to human approval.',
    },
    {
        q: 'Where does our data live?',
        a: 'Inside your own private cloud or on-premise servers. Zero customer data or internal prompts are sent to public consumer AI services.',
    },
    {
        q: 'How does the 90-day guarantee work?',
        a: 'We measure baseline hours and costs before rollout. If the system fails to deliver the agreed return within 90 days of launch, our fees are rebated.',
    },
]

export default function HowWeWork() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const howToSchema = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'HowTo',
                '@id': 'https://elesium.online/how-we-work/#howto',
                name: 'How We Work: 4-Stage Private AI Implementation',
                description:
                    'Elesium delivers private AI and automation software across 4 structured stages - from a 14-day pilot to full production inside your infrastructure.',
                totalTime: 'P90D',
                estimatedCost: {
                    '@type': 'MonetaryAmount',
                    currency: 'INR',
                    value: '150000',
                },
                step: protocolStages.map((stage, idx) => ({
                    '@type': 'HowToStep',
                    position: idx + 1,
                    name: stage.title,
                    text: stage.weDo,
                    timeRequired: stage.duration,
                })),
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/how-we-work/#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'How We Work', item: 'https://elesium.online/how-we-work/' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/how-we-work/#faq',
                mainEntity: howWeWorkFaqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
            },
        ],
    }

    return (
        <main id="main-content" className="min-h-screen bg-white dark:bg-black text-black dark:text-white pt-24 pb-20 transition-colors duration-300">
            <WhatsAppModal />
            <Helmet>
                <title>How We Work | Private AI Engineering | Elesium</title>
                <meta
                    name="description"
                    content="See how Elesium takes enterprise AI workflows from a 14-day pilot to full private production in 45 days."
                />
                <link rel="canonical" href="https://elesium.online/how-we-work/" />
                <meta property="og:title" content="How We Work | Private AI Engineering | Elesium" />
                <meta
                    property="og:description"
                    content="See how Elesium takes enterprise AI workflows from a 14-day pilot to full private production in 45 days."
                />
                <meta property="og:url" content="https://elesium.online/how-we-work/" />
                <meta property="og:type" content="website" />
                <meta property="og:image" content="https://elesium.online/og-image.png" />
                <script type="application/ld+json">{JSON.stringify(howToSchema)}</script>
            </Helmet>

            <div className="max-w-5xl mx-auto px-5 md:px-8">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <Link to="/ai/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black dark:text-white font-medium">How We Work</span>
                </nav>

                {/* Hero */}
                <motion.header
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="mb-14 max-w-3xl"
                >
                    <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-500 block mb-4">
                        Delivery Process
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-black dark:text-white mb-6 leading-[1.12]">
                        From scoping to production in four clear stages
                    </h1>

                    <p className="answer-capsule text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-8">
                        We build and test automation directly inside your own private cloud or servers, connecting cleanly to your existing ERP and databases with measurable 90-day results.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3.5 rounded-full text-sm active:scale-[0.97] transition-all group"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat on WhatsApp</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/15 hover:bg-neutral-100 dark:hover:bg-white/10 text-black dark:text-white font-medium px-6 py-3.5 rounded-full text-sm active:scale-[0.97] transition-all"
                        >
                            <span>Join ele-in Waitlist &rarr;</span>
                        </Link>
                    </div>
                </motion.header>

                {/* 4 Stages */}
                <section className="mb-16 space-y-5">
                    {protocolStages.map(stage => (
                        <div
                            key={stage.number}
                            className="border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950 p-6 md:p-8 rounded-[32px] space-y-5"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 dark:border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-mono font-bold tracking-widest text-black dark:text-white uppercase bg-white dark:bg-black border border-neutral-200 dark:border-white/10 px-3 py-1 rounded-full shrink-0">
                                        Stage {stage.number}
                                    </span>
                                    <h2 className="text-xl font-bold text-black dark:text-white">{stage.title}</h2>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs font-mono text-neutral-500">
                                    <span>{stage.duration}</span>
                                    <span>&middot;</span>
                                    <span className="text-black dark:text-white font-medium">{stage.focus}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                                        What We Do
                                    </h3>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">{stage.weDo}</p>
                                </div>
                                <div>
                                    <h3 className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                                        Your Involvement
                                    </h3>
                                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-sm">{stage.youDo}</p>
                                </div>
                            </div>

                            <div className="pt-3 border-t border-neutral-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                                <span className="text-neutral-500">Deliverable</span>
                                <span className="font-semibold text-black dark:text-white">{stage.deliverable}</span>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Core Commitments */}
                <section className="mb-16 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
                    <div className="p-7 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                        <div className="w-10 h-10 rounded-[14px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
                            <Scale className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-black dark:text-white mb-2">Clear Return Target</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                            We define measurable savings upfront and back every rollout with a 90-day guarantee.
                        </p>
                    </div>
                    <div className="p-7 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                        <div className="w-10 h-10 rounded-[14px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-black dark:text-white mb-2">Structured Reliability</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                            Every step validates inputs and outputs strictly before writing changes to production records.
                        </p>
                    </div>
                    <div className="p-7 rounded-[28px] border border-neutral-200 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950">
                        <div className="w-10 h-10 rounded-[14px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center mb-4">
                            <Lock className="w-4 h-4" />
                        </div>
                        <h3 className="text-base font-bold text-black dark:text-white mb-2">Private Hosting</h3>
                        <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                            Everything runs inside your cloud or servers - zero prompts or files leave your perimeter.
                        </p>
                    </div>
                </section>

                {/* Fit Filter */}
                <section className="mb-16 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[32px] p-6 md:p-10">
                    <div className="mb-8 text-center max-w-xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white mb-2">Who This Fits Best</h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-sm">We work selectively where reliable software delivers real financial leverage.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        <div className="p-6 rounded-[24px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-black dark:text-white mb-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold">Good Fit</h3>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                Established companies in finance, logistics, manufacturing, or healthcare looking to automate real operational bottlenecks with full data privacy.
                            </p>
                        </div>
                        <div className="p-6 rounded-[24px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10">
                            <div className="flex items-center gap-2.5 text-neutral-500 mb-3">
                                <XCircle className="w-5 h-5 shrink-0" />
                                <h3 className="text-base font-bold text-black dark:text-white">Not a Fit</h3>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm">
                                Simple consumer chatbots, off-the-shelf Zapier scripts, or exploratory projects without clear operational metrics.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                            Common Questions
                        </h2>
                    </div>

                    <div className="space-y-3 max-w-3xl mx-auto">
                        {howWeWorkFaqs.map((faq, idx) => {
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
                                            aria-controls={`howwework-faq-panel-${idx}`}
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="w-full min-h-[44px] flex items-center justify-between gap-4 p-5 text-left text-sm sm:text-base font-semibold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-neutral-500 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </h3>
                                    <div
                                        id={`howwework-faq-panel-${idx}`}
                                        aria-hidden={!isOpen}
                                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed border-t border-neutral-200 dark:border-white/10 pt-3">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </div>
        </main>
    )
}
