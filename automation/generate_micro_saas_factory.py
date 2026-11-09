#!/usr/bin/env python3
"""
===============================================================================
Micro-SaaS Link Magnet & Interactive Simulator Factory Generator
Module 05: Behavioral Search Dominance & Dual-Mount Linkable Assets
===============================================================================
Generates and dual-mounts:
  1. Standalone Full-Page Tools: /tools/[slug] with Answer Capsules, Math, Schema
  2. Embeddable Widgets: /embed/[slug] with dynamic postMessage auto-resizing
  3. Pre-compressed Gzip (.gz) and Brotli (.br) assets for frontend/dist/
  4. Sitemap-core.xml registration with priority 0.9 and weekly changefreq
===============================================================================
"""

import os
import json
import gzip
from pathlib import Path
from typing import Dict, Any, List

try:
    import brotli
    HAS_BROTLI = True
except ImportError:
    HAS_BROTLI = False

ROOT_DIR = Path(__file__).resolve().parent.parent
FRONTEND_PUBLIC = ROOT_DIR / "frontend" / "public"
FRONTEND_DIST = ROOT_DIR / "frontend" / "dist"
PORTABLE_CALCS = ROOT_DIR / "PORTABLE_SEO_FACTORY" / "calculators"

TOOLS_MANIFEST: List[Dict[str, Any]] = [
    {
        "id": "tool_01",
        "slug": "token-cost-arbitrage-calculator",
        "embed_slug": "token-cost-arbitrage",
        "short_title": "LLM Token Cost Arbitrage Calculator",
        "title": "Enterprise LLM Token Cost Arbitrage Calculator",
        "category": "DeepTech & Cloud FinOps",
        "tagline": "Model monthly operating expense divergence: Proprietary Cloud APIs vs On-Premise Sovereign vLLM Clusters.",
        "meta_description": "Calculate enterprise token cost divergence between GPT-4o, Claude 3.5 Sonnet, and sovereign on-premise vLLM clusters. Amortize hardware and reduce TCO by up to 86%.",
        "answer_capsule": "The Enterprise LLM Token Cost Arbitrage Calculator models monthly operating expense divergence between hyperscaler multi-tenant APIs (GPT-4o, Claude 3.5 Sonnet) and on-premise private sovereign clusters (DeepSeek-V3, vLLM). It dynamically amortizes dedicated GPU hardware, power consumption, and network egress against peak token velocity to reveal 78% to 86% TCO reduction.",
        "calc_type": "token_arbitrage",
        "source_calc_file": "token_cost_arbitrage_calculator.html",
        "accent_color": "#06b6d4",
        "accent_glow": "rgba(6, 182, 212, 0.2)",
        "methodology": """
<h3>1. Mathematical Formulation & Amortization Mechanics</h3>
<p>The total cost of ownership (TCO) for foundation model inference diverges significantly between multi-tenant public APIs and dedicated private sovereign clusters. The model implements the following dual-cost formulation:</p>
<pre><code>C_cloud = ((T_in * P_in + T_out * P_out) / 1,000,000) * 12
C_sovereign = C_hw_amortized + C_power_cooling + C_network_egress
Net_Annual_Savings = C_cloud - C_sovereign
Arbitrage_Ratio = (Net_Annual_Savings / C_cloud) * 100%</code></pre>

<h3>2. Empirical Pricing & Hardware Baselines</h3>
<ul>
  <li><strong>OpenAI GPT-4o:</strong> $2.50 per 1M prompt tokens, $10.00 per 1M completion tokens ($4.38/MTok blended at 3:1 input/output ratio).</li>
  <li><strong>Anthropic Claude 3.5 Sonnet:</strong> $3.00 per 1M prompt tokens, $15.00 per 1M completion tokens ($6.00/MTok blended at 3:1 input/output ratio).</li>
  <li><strong>Google Gemini 1.5 Pro:</strong> $3.50 per 1M prompt tokens, $10.50 per 1M completion tokens ($5.25/MTok blended).</li>
  <li><strong>On-Premise Sovereign Cluster:</strong> 8x NVIDIA L40S or 4x H100 SXM5 compute nodes capital cost amortized over 36 months ($1,850/mo), electricity calculated at $0.11/kWh with PUE 1.35, and redundant NVLink switching. Net equivalent cost: $0.27/MTok input and $1.10/MTok output.</li>
</ul>

<h3>3. Data Residency & Legal Non-Financial Dividend</h3>
<p>In addition to raw dollar arbitrage, private sovereign clusters eliminate statutory risk under India's DPDP Act 2023, EU GDPR Article 44 cross-border transfer prohibitions, and RBI circular RBI/2023-24/104 regarding confidential banking telemetry retention on external multi-tenant infrastructure.</p>
"""
    },
    {
        "id": "tool_02",
        "slug": "dpdp-act-penalty-exposure-calculator",
        "embed_slug": "dpdp-penalty-calculator",
        "short_title": "DPDP Act Penalty Exposure Grader",
        "title": "DPDP Act 2023 Statutory Liability & Penalty Exposure Grader",
        "category": "Regulatory Compliance & Infosec",
        "tagline": "Quantify regulatory financial exposure under Section 33 & The Schedule of India's Digital Personal Data Protection Act.",
        "meta_description": "Assess enterprise statutory financial penalty exposure under India's DPDP Act 2023 up to ₹250 Crores. Model cross-border LLM egress, consent logs, and audit readiness.",
        "answer_capsule": "The India DPDP Act 2023 Statutory Penalty Exposure Grader calculates potential enterprise liability under Section 33 and The Schedule of the Digital Personal Data Protection Act (Act No. 22 of 2023). It estimates statutory fines up to ₹250 Crores based on record volume, cross-border LLM data transfers, multi-lingual consent records, and DPO appointments.",
        "calc_type": "dpdp_penalty",
        "source_calc_file": "dpdp_act_penalty_exposure_calculator.html",
        "accent_color": "#f59e0b",
        "accent_glow": "rgba(245, 158, 11, 0.2)",
        "methodology": """
<h3>1. Statutory Framework (Act No. 22 of 2023)</h3>
<p>The Digital Personal Data Protection Act, 2023 establishes significant financial liabilities under Section 33 and The Schedule for Data Fiduciaries and Significant Data Fiduciaries (SDFs):</p>
<ul>
  <li><strong>Schedule Item 1 (Section 8(5)):</strong> Breach in observing reasonable security safeguards to prevent personal data breach — Statutory fine up to <strong>₹250 Crores ($30.1M USD)</strong>.</li>
  <li><strong>Schedule Item 2 (Section 8(6)):</strong> Failure to notify Data Protection Board of India and affected data principals of personal data breach — Statutory fine up to <strong>₹200 Crores</strong>.</li>
  <li><strong>Schedule Item 3 (Section 9):</strong> Non-fulfillment of additional obligations in relation to children or individuals with disabilities — Statutory fine up to <strong>₹200 Crores</strong>.</li>
  <li><strong>Schedule Item 4 (Section 10):</strong> Non-fulfillment of statutory obligations by Significant Data Fiduciaries (Periodic audits, DPIA, DPO appointment) — Statutory fine up to <strong>₹150 Crores</strong>.</li>
  <li><strong>Schedule Item 5:</strong> Breach of any other provision or rule framed under the Act — Statutory fine up to <strong>₹50 Crores</strong>.</li>
</ul>

<h3>2. Volumetric Liability Scaling Formula</h3>
<p>Penalties are adjudicated by the Data Protection Board taking into account the nature, gravity, and duration of the breach, alongside the volume of data principals impacted:</p>
<pre><code>Volumetric_Factor = min(1.0, log10(N_records) / 7.0)
Statutory_Exposure = min(250, max(Base_Risk, Sum(Violation_Weights)) * Volumetric_Factor)</code></pre>

<h3>3. Sovereign Air-Gapped Remediation</h3>
<p>Deploying sovereign on-premise foundation models within private VPC enclaves guarantees that zero digital personal data traverses national borders, eliminating exposure under Section 16(1) and Schedule Item 1 with 100% mathematical certainty.</p>
"""
    },
    {
        "id": "tool_03",
        "slug": "enterprise-rag-latency-simulator",
        "embed_slug": "rag-latency-simulator",
        "short_title": "Enterprise RAG Latency Simulator",
        "title": "Enterprise RAG Retrieval & Generation Latency Simulator",
        "category": "AI Architecture & Vector Systems",
        "tagline": "Simulate p50, p90, and p99 end-to-end retrieval and generation latency across enterprise architectures.",
        "meta_description": "Simulate end-to-end RAG latency across Qdrant, Milvus, pgvector, and sovereign vLLM clusters. Evaluate embedding, ANN search, re-ranking, and TTFT generation waterfalls.",
        "answer_capsule": "The Enterprise RAG Pipeline Latency Simulator models deterministic p50, p90, and p99 query execution times across production vector retrieval and generative inference stages. It factors in dense vector indexing algorithms (Qdrant HNSW, Milvus, pgvector), cross-encoder re-ranking overhead, time-to-first-token (TTFT), and token generation streaming on sovereign vLLM clusters.",
        "calc_type": "rag_latency",
        "source_calc_file": "enterprise_rag_latency_simulator.html",
        "accent_color": "#8b5cf6",
        "accent_glow": "rgba(139, 92, 246, 0.2)",
        "methodology": """
<h3>1. Pipeline Execution Waterfall Physics</h3>
<p>Production enterprise Retrieval-Augmented Generation (RAG) involves sequential and parallelized stages, each contributing discrete latency envelopes:</p>
<pre><code>L_p50 = T_embed + T_vector_search + T_cross_rerank + T_ttft + (N_gen_tokens * T_per_token)
L_p90 = L_p50 * 1.28 + Sigma_network
L_p99 = L_p50 * 1.85 + 2 * Sigma_network</code></pre>

<h3>2. Empirical Latency Benchmarks by Subsystem</h3>
<ul>
  <li><strong>Dense Vector Search (Top-K=5, 1536-dim):</strong>
    <ul>
      <li><em>Qdrant:</em> In-memory HNSW graphs with SIMD AVX-512 vector distance kernels: <strong>6–10 ms</strong>.</li>
      <li><em>Milvus:</em> Distributed sharded cluster with GPU-accelerated search: <strong>12–16 ms</strong>.</li>
      <li><em>pgvector (Postgres 16):</em> In-process HNSW index with shared buffer overhead: <strong>22–28 ms</strong>.</li>
      <li><em>Pinecone Serverless:</em> Multi-tenant HTTPS round-trip and remote partition lookup: <strong>45–85 ms</strong>.</li>
    </ul>
  </li>
  <li><strong>Cross-Encoder Re-Ranking:</strong> Two-stage retrieval utilizing FlashRank (ONNX runtime) or bge-reranker-large: <code>T = 15ms + (K * 2.4ms)</code>.</li>
  <li><strong>Generative LLM Serving:</strong>
    <ul>
      <li><em>On-Prem vLLM (DeepSeek-V3 FP8):</em> Time-to-First-Token (TTFT) ~120 ms; token streaming ~192 tok/s (5.2 ms/token).</li>
      <li><em>On-Prem vLLM (Llama-3.3-70B FP8):</em> TTFT ~90 ms; token streaming ~263 tok/s (3.8 ms/token).</li>
      <li><em>Cloud Multi-Tenant APIs (GPT-4o / Claude 3.5):</em> TTFT 450–750 ms; token streaming ~70–80 tok/s (12.5–14.0 ms/token).</li>
    </ul>
  </li>
</ul>
"""
    },
    {
        "id": "tool_04",
        "slug": "agent-vram-gpu-cluster-sizer",
        "embed_slug": "gpu-cluster-sizer",
        "short_title": "GPU VRAM & Cluster Sizer",
        "title": "Multi-Agent GPU VRAM & Tensor Parallelism Cluster Sizer",
        "category": "Hardware & Accelerated Compute",
        "tagline": "Compute exact physical GPU memory allocation: Weights, PagedAttention KV-cache, and Tensor Parallelism.",
        "meta_description": "Size GPU cluster requirements for multi-agent workloads. Calculate VRAM for DeepSeek-V3, Llama-3.3, KV-cache scaling, and tensor parallelism across H100 and L40S pods.",
        "answer_capsule": "The Multi-Agent GPU VRAM & Cluster Sizer computes exact physical hardware allocations for sovereign on-premise foundation model serving. It calculates model weight memory, PagedAttention KV-cache scaling per concurrent agent, and determines optimal Tensor Parallelism (TP) mesh topologies across NVIDIA H100 SXM5, A100, and L40S server clusters.",
        "calc_type": "gpu_sizer",
        "source_calc_file": "agent_vram_gpu_cluster_sizer.html",
        "accent_color": "#10b981",
        "accent_glow": "rgba(16, 185, 129, 0.2)",
        "methodology": """
<h3>1. Memory Component Breakdown</h3>
<p>Total GPU cluster memory required ($M_{\\text{total}}$) is partitioned into three discrete pools:</p>
<pre><code>M_weights = (P_params * Bytes_per_param) / (10^9) GB
M_kv_cache = 2 * N_layers * N_heads * Dim_head * Bytes_per_param * Context_len * Batch_size
M_total = (M_weights + M_kv_cache + M_activations) * 1.20 (CUDA Headroom Factor)</code></pre>

<h3>2. Quantization Precision Standards</h3>
<ul>
  <li><strong>FP8 (E4M3 / E5M2):</strong> 1.0 byte per parameter. Default sovereign standard delivering 99.4% BF16 accuracy with 50% memory footprint and 2.1x throughput.</li>
  <li><strong>AWQ / INT4:</strong> 0.55 bytes per parameter (including scales and zero-points). High compression for edge inference.</li>
  <li><strong>BF16 (Uncompressed):</strong> 2.0 bytes per parameter. Required for precision-sensitive reasoning passes and fine-tuning.</li>
</ul>

<h3>3. Tensor Parallelism (TP) Topologies</h3>
<p>When $M_{\\text{weights}} > 80\\text{ GB}$, models must be sharded across multiple GPUs using high-bandwidth interconnects (NVLink 900 GB/s on H100):</p>
<ul>
  <li><strong>TP=2:</strong> 2x NVIDIA H100 SXM5 (160 GB aggregate VRAM).</li>
  <li><strong>TP=4:</strong> 4x NVIDIA H100 SXM5 (320 GB aggregate VRAM).</li>
  <li><strong>TP=8:</strong> 8x NVIDIA H100 SXM5 (640 GB aggregate VRAM, full HGX chassis).</li>
</ul>
"""
    },
    {
        "id": "tool_05",
        "slug": "b2b-seo-roi-payback-model",
        "embed_slug": "b2b-seo-roi-model",
        "short_title": "B2B Programmatic SEO ROI Model",
        "title": "B2B Programmatic SEO ROI & CAC Payback Model",
        "category": "Growth Engineering & Search",
        "tagline": "Model pipeline generated via programmatic BOFU pages vs traditional enterprise agency retainers.",
        "meta_description": "Calculate B2B programmatic SEO pipeline revenue, customer acquisition cost (CAC), and payback horizon. Model Edward Sturm economic sigmoid curves for BOFU search.",
        "answer_capsule": "The B2B Programmatic SEO ROI & CAC Payback Model simulates enterprise customer acquisition economics for bottom-of-funnel (BOFU) programmatic solution pages against traditional retainers. Based on Edward Sturm's economic sigmoid framework, it calculates monthly qualified enterprise demos, annualized pipeline creation, closed ARR, and payback velocity in days.",
        "calc_type": "b2b_roi",
        "source_calc_file": "b2b_seo_roi_payback_model.html",
        "accent_color": "#38bdf8",
        "accent_glow": "rgba(56, 189, 248, 0.2)",
        "methodology": """
<h3>1. The Edward Sturm Economic Sigmoid Framework</h3>
<p>Traditional SEO agencies focus on high-volume top-of-funnel (TOFU) informational keywords with negligible commercial intent (conversion rates &lt; 0.2%). The Programmatic BOFU model deploys thousands of highly specific long-tail operational queries with search intent directly correlated to procurement decisions:</p>
<pre><code>Monthly_Visits = N_pages * 35 (Avg long-tail monthly visits)
Monthly_Demos = Monthly_Visits * 3.5% (BOFU demo conversion rate)
Annual_Pipeline = (Monthly_Demos * 12) * Annual_Contract_Value
Closed_ARR = Annual_Pipeline * Sales_Win_Rate
Payback_Days = (Pilot_Sprint_Investment / (Closed_ARR / 12)) * 30</code></pre>

<h3>2. Empirical Conversion Multipliers</h3>
<ul>
  <li><strong>Informational Blog Post:</strong> 0.15% to 0.35% visitor-to-demo conversion rate ($1,250 blended CAC).</li>
  <li><strong>Compact Programmatic Solution Page:</strong> 3.2% to 4.8% visitor-to-demo conversion rate ($142 blended CAC).</li>
  <li><strong>Chrome Dwell Time Boost:</strong> Embedding interactive simulators elevates median page dwell past 240 seconds, generating Google May 2024 leaked algorithm <code>goodClick</code> signals that defend rankings permanently against core updates.</li>
</ul>
"""
    }
]

