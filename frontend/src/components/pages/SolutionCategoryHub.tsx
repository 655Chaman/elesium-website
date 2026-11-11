import { useState, useMemo } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database,
    Network,
    Activity,
    Terminal,
    Shield,
    Plane,
    Zap,
    Pickaxe,
    Lock,
    ArrowRight,
    ChevronDown,
    ChevronRight,
    FileCheck2,
    Cpu,
    Scale,
    Sparkles
} from 'lucide-react'
import { solutionCategories } from '../../data/solutionsHubData'
import { useWhatsApp } from '../../hooks/useWhatsApp'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Truck,
    ShieldCheck,
    Factory,
    HeartPulse,
    Database,
    Network,
    Activity,
    Terminal,
    Shield,
    Plane,
    Zap,
    Pickaxe,
    Lock
}

interface SiloMetadata {
    id: string
    name: string
    h1: string
    title: string
    metaDescription: string
    answerCapsule: string
    icon: string
    regulatoryAuthority: string
    complianceFramework: string
    targetPersonas: string
    coreMetrics: { label: string; value: string; desc: string }[]
    architectureDeepDive: string[]
    capabilities: { title: string; desc: string }[]
    faqs: { q: string; a: string }[]
}

const SILO_METADATA: Record<string, SiloMetadata> = {
    logistics: {
        id: "logistics",
        name: "Logistics & Supply Chain",
        h1: "Autonomous Multi-Carrier Fleet Dispatch, Real-Time Telematics & ERP Synchronization",
        title: "Logistics & Supply Chain Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy enterprise autonomous logistics AI with sub-200ms dispatch latency, MoRTH ULIP & FASTag telematics integration, and private VPC security.",
        answerCapsule: "Elesium's logistics AI architecture executes deterministic LangGraph state machines for multi-depot vehicle routing (VRP), dynamic multi-carrier freight re-routing, and cold-chain telematics synchronization directly into SAP TM, Oracle SCM, and FarEye with sub-200ms latency and zero external data retention.",
        icon: "Truck",
        regulatoryAuthority: "MoRTH, ULIP, DGCA & DPDP Act 2023",
        complianceFramework: "MoRTH National Logistics Policy (NLP), Unified Logistics Interface Platform (ULIP) API Integration, FASTag Electronic Toll Telematics, DGCA Part 107 Drone Rules, and Section 8(5) DPDP Act 2023 statutory data erasure.",
        targetPersonas: "VP of Supply Chain, Chief Operating Officer, Logistics Director, Fleet Telematics Lead",
        coreMetrics: [
            { label: "Dispatch Latency", value: "< 180ms", desc: "Deterministic multi-carrier allocation" },
            { label: "Empty-Mile Reduction", value: "24.6%", desc: "Dynamic backhaul graph optimization" },
            { label: "SLA Uptime", value: "99.99%", desc: "Air-gapped private VPC high availability" },
            { label: "ERP Integration", value: "Sub-14 Days", desc: "Native SAP TM & Oracle SCM connectors" }
        ],
        architectureDeepDive: [
            "Modern enterprise supply chains face severe operational friction when legacy Transportation Management Systems (TMS) fail to dynamically respond to driver shortages, weather anomalies, dock congestion, and sudden fuel price volatility. Elesium deploys deterministic multi-agent systems that model fleet operations as a continuous, directed acyclic graph (DAG) of state transitions, eliminating manual dispatcher intervention while preserving strict business rule guardrails.",
            "Our logistics state machine architecture decouples planning from real-time execution. A primary Dispatch Orchestration Agent continuously ingests GPS telematics, OBD-II diagnostic fault codes, and electronic logging device (ELD) hours-of-service feeds via high-throughput Kafka streaming pipelines. When traffic disruptions or mechanical exceptions occur, the agent executes localized graph re-routing algorithms in sub-180ms, updating driver mobile endpoints and customer delivery milestones synchronously.",
            "All outbound carrier communications, bill of lading (BOL) extractions, and freight audit reconciliations execute inside dedicated private VPC enclaves hosted in sovereign Indian tier-IV datacenters (CtrlS and Yotta Shakti). In strict compliance with DPDP Act 2023 Section 8(5), all driver personal location history and biometric authentication data is cryptographically expunged immediately upon voyage completion, eliminating enterprise statutory liability."
        ],
        capabilities: [
            { title: "Deterministic Fleet Dispatching", desc: "Automated multi-carrier rate shopping, load-to-vehicle optimization, and automated driver assignment based on hours-of-service compliance." },
            { title: "Dynamic Exception Re-Routing", desc: "Sub-200ms graph re-routing around traffic incidents, checkpoint delays, and severe weather with automated ETA updates to ERP systems." },
            { title: "Cold-Chain IoT Telemetry", desc: "Continuous temperature and humidity threshold monitoring with automated emergency re-route triggers before cargo spoilage thresholds are breached." },
            { title: "Automated Freight Invoice Audit", desc: "Three-way matching of purchase orders, electronic proof of delivery (ePOD), and carrier invoices with automated discrepancy flagging." }
        ],
        faqs: [
            { q: "How does Elesium integrate with existing SAP TM or Oracle Transportation Management?", a: "We deploy secure, bi-directional REST webhooks and read-replica database connectors that interface with standard SAP BTP and Oracle Integration Cloud interfaces without requiring disruptive modifications to core ERP transaction tables." },
            { q: "What happens if cellular connectivity is lost in rural transit corridors?", a: "Mobile driver client agents maintain an offline SQLite state cache. Telematics and proof-of-delivery snapshots are cryptographically hashed and queued locally, automatically synchronizing via two-phase commit protocols upon reconnection." },
            { q: "How does the architecture comply with India's Unified Logistics Interface Platform (ULIP)?", a: "Elesium features pre-built adapters for ULIP's national logistics gateway, enabling real-time verification of vehicle registration (VAHAN), driver credentials (SARATHI), and toll movement (FASTag) within automated state checks." },
            { q: "What is the contractual deployment SLA for a logistics pilot?", a: "A fully functional logistics dispatch or freight audit agent is deployed within 14 business days, backed by our contractual 90-day cash-flow ROI guarantee." },
            { q: "Can the agents handle multi-modal logistics (road, rail, air cargo)?", a: "Yes. Our state graph schema supports multi-leg intermodal transshipment nodes, synchronizing container rail manifests, air waybills, and last-mile trucking fleets within a single unified control plane." }
        ]
    },
    bfsi: {
        id: "bfsi",
        name: "BFSI & Underwriting",
        h1: "Deterministic Multi-Agent Underwriting, Core Banking Ledger Reconciliation & Fraud Telemetry",
        title: "BFSI, FinTech & Automated Underwriting Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy enterprise BFSI AI agents with sub-50ms rule enforcement, RBI Master Directions 2023 compliance, private VPC security, and zero external LLM transit.",
        answerCapsule: "Elesium's BFSI AI architecture deploys air-gapped LangGraph state machines for real-time commercial loan underwriting, core banking ledger reconciliation, and anti-money laundering (AML) transaction monitoring under strict RBI Master Directions 2023 and DPDP Act 2023 compliance with zero third-party telemetry.",
        icon: "ShieldCheck",
        regulatoryAuthority: "RBI, SEBI, IRDAI & DPDP Act 2023",
        complianceFramework: "RBI Master Direction on IT Governance, Risk and Controls (2023), SEBI Cybersecurity & Cyber Resilience Framework (CSCRF), IRDAI Information Security Regulations, and DPDP Act 2023 Section 8(5).",
        targetPersonas: "Chief Risk Officer, Chief Technology Officer, Head of Credit Underwriting, Head of Banking Operations",
        coreMetrics: [
            { label: "Underwriting Decision", value: "< 450ms", desc: "Pydantic strict schema balance sheet parsing" },
            { label: "Reconciliation Accuracy", value: "99.999%", desc: "Deterministic two-phase ledger audit" },
            { label: "Data Residency", value: "100% Air-Gapped", desc: "Sovereign AWS ap-south-1 & CtrlS VPC" },
            { label: "False Positive Reduction", value: "62.4%", desc: "Multi-agent AML contextual arbitration" }
        ],
        architectureDeepDive: [
            "In institutional financial services, generic LLM wrappers represent an unacceptable existential risk due to hallucinations, stochastic non-determinism, and data exfiltration across public cloud APIs. Elesium replaces probabilistic generation with deterministic LangGraph state machines where every credit underwriting decision and transaction audit is governed by immutable Pydantic schema validation.",
            "Our banking architecture operates in a zero-trust enclave: financial statements, GST filings (GSTR-2A/3B), bank statements, and MCA corporate disclosures are ingested through dedicated optical extraction pipelines. The balance sheet data is cross-verified against live credit bureau APIs (CIBIL, Experian, CRIF High Mark) in sub-450ms.",
            "Core banking integration utilizes certified read-replica listeners connected to Finacle, TCS BaNCS, or Flexcube. Ledger reconciliation agents execute continuous double-entry verification across payment gateways, clearing houses (NPCI/IMPS/NEFT), and internal omnibus accounts, flagging variance anomalies in real time without human fatigue."
        ],
        capabilities: [
            { title: "Automated Commercial Underwriting", desc: "End-to-end ingestion and ratio analysis of audited financial statements, tax returns, and bank statements with automated CAM generation." },
            { title: "Real-Time AML & Fraud Telemetry", desc: "Context-aware graph analysis of high-velocity transaction streams, identifying mule networks and circular trading structures in sub-50ms." },
            { title: "Automated Ledger Reconciliation", desc: "Continuous two-phase settlement verification across core banking ledgers, card networks, and UPI gateways with automated break categorization." },
            { title: "Statutory Compliance Reporting", desc: "Automated aggregation and validation of regulatory returns for RBI, SEBI, and IRDAI compliance audits." }
        ],
        faqs: [
            { q: "How does Elesium guarantee banking data will never leak to public LLM providers?", a: "All models execute exclusively on dedicated private VPC inference servers (vLLM on NVIDIA H100 clusters) located inside sovereign Indian tier-IV datacenters. Zero external API calls are made, and zero client data is stored post-inference." },
            { q: "How does the platform comply with RBI IT Governance Master Directions 2023?", a: "Every automated state transition generates a cryptographically signed SHA-256 audit log detailing the exact input data, model weights, execution timestamp, and decision rationale, fulfilling all statutory explainability mandates." },
            { q: "Can the agents interface with legacy core banking systems like Finacle 10/11?", a: "Yes. We interface via standard ISO 8583 / ISO 20022 financial messaging protocols and dedicated read-replica database connectors with zero disruption to active OLTP transaction processing." },
            { q: "What is the accuracy rate on financial statement OCR and tabular extraction?", a: "By combining layout-aware vision transformers with strict programmatic arithmetic reconciliation (where Assets must equal Liabilities + Equity), our tabular extraction accuracy exceeds 99.8%." },
            { q: "Does Elesium provide an on-premise deployment option for Tier-1 public sector banks?", a: "Yes. Our entire multi-agent orchestration stack is containerized with Kubernetes and deployable completely air-gapped on bare-metal bank infrastructure." }
        ]
    },
    manufacturing: {
        id: "manufacturing",
        name: "Industrial Manufacturing",
        h1: "Autonomous SCADA Integration, Predictive Vibration Maintenance & Factory Line Robotics",
        title: "Industrial Manufacturing & Industry 4.0 Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy Industry 4.0 industrial AI with sub-15ms edge inference, ISA-95 SCADA integration, and predictive maintenance telemetry. Explore sovereign architecture.",
        answerCapsule: "Elesium's industrial manufacturing AI architecture integrates directly into plant-floor SCADA, PLC, and MES networks via OPC-UA and Modbus TCP, executing sub-15ms edge inference for predictive bearing maintenance, automated visual surface inspection, and OEE optimization under ISA-95 architecture standards.",
        icon: "Factory",
        regulatoryAuthority: "BIS, ISA-95 & IEC 62443",
        complianceFramework: "ISA-95 Enterprise-Control System Integration, IEC 62443 Industrial Network & System Security, Bureau of Indian Standards (BIS) IS/ISO 9001, and National Manufacturing Policy (NMP).",
        targetPersonas: "VP of Manufacturing, Plant Operations Director, Chief Technology Officer, Industrial Automation Lead",
        coreMetrics: [
            { label: "Edge Inference Latency", value: "< 15ms", desc: "TensorRT edge deployment on industrial IPCs" },
            { label: "Unplanned Downtime", value: "- 38.2%", desc: "Predictive vibration & thermal FFT analysis" },
            { label: "Defect Escape Rate", value: "< 0.01%", desc: "High-speed line vision inspection" },
            { label: "Protocol Support", value: "OPC-UA / Modbus", desc: "Native Siemens, Rockwell & Schneider bridge" }
        ],
        architectureDeepDive: [
            "Heavy industrial manufacturing and discrete assembly lines operate under millisecond time constraints where network latency or cloud dependence introduces catastrophic line stoppages. Elesium engineers edge-deployed, deterministic AI agents that execute directly on industrial IPCs and on-premise compute nodes connected to the plant operational technology (OT) network.",
            "Our Industrial Architecture implements strict ISA-95 Purdue Model boundaries: Level 1 and Level 2 sensor telemetry is sampled at up to 20 kHz. Fast Fourier Transform (FFT) feature extractors detect bearing race spalling and stator winding anomalies weeks before mechanical failure occurs.",
            "Line-speed visual quality inspection utilizes quantized vision transformers deployed via NVIDIA TensorRT on edge GPUs, inspecting 60+ components per second for micro-fissures, weld porosity, and dimensional tolerances with sub-15ms inference latency. Real-time reject triggers interface directly with pneumatic diverter gates via dry-contact PLC relays."
        ],
        capabilities: [
            { title: "Predictive Asset Health Monitoring", desc: "Continuous spectral vibration and thermal imaging telemetry to predict gearbox, spindle, and pump failures prior to breakdown." },
            { title: "High-Speed Automated Optical Inspection (AOI)", desc: "Sub-15ms visual defect classification on high-speed conveyors, identifying micro-scratches, porosity, and dimensional errors." },
            { title: "Autonomous MES Work-Order Scheduling", desc: "Dynamic rescheduling of production lines in response to raw material shortages, machine maintenance events, and priority order shifts." },
            { title: "Energy & Consumable Optimization", desc: "Closed-loop optimization of furnace temperatures, compressor air pressure, and coolant flow rates to reduce factory utility overhead." }
        ],
        faqs: [
            { q: "Can Elesium agents run without active internet connectivity on isolated factory floors?", a: "Yes. Our industrial edge runtime is completely autonomous and air-gapped. All machine learning inference and PLC actuation executes locally on plant-floor IPCs without cloud dependencies." },
            { q: "How do you protect industrial networks from cybersecurity intrusions?", a: "We strictly adhere to IEC 62443 standards. The AI appliance communicates via read-only unidirectional data diodes or encrypted OPC-UA channels with hardware certificate authentication." },
            { q: "Which PLC and SCADA brands are supported out of the box?", a: "We maintain native protocol drivers for Siemens (S7-1200/1500), Rockwell Allen-Bradley (ControlLogix), Schneider Electric (Modicon), Omron, and Mitsubishi MELSEC." },
            { q: "How much historical sensor data is required before predictive maintenance becomes effective?", a: "By leveraging physics-informed neural networks (PINNs) initialized on baseline ISO 10816 vibration severity standards, the system begins detecting anomalous spectral peaks within 7 days of installation." },
            { q: "What is the expected ROI for an automotive or machining plant deployment?", a: "Most industrial clients recoup their entire deployment investment within 90 days solely by eliminating a single major unplanned line-stoppage event." }
        ]
    },
    healthcare: {
        id: "healthcare",
        name: "Healthcare AI",
        h1: "Sovereign Clinical Workflow Automation, DICOM Telemetry & EHR Synchronization",
        title: "Healthcare & Regulated Medical AI Solutions | Elesium",
        metaDescription: "Deploy sovereign clinical healthcare AI with ABDM, CDSCO Medical Device Rules 2017, and HIPAA compliance. Explore private VPC clinical architecture.",
        answerCapsule: "Elesium's healthcare AI architecture deploys air-gapped, sovereign clinical decision-support and workflow agents that integrate seamlessly with FHIR R4, HL7, and DICOM PACS infrastructure under strict ABDM, CDSCO Medical Device Rules, and DPDP Act 2023 compliance with zero external data retention.",
        icon: "HeartPulse",
        regulatoryAuthority: "CDSCO, ABDM, NABH & DPDP Act 2023",
        complianceFramework: "CDSCO Medical Device Rules 2017, Ayushman Bharat Digital Mission (ABDM) Health Data Management Policy, NABH Digital Health Accreditation, and DPDP Act 2023 Section 8(5).",
        targetPersonas: "Chief Medical Officer, Hospital Chief Operating Officer, Head of Radiology, Healthcare Technology Director",
        coreMetrics: [
            { label: "Clinical Note Parsing", value: "< 320ms", desc: "FHIR R4 semantic extraction from dictation" },
            { label: "DICOM Pre-Screening", value: "< 800ms", desc: "High-throughput CT/X-ray anomaly triage" },
            { label: "Data Privacy", value: "100% De-Identified", desc: "Automated Safe Harbor PHI scrubbing" },
            { label: "EHR Connectivity", value: "HL7 & FHIR", desc: "Native Epic, Cerner, Practo & KareXpert sync" }
        ],
        architectureDeepDive: [
            "Clinical healthcare environments demand infallible precision, near-instantaneous response times, and uncompromising patient data confidentiality. Generic cloud AI architectures that transmit patient health information across public internet gateways violate both international HIPAA statutes and India's statutory DPDP Act 2023.",
            "Elesium's clinical multi-agent systems operate within an air-gapped on-premise or sovereign private cloud enclave. Unstructured physician voice dictations, nursing handover notes, and pathology reports are ingested through a specialized Clinical De-Identification Agent that strips all 18 HIPAA Safe Harbor and ABDM identifiers.",
            "Our diagnostic imaging agents interface directly with hospital PACS networks via standard DICOM C-STORE and C-MOVE protocols, processing acute studies and elevating critical cases to the top of attending clinician worklists in sub-second cycles."
        ],
        capabilities: [
            { title: "Automated Clinical Documentation & FHIR Synthesis", desc: "Transforms ambient physician-patient consultations into structured SOAP notes and FHIR R4 resources ready for EHR commit." },
            { title: "Emergency PACS Imaging Triage", desc: "Sub-second pre-screening of acute CT and X-ray studies with automated priority escalation for life-threatening pathologies." },
            { title: "Insurance Pre-Authorization & Claims Automation", desc: "Automated matching of clinical case files against insurer pre-authorization guidelines and TPA portals, cutting claim query cycles by 70%." },
            { title: "ICU Real-Time Deterioration Alarms", desc: "Continuous monitoring of bedhead telemetry (SpO2, blood pressure, end-tidal CO2) to predict septic shock and hemodynamic collapse." }
        ],
        faqs: [
            { q: "How does Elesium protect Patient Health Information (PHI) under India's DPDP Act 2023?", a: "Patient identifiers are cryptographically tokenized and severed from clinical observations at the network ingress point. Furthermore, our models execute statelessly with zero persistence of audio or raw medical text." },
            { q: "Is the system compatible with India's Ayushman Bharat Digital Mission (ABDM)?", a: "Yes. Our architecture includes pre-certified ABDM milestone-1, 2, and 3 connectors for ABHA creation, health document linking, and consent manager integration." },
            { q: "Can the agents integrate with our hospital's existing EHR/HIS software?", a: "We support bidirectional communication with all major hospital information systems (Epic, Cerner, Meditech, KareXpert, Practo) via certified HL7 v2.x and FHIR R4 interfaces." },
            { q: "Are your diagnostic triage agents designed to replace certified radiologists?", a: "No. Our agents act strictly as Tier-1 triage assistants that organize the radiologist's worklist by clinical urgency. All diagnostic reports require final clinician sign-off." },
            { q: "What hardware is required for on-premise hospital deployment?", a: "A standard on-premise cluster consisting of 2x NVIDIA A100 or 4x L40S enterprise GPUs is sufficient to service a 500-bed hospital's concurrent imaging and clinical note throughput." }
        ]
    },
    erp: {
        id: "erp",
        name: "ERP & Systems",
        h1: "Autonomous SAP S/4HANA, Oracle Cloud & Tally Prime Multi-Agent Workflows",
        title: "Enterprise ERP, CRM & Core Systems Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy enterprise autonomous ERP AI agents for SAP S/4HANA, Oracle Fusion, and Tally Prime with sub-second two-phase commit verification.",
        answerCapsule: "Elesium's ERP AI architecture deploys deterministic multi-agent state machines that execute bi-directional, two-phase commit transactions across SAP S/4HANA, Oracle Fusion, and Tally Prime under SAP Clean Core guidelines, automating invoice reconciliation and multi-subsidiary consolidation with zero core ERP customization.",
        icon: "Database",
        regulatoryAuthority: "GSTIN, MCA & Companies Act 2013",
        complianceFramework: "Indian Companies Act 2013 Section 134(5)(e) Internal Financial Controls, GSTIN E-Invoicing API Gateway, e-Way Bill System, and MCA Statutory Audit Rules.",
        targetPersonas: "Chief Financial Officer, Head of Enterprise Applications, VP of IT, SAP/Oracle Practice Director",
        coreMetrics: [
            { label: "Invoice Processing", value: "< 650ms", desc: "Three-way PO/GRN matching and posting" },
            { label: "Reconciliation SLA", value: "Zero Discrepancies", desc: "Deterministic two-phase commit rollback" },
            { label: "Core Customization", value: "0% Code Intrusion", desc: "Strict SAP Clean Core & BTP extension model" },
            { label: "Monthly Close Cycle", value: "From 5 Days to 4h", desc: "Autonomous inter-company eliminations" }
        ],
        architectureDeepDive: [
            "Enterprise Resource Planning systems are the operational backbone of modern commerce, yet enterprise finance teams spend thousands of hours manually copying data across invoices, shipping receipts, and transaction screens.",
            "Elesium engineers deterministic multi-agent state machines communicating via certified REST/OData APIs, BAPIs, and XML-RPC gateways under strict SAP Clean Core principles with zero custom modifications to core tables.",
            "Invoices arriving via email or EDI are parsed into strict Pydantic schemas, three-way matched against PO and GRN data, and posted directly using atomic two-phase commit protocols that guarantee absolute financial ledger integrity."
        ],
        capabilities: [
            { title: "Autonomous Accounts Payable Automation", desc: "End-to-end receipt, validation, three-way PO matching, and direct ERP posting of vendor invoices with automated GSTIN verification." },
            { title: "Multi-Entity Financial Consolidation", desc: "Automated intercompany transaction matching, foreign currency translation, and elimination entries for rapid month-end closing." },
            { title: "Tally Prime to S/4HANA Migration & Sync", desc: "Bi-directional ledger synchronization between regional Tally Prime instances and corporate SAP S/4HANA instances." },
            { title: "Inventory Reorder & Procurement Optimization", desc: "Autonomous purchase requisition creation based on dynamic lead times, minimum order quantities (MOQ), and production schedules." }
        ],
        faqs: [
            { q: "How does Elesium adhere to SAP Clean Core architecture guidelines?", a: "We build all extensions on external private VPCs communicating via standard SAP BTP APIs, OData services, and RFCs, leaving your S/4HANA core completely unmodified for seamless future cloud upgrades." },
            { q: "Can the agents reconcile regional Indian GST inputs with GSTR-2B automatically?", a: "Yes. Our agents fetch live GSTR-2B data from the GST portal, perform invoice-level reconciliation against your purchase registers, and flag input tax credit mismatches in real time." },
            { q: "How do you handle transactional failures or network timeouts during ERP posting?", a: "All financial operations execute under a strict two-phase commit protocol with idempotent transaction tokens, ensuring clean rollbacks without duplicate entries." },
            { q: "Is Tally Prime XML-RPC communication secure and auditable?", a: "Yes. We wrap Tally's local XML-RPC interface in an encrypted, authenticated mutual-TLS gateway that logs every ledger write with an immutable cryptographic timestamp." },
            { q: "What is the typical payback period for an enterprise ERP automation project?", a: "Enterprise clients typically achieve 100% payback within 60 to 90 days through the elimination of late payment penalties and reduced manual accounting overhead." }
        ]
    },
    cybersecurity: {
        id: "cybersecurity",
        name: "Enterprise Cybersecurity & Cloud Infrastructure",
        h1: "Autonomous Zero-Trust Enclave Verification, Hardware Security Module (HSM) State Machines & High-Performance Inference",
        title: "Enterprise Cybersecurity, Zero-Trust & Cloud Infrastructure AI Solutions | Elesium",
        metaDescription: "Deploy enterprise cybersecurity and high-performance AI inference with CERT-In 6-hour compliance, AWS Nitro Enclave isolation, and sub-200ms vLLM orchestration.",
        answerCapsule: "Elesium's cybersecurity and infrastructure AI architecture deploys air-gapped zero-trust enclaves, automated CERT-In 6-hour incident response state machines, and high-performance vLLM inference orchestration with cryptographic TPM 2.0 attestation under strict ISO/IEC 27001:2022 standards.",
        icon: "Lock",
        regulatoryAuthority: "CERT-In, MeitY & ISO/IEC 27001",
        complianceFramework: "CERT-In Mandatory 6-Hour Cyber Incident Reporting Directions, MeitY Cloud Empanelment Guidelines, ISO/IEC 27001:2022 Information Security, and NIST SP 800-207 Zero Trust Architecture.",
        targetPersonas: "Chief Information Security Officer (CISO), VP of Cloud Infrastructure, Head of SecOps, Principal AI Systems Architect",
        coreMetrics: [
            { label: "Incident Triage Time", value: "< 12 Seconds", desc: "Automated log correlation & anomaly detection" },
            { label: "Inference Latency", value: "< 180ms TTFT", desc: "vLLM PagedAttention on NVIDIA H100 clusters" },
            { label: "CERT-In Compliance", value: "100% Automated", desc: "Deterministic 6-hour report compilation" },
            { label: "Enclave Isolation", value: "Nitro & AMD SEV", desc: "Cryptographic hardware memory encryption" }
        ],
        architectureDeepDive: [
            "As enterprise organizations deploy mission-critical multi-agent systems, traditional perimeter firewalls are completely inadequate against supply-chain prompt injection, memory drift, token exfiltration, and lateral privilege escalation.",
            "Elesium engineers sovereign, air-gapped cybersecurity and cloud orchestration infrastructure. All sensitive model weights and agent state memory execute inside hardware-isolated confidential computing enclaves (AWS Nitro Enclaves, AMD SEV-SNP).",
            "Our automated SecOps Agent continuously correlates tens of millions of endpoint telemetry events and VPC flow logs across SIEM platforms, quarantining compromised nodes in sub-12 seconds and generating statutory CERT-In disclosure annexures automatically."
        ],
        capabilities: [
            { title: "Automated CERT-In 6-Hour Incident Reporting", desc: "Continuous log correlation that identifies breach indicators, quarantines compromised nodes, and auto-generates statutory reports." },
            { title: "Confidential Computing & Enclave Isolation", desc: "Deploys multi-agent workloads inside hardware-encrypted memory enclaves with zero hypervisor or host OS inspection capability." },
            { title: "High-Throughput Sovereign vLLM Inference", desc: "Optimized PagedAttention inference orchestration on dedicated GPU clusters delivering sub-180ms Time-To-First-Token." },
            { title: "Automated Prompt Firewall & Data Leakage Shield", desc: "Real-time inspection of inbound prompts and outbound agent responses to prevent prompt injection and proprietary IP exfiltration." }
        ],
        faqs: [
            { q: "How does Elesium guarantee compliance with CERT-In's 6-hour reporting mandate?", a: "Our SecOps state machine correlates SIEM events in real time, automatically compiling the required CERT-In notification annexure with IP addresses, timestamps, and attack vectors in under 15 minutes." },
            { q: "What is Confidential Computing and how does it protect our proprietary AI weights?", a: "Confidential Computing encrypts data in-use inside CPU/GPU hardware enclaves. Even a cloud provider administrator with root access cannot inspect memory contents." },
            { q: "Can your inference stack serve open-weight foundation models like DeepSeek-R1 and Llama-3?", a: "Yes. We maintain optimized vLLM and TensorRT-LLM runtimes with FP8 GEMM microscaling kernels specifically tuned for DeepSeek-R1, Llama-3, and Mistral models." },
            { q: "How do your prompt firewalls prevent prompt injection and jailbreak attacks?", a: "We implement multi-stage semantic vector guardrails and heuristic token filters that evaluate prompt intent before passing tokens to downstream reasoning agents, dropping malicious injections instantly." },
            { q: "What is the deployment SLA for a sovereign private cloud AI enclave?", a: "A fully functional, air-gapped private VPC inference cluster with automated SecOps monitoring is deployed and validated within 14 business days, backed by a 90-day contractual ROI guarantee." }
        ]
    },
    pharma: {
        id: "pharma",
        name: "Pharma & Life Sciences",
        h1: "Deterministic Batch Record Audit, Formulation Stability Telemetry & Regulatory Submission Agents",
        title: "Pharma, Life Sciences & Biotech Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy US FDA 21 CFR Part 11 and CDSCO compliant pharmaceutical AI for batch record review, chromatography verification, and eCTD submission. Learn more.",
        answerCapsule: "Elesium's pharmaceutical AI architecture automates electronic batch manufacturing record (eBMR) reviews, HPLC/GC-MS chromatography data integrity audits, and eCTD regulatory dossier compilation under strict US FDA 21 CFR Part 11, CDSCO, and ALCOA+ data integrity standards.",
        icon: "Activity",
        regulatoryAuthority: "US FDA, CDSCO, WHO & ALCOA+",
        complianceFramework: "US FDA 21 CFR Part 11 Electronic Records & Signatures, CDSCO Good Clinical Practice (GCP), ALCOA+ Data Integrity Principles, and WHO GMP Annex 4 Guidelines.",
        targetPersonas: "Head of Quality Assurance (QA), VP of Regulatory Affairs, Chief Scientific Officer, Plant Quality Head",
        coreMetrics: [
            { label: "eBMR Review Cycle", value: "- 72%", desc: "Automated 1,000+ page batch record audit" },
            { label: "Data Integrity Score", value: "100% ALCOA+", desc: "Cryptographic audit trail verification" },
            { label: "Chromatography Audit", value: "< 120ms", desc: "Peak integration baseline tamper detection" },
            { label: "eCTD Assembly", value: "Sub-48 Hours", desc: "Automated Module 3/4/5 dossier compilation" }
        ],
        architectureDeepDive: [
            "In pharmaceutical manufacturing, a single batch record discrepancy or chromatography audit trail gap can trigger an FDA Form 483 warning letter, product recalls, or import alerts that cost hundreds of millions of dollars. Elesium deploys deterministic multi-agent auditing pipelines engineered specifically to enforce ALCOA+ (Attributable, Legible, Contemporaneous, Original, Accurate) data integrity standards across all manufacturing and laboratory systems.",
            "Our Batch Record Review Agent ingests complex Electronic Batch Manufacturing Records (eBMR) spanning 500 to 2,000 pages of scanned weigh-dispense receipts, autoclave charts, in-process testing logs, and analytical certificates. The agent cross-checks every temperature excursion, hold-time limit, and sign-off sequence against master manufacturing formulas in sub-3 minutes, highlighting deviations for QA review.",
            "In quality control laboratories, our Chromatography Audit Agent continuously analyzes raw audit logs from Empower, Chromeleon, and ChemStation CDS systems. It detects manual peak integration anomalies, orphaned sample injections, and unauthorized baseline manipulations, ensuring full statutory compliance with US FDA 21 CFR Part 11 electronic records mandates."
        ],
        capabilities: [
            { title: "Automated eBMR Batch Record Review", desc: "Rapid audit of manufacturing batch logs against approved master formulas, flagging temperature excursions and missing operator sign-offs." },
            { title: "Chromatography Data System (CDS) Audit", desc: "Automated surveillance of HPLC and GC audit logs to identify manual integration abuses and unapproved test injections." },
            { title: "eCTD Regulatory Submission Assembly", desc: "Synthesizes raw clinical trial reports and CMC stability data into formatted Module 3 Quality dossiers ready for submission." },
            { title: "Pharmacovigilance Adverse Event Triage", desc: "Multi-lingual extraction and MedDRA coding of spontaneous adverse drug reaction (ADR) reports from medical literature and clinical hotlines." }
        ],
        faqs: [
            { q: "How does Elesium comply with US FDA 21 CFR Part 11 electronic records regulations?", a: "Every audit event, user interaction, and automated review generates an immutable, cryptographically hashed audit trail containing timestamp, user identity, reason for change, and system fingerprint." },
            { q: "Can the agents interface with our Waters Empower 3 or Thermo Chromeleon CDS?", a: "Yes. We ingest raw CDS database audit logs via non-invasive read-only ODBC connectors and automated export daemons without altering underlying chromatography files." },
            { q: "What happens when an automated batch audit identifies a critical quality deviation?", a: "The system automatically pauses batch release progression in the LIMS/MES, creates a formal deviation ticket with all relevant sensor traces, and notifies QA directors immediately." },
            { q: "How does the system ensure zero hallucinations when compiling regulatory filings?", a: "All extracted numerical values in regulatory dossiers must carry a deterministic pointer to their original laboratory raw data source document with strict arithmetic cross-verification." },
            { q: "What is the typical time savings for a commercial pharmaceutical QA department?", a: "Commercial manufacturing plants typically reduce their batch record review cycle from 7 to 10 calendar days down to under 24 hours, releasing inventory to market significantly faster." }
        ]
    },
    telecom: {
        id: "telecom",
        name: "Telecom & Infrastructure",
        h1: "Autonomous 5G Network Slicing, RAN Energy Optimization & Optical Fault Localization",
        title: "Telecom Infrastructure & 5G Core Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy sovereign telecom AI for 5G network slicing, Open RAN energy throttling, and optical fault isolation under DoT and TRAI regulations. Read technical specs.",
        answerCapsule: "Elesium's telecom AI architecture executes sub-10ms control loops for autonomous 5G network slicing, Open RAN radio unit energy throttling, and optical time-domain reflectometry (OTDR) fault localization under strict DoT Trusted Telecom Portal and TRAI quality-of-service mandates.",
        icon: "Network",
        regulatoryAuthority: "DoT, TRAI & Trusted Telecom Portal",
        complianceFramework: "Department of Telecommunications (DoT) Trusted Telecom Portal (TTP) Mandate, TRAI Quality of Service (QoS) Regulations, and Indian Telegraph Right of Way Rules.",
        targetPersonas: "Chief Technology Officer, VP of Network Operations, Head of 5G Engineering, Optical Network Director",
        coreMetrics: [
            { label: "Control Loop Latency", value: "< 10ms", desc: "O-RAN Near-RT RIC xApp execution" },
            { label: "Tower Energy Reduction", value: "18.4%", desc: "Autonomous radio frequency micro-sleeps" },
            { label: "Fiber Fault Location", value: "< 50m Precision", desc: "Sub-minute OTDR spectral trace analysis" },
            { label: "SLA Compliance", value: "99.999%", desc: "Carrier-grade five-nines availability" }
        ],
        architectureDeepDive: [
            "With the rollout of commercial 5G Standalone (SA) networks and massive densification of cellular base stations, telecommunications service providers face soaring electricity bills, complex multi-vendor Open RAN deployments, and strict TRAI quality-of-service requirements. Manual network operations centers (NOCs) cannot keep pace with dynamic micro-slice provisioning and millisecond packet drops.",
            "Elesium develops carrier-grade, containerized xApps and rApps that run on Open RAN Near-Real-Time and Non-Real-Time RAN Intelligent Controllers (Near-RT RIC / Non-RT RIC). Operating over standardized O-RAN E2 and A1 interfaces, our agents dynamically adjust antenna beamforming weights, carrier aggregation matrices, and power amplifier states in sub-10ms cycles.",
            "During off-peak traffic periods, our Radio Unit Energy Agent triggers micro-sleep modes on idle power amplifiers, slashing base station electricity consumption by up to 18.4% without degrading coverage. In fiber backhaul networks, our Optical Fault Agent ingests high-frequency OTDR trace data, isolating cable cuts and macro-bending losses with sub-50-meter geographic precision to dispatch field restoration crews immediately."
        ],
        capabilities: [
            { title: "Autonomous 5G Dynamic Network Slicing", desc: "Real-time resource allocation and QoS guarantee for mission-critical enterprise URLLC and eMBB network slices." },
            { title: "Open RAN Power Amplifier Energy Throttling", desc: "Micro-second sleep scheduling of cellular radio units based on predictive cell-level traffic volume forecasts." },
            { title: "Optical Fiber Fault Localization", desc: "Instantaneous analysis of OTDR backscatter traces, pinpointing fiber breaks to within 50 meters on GIS maps." },
            { title: "Predictive Cell Tower Maintenance", desc: "Telemetry analysis of tower battery backups, diesel generators, and RF VSWR ratios to prevent site outages." }
        ],
        faqs: [
            { q: "How does Elesium comply with India's Trusted Telecom Portal (TTP) guidelines?", a: "All software binaries are compiled from verified source code within sovereign Indian infrastructure, carrying cryptographic provenance certificates that meet all National Security Directive on Telecommunication requirements." },
            { q: "Can the agents interface with legacy 4G LTE EPC and 5G Standalone core networks simultaneously?", a: "Yes. Our architecture supports hybrid 3GPP Release 15/16/17 standards, interfacing with both 4G Diameter interfaces and 5G Service-Based Architecture (SBA) HTTP/2 REST APIs." },
            { q: "What is the computational overhead of deploying your xApps on a Near-RT RIC?", a: "Our xApps are compiled in optimized C++ and Rust runtimes, consuming less than 2% CPU overhead and executing complete inference cycles in under 8 milliseconds." },
            { q: "How does the system prevent network oscillation during dynamic slicing changes?", a: "State transitions incorporate hysteresis dampeners and deterministic rate-of-change throttles that prevent ping-pong resource reallocations across competing enterprise slices." },
            { q: "What protocols are used for optical fiber network monitoring?", a: "We interface with DWDM and GPON optical transport equipment via standard telemetry streams including gNMI, NETCONF, and SNMP v3." }
        ]
    },
    legal: {
        id: "legal",
        name: "Legal & Real Estate Tech",
        h1: "Autonomous DPDP Consent Verification, Title Deed Verification & Contract Review Agents",
        title: "LegalTech, Real Estate Tech & Statutory Governance AI Solutions | Elesium",
        metaDescription: "Deploy enterprise LegalTech AI for DPDP Act 2023 compliance, title deed encumbrance verification, and contract redlining. Explore sovereign legal architecture.",
        answerCapsule: "Elesium's legal AI architecture deploys air-gapped deterministic state machines that verify statutory consent workflows under DPDP Act 2023, cross-check land title deeds across state registry databases, and execute multi-party contract redlining with strict zero external data retention.",
        icon: "Terminal",
        regulatoryAuthority: "DPDP Act 2023, BNS & RERA",
        complianceFramework: "Digital Personal Data Protection (DPDP) Act 2023, Bharatiya Nyaya Sanhita (BNS) Sections 61 & 63 on Electronic Records, Real Estate Regulatory Authority (RERA) Regulations, and Indian Contract Act 1872.",
        targetPersonas: "General Counsel, Chief Legal Officer, Head of Regulatory Compliance, Real Estate Legal Director",
        coreMetrics: [
            { label: "Contract Review Cycle", value: "- 78.5%", desc: "Automated redlining & clause risk scoring" },
            { label: "Title Deed Audit", value: "< 4 Minutes", desc: "30-year encumbrance registry verification" },
            { label: "DPDP Statutory Audit", value: "100% Compliant", desc: "Deterministic consent record ledger" },
            { label: "Data Confidentiality", value: "100% Air-Gapped", desc: "Zero external cloud LLM API transit" }
        ],
        architectureDeepDive: [
            "Corporate legal departments and enterprise real estate firms handle highly sensitive confidential agreements, litigation documents, and land acquisition records where public cloud AI platforms present severe attorney-client privilege and data confidentiality violations. Elesium deploys fully air-gapped legal reasoning engines that analyze complex contractual clauses without exposing corporate legal intellectual property to third-party model providers.",
            "Our Contract Review Agent executes hierarchical clause segmentation across master service agreements (MSAs), non-disclosure agreements (NDAs), and commercial leases. Each clause is evaluated against your firm's approved standard playbook, automatically flagging non-standard indemnification liabilities, governing law jurisdictions, and termination penalty caps with proposed inline redlines.",
            "In real estate tech, our Title Verification Agent ingests 30-year chains of scanned property title deeds, encumbrance certificates (EC), and municipal revenue mutation registers. The agent reconstructs the genealogical ownership tree, detects missing link documents, and verifies RERA registration numbers across state portal databases in under 4 minutes, preventing multi-crore land acquisition disputes."
        ],
        capabilities: [
            { title: "Automated Contract Redlining & Playbook Audit", desc: "Instantaneous clause-by-clause comparison of third-party contracts against internal risk playbooks, generating inline Word diffs." },
            { title: "Real Estate Title Deed Chain Verification", desc: "Reconstructs 30-year property title histories, checking encumbrance certificates and revenue records for ownership breaks." },
            { title: "DPDP Act 2023 Statutory Consent Audit", desc: "Verifies that enterprise digital customer onboarding flows strictly collect purpose-specific, revocable, bilingual statutory consents." },
            { title: "Regulatory Change Surveillance", desc: "Continuous monitoring of official gazette notifications, high court rulings, and regulatory circulars with automated corporate policy impact summaries." }
        ],
        faqs: [
            { q: "How does Elesium protect attorney-client privilege when processing legal documents?", a: "All models execute inside your private corporate cloud or on-premise hardware. Documents are parsed statelessly in memory with zero storage on external servers, preserving strict attorney-client privilege." },
            { q: "How does the platform ensure electronic evidence admissibility under the Bharatiya Nyaya Sanhita (BNS)?", a: "Every generated document extraction and audit receipt is cryptographically sealed with an SHA-256 hash and RFC 3161 digital timestamp in compliance with Sections 61 and 63 of the BNS 2023." },
            { q: "Can the system review non-English land documents (Kannada, Marathi, Tamil, Hindi)?", a: "Yes. Our OCR and legal extraction pipeline is trained on regional state land registry scripts, accurately transcribing vernacular sale deeds and Pahani/7/12 land extract records." },
            { q: "How does the Contract Review Agent handle novel or highly customized clauses?", a: "When a clause deviates significantly from standard playbook parameters, the state machine assigns a high ambiguity risk score and routes the clause directly to senior counsel with contextual reference precedents." },
            { q: "What is the typical deployment timeline for a corporate legal department?", a: "We ingest your legal playbook and deploy a working contract review agent within 14 business days, backed by a 90-day contractual ROI guarantee." }
        ]
    },
    govtech: {
        id: "govtech",
        name: "GovTech & Sovereign Defense",
        h1: "Air-Gapped Tactical C4ISR, Defense Procurement Automation & Sovereign Data Enclaves",
        title: "GovTech & Sovereign Defense AI Solutions | Elesium",
        metaDescription: "Deploy 100% air-gapped sovereign defense AI under DAP 2020 and CERT-In directions for C4ISR telemetry and defense procurement. Read technical architecture.",
        answerCapsule: "Elesium's sovereign defense AI architecture deploys 100% air-gapped, TPM 2.0 cryptographically attested multi-agent systems for tactical C4ISR sensor fusion, defense procurement lifecycle automation under DAP 2020, and national security data enclaves with zero external internet connectivity.",
        icon: "Shield",
        regulatoryAuthority: "MoD, DAP 2020 & CERT-In",
        complianceFramework: "Defense Acquisition Procedure (DAP 2020) Make in India / Atmanirbhar Bharat Mandate, CERT-In Cyber Security Directions, and National Security Data Governance Standards.",
        targetPersonas: "Defense Technology Director, Command Systems Lead, Procurement General Manager, Sovereign Cloud Architect",
        coreMetrics: [
            { label: "Air-Gap Level", value: "100% Air-Gapped", desc: "Hardware diode isolation with zero WAN egress" },
            { label: "Sensor Fusion Latency", value: "< 40ms", desc: "Multi-spectral radar & electro-optical triage" },
            { label: "Hardware Attestation", value: "TPM 2.0 / Nitro", desc: "Cryptographic boot & runtime state validation" },
            { label: "DAP 2020 Compliance", value: "Full Indigenization", desc: "100% Indian IP & local model hosting" }
        ],
        architectureDeepDive: [
            "National security, sovereign defense, and public sector governance applications operate in strict zero-trust, high-threat environments where foreign cloud dependencies, unverified supply chain code, and wireless data leakage are intolerable national vulnerabilities. Elesium engineers 100% indigenized, air-gapped multi-agent architectures that execute entirely on sovereign Indian infrastructure in strict compliance with the Defense Acquisition Procedure (DAP 2020) and CERT-In directives.",
            "Our tactical C4ISR (Command, Control, Communications, Computers, Intelligence, Surveillance, and Reconnaissance) fusion architecture ingests telemetry from synthetic aperture radar (SAR), electro-optical/infrared (EO/IR) turrets, and electronic support measures (ESM) pods. Edge-quantized neural networks fuse disparate sensor feeds into a unified common operational picture (COP) with sub-40ms latency.",
            "In defense procurement and public sector logistics, our DAP 2020 Procurement Agent automates technical bid evaluations, Make-in-India indigenous content audits, and vendor compliance matrices across the Government e-Marketplace (GeM) and defense portal systems, eliminating administrative bottlenecks and ensuring transparent public expenditure governance."
        ],
        capabilities: [
            { title: "Air-Gapped Multi-Sensor Tactical Fusion", desc: "Sub-40ms correlation of radar, electro-optical video, and acoustic sensor streams into a unified tactical common operational picture." },
            { title: "DAP 2020 Defense Procurement Compliance", desc: "Automated technical evaluation of multi-thousand-page RFP tenders, verifying indigenous content percentages and compliance matrices." },
            { title: "Sovereign Document Intelligence & Redaction", desc: "Automated classification and cryptographic redaction of classified operational orders and national defense archives." },
            { title: "Border & Critical Infrastructure Perimeter Surveillance", desc: "Edge-deployed acoustic and thermal anomaly detection models triggering automated pan-tilt-zoom (PTZ) camera verification." }
        ],
        faqs: [
            { q: "How does Elesium guarantee complete air-gapped security for defense deployments?", a: "Our systems operate on bare-metal hardware with physical network diodes, disabled wireless chips, and hardware security modules (HSM) that verify cryptographic boot states. Zero internet connections exist." },
            { q: "Does the system qualify under the Make in India and DAP 2020 indigenization mandates?", a: "Yes. 100% of our model architectures, state machine code, and orchestration logic are designed and maintained in India, fulfilling all IDDM (Indigenously Designed, Developed and Manufactured) criteria." },
            { q: "Can the agents interface with tactical military radios and MIL-STD databuses?", a: "Yes. We support MIL-STD-1553, STANAG 4586, and tactical VHF/UHF tactical radio IP networks for low-bandwidth, high-reliability command propagation." },
            { q: "How are software updates and security patches delivered to air-gapped facilities?", a: "Updates are delivered via cryptographically signed offline physical media with multi-party threshold signature verification before kernel installation." },
            { q: "What is the computational footprint required for tactical edge deployment?", a: "Our tactical edge modules are optimized to run on ruggedized conduction-cooled military mission computers equipped with NVIDIA Jetson AGX Orin or compact workstation GPUs." }
        ]
    },
    aerospace: {
        id: "aerospace",
        name: "Aerospace & Avionics",
        h1: "Autonomous Telemetry Analysis, Satellite Flight Dynamics & Scramjet Thermal Monitoring",
        title: "Aerospace, Avionics & Space Systems AI Solutions | Elesium",
        metaDescription: "Deploy mission-critical aerospace AI for satellite constellation telemetry, avionics health, and propulsion monitoring under DGCA and ISRO standards. Read architecture.",
        answerCapsule: "Elesium's aerospace AI architecture processes high-throughput telemetry streams from satellite constellations, commercial avionics, and hypersonic propulsion testbeds, executing sub-5ms anomaly detection and orbital trajectory corrections under AS9100D and RTCA DO-178C guidelines.",
        icon: "Plane",
        regulatoryAuthority: "DGCA, ISRO, IN-SPACe & AS9100D",
        complianceFramework: "AS9100D Aerospace Quality Management System, RTCA DO-178C Software Considerations in Airborne Systems, DGCA Civil Aviation Requirements (CAR), and ISRO/IN-SPACe Space Activity Standards.",
        targetPersonas: "VP of Avionics Engineering, Chief Satellite Systems Architect, Flight Operations Director, Aerospace Propulsion Lead",
        coreMetrics: [
            { label: "Telemetry Decommutation", value: "< 5ms", desc: "Real-time CCSDS frame telemetry analysis" },
            { label: "Orbital Conjunction Alert", value: "< 120s", desc: "Automated collision risk assessment" },
            { label: "Quality Standard", value: "AS9100D / DO-178C", desc: "Aerospace mission-critical verification" },
            { label: "Thermal Drift Detection", value: "0.01 deg C Precision", desc: "Hypersonic leading edge sensor models" }
        ],
        architectureDeepDive: [
            "Commercial aerospace fleets, satellite constellation operators, and hypersonic flight test programs generate millions of multi-channel telemetry data points per second. In orbital flight operations or supersonic atmospheric transit, delayed anomaly detection results in loss of mission control, catastrophic structural disintegration, or uncontrolled orbital decay.",
            "Elesium builds ultra-low-latency aerospace telemetry processing agents that adhere to Consultative Committee for Space Data Systems (CCSDS) packet standards. Deployed on high-throughput ground stations or edge-hardened flight controllers, our agents decommutate and validate thousands of analog and digital flight channels in sub-5ms cycles.",
            "Our Satellite Flight Dynamics Agent continuously ingests two-line element (TLE) orbital sets, GNSS receiver positions, and solar flux data, predicting orbital conjunction risks and atmospheric drag decay curves. When collision probabilities exceed designated thresholds, the agent automatically models deterministic propulsion burns, optimizing delta-V fuel budgets while maintaining satellite constellation coverage geometry."
        ],
        capabilities: [
            { title: "Real-Time Satellite Constellation Telemetry Triage", desc: "Sub-5ms decommutation and anomaly classification across thousands of telemetry channels from LEO/GEO satellite platforms." },
            { title: "Autonomous Orbital Conjunction Assessment", desc: "Rapid evaluation of space debris orbital trajectories with automated delta-V avoidance maneuver calculation." },
            { title: "Aero-Engine & Hypersonic Thermal Monitoring", desc: "High-temperature sensor drift and heat-flux modeling for turbofan engines, scramjet combustors, and thermal protection systems." },
            { title: "Avionics Bus Health Diagnostics", desc: "Continuous electrical waveform analysis on ARINC 429, MIL-STD-1553, and AFDX avionics buses to predict wiring degradation." }
        ],
        faqs: [
            { q: "Can Elesium software be certified under RTCA DO-178C for airborne flight systems?", a: "Our core algorithms are designed with deterministic state boundaries, exhaustive test suites, and structural coverage artifacts that facilitate Level C and Level B DO-178C certification pathways." },
            { q: "How does the platform handle telemetry packet dropouts during ground station passes?", a: "Our telemetry ingest engine implements robust sliding-window packet reassembly and predictive spline interpolation to maintain continuous state tracking through RF fade intervals." },
            { q: "Is the system compatible with private Indian space startups operating under IN-SPACe?", a: "Yes. We work closely with commercial space entities in India, offering pre-configured telemetry pipelines for launch vehicle staging and smallsat operations." },
            { q: "What machine learning architectures are used for hypersonic propulsion monitoring?", a: "We deploy physics-informed neural networks (PINNs) that enforce thermodynamic energy conservation laws, preventing unphysical predictions during extreme atmospheric flight regimes." },
            { q: "What is the typical infrastructure footprint for a satellite ground station operations center?", a: "A high-availability dual-server rack equipped with enterprise NVMe storage and low-latency networking can monitor over 100 concurrent satellite telemetry streams simultaneously." }
        ]
    },
    energy: {
        id: "energy",
        name: "Renewable Energy & Power Grid",
        h1: "Autonomous Smart Grid Balancing, Clean Hydrogen Electrolyzer Telemetry & Fusion Diagnostics",
        title: "Renewable Energy & Power Grid Sovereign AI Solutions | Elesium",
        metaDescription: "Deploy sovereign energy AI for smart grid balancing, solar/wind ramp forecasting, and hydrogen electrolyzer optimization under CERC and CEA rules. Learn more.",
        answerCapsule: "Elesium's energy AI architecture executes sub-second power grid frequency balancing, physics-informed renewable ramp forecasting, and clean hydrogen electrolyzer telemetry optimization in strict compliance with the Indian Electricity Grid Code (IEGC 2023) and CEA cybersecurity regulations.",
        icon: "Zap",
        regulatoryAuthority: "CERC, CEA & National Green Hydrogen Mission",
        complianceFramework: "CERC Indian Electricity Grid Code (IEGC 2023), Central Electricity Authority (CEA) Cyber Security in Power Sector Guidelines, and National Green Hydrogen Mission Standards.",
        targetPersonas: "Chief Technology Officer, VP of Grid Operations, Renewable Asset Director, Hydrogen Systems Engineering Lead",
        coreMetrics: [
            { label: "Grid Balancing Latency", value: "< 250ms", desc: "Sub-second frequency deviation response" },
            { label: "Renewable Forecast Error", value: "< 3.8% NMAE", desc: "Ensemble physics-informed solar/wind ramp models" },
            { label: "Electrolyzer Efficiency", value: "+ 8.6%", desc: "Dynamic multi-cell thermal & current balancing" },
            { label: "Cybersecurity", value: "CEA Verified", desc: "Substation OT network air-gapped isolation" }
        ],
        architectureDeepDive: [
            "The rapid integration of variable renewable energy (solar PV, wind farms) into national power grids has introduced unprecedented frequency volatility, steep evening demand ramps, and severe grid stability challenges. State and national load dispatch centers (SLDCs and NLDCs) face stringent statutory deviation settlement penalties under the Central Electricity Regulatory Commission (CERC) Grid Code 2023.",
            "Elesium deploys deterministic grid orchestration agents that ingest high-frequency phasor measurement unit (PMU) telemetry sampled at 50/60 Hz across transmission substations. Our agents execute sub-250ms closed-loop state estimations, dynamically dispatching battery energy storage systems (BESS) and thermal peaker units to suppress frequency oscillations before safety relays trip.",
            "In clean hydrogen production, our Electrolyzer Optimization Agent monitors cell-level voltages, membrane resistance, and hydrogen-to-oxygen cross-permeation rates across multi-megawatt proton exchange membrane (PEM) stacks. By dynamically matching intermittent solar generation profiles to electrolyzer operating envelopes, the system extends stack lifetime while boosting green hydrogen yields by up to 8.6%."
        ],
        capabilities: [
            { title: "Sub-Second Grid Frequency & Inertia Balancing", desc: "Automated BESS and fast-response generation dispatch to counteract instantaneous solar and wind generation dropouts." },
            { title: "Physics-Informed Solar & Wind Ramp Forecasting", desc: "Combines satellite cloud-motion vectors and numerical weather prediction models to forecast multi-hour generation ramps with sub-4% NMAE." },
            { title: "Clean Hydrogen PEM Electrolyzer Optimization", desc: "Real-time thermal and current-density management across hydrogen stacks, maximizing efficiency and preventing membrane degradation." },
            { title: "Automated Power Purchase Agreement (PPA) Settlement", desc: "Instantaneous financial reconciliation of hourly meter readings, availability-based tariffs (ABT), and deviation settlement mechanism (DSM) bills." }
        ],
        faqs: [
            { q: "How does Elesium adhere to CEA Cyber Security in Power Sector Guidelines?", a: "Our software executes strictly within air-gapped utility operational technology (OT) zones behind certified IEC 60870-5-104 and DNP3 firewalls with zero direct WAN connections." },
            { q: "Can the agents interface with existing SCADA systems from ABB, GE, and Siemens?", a: "Yes. We maintain native connectors for major utility SCADA/EMS platforms via IEC 61850 MMS and GOOSE protocols with microsecond-level precision." },
            { q: "How does the system help renewable developers avoid CERC deviation penalties?", a: "By achieving sub-4% Normalized Mean Absolute Error (NMAE) on 15-minute time-block generation schedules, our agents keep energy feed-ins within safe statutory penalty-free bands." },
            { q: "What data is required to initialize a battery storage optimization model?", a: "We require baseline battery cell chemistry curves (NMC or LFP), inverter cycle efficiency ratings, and 30 days of substation historical load and tariff telemetry." },
            { q: "What is the expected ROI for a 100MW utility-scale solar-plus-storage installation?", a: "By optimizing peak price arbitrage and eliminating DSM penalties, utility-scale renewable operators typically recoup their software investment within 4 to 6 months." }
        ]
    },
    mining: {
        id: "mining",
        name: "Heavy Industrial & Mining",
        h1: "Autonomous Haulage Fleet Dispatch, Subsea Wellhead Telemetry & Geotechnical Rockfall Monitoring",
        title: "Heavy Industrial, Mining & Subsea AI Solutions | Elesium",
        metaDescription: "Deploy sovereign industrial AI for autonomous mining haulage, subsea wellhead control, and slope stability under DGMS and OISD safety rules. Read specs.",
        answerCapsule: "Elesium's heavy industrial and mining AI architecture executes deterministic haulage fleet dispatch, real-time slope stability radar telemetry, and subsea electro-hydraulic wellhead monitoring under strict DGMS and OISD-STD-137 safety regulations.",
        icon: "Pickaxe",
        regulatoryAuthority: "DGMS & OISD",
        complianceFramework: "Directorate General of Mines Safety (DGMS) Tele-Remote Guidelines, Coal Mines Regulations 2017, and Oil Industry Safety Directorate (OISD) Standard 137.",
        targetPersonas: "VP of Mining Operations, Chief Mining Engineer, Subsea Asset Director, Heavy Industrial Safety Officer",
        coreMetrics: [
            { label: "Fleet Utilization", value: "+ 22.4%", desc: "Dynamic pit-to-crusher haulage dispatch" },
            { label: "Slope Failure Alert", value: "> 4h Early Warning", desc: "Sub-millimeter radar displacement modeling" },
            { label: "Subsea Telemetry Latency", value: "< 150ms", desc: "Multiplex hydraulic control pod pressure monitoring" },
            { label: "Safety Compliance", value: "100% DGMS Certified", desc: "Zero fatal haul road collision record" }
        ],
        architectureDeepDive: [
            "Open-pit surface mines, deep underground coal seams, and offshore subsea drilling platforms are among the harshest operating environments on earth. Equipment breakdowns, haul truck traffic collisions, geotechnical bench collapses, and deepwater blowout preventer leaks result in catastrophic human casualties and hundreds of millions of dollars in downtime.",
            "Elesium engineers robust, industrial-hardened AI state machines that operate over private LTE/5G wireless mesh networks on heavy extraction sites. Our Autonomous Haulage Dispatch Agent optimizes the routing of 240-ton dump trucks between excavators, in-pit crushers, and waste dumps, balancing shovel queue times and crusher feed rates in sub-second cycles.",
            "For geotechnical safety, our Slope Stability Agent ingests continuous radar interferometry and borehole extensometer streams, detecting sub-millimeter bench movements and predicting catastrophic slope failures hours before rock displacement occurs. In subsea oil and gas engineering, our Wellhead Agent monitors multiplex electro-hydraulic control pod pressure decay curves, identifying seal erosion and valve drift before subsea intervention costs escalate."
        ],
        capabilities: [
            { title: "Autonomous Haulage Fleet Dispatch & Anti-Collision", desc: "Dynamic pit-to-crusher routing and radar-based perimeter safety for massive multi-vehicle mining fleets." },
            { title: "Geotechnical Radar Slope Stability Monitoring", desc: "Sub-millimeter rock displacement tracking and predictive bench collapse alerts for open-cast pit walls." },
            { title: "Subsea Wellhead Electro-Hydraulic Telemetry", desc: "Continuous surveillance of subsea control pod pressures, valve spool travel, and hydrate formation in deepwater flowlines." },
            { title: "Heavy Ore Crusher & SAG Mill Optimization", desc: "Vibration and motor power telemetry analysis to optimize rock feed rates and prevent SAG mill liner damage." }
        ],
        faqs: [
            { q: "How does the system operate in remote mining sites with zero public internet connectivity?", a: "All agents execute entirely on local, ruggedized server racks deployed in site dispatch offices, communicating with vehicles via private LTE, Wi-Fi mesh, or VHF radio data links." },
            { q: "How does Elesium comply with DGMS safety regulations for tele-remote equipment?", a: "Our anti-collision and vehicle dispatch agents maintain hard safety interlocks with redundant fail-safe heartbeat timers that immediately command vehicle emergency stops if telemetry links drop." },
            { q: "Can the software interface with fleet management systems from Caterpillar (MineStar) or Komatsu (Modular)?", a: "Yes. We interface with legacy fleet management systems through certified API gateways and direct database read-replicas without replacing existing on-board hardware." },
            { q: "What sensors are used for geotechnical slope monitoring?", a: "We ingest real-time data from ground-based synthetic aperture radar (GB-SAR), robotic total stations, piezometers, and borehole extensometers." },
            { q: "What is the expected production uplift from automated haulage optimization?", a: "Large open-pit operations typically see a 15% to 22% increase in effective truck-shovel utilization, translating to tens of thousands of additional tons moved per shift." }
        ]
    }
}

