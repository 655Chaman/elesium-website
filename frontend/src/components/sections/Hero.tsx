import { Link } from 'react-router-dom'
import { InteractiveHoverButton } from '../ui/InteractiveHoverButton'
import { useWhatsApp } from '../../hooks/useWhatsApp'
import logo from '../../assets/LOGO_EMBLEM.png'

export default function HeroSection() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    return (
        <section
            className="relative flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-300 min-h-[calc(100svh-56px)] pt-[56px]"
        >
            <div className="min-h-[420px] md:min-h-[680px] flex items-center w-full py-8 md:py-20">
                <div
                    className="text-center px-5 md:px-12 w-full"
                    style={{ maxWidth: '920px', margin: '0 auto' }}
                >
                    <div className="relative flex flex-col items-center justify-center select-none">
                        {/* Subtle Centered Watermark */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
                            <img
                                src={logo}
                                alt="Elesium Background Watermark"
                                width="176"
                                height="176"
                                loading="lazy"
                                fetchPriority="low"
                                className="w-32 h-32 md:w-44 md:h-44 object-contain opacity-[0.06] dark:opacity-[0.10] select-none pointer-events-none"
                            />
                        </div>

                        <div className="relative z-10 flex flex-col items-center mb-3 md:mb-5">
                            <span className="text-[11px] font-mono tracking-[0.26em] uppercase text-neutral-500 dark:text-neutral-400">
                                Elesium AI &amp; Automation &middot; Shivamogga &amp; Bengaluru
                            </span>
                        </div>

                        <h1 className="hero-h1 relative z-10 mb-4 md:mb-6 text-center mx-auto text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-white">
                            Enterprise AI &amp; Automation Built for Real Work
                        </h1>
                    </div>

                    <p className="body-text mb-6 md:mb-10 mx-auto text-neutral-600 dark:text-neutral-400 text-base md:text-lg max-w-2xl leading-relaxed">
                        We build custom automation inside your private cloud or on-premise servers, eliminating manual bottlenecks across finance, ERP, and operations with full data privacy and a clear 90-day return.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6 md:mb-12">
                        <InteractiveHoverButton
                            id="hero-mandate-cta"
                            className="w-full sm:w-auto h-11 px-7 rounded-full text-sm active:scale-[0.97]"
                            onClick={openWhatsApp}
                        >
                            Talk to an Engineer
                        </InteractiveHoverButton>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-11 px-6 text-xs sm:text-sm font-medium rounded-full border border-neutral-200 dark:border-white/15 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-white/10 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5"
                        >
                            Join ele-in Waitlist &rarr;
                        </Link>
                        <WhatsAppModal />
                    </div>

                    {/* Clean Core Proof Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 items-stretch max-w-3xl mx-auto pt-6 md:pt-8 border-t border-neutral-200 dark:border-white/10">
                        <div className="p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center flex flex-col justify-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">First Pilot</div>
                            <div className="text-base font-bold text-black dark:text-white mt-0.5">14 Days</div>
                            <div className="text-[11px] text-neutral-500">In your staging stack</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center flex flex-col justify-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Payback Goal</div>
                            <div className="text-base font-bold text-black dark:text-white mt-0.5">90 Days</div>
                            <div className="text-[11px] text-neutral-500">Measurable ROI SLA</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center flex flex-col justify-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Hosting</div>
                            <div className="text-base font-bold text-black dark:text-white mt-0.5">Private Cloud</div>
                            <div className="text-[11px] text-neutral-500">Or on-premise servers</div>
                        </div>
                        <div className="p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-white/10 text-center flex flex-col justify-center">
                            <div className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">Privacy</div>
                            <div className="text-base font-bold text-black dark:text-white mt-0.5">DPDP Ready</div>
                            <div className="text-[11px] text-neutral-500">Zero outside sharing</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
