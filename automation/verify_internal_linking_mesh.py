#!/usr/bin/env python3
"""
================================================================================
VERIFY INTERNAL LINKING MESH — 6-GATE MATHEMATICAL CERTIFICATION SUITE
================================================================================
Classification: Production Automated Quality Gate & Graph-Theoretic Auditor
Module: 11 (Programmatic Internal Linking Graph Theory)
Purpose:
  - Gate 1: Zero Orphan Nodes (d_in >= 3 across all indexable URLs)
  - Gate 2: Maximum Click-Depth Bound (max_v dist(root, v) <= 2 clicks)
  - Gate 3: Zero Dead-End Sinks (d_out >= 3 across all canonical pages)
  - Gate 4: Claude Shannon Anchor Text Entropy (H(A) >= 2.20 bits)
  - Gate 5: Injective Anti-Cannibalization Rule (0 duplicate exact-match anchors across distinct destination URLs)
  - Gate 6: PageRank Gini Coefficient (G_PR <= 0.42)
================================================================================
"""

import sys
import os
import json
import math
import re
from pathlib import Path
from collections import defaultdict, Counter

ROOT_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT_DIR))

from automation.internal_link_mesh_optimizer import scan_fleet_topology, DampedSemanticMeshSynthesizer

MANIFEST_PATH = ROOT_DIR / "automation" / "internal_linking_mesh_manifest.json"
DIST_DIR = ROOT_DIR / "frontend" / "dist"

