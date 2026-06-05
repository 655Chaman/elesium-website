import { motion } from 'framer-motion'
import { ArrowLeft, TrendingUp, Cpu, Network } from 'lucide-react'

interface MarketSignalsProps {
    onBack: () => void;
}

const articles = [
    {
        id: 1,
        category: 'Market Intelligence',
        icon: TrendingUp,
        title: 'The 2026 Shift in Tier-2 Aerospace Sourcing: Where the Bottlenecks Are',
        date: 'June 02, 2026',
        readTime: '5 min read',
        excerpt: 'An analysis of supply chain constraints affecting AS9100-certified manufacturers and how primes are restructuring their procurement strategies.',
    },
    {
        id: 2,
        category: 'Operational Leverage',
        icon: Cpu,
        title: 'How Industrial Automation Firms Are Scaling Contract Acquisition Without Fluffy Marketing',
        date: 'May 28, 2026',
        readTime: '7 min read',
        excerpt: 'A deep dive into systems-driven outbound architectures that bypass traditional lead generation and place integrators directly in front of active RFQs.',
    },
    {
        id: 3,
        category: 'Matchmaking Frameworks',
        icon: Network,
        title: 'Why Traditional B2B Directories Fail Heavy Manufacturing (And the Structural Fix)',
        date: 'May 15, 2026',
        readTime: '6 min read',
        excerpt: 'Directories provide raw lists. We provide verified alignment. Exploring the data engineering required to pre-screen high-ticket manufacturing partners.',
    }
]

export default function MarketSignals({ onBack }: MarketSignalsProps) {
    return (
        <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#050505] text-black dark:text-white overflow-y-auto">
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
                    <span className="text-sm font-semibold tracking-wide uppercase text-emerald-500 dark:text-emerald-400">
                        Market Signals
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
                    <div className="flex items-center gap-3 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                        </span>
                        <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-emerald-500">
                            The Authority Engine
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-8 text-black dark:text-white">
                        Market Signals &<br />Intelligence.
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Real-time market changes, supply chain constraints, and operational bottlenecks. 
                        Insights engineered for aerospace and industrial executives.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 gap-y-12">
                    {articles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group flex flex-col md:flex-row gap-6 md:gap-12 border-b border-gray-200 dark:border-white/10 pb-12 cursor-pointer"
                        >
                            <div className="md:w-1/4 flex flex-col gap-4">
                                <div className="flex items-center gap-2 text-sm font-mono text-gray-500 dark:text-gray-400">
                                    <article.icon className="h-4 w-4" />
                                    <span className="uppercase tracking-wider">{article.category}</span>
                                </div>
                                <div className="text-sm text-gray-400 dark:text-gray-600 font-mono">
                                    {article.date} · {article.readTime}
                                </div>
                            </div>

                            <div className="md:w-3/4">
                                <h2 className="text-2xl md:text-4xl font-semibold mb-4 text-black dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    {article.title}
                                </h2>
                                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {article.excerpt}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    )
}
