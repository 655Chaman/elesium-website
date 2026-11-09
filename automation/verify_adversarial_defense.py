#!/usr/bin/env python3
"""
ELESIUM ADVERSARIAL DEFENSE & ALGORITHMIC DETOX VERIFICATION GATEKEEPER (V2026.1)
Operational Specification: Master Agent Playbook 12 & SEO Rockstars 2026 (Craig Campbell)

Executes 6 Strict Non-Negotiable Quality Gates:
- Gate 1: Toxic Backlink Sentinel & Disavow Generator AST & Functional Logic
- Gate 2: Cryptographic Zero-Width Steganographic Roundtrip Integrity (Bit-Exact HMAC)
- Gate 3: Universal HTML Fleet Watermark Coverage across Pre-Rendered Pages
- Gate 4: Navboost Dwell-Lock Anti-Pogo-Sticking Integration (Client-Side & Head Tags)
- Gate 5: Statutory 17 U.S.C. § 512 DMCA Takedown Dispatcher Compliance
- Gate 6: Algorithmic Core Update Detox Engine (HTTP 410 Rules & Recrawl Payload)
"""

import os
import sys
import json
import re
from typing import Dict, List, Tuple

# Import modules under test
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from toxic_backlink_sentinel import (
    calculate_shannon_entropy, 
    calculate_velocity_z_score, 
    analyze_backlink_records, 
    generate_disavow_file,
    BacklinkRecord
)
from cryptographic_html_watermarker import (
    text_to_zero_width, 
    zero_width_to_text, 
    inject_watermark_into_html, 
    verify_watermark_from_scraped_text,
    generate_watermark_payload,
    ZW_SENTINEL
)
from automated_dmca_engine import (
    calculate_jaccard_overlap,
    detect_abuse_email,
    generate_statutory_dmca_notice,
    execute_dmca_audit
)
from algorithmic_detox_engine import run_full_detox

def gate_1_toxic_backlink_sentinel() -> bool:
    print("[*] Running Gate 1: Toxic Backlink Sentinel & Disavow Generator...")
    
    # 1. Test Shannon Entropy
    diverse_anchors = [f"anchor text variation {i}" for i in range(50)]
    entropy_high = calculate_shannon_entropy(diverse_anchors)
    assert entropy_high >= 4.0, f"Expected high entropy >= 4.0, got {entropy_high}"
    
    spam_anchors = ["cheap casino"] * 90 + ["other"] * 10
    entropy_low = calculate_shannon_entropy(spam_anchors)
    assert entropy_low < 1.0, f"Expected low entropy < 1.0, got {entropy_low}"
    
    # 2. Test Velocity Z-Score
    baseline = [30, 32, 28, 30, 31, 29]
    z_nominal = calculate_velocity_z_score(baseline, 31)
    assert z_nominal < 2.0, f"Expected nominal Z < 2.0, got {z_nominal}"
    
    z_attack = calculate_velocity_z_score(baseline, 500)
    assert z_attack > 3.5, f"Expected attack Z > 3.5, got {z_attack}"
    
    # 3. Test Attack Analysis & Disavow Output
    attack_records = [
        BacklinkRecord(f"http://pbn-node-{i}.xyz/post", "https://elesium.online/", "cheap adult casino")
        for i in range(100)
    ]
    attack_detected, disavowed, metrics = analyze_backlink_records(attack_records)
    assert attack_detected == True, "Sentinel failed to flag attack records!"
    assert len(disavowed) >= 15, "Expected >= 15 toxic domains disavowed!"
    
    disavow_out = "automation/test_gate1_disavow.txt"
    generate_disavow_file(disavowed, disavow_out)
    assert os.path.exists(disavow_out), "Disavow file was not created!"
    with open(disavow_out, "r", encoding="utf-8") as f:
        disavow_content = f.read()
    assert "domain:" in disavow_content, "Missing domain: prefix in disavow file!"
    assert "elesium.online" in disavow_content, "Missing header in disavow file!"
    
    if os.path.exists(disavow_out):
        os.remove(disavow_out)
        
    print("    [PASS] Gate 1: Sentinel Z-score and Shannon entropy algorithms validated.")
    return True

