import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const roles = [
    {
        title: 'Manufacturers',
        description: 'Connect with verified buyers worldwide',
        image: '🏭',
    },
    {
        title: 'Buyers',
        description: 'Access multi-million dollar suppliers',
        image: '🛒',
    },
    {
        title: 'Distributors',
        description: 'Expand your network globally',
        image: '🌐',
    },
]

function RoleCard({ role, index }: any) {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true, amount: 0.3 })

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
            transition={{ duration: 1, delay: index * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="bg-white rounded-3xl p-12 border border-gray-100 hover:shadow-2xl transition-all duration-500"
        >
            <div className="text-8xl mb-8">{role.image}</div>
            <h3 className="text-3xl font-semibold mb-4 text-[#121317]">{role.title}</h3>
            <p className="body-text">{role.description}</p>
        </motion.div>
    )
}

export default function RolesGrid() {
    return (
        <section id="use-cases" className="py-40 px-[72px] bg-white">
            <div className="max-w-[1200px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roles.map((role, index) => (
                        <RoleCard key={role.title} role={role} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
