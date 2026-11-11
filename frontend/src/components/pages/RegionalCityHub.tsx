import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    MapPin,
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    MessageSquare,
    ChevronRight,
    ChevronDown,
    Building2,
    HelpCircle,
    ShieldCheck
} from 'lucide-react'
import { useWhatsApp } from '../../hooks/useWhatsApp'

export interface CityFaq {
    question: string;
    answer: string;
}

export interface CityData {
    cityId: string;
    cityName: string;
    regionName: string;
    slug: string;
    h1: string;
    metaTitle: string;
    metaDescription: string;
    answerCapsule: string;
    heroSubtitle: string;
    officeAddress: {
        street: string;
        locality: string;
        region: string;
        postalCode: string;
        lat: number;
        lng: number;
    };
    wikidataId: string;
    localLandmark: string;
    hasMapUrl: string;
    geoRadius: string;
    targetIndustries: string[];
    corePillars: {
        title: string;
        desc: string;
        metric: string;
        metricLabel: string;
    }[];
    localCaseStudy: {
        title: string;
        clientType: string;
        challenge: string;
        solution: string;
        roiMetric: string;
    };
    localFaqs: CityFaq[];
}

export const REGIONAL_CITIES: Record<string, CityData> = {
    bangalore: {
        cityId: 'bangalore',
        cityName: 'Bengaluru (Bangalore)',
        regionName: 'Bengaluru & Karnataka Tech Corridor',
        slug: 'enterprise-ai-bangalore',
        h1: "Best AI & Automation Company & Agency in Bangalore",
        metaTitle: "Best AI & Automation Company & Agency in Bangalore, Karnataka",
        metaDescription: "Elesium is a leading enterprise AI and automation company in Bangalore, Karnataka. Air-gapped multi-agent LangGraph systems, private VPC LLMs (148ms TTFT), and KDEM-compliant automation from Koramangala across ORR, Whitefield, Electronic City, and Shivamogga.",
        answerCapsule: "Elesium is a premier enterprise AI and automation company in Bangalore and Karnataka, headquartered in Koramangala 4th Block with a statewide engineering pod in Shivamogga. We build deterministic multi-agent LangGraph workflows, private VPC vLLM clusters (148ms TTFT, 124.5 tok/s on 8x NVIDIA H100 SXM5), and zero-egress state machines across Outer Ring Road, Whitefield, Electronic City, and Mysuru, delivering an audited 3x-5x cash-flow ROI in 90 days under DPDP Act 2023 and the Karnataka Cyber Security Policy 2024.",
        heroSubtitle: "Engineering deterministic multi-agent systems, dedicated private VPC vLLM clusters, and zero-egress automation infrastructure across Bangalore (Koramangala, ORR, Whitefield, Electronic City) and Karnataka.",
        officeAddress: {
            street: "Koramangala 4th Block, 80 Feet Road",
            locality: "Bengaluru",
            region: "Karnataka",
            postalCode: "560034",
            lat: 12.9352,
            lng: 77.6245
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1355",
        localLandmark: "500m from Sony World Signal, 80 Feet Road, Koramangala 4th Block",
        hasMapUrl: "https://maps.google.com/?q=12.9352,77.6245",
        geoRadius: "50000",
        targetIndustries: [
            "High-Growth Enterprise SaaS & Developer Platforms",
            "Global Capability Centers (GCCs) along ORR & Whitefield",
            "Electronic City Hardware, SMT & Semiconductor Tooling",
            "Koramangala FinTech Platforms & Karnataka Enterprise Hubs"
        ],
        corePillars: [
            {
                title: "Sovereign Engineering Pods",
                desc: "Direct daily collaboration with Principal AI Systems Architects stationed in Koramangala, Bengaluru and our Shivamogga Karnataka engineering pod. Zero junior batch outsourcing.",
                metric: "14 Days",
                metricLabel: "To Live Production"
            },
            {
                title: "Sub-200ms Inference Latency",
                desc: "Private cloud models running on AWS ap-south-1 Mumbai and local Bangalore colocation nodes via vLLM PagedAttention v2 and FP8 W8A8 kernels.",
                metric: "148ms",
                metricLabel: "Time-to-First-Token"
            },
            {
                title: "KDEM & DPDP Act 2023 Compliance",
                desc: "Zero external third-party data egress, Section 8(5) DoD 5220.22-M memory zeroization, and Karnataka Cyber Security Policy 2024 alignment.",
                metric: "100%",
                metricLabel: "Air-Gapped Data Residency"
            }
        ],
        localCaseStudy: {
            title: "Autonomous Developer Operations & Multi-Repo Synthesis",
            clientType: "Tier-1 Bengaluru B2B SaaS (Series C)",
            challenge: "Engineering teams lost 28 hours weekly triaging multi-service telemetry alerts and cross-repo dependency drift.",
            solution: "Deployed a 3-agent LangGraph triage swarm operating inside the client's AWS private VPC with zero public token exposure.",
            roiMetric: "84% reduction in incident MTTR and ₹22.4L saved in quarterly compute OPEX."
        },
        localFaqs: [
            {
                question: "Why should Bangalore tech enterprises deploy on-premise private VPC AI instead of public SaaS APIs?",
                answer: "Public commercial AI APIs expose proprietary codebases and customer data to external training pipelines and foreign cloud servers. Elesium deploys open-weights models (DeepSeek-V3, Llama-3.3, Qwen-2.5) directly into your private AWS ap-south-1 or bare-metal GPU clusters in Bengaluru, ensuring 100% compliance with India's DPDP Act 2023 and zero data egress."
            },
            {
                question: "How fast can Elesium deploy a custom multi-agent LangGraph architecture in Bengaluru?",
                answer: "Our Koramangala engineering pod operates on a strict 14-day production deployment cycle. Following a 90-minute architecture audit, we deliver a working pilot within 7 days and full production integration into your Jira, GitHub, and internal microservices within 14 business days, backed by a contractual 90-day ROI guarantee."
            },
            {
                question: "What enterprise industries and corridors do you serve across Bangalore and Karnataka?",
                answer: "We engineer autonomous systems for enterprise B2B SaaS firms in Koramangala and Indiranagar, Global Capability Centers (GCCs) along Outer Ring Road (Bellandur, Kadubeesanahalli, Marathahalli) and Whitefield, SMT and semiconductor manufacturers in Electronic City, and statewide Karnataka enterprises supported by our Shivamogga engineering pod."
            },
            {
                question: "What makes Elesium a top-ranked AI and automation company in Bangalore and Karnataka?",
                answer: "Elesium engineers deterministic, strictly sovereign multi-agent systems with an audited 148ms Time-To-First-Token on dedicated 8x NVIDIA H100 SXM5 hardware, private VPC deployments inside Indian borders, and full DPDP Act 2023 plus Karnataka Cyber Security Policy 2024 compliance. Our Koramangala and Shivamogga teams guarantee 3x-5x cash-flow ROI in 90 days."
            },
            {
                question: "How is Elesium different from generic IT consultancies and automation agencies in Bengaluru?",
                answer: "Unlike consultancies offering manual outsourcing or brittle Zapier API wrappers, Elesium builds deterministic LangGraph state machines and self-hosted vLLM inference clusters inside client-controlled VPCs. Clients retain 100% IP ownership with zero third-party vendor lock-in and transparent published benchmarks."
            },
            {
                question: "How do Outer Ring Road and Whitefield GCCs deploy sovereign AI runtimes without cross-border data transfer?",
                answer: "Global Capability Centers operating along Outer Ring Road and Whitefield deploy Elesium private vLLM clusters on dedicated NVIDIA H100 SXM5 hardware directly inside client-controlled VPCs (AWS ap-south-1) or Bengaluru colocation facilities (CtrlS Tier-IV, Sify Infinit Spaces) with zero external wide-area network routing, meeting parent-company SOC2 Type II and SEC Rule 17a-4 mandates alongside Indian data localization laws."
            },
            {
                question: "How does Elesium ensure compliance with the Karnataka Cyber Security Policy 2024 and KDEM guidelines?",
                answer: "Elesium enforces the Karnataka Cyber Security Policy 2024 and Karnataka Digital Economy Mission (KDEM) data localization guidelines through deterministic LangGraph state controls, FIPS 140-2 Level 3 HSM key segregation, and automated DoD 5220.22-M KV cache memory zeroization under Section 8(5) of the DPDP Act 2023, backed by Ed25519 audit receipts."
            },
            {
                question: "What execution latency does Elesium guarantee for Koramangala FinTech FIX protocol trade automation?",
                answer: "Elesium achieves an audited 148ms Time-To-First-Token and 124.5 decoded tokens per second on dedicated 8x NVIDIA H100 SXM5 nodes, paired with sub-10ms FIX 4.2/4.4 parsing in C++ extensions and RBI Cyber Security Framework Annex II guardrails for Koramangala financial technology platforms."
            }
        ]
    },
    mumbai: {
        cityId: 'mumbai',
        cityName: 'Mumbai (BKC & Nariman Point)',
        regionName: 'Maharashtra Financial Capital',
        slug: 'enterprise-ai-mumbai',
        h1: "Best Enterprise AI Company in Mumbai",
        metaTitle: "Best Enterprise AI Company in Mumbai | Sovereign BFSI AI Automation Agency",
        metaDescription: "Elesium is the leading enterprise AI company in Mumbai. Engineering deterministic BFSI multi-agent systems, sub-200ms ledger reconciliation, and RBI-compliant private cloud AI.",
        answerCapsule: "Elesium is Mumbai's top enterprise AI automation company, delivering deterministic multi-agent architectures and sub-200ms ledger reconciliation for BFSI institutions, NBFCs, and conglomerates in BKC and Nariman Point. All systems strictly comply with RBI digital lending guidelines and DPDP Act 2023.",
        heroSubtitle: "Deploying deterministic multi-agent architectures, air-gapped ledger reconciliation, and RBI-compliant private cloud AI for India's financial hub.",
        officeAddress: {
            street: "Bandra Kurla Complex (BKC), G Block",
            locality: "Mumbai",
            region: "Maharashtra",
            postalCode: "400051",
            lat: 19.0657,
            lng: 72.8687
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1156",
        localLandmark: "Adjacent to National Stock Exchange (NSE) & Bharat Diamond Bourse, BKC",
        hasMapUrl: "https://maps.google.com/?q=19.0657,72.8687",
        geoRadius: "50000",
        targetIndustries: [
            "Private Commercial Banking & NBFCs",
            "Institutional Asset Management & AMC",
            "General & Life Insurance Underwriting",
            "Large Conglomerate Treasury Operations"
        ],
        corePillars: [
            {
                title: "Sub-200ms Ledger Reconciliation",
                desc: "Deterministic stream processing state graphs validating millions of transactions across legacy core banking systems.",
                metric: "< 200ms",
                metricLabel: "Reconciliation Speed"
            },
            {
                title: "RBI Cyber Security Compliance",
                desc: "Air-gapped on-premise FP8 inference with cryptographic audit logging and strict zero external data retention.",
                metric: "Zero Leakage",
                metricLabel: "Statutory BFSI Isolation"
            },
            {
                title: "Automated Fraud & AML Triage",
                desc: "Multimodal LayoutLMv3 and graph neural networks slashing false positives in corporate credit underwriting.",
                metric: "98.2%",
                metricLabel: "Turnaround Reduction"
            }
        ],
        localCaseStudy: {
            title: "Automated Corporate Credit Underwriting & MCA Reconciliation",
            clientType: "Leading Mumbai NBFC (₹3,200 Cr AUM)",
            challenge: "Credit officers spent 14.5 hours manually verifying 50-page audited financial PDFs, ITR filings, and GST returns.",
            solution: "Engineered deterministic Python LangGraph state machines cross-verifying MCA records and bank statements in 1.9s.",
            roiMetric: "Cut loan underwriting latency from 14.5 hours down to 1.9 seconds with zero credit policy slippage."
        },
        localFaqs: [
            {
                question: "How does Elesium guarantee compliance with RBI Master Directions on IT and Digital Lending?",
                answer: "Every BFSI pipeline engineered by Elesium runs in customer-managed private infrastructure with air-gapped data residency. Model weights, database vectors, and audit trails remain cryptographically isolated inside your VPC, satisfying RBI digital lending, cyber security framework, and DPDP Act statutory requirements."
            },
            {
                question: "Can Elesium interface with legacy core banking systems like Finacle and TCS BaNCS?",
                answer: "Yes. Our deterministic state machines interface via secure ISO 8583/20022 message parsers, database CDC (Change Data Capture) streams, and authenticated REST/SOAP microservices, reconciling ledgers in sub-200ms without touching core banking source code."
            },
            {
                question: "Where is Elesium's Mumbai engineering team located?",
                answer: "Our financial engineering desk operates from Bandra Kurla Complex (BKC) G Block, providing direct on-site architectural consultation to banking institutions, AMCs, and NBFCs across BKC, Nariman Point, and Lower Parel."
            }
        ]
    },
    'delhi-ncr': {
        cityId: 'delhi-ncr',
        cityName: 'Delhi NCR (Gurugram & Noida)',
        regionName: 'National Capital Region',
        slug: 'enterprise-ai-delhi-ncr',
        h1: "Best Enterprise AI Company in Delhi NCR",
        metaTitle: "Best Enterprise AI Company in Delhi NCR | Enterprise Automation Gurugram & Noida",
        metaDescription: "Elesium is the top enterprise AI company in Delhi NCR, Gurugram, and Noida. Engineering supply chain dispatch agents, GST Rule 36(4) reconciliation, and sovereign GovTech AI.",
        answerCapsule: "Elesium is Delhi NCR's leading enterprise AI company, architecting automated logistics dispatch, GST Rule 36(4) invoice reconciliation, and sovereign GovTech multi-agent systems across Gurugram and Noida. Contractually committed 90-day ROI backed by private VPC deployments.",
        heroSubtitle: "Engineering autonomous logistics dispatch, GST input tax credit reconciliation, and sovereign AI infrastructure across Gurugram, Noida, and New Delhi.",
        officeAddress: {
            street: "Cyber City, DLF Phase 2, Building 10",
            locality: "Gurugram",
            region: "Haryana",
            postalCode: "122002",
            lat: 28.4908,
            lng: 77.0903
        },
        wikidataId: "https://www.wikidata.org/wiki/Q180136",
        localLandmark: "Opposite Cyber Hub Rapid Metro Station, DLF Phase 2",
        hasMapUrl: "https://maps.google.com/?q=28.4908,77.0903",
        geoRadius: "50000",
        targetIndustries: [
            "Express Logistics & 3PL Freight Networks",
            "Automotive Tier-1 Manufacturing Corridors",
            "Omnichannel FMCG & Quick Commerce",
            "GovTech & Public Sector Enterprise Infrastructure"
        ],
        corePillars: [
            {
                title: "GST Rule 36(4) Automation",
                desc: "Real-time auto-reconciliation between vendor e-invoices, GSTR-2B, and ERP accounting ledgers preventing ITC lockups.",
                metric: "3.2 Mins",
                metricLabel: "vs 14-Day Manual Cycle"
            },
            {
                title: "Autonomous Fleet Dispatch",
                desc: "Real-time combinatorial optimization agents dynamically re-routing freight shipments across North Indian transit corridors.",
                metric: "-18.5%",
                metricLabel: "Freight Fuel OPEX"
            },
            {
                title: "Vernacular Multimodal OCR",
                desc: "High-accuracy bilingual extraction across Hindi, English, and regional consignment documents with zero hallucination.",
                metric: "99.4%",
                metricLabel: "Extraction Precision"
            }
        ],
        localCaseStudy: {
            title: "Automated Supply Chain Bill-of-Lading & Dispatch Engine",
            clientType: "Gurugram Freight & 3PL Logistics Operator",
            challenge: "Carrier dispatchers manually reconciled 1,200 daily waybills against warehouse dock slots, causing severe yard congestion.",
            solution: "Deployed autonomous LangGraph dispatch agents paired with OCR edge parsers on local cloud instances.",
            roiMetric: "Yard dwell time slashed by 64% and eliminated ₹18.4L in quarterly demurrage penalties."
        },
        localFaqs: [
            {
                question: "How does Elesium automate GST Rule 36(4) invoice reconciliation for North Indian enterprises?",
                answer: "Our deterministic agents continuously ingest vendor invoices, e-way bills, and GSTR-2B tax files, reconciling mismatching HSN codes, tax amounts, and supplier GSTINs in 3.2 minutes, unlocking eligible input tax credit without manual intervention."
            },
            {
                question: "Can Elesium deploy GovTech AI solutions that satisfy Indian government data sovereignty standards?",
                answer: "Yes. All GovTech solutions are engineered to deploy in MeitY-empaneled cloud environments (e.g. NIC Cloud, AWS GovCloud, CtrlS) with zero external network egress and strict adherence to India's DPDP Act 2023."
            },
            {
                question: "What areas of Delhi NCR does your technical team cover?",
                answer: "Our engineering coverage spans DLF Cyber City and Golf Course Road in Gurugram, Sector 62 and Expressway in Noida, Okhla Industrial Area, and Central Delhi corporate headquarters."
            }
        ]
    },
    pune: {
        cityId: 'pune',
        cityName: 'Pune (Hinjawadi & Chakan)',
        regionName: 'Maharashtra Industrial Belt',
        slug: 'enterprise-ai-pune',
        h1: "Best Enterprise AI Company in Pune",
        metaTitle: "Best Enterprise AI Company in Pune | Industrial Manufacturing AI Automation",
        metaDescription: "Elesium is the #1 enterprise AI company in Pune. Delivering sub-50ms computer vision defect detection, predictive maintenance state machines, and SAP RFC automation in Chakan & Hinjawadi.",
        answerCapsule: "Elesium is Pune's leading enterprise AI company, engineering sub-50ms computer vision defect inspection, predictive machine telemetry, and bidirectional SAP RFC state machines for automotive OEMs and discrete manufacturing plants across Chakan and Hinjawadi. Delivering audited 3.5x ROI in 90 days.",
        heroSubtitle: "Deploying high-speed computer vision defect inspection, predictive IoT state machines, and SAP RFC automation across Chakan and Hinjawadi.",
        officeAddress: {
            street: "Rajiv Gandhi Infotech Park, Phase 1",
            locality: "Hinjawadi, Pune",
            region: "Maharashtra",
            postalCode: "411057",
            lat: 18.5913,
            lng: 73.7389
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1538",
        localLandmark: "Near Hinjawadi Phase 1 Circle, Adjacent to Tata Technologies Campus",
        hasMapUrl: "https://maps.google.com/?q=18.5913,73.7389",
        geoRadius: "50000",
        targetIndustries: [
            "Automotive OEMs & Tier-1 Component Suppliers",
            "Discrete Precision Industrial Manufacturing",
            "Embedded Systems & IoT Telemetry Labs",
            "Specialty Chemical & Heavy Machinery Plants"
        ],
        corePillars: [
            {
                title: "Sub-50ms Defect Vision",
                desc: "Edge-quantized YOLOv10 and custom transformer vision backbones detecting micro-cracks on active stamping lines.",
                metric: "< 48ms",
                metricLabel: "Edge Inspection Speed"
            },
            {
                title: "Bidirectional SAP S/4HANA Sync",
                desc: "Automated inventory updates and assembly line stockout warnings triggered directly via SAP RFC connectors.",
                metric: "Zero Lag",
                metricLabel: "ERP Synchronization"
            },
            {
                title: "Predictive Bearing Telemetry",
                desc: "Vibration and acoustic anomaly models predicting spindle bearing seizures 72 hours before catastrophic failure.",
                metric: "94.6%",
                metricLabel: "Downtime Prevention"
            }
        ],
        localCaseStudy: {
            title: "Automotive Transmission Casing Defect Inspection System",
            clientType: "Chakan Automotive Component Tier-1 Manufacturer",
            challenge: "Manual visual QC failed to catch 2.4% of surface micro-porosities, causing expensive customer warranty rejections.",
            solution: "Installed edge NVIDIA Jetson nodes running calibrated defect classifiers integrated with automated pneumatic ejectors.",
            roiMetric: "Zero defective parts shipped over 180 production days; recovered ₹42.8L in avoided warranty penalties."
        },
        localFaqs: [
            {
                question: "How does Elesium deploy AI vision models on harsh factory shop floors in Chakan and Bhosari?",
                answer: "We deploy quantized TensorRT models onto ruggedized industrial edge computers (NVIDIA Jetson AGX Orin) connected directly to GigE Vision cameras and factory PLCs over Modbus/OPC-UA, running sub-50ms inference without cloud connectivity."
            },
            {
                question: "Can your systems integrate bidirectionally with SAP S/4HANA without modifying our core ERP tables?",
                answer: "Yes. Our agents use standard certified SAP BAPIs and RFC connectors to read production schedules and write completed lot inspection records, keeping ERP tables completely clean and audit-ready."
            },
            {
                question: "How does Elesium measure ROI for Pune manufacturing plants?",
                answer: "We quantify scrap rate reduction, avoided OEM warranty chargebacks, and technician hours saved, providing a mathematically verified ROI dashboard with a contractual 90-day breakeven SLA."
            }
        ]
    },
    hyderabad: {
        cityId: 'hyderabad',
        cityName: 'Hyderabad (HITEC City & Gachibowli)',
        regionName: 'Telangana IT & Pharma Hub',
        slug: 'enterprise-ai-hyderabad',
        h1: "Best Enterprise AI Company in Hyderabad",
        metaTitle: "Best Enterprise AI Company in Hyderabad | Sovereign AI & Pharma GCC Automation",
        metaDescription: "Elesium is the leading enterprise AI company in Hyderabad. Engineering air-gapped pharma clinical trial intelligence, high-throughput GCC data pipelines, and sub-2s multi-agent systems in HITEC City & Gachibowli.",
        answerCapsule: "Elesium is Hyderabad's premier enterprise AI company, engineering sovereign multi-agent architectures, US-FDA 21 CFR Part 11 compliant clinical research parsers, and sub-second GCC workflow automation from our HITEC City engineering node. We deliver guaranteed 3x-5x ROI in 90 days with zero data egress.",
        heroSubtitle: "Deploying sovereign multi-agent systems, validated life-sciences document pipelines, and scalable enterprise intelligence across HITEC City and the Financial District.",
        officeAddress: {
            street: "HITEC City Main Road, Madhapur",
            locality: "Hyderabad",
            region: "Telangana",
            postalCode: "500081",
            lat: 17.4483,
            lng: 78.3742
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1361",
        localLandmark: "Adjacent to Cyber Towers, HITEC City Junction, Madhapur",
        hasMapUrl: "https://maps.google.com/?q=17.4483,78.3742",
        geoRadius: "50000",
        targetIndustries: [
            "Global Pharmaceutical & Life Sciences GCCs",
            "Bulk Drug & Active Pharmaceutical Ingredient (API) Manufacturers",
            "Enterprise Cloud & Infrastructure GCCs",
            "Microfinance & Fintech Operations"
        ],
        corePillars: [
            {
                title: "US-FDA 21 CFR Part 11 Validation",
                desc: "Audit-trail guaranteed multi-agent extraction for clinical batch records and regulatory submission dossiers.",
                metric: "100%",
                metricLabel: "Statutory GxP Compliance"
            },
            {
                title: "Sub-Second GCC Workflow Synthesis",
                desc: "Cross-system synchronization bridging enterprise Jira, SAP, and ServiceNow ticketing swarms without human triage.",
                metric: "0.85s",
                metricLabel: "Cross-System Dispatch"
            },
            {
                title: "Air-Gapped Drug Formulation Modeling",
                desc: "Sovereign local vLLM nodes ensuring proprietary molecular synthesis and assay data never leaves on-premise VPCs.",
                metric: "Zero Egress",
                metricLabel: "Proprietary IP Protection"
            }
        ],
        localCaseStudy: {
            title: "Automated Regulatory Dossier Synthesis & Batch Record Audit",
            clientType: "Hyderabad Major Active Pharmaceutical Ingredient Manufacturer",
            challenge: "Regulatory QA teams spent 24 days per filing compiling paper batch records and impurity chromatography curves for US-FDA submissions.",
            solution: "Engineered deterministic LangGraph verification state machines parsing high-resolution PDF chromatography traces and electronic lab notebooks.",
            roiMetric: "Slashed dossier compilation latency by 78% and eliminated ₹36.5L in external regulatory consulting fees."
        },
        localFaqs: [
            {
                question: "How does Elesium ensure compliance with US-FDA 21 CFR Part 11 for Hyderabad pharma companies?",
                answer: "Our systems generate immutable, cryptographically signed audit logs for every agent execution, validation check, and human-in-the-loop sign-off, ensuring complete data integrity, electronic signature validity, and GxP compliance."
            },
            {
                question: "What capabilities do you offer to Global Capability Centers (GCCs) in HITEC City and Gachibowli?",
                answer: "We deploy autonomous ticket classification, multi-repository code review bots, and cloud infrastructure FinOps agents that operate natively across enterprise ServiceNow, Jira, GitHub, and Datadog stacks with sub-second MTTR."
            },
            {
                question: "Can we run life sciences LLM models completely on-premise in Hyderabad?",
                answer: "Yes. We configure bare-metal GPU nodes (NVIDIA H100/A100) inside your Hyderabad data center with vLLM PagedAttention, ensuring zero IP leakage to external cloud APIs."
            }
        ]
    },
    chennai: {
        cityId: 'chennai',
        cityName: 'Chennai (OMR & Guindy)',
        regionName: 'Tamil Nadu Automotive & SaaS Corridor',
        slug: 'enterprise-ai-chennai',
        h1: "Best Enterprise AI Company in Chennai",
        metaTitle: "Best Enterprise AI Company in Chennai | Automotive & Enterprise SaaS AI Automation",
        metaDescription: "Elesium is Chennai's top enterprise AI company. Architecting deterministic supply chain agents, automated export container billing, and sovereign SaaS telemetry in OMR & Guindy.",
        answerCapsule: "Elesium is Chennai's foremost enterprise AI automation agency, delivering deterministic automotive supply chain coordination, export container freight billing OCR, and sovereign SaaS telemetry from our OMR technology hub. We guarantee contractually verified 3x-5x ROI in 90 days with complete DPDP compliance.",
        heroSubtitle: "Architecting sub-second automotive vendor dispatch, export container billing intelligence, and sovereign SaaS telemetry across Old Mahabalipuram Road and Guindy.",
        officeAddress: {
            street: "Rajiv Gandhi Salai (OMR), Taramani",
            locality: "Chennai",
            region: "Tamil Nadu",
            postalCode: "600113",
            lat: 12.9863,
            lng: 80.2425
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1352",
        localLandmark: "Opposite TIDEL Park, Canal Bank Road, Taramani OMR",
        hasMapUrl: "https://maps.google.com/?q=12.9863,80.2425",
        geoRadius: "50000",
        targetIndustries: [
            "Automotive Assembly & Commercial Vehicle OEMs",
            "Port Logistics & Coastal Freight Corridors",
            "B2B Enterprise SaaS & Product Engineering",
            "Electronics Hardware & Telecommunications EMS"
        ],
        corePillars: [
            {
                title: "Automated Assembly Line Telemetry",
                desc: "Predictive sensor parsing preventing robotic welding stoppages on active Tamil Nadu automotive manufacturing lines.",
                metric: "99.1%",
                metricLabel: "Anomaly Interception"
            },
            {
                title: "Port Demurrage & Bill-of-Lading Extraction",
                desc: "Sub-second parsing of multi-language maritime shipping documents and customs declarations for Chennai port brokers.",
                metric: "45 Sec",
                metricLabel: "vs 6-Hour Manual Cycle"
            },
            {
                title: "Sovereign SaaS Token Orchestration",
                desc: "Private local fine-tuned models slashing external API billing for Chennai B2B product companies by 68%.",
                metric: "-68%",
                metricLabel: "LLM API Spend"
            }
        ],
        localCaseStudy: {
            title: "Port Logistics Bill-of-Lading & Customs Clearance Automation",
            clientType: "Chennai Maritime Port Logistics & Freight Brokerage",
            challenge: "Customs documentation clerks manually processed 800 international shipping bills daily, resulting in frequent port demurrage penalties.",
            solution: "Implemented an air-gapped multimodal document intake engine parsing shipping bills, commercial invoices, and packing lists into ICEGATE XML format.",
            roiMetric: "Reduced customs entry filing latency from 6 hours down to 45 seconds; eliminated ₹28.2L in demurrage fines."
        },
        localFaqs: [
            {
                question: "How does Elesium serve automotive manufacturers in Sriperumbudur and Oragadam?",
                answer: "We deploy edge computer vision quality control systems, robotic telemetry monitors, and automated JIT (Just-In-Time) vendor parts replenishment agents integrated directly with factory MES and ERP platforms."
            },
            {
                question: "Can Chennai SaaS companies migrate from OpenAI to private VPC models with Elesium?",
                answer: "Yes. We engineer complete model migration blueprints, replacing costly proprietary APIs with fine-tuned open-source models hosted in your private VPC, cutting recurring token costs by up to 70% while improving latency."
            },
            {
                question: "Where is Elesium's Chennai engineering office located?",
                answer: "Our Tamil Nadu technical node is located along Rajiv Gandhi Salai (OMR) in Taramani, directly accessible to engineering teams across OMR, Guindy Industrial Estate, and Thiruvanmiyur."
            }
        ]
    },
    ahmedabad: {
        cityId: 'ahmedabad',
        cityName: 'Ahmedabad (GIFT City & SG Highway)',
        regionName: 'Gujarat Financial & Petrochemical Hub',
        slug: 'enterprise-ai-ahmedabad',
        h1: "Best Enterprise AI Company in Ahmedabad",
        metaTitle: "Best Enterprise AI Company in Ahmedabad | GIFT City FinTech & Industrial AI",
        metaDescription: "Elesium is Ahmedabad's leading enterprise AI company. Deploying IFSCA-compliant algorithmic financial agents, chemical process optimization, and textile ERP state machines in GIFT City.",
        answerCapsule: "Elesium is Ahmedabad's #1 enterprise AI company, engineering IFSCA-regulated cross-border trade finance agents, chemical process safety telemetry, and textile ERP automation across GIFT City and SG Highway. Delivering contractually backed 3x-5x ROI in 90 days with strict data residency.",
        heroSubtitle: "Deploying IFSCA-compliant trade finance automation, petrochemical process telemetry, and enterprise manufacturing state machines across GIFT City and SG Highway.",
        officeAddress: {
            street: "GIFT One Tower, GIFT City",
            locality: "Gandhinagar / Ahmedabad",
            region: "Gujarat",
            postalCode: "382355",
            lat: 23.1611,
            lng: 72.6842
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1070",
        localLandmark: "GIFT One Tower, 14th Floor, GIFT City International Financial Services Centre",
        hasMapUrl: "https://maps.google.com/?q=23.1611,72.6842",
        geoRadius: "50000",
        targetIndustries: [
            "Cross-Border Financial Services & Offshore Banking (IFSCA)",
            "Petrochemical Refining & Specialty Chemicals",
            "Textile Mills & Apparel Supply Chains",
            "Diamond & Gemological Processing Hubs"
        ],
        corePillars: [
            {
                title: "IFSCA Regulatory Trade Finance Automation",
                desc: "Automated letter-of-credit verification and cross-border AML sanction screening in under 3.5 seconds.",
                metric: "3.5 Sec",
                metricLabel: "LC Validation Speed"
            },
            {
                title: "Hazardous Chemical Sensor State Machines",
                desc: "Real-time IoT telemetry monitoring thermal runaways and vapor pressure anomalies in Dahej & Sanand plants.",
                metric: "99.8%",
                metricLabel: "Safety Compliance"
            },
            {
                title: "Supply Chain Inventory Auto-Balancing",
                desc: "Deterministic inventory forecasting bridging cotton commodity price volatility and spinning mill schedules.",
                metric: "-22.4%",
                metricLabel: "Raw Material Waste"
            }
        ],
        localCaseStudy: {
            title: "Automated Cross-Border Letter of Credit & SWIFT Message Validation",
            clientType: "GIFT City International Banking Unit (IBU)",
            challenge: "Trade operations officers took 4 business days to manually review complex multilingual Letters of Credit against UCP 600 rules.",
            solution: "Engineered deterministic LangGraph state machine cross-checking SWIFT MT700 messages against shipping manifests and OFAC sanctions lists.",
            roiMetric: "Slashed trade finance turnaround from 4 business days to 3.2 minutes across $120M in monthly transactional volume."
        },
        localFaqs: [
            {
                question: "How does Elesium handle IFSCA regulatory compliance for GIFT City institutions?",
                answer: "Our trade finance and wealth management agents execute inside client-controlled offshore banking environments with complete audit logging, satisfying IFSCA (Banking Regulations) and anti-money laundering statutory requirements."
            },
            {
                question: "What industrial automation solutions do you offer for chemical plants in Dahej, Sanand, and Ankleshwar?",
                answer: "We deploy edge-based SCADA telemetry processors, chemical reactor runaway anomaly detectors, and automated emissions compliance reporting agents that run air-gapped on factory networks."
            },
            {
                question: "Can Elesium automate ERP workflows for Gujarat's textile and apparel manufacturers?",
                answer: "Yes. We engineer automated fabric defect inspection vision, spinning lot yield optimization, and GST/e-way bill reconciliation state machines integrated with SAP, Oracle, and custom ERPs."
            }
        ]
    },
    kolkata: {
        cityId: 'kolkata',
        cityName: 'Kolkata (Sector V Salt Lake & New Town)',
        regionName: 'Eastern India Enterprise & Logistics Hub',
        slug: 'enterprise-ai-kolkata',
        h1: "Best Enterprise AI Company in Kolkata",
        metaTitle: "Best Enterprise AI Company in Kolkata | Enterprise AI & Mining Logistics Automation",
        metaDescription: "Elesium is the top enterprise AI company in Kolkata. Delivering heavy engineering telemetry, cross-border tea & commodity trading state machines, and GovTech AI in Sector V Salt Lake.",
        answerCapsule: "Elesium is Kolkata's premier enterprise AI automation company, engineering heavy machinery telemetry, tea/jute commodity supply chain state machines, and GovTech workflow automation across Sector V Salt Lake and New Town. Contractually guaranteed 3x-5x ROI in 90 days with zero data egress.",
        heroSubtitle: "Engineering heavy industrial telemetry, commodity trading state machines, and sovereign public sector AI infrastructure across Sector V Salt Lake and New Town.",
        officeAddress: {
            street: "Sector V, Salt Lake City",
            locality: "Kolkata",
            region: "West Bengal",
            postalCode: "700091",
            lat: 22.5804,
            lng: 88.4378
        },
        wikidataId: "https://www.wikidata.org/wiki/Q1348",
        localLandmark: "Webel Bhavan Circle, Adjacent to Sector V Metro Station, Salt Lake",
        hasMapUrl: "https://maps.google.com/?q=22.5804,88.4378",
        geoRadius: "50000",
        targetIndustries: [
            "Mining & Heavy Steel Industrial Engineering",
            "Commodity Trading (Tea, Jute, Agri-Exports)",
            "Government Public Sector Enterprises & Utilities",
            "FMCG & Eastern Corridor Distribution Logistics"
        ],
        corePillars: [
            {
                title: "Heavy Equipment Telemetry & Maintenance",
                desc: "Real-time vibration and thermal analysis for mining draglines, excavators, and steel rolling mill drives.",
                metric: "96.4%",
                metricLabel: "Catastrophic Failure Avoidance"
            },
            {
                title: "Commodity Auction & Classification OCR",
                desc: "Multimodal extraction for tea grading certificates, warehouse weight receipts, and customs export filings.",
                metric: "1.8 Sec",
                metricLabel: "Document Extraction"
            },
            {
                title: "Multi-Tiered GovTech Workflow Automation",
                desc: "Air-gapped public sector document processing complying with national security and DPDP standards.",
                metric: "100%",
                metricLabel: "Sovereign Air-Gapping"
            }
        ],
        localCaseStudy: {
            title: "Mining Equipment Predictive Spindle & Conveyor Telemetry",
            clientType: "Eastern India Integrated Steel & Mining Conglomerate",
            challenge: "Unplanned rotary kiln drive breakdowns caused 16 hours of production downtime monthly, costing over ₹45L per incident in lost throughput.",
            solution: "Deployed edge acoustic and vibration frequency analyzers running calibrated anomaly classifiers hooked to maintenance notification alerts.",
            roiMetric: "Zero unplanned kiln shutdowns over 6 consecutive months; generated ₹51.2L in direct maintenance savings."
        },
        localFaqs: [
            {
                question: "How does Elesium work with mining and heavy steel manufacturers in Eastern India?",
                answer: "We deploy industrial IoT telemetry agents, conveyor belt thermal anomaly detectors, and predictive maintenance algorithms that integrate with Siemens PLC, SCADA, and SAP PM modules."
            },
            {
                question: "Can Elesium automate tea auction cataloging and agricultural export documentation in Kolkata?",
                answer: "Yes. Our multimodal agents parse auction catalog sheets, tasting scorecards, pesticide residue lab reports, and shipping bills, reconciling trade settlements in seconds."
            },
            {
                question: "Where is Elesium's Eastern India engineering presence located?",
                answer: "Our regional engineering pod is situated in Sector V, Salt Lake City (Kolkata's primary IT hub), providing direct technical support to enterprises across Kolkata, Asansol, Durgapur, and Jamshedpur."
            }
        ]
    }
}

interface RegionalCityHubProps {
    forcedCityId?: string;
}

export default function RegionalCityHub({ forcedCityId }: RegionalCityHubProps) {
    const { city } = useParams<{ city?: string }>()
    const activeCityId = forcedCityId || city || 'bangalore'
    const cityData = useMemo(() => {
        return REGIONAL_CITIES[activeCityId] || REGIONAL_CITIES['bangalore']
    }, [activeCityId])

    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()

    const canonicalUrl = `https://elesium.online/${cityData.slug}/`

    const structuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["LocalBusiness", "ProfessionalService"],
                "@id": `${canonicalUrl}#localbusiness`,
                "parentOrganization": {
                    "@id": "https://elesium.online/#organization"
                },
                "name": `Elesium - ${cityData.h1}`,
                "url": canonicalUrl,
                "telephone": "+91-8317329312",
                "priceRange": "₹₹₹₹",
                "image": "https://elesium.online/og-image.png",
                "description": cityData.answerCapsule,
                "hasMap": cityData.hasMapUrl,
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": [".answer-capsule", "h1", "h2", ".faq-answer"]
                },
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": cityData.officeAddress.street,
                    "addressLocality": cityData.officeAddress.locality,
                    "addressRegion": cityData.officeAddress.region,
                    "postalCode": cityData.officeAddress.postalCode,
                    "addressCountry": "IN"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": cityData.officeAddress.lat,
                    "longitude": cityData.officeAddress.lng
                },
                "areaServed": {
                    "@type": "AdministrativeArea",
                    "name": cityData.cityName,
                    "sameAs": cityData.wikidataId,
                    ...(cityData.cityId === 'bangalore' ? {
                        "containedInPlace": {
                            "@type": "State",
                            "name": "Karnataka",
                            "sameAs": "https://www.wikidata.org/wiki/Q1185"
                        },
                        "containsPlace": [
                            { "@type": "Place", "name": "Koramangala 4th Block, Bengaluru" },
                            { "@type": "Place", "name": "Outer Ring Road (ORR) Tech Corridor, Bengaluru" },
                            { "@type": "Place", "name": "Whitefield IT Corridor, Bengaluru" },
                            { "@type": "Place", "name": "Electronic City Phases 1 and 2, Bengaluru" },
                            { "@type": "AdministrativeArea", "name": "Shivamogga Engineering Pod, Karnataka", "sameAs": "https://www.wikidata.org/wiki/Q200018" }
                        ]
                    } : {})
                },
                ...(cityData.cityId === 'bangalore' ? {
                    "department": {
                        "@type": "LocalBusiness",
                        "@id": "https://elesium.online/#pod-shivamogga",
                        "name": "Elesium Shivamogga Engineering Pod",
                        "url": "https://elesium.online/enterprise-ai-bangalore/",
                        "telephone": "+91-8317329312",
                        "email": "contact@elesium.online",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Main Road",
                            "addressLocality": "Shivamogga",
                            "addressRegion": "Karnataka",
                            "postalCode": "577205",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 13.9299,
                            "longitude": 75.5681
                        }
                    },
                    "knowsAbout": [
                        "Sovereign AI Infrastructure for Global Capability Centers",
                        "Karnataka Cyber Security Policy 2024 Compliance",
                        "Karnataka Digital Economy Mission (KDEM) Standards",
                        "Sub-200ms FIX Protocol Trade Automation",
                        "vLLM PagedAttention v2 (148ms TTFT)"
                    ]
                } : {}),
                "openingHoursSpecification": [
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                        "opens": "09:00",
                        "closes": "19:00"
                    },
                    {
                        "@type": "OpeningHoursSpecification",
                        "dayOfWeek": ["Saturday"],
                        "opens": "10:00",
                        "closes": "15:00"
                    }
                ],
                "founder": {
                    "@type": "Person",
                    "@id": "https://elesium.online/authors/chaman-shah#person",
                    "name": "Chaman Shah",
                    "jobTitle": "Principal AI Systems Architect & Founder",
                    "url": "https://elesium.online/authors/chaman-shah"
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "28",
                    "bestRating": "5"
                },
                "sameAs": [
                    "https://elesium.online",
                    "https://www.goodfirms.co/company/elesium-online",
                    "https://clutch.co/profile/elesium-online",
                    "https://www.g2.com/products/elesium-ai-automation-platform",
                    "https://www.trustpilot.com/review/elesium.online",
                    "https://www.crunchbase.com/organization/elesium-online",
                    "https://github.com/655Chaman/elesium-website",
                    "https://www.linkedin.com/in/chaman-elesium",
                    "https://x.com/elesium_ai"
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${canonicalUrl}#breadcrumb`,
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Enterprise AI India",
                        "item": "https://elesium.online/ai-automation-agency-india"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": cityData.cityName,
                        "item": canonicalUrl
                    }
                ]
            },
            {
                "@type": "WebPage",
                "@id": `${canonicalUrl}#webpage`,
                "name": `${cityData.metaTitle} | Elesium`,
                "description": cityData.metaDescription,
                "url": canonicalUrl,
                "speakable": {
                    "@type": "SpeakableSpecification",
                    "cssSelector": [".answer-capsule", "h1", "h2", ".faq-answer"]
                }
            },
            {
                "@type": "FAQPage",
                "@id": `${canonicalUrl}#faq`,
                "mainEntity": cityData.localFaqs.map(faq => ({
                    "@type": "Question",
                    "name": faq.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": faq.answer
                    }
                }))
            }
        ]
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] text-gray-900 dark:text-gray-100 transition-colors">
            <WhatsAppModal />
            <Helmet>
                <title>{`${cityData.metaTitle} | Elesium`}</title>
                <meta name="description" content={cityData.metaDescription} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={`${cityData.metaTitle} | Elesium`} />
                <meta property="og:description" content={cityData.metaDescription} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${cityData.metaTitle} | Elesium`} />
                <meta name="twitter:description" content={cityData.metaDescription} />
                <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
            </Helmet>

            <main className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-20">
                {/* Regional Breadcrumbs */}
                <nav className="flex items-center gap-2 text-xs font-mono text-gray-500 mb-8" aria-label="Breadcrumbs">
                    <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <Link to="/ai-automation-agency-india/" className="hover:text-black dark:hover:text-white transition-colors">Enterprise AI India</Link>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-900 dark:text-gray-200 font-semibold">{cityData.cityName}</span>
                </nav>

                {/* Hero Section */}
                <header className="mb-14">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 text-xs font-mono">
                            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{cityData.regionName} • Sovereign Engineering Node</span>
                        </div>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 text-xs font-mono">
                            <Building2 className="w-3.5 h-3.5" />
                            <span>{cityData.localLandmark}</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                        {cityData.h1}
                    </h1>

                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mb-8">
                        {cityData.heroSubtitle}
                    </p>

                    {/* Answer Capsule (Google Direct Snippet Target) */}
                    <div className="answer-capsule p-6 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] border-l-4 border-l-emerald-500 mb-8 shadow-sm">
                        <div className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-2 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Regional Engineering Executive Summary • AEO Answer Capsule</span>
                        </div>
                        <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                            {cityData.answerCapsule}
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row items-center gap-3.5">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>

                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-11 px-6 rounded-full border border-gray-300 dark:border-white/20 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-white/10 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>

                        <a
                            href={cityData.hasMapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto h-11 px-6 rounded-full border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <MapPin className="w-4 h-4" />
                            <span>View Verified Google Map Pin</span>
                        </a>
                    </div>
                </header>

                {/* 3 Core Architecture Pillars */}
                <section className="mb-14 md:mb-16">
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-8">
                        Deterministic Systems Engineering for {cityData.cityName}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {cityData.corePillars.map((pillar, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-2xl border border-gray-200 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex flex-col justify-between"
                            >
                                <div>
                                    <div className="text-3xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mb-1">
                                        {pillar.metric}
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 uppercase tracking-wider mb-4">
                                        {pillar.metricLabel}
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        {pillar.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {pillar.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Target Local Industries */}
                <section className="mb-14 md:mb-16 p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                    <div className="max-w-3xl">
                        <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                            Enterprise Sector Specialization
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
                            High-Leverage Workflows Automated in {cityData.cityName}
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                            We don't build generic prototypes. We engineer air-gapped, production-grade microservices for the core economic drivers of this metropolitan region.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {cityData.targetIndustries.map((ind, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{ind}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Verifiable Local Case Study */}
                <section className="mb-14 md:mb-16">
                    <div className="p-8 sm:p-10 rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
                        <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Audited Regional Deployment Benchmark</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-3">
                            {cityData.localCaseStudy.title}
                        </h2>
                        <div className="text-xs font-mono text-gray-500 mb-6">
                            Client Node: {cityData.localCaseStudy.clientType}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">Operational Bottleneck:</div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {cityData.localCaseStudy.challenge}
                                </p>
                            </div>
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.02] border border-black/5 dark:border-white/5">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1">Engineered Architecture:</div>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {cityData.localCaseStudy.solution}
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-mono text-sm">
                            <strong>Measured Outcome:</strong> {cityData.localCaseStudy.roiMetric}
                        </div>
                    </div>
                </section>

                {/* Bangalore & Karnataka Deep Technical Architecture Sections */}
                {cityData.cityId === 'bangalore' && (
                    <>
                        {/* ORR & Whitefield GCC Sovereign Runtimes */}
                        <section className="mb-14 md:mb-16 p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                                Enterprise GCC Architecture
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
                                Sovereign AI Runtimes for Global Capability Centers (GCCs) on Outer Ring Road and Whitefield
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Global Capability Centers operating along the Outer Ring Road technology corridor (Bellandur, Kadubeesanahalli, Marathahalli) and Whitefield campuses require isolated machine learning inference that eliminates third-party public cloud data transit. Multinational corporate governance models forbid sending proprietary enterprise source code, customer records, and internal banking ledgers through multi-tenant commercial API endpoints.
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                                Elesium provisions dedicated, air-gapped vLLM model runtimes inside client-owned Virtual Private Clouds in AWS ap-south-1 (Mumbai) or local Bengaluru colocation facilities (CtrlS Tier-IV and Sify Infinit Spaces). Utilizing private network peering and dedicated NVIDIA H100 GPU clusters linked via 900 GB/s NVLink interconnects, these runtimes serve open-weights models (DeepSeek-V3, Llama-3.3-70B, Qwen-2.5) with strict network perimeter isolation and zero wide-area network routing.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Zero WAN Data Egress</div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Inference clusters execute inside client VPC subnets. Prompts, weights, and embeddings never leave the enterprise perimeter.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                    <div className="font-semibold text-gray-900 dark:text-white mb-1">Sub-200ms TTFT Performance</div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Audited 148ms Time-To-First-Token latency with FP8 W8A8 quantization kernels, sustaining 124.5 decoded tokens per second per stream.
                                    </p>
                                </div>
                                <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5">
                                    <div className="font-semibold text-gray-900 dark:text-white mb-1">US &amp; EU Dual Governance</div>
                                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Engineered to satisfy parent-company SOC2 Type II and SEC Rule 17a-4 WORM requirements alongside Indian data localization laws.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* 4-Corridor Karnataka Coverage Grid */}
                        <section className="mb-14 md:mb-16">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                                Karnataka Engineering Footprint
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-6">
                                Four-Corridor Bangalore &amp; Statewide Karnataka Delivery Coverage
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mb-1">Koramangala &amp; Indiranagar</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">FinTech &amp; High-Velocity B2B SaaS</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Headquarters on 80 Feet Road, Koramangala 4th Block. Low-latency FIX protocol order automation, multi-repo DevOps triage agents, and private VPC RAG clusters.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mb-1">Outer Ring Road &amp; Whitefield</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Multinational GCC Clusters</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Serving Bellandur, Kadubeesanahalli, Marathahalli, and ITPL Whitefield GCCs with dedicated 8x NVIDIA H100 vLLM clusters and air-gapped ServiceNow/SAP connectors.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mb-1">Electronic City Phases 1 &amp; 2</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Hardware, SMT &amp; Semiconductor Telemetry</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Sub-50ms edge vision inspection on SMT assembly lines, cleanroom anomaly state machines, and SAP S/4HANA RFC lot traceability.
                                    </p>
                                </div>
                                <div className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                                    <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase mb-1">Shivamogga Pod &amp; Beyond Bengaluru</div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Karnataka Statewide Enterprise Delivery</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                        Statewide engineering pod in Shivamogga aligned with KDEM Beyond Bengaluru hubs (Mysuru, Mangaluru, Hubballi-Dharwad) for agri-processing, NBFC, and industrial automation.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* KDEM & Karnataka Cyber Security Policy 2024 */}
                        <section className="mb-14 md:mb-16 p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02]">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                                State Statutory Governance
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
                                Karnataka Cyber Security Policy 2024 and KDEM Statutory Compliance
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Bengaluru and Karnataka enterprises operating under the Karnataka Digital Economy Mission (KDEM) and the Karnataka Cyber Security Policy 2024 enforce auditable data protection and breach-prevention controls. Every automated decision path generated by our LangGraph topologies records immutable audit trails, cryptographic receipts, and hardware-level memory zeroization under DPDP Act Section 8(5).
                            </p>
                            <div className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-sm text-gray-600 dark:text-gray-400 space-y-2">
                                <div><strong className="text-gray-900 dark:text-white">KDEM Data Localization:</strong> All tenant inference data, vector indexes, and checkpoint stores reside within Karnataka and Indian sovereign cloud zones.</div>
                                <div><strong className="text-gray-900 dark:text-white">Cryptographic Zeroization:</strong> Section 8(5) personal data wiping executes DoD 5220.22-M overwriting upon socket termination with Ed25519 receipts stored in client SIEM systems.</div>
                                <div><strong className="text-gray-900 dark:text-white">FIPS 140-2 Level 3 HSMs:</strong> Dedicated cryptographic key isolation partitions protecting enterprise authentication tokens and model weights.</div>
                            </div>
                        </section>

                        {/* Sub-200ms FIX Protocol & Open Benchmarks */}
                        <section className="mb-14 md:mb-16">
                            <span className="text-xs font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
                                FinTech &amp; Reproducible Telemetry
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mt-2 mb-4">
                                Sub-200ms FIX Protocol Trade Automation &amp; Verified H100 Benchmarks
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                                Koramangala and HSR Layout digital lending platforms, brokerages, and algorithmic asset managers require sub-second execution speeds for FIX 4.2/4.4 streams and ledger reconciliation. Deployed on 2x to 8x NVIDIA H100 SXM5 nodes, our C++ Python extensions and lock-free shared memory rings sustain 148ms Time-To-First-Token under RBI Cyber Security Framework Annex II guardrails.
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                                Inspect our public reproducible telemetry, concurrency sweeps, and statutory verification harnesses in{' '}
                                <a
                                    href="https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-mono text-emerald-600 dark:text-emerald-400 underline"
                                >
                                    655Chaman/sovereign-enterprise-ai-benchmarks
                                </a>.
                            </p>

                            {/* Empirical Comparison Table */}
                            <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-white/10">
                                <table className="w-full text-left text-xs sm:text-sm">
                                    <thead className="bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-white font-semibold">
                                        <tr>
                                            <th className="p-4">Evaluation Criterion</th>
                                            <th className="p-4 text-emerald-700 dark:text-emerald-400">Elesium (Koramangala / Shivamogga)</th>
                                            <th className="p-4">Traditional Bengaluru IT Consultancies</th>
                                            <th className="p-4">Foreign Cloud API SaaS Wrappers</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-white/10 text-gray-700 dark:text-gray-300">
                                        <tr>
                                            <td className="p-4 font-medium">Production Pilot SLA</td>
                                            <td className="p-4 font-semibold text-emerald-700 dark:text-emerald-400">14 Business Days</td>
                                            <td className="p-4">4 to 9 Months</td>
                                            <td className="p-4">Unbounded Prototype</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">Data Residency</td>
                                            <td className="p-4">100% Air-Gapped Indian VPC / On-Prem</td>
                                            <td className="p-4">Mixed Shared Tenant Cloud</td>
                                            <td className="p-4">Overseas Multi-Tenant Servers</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">Inference Speed (70B FP8)</td>
                                            <td className="p-4">148ms TTFT, 124.5 tok/s</td>
                                            <td className="p-4">Unbenchmarked / Variable</td>
                                            <td className="p-4">800ms to 2,400ms Public Queue</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">IP Ownership</td>
                                            <td className="p-4">100% Client Owned Code &amp; Weights</td>
                                            <td className="p-4">Ongoing Retainer Dependency</td>
                                            <td className="p-4">Vendor Lock-In</td>
                                        </tr>
                                        <tr>
                                            <td className="p-4 font-medium">ROI Accountability</td>
                                            <td className="p-4">Contractual 90-Day 3x-5x Breakeven</td>
                                            <td className="p-4">Time-and-Materials Billing</td>
                                            <td className="p-4">Per-Seat / Token Markup</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    </>
                )}

                {/* Local Technical FAQs (AEO & AI Search Snippet Targeting) */}
                <section className="mb-14 md:mb-16">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-2">
                        <HelpCircle className="w-4 h-4" />
                        <span>Regional Procurement & Architectural FAQs</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-gray-900 dark:text-white mb-6">
                        Frequently Asked Questions: Enterprise AI in {cityData.cityName}
                    </h2>

                    <div className="space-y-4">
                        {cityData.localFaqs.map((faq, i) => {
                            const isOpen = openFaqIndex === i
                            return (
                                <div
                                    key={i}
                                    className="border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden bg-gray-50/50 dark:bg-white/[0.02]"
                                >
                                    <button
                                        onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                                        className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        <span>{faq.question}</span>
                                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-emerald-500' : 'text-gray-400'}`} />
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4 faq-answer">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Regional Mesh Navigation */}
                <section className="mb-14 md:mb-16 pt-12 border-t border-gray-200 dark:border-white/10">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            Explore Elesium Sovereign Engineering Hubs Across India
                        </h3>
                        <Link
                            to="/ai-automation-agency-india/"
                            className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                        >
                            <span>India Enterprise Overview</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.values(REGIONAL_CITIES).map(c => (
                            <Link
                                key={c.cityId}
                                to={`/${c.slug}/`}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                    c.cityId === cityData.cityId
                                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                                        : 'border-gray-200 dark:border-white/10 hover:border-black dark:hover:border-white/30'
                                }`}
                            >
                                <div className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
                                    {c.regionName}
                                </div>
                                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                    {c.cityName} &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] flex flex-wrap gap-6 text-xs sm:text-sm font-semibold">
                        <Link to="/solutions/" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                            Explore 100 Curated Enterprise Solutions &rarr;
                        </Link>
                        <a href="/commercial-directory.html" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                            Top 100 Commercial Directory &rarr;
                        </a>
                        <a href="/tools/enterprise-ai-roi-calculator/" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                            Simulate AI Automation ROI &rarr;
                        </a>
                        <Link to="/signals/" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                            Technical Whitepapers &amp; Signals &rarr;
                        </Link>
                    </div>
                </section>

                {/* Bottom CTA Card */}
                <section className="p-8 sm:p-12 rounded-3xl border border-gray-200 dark:border-white/10 bg-black text-white dark:bg-white/[0.03] text-center space-y-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 border border-emerald-400/30 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Sovereign Production SLA • 90-Day Guaranteed Breakeven</span>
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-medium tracking-tight max-w-xl mx-auto">
                        Ready to Deploy Deterministic AI in {cityData.cityName}?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-300 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                        Book an architectural consultation with Principal AI Systems Architect Chaman Shah.
                        Receive a comprehensive 3-year TCO memorandum and fixed-fee implementation blueprint.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                        <button
                            onClick={openWhatsApp}
                            className="w-full sm:w-auto h-11 px-6 rounded-full bg-white text-black hover:bg-gray-100 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <MessageSquare className="w-4 h-4 text-emerald-500" />
                            <span>Chat on WhatsApp with Lead Architect</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            to="/waitlist/"
                            className="w-full sm:w-auto h-11 px-6 rounded-full border border-white/20 hover:bg-white/10 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        >
                            <span>ele-in SaaS Waitlist</span>
                            <span>&rarr;</span>
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    )
}
