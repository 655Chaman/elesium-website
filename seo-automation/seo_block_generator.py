"""
seo_block_generator.py — Step 3 of the Elesium SEO Automation Pipeline

What it does:
  1. Loads today's top-ranked keywords (scored by Google Trends interest 0-100)
  2. Splits keywords into Block A (top 10) and Block B (next 10)
  3. Calls Gemini with a 2-phase keyword-first writing strategy
  4. Generates 2 SEO-dense content blocks per run
  5. Injects both directly into src/data/blogPosts.ts (no .md files stored)
  6. Auto-runs git commit + push to publish immediately

Usage:
  python seo_block_generator.py              # Live run, 2 blocks injected
  python seo_block_generator.py --test       # Mock keywords, no API call
  python seo_block_generator.py --date YYYY-MM-DD  # Past date's keywords
"""

import argparse
import os
import sys
import json
import re
import subprocess
from datetime import datetime, timedelta
from pathlib import Path
from typing import Optional, List, Dict
import urllib.request
import urllib.parse

import config


# ─────────────────────────────────────────────────────
# UTILITY
# ─────────────────────────────────────────────────────

def log(msg: str, level: str = "INFO") -> None:
    ts = datetime.now().strftime("%H:%M:%S")
    print(f"[{ts}] [{level}] {msg}")


