#!/usr/bin/env python3
"""
ingest_wave2_keywords.py — Ingest 25 Wave 2 High-Lever Commercial BOFU Keywords
================================================================================
Target: automation/compact_keywords_queue.json
Framework: Edward Sturm Complete Masterclass (Discovery & Keyword Selection)

Expands coverage into 5 high-margin enterprise verticals:
1. Telecom & Infrastructure (CDR reconciliation, optical fault isolation, interconnect settlement)
2. Pharma & Life Sciences (Oncology cohort matching, eCTD compilation, pharmacovigilance safety triage)
3. Legal & Real Estate Tech (Commercial lease abstraction, municipal title search, encumbrance verification)
4. BFSI & Wealth Management (Treasury cash pooling, trade surveillance, commercial vehicle loan underwriting)
5. Supply Chain & Maritime Shipping (Customs BoE parsing, container demurrage auditing, maritime bunker fuel)
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
QUEUE_PATH = BASE_DIR / "automation" / "compact_keywords_queue.json"

WAVE_2_KEYWORDS = [
    # Vertical 1: Telecom & Infrastructure
    {
        "keyword": "sub-second CDR billing reconciliation agents for telecom operators",
        "slug": "sub-second-cdr-billing-reconciliation-agents-for-telecom-operators",
        "key_benefit": "Zero-Leakage Real-Time Mediation & Rating",
        "category": "Solutions",
        "hub_category": "Telecom & Infrastructure",
        "target_persona": "Telecom CIOs & Billing Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Telecom Billing Automation"
    },
    {
        "keyword": "autonomous optical network fault isolation software for dark fiber carriers",
        "slug": "autonomous-optical-network-fault-isolation-software-for-dark-fiber-carriers",
        "key_benefit": "Real-Time Telemetry & Instant Circuit Rerouting",
        "category": "Solutions",
        "hub_category": "Telecom & Infrastructure",
        "target_persona": "Network Operations VP & Optical Transport Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Optical Fault Audit"
    },
    {
        "keyword": "deterministic interconnect settlement engines for mobile network operators",
        "slug": "deterministic-interconnect-settlement-engines-for-mobile-network-operators",
        "key_benefit": "Sub-200ms Roaming & Carrier Dispute Elimination",
        "category": "Solutions",
        "hub_category": "Telecom & Infrastructure",
        "target_persona": "Carrier Relations Directors & Telecom Financial Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Interconnect Settlement Demo"
    },
    {
        "keyword": "predictive cell tower energy optimization agents for telecom infrastructure firms",
        "slug": "predictive-cell-tower-energy-optimization-agents-for-telecom-infrastructure-firms",
        "key_benefit": "Autonomous Diesel & Grid Load Balancing",
        "category": "Solutions",
        "hub_category": "Telecom & Infrastructure",
        "target_persona": "TowerCo Asset Managers & Energy Operations VP",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Tower Energy Automation"
    },
    {
        "keyword": "telecom churn prediction state machines for enterprise broadband providers",
        "slug": "telecom-churn-prediction-state-machines-for-enterprise-broadband-providers",
        "key_benefit": "Proactive SLA Intervention & Retention Automation",
        "category": "Solutions",
        "hub_category": "Telecom & Infrastructure",
        "target_persona": "Broadband Revenue Officers & Customer Retention Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Churn Prediction Agents"
    },

    # Vertical 2: Pharma & Life Sciences
    {
        "keyword": "clinical trial patient cohort matching agents for oncology biotech sponsors",
        "slug": "clinical-trial-patient-cohort-matching-agents-for-oncology-biotech-sponsors",
        "key_benefit": "Genomic Eligibility Parsing & Zero Patient Misclassification",
        "category": "Solutions",
        "hub_category": "Pharma & Life Sciences",
        "target_persona": "Clinical Development VP & Oncology Biotech Sponsors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Clinical Cohort Audit"
    },
    {
        "keyword": "automated eCTD regulatory filing compilation software for pharma compliance directors",
        "slug": "automated-ectd-regulatory-filing-compilation-software-for-pharma-compliance-directors",
        "key_benefit": "21 CFR Part 11 & ICH Module 2-5 Validation",
        "category": "Solutions",
        "hub_category": "Pharma & Life Sciences",
        "target_persona": "Regulatory Affairs Directors & Pharma Compliance VP",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request eCTD Compilation Demo"
    },
    {
        "keyword": "pharmacovigilance adverse event triage state machines for clinical safety leads",
        "slug": "pharmacovigilance-adverse-event-triage-state-machines-for-clinical-safety-leads",
        "key_benefit": "Sub-Minute Signal Detection & Statutory ICSR Drafting",
        "category": "Solutions",
        "hub_category": "Pharma & Life Sciences",
        "target_persona": "Chief Medical Officers & Clinical Safety Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Safety Triage State Machines"
    },
    {
        "keyword": "deterministic chemical batch synthesis validation software for API manufacturers",
        "slug": "deterministic-chemical-batch-synthesis-validation-software-for-api-manufacturers",
        "key_benefit": "cGMP Electronic Batch Record Verification",
        "category": "Solutions",
        "hub_category": "Pharma & Life Sciences",
        "target_persona": "Plant QA Directors & Chemical Synthesis Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Batch Record Audit"
    },
    {
        "keyword": "cold chain temperature excursion auditing agents for vaccine distributors",
        "slug": "cold-chain-temperature-excursion-auditing-agents-for-vaccine-distributors",
        "key_benefit": "Immutable IoT Telemetry Logging & Statutory Compliance",
        "category": "Solutions",
        "hub_category": "Pharma & Life Sciences",
        "target_persona": "Pharma Logistics Directors & Quality Assurance VP",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Cold Chain Telemetry Demo"
    },

    # Vertical 3: Legal & Commercial Real Estate Tech
    {
        "keyword": "commercial lease abstraction AI agents for institutional REIT asset managers",
        "slug": "commercial-lease-abstraction-ai-agents-for-institutional-reit-asset-managers",
        "key_benefit": "Automated CAM Reconciliation & Clause Extraction",
        "category": "Solutions",
        "hub_category": "Legal & Real Estate Tech",
        "target_persona": "REIT Portfolio Managers & Real Estate Asset Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Lease Abstraction Audit"
    },
    {
        "keyword": "municipal title search parsing software for real estate conveyancers",
        "slug": "municipal-title-search-parsing-software-for-real-estate-conveyancers",
        "key_benefit": "Automated Chain-of-Title & Encumbrance Identification",
        "category": "Solutions",
        "hub_category": "Legal & Real Estate Tech",
        "target_persona": "Managing Partners & Real Estate Conveyancers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Title Search Parsing Demo"
    },
    {
        "keyword": "statutory encumbrance certificate verification agents for mortgage underwriters",
        "slug": "statutory-encumbrance-certificate-verification-agents-for-mortgage-underwriters",
        "key_benefit": "Sub-Minute Deed Analysis & Lien Clearance Verification",
        "category": "Solutions",
        "hub_category": "Legal & Real Estate Tech",
        "target_persona": "Mortgage Credit Heads & Title Verification Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Encumbrance Verification"
    },
    {
        "keyword": "automated contract clause deviation detectors for enterprise legal counsels",
        "slug": "automated-contract-clause-deviation-detectors-for-enterprise-legal-counsels",
        "key_benefit": "Standard Playbook Cross-Referencing & Risk Scoring",
        "category": "Solutions",
        "hub_category": "Legal & Real Estate Tech",
        "target_persona": "General Counsels & Commercial Contract Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Contract Deviation Agents"
    },
    {
        "keyword": "zoning compliance and FAR calculation state machines for commercial developers",
        "slug": "zoning-compliance-and-far-calculation-state-machines-for-commercial-developers",
        "key_benefit": "Deterministic Municipal Code & Setback Boundary Analysis",
        "category": "Solutions",
        "hub_category": "Legal & Real Estate Tech",
        "target_persona": "Development Directors & Urban Planning Executives",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Zoning Analysis Demo"
    },

    # Vertical 4: BFSI & Wealth Management
    {
        "keyword": "treasury multi-entity cash pooling automation engines for corporate treasurers",
        "slug": "treasury-multi-entity-cash-pooling-automation-engines-for-corporate-treasurers",
        "key_benefit": "Sub-Second Intercompany Sweeping & Liquidity Optimization",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate Treasurers & Finance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Treasury AI Audit"
    },
    {
        "keyword": "algorithmic trade surveillance systems for capital market brokerages",
        "slug": "algorithmic-trade-surveillance-systems-for-capital-market-brokerages",
        "key_benefit": "Real-Time Spoofing & Layering Anomaly Isolation",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Compliance Officers & Surveillance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Surveillance Demo"
    },
    {
        "keyword": "automated statutory tax deduction reconciliation agents for enterprise CFOs",
        "slug": "automated-statutory-tax-deduction-reconciliation-agents-for-enterprise-cfos",
        "key_benefit": "TDS & GST Input Tax Credit Ledger Matching",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate Tax Heads & Chief Financial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Tax Ledger Automation"
    },
    {
        "keyword": "commercial vehicle loan credit appraisal state machines for NBFC risk heads",
        "slug": "commercial-vehicle-loan-credit-appraisal-state-machines-for-nbfc-risk-heads",
        "key_benefit": "Sub-Minute Telematics & Fastag Cash Flow Verification",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Auto Loan Credit Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Loan Underwriting Agents"
    },
    {
        "keyword": "foreign exchange cross-currency payment clearing agents for multinational controllers",
        "slug": "foreign-exchange-cross-currency-payment-clearing-agents-for-multinational-controllers",
        "key_benefit": "Deterministic Rate Locking & Hedging State Execution",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Global Controllers & FX Treasury Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request FX Clearing Demo"
    },

    # Vertical 5: Supply Chain & Maritime Shipping
    {
        "keyword": "customs bill of entry classification agents for cross-border freight forwarders",
        "slug": "customs-bill-of-entry-classification-agents-for-cross-border-freight-forwarders",
        "key_benefit": "Sub-200ms HS Code Matching & Tariff Valuation",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Customs Brokerage Directors & International Logistics VP",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Customs AI Audit"
    },
    {
        "keyword": "container demurrage and detention auditing software for ocean freight shippers",
        "slug": "container-demurrage-and-detention-auditing-software-for-ocean-freight-shippers",
        "key_benefit": "Automated Port Free Time Tracking & Dispute Filing",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Ocean Freight Managers & Import Logistics Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Demurrage Audit Demo"
    },
    {
        "keyword": "maritime bunker fuel optimization state machines for commercial ship owners",
        "slug": "maritime-bunker-fuel-optimization-state-machines-for-commercial-ship-owners",
        "key_benefit": "Weather-Route Telematics & Fuel Burn Reduction",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Fleet Technical Directors & Maritime Ship Owners",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Maritime Fuel Optimization"
    },
    {
        "keyword": "air cargo unit load device weight balance agents for aviation freight carriers",
        "slug": "air-cargo-unit-load-device-weight-balance-agents-for-aviation-freight-carriers",
        "key_benefit": "Deterministic ULD Trim & Fuel Efficiency Calculations",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Cargo Operations VP & Flight Dispatch Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cargo ULD Balancing Agents"
    },
    {
        "keyword": "cold storage multi-zone climate telemetry automation for perishable food exporters",
        "slug": "cold-storage-multi-zone-climate-telemetry-automation-for-perishable-food-exporters",
        "key_benefit": "Real-Time Spoilage Prevention & Energy Optimization",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Cold Chain Operations Directors & Agricultural Exporters",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Cold Storage Telemetry Demo"
    }
]

def main():
    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        existing_data = json.load(f)

    existing_slugs = {item["slug"] for item in existing_data}
    current_max_id = max(item.get("id", 0) for item in existing_data)

    added_count = 0
    for kw in WAVE_2_KEYWORDS:
        if kw["slug"] not in existing_slugs:
            current_max_id += 1
            kw_entry = {"id": current_max_id, **kw}
            existing_data.append(kw_entry)
            existing_slugs.add(kw["slug"])
            added_count += 1
            print(f"  + Added [{current_max_id}]: {kw['slug']}")

    with open(QUEUE_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_data, f, indent=2)

    print(f"\n✓ Successfully ingested {added_count} new keywords into {QUEUE_PATH}.")
    print(f"✓ Total queue size: {len(existing_data)} keywords.")

if __name__ == "__main__":
    main()
