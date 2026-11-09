# volume_5.py
# Volume V: International SEO & Multi-Region Expansion

VOL_5_TEXT = """## Volume V: International SEO & Multi-Region Expansion

Expanding a web property into international territories represents a primary organic growth vector for enterprise businesses. International search engine optimization requires precise coordination across domain architecture, hreflang cluster geometry, edge server routing, and localized content operations.

This volume codifies the global expansion frameworks established by Pushkar Shah in Module 07, incorporating technical redirection and migration safeguards from Module 08. Global search visibility demands mathematical precision, strict adherence to ISO standards, and zero architectural ambiguity.

---

### Chapter 1: Multi-Regional Opportunity Discovery & Feasibility Framework

#### 1.1 Business Aspiration vs Empirical Demand Validation
Executive teams frequently initiate international expansion driven by corporate ambition rather than validated market search demand. Launching localized infrastructure in regions that lack organic search interest dissipates engineering capital and operational capacity.

Pushkar Shah established an empirical validation sequence in Module 07 to replace intuitive assumptions with search analytics data:

```
[Phase 1: Google Analytics Geolocation Audit] -> Uncover Untargeted Traffic Pockets
[Phase 2: Keyword Demand Aggregation]        -> Benchmark Top 300 Keywords Across Geographies
[Phase 3: Commercial Intent Evaluation]      -> Distinguish Transactional Search from Informational
[Phase 4: Operational Resource Audit]        -> Verify Content, Engineering, and QC Capacity
```

Webmasters must first examine Google Analytics acquisition reports to identify spontaneous international traffic. A domestic website targeting the United States often receives thousands of organic visits from India, the United Kingdom, or Australia without deliberate optimization. This baseline reveals latent brand recognition and organic product demand.

#### 1.2 Addressable Search Volume Benchmarking Across Target Geographies
Before committing engineering resources, organizations must benchmark addressable search volume across target countries. Aggregate volume reveals whether a regional market justifies localized site maintenance.

In Module 07, Pushkar Shah detailed an empirical benchmark study evaluating the top 300 industry head keywords across primary English-speaking markets:

$$\text{Total Addressable Search Volume} = \sum_{k=1}^{300} \text{Monthly Volume}(k, \text{Country})$$

```
Top 300 Head Keyword Search Volume Comparison (Sample Market Distribution)
United States (US):  [========================================] 480,000 / mo
United Kingdom (UK): [==================] 210,000 / mo
India (IN):          [============] 145,000 / mo
Canada (CA):         [========] 95,000 / mo
Australia (AU):      [======] 72,000 / mo
```

The data demonstrates that search volume varies dramatically across geographic boundaries. Expanding from India into the United States or the United Kingdom multiplies the total addressable audience by factors of two to three. Decisions grounded in aggregated keyword data ensure scalable capital allocation.

#### 1.3 Linguistic Nuance, Cultural Cycles & Operational Feasibility
International search optimization involves far more than direct mechanical language translation. Even within shared languages like English, regional vocabulary and spelling conventions alter query semantics.

American users search for "sneakers" and "vacation packages," while British users query "trainers" and "holiday packages." Furthermore, regional commercial holidays dictate distinct search demand peaks. In the United States, Halloween and Black Friday drive massive retail surges in October and November. In India, festive shopping concentrates around Diwali, demanding localized promotional calendars.

```
+-----------------------------------+-----------------------------------+
| Required Operational Resource     | Enterprise Governance Standard    |
+-----------------------------------+-----------------------------------+
| Native Content Writing Team       | Localized copywriting reflecting  |
|                                   | native idioms and regional terms. |
| Linguistic Quality Control (QC)   | Editorial verification of grammar,|
|                                   | currency signs, and date formats. |
| Edge Infrastructure Engineering   | Reverse proxy routing, CDN logic, |
|                                   | and localized caching rules.      |
| Regional SEO Specialists          | Localized SERP gap analysis,      |
|                                   | competitor rank tracking, links.  |
+-----------------------------------+-----------------------------------+
```

Organizations must verify operational readiness across these departments before launching international sections. Rolling back a failed international deployment damages search engine trust and wastes historical crawl budget.

---

### Chapter 2: Structural Architecture & Geotargeting Governance

#### 2.1 The International URL Architecture Taxonomy
Selecting the proper URL structure forms the architectural foundation of international search engineering. The chosen format dictates domain authority inheritance, server hosting complexity, and search engine geotargeting signals.

Pushkar Shah compared the four fundamental architectural options in Module 07:

| Architecture Model | Example Structure | Geotargeting Signal | Setup & Maintenance Cost | Infrastructure Overhead | Link Equity Inheritance | Enterprise Scalability |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Country Code Top-Level Domain (ccTLD)** | `example.de`, `example.in` | Maximum (Hard-coded geographic signal) | Very High (Separate domains, hosts, codebases) | Heavy (Multi-server management) | Zero (Starts with 0 PageRank and 0 authority) | Rigid, expensive, isolated equity. |
| **Subdomain with gTLD** | `de.example.com`, `in.example.com` | Moderate (Configured via Search Console) | Moderate (Single domain purchase, split DNS) | Moderate | Partial (Googlebot treats subdomains as split hosts) | Moderate complexity, brand aligned. |
| **Subdirectory with gTLD** | `example.com/de/`, `example.com/in/` | High (Configured via hreflang and GSC) | Low (Unified domain, unified repository) | Low (Edge reverse proxy routing) | Maximum (100% direct inheritance of root equity) | **Recommended Enterprise Standard**. |
| **URL Parameter Query String** | `example.com?lang=de` | None | Low | Low | Fragmented | **Completely Unacceptable** (Causes crawl bloat). |

ccTLDs deliver unmistakable country relevance signals to search engine algorithms. However, each ccTLD functions as a completely independent web entity with zero inherited domain authority. An enterprise operating 20 separate ccTLD domains must execute 20 distinct, expensive link acquisition campaigns from scratch.

URL parameters using query strings fail international search standards entirely. Search engine crawlers struggle to index parameterized URLs efficiently, leading to crawl budget exhaustion and duplicate content conflicts.

#### 2.2 Why Subdirectories Represent the Optimal Enterprise Standard
For enterprise organizations, subdirectories on a global top-level domain (`example.com/country-language/`) represent the most defensible architecture. Subdirectories compound domain authority rather than fragmenting it.

Every external backlink acquired by any international subdirectory directly bolsters the PageRank of the root domain. This accumulated authority flows downward into all other regional subdirectories. New country launches on subdirectory architectures rank significantly faster because they immediately inherit the historical trust of the root domain.

```
SUBDIRECTORY EQUITY COMPOUNDING (RECOMMENDED)
               [Root Domain: example.com] (PageRank 100)
                   |                    |
         [/us/ Subdirectory]    [/in/ Subdirectory]
          (Direct Equity 100)    (Direct Equity 100)

ccTLD EQUITY FRAGMENTATION (EXPENSIVE)
  [example.com] (PR 100)  <-- ZERO LINK TRANSFER -->  [example.in] (PR 0)
```

Furthermore, subdirectories simplify operational maintenance. Engineering teams manage a single SSL certificate, unified DNS records, and a centralized content repository.

#### 2.3 Edge Reverse Proxy Architecture
Operating subdirectories does not require hosting all international content within a single physical application server. Enterprise engineering teams deploy reverse proxies at the Content Delivery Network (CDN) edge.

Under this model, the public root domain routes incoming network requests based on URI path prefixes. The edge proxy inspects the URL path and fetches content from distinct regional origin servers behind the scenes:

```
[Global User Request: example.com/de/katalog]
                     |
                     v
        [Cloudflare / Fastly Edge Proxy]
        |                              |
 (URI starts with /de/)      (URI starts with /us/)
        |                              |
        v                              v
[German Origin Server]        [US Origin Server]
 (Frankfurt Data Center)       (Virginia Data Center)
```

This decoupled architecture allows regional engineering teams to build on independent technology stacks while preserving unified root domain authority. The search engine crawler perceives a single, authoritative domain.

---

### Chapter 3: Hreflang Protocol Engineering & Cluster Geometry

#### 3.1 Syntax Standards: ISO 639-1 & ISO 3166-1 Alpha-2
The hreflang attribute instructs search engine crawlers regarding the linguistic and geographic targeting of alternative page versions. Web documents must format hreflang values strictly according to international standards.

Hreflang syntax requires a two-letter language code defined by ISO 639-1, optionally paired with a two-letter country code defined by ISO 3166-1 Alpha-2. The casing convention mandates lowercase for language and uppercase for country:

$$\text{hreflang} = \text{language}_{(\text{ISO 639-1})} \left[ - \text{COUNTRY}_{(\text{ISO 3166-1 Alpha-2})} \right]$$

```
VALID HREFLANG COMBINATIONS:
  - en-US : English language, United States geography
  - en-GB : English language, Great Britain geography
  - en-IN : English language, India geography
  - hi-IN : Hindi language, India geography
  - de-DE : German language, Germany geography
  - es-US : Spanish language, United States geography
  - ar-AE : Arabic language, United Arab Emirates geography
  - fr    : French language, Global geography (unrestricted by country)
```

A common engineering error involves using country codes alone (e.g., `hreflang="us"`), which search engines reject as invalid. Another frequent error is using `en-UK` instead of the correct ISO code `en-GB`. Country-only targeting is not supported by search engine hreflang parsers.

#### 3.2 The Bidirectional Handshake Invariant & Self-Referential Mandate
Search engine crawlers enforce strict topological validation rules to prevent third-party websites from falsely claiming linguistic association. Every page in an hreflang cluster must participate in a closed reciprocal handshake.

If Page A designates Page B as its Spanish alternate, Page B must contain a matching return tag pointing back to Page A. If Page B omits the reciprocal link, search engine algorithms discard the entire relationship.

```
BIDIRECTIONAL HANDSHAKE INVARIANT
[Page A: example.com/en/] <====== Reciprocal Link ======> [Page B: example.com/es/]
  - Includes alternate -> /es/                              - Includes alternate -> /en/
  - Includes SELF-REF  -> /en/                              - Includes SELF-REF  -> /es/
  - Includes x-default -> /                                  - Includes x-default -> /
```

Furthermore, every page must include a self-referential hreflang tag. Page A must explicitly link to itself within its own alternate link group. Omitting the self-referencing tag generates indexing errors in search console diagnostic panels.

The `x-default` parameter provides a critical fallback mechanism for users whose language settings match none of the designated regional pages. The `x-default` URL directs untargeted global visitors to a neutral international landing page or dynamic language selection portal.

#### 3.3 Implementation Channels: HTML Head vs XML Sitemaps
Organizations deploy hreflang clusters through two primary mechanisms: HTML document `<head>` elements or XML sitemap extensions. Catalog complexity determines the proper deployment channel.

Pushkar Shah defined the architectural threshold in Module 07:

```
DECISION THRESHOLD:
  - If Total Locales <= 50: Deploy via HTML <head> Link Tags
  - If Total Locales > 50  : Deploy via XML Sitemaps (<xhtml:link>)
```

##### Channel A: HTML `<head>` Deployment Pattern
```html
<head>
  <link rel="alternate" hreflang="en-US" href="https://example.com/en-us/shoes" />
  <link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/shoes" />
  <link rel="alternate" hreflang="hi-IN" href="https://example.com/hi-in/shoes" />
  <link rel="alternate" hreflang="x-default" href="https://example.com/shoes" />
  <link rel="canonical" href="https://example.com/en-us/shoes" />
</head>
```

##### Channel B: XML Sitemap Deployment Pattern
For massive international catalogs with hundreds of localized variants, inserting link tags into HTML document heads causes significant DOM bloat. Web engineering teams generate XML sitemaps containing localized `<xhtml:link>` nodes instead:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/en-us/shoes</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="https://example.com/en-us/shoes"/>
    <xhtml:link rel="alternate" hreflang="en-GB" href="https://example.com/en-gb/shoes"/>
    <xhtml:link rel="alternate" hreflang="hi-IN" href="https://example.com/hi-in/shoes"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://example.com/shoes"/>
  </url>
</urlset>
```

Moving hreflang annotations to XML sitemaps keeps HTML page sizes lean, accelerating Core Web Vitals performance while allowing centralized database updates.

---

### Chapter 4: Algorithmic Penalty Avoidance & Indexation Safeguards

#### 4.1 IP-Based Automatic Redirect Hazards: The John Mueller Warning
A frequent engineering error in international web development is configuring automatic server-side redirects based on incoming user IP addresses. When a user connects from a German IP, the edge server automatically responds with an HTTP 302 redirect sending them to `/de/`.

This automated redirection breaks search engine indexing. Pushkar Shah highlighted Google Search Advocate John Mueller official guidance in Module 07:

```
[Googlebot Crawler (Crawling from California, US IP)]
                      |
                      v
         [Incoming Request to example.com/in/]
                      |
        [Server Detects US IP Address]
                      |
                      v
         [FORCED AUTOMATIC 302 REDIRECT to example.com/us/]
                      |
                      v
   *** RESULT: Googlebot NEVER Crawls or Indexes example.com/in/! ***
```

Googlebot crawls almost exclusively from data center IP blocks located in the United States. If your edge server forces automatic IP redirects, Googlebot attempting to crawl your Indian (`/in/`) or German (`/de/`) pages will be forcefully redirected to the US version.

Consequently, your international pages will never be crawled, evaluated, or indexed. Search engines treat forced IP redirects as cloaking-adjacent behavior, suppressing international rankings across non-US markets.

#### 4.2 Non-Intrusive Language Recommendation Banners
The mathematically defensible alternative to forced IP redirection is deploying client-side or edge-injected language suggestion banners. This preserves complete crawler access while accommodating human users.

When a user visits a regional page from a discordant IP, the page renders normally with an HTTP 200 status code. An edge worker detects the IP mismatch and displays a polite, non-modal banner:

```
+---------------------------------------------------------------------------------+
|  It appears you are browsing from the United States.                            |
|  Would you like to switch to our US Store?       [ Switch to US ]  [ Stay Here X ] |
+---------------------------------------------------------------------------------+
|  https://example.com/in/catalog/running-shoes                                    |
|                                                                                 |
|  [Product Catalog Content Renders Cleanly for Googlebot Crawler Access]          |
+---------------------------------------------------------------------------------+
```

Search engine crawlers ignore client-side JavaScript banners and index the underlying HTML content without disruption. Human users maintain full control over their preferred shopping location.

#### 4.3 Analytics Segmentation: Country Views & The Unfiltered Baseline
Accurate measurement of international organic performance requires structured web analytics reporting. Lumping all international traffic into a single analytics reporting view hides localized conversion failures.

Analytics engineers must configure separate dedicated views for each target country within Google Analytics:

```
GLOBAL WEB PROPERTY (GA4 / Universal Analytics)
  |
  |-- View 1: Global Unfiltered Master (Raw baseline data, zero exclusions)
  |-- View 2: United States Only (Filtered to Country = United States)
  |-- View 3: United Kingdom Only (Filtered to Country = United Kingdom)
  |-- View 4: India Only (Filtered to Country = India)
```

The unfiltered master view preserves historical aggregate baseline data, guarding against accidental filter misconfigurations. Regional views isolate localized traffic metrics, bounce rates, and goal conversion funnels, enabling precise diagnostic troubleshooting.

---

### Chapter 5: Quantitative Forecasting & Goal Engineering

#### 5.1 The Strategic Goal Pyramid
Enterprise SEO projects fail when teams confuse operational tasks with commercial business outcomes. Pushkar Shah established the Goal Pyramid framework in Module 07 to categorize organizational objectives:

```
                     / \
                    /   \
                   /  1  \    OUTCOME GOALS (Revenue 2x, 500k Organic Visits)
                  /-------\
                 /    2    \   PERFORMANCE GOALS (Acquire 20 DA>40 Links, Lift CTR)
                /-----------\
               /      3      \  PROCESS GOALS (Deploy 500 Hreflang Tags, Publish 20 SOPs)
              /---------------\
```

1. **Outcome Goals**: High-level business milestones directly tied to corporate revenue (e.g., "Double organic search revenue in the UK market within 12 months").
2. **Performance Goals**: Intermediate operational metrics measuring channel efficiency (e.g., "Achieve top-3 rankings for 50% of commercial head terms").
3. **Process Goals**: Internal technical execution deliverables controlled directly by engineering teams (e.g., "Audit and deploy bidirectional hreflang tags across 50,000 catalog URLs").

#### 5.2 Bottom-Up Task Impact Forecasting Model
Executive leadership demands quantitative projections before approving international SEO capital expenditures. SEO leaders utilize bottom-up forecasting models to project organic traffic growth based on specific technical interventions.

The bottom-up forecasting equation isolates non-brand baseline traffic, assigns priority weighting, and accounts for engineering implementation lag:

$$\text{Forecast Sessions} = \text{Baseline Sessions} \times \left(1 + \sum_{i} \left( \text{Weight}_i \times \text{Lift}_i \times \text{Lag Factor}_i \right) \right)$$

```
BOTTOM-UP TASK IMPACT MATRIX:
+---------+------------------------------+----------+------------+------------+---------------+
| Task ID | Technical Optimization Task  | Priority | Est. Lift  | Lag Period | Net Month 6   |
+---------+------------------------------+----------+------------+------------+---------------+
| T-01    | Subdirectory Architecture    | P0 (High)| +35.0%     | 60 Days    | +28.0%        |
| T-02    | Hreflang Cluster Deployment  | P0 (High)| +25.0%     | 45 Days    | +21.5%        |
| T-03    | Localized Meta Tags & Schema | P1 (Med) | +12.0%     | 30 Days    | +11.0%        |
| T-04    | Regional Speed Optimization  | P2 (Low) | +5.0%      | 15 Days    | +4.8%         |
+---------+------------------------------+----------+------------+------------+---------------+
```

The model discounts theoretical gains by implementation lag factors (typically 30 to 90 days), providing realistic forecasts that build executive confidence.

#### 5.3 Top-Down Click Share & Market Share Modeling
Complementing the bottom-up model, top-down forecasting evaluates market search volume against search result click-through rate (CTR) curves across target competitor positions:

$$\text{Projected Visits} = \sum_{k \in \text{Keywords}} \left( \text{Search Volume}_k \times \text{CTR}(\text{Target Rank}_k) \times (1 - \text{SERP Feature Leakage}) \right)$$

Analysts aggregate search volumes for target keyword clusters in each country, applying empirical CTR distributions (Position 1: 30%, Position 2: 15%, Position 3: 10%). Factoring in click leakage to sponsored ads and featured snippets produces reliable top-down traffic ceilings.

#### 5.4 Case Study: Zee5 Multi-Lingual Deployment (303% Growth)
In Module 07, Pushkar Shah presented the multi-lingual international expansion executed for streaming entertainment platform Zee5 in 2019. The platform sought to expand its digital subscriber base across 9 regional Indian languages and global international diasporas.

The engineering team implemented clean subdirectory structures paired with comprehensive bidirectional hreflang clusters covering Hindi, Marathi, Telugu, Tamil, Kannada, Bengali, Gujarati, Punjabi, and Malayalam:

```
ZEE5 MULTI-LINGUAL EXPANSION BLUEPRINT
1. Subdirectory Regional Silos: `/hi/`, `/te/`, `/ta/`, `/mr/`, `/bn/`, `/gu/`
2. Bidirectional Hreflang Mesh: Full reciprocal cross-linking across all 9 languages
3. Non-Intrusive Regional Selector: Replaced forced redirects with geo-banners
4. XML Sitemap Distribution: Offloaded 500k URL hreflang maps to XML pipelines
```

The technical execution yielded an extraordinary 303% increase in organic search traffic within 12 months. Zee5 was awarded the Digital Crest 2019 Award and reached the finals of the DMA 2019 Awards for enterprise search excellence. The case study proves that rigorous international SEO execution drives rapid multi-regional growth.

#### 2.4 Cloudflare Workers Edge Reverse Proxy Implementation
Enterprise engineering teams utilize edge computing workers to route international subdirectory traffic without deploying independent origin servers. Cloudflare Workers or Fastly Compute services inspect incoming URL paths at network edge nodes.

The following edge worker script demonstrates how incoming subdirectory requests route to distinct regional origin backends while preserving root domain authority:

```javascript
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  // Define regional origin mapping
  const origins = {
    '/de/': 'https://de-origin.internal.example.com',
    '/in/': 'https://in-origin.internal.example.com',
    '/uk/': 'https://uk-origin.internal.example.com',
  };

  for (const [prefix, backend] of Object.entries(origins)) {
    if (pathname.startsWith(prefix)) {
      const backendUrl = new URL(request.url);
      backendUrl.hostname = new URL(backend).hostname;
      
      // Clone request and forward to regional origin
      const modifiedRequest = new Request(backendUrl, {
        method: request.method,
        headers: request.headers,
      });
      return fetch(modifiedRequest);
    }
  }

  // Fallback to default global origin
  return fetch(request);
}
```

This edge routing layer maintains single domain integrity for search crawlers. Regional application teams develop their services independently without risking global URL disruption.

#### 3.4 Automated Python XML Hreflang Sitemap Generator
Building XML sitemaps manually for thousands of localized pages causes syntax errors. A Python script consumes regional URL arrays and outputs validated XML markup adhering to schema standards.

The following automated script constructs bidirectional `<xhtml:link>` clusters across multiple target languages:

```python
import xml.etree.ElementTree as ET
from typing import List, Dict

def build_hreflang_sitemap(url_clusters: List[Dict[str, str]], output_path: str):
    urlset = ET.Element("urlset", {
        "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
    })

    for cluster in url_clusters:
        for lang_code, page_url in cluster.items():
            url_elem = ET.SubElement(urlset, "url")
            loc_elem = ET.SubElement(url_elem, "loc")
            loc_elem.text = page_url

            # Self-reference and reciprocal alternates
            for alt_lang, alt_url in cluster.items():
                ET.SubElement(url_elem, "xhtml:link", {
                    "rel": "alternate",
                    "hreflang": alt_lang,
                    "href": alt_url
                })

    tree = ET.ElementTree(urlset)
    tree.write(output_path, encoding="utf-8", xml_declaration=True)
```

The script guarantees that every generated XML node contains a self-referencing alternate link. It enforces reciprocal confirmation across all language variations automatically.

#### 4.4 Screaming Frog International SEO Validation & Regex Patterns
Auditing international deployments requires crawling staging environments to confirm that hreflang tags match live canonical configurations. Screaming Frog SEO Spider provides dedicated international audit reports.

Auditors apply custom regex extraction patterns to audit raw HTML headers directly:

```
+-----------------------------------+-------------------------------------------------------------+
| Audit Dimension                   | Screaming Frog Extraction Regex                             |
+-----------------------------------+-------------------------------------------------------------+
| Hreflang Language Extraction      | <link\s+[^>]*hreflang=["']([^"']+)["']                     |
| Hreflang Alternate URL Extraction | <link\s+[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']|
| HTML Lang Attribute Header        | <html\s+[^>]*lang=["']([^"']+)["']                          |
| Canonical URL Declaration         | <link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']|
+-----------------------------------+-------------------------------------------------------------+
```

These extraction rules verify that the HTML lang attribute matches the hreflang declaration. Furthermore, audits verify that no alternate URL targets a 301 redirect or 404 error page.

#### 5.5 The Zee5 Engineering Deployment Ledger & Language Routing Tables
The Zee5 deployment demonstrated how complex multi-lingual search architectures scale across diverse regional populations. The engineering team managed nine distinct regional language editions simultaneously.

The localized deployment ledger codified language codes, folder paths, and regional search volumes:

```
+--------------------+-------------+------------------+---------------------+-------------------+
| Target Language    | ISO Code    | URL Subdirectory | Search Volume Share | Regional Focus    |
+--------------------+-------------+------------------+---------------------+-------------------+
| Hindi              | hi-IN       | /hi/             | 42.0% of Total      | National / North  |
| Telugu             | te-IN       | /te/             | 14.5% of Total      | Andhra / Telangana|
| Tamil              | ta-IN       | /ta/             | 12.0% of Total      | Tamil Nadu        |
| Marathi            | mr-IN       | /mr/             | 9.5% of Total       | Maharashtra       |
| Bengali            | bn-IN       | /bn/             | 8.0% of Total       | West Bengal       |
| Kannada            | kn-IN       | /kn/             | 5.5% of Total       | Karnataka         |
| Malayalam          | ml-IN       | /ml/             | 4.0% of Total       | Kerala            |
| Gujarati           | gu-IN       | /gu/             | 2.5% of Total       | Gujarat           |
| Punjabi            | pa-IN       | /pa/             | 2.0% of Total       | Punjab            |
+--------------------+-------------+------------------+---------------------+-------------------+
```

Each language cluster maintained full reciprocal linking back to the default international English edition. This structured topology ensured balanced equity flow across all regional subdirectories.
"""

print(f"Volume 5 defined: {len(VOL_5_TEXT.split())} words.")

