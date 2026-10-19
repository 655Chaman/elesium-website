/**
 * dpdpAuditSimulatorModel.ts
 * ============================================================================
 * Mathematical & Statutory Compliance Engine for DPDP Act 2023 Enterprise Audit.
 * 
 * Statutory Reference:
 * - Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023, Republic of India)
 * - Data Protection Board of India (DPBI) Statutory Penalty Schedule (Section 33)
 * - Maximum statutory fine: Up to ₹250 Crore ($28.5M USD) per security safeguard failure.
 * 
 * Evaluates:
 * 1. AI Inference Boundary (Public Cloud US vs MeitY-Empaneled Sovereign VPC)
 * 2. Sensitive Personal Data Handling (Aadhaar, PAN, Health, Financial, Biometrics)
 * 3. Ephemeral Memory vs Persistent Scratchpad Prompt Logging
 * 4. Automated PII Redaction & Cryptographic Audit Trails
 * 5. Mandatory DPBI Sub-6-Hour Breach Notification Readiness
 * ============================================================================
 */

export type InferenceBoundaryKey = 'public_us_cloud' | 'hybrid_cloud_proxy' | 'sovereign_local_vpc';
export type RecordVolumeTier = 'startup' | 'mid_market' | 'enterprise' | 'significant_data_fiduciary';
export type Currency = 'INR' | 'USD';

export interface PiiDataType {
  id: string;
  name: string;
  statutoryCategory: string;
  riskWeight: number; // 1.0 to 3.5
  description: string;
}

export interface InferenceBoundaryProfile {
  id: InferenceBoundaryKey;
  name: string;
  badge: string;
  crossBorderTransferRisk: boolean;
  meityEmpaneled: boolean;
  baseLiabilityMultiplier: number;
  description: string;
}

export interface SafeguardChecklist {
  automatedPiiRedaction: boolean; // Local Presidio / NER pre-filter
  ephemeralMemoryNoLogging: boolean; // Zero prompt logging / ephemeral RAM
  cryptographicAuditLedger: boolean; // Immutable state checkpointer
  sub6HourBreachDetection: boolean; // Automated anomaly detection & alert
  dataPrincipalRightsAutomation: boolean; // Automated erasure & access portal
}

export interface DpdpAuditInputs {
  recordVolume: number; // 10,000 to 10,000,000
  inferenceBoundary: InferenceBoundaryKey;
  selectedPiiTypes: string[]; // IDs of PiiDataType
  safeguards: SafeguardChecklist;
  isSignificantDataFiduciary: boolean; // Section 10 significant data fiduciary status
  currency: Currency;
}

export interface DpdpAuditResults {
  // Statutory Penalty Assessment
  statutoryMaxPenaltyINR: number; // In Crores (e.g. 250 Cr)
  statutoryMaxPenaltyUSD: number;
  estimatedLiabilityINR: number; // Modeled expected liability in Crores
  estimatedLiabilityUSD: number;
  sovereignRemediatedLiabilityINR: number;
  sovereignRemediatedLiabilityUSD: number;
  liabilityReductionPct: number;

  // Compliance Scoring & Rating
  overallComplianceScore: number; // 0 to 100
  complianceGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'Negligible' | 'Moderate' | 'High' | 'Severe Statutory Breach Risk';

  // Specific Statutory Vulnerabilities (DPBI Violation Vectors)
  breachProbabilityPct: number;
  unredactedPiiExposureRecords: number;
  primaryViolations: string[];
  remediationActionPlan: string[];

  // Formatting & Display
  currencySymbol: string;
  currency: Currency;
}

export const USD_TO_INR_RATE = 87.5;
export const CRORE = 10_000_000;

