#!/usr/bin/env python3
"""
ingest_wave18_keywords.py

Ingests Wave 18 BOFU Solution Keywords (IDs 741 to 790):
- Solid Oxide Electrolyzer Cell (SOEC) High-Temperature Steam Electrolysis Telemetry (17 solutions, IDs 741-757)
- Autonomous Lunar Rover Regolith Thermal-Mechanical Traction Telemetry (17 solutions, IDs 758-774)
- Subsea Cryogenic Liquefied Natural Gas (FLNG) Loading Arm Bellows Telemetry (16 solutions, IDs 775-790)

Scales total compact solutions queue from 740 to 790.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave18_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Solid Oxide Electrolyzer Cell (SOEC) Telemetry (17 solutions, IDs 741-757)
    # -------------------------------------------------------------------------
    {
        "id": 741,
        "keyword": "solid oxide electrolyzer cell stack Area Specific Resistance degradation telemetry for clean hydrogen",
        "slug": "solid-oxide-electrolyzer-cell-stack-area-specific-resistance-degradation-telemetry-for-clean-hydrogen",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Electrolysis Plant Directors & Hydrogen Production Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy SOEC Degradation Telemetry"
    },
    {
        "id": 742,
        "keyword": "high-temperature steam electrolysis nickel-YSZ cermet cathode reoxidation telemetry for SOEC plants",
        "slug": "high-temperature-steam-electrolysis-nickel-ysz-cermet-cathode-reoxidation-telemetry-for-soec-plants",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "SOEC Operations Engineers & Hydrogen Facility Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nickel-YSZ Telemetry"
    },
    {
        "id": 743,
        "keyword": "SOEC oxygen electrode LSCF delamination acoustic emission telemetry for industrial hydrogen",
        "slug": "soec-oxygen-electrode-lscf-delamination-acoustic-emission-telemetry-for-industrial-hydrogen",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Solid Oxide Materials Leads & Electrolyzer Integrity Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy LSCF Delamination Telemetry"
    },
    {
        "id": 744,
        "keyword": "interconnect chromium volatilization and cathode poisoning telemetry for solid oxide electrolyzers",
        "slug": "interconnect-chromium-volatilization-and-cathode-poisoning-telemetry-for-solid-oxide-electrolyzers",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Electrolyzer Stack Engineers & Balance of Plant Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Chromium Poisoning Telemetry"
    },
    {
        "id": 745,
        "keyword": "SOEC steam conversion rate and thermal gradient thermomechanical stress controllers for green hydrogen",
        "slug": "soec-steam-conversion-rate-and-thermal-gradient-thermomechanical-stress-controllers-for-green-hydrogen",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Process Control Engineers & Green Hydrogen Plant Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Steam Conversion Controllers"
    },
    {
        "id": 746,
        "keyword": "solid oxide co-electrolysis syngas H2-to-CO ratio gas chromatography telemetry for e-fuels",
        "slug": "solid-oxide-co-electrolysis-syngas-h2-to-co-ratio-gas-chromatography-telemetry-for-e-fuels",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "E-Fuel Production Directors & Synthetic Gas Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Syngas Ratio Telemetry"
    },
    {
        "id": 747,
        "keyword": "reversible solid oxide cell rSOC mode switching thermal transient mitigation agents for microgrids",
        "slug": "reversible-solid-oxide-cell-rsoc-mode-switching-thermal-transient-mitigation-agents-for-microgrids",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Microgrid Energy Storage Directors & rSOC System Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy rSOC Mode Switching Agents"
    },
    {
        "id": 748,
        "keyword": "SOEC glass-ceramic hermetic seal leakage mass spectrometry telemetry for high-pressure stacks",
        "slug": "soec-glass-ceramic-hermetic-seal-leakage-mass-spectrometry-telemetry-for-high-pressure-stacks",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "High-Pressure Hydrogen Engineers & SOEC Stack Sealing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Seal Leakage Telemetry"
    },
    {
        "id": 749,
        "keyword": "solid oxide electrolysis Faraday efficiency and current distribution telemetry for industrial gigawatt plants",
        "slug": "solid-oxide-electrolysis-faraday-efficiency-and-current-distribution-telemetry-for-industrial-gigawatt-plants",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Industrial Hydrogen Asset Managers & Gigawatt Plant Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Faraday Efficiency Telemetry"
    },
    {
        "id": 750,
        "keyword": "SOEC stack thermal neutral voltage operating point telemetry for waste heat integration",
        "slug": "soec-stack-thermal-neutral-voltage-operating-point-telemetry-for-waste-heat-integration",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Thermal Energy Integration Engineers & Industrial Waste Heat Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thermal Neutral Telemetry"
    },
    {
        "id": 751,
        "keyword": "high-temperature steam superheater tube skin thermocouple creep telemetry for SOEC skids",
        "slug": "high-temperature-steam-superheater-tube-skin-thermocouple-creep-telemetry-for-soec-skids",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Boiler & Superheater Integrity Leads & Hydrogen Skid Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Superheater Creep Telemetry"
    },
    {
        "id": 752,
        "keyword": "SOEC balance of plant sweep gas preheater heat exchanger fouling telemetry for hydrogen hubs",
        "slug": "soec-balance-of-plant-sweep-gas-preheater-heat-exchanger-fouling-telemetry-for-hydrogen-hubs",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Balance of Plant Superintendents & Heat Exchanger Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Preheater Fouling Telemetry"
    },
    {
        "id": 753,
        "keyword": "solid oxide fuel electrode carbon coking risk telemetry during steam-CO2 co-electrolysis",
        "slug": "solid-oxide-fuel-electrode-carbon-coking-risk-telemetry-during-steam-co2-co-electrolysis",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Catalysis Researchers & Syngas Quality Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Carbon Coking Risk Telemetry"
    },
    {
        "id": 754,
        "keyword": "SOEC stack planar compressive load retention bolt relaxation telemetry for pressurized modules",
        "slug": "soec-stack-planar-compressive-load-retention-bolt-relaxation-telemetry-for-pressurized-modules",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Mechanical Integrity Engineers & Electrolyzer Clamping Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stack Load Retention Telemetry"
    },
    {
        "id": 755,
        "keyword": "solid oxide electrolyzer differential pressure control cross-leakage prevention agents for hydrogen plants",
        "slug": "solid-oxide-electrolyzer-differential-pressure-control-cross-leakage-prevention-agents-for-hydrogen-plants",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Hydrogen Safety Directors & Instrumentation Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Differential Pressure Agents"
    },
    {
        "id": 756,
        "keyword": "high-temperature steam supply demineralized water conductivity impurity telemetry for SOEC durability",
        "slug": "high-temperature-steam-supply-demineralized-water-conductivity-impurity-telemetry-for-soec-durability",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Feedwater Quality Managers & Electrolysis Plant Chemists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Water Conductivity Telemetry"
    },
    {
        "id": 757,
        "keyword": "SOEC stack end-plate thermal loss and edge cell cooling compensation telemetry for commercial modules",
        "slug": "soec-stack-end-plate-thermal-loss-and-edge-cell-cooling-compensation-telemetry-for-commercial-modules",
        "category": "Solutions",
        "hub_category": "Clean Hydrogen & Industrial Decarbonization",
        "target_persona": "Electrolyzer Thermal Architects & Commercial Module Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy End-Plate Thermal Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Autonomous Lunar Rover Regolith Traction Telemetry (17 solutions, IDs 758-774)
    # -------------------------------------------------------------------------
    {
        "id": 758,
        "keyword": "lunar rover compliant metallic mesh wheel regolith sinkage slip ratio telemetry for south pole exploration",
        "slug": "lunar-rover-compliant-metallic-mesh-wheel-regolith-sinkage-slip-ratio-telemetry-for-south-pole-exploration",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Lunar Rover Mobility Leads & Surface Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mesh Wheel Traction Telemetry"
    },
    {
        "id": 759,
        "keyword": "autonomous rover slip compensation torque vectoring agents for steep crater slope navigation",
        "slug": "autonomous-rover-slip-compensation-torque-vectoring-agents-for-steep-crater-slope-navigation",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "GNC Systems Engineers & Autonomous Surface Navigation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Slip Compensation Vectoring Agents"
    },
    {
        "id": 760,
        "keyword": "lunar regolith electrostatic dust adhesion solar array degradation telemetry for surface rovers",
        "slug": "lunar-regolith-electrostatic-dust-adhesion-solar-array-degradation-telemetry-for-surface-rovers",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Spacecraft Power Systems Engineers & Dust Mitigation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dust Adhesion Telemetry"
    },
    {
        "id": 761,
        "keyword": "lunar night cryogenic thermal survival loop vacuum insulation telemetry for autonomous rovers",
        "slug": "lunar-night-cryogenic-thermal-survival-loop-vacuum-insulation-telemetry-for-autonomous-rovers",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Cryogenic Thermal Systems Architects & Planetary Rover Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryogenic Survival Telemetry"
    },
    {
        "id": 762,
        "keyword": "rover terrain relative navigation stereo vision visual odometry drift correction agents for lunar shadows",
        "slug": "rover-terrain-relative-navigation-stereo-vision-visual-odometry-drift-correction-agents-for-lunar-shadows",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Computer Vision Roboticists & Space Odometry Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Visual Odometry Correction Agents"
    },
    {
        "id": 763,
        "keyword": "permanently shadowed region lidar 3D digital elevation mapping telemetry for lunar ice exploration",
        "slug": "permanently-shadowed-region-lidar-3d-digital-elevation-mapping-telemetry-for-lunar-ice-exploration",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Lunar Volatiles Exploration Leads & Planetary Lidar Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Shadow Region Lidar Telemetry"
    },
    {
        "id": 764,
        "keyword": "lunar rover rocker-bogie suspension joint load and motor harmonic drive torque telemetry for rough terrain",
        "slug": "lunar-rover-rocker-bogie-suspension-joint-load-and-motor-harmonic-drive-torque-telemetry-for-rough-terrain",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Robotic Mechanism Engineers & Rover Chassis Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Suspension Torque Telemetry"
    },
    {
        "id": 765,
        "keyword": "radioisotope heater unit thermal distribution heat pipe loop telemetry for lunar rover nights",
        "slug": "radioisotope-heater-unit-thermal-distribution-heat-pipe-loop-telemetry-for-lunar-rover-nights",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Planetary Heat Pipe Specialists & Radioisotope Power Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RHU Heat Pipe Telemetry"
    },
    {
        "id": 766,
        "keyword": "lunar regolith abrasive mechanical seal wear telemetry for autonomous robotic drill corers",
        "slug": "lunar-regolith-abrasive-mechanical-seal-wear-telemetry-for-autonomous-robotic-drill-corers",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Drill Coring Mechanism Leads & Lunar Sampling Scientists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Drill Seal Wear Telemetry"
    },
    {
        "id": 767,
        "keyword": "autonomous lunar rover hazard detection and local path re-planning agents for boulder fields",
        "slug": "autonomous-lunar-rover-hazard-detection-and-local-path-re-planning-agents-for-boulder-fields",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Autonomous Navigation Leads & Planetary Robotics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hazard Path Re-Planning Agents"
    },
    {
        "id": 768,
        "keyword": "rover wheel-soil Bekker-Wong terramechanics shear stress telemetry for low-gravity mobility",
        "slug": "rover-wheel-soil-bekker-wong-terramechanics-shear-stress-telemetry-for-low-gravity-mobility",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Terramechanics Researchers & Planetary Mobility Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bekker-Wong Shear Telemetry"
    },
    {
        "id": 769,
        "keyword": "lunar surface UHF and X-band direct-to-Earth phased array antenna pointing telemetry for rover traverses",
        "slug": "lunar-surface-uhf-and-x-band-direct-to-earth-phased-array-antenna-pointing-telemetry-for-rover-traverses",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Deep Space Telecommunications Leads & Phased Array RF Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RF Antenna Pointing Telemetry"
    },
    {
        "id": 770,
        "keyword": "lunar rover avionics single-event upset radiation latch-up recovery agents for polar missions",
        "slug": "lunar-rover-avionics-single-event-upset-radiation-latch-up-recovery-agents-for-polar-missions",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Radiation Hardened Avionics Leads & Space Flight Software Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Radiation Latch-Up Recovery Agents"
    },
    {
        "id": 771,
        "keyword": "autonomous lunar rover battery depth of discharge cryogenic thermal chamber telemetry for cold traps",
        "slug": "autonomous-lunar-rover-battery-depth-of-discharge-cryogenic-thermal-chamber-telemetry-for-cold-traps",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Spacecraft Battery Chemistry Leads & Power Subsystem Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryogenic Battery Telemetry"
    },
    {
        "id": 772,
        "keyword": "rover robotic manipulator arm regolith sample acquisition tactile force telemetry for lunar geology",
        "slug": "rover-robotic-manipulator-arm-regolith-sample-acquisition-tactile-force-telemetry-for-lunar-geology",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Robotic Manipulation Leads & Planetary In-Situ Sampling Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tactile Force Telemetry"
    },
    {
        "id": 773,
        "keyword": "lunar south pole low-sun-angle solar tracking gimbal positioning telemetry for polar autonomous rovers",
        "slug": "lunar-south-pole-low-sun-angle-solar-tracking-gimbal-positioning-telemetry-for-polar-autonomous-rovers",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Solar Array Mechanism Leads & Polar Power Generation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Solar Gimbal Tracking Telemetry"
    },
    {
        "id": 774,
        "keyword": "rover autonomous communication blackout dead reckoning inertial navigation telemetry for far-side lunar runs",
        "slug": "rover-autonomous-communication-blackout-dead-reckoning-inertial-navigation-telemetry-for-far-side-lunar-runs",
        "category": "Solutions",
        "hub_category": "Space Exploration & Lunar Surface Robotics",
        "target_persona": "Dead Reckoning Navigation Leads & Lunar Surface Autonomy Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dead Reckoning Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Subsea Cryogenic FLNG Loading Arm Bellows Telemetry (16 solutions, IDs 775-790)
    # -------------------------------------------------------------------------
    {
        "id": 775,
        "keyword": "floating LNG cryogenic flexible loading arm multilayer bellows fatigue strain gauge telemetry for tandem offloading",
        "slug": "floating-lng-cryogenic-flexible-loading-arm-multilayer-bellows-fatigue-strain-gauge-telemetry-for-tandem-offloading",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "FLNG Offloading Superintendents & Cryogenic Loading Arm Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Loading Arm Bellows Telemetry"
    },
    {
        "id": 776,
        "keyword": "FLNG subsea cryogenic transfer hose vacuum insulation jacket pressure telemetry for offshore offloading",
        "slug": "flng-subsea-cryogenic-transfer-hose-vacuum-insulation-jacket-pressure-telemetry-for-offshore-offloading",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Marine Cryogenic Hose Integrity Leads & Offshore LNG Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vacuum Jacket Telemetry"
    },
    {
        "id": 777,
        "keyword": "cryogenic quick connect disconnect QCDC emergency release coupler seal telemetry for FLNG vessels",
        "slug": "cryogenic-quick-connect-disconnect-qcdc-emergency-release-coupler-seal-telemetry-for-flng-vessels",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Offloading Safety Engineers & Marine LNG Coupling Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy QCDC Coupler Seal Telemetry"
    },
    {
        "id": 778,
        "keyword": "subsea LNG transfer arm swivel joint liquid nitrogen boil-off gas thermal transient telemetry for marine berths",
        "slug": "subsea-lng-transfer-arm-swivel-joint-liquid-nitrogen-boil-off-gas-thermal-transient-telemetry-for-marine-berths",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Cryogenic Swivel Joint Leads & Marine Terminal Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Swivel Joint Thermal Telemetry"
    },
    {
        "id": 779,
        "keyword": "offshore FLNG cargo transfer hydraulic tensioner heave compensation telemetry for rough sea states",
        "slug": "offshore-flng-cargo-transfer-hydraulic-tensioner-heave-compensation-telemetry-for-rough-sea-states",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Motion Compensation Engineers & FLNG Marine Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Heave Compensation Telemetry"
    },
    {
        "id": 780,
        "keyword": "cryogenic loading pipe structural slug flow induced vibration telemetry for offshore LNG bunkering",
        "slug": "cryogenic-loading-pipe-structural-slug-flow-induced-vibration-telemetry-for-offshore-lng-bunkering",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "LNG Bunkering Integrity Leads & Pipe Stress Analysis Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Slug Flow Vibration Telemetry"
    },
    {
        "id": 781,
        "keyword": "FLNG tandem offloading hawser line tension and vessel relative displacement telemetry for emergency disconnect",
        "slug": "flng-tandem-offloading-hawser-line-tension-and-vessel-relative-displacement-telemetry-for-emergency-disconnect",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Mooring & Offloading Superintendents & Marine Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Hawser Tension Telemetry"
    },
    {
        "id": 782,
        "keyword": "cryogenic valve stem packing seal helium sniffer leakage telemetry for offshore LNG topsides",
        "slug": "cryogenic-valve-stem-packing-seal-helium-sniffer-leakage-telemetry-for-offshore-lng-topsides",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Valve Integrity Engineers & Cryogenic Fugitive Emissions Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Valve Stem Leakage Telemetry"
    },
    {
        "id": 783,
        "keyword": "subsea cryogenic pipeline end termination PLET thermal expansion loop telemetry for floating gas processing",
        "slug": "subsea-cryogenic-pipeline-end-termination-plet-thermal-expansion-loop-telemetry-for-floating-gas-processing",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Subsea Pipeline Engineers & Marine Flowline Integrity Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy PLET Expansion Loop Telemetry"
    },
    {
        "id": 784,
        "keyword": "FLNG loading arm emergency shutdown ESD system hydraulic accumulator pressure telemetry for marine offloading",
        "slug": "flng-loading-arm-emergency-shutdown-esd-system-hydraulic-accumulator-pressure-telemetry-for-marine-offloading",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Safety Instrumented System Engineers & Marine Offloading Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ESD Hydraulic Telemetry"
    },
    {
        "id": 785,
        "keyword": "cryogenic loading hose outer carcass seawater ingress fiber optic distributed temperature sensing telemetry for FLNG",
        "slug": "cryogenic-loading-hose-outer-carcass-seawater-ingress-fiber-optic-distributed-temperature-sensing-telemetry-for-flng",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "DTS Fiber Optic Specialists & Subsea Hose Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy DTS Ingress Telemetry"
    },
    {
        "id": 786,
        "keyword": "offshore LNG boil-off gas re-liquefaction compressor mixed refrigerant suction telemetry for FLNG turrets",
        "slug": "offshore-lng-boil-off-gas-re-liquefaction-compressor-mixed-refrigerant-suction-telemetry-for-flng-turrets",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "BOG Re-liquefaction Superintendents & Turret Gas Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy BOG Re-liquefaction Telemetry"
    },
    {
        "id": 787,
        "keyword": "cryogenic bellows thermal cycle micro-crack acoustic emission telemetry for offshore tandem LNG transfer",
        "slug": "cryogenic-bellows-thermal-cycle-micro-crack-acoustic-emission-telemetry-for-offshore-tandem-lng-transfer",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Acoustic Emission NDT Leads & Offshore Bellows Reliability Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bellows Acoustic Telemetry"
    },
    {
        "id": 788,
        "keyword": "FLNG loading arm boom structural deflection and wave swell dynamic bending telemetry for offshore terminals",
        "slug": "flng-loading-arm-boom-structural-deflection-and-wave-swell-dynamic-bending-telemetry-for-offshore-terminals",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Structural Dynamics Engineers & Marine Offloading Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Arm Deflection Telemetry"
    },
    {
        "id": 789,
        "keyword": "subsea cryogenic transfer manifold breakaway coupling pre-tension bolt ultrasonic telemetry for FLNG vessels",
        "slug": "subsea-cryogenic-transfer-manifold-breakaway-coupling-pre-tension-bolt-ultrasonic-telemetry-for-flng-vessels",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Subsea Bolt Ultrasonic NDT Specialists & FLNG Vessel Maintenance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Breakaway Ultrasonic Telemetry"
    },
    {
        "id": 790,
        "keyword": "marine LNG offloading vapor return arm flow rate and differential backpressure telemetry for FLNG safety",
        "slug": "marine-lng-offloading-vapor-return-arm-flow-rate-and-differential-backpressure-telemetry-for-flng-safety",
        "category": "Solutions",
        "hub_category": "Offshore LNG & Marine Cryogenic Systems",
        "target_persona": "Offloading Vapor Recovery Leads & Marine Gas Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vapor Return Telemetry"
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
    for kw in wave18_keywords:
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

    print(f"Successfully ingested {added_count} Wave 18 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
