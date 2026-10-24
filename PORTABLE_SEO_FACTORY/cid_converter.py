#!/usr/bin/env python3
"""
===============================================================================
Google Maps Permanent Decimal CID & Knowledge Graph Node Converter
===============================================================================
Mathematical derivation and bidirectional conversion between Google Maps 
hexadecimal coordinates/hashes and 64-bit signed/unsigned decimal Customer IDs (CID).

Extracts and validates:
  1. Hexadecimal CID from Google Maps data parameter (!1s0x...:0xHEX_CID)
  2. ludocid parameter from Google Maps HTML source
  3. Direct decimal CID query parameter (?cid=DECIMAL_CID)
  4. Generates canonical Knowledge Graph URLs and Place Review Direct Modals
  5. Outputs ready-to-inject Schema.org JSON-LD nodes

Author: Elesium Growth Engineering & Entity Architecture Labs
License: MIT / Apache 2.0 (Portable SEO Factory Tooling)
===============================================================================
"""

import sys
import re
import argparse
import json
import urllib.request
import urllib.error
from typing import Optional, Dict, Any, Tuple


def hex_to_decimal_cid(hex_str: str) -> int:
    """
    Converts a hexadecimal Google Maps CID (e.g. '0xe9af6b490f23a81a' or 'e9af6b490f23a81a')
    into its 64-bit unsigned integer decimal representation.
    """
    clean_hex = hex_str.strip().lower()
    if clean_hex.startswith('0x'):
        clean_hex = clean_hex[2:]
    
    # Validate hexadecimal characters
    if not re.match(r'^[0-9a-f]+$', clean_hex):
        raise ValueError(f"Invalid hexadecimal string: '{hex_str}'")
        
    return int(clean_hex, 16)


def decimal_to_hex_cid(decimal_val: int) -> str:
    """
    Converts a 64-bit decimal Customer ID into its canonical Google Maps
    hexadecimal coordinate representation with leading '0x'.
    """
    if decimal_val < 0:
        raise ValueError("Google Maps Customer ID must be a non-negative 64-bit integer.")
    return f"0x{decimal_val:016x}"


def extract_from_maps_url(url: str) -> Dict[str, Any]:
    """
    Parses a Google Maps URL and extracts the hexadecimal coordinates,
    decimal CID, and canonical links.
    """
    result: Dict[str, Any] = {
        "original_url": url,
        "centroid_hex": None,
        "cid_hex": None,
        "decimal_cid": None,
        "permanent_cid_url": None,
        "review_url": None,
        "extraction_method": None
    }

    # Pattern 1: Direct cid parameter (?cid=16839201948572019482)
    cid_param = re.search(r'[?&]cid=(\d{15,22})', url)
    if cid_param:
        dec = int(cid_param.group(1))
        result["decimal_cid"] = dec
        result["cid_hex"] = decimal_to_hex_cid(dec)
        result["permanent_cid_url"] = f"https://maps.google.com/?cid={dec}"
        result["extraction_method"] = "direct_cid_query_parameter"
        return result

    # Pattern 2: Hex coordinate pair in URL data parameter (!1s0xHEX1:0xHEX2)
    # Example: !1s0x3bbba9b123456789:0xe9af6b490f23a81a
    hex_pair = re.search(r'0x([0-9a-fA-F]+):(0x[0-9a-fA-F]+)', url)
    if hex_pair:
        centroid_hex = "0x" + hex_pair.group(1).lower()
        cid_hex = hex_pair.group(2).lower()
        dec = hex_to_decimal_cid(cid_hex)
        result["centroid_hex"] = centroid_hex
        result["cid_hex"] = cid_hex
        result["decimal_cid"] = dec
        result["permanent_cid_url"] = f"https://maps.google.com/?cid={dec}"
        result["extraction_method"] = "url_data_hex_coordinate_pair"
        return result

    # Pattern 3: ludocid in page source or redirect parameter
    ludo_match = re.search(r'ludocid(?:\\u003d|=)(\d{15,22})', url)
    if ludo_match:
        dec = int(ludo_match.group(1))
        result["decimal_cid"] = dec
        result["cid_hex"] = decimal_to_hex_cid(dec)
        result["permanent_cid_url"] = f"https://maps.google.com/?cid={dec}"
        result["extraction_method"] = "url_ludocid_parameter"
        return result

    # Pattern 4: Place ID in URL
    place_match = re.search(r'place_id:([A-Za-z0-9_-]{20,})', url)
    if place_match:
        place_id = place_match.group(1)
        result["place_id"] = place_id
        result["review_url"] = f"https://search.google.com/local/writereview?placeid={place_id}"

    return result


