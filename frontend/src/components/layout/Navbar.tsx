import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import logo from '../../assets/LOGO_EMBLEM.png'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const normalizePath = (path: string) => {
    const trimmed = path.replace(/\/+$/, '')
    return trimmed === '' ? '/' : trimmed
}

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isPortalMenuOpen, setIsPortalMenuOpen] = useState(false)
    const portalMenuRef = useRef<HTMLDivElement>(null)
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const location = useLocation()
    const currentPath = normalizePath(location.pathname)

    const isRouteActive = (target: string, prefixMatch = false) => {
        const normalizedTarget = normalizePath(target)
        if (prefixMatch && normalizedTarget !== '/') {
            return currentPath === normalizedTarget || currentPath.startsWith(`${normalizedTarget}/`)
        }
        return currentPath === normalizedTarget
    }

    // Close drawers when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false)
        setIsPortalMenuOpen(false)
    }, [location.pathname])

    // Close desktop portal dropdown on outside click or Escape
    useEffect(() => {
        if (!isPortalMenuOpen) return
        const handleOutside = (e: MouseEvent) => {
            if (portalMenuRef.current && !portalMenuRef.current.contains(e.target as Node)) {
                setIsPortalMenuOpen(false)
            }
        }
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsPortalMenuOpen(false)
        }
        document.addEventListener('mousedown', handleOutside)
        window.addEventListener('keydown', handleEsc)
        return () => {
            document.removeEventListener('mousedown', handleOutside)
            window.removeEventListener('keydown', handleEsc)
        }
    }, [isPortalMenuOpen])

    // Escape key & safe body scroll lock while mobile drawer is open
    useEffect(() => {
        if (!isMobileMenuOpen || typeof document === 'undefined') return

        const prevOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsMobileMenuOpen(false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            document.body.style.overflow = prevOverflow
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <WhatsAppModal />
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 border-b border-neutral-200 dark:border-white/10 transition-colors duration-300" style={{ height: '56px' }}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
                    {/* Logo (Left Column) */}
                    <Link
                        to="/ai/"
                        aria-current={isRouteActive('/ai/') ? 'page' : undefined}
                        className="flex items-center justify-self-start cursor-pointer active:scale-[0.97] transition-transform"
                    >
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

                    {/* Desktop Menu (Mathematically Centered Column) */}
                    <div className="hidden lg:flex items-center justify-center gap-1 xl:gap-1.5">
                        <Link
                            to="/how-we-work/"
                            aria-current={isRouteActive('/how-we-work/') ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            How We Work
                        </Link>
                        <Link
                            to="/solutions/"
                            aria-current={isRouteActive('/solutions/', true) ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Solutions
                        </Link>
                        <Link
                            to="/tools/"
                            aria-current={isRouteActive('/tools/', true) ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Tools
                        </Link>
                        <Link
                            to="/compare/"
                            aria-current={isRouteActive('/compare/', true) ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Comparisons
                        </Link>
                        <Link
                            to="/signals/"
                            aria-current={isRouteActive('/signals/', true) ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] whitespace-nowrap"
                        >
                            Insights
                        </Link>

                        {/* Always-mounted Docs & Portals Dropdown */}
                        <div ref={portalMenuRef} className="relative">
                            <button
                                type="button"
                                aria-expanded={isPortalMenuOpen}
                                aria-controls="desktop-portals-menu"
                                onClick={() => setIsPortalMenuOpen((prev) => !prev)}
                                className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white px-2.5 xl:px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition active:scale-[0.97] inline-flex items-center gap-1 whitespace-nowrap"
                            >
                                <span>Docs &amp; Guides</span>
                                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPortalMenuOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div
                                id="desktop-portals-menu"
                                aria-hidden={!isPortalMenuOpen}
                                className={`absolute left-0 top-full mt-2 w-60 rounded-2xl border border-neutral-200 dark:border-white/15 bg-white dark:bg-neutral-950 shadow-xl p-2 z-50 ${
                                    isPortalMenuOpen ? 'block' : 'hidden'
                                }`}
                            >
                                <a
                                    href="/docs/"
                                    onClick={() => setIsPortalMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Docs</span>
                                    <span className="font-mono text-[10px] text-neutral-400">/docs/</span>
                                </a>
                                <a
                                    href="/guides/top-10-sovereign-ai-platforms-india/"
                                    onClick={() => setIsPortalMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Guides</span>
                                    <span className="font-mono text-[10px] text-neutral-400">/guides/</span>
                                </a>
                                <a
                                    href="/support/"
                                    onClick={() => setIsPortalMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Support</span>
                                    <span className="font-mono text-[10px] text-neutral-400">/support/</span>
                                </a>
                                <Link
                                    to="/resources/"
                                    onClick={() => setIsPortalMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Playbooks &amp; Resources</span>
                                    <span className="font-mono text-[10px] text-neutral-400">/resources/</span>
                                </Link>
                                <Link
                                    to="/authors/chaman-shah/"
                                    onClick={() => setIsPortalMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10 transition"
                                >
                                    <span>Principal Architect</span>
                                    <span className="font-mono text-[10px] text-neutral-400">Profile</span>
                                </Link>
                            </div>
                        </div>

                        <Link
                            to="/connector/"
                            aria-current={isRouteActive('/connector/') ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-2.5 xl:px-3 py-1.5 rounded-full transition active:scale-[0.97] inline-flex items-center gap-1 whitespace-nowrap"
                            title="Switch to Elesium Connector Model"
                        >
                            <span>Connector</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Right CTA & Portfolio/Portal Links (Right Column) */}
                    <div className="hidden lg:flex items-center justify-end gap-1.5 xl:gap-2.5 justify-self-end">
                        <Link
                            to="/authors/chaman-shah/"
                            aria-current={isRouteActive('/authors/chaman-shah/') ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-full transition active:scale-[0.97] whitespace-nowrap"
                            title="Principal Architect Profile"
                        >
                            Architect
                        </Link>
                        <Link
                            to="/portfolio/"
                            aria-current={isRouteActive('/portfolio/') ? 'page' : undefined}
                            className="btn-nav text-xs xl:text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 px-2.5 py-1.5 rounded-full transition active:scale-[0.97] whitespace-nowrap"
                            title="View Elesium Portfolio"
                        >
                            Portfolio
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
                            type="button"
                            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white transition"
                            aria-label="Toggle menu"
                            aria-expanded={isMobileMenuOpen}
                            aria-controls="mobile-nav-drawer"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Drawer & Backdrop Scrim */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            key="mobile-nav-scrim"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                            className="fixed inset-0 top-[56px] z-30 bg-black/50 backdrop-blur-sm lg:hidden"
                        />
                        <motion.div
                            key="mobile-nav-drawer"
                            id="mobile-nav-drawer"
                            role="dialog"
                            aria-modal="true"
                            aria-label="Mobile menu"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ type: 'spring', stiffness: 320, damping: 28, mass: 0.8 }}
                            className="fixed inset-x-0 top-[56px] z-40 origin-top bg-white dark:bg-black border-b border-neutral-200 dark:border-white/10 shadow-2xl lg:hidden max-h-[calc(100dvh-56px)] overflow-y-auto overscroll-contain px-6 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
                        >
                            <div className="flex flex-col gap-1">
                                <Link
                                    to="/connector/"
                                    aria-current={isRouteActive('/connector/') ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 flex items-center justify-between active:scale-[0.97] transition"
                                >
                                    <span>Connector Model</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    to="/how-we-work/"
                                    aria-current={isRouteActive('/how-we-work/') ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    How We Work
                                </Link>
                                <Link
                                    to="/solutions/"
                                    aria-current={isRouteActive('/solutions/', true) ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Solutions
                                </Link>
                                <Link
                                    to="/tools/"
                                    aria-current={isRouteActive('/tools/', true) ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Tools
                                </Link>
                                <Link
                                    to="/compare/"
                                    aria-current={isRouteActive('/compare/', true) ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Comparisons
                                </Link>
                                <Link
                                    to="/signals/"
                                    aria-current={isRouteActive('/signals/', true) ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Insights
                                </Link>

                                <div className="pt-3 pb-1 text-[11px] font-mono uppercase tracking-wider text-neutral-500">
                                    Docs, Guides &amp; Support
                                </div>
                                <div className="grid grid-cols-2 gap-2 pb-3 border-b border-neutral-200 dark:border-white/10">
                                    <a
                                        href="/docs/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-medium text-black dark:text-white flex items-center justify-between active:scale-[0.97] transition"
                                    >
                                        <span>Docs</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                                    </a>
                                    <a
                                        href="/guides/top-10-sovereign-ai-platforms-india/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-medium text-black dark:text-white flex items-center justify-between active:scale-[0.97] transition"
                                    >
                                        <span>Guides</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                                    </a>
                                    <a
                                        href="/support/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-medium text-black dark:text-white flex items-center justify-between active:scale-[0.97] transition"
                                    >
                                        <span>Support</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                                    </a>
                                    <Link
                                        to="/resources/"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="min-h-[44px] px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-white/10 text-sm font-medium text-black dark:text-white flex items-center justify-between active:scale-[0.97] transition"
                                    >
                                        <span>Resources</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                                    </Link>
                                </div>

                                <Link
                                    to="/authors/chaman-shah/"
                                    aria-current={isRouteActive('/authors/chaman-shah/') ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Principal Architect
                                </Link>
                                <Link
                                    to="/portfolio/"
                                    aria-current={isRouteActive('/portfolio/') ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-black dark:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
                                >
                                    Portfolio
                                </Link>
                                <Link
                                    to="/enterprise-ai-bangalore/"
                                    aria-current={isRouteActive('/enterprise-ai-bangalore/') ? 'page' : undefined}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="min-h-[44px] flex items-center text-base font-medium text-neutral-500 hover:text-black dark:hover:text-white py-2.5 border-b border-neutral-200 dark:border-white/10 active:scale-[0.97] transition"
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
                                        aria-current={isRouteActive('/waitlist/') ? 'page' : undefined}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-3 px-6 rounded-full border border-neutral-200 dark:border-white/10 text-neutral-600 dark:text-neutral-300 font-medium text-center text-xs active:scale-[0.97] transition"
                                    >
                                        ele-in Waitlist &rarr;
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