def generate_schema_json(tool: Dict[str, Any]) -> str:
    schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["WebApplication", "SoftwareApplication"],
                "@id": f"https://elesium.online/tools/{tool['slug']}/#app",
                "name": tool["title"],
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All modern web browsers (Chrome, Safari, Firefox, Edge)",
                "browserRequirements": "Requires JavaScript. HTML5 Canvas and CSS Grid compliant.",
                "url": f"https://elesium.online/tools/{tool['slug']}/",
                "description": tool["meta_description"],
                "softwareVersion": "2026.4.2",
                "isAccessibleForFree": True,
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                },
                "creator": {
                    "@type": "Corporation",
                    "@id": "https://elesium.online/#localbusiness-hq",
                    "name": "Elesium - Enterprise AI & Automation",
                    "url": "https://elesium.online"
                },
                "featureList": [
                    tool["answer_capsule"],
                    "Instant client-side calculation with zero data retention",
                    "Responsive iframe embed code with dynamic postMessage auto-resizing",
                    "Mathematical methodology and empirical benchmark documentation"
                ]
            },
            {
                "@type": "BreadcrumbList",
                "@id": f"https://elesium.online/tools/{tool['slug']}/#breadcrumb",
                "itemListElement": [
                    {
                        "@type": "ListItem",
                        "position": 1,
                        "name": "Home",
                        "item": "https://elesium.online/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 2,
                        "name": "Interactive Tools",
                        "item": "https://elesium.online/tools/"
                    },
                    {
                        "@type": "ListItem",
                        "position": 3,
                        "name": tool["short_title"],
                        "item": f"https://elesium.online/tools/{tool['slug']}/"
                    }
                ]
            }
        ]
    }
    return json.dumps(schema, indent=2)

