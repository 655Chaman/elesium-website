#!/usr/bin/env python3
"""
Ingests Wave 46 commercial keywords (IDs 2,141 to 2,190, 50 solutions)
into automation/compact_keywords_queue.json.
Expands the commercial core from 2,140 to 2,190 solutions!
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
Focus: Tally ERP 9 / Tally Prime XML port 9000 integration, GST Rule 36(4) reconciliation,
and Indian enterprise FinOps multi-agent automation.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE46 = [
    # Cluster 1: Tally Prime & Tally ERP 9 XML/TDL Automated Invoicing & Ledger Sync (IDs 2141-2157, 17 items)
    {
        "id": 2141,
        "keyword": "tally prime automated xml voucher ingestion agents for enterprise accounts payable teams",
        "slug": "tally-prime-automated-xml-voucher-ingestion-agents-for-enterprise-accounts-payable-teams",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Financial Officers & Accounts Payable Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tally XML Automation Audit"
    },
    {
        "id": 2142,
        "keyword": "tally erp 9 tdl port 9000 socket communication telemetry for logistics freight billing",
        "slug": "tally-erp-9-tdl-port-9000-socket-communication-telemetry-for-logistics-freight-billing",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Logistics Finance Directors & Supply Chain Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TDL Port 9000 Audit"
    },
    {
        "id": 2143,
        "keyword": "autonomous purchase voucher creation agents with vendor gstin validation in tally prime",
        "slug": "autonomous-purchase-voucher-creation-agents-with-vendor-gstin-validation-in-tally-prime",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Head of Finance & Enterprise Tax Accounting Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Purchase Voucher Agent Audit"
    },
    {
        "id": 2144,
        "keyword": "tally odbc sql query extraction agents for automated daily cash flow forecasting in india",
        "slug": "tally-odbc-sql-query-extraction-agents-for-automated-daily-cash-flow-forecasting-in-india",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate Treasurers & Mid-Market Finance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tally ODBC Forecasting Audit"
    },
    {
        "id": 2145,
        "keyword": "multimodal llm invoice parser with direct tally prime accounting voucher view injection",
        "slug": "multimodal-llm-invoice-parser-with-direct-tally-prime-accounting-voucher-view-injection",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Enterprise Controllers & Shared Services Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Invoice Parsing Audit"
    },
    {
        "id": 2146,
        "keyword": "tally sundry creditors ledger entity resolution agents using pgvector semantic search",
        "slug": "tally-sundry-creditors-ledger-entity-resolution-agents-using-pgvector-semantic-search",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Finance Systems Architects & Enterprise Accounting Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Ledger Entity Resolution Audit"
    },
    {
        "id": 2147,
        "keyword": "automated multi company tally prime consolidation agents for indian manufacturing groups",
        "slug": "automated-multi-company-tally-prime-consolidation-agents-for-indian-manufacturing-groups",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Group CFOs & Financial Consolidation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Multi-Company Tally Audit"
    },
    {
        "id": 2148,
        "keyword": "tally prime sales voucher automated posting from shopfloor dispatch slips in automotive tier 1",
        "slug": "tally-prime-sales-voucher-automated-posting-from-shopfloor-dispatch-slips-in-automotive-tier-1",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Plant Finance Controllers & Commercial Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sales Voucher Agent Audit"
    },
    {
        "id": 2149,
        "keyword": "tally journal voucher automated foreign exchange fluctuation adjustment agents in mumbai",
        "slug": "tally-journal-voucher-automated-foreign-exchange-fluctuation-adjustment-agents-in-mumbai",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Treasury Heads & Forex Accounting Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Forex Adjustment Agent Audit"
    },
    {
        "id": 2150,
        "keyword": "air gapped local vllm invoice processing pipeline with tally prime xml socket integration",
        "slug": "air-gapped-local-vllm-invoice-processing-pipeline-with-tally-prime-xml-socket-integration",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Information Security Officers & Defense Finance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Air-Gapped Tally Audit"
    },
    {
        "id": 2151,
        "keyword": "tally bill of materials bom manufacturing journal auto generation from mes plc telemetry",
        "slug": "tally-bill-of-materials-bom-manufacturing-journal-auto-generation-from-mes-plc-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Manufacturing Operations Heads & Works Accountants",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule BOM Journal Automation Audit"
    },
    {
        "id": 2152,
        "keyword": "tally prime automated debit note generation agents for supplier price difference reconciliation",
        "slug": "tally-prime-automated-debit-note-generation-agents-for-supplier-price-difference-reconciliation",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Procurement Finance Directors & Commercial Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Debit Note Agent Audit"
    },
    {
        "id": 2153,
        "keyword": "fastapi sovereign microservice proxy for tally prime xml port 9000 with bearer token auth",
        "slug": "fastapi-sovereign-microservice-proxy-for-tally-prime-xml-port-9000-with-bearer-token-auth",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Enterprise Integration Architects & Principal Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tally Reverse Proxy Audit"
    },
    {
        "id": 2154,
        "keyword": "tally prime inventory reorder level automated stock replenishment agents for retail distributors",
        "slug": "tally-prime-inventory-reorder-level-automated-stock-replenishment-agents-for-retail-distributors",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Retail Operations Directors & Inventory Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Inventory Agent Audit"
    },
    {
        "id": 2155,
        "keyword": "automated payroll salary disbursement voucher ingestion into tally prime with biometric sync",
        "slug": "automated-payroll-salary-disbursement-voucher-ingestion-into-tally-prime-with-biometric-sync",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "HR Operations Heads & Payroll Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Payroll Tally Audit"
    },
    {
        "id": 2156,
        "keyword": "tally erp 9 bank payment voucher auto posting from hdfc and icici corporate banking apis",
        "slug": "tally-erp-9-bank-payment-voucher-auto-posting-from-hdfc-and-icici-corporate-banking-apis",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate Treasury Directors & Finance Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bank API Tally Audit"
    },
    {
        "id": 2157,
        "keyword": "pydantic v2 double entry accounting validation guardrails for tally prime xml payloads",
        "slug": "pydantic-v2-double-entry-accounting-validation-guardrails-for-tally-prime-xml-payloads",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Technology Officers & FinTech Software Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Double-Entry Guardrail Audit"
    },

    # Cluster 2: Indian GST Reconciliation, GSTR-2B Matching & E-Way Bill LLM Automation (IDs 2158-2174, 17 items)
    {
        "id": 2158,
        "keyword": "gst rule 36 4 input tax credit auto reconciliation agents against live gstr 2b returns",
        "slug": "gst-rule-36-4-input-tax-credit-auto-reconciliation-agents-against-live-gstr-2b-returns",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Corporate Tax Heads & Indirect Taxation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Rule 36(4) Audit"
    },
    {
        "id": 2159,
        "keyword": "automated nic e way bill portal generation agents from tally prime delivery challans in delhi",
        "slug": "automated-nic-e-way-bill-portal-generation-agents-from-tally-prime-delivery-challans-in-delhi",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Logistics Operations Heads & Despatch Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule E-Way Bill Agent Audit"
    },
    {
        "id": 2160,
        "keyword": "automated irn e invoice json generation and qr code embedding agents for tally erp in bangalore",
        "slug": "automated-irn-e-invoice-json-generation-and-qr-code-embedding-agents-for-tally-erp-in-bangalore",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Billing Operations Directors & Tax Compliance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule E-Invoice IRN Audit"
    },
    {
        "id": 2161,
        "keyword": "gstr 1 sales return auto compilation agents from tally prime sales ledgers in chennai",
        "slug": "gstr-1-sales-return-auto-compilation-agents-from-tally-prime-sales-ledgers-in-chennai",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Indirect Tax Managers & Statutory Compliance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GSTR-1 Agent Audit"
    },
    {
        "id": 2162,
        "keyword": "supplier gst filing status automated tracking agents with payment hold escrow triggers in pune",
        "slug": "supplier-gst-filing-status-automated-tracking-agents-with-payment-hold-escrow-triggers-in-pune",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Procurement Directors & Chief Financial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Supplier GST Tracking Audit"
    },
    {
        "id": 2163,
        "keyword": "hsn sac code classification and validation agents using llm embeddings for indian manufacturers",
        "slug": "hsn-sac-code-classification-and-validation-agents-using-llm-embeddings-for-indian-manufacturers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Customs & Excise Leads & Manufacturing Tax Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule HSN Code Agent Audit"
    },
    {
        "id": 2164,
        "keyword": "reverse charge mechanism rcm automated tax voucher generation in tally for unregistered vendors",
        "slug": "reverse-charge-mechanism-rcm-automated-tax-voucher-generation-in-tally-for-unregistered-vendors",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Accounting Directors & Financial Compliance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule RCM Voucher Agent Audit"
    },
    {
        "id": 2165,
        "keyword": "tds section 194q automated deduction and challan generation agents integrated with tally prime",
        "slug": "tds-section-194q-automated-deduction-and-challan-generation-agents-integrated-with-tally-prime",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Direct Taxation Heads & Corporate Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TDS Section 194Q Audit"
    },
    {
        "id": 2166,
        "keyword": "automated gstr 9 annual return reconciliation agents matching tally ledgers with gstn portal",
        "slug": "automated-gstr-9-annual-return-reconciliation-agents-matching-tally-ledgers-with-gstn-portal",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Statutory Auditors & Corporate Tax Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GSTR-9 Reconciliation Audit"
    },
    {
        "id": 2167,
        "keyword": "automated e way bill validity tracking and rfid toll gate sync agents for interstate transport",
        "slug": "automated-e-way-bill-validity-tracking-and-rfid-toll-gate-sync-agents-for-interstate-transport",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Fleet Logistics Directors & Interstate Dispatch Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule E-Way Bill Toll Sync Audit"
    },
    {
        "id": 2168,
        "keyword": "automated gst audit trail verification agents compliant with mca electronic records mandate",
        "slug": "automated-gst-audit-trail-verification-agents-compliant-with-mca-electronic-records-mandate",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Internal Audit Directors & Corporate Governance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MCA Audit Trail Audit"
    },
    {
        "id": 2169,
        "keyword": "tally input tax credit apportionment agents for common inputs under gst rule 42 and 43",
        "slug": "tally-input-tax-credit-apportionment-agents-for-common-inputs-under-gst-rule-42-and-43",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Tax Accounting Leads & Manufacturing CFOs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Rule 42/43 Apportionment Audit"
    },
    {
        "id": 2170,
        "keyword": "automated lut letter of undertaking export invoice filing agents integrated with tally prime",
        "slug": "automated-lut-letter-of-undertaking-export-invoice-filing-agents-integrated-with-tally-prime",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Export Documentation Managers & Trade Finance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule LUT Export Agent Audit"
    },
    {
        "id": 2171,
        "keyword": "automated gst notice analysis and draft response generation agents for indian enterprise tax teams",
        "slug": "automated-gst-notice-analysis-and-draft-response-generation-agents-for-indian-enterprise-tax-teams",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Tax Litigation Directors & Corporate Legal Counsels",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Notice Agent Audit"
    },
    {
        "id": 2172,
        "keyword": "cross border sez supply zero rated invoice verification agents in tally for it parks in hyderabad",
        "slug": "cross-border-sez-supply-zero-rated-invoice-verification-agents-in-tally-for-it-parks-in-hyderabad",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "SEZ Compliance Officers & Enterprise Tax Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SEZ Invoice Agent Audit"
    },
    {
        "id": 2173,
        "keyword": "automated multi state gst registration invoice routing agents for indian e commerce merchants",
        "slug": "automated-multi-state-gst-registration-invoice-routing-agents-for-indian-e-commerce-merchants",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce Finance Directors & Multi-State Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Multi-State GST Routing Audit"
    },
    {
        "id": 2174,
        "keyword": "automated tally sales register verification agents against gstr 3b liability ledgers in gujarat",
        "slug": "automated-tally-sales-register-verification-agents-against-gstr-3b-liability-ledgers-in-gujarat",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Industrial Tax Managers & Enterprise Accounting Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GSTR-3B Tally Audit"
    },

    # Cluster 3: Indian Enterprise FinOps, Accounts Payable/Receivable & Bank Reconciliation Agents (IDs 2175-2190, 16 items)
    {
        "id": 2175,
        "keyword": "automated 3 way invoice po grn matching agents with direct tally prime voucher posting",
        "slug": "automated-3-way-invoice-po-grn-matching-agents-with-direct-tally-prime-voucher-posting",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Accounts Payable Heads & Enterprise Procurement Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule 3-Way Matching Agent Audit"
    },
    {
        "id": 2176,
        "keyword": "automated bank statement mt940 parser with tally prime bank reconciliation statement brs sync",
        "slug": "automated-bank-statement-mt940-parser-with-tally-prime-bank-reconciliation-statement-brs-sync",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Treasury Managers & Financial Accounting Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MT940 BRS Sync Audit"
    },
    {
        "id": 2177,
        "keyword": "autonomous accounts receivable dunning and whatsapp payment link agents integrated with tally",
        "slug": "autonomous-accounts-receivable-dunning-and-whatsapp-payment-link-agents-integrated-with-tally",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Credit Control Directors & Revenue Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule AR Dunning Agent Audit"
    },
    {
        "id": 2178,
        "keyword": "automated vendor advance payment allocation agents in tally prime against subsequent bills",
        "slug": "automated-vendor-advance-payment-allocation-agents-in-tally-prime-against-subsequent-bills",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "AP Operations Leads & Working Capital Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Vendor Advance Agent Audit"
    },
    {
        "id": 2179,
        "keyword": "automated msme 45 day payment rule section 43b h compliance tracking agents in tally prime",
        "slug": "automated-msme-45-day-payment-rule-section-43b-h-compliance-tracking-agents-in-tally-prime",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Financial Officers & Corporate Tax Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Section 43B(h) Audit"
    },
    {
        "id": 2180,
        "keyword": "automated customer credit limit enforcement agents during tally sales order entry in kolkata",
        "slug": "automated-customer-credit-limit-enforcement-agents-during-tally-sales-order-entry-in-kolkata",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Commercial Credit Heads & Sales Operations Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Credit Limit Agent Audit"
    },
    {
        "id": 2181,
        "keyword": "automated petty cash expense voucher scanning and categorization agents for indian branch offices",
        "slug": "automated-petty-cash-expense-voucher-scanning-and-categorization-agents-for-indian-branch-offices",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Branch Operations Controllers & Shared Services Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Petty Cash Agent Audit"
    },
    {
        "id": 2182,
        "keyword": "automated fixed asset depreciation schedule calculation and tally journal posting agents",
        "slug": "automated-fixed-asset-depreciation-schedule-calculation-and-tally-journal-posting-agents",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Fixed Asset Managers & Corporate Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fixed Asset Agent Audit"
    },
    {
        "id": 2183,
        "keyword": "automated tally prime ledger balance confirmation email dispatch agents for financial year end",
        "slug": "automated-tally-prime-ledger-balance-confirmation-email-dispatch-agents-for-financial-year-end",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Audit & Assurance Leads & Accounting Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Balance Confirmation Audit"
    },
    {
        "id": 2184,
        "keyword": "automated bill discounting and invoice factoring reconciliation agents between banks and tally",
        "slug": "automated-bill-discounting-and-invoice-factoring-reconciliation-agents-between-banks-and-tally",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Working Capital Heads & Treasury Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Invoice Factoring Audit"
    },
    {
        "id": 2185,
        "keyword": "automated corporate credit card expense report reconciliation agents with tally prime in gurgaon",
        "slug": "automated-corporate-credit-card-expense-report-reconciliation-agents-with-tally-prime-in-gurgaon",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Corporate Expense Leads & Finance Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Card Expense Agent Audit"
    },
    {
        "id": 2186,
        "keyword": "automated recurring subscription billing and tally receipt voucher generation agents for saas",
        "slug": "automated-recurring-subscription-billing-and-tally-receipt-voucher-generation-agents-for-saas",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "SaaS Finance Directors & Subscription Billing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SaaS Billing Tally Audit"
    },
    {
        "id": 2187,
        "keyword": "automated inter branch stock transfer stn voucher generation agents in tally for supply chains",
        "slug": "automated-inter-branch-stock-transfer-stn-voucher-generation-agents-in-tally-for-supply-chains",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "Supply Chain Finance Heads & Warehouse Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Inter-Branch STN Audit"
    },
    {
        "id": 2188,
        "keyword": "automated customer rebate and turnover discount credit note calculation agents in tally prime",
        "slug": "automated-customer-rebate-and-turnover-discount-credit-note-calculation-agents-in-tally-prime",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Commercial Sales Controllers & Distribution Finance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Rebate Credit Note Audit"
    },
    {
        "id": 2189,
        "keyword": "automated tally cost centre allocation agents for enterprise project accounting in hyderabad",
        "slug": "automated-tally-cost-centre-allocation-agents-for-enterprise-project-accounting-in-hyderabad",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Project Financial Controllers & Enterprise Cost Accountants",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cost Centre Agent Audit"
    },
    {
        "id": 2190,
        "keyword": "automated section 63 bsa digital forensic signature stamping agents for tally voucher exports",
        "slug": "automated-section-63-bsa-digital-forensic-signature-stamping-agents-for-tally-voucher-exports",
        "category": "Solutions",
        "hub_category": "ERP Integration",
        "target_persona": "Chief Legal Officers & Forensic Accounting Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Section 63 BSA Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 46 COMMERCIAL KEYWORDS (IDs 2,141 TO 2,190 — 50 SOLUTIONS)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing queue file: {QUEUE_PATH}")

    queue_data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in queue_data}
    existing_slugs = {item["slug"] for item in queue_data}

    added_count = 0
    for kw in KEYWORDS_WAVE46:
        if kw["id"] in existing_ids:
            print(f"⚠️ ID {kw['id']} already exists. Skipping.")
            continue
        if kw["slug"] in existing_slugs:
            print(f"⚠️ Slug '{kw['slug']}' already exists. Skipping.")
            continue
        queue_data.append(kw)
        added_count += 1

    QUEUE_PATH.write_text(json.dumps(queue_data, indent=2), encoding="utf-8")
    print(f"✅ Successfully ingested {added_count} new commercial solutions into {QUEUE_PATH}")
    print(f"Total active commercial solutions in queue: {len(queue_data)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
