#!/usr/bin/env python3
"""
generate_sop04.py
Authors SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md:
- Target: > 2,300 words (min 1,800).
- Gate 1: Exactly 1 H1 (no python comments starting with '# '), H2s, reciprocal link [Phase 2 Master Index](../index.md).
- Gate 2: >= 1,800 words.
- Gate 3: ZERO banned words (no 'harness', 'seamless', 'robust', 'streamline', etc.).
- Gate 4: Burstiness sigma >= 8.5, adjective density <= 6.5%, micro-paragraphs (<= 3 sentences).
- Gate 5: Objective, Lineage (Module 08, Pushkar Shah, Anna), Step-by-Step, Verification Checklist.
"""

import sys
import re
import math
from pathlib import Path

BASE_DIR = Path("/Users/krdeeksha/ELESIUM WEBSITE")
TARGET_FILE = BASE_DIR / "SEO SOURCE" / "phase2" / "runbooks" / "SOP_04_ZERO_DROP_ECOMMERCE_MIGRATION_PROTOCOL.md"

sys.path.insert(0, str(BASE_DIR))
from automation.evaluate_phase2_deliverables import evaluate_phase2_file

def generate_sop04():
    sections = []
    
    sections.append("""# Standard Operating Procedure: Zero-Drop E-Commerce Migration Protocol

[Phase 2 Master Index](../index.md)

---

## 1. Objective & Operational Scope

Migrations risk equity. This standard operating procedure defines the production protocol for executing platform re-architectures, domain rebrands, structural taxonomy overhauls, and regional subdomain consolidations without suffering organic search traffic drops.

Unprepared migrations destroy domain equity. Failing to map legacy URLs or breaking server redirect rules can erase years of accumulated organic search authority in days. This protocol provides a six-phase execution framework governing inventory benchmarking, one-to-one redirect mapping, staging verification, DNS cutover execution, dual-sitemap acceleration, and real-time log monitoring.

Operational scope covers enterprise retail stores, international e-commerce platforms, and high-inventory catalog directories. Following this protocol guarantees that search engines transfer accumulated PageRank smoothly to destination URLs, preserving commercial rankings throughout the transition window.

Methodical execution prevents traffic loss. Search engines interpret broken URLs and mass homepage redirects as signs of site abandonment, triggering soft 404 penalties that demote domain rankings. Strict adherence to this engineering protocol ensures continuous business operations and rapid traffic recovery.
""")

    sections.append("""---

## 2. Phase 1 Lineage & Theoretical Grounding

Theoretical lineage derives directly from Phase 1 Module 08 masterclasses taught by Pushkar Shah (Strategic SEO Lead) and Anna (E-Commerce Operations Lead).

Pushkar Shah and Anna established that enterprise website migrations fall into four primary topologies: platform re-platforming (such as migrating from Magento to Shopify Plus), domain rebranding (such as Cure.fit rebranding to Cult.fit), structural taxonomy reorganization, and regional subdomain consolidation.

Their methodology proved itself in the landmark Mochi Shoes restructuring case study. Pushkar Shah led the complete technical overhaul of the enterprise footwear brand, reorganizing category silos, implementing structured schema markup (Product, Offer, AggregateRating), and establishing out-of-stock inventory logic. Over eighteen months, Mochi Shoes achieved a 374 percent increase in new users and a 464 percent surge in organic sessions.

The Cult.fit rebrand demonstrated rapid authority recovery under challenging conditions. When Cure.fit transitioned to Cult.fit, domain authority dropped sharply from forty-five to eight. The engineering team deployed dual sitemaps and real-time server log monitoring, restoring domain authority to forty-five within four months while surpassing historical traffic levels.

Case study evidence guides protocol rules. The lessons learned from Mochi Shoes and Cult.fit prove that disciplined technical preparation eliminates migration risks and unlocks superior post-launch search visibility.
""")

    sections.append("""---

## 3. Step-by-Step Execution Protocol

```
┌────────────────────────────────────────────────────────────────────────┐
│             SIX-PHASE ZERO-DROP E-COMMERCE MIGRATION FLOW              │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ Phase 1: Benchmark│ Phase 2: 1:1 Map  │ Phase 3: Staging  │ Phase 4-6  │
│ - Full Crawl Export - Strict 1:1 Map  - 200 Link Checks - DNS Cutover│
│ - GSC Baseline    │ - Zero Home Bounces - 301 Hop Audits│ - Dual Sitemap│
│ - TTFB & Speed    │ - Parameter Normal- No Loop Policy  │ - Log Monitor│
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

### Phase 1: Pre-Migration Benchmarking & Inventory Auditing

Baseline data protects domain authority. Engineering teams must export a complete inventory of all existing URLs before touching server configurations or modifying DNS records.

Crawlers catalog live endpoints. Engineers execute a full desktop crawl using Screaming Frog, exporting all 200 OK URLs, canonical tags, page titles, meta descriptions, and inlink counts into central data warehouses. This crawl export represents the authoritative inventory that must be accounted for during migration.

```
PRE-MIGRATION BENCHMARKING DATASETS:
1. Screaming Frog Full Inventory Crawl:
   -> All 200 OK URLs, Canonicals, Meta Data, Inlink Weights
2. Google Search Console Historical Data (12 Months):
   -> Clicks, Impressions, Average Position by URL
3. Google Analytics 4 Performance Metrics:
   -> Sessions, Transactions, Conversion Rates by Landing Page
4. Server Performance Baselines:
   -> Average TTFB (ms), Daily Crawl Request Volume
```

Performance data identifies priority URLs. Cross-referencing crawl exports with twelve months of Search Console and analytics data highlights the top ten percent of URLs that generate ninety percent of organic search revenue. These priority URLs receive special validation during mapping.

Server latency baselines record infrastructure health. Engineers measure average Time to First Byte and daily Googlebot request volume during normal operations. Post-launch performance is compared against this baseline to ensure server capacity remains stable after migration cutover.

### Phase 2: 1:1 URL Redirect Mapping Architecture

Strict one-to-one mapping is non-negotiable. Every legacy URL must redirect directly to its exact replacement on the new website architecture.

Homepage redirects trigger soft 404 penalties. Redirecting legacy product or category pages to the homepage confuses search engine algorithms and causes historical rankings to collapse. Google classifies bulk homepage redirects as soft 404 errors, erasing earned search equity.

```
REDIRECT MAPPING ARCHITECTURE:
Legacy URL:      /women/footwear/running-shoes/black-sneaker
Destination URL: /footwear/women/shoes/running/black-sneaker
Header Status:   301 Moved Permanently (Single Hop)

DISALLOWED MAPPING PATTERN:
Legacy URL:      /women/footwear/running-shoes/black-sneaker
Destination URL: / (Homepage Bounce -> Soft 404 Error Flag)
```

Mapping rules handle discontinued inventory systematically. Legacy URLs for products that will not exist on the new platform must redirect to their closest parent subcategory rather than the homepage. Discontinued products with zero external backlinks or historical search traffic should return a 410 Gone status.

Query string parameters require normalization. Redirect maps must account for common query parameters, ensuring that tracking tokens and filter variations redirect cleanly without creating infinite redirect chains or parameter loops. Clean URL normalization consolidates indexing signals.

### Phase 3: Staging Server Audit & Header Verification

Staging verification catches configuration defects. Prior to DNS cutover, the complete redirect map must be loaded onto a staging server that mirrors production architecture.

Staging crawls verify link resolution. Engineers execute full Screaming Frog crawls of the staging website, confirming that one hundred percent of internal navigation links resolve to 200 OK status codes on the staging domain. Broken internal links must be resolved before launch.

```bash
# Automated Single-Hop Header Verification Script
curl -s -I "https://staging.example.com/legacy-route" | grep -E "HTTP/|location:"
# Expected Output:
# HTTP/2 301
# location: https://staging.example.com/new-route
```

Automated scripts test redirect headers. Engineering teams run automated curl scripts or list-mode crawls across the entire redirect map, verifying that every legacy URL returns a single-hop 301 Moved Permanently header. Any redirect chains or 302 temporary redirects must be corrected immediately.

Staging environments must remain private. Staging websites must be protected by HTTP basic authentication or restricted to corporate VPN access, preventing search engine crawlers from indexing pre-production code during audit phases. Access controls safeguard domain security.

### Phase 4: Production DNS Cutover Execution

Timing dictates cutover execution. Production DNS updates must be scheduled during the lowest-traffic historical window, typically between midnight and 4:00 AM on midweek business days.

Low-traffic windows minimize disruption. Deploying during quiet periods ensures that any unexpected server errors or routing issues affect the smallest possible number of active shoppers and transactions. Careful scheduling reduces commercial risk.

```
DNS CUTOVER TIMELINE:
T - 72 Hours: Lower DNS TTL to 300 Seconds (5 Minutes)
T - 02 Hours: Freeze Content Updates & Backup Production Database
T - 00 Hours: Deploy Server Configuration & Update DNS A/CNAME Records
T + 01 Hours: Execute Smoke Tests & Validate SSL Certificates
T + 02 Hours: Restore Standard DNS TTL (86400 Seconds)
```

Lowering DNS TTL values enables rapid propagation. Reducing Time to Live settings seventy-two hours prior to launch ensures that global internet service providers refresh DNS records quickly once cutover begins. Fast DNS propagation shortens the transition window.

Server rewrite engines handle high-volume redirects. Redirect rules should be deployed at the CDN edge (such as Cloudflare Workers) or within high-performance web server configurations (such as Nginx maps) to ensure sub-twenty-millisecond response times under heavy request load. Fast redirects keep servers responsive.

### Phase 5: Post-Launch Acceleration & Search Console Governance

Search console declarations accelerate index updates. Immediately following DNS cutover, site owners must submit an official Change of Address request in Google Search Console for domain migrations.

Official declarations confirm permanent moves. The Change of Address tool notifies Google's indexing systems that the migration is intentional and site-wide, prompting search algorithms to transfer ranking signals rapidly. Verified declarations minimize transition volatility.

```
DUAL SITEMAP SUBMISSION ARCHITECTURE:
Sitemap 1 (Legacy Sitemap):
-> Contains: All legacy URLs returning 301 redirects
-> Purpose:  Forces search bots to crawl redirect endpoints immediately
Sitemap 2 (New Destination Sitemap):
-> Contains: All new destination URLs returning 200 OK headers
-> Purpose:  Accelerates indexation of new canonical URL paths
```

Dual sitemaps force immediate crawler discovery. Submitting an XML sitemap of legacy 301 URLs alongside a sitemap of new 200 URLs directs search bots to crawl both endpoints simultaneously. This dual submission speeds up PageRank transfer from months to days.

Indexing reports verify transition velocity. Engineers monitor Search Console coverage reports daily, verifying that submitted legacy URLs transition steadily into redirect status while new URLs enter the primary search index. Transparent reporting keeps stakeholders informed.

### Phase 6: Post-Migration Monitoring & Recovery Tracking

Live log monitoring detects errors immediately. Engineering teams tail production web server access logs immediately following cutover, tracking incoming 404 status codes in real time.

Real-time log alerts catch missed routes. Sudden spikes in 404 errors reveal overlooked legacy URL paths or broken external backlinks that were missed during initial mapping. Triage engineers patch missing 301 redirects within minutes, preventing search engine bots from dropping broken URLs from search indices.

```
RECOVERY TRAJECTORY MILESTONES:
Day 01 - 14:  Crawl Volatility Window (Daily Log Monitoring & 404 Patching)
Day 15 - 45:  Indexation Shift Window (Legacy URLs Drop, New URLs Index)
Day 46 - 90:  Equity Consolidation (Rankings Rebound to Baseline Levels)
Day 91 - 120: Performance Parity & Expansion (Cult.fit 4-Month Benchmark)
```

Traffic recovery follows predictable curves. Based on the four-month recovery trajectory demonstrated by Cult.fit, search impressions and keyword rankings stabilize within forty-five days and return to full pre-migration baselines by day one hundred and twenty. Patient, disciplined monitoring ensures sustained growth.

Weekly executive dashboards report recovery progress. Search leads present weekly updates tracking organic sessions, keyword ranking distributions, and conversion metrics against pre-migration baselines. Clear metrics build executive confidence throughout the post-launch recovery phase.
""")

    sections.append("""---

## 4. Verification, Validation & QA Checklist

Structured checklists ensure zero-drop migrations. Engineering teams must review and sign off on this verification checklist before, during, and after executing website cutovers.

Standardized checkpoints eliminate oversight. Following this quality assurance framework guarantees that all redirects, headers, sitemaps, and analytics tags operate flawlessly throughout the migration lifecycle. Disciplined QA protects corporate revenue.

```
+-----+-------------------------------------------+------------------------+
| Ref | Migration Verification Checkpoint         | Passing Standard       |
+-----+-------------------------------------------+------------------------+
| M01 | Pre-Migration 200 OK Inventory Export     | 100% URLs Documented   |
| M02 | Historical GSC Performance Data Export    | 12 Months Data Saved   |
| M03 | Strict 1:1 Redirect Map Completed         | Zero Homepage Bounces  |
| M04 | Staging Internal Link Resolution Audit    | 100% 200 OK on Staging |
| M05 | Staging Single-Hop 301 Header Check       | Zero Chains or Loops   |
| M06 | DNS TTL Lowered 72 Hours Prior            | TTL <= 300 Seconds     |
| M07 | Production DNS Cutover Executed           | Off-Peak Traffic Window|
| M08 | GSC Change of Address Tool Submitted      | Verified Domain Move   |
| M09 | Dual Sitemaps Uploaded to GSC             | Legacy 301 + New 200   |
| M10 | Real-Time 404 Server Log Monitoring       | 404 Rate < 0.5%        |
| M11 | Analytics & Conversion Tracking Verified  | 100% Tag Firing        |
| M12 | 120-Day Post-Launch Tracking Dashboard   | Metrics Match Baseline |
+-----+-------------------------------------------+------------------------+
```

Log validation confirms redirect execution. Monitoring server logs over the first thirty days confirms that search engine crawlers successfully process legacy 301 redirects and update index records without encountering server errors. Reliable log data verifies technical success.

Post-launch audit crawls confirm site health. Running full Screaming Frog crawls of the live website thirty days after launch verifies that internal links, canonical tags, and structured schemas remain intact across the new architecture. Ongoing vigilance guarantees enduring search equity.
""")

    full_text = "\n".join(sections)
    return full_text

if __name__ == "__main__":
    text = generate_sop04()
    TARGET_FILE.parent.mkdir(parents=True, exist_ok=True)
    TARGET_FILE.write_text(text, encoding="utf-8")
    print(f"Written {len(text.split())} words to {TARGET_FILE}")
    res = evaluate_phase2_file(TARGET_FILE, TARGET_FILE.parent.parent)
    print(f"Status: {res['overall_status']}, Score: {res['overall_score']}/100")
    for g in res['gates']:
        print(f"  {g['name']}: {g['score']}/{g['max_score']} [{g['status']}]")
        for r in g['reasons']:
            print(f"    - {r}")
        if g.get('metrics') and 'detections' in g.get('metrics', {}):
            for d in g['metrics']['detections']:
                print(f"      Detection: {d}")
