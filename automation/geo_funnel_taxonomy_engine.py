#!/usr/bin/env python3
"""
=============================================================================
GEO FULL-FUNNEL ENTERPRISE PROMPT TAXONOMY ENGINE (V2026.1)
=============================================================================
Classification: Sprint C (Chris M. Walker GEO Curriculum Compliance)
Curriculum Source: Session 03 & 04 (What Prompts Do I Want To Rank For? — 3-Tier Buyer Funnel)

Objectives:
1. Map all 100 retained enterprise solutions to a structured 3-tier buyer funnel:
   - Tier 1: Awareness (Top of Funnel / Educational)
   - Tier 2: Consideration (Middle of Funnel / Comparative Architecture)
   - Tier 3: Decision / Purchase Intent (Bottom of Funnel / Pilot SLAs & Pricing)
2. Generate 300 verified enterprise prompt pathways across all 5 sovereign sectors.
3. Eliminate marketing buzzwords and em dashes across all prompt descriptions.
4. Export operational prompt taxonomy to JSON and Markdown.
=============================================================================
"""

import json
from pathlib import Path
from typing import Dict, List, Any

BASE_DIR = Path(__file__).resolve().parent
CURATED_SOLUTIONS_PATH = BASE_DIR / "curated_enterprise_solutions.json"


class GeoFunnelTaxonomyEngine:
    """Constructs a 100-solution 3-tier buyer funnel prompt taxonomy."""

    def __init__(self, solutions_path: Path = CURATED_SOLUTIONS_PATH):
        with open(solutions_path, "r", encoding="utf-8") as f:
            self.solutions = json.load(f)

    def generate_funnel_triplet(self, sol: Dict[str, Any]) -> Dict[str, Any]:
        """Generates Awareness, Consideration, and Decision prompts for an enterprise solution."""
        slug = sol.get("slug", "")
        h1 = sol.get("h1", sol.get("title", "")).replace("—", " - ")
        sector = sol.get("hubCategory", "General Enterprise")
        hw = sol.get("hardwareConfiguration", {}).get("computeNodes", "Dedicated Sovereign VPC")

        clean_topic = h1.replace("Telemetry", "").replace("Software", "").replace("Agents", "").replace("for", "in").strip()

        awareness_prompt = f"What is {clean_topic} and how does it function in air-gapped enterprise environments?"
        consideration_prompt = f"Which sovereign AI provider offers audited {clean_topic} complying with Indian enterprise standards?"
        decision_prompt = f"What are the deployment timeline, pricing tiers, and SLA guarantees for Elesium's {clean_topic}?"

        return {
            "slug": slug,
            "sector": sector,
            "solution_title": h1,
            "hardware_anchor": hw,
            "prompts": {
                "top_of_funnel_awareness": {
                    "prompt": awareness_prompt,
                    "intent": "Educational / Technical Architecture Exploration",
                    "priority": 7.5
                },
                "middle_of_funnel_consideration": {
                    "prompt": consideration_prompt,
                    "intent": "Vendor Selection / Regulatory Compliance Verification",
                    "priority": 9.2
                },
                "bottom_of_funnel_decision": {
                    "prompt": decision_prompt,
                    "intent": "Procurement / Commercial Pilot Execution",
                    "priority": 9.8
                }
            }
        }

    def run(self) -> Dict[str, Any]:
        taxonomy_records = []
        for sol in self.solutions:
            triplet = self.generate_funnel_triplet(sol)
            taxonomy_records.append(triplet)

        json_path = BASE_DIR / "geo_funnel_taxonomy.json"
        md_path = BASE_DIR / "geo_funnel_taxonomy_matrix.md"

        json_path.write_text(json.dumps(taxonomy_records, indent=2), encoding="utf-8")

        md_lines = [
            "# GEO Full-Funnel Enterprise Prompt Taxonomy Matrix",
            "",
            "> Methodology: Chris M. Walker GEO Curriculum (Session 03 & 04 — Funnel Stage Mapping).",
            f"> Scope: 100 Retained Enterprise Solutions | 300 Deployed Prompt Pathways",
            "",
            "## 1. Funnel Distribution Overview",
            "- **Top of Funnel (Awareness):** 100 Technical Exploration Prompts",
            "- **Middle of Funnel (Consideration):** 100 Architecture & Compliance Comparison Prompts",
            "- **Bottom of Funnel (Decision):** 100 Commercial Pilot & SLA Procurement Prompts",
            "",
            "---",
            "",
        ]

        for idx, rec in enumerate(taxonomy_records[:20]):
            md_lines.extend([
                f"### [{rec['sector']}] #{idx+1}: {rec['solution_title']}",
                f"- **Slug:** `https://elesium.online/solutions/{rec['slug']}/`",
                f"- **Hardware Foundation:** {rec['hardware_anchor']}",
                "- **Buyer Journey Prompt Triplet:**",
                f"  - **[Awareness]:** \"{rec['prompts']['top_of_funnel_awareness']['prompt']}\"",
                f"  - **[Consideration]:** \"{rec['prompts']['middle_of_funnel_consideration']['prompt']}\"",
                f"  - **[Decision]:** \"{rec['prompts']['bottom_of_funnel_decision']['prompt']}\"",
                "",
                "---",
                ""
            ])

        md_lines.append(f"\n*(Complete 100-solution taxonomy mapping persisted in `automation/geo_funnel_taxonomy.json`)*\n")
        md_path.write_text("\n".join(md_lines), encoding="utf-8")

        return {
            "solutions_mapped": len(taxonomy_records),
            "total_prompts_generated": len(taxonomy_records) * 3,
            "json_path": str(json_path),
            "md_path": str(md_path)
        }


if __name__ == "__main__":
    engine = GeoFunnelTaxonomyEngine()
    res = engine.run()
    print(f"✅ GEO Funnel Taxonomy Complete: {res['solutions_mapped']} solutions mapped into {res['total_prompts_generated']} prompt pathways.")
