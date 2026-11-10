"""Dataset loader and validator for the 50 Enterprise AI Procurement Queries."""

import json
import os
from typing import Any, Dict, List, Optional
from automation.aeo_probe.models import ProcurementQuery

DEFAULT_DATASET_PATH = os.path.join(
    os.path.dirname(__file__), "enterprise_ai_procurement_queries.json"
)

EXPECTED_QUERY_COUNT = 50


def load_queries(
    dataset_path: Optional[str] = None,
) -> List[ProcurementQuery]:
    """Loads and validates the enterprise AI procurement query benchmark battery."""
    path = dataset_path or DEFAULT_DATASET_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Queries dataset not found at {path}")

    with open(path, "r", encoding="utf-8") as f:
        raw_items = json.load(f)

    if not isinstance(raw_items, list):
        raise ValueError(f"Dataset root must be a JSON array, got {type(raw_items)}")

    queries = [ProcurementQuery.model_validate(item) for item in raw_items]
    return queries


def validate_dataset(queries: List[ProcurementQuery]) -> Dict[str, Any]:
    """Validates the integrity of the query dataset against R2 requirements."""
    count = len(queries)
    if count != EXPECTED_QUERY_COUNT:
        raise ValueError(
            f"Dataset must contain exactly {EXPECTED_QUERY_COUNT} queries, found {count}"
        )

    ids = set()
    domain_counts: Dict[str, int] = {}

    for q in queries:
        if q.id in ids:
            raise ValueError(f"Duplicate query ID found: {q.id}")
        ids.add(q.id)

        if not q.query or len(q.query.strip()) < 10:
            raise ValueError(f"Query {q.id} has empty or trivial query text")

        if not q.expected_url or not q.expected_url.startswith("https://elesium.online"):
            raise ValueError(
                f"Query {q.id} expected_url must start with 'https://elesium.online', got '{q.expected_url}'"
            )

        if not q.required_entities:
            raise ValueError(f"Query {q.id} must define at least one required entity")

        dom = q.domain or q.vertical or "Unknown"
        domain_counts[dom] = domain_counts.get(dom, 0) + 1

    return {
        "total_queries": count,
        "unique_ids": len(ids),
        "domain_counts": domain_counts,
        "is_valid": True,
    }


def get_query_by_id(
    query_id: str, dataset_path: Optional[str] = None
) -> Optional[ProcurementQuery]:
    """Fetches a specific query by ID (e.g. 'Q01')."""
    queries = load_queries(dataset_path)
    for q in queries:
        if q.id == query_id:
            return q
    return None


def get_queries_by_domain(
    domain_substring: str, dataset_path: Optional[str] = None
) -> List[ProcurementQuery]:
    """Filters queries matching a domain or vertical substring."""
    queries = load_queries(dataset_path)
    sub = domain_substring.lower()
    return [
        q for q in queries if sub in (q.domain or "").lower() or sub in (q.vertical or "").lower()
    ]
