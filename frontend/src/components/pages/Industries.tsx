import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, TrendingUp, Zap, Activity, Cpu, Share2, ChevronRight, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const industries = [
    {
        id: 'defense-aerospace',
        title: 'Defense & Aerospace',
        icon: Shield,
        description: 'Routing precision manufacturing capacity and qualifying suppliers for aviation and defense programs.',
        details: [
            'Supplier capacity qualification',
            'Compliance documentation checks',
            'Precision manufacturing routing',
        ],
    },
    {
        id: 'private-equity',
        title: 'Private Equity & Industrial Acquisitions',
        icon: TrendingUp,
        description: 'Sourcing off-market acquisition targets and automating post-close ERP and portfolio reporting.',
        details: [
            'Off-market deal sourcing',
            'Financial document review',
            'Portfolio operations automation',
        ],
    },
    {
        id: 'energy-infrastructure',
        title: 'Energy & Data Center Infrastructure',
        icon: Zap,
        description: 'Monitoring grid telemetry and connecting hardware suppliers with large industrial operators.',
        details: [
            'Thermal & power monitoring',
            'Equipment fault detection',
            'Enterprise supplier sourcing',
        ],
    },
    {
        id: 'advanced-medtech',
        title: 'Healthcare & Medical Systems',
        icon: Activity,
        description: 'Connecting compliant medical manufacturers and automating clinical record processing privately.',
        details: [
            'Qualified manufacturer matching',
            'Clinical document triage',
            'Strict private hosting',
        ],
    },
    {
        id: 'applied-ai',
        title: 'Finance, Compliance & Operations',
        icon: Cpu,
        description: 'Automating ledger reconciliation, statutory checks, and daily back-office approval queues.',
        details: [
            'Ledger & GST reconciliation',
            'Automated policy audits',
            'ERP workflow integration',
        ],
    },
    {
        id: 'supply-chain-capital',
        title: 'Supply Chain & Strategic Partnerships',
        icon: Share2,
        description: 'Brokered introductions and automated dispatch workflows for high-volume industrial supply chains.',
        details: [
            'Direct partner introductions',
            'Multi-carrier dispatch routing',
            'Invoice verification',
        ],
    },
]

const industriesFaqs = [
    {
        q: 'Can workflows stay strictly inside on-premise or regional clouds?',
        a: 'Yes. Everything runs inside your own private VPC or on-premise servers with zero data leaving your perimeter.',
    },
    {
        q: 'How do you handle industry-specific regulations?',
        a: 'Every deployment is built around your compliance boundaries - including DPDP, RBI, SEBI, or healthcare data privacy rules - with full audit logs.',
    },
]

export default function Industries() {
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const summary =
        'Elesium works across six core sectors - aerospace, private equity, energy infrastructure, healthcare, financial compliance, and industrial supply chains - combining private software automation and verified partner introductions.'

    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': 'https://elesium.online/markets/#collection',
                name: 'Industries & Markets | Elesium',
                description: summary,
                url: 'https://elesium.online/markets/',
                publisher: {
                    '@type': 'Organization',
                    '@id': 'https://elesium.online/#organization',
                    name: 'Elesium',
                    url: 'https://elesium.online/',
                },
            },
            {
                '@type': 'BreadcrumbList',
                '@id': 'https://elesium.online/markets/#breadcrumb',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://elesium.online/' },
                    { '@type': 'ListItem', position: 2, name: 'Markets', item: 'https://elesium.online/markets/' },
                ],
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://elesium.online/markets/#faq',
                mainEntity: industriesFaqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.q,
                    acceptedAnswer: { '@type': 'Answer', text: faq.a },
                })),
            },
        ],
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white pt-24 pb-20 transition-colors duration-300">
            <Helmet>
                <title>Industries &amp; Markets | Elesium</title>
                <meta name="description" content="Explore the six enterprise sectors where Elesium builds private automation systems and direct partner pipelines." />
                <link rel="canonical" href="https://elesium.online/markets/" />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <main id="main-content" className="max-w-6xl mx-auto px-5 md:px-8">
                <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 text-xs font-mono text-neutral-500">
                    <Link to="/ai/" className="hover:text-black dark:hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-black dark:text-white font-medium">Markets</span>
                </nav>

                <motion.div
                    initial={{ opacity: 0, scale: 0.97, y: 16 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                    className="mb-14 max-w-3xl"
                >
                    <span className="text-[11px] font-mono tracking-[0.22em] uppercase text-neutral-500 block mb-4">
                        Industries Served
                    </span>
                    <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 text-black dark:text-white leading-[1.12]">
                        Industries where reliability matters most
                    </h1>
                    <p className="answer-capsule text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        {summary}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch mb-16">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.id}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: 'spring', stiffness: 260, damping: 28, delay: index * 0.05 }}
                            className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 rounded-[28px] p-6 md:p-8 flex flex-col justify-between group hover:border-black dark:hover:border-white/30 transition-all h-full"
                        >
                            <div>
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="h-11 w-11 rounded-[16px] bg-white dark:bg-black border border-neutral-200 dark:border-white/10 flex items-center justify-center shrink-0">
                                        <industry.icon className="h-5 w-5 text-black dark:text-white" />
                                    </div>
                                    <h2 className="text-lg font-bold tracking-tight text-black dark:text-white">{industry.title}</h2>
                                </div>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                                    {industry.description}
                                </p>
                            </div>

                            <div className="pt-5 border-t border-neutral-200 dark:border-white/10">
                                <ul className="space-y-2">
                                    {industry.details.map(item => (
                                        <li key={item} className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                                            <span className="text-black dark:text-white">-</span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ */}
                <section className="max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold tracking-tight text-black dark:text-white mb-6 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-3">
                        {industriesFaqs.map((faq, idx) => {
                            const isOpen = openFaq === idx
                            return (
                                <div key={faq.q} className="border border-neutral-200 dark:border-white/10 rounded-[24px] overflow-hidden bg-white dark:bg-black">
                                    <h3 className="m-0">
                                        <button
                                            type="button"
                                            aria-expanded={isOpen}
                                            aria-controls={`industries-faq-panel-${idx}`}
                                            onClick={() => setOpenFaq(isOpen ? null : idx)}
                                            className="w-full min-h-[44px] flex items-center justify-between p-5 text-left gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-950 transition-colors"
                                        >
                                            <span className="text-sm sm:text-base font-semibold text-black dark:text-white">{faq.q}</span>
                                            <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                    </h3>
                                    <div
                                        id={`industries-faq-panel-${idx}`}
                                        aria-hidden={!isOpen}
                                        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                                            isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="px-5 pb-5 pt-3 border-t border-neutral-200 dark:border-white/10 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                                {faq.a}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            </main>
        </div>
    )
}
