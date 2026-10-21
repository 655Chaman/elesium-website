#!/usr/bin/env python3
"""
Ingests Wave 45 commercial keywords (IDs 2,091 to 2,140, 50 solutions)
into automation/compact_keywords_queue.json.
Expands the commercial core from 2,090 to 2,140 solutions!
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE45 = [
    # Cluster 1: Edge Industrial IoT, OPC-UA & Real-Time PLC Integration (IDs 2091-2107, 17 items)
    {
        "id": 2091,
        "keyword": "edge opc ua protocol translation telemetry for siemens s7 and fanuc cnc plcs in indian factories",
        "slug": "edge-opc-ua-protocol-translation-telemetry-for-siemens-s7-and-fanuc-cnc-plcs-in-indian-factories",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Factory Automation Directors & Plant Operations Vice Presidents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Edge OPC-UA Protocol Audit"
    },
    {
        "id": 2092,
        "keyword": "sub 50ms deterministic edge closed loop control telemetry for automotive precision machining lines",
        "slug": "sub-50ms-deterministic-edge-closed-loop-control-telemetry-for-automotive-precision-machining-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Automotive Tier-1 Manufacturing Directors & Precision Machining Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Closed-Loop Latency Audit"
    },
    {
        "id": 2093,
        "keyword": "profinet real time ethernet packet jitter suppression telemetry for multi axis robotic welding cells",
        "slug": "profinet-real-time-ethernet-packet-jitter-suppression-telemetry-for-multi-axis-robotic-welding-cells",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Robotics Automation Engineers & Welding Line Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Profinet Jitter Audit"
    },
    {
        "id": 2094,
        "keyword": "ethercat synchronous fieldbus master telemetry for high speed electronic component pick and place lines",
        "slug": "ethercat-synchronous-fieldbus-master-telemetry-for-high-speed-electronic-component-pick-and-place-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Electronics Manufacturing Operations Heads & SMT Line Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule EtherCAT Fieldbus Audit"
    },
    {
        "id": 2095,
        "keyword": "air gapped purdue model level 2 scada isolation telemetry for pharmaceutical cleanroom facilities",
        "slug": "air-gapped-purdue-model-level-2-scada-isolation-telemetry-for-pharmaceutical-cleanroom-facilities",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Pharma Plant Engineering Directors & Cleanroom Automation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Purdue Model SCADA Audit"
    },
    {
        "id": 2096,
        "keyword": "modbus tcp serial gateway polling latency optimization telemetry for legacy textile mill spinning machines",
        "slug": "modbus-tcp-serial-gateway-polling-latency-optimization-telemetry-for-legacy-textile-mill-spinning-machines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Textile Mill Operations Directors & Plant Modernization Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Modbus Gateway Audit"
    },
    {
        "id": 2097,
        "keyword": "mqtt sparkplug b edge payload compression telemetry for bandwidth constrained remote factory telemetry",
        "slug": "mqtt-sparkplug-b-edge-payload-compression-telemetry-for-bandwidth-constrained-remote-factory-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Industrial IoT Architecture Leads & Remote Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sparkplug B Compression Audit"
    },
    {
        "id": 2098,
        "keyword": "io link smart sensor master aggregation telemetry for discrete assembly automated part positioning",
        "slug": "io-link-smart-sensor-master-aggregation-telemetry-for-discrete-assembly-automated-part-positioning",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Assembly Line Automation Specialists & Tooling Design Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IO-Link Sensor Audit"
    },
    {
        "id": 2099,
        "keyword": "can bus vehicle diagnostics and j1939 telemetry ingestion agents for electric commercial vehicle assembly",
        "slug": "can-bus-vehicle-diagnostics-and-j1939-telemetry-ingestion-agents-for-electric-commercial-vehicle-assembly",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "EV Manufacturing Operations VPs & Automotive Telematics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule J1939 Assembly Audit"
    },
    {
        "id": 2100,
        "keyword": "industrial pc din rail hardware watchdog and auto reboot telemetry for harsh foundry environments",
        "slug": "industrial-pc-din-rail-hardware-watchdog-and-auto-reboot-telemetry-for-harsh-foundry-environments",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Foundry Plant Managers & Industrial PC Infrastructure Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IPC Hardware Watchdog Audit"
    },
    {
        "id": 2101,
        "keyword": "opc ua pub sub over tsn time sensitive networking telemetry for sub millisecond motion coordination",
        "slug": "opc-ua-pub-sub-over-tsn-time-sensitive-networking-telemetry-for-sub-millisecond-motion-coordination",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Motion Control Systems Architects & High-Speed Robotics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TSN Network Audit"
    },
    {
        "id": 2102,
        "keyword": "allen bradley contrologix ethernet ip tag polling optimization telemetry for food packaging lines",
        "slug": "allen-bradley-contrologix-ethernet-ip-tag-polling-optimization-telemetry-for-food-packaging-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "FMCG Packaging Plant Directors & ControlLogix PLC Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ControlLogix Polling Audit"
    },
    {
        "id": 2103,
        "keyword": "fanuc focas ethernet cnc spindle load and feedrate extraction telemetry for aerospace milling cells",
        "slug": "fanuc-focas-ethernet-cnc-spindle-load-and-feedrate-extraction-telemetry-for-aerospace-milling-cells",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Aerospace Machining Facility Heads & Precision Milling Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fanuc FOCAS Telemetry Audit"
    },
    {
        "id": 2104,
        "keyword": "beckhoff twincat ads protocol telemetry ingestion agents for semiconductor packaging machines",
        "slug": "beckhoff-twincat-ads-protocol-telemetry-ingestion-agents-for-semiconductor-packaging-machines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Semiconductor Equipment Engineers & TwinCAT Software Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule TwinCAT ADS Telemetry Audit"
    },
    {
        "id": 2105,
        "keyword": "omron fins protocol udp telemetry bridging agents for automated warehouse stacker cranes in india",
        "slug": "omron-fins-protocol-udp-telemetry-bridging-agents-for-automated-warehouse-stacker-cranes-in-india",
        "category": "Solutions",
        "hub_category": "Supply Chain & Logistics ERP Automation",
        "target_persona": "Automated Warehouse Engineering Leads & Logistics Equipment Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Omron FINS Bridging Audit"
    },
    {
        "id": 2106,
        "keyword": "mitsubishi melsec mc protocol telemetry gateway for automotive tier 2 press stamping shops",
        "slug": "mitsubishi-melsec-mc-protocol-telemetry-gateway-for-automotive-tier-2-press-stamping-shops",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Press Shop Production Managers & Stamping Tooling Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule MELSEC Gateway Audit"
    },
    {
        "id": 2107,
        "keyword": "industrial edge sensor data buffer rollover and local ssd endurance telemetry for remote mines",
        "slug": "industrial-edge-sensor-data-buffer-rollover-and-local-ssd-endurance-telemetry-for-remote-mines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Mining Technology Operations VPs & Heavy Machinery Fleet Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Edge Buffer Endurance Audit"
    },

    # Cluster 2: Predictive Maintenance, Spindle Telemetry & Computer Vision Quality Inspection (IDs 2108-2124, 17 items)
    {
        "id": 2108,
        "keyword": "spindle bearing vibration fft spectral analysis and acoustic emission telemetry for cnc machine centers",
        "slug": "spindle-bearing-vibration-fft-spectral-analysis-and-acoustic-emission-telemetry-for-cnc-machine-centers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Precision Machining Operations Heads & Predictive Maintenance Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Spindle Vibration FFT Audit"
    },
    {
        "id": 2109,
        "keyword": "thermal drift expansion compensation agents for high precision defense manufacturing machining cells",
        "slug": "thermal-drift-expansion-compensation-agents-for-high-precision-defense-manufacturing-machining-cells",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Defense Production General Managers & Precision Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Thermal Drift Compensation Audit"
    },
    {
        "id": 2110,
        "keyword": "computer vision micro surface scratch defect inspection agents for automotive body paint shops",
        "slug": "computer-vision-micro-surface-scratch-defect-inspection-agents-for-automotive-body-paint-shops",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Automotive Quality Assurance Directors & Paint Shop Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Paint Defect Vision Audit"
    },
    {
        "id": 2111,
        "keyword": "hydraulic press oil degradation and cavitation telemetry agents for heavy forging plants in pune",
        "slug": "hydraulic-press-oil-degradation-and-cavitation-telemetry-agents-for-heavy-forging-plants-in-pune",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Heavy Forging Plant Managers & Hydraulic Maintenance Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Hydraulic Cavitation Audit"
    },
    {
        "id": 2112,
        "keyword": "sub millimeter solder ball bridge defect inspection agents for smt electronics manufacturing",
        "slug": "sub-millimeter-solder-ball-bridge-defect-inspection-agents-for-smt-electronics-manufacturing",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Electronics Quality Control Heads & SMT Process Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SMT Solder Inspection Audit"
    },
    {
        "id": 2113,
        "keyword": "induction furnace refractory lining thermal imaging wear telemetry agents for steel casting plants",
        "slug": "induction-furnace-refractory-lining-thermal-imaging-wear-telemetry-agents-for-steel-casting-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Steel Mill Operations Directors & Metallurgy Maintenance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Furnace Refractory Audit"
    },
    {
        "id": 2114,
        "keyword": "autonomous tool wear offset compensation agents for automated gear hobbing and shaping lines",
        "slug": "autonomous-tool-wear-offset-compensation-agents-for-automated-gear-hobbing-and-shaping-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Gear Manufacturing Plant Heads & CNC Tooling Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Gear Tool Offset Audit"
    },
    {
        "id": 2115,
        "keyword": "injection molding cavity pressure sensor curve anomaly detection agents for plastic component makers",
        "slug": "injection-molding-cavity-pressure-sensor-curve-anomaly-detection-agents-for-plastic-component-makers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Plastics Manufacturing Technical Directors & Tooling Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Injection Molding Cavity Audit"
    },
    {
        "id": 2116,
        "keyword": "high speed conveyor optical belt tear and misalignment detection agents for cement and mining plants",
        "slug": "high-speed-conveyor-optical-belt-tear-and-misalignment-detection-agents-for-cement-and-mining-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Cement Plant Engineering VPs & Material Handling Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conveyor Belt Vision Audit"
    },
    {
        "id": 2117,
        "keyword": "weld seam porosity and penetration depth x ray radiography analysis agents for pipeline manufacturers",
        "slug": "weld-seam-porosity-and-penetration-depth-x-ray-radiography-analysis-agents-for-pipeline-manufacturers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Pipe Mill Quality Assurance Directors & NDT Inspection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule NDT Weld Radiography Audit"
    },
    {
        "id": 2118,
        "keyword": "electric motor winding insulation partial discharge monitoring agents for heavy industrial pumps",
        "slug": "electric-motor-winding-insulation-partial-discharge-monitoring-agents-for-heavy-industrial-pumps",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Electrical Maintenance Heads & Reliability Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Motor Insulation Discharge Audit"
    },
    {
        "id": 2119,
        "keyword": "air compressor compressed air ultrasonic leak detection and flow monitoring agents for textile mills",
        "slug": "air-compressor-compressed-air-ultrasonic-leak-detection-and-flow-monitoring-agents-for-textile-mills",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Factory Energy Managers & Utility Plant Operations Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Ultrasonic Air Leak Audit"
    },
    {
        "id": 2120,
        "keyword": "cold storage ammonia refrigerant leak optical gas imaging and gas sensor telemetry agents",
        "slug": "cold-storage-ammonia-refrigerant-leak-optical-gas-imaging-and-gas-sensor-telemetry-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Cold Chain Facility Directors & Industrial Safety Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Ammonia Leak Telemetry Audit"
    },
    {
        "id": 2121,
        "keyword": "robotic arm joint gearbox backlash and torque ripple telemetry agents for automotive stamping lines",
        "slug": "robotic-arm-joint-gearbox-backlash-and-torque-ripple-telemetry-agents-for-automotive-stamping-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Robotics Maintenance Leads & Industrial Automation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Robot Gearbox Backlash Audit"
    },
    {
        "id": 2122,
        "keyword": "boiler feedwater ph and dissolved oxygen chemical titration auto dosing agents for thermal power",
        "slug": "boiler-feedwater-ph-and-dissolved-oxygen-chemical-titration-auto-dosing-agents-for-thermal-power",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Thermal Power Plant Station Directors & Water Chemistry Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Boiler Chemistry Dosing Audit"
    },
    {
        "id": 2123,
        "keyword": "pcb conformal coating thickness and bubble inspection agents for automotive electronic controllers",
        "slug": "pcb-conformal-coating-thickness-and-bubble-inspection-agents-for-automotive-electronic-controllers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Electronic Subsystem Quality Leads & SMT Coating Process Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conformal Coating Inspection Audit"
    },
    {
        "id": 2124,
        "keyword": "diesel generator fuel consumption and injector pressure telemetry agents for remote construction sites",
        "slug": "diesel-generator-fuel-consumption-and-injector-pressure-telemetry-agents-for-remote-construction-sites",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Heavy Construction Equipment Fleet Directors & Site Utility Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Genset Telemetry Audit"
    },

    # Cluster 3: Indian Manufacturing Smart Factory Autonomous Closed-Loop ERP Automation (IDs 2125-2140, 16 items)
    {
        "id": 2125,
        "keyword": "sap s4hana manufacturing work order auto confirmation agents based on shopfloor plc counts in india",
        "slug": "sap-s4hana-manufacturing-work-order-auto-confirmation-agents-based-on-shopfloor-plc-counts-in-india",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "SAP S/4HANA Project Leaders & Manufacturing Systems Integration Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SAP S/4HANA PLC Auto-Confirmation Audit"
    },
    {
        "id": 2126,
        "keyword": "raw material batch traceability barcode scan validation agents for automotive tier 1 audits in chennai",
        "slug": "raw-material-batch-traceability-barcode-scan-validation-agents-for-automotive-tier-1-audits-in-chennai",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Supply Chain Quality Assurance Leads & Traceability Project Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Batch Traceability Audit"
    },
    {
        "id": 2127,
        "keyword": "automated scrap reconciliation and work in progress wip ledger balancing agents for metal fabrication",
        "slug": "automated-scrap-reconciliation-and-work-in-progress-wip-ledger-balancing-agents-for-metal-fabrication",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Metal Fabrication Plant Controllers & Cost Accounting Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Scrap Reconciliation Audit"
    },
    {
        "id": 2128,
        "keyword": "dynamic shift scheduling and machine operator skill matrix balancing agents for tier 1 suppliers",
        "slug": "dynamic-shift-scheduling-and-machine-operator-skill-matrix-balancing-agents-for-tier-1-suppliers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Industrial Engineering Heads & Plant Human Resource Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Operator Skill Matrix Audit"
    },
    {
        "id": 2129,
        "keyword": "energy consumption peak shaving and demand charge mitigation agents for heavy rolling mills in gujarat",
        "slug": "energy-consumption-peak-shaving-and-demand-charge-mitigation-agents-for-heavy-rolling-mills-in-gujarat",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Rolling Mill Chief Operating Officers & Industrial Energy Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Peak Shaving Energy Audit"
    },
    {
        "id": 2130,
        "keyword": "predictive spare part ordering agents integrated with sap plant maintenance pm module in india",
        "slug": "predictive-spare-part-ordering-agents-integrated-with-sap-plant-maintenance-pm-module-in-india",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Plant Maintenance Heads & Enterprise Procurement Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule SAP PM Spares Audit"
    },
    {
        "id": 2131,
        "keyword": "overall equipment effectiveness oee telemetry calculation agents with automated downtime categorization",
        "slug": "overall-equipment-effectiveness-oee-telemetry-calculation-agents-with-automated-downtime-categorization",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Continuous Improvement Leads & Operational Excellence Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Automated OEE Audit"
    },
    {
        "id": 2132,
        "keyword": "iatf 16949 automated quality documentation and spc control chart telemetry for auto parts plants",
        "slug": "iatf-16949-automated-quality-documentation-and-spc-control-chart-telemetry-for-auto-parts-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Automotive Quality Assurance Directors & IATF 16949 Compliance Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule IATF Quality SPC Audit"
    },
    {
        "id": 2133,
        "keyword": "shopfloor dispatch priority dynamic adjustment agents based on real time machine bottleneck telemetry",
        "slug": "shopfloor-dispatch-priority-dynamic-adjustment-agents-based-on-real-time-machine-bottleneck-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Production Planning & Control Heads & Manufacturing Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bottleneck Dispatch Audit"
    },
    {
        "id": 2134,
        "keyword": "automated tooling life cycle calibration and regrind schedule agents for aerospace machine shops",
        "slug": "automated-tooling-life-cycle-calibration-and-regrind-schedule-agents-for-aerospace-machine-shops",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Aerospace Tooling Managers & Machine Shop Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Tool Regrind Calibration Audit"
    },
    {
        "id": 2135,
        "keyword": "finished goods pallet automated rfid gate scanning and sap delivery document matching in bangalore",
        "slug": "finished-goods-pallet-automated-rfid-gate-scanning-and-sap-delivery-document-matching-in-bangalore",
        "category": "Solutions",
        "hub_category": "Supply Chain & Logistics ERP Automation",
        "target_persona": "Warehouse Logistics Directors & Finished Goods Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule RFID Gate SAP Matching Audit"
    },
    {
        "id": 2136,
        "keyword": "sub assembly dimensional verification against cad models using optical 3d scanning telemetry",
        "slug": "sub-assembly-dimensional-verification-against-cad-models-using-optical-3d-scanning-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Metrology Department Heads & Quality Inspection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule 3D Optical Metrology Audit"
    },
    {
        "id": 2137,
        "keyword": "autonomous agv fleet traffic arbitration and material replenishment agents for automotive plants",
        "slug": "autonomous-agv-fleet-traffic-arbitration-and-material-replenishment-agents-for-automotive-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Internal Logistics Managers & AGV Automation Fleet Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule AGV Fleet Traffic Audit"
    },
    {
        "id": 2138,
        "keyword": "paint shop humidity and volatile organic compound voc auto regulation telemetry for automotive oems",
        "slug": "paint-shop-humidity-and-volatile-organic-compound-voc-auto-regulation-telemetry-for-automotive-oems",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Paint Shop Operations Directors & Environmental Health Safety Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule VOC Environmental Regulation Audit"
    },
    {
        "id": 2139,
        "keyword": "casting sand moisture and permeability auto adjustment telemetry agents for ductile iron foundries",
        "slug": "casting-sand-moisture-and-permeability-auto-adjustment-telemetry-agents-for-ductile-iron-foundries",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Foundry Metallurgists & Sand Lab Quality Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Foundry Sand Telemetry Audit"
    },
    {
        "id": 2140,
        "keyword": "smart factory real time carbon emission scope 1 and 2 energy footprint telemetry for indian exporters",
        "slug": "smart-factory-real-time-carbon-emission-scope-1-and-2-energy-footprint-telemetry-for-indian-exporters",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing & Industry 4.0",
        "target_persona": "Chief Sustainability Officers & Global Export Compliance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Scope 1 & 2 Carbon Telemetry Audit"
    }
]

def main():
    print("=" * 80)
    print("INGESTING WAVE 45 COMMERCIAL KEYWORDS (IDs 2,091 TO 2,140 — 50 SOLUTIONS)")
    print("=" * 80)

    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}
    existing_slugs = {item["slug"] for item in data}

    added_count = 0
    for kw in KEYWORDS_WAVE45:
        if kw["id"] in existing_ids:
            print(f"Skipping ID {kw['id']} (already exists)")
            continue
        if kw["slug"] in existing_slugs:
            print(f"Skipping slug '{kw['slug']}' (already exists)")
            continue
        data.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added_count += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"✅ Successfully ingested {added_count} new commercial solutions into {QUEUE_PATH}")
    print(f"Total active commercial solutions in queue: {len(data)}")
    print("=" * 80)

if __name__ == "__main__":
    main()
