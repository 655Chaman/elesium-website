#!/usr/bin/env python3
"""
ingest_wave19_keywords.py

Ingests Wave 19 BOFU Solution Keywords (IDs 791 to 840):
- Carbon Fiber Thermoplastic Tape Automated Fiber Placement (AFP) Telemetry (17 solutions, IDs 791-807)
- Superconducting Magnetic Energy Storage (SMES) Cryogenic Quench Detection Telemetry (17 solutions, IDs 808-824)
- Deep-Sea Mining Riser Pipe Slurry Hydraulic Lift Telemetry (16 solutions, IDs 825-840)

Scales total compact solutions queue from 790 to 840.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave19_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Automated Fiber Placement (AFP) Telemetry (17 solutions, IDs 791-807)
    # -------------------------------------------------------------------------
    {
        "id": 791,
        "keyword": "thermoplastic carbon fiber tape laser heating compaction roller temperature telemetry for AFP",
        "slug": "thermoplastic-carbon-fiber-tape-laser-heating-compaction-roller-temperature-telemetry-for-afp",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Automated Fiber Placement Engineers & Composite Tooling Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Compaction Telemetry"
    },
    {
        "id": 792,
        "keyword": "automated fiber placement tow steering path in-plane wrinkling detection vision telemetry for aerospace skins",
        "slug": "automated-fiber-placement-tow-steering-path-in-plane-wrinkling-detection-vision-telemetry-for-aerospace-skins",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Aerospace Composite Structures Leads & AFP Vision Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tow Wrinkling Telemetry"
    },
    {
        "id": 793,
        "keyword": "AFP inline ultrasonic NDT void content and inter-ply bonding consolidated tape telemetry for aircraft wings",
        "slug": "afp-inline-ultrasonic-ndt-void-content-and-inter-ply-bonding-consolidated-tape-telemetry-for-aircraft-wings",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Ultrasonic NDT Specialists & Wing Spar Manufacturing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inline Ultrasonic Telemetry"
    },
    {
        "id": 794,
        "keyword": "thermoplastic tape tension creel feed rate slip and fiber bunching telemetry for robotic AFP heads",
        "slug": "thermoplastic-tape-tension-creel-feed-rate-slip-and-fiber-bunching-telemetry-for-robotic-afp-heads",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Robotic Creel System Engineers & Fiber Placement Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Creel Tension Telemetry"
    },
    {
        "id": 795,
        "keyword": "automated fiber placement compaction force load cell pressure distribution telemetry for double-curvature mandrels",
        "slug": "automated-fiber-placement-compaction-force-load-cell-pressure-distribution-telemetry-for-double-curvature-mandrels",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Mandrel Tooling Architects & Compaction Mechanics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Compaction Pressure Telemetry"
    },
    {
        "id": 796,
        "keyword": "thermoplastic matrix consolidation thermal history and crystallinity degree telemetry for aerospace spars",
        "slug": "thermoplastic-matrix-consolidation-thermal-history-and-crystallinity-degree-telemetry-for-aerospace-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Polymer Crystallinity Scientists & Aerospace Spar Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Matrix Crystallinity Telemetry"
    },
    {
        "id": 797,
        "keyword": "AFP robotic head laser pyrometer closed-loop heat flux telemetry for variable speed tape deposition",
        "slug": "afp-robotic-head-laser-pyrometer-closed-loop-heat-flux-telemetry-for-variable-speed-tape-deposition",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Laser Thermal Optics Leads & Variable Speed Deposition Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Heat Flux Telemetry"
    },
    {
        "id": 798,
        "keyword": "carbon fiber tow edge gap and overlap photogrammetry telemetry for high-rate fuselage placement",
        "slug": "carbon-fiber-tow-edge-gap-and-overlap-photogrammetry-telemetry-for-high-rate-fuselage-placement",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Fuselage Assembly Superintendents & Photogrammetry Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tow Gap Photogrammetry Telemetry"
    },
    {
        "id": 799,
        "keyword": "thermoplastic composite mandrel thermal expansion differential tool deflection telemetry for autoclave-free curing",
        "slug": "thermoplastic-composite-mandrel-thermal-expansion-differential-tool-deflection-telemetry-for-autoclave-free-curing",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Out-of-Autoclave Process Engineers & Invar Tooling Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mandrel Deflection Telemetry"
    },
    {
        "id": 800,
        "keyword": "AFP compaction roller elastomeric compliance wear and thermal degradation telemetry for commercial aviation",
        "slug": "afp-compaction-roller-elastomeric-compliance-wear-and-thermal-degradation-telemetry-for-commercial-aviation",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Robotic End-Effector Maintenance Leads & Aviation Tooling Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Roller Degradation Telemetry"
    },
    {
        "id": 801,
        "keyword": "robotic automated fiber placement multi-axis end-effector positional vibration damping telemetry for complex moulds",
        "slug": "robotic-automated-fiber-placement-multi-axis-end-effector-positional-vibration-damping-telemetry-for-complex-moulds",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Robotics Kinematics Engineers & Precision Mould Layup Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Kinematic Vibration Telemetry"
    },
    {
        "id": 802,
        "keyword": "carbon fiber tape tow cutting and restart pneumatic shear knife timing telemetry for high-speed layups",
        "slug": "carbon-fiber-tape-tow-cutting-and-restart-pneumatic-shear-knife-timing-telemetry-for-high-speed-layups",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Pneumatic Cutting Mechanism Leads & High-Speed AFP Operators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Shear Knife Timing Telemetry"
    },
    {
        "id": 803,
        "keyword": "thermoplastic composite interlaminar shear strength in-situ consolidation telemetry for aerospace structures",
        "slug": "thermoplastic-composite-interlaminar-shear-strength-in-situ-consolidation-telemetry-for-aerospace-structures",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Structural Mechanics Leads & Composite Qualification Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Interlaminar Shear Telemetry"
    },
    {
        "id": 804,
        "keyword": "AFP deposition chamber humidity and nitrogen inert atmosphere oxygen content telemetry for thermoplastic tape",
        "slug": "afp-deposition-chamber-humidity-and-nitrogen-inert-atmosphere-oxygen-content-telemetry-for-thermoplastic-tape",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Cleanroom Atmospheric Quality Leads & Thermoplastic Resin Chemists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inert Atmosphere Telemetry"
    },
    {
        "id": 805,
        "keyword": "automated fiber placement tape tackiness and substrate preheat temperature telemetry for cryogenic fuel tanks",
        "slug": "automated-fiber-placement-tape-tackiness-and-substrate-preheat-temperature-telemetry-for-cryogenic-fuel-tanks",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Cryogenic Tank Manufacturing Leads & Space Launch Vehicle Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Substrate Preheat Telemetry"
    },
    {
        "id": 806,
        "keyword": "thermoplastic tape automated defect marking laser projection coordinate telemetry for composite quality control",
        "slug": "thermoplastic-tape-automated-defect-marking-laser-projection-coordinate-telemetry-for-composite-quality-control",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Composite Quality Assurance Leads & Laser Projection Metrology Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Projection Telemetry"
    },
    {
        "id": 807,
        "keyword": "AFP tow tensioner magnetic particle brake torque and spool inertia compensation telemetry for composite manufacturing",
        "slug": "afp-tow-tensioner-magnetic-particle-brake-torque-and-spool-inertia-compensation-telemetry-for-composite-manufacturing",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Advanced Manufacturing",
        "target_persona": "Tension Control System Engineers & Advanced Manufacturing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnetic Brake Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Superconducting Magnetic Energy Storage (SMES) Telemetry (17 solutions, IDs 808-824)
    # -------------------------------------------------------------------------
    {
        "id": 808,
        "keyword": "superconducting magnetic energy storage HTS tape resistive transition voltage tap telemetry for quench protection",
        "slug": "superconducting-magnetic-energy-storage-hts-tape-resistive-transition-voltage-tap-telemetry-for-quench-protection",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Superconducting Magnet Engineers & SMES Quench Protection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Quench Protection Telemetry"
    },
    {
        "id": 809,
        "keyword": "SMES coil cryogenic liquid helium boil-off rate and vapor pressure telemetry for grid peak shaving",
        "slug": "smes-coil-cryogenic-liquid-helium-boil-off-rate-and-vapor-pressure-telemetry-for-grid-peak-shaving",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Cryogenic Plant Operations Directors & Grid Peak Shaving Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Helium Boil-Off Telemetry"
    },
    {
        "id": 810,
        "keyword": "high-temperature superconducting coil fiber optic Bragg grating distributed temperature sensing telemetry for SMES",
        "slug": "high-temperature-superconducting-coil-fiber-optic-bragg-grating-distributed-temperature-sensing-telemetry-for-smes",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "FBG Fiber Optic Sensing Leads & HTS Magnet Designers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy FBG Temperature Telemetry"
    },
    {
        "id": 811,
        "keyword": "SMES dump resistor energy extraction circuit breaker commutation telemetry for rapid quench discharge",
        "slug": "smes-dump-resistor-energy-extraction-circuit-breaker-commutation-telemetry-for-rapid-quench-discharge",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "High-Current Switchgear Engineers & Magnet Energy Extraction Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dump Resistor Telemetry"
    },
    {
        "id": 812,
        "keyword": "superconducting magnet persistent current switch thermal cycle resistance telemetry for microgrid stability",
        "slug": "superconducting-magnet-persistent-current-switch-thermal-cycle-resistance-telemetry-for-microgrid-stability",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Microgrid Power Stability Engineers & Persistent Switch Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Persistent Switch Telemetry"
    },
    {
        "id": 813,
        "keyword": "SMES cryostat vacuum insulation Pirani gauge pressure telemetry for sub-cooled liquid nitrogen vessels",
        "slug": "smes-cryostat-vacuum-insulation-pirani-gauge-pressure-telemetry-for-sub-cooled-liquid-nitrogen-vessels",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Vacuum Cryostat Integrity Leads & Cryogenic Vessel Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryostat Vacuum Telemetry"
    },
    {
        "id": 814,
        "keyword": "superconducting coil electromagnetic Lorentz force mechanical strain gauge telemetry for pulse power systems",
        "slug": "superconducting-coil-electromagnetic-lorentz-force-mechanical-strain-gauge-telemetry-for-pulse-power-systems",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Electromagnetic Structural Analysis Leads & Pulse Power Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Lorentz Force Telemetry"
    },
    {
        "id": 815,
        "keyword": "SMES power conversion system IGBT bi-directional inverter switching transient telemetry for renewable firming",
        "slug": "smes-power-conversion-system-igbt-bi-directional-inverter-switching-transient-telemetry-for-renewable-firming",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Power Electronics Architects & Renewable Grid Integration Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inverter Switching Telemetry"
    },
    {
        "id": 816,
        "keyword": "HTS superconducting magnet critical current degradation acoustic emission telemetry for pulsed grid storage",
        "slug": "hts-superconducting-magnet-critical-current-degradation-acoustic-emission-telemetry-for-pulsed-grid-storage",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Critical Current Testing Leads & HTS Magnet Reliability Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnet Degradation Telemetry"
    },
    {
        "id": 817,
        "keyword": "SMES current lead thermal conduction vapor-cooled cryogenic temperature telemetry for low heat-leak design",
        "slug": "smes-current-lead-thermal-conduction-vapor-cooled-cryogenic-temperature-telemetry-for-low-heat-leak-design",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Vapor-Cooled Current Lead Leads & Thermal Efficiency Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Current Lead Telemetry"
    },
    {
        "id": 818,
        "keyword": "superconducting energy storage magnetic stray field shielding Hall probe telemetry for industrial substations",
        "slug": "superconducting-energy-storage-magnetic-stray-field-shielding-hall-probe-telemetry-for-industrial-substations",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Substation Safety Directors & Magnetic Shielding Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stray Field Hall Telemetry"
    },
    {
        "id": 819,
        "keyword": "SMES coil inter-turn short circuit differential inductance telemetry for pulsed power magnet protection",
        "slug": "smes-coil-inter-turn-short-circuit-differential-inductance-telemetry-for-pulsed-power-magnet-protection",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Magnet Protection Engineers & Pulsed Power System Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inter-Turn Short Telemetry"
    },
    {
        "id": 820,
        "keyword": "cryogenic pulse tube refrigerator second stage thermal load cold head telemetry for SMES longevity",
        "slug": "cryogenic-pulse-tube-refrigerator-second-stage-thermal-load-cold-head-telemetry-for-smes-longevity",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Pulse Tube Cryocooler Specialists & SMES Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cold Head Thermal Telemetry"
    },
    {
        "id": 821,
        "keyword": "SMES high-voltage ground insulation dielectric breakdown risk partial discharge telemetry for utility coils",
        "slug": "smes-high-voltage-ground-insulation-dielectric-breakdown-risk-partial-discharge-telemetry-for-utility-coils",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "High-Voltage Insulation Specialists & Utility Substation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Partial Discharge Telemetry"
    },
    {
        "id": 822,
        "keyword": "superconducting magnetic energy storage round-trip AC loss calorimetric telemetry for grid frequency regulation",
        "slug": "superconducting-magnetic-energy-storage-round-trip-ac-loss-calorimetric-telemetry-for-grid-frequency-regulation",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "AC Loss Calorimetry Researchers & Frequency Regulation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy AC Loss Calorimetry Telemetry"
    },
    {
        "id": 823,
        "keyword": "HTS tape delamination stress acoustic wave telemetry for high-field conduction-cooled SMES coils",
        "slug": "hts-tape-delamination-stress-acoustic-wave-telemetry-for-high-field-conduction-cooled-smes-coils",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Conduction-Cooled Magnet Leads & High-Field Superconductor Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tape Delamination Telemetry"
    },
    {
        "id": 824,
        "keyword": "SMES superconducting coil liquid neon subcooling circulation pump telemetry for fast-response grid reserves",
        "slug": "smes-superconducting-coil-liquid-neon-subcooling-circulation-pump-telemetry-for-fast-response-grid-reserves",
        "category": "Solutions",
        "hub_category": "Superconducting Power & Grid Energy Storage",
        "target_persona": "Cryogenic Circulation Pump Leads & Fast Frequency Reserve Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Liquid Neon Pump Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Deep-Sea Mining Riser Slurry Hydraulic Lift Telemetry (16 solutions, IDs 825-840)
    # -------------------------------------------------------------------------
    {
        "id": 825,
        "keyword": "deep-sea polymetallic nodule vertical riser pipe slurry density radiometric gamma telemetry for hydraulic lift",
        "slug": "deep-sea-polymetallic-nodule-vertical-riser-pipe-slurry-density-radiometric-gamma-telemetry-for-hydraulic-lift",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Deep-Sea Mining Operations Directors & Vertical Lift Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Slurry Density Telemetry"
    },
    {
        "id": 826,
        "keyword": "subsea slurry lift centrifugal pump impeller abrasive slurry erosion telemetry for abyssal mining",
        "slug": "subsea-slurry-lift-centrifugal-pump-impeller-abrasive-slurry-erosion-telemetry-for-abyssal-mining",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Subsea Pump Erosion Specialists & Marine Mineral Extraction Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pump Erosion Telemetry"
    },
    {
        "id": 827,
        "keyword": "deepwater vertical riser vortex-induced vibration hydrodynamic drag telemetry for dynamic positioning vessels",
        "slug": "deepwater-vertical-riser-vortex-induced-vibration-hydrodynamic-drag-telemetry-for-dynamic-positioning-vessels",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Riser Hydrodynamics Specialists & Dynamic Positioning Navigators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Riser VIV Telemetry"
    },
    {
        "id": 828,
        "keyword": "subsea vertical slurry riser pipe acoustic pulse internal nodule slugging telemetry for blockage prevention",
        "slug": "subsea-vertical-slurry-riser-pipe-acoustic-pulse-internal-nodule-slugging-telemetry-for-blockage-prevention",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Flow Assurance Leads & Subsea Slurry Pipeline Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nodule Slugging Telemetry"
    },
    {
        "id": 829,
        "keyword": "seafloor collector crawler slurry discharge pressure and volumetric flow rate telemetry for riser feed systems",
        "slug": "seafloor-collector-crawler-slurry-discharge-pressure-and-volumetric-flow-rate-telemetry-for-riser-feed-systems",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Seafloor Robotics Operations Leads & Riser Feed Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Collector Discharge Telemetry"
    },
    {
        "id": 830,
        "keyword": "deep-sea mining riser bottom flexible jumper pipe cyclic fatigue telemetry for 4000-meter depths",
        "slug": "deep-sea-mining-riser-bottom-flexible-jumper-pipe-cyclic-fatigue-telemetry-for-4000-meter-depths",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Subsea Flexible Jumper Integrity Engineers & Deepwater Mining Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Jumper Fatigue Telemetry"
    },
    {
        "id": 831,
        "keyword": "subsea vertical riser air lift multiphase flow gas injection rate differential pressure telemetry for nodule recovery",
        "slug": "subsea-vertical-riser-air-lift-multiphase-flow-gas-injection-rate-differential-pressure-telemetry-for-nodule-recovery",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Air Lift Multiphase Flow Specialists & Marine Extraction Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Air Lift Pressure Telemetry"
    },
    {
        "id": 832,
        "keyword": "vertical mining riser top tensioner gimbal joint angular deflection telemetry for offshore production vessels",
        "slug": "vertical-mining-riser-top-tensioner-gimbal-joint-angular-deflection-telemetry-for-offshore-production-vessels",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Tensioner System Engineers & Offshore Marine Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gimbal Deflection Telemetry"
    },
    {
        "id": 833,
        "keyword": "deep-sea slurry lift electric submersible motor winding temperature telemetry for high-pressure abyssal zones",
        "slug": "deep-sea-slurry-lift-electric-submersible-motor-winding-temperature-telemetry-for-high-pressure-abyssal-zones",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Subsea Electrical Motor Designers & Abyssal Power Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Motor Winding Telemetry"
    },
    {
        "id": 834,
        "keyword": "subsea mining riser pipe wall ultrasonic thickness loss corrosion-erosion telemetry for nodule transport",
        "slug": "subsea-mining-riser-pipe-wall-ultrasonic-thickness-loss-corrosion-erosion-telemetry-for-nodule-transport",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Subsea Pipeline Corrosion Leads & Non-Destructive Testing Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wall Thickness Telemetry"
    },
    {
        "id": 835,
        "keyword": "deepwater vertical slurry riser gas bubble collapse cavitation acoustic emission telemetry for lift pumps",
        "slug": "deepwater-vertical-slurry-riser-gas-bubble-collapse-cavitation-acoustic-emission-telemetry-for-lift-pumps",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Cavitation Diagnostics Engineers & Subsea Pump Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cavitation Acoustic Telemetry"
    },
    {
        "id": 836,
        "keyword": "subsea slurry dump valve acoustic release and rapid depressurization telemetry for riser emergency flush",
        "slug": "subsea-slurry-dump-valve-acoustic-release-and-rapid-depressurization-telemetry-for-riser-emergency-flush",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Emergency Dump Valve Specialists & Subsea Pipeline Safety Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dump Valve Telemetry"
    },
    {
        "id": 837,
        "keyword": "deep-sea nodule crusher feed hopper slurry level and oversize blockage sonar telemetry for mining crawlers",
        "slug": "deep-sea-nodule-crusher-feed-hopper-slurry-level-and-oversize-blockage-sonar-telemetry-for-mining-crawlers",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Sonar Imaging Engineers & Seafloor Crusher Operators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hopper Sonar Telemetry"
    },
    {
        "id": 838,
        "keyword": "vertical slurry lift riser seabed anchor suction pile tension load telemetry for abyssal mooring safety",
        "slug": "vertical-slurry-lift-riser-seabed-anchor-suction-pile-tension-load-telemetry-for-abyssal-mooring-safety",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Geotechnical Mooring Specialists & Subsea Anchor Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Suction Pile Telemetry"
    },
    {
        "id": 839,
        "keyword": "subsea mining riser electric power umbilical thermal dissipation and tension telemetry for 5000-meter lines",
        "slug": "subsea-mining-riser-electric-power-umbilical-thermal-dissipation-and-tension-telemetry-for-5000-meter-lines",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Deepwater Umbilical Engineers & High-Voltage Subsea Cable Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Power Umbilical Telemetry"
    },
    {
        "id": 840,
        "keyword": "deep-sea return water reinjection pipeline midwater discharge plume turbidity telemetry for environmental compliance",
        "slug": "deep-sea-return-water-reinjection-pipeline-midwater-discharge-plume-turbidity-telemetry-for-environmental-compliance",
        "category": "Solutions",
        "hub_category": "Deep-Sea Extraction & Subsea Mining Telemetry",
        "target_persona": "Marine Environmental Compliance Directors & Turbidity Sensor Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Plume Turbidity Telemetry"
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
    for kw in wave19_keywords:
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

    print(f"Successfully ingested {added_count} Wave 19 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
