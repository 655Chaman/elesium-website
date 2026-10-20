#!/usr/bin/env python3
"""
ingest_wave17_keywords.py

Ingests Wave 17 BOFU Solution Keywords (IDs 691 to 740):
- Direct Air Carbon Capture (DAC) Solid Sorbent Vacuum Temperature Swing Desorption Telemetry (17 solutions, IDs 691-707)
- Hypersonic Aerothermal Thermal Protection System (TPS) Tile Micro-Crack Acoustic Emission Telemetry (17 solutions, IDs 708-724)
- Subsea Deepwater Wellhead Blowout Preventer (BOP) Hydraulic Acoustic Telemetry (16 solutions, IDs 725-740)

Scales total compact solutions queue from 690 to 740.
"""

import json
from pathlib import Path

BASE_DIR = Path(__file__).parent
QUEUE_PATH = BASE_DIR / "compact_keywords_queue.json"

wave17_keywords = [
    # -------------------------------------------------------------------------
    # Cluster 1: Direct Air Carbon Capture (DAC) Solid Sorbent VTSA (17 solutions, IDs 691-707)
    # -------------------------------------------------------------------------
    {
        "id": 691,
        "keyword": "amine-functionalized solid sorbent bed CO2 desorption temperature telemetry for DAC",
        "slug": "amine-functionalized-solid-sorbent-bed-co2-desorption-temperature-telemetry-for-dac",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Carbon Capture Operations Directors & DAC Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sorbent Desorption Telemetry"
    },
    {
        "id": 692,
        "keyword": "vacuum temperature swing adsorption chamber steam purge pressure controllers for DAC",
        "slug": "vacuum-temperature-swing-adsorption-chamber-steam-purge-pressure-controllers-for-dac",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "VTSA Process Engineers & Direct Air Scrubbing Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy VTSA Pressure Controllers"
    },
    {
        "id": 693,
        "keyword": "contactor fan array volumetric air flow rate energy optimization agents for carbon capture",
        "slug": "contactor-fan-array-volumetric-air-flow-rate-energy-optimization-agents-for-carbon-capture",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "DAC Facility Energy Directors & Plant Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fan Array Optimization Agents"
    },
    {
        "id": 694,
        "keyword": "ambient air relative humidity sorbent water co-adsorption telemetry for direct air capture",
        "slug": "ambient-air-relative-humidity-sorbent-water-co-adsorption-telemetry-for-direct-air-capture",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Adsorption Chemistry Leads & Climate Tech Process Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Water Co-Adsorption Telemetry"
    },
    {
        "id": 695,
        "keyword": "solid sorbent amine degradation urea formation spectroscopic telemetry for DAC plants",
        "slug": "solid-sorbent-amine-degradation-urea-formation-spectroscopic-telemetry-for-dac-plants",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Chemical Degradation Analysts & Sorbent Material Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sorbent Spectroscopy Telemetry"
    },
    {
        "id": 696,
        "keyword": "desorbed CO2 gas purity infrared gas analyzer moisture separation controllers for DAC",
        "slug": "desorbed-co2-gas-purity-infrared-gas-analyzer-moisture-separation-controllers-for-dac",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Gas Purification Leads & Sequestration Quality Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy CO2 Gas Purity Controllers"
    },
    {
        "id": 697,
        "keyword": "plate-fin heat exchanger thermal recovery sensible heat transfer monitors for DAC systems",
        "slug": "plate-fin-heat-exchanger-thermal-recovery-sensible-heat-transfer-monitors-for-dac-systems",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Thermal Integration Engineers & DAC Process Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Thermal Heat Exchanger Monitors"
    },
    {
        "id": 698,
        "keyword": "regeneration chamber motorized vacuum isolation butterfly valve seal leak telemetry for DAC",
        "slug": "regeneration-chamber-motorized-vacuum-isolation-butterfly-valve-seal-leak-telemetry-for-dac",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Vacuum Systems Engineers & DAC Maintenance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Vacuum Seal Leak Telemetry"
    },
    {
        "id": 699,
        "keyword": "pelletized silica gel support structure compressive crushing stress monitors for contactors",
        "slug": "pelletized-silica-gel-support-structure-compressive-crushing-stress-monitors-for-contactors",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Mechanical Integrity Engineers & Contactor Bed Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sorbent Stress Monitors"
    },
    {
        "id": 700,
        "keyword": "monolith contactor aerodynamic pressure drop convective bypass controllers for DAC modules",
        "slug": "monolith-contactor-aerodynamic-pressure-drop-convective-bypass-controllers-for-dac-modules",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Fluid Dynamics Engineers & DAC Contactor Designers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Convective Bypass Controllers"
    },
    {
        "id": 701,
        "keyword": "solar thermal parabolic trough molten salt heat transfer telemetry for DAC facilities",
        "slug": "solar-thermal-parabolic-trough-molten-salt-heat-transfer-telemetry-for-dac-facilities",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Solar Thermal Integration Leads & Clean Heat Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Molten Salt Heat Telemetry"
    },
    {
        "id": 702,
        "keyword": "potassium hydroxide liquid-solid contactor carbonate precipitation monitors for carbon scrubbers",
        "slug": "potassium-hydroxide-liquid-solid-contactor-carbonate-precipitation-monitors-for-carbon-scrubbers",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Liquid DAC Chemical Engineers & Precipitation Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Carbonate Precipitation Monitors"
    },
    {
        "id": 703,
        "keyword": "sorbent thermal cycle oxidative degradation rate mass spectrometry telemetry for DAC arrays",
        "slug": "sorbent-thermal-cycle-oxidative-degradation-rate-mass-spectrometry-telemetry-for-dac-arrays",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Analytical Chemists & DAC Lifetime Optimization Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Mass Spectrometry Telemetry"
    },
    {
        "id": 704,
        "keyword": "CO2 compressor interstage condensation knock-out drum level controllers for DAC storage",
        "slug": "co2-compressor-interstage-condensation-knock-out-drum-level-controllers-for-dac-storage",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Gas Compression Leads & Sequestration Pipeline Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Compressor Knock-Out Controllers"
    },
    {
        "id": 705,
        "keyword": "desorption steam boiler electrical resistive heater thermal cycling telemetry for carbon capture",
        "slug": "desorption-steam-boiler-electrical-resistive-heater-thermal-cycling-telemetry-for-carbon-capture",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Electrification Leads & Steam Boiler Operations Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Electric Boiler Telemetry"
    },
    {
        "id": 706,
        "keyword": "high-velocity air inlet louvre particulate filter dust loading pressure telemetry for DAC",
        "slug": "high-velocity-air-inlet-louvre-particulate-filter-dust-loading-pressure-telemetry-for-dac",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Filtration Engineers & Facility Maintenance Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Dust Filter Pressure Telemetry"
    },
    {
        "id": 707,
        "keyword": "geological sequestration CO2 liquefaction supercritical phase boundary monitors for carbon hubs",
        "slug": "geological-sequestration-co2-liquefaction-supercritical-phase-boundary-monitors-for-carbon-hubs",
        "category": "Solutions",
        "hub_category": "Decarbonization & Clean Tech",
        "target_persona": "Geological Storage Directors & Supercritical CO2 Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Supercritical CO2 Monitors"
    },

    # -------------------------------------------------------------------------
    # Cluster 2: Hypersonic TPS Tile Micro-Crack Acoustic Emission (17 solutions, IDs 708-724)
    # -------------------------------------------------------------------------
    {
        "id": 708,
        "keyword": "reinforced carbon-carbon leading edge oxidation barrier spallation telemetry for hypersonics",
        "slug": "reinforced-carbon-carbon-leading-edge-oxidation-barrier-spallation-telemetry-for-hypersonics",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "RCC Materials Specialists & Hypersonic Aerothermal Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RCC Spallation Telemetry"
    },
    {
        "id": 709,
        "keyword": "ultra-high temperature ceramic zirconium diboride ablation telemetry for re-entry nose cones",
        "slug": "ultra-high-temperature-ceramic-zirconium-diboride-ablation-telemetry-for-re-entry-nose-cones",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "UHTC Ceramic Engineers & Re-entry Flight Test Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy UHTC Ablation Telemetry"
    },
    {
        "id": 710,
        "keyword": "aerothermal acoustic emission piezoelectric wafer transducer shockwave sensors for spaceplanes",
        "slug": "aerothermal-acoustic-emission-piezoelectric-wafer-transducer-shockwave-sensors-for-spaceplanes",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Structural Health Monitoring Leads & High-Temperature Sensor Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Piezoelectric Acoustic Sensors"
    },
    {
        "id": 711,
        "keyword": "silica tile reaction cured glass coating micro-crack laser interferometry for TPS inspection",
        "slug": "silica-tile-reaction-cured-glass-coating-micro-crack-laser-interferometry-for-tps-inspection",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "TPS Tile Quality Directors & Optical NDT Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Laser Interferometry Telemetry"
    },
    {
        "id": 712,
        "keyword": "atmospheric re-entry plasma stagnation heat flux embedded thermocouple controllers for gliders",
        "slug": "atmospheric-re-entry-plasma-stagnation-heat-flux-embedded-thermocouple-controllers-for-gliders",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Re-entry Aerothermodynamics Leads & Flight Instrumentation VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Stagnation Heat Flux Controllers"
    },
    {
        "id": 713,
        "keyword": "flexible ceramic blanket insulation thermal soaking adhesive bondline monitors for hypersonics",
        "slug": "flexible-ceramic-blanket-insulation-thermal-soaking-adhesive-bondline-monitors-for-hypersonics",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Thermal Blanket Specialists & Aerostructures Adhesive Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Bondline Thermal Monitors"
    },
    {
        "id": 714,
        "keyword": "shock-boundary layer interaction localized aerothermal heating optical pyrometry for control surfaces",
        "slug": "shock-boundary-layer-interaction-localized-aerothermal-heating-optical-pyrometry-for-control-surfaces",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Aerodynamics Heat Transfer Leads & Elevon Structural Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy SWBLI Pyrometry Monitors"
    },
    {
        "id": 715,
        "keyword": "hypersonic strake tile gap filler ceramic cloth acoustic flutter displacement telemetry for craft",
        "slug": "hypersonic-strake-tile-gap-filler-ceramic-cloth-acoustic-flutter-displacement-telemetry-for-craft",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Aeroelasticity Leads & Gap Filler Materials Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Tile Gap Flutter Telemetry"
    },
    {
        "id": 716,
        "keyword": "subsurface metallic airframe titanium substructure conductive soak-back controllers for TPS",
        "slug": "subsurface-metallic-airframe-titanium-substructure-conductive-soak-back-controllers-for-tps",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Airframe Thermal Protection Directors & Titanium Structures Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Soak-Back Thermal Controllers"
    },
    {
        "id": 717,
        "keyword": "aerodynamic friction boundary layer transition calorimeter heat flux monitors for spaceplanes",
        "slug": "aerodynamic-friction-boundary-layer-transition-calorimeter-heat-flux-monitors-for-spaceplanes",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Boundary Layer Physicists & Flight Test Calorimetry Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Boundary Layer Calorimeters"
    },
    {
        "id": 718,
        "keyword": "high-enthalpy arc-jet plasma wind tunnel TPS ablation optical emission spectroscopy telemetry",
        "slug": "high-enthalpy-arc-jet-plasma-wind-tunnel-tps-ablation-optical-emission-spectroscopy-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Arc-Jet Facility Directors & Optical Spectroscopy Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Arc-Jet Ablation Telemetry"
    },
    {
        "id": 719,
        "keyword": "re-usable spaceplane landing gear door ceramic seal thermal seepage monitors for re-entry",
        "slug": "re-usable-spaceplane-landing-gear-door-ceramic-seal-thermal-seepage-monitors-for-re-entry",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Landing Gear Door Integrity Leads & High-Temp Seal Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Door Seal Seepage Monitors"
    },
    {
        "id": 720,
        "keyword": "TPS tile room-temperature vulcanizing silicone adhesive shear stress telemetry for hypersonics",
        "slug": "tps-tile-room-temperature-vulcanizing-silicone-adhesive-shear-stress-telemetry-for-hypersonics",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Bonding Integrity Specialists & Aerothermal Test Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy RTV Adhesive Shear Telemetry"
    },
    {
        "id": 721,
        "keyword": "leading edge non-equilibrium catalytic atom recombination heat flux controllers for hypersonics",
        "slug": "leading-edge-non-equilibrium-catalytic-atom-recombination-heat-flux-controllers-for-hypersonics",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Non-Equilibrium Gas Dynamics Leads & Hypersonic Aerodynamicists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Catalytic Recombination Controllers"
    },
    {
        "id": 722,
        "keyword": "hot structure carbon-silicon carbide control surface fastener tension telemetry for spaceplanes",
        "slug": "hot-structure-carbon-silicon-carbide-control-surface-fastener-tension-telemetry-for-spaceplanes",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Hot Structures Leads & Fastener Preload Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy C-SiC Fastener Tension Telemetry"
    },
    {
        "id": 723,
        "keyword": "post-flight aerothermal thermal barrier coating eddy current conductivity telemetry for inspection",
        "slug": "post-flight-aerothermal-thermal-barrier-coating-eddy-current-conductivity-telemetry-for-inspection",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "NDT Level III Airframe Inspectors & Spaceplane Fleet Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Eddy Current Coating Telemetry"
    },
    {
        "id": 724,
        "keyword": "hypersonic vehicle elevon ceramic bearing thermal expansion seizure prevention telemetry",
        "slug": "hypersonic-vehicle-elevon-ceramic-bearing-thermal-expansion-seizure-prevention-telemetry",
        "category": "Solutions",
        "hub_category": "Aerospace & High-Speed Flight",
        "target_persona": "Actuation Mechanism Leads & Ceramic Bearing Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Elevon Bearing Seizure Telemetry"
    },

    # -------------------------------------------------------------------------
    # Cluster 3: Subsea Wellhead BOP Hydraulic Acoustic Telemetry (16 solutions, IDs 725-740)
    # -------------------------------------------------------------------------
    {
        "id": 725,
        "keyword": "hydraulic multiplex control pod pilot valve shifting acoustic pulse telemetry for subsea BOPs",
        "slug": "hydraulic-multiplex-control-pod-pilot-valve-shifting-acoustic-pulse-telemetry-for-subsea-bops",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea BOP Control Engineers & Deepwater Drilling Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy MUX Pod Acoustic Telemetry"
    },
    {
        "id": 726,
        "keyword": "blind shear ram cutting pressure accumulator hydraulic fluid discharge telemetry for BOPs",
        "slug": "blind-shear-ram-cutting-pressure-accumulator-hydraulic-fluid-discharge-telemetry-for-bops",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Well Control Technical Authorities & Subsea Drilling Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Shear Ram Hydraulic Telemetry"
    },
    {
        "id": 727,
        "keyword": "subsea BOP stack annular preventer packing element elastomeric extrusion telemetry for wells",
        "slug": "subsea-bop-stack-annular-preventer-packing-element-elastomeric-extrusion-telemetry-for-wells",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Equipment Reliability Leads & Wellhead Integrity VPs",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Annular Packer Extrusion Telemetry"
    },
    {
        "id": 728,
        "keyword": "high-pressure high-temperature wellhead acoustic seabed pinger telemetry for deepwater drilling",
        "slug": "high-pressure-high-temperature-wellhead-acoustic-seabed-pinger-telemetry-for-deepwater-drilling",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "HPHT Well Operations Leads & Subsea Acoustic Communications Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy HPHT Wellhead Pinger Telemetry"
    },
    {
        "id": 729,
        "keyword": "variable bore ram hydraulic wedgelock locking position LVDT telemetry for subsea BOP stacks",
        "slug": "variable-bore-ram-hydraulic-wedgelock-locking-position-lvdt-telemetry-for-subsea-bop-stacks",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Subsea Instrumentation Engineers & BOP Maintenance Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wedgelock LVDT Telemetry"
    },
    {
        "id": 730,
        "keyword": "choke and kill manifold particulate erosion ultrasonic wall thickness loss acoustic telemetry",
        "slug": "choke-and-kill-manifold-particulate-erosion-ultrasonic-wall-thickness-loss-acoustic-telemetry",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Piping Integrity Specialists & Offshore Drilling Supervisors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Manifold Wall Erosion Telemetry"
    },
    {
        "id": 731,
        "keyword": "emergency disconnect sequence acoustic deadman auto-shear squib telemetry for deepwater rigs",
        "slug": "emergency-disconnect-sequence-acoustic-deadman-auto-shear-squib-telemetry-for-deepwater-rigs",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Emergency Well Control Directors & Offshore Safety Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy EDS Deadman Auto-Shear Telemetry"
    },
    {
        "id": 732,
        "keyword": "subsea accumulator bottle nitrogen pre-charge pressure differential telemetry for BOP stacks",
        "slug": "subsea-accumulator-bottle-nitrogen-pre-charge-pressure-differential-telemetry-for-bop-stacks",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Hydraulic Power Systems Leads & Subsea Rig Superintendents",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Accumulator Pre-Charge Telemetry"
    },
    {
        "id": 733,
        "keyword": "wellhead marine riser flex joint angular deflection strain gauge telemetry for drilling vessels",
        "slug": "wellhead-marine-riser-flex-joint-angular-deflection-strain-gauge-telemetry-for-drilling-vessels",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Marine Riser Engineers & Dynamic Positioning Operators",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Flex Joint Angular Telemetry"
    },
    {
        "id": 734,
        "keyword": "lower marine riser package hydraulic connector locking pin acoustic verification telemetry",
        "slug": "lower-marine-riser-package-hydraulic-connector-locking-pin-acoustic-verification-telemetry",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "LMRP Operations Leads & Subsea Mechanical Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy LMRP Connector Pin Telemetry"
    },
    {
        "id": 735,
        "keyword": "subsea ROV hot-stab hydraulic override intervention pressure verification agents for deepwater",
        "slug": "subsea-rov-hot-stab-hydraulic-override-intervention-pressure-verification-agents-for-deepwater",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "ROV Operations Superintendents & Subsea Tooling Specialists",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy ROV Hot-Stab Override Telemetry"
    },
    {
        "id": 736,
        "keyword": "sour gas hydrogen sulfide metallic stress corrosion cracking acoustic emission sensors for BOPs",
        "slug": "sour-gas-hydrogen-sulfide-metallic-stress-corrosion-cracking-acoustic-emission-sensors-for-bops",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Metallurgy & Corrosion Engineers & Offshore Safety Managers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Sour Gas Corrosion Sensors"
    },
    {
        "id": 737,
        "keyword": "wellbore acoustic Doppler bubble gas kick detection early warning telemetry for drilling risers",
        "slug": "wellbore-acoustic-doppler-bubble-gas-kick-detection-early-warning-telemetry-for-drilling-risers",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Kick Detection Leads & Well Control Systems Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Gas Kick Early Warning Telemetry"
    },
    {
        "id": 738,
        "keyword": "BOP collet connector hydraulic clamping force ultrasound bolt preload telemetry for wellheads",
        "slug": "bop-collet-connector-hydraulic-clamping-force-ultrasound-bolt-preload-telemetry-for-wellheads",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Collet Connector Specialists & Wellhead Structural Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Collet Connector Preload Telemetry"
    },
    {
        "id": 739,
        "keyword": "subsea hydraulic fluid water contamination dielectric permittivity sensors for BOP control pods",
        "slug": "subsea-hydraulic-fluid-water-contamination-dielectric-permittivity-sensors-for-bop-control-pods",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Hydraulic Fluid Chemists & Subsea Controls Maintenance Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Fluid Dielectric Sensors"
    },
    {
        "id": 740,
        "keyword": "wellhead fatigue bending moment seabed soil support stiffness telemetry for deepwater rigs",
        "slug": "wellhead-fatigue-bending-moment-seabed-soil-support-stiffness-telemetry-for-deepwater-rigs",
        "category": "Solutions",
        "hub_category": "Offshore Energy & Subsea Wellheads",
        "target_persona": "Geotechnical Engineers & Wellhead Fatigue Monitoring Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Deploy Wellhead Fatigue Telemetry"
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
    for kw in wave17_keywords:
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

    print(f"Successfully ingested {added_count} Wave 17 keywords into {QUEUE_PATH}.")
    print(f"Total active keywords in queue: {len(queue)} (IDs {queue[0]['id']} to {queue[-1]['id']})")

if __name__ == "__main__":
    main()
