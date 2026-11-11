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
  "100b-parameter-autonomous-fraud-detection-agent-swarms-for-payment-gateways",
  "100b-parameter-medical-imaging-multimodal-agent-deployment-architectures",
  "1f1b-bubble-reduction-sla-compliance-monitors-for-sovereign-private-banking-in-india",
  "1f1b-micro-batching-coordinators-for-hospital-clinical-triage-copilots",
  "aadhaar-e-kyc-and-pan-verification-fraud-defense-telemetry-for-digital-lending-platforms",
  "abdm-m3-health-information-user-consent-artifact-decryption-telemetry-for-clinical-diagnostic-centers",
  "air-gapped-contract-intelligence-agents-for-mumbai-real-estate-firms-with-automated-title-search-parsing",
  "air-gapped-deepseek-r1-enterprise-deployment-telemetry-for-global-capability-centers-in-bangalore",
  "air-gapped-defense-ministry-dualpipe-inference-infrastructure-deployment-consultants",
  "air-gapped-local-vllm-invoice-processing-pipeline-with-tally-prime-xml-socket-integration",
  "air-gapped-private-cloud-flashdecoding-deployment-runbooks-for-defense-installations-in-india",
  "air-gapped-purdue-model-level-2-scada-isolation-telemetry-for-pharmaceutical-cleanroom-facilities",
  "air-gapped-sovereign-pre-fill-and-decode-enclave-architects-for-defense-ministries",
  "attention-sink-stability-evaluators-for-sovereign-private-vpc-defense-intelligences",
  "automated-corporate-credit-card-expense-report-reconciliation-agents-with-tally-prime-in-gurgaon",
  "automated-e-way-bill-generation-agents-integrated-with-tally-prime-for-logistics-dispatchers",
  "automated-gstr-9-annual-return-reconciliation-agents-matching-tally-ledgers-with-gstn-portal",
  "automated-irn-e-invoice-json-generation-and-qr-code-embedding-agents-for-tally-erp-in-bangalore",
  "automated-lut-letter-of-undertaking-export-invoice-filing-agents-integrated-with-tally-prime",
  "automated-medical-peer-review-and-mortality-committee-dossier-preparation-telemetry-for-hospital-governance",
  "automated-nic-e-way-bill-portal-generation-agents-from-tally-prime-delivery-challans-in-delhi",
  "automotive-paint-shop-surface-defect-inspection-agents-for-assembly-plants",
  "awq-quantized-deepseek-r1-reasoning-model-deployment-agents-for-air-gapped-defense-servers",
  "b2b-e-way-bill-qr-code-cryptographic-signature-verification-latency-telemetry-for-logistics-clearing-agents",
  "bilingual-vernacular-invoice-ocr-agents-for-tally-prime-automated-voucher-entry",
  "chunked-sequence-attention-weight-partitioners-for-hospital-clinical-ehr-copilots",
  "column-linear-attention-weight-partitioners-for-hospital-clinical-triage-copilots",
  "continuous-telemetry-anomaly-detection-agents-for-semiconductor-fabrication-cleanrooms",
  "cross-border-remittance-settlement-agents-bridging-upi-and-rbi-cbdc-digital-rupee",
  "cross-border-sez-supply-zero-rated-invoice-verification-agents-in-tally-for-it-parks-in-hyderabad",
  "deterministic-automated-loan-underwriting-unified-deepseek-agents-for-fintech-ctos",
  "disaggregated-prefill-decode-schedulers-for-hospital-clinical-triage-copilots",
  "dpdp-act-statutory-audit-trail-kv-cache-generators-for-fintech-underwriting",
  "dynamic-branch-pruning-controllers-for-industrial-scada-predictive-maintenance",
  "e-invoice-irn-and-qr-code-generation-agents-for-tally-prime-billing-departments",
  "electronic-city-edge-iot-scada-and-sap-erp-synchronization-telemetry-for-manufacturing-enterprises",
  "electronic-city-phase-1-factory-line-machine-vision-defect-classification-telemetry-for-smt-assembly",
  "electronic-health-record-cryptographic-de-identification-and-re-identification-defense-telemetry-for-clinical-registries",
  "enterprise-sovereign-kv-cache-compression-deployment-advisors-for-defense-ministries",
  "fp8-inference-acceleration-agents-for-tally-erp-port-9000-xml-invoice-parsing-in-india",
  "gaussian-mechanism-noise-multiplier-sigma-calibration-telemetry-for-electronic-health-record-ehr-embeddings",
  "gstr-1-sales-return-auto-compilation-agents-from-tally-prime-sales-ledgers-in-chennai",
  "hospital-biomedical-equipment-preventive-maintenance-and-uptime-sla-telemetry-for-clinical-engineering",
  "hospital-inpatient-discharge-turnaround-acceleration-and-pharmacy-reconciliation-telemetry-for-private-clinics",
  "hospital-pharmacy-cold-chain-temperature-sensor-and-insulin-integrity-telemetry-for-hospital-pharmacists",
  "hospital-zero-trust-network-microsegmentation-and-medical-device-iot-defense-telemetry-for-biomedical-engineering",
  "icd-10-cm-automated-diagnostic-coding-and-clinical-discrepancy-telemetry-for-medical-billing-controllers",
  "immutable-system-prompt-kv-page-locking-frameworks-for-sovereign-defense-contractors",
  "indian-customs-icegate-automated-bill-of-entry-tariff-reconciliation-telemetry-for-freight-forwarders",
  "industrial-iot-mtls-1-3-encrypted-gateway-agents-for-defense-manufacturing-facilities",
  "interleaved-1f1b-stage-communication-overlap-monitors-for-scada-manufacturing",
  "interstate-e-way-bill-validity-auto-renewal-telemetry-for-national-logistics-transport-carriers",
  "medical-ai-diagnostic-model-drift-and-clinical-ground-truth-calibration-telemetry-for-clinical-pathology",
  "mixture-of-depths-stability-evaluators-for-sovereign-private-vpc-defense-intelligences",
  "ml-kem-1024-military-grade-key-encapsulation-telemetry-for-sovereign-defense-ai-swarms",
  "mla-latent-memory-pool-defragmentation-managers-for-sovereign-air-gapped-defense-enclaves",
  "modbus-tcp-binary-packet-parsing-agents-for-automotive-assembly-line-directors",
  "multi-agent-prefix-tree-partitioning-software-for-sovereign-cloud-air-gapped-servers",
  "multi-lora-adapter-stability-evaluators-for-sovereign-private-vpc-defense-intelligences",
  "multi-tiered-kv-memory-fragmentation-monitors-for-sovereign-air-gapped-defense-enclaves",
  "n8n-banking-loan-eligibility-webhook-processing-latency-telemetry-for-private-nbfcs-in-mumbai",
  "nvlink-all-reduce-latency-optimizers-for-automotive-factory-quality-inspection",
  "nvlink-expert-dispatch-latency-optimizers-for-automotive-assembly-robotic-arms",
  "nvlink-ring-attention-bandwidth-saturation-controllers-for-sovereign-banking-fraud-forensics",
  "on-premise-llama-3-fine-tuning-and-sovereign-inference-telemetry-for-hyderabad-pharmaceutical-r-and-d",
  "optical-character-recognition-ocr-degradation-handling-for-thermal-print-transport-bills-and-warehouse-receipts",
  "p2p-nvlink-cross-instance-kv-cache-bridges-for-automotive-factory-quality-audits",
  "paged-attention-virtual-memory-allocation-and-page-table-swap-telemetry-for-sovereign-air-gapped-datacenters",
  "pharmaceutical-cold-chain-vaccine-warehouse-multi-point-iot-temperature-telemetry-for-logistics-hubs",
  "pharmaceutical-sterile-injectable-cleanroom-particle-counter-telemetry-for-aseptic-manufacturing-suites",
  "pharmacovigilance-adverse-event-triage-state-machines-for-clinical-safety-leads",
  "prefill-decode-workload-partitioning-tools-for-sovereign-defense-intelligence-swarms",
  "private-hospital-statutory-clinical-establishment-act-registration-renewal-telemetry-for-legal-fiduciaries",
  "private-vpc-air-gapped-clinical-llm-deployment-telemetry-for-hospital-trusts",
  "private-vpc-compliance-monitoring-bots-for-chennai-nbfcs-with-automated-rbi-audit-reporting",
  "quick-commerce-sub-10-minute-dispatch-queue-telemetry-for-urban-micro-fulfillment-hubs",
  "raw-material-batch-traceability-barcode-scan-validation-agents-for-automotive-tier-1-audits-in-chennai",
  "rbi-cyber-security-framework-categorized-air-gapped-core-banking-hsm-telemetry-for-payment-processors",
  "rbi-cyber-security-framework-compliant-mla-latent-memory-isolation-auditors",
  "rbi-cyber-security-framework-compliant-state-disaster-recovery-engines-for-banks",
  "rbi-cyber-security-framework-immutable-merkle-audit-trail-telemetry-for-scheduled-commercial-banks",
  "rbi-it-governance-master-direction-automated-compliance-scoring-telemetry-for-tier-1-nbfcs",
  "sap-s4hana-manufacturing-work-order-auto-confirmation-agents-based-on-shopfloor-plc-counts-in-india",
  "sovereign-enterprise-speculative-decoding-deployment-advisors-for-defense-ministries",
  "sovereign-financial-underwriting-chatbots-for-pune-microfinance-institutions-with-vernacular-voice-support",
  "sovereign-internal-enterprise-search-agents-for-delhi-public-sector-banks-with-rbi-data-localization",
  "sovereign-multi-agent-order-state-machine-telemetry-for-automotive-manufacturing-just-in-time-lines",
  "sovereign-on-premise-deepseek-v3-clusters-for-healthcare-hipaa-and-disha-compliance",
  "speculative-tree-lookahead-depth-optimizers-for-automotive-factory-quality-audits",
  "static-prefix-sink-reservation-daemons-for-air-gapped-sovereign-defense-enclaves",
  "sub-10ms-edge-protocol-translation-agents-for-industrial-manufacturing-engineers",
  "sub-8ms-multimodal-vision-fp8-inference-controllers-for-scada-manufacturing",
  "tally-bill-of-materials-bom-manufacturing-journal-auto-generation-from-mes-plc-telemetry",
  "tally-erp-9-tdl-port-9000-socket-communication-telemetry-for-logistics-freight-billing",
  "tally-journal-voucher-automated-foreign-exchange-fluctuation-adjustment-agents-in-mumbai",
  "three-way-invoice-purchase-order-goods-receipt-po-grn-matching-tolerance-telemetry-for-enterprise-sap",
  "true-random-number-generator-trng-continuous-entropy-health-monitoring-telemetry-for-sovereign-crypto-enclaves",
  "upi-merchant-chargeback-dispute-arbitration-autonomous-agents-for-mumbai-payment-aggregators",
  "vllm-custom-paged-attention-kernel-deployment-agents-for-air-gapped-banking-vpcs-in-india",
  "zero-memory-leak-streaming-agent-architectures-for-mission-critical-aerospace-avionics"
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
        return new Response(request.method === "HEAD" ? null : HTML_410_BODY, {
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
