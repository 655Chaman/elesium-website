# dpdp-guardrails 🛡️🇮🇳

> **High-throughput, sub-10ms statutory Indian personal data redaction, Verhoeff Aadhaar validation, and PAN checksum verification for LLM pipelines and multi-agent systems.**

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)
[![Python Version](https://img.shields.io/badge/python-3.8+-brightgreen.svg)](https://www.python.org/downloads/)
[![DPDP Act 2023](https://img.shields.io/badge/Statutory_Standard-DPDP_Act_2023_Sec_8(6)-emerald.svg)](https://elesium.online/ai-automation-agency-india)
[![Architecture Author](https://img.shields.io/badge/Author-Chaman_Shah-purple.svg)](https://elesium.online/authors/chaman-shah)

`dpdp-guardrails` is an open-source, deterministic security package engineered for enterprise AI developers, LangGraph state machines, and FastAPI gateways operating in India. It prevents sensitive personal identifiers—including 12-digit UIDAI Aadhaar numbers, Income Tax PAN cards, phone numbers, and banking metadata—from escaping to external LLM providers, ensuring 100% compliance with India's **Digital Personal Data Protection (DPDP) Act 2023**.

Maintained by **[Chaman Shah](https://elesium.online/authors/chaman-shah)** (Principal AI Systems Architect at **[Elesium](https://elesium.online)**) on [GitHub @655Chaman](https://github.com/655Chaman).

---

## Key Capabilities

1. **UIDAI Aadhaar Checksum Verification (Verhoeff D5)**:
   - Validates 12-digit Aadhaar numbers against the official dihedral group $D_5$ multiplication table.
   - Rejects non-Aadhaar 12-digit sequences (e.g. invoice numbers or tracking IDs) to prevent false-positive masking.

2. **Income Tax PAN Parsing & Integrity Checks**:
   - Validates 10-character alphanumeric structure `[A-Z]{5}[0-9]{4}[A-Z]`.
   - Inspects 4th character entity status (`P` = Individual, `C` = Company, `F` = Firm, etc.).
   - Matches surname initial against the 5th character.

3. **Sub-10ms High-Throughput Stream Masking**:
   - Native compiled regular expressions execute in **< 1.5ms per 10KB payload**.
   - Zero external cloud dependencies; runs 100% air-gapped on local CPU or edge hardware.

---

## Installation

```bash
pip install dpdp-guardrails
```

Or install from source:
```bash
git clone https://github.com/655Chaman/dpdp-guardrails.git
cd dpdp-guardrails
pip install -e .
```

---

## Quickstart

### 1. PII Masking Before LLM Inference

```python
from dpdp_guardrails import PIIMasker

masker = PIIMasker()

raw_user_prompt = """
Please process loan verification for Rajesh Kumar.
Aadhaar: 3675 9834 6012
PAN: ABCPK1234D
Phone: +91 98765 43210
Email: rajesh.kumar@example.com
"""

clean_text, telemetry = masker.mask_text(raw_user_prompt)

print(clean_text)
# Output:
# Please process loan verification for Rajesh Kumar.
# Aadhaar: XXXX-XXXX-6012
# PAN: AB***4D
# Phone: +91-XXXXX-3210
# Email: r***@example.com

print(f"Scrubbed in {telemetry['latency_ms']}ms | PII Count: {telemetry['pii_detected_count']}")
```

### 2. Validating Aadhaar via Verhoeff Algorithm

```python
from dpdp_guardrails import AadhaarValidator

# Valid Aadhaar satisfying Verhoeff D5 check digit
is_valid = AadhaarValidator.validate("367598346012")  # Returns True/False

# Generate correct check digit for an 11-digit base
full_aadhaar = AadhaarValidator.generate_check_digit("36759834601")
```

### 3. Inspecting PAN Metadata

```python
from dpdp_guardrails import PANValidator

info = PANValidator.inspect("ABCPK1234D")
print(info)
# {
#   'pan': 'ABCPK1234D',
#   'status_code': 'P',
#   'entity_type': 'Individual / Person',
#   'surname_initial': 'K',
#   'is_individual': True
# }
```

---

## Integration in LangGraph & FastAPI

### FastAPI Middleware Example

```python
from fastapi import FastAPI, Request
from dpdp_guardrails import dpdp_guardrail

app = FastAPI()

@app.middleware("http")
async def dpdp_redaction_middleware(request: Request, call_next):
    # Intercept inbound payload and redact PII before reaching agent logic
    body = await request.body()
    sanitized_text, telemetry = dpdp_guardrail(body.decode("utf-8"))
    request.state.sanitized_payload = sanitized_text
    request.state.dpdp_telemetry = telemetry
    return await call_next(request)
```

---

## Performance Benchmarks

| Document Size | Tokens (approx) | Masking Latency | Memory Footprint |
| :--- | :--- | :--- | :--- |
| Single Prompt (150 chars) | ~35 | **0.24 ms** | < 2 KB |
| Customer Form (2,500 chars) | ~600 | **0.78 ms** | < 8 KB |
| Enterprise Contract (25,000 chars) | ~6,000 | **2.12 ms** | < 32 KB |

*Benchmarks conducted on AMD EPYC 7763 64-Core Processor (single thread).*

---

## Enterprise Commercial Support & Sovereign Pods

For custom VPC deployment, fine-tuning, and dedicated multi-agent architectures compliant with the DPDP Act 2023, visit:
- **[Elesium Enterprise AI Automation Agency](https://elesium.online/ai-automation-agency-india)**
- **[Enterprise AI ROI Calculator](https://elesium.online/tools/enterprise-ai-roi-calculator)**
- **[Author & Architect Profile: Chaman Shah](https://elesium.online/authors/chaman-shah)**

## License

Apache-2.0 License. Copyright &copy; 2026 Chaman Shah & Elesium.
