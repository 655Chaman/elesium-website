#!/usr/bin/env python3
"""
Ingests Wave 38 commercial keywords (IDs 1,741 to 1,790, 50 solutions)
into automation/compact_keywords_queue.json.
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE38 = [
    # Cluster 1: Pharmaceutical Manufacturing, CDSCO 21 CFR Part 11 eBMR & LIMS Telemetry (IDs 1741-1757, 17 items)
    {
        "id": 1741,
        "keyword": "us fda 21 cfr part 11 electronic batch record validation telemetry for pharmaceutical plants",
        "slug": "us-fda-21-cfr-part-11-electronic-batch-record-validation-telemetry-for-pharmaceutical-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharmaceutical Plant Directors & Quality Assurance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule 21 CFR Part 11 Architecture Audit"
    },
    {
        "id": 1742,
        "keyword": "cdsco schedule m computerized system validation csv telemetry for formulation manufacturers",
        "slug": "cdsco-schedule-m-computerized-system-validation-csv-telemetry-for-formulation-manufacturers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Formulation Plant Heads & Regulatory Compliance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CDSCO CSV Compliance Audit"
    },
    {
        "id": 1743,
        "keyword": "waters empower 3 chromatography data system cds audit trail telemetry for analytical quality labs",
        "slug": "waters-empower-3-chromatography-data-system-cds-audit-trail-telemetry-for-analytical-quality-labs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Analytical Chemistry Heads & Quality Control Laboratory Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Waters Empower Audit Trail Audit"
    },
    {
        "id": 1744,
        "keyword": "thermo chromeleon cds baseline peak reintegration deviation telemetry for quality control managers",
        "slug": "thermo-chromeleon-cds-baseline-peak-reintegration-deviation-telemetry-for-quality-control-managers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Quality Control Managers & Chromatography Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Peak Reintegration Deviation Audit"
    },
    {
        "id": 1745,
        "keyword": "hplc out of specification oos investigation automated dossier synthesis telemetry for qc managers",
        "slug": "hplc-out-of-specification-oos-investigation-automated-dossier-synthesis-telemetry-for-qc-managers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "QC Laboratory Managers & Regulatory Filing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule OOS Investigation Telemetry Audit"
    },
    {
        "id": 1746,
        "keyword": "gamp 5 second edition electronic signature pki verification telemetry for life sciences plants",
        "slug": "gamp-5-second-edition-electronic-signature-pki-verification-telemetry-for-life-sciences-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Life Sciences Plant Directors & Validation Engineering Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GAMP 5 PKI Verification Audit"
    },
    {
        "id": 1747,
        "keyword": "pharmaceutical sterile injectable cleanroom particle counter telemetry for aseptic manufacturing suites",
        "slug": "pharmaceutical-sterile-injectable-cleanroom-particle-counter-telemetry-for-aseptic-manufacturing-suites",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Aseptic Processing Heads & Sterile Formulation Plant Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cleanroom Particle Counter Telemetry Audit"
    },
    {
        "id": 1748,
        "keyword": "fluid bed dryer inlet air temperature and humidity scada telemetry for solid oral dosage plants",
        "slug": "fluid-bed-dryer-inlet-air-temperature-and-humidity-scada-telemetry-for-solid-oral-dosage-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Granulation Supervisors & Solid Oral Dosage Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fluid Bed Dryer SCADA Audit"
    },
    {
        "id": 1749,
        "keyword": "rotary tablet press compression force and hardness monitoring telemetry for pharmaceutical operators",
        "slug": "rotary-tablet-press-compression-force-and-hardness-monitoring-telemetry-for-pharmaceutical-operators",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Tablet Compression Heads & Plant Engineering Supervisors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tablet Press Compression Telemetry Audit"
    },
    {
        "id": 1750,
        "keyword": "automated dissolution testing bath uv spectrophotometer telemetry for formulation release scientists",
        "slug": "automated-dissolution-testing-bath-uv-spectrophotometer-telemetry-for-formulation-release-scientists",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Formulation Release Scientists & R&D Analytical Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Dissolution Bath Telemetry Audit"
    },
    {
        "id": 1751,
        "keyword": "labware lims stability study protocol and pull schedule telemetry for pharmaceutical qc directors",
        "slug": "labware-lims-stability-study-protocol-and-pull-schedule-telemetry-for-pharmaceutical-qc-directors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Stability Study Heads & QC Laboratory Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule LabWare LIMS Stability Telemetry Audit"
    },
    {
        "id": 1752,
        "keyword": "starlims sample chain of custody and raw analytical data archival telemetry for pharma fiduciaries",
        "slug": "starlims-sample-chain-of-custody-and-raw-analytical-data-archival-telemetry-for-pharma-fiduciaries",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharma Compliance Officers & Quality Assurance General Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule STARLIMS Chain of Custody Audit"
    },
    {
        "id": 1753,
        "keyword": "us fda form 483 response dossier and capa root cause telemetry for life sciences legal counsel",
        "slug": "us-fda-form-483-response-dossier-and-capa-root-cause-telemetry-for-life-sciences-legal-counsel",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Life Sciences General Counsels & Regulatory Affairs Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Form 483 CAPA Response Audit"
    },
    {
        "id": 1754,
        "keyword": "qualified person qp commercial batch release decision telemetry for european gmp export hubs",
        "slug": "qualified-person-qp-commercial-batch-release-decision-telemetry-for-european-gmp-export-hubs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Qualified Persons & European Regulatory Affairs Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule QP Batch Release Architecture Audit"
    },
    {
        "id": 1755,
        "keyword": "pharmaceutical microbiology bioburden and endotoxin lals testing telemetry for sterile facilities",
        "slug": "pharmaceutical-microbiology-bioburden-and-endotoxin-lals-testing-telemetry-for-sterile-facilities",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Microbiology Laboratory Heads & Sterile Production Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Microbiology Bioburden Telemetry Audit"
    },
    {
        "id": 1756,
        "keyword": "master formula record mfr version control and recipe change authorization telemetry for plant heads",
        "slug": "master-formula-record-mfr-version-control-and-recipe-change-authorization-telemetry-for-plant-heads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Formulation Plant Heads & Technical Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Master Formula Record Telemetry Audit"
    },
    {
        "id": 1757,
        "keyword": "water for injection wfi total organic carbon toc and conductivity telemetry for sterile plants",
        "slug": "water-for-injection-wfi-total-organic-carbon-toc-and-conductivity-telemetry-for-sterile-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Sterile Utility Engineers & Plant Maintenance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule WFI TOC Conductivity Telemetry Audit"
    },

    # Cluster 2: API Synthesis, Cold Chain Stability & Cleanroom HVAC Telemetry (IDs 1758-1774, 17 items)
    {
        "id": 1758,
        "keyword": "active pharmaceutical ingredient api chemical reactor batch synthesis telemetry for bulk drug plants",
        "slug": "active-pharmaceutical-ingredient-api-chemical-reactor-batch-synthesis-telemetry-for-bulk-drug-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "API Manufacturing Directors & Chemical Process Engineering Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule API Chemical Reactor Telemetry Audit"
    },
    {
        "id": 1759,
        "keyword": "polymorphic crystallization process analytical technology pat raman telemetry for api synthesis",
        "slug": "polymorphic-crystallization-process-analytical-technology-pat-raman-telemetry-for-api-synthesis",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Crystallization Scientists & Bulk Drug Synthesis VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PAT Raman Crystallization Audit"
    },
    {
        "id": 1760,
        "keyword": "solvent recovery column gas chromatography head-space telemetry for environmental compliance",
        "slug": "solvent-recovery-column-gas-chromatography-head-space-telemetry-for-environmental-compliance",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Environmental Health & Safety Directors & Chemical Plant Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Solvent Recovery Telemetry Audit"
    },
    {
        "id": 1761,
        "keyword": "clean-in-place cip and sterilization-in-place sip validation telemetry for bioreactor suites",
        "slug": "clean-in-place-cip-and-sterilization-in-place-sip-validation-telemetry-for-bioreactor-suites",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Biopharmaceutical Operations Heads & Process Validation Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CIP/SIP Validation Telemetry Audit"
    },
    {
        "id": 1762,
        "keyword": "pharmaceutical cold chain vaccine warehouse multi-point iot temperature telemetry for logistics hubs",
        "slug": "pharmaceutical-cold-chain-vaccine-warehouse-multi-point-iot-temperature-telemetry-for-logistics-hubs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharma Cold Chain Logistics Directors & Distribution VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cold Chain IoT Telemetry Audit"
    },
    {
        "id": 1763,
        "keyword": "biologic monoclonal antibody mab harvest chromatography column pressure telemetry for biopharma suites",
        "slug": "biologic-monoclonal-antibody-mab-harvest-chromatography-column-pressure-telemetry-for-biopharma-suites",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Bioprocess Development Heads & Biopharmaceutical Plant Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Biologic Harvest Telemetry Audit"
    },
    {
        "id": 1764,
        "keyword": "lyophilizer freeze dryer shelf temperature and chamber vacuum scada telemetry for injectable plants",
        "slug": "lyophilizer-freeze-dryer-shelf-temperature-and-chamber-vacuum-scada-telemetry-for-injectable-plants",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Lyophilization Supervisors & Injectable Production Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Lyophilizer SCADA Telemetry Audit"
    },
    {
        "id": 1765,
        "keyword": "continuous blending loss-in-weight feeder rate telemetry for continuous pharmaceutical manufacturing",
        "slug": "continuous-blending-loss-in-weight-feeder-rate-telemetry-for-continuous-pharmaceutical-manufacturing",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Continuous Manufacturing Directors & Process Engineering VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Continuous Manufacturing Telemetry Audit"
    },
    {
        "id": 1766,
        "keyword": "high-shear wet granulation impeller torque and power consumption telemetry for solid oral suites",
        "slug": "high-shear-wet-granulation-impeller-torque-and-power-consumption-telemetry-for-solid-oral-suites",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Solid Dose Formulation Supervisors & Production Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wet Granulation Telemetry Audit"
    },
    {
        "id": 1767,
        "keyword": "pharmaceutical blister packaging pinhole leak detector visual ai telemetry for packaging lines",
        "slug": "pharmaceutical-blister-packaging-pinhole-leak-detector-visual-ai-telemetry-for-packaging-lines",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Packaging Operations Heads & Quality Control Supervisors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Blister Packaging AI Telemetry Audit"
    },
    {
        "id": 1768,
        "keyword": "hvac air handling unit ahu hepa filter differential pressure telemetry for gmp cleanroom corridors",
        "slug": "hvac-air-handling-unit-ahu-hepa-filter-differential-pressure-telemetry-for-gmp-cleanroom-corridors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Cleanroom HVAC Engineers & Facility Maintenance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cleanroom HVAC Telemetry Audit"
    },
    {
        "id": 1769,
        "keyword": "differential scanning calorimetry dsc glass transition telemetry for solid dispersion formulations",
        "slug": "differential-scanning-calorimetry-dsc-glass-transition-telemetry-for-solid-dispersion-formulations",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pre-Formulation Scientists & Solid State Chemistry Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DSC Solid State Telemetry Audit"
    },
    {
        "id": 1770,
        "keyword": "powder x-ray diffraction pxrd crystalline purity telemetry for generic drug patent defense",
        "slug": "powder-x-ray-diffraction-pxrd-crystalline-purity-telemetry-for-generic-drug-patent-defense",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Patent Litigation Heads & Generic R&D Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PXRD Patent Defense Telemetry Audit"
    },
    {
        "id": 1771,
        "keyword": "sterile ampoule optical inspection particulate detection visual telemetry for parenteral packaging",
        "slug": "sterile-ampoule-optical-inspection-particulate-detection-visual-telemetry-for-parenteral-packaging",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Parenteral Packaging Directors & Quality Assurance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Ampoule Optical Inspection Audit"
    },
    {
        "id": 1772,
        "keyword": "gas chromatography residual solvent headspace extraction telemetry for regulatory compliance files",
        "slug": "gas-chromatography-residual-solvent-headspace-extraction-telemetry-for-regulatory-compliance-files",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Analytical R&D Heads & Regulatory Filing Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Residual Solvent GC Telemetry Audit"
    },
    {
        "id": 1773,
        "keyword": "pharmaceutical effluent treatment plant etp biological oxygen demand telemetry for green compliance",
        "slug": "pharmaceutical-effluent-treatment-plant-etp-biological-oxygen-demand-telemetry-for-green-compliance",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharma EHS Directors & Corporate Sustainability Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pharma ETP Telemetry Audit"
    },
    {
        "id": 1774,
        "keyword": "pharma cleanroom air velocity and laminar flow hood smoke test telemetry for nabh accreditation",
        "slug": "pharma-cleanroom-air-velocity-and-laminar-flow-hood-smoke-test-telemetry-for-nabh-accreditation",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Cleanroom Validation Specialists & Hospital Pharmacy Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Laminar Flow Hood Telemetry Audit"
    },

    # Cluster 3: Indian Pharma Supply Chain, Traceability & Regulatory Dossier Telemetry (IDs 1775-1790, 16 items)
    {
        "id": 1775,
        "keyword": "gs1 dsgsa compliant pharmaceutical 2d datamatrix barcode serialization telemetry for export hubs",
        "slug": "gs1-dsgsa-compliant-pharmaceutical-2d-datamatrix-barcode-serialization-telemetry-for-export-hubs",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Serialization Directors & Export Packaging Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GS1 Serialization Architecture Audit"
    },
    {
        "id": 1776,
        "keyword": "cdsco mandatory qr code api tracking on top 300 drug brands telemetry for domestic distributors",
        "slug": "cdsco-mandatory-qr-code-api-tracking-on-top-300-drug-brands-telemetry-for-domestic-distributors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Domestic Sales VPs & Pharmaceutical Distribution Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CDSCO QR Code Tracking Audit"
    },
    {
        "id": 1777,
        "keyword": "electronic common technical document ectd module 3 quality dossier automated assembly telemetry",
        "slug": "electronic-common-technical-document-ectd-module-3-quality-dossier-automated-assembly-telemetry",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Regulatory Affairs VPs & Dossier Compilation Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule eCTD Module 3 Assembly Audit"
    },
    {
        "id": 1778,
        "keyword": "pharmaceutical pharmacovigilance individual case safety report icsr automated triage telemetry",
        "slug": "pharmaceutical-pharmacovigilance-individual-case-safety-report-icsr-automated-triage-telemetry",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharmacovigilance Heads & Medical Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pharmacovigilance ICSR Triage Audit"
    },
    {
        "id": 1779,
        "keyword": "periodic safety update report psur automated aggregate synthesis telemetry for life sciences heads",
        "slug": "periodic-safety-update-report-psur-automated-aggregate-synthesis-telemetry-for-life-sciences-heads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Drug Safety VPs & Medical Affairs Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PSUR Aggregate Synthesis Audit"
    },
    {
        "id": 1780,
        "keyword": "active substance master file asmf confidential section encryption telemetry for bulk drug makers",
        "slug": "active-substance-master-file-asmf-confidential-section-encryption-telemetry-for-bulk-drug-makers",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "API Technical Directors & IP Legal Counsels",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ASMF Encryption Architecture Audit"
    },
    {
        "id": 1781,
        "keyword": "pharmaceutical raw material vendor qualification and coa discrepancy telemetry for procurement heads",
        "slug": "pharmaceutical-raw-material-vendor-qualification-and-coa-discrepancy-telemetry-for-procurement-heads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Pharma Procurement Heads & Quality Assurance VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CoA Discrepancy Telemetry Audit"
    },
    {
        "id": 1782,
        "keyword": "pharmaceutical warehouse good distribution practice gdp mapping telemetry for regional distribution",
        "slug": "pharmaceutical-warehouse-good-distribution-practice-gdp-mapping-telemetry-for-regional-distribution",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Supply Chain Operations VPs & GDP Compliance Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GDP Mapping Telemetry Audit"
    },
    {
        "id": 1783,
        "keyword": "clinical trial electronic data capture edc data lock and query resolution telemetry for pharma cro",
        "slug": "clinical-trial-electronic-data-capture-edc-data-lock-and-query-resolution-telemetry-for-pharma-cro",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Clinical Operations Heads & CRO Managing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule EDC Query Resolution Audit"
    },
    {
        "id": 1784,
        "keyword": "pharmaceutical contract manufacturing organization cmo tech transfer telemetry for brand owners",
        "slug": "pharmaceutical-contract-manufacturing-organization-cmo-tech-transfer-telemetry-for-brand-owners",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Tech Transfer Heads & CMO Alliance Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CMO Tech Transfer Telemetry Audit"
    },
    {
        "id": 1785,
        "keyword": "pharma product recall simulation and distribution reconciliation telemetry for corporate directors",
        "slug": "pharma-product-recall-simulation-and-distribution-reconciliation-telemetry-for-corporate-directors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Chief Risk Officers & Quality Governance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Product Recall Simulation Audit"
    },
    {
        "id": 1786,
        "keyword": "indian pharmacopoeia ip monograph compliance and analytical test mapping telemetry for qc teams",
        "slug": "indian-pharmacopoeia-ip-monograph-compliance-and-analytical-test-mapping-telemetry-for-qc-teams",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Quality Control Managers & Analytical Chemistry Supervisors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IP Monograph Compliance Audit"
    },
    {
        "id": 1787,
        "keyword": "pharma cleanroom environmental monitoring em microbial air sampler telemetry for microbiology heads",
        "slug": "pharma-cleanroom-environmental-monitoring-em-microbial-air-sampler-telemetry-for-microbiology-heads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Environmental Monitoring Heads & Microbiology QA VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cleanroom EM Telemetry Audit"
    },
    {
        "id": 1788,
        "keyword": "pharmaceutical continuous process verification cpv statistical control chart telemetry for qa heads",
        "slug": "pharmaceutical-continuous-process-verification-cpv-statistical-control-chart-telemetry-for-qa-heads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Process Verification VPs & Quality Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CPV Statistical Chart Telemetry Audit"
    },
    {
        "id": 1789,
        "keyword": "pharma equipment qualification iq oq pq automated protocol generation telemetry for validation leads",
        "slug": "pharma-equipment-qualification-iq-oq-pq-automated-protocol-generation-telemetry-for-validation-leads",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Validation Engineering Leads & Plant Commissioning Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IQ OQ PQ Protocol Telemetry Audit"
    },
    {
        "id": 1790,
        "keyword": "pharmaceutical annual product quality review apqr automated synthesis telemetry for plant directors",
        "slug": "pharmaceutical-annual-product-quality-review-apqr-automated-synthesis-telemetry-for-plant-directors",
        "category": "Solutions",
        "hub_category": "Healthcare & Regulated Systems",
        "target_persona": "Plant Directors & Senior Quality Assurance Executives",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule APQR Automated Synthesis Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 38 COMMERCIAL KEYWORDS (IDs 1,741 to 1,790)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}
    existing_slugs = {item["slug"] for item in data}

    added_count = 0
    for kw in KEYWORDS_WAVE38:
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
