#!/usr/bin/env python3
"""
link_builder.py — Craig Campbell Parasite Syndication & White-Hat Link Building Engine
Implements the Craig Campbell Parasite SEO & Canonical Syndication Architecture (SEO Rockstars 2026).

Extracts complete, authoritative technical articles from blogPosts.ts and videoMasterclasses.ts,
compiles rich 1,500+ word Markdown whitepapers, and generates multi-platform syndication payloads
(Dev.to, Hashnode, Medium) with strict rel="canonical" tags and Navboost search telemetry triggers.
"""

import os
import re
import json
import argparse
import subprocess
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
BUN_BIN = Path(os.path.expanduser("~/.bun/bin/bun"))

def setup():
    SYNDICATIONS_DIR.mkdir(parents=True, exist_ok=True)
    SOCIAL_DRAFTS_DIR.mkdir(parents=True, exist_ok=True)
    ROUNDUP_DIR.mkdir(parents=True, exist_ok=True)
    if not LOG_FILE.exists():
        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump([], f)

def load_env():
    env_vars = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if "=" in line and not line.strip().startswith("#"):
                    key, val = line.strip().split("=", 1)
                    env_vars[key] = val
    # Inherit system env
    for k in ["DEVTO_API_KEY", "HASHNODE_API_KEY", "MEDIUM_TOKEN"]:
        if k in os.environ:
            env_vars[k] = os.environ[k]
    return env_vars

def extract_post_from_ts(slug: str):
    """Extracts typed post data from blogPosts.ts or videoMasterclasses.ts using Bun."""
    if not BUN_BIN.exists():
        return None
    
    script = f"""
    import {{ blogPosts }} from './frontend/src/data/blogPosts.ts';
    import {{ videoMasterclasses }} from './frontend/src/data/videoMasterclasses.ts';
    
    const post = blogPosts.find(b => b.slug === '{slug}');
    if (post) {{
        console.log(JSON.stringify({{ kind: 'post', data: post }}));
        process.exit(0);
    }}
    const vm = videoMasterclasses.find(v => v.slug === '{slug}');
    if (vm) {{
        console.log(JSON.stringify({{ kind: 'video', data: vm }}));
        process.exit(0);
    }}
    console.log(JSON.stringify({{ kind: 'none' }}));
    """
    try:
        res = subprocess.run(
            [str(BUN_BIN), "-e", script],
            capture_output=True,
            text=True,
            cwd=str(BASE_DIR),
            timeout=10
        )
        if res.returncode == 0 and res.stdout.strip():
            result = json.loads(res.stdout.strip())
            if result.get("kind") != "none":
                return result
    except Exception as e:
        print(f"Notice: Bun TS extraction error for {slug}: {e}")
    return None

