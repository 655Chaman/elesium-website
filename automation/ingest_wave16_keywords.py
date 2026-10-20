#!/usr/bin/env python3
"""
ingest_wave16_keywords.py

Ingests Wave 16 BOFU Solution Keywords (IDs 641 to 690):
- Fusion Tokamak Plasma Magnetic Confinement & Divertor Heat Flux Telemetry (17 solutions, IDs 641-657)
- Deepwater Autonomous Underwater Vehicle (AUV) Acoustic Telemetry & Inertial Navigation (17 solutions, IDs 658-674)
- Commercial Aerospace Carbon Fiber Wing Spar Autoclave Curing Telemetry (16 solutions, IDs 675-690)

Scales total compact solutions queue from 640 to 690.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave16_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Fusion Tokamak Plasma Magnetic Confinement & Divertor (17 solutions, IDs 641-657)
    # -------------------------------------------------------------------------
    {
        "id": 641,
        "keyword": "divertor target plate infrared thermography heat flux monitors for tokamaks",
        "slug": "divertor-target-plate-infrared-thermography-heat-flux-monitors-for-tokamaks",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Tokamak Operations Directors & Plasma Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Audit Divertor Heat Flux Telemetry"
    },
    {
        "id": 642,
        "keyword": "poloidal field coil fast quench detection telemetry for fusion magnets",
        "slug": "poloidal-field-coil-fast-quench-detection-telemetry-for-fusion-magnets",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Quench Detection Telemetry"
    },
    {
        "id": 643,
        "keyword": "electron cyclotron resonance heating gyrotron power controllers for tokamaks",
        "slug": "electron-cyclotron-resonance-heating-gyrotron-power-controllers-for-tokamaks",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "RF Heating Leads & Plasma Diagnostics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gyrotron Power Controllers"
    },
    {
        "id": 644,
        "keyword": "plasma edge-localized mode magnetic perturbation coil controllers for fusion",
        "slug": "plasma-edge-localized-mode-magnetic-perturbation-coil-controllers-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "MHD Stability Scientists & Tokamak Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ELM Perturbation Controllers"
    },
    {
        "id": 645,
        "keyword": "toroidal field ripple Thomson scattering electron temperature telemetry for plasma",
        "slug": "toroidal-field-ripple-thomson-scattering-electron-temperature-telemetry-for-plasma",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Fusion Diagnostics Directors & Laser Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thomson Scattering Telemetry"
    },
    {
        "id": 646,
        "keyword": "fast camera bolometer radiated power loss tomographic inversion telemetry for fusion",
        "slug": "fast-camera-bolometer-radiated-power-loss-tomographic-inversion-telemetry-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Bolometry Instrumentation Leads & Optical Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tomographic Bolometer Telemetry"
    },
    {
        "id": 647,
        "keyword": "tritium breeding blanket helium coolant neutron flux monitoring agents for fusion",
        "slug": "tritium-breeding-blanket-helium-coolant-neutron-flux-monitoring-agents-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Nuclear Fuel Cycle Directors & Blanket Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Breeding Blanket Telemetry"
    },
    {
        "id": 648,
        "keyword": "Langmuir probe scrape-off layer plasma density telemetry for divertor chambers",
        "slug": "langmuir-probe-scrape-off-layer-plasma-density-telemetry-for-divertor-chambers",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Plasma Boundary Physicists & Diagnostics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Langmuir Density Telemetry"
    },
    {
        "id": 649,
        "keyword": "high-temperature superconducting tape quench risk acoustic sensors for fusion coils",
        "slug": "high-temperature-superconducting-tape-quench-risk-acoustic-sensors-for-fusion-coils",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "HTS Magnet Engineers & Cryogenic Protection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy HTS Acoustic Quench Sensors"
    },
    {
        "id": 650,
        "keyword": "neutral beam injection shine-through armor thermal protection controllers for fusion",
        "slug": "neutral-beam-injection-shine-through-armor-thermal-protection-controllers-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Neutral Beam Heating Leads & First Wall Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy NBI Armor Protection Controllers"
    },
    {
        "id": 651,
        "keyword": "deuterium-tritium cryogenic pellet injection speed controllers for tokamak core fueling",
        "slug": "deuterium-tritium-cryogenic-pellet-injection-speed-controllers-for-tokamak-core-fueling",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Cryogenic Fueling Engineers & Core Plasma Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pellet Injection Controllers"
    },
    {
        "id": 652,
        "keyword": "diamagnetic loop plasma stored energy diamagnetism telemetry for tokamak pulses",
        "slug": "diamagnetic-loop-plasma-stored-energy-diamagnetism-telemetry-for-tokamak-pulses",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Magnetic Diagnostics Leads & Plasma Control Scientists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Diamagnetic Stored Energy Telemetry"
    },
    {
        "id": 653,
        "keyword": "magnetic Rogowski coil total plasma current integration telemetry for fusion reactors",
        "slug": "magnetic-rogowski-coil-total-plasma-current-integration-telemetry-for-fusion-reactors",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Current Diagnostics Engineers & Tokamak Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Rogowski Current Telemetry"
    },
    {
        "id": 654,
        "keyword": "in-vessel beryllium first wall erosion laser-induced breakdown spectroscopy for fusion",
        "slug": "in-vessel-beryllium-first-wall-erosion-laser-induced-breakdown-spectroscopy-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Plasma-Facing Material Scientists & In-Vessel Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy First Wall Erosion Telemetry"
    },
    {
        "id": 655,
        "keyword": "tokamak cryostat thermal shield helium refrigeration temperature telemetry for fusion",
        "slug": "tokamak-cryostat-thermal-shield-helium-refrigeration-temperature-telemetry-for-fusion",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Cryogenic Plant Managers & Cryostat Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryostat Shield Telemetry"
    },
    {
        "id": 656,
        "keyword": "runaway electron avalanche synchrotron radiation emission detectors for disruption mitigation",
        "slug": "runaway-electron-avalanche-synchrotron-radiation-emission-detectors-for-disruption-mitigation",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Disruption Mitigation Leads & Plasma Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Runaway Electron Detectors"
    },
    {
        "id": 657,
        "keyword": "vertical displacement event halo current vessel wall shunt telemetry for tokamaks",
        "slug": "vertical-displacement-event-halo-current-vessel-wall-shunt-telemetry-for-tokamaks",
        "category": "Solutions",
        "hub_category": "Nuclear & Fusion Energy",
        "target_persona": "Structural Mechanics Leads & Tokamak Safety Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Halo Current Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Deepwater AUV Acoustic Telemetry & Navigation (17 solutions, IDs 658-674)
    # -------------------------------------------------------------------------
    {
        "id": 658,
        "keyword": "ultra-short baseline acoustic positioning transponder drift telemetry for deepwater AUVs",
        "slug": "ultra-short-baseline-acoustic-positioning-transponder-drift-telemetry-for-deepwater-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Robotics Directors & Hydrographic Survey Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy USBL Acoustic Positioning Telemetry"
    },
    {
        "id": 659,
        "keyword": "Doppler velocity log bottom-track acoustic lock loss compensation controllers for AUVs",
        "slug": "doppler-velocity-log-bottom-track-acoustic-lock-loss-compensation-controllers-for-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "AUV Navigation Engineers & Marine Autonomy Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy DVL Acoustic Lock Controllers"
    },
    {
        "id": 660,
        "keyword": "ring laser gyroscope strapdown inertial navigation Kalman filters for subsea survey",
        "slug": "ring-laser-gyroscope-strapdown-inertial-navigation-kalman-filters-for-subsea-survey",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Inertial Guidance Architects & Subsea Survey Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Strapdown INS Kalman Filters"
    },
    {
        "id": 661,
        "keyword": "synthetic aperture sonar seabed bathymetry micron-resolution telemetry for autonomous survey",
        "slug": "synthetic-aperture-sonar-seabed-bathymetry-micron-resolution-telemetry-for-autonomous-survey",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Acoustic Payload Leads & Geophysical Survey VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Synthetic Aperture Sonar Telemetry"
    },
    {
        "id": 662,
        "keyword": "pressure-tolerant lithium-iron-phosphate subsea battery cell balancing telemetry for AUVs",
        "slug": "pressure-tolerant-lithium-iron-phosphate-subsea-battery-cell-balancing-telemetry-for-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Power Systems Engineers & AUV Fleet Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Subsea Battery BMS Telemetry"
    },
    {
        "id": 663,
        "keyword": "acoustic release transponder emergency ascent fail-safe telemetry for deep ocean vehicles",
        "slug": "acoustic-release-transponder-emergency-ascent-fail-safe-telemetry-for-deep-ocean-vehicles",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Marine Safety Superintendents & Oceanographic Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Release Telemetry"
    },
    {
        "id": 664,
        "keyword": "subsea magnetic anomaly detection pipeline tracking controllers for autonomous inspection AUVs",
        "slug": "subsea-magnetic-anomaly-detection-pipeline-tracking-controllers-for-autonomous-inspection-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Pipeline Integrity Leads & Subsea Inspection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnetic Anomaly Tracking Controllers"
    },
    {
        "id": 665,
        "keyword": "forward-looking multibeam obstacle avoidance sonar telemetry for autonomous underwater vehicles",
        "slug": "forward-looking-multibeam-obstacle-avoidance-sonar-telemetry-for-autonomous-underwater-vehicles",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Autonomy Software Leads & Subsea Roboticists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Forward Obstacle Sonar Telemetry"
    },
    {
        "id": 666,
        "keyword": "hydrodynamic variable buoyancy engine hydraulic oil displacement telemetry for subsea gliders",
        "slug": "hydrodynamic-variable-buoyancy-engine-hydraulic-oil-displacement-telemetry-for-subsea-gliders",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Glider Flight Dynamics Engineers & Marine Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Buoyancy Engine Telemetry"
    },
    {
        "id": 667,
        "keyword": "deepwater syntactic foam hull micro-void hydrostatic compression telemetry for deep submergence",
        "slug": "deepwater-syntactic-foam-hull-micro-void-hydrostatic-compression-telemetry-for-deep-submergence",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Pressure Vessel Engineers & Subsea Materials Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Syntactic Foam Compression Telemetry"
    },
    {
        "id": 668,
        "keyword": "autonomous subsea docking station optical marker visual servoing controllers for resident AUVs",
        "slug": "autonomous-subsea-docking-station-optical-marker-visual-servoing-controllers-for-resident-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Resident Robotics Engineers & Offshore Subsea Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Subsea Docking Optical Controllers"
    },
    {
        "id": 669,
        "keyword": "subsea inductive wireless power transfer coil misalignment thermal telemetry for AUV docking",
        "slug": "subsea-inductive-wireless-power-transfer-coil-misalignment-thermal-telemetry-for-auv-docking",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Electrical Leads & Charging Infrastructure Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inductive Power Telemetry"
    },
    {
        "id": 670,
        "keyword": "acoustic Doppler current profiler water column shear velocity telemetry for autonomous gliders",
        "slug": "acoustic-doppler-current-profiler-water-column-shear-velocity-telemetry-for-autonomous-gliders",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Physical Oceanographers & Glider Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ADCP Current Velocity Telemetry"
    },
    {
        "id": 671,
        "keyword": "magneto-inductive seabed buried umbilical tracking magnetic sensor agents for survey AUVs",
        "slug": "magneto-inductive-seabed-buried-umbilical-tracking-magnetic-sensor-agents-for-survey-auvs",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Cable Tracking Specialists & Subsea Survey Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Buried Cable Tracking Telemetry"
    },
    {
        "id": 672,
        "keyword": "emergency seabed dead-man ballast weight drop release squib controllers for deep submergence",
        "slug": "emergency-seabed-dead-man-ballast-weight-drop-release-squib-controllers-for-deep-submergence",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Safety Leads & Submergence Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dead-Man Ballast Drop Controllers"
    },
    {
        "id": 673,
        "keyword": "underwater laser line scanner sub-millimeter 3D structural photogrammetry agents for subsea assets",
        "slug": "underwater-laser-line-scanner-sub-millimeter-3d-structural-photogrammetry-agents-for-subsea-assets",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Metrology Leads & Inspection Drone Operators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Line Scanner Telemetry"
    },
    {
        "id": 674,
        "keyword": "subsea acoustic modem multipath fading Doppler compensation telemetry for deepwater links",
        "slug": "subsea-acoustic-modem-multipath-fading-doppler-compensation-telemetry-for-deepwater-links",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Underwater Acoustic Communications Engineers & AUV Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Modem Doppler Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Aerospace Carbon Fiber Wing Spar Autoclave Curing (16 solutions, IDs 675-690)
    # -------------------------------------------------------------------------
    {
        "id": 675,
        "keyword": "embedded fiber Bragg grating composite spar resin flow front telemetry for autoclaves",
        "slug": "embedded-fiber-bragg-grating-composite-spar-resin-flow-front-telemetry-for-autoclaves",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Composites Manufacturing Directors & Optical Sensor Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy FBG Resin Flow Telemetry"
    },
    {
        "id": 676,
        "keyword": "dielectric cure monitoring thermoset resin cross-linking rate telemetry for aerospace spars",
        "slug": "dielectric-cure-monitoring-thermoset-resin-cross-linking-rate-telemetry-for-aerospace-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Polymer Cure Specialists & Aerospace Quality Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dielectric Cure Rate Telemetry"
    },
    {
        "id": 677,
        "keyword": "autoclave convective nitrogen gas temperature uniformity controllers for aircraft spars",
        "slug": "autoclave-convective-nitrogen-gas-temperature-uniformity-controllers-for-aircraft-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Autoclave Operations Managers & Thermal Process Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Autoclave Temperature Controllers"
    },
    {
        "id": 678,
        "keyword": "tooling coefficient of thermal expansion differential strain compensation telemetry for wing spars",
        "slug": "tooling-coefficient-of-thermal-expansion-differential-strain-compensation-telemetry-for-wing-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Aerospace Tooling Leads & Airframe Structural Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tooling Differential Strain Telemetry"
    },
    {
        "id": 679,
        "keyword": "vacuum bag debulking leak rate differential pressure drop telemetry for composite wing spars",
        "slug": "vacuum-bag-debulking-leak-rate-differential-pressure-drop-telemetry-for-composite-wing-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Composites Quality Assurance Leads & Layup Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vacuum Bag Leak Telemetry"
    },
    {
        "id": 680,
        "keyword": "ultrasonic guided wave spar laminate micro-porosity inspection telemetry for aerostructures",
        "slug": "ultrasonic-guided-wave-spar-laminate-micro-porosity-inspection-telemetry-for-aerostructures",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "NDT Level III Specialists & Aerostructures Quality VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ultrasonic Guided Wave Telemetry"
    },
    {
        "id": 681,
        "keyword": "automated fiber placement tow wrinkle shear angle optical inspection agents for wing spars",
        "slug": "automated-fiber-placement-tow-wrinkle-shear-angle-optical-inspection-agents-for-wing-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "AFP Automation Engineers & Composites Manufacturing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy AFP Tow Wrinkle Inspection Agents"
    },
    {
        "id": 682,
        "keyword": "epoxy resin exotherm runaway peak thermocouple monitoring controllers for thick composite spars",
        "slug": "epoxy-resin-exotherm-runaway-peak-thermocouple-monitoring-controllers-for-thick-composite-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Process Control Engineers & Composites Cure Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Resin Exotherm Peak Controllers"
    },
    {
        "id": 683,
        "keyword": "carbon fiber prepreg ply layup debonding laser line projection telemetry for aircraft spars",
        "slug": "carbon-fiber-prepreg-ply-layup-debonding-laser-line-projection-telemetry-for-aircraft-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Cleanroom Layup Managers & Aerospace Manufacturing Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ply Layup Laser Telemetry"
    },
    {
        "id": 684,
        "keyword": "autoclave vessel pressurization nitrogen inerting safety interlock controllers for composites",
        "slug": "autoclave-vessel-pressurization-nitrogen-inerting-safety-interlock-controllers-for-composites",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Autoclave Safety Directors & Plant Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nitrogen Inerting Interlock Controllers"
    },
    {
        "id": 685,
        "keyword": "spar root thick laminate void fraction micro-CT non-destructive telemetry for aerostructures",
        "slug": "spar-root-thick-laminate-void-fraction-micro-ct-non-destructive-telemetry-for-aerostructures",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Computed Tomography Specialists & Airframe Stress Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Micro-CT Void Fraction Telemetry"
    },
    {
        "id": 686,
        "keyword": "co-cured stringer composite joint peel stress optical fiber strain telemetry for wing spars",
        "slug": "co-cured-stringer-composite-joint-peel-stress-optical-fiber-strain-telemetry-for-wing-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Joint Integrity Engineers & Structural Test Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stringer Peel Stress Telemetry"
    },
    {
        "id": 687,
        "keyword": "composite spar mold semi-permanent release agent acoustic impedance verification telemetry",
        "slug": "composite-spar-mold-semi-permanent-release-agent-acoustic-impedance-verification-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Mold Preparation Leads & Composites Tooling Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mold Release Impedance Telemetry"
    },
    {
        "id": 688,
        "keyword": "epoxy resin matrix glass transition temperature dynamic mechanical analysis telemetry for spars",
        "slug": "epoxy-resin-matrix-glass-transition-temperature-dynamic-mechanical-analysis-telemetry-for-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Materials Characterization Leads & Aerospace Quality VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Glass Transition DMA Telemetry"
    },
    {
        "id": 689,
        "keyword": "prepreg out-life cleanroom ambient temperature-humidity tracking agents for aircraft wing spars",
        "slug": "prepreg-out-life-cleanroom-ambient-temperature-humidity-tracking-agents-for-aircraft-wing-spars",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Material Tracking Leads & Aerospace Inventory Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Prepreg Out-Life Tracking Agents"
    },
    {
        "id": 690,
        "keyword": "aircraft wing spar post-cure spring-in dimensional tolerance coordinate metrology agents",
        "slug": "aircraft-wing-spar-post-cure-spring-in-dimensional-tolerance-coordinate-metrology-agents",
        "category": "Solutions",
        "hub_category": "Aerospace Composites & Airframes",
        "target_persona": "Coordinate Metrology Leads & Aerospace Assembly Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Spring-In Metrology Agents"
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
    for kw in wave16_keywords:
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

    print(f"Successfully ingested {added_count} Wave 16 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
