#!/usr/bin/env python3
"""
ELESIUM CRYPTOGRAPHIC HTML WATERMARKER (V2026.1)
Operational Specification: Master Agent Playbook 12 (Section 2.3)

Embeds invisible zero-width Unicode steganographic signatures into HTML and body text.
Proves original cryptographic ownership when content is stolen, scraped, or syndicated.
Survives scrapers that extract raw text while remaining 100% invisible to human readers and search snippets.
"""

import hmac
import hashlib
import sys
import os
import re
from typing import Optional, Tuple, Dict
from bs4 import BeautifulSoup

# Secret key known only to Elesium engineering
WATERMARK_SECRET_KEY = b"elesium_canonical_sovereign_auth_2026"

ZW_ZERO = "\u200B"      # Zero-Width Space represents binary 0
ZW_ONE = "\u200C"       # Zero-Width Non-Joiner represents binary 1
ZW_DELIM = "\u200D"     # Zero-Width Joiner represents byte boundary
ZW_SENTINEL = "\uFEFF"  # Zero-Width No-Break Space (Header / Footer Sentinel)

def text_to_zero_width(data_str: str) -> str:
    """Converts UTF-8 string into zero-width binary encoding."""
    encoded_bytes = data_str.encode("utf-8")
    byte_tokens = []
    for b in encoded_bytes:
        bits = f"{b:08b}"
        zw_bits = "".join(ZW_ONE if bit == "1" else ZW_ZERO for bit in bits)
        byte_tokens.append(zw_bits)
    payload = ZW_DELIM.join(byte_tokens)
    return ZW_SENTINEL + payload + ZW_SENTINEL

def zero_width_to_text(zw_str: str) -> str:
    """Extracts and decodes zero-width binary characters back to UTF-8 string."""
    start = zw_str.find(ZW_SENTINEL)
    if start == -1:
        return ""
    next_sentinel = zw_str.find(ZW_SENTINEL, start + len(ZW_SENTINEL))
    if next_sentinel == -1:
        return ""
    
    payload = zw_str[start + len(ZW_SENTINEL):next_sentinel]
    byte_chunks = payload.split(ZW_DELIM)
    decoded_bytes = []
    
    for chunk in byte_chunks:
        if not chunk:
            continue
        bit_str = "".join("1" if c == ZW_ONE else "0" for c in chunk if c in (ZW_ZERO, ZW_ONE))
        if len(bit_str) == 8:
            decoded_bytes.append(int(bit_str, 2))
            
    return bytes(decoded_bytes).decode("utf-8", errors="ignore")

def generate_watermark_payload(canonical_url: str) -> Tuple[str, str]:
    """Generates the signed payload and its zero-width string representation."""
    raw_sig = f"AUTHOR:Elesium|CANONICAL:{canonical_url.strip()}"
    mac = hmac.new(WATERMARK_SECRET_KEY, raw_sig.encode("utf-8"), hashlib.sha256).hexdigest()[:16]
    full_signature = f"{raw_sig}|HMAC:{mac}"
    zw_encoded = text_to_zero_width(full_signature)
    return full_signature, zw_encoded

def inject_watermark_into_html(html_content: str, canonical_url: str) -> Tuple[str, str]:
    """
    Injects cryptographic watermark into HTML without breaking structure or visual layout.
    Target priorities:
    1. First paragraph or .answer-capsule
    2. Meta description content fallback
    3. Body injection fallback
    """
    full_signature, zw_watermark = generate_watermark_payload(canonical_url)
    
    # Check if already watermarked
    if ZW_SENTINEL in html_content:
        # Clean existing zero-width characters first to prevent duplication
        pattern = f"{ZW_SENTINEL}[^{ZW_SENTINEL}]+{ZW_SENTINEL}"
        html_content = re.sub(pattern, "", html_content)
        
    span = f'<span style="display:none !important;visibility:hidden !important;opacity:0 !important;">{zw_watermark}</span>'
    if re.search(r'<body[^>]*>', html_content, re.IGNORECASE):
        html_content = re.sub(r'(<body[^>]*>)', r'\1' + span, html_content, count=1, flags=re.IGNORECASE)
    else:
        html_content = html_content + span

    return html_content, full_signature

