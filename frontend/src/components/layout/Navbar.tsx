import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/LOGO_NEW.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <>
            <WhatsAppModal />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 dark:border-b dark:border-white/10 transition-colors duration-300" style={{ height: '56px' }}>
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
                            className="h-8 md:h-9 w-auto object-contain transition-all hover:opacity-90 drop-shadow-sm"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        <Link
                            to="/how-we-work"
                            className="btn-nav text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            How We Work
                        </Link>
                        <Link
                            to="/solutions"
                            className="btn-nav text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/compare"
                            className="btn-nav text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            Architecture
                        </Link>
                        <Link
                            to="/signals"
                            className="btn-nav text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            Market Signals
                        </Link>
                        <Link
                            to="/resources"
                            className="btn-nav text-xs xl:text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition"
                        >
                            Engineering Tools
                        </Link>
                        <Link
                            to="/ai-automation-agency-india"
                            className="btn-nav text-xs xl:text-sm font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition flex items-center gap-1"
                        >
                            <span>Best Enterprise AI India</span>
                        </Link>
                    </div>

                    {/* Right CTA - Primary WhatsApp Desk Button */}
                    <div className="hidden lg:flex items-center gap-3">
                        <button
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm transition-all"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Chat on WhatsApp</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-[56px] z-40 bg-white dark:bg-[#0A0A0A] border-b border-gray-200 dark:border-white/10 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto px-6 py-6"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                to="/how-we-work"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                How We Work
                            </Link>
                            <Link
                                to="/solutions"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                Solutions Hub (3,765 Workflows)
                            </Link>
                            <Link
                                to="/compare"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                Architecture Comparisons
                            </Link>
                            <Link
                                to="/signals"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                Technical Market Signals &amp; Whitepapers
                            </Link>
                            <Link
                                to="/resources"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-gray-800 dark:text-gray-200 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                Engineering Tools (75 Simulators)
                            </Link>
                            <Link
                                to="/ai-automation-agency-india"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-semibold text-emerald-600 dark:text-emerald-400 py-2 border-b border-gray-100 dark:border-white/5"
                            >
                                Best Enterprise AI Company in India (Sovereign Deployments)
                            </Link>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openWhatsApp();
                                    }}
                                    className="w-full py-3 px-4 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-center text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                                >
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <span>Chat on WhatsApp</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                                <Link
                                    to="/waitlist"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-medium text-center text-xs"
                                >
                                    Or Schedule Calendar Review &rarr;
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
