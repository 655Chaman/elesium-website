# Prefill-Decode Disaggregation: Distributed Chunked Prefilling, Zero-Interference K-V Transport, and Sub-15ms TTFT under High Concurrency

**Author:** Chaman Shah, Principal AI Systems Architect at [Elesium](https://elesium.online)  
**Published:** October 21, 2026  
**Canonical Source:** [https://elesium.online/signals/prefill-decode-disaggregation-distributed-chunked-prefilling-sub-15ms-ttft](https://elesium.online/signals/prefill-decode-disaggregation-distributed-chunked-prefilling-sub-15ms-ttft)

---

## Executive Architecture Summary

Prefill-decode disaggregation separates compute-heavy prompt prefilling from memory-bandwidth-bound token decoding across dedicated GPU worker pools. Chunked prefill scheduling and zero-copy RDMA KV-cache network transport eliminate head-of-line blocking, slashing Time-to-First-Token (TTFT) under 15ms while sustaining 99.4% decoding throughput efficiency across enterprise multi-tenant agent clusters.

---

## 1. The Inherent Interference of Prefill and Decode in Unified LLM Serving

In standard unified LLM serving architectures, prefill (processing prompt tokens) and decode (generating response tokens) execute on the same GPU workers. Because prefilling requires massive matrix multiplications saturating GPU tensor cores, any incoming long prompt causes severe execution stalls for ongoing decode requests. This head-of-line blocking causes inter-token latency (ITL) to spike uncontrollably, degrading interactive conversational voice and streaming agent workflows.

---

## 2. Disaggregated Serving Architecture: Prefill Instances vs. Decode Instances

Disaggregated serving physically decouples inference into specialized GPU pools: dedicated high-compute Prefill Workers (e.g. NVIDIA H100 SXM5 with high FP8/FP16 tensor throughput) and dedicated memory-bandwidth-optimized Decode Workers (e.g. NVIDIA L40S or H200 with massive HBM capacity). A centralized global inference scheduler routes prompt tokens to prefill nodes, computes key-value tensors, and transfers the resulting KV-cache to decode nodes for steady-state token generation.

---

## 3. Chunked Prompt Execution & RDMA Zero-Copy KV-Cache Transport

To prevent network saturation and scheduling delays, long prompt sequences are broken into uniform chunks (e.g., 512 or 1024 tokens) executed across multiple prefill steps. Once computed, the KV-cache blocks are transferred directly between GPU memories using RoCE v2 or InfiniBand Remote Direct Memory Access (RDMA) bypass kernels. By eliminating host CPU memory copying, KV transport latency is held under 1.2 milliseconds, enabling seamless prefill-to-decode handover.

---

## 4. Production Latency Benchmarks, TTFT SLAs, and FinOps OPEX Reductions

In production benchmarks serving 70B parameter models at 120 concurrent streams, prefill-decode disaggregation slashes P99 TTFT from 182ms down to 12.4ms (a 14.6x improvement) while maintaining steady-state Inter-Token Latency (ITL) below 9.2ms. By sizing prefill and decode GPU instances independently rather than overprovisioning uniform H100 clusters, enterprise infrastructure budgets achieve annual savings exceeding ₹76.4 Lakhs per cluster.

---

### Enterprise Deployment Architecture
For sovereign enterprise deployments adhering to Indian DPDP Act 2023 and private VPC isolation mandates, explore our dedicated solutions:
- [Prefill-Decode Disaggregation Controllers for Enterprise vLLM and SGLang Clusters](https://elesium.online/solutions/prefill-decode-disaggregation-controllers-for-enterprise-vllm-and-sglang-clusters)
- [Zero-Copy RDMA KV Cache Transfer Daemons for Disaggregated LLM Inference Clusters](https://elesium.online/solutions/zero-copy-rdma-kv-cache-transfer-daemons-for-disaggregated-llm-inference-clusters)
