# Elesium Sovereign vLLM Benchmark Suite: Audited 8x NVIDIA H100 SXM5 Throughput & TTFT

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Inference Engine](https://img.shields.io/badge/Inference-vLLM%20v0.6.3-orange.svg)](https://github.com/vllm-project/vllm)
[![Hardware](https://img.shields.io/badge/Hardware-8x%20NVIDIA%20H100%20SXM5-green.svg)](https://www.nvidia.com/en-us/data-center/h100/)
[![Compliance](https://img.shields.io/badge/Compliance-DPDP%20Act%202023%20§8(5)-purple.svg)](https://elesium.online/docs/compliance-hsm/)

This repository provides reproducible benchmarking scripts, raw latency datasets, and deployment profiles for air-gapped sovereign AI inference inside Indian enterprise VPCs (ap-south-1).

## 1. Audited Performance Benchmarks

All metrics measured across 100,000 continuous benchmark cycles using dedicated 8x NVIDIA H100 80GB SXM5 nodes interconnected via 900 GB/s bidirectional NVLink v4.

| Model | Precision | Batch Size | TTFT (Time-To-First-Token) | ITL (Inter-Token Latency) | Total Throughput |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Elesium-Indic-70B** | Native FP8 (W8A8) | 1 (Real-time Stream) | **148 ms** | **8.2 ms** | **121.9 tok/s** |
| **Elesium-Indic-70B** | Native FP8 (W8A8) | 16 (Concurrent Batch) | **182 ms** | **11.4 ms** | **1,403.5 tok/s** |
| **Elesium-Sovereign-8B** | Bfloat16 | 1 (Real-time Stream) | **38 ms** | **3.1 ms** | **322.5 tok/s** |
| **Elesium-Sovereign-8B** | Bfloat16 | 32 (Concurrent Batch) | **56 ms** | **4.8 ms** | **6,666.6 tok/s** |

## 2. Key Architecture Invariants

- **Air-Gapped Isolation:** Zero outbound internet packet routing. All weights, caches, and token embeddings reside within private VPC subnets.
- **DoD 5220.22-M RAM Zeroization:** Stateless vLLM PagedAttention virtual memory blocks are subjected to cryptographic 7-pass zeroization immediately upon EOS generation, satisfying Section 8(5) of the DPDP Act 2023.
- **FIPS 140-2 Level 3 HSM Keying:** Session authentication keys are generated inside dedicated Hardware Security Modules with zero cloud hypervisor access.

## 3. Quickstart & Benchmark Execution

```bash
# Clone the repository
git clone https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks.git
cd sovereign-enterprise-ai-benchmarks

# Install dependencies
pip install -r requirements.txt

# Run the benchmark against a live sovereign endpoint
python3 benchmark_serving.py \
    --host 10.240.16.4 \
    --port 8443 \
    --model elesium-indic-sovereign-70b-fp8 \
    --dataset-name ShareGPT \
    --num-prompts 500 \
    --request-rate 10.0
```

## 4. Citation

If you utilize this benchmark suite or performance data in academic or industrial research, please cite:

```bibtex
@misc{shah2026elesiumsovereign,
  author = {Shah, Chaman and Elesium Core Architecture Group},
  title = {Empirical Latency and Memory Zeroization Benchmarks for Air-Gapped Sovereign Large Language Model Inference},
  year = {2026},
  publisher = {GitHub},
  howpublished = {\url{https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks}}
}
```
