# Elesium: Content & Off-Page SEO Playbook

Welcome to the Growth & Marketing team at Elesium. This playbook is your exact, step-by-step manual for executing our aggressive SEO, content, and off-page authority strategy. Read this carefully. Execution is everything.

---

## 1. The Core Strategy: "India AI Automation Agency"

We are aggressively positioning Elesium for high-intent, enterprise keywords, specifically targeting **"India"** and **"Enterprise AI Automation"**. 

**Why India?** 
India is rapidly becoming the global hub for AI talent and implementation. By explicitly targeting "India AI Automation Agency", we capture both domestic enterprise demand and international companies looking for top-tier, cost-effective AI engineering hubs. 

**E-E-A-T (Expertise, Authoritativeness, Trustworthiness)**
Google's algorithm heavily weights E-E-A-T. We manufacture these signals through our About page and location data. 
*   **Founder Context:** We leverage our founders' backgrounds to establish deep technical expertise. We aren't just marketers; we are engineers.
*   **Bangalore Location:** Being headquartered in Bangalore (the Silicon Valley of India) is a massive trust signal. It validates our "India AI" positioning and gives us a massive advantage in local search authority.

---

## 2. Content Guidelines for New Blogs

Elesium does not publish generic AI-slop. If it reads like a standard ChatGPT output, it gets deleted. Our content must be highly technical, specific, and ROI-driven.

**Where to Add Content:**
New blog posts must be structured and added in: `frontend/src/data/blogPosts.ts`.

**Strict Content Requirements:**
1.  **No Generic Fluff:** Avoid phrases like "AI is revolutionizing the world." 
2.  **Specific Technologies Only:** You MUST mention the actual stack we use. Talk about **LangChain**, **n8n**, **Llama 3**, vector databases (Pinecone/Weaviate), and RAG architectures. Show, don't tell.
3.  **Hard ROI Metrics:** Every case study or hypothetical implementation must include hard numbers. "Reduced processing time by 40%", "Saved 20 hours per week", "Decreased API costs by 15%".
4.  **India-Specific Context:** Weave in references to Indian enterprise challenges, compliance (DPDP Act if relevant), or the local tech ecosystem to reinforce our core keyword strategy.
5.  **Always Include Structured FAQs:** Every post MUST end with a structured FAQ section. This targets "People Also Ask" snippets on Google. Use exact match phrasing from keyword research for the questions.

---

## 3. Off-Page Authority: The Missing Blind Spots (Action Items)

Creating content is only 20% of the battle. The rest is authority building. As a new hire, your immediate task is to execute the directory strategy.

### Directory Submissions (The "Trust" Stack)
Ready-to-paste company profiles, descriptions, and assets are located in: `automation/directory_profiles/`. Do not write new ones from scratch.

*   **Clutch.co:** 
    *   URL: [https://clutch.co/](https://clutch.co/)
    *   Action: Submit the Elesium profile. Request reviews from our initial beta clients. Clutch is critical for B2B trust.
*   **GoodFirms:** 
    *   URL: [https://www.goodfirms.co/](https://www.goodfirms.co/)
    *   Action: Create an agency profile under "Artificial Intelligence" and "Automation". Paste the provided bio.
*   **G2:** 
    *   URL: [https://www.g2.com/](https://www.g2.com/)
    *   Action: List Elesium as a service provider (not a software product). 

### Technical Off-Page Actions
*   **Google Search Console (GSC):** 
    *   URL: [https://search.google.com/search-console](https://search.google.com/search-console)
    *   Action: Whenever you publish a new page or blog, you must manually submit `https://elesium.online/sitemap.xml` and use the URL Inspection Tool to force-index the new page immediately. Do not wait for Google to find it.
*   **Google Business Profile (GBP) - CRITICAL:**
    *   URL: [https://www.google.com/business/](https://www.google.com/business/)
    *   Action: Claim and verify the Bangalore office on Google Maps. **This is mandatory.** Without a verified GBP, our `LocalBusiness` schema markup on the website will not trigger the local map pack in search results. 
*   **Startup India Hub (.gov.in backlink):**
    *   URL: [https://www.startupindia.gov.in/](https://www.startupindia.gov.in/)
    *   Action: Register Elesium. This is the single most important early backlink we can get. A `.gov.in` domain pointing to our site massively accelerates our domain authority.

---

## 4. The Conversion Strategy (The WhatsApp Exclusive Flow)

We do not use open Calendly links on our site. 

**The Psychology:**
Dropping a naked Calendly link looks desperate and low-value. We position Elesium as a premium, high-demand enterprise agency. If anyone can book a meeting, our time isn't valuable. We want friction, but *smart* friction.

**The Workflow:**
1.  All CTAs (Call to Actions) across the site do NOT route to a scheduling page. 
2.  Instead, they route to a **premium, pre-filled WhatsApp Business message**. 
3.  This enforces exclusivity. The lead feels like they are opening a direct, private channel of communication rather than filling out a generic form.
4.  **Pre-Qualification:** Once they send the WhatsApp message, our n8n automation intercepts it. We run an automated pre-qualification flow right inside WhatsApp (asking about budget, timeline, and use case) BEFORE they are ever given a link to actually book a meeting with the founders.

Execution is everything. Stick to the playbook.
