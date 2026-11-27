import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe2, X, ArrowRight } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface GeoRecommendation {
    regionCode: 'us' | 'uk' | 'ae';
    regionName: string;
    path: string;
    headline: string;
    subtitle: string;
    currencyTag: string;
}

export default function InternationalGeoBanner() {
    const location = useLocation()
    const [recommendation, setRecommendation] = useState<GeoRecommendation | null>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // 1. Check if user already dismissed geo suggestion
        const dismissed = sessionStorage.getItem('elesium_geo_dismissed')
        if (dismissed === 'true') {
            return
        }

        // 2. Identify client timezone
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
            const pathname = location.pathname.toLowerCase()

            let rec: GeoRecommendation | null = null

            // Detect US Timezones
            if (
                timeZone.startsWith('America/') &&
                !timeZone.includes('Sao_Paulo') &&
                !timeZone.includes('Buenos_Aires') &&
                !timeZone.includes('Bogota') &&
                !pathname.startsWith('/us')
            ) {
                rec = {
                    regionCode: 'us',
                    regionName: 'United States',
                    path: '/us/',
                    headline: 'Visiting from the United States?',
                    subtitle: 'Switch to our US Enterprise AI Portal for AWS us-east-1 sovereign VPC pods, HIPAA/SOC-2 compliance, and USD pricing.',
                    currencyTag: 'USD ($)'
                }
            }
            // Detect UK Timezones
            else if (
                (timeZone === 'Europe/London' || timeZone === 'GB' || timeZone.startsWith('Europe/Belfast')) &&
                !pathname.startsWith('/uk')
            ) {
                rec = {
                    regionCode: 'uk',
                    regionName: 'United Kingdom',
                    path: '/uk/',
                    headline: 'Visiting from the United Kingdom?',
                    subtitle: 'Switch to our UK Enterprise Portal for FCA PS21/3 compliance, AWS London eu-west-2 residency, and GBP pricing.',
                    currencyTag: 'GBP (£)'
                }
            }
            // Detect UAE / Gulf Timezones
            else if (
                (timeZone === 'Asia/Dubai' || timeZone === 'Asia/Muscat' || timeZone === 'Asia/Riyadh' || timeZone === 'Asia/Qatar') &&
                !pathname.startsWith('/ae')
            ) {
                rec = {
                    regionCode: 'ae',
                    regionName: 'United Arab Emirates',
                    path: '/ae/',
                    headline: 'Visiting from the UAE or Middle East?',
                    subtitle: 'Switch to our UAE Enterprise Portal for DIFC/ADGM compliance, AWS me-central-1 residency, and AED pricing.',
                    currencyTag: 'AED (د.إ)'
                }
            }

            if (rec) {
                setRecommendation(rec)
                // Small delay so page content renders smoothly first
                const timer = setTimeout(() => setIsVisible(true), 1200)
                return () => clearTimeout(timer)
            }
        } catch {
            // Fail open: never break page execution if Intl API fails
        }
    }, [location.pathname])

    const handleDismiss = () => {
        setIsVisible(false)
        sessionStorage.setItem('elesium_geo_dismissed', 'true')
    }

    return (
        <AnimatePresence>
            {isVisible && recommendation && (
                <motion.aside
                    aria-label="Regional Portal Selector"
                    initial={{ opacity: 0, y: 16, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 16, scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 left-4 sm:right-5 sm:left-auto sm:max-w-md z-50"
                >
                    <div className="p-5 sm:p-6 rounded-[28px] bg-white/95 dark:bg-black/95 backdrop-blur-md border border-neutral-200 dark:border-white/10 shadow-2xl text-black dark:text-white flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-white/10 flex items-center justify-center text-black dark:text-white shrink-0">
                                    <Globe2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-semibold block">
                                        Regional Portal &bull; {recommendation.currencyTag}
                                    </span>
                                    <h4 className="text-sm font-bold text-black dark:text-white leading-tight">
                                        {recommendation.headline}
                                    </h4>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleDismiss}
                                aria-label="Dismiss recommendation"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2 -mt-2 text-neutral-500 hover:text-black dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors active:scale-[0.97] shrink-0"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-neutral-500 leading-relaxed">
                            {recommendation.subtitle}
                        </p>

                        <div className="flex flex-col min-[380px]:flex-row items-stretch min-[380px]:items-center gap-2.5 pt-1">
                            <Link
                                to={recommendation.path}
                                onClick={() => setIsVisible(false)}
                                className="flex-1 py-2.5 px-4 rounded-full bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition active:scale-[0.97] hover:opacity-90 flex items-center justify-center gap-1.5 text-center"
                            >
                                <span>Switch to {recommendation.regionName} Portal</span>
                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                            </Link>
                            <button
                                type="button"
                                onClick={handleDismiss}
                                className="py-2.5 px-4 rounded-full border border-neutral-200 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white text-xs font-medium transition active:scale-[0.97] text-center"
                            >
                                Stay on Global
                            </button>
                        </div>
                    </div>
                </motion.aside>
            )}
        </AnimatePresence>
    )
}
