/**
 * Cloudflare Worker: HTTP 410 Gone Edge Interceptor for Elesium
 * 
 * Enforces real HTTP 410 Gone status code over the wire for all 3,665+ pruned
 * programmatic solution doorway pages, returning X-Robots-Tag: noindex, follow.
 * Passes through all 100 retained enterprise architectures and static site assets.
 * 
 * Route binding: elesium.online/solutions/*
 */

// Set of 100 curated enterprise solution slugs retained in production
const RETAINED_SLUGS = new Set([
  "3d-parallelism-inference-optimization-for-moe-models-in-aerospace-telemetry",
  "agentic-threat-detection-and-automated-incident-response-for-fintech-infrastructure",
  "air-gapped-local-vllm-invoice-processing-pipeline-with-tally-prime-xml-socket-integration",
  "ai-powered-lead-routing-and-intent-classification-for-b2b-enterprises",
  "automated-clinical-trial-patient-matching-and-eligibility-screening-agents",
  "automated-dpo-preference-dataset-curation-pipeline-for-enterprise-domain-adaptation",
  "automated-gstin-reconciliation-and-gstr-2b-itc-audit-engine-for-indian-enterprises",
  "automated-multi-modal-defect-detection-and-quality-control-agents-for-high-speed-electronics-smt",
  "automated-regulatory-filing-and-disclosure-extraction-agents-for-sebi-regulated-entities",
  "automated-safety-stock-and-reorder-point-optimization-for-high-velocity-skus",
  "automated-tds-tcs-withholding-tax-computation-telemetry-for-pan-india-procurement-flows",
  "autonomous-contract-review-and-redlining-agents-for-enterprise-legal-departments",
  "autonomous-dispatch-software-for-freight-carriers",
  "b2b-e-way-bill-qr-code-cryptographic-signature-verification-latency-telemetry-for-logistics-clearing-agents",
  "b2b-revenue-attribution-and-multi-touch-marketing-mix-modeling-agents",
  "bilingual-english-hindi-speech-to-text-and-sentiment-analysis-agents-for-bpo-qa-operations",
  "cdsco-sugam-regulatory-document-validation-and-audit-readiness-engine",
  "computer-vision-based-worker-safety-and-ppe-compliance-telemetry-for-heavy-manufacturing",
  "continuous-automated-vulnerability-assessment-and-penetration-testing-agents",
  "deterministic-multi-agent-orchestrator-for-high-throughput-b2b-order-management",
  "differential-privacy-preserving-synthetic-data-generation-for-bfsi-model-training",
  "distributed-kv-cache-offloading-to-cxl-memory-for-ultra-long-context-retrieval",
  "dpdp-act-2023-statutory-consent-architecture-for-indian-fintechs",
  "dualpipe-bidirectional-pipeline-parallelism-for-overlapping-forward-backward-computation",
  "e-commerce-dynamic-pricing-and-markdown-optimization-agents-for-multi-brand-retailers",
  "energy-consumption-anomaly-detection-and-peak-demand-forecasting-for-process-industries",
  "enterprise-agentic-workflow-engine-for-sap-s4hana-procure-to-pay-cycles",
  "enterprise-rag-evaluation-harness-with-synthetic-adversarial-test-generation",
  "enterprise-search-and-neural-retrieval-over-air-gapped-confluence-and-sharepoint",
  "fp8-e4m3-mixed-precision-quantization-pipeline-for-large-scale-enterprise-inference",
  "gpu-accelerated-tabular-data-processing-pipeline-for-real-time-fraud-detection",
  "hardware-security-module-hsm-integrated-key-management-for-confidential-ai-inference",
  "high-accuracy-entity-extraction-and-table-parsing-from-semi-structured-financial-pdfs",
  "hospital-biomedical-equipment-preventive-maintenance-and-uptime-sla-telemetry-for-clinical-engineering",
  "hybrid-search-engine-combining-dense-vector-and-sparse-splade-retrieval-for-legal-discovery",
  "indian-customs-icegate-automated-bill-of-entry-tariff-reconciliation-telemetry-for-freight-forwarders",
  "interstate-e-way-bill-validity-auto-renewal-telemetry-for-national-logistics-transport-carriers",
  "iot-sensor-telemetry-ingestion-and-anomaly-detection-at-the-edge-for-mining-equipment",
  "kv-cache-compression-via-dynamic-token-pruning-and-head-clustering",
  "latency-optimized-speculative-decoding-with-draft-model-routing-for-financial-summaries",
  "llm-prompt-firewall-and-jailbreak-interception-enclave-for-public-facing-chatbots",
  "lossless-kv-cache-eviction-policy-based-on-attention-sink-and-heavy-hitter-tokens",
  "multi-agent-claims-adjudication-and-fraud-detection-engine-for-general-insurance",
  "multi-agent-negotiation-system-for-b2b-spot-freight-procurement",
  "multi-gpu-lora-fine-tuning-pipeline-with-automated-validation-gates",
  "multi-modal-medical-image-and-clinical-note-summarization-agents-for-radiology-workflows",
  "multi-tier-semantic-caching-for-enterprise-llm-apis-reducing-token-costs",
  "on-premise-deepseek-r1-reasoning-enclave-for-sensitive-rd-laboratories",
  "optical-character-recognition-ocr-degradation-handling-for-thermal-print-transport-bills-and-warehouse-receipts",
  "pharmaceutical-cold-chain-vaccine-warehouse-multi-point-iot-temperature-telemetry-for-logistics-hubs",
  "predictive-maintenance-and-vibration-analysis-for-high-criticality-rotating-machinery",
  "quick-commerce-sub-10-minute-dispatch-queue-telemetry-for-urban-micro-fulfillment-hubs",
  "rbi-cyber-security-framework-compliant-mla-latent-memory-isolation-auditors",
  "real-time-voice-ai-agent-with-sub-300ms-turn-taking-for-inbound-banking-telephony",
  "retrieval-augmented-generation-rag-pipeline-over-10m-sec-and-rbi-regulatory-filings",
  "secure-multi-party-computation-smpc-for-cross-bank-anti-money-laundering-aml-collaboration",
  "self-healing-canary-deployments-with-automated-rollback-for-llm-application-swarms",
  "semantic-router-and-guardrails-engine-for-high-concurrency-customer-support-agents",
  "serverless-vllm-deployment-with-dynamic-batching-and-speculative-decoding-on-kubernetes",
  "sovereign-on-premise-deepseek-v3-clusters-for-healthcare-hipaa-and-disha-compliance",
  "tally-erp-9-tdl-port-9000-socket-communication-telemetry-for-logistics-freight-billing",
  "three-way-invoice-purchase-order-goods-receipt-po-grn-matching-tolerance-telemetry-for-enterprise-sap",
  "token-budget-optimizer-and-prompt-compression-engine-for-high-volume-rag-workloads",
  "ultra-low-latency-fp8-vllm-serving-infrastructure-for-algorithmic-trading-firms",
  "us-fda-21-cfr-part-11-compliant-audit-trail-and-electronic-signature-agents-for-pharma-qc",
  "vector-database-benchmark-and-sharding-simulator-for-billion-scale-embeddings",
  "vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india"
]);

