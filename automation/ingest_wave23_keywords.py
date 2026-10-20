#!/usr/bin/env python3
"""
ingest_wave23_keywords.py

Ingests Wave 23 BOFU Solution Keywords (IDs 991 to 1,040):
- Semiconductor High-NA EUV Anamorphic Projection Lens Wavefront Aberration Shearing Interferometry Telemetry (17 solutions, IDs 991-1007)
- Spacecraft Autonomous Proximity Operations & Lunar Lander Vision Navigation Telemetry (17 solutions, IDs 1008-1024)
- Subsea Carbon Capture & Deep Offshore Geological Storage Telemetry (16 solutions, IDs 1025-1040)

Scales total compact solutions queue from 990 to 1,040 (Crossing the historic 1,000+ Solutions Milestone!).
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave23_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: High-NA EUV Lens Wavefront Aberration Interferometry (17 solutions, IDs 991-1007)
    # -------------------------------------------------------------------------
    {
        "id": 991,
        "keyword": "high-NA EUV anamorphic projection lens wavefront aberration lateral shearing interferometry telemetry for sub-1nm overlay",
        "slug": "high-na-euv-anamorphic-projection-lens-wavefront-aberration-lateral-shearing-interferometry-telemetry-for-sub-1nm-overlay",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "High-NA Lithography Architects & Wavefront Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy High-NA Wavefront Telemetry"
    },
    {
        "id": 992,
        "keyword": "anamorphic EUV mirror thermal expansion Zernike polynomial dynamic compensation telemetry for high-NA scanners",
        "slug": "anamorphic-euv-mirror-thermal-expansion-zernike-polynomial-dynamic-compensation-telemetry-for-high-na-scanners",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Optical Systems Engineers & EUV Thermal Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Zernike Compensation Telemetry"
    },
    {
        "id": 993,
        "keyword": "high-NA EUV projection optics box multi-axis piezoelectric actuator sub-nanometer position telemetry for drift elimination",
        "slug": "high-na-euv-projection-optics-box-multi-axis-piezoelectric-actuator-sub-nanometer-position-telemetry-for-drift-elimination",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Mechatronics Control Leads & Nanopositioning Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nanopositioning Telemetry"
    },
    {
        "id": 994,
        "keyword": "extreme ultraviolet pellicle acoustic standing wave dynamic micro-pressure telemetry for high-acceleration reticle stages",
        "slug": "extreme-ultraviolet-pellicle-acoustic-standing-wave-dynamic-micro-pressure-telemetry-for-high-acceleration-reticle-stages",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Reticle Stage Dynamics Leads & Pellicle Reliability Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stage Dynamic Pressure Telemetry"
    },
    {
        "id": 995,
        "keyword": "high-NA EUV multi-layer molybdenum silicon mirror actinic reflectance degradation X-ray reflectometry telemetry",
        "slug": "high-na-euv-multi-layer-molybdenum-silicon-mirror-actinic-reflectance-degradation-x-ray-reflectometry-telemetry",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Optics Coating Specialists & Scanner Uptime Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Multi-Layer Reflectometry Telemetry"
    },
    {
        "id": 996,
        "keyword": "anamorphic EUV reticle 8x magnification y-axis slit illumination uniformity photodiode array telemetry for wafer fabs",
        "slug": "anamorphic-euv-reticle-8x-magnification-y-axis-slit-illumination-uniformity-photodiode-array-telemetry-for-wafer-fabs",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Illumination Field Engineers & Fab Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Slit Illumination Telemetry"
    },
    {
        "id": 997,
        "keyword": "EUV wafer stage magnetic levitation planar motor eddy current loss calorimeter telemetry for thermal stability",
        "slug": "euv-wafer-stage-magnetic-levitation-planar-motor-eddy-current-loss-calorimeter-telemetry-for-thermal-stability",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Planar Motor Specialists & Stage Thermal Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Planar Motor Telemetry"
    },
    {
        "id": 998,
        "keyword": "high-NA EUV line edge roughness atomic force microscopy automated tip metrology telemetry for resist screening",
        "slug": "high-na-euv-line-edge-roughness-atomic-force-microscopy-automated-tip-metrology-telemetry-for-resist-screening",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Photoresist Chemists & Metrology Automation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy AFM Metrology Telemetry"
    },
    {
        "id": 999,
        "keyword": "extreme ultraviolet scanner pellicle border thermal stress fiber-optic strain rosette telemetry for burst mitigation",
        "slug": "extreme-ultraviolet-scanner-pellicle-border-thermal-stress-fiber-optic-strain-rosette-telemetry-for-burst-mitigation",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Pellicle Integration Engineers & Scanner Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Border Strain Telemetry"
    },
    {
        "id": 1000,
        "keyword": "high-NA EUV obscuration pupil transmission knife-edge scanning wavefront sensor telemetry for tool matching",
        "slug": "high-na-euv-obscuration-pupil-transmission-knife-edge-scanning-wavefront-sensor-telemetry-for-tool-matching",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Scanner Fleet Matching Leads & Pupil Metrology Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pupil Wavefront Telemetry"
    },
    {
        "id": 1001,
        "keyword": "extreme ultraviolet mask blank phase defect darkfield actinic optical inspection telemetry for zero-defect reticles",
        "slug": "extreme-ultraviolet-mask-blank-phase-defect-darkfield-actinic-optical-inspection-telemetry-for-zero-defect-reticles",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Mask Inspection Specialists & Photomask Quality Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mask Defect Telemetry"
    },
    {
        "id": 1002,
        "keyword": "high-NA EUV dose sensor in-situ diamond photodiode radiation hardness degradation telemetry for dose control",
        "slug": "high-na-euv-dose-sensor-in-situ-diamond-photodiode-radiation-hardness-degradation-telemetry-for-dose-control",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Dose Calibration Engineers & Radiation Detector Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Diamond Photodiode Telemetry"
    },
    {
        "id": 1003,
        "keyword": "extreme ultraviolet reticle clamp electrostatic field distortion capacitive sensor telemetry for pod unloaders",
        "slug": "extreme-ultraviolet-reticle-clamp-electrostatic-field-distortion-capacitive-sensor-telemetry-for-pod-unloaders",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Reticle Pod Handling Leads & Electrostatic Chuck Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Clamp Field Telemetry"
    },
    {
        "id": 1004,
        "keyword": "high-NA EUV resist stochastic defect automated scanning electron microscopy edge-placement telemetry for advanced nodes",
        "slug": "high-na-euv-resist-stochastic-defect-automated-scanning-electron-microscopy-edge-placement-telemetry-for-advanced-nodes",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "CD-SEM Engineers & Stochastic Defect Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stochastic CD-SEM Telemetry"
    },
    {
        "id": 1005,
        "keyword": "anamorphic EUV projection optics ultra-high vacuum turbomolecular pump vibration isolation telemetry for wafer stages",
        "slug": "anamorphic-euv-projection-optics-ultra-high-vacuum-turbomolecular-pump-vibration-isolation-telemetry-for-wafer-stages",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Vacuum Dynamics Engineers & Scanner Vibration Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vacuum Pump Vibrometry Telemetry"
    },
    {
        "id": 1006,
        "keyword": "high-NA EUV multi-layer ruthenium-capped collector mirror hydrogen cleaning radical flux telemetry for fab uptime",
        "slug": "high-na-euv-multi-layer-ruthenium-capped-collector-mirror-hydrogen-cleaning-radical-flux-telemetry-for-fab-uptime",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Source Technologists & Collector Maintenance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hydrogen Radical Telemetry"
    },
    {
        "id": 1007,
        "keyword": "extreme ultraviolet reticle pod inner door sealing micro-leak helium mass spectrometer telemetry for mask cleanrooms",
        "slug": "extreme-ultraviolet-reticle-pod-inner-door-sealing-micro-leak-helium-mass-spectrometer-telemetry-for-mask-cleanrooms",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Cleanroom Reticle Managers & Fab Yield Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pod Leak Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Spacecraft Proximity Operations & Lunar Navigation (17 solutions, IDs 1008-1024)
    # -------------------------------------------------------------------------
    {
        "id": 1008,
        "keyword": "lunar lander terrain-relative navigation optical flow crater detection real-time telemetry for pinpoint touchdown",
        "slug": "lunar-lander-terrain-relative-navigation-optical-flow-crater-detection-real-time-telemetry-for-pinpoint-touchdown",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Lunar GNC Engineers & Spacecraft Navigation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Terrain Navigation Telemetry"
    },
    {
        "id": 1009,
        "keyword": "spacecraft autonomous rendezvous LIDAR 3D point cloud pose estimation telemetry for orbital docking mechanisms",
        "slug": "spacecraft-autonomous-rendezvous-lidar-3d-point-cloud-pose-estimation-telemetry-for-orbital-docking-mechanisms",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Orbital Rendezvous Specialists & Docking Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Orbital Docking Telemetry"
    },
    {
        "id": 1010,
        "keyword": "lunar lander pulsed bipropellant RCS thruster chamber pressure transducer telemetry for descent trajectory control",
        "slug": "lunar-lander-pulsed-bipropellant-rcs-thruster-chamber-pressure-transducer-telemetry-for-descent-trajectory-control",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Propulsion Systems Engineers & Lander Trajectory Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RCS Thruster Telemetry"
    },
    {
        "id": 1011,
        "keyword": "autonomous satellite proximity operations relative navigation carrier-phase differential GPS telemetry for formation flying",
        "slug": "autonomous-satellite-proximity-operations-relative-navigation-carrier-phase-differential-gps-telemetry-for-formation-flying",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Formation Flying Architects & Satellite Constellation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Differential GPS Telemetry"
    },
    {
        "id": 1012,
        "keyword": "lunar lander crushing aluminum honeycomb shock absorber strain displacement telemetry for landing gear impact",
        "slug": "lunar-lander-crushing-aluminum-honeycomb-shock-absorber-strain-displacement-telemetry-for-landing-gear-impact",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Lander Structural Engineers & Touchdown Dynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Landing Gear Telemetry"
    },
    {
        "id": 1013,
        "keyword": "deep space cubesat cold gas attitude determination star tracker quaternion telemetry for deep space cruise",
        "slug": "deep-space-cubesat-cold-gas-attitude-determination-star-tracker-quaternion-telemetry-for-deep-space-cruise",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "CubeSat GNC Leads & SmallSat Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Star Tracker Telemetry"
    },
    {
        "id": 1014,
        "keyword": "lunar surface regolith hazard detection flash LIDAR slope slope-angle telemetry for autonomous safe site landing",
        "slug": "lunar-surface-regolith-hazard-detection-flash-lidar-slope-slope-angle-telemetry-for-autonomous-safe-site-landing",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Hazard Detection Specialists & Autonomous Lander Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flash LIDAR Telemetry"
    },
    {
        "id": 1015,
        "keyword": "spacecraft active capture robotic arm end-effector force-torque sensor telemetry for uncooperative debris retrieval",
        "slug": "spacecraft-active-capture-robotic-arm-end-effector-force-torque-sensor-telemetry-for-uncooperative-debris-retrieval",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Orbital Servicing Engineers & Debris Remediation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Debris Capture Telemetry"
    },
    {
        "id": 1016,
        "keyword": "lunar descent engine variable thrust pintle valve stepper motor position encoder telemetry for soft touchdowns",
        "slug": "lunar-descent-engine-variable-thrust-pintle-valve-stepper-motor-position-encoder-telemetry-for-soft-touchdowns",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Descent Propulsion Engineers & Throttle Valve Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pintle Valve Telemetry"
    },
    {
        "id": 1017,
        "keyword": "satellite cross-link laser optical terminal fine pointing mirror piezo actuator telemetry for megaconstellations",
        "slug": "satellite-cross-link-laser-optical-terminal-fine-pointing-mirror-piezo-actuator-telemetry-for-megaconstellations",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Optical Intersatellite Link Leads & Lasercom Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Terminal Telemetry"
    },
    {
        "id": 1018,
        "keyword": "lunar lander fuel slosh propellant management device capacitive liquid level sensor telemetry for low-g burns",
        "slug": "lunar-lander-fuel-slosh-propellant-management-device-capacitive-liquid-level-sensor-telemetry-for-low-g-burns",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Propellant Management Specialists & Microgravity Fluid Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Propellant Slosh Telemetry"
    },
    {
        "id": 1019,
        "keyword": "spacecraft docking ring electromagnetic latch engagement status microswitch telemetry for pressurized crew modules",
        "slug": "spacecraft-docking-ring-electromagnetic-latch-engagement-status-microswitch-telemetry-for-pressurized-crew-modules",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Crew Systems Engineers & Docking Mechanism Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Docking Latch Telemetry"
    },
    {
        "id": 1020,
        "keyword": "lunar rover wheel regolith slip-sinkage optical odometry motor torque telemetry for steep crater rim traverses",
        "slug": "lunar-rover-wheel-regolith-slip-sinkage-optical-odometry-motor-torque-telemetry-for-steep-crater-rim-traverses",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Rover Mobility Specialists & Terramechanics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Rover Terramechanics Telemetry"
    },
    {
        "id": 1021,
        "keyword": "spacecraft control moment gyroscope rotor spin speed bearing vibration telemetry for high-agility slews",
        "slug": "spacecraft-control-moment-gyroscope-rotor-spin-speed-bearing-vibration-telemetry-for-high-agility-slews",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Attitude Control Leads & CMG Hardware Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy CMG Bearing Telemetry"
    },
    {
        "id": 1022,
        "keyword": "lunar surface radioisotope thermoelectric generator thermoelectric couple voltage decay telemetry for polar bases",
        "slug": "lunar-surface-radioisotope-thermoelectric-generator-thermoelectric-couple-voltage-decay-telemetry-for-polar-bases",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Nuclear Space Power Leads & Lunar Infrastructure Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RTG Power Telemetry"
    },
    {
        "id": 1023,
        "keyword": "orbital servicing grapple fixture micro-conical capture interface contact switch telemetry for satellite refueling",
        "slug": "orbital-servicing-grapple-fixture-micro-conical-capture-interface-contact-switch-telemetry-for-satellite-refueling",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Satellite Life Extension Leads & On-Orbit Servicing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Refueling Interface Telemetry"
    },
    {
        "id": 1024,
        "keyword": "lunar lander terminal descent radar Doppler altimeter multi-beam velocity vector telemetry for touchdown engines",
        "slug": "lunar-lander-terminal-descent-radar-doppler-altimeter-multi-beam-velocity-vector-telemetry-for-touchdown-engines",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Radar Altimetry Specialists & Terminal Guidance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Doppler Altimeter Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Subsea Carbon Capture & Deep Geological Storage (16 solutions, IDs 1025-1040)
    # -------------------------------------------------------------------------
    {
        "id": 1025,
        "keyword": "subsea CO2 injection wellhead supercritical phase transition pressure-temperature transducer telemetry for carbon storage",
        "slug": "subsea-co2-injection-wellhead-supercritical-phase-transition-pressure-temperature-transducer-telemetry-for-carbon-storage",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Subsea Carbon Storage Engineers & CCS Injection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Subsea CO2 Wellhead Telemetry"
    },
    {
        "id": 1026,
        "keyword": "deep offshore saline aquifer carbon sequestration caprock micro-seismic geophone array telemetry for fault reactivation",
        "slug": "deep-offshore-saline-aquifer-carbon-sequestration-caprock-micro-seismic-geophone-array-telemetry-for-fault-reactivation",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Caprock Integrity Geologists & Micro-Seismic Monitoring Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Caprock Seismic Telemetry"
    },
    {
        "id": 1027,
        "keyword": "subsea carbon storage pipeline fiber-optic distributed acoustic sensing DAS micro-leak detection telemetry for seabed arrays",
        "slug": "subsea-carbon-storage-pipeline-fiber-optic-distributed-acoustic-sensing-das-micro-leak-detection-telemetry-for-seabed-arrays",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Pipeline Integrity Engineers & Fiber-Optic Acoustic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pipeline DAS Telemetry"
    },
    {
        "id": 1028,
        "keyword": "deep geological CO2 storage well downhole fiber-optic distributed temperature sensing DTS plume tracking telemetry",
        "slug": "deep-geological-co2-storage-well-downhole-fiber-optic-distributed-temperature-sensing-dts-plume-tracking-telemetry",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Reservoir Surveillance Leads & Downhole DTS Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Downhole DTS Telemetry"
    },
    {
        "id": 1029,
        "keyword": "subsea CO2 Christmas tree corrosion-resistant alloy clad valve acoustic emission leak telemetry for carbon sequestration",
        "slug": "subsea-co2-christmas-tree-corrosion-resistant-alloy-clad-valve-acoustic-emission-leak-telemetry-for-carbon-sequestration",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Subsea Hardware Engineers & Valve Integrity Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Subsea Valve Telemetry"
    },
    {
        "id": 1030,
        "keyword": "offshore carbon storage observation well casing electromagnetic eddy current wall thickness loss telemetry for carbonic corrosion",
        "slug": "offshore-carbon-storage-observation-well-casing-electromagnetic-eddy-current-wall-thickness-loss-telemetry-for-carbonic-corrosion",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Well Integrity Specialists & Corrosion Inspection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Well Casing Telemetry"
    },
    {
        "id": 1031,
        "keyword": "subsea carbon sequestration seafloor lander dissolved CO2 chemical optode and pH anomaly telemetry for water column safety",
        "slug": "subsea-carbon-sequestration-seafloor-lander-dissolved-co2-chemical-optode-and-ph-anomaly-telemetry-for-water-column-safety",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Marine Environmental Scientists & Subsea Lander Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Seafloor Optode Telemetry"
    },
    {
        "id": 1032,
        "keyword": "deep saline aquifer carbon storage injection well perforated liner sand production acoustic sand probe telemetry",
        "slug": "deep-saline-aquifer-carbon-storage-injection-well-perforated-liner-sand-production-acoustic-sand-probe-telemetry",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Sand Management Engineers & Injection Well Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Sand Telemetry"
    },
    {
        "id": 1033,
        "keyword": "subsea CO2 marine booster pump multiphase liquid-vapor flow vortex flowmeter telemetry for offshore transport lines",
        "slug": "subsea-co2-marine-booster-pump-multiphase-liquid-vapor-flow-vortex-flowmeter-telemetry-for-offshore-transport-lines",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Flow Assurance Specialists & Subsea Pump Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vortex Flowmeter Telemetry"
    },
    {
        "id": 1034,
        "keyword": "offshore carbon sequestration deep well annulus pressure build-up B-annulus monitoring telemetry for sustained casing pressure",
        "slug": "offshore-carbon-sequestration-deep-well-annulus-pressure-build-up-b-annulus-monitoring-telemetry-for-sustained-casing-pressure",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Sustained Casing Pressure Leads & Well Barrier Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Annulus Pressure Telemetry"
    },
    {
        "id": 1035,
        "keyword": "subsea CO2 pipeline emergency shutdown valve hydraulic actuator accumulator pressure transducer telemetry for safety",
        "slug": "subsea-co2-pipeline-emergency-shutdown-valve-hydraulic-actuator-accumulator-pressure-transducer-telemetry-for-safety",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Safety Instrumented System Leads & Subsea ESD Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ESD Hydraulic Telemetry"
    },
    {
        "id": 1036,
        "keyword": "deep offshore geological carbon storage reservoir bottomhole pressure transient quartz crystal gauge telemetry for injectivity",
        "slug": "deep-offshore-geological-carbon-storage-reservoir-bottomhole-pressure-transient-quartz-crystal-gauge-telemetry-for-injectivity",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Reservoir Engineers & Pressure Transient Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Quartz Gauge Telemetry"
    },
    {
        "id": 1037,
        "keyword": "subsea CO2 storage manifold unbonded flexible riser torsional shear strain gauge telemetry for dynamic sea states",
        "slug": "subsea-co2-storage-manifold-unbonded-flexible-riser-torsional-shear-strain-gauge-telemetry-for-dynamic-sea-states",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Riser Systems Engineers & Offshore Hydrodynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flexible Riser Telemetry"
    },
    {
        "id": 1038,
        "keyword": "offshore carbon sequestration seabed gravity anomaly superconducting gravimeter telemetry for subsurface CO2 mass tracking",
        "slug": "offshore-carbon-sequestration-seabed-gravity-anomaly-superconducting-gravimeter-telemetry-for-subsurface-co2-mass-tracking",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Geophysicists & Superconducting Gravimetry Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gravimeter Telemetry"
    },
    {
        "id": 1039,
        "keyword": "subsea carbon storage injection well expander-packer elastomer seal swelling degradation ultrasonic scanner telemetry",
        "slug": "subsea-carbon-storage-injection-well-expander-packer-elastomer-seal-swelling-degradation-ultrasonic-scanner-telemetry",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Elastomer Seal Specialists & Downhole Packer Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Packer Seal Telemetry"
    },
    {
        "id": 1040,
        "keyword": "deep offshore CO2 aquifer caprock natural gamma ray spectral logging-while-drilling LWD telemetry for seal continuity",
        "slug": "deep-offshore-co2-aquifer-caprock-natural-gamma-ray-spectral-logging-while-drilling-lwd-telemetry-for-seal-continuity",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Petrophysicists & LWD Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gamma Ray LWD Telemetry"
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
    for kw in wave23_keywords:
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

    print(f"Successfully ingested {added_count} Wave 23 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