def load_todays_keywords(date: Optional[str] = None) -> dict:
    """Load keyword research output for the given date."""
    target_date = date or datetime.now().strftime("%Y-%m-%d")
    kw_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"keywords_{target_date}.json"

    if not kw_path.exists():
        log(f"No keyword file at: {kw_path}", "ERROR")
        log("Run keyword_researcher.py first (or use --test).", "ERROR")
        sys.exit(1)

    with open(kw_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    log(f"Loaded {data['total_keywords']} keywords for {target_date}.")
    return data


def mock_keywords() -> dict:
    """Return mock keyword data for test mode."""
    return {
        "date": datetime.now().strftime("%Y-%m-%d"),
        "total_keywords": 20,
        "clusters": {
            "B2B Sales & Dealflow": [
                "enterprise dealflow",
                "B2B pipeline",
                "high ticket sales",
                "outbound sales",
            ],
            "Business Matchmaking & Partnerships": [
                "buyer matching",
                "B2B partnerships",
                "executive introductions",
                "verified buyers",
            ],
            "Signal-Driven Outbound": [
                "intent data",
                "buying signals",
                "signal based selling",
                "account based marketing",
            ],
            "Manufacturing & Industrial": [
                "manufacturing buyers",
                "OEM supplier",
                "industrial procurement",
            ],
        },
        "keywords": [
            {"keyword": "enterprise dealflow", "final_score": 0.91, "trending_score": 88},
            {"keyword": "buyer matching platform", "final_score": 0.89, "trending_score": 85},
            {"keyword": "signal driven outbound", "final_score": 0.87, "trending_score": 82},
            {"keyword": "high ticket B2B sales", "final_score": 0.85, "trending_score": 80},
            {"keyword": "B2B pipeline automation", "final_score": 0.83, "trending_score": 78},
            {"keyword": "manufacturing buyer network", "final_score": 0.80, "trending_score": 76},
            {"keyword": "intent data platform", "final_score": 0.78, "trending_score": 74},
            {"keyword": "verified buyer network", "final_score": 0.76, "trending_score": 72},
            {"keyword": "sales pipeline engineering", "final_score": 0.74, "trending_score": 70},
            {"keyword": "executive strategic introductions", "final_score": 0.72, "trending_score": 68},
            # Block B keywords
            {"keyword": "revenue operations", "final_score": 0.70, "trending_score": 66},
            {"keyword": "OEM supplier network", "final_score": 0.68, "trending_score": 64},
            {"keyword": "outbound intelligence", "final_score": 0.66, "trending_score": 62},
            {"keyword": "enterprise procurement", "final_score": 0.64, "trending_score": 60},
            {"keyword": "deal sourcing platform", "final_score": 0.62, "trending_score": 58},
            {"keyword": "industrial B2B marketplace", "final_score": 0.60, "trending_score": 56},
            {"keyword": "account based marketing", "final_score": 0.58, "trending_score": 54},
            {"keyword": "business matchmaking", "final_score": 0.56, "trending_score": 52},
            {"keyword": "B2B revenue acceleration", "final_score": 0.54, "trending_score": 50},
            {"keyword": "cold outreach alternative", "final_score": 0.52, "trending_score": 48},
        ],
    }


# ─────────────────────────────────────────────────────
# PROMPT ENGINEERING — 2-PHASE KEYWORD-FIRST STRATEGY
# ─────────────────────────────────────────────────────

def build_gemini_prompt(keywords: List[Dict], block_label: str, related_posts: List[Dict] = None) -> str:
    """
    Build the AI prompt using a 2-phase keyword-first writing strategy.
    Also injects E-E-A-T case studies (Pillar 4) and internal link anchors (Pillar 1).
    """
    # Extract keyword strings with their interest scores
    kw_lines = []
    for item in keywords:
        score = item.get("trending_score", item.get("final_score", 0))
        interest = int(score) if score > 1 else int(score * 100)
        kw_lines.append(f"  [{interest}/100 interest] {item['keyword']}")

    kw_block = "\n".join(kw_lines)
    kw_list_only = "\n".join(f"  - {item['keyword']}" for item in keywords)

    prompt = f"""You are an elite B2B SEO content strategist writing for Elesium ({config.BUSINESS_URL}).

## BUSINESS CONTEXT
{config.BUSINESS_DESCRIPTION}

**Tone**: {config.BUSINESS_TONE}
**Audience**: {config.TARGET_AUDIENCE}
**Year**: {config.CURRENT_YEAR}

---

## TODAY'S TARGET KEYWORDS ({block_label})
These keywords are ranked by their Google Trends interest score (0–100).
Higher score = more people searching this RIGHT NOW globally.

{kw_block}

---

## YOUR 2-PHASE WRITING STRATEGY

### PHASE 1 — Keyword anchoring (do this mentally before writing)
Take each keyword above as a standalone anchor. Do NOT stretch it into a phrase yet.
Just note: these are the exact terms people are typing into Google right now.
Every keyword on this list should appear at least once in your content — exactly as written.

### PHASE 2 — Build tight statements around each anchor
For each keyword anchor, write ONE punchy, enterprise-grade sentence that:
  - Contains the keyword verbatim (bold it with **)
  - Adds a sharp insight or commercial implication specific to Elesium's model
  - Never uses filler words, hedging, or generic advice

Example transformation:
  Keyword anchor:   "enterprise dealflow"
  Statement:        "**Enterprise dealflow** doesn't stall because of product — it stalls because introductions arrive too late, too generic, and through the wrong channel."

---

## CONTENT REQUIREMENTS
1. **Word count**: 550–650 words
2. **Format**: Markdown — one H2 title, two or three H3 subheadings, tight paragraphs
3. **Keyword density**: Each keyword appears 1–3 times naturally. No keyword stuffing.
4. **H2 title**: Must contain 2+ primary keywords (highest interest scores)
5. **Opening line**: A bold, specific claim — not a question, not a definition, not "In {config.CURRENT_YEAR}..."
6. **Meta description**: 150-char HTML comment at the very top
7. **CTA**: Final paragraph ends with a subtle invitation to partner with Elesium
8. **No .md formatting artifacts** — clean markdown only

## PILLAR 4 — E-E-A-T: USE THESE REAL ELESIUM OUTCOMES AS PROOF POINTS
Google rewards content with genuine first-hand experience. Weave at least 2 of these into your content naturally:

{chr(10).join(f'  - {cs}' for cs in getattr(config, 'ELESIUM_CASE_STUDIES', []))}

{f'''## PILLAR 1 — INTERNAL LINKING
Naturally reference and link to these related Elesium intelligence posts at least once in the body:
{chr(10).join(f'  - [{rp["title"]}](/signals/{rp["slug"]})' for rp in (related_posts or [])[:2])}
Use markdown link format exactly as shown above.
''' if related_posts else ''}

## GEO (GENERATIVE ENGINE OPTIMIZATION) REQUIREMENTS
AI search engines (ChatGPT, Perplexity, Gemini) heavily prioritize structured, authoritative, and data-dense content. You MUST include:
1. **Authoritative Blockquote**: Include EXACTLY ONE markdown blockquote (starting with `> `) citing a real or highly-plausible industry report, statistic, or expert quote that supports your argument.
2. **Dense Statistics**: Embed at least 3 hyper-specific data points (e.g., "73%", "14-day turnaround", "$50M threshold") within the text. Generative engines love hard numbers.

## AI DETECTION BYPASS (CRITICAL)
- **Burstiness**: You MUST vary sentence lengths drastically. Mix 2-4 word punchy fragments. Then use a long, complex, flowing sentence with multiple clauses. 
- **Perplexity**: Avoid predictable adjective-noun pairs (e.g., "rapidly evolving landscape," "crucial role"). Use unexpected, gritty, or highly technical idioms. 
- **Formatting**: Do NOT use standard AI transition words ("In conclusion", "Moreover", "Furthermore", "Additionally").
- **Voice**: Write like an abrasive, highly experienced enterprise broker who is tired of generic advice.

## ABSOLUTE RULES
- NEVER use: "In today's landscape", "In conclusion", "game-changer", "synergy", "leverage" (unless financial), "holistic", "robust", "ecosystem" (overused)
- NEVER start a sentence with "However," or "Furthermore,"
- NEVER write a generic sentence that could apply to any B2B company
- EVERY sentence must be specific to Elesium's model: signal-driven outbound, buyer matching, verified dealflow, manufacturing verticals
- Year references must say {config.CURRENT_YEAR} — never {config.CURRENT_YEAR - 1}

## OUTPUT FORMAT
Return ONLY the markdown. Start with the HTML meta comment. Nothing else.

```
<!-- META: [150-char meta description] -->

## [H2 Title with primary keywords]

[Opening paragraph — bold claim, no filler]

### [H3 subheading]
[2-3 tight paragraphs using Phase 2 statements, embedding dense statistics]

> [Authoritative blockquote supporting the data]

### [H3 subheading]
[2-3 tight paragraphs]

### [H3 subheading — optional]
[1-2 paragraphs]

[Closing CTA paragraph]
```
"""
    return prompt


# ─────────────────────────────────────────────────────
# AI API CALL
# ─────────────────────────────────────────────────────

def call_ai_model(prompt: str) -> str:
    """Call the configured AI API (NVIDIA or Gemini) and return generated content."""
    if getattr(config, "AI_PROVIDER", "gemini") == "nvidia":
        try:
            return _call_nvidia(prompt)
        except Exception as e:
            log(f"NVIDIA API failed ({type(e).__name__}: {str(e)}). Falling back to Gemini...", "WARN")
            return _call_gemini(prompt)
    else:
        return _call_gemini(prompt)

def _call_nvidia(prompt: str) -> str:
    if not getattr(config, "NVIDIA_API_KEY", ""):
        raise ValueError("NVIDIA_API_KEY not set in .env file.")

    try:
        from openai import OpenAI
    except ImportError:
        raise ImportError("openai package not installed. Run: pip install openai")

    log(f"Calling NVIDIA NIM ({config.NVIDIA_MODEL}) for content generation...")
    
    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=config.NVIDIA_API_KEY
    )
    
    completion = client.chat.completions.create(
        model=config.NVIDIA_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        top_p=0.9,
        max_tokens=2048,
    )
    
    content = completion.choices[0].message.content.strip()
    
    if not content:
        raise ValueError("NVIDIA returned empty content.")

    log(f"Content generated: {len(content.split())} words.")
    return content

