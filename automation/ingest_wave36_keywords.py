#!/usr/bin/env python3
"""
Ingests Wave 36 commercial keywords (IDs 1,641 to 1,690, 50 solutions)
into automation/compact_keywords_queue.json.
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE36 = [
    # Cluster 1: Bangalore Tech Corridor Enterprise Process Automation Telemetry (IDs 1641-1657, 17 items)
    {
        "id": 1641,
        "keyword": "electronic city edge iot scada and sap erp synchronization telemetry for manufacturing enterprises",
        "slug": "electronic-city-edge-iot-scada-and-sap-erp-synchronization-telemetry-for-manufacturing-enterprises",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Edge AI",
        "target_persona": "Industrial Plant Directors & Enterprise Manufacturing CTOs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bangalore SCADA ERP Architecture Audit"
    },
    {
        "id": 1642,
        "keyword": "outer ring road gcc cross-border vendor clearing and swift message reconciliation telemetry",
        "slug": "outer-ring-road-gcc-cross-border-vendor-clearing-and-swift-message-reconciliation-telemetry",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Global Capability Center Directors & Enterprise Treasury VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GCC Treasury Automation Audit"
    },
    {
        "id": 1643,
        "keyword": "whitefield aerospace and medical device multilingual document ingestion telemetry for regulatory compliance",
        "slug": "whitefield-aerospace-and-medical-device-multilingual-document-ingestion-telemetry-for-regulatory-compliance",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Regulatory Affairs Directors & Medical Device Quality VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Medical Device Compliance Audit"
    },
    {
        "id": 1644,
        "keyword": "langgraph cyclical state machine exception recovery and circuit breaker telemetry for enterprise operations",
        "slug": "langgraph-cyclical-state-machine-exception-recovery-and-circuit-breaker-telemetry-for-enterprise-operations",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Enterprise AI Architects & Operations Automation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule LangGraph State Machine Audit"
    },
    {
        "id": 1645,
        "keyword": "sap s4hana rfc sub-200ms idempotent commit telemetry for corporate accounting pipelines",
        "slug": "sap-s4hana-rfc-sub-200ms-idempotent-commit-telemetry-for-corporate-accounting-pipelines",
        "category": "Solutions",
        "hub_category": "ERP Integration & Automation",
        "target_persona": "SAP Enterprise Architects & Corporate Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SAP RFC Integration Audit"
    },
    {
        "id": 1646,
        "keyword": "oracle cloud erp automated ledger reconciliation and general ledger balance verification telemetry",
        "slug": "oracle-cloud-erp-automated-ledger-reconciliation-and-general-ledger-balance-verification-telemetry",
        "category": "Solutions",
        "hub_category": "ERP Integration & Automation",
        "target_persona": "Oracle Financial Systems Directors & Enterprise Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Oracle ERP Reconciliation Audit"
    },
    {
        "id": 1647,
        "keyword": "pydantic v2 strict schema invariant enforcement telemetry for corporate procurement pipelines",
        "slug": "pydantic-v2-strict-schema-invariant-enforcement-telemetry-for-corporate-procurement-pipelines",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Enterprise Software Engineering Directors & Procurement Systems Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Schema Invariant Architecture Audit"
    },
    {
        "id": 1648,
        "keyword": "gst rule 36-4 automated input tax credit matching and vendor 2b reconciliation telemetry",
        "slug": "gst-rule-36-4-automated-input-tax-credit-matching-and-vendor-2b-reconciliation-telemetry",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Directors & Chief Financial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Rule 36-4 Compliance Audit"
    },
    {
        "id": 1649,
        "keyword": "section 63 bsa digital electronic evidence admissibility and sha-256 state hashing telemetry",
        "slug": "section-63-bsa-digital-electronic-evidence-admissibility-and-sha-256-state-hashing-telemetry",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise General Counsels & Chief Legal Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule BSA Forensic Admissibility Audit"
    },
    {
        "id": 1650,
        "keyword": "cert-in 6-hour cybersecurity incident reporting and automated forensic state capture telemetry",
        "slug": "cert-in-6-hour-cybersecurity-incident-reporting-and-automated-forensic-state-capture-telemetry",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Information Security Officers & Incident Response Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CERT-In Compliance Audit"
    },
    {
        "id": 1651,
        "keyword": "air-gapped private vpc llama-3 70b inference node deployment telemetry for indian data fiduciaries",
        "slug": "air-gapped-private-vpc-llama-3-70b-inference-node-deployment-telemetry-for-indian-data-fiduciaries",
        "category": "Solutions",
        "hub_category": "Sovereign AI Infrastructure",
        "target_persona": "Enterprise Infrastructure Architects & Chief Technology Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sovereign VPC Deployment Audit"
    },
    {
        "id": 1652,
        "keyword": "triton vllm pagedattention kv-cache allocation and sub-20ms ttft optimization telemetry",
        "slug": "triton-vllm-pagedattention-kv-cache-allocation-and-sub-20ms-ttft-optimization-telemetry",
        "category": "Solutions",
        "hub_category": "Sovereign AI Infrastructure",
        "target_persona": "Principal AI Infrastructure Engineers & HPC Cluster Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Triton vLLM Optimization Audit"
    },
    {
        "id": 1653,
        "keyword": "high-concurrency ondc merchant catalog reconciliation and dynamic order routing telemetry",
        "slug": "high-concurrency-ondc-merchant-catalog-reconciliation-and-dynamic-order-routing-telemetry",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce Technology Directors & Marketplace Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC Catalog Routing Audit"
    },
    {
        "id": 1654,
        "keyword": "electronic city phase 1 factory line machine vision defect classification telemetry for smt assembly",
        "slug": "electronic-city-phase-1-factory-line-machine-vision-defect-classification-telemetry-for-smt-assembly",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Edge AI",
        "target_persona": "Electronics Manufacturing Directors & Quality Assurance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SMT Machine Vision Audit"
    },
    {
        "id": 1655,
        "keyword": "whitefield sez automated customs e-way bill verification and consignment clearance telemetry",
        "slug": "whitefield-sez-automated-customs-e-way-bill-verification-and-consignment-clearance-telemetry",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Logistics Operations Directors & Export-Import VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SEZ Customs Logistics Audit"
    },
    {
        "id": 1656,
        "keyword": "bellandur gcc sub-second payroll tax calculation and provident fund statutory filing telemetry",
        "slug": "bellandur-gcc-sub-second-payroll-tax-calculation-and-provident-fund-statutory-filing-telemetry",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "GCC Human Resources Directors & Enterprise Payroll Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GCC Payroll Automation Audit"
    },
    {
        "id": 1657,
        "keyword": "sarjapur tech park vendor compliance and msme statutory 45-day clearance tracking telemetry",
        "slug": "sarjapur-tech-park-vendor-compliance-and-msme-statutory-45-day-clearance-tracking-telemetry",
        "category": "Solutions",
        "hub_category": "ERP Integration & Automation",
        "target_persona": "Enterprise Procurement VPs & Vendor Relations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MSME Vendor Compliance Audit"
    },

    # Cluster 2: Asynchronous Graph Consensus & State Trie Verifier Telemetry (IDs 1658-1674, 17 items)
    {
        "id": 1658,
        "keyword": "asynchronous bft abft multi-agent state consensus and leaderless epoch finality telemetry",
        "slug": "asynchronous-bft-abft-multi-agent-state-consensus-and-leaderless-epoch-finality-telemetry",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Distributed Systems Architects & Principal Blockchain Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule aBFT Distributed Consensus Audit"
    },
    {
        "id": 1659,
        "keyword": "merkle patricia state trie cryptographic root verification and sub-kilobyte proof telemetry",
        "slug": "merkle-patricia-state-trie-cryptographic-root-verification-and-sub-kilobyte-proof-telemetry",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Cryptographic Systems Architects & Enterprise Security Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Merkle State Trie Audit"
    },
    {
        "id": 1660,
        "keyword": "game-theoretic byzantine 3f-plus-1 fault tolerance thresholding telemetry for autonomous clusters",
        "slug": "game-theoretic-byzantine-3f-plus-1-fault-tolerance-thresholding-telemetry-for-autonomous-clusters",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Chief Risk Officers & Distributed Systems Research Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Fault Tolerance Audit"
    },
    {
        "id": 1661,
        "keyword": "gossip-about-gossip dag hashgraph state synchronization telemetry for high-frequency trading agents",
        "slug": "gossip-about-gossip-dag-hashgraph-state-synchronization-telemetry-for-high-frequency-trading-agents",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Quantitative Trading CTOs & FinTech Infrastructure Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DAG Hashgraph Consensus Audit"
    },
    {
        "id": 1662,
        "keyword": "zero-knowledge stark validity state rollup proof verification telemetry for private enterprise ledgers",
        "slug": "zero-knowledge-stark-validity-state-rollup-proof-verification-telemetry-for-private-enterprise-ledgers",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Zero-Knowledge Cryptography Architects & Enterprise Security VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ZK Validity Proof Audit"
    },
    {
        "id": 1663,
        "keyword": "optimistic fraud proof challenge window and state rollback telemetry for multi-agent ledgers",
        "slug": "optimistic-fraud-proof-challenge-window-and-state-rollback-telemetry-for-multi-agent-ledgers",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Enterprise Distributed Systems Directors & Compliance Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Optimistic State Rollback Audit"
    },
    {
        "id": 1664,
        "keyword": "cross-region wan latency jitter packet smoothing telemetry for distributed agent consensus",
        "slug": "cross-region-wan-latency-jitter-packet-smoothing-telemetry-for-distributed-agent-consensus",
        "category": "Solutions",
        "hub_category": "Sovereign AI Infrastructure",
        "target_persona": "Global Network Operations Directors & Cloud Architecture VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule WAN Latency Smoothing Audit"
    },
    {
        "id": 1665,
        "keyword": "row-level security postgresql immutable consensus audit log storage telemetry for banking fiduciaries",
        "slug": "row-level-security-postgresql-immutable-consensus-audit-log-storage-telemetry-for-banking-fiduciaries",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Database Systems Architects & Chief Information Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PostgreSQL Immutable Audit"
    },
    {
        "id": 1666,
        "keyword": "adversarial agent prompt-injection byzantine quarantine telemetry for sovereign clusters",
        "slug": "adversarial-agent-prompt-injection-byzantine-quarantine-telemetry-for-sovereign-clusters",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "AI Safety Directors & Enterprise Cyber Defense VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Quarantine Audit"
    },
    {
        "id": 1667,
        "keyword": "distributed state machine deadlock circuit breaker telemetry for autonomous orchestration pipelines",
        "slug": "distributed-state-machine-deadlock-circuit-breaker-telemetry-for-autonomous-orchestration-pipelines",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Principal Reliability Engineers & Enterprise Operations CTOs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Deadlock Circuit Breaker Audit"
    },
    {
        "id": 1668,
        "keyword": "multi-validator leaderless consensus telemetry for core banking transaction switches",
        "slug": "multi-validator-leaderless-consensus-telemetry-for-core-banking-transaction-switches",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Core Banking Architecture Directors & Payment Systems VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Core Banking Consensus Audit"
    },
    {
        "id": 1669,
        "keyword": "epistemic uncertainty quorum verification telemetry for autonomous credit underwriting swarms",
        "slug": "epistemic-uncertainty-quorum-verification-telemetry-for-autonomous-credit-underwriting-swarms",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Chief Credit Officers & Quantitative Risk Modeling Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Credit Quorum Verification Audit"
    },
    {
        "id": 1670,
        "keyword": "sub-50ms finality state commitment telemetry for sovereign private multi-agent clusters",
        "slug": "sub-50ms-finality-state-commitment-telemetry-for-sovereign-private-multi-agent-clusters",
        "category": "Solutions",
        "hub_category": "Sovereign AI Infrastructure",
        "target_persona": "Enterprise Cluster Engineering Directors & High-Performance Compute VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sub-50ms Finality Audit"
    },
    {
        "id": 1671,
        "keyword": "merkle proof sub-kilobyte serialization telemetry for edge iot and factory microcontrollers",
        "slug": "merkle-proof-sub-kilobyte-serialization-telemetry-for-edge-iot-and-factory-microcontrollers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Edge AI",
        "target_persona": "Embedded Systems Directors & IoT Edge Infrastructure Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IoT Merkle Proof Audit"
    },
    {
        "id": 1672,
        "keyword": "sharded state trie parallel execution telemetry for multi-tenant enterprise erp backbones",
        "slug": "sharded-state-trie-parallel-execution-telemetry-for-multi-tenant-enterprise-erp-backbones",
        "category": "Solutions",
        "hub_category": "ERP Integration & Automation",
        "target_persona": "Enterprise ERP Architects & Database Infrastructure VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sharded ERP Execution Audit"
    },
    {
        "id": 1673,
        "keyword": "cryptographic validator key derivation under hsm fips 140-3 enclaves for consensus agents",
        "slug": "cryptographic-validator-key-derivation-under-hsm-fips-140-3-enclaves-for-consensus-agents",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Information Security Officers & Hardware Cryptography Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule HSM Key Derivation Audit"
    },
    {
        "id": 1674,
        "keyword": "automated byzantine validator slashing and quarantine telemetry for autonomous agent governance",
        "slug": "automated-byzantine-validator-slashing-and-quarantine-telemetry-for-autonomous-agent-governance",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "AI Governance Directors & Distributed Systems Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Agent Slashing Governance Audit"
    },

    # Cluster 3: Cross-Border Settlement & ONDC Merchant Automated Discrepancy Telemetry (IDs 1675-1690, 16 items)
    {
        "id": 1675,
        "keyword": "ondc network transaction settlement and automated dispute arbitration telemetry for retail merchants",
        "slug": "ondc-network-transaction-settlement-and-automated-dispute-arbitration-telemetry-for-retail-merchants",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Retail Operations Directors & Digital Commerce VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC Settlement Audit"
    },
    {
        "id": 1676,
        "keyword": "rbi liberalised remittance scheme lrs automated compliance verification telemetry for private banks",
        "slug": "rbi-liberalised-remittance-scheme-lrs-automated-compliance-verification-telemetry-for-private-banks",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Private Banking Compliance Directors & Forex Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule RBI LRS Compliance Audit"
    },
    {
        "id": 1677,
        "keyword": "cross-border swift mt103 and iso 20022 xml message parsing telemetry for enterprise treasury",
        "slug": "cross-border-swift-mt103-and-iso-20022-xml-message-parsing-telemetry-for-enterprise-treasury",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Enterprise Treasury Directors & Corporate Cash Management VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SWIFT ISO 20022 Parsing Audit"
    },
    {
        "id": 1678,
        "keyword": "indian customs icegate automated bill of entry tariff reconciliation telemetry for freight forwarders",
        "slug": "indian-customs-icegate-automated-bill-of-entry-tariff-reconciliation-telemetry-for-freight-forwarders",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Customs Brokerage Directors & International Freight Forwarding VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ICEGATE Tariff Reconciliation Audit"
    },
    {
        "id": 1679,
        "keyword": "multicurrency forex arbitrage hedging and real-time state reconciliation telemetry for export enterprises",
        "slug": "multicurrency-forex-arbitrage-hedging-and-real-time-state-reconciliation-telemetry-for-export-enterprises",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Chief Risk Officers & Corporate Forex Hedging Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Forex Hedging Reconciliation Audit"
    },
    {
        "id": 1680,
        "keyword": "high-throughput upi 2-0 merchant dispute settlement and chargeback defense telemetry for fintechs",
        "slug": "high-throughput-upi-2-0-merchant-dispute-settlement-and-chargeback-defense-telemetry-for-fintechs",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Payment Gateway CTOs & Merchant Dispute Resolution Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule UPI 2.0 Settlement Audit"
    },
    {
        "id": 1681,
        "keyword": "aadhaar e-kyc and pan verification fraud defense telemetry for digital lending platforms",
        "slug": "aadhaar-e-kyc-and-pan-verification-fraud-defense-telemetry-for-digital-lending-platforms",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Digital Lending Risk Directors & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule e-KYC Fraud Defense Audit"
    },
    {
        "id": 1682,
        "keyword": "automated export drawback calculation and dgft portal synchronization telemetry for manufacturing exporters",
        "slug": "automated-export-drawback-calculation-and-dgft-portal-synchronization-telemetry-for-manufacturing-exporters",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Edge AI",
        "target_persona": "Export Manufacturing Directors & Trade Compliance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DGFT Export Drawback Audit"
    },
    {
        "id": 1683,
        "keyword": "dynamic merchant fee escrow settlement telemetry for multi-vendor retail marketplaces",
        "slug": "dynamic-merchant-fee-escrow-settlement-telemetry-for-multi-vendor-retail-marketplaces",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Marketplace Finance Directors & Platform Settlement VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Escrow Settlement Audit"
    },
    {
        "id": 1684,
        "keyword": "vernacular invoice ocr tokenization telemetry for tier-2 and tier-3 indian retail distributors",
        "slug": "vernacular-invoice-ocr-tokenization-telemetry-for-tier-2-and-tier-3-indian-retail-distributors",
        "category": "Solutions",
        "hub_category": "ERP Integration & Automation",
        "target_persona": "Supply Chain Technology Directors & FMCG Distribution VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Vernacular OCR Tokenization Audit"
    },
    {
        "id": 1685,
        "keyword": "fastag commercial toll fleet reconciliation and discrepancy clearing telemetry for logistics carriers",
        "slug": "fastag-commercial-toll-fleet-reconciliation-and-discrepancy-clearing-telemetry-for-logistics-carriers",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Fleet Operations Directors & Commercial Transport Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule FASTag Fleet Reconciliation Audit"
    },
    {
        "id": 1686,
        "keyword": "gst e-invoicing irp portal automated json payload generation telemetry for high-volume billing",
        "slug": "gst-e-invoicing-irp-portal-automated-json-payload-generation-telemetry-for-high-volume-billing",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Enterprise Billing Systems Directors & Corporate Tax Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IRP e-Invoicing Audit"
    },
    {
        "id": 1687,
        "keyword": "automated bank guarantee e-bg verification and stamping telemetry for infrastructure contractors",
        "slug": "automated-bank-guarantee-e-bg-verification-and-stamping-telemetry-for-infrastructure-contractors",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Infrastructure Finance Directors & Enterprise Contract Legal VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule e-BG Stamping Verification Audit"
    },
    {
        "id": 1688,
        "keyword": "corporate vendor tds section 194q compliance deduction telemetry for accounting controllers",
        "slug": "corporate-vendor-tds-section-194q-compliance-deduction-telemetry-for-accounting-controllers",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Accounting Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TDS Section 194Q Audit"
    },
    {
        "id": 1689,
        "keyword": "ondc logistics partner sla breach automated penalty adjudication telemetry for quick commerce networks",
        "slug": "ondc-logistics-partner-sla-breach-automated-penalty-adjudication-telemetry-for-quick-commerce-networks",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Logistics Operations VPs & Quick Commerce Technology Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ONDC SLA Adjudication Audit"
    },
    {
        "id": 1690,
        "keyword": "sovereign indian rupee trade settlement and vostro account reconciliation telemetry for cross-border banks",
        "slug": "sovereign-indian-rupee-trade-settlement-and-vostro-account-reconciliation-telemetry-for-cross-border-banks",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "International Banking Operations Directors & Trade Settlement VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Rupee Vostro Trade Settlement Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 36 COMMERCIAL KEYWORDS (IDs 1,641 to 1,690)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}
    existing_slugs = {item["slug"] for item in data}

    added_count = 0
    for kw in KEYWORDS_WAVE36:
        if kw["id"] in existing_ids:
            print(f"⚠️ ID {kw['id']} already exists, skipping")
            continue
        if kw["slug"] in existing_slugs:
            print(f"⚠️ Slug '{kw['slug']}' already exists, skipping")
            continue
        data.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added_count += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=4), encoding="utf-8")
    print(f"✅ Successfully ingested {added_count} new keywords into {QUEUE_PATH}")
    print(f"Total solutions now in queue: {len(data)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
