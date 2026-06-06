import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedThemeToggler } from '../ui/AnimatedThemeToggler'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { MandateApplicationForm } from '../features/WaitingListForm'
import logo from '../../Assets/LOGO_NEW.png'

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const scrollToCaseStudies = () => {
        if (location.pathname !== '/') {
            navigate('/')
            setTimeout(() => {
                const section = document.getElementById('case-studies');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        } else {
            const section = document.getElementById('case-studies');
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 dark:border-b dark:border-white/10 transition-colors duration-300" style={{ height: '52px' }}>
                <div className="max-w-[1440px] mx-auto px-6 md:px-12 h-full flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 cursor-pointer">
                        <img
                            src={logo}
                            alt="Elesium"
                            className="h-8 md:h-10 w-auto object-contain transition-all hover:opacity-90 drop-shadow-sm"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
                        <Link
                            to="/how-we-work"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            How We Work
                        </Link>
                        <Link
                            to="/industries"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Industries
                        </Link>
                        <button
                            onClick={scrollToCaseStudies}
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Case Studies
                        </button>
                        <Link
                            to="/signals"
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Market Signals
                        </Link>
                    </div>

                    {/* CTA & Theme Toggler (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <AnimatedThemeToggler />
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton id="nav-mandate-cta" className="h-8 px-3 text-xs">
                                    Apply Now
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <MandateApplicationForm />
                            </ExpandableScreenContent>
                        </ExpandableScreen>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="flex md:hidden items-center gap-4">
                        <AnimatedThemeToggler />
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
                                to="/how-we-work"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                How We Work
                            </Link>
                            <Link
                                to="/industries"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Industries
                            </Link>
                            <button
                                onClick={scrollToCaseStudies}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Case Studies
                            </button>
                            <Link
                                to="/signals"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-medium text-left text-blue-600 dark:text-blue-400 py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Market Signals
                            </Link>

                            <div className="mt-8 w-full">
                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <InteractiveHoverButton className="w-full justify-center h-10 text-sm">
                                            Apply Now
                                        </InteractiveHoverButton>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <MandateApplicationForm />
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
