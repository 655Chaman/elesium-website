# Hacker News Show HN Submission Package

## Submission Details
* **Title:** Show HN: Sovereign AI Benchmarks – 121ms TTFT on 8x H100 SXM5 with vLLM FP8
* **URL:** https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks
* **Target Category:** Show HN
* **Author / Submitter Handle:** chaman_shah / elesium

---

## 1. Submission Body (Text Submission Variant)

We open-sourced our empirical latency benchmarks, KV-cache fragmentation telemetry, and production deployment configs for running sovereign 70B LLMs (Llama-3.3-70B FP8) on 8x NVIDIA H100 SXM5 clusters:

https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks

Research writeup & interactive charts: https://elesium.online/signals

### The Engineering Problem

Enterprise LLM deployments face two major infrastructure bottlenecks:

1. The Multi-Tenant Cloud Latency Penalty:
Public cloud endpoints (Azure OpenAI, AWS Bedrock) exhibit unpredictable Time-to-First-Token (TTFT), regularly exceeding 800ms–1,200ms due to public WAN transit, TLS negotiation, multi-tenant scheduling queues, and lack of prompt-chunking isolation. For real-time conversational agents, anything over 250ms is perceived as an awkward pause.

2. The KV-Cache Fragmentation Trap:
Standard PyTorch contiguous memory allocation pre-reserves static tensor buffers for maximum context windows (e.g., 8,192 tokens). In production workloads where queries average 1,000–2,000 tokens, 65% to 82% of allocated VRAM sits completely idle as internal fragmentation. As concurrent streams scale, this naive strategy triggers catastrophic CUDA Out-Of-Memory (OOM) crashes at concurrency 44.

### What We Did

We ran 100 empirical benchmark cycles comparing an air-gapped 8x H100 SXM5 node against public cloud APIs across prompt lengths from 512 to 8,192 tokens:

* Serving Stack: vLLM v0.6.4+ using Hopper FP8 W8A8 GEMM (cuBLASLt) and FP8 E4M3 KV cache.
* Memory Management: PagedAttention v2 with 16-token virtual memory blocks, eliminating external fragmentation and keeping total memory waste strictly under 3.8% at concurrency 128.
* Interconnect: NVLink 4.0 (900 GB/s bidirectional mesh) sustaining 12.4 µs AllReduce barrier latency, scaling throughput to 8,044 tokens/sec at TP=8.
* In-VPC Latency: Achieved 121.4ms TTFT on 2,048-token prompts with 0 bytes outbound internet egress, satisfying strict enterprise data sovereignty and residency requirements (e.g., DPDP Act 2023, RBI IT Governance).

All raw CSV datasets, Locust benchmark drivers, and production systemd/vLLM launch scripts are available under Apache-2.0.

We would love feedback, questions, and critique from the HN systems and ML engineering community.

---

## 2. Author's First Comment (Pinned Technical Context)

Hey HN,

I am Chaman Shah, lead author of this benchmark suite and systems architect at Elesium (https://elesium.online).

Over the last several months, we have been deploying LLMs for regulated enterprise clients (BFSI, healthcare, critical infrastructure). A recurring wall that engineering teams run into when migrating from prototypes to production is the "Cloud Latency Wall" and the "KV-Cache Memory Wall."

When measuring inference speed, teams often focus solely on generated tokens per second (decode speed). But for conversational systems, multi-step agent state graphs, and voice interfaces, Time-to-First-Token (TTFT) is the metric that dictates system viability.

Here is a summary of the empirical telemetry from our 100-cycle test runs:

  Model Architecture      Hardware / Enclave          Prompt   TTFT (ms)   ITL (ms)   P99 Jitter   WAN Egress
  ---------------------------------------------------------------------------------------------------------
  Llama-3.3-70B-FP8       8x H100 SXM5 (Private VPC)   2048     121.4 ms    12.1 ms     16.8 ms      0 Bytes
  DeepSeek-R1-FP8         8x H100 SXM5 (Private VPC)   2048     163.2 ms    17.2 ms     23.4 ms      0 Bytes
  GPT-4o (2024-11)        Azure OpenAI (Public WAN)    2048     812.5 ms    28.5 ms     78.4 ms      9,450 Bytes
  Claude 3.5 Sonnet       AWS Bedrock (Public WAN)     2048     920.8 ms    32.4 ms    102.1 ms      9,820 Bytes

Key Technical Decisions:

1. FP8 E4M3 vs. E5M2:
We specifically utilized FP8 E4M3 (1 sign bit, 4 exponent bits, 3 mantissa bits) for model weights and KV caching. E4M3 provides 3 bits of mantissa precision (resolution steps of ~0.125), keeping MMLU score degradation under 0.2% compared to unquantized BF16. E5M2 (which has only 2 mantissa bits) introduces unacceptable quantization noise on intermediate activation projections.

2. PagedAttention v2 vs. Naive Contiguous Allocation:
In our fragmentation tests, naive PyTorch allocation reserved 1.28 GB per 8k-token sequence upfront. At concurrency 44, the naive allocator demanded 81,400 MB of VRAM on an 80 GB card, of which 57,387 MB (70.5%) was completely wasted space from ungenerated tokens. The node suffered a hard CUDA OOM at concurrency 45.
PagedAttention v2 manages memory in 16-token non-contiguous physical pages. External fragmentation drops to zero, and internal fragmentation is bounded strictly to the final block of a sequence (< 16 tokens). Memory waste remained under 3.8% across 128 concurrent streams.

3. Chunked Prefill:
We enabled `--enable-chunked-prefill` with a max batched token limit of 8,192. This co-schedules compute-heavy prefill slices alongside active decode steps, preventing long prompts from starving active token streams and dropping P99 inter-token jitter to 16.8 ms.

4. NVLink 4.0 Mesh Fabric:
With Tensor Parallelism 8 (TP=8), all 8 GPUs perform an AllReduce at every attention and MLP block. On PCIe Gen5, this collective communication barrier becomes a massive bottleneck. On the SXM5 platform, NVLink 4.0 delivers 900 GB/s bidirectional bandwidth per accelerator, cutting AllReduce barrier latency to 12.4 µs and enabling 8,044.3 tokens/sec system throughput at batch size 128.

The repository includes:
- Raw benchmark CSVs (TTFT, tokens/sec, and KV fragmentation traces).
- Production vLLM launch scripts with NUMA affinity and NCCL ring buffer tuning.
- Deterministic LangGraph state machines backed by Redis MessagePack checkpoints.
- Production systemd unit configurations for air-gapped private VPC nodes.

Repo: https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks
Technical Signals: https://elesium.online/signals

Happy to answer any questions about the hardware setup, FP8 quantization trade-offs, NCCL tuning, or air-gapped VPC architecture!
