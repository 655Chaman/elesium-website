import { motion, useScroll, useTransform } from 'framer-motion'
import { useState } from 'react'

export default function AntigravityNav() {
    const [isOpen, setIsOpen] = useState(false)
    const { scrollY } = useScroll()

    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
    )

    const navItems = [
        { label: 'Industries', href: '#industries' },
        { label: 'Platform', href: '#platform' },
        { label: 'Use cases', href: '#use-cases' },
        { label: 'Resources', href: '#resources' },
    ]

    return (
        <motion.nav
            style={{ backgroundColor }}
            className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl transition-all duration-300"
        >
            <div className="max-w-[1440px] mx-auto px-[72px] py-5 flex items-center justify-between">
                {/* Logo */}
                <div className="text-xl font-semibold tracking-tight text-[#121317]">
                    Elesium
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="text-[14.5px] font-[430] text-[#121317] hover:text-[#4285F4] transition-colors duration-200"
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <button className="hidden md:block px-6 py-2.5 bg-[#121317] text-white rounded-full text-[14.5px] font-[430] hover:bg-[#45474D] transition-all duration-300">
                    Get started
                </button>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-[#121317]"
                >
                    {isOpen ? '✕' : '☰'}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 px-[72px] py-4">
                    {navItems.map((item) => (
                        <a
                            key={item.label}
                            href={item.href}
                            className="block py-3 text-[#121317] hover:text-[#4285F4]"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </a>
                    ))}
                    <button className="w-full mt-4 px-6 py-2.5 bg-[#121317] text-white rounded-full">
                        Get started
                    </button>
                </div>
            )}
        </motion.nav>
    )
}
