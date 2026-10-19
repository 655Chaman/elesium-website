#!/usr/bin/env python3
"""
verify_aeo_geo_compliance.py — AEO & GEO Verification Suite for Elesium Content Factory

Enforces the Princeton/Georgia Tech GEO Research Standards (Aggarwal et al.)
and RAG Vector Retrieval Optimization Rules for all Elesium content.

Verification Gates:
1. Gate 1: Answer Capsule Integrity (Strictly 40-50 words immediately following question-intent H2s).
2. Gate 2: Statistical Density (Princeton +37.4% lift metric: minimum 3 quantified data points per 1,000 words).
3. Gate 3: Quotation & Citation Presence (Princeton +31.2% / +28.8% lift: expert quotes + standards/statutory citations).
4. Gate 4: Markdown Table Structural Integrity (Strict 2D pipe-table syntax with header delimiters).
5. Gate 5: Entity Co-Occurrence & Negative Blacklist (Wikidata QID grounding, zero AI-slop / banned tokens).
6. Gate 6: Schema Graph JSON-LD Conformance (@graph structure with explicit 'about' and 'mentions' Wikidata QIDs).
"""

import os
import sys
import json
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple

BASE_DIR = Path(__file__).resolve().parent.parent
RULES_PATH = BASE_DIR / "automation" / "entity_rules.json"

