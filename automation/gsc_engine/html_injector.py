"""
=============================================================================
GSC STRIKING DISTANCE ENGINE - HTML & MONOLITHIC SCHEMA INJECTOR
=============================================================================
Classification: Idempotent Pre-rendered HTML & Consolidated @graph Injector
Methodology: Preservation of Zero-Width Watermarks, Monolithic @graph & Clean DOM
=============================================================================
"""

import os
import re
import json
import logging
from pathlib import Path
from typing import Dict, Any, Tuple, Optional, List

from automation.gsc_engine.config import SOLUTIONS_DIST_DIR
from automation.gsc_engine.models import OptimizationPayload

logger = logging.getLogger(__name__)

# Regex pattern for existing striking distance section (attribute order agnostic)
RE_EXISTING_SECTION = re.compile(
    r"(?:<!--\s*=+\s*STRIKING DISTANCE OPTIMIZATION.*?-->\s*)?<section\b[^>]*\bid=[\"\']striking-distance-optimization[\"\'][^>]*>[\s\S]*?<\/section>",
    re.MULTILINE | re.IGNORECASE,
)

# Regex pattern for any standalone striking distance schema tag (regardless of attribute ordering)
RE_EXISTING_STANDALONE_SCHEMA = re.compile(
    r'<script\b[^>]*\bid=[\"\']striking-distance-faq-schema[\"\'][^>]*>[\s\S]*?<\/script>\s*',
    re.MULTILINE | re.IGNORECASE,
)

# Regex matching primary monolithic JSON-LD script containing @graph
RE_GRAPH_SCRIPT = re.compile(
    r'(<script\b(?=[^>]*\btype=[\"\']application/ld\+json[\"\'])[^>]*>\s*\{[\s\S]*?\"@graph\"[\s\S]*?<\/script>)',
    re.MULTILINE | re.IGNORECASE,
)


class HTMLInjector:
    """
    Safely and idempotently injects the striking distance HTML container section
    and consolidates FAQ microdata into the primary monolithic @graph JSON-LD schema.
    """

    def __init__(self, dist_dir: Path = SOLUTIONS_DIST_DIR):
        self.dist_dir = dist_dir

    def inject_payload(self, payload: OptimizationPayload) -> Tuple[bool, int, str]:
        """
        Injects the optimization payload into both:
        1. solutions/{slug}/index.html
        2. solutions/{slug}.html
        Returns (success: bool, files_updated: int, message: str).
        """
        slug = payload.slug
        targets = [
            self.dist_dir / slug / "index.html",
            self.dist_dir / f"{slug}.html",
        ]

        files_updated = 0
        for target in targets:
            if not target.exists():
                logger.warning(f"HTMLInjector: Target does not exist: {target}")
                continue

            content = target.read_text(encoding="utf-8")
            updated = self._inject_into_content(content, payload)
            target.write_text(updated, encoding="utf-8")
            files_updated += 1

        if files_updated > 0:
            return True, files_updated, f"Successfully injected into {files_updated} file(s) for {slug}."
        else:
            return False, 0, f"No target HTML files found for slug: {slug}."

    def _inject_into_content(self, content: str, payload: OptimizationPayload) -> str:
        """
        Consolidates FAQ items into existing @graph FAQPage, removes duplicate standalone
        schema tags, and injects/replaces the HTML section.
        """
        # 1. Strip any redundant standalone striking-distance-faq-schema scripts
        if RE_EXISTING_STANDALONE_SCHEMA.search(content):
            content = RE_EXISTING_STANDALONE_SCHEMA.sub("", content)

        # 2. Consolidate FAQ questions into existing primary @graph schema
        new_faq_entities = payload.json_ld_schema.get("mainEntity", [])

        graph_match = RE_GRAPH_SCRIPT.search(content)
        if graph_match:
            full_tag = graph_match.group(1)
            # Extract inner JSON
            json_text_match = re.search(r'>\s*(\{[\s\S]*\})\s*<', full_tag)
            if json_text_match:
                try:
                    graph_data = json.loads(json_text_match.group(1))
                    if "@graph" in graph_data and isinstance(graph_data["@graph"], list):
                        # Locate or create FAQPage in @graph
                        faq_page = None
                        for entity in graph_data["@graph"]:
                            if entity.get("@type") == "FAQPage":
                                faq_page = entity
                                break

                        if faq_page is None:
                            faq_page = {
                                "@type": "FAQPage",
                                "@id": f"{payload.page_url}#faq",
                                "mainEntity": [],
                            }
                            graph_data["@graph"].append(faq_page)

                        existing_questions = {
                            q.get("name", "").strip().lower()
                            for q in faq_page.setdefault("mainEntity", [])
                        }

                        # Prepend striking distance questions if not already present
                        for new_q in reversed(new_faq_entities):
                            q_name = new_q.get("name", "").strip().lower()
                            if q_name not in existing_questions:
                                faq_page["mainEntity"].insert(0, new_q)
                                existing_questions.add(q_name)

                        # Re-serialize monolithic @graph script
                        new_script_tag = f'<script type="application/ld+json">\n{json.dumps(graph_data, indent=2)}\n</script>'
                        content = content.replace(full_tag, new_script_tag, 1)
                except Exception as e:
                    logger.warning(f"Failed to consolidate @graph JSON-LD: {e}")
        else:
            # Standalone fallback when document does not have a monolithic @graph
            schema_json_str = json.dumps(payload.json_ld_schema, indent=2)
            standalone_tag = f'<script type="application/ld+json" id="striking-distance-faq-schema">\n{schema_json_str}\n</script>'
            if "</head>" in content:
                content = content.replace("</head>", f"  {standalone_tag}\n</head>", 1)
            else:
                content = f"{standalone_tag}\n{content}"

        # 3. Inject or replace container section
        section_html = payload.container_section_html

        if RE_EXISTING_SECTION.search(content):
            # Replace first occurrence with a temporary unique marker, strip all duplicates, then insert new section
            placeholder = "<!--__STRIKING_DISTANCE_OPTIMIZATION_REPLACE_MARKER__-->"
            content = RE_EXISTING_SECTION.sub(placeholder, content, count=1)
            content = RE_EXISTING_SECTION.sub("", content)
            content = content.replace(placeholder, section_html.strip(), 1)
        elif '<section id="aeo-empirical-benchmarks"' in content:
            # Inject immediately before the AEO benchmark section
            content = content.replace(
                '<section id="aeo-empirical-benchmarks"',
                f"{section_html.strip()}\n\n  <section id=\"aeo-empirical-benchmarks\"",
                1,
            )
        elif '<section id="aeo-citation-grounding"' in content:
            # Fallback before AEO citation grounding
            content = content.replace(
                '<section id="aeo-citation-grounding"',
                f"{section_html.strip()}\n\n  <section id=\"aeo-citation-grounding\"",
                1,
            )
        elif "</main>" in content:
            content = content.replace("</main>", f"  {section_html.strip()}\n</main>", 1)
        elif "<footer" in content:
            content = content.replace("<footer", f"{section_html.strip()}\n\n<footer", 1)
        else:
            content = content.replace("</body>", f"{section_html.strip()}\n</body>", 1)

        return content