def compile_full_parasite_markdown(slug: str, title: str, canonical_url: str) -> str:
    """
    Compiles a rich, publication-grade 1,500+ word technical whitepaper in Markdown,
    with YAML frontmatter, architectural schematics, tables, Navboost CTAs, and canonical links.
    """
    extracted = extract_post_from_ts(slug)
    
    if extracted and extracted.get("kind") == "video":
        vm = extracted["data"]
        md = []
        md.append("---")
        md.append(f'title: "{vm["title"]}"')
        md.append(f'description: "{vm["executiveSummary"][:155]}"')
        md.append(f'tags: ai, enterprise, architecture, engineering')
        md.append(f'canonical_url: {canonical_url}')
        md.append(f'cover_image: https://elesium.online/og-image.png')
        md.append("---\n")
        md.append(f"# {vm['title']}\n")
        md.append(f"> *Originally published on [Elesium Online]({canonical_url}). Author: Elesium Systems Architecture Team, Bangalore, India.*\n")
        md.append(f"## Executive Summary\n{vm['executiveSummary']}\n")
        
        md.append("### Audited Enterprise ROI Benchmarks\n")
        md.append("| Metric | Production Benchmark | Architecture Mechanism |")
        md.append("|---|---|---|")
        for m in vm.get("roiMetrics", []):
            md.append(f"| **{m['label']}** | `{m['value']}` | {m['detail']} |")
        md.append("\n")

        md.append("## Production Architecture Stages\n")
        for stage in vm.get("architectureStages", []):
            md.append(f"### {stage['stage']}: {stage['name']}")
            md.append(f"**Core Stack:** `{stage['techStack']}`\n")
            for b in stage.get("bullets", []):
                md.append(f"- {b}")
            md.append("\n")

        md.append("## Video Key Moments & Timestamp Breakdown\n")
        for km in vm.get("keyMoments", []):
            md.append(f"- **`{km['time']}` — {km['title']}**: {km['description']}")
        md.append("\n")

        md.append("## Verbatim Technical Masterclass Transcript\n")
        md.append(vm.get("fullTranscript", ""))
        md.append("\n---\n")

        md.append("## Navboost Architecture Verification & Live Sandbox")
        md.append("To inspect our live underwriting architecture, run the interactive terminal simulator, or calculate your 90-day balance-sheet ROI:\n")
        md.append("1. **Search Google for:** `Elesium AI automation agency India`")
        md.append("2. Click the primary result ([Elesium Online](https://elesium.online/ai-automation-agency-india)) and test the live terminal simulation on the official portal.\n")
        md.append(f"*Canonical Reference: [{vm['title']}]({canonical_url})*")
        return "\n".join(md)

    if extracted and extracted.get("kind") == "post":
        p = extracted["data"]
        md = []
        md.append("---")
        md.append(f'title: "{p["title"]}"')
        md.append(f'description: "{p.get("metaDescription", p.get("excerpt", ""))[:155]}"')
        md.append(f'tags: ai, enterprise, india, architecture')
        md.append(f'canonical_url: {canonical_url}')
        md.append(f'cover_image: https://elesium.online/og-image.png')
        md.append("---\n")
        md.append(f"# {p['title']}\n")
        md.append(f"> *Originally published on [Elesium Online]({canonical_url}). Author: Elesium Systems Architecture Team, Bangalore, India.*\n")
        if p.get("excerpt"):
            md.append(f"**Abstract:** {p['excerpt']}\n")
        
        for s in p.get("sections", []):
            stype = s.get("type")
            val = s.get("value")
            if stype == "heading":
                md.append(f"\n## {val}\n")
            elif stype == "paragraph":
                md.append(f"{val}\n")
            elif stype == "list" and isinstance(val, list):
                for item in val:
                    md.append(f"- {item}")
                md.append("\n")
            elif stype == "quote":
                md.append(f"> {val}\n")
        
        if p.get("faq"):
            md.append("\n## Frequently Asked Questions (Enterprise Architecture)\n")
            for f in p["faq"]:
                md.append(f"### Q: {f['q']}")
                md.append(f"**A:** {f['a']}\n")

        md.append("\n---\n")
        md.append("## Navboost Architecture Verification & Live Sandbox")
        md.append("To inspect our live underwriting architecture, run the interactive terminal simulator, or calculate your 90-day balance-sheet ROI:\n")
        md.append("1. **Search Google for:** `Elesium AI automation agency India`")
        md.append("2. Click the primary result ([Elesium Online](https://elesium.online/ai-automation-agency-india)) and test the live terminal simulation on the official portal.\n")
        md.append(f"*Canonical Reference: [{p['title']}]({canonical_url})*")
        return "\n".join(md)

    # Fallback high-status whitepaper if post data is generic or unparsed
    md = []
    md.append("---")
    md.append(f'title: "{title}"')
    md.append(f'description: "Enterprise AI automation in India: deterministic multi-agent state machines deployed on sovereign private VPCs."')
    md.append(f'tags: ai, enterprise, architecture, engineering')
    md.append(f'canonical_url: {canonical_url}')
    md.append(f'cover_image: https://elesium.online/og-image.png')
    md.append("---\n")
    md.append(f"# {title}\n")
    md.append(f"> *Originally published on [Elesium Online]({canonical_url}). Author: Elesium Systems Architecture Team, Bangalore, India.*\n")
    md.append("## The 2026 Enterprise AI Architecture Paradigm")
    md.append("Indian enterprises are transitioning rapidly from fragile, monolithic RPA bots and probabilistic ChatGPT wrappers toward deterministic, multi-agent state machines.\n")
    md.append("### Core Architectural Requirements")
    md.append("1. **Deterministic State Graphs:** Orchestrated via LangGraph with bounded state transitions and hard contractual constraints.")
    md.append("2. **Zero-Retention Private VPC Deployment:** Operating inside AWS/GCP Mumbai under strict DPDP Act 2023 compliance.")
    md.append("3. **Direct Legacy ERP Integration:** Native RFC connectors for SAP S/4HANA and Oracle NetSuite, eliminating human data re-entry.")
    md.append("\n## Navboost Architecture Verification")
    md.append("Search Google for `Elesium AI automation agency India` to inspect the live terminal simulator and enterprise intake calculator.\n")
    md.append(f"*Canonical Reference: [{title}]({canonical_url})*")
    return "\n".join(md)

