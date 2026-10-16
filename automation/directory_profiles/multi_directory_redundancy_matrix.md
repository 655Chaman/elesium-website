# Multi-Platform Entity Redundancy Matrix & Directory Playbook

> **Framework:** Michael Merlino Entity Corroboration & Knowledge Graph Grounding Architecture  
> **Entity Target:** Elesium (`https://elesium.online`)  
> **Corporate Identity:** Elesium Online, Koramangala 4th Block, Bengaluru, Karnataka, India  
> **Strategic Objective:** Eliminate single-gatekeeper dependency and corroborate Elesium across independent, high-authority entity nodes to force immediate Google Knowledge Graph generation and AI Answer Engine citation.

---

## 1. The Michael Merlino Entity Corroboration Framework

The single biggest vulnerability for early-stage B2B agencies is **Single Point of Failure (SPOF) directory dependency**. If an agency banks its entire reputation on a single platform (e.g., GoodFirms or Clutch), a single algorithmic review flag, automated filter glitch, or delayed moderation cycle can freeze commercial acquisition and delay Knowledge Graph formation.

### Merlino's Triangulation Theorem:
Google’s Knowledge Graph algorithms and modern generative AI models (Perplexity, ChatGPT Search, Gemini AI Overviews) evaluate entity confidence through **Algorithmic Triangulation**:

$$\text{Entity Confidence Score } \mathcal{E} = \sum_{i=1}^{N} \left( \mathcal{W}_i \cdot \text{NAP\_Match}_i \cdot \text{Bidirectional\_Link}_i \right)$$

Where:
- $\mathcal{W}_i$ is the Domain Authority & Trust Weight of platform $i$.
- $\text{NAP\_Match}_i = 1.0$ if Name, Address, Phone, and Domain are 100% character-for-character identical across the profile and the rendered website DOM.
- $\text{Bidirectional\_Link}_i = 1.0$ if the platform links to `https://elesium.online` AND `https://elesium.online` links to the platform profile via Schema.org `sameAs`.

```
                        MICHAEL MERLINO ENTITY CORROBORATION GRAPH
                                  ┌───────────────────┐
                                  │   Wikidata & DB   │
                                  │   (Q11660 / AI)   │
                                  └─────────▲─────────┘
                                            │
                        ┌───────────────────┴───────────────────┐
                        │                                       │
              ┌─────────▼─────────┐                   ┌─────────▼─────────┐
              │     Clutch.co     │                   │     GoodFirms     │
              │  (DR 92 / Phone)  │                   │ (DR 86 / Dossier) │
              └─────────▲─────────┘                   └─────────▲─────────┘
                        │                                       │
                        │        ┌─────────────────────┐        │
                        ├───────►│   ELESIUM ROOT DOM  │◄───────┤
                        │        │ https://elesium.online│      │
                        │        │  (Schema.org @graph)│        │
                        │        └──────────▲──────────┘        │
                        │                   │                   │
              ┌─────────▼─────────┐         │         ┌─────────▼─────────┐
              │     G2 Platform   │◄────────┼────────►│    Trustpilot     │
              │  (DR 91 / B2B AI) │         │         │ (DR 93 / Reviews) │
              └───────────────────┘         │         └───────────────────┘
                                  ┌─────────▼─────────┐
                                  │ Google Business   │
                                  │ Profile (GBP CID) │
                                  └───────────────────┘
```

---

## 2. Directory Platform Setup Guidelines

### 2.1 Trustpilot Setup Guidelines (DR 93 — Global Consumer & Business Trust)

Trustpilot is the highest-authority consumer review platform on the web. Reviews indexed on Trustpilot feed directly into Google’s merchant and service knowledge panels.

#### Profile Creation & Configuration:
1. **Domain Claiming:** Navigate to `https://business.trustpilot.com/` and claim `elesium.online` using the corporate administrative email (`contact@elesium.online` or `chamansyed655@gmail.com`).
2. **Company Display Name:** `Elesium` (Operating Brand) / `Elesium Online` (Legal Entity).
3. **Primary Category Selection:**  
   - Primary: *Software & Computer Consulting*  
   - Secondary: *Internet Marketing & AI Automation*
4. **NAP Consistency:**
   - **Address:** Koramangala 4th Block, Bengaluru, Karnataka 560034, India
   - **Phone:** `+91-8317329312`
   - **Website:** `https://elesium.online`
5. **Brand Assets:**
   - Upload high-resolution logo (`LOGO_NEW.png` / 1200x1200px transparent PNG).
   - Set brand description matching the exact semantic statement:  
     > *"India's premier AI engineering firm building deterministic multi-agent systems and sovereign private VPC infrastructure for enterprise workflows, delivering an audited 3x–5x cash-flow ROI in 90 days."*

