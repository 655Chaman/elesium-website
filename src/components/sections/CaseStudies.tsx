
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Modal from '../ui/Modal'
import { FocusCards } from '../ui/focus-cards'

const caseStudies = [
    {
        id: 1,
        title: 'Network Optimization',
        description: 'How we restructured a global manufacturer\'s supplier discovery process — reducing vetting time and mitigating critical redundancy risks.',
        details: {
            heading: 'Global Supply Chain Optimization',
            content: 'We partnered with a Fortune 500 manufacturer to overhaul their supplier discovery and qualification process. By deploying Elesium\'s outbound architecture and compliance verification engine, they reduced vetting time by 40%, identified three critical redundancy risks in their supply path, and received a curated shortlist of ready-to-sign partners within the first quarter.',
            stats: ['40% Faster Vetting', '3 Risk Points Mitigated', '$2M Estimated Savings']
        }
    },
    {
        id: 2,
        title: 'Aerospace Partnerships',
        description: 'Connecting an aerospace component provider with Tier-1 suppliers — compliance-verified introductions that converted to contracts in under 90 days.',
        details: {
            heading: 'Aerospace Partnership Mandate',
            content: 'A mid-sized aerospace component provider needed Tier-1 supplier relationships — fast, compliant, and at the executive level. Elesium deployed a targeted outbound mandate, surfacing AS9100-certified contacts and delivering pre-qualified introductions with full certification histories. Two major contracts were signed within the first quarter. Zero compliance issues throughout.',
            stats: ['2 Major Contracts Signed', '15 Qualified Leads Surfaced', 'Zero Compliance Issues']
        }
    },
    {
        id: 3,
        title: 'Automated Compliance',
        description: 'Deploying agentic verification workflows to automatically validate global certifications before any human conversation begins.',
        details: {
            heading: 'Automated Compliance Verification',
            content: 'Compliance bottlenecks were costing an industrial group weeks of manual vetting per engagement. We deployed our agentic verification system to automatically cross-reference certifications (ISO 9001, AS9100, NADCAP) against global regulatory databases — 24/7, with instant audit trails. By the time the first call was booked, every contact had been fully cleared.',
            stats: ['100% Pre-Meeting Compliance', '24/7 Automated Monitoring', 'Instant Audit Trails']
        }
    },
]

export default function CaseStudies() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })
    const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null)

    return (
        <section
            id="case-studies"
            ref={ref}
            className="relative transition-colors duration-300 dark:bg-black bg-[#FAFAFA] py-16 md:py-0"
            style={{
                paddingTop: undefined,
                paddingBottom: undefined,
            }}
        >
            <div className="absolute inset-0 bg-[#FAFAFA] dark:hidden -z-10" />

            <div className="max-w-6xl mx-auto px-5 md:px-12 py-4 md:py-[72px] pb-8 md:pb-[120px]">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <h2 className="section-h2 mb-4 text-center dark:text-white transition-colors">
                        Case Studies
                    </h2>
                    <p className="body-text text-center mb-8 md:mb-16 max-w-2xl mx-auto dark:text-gray-400 transition-colors">
                        Mandates executed. Results delivered.
                    </p>
                </motion.div>

                <FocusCards
                    cards={caseStudies}
                    onCardClick={setSelectedStudy}
                />
            </div>

            <Modal isOpen={!!selectedStudy} onClose={() => setSelectedStudy(null)}>
                {selectedStudy && (
                    <div>
                        <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
                            {selectedStudy.details.heading}
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                            {selectedStudy.details.content}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 dark:border-zinc-800 pt-6">
                            {selectedStudy.details.stats.map((stat, i) => (
                                <div key={i} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-lg text-center">
                                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{stat}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>
        </section>
    )
}
