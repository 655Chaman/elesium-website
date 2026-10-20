#!/usr/bin/env python3
"""
Ingests Wave 32 commercial keywords (IDs 1,441 to 1,490, 50 solutions)
into automation/compact_keywords_queue.json.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE32 = [
    # Cluster 1: Silicon Photonics Co-Packaged Optics & Optical Matrix In-Flight Compute Telemetry (IDs 1441-1457, 17 items)
    {
        "id": 1441,
        "keyword": "silicon photonics clements mzi mesh unitary matrix multiply latency telemetry for autonomous agents",
        "slug": "silicon-photonics-clements-mzi-mesh-unitary-matrix-multiply-latency-telemetry-for-autonomous-agents",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1442,
        "keyword": "co-packaged optics cpo sub-picosecond optical waveguide time-of-flight latency telemetry for datacenter ai",
        "slug": "co-packaged-optics-cpo-sub-picosecond-optical-waveguide-time-of-flight-latency-telemetry-for-datacenter-ai",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1443,
        "keyword": "dense wdm multi-wavelength optical channel power extinction ratio telemetry for optical neural networks",
        "slug": "dense-wdm-multi-wavelength-optical-channel-power-extinction-ratio-telemetry-for-optical-neural-networks",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1444,
        "keyword": "germanium-on-silicon pin photodetector optical-to-electrical conversion latency telemetry for agent inference",
        "slug": "germanium-on-silicon-pin-photodetector-optical-to-electrical-conversion-latency-telemetry-for-agent-inference",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1445,
        "keyword": "thermo-optic phase drift closed-loop micro-heater calibration telemetry for silicon rib waveguides",
        "slug": "thermo-optic-phase-drift-closed-loop-micro-heater-calibration-telemetry-for-silicon-rib-waveguides",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1446,
        "keyword": "diffractive deep neural network d2nn metasurface layer phase modulation telemetry for low-power vision",
        "slug": "diffractive-deep-neural-network-d2nn-metasurface-layer-phase-modulation-telemetry-for-low-power-vision",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1447,
        "keyword": "micro-ring resonator mrr crossbar array wdm resonance shift tracking telemetry for tensor acceleration",
        "slug": "micro-ring-resonator-mrr-crossbar-array-wdm-resonance-shift-tracking-telemetry-for-tensor-acceleration",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1448,
        "keyword": "continuous-wave cw dfb laser relative intensity noise rin telemetry for coherent optical matrix compute",
        "slug": "continuous-wave-cw-dfb-laser-relative-intensity-noise-rin-telemetry-for-coherent-optical-matrix-compute",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1449,
        "keyword": "mach-zehnder interferometer electro-optic dac modulation jitter telemetry for enterprise agent swarms",
        "slug": "mach-zehnder-interferometer-electro-optic-dac-modulation-jitter-telemetry-for-enterprise-agent-swarms",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1450,
        "keyword": "optical general matrix multiply gemm femtojoule-per-mac energy efficiency telemetry for hyperscale ai",
        "slug": "optical-general-matrix-multiply-gemm-femtojoule-per-mac-energy-efficiency-telemetry-for-hyperscale-ai",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1451,
        "keyword": "silicon nitride si3n4 low-loss waveguide propagation loss telemetry for wideband optical inference",
        "slug": "silicon-nitride-si3n4-low-loss-waveguide-propagation-loss-telemetry-for-wideband-optical-inference",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1452,
        "keyword": "non-volatile phase-change material pcm optical weight retention telemetry for zero-static-power onns",
        "slug": "non-volatile-phase-change-material-pcm-optical-weight-retention-telemetry-for-zero-static-power-onns",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1453,
        "keyword": "co-packaged optics optical engine serdes interconnect energy dissipation telemetry for generative models",
        "slug": "co-packaged-optics-optical-engine-serdes-interconnect-energy-dissipation-telemetry-for-generative-models",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1454,
        "keyword": "effective number of bits enob degradation thermal noise telemetry for optical matrix accelerators",
        "slug": "effective-number-of-bits-enob-degradation-thermal-noise-telemetry-for-optical-matrix-accelerators",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1455,
        "keyword": "optical crossbar switch spatial non-blocking routing matrix telemetry for distributed agent memory",
        "slug": "optical-crossbar-switch-spatial-non-blocking-routing-matrix-telemetry-for-distributed-agent-memory",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1456,
        "keyword": "polarization-dependent loss pdl optical fiber coupling alignment drift telemetry for photonic chips",
        "slug": "polarization-dependent-loss-pdl-optical-fiber-coupling-alignment-drift-telemetry-for-photonic-chips",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },
    {
        "id": 1457,
        "keyword": "coherent optical state attestation telemetry for sovereign confidential agent computation",
        "slug": "coherent-optical-state-attestation-telemetry-for-sovereign-confidential-agent-computation",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Optical Systems Architects & AI Hardware Infrastructure Leads",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Photonic Compute Architecture Audit"
    },

    # Cluster 2: Vernacular E-Commerce NLU & ONDC Beckn Protocol Autonomous Commerce Telemetry (IDs 1458-1474, 17 items)
    {
        "id": 1458,
        "keyword": "vernacular voice nlu hindi hinglish speech recognition accuracy telemetry for e-commerce checkout",
        "slug": "vernacular-voice-nlu-hindi-hinglish-speech-recognition-accuracy-telemetry-for-e-commerce-checkout",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1459,
        "keyword": "ondc beckn protocol search to confirm transaction latency telemetry for retail agent networks",
        "slug": "ondc-beckn-protocol-search-to-confirm-transaction-latency-telemetry-for-retail-agent-networks",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1460,
        "keyword": "real-time cart checkout abandonment intent detection telemetry for conversational commerce agents",
        "slug": "real-time-cart-checkout-abandonment-intent-detection-telemetry-for-conversational-commerce-agents",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1461,
        "keyword": "streaming conformer asr acoustic model word error rate telemetry for tier-2 indian dialects",
        "slug": "streaming-conformer-asr-acoustic-model-word-error-rate-telemetry-for-tier-2-indian-dialects",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1462,
        "keyword": "automated npci upi deep-linking payment intent completion telemetry for conversational ai bots",
        "slug": "automated-npci-upi-deep-linking-payment-intent-completion-telemetry-for-conversational-ai-bots",
        "category": "Solutions",
        "hub_category": "BFSI & Underwriting",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1463,
        "keyword": "ondc bpp provider platform catalog sync and order state reconciliation telemetry for d2c brands",
        "slug": "ondc-bpp-provider-platform-catalog-sync-and-order-state-reconciliation-telemetry-for-d2c-brands",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1464,
        "keyword": "multilingual slot extraction and intent classification confidence telemetry for grocery shopping agents",
        "slug": "multilingual-slot-extraction-and-intent-classification-confidence-telemetry-for-grocery-shopping-agents",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1465,
        "keyword": "conversational product recommendation collaborative filtering latency telemetry for retail apps",
        "slug": "conversational-product-recommendation-collaborative-filtering-latency-telemetry-for-retail-apps",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1466,
        "keyword": "voice-first order cancellation and automated refund webhook telemetry for omnichannel retail",
        "slug": "voice-first-order-cancellation-and-automated-refund-webhook-telemetry-for-omnichannel-retail",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1467,
        "keyword": "ondc bg gateway broadcast transaction fan-out response latency telemetry for retail buyer apps",
        "slug": "ondc-bg-gateway-broadcast-transaction-fan-out-response-latency-telemetry-for-retail-buyer-apps",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1468,
        "keyword": "hinglish code-mixed natural language understanding token parsing telemetry for customer support",
        "slug": "hinglish-code-mixed-natural-language-understanding-token-parsing-telemetry-for-customer-support",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1469,
        "keyword": "conversational price negotiation dynamic markdown margin guardrail telemetry for b2b marketplaces",
        "slug": "conversational-price-negotiation-dynamic-markdown-margin-guardrail-telemetry-for-b2b-marketplaces",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1470,
        "keyword": "real-time pincode serviceability and automated logistics slas telemetry for conversational orders",
        "slug": "real-time-pincode-serviceability-and-automated-logistics-slas-telemetry-for-conversational-orders",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1471,
        "keyword": "whatsapp business cloud api session message delivery latency telemetry for e-commerce agents",
        "slug": "whatsapp-business-cloud-api-session-message-delivery-latency-telemetry-for-e-commerce-agents",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1472,
        "keyword": "multilingual text-to-speech tts neural vocoder mean opinion score telemetry for voice shopping",
        "slug": "multilingual-text-to-speech-tts-neural-vocoder-mean-opinion-score-telemetry-for-voice-shopping",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1473,
        "keyword": "ondc issue and grievance management igm protocol dispute resolution telemetry for buyer agents",
        "slug": "ondc-issue-and-grievance-management-igm-protocol-dispute-resolution-telemetry-for-buyer-agents",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },
    {
        "id": 1474,
        "keyword": "conversational customer lifetime value clv uplift and cross-sell conversion telemetry for fashion retail",
        "slug": "conversational-customer-lifetime-value-clv-uplift-and-cross-sell-conversion-telemetry-for-fashion-retail",
        "category": "Solutions",
        "hub_category": "Logistics & Supply Chain",
        "target_persona": "E-Commerce VPs of Engineering & Chief Commercial Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Conversational Commerce Architecture Audit"
    },

    # Cluster 3: Deep-Sea Ocean Thermal Energy Conversion (OTEC) & Cold-Water Pipe Structural Telemetry (IDs 1475-1490, 16 items)
    {
        "id": 1475,
        "keyword": "deep-sea cold-water pipe cwp vortex-induced vibration viv strain gauge telemetry for otec platforms",
        "slug": "deep-sea-cold-water-pipe-cwp-vortex-induced-vibration-viv-strain-gauge-telemetry-for-otec-platforms",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1476,
        "keyword": "closed-cycle otec ammonia working fluid evaporator heat transfer coefficient telemetry for marine power",
        "slug": "closed-cycle-otec-ammonia-working-fluid-evaporator-heat-transfer-coefficient-telemetry-for-marine-power",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1477,
        "keyword": "deep ocean 1000m intake cold seawater flow rate and pumping head loss telemetry for offshore plants",
        "slug": "deep-ocean-1000m-intake-cold-seawater-flow-rate-and-pumping-head-loss-telemetry-for-offshore-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1478,
        "keyword": "otec surface warm seawater titanium plate heat exchanger biofouling thermal resistance telemetry",
        "slug": "otec-surface-warm-seawater-titanium-plate-heat-exchanger-biofouling-thermal-resistance-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1479,
        "keyword": "deep-sea fiberglass reinforced plastic frp pipe joint bending moment telemetry for offshore moorings",
        "slug": "deep-sea-fiberglass-reinforced-plastic-frp-pipe-joint-bending-moment-telemetry-for-offshore-moorings",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1480,
        "keyword": "organic rankine cycle orc turbine generator electrical output and thermal efficiency telemetry for otec",
        "slug": "organic-rankine-cycle-orc-turbine-generator-electrical-output-and-thermal-efficiency-telemetry-for-otec",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1481,
        "keyword": "ocean thermal gradient delta-t seawater temperature differential stability telemetry for baseload power",
        "slug": "ocean-thermal-gradient-delta-t-seawater-temperature-differential-stability-telemetry-for-baseload-power",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1482,
        "keyword": "deep seawater nutrient-rich discharge upwelling plume environmental impact telemetry for otec sites",
        "slug": "deep-seawater-nutrient-rich-discharge-upwelling-plume-environmental-impact-telemetry-for-otec-sites",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1483,
        "keyword": "otec floating production platform dynamic positioning tension leg mooring line tension telemetry",
        "slug": "otec-floating-production-platform-dynamic-positioning-tension-leg-mooring-line-tension-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1484,
        "keyword": "high-density polyethylene hdpe cold-water intake pipe hydrostatic collapse resistance telemetry",
        "slug": "high-density-polyethylene-hdpe-cold-water-intake-pipe-hydrostatic-collapse-resistance-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1485,
        "keyword": "hybrid otec desalination vacuum flash evaporator fresh water production yield telemetry for island grids",
        "slug": "hybrid-otec-desalination-vacuum-flash-evaporator-fresh-water-production-yield-telemetry-for-island-grids",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1486,
        "keyword": "subsea electrical transmission umbilical cable dynamic fatigue strain telemetry for floating otec",
        "slug": "subsea-electrical-transmission-umbilical-cable-dynamic-fatigue-strain-telemetry-for-floating-otec",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1487,
        "keyword": "ammonia vapor turbine inlet pressure and superheat degree telemetry for closed-cycle otec plants",
        "slug": "ammonia-vapor-turbine-inlet-pressure-and-superheat-degree-telemetry-for-closed-cycle-otec-plants",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1488,
        "keyword": "deep-sea intake screen marine organism impingement and differential pressure drop telemetry",
        "slug": "deep-sea-intake-screen-marine-organism-impingement-and-differential-pressure-drop-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1489,
        "keyword": "otec marine condenser liquid ammonia condensate level and subcooling margin telemetry for marine ships",
        "slug": "otec-marine-condenser-liquid-ammonia-condensate-level-and-subcooling-margin-telemetry-for-marine-ships",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    },
    {
        "id": 1490,
        "keyword": "offshore otec platform extreme sea-state 100-year storm wave heave acceleration telemetry",
        "slug": "offshore-otec-platform-extreme-sea-state-100-year-storm-wave-heave-acceleration-telemetry",
        "category": "Solutions",
        "hub_category": "Industrial Manufacturing",
        "target_persona": "Offshore Energy Directors & Deep-Sea Structural Marine Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Offshore OTEC Architecture Audit"
    }
]

def main():
    if not QUEUE_PATH.exists():
        raise FileNotFoundError(f"Missing queue file: {QUEUE_PATH}")

    data = json.loads(QUEUE_PATH.read_text(encoding="utf-8"))
    existing_ids = {item["id"] for item in data}

    added = 0
    for kw in KEYWORDS_WAVE32:
        if kw["id"] not in existing_ids:
            data.append(kw)
            added += 1

    QUEUE_PATH.write_text(json.dumps(data, indent=2), encoding="utf-8")
    print(f"✅ Ingested {added} new commercial keywords for Wave 32 into {QUEUE_PATH}")
    print(f"📊 Total queue size is now: {len(data)}")

if __name__ == "__main__":
    main()
