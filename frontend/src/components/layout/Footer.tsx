import { Link } from 'react-router-dom'

export default function DownloadFooter() {
    const handleNavigation = () => {
        // no-op if no longer needed, keeping for structure
    };

    const footerSections = [
        { name: 'How We Work', path: '/how-we-work' },
        { name: 'Markets', path: '/markets' },
        { name: 'AI Automation', path: '/ai-automation' },
        { name: 'India Enterprise', path: '/ai-automation-agency-india' },
        { name: 'Masterclasses', path: '/videos' },
        { name: 'Market Signals', path: '/signals' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-24 lg:py-32 overflow-hidden font-sans border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-[95%] mx-auto px-5 md:px-6 flex flex-col min-h-[40vh] md:min-h-[80vh] justify-between">

                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between w-full items-start gap-8 md:gap-0">

                    <div className="flex gap-24 md:gap-32 pr-4 md:pr-12">
                        <div className="flex flex-col gap-6">
                            <h4 className="font-normal text-lg text-gray-900 dark:text-white">Explore</h4>
                            <ul className="flex flex-col gap-4">
                                {footerSections.map((item) => (
                                    <li key={item.name}>
                                        {item.path ? (
                                            <Link
                                                to={item.path}
                                                className={`text-[#3C4043] dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-[15px] text-left`}
                                            >
                                                {item.name}
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => handleNavigation()}
                                                className={`text-[#3C4043] dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-[15px] text-left`}
                                            >
                                                {item.name}
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: tagline + verified badges */}
                    <div className="flex flex-col items-start md:items-end gap-4 text-left md:text-right max-w-sm">
                        <div className="flex flex-col gap-2">
                            <span className="text-[11px] font-medium tracking-[0.06em] text-gray-400 dark:text-gray-600 uppercase">
                                Enterprise AI Engineering | India & Global
                            </span>
                            <p className="text-sm text-gray-400 dark:text-gray-600 leading-relaxed">
                                Bangalore, India<br />
                                Architecting autonomous systems for Indian & Global Enterprises.<br />
                                Exclusive intake. Hard ROI focus.<br />
                                Multi-Agent Infrastructure & Private LLM Deployments.
                            </p>
                        </div>

                        {/* Directory Authority Badges (GoodFirms & Clutch) */}
                        <div className="flex flex-wrap items-center gap-3 pt-2">
                            <a
                                href="https://www.goodfirms.co/company/elesium-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] hover:border-amber-500/50 dark:hover:border-amber-400/50 hover:bg-amber-500/[0.05] transition-all duration-300"
                                title="Elesium Online on GoodFirms — Top AI Company"
                            >
                                <div className="w-5 h-5 rounded-md bg-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 font-bold text-[10px]">
                                    ★
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono tracking-wider uppercase text-gray-400 dark:text-gray-500 group-hover:text-amber-500 transition-colors">
                                        GoodFirms
                                    </span>
                                    <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
                                        Verified AI Agency
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://clutch.co/profile/elesium"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] hover:border-red-500/50 dark:hover:border-red-400/50 hover:bg-red-500/[0.05] transition-all duration-300"
                                title="Elesium on Clutch — Verified AI Partner"
                            >
                                <div className="w-5 h-5 rounded-md bg-red-500/20 flex items-center justify-center text-red-500 dark:text-red-400 font-bold text-[10px]">
                                    C
                                </div>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono tracking-wider uppercase text-gray-400 dark:text-gray-500 group-hover:text-red-500 transition-colors">
                                        Clutch
                                    </span>
                                    <span className="text-[11px] font-semibold text-gray-900 dark:text-white">
                                        Verified Partner
                                    </span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Massive Text Section */}
                <div className="w-full flex justify-center items-center py-8 md:py-12 flex-grow overflow-hidden">
                    <h1 className="text-[18vw] md:text-[18vw] leading-none font-medium tracking-tighter select-none -mb-[0.05em] text-center text-black dark:text-white transition-colors">
                        Elesium
                    </h1>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 md:gap-8 pb-4 pt-8 border-t border-gray-100 dark:border-white/5 transition-colors">
                    <div className="text-2xl font-medium text-[#5F6368] dark:text-gray-600">
                        Elesium.online
                    </div>

                    <div className="flex flex-wrap gap-8 text-[13px] text-[#5F6368] dark:text-gray-600 font-medium">
                        <span className="cursor-default">© 2026 Elesium</span>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
