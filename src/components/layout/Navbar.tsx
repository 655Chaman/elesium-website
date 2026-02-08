import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { AnimatedThemeToggler } from '../ui/AnimatedThemeToggler'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { WaitingListForm } from '../features/WaitingListForm'
import logo from '../../Assets/LOGO_NEW.png'

interface NavbarProps {
    onNavigate?: (page: 'home' | 'how-we-work' | 'industries') => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleMobileNavigate = (page: 'home' | 'how-we-work' | 'industries') => {
        onNavigate?.(page)
        setIsMobileMenuOpen(false)
    }

    const scrollToCaseStudies = () => {
        const section = document.getElementById('case-studies');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false)
    }

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 dark:border-b dark:border-white/10 transition-colors duration-300" style={{ height: '52px' }}>
                <div className="max-w-[1440px] mx-auto px-4 md:px-12 h-full flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleMobileNavigate('home')}>
                        <img
                            src={logo}
                            alt="Elesium"
                            className="h-8 md:h-10 w-auto object-contain transition-all hover:opacity-90 drop-shadow-sm"
                        />
                    </div>


                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center" style={{ gap: '4px' }}>
                        <button
                            onClick={() => onNavigate?.('how-we-work')}
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            How We Work
                        </button>

                        <button
                            onClick={() => onNavigate?.('industries')}
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Industries
                        </button>
                        <button
                            onClick={() => {
                                const section = document.getElementById('case-studies');
                                if (section) {
                                    section.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                            className="btn-nav dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
                        >
                            Case Studies
                        </button>
                    </div>

                    {/* CTA & Theme Toggler (Desktop) */}
                    <div className="hidden md:flex items-center gap-6">
                        <AnimatedThemeToggler />
                        <ExpandableScreen>
                            <ExpandableScreenTrigger>
                                <InteractiveHoverButton className="h-10 px-4 text-sm">
                                    Explore
                                </InteractiveHoverButton>
                            </ExpandableScreenTrigger>
                            <ExpandableScreenContent>
                                <WaitingListForm />
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
                            <button
                                onClick={() => handleMobileNavigate('how-we-work')}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                How We Work
                            </button>
                            <button
                                onClick={() => handleMobileNavigate('industries')}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Industries
                            </button>
                            <button
                                onClick={scrollToCaseStudies}
                                className="text-2xl font-medium text-left text-gray-900 dark:text-white py-4 border-b border-gray-100 dark:border-white/10"
                            >
                                Case Studies
                            </button>

                            <div className="mt-8 w-full">
                                <ExpandableScreen>
                                    <ExpandableScreenTrigger>
                                        <InteractiveHoverButton className="w-full justify-center h-12 text-lg">
                                            Explore Features
                                        </InteractiveHoverButton>
                                    </ExpandableScreenTrigger>
                                    <ExpandableScreenContent>
                                        <WaitingListForm />
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