export const PII_DATA_TYPES: PiiDataType[] = [
  {
    id: 'aadhaar_pan',
    name: 'Aadhaar & PAN Numbers',
    statutoryCategory: 'National Identity Identifiers',
    riskWeight: 3.2,
    description: 'Statutory national biometric and financial identity numbers subject to strict masking laws.'
  },
  {
    id: 'financial_banking',
    name: 'Bank Account & Credit Records',
    statutoryCategory: 'Financial Data Principal Assets',
    riskWeight: 2.8,
    description: 'Bank transaction ledgers, account numbers, credit scores, and payment card histories.'
  },
  {
    id: 'health_medical',
    name: 'Health Records & Medical History',
    statutoryCategory: 'Health & Clinical Telemetry',
    riskWeight: 3.5,
    description: 'Clinical encounter notes, diagnostic summaries, prescriptions, and biometric data.'
  },
  {
    id: 'telemetry_location',
    name: 'Real-Time Telematics & Geolocation',
    statutoryCategory: 'Behavioral & Location Data',
    riskWeight: 1.8,
    description: 'Continuous GPS vehicle traces, IP geolocation logs, and mobility vectors.'
  },
  {
    id: 'minors_children',
    name: "Children's & Minor Data (<18 Yrs)",
    statutoryCategory: 'Section 9 Protected Class',
    riskWeight: 3.5,
    description: 'Direct parental consent required; strict prohibition on tracking, behavioral monitoring, or profiling.'
  }
];

export const INFERENCE_BOUNDARIES: Record<InferenceBoundaryKey, InferenceBoundaryProfile> = {
  public_us_cloud: {
    id: 'public_us_cloud',
    name: 'Public Multi-Tenant US Cloud (OpenAI / Anthropic / Gemini US)',
    badge: 'Statutory Violation Exposure',
    crossBorderTransferRisk: true,
    meityEmpaneled: false,
    baseLiabilityMultiplier: 1.0,
    description: 'Prompts, customer documents, and model outputs route to foreign servers outside India jurisdiction without sovereign MeitY empanelment.'
  },
  hybrid_cloud_proxy: {
    id: 'hybrid_cloud_proxy',
    name: 'Hybrid Proxy with Client-Side Regex Masking',
    badge: 'Moderate Residual Risk',
    crossBorderTransferRisk: true,
    meityEmpaneled: false,
    baseLiabilityMultiplier: 0.45,
    description: 'Basic keyword filters attempt to sanitize text before sending to public cloud APIs, failing on unstructured conversational nuances.'
  },
  sovereign_local_vpc: {
    id: 'sovereign_local_vpc',
    name: 'Elesium Sovereign Local VPC (MeitY-Empaneled Indian Cluster)',
    badge: 'Statutory Safe Harbor',
    crossBorderTransferRisk: false,
    meityEmpaneled: true,
    baseLiabilityMultiplier: 0.0,
    description: 'Air-gapped open-weight LLMs (vLLM / TensorRT-LLM) hosted in Mumbai/Delhi data centers with zero data egress and compile-time Pydantic boundaries.'
  }
};

/**
 * Calculates DPDP Act statutory penalty exposure, compliance grade, and remediation roadmap.
 */
