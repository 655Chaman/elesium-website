#!/usr/bin/env python3
"""
Ingests Wave 37 commercial keywords (IDs 1,691 to 1,740, 50 solutions)
into automation/compact_keywords_queue.json.
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE37 = [
    # Cluster 1: Healthcare & ABDM Clinical AI Automation Telemetry (IDs 1691-1707, 17 items)
    {
        "id": 1691,
        "keyword": "abdm m1 abha number creation and biometric triage telemetry for hospital networks",
        "slug": "abdm-m1-abha-number-creation-and-biometric-triage-telemetry-for-hospital-networks",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Chief Medical Officers & Hospital Information Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ABDM M1 Architecture Audit"
    },
    {
        "id": 1692,
        "keyword": "abdm m2 health information provider fhir r4 bundle publishing telemetry for tertiary hospitals",
        "slug": "abdm-m2-health-information-provider-fhir-r4-bundle-publishing-telemetry-for-tertiary-hospitals",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital IT Directors & Medical Informatics VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ABDM M2 FHIR Publishing Audit"
    },
    {
        "id": 1693,
        "keyword": "abdm m3 health information user consent artifact decryption telemetry for clinical diagnostic centers",
        "slug": "abdm-m3-health-information-user-consent-artifact-decryption-telemetry-for-clinical-diagnostic-centers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Diagnostic Center Directors & Hospital Information Systems VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ABDM M3 Consent Decryption Audit"
    },
    {
        "id": 1694,
        "keyword": "irdai cashless health insurance pre-authorization and nhcx exchange telemetry for corporate hospitals",
        "slug": "irdai-cashless-health-insurance-pre-authorization-and-nhcx-exchange-telemetry-for-corporate-hospitals",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital TPA Directors & Corporate Revenue Cycle VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IRDAI Cashless Pre-Auth Audit"
    },
    {
        "id": 1695,
        "keyword": "icd-10-cm automated diagnostic coding and clinical discrepancy telemetry for medical billing controllers",
        "slug": "icd-10-cm-automated-diagnostic-coding-and-clinical-discrepancy-telemetry-for-medical-billing-controllers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Medical Records Directors & Healthcare Billing Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ICD-10 Coding Audit"
    },
    {
        "id": 1696,
        "keyword": "dicom radiology imaging spatial-visual ai and pacs archive telemetry for diagnostic radiology networks",
        "slug": "dicom-radiology-imaging-spatial-visual-ai-and-pacs-archive-telemetry-for-diagnostic-radiology-networks",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Radiology Department Chairs & PACS Infrastructure Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DICOM PACS AI Audit"
    },
    {
        "id": 1697,
        "keyword": "nabh digital health accreditation and electronic audit trail telemetry for healthcare fiduciaries",
        "slug": "nabh-digital-health-accreditation-and-electronic-audit-trail-telemetry-for-healthcare-fiduciaries",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Quality Directors & NABH Accreditation Coordinators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule NABH Accreditation Audit"
    },
    {
        "id": 1698,
        "keyword": "hospital inpatient discharge turnaround acceleration and pharmacy reconciliation telemetry for private clinics",
        "slug": "hospital-inpatient-discharge-turnaround-acceleration-and-pharmacy-reconciliation-telemetry-for-private-clinics",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Inpatient Operations Directors & Nursing Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Discharge Acceleration Audit"
    },
    {
        "id": 1699,
        "keyword": "clinical decision support cdss antibiotic stewardship and dosage safety telemetry for intensive care",
        "slug": "clinical-decision-support-cdss-antibiotic-stewardship-and-dosage-safety-telemetry-for-intensive-care",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Infectious Disease Directors & Clinical Pharmacology Chairs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CDSS Clinical Safety Audit"
    },
    {
        "id": 1700,
        "keyword": "emergency room triaging and automated pediatric acuity scoring telemetry for trauma centers",
        "slug": "emergency-room-triaging-and-automated-pediatric-acuity-scoring-telemetry-for-trauma-centers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Emergency Medicine Directors & Trauma Center Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ER Triaging Automation Audit"
    },
    {
        "id": 1701,
        "keyword": "hospital bed occupancy forecasting and ot surgical suite scheduling telemetry for surgical centers",
        "slug": "hospital-bed-occupancy-forecasting-and-ot-surgical-suite-scheduling-telemetry-for-surgical-centers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Surgical Suite Operations Directors & Hospital Bed Management VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule OT Suite Scheduling Audit"
    },
    {
        "id": 1702,
        "keyword": "ayushman bharat pm-jay automated package billing and tms claim settlement telemetry for empanelled hospitals",
        "slug": "ayushman-bharat-pm-jay-automated-package-billing-and-tms-claim-settlement-telemetry-for-empanelled-hospitals",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "PM-JAY Scheme Coordinators & Hospital Finance Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PM-JAY TMS Billing Audit"
    },
    {
        "id": 1703,
        "keyword": "laboratory lims analyzer bidirectional hl7 interface and critical alert telemetry for diagnostic pathology labs",
        "slug": "laboratory-lims-analyzer-bidirectional-hl7-interface-and-critical-alert-telemetry-for-diagnostic-pathology-labs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pathology Laboratory Directors & Diagnostic Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule LIMS HL7 Interface Audit"
    },
    {
        "id": 1704,
        "keyword": "telemedicine vernacular consultation transcription and e-prescription telemetry for rural healthcare clinics",
        "slug": "telemedicine-vernacular-consultation-transcription-and-e-prescription-telemetry-for-rural-healthcare-clinics",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Digital Health Program Directors & Telemedicine Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Telemedicine Transcription Audit"
    },
    {
        "id": 1705,
        "keyword": "nursing medication administration record emar barcode verification telemetry for patient safety",
        "slug": "nursing-medication-administration-record-emar-barcode-verification-telemetry-for-patient-safety",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Nursing Superintendents & Chief Quality Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule eMAR Barcode Verification Audit"
    },
    {
        "id": 1706,
        "keyword": "blood bank inventory management and cross-match expiration tracking telemetry for transfusion services",
        "slug": "blood-bank-inventory-management-and-cross-match-expiration-tracking-telemetry-for-transfusion-services",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Transfusion Medicine Directors & Blood Bank Quality Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Blood Bank Inventory Audit"
    },
    {
        "id": 1707,
        "keyword": "hospital bio-medical waste statutory tracking and pcb portal telemetry for environmental compliance",
        "slug": "hospital-bio-medical-waste-statutory-tracking-and-pcb-portal-telemetry-for-environmental-compliance",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Environmental Safety Directors & Hospital Facility Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bio-Medical Waste Audit"
    },

    # Cluster 2: Differential Privacy & Synthetic Health Data Telemetry (IDs 1708-1724, 17 items)
    {
        "id": 1708,
        "keyword": "differential privacy laplace mechanism epsilon-budget calibration telemetry for patient data",
        "slug": "differential-privacy-laplace-mechanism-epsilon-budget-calibration-telemetry-for-patient-data",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Data Privacy Officers & Healthcare Information Security Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Differential Privacy Audit"
    },
    {
        "id": 1709,
        "keyword": "k-anonymity and l-diversity quasi-identifier suppression telemetry for clinical trials",
        "slug": "k-anonymity-and-l-diversity-quasi-identifier-suppression-telemetry-for-clinical-trials",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Clinical Research Directors & Biostatistical Data Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule k-Anonymity Clinical Audit"
    },
    {
        "id": 1710,
        "keyword": "generative diffusion synthetic fhir patient cohort generation telemetry for medical research",
        "slug": "generative-diffusion-synthetic-fhir-patient-cohort-generation-telemetry-for-medical-research",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Medical AI Research Directors & Clinical Data Science Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synthetic Patient Data Audit"
    },
    {
        "id": 1711,
        "keyword": "fully homomorphic encryption fhe encrypted genomic query telemetry for precision oncology",
        "slug": "fully-homomorphic-encryption-fhe-encrypted-genomic-query-telemetry-for-precision-oncology",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Genomics Research Directors & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Genomic FHE Privacy Audit"
    },
    {
        "id": 1712,
        "keyword": "private vpc air-gapped clinical llm deployment telemetry for hospital trusts",
        "slug": "private-vpc-air-gapped-clinical-llm-deployment-telemetry-for-hospital-trusts",
        "category": "Solutions",
        "hub_category": "Sovereign AI Infrastructure",
        "target_persona": "Hospital Chief Information Officers & Enterprise Infrastructure VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Air-Gapped Clinical LLM Audit"
    },
    {
        "id": 1713,
        "keyword": "section 8 dpdp act 2023 sensitive personal data consent management telemetry for healthcare fiduciaries",
        "slug": "section-8-dpdp-act-2023-sensitive-personal-data-consent-management-telemetry-for-healthcare-fiduciaries",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Hospital Legal Counsels & Data Fiduciary Compliance Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DPDP Section 8 Audit"
    },
    {
        "id": 1714,
        "keyword": "cross-hospital federated learning and gradient privacy leakage defense telemetry for medical consortia",
        "slug": "cross-hospital-federated-learning-and-gradient-privacy-leakage-defense-telemetry-for-medical-consortia",
        "category": "Solutions",
        "hub_category": "Autonomous Systems & Optimization",
        "target_persona": "Healthcare Consortium Chairs & AI Research Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Federated Learning Privacy Audit"
    },
    {
        "id": 1715,
        "keyword": "electronic health record cryptographic de-identification and re-identification defense telemetry for clinical registries",
        "slug": "electronic-health-record-cryptographic-de-identification-and-re-identification-defense-telemetry-for-clinical-registries",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Clinical Registry Directors & Healthcare Security Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule EHR De-Identification Audit"
    },
    {
        "id": 1716,
        "keyword": "medical ai diagnostic model drift and clinical ground truth calibration telemetry for clinical pathology",
        "slug": "medical-ai-diagnostic-model-drift-and-clinical-ground-truth-calibration-telemetry-for-clinical-pathology",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Chief Medical Officers & Clinical AI Governance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Clinical Model Drift Audit"
    },
    {
        "id": 1717,
        "keyword": "hospital zero-trust network microsegmentation and medical device iot defense telemetry for biomedical engineering",
        "slug": "hospital-zero-trust-network-microsegmentation-and-medical-device-iot-defense-telemetry-for-biomedical-engineering",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Biomedical Engineering Directors & Hospital CISOs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Medical Device Zero-Trust Audit"
    },
    {
        "id": 1718,
        "keyword": "automated medical peer review and mortality committee dossier preparation telemetry for hospital governance",
        "slug": "automated-medical-peer-review-and-mortality-committee-dossier-preparation-telemetry-for-hospital-governance",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Medical Superintendents & Clinical Audit Committee Chairs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Peer Review Dossier Audit"
    },
    {
        "id": 1719,
        "keyword": "central sterile services department cssd autoclave cycle validation telemetry for surgical safety",
        "slug": "central-sterile-services-department-cssd-autoclave-cycle-validation-telemetry-for-surgical-safety",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "CSSD Managers & Surgical Quality Assurance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CSSD Autoclave Validation Audit"
    },
    {
        "id": 1720,
        "keyword": "intensive care unit icu multimodal vital signs telemetry and early septic shock alerts for critical care",
        "slug": "intensive-care-unit-icu-multimodal-vital-signs-telemetry-and-early-septic-shock-alerts-for-critical-care",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Critical Care Medicine Chairs & ICU Nursing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ICU Septic Shock Alert Audit"
    },
    {
        "id": 1721,
        "keyword": "organ transplant recipient matching and notto statutory registry sync telemetry for transplant institutes",
        "slug": "organ-transplant-recipient-matching-and-notto-statutory-registry-sync-telemetry-for-transplant-institutes",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Transplant Institute Directors & Clinical Coordination VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule NOTTO Registry Sync Audit"
    },
    {
        "id": 1722,
        "keyword": "hospital supply chain stent and orthopedic implant serial traceability telemetry for cath labs",
        "slug": "hospital-supply-chain-stent-and-orthopedic-implant-serial-traceability-telemetry-for-cath-labs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Cath Lab Directors & Hospital Procurement VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Implant Traceability Audit"
    },
    {
        "id": 1723,
        "keyword": "oncology tumor board multidisciplinary genomic report synthesis telemetry for cancer hospitals",
        "slug": "oncology-tumor-board-multidisciplinary-genomic-report-synthesis-telemetry-for-cancer-hospitals",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Medical Oncology Directors & Tumor Board Chairs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tumor Board Synthesis Audit"
    },
    {
        "id": 1724,
        "keyword": "radiation therapy linear accelerator dose verification and collision avoidance telemetry for medical physics",
        "slug": "radiation-therapy-linear-accelerator-dose-verification-and-collision-avoidance-telemetry-for-medical-physics",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Chief Medical Physicists & Radiation Oncology Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Linac Dose Verification Audit"
    },

    # Cluster 3: Indian Hospital Financial Operations & Corporate Billing Telemetry (IDs 1725-1740, 16 items)
    {
        "id": 1725,
        "keyword": "corporate tpa tariff package dispute defense and automated deduction reconciliation telemetry for hospital billing",
        "slug": "corporate-tpa-tariff-package-dispute-defense-and-automated-deduction-reconciliation-telemetry-for-hospital-billing",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Billing Controllers & TPA Relations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TPA Tariff Dispute Audit"
    },
    {
        "id": 1726,
        "keyword": "hospital patient billing unbilled line item leak detection and charge capture telemetry for hospital controllers",
        "slug": "hospital-patient-billing-unbilled-line-item-leak-detection-and-charge-capture-telemetry-for-hospital-controllers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Revenue Cycle VPs & Financial Audit Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Charge Capture Leak Audit"
    },
    {
        "id": 1727,
        "keyword": "cashless insurance dispute arbitration and ombudsman claim dossier telemetry for medical grievance cells",
        "slug": "cashless-insurance-dispute-arbitration-and-ombudsman-claim-dossier-telemetry-for-medical-grievance-cells",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Legal Grievance Directors & Insurance Claim Arbitrators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Insurance Arbitration Audit"
    },
    {
        "id": 1728,
        "keyword": "hospital doctor fee share calculation and specialty revenue split telemetry for accounting controllers",
        "slug": "hospital-doctor-fee-share-calculation-and-specialty-revenue-split-telemetry-for-accounting-controllers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Chief Financial Officers & Medical Accounting Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Doctor Share Accounting Audit"
    },
    {
        "id": 1729,
        "keyword": "nabh statutory medical gas pipeline system mgps pressure telemetry for hospital engineering",
        "slug": "nabh-statutory-medical-gas-pipeline-system-mgps-pressure-telemetry-for-hospital-engineering",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Biomedical Engineers & Facility Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MGPS Gas Pressure Audit"
    },
    {
        "id": 1730,
        "keyword": "hospital biomedical equipment preventive maintenance and uptime sla telemetry for clinical engineering",
        "slug": "hospital-biomedical-equipment-preventive-maintenance-and-uptime-sla-telemetry-for-clinical-engineering",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Biomedical Maintenance Directors & Hospital Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Equipment Uptime Audit"
    },
    {
        "id": 1731,
        "keyword": "ayushman bharat arogya mitra kiosk automated patient onboarding telemetry for public health clinics",
        "slug": "ayushman-bharat-arogya-mitra-kiosk-automated-patient-onboarding-telemetry-for-public-health-clinics",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Public Health Program Directors & Hospital Outpatient Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Arogya Mitra Onboarding Audit"
    },
    {
        "id": 1732,
        "keyword": "hospital cafeteria dietetics nutrition calculation and allergen defense telemetry for patient services",
        "slug": "hospital-cafeteria-dietetics-nutrition-calculation-and-allergen-defense-telemetry-for-patient-services",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Clinical Nutrition Directors & Hospital Food Service Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Clinical Nutrition Audit"
    },
    {
        "id": 1733,
        "keyword": "clinical trial adverse event reporting and cdsco regulatory e-filing telemetry for pharma sponsors",
        "slug": "clinical-trial-adverse-event-reporting-and-cdsco-regulatory-e-filing-telemetry-for-pharma-sponsors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharmacovigilance Directors & Clinical Regulatory VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CDSCO Regulatory Filing Audit"
    },
    {
        "id": 1734,
        "keyword": "hospital ambulatory ambulance fleet gps dispatch and emergency en-route telemetry for trauma networks",
        "slug": "hospital-ambulatory-ambulance-fleet-gps-dispatch-and-emergency-en-route-telemetry-for-trauma-networks",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Emergency Transport Directors & Ambulance Fleet Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Ambulance Fleet Dispatch Audit"
    },
    {
        "id": 1735,
        "keyword": "inpatient room turnover housekeeping notification and bed sanitation telemetry for ward managers",
        "slug": "inpatient-room-turnover-housekeeping-notification-and-bed-sanitation-telemetry-for-ward-managers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Housekeeping Directors & Inpatient Ward Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bed Sanitation Turnover Audit"
    },
    {
        "id": 1736,
        "keyword": "medical record department mrd physical paper archive digitization and ocr indexing telemetry",
        "slug": "medical-record-department-mrd-physical-paper-archive-digitization-and-ocr-indexing-telemetry",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Medical Records Officers & Healthcare Digitization VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MRD Archive Digitization Audit"
    },
    {
        "id": 1737,
        "keyword": "hospital pharmacy cold chain temperature sensor and insulin integrity telemetry for hospital pharmacists",
        "slug": "hospital-pharmacy-cold-chain-temperature-sensor-and-insulin-integrity-telemetry-for-hospital-pharmacists",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Chief Hospital Pharmacists & Cold Chain Compliance Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pharmacy Cold Chain Audit"
    },
    {
        "id": 1738,
        "keyword": "corporate wellness executive health checkup automated narrative synthesis telemetry for corporate clinics",
        "slug": "corporate-wellness-executive-health-checkup-automated-narrative-synthesis-telemetry-for-corporate-clinics",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Preventive Health Directors & Executive Wellness Clinic Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Executive Health Checkup Audit"
    },
    {
        "id": 1739,
        "keyword": "hospital biohazard spill containment alert and automated housekeeping routing telemetry for infection control",
        "slug": "hospital-biohazard-spill-containment-alert-and-automated-housekeeping-routing-telemetry-for-infection-control",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Infection Control Officers & Hospital Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Infection Control Spill Audit"
    },
    {
        "id": 1740,
        "keyword": "private hospital statutory clinical establishment act registration renewal telemetry for legal fiduciaries",
        "slug": "private-hospital-statutory-clinical-establishment-act-registration-renewal-telemetry-for-legal-fiduciaries",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Hospital Legal Counsels & Healthcare Regulatory Affairs VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Clinical Establishment Act Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 37 COMMERCIAL KEYWORDS (IDs 1,691 to 1,740)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}
    existing_slugs = {item["slug"] for item in data}

    added_count = 0
    for kw in KEYWORDS_WAVE37:
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
