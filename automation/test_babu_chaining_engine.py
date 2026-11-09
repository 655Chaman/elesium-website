#!/usr/bin/env python3
"""
test_babu_chaining_engine.py

Automated Triple-Verification Suite for Weapon 4 (Module 09 / Babu Chakraborty):
Autonomous Spreadsheet Chaining & RosaeNLG Natural Language Engine.

Evaluates 6 Rigorous Quality & Emulation Gates:
- Gate 1: Mathematical Accuracy of All 12 Google Sheets Formulas (GS-01 to GS-12)
- Gate 2: RosaeNLG Context-Free Grammar Compilation (RN-01 to RN-04)
- Gate 3: Competitor Heading Tree & Information Gain Scoring Engine (>=8.0/10.0)
- Gate 4: SERP PAA Harvester & Structured 3-Bullet FAQ Generator (GS-11)
- Gate 5: Programmatic Keyword Seeder Schema Conformance (compact_keywords_queue.json)
- Gate 6: Scripted Quality Gatekeeper (Anti-Slop, Burstiness Sigma >= 8.0, Adjective Density <= 7.0%)
"""

import sys
import os
import re
from pathlib import Path

# Add automation dir to path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from babu_spreadsheet_chaining_engine import (
    GoogleSheetsFormulaEngine,
    RosaeNLGCompiler,
    CompetitorPaHarvestEngine,
    QualityGatekeeper,
    ProgrammaticKeywordSeeder
)

def fail(msg: str):
    print(f"\n❌ FAIL: {msg}", file=sys.stderr)
    sys.exit(1)

def log_pass(msg: str):
    print(f"  ✅ {msg}")

