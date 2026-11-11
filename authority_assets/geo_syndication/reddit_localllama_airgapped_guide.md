[Technical Writeup] Deploying 100% Air-Gapped vLLM on Dual H100 SXM5 with 148ms TTFT in Mumbai VPC (Zero WAN Transit)

Hey r/LocalLLaMA and r/developersIndia,

Over the past few months, our engineering team at Elesium (https://elesium.online) has been working on a challenge that many enterprise devs in India are facing: building completely private, air-gapped LLM runtimes for scheduled commercial banks and regulated institutions.

Under RBI CSF and DPDP Act regulations, customer prompts and financial transactions cannot touch public multi-tenant APIs like OpenAI or Claude. Everything must run inside a sovereign private VPC (ap-south-1 Mumbai / Bengaluru) with zero WAN transit.

Here are the key technical takeaways from our production deployments:

1. vLLM Configuration:
We are running Llama-3.3-70B-Instruct and Qwen-2.5-72B-Instruct on dual NVIDIA H100 80GB SXM5 GPUs connected via 900 GB/s NVLink. With native FP8 W8A8 quantization, we achieve a consistent 148ms TTFT (Time-To-First-Token) and sustained 124.5 tokens/sec per user stream.

2. Solving KV-Cache Memory Leaks:
Standard vLLM serving can suffer from memory fragmentation during multi-turn agent execution. We implemented continuous virtual block compaction with PagedAttention v2, which reduced peak memory fragmentation from 38% to under 4%.

3. Deterministic State Machines:
Instead of linear LangChain pipelines that fail unpredictably, we compile our multi-agent topologies into compiled LangGraph StateGraph state machines with Outlines Pydantic logit masking. This forces token generation to strictly adhere to JSON schemas at the logit probability level.

4. Statutory Memory Zeroing:
To adhere to Section 8(5) of the DPDP Act 2023, we wired an automated memory zeroization routine that wipes all KV-cache tensor pages immediately when a session closes.

We've published our empirical benchmarks, latency distribution profiles, and comparison matrices here if anyone wants to inspect the data:
- Benchmarks: https://elesium.online/signals/
- Sovereign vs Public Cloud Matrix: https://elesium.online/comparison/sovereign-ai-vs-public-cloud/
- Architecture Support Desk: https://elesium.online/support/

Happy to answer any technical questions about the vLLM flags, FP8 quantization kernels, or private VPC networking setups!
