export interface KeyMoment {
    time: string;
    seconds: number;
    title: string;
    description: string;
}

export interface ArchitectureStage {
    stage: string;
    name: string;
    bullets: string[];
    techStack: string;
}

export interface RoiMetric {
    label: string;
    value: string;
    detail: string;
    color: string;
}

export interface VideoMasterclass {
    id: string;
    slug: string;
    title: string;
    youtubeId: string;
    duration: string;
    durationIso: string;
    uploadDate: string;
    industry: string;
    category: string;
    executiveSummary: string;
    roiMetrics: RoiMetric[];
    keyMoments: KeyMoment[];
    architectureStages: ArchitectureStage[];
    fullTranscript: string;
}

export const videoMasterclasses: VideoMasterclass[] = [
    {
        id: "vm-1",
        slug: "enterprise-ai-automation-india-2026",
        title: "Enterprise AI Automation in India: Architecting Deterministic Multi-Agent Systems in Sovereign VPCs",
        youtubeId: "dQw4w9WgXcQ", // embed placeholder, swappable to live YouTube production ID
        duration: "24:18",
        durationIso: "PT24M18S",
        uploadDate: "2026-03-15T09:00:00+05:30",
        industry: "Enterprise Engineering & BFSI",
        category: "System Architecture",
        executiveSummary: "A comprehensive architectural teardown of how Indian enterprises are moving away from fragile prompt wrappers and monolithic RPA bots toward deterministic, multi-agent state machines deployed inside private, zero-retention cloud VPCs. This session covers state reconciliation, DPDP Act 2023 compliance, and achieving balance sheet cash-flow ROI in 90 days.",
        roiMetrics: [
            { label: "Turnaround Cut", value: "65%", detail: "From 48h to 18 mins", color: "#00D7FF" },
            { label: "Audited ROI", value: "3.8x", detail: "Delivered in 90 days", color: "#10C387" },
            { label: "Data Leakage", value: "0%", detail: "Sovereign VPC boundary", color: "#C387FF" },
            { label: "Production SLA", value: "99.9%", detail: "Deterministic LangGraph", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Enterprise AI Trap: Why Prompt Wrappers Fail", description: "Why probabilistic chat tools create compounding errors when exposed to enterprise ERPs and accounting databases." },
            { time: "04:12", seconds: 252, title: "Deterministic State Machines vs Autonomous Drifting", description: "How LangGraph DAGs enforce hard contractual guardrails and human-in-the-loop exception routing." },
            { time: "09:45", seconds: 585, title: "Sovereign VPC Deployments & India DPDP Act 2023", description: "Architecting zero-retention inference pipelines with on-premise embeddings and private model weights." },
            { time: "16:30", seconds: 990, title: "Legacy Core Integration: SAP S/4HANA & Core Banking", description: "Live execution hooks bridging modern agentic protocols with legacy SOAP, REST, and SQL architectures." },
            { time: "21:05", seconds: 1265, title: "Calculating the 90-Day Cash-Flow Velocity ROI", description: "How CXOs structure capital allocation to achieve 3x–5x net return on engineering investment." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Sovereign Ingestion Gateway",
                bullets: [
                    "Multi-tenant API Gateway with TLS 1.3 mutual authentication",
                    "Vision-Language parsing of unstructured financial & legal PDFs",
                    "DPDP Act 2023 compliance filter with automated PII tokenization"
                ],
                techStack: "FastAPI • PyMuPDF • Private VLM • Redis"
            },
            {
                stage: "Stage 02",
                name: "Deterministic LangGraph Core",
                bullets: [
                    "Stateful directed acyclic graph (DAG) enforcing rule gates",
                    "Parallel execution agents for cross-statement verification",
                    "Confidence threshold scoring with automated fallback triggers"
                ],
                techStack: "LangGraph • Python 3.12 • Llama 3 70B • Pinecone"
            },
            {
                stage: "Stage 03",
                name: "Enterprise ERP & Database Sync",
                bullets: [
                    "Transactional ACID writeback to SAP S/4HANA & SQL backends",
                    "Immutable audit logging with hash-chained execution logs",
                    "Real-time webhook notifications to executive Slack / Teams"
                ],
                techStack: "SAP OData APIs • PostgreSQL • Kafka • OpenTelemetry"
            }
        ],
        fullTranscript: `
[00:00] Welcome to the Elesium Systems Architecture Masterclass. Today, we are breaking down why 90% of enterprise AI projects fail to transition from pilot to production, and the exact architectural blueprint Indian enterprises are deploying to achieve deterministic, cash-flow positive returns.

[01:15] In 2024 and 2025, the market was flooded with prompt wrappers—companies claiming to solve enterprise workflows simply by feeding thousands of tokens into an OpenAI or Anthropic API. But in an enterprise environment—whether you are an NBFC underwriting loans, a manufacturing firm ordering raw materials through SAP, or an insurer handling claims—probabilistic drift is catastrophic. A 98% accuracy rate sounds impressive to a marketer, but to a Chief Risk Officer, a 2% failure rate across 50,000 monthly transactions means 1,000 corrupted entries, compliance penalties, and direct capital loss.

[04:12] This brings us to the core distinction: Probabilistic Generative Models versus Deterministic State Machines. At Elesium, we do not let LLMs make unbound execution decisions. Instead, we use frameworks like LangGraph to construct deterministic state machines. The language model acts merely as a localized parsing or translation node, while the transitions between states, the validation gates, and the business logic are strictly enforced by code.

[07:30] Let's look at the sovereign infrastructure layer. Under India's Digital Personal Data Protection (DPDP) Act of 2023 and RBI data localization directives, sending raw customer financial statements or medical records to third-party public clouds outside Indian borders violates compliance. Our architecture isolates the entire inference pipeline inside a sovereign VPC on AWS Mumbai (ap-south-1) or Azure Central India. Weights are self-hosted or accessed via enterprise zero-data-retention agreements, ensuring that not a single byte of proprietary data leaves the client perimeter.

[12:45] Next is legacy integration. Enterprises do not operate on clean greenfield tech stacks. They run on SAP S/4HANA, Oracle ERP, AS400 mainframes, and on-premise PostgreSQL databases. An agent that cannot reliably read and write to these systems is useless. We build asynchronous event-driven pipelines using Apache Kafka and FastAPI, exposing standardized REST and OData adapters that reconcile transactions with two-phase commit protocols.

[17:20] Finally, let us discuss balance-sheet ROI. When we sit down with managing directors and CFOs, we do not speak about 'hours saved' in the abstract. We map our systems directly to gross margin expansion and working capital recovery. In our BFSI deployments, compressing underwriting turnaround from 48 hours to 18 minutes tripled origination throughput without adding a single headcount, delivering a 3.8x cash-flow ROI within 90 days.

[22:40] If your enterprise is preparing to transition from experimental AI prototypes to sovereign, production-grade agentic infrastructure, review our verified case studies on GoodFirms and Clutch, or schedule an architectural audit with our engineering team at elesium.online.
        `
    },
    {
        id: "vm-2",
        slug: "langgraph-vs-n8n-enterprise-agents",
        title: "LangGraph vs n8n for Enterprise AI Workflows: Deterministic State Management & Production SLAs",
        youtubeId: "vN93nS1647",
        duration: "18:42",
        durationIso: "PT18M42S",
        uploadDate: "2026-03-20T11:30:00+05:30",
        industry: "Enterprise Software & SaaS",
        category: "Framework Comparison",
        executiveSummary: "A technical comparison between low-code workflow automation tools (n8n, Zapier) and programmatic agentic orchestration frameworks (LangGraph, AutoGen). We analyze error recovery, state persistence, schema verification, and where each framework belongs in a mission-critical enterprise stack.",
        roiMetrics: [
            { label: "Error Recovery", value: "99.9%", detail: "Zero-loss state persistence", color: "#00D7FF" },
            { label: "Execution Latency", value: "<450ms", detail: "Direct Python runtime", color: "#10C387" },
            { label: "Code Ownership", value: "100%", detail: "Zero vendor lock-in", color: "#C387FF" },
            { label: "Cost Efficiency", value: "4.5x", detail: "Compared to per-step SaaS", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Low-Code Ceiling: When n8n Hits Enterprise Limits", description: "Why visual DAG builders break under complex multi-branch conditional loops and high-throughput data volumes." },
            { time: "03:50", seconds: 230, title: "LangGraph Architecture: Cycles, State, and Memory", description: "Deep dive into state schemas, checkpointing to PostgreSQL, and resuming execution from failed nodes." },
            { time: "08:15", seconds: 495, title: "Handling Asynchronous Human-in-the-Loop Interrupts", description: "Pausing agent execution cleanly while awaiting senior compliance officer review without thread blocking." },
            { time: "13:20", seconds: 800, title: "Benchmarking Cost and Infrastructure Footprint", description: "Comparing managed low-code licensing costs against private Kubernetes deployments." },
            { time: "16:40", seconds: 1000, title: "The Hybrid Enterprise Strategy", description: "Using n8n for rapid internal utility automation while reserving LangGraph for core revenue-generating systems." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Event & Webhook Routing",
                bullets: [
                    "High-concurrency webhook ingestion with payload schema validation",
                    "HMAC signature verification and rate-limiting middleware",
                    "Persistent queueing in Redis Streams for guaranteed delivery"
                ],
                techStack: "FastAPI • Redis Streams • Pydantic v2"
            },
            {
                stage: "Stage 02",
                name: "Stateful Agentic Graph",
                bullets: [
                    "Cyclical graph execution with state checkpointing to PostgreSQL",
                    "Dynamic tool-calling with semantic retry and exponential backoff",
                    "Strict typing on all inter-agent messages and state transitions"
                ],
                techStack: "LangGraph • PostgreSQL (Asyncpg) • Python 3.12"
            },
            {
                stage: "Stage 03",
                name: "Observability & Alerting",
                bullets: [
                    "Distributed tracing capturing exact token usage and latency",
                    "Real-time LangSmith / OpenTelemetry telemetry exporter",
                    "Automated Slack alerting on anomaly thresholds"
                ],
                techStack: "OpenTelemetry • Prometheus • Grafana • Slack API"
            }
        ],
        fullTranscript: `
[00:00] Today we are resolving one of the most contentious debates among enterprise technical architects: Should you build your business workflows with visual automation engines like n8n, or should you deploy programmatic code-first frameworks like LangGraph?

[01:30] Let's be fair: n8n is fantastic for linear automation. If you need to watch a webhook, format a payload, and update HubSpot or Airtable, n8n provides rapid prototyping and clean visual observability. But when you move to mission-critical revenue operations—where an agent must read financial statements, cross-examine multiple databases, recover from partial failures, and handle cyclical loops—visual tools hit an architectural wall.

[05:10] The primary advantage of LangGraph is cyclical execution and stateful checkpointing. Traditional DAGs are linear: node A leads to node B, which leads to node C. But agentic reasoning is iterative. An agent generates a response, validates it against a business rule, realizes there is an inconsistency, and must loop back to re-query the database. LangGraph models workflows as graphs with cycles, persisting state into PostgreSQL after every node execution. If a server restarts midway through a transaction, LangGraph resumes exactly where it stopped.

[10:45] Furthermore, consider the Human-in-the-Loop requirement. In regulated enterprise workflows, you cannot allow an AI system to disburse a 50 Lakh Rupee loan or reorder 20,000 manufacturing components autonomously without human signoff. LangGraph provides native interrupt capabilities: the agent pauses, persists its complete state to the database, emits a review payload to an executive dashboard, and waits. Once the executive approves, execution resumes seamlessly.

[15:30] At Elesium, we take a disciplined hybrid approach. We utilize low-code tools for lightweight internal office utilities, but for core enterprise workflows that impact client revenue and balance-sheet integrity, we exclusively engineer deterministic LangGraph architectures backed by production SLAs.
        `
    },
    {
        id: "vm-3",
        slug: "bfsi-autonomous-loan-underwriting",
        title: "Autonomous Loan Underwriting Architecture: Processing 100-Page Financial Documents in 18 Minutes",
        youtubeId: "p9s487k211",
        duration: "21:05",
        durationIso: "PT21M05S",
        uploadDate: "2026-03-25T14:00:00+05:30",
        industry: "BFSI & Non-Banking Financial Corporations",
        category: "Case Study & Engineering Breakdown",
        executiveSummary: "A technical breakdown of Elesium's production loan underwriting pipeline deployed for an Indian NBFC. Learn how custom Vision-Language extraction models and multi-agent reconciliation cross-verify GST returns, bank statements, and ITR filings to auto-generate Credit Appraisal Memos (CAMs) with audited accuracy.",
        roiMetrics: [
            { label: "Cycle Time", value: "18 Mins", detail: "Down from 48 hours", color: "#00D7FF" },
            { label: "Analyst Hours", value: "12,000h", detail: "Recovered monthly", color: "#10C387" },
            { label: "Accuracy", value: "99.4%", detail: "Field extraction fidelity", color: "#C387FF" },
            { label: "Origination Growth", value: "3x", detail: "Without headcount increase", color: "#FBBF24" }
        ],
        keyMoments: [
            { time: "00:00", seconds: 0, title: "The Underwriting Bottleneck in Indian Lending", description: "Why manual credit appraisal reviews cap loan book expansion and cause severe operational drag." },
            { time: "03:40", seconds: 220, title: "Vision-Language Document Parsing for Complex PDFs", description: "Extracting tabular data from scanned, rotated, and multi-column bank statements with sub-millimeter precision." },
            { time: "08:10", seconds: 490, title: "Deterministic Triad: GST vs Bank Statements vs ITR", description: "Algorithmic cross-verification detecting circular transactions and revenue inflation." },
            { time: "14:15", seconds: 855, title: "Auto-Generating the Comprehensive CAM Report", description: "Synthesizing debt-service coverage ratios (DSCR), leverage ratios, and risk scorecards." },
            { time: "18:30", seconds: 1110, title: "Compliance, Audit Trails, and RBI Regulations", description: "Full transparency and explainability logs ensuring complete regulatory auditability." }
        ],
        architectureStages: [
            {
                stage: "Stage 01",
                name: "Document Ingestion & OCR",
                bullets: [
                    "High-throughput parallel ingestion of 100+ page PDF packages",
                    "Custom VLM OCR correcting perspective, noise, and scan skew",
                    "Structured JSON extraction conforming to strict Pydantic schemas"
                ],
                techStack: "Python • LayoutLMv3 • PyPDF • RabbitMQ"
            },
            {
                stage: "Stage 02",
                name: "Multi-Source Fraud & Audit Engine",
                bullets: [
                    "Cross-reconciliation of declared revenue against GSTR-2A/3B returns",
                    "Banking velocity analysis identifying circular fund routing",
                    "Automated negative list and litigation database screening"
                ],
                techStack: "LangGraph • DuckDB • Scikit-Learn • PostgreSQL"
            },
            {
                stage: "Stage 03",
                name: "CAM Synthesis & Sign-off UI",
                bullets: [
                    "Deterministic generation of institutional Credit Appraisal Memos",
                    "DSCR, Current Ratio, and working capital gap calculations",
                    "Human-in-the-loop executive approval portal with source highlighting"
                ],
                techStack: "React • TailwindCSS • PDFKit • Sovereign VPC"
            }
        ],
        fullTranscript: `
[00:00] In commercial lending, speed is the ultimate competitive advantage. When an SME or mid-market enterprise requests a 5 Crore Rupee credit facility, the NBFC or private bank that delivers a verified sanction letter first wins the deal. Yet across India, credit analysts remain bogged down manually combing through 100-page bank statements, balance sheets, and GST filings.

[02:15] In this technical case study, we examine the architecture Elesium engineered for an institutional lending client. Their credit team was spending 48 hours per application simply compiling raw financial inputs into a Credit Appraisal Memo (CAM).

[05:40] Step one is robust ingestion. Financial PDFs in India are notoriously messy—scanned at low resolutions, stamped with watermarks, or formatted in non-standard tabular grids. We deployed a multi-stage Vision-Language extraction pipeline that segments documents into bounding-box coordinates, normalizes rotations, and outputs strongly typed Pydantic models with 99.4% precision.

[09:20] Step two is the cross-verification audit triad. Credit risk is not assessed from a single document. Our LangGraph agent cluster cross-examines three distinct data streams: bank statement credits, GST revenue declarations (GSTR-1 and GSTR-3B), and filed Income Tax Returns (ITR). If a borrower claims 20 Crores in annual revenue, but banking credits only reflect 12 Crores, the reconciliation engine immediately flags the circular transaction pattern and highlights the discrepancy in red.

[15:10] Step three is automated CAM generation. Once cross-validation passes, the system calculates critical debt ratios—Debt Service Coverage Ratio (DSCR), Interest Coverage Ratio, and Maximum Permissible Bank Finance (MPBF)—outputting an executive-ready CAM complete with source document annotations. The credit manager does not have to hunt for numbers; every figure in the memo links directly to the highlighted bounding box in the original bank statement.

[19:00] The outcome: underwriting turnaround was compressed from 48 hours to just 18 minutes. The client recovered 12,000 analyst hours every month, expanded originations by 300% without hiring, and achieved an audited 3.8x cash-flow ROI in the first quarter of deployment.
        `
    }
];
