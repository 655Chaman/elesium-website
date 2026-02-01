import { motion } from 'framer-motion'
import { ArrowLeft, Zap, Plane, Beaker, Car } from 'lucide-react'

interface IndustriesProps {
    onBack: () => void;
}

const industries = [
    {
        id: 'energy',
        title: 'Energy',
        icon: Zap,
        description: 'Accelerating the transition to sustainable power through optimized supply chains and advanced component sourcing.',
        details: [
            'Renewable Energy Infrastructure',
            'Grid Modernization Components',
            'Sustainable Material Sourcing'
        ]
    },
    {
        id: 'aerospace',
        title: 'Aerospace',
        icon: Plane,
        description: 'Precision-critical sourcing for the next generation of flight, ensuring 100% compliance and traceability.',
        details: [
            'AS9100 Certified Suppliers',
            'Raw Material Traceability',
            'Advanced Avionics Components'
        ]
    },
    {
        id: 'plastics',
        title: 'Plastics',
        icon: Beaker,
        description: 'Connecting innovators with high-performance polymer manufacturers for medical, industrial, and consumer applications.',
        details: [
            'Injection Molding Partners',
            'Sustainable Polymer Alternatives',
            'High-Precision Tooling'
        ]
    },
    {
        id: 'automotive',
        title: 'Automotive',
        icon: Car,
        description: 'Driving efficiency in the automotive supply chain, from EV components to traditional tier-1 manufacturing.',
        details: [
            'EV Battery Supply Chain',
            'Lightweight Material Innovation',
            'Just-in-Time Manufacturing'
        ]
    }
]

export default function Industries({ onBack }: IndustriesProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </button>
                    <span className="text-sm font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-600">
                        Sectors
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-24 max-w-3xl"
                >
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                        Industries<br />We Serve.
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        We specialize in high-stakes sectors where precision, compliance, and speed are non-negotiable.
                        Our network is built to handle the rigorous demands of these four key industries.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                    {industries.map((industry, index) => (
                        <motion.div
                            key={industry.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="mb-6 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <industry.icon className="h-6 w-6 text-gray-900 dark:text-white" />
                                </div>
                                <h2 className="text-3xl font-semibold">{industry.title}</h2>
                            </div>

                            <div className="border-l-2 border-gray-100 dark:border-white/10 pl-6 group-hover:border-black dark:group-hover:border-white transition-colors duration-300">
                                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 group-hover:text-black dark:group-hover:text-white transition-colors">
                                    {industry.description}
                                </p>
                                <ul className="space-y-2">
                                    {industry.details.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
                                            <div className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
