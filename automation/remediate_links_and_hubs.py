#!/usr/bin/env python3
"""
automation/remediate_links_and_hubs.py

Remediates all internal solution links across:
1. frontend/dist/solutions/index.html (Solutions Hub -> 100 retained solutions only)
2. frontend/dist/solutions/category/ (13 category pillar hubs -> retained solutions only)
3. 100 retained solution HTML pages in frontend/dist/solutions/ (peer links -> retained solutions only)
"""

import json
import re
import html
import gzip
import brotli
import sys
from pathlib import Path
from typing import Dict, List, Any

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))
sys.path.insert(0, str(ROOT_DIR / "automation"))

DIST_DIR = ROOT_DIR / "frontend" / "dist"
SOLUTIONS_DIST = DIST_DIR / "solutions"
CATEGORY_DIST = SOLUTIONS_DIST / "category"
DIST_INDEX = DIST_DIR / "index.html"

PUBLIC_DIR = ROOT_DIR / "frontend" / "public"
SOLUTIONS_PUB = PUBLIC_DIR / "solutions"
CATEGORY_PUB = SOLUTIONS_PUB / "category"

GROUNDING_CAPSULES_FILE = ROOT_DIR / "automation" / "geo_grounding_capsules.json"
_GROUNDING_CAPSULES = {}
if GROUNDING_CAPSULES_FILE.exists():
    try:
        raw_caps = json.loads(GROUNDING_CAPSULES_FILE.read_text(encoding="utf-8"))
        for c in raw_caps.get("capsules", []):
            _GROUNDING_CAPSULES.setdefault(c["solution_slug"], []).append(c)
    except Exception:
        pass

from automation.topical_silos_data import (
    SILO_DEFINITIONS,
    get_silo_for_solution,
    get_peer_solutions_in_silo,
)

try:
    from automation.knowledge_graph_registry import SILO_KNOWLEDGE_MESH, STATUTORY_ENTITIES, ORGANIZATION_ENTITY
except ImportError:
    try:
        from knowledge_graph_registry import SILO_KNOWLEDGE_MESH, STATUTORY_ENTITIES, ORGANIZATION_ENTITY
    except ImportError:
        SILO_KNOWLEDGE_MESH, STATUTORY_ENTITIES, ORGANIZATION_ENTITY = {}, {}, {}
from automation.generate_ssg import (
    load_solutions_via_node,
    render_solutions_hub_semantic_html,
    render_category_pillar_hub_semantic_html,
    render_solution_semantic_html,
    replace_canonical,
    update_social_urls,
    inject_modulepreload,
    finalize_html_output,
    sanitize_base_html_schema,
)

PRUNED_FILE = ROOT_DIR / "automation" / "pruned_solution_slugs.json"
RETAINED_FILE = ROOT_DIR / "automation" / "retained_solution_slugs.json"


def get_base_html() -> str:
    if not DIST_INDEX.exists():
        raise FileNotFoundError(f"Missing {DIST_INDEX}")
    raw_html = DIST_INDEX.read_text(encoding="utf-8")
    raw_html = sanitize_base_html_schema(raw_html)
    pristine = re.sub(
        r'<div id="root">[\s\S]*?</div>(?=\s*<footer class="footer-seo-mesh"|\s*<script|\s*</body>)',
        '<div id="root"></div>',
        raw_html,
    )
    return pristine


def write_compressed(html_file: Path, content: str):
    html_file.parent.mkdir(parents=True, exist_ok=True)
    html_file.write_text(content, encoding="utf-8")
    b = content.encode("utf-8")
    gz_path = html_file.parent / f"{html_file.name}.gz"
    br_path = html_file.parent / f"{html_file.name}.br"
    gz_path.write_bytes(gzip.compress(b, compresslevel=9))
    br_path.write_bytes(brotli.compress(b, quality=9))


