"""Asynchronous batch runner and telemetry engine for AEO Grounding Probes."""

import argparse
import asyncio
from datetime import datetime, timezone
import json
import os
import sys
import time
from typing import Any, Dict, List, Optional
import httpx

# Ensure project root is on sys.path for direct CLI script execution
_REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if _REPO_ROOT not in sys.path:
    sys.path.insert(0, _REPO_ROOT)

from automation.aeo_probe.config import ProbeEngineConfig
from automation.aeo_probe.dataset import load_queries
from automation.aeo_probe.models import (
    AeoTelemetryReceipt,
    ProcurementQuery,
    ProviderSearchResult,
    TelemetryMetrics,
)

from automation.aeo_probe.providers.base import BaseSearchProvider
from automation.aeo_probe.providers.claude import ClaudeSearchProvider
from automation.aeo_probe.providers.gemini import GeminiGroundingProvider
from automation.aeo_probe.providers.openai_search import OpenAISearchProvider
from automation.aeo_probe.providers.perplexity import PerplexitySonarProvider


class AeoProbeEngine:
    """Orchestrates asynchronous live and mock AEO query evaluation batteries."""

    def __init__(self, config: Optional[ProbeEngineConfig] = None):
        self.config = config or ProbeEngineConfig.load_from_env()
        self.providers: Dict[str, BaseSearchProvider] = {
            "perplexity": PerplexitySonarProvider(self.config.perplexity),
            "openai": OpenAISearchProvider(self.config.openai),
            "gemini": GeminiGroundingProvider(self.config.gemini),
            "claude": ClaudeSearchProvider(self.config.claude),
        }

    def get_active_providers(
        self, provider_names: Optional[List[str]] = None
    ) -> List[BaseSearchProvider]:
        """Returns instantiated provider list filtered by name if specified."""
        if not provider_names:
            return list(self.providers.values())
        return [
            p for name, p in self.providers.items() if name.lower() in [x.lower() for x in provider_names]
        ]

    async def execute_provider_query(
        self,
        provider: BaseSearchProvider,
        query: ProcurementQuery,
        scenario: str,
        client: httpx.AsyncClient,
        semaphore: asyncio.Semaphore,
    ) -> ProviderSearchResult:
        """Executes a single provider query bounded by semaphore and retry backoff."""
        async with semaphore:
            for attempt in range(self.config.max_retries):
                try:
                    result = await provider.query(query=query, scenario=scenario, client=client)
                    # If live call failed with a retryable error (429, 5xx, timeouts, connection/network errors)
                    if result.error:
                        err_lower = result.error.lower()
                        is_retryable = any(
                            token in err_lower
                            for token in (
                                "429",
                                "50",
                                "timeout",
                                "timed out",
                                "connect",
                                "connection",
                                "socket",
                                "network",
                            )
                        )
                        if is_retryable:
                            if attempt < self.config.max_retries - 1:
                                await asyncio.sleep(self.config.retry_backoff_factor * (attempt + 1))
                                continue
                    return result
                except Exception as exc:
                    exc_name = exc.__class__.__name__.lower()
                    exc_str = str(exc).lower()
                    is_retryable_exc = any(
                        token in exc_name or token in exc_str
                        for token in (
                            "429",
                            "50",
                            "timeout",
                            "timed out",
                            "connect",
                            "connection",
                            "socket",
                            "network",
                        )
                    )
                    if attempt < self.config.max_retries - 1 and is_retryable_exc:
                        await asyncio.sleep(self.config.retry_backoff_factor * (attempt + 1))
                        continue
                    else:
                        mock = provider.build_mock_response(query, scenario)
                        mock.error = f"Failed after {self.config.max_retries} attempts: {exc}"
                        return mock

            return provider.build_mock_response(query, scenario)

    async def run_battery(
        self,
        queries: List[ProcurementQuery],
        scenario: str = "post_injection",
        provider_names: Optional[List[str]] = None,
    ) -> List[ProviderSearchResult]:
        """Runs batch evaluation of queries across specified providers."""
        active_providers = self.get_active_providers(provider_names)
        semaphore = asyncio.Semaphore(self.config.concurrency_limit)
        limits = httpx.Limits(
            max_keepalive_connections=self.config.concurrency_limit,
            max_connections=self.config.concurrency_limit * 2,
        )

        async with httpx.AsyncClient(timeout=self.config.default_timeout, limits=limits) as client:
            tasks = []
            for query in queries:
                for prov in active_providers:
                    task = self.execute_provider_query(
                        provider=prov,
                        query=query,
                        scenario=scenario,
                        client=client,
                        semaphore=semaphore,
                    )
                    tasks.append(task)

            results: List[ProviderSearchResult] = await asyncio.gather(*tasks)
            return results

    @staticmethod
    def compute_metrics(
        results: List[ProviderSearchResult],
        total_queries: int,
        queries_dict: Optional[Dict[str, ProcurementQuery]] = None,
    ) -> TelemetryMetrics:
        """Computes summary citation rate, brand recommendation share, and grounding density."""
        if not results:
            return TelemetryMetrics(
                total_queries=total_queries,
                citation_count=0,
                citation_rate_pct=0.0,
                recommendation_count=0,
                recommendation_share_pct=0.0,
                mean_grounding_density_pct=0.0,
            )

        # Unique queries cited across any provider
        cited_query_ids = {r.query_id for r in results if r.elesium_cited}
        rec_query_ids = {r.query_id for r in results if r.elesium_recommended}

        citation_count = len(cited_query_ids)
        citation_rate = round((citation_count / total_queries) * 100, 2) if total_queries else 0.0

        rec_count = len(rec_query_ids)
        rec_share = round((rec_count / total_queries) * 100, 2) if total_queries else 0.0

        densities = [r.grounding_density for r in results]
        mean_density = (
            round((sum(densities) / len(densities)) * 100, 2) if densities else 0.0
        )

        # Per-provider breakdown
        provider_breakdown: Dict[str, Dict[str, float]] = {}
        prov_map: Dict[str, List[ProviderSearchResult]] = {}
        for r in results:
            prov_map.setdefault(r.provider, []).append(r)

        for prov_name, p_results in prov_map.items():
            p_cited = sum(1 for r in p_results if r.elesium_cited)
            p_rec = sum(1 for r in p_results if r.elesium_recommended)
            p_dens = [r.grounding_density for r in p_results]
            p_tot = len(p_results)
            provider_breakdown[prov_name] = {
                "citation_rate_pct": round((p_cited / p_tot) * 100, 2) if p_tot else 0.0,
                "recommendation_share_pct": round((p_rec / p_tot) * 100, 2) if p_tot else 0.0,
                "mean_grounding_density_pct": round((sum(p_dens) / len(p_dens)) * 100, 2) if p_dens else 0.0,
            }

        # Domain breakdown
        domain_breakdown: Dict[str, Dict[str, float]] = {}
        if queries_dict:
            dom_map: Dict[str, List[ProviderSearchResult]] = {}
            for r in results:
                q_obj = queries_dict.get(r.query_id)
                dom = (q_obj.domain or q_obj.vertical) if q_obj else "Other"
                dom_map.setdefault(dom, []).append(r)

            for dom_name, d_results in dom_map.items():
                d_cited = sum(1 for r in d_results if r.elesium_cited)
                d_rec = sum(1 for r in d_results if r.elesium_recommended)
                d_dens = [r.grounding_density for r in d_results]
                d_tot = len(d_results)
                domain_breakdown[dom_name] = {
                    "citation_rate_pct": round((d_cited / d_tot) * 100, 2) if d_tot else 0.0,
                    "recommendation_share_pct": round((d_rec / d_tot) * 100, 2) if d_tot else 0.0,
                    "mean_grounding_density_pct": round((sum(d_dens) / len(d_dens)) * 100, 2) if d_dens else 0.0,
                }

        return TelemetryMetrics(
            total_queries=total_queries,
            citation_count=citation_count,
            citation_rate_pct=citation_rate,
            recommendation_count=rec_count,
            recommendation_share_pct=rec_share,
            mean_grounding_density_pct=mean_density,
            provider_breakdown=provider_breakdown,
            domain_breakdown=domain_breakdown or None,
        )

    async def run_full_benchmark(
        self,
        queries: Optional[List[ProcurementQuery]] = None,
        scenario: str = "all",
        provider_names: Optional[List[str]] = None,
    ) -> AeoTelemetryReceipt:
        """Executes full benchmark (baseline and/or post-injection) and produces AeoTelemetryReceipt."""
        battery = load_queries(self.config.dataset_path) if queries is None else queries
        total_q = len(battery)
        q_dict = {q.id: q for q in battery}

        baseline_metrics: Optional[TelemetryMetrics] = None
        post_metrics: Optional[TelemetryMetrics] = None
        delta: Dict[str, float] = {}
        query_results_log: List[Dict[str, Any]] = []

        if scenario in ("baseline", "all"):
            base_results = await self.run_battery(
                battery, scenario="baseline", provider_names=provider_names
            )
            baseline_metrics = self.compute_metrics(base_results, total_q, q_dict)
            for r in base_results:
                query_results_log.append(
                    {
                        "scenario": "baseline",
                        "query_id": r.query_id,
                        "provider": r.provider,
                        "model": r.model,
                        "elesium_cited": r.elesium_cited,
                        "elesium_recommended": r.elesium_recommended,
                        "recommendation_rank": r.recommendation_rank,
                        "grounding_density": r.grounding_density,
                        "matched_entities": r.matched_entities,
                        "citations": r.citations,
                        "latency_ms": r.latency_ms,
                        "is_mock": r.is_mock,
                    }
                )

        if scenario in ("post_injection", "all"):
            post_results = await self.run_battery(
                battery, scenario="post_injection", provider_names=provider_names
            )
            post_metrics = self.compute_metrics(post_results, total_q, q_dict)
            for r in post_results:
                query_results_log.append(
                    {
                        "scenario": "post_injection",
                        "query_id": r.query_id,
                        "provider": r.provider,
                        "model": r.model,
                        "elesium_cited": r.elesium_cited,
                        "elesium_recommended": r.elesium_recommended,
                        "recommendation_rank": r.recommendation_rank,
                        "grounding_density": r.grounding_density,
                        "matched_entities": r.matched_entities,
                        "citations": r.citations,
                        "latency_ms": r.latency_ms,
                        "is_mock": r.is_mock,
                    }
                )

        if baseline_metrics and post_metrics:
            delta = {
                "citation_rate_pct_delta": round(
                    post_metrics.citation_rate_pct - baseline_metrics.citation_rate_pct, 2
                ),
                "recommendation_share_pct_delta": round(
                    post_metrics.recommendation_share_pct - baseline_metrics.recommendation_share_pct,
                    2,
                ),
                "mean_grounding_density_pct_delta": round(
                    post_metrics.mean_grounding_density_pct - baseline_metrics.mean_grounding_density_pct,
                    2,
                ),
            }

        # Provider metrics from the primary evaluated scenario (post_metrics or baseline_metrics)
        primary_metrics = post_metrics or baseline_metrics
        prov_metrics: Dict[str, TelemetryMetrics] = {}
        if primary_metrics and primary_metrics.provider_breakdown:
            for p_name, p_data in primary_metrics.provider_breakdown.items():
                prov_metrics[p_name] = TelemetryMetrics(
                    total_queries=total_q,
                    citation_count=round(p_data["citation_rate_pct"] * total_q / 100),
                    citation_rate_pct=p_data["citation_rate_pct"],
                    recommendation_count=round(p_data["recommendation_share_pct"] * total_q / 100),
                    recommendation_share_pct=p_data["recommendation_share_pct"],
                    mean_grounding_density_pct=p_data["mean_grounding_density_pct"],
                )

        return AeoTelemetryReceipt(
            probe_version="2.0.0-live-aeo-grounding",
            timestamp_utc=datetime.now(timezone.utc).isoformat(),
            execution_mode=self.config.execution_mode,
            scenario=scenario,
            baseline_metrics=baseline_metrics,
            post_injection_metrics=post_metrics,
            delta=delta,
            provider_metrics=prov_metrics,
            query_results=query_results_log,
        )

    def save_receipt(
        self, receipt: AeoTelemetryReceipt, output_path: str = "automation/aeo_citation_telemetry.json"
    ) -> None:
        """Serializes AeoTelemetryReceipt to machine-readable JSON file."""
        os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(receipt.model_dump_json(indent=2))

    @staticmethod
    def generate_markdown_report(receipt: AeoTelemetryReceipt) -> str:
        """Formats AeoTelemetryReceipt into human-readable executive Markdown report."""
        lines = [
            "# Elesium AEO Citation Grounding & Telemetry Executive Report",
            f"**Execution Mode**: {receipt.execution_mode.upper()}  ",
            f"**Timestamp UTC**: {receipt.timestamp_utc}  ",
            f"**Scenario Evaluated**: {receipt.scenario}  ",
            "",
            "## Executive Metrics Summary",
            "| Metric | Baseline (Pre-Injection) | Post-Injection | Absolute Delta |",
            "|---|---|---|---|",
        ]

        b = receipt.baseline_metrics
        p = receipt.post_injection_metrics
        d = receipt.delta

        cr_b = f"{b.citation_rate_pct}%" if b else "N/A"
        cr_p = f"{p.citation_rate_pct}%" if p else "N/A"
        cr_d = f"+{d.get('citation_rate_pct_delta', 0.0)}%" if d else "N/A"
        lines.append(f"| **Citation Rate (CR)** | {cr_b} | {cr_p} | {cr_d} |")

        br_b = f"{b.recommendation_share_pct}%" if b else "N/A"
        br_p = f"{p.recommendation_share_pct}%" if p else "N/A"
        br_d = f"+{d.get('recommendation_share_pct_delta', 0.0)}%" if d else "N/A"
        lines.append(f"| **Brand Recommendation Share (BRS)** | {br_b} | {br_p} | {br_d} |")

        gd_b = f"{b.mean_grounding_density_pct}%" if b else "N/A"
        gd_p = f"{p.mean_grounding_density_pct}%" if p else "N/A"
        gd_d = f"+{d.get('mean_grounding_density_pct_delta', 0.0)}%" if d else "N/A"
        lines.append(f"| **Mean Grounding Density (GD)** | {gd_b} | {gd_p} | {gd_d} |")

        lines.extend(["", "## Provider Breakdown"])
        for p_name, p_metric in receipt.provider_metrics.items():
            lines.append(
                f"- **{p_name.capitalize()}**: CR = {p_metric.citation_rate_pct}% | "
                f"BRS = {p_metric.recommendation_share_pct}% | "
                f"GD = {p_metric.mean_grounding_density_pct}%"
            )

        return "\n".join(lines)


