#!/usr/bin/env python3
"""
ingest_wave27_keywords.py — Ingestion script for Wave 27 BOFU Solutions (IDs 1,191–1,240)

Fleet Scaling Target:
- Add 50 high-lever deep-tech industrial telemetry solutions
- Scale from 1,190 to 1,240 solutions
"""

import json
from pathlib import Path

QUEUE_PATH = Path(__file__).parent / "compact_keywords_queue.json"

wave27_keywords = [
    # Cluster 1: Quantum Diamond NV Center Magnetometry & Nanoscale Spin Resonance Telemetry (IDs 1,191–1,207, 17 solutions)
    {
        "id": 1191,
        "keyword": "quantum diamond nitrogen-vacancy NV center optically detected magnetic resonance ODMR microwave resonance peak telemetry for nanoscale magnetometry",
        "slug": "quantum-diamond-nitrogen-vacancy-nv-center-optically-detected-magnetic-resonance-odmr-microwave-resonance-peak-telemetry-for-nanoscale-magnetometry",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Magnetometry & Metrology Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Quantum Magnetometry Architecture Audit"
    },
    {
        "id": 1192,
        "keyword": "diamond NV center single-spin dephasing time T2 Hahn echo pulse sequence telemetry for room-temperature quantum sensor calibration",
        "slug": "diamond-nv-center-single-spin-dephasing-time-t2-hahn-echo-pulse-sequence-telemetry-for-room-temperature-quantum-sensor-calibration",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Sensor Calibration & Spin Physics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Spin Coherence Telemetry Audit"
    },
    {
        "id": 1193,
        "keyword": "nanoscale nuclear magnetic resonance NMR diamond NV center confocal microscope photon counter telemetry for chemical shift detection",
        "slug": "nanoscale-nuclear-magnetic-resonance-nmr-diamond-nv-center-confocal-microscope-photon-counter-telemetry-for-chemical-shift-detection",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Nanoscale NMR & Molecular Imaging Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nanoscale NMR Telemetry Audit"
    },
    {
        "id": 1194,
        "keyword": "diamond NV center magnetic field gradient microwave stripline coplanar waveguide vector microwave field telemetry for spin manipulation",
        "slug": "diamond-nv-center-magnetic-field-gradient-microwave-stripline-coplanar-waveguide-vector-microwave-field-telemetry-for-spin-manipulation",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Microwave Engineering & Quantum Spin Control Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Microwave Waveguide Telemetry Audit"
    },
    {
        "id": 1195,
        "keyword": "diamond NV magnetometer laser-induced fluorescence photodiode array differential common-mode noise cancellation telemetry",
        "slug": "diamond-nv-magnetometer-laser-induced-fluorescence-photodiode-array-differential-common-mode-noise-cancellation-telemetry",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Optical Detection & Photodiode Array Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Optical Fluorescence Telemetry Audit"
    },
    {
        "id": 1196,
        "keyword": "quantum diamond NV center temperature-dependent zero-field splitting parameter D shift telemetry for sub-millikelvin thermometry",
        "slug": "quantum-diamond-nv-center-temperature-dependent-zero-field-splitting-parameter-d-shift-telemetry-for-sub-millikelvin-thermometry",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Precision Cryogenic Thermometry Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Quantum Thermometry Telemetry Audit"
    },
    {
        "id": 1197,
        "keyword": "diamond NV center lattice strain piezo-actuator four-point bending jig telemetry for transverse stress quantum sensing",
        "slug": "diamond-nv-center-lattice-strain-piezo-actuator-four-point-bending-jig-telemetry-for-transverse-stress-quantum-sensing",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Solid-State Stress & Strain Metrology Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Lattice Strain Telemetry Audit"
    },
    {
        "id": 1198,
        "keyword": "nitrogen-vacancy diamond tip atomic force microscope AFM contact force deflection telemetry for scanning magnetic microscopy",
        "slug": "nitrogen-vacancy-diamond-tip-atomic-force-microscope-afm-contact-force-deflection-telemetry-for-scanning-magnetic-microscopy",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Scanning Probe & AFM Magnetometry Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Scanning NV Microscopy Audit"
    },
    {
        "id": 1199,
        "keyword": "diamond NV center green pump laser 532nm optical power acoustic-optic modulator AOM feedback telemetry for spin polarization",
        "slug": "diamond-nv-center-green-pump-laser-532nm-optical-power-acoustic-optic-modulator-aom-feedback-telemetry-for-spin-polarization",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Laser Optoelectronics & Quantum Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pump Laser Feedback Audit"
    },
    {
        "id": 1200,
        "keyword": "diamond NV center ensemble cryogenic microwave resonator cavity Q-factor telemetry for quantum memory coherence",
        "slug": "diamond-nv-center-ensemble-cryogenic-microwave-resonator-cavity-q-factor-telemetry-for-quantum-memory-coherence",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Memory & Cavity QED Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cavity QED Resonator Audit"
    },
    {
        "id": 1201,
        "keyword": "diamond surface chemical vapor deposition CVD isotopic carbon-12 enrichment gas chromatography telemetry for nuclear spin bath purity",
        "slug": "diamond-surface-chemical-vapor-deposition-cvd-isotopic-carbon-12-enrichment-gas-chromatography-telemetry-for-nuclear-spin-bath-purity",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Diamond Synthesis & CVD Materials Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule CVD Isotopic Purity Audit"
    },
    {
        "id": 1202,
        "keyword": "nanodiamond nitrogen-vacancy center cellular intracellular micro-injection fluorescence lifetime imaging microscopy telemetry",
        "slug": "nanodiamond-nitrogen-vacancy-center-cellular-intracellular-micro-injection-fluorescence-lifetime-imaging-microscopy-telemetry",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Biophysical Quantum Sensing & Cellular Bio-Imaging Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Intracellular Nanodiamond Telemetry Audit"
    },
    {
        "id": 1203,
        "keyword": "diamond NV center optically pumped nuclear spin hyperpolarization cross-relaxation telemetry for metabolic MRI enhancement",
        "slug": "diamond-nv-center-optically-pumped-nuclear-spin-hyperpolarization-cross-relaxation-telemetry-for-metabolic-mri-enhancement",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Hyperpolarization & Preclinical MRI Researchers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Hyperpolarization Telemetry Audit"
    },
    {
        "id": 1204,
        "keyword": "quantum diamond NV magnetometer three-axis Helmholtz coil active ambient magnetic field cancellation telemetry for magnetic shielding",
        "slug": "quantum-diamond-nv-magnetometer-three-axis-helmholtz-coil-active-ambient-magnetic-field-cancellation-telemetry-for-magnetic-shielding",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Magnetic Shielding & Ambient Noise Cancellation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Helmholtz Shielding Telemetry Audit"
    },
    {
        "id": 1205,
        "keyword": "diamond NV center charge state NV-minus to NV-zero photo-ionization spectral ratio telemetry for charge stability",
        "slug": "diamond-nv-center-charge-state-nv-minus-to-nv-zero-photo-ionization-spectral-ratio-telemetry-for-charge-stability",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Diamond Defect Charge State Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Defect Charge Stability Audit"
    },
    {
        "id": 1206,
        "keyword": "diamond membrane chemical mechanical polishing CMP atomic force step height interferometer telemetry for optical cavity coupling",
        "slug": "diamond-membrane-chemical-mechanical-polishing-cmp-atomic-force-step-height-interferometer-telemetry-for-optical-cavity-coupling",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Diamond Nanofabrication & Polishing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Diamond CMP Metrology Audit"
    },
    {
        "id": 1207,
        "keyword": "nitrogen-vacancy center microwave Rabi oscillation frequency pulse length telemetry for quantum gate fidelity validation",
        "slug": "nitrogen-vacancy-center-microwave-rabi-oscillation-frequency-pulse-length-telemetry-for-quantum-gate-fidelity-validation",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Logic Gate & Quantum Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Rabi Oscillation Fidelity Audit"
    },

    # Cluster 2: Tokamak Disruption Mitigation Massive Gas Injection & Runaway Electron Telemetry (IDs 1,208–1,224, 17 solutions)
    {
        "id": 1208,
        "keyword": "tokamak disruption mitigation system fast-acting eddy current valve gas plenum discharge pressure telemetry for massive gas injection",
        "slug": "tokamak-disruption-mitigation-system-fast-acting-eddy-current-valve-gas-plenum-discharge-pressure-telemetry-for-massive-gas-injection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Fusion Disruption Mitigation Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Disruption Mitigation Telemetry Audit"
    },
    {
        "id": 1209,
        "keyword": "tokamak shattered pellet injector cryogenic barrel extrusion temperature and mechanical punch speed telemetry for thermal quench mitigation",
        "slug": "tokamak-shattered-pellet-injector-cryogenic-barrel-extrusion-temperature-and-mechanical-punch-speed-telemetry-for-thermal-quench-mitigation",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Shattered Pellet Injection (SPI) Cryogenic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pellet Extrusion Telemetry Audit"
    },
    {
        "id": 1210,
        "keyword": "runaway electron synchrotron radiation forward-scattering infrared camera array telemetry for runaway avalanche detection",
        "slug": "runaway-electron-synchrotron-radiation-forward-scattering-infrared-camera-array-telemetry-for-runaway-avalanche-detection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Relativistic Plasma & Runaway Electron Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Runaway Synchrotron Telemetry Audit"
    },
    {
        "id": 1211,
        "keyword": "tokamak in-vessel saddle coil vertical displacement event VDE halo current Rogowski sensor telemetry for mechanical load suppression",
        "slug": "tokamak-in-vessel-saddle-coil-vertical-displacement-event-vde-halo-current-rogowski-sensor-telemetry-for-mechanical-load-suppression",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Tokamak Structural Dynamics & Halo Current Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Halo Current Telemetry Audit"
    },
    {
        "id": 1212,
        "keyword": "disruption mitigation cryogenic neon-hydrogen shattered pellet velocity light gate photodiode array telemetry for arrival timing",
        "slug": "disruption-mitigation-cryogenic-neon-hydrogen-shattered-pellet-velocity-light-gate-photodiode-array-telemetry-for-arrival-timing",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Pellet Timing & Plasma Injection Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pellet Velocity Telemetry Audit"
    },
    {
        "id": 1213,
        "keyword": "tokamak toroidal field coil current quench eddy-current force piezo-electric strain gauge rosette telemetry for structural protection",
        "slug": "tokamak-toroidal-field-coil-current-quench-eddy-current-force-piezo-electric-strain-gauge-rosette-telemetry-for-structural-protection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Magnet Protection & Structural Mechanics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Quench Strain Telemetry Audit"
    },
    {
        "id": 1214,
        "keyword": "runaway electron Cherenkov detector chemical vapor deposition diamond sensor radiation pulse telemetry for relativistic beam monitoring",
        "slug": "runaway-electron-cherenkov-detector-chemical-vapor-deposition-diamond-sensor-radiation-pulse-telemetry-for-relativistic-beam-monitoring",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Fast Particle & Radiation Detection Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cherenkov Beam Telemetry Audit"
    },
    {
        "id": 1215,
        "keyword": "tokamak resonant magnetic perturbation RMP coil power supply sub-millisecond current slew rate telemetry for runaway electron de-confinement",
        "slug": "tokamak-resonant-magnetic-perturbation-rmp-coil-power-supply-sub-millisecond-current-slew-rate-telemetry-for-runaway-electron-de-confinement",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "MHD Control & Pulsed Power Supply Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule RMP Slew Rate Telemetry Audit"
    },
    {
        "id": 1216,
        "keyword": "disruption mitigation cryogenic pellet sabot separation mechanical catcher optical beam deflection telemetry for vacuum vessel integrity",
        "slug": "disruption-mitigation-cryogenic-pellet-sabot-separation-mechanical-catcher-optical-beam-deflection-telemetry-for-vacuum-vessel-integrity",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Vacuum Vessel & Sabot Separation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Sabot Separation Telemetry Audit"
    },
    {
        "id": 1217,
        "keyword": "tokamak divertor tile scrape-off layer thermoelectric current shunt resistor telemetry for disruption-induced asymmetric current loops",
        "slug": "tokamak-divertor-tile-scrape-off-layer-thermoelectric-current-shunt-resistor-telemetry-for-disruption-induced-asymmetric-current-loops",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Divertor Diagnostics & Thermoelectric Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Divertor Current Telemetry Audit"
    },
    {
        "id": 1218,
        "keyword": "tokamak fast-framing soft X-ray tomographic pinhole camera array core thermal collapse telemetry for pre-disruption precursor detection",
        "slug": "tokamak-fast-framing-soft-x-ray-tomographic-pinhole-camera-array-core-thermal-collapse-telemetry-for-pre-disruption-precursor-detection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "X-Ray Tomography & Early Disruption Warning Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Soft X-Ray Tomography Audit"
    },
    {
        "id": 1219,
        "keyword": "massive gas injection piezo-electric valve seal helium micro-leak rate mass spectrometer telemetry for ultra-high vacuum reliability",
        "slug": "massive-gas-injection-piezo-electric-valve-seal-helium-micro-leak-rate-mass-spectrometer-telemetry-for-ultra-high-vacuum-reliability",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Ultra-High Vacuum & Fast Gas Valve Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Gas Valve Vacuum Seal Audit"
    },
    {
        "id": 1220,
        "keyword": "tokamak vacuum vessel passive runaway electron mitigation coil current induction pickup loop telemetry for passive magnetic braking",
        "slug": "tokamak-vacuum-vessel-passive-runaway-electron-mitigation-coil-current-induction-pickup-loop-telemetry-for-passive-magnetic-braking",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Passive Magnetic Mitigation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Passive Braking Coil Audit"
    },
    {
        "id": 1221,
        "keyword": "tokamak electron cyclotron emission ECE radiometer core temperature drop gradient telemetry for disruption unstart alerts",
        "slug": "tokamak-electron-cyclotron-emission-ece-radiometer-core-temperature-drop-gradient-telemetry-for-disruption-unstart-alerts",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "ECE Microwave Radiometry Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ECE Core Radiometry Audit"
    },
    {
        "id": 1222,
        "keyword": "runaway electron bremsstrahlung hard X-ray scintillation detector photomultiplier tube telemetry for beam energy spectrum analysis",
        "slug": "runaway-electron-bremsstrahlung-hard-x-ray-scintillation-detector-photomultiplier-tube-telemetry-for-beam-energy-spectrum-analysis",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Hard X-Ray & Gamma Spectrometry Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Bremsstrahlung Spectrometry Audit"
    },
    {
        "id": 1223,
        "keyword": "tokamak magnetic diagnostic Mirnov coil array mode-one locked mode amplitude and toroidal phase telemetry for disruption avoidance",
        "slug": "tokamak-magnetic-diagnostic-mirnov-coil-array-mode-one-locked-mode-amplitude-and-toroidal-phase-telemetry-for-disruption-avoidance",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Locked Mode & Magnetic Stability Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Locked Mode Diagnostic Audit"
    },
    {
        "id": 1224,
        "keyword": "tokamak cryogenic pellet freezer cell liquid helium temperature gradient telemetry for repeatable solid neon pellet formation",
        "slug": "tokamak-cryogenic-pellet-freezer-cell-liquid-helium-temperature-gradient-telemetry-for-repeatable-solid-neon-pellet-formation",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Cryogenic Fueling & Desublimation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Pellet Freezer Audit"
    },

    # Cluster 3: Subsea Fiber-Optic Acoustic Distributed Sensing (DAS) & Seismic Geophone Node Telemetry (IDs 1,225–1,240, 16 solutions)
    {
        "id": 1225,
        "keyword": "ocean bottom node OBN dual-sensor gimbaled four-component 4C geophone orientation resolver telemetry for deepwater seismic imaging",
        "slug": "ocean-bottom-node-obn-dual-sensor-gimbaled-four-component-4c-geophone-orientation-resolver-telemetry-for-deepwater-seismic-imaging",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Marine Geophysics & Ocean Bottom Seismic Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule OBN Geophone Telemetry Audit"
    },
    {
        "id": 1226,
        "keyword": "subsea fiber-optic distributed acoustic sensing DAS phase-OTDR optical pulse backscatter interferometry telemetry for micro-seismicity",
        "slug": "subsea-fiber-optic-distributed-acoustic-sensing-das-phase-otdr-optical-pulse-backscatter-interferometry-telemetry-for-micro-seismicity",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea DAS & Fiber-Optic Sensing Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Subsea DAS Telemetry Audit"
    },
    {
        "id": 1227,
        "keyword": "ocean bottom node titanium pressure vessel glass sphere vacuum seal optical fiber pen-test telemetry for 4000m depth deployment",
        "slug": "ocean-bottom-node-titanium-pressure-vessel-glass-sphere-vacuum-seal-optical-fiber-pen-test-telemetry-for-4000m-depth-deployment",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Ultra-Deepwater Enclosure & Pressure Housing Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pressure Housing Vacuum Seal Audit"
    },
    {
        "id": 1228,
        "keyword": "subsea seismic node lithium-ion rechargeable battery pack underwater inductive wet-mate charging telemetry for autonomous turnaround",
        "slug": "subsea-seismic-node-lithium-ion-rechargeable-battery-pack-underwater-inductive-wet-mate-charging-telemetry-for-autonomous-turnaround",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Power Systems & Wet-Mate Battery Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Wet-Mate Charging Telemetry Audit"
    },
    {
        "id": 1229,
        "keyword": "ocean bottom node acoustic transponder ultra-short baseline USBL positioning travel-time telemetry for seabed placement precision",
        "slug": "ocean-bottom-node-acoustic-transponder-ultra-short-baseline-usbl-positioning-travel-time-telemetry-for-seabed-placement-precision",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Subsea Navigation & USBL Positioning Geodesists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule USBL Acoustic Positioning Audit"
    },
    {
        "id": 1230,
        "keyword": "subsea fiber-optic cable acoustic strain gauge fiber Bragg grating FBG array telemetry for earthquake early warning detection",
        "slug": "subsea-fiber-optic-cable-acoustic-strain-gauge-fiber-bragg-grating-fbg-array-telemetry-for-earthquake-early-warning-detection",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Earthquake Early Warning & Seafloor Cable Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule FBG Seafloor Cable Audit"
    },
    {
        "id": 1231,
        "keyword": "ocean bottom seismometer OBS low-power 32-bit delta-sigma seismic digitizer clock drift atomic rubidium clock telemetry",
        "slug": "ocean-bottom-seismometer-obs-low-power-32-bit-delta-sigma-seismic-digitizer-clock-drift-atomic-rubidium-clock-telemetry",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "High-Precision Atomic Clock & Seismic Digitizer Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Atomic Clock Drift Audit"
    },
    {
        "id": 1232,
        "keyword": "subsea ocean bottom node seabed release mechanism burn-wire galvanic corrosion electrolytic current telemetry for buoyancy ascent",
        "slug": "subsea-ocean-bottom-node-seabed-release-mechanism-burn-wire-galvanic-corrosion-electrolytic-current-telemetry-for-buoyancy-ascent",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Oceanographic Recovery & Release Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Burn-Wire Release Telemetry Audit"
    },
    {
        "id": 1233,
        "keyword": "subsea DAS interrogator optical low-noise narrow-linewidth fiber laser frequency drift telemetry for seismic phase stability",
        "slug": "subsea-das-interrogator-optical-low-noise-narrow-linewidth-fiber-laser-frequency-drift-telemetry-for-seismic-phase-stability",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "DAS Interrogator Unit (IU) Hardware Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule DAS Laser Frequency Drift Audit"
    },
    {
        "id": 1234,
        "keyword": "ocean bottom node hydrophone piezo-ceramic sensor low-frequency acoustic noise floor telemetry for marine mammal and wave interference",
        "slug": "ocean-bottom-node-hydrophone-piezo-ceramic-sensor-low-frequency-acoustic-noise-floor-telemetry-for-marine-mammal-and-wave-interference",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Hydrophone Acoustics & Marine Environmental Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Hydrophone Noise Floor Audit"
    },
    {
        "id": 1235,
        "keyword": "subsea node automated robotic ROV deployment skid latching load cell torque telemetry for repeatable seabed planting",
        "slug": "subsea-node-automated-robotic-rov-deployment-skid-latching-load-cell-torque-telemetry-for-repeatable-seabed-planting",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "ROV Tooling & Seabed Node Deployment Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule ROV Node Planting Telemetry Audit"
    },
    {
        "id": 1236,
        "keyword": "ocean bottom seismic node high-speed optical download cradle gigabit transceiver telemetry for shipboard data extraction",
        "slug": "ocean-bottom-seismic-node-high-speed-optical-download-cradle-gigabit-transceiver-telemetry-for-shipboard-data-extraction",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Seismic Data Harvest & Shipboard Informatics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Optical Data Harvest Audit"
    },
    {
        "id": 1237,
        "keyword": "subsea fiber-optic distributed temperature sensing DTS Raman scattering anti-Stokes ratio telemetry for hydrothermal vent mapping",
        "slug": "subsea-fiber-optic-distributed-temperature-sensing-dts-raman-scattering-anti-stokes-ratio-telemetry-for-hydrothermal-vent-mapping",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Seafloor Geothermal & DTS Fiber-Optic Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Raman DTS Vent Telemetry Audit"
    },
    {
        "id": 1238,
        "keyword": "ocean bottom node internal tri-axial MEMS accelerometer tilt and vibration settling telemetry for geophone coupling verification",
        "slug": "ocean-bottom-node-internal-tri-axial-mems-accelerometer-tilt-and-vibration-settling-telemetry-for-geophone-coupling-verification",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Seabed Coupling & Sensor Settling Physicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Geophone Coupling Telemetry Audit"
    },
    {
        "id": 1239,
        "keyword": "subsea seismic cable armoring galvanized steel wire tensile load cell telemetry for rough seabed towline towing safety",
        "slug": "subsea-seismic-cable-armoring-galvanized-steel-wire-tensile-load-cell-telemetry-for-rough-seabed-towline-towing-safety",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Seismic Streamer Towing & Mechanical Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cable Armoring Tension Audit"
    },
    {
        "id": 1240,
        "keyword": "deepwater ocean bottom seismometer acoustic release pyrotechnic bolt squib fire circuit continuity telemetry for surfacing verification",
        "slug": "deepwater-ocean-bottom-seismometer-acoustic-release-pyrotechnic-bolt-squib-fire-circuit-continuity-telemetry-for-surfacing-verification",
        "category": "Solutions",
        "hub_category": "Marine Robotics & Subsea",
        "target_persona": "Deepwater Acoustic Release & Pyrotechnic Actuation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Pyrotechnic Release Circuit Audit"
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
    for kw in wave27_keywords:
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
