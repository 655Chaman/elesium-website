# Elesium Technical SEO & Automation Playbook

Welcome to the Elesium SEO Engineering engine. As a technical recruit, your responsibility is maintaining, monitoring, and operating the infrastructure that ensures our React application dominates search rankings, Google AI Overviews, and organic discovery on full autopilot.

---

## 1. The Architecture (React + Vite + SSG Prerendering)

Elesium is architected as a high-performance React application built on Vite. Standard React Single Page Applications (SPAs) are client-rendered, meaning search engine bots (Googlebot, Bingbot) often see an empty `<div id="root"></div>`. 

To solve this without the overhead and hosting cost of Next.js, we engineered a custom **Static Site Generation (SSG)** pipeline.

### Static Site Generation (`automation/generate_ssg.py`)
Before deployment, our SSG script runs in Node/Python to pre-render our most critical static routes and every single blog post into static HTML with full SEO tags injected.
* When Googlebot visits `https://elesium.online/ai-automation-agency-india`, it receives a **200 OK fully hydrated HTML page** immediately.

**Key Pre-rendered Routes:**
* `/` (Homepage)
* `/how-we-work` (Process & Methodology)
* `/markets` (Industries & Enterprise Segments)
* `/ai-automation` (Service Architecture)
* `/ai-automation-agency-india` (Primary High-Intent India Pillar Page)
* `/signals/<slug>` (All 60+ dynamic blog and signal pages)

### Dynamic Head Management
We use `react-helmet-async` for head metadata management across all pages. The `<Helmet>` component dynamically binds the page title, meta description, canonical URL, and Open Graph / Twitter cards before SSG serialization.

---

## 2. Structured Data Architecture (JSON-LD)

Elesium employs a multi-tiered schema strategy to maximize eligibility for Google rich snippets and Knowledge Graph inclusion.

### Sitewide Local & Professional Schemas (`frontend/index.html`)
Hardcoded in the root document to establish entity authority:
* **`LocalBusiness` Schema:** Firmly ties Elesium to our physical headquarters in **Bangalore, Karnataka, India**.
* **`ProfessionalService` Schema:** Establishes commercial entity categories (AI System Architecture, Enterprise Automation).

### Component-Level Schemas (`FAQPage` & `Article`)
On service and blog pages, we embed structured `FAQPage` JSON-LD schemas. This triggers Google's accordion-style "People Also Ask" rich results.

---

## 3. The Autonomous SEO Engine (Strictly Linear Pipeline)

Our daily content and discovery engine is fully autonomous, running daily via **`.github/workflows/seo_engine.yml`** and orchestrated by **`automation/orchestrator.py`**.

```
[09:00 UTC / Manual Trigger]
         │
         ▼
[Phase 1: Competitor Intelligence] ───> Scrapes Indian AI competitors (Nimap, Maruti, Invensis)
         │                              Extracts gaps & enqueues high-intent keywords
         ▼
[Phase 2: 3-Agent GEO Autoblogger] ───> Pops next keyword from keywords_queue.json
         │                              Stage 1: Architect (Outline & unique angles)
         │                              Stage 2: Tech Lead (Python code & enterprise ROI)
         │                              Stage 3: Brutal Editor (Answer Capsules & Anti-AI)
         │                              Flux Image Generation & Injects into blogPosts.ts
         ▼
[Phase 3: Omnichannel Syndication] ───> Dev.to API / Hashnode republished payloads
         │                              Generates viral LinkedIn executive post & 6-tweet thread
         │                              Fires instant IndexNow, Bing, and Google crawl pings
         ▼
[Phase 4: SSG & Sitemap Compile] ─────> Rebuilds sitemap.xml with 69+ URLs
         │                              Prerenders full static HTML snapshots
         ▼
[Phase 5: Build & Production Deploy] ─> Verifies zero TypeScript build errors
                                        Pushes to main branch & deploys to GitHub Pages
```

### Key Automation Scripts:

1. **`automation/orchestrator.py`**:
   The master linear orchestrator. Runs all 5 phases sequentially, verifies build integrity, and halts immediately if any phase encounters an error.

2. **`automation/competitor_outrank_scraper.py`**:
   Monitors competitor sitemaps and blog archives (Nimap Infotech, Maruti Techlabs, Invensis). Identifies enterprise topics they cover, elevates them into higher-intent commercial keywords, and appends them to `automation/keywords_queue.json` under `COMPETITOR_OUTRANK`.

3. **`automation/free_researcher.py`**:
   Zero-cost live SERP intelligence. Performs headless DuckDuckGo searches and web parsing to extract top 10 search snippets, competitor headings, and factual citations for the target keyword in real time without any paid API keys.

4. **`automation/seo_autoblogger.py`**:
   Our 3-agent writing assembly line powered by NVIDIA NIM (`nvidia/llama-3.1-nemotron-70b-instruct` with Gemini 1.5 Pro fallback).
   * **Stage 1 (Architect):** Outline with proprietary methodology names (*EDAL, VPC Triad*).
   * **Stage 2 (Tech Lead):** Real code blocks (LangGraph, FastAPI), architecture tables, and Indian enterprise ROI metrics.
   * **Stage 3 (Brutal Editor):** Injects bold 40-word **Answer Capsules** under every `<h2>` heading for Google AI Overview ingestion, comparative matrices, and eliminates all AI buzzwords.
   * **Link Graph:** Computes cosine similarity to cross-link related blog posts and embeds anchor links to `/ai-automation-agency-india`.
   * **Slug & ID Hygiene:** Cleans slugs with strict regex and auto-increments sequential integer IDs.

5. **`automation/link_builder.py`**:
   Generates cross-platform syndication files with `canonical_url` tags pointing back to Elesium. Generates viral LinkedIn and Twitter copy in `automation/social_drafts/<slug>.md`, and triggers instant IndexNow API pings.

6. **`automation/generate_sitemap.py` & `automation/generate_ssg.py`**:
   Maintains dynamic XML sitemaps and pre-renders static HTML for all routes.

---

## 4. GitHub Actions CI/CD & Secrets Configuration

All automation is consolidated into **one clean workflow**: **`.github/workflows/seo_engine.yml`**.

* **Schedule:** Runs daily at `09:00 UTC` (and supports manual on-demand triggers via GitHub Actions `workflow_dispatch`).
* **Required GitHub Secrets:**
  * `NVIDIA_API_KEY`: Required for the 3-agent writing assembly line.
  * `GEMINI_API_KEY`: Required for fallback generation.
  * `DEVTO_API_KEY` (Optional): Enables direct auto-publishing to Dev.to.

---

## 5. Local Troubleshooting & Developer Commands

```bash
# 1. Test the full SEO pipeline locally
python3 automation/orchestrator.py

# 2. Recompile and verify frontend static build
cd frontend && npm run build

# 3. Manually run link syndication on the latest post
python3 automation/link_builder.py --latest

# 4. Check syntax of all automation scripts
python3 -m py_compile automation/*.py
```