class GeoAeoComplianceVerifier:
    def __init__(self, rules_path: Path = RULES_PATH):
        self.rules_path = rules_path
        self.rules = self._load_rules()
        self.banned_regexes = [re.compile(p, re.IGNORECASE) for p in self.rules.get("negative_blacklist_patterns", [])]
        self.approved_entities = [e["name"].lower() for e in self.rules.get("approved_entities", [])]
        self.approved_qids = [e["wikidata_qid"] for e in self.rules.get("approved_entities", [])]

    def _load_rules(self) -> Dict[str, Any]:
        if not self.rules_path.exists():
            return {}
        with open(self.rules_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def verify_answer_capsule_word_count(self, capsule_text: str) -> Tuple[bool, int, str]:
        """
        Gate 1: Answer Capsule must be strictly between 40 and 50 words.
        """
        # Strip markdown bolding / formatting
        clean_text = re.sub(r'[*_`#]', '', capsule_text).strip()
        words = [w for w in re.split(r'\s+', clean_text) if w]
        count = len(words)
        passed = 40 <= count <= 50
        msg = f"Word count: {count} words. {'PASS' if passed else 'FAIL (Must be strictly 40-50 words)'}"
        return passed, count, msg

    def verify_statistical_density(self, content_text: str) -> Tuple[bool, int, float, str]:
        """
        Gate 2: Princeton GEO Benchmark (+37.4% Lift).
        Must contain quantitative data points: percentages, currency figures (₹/$/€),
        latencies (ms/s), multipliers (x), or integers/floats associated with business metrics.
        Target: >= 3 stats per 1,000 words.
        """
        words = [w for w in re.split(r'\s+', content_text) if w]
        total_words = len(words)
        if total_words == 0:
            return False, 0, 0.0, "Empty content"

        # Regex patterns for empirical statistics
        stat_patterns = [
            r'\b\d+(\.\d+)?%\b',                          # Percentages: 98%, 37.4%
            r'[\$₹€£]\s?\d+([,\.]\d+)?(\s?[kKmMbB]|(\s?(lakh|crore|Cr|L)))?', # Currency: ₹18.4L, $25,000, ₹1.2Cr
            r'\b\d+(\.\d+)?\s?(ms|seconds|sec|s|minutes|min|hours|hrs)\b',    # Latencies / Time
            r'\b\d+(\.\d+)?x\b',                          # Multipliers: 10x, 3.5x
            r'\b\d{1,3}(,\d{3})+(\.\d+)?\b'              # Formatted numbers: 14,000, 100,000
        ]
        
        found_stats = []
        for pat in stat_patterns:
            matches = re.findall(pat, content_text, re.IGNORECASE)
            for m in matches:
                if isinstance(m, tuple):
                    found_stats.append(m[0])
                else:
                    found_stats.append(m)

        stat_count = len(found_stats)
        density_per_1000 = (stat_count / total_words) * 1000
        passed = density_per_1000 >= 3.0
        msg = f"Found {stat_count} quantitative stats in {total_words} words ({density_per_1000:.2f} stats/1,000 words). {'PASS' if passed else 'FAIL (Minimum 3.0 stats/1,000 words required)'}"
        return passed, stat_count, density_per_1000, msg

    def verify_quotation_and_citation(self, content_text: str) -> Tuple[bool, bool, bool, str]:
        """
        Gate 3: Princeton GEO Benchmark (+31.2% Cite Sources, +28.8% Quotation Addition).
        Must include:
        1. Verbatim quote from a named expert or practitioner (using quotation marks).
        2. Official statutory framework, standard, or research citation (e.g. DPDP Act, ISO 27001, RBI, Aggarwal et al.).
        """
        has_quote = bool(re.search(r'["“][^"”]{20,300}["”]', content_text))
        
        standards_patterns = [
            r'DPDP\s*Act(\s*2023)?',
            r'ISO\s*(27001|42001)',
            r'RBI\s*(Master\s*Directions|Guidelines)?',
            r'Aggarwal\s*et\s*al\.',
            r'IEEE\s*\d+',
            r'SOC\s*2(\s*Type\s*II)?',
            r'NIST\s*AI\s*RMF',
            r'GDPR'
        ]
        has_citation = any(re.search(pat, content_text, re.IGNORECASE) for pat in standards_patterns)
        
        passed = has_quote and has_citation
        msg = f"Quotation present: {has_quote} | Standard/Authority citation present: {has_citation}. {'PASS' if passed else 'FAIL'}"
        return passed, has_quote, has_citation, msg

    def verify_markdown_table(self, content_text: str) -> Tuple[bool, int, str]:
        """
        Gate 4: Markdown Table Structural Integrity.
        Must contain valid pipe-delimited table:
        | Header 1 | Header 2 |
        | --- | --- |
        | Data 1 | Data 2 |
        """
        table_pattern = re.compile(
            r'(\|[^\n]+\|\n\|[\s\-:|]+\|\n(\|[^\n]+\|\n?)+)',
            re.MULTILINE
        )
        matches = table_pattern.findall(content_text)
        table_count = len(matches)
        passed = table_count >= 1
        msg = f"Found {table_count} valid Markdown pipe table(s). {'PASS' if passed else 'FAIL (Minimum 1 Markdown table required)'}"
        return passed, table_count, msg

    def verify_entity_cooccurrence_and_blacklist(self, content_text: str) -> Tuple[bool, List[str], Dict[str, int], str]:
        """
        Gate 5: Entity Whitelist Grounding & Zero Blacklist Violations.
        - Zero occurrences of banned tokens (zapier, make.com, delve, tapestry, etc.).
        - Minimum 3 approved entity mentions per post.
        """
        violations = []
        for regex in self.banned_regexes:
            hits = regex.findall(content_text)
            if hits:
                violations.extend(hits)

        text_lower = content_text.lower()
        entity_hits = {}
        for entity in self.approved_entities:
            c = text_lower.count(entity)
            if c > 0:
                entity_hits[entity] = c

        total_entity_mentions = sum(entity_hits.values())
        passed = (len(violations) == 0) and (total_entity_mentions >= 3)
        msg = (
            f"Blacklist Violations: {len(violations)} {violations if violations else ''} | "
            f"Approved Entity Hits: {total_entity_mentions} {entity_hits}. "
            f"{'PASS' if passed else 'FAIL'}"
        )
        return passed, violations, entity_hits, msg

    def verify_schema_graph(self, json_ld_str: str) -> Tuple[bool, List[str]]:
        """
        Gate 6: Schema Graph JSON-LD Conformance.
        Verifies:
        - Valid JSON
        - Contains @graph array
        - Contains TechArticle or Article
        - Contains 'about' with Wikidata sameAs
        - Contains 'mentions' with Wikidata sameAs
        - Contains FAQPage matching FAQ items
        """
        errors = []
        if not json_ld_str or not json_ld_str.strip():
            return False, ["Missing jsonLdSchema"]

        try:
            data = json.loads(json_ld_str)
        except Exception as e:
            return False, [f"Invalid JSON in schema: {e}"]

        if "@graph" not in data or not isinstance(data["@graph"], list):
            errors.append("Schema does not contain a top-level '@graph' array")
            return False, errors

        graph = data["@graph"]
        types = [node.get("@type") for node in graph if isinstance(node, dict)]

        # Check Article / TechArticle
        article_nodes = [n for n in graph if n.get("@type") in ["TechArticle", "Article", "BlogPosting"]]
        if not article_nodes:
            errors.append("Missing TechArticle/Article node in @graph")
        else:
            article = article_nodes[0]
            about = article.get("about")
            if not about or not isinstance(about, dict) or "sameAs" not in about:
                errors.append("TechArticle missing 'about' node with 'sameAs' Wikidata URI")
            elif "wikidata.org/wiki/Q" not in str(about.get("sameAs")):
                errors.append("TechArticle 'about.sameAs' does not point to a valid Wikidata QID URI")

            mentions = article.get("mentions")
            if not mentions or not isinstance(mentions, list) or len(mentions) < 1:
                errors.append("TechArticle missing 'mentions' array with Wikidata QIDs")
            else:
                has_valid_mention_qid = any("wikidata.org/wiki/Q" in str(m.get("sameAs", "")) for m in mentions if isinstance(m, dict))
                if not has_valid_mention_qid:
                    errors.append("No valid Wikidata QID found in 'mentions' array")

        # Check FAQPage
        faq_nodes = [n for n in graph if n.get("@type") == "FAQPage"]
        if not faq_nodes:
            errors.append("Missing FAQPage node in @graph")
        else:
            main_entity = faq_nodes[0].get("mainEntity", [])
            if not main_entity or len(main_entity) == 0:
                errors.append("FAQPage node contains no Question/Answer pairs in 'mainEntity'")

        passed = len(errors) == 0
        return passed, errors


def run_selftest():
    """Runs a self-test of the AEO/GEO Verification Suite with a perfect exemplar."""
    verifier = GeoAeoComplianceVerifier()
    
    exemplar_capsule = (
        "Deterministic multi-agent systems coordinate autonomous software agents using explicit state "
        "machines rather than probabilistic LLM loops, reducing enterprise execution failure rates by "
        "98.4%. Elesium deploys these architectures across private VPCs, cutting manual underwriting latency "
        "from 48 hours to 1.9 seconds for Indian enterprises."
    )
    
    exemplar_body = f"""
## What Is Deterministic Multi-Agent Orchestration? 2026 Enterprise Architecture

**{exemplar_capsule}**

In modern enterprise automation across India, particularly in Bangalore tech corridors, organizations are migrating from fragile scripts to deterministic state graphs. Under the DPDP Act 2023, data sovereignty mandates strict VPC isolation. 

According to Dr. Aris Thorne, Chief Systems Architect at Elesium: "Probabilistic agents fail silently in high-throughput production; deterministic graphs using LangGraph and PostgreSQL guarantee transactional state persistence across 100,000 concurrent execution nodes."

| Framework Tier | P99 Latency | Failure Rate | Enterprise Cost (India) |
| :--- | :--- | :--- | :--- |
| Fragile Legacy RPA / Toy Script | 14,200 ms | 24.8% | ₹5,00,000 / year |
| Native LangChain Script | 4,800 ms | 11.2% | ₹18,00,000 / year |
| Elesium Deterministic Triad | 190 ms | 0.02% | ₹35,00,000 / year |

Using FastAPI and PostgreSQL with pgvector, our enterprise AI automation pipelines deliver 10x throughput increases.
"""

    exemplar_schema = json.dumps({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "TechArticle",
                "@id": "https://elesium.online/signals/deterministic-agents#article",
                "headline": "What Is Deterministic Multi-Agent Orchestration? 2026 Enterprise Architecture",
                "about": {
                    "@type": "DefinedTerm",
                    "name": "Artificial Intelligence",
                    "sameAs": "https://www.wikidata.org/wiki/Q11660"
                },
                "mentions": [
                    {
                        "@type": "SoftwareApplication",
                        "name": "LangGraph",
                        "sameAs": "https://www.wikidata.org/wiki/Q125555000"
                    },
                    {
                        "@type": "SoftwareApplication",
                        "name": "FastAPI",
                        "sameAs": "https://www.wikidata.org/wiki/Q100348737"
                    }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://elesium.online/signals/deterministic-agents#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is deterministic multi-agent orchestration?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": exemplar_capsule
                        }
                    }
                ]
            }
        ]
    })

    print("==================================================================")
    print("   ELESIUM GEO & AEO VERIFICATION ASSERTIONS ENGINE SELF-TEST    ")
    print("==================================================================")
    
    # Test Gate 1
    p1, c1, m1 = verifier.verify_answer_capsule_word_count(exemplar_capsule)
    print(f"[Gate 1: Answer Capsule Word Count]: {m1}")
    assert p1, f"Gate 1 failed: {m1}"
    
    # Test Gate 2
    p2, c2, d2, m2 = verifier.verify_statistical_density(exemplar_body)
    print(f"[Gate 2: Statistical Density]: {m2}")
    assert p2, f"Gate 2 failed: {m2}"
    
    # Test Gate 3
    p3, q3, c3, m3 = verifier.verify_quotation_and_citation(exemplar_body)
    print(f"[Gate 3: Quotation & Standards Citation]: {m3}")
    assert p3, f"Gate 3 failed: {m3}"
    
    # Test Gate 4
    p4, t4, m4 = verifier.verify_markdown_table(exemplar_body)
    print(f"[Gate 4: Markdown Table Integrity]: {m4}")
    assert p4, f"Gate 4 failed: {m4}"
    
    # Test Gate 5
    p5, v5, h5, m5 = verifier.verify_entity_cooccurrence_and_blacklist(exemplar_body)
    print(f"[Gate 5: Entity Grounding & Blacklist]: {m5}")
    assert p5, f"Gate 5 failed: {m5}"
    
    # Test Gate 6
    p6, e6 = verifier.verify_schema_graph(exemplar_schema)
    print(f"[Gate 6: Schema Graph JSON-LD]: {'PASS' if p6 else f'FAIL: {e6}'}")
    assert p6, f"Gate 6 failed: {e6}"

    print("\n>>> ALL 6 AEO/GEO VERIFICATION GATES PASSED WITH 100% COMPLIANCE! <<<")


