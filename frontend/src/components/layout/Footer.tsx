import { Link } from 'react-router-dom'

export default function DownloadFooter() {
    const mainNavigation = [
        { name: 'How We Work', path: '/how-we-work' },
        { name: 'Solutions Hub', path: '/solutions' },
        { name: 'Technical Whitepapers', path: '/signals' },
        { name: 'Architecture Comparisons', path: '/compare' },
        { name: 'Video Masterclasses', path: '/videos' },
        { name: 'Best Enterprise AI Company in India', path: '/ai-automation-agency-india' },
        { name: 'Schedule Architecture Audit', path: '/waitlist' },
    ];

    const featuredTools = [
        { name: 'Enterprise AI ROI Calculator', path: '/tools/enterprise-ai-roi-calculator' },
        { name: 'Multi-Agent Latency & Cost Estimator', path: '/tools/multi-agent-latency-token-cost-estimator' },
        { name: 'DPDP Act 2023 Audit Simulator', path: '/tools/dpdp-act-2023-audit-simulator' },
        { name: 'GPU FinOps Cost Calculator', path: '/tools/enterprise-gpu-finops-cost-calculator' },
        { name: 'DeepSeek-V3 Unified Fabric Simulator', path: '/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator' },
        { name: 'DualPipe Pipeline Parallelism Simulator', path: '/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator' },
    ];

    const highLeverSolutions = [
        { name: 'AI Automation Agency for Logistics', path: '/solutions/ai-automation-agency-for-logistics' },
        { name: 'Autonomous Loan Underwriting AI for NBFCs', path: '/solutions/autonomous-loan-underwriting-ai-for-nbfcs' },
        { name: 'Deterministic Multi-Agent Systems for Manufacturing ERP', path: '/solutions/deterministic-multi-agent-systems-for-manufacturing-erp' },
        { name: 'Private VPC Air-Gapped LLM Deployment for Healthcare', path: '/solutions/private-vpc-air-gapped-llm-deployment-for-healthcare' },
        { name: 'SAP S/4HANA Autonomous AI Integration Agency', path: '/solutions/sap-s4hana-autonomous-ai-integration-agency' },
    ];

    const battlecardLinks = [
        { name: 'LangGraph vs CrewAI Enterprise', path: '/compare/langgraph-vs-crewai-enterprise' },
        { name: 'Private VPC vLLM vs Azure OpenAI', path: '/compare/private-vpc-vllm-vs-azure-openai' },
        { name: 'Custom Agents vs Zapier Enterprise', path: '/compare/custom-multi-agent-systems-vs-zapier-enterprise' },
        { name: 'Deterministic FSM vs ReAct Loops', path: '/compare/deterministic-state-machines-vs-react-agents' },
        { name: 'Elesium vs IT Consultancies', path: '/compare/elesium-vs-traditional-it-consultancies' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-20 overflow-hidden font-sans border-t border-gray-100 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-between">

                {/* Top Section - 4 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-100 dark:border-white/10">
                    
                    {/* Column 1: Navigation */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-sm tracking-wider uppercase text-gray-900 dark:text-white">Navigation</h4>
                        <ul className="flex flex-col gap-2.5">
                            {mainNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-[#3C4043] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Solutions */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm tracking-wider uppercase text-gray-900 dark:text-white">Solutions</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                3,765 Workflows
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {highLeverSolutions.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-[#3C4043] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/solutions"
                                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    Explore All 3,765 Solutions →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Engineering Tools */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm tracking-wider uppercase text-gray-900 dark:text-white">Tools & Simulators</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                75 Interactive
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {featuredTools.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-[#3C4043] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/resources"
                                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                                >
                                    View All 75 Engineering Tools →
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Architecture & Comparisons */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm tracking-wider uppercase text-gray-900 dark:text-white">Architecture</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                Battlecards
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {battlecardLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-[#3C4043] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/compare"
                                    className="text-xs font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                                >
                                    View All Comparisons →
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Entity Credentials, Location, and Legal */}
                <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
                            Elesium — India's Principal Enterprise AI & Multi-Agent Engineering Firm
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                            Headquartered in Bangalore, Karnataka, India. Engineering sovereign private VPC multi-agent systems, deterministic LLM inference pipelines, and DPDP Act 2023 compliant architectures for Fortune 500, BFSI, and high-growth industrial leaders across India and global markets.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800">
                            DPDP Act 2023 Compliant
                        </span>
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800">
                            SOC-2 Type II Attested
                        </span>
                        <span className="text-[11px] font-mono px-2 py-1 rounded bg-gray-100 dark:bg-slate-900 text-gray-700 dark:text-slate-300 border border-gray-200 dark:border-slate-800">
                            ISO 27001 Certified
                        </span>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-400">
                    <p>© {new Date().getFullYear()} Elesium Systems Pvt. Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        <Link to="/authors/chaman-shah" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Principal Architect</Link>
                        <Link to="/ai-automation-agency-india" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Best Enterprise AI India</Link>
                        <Link to="/resources" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Resources</Link>
                        <Link to="/waitlist" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Contact & Audit</Link>
                        <Link to="/sitemap.xml" className="hover:text-gray-600 dark:hover:text-gray-300 transition">Sitemap</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
