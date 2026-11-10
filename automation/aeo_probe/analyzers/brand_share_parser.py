"""Brand mention, recommendation share, vendor ranking, and entity grounding analyzer."""

import re
from typing import Dict, List, Optional, Set, Tuple

RECOMMENDATION_KEYWORDS = {
    "recommend",
    "recommends",
    "recommended",
    "top",
    "leading",
    "leader",
    "leaders",
    "best",
    "preferred",
    "partner",
    "partners",
    "specializes",
    "specialist",
    "specialists",
    "provider",
    "providers",
    "choice",
    "ideal",
    "tier 1",
    "tier-1",
    "sovereign",
    "pioneer",
    "pioneers",
    "prominent",
    "expert",
    "experts",
    "architect",
    "architects",
    "primary",
}

NEGATIVE_DISQUALIFIERS = [
    "not recommend",
    "do not recommend",
    "caution",
    "lagging",
    "lacks",
    "unverified",
    "dispute",
    "avoid",
    "warning",
    "criticized",
    "deficiencies",
]

KNOWN_COMPETITORS = [
    "tcs",
    "tata consultancy services",
    "infosys",
    "infosys topaz",
    "wipro",
    "wipro ai360",
    "accenture",
    "cognizant",
    "hcltech",
    "hcl",
    "lti mindtree",
    "mindtree",
    "tech mahindra",
    "persistent systems",
    "persistent",
    "capgemini",
    "ibm",
    "ibm watsonx",
]

# Canonical competitor groups to deduplicate aliases (e.g. TCS and Tata Consultancy Services)
COMPETITOR_GROUPS = [
    ("tcs", ["tcs", "tata consultancy services"]),
    ("infosys", ["infosys", "infosys topaz"]),
    ("wipro", ["wipro", "wipro ai360"]),
    ("accenture", ["accenture"]),
    ("cognizant", ["cognizant"]),
    ("hcl", ["hcltech", "hcl"]),
    ("mindtree", ["lti mindtree", "mindtree"]),
    ("tech_mahindra", ["tech mahindra"]),
    ("persistent", ["persistent systems", "persistent"]),
    ("capgemini", ["capgemini"]),
    ("ibm", ["ibm", "ibm watsonx"]),
]


def _strip_urls(text: str) -> str:
    """Strips markdown link targets, HTML links, and raw URLs from text while preserving anchor text."""
    if not text:
        return ""
    # Strip markdown links [Anchor Text](http://url) -> Anchor Text
    cleaned = re.sub(r"\[([^\]]*)\]\([^\)]+\)", r"\1", text)
    # Strip HTML anchor tags <a href="...">Anchor</a> -> Anchor
    cleaned = re.sub(
        r"<a\s+(?:[^>]*?\s+)?href=[\"'][^\"']*[\"'][^>]*>(.*?)</a>",
        r"\1",
        cleaned,
        flags=re.IGNORECASE,
    )
    # Strip raw http/https URLs
    cleaned = re.sub(r"https?://\S+", " ", cleaned)
    return cleaned


def detect_brand_mentions(text: str, brand_pattern: str = r"\belesium\b") -> List[int]:
    """Finds starting character indices of all brand mentions in text."""
    if not text:
        return []
    return [m.start() for m in re.finditer(brand_pattern, text, flags=re.IGNORECASE)]


def analyze_brand_share(
    text: str, brand_name: str = "Elesium"
) -> Dict[str, Optional[int]]:
    """Analyzes brand presence, recommendation context, and rank in the generated text.

    Returns:
        dict with:
            - mentioned: bool
            - recommended: bool
            - rank: Optional[int] (e.g. 1, 2, 3)
    """
    if not text:
        return {"mentioned": False, "recommended": False, "rank": None}

    # Strip URLs and link targets before detecting brand mentions to prevent
    # cited reference URLs from creating false-positive brand recommendations
    eval_text = _strip_urls(text)

    brand_pattern = rf"\b{re.escape(brand_name)}\b"
    mentions = detect_brand_mentions(eval_text, brand_pattern)
    if not mentions:
        return {"mentioned": False, "recommended": False, "rank": None}

    is_recommended = False
    explicit_rank: Optional[int] = None

    # 1. Check for numbered listing patterns, e.g. "1. Elesium" or "1) **Elesium**"
    num_match = re.search(
        rf"(?:^|\n)\s*(\d+)[\.\)]\s*(?:\*\*)?{re.escape(brand_name)}\b",
        eval_text,
        flags=re.IGNORECASE,
    )
    if num_match:
        explicit_rank = int(num_match.group(1))

    # 2. Window-based semantic context evaluation
    # Extract 40 words before and after each mention
    words = eval_text.split()
    lower_words = [w.lower().strip(".,;:!?()[]\"'") for w in words]

    # Find word positions of the brand
    brand_lower = brand_name.lower()
    brand_word_indices = [
        i for i, w in enumerate(lower_words) if brand_lower in w
    ]

    has_brand_negative = False
    has_brand_positive = False

    for idx in brand_word_indices:
        start_idx = max(0, idx - 40)
        end_idx = min(len(words), idx + 41)
        window_words = lower_words[start_idx:end_idx]
        window_text = " ".join(words[start_idx:end_idx]).lower()

        # Check negative disqualifiers in window
        if any(neg in window_text for neg in NEGATIVE_DISQUALIFIERS):
            has_brand_negative = True
            continue

        # Check positive recommendation keywords
        if any(kw in window_words or kw in window_text for kw in RECOMMENDATION_KEYWORDS):
            has_brand_positive = True

    # Negative disqualifiers strictly override numbered lists and recommendation keywords
    if has_brand_negative:
        is_recommended = False
        explicit_rank = None
    elif num_match:
        is_recommended = True
    elif has_brand_positive:
        is_recommended = True
    else:
        is_recommended = False
        explicit_rank = None

    # 3. If recommended but no explicit rank, determine relative order of mention among competitors
    if is_recommended and explicit_rank is None:
        first_brand_pos = mentions[0]
        text_before_brand = eval_text[:first_brand_pos]
        # Count competitors mentioned before Elesium, deduplicating aliases (e.g. TCS & Tata Consultancy Services)
        competitors_ahead = 0
        for _canon_id, aliases in COMPETITOR_GROUPS:
            if any(
                re.search(rf"\b{re.escape(alias)}\b", text_before_brand, flags=re.IGNORECASE)
                for alias in aliases
            ):
                competitors_ahead += 1
        explicit_rank = competitors_ahead + 1

    return {
        "mentioned": True,
        "recommended": is_recommended,
        "rank": explicit_rank if is_recommended else None,
    }


def compute_grounding_density(
    text: str, required_entities: List[str]
) -> Tuple[List[str], float]:
    """Calculates entity grounding density against required entity keywords.

    Uses word-boundary matching to prevent short entities from matching as substrings
    within larger words (e.g. 'OCR' within 'mediocre').

    Returns:
        (matched_entities, density_score) where density_score is between 0.0 and 1.0.
    """
    if not required_entities or not text:
        return [], 0.0

    matched = []
    text_norm = re.sub(r"[\u2013\u2014]", "-", text.lower())

    for entity in required_entities:
        ent_clean = entity.strip()
        if not ent_clean:
            continue
        ent_norm = re.sub(r"[\u2013\u2014]", "-", ent_clean.lower())
        pattern = rf"(?<!\w){re.escape(ent_norm)}(?!\w)"
        if re.search(pattern, text_norm):
            matched.append(ent_clean)

    density = round(len(matched) / len(required_entities), 4)
    return matched, density
