#!/usr/bin/env python3
"""
ingest_wave22_keywords.py

Ingests Wave 22 BOFU Solution Keywords (IDs 941 to 990):
- Semiconductor Extreme Ultraviolet (EUV) Photolithography Pellicle Hydrogen Plasma Telemetry (17 solutions, IDs 941-957)
- Hypersonic Scramjet Dual-Mode Combustor Shock Train Optical Deflectometry Telemetry (17 solutions, IDs 958-974)
- Offshore Floating Wind Turbine Tension Leg Platform (TLP) Tendon Mooring Tension Telemetry (16 solutions, IDs 975-990)

Scales total compact solutions queue from 940 to 990.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave22_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Semiconductor EUV Pellicle Hydrogen Plasma Etch Telemetry (17 solutions, IDs 941-957)
    # -------------------------------------------------------------------------
    {
        "id": 941,
        "keyword": "EUV pellicle carbon nanotube membrane hydrogen radical chemical etch rate telemetry for scanner productivity",
        "slug": "euv-pellicle-carbon-nanotube-membrane-hydrogen-radical-chemical-etch-rate-telemetry-for-scanner-productivity",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Lithography Engineers & Scanner Productivity Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy EUV Pellicle Etch Telemetry"
    },
    {
        "id": 942,
        "keyword": "extreme ultraviolet pellicle thermal emissivity pyrometer temperature uniformity telemetry for high-NA scanners",
        "slug": "extreme-ultraviolet-pellicle-thermal-emissivity-pyrometer-temperature-uniformity-telemetry-for-high-na-scanners",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Thermal Process Engineers & High-NA Scanner Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pellicle Pyrometry Telemetry"
    },
    {
        "id": 943,
        "keyword": "EUV reticle pod dynamic slit scanning hydrogen gas flow boundary layer telemetry for particle mitigation",
        "slug": "euv-reticle-pod-dynamic-slit-scanning-hydrogen-gas-flow-boundary-layer-telemetry-for-particle-mitigation",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Reticle Handling Specialists & Defect Reduction Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Reticle Gas Flow Telemetry"
    },
    {
        "id": 944,
        "keyword": "silicon core-shell EUV pellicle frame mechanical resonant vibration laser Doppler vibrometry telemetry for wafer stages",
        "slug": "silicon-core-shell-euv-pellicle-frame-mechanical-resonant-vibration-laser-doppler-vibrometry-telemetry-for-wafer-stages",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Vibrometry Specialists & Lithography Stage Dynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pellicle Vibrometry Telemetry"
    },
    {
        "id": 945,
        "keyword": "EUV tin droplet laser-produced plasma collector mirror debris mitigation hydrogen buffer gas flow telemetry",
        "slug": "euv-tin-droplet-laser-produced-plasma-collector-mirror-debris-mitigation-hydrogen-buffer-gas-flow-telemetry",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Plasma Source Physicists & Collector Mirror Optical Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tin Plasma Debris Telemetry"
    },
    {
        "id": 946,
        "keyword": "extreme ultraviolet mask ruthenium capping layer oxidation depth grazing incidence X-ray reflectometry telemetry",
        "slug": "extreme-ultraviolet-mask-ruthenium-capping-layer-oxidation-depth-grazing-incidence-x-ray-reflectometry-telemetry",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Mask Metrology Specialists & Nanofabrication Quality Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ruthenium Oxidation Telemetry"
    },
    {
        "id": 947,
        "keyword": "EUV pellicle transmission loss in-situ photodiode actinic absorption degradation telemetry for advanced nodes",
        "slug": "euv-pellicle-transmission-loss-in-situ-photodiode-actinic-absorption-degradation-telemetry-for-advanced-nodes",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Photodiode Diagnostics Leads & Actinic Metrology Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Actinic Transmission Telemetry"
    },
    {
        "id": 948,
        "keyword": "nanoscale pellicle wrinkle pitch interferometric spatial phase shift telemetry for sub-2nm pattern overlay",
        "slug": "nanoscale-pellicle-wrinkle-pitch-interferometric-spatial-phase-shift-telemetry-for-sub-2nm-pattern-overlay",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Overlay Metrology Leads & Nanoscale Lithographers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wrinkle Interferometry Telemetry"
    },
    {
        "id": 949,
        "keyword": "EUV scanner vacuum loadlock pump-down turbulence pellicle differential pressure sensor telemetry for fab uptime",
        "slug": "euv-scanner-vacuum-loadlock-pump-down-turbulence-pellicle-differential-pressure-sensor-telemetry-for-fab-uptime",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Vacuum Loadlock Engineers & Fab Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Loadlock Pressure Telemetry"
    },
    {
        "id": 950,
        "keyword": "tin contamination quadrupole mass spectrometer hydrogen plasma volatile stannane gas telemetry for EUV source chambers",
        "slug": "tin-contamination-quadrupole-mass-spectrometer-hydrogen-plasma-volatile-stannane-gas-telemetry-for-euv-source-chambers",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Mass Spectrometry Specialists & Source Chamber Maintenance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stannane Gas Telemetry"
    },
    {
        "id": 951,
        "keyword": "EUV pellicle border adhesive outgassing thermal desorption gas chromatography telemetry for cleanroom vacuum",
        "slug": "euv-pellicle-border-adhesive-outgassing-thermal-desorption-gas-chromatography-telemetry-for-cleanroom-vacuum",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Vacuum Outgassing Chemists & Lithography Tool Owners",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Adhesive Outgassing Telemetry"
    },
    {
        "id": 952,
        "keyword": "extreme ultraviolet scanner electrostatic chuck clamping force and wafer backside helium leakage telemetry for EUV",
        "slug": "extreme-ultraviolet-scanner-electrostatic-chuck-clamping-force-and-wafer-backside-helium-leakage-telemetry-for-euv",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Electrostatic Chuck Engineers & Wafer Stage Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Backside Helium Telemetry"
    },
    {
        "id": 953,
        "keyword": "EUV pellicle carbon nanotube bundle debonding electrical four-point probe sheet resistance telemetry for durability",
        "slug": "euv-pellicle-carbon-nanotube-bundle-debonding-electrical-four-point-probe-sheet-resistance-telemetry-for-durability",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Carbon Nanotube Scientists & Pellicle Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sheet Resistance Telemetry"
    },
    {
        "id": 954,
        "keyword": "high-power pulsed CO2 laser amplifier target tracking focal position telemetry for EUV tin droplet generators",
        "slug": "high-power-pulsed-co2-laser-amplifier-target-tracking-focal-position-telemetry-for-euv-tin-droplet-generators",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Pulsed Laser Optics Leads & Droplet Generator Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Focal Telemetry"
    },
    {
        "id": 955,
        "keyword": "EUV pellicle acoustic shockwave burst pressure automated burst risk detection telemetry for 600W sources",
        "slug": "euv-pellicle-acoustic-shockwave-burst-pressure-automated-burst-risk-detection-telemetry-for-600w-sources",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Acoustic Sensor Engineers & High-Power Source Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Burst Telemetry"
    },
    {
        "id": 956,
        "keyword": "extreme ultraviolet reticle electrostatic discharge ESD voltage dissipation pin telemetry for multi-beam inspection",
        "slug": "extreme-ultraviolet-reticle-electrostatic-discharge-esd-voltage-dissipation-pin-telemetry-for-multi-beam-inspection",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "ESD Protection Specialists & Mask Inspection Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Reticle ESD Telemetry"
    },
    {
        "id": 957,
        "keyword": "EUV pellicle assembly robotic gripper vacuum chuck micro-strain gauge telemetry for automated mask shop handling",
        "slug": "euv-pellicle-assembly-robotic-gripper-vacuum-chuck-micro-strain-gauge-telemetry-for-automated-mask-shop-handling",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Robotic Automation Leads & Mask Shop Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Robotic Gripper Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Hypersonic Scramjet Shock Train Optical Deflectometry Telemetry (17 solutions, IDs 958-974)
    # -------------------------------------------------------------------------
    {
        "id": 958,
        "keyword": "hypersonic scramjet isolator shock train forward boundary optical background-oriented schlieren telemetry for unstart",
        "slug": "hypersonic-scramjet-isolator-shock-train-forward-boundary-optical-background-oriented-schlieren-telemetry-for-unstart",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Hypersonic Propulsion Engineers & Optical Diagnostics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Shock Train Schlieren Telemetry"
    },
    {
        "id": 959,
        "keyword": "scramjet dual-mode combustor supersonic ethylene fuel strut injection penetration depth laser absorption telemetry",
        "slug": "scramjet-dual-mode-combustor-supersonic-ethylene-fuel-strut-injection-penetration-depth-laser-absorption-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Combustion Kinetics Leads & Scramjet Injector Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fuel Penetration Telemetry"
    },
    {
        "id": 960,
        "keyword": "hypersonic inlet boundary layer bleed porous plate high-frequency wall pressure transducer telemetry for SWBLI",
        "slug": "hypersonic-inlet-boundary-layer-bleed-porous-plate-high-frequency-wall-pressure-transducer-telemetry-for-swbli",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Aerodynamic Inlets Specialists & High-Frequency Transducer Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy SWBLI Bleed Telemetry"
    },
    {
        "id": 961,
        "keyword": "scramjet combustor cavity flameholder acoustic cavity resonance hydroxyl planar laser-induced fluorescence telemetry",
        "slug": "scramjet-combustor-cavity-flameholder-acoustic-cavity-resonance-hydroxyl-planar-laser-induced-fluorescence-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Optical Diagnostics Physicists & Cavity Flameholder Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy OH-PLIF Combustion Telemetry"
    },
    {
        "id": 962,
        "keyword": "hypersonic vehicle leading edge ultra-high temperature ceramic UHTC heat flux thermocouple ablation telemetry",
        "slug": "hypersonic-vehicle-leading-edge-ultra-high-temperature-ceramic-uhtc-heat-flux-thermocouple-ablation-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Thermal Protection System Leads & High-Temperature Ceramic Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy UHTC Ablation Telemetry"
    },
    {
        "id": 963,
        "keyword": "scramjet regenerative cooling hydrocarbon fuel endothermic cracking heat sink thermocouple telemetry for flight",
        "slug": "scramjet-regenerative-cooling-hydrocarbon-fuel-endothermic-cracking-heat-sink-thermocouple-telemetry-for-flight",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Regenerative Cooling Engineers & Endothermic Fuels Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Endothermic Cracking Telemetry"
    },
    {
        "id": 964,
        "keyword": "hypersonic boundary layer transition second-mode Mack instability PCB piezoelectric sensor array telemetry for Mach 7",
        "slug": "hypersonic-boundary-layer-transition-second-mode-mack-instability-pcb-piezoelectric-sensor-array-telemetry-for-mach-7",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Boundary Layer Stability Physicists & Hypersonic Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mack Instability Telemetry"
    },
    {
        "id": 965,
        "keyword": "scramjet nozzle expansion ramp surface pressure distribution piezoresistive transducer telemetry for gross thrust",
        "slug": "scramjet-nozzle-expansion-ramp-surface-pressure-distribution-piezoresistive-transducer-telemetry-for-gross-thrust",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Nozzle Expansion Aerodynamicists & Hypersonic Thrust Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Expansion Ramp Telemetry"
    },
    {
        "id": 966,
        "keyword": "hypersonic wind tunnel free-flight model magnetic suspension aerodynamic drag balance optical tracking telemetry",
        "slug": "hypersonic-wind-tunnel-free-flight-model-magnetic-suspension-aerodynamic-drag-balance-optical-tracking-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Wind Tunnel Operations Directors & Aerodynamic Testing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wind Tunnel Drag Telemetry"
    },
    {
        "id": 967,
        "keyword": "scramjet plasma-assisted ignition dielectric barrier discharge nanosecond pulsed voltage telemetry for cold start",
        "slug": "scramjet-plasma-assisted-ignition-dielectric-barrier-discharge-nanosecond-pulsed-voltage-telemetry-for-cold-start",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Plasma Ignition Specialists & High-Speed Propulsion Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Plasma Ignition Telemetry"
    },
    {
        "id": 968,
        "keyword": "hypersonic aerospike thermal deflection and base pressure drag reduction fiber optic Bragg grating telemetry for missiles",
        "slug": "hypersonic-aerospike-thermal-deflection-and-base-pressure-drag-reduction-fiber-optic-bragg-grating-telemetry-for-missiles",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Aerodynamic Drag Reduction Leads & Fiber Optic Strain Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Aerospike Deflection Telemetry"
    },
    {
        "id": 969,
        "keyword": "scramjet strut leading edge liquid lithium transpiration cooling porous metal matrix temperature telemetry for scramjets",
        "slug": "scramjet-strut-leading-edge-liquid-lithium-transpiration-cooling-porous-metal-matrix-temperature-telemetry-for-scramjets",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Transpiration Cooling Engineers & Liquid Metal Thermal Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Transpiration Cooling Telemetry"
    },
    {
        "id": 970,
        "keyword": "hypersonic vehicle ruddervator electromechanical actuator load torque resolver feedback telemetry for high-g turns",
        "slug": "hypersonic-vehicle-ruddervator-electromechanical-actuator-load-torque-resolver-feedback-telemetry-for-high-g-turns",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Flight Control Actuator Leads & Hypersonic GNC Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ruddervator Actuator Telemetry"
    },
    {
        "id": 971,
        "keyword": "scramjet combustor soot precursor laser-induced incandescence particle size distribution telemetry for exhaust plume",
        "slug": "scramjet-combustor-soot-precursor-laser-induced-incandescence-particle-size-distribution-telemetry-for-exhaust-plume",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Exhaust Diagnostics Physicists & Hypersonic Signature Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Soot Incandescence Telemetry"
    },
    {
        "id": 972,
        "keyword": "hypersonic vehicle nose cone radio frequency plasma sheath blackout millimeter-wave transmission telemetry for telemetry",
        "slug": "hypersonic-vehicle-nose-cone-radio-frequency-plasma-sheath-blackout-millimeter-wave-transmission-telemetry-for-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Reentry Communications Engineers & Plasma Blackout Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Plasma Blackout Telemetry"
    },
    {
        "id": 973,
        "keyword": "scramjet inlet cowl lip thermal blunting aerothermodynamic radiative emission spectrometer telemetry for Mach 8",
        "slug": "scramjet-inlet-cowl-lip-thermal-blunting-aerothermodynamic-radiative-emission-spectrometer-telemetry-for-mach-8",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Aerothermodynamics Physicists & Hypersonic Cowl Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cowl Radiative Telemetry"
    },
    {
        "id": 974,
        "keyword": "hypersonic glide vehicle cold-gas reaction control system thruster chamber pressure transducer telemetry for midcourse",
        "slug": "hypersonic-glide-vehicle-cold-gas-reaction-control-system-thruster-chamber-pressure-transducer-telemetry-for-midcourse",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Reaction Control Systems Leads & HGV Trajectory Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RCS Thruster Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Offshore Floating Wind TLP Tendon Mooring Telemetry (16 solutions, IDs 975-990)
    # -------------------------------------------------------------------------
    {
        "id": 975,
        "keyword": "floating wind turbine tension leg platform tendon tension load cell dynamic cyclic fatigue telemetry for deepwater",
        "slug": "floating-wind-turbine-tension-leg-platform-tendon-tension-load-cell-dynamic-cyclic-fatigue-telemetry-for-deepwater",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Offshore Wind Mooring Engineers & TLP Structural Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy TLP Tendon Load Telemetry"
    },
    {
        "id": 976,
        "keyword": "TLP suction pile anchor pore water pressure and dynamic pull-out resistance telemetry for floating offshore wind",
        "slug": "tlp-suction-pile-anchor-pore-water-pressure-and-dynamic-pull-out-resistance-telemetry-for-floating-offshore-wind",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Geotechnical Offshore Engineers & Anchor Foundation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Suction Pile Telemetry"
    },
    {
        "id": 977,
        "keyword": "offshore wind dynamic subsea power cable bend stiffener curvature fiber optic strain telemetry for floating substructures",
        "slug": "offshore-wind-dynamic-subsea-power-cable-bend-stiffener-curvature-fiber-optic-strain-telemetry-for-floating-substructures",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Subsea Power Cable Specialists & Floating Wind Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cable Bend Stiffener Telemetry"
    },
    {
        "id": 978,
        "keyword": "floating wind platform six-degree-of-freedom wave motion MRU accelerometer telemetry for pitch stability control",
        "slug": "floating-wind-platform-six-degree-of-freedom-wave-motion-mru-accelerometer-telemetry-for-pitch-stability-control",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Marine Motion Sensor Specialists & Wind Turbine Control Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Platform Motion MRU Telemetry"
    },
    {
        "id": 979,
        "keyword": "tension leg platform bottom connector flex joint angular misalignment ultrasonic sensor telemetry for floating wind",
        "slug": "tension-leg-platform-bottom-connector-flex-joint-angular-misalignment-ultrasonic-sensor-telemetry-for-floating-wind",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Flex Joint Reliability Specialists & TLP Mooring Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flex Joint Misalignment Telemetry"
    },
    {
        "id": 980,
        "keyword": "floating offshore wind turbine tower base bending moment strain gauge telemetry for aerodynamic thrust load damping",
        "slug": "floating-offshore-wind-turbine-tower-base-bending-moment-strain-gauge-telemetry-for-aerodynamic-thrust-load-damping",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Wind Turbine Tower Structural Engineers & Load Damping Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tower Base Moment Telemetry"
    },
    {
        "id": 981,
        "keyword": "TLP tubular steel tendon internal seawater ingress acoustic leak detection telemetry for offshore corrosion",
        "slug": "tlp-tubular-steel-tendon-internal-seawater-ingress-acoustic-leak-detection-telemetry-for-offshore-corrosion",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Tendon Integrity Engineers & Acoustic NDT Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Seawater Ingress Telemetry"
    },
    {
        "id": 982,
        "keyword": "floating wind turbine semi-submersible ballast water trim pump level transducer telemetry for storm survivability",
        "slug": "floating-wind-turbine-semi-submersible-ballast-water-trim-pump-level-transducer-telemetry-for-storm-survivability",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Ballast Automation Leads & Offshore Marine Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ballast Level Telemetry"
    },
    {
        "id": 983,
        "keyword": "offshore wind blade root optical fiber strain gauge pitch bearing dynamic fatigue telemetry for 15MW turbines",
        "slug": "offshore-wind-blade-root-optical-fiber-strain-gauge-pitch-bearing-dynamic-fatigue-telemetry-for-15mw-turbines",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Blade Reliability Specialists & Pitch Bearing Structural Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Blade Root Strain Telemetry"
    },
    {
        "id": 984,
        "keyword": "TLP floating foundation hydrodynamic wave slamming pressure transducer telemetry for splash zone hulls",
        "slug": "tlp-floating-foundation-hydrodynamic-wave-slamming-pressure-transducer-telemetry-for-splash-zone-hulls",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Hydrodynamic Wave Modelers & Hull Design Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wave Slamming Pressure Telemetry"
    },
    {
        "id": 985,
        "keyword": "floating offshore wind inter-array dynamic cable vortex-induced vibration accelerometer telemetry for fatigue lifetime",
        "slug": "floating-offshore-wind-inter-array-dynamic-cable-vortex-induced-vibration-accelerometer-telemetry-for-fatigue-lifetime",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Dynamic Cable Engineers & Marine Hydrodynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dynamic Cable VIV Telemetry"
    },
    {
        "id": 986,
        "keyword": "tension leg platform tendon top porch hydraulic tensioning jack pressure sensor telemetry for installation",
        "slug": "tension-leg-platform-tendon-top-porch-hydraulic-tensioning-jack-pressure-sensor-telemetry-for-installation",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Installation Offshore Leads & Hydraulic Jacking Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tendon Jacking Telemetry"
    },
    {
        "id": 987,
        "keyword": "offshore wind turbine permanent magnet direct-drive generator stator core temperature RTD telemetry for nacelles",
        "slug": "offshore-wind-turbine-permanent-magnet-direct-drive-generator-stator-core-temperature-rtd-telemetry-for-nacelles",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Generator Electrical Leads & Nacelle Thermal Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Generator Stator Telemetry"
    },
    {
        "id": 988,
        "keyword": "floating wind turbine mooring line synthetic polyester rope creep elongation laser rangefinder telemetry for arrays",
        "slug": "floating-wind-turbine-mooring-line-synthetic-polyester-rope-creep-elongation-laser-rangefinder-telemetry-for-arrays",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Synthetic Mooring Specialists & Array Design Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mooring Creep Telemetry"
    },
    {
        "id": 989,
        "keyword": "TLP floating wind steel hull cathodic protection sacrificial zinc anode potential drop telemetry for corrosion",
        "slug": "tlp-floating-wind-steel-hull-cathodic-protection-sacrificial-zinc-anode-potential-drop-telemetry-for-corrosion",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Cathodic Corrosion Engineers & Marine Asset Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Zinc Anode Telemetry"
    },
    {
        "id": 990,
        "keyword": "floating wind platform dynamic yaw system slew drive motor current torque ripple telemetry for heading alignment",
        "slug": "floating-wind-platform-dynamic-yaw-system-slew-drive-motor-current-torque-ripple-telemetry-for-heading-alignment",
        "category": "Solutions",
        "hub_category": "Offshore Wind & Marine Renewable Energy",
        "target_persona": "Yaw Drive Mechanism Specialists & Wind Turbine Control Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Yaw Drive Torque Telemetry"
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
    for kw in wave22_keywords:
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

    print(f"Successfully ingested {added_count} Wave 22 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