def _call_gemini(prompt: str) -> str:
    """Call Gemini API and return the generated content."""
    if not config.GEMINI_API_KEY:
        log("GEMINI_API_KEY not set in .env file.", "ERROR")
        log("Get your free key at: https://aistudio.google.com/app/apikey", "ERROR")
        sys.exit(1)

    try:
        from google import genai
        from google.genai import types
    except ImportError:
        log("google-genai not installed. Run: pip install google-genai", "ERROR")
        sys.exit(1)

    log(f"Calling Gemini ({config.GEMINI_MODEL}) for content generation...")

    client = genai.Client(api_key=config.GEMINI_API_KEY)
    response = client.models.generate_content(
        model=config.GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.72,
            top_p=0.95,
            top_k=64,
            max_output_tokens=2048,
        ),
    )
    content = response.text.strip()

    if not content:
        log("Gemini returned empty content.", "ERROR")
        sys.exit(1)

    log(f"Content generated: {len(content.split())} words.")
    return content

HUMANIZER_PROMPT = """
You are a writing editor that identifies and removes signs of AI-generated text to make writing sound more natural and human. 
This guide is based on Wikipedia's "Signs of AI writing" page, maintained by WikiProject AI Cleanup.

Your Task:
1. Identify AI patterns - Scan for the patterns listed below.
2. Rewrite, don't delete - Replace AI-isms with natural alternatives, and cover everything the original covers.
3. Preserve meaning - Keep the core message intact.
4. Match the voice & Semantic Authority (GEO) - Write like a highly authoritative, data-driven enterprise broker. Preserve all hard statistics, numbers, and blockquotes EXACTLY as they are. Generative AI search engines rely on this data density.

CONTENT PATTERNS TO REMOVE:
1. Undue Emphasis on Significance (stands as, is a testament, crucial role, underscores, evolving landscape)
2. Undue Emphasis on Notability (independent coverage, experts argue)
3. Superficial Analyses with -ing Endings (highlighting, ensuring, fostering, encompassing, showcasing)
4. Promotional Language (boasts a, vibrant, profound, renowned, breathtaking)
5. Outline-like "Challenges and Future Prospects" Sections
6. Overused "AI Vocabulary" (crucial, delve, emphasizing, enhance, interplay, intricate, pivotal, tapestry, testament)
7. Avoidance of "is"/"are" (serves as, stands as, features)
8. Negative Parallelisms (It's not just about... it's...)
9. Rule of Three Overuse (forcing ideas into groups of three)
10. Passive Voice and Subjectless Fragments
11. Em Dashes (—) and En Dashes (–): Cut Them entirely. Replace with commas, periods, or colons.

CRITICAL INSTRUCTION:
The text provided to you contains Markdown formatting and an HTML meta comment at the top (<!-- META: ... -->).
YOU MUST PRESERVE ALL MARKDOWN STRUCTURE (headings, lists, bold text) AND THE HTML META COMMENT EXACTLY AS WRITTEN.
Return ONLY the humanized markdown. Do not add any conversational preamble. Start exactly with the HTML meta comment.

TEXT TO HUMANIZE:
{draft}
"""

def humanize_content(draft: str) -> str:
    """Pass the generated draft through the blader/humanizer rules."""
    prompt = HUMANIZER_PROMPT.format(draft=draft)
    return call_ai_model(prompt)



