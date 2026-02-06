import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const tiers = [
    {
        title: 'For Manufacturers',
        description: 'Connect with qualified buyers worldwide. Access our verified network of industrial buyers.',
        cta: 'Start selling',
    },
    {
        title: 'For Buyers',
        description: 'Source from verified manufacturers globally. Get access to multi-million dollar suppliers.',
        cta: 'Start buying',
    },
]

function TierCard({ tier, index }: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1, delay: index * 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="dotted-grid bg-white rounded-3xl p-8 md:p-16 border border-gray-200"
        >
            <h3 className="text-2xl md:text-4xl font-semibold mb-4 md:mb-6 text-[#121317]">{tier.title}</h3>
            <p className="body-text mb-8">{tier.description}</p>
            <button className="px-8 py-4 bg-[#121317] text-white rounded-full text-[14.5px] font-[430] hover:bg-[#45474D] transition-all duration-300">
                {tier.cta}
            </button>
        </motion.div>
    )
}

export default function TierCards() {
    return (
        <section className="py-16 md:py-40 px-4 md:px-[72px] bg-gray-50">
            <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {tiers.map((tier, index) => (
                    <TierCard key={tier.title} tier={tier} index={index} />
                ))}
            </div>
        </section>
    )
}
