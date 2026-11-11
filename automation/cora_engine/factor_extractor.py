"""
=============================================================================
TED KUBAITIS CORA SERP CORRELATION ENGINE - FACTOR EXTRACTOR
=============================================================================
Classification: DOM, Semantic & Schema Algorithmic Factor Extraction
Methodology: Ted Kubaitis (Cora 500+ Algorithmic Factor Measurement Engine)
Remediated: Word-boundary regex token matching, decomposition of non-content
            elements (<script>, <style>, <noscript>, <svg>), and safe
            handling of top-level JSON-LD arrays and nested @graph objects.
=============================================================================
"""

import re
import json
from bs4 import BeautifulSoup
from typing import Dict, Any, List, Set, Tuple

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

COMMON_STOP_WORDS: Set[str] = {
    "a", "an", "the", "and", "or", "but", "in", "on", "at", "to",
    "for", "of", "with", "by", "from", "up", "about", "into", "over",
    "after", "is", "are", "was", "were", "be", "been", "being", "it",
    "its", "as", "if", "that", "this", "these", "those", "ai",
}


def normalize_keyword_tokens(target_keyword: str) -> Tuple[str, List[str]]:
    """
    Normalizes keyword into lowercase full phrase and individual meaningful tokens.
    Excludes single-character or generic stop words from token list unless
    the keyword itself consists only of stop words.
    """
    kw_lower = target_keyword.lower().strip()
    raw_tokens = re.findall(r"\b[a-z0-9_-]+\b", kw_lower)

    # Filter out common stop words for isolated token matching
    meaningful_tokens = [t for t in raw_tokens if len(t) > 1 and t not in COMMON_STOP_WORDS]
    if not meaningful_tokens and raw_tokens:
        meaningful_tokens = raw_tokens

    return kw_lower, meaningful_tokens


def match_keyword_in_text(text: str, kw_phrase: str, kw_tokens: List[str]) -> bool:
    """
    Checks if keyword phrase or meaningful tokens match in text using word boundaries.
    Prevents false positive substring matches (e.g. 'in' matching 'banking' or 'ai' matching 'email').
    """
    if not text:
        return False
    text_lower = text.lower()

    # 1. Full phrase match with word boundary
    if kw_phrase and re.search(rf"\b{re.escape(kw_phrase)}\b", text_lower):
        return True

    # 2. Meaningful token match with word boundary
    for token in kw_tokens:
        if re.search(rf"\b{re.escape(token)}\b", text_lower):
            return True

    return False


def extract_json_ld_entities(raw_json: Any) -> List[Dict[str, Any]]:
    """
    Recursively extracts all Schema.org entity dictionaries from arbitrary JSON-LD structures.
    Supports top-level dict, top-level array/list, and @graph arrays without raising AttributeError.
    """
    entities: List[Dict[str, Any]] = []
    if isinstance(raw_json, list):
        for item in raw_json:
            entities.extend(extract_json_ld_entities(item))
    elif isinstance(raw_json, dict):
        if "@graph" in raw_json and isinstance(raw_json["@graph"], list):
            for item in raw_json["@graph"]:
                entities.extend(extract_json_ld_entities(item))
        else:
            entities.append(raw_json)
    return entities


def extract_algorithmic_factors(
    html_content: str,
    target_keyword: str,
) -> Dict[str, float]:
    """
    Measures 20 core algorithmic on-page ranking factors from an HTML document.
    Returns a dictionary of factor_name -> float value.
    """
    soup = BeautifulSoup(html_content, "html.parser")
    kw_phrase, kw_tokens = normalize_keyword_tokens(target_keyword)

    factors: Dict[str, float] = {}

    # 1. Content Volume & Lexical Diversity (decompose non-content tags first)
    content_soup = BeautifulSoup(html_content, "html.parser")
    for tag in content_soup(["script", "style", "noscript", "svg", "template"]):
        tag.decompose()

    visible_text = content_soup.get_text(separator=" ")
    words = re.findall(r"\b[a-zA-Z0-9_-]+\b", visible_text)
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
    factors["exact_kw_in_title"] = 1.0 if match_keyword_in_text(title_text, kw_phrase, kw_tokens) else 0.0

    # Meta Description
    meta_desc = soup.find("meta", attrs={"name": re.compile(r"^description$", re.I)})
    meta_text = meta_desc.get("content", "").lower() if meta_desc else ""
    factors["exact_kw_in_meta_desc"] = 1.0 if match_keyword_in_text(meta_text, kw_phrase, kw_tokens) else 0.0

    # H1
    h1_tags = soup.find_all("h1")
    factors["h1_count"] = float(len(h1_tags))
    h1_kw_matches = sum(1 for h in h1_tags if match_keyword_in_text(h.get_text(), kw_phrase, kw_tokens))
    factors["exact_kw_in_h1"] = 1.0 if h1_kw_matches > 0 else 0.0

    # H2
    h2_tags = soup.find_all("h2")
    factors["h2_count"] = float(len(h2_tags))
    h2_kw_matches = sum(1 for h in h2_tags if match_keyword_in_text(h.get_text(), kw_phrase, kw_tokens))
    factors["exact_kw_in_h2"] = float(h2_kw_matches)

    # H3
    h3_tags = soup.find_all("h3")
    factors["h3_count"] = float(len(h3_tags))
    h3_kw_matches = sum(1 for h in h3_tags if match_keyword_in_text(h.get_text(), kw_phrase, kw_tokens))
    factors["exact_kw_in_h3"] = float(h3_kw_matches)

    # Bold / Strong
    strong_tags = soup.find_all(["b", "strong"])
    strong_kw_matches = sum(1 for s in strong_tags if match_keyword_in_text(s.get_text(), kw_phrase, kw_tokens))
    factors["exact_kw_in_bold"] = float(strong_kw_matches)

    # Anchor Text
    a_tags = soup.find_all("a")
    a_kw_matches = sum(1 for a in a_tags if match_keyword_in_text(a.get_text(), kw_phrase, kw_tokens))
    factors["exact_kw_in_anchors"] = float(a_kw_matches)

    # Image Alt Text
    img_tags = soup.find_all("img")
    img_kw_matches = sum(1 for img in img_tags if match_keyword_in_text(img.get("alt", ""), kw_phrase, kw_tokens))
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

    # 5. Schema & Structured Microdata (with safe top-level array handling)
    schema_scripts = soup.find_all("script", attrs={"type": re.compile(r"application/ld\+json", re.I)})
    factors["schema_blocks_count"] = float(len(schema_scripts))

    entities_count = 0
    has_faq = 0.0
    has_dataset = 0.0
    has_service = 0.0

    for sc in schema_scripts:
        raw_text = sc.string or sc.get_text() or ""
        if not raw_text.strip():
            continue
        try:
            parsed_data = json.loads(raw_text)
            extracted_entities = extract_json_ld_entities(parsed_data)
            entities_count += len(extracted_entities)

            for item in extracted_entities:
                if not isinstance(item, dict):
                    continue
                t = str(item.get("@type", ""))
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
