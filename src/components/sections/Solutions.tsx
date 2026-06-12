import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { MandateApplicationForm } from '../features/WaitingListForm'

export default function Solutions() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })

    return (
        <section
            ref={ref}
            className="relative bg-white dark:bg-black transition-colors duration-300 py-16 md:py-0"
            style={{
                height: 'auto',
                minHeight: '0',
            }}
        >
            <div className="md:min-h-[auto] lg:min-h-[839px] md:py-[55px]">
                <div className="max-w-6xl mx-auto px-5 md:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                        <h2 className="section-h2 mb-8 md:mb-16 text-center dark:text-white transition-colors">Built for Market Leaders</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: '24px' }}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                            className="bg-[#FAFAFA] dark:bg-[#111] dark:border dark:border-white/5 transition-colors flex flex-col h-full rounded-2xl md:rounded-[36px] p-6 md:p-12"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        >
                            <span className="text-[11px] font-medium tracking-[0.06em] text-gray-400 dark:text-gray-600 mb-4">
                                Engagement Tier / 01
                            </span>
                            <h3 style={{
                                fontWeight: 500,
                                marginBottom: '16px',
                            }} className="text-2xl md:text-[32px] text-[#121317] dark:text-white transition-colors">
                                Growth-Stage Manufacturers
                            </h3>
                            <p className="body-text mb-8 dark:text-gray-400">
                                You have the capacity to scale. We engineer the pipeline to fill it.
                            </p>
                            <div className="mt-auto">
                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <button className="btn-primary text-sm px-4 py-2">
                                            Apply Now
                                        </button>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <MandateApplicationForm source="Tier 1 - Growth-Stage" />
                                    </ExpandableScreenContent>
                                </ExpandableScreen>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            className="bg-[#FAFAFA] dark:bg-[#111] dark:border dark:border-white/5 transition-colors flex flex-col h-full rounded-2xl md:rounded-[36px] p-6 md:p-12"
                            style={{
                                backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)',
                                backgroundSize: '20px 20px'
                            }}
                        >
                            <span className="text-[11px] font-medium tracking-[0.06em] text-gray-400 dark:text-gray-600 mb-4">
                                Engagement Tier / 02
                            </span>
                            <h3 style={{
                                fontSize: '32px',
                                fontWeight: 500,
                                marginBottom: '16px',
                            }} className="text-[#121317] dark:text-white transition-colors">
                                Enterprise & Tier-1 OEMs
                            </h3>
                            <p className="body-text mb-8 dark:text-gray-400">
                                Custom outbound architecture and white-glove partner introductions at the executive level.
                            </p>
                            <div className="mt-auto">
                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <button className="btn-primary text-sm px-4 py-2">
                                            Apply Now
                                        </button>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <MandateApplicationForm source="Tier 2 - Enterprise & OEMs" />
                                    </ExpandableScreenContent>
                                </ExpandableScreen>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}
