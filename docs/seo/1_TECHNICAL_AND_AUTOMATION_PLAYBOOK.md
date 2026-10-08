# Elesium Technical SEO & Automation Playbook

Welcome to the Elesium SEO and Automation engine. As a technical SEO hire, your primary responsibility is maintaining, debugging, and expanding the infrastructure that ensures our React Single Page Application (SPA) ranks aggressively on search engines while running on autopilot.

This playbook covers the exact architecture, scripts, and workflows powering Elesium.

## 1. The Architecture (React + Vite + SSG)

Elesium is built as a React SPA using Vite. Out of the box, React apps are essentially invisible to search engine crawlers because the content is rendered client-side via JavaScript. To solve this, we rely on a custom Static Site Generation (SSG) script.

### Static Site Generation (`automation/generate_ssg.py`)
Instead of migrating to Next.js or Remix, we use `automation/generate_ssg.py` to pre-render our most critical pages into static HTML before deployment. When Googlebot crawls the site, it sees fully populated HTML documents.

**Pre-rendered Routes:**
The SSG script explicitly pre-renders the following static routes:
* `/`
* `/how-we-work`
* `/markets`
* `/ai-automation`
* `/ai-automation-agency-india`

### Meta Tags and Head Management
We manage `<head>` metadata dynamically using `react-helmet-async`. Across these routes, the `<Helmet>` component injects critical SEO tags (Title, Description, Canonical URLs, and Open Graph tags) before the SSG script takes the HTML snapshot.

```tsx
// Example usage of Helmet in a route
import { Helmet } from 'react-helmet-async';

export default function AIAutomation() {
  return (
    <>
      <Helmet>
        <title>AI Automation Services | Elesium</title>
        <meta name="description" content="..." />
        <link rel="canonical" href="https://elesium.com/ai-automation" />
      </Helmet>
      {/* Page Content */}
    </>
  );
}
```

## 2. Structured Data (JSON-LD)

We aggressively use JSON-LD structured data to help search engines understand our business entities and content structure.

### Core Business Schemas (`frontend/index.html`)
In the root `frontend/index.html`, we embed standard schemas that claim our local and professional presence. This is hardcoded so it applies sitewide.
* **LocalBusiness Schema:** Claims our physical location in Bangalore, India.
* **ProfessionalService Schema:** Signals to Google the exact nature of our B2B services.

### Dynamic Schemas (FAQPage)
For pages with FAQs (like `/ai-automation-agency-india`), we embed `FAQPage` schema directly in the components. This makes Elesium eligible for rich results (accordion-style Q&As in the SERP).

## 3. The Blog Automation Pipeline (Crucial)

Our content engine is entirely automated. We monitor target sources, rewrite content using AI, and publish directly to our codebase. This is handled by a sophisticated pipeline centered around `automation/nimap_monitor.py`.

### Scraping & AI Rewriting (`automation/nimap_monitor.py`)
This script is the heart of the blog engine:
1. **Scraping:** It scrapes target URLs for new industry content.
2. **AI Rewriting:** It uses NVIDIA/Gemini LLM APIs to completely rewrite the scraped content, ensuring it passes plagiarism checks while maintaining SEO relevance.
3. **Injection:** The newly generated content is formatted and automatically injected into `blogPosts.ts`, making it immediately available to the frontend.

### CI/CD Automation (`.github/workflows/nimap_sync.yml`)
The entire pipeline runs on autopilot via GitHub Actions. The `.github/workflows/nimap_sync.yml` workflow triggers daily via a cron schedule, executing the monitor script and committing new blog posts directly to the repository.

### The Alert System
Since this is a headless automated process, we have safeguards to prevent silent failures.
* **State Tracking:** `automation/last_run_status.json` logs the success/failure state of every run.
* **Failure Counting:** `automation/consecutive_no_posts.txt` keeps an integer count of how many consecutive days the pipeline failed to generate a new post.
* **GitHub Issues:** If the script fails for **7 consecutive days**, the automation automatically opens a high-priority GitHub Issue tagging the engineering/SEO team for manual intervention.

## 4. Sitemap & Search Engine Pings

Creating content is only half the battle; search engines need to index it immediately.

### Sitemap Generation (`automation/generate_sitemap.py`)
Before every deployment, `automation/generate_sitemap.py` crawls the registered routes and the latest blog entries to generate a fresh `sitemap.xml`. This ensures new automated blog posts are immediately discoverable.

### Search Engine Pings (`deploy.yml`)
To force fast indexing, our deployment pipeline (`deploy.yml`) automatically pings Google and Bing's webmaster endpoints with our updated sitemap URL after every successful deployment.

```yaml
# Snippet from deploy.yml
- name: Ping Search Engines
  run: |
    curl -s "https://www.google.com/ping?sitemap=https://elesium.com/sitemap.xml"
    curl -s "https://www.bing.com/ping?sitemap=https://elesium.com/sitemap.xml"
```

---
*Keep this playbook updated as the pipeline evolves. For any issues with the automated blog injection, start debugging at `nimap_monitor.py` first.*