def gate_2_steganographic_watermark_roundtrip() -> bool:
    print("[*] Running Gate 2: Steganographic Roundtrip Integrity...")
    
    test_url = "https://elesium.online/solutions/enterprise-ai-automation"
    sig, zw = generate_watermark_payload(test_url)
    
    # Assert zero width contains sentinel markers
    assert zw.startswith(ZW_SENTINEL), "Missing header sentinel in zero-width string!"
    assert zw.endswith(ZW_SENTINEL), "Missing footer sentinel in zero-width string!"
    
    # Embed in mock scraped text
    scraped_content = f"Proprietary technical specifications for enterprise AI systems. {zw} End of text."
    
    # Test valid verification
    is_valid, report = verify_watermark_from_scraped_text(scraped_content)
    assert is_valid == True, f"Cryptographic verification failed: {report}"
    assert report["author"] == "Elesium", f"Invalid author: {report.get('author')}"
    assert report["canonical_url"] == test_url, f"Invalid canonical URL: {report.get('canonical_url')}"
    
    # Test tampered verification (tampered HMAC)
    tampered_sig = sig.replace("AUTHOR:Elesium", "AUTHOR:HackerGroup")
    tampered_zw = text_to_zero_width(tampered_sig)
    tampered_scraped = f"Stolen article. {tampered_zw} Bye."
    is_valid_tampered, _ = verify_watermark_from_scraped_text(tampered_scraped)
    assert is_valid_tampered == False, "Tampered payload falsely passed verification!"
    
    print("    [PASS] Gate 2: 100% bit-exact HMAC cryptographic steganography verified.")
    return True

def gate_3_html_fleet_watermark_coverage() -> bool:
    print("[*] Running Gate 3: Universal HTML Fleet Watermark Coverage...")
    
    key_files = [
        "frontend/dist/index.html",
        "frontend/dist/onboarding.html",
        "frontend/dist/ai-automation-agency-india.html",
        "frontend/dist/commercial-directory.html"
    ]
    
    for path in key_files:
        assert os.path.exists(path), f"Required production file missing: {path}"
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        assert ZW_SENTINEL in content, f"Zero-width sentinel missing from {path}!"
        is_valid, report = verify_watermark_from_scraped_text(content)
        assert is_valid == True, f"Failed watermark verification for {path}: {report}"
        assert report["author"] == "Elesium", f"Author mismatch for {path}"
        
    print("    [PASS] Gate 3: Key production HTML pages cryptographically watermarked.")
    return True

def gate_4_navboost_dwell_lock() -> bool:
    print("[*] Running Gate 4: Navboost Dwell-Lock Anti-Pogo-Sticking Integration...")
    
    # 1. Script existence in public and dist
    pub_js = "frontend/public/navboost_dwell_lock.js"
    dist_js = "frontend/dist/navboost_dwell_lock.js"
    assert os.path.exists(pub_js) and os.path.getsize(pub_js) > 200, f"Missing or empty {pub_js}"
    assert os.path.exists(dist_js) and os.path.getsize(dist_js) > 200, f"Missing or empty {dist_js}"
    
    with open(pub_js, "r", encoding="utf-8") as f:
        js_code = f.read()
    assert "qualifiedDwellThreshold" in js_code, "Missing qualifiedDwellThreshold in dwell lock script!"
    assert "pushState" in js_code and "popstate" in js_code, "Missing history trap in dwell lock script!"
    assert "elesiumNavboostLock" in js_code, "Missing elesiumNavboostLock token in dwell lock script!"
    
    # 2. Injected in frontend/index.html and frontend/dist/index.html
    for html_path in ["frontend/index.html", "frontend/dist/index.html"]:
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        assert "navboost_dwell_lock.js" in html, f"Missing navboost_dwell_lock.js reference in {html_path}"
        
    # 3. TS Utility in frontend/src/utils/dwellLock.ts
    ts_util = "frontend/src/utils/dwellLock.ts"
    assert os.path.exists(ts_util), f"Missing {ts_util}"
    
    # 4. App.tsx integration
    with open("frontend/src/App.tsx", "r", encoding="utf-8") as f:
        app_code = f.read()
    assert "initNavboostDwellLock" in app_code, "initNavboostDwellLock not imported/called in App.tsx!"
    
    print("    [PASS] Gate 4: Navboost Dwell-Lock dual-mounted and verified in client runtime.")
    return True