export function calculateDpdpAudit(inputs: DpdpAuditInputs): DpdpAuditResults {
  const boundary = INFERENCE_BOUNDARIES[inputs.inferenceBoundary];
  const currencySymbol = inputs.currency === 'INR' ? '₹' : '$';

  // 1. Calculate PII Risk Vector
  let piiRiskFactor = 0.5;
  const activePii = PII_DATA_TYPES.filter(p => inputs.selectedPiiTypes.includes(p.id));
  for (const p of activePii) {
    piiRiskFactor += (p.riskWeight * 0.35);
  }

  // 2. Safeguard Deficiencies Score (0 to 1, where 1 is zero safeguards)
  let safeguardDeficiency = 1.0;
  if (inputs.safeguards.automatedPiiRedaction) safeguardDeficiency -= 0.25;
  if (inputs.safeguards.ephemeralMemoryNoLogging) safeguardDeficiency -= 0.25;
  if (inputs.safeguards.cryptographicAuditLedger) safeguardDeficiency -= 0.20;
  if (inputs.safeguards.sub6HourBreachDetection) safeguardDeficiency -= 0.15;
  if (inputs.safeguards.dataPrincipalRightsAutomation) safeguardDeficiency -= 0.15;
  safeguardDeficiency = Math.max(0.02, safeguardDeficiency);

  // 3. Significant Data Fiduciary Multiplier (Section 10 of DPDP Act)
  const sdfMultiplier = inputs.isSignificantDataFiduciary ? 1.4 : 1.0;

  // 4. Volume Escalation Factor (logarithmic scaling from 10k to 10M records)
  const volumeFactor = Math.min(2.5, Math.max(0.5, Math.log10(inputs.recordVolume) / 5.0));

  // 5. Statutory Maximum Penalties under DPDP Act Schedule (Section 33)
  // Max statutory fine: ₹250 Crore for security safeguards failure
  // Max statutory fine: ₹200 Crore for failure to notify DPBI of breach
  const statutoryMaxINR_Crore = 250.0;
  const statutoryMaxUSD = (statutoryMaxINR_Crore * CRORE) / USD_TO_INR_RATE;

  // 6. Modeled Estimated Liability (in ₹ Crores)
  let estimatedLiabilityINR_Crore = 0.0;
  if (boundary.id === 'sovereign_local_vpc') {
    // Sovereign VPC has 0 cross-border liability; only minor residual process gaps
    estimatedLiabilityINR_Crore = safeguardDeficiency * 4.5 * volumeFactor;
  } else {
    // Public Cloud or Hybrid Proxy subject to Section 33 penalties
    const rawLiability = statutoryMaxINR_Crore * boundary.baseLiabilityMultiplier * (safeguardDeficiency * 0.65 + piiRiskFactor * 0.35) * sdfMultiplier * volumeFactor;
    estimatedLiabilityINR_Crore = Math.min(statutoryMaxINR_Crore, Math.max(12.5, Math.round(rawLiability * 10) / 10));
  }

  const estimatedLiabilityUSD = (estimatedLiabilityINR_Crore * CRORE) / USD_TO_INR_RATE;

  // Sovereign Remediated Liability with Elesium Architecture
  const sovereignRemediatedLiabilityINR_Crore = Math.min(1.2, estimatedLiabilityINR_Crore * 0.04);
  const sovereignRemediatedLiabilityUSD = (sovereignRemediatedLiabilityINR_Crore * CRORE) / USD_TO_INR_RATE;

  const liabilityReductionPct = Math.round(
    ((estimatedLiabilityINR_Crore - sovereignRemediatedLiabilityINR_Crore) / Math.max(0.1, estimatedLiabilityINR_Crore)) * 100
  );

  // 7. Overall Compliance Score (0 to 100)
  let complianceScore = 100;
  if (boundary.crossBorderTransferRisk) complianceScore -= 35;
  if (!boundary.meityEmpaneled) complianceScore -= 15;
  complianceScore -= Math.round(safeguardDeficiency * 40);
  complianceScore = Math.max(8, Math.min(99, complianceScore));

  // In sovereign VPC with full safeguards, score reaches 98-99
  if (boundary.id === 'sovereign_local_vpc' && safeguardDeficiency <= 0.1) {
    complianceScore = 98;
  }

  // Compliance Grade
  let complianceGrade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let riskLevel: 'Negligible' | 'Moderate' | 'High' | 'Severe Statutory Breach Risk' = 'Severe Statutory Breach Risk';

  if (complianceScore >= 95) {
    complianceGrade = 'A+';
    riskLevel = 'Negligible';
  } else if (complianceScore >= 85) {
    complianceGrade = 'A';
    riskLevel = 'Negligible';
  } else if (complianceScore >= 70) {
    complianceGrade = 'B';
    riskLevel = 'Moderate';
  } else if (complianceScore >= 50) {
    complianceGrade = 'C';
    riskLevel = 'Moderate';
  } else if (complianceScore >= 35) {
    complianceGrade = 'D';
    riskLevel = 'High';
  } else {
    complianceGrade = 'F';
    riskLevel = 'Severe Statutory Breach Risk';
  }

  // 8. Specific DPBI Violation Vectors
  const primaryViolations: string[] = [];
  const remediationActionPlan: string[] = [];

  if (boundary.crossBorderTransferRisk) {
    primaryViolations.push(
      "Section 16 Violation: Unregulated Cross-Border Personal Data Egress to Non-Empaneled US Multi-Tenant Cloud APIs without Sovereign Data Enclave guarantees."
    );
    remediationActionPlan.push(
      "Migrate model inference pipelines to an air-gapped sovereign VPC deployed in MeitY-empaneled Indian data centers (AWS Mumbai / GCP Delhi / CtrlS)."
    );
  }

  if (!inputs.safeguards.automatedPiiRedaction) {
    primaryViolations.push(
      "Section 8(5) Violation: Failure to take reasonable security safeguards. Unstructured prompts contain raw Aadhaar, PAN, and banking identifiers."
    );
    remediationActionPlan.push(
      "Deploy sub-10ms localized transformer NER redaction filters prior to model dispatch, replacing direct customer PII with synthetic session tokens."
    );
  }

  if (!inputs.safeguards.ephemeralMemoryNoLogging) {
    primaryViolations.push(
      "Section 8(7) & Section 12 Violation: Non-ephemeral prompt logging. Cloud inference providers retain scratchpad tokens in training or debug caches."
    );
    remediationActionPlan.push(
      "Enforce volatile-memory-only inference state machines that zero-out prompt context buffers immediately following response emission."
    );
  }

  if (!inputs.safeguards.cryptographicAuditLedger) {
    primaryViolations.push(
      "Section 6 & Section 8(4) Violation: Inability to prove consent trail and deterministic agentic state transitions during a Data Protection Board audit."
    );
    remediationActionPlan.push(
      "Implement append-only PostgreSQL cryptographic state checkpointers recording tamper-evident logs for every agentic action."
    );
  }

  if (!inputs.safeguards.sub6HourBreachDetection) {
    primaryViolations.push(
      "Section 8(6) Statutory Breach Notice Risk: Absence of automated anomaly telemetry capable of meeting the mandatory sub-6-hour DPBI breach reporting timeline."
    );
    remediationActionPlan.push(
      "Configure eBPF network telemetry anomaly detectors triggering automated incident dispatch to the Chief Information Security Officer."
    );
  }

  const breachProbabilityPct = Math.round(
    Math.min(94, Math.max(4, (100 - complianceScore) * 0.95))
  );

  const unredactedPiiExposureRecords = Math.round(
    inputs.recordVolume * (inputs.safeguards.automatedPiiRedaction ? 0.005 : 0.42)
  );

  return {
    statutoryMaxPenaltyINR: statutoryMaxINR_Crore,
    statutoryMaxPenaltyUSD: statutoryMaxUSD,
    estimatedLiabilityINR: estimatedLiabilityINR_Crore,
    estimatedLiabilityUSD,
    sovereignRemediatedLiabilityINR: sovereignRemediatedLiabilityINR_Crore,
    sovereignRemediatedLiabilityUSD,
    liabilityReductionPct,
    overallComplianceScore: complianceScore,
    complianceGrade,
    riskLevel,
    breachProbabilityPct,
    unredactedPiiExposureRecords,
    primaryViolations,
    remediationActionPlan,
    currencySymbol,
    currency: inputs.currency
  };
}

export function formatCrore(valInCrore: number, currency: Currency): string {
  if (currency === 'INR') {
    return `₹${valInCrore.toFixed(1)} Cr`;
  }
  const usdMillions = (valInCrore * CRORE) / (USD_TO_INR_RATE * 1_000_000);
  return `$${usdMillions.toFixed(1)}M`;
}

export function formatNumber(val: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0
  }).format(Math.round(val));
}

export function formatCompactNumber(val: number): string {
  if (val >= 1_000_000_000) {
    return `${(val / 1_000_000_000).toFixed(1)}B`;
  }
  if (val >= 1_000_000) {
    return `${(val / 1_000_000).toFixed(1)}M`;
  }
  if (val >= 1_000) {
    return `${(val / 1_000).toFixed(0)}k`;
  }
  return val.toString();
}