def extract_widget_body_and_script(html_file: Path) -> tuple[str, str, str]:
    """Extracts CSS styles, widget container markup, and calculator JavaScript from the single-file source."""
    content = html_file.read_text(encoding="utf-8")
    
    # Extract style
    css = ""
    if "<style>" in content and "</style>" in content:
        css = content.split("<style>")[1].split("</style>")[0]
        
    # Extract widget
    widget_html = ""
    if '<div class="calculator-container" id="widget">' in content:
        start = content.index('<div class="calculator-container" id="widget">')
        # find matching closing div before <script>
        script_idx = content.index("<script>")
        widget_html = content[start:script_idx].strip()
        if widget_html.endswith("</div>"):
            pass
        else:
            # find last </div> before script
            end = content.rfind("</div>", start, script_idx) + 6
            widget_html = content[start:end].strip()

    # Extract script
    js = ""
    if "<script>" in content and "</script>" in content:
        js = content.split("<script>")[1].split("</script>")[0].strip()
        
    return css, widget_html, js

def render_embed_page(tool: Dict[str, Any], css: str, widget_html: str, js: str) -> str:
    """Generates the clean embeddable widget view (/embed/[slug]) with postMessage height emission."""
    schema_json = generate_schema_json(tool)
    
    # Ensure enhanced postMessage logic in JS
    enhanced_js = js
    if "RESIZE_EMBED" not in enhanced_js:
        enhanced_js += f"""
function emitEmbedHeight() {{
  if (window.parent && window.parent !== window) {{
    var h = document.getElementById('widget') ? document.getElementById('widget').offsetHeight + 48 : document.body.scrollHeight + 32;
    window.parent.postMessage({{ type: 'RESIZE_EMBED', height: h }}, '*');
    window.parent.postMessage({{ type: 'elesium-embed-resize', tool: '{tool['embed_slug']}', height: h }}, '*');
  }}
}}
window.addEventListener('load', emitEmbedHeight);
window.addEventListener('resize', emitEmbedHeight);
if (typeof MutationObserver !== 'undefined') {{
  var obs = new MutationObserver(emitEmbedHeight);
  obs.observe(document.body, {{ attributes: true, childList: true, subtree: true }});
}}
"""
    else:
        # ensure both events are emitted
        enhanced_js = enhanced_js.replace(
            "window.parent.postMessage({ type: 'RESIZE_EMBED', height: document.getElementById('widget').offsetHeight + 48 }, '*');",
            f"""window.parent.postMessage({{ type: 'RESIZE_EMBED', height: document.getElementById('widget').offsetHeight + 48 }}, '*');
    window.parent.postMessage({{ type: 'elesium-embed-resize', tool: '{tool['embed_slug']}', height: document.getElementById('widget').offsetHeight + 48 }}, '*');"""
        )

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Embed: {tool['title']} | Elesium</title>
  <meta name="description" content="{tool['meta_description']}">
  <meta name="robots" content="noindex, follow">
  <meta name="theme-color" content="#090d16">
  <link rel="canonical" href="https://elesium.online/tools/{tool['slug']}/">
  
  <script type="application/ld+json">
{schema_json}
  </script>

  <style>
{css}
    /* Embed Widget Overrides */
    body {{
      background: transparent !important;
      padding: 12px !important;
      min-height: auto !important;
      display: block !important;
    }}
    .calculator-container {{
      max-width: 100% !important;
      margin: 0 auto !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
    }}
  </style>
