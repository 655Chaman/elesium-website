
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import Modal from '../ui/Modal'
import { FocusCards } from '../ui/focus-cards'

const caseStudies = [
    {
        id: 1,
        title: 'Network Optimization',
        description: 'Deep dive into how we helped a global manufacturer streamline their supply chain operations.',
        details: {
            heading: 'Global Supply Chain Optimization',
            content: 'In this case study, we partnered with a Fortune 500 manufacturer to overhaul their supplier discovery process. By implementing Elesium, they reduced vetting time by 40% and identified 3 key redundancy risks in their critical path.',
            stats: ['40% Faster Vetting', '3 Risk Points Mitigated', '$2M Estimated Savings']
        }
    },
    {
        id: 2,
        title: 'Aerospace Partnerships',
        description: 'Constructing mutually beneficial partnerships and ensuring compliance in the aerospace sector.',
        details: {
            heading: 'Aerospace Partnership Network',
            content: 'Elesium enabled a mid-sized aerospace component provider to connect with Tier 1 suppliers. The transparent qualification data built immediate trust, leading to 2 major contracts within the first quarter.',
            stats: ['2 Major Contracts', '15 New Qualified Leads', 'Zero Compliance Issues']
        }
    },
    {
        id: 3,
        title: 'Automated Compliance',
        description: 'Leveraging agentic workflows to automatically verify global certifications and standards.',
        details: {
            heading: 'Automated Compliance Verification',
            content: 'Compliance is the bottleneck of modern manufacturing. We deployed our agentic workflow system to automatically verify certifications (ISO 9001, AS9100) against global databases, ensuring 100% compliance before any human conversation started.',
            stats: ['100% Automated Checks', '24/7 Monitoring', 'Instant Audit Trails']
        }
    },
]

export default function CaseStudies() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.2 })
    const [selectedStudy, setSelectedStudy] = useState<typeof caseStudies[0] | null>(null)

    return (
        <section
            id="case-studies"
            ref={ref}
            className="relative transition-colors duration-300 dark:bg-black bg-[#FAFAFA]"
            style={{
                paddingTop: '72px',
                paddingBottom: '120px',
            }}
        >
            <div className="absolute inset-0 bg-[#FAFAFA] dark:hidden -z-10" />

            <div className="max-w-6xl mx-auto px-12">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                    <h2 className="section-h2 mb-4 text-center dark:text-white transition-colors">
                        Case Studies
                    </h2>
                    <p className="body-text text-center mb-16 max-w-2xl mx-auto dark:text-gray-400 transition-colors">
                        See how we have done it
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
