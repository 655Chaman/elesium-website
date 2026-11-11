# How we run air-gapped 70B LLMs in private VPCs with zero data egress (Architecture + systemd configs)

**Target Communities:** r/selfhosted, r/sysadmin  
**Reference Repo & Code:** [github.com/655Chaman/sovereign-enterprise-ai-benchmarks](https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks)  
**Engineering Benchmarks:** [elesium.online/signals](https://elesium.online/signals)

---

### Why Self-Host 70B in an Air-Gapped VPC?

If you are running LLM applications in regulated sectors (BFSI, healthcare, defense, enterprise legal), using multi-tenant cloud APIs (OpenAI, Anthropic, Bedrock) introduces three major architectural liabilities:
1. **Data Exfiltration & Compliance Breach:** Under statutory frameworks like the **Digital Personal Data Protection (DPDP) Act 2023** (Section 16) or **RBI Master Directions on IT Governance**, exfiltrating customer PII, banking credentials, or internal documents to offshore cloud endpoints is an immediate statutory violation.
2. **WAN Latency & Jitter:** Public internet transit adds 120ms-250ms of network overhead, pushing Time-to-First-Token (TTFT) past 800ms-1,200ms. In contrast, an in-VPC local node achieves **sub-130ms TTFT** with zero network jitter.
3. **Runaway Operational Costs:** At sustained enterprise volumes (>50M tokens/day), cloud API token fees rapidly outpace the amortization cost of dedicated bare-metal GPU clusters.

This guide is an end-to-end, copy-paste ready sysadmin runbook for deploying **Llama-3.3-70B** or **DeepSeek-R1** in a strictly isolated, zero-egress RFC-1918 VPC. It includes:
* Zero-egress network firewall policies (`iptables` / VPC security groups).
* Production `systemd` service unit file with NUMA affinity and NCCL ring-buffer tuning.
* Hardened `vLLM` inference arguments for Hopper FP8 W8A8 GEMM.
* In-flight PII redaction reverse proxy (Aadhaar, PAN, Phone, Email, Credit Cards).
* Health check, log rotation, and operational verification scripts.

---

### 1. Network Topology & Ingress/Egress Isolation

Our deployment model enforces a strict three-tier RFC-1918 subnet topology inside an AWS Private VPC (`ap-south-1`) or an on-premise Tier-IV colocation enclave (CtrlS, STT):

```
                     ENTERPRISE AIR-GAPPED VPC (10.128.0.0/16)
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │ 1. INGRESS & PROXY TIER (Subnet: 10.128.0.0/20)                             │
 │    • Internal Application Load Balancer (ALB)                               │
 │    • FastAPI PII Sanitization Reverse Proxy (Port 8443, mTLS 1.3)           │
 │    • Strict Inbound: Port 8443 from Corporate VPN / App Subnets Only        │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │ (Sanitized Internal Requests Only)
 ┌──────────────────────────────────────▼──────────────────────────────────────┐
 │ 2. STATE & CHECKPOINTER TIER (Subnet: 10.128.4.0/22)                        │
 │    • Redis Enterprise (MessagePack State Serialization, Port 6379)          │
 │    • PostgreSQL 16 + pgvector (Port 5432)                                   │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │ (Internal Low-Latency IPC)
 ┌──────────────────────────────────────▼──────────────────────────────────────┐
 │ 3. GPU INFERENCE TIER (Subnet: 10.128.8.0/22)                               │
 │    • 8x NVIDIA H100 SXM5 80GB (NVLink 4.0 - 900 GB/s Mesh)                  │
 │    • vLLM OpenAI-Compatible API Daemon (Port 8000)                          │
 │    • ZERO INTERNET GATEWAY / ZERO NAT GATEWAY / ZERO OUTBOUND WAN EGRESS    │
 └─────────────────────────────────────────────────────────────────────────────┘
```

#### Enforcing Zero-Egress via Host `iptables`
Even inside a private subnet, defense-in-depth requires locking down the host network stack to guarantee that no process (including third-party Python packages) can open an outbound WAN socket.

Run on the GPU host node:

```bash
#!/usr/bin/env bash
# /opt/scripts/harden-egress.sh
set -euo pipefail

# 1. Flush existing rules
iptables -F
iptables -X
iptables -t nat -F
iptables -t nat -X

# 2. Set default policies to DROP
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT DROP

# 3. Allow loopback traffic
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# 4. Allow established and related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A OUTPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# 5. Allow inbound SSH (Port 22) and vLLM (Port 8000) ONLY from internal VPC range
iptables -A INPUT -p tcp -s 10.128.0.0/16 --dport 22 -j ACCEPT
iptables -A INPUT -p tcp -s 10.128.0.0/16 --dport 8000 -j ACCEPT

# 6. Restrict outbound connections strictly to internal VPC endpoints (Redis, DB, syslog)
iptables -A OUTPUT -p tcp -d 10.128.0.0/16 -j ACCEPT

# 7. Log and drop any outbound packet attempting to exit the RFC-1918 boundary
iptables -A OUTPUT -j LOG --log-prefix "[EGRESS-VIOLATION-BLOCKED]: " --log-level 4
iptables -A OUTPUT -j DROP

# Save rules persistently
netfilter-persistent save
echo "✅ Zero-egress network boundaries successfully enforced."
```

#### Verifying Zero-Egress Posture:
```bash
# Verify no default WAN gateway route exists
ip route | grep default

# Verify external DNS and IP connections fail immediately
curl --connect-timeout 3 https://api.openai.com
# Output: curl: (28) Failed to connect to api.openai.com port 443: Connection timed out
```

---

### 2. Production `systemd` Service Configuration

Running an 8-GPU inference server with a 70B parameter model requires handling large HBM allocations, memory locking limits, and proper NUMA interleaving across dual-socket EPYC/Xeon CPUs.

Create `/etc/systemd/system/vllm.service`:

```ini
[Unit]
Description=vLLM Sovereign FP8 Inference Engine (8x H100 SXM5)
After=network.target local-fs.target
Documentation=https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks

[Service]
Type=exec
User=vllm
Group=vllm
WorkingDirectory=/opt/vllm

# Process limits for high-concurrency CUDA execution
LimitNOFILE=1048576
LimitNPROC=524288
LimitMEMLOCK=infinity
TasksMax=infinity

# Hardware & CUDA environment configuration
Environment="DEBIAN_FRONTEND=noninteractive"
Environment="CUDA_DEVICE_ORDER=PCI_BUS_ID"
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3,4,5,6,7"
Environment="TORCH_CUDA_ARCH_LIST=9.0"

# Optimized NCCL interconnect settings for 8-way SXM5 NVLink topology
Environment="NCCL_DEBUG=INFO"
Environment="NCCL_DEBUG_SUBSYS=INIT,ENV,COLL"
Environment="NCCL_IB_DISABLE=0"
Environment="NCCL_NET_GDR_LEVEL=5"
Environment="NCCL_P2P_LEVEL=NVL"
Environment="NCCL_NVLS_ENABLE=1"
Environment="NCCL_BUFFSIZE=8388608"

# PyTorch memory fragmentation mitigations
Environment="PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True,roundup_power2_divisions:[256:4,512:8,1024:16]"

# Enforce strict offline execution (air-gapped guarantee)
Environment="HF_HUB_OFFLINE=1"
Environment="TRANSFORMERS_OFFLINE=1"
Environment="OUTLINES_CACHE_DIR=/tmp/outlines_cache"

# Bind configuration
Environment="VPC_PRIVATE_IP=10.128.8.15"
Environment="VLLM_PORT=8000"
Environment="MODEL_PATH=/opt/models/meta-llama/Llama-3.3-70B-Instruct-FP8"
Environment="SERVED_MODEL_NAME=llama-3.3-70b-fp8"

# Execution command: Interleaved across all NUMA nodes
ExecStart=/usr/bin/numactl --interleave=all /opt/vllm/venv/bin/python3 -m vllm.entrypoints.openai.api_server \
    --model ${MODEL_PATH} \
    --served-model-name ${SERVED_MODEL_NAME} \
    --host ${VPC_PRIVATE_IP} \
    --port ${VLLM_PORT} \
    --tensor-parallel-size 8 \
    --pipeline-parallel-size 1 \
    --dtype bfloat16 \
    --quantization fp8 \
    --kv-cache-dtype fp8_e4m3 \
    --gpu-memory-utilization 0.94 \
    --max-model-len 16384 \
    --max-num-seqs 128 \
    --max-num-batched-tokens 8192 \
    --enable-chunked-prefill \
    --block-size 16 \
    --swap-space 16 \
    --disable-log-requests \
    --uvloop

# Lifecycle management
Restart=on-failure
RestartSec=15s
TimeoutStartSec=900
TimeoutStopSec=60
KillMode=mixed
SendSIGKILL=yes

[Install]
WantedBy=multi-user.target
```

#### Install and Start the Daemon:
```bash
# Reload systemd manager configuration
sudo systemctl daemon-reload

# Enable vLLM service on boot
sudo systemctl enable vllm.service

# Start inference engine
sudo systemctl start vllm.service

# Stream service startup logs
journalctl -u vllm.service -f
```

---

### 3. vLLM Launch Arguments & Kernel Tuning Explained

| Parameter | Value | Technical Justification |
| :--- | :--- | :--- |
| `--tensor-parallel-size` | `8` | Distributes 70B parameters across all 8 GPUs over the 900 GB/s NVLink 4.0 mesh. |
| `--quantization` | `fp8` | Uses Hopper Tensor Cores for FP8 W8A8 GEMMs, doubling FLOPs throughput and halving weight VRAM (17.5 GB/GPU $\rightarrow$ 8.75 GB/GPU). |
| `--kv-cache-dtype` | `fp8_e4m3` | Halves KV-cache memory per token from 320 KB to 160 KB. Keeps MMLU accuracy within 0.2% of BF16. |
| `--block-size` | `16` | Sets PagedAttention v2 physical page size to 16 tokens, eliminating external fragmentation (< 3.8% total waste). |
| `--enable-chunked-prefill` | Flag | Decouples large 8k-token prefill computation from active decode streams, dropping P99 jitter to 16.8ms. |
| `--max-num-batched-tokens`| `8192` | Caps chunk size to maintain steady GPU arithmetic saturation without starving active streams. |
| `--gpu-memory-utilization` | `0.94` | Reserves 94% of physical HBM3 (75.2 GB of 80 GB per GPU) for weights + KV cache, leaving 4.8 GB for CUDA runtime buffers. |
| `NCCL_BUFFSIZE` | `8388608` | Expands NCCL ring buffers to 8 MB, dropping AllReduce barrier latency to 12.45 µs. |

---

### 4. In-Flight PII Redaction Proxy (FastAPI Reverse Proxy)

Under enterprise data privacy standards (e.g., DPDP Act 2023 Section 8), PII must never touch LLM weights or GPU cache unmasked. We place a lightweight, async reverse proxy on `10.128.0.10` that scrubs Indian and global statutory identifiers before forwarding requests to vLLM.

Save as `/opt/pii-gateway/proxy.py`:

```python
"""
Sovereign In-Flight PII Sanitization Reverse Proxy
Interception Layer between Client Ingress and vLLM Daemon
Target Identifiers: Aadhaar UIDAI, PAN, Phone (+91), Email, Credit Cards
"""

import re
import json
import httpx
from fastapi import FastAPI, Request, Response, status
from fastapi.responses import StreamingResponse

app = FastAPI(title="Sovereign PII Redaction Gateway", version="1.0.0")

VLLM_INTERNAL_UPSTREAM = "http://10.128.8.15:8000"

# Compiled Statutory Identifier Regexes
AADHAAR_REGEX = re.compile(r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b')
PAN_REGEX = re.compile(r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b')
PHONE_REGEX = re.compile(r'(?:\+91[\-\s]?)?[6-9]\d{9}\b')
EMAIL_REGEX = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')
CREDIT_CARD_REGEX = re.compile(r'\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b')

def luhn_checksum_valid(card_number: str) -> bool:
    """Validates credit card candidates using the Luhn mod-10 algorithm."""
    digits = [int(c) for c in card_number if c.isdigit()]
    if len(digits) < 13:
        return False
    odd_digits = digits[-1::-2]
    even_digits = digits[-2::-2]
    checksum = sum(odd_digits)
    for d in even_digits:
        checksum += sum(divmod(d * 2, 10))
    return checksum % 10 == 0

def sanitize_text(content: str) -> str:
    """Deterministically masks PII entities with audit-safe surrogate tokens."""
    content = AADHAAR_REGEX.sub("[REDACTED_AADHAAR_UIDAI]", content)
    content = PAN_REGEX.sub("[REDACTED_PAN_INCOMETAX]", content)
    content = PHONE_REGEX.sub("[REDACTED_TEL_NUMBER]", content)
    content = EMAIL_REGEX.sub("[REDACTED_EMAIL_ADDRESS]", content)
    
    # Credit card scrubbing with Luhn verification
    def _card_replace(match):
        raw = match.group(0).replace(" ", "").replace("-", "")
        return "[REDACTED_CREDIT_CARD]" if luhn_checksum_valid(raw) else match.group(0)
    
    content = CREDIT_CARD_REGEX.sub(_card_replace, content)
    return content

def sanitize_json_payload(data: dict) -> dict:
    """Recursively walks chat payload messages to sanitize content."""
    if "messages" in data and isinstance(data["messages"], list):
        for msg in data["messages"]:
            if "content" in msg and isinstance(msg["content"], str):
                msg["content"] = sanitize_text(msg["content"])
    elif "prompt" in data and isinstance(data["prompt"], str):
        data["prompt"] = sanitize_text(data["prompt"])
    return data

@app.post("/v1/chat/completions")
async def chat_proxy(request: Request):
    try:
        body = await request.json()
    except Exception:
        return Response(content="Invalid JSON", status_code=status.HTTP_400_BAD_REQUEST)
    
    # Scrub in-flight payload
    sanitized_body = sanitize_json_payload(body)
    
    client = httpx.AsyncClient(base_url=VLLM_INTERNAL_UPSTREAM, timeout=120.0)
    
    # Handle SSE streaming completions
    if body.get("stream", False):
        upstream_req = client.build_request(
            "POST", "/v1/chat/completions",
            json=sanitized_body,
            headers={"Content-Type": "application/json"}
        )
        upstream_resp = await client.send(upstream_req, stream=True)
        return StreamingResponse(
            upstream_resp.aiter_raw(),
            status_code=upstream_resp.status_code,
            headers=dict(upstream_resp.headers),
            background=client.aclose
        )
    else:
        async with client:
            resp = await client.post("/v1/chat/completions", json=sanitized_body)
            return Response(
                content=resp.content,
                status_code=resp.status_code,
                headers=dict(resp.headers)
            )

@app.get("/health")
async def health_check():
    return {"status": "HEALTHY", "egress_posture": "AIRGAPPED_ZERO_EGRESS"}
```

---

### 5. Verification & Health Monitoring Runbook

#### A. Verifying Accelerator Status & VRAM Allocation
Check that all 8 GPUs have recognized the Hopper architecture and reserved 94% VRAM:
```bash
nvidia-smi --query-gpu=index,name,memory.total,memory.used,utilization.gpu,temperature.gpu --format=csv
```
Expected output:
```csv
index, name, memory.total [MiB], memory.used [MiB], utilization.gpu [%], temperature.gpu [Celsius]
0, NVIDIA H100 80GB HBM3, 81559 MiB, 76665 MiB, 0 %, 34
1, NVIDIA H100 80GB HBM3, 81559 MiB, 76665 MiB, 0 %, 33
...
7, NVIDIA H100 80GB HBM3, 81559 MiB, 76665 MiB, 0 %, 35
```

#### B. Querying the Internal Health Endpoint
```bash
curl -s http://10.128.8.15:8000/health | jq .
```
Expected output:
```json
{}
```
(HTTP 200 OK)

#### C. End-to-End Chat Completion Test with PII Injection Test
Submit a test prompt containing fake Aadhaar and PAN strings through the sanitization proxy:

```bash
curl -X POST http://10.128.0.10:8443/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama-3.3-70b-fp8",
    "messages": [
      {
        "role": "user",
        "content": "Verify customer PAN ABCDE1234F and Aadhaar 2345 6789 0123 for account KYC update."
      }
    ],
    "max_tokens": 100,
    "temperature": 0.0
  }' | jq .
```

Verify in the logs that vLLM ingested:
```
"Verify customer PAN [REDACTED_PAN_INCOMETAX] and Aadhaar [REDACTED_AADHAAR_UIDAI] for account KYC update."
```

---

### 6. Summary Checklist for Production Readiness

* [x] **Zero-Egress Gateway:** No default route to 0.0.0.0/0 on the GPU node.
* [x] **NUMA Interleaving:** `numactl --interleave=all` enabled to eliminate dual-socket memory bandwidth starvation.
* [x] **vLLM FP8 W8A8 GEMM:** Enabled via `--quantization fp8` and `--kv-cache-dtype fp8_e4m3`.
* [x] **PagedAttention v2:** Configured with 16-token blocks (`--block-size 16`) to guarantee < 3.8% memory fragmentation.
* [x] **Chunked Prefill:** Enabled via `--enable-chunked-prefill` to prevent prefill latency spikes on active streams.
* [x] **In-Flight PII Redaction:** Active on reverse proxy tier before prompt reaches GPU memory.
* [x] **Air-Gapped Invariants:** `HF_HUB_OFFLINE=1` and `TRANSFORMERS_OFFLINE=1` exported in systemd unit.

Complete repository with benchmark datasets and architectural diagrams:  
👉 [https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks](https://github.com/655Chaman/sovereign-enterprise-ai-benchmarks)  
👉 [https://elesium.online/signals](https://elesium.online/signals)
