#!/usr/bin/env python3
"""
Ingests Wave 34 commercial keywords (IDs 1,541 to 1,590, 50 solutions)
into automation/compact_keywords_queue.json.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE34 = [
    # Cluster 1: Spiking Neural Network (SNN) Event Neuromorphic Telemetry (IDs 1541-1557, 17 items)
    {
        "id": 1541,
        "keyword": "spiking neural network leaky integrate-and-fire membrane potential telemetry for edge vision agents",
        "slug": "spiking-neural-network-leaky-integrate-and-fire-membrane-potential-telemetry-for-edge-vision-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1542,
        "keyword": "address-event representation aer asynchronous spike packet routing telemetry for neuromorphic processors",
        "slug": "address-event-representation-aer-asynchronous-spike-packet-routing-telemetry-for-neuromorphic-processors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1543,
        "keyword": "adaptive-threshold alif spike-frequency adaptation dynamics telemetry for autonomous edge controllers",
        "slug": "adaptive-threshold-alif-spike-frequency-adaptation-dynamics-telemetry-for-autonomous-edge-controllers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1544,
        "keyword": "spike-timing-dependent plasticity stdp on-chip synaptic weight update telemetry for neuromorphic agents",
        "slug": "spike-timing-dependent-plasticity-stdp-on-chip-synaptic-weight-update-telemetry-for-neuromorphic-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1545,
        "keyword": "event-based dynamic vision sensor dvs optical flow spike decoding telemetry for high-speed robotics",
        "slug": "event-based-dynamic-vision-sensor-dvs-optical-flow-spike-decoding-telemetry-for-high-speed-robotics",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1546,
        "keyword": "time-to-first-spike ttfs temporal latency arbitration telemetry for neuromorphic sensory processors",
        "slug": "time-to-first-spike-ttfs-temporal-latency-arbitration-telemetry-for-neuromorphic-sensory-processors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1547,
        "keyword": "surrogate-gradient backpropagation spike-bp training convergence telemetry for spiking neural networks",
        "slug": "surrogate-gradient-backpropagation-spike-bp-training-convergence-telemetry-for-spiking-neural-networks",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1548,
        "keyword": "synaptic operation sop femtojoule energy dissipation telemetry for low-power edge ai agents",
        "slug": "synaptic-operation-sop-femtojoule-energy-dissipation-telemetry-for-low-power-edge-ai-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1549,
        "keyword": "asynchronous event-driven sparsity clockless neuromorphic compute telemetry for battery-powered iot",
        "slug": "asynchronous-event-driven-sparsity-clockless-neuromorphic-compute-telemetry-for-battery-powered-iot",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1550,
        "keyword": "biological refractory period ion-channel conductance recovery telemetry for neuromorphic vision chips",
        "slug": "biological-refractory-period-ion-channel-conductance-recovery-telemetry-for-neuromorphic-vision-chips",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1551,
        "keyword": "poisson rate coding spike train variance telemetry for noisy edge sensor arbitration agents",
        "slug": "poisson-rate-coding-spike-train-variance-telemetry-for-noisy-edge-sensor-arbitration-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1552,
        "keyword": "neuromorphic crossbar array spike-driven accumulation telemetry for autonomous robotic controllers",
        "slug": "neuromorphic-crossbar-array-spike-driven-accumulation-telemetry-for-autonomous-robotic-controllers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1553,
        "keyword": "bursting limit-cycle resonance oscillation telemetry for neuromorphic motor control agents",
        "slug": "bursting-limit-cycle-resonance-oscillation-telemetry-for-neuromorphic-motor-control-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1554,
        "keyword": "direct event aer inter-core packet collision telemetry for multi-core neuromorphic microchips",
        "slug": "direct-event-aer-inter-core-packet-collision-telemetry-for-multi-core-neuromorphic-microchips",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1555,
        "keyword": "generalized leaky integrate-and-fire glif post-spike voltage hyperpolarization telemetry for edge chips",
        "slug": "generalized-leaky-integrate-and-fire-glif-post-spike-voltage-hyperpolarization-telemetry-for-edge-chips",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1556,
        "keyword": "neuromorphic event-driven audio cochlea spike decomposition telemetry for acoustic surveillance agents",
        "slug": "neuromorphic-event-driven-audio-cochlea-spike-decomposition-telemetry-for-acoustic-surveillance-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },
    {
        "id": 1557,
        "keyword": "spiking neural network surrogate loss landscape hessian eigenvalue telemetry for neuromorphic compilation",
        "slug": "spiking-neural-network-surrogate-loss-landscape-hessian-eigenvalue-telemetry-for-neuromorphic-compilation",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Neuromorphic Algorithm Engineers & Edge AI Architecture Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Neuromorphic Architecture Audit"
    },

    # Cluster 2: Legal Tech AI Automation & Bharatiya Sakshya Adhiniyam (BSA) 2023 Evidentiary Telemetry (IDs 1558-1574, 17 items)
    {
        "id": 1558,
        "keyword": "bharatiya sakshya adhiniyam bsa section 63 electronic record hash attestation telemetry for legal firms",
        "slug": "bharatiya-sakshya-adhiniyam-bsa-section-63-electronic-record-hash-attestation-telemetry-for-legal-firms",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1559,
        "keyword": "automated e-courts cnr dossier synchronization telemetry for litigation management attorneys",
        "slug": "automated-e-courts-cnr-dossier-synchronization-telemetry-for-litigation-management-attorneys",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1560,
        "keyword": "supreme court of india scr legal precedent semantic citation verification telemetry for appellate counsels",
        "slug": "supreme-court-of-india-scr-legal-precedent-semantic-citation-verification-telemetry-for-appellate-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1561,
        "keyword": "digital evidence chain-of-custody cryptographic sha-256 state stamping telemetry for criminal defense firms",
        "slug": "digital-evidence-chain-of-custody-cryptographic-sha-256-state-stamping-telemetry-for-criminal-defense-firms",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1562,
        "keyword": "bharatiya nyaya sanhita bns statutory section re-indexing telemetry for corporate compliance counsels",
        "slug": "bharatiya-nyaya-sanhita-bns-statutory-section-re-indexing-telemetry-for-corporate-compliance-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1563,
        "keyword": "bharatiya nagarik suraksha sanhita bnss procedural arrest remand timeline tracking telemetry for legal teams",
        "slug": "bharatiya-nagarik-suraksha-sanhita-bnss-procedural-arrest-remand-timeline-tracking-telemetry-for-legal-teams",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1564,
        "keyword": "commercial arbitration arbitral tribunal brief drafting verification telemetry for international dispute counsels",
        "slug": "commercial-arbitration-arbitral-tribunal-brief-drafting-verification-telemetry-for-international-dispute-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1565,
        "keyword": "automated legal contract indemnity clause liability cap discrepancy detection telemetry for in-house counsels",
        "slug": "automated-legal-contract-indemnity-clause-liability-cap-discrepancy-detection-telemetry-for-in-house-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1566,
        "keyword": "patent prior art claim-chart invalidity search semantic graph telemetry for intellectual property attorneys",
        "slug": "patent-prior-art-claim-chart-invalidity-search-semantic-graph-telemetry-for-intellectual-property-attorneys",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1567,
        "keyword": "insolvency and bankruptcy code ibc moratoria resolution plan compliance telemetry for resolution professionals",
        "slug": "insolvency-and-bankruptcy-code-ibc-moratoria-resolution-plan-compliance-telemetry-for-resolution-professionals",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1568,
        "keyword": "high court commercial division causelist hearing roster predictive telemetry for senior litigation advocates",
        "slug": "high-court-commercial-division-causelist-hearing-roster-predictive-telemetry-for-senior-litigation-advocates",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1569,
        "keyword": "anti-money laundering pmla enforcement directorate summons dossier synthesis telemetry for white-collar counsels",
        "slug": "anti-money-laundering-pmla-enforcement-directorate-summons-dossier-synthesis-telemetry-for-white-collar-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1570,
        "keyword": "digital personal data protection dpdp act consent notice audit trail telemetry for legal privacy officers",
        "slug": "digital-personal-data-protection-dpdp-act-consent-notice-audit-trail-telemetry-for-legal-privacy-officers",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1571,
        "keyword": "real estate regulatory authority rera title search deed encumbrance verification telemetry for property attorneys",
        "slug": "real-estate-regulatory-authority-rera-title-search-deed-encumbrance-verification-telemetry-for-property-attorneys",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1572,
        "keyword": "competition commission of india cci merger antitrust market concentration telemetry for antitrust counsels",
        "slug": "competition-commission-of-india-cci-merger-antitrust-market-concentration-telemetry-for-antitrust-counsels",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1573,
        "keyword": "sebi insider trading prohibition compliance trading window audit telemetry for listed enterprise legal teams",
        "slug": "sebi-insider-trading-prohibition-compliance-trading-window-audit-telemetry-for-listed-enterprise-legal-teams",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },
    {
        "id": 1574,
        "keyword": "automated trademark office objection reply counter-statement drafting telemetry for ip prosecution attorneys",
        "slug": "automated-trademark-office-objection-reply-counter-statement-drafting-telemetry-for-ip-prosecution-attorneys",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "Corporate General Counsels & Enterprise Legal Operations Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Legal AI Architecture Audit"
    },

    # Cluster 3: Micro-Nuclear Small Modular Reactor (SMR) TRISO Fuel Pellet & High-Temperature Gas Reactor (HTGR) Core Telemetry (IDs 1575-1590, 16 items)
    {
        "id": 1575,
        "keyword": "micro-nuclear smr triso fuel pebble fission product retention telemetry for high-temperature gas reactors",
        "slug": "micro-nuclear-smr-triso-fuel-pebble-fission-product-retention-telemetry-for-high-temperature-gas-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1576,
        "keyword": "silicon carbide sic cladding layer pyrolytic carbon irradiation stress telemetry for triso micro-fuel",
        "slug": "silicon-carbide-sic-cladding-layer-pyrolytic-carbon-irradiation-stress-telemetry-for-triso-micro-fuel",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1577,
        "keyword": "htgr helium primary coolant loop core outlet temperature fluctuation telemetry for small modular reactors",
        "slug": "htgr-helium-primary-coolant-loop-core-outlet-temperature-fluctuation-telemetry-for-small-modular-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1578,
        "keyword": "nuclear reactor negative temperature reactivity coefficient doppler feedback telemetry for walk-away safety smrs",
        "slug": "nuclear-reactor-negative-temperature-reactivity-coefficient-doppler-feedback-telemetry-for-walk-away-safety-smrs",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1579,
        "keyword": "pebble-bed smr graphite moderator pebble flow recirculation jam detection telemetry for nuclear operators",
        "slug": "pebble-bed-smr-graphite-moderator-pebble-flow-recirculation-jam-detection-telemetry-for-nuclear-operators",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1580,
        "keyword": "triso uranium oxycarbide uco fuel kernel burnup fissile depletion telemetry for advanced modular reactors",
        "slug": "triso-uranium-oxycarbide-uco-fuel-kernel-burnup-fissile-depletion-telemetry-for-advanced-modular-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1581,
        "keyword": "decay heat removal system passive air natural circulation draft telemetry for walk-away safe nuclear reactors",
        "slug": "decay-heat-removal-system-passive-air-natural-circulation-draft-telemetry-for-walk-away-safe-nuclear-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1582,
        "keyword": "smr control rod boron carbide absorption reactivity insertion margin telemetry for reactor trip controllers",
        "slug": "smr-control-rod-boron-carbide-absorption-reactivity-insertion-margin-telemetry-for-reactor-trip-controllers",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1583,
        "keyword": "high-temperature gas reactor intermediate heat exchanger pche thermal stress telemetry for nuclear plants",
        "slug": "high-temperature-gas-reactor-intermediate-heat-exchanger-pche-thermal-stress-telemetry-for-nuclear-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1584,
        "keyword": "helium gas turbine brayton cycle direct power conversion efficiency telemetry for micro-nuclear reactors",
        "slug": "helium-gas-turbine-brayton-cycle-direct-power-conversion-efficiency-telemetry-for-micro-nuclear-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1585,
        "keyword": "nuclear containment boundary filtered vented containment pressure suppression telemetry for modular reactors",
        "slug": "nuclear-containment-boundary-filtered-vented-containment-pressure-suppression-telemetry-for-modular-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1586,
        "keyword": "smr neutron flux in-core excore detector signal cross-correlation telemetry for reactor power mapping",
        "slug": "smr-neutron-flux-in-core-excore-detector-signal-cross-correlation-telemetry-for-reactor-power-mapping",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1587,
        "keyword": "triso fuel particle silver-110m fission product diffusion barrier telemetry for high-temperature gas reactors",
        "slug": "triso-fuel-particle-silver-110m-fission-product-diffusion-barrier-telemetry-for-high-temperature-gas-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1588,
        "keyword": "pebble-bed core axial power distribution peaking factor mitigation telemetry for modular nuclear reactors",
        "slug": "pebble-bed-core-axial-power-distribution-peaking-factor-mitigation-telemetry-for-modular-nuclear-reactors",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1589,
        "keyword": "micro-reactor automated emergency scram pneumatic shutdown rod latch telemetry for autonomous nuclear sites",
        "slug": "micro-reactor-automated-emergency-scram-pneumatic-shutdown-rod-latch-telemetry-for-autonomous-nuclear-sites",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    },
    {
        "id": 1590,
        "keyword": "smr remote autonomous load-following grid electrical frequency droop telemetry for microgrid nuclear plants",
        "slug": "smr-remote-autonomous-load-following-grid-electrical-frequency-droop-telemetry-for-microgrid-nuclear-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Nuclear Plant Operators & SMR Reactor Physics Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Nuclear SMR Architecture Audit"
    }
]

def main():
    if not QUEUE_PATH.exists():
        print(f"Error: Queue not found at {QUEUE_PATH}")
        return

    with open(QUEUE_PATH, "r", encoding="utf-8") as f:
        queue = json.load(f)

    existing_ids = {item["id"] for item in queue}
    existing_slugs = {item["slug"] for item in queue}

    added = 0
    for kw in KEYWORDS_WAVE34:
        if kw["id"] in existing_ids:
            print(f"Skipping duplicate ID {kw['id']}")
            continue
        if kw["slug"] in existing_slugs:
            print(f"Skipping duplicate slug {kw['slug']}")
            continue
        queue.append(kw)
        existing_ids.add(kw["id"])
        existing_slugs.add(kw["slug"])
        added += 1

    with open(QUEUE_PATH, "w", encoding="utf-8") as f:
        json.dump(queue, f, indent=4, ensure_ascii=False)

    print(f"Successfully ingested {added} new keywords into {QUEUE_PATH}. Total keywords in queue: {len(queue)}")

if __name__ == "__main__":
    main()
