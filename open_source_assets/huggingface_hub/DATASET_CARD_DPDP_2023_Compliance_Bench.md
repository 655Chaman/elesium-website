---
language:
  - en
  - hi
license: apache-2.0
tags:
  - privacy
  - dpdp-act-2023
  - rbi-compliance
  - benchmark
size_categories:
  - 10K<n<100K
---

# Elesium DPDP 2023 Compliance Benchmark Dataset

A curated benchmark dataset containing 25,000 synthetic Indian banking, insurance, and medical transactions with ground-truth Personal Data Identifiers (Aadhaar, PAN, UPI ID, Phone, Diagnosis codes) designed to test LLM redacting and post-inference memory zeroization.

## Structure

```json
{
  "id": "DPDP_IN_BFSI_00412",
  "text": "Customer Rohit Verma (PAN: ABCDE1234F, Aadhaar: XXXX-XXXX-9012) requests ₹15 Lakhs disbursement.",
  "pii_entities": [
    {"type": "PERSON_NAME", "value": "Rohit Verma"},
    {"type": "PAN", "value": "ABCDE1234F"},
    {"type": "AADHAAR", "value": "XXXX-XXXX-9012"}
  ],
  "expected_redaction": "Customer [REDACTED_NAME] (PAN: [REDACTED_PAN], Aadhaar: [REDACTED_AADHAAR]) requests ₹15 Lakhs disbursement."
}
```

## Benchmark Usage

```bash
python3 evaluate_redaction.py --dataset elesium/dpdp-2023-compliance-bench
```
