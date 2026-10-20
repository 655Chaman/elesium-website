#!/usr/bin/env python3
"""
ingest_wave21_keywords.py

Ingests Wave 21 BOFU Solution Keywords (IDs 891 to 940):
- Supercritical CO2 (sCO2) Brayton Cycle Power Turbine Telemetry (17 solutions, IDs 891-907)
- Autonomous Subsea Wellhead Electro-Hydraulic Multiplex (MUX) Control Telemetry (17 solutions, IDs 908-924)
- Molten Salt Nuclear Reactor (MSR) Hastelloy-N Alloy Fluoride Salt Corrosion Telemetry (16 solutions, IDs 925-940)

Scales total compact solutions queue from 890 to 940.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave21_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Supercritical CO2 (sCO2) Brayton Cycle Turbine Telemetry (17 solutions, IDs 891-907)
    # -------------------------------------------------------------------------
    {
        "id": 891,
        "keyword": "supercritical CO2 Brayton cycle radial inflow turbine aerodynamic expansion efficiency telemetry for SCO2 plants",
        "slug": "supercritical-co2-brayton-cycle-radial-inflow-turbine-aerodynamic-expansion-efficiency-telemetry-for-sco2-plants",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Turbomachinery Aerodynamicists & sCO2 Cycle Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy sCO2 Aerodynamic Telemetry"
    },
    {
        "id": 892,
        "keyword": "sCO2 printed circuit heat exchanger PCHE microchannel differential pressure loss telemetry for Brayton loops",
        "slug": "sco2-printed-circuit-heat-exchanger-pche-microchannel-differential-pressure-loss-telemetry-for-brayton-loops",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "PCHE Heat Exchanger Engineers & Thermal Cycle Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy PCHE Microchannel Telemetry"
    },
    {
        "id": 893,
        "keyword": "supercritical carbon dioxide dry gas seal dynamic groove leakage flow telemetry for high-pressure compressors",
        "slug": "supercritical-carbon-dioxide-dry-gas-seal-dynamic-groove-leakage-flow-telemetry-for-high-pressure-compressors",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Dry Gas Seal Specialists & Rotating Equipment Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dry Gas Seal Telemetry"
    },
    {
        "id": 894,
        "keyword": "sCO2 main compressor near-critical pseudocritical point density fluctuation inlet telemetry for surge margin",
        "slug": "sco2-main-compressor-near-critical-pseudocritical-point-density-fluctuation-inlet-telemetry-for-surge-margin",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Compressor Aerodynamics Leads & Supercritical Fluid Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pseudocritical Density Telemetry"
    },
    {
        "id": 895,
        "keyword": "recompressor sCO2 split flow ratio thermodynamic recuperator Pinch point temperature telemetry for Brayton cycles",
        "slug": "recompressor-sco2-split-flow-ratio-thermodynamic-recuperator-pinch-point-temperature-telemetry-for-brayton-cycles",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Thermodynamic Optimization Leads & Brayton Plant Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pinch Point Telemetry"
    },
    {
        "id": 896,
        "keyword": "supercritical CO2 turbine foil gas bearing hydrodynamic lift-off and thermal runaway telemetry for high-speed shafts",
        "slug": "supercritical-co2-turbine-foil-gas-bearing-hydrodynamic-lift-off-and-thermal-runaway-telemetry-for-high-speed-shafts",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Foil Bearing Engineers & Rotordynamic Analysts",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Foil Bearing Telemetry"
    },
    {
        "id": 897,
        "keyword": "sCO2 turbine casing high-temperature Haynes 282 creep relaxation and thermal stress telemetry for Brayton casings",
        "slug": "sco2-turbine-casing-high-temperature-haynes-282-creep-relaxation-and-thermal-stress-telemetry-for-brayton-casings",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Superalloy Metallurgy Specialists & Casing Stress Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Haynes 282 Creep Telemetry"
    },
    {
        "id": 898,
        "keyword": "supercritical CO2 combustor oxy-fuel direct-fired Allam cycle soot and flame ionization telemetry for zero-emissions",
        "slug": "supercritical-co2-combustor-oxy-fuel-direct-fired-allam-cycle-soot-and-flame-ionization-telemetry-for-zero-emissions",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Oxy-Fuel Combustion Leads & Allam Cycle Process Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Allam Flame Telemetry"
    },
    {
        "id": 899,
        "keyword": "sCO2 turbine rotor high-frequency sub-synchronous vibration rotordynamics telemetry for supercritical shafts",
        "slug": "sco2-turbine-rotor-high-frequency-sub-synchronous-vibration-rotordynamics-telemetry-for-supercritical-shafts",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Rotordynamics Specialists & Vibration Diagnostics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sub-Synchronous Vibration Telemetry"
    },
    {
        "id": 900,
        "keyword": "supercritical CO2 cycle inventory management bypass valve cavitation noise acoustic emission telemetry for loops",
        "slug": "supercritical-co2-cycle-inventory-management-bypass-valve-cavitation-noise-acoustic-emission-telemetry-for-loops",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Control Valve Engineers & Acoustic Monitoring Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bypass Cavitation Telemetry"
    },
    {
        "id": 901,
        "keyword": "sCO2 cooling tower direct air-cooled heat exchanger ambient wind crossflow performance telemetry for arid plants",
        "slug": "sco2-cooling-tower-direct-air-cooled-heat-exchanger-ambient-wind-crossflow-performance-telemetry-for-arid-plants",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Air-Cooled Condenser Leads & Power Plant Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Air-Cooled Condenser Telemetry"
    },
    {
        "id": 902,
        "keyword": "supercritical CO2 piping thermal shock and flow-accelerated erosion ultrasonic wall thickness telemetry for headers",
        "slug": "supercritical-co2-piping-thermal-shock-and-flow-accelerated-erosion-ultrasonic-wall-thickness-telemetry-for-headers",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Piping Integrity Specialists & Ultrasonic NDT Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Piping Ultrasonic Telemetry"
    },
    {
        "id": 903,
        "keyword": "sCO2 axial compressor stator variable vane angle aerodynamic hysteresis torque telemetry for Brayton turbines",
        "slug": "sco2-axial-compressor-stator-variable-vane-angle-aerodynamic-hysteresis-torque-telemetry-for-brayton-turbines",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Variable Geometry Mechanism Leads & Compressor Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Variable Vane Telemetry"
    },
    {
        "id": 904,
        "keyword": "supercritical carbon dioxide solar central receiver molten salt to sCO2 heat transfer pinch telemetry for CSP",
        "slug": "supercritical-carbon-dioxide-solar-central-receiver-molten-salt-to-sco2-heat-transfer-pinch-telemetry-for-csp",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Concentrated Solar Power Engineers & CSP Receiver Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy CSP Heat Transfer Telemetry"
    },
    {
        "id": 905,
        "keyword": "sCO2 turbine labyrinth seal clearance capacitive displacement probe telemetry for high-density turbomachinery",
        "slug": "sco2-turbine-labyrinth-seal-clearance-capacitive-displacement-probe-telemetry-for-high-density-turbomachinery",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Labyrinth Seal Engineers & Sensor Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Labyrinth Clearance Telemetry"
    },
    {
        "id": 906,
        "keyword": "supercritical CO2 power loop rapid depressurization Joule-Thomson refrigeration dry ice icing telemetry for relief valves",
        "slug": "supercritical-co2-power-loop-rapid-depressurization-joule-thomson-refrigeration-dry-ice-icing-telemetry-for-relief-valves",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Pressure Safety Systems Leads & Fluid Thermodynamics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Depressurization Icing Telemetry"
    },
    {
        "id": 907,
        "keyword": "sCO2 gas purity gas chromatograph moisture and light hydrocarbon contaminant telemetry for closed-loop stability",
        "slug": "sco2-gas-purity-gas-chromatograph-moisture-and-light-hydrocarbon-contaminant-telemetry-for-closed-loop-stability",
        "category": "Solutions",
        "hub_category": "Advanced Turbomachinery & Power Cycles",
        "target_persona": "Gas Quality Chemist Leads & Turbomachinery Reliability Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gas Purity Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Subsea Wellhead Electro-Hydraulic MUX Control Telemetry (17 solutions, IDs 908-924)
    # -------------------------------------------------------------------------
    {
        "id": 908,
        "keyword": "subsea production tree electro-hydraulic multiplex control pod accumulator hydraulic pressure decay telemetry for deepwater",
        "slug": "subsea-production-tree-electro-hydraulic-multiplex-control-pod-accumulator-hydraulic-pressure-decay-telemetry-for-deepwater",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Subsea Controls Leads & MUX Pod System Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy MUX Pod Pressure Telemetry"
    },
    {
        "id": 909,
        "keyword": "subsea umbilical cable optical time-domain reflectometry OTDR fiber strain and attenuation telemetry for step-outs",
        "slug": "subsea-umbilical-cable-optical-time-domain-reflectometry-otdr-fiber-strain-and-attenuation-telemetry-for-step-outs",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Subsea Umbilical Specialists & Optical Telecommunications Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Umbilical OTDR Telemetry"
    },
    {
        "id": 910,
        "keyword": "subsea wellhead annular pressure build-up thermal expansion transducer telemetry for deepwater casing strings",
        "slug": "subsea-wellhead-annular-pressure-build-up-thermal-expansion-transducer-telemetry-for-deepwater-casing-strings",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Well Integrity Engineers & Deepwater Drilling Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Annular Pressure Telemetry"
    },
    {
        "id": 911,
        "keyword": "electro-hydraulic control pod directional control valve spool displacement LVDT telemetry for subsea actuators",
        "slug": "electro-hydraulic-control-pod-directional-control-valve-spool-displacement-lvdt-telemetry-for-subsea-actuators",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Hydraulic Valve Specialists & Subsea Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Valve Spool LVDT Telemetry"
    },
    {
        "id": 912,
        "keyword": "subsea wet gas flowmeter dual-energy gamma-ray attenuation water-liquid ratio telemetry for real-time allocation",
        "slug": "subsea-wet-gas-flowmeter-dual-energy-gamma-ray-attenuation-water-liquid-ratio-telemetry-for-real-time-allocation",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Multiphase Metering Specialists & Subsea Production Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wet Gas Gamma Telemetry"
    },
    {
        "id": 913,
        "keyword": "subsea chemical injection metering valve CIMV micro-flow rate corrosion inhibitor telemetry for flowline scale",
        "slug": "subsea-chemical-injection-metering-valve-cimv-micro-flow-rate-corrosion-inhibitor-telemetry-for-flowline-scale",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Flow Assurance Leads & Chemical Injection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy CIMV Micro-Flow Telemetry"
    },
    {
        "id": 914,
        "keyword": "subsea electrical flying lead insulation resistance degradation dielectric time-domain reflectometry telemetry for trees",
        "slug": "subsea-electrical-flying-lead-insulation-resistance-degradation-dielectric-time-domain-reflectometry-telemetry-for-trees",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Electrical Flying Lead Engineers & Subsea Power Distribution Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flying Lead Dielectric Telemetry"
    },
    {
        "id": 915,
        "keyword": "subsea choke valve acoustic sand detector particle impingement erosion rate telemetry for high-rate gas wells",
        "slug": "subsea-choke-valve-acoustic-sand-detector-particle-impingement-erosion-rate-telemetry-for-high-rate-gas-wells",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Sand Management Specialists & Subsea Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Sand Telemetry"
    },
    {
        "id": 916,
        "keyword": "subsea blowout preventer blind shear ram lock position ultrasonic verification telemetry for deepwater drilling",
        "slug": "subsea-blowout-preventer-blind-shear-ram-lock-position-ultrasonic-verification-telemetry-for-deepwater-drilling",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "BOP Reliability Directors & Subsea Well Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy BOP Shear Ram Telemetry"
    },
    {
        "id": 917,
        "keyword": "subsea pipeline tie-in spool galvanic sacrificial anode electric field potential gradient telemetry for CP surveys",
        "slug": "subsea-pipeline-tie-in-spool-galvanic-sacrificial-anode-electric-field-potential-gradient-telemetry-for-cp-surveys",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Cathodic Protection Specialists & Pipeline Asset Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cathodic Gradient Telemetry"
    },
    {
        "id": 918,
        "keyword": "subsea manifold multi-bore clamp connector metal-to-metal seal contact stress telemetry for HPHT production",
        "slug": "subsea-manifold-multi-bore-clamp-connector-metal-to-metal-seal-contact-stress-telemetry-for-hpht-production",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Clamp Connector Structural Leads & Subsea Piping Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Seal Contact Stress Telemetry"
    },
    {
        "id": 919,
        "keyword": "subsea hydraulic fluid particulate contamination laser particle counter ISO 4406 cleanliness telemetry for MUX pods",
        "slug": "subsea-hydraulic-fluid-particulate-contamination-laser-particle-counter-iso-4406-cleanliness-telemetry-for-mux-pods",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Hydraulic Fluid Quality Leads & Reliability Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hydraulic Cleanliness Telemetry"
    },
    {
        "id": 920,
        "keyword": "subsea wellhead fatigue monitoring triaxial inclinometer and dynamic bending strain telemetry for drilling risers",
        "slug": "subsea-wellhead-fatigue-monitoring-triaxial-inclinometer-and-dynamic-bending-strain-telemetry-for-drilling-risers",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Wellhead Fatigue Engineers & Riser Dynamicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wellhead Fatigue Telemetry"
    },
    {
        "id": 921,
        "keyword": "subsea gas hydrate dissociation differential acoustic velocity and pipe skin temperature telemetry for tiebacks",
        "slug": "subsea-gas-hydrate-dissociation-differential-acoustic-velocity-and-pipe-skin-temperature-telemetry-for-tiebacks",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Gas Hydrate Modeling Leads & Flowline Assurance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hydrate Velocity Telemetry"
    },
    {
        "id": 922,
        "keyword": "subsea electric actuator brushless DC motor torque feedback and resolver position telemetry for all-electric trees",
        "slug": "subsea-electric-actuator-brushless-dc-motor-torque-feedback-and-resolver-position-telemetry-for-all-electric-trees",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "All-Electric Actuator Engineers & Subsea Electrical Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Electric Actuator Telemetry"
    },
    {
        "id": 923,
        "keyword": "subsea production riser vortex-induced vibration helical strake hydrodynamic drag and fatigue telemetry for deepwater",
        "slug": "subsea-production-riser-vortex-induced-vibration-helical-strake-hydrodynamic-drag-and-fatigue-telemetry-for-deepwater",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Riser Hydrodynamics Specialists & Offshore Marine Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Riser VIV Telemetry"
    },
    {
        "id": 924,
        "keyword": "subsea pig receiver acoustic pig signaller electromagnetic passage detection telemetry for intelligent pigging",
        "slug": "subsea-pig-receiver-acoustic-pig-signaller-electromagnetic-passage-detection-telemetry-for-intelligent-pigging",
        "category": "Solutions",
        "hub_category": "Subsea Oil & Gas Engineering",
        "target_persona": "Pipeline Pigging Specialists & Inspection Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pig Passage Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Molten Salt Nuclear Reactor Hastelloy-N Corrosion Telemetry (16 solutions, IDs 925-940)
    # -------------------------------------------------------------------------
    {
        "id": 925,
        "keyword": "molten salt reactor Hastelloy-N alloy FLiBe fluoride salt redox potential telemetry for tellurium embrittlement",
        "slug": "molten-salt-reactor-hastelloy-n-alloy-flibe-fluoride-salt-redox-potential-telemetry-for-tellurium-embrittlement",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Molten Salt Chemistry Leads & Advanced Reactor Metallurgists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fluoride Salt Redox Telemetry"
    },
    {
        "id": 926,
        "keyword": "MSR primary heat exchanger Hastelloy-N tube wall chromium depletion electrochemical probe telemetry for SMRs",
        "slug": "msr-primary-heat-exchanger-hastelloy-n-tube-wall-chromium-depletion-electrochemical-probe-telemetry-for-smrs",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Electrochemical Sensor Engineers & MSR Core Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Chromium Depletion Telemetry"
    },
    {
        "id": 927,
        "keyword": "liquid fuel molten fluoride salt bubbling off-gas xenon-135 noble gas stripping gamma spectrometer telemetry",
        "slug": "liquid-fuel-molten-fluoride-salt-bubbling-off-gas-xenon-135-noble-gas-stripping-gamma-spectrometer-telemetry",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Nuclear Off-Gas Processing Leads & Radiochemists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Xenon Stripping Telemetry"
    },
    {
        "id": 928,
        "keyword": "molten salt reactor freeze valve active cooling blower temperature-triggered passive gravity drain telemetry for safety",
        "slug": "molten-salt-reactor-freeze-valve-active-cooling-blower-temperature-triggered-passive-gravity-drain-telemetry-for-safety",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Nuclear Safety Systems Directors & Passive Thermal Hydraulic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Freeze Valve Telemetry"
    },
    {
        "id": 929,
        "keyword": "FLiNaK secondary coolant salt electromagnetic induction flowmeter non-wetted velocity telemetry for MSR loops",
        "slug": "flinak-secondary-coolant-salt-electromagnetic-induction-flowmeter-non-wetted-velocity-telemetry-for-msr-loops",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Electromagnetic Flowmeter Engineers & Heat Transport Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Salt Induction Flow Telemetry"
    },
    {
        "id": 930,
        "keyword": "molten salt core nuclear graphite moderator dimensional shrinkage and Wigner energy release telemetry for thermal MSRs",
        "slug": "molten-salt-core-nuclear-graphite-moderator-dimensional-shrinkage-and-wigner-energy-release-telemetry-for-thermal-msrs",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Graphite Core Physicists & Nuclear Structural Analysts",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Graphite Shrinkage Telemetry"
    },
    {
        "id": 931,
        "keyword": "Hastelloy-N vessel neutron irradiation helium embrittlement high-temperature tensile rupture telemetry for MSR vessels",
        "slug": "hastelloy-n-vessel-neutron-irradiation-helium-embrittlement-high-temperature-tensile-rupture-telemetry-for-msr-vessels",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Nuclear Materials Scientists & Reactor Pressure Boundary Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vessel Helium Embrittlement Telemetry"
    },
    {
        "id": 932,
        "keyword": "molten fluoride fuel salt online spectrophotometric uranium-4 to uranium-3 ratio optical fiber probe telemetry",
        "slug": "molten-fluoride-fuel-salt-online-spectrophotometric-uranium-4-to-uranium-3-ratio-optical-fiber-probe-telemetry",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Optical Spectroscopy Leads & Actinide Fuel Safeguards Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Uranium Ratio Optical Telemetry"
    },
    {
        "id": 933,
        "keyword": "molten salt reactor cantilever sump pump molten salt hydrodynamic bearing vibration and gas seal telemetry for cores",
        "slug": "molten-salt-reactor-cantilever-sump-pump-molten-salt-hydrodynamic-bearing-vibration-and-gas-seal-telemetry-for-cores",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Primary Coolant Pump Specialists & Rotating Equipment Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sump Pump Bearing Telemetry"
    },
    {
        "id": 934,
        "keyword": "liquid fuel MSR delayed neutron precursor drift spatial flux tilt compensated ion chamber telemetry for reactivity",
        "slug": "liquid-fuel-msr-delayed-neutron-precursor-drift-spatial-flux-tilt-compensated-ion-chamber-telemetry-for-reactivity",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Neutron Kinetics Modelers & Nuclear Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Precursor Drift Telemetry"
    },
    {
        "id": 935,
        "keyword": "molten chloride fast reactor MCFR actinide chloride salt volatility and sodium vapour cold trap telemetry for burners",
        "slug": "molten-chloride-fast-reactor-mcfr-actinide-chloride-salt-volatility-and-sodium-vapour-cold-trap-telemetry-for-burners",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Fast Reactor Physicists & Chloride Salt Process Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Chloride Cold Trap Telemetry"
    },
    {
        "id": 936,
        "keyword": "molten salt reactor tritium permeation through nickel superalloy heat exchanger tubes getter bed telemetry for capture",
        "slug": "molten-salt-reactor-tritium-permeation-through-nickel-superalloy-heat-exchanger-tubes-getter-bed-telemetry-for-capture",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Tritium Management Leads & Environmental Radioprotection Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tritium Permeation Telemetry"
    },
    {
        "id": 937,
        "keyword": "Hastelloy-N weld filler UNS N10003 intergranular stress corrosion crack propagation acoustic emission telemetry for MSR",
        "slug": "hastelloy-n-weld-filler-uns-n10003-intergranular-stress-corrosion-crack-propagation-acoustic-emission-telemetry-for-msr",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Welding Metallurgists & Structural Integrity Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Weld Crack Acoustic Telemetry"
    },
    {
        "id": 938,
        "keyword": "molten salt continuous chemical processing reductive extraction bismuth contactor interface level telemetry for thorium",
        "slug": "molten-salt-continuous-chemical-processing-reductive-extraction-bismuth-contactor-interface-level-telemetry-for-thorium",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Chemical Reprocessing Engineers & Thorium Fuel Cycle Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bismuth Contactor Telemetry"
    },
    {
        "id": 939,
        "keyword": "molten salt reactor decay heat removal system thermo-siphon natural circulation loop temperature telemetry for station blackout",
        "slug": "molten-salt-reactor-decay-heat-removal-system-thermo-siphon-natural-circulation-loop-temperature-telemetry-for-station-blackout",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Decay Heat Safety Engineers & Passive Thermal System Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thermo-Siphon Telemetry"
    },
    {
        "id": 940,
        "keyword": "liquid fluoride salt containment vessel ultrasonic guided wave wall thinning and pitting corrosion telemetry for licensing",
        "slug": "liquid-fluoride-salt-containment-vessel-ultrasonic-guided-wave-wall-thinning-and-pitting-corrosion-telemetry-for-licensing",
        "category": "Solutions",
        "hub_category": "Advanced Nuclear Systems & Molten Salt Reactors",
        "target_persona": "Ultrasonic Inspection Specialists & Nuclear Regulatory Licensing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Guided Wave Corrosion Telemetry"
    }
]

def main():
    if not QUEUE_PATH.exists():
        print(f"Error: Queue file not found at {QUEUE_PATH}")
        return

    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        queue = json.load(f)

    existing_ids = {item["id"] for item in queue}
    existing_slugs = {item["slug"] for item in queue}

    added_count = 0
    for kw in wave21_keywords:
        if kw["id"] in existing_ids:
            print(f"Skipping duplicate ID {kw['id']}")
            continue
        if kw["slug"] in existing_slugs:
            print(f"Skipping duplicate slug {kw['slug']}")
            continue

        queue.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added_count += 1

    with open(QUEUE_PATH, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2, ensure_ascii=False)

    print(f"Successfully ingested {added_count} Wave 21 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
