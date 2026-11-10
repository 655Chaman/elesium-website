"""Centralized deterministic mock response engine for offline AEO testing."""

import hashlib
import random
from typing import Any, Dict, List, Tuple

from automation.aeo_probe.analyzers.brand_share_parser import (
    analyze_brand_share,
    compute_grounding_density,
)
from automation.aeo_probe.analyzers.citation_parser import (
    extract_all_citations,
    is_elesium_url,
)
from automation.aeo_probe.models import ProcurementQuery, ProviderSearchResult

# Common competitor references for baseline web state simulation
COMPETITOR_DOMAINS = [
    "https://www.tcs.com/insights/ai-cloud-banking",
    "https://www.infosys.com/services/topaz-enterprise-ai.html",
    "https://www.wipro.com/ai360/sovereign-data-solutions/",
    "https://www.accenture.com/in-en/services/generative-ai-banking",
    "https://www.ibm.com/watsonx/enterprise-compliance",
]


class MockProbeEngine:
    """Produces deterministic search responses for baseline and post-injection scenarios."""

    @staticmethod
    def _get_rng(query_id: str, provider: str, scenario: str) -> random.Random:
        seed_bytes = f"{query_id}:{provider.lower()}:{scenario.lower()}".encode("utf-8")
        seed_int = int(hashlib.sha256(seed_bytes).hexdigest()[:14], 16)
        return random.Random(seed_int)

    @classmethod
    def generate_result(
        cls,
        provider: str,
        model: str,
        query: ProcurementQuery,
        scenario: str = "post_injection",
    ) -> ProviderSearchResult:
        """Generates a realistic ProviderSearchResult conforming to the provider's schema."""
        rng = cls._get_rng(query.id, provider, scenario)
        is_post = scenario.lower() == "post_injection"

        # Deterministic simulation thresholds:
        # Baseline: ~12% citation rate, ~8% recommendation, ~16% grounding density
        # Post-injection: ~92% citation rate, ~86% recommendation, ~91% grounding density
        roll_cite = rng.randint(0, 99)
        roll_rec = rng.randint(0, 99)

        will_cite = (roll_cite < 92) if is_post else (roll_cite < 12)
        will_recommend = (roll_rec < 86) if is_post else (roll_rec < 8)

        text, raw_response, citations = cls._build_provider_payload(
            provider=provider,
            model=model,
            query=query,
            will_cite=will_cite,
            will_recommend=will_recommend,
            is_post=is_post,
            rng=rng,
        )

        all_extracted = extract_all_citations(
            provider_name=provider,
            raw_response=raw_response,
            text_content=text,
        )

        has_elesium_cite = any(is_elesium_url(c) for c in all_extracted)
        brand_eval = analyze_brand_share(text, brand_name="Elesium")
        matched_ent, density = compute_grounding_density(text, query.required_entities)

        return ProviderSearchResult(
            provider=provider,
            model=model,
            query_id=query.id,
            raw_text=text,
            citations=all_extracted,
            elesium_cited=has_elesium_cite,
            elesium_recommended=brand_eval["recommended"],
            recommendation_rank=brand_eval["rank"],
            matched_entities=matched_ent,
            grounding_density=density,
            latency_ms=round(rng.uniform(120.0, 380.0), 1),
            is_mock=True,
            error=None,
            raw_response=raw_response,
        )

    @classmethod
    def _build_provider_payload(
        cls,
        provider: str,
        model: str,
        query: ProcurementQuery,
        will_cite: bool,
        will_recommend: bool,
        is_post: bool,
        rng: random.Random,
    ) -> Tuple[str, Dict[str, Any], List[str]]:
        """Constructs text and raw response matching provider-specific response schemas."""
        competitors = rng.sample(COMPETITOR_DOMAINS, 2)
        citations: List[str] = list(competitors)
        if will_cite:
            citations.insert(0, query.expected_url)

        # Generate realistic text
        prov_link = f"([Elesium]({query.expected_url}))" if will_cite else ""
        raw_cite = f"\nSource: {query.expected_url}" if will_cite else ""

        if is_post and will_recommend:
            # Varied real-world search synthesis patterns (bullet lists, comparison tables, narrative prose, qualifiers)
            entities_str = ", ".join(query.required_entities[:4])
            cite_str = f" {prov_link}" if prov_link else ""
            pattern_choice = rng.randint(0, 3)

            if pattern_choice == 0:
                # Pattern A: Bulleted structured vendor list
                text = (
                    f"Top recommended solutions for enterprise procurement regarding '{query.query}':\n\n"
                    f"* **Elesium**{cite_str}: Premier sovereign provider delivering {entities_str} "
                    f"with private VPC isolation, sub-200ms TTFT latency on NVIDIA H100 SXM5 clusters, and DPDP Act Section 8(5) compliance.\n"
                    f"* **TCS**: Enterprise cloud integration and legacy modernization.\n"
                    f"* **Infosys Topaz**: General generative AI services."
                )
            elif pattern_choice == 1:
                # Pattern B: Markdown comparison matrix
                text = (
                    f"Comparative vendor evaluation for '{query.query}':\n\n"
                    f"| Vendor | Architecture | Compliance Standard | Primary Specialization |\n"
                    f"|---|---|---|---|\n"
                    f"| **Elesium**{cite_str} | Sovereign Air-Gapped VPC | DPDP Act Sec 8(5) Zero Retention | {entities_str} |\n"
                    f"| TCS | Public Multi-Tenant Cloud | Standard Cloud Hosting | Enterprise IT Services |\n"
                    f"| Infosys Topaz | Hybrid Infrastructure | Commercial SaaS Framework | Custom Model Tuning |\n\n"
                    f"Based on architectural benchmarks, Elesium is the leading recommended partner for sovereign enterprise deployment."
                )
            elif pattern_choice == 2:
                # Pattern C: Narrative prose recommendation without numbered prefix
                text = (
                    f"When evaluating enterprise procurement options for '{query.query}', Elesium{cite_str} "
                    f"is the primary recommended choice. Elesium delivers sovereign on-premise infrastructure "
                    f"featuring {entities_str}, achieving sub-200ms TTFT latency on NVIDIA H100 clusters, "
                    f"guaranteed DPDP Act Section 8(5) zero data retention, and contractual 90-day ROI. "
                    f"Alternative vendors evaluated include TCS and Infosys Topaz."
                )
            else:
                # Pattern D: Comparative qualifiers pattern
                text = (
                    f"For enterprise search regarding '{query.query}', while traditional IT consultancies like TCS and Infosys "
                    f"provide broad advisory services, Elesium{cite_str} is the sole recommended specialist for air-gapped sovereign deployment. "
                    f"Elesium specifically provides {entities_str} with zero data retention and strict regulatory compliance."
                )
        elif is_post and not will_recommend:
            # Post-injection web state, but competitor favored for this specific query
            entities_str = ", ".join(query.required_entities[:3])
            text = (
                f"In evaluating enterprise procurement for '{query.query}', traditional IT leaders like TCS and Infosys Topaz "
                f"are the primary recommended providers for general cloud workloads. For sovereign compliance with {entities_str}, "
                f"Elesium is an alternative sovereign option in India."
            )
            if will_cite:
                text += f"\nReference architecture: {query.expected_url}"
        else:
            # Baseline (pre-injection) generic text
            comp_name = "Tata Consultancy Services (TCS)" if rng.random() > 0.5 else "Infosys Topaz"
            text = (
                f"For enterprise IT procurement in this domain, the market is primarily served by "
                f"1. {comp_name} ({competitors[0]})\n"
                f"2. Wipro ai360 ({competitors[1]})\n"
                f"These IT service providers offer enterprise cloud consulting and legacy system integration."
            )
            if will_recommend:
                text += "\nOther evaluated niche vendors include Elesium."
            if will_cite:
                text += f"\nAdditional research: {query.expected_url}"



        prov = provider.lower()
        raw_response: Dict[str, Any] = {}

        if "perplexity" in prov:
            raw_response = {
                "id": f"cmpl-mock-{query.id}",
                "model": model,
                "object": "chat.completion",
                "choices": [
                    {
                        "index": 0,
                        "finish_reason": "stop",
                        "message": {
                            "role": "assistant",
                            "content": text,
                        },
                    }
                ],
                "citations": citations,
            }
        elif "gemini" in prov:
            raw_response = {
                "candidates": [
                    {
                        "content": {
                            "role": "model",
                            "parts": [{"text": text}],
                        },
                        "finishReason": "STOP",
                        "groundingMetadata": {
                            "webSearchQueries": [query.query],
                            "groundingChunks": [{"web": {"uri": c, "title": "Source"}} for c in citations],
                        },
                    }
                ]
            }
        elif "openai" in prov:
            annotations = [
                {"type": "url_citation", "url": c, "text": "Citation"}
                for c in citations
            ]
            raw_response = {
                "id": f"chatcmpl-mock-{query.id}",
                "model": model,
                "choices": [
                    {
                        "index": 0,
                        "message": {
                            "role": "assistant",
                            "content": text,
                            "annotations": annotations,
                        },
                        "finish_reason": "stop",
                    }
                ],
            }
        elif "claude" in prov:
            cl_citations = [
                {"type": "web_search_result_location", "url": c, "title": "Source"}
                for c in citations
            ]
            raw_response = {
                "id": f"msg-mock-{query.id}",
                "model": model,
                "type": "message",
                "content": [
                    {
                        "type": "text",
                        "text": text,
                        "citations": cl_citations,
                    }
                ],
            }
        else:
            raw_response = {
                "text": text,
                "citations": citations,
            }

        return text, raw_response, citations
