#!/usr/bin/env python3
"""
Ingests Wave 31 commercial keywords (IDs 1,391 to 1,440, 50 solutions)
into automation/compact_keywords_queue.json.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE31 = [
    # Cluster 1: Post-Quantum Cryptography & ML-KEM/ML-DSA Lattice Attestation (IDs 1391-1407, 17 items)
    {
        "id": 1391,
        "keyword": "post-quantum ml-kem key encapsulation telemetry for sovereign agent communication",
        "slug": "post-quantum-ml-kem-key-encapsulation-telemetry-for-sovereign-agent-communication",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1392,
        "keyword": "module-lwe polynomial ring lattice attestation telemetry for autonomous state checkpoints",
        "slug": "module-lwe-polynomial-ring-lattice-attestation-telemetry-for-autonomous-state-checkpoints",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1393,
        "keyword": "ml-dsa digital signature state transition attestation telemetry for financial audit logs",
        "slug": "ml-dsa-digital-signature-state-transition-attestation-telemetry-for-financial-audit-logs",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1394,
        "keyword": "hybrid x25519-kyber768 post-quantum tls key exchange telemetry for cloud vpc peering",
        "slug": "hybrid-x25519-kyber768-post-quantum-tls-key-exchange-telemetry-for-cloud-vpc-peering",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1395,
        "keyword": "harvest now decrypt later retrospective secrecy window telemetry for dpdp compliance",
        "slug": "harvest-now-decrypt-later-retrospective-secrecy-window-telemetry-for-dpdp-compliance",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1396,
        "keyword": "number theoretic transform ntt polynomial multiplication telemetry for edge enclave microvms",
        "slug": "number-theoretic-transform-ntt-polynomial-multiplication-telemetry-for-edge-enclave-microvms",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1397,
        "keyword": "centered binomial error noise distribution telemetry for lattice encryption security bounds",
        "slug": "centered-binomial-error-noise-distribution-telemetry-for-lattice-encryption-security-bounds",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1398,
        "keyword": "post-quantum state snapshot signature verification telemetry for zero-trust databases",
        "slug": "post-quantum-state-snapshot-signature-verification-telemetry-for-zero-trust-databases",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1399,
        "keyword": "ml-kem-1024 military-grade key encapsulation telemetry for sovereign defense AI swarms",
        "slug": "ml-kem-1024-military-grade-key-encapsulation-telemetry-for-sovereign-defense-ai-swarms",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1400,
        "keyword": "post-quantum certificate authority x509 public key infrastructure migration telemetry",
        "slug": "post-quantum-certificate-authority-x509-public-key-infrastructure-migration-telemetry",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1401,
        "keyword": "lattice-based zero-knowledge proof state attestation telemetry for cross-border banking",
        "slug": "lattice-based-zero-knowledge-proof-state-attestation-telemetry-for-cross-border-banking",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1402,
        "keyword": "quantum-resistant hardware security module hsm pkcs11 command latency telemetry",
        "slug": "quantum-resistant-hardware-security-module-hsm-pkcs11-command-latency-telemetry",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1403,
        "keyword": "post-quantum secure boot firmware image dilithium verification telemetry for edge devices",
        "slug": "post-quantum-secure-boot-firmware-image-dilithium-verification-telemetry-for-edge-devices",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1404,
        "keyword": "ml-dsa-87 high-assurance state machine signature telemetry for aerospace mission flight controllers",
        "slug": "ml-dsa-87-high-assurance-state-machine-signature-telemetry-for-aerospace-mission-flight-controllers",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1405,
        "keyword": "lattice learning with errors parameter set security margin telemetry for healthcare data meshes",
        "slug": "lattice-learning-with-errors-parameter-set-security-margin-telemetry-for-healthcare-data-meshes",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1406,
        "keyword": "post-quantum ephemeral key exchange renegotiation telemetry for high-speed trading api gateways",
        "slug": "post-quantum-ephemeral-key-exchange-renegotiation-telemetry-for-high-speed-trading-api-gateways",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },
    {
        "id": 1407,
        "keyword": "statutory post-quantum cryptographic inventory audit telemetry for sebi rbi zero-trust compliance",
        "slug": "statutory-post-quantum-cryptographic-inventory-audit-telemetry-for-sebi-rbi-zero-trust-compliance",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Chief Security Officers & Cryptographic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Post-Quantum Architecture Audit"
    },

    # Cluster 2: Industrial Manufacturing SCADA OPC-UA Edge Mesh & CNC Telemetry (IDs 1408-1424, 17 items)
    {
        "id": 1408,
        "keyword": "siemens s7-1500 plc holding register opc-ua polling latency telemetry for stamping lines",
        "slug": "siemens-s7-1500-plc-holding-register-opc-ua-polling-latency-telemetry-for-stamping-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1409,
        "keyword": "high-speed cnc spindle vibration spectral peak fft telemetry for predictive tool failure",
        "slug": "high-speed-cnc-spindle-vibration-spectral-peak-fft-telemetry-for-predictive-tool-failure",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1410,
        "keyword": "inline high-speed machine vision surface roughness inspection telemetry for casting lines",
        "slug": "inline-high-speed-machine-vision-surface-roughness-inspection-telemetry-for-casting-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1411,
        "keyword": "sub-10ms edge tensorrt defect detection inference latency telemetry for automotive stampings",
        "slug": "sub-10ms-edge-tensorrt-defect-detection-inference-latency-telemetry-for-automotive-stampings",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1412,
        "keyword": "closed-loop sap s4hana bapi production order scrap booking telemetry for pune auto plants",
        "slug": "closed-loop-sap-s4hana-bapi-production-order-scrap-booking-telemetry-for-pune-auto-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1413,
        "keyword": "industrial stamping press hydraulic cylinder pressure transient telemetry for die protection",
        "slug": "industrial-stamping-press-hydraulic-cylinder-pressure-transient-telemetry-for-die-protection",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1414,
        "keyword": "modbus tcp edge gateway holding register write-ahead log telemetry for factory network outages",
        "slug": "modbus-tcp-edge-gateway-holding-register-write-ahead-log-telemetry-for-factory-network-outages",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1415,
        "keyword": "robotic arc welding seam tracking laser vision triangulation telemetry for truck chassis fabrication",
        "slug": "robotic-arc-welding-seam-tracking-laser-vision-triangulation-telemetry-for-truck-chassis-fabrication",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1416,
        "keyword": "automated optical inspection aoi solder paste deposit volume telemetry for smt electronics lines",
        "slug": "automated-optical-inspection-aoi-solder-paste-deposit-volume-telemetry-for-smt-electronics-lines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1417,
        "keyword": "plastic injection molding barrel multi-zone thermocouple thermal drift telemetry for medical parts",
        "slug": "plastic-injection-molding-barrel-multi-zone-thermocouple-thermal-drift-telemetry-for-medical-parts",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1418,
        "keyword": "cnc milling coolant flow rate ultrasonic sensor telemetry for thermal workpiece deformation prevention",
        "slug": "cnc-milling-coolant-flow-rate-ultrasonic-sensor-telemetry-for-thermal-workpiece-deformation-prevention",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1419,
        "keyword": "high-speed bottling line pneumatic rejector solenoid timing jitter telemetry for fmcg packaging",
        "slug": "high-speed-bottling-line-pneumatic-rejector-solenoid-timing-jitter-telemetry-for-fmcg-packaging",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1420,
        "keyword": "rockwell ethernet-ip cip motion drive position error telemetry for packaging palletizers",
        "slug": "rockwell-ethernet-ip-cip-motion-drive-position-error-telemetry-for-packaging-palletizers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1421,
        "keyword": "industrial paint booth voc air scrub filter differential pressure telemetry for epa compliance",
        "slug": "industrial-paint-booth-voc-air-scrub-filter-differential-pressure-telemetry-for-epa-compliance",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1422,
        "keyword": "die-casting mold cavity pressure piezoelectric transducer telemetry for porosity reduction",
        "slug": "die-casting-mold-cavity-pressure-piezoelectric-transducer-telemetry-for-porosity-reduction",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1423,
        "keyword": "automated guided vehicle agv lidar safety laser curtain breach telemetry for warehouse aisles",
        "slug": "automated-guided-vehicle-agv-lidar-safety-laser-curtain-breach-telemetry-for-warehouse-aisles",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },
    {
        "id": 1424,
        "keyword": "factory power factor correction capacitor bank harmonic distortion thd telemetry for tariff penalty elimination",
        "slug": "factory-power-factor-correction-capacitor-bank-harmonic-distortion-thd-telemetry-for-tariff-penalty-elimination",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Plant Operations Directors & Manufacturing Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Manufacturing AI Architecture Audit"
    },

    # Cluster 3: High-Field Superconducting Magnet Quench Protection & HTS Tape Strain Telemetry (IDs 1425-1440, 16 items)
    {
        "id": 1425,
        "keyword": "rebco high-temperature superconducting magnet quench detection fiber-optic bragg grating telemetry",
        "slug": "rebco-high-temperature-superconducting-magnet-quench-detection-fiber-optic-bragg-grating-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1426,
        "keyword": "active energy extraction dump resistor voltage transient telemetry for high-field magnets",
        "slug": "active-energy-extraction-dump-resistor-voltage-transient-telemetry-for-high-field-magnets",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1427,
        "keyword": "hts tape electro-mechanical delamination critical strain telemetry under high magnetic lorentz forces",
        "slug": "hts-tape-electro-mechanical-delamination-critical-strain-telemetry-under-high-magnetic-lorentz-forces",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1428,
        "keyword": "superconducting magnet persistent current switch thermal runaway telemetry for mri cryostats",
        "slug": "superconducting-magnet-persistent-current-switch-thermal-runaway-telemetry-for-mri-cryostats",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1429,
        "keyword": "cryogenic liquid helium boil-off mass flow rate thermal acoustic oscillation telemetry for magnet vessels",
        "slug": "cryogenic-liquid-helium-boil-off-mass-flow-rate-thermal-acoustic-oscillation-telemetry-for-magnet-vessels",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1430,
        "keyword": "hall probe magnetic flux density vector mapping telemetry for particle accelerator dipole magnets",
        "slug": "hall-probe-magnetic-flux-density-vector-mapping-telemetry-for-particle-accelerator-dipole-magnets",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1431,
        "keyword": "high-temperature superconducting pancake coil joint electrical resistance nanovolt telemetry",
        "slug": "high-temperature-superconducting-pancake-coil-joint-electrical-resistance-nanovolt-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1432,
        "keyword": "superconducting magnet cryostat vacuum insulation dewar pressure rise rate telemetry for thermal leak detection",
        "slug": "superconducting-magnet-cryostat-vacuum-insulation-dewar-pressure-rise-rate-telemetry-for-thermal-leak-detection",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1433,
        "keyword": "magnet power supply current ripple ppm stability telemetry for nuclear magnetic resonance nmr spectrometers",
        "slug": "magnet-power-supply-current-ripple-ppm-stability-telemetry-for-nuclear-magnetic-resonance-nmr-spectrometers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1434,
        "keyword": "acoustic emission sensor wave arrival time telemetry for superconducting magnet micro-slip crack localization",
        "slug": "acoustic-emission-sensor-wave-arrival-time-telemetry-for-superconducting-magnet-micro-slip-crack-localization",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1435,
        "keyword": "conduction-cooled cryocooler cold head 4k stage temperature oscillation telemetry for dry magnets",
        "slug": "conduction-cooled-cryocooler-cold-head-4k-stage-temperature-oscillation-telemetry-for-dry-magnets",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1436,
        "keyword": "quench protection fast solid-state thyristor switch gate trigger jitter telemetry for fusion coils",
        "slug": "quench-protection-fast-solid-state-thyristor-switch-gate-trigger-jitter-telemetry-for-fusion-coils",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1437,
        "keyword": "superconducting solenoid self-inductance magnetic flux link coupling telemetry for pulse magnets",
        "slug": "superconducting-solenoid-self-inductance-magnetic-flux-link-coupling-telemetry-for-pulse-magnets",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1438,
        "keyword": "cryogenic vapor-cooled current lead thermal balance temperature profile telemetry for 20ka magnets",
        "slug": "cryogenic-vapor-cooled-current-lead-thermal-balance-temperature-profile-telemetry-for-20ka-magnets",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1439,
        "keyword": "superconducting magnetic energy storage smes fast charge-discharge response telemetry for grid stability",
        "slug": "superconducting-magnetic-energy-storage-smes-fast-charge-discharge-response-telemetry-for-grid-stability",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    },
    {
        "id": 1440,
        "keyword": "magnet quench discharge helium safety relief burst disk pressure telemetry for laboratory safety",
        "slug": "magnet-quench-discharge-helium-safety-relief-burst-disk-pressure-telemetry-for-laboratory-safety",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Superconducting Magnet Leads & Cryogenic Systems Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Superconducting Magnet Architecture Audit"
    }
]

def main():
    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing queue file: {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}

    added = 0
    for kw in KEYWORDS_WAVE31:
        if kw["id"] not in existing_ids:
            data.append(kw)
            added += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"✅ Ingested {added} new commercial keywords for Wave 31 into {QUEUE_PATH}")
    print(f"📊 Total queue size is now: {len(data)}")

if __name__ == "__main__":
    main()
