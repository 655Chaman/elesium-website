#!/usr/bin/env python3
"""
Ingests Wave 35 commercial keywords (IDs 1,591 to 1,640, 50 solutions)
into automation/compact_keywords_queue.json.
Adheres strictly to the Edward Sturm B2B plural persona format and Moz score 97 target.
"""

import json
from pathlib import Path

ROOT = Path("/Users/krdeeksha/ELESIUM WEBSITE")
QUEUE_PATH = ROOT / "automation" / "compact_keywords_queue.json"

KEYWORDS_WAVE35 = [
    # Cluster 1: Hardware Security Module (HSM) PKCS#11 & FIPS 140-3 Cryptographic Key Management (IDs 1591-1607, 17 items)
    {
        "id": 1591,
        "keyword": "hardware security module pkcs11 air-gapped cryptographic key derivation telemetry for autonomous agents",
        "slug": "hardware-security-module-pkcs11-air-gapped-cryptographic-key-derivation-telemetry-for-autonomous-agents",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1592,
        "keyword": "fips 140-3 level 4 active physical zeroization tamper envelope telemetry for banking security modules",
        "slug": "fips-140-3-level-4-active-physical-zeroization-tamper-envelope-telemetry-for-banking-security-modules",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1593,
        "keyword": "differential power analysis dpa side-channel attack attenuation telemetry for cryptographic coprocessors",
        "slug": "differential-power-analysis-dpa-side-channel-attack-attenuation-telemetry-for-cryptographic-coprocessors",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1594,
        "keyword": "post-quantum ml-kem-768 lattice key encapsulation mechanism telemetry for enterprise hsm modules",
        "slug": "post-quantum-ml-kem-768-lattice-key-encapsulation-mechanism-telemetry-for-enterprise-hsm-modules",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1595,
        "keyword": "rfc 5869 hkdf-sha512 streaming ephemeral tokenization latency telemetry for sovereign agent vaults",
        "slug": "rfc-5869-hkdf-sha512-streaming-ephemeral-tokenization-latency-telemetry-for-sovereign-agent-vaults",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1596,
        "keyword": "argon2id memory-hardened master key derivation side-channel immunity telemetry for confidential agents",
        "slug": "argon2id-memory-hardened-master-key-derivation-side-channel-immunity-telemetry-for-confidential-agents",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1597,
        "keyword": "dpdp act 2023 section 8 statutory personal data tokenization hardware telemetry for data fiduciaries",
        "slug": "dpdp-act-2023-section-8-statutory-personal-data-tokenization-hardware-telemetry-for-data-fiduciaries",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1598,
        "keyword": "rbi cyber security framework categorized air-gapped core banking hsm telemetry for payment processors",
        "slug": "rbi-cyber-security-framework-categorized-air-gapped-core-banking-hsm-telemetry-for-payment-processors",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1599,
        "keyword": "pci-dss v4 req 3-5 dual-control split-knowledge cryptographic key management telemetry for fintech agents",
        "slug": "pci-dss-v4-req-3-5-dual-control-split-knowledge-cryptographic-key-management-telemetry-for-fintech-agents",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1600,
        "keyword": "pcie cryptoki hardware bus latency and pipelined session arbitration telemetry for enterprise hsms",
        "slug": "pcie-cryptoki-hardware-bus-latency-and-pipelined-session-arbitration-telemetry-for-enterprise-hsms",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1601,
        "keyword": "true random number generator trng continuous entropy health monitoring telemetry for sovereign crypto enclaves",
        "slug": "true-random-number-generator-trng-continuous-entropy-health-monitoring-telemetry-for-sovereign-crypto-enclaves",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1602,
        "keyword": "physically unclonable function puf silicon biometric key reconstruction telemetry for hardened security modules",
        "slug": "physically-unclonable-function-puf-silicon-biometric-key-reconstruction-telemetry-for-hardened-security-modules",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1603,
        "keyword": "ecdsa secp256k1 projective point blinding side-channel resistance telemetry for autonomous transaction signers",
        "slug": "ecdsa-secp256k1-projective-point-blinding-side-channel-resistance-telemetry-for-autonomous-transaction-signers",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1604,
        "keyword": "common criteria eal6 plus formally verified microcode security telemetry for government air-gapped vaults",
        "slug": "common-criteria-eal6-plus-formally-verified-microcode-security-telemetry-for-government-air-gapped-vaults",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1605,
        "keyword": "environmental failure protection efp voltage and thermal spike zeroization telemetry for secure cryptoprocessors",
        "slug": "environmental-failure-protection-efp-voltage-and-thermal-spike-zeroization-telemetry-for-secure-cryptoprocessors",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1606,
        "keyword": "aes-256-gcm authenticated tag verification hardware coprocessor throughput telemetry for sovereign agents",
        "slug": "aes-256-gcm-authenticated-tag-verification-hardware-coprocessor-throughput-telemetry-for-sovereign-agents",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },
    {
        "id": 1607,
        "keyword": "air-gapped cryptographic root-of-trust cold-boot bus interposer mitigation telemetry for enterprise AI",
        "slug": "air-gapped-cryptographic-root-of-trust-cold-boot-bus-interposer-mitigation-telemetry-for-enterprise-ai",
        "category": "Solutions",
        "hub_category": "Cybersecurity & Zero-Trust",
        "target_persona": "Enterprise Cryptographic Architects & Chief Information Security Officers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule Cryptographic HSM Architecture Audit"
    },

    # Cluster 2: Open-Source On-Premise LLM Inference & vLLM PagedAttention Telemetry (IDs 1608-1624, 17 items)
    {
        "id": 1608,
        "keyword": "vllm pagedattention non-contiguous physical memory kv cache fragmentation telemetry for on-premise clusters",
        "slug": "vllm-pagedattention-non-contiguous-physical-memory-kv-cache-fragmentation-telemetry-for-on-premise-clusters",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1609,
        "keyword": "tensor parallel inter-gpu nvlink collective communication all-reduce latency telemetry for llama-70b inference",
        "slug": "tensor-parallel-inter-gpu-nvlink-collective-communication-all-reduce-latency-telemetry-for-llama-70b-inference",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1610,
        "keyword": "continuous dynamic iteration-level batching queue scheduling telemetry for private enterprise vllm engines",
        "slug": "continuous-dynamic-iteration-level-batching-queue-scheduling-telemetry-for-private-enterprise-vllm-engines",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1611,
        "keyword": "flashinfer fused multi-head attention kernel cuda compute efficiency telemetry for on-premise generative AI",
        "slug": "flashinfer-fused-multi-head-attention-kernel-cuda-compute-efficiency-telemetry-for-on-premise-generative-ai",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1612,
        "keyword": "awq 4-bit activation-aware weight quantization perplexity preservation telemetry for local mistral models",
        "slug": "awq-4-bit-activation-aware-weight-quantization-perplexity-preservation-telemetry-for-local-mistral-models",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1613,
        "keyword": "fp8 e4m3 mixed-precision matrix multiplication tensor core saturation telemetry for hopper h100 inference",
        "slug": "fp8-e4m3-mixed-precision-matrix-multiplication-tensor-core-saturation-telemetry-for-hopper-h100-inference",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1614,
        "keyword": "time to first token ttft prompt prefill latency arbitration telemetry for air-gapped legal llm deployments",
        "slug": "time-to-first-token-ttft-prompt-prefill-latency-arbitration-telemetry-for-air-gapped-legal-llm-deployments",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1615,
        "keyword": "inter-token generation time itgt decode memory bandwidth saturation telemetry for enterprise code models",
        "slug": "inter-token-generation-time-itgt-decode-memory-bandwidth-saturation-telemetry-for-enterprise-code-models",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1616,
        "keyword": "prefix caching and multi-turn conversational prompt reuse efficiency telemetry for customer support agents",
        "slug": "prefix-caching-and-multi-turn-conversational-prompt-reuse-efficiency-telemetry-for-customer-support-agents",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1617,
        "keyword": "speculative decoding draft model verification acceptance rate telemetry for on-premise deepseek-v2 inference",
        "slug": "speculative-decoding-draft-model-verification-acceptance-rate-telemetry-for-on-premise-deepseek-v2-inference",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1618,
        "keyword": "rotary position embedding rope long-context extrapolation perplexity telemetry for 128k context llm servers",
        "slug": "rotary-position-embedding-rope-long-context-extrapolation-perplexity-telemetry-for-128k-context-llm-servers",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1619,
        "keyword": "chunked prefill and decode execution interleaving latency jitter mitigation telemetry for vllm clusters",
        "slug": "chunked-prefill-and-decode-execution-interleaving-latency-jitter-mitigation-telemetry-for-vllm-clusters",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1620,
        "keyword": "pipeline parallel bubble overhead and cross-node infiniband telemetry for 405b parameter foundation models",
        "slug": "pipeline-parallel-bubble-overhead-and-cross-node-infiniband-telemetry-for-405b-parameter-foundation-models",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1621,
        "keyword": "gpu hbm3 high bandwidth memory thermal throttling and power cap telemetry for dense inference racks",
        "slug": "gpu-hbm3-high-bandwidth-memory-thermal-throttling-and-power-cap-telemetry-for-dense-inference-racks",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1622,
        "keyword": "guidance grammars and constrained json output schema enforcement overhead telemetry for local function calling",
        "slug": "guidance-grammars-and-constrained-json-output-schema-enforcement-overhead-telemetry-for-local-function-calling",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1623,
        "keyword": "triton custom decode kernel register pressure and sm occupancy telemetry for sovereign on-premise llms",
        "slug": "triton-custom-decode-kernel-register-pressure-and-sm-occupancy-telemetry-for-sovereign-on-premise-llms",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },
    {
        "id": 1624,
        "keyword": "open-source vllm kubernetes ray cluster autoscaling and cold-start latency telemetry for private vpc AI",
        "slug": "open-source-vllm-kubernetes-ray-cluster-autoscaling-and-cold-start-latency-telemetry-for-private-vpc-ai",
        "category": "Solutions",
        "hub_category": "Enterprise Architecture",
        "target_persona": "Enterprise AI Infrastructure Directors & Large Language Model Operations Engineers",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule On-Premise LLM Inference Audit"
    },

    # Cluster 3: AI Document Processing & GST Tax Invoice Telemetry (IDs 1625-1640, 16 items)
    {
        "id": 1625,
        "keyword": "autonomous gst tax invoice irn invoice reference number extraction telemetry for enterprise sap erp",
        "slug": "autonomous-gst-tax-invoice-irn-invoice-reference-number-extraction-telemetry-for-enterprise-sap-erp",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1626,
        "keyword": "hsn code classification and gst slab rate optical recognition confidence telemetry for accounts payable",
        "slug": "hsn-code-classification-and-gst-slab-rate-optical-recognition-confidence-telemetry-for-accounts-payable",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1627,
        "keyword": "gstr-2b automatic input tax credit itc reconciliation mismatch resolution telemetry for corporate tax teams",
        "slug": "gstr-2b-automatic-input-tax-credit-itc-reconciliation-mismatch-resolution-telemetry-for-corporate-tax-teams",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1628,
        "keyword": "b2b e-way bill qr code cryptographic signature verification latency telemetry for logistics clearing agents",
        "slug": "b2b-e-way-bill-qr-code-cryptographic-signature-verification-latency-telemetry-for-logistics-clearing-agents",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1629,
        "keyword": "multi-page tabular line-item bounding box coordinates extraction telemetry for complex industrial invoices",
        "slug": "multi-page-tabular-line-item-bounding-box-coordinates-extraction-telemetry-for-complex-industrial-invoices",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1630,
        "keyword": "supplier gstin checksum validation and suspended registration detection telemetry for automated vendor portals",
        "slug": "supplier-gstin-checksum-validation-and-suspended-registration-detection-telemetry-for-automated-vendor-portals",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1631,
        "keyword": "reverse charge mechanism rcm identification and tax liability routing telemetry for enterprise finance",
        "slug": "reverse-charge-mechanism-rcm-identification-and-tax-liability-routing-telemetry-for-enterprise-finance",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1632,
        "keyword": "debit note and credit note reconciliation with original tax invoice telemetry for sap s4hana workflows",
        "slug": "debit-note-and-credit-note-reconciliation-with-original-tax-invoice-telemetry-for-sap-s4hana-workflows",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1633,
        "keyword": "optical character recognition ocr degradation handling for thermal print transport bills and warehouse receipts",
        "slug": "optical-character-recognition-ocr-degradation-handling-for-thermal-print-transport-bills-and-warehouse-receipts",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1634,
        "keyword": "statutory withholding tax tds section 194q automated deduction validation telemetry for high-value procurement",
        "slug": "statutory-withholding-tax-tds-section-194q-automated-deduction-validation-telemetry-for-high-value-procurement",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1635,
        "keyword": "inter-state igst vs intra-state cgst sgst place of supply determination telemetry for autonomous erp agents",
        "slug": "inter-state-igst-vs-intra-state-cgst-sgst-place-of-supply-determination-telemetry-for-autonomous-erp-agents",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1636,
        "keyword": "three-way invoice purchase order goods receipt po-grn matching tolerance telemetry for enterprise sap",
        "slug": "three-way-invoice-purchase-order-goods-receipt-po-grn-matching-tolerance-telemetry-for-enterprise-sap",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1637,
        "keyword": "sez special economic zone zero-rated supply bond and lut declaration extraction telemetry for exporters",
        "slug": "sez-special-economic-zone-zero-rated-supply-bond-and-lut-declaration-extraction-telemetry-for-exporters",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1638,
        "keyword": "e-invoicing json schema v1-04 compliance and digital signature extraction telemetry for tax audit readiness",
        "slug": "e-invoicing-json-schema-v1-04-compliance-and-digital-signature-extraction-telemetry-for-tax-audit-readiness",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1639,
        "keyword": "duplicate invoice number detection and hash-fingerprint collision defense telemetry for high-volume billing",
        "slug": "duplicate-invoice-number-detection-and-hash-fingerprint-collision-defense-telemetry-for-high-volume-billing",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
    },
    {
        "id": 1640,
        "keyword": "automated gst audit trail generation and section 16 eligibility verification telemetry for corporate fiduciaries",
        "slug": "automated-gst-audit-trail-generation-and-section-16-eligibility-verification-telemetry-for-corporate-fiduciaries",
        "category": "Solutions",
        "hub_category": "BFSI & FinTech Engineering",
        "target_persona": "Corporate Tax Controllers & Enterprise Financial Systems Directors",
        "intent": "High-Lever BOFU",
        "search_volume_tier": "Low-Competition (0-50)",
        "moz_target_score": 97,
        "status": "PENDING",
        "primary_cta": "Schedule GST Invoice Processing Audit"
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
    for kw in KEYWORDS_WAVE35:
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