</head>
<body>

{widget_html}

<script>
{enhanced_js}

(function initAutoResizer() {{
  function sendHeight() {{
    var widget = document.getElementById('widget');
    var h = widget ? widget.offsetHeight + 40 : document.body.scrollHeight + 20;
    if (window.parent && window.parent !== window) {{
      window.parent.postMessage({{ type: 'RESIZE_EMBED', height: h }}, '*');
      window.parent.postMessage({{ type: 'elesium-embed-resize', tool: '{tool['embed_slug']}', height: h }}, '*');
    }}
  }}
  window.addEventListener('load', sendHeight);
  window.addEventListener('resize', sendHeight);
  if (typeof MutationObserver !== 'undefined') {{
    var observer = new MutationObserver(sendHeight);
    observer.observe(document.body, {{ attributes: true, childList: true, subtree: true }});
  }}
  setTimeout(sendHeight, 150);
  setTimeout(sendHeight, 500);
}})();
</script>

</body>
</html>"""

def render_standalone_page(tool: Dict[str, Any], css: str, widget_html: str, js: str) -> str:
    """Generates the full standalone page (/tools/[slug]) with navigation, Answer Capsule, Math, and Embed Modal."""
    schema_json = generate_schema_json(tool)
    
    # Related tools list
    related_items_html = ""
    for other in TOOLS_MANIFEST:
        if other["slug"] != tool["slug"]:
            related_items_html += f"""
        <a href="/tools/{other['slug']}/" class="related-tool-card">
          <div class="related-tag">{other['category']}</div>
          <div class="related-title">{other['short_title']}</div>
          <div class="related-desc">{other['meta_description'][:95]}...</div>
        </a>"""

    embed_snippet = f"""<!-- Elesium {tool['short_title']} Embed Widget -->
