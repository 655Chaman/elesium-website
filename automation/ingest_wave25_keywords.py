#!/usr/bin/env python3
"""
ingest_wave25_keywords.py

Ingests Wave 25 BOFU Solution Keywords (IDs 1,091 to 1,140):
- Fusion Stellarator 3D Non-Planar Coil Quench & Divertor Island Telemetry (17 solutions, IDs 1091-1107)
- Solid-State Battery Dry Electrode Calendaring & Interfacial Impedance Telemetry (17 solutions, IDs 1108-1124)
- Spaceborne Gravitational Wave Laser Interferometry Heterodyne Phase Telemetry (16 solutions, IDs 1125-1140)

Scales total compact solutions queue from 1,090 to 1,140 solutions (The Quarter-Century & 1,140 Milestone!).
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave25_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Fusion Stellarator 3D Non-Planar Magnetics (17 solutions, IDs 1091-1107)
    # -------------------------------------------------------------------------
    {
        "id": 1091,
        "keyword": "stellarator 3D non-planar superconducting coil quench propagation fiber-optic interferometry telemetry for magnet protection",
        "slug": "stellarator-3d-non-planar-superconducting-coil-quench-propagation-fiber-optic-interferometry-telemetry-for-magnet-protection",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Stellarator Magnetics Leads & Quench Protection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stellarator Magnet Telemetry"
    },
    {
        "id": 1092,
        "keyword": "stellarator magnetic island divertor strike line heat flux infrared thermography telemetry for edge plasma detachment",
        "slug": "stellarator-magnetic-island-divertor-strike-line-heat-flux-infrared-thermography-telemetry-for-edge-plasma-detachment",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Island Divertor Physicists & Edge Detachment Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Island Divertor Telemetry"
    },
    {
        "id": 1093,
        "keyword": "stellarator electron Bernstein wave heating radiometer emission temperature profile telemetry for overdense plasmas",
        "slug": "stellarator-electron-bernstein-wave-heating-radiometer-emission-temperature-profile-telemetry-for-overdense-plasmas",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Bernstein Wave RF Engineers & Radiometry Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bernstein Radiometry Telemetry"
    },
    {
        "id": 1094,
        "keyword": "stellarator heavy ion beam probe hibp electric potential fluctuation telemetry for radial electric field diagnostics",
        "slug": "stellarator-heavy-ion-beam-probe-hibp-electric-potential-fluctuation-telemetry-for-radial-electric-field-diagnostics",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "HIBP Beam Diagnostic Specialists & Potential Field Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy HIBP Potential Telemetry"
    },
    {
        "id": 1095,
        "keyword": "stellarator vacuum vessel non-planar port seal helium micro-leak quadrupole mass spectrometer telemetry for cryostat integrity",
        "slug": "stellarator-vacuum-vessel-non-planar-port-seal-helium-micro-leak-quadrupole-mass-spectrometer-telemetry-for-cryostat-integrity",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Vacuum Metrology Engineers & Cryostat Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stellarator Vacuum Telemetry"
    },
    {
        "id": 1096,
        "keyword": "stellarator magnetic field error field compensation trim coil current telemetry for flux surface preservation",
        "slug": "stellarator-magnetic-field-error-field-compensation-trim-coil-current-telemetry-for-flux-surface-preservation",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Trim Coil Controls Engineers & 3D Flux Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Trim Coil Current Telemetry"
    },
    {
        "id": 1097,
        "keyword": "stellarator collective Thomson scattering fast ion velocity distribution telemetry for alpha particle confinement",
        "slug": "stellarator-collective-thomson-scattering-fast-ion-velocity-distribution-telemetry-for-alpha-particle-confinement",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Thomson Scattering Physicists & Fast Ion Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thomson Scattering Telemetry"
    },
    {
        "id": 1098,
        "keyword": "stellarator microwave reflectometer plasma turbulence density fluctuation correlation telemetry for confinement time",
        "slug": "stellarator-microwave-reflectometer-plasma-turbulence-density-fluctuation-correlation-telemetry-for-confinement-time",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Reflectometry Diagnostics Leads & Confinement Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Reflectometer Turbulence Telemetry"
    },
    {
        "id": 1099,
        "keyword": "stellarator cryogenic busbar high-temperature superconductor joint resistance telemetry for steady-state current feed",
        "slug": "stellarator-cryogenic-busbar-high-temperature-superconductor-joint-resistance-telemetry-for-steady-state-current-feed",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Cryogenic Current Lead Engineers & HTS Busbar Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Busbar Joint Resistance Telemetry"
    },
    {
        "id": 1100,
        "keyword": "stellarator laser blow-off impurity injection trace metal transport diffusion coefficient telemetry for core cleanliness",
        "slug": "stellarator-laser-blow-off-impurity-injection-trace-metal-transport-diffusion-coefficient-telemetry-for-core-cleanliness",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Impurity Transport Physicists & Laser Diagnostic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Blow-Off Telemetry"
    },
    {
        "id": 1101,
        "keyword": "stellarator magnetic Rogowski belt net toroidal current cancellation telemetry for pure bootstrap suppression",
        "slug": "stellarator-magnetic-rogowski-belt-net-toroidal-current-cancellation-telemetry-for-pure-bootstrap-suppression",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Bootstrap Current Leads & Magnetic Belt Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Rogowski Belt Telemetry"
    },
    {
        "id": 1102,
        "keyword": "stellarator neutral gas sub-divertor pressure capacitive manometer telemetry for cryogenic pump pumping speed",
        "slug": "stellarator-neutral-gas-sub-divertor-pressure-capacitive-manometer-telemetry-for-cryogenic-pump-pumping-speed",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Cryopump Systems Leads & Divertor Exhaust Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sub-Divertor Pressure Telemetry"
    },
    {
        "id": 1103,
        "keyword": "stellarator Mirnov magnetic probe array high-frequency Alfven eigenmode oscillation telemetry for plasma stability",
        "slug": "stellarator-mirnov-magnetic-probe-array-high-frequency-alfven-eigenmode-oscillation-telemetry-for-plasma-stability",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "MHD Stability Physicists & Mirnov Coil Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mirnov Probe Telemetry"
    },
    {
        "id": 1104,
        "keyword": "stellarator non-planar coil structural support inter-coil tie rod hydraulic preload strain gauge telemetry for lorentz loads",
        "slug": "stellarator-non-planar-coil-structural-support-inter-coil-tie-rod-hydraulic-preload-strain-gauge-telemetry-for-lorentz-loads",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Structural Mechanics Leads & Tie Rod Strain Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inter-Coil Tie Rod Telemetry"
    },
    {
        "id": 1105,
        "keyword": "stellarator core soft x-ray tomographic pinhole camera array emissivity reconstruction telemetry for Shafranov shift",
        "slug": "stellarator-core-soft-x-ray-tomographic-pinhole-camera-array-emissivity-reconstruction-telemetry-for-shafranov-shift",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "X-ray Tomography Physicists & Plasma Shift Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Soft X-ray Tomography Telemetry"
    },
    {
        "id": 1106,
        "keyword": "stellarator pellet ablation cloud optical framing camera trajectory tracking telemetry for deep core fueling efficiency",
        "slug": "stellarator-pellet-ablation-cloud-optical-framing-camera-trajectory-tracking-telemetry-for-deep-core-fueling-efficiency",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Fueling Physics Specialists & High-Speed Optical Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pellet Cloud Framing Telemetry"
    },
    {
        "id": 1107,
        "keyword": "stellarator carbon target tile high-resolution spectroscopy hydrocarbon chemical sputtering flux telemetry for divertor wear",
        "slug": "stellarator-carbon-target-tile-high-resolution-spectroscopy-hydrocarbon-chemical-sputtering-flux-telemetry-for-divertor-wear",
        "category": "Solutions",
        "hub_category": "Fusion Stellarator & Non-Planar Magnetics",
        "target_persona": "Plasma-Surface Interaction Leads & Optical Sputtering Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Chemical Sputtering Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Solid-State Battery Dry Electrode Calendaring (17 solutions, IDs 1108-1124)
    # -------------------------------------------------------------------------
    {
        "id": 1108,
        "keyword": "solid-state battery dry electrode calendaring roll gap sub-micron capacitive displacement sensor telemetry for density",
        "slug": "solid-state-battery-dry-electrode-calendaring-roll-gap-sub-micron-capacitive-displacement-sensor-telemetry-for-density",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Solid-State Electrode Leads & Calendaring Quality Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dry Electrode Roll Gap Telemetry"
    },
    {
        "id": 1109,
        "keyword": "sulfide solid electrolyte film continuous extrusion thickness beta-ray transmission gauge telemetry for pinhole alerts",
        "slug": "sulfide-solid-electrolyte-film-continuous-extrusion-thickness-beta-ray-transmission-gauge-telemetry-for-pinhole-alerts",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Solid Electrolyte Extrusion Leads & Non-Destructive Gauging Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Electrolyte Film Gauge Telemetry"
    },
    {
        "id": 1110,
        "keyword": "lithium metal anode continuous roll thermal evaporation vacuum deposition quartz crystal microbalance telemetry for thickness",
        "slug": "lithium-metal-anode-continuous-roll-thermal-evaporation-vacuum-deposition-quartz-crystal-microbalance-telemetry-for-thickness",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Lithium Anode Deposition Leads & Vacuum Evaporation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Lithium Evaporation QCM Telemetry"
    },
    {
        "id": 1111,
        "keyword": "solid-state battery dry cathode PTFE fibrillization high-shear air classifier torque sensor telemetry for binder networks",
        "slug": "solid-state-battery-dry-cathode-ptfe-fibrillization-high-shear-air-classifier-torque-sensor-telemetry-for-binder-networks",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Dry Battery Binder Scientists & High-Shear Mixing Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy PTFE Fibrillization Telemetry"
    },
    {
        "id": 1112,
        "keyword": "all-solid-state pouch cell stack isostatic press hydraulic compaction pressure transducer telemetry for layer adhesion",
        "slug": "all-solid-state-pouch-cell-stack-isostatic-press-hydraulic-compaction-pressure-transducer-telemetry-for-layer-adhesion",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Cell Assembly Engineering Leads & Isostatic Press Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Isostatic Press Telemetry"
    },
    {
        "id": 1113,
        "keyword": "solid-state battery in-situ electrochemical impedance spectroscopy eis Nyquist plot real-time intercept telemetry for degradation",
        "slug": "solid-state-battery-in-situ-electrochemical-impedance-spectroscopy-eis-nyquist-plot-real-time-intercept-telemetry-for-degradation",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Battery Electrochemistry Leads & In-Situ EIS Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy EIS Nyquist Telemetry"
    },
    {
        "id": 1114,
        "keyword": "solid electrolyte glovebox ultra-low moisture dew point trace water analyzer optical cavity ring-down telemetry for argon purity",
        "slug": "solid-electrolyte-glovebox-ultra-low-moisture-dew-point-trace-water-analyzer-optical-cavity-ring-down-telemetry-for-argon-purity",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Dry Room Atmosphere Engineers & CRDS Moisture Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Glovebox Moisture CRDS Telemetry"
    },
    {
        "id": 1115,
        "keyword": "solid-state battery lithium dendrite acoustic emission resonant piezoelectric transducer telemetry for micro-short circuiting",
        "slug": "solid-state-battery-lithium-dendrite-acoustic-emission-resonant-piezoelectric-transducer-telemetry-for-micro-short-circuiting",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Cell Safety Architects & Acoustic Emission Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dendrite Acoustic Telemetry"
    },
    {
        "id": 1116,
        "keyword": "halide solid electrolyte dry ball milling planetary motion vibration accelerometer spectrum telemetry for mechanochemical kinetics",
        "slug": "halide-solid-electrolyte-dry-ball-milling-planetary-motion-vibration-accelerometer-spectrum-telemetry-for-mechanochemical-kinetics",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Mechanochemistry Materials Leads & Ball Mill Controls Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ball Mill Vibration Telemetry"
    },
    {
        "id": 1117,
        "keyword": "solid-state battery current collector ultrathin copper foil web tension load cell feedback telemetry for zero-wrinkle slitting",
        "slug": "solid-state-battery-current-collector-ultrathin-copper-foil-web-tension-load-cell-feedback-telemetry-for-zero-wrinkle-slitting",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Web Handling Systems Leads & Roll-to-Roll Precision Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Foil Web Tension Telemetry"
    },
    {
        "id": 1118,
        "keyword": "lithium anode surface protective oxide coating atomic layer deposition ald precursor pulse mass flowmeter telemetry for cycling",
        "slug": "lithium-anode-surface-protective-oxide-coating-atomic-layer-deposition-ald-precursor-pulse-mass-flowmeter-telemetry-for-cycling",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "ALD Thin Film Engineers & Anode Surface Protection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Anode ALD Precursor Telemetry"
    },
    {
        "id": 1119,
        "keyword": "solid-state pouch cell expansion force load cell multi-point array telemetry for breathing pressure management",
        "slug": "solid-state-pouch-cell-expansion-force-load-cell-multi-point-array-telemetry-for-breathing-pressure-management",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Pack Mechanical Architecture Leads & Cell Clamping Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pouch Cell Breathing Telemetry"
    },
    {
        "id": 1120,
        "keyword": "solid electrolyte pellet cold sintering process axial displacement linear encoder telemetry for densification kinetics",
        "slug": "solid-electrolyte-pellet-cold-sintering-process-axial-displacement-linear-encoder-telemetry-for-densification-kinetics",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Cold Sintering Process Specialists & Ceramic Densification Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cold Sintering Encoder Telemetry"
    },
    {
        "id": 1121,
        "keyword": "solid-state battery laser tab welding infrared pyrometer melt pool thermal footprint telemetry for zero-spatter bonds",
        "slug": "solid-state-battery-laser-tab-welding-infrared-pyrometer-melt-pool-thermal-footprint-telemetry-for-zero-spatter-bonds",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Laser Welding Process Leads & Pyrometry Quality Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Tab Pyrometry Telemetry"
    },
    {
        "id": 1122,
        "keyword": "dry electrode coating corona discharge surface tension optical contact angle goniometer telemetry for foil wetting",
        "slug": "dry-electrode-coating-corona-discharge-surface-tension-optical-contact-angle-goniometer-telemetry-for-foil-wetting",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Surface Chemistry Leads & Corona Treatment Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Corona Surface Tension Telemetry"
    },
    {
        "id": 1123,
        "keyword": "solid-state battery cell formation multi-frequency impedance spectroscopy four-wire kelvin probe telemetry for seeder checks",
        "slug": "solid-state-battery-cell-formation-multi-frequency-impedance-spectroscopy-four-wire-kelvin-probe-telemetry-for-seeder-checks",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Formation Cycling Leads & Four-Wire Kelvin Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cell Formation Kelvin Telemetry"
    },
    {
        "id": 1124,
        "keyword": "solid electrolyte grain boundary resistance cryogenic dielectric relaxation spectroscopy telemetry for lithium transport",
        "slug": "solid-electrolyte-grain-boundary-resistance-cryogenic-dielectric-relaxation-spectroscopy-telemetry-for-lithium-transport",
        "category": "Solutions",
        "hub_category": "Solid-State Energy Storage & Battery Gigafactories",
        "target_persona": "Ionic Transport Physicists & Dielectric Spectroscopy Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dielectric Relaxation Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Spaceborne Gravitational Wave Laser Interferometry (16 solutions, IDs 1125-1140)
    # -------------------------------------------------------------------------
    {
        "id": 1125,
        "keyword": "spaceborne gravitational wave laser heterodyne inter-spacecraft optical phase measurement telemetry for picometer arms",
        "slug": "spaceborne-gravitational-wave-laser-heterodyne-inter-spacecraft-optical-phase-measurement-telemetry-for-picometer-arms",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Space Laser Interferometry Leads & Heterodyne Phase Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Heterodyne Phase Telemetry"
    },
    {
        "id": 1126,
        "keyword": "gravitational wave satellite drag-free cold gas micro-thruster impulse bit telemetry for test mass geodetic tracking",
        "slug": "gravitational-wave-satellite-drag-free-cold-gas-micro-thruster-impulse-bit-telemetry-for-test-mass-geodetic-tracking",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Drag-Free Satellite Control Leads & Micro-Propulsion Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Drag-Free Micro-Thruster Telemetry"
    },
    {
        "id": 1127,
        "keyword": "spaceborne optical bench ultra-stable zerodur glass-ceramic thermal expansion capacitive dilatometer telemetry for stability",
        "slug": "spaceborne-optical-bench-ultra-stable-zerodur-glass-ceramic-thermal-expansion-capacitive-dilatometer-telemetry-for-stability",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Optical Bench Mechanical Leads & Zerodur Metrology Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Zerodur Dilatometer Telemetry"
    },
    {
        "id": 1128,
        "keyword": "gravitational wave test mass electrostatic suspension capacitive position sensing bridge telemetry for pico-newton actuation",
        "slug": "gravitational-wave-test-mass-electrostatic-suspension-capacitive-position-sensing-bridge-telemetry-for-pico-newton-actuation",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Electrostatic Suspension Engineers & Inertial Sensor Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Electrostatic Suspension Telemetry"
    },
    {
        "id": 1129,
        "keyword": "spaceborne laser frequency stabilization iodine absorption cell saturated spectroscopy error signal telemetry for arm locking",
        "slug": "spaceborne-laser-frequency-stabilization-iodine-absorption-cell-saturated-spectroscopy-error-signal-telemetry-for-arm-locking",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Laser Stabilization Leads & Optical Frequency Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Frequency Locking Telemetry"
    },
    {
        "id": 1130,
        "keyword": "gravitational wave quadrant photodiode differential wavefront sensing dws angle-to-length coupling telemetry for beam pointing",
        "slug": "gravitational-wave-quadrant-photodiode-differential-wavefront-sensing-dws-angle-to-length-coupling-telemetry-for-beam-pointing",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "DWS Alignment Leads & Quadrant Photodiode Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy DWS Beam Pointing Telemetry"
    },
    {
        "id": 1131,
        "keyword": "spaceborne optical telescope off-axis parabolic mirror carbon fiber metering structure thermal distortion telemetry for collimation",
        "slug": "spaceborne-optical-telescope-off-axis-parabolic-mirror-carbon-fiber-metering-structure-thermal-distortion-telemetry-for-collimation",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Space Telescope Architects & CFRP Metering Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Telescope Metering Telemetry"
    },
    {
        "id": 1132,
        "keyword": "gravitational wave test mass uv led charge control photoemission discharge wire telemetry for non-contact discharging",
        "slug": "gravitational-wave-test-mass-uv-led-charge-control-photoemission-discharge-wire-telemetry-for-non-contact-discharging",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Cosmic Ray Discharging Leads & UV Photoemission Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy UV Charge Control Telemetry"
    },
    {
        "id": 1133,
        "keyword": "spaceborne time-delay interferometry tdi laser phase noise synthetic cancellation fractional delay telemetry for arm mismatch",
        "slug": "spaceborne-time-delay-interferometry-tdi-laser-phase-noise-synthetic-cancellation-fractional-delay-telemetry-for-arm-mismatch",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "TDI Algorithm Leads & Digital Signal Processing Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy TDI Phase Cancellation Telemetry"
    },
    {
        "id": 1134,
        "keyword": "gravitational wave satellite optical bench bonded silica fiber laser power monitor photodiode relative intensity noise telemetry",
        "slug": "gravitational-wave-satellite-optical-bench-bonded-silica-fiber-laser-power-monitor-photodiode-relative-intensity-noise-telemetry",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Laser RIN Metrologists & Fiber Optic Bench Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser RIN Monitor Telemetry"
    },
    {
        "id": 1135,
        "keyword": "spaceborne gravitational wave constellation inter-satellite laser frequency offset optical phase locked loop telemetry for tracking",
        "slug": "spaceborne-gravitational-wave-constellation-inter-satellite-laser-frequency-offset-optical-phase-locked-loop-telemetry-for-tracking",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "OPLL Phase Lock Leads & Inter-Satellite Tracking Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Optical PLL Tracking Telemetry"
    },
    {
        "id": 1136,
        "keyword": "gravitational wave inertial test mass caging mechanism release velocity optical triangulation shadow sensor telemetry for launch",
        "slug": "gravitational-wave-inertial-test-mass-caging-mechanism-release-velocity-optical-triangulation-shadow-sensor-telemetry-for-launch",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Caging Mechanism Leads & Inertial Release Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Test Mass Caging Telemetry"
    },
    {
        "id": 1137,
        "keyword": "spaceborne optical phase meter adc clock jitter pilot tone phase calibration telemetry for sub-femtosecond timing",
        "slug": "spaceborne-optical-phase-meter-adc-clock-jitter-pilot-tone-phase-calibration-telemetry-for-sub-femtosecond-timing",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Phase Meter Firmware Leads & Clock Jitter Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pilot Tone Clock Telemetry"
    },
    {
        "id": 1138,
        "keyword": "gravitational wave point-ahead angle mechanism paam piezoelectric actuator hysteresis capacitive sensor telemetry for orbit slews",
        "slug": "gravitational-wave-point-ahead-angle-mechanism-paam-piezoelectric-actuator-hysteresis-capacitive-sensor-telemetry-for-orbit-slews",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "PAAM Mechanism Leads & Precision Piezo Actuation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy PAAM Piezo Mechanism Telemetry"
    },
    {
        "id": 1139,
        "keyword": "spaceborne optical bench thermal shield multi-layer insulation mli gradient platinum resistance thermometer telemetry for drift",
        "slug": "spaceborne-optical-bench-thermal-shield-multi-layer-insulation-mli-gradient-platinum-resistance-thermometer-telemetry-for-drift",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Thermal Control Systems Leads & PRT Precision Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thermal Shield PRT Telemetry"
    },
    {
        "id": 1140,
        "keyword": "gravitational wave test mass residual gas damping spinning rotor gauge molecular drag telemetry for Brownian limit",
        "slug": "gravitational-wave-test-mass-residual-gas-damping-spinning-rotor-gauge-molecular-drag-telemetry-for-brownian-limit",
        "category": "Solutions",
        "hub_category": "Gravitational Wave Astrophysics & Precision Metrology",
        "target_persona": "Brownian Noise Physicists & Molecular Drag Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Molecular Drag Telemetry"
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
    for kw in wave25_keywords:
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

    print(f"Successfully ingested {added_count} Wave 25 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