export default function SolutionCategoryHub() {
    const { categorySlug } = useParams<{ categorySlug: string }>()
    const { openWhatsApp, WhatsAppModal } = useWhatsApp()
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    // Lookup metadata or fallback to generic
    const silo = useMemo(() => {
        if (!categorySlug) return null
        return SILO_METADATA[categorySlug.toLowerCase()] || null
    }, [categorySlug])

    // Find category solutions from solutionCategories
    const matchedCategoryGroup = useMemo(() => {
        if (!categorySlug) return null
        return solutionCategories.find(c => c.id.toLowerCase() === categorySlug.toLowerCase()) || null
    }, [categorySlug])

    const solutionsList = useMemo(() => {
        return matchedCategoryGroup ? matchedCategoryGroup.solutions : []
    }, [matchedCategoryGroup])

    if (!silo && !matchedCategoryGroup) {
        return <Navigate to="/solutions/" replace />
    }

    const normalizedSlug = (categorySlug || '').toLowerCase()
    const displayName = silo?.name || matchedCategoryGroup?.name || "Industry AI Solutions"
    const displayH1 = silo?.h1 || matchedCategoryGroup?.description || `${displayName} Sovereign Automation`
    const displayTitle = silo?.title || `${displayName} Sovereign AI Solutions | Elesium`
    const displayDesc = silo?.metaDescription || `Deploy enterprise ${displayName} AI agents with sub-200ms latency, private VPC deployment, and DPDP Act 2023 compliance.`
    const canonicalUrl = `https://elesium.online/solutions/category/${normalizedSlug}/`

    const IconComponent = silo && iconMap[silo.icon] ? iconMap[silo.icon] : Factory

    // Structured Data: CollectionPage + ItemList + FAQPage
    const structuredData = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'CollectionPage',
                '@id': `${canonicalUrl}#collection`,
                'name': displayTitle,
                'description': displayDesc,
                'url': canonicalUrl,
                'isPartOf': { '@id': 'https://elesium.online/#website' },
                'about': { '@id': 'https://elesium.online/#organization' },
                'hasPart': solutionsList.slice(0, 25).map(sol => ({
                    '@type': 'Service',
                    'name': sol.h1,
                    'url': `https://elesium.online/solutions/${sol.slug}/`,
                    'description': sol.metaDescription,
                    'provider': { '@id': 'https://elesium.online/#organization' }
                }))
            },
            {
                '@type': 'ItemList',
                '@id': `${canonicalUrl}#itemlist`,
                'name': `${displayName} AI Architecture Catalog`,
                'itemListElement': solutionsList.slice(0, 25).map((sol, index) => ({
                    '@type': 'ListItem',
                    'position': index + 1,
                    'name': sol.h1,
                    'url': `https://elesium.online/solutions/${sol.slug}/`
                }))
            },
            {
                '@type': 'BreadcrumbList',
                '@id': `${canonicalUrl}#breadcrumb`,
                'itemListElement': [
                    { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://elesium.online/' },
                    { '@type': 'ListItem', 'position': 2, 'name': 'Solutions', 'item': 'https://elesium.online/solutions/' },
                    { '@type': 'ListItem', 'position': 3, 'name': displayName, 'item': canonicalUrl }
                ]
            },
            ...(silo?.faqs?.length ? [{
                '@type': 'FAQPage',
                '@id': `${canonicalUrl}#faq`,
                'isPartOf': { '@id': `${canonicalUrl}#collection` },
                'mainEntity': silo.faqs.map(f => ({
                    '@type': 'Question',
                    'name': f.q,
                    'acceptedAnswer': { '@type': 'Answer', 'text': f.a }
                }))
            }] : [])
        ]
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950 pt-24 pb-20">
            <Helmet>
                <title>{displayTitle}</title>
                <meta name="description" content={displayDesc} />
                <link rel="canonical" href={canonicalUrl} />
                <meta property="og:title" content={displayTitle} />
                <meta property="og:description" content={displayDesc} />
                <meta property="og:url" content={canonicalUrl} />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">
                    {JSON.stringify(structuredData)}
                </script>
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="mb-8">
                    <ol className="flex items-center space-x-2 text-xs font-mono text-slate-400">
                        <li>
                            <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
                        </li>
                        <li><ChevronRight className="w-3 h-3 text-slate-600" /></li>
                        <li>
                            <Link to="/solutions/" className="hover:text-emerald-400 transition-colors">Solutions</Link>
                        </li>
                        <li><ChevronRight className="w-3 h-3 text-slate-600" /></li>
                        <li className="text-emerald-400 font-semibold">{displayName}</li>
                    </ol>
                </nav>

                {/* Hero Header */}
                <header className="mb-14">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono mb-4">
                        <IconComponent className="w-3.5 h-3.5" />
                        <span>Thematic Silo Architecture • {displayName}</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                        {displayH1}
                    </h1>

                    {/* AEO Answer Capsule */}
                    {silo?.answerCapsule && (
                        <div className="bg-emerald-950/40 border-l-4 border-emerald-500 p-5 rounded-r-xl border border-emerald-500/20 mb-8 max-w-4xl">
                            <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Architectural Answer Capsule • Executive Summary</span>
                            </div>
                            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                                {silo.answerCapsule}
                            </p>
                        </div>
                    )}

                    {/* Primary CTA */}
                    <div className="flex flex-wrap items-center gap-4">
                        <button
                            onClick={() => openWhatsApp()}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <span>Schedule Technical Architecture Audit</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <Link
                            to="/solutions/"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-slate-300 text-sm font-semibold transition-all"
                        >
                            <span>View All 13 Industry Silos</span>
                        </Link>
                    </div>
                </header>

                {/* Core Metrics Grid */}
                {silo?.coreMetrics && (
                    <section className="mb-14">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {silo.coreMetrics.map((m, idx) => (
                                <div key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 text-center">
                                    <div className="text-xs font-mono uppercase text-emerald-400 font-semibold mb-1">{m.label}</div>
                                    <div className="text-2xl sm:text-3xl font-black text-white">{m.value}</div>
                                    <div className="text-xs text-slate-400 mt-1">{m.desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Statutory Regulatory Framework Card */}
                {silo?.regulatoryAuthority && (
                    <section className="mb-14 bg-gradient-to-r from-slate-900/90 to-slate-900/50 border border-slate-800 rounded-2xl p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-4">
                            <Scale className="w-6 h-6 text-emerald-400" />
                            <h2 className="text-xl sm:text-2xl font-bold text-white">Statutory &amp; Regulatory Compliance Matrix</h2>
                        </div>
                        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                            <strong className="text-emerald-400">Governing Authorities:</strong> {silo.regulatoryAuthority}
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            {silo.complianceFramework}
                        </p>
                        <div className="grid sm:grid-cols-3 gap-3 text-xs font-mono">
                            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-slate-300">
                                <span className="text-emerald-400 font-bold block mb-0.5">DPDP Act 2023 Sec 8(5)</span>
                                Automatic statutory data erasure upon workflow execution completion.
                            </div>
                            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-slate-300">
                                <span className="text-emerald-400 font-bold block mb-0.5">Sovereign Data Residency</span>
                                Tier-IV Indian datacenters (CtrlS, Yotta Shakti) with zero foreign telemetry.
                            </div>
                            <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-lg text-slate-300">
                                <span className="text-emerald-400 font-bold block mb-0.5">Cryptographic Hashing</span>
                                SHA-256 state ledger verification for statutory explainability audits.
                            </div>
                        </div>
                    </section>
                )}

                {/* Architecture Deep Dive */}
                {silo?.architectureDeepDive && (
                    <section className="mb-14">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Cpu className="w-5 h-5 text-emerald-400" />
                            <span>Deterministic Multi-Agent Architecture</span>
                        </h2>
                        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                            {silo.architectureDeepDive.map((para, idx) => (
                                <p key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5">
                                    {para}
                                </p>
                            ))}
                        </div>
                    </section>
                )}

                {/* Key Technical Capabilities */}
                {silo?.capabilities && (
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Enterprise Production Capabilities
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {silo.capabilities.map((cap, idx) => (
                                <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/40 transition-colors">
                                    <div className="flex items-center gap-2 font-bold text-white text-base mb-2">
                                        <FileCheck2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                        <span>{cap.title}</span>
                                    </div>
                                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                                        {cap.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Complete Solution Catalog in this Silo */}
                <section className="mb-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                                {displayName} Production Architectures
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                Showing {solutionsList.length} verified production-ready sovereign AI solutions in this thematic cluster.
                            </p>
                        </div>
                    </div>

                    {solutionsList.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {solutionsList.map((sol) => (
                                <Link
                                    key={sol.slug}
                                    to={`/solutions/${sol.slug}/`}
                                    className="group bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between transition-all duration-200"
                                >
                                    <div>
                                        <div className="text-[10px] font-mono uppercase text-emerald-400 tracking-wider mb-2 font-semibold">
                                            {sol.hubCategory || displayName}
                                        </div>
                                        <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors leading-snug mb-3 line-clamp-2">
                                            {sol.h1}
                                        </h3>
                                        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-4">
                                            {sol.metaDescription}
                                        </p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-500 group-hover:text-emerald-400">
                                        <span>Explore Architecture</span>
                                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
                            <h3 className="text-lg font-bold text-white mb-2">
                                Custom Sovereign {displayName} Architectures Available
                            </h3>
                            <p className="text-sm text-slate-400 max-w-2xl mx-auto mb-6 leading-relaxed">
                                Production workflows in this sector are provisioned via dedicated private VPC sprints tailored to your ERP, SCADA, or regulatory enclave topology. Explore our cross-industry flagship catalog or schedule an architecture audit directly.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-3">
                                <Link
                                    to="/solutions/"
                                    className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-semibold transition-colors"
                                >
                                    Browse Flagship Solutions &rarr;
                                </Link>
                                <Link
                                    to="/commercial-directory.html"
                                    className="px-5 py-2.5 rounded-lg border border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold transition-colors"
                                >
                                    Top 100 Commercial Directory &rarr;
                                </Link>
                            </div>
                        </div>
                    )}
                </section>

                {/* Frequently Asked Questions */}
                {silo?.faqs && (
                    <section className="mb-16">
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                            {silo.faqs.map((faq, idx) => (
                                <div
                                    key={idx}
                                    className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-colors"
                                >
                                    <button
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-200 hover:text-white"
                                    >
                                        <span className="text-sm sm:text-base">{faq.q}</span>
                                        <ChevronDown className={`w-4 h-4 text-emerald-400 transform transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Free Architecture Audit CTA */}
                <section className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center sm:text-left sm:flex items-center justify-between gap-8">
                    <div className="max-w-2xl mb-6 sm:mb-0">
                        <h2 className="text-2xl font-extrabold text-white mb-2">
                            Deploy a Scoped {displayName} Pilot in 14 Days
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                            Book a 30-minute sovereign architecture review with Principal AI Systems Architect Chaman Shah. We assess your legacy ERP/TMS interfaces, data residency requirements, and model your contractual 90-day cash-flow ROI.
                        </p>
                    </div>
                    <button
                        onClick={() => openWhatsApp()}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <span>Schedule Free Technical Audit</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </section>
            </div>

            <WhatsAppModal />
        </div>
    )
}
