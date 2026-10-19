#!/usr/bin/env python3
"""
ingest_wave3_keywords.py — Ingest 50 Wave 3 High-Lever Commercial BOFU Keywords
================================================================================
Target: automation/compact_keywords_queue.json
Framework: Edward Sturm Complete Masterclass (Discovery & Keyword Selection)

Expands coverage into 5 high-margin enterprise verticals:
1. GovTech & Sovereign Defense (Air-gapped extraction, ITAR auditing, tender analysis)
2. Aerospace & Avionics (FOQA telemetry, DO-178C verification, satellite collision)
3. Renewable Energy & Power Grid (BESS dispatch, wind gearbox vibration, dynamic line rating)
4. Heavy Industrial & Mining (Autonomous haulage, flotation reagents, blast furnace)
5. Enterprise Cybersecurity & Cloud Infrastructure (Post-quantum certs, FinOps, eBPF zero trust)

Scales total solutions from 51 to 101.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
QUEUE_PATH = BASE_DIR / "automation" / "compact_keywords_queue.json"

WAVE_3_KEYWORDS = [
    # -------------------------------------------------------------------------
    # Vertical 1: GovTech & Sovereign Defense (10 keywords)
    # -------------------------------------------------------------------------
    {
        "keyword": "air-gapped intelligence extraction software for defense agencies",
        "slug": "air-gapped-intelligence-extraction-software-for-defense-agencies",
        "key_benefit": "Sub-Second Classified Document De-Identification & Entity Extraction",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Defense Intelligence Directors & Air-Gapped Systems Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Defense Air-Gapped Pipeline"
    },
    {
        "keyword": "defense supply chain ITAR compliance auditing agents for contractors",
        "slug": "defense-supply-chain-itar-compliance-auditing-agents-for-contractors",
        "key_benefit": "Automated Munitions List Verification & Flowdown Auditing",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Defense Contractor Compliance VPs & Trade Security Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ITAR Compliance Audit"
    },
    {
        "keyword": "government procurement tender anomaly detection software for auditors",
        "slug": "government-procurement-tender-anomaly-detection-software-for-auditors",
        "key_benefit": "Statutory Bid-Rigging & Collusion Detection State Machines",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Public Sector Auditors & Government Comptroller Generals",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Procurement Anomaly Demo"
    },
    {
        "keyword": "sovereign biometric border control telemetry agents for immigration heads",
        "slug": "sovereign-biometric-border-control-telemetry-agents-for-immigration-heads",
        "key_benefit": "Sub-100ms Traveler Verification & Multi-Modal Matching",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Immigration Authorities & Port Security Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Biometric Border Telemetry"
    },
    {
        "keyword": "critical infrastructure SCADA cybersecurity containment agents for utilities",
        "slug": "critical-infrastructure-scada-cybersecurity-containment-agents-for-utilities",
        "key_benefit": "Air-Gapped PLC Anomaly Isolation & Zero-Downtime Defense",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Utility CISO & Power Grid Infrastructure Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SCADA Containment Audit"
    },
    {
        "keyword": "classified document redaction state machines for intelligence services",
        "slug": "classified-document-redaction-state-machines-for-intelligence-services",
        "key_benefit": "Mathematical Zero-Leakage PII & Classified Entity Redaction",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Intelligence Operations Leads & Declassification Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Test Classified Redaction Engine"
    },
    {
        "keyword": "naval fleet maintenance predictive telemetry engines for shipyard commanders",
        "slug": "naval-fleet-maintenance-predictive-telemetry-engines-for-shipyard-commanders",
        "key_benefit": "Real-Time Hull Vibration & Propulsion Degradation Modeling",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Naval Systems Engineers & Shipyard Operations Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Naval Telemetry Scope"
    },
    {
        "keyword": "defense weapon system BOM obsolescence tracking agents for military OEMs",
        "slug": "defense-weapon-system-bom-obsolescence-tracking-agents-for-military-oems",
        "key_benefit": "Predictive Diminishing Manufacturing Sources & Material Shortages",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Defense OEM Supply Chain Directors & Program Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Defense BOM Obsolescence"
    },
    {
        "keyword": "municipal public works budget variance reconciliation software for mayors",
        "slug": "municipal-public-works-budget-variance-reconciliation-software-for-mayors",
        "key_benefit": "Automated Infrastructure Capital Expenditure Reconciliation",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "City Treasurers & Municipal Financial Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Municipal Public Works"
    },
    {
        "keyword": "government pension fund statutory disbursement audit agents for fiduciaries",
        "slug": "government-pension-fund-statutory-disbursement-audit-agents-for-fiduciaries",
        "key_benefit": "Sub-200ms Benefit Calculation & Ghost Beneficiary Elimination",
        "category": "Solutions",
        "hub_category": "GovTech & Sovereign Defense",
        "target_persona": "Pension Fund Trustees & Actuarial Governance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pension Audit Demo"
    },

    # -------------------------------------------------------------------------
    # Vertical 2: Aerospace & Avionics (10 keywords)
    # -------------------------------------------------------------------------
    {
        "keyword": "flight data recorder FOQA anomaly detection software for airlines",
        "slug": "flight-data-recorder-foqa-anomaly-detection-software-for-airlines",
        "key_benefit": "Sub-Second Flight Operational Quality Assurance Anomaly Triage",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Airline Safety Directors & Flight Operations Quality Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit FOQA Telemetry Pipeline"
    },
    {
        "keyword": "commercial avionics DO-178C statutory verification state machines for OEMs",
        "slug": "commercial-avionics-do-178c-statutory-verification-state-machines-for-oems",
        "key_benefit": "Automated Software Airworthiness & Formal Verification Bounds",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Avionics Chief Engineers & FAA Certification Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DO-178C Architecture Review"
    },
    {
        "keyword": "satellite constellation orbital telemetry collision avoidance agents",
        "slug": "satellite-constellation-orbital-telemetry-collision-avoidance-agents",
        "key_benefit": "Automated Conjunction Assessment & Thruster Burn Optimization",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Satellite Operations Directors & Space Domain Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Orbital Telemetry Demo"
    },
    {
        "keyword": "jet engine turbine blade acoustic defect inspection systems for MRO",
        "slug": "jet-engine-turbine-blade-acoustic-defect-inspection-systems-for-mro",
        "key_benefit": "Sub-Millimeter High-Cycle Fatigue Anomaly Isolation",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Aviation MRO Quality Directors & Turbine Propulsion Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Turbine Blade Inspection"
    },
    {
        "keyword": "drone fleet BVLOS mission planning agents for cargo operators",
        "slug": "drone-fleet-bvlos-mission-planning-agents-for-cargo-operators",
        "key_benefit": "Dynamic UTM Deconfliction & Weather Airspace Routing",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Commercial Drone Operations VPs & Autonomous Aviation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Drone BVLOS Architecture Audit"
    },
    {
        "keyword": "aircraft turnaround ground support equipment dispatch engines for airports",
        "slug": "aircraft-turnaround-ground-support-equipment-dispatch-engines-for-airports",
        "key_benefit": "Real-Time Ramp Asset Optimization & Turnaround Delay Minimization",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Airport Ramp Operations Directors & Station Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Airport Ramp Dispatch"
    },
    {
        "keyword": "commercial airline crew scheduling agents for FAA compliance leads",
        "slug": "commercial-airline-crew-scheduling-agents-for-faa-compliance-leads",
        "key_benefit": "Automated Part 117 Flight Duty Period & Rest Norm Verification",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Crew Scheduling Operations Directors & Airline VP of Ops",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Crew Compliance Review"
    },
    {
        "keyword": "spacecraft payload thermal telemetry monitoring state machines for ISS",
        "slug": "spacecraft-payload-thermal-telemetry-monitoring-state-machines-for-iss",
        "key_benefit": "Sub-50ms Excursion Alerting & Automated Radiator Trimming",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Payload Operations Directors & Thermal Flight Controllers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Spacecraft Payload Telemetry"
    },
    {
        "keyword": "aircraft component MRO lifecycle predictive maintenance agents for fleets",
        "slug": "aircraft-component-mro-lifecycle-predictive-maintenance-agents-for-fleets",
        "key_benefit": "Deterministic Remainder Useful Life & Spare Parts Staging",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Commercial Airline Fleet Directors & Material Planners",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MRO Predictive Audit"
    },
    {
        "keyword": "commercial airport runway foreign object debris radar classification agents",
        "slug": "commercial-airport-runway-foreign-object-debris-radar-classification-agents",
        "key_benefit": "Sub-Second FMCW Radar Sensor Triage & Runway Strike Prevention",
        "category": "Solutions",
        "hub_category": "Aerospace & Avionics",
        "target_persona": "Airport Airfield Operations Directors & Safety Inspectors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Runway FOD Radar System"
    },

    # -------------------------------------------------------------------------
    # Vertical 3: Renewable Energy & Power Grid (10 keywords)
    # -------------------------------------------------------------------------
    {
        "keyword": "renewable microgrid battery energy storage dispatch state machines",
        "slug": "renewable-microgrid-battery-energy-storage-dispatch-state-machines",
        "key_benefit": "Sub-50ms Frequency Response & Peak Shaving Arbitrage",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "BESS Project Directors & Renewable Asset Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit BESS Microgrid Dispatch"
    },
    {
        "keyword": "wind turbine gearbox vibration anomaly detection agents for wind farms",
        "slug": "wind-turbine-gearbox-vibration-anomaly-detection-agents-for-wind-farms",
        "key_benefit": "Acoustic Telemetry Bearing Failure Prediction & Pitch Control",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Wind Asset Operations VPs & Mechanical Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wind Gearbox Telemetry Audit"
    },
    {
        "keyword": "solar PV inverter degradation and thermal fault detectors for utilities",
        "slug": "solar-pv-inverter-degradation-and-thermal-fault-detectors-for-utilities",
        "key_benefit": "Automated String Level IV Curve Telemetry & Soiling Auditing",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Solar Plant Operations Directors & Utility Fleet Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Solar Inverter Telemetry"
    },
    {
        "keyword": "high-voltage transmission line dynamic line rating agents for ISOs",
        "slug": "high-voltage-transmission-line-dynamic-line-rating-agents-for-isos",
        "key_benefit": "Real-Time Thermal Capacity Optimization & Congestion Relief",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Transmission Grid Operators & Power System Planning Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Dynamic Line Rating Demo"
    },
    {
        "keyword": "substation SCADA cyber-physical intrusion isolation software for grid ops",
        "slug": "substation-scada-cyber-physical-intrusion-isolation-software-for-grid-ops",
        "key_benefit": "IEC 61850 Packet Anomaly Triage & Automated Air-Gapped Tripping",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Electric Utility CISOs & Substation Protection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Grid Cyber-Physical Audit"
    },
    {
        "keyword": "electricity spot market day-ahead algorithmic bidding engines for IPP",
        "slug": "electricity-spot-market-day-ahead-algorithmic-bidding-engines-for-ipp",
        "key_benefit": "Deterministic Price Forecasting & LMP Nodal Optimization",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Independent Power Producer Energy Traders & Portfolio Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Energy Bidding Engine"
    },
    {
        "keyword": "EV charging station load balancing state machines for fleet depots",
        "slug": "ev-charging-station-load-balancing-state-machines-for-fleet-depots",
        "key_benefit": "Dynamic Transformer Capacity Guardrails & Peak Demand Limiting",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Commercial EV Fleet Directors & Infrastructure Operators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule EV Depot Load Balancing Audit"
    },
    {
        "keyword": "hydroelectric turbine cavitation telemetry monitoring agents for dams",
        "slug": "hydroelectric-turbine-cavitation-telemetry-monitoring-agents-for-dams",
        "key_benefit": "High-Frequency Hydrophone Acoustics & Runner Life Maximization",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Hydroelectric Plant Superintendents & Hydraulic Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Hydro Cavitation Acoustics"
    },
    {
        "keyword": "carbon credit statutory verification telemetry audit engines for ESG",
        "slug": "carbon-credit-statutory-verification-telemetry-audit-engines-for-esg",
        "key_benefit": "Verifiable Article 6 MRV Proof & Satellite Flux Monitoring",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Chief Sustainability Officers & Carbon Fund Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Carbon Verification Audit"
    },
    {
        "keyword": "nuclear auxiliary cooling predictive telemetry agents for plant engineers",
        "slug": "nuclear-auxiliary-cooling-predictive-telemetry-agents-for-plant-engineers",
        "key_benefit": "NRC Regulatory Margin Assurance & Cavitation Prediction",
        "category": "Solutions",
        "hub_category": "Renewable Energy & Power Grid",
        "target_persona": "Nuclear Engineering Directors & Safety System Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Nuclear Telemetry Audit"
    },

    # -------------------------------------------------------------------------
    # Vertical 4: Heavy Industrial & Mining (10 keywords)
    # -------------------------------------------------------------------------
    {
        "keyword": "open-pit autonomous haul truck dispatch engines for mining cos",
        "slug": "open-pit-autonomous-haul-truck-dispatch-engines-for-mining-cos",
        "key_benefit": "Sub-Second Dynamic Shovel Matching & Cycle Time Compression",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Mine Operations Directors & Autonomous Haulage Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Open-Pit Haulage Dispatch"
    },
    {
        "keyword": "mineral processing flotation circuit reagent dosing agents for smelters",
        "slug": "mineral-processing-flotation-circuit-reagent-dosing-agents-for-smelters",
        "key_benefit": "Real-Time Vision Froth Telemetry & Chemical Recovery Lift",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Metallurgical Superintendents & Mineral Processing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Flotation Circuit Audit"
    },
    {
        "keyword": "blast furnace thermal anomaly detection software for steelmakers",
        "slug": "blast-furnace-thermal-anomaly-detection-software-for-steelmakers",
        "key_benefit": "Tuyere Radar Thermography & Hot Metal Breakout Prevention",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Steel Plant Blast Furnace Managers & Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Blast Furnace Thermal Anomaly"
    },
    {
        "keyword": "underground mining ventilation on demand automation software for mines",
        "slug": "underground-mining-ventilation-on-demand-automation-software-for-mines",
        "key_benefit": "Air-Quality Sensor Guided Damper Control & 42% Energy Savings",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Underground Mine Managers & Ventilation Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Mine Ventilation Audit"
    },
    {
        "keyword": "conveyor belt longitudinal rip detection systems for bulk terminals",
        "slug": "conveyor-belt-longitudinal-rip-detection-systems-for-bulk-terminals",
        "key_benefit": "Sub-Second Laser Profilometry & Catastrophic Splice Isolation",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Terminal Operations Directors & Bulk Handling Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request Conveyor Rip Detection Demo"
    },
    {
        "keyword": "heavy equipment hydraulic oil degradation telemetry agents for quarries",
        "slug": "heavy-equipment-hydraulic-oil-degradation-telemetry-agents-for-quarries",
        "key_benefit": "Continuous Particle Count & Dielectric Viscosity Monitoring",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Heavy Machinery Maintenance Directors & Fleet Asset Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Hydraulic Oil Telemetry"
    },
    {
        "keyword": "seismic telemetry processing and rock burst prediction state machines",
        "slug": "seismic-telemetry-processing-and-rock-burst-prediction-state-machines",
        "key_benefit": "Micro-Seismic Triangulation & Geotechnical Hazard Evacuation",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Chief Geotechnical Engineers & Mining Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Rock Burst Telemetry Audit"
    },
    {
        "keyword": "smelter emissions scrubbing efficiency agents for base metal refiners",
        "slug": "smelter-emissions-scrubbing-efficiency-agents-for-base-metal-refiners",
        "key_benefit": "Real-Time SO2 Telemetry & Statutory EPA Regulatory Lock",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Environmental Compliance Directors & Smelter Operations VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Smelter Emissions Scrubbing"
    },
    {
        "keyword": "ball mill grinding circuit energy optimization engines for cement plants",
        "slug": "ball-mill-grinding-circuit-energy-optimization-engines-for-cement-plants",
        "key_benefit": "Acoustic Mill Loading Telemetry & Specific Power Consumption Cut",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Cement Plant Technical Directors & Process Optimization Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cement Mill Energy Audit"
    },
    {
        "keyword": "port bulk material ship loader trajectory control agents for terminals",
        "slug": "port-bulk-material-ship-loader-trajectory-control-agents-for-terminals",
        "key_benefit": "Automated Hatch Scanning & Dust-Suppressed Boom Positioning",
        "category": "Solutions",
        "hub_category": "Heavy Industrial & Mining",
        "target_persona": "Marine Bulk Terminal Directors & Port Logistics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Ship Loader Trajectory Control"
    },

    # -------------------------------------------------------------------------
    # Vertical 5: Enterprise Cybersecurity & Cloud Infrastructure (10 keywords)
    # -------------------------------------------------------------------------
    {
        "keyword": "cloud security posture drift remediation state machines for DevSecOps",
        "slug": "cloud-security-posture-drift-remediation-state-machines-for-devsecops",
        "key_benefit": "Deterministic Terraform State Rollback & Zero-Downtime Patching",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "DevSecOps Directors & Cloud Security Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Cloud Security Posture Drift"
    },
    {
        "keyword": "active directory kerberoasting containment agents for security operations",
        "slug": "active-directory-kerberoasting-containment-agents-for-security-operations",
        "key_benefit": "Sub-50ms Honey-Token Trigger & Automated Ticket Revocation",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Security Operations Center Leads & Identity Security Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Kerberoasting Defense Audit"
    },
    {
        "keyword": "zero trust network micro-segmentation policy engines for enterprise CISOs",
        "slug": "zero-trust-network-micro-segmentation-policy-engines-for-enterprise-cisos",
        "key_benefit": "Automated eBPF Kernel Policy Enforcement & Lateral Quarantine",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Chief Information Security Officers & Infrastructure VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Zero Trust Micro-Segmentation"
    },
    {
        "keyword": "SIEM alert fatigue triage and false positive suppressors for SOC teams",
        "slug": "siem-alert-fatigue-triage-and-false-positive-suppressors-for-soc-teams",
        "key_benefit": "Deterministic Correlation Graphs & 86% Noise Reduction",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "SOC Directors & Incident Response Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request SOC Alert Triage Demo"
    },
    {
        "keyword": "Kubernetes pod resource right-sizing agents for FinOps leads",
        "slug": "kubernetes-pod-resource-right-sizing-agents-for-finops-leads",
        "key_benefit": "Dynamic Memory CPU HPA Tuning & 38% Cloud Spend Elimination",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Enterprise FinOps Directors & Platform Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Kubernetes FinOps Optimization"
    },
    {
        "keyword": "post-quantum cryptographic certificate migration agents for CISOs",
        "slug": "post-quantum-cryptographic-certificate-migration-agents-for-cisos",
        "key_benefit": "Automated Kyber Dilithium PQC Cipher Suite Deployment",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Enterprise Cryptography Leads & Security Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Migration Audit"
    },
    {
        "keyword": "database exfiltration canary and query throttling software for DBAs",
        "slug": "database-exfiltration-canary-and-query-throttling-software-for-dbas",
        "key_benefit": "Real-Time SQL Entropy Scoring & Immediate Session Termination",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Lead Database Administrators & Data Protection Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Database Exfiltration Defense"
    },
    {
        "keyword": "CICD pipeline software bill of materials auditing agents for AppSec",
        "slug": "cicd-pipeline-software-bill-of-materials-auditing-agents-for-appsec",
        "key_benefit": "Deterministic CycloneDX Dependency Vulnerability Gating",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Application Security Leads & VP of Engineering",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Request SBOM Pipeline Audit"
    },
    {
        "keyword": "SOC 2 Type II continuous evidence collection engines for compliance leads",
        "slug": "soc-2-type-ii-continuous-evidence-collection-engines-for-compliance-leads",
        "key_benefit": "Automated Multi-Cloud IAM & Audit Log Cryptographic Proofs",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Chief Compliance Officers & GRC Practice Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SOC 2 Continuous Audit Demo"
    },
    {
        "keyword": "identity threat detection and privilege escalation revocation agents",
        "slug": "identity-threat-detection-and-privilege-escalation-revocation-agents",
        "key_benefit": "Sub-Second Just-In-Time Privilege Deprovisioning & PAM Lock",
        "category": "Solutions",
        "hub_category": "Enterprise Cybersecurity & Cloud Infrastructure",
        "target_persona": "Identity Access Management Directors & Cloud SecOps Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Identity Threat Detection"
    }
]

def ingest_keywords():
    print(f"Loading compact queue from {QUEUE_PATH}...")
    if not QUEUE_PATH.exists():
        queue = []
    else:
        queue = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))

    existing_slugs = {item["slug"] for item in queue}
    start_id = max([item.get("id", 0) for item in queue], default=0) + 1

    added_count = 0
    for kw in WAVE_3_KEYWORDS:
        if kw["slug"] not in existing_slugs:
            kw["id"] = start_id
            start_id += 1
            queue.append(kw)
            existing_slugs.add(kw["slug"])
            added_count += 1
            print(f"  + Added [{kw['id']}]: {kw['slug']} ({kw['hub_category']})")
        else:
            print(f"  - Skipped existing: {kw['slug']}")

    QUEUE_PATH.write_text(json.dumps(queue, indent=2), encoding="utf-8")
    print(f"\n✅ Successfully ingested {added_count} new keywords into queue.")
    print(f"Total keywords in queue: {len(queue)}")

if __name__ == "__main__":
    ingest_keywords()