def test_gate_1_formula_emulation():
    print("\n--- Gate 1: Google Sheets Formulas (GS-01 to GS-12) Verification ---")
    engine = GoogleSheetsFormulaEngine

    # GS-01: Root Domain Extractor
    input_01 = "https://www.store.infidigit.com/products/running-shoes?color=blue&size=10"
    out_01 = engine.gs_01_root_domain_extractor(input_01)
    if out_01 != "store.infidigit.com":
        fail(f"GS-01 failed: got '{out_01}', expected 'store.infidigit.com'")
    log_pass(f"GS-01 Root Domain Extractor: '{out_01}'")

    # GS-02: Parameter Stripper
    input_02 = "https://example.com/shoes/leather-sneakers?utm_source=newsletter&utm_medium=email"
    out_02 = engine.gs_02_parameter_stripper(input_02)
    if out_02 != "https://example.com/shoes/leather-sneakers":
        fail(f"GS-02 failed: got '{out_02}', expected 'https://example.com/shoes/leather-sneakers'")
    log_pass(f"GS-02 Parameter Stripper: '{out_02}'")

    # GS-03: Category Slug Extractor
    input_03 = "https://example.com/collections/winter-outerwear/products/parka-jacket"
    out_03 = engine.gs_03_category_slug_extractor(input_03)
    if out_03 != "winter-outerwear":
        fail(f"GS-03 failed: got '{out_03}', expected 'winter-outerwear'")
    log_pass(f"GS-03 Category Slug Extractor: '{out_03}'")

    # GS-04: Hyphenated Slug Builder
    input_04 = "Men's Lightweight Trail-Running Shoes (2026 Edition)!"
    out_04 = engine.gs_04_hyphenated_slug_builder(input_04)
    if out_04 != "mens-lightweight-trail-running-shoes-2026-edition":
        fail(f"GS-04 failed: got '{out_04}', expected 'mens-lightweight-trail-running-shoes-2026-edition'")
    log_pass(f"GS-04 Hyphenated Slug Builder: '{out_04}'")

    # GS-05 & GS-06: Title Constructor & Length Validator
    t_out = engine.gs_05_programmatic_title_builder("Leather Formal Shoes", "Men Footwear", "Mochi")
    t_val = engine.gs_06_title_length_validator(t_out)
    if not t_val["is_valid"] or t_val["length"] > 60 or t_val["length"] < 30:
        fail(f"GS-05/06 failed: '{t_out}' invalid bounds: {t_val}")
    log_pass(f"GS-05/06 Title Tag & Validator: '{t_out}' ({t_val['status']})")

    # GS-07 & GS-08: Meta Description & Bounds Check
    m_out = engine.gs_07_meta_description_builder("running sneakers", "Footwear Hub")
    m_val = engine.gs_08_description_bounds_check(m_out)
    if not m_val["is_valid"] or m_val["length"] < 120 or m_val["length"] > 160:
        fail(f"GS-07/08 failed: '{m_out}' length {m_val['length']} not in [120, 160]")
    log_pass(f"GS-07/08 Meta Description & Bounds Check: {m_val['length']} chars ({m_val['status']})")

    # GS-09: Intent Classifier
    intent_tx = engine.gs_09_bulk_intent_classifier("where to buy industrial air compressor parts online")
    intent_co = engine.gs_09_bulk_intent_classifier("best enterprise multi agent platforms vs langgraph")
    intent_in = engine.gs_09_bulk_intent_classifier("how does pagedattention eliminate kv cache waste")
    if intent_tx != "Transactional" or intent_co != "Commercial" or intent_in != "Informational":
        fail(f"GS-09 intent failed: tx={intent_tx}, co={intent_co}, in={intent_in}")
    log_pass(f"GS-09 Bulk Intent Classifier: tx='{intent_tx}', co='{intent_co}', in='{intent_in}'")

    # GS-10: Entity Inferencer
    e_bfsi = engine.gs_10_sparse_entity_inferencer([], "sub-200ms ledger reconciliation agents for fintechs", "sector")
    e_health = engine.gs_10_sparse_entity_inferencer([], "hipaa compliant ambient clinical documentation", "sector")
    if "BFSI" not in e_bfsi or "Healthcare" not in e_health:
        fail(f"GS-10 inferencing failed: bfsi='{e_bfsi}', health='{e_health}'")
    log_pass(f"GS-10 Sparse Entity Inferencer: '{e_bfsi}' & '{e_health}'")

    # GS-11: Structured FAQ Generator
    faq_bullets = engine.gs_11_structured_faq_generator("What is the latency and throughput of your multi-agent architecture?")
    if len(faq_bullets) != 3:
        fail(f"GS-11 failed: expected 3 bullets, got {len(faq_bullets)}")
    for b in faq_bullets:
        word_count = len(b.split())
        if word_count > 25:
            fail(f"GS-11 bullet exceeds 25 words ({word_count} words): {b}")
    log_pass(f"GS-11 Structured FAQ Generator: 3 technical bullets (all <= 25 words)")

    # GS-12: Sentiment Scorer
    s_pos = engine.gs_12_sentiment_scorer("The boots arrived two days early and the leather stitching is flawless, though the sizing runs slightly narrow.")
    s_neg = engine.gs_12_sentiment_scorer("The pipeline suffered extreme latency, memory leakage, and frequent downtime failure.")
    if s_pos <= 0.0 or s_neg >= 0.0:
        fail(f"GS-12 sentiment failed: pos={s_pos}, neg={s_neg}")
    log_pass(f"GS-12 Sentiment Scorer: positive={s_pos}, negative={s_neg}")

