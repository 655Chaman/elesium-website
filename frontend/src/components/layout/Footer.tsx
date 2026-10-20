import { Link } from 'react-router-dom'

export default function DownloadFooter() {
    const footerSections = [
        { name: 'Solutions Hub', path: '/solutions' },
        { name: 'Architecture Comparisons', path: '/compare' },
        { name: 'Architecture Fragility Grader', path: '/tools/agentic-architecture-grader' },
        { name: 'How We Work', path: '/how-we-work' },
        { name: 'Markets', path: '/markets' },
        { name: 'AI Automation', path: '/ai-automation' },
        { name: 'India Enterprise', path: '/ai-automation-agency-india' },
        { name: 'Enterprise AI ROI Calculator', path: '/tools/enterprise-ai-roi-calculator' },
        { name: 'Multi-Agent Latency Estimator', path: '/tools/multi-agent-latency-token-cost-estimator' },
        { name: 'Multi-Agent Token Leakage Simulator', path: '/tools/multi-agent-token-leakage-simulator' },
        { name: 'DPDP Act 2023 Audit Simulator', path: '/tools/dpdp-act-2023-audit-simulator' },
        { name: 'Enterprise GPU FinOps Calculator', path: '/tools/enterprise-gpu-finops-cost-calculator' },
        { name: 'Enterprise Vector DB Benchmark', path: '/tools/enterprise-vector-db-latency-benchmark' },
        { name: 'LLM Context Window KV Cache Simulator', path: '/tools/enterprise-llm-context-kv-cache-simulator' },
        { name: 'Agent Deadlock & FSM Circuit Breaker Visualizer', path: '/tools/enterprise-multi-agent-deadlock-circuit-breaker-visualizer' },
        { name: 'Voice Agent VAD & Turn-Taking Latency Simulator', path: '/tools/enterprise-voice-agent-latency-simulator' },
        { name: 'GraphRAG vs Vector DB Benchmark', path: '/tools/enterprise-graphrag-memory-benchmark' },
        { name: 'Event Sourcing & Audit Ledger Simulator', path: '/tools/enterprise-event-sourcing-audit-simulator' },
        { name: 'Prompt Injection Firewall Simulator', path: '/tools/enterprise-prompt-injection-firewall-simulator' },
        { name: 'Semantic Cache & Token Deduplication Simulator', path: '/tools/enterprise-semantic-cache-simulator' },
        { name: 'Multi-Model Dynamic Routing & Arbitrage Simulator', path: '/tools/enterprise-model-routing-cost-arbitrage-simulator' },
        { name: 'Structured Output & Grammar Decoding Simulator', path: '/tools/enterprise-structured-output-latency-simulator' },
        { name: 'Multi-Agent Distributed Tracing & OpenTelemetry Simulator', path: '/tools/enterprise-agent-tracing-opentelemetry-simulator' },
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

    const battlecardLinks = [
        { name: 'LangGraph vs CrewAI Enterprise', path: '/compare/langgraph-vs-crewai-enterprise' },
        { name: 'Private VPC vLLM vs Azure OpenAI', path: '/compare/private-vpc-vllm-vs-azure-openai' },
        { name: 'Custom Agents vs Zapier Enterprise', path: '/compare/custom-multi-agent-systems-vs-zapier-enterprise' },
        { name: 'Deterministic FSM vs ReAct Loops', path: '/compare/deterministic-state-machines-vs-react-agents' },
        { name: 'Elesium vs IT Consultancies', path: '/compare/elesium-vs-traditional-it-consultancies' },
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

                        {/* Architecture Comparisons Column */}
                        <div className="flex flex-col gap-5 max-w-sm">
                            <div className="flex items-center gap-2">
                                <h4 className="font-normal text-lg text-gray-900 dark:text-white">Comparisons</h4>
                                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                                    Vs Matrix
                                </span>
                            </div>
                            <ul className="flex flex-col gap-3">
                                {battlecardLinks.map((item) => (
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
                                        to="/compare"
                                        className="text-xs font-mono text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                                    >
                                        View All 6 Architecture Battlecards →
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

                        {/* Directory Authority Badges — Tier-1 Verified Entity Cluster */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 max-w-md md:justify-end">
                            <a
                                href="https://clutch.co/profile/elesium-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Clutch 5.0 Verified AI Partner"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-gray-700 dark:text-gray-300 font-mono">
                                    ★
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        Clutch
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        5.0 Verified
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://www.goodfirms.co/company/elesium-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Elesium Online on GoodFirms — Top AI Company"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-gray-700 dark:text-gray-300 font-mono">
                                    ✓
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        GoodFirms
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Top AI Agency
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://www.g2.com/products/elesium-ai-automation-platform"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="G2 Enterprise AI Automation Platform"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-gray-700 dark:text-gray-300 font-mono">
                                    G2
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        G2 Crowd
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        High Performer
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://www.crunchbase.com/organization/elesium-online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Crunchbase Verified Entity"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-gray-700 dark:text-gray-300 font-mono">
                                    CB
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        Crunchbase
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Verified Org
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://www.trustpilot.com/review/elesium.online"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Trustpilot Verified Commercial Reviews"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-emerald-500 font-mono">
                                    ★
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        Trustpilot
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        4.9 / 5.0
                                    </span>
                                </div>
                            </a>

                            <a
                                href="https://www.producthunt.com/products/elesium-enterprise-ai-roi-calculator"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-300 dark:border-white/15 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-200"
                                title="Product Hunt Featured Tool"
                            >
                                <span className="w-3.5 h-3.5 rounded-full border border-gray-400 dark:border-white/30 flex items-center justify-center text-[8px] text-amber-500 font-mono font-bold">
                                    P
                                </span>
                                <div className="flex flex-col text-left">
                                    <span className="text-[8px] font-mono tracking-widest uppercase text-gray-400 dark:text-gray-500">
                                        Product Hunt
                                    </span>
                                    <span className="text-[10px] font-medium text-gray-900 dark:text-gray-200 group-hover:text-black dark:group-hover:text-white transition-colors">
                                        Featured Tool
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
