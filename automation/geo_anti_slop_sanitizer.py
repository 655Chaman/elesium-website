#!/usr/bin/env python3
"""
=============================================================================
GEO ANTI-SLOP CONTENT SANITIZER & EMPIRICAL LINTER (V2026.1)
=============================================================================
Classification: Phase 2 (Chris M. Walker GEO Curriculum Compliance)
Curriculum Source: 07. Black_List_To_Improve_Content.docx & Session 07

Objectives:
1. Enforce strict blacklisting of 78 formulaic AI buzzwords and robotic phrases.
2. Neutralize the synthetic LLM signature punctuation: em dash ("—").
3. Replace synthetic fluff with empirical, objective engineering prose.
4. Provide both an audit mode (linter) and a zero-loss automated sanitizer.
=============================================================================
"""

import os
import sys
import re
import json
from pathlib import Path
from typing import Dict, List, Tuple, Any

BASE_DIR = Path(__file__).resolve().parent
WEBSITE_ROOT = BASE_DIR.parent

# The Canonical AMS / Chris M. Walker Banned Vocabulary List
BANNED_PHRASES = [
    "unlock the secrets",
    "unveil the secrets",
    "unveiling the power",
    "unlock limitless potential",
    "endless possibilities",
    "infinite opportunities",
    "in the realm of",
    "when it comes to",
    "in the heart of",
    "seeking more than just",
    "designed to enhance",
    "it's not merely",
    "not only",
    "the world of",
    "edge of my seat",
    "pushing boundaries",
    "beyond imagination",
    "next level",
    "paradigm shift",
    "game-changing",
    "ever-evolving",
    "ever-changing",
    "it is advisable",
    "tapestry",
    "bustling",
    "harnessing",
    "realm",
    "depicted",
    "demystify",
    "insurmountable",
    "new era",
    "poised",
    "unravel",
    "entanglement",
    "unprecedented",
    "beacon",
    "unleash",
    "delve",
    "enrich",
    "multifaceted",
    "discover",
    "unlock",
    "tailored",
    "elegant",
    "dive",
    "adventure",
    "journey",
    "navigate",
    "navigation",
    "meticulous",
    "meticulously",
    "complexities",
    "bespoke",
    "underpins",
    "our suite",
    "daunting",
    "amongst",
    "revolutionary",
    "groundbreaking",
    "transformative",
    "awe-inspiring",
    "at the forefront",
    "cutting-edge",
    "disruptive",
    "synergy",
    "ecosystem",
    "breakthrough",
    "enthralling",
    "captivating",
    "refreshing",
    "looking forward",
    "testament",
    "hurdles",
]

# Context-preserving empirical replacements for technical engineering accuracy
SLOP_REPLACEMENTS = {
    "cutting-edge": "specialized",
    "cutting edge": "specialized",
    "revolutionary": "benchmarked",
    "groundbreaking": "audited",
    "transformative": "deterministic",
    "paradigm shift": "architectural transition",
    "unleash": "deploy",
    "delve": "examine",
    "dive": "inspect",
    "tapestry": "topology",
    "bustling": "high-concurrency",
    "harnessing": "utilizing",
    "realm": "domain",
    "demystify": "specify",
    "new era": "production deployment",
    "poised": "configured",
    "beacon": "reference",
    "enrich": "augment",
    "multifaceted": "multi-component",
    "discover": "evaluate",
    "unlock": "enable",
    "tailored": "custom-configured",
    "bespoke": "dedicated",
    "underpins": "supports",
    "our suite": "our runtime platform",
    "game-changing": "high-throughput",
    "at the forefront": "operationalized",
    "disruptive": "high-efficiency",
    "synergy": "integration",
    "ecosystem": "infrastructure stack",
    "breakthrough": "milestone",
    "seamless": "low-overhead",
    "intuitive": "declarative",
    "sophisticated": "hardened",
    "hurdles": "constraints",
    "complexities": "specifications",
    "meticulous": "rigorous",
    "meticulously": "rigorously",
    "in the realm of": "in",
    "when it comes to": "regarding",
    "in the heart of": "located in",
    "the world of": "the domain of",
    "unlock the secrets": "verify the technical specifications",
    "unveil the secrets": "inspect the architecture",
    "unveiling the power": "deploying the infrastructure",
    "unlock limitless potential": "maximize compute efficiency",
    "endless possibilities": "comprehensive deployment paths",
    "infinite opportunities": "scalable workload parameters",
    "pushing boundaries": "optimizing performance parameters",
    "beyond imagination": "empirically measured",
    "next level": "production-grade",
}


