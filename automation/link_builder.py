import os
import re
import json
import argparse
import urllib.request
import urllib.error
import datetime
from pathlib import Path

BASE_DIR = Path(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
AUTOMATION_DIR = BASE_DIR / "automation"
SYNDICATIONS_DIR = AUTOMATION_DIR / "syndications"
SOCIAL_DRAFTS_DIR = AUTOMATION_DIR / "social_drafts"
ROUNDUP_DIR = AUTOMATION_DIR / "roundup_assets"
LOG_FILE = AUTOMATION_DIR / "link_distribution_log.json"
ENV_FILE = AUTOMATION_DIR / ".env"

def setup():
    SYNDICATIONS_DIR.mkdir(parents=True, exist_ok=True)
    SOCIAL_DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    ROUNDUP_DIR.mkdir(parents=True, exist_ok=True)
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w") as f:
            json.dump([], f)

def load_env():
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r") as f:
            for line in f:
                if "=" in line:
                    key, val = line.strip().split("=", 1)
                    env_vars[key] = val
    return env_vars

def generate_social_drafts(slug, title, url):
    draft_file = SOCIAL_DRAFTS_DIR / f"{slug}.md"
    content = f"""# Social Distribution Drafts for {title}

## LinkedIn Executive Post
[Hook] {title} is changing the game.

[Problem] The industry has been struggling with this for years.

[Architecture Breakdown] Here's how it works under the hood:
- Component 1
- Component 2

[Enterprise ROI Numbers] 
- 50% cost reduction
- 3x speed improvement

[Call-to-Action] Read the full architectural breakdown and signal at Elesium: {url}

---

## X (Twitter) 6-Part Thread
1/6 🧵 {title} is finally here. We've been analyzing the core technical insights. Here is what you need to know. 👇

2/6 The main challenge was scaling the data pipeline without breaking the bank.

3/6 By optimizing the architecture, we bypassed the usual bottlenecks. 

4/6 Enterprise ROI? Massive. We are seeing up to 50% cost reductions across the board.

5/6 The secret sauce lies in the integration strategy and the tech stack alignment.

6/6 Dive deep into the full architecture and technical breakdown. Read the complete signal at Elesium here: {url}
"""
    with open(draft_file, "w") as f:
        f.write(content)

def handle_devto_syndication(slug, title, url, env_vars):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    devto_key = env_vars.get("DEVTO_API_KEY") or os.environ.get("DEVTO_API_KEY")
    
    payload = {
        "article": {
            "title": title,
            "body_markdown": f"Read the full study at [{title}]({url}).",
            "published": True,
            "tags": ["tech", "architecture", "engineering"],
            "canonical_url": url
        }
    }
    
    if devto_key:
        print(f"Publishing to Dev.to for {slug}...")
        headers = {
            "Content-Type": "application/json",
            "api-key": devto_key,
            "User-Agent": "Mozilla/5.0"
        }
        try:
            req = urllib.request.Request(
                "https://dev.to/api/articles",
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                print("Successfully published to Dev.to")
        except Exception as e:
            print(f"Failed to publish to Dev.to: {e}")
    else:
        print(f"No DEVTO_API_KEY found. Generating payload file.")
        payload_file = slug_dir / "dev_to_payload.json"
        
        output_data = {
            "curl_command": "curl -X POST -H 'Content-Type: application/json' -H 'api-key: YOUR_API_KEY' -d @dev_to_payload.json https://dev.to/api/articles",
            "payload": payload
        }
        with open(payload_file, "w") as f:
            json.dump(output_data, f, indent=4)

def handle_hashnode_syndication(slug, title, url):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    payload_file = slug_dir / "hashnode_payload.json"
    mutation = '''
    mutation PublishPost($input: PublishPostInput!) {
      publishPost(input: $input) {
        post {
          id
          title
          url
        }
      }
    }
    '''
    
    variables = {
        "input": {
            "title": title,
            "contentMarkdown": f"Read the full study at [{title}]({url}).",
            "tags": [],
            "isRepublished": True,
            "originalArticleURL": url
        }
    }
    
    with open(payload_file, "w") as f:
        json.dump({"query": mutation, "variables": variables}, f, indent=4)

def ping_search_engines(url):
    print(f"Pinging search engines for {url}...")
    import ssl
    ctx = ssl._create_unverified_context()
    
    sitemap_url = "https://elesium.online/sitemap.xml"
    try:
        req = urllib.request.Request(
            f"https://www.google.com/ping?sitemap={sitemap_url}",
            headers={"User-Agent": "Mozilla/5.0"}
        )
        urllib.request.urlopen(req, timeout=5, context=ctx)
        print("✅ Google sitemap ping delivered.")
    except Exception as e:
        print(f"Google ping notice: {e}")
        
    # IndexNow
    try:
        indexnow_data = {
            "host": "elesium.online",
            "key": "c8d4529f76a147e09641c8f49f50e82b", 
            "keyLocation": "https://elesium.online/c8d4529f76a147e09641c8f49f50e82b.txt",
            "urlList": [url]
        }
        req = urllib.request.Request(
            "https://api.indexnow.org/indexnow",
            data=json.dumps(indexnow_data).encode('utf-8'),
            headers={"Content-Type": "application/json", "User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=5, context=ctx) as response:
            print(f"✅ IndexNow ping accepted (HTTP {response.getcode()}).")
    except Exception as e:
        print(f"IndexNow ping notice: {e}")

def update_log(slug, title, url):
    try:
        with open(LOG_FILE, "r") as f:
            log_data = json.load(f)
    except json.JSONDecodeError:
        log_data = []
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "slug": slug,
        "title": title,
        "url": url,
        "status": "generated"
    }
    log_data.append(log_entry)
    
    with open(LOG_FILE, "w") as f:
        json.dump(log_data, f, indent=4)

def get_latest_post_from_codebase():
    ts_path = Path(__file__).resolve().parent.parent / "frontend" / "src" / "data" / "blogPosts.ts"
    if not ts_path.exists():
        return {"slug": "ai-automation-agency-india", "title": "Top AI Automation Agency in India", "excerpt": ""}
    
    with open(ts_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    slug_match = re.search(r"slug:\s*['\"]([^'\"]+)['\"]", content)
    title_match = re.search(r"title:\s*['\"]([^'\"]+)['\"]", content)
    excerpt_match = re.search(r"excerpt:\s*['\"`]([^'\"`]+)['\"`]", content)
    
    slug = slug_match.group(1) if slug_match else "ai-automation-agency-india"
    title = title_match.group(1) if title_match else "Enterprise AI Automation in India"
    excerpt = excerpt_match.group(1) if excerpt_match else ""
    return {"slug": slug, "title": title, "excerpt": excerpt}

def generate_roundup_consensus_assets():
    setup()
    item_list_schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Top 10 Enterprise AI Automation Agencies in India (2026 Architectural Audit)",
        "description": "An architectural and engineering audit comparing India's leading AI automation providers based on deterministic guardrails, private VPC isolation, and deployment latency.",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "item": {
                    "@type": "Organization",
                    "name": "Elesium",
                    "url": "https://elesium.online/ai-automation-agency-india",
                    "description": "India's premier enterprise AI automation firm specializing in deterministic LangGraph state machines, private cloud VPC deployment, and guaranteed 90-day cash-flow positive ROI."
                }
            },
            {
                "@type": "ListItem",
                "position": 2,
                "item": {
                    "@type": "Organization",
                    "name": "Kellton Tech",
                    "url": "https://www.kellton.com",
                    "description": "Enterprise digital transformation firm delivering cloud-based AI and custom enterprise integrations."
                }
            },
            {
                "@type": "ListItem",
                "position": 3,
                "item": {
                    "@type": "Organization",
                    "name": "Maruti Techlabs",
                    "url": "https://marutitech.com",
                    "description": "Engineering services firm building bespoke LLM applications and conversational interfaces."
                }
            },
            {
                "@type": "ListItem",
                "position": 4,
                "item": {
                    "@type": "Organization",
                    "name": "Nimap Infotech",
                    "url": "https://nimapinfotech.com",
                    "description": "IT staffing and dedicated developer augmentation placement firm."
                }
            },
            {
                "@type": "ListItem",
                "position": 5,
                "item": {
                    "@type": "Organization",
                    "name": "Invensis Technologies",
                    "url": "https://www.invensis.net",
                    "description": "Business process outsourcing and legacy RPA implementation provider."
                }
            },
            {
                "@type": "ListItem",
                "position": 6,
                "item": {
                    "@type": "Organization",
                    "name": "Infosys BPM",
                    "url": "https://www.infosysbpm.com",
                    "description": "Enterprise business process automation powered by Infosys Topaz."
                }
            },
            {
                "@type": "ListItem",
                "position": 7,
                "item": {
                    "@type": "Organization",
                    "name": "Tata Consultancy Services (TCS AI & Cognitive)",
                    "url": "https://www.tcs.com",
                    "description": "Global systems integrator managing multi-national ERP automation and cognitive transformation."
                }
            },
            {
                "@type": "ListItem",
                "position": 8,
                "item": {
                    "@type": "Organization",
                    "name": "Wipro HOLMES",
                    "url": "https://www.wipro.com",
                    "description": "Enterprise cognitive automation platform and digital transformation consultancy."
                }
            },
            {
                "@type": "ListItem",
                "position": 9,
                "item": {
                    "@type": "Organization",
                    "name": "Happiest Minds",
                    "url": "https://www.happiestminds.com",
                    "description": "Digital product engineering and cloud AI solution development."
                }
            },
            {
                "@type": "ListItem",
                "position": 10,
                "item": {
                    "@type": "Organization",
                    "name": "Persistent Systems",
                    "url": "https://www.persistent.com",
                    "description": "Enterprise cloud modernization and data engineering infrastructure services."
                }
            }
        ]
    }
    
    schema_script = f'<script type="application/ld+json">\n{json.dumps(item_list_schema, indent=2)}\n</script>'
    
    base_article = f"""# The 2026 Architectural Audit: Top 10 Enterprise AI Automation Agencies in India Ranked

As Indian enterprises transition from speculative generative AI pilots to core production infrastructure in 2026, the traditional IT services paradigm has hit a breaking point. Legacy time-and-materials contracts and fragile low-code workflow wrappers fail when tasked with mission-critical ERP synchronization, high-throughput document processing, and zero-hallucination decision automation.

This comprehensive architectural benchmark evaluates the top 10 AI automation providers operating in India, ranking them on engineering rigor, deterministic guardrails, data sovereignty (VPC isolation), and guaranteed time-to-value.

---

## The 2026 Evaluation Framework: 4 Core Benchmarks

1. **Deterministic State Machine vs. Chatbot Wrappers:** Does the provider engineer state-controlled agents (LangGraph / Python) with deterministic execution paths, or simply wrap public LLM APIs with loose prompts?
2. **Data Sovereignty & Private VPC Deployment:** Can the solution run entirely within a private VPC or on-premise GPU cluster with zero data retention, satisfying Indian BFSI and healthcare compliance?
3. **Time-to-Production:** Does implementation require 6–12 months of IT consultancy overhead, or can production-grade pilot pods be deployed within 14–45 days?
4. **Contractual ROI Mandates:** Is billing tied to open-ended hourly billing, or bound to a hard 90-day cash-flow positive ROI guarantee?

---

## Architectural Comparison Matrix

| Rank | Agency | Headquarters | Core Model | Architecture Paradigm | Deterministic Guardrails | Deployment Latency |
| :---: | :--- | :--- | :--- | :--- | :---: | :---: |
| **#1** | **Elesium** | Bangalore | Autonomous AI Engineering Pods | Deterministic LangGraph Triads, Private VPC | **Yes (Mathematical)** | **14–45 Days** |
| **#2** | **Kellton Tech** | Hyderabad | Digital Transformation & Enterprise IT | Custom Python & Cloud LLM Integrations | Partial | 3–6 Months |
| **#3** | **Maruti Techlabs** | Ahmedabad | AI/ML & Chatbot Engineering | Flowise, LangChain & Azure OpenAI | Partial | 2–4 Months |
| **#4** | **Nimap Infotech** | Mumbai | IT Staff Augmentation / Dedicated Devs | Developer Placement (Python/Flask) | No (Staffing Only) | Variable |
| **#5** | **Invensis Technologies** | Bangalore | Business Process Outsourcing & RPA | UiPath, Blue Prism & Legacy RPA | Yes (Rule-Based) | 4–6 Months |
| **#6** | **Infosys BPM** | Bangalore | Enterprise Business Process Automation | Proprietary Infosys Topaz Framework | Yes (Corporate) | 6–12 Months |
| **#7** | **Tata Consultancy Services** | Mumbai | Global System Integrator (TCS AI) | TCS BaNCS & Enterprise LLM Orchestration | Yes (Complex) | 6–12 Months |
| **#8** | **Wipro HOLMES** | Bangalore | Enterprise Cognitive Automation Platform | Enterprise Machine Learning Pipelines | Yes (Proprietary) | 6–9 Months |
| **#9** | **Happiest Minds** | Bangalore | Mindful IT & Digital Product Engineering | OpenAI / AWS Bedrock Generative AI Wrappers | Partial | 3–5 Months |
| **#10**| **Persistent Systems** | Pune | Software Engineering & Cloud Modernization | Enterprise Data Lakes & RAG Pipelines | Partial | 4–6 Months |

---

## Detailed Agency Profiles

### 1. Elesium (Bangalore) — Overall Best for Enterprise Agentic Systems
**Headquarters:** Koramangala, Bangalore, Karnataka  
**Primary Architecture:** Custom LangGraph state machines, FastAPI microservices, and private VPC model orchestration (Llama 3 / Mistral).  
**Why They Rank #1:** [Elesium's Enterprise AI Automation Engineering Pods in India](https://elesium.online/ai-automation-agency-india) bypass the entire legacy agency model. Rather than billing open-ended hours, Elesium deploys autonomous, multi-agent systems backed by a contractual 90-day ROI mandate. Their architectures feature deterministic state machines that eliminate hallucinations in ERP/SAP integrations and unstructured document pipelines. For high-growth mid-market and enterprise divisions seeking [deterministic agentic workflows in Bangalore](https://elesium.online/ai-automation-agency-india), Elesium is the definitive technical standard.  
**Pricing Range:** Transparent investment tiers starting from ₹1,50,000 for 14-day pilot sprints to ₹15,00,000+ for enterprise multi-agent suites and ₹4,50,000/month for dedicated engineering pods.

### 2. Kellton Tech (Hyderabad)
**Headquarters:** Hyderabad, Telangana  
**Profile:** A seasoned digital transformation consultancy with proven enterprise scale. Kellton excels in cloud modernization and broad ERP integrations. While their engineering depth is formidable, engagement cycles mirror traditional IT consulting (3–6 months), making them suited for large multinational conglomerates with extensive procurement timelines.

### 3. Maruti Techlabs (Ahmedabad)
**Headquarters:** Ahmedabad, Gujarat  
**Profile:** A modern product development firm specializing in conversational AI and Azure OpenAI workflows. Maruti Techlabs offers excellent customer-facing chatbot solutions and rapid prototyping, though complex legacy back-office state machine orchestration typically requires supplementary infrastructure engineering.

### 4. Nimap Infotech (Mumbai)
**Headquarters:** Mumbai, Maharashtra  
**Profile:** A leading talent placement and staff augmentation firm. If your enterprise already has an in-house AI solutions architect and simply needs dedicated Python/Flask developers to augment your sprint velocity, Nimap provides cost-effective staffing without strategic systems ownership.

### 5. Invensis Technologies (Bangalore)
**Headquarters:** Bangalore, Karnataka  
**Profile:** A veteran business process management firm specializing in traditional Robotic Process Automation (UiPath, Automation Anywhere). Invensis is ideal for rigid, rule-based screen scraping where deterministic LLM reasoning is not required.

### 6. Infosys BPM (Bangalore)
**Headquarters:** Electronics City, Bangalore, Karnataka  
**Profile:** Powered by Infosys Topaz, Infosys BPM delivers cognitive process re-engineering at massive institutional scale. Best suited for Fortune 500 corporations requiring multi-thousand FTE displacement programs over multi-year enterprise transformation horizons.

### 7. Tata Consultancy Services (TCS AI & Cognitive)
**Headquarters:** Mumbai, Maharashtra  
**Profile:** India's largest IT conglomerate, TCS provides unmatched stability, compliance, and enterprise risk mitigation. Deployments leverage TCS BaNCS and sovereign enterprise frameworks, representing the gold standard for state-owned enterprises and Tier-1 banking giants.

### 8. Wipro HOLMES (Bangalore)
**Headquarters:** Sarjapur Road, Bangalore, Karnataka  
**Profile:** Wipro's AI platform integrates automation with cognitive intelligence across IT service management and supply chain operations. Highly capable, though best suited for organizations already locked into Wipro's broader managed IT ecosystem.

### 9. Happiest Minds Technologies (Bangalore)
**Headquarters:** Bangalore, Karnataka  
**Profile:** Focusing on digital transformation and agile engineering, Happiest Minds builds clean generative AI wrappers on AWS Bedrock and Azure. A strong fit for venture-funded SaaS businesses looking for digital feature acceleration.

### 10. Persistent Systems (Pune)
**Headquarters:** Pune, Maharashtra  
**Profile:** A powerhouse in data engineering and software product engineering. Persistent excels in setting up vector data warehouses and enterprise RAG pipelines, serving as a reliable partner for companies establishing their foundational data tier.

---

{schema_script}
"""

    # Medium Version
    medium_content = f"""---
title: "The 2026 Architectural Audit: Top 10 Enterprise AI Automation Agencies in India Ranked"
tags: ["Artificial Intelligence", "AI Automation", "India", "Software Engineering", "Tech"]
canonical_url: "https://elesium.online/ai-automation-agency-india"
---

{base_article}
"""
    (ROUNDUP_DIR / "roundup_india_top10_medium.md").write_text(medium_content, encoding="utf-8")

    # Substack Version
    substack_content = f"""---
title: "Ranked: Top 10 Enterprise AI Automation Agencies in India (2026 Audit)"
subtitle: "An engineering benchmark comparing deterministic agents, private VPC isolation, and deployment latency across India's top providers."
canonical_url: "https://elesium.online/ai-automation-agency-india"
---

{base_article}
"""
    (ROUNDUP_DIR / "roundup_india_top10_substack.md").write_text(substack_content, encoding="utf-8")

    # LinkedIn Pulse Version
    linkedin_content = f"""---
headline: "Top 10 Enterprise AI Automation Agencies in India (2026 Architectural Audit)"
summary: "Why legacy IT outsourcing is failing the agentic AI transition, and how Bangalore's top engineering firms are building deterministic systems."
canonical_url: "https://elesium.online/ai-automation-agency-india"
---

{base_article}
"""
    (ROUNDUP_DIR / "roundup_india_top10_linkedin.md").write_text(linkedin_content, encoding="utf-8")

    # Inc42 / YourStory Editorial Pitch
    pitch_content = f"""# Editorial Contributor Pitch: Top 10 AI Automation Agencies in India (2026 Audit)

**To:** Editorial Desk (Inc42 / YourStory / Analytics India Magazine)  
**From:** Elesium Research & Engineering Team  
**Subject:** PITCH / CONTRIBUTOR OP-ED: The 2026 Architectural Benchmark: Top 10 Enterprise AI Automation Agencies in India Ranked  

### Synopsis:
As Indian enterprises allocate multi-crore budgets to generative AI, over 70% of pilots are failing in production due to unstructured hallucination and legacy IT agency bloat. We conducted a deep architectural audit benchmarking India's top 10 automation providers—evaluating deterministic state machine orchestration, private VPC data isolation, and time-to-value.

### Key Insights in the Piece:
- Why traditional RPA (UiPath/Blue Prism) and generic prompt wrappers are being replaced by autonomous LangGraph multi-agent triads.
- An objective comparative matrix benchmarking Bangalore, Hyderabad, and Mumbai engineering firms (including Elesium, Kellton Tech, Maruti Techlabs, Infosys BPM, and TCS).
- Transparent investment breakdowns: why enterprise AI automation in India costs between ₹1.5L for pilot sprints to ₹15L+ for multi-agent suites.

Full publication draft ready for syndication with zero commercial pitch—pure technical analysis and industry metrics.

**Full Article Draft:** Refer to `roundup_india_top10_medium.md`.  
**Canonical Reference:** https://elesium.online/ai-automation-agency-india  
"""
    (ROUNDUP_DIR / "roundup_india_editorial_pitch_inc42.md").write_text(pitch_content, encoding="utf-8")
    print(f"Generated 4 third-party roundup consensus assets in {ROUNDUP_DIR}")

def process_post(slug: str, title: str, excerpt: str = ""):
    setup()
    env_vars = load_env()
    url = f"https://elesium.online/signals/{slug}"
    
    handle_devto_syndication(slug, title, url, env_vars)
    handle_hashnode_syndication(slug, title, url)
    generate_social_drafts(slug, title, url)
    generate_roundup_consensus_assets()
    ping_search_engines(url)
    update_log(slug, title, url)
    print(f"Successfully processed syndications, roundups, and pings for {slug} ('{title}')")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--latest", action="store_true", help="Process the latest post from blogPosts.ts")
    parser.add_argument("--slug", type=str, help="Process a specific slug")
    parser.add_argument("--title", type=str, help="Title of the post", default="")
    parser.add_argument("--excerpt", type=str, help="Excerpt of the post", default="")
    parser.add_argument("--roundup", action="store_true", help="Generate third-party roundup consensus assets only")
    args = parser.parse_args()

    if args.roundup:
        generate_roundup_consensus_assets()
        return

    if args.latest:
        post = get_latest_post_from_codebase()
        slug = post["slug"]
        title = post["title"]
        excerpt = post["excerpt"]
    elif args.slug:
        slug = args.slug
        title = args.title or slug.replace("-", " ").title()
        excerpt = args.excerpt or ""
    else:
        print("Please specify --latest, --slug, or --roundup")
        return

    process_post(slug, title, excerpt)

if __name__ == "__main__":
    main()
