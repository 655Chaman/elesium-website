---
language:
  - en
  - hi
  - te
  - ta
  - bn
  - mr
license: apache-2.0
tags:
  - sovereign-ai
  - indic-nlp
  - fp8
  - vllm
  - rbi-compliance
  - dpdp-act-2023
datasets:
  - elesium/dpdp-2023-compliance-bench
metrics:
  - latency
  - throughput
  - zero-retention-compliance
---

# Elesium-Indic-Sovereign-70B-FP8

Elesium-Indic-Sovereign-70B-FP8 is a specialized, 70-billion parameter language model quantized to native FP8 (W8A8) for air-gapped deployment in Indian banking (BFSI), defense, and healthcare infrastructure.

## Model Summary

- **Architecture:** Transformer Decoder with Grouped-Query Attention (GQA)
- **Parameters:** 70 Billion
- **Quantization:** FP8 (W8A8 GEMM) optimized for NVIDIA Hopper (H100/H200)
- **Supported Languages:** Hindi, Tamil, Telugu, Marathi, Bengali, English
- **Compliance Certification:** RBI CSF Annex II & DPDP Act 2023 Section 8(5)

## Deployment via vLLM

```python
from vllm import LLM, SamplingParams

llm = LLM(
    model="elesium/elesium-indic-sovereign-70b-fp8",
    tensor_parallel_size=8,
    gpu_memory_utilization=0.95,
    enforce_eager=True
)

prompts = ["Explain RBI Cyber Security Framework requirements for core banking AI."]
sampling_params = SamplingParams(temperature=0.0, max_tokens=256)
outputs = llm.generate(prompts, sampling_params)

for output in outputs:
    print(output.outputs[0].text)
```

## Latency Profile (8x H100 SXM5)

- **TTFT (Batch 1):** 148 ms
- **Throughput (Batch 16):** 1,403.5 tokens/second
- **Inter-GPU Bandwidth:** 900 GB/s via NVLink v4