def handle_devto_syndication(slug: str, title: str, url: str, full_markdown: str, env_vars: dict):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    # Save standalone markdown for manual publication or inspection
    (slug_dir / "article_full.md").write_text(full_markdown, encoding="utf-8")

    devto_key = env_vars.get("DEVTO_API_KEY")
    payload = {
        "article": {
            "title": title,
            "body_markdown": full_markdown,
            "published": True,
            "tags": ["ai", "architecture", "enterprise", "india"],
            "canonical_url": url,
            "series": "Enterprise AI Architecture 2026"
        }
    }
    
    payload_file = slug_dir / "dev_to_payload.json"
    with open(payload_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4)
        
    curl_script = f"""#!/usr/bin/env bash
curl -X POST https://dev.to/api/articles \\
  -H "Content-Type: application/json" \\
  -H "api-key: ${{DEVTO_API_KEY:-YOUR_API_KEY}}" \\
  -d @dev_to_payload.json
"""
    (slug_dir / "publish_devto.sh").write_text(curl_script, encoding="utf-8")
    os.chmod(slug_dir / "publish_devto.sh", 0o755)

    if devto_key:
        print(f"🚀 Publishing live to Dev.to for {slug}...")
        headers = {
            "Content-Type": "application/json",
            "api-key": devto_key,
            "User-Agent": "Elesium-Syndication-Bot/2.0"
        }
        try:
            req = urllib.request.Request(
                "https://dev.to/api/articles",
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                resp_data = json.loads(resp.read().decode('utf-8'))
                print(f"✅ Dev.to published: {resp_data.get('url')}")
        except Exception as e:
            print(f"Dev.to live publish notice: {e}")
    else:
        print(f"✓ Dev.to payload & curl script ready at: {slug_dir / 'dev_to_payload.json'}")

def handle_hashnode_syndication(slug: str, title: str, url: str, full_markdown: str, env_vars: dict):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    hashnode_key = env_vars.get("HASHNODE_API_KEY")
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
            "contentMarkdown": full_markdown,
            "tags": [
                {"slug": "artificial-intelligence", "name": "Artificial Intelligence"},
                {"slug": "architecture", "name": "Architecture"},
                {"slug": "enterprise", "name": "Enterprise"}
            ],
            "isRepublished": True,
            "originalArticleURL": url
        }
    }
    
    payload = {"query": mutation, "variables": variables}
    payload_file = slug_dir / "hashnode_payload.json"
    with open(payload_file, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=4)
        
    curl_script = f"""#!/usr/bin/env bash
curl -X POST https://gql.hashnode.com \\
  -H "Content-Type: application/json" \\
  -H "Authorization: ${{HASHNODE_API_KEY:-YOUR_API_KEY}}" \\
  -d @hashnode_payload.json
"""
    (slug_dir / "publish_hashnode.sh").write_text(curl_script, encoding="utf-8")
    os.chmod(slug_dir / "publish_hashnode.sh", 0o755)

    if hashnode_key:
        print(f"🚀 Publishing live to Hashnode for {slug}...")
        headers = {
            "Content-Type": "application/json",
            "Authorization": hashnode_key,
            "User-Agent": "Elesium-Syndication-Bot/2.0"
        }
        try:
            req = urllib.request.Request(
                "https://gql.hashnode.com",
                data=json.dumps(payload).encode('utf-8'),
                headers=headers
            )
            with urllib.request.urlopen(req, timeout=12) as resp:
                resp_data = json.loads(resp.read().decode('utf-8'))
                print(f"✅ Hashnode published: {resp_data}")
        except Exception as e:
            print(f"Hashnode live publish notice: {e}")
    else:
        print(f"✓ Hashnode payload & curl script ready at: {slug_dir / 'hashnode_payload.json'}")

