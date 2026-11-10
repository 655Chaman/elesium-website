#!/usr/bin/env python3
"""
=============================================================================
GEO VIDEO METADATA ENRICHER (V2026.1)
=============================================================================
Classification: Sprint B (Chris M. Walker GEO Curriculum Compliance)
Curriculum Source: Session 10 (Video Metadata Optimization & Anthropic CISO Rule)

Objectives:
1. Align sitemap-videos.xml with the Anthropic CISO Rule:
   "Generative engines cannot read video pixels or audio streams. They scrape
   and index titles, descriptions, chapters, and tags."
2. Inject structured <video:tag> elements matching natural language fan-out queries.
3. Prepend direct-answer declarations to video descriptions.
4. Update both frontend/public/sitemap-videos.xml and frontend/dist/sitemap-videos.xml.
=============================================================================
"""

import xml.etree.ElementTree as ET
from pathlib import Path
from typing import Dict, List, Any

BASE_DIR = Path(__file__).resolve().parent
WEBSITE_ROOT = BASE_DIR.parent
PUBLIC_SITEMAP = WEBSITE_ROOT / "frontend" / "public" / "sitemap-videos.xml"
DIST_SITEMAP = WEBSITE_ROOT / "frontend" / "dist" / "sitemap-videos.xml"

VIDEO_GEO_TAGS = [
    "Sovereign AI India",
    "vLLM Private VPC",
    "DPDP Act 2023 Compliance",
    "RBI Cyber Security Framework Annex II",
    "NVIDIA H100 Sub-200ms TTFT",
    "Deterministic State Machines",
    "Air-Gapped LLM Serving",
    "Enterprise AI Automation"
]


class GeoVideoMetadataEnricher:
    """Enriches sitemap-videos.xml with question tags and direct answers."""

    def __init__(self, public_path: Path = PUBLIC_SITEMAP, dist_path: Path = DIST_SITEMAP):
        self.public_path = public_path
        self.dist_path = dist_path

    def enrich_sitemap(self, xml_path: Path) -> int:
        if not xml_path.exists():
            return 0

        ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
        ET.register_namespace("video", "http://www.google.com/schemas/sitemap-video/1.1")

        tree = ET.parse(xml_path)
        root = tree.getroot()
        ns = {
            "s": "http://www.sitemaps.org/schemas/sitemap/0.9",
            "video": "http://www.google.com/schemas/sitemap-video/1.1"
        }

        enriched_count = 0
        for url_node in root.findall("s:url", ns):
            video_node = url_node.find("video:video", ns)
            if video_node is not None:
                # Check existing tags
                existing_tags = set(t.text.strip() for t in video_node.findall("video:tag", ns) if t.text)
                for tag in VIDEO_GEO_TAGS:
                    if tag not in existing_tags:
                        new_tag = ET.Element("{http://www.google.com/schemas/sitemap-video/1.1}tag")
                        new_tag.text = tag
                        video_node.append(new_tag)

                # Ensure description has direct answer preamble
                desc_elem = video_node.find("video:description", ns)
                if desc_elem is not None and desc_elem.text:
                    current_desc = desc_elem.text.strip()
                    if "Elesium provides" not in current_desc and "Official Grounding:" not in current_desc:
                        desc_elem.text = f"Official Grounding: Elesium provides air-gapped sovereign AI infrastructure in India. {current_desc}"

                enriched_count += 1

        tree.write(xml_path, encoding="UTF-8", xml_declaration=True)
        return enriched_count

    def run(self) -> Dict[str, Any]:
        c1 = self.enrich_sitemap(self.public_path)
        c2 = self.enrich_sitemap(self.dist_path)
        return {
            "public_videos_enriched": c1,
            "dist_videos_enriched": c2,
        }


if __name__ == "__main__":
    enricher = GeoVideoMetadataEnricher()
    res = enricher.run()
    print(f"✅ GEO Video Metadata Enricher Complete: Enriched {res['public_videos_enriched']} videos in public and dist sitemaps.")
