"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE — FACTOR EXTRACTOR
=============================================================================
Classification: DOM, Semantic & Schema Algorithmic Factor Extraction
Methodology: Ted Kubaitis (Cora 500+ Algorithmic Factor Measurement Engine)
=============================================================================
"""

import re
import json
from bs4 import BeautifulSoup
from typing import Dict, Any, List

STATUTORY_DOMAINS = [
    "rbi.org.in",
    "meity.gov.in",
    "prsindia.org",
    "sebi.gov.in",
    "gstn.org.in",
    "w3.org",
    "schema.org",
    "ietf.org",
    "iso.org",
    "nist.gov",
]


def extract_algorithmic_factors(
    html_content: str,
    target_keyword: str,
) -> Dict[str, float]:
    """
    Measures 20 core algorithmic on-page ranking factors from an HTML document.
    Returns a dictionary of factor_name -> float value.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    kw_lower = target_keyword.lower().strip()
    kw_tokens = set(re.findall(r"\b[a-z0-9]+\b", kw_lower))

    factors: Dict[str, float] = {}

    # 1. Content Volume & Lexical Diversity
    text_content = soup.get_text()
    words = re.findall(r"\b[a-zA-Z0-9_-]+\b", text_content)
    total_words = len(words)
    unique_words = len(set(w.lower() for w in words))
    lexical_div = (unique_words / total_words) if total_words > 0 else 0.0

    factors["body_word_count"] = float(total_words)
    factors["unique_word_count"] = float(unique_words)
    factors["lexical_diversity"] = round(lexical_div, 4)

    # 2. Keywords in Structural Tags
    # Title
    title_tag = soup.find("title")
    title_text = title_tag.get_text().lower() if title_tag else ""
    factors["exact_kw_in_title"] = 1.0 if kw_lower in title_text else 0.0

    # Meta Description
    meta_desc = soup.find("meta", attrs={"name": "description"})
    meta_text = meta_desc.get("content", "").lower() if meta_desc else ""
    factors["exact_kw_in_meta_desc"] = 1.0 if kw_lower in meta_text else 0.0

    # H1
    h1_tags = soup.find_all("h1")
    h1_text = " ".join(h.get_text().lower() for h in h1_tags)
    factors["exact_kw_in_h1"] = 1.0 if kw_lower in h1_text else 0.0
    factors["h1_count"] = float(len(h1_tags))

    # H2
    h2_tags = soup.find_all("h2")
    factors["h2_count"] = float(len(h2_tags))
    h2_kw_matches = sum(1 for h in h2_tags if any(t in h.get_text().lower() for t in kw_tokens))
    factors["exact_kw_in_h2"] = float(h2_kw_matches)

    # H3
    h3_tags = soup.find_all("h3")
    factors["h3_count"] = float(len(h3_tags))
    h3_kw_matches = sum(1 for h in h3_tags if any(t in h.get_text().lower() for t in kw_tokens))
    factors["exact_kw_in_h3"] = float(h3_kw_matches)

    # Bold / Strong
    strong_tags = soup.find_all(["b", "strong"])
    strong_kw_matches = sum(1 for s in strong_tags if any(t in s.get_text().lower() for t in kw_tokens))
    factors["exact_kw_in_bold"] = float(strong_kw_matches)

    # Anchor Text
    a_tags = soup.find_all("a")
    a_kw_matches = sum(1 for a in a_tags if any(t in a.get_text().lower() for t in kw_tokens))
    factors["exact_kw_in_anchors"] = float(a_kw_matches)

    # Image Alt Text
    img_tags = soup.find_all("img")
    img_kw_matches = sum(1 for img in img_tags if any(t in img.get("alt", "").lower() for t in kw_tokens))
    factors["exact_kw_in_img_alt"] = float(img_kw_matches)

    # 3. DOM Structural Complexity
    all_elements = soup.find_all()
    factors["dom_element_count"] = float(len(all_elements))

    tables = soup.find_all("table")
    factors["table_count"] = float(len(tables))
    total_tr = sum(len(t.find_all("tr")) for t in tables)
    factors["table_row_count"] = float(total_tr)

    lists = soup.find_all(["ul", "ol"])
    factors["list_count"] = float(len(lists))
    list_items = soup.find_all("li")
    factors["list_item_count"] = float(len(list_items))

    # 4. Outbound & Statutory Citations
    outbound_count = 0
    statutory_count = 0
    internal_count = 0
    for a in a_tags:
        href = a.get("href", "")
        if href.startswith("http"):
            outbound_count += 1
            if any(dom in href.lower() for dom in STATUTORY_DOMAINS):
                statutory_count += 1
        elif href.startswith("/") or href.startswith("#"):
            internal_count += 1

    factors["outbound_links_count"] = float(outbound_count)
    factors["outbound_statutory_citations"] = float(statutory_count)
    factors["internal_links_count"] = float(internal_count)

    # 5. Schema & Structured Microdata
    schema_scripts = soup.find_all("script", attrs={"type": re.compile(r"application/ld\+json", re.I)})
    factors["schema_blocks_count"] = float(len(schema_scripts))

    entities_count = 0
    has_faq = 0.0
    has_dataset = 0.0
    has_service = 0.0

    for sc in schema_scripts:
        try:
            data = json.loads(sc.string or "")
            if "@graph" in data and isinstance(data["@graph"], list):
                entities_count += len(data["@graph"])
                for item in data["@graph"]:
                    t = str(item.get("@type", ""))
                    if "FAQPage" in t:
                        has_faq = 1.0
                    if "Dataset" in t:
                        has_dataset = 1.0
                    if "Service" in t or "Product" in t:
                        has_service = 1.0
            else:
                entities_count += 1
                t = str(data.get("@type", ""))
                if "FAQPage" in t:
                    has_faq = 1.0
                if "Dataset" in t:
                    has_dataset = 1.0
                if "Service" in t or "Product" in t:
                    has_service = 1.0
        except Exception:
            pass

    factors["schema_entities_count"] = float(entities_count)
    factors["has_faq_page"] = has_faq
    factors["has_dataset"] = has_dataset
    factors["has_service"] = has_service

    return factors