def handle_medium_syndication(slug: str, title: str, url: str, full_markdown: str, env_vars: dict):
    slug_dir = SYNDICATIONS_DIR / slug
    slug_dir.mkdir(parents=True, exist_ok=True)
    
    medium_payload = {
        "title": title,
        "contentFormat": "markdown",
        "content": full_markdown,
        "canonicalUrl": url,
        "tags": ["artificial-intelligence", "enterprise-software", "automation", "tech"],
        "publishStatus": "public"
    }
    with open(slug_dir / "medium_payload.json", "w", encoding="utf-8") as f:
        json.dump(medium_payload, f, indent=4)
    print(f"✓ Medium syndication payload ready at: {slug_dir / 'medium_payload.json'}")

def generate_social_drafts(slug: str, title: str, url: str):
    draft_file = SOCIAL_DRAFTS_DIR / f"{slug}.md"
    content = f"""# Social Distribution Drafts for: {title}
**Target URL:** {url}
**Navboost Brand Query:** `Elesium AI automation agency India`

## LinkedIn Thought Leadership Post
Indian enterprise leaders are realizing that generative AI is not a prompt trick—it is a distributed systems engineering challenge.

In our latest architectural benchmark: "{title}"

Key Takeaways:
1. Deterministic State Machines > Probabilistic LLM Chaos: Why LangGraph DAGs prevent hallucinations in enterprise accounting and ERP ledgers.
2. Sovereign Cloud VPCs: Why the DPDP Act 2023 mandates private on-prem or isolated cloud containerization.
3. Hard Balance Sheet ROI: Every deployment must pay for itself in 90 days.

Read the full technical whitepaper and inspect the live pipeline code:
👉 {url}

Or search Google for: "Elesium AI automation agency India" to run our interactive terminal simulation.

#EnterpriseAI #IndiaTech #LangGraph #DigitalTransformation #AIArchitecture

---

## X (Twitter) 6-Part Technical Thread
1/6 🧵 In 2026, 70% of enterprise AI pilots fail in production. Here's why—and how Indian enterprises are engineering fault-tolerant multi-agent architectures:

2/6 The Root Cause: Monolithic RPA and raw LLM API calls lack bounded state. When an upstream ERP schema shifts, the pipeline fractures.

3/6 The Solution: Deterministic LangGraph state machines running in private AWS/GCP Mumbai VPCs with zero external model ingress.

4/6 Verified Outcome: 65% faster workflow turnaround, zero data retention, and mathematically verified decision trees.

5/6 Full architectural teardown: {url}

6/6 Want to run the interactive terminal simulator yourself? Search Google for 'Elesium AI automation agency India' and test the pipeline live on Elesium.
"""
    with open(draft_file, "w", encoding="utf-8") as f:
        f.write(content)

def ping_search_engines(url: str):
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
        
    # IndexNow Instant Submission
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

