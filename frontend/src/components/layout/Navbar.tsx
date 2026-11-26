import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/LOGO_EMBLEM.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <>
            <WhatsAppModal />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 border-b border-neutral-200 dark:border-white/10 transition-colors duration-300" style={{ height: '56px' }}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
                    {/* Logo (Left Column) */}
                    <Link to="/ai/" className="flex items-center justify-self-start cursor-pointer active:scale-[0.97] transition-transform">
                        <img
                            src={logo}
                            alt="Elesium Logo"
                            width="32"
                            height="32"
                            loading="eager"
                            fetchPriority="high"
                            className="h-7 w-7 object-contain transition-opacity hover:opacity-90"
                        />
                    </Link>

                    {/* Desktop Navigation (Mathematically Centered Column) */}
                    <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5">
                        <Link
                            to="/how-we-work/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            How We Work
                        </Link>
                        <Link
                            to="/solutions/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/compare/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Comparisons
                        </Link>
                        <Link
                            to="/signals/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Insights
                        </Link>
                        <Link
                            to="/resources/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Tools &amp; Guides
                        </Link>
                        <Link
                            to="/connector/"
                            className="btn-nav text-xs xl:text-sm font-medium text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition active:scale-[0.97] inline-flex items-center gap-1 whitespace-nowrap"
                            title="Switch to Elesium Connector Model"
                        >
                            <span>Connector Model</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Right CTA & Portfolio/Portal Links (Right Column) */}
                    <div className="hidden lg:flex items-center justify-end gap-2 xl:gap-3 justify-self-end">
                        <Link
                            to="/portfolio/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition active:scale-[0.97] whitespace-nowrap"
                            title="View Elesium Portfolio"
                        >
                            Portfolio
                        </Link>
                        <Link
                            to="/"
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-3 py-1.5 rounded-full transition active:scale-[0.97] whitespace-nowrap"
                            title="Return to Elesium Portal"
                        >
                            Portal
                        </Link>
                        <button
                            onClick={openWhatsApp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            <span>Chat on WhatsApp</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.97] focus:outline-none transition"
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
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.97 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.8 }}
                        className="fixed inset-x-0 top-[56px] z-40 origin-top bg-white dark:bg-black border-b border-neutral-200 dark:border-white/10 shadow-2xl lg:hidden max-h-[85vh] overflow-y-auto px-6 py-6"
                    >
                        <div className="flex flex-col gap-4">
                            <Link
                                to="/connector/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between active:scale-[0.97] transition"
                            >
                                <span>Connector Model</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/portfolio/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Portfolio
                            </Link>
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-neutral-500 py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Portal
                            </Link>
                            <Link
                                to="/how-we-work/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                How We Work
                            </Link>
                            <Link
                                to="/solutions/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Solutions
                            </Link>
                            <Link
                                to="/compare/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Comparisons
                            </Link>
                            <Link
                                to="/signals/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Insights
                            </Link>
                            <Link
                                to="/resources/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-black dark:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Tools &amp; Guides
                            </Link>
                            <Link
                                to="/enterprise-ai-bangalore/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-base font-medium text-neutral-500 hover:text-black dark:hover:text-white py-2 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                            >
                                Bengaluru Studio
                            </Link>

                            <div className="pt-4 flex flex-col gap-3">
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        openWhatsApp();
                                    }}
                                    className="w-full py-3.5 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-center text-sm flex items-center justify-center gap-2 transition active:scale-[0.97]"
                                >
                                    <span>Chat on WhatsApp</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </button>
                                <Link
                                    to="/waitlist/"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3 px-6 rounded-full border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 font-medium text-center text-xs active:scale-[0.97] transition"
                                >
                                    ele-in Waitlist &rarr;
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
