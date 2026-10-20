#!/usr/bin/env python3
"""
Ingests Wave 30 commercial keywords (IDs 1,341 to 1,390, 50 solutions)
into automation/compact_keywords_queue.json.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE30 = [
    # Cluster 1: Federated Secure Aggregation & Byzantine-Tolerant Consensus (IDs 1341-1357, 17 items)
    {
        "id": 1341,
        "keyword": "federated multi-krum aggregation telemetry for cross-border banking fraud agents",
        "slug": "federated-multi-krum-aggregation-telemetry-for-cross-border-banking-fraud-agents",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1342,
        "keyword": "bulyan byzantine-tolerant consensus telemetry for sovereign central bank digital currency",
        "slug": "bulyan-byzantine-tolerant-consensus-telemetry-for-sovereign-central-bank-digital-currency",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1343,
        "keyword": "shamir threshold secret sharing telemetry for private multi-party loan underwriting",
        "slug": "shamir-threshold-secret-sharing-telemetry-for-private-multi-party-loan-underwriting",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1344,
        "keyword": "pairwise diffie-hellman blinding mask telemetry for federated credit risk models",
        "slug": "pairwise-diffie-hellman-blinding-mask-telemetry-for-federated-credit-risk-models",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1345,
        "keyword": "sign-flipping gradient poisoning defense telemetry for quantitative algorithmic trading",
        "slug": "sign-flipping-gradient-poisoning-defense-telemetry-for-quantitative-algorithmic-trading",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1346,
        "keyword": "coordinate-wise trimmed mean telemetry for multi-tenant private wealth portfolio agents",
        "slug": "coordinate-wise-trimmed-mean-telemetry-for-multi-tenant-private-wealth-portfolio-agents",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1347,
        "keyword": "federated secure aggregation dropout recovery telemetry for distributed core banking",
        "slug": "federated-secure-aggregation-dropout-recovery-telemetry-for-distributed-core-banking",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1348,
        "keyword": "byzantine fault-tolerant consensus telemetry for cross-border trade finance reconciliation",
        "slug": "byzantine-fault-tolerant-consensus-telemetry-for-cross-border-trade-finance-reconciliation",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1349,
        "keyword": "targeted backdoor injection defense telemetry for automated aml transaction monitoring",
        "slug": "targeted-backdoor-injection-defense-telemetry-for-automated-aml-transaction-monitoring",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1350,
        "keyword": "collusive stealth vector mitigation telemetry for commercial insurance actuarial agents",
        "slug": "collusive-stealth-vector-mitigation-telemetry-for-commercial-insurance-actuarial-agents",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1351,
        "keyword": "coordinate-wise median aggregation telemetry for sovereign treasury bond auction bidding",
        "slug": "coordinate-wise-median-aggregation-telemetry-for-sovereign-treasury-bond-auction-bidding",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1352,
        "keyword": "federated gradient perturbation audit telemetry for sebi cyber security compliance",
        "slug": "federated-gradient-perturbation-audit-telemetry-for-sebi-cyber-security-compliance",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1353,
        "keyword": "zero-sum pairwise mask verification telemetry for rbi regulatory sandbox multi-agent systems",
        "slug": "zero-sum-pairwise-mask-verification-telemetry-for-rbi-regulatory-sandbox-multi-agent-systems",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1354,
        "keyword": "asynchronous byzantine agreement telemetry for institutional custody smart contracts",
        "slug": "asynchronous-byzantine-agreement-telemetry-for-institutional-custody-smart-contracts",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1355,
        "keyword": "federated model poisoning detection telemetry for credit bureau delinquency forecasting",
        "slug": "federated-model-poisoning-detection-telemetry-for-credit-bureau-delinquency-forecasting",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1356,
        "keyword": "byzantine-robust stochastic gradient descent telemetry for algorithmic market making",
        "slug": "byzantine-robust-stochastic-gradient-descent-telemetry-for-algorithmic-market-making",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },
    {
        "id": 1357,
        "keyword": "secure multi-party computation threshold telemetry for cross-border syndicated loans",
        "slug": "secure-multi-party-computation-threshold-telemetry-for-cross-border-syndicated-loans",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Chief Risk Officers & Sovereign AI Architects",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Byzantine Consensus Architecture Audit"
    },

    # Cluster 2: Superconducting Qubit Cryogenic Dilution Refrigerator RF Control & Fluxonium Telemetry (IDs 1358-1374, 17 items)
    {
        "id": 1358,
        "keyword": "cryogenic dilution refrigerator mixing chamber millikelvin telemetry for superconducting qubits",
        "slug": "cryogenic-dilution-refrigerator-mixing-chamber-millikelvin-telemetry-for-superconducting-qubits",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1359,
        "keyword": "fluxonium qubit inductive energy phase slip telemetry for quantum error correction",
        "slug": "fluxonium-qubit-inductive-energy-phase-slip-telemetry-for-quantum-error-correction",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1360,
        "keyword": "josephson junction loop magnetic flux bias drift telemetry for fluxonium quantum processors",
        "slug": "josephson-junction-loop-magnetic-flux-bias-drift-telemetry-for-fluxonium-quantum-processors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1361,
        "keyword": "cryogenic coaxial cable microwave attenuation telemetry for qubit dispersive readout",
        "slug": "cryogenic-coaxial-cable-microwave-attenuation-telemetry-for-qubit-dispersive-readout",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1362,
        "keyword": "in-phase quadrature mixer microwave pulse skew telemetry for quantum gate fidelity",
        "slug": "in-phase-quadrature-mixer-microwave-pulse-skew-telemetry-for-quantum-gate-fidelity",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1363,
        "keyword": "purcell filter notch resonator frequency drift telemetry for superconducting qubit readout",
        "slug": "purcell-filter-notch-resonator-frequency-drift-telemetry-for-superconducting-qubit-readout",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1364,
        "keyword": "hemt cryogenic low-noise amplifier gain compression telemetry for quantum readout chains",
        "slug": "hemt-cryogenic-low-noise-amplifier-gain-compression-telemetry-for-quantum-readout-chains",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1365,
        "keyword": "qubit energy relaxation time t1 decay telemetry for superconducting quantum circuits",
        "slug": "qubit-energy-relaxation-time-t1-decay-telemetry-for-superconducting-quantum-circuits",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1366,
        "keyword": "qubit dephasing time t2 ramsey fringe telemetry for cryogenic transmon processors",
        "slug": "qubit-dephasing-time-t2-ramsey-fringe-telemetry-for-cryogenic-transmon-processors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1367,
        "keyword": "dilution refrigerator continuous helium mixture circulation condensing pressure telemetry",
        "slug": "dilution-refrigerator-continuous-helium-mixture-circulation-condensing-pressure-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1368,
        "keyword": "superconducting qubit single-shot readout fidelity telemetry for surface code decoders",
        "slug": "superconducting-qubit-single-shot-readout-fidelity-telemetry-for-surface-code-decoders",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1369,
        "keyword": "microwave pulse direct digital synthesis phase noise telemetry for multi-qubit gates",
        "slug": "microwave-pulse-direct-digital-synthesis-phase-noise-telemetry-for-multi-qubit-gates",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1370,
        "keyword": "quantum state tomography density matrix purity telemetry for superconducting fluxonium",
        "slug": "quantum-state-tomography-density-matrix-purity-telemetry-for-superconducting-fluxonium",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1371,
        "keyword": "cryogenic magnetic shield residual flux trapping telemetry for superconducting quantum chips",
        "slug": "cryogenic-magnetic-shield-residual-flux-trapping-telemetry-for-superconducting-quantum-chips",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1372,
        "keyword": "qubit randomized benchmarking gate error rate telemetry for fault-tolerant processors",
        "slug": "qubit-randomized-benchmarking-gate-error-rate-telemetry-for-fault-tolerant-processors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1373,
        "keyword": "dilution refrigerator still stage thermal desorption telemetry for helium-3 recovery",
        "slug": "dilution-refrigerator-still-stage-thermal-desorption-telemetry-for-helium-3-recovery",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },
    {
        "id": 1374,
        "keyword": "traveling-wave parametric amplifier microwave pump frequency telemetry for qubit readout",
        "slug": "traveling-wave-parametric-amplifier-microwave-pump-frequency-telemetry-for-qubit-readout",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Quantum Hardware Engineers & Cryogenic Systems Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryogenic Qubit Architecture Audit"
    },

    # Cluster 3: High-Energy Synchrotron Beamline X-ray Diffraction & Undulator Telemetry (IDs 1375-1390, 16 items)
    {
        "id": 1375,
        "keyword": "synchrotron storage ring electron beam orbit fast feedback telemetry for beam stability",
        "slug": "synchrotron-storage-ring-electron-beam-orbit-fast-feedback-telemetry-for-beam-stability",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1376,
        "keyword": "insertion device undulator magnetic gap micrometer encoder telemetry for hard x-ray beamlines",
        "slug": "insertion-device-undulator-magnetic-gap-micrometer-encoder-telemetry-for-hard-x-ray-beamlines",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1377,
        "keyword": "silicon double-crystal monochromator liquid nitrogen thermal drift telemetry",
        "slug": "silicon-double-crystal-monochromator-liquid-nitrogen-thermal-drift-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1378,
        "keyword": "grazing-incidence toroidal focusing mirror surface slope error telemetry for synchrotron optics",
        "slug": "grazing-incidence-toroidal-focusing-mirror-surface-slope-error-telemetry-for-synchrotron-optics",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1379,
        "keyword": "photon beam position monitor sub-micron spatial jitter telemetry for x-ray diffraction",
        "slug": "photon-beam-position-monitor-sub-micron-spatial-jitter-telemetry-for-x-ray-diffraction",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1380,
        "keyword": "synchrotron beamline fast diamond shutter mechanical jitter telemetry for macromolecular crystallography",
        "slug": "synchrotron-beamline-fast-diamond-shutter-mechanical-jitter-telemetry-for-macromolecular-crystallography",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1381,
        "keyword": "high-resolution x-ray diffraction rocking curve peak broadening telemetry",
        "slug": "high-resolution-x-ray-diffraction-rocking-curve-peak-broadening-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1382,
        "keyword": "synchrotron insertion device planar wiggler critical photon energy telemetry",
        "slug": "synchrotron-insertion-device-planar-wiggler-critical-photon-energy-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1383,
        "keyword": "beamline ultra-high vacuum ion pump partial pressure telemetry for synchrotron front-ends",
        "slug": "beamline-ultra-high-vacuum-ion-pump-partial-pressure-telemetry-for-synchrotron-front-ends",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1384,
        "keyword": "compound refractive lens berylium optic alignment tilt telemetry for x-ray nanoprobe",
        "slug": "compound-refractive-lens-berylium-optic-alignment-tilt-telemetry-for-x-ray-nanoprobe",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1385,
        "keyword": "synchrotron storage ring radio-frequency cavity phase oscillation telemetry for bunch stability",
        "slug": "synchrotron-storage-ring-radio-frequency-cavity-phase-oscillation-telemetry-for-bunch-stability",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1386,
        "keyword": "x-ray fluorescence detector multi-channel analyzer pulse pile-up telemetry for trace element mapping",
        "slug": "x-ray-fluorescence-detector-multi-channel-analyzer-pulse-pile-up-telemetry-for-trace-element-mapping",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1387,
        "keyword": "synchrotron monochromator piezo-electric fine tilt actuator feedback telemetry",
        "slug": "synchrotron-monochromator-piezo-electric-fine-tilt-actuator-feedback-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1388,
        "keyword": "beamline cryo-cooled beryllium window thermal stress telemetry for high-heat-load x-ray optics",
        "slug": "beamline-cryo-cooled-beryllium-window-thermal-stress-telemetry-for-high-heat-load-x-ray-optics",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1389,
        "keyword": "x-ray absorption fine structure ionization chamber gas flow telemetry",
        "slug": "x-ray-absorption-fine-structure-ionization-chamber-gas-flow-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    },
    {
        "id": 1390,
        "keyword": "synchrotron storage ring top-up electron beam injection efficiency telemetry for constant beam current",
        "slug": "synchrotron-storage-ring-top-up-electron-beam-injection-efficiency-telemetry-for-constant-beam-current",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Synchrotron Beamline Directors & X-ray Optics Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Synchrotron Beamline Architecture Audit"
    }
]

def main():
    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing queue file: {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}

    added = 0
    for kw in KEYWORDS_WAVE30:
        if kw["id"] not in existing_ids:
            data.append(kw)
            added += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"✅ Ingested {added} new commercial keywords for Wave 30 into {QUEUE_PATH}")
    print(f"📊 Total queue size is now: {len(data)}")

if __name__ == "__main__":
    main()