def test_gate_2_rosae_nlg_grammars():
    print("\n--- Gate 2: RosaeNLG Context-Free Grammars (RN-01 to RN-04) ---")
    compiler = RosaeNLGCompiler

    # RN-01: Synonym Block Diversity
    syn1 = compiler.rn_01_synonym_block("Enterprise Telemetry Node", seed=101)
    syn2 = compiler.rn_01_synonym_block("Enterprise Telemetry Node", seed=202)
    syn3 = compiler.rn_01_synonym_block("Enterprise Telemetry Node", seed=303)
    variations = {syn1, syn2, syn3}
    if len(variations) < 2:
        fail("RN-01 failed: synonym variations lack diversity")
    log_pass(f"RN-01 Multi-Variate Synonym Blocks: {len(variations)} unique variations generated")

    # RN-02 & RN-03: Attribute Branching
    specs_fast = compiler.rn_02_attribute_branching_specs({"latency_ms": 18, "quantization": "FP8", "jurisdiction": "us"})
    specs_batch = compiler.rn_02_attribute_branching_specs({"latency_ms": 180, "quantization": "INT4", "jurisdiction": "uk"})
    if "sub-18ms" not in specs_fast or "HIPAA" not in specs_fast or "FP8" not in specs_fast:
        fail(f"RN-02/03 failed on fast specs: {specs_fast}")
    if "sub-180ms" not in specs_batch or "UK GDPR" not in specs_batch or "INT4" not in specs_batch:
        fail(f"RN-02/03 failed on batch specs: {specs_batch}")
    log_pass("RN-02/03 Attribute Branching Grammar: verified across latency, precision, and jurisdiction")

    # RN-04: Inventory-Aware Link Routing
    anchor_live = compiler.rn_04_stock_link_routing({"status": "COMPLETED", "slug": "sap-rfc-agent", "keyword": "SAP RFC Agent"})
    anchor_staging = compiler.rn_04_stock_link_routing({"status": "STAGING", "category_slug": "erp", "hub_category": "ERP Automation"})
    if "/solutions/sap-rfc-agent/" not in anchor_live:
        fail(f"RN-04 failed on live routing: {anchor_live}")
    if "/solutions/category/erp/" not in anchor_staging:
        fail(f"RN-04 failed on staging routing: {anchor_staging}")
    log_pass("RN-04 Dynamic Link Routing: PageRank directed to live endpoints with parent hub fallback")

def test_gate_3_competitor_harvester():
    print("\n--- Gate 3: Competitor Heading Tree & Information Gain Scorer ---")
    harvester = CompetitorPaHarvestEngine

    res = harvester.harvest_competitor_url("https://nimapinfotech.com/services/ai-automation-developers")
    if res.clean_domain != "nimapinfotech.com":
        fail(f"Domain mismatch: got {res.clean_domain}")
    if len(res.h2_headings) < 3 or len(res.h3_headings) < 2 or len(res.faq_questions) < 2:
        fail(f"Competitor heading tree extraction incomplete: {res}")
    if res.information_gain_score < 8.0:
        fail(f"Information gain score {res.information_gain_score} below 8.0 threshold")
    log_pass(f"Competitor Harvester: H1, {len(res.h2_headings)} H2s, {len(res.h3_headings)} H3s, {len(res.faq_questions)} FAQs")
    log_pass(f"Information Gain Score: {res.information_gain_score}/10.0 with {len(res.recommended_injections)} proprietary injections")

def test_gate_4_serp_paa_harvester():
    print("\n--- Gate 4: SERP PAA Question Extraction & GS-11 Answers ---")
    harvester = CompetitorPaHarvestEngine

    paa_items = harvester.harvest_serp_paa_questions("autonomous dispatch software for freight carriers")
    if len(paa_items) < 3:
        fail(f"Insufficient PAA questions harvested: {len(paa_items)}")
    for item in paa_items:
        if not item["question"] or len(item["bullets"]) != 3 or not item["answer_text"]:
            fail(f"Invalid PAA record: {item}")
    log_pass(f"SERP PAA Harvester: {len(paa_items)} questions formatted with 3-bullet GS-11 answers")