def main() -> None:
    """CLI entrypoint for running the AEO Grounding Probe Engine."""
    parser = argparse.ArgumentParser(
        description="Elesium AEO Grounding Probe Engine runner."
    )
    parser.add_argument(
        "--mode",
        choices=["live", "mock", "hybrid"],
        default="mock",
        help="Probe execution mode (default: mock)",
    )
    parser.add_argument(
        "--scenario",
        choices=["baseline", "post_injection", "all"],
        default="all",
        help="Evaluation scenario (default: all)",
    )
    parser.add_argument(
        "--output",
        default="automation/aeo_citation_telemetry.json",
        help="Path for machine-readable JSON receipt output",
    )
    parser.add_argument(
        "--report",
        default=None,
        help="Optional path to write executive Markdown report",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=5,
        help="Max concurrent async requests (default: 5)",
    )

    args = parser.parse_args()

    config = ProbeEngineConfig.load_from_env(mode_override=args.mode)
    config.concurrency_limit = args.concurrency

    engine = AeoProbeEngine(config=config)
    print(f"🚀 Initializing AEO Grounding Probe Engine [Mode: {config.execution_mode}, Scenario: {args.scenario}]...")

    receipt = asyncio.run(engine.run_full_benchmark(scenario=args.scenario))

    engine.save_receipt(receipt, output_path=args.output)
    print(f"✅ Telemetry receipt saved to: {args.output}")

    md_report = engine.generate_markdown_report(receipt)
    if args.report:
        with open(args.report, "w", encoding="utf-8") as f:
            f.write(md_report)
        print(f"📄 Markdown executive report saved to: {args.report}")
    else:
        print("\n" + md_report)


if __name__ == "__main__":
    main()