#### Review Collection Protocol:
- **Verified Business Invitations:** Use Trustpilot's automated email dispatch tool. Invitations sent through the business portal are tagged as **"Verified Reviewer"**, which triggers zero spam friction.
- **Review Target:** Collect 3 verified reviews within 30 days to unlock the TrustScore star rating widget.

---

### 2.2 G2 Platform Setup Guidelines (DR 91 — Software & Enterprise Workflow Authority)

G2 is the undisputed authority for software evaluation and B2B software engineering solutions. Inclusion on G2 drives syndication across Gartner Digital Markets and triggers commercial discovery in ChatGPT Search.

#### Profile Creation & Categorization:
1. **Claim Listing:** Navigate to `https://sell.g2.com/` and claim the profile under **Elesium AI Automation Platform**.
2. **Category Mapping (Critical for G2 Grid Algorithm):**
   - Category 1: **AI Workflow Automation**
   - Category 2: **Business Process Automation (BPA)**
   - Category 3: **Intelligent Document Processing (IDP)**
3. **Core Platform Features to Declare:**
   - Deterministic Multi-Agent Orchestration (LangGraph state machines)
   - Private VPC & On-Premise LLM Hosting (Zero Data Retention)
   - Legacy ERP/SAP S/4HANA Bidirectional Middleware
   - Autonomous Document & Tender Specification Extraction (Vision-Language Models)
   - Real-Time Hard Cash-Flow ROI Telemetry
4. **Review Authentication Rule:**
   - G2 requires reviewers to log in with an **active LinkedIn account or verified corporate email**.
   - Reviewers must declare their organization size and software usage frequency to earn the "Validated User" badge.

---

### 2.3 Google Business Profile (GBP) Setup Guidelines (Local Entity & Maps Anchor)

Google Business Profile is the foundational local entity anchor for the Google Knowledge Graph. Without a verified GBP, Google treats an entity as purely virtual, delaying Knowledge Graph entity reconciliation.

#### Profile Parameters:
| Attribute | Exact Grounding Value | Algorithmic Importance |
| :--- | :--- | :--- |
| **Business Name** | **Elesium** | Exact brand name; zero keyword-stuffing to avoid suspension. |
| **Primary Category** | **Software company** | Highest semantic alignment with Google’s core taxonomy. |
| **Secondary Categories** | *Computer support and services*, *Information technology consulting* | Broadens local commercial query surface. |
| **Street Address** | Koramangala 4th Block | Exact physical micro-zone matching Schema.org address. |
| **City, State, PIN** | Bengaluru, Karnataka 560034 | Grounded in Bangalore IT corridor. |
| **Country** | India (IN) | Primary domestic market. |
| **Geo Coordinates** | `12.9352° N, 77.6245° E` | Micro-zone centroid for Koramangala 4th Block. |
| **Direct Phone** | `+91-8317329312` | Matches all directory and website footers. |
| **Website URL** | `https://elesium.online` | Strict HTTPS canonical URL. |
| **Opening Hours** | Monday – Friday: 09:00 – 19:00 IST | Signals active commercial establishment. |

#### Verification & CID Generation:
1. Complete phone/video verification via Google Business console.
2. Extract the canonical **Google Maps CID (Customer ID)**:
   - Search for the claimed business in Google Maps.
   - Inspect the source code or use Google CID finder tools to retrieve the raw CID hex/decimal string (e.g., `https://maps.google.com/?cid=XXXXXXXXXXXXXXXXXX`).
3. Embed the CID link directly into the Schema.org `sameAs` array to permanently fuse the GBP listing to the online domain.

---

## 3. Schema.org `sameAs` Cross-Referencing Checklist

To achieve total algorithmic corroboration under Michael Merlino's framework, every platform profile must be symmetrically linked. The website must point to the platforms in its Schema JSON-LD, and every platform profile must point back to `https://elesium.online`.

### 3.1 The Canonical Knowledge Graph `@graph` Specification

Below is the updated, unified JSON-LD schema to maintain within `frontend/index.html` and SSG metadata templates:

