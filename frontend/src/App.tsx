import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
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
const Solutions = lazy(() => import('./components/sections/Solutions'))
const AIAutomation = lazy(() => import('./components/pages/AIAutomation'))
const HowWeWork = lazy(() => import('./components/pages/HowWeWork'))
const Industries = lazy(() => import('./components/pages/Industries'))
const MarketSignals = lazy(() => import('./components/pages/MarketSignals'))
const Resources = lazy(() => import('./components/pages/Resources'))
const ResourceDetail = lazy(() => import('./components/pages/ResourceDetail'))
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
        </motion.div>
    )
}

function App() {
    const location = useLocation();

    // Since we're using React Router now, the Navbar and Footer are rendered once outside Routes
    // and we only animate the inner content changing.
    
    // Scroll to top on route change
    useEffect(() => {
        // Reset scroll position immediately on route change
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, [location.pathname]);

    return (
        <div className="relative min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col">
            <SmoothScroll />
            <NoiseOverlay />
            {!location.pathname.startsWith('/resources') && <Navbar />}

            <div className="flex-1 min-h-[100vh] flex flex-col relative">
                <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo({ top: 0, left: 0, behavior: 'instant' })}>
                    <Suspense fallback={<Preloader />}>
                        <Routes location={location} key={location.pathname}>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/how-we-work" element={<HowWeWork />} />
                            <Route path="/industries" element={<Navigate to="/markets" replace />} />
                            <Route path="/markets" element={<Industries />} />
                            <Route path="/signals" element={<MarketSignals />} />
                            <Route path="/signals/:slug" element={<MarketSignals />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/resources/:slug" element={<ResourceDetail />} />
                            <Route path="/ai-automation" element={<AIAutomation />} />
                        </Routes>
                    </Suspense>
                </AnimatePresence>
            </div>

            <DownloadFooter />
        </div>
    )
}

export default App
