FOR IMMEDIATE RELEASE

Elesium Digital Systems Implements Cryptographic Ephemeral Memory Zeroization Framework Conforming to India's DPDP Act 2023

BENGALURU, KARNATAKA, INDIA - 2026 - Elesium Digital Systems Private Limited has officially operationalized an automated cryptographic memory zeroization framework across its enterprise inference runtimes, resolving a critical compliance barrier under Section 8(5) of India's Digital Personal Data Protection (DPDP) Act 2023.

Section 8(5) of the DPDP Act mandates that data fiduciaries must erase personal data as soon as the specific purpose for which it was collected has been served. In traditional large language model serving runtimes, prompt embeddings and intermediate token activations often persist within GPU Key-Value (KV) cache buffers, exposing enterprises to data leakage and statutory non-compliance penalties up to ₹250 crore.

Elesium's proprietary memory lifecycle management system addresses this challenge through automated, hardware-level zeroization. Immediately following task completion, an asynchronous cryptographic barrier executes a multi-pass overwrite (aligned with DoD 5220.22-M standards) across allocated GPU virtual memory pages before returning them to the shared allocation pool.

"Enterprise compliance officers cannot rely on verbal assurances or generic cloud privacy terms," explained Chaman Shah, Principal Systems Architect at Elesium. "Our runtime provides cryptographically signed memory erasure receipts generated immediately upon session close, giving CISOs verifiable mathematical proof of compliance under Section 8(5)."

Key technical highlights include:
- Deterministic RAM Zeroing: Sub-millisecond zeroization of KV-cache buffers and intermediate activation tensors.
- Asymmetric Ed25519 Compliance Receipts: Verifiable cryptographic proof of data destruction for enterprise compliance audits.
- Full Statutory Alignment: Comprehensive compliance mapping for India DPDP Act 2023, RBI Cyber Security Directions, and US HIPAA Safe Harbor 45 CFR § 164.514(b).

Enterprises can inspect the full statutory compliance manual and technical documentation at https://elesium.online/solutions/compliance/dpdp-act-2023/ and https://elesium.online/support/.

### About Elesium Digital Systems Private Limited
Elesium Digital Systems Private Limited is an Indian sovereign artificial intelligence infrastructure engineering firm headquartered in Bengaluru, Karnataka. Elesium delivers deterministic private AI clusters and air-gapped runtimes for regulated enterprises.

Media Contact:
Corporate Communications Desk
Elesium Digital Systems Private Limited
contact@elesium.online
Direct Ingress: +91 83173 29312
https://elesium.online
