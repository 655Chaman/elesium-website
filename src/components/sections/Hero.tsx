import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TextAnimate } from '../ui/TextAnimate'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { MandateApplicationForm } from '../features/WaitingListForm'

export default function HeroSection() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.1 })

    return (
        <section
            ref={ref}
            className="relative flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300 min-h-[calc(100svh-52px)] md:min-h-0 pt-[52px]"
            style={{ height: 'auto' }}
        >
            <div className="min-h-[400px] md:h-[777px] flex items-center w-full">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    className="text-center px-5 md:px-12 py-8 md:py-0 w-full"
                    style={{ maxWidth: '960px', margin: '0 auto' }}
                >
                    {/* Authority Badge Removed */}

                    <h1 className="hero-h1 mb-6 text-center mx-auto" style={{ maxWidth: '100%' }}>
                        <TextAnimate
                            as="span"
                            animation="blurInUp"
                            by="word"
                            duration={3}
                            className="text-black dark:text-white font-semibold"
                        >
                            We Secure Your Ideal Buyers.
                        </TextAnimate>
                    </h1>

                    <motion.p
                        className="body-text mb-10 mx-auto text-gray-500 dark:text-gray-400"
                        style={{ maxWidth: '680px' }}
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        Proprietary data infrastructure meets targeted outbound architecture to broker exclusive, high-ticket partnerships.
                    </motion.p>

                    <motion.div
                        className="flex flex-col sm:flex-row gap-3 justify-center items-center"
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton id="hero-mandate-cta" className="h-10 px-6 text-sm">
                                    Apply Now
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <MandateApplicationForm />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
