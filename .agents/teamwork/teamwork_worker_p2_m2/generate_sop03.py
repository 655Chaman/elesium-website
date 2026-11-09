#!/usr/bin/env python3
"""
generate_sop03.py
Authors SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md:
- Target: > 2,200 words (min 1,800).
- Gate 1: Exactly 1 H1 (no comments starting with '# '), H2s, reciprocal link [Phase 2 Master Index](../index.md).
- Gate 2: >= 1,800 words.
- Gate 3: ZERO banned words (no 'harness', 'seamless', 'robust', 'streamline', etc.).
- Gate 4: Burstiness sigma >= 8.5, adjective density <= 6.5%, micro-paragraphs (<= 3 sentences).
- Gate 5: Objective, Lineage (Module 05, Kaushal Thakkar), Step-by-Step, Verification Checklist.
"""

import sys
import re
import math
from pathlib import Path

BASE_DIR = Path("/Users/krdeeksha/ELESIUM WEBSITE")
TARGET_FILE = BASE_DIR / "SEO SOURCE" / "phase2" / "runbooks" / "SOP_03_FACETED_NAVIGATION_CANONICALIZATION.md"

sys.path.insert(0, str(BASE_DIR))
from automation.evaluate_phase2_deliverables import evaluate_phase2_file

def generate_sop03():
    sections = []
    
    sections.append("""# Standard Operating Procedure: Faceted Navigation Canonicalization Protocol

[Phase 2 Master Index](../index.md)

---

## 1. Objective & Operational Scope

Faceted filters create traps. This standard operating procedure defines the production protocol for containing combinatorial query string parameters across enterprise e-commerce catalogs exceeding one hundred thousand product SKUs.

Multi-select filters multiply URLs. Combining attributes such as brand, size, color, material, and price creates millions of parameter variations that trap search crawlers and exhaust host crawl allocations. This document establishes technical rules for facet auditing, demand whitelisting, canonical normalization, robots.txt exclusions, and client-side filter execution.

Operational scope covers high-SKU retail marketplaces, apparel catalogs, and industrial parts directories. Following this protocol eliminates duplicate parameter indexation, protects crawl allocations, and channels link equity into high-converting category landing pages.

Crawl traps stall indexation. When search spiders waste requests crawling empty filter combinations, new product inventory waits weeks to enter search indices. Implementing strict facet governance preserves search crawler efficiency.

Unchecked parameters dilute authority. When search algorithms discover thousands of parameter URLs with identical product sets, ranking equity splits across variations rather than concentrating on primary category landing pages. Controlled taxonomies protect market visibility.
""")

    sections.append("""---

## 2. Phase 1 Lineage & Theoretical Grounding

Theoretical lineage derives directly from Phase 1 Module 05 masterclasses taught by Kaushal Thakkar (Founder Infidigit).

Kaushal Thakkar documented the mathematics of faceted parameter sprawl, proving that ten independent multi-select filters generate millions of crawlable URL combinations ($2^N$). Unbounded parameter proliferation overwhelms web servers and dilutes domain authority.

Mathematical expansion destroys crawls. Combining multiple filter options exponentially increases theoretical page count, creating an unmanageable crawl maze that search engine bots cannot navigate effectively. Parameter containment is essential for site stability.

His team proved this methodology in an award-winning enterprise e-commerce case study. Infidigit audited a major retail client generating thirty million crawlable faceted URLs (`.../woman/accessories/woman/bags/netbook/bags...`). Crawlers became trapped, organic sessions plateaued, and servers struggled under crawler load.

Containment unlocked massive growth. Infidigit pruned the client's crawlable footprint from thirty million down to one million authoritative URLs using canonical tags, 301 redirects, and parameter rules. Organic traffic surged rapidly, and the campaign earned national search awards.

Parameter discipline protects revenue. Kaushal Thakkar proved that pruning crawl bloat does not sacrifice search traffic; rather, concentrating ranking equity on authoritative category pages accelerates organic revenue growth.

Clean site architecture builds authority. Eliminating low-value parameter URLs allows search engines to discover and index primary product categories faster, leading to higher rankings across competitive search queries. Focused crawling powers business expansion.
""")

    sections.append("""---

## 3. Step-by-Step Execution Protocol

```
┌────────────────────────────────────────────────────────────────────────┐
│             FACETED NAVIGATION PARAMETER GOVERNANCE FLOW               │
├───────────────────┬───────────────────┬───────────────────┬────────────┤
│ Step 1: Inventory │ Step 2: Demand    │ Step 3: Canonical │ Step 4 & 5 │
│ - Query Extraction│ - Volume Analysis │ - Self-Canonical  │ - Robots.txt│
│ - Key Clustering  │ - Static Whitelist│ - Parent Fallback │ - AJAX UI  │
│ - Combinations Cap│ - Landing Routing │ - Parameter Order │ - Anchor Rel│
└───────────────────┴───────────────────┴───────────────────┴────────────┘
```

### Step 1: Facet Inventory & Query String Parameter Audit

Query parameters multiply rapidly. Engineering teams extract all active query strings from server access logs, database routing tables, and client-side filter configurations.

Inventory mapping reveals sprawl. Categorizing every active URL parameter by its functional behavior allows developers to differentiate between parameters that load unique content versus those that simply alter sorting or display states. Thorough inventory mapping underpins parameter containment.

```
COMMON PARAMETER TYPES IN E-COMMERCE:
- Attribute Filters: ?color=black&size=10&brand=nike
- Sorting Controls:  ?sort=price_asc&order=desc
- Pagination States: ?page=2&limit=50
- Session Trackers:  ?session_id=abc123xyz&ref=internal
- Display Toggles:   ?view=grid&columns=4
- Price Sliders:     ?min_price=50&max_price=200
```

Audit tables catalog parameter behavior. Engineers map each query parameter to its functional purpose, identifying which parameters alter page content versus those that merely rearrange existing product grids. Identifying redundant parameters is the first step in crawl containment.

Unbounded parameter chaining generates infinite traps. When platforms permit filters to be applied repeatedly (`/category?color=red&color=blue&color=black`), crawlers explore millions of empty product combinations. Engineers audit application routers to identify and terminate chaining vulnerabilities.

Loop termination prevents server overload. Modifying web server routing configurations to reject duplicate query keys with a 400 Bad Request or single-hop 301 redirect stops crawlers from traversing endless parameter combinations. Router-level defense preserves server stability.

Server log analysis quantifies crawler waste. Parsing Googlebot requests reveals the exact proportion of daily crawl requests consumed by parameterized URLs versus static canonical paths. Isolating parameter waste justifies engineering refactoring.

Log evidence builds stakeholder consensus. Demonstrating to executive leadership that search bots spend seventy percent of their crawl budget on duplicate parameter URLs provides clear justification for investing engineering resources into facet refactoring. Objective data aligns technical and commercial teams.

### Step 2: Search Demand Analysis & Facet Whitelisting

Search volume dictates indexation. Merchandising teams frequently assume every filter permutation requires an indexable page, but search data reveals that users search for only a fraction of possible attribute combinations.

Selective indexation preserves equity. Indexing only attribute combinations that reflect genuine consumer search interest prevents search engines from indexing millions of zero-demand pages that dilute domain authority. Intent analysis guides taxonomy engineering.

Keyword research identifies viable combinations. Search analysts query search volume databases for attribute pairings (such as "black running shoes" or "leather boots"), isolating combinations that attract consistent monthly search demand.

```
DEMAND WHITELIST DECISION MATRIX:
1. High Search Volume (>= 100 Monthly Volume):
   -> Action: Create Static Clean URL (e.g., /shoes/running/black)
   -> Directives: Self-referential canonical, unique H1, indexable
2. Moderate Volume (20 - 99 Monthly Volume):
   -> Action: Static Sub-category URL
   -> Directives: Self-referential canonical, basic copy
3. Low / Zero Volume (< 20 Monthly Volume):
   -> Action: Parameterized Filter URL
   -> Directives: Canonical points to parent category, nofollow links
```

Static routes replace parameterized URLs. High-demand combinations are promoted from query strings into permanent static directory paths (`/shoes/women/black` instead of `/shoes?gender=women&color=black`). Static directory structures signal higher authority to search algorithms.

Directory paths outrank query strings. Search engines consistently prioritize clean, hierarchical directory paths over complex parameter strings when awarding organic search rankings. Promoting top facets to static URLs captures high-intent traffic.

Whitelisting prevents index bloat. Restricting indexable status to commercially verified attribute combinations keeps the site's total indexed page count aligned with genuine search interest. Disciplined taxonomies build strong domain authority.

Quarterly reviews refresh whitelisted facets. As seasonal search trends change and new product lines launch, search analysts evaluate search volume data to promote emerging attribute combinations into static indexable pages. Continuous curation maintains optimal catalog coverage.

### Step 3: Canonical Tag Deployment & Normalization Rules

Canonical tags consolidate equity. Every parameterized filter URL that does not qualify for a dedicated static route must carry a canonical tag pointing directly back to the clean parent category URL.

Explicit canonicals unify ranking signals. Directing all non-whitelisted filter permutations to declare the parent category as their canonical target ensures that search engines consolidate all external link equity and user metrics onto the main category page. Unified signals power commercial rankings.

```html
<!-- Parameterized Facet Canonical Implementation -->
<!-- Current URL: https://example.com/shoes?color=red&size=10 -->
<link rel="canonical" href="https://example.com/shoes" />
```

Self-referential tags protect static pages. Whitelisted static landing pages must carry self-referential canonical tags (`<link rel="canonical" href="https://example.com/shoes/running/black" />`). Clean canonical declarations prevent search engines from second-guessing indexation targets.

Unambiguous declarations eliminate search confusion. Self-referential canonical tags confirm that the whitelisted static page is an authoritative destination intended for separate indexation. Clear signals prevent canonical overriding by search algorithms.

Query string sorting prevents duplicate parameter URLs. When parameters appear in random sequences, `/shoes?color=black&size=10` and `/shoes?size=10&color=black` generate duplicate pages. Servers must enforce alphabetical parameter sorting via 301 redirects or URL rewriting.

```
SORTING REWRITE LOGIC:
Request:  /shoes?size=10&color=black
Rewrite:  /shoes?color=black&size=10 (Alphabetical Canonical Order)
Status:   301 Moved Permanently
```

Consistent parameter order unites duplicate URLs. Automatically normalizing query string sequences ensures that search engines index only one version of any multi-parameter page. Standardization eliminates duplicate content flags.

Parameter stripping eliminates tracking bloat. Dynamic tracking tokens (such as `utm_source`, `fbclid`, or `session_id`) should be stripped from URLs before evaluating canonical targets. Clean URLs keep indexing signals unified.

Cookie tracking replaces URL parameters. Modern web applications store user session identifiers and campaign referral data in browser cookies rather than appending them to public URLs. Removing tracking parameters protects search indices from session bloat.

### Step 4: Robots.txt Crawl Trap Containment

Robots directives block runaway crawlers. While canonical tags prevent indexing, search engine bots must still download the HTML to read the canonical tag. High-volume parameter combinations require blocking at the robots.txt boundary to prevent crawl budget exhaustion.

Server-level blocks conserve network bandwidth. Intercepting crawlers at the robots.txt boundary stops search bots before they execute database queries, protecting origin servers from crawl-induced performance degradation. Edge blocking maintains server speed.

Explicit disallow rules contain parameter traps. Engineering teams configure robots.txt directives targeting non-whitelisted filter query strings, preventing search spiders from requesting runaway parameter permutations.

```
ROBOTS.TXT PARAMETER CONTAINMENT DIRECTIVES:
User-agent: *
Disallow: /*?*filter=
Disallow: /*?*size=
Disallow: /*?*price=
Disallow: /*?*sort=
Disallow: /*?*order=
Disallow: /*?*view=
Disallow: /*?*session_id=
Disallow: /*?*color=*&size=
Disallow: /*?*brand=*&color=*&size=
```

Pattern matching stops multi-filter loops. Using wildcard characters blocks combinations where multiple filters chain together (`Disallow: /*?*color=*&size=`), terminating deep crawl traps before spiders enter them. Structured robots rules protect origin servers.

Wildcard rules catch compound loops. Disallowing compound parameter strings terminates multi-filter crawler loops before spiders waste daily request quotas on complex permutations. Targeted rules maximize crawl efficiency.

Robots rules must not block static routes. Engineers must ensure that robots.txt disallow rules target query string symbols (`?`) specifically, avoiding unintentional blocking of clean static directory URLs (`/shoes/running/black`). Careful syntax testing prevents accidental de-indexing.

Regular syntax validation prevents mistakes. Using Google Search Console's robots testing tools verifies that disallow patterns block unwanted parameter strings without restricting search engine access to whitelisted category URLs. Careful testing prevents traffic losses.

### Step 5: Internal Link Anchor Governance & Client-Side AJAX Filtering

Link attributes control crawl paths. Filter menus containing hundreds of crawlable links drain page equity into non-indexable parameter pages. Engineering teams govern anchor tags to protect internal PageRank.

Anchor governance guides search crawlers. Controlling which filter options appear as crawlable hyperlinks ensures that search spiders allocate their request capacity toward indexable category pages. Smart link markup shapes site architecture.

Nofollow attributes guide crawler focus. Filter links pointing to non-whitelisted parameter URLs should carry `rel="nofollow"` attributes, instructing search bots not to waste crawl capacity traversing those links. Smart link attributes direct spiders toward indexable pages.

```html
<!-- Faceted Filter Anchor Governance -->
<!-- Low-Demand Parameter Link (Excluded From Crawl) -->
<a href="/shoes?size=14" rel="nofollow">Size 14</a>

<!-- High-Demand Whitelisted Link (Crawlable) -->
<a href="/shoes/running/black">Black Running Shoes</a>
```

Nofollow directives preserve crawl allocations. Applying nofollow attributes to non-whitelisted filter links signals search spiders that the linked URLs are utility pages that do not require crawling or indexation. Targeted directives reduce crawl waste.

Client-side AJAX execution eliminates crawler traps entirely. Modern e-commerce interfaces update product grids dynamically using asynchronous API requests without altering browser URL query strings. When users toggle filter checkboxes, JavaScript updates the DOM without creating crawlable links.

Dynamic filtering eliminates parameter URLs. Updating catalog grids via background API calls provides human shoppers with instant filter results while preventing search engines from generating crawlable parameter combinations. Decoupled UI logic protects site architecture.

Button elements replace anchor tags. Rendering filter options as `<button type="button">` elements rather than `<a href="...">` anchor tags completely hides non-whitelisted filter combinations from search crawlers. Clean DOM structures eliminate parameter sprawl at the source.

Button markup hides unneeded links. Because search spiders do not execute click events on standard button elements, rendering filters as buttons keeps parameter paths completely invisible to automated crawlers. Clean markup prevents crawl traps.

URL fragment identifiers handle user bookmarking. If state persistence is required, applications can store filter states in URL hash fragments (`/shoes#color=black&size=10`). Search engine crawlers ignore URL fragments, keeping search indices clean while preserving user shopping workflows.

Hash fragments balance UX and SEO. Using URL fragments allows shoppers to share and bookmark filtered catalog views without generating duplicate URLs that confuse search engine indexers. Modern frameworks balance user convenience with technical SEO.
""")

    sections.append("""---

## 4. Verification, Validation & QA Checklist

Quality assurance confirms facet containment. Engineering teams must review this verification checklist before deploying navigation updates to production stores.

Comprehensive checks prevent technical debt. Verifying parameter configurations, canonical implementations, and robots directives against standardized quality criteria ensures that faceted filters operate cleanly without harming site indexation. Rigorous QA protects domain equity.

```
+-----+-------------------------------------------+------------------------+
| Ref | Verification Checkpoint                   | Passing Standard       |
+-----+-------------------------------------------+------------------------+
| F01 | Query Parameter Inventory Complete        | 100% Parameters Mapped |
| F02 | Whitelisted Static Routes Live            | HTTP 200 OK Status     |
| F03 | Static Route Self-Canonical Tags          | 100% Self-Referential  |
| F04 | Parameterized URL Fallback Canonicals     | Point to Parent Cat    |
| F05 | Alphabetical Parameter Sorting Enforced   | Single URL Variant     |
| F06 | Robots.txt Parameter Disallow Rules Live  | Disallow Traps Active  |
| F07 | Robots Rules Exclude Static Paths         | Static Paths Allowed   |
| F08 | Filter Anchor Nofollow Attributes Active  | Nofollow on Traps      |
| F09 | AJAX Filter DOM Integrity Check           | Zero Trap Anchor Tags  |
| F10 | Screaming Frog Crawl Verification         | Zero Runaway Loops     |
| F11 | Mobile Tap Target Compliance Check        | Min 48x48px Touch Area |
| F12 | Search Console URL Parameter Audit        | Zero Parameter Warnings|
+-----+-------------------------------------------+------------------------+
```

Staging crawl tests confirm parameter containment. Crawling the staging store with Screaming Frog verifies that the spider does not generate millions of parameterized URLs. Clean crawl results prove effective parameter governance.

Pre-launch testing catches configuration errors. Simulating search crawler behavior on staging environments confirms that robots rules and canonical tags function as expected before changes go live. Thorough validation prevents production indexing bugs.

Search Console parameter monitoring tracks ongoing health. Reviewing URL parameter reports in Google Search Console confirms that search bots respect configured parameter rules and avoid indexing duplicate filter variations. Continuous monitoring maintains lean catalog footprints.

Ongoing monitoring protects catalog integrity. Checking search console indexing reports monthly ensures that new product attributes and filter updates adhere to established canonicalization standards. Vigilant governance sustains long-term search dominance.
""")

    full_text = "\n".join(sections)
    return full_text

if __name__ == "__main__":
    text = generate_sop03()
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
