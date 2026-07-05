import { motion } from 'framer-motion'

export default function AIAutomation() {
    return (
        <div className="pt-24 min-h-screen bg-white dark:bg-black transition-colors duration-300 relative z-10">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 md:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight text-gray-900 dark:text-white mb-6">
                        AI Automation
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12">
                        Next-generation intelligence for market leaders. Automate complex workflows and scale your operations with our proprietary AI infrastructure.
                    </p>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {/* Placeholder content cards */}
                    <div className="bg-[#FAFAFA] dark:bg-[#111] dark:border dark:border-white/5 transition-colors p-8 rounded-[24px]">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Workflow Orchestration</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Streamline your business processes with intelligent automation that adapts to your unique requirements.
                        </p>
                    </div>
                    <div className="bg-[#FAFAFA] dark:bg-[#111] dark:border dark:border-white/5 transition-colors p-8 rounded-[24px]">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Data Processing</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Transform unstructured data into actionable insights with state-of-the-art language models.
                        </p>
                    </div>
                    <div className="bg-[#FAFAFA] dark:bg-[#111] dark:border dark:border-white/5 transition-colors p-8 rounded-[24px]">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-4">Predictive Analytics</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Leverage advanced machine learning to forecast trends and make data-driven decisions.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
