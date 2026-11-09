#!/usr/bin/env python3
"""
build_sop_05.py
Drafts and validates SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md.
"""

import sys
import os
import re
from pathlib import Path

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from generate_bible import check_slop

SOP_05_TEXT = """# SOP 05: Toxic Backlink Triage, Remediation & Disavowal Protocol

[Return to Phase 2 Master Index](../index.md)

---

## 1. Objective & Operational Scope

This standard operating procedure governs the identification, quarantine, outreach remediation, and disavow process of spam backlink profiles. The protocol applies to web properties experiencing Google Search Console penalties or automated search suppression.

Unnatural backlinks violate search engine webmaster guidelines and distort PageRank graph calculations. Off-page spam attacks, expired domain redirections, and low-quality directory syndication degrade search engine trust.

This runbook establishes an evidentiary audit trail. Engineering and SEO teams must execute structured webmaster takedown outreach before submitting disavow directives to search engine review teams.

---

## 2. Phase 1 Lineage & Grounding Matrix

The procedures codified in this runbook originate directly from the verified Phase 1 verbatim course transcripts:

- **Module 06 (Lesson 6.5 - Manual Actions)**: Kaushal Thakkar detailed the mechanics of Google Search Console unnatural links notifications, spam link profile analysis, and link network footprinting.

- **Module 06 (Lesson 6.1 - Link Fundamentals)**: Kaushal Thakkar established the mathematical models of PageRank equity flow and nofollow dissipation.

- **Module 07 (Lesson 7.3 - Google Penalties)**: Pushkar Shah documented the recovery protocol for a 35-million-user ed-tech platform suffering a manual action penalty, proving that pruning 3,000 mistakenly disavowed legitimate domains restored historical search visibility.

```
+-----------------------------------+-------------------------------------------------------------+
| Framework Element                 | Verbatim Phase 1 Dossier Reference                          |
+-----------------------------------+-------------------------------------------------------------+
| Manual Action Classification      | Module 06 (module_06.md: Lines 415-457 - Kaushal Thakkar)   |
| PBN Footprint Identification      | Module 06 (module_06.md: Lines 425-442 - Kaushal Thakkar)   |
| Two-Phase Remediation Mandate     | Module 06 (module_06.md: Lines 443-455 - Kaushal Thakkar)   |
| 35M User Ed-Tech Recovery Case    | Module 07 (module_07.md: Lines 75-113 - Pushkar Shah)       |
+-----------------------------------+-------------------------------------------------------------+
```

---

## 3. Technical Prerequisites & Tooling Architecture

Execution of this protocol requires access to specific search infrastructure and diagnostic software suites:

1. **Google Search Console**: Owner-level property verification to access Security & Manual Actions reports and the Disavow Tool.

2. **Third-Party Backlink Crawler Indexes**: Full export capabilities across Ahrefs Site Explorer and SEMrush Backlink Audit.

3. **WHOIS & Network Diagnostic Utilities**: Command-line `whois`, `dig`, and `traceroute` tools to extract domain registration data and IP subnets.

4. **Centralized Remediation Database**: Dedicated spreadsheet or CRM instance recording all email outreach timestamps, recipient contacts, and responses.

```
TOOLING INGESTION ARCHITECTURE:
[Google Search Console] ---> Raw Verified Backlink Dump (CSV)
[Ahrefs Site Explorer]  ---> All Referring Domains & Anchor Profile (CSV)  ---> [Consolidated Audit Engine]
[SEMrush Backlink Tool] ---> Toxic Score (>50) & Network ID Export (CSV)
```

Auditors must never rely on a single data source. Search engine crawlers maintain distinct coverage records compared to commercial indexers.

Engineers automate network inspection using command-line shell scripts:

```bash
  # Automated C-Class Subnet Extraction Script
#!/usr/bin/env bash
while IFS= read -r domain; do
  ip=$(dig +short "$domain" | tail -n1)
  if [ -n "$ip" ]; then
    c_class=$(echo "$ip" | cut -d. -f1-3)
    echo "$domain,$ip,$c_class"
  fi
done < quarantined_domains.txt > domain_ip_subnets.csv
```

---

## 4. Step-by-Step Execution Protocol (The 7-Phase Remediation Lifecycle)

```
[Phase 1: Detection & Notification Triage]
           |
[Phase 2: Multi-Source Extraction & Aggregation]
           |
[Phase 3: Network Footprint & Infrastructure Deconstruction]
           |
[Phase 4: Mandatory Webmaster Takedown Outreach]
           |
[Phase 5: Disavow File Compilation & Historical Merging]
           |
[Phase 6: Search Console Upload & Reconsideration Filing]
           |
[Phase 7: Post-Submission Monitoring & Equity Recovery]
```

### Phase 1: Detection & Notification Triage
The audit begins by diagnosing whether the site suffers from automated search suppression or a human review penalty.

Log into Google Search Console and inspect the Security & Manual Actions dashboard. If the dashboard displays an active banner reading "Unnatural links to your site," record the date and specific sub-type.

If no manual action appears, overlay search traffic data against Google algorithm update dates using Barracuda Panguin or FE International Website Penalty Indicator.

Confirming a manual action mandates executing the complete two-phase remediation workflow. Automated dampening permits a more selective disavow approach without formal reconsideration requests.

### Phase 2: Multi-Source Extraction & Toxicity Aggregation
Export complete backlink datasets across all available monitoring platforms. Ingest exports from Google Search Console, Ahrefs, and SEMrush into a unified PostgreSQL database or spreadsheet.

Filter and tag referring domains exhibiting known toxicity markers:

- **Marker A (SEMrush Toxic Score > 50)**: High probability of manipulative link attributes or spam directory placement.

- **Marker B (Moz Spam Score > 30)**: Association with penalized domain clusters.

- **Marker C (Ahrefs DR = 0 with Commercial Anchors)**: Low-authority domains hosting exact match commercial target terms.

- **Marker D (Adult, Casino, or Pharmaceutical Keywords)**: Referring anchor text containing unapproved commercial terms or non-native foreign scripts.

- **Marker E (Chrome Extension / Mirror Redirects)**: Automated scraper networks redirecting malicious user-agent traffic.

Consolidate all flagged domains into a primary quarantine review table. Eliminate internal duplicates by normalizing domain strings to lowercase roots.

### Phase 3: Network Footprint & Infrastructure Deconstruction
Manipulative link builders build Private Blog Networks (PBNs) across separate domains while reusing identical hosting infrastructure. Auditors must group referring domains by technological footprints.

Execute automated DNS lookups to extract IPv4 addresses across all quarantined domains:

1. **Shared C-Class Subnets**: Group domains by the first three IP octets (`AAA.BBB.CCC.XXX`). If ten or more referring domains share an identical C-class subnet, tag the cluster as a suspected link network.

2. **Shared Tracking Identifiers**: Scrape HTML source code across quarantined domains to extract Google Analytics tracking IDs (`UA-XXXXX` or `G-XXXXX`). Domains sharing an analytics ID belong to a single entity.

3. **Shared Monetization IDs**: Extract Google AdSense publisher codes (`pub-XXXXX`). Identical publisher IDs confirm unified ownership.

Confirming shared footprints justifies flagging the entire domain group for immediate disavow submission.

### Phase 4: Mandatory Webmaster Takedown Outreach
Search engine webspam review teams reject reconsideration requests that omit proof of direct takedown outreach. Google demands documentation showing that the site owner attempted to resolve violations independently.

Execute webmaster outreach across all quarantined domains. Query domain WHOIS records using command-line scripts to extract administrative and registrant email addresses.

If WHOIS records are masked by privacy services, extract contact addresses from website contact pages or editorial mastheads. Dispatch formal link takedown requests requesting deletion of the specific backlink or conversion to `rel="nofollow"`.

```
=================================================================================
STANDARD EDITORIAL LINK REMOVAL EMAIL TEMPLATE
=================================================================================
To: webmaster@referring-domain.com
Subject: Urgent Request: Removal of Link to [Target Brand Domain]

Dear Webmaster,

I am writing on behalf of [Target Brand Domain]. We are currently auditing our
inbound link profile to align strictly with Google Webmaster Quality Guidelines.

We identified the following link on your website pointing to our domain:
- Linking Page URL: https://referring-domain.com/sample-article.html
- Target URL: https://example.com/target-page.html
- Current Anchor Text: "[Sample Commercial Anchor]"

We kindly request that you remove this hyperlink entirely, or update the link tag
to include rel="nofollow" or rel="sponsored" attributes.

Thank you for your assistance. Please confirm once this adjustment is completed.

Sincerely,
[Name / Technical Operations Lead]
[Target Brand Domain]
=================================================================================
```

Record every outreach attempt in the centralized audit spreadsheet:

```
+--------------------+----------------------------+-----------------------+---------------------+-------------------+
| Domain Name        | Contact Method / Email     | Dispatch Date (UTC)   | Response Status     | Evidence File Link|
+--------------------+----------------------------+-----------------------+---------------------+-------------------+
| pbn-network-1.com  | admin@pbn-network-1.com    | 2026-11-08 09:30:00   | No Response         | /proof/email_01.png|
| spam-blog-44.net   | webmaster@spam-blog-44.net | 2026-11-08 09:35:00   | Demanded $50 Fee    | /proof/email_02.png|
| forum-drop.info    | Contact Form Submission    | 2026-11-08 09:40:00   | Ticket #48291       | /proof/form_03.png |
+--------------------+----------------------------+-----------------------+---------------------+-------------------+
```

Retain screenshot copies of submitted contact forms and outbound email receipts. Reviewers inspect this evidence when evaluating reconsideration requests.

### Phase 5: Disavow File Compilation & Historical Merging
Webmasters submit disavow files to instruct search engines to ignore specific external links when calculating PageRank. Incorrect formatting invalidates the entire file.

The disavow file must adhere strictly to plain text formatting:

1. Encode the file in UTF-8 or 7-bit ASCII format. Never upload Microsoft Word or rich text files.

2. Specify domain-level exclusions using the `domain:` syntax prefix (e.g., `domain:toxic-domain.com`).

3. Use specific URL syntax only when disavowing an isolated spam link on an otherwise authoritative, legitimate domain (e.g., a hacked forum thread).

```
  # Official Disavow Submission - example.com
  # Audit Reference: 2026-11-08 Manual Action Remediation

  # Quarantined PBN Cluster - Shared C-Class Subnet 198.51.100.0/24
domain:toxic-pbn-alpha.com
domain:toxic-pbn-beta.net

  # Unresponsive Paid Directory Network
domain:spam-directory-list.biz

  # Hacked Forum Profile on Legitimate Domain
https://authoritative-site.org/profiles/spammer-profile-392
```

The following Python script validates disavow syntax and prevents accidental exclusion of clean educational domains:

```python
import sys
from pathlib import Path

def validate_disavow_file(filepath: str):
    path = Path(filepath)
    with open(path, "r", encoding="utf-8") as f:
        lines = f.readlines()

    errors = []
    clean_domains = 0
    protected_tlds = [".edu", ".gov", ".org"]

    for idx, raw_line in enumerate(lines, 1):
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue

        if line.startswith("domain:"):
            domain = line.split(":", 1)[1].strip()
            clean_domains += 1
            if any(domain.endswith(tld) for tld in protected_tlds):
                errors.append(f"Line {idx}: WARNING - Disavowing trusted TLD '{domain}'!")
        elif line.startswith("http://") or line.startswith("https://"):
            clean_domains += 1
        else:
            errors.append(f"Line {idx}: Syntax error - line must start with 'domain:' or 'http(s)://'")

    print(f"Validated {clean_domains} disavowed rules with {len(errors)} error flags.")
    for err in errors:
        print(f"  {err}")
```

**CRITICAL AUDIT INVARIANT (THE ED-TECH SAFEGUARD)**: Before uploading a new disavow file, download the existing live disavow file from Google Search Console. Merge new toxic entries into the historical file. Uploading a partial file overwrites and deletes previous disavow entries.

In Module 07, Pushkar Shah revealed that prior consultants accidentally disavowed 3,000 legitimate authority domains for an enterprise ed-tech portal. Always audit the historical disavow file to ensure clean educational and editorial partners are never excluded.

### Phase 6: Search Console Upload & Reconsideration Filing
Once the disavow file is compiled and validated, upload it through the official Google Search Console Disavow Tool interface:
`https://search.google.com/search-console/disavow-links`

After uploading the disavow file, open the Security & Manual Actions panel and initiate a Reconsideration Request:

- **Section 1: Acknowledgment**: State clearly that the organization identified unnatural links violating webmaster quality guidelines.

- **Section 2: Remediation Actions**: Describe the multi-source audit methodology, citing the volume of referring domains evaluated.

- **Section 3: Takedown Proof**: Provide a view-only link to the Google Sheets outreach tracking log and screenshot repository.

- **Section 4: Disavow Submission**: Confirm that all unresponsive and spam domains were compiled into a verified disavow submission.

- **Section 5: Preventive Governance**: Outline corporate governance policies implemented to prevent recurring commercial link purchases.

Maintain a professional, factual tone throughout the submission. Avoid emotional pleas or speculative excuses.

```
=================================================================================
RECONSIDERATION REQUEST SUBMISSION DRAFT
=================================================================================
To: Google Webspam Review Team
Subject: Reconsideration Request for example.com (Unnatural Links to Site)

Dear Search Quality Team,

We recently received a manual action notification regarding unnatural links pointing
to example.com. We have conducted a complete forensic backlink audit across 14,200
referring domains extracted from Google Search Console, Ahrefs, and SEMrush.

1. DIRECT OUTREACH REMOVALS:
We contacted 420 webmasters requesting immediate removal or nofollow application.
118 webmasters removed or updated the links. 302 domains remained unresponsive or
demanded commercial removal fees. All outreach records, timestamps, and email proofs
are cataloged in this verified spreadsheet: [Read-Only Google Sheet Link].

2. DISAVOW SUBMISSION:
We have submitted an updated UTF-8 disavow file containing 302 unresponsive toxic
domains and known PBN networks via the Disavow Tool on 2026-11-08.

3. PREVENTIVE GOVERNANCE:
We have terminated all legacy agency contracts and instituted strict editorial
guidelines prohibiting commercial link acquisition.

We respectfully request that the manual action on example.com be revoked.

Sincerely,
Technical SEO & Engineering Governance Team
example.com
=================================================================================
```

### Phase 7: Post-Submission Monitoring & Equity Recovery
Google manual review teams typically process reconsideration requests within two to six weeks. Reviewers respond via Search Console messages.

Monitor the property weekly following submission:

1. Track the manual actions panel for approval notifications stating that the penalty has been revoked.

2. If Google rejects the request, review the sample spam URLs provided in the rejection message and repeat direct outreach.

3. Monitor non-brand organic search impressions in Google Search Console performance reports.

Following penalty revocation, historical search rankings recover progressively over two to three search engine crawl cycles.

---

## 5. Verification Checklist & Quality Assurance Gates

Engineering teams must verify each operational gate before submitting reconsideration documents:

```
+-----------------------------------+-------------------------------------------------------------+
| Verification Checkpoint           | Acceptance Criteria                                         |
+-----------------------------------+-------------------------------------------------------------+
| Multi-Source Aggregation          | Ingested dumps from GSC, Ahrefs, and SEMrush combined.     |
| Network Footprint Analysis        | C-class subnets and shared GA/AdSense tags cataloged.       |
| Documented Takedown Outreach      | Outreach log contains timestamps, emails, and proof links.  |
| Disavow File Syntax Verification  | File encoded in UTF-8; uses valid domain: directives.       |
| Historical File Merging Audit     | Zero legitimate educational or editorial domains disavowed. |
| Reconsideration Request Package   | Factual letter submitted with read-only outreach sheet link.|
+-----------------------------------+-------------------------------------------------------------+
```

---

## 6. Document Governance & Reciprocal Cross-References

This runbook forms an authoritative operational guide within the Phase 2 execution suite. All protocols adhere to verified Phase 1 search curriculum standards.

- [Return to Phase 2 Master Index](../index.md)
- [Consult Bible Volume IV: Off-Page Link Equity & Algorithmic Defense](../bible_vol_4_6.md)
- [Proceed to Runbook SOP 06: Autonomous GenAI Content Pipeline](./SOP_06_AUTONOMOUS_GENAI_CONTENT_PIPELINE.md)
"""

words = len(SOP_05_TEXT.split())
print(f"SOP 05 Word count: {words}")
slop = check_slop(SOP_05_TEXT)
print(f"SOP 05 Slop hits: {len(slop)}")
for w, idx in slop:
    print(f"  Banned: {w} at {idx}")

if slop:
    print("Aborting SOP 05 write due to slop hits!")
    sys.exit(1)

out_file = Path("/Users/krdeeksha/ELESIUM WEBSITE/SEO SOURCE/phase2/runbooks/SOP_05_TOXIC_BACKLINK_TRIAGE_AND_DISAVOWAL.md")
out_file.parent.mkdir(parents=True, exist_ok=True)
out_file.write_text(SOP_05_TEXT, encoding="utf-8")
print(f"Successfully wrote {out_file} ({words} words).")
