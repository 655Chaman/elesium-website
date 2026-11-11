#!/usr/bin/env python3
"""
================================================================================
GENERATE MUTUAL NDA (MODULE 13) - INSTITUTIONAL B2B CONFIDENTIALITY ENCLAVE
================================================================================
Classification: Enterprise Legal Automation & Mutual Non-Disclosure Generator
Governing Law: Indian Contract Act, 1872 (Exclusive Jurisdiction of Bengaluru)
Statutory Data Protection: Digital Personal Data Protection (DPDP) Act, 2023 Section 8(5)
Purpose:
  Provides instant client-side and server-side executable Mutual Non-Disclosure
  Agreements pre-filled with client legal entity details and Elesium Digital Systems Private Limited.
================================================================================
"""

import sys
from pathlib import Path
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).resolve().parent.parent
PUBLIC_LEGAL_DIR = ROOT_DIR / "frontend" / "public" / "legal"
DIST_LEGAL_DIR = ROOT_DIR / "frontend" / "dist" / "legal"

NDA_TEMPLATE = """# MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

**EFFECTIVE DATE**: {effective_date}  
**GOVERNING LAW**: Indian Contract Act, 1872 (Courts of Bengaluru, Karnataka)  
**STATUTORY COMPLIANCE**: DPDP Act 2023 (Section 8(5) - Digital Personal Data Protection Act, 2023)  

---

### PARTIES:

1. **ELESIUM DIGITAL SYSTEMS PRIVATE LIMITED**, a private company incorporated under the Companies Act, 2013, having its corporate engineering headquarters at Koramangala 4th Block, Bengaluru, Karnataka 560034, India (hereinafter referred to as "**Elesium**", which expression shall include its successors and permitted assigns); and

2. **{client_company_name}**, a corporate entity having its principal office at {client_address} (hereinafter referred to as the "**Company**", which expression shall include its successors and permitted assigns).

(Elesium and the Company are collectively referred to as the "**Parties**" and individually as a "**Party**".)

---

### 1. PURPOSE
The Parties intend to enter into confidential technical and commercial discussions concerning enterprise AI architecture audits, autonomous multi-agent workflow systems, private VPC large language model deployments, and system integrations across SAP S/4HANA, Oracle ERP, and internal databases (the "**Purpose**").

### 2. CONFIDENTIAL INFORMATION
"Confidential Information" means all non-public technical, business, architectural, financial, prompt engineering, vector database schemas, and source code data disclosed by either Party to the other, whether orally, in writing, electronically, or through system access.

### 3. STATUTORY SOVEREIGN DATA PROTECTION (DPDP ACT 2023)
Pursuant to Section 8(5) of India's Digital Personal Data Protection Act, 2023:
- **Zero External Retention**: Elesium certifies that all LLM inference and automated multi-agent workflows executed during scoping, architecture pilots, and production runtimes shall execute within client-controlled sovereign private VPC enclaves (AWS us-east-1, Mumbai ap-south-1, Frankfurt eu-central-1) or air-gapped on-premises hardware.
- **Immediate Erasure**: No customer proprietary data, personal data, or system prompt bytes shall be retained, cached, or utilized for foundation model training by third-party providers.

### 4. OBLIGATIONS OF RECEIVING PARTY
The Receiving Party agrees to:
a. Hold all Confidential Information in strict confidence using no less than a reasonable degree of care;
b. Restrict access solely to employees, contractors, and legal advisors with a legitimate need to know;
c. Not reverse engineer, decompile, or exfiltrate proprietary weights or agentic stategraphs;
d. Promptly return or cryptographically destroy all Confidential Information upon written request.

### 5. TERM AND TERMINATION
This Agreement shall remain in effect for three (3) years from the Effective Date. The obligations of confidentiality regarding trade secrets, source code, and statutory private data shall survive in perpetuity.

### 6. DISPUTE RESOLUTION AND JURISDICTION
This Agreement is governed by the laws of India. Any dispute arising out of or in connection with this Agreement shall be referred to arbitration in Bengaluru under the Arbitration and Conciliation Act, 1996. The Courts in Bengaluru, Karnataka, shall have exclusive jurisdiction.

---

### IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement:

**For ELESIUM DIGITAL SYSTEMS PRIVATE LIMITED**:  
Signature: *Chaman Shah*  
Name: Chaman Shah  
Title: Founder & Principal Systems Architect  
Date: {effective_date}  

**For {client_company_name}**:  
Signature: _____________________________________  
Name: {client_signatory_name}  
Title: {client_signatory_title}  
Date: {effective_date}  
"""

def generate_nda_assets():
    PUBLIC_LEGAL_DIR.mkdir(parents=True, exist_ok=True)
    DIST_LEGAL_DIR.mkdir(parents=True, exist_ok=True)

    today_str = datetime.now(timezone.utc).strftime("%B %d, %Y")
    
    # Generate standard template
    standard_nda = NDA_TEMPLATE.format(
        effective_date=today_str,
        client_company_name="[ENTERPRISE CLIENT LEGAL ENTITY NAME]",
        client_address="[REGISTERED CORPORATE ADDRESS]",
        client_signatory_name="[AUTHORIZED SIGNATORY NAME]",
        client_signatory_title="[CHIEF EXECUTIVE / CTO / VP TECH]"
    )

    pub_path = PUBLIC_LEGAL_DIR / "mutual-nda-standard.md"
    dist_path = DIST_LEGAL_DIR / "mutual-nda-standard.md"

    pub_path.write_text(standard_nda, encoding="utf-8")
    dist_path.write_text(standard_nda, encoding="utf-8")

    print(f"✅ Mutual NDA Standard Template generated at {pub_path.relative_to(ROOT_DIR)} & {dist_path.relative_to(ROOT_DIR)}")

if __name__ == "__main__":
    generate_nda_assets()
