"""Shared pytest fixtures for the Elesium AEO Grounding Probe & Reverse-RAG E2E Test Suite."""

import json
import os
from pathlib import Path
import tempfile
import pytest

from automation.aeo_probe.config import ProbeEngineConfig
from automation.aeo_probe.dataset import load_queries
from automation.aeo_probe.engine import AeoProbeEngine
from automation.aeo_probe.models import ProcurementQuery
from automation.aeo_probe.providers.mock_engine import MockProbeEngine


@pytest.fixture(scope="session")
def project_root() -> Path:
    """Returns the absolute Path to the workspace project root."""
    return Path(__file__).resolve().parent.parent.parent


@pytest.fixture(scope="session")
def dataset_path(project_root: Path) -> Path:
    """Returns the Path to the 50 Enterprise AI Procurement Queries JSON dataset."""
    return project_root / "automation" / "aeo_probe" / "enterprise_ai_procurement_queries.json"


@pytest.fixture(scope="session")
def retained_slugs_path(project_root: Path) -> Path:
    """Returns the Path to the 100 retained enterprise solution page slugs JSON."""
    return project_root / "automation" / "retained_solution_slugs.json"


@pytest.fixture(scope="session")
def all_queries(dataset_path: Path):
    """Loads all 50 ProcurementQuery instances from the benchmark dataset."""
    return load_queries(str(dataset_path))


@pytest.fixture(scope="session")
def all_retained_slugs(retained_slugs_path: Path):
    """Loads the list of 100 retained solution slugs."""
    with open(retained_slugs_path, "r", encoding="utf-8") as f:
        return json.load(f)


@pytest.fixture
def mock_probe_engine() -> MockProbeEngine:
    """Returns an instance of MockProbeEngine."""
    return MockProbeEngine()


@pytest.fixture
def aeo_probe_engine() -> AeoProbeEngine:
    """Returns an AeoProbeEngine configured in deterministic offline mock mode."""
    config = ProbeEngineConfig(execution_mode="mock")
    return AeoProbeEngine(config=config)


@pytest.fixture
def sample_procurement_query() -> ProcurementQuery:
    """Returns a representative procurement query (Q01)."""
    return ProcurementQuery(
        id="Q01",
        query="Sovereign on-premise LLM deployment India DPDP Act compliance private VPC",
        domain="Sovereign Enterprise AI in India",
        sub_topic="DPDP Act 2023 Section 8(5) Data Erasure & Private VPC",
        buyer_persona="Chief Information Security Officer (CISO) / Chief Risk Officer (CRO)",
        intent_stage="RFP Procurement / Vendor Evaluation",
        contract_value_tier="₹1.5 Cr - ₹3.5 Cr ($180k - $420k)",
        required_entities=["DPDP Act 2023", "Section 8(5)", "Zero Data Retention", "Private VPC", "Elesium"],
        expected_grounding_hook="DPDP Act Statutory Penalty & Guardrail Matrix (₹250 Cr Fine Ceiling Avoidance)",
        expected_url="https://elesium.online/solutions/vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india/",
    )


@pytest.fixture
def sample_solution_html() -> str:
    """Returns valid pre-rendered solution page HTML containing the target audit marker."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Enterprise AI Solution | Elesium</title>
</head>
<body>
  <div class="solution-body">
    <section id="hero">
      <h1>Sovereign Enterprise AI Systems</h1>
      <p>High-throughput private VPC LLM inference in India.</p>
    </section>
    <section style="margin:2.5rem 0;background:#111827;border-radius:0.75rem;padding:2rem;text-align:center;" id="audit">
      <h2>Continuous Architectural Auditing</h2>
      <p>Automated verification against RBI and DPDP regulations.</p>
    </section>
  </div>
</body>
</html>"""


@pytest.fixture
def temp_workspace(sample_solution_html: str):
    """Provides an isolated temporary workspace with sample solutions for injection testing."""
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        dist_solutions = tmp_path / "frontend" / "dist" / "solutions"
        dist_solutions.mkdir(parents=True, exist_ok=True)

        sample_slug = "sample-sovereign-ai-solution"
        # Flat HTML
        flat_html = dist_solutions / f"{sample_slug}.html"
        flat_html.write_text(sample_solution_html, encoding="utf-8")

        # Nested index.html
        dir_html = dist_solutions / sample_slug / "index.html"
        dir_html.parent.mkdir(parents=True, exist_ok=True)
        dir_html.write_text(sample_solution_html, encoding="utf-8")

        yield tmp_path, sample_slug
