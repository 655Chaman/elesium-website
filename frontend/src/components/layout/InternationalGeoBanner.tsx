import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Globe2, X, ArrowRight } from 'lucide-react'

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

    if (!isVisible || !recommendation) {
        return null
    }

    return (
        <aside
            aria-label="Regional Portal Selector"
            className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
        >
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border border-emerald-500/30 shadow-2xl text-gray-900 dark:text-gray-100 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                            <Globe2 className="w-4 h-4" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold block">
                                Regional Geolocation &bull; {recommendation.currencyTag}
                            </span>
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                                {recommendation.headline}
                            </h4>
                        </div>
                    </div>
                    <button
                        onClick={handleDismiss}
                        aria-label="Dismiss recommendation"
                        className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 p-1 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                    {recommendation.subtitle}
                </p>

                <div className="flex items-center gap-2.5 pt-1">
                    <Link
                        to={recommendation.path}
                        onClick={() => setIsVisible(false)}
                        className="flex-1 py-2 px-3.5 rounded-xl bg-black text-white dark:bg-white dark:text-black font-semibold text-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                        <span>Switch to {recommendation.regionName} Portal</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                        onClick={handleDismiss}
                        className="py-2 px-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-xs font-medium transition-colors"
                    >
                        Stay on Global
                    </button>
                </div>
            </div>
        </aside>
    )
}