def fetch_and_scrape_cid(url: str, timeout: int = 10) -> Dict[str, Any]:
    """
    Follows redirects and fetches the HTML source of a Google Maps short link or place page
    to discover the true underlying ludocid.
    """
    headers = {
        'User-Agent': (
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
            'AppleWebKit/537.36 (KHTML, like Gecko) '
            'Chrome/124.0.0.0 Safari/537.36'
        ),
        'Accept-Language': 'en-US,en;q=0.9',
    }
    req = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            final_url = response.geturl()
            html = response.read().decode('utf-8', errors='ignore')
    except urllib.error.URLError as e:
        raise ConnectionError(f"Failed to fetch Google Maps URL '{url}': {e}")

    # First check final redirected URL
    result = extract_from_maps_url(final_url)
    if result["decimal_cid"] is not None:
        result["final_url"] = final_url
        return result

    # If not in final URL, search HTML source for ludocid
    ludocid_match = re.search(r'ludocid(?:\\u003d|=)(\d{15,22})', html)
    if ludocid_match:
        dec = int(ludocid_match.group(1))
        result["decimal_cid"] = dec
        result["cid_hex"] = decimal_to_hex_cid(dec)
        result["permanent_cid_url"] = f"https://maps.google.com/?cid={dec}"
        result["final_url"] = final_url
        result["extraction_method"] = "html_source_ludocid_regex"
        return result

    # Check for hex pair in HTML body
    hex_pair = re.search(r'0x[0-9a-fA-F]{12,18}:(0x[0-9a-fA-F]{12,18})', html)
    if hex_pair:
        cid_hex = hex_pair.group(1).lower()
        dec = hex_to_decimal_cid(cid_hex)
        result["cid_hex"] = cid_hex
        result["decimal_cid"] = dec
        result["permanent_cid_url"] = f"https://maps.google.com/?cid={dec}"
        result["final_url"] = final_url
        result["extraction_method"] = "html_source_hex_pair_regex"
        return result

    # Check for Place ID in HTML body
    place_match = re.search(r'["\'](ChIJ[A-Za-z0-9_-]{20,})["\']', html)
    if place_match:
        result["place_id"] = place_match.group(1)
        result["review_url"] = f"https://search.google.com/local/writereview?placeid={result['place_id']}"

    result["final_url"] = final_url
    return result


