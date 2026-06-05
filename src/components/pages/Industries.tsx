import { motion } from 'framer-motion'
import { ArrowLeft, Plane, Factory, Settings } from 'lucide-react'

interface IndustriesProps {
    onBack: () => void;
}

const industries = [
    {
        id: 'aerospace',
        title: 'Aerospace & Defense',
        icon: Plane,
        description: 'Focus on compliance, precision manufacturing, Tier-1/Tier-2 supplier matching, and AS9100-vetted connections.',
        details: [
            'AS9100 Certified Suppliers',
            'Tier-1/Tier-2 Defense Pipeline',
            'Precision Manufacturing'
        ]
    },
    {
        id: 'industrial-automation',
        title: 'Industrial Automation',
        icon: Settings,
        description: 'Focus on systems integrators, robotics deployment, and high-scale production line optimization.',
        details: [
            'Systems Integrators',
            'Robotics Deployment',
            'Production Line Optimization'
        ]
    },
    {
        id: 'advanced-mfg',
        title: 'Advanced Manufacturing',
        icon: Factory,
        description: 'Focus on custom component fabrication, high-volume contract fulfillment, and supply chain redundancy.',
        details: [
            'Custom Component Fabrication',
            'Contract Fulfillment',
            'Supply Chain Redundancy'
        ]
    }
]

export default function Industries({ onBack }: IndustriesProps) {
    return (
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-white/10">
                <div className="max-w-7xl mx-auto px-5 md:px-6 h-16 md:h-20 flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </button>
                    <span className="text-sm font-semibold tracking-wide uppercase text-gray-400 dark:text-gray-600">
                        Industry Architecture
                    </span>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-5 md:px-6 py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 md:mb-24 max-w-3xl"
                >
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6 md:mb-8">
                        The Three Pillars.
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed">
                        We dominate the heavy infrastructure landscape by locking into three interconnected sectors. We balance supply and demand through precision matching and verified engagements.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
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
                                <h2 className="text-2xl font-semibold">{industry.title}</h2>
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
