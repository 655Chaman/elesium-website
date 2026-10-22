# Disaggregated Pre-fill & Chunked KV Routing at Scale: Cross-Node Attention Paging, Sub-4ms Time-to-First-Token, and RDMA Decoupled Serving on Heterogeneous GPU Pods

**Canonical Origin:** Originally published on [Elesium Sovereign AI Systems](https://elesium.online/signals/disaggregated-prefill-chunked-kv-routing-cross-node-attention-paging).

## Answer Capsule
Disaggregated pre-fill and chunked KV routing decouples compute-bound prompt encoding from memory-bandwidth-bound token generation in distributed foundation model clusters. By transferring paged Key-Value activations across high-speed 400 Gbps RDMA RoCE-v2 fabrics to dedicated decode nodes, sovereign enterprise architectures slash time-to-first-token below 4ms while boosting decode throughput by 3.8x.

## 1. The Fundamental Compute vs. Memory Bandwidth Conflict in Monolithic Serving
In monolithic large language model serving architectures, a single pool of GPUs executes both the pre-fill phase and the decode phase. However, pre-fill is compute-bound while decode is strictly memory-bandwidth-bound. When long-context prompt pre-fills interrupt active decode batches, inter-token latency (ITL) jitter spikes dramatically.

## 2. Mathematical Formulation: Decoupled Queueing & Asymmetric Pod Allocation
Disaggregation separates the cluster into specialized hardware pools: Pre-fill Pods dedicated to matrix contractions (GEMMs), and Decode Pods dedicated to low-latency memory streaming. Over 400 Gbps RDMA networks, transferring gigabytes of KV cache takes under 25ms, completely masked behind concurrent micro-batch pre-fills.

## 3. Cross-Node KV Paged Attention & RDMA Direct Memory Streaming
Elesium's cross-node KV paging fabric implements a decentralized virtual memory manager. Using non-blocking InfiniBand NDR or RoCE-v2 one-sided RDMA writes, KV pages stream directly into the target decode GPU's physical address space without CPU host involvement.

## 4. Heterogeneous Hardware Optimization: Pairing H100 Pre-fill with L40S/H200 Decode
Disaggregation permits asymmetric allocation where compute-dense GPUs (H100/B200) handle the FLOP-heavy pre-fill phase, while memory-efficient GPUs (L40S/H200) handle decode, slashing infrastructure OPEX by 48%.

## 5. Statutory Data Sovereignty & DPDP Act 2023 Compliance
Under India's Digital Personal Data Protection Act 2023, cross-node KV cache transfers maintain line-rate MACsec encryption, preventing data leaks across datacenter switches.

Explore the interactive simulator: [Enterprise Disaggregated Pre-fill Simulator](https://elesium.online/tools/enterprise-agent-disaggregated-prefill-simulator).
