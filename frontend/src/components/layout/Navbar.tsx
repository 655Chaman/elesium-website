import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/ExpandableScreen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import logo from '../../assets/LOGO_NEW.png'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)



    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 dark:border-b dark:border-white/10 transition-colors duration-300" style={{ height: '52px' }}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center cursor-pointer">
                        <img
                            src={logo}
                            alt="Elesium Logo"
                            width="160"
                            height="40"
                            loading="eager"
                            fetchPriority="high"
                            className="h-8 md:h-10 w-auto object-contain transition-all hover:opacity-90 drop-shadow-sm"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
                        <Link
                            to="/waitlist"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Book Audit
                        </Link>
                        <Link
                            to="/how-we-work"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            How We Work
                        </Link>
                        <Link
                            to="/markets"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Markets
                        </Link>
                        <Link
                            to="/solutions"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-emerald-600 dark:text-emerald-400"
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/ai-automation"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            AI Automation
                        </Link>
                        <Link
                            to="/ai-automation-agency-india"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-cyan-600 dark:text-cyan-400"
                        >
                            India Enterprise
                        </Link>
                        <Link
                            to="/videos"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Masterclasses
                        </Link>
                        <Link
                            to="/signals"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Market Signals
                        </Link>
                        <Link
                            to="/tools/enterprise-ai-roi-calculator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-amber-600 dark:text-amber-400"
                        >
                            ROI Calculator
                        </Link>
                        <Link
                            to="/tools/multi-agent-latency-token-cost-estimator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-blue-500 dark:text-blue-400"
                        >
                            Latency Estimator
                        </Link>
                        <Link
                            to="/tools/multi-agent-token-leakage-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-rose-500 dark:text-rose-400"
                        >
                            Token Leakage
                        </Link>
                        <Link
                            to="/tools/dpdp-act-2023-audit-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-amber-500 dark:text-amber-400"
                        >
                            DPDP Audit
                        </Link>
                        <Link
                            to="/tools/enterprise-gpu-finops-cost-calculator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-sky-500 dark:text-sky-400"
                        >
                            GPU FinOps
                        </Link>
                        <Link
                            to="/tools/enterprise-vector-db-latency-benchmark"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-indigo-500 dark:text-indigo-400"
                        >
                            Vector DB Benchmark
                        </Link>
                        <Link
                            to="/tools/enterprise-llm-context-kv-cache-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-emerald-500 dark:text-emerald-400"
                        >
                            KV Cache
                        </Link>
                        <Link
                            to="/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-rose-500 dark:text-rose-400"
                        >
                            Deadlock Breaker
                        </Link>
                        <Link
                            to="/tools/enterprise-voice-agent-latency-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-purple-500 dark:text-purple-400"
                        >
                            Voice Latency
                        </Link>
                        <Link
                            to="/tools/enterprise-graphrag-memory-benchmark"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-emerald-500 dark:text-emerald-400"
                        >
                            GraphRAG
                        </Link>
                        <Link
                            to="/tools/enterprise-event-sourcing-audit-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-cyan-500 dark:text-cyan-400"
                        >
                            Event Ledger
                        </Link>
                        <Link
                            to="/tools/enterprise-prompt-injection-firewall-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-rose-500 dark:text-rose-400"
                        >
                            Prompt Firewall
                        </Link>
                        <Link
                            to="/tools/enterprise-semantic-cache-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-cyan-400 dark:text-cyan-300"
                        >
                            Semantic Cache
                        </Link>
                        <Link
                            to="/tools/enterprise-model-routing-cost-arbitrage-simulator"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-purple-400 dark:text-purple-300"
                        >
                            Model Router
                        </Link>
                        <Link
                            to="/compare"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white font-medium text-purple-600 dark:text-purple-400"
                        >
                            Compare Stacks
                        </Link>
                        <Link
                            to="/resources"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Resources
                        </Link>
                    </div>

                    {/* CTA (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton id="nav-mandate-cta" className="h-8 px-3 text-xs">
                                    Apply Now
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <MandateApplicationForm source="Navbar CTA" />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors z-50"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 bg-white dark:bg-black pt-[60px] px-6 md:hidden flex flex-col items-center"
                    >
                        <div className="flex flex-col w-full gap-6 mt-8">
                            <Link
                                to="/waitlist"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-semibold text-left text-emerald-600 dark:text-emerald-400 py-4 border-b border-gray-100 dark:border-white/10 flex items-center gap-3"
                            >
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Book Architecture Audit
                            </Link>
                            <Link
                                to="/how-we-work"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                How We Work
                            </Link>
                            <Link
                                to="/markets"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Markets
                            </Link>
                            <Link
                                to="/solutions"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-emerald-600 dark:text-emerald-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Solutions
                            </Link>
                            <Link
                                to="/ai-automation"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                AI Automation
                            </Link>
                            <Link
                                to="/ai-automation-agency-india"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-cyan-600 dark:text-cyan-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                India Enterprise
                            </Link>
                            <Link
                                to="/videos"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Masterclasses
                            </Link>
                            <Link
                                to="/signals"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Market Signals
                            </Link>
                            <Link
                                to="/tools/enterprise-ai-roi-calculator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-amber-600 dark:text-amber-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                ROI Calculator
                            </Link>
                            <Link
                                to="/tools/multi-agent-latency-token-cost-estimator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-blue-500 dark:text-blue-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Latency Estimator
                            </Link>
                            <Link
                                to="/tools/multi-agent-token-leakage-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-rose-500 dark:text-rose-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Token Leakage Simulator
                            </Link>
                            <Link
                                to="/tools/dpdp-act-2023-audit-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-amber-500 dark:text-amber-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                DPDP Act 2023 Simulator
                            </Link>
                            <Link
                                to="/tools/enterprise-gpu-finops-cost-calculator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-sky-500 dark:text-sky-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                GPU FinOps Calculator
                            </Link>
                            <Link
                                to="/tools/enterprise-vector-db-latency-benchmark"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-indigo-500 dark:text-indigo-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Vector DB Benchmark
                            </Link>
                            <Link
                                to="/tools/enterprise-llm-context-kv-cache-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-emerald-500 dark:text-emerald-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                KV Cache Simulator
                            </Link>
                            <Link
                                to="/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-rose-500 dark:text-rose-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Deadlock Breaker Visualizer
                            </Link>
                            <Link
                                to="/tools/enterprise-voice-agent-latency-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-purple-500 dark:text-purple-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Voice Agent Latency Simulator
                            </Link>
                            <Link
                                to="/tools/enterprise-graphrag-memory-benchmark"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-emerald-500 dark:text-emerald-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                GraphRAG Memory Benchmark
                            </Link>
                            <Link
                                to="/tools/enterprise-event-sourcing-audit-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-cyan-500 dark:text-cyan-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Event Sourcing Audit Simulator
                            </Link>
                            <Link
                                to="/tools/enterprise-prompt-injection-firewall-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-rose-500 dark:text-rose-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Prompt Injection Firewall
                            </Link>
                            <Link
                                to="/tools/enterprise-semantic-cache-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-cyan-400 dark:text-cyan-300 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Semantic Cache Simulator
                            </Link>
                            <Link
                                to="/tools/enterprise-model-routing-cost-arbitrage-simulator"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-purple-400 dark:text-purple-300 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Model Routing Simulator
                            </Link>
                            <Link
                                to="/compare"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-purple-600 dark:text-purple-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Compare Stacks
                            </Link>
                            <Link
                                to="/resources"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-blue-600 dark:text-blue-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Resources
                            </Link>

                            <div className="mt-8 w-full">
                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <InteractiveHoverButton className="w-full justify-center h-10 text-sm">
                                            Apply Now
                                        </InteractiveHoverButton>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <MandateApplicationForm source="Navbar CTA (Mobile)" />
                                    </ExpandableScreenContent>
                                </ExpandableScreen>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