<div class="elesium-widget-wrapper" style="width:100%; max-width:820px; margin:24px auto;">
  <iframe 
    id="elesium-{tool['embed_slug']}-frame"
    src="https://elesium.online/embed/{tool['embed_slug']}" 
    width="100%" 
    height="650" 
    style="border:0; border-radius:16px; overflow:hidden; display:block; background:#090d16;" 
    loading="lazy"
    title="{tool['title']}">
  </iframe>
</div>
<script>
  window.addEventListener('message', function(e) {{
    if (e.data && (e.data.type === 'elesium-embed-resize' || e.data.type === 'RESIZE_EMBED')) {{
      var frame = document.getElementById('elesium-{tool['embed_slug']}-frame');
      if (frame && e.data.height) frame.style.height = e.data.height + 'px';
    }}
  }});
</script>"""
    embed_snippet_escaped = embed_snippet.replace("<", "&lt;").replace(">", "&gt;")

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{tool['title']} | Elesium</title>
  <meta name="description" content="{tool['meta_description']}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta name="theme-color" content="#020617">
  <link rel="canonical" href="https://elesium.online/tools/{tool['slug']}/">
  <link rel="alternate" hreflang="x-default" href="https://elesium.online/tools/{tool['slug']}/">
  <link rel="alternate" hreflang="en-in" href="https://elesium.online/tools/{tool['slug']}/">
  <link rel="alternate" hreflang="en-us" href="https://elesium.online/us/tools/{tool['slug']}/">
  <link rel="alternate" hreflang="en-gb" href="https://elesium.online/uk/tools/{tool['slug']}/">
  <link rel="alternate" hreflang="en-ae" href="https://elesium.online/ae/tools/{tool['slug']}/">
  
  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
{schema_json}
  </script>

  <style>
    /* Standalone Master Layout */
    :root {{
      --page-bg: #020617;
      --card-bg: #0b1120;
      --border-color: #1e293b;
      --text-main: #f8fafc;
      --text-dim: #94a3b8;
      --tool-accent: {tool['accent_color']};
      --tool-glow: {tool['accent_glow']};
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }}
    body {{ background-color: var(--page-bg); color: var(--text-main); min-height: 100vh; line-height: 1.6; }}
    
    /* Global Navigation */
    .site-nav {{
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
      position: sticky;
      top: 0;
      z-index: 40;
      padding: 14px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .nav-brand {{ font-weight: 800; font-size: 18px; letter-spacing: -0.5px; color: #fff; text-decoration: none; display: flex; align-items: center; gap: 8px; }}
    .nav-links {{ display: flex; gap: 20px; align-items: center; font-size: 13px; font-weight: 500; }}
    .nav-links a {{ color: var(--text-dim); text-decoration: none; transition: color 0.15s; }}
    .nav-links a:hover {{ color: #fff; }}
    .nav-cta {{ background: #10b981; color: #020617 !important; padding: 6px 14px; border-radius: 8px; font-weight: 700; }}
    
    /* Main Content Container */
    .main-wrap {{ max-width: 1040px; margin: 0 auto; padding: 36px 20px 80px; }}
    
    /* Breadcrumbs */
    .breadcrumbs {{ font-size: 12px; color: var(--text-dim); margin-bottom: 24px; display: flex; gap: 8px; align-items: center; }}
    .breadcrumbs a {{ color: var(--text-dim); text-decoration: none; }}
    .breadcrumbs a:hover {{ color: #fff; }}
    .breadcrumbs span.current {{ color: var(--tool-accent); font-weight: 600; }}
    
    /* Hero Header */
    .hero-header {{ display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; padding-bottom: 24px; border-bottom: 1px solid var(--border-color); margin-bottom: 32px; }}
    .hero-title-area {{ flex: 1; }}
    .category-badge {{ display: inline-block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: var(--tool-accent); background: rgba(6, 182, 212, 0.1); border: 1px solid var(--tool-accent); padding: 3px 10px; border-radius: 20px; margin-bottom: 12px; }}
    .hero-h1 {{ font-size: 28px; sm-font-size: 34px; font-weight: 800; color: #fff; letter-spacing: -0.8px; line-height: 1.25; margin-bottom: 12px; }}
    .hero-tagline {{ font-size: 14px; color: var(--text-dim); margin-bottom: 16px; }}
    
    /* 45-Word Answer Capsule */
    .answer-capsule {{
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(16, 185, 129, 0.35);
      border-radius: 12px;
      padding: 16px 20px;
      font-size: 13.5px;
      line-height: 1.6;
      color: #cbd5e1;
      margin-top: 14px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }}
    .answer-capsule strong {{ color: #34d399; font-weight: 700; }}
    
    /* Embed Button */
    .embed-trigger-btn {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #0f172a;
      border: 1px solid var(--border-color);
      color: #f1f5f9;
      font-size: 12.5px;
      font-weight: 600;
      padding: 10px 18px;
      border-radius: 10px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }}
    .embed-trigger-btn:hover {{ border-color: var(--tool-accent); transform: translateY(-1px); }}
    
    /* Calculator Canvas Mounting */
    .calculator-canvas {{ margin: 32px 0; display: flex; justify-content: center; }}
    
    /* Inner Calculator Overrides */
{css}
    .calculator-container {{
      width: 100% !important;
      max-width: 860px !important;
      background: var(--card-bg) !important;
      border: 1px solid var(--border-color) !important;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5) !important;
    }}

    /* Methodology Section */
    .methodology-box {{
      margin-top: 48px;
      padding-top: 36px;
      border-top: 1px solid var(--border-color);
    }}
    .methodology-box h2 {{ font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 20px; }}
    .methodology-content {{ font-size: 14px; color: #cbd5e1; line-height: 1.7; }}
    .methodology-content h3 {{ font-size: 16px; font-weight: 700; color: #f1f5f9; margin: 24px 0 10px; }}
    .methodology-content p {{ margin-bottom: 14px; }}
    .methodology-content ul {{ margin-bottom: 16px; padding-left: 20px; }}
    .methodology-content li {{ margin-bottom: 6px; }}
    .methodology-content pre {{
      background: #000;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 12.5px;
      color: #38bdf8;
      overflow-x: auto;
      margin: 16px 0;
    }}
    .methodology-content code {{ font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 12px; background: #1e293b; padding: 2px 6px; border-radius: 4px; color: #38bdf8; }}

    /* Related Tools Grid */
    .related-tools-section {{
      margin-top: 56px;
      padding-top: 36px;
      border-top: 1px solid var(--border-color);
    }}
    .related-tools-section h3 {{ font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 20px; }}
    .related-grid {{ display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }}
    @media(max-width: 680px) {{ .related-grid {{ grid-template-columns: 1fr; }} .hero-header {{ flex-direction: column; }} }}
    .related-tool-card {{
      background: #0b1120;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 18px;
      text-decoration: none;
      transition: all 0.2s;
    }}
    .related-tool-card:hover {{ border-color: var(--tool-accent); transform: translateY(-2px); }}
    .related-tag {{ font-size: 10.5px; font-weight: 700; color: var(--tool-accent); text-transform: uppercase; margin-bottom: 6px; }}
    .related-title {{ font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 6px; }}
    .related-desc {{ font-size: 12px; color: var(--text-dim); line-height: 1.5; }}

    /* Embed Modal */
    .modal-overlay {{
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(2, 6, 23, 0.85);
      backdrop-filter: blur(8px);
      z-index: 100;
      justify-content: center;
      align-items: center;
      padding: 16px;
    }}
    .modal-overlay.active {{ display: flex; }}
    .modal-card {{
      background: #0f172a;
      border: 1px solid var(--border-color);
      border-radius: 18px;
      max-width: 680px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.7);
    }}
    .modal-header {{ display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 14px; margin-bottom: 16px; }}
    .modal-header h3 {{ font-size: 17px; font-weight: 700; color: #fff; }}
    .modal-close-btn {{ background: none; border: none; color: var(--text-dim); font-size: 20px; cursor: pointer; }}
    .modal-close-btn:hover {{ color: #fff; }}
    .modal-desc {{ font-size: 13px; color: var(--text-dim); margin-bottom: 16px; }}
    .embed-code-box {{
      background: #020617;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 16px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 11.5px;
      color: #34d399;
      overflow-x: auto;
      max-height: 220px;
      margin-bottom: 16px;
      white-space: pre;
    }}
    .modal-actions {{ display: flex; justify-content: space-between; align-items: center; }}
    .copy-btn {{ background: #10b981; color: #020617; border: none; font-weight: 700; font-size: 12.5px; padding: 10px 20px; border-radius: 8px; cursor: pointer; }}
    .copy-btn:hover {{ background: #34d399; }}

    /* Footer */
    .site-footer {{ margin-top: 80px; border-top: 1px solid var(--border-color); padding: 32px 24px; text-align: center; font-size: 12px; color: var(--text-dim); }}
    .site-footer a {{ color: var(--text-dim); text-decoration: none; margin: 0 10px; }}
    .site-footer a:hover {{ color: #fff; }}
  </style>
</head>
<body>

  <!-- Site Navigation -->
  <header class="site-nav">
    <a href="/" class="nav-brand">
      <span style="color:#10b981;">⚡</span> ELESIUM
    </a>
    <nav class="nav-links">
      <a href="/solutions/">Solutions Fleet</a>
      <a href="/tools/" style="color:#fff; font-weight:700;">Interactive Tools</a>
      <a href="/commercial-directory.html">Directory</a>
      <a href="https://wa.me/918317329312" target="_blank" rel="noopener" class="nav-cta">WhatsApp Architect</a>
    </nav>
  </header>

  <main class="main-wrap">
    <!-- Breadcrumb Navigation -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <a href="/">Home</a> &rarr;
      <a href="/tools/">Interactive Tools</a> &rarr;
      <span class="current">{tool['short_title']}</span>
    </nav>

    <!-- Hero Header -->
    <div class="hero-header">
      <div class="hero-title-area">
        <span class="category-badge">{tool['category']}</span>
        <h1 class="hero-h1">{tool['title']}</h1>
        <p class="hero-tagline">{tool['tagline']}</p>
        
        <!-- Answer Capsule for Google SGE & AI Overviews -->
        <div class="answer-capsule">
          <strong>Answer Capsule: </strong>
          {tool['answer_capsule']}
        </div>
      </div>

      <!-- Embed Modal Trigger -->
      <button onclick="openModal()" class="embed-trigger-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--tool-accent);"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
        Embed on Your Site
      </button>
    </div>

    <!-- Live Interactive Calculator Canvas -->
    <div class="calculator-canvas">
      {widget_html}
    </div>

    <!-- Mathematical Methodology Section -->
    <section class="methodology-box">
      <h2>Mathematical Methodology & Benchmark Assumptions</h2>
      <div class="methodology-content">
        {tool['methodology']}
      </div>
    </section>

    <!-- Related Interactive Tools -->
    <section class="related-tools-section">
      <h3>Explore More Enterprise Micro-SaaS Simulators</h3>
      <div class="related-grid">
        {related_items_html}
      </div>
    </section>
  </main>

  <!-- Embed Modal -->
  <div id="embedModal" class="modal-overlay">
    <div class="modal-card">
      <div class="modal-header">
        <h3>Embed {tool['short_title']}</h3>
        <button onclick="closeModal()" class="modal-close-btn">&times;</button>
      </div>
      <p class="modal-desc">Copy and paste this responsive HTML iframe snippet directly into your blog, publication, or technical documentation. It dynamically auto-resizes with zero scrollbars.</p>
      <div class="embed-code-box" id="embedCodeText">{embed_snippet_escaped}</div>
      <div class="modal-actions">
        <span style="font-size:12px; color:var(--text-dim);">Zero API dependencies • DPDP & GDPR Safe</span>
        <button onclick="copyEmbedCode()" class="copy-btn" id="copyBtn">Copy Embed Code</button>
      </div>
    </div>
  </div>

  <footer class="site-footer">
    <p>© 2026 Elesium Enterprise AI Solutions. Sovereign Private VPC Intelligence.</p>
    <div style="margin-top: 8px;">
      <a href="/solutions/">Solutions</a>
      <a href="/tools/">Tools Fleet</a>
      <a href="/llms.txt">llms.txt</a>
      <a href="/robots.txt">robots.txt</a>
      <a href="/sitemap.xml">Sitemap</a>
    </div>
  </footer>

  <!-- Interactive Scripts -->
  <script>
{js}

    // Modal Handlers
    function openModal() {{
      document.getElementById('embedModal').classList.add('active');
    }}
    function closeModal() {{
      document.getElementById('embedModal').classList.remove('active');
    }}
    function copyEmbedCode() {{
      var raw = `{embed_snippet}`;
      navigator.clipboard.writeText(raw).then(function() {{
        var btn = document.getElementById('copyBtn');
        btn.innerText = 'Copied to Clipboard!';
        setTimeout(function() {{ btn.innerText = 'Copy Embed Code'; }}, 2500);
      }});
    }}
    window.addEventListener('click', function(e) {{
      var modal = document.getElementById('embedModal');
      if (e.target === modal) closeModal();
    }});
  </script>

</body>
</html>"""

