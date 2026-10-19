import { Link } from 'react-router-dom'

export default function DownloadFooter() {
    const footerSections = [
        { name: 'Solutions Hub', path: '/solutions' },
        { name: 'How We Work', path: '/how-we-work' },
        { name: 'Markets', path: '/markets' },
        { name: 'AI Automation', path: '/ai-automation' },
        { name: 'India Enterprise', path: '/ai-automation-agency-india' },
        { name: 'Enterprise AI ROI Calculator', path: '/tools/enterprise-ai-roi-calculator' },
        { name: 'Schedule Architecture Audit', path: '/waitlist' },
        { name: 'Masterclasses', path: '/videos' },
        { name: 'Market Signals', path: '/signals' },
    ];

    const highLeverSolutions = [
        { name: 'AI Automation Agency for Logistics', path: '/solutions/ai-automation-agency-for-logistics' },
        { name: 'Autonomous Loan Underwriting AI for NBFCs', path: '/solutions/autonomous-loan-underwriting-ai-for-nbfcs' },
        { name: 'Deterministic Multi-Agent Systems for Manufacturing ERP', path: '/solutions/deterministic-multi-agent-systems-for-manufacturing-erp' },
        { name: 'Private VPC Air-Gapped LLM Deployment for Healthcare', path: '/solutions/private-vpc-air-gapped-llm-deployment-for-healthcare' },
        { name: 'SAP S/4HANA Autonomous AI Integration Agency', path: '/solutions/sap-s4hana-autonomous-ai-integration-agency' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-24 lg:py-32 overflow-hidden font-sans border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-[95%] mx-auto px-5 md:px-6 flex flex-col min-h-[40vh] md:min-h-[80vh] justify-between">

                {/* Top Section */}
                <div className="flex flex-col lg:flex-row justify-between w-full items-start gap-8 lg:gap-0">

                    <div className="flex flex-col sm:flex-row gap-12 sm:gap-16 md:gap-24 pr-4 md:pr-12">
                        {/* Explore Column */}
                        <div className="flex flex-col gap-5">
                            <h4 className="font-normal text-lg text-gray-900 dark:text-white">Explore</h4>
                            <ul className="flex flex-col gap-3.5">
                                {footerSections.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className="text-[#3C4043] dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-[14px] text-left"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* High-Lever Solutions Column (1-Click Crawl Depth from Homepage) */}
                        <div className="flex flex-col gap-5 max-w-sm">
                            <div className="flex items-center gap-2">
                                <h4 className="font-normal text-lg text-gray-900 dark:text-white">Solutions</h4>
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                    BOFU
                                </span>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {highLeverSolutions.map((item) => (
                                    <li key={item.name}>
                                        <Link
                                            to={item.path}
                                            className="text-[#3C4043] dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors text-[13px] text-left line-clamp-1"
                                            title={item.name}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                                <li className="pt-1">
                                    <Link
                                        to="/solutions"
                                        className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                    >
                                        View All 20 Sovereign Workflows →
                                    </Link>
                                </li>
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

                        {/* Directory Authority Badges (GoodFirms & Clutch) - Monochrome Architecture */}
                        <div className="flex flex-wrap items-center gap-2.5 pt-2">
                            <a
                                href="https://www.goodfirms.co/company/elesium-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Elesium Online on GoodFirms — Top AI Company"
                            >
                                <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[9px] text-gray-700 dark:text-gray-300 font-mono">
                                    ✓
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        GoodFirms
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Verified AI Agency
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://clutch.co"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Clutch Verified AI Directory"
                            >
                                <span className="w-4 h-4 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[9px] text-gray-700 dark:text-gray-300 font-mono">
                                    ✓
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[9px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        Clutch
                                    </span>
                                    <span className="text-[11px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
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
