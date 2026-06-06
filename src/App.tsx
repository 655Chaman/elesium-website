import { Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
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

function HomePage() {
    return (
        <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="relative z-10"
        >
            <HeroSection />
            <AgentIntro />
            {/* Active Signals Ledger */}
            <ActiveSignals />
            {/* Lazy Loaded Sections */}
            <FeatureExplorer />
            <Solutions />
            <CaseStudies />
        </motion.div>
    )
}

function App() {
    const location = useLocation();

    // Since we're using React Router now, the Navbar and Footer are rendered once outside Routes
    // and we only animate the inner content changing.

    return (
        <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col">
            <SmoothScroll />
            <NoiseOverlay />
            <Navbar />

            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <Suspense fallback={<Preloader />}>
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/how-we-work" element={<HowWeWork />} />
                            <Route path="/industries" element={<Industries />} />
                            <Route path="/signals" element={<MarketSignals />} />
                            <Route path="/signals/:slug" element={<MarketSignals />} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </div>

            <DownloadFooter />
        </div>
    )
}

export default App
