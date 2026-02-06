// import { useState, useEffect } from 'react'
import { AnimatedThemeToggler } from '../ui/AnimatedThemeToggler'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { ExpandableScreen, ExpandableScreenTrigger, ExpandableScreenContent } from '../ui/expandable-screen'
import { WaitingListForm } from '../features/WaitingListForm'

import logo from '../../Assets/LOGO_NEW.png'

interface NavbarProps {
    onNavigate?: (page: 'home' | 'how-we-work' | 'industries') => void;
}

export default function Navbar({ onNavigate }: NavbarProps) {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md dark:bg-black/95 dark:border-b dark:border-white/10 transition-colors duration-300" style={{ height: '52px' }}>
            <div className="max-w-[1440px] mx-auto px-4 md:px-12 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate?.('home')}>
                    <img
                        src={logo}
                        alt="Elesium"
                        className="h-10 w-auto object-contain transition-all hover:opacity-90 drop-shadow-sm"
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

                {/* CTA & Theme Toggler */}
                <div className="flex items-center gap-6">
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
            </div>
        </nav>
    )
}