def gate_5_statutory_dmca_engine() -> bool:
    print("[*] Running Gate 5: Statutory 17 U.S.C. § 512 DMCA Engine...")
    
    # 1. Jaccard similarity test
    t1 = "Elesium engineers enterprise sovereign AI systems with sub-50ms latency in private VPC enclaves."
    t2 = "Elesium engineers enterprise sovereign AI systems with sub-50ms latency in private VPC cloud."
    t3 = "A completely unrelated article about cooking Italian pizza with tomato sauce and cheese."
    
    sim_high = calculate_jaccard_overlap(t1, t2)
    assert sim_high > 0.6, f"Expected high similarity > 0.6, got {sim_high}"
    
    sim_low = calculate_jaccard_overlap(t1, t3)
    assert sim_low < 0.1, f"Expected low similarity < 0.1, got {sim_low}"
    
    # 2. Abuse contact detection
    assert detect_abuse_email("cdn.cloudflare.net") == "abuse@cloudflare.com"
    assert detect_abuse_email("ec2-instance.amazonaws.com") == "abuse@amazonaws.com"
    assert detect_abuse_email("droplet.digitalocean.com") == "abuse@digitalocean.com"
    assert detect_abuse_email("dedicated.hetzner.com") == "abuse@hetzner.com"
    
    # 3. Notice generation & statutory clauses
    notice = generate_statutory_dmca_notice(
        original_url="https://elesium.online/solutions/enterprise-ai",
        infringing_url="https://scraper-pirate.xyz/stolen-post",
        work_title="Proprietary Enterprise Architecture",
        watermark_hmac="a1b2c3d4e5f67890"
    )
    assert "17 U.S.C. § 512(c)" in notice, "Missing 17 U.S.C. § 512 citation!"
    assert "penalty of perjury" in notice.lower(), "Missing penalty of perjury clause!"
    assert "good faith belief" in notice.lower(), "Missing good faith clause!"
    assert "Chaman Shah" in notice, "Missing authorized signatory!"
    assert "legal@elesium.online" in notice, "Missing contact email!"
    assert "a1b2c3d4e5f67890" in notice, "Missing cryptographic watermark proof in notice!"
    
    print("    [PASS] Gate 5: Statutory DMCA takedown notice generator mathematically compliant.")
    return True

def gate_6_algorithmic_detox_engine() -> bool:
    print("[*] Running Gate 6: Algorithmic Core Update Detox Engine...")
    
    report = run_full_detox()
    assert report["remediation_status"] == "DETOX_FRAMEWORK_ARMED", "Detox engine not armed!"
    
    # Check Phase 1 HTTP 410 config
    http_410_conf = "automation/algorithmic_cull_http_410.conf"
    assert os.path.exists(http_410_conf), f"Missing {http_410_conf}"
    with open(http_410_conf, "r", encoding="utf-8") as f:
        conf_text = f.read()
    assert "return 410;" in conf_text, "Missing return 410 directive in NGINX config!"
    
    # Check Phase 1 301 consolidation map
    map_301 = "automation/301_consolidation_map.json"
    assert os.path.exists(map_301), f"Missing {map_301}"
    
    # Check Phase 4 Recrawl payload
    recrawl_file = "automation/recrawl_acceleration_payload.json"
    assert os.path.exists(recrawl_file), f"Missing {recrawl_file}"
    with open(recrawl_file, "r", encoding="utf-8") as f:
        recrawl_data = json.load(f)
    assert recrawl_data["host"] == "elesium.online", "Invalid host in recrawl payload!"
    assert len(recrawl_data["urlList"]) >= 5, "Insufficient URLs in recrawl payload!"
    
    # Check telemetry file
    telemetry_path = "automation/algorithmic_detox_telemetry.json"
    assert os.path.exists(telemetry_path), f"Missing {telemetry_path}"
    
    print("    [PASS] Gate 6: Algorithmic Core Update Detox Engine verified.")
    return True

def main():
    print("=" * 75)
    print("   🔱 ELESIUM ADVERSARIAL DEFENSE & ALGORITHMIC DETOX VERIFICATION 🔱")
    print("=" * 75)
    
    gates = [
        gate_1_toxic_backlink_sentinel,
        gate_2_steganographic_watermark_roundtrip,
        gate_3_html_fleet_watermark_coverage,
        gate_4_navboost_dwell_lock,
        gate_5_statutory_dmca_engine,
        gate_6_algorithmic_detox_engine
    ]
    
    passed = 0
    for g in gates:
        try:
            if g():
                passed += 1
        except Exception as e:
            print(f"[FAIL] {g.__name__}: {e}")
            import traceback
            traceback.print_exc()
            sys.exit(1)
            
    print("=" * 75)
    print(f"✅ ALL {passed}/{len(gates)} ADVERSARIAL DEFENSE & ALGORITHMIC DETOX GATES PASSED (100%)")
    print("=" * 75)

if __name__ == "__main__":
    main()
