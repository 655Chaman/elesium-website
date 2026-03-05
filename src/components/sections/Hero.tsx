import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { TextAnimate } from '../ui/TextAnimate'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { WaitingListForm } from '../features/WaitingListForm'


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
                    style={{ maxWidth: '900px', margin: '0 auto' }}
                >
                    {/* Company Name Badge */}
                    <div className="mb-6 flex justify-center items-center">
                        <span className="text-sm font-bold tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400">
                            Elesium.online
                        </span>
                    </div>

                    <h1 className="hero-h1 mb-6 text-center mx-auto" style={{ maxWidth: '100%' }}>
                        <TextAnimate
                            as="span"
                            animation="blurInUp"
                            by="word"
                            duration={3}
                            className="text-black dark:text-white font-medium"
                        >
                            Connecting you with your buyers
                        </TextAnimate>
                    </h1>

                    <p className="body-text mb-8 mx-auto" style={{ maxWidth: '700px' }}>
                        Find the right partners faster with context, qualification, and trust.
                    </p>

                    <div className="flex gap-3 justify-center">
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton>
                                    Explore
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <WaitingListForm />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
