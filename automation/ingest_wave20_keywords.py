#!/usr/bin/env python3
"""
ingest_wave20_keywords.py

Ingests Wave 20 BOFU Solution Keywords (IDs 841 to 890):
- Fusion Tokamak Divertor Tungsten Monoblock Heat Flux Telemetry (17 solutions, IDs 841-857)
- Biopharmaceutical Continuous Perfusion Bioreactor Hollow Fiber Bleed Telemetry (17 solutions, IDs 858-874)
- Spacecraft Hypervelocity Micrometeoroid Shield Piezoelectric Impact Telemetry (16 solutions, IDs 875-890)

Scales total compact solutions queue from 840 to 890.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave20_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Fusion Tokamak Divertor Tungsten Monoblock Heat Flux Telemetry (17 solutions, IDs 841-857)
    # -------------------------------------------------------------------------
    {
        "id": 841,
        "keyword": "fusion tokamak divertor tungsten monoblock infrared thermography heat flux telemetry for PFC engineers",
        "slug": "fusion-tokamak-divertor-tungsten-monoblock-infrared-thermography-heat-flux-telemetry-for-pfc-engineers",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "PFC Systems Engineers & Divertor Diagnostic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Divertor Heat Flux Telemetry"
    },
    {
        "id": 842,
        "keyword": "ITER tungsten monoblock CuCrZr cooling pipe sub-cooled water critical heat flux telemetry for fusion reactors",
        "slug": "iter-tungsten-monoblock-cucrzr-cooling-pipe-sub-cooled-water-critical-heat-flux-telemetry-for-fusion-reactors",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Cryogenic Cooling Leads & Tokamak Thermal Hydraulics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Critical Heat Flux Telemetry"
    },
    {
        "id": 843,
        "keyword": "divertor leading edge optical fiber pyrometry transient plasma strike telemetry for magnetic confinement",
        "slug": "divertor-leading-edge-optical-fiber-pyrometry-transient-plasma-strike-telemetry-for-magnetic-confinement",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Plasma Confinement Physicists & Optical Diagnostics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fiber Pyrometry Telemetry"
    },
    {
        "id": 844,
        "keyword": "tokamak divertor strike point sweeping Langmuir probe array electron density telemetry for ELM suppression",
        "slug": "tokamak-divertor-strike-point-sweeping-langmuir-probe-array-electron-density-telemetry-for-elm-suppression",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Langmuir Probe Specialists & Tokamak Operation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Strike Point Sweeping Telemetry"
    },
    {
        "id": 845,
        "keyword": "divertor gas puff imaging radiative detachment nitrogen impurity seeding telemetry for steady-state plasmas",
        "slug": "divertor-gas-puff-imaging-radiative-detachment-nitrogen-impurity-seeding-telemetry-for-steady-state-plasmas",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Gas Injection System Engineers & Plasma Detachment Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Radiative Detachment Telemetry"
    },
    {
        "id": 846,
        "keyword": "tungsten monoblock thermal fatigue recrystallization ultrasonic surface wave telemetry for fusion vessels",
        "slug": "tungsten-monoblock-thermal-fatigue-recrystallization-ultrasonic-surface-wave-telemetry-for-fusion-vessels",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Tungsten Metallurgy Specialists & Non-Destructive Testing Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ultrasonic Fatigue Telemetry"
    },
    {
        "id": 847,
        "keyword": "divertor cassette water coolant outlet thermocouple calorimetric energy balance telemetry for fusion plants",
        "slug": "divertor-cassette-water-coolant-outlet-thermocouple-calorimetric-energy-balance-telemetry-for-fusion-plants",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Tokamak Calorimetry Engineers & Divertor Maintenance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Calorimetric Balance Telemetry"
    },
    {
        "id": 848,
        "keyword": "plasma facing component tungsten armor eddy current electromagnetic disruption load telemetry for tokamaks",
        "slug": "plasma-facing-component-tungsten-armor-eddy-current-electromagnetic-disruption-load-telemetry-for-tokamaks",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Electromagnetic Structural Engineers & Disruption Mitigation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Disruption Load Telemetry"
    },
    {
        "id": 849,
        "keyword": "divertor cryopump helium pumping speed liquid nitrogen thermal shield telemetry for D-T burn chambers",
        "slug": "divertor-cryopump-helium-pumping-speed-liquid-nitrogen-thermal-shield-telemetry-for-d-t-burn-chambers",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Vacuum Cryopump Engineers & Tritium Fuel Cycle Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cryopump Pumping Telemetry"
    },
    {
        "id": 850,
        "keyword": "fusion tokamak divertor tile optical emission spectroscopy tungsten gross erosion telemetry for PFC lifetime",
        "slug": "fusion-tokamak-divertor-tile-optical-emission-spectroscopy-tungsten-gross-erosion-telemetry-for-pfc-lifetime",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Spectroscopy Diagnostics Specialists & Erosion Monitoring Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gross Erosion Telemetry"
    },
    {
        "id": 851,
        "keyword": "tokamak divertor scrape-off layer Thomson scattering electron temperature profile telemetry for burning plasmas",
        "slug": "tokamak-divertor-scrape-off-layer-thomson-scattering-electron-temperature-profile-telemetry-for-burning-plasmas",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Thomson Scattering Physicists & SOL Plasma Modelers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thomson Scattering Telemetry"
    },
    {
        "id": 852,
        "keyword": "tungsten monoblock castellated gap halo current shunt voltage sensor telemetry for fusion divertor plates",
        "slug": "tungsten-monoblock-castellated-gap-halo-current-shunt-voltage-sensor-telemetry-for-fusion-divertor-plates",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Halo Current Sensor Engineers & Magnetohydrodynamic Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Halo Current Telemetry"
    },
    {
        "id": 853,
        "keyword": "divertor vacuum vessel bolted joint strain gauge mechanical thermal expansion telemetry for TBM modules",
        "slug": "divertor-vacuum-vessel-bolted-joint-strain-gauge-mechanical-thermal-expansion-telemetry-for-tbm-modules",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Vacuum Vessel Structural Engineers & TBM Integration Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vessel Expansion Telemetry"
    },
    {
        "id": 854,
        "keyword": "fusion divertor boronization thin film glow discharge uniformity quartz microbalance telemetry for wall conditioning",
        "slug": "fusion-divertor-boronization-thin-film-glow-discharge-uniformity-quartz-microbalance-telemetry-for-wall-conditioning",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "First Wall Conditioning Specialists & Plasma Physics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Boronization Telemetry"
    },
    {
        "id": 855,
        "keyword": "tokamak divertor runaway electron impact bremsstrahlung hard X-ray scintillation telemetry for PFC protection",
        "slug": "tokamak-divertor-runaway-electron-impact-bremsstrahlung-hard-x-ray-scintillation-telemetry-for-pfc-protection",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Runaway Electron Mitigation Physicists & Radiation Safety Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Scintillation Telemetry"
    },
    {
        "id": 856,
        "keyword": "tungsten monoblock hot helium coolant loop differential pressure loss friction telemetry for DEMO divertors",
        "slug": "tungsten-monoblock-hot-helium-coolant-loop-differential-pressure-loss-friction-telemetry-for-demo-divertors",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Helium Coolant Loop Engineers & DEMO Reactor Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Helium Friction Telemetry"
    },
    {
        "id": 857,
        "keyword": "fusion divertor plasma sheath potential emissive probe floating voltage fluctuation telemetry for boundary control",
        "slug": "fusion-divertor-plasma-sheath-potential-emissive-probe-floating-voltage-fluctuation-telemetry-for-boundary-control",
        "category": "Solutions",
        "hub_category": "Fusion Energy & Plasma Diagnostics",
        "target_persona": "Plasma Boundary Control Engineers & Sheath Diagnostic Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sheath Potential Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Biopharmaceutical Continuous Perfusion Bioreactor Bleed Telemetry (17 solutions, IDs 858-874)
    # -------------------------------------------------------------------------
    {
        "id": 858,
        "keyword": "continuous perfusion bioreactor hollow fiber alternating tangential flow transmembrane pressure telemetry for ATMP",
        "slug": "continuous-perfusion-bioreactor-hollow-fiber-alternating-tangential-flow-transmembrane-pressure-telemetry-for-atmp",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Perfusion Bioprocess Engineers & ATMP Manufacturing Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Perfusion Transmembrane Telemetry"
    },
    {
        "id": 859,
        "keyword": "perfusion bioreactor automated cell bleed rate viable cell density dielectric spectroscopy telemetry for mAbs",
        "slug": "perfusion-bioreactor-automated-cell-bleed-rate-viable-cell-density-dielectric-spectroscopy-telemetry-for-mabs",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Process Analytical Technology Leads & Bioreactor Automation Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cell Bleed Telemetry"
    },
    {
        "id": 860,
        "keyword": "hollow fiber filter fouling acoustic backflush frequency permeate flux decline telemetry for continuous culture",
        "slug": "hollow-fiber-filter-fouling-acoustic-backflush-frequency-permeate-flux-decline-telemetry-for-continuous-culture",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Filtration Systems Engineers & Upstream Bioprocess Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Filter Fouling Telemetry"
    },
    {
        "id": 861,
        "keyword": "perfusion bioreactor dissolved oxygen micro-sparger kLa mass transfer off-gas mass spectrometer telemetry for CHO",
        "slug": "perfusion-bioreactor-dissolved-oxygen-micro-sparger-kla-mass-transfer-off-gas-mass-spectrometer-telemetry-for-cho",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Biochemical Process Modelers & Upstream Fermentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mass Transfer Telemetry"
    },
    {
        "id": 862,
        "keyword": "continuous cell culture lactate dehydrogenase release cell lysis shear stress sensor telemetry for perfusion ATF",
        "slug": "continuous-cell-culture-lactate-dehydrogenase-release-cell-lysis-shear-stress-sensor-telemetry-for-perfusion-atf",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Cell Culture Quality Leads & Shear Sensitivity Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Cell Lysis Telemetry"
    },
    {
        "id": 863,
        "keyword": "bioreactor glucose and glutamine enzymatic biosensor continuous feed metering loop telemetry for high-density runs",
        "slug": "bioreactor-glucose-and-glutamine-enzymatic-biosensor-continuous-feed-metering-loop-telemetry-for-high-density-runs",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Nutrient Feed Automation Engineers & PAT Scientists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Nutrient Feed Telemetry"
    },
    {
        "id": 864,
        "keyword": "perfusion culture inline Raman spectroscopy monoclonal antibody glycosylation critical quality attribute telemetry",
        "slug": "perfusion-culture-inline-raman-spectroscopy-monoclonal-antibody-glycosylation-critical-quality-attribute-telemetry",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Raman Spectroscopy Specialists & Bio-Therapeutic Quality Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Raman Glycosylation Telemetry"
    },
    {
        "id": 865,
        "keyword": "continuous perfusion bioreactor peristaltic pump tubing spallation laser micrometer telemetry for single-use loops",
        "slug": "continuous-perfusion-bioreactor-peristaltic-pump-tubing-spallation-laser-micrometer-telemetry-for-single-use-loops",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Single-Use Systems Engineers & Bioprocess Maintenance Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tubing Spallation Telemetry"
    },
    {
        "id": 866,
        "keyword": "perfusion bioreactor carbon dioxide stripping aeration rate pH drift dual optical sensor telemetry for cGMP suites",
        "slug": "perfusion-bioreactor-carbon-dioxide-stripping-aeration-rate-ph-drift-dual-optical-sensor-telemetry-for-cgmp-suites",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Bioreactor Validation Specialists & cGMP Compliance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Aeration Stripping Telemetry"
    },
    {
        "id": 867,
        "keyword": "continuous bioprocess acoustic wave cell retention chamber ultrasonic standing wave power telemetry for perfusion",
        "slug": "continuous-bioprocess-acoustic-wave-cell-retention-chamber-ultrasonic-standing-wave-power-telemetry-for-perfusion",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Acoustic Wave Clarification Engineers & Bioprocess Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Acoustic Retention Telemetry"
    },
    {
        "id": 868,
        "keyword": "hollow fiber module lumen pressure differential bioburden filtration integrity pressure hold telemetry for vaccines",
        "slug": "hollow-fiber-module-lumen-pressure-differential-bioburden-filtration-integrity-pressure-hold-telemetry-for-vaccines",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Sterility Assurance Leads & Viral Vector Production Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pressure Hold Telemetry"
    },
    {
        "id": 869,
        "keyword": "perfusion bioreactor antifoam addition rate bubble capacitance probe foaming level telemetry for aero-fermenters",
        "slug": "perfusion-bioreactor-antifoam-addition-rate-bubble-capacitance-probe-foaming-level-telemetry-for-aero-fermenters",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Fermentation Control Engineers & Cleanroom Facility Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Antifoam Probe Telemetry"
    },
    {
        "id": 870,
        "keyword": "continuous viral inactivation low pH hold plug-flow tubular reactor residence time telemetry for downstream mAb",
        "slug": "continuous-viral-inactivation-low-ph-hold-plug-flow-tubular-reactor-residence-time-telemetry-for-downstream-mab",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Downstream Purification Leads & Viral Clearance Scientists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Residence Time Telemetry"
    },
    {
        "id": 871,
        "keyword": "perfusion permeate line UV280 absorption inline protein concentration titer yield telemetry for chromatography",
        "slug": "perfusion-permeate-line-uv280-absorption-inline-protein-concentration-titer-yield-telemetry-for-chromatography",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Chromatography Process Leads & Continuous Downstream Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Inline UV280 Telemetry"
    },
    {
        "id": 872,
        "keyword": "continuous bioreactor media perfusion gravimetric load cell balance tare replenishment rate telemetry for PAT",
        "slug": "continuous-bioreactor-media-perfusion-gravimetric-load-cell-balance-tare-replenishment-rate-telemetry-for-pat",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Gravimetric Dosing Engineers & Upstream Automation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gravimetric Perfusion Telemetry"
    },
    {
        "id": 873,
        "keyword": "perfusion cell harvest centrifugal separator bowl vibration and sludge discharge timing telemetry for scale-up",
        "slug": "perfusion-cell-harvest-centrifugal-separator-bowl-vibration-and-sludge-discharge-timing-telemetry-for-scale-up",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Centrifuge Operations Specialists & Bioprocess Scale-up Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Centrifuge Vibration Telemetry"
    },
    {
        "id": 874,
        "keyword": "continuous bioprocess single-use bag integrity nitrogen pressure decay automated pinhole leak telemetry for suites",
        "slug": "continuous-bioprocess-single-use-bag-integrity-nitrogen-pressure-decay-automated-pinhole-leak-telemetry-for-suites",
        "category": "Solutions",
        "hub_category": "Biopharmaceutical Manufacturing & PAT",
        "target_persona": "Single-Use Bag Validation Leads & Sterile Production Heads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Pinhole Leak Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Spacecraft Hypervelocity Micrometeoroid Shield Piezoelectric Impact Telemetry (16 solutions, IDs 875-890)
    # -------------------------------------------------------------------------
    {
        "id": 875,
        "keyword": "spacecraft Whipple shield hypervelocity micrometeoroid PZT piezoelectric impact acoustic emission telemetry for MMOD",
        "slug": "spacecraft-whipple-shield-hypervelocity-micrometeoroid-pzt-piezoelectric-impact-acoustic-emission-telemetry-for-mmod",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Spacecraft MMOD Protection Leads & Orbital Debris Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy MMOD Piezoelectric Telemetry"
    },
    {
        "id": 876,
        "keyword": "orbital debris bumper plate hypervelocity fragmentation cloud time-of-flight sensor telemetry for satellite hulls",
        "slug": "orbital-debris-bumper-plate-hypervelocity-fragmentation-cloud-time-of-flight-sensor-telemetry-for-satellite-hulls",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Hypervelocity Impact Physicists & Satellite Hull Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fragmentation Cloud Telemetry"
    },
    {
        "id": 877,
        "keyword": "Stuffed Whipple shield Nextel-Kevlar intermediate fabric perforation fiber optic FBG strain telemetry for habitats",
        "slug": "stuffed-whipple-shield-nextel-kevlar-intermediate-fabric-perforation-fiber-optic-fbg-strain-telemetry-for-habitats",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Crew Habitat Structural Leads & Advanced Shielding Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Intermediate Fabric Telemetry"
    },
    {
        "id": 878,
        "keyword": "satellite pressure vessel hypervelocity impact catastrophic rupture risk acoustic wave triangulation telemetry",
        "slug": "satellite-pressure-vessel-hypervelocity-impact-catastrophic-rupture-risk-acoustic-wave-triangulation-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Spacecraft Propulsion Engineers & Pressure Vessel Safety Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Rupture Triangulation Telemetry"
    },
    {
        "id": 879,
        "keyword": "spacecraft rear wall cratering plasma discharge ionization sensor charge collection telemetry for orbital shields",
        "slug": "spacecraft-rear-wall-cratering-plasma-discharge-ionization-sensor-charge-collection-telemetry-for-orbital-shields",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Plasma Impact Physicists & Spacecraft Shield Instrumentation Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Charge Collection Telemetry"
    },
    {
        "id": 880,
        "keyword": "LEO satellite solar array hypervelocity micrometeoroid short-circuit arc flash photodiode telemetry for power buses",
        "slug": "leo-satellite-solar-array-hypervelocity-micrometeoroid-short-circuit-arc-flash-photodiode-telemetry-for-power-buses",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Satellite Power Systems Leads & Solar Array Reliability Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Arc Flash Telemetry"
    },
    {
        "id": 881,
        "keyword": "aerogel micrometeoroid particle capture track laser scanner volumetric penetration telemetry for sample return",
        "slug": "aerogel-micrometeoroid-particle-capture-track-laser-scanner-volumetric-penetration-telemetry-for-sample-return",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Aerogel Instrumentation Specialists & Deep Space Mission Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Aerogel Capture Telemetry"
    },
    {
        "id": 882,
        "keyword": "spacecraft radiator ammonia loop hypervelocity micrometeoroid puncture ultrasonic leak telemetry for thermal control",
        "slug": "spacecraft-radiator-ammonia-loop-hypervelocity-micrometeoroid-puncture-ultrasonic-leak-telemetry-for-thermal-control",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Thermal Control Systems Directors & Active Radiator Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Ammonia Leak Telemetry"
    },
    {
        "id": 883,
        "keyword": "multi-layer insulation hypervelocity debris flash thermal radiative dissipation bolometer telemetry for satellites",
        "slug": "multi-layer-insulation-hypervelocity-debris-flash-thermal-radiative-dissipation-bolometer-telemetry-for-satellites",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Thermal Blanket Leads & Satellite Survivability Analysts",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bolometer Flash Telemetry"
    },
    {
        "id": 884,
        "keyword": "spacecraft propellant tank composite overwrapped pressure vessel MMOD shockwave accelerometer telemetry for orbit",
        "slug": "spacecraft-propellant-tank-composite-overwrapped-pressure-vessel-mmod-shockwave-accelerometer-telemetry-for-orbit",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "COPV Structural Engineers & Flight Dynamicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Shockwave Accelerometer Telemetry"
    },
    {
        "id": 885,
        "keyword": "orbital space station cupola viewport multi-pane fused silica hypervelocity spall laser interferometer telemetry",
        "slug": "orbital-space-station-cupola-viewport-multi-pane-fused-silica-hypervelocity-spall-laser-interferometer-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Optical Window Engineers & Space Station Habitation Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Viewport Spall Telemetry"
    },
    {
        "id": 886,
        "keyword": "inflatable spacecraft habitat Kevlar restraint layer hypervelocity micrometeoroid penetration resistive wire mesh telemetry",
        "slug": "inflatable-spacecraft-habitat-kevlar-restraint-layer-hypervelocity-micrometeoroid-penetration-resistive-wire-mesh-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Inflatable Habitat Leads & Structural Health Monitoring Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wire Mesh Telemetry"
    },
    {
        "id": 887,
        "keyword": "spacecraft reaction wheel housing hypervelocity secondary ejecta bearing vibration telemetry for ADCS stability",
        "slug": "spacecraft-reaction-wheel-housing-hypervelocity-secondary-ejecta-bearing-vibration-telemetry-for-adcs-stability",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "ADCS Engineers & Mechanism Reliability Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bearing Vibration Telemetry"
    },
    {
        "id": 888,
        "keyword": "spacecraft star tracker optical baffle hypervelocity particle pitting stray light scatter telemetry for attitude",
        "slug": "spacecraft-star-tracker-optical-baffle-hypervelocity-particle-pitting-stray-light-scatter-telemetry-for-attitude",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Star Tracker Payload Leads & Electro-Optical Sensor Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stray Light Telemetry"
    },
    {
        "id": 889,
        "keyword": "orbital docking ring metallic seal hypervelocity fragment cut differential gas pressure decay telemetry for crew",
        "slug": "orbital-docking-ring-metallic-seal-hypervelocity-fragment-cut-differential-gas-pressure-decay-telemetry-for-crew",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Docking Mechanism Leads & Life Support Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Docking Seal Telemetry"
    },
    {
        "id": 890,
        "keyword": "spacecraft deployable boom composite truss hypervelocity impact resonant frequency shift telemetry for deep space",
        "slug": "spacecraft-deployable-boom-composite-truss-hypervelocity-impact-resonant-frequency-shift-telemetry-for-deep-space",
        "category": "Solutions",
        "hub_category": "Aerospace Structures & Spacecraft Survivability",
        "target_persona": "Deployable Structures Leads & Spacecraft Dynamics Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Resonant Frequency Telemetry"
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
    for kw in wave20_keywords:
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

    print(f"Successfully ingested {added_count} Wave 20 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