def generate_schema_snippet(business_name: str, site_url: str, decimal_cid: int, place_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Generates a production-grade Schema.org ProfessionalService node
    binding the business entity to its permanent Google Knowledge Graph CID.
    """
    cid_url = f"https://maps.google.com/?cid={decimal_cid}"
    snippet: Dict[str, Any] = {
        "@context": "https://schema.org",
        "@type": ["ProfessionalService", "LocalBusiness"],
        "@id": f"{site_url.rstrip('/')}/#localbusiness-hq",
        "name": business_name,
        "url": site_url,
        "hasMap": cid_url,
        "sameAs": [
            cid_url
        ]
    }
    if place_id:
        snippet["sameAs"].append(f"https://search.google.com/local/writereview?placeid={place_id}")
    return snippet


def run_tests() -> bool:
    """
    Built-in test suite verifying mathematical conversion across known Google Maps entities.
    """
    test_cases = [
        # (hex_cid, expected_decimal)
        ("0xe9af6b490f23a81a", 16838795493292353562),
        ("0x3bbba9b123456789", 4304220447148697481),
        ("0x123456789abcdef0", 1311768467463790320),
        ("0x0000000000000001", 1),
        ("0xffffffffffffffff", 18446744073709551615),
    ]

    print("Running mathematical verification tests...")
    for hex_val, expected_dec in test_cases:
        actual_dec = hex_to_decimal_cid(hex_val)
        actual_hex = decimal_to_hex_cid(actual_dec)
        assert actual_dec == expected_dec, f"Dec mismatch: {actual_dec} != {expected_dec}"
        assert actual_hex.lower() == hex_val.lower(), f"Hex mismatch: {actual_hex} != {hex_val}"
        print(f"  [PASS] {hex_val} <---> {expected_dec}")

    # URL parser test
    sample_url = "https://www.google.com/maps/place/Elesium/@13.9299,75.5681,15z/data=!4m6!3m5!1s0x3bbba9b123456789:0xe9af6b490f23a81a!8m2!3d13.9299!4d75.5681"
    parsed = extract_from_maps_url(sample_url)
    assert parsed["decimal_cid"] == 16838795493292353562
    assert parsed["permanent_cid_url"] == "https://maps.google.com/?cid=16838795493292353562"
    print("  [PASS] Google Maps URL extraction verified.")
    print("All mathematical and extraction tests passed successfully.")
    return True


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Google Maps Permanent Decimal CID & Knowledge Graph Node Converter"
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--hex", type=str, help="Hexadecimal CID (e.g. 0xe9af6b490f23a81a)")
    group.add_argument("--dec", type=int, help="Decimal 64-bit CID (e.g. 16839201948572019482)")
    group.add_argument("--url", type=str, help="Google Maps URL or Shortlink to parse")
    group.add_argument("--test", action="store_true", help="Run internal validation test suite")

    parser.add_argument("--scrape", action="store_true", help="Perform live HTTP scrape if URL cannot be parsed statically")
    parser.add_argument("--schema", action="store_true", help="Output ready-to-use Schema.org JSON-LD snippet")
    parser.add_argument("--name", type=str, default="Enterprise AI Agency", help="Business name for schema generation")
    parser.add_argument("--domain", type=str, default="https://elesium.online", help="Site domain for schema generation")

    args = parser.parse_args()

    if args.test:
        run_tests()
        sys.exit(0)

    decimal_cid: Optional[int] = None
    hex_cid: Optional[str] = None
    place_id: Optional[str] = None

    if args.hex:
        hex_cid = args.hex if args.hex.startswith("0x") else "0x" + args.hex
        decimal_cid = hex_to_decimal_cid(hex_cid)
    elif args.dec:
        decimal_cid = args.dec
        hex_cid = decimal_to_hex_cid(decimal_cid)
    elif args.url:
        parsed = extract_from_maps_url(args.url)
        if parsed["decimal_cid"] is None and args.scrape:
            print(f"Static parse yielded no CID. Initiating live HTTP scrape for {args.url}...", file=sys.stderr)
            parsed = fetch_and_scrape_cid(args.url)
        
        decimal_cid = parsed.get("decimal_cid")
        hex_cid = parsed.get("cid_hex")
        place_id = parsed.get("place_id")

        if decimal_cid is None:
            print("ERROR: Could not resolve decimal CID from provided URL.", file=sys.stderr)
            if not args.scrape:
                print("Tip: Re-run with '--scrape' to follow redirects and inspect HTML source.", file=sys.stderr)
            sys.exit(1)

    permanent_url = f"https://maps.google.com/?cid={decimal_cid}"
    output = {
        "status": "success",
        "decimal_cid": str(decimal_cid),
        "hex_cid": hex_cid,
        "permanent_cid_url": permanent_url,
        "direct_review_modal": f"https://search.google.com/local/writereview?placeid={place_id}" if place_id else "Requires Place ID"
    }

    if args.schema and decimal_cid:
        output["schema_json_ld"] = generate_schema_snippet(
            business_name=args.name,
            site_url=args.domain,
            decimal_cid=decimal_cid,
            place_id=place_id
        )

    print(json.dumps(output, indent=2))


if __name__ == "__main__":
    main()
