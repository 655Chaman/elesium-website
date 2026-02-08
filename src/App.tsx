import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/Hero'
import AgentIntro from './components/sections/AgentIntro'
import FeatureExplorer from './components/sections/FeatureExplorer'
import CaseStudies from './components/sections/CaseStudies'
import Solutions from './components/sections/Solutions'
import DownloadFooter from './components/layout/Footer'
import { SmoothCursor } from './components/ui/SmoothCursor'
import SmoothScroll from './components/ui/SmoothScroll'
import NoiseOverlay from './components/ui/NoiseOverlay'
import HowWeWork from './components/pages/HowWeWork'

import Industries from './components/pages/Industries'

function App() {
    const [view, setView] = useState<'home' | 'how-we-work' | 'industries'>('home')

    return (
        <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-300">
            {/* Smooth Cursor */}
            <SmoothCursor />
            <SmoothScroll />
            <NoiseOverlay />

            <AnimatePresence mode="wait">
                {view === 'home' ? (
                    <motion.div
                        key="home"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="relative z-10"
                    >
                        <Navbar onNavigate={(page) => setView(page)} />
                        <HeroSection />

                        <AgentIntro />
                        <FeatureExplorer />
                        <Solutions />
                        <CaseStudies />
                        <DownloadFooter onNavigate={(page) => setView(page)} />
                    </motion.div>
                ) : view === 'how-we-work' ? (
                    <HowWeWork key="how-we-work" onBack={() => setView('home')} />
                ) : (
                    <Industries key="industries" onBack={() => setView('home')} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default App
