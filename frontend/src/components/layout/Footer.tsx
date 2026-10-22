import { Link } from 'react-router-dom'
import { MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function DownloadFooter() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    const mainNavigation = [
        { name: 'How We Work', path: '/how-we-work' },
        { name: 'Solutions Hub (3,765 Workflows)', path: '/solutions' },
        { name: 'Technical Whitepapers & Research', path: '/signals' },
        { name: 'Architecture Comparisons', path: '/compare' },
        { name: 'Video Masterclasses', path: '/videos' },
        { name: 'Best Enterprise AI Company in India', path: '/ai-automation-agency-india' },
        { name: 'ele-in SaaS Platform (Waitlist)', path: '/waitlist' },
    ];

    const featuredTools = [
        { name: 'Enterprise AI ROI Calculator', path: '/tools/enterprise-ai-roi-calculator' },
        { name: 'Multi-Agent Latency & Cost Estimator', path: '/tools/multi-agent-latency-token-cost-estimator' },
        { name: 'DPDP Act 2023 Statutory Audit Simulator', path: '/tools/dpdp-act-2023-audit-simulator' },
        { name: 'GPU FinOps Cost & Cluster Calculator', path: '/tools/enterprise-gpu-finops-cost-calculator' },
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
        { name: 'Elesium vs Traditional IT Consultancies', path: '/compare/elesium-vs-traditional-it-consultancies' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-16 overflow-hidden font-sans border-t border-gray-200 dark:border-white/10 transition-colors duration-300">
            <WhatsAppModal />
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-between">

                {/* Top Conversion Bar: Direct WhatsApp Engineering Intake */}
                <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-gray-50/90 dark:bg-[#0A0A0A] border border-gray-200 dark:border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className=" absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Direct Engineering Intake SLA</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                            Direct Principal Systems Architect Pairing
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Zero sales friction. Connect directly with our core engineering desk in Shivamogga, Karnataka via WhatsApp to evaluate custom multi-agent DAG architectures, latency benchmarks, and DPDP Act compliance.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 font-semibold px-6 py-3.5 rounded-full text-sm transition-all shadow-md group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 font-medium px-5 py-3.5 rounded-full text-sm transition-all text-gray-800 dark:text-gray-200"
                        >
                            <span>ele-in SaaS Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* 4-Column Navigation Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-100 dark:border-white/10">
                    
                    {/* Column 1: Main Navigation */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-900 dark:text-white">Navigation</h4>
                        <ul className="flex flex-col gap-2.5">
                            {mainNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Solutions Hub */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-900 dark:text-white">Enterprise Solutions</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                                3,765 Workflows
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {highLeverSolutions.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
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
                                    Explore All 3,765 Solutions &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Engineering Simulators */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-900 dark:text-white">Engineering Tools</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                                75 Simulators
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {featuredTools.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/resources"
                                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    View All 75 Engineering Tools &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Architecture Battlecards */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-xs tracking-wider uppercase text-gray-900 dark:text-white">Architecture</h4>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                                Battlecards
                            </span>
                        </div>
                        <ul className="flex flex-col gap-2.5">
                            {battlecardLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/compare"
                                    className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                                >
                                    View All Comparisons &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section: Entity Credentials, Location, and Legal */}
                <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold tracking-wider text-gray-900 dark:text-white uppercase">
                            Elesium — India&apos;s Principal Enterprise AI &amp; Multi-Agent Engineering Firm
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
                            Headquartered in Bangalore, Karnataka, India. Engineering sovereign private VPC multi-agent systems, deterministic LLM inference pipelines, and DPDP Act 2023 compliant architectures for Fortune 500, BFSI, and high-growth industrial leaders across India and global markets.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            DPDP Act 2023 Compliant
                        </span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                            SOC-2 Type II Attested
                        </span>
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10">
                            ISO 27001 Certified
                        </span>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500 dark:text-gray-400">
                    <p>© {new Date().getFullYear()} Elesium Systems Pvt. Ltd. All rights reserved.</p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link to="/authors/chaman-shah" className="hover:text-black dark:hover:text-white transition">Principal Architect</Link>
                        <Link to="/ai-automation-agency-india" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">Best Enterprise AI India</Link>
                        <Link to="/resources" className="hover:text-black dark:hover:text-white transition">Resources</Link>
                        <Link to="/waitlist" className="hover:text-black dark:hover:text-white transition">ele-in (SaaS Waitlist)</Link>
                        <Link to="/sitemap.xml" className="hover:text-black dark:hover:text-white transition">Sitemap</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