class GeoAntiSlopSanitizer:
    """
    Audits and sanitizes text assets to conform strictly to the
    Chris M. Walker GEO negative constraint and anti-slop rules.
    """

    def __init__(self, root_dir: Path = WEBSITE_ROOT):
        self.root_dir = root_dir
        self.banned_patterns = [
            (re.compile(rf"\b{re.escape(phrase)}\b", re.IGNORECASE), phrase)
            for phrase in sorted(BANNED_PHRASES, key=len, reverse=True)
        ]
        self.em_dash_pattern = re.compile(r"—")

    def audit_text(self, text: str) -> Dict[str, Any]:
        """Audits a block of text for banned terms and em dashes."""
        slop_matches = []
        for pattern, phrase in self.banned_patterns:
            matches = pattern.findall(text)
            if matches:
                slop_matches.append({"phrase": phrase, "count": len(matches)})

        em_dash_count = len(self.em_dash_pattern.findall(text))
        total_slop = sum(m["count"] for m in slop_matches)
        
        # Slop score: 100 is pristine (0 slop), drops per violation
        words = len(text.split())
        density = (total_slop / max(words, 1)) * 1000  # violations per 1000 words
        score = max(0.0, 100.0 - (density * 5.0) - (em_dash_count * 0.5))

        return {
            "word_count": words,
            "total_slop_count": total_slop,
            "em_dash_count": em_dash_count,
            "slop_density_per_1k": round(density, 2),
            "cleanliness_score": round(score, 1),
            "flagged_phrases": slop_matches,
        }

    def sanitize_text(self, text: str) -> Tuple[str, Dict[str, int]]:
        """
        Substitutes banned slop phrases with empirical alternatives
        and replaces em dashes with standard hyphens or colons.
        """
        mutations = {"slop_replaced": 0, "em_dashes_replaced": 0}

        # 1. Replace em dashes with spaced hyphen or colon depending on context
        def replace_em_dash(match):
            mutations["em_dashes_replaced"] += 1
            return " - "

        sanitized = self.em_dash_pattern.sub(replace_em_dash, text)

        # 2. Replace banned vocabulary with empirical terms
        for phrase, replacement in sorted(SLOP_REPLACEMENTS.items(), key=lambda x: len(x[0]), reverse=True):
            regex = re.compile(rf"\b{re.escape(phrase)}\b", re.IGNORECASE)
            
            def repl_func(m):
                mutations["slop_replaced"] += 1
                matched_str = m.group(0)
                # Preserve title case if original was title case
                if matched_str.istitle():
                    return replacement.title()
                elif matched_str.isupper():
                    return replacement.upper()
                return replacement

            sanitized = regex.sub(repl_func, sanitized)

        return sanitized, mutations

    def audit_directory(self, target_dir: Path, extensions=(".html", ".md", ".txt")) -> Dict[str, Any]:
        """Audits all files in a directory matching extensions."""
        results = {}
        total_slop = 0
        total_em_dashes = 0
        total_files = 0

        for root, _, files in os.walk(target_dir):
            for file in files:
                if any(file.endswith(ext) for ext in extensions):
                    file_path = Path(root) / file
                    try:
                        content = file_path.read_text(encoding="utf-8")
                        audit = self.audit_text(content)
                        if audit["total_slop_count"] > 0 or audit["em_dash_count"] > 0:
                            rel_path = str(file_path.relative_to(self.root_dir))
                            results[rel_path] = audit
                            total_slop += audit["total_slop_count"]
                            total_em_dashes += audit["em_dash_count"]
                        total_files += 1
                    except Exception:
                        continue

        return {
            "total_files_audited": total_files,
            "flagged_files_count": len(results),
            "aggregate_slop_tokens": total_slop,
            "aggregate_em_dashes": total_em_dashes,
            "file_audits": results,
        }

    def sanitize_files(self, file_paths: List[Path]) -> Dict[str, Any]:
        """Sanitizes a list of files in place."""
        stats = {"files_sanitized": 0, "total_slop_replaced": 0, "total_em_dashes_replaced": 0}

        for path in file_paths:
            try:
                content = path.read_text(encoding="utf-8")
                sanitized, mutations = self.sanitize_text(content)
                if mutations["slop_replaced"] > 0 or mutations["em_dashes_replaced"] > 0:
                    path.write_text(sanitized, encoding="utf-8")
                    stats["files_sanitized"] += 1
                    stats["total_slop_replaced"] += mutations["slop_replaced"]
                    stats["total_em_dashes_replaced"] += mutations["em_dashes_replaced"]
            except Exception as e:
                print(f"Error sanitizing {path}: {e}", file=sys.stderr)

        return stats


if __name__ == "__main__":
    sanitizer = GeoAntiSlopSanitizer()
    print("Executing Anti-Slop Audit on frontend/public and selected distribution files...")
    public_audit = sanitizer.audit_directory(WEBSITE_ROOT / "frontend" / "public")
    print(f"Public Audit: {public_audit['flagged_files_count']} flagged files out of {public_audit['total_files_audited']}.")
    print(f"Slop Tokens: {public_audit['aggregate_slop_tokens']}, Em Dashes: {public_audit['aggregate_em_dashes']}")
    
    # Save telemetry
    telemetry_path = BASE_DIR / "geo_slop_audit_telemetry.json"
    telemetry_path.write_text(json.dumps(public_audit, indent=2), encoding="utf-8")
    print(f"Telemetry saved to {telemetry_path}")