const HTML_410_BODY = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="robots" content="noindex, follow">
  <meta name="googlebot" content="noindex, follow">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>410 Gone | Content Retired | Elesium</title>
  <style>
    :root { color-scheme: dark; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #030712;
      color: #f9fafb;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      max-width: 48rem;
      text-align: center;
      padding: 3rem 2rem;
      border-radius: 1rem;
      background: rgba(17, 24, 39, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(12px);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
      margin-bottom: 1.5rem;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin: 0 0 1rem;
      color: #f9fafb;
    }
    p {
      color: #9ca3af;
      font-size: 1.125rem;
      line-height: 1.625;
      margin: 0 0 2rem;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 1rem;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      background: #2563eb;
      color: #fff;
      font-weight: 500;
      text-decoration: none;
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      background: rgba(255, 255, 255, 0.05);
      color: #f9fafb;
      border: 1px solid rgba(255, 255, 255, 0.1);
      font-weight: 500;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP 410 &bull; Content Retired</div>
    <h1>410 Gone</h1>
    <p>
      This programmatic specification has been permanently retired under Elesium's
      Algorithmic Quality &amp; Enterprise Architecture Curation mandate.
      The requested resource is no longer indexed or served.
    </p>
    <div class="actions">
      <a href="/solutions/" class="btn-primary">Explore 100 Enterprise Architectures &rarr;</a>
      <a href="/" class="btn-secondary">Return Home</a>
    </div>
  </div>
</body>
</html>`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Only inspect /solutions/ paths
    if (url.pathname.startsWith("/solutions/")) {
      const parts = url.pathname.replace(/^\/solutions\/?/, "").split("/").filter(Boolean);
      
      // If path is root /solutions/ or category hubs /solutions/category/*, pass through to origin
      if (parts.length === 0 || parts[0] === "category") {
        return fetch(request);
      }

      const slug = parts[0].replace(/\.html$/, "");

      // If the slug is NOT in the 100 curated retained solutions, emit true HTTP 410 Gone
      if (!RETAINED_SLUGS.has(slug)) {
        return new Response(HTML_410_BODY, {
          status: 410,
          statusText: "Gone",
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "X-Robots-Tag": "noindex, follow",
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
            "X-Content-Status": "410-Permanently-Retired"
          }
        });
      }
    }

    // Pass through all other requests to GitHub Pages origin
    return fetch(request);
  }
};
