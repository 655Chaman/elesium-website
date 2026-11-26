import { Link } from 'react-router-dom'
import { MessageSquare, ArrowRight } from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export default function DownloadFooter() {
    const { openWhatsApp, WhatsAppModal } = useWhatsApp();

    const mainNavigation = [
        { name: 'Portal', path: '/' },
        { name: 'Connector Model', path: '/connector/' },
        { name: 'How We Work', path: '/how-we-work/' },
        { name: 'Solutions Hub', path: '/solutions/' },
        { name: 'Commercial Directory', path: '/commercial-directory.html' },
        { name: 'Technical Research', path: '/signals/' },
        { name: 'Architecture Comparisons', path: '/compare/' },
        { name: 'Video Masterclasses', path: '/videos/' },
        { name: 'Engineering Glossary', path: '/glossary/' },
        { name: 'ele-in Waitlist', path: '/waitlist/' },
    ];

    const featuredTools = [
        { name: 'Enterprise AI ROI Calculator', path: '/tools/enterprise-ai-roi-calculator/' },
        { name: 'Multi-Agent Latency & Cost Estimator', path: '/tools/multi-agent-latency-token-cost-estimator/' },
        { name: 'DPDP Act 2023 Statutory Audit Simulator', path: '/tools/dpdp-act-2023-audit-simulator/' },
        { name: 'GPU FinOps Cost & Cluster Calculator', path: '/tools/enterprise-gpu-finops-cost-calculator/' },
        { name: 'DeepSeek-V3 Unified Fabric Simulator', path: '/tools/enterprise-agent-deepseek-v3-serving-fabric-simulator/' },
        { name: 'DualPipe Pipeline Parallelism Simulator', path: '/tools/enterprise-agent-dualpipe-pipeline-parallelism-simulator/' },
    ];

    const highLeverSolutions = [
        { name: 'vLLM Banking VPCs in India', path: '/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india/' },
        { name: 'RBI CSF Core Banking HSM Telemetry', path: '/solutions/rbi-cyber-security-framework-categorized-air-gapped-core-banking-hsm-telemetry-for-payment-processors/' },
        { name: 'Sovereign DeepSeek Healthcare & HIPAA', path: '/solutions/sovereign-on-premise-deepseek-v3-clusters-for-healthcare-hipaa-and-disha-compliance/' },
        { name: 'SAP S/4HANA PLC Manufacturing Agents', path: '/solutions/sap-s4hana-manufacturing-work-order-auto-confirmation-agents-based-on-shopfloor-plc-counts-in-india/' },
        { name: 'Air-Gapped Contract Intelligence Agents', path: '/solutions/air-gapped-contract-intelligence-agents-for-mumbai-real-estate-firms-with-automated-title-search-parsing/' },
    ];

    const battlecardLinks = [
        { name: 'LangGraph vs CrewAI Enterprise', path: '/compare/langgraph-vs-crewai-enterprise/' },
        { name: 'Private VPC vLLM vs Azure OpenAI', path: '/compare/private-vpc-vllm-vs-azure-openai/' },
        { name: 'Custom Agents vs Zapier Enterprise', path: '/compare/custom-multi-agent-systems-vs-zapier-enterprise/' },
        { name: 'Deterministic FSM vs ReAct Loops', path: '/compare/deterministic-state-machines-vs-react-agents/' },
        { name: 'Elesium vs Traditional IT Consultancies', path: '/compare/elesium-vs-traditional-it-consultancies/' },
    ];

    return (
        <footer className="relative bg-white dark:bg-black text-black dark:text-white py-12 md:py-16 overflow-hidden font-sans border-t border-neutral-200 dark:border-white/10 transition-colors duration-300">
            <WhatsAppModal />
            <div className="max-w-[1440px] mx-auto px-6 md:px-12 flex flex-col justify-between">

                {/* Top Conversion Bar */}
                <div className="mb-12 p-6 sm:p-8 rounded-2xl bg-neutral-50 dark:bg-black border border-neutral-200 dark:border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-2xl">
                        <div className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                            Direct Engineering Intake
                        </div>
                        <p className="text-xl sm:text-2xl font-bold tracking-tight text-black dark:text-white">
                            Direct Principal Systems Architect Pairing
                        </p>
                        <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                            Connect directly with our principal engineering team in Koramangala, Bengaluru via WhatsApp to evaluate custom multi-agent DAG architectures, latency benchmarks, and DPDP Act compliance.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200 font-semibold px-6 py-3.5 rounded-full text-sm transition active:scale-[0.97] group"
                        >
                            <MessageSquare className="w-4 h-4 fill-current" />
                            <span>Chat on WhatsApp</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-neutral-200 dark:border-white/15 hover:bg-neutral-100 dark:hover:bg-white/10 font-medium px-5 py-3.5 rounded-full text-sm transition active:scale-[0.97] text-black dark:text-white"
                        >
                            <span>ele-in Waitlist &rarr;</span>
                        </Link>
                    </div>
                </div>

                {/* 4-Column Navigation Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-neutral-200 dark:border-white/10">

                    {/* Column 1: Main Navigation */}
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold text-xs tracking-wider uppercase text-black dark:text-white">Navigation</p>
                        <ul className="flex flex-col gap-2.5">
                            {mainNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors text-xs text-left"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Solutions Hub */}
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold text-xs tracking-wider uppercase text-black dark:text-white">Enterprise Solutions</p>
                        <ul className="flex flex-col gap-2.5">
                            {highLeverSolutions.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/solutions/"
                                    className="text-xs font-semibold text-black dark:text-white hover:underline flex items-center gap-1"
                                >
                                    Explore All Architectures &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Engineering Simulators */}
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold text-xs tracking-wider uppercase text-black dark:text-white">Engineering Tools</p>
                        <ul className="flex flex-col gap-2.5">
                            {featuredTools.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/resources/"
                                    className="text-xs font-semibold text-black dark:text-white hover:underline flex items-center gap-1"
                                >
                                    View All Engineering Tools &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Architecture Battlecards */}
                    <div className="flex flex-col gap-4">
                        <p className="font-semibold text-xs tracking-wider uppercase text-black dark:text-white">Architecture</p>
                        <ul className="flex flex-col gap-2.5">
                            {battlecardLinks.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-neutral-500 hover:text-black dark:hover:text-white transition-colors text-xs text-left line-clamp-1"
                                        title={item.name}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                            <li className="pt-1">
                                <Link
                                    to="/compare/"
                                    className="text-xs font-semibold text-black dark:text-white hover:underline flex items-center gap-1"
                                >
                                    View All Comparisons &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Regional Engineering Pods Across India */}
                <div className="pt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                    <span className="font-mono text-neutral-500 uppercase tracking-wider text-[11px] shrink-0">
                        Regional Engineering Pods:
                    </span>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-neutral-500">
                        <Link to="/enterprise-ai-bangalore/" className="hover:text-black dark:hover:text-white transition font-medium">Bengaluru HQ (Koramangala)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-mumbai/" className="hover:text-black dark:hover:text-white transition">Mumbai (BKC)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-delhi-ncr/" className="hover:text-black dark:hover:text-white transition">Delhi NCR</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-pune/" className="hover:text-black dark:hover:text-white transition">Pune (Hinjawadi)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-hyderabad/" className="hover:text-black dark:hover:text-white transition">Hyderabad (HITEC)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-chennai/" className="hover:text-black dark:hover:text-white transition">Chennai (OMR)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-ahmedabad/" className="hover:text-black dark:hover:text-white transition">Ahmedabad (GIFT City)</Link>
                        <span>&bull;</span>
                        <Link to="/enterprise-ai-kolkata/" className="hover:text-black dark:hover:text-white transition">Kolkata (Sector V)</Link>
                    </div>
                </div>

                {/* Bottom Section: Entity Credentials & Location */}
                <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-semibold tracking-wider text-black dark:text-white uppercase">
                            Elesium Digital Systems Private Limited
                        </span>
                        <p className="text-xs text-neutral-500 leading-relaxed max-w-2xl">
                            80 Feet Road, 4th Block, Koramangala, Bengaluru 560034, Karnataka, India. Contact: +91-8317329312 | contact@elesium.online
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-neutral-500">
                        <span>DPDP Act 2023</span>
                        <span>&bull;</span>
                        <span>SOC-2 Type II</span>
                        <span>&bull;</span>
                        <span>ISO 27001</span>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className="pt-6 mt-6 border-t border-neutral-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
                    <p>&copy; {new Date().getFullYear()} Elesium Digital Systems Private Limited. All rights reserved.</p>
                    <div className="flex items-center gap-4 flex-wrap">
                        <Link to="/" className="hover:text-black dark:hover:text-white transition">Portal</Link>
                        <Link to="/connector/" className="hover:text-black dark:hover:text-white transition">Connector Model</Link>
                        <Link to="/authors/chaman-shah/" className="hover:text-black dark:hover:text-white transition">Principal Architect</Link>
                        <Link to="/resources/" className="hover:text-black dark:hover:text-white transition">Resources</Link>
                        <Link to="/sitemap.xml" className="hover:text-black dark:hover:text-white transition">Sitemap</Link>
                    </div>
                </div>

            </div>
        </footer>
    );
}
