#!/usr/bin/env python3
"""
Wave 29 Keywords Ingestion (IDs 1,291 to 1,340 - 50 Commercial BOFU Solutions):
- Cluster 1 (IDs 1,291–1,307, 17 solutions): Differential Privacy & Gradient Sanitization in Federated Healthcare & Genomic Agent Systems
- Cluster 2 (IDs 1,308–1,324, 17 solutions): Photonic Integrated Circuit (PIC) & Co-Packaged Optics (CPO) Laser Interconnect Telemetry
- Cluster 3 (IDs 1,325–1,340, 16 solutions): Magnetohydrodynamic (MHD) Liquid Metal Flow & Molten Salt Pump Telemetry
"""

import json
import re
from pathlib import Path

QUEUE_FILE = Path("/Users/krdeeksha/ELESIUM WEBSITE/automation/compact_keywords_queue.json")

def slugify(text: str) -> str:
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    return s.strip('-')

wave29_items = [
    # ----------------------------------------------------------------------------------
    # Cluster 1: Differential Privacy & Gradient Sanitization in Healthcare & Genomes (IDs 1,291–1,307, 17 items)
    # ----------------------------------------------------------------------------------
    (
        "differential privacy DPSGD per-sample gradient clipping norm telemetry for federated clinical trial records",
        "Healthcare AI & Diagnostics",
        "Chief Medical Information Officers & Federated Learning Security Leads",
        "Schedule Clinical Gradient Clipping Audit"
    ),
    (
        "renyi differential privacy RDP moments accountant privacy budget epsilon telemetry for genomic biobank data",
        "Healthcare AI & Diagnostics",
        "Genomic Data Privacy Officers & Biobank Informatics Leads",
        "Schedule RDP Privacy Budget Audit"
    ),
    (
        "gradient inversion DLG reconstruction loss telemetry for multi-hospital oncology model collaborative training",
        "Healthcare AI & Diagnostics",
        "Hospital Oncology Consortium Directors & AI Privacy Systems Engineers",
        "Schedule Gradient Inversion Defense Audit"
    ),
    (
        "gaussian mechanism noise multiplier sigma calibration telemetry for electronic health record EHR embeddings",
        "Healthcare AI & Diagnostics",
        "Health Information Privacy Leads & Clinical NLP Architects",
        "Schedule Gaussian Mechanism Calibration Audit"
    ),
    (
        "membership inference attack MIA shadow model confidence score telemetry for rare disease genomic diagnostic agents",
        "Healthcare AI & Diagnostics",
        "Rare Disease Diagnostic Leads & AI Privacy Governance Officers",
        "Schedule Membership Inference Defense Audit"
    ),
    (
        "differential privacy local DP randomized response epsilon telemetry for patient remote patient monitoring telemetry",
        "Healthcare AI & Diagnostics",
        "Remote Monitoring Platform Architects & Patient Privacy Officers",
        "Schedule Local DP Telemetry Audit"
    ),
    (
        "secure multiparty computation SMPC secret sharing gradient share verification telemetry for pharma drug discovery",
        "Healthcare AI & Diagnostics",
        "Pharmaceutical Alliance Data Leads & Cryptographic Engineering Directors",
        "Schedule SMPC Gradient Share Audit"
    ),
    (
        "differentially private synthetic data generation Wasserstein distance telemetry for cross-border patient registries",
        "Healthcare AI & Diagnostics",
        "Clinical Registry Compliance Officers & Synthetic Health Data Leads",
        "Schedule DP Synthetic Data Audit"
    ),
    (
        "differential privacy gradient leakage cosine similarity telemetry for multi-tenant medical imaging PACS models",
        "Healthcare AI & Diagnostics",
        "Medical PACS Cloud Architects & Radiology AI Security Directors",
        "Schedule PACS Gradient Leakage Audit"
    ),
    (
        "shuffled model differential privacy anonymity set size telemetry for decentralized medical wearable sensors",
        "Healthcare AI & Diagnostics",
        "Wearable Medical Device Engineers & Distributed Privacy Leads",
        "Schedule Shuffled Model DP Audit"
    ),
    (
        "differentially private GWAS chi-square test statistic perturbation telemetry for genomic association studies",
        "Healthcare AI & Diagnostics",
        "Genomic Association Research Leads & Biostatistical Compliance Heads",
        "Schedule Private GWAS Statistic Audit"
    ),
    (
        "differential privacy empirical privacy leakage audit telemetry for federated pathology slide feature extractors",
        "Healthcare AI & Diagnostics",
        "Digital Pathology Systems Architects & Clinical AI Compliance Leads",
        "Schedule Pathology Privacy Leakage Audit"
    ),
    (
        "gradient sanitization selective parameter updating gradient mask telemetry for confidential clinical notes",
        "Healthcare AI & Diagnostics",
        "Clinical Notes NLP Systems Leads & Hospital Privacy Officers",
        "Schedule Gradient Mask Sanitization Audit"
    ),
    (
        "differential privacy exponential mechanism utility score calibration telemetry for organ transplant donor matching",
        "Healthcare AI & Diagnostics",
        "Organ Transplant Allocation Directors & Healthcare Algorithmic Fairness Leads",
        "Schedule Exponential Mechanism Audit"
    ),
    (
        "federated averaging FedAvg secure aggregation blinding vector telemetry for multi-center cardiology ICU telemetry",
        "Healthcare AI & Diagnostics",
        "Cardiology Intensive Care Data Directors & Federated Health Engineers",
        "Schedule FedAvg Blinding Vector Audit"
    ),
    (
        "differentially private federated random forest split criterion noise telemetry for hospital readmission prediction",
        "Healthcare AI & Diagnostics",
        "Hospital Readmission Analytics Heads & Healthcare Model Risk Officers",
        "Schedule DP Forest Split Audit"
    ),
    (
        "differential privacy gradient dimension reduction random projection telemetry for high-throughput single-cell RNA-seq",
        "Healthcare AI & Diagnostics",
        "Single-Cell Genomics Bioinformatics Leads & Omics Privacy Directors",
        "Schedule Random Projection Privacy Audit"
    ),

    # ----------------------------------------------------------------------------------
    # Cluster 2: Photonic Integrated Circuit (PIC) & Co-Packaged Optics (CPO) Telemetry (IDs 1,308–1,324, 17 items)
    # ----------------------------------------------------------------------------------
    (
        "silicon photonics microring resonator thermal phase shift heater control loop telemetry for optical interconnects",
        "Semiconductors & Nanotechnology",
        "Silicon Photonics Packaging Leads & Optical Interconnect Architects",
        "Schedule Microring Resonator Thermal Audit"
    ),
    (
        "co-packaged optics CPO optical substrate laser coupling loss insertion loss telemetry for AI accelerator clusters",
        "Semiconductors & Nanotechnology",
        "CPO Hardware Systems Architects & AI Datacenter Interconnect Leads",
        "Schedule CPO Coupling Loss Audit"
    ),
    (
        "mach-zehnder interferometer MZI electro-optic push-pull phase modulation bias drift telemetry for 800G transceivers",
        "Semiconductors & Nanotechnology",
        "Optical Transceiver Design Engineers & High-Speed Optical Link Leads",
        "Schedule MZI Bias Drift Audit"
    ),
    (
        "continuous wave DFB laser array relative intensity noise RIN optical power monitor telemetry for DWDM interconnects",
        "Semiconductors & Nanotechnology",
        "Semiconductor Laser Packaging Leads & DWDM Optical Engine Architects",
        "Schedule DFB Laser RIN Audit"
    ),
    (
        "semiconductor optical amplifier SOA gain saturation carrier lifetime telemetry for PIC multi-wavelength amplification",
        "Semiconductors & Nanotechnology",
        "Photonic Integrated Circuit Designers & Optical Amplifier Leads",
        "Schedule SOA Gain Saturation Audit"
    ),
    (
        "silicon photonics grating coupler optical alignment active piezo alignment feedback telemetry for wafer scale testing",
        "Semiconductors & Nanotechnology",
        "Wafer-Level Optical Test Engineers & Photonics Foundry Leads",
        "Schedule Grating Coupler Alignment Audit"
    ),
    (
        "optical eye diagram transmitter dispersion eye closure quaternary TDECQ telemetry for 1.6T co-packaged optical engines",
        "Semiconductors & Nanotechnology",
        "Signal Integrity Optical Engineers & 1.6T Optical Interconnect Leads",
        "Schedule TDECQ Eye Diagram Audit"
    ),
    (
        "germanium on silicon photodetector responsivity dark current temperature coefficient telemetry for high-speed receivers",
        "Semiconductors & Nanotechnology",
        "Silicon Photodetector Engineers & Optical Receiver Subsystem Leads",
        "Schedule Photodetector Dark Current Audit"
    ),
    (
        "co-packaged optics external laser source ELS blind mate optical connector insertion loss telemetry for modular racks",
        "Semiconductors & Nanotechnology",
        "Hyperscale Datacenter Hardware Leads & Optical Interconnect Packaging Architects",
        "Schedule ELS Connector Loss Audit"
    ),
    (
        "silicon nitride SiN waveguide propagation loss optical backscatter reflectometry telemetry for low-loss PIC delay lines",
        "Semiconductors & Nanotechnology",
        "Integrated Photonics Process Engineers & Low-Loss Waveguide Designers",
        "Schedule Waveguide Loss Telemetry Audit"
    ),
    (
        "photonic integrated circuit thermo-optic phase shifter crosstalk cancellation matrix telemetry for optical switch fabrics",
        "Semiconductors & Nanotechnology",
        "Optical Switch Architecture Leads & Photonics Silicon Layout Engineers",
        "Schedule Phase Shifter Crosstalk Audit"
    ),
    (
        "silicon photonics integrated polarization beam splitter PBS extinction ratio telemetry for coherent optical modulators",
        "Semiconductors & Nanotechnology",
        "Coherent Optics Systems Leads & Photonic Component Verification Engineers",
        "Schedule Polarization Splitter Audit"
    ),
    (
        "laser diode facet optical catastrophic optical mirror damage COMD degradation telemetry for high-power pump lasers",
        "Semiconductors & Nanotechnology",
        "High-Power Diode Laser Reliability Leads & Optical Component Quality Heads",
        "Schedule Laser Facet Damage Audit"
    ),
    (
        "co-packaged optics micro-bump interconnect ball grid array BGA thermal cycle resistance telemetry for 2.5D packaging",
        "Semiconductors & Nanotechnology",
        "Advanced Semiconductor Packaging Reliability Leads & 2.5D CPO Systems Engineers",
        "Schedule Micro-Bump Resistance Audit"
    ),
    (
        "photonic crystal waveguide slow light group index dispersion telemetry for chip-scale optical delay lines",
        "Semiconductors & Nanotechnology",
        "Nanophotonics Research Engineers & Chip-Scale Optical Memory Leads",
        "Schedule Photonic Crystal Dispersion Audit"
    ),
    (
        "arrayed waveguide grating AWG channel passband spectral insertion loss center wavelength telemetry for DWDM PICs",
        "Semiconductors & Nanotechnology",
        "WDM Optical Filter Design Leads & Integrated Photonics Testing Engineers",
        "Schedule AWG Passband Insertion Audit"
    ),
    (
        "optical phase-locked loop OPLL phase detector error voltage telemetry for coherent laser carrier recovery",
        "Semiconductors & Nanotechnology",
        "Coherent Receiver DSP Engineers & Optical Phase Lock Leads",
        "Schedule OPLL Error Voltage Audit"
    ),

    # ----------------------------------------------------------------------------------
    # Cluster 3: Magnetohydrodynamic (MHD) Liquid Metal Flow & Molten Salt Telemetry (IDs 1,325–1,340, 16 items)
    # ----------------------------------------------------------------------------------
    (
        "liquid metal sodium potassium NaK electromagnetic pump linear induction coil temperature telemetry for fast reactors",
        "Nuclear & High-Energy Physics",
        "Liquid Metal Fast Reactor Cooling Leads & Electromagnetic Pump Engineers",
        "Schedule NaK EM Pump Coil Audit"
    ),
    (
        "magnetohydrodynamic electromagnetic flowmeter faraday induced voltage telemetry for molten lead bismuth eutectic loops",
        "Nuclear & High-Energy Physics",
        "Lead-Cooled Reactor Thermal Hydraulics Leads & Liquid Metal Instrumentation Engineers",
        "Schedule Faraday Flowmeter Voltage Audit"
    ),
    (
        "molten fluoride salt FLiBe canned rotor pump hydrodynamic bearing gap capacitance telemetry for MSR primary loops",
        "Nuclear & High-Energy Physics",
        "Molten Salt Reactor Primary Loop Engineers & Canned Motor Pump Specialists",
        "Schedule FLiBe Bearing Gap Audit"
    ),
    (
        "liquid sodium electromagnetic flow coupler pressure differential telemetry for secondary heat exchanger loops",
        "Nuclear & High-Energy Physics",
        "Nuclear Secondary Loop Engineers & Sodium Thermal Hydraulic Specialists",
        "Schedule Sodium Flow Coupler Audit"
    ),
    (
        "thermoelectric magnetohydrodynamic TEMHD current density shunt resistor telemetry for fusion liquid lithium divertor trays",
        "Nuclear & High-Energy Physics",
        "Fusion Divertor Plasma Materials Interaction Leads & Liquid Metal First Wall Engineers",
        "Schedule TEMHD Current Shunt Audit"
    ),
    (
        "molten salt frozen flange freeze valve temperature gradient thermocouple array telemetry for emergency drain tanks",
        "Nuclear & High-Energy Physics",
        "Reactor Passive Safety System Leads & Molten Salt Valves Specialists",
        "Schedule Freeze Valve Gradient Audit"
    ),
    (
        "liquid metal annular linear induction pump ALIP polyphase winding phase angle imbalance telemetry for coolant circulation",
        "Nuclear & High-Energy Physics",
        "Nuclear Induction Pump Engineers & Liquid Metal Flow Systems Leads",
        "Schedule ALIP Phase Imbalance Audit"
    ),
    (
        "molten chloride salt MSR hastelloy N ultrasonic flowmeter acoustic transit time telemetry for primary coolant loops",
        "Nuclear & High-Energy Physics",
        "Molten Chloride Reactor Systems Architects & High-Temperature Acoustic Leads",
        "Schedule Molten Chloride Ultrasonic Audit"
    ),
    (
        "liquid sodium bubble detector electromagnetic induction probe micro-bubble entrainment telemetry for steam generator protection",
        "Nuclear & High-Energy Physics",
        "Steam Generator Safety System Leads & Sodium Entrainment Telemetry Engineers",
        "Schedule Sodium Bubble Detector Audit"
    ),
    (
        "magnetohydrodynamic Hartmann layer velocity shear boundary layer electric potential telemetry for fusion blankets",
        "Nuclear & High-Energy Physics",
        "Fusion Breeding Blanket Designers & MHD Liquid Metal Fluid Dynamicists",
        "Schedule Hartmann Layer Potential Audit"
    ),
    (
        "molten salt thermal storage tank stratified thermocline temperature profile resistance thermometer array telemetry",
        "Nuclear & High-Energy Physics",
        "Concentrated Solar Power Thermal Storage Leads & Molten Salt Tank Engineers",
        "Schedule Thermocline Stratification Audit"
    ),
    (
        "liquid lithium free surface flowing film thickness ultrasonic pulse-echo telemetry for fusion divertor protection",
        "Nuclear & High-Energy Physics",
        "Flowing Liquid Lithium Divertor Leads & Fusion Ultrasonic Telemetry Engineers",
        "Schedule Lithium Film Thickness Audit"
    ),
    (
        "molten salt redox potential beryllium reduction electrode electrochemical cell open circuit potential telemetry",
        "Nuclear & High-Energy Physics",
        "Molten Salt Chemistry Control Leads & Corrosion Mitigation Specialists",
        "Schedule Redox Potential Electrode Audit"
    ),
    (
        "liquid metal permanent magnet flowmeter field decay fluxgate magnetometer telemetry for high-temperature coolant ducts",
        "Nuclear & High-Energy Physics",
        "Nuclear Flow Diagnostics Engineers & High-Temperature Magnetometer Leads",
        "Schedule PM Flowmeter Field Decay Audit"
    ),
    (
        "molten salt mechanical centrifugal pump shaft seal gas buffer helium differential pressure telemetry",
        "Nuclear & High-Energy Physics",
        "Nuclear Centrifugal Pump Reliability Leads & Molten Salt Shaft Seal Engineers",
        "Schedule Buffer Gas Pressure Audit"
    ),
    (
        "liquid metal electromagnetic brake flow stabilization coil current telemetry for continuous steel casting molds",
        "Nuclear & High-Energy Physics",
        "Continuous Steel Casting Metallurgical Process Leads & Electromagnetic Brake Engineers",
        "Schedule EM Brake Coil Telemetry Audit"
    )
]

def main():
    print(f"Loading existing queue from {QUEUE_FILE}...")
    with open(QUEUE_FILE, "r", encoding="utf-8") as f:
        queue = json.load(f)

    start_id = len(queue) + 1
    print(f"Current queue size: {len(queue)}. Next ID: {start_id}")

    added_count = 0
    for idx, (kw, hub_cat, persona, cta) in enumerate(wave29_items):
        item_id = start_id + idx
        slug = slugify(kw)
        
        if any(item["slug"] == slug for item in queue):
            print(f"WARNING: Slug {slug} already exists in queue! Skipping.")
            continue
            
        new_item = {
            "id": item_id,
            "keyword": kw,
            "slug": slug,
            "category": "Solutions",
            "hub_category": hub_cat,
            "target_persona": persona,
            "intent": "High-Lever BOFU",
            "search_volume_tier": "Low-Competition (0-50)",
            "moz_target_score": 97,
            "status": "PENDING",
            "primary_cta": cta
        }
        queue.append(new_item)
        added_count += 1

    with open(QUEUE_FILE, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=2, ensure_ascii=False)

    print(f"✅ Successfully added {added_count} new keywords to {QUEUE_FILE}. Total in queue: {len(queue)}")

if __name__ == "__main__":
    main()