def audit_file(file_path: Path):
    verifier = GeoAeoComplianceVerifier()
    text = file_path.read_text(encoding="utf-8")
    print(f"Auditing file: {file_path}")
    
    # Check tables
    p_tab, c_tab, m_tab = verifier.verify_markdown_table(text)
    print(f"[Markdown Tables]: {m_tab}")
    
    # Check stats
    p_stat, c_stat, d_stat, m_stat = verifier.verify_statistical_density(text)
    print(f"[Statistical Density]: {m_stat}")
    
    # Check quotes and citations
    p_qc, has_q, has_c, m_qc = verifier.verify_quotation_and_citation(text)
    print(f"[Quotes & Citations]: {m_qc}")
    
    # Check blacklist & entities
    p_ent, violations, hits, m_ent = verifier.verify_entity_cooccurrence_and_blacklist(text)
    print(f"[Entities & Blacklist]: {m_ent}")
    
    # Check answer capsules under H2
    h2_sections = re.findall(r'(##\s+[^\n]+\n\n\*\*([^*]+)\*\*)', text)
    if h2_sections:
        print(f"[Answer Capsules Detected]: {len(h2_sections)}")
        for i, (full_match, cap) in enumerate(h2_sections, 1):
            p_cap, w_cnt, m_cap = verifier.verify_answer_capsule_word_count(cap)
            print(f"  Capsule {i} ({w_cnt} words): {'PASS' if p_cap else 'FAIL'}")
    else:
        print("[Answer Capsules Detected]: 0 (Warning: No bolded capsules detected directly under H2)")


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="AEO & GEO Compliance Verifier for Elesium")
    parser.add_argument("--file", type=str, help="Path to markdown file or article to audit")
    args = parser.parse_args()
    
    if args.file:
        audit_file(Path(args.file))
    else:
        run_selftest()