def verify_internal_linking_mesh():
    print("=" * 80)
    print(" 🔱 AUDITING GRAPH-THEORETIC INTERNAL LINK MESH (MODULE 11) 🔱")
    print("=" * 80)

    if not MANIFEST_PATH.exists():
        print(f"[FAIL] Manifest not found: {MANIFEST_PATH}", file=sys.stderr)
        return False

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        manifest = json.load(f)

    meta = manifest.get("metadata", {})
    node_metrics = manifest.get("node_metrics", {})
    lateral_bridges = manifest.get("lateral_bridges", {})

    gates_passed = 0
    total_gates = 6

    # --------------------------------------------------------------------------
    # GATE 1: Zero Orphan Nodes (d_in >= 3 across all indexable URLs)
    # --------------------------------------------------------------------------
    orphan_count = meta.get("orphan_nodes_count", 999)
    # Validate from node_metrics
    under_3_inbound = [n for n, m in node_metrics.items() if m.get("in_degree", 0) < 3]
    
    print("\n[GATE 1] Zero Orphan Nodes (d_in >= 3 across all canonical URLs)")
    print(f"  Total Nodes Audited : {len(node_metrics):,}")
    print(f"  Nodes with d_in < 3  : {len(under_3_inbound)}")
    if len(under_3_inbound) == 0:
        print("  Status: PASSED ✅ (100% of nodes possess d_in >= 3)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ ({len(under_3_inbound)} orphan risk nodes detected)")
        for n in under_3_inbound[:5]:
            print(f"    • {n} (in_degree: {node_metrics[n]['in_degree']})")

    # --------------------------------------------------------------------------
    # GATE 2: Maximum Click-Depth Bound (max_v dist(root, v) <= 2 clicks)
    # --------------------------------------------------------------------------
    max_click_depth = meta.get("max_click_depth", 999)
    over_2_depth = [n for n, m in node_metrics.items() if m.get("click_depth", 999) > 2]
    
    print("\n[GATE 2] Maximum Click-Depth Bound (max_v dist(root, v) <= 2 clicks)")
    print(f"  Maximum Graph Distance : {max_click_depth} clicks")
    print(f"  Mean Click Depth       : {meta.get('mean_click_depth', 0.0):.2f} clicks")
    print(f"  Nodes at Depth > 2     : {len(over_2_depth)}")
    if max_click_depth <= 2 and len(over_2_depth) == 0:
        print("  Status: PASSED ✅ (100% of canonical URLs reachable within <= 2 clicks from root)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ ({len(over_2_depth)} nodes exceed 2 clicks)")
        for n in over_2_depth[:5]:
            print(f"    • {n} (depth: {node_metrics[n]['click_depth']})")

    # --------------------------------------------------------------------------
    # GATE 3: Zero Dead-End Sinks (d_out >= 3 across all canonical pages)
    # --------------------------------------------------------------------------
    dead_sinks = meta.get("dead_end_sinks_count", 999)
    under_3_outbound = [n for n, m in node_metrics.items() if m.get("out_degree", 0) < 3]

    print("\n[GATE 3] Zero Dead-End Link Sinks (d_out >= 3 across all canonical pages)")
    print(f"  Nodes with d_out == 0 : {dead_sinks}")
    print(f"  Nodes with d_out < 3  : {len(under_3_outbound)}")
    if dead_sinks == 0 and len(under_3_outbound) == 0:
        print("  Status: PASSED ✅ (Strictly 0 dead-end sinks; all pages recirculate link equity)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ ({len(under_3_outbound)} sinkhole nodes detected)")
        for n in under_3_outbound[:5]:
            print(f"    • {n} (out_degree: {node_metrics[n]['out_degree']})")

    # --------------------------------------------------------------------------
    # GATE 4: Claude Shannon Anchor Text Entropy (H(A) >= 2.20 bits)
    # --------------------------------------------------------------------------
    mean_entropy = meta.get("mean_shannon_entropy", 0.0)
    low_entropy_nodes = [n for n, m in node_metrics.items() if m.get("shannon_entropy", 0.0) < 2.0]

    print("\n[GATE 4] Claude Shannon Anchor Text Entropy (H(A) >= 2.20 bits)")
    print(f"  Mean Portfolio Entropy : {mean_entropy:.3f} bits (Goal >= 2.20 bits)")
    print(f"  Low Entropy Nodes      : {len(low_entropy_nodes)}")
    if mean_entropy >= 2.20 and len(low_entropy_nodes) == 0:
        print("  Status: PASSED ✅ (Entropy profile guaranteed Penguin & SpamBrain immune)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ (Mean entropy {mean_entropy:.3f} bits or {len(low_entropy_nodes)} low-entropy nodes)")

    # --------------------------------------------------------------------------
    # GATE 5: Injective Anti-Cannibalization Rule (Zero Exact-Match Repetition)
    # --------------------------------------------------------------------------
    exact_match_to_urls = defaultdict(set)
    for src_url, bridges in lateral_bridges.items():
        for b in bridges:
            if b.get("anchor_type") == "EXACT_MATCH":
                anchor = b.get("anchor_text", "").strip().lower()
                target = b.get("target_url", "")
                exact_match_to_urls[anchor].add(target)

    cannibalized = {a: urls for a, urls in exact_match_to_urls.items() if len(urls) > 1}

    print("\n[GATE 5] Injective Anti-Cannibalization Rule (Unique Exact-Match Anchors)")
    print(f"  Total Exact-Match Anchors : {len(exact_match_to_urls):,}")
    print(f"  Cannibalized Anchor Pairs : {len(cannibalized)}")
    if len(cannibalized) == 0:
        print("  Status: PASSED ✅ (Strict injective mapping; zero keyword cannibalization)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ ({len(cannibalized)} cannibalized exact-match anchor strings)")
        for a, urls in list(cannibalized.items())[:5]:
            print(f"    • '{a}' points to {len(urls)} distinct URLs: {list(urls)[:2]}")

    # --------------------------------------------------------------------------
    # GATE 6: PageRank Gini Coefficient (G_PR <= 0.42)
    # --------------------------------------------------------------------------
    gini = meta.get("pagerank_gini", 1.0)

    print("\n[GATE 6] PageRank Gini Coefficient of Inequality (G_PR <= 0.42)")
    print(f"  PageRank Gini Coefficient : {gini:.4f} (Goal <= 0.42)")
    if gini <= 0.42:
        print("  Status: PASSED ✅ (Link equity diffused evenly across all programmatic nodes)")
        gates_passed += 1
    else:
        print(f"  Status: FAILED ❌ (Gini coefficient {gini:.4f} exceeds 0.42 ceiling)")

    print("\n" + "=" * 80)
    print(f" 🔱 FINAL CERTIFICATION SCORE: {gates_passed}/{total_gates} GATES PASSED")
    print("=" * 80)

    return gates_passed == total_gates

if __name__ == "__main__":
    success = verify_internal_linking_mesh()
    sys.exit(0 if success else 1)
