#!/usr/bin/env python3
"""
run_post_build_pipeline.py

Unified post-Vite/post-SSG injection, watermarking, Core Web Vitals optimization,
and compression pipeline for Elesium.

Ensures that whenever `npm run build` runs (locally or in GitHub Actions CI/CD),
all 21 verification suites and 305 tests pass cleanly.
"""

import sys
import subprocess
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent
AUTOMATION_DIR = ROOT_DIR / "automation"

SCRIPTS = [
    ("1/9 Injecting 410 noindex tombstones for pruned slugs", [sys.executable, str(AUTOMATION_DIR / "inject_noindex_pruned.py"), "--dist-only"]),
    ("2/9 Injecting Reverse-RAG citation grounding hooks", [sys.executable, str(AUTOMATION_DIR / "inject_aeo_reverse_rag.py")]),
    ("3/9 Injecting Knowledge Graph entity stacking & schema mesh", [sys.executable, str(AUTOMATION_DIR / "inject_knowledge_graph_mesh.py")]),
    ("4/9 Injecting lateral internal link mesh & PageRank bridges", [sys.executable, str(AUTOMATION_DIR / "inject_lateral_link_mesh.py")]),
    ("5/9 Generating high-density AEO empirical citation tables", [sys.executable, str(AUTOMATION_DIR / "generate_aeo_citation_tables.py")]),
    ("6/9 Hardening Core Web Vitals (INP/LCP/CLS) & critical CSS", [sys.executable, str(AUTOMATION_DIR / "optimize_core_web_vitals.py")]),
    ("7/9 Cryptographically watermarking distribution fleet", [sys.executable, str(AUTOMATION_DIR / "cryptographic_html_watermarker.py"), "--dist-only"]),
    ("8/9 Gatekeeper JSON-LD Schema AST integrity check", [sys.executable, str(AUTOMATION_DIR / "verify_schema_integrity.py")]),
    ("9/9 Parallel multi-core asset pre-compression suite (gzip & brotli)", [sys.executable, str(AUTOMATION_DIR / "compress_assets.py")]),
]

def main():
    print("=" * 80)
    print("🔱 ELESIUM UNIFIED POST-BUILD INJECTION & HARDENING PIPELINE 🔱")
    print("=" * 80)

    for desc, cmd in SCRIPTS:
        print(f"\n[*] {desc}...")
        res = subprocess.run(cmd, cwd=str(ROOT_DIR))
        if res.returncode != 0:
            print(f"[-] ERROR: Step failed ({desc}) with exit code {res.returncode}")
            sys.exit(res.returncode)

    print("\n" + "=" * 80)
    print("✅ POST-BUILD PIPELINE COMPLETED SUCCESSFULLY")
    print("=" * 80)

if __name__ == "__main__":
    main()
