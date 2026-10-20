#!/usr/bin/env python3
"""
ingest_wave26_keywords.py — Ingestion script for Wave 26 BOFU Solutions (IDs 1,141–1,190)

Fleet Scaling Target:
- Add 50 high-lever deep-tech industrial telemetry solutions
- Scale from 1,140 to 1,190 solutions
"""

import json
from pathlib import Path

QUEUE_PATH = Path(__file__).parent / "compact_keywords_queue.json"

wave26_keywords = [
    # Cluster 1: High-NA EUV Photolithography Wafer Stage Interferometry & Pellicle Degradation Telemetry (IDs 1,141–1,157, 17 solutions)
    {
        "id": 1141,
        "keyword": "high-NA EUV lithography anamorphic projection optics thermal wavefront distortion interferometer telemetry for aberration control",
        "slug": "high-na-euv-lithography-anamorphic-projection-optics-thermal-wavefront-distortion-interferometer-telemetry-for-aberration-control",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Lithography Systems Directors & Fab Yield VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Advanced Lithography Architecture Audit"
    },
    {
        "id": 1142,
        "keyword": "EUV wafer stage dual-chuck magnetic levitation planar motor sub-nanometer laser heterodyne encoder telemetry for overlay accuracy",
        "slug": "euv-wafer-stage-dual-chuck-magnetic-levitation-planar-motor-sub-nanometer-laser-heterodyne-encoder-telemetry-for-overlay-accuracy",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Semiconductor Wafer Stage Controls Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wafer Stage Metrology Audit"
    },
    {
        "id": 1143,
        "keyword": "carbon nanotube EUV pellicle thermo-mechanical deflection laser Doppler vibrometry telemetry for burst protection",
        "slug": "carbon-nanotube-euv-pellicle-thermo-mechanical-deflection-laser-doppler-vibrometry-telemetry-for-burst-protection",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Mask Infrastructure Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pellicle Reliability Audit"
    },
    {
        "id": 1144,
        "keyword": "high-power tin droplet laser-produced plasma LPP debris mitigation hydrogen buffer gas flow telemetry for collector mirror reflectivity",
        "slug": "high-power-tin-droplet-laser-produced-plasma-lpp-debris-mitigation-hydrogen-buffer-gas-flow-telemetry-for-collector-mirror-reflectivity",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Source Optics Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule EUV Source Telemetry Audit"
    },
    {
        "id": 1145,
        "keyword": "EUV reticle pod inner environment ultra-high purity argon purge mass flow controller telemetry for molecular contamination",
        "slug": "euv-reticle-pod-inner-environment-ultra-high-purity-argon-purge-mass-flow-controller-telemetry-for-molecular-contamination",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Fab Cleanroom Yield Management Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cleanroom Reticle Environment Audit"
    },
    {
        "id": 1146,
        "keyword": "wafer clamp electrostatic chuck multi-zone helium backside cooling pressure transducer telemetry for chucking flatness",
        "slug": "wafer-clamp-electrostatic-chuck-multi-zone-helium-backside-cooling-pressure-transducer-telemetry-for-chucking-flatness",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Wafer Clamping & Thermal Control Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Electrostatic Chucking Audit"
    },
    {
        "id": 1147,
        "keyword": "EUV pulse-to-pulse energy stability high-speed diamond photodiode array telemetry for critical dimension uniformity",
        "slug": "euv-pulse-to-pulse-energy-stability-high-speed-diamond-photodiode-array-telemetry-for-critical-dimension-uniformity",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Lithography Process Integration Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Energy Dose Stability Audit"
    },
    {
        "id": 1148,
        "keyword": "lithography immersion wafer bevel defect darkfield scatterometry telemetry for edge-bead removal validation",
        "slug": "lithography-immersion-wafer-bevel-defect-darkfield-scatterometry-telemetry-for-edge-bead-removal-validation",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Advanced Packaging & Bevel Inspection Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wafer Bevel Metrology Audit"
    },
    {
        "id": 1149,
        "keyword": "extreme ultraviolet spectral purity filter silicon zirconium membrane transmission telemetry for out-of-band IR suppression",
        "slug": "extreme-ultraviolet-spectral-purity-filter-silicon-zirconium-membrane-transmission-telemetry-for-out-of-band-ir-suppression",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Beamline Optical Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Spectral Filter Purity Audit"
    },
    {
        "id": 1150,
        "keyword": "wafer stage vacuum chamber ultra-high vacuum turbomolecular pump magnetic bearing vibration telemetry for jitter isolation",
        "slug": "wafer-stage-vacuum-chamber-ultra-high-vacuum-turbomolecular-pump-magnetic-bearing-vibration-telemetry-for-jitter-isolation",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Vacuum Systems & Vibration Isolation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Vacuum Pump Telemetry Audit"
    },
    {
        "id": 1151,
        "keyword": "high-NA EUV reticle masking blade piezoelectric actuator linear variable differential transformer LVDT telemetry for exposure slit alignment",
        "slug": "high-na-euv-reticle-masking-blade-piezoelectric-actuator-linear-variable-differential-transformer-lvdt-telemetry-for-exposure-slit-alignment",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Reticle Masking & Slit Optics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Reticle Slit Alignment Audit"
    },
    {
        "id": 1152,
        "keyword": "high-power carbon dioxide drive laser master oscillator power amplifier pulse timing jitter telemetry for droplet synchronization",
        "slug": "high-power-carbon-dioxide-drive-laser-master-oscillator-power-amplifier-pulse-timing-jitter-telemetry-for-droplet-synchronization",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Industrial High-Power Laser Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Drive Laser Pulse Jitter Audit"
    },
    {
        "id": 1153,
        "keyword": "photolithography chemical amplified resist bake hotplate multi-zone RTD temperature uniformity telemetry for line edge roughness",
        "slug": "photolithography-chemical-amplified-resist-bake-hotplate-multi-zone-rtd-temperature-uniformity-telemetry-for-line-edge-roughness",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Track & Thermal Processing Yield Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Exposure Bake Telemetry Audit"
    },
    {
        "id": 1154,
        "keyword": "EUV scanner illuminator pupil shaping mirror array MEMS tilt angle capacitive sensor telemetry for dipole illumination",
        "slug": "euv-scanner-illuminator-pupil-shaping-mirror-array-mems-tilt-angle-capacitive-sensor-telemetry-for-dipole-illumination",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "EUV Illumination Optical Design Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pupil Shaping Telemetry Audit"
    },
    {
        "id": 1155,
        "keyword": "lithography wafer edge focus tracking chromatic confocal sensor displacement telemetry for topography compensation",
        "slug": "lithography-wafer-edge-focus-tracking-chromatic-confocal-sensor-displacement-telemetry-for-topography-compensation",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Wafer Leveling & Focus Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Focus Tracking Metrology Audit"
    },
    {
        "id": 1156,
        "keyword": "lithography reticle inspection deep ultraviolet actinic dark-field TDI sensor telemetry for sub-10nm phase defect detection",
        "slug": "lithography-reticle-inspection-deep-ultraviolet-actinic-dark-field-tdi-sensor-telemetry-for-sub-10nm-phase-defect-detection",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Photomask Quality Assurance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Actinic Reticle Inspection Audit"
    },
    {
        "id": 1157,
        "keyword": "wafer notch optical alignment dual-axis laser triangulation sensor telemetry for litho pre-alignment repeatable indexing",
        "slug": "wafer-notch-optical-alignment-dual-axis-laser-triangulation-sensor-telemetry-for-litho-pre-alignment-repeatable-indexing",
        "category": "Solutions",
        "hub_category": "Semiconductor Lithography & Nanofabrication",
        "target_persona": "Wafer Handling & Pre-Aligner Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pre-Aligner Telemetry Audit"
    },

    # Cluster 2: Hypersonic Scramjet Propulsion Shock-Train & Active Cryogenic Methane Cooling Telemetry (IDs 1,158–1,174, 17 solutions)
    {
        "id": 1158,
        "keyword": "scramjet isolator pseudo-shock wave boundary layer separation dynamic piezo-resistive pressure transducer array telemetry for unstart prevention",
        "slug": "scramjet-isolator-pseudo-shock-wave-boundary-layer-separation-dynamic-piezo-resistive-pressure-transducer-array-telemetry-for-unstart-prevention",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Hypersonic Propulsion Aerodynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Scramjet Isolator Telemetry Audit"
    },
    {
        "id": 1159,
        "keyword": "cryogenic liquid methane regenerative cooling channel high-pressure differential flow transmitter telemetry for coking suppression",
        "slug": "cryogenic-liquid-methane-regenerative-cooling-channel-high-pressure-differential-flow-transmitter-telemetry-for-coking-suppression",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Regenerative Cooling Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Cooling Channel Audit"
    },
    {
        "id": 1160,
        "keyword": "hypersonic vehicle carbon-carbon leading edge ultra-high temperature dual-wavelength pyrometer telemetry for thermal protection boundary",
        "slug": "hypersonic-vehicle-carbon-carbon-leading-edge-ultra-high-temperature-dual-wavelength-pyrometer-telemetry-for-thermal-protection-boundary",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Thermal Protection System (TPS) Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Leading Edge Pyrometry Audit"
    },
    {
        "id": 1161,
        "keyword": "scramjet cavity flameholder supersonic fuel injection strut strain gauge load cell telemetry for aerothermal vibration fatigue",
        "slug": "scramjet-cavity-flameholder-supersonic-fuel-injection-strut-strain-gauge-load-cell-telemetry-for-aerothermal-vibration-fatigue",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Combustion Chamber Structural Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Flameholder Vibration Telemetry Audit"
    },
    {
        "id": 1162,
        "keyword": "hypersonic boundary layer transition surface-mounted atomic layer thermopile heat flux gauge telemetry for laminar-turbulent transition",
        "slug": "hypersonic-boundary-layer-transition-surface-mounted-atomic-layer-thermopile-heat-flux-gauge-telemetry-for-laminar-turbulent-transition",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Hypersonic Boundary Layer Aerodynamicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Boundary Layer Heat Flux Audit"
    },
    {
        "id": 1163,
        "keyword": "scramjet inlet variable geometry cowl lip hydraulic linear variable displacement transducer LVDT telemetry for shock-on-lip control",
        "slug": "scramjet-inlet-variable-geometry-cowl-lip-hydraulic-linear-variable-displacement-transducer-lvdt-telemetry-for-shock-on-lip-control",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Variable Inlet Actuation Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Shock-on-Lip Telemetry Audit"
    },
    {
        "id": 1164,
        "keyword": "laser absorption spectroscopy scramjet combustor water vapor column density and gas temperature telemetry for combustion efficiency",
        "slug": "laser-absorption-spectroscopy-scramjet-combustor-water-vapor-column-density-and-gas-temperature-telemetry-for-combustion-efficiency",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Optical Diagnostic Combustion Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Combustor Spectroscopy Audit"
    },
    {
        "id": 1165,
        "keyword": "scramjet fuel manifold electro-mechanical proportional metering valve cryogenic mass flowmeter telemetry for stoichiometric fuel-air ratio",
        "slug": "scramjet-fuel-manifold-electro-mechanical-proportional-metering-valve-cryogenic-mass-flowmeter-telemetry-for-stoichiometric-fuel-air-ratio",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Hypersonic Fuel Metering & FADEC Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fuel Metering Telemetry Audit"
    },
    {
        "id": 1166,
        "keyword": "hypersonic aerodynamic control fin ceramic matrix composite torque tube torsional fiber Bragg grating telemetry for flutter mitigation",
        "slug": "hypersonic-aerodynamic-control-fin-ceramic-matrix-composite-torque-tube-torsional-fiber-bragg-grating-telemetry-for-flutter-mitigation",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Aeroelasticity & Control Surface Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Aeroelastic Flutter Telemetry Audit"
    },
    {
        "id": 1167,
        "keyword": "scramjet plasma-assisted ignition spark discharge sub-nanosecond pulse current transformer telemetry for high-altitude relight",
        "slug": "scramjet-plasma-assisted-ignition-spark-discharge-sub-nanosecond-pulse-current-transformer-telemetry-for-high-altitude-relight",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Plasma Ignition Systems Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Plasma Ignition Telemetry Audit"
    },
    {
        "id": 1168,
        "keyword": "hypersonic nosecone stagnation point pitot-static multi-hole probe differential pressure transducer telemetry for freestream Mach number",
        "slug": "hypersonic-nosecone-stagnation-point-pitot-static-multi-hole-probe-differential-pressure-transducer-telemetry-for-freestream-mach-number",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Air Data Metrology & Flight Test Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Stagnation Probe Telemetry Audit"
    },
    {
        "id": 1169,
        "keyword": "scramjet exhaust nozzle expansion ramp radiative heat flux thin-film heat gauge array telemetry for thrust vectoring performance",
        "slug": "scramjet-exhaust-nozzle-expansion-ramp-radiative-heat-flux-thin-film-heat-gauge-array-telemetry-for-thrust-vectoring-performance",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Nozzle Expansion & SERN Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nozzle Expansion Telemetry Audit"
    },
    {
        "id": 1170,
        "keyword": "hypersonic airframe structural titanium aluminide honeycomb core acoustic emission sensor telemetry for thermal micro-cracking",
        "slug": "hypersonic-airframe-structural-titanium-aluminide-honeycomb-core-acoustic-emission-sensor-telemetry-for-thermal-micro-cracking",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Structural Health Monitoring (SHM) Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Honeycomb Structural Telemetry Audit"
    },
    {
        "id": 1171,
        "keyword": "scramjet fuel line cavity acoustic resonance piezoresistive dynamic pressure sensor telemetry for combustion instability suppression",
        "slug": "scramjet-fuel-line-cavity-acoustic-resonance-piezoresistive-dynamic-pressure-sensor-telemetry-for-combustion-instability-suppression",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Combustion Dynamics & Instability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Fuel Line Resonance Audit"
    },
    {
        "id": 1172,
        "keyword": "cryogenic fuel tank composite overwrapped pressure vessel COPV optical fiber distributed strain telemetry for cryogenic chilldown",
        "slug": "cryogenic-fuel-tank-composite-overwrapped-pressure-vessel-copv-optical-fiber-distributed-strain-telemetry-for-cryogenic-chilldown",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Cryogenic Tankage Structural Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule COPV Chilldown Strain Audit"
    },
    {
        "id": 1173,
        "keyword": "hypersonic boundary layer bleed slot porous panel suction mass flow sensor telemetry for shock-wave turbulent boundary layer interaction",
        "slug": "hypersonic-boundary-layer-bleed-slot-porous-panel-suction-mass-flow-sensor-telemetry-for-shock-wave-turbulent-boundary-layer-interaction",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Shock-Boundary Layer Interaction Aerodynamicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Boundary Layer Bleed Telemetry Audit"
    },
    {
        "id": 1174,
        "keyword": "scramjet igniter torch hydrogen-oxygen premix manifold flash-back ionization probe telemetry for flame holding stability",
        "slug": "scramjet-igniter-torch-hydrogen-oxygen-premix-manifold-flash-back-ionization-probe-telemetry-for-flame-holding-stability",
        "category": "Solutions",
        "hub_category": "Aerospace Hypersonics & Scramjet Propulsion",
        "target_persona": "Igniter Torch Systems & Safety Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Igniter Torch Stability Audit"
    },

    # Cluster 3: Subsea Ultra-Deepwater Production Wellhead Electric BOP Acoustic Multiplex Telemetry (IDs 1,175–1,190, 16 solutions)
    {
        "id": 1175,
        "keyword": "subsea all-electric blowout preventer BOP ram actuator brushless DC motor torque and resolver angle telemetry for emergency shearing",
        "slug": "subsea-all-electric-blowout-preventer-bop-ram-actuator-brushless-dc-motor-torque-and-resolver-angle-telemetry-for-emergency-shearing",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea BOP Systems & Drilling Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Electric BOP Ram Telemetry Audit"
    },
    {
        "id": 1176,
        "keyword": "subsea wellhead connector hydraulic locking ring collet dog latch acoustic transponder telemetry for fatigue load monitoring",
        "slug": "subsea-wellhead-connector-hydraulic-locking-ring-collet-dog-latch-acoustic-transponder-telemetry-for-fatigue-load-monitoring",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Wellhead Structural Integrity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wellhead Connector Telemetry Audit"
    },
    {
        "id": 1177,
        "keyword": "deepwater riser joint syntactic foam buoyancy module hydrostatic pressure sensor telemetry for water ingress detection",
        "slug": "deepwater-riser-joint-syntactic-foam-buoyancy-module-hydrostatic-pressure-sensor-telemetry-for-water-ingress-detection",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Marine Drilling Riser Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Riser Buoyancy Telemetry Audit"
    },
    {
        "id": 1178,
        "keyword": "subsea christmas tree choke valve ceramic trim erosion ultrasonic thickness monitoring transducer telemetry for sand production",
        "slug": "subsea-christmas-tree-choke-valve-ceramic-trim-erosion-ultrasonic-thickness-monitoring-transducer-telemetry-for-sand-production",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Production Trees & Flow Assurance Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Choke Valve Erosion Audit"
    },
    {
        "id": 1179,
        "keyword": "subsea manifold multiphase flow meter dual-energy gamma-ray densitometer telemetry for water cut and gas-oil ratio calculation",
        "slug": "subsea-manifold-multiphase-flow-meter-dual-energy-gamma-ray-densitometer-telemetry-for-water-cut-and-gas-oil-ratio-calculation",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Reservoir Allocation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Multiphase Flowmeter Telemetry Audit"
    },
    {
        "id": 1180,
        "keyword": "subsea dynamic electrical umbilical optical fiber distributed acoustic sensing DAS telemetry for vortex-induced vibration",
        "slug": "subsea-dynamic-electrical-umbilical-optical-fiber-distributed-acoustic-sensing-das-telemetry-for-vortex-induced-vibration",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Umbilical & Cable Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Umbilical Vibration Telemetry Audit"
    },
    {
        "id": 1181,
        "keyword": "deepwater subsea separator gravity vessel interface level nucleonic density profiler telemetry for emulsion layer tracking",
        "slug": "deepwater-subsea-separator-gravity-vessel-interface-level-nucleonic-density-profiler-telemetry-for-emulsion-layer-tracking",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Processing & Separation Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Subsea Separator Interface Audit"
    },
    {
        "id": 1182,
        "keyword": "subsea high-integrity pressure protection system HIPPS triple modular redundant pressure transmitter telemetry for overpressure isolation",
        "slug": "subsea-high-integrity-pressure-protection-system-hipps-triple-modular-redundant-pressure-transmitter-telemetry-for-overpressure-isolation",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Safety Instrumented Systems (SIS) Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Subsea HIPPS Telemetry Audit"
    },
    {
        "id": 1183,
        "keyword": "subsea pipeline end termination PLET mudmat suction pile differential settlement tiltmeter telemetry for seabed geotechnics",
        "slug": "subsea-pipeline-end-termination-plet-mudmat-suction-pile-differential-settlement-tiltmeter-telemetry-for-seabed-geotechnics",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Geotechnical & Foundation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule PLET Suction Pile Telemetry Audit"
    },
    {
        "id": 1184,
        "keyword": "deepwater electric subsea control module e-SCM dual-redundant CANopen fieldbus communications packet error rate telemetry",
        "slug": "deepwater-electric-subsea-control-module-e-scm-dual-redundant-canopen-fieldbus-communications-packet-error-rate-telemetry",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Controls & Instrumentation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Subsea Fieldbus Telemetry Audit"
    },
    {
        "id": 1185,
        "keyword": "subsea electric actuator spring-return failsafe mechanism linear displacement potentiometer telemetry for valve closure verification",
        "slug": "subsea-electric-actuator-spring-return-failsafe-mechanism-linear-displacement-potentiometer-telemetry-for-valve-closure-verification",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Actuator & Valve Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Failsafe Valve Telemetry Audit"
    },
    {
        "id": 1186,
        "keyword": "subsea cathodic protection electric field gradient rotating silver-silver chloride reference electrode telemetry for pipeline corrosion",
        "slug": "subsea-cathodic-protection-electric-field-gradient-rotating-silver-silver-chloride-reference-electrode-telemetry-for-pipeline-corrosion",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Corrosion & Cathodic Protection Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cathodic Protection Telemetry Audit"
    },
    {
        "id": 1187,
        "keyword": "deepwater seabed template dual-axis gyro inclinometer and acoustic positioning transponder telemetry for wellbore verticality",
        "slug": "deepwater-seabed-template-dual-axis-gyro-inclinometer-and-acoustic-positioning-transponder-telemetry-for-wellbore-verticality",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Drilling Geodesy & Subsea Survey Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Seabed Template Alignment Audit"
    },
    {
        "id": 1188,
        "keyword": "subsea jumper thermal insulation aerogel jacket distributed temperature sensing DTS optical fiber telemetry for hydrate blockage prevention",
        "slug": "subsea-jumper-thermal-insulation-aerogel-jacket-distributed-temperature-sensing-dts-optical-fiber-telemetry-for-hydrate-blockage-prevention",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Flow Assurance & Thermal Engineering Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Subsea Hydrate Prevention Audit"
    },
    {
        "id": 1189,
        "keyword": "subsea hydraulic power unit accumulator bank bladder nitrogen pre-charge pressure transducer telemetry for emergency storage reserve",
        "slug": "subsea-hydraulic-power-unit-accumulator-bank-bladder-nitrogen-pre-charge-pressure-transducer-telemetry-for-emergency-storage-reserve",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Hydraulic Systems Operations Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Hydraulic Accumulator Telemetry Audit"
    },
    {
        "id": 1190,
        "keyword": "subsea wet-gas compressor active magnetic bearing gap eddy-current sensor telemetry for rotor dynamic stability",
        "slug": "subsea-wet-gas-compressor-active-magnetic-bearing-gap-eddy-current-sensor-telemetry-for-rotor-dynamic-stability",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Rotating Machinery & Compression Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wet-Gas Compressor Telemetry Audit"
    }
]

def main():
    if not QUEUE_PATH.exists():
        print(f"Error: {QUEUE_PATH} not found.")
        return

    existing = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in existing}
    existing_slugs = {item["slug"] for item in existing}

    added = 0
    for kw in wave26_keywords:
        if kw["id"] in existing_ids:
            print(f"Skipping ID {kw['id']}: already in queue.")
            continue
        if kw["slug"] in existing_slugs:
            print(f"Skipping slug '{kw['slug']}': already in queue.")
            continue
        existing.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added += 1

    QUEUE_PATH.write_text(json.dumps(existing, indent=2), encoding="utf-8")
    print(f"✅ Successfully ingested {added} new keywords into {QUEUE_PATH}.")
    print(f"Total keywords in queue now: {len(existing)}")

if __name__ == "__main__":
    main()
