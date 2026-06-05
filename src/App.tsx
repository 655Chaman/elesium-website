import { useState, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import HeroSection from './components/sections/Hero'
import AgentIntro from './components/sections/AgentIntro'
import ActiveSignals from './components/sections/ActiveSignals'
import DownloadFooter from './components/layout/Footer'
import SmoothScroll from './components/ui/SmoothScroll'
import NoiseOverlay from './components/ui/NoiseOverlay'
import Preloader from './components/ui/Preloader'

// Lazy load heavy below-the-fold components and secondary pages
const FeatureExplorer = lazy(() => import('./components/sections/FeatureExplorer'))
const CaseStudies = lazy(() => import('./components/sections/CaseStudies'))
const Solutions = lazy(() => import('./components/sections/Solutions'))
const HowWeWork = lazy(() => import('./components/pages/HowWeWork'))
const Industries = lazy(() => import('./components/pages/Industries'))
const MarketSignals = lazy(() => import('./components/pages/MarketSignals'))

type ViewType = 'home' | 'how-we-work' | 'industries' | 'market-signals'

function App() {
    const [view, setView] = useState<ViewType>('home')

    return (
        <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <SmoothScroll />
            <NoiseOverlay />

            <AnimatePresence mode="wait">
                <Suspense fallback={<Preloader />}>
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

                            {/* Active Signals Ledger */}
                            <ActiveSignals />

                            {/* Lazy Loaded Sections */}
                            <FeatureExplorer />
                            <Solutions />
                            <CaseStudies />

                            <DownloadFooter onNavigate={(page) => setView(page)} />
                        </motion.div>
                    ) : view === 'how-we-work' ? (
                        <HowWeWork key="how-we-work" onBack={() => setView('home')} />
                    ) : view === 'market-signals' ? (
                        <MarketSignals key="market-signals" onBack={() => setView('home')} />
                    ) : (
                        <Industries key="industries" onBack={() => setView('home')} />
                    )}
                </Suspense>
            </AnimatePresence>
        </div>
    )
}

export default App