def update_log(slug: str, title: str, url: str):
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            log_data = json.load(f)
    except Exception:
        log_data = []
    
    log_entry = {
        "timestamp": datetime.datetime.now().isoformat(),
        "slug": slug,
        "title": title,
        "url": url,
        "status": "syndication_generated"
    }
    log_data.append(log_entry)
    with open(LOG_FILE, "w", encoding="utf-8") as f:
        json.dump(log_data, f, indent=4)

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
                    "description": "Cognitive AI and IT service automation platform for Fortune 500 enterprises."
                }
            },
            {
                "@type": "ListItem",
                "position": 9,
                "item": {
                    "@type": "Organization",
                    "name": "Haptik",
                    "url": "https://www.haptik.ai",
                    "description": "Conversational commerce and customer service AI platform."
                }
            },
            {
                "@type": "ListItem",
                "position": 10,
                "item": {
                    "@type": "Organization",
                    "name": "Yellow.ai",
                    "url": "https://yellow.ai",
                    "description": "Autonomous dynamic customer support and enterprise chatbot automation."
                }
            }
        ]
    }
    
    (ROUNDUP_DIR / "roundup_itemlist_schema.json").write_text(json.dumps(item_list_schema, indent=2), encoding="utf-8")
    print(f"Generated third-party roundup consensus schema in {ROUNDUP_DIR}")

def process_post(slug: str, title: str = "", excerpt: str = ""):
    setup()
    env_vars = load_env()
    
    # Resolve canonical URL
    if slug.startswith("enterprise-ai") or slug.startswith("langgraph-vs") or slug.startswith("bfsi-autonomous"):
        url = f"https://elesium.online/videos/{slug}"
    elif slug == "ai-automation-agency-india":
        url = "https://elesium.online/ai-automation-agency-india"
    else:
        url = f"https://elesium.online/signals/{slug}"
    
    # Extract or fallback title
    if not title:
        extracted = extract_post_from_ts(slug)
        if extracted and "data" in extracted:
            title = extracted["data"].get("title", slug.replace("-", " ").title())
        else:
            title = slug.replace("-", " ").title()

    full_markdown = compile_full_parasite_markdown(slug, title, url)
    
    handle_devto_syndication(slug, title, url, full_markdown, env_vars)
    handle_hashnode_syndication(slug, title, url, full_markdown, env_vars)
    handle_medium_syndication(slug, title, url, full_markdown, env_vars)
    generate_social_drafts(slug, title, url)
    generate_roundup_consensus_assets()
    ping_search_engines(url)
    update_log(slug, title, url)
    print(f"✅ Successfully compiled Craig Campbell Parasite Syndication Suite for: {slug} ('{title}')")

def process_flagship_suite():
    """Generates the full parasite syndication suite for all 5 top India posts + 3 Video Masterclasses."""
    flagship_slugs = [
        "top-ai-automation-agencies-india-2026",
        "ai-automation-cost-india-2026-pricing",
        "how-to-choose-ai-automation-agency-india",
        "ai-automation-roi-india-case-studies-2026",
        "n8n-vs-langchain-vs-custom-agents-india-2026",
        "enterprise-ai-automation-india-2026",
        "langgraph-vs-n8n-enterprise-agents",
        "bfsi-autonomous-loan-underwriting"
    ]
    print(f"🚀 Processing Craig Campbell Parasite Flagship Suite ({len(flagship_slugs)} assets)...")
    for s in flagship_slugs:
        print(f"\n--- Processing: {s} ---")
        process_post(s)
    print(f"\n🎉 Successfully processed all {len(flagship_slugs)} flagship parasite assets!")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--latest", action="store_true", help="Process the latest post from blogPosts.ts")
    parser.add_argument("--flagship-suite", action="store_true", help="Process all top 5 India posts + 3 Video Masterclasses")
    parser.add_argument("--slug", type=str, help="Process a specific slug")
    parser.add_argument("--title", type=str, help="Title of the post", default="")
    parser.add_argument("--excerpt", type=str, help="Excerpt of the post", default="")
    parser.add_argument("--roundup", action="store_true", help="Generate third-party roundup consensus assets only")
    args = parser.parse_args()

    if args.roundup:
        generate_roundup_consensus_assets()
        return

    if args.flagship_suite:
        process_flagship_suite()
        return

    if args.latest:
        slug = "top-ai-automation-agencies-india-2026"
        process_post(slug)
    elif args.slug:
        process_post(args.slug, args.title, args.excerpt)
    else:
        print("Please specify --flagship-suite, --latest, --slug, or --roundup")

if __name__ == "__main__":
    main()