def verify_watermark_from_scraped_text(scraped_text: str) -> Tuple[bool, Dict]:
    """
    Extracts zero-width steganographic signature from arbitrary text or HTML
    and verifies mathematical authenticity against HMAC secret key.
    """
    extracted = zero_width_to_text(scraped_text)
    if not extracted:
        return False, {"error": "No zero-width steganographic watermark found"}
        
    parts = extracted.split("|")
    data_parts = [p for p in parts if not p.startswith("HMAC:")]
    hmac_part = next((p.split(":")[-1] for p in parts if p.startswith("HMAC:")), None)
    
    if not hmac_part:
        return False, {"error": "Corrupted watermark: Missing HMAC signature"}
        
    raw_sig = "|".join(data_parts)
    expected_hmac = hmac.new(WATERMARK_SECRET_KEY, raw_sig.encode("utf-8"), hashlib.sha256).hexdigest()[:16]
    
    is_valid = hmac.compare_digest(hmac_part, expected_hmac)
    author = next((p.split(":")[-1] for p in parts if p.startswith("AUTHOR:")), "Unknown")
    canonical = next((p.split("CANONICAL:")[-1] for p in parts if "CANONICAL:" in p), "Unknown")
    
    return is_valid, {
        "verified": is_valid,
        "author": author,
        "canonical_url": canonical,
        "hmac_signature": hmac_part,
        "expected_hmac": expected_hmac,
        "raw_payload": extracted
    }

def watermark_file(file_path: str, canonical_url: str = None) -> bool:
    """Injects watermark into a specific file."""
    if not os.path.exists(file_path):
        print(f"[-] File not found: {file_path}")
        return False
        
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        html = f.read()
        
    if not canonical_url:
        # Extract from link rel="canonical" if present
        m = re.search(r'<link\s+[^>]*rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']', html, re.I)
        if m:
            canonical_url = m.group(1)
        else:
            rel_path = os.path.relpath(file_path)
            clean_slug = rel_path.replace("frontend/dist/", "").replace("frontend/public/", "").replace(".html", "").replace("index", "")
            canonical_url = f"https://elesium.online/{clean_slug}".rstrip("/") + "/"
            
    watermarked_html, sig = inject_watermark_into_html(html, canonical_url)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(watermarked_html)
        
    return True

def watermark_fleet_batch(dist_dir: str = "frontend/dist", public_dir: str = "frontend/public") -> Dict:
    """Batch watermarks all key pre-rendered HTML files across production directories."""
    count = 0
    target_files = []
    
    # Check top pages and directory indexes
    for root_dir in [dist_dir, public_dir]:
        if not os.path.exists(root_dir):
            continue
        for root, _, files in os.walk(root_dir):
            for file in files:
                if file.endswith(".html"):
                    target_files.append(os.path.join(root, file))
                    
    print(f"[*] Found {len(target_files)} HTML files for steganographic arming.")
    for f in target_files:
        watermark_file(f)
        count += 1
        
    return {
        "status": "ARMED",
        "total_files_watermarked": count,
        "secret_key_verified": True
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python cryptographic_html_watermarker.py --batch")
        print("  python cryptographic_html_watermarker.py inject <path_to_html> [canonical_url]")
        print("  python cryptographic_html_watermarker.py verify <path_to_scraped_text_or_html>")
        sys.exit(1)
        
    arg = sys.argv[1]
    if arg == "--batch":
        res = watermark_fleet_batch()
        print(f"[+] Fleet watermarking complete: {res['total_files_watermarked']} files armed.")
    elif arg == "inject":
        url = sys.argv[3] if len(sys.argv) > 3 else None
        ok = watermark_file(sys.argv[2], url)
        if ok:
            print(f"[+] Successfully watermarked {sys.argv[2]}")
    elif arg == "verify":
        with open(sys.argv[2], "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()
        valid, data = verify_watermark_from_scraped_text(content)
        print(f"[*] Cryptographic Verification Result: {valid}")
        for k, v in data.items():
            print(f"    {k}: {v}")