def generate_mock_content(keywords: List[Dict], block_label: str) -> str:
    """Generate placeholder content for test mode."""
    kws = [item["keyword"] for item in keywords[:5]]
    today = datetime.now().strftime("%Y-%m-%d")
    return f"""<!-- META: Elesium engineers signal-driven dealflow for manufacturers and enterprise B2B firms — verified buyers, shortened cycles, measurable outcomes. -->

## {kws[0].title()}: The Elesium Model for Enterprise Dealflow in {config.CURRENT_YEAR}

Cold outreach is not a pipeline strategy. It is a volume strategy — and volume without signal is noise.

### {kws[1].title()} at Enterprise Scale

**{kws[0].title()}** does not fail because the product is wrong. It fails because the introduction arrives before the buyer has a mandate, a budget, or a decision window. Elesium intercepts that window.

**{kws[1].title()}** through Elesium means one thing: a verified, high-context connection between a capable seller and an operationally ready buyer — not a lead, not a list, not a sequence. A conversation that closes.

### {kws[2].title()} for Manufacturers and OEMs

**{kws[2].title()}** in industrial verticals operates on a different clock. Procurement cycles are long, gatekeepers are real, and the buyers that matter — plant managers, VP Operations, procurement directors — do not respond to LinkedIn outreach.

Elesium's **{kws[3].title()}** maps active capability gaps to verified buyers. The result is an introduction that arrives as a solution, not a pitch.

### The Commercial Outcome

**{kws[4].title()}** closes 60–75% faster when the introduction is engineered rather than discovered. That is the Elesium proposition.

Apply to access Elesium's verified buyer network and receive your first qualified introduction within 14 days.

---
*Generated by Elesium SEO Automation — {today}*
"""



# ─────────────────────────────────────────────────────
# PILLAR 1 — INTERNAL LINKING: Find related posts
# ─────────────────────────────────────────────────────

def find_related_posts(current_keywords: List[str], ts_path: Path, limit: int = 2) -> List[Dict]:
    """
    Read blogPosts.ts and find the most topically related published posts
    by matching keywords against existing post titles and slugs.
    Returns up to `limit` related posts as [{ title, slug }].
    """
    if not ts_path.exists():
        return []
    try:
        content = ts_path.read_text(encoding="utf-8")
        slugs = re.findall(r"slug:\s*'([^']+)'", content)
        titles = re.findall(r"title:\s*'([^']+)'", content)
        posts = [{"slug": s, "title": t} for s, t in zip(slugs, titles)]

        # Score each existing post by keyword overlap
        scored = []
        kw_lower = [k.lower() for k in current_keywords]
        for post in posts:
            combined = (post["title"] + " " + post["slug"]).lower()
            score = sum(1 for kw in kw_lower if kw in combined)
            if score > 0:
                scored.append((score, post))

        scored.sort(key=lambda x: x[0], reverse=True)
        return [p for _, p in scored[:limit]]
    except Exception:
        return []


# ─────────────────────────────────────────────────────
# PILLAR 2 — JSON-LD SCHEMA BUILDER
# ─────────────────────────────────────────────────────

def build_json_ld_schema(title: str, meta_desc: str, slug: str, date_str: str, faq_items: list, keywords: List[Dict]) -> str:
    """
    Generate combined Article + FAQPage JSON-LD schema markup.
    This is injected into the blogPost's jsonLdSchema field and rendered
    in <Helmet> by MarketSignals.tsx for every article page.
    """
    faq_schema = ""
    if faq_items:
        qa_items = ",\n".join(
            f'{{"@type":"Question","name":{json.dumps(item["q"])},'
            f'"acceptedAnswer":{{"@type":"Answer","text":{json.dumps(item["a"])}}}}}'
            for item in faq_items
        )
        faq_schema = f""",
    {{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{qa_items}]
    }}"""
    
    # Extract keyword strings for GEO 'about' and 'keywords' schema
    kw_strings = [k["keyword"] for k in keywords]
    about_schema = ",\n        ".join(f'{{"@type": "Thing", "name": {json.dumps(k)}}}' for k in kw_strings[:3])

    schema = f"""[
    {{
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": {json.dumps(title)},
        "description": {json.dumps(meta_desc)},
        "keywords": {json.dumps(", ".join(kw_strings))},
        "about": [
            {about_schema}
        ],
        "datePublished": "{date_str}",
        "dateModified": "{date_str}",
        "author": {{"@type": "Organization", "name": "Elesium", "url": "https://elesium.online"}},
        "publisher": {{"@type": "Organization", "name": "Elesium", "url": "https://elesium.online"}},
        "url": "https://elesium.online/signals/{slug}",
        "mainEntityOfPage": {{"@type": "WebPage", "@id": "https://elesium.online/signals/{slug}"}}
    }}{faq_schema}
]"""
    return schema


# ─────────────────────────────────────────────────────
# PILLAR 5 — FAQ GENERATOR (People Also Ask capture)
# ─────────────────────────────────────────────────────