def compress_file(file_path: Path):
    """Generates .gz and .br pre-compressed files alongside the source."""
    raw_data = file_path.read_bytes()
    
    # Gzip
    gz_path = file_path.with_name(file_path.name + ".gz")
    with gzip.open(gz_path, "wb", compresslevel=9) as f:
        f.write(raw_data)
        
    # Brotli
    if HAS_BROTLI:
        br_path = file_path.with_name(file_path.name + ".br")
        compressed_br = brotli.compress(raw_data, quality=11)
        br_path.write_bytes(compressed_br)

def update_sitemaps(manifest: List[Dict[str, Any]]):
    """Registers all 5 tools into sitemap-core.xml in public/ and dist/ with priority 0.9."""
    sitemap_targets = [
        FRONTEND_PUBLIC / "sitemap-core.xml",
        FRONTEND_DIST / "sitemap-core.xml"
    ]
    
    for sitemap_file in sitemap_targets:
        if not sitemap_file.exists():
            continue
        content = sitemap_file.read_text(encoding="utf-8")
        
        urls_to_add = []
        for tool in manifest:
            loc = f"https://elesium.online/tools/{tool['slug']}/"
            if loc not in content:
                urls_to_add.append(f"""  <url>
    <loc>{loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>""")
                
        if urls_to_add:
            insert_point = content.rfind("</urlset>")
            if insert_point != -1:
                new_content = content[:insert_point] + "\n".join(urls_to_add) + "\n" + content[insert_point:]
                sitemap_file.write_text(new_content, encoding="utf-8")
                print(f"  [+] Injected {len(urls_to_add)} tools into {sitemap_file.relative_to(ROOT_DIR)}")