def main():
    with open(RETAINED_FILE, "r", encoding="utf-8") as f:
        retained_slugs_list = json.load(f)
    retained_slugs = set(retained_slugs_list)

    with open(PRUNED_FILE, "r", encoding="utf-8") as f:
        pruned_slugs = set(json.load(f))

    print(f"Loaded {len(retained_slugs)} retained slugs and {len(pruned_slugs)} pruned slugs.")

    curated_path = ROOT_DIR / "automation" / "curated_enterprise_solutions.json"
    curated_map = {}
    if curated_path.exists():
        try:
            curated_list = json.loads(curated_path.read_text(encoding="utf-8"))
            curated_map = {s["slug"]: s for s in curated_list}
            print(f"Loaded {len(curated_map)} curated solutions into remediation pipeline.")
        except Exception as e:
            print(f"Error loading curated solutions: {e}")

    all_solutions = load_solutions_via_node()
    retained_solutions = []
    for s in all_solutions:
        slug = s.get("slug")
        if slug in retained_slugs:
            if slug in curated_map:
                retained_solutions.append(curated_map[slug])
            else:
                retained_solutions.append(s)
    assert len(retained_solutions) == 100, f"Expected 100 retained solutions, got {len(retained_solutions)}"

    base_html = get_base_html()

    # =========================================================================
    # 1. Regenerate Solutions Hub (frontend/dist/solutions/index.html & solutions.html)
    # =========================================================================
    print("Generating curated solutions hub with 100 retained solutions...")
    hub_canonical = "https://elesium.online/solutions/"
    hub_title = "Enterprise AI Solutions & Sovereign Automation Workflows (100 Enterprise Architectures) | Elesium"
    hub_desc = "Catalog of 100 verified enterprise AI solutions across Logistics, BFSI, SCADA Manufacturing, Healthcare, and ERP integration. Deterministic multi-agent workflows."

    hub_html = base_html
    hub_html = re.sub(r"<title>.*?</title>", f"<title>{hub_title}</title>", hub_html)
    hub_html = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', f'<meta name="description" content="{hub_desc}" />', hub_html)
    hub_html = replace_canonical(hub_html, hub_canonical)
    hub_html = update_social_urls(hub_html, hub_canonical)
    hub_html = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', f'<meta property="og:title" content="{hub_title}" />', hub_html)
    hub_html = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', f'<meta property="og:description" content="{hub_desc}" />', hub_html)
    hub_html = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', f'<meta property="og:url" content="{hub_canonical}" />', hub_html)

    hub_semantic = render_solutions_hub_semantic_html(retained_solutions)
    # Update copy inside hub_semantic to reflect 100 solutions
    hub_semantic = hub_semantic.replace("indexes 3,765 verified enterprise AI automations", "indexes 100 verified enterprise AI architectures")
    hub_semantic = hub_semantic.replace("indexes 3,795 verified enterprise AI automations", "indexes 100 verified enterprise AI architectures")

    root_pattern = re.compile(r'<div id="root">[\s\S]*?</div>(?=\s*<footer|\s*<script|\s*</body>)', re.DOTALL)
    if root_pattern.search(hub_html):
        hub_html = root_pattern.sub(lambda m: f'<div id="root">{hub_semantic}</div>', hub_html)
    else:
        hub_html = hub_html.replace('<div id="root"></div>', f'<div id="root">{hub_semantic}</div>')

    # Schema for Hub
    hub_categories = [
        "Logistics & Supply Chain", "BFSI & Underwriting", "Industrial Manufacturing",
        "Healthcare AI", "ERP & Systems", "Telecom & Infrastructure", "Pharma & Life Sciences",
        "Legal & Real Estate Tech", "GovTech & Sovereign Defense", "Aerospace & Avionics",
        "Renewable Energy & Power Grid", "Heavy Industrial & Mining",
        "Enterprise Cybersecurity & Cloud Infrastructure"
    ]
    hub_has_part = []
    for cat_name in hub_categories:
        cat_sols = [s for s in retained_solutions if s.get("hubCategory") == cat_name]
        for s in cat_sols:
            slug = s.get("slug", "")
            h1 = s.get("h1") or slug.replace("-", " ").title()
            desc = s.get("metaDescription") or f"Deploy {h1} with sub-200ms deterministic workflows."
            hub_has_part.append({
                "@type": "Service",
                "name": h1,
                "url": f"https://elesium.online/solutions/{slug}/",
                "description": desc,
                "provider": {"@type": "Organization", "name": "Elesium", "url": "https://elesium.online"}
            })

    hub_collection_schema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": hub_title,
        "description": hub_desc,
        "url": hub_canonical,
        "publisher": {
            "@type": "Organization",
            "name": "Elesium",
            "url": "https://elesium.online",
            "logo": "https://elesium.online/assets/logo-square.png"
        },
        "mainEntity": {
            "@type": "ItemList",
            "name": "100 Enterprise AI Solutions Catalog",
            "numberOfItems": len(retained_solutions),
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": idx + 1,
                    "name": s.get("h1") or s.get("title", ""),
                    "item": f"https://elesium.online/solutions/{s.get('slug')}/"
                }
                for idx, s in enumerate(retained_solutions)
            ]
        },
        "hasPart": hub_has_part
    }
    hub_html = hub_html.replace("</head>", f'\n<script type="application/ld+json">{json.dumps(hub_collection_schema, ensure_ascii=False)}</script>\n</head>')

    final_hub = finalize_html_output(hub_html, hub_canonical)
    final_hub = final_hub.replace("—", " - ")
    write_compressed(SOLUTIONS_DIST / "index.html", final_hub)
    write_compressed(DIST_DIR / "solutions.html", final_hub)
    SOLUTIONS_PUB.mkdir(parents=True, exist_ok=True)
    (SOLUTIONS_PUB / "index.html").write_text(final_hub, encoding="utf-8")
    (PUBLIC_DIR / "solutions.html").write_text(final_hub, encoding="utf-8")
    print("✅ Solutions Hub written to frontend/dist/solutions/index.html & solutions.html and frontend/public mirror")

    # =========================================================================
    # 2. Regenerate 13 Category Pillar Hubs (solutions/category/<silo_id>)
    # =========================================================================
    print("Generating 13 Category Pillar Hubs with retained solutions...")
    CATEGORY_DIST.mkdir(parents=True, exist_ok=True)
    CATEGORY_PUB.mkdir(parents=True, exist_ok=True)

    for silo_id, silo_data in SILO_DEFINITIONS.items():
        silo_retained_sols = [s for s in retained_solutions if get_silo_for_solution(s) == silo_id]
        cat_canonical = f"https://elesium.online/solutions/category/{silo_id}/"
        cat_title = silo_data["title"]
        cat_desc = silo_data["metaDescription"]

        cat_html = base_html
        cat_html = re.sub(r"<title>.*?</title>", f"<title>{cat_title}</title>", cat_html)
        cat_html = re.sub(r'<meta name="description" content="[^"]*"\s*/?>', f'<meta name="description" content="{cat_desc}" />', cat_html)
        cat_html = replace_canonical(cat_html, cat_canonical)
        cat_html = update_social_urls(cat_html, cat_canonical)
        cat_html = re.sub(r'<meta property="og:title" content="[^"]*"\s*/?>', f'<meta property="og:title" content="{cat_title}" />', cat_html)
        cat_html = re.sub(r'<meta property="og:description" content="[^"]*"\s*/?>', f'<meta property="og:description" content="{cat_desc}" />', cat_html)
        cat_html = re.sub(r'<meta property="og:url" content="[^"]*"\s*/?>', f'<meta property="og:url" content="{cat_canonical}" />', cat_html)

        cat_semantic = render_category_pillar_hub_semantic_html(silo_id, silo_data, silo_retained_sols)
        if root_pattern.search(cat_html):
            cat_html = root_pattern.sub(lambda m: f'<div id="root">{cat_semantic}</div>', cat_html)
        else:
            cat_html = cat_html.replace('<div id="root"></div>', f'<div id="root">{cat_semantic}</div>')

        # Schema
        mesh = SILO_KNOWLEDGE_MESH.get(silo_id, {})
        regulators_list = [STATUTORY_ENTITIES[r] for r in mesh.get("regulators", []) if r in STATUTORY_ENTITIES]
        mentions_list = list(regulators_list) + list(mesh.get("secondary_entities", []))
        about_list = [{"@id": "https://elesium.online/#organization"}]
        if "primary_entity" in mesh:
            about_list.append(mesh["primary_entity"])

        cat_schema = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "WebPage",
                    "@id": f"{cat_canonical}#webpage",
                    "url": cat_canonical,
                    "name": cat_title,
                    "description": cat_desc,
                    "isPartOf": {"@id": "https://elesium.online/#website"},
                    "about": about_list,
                    "mentions": mentions_list
                },
                {
                    "@type": "CollectionPage",
                    "@id": f"{cat_canonical}#collection",
                    "url": cat_canonical,
                    "name": cat_title,
                    "description": cat_desc,
                    "isPartOf": {"@id": "https://elesium.online/#website"},
                    "hasPart": [
                        {
                            "@type": "Service",
                            "name": s.get("h1") or s.get("slug", "").replace("-", " ").title(),
                            "url": f"https://elesium.online/solutions/{s.get('slug')}/",
                            "description": s.get("metaDescription", ""),
                            "provider": {"@id": "https://elesium.online/#organization"}
                        }
                        for s in silo_retained_sols
                    ]
                },
                {
                    "@type": "ItemList",
                    "@id": f"{cat_canonical}#itemlist",
                    "name": f"{silo_data['name']} AI Architecture Catalog",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": idx + 1,
                            "name": s.get("h1") or s.get("slug", "").replace("-", " ").title(),
                            "url": f"https://elesium.online/solutions/{s.get('slug')}/"
                        }
                        for idx, s in enumerate(silo_retained_sols)
                    ]
                }
            ]
        }
        cat_html = cat_html.replace("</head>", f'\n<script type="application/ld+json">{json.dumps(cat_schema, ensure_ascii=False)}</script>\n</head>')
        final_cat = finalize_html_output(cat_html, cat_canonical)
        final_cat = final_cat.replace("—", " - ")

        write_compressed(CATEGORY_DIST / silo_id / "index.html", final_cat)
        write_compressed(CATEGORY_DIST / f"{silo_id}.html", final_cat)
        (CATEGORY_PUB / silo_id).mkdir(parents=True, exist_ok=True)
        (CATEGORY_PUB / silo_id / "index.html").write_text(final_cat, encoding="utf-8")
        (CATEGORY_PUB / f"{silo_id}.html").write_text(final_cat, encoding="utf-8")
        print(f"  Generated Category Pillar: /solutions/category/{silo_id} ({len(silo_retained_sols)} retained solutions)")

    # =========================================================================
    # 3. Clean Peer Links & Enrich Metadata in all 100 Retained Solution HTML Files
    # =========================================================================
    print("Re-rendering peer links & metadata for all 100 retained enterprise solutions...")
    retained_dict = {s["slug"]: s for s in retained_solutions}

    # Helper mapping of silo -> retained solutions
    silo_to_retained: Dict[str, List[Dict[str, Any]]] = {}
    for s in retained_solutions:
        sid = get_silo_for_solution(s)
        silo_to_retained.setdefault(sid, []).append(s)

    for sol in retained_solutions:
        slug = sol["slug"]
        sid = get_silo_for_solution(sol)
        # Select 4 peers strictly from retained set
        peers = [p for p in silo_to_retained.get(sid, []) if p["slug"] != slug]
        if len(peers) < 4:
            # Supplement from other retained solutions
            supplements = [p for p in retained_solutions if p["slug"] != slug and p not in peers]
            peers.extend(supplements[: 4 - len(peers)])
        peers = peers[:4]

        # Re-render semantic HTML for this solution
        sol_semantic = render_solution_semantic_html(sol, all_sols=peers)
        sol_title = sol.get("title", f"{sol.get('h1', slug)} | Elesium")
        sol_desc = sol.get("metaDescription", "")

        faq_items = [
            {"@type": "Question", "name": f.get("question", ""), "acceptedAnswer": {"@type": "Answer", "text": f.get("answer", "")}}
            for f in sol.get("faqs", []) if f.get("question") and f.get("answer")
        ]
        slug_caps = _GROUNDING_CAPSULES.get(slug, [])
        for c in slug_caps:
            faq_items.append({"@type": "Question", "name": c["h2_heading"], "acceptedAnswer": {"@type": "Answer", "text": c["declarative_answer_capsule"]}})

        # Update dist and public HTML files from dist template
        dist_html_path = SOLUTIONS_DIST / slug / "index.html"
        if not dist_html_path.exists():
            continue
        text = dist_html_path.read_text(encoding="utf-8", errors="ignore")

        # Replace title
        text = re.sub(r"<title>.*?</title>", f"<title>{html.escape(sol_title)}</title>", text, flags=re.IGNORECASE | re.DOTALL)
        # Replace description (handling any attribute order)
        text = re.sub(r'<meta\s+[^>]*name=[\"\']description[\"\'][^>]*>', f'<meta name="description" content="{html.escape(sol_desc)}" />', text, flags=re.IGNORECASE)
        # Replace OG title/desc
        text = re.sub(r'<meta\s+[^>]*property=[\"\']og:title[\"\'][^>]*>', f'<meta property="og:title" content="{html.escape(sol_title)}" />', text, flags=re.IGNORECASE)
        text = re.sub(r'<meta\s+[^>]*property=[\"\']og:description[\"\'][^>]*>', f'<meta property="og:description" content="{html.escape(sol_desc)}" />', text, flags=re.IGNORECASE)
        # Replace Twitter title/desc
        text = re.sub(r'<meta\s+[^>]*name=[\"\']twitter:title[\"\'][^>]*>', f'<meta name="twitter:title" content="{html.escape(sol_title)}" />', text, flags=re.IGNORECASE)
        text = re.sub(r'<meta\s+[^>]*name=[\"\']twitter:description[\"\'][^>]*>', f'<meta name="twitter:description" content="{html.escape(sol_desc)}" />', text, flags=re.IGNORECASE)

        # Replace root semantic DOM cleanly
        clean_root_regex = re.compile(r'<div id="root">[\s\S]*?</div>(?=\s*<footer|\s*<script|\s*</body>)', re.DOTALL)
        if clean_root_regex.search(text):
            text = clean_root_regex.sub(lambda m: f'<div id="root">{sol_semantic}</div>', text)
        else:
            text = text.replace('<div id="root"></div>', f'<div id="root">{sol_semantic}</div>')

        # Inject FAQPage schema if not present
        if faq_items and '"@type": "FAQPage"' not in text and '</head>' in text:
            faq_schema = {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": faq_items
            }
            faq_script = f'\n<script type="application/ld+json">{json.dumps(faq_schema, ensure_ascii=False)}</script>'
            text = text.replace("</head>", f"{faq_script}\n</head>")

        # Scrub all em dashes
        text = text.replace("—", " - ")

        # Check for any lingering pruned solution links in text
        href_matches = re.findall(r'href=["\'](?:https?://elesium\.online)?/solutions/([^"\'#?]+)/?["\']', text)
        for target in href_matches:
            clean_target = target.strip("/").strip()
            if clean_target in pruned_slugs:
                replacement = peers[0]["slug"] if peers else slug
                text = text.replace(f"/solutions/{clean_target}/", f"/solutions/{replacement}/")
                text = text.replace(f"/solutions/{clean_target}", f"/solutions/{replacement}/")

        write_compressed(SOLUTIONS_DIST / slug / "index.html", text)
        write_compressed(SOLUTIONS_DIST / f"{slug}.html", text)
        (SOLUTIONS_PUB / slug).mkdir(parents=True, exist_ok=True)
        (SOLUTIONS_PUB / slug / "index.html").write_text(text, encoding="utf-8")
        (SOLUTIONS_PUB / f"{slug}.html").write_text(text, encoding="utf-8")

    print("✅ All 100 retained solutions updated across dist and public with verified peer links, titles, and schema.")


if __name__ == "__main__":
    main()
