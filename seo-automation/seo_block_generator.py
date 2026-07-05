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
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Optional, List, Dict

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

def build_gemini_prompt(keywords: List[Dict], block_label: str) -> str:
    """
    Build the Gemini prompt using a 2-phase keyword-first writing strategy.

    Phase 1: Raw keywords are placed as standalone anchor points.
    Phase 2: Tight, enterprise-grade statements are built around each anchor.

    This produces maximum keyword density while remaining readable.
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
[2-3 tight paragraphs using Phase 2 statements]

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
        return _call_nvidia(prompt)
    else:
        return _call_gemini(prompt)

def _call_nvidia(prompt: str) -> str:
    if not getattr(config, "NVIDIA_API_KEY", ""):
        log("NVIDIA_API_KEY not set in .env file.", "ERROR")
        sys.exit(1)

    try:
        from openai import OpenAI
    except ImportError:
        log("openai package not installed. Run: pip install openai", "ERROR")
        sys.exit(1)

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
        log("NVIDIA returned empty content.", "ERROR")
        sys.exit(1)

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


def build_ts_entry(content: str, keywords: List[Dict], date_str: str, block_id: int, next_id: int) -> str:
    """Build a full, valid TypeScript BlogPost object from generated content."""
    # Extract meta description
    meta_match = re.search(r'<!--\s*META:\s*(.*?)\s*-->', content)
    meta_desc = meta_match.group(1) if meta_match else ""

    # Extract H2 title
    title_match = re.search(r'^##\s+(.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else f"B2B Market Intelligence — {date_str}"

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
    slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')[:60]
    # Ensure block B has a distinct slug
    if block_id == 2:
        slug = slug[:55] + "-ii"

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
        f"        metaDescription: '{safe_meta}',\n"
        f"        sections: [\n"
        f"{sections_str}\n"
        f"        ]\n"
        f"    }},\n    /* SEO_AUTO_INJECT_{label}_{date_str} */"
    )
    return entry


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

        # ── Generate content ──
        if test_mode:
            log(f"  Test mode: generating mock content for {block_label}.")
            content = generate_mock_content(block_kws, block_label)
        else:
            prompt = build_gemini_prompt(block_kws, block_label)
            if verbose:
                log(f"  Prompt preview (first 300 chars):\n  {prompt[:300]}...")
            content = call_ai_model(prompt)

        # ── Keyword density check ──
        density = analyze_keyword_density(content, block_kws)
        log(f"  Keyword density: {density['keywords_found']}/{len(block_kws)} found, "
            f"{density['total_words']} words")
        if verbose:
            for kw_item in density["found"][:5]:
                log(f"    ✓ '{kw_item['keyword']}' — {kw_item['count']}× ({kw_item['density_pct']}%)")

        # ── Build and inject TS entry ──
        next_id = get_next_blog_id(config.BLOGPOSTS_TS_PATH)
        ts_entry = build_ts_entry(content, block_kws, today, block_id, next_id)

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