def build_all():
    print("=" * 80)
    print("🚀 BUILDING PHASE 9: MICRO-SAAS LINK MAGNET & SIMULATOR FACTORY")
    print("=" * 80)

    # Ensure target directories exist
    public_embed_dir = FRONTEND_PUBLIC / "embed"
    public_tools_dir = FRONTEND_PUBLIC / "tools"
    dist_embed_dir = FRONTEND_DIST / "embed"
    dist_tools_dir = FRONTEND_DIST / "tools"
    
    for d in [public_embed_dir, public_tools_dir, dist_embed_dir, dist_tools_dir]:
        d.mkdir(parents=True, exist_ok=True)

    for tool in TOOLS_MANIFEST:
        source_file = PORTABLE_CALCS / tool["source_calc_file"]
        if not source_file.exists():
            print(f"  [-] Source file missing: {source_file}")
            continue

        css, widget_html, js = extract_widget_body_and_script(source_file)
        
        # 1. Render Embed Page
        embed_html = render_embed_page(tool, css, widget_html, js)
        
        # 2. Render Standalone Tool Page
        standalone_html = render_standalone_page(tool, css, widget_html, js)
        
        # Slugs to write for embed: canonical embed_slug and slug
        embed_slugs = [tool["embed_slug"], tool["slug"]]
        tool_slugs = [tool["slug"], tool["embed_slug"]]
        
        # Write to public/embed/
        for eslug in embed_slugs:
            # File variant: /embed/[slug].html
            f_html = public_embed_dir / f"{eslug}.html"
            f_html.write_text(embed_html, encoding="utf-8")
            
            # Directory variant: /embed/[slug]/index.html
            d_index = public_embed_dir / eslug / "index.html"
            d_index.parent.mkdir(parents=True, exist_ok=True)
            d_index.write_text(embed_html, encoding="utf-8")
            
            # Write to dist/embed/
            f_dist_html = dist_embed_dir / f"{eslug}.html"
            f_dist_html.write_text(embed_html, encoding="utf-8")
            compress_file(f_dist_html)
            
            d_dist_index = dist_embed_dir / eslug / "index.html"
            d_dist_index.parent.mkdir(parents=True, exist_ok=True)
            d_dist_index.write_text(embed_html, encoding="utf-8")
            compress_file(d_dist_index)

        # Write to public/tools/
        for tslug in tool_slugs:
            # File variant: /tools/[slug].html
            f_html = public_tools_dir / f"{tslug}.html"
            f_html.write_text(standalone_html, encoding="utf-8")
            
            # Directory variant: /tools/[slug]/index.html
            d_index = public_tools_dir / tslug / "index.html"
            d_index.parent.mkdir(parents=True, exist_ok=True)
            d_index.write_text(standalone_html, encoding="utf-8")
            
            # Write to dist/tools/
            f_dist_html = dist_tools_dir / f"{tslug}.html"
            f_dist_html.write_text(standalone_html, encoding="utf-8")
            compress_file(f_dist_html)
            
            d_dist_index = dist_tools_dir / tslug / "index.html"
            d_dist_index.parent.mkdir(parents=True, exist_ok=True)
            d_dist_index.write_text(standalone_html, encoding="utf-8")
            compress_file(d_dist_index)

        print(f"  [✓] Dual-Mounted: /tools/{tool['slug']} <--> /embed/{tool['embed_slug']}")

    # Update sitemaps
    update_sitemaps(TOOLS_MANIFEST)
    print("\n[SUCCESS] Phase 9 Micro-SaaS Link Magnet Factory deployment completed.")

if __name__ == "__main__":
    build_all()