```json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
      "@id": "https://elesium.online/#organization",
      "name": "Elesium",
      "alternateName": ["Elesium Online", "Elesium AI Engineering"],
      "legalName": "Elesium Online",
      "url": "https://elesium.online",
      "logo": {
        "@type": "ImageObject",
        "url": "https://elesium.online/og-image.png",
        "width": "1200",
        "height": "630"
      },
      "image": "https://elesium.online/og-image.png",
      "description": "India's premier AI engineering firm building deterministic multi-agent systems and sovereign private VPC infrastructure for enterprise workflows, delivering an audited 3x–5x cash-flow ROI in 90 days.",
      "telephone": "+91-8317329312",
      "email": "contact@elesium.online",
      "foundingDate": "2024",
      "priceRange": "$$$",
      "currenciesAccepted": "INR, USD, EUR, GBP",
      "paymentAccepted": "Wire Transfer, Corporate Invoicing",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Koramangala 4th Block",
        "addressLocality": "Bengaluru",
        "addressRegion": "Karnataka",
        "postalCode": "560034",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 12.9352,
        "longitude": 77.6245
      },
      "areaServed": [
        { "@type": "Country", "name": "India" },
        { "@type": "Country", "name": "United States" },
        { "@type": "Country", "name": "Netherlands" },
        { "@type": "Country", "name": "United Kingdom" },
        { "@type": "Place", "name": "Global" }
      ],
      "sameAs": [
        "https://www.goodfirms.co/company/elesium-online",
        "https://clutch.co/profile/elesium-online",
        "https://www.g2.com/products/elesium-ai-automation-platform",
        "https://www.trustpilot.com/review/elesium.online",
        "https://www.linkedin.com/in/chaman-elesium",
        "https://github.com/655Chaman/elesium-website",
        "https://www.wikidata.org/wiki/Q11660"
      ],
      "knowsAbout": [
        "https://www.wikidata.org/wiki/Q11660",
        "https://www.wikidata.org/wiki/Q2539",
        "https://www.wikidata.org/wiki/Q289569",
        "LangGraph",
        "Multi-Agent Systems",
        "Private VPC Infrastructure",
        "Deterministic AI Orchestration",
        "SAP S/4HANA Integration",
        "DPDP Act 2023 Compliance"
      ]
    }
  ]
}
```

---

### 3.2 Symmetrical Cross-Referencing Audit Checklist

Before launching a review campaign or announcing new profile listings, execute this audit to guarantee 100% entity consistency:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BIDIRECTIONAL ENTITY AUDIT CHECKLIST                            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [ ] 1. Canonical Domain Match:                                                         │
│     Does every profile link to "https://elesium.online" without trailing slashes,      │
│     subdomains, or HTTP redirects?                                                     │
│                                                                                        │
│ [ ] 2. Character-for-Character NAP Parity:                                             │
│     • Name: "Elesium" (Brand) / "Elesium Online" (Legal Entity)                        │
│     • Address: "Koramangala 4th Block, Bengaluru, Karnataka 560034, India"             │
│     • Phone: "+91-8317329312"                                                          │
│                                                                                        │
│ [ ] 3. Schema.org sameAs Population:                                                   │
│     Are the exact verified profile URLs populated in frontend/index.html @graph?       │
│                                                                                        │
│ [ ] 4. Reverse Backlink Verification:                                                  │
│     Does GoodFirms display the backlink to https://elesium.online?                     │
│     Does Clutch display the backlink to https://elesium.online?                        │
│     Does G2 display the backlink to https://elesium.online?                            │
│     Does Trustpilot display the backlink to https://elesium.online?                    │
│     Does Google Business Profile website button lead to https://elesium.online?        │
│                                                                                        │
│ [ ] 5. Footer Badge Symmetry:                                                          │
│     Are verified badges for GoodFirms, Clutch, G2, and Trustpilot visible in the      │
│     site footer (frontend/src/components/layout/Footer.tsx) with rel="noopener"?      │
│                                                                                        │
│ [ ] 6. Rich Results & Schema Validator Test:                                           │
│     Has the page passed Google's Rich Results Test (https://search.google.com/test/)   │
│     with 0 errors and 0 warnings on Organization, LocalBusiness, and Service objects?  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Multi-Platform Review Distribution Matrix

Distribute your incoming client reviews across platforms to maximize authority diversification:

| Client Archetype | Optimal Platform | Strategic Rationale | Review Type |
| :--- | :--- | :--- | :--- |
| **International Enterprise Client (Herculan B.V., Netherlands)** | **GoodFirms** | Resubmit via formal appeal dossier to unlock GoodFirms Leaders Matrix. | Written corporate review + PCE contract proof |
| **Enterprise Operations / CTO (Guy #2, Mid-Market / FinTech)** | **Clutch.co** | 15-minute phone interview bypasses spam filters and earns the telephone-verified badge. | 15-min Analyst Phone Interview |
| **SaaS / Platform User (CTO or Technical Lead)** | **G2** | Establishes software product classification under AI Workflow Automation. | Validated LinkedIn / Corporate Email |
| **Domestic Enterprise / BFSI Executive (India)** | **Google Business Profile** | Powers the Local 3-Pack and Google Knowledge Graph in Bangalore/India. | Direct Google Account Review |
| **Commercial Buyer / General Contractor** | **Trustpilot** | High-DR indexation ensures immediate snippet star-rating visibility in Google SERPs. | Verified Business Email Invitation |

By maintaining this 5-point distribution, Elesium becomes mathematically resilient against any single platform's algorithmic volatility or moderation delays.