def test_gate_5_keyword_seeding_schema():
    print("\n--- Gate 5: Programmatic Keyword Seeding Pipeline ---")
    seeder = ProgrammaticKeywordSeeder

    batch = seeder.batch_expand_seeds("langgraph multi agent state machine", count=3, start_id=90001)
    if len(batch) != 3:
        fail(f"Keyword seeding batch size mismatch: expected 3, got {len(batch)}")
    
    required_keys = {"id", "keyword", "slug", "key_benefit", "category", "hub_category", "target_persona", "intent", "search_volume_tier", "moz_target_score", "status", "primary_cta", "metadata_check"}
    
    for rec in batch:
        missing = required_keys - set(rec.keys())
        if missing:
            fail(f"Seeded keyword missing required schema keys: {missing}")
        meta = rec["metadata_check"]
        if "OPTIMAL" not in meta["title_status"]:
            fail(f"Seeded title failed optimal length bounds: {meta['title']} ({meta['title_status']})")
        if "PERFECT" not in meta["meta_status"]:
            fail(f"Seeded meta description failed bounds check: {meta['meta_description']} ({meta['meta_status']})")

    log_pass(f"Keyword Seeding Pipeline: {len(batch)} records conforming 100% to compact_keywords_queue.json schema")

def test_gate_6_quality_gatekeeper():
    print("\n--- Gate 6: Scripted Quality Gatekeeper (SOP-06 Phase 7) ---")
    gatekeeper = QualityGatekeeper

    # Test 1: Slop detection
    slop_text = "Let us delve into this bustling realm and unlock the potential of our game-changer AI solution."
    audit_slop = gatekeeper.audit_document(slop_text)
    if audit_slop["passed"]:
        fail("Quality gate failed: slop words were not rejected")
    if len(audit_slop["slop_terms_detected"]) < 3:
        fail(f"Quality gate missed expected slop words: {audit_slop['slop_terms_detected']}")
    log_pass(f"Quality Gatekeeper Anti-Slop: successfully rejected {len(audit_slop['slop_terms_detected'])} banned AI clichés")

    # Test 2: Clean, bursty text with low adjective density
    clean_bursty_text = (
        "Elesium engineers sovereign enterprise AI automation architectures deployed exclusively inside client VPC boundaries across dedicated private subnets. "
        "We move fast. "
        "Our LangGraph state machines leverage vLLM PagedAttention and FP8 quantization kernels to process high-throughput token streams at sub-20ms latency. "
        "Quality counts. "
        "We deliver contractually verified 3x to 5x ROI in 90 calendar days backed by zero-retention safe harbors under India's Digital Personal Data Protection Act 2023. "
        "Speed matters."
    )
    audit_clean = gatekeeper.audit_document(clean_bursty_text)
    if not audit_clean["passed"]:
        fail(f"Quality gate rejected clean bursty text: {audit_clean['violations']}")
    if audit_clean["burstiness_sigma"] < 8.0:
        fail(f"Burstiness sigma {audit_clean['burstiness_sigma']} fell below 8.0")
    if audit_clean["adjective_density_pct"] > 7.0:
        fail(f"Adjective density {audit_clean['adjective_density_pct']}% exceeded 7.0%")

    log_pass(f"Quality Gatekeeper Burstiness & Density: sigma={audit_clean['burstiness_sigma']} (>=8.0), adj_density={audit_clean['adjective_density_pct']}% (<=7.0%)")

def main():
    print("=" * 70)
    print("  BABU CHAKRABORTY SPREADSHEET CHAINING & ROSAENLG VERIFIER  ")
    print("=" * 70)

    test_gate_1_formula_emulation()
    test_gate_2_rosae_nlg_grammars()
    test_gate_3_competitor_harvester()
    test_gate_4_serp_paa_harvester()
    test_gate_5_keyword_seeding_schema()
    test_gate_6_quality_gatekeeper()

    print("\n" + "=" * 70)
    print("  ALL 6 SPREADSHEET CHAINING & ROSAENLG GATES PASSED (100% AIRTIGHT)  ")
    print("=" * 70)

if __name__ == "__main__":
    main()