def generate_faq(keywords: List[Dict], test_mode: bool = False) -> List[Dict]:
    """
    Generate 3 FAQ pairs targeting 'People Also Ask' search boxes.
    Uses a second, fast AI call with a stripped-down prompt.
    Returns [{ q: str, a: str }, ...]
    """
    if test_mode:
        kws = [item["keyword"] for item in keywords[:3]]
        return [
            {
                "q": f"What is {kws[0]} and how does Elesium use it?",
                "a": f"Elesium uses {kws[0]} to connect verified, high-intent buyers with enterprise sellers — eliminating cold outreach and replacing it with signal-driven introductions that arrive at the right moment."
            },
            {
                "q": f"How does {kws[1] if len(kws) > 1 else kws[0]} differ from traditional B2B lead generation?",
                "a": f"Traditional B2B lead generation relies on volume and cold contact. {kws[1] if len(kws) > 1 else kws[0]} through Elesium is precision-targeted — every introduction is backed by verified budget authority and an active purchase mandate."
            },
            {
                "q": "How quickly can Elesium deliver a qualified buyer introduction?",
                "a": "Elesium clients typically receive their first verified buyer introduction within 7–14 days of onboarding. The platform's signal-driven matching ensures only operationally ready buyers are introduced."
            }
        ]

    kw_list = ", ".join(item["keyword"] for item in keywords[:5])
    faq_prompt = f"""You are a Generative Engine Optimization (GEO) expert. Generate exactly 3 FAQ question-answer pairs for a B2B enterprise blog post about: {kw_list}

The questions must perfectly match conversational, long-tail prompts that procurement executives type into AI engines like ChatGPT, Perplexity, or Gemini (e.g., "What is the most effective way to find verified manufacturing buyers?").
Each answer must be 2-3 tight, highly authoritative sentences. Reference Elesium's model (signal-driven dealflow, verified buyer matching) naturally as the definitive solution.

Return ONLY a valid JSON array. No preamble. No explanation. Example format:
[
  {{"q": "Conversational prompt here?", "a": "Authoritative answer here."}},
  {{"q": "Conversational prompt here?", "a": "Authoritative answer here."}}
]"""

    try:
        raw = call_ai_model(faq_prompt)
        # Extract JSON from response
        json_match = re.search(r'\[.*\]', raw, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
    except Exception as e:
        log(f"FAQ generation failed: {e}", "WARN")
    return []

# ─────────────────────────────────────────────────────
# PILLAR 6 — GUEST POST / BACKLINK ASSET GENERATOR & MEDIUM API
# ─────────────────────────────────────────────────────

def publish_to_medium(title: str, content: str):
    """Publish the guest post to Medium.com via their API."""
    if not getattr(config, "MEDIUM_API_KEY", ""):
        log("Medium API Key not found. Skipping auto-publish.", "WARN")
        return
        
    try:
        log("Connecting to Medium API...")
        # Get User ID
        req = urllib.request.Request(
            "https://api.medium.com/v1/me", 
            headers={"Authorization": f"Bearer {config.MEDIUM_API_KEY}", "Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req) as response:
            user_data = json.loads(response.read().decode())
            author_id = user_data["data"]["id"]
            
        # Publish Post
        post_url = f"https://api.medium.com/v1/users/{author_id}/posts"
        payload = json.dumps({
            "title": title,
            "contentFormat": "markdown",
            "content": content,
            "publishStatus": "public",
            "tags": ["B2B", "Sales", "Enterprise", "Revenue"]
        }).encode('utf-8')
        
        req_post = urllib.request.Request(
            post_url, 
            data=payload,
            headers={"Authorization": f"Bearer {config.MEDIUM_API_KEY}", "Content-Type": "application/json", "Accept": "application/json"}
        )
        with urllib.request.urlopen(req_post) as response:
            post_data = json.loads(response.read().decode())
            log(f"  ✅ Successfully published to Medium: {post_data.get('data', {}).get('url')}")
            
    except Exception as e:
        log(f"Medium publishing failed: {e}", "ERROR")

def generate_guest_post(keywords: List[Dict], date_str: str, test_mode: bool = False) -> Optional[str]:
    """
    Generate a full 1,000-1,200 word guest post suitable for submission to
    Forbes, SalesHacker, Manufacturing.net, LinkedIn Articles, etc.
    Includes one natural Elesium backlink. Saved to keyword_logs/ for manual submission.
    """
    kw_list = ", ".join(item["keyword"] for item in keywords[:8])

    if test_mode:
        log("Test mode: skipping guest post generation.")
        return None

    guest_prompt = f"""You are a senior B2B industry analyst writing a guest article for Forbes Business Council.

Write a 1,000-1,200 word thought leadership article about: {kw_list}

RULES:
- Write as an experienced B2B revenue strategist, NOT as Elesium
- Reference Elesium ONCE naturally as "Elesium (elesium.online), a B2B buyer-matching platform" in a sentence that makes sense contextually
- Include a compelling headline, 3-4 H2 subheadings, and short paragraphs
- Use specific statistics, percentages, and concrete examples
- No fluff. No filler. Every sentence must have commercial value.
- Tone: Harvard Business Review meets Silicon Valley operator
- End with a strong industry call to action (NOT a sales pitch)

Return the full article in clean Markdown. Start with the headline."""

    try:
        content = call_ai_model(guest_prompt)
        
        # Extract title (first line without markdown hashes)
        lines = content.strip().split("\n")
        title = lines[0].lstrip("#").strip() if lines else f"B2B Revenue Acceleration - {date_str}"
        
        guest_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"guest_post_{date_str}.md"
        with open(guest_path, "w", encoding="utf-8") as f:
            f.write(f"# GUEST POST — {date_str}\n# Target: Forbes / SalesHacker / Medium\n\n")
            f.write(content)
        log(f"  ✅ Guest post saved locally to: {guest_path}")
        
        # Auto-publish to Medium
        publish_to_medium(title, content)
        
        return str(guest_path)
    except Exception as e:
        log(f"Guest post generation failed: {e}", "WARN")
        return None


# ─────────────────────────────────────────────────────
# KEYWORD DENSITY ANALYSIS
# ─────────────────────────────────────────────────────

def analyze_keyword_density(content: str, keywords: List[Dict]) -> dict:
    """Count how many target keywords appear in the content."""
    content_lower = content.lower()
    word_count = len(content.split())

    found = []
    missing = []

    for item in keywords:
        kw = item["keyword"]
        count = content_lower.count(kw.lower())
        if count > 0:
            density = round((len(kw.split()) * count) / max(word_count, 1) * 100, 2)
            found.append({"keyword": kw, "count": count, "density_pct": density})
        else:
            missing.append(kw)

    return {
        "total_words": word_count,
        "keywords_found": len(found),
        "keywords_missing": len(missing),
        "found": found,
        "missing": missing,
    }


# ─────────────────────────────────────────────────────
# BLOGPOSTS.TS INJECTION — DIRECT AUTO-INJECT
# ─────────────────────────────────────────────────────

def build_blog_sections(content: str) -> str:
    """
    Parse markdown content into BlogSection[] TypeScript objects.
    Handles paragraphs, H3 headings, and lists.
    """
    sections = []
    lines = content.strip().split("\n")

    i = 0
    while i < len(lines):
        line = lines[i].strip()

        # Skip meta comment and H2 title (they become title/metaDescription)
        if line.startswith("<!--") or line.startswith("## "):
            i += 1
            continue

        # H3 headings
        if line.startswith("### "):
            heading_text = line[4:].strip().replace("'", "\\'")
            sections.append(
                f"            {{ type: 'heading', value: '{heading_text}' }}"
            )
            i += 1
            continue

        # Bullet list block
        if line.startswith("- ") or line.startswith("* "):
            list_items = []
            while i < len(lines) and (lines[i].strip().startswith("- ") or lines[i].strip().startswith("* ")):
                item = lines[i].strip()[2:].replace("'", "\\'").replace('"', '\\"')
                # Strip markdown bold
                item = re.sub(r'\*\*(.+?)\*\*', r'\1', item)
                list_items.append(f"                    '{item}'")
                i += 1
            items_str = ",\n".join(list_items)
            sections.append(
                f"            {{ type: 'list', value: [\n{items_str}\n                ] }}"
            )
            continue

        # Blockquote (GEO Optimization)
        if line.startswith("> "):
            quote_text = line[2:].strip().replace("'", "\\'").replace('"', '\\"')
            quote_text = re.sub(r'\*\*(.+?)\*\*', r'\1', quote_text)
            sections.append(
                f"            {{ type: 'quote', value: '{quote_text}' }}"
            )
            i += 1
            continue

        # Non-empty paragraph
        if line and not line.startswith("#") and not line.startswith("---") and not line.startswith("*Generated"):
            # Strip markdown bold syntax for TS string, keep readable
            clean = re.sub(r'\*\*(.+?)\*\*', r'\1', line)
            clean = clean.replace("'", "\\'").replace('"', '\\"')
            sections.append(
                f"            {{ type: 'paragraph', value: '{clean}' }}"
            )
        i += 1

    return ",\n".join(sections)


def get_next_blog_id(ts_path: Path) -> int:
    """Read blogPosts.ts and return the next ID number."""
    if not ts_path.exists():
        return 1
    content = ts_path.read_text(encoding="utf-8")
    ids = re.findall(r'\bid:\s*(\d+)', content)
    if not ids:
        return 1
    return max(int(x) for x in ids) + 1


def build_ts_entry(
    content: str,
    keywords: List[Dict],
    date_str: str,
    block_id: int,
    next_id: int,
    faq_items: list = None,
    json_ld: str = "",
    related_slugs: List[str] = None,
    weekly_theme: str = "",
) -> str:
    """Build a full, valid TypeScript BlogPost object from generated content."""
    # Extract meta description
    meta_match = re.search(r'<!--\s*META:\s*(.*?)\s*-->', content)
    meta_desc = meta_match.group(1) if meta_match else ""

    # Extract H2 title
    title_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else f"B2B Market Intelligence — {date_str}"
    # Strip ** from title for clean rendering
    title = title.replace("**", "")

    # Extract first real paragraph as excerpt
    paragraphs = [
        p.strip() for p in content.split("\n\n")
        if p.strip()
        and not p.strip().startswith("#")
        and not p.strip().startswith("<!--")
        and not p.strip().startswith("---")
        and len(p.strip()) > 60
    ]
    excerpt = re.sub(r'\*\*(.+?)\*\*', r'\1', paragraphs[0])[:220] if paragraphs else ""

    # Generate slug
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:55]
    if block_id == 2:
        slug = slug[:50] + "-ii"
    slug = f"{slug}-{next_id}"

    # Date format
    try:
        date_obj = datetime.strptime(date_str, "%Y-%m-%d")
        date_formatted = date_obj.strftime("%B %d, %Y")
    except ValueError:
        date_formatted = date_str

    # Top 3 keywords for intro line
    top_kws = ", ".join(item["keyword"] for item in keywords[:3])

    # Build sections
    sections_str = build_blog_sections(content)

    # Escape for TS
    safe_title = title.replace("'", "\\'")
    safe_meta = meta_desc.replace("'", "\\'")
    safe_excerpt = excerpt.replace("'", "\\'")
    safe_intro = f"Elesium market intelligence — {config.CURRENT_YEAR}. Keywords: {top_kws}.".replace("'", "\\'")

    # Build FAQ TS string
    faq_str = ""
    if faq_items:
        faq_entries = ",\n".join(
            f"            {{ q: '{item['q'].replace(chr(39), chr(92)+chr(39))}', a: '{item['a'].replace(chr(39), chr(92)+chr(39))}' }}"
            for item in faq_items
        )
        faq_str = f"\n        faq: [\n{faq_entries}\n        ],"

    # Build internalLinks TS string
    links_str = ""
    if related_slugs:
        slugs_ts = ", ".join(f"'{s}'" for s in related_slugs)
        links_str = f"\n        internalLinks: [{slugs_ts}],"

    # Build jsonLdSchema TS string (escaped for template literal)
    schema_str = ""
    if json_ld:
        safe_schema = json_ld.replace('`', '\\`').replace('\\', '\\\\')
        schema_str = f"\n        jsonLdSchema: `{safe_schema}`,"

    theme_str = f"\n        weeklyTheme: '{weekly_theme}'," if weekly_theme else ""

    label = "Block A" if block_id == 1 else "Block B"
    entry = (
        f"    {{\n"
        f"        id: {next_id},\n"
        f"        slug: '{slug}',\n"
        f"        category: 'Market Intelligence',\n"
        f"        title: '{safe_title}',\n"
        f"        date: '{date_formatted}',\n"
        f"        readTime: '5 min read',\n"
        f"        excerpt: '{safe_excerpt}',\n"
        f"        intro: '{safe_intro}',\n"
        f"        metaDescription: '{safe_meta}',{faq_str}{links_str}{schema_str}{theme_str}\n"
        f"        sections: [\n"
        f"{sections_str}\n"
        f"        ]\n"
        f"    }},\n    /* SEO_AUTO_INJECT_{label}_{date_str} */"
    )
    return entry, slug


def inject_into_blogposts_ts(entry: str, ts_path: Path, date_str: str, block_label: str) -> bool:
    """
    Prepend a new blog post entry at the top of the blogPosts array in blogPosts.ts.
    Does NOT store any .md file. The entry goes straight into the live data file.
    """
    if not ts_path.exists():
        log(f"blogPosts.ts not found at: {ts_path}", "ERROR")
        return False

    content = ts_path.read_text(encoding="utf-8")

    # Inject after the opening of the blogPosts array
    insert_marker = "export const blogPosts: BlogPost[] = ["
    if insert_marker not in content:
        log("Could not find blogPosts array marker in blogPosts.ts", "ERROR")
        return False

    new_content = content.replace(
        insert_marker,
        f"{insert_marker}\n{entry}\n",
        1
    )

    ts_path.write_text(new_content, encoding="utf-8")
    log(f"  ✅ {block_label} injected into blogPosts.ts (id prepended at top)")
    return True


# ─────────────────────────────────────────────────────
# GIT AUTO-PUSH & DEPLOY
# ─────────────────────────────────────────────────────

def git_push(website_root: Path, date_str: str, block_label: str) -> bool:
    """Run the npm deploy script to build and push to GitHub Pages."""
    try:
        log(f"  Deploying {block_label} to GitHub Pages...")
        subprocess.run(["npm", "run", "deploy"], cwd=website_root, check=True, capture_output=True)
        log(f"  ✅ Successfully deployed {block_label} to live site.")
        return True
    except subprocess.CalledProcessError as e:
        stderr = e.stderr.decode() if e.stderr else ""
        stdout = e.stdout.decode() if e.stdout else ""
        log(f"  Deploy failed: {stderr.strip() or stdout.strip()}", "WARN")
        log("  (Changes are injected locally — push manually if needed)", "WARN")
        return False


# ─────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────

def run(
    date: Optional[str] = None,
    test_mode: bool = False,
    auto_push: bool = True,
    verbose: bool = False,
) -> bool:
    """
    Full SEO block generation pipeline.
    Generates 2 blocks per run (Block A = top 10 keywords, Block B = next 10).
    Injects both directly into blogPosts.ts. No .md files stored.
    Returns True if both blocks succeeded.
    """
    log("=" * 60)
    log("STEP 3 — SEO Block Generator (2-Block Mode)")
    log("=" * 60)

    today = date or datetime.now().strftime("%Y-%m-%d")

    # ── Load keywords ──
    if test_mode:
        kw_data = mock_keywords()
        log("Test mode: using mock keyword data.")
    else:
        kw_data = load_todays_keywords(today)

    all_keywords = kw_data.get("keywords", [])
    if not all_keywords:
        log("No keywords found in data file.", "ERROR")
        return False

    # ── Split into Block A (top 10) and Block B (next 10) ──
    n = config.BLOCK_KEYWORDS_EACH
    block_a_kws = all_keywords[:n]
    block_b_kws = all_keywords[n:n * 2]

    blocks = [
        ("Block A", block_a_kws, 1),
        ("Block B", block_b_kws, 2),
    ]

    all_success = True

    for block_label, block_kws, block_id in blocks:
        if not block_kws:
            log(f"  Skipping {block_label} — no keywords available.", "WARN")
            continue

        log(f"\n{'─' * 60}")
        log(f"Generating {block_label} ({len(block_kws)} keywords)...")
        log(f"  Top keywords: {', '.join(item['keyword'] for item in block_kws[:5])}")

        # ── Pillar 3: Weekly theme ──
        weekly_themes = getattr(config, 'WEEKLY_THEME_ROTATION', [])
        iso_week = datetime.now().isocalendar()[1]
        theme = weekly_themes[iso_week % len(weekly_themes)] if weekly_themes else ""
        if theme:
            log(f"  Weekly theme: {theme}")

        # ── Pillar 1: Find related posts for internal linking ──
        kw_strings = [item["keyword"] for item in block_kws]
        related = find_related_posts(kw_strings, config.BLOGPOSTS_TS_PATH, limit=2)
        if related:
            log(f"  Related posts found: {[r['title'][:40] for r in related]}")

        # ── Generate content ──
        if test_mode:
            log(f"  Test mode: generating mock content for {block_label}.")
            content = generate_mock_content(block_kws, block_label)
        else:
            prompt = build_gemini_prompt(block_kws, block_label, related_posts=related)
            if verbose:
                log(f"  Prompt preview (first 300 chars):\n  {prompt[:300]}...")
            content_draft = call_ai_model(prompt)
            log(f"  Humanizing {block_label} content with blader/humanizer...")
            content = humanize_content(content_draft)

        # ── Pillar 5: Generate FAQ ──
        log(f"  Generating FAQ section (People Also Ask)...")
        faq_items = generate_faq(block_kws, test_mode=test_mode)
        if faq_items:
            log(f"  ✅ {len(faq_items)} FAQ pairs generated.")

        # ── Pillar 6: Generate Guest Post (Backlinks) ──
        # We only need to generate ONE guest post per run (using the first block's keywords)
        if block_id == 1:
            log(f"  Generating external Guest Post for backlinks...")
            generate_guest_post(block_kws, today, test_mode=test_mode)

        # ── Keyword density check ──
        density = analyze_keyword_density(content, block_kws)
        log(f"  Keyword density: {density['keywords_found']}/{len(block_kws)} found, "
            f"{density['total_words']} words")
        if verbose:
            for kw_item in density["found"][:5]:
                log(f"    ✓ '{kw_item['keyword']}' — {kw_item['count']}× ({kw_item['density_pct']}%)")

        # ── Build JSON-LD schema & TS entry ──
        next_id = get_next_blog_id(config.BLOGPOSTS_TS_PATH)
        meta_match = re.search(r'<!--\s*META:\s*(.*?)\s*-->', content)
        meta_desc_for_schema = meta_match.group(1) if meta_match else ""
        title_match_s = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
        title_for_schema = title_match_s.group(1) if title_match_s else f"B2B Market Intelligence — {today}"
        
        slug_for_schema = re.sub(r'[^a-z0-9]+', '-', title_for_schema.lower()).strip('-')[:55]
        if block_id == 2:
            slug_for_schema = slug_for_schema[:50] + "-ii"
        slug_for_schema = f"{slug_for_schema}-{next_id}"
        
        json_ld = build_json_ld_schema(title_for_schema, meta_desc_for_schema, slug_for_schema, today, faq_items, block_kws)

        related_slugs = [r["slug"] for r in related] if related else []

        ts_entry, injected_slug = build_ts_entry(
            content, block_kws, today, block_id, next_id,
            faq_items=faq_items,
            json_ld=json_ld,
            related_slugs=related_slugs,
            weekly_theme=theme,
        )

        injected = inject_into_blogposts_ts(
            ts_entry, config.BLOGPOSTS_TS_PATH, today, block_label
        )

        if not injected:
            all_success = False
            log(f"  {block_label} injection failed.", "ERROR")
            continue

        # ── Save density log ──
        report_key = f"density_report_{today}_{block_label.replace(' ', '_').lower()}"
        report_path = config.OUTPUT_KEYWORD_LOGS_DIR / f"{report_key}.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(density, f, indent=2, ensure_ascii=False)

        # ── Auto git push ──
        if auto_push and not test_mode:
            git_push(config.WEBSITE_ROOT, today, block_label)
        elif test_mode:
            log(f"  Test mode: skipping git push.")

        # ── Content preview ──
        preview = "\n".join(content.split("\n")[:12])
        log(f"\n  {block_label} preview:\n{'─' * 40}")
        print(preview)
        log(f"{'─' * 40}")

    log(f"\n{'─' * 60}")
    if all_success:
        log(f"✅ Both blocks generated and injected into blogPosts.ts")
        log(f"   Your Market Signals page is live at: {config.BUSINESS_URL}/signals")
    else:
        log("Some blocks failed. Check errors above.", "WARN")

    return all_success


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Elesium SEO Block Generator — 2-Block Mode")
    parser.add_argument("--date", type=str, help="Target date (YYYY-MM-DD)")
    parser.add_argument("--test", action="store_true", help="Mock mode, no API call")
    parser.add_argument("--no-push", action="store_true", help="Skip git push after injection")
    parser.add_argument("--verbose", action="store_true", help="Verbose output")
    args = parser.parse_args()

    success = run(
        date=args.date,
        test_mode=args.test,
        auto_push=not args.no_push,
        verbose=args.verbose,
    )
    sys.exit(0 if success else 1)
