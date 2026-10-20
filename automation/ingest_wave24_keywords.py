#!/usr/bin/env python3
"""
ingest_wave24_keywords.py

Ingests Wave 24 BOFU Solution Keywords (IDs 1,041 to 1,090):
- Superconducting Quantum Processor Microwave Cryogenic Control & Flux Qubit Telemetry (17 solutions, IDs 1041-1057)
- Nuclear Fusion Tokamak Plasma Magnetic Confinement & Divertor Heat Flux Telemetry (17 solutions, IDs 1058-1074)
- Autonomous Hypersonic Scramjet Combustor Shockwave Boundary Layer Bleed Telemetry (16 solutions, IDs 1075-1090)

Scales total compact solutions queue from 1,040 to 1,090 solutions.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave24_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Superconducting Quantum Processor Microwave Cryogenic Telemetry (17 solutions, IDs 1041-1057)
    # -------------------------------------------------------------------------
    {
        "id": 1041,
        "keyword": "superconducting transmon qubit microwave drive pulse crosstalk cancellation telemetry for quantum processors",
        "slug": "superconducting-transmon-qubit-microwave-drive-pulse-crosstalk-cancellation-telemetry-for-quantum-processors",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Hardware Architects & Qubit Control Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Qubit Crosstalk Telemetry"
    },
    {
        "id": 1042,
        "keyword": "dilution refrigerator mixing chamber millikelvin temperature stability telemetry for superconducting quantum chips",
        "slug": "dilution-refrigerator-mixing-chamber-millikelvin-temperature-stability-telemetry-for-superconducting-quantum-chips",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Cryogenic Systems Leads & Dilution Fridge Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryogenic Stability Telemetry"
    },
    {
        "id": 1043,
        "keyword": "cryogenic traveling wave parametric amplifier twpa pump phase noise telemetry for fast qubit readout",
        "slug": "cryogenic-traveling-wave-parametric-amplifier-twpa-pump-phase-noise-telemetry-for-fast-qubit-readout",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum RF Engineers & Low-Noise Amplifier Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy TWPA Phase Noise Telemetry"
    },
    {
        "id": 1044,
        "keyword": "superconducting fluxonium qubit flux bias drift compensation telemetry for fault-tolerant quantum logic",
        "slug": "superconducting-fluxonium-qubit-flux-bias-drift-compensation-telemetry-for-fault-tolerant-quantum-logic",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Fluxonium Qubit Physicists & Precision Bias Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flux Bias Drift Telemetry"
    },
    {
        "id": 1045,
        "keyword": "cryogenic coaxial cable attenuation and thermal load calorimetry telemetry for multi-qubit dilution fridges",
        "slug": "cryogenic-coaxial-cable-attenuation-and-thermal-load-calorimetry-telemetry-for-multi-qubit-dilution-fridges",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Cryogenic Packaging Leads & Quantum Interconnect Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryo-Coax Calorimetry Telemetry"
    },
    {
        "id": 1046,
        "keyword": "josephson junction array dynamic resistance fluctuation telemetry for superconducting voltage standards",
        "slug": "josephson-junction-array-dynamic-resistance-fluctuation-telemetry-for-superconducting-voltage-standards",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Superconducting Metrologists & Junction Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Josephson Array Telemetry"
    },
    {
        "id": 1047,
        "keyword": "quantum processor dispersive readout resonator frequency shift telemetry for single-shot state classification",
        "slug": "quantum-processor-dispersive-readout-resonator-frequency-shift-telemetry-for-single-shot-state-classification",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Readout Engineers & Firmware Demodulation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dispersive Resonator Telemetry"
    },
    {
        "id": 1048,
        "keyword": "superconducting qubit dephasing time t2 echo decay telemetry for real-time decoherence mitigation",
        "slug": "superconducting-qubit-dephasing-time-t2-echo-decay-telemetry-for-real-time-decoherence-mitigation",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Coherence Physicists & Noise Spectral Density Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Qubit Decoherence Telemetry"
    },
    {
        "id": 1049,
        "keyword": "high-electron-mobility-transistor hemt cryogenic amplifier gain stability telemetry for quantum signal lines",
        "slug": "high-electron-mobility-transistor-hemt-cryogenic-amplifier-gain-stability-telemetry-for-quantum-signal-lines",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "HEMT Amplifier Engineers & 4K Cryogenic RF Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy HEMT Gain Stability Telemetry"
    },
    {
        "id": 1050,
        "keyword": "superconducting coplanar waveguide resonator quality factor degradation telemetry for quantum surface losses",
        "slug": "superconducting-coplanar-waveguide-resonator-quality-factor-degradation-telemetry-for-quantum-surface-losses",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "CPW Resonator Designers & Quantum Cleanroom Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy CPW Resonator Quality Telemetry"
    },
    {
        "id": 1051,
        "keyword": "cryogenic microwave circulator insertion loss and isolation degradation telemetry for quantum readout multiplexing",
        "slug": "cryogenic-microwave-circulator-insertion-loss-and-isolation-degradation-telemetry-for-quantum-readout-multiplexing",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Passive Microwave Device Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryo-Circulator Telemetry"
    },
    {
        "id": 1052,
        "keyword": "quantum error correction syndrome measurement parity check violation telemetry for surface code decoders",
        "slug": "quantum-error-correction-syndrome-measurement-parity-check-violation-telemetry-for-surface-code-decoders",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "QEC Architecture Leads & Fast Decoder Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy QEC Parity Telemetry"
    },
    {
        "id": 1053,
        "keyword": "superconducting magnetic shield residual magnetic field flux vortex penetration telemetry for qubit chips",
        "slug": "superconducting-magnetic-shield-residual-magnetic-field-flux-vortex-penetration-telemetry-for-qubit-chips",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Cryogenic Magnetic Shielding Specialists & Physics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnetic Shield Vortex Telemetry"
    },
    {
        "id": 1054,
        "keyword": "cryogenic arbitrary waveform generator awg skew and phase jitter telemetry for two-qubit gate synthesis",
        "slug": "cryogenic-arbitrary-waveform-generator-awg-skew-and-phase-jitter-telemetry-for-two-qubit-gate-synthesis",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "AWG Firmware Engineers & Quantum Pulse Calibration Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy AWG Phase Jitter Telemetry"
    },
    {
        "id": 1055,
        "keyword": "superconducting quantum processor wirebond inductance impedance mismatch telemetry for high-density multi-chip modules",
        "slug": "superconducting-quantum-processor-wirebond-inductance-impedance-mismatch-telemetry-for-high-density-multi-chip-modules",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Packaging Architects & Micro-Interconnect Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wirebond Inductance Telemetry"
    },
    {
        "id": 1056,
        "keyword": "cryogenic thermal strap contact thermal resistance degradation telemetry for sub-kelvin stage refrigeration",
        "slug": "cryogenic-thermal-strap-contact-thermal-resistance-degradation-telemetry-for-sub-kelvin-stage-refrigeration",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Thermal Packaging Engineers & Cryostat Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thermal Strap Telemetry"
    },
    {
        "id": 1057,
        "keyword": "superconducting qubit randomized benchmarking average gate fidelity drift telemetry for automated calibration engines",
        "slug": "superconducting-qubit-randomized-benchmarking-average-gate-fidelity-drift-telemetry-for-automated-calibration-engines",
        "category": "Solutions",
        "hub_category": "Quantum Computing & Cryogenic Systems",
        "target_persona": "Quantum Calibration Engineers & Gate Optimization Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gate Fidelity Drift Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Nuclear Fusion Tokamak Plasma Magnetic Confinement (17 solutions, IDs 1058-1074)
    # -------------------------------------------------------------------------
    {
        "id": 1058,
        "keyword": "tokamak plasma edge localized mode elm magnetic perturbation coil current telemetry for divertor protection",
        "slug": "tokamak-plasma-edge-localized-mode-elm-magnetic-perturbation-coil-current-telemetry-for-divertor-protection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Tokamak Magnetics Leads & Plasma Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ELM Coil Current Telemetry"
    },
    {
        "id": 1059,
        "keyword": "fusion reactor tungsten divertor surface infrared thermography heat flux peak telemetry for uncooled strike points",
        "slug": "fusion-reactor-tungsten-divertor-surface-infrared-thermography-heat-flux-peak-telemetry-for-uncooled-strike-points",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Divertor Materials Engineers & IR Thermography Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Divertor Heat Flux Telemetry"
    },
    {
        "id": 1060,
        "keyword": "tokamak poloidal field coil quench detection fiber-optic rayleigh backscatter strain telemetry for magnet safety",
        "slug": "tokamak-poloidal-field-coil-quench-detection-fiber-optic-rayleigh-backscatter-strain-telemetry-for-magnet-safety",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Superconducting Magnet Safety Engineers & Quench Detection Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnet Quench Telemetry"
    },
    {
        "id": 1061,
        "keyword": "fusion plasma neutral beam injection ion source grid optical emission spectroscopy telemetry for beam neutralisation",
        "slug": "fusion-plasma-neutral-beam-injection-ion-source-grid-optical-emission-spectroscopy-telemetry-for-beam-neutralisation",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Neutral Beam Injection Engineers & Plasma Diagnostics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy NBI Ion Grid Telemetry"
    },
    {
        "id": 1062,
        "keyword": "tokamak vacuum vessel runaway electron synchrotron radiation camera telemetry for disruption mitigation valve triggers",
        "slug": "tokamak-vacuum-vessel-runaway-electron-synchrotron-radiation-camera-telemetry-for-disruption-mitigation-valve-triggers",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Disruption Mitigation Leads & Fast Sensor Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Runaway Electron Telemetry"
    },
    {
        "id": 1063,
        "keyword": "plasma magnetic flux loop integrator baseline voltage drift telemetry for equilibrium shape reconstruction",
        "slug": "plasma-magnetic-flux-loop-integrator-baseline-voltage-drift-telemetry-for-equilibrium-shape-reconstruction",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Plasma Equilibrium Controls Leads & Analog Integrator Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Magnetic Flux Integrator Telemetry"
    },
    {
        "id": 1064,
        "keyword": "fusion reactor cryogenic pellet injection frozen deuterium mass velocity telemetry for plasma core fueling",
        "slug": "fusion-reactor-cryogenic-pellet-injection-frozen-deuterium-mass-velocity-telemetry-for-plasma-core-fueling",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Fueling Systems Leads & Cryogenic Pellet Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pellet Fueling Telemetry"
    },
    {
        "id": 1065,
        "keyword": "tokamak electron cyclotron resonance heating gyrotron collector thermal overload telemetry for continuous wave pulses",
        "slug": "tokamak-electron-cyclotron-resonance-heating-gyrotron-collector-thermal-overload-telemetry-for-continuous-wave-pulses",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "ECRH RF Engineers & High-Power Gyrotron Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gyrotron Collector Telemetry"
    },
    {
        "id": 1066,
        "keyword": "fusion plasma bolometer array radiated power profile asymmetry telemetry for impurity accumulation alerts",
        "slug": "fusion-plasma-bolometer-array-radiated-power-profile-asymmetry-telemetry-for-impurity-accumulation-alerts",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Bolometry Diagnostics Physicists & Plasma Impurity Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bolometer Array Telemetry"
    },
    {
        "id": 1067,
        "keyword": "tokamak rogowski coil plasma current dynamic measurement distortion telemetry for fast disruption forecasting",
        "slug": "tokamak-rogowski-coil-plasma-current-dynamic-measurement-distortion-telemetry-for-fast-disruption-forecasting",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Plasma Current Diagnostics Leads & Rogowski Coil Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Rogowski Coil Telemetry"
    },
    {
        "id": 1068,
        "keyword": "fusion neutron spectrometer liquid scintillator pulse shape discrimination telemetry for d-t fusion yield",
        "slug": "fusion-neutron-spectrometer-liquid-scintillator-pulse-shape-discrimination-telemetry-for-d-t-fusion-yield",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Neutron Metrology Physicists & Fusion Nuclear Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Neutron Spectrometer Telemetry"
    },
    {
        "id": 1069,
        "keyword": "tokamak toroidal field coil high-temperature superconductor tape critical current degradation telemetry for lifetime prediction",
        "slug": "tokamak-toroidal-field-coil-high-temperature-superconductor-tape-critical-current-degradation-telemetry-for-lifetime-prediction",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "HTS Magnet Engineers & Magnet Lifetime Metrology Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy HTS Tape Degradation Telemetry"
    },
    {
        "id": 1070,
        "keyword": "fusion reactor ceramic vacuum break dielectric gas leakage quadrupole mass spectrometer telemetry for cryostat integrity",
        "slug": "fusion-reactor-ceramic-vacuum-break-dielectric-gas-leakage-quadrupole-mass-spectrometer-telemetry-for-cryostat-integrity",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Cryostat Vacuum Engineers & Mass Spectrometry Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryostat Vacuum Break Telemetry"
    },
    {
        "id": 1071,
        "keyword": "tokamak plasma density interferometer co2-he-ne laser fringe shift phase noise telemetry for feedback gas injection",
        "slug": "tokamak-plasma-density-interferometer-co2-he-ne-laser-fringe-shift-phase-noise-telemetry-for-feedback-gas-injection",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Interferometer Optics Physicists & Gas Poffing Control Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Interferometer Fringe Telemetry"
    },
    {
        "id": 1072,
        "keyword": "fusion plasma x-ray crystal spectrometer doppler broadening ion temperature telemetry for core heating monitoring",
        "slug": "fusion-plasma-x-ray-crystal-spectrometer-doppler-broadening-ion-temperature-telemetry-for-core-heating-monitoring",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "X-ray Spectroscopy Leads & Ion Temperature Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy X-ray Spectrometer Telemetry"
    },
    {
        "id": 1073,
        "keyword": "tokamak langmuir probe array divertor target plasma electron density and temperature telemetry for sheath physics",
        "slug": "tokamak-langmuir-probe-array-divertor-target-plasma-electron-density-and-temperature-telemetry-for-sheath-physics",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "Plasma Sheath Physicists & Probe Array Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Langmuir Probe Telemetry"
    },
    {
        "id": 1074,
        "keyword": "fusion reactor beryllium first-wall tile optical surface erosion laser-induced breakdown spectroscopy telemetry for dust safety",
        "slug": "fusion-reactor-beryllium-first-wall-tile-optical-surface-erosion-laser-induced-breakdown-spectroscopy-telemetry-for-dust-safety",
        "category": "Solutions",
        "hub_category": "Nuclear Fusion & Plasma Diagnostics",
        "target_persona": "First Wall Materials Leads & In-Situ LIBS Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy First-Wall LIBS Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Autonomous Hypersonic Scramjet Combustor Telemetry (16 solutions, IDs 1075-1090)
    # -------------------------------------------------------------------------
    {
        "id": 1075,
        "keyword": "hypersonic scramjet isolator shock train location dynamic wall static pressure transducer array telemetry for unstart prevention",
        "slug": "hypersonic-scramjet-isolator-shock-train-location-dynamic-wall-static-pressure-transducer-array-telemetry-for-unstart-prevention",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Hypersonic Aerodynamics Leads & Isolator Control Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Isolator Shock Train Telemetry"
    },
    {
        "id": 1076,
        "keyword": "scramjet combustor cavity flameholder radical chemiluminescence emission photodiode array telemetry for blowout detection",
        "slug": "scramjet-combustor-cavity-flameholder-radical-chemiluminescence-emission-photodiode-array-telemetry-for-blowout-detection",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Combustion Diagnostics Leads & Scramjet Flameholder Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flameholder Chemiluminescence Telemetry"
    },
    {
        "id": 1077,
        "keyword": "hypersonic vehicle leading edge ultra-high temperature ceramic uhtc embedded thermocouple array ablation telemetry",
        "slug": "hypersonic-vehicle-leading-edge-ultra-high-temperature-ceramic-uhtc-embedded-thermocouple-array-ablation-telemetry",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Aerothermal TPS Leads & UHTC Materials Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Leading Edge UHTC Telemetry"
    },
    {
        "id": 1078,
        "keyword": "scramjet regenerative cooling channel supercritical hydrocarbon fuel coking ultrasonic acoustic attenuation telemetry",
        "slug": "scramjet-regenerative-cooling-channel-supercritical-hydrocarbon-fuel-coking-ultrasonic-acoustic-attenuation-telemetry",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Regenerative Cooling Engineers & Endothermic Fuel Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fuel Coking Ultrasonic Telemetry"
    },
    {
        "id": 1079,
        "keyword": "hypersonic inlet boundary layer bleed porous plate pressure drop differential transducer telemetry for distortion mitigation",
        "slug": "hypersonic-inlet-boundary-layer-bleed-porous-plate-pressure-drop-differential-transducer-telemetry-for-distortion-mitigation",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Inlet Aerodynamics Engineers & Bleed Flow Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inlet Bleed Differential Telemetry"
    },
    {
        "id": 1080,
        "keyword": "scramjet strut fuel injector multi-orifice cavitating liquid kerosene flow rate coriolis flowmeter telemetry for fuel distribution",
        "slug": "scramjet-strut-fuel-injector-multi-orifice-cavitating-liquid-kerosene-flow-rate-coriolis-flowmeter-telemetry-for-fuel-distribution",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Fuel Injection Leads & High-Pressure Fuel Flow Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fuel Injector Coriolis Telemetry"
    },
    {
        "id": 1081,
        "keyword": "hypersonic wind tunnel tunable diode laser absorption spectroscopy tdlas temperature telemetry for gas composition",
        "slug": "hypersonic-wind-tunnel-tunable-diode-laser-absorption-spectroscopy-tdlas-temperature-telemetry-for-gas-composition",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Laser Diagnostics Physicists & Hypersonic Ground Test Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy TDLAS Laser Spectroscopy Telemetry"
    },
    {
        "id": 1082,
        "keyword": "scramjet combustor wall piezoresistive high-frequency pressure sensor telemetry for acoustic combustion instability detection",
        "slug": "scramjet-combustor-wall-piezoresistive-high-frequency-pressure-sensor-telemetry-for-acoustic-combustion-instability-detection",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Combustion Acoustics Engineers & High-Frequency Sensor Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Combustion Acoustic Telemetry"
    },
    {
        "id": 1083,
        "keyword": "hypersonic airframe carbon-carbon composite wing skin thermal strain fiber bragg grating fbg telemetry for flutter monitoring",
        "slug": "hypersonic-airframe-carbon-carbon-composite-wing-skin-thermal-strain-fiber-bragg-grating-fbg-telemetry-for-flutter-monitoring",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "High-Temperature Aeroelasticity Leads & FBG Optical Strain Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wing Skin FBG Strain Telemetry"
    },
    {
        "id": 1084,
        "keyword": "scramjet nozzle variable geometry flap hydraulic actuator position linear variable differential transformer lvdt telemetry",
        "slug": "scramjet-nozzle-variable-geometry-flap-hydraulic-actuator-position-linear-variable-differential-transformer-lvdt-telemetry",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Nozzle Actuation Leads & Hypersonic Mechatronics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nozzle Flap LVDT Telemetry"
    },
    {
        "id": 1085,
        "keyword": "hypersonic vehicle plasma sheath radio frequency rf signal blackout microwave reflectometer attenuation telemetry for comms",
        "slug": "hypersonic-vehicle-plasma-sheath-radio-frequency-rf-signal-blackout-microwave-reflectometer-attenuation-telemetry-for-comms",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Plasma RF Communications Leads & Microwave Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Plasma RF Attenuation Telemetry"
    },
    {
        "id": 1086,
        "keyword": "scramjet fuel turbopump hydrostatic bearing oil film pressure sensor telemetry for high-speed cavitation monitoring",
        "slug": "scramjet-fuel-turbopump-hydrostatic-bearing-oil-film-pressure-sensor-telemetry-for-high-speed-cavitation-monitoring",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Turbomachinery Engineers & Fuel Pump Dynamics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Turbopump Bearing Telemetry"
    },
    {
        "id": 1087,
        "keyword": "hypersonic boundary layer transition second-mode acoustic wave focused laser differential interferometer fldi telemetry",
        "slug": "hypersonic-boundary-layer-transition-second-mode-acoustic-wave-focused-laser-differential-interferometer-fldi-telemetry",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Boundary Layer Stability Physicists & FLDI Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy FLDI Boundary Layer Telemetry"
    },
    {
        "id": 1088,
        "keyword": "scramjet torch igniter spark plug plasma discharge voltage and current waveform telemetry for high-altitude relight",
        "slug": "scramjet-torch-igniter-spark-plug-plasma-discharge-voltage-and-current-waveform-telemetry-for-high-altitude-relight",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Ignition Systems Engineers & Plasma Torch Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Torch Igniter Telemetry"
    },
    {
        "id": 1089,
        "keyword": "hypersonic aerospike nose cone surface heat flux heat sink slug calorimeter telemetry for peak deceleration heating",
        "slug": "hypersonic-aerospike-nose-cone-surface-heat-flux-heat-sink-slug-calorimeter-telemetry-for-peak-deceleration-heating",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Nose Cone Aerothermal Leads & Calorimeter Instrumentation Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Aerospike Calorimeter Telemetry"
    },
    {
        "id": 1090,
        "keyword": "scramjet air-data system fluidic flush air data sensing fads multi-port matrix pressure transducer telemetry",
        "slug": "scramjet-air-data-system-fluidic-flush-air-data-sensing-fads-multi-port-matrix-pressure-transducer-telemetry",
        "category": "Solutions",
        "hub_category": "Hypersonics & Aerothermal Propulsion",
        "target_persona": "Air Data System Leads & Flush Sensing Metrologists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy FADS Air-Data Telemetry"
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
    for kw in wave24_keywords:
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

    print(f"Successfully ingested {added_count} Wave 24 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
