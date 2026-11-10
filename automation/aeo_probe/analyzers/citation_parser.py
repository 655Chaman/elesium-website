"""Citation extractor and URL normalizer for LLM search outputs."""

import re
from typing import Any, Dict, Iterable, List, Optional, Set
from urllib.parse import urlparse

DEFAULT_ELESIUM_DOMAINS = {
    "elesium.online",
    "elesium.ai",
    "elesium.com",
    "elesium.io",
    "elesium.in",
    "elesium.tech",
}


def normalize_url(url: str) -> str:
    """Normalizes a URL by removing trailing punctuation, queries, fragments, and slashes."""
    if not url:
        return ""
    clean = url.strip()
    # Strip wrapping brackets or quotes if captured
    clean = clean.strip("<>\"'()[]")
    # Strip query string and fragments for canonical matching
    clean = re.sub(r"[\?\#].*$", "", clean)
    # Strip trailing slashes
    clean = re.sub(r"/+$", "", clean)
    return clean.lower()


def is_elesium_url(
    url: str, brand_domains: Optional[Iterable[str]] = None
) -> bool:
    """Determines whether a given URL points to Elesium's domain or subdomains."""
    if not url:
        return False
    domains = set(brand_domains) if brand_domains else DEFAULT_ELESIUM_DOMAINS
    norm = normalize_url(url)
    try:
        parsed = urlparse(norm if "://" in norm else f"https://{norm}")
        # Use parsed.hostname to handle credentials, port, etc. cleanly
        host = (parsed.hostname or "").lower()
        if not host and parsed.netloc:
            netloc = parsed.netloc.lower()
            if "@" in netloc:
                netloc = netloc.split("@")[-1]
            host = netloc.split(":")[0]
        return any(host == d or host.endswith(f".{d}") for d in domains)
    except Exception:
        return False


def extract_all_citations(
    provider_name: str,
    raw_response: Optional[Dict[str, Any]] = None,
    text_content: str = "",
    brand_domains: Optional[Iterable[str]] = None,
) -> List[str]:
    """Extracts all unique citation URLs from provider structured data and text."""
    found_urls: Set[str] = set()

    # 1. Provider-Specific Structured Fields
    if raw_response and isinstance(raw_response, dict):
        prov = provider_name.lower()
        if "perplexity" in prov:
            for item in (raw_response.get("citations") or []):
                if isinstance(item, str) and item.startswith("http"):
                    found_urls.add(item)
        elif "gemini" in prov:
            for cand in (raw_response.get("candidates") or []):
                if not isinstance(cand, dict):
                    continue
                grounding = cand.get("groundingMetadata") or {}
                if not isinstance(grounding, dict):
                    continue
                for chunk in (grounding.get("groundingChunks") or []):
                    if not isinstance(chunk, dict):
                        continue
                    web = chunk.get("web") or {}
                    if not isinstance(web, dict):
                        continue
                    uri = web.get("uri")
                    if uri and isinstance(uri, str):
                        found_urls.add(uri)
        elif "openai" in prov:
            for choice in (raw_response.get("choices") or []):
                if not isinstance(choice, dict):
                    continue
                msg = choice.get("message") or {}
                if not isinstance(msg, dict):
                    continue
                # Annotations format (gpt-4o-search-preview)
                for annot in (msg.get("annotations") or []):
                    if isinstance(annot, dict) and annot.get("url"):
                        found_urls.add(annot["url"])
                # Web search tool citation call format
                ctx = msg.get("context") or {}
                if isinstance(ctx, dict):
                    for cit in (ctx.get("citations") or []):
                        if isinstance(cit, dict) and cit.get("url"):
                            found_urls.add(cit["url"])
        elif "claude" in prov:
            for block in (raw_response.get("content") or []):
                if not isinstance(block, dict):
                    continue
                for cit in (block.get("citations") or []):
                    if isinstance(cit, dict) and cit.get("url"):
                        found_urls.add(cit["url"])

    # 2. Markdown Hyperlink Extraction [Anchor](URL)
    if text_content:
        for match in re.finditer(r"\[([^\]]+)\]\((https?://[^\s\)]+)\)", text_content):
            found_urls.add(match.group(2))

        # 3. Universal Raw URL Pattern Extraction
        raw_urls = re.findall(r"https?://[a-zA-Z0-9_\-\./~%+#=?&;:,@]+", text_content)
        for raw in raw_urls:
            clean = raw.rstrip(".,;!?:)]>\"'")
            found_urls.add(clean)

    # Clean and deduplicate while preserving original protocol
    normalized_list = []
    seen_normalized = set()
    for u in found_urls:
        norm = normalize_url(u)
        if norm and norm not in seen_normalized:
            seen_normalized.add(norm)
            normalized_list.append(u.rstrip(".,;!?:)]>\"'"))

    return normalized_list


def filter_elesium_citations(
    citations: List[str], brand_domains: Optional[Iterable[str]] = None
) -> List[str]:
    """Returns only citations matching Elesium domains."""
    return [c for c in citations if is_elesium_url(c, brand_domains)]
